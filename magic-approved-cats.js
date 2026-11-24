'use strict';
/* Cztery zaakceptowane kotki. Używamy wprost tablic kolorów, nigdy obrazka z nałożoną kratką. */
const MagicApprovedCats=(()=>{
 const source=MagicCatPatternsData;
 const counts='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
 const sizes=Object.freeze({easy:[16,16],medium:[24,24],hard:[32,40],expert:[40,56]});
 const palette=source.palette, hashes=source.hashes;
 function unpack(text){
  return text.split('/').map(row=>{
   let out='';
   for(let i=0;i<row.length;i+=2){
    const n=counts.indexOf(row[i]);
    if(n<1||i+1>=row.length)throw Error('Niepoprawne dane kotka');
    out+=row[i+1].repeat(n);
   }
   return out;
  });
 }
 const originals=Object.fromEntries(Object.entries(source.packed).map(([level,p])=>[level,Object.freeze(unpack(p))]));
 for(const [level,rows] of Object.entries(originals)){
  const [w,h]=sizes[level];
  if(rows.length!==h||rows.some(row=>row.length!==w||[...row].some(c=>c!=='.'&&!Object.hasOwn(palette,c))))throw Error('Niepoprawne kratki: '+level);
  let check=2166136261;
  for(const c of rows.join('/'))check=Math.imul(check^c.charCodeAt(0),16777619)>>>0;
  if(check!==hashes[level])throw Error('Zmieniono zatwierdzony wzór '+level);
 }
 const colors={
  easy:{ink:'α',face:'.',fur:'β',pink:'γ',gold:'β'},
  medium:{ink:'δ',face:'ζ',fur:'ε',pink:'η',gold:'θ'},
  hard:{ink:'κ',face:'ν',fur:'λ',pink:'ξ',gold:'ο'},
  expert:{ink:'π',face:'σ',fur:'ρ',pink:'τ',gold:'υ'}
 };

 // Strefy edycji są przypisane do konkretnego kota, nie do przypadkowych współrzędnych.
 // Głowa i oczy pozostają na tych samych miejscach przy każdej zmianie przycisku.
 const landmarks={
  easy:{eyes:[[3,6,8,9],[9,12,8,9]],mouth:[7,8,11,12],ear:[11,4],crown:[8,2],neck:[8,13],
    scene:[[1,1],[14,1]]},
  medium:{eyes:[[7,10,9,11],[14,17,9,11]],mouth:[11,13,12,15],ear:[18,4],crown:[12,3],neck:[12,16],
    scene:[[2,7],[22,4]]},
  hard:{eyes:[[11,14,15,19],[19,22,15,19]],mouth:[14,18,20,23],ear:[23,7],crown:[16,8],neck:[16,26],
    scene:[[2,12],[30,13],[3,30]]},
  expert:{eyes:[[13,18,28,33],[22,27,28,33]],mouth:[18,22,34,38],ear:[29,22],crown:[24,10],neck:[20,40],
    scene:[[35,8],[4,12],[35,18],[36,29],[5,42]]}
 };
 // Tło jest osobną warstwą. Te współrzędne to gwiazdki/kwiatki starej ilustracji.
 // Przy "Bez tła" w obrazku NIE MA ŻADNEGO z tych elementów.
 const bakedDecorations={
  easy:[],
  medium:[{cx:22,cy:4,id:'η'},{cx:2,cy:7,id:'θ'}],
  hard:[{cx:2,cy:12,id:'ο'},{cx:30,cy:13,id:'ξ'},{cx:3,cy:30,id:'ο'}],
  expert:[{cx:35,cy:8,id:'υ'},{cx:4,cy:12,id:'υ'},
          {cx:34,cy:18,id:'υ'},{cx:36,cy:29,id:'υ'},{cx:5,cy:42,id:'τ'}]
 };
 const base=Object.fromEntries(Object.entries(originals).map(([lvl,rows])=>{
  const grid=rows.map(row=>[...row]);
  for(const {cx,cy,id} of bakedDecorations[lvl]){
   // Odwracamy jedynie krzyżyk dekoracji (5 pól), bez modyfikacji sylwetki.
   for(const [dx,dy] of [[0,0],[0,-1],[-1,0],[1,0],[0,1]]){
    const x=cx+dx,y=cy+dy;
    if(grid[y]?.[x]===id)grid[y][x]='.';
   }
  }
  return [lvl,Object.freeze(grid.map(row=>row.join('')))];
 }));
 const tint={p:'p',v:'v',b:'b',l:'l',O:'O',n:'n',w:'w'};
 function render(level='medium',opts={}){
  if(!Object.hasOwn(base,level))level='medium';
  const g=base[level].map(row=>[...row]),[w,h]=sizes[level],c=colors[level],pos=landmarks[level];
  const o={eyes:'sparkle',mouth:'smile',extra:'none',scene:'none',color:'natural',...opts};
  const set=(x,y,id)=>{if(x>=0&&x<w&&y>=0&&y<h)g[y][x]=id;};
  const line=(x1,y1,x2,y2,id)=>{ // cienkie linie tylko z całych kratek
   let x=x1,y=y1,dx=Math.abs(x2-x1),dy=-Math.abs(y2-y1),sx=x1<x2?1:-1,sy=y1<y2?1:-1,err=dx+dy;
   for(;;){set(x,y,id);if(x===x2&&y===y2)break;const e=err*2;if(e>=dy){err+=dy;x+=sx}if(e<=dx){err+=dx;y+=sy}}
  };
  function clearEye(box){
   const [x0,x1,y0,y1]=box;
   for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    // Tło pod poprzednim okiem: górna część pyszczka to sierść,
    // dolna część to białe/kremowe futerko.
    const clr=level==='easy'?'.':level==='medium'?(y<=10?c.fur:c.face):
      level==='hard'?(y<=18?c.fur:c.face):(y<=29?c.fur:c.face);
    set(x,y,clr);
   }
  }
  function drawOpen(box,shape){
   const [x0,x1,y0,y1]=box;
   const cx=Math.floor((x0+x1)/2),cy=Math.floor((y0+y1)/2);
   const width=x1-x0+1,height=y1-y0+1;
   if(shape==='round'){
    const top=y0+(height>=5?1:0),bottom=y1;
    for(let y=top;y<=bottom;y++)for(let x=cx-1;x<=cx+1;x++)set(x,y,c.ink);
    set(cx-1,top,c.face);set(cx,bottom,c.gold);
   }else{
    for(let y=y0+(height>=5?1:0);y<=y1;y++)for(let x=cx-1;x<=cx+1;x++)set(x,y,c.ink);
    set(cx-1,cy,c.face);
    if(height>=4)set(cx,cy+1,c.gold);
   }
  }
  function drawClosed(box,style){
   const [x0,x1,y0,y1]=box,cx=Math.floor((x0+x1)/2),cy=Math.floor((y0+y1)/2);
   const width=x1-x0+1;
   if(style==='happy'){
    line(x0,cy,x1,cy,c.ink);
    set(x0,cy-1,c.ink);set(x1,cy-1,c.ink);
    // Brak czarnej źrenicy: to wyraźnie zamknięte oko.
   }else{
    line(x0,cy+Math.min(1,y1-cy),x1,cy+Math.min(1,y1-cy),c.ink);
    if(width>=4)set(x1,cy,c.ink);
   }
  }
  // Kontrolki oczu mają prawdziwe, rozłączne formy: otwarte, okrągłe,
  // obydwa zamknięte oraz jedno zamknięte przy mruganiu.
  if(o.eyes!=='sparkle'){
   pos.eyes.forEach((box,index)=>{
    clearEye(box);
    if(o.eyes==='happy')drawClosed(box,'happy');
    else if(o.eyes==='wink'&&index===1)drawClosed(box,'wink');
    else drawOpen(box,o.eyes==='round'?'round':'sparkle');
   });
  }
  if(o.mouth!=='smile'){
   const [x0,x1,y0,y1]=pos.mouth;
   for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)
    set(x,y,level==='easy'?'.':c.face);
   const x=Math.floor((x0+x1)/2),y=Math.floor((y0+y1)/2);
   set(x,y0,c.pink); // nos
   if(o.mouth==='surprised'){
    // Otwarta buzia zamiast języczka lub małej kreski.
    set(x,y,c.ink);set(x,y+1,c.pink);
    if(x+1<=x1)set(x+1,y+1,c.ink);
   }else if(o.mouth==='tongue'){
    set(x-1,y+1,c.ink);set(x,y+1,c.pink);
    set(x+1,y+1,c.ink);
    if(y+2<=y1)set(x,y+2,c.pink);
   }
  }
  // Dodatki przyczepione do postaci. Nie ma ozdób "latających" obok głowy.
  if(o.extra!=='none'){
   const [xx,yy]=o.extra==='crown'?pos.crown:o.extra==='scarf'?pos.neck:pos.ear;
   if(o.extra==='bow'){
    for(const [dx,dy,id] of [[-3,0,c.ink],[-2,-1,c.pink],[-1,-1,c.pink],[0,0,c.gold],
      [1,-1,c.pink],[2,-1,c.pink],[3,0,c.ink],[-2,1,c.pink],[-1,1,c.pink],
      [1,1,c.pink],[2,1,c.pink]])set(xx+dx,yy+dy,id);
   }else if(o.extra==='flower'){
    for(const [dx,dy] of [[0,-2],[0,2],[-2,0],[2,0],[-1,0],[1,0]])
      set(xx+dx,yy+dy,c.pink);
    set(xx,yy,c.gold);
   }else if(o.extra==='star'){
    for(const [dx,dy] of [[0,-2],[0,-1],[-2,0],[-1,0],[0,0],[1,0],[2,0],[0,1],[0,2]])
      set(xx+dx,yy+dy,c.gold);
   }else if(o.extra==='crown'){
    line(xx-3,yy,xx+3,yy,c.gold);
    set(xx-3,yy-1,c.gold);set(xx-2,yy-2,c.gold);
    set(xx,yy-2,c.gold);set(xx+2,yy-2,c.gold);set(xx+3,yy-1,c.gold);
    set(xx,yy,c.pink);
   }else if(o.extra==='scarf'){
    const span=level==='easy'?3:level==='medium'?4:level==='hard'?5:7;
    line(xx-span,yy,xx+span,yy,c.pink);
    line(xx-span+1,yy+1,xx+span-1,yy+1,c.gold);
    line(xx+2,yy+2,xx+2,yy+Math.min(level==='easy'?2:4,h-yy-1),c.pink);
   }
  }
  // Efekt tła nie pojawia się w postaci bazowej.
  const symbols={
   stars:[[0,0,c.gold],[-1,0,c.gold],[1,0,c.gold],[0,-1,c.gold],[0,1,c.gold]],
   hearts:[[-1,-1,c.pink],[1,-1,c.pink],[-1,0,c.pink],[0,0,c.pink],[1,0,c.pink],[0,1,c.pink]],
   flowers:[[0,0,c.gold],[-1,0,c.pink],[1,0,c.pink],[0,-1,c.pink],[0,1,c.pink]]
  };
  const scenePixels=symbols[o.scene];
  if(scenePixels){
   for(const [px,py] of pos.scene){
    let drawn=false;
    for(const [dx,dy] of [[0,0],[0,-2],[0,2],[-2,0],[2,0],[-3,-2],[3,-2],[-3,2],[3,2]]){
     const cells=scenePixels.map(([a,b,id])=>[px+dx+a,py+dy+b,id]);
     if(!cells.every(([x,y])=>x>=0&&x<w&&y>=0&&y<h&&g[y][x]==='.'))continue;
     for(const [x,y,id] of cells)set(x,y,id);
     drawn=true;break;
    }
    if(!drawn&&level==='easy'){ // Na najmniejszej planszy dopuszczamy dyskretną pojedynczą iskierkę.
     if(g[py]?.[px]==='.')set(px,py,c.gold);
    }
   }
  }
  if(o.color!=='natural'&&Object.hasOwn(tint,o.color)){
   for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(g[y][x]===c.fur)g[y][x]=tint[o.color];
  }
  return g.map(row=>row.join(''));
 }
 return Object.freeze({palette,sizes,originals,render,hashes});
})();