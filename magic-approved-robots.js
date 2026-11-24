'use strict';
/* Roboty Pikseluj: projekt bazowy + niezależne, wymienne części kreatora.
   Nigdy nie skalujemy ani nie nakładamy siatki na ilustrację. */
const MagicApprovedRobots=(()=>{
 const d=MagicApprovedRobotsData;
 const dims={easy:[16,16],medium:[24,24],hard:[32,40],expert:[40,56]};
 const countDigits='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
 const tokens='ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩабвгдежзиклмнопрстуфхцчш';
 const names={easy:'Błękitek',medium:'Błękitek 2.0',hard:'TurboBot',expert:'MECHA NOVA'};
 const palette={},lookup={},raw={};
 let tokenIndex=0;
 for(const [level,[w,h]] of Object.entries(dims)){
  lookup[level]={};
  for(const [id,hex] of Object.entries(d.palettes[level])){
   const token=tokens[tokenIndex++];
   lookup[level][id]=token;
   palette[token]=[hex,{K:'Ciemny kontur',B:'Błękitny',D:'Niebieski',Y:'Żółty',P:'Różowy',S:'Srebrny',L:'Jasna zbroja',V:'Fioletowy',O:'Pomarańczowy'}[id]];
  }
  const r=d.packed[level].split('/').map(segment=>{
   let decoded='';
   for(let i=0;i<segment.length;i+=2){
    const n=countDigits.indexOf(segment[i]);
    if(n<1||!Object.hasOwn(d.palettes[level],segment[i+1])&&segment[i+1]!=='.')throw Error('Robot invalid pack');
    decoded+=segment[i+1].repeat(n);
   }
   return decoded;
  });
  if(r.length!==h||r.some(row=>row.length!==w))throw Error('Robot invalid grid '+level);
  let hash=2166136261;
  for(const ch of r.join('/'))hash=Math.imul(hash^ch.charCodeAt(0),16777619)>>>0;
  if(hash!==d.hashes[level])throw Error('Robot image changed '+level);
  raw[level]=Object.freeze(r);
 }
 const anchor={
  easy:{eye:[[5,6,6,7],[9,10,6,7]],face:[5,10,6,8],panel:[6,9,11,12],antenna:[7,8,0,1],head:[4,11,2,8],scene:[[1,1],[14,2]]},
  medium:{eye:[[8,10,7,10],[14,16,7,10]],face:[7,17,7,11],panel:[9,14,16,19],antenna:[11,12,0,2],head:[5,18,3,12],scene:[[1,2],[22,3]]},
  hard:{eye:[[10,13,11,15],[18,21,11,15]],face:[9,22,11,18],panel:[12,19,24,31],antenna:[14,17,0,5],head:[7,24,6,19],scene:[[3,3],[28,4]]},
  expert:{eye:[[15,18,15,18],[22,25,15,18]],face:[13,27,13,22],panel:[17,23,33,39],antenna:[19,21,0,6],head:[10,29,2,24],scene:[[3,3],[36,5]]}
 };
 const tint={b:'base',v:'v',p:'p',l:'l',O:'O'};
 function render(level='medium',options={}){
  if(!Object.hasOwn(raw,level))level='medium';
  const g=raw[level].map(row=>[...row]),[w,h]=dims[level],loc=anchor[level];
  const o={kind:'square',eyes:'dots',mouth:'heart',extra:'one',scene:'none',color:'b',...options};
  const paint=(x,y,c)=>{if(x>=0&&y>=0&&x<w&&y<h)g[y][x]=c};
  const box=(r,c)=>{for(let y=r[2];y<=r[3];y++)for(let x=r[0];x<=r[1];x++)paint(x,y,c)};
  const line=(x0,y0,x1,y1,c)=>{let x=x0,y=y0,dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,err=dx+dy;for(;;){paint(x,y,c);if(x===x1&&y===y1)break;let e=err*2;if(e>=dy){err+=dy;x+=sx}if(e<=dx){err+=dx;y+=sy}}};
  const inside=(x,y,r)=>x>=r[0]&&x<=r[1]&&y>=r[2]&&y<=r[3];
  // Oddzielne strefy oczu: stary wariant jest czyszczony, zanim narysujemy nowy.
  if(o.eyes!=='dots'){
   for(let k=0;k<2;k++){
    const b=loc.eye[k],x=Math.floor((b[0]+b[1])/2),y=Math.floor((b[2]+b[3])/2);
    for(let yy=b[2];yy<=b[3];yy++)for(let xx=b[0];xx<=b[1];xx++)if(g[yy][xx]!=='.')paint(xx,yy,'B');
    if(o.eyes==='sleepy'){
     line(b[0],y,b[1],y,'K');
     if(y>b[2]){paint(b[0],y-1,'K');paint(b[1],y-1,'K')}
    }else if(o.eyes==='visor'){
     box([b[0],b[1],y,y+1],'K');
     paint(x,y,'Y');
    }
   }
  }
  // Osobny panel na piersi: wymienia się symbol, nie całą postać.
  if(o.mouth!=='heart'){
   const b=loc.panel;
   const cx=Math.floor((b[0]+b[1])/2),cy=Math.floor((b[2]+b[3])/2);
   const rad=level==='easy'?1:level==='medium'?2:level==='hard'?3:3;
   for(let y=cy-rad;y<=cy+rad;y++)for(let x=cx-rad;x<=cx+rad;x++)if(inside(x,y,b))paint(x,y,'D' in d.palettes[level]?'D':'B');
   if(o.mouth==='star'){
    line(cx,cy-1,cx,cy+1,'Y');line(cx-1,cy,cx+1,cy,'Y');
    if(rad>=2){paint(cx-2,cy,'Y');paint(cx+2,cy,'Y')}
   }else if(o.mouth==='lights'){
    for(let dx=-2;dx<=2;dx+=2)paint(cx+dx,cy,dx===0?'P':'Y');
    if(rad>=2)for(let dx=-2;dx<=2;dx+=2)paint(cx+dx,cy+1,'K');
   }
  }
  // Antenka jako wymienna część. Nie zmieniamy zbroi i hełmu pod nią.
  if(o.extra!=='one'){
   const [x0,x1,y0,y1]=loc.antenna,cx=Math.floor((x0+x1)/2);
   for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    if(y>y1-1&&level==='expert')continue; // zachowaj dolną część grzebienia hełmu
    if(g[y][x]!=='.')paint(x,y,'.');
   }
   if(o.extra==='two'){
    const gap=level==='easy'?2:level==='medium'?4:level==='hard'?5:7;
    const startY=level==='easy'?0:level==='medium'?1:level==='hard'?2:1;
    for(const sign of [-1,1]){
     const x=cx+sign*gap;
     paint(x,startY,'Y');paint(x,startY+1,'K');
     if(level!=='easy')paint(x,startY+2,'K');
    }
   }
  }
  // Trzy prawdziwie różne warianty kształtu hełmu.
  if(o.kind==='round'||o.kind==='tall'){
   const [x0,x1,y0,y1]=loc.head,cx=Math.floor((x0+x1)/2);
   if(o.kind==='round'){
    // Tylko narożniki zewnętrznego pancerza, nigdy twarz/wyświetlacz.
    for(const y of [y0+1,y0+2]){
     paint(x0,y,'.');paint(x1,y,'.');
    }
    if(level!=='easy'){paint(x0+1,y0,'.');paint(x1-1,y0,'.')}
    if(level==='expert'){paint(cx-4,y0+4,'B');paint(cx+4,y0+4,'B')}
   }else{
    // Wyższy grzebień z odrębnym podświetleniem, nie zniekształca oczu.
    const y=Math.max(1,y0-1);
    for(let x=cx-2;x<=cx+2;x++)paint(x,y,'K');
    paint(cx,y-1,'Y');
   }
  }
  // Dekoracje pojawiają się WYŁĄCZNIE na żądanie, na białych pustych kratkach.
  const symbol=o.scene==='stars'?[[0,0,'Y'],[0,-1,'Y'],[0,1,'Y'],[-1,0,'Y'],[1,0,'Y']]:
   o.scene==='hearts'?[[-1,-1,'P'],[1,-1,'P'],[-1,0,'P'],[0,0,'P'],[1,0,'P'],[0,1,'P']]:[];
  if(symbol.length)for(const [x,y] of loc.scene)if(symbol.every(([dx,dy])=>x+dx>=0&&x+dx<w&&y+dy>=0&&y+dy<h&&g[y+dy][x+dx]==='.'))
   for(const [dx,dy,c] of symbol)paint(x+dx,y+dy,c);
  // Przemalowujemy BŁĘKITNY fragment pancerza, nie elementy twarzy i tła.
  if(Object.hasOwn(tint,o.color)&&o.color!=='b'){
   for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(g[y][x]==='B')g[y][x]=o.color;
  }
  return g.map(row=>row.map(c=>c==='.'?'.':Object.hasOwn(lookup[level],c)?lookup[level][c]:c).join(''));
 }
 return Object.freeze({render,palette,originals:raw,dims,anchor,names});
})();