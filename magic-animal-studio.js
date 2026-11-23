'use strict';
/* Pikseluj · Zwierzątka 2.0
 * Wszystkie postacie powstają bezpośrednio w komórkach docelowej siatki:
 * 16×16, 24×24, 32×40 lub 40×56. Brak obrazków skalowanych i półkratek.
 * Dodatki, oczy, minki i dekoracje operują na rzeczywistych pikselach.
 */
const MagicAnimalStudio=(()=>{
 const levels={easy:[16,16],medium:[24,24],hard:[32,40],expert:[40,56]};
 const names={cat:'Kotek',dog:'Piesek',bunny:'Króliczek',owl:'Sówka'};
 const natural={cat:'O',dog:'e',bunny:'c',owl:'n'};
 const allowedColor=['natural','p','v','b','l','O','n','w'];
 const limits={easy:5,medium:6,hard:8,expert:10};
 function render(kind='cat',options={},level='medium'){
  if(!Object.hasOwn(names,kind))kind='cat';
  if(!Object.hasOwn(levels,level))level='medium';
  const [w,h]=levels[level],rank=['easy','medium','hard','expert'].indexOf(level);
  const grid=Array.from({length:h},()=>Array(w).fill('.'));
  const o={eyes:'sparkle',mouth:'smile',extra:'none',scene:'none',color:'natural',...options};
  const fur=allowedColor.includes(o.color)&&o.color!=='natural'?o.color:natural[kind];
  const ink='k',white='w',pink='p',yellow='Y',cream=rank===0?white:'c';
  const shade=rank>=2?(fur==='O'?'n':fur==='e'?'n':fur==='n'?'e':fur==='w'?'s':fur==='c'?'e':fur==='b'?'a':fur==='l'?'d':fur==='p'?'X':'u'):fur;
  const blue='a';
  const put=(x,y,color,blank=false)=>{
   x=Math.round(x);y=Math.round(y);
   if(x>=0&&x<w&&y>=0&&y<h&&(!blank||grid[y][x]==='.'))grid[y][x]=color;
  };
  const rect=(x,y,ww,hh,c)=>{for(let yy=Math.floor(y);yy<y+hh;yy++)for(let xx=Math.floor(x);xx<x+ww;xx++)put(xx,yy,c)};
  const oval=(cx,cy,rx,ry,c)=>{
   if(rx<=0||ry<=0)return;
   const minX=Math.max(0,Math.floor(cx-rx)),maxX=Math.min(w-1,Math.ceil(cx+rx));
   const minY=Math.max(0,Math.floor(cy-ry)),maxY=Math.min(h-1,Math.ceil(cy+ry));
   for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++)
    if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1.05)put(x,y,c);
  };
  const poly=(vertices,c)=>{
   const xs=vertices.map(v=>v[0]),ys=vertices.map(v=>v[1]);
   for(let y=Math.max(0,Math.floor(Math.min(...ys)));y<=Math.min(h-1,Math.ceil(Math.max(...ys)));y++)
    for(let x=Math.max(0,Math.floor(Math.min(...xs)));x<=Math.min(w-1,Math.ceil(Math.max(...xs)));x++){
     let inside=false;
     for(let i=0,j=vertices.length-1;i<vertices.length;j=i++){
      const a=vertices[i],b=vertices[j];
      if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;
     }
     if(inside)put(x,y,c);
    }
  };
  const line=(x0,y0,x1,y1,c)=>{
   x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
   let dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1,err=dx+dy;
   for(;;){put(x0,y0,c);if(x0===x1&&y0===y1)break;const e=2*err;if(e>=dy){err+=dy;x0+=sx}if(e<=dx){err+=dx;y0+=sy}}
  };
  const outlined=(cx,cy,rx,ry,c=fur)=>{
   oval(cx,cy,rx,ry,ink);oval(cx,cy,rx-1,ry-1,c);
  };
  const cx=(w-1)/2;
  const geo={
   easy:{head:[cx,8.6,5.7,5.0],body:null,eyeY:8.8,eyeDX:2.15,eyeRx:1.2,earY:4.1},
   medium:{head:[cx,9.5,7.2,5.6],body:[cx,17.8,6.1,5.4],eyeY:9.8,eyeDX:3.0,eyeRx:1.7,earY:5.4},
   hard:{head:[cx,13.8,9.2,7.2],body:[cx,28.2,8.6,9.8],eyeY:14.3,eyeDX:3.8,eyeRx:2.1,earY:8.0},
   expert:{head:[cx,17.7,10.5,8.2],body:[cx,36.6,10.6,13.0],eyeY:18.3,eyeDX:4.4,eyeRx:2.6,earY:11.5}
  }[level];
  const [hx,hy,hrx,hry]=geo.head,body=geo.body;
  // Ogon, skrzydła i łapy są oddzielone od korpusu czytelnym konturem.
  if(body){
   const [bx,by,brx,bry]=body;
   if(kind==='cat'){
    const tx=bx+brx-1;
    line(tx,by+4,tx+5,by+4,ink);line(tx+5,by+4,tx+6,by-5,ink);
    line(tx+6,by-5,tx+4,by-7,ink);
    line(tx+1,by+4,tx+4,by+4,fur);
    if(rank>=2)line(tx+5,by+1,tx+5,by-4,fur);
   }else if(kind==='dog'){
    oval(bx+brx+2,by+1,rank>=2?3:2,rank>=2?3:2,ink);
    oval(bx+brx+2,by,rank>=2?2:1.2,rank>=2?2:1.3,fur);
   }else if(kind==='bunny'){
    oval(bx+brx-1,by+4,2,2,ink);
    oval(bx+brx-1,by+4,1,1,white);
   }
   outlined(bx,by,brx,bry);
   if(rank>=2){
    for(const sign of [-1,1]){
     outlined(bx+sign*(brx-1),by+3,rank===3?3.2:2.6,rank===3?4:3.3);
    }
   }
   if(kind==='owl'){
    for(const sign of [-1,1]){
     outlined(bx+sign*(brx-1),by-1,rank>=2?3:2.1,rank>=2?6:3.9);
     if(rank>=2){line(bx+sign*(brx-1),by-2,bx+sign*(brx-2),by+2,shade);}
    }
   }
   oval(bx,by+1,brx*.59,bry*.65,cream);
   if(rank>=2&&kind!=='bunny'){
    for(let j=0;j<3;j++)rect(Math.round(bx-2+j*2),Math.round(by+1+j%2),1,2,rank===3?shade:fur);
   }
   for(const sign of [-1,1]){
    outlined(bx+sign*(brx*.53),by+bry-1.1,rank>=2?3:2.2,rank>=2?2.4:1.7);
    if(rank>=2)put(Math.round(bx+sign*(brx*.53)),Math.round(by+bry-1),pink);
   }
  }
  // Uszy i rozpoznawalna sylwetka każdego gatunku.
  if(kind==='cat'){
   const d=hrx*.73;
   for(const sign of [-1,1]){
    const tip=[hx+sign*d,hy-hry-(rank===0?2:3)];
    const a=[hx+sign*(d-3.4),hy-hry+2.7],b=[hx+sign*(d+2.8),hy-hry+3.3];
    poly([tip,a,b],ink);
    poly([[tip[0],tip[1]+2],[hx+sign*(d-1.5),hy-hry+2],[hx+sign*(d+1.0),hy-hry+2]],pink);
   }
  }else if(kind==='dog'){
   for(const sign of [-1,1]){
    outlined(hx+sign*(hrx*.84),hy-1,rank>=2?3.5:rank===0?2.1:2.7,rank>=2?5.2:3.7,shade);
   }
  }else if(kind==='bunny'){
   for(const sign of [-1,1]){
    const ex=hx+sign*(hrx*.5),top=Math.max(1,hy-hry-(rank===0?4:rank===1?7:9));
    const base=hy-hry+2,len=base-top;
    oval(ex,top+len*.48,rank===0?1.7:rank>=2?2.6:2.1,len*.54,ink);
    oval(ex,top+len*.5,rank===0?.8:1.2,len*.38,pink);
   }
  }else if(kind==='owl'){
   for(const sign of [-1,1]){
    const tip=[hx+sign*hrx*.85,hy-hry-2.6];
    poly([tip,[hx+sign*(hrx*.94),hy-hry+3],[hx+sign*(hrx*.22),hy-hry+1]],ink);
    poly([[tip[0],tip[1]+1.6],[hx+sign*(hrx*.65),hy-hry+1],[hx+sign*(hrx*.32),hy-hry+1.8]],fur);
   }
  }
  outlined(hx,hy,hrx,hry);
  // Pies: uszy opadające na boki policzków, narysowane przed mordką.
  if(kind==='dog'){
   for(const sign of [-1,1]){
    outlined(hx+sign*(hrx*.87),hy-.1,rank>=2?3.5:rank===0?2.1:2.8,rank>=2?5:3.4,shade);
    if(rank>=1)put(hx+sign*(hrx*.9),hy+2,fur);
   }
  }
  // Owl: biała maska wokół oczu i dzióbek; bunny: jasny pyszczek; dog: łatki.
  if(kind==='owl'){
   for(const sign of [-1,1]){
    oval(hx+sign*geo.eyeDX,geo.eyeY,rank>=2?3.7:rank===0?2.1:2.7,rank>=2?3.9:rank===0?2.2:2.8,white);
   }
  }else if(kind==='dog'){
   if(rank>=1)oval(hx-geo.eyeDX,geo.eyeY+1,rank>=2?3.3:2.4,rank>=2?3.4:2.5,shade);
   oval(hx,hy+2.4,Math.max(2.1,hrx*.42),Math.max(1.7,hry*.29),white);
  }else if(kind==='bunny'){
   oval(hx,hy+2.1,Math.max(2.2,hrx*.38),rank>=2?2.9:1.9,white);
  }
  // Płaszczyzny kolorystyczne są szerokie: żadnej zupy z kilkunastu odcieni.
  if(rank>=2&&kind==='cat'){
   for(const sign of [-1,1]){
    line(hx+sign*2,hy-hry+2,hx+sign*2,hy-hry+3,shade);
    line(hx+sign*5,hy-hry+4,hx+sign*5,hy-hry+5,shade);
   }
  }
  // Oczy: cztery realne warianty; ten sam obszar nie nachodzi na ozdoby.
  const eyes=o.eyes||'sparkle';
  for(const sign of [-1,1]){
   const ex=Math.round(hx+sign*geo.eyeDX),ey=Math.round(geo.eyeY),rx=geo.eyeRx;
   if(eyes==='happy'){
    line(ex-1,ey,ex+1,ey,ink);
    if(rank>=1){put(ex-1,ey-1,ink);put(ex+1,ey-1,ink)}
   }else if(eyes==='wink'&&sign===1){
    line(ex-1,ey,ex+1,ey,ink);put(ex+1,ey-1,ink);
   }else{
    oval(ex,ey,rx,rank===0?1.5:rank>=2?2.3:1.8,ink);
    if(rank>=1)oval(ex,ey+.2,Math.max(.8,rx-.8),rank>=2?1.4:1.1,white);
    if(eyes==='round'&&rank>=1)put(ex,ey,rank===1?ink:blue);
    if(eyes==='sparkle')put(ex-1,ey-1,white);
    if(rank===3&&eyes==='sparkle')put(ex+1,ey+1,white);
   }
  }
  // Policzki.
  for(const sign of [-1,1])put(Math.round(hx+sign*(hrx*.69)),Math.round(hy+2.1),pink);
  if(rank>=1)for(const sign of [-1,1])put(Math.round(hx+sign*(hrx*.69)+sign),Math.round(hy+2.1),pink);
  const my=Math.round(hy+hry*.44),mx=Math.round(hx);
  if(kind==='owl'){
   poly([[mx,my-1],[mx-1,my],[mx+1,my],[mx,my+2]],yellow);
   if(o.mouth==='surprised')put(mx,my+2,ink);
   else if(o.mouth==='tongue'){put(mx,my+2,pink);if(rank>=1)put(mx-1,my+1,pink);}
   else{put(mx,my+2,yellow);if(rank>=1)put(mx-1,my+1,ink);}
  }else{
   // Nos pozostaje widoczny nawet przy uśmiechu i języczku.
   put(mx,my-1,ink);
   if(o.mouth==='surprised'){
    oval(mx,my+1,rank>=2?1.5:1,rank>=2?1.5:1,ink);
    put(mx,my+1,pink);
   }else if(o.mouth==='tongue'){
    line(mx-1,my+1,mx+1,my+1,ink);
    put(mx,my+2,pink);if(rank>=2)put(mx+1,my+2,pink);
   }else{
    put(mx,my,ink);
    if(rank>=1){put(mx-1,my+1,ink);put(mx+1,my+1,ink)}
   }
  }
  // Cechy rozpoznawcze dla zaawansowanych i zabawne akcenty.
  if(rank>=2&&kind==='cat'){
   for(const sign of [-1,1]){
    line(mx+sign*2,my,mx+sign*6,my-1,ink);
    line(mx+sign*2,my+1,mx+sign*6,my+2,ink);
   }
  }
  if(rank>=2&&kind==='dog'){
   oval(hx+hrx*.45,hy-2,1.5,1.5,shade);
  }
  if(rank===3){
   // Dyskretne detale, ale duże obszary o tym samym kolorze.
   if(kind==='owl'){
    for(const sign of [-1,1])for(let i=0;i<3;i++)put(Math.round(cx+sign*(3+i)),Math.round(body[1]+3+i%2),yellow);
   }else if(kind==='cat'){
    for(const sign of [-1,1])line(cx+sign*5,body[1]+2,cx+sign*6,body[1]+5,shade);
   }else if(kind==='dog'){
    oval(cx-3,body[1]+3,2.2,2.5,shade);
   }else{
    for(const sign of [-1,1])put(Math.round(cx+sign*4),Math.round(body[1]+5),pink);
   }
  }
  // Dodatki korzystają z kolorów już obecnych w palecie.
  const extra=o.extra||'none';
  const ax=Math.round(hx+(extra==='bow'?-hrx*.64:0)),ay=Math.round(hy-hry-(kind==='bunny'?0:1));
  if(extra==='bow'){
   rect(ax-3,ay,2,2,pink);rect(ax+2,ay,2,2,pink);rect(ax,ay,2,2,yellow);
   put(ax-4,ay,ink);put(ax+4,ay,ink);
  }else if(extra==='crown'){
   for(let dx=-3;dx<=3;dx++)put(ax+dx,ay, yellow);
   for(const dx of [-3,0,3]){put(ax+dx,ay-2,yellow);put(ax+dx,ay-1,yellow);}
   if(rank>=1)put(ax,ay,pink);
  }else if(extra==='flower'||extra==='star'){
   const sy=Math.max(2,ay+1),span=rank===0?1:2;
   for(const [dx,dy] of [[0,-span],[-span,0],[span,0],[0,span]])put(ax+dx,sy+dy,extra==='flower'?pink:yellow);
   put(ax,sy,extra==='flower'?yellow:white);
  }else if(extra==='scarf'&&body){
   const neck=Math.round((body[1]-body[3]+hy+hry)/2);
   line(Math.round(cx-hrx*.55),neck,Math.round(cx+hrx*.55),neck,yellow);
   rect(Math.round(cx+2),neck+1,rank>=2?3:2,rank>=2?6:4,yellow);
   if(rank>=2)put(Math.round(cx+3),neck+3,pink);
  }
  // Niewielkie dekoracje umieszczamy wyłącznie na PUSTYCH kratkach.
  if(o.scene&&o.scene!=='none'){
   const left=rank===0?1:rank===1?2:4,right=w-1-left,top=rank===0?11:rank===1?4:7;
   const stamp=(x,y)=>{
    const marks=o.scene==='stars'?[[0,0,yellow],[-1,0,yellow],[1,0,yellow],[0,-1,yellow],[0,1,yellow]]
     :o.scene==='hearts'?[[0,0,pink],[-1,-1,pink],[1,-1,pink],[0,1,pink]]
     :[[0,0,yellow],[-1,0,pink],[1,0,pink],[0,-1,pink],[0,1,pink]];
    if(marks.every(([dx,dy])=>y+dy>=0&&y+dy<h&&x+dx>=0&&x+dx<w&&grid[y+dy][x+dx]==='.'))
     marks.forEach(([dx,dy,c])=>put(x+dx,y+dy,c));
   };
   stamp(left,top);stamp(right,top);
   if(rank>=2){stamp(4,h-7);stamp(w-5,h-8)}
  }
  return grid.map(row=>row.join(''));
 }
 return Object.freeze({render,levels,names,limits});
})();
