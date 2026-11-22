'use strict';
/* Pikseluj premium: rysunek na każdej siatce jest tworzony piksel po pikselu,
   a nie rozciągany z bitmapy 24x24. */
const MagicPremiumCore=(()=>{
 const levels={
  easy:{w:16,h:16,d:0,head:[8,7,5,5],body:[8,13,4,3]},
  medium:{w:24,h:24,d:1,head:[12,10,8,8],body:[12,20,6,5]},
  hard:{w:32,h:40,d:2,head:[16,18,11,11],body:[16,33,9,8]},
  expert:{w:40,h:56,d:3,head:[20,24,14,14],body:[20,46,11,10]}
 };
 const allowed=['k','w','s','n','e','c','r','O','Y','H','l','g','d','b','a','u','v','p','X','t'];
 const palettes={
  p:{base:'p',shadow:'X',shine:'t',belly:'c'},
  v:{base:'v',shadow:'u',shine:'p',belly:'w'},
  b:{base:'b',shadow:'a',shine:'w',belly:'w'},
  l:{base:'l',shadow:'g',shine:'H',belly:'c'},
  O:{base:'O',shadow:'n',shine:'H',belly:'c'},
  n:{base:'n',shadow:'e',shine:'e',belly:'c'},
  w:{base:'w',shadow:'s',shine:'w',belly:'c'},
  e:{base:'e',shadow:'n',shine:'H',belly:'c'}
 };
 function palette(o,k){
  const c=o.color==='natural'||!o.color?({cat:'e',bear:'n',fox:'O',bunny:'w'})[k]||'b':o.color;
  return palettes[c]||palettes.p;
 }
 function board(w,h){
  const cells=Array.from({length:h},()=>Array(w).fill('.'));
  const rnd=x=>Math.round(x);
  function set(x,y,c,blank=false){
   x=rnd(x);y=rnd(y);
   if(x>=0&&x<w&&y>=0&&y<h&&(!blank||cells[y][x]==='.'))cells[y][x]=c;
  }
  const get=(x,y)=>cells[rnd(y)]?.[rnd(x)]||'.';
  function rect(x,y,ww,hh,c){
   x=rnd(x);y=rnd(y);ww=rnd(ww);hh=rnd(hh);
   for(let j=Math.max(0,y);j<Math.min(h,y+hh);j++)
    for(let i=Math.max(0,x);i<Math.min(w,x+ww);i++)cells[j][i]=c;
  }
  function oval(cx,cy,rx,ry,c){
   rx=Math.max(.5,rx);ry=Math.max(.5,ry);
   for(let y=Math.max(0,Math.floor(cy-ry-1));y<=Math.min(h-1,Math.ceil(cy+ry+1));y++)
    for(let x=Math.max(0,Math.floor(cx-rx-1));x<=Math.min(w-1,Math.ceil(cx+rx+1));x++)
     if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)set(x,y,c);
  }
  function ring(x,y,rx,ry,fill,edge='k',border=1){
   oval(x,y,rx,ry,edge);
   if(rx>border&&ry>border)oval(x,y,rx-border,ry-border,fill);
  }
  function rounded(x,y,ww,hh,r,c){
   x=rnd(x);y=rnd(y);ww=rnd(ww);hh=rnd(hh);
   const rr=Math.max(0,Math.min(rnd(r),Math.floor(ww/2),Math.floor(hh/2)));
   for(let j=y;j<y+hh;j++)for(let i=x;i<x+ww;i++){
    const dx=Math.max(0,Math.abs(i+.5-x-ww/2)-(ww/2-rr));
    const dy=Math.max(0,Math.abs(j+.5-y-hh/2)-(hh/2-rr));
    if(dx*dx+dy*dy<=rr*rr+.1)set(i,j,c);
   }
  }
  function roundedRing(x,y,ww,hh,r,fill){
   rounded(x,y,ww,hh,r,'k');if(ww>2&&hh>2)rounded(x+1,y+1,ww-2,hh-2,Math.max(0,r-1),fill);
  }
  function poly(points,c){
   const minX=Math.max(0,Math.floor(Math.min(...points.map(p=>p[0]))));
   const maxX=Math.min(w-1,Math.ceil(Math.max(...points.map(p=>p[0]))));
   const minY=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1]))));
   const maxY=Math.min(h-1,Math.ceil(Math.max(...points.map(p=>p[1]))));
   for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
    let inside=false;
    for(let i=0,k=points.length-1;i<points.length;k=i++){
     const [ax,ay]=points[i],[bx,by]=points[k];
     if((ay>y+.5)!==(by>y+.5)&&x+.5<(bx-ax)*(y+.5-ay)/(by-ay)+ax)inside=!inside;
    }
    if(inside)set(x,y,c);
   }
  }
  function line(x,y,xx,yy,c){
   x=rnd(x);y=rnd(y);xx=rnd(xx);yy=rnd(yy);
   const dx=Math.abs(xx-x),dy=-Math.abs(yy-y),sx=x<xx?1:-1,sy=y<yy?1:-1;
   let err=dx+dy;
   while(true){set(x,y,c);if(x===xx&&y===yy)break;const e=err*2;if(e>=dy){err+=dy;x+=sx}if(e<=dx){err+=dx;y+=sy}}
  }
  function sparkle(x,y,c='Y'){
   for(const [dx,dy] of [[-2,0],[-1,0],[0,-2],[0,-1],[0,0],[0,1],[0,2],[1,0],[2,0]])set(x+dx,y+dy,c,true);
  }
  function heart(x,y,c='r'){
   for(const [dx,dy] of [[-1,0],[1,0],[-2,1],[-1,1],[0,1],[1,1],[2,1],[-1,2],[0,2],[1,2],[0,3]])set(x+dx,y+dy,c,true);
  }
  const rows=()=>cells.map(row=>row.join(''));
  return {w,h,set,get,rect,oval,ring,rounded,roundedRing,poly,line,sparkle,heart,rows};
 }
 function accents(g,L,o){
  if(o.scene==='none')return;
  const w=L.w,h=L.h;
  if(o.scene==='flowers'){
   flower(g,3,h-3);if(L.d>=2)flower(g,w-4,h-4);
  }else if(o.scene==='hearts'){
   g.heart(3,Math.max(2,Math.round(h*.2)),'p');
   if(L.d>=2)g.heart(w-4,Math.round(h*.4),'r');
  }else{
   g.sparkle(3,Math.max(3,Math.round(h*.2)),'Y');
   if(L.d>=1)g.sparkle(w-4,Math.max(3,Math.round(h*.21)),'H');
   if(L.d>=3)g.sparkle(w-4,Math.round(h*.73),'p');
  }
 }
 function flower(g,x,y){
  g.set(x-1,y,'p',true);g.set(x+1,y,'p',true);
  g.set(x,y-1,'p',true);g.set(x,y+1,'p',true);
  g.set(x,y,'Y',true);g.set(x,y+2,'g',true);
 }
 function eye(g,x,y,r,style,side){
  r=Math.max(1,Math.round(r));
  if(style==='happy'){
   g.line(x-r,y+1,x,y-1,'k');g.line(x,y-1,x+r,y+1,'k');return;
  }
  if(style==='wink'&&side===1){
   g.line(x-r,y,x+r,y,'k');g.set(x-r,y+1,'k');g.set(x+r,y+1,'k');return;
  }
  g.ring(x,y,r,Math.max(1,r), 'w');
  const px=x+(side===0?1:-1);
  g.oval(px,y+1,Math.max(1,r-1),Math.max(1,r-1),'k');
  g.set(x,y-1,'w');if(style==='sparkle'){g.set(x+1,y-1,'w');if(r>=3)g.set(x-1,y,'w')}
 }
 function animalEars(g,L,k,p){
  const [cx,cy,rx,ry]=L.head,top=cy-ry;
  if(k==='bear'){
   for(const sign of [-1,1]){
    const r=Math.max(2,Math.round(rx*.38)),x=cx+sign*Math.round(rx*.7),y=top+1;
    g.ring(x,y,r,r,p.base);
    g.oval(x,y,Math.max(.75,r-2),Math.max(.75,r-2),'t');
   }
  }else if(k==='bunny'){
   for(const sign of [-1,1]){
    const x=cx+sign*Math.round(rx*.49),r=Math.max(1.5,rx*.23);
    const length=Math.max(3,Math.round(ry*(L.d>=2?.76:.56)));
    const y=top-Math.round(length*.4);
    g.ring(x,y,r,length,p.base);
    g.oval(x,y,Math.max(.8,r-1.5),Math.max(1,length-2),'t');
   }
  }else{
   for(const sign of [-1,1]){
    const pos=cx+sign*Math.round(rx*.6);
    const span=Math.max(2,Math.round(rx*(k==='cat'?.39:.35)));
    const bottom=top+Math.max(4,Math.round(ry*(k==='cat'?.51:.66)));
    const tip=top-Math.max(3,Math.round(ry*(k==='cat'?.3:.47)));
    g.poly([[pos-span,bottom],[pos,tip],[pos+span,bottom]],'k');
    g.poly([[pos-span+1,bottom-1],[pos,tip+2],[pos+span-1,bottom-1]],p.base);
    if(L.d>0)g.poly([[pos-span+2,bottom-2],[pos,tip+4],[pos+span-2,bottom-2]],'t');
   }
  }
 }
 function ornament(g,L,o){
  const [cx,cy,rx,ry]=L.head,top=cy-ry,extra=o.extra||'none';
  if(extra==='none')return;
  if(extra==='bow'){
   const x=cx+Math.round(rx*.62),y=top+Math.max(2,Math.floor(ry*.2));
   g.ring(x-2,y,L.d>=2?2:1,L.d>=2?2:1,'p');
   g.ring(x+2,y,L.d>=2?2:1,L.d>=2?2:1,'p');
   g.set(x,y,'Y');
  }else if(extra==='flower'){
   const x=cx+Math.round(rx*.62),y=top+2;
   g.oval(x-2,y,1.5,1.5,'w');g.oval(x+2,y,1.5,1.5,'w');
   g.oval(x,y-2,1.5,1.5,'w');g.oval(x,y+2,1.5,1.5,'w');
   g.set(x,y,'Y');
  }else if(extra==='star')g.sparkle(cx+Math.round(rx*.7),top+3,'Y');
  else if(extra==='crown'){
   const ww=Math.max(5,Math.round(rx*.87)),x=cx-Math.floor(ww/2),y=top-3;
   g.rect(x,y+2,ww,3,'Y');
   for(const px of [x,x+Math.floor(ww/2),x+ww-1])g.set(px,y,'Y');
   g.rect(x,y+4,ww,1,'k');g.set(cx,y+3,'r');
  }else if(extra==='scarf'&&L.d>=1){
   const width=Math.max(4,Math.round(rx*1.08)),y=cy+ry-1;
   g.rect(cx-Math.round(width/2),y,width,Math.max(2,L.d),'r');
   g.rect(cx+Math.round(rx*.23),y+1,Math.max(2,L.d),Math.max(3,L.body[3]*.5),'r');
  }
 }
 function drawAnimal(g,L,o){
  const k=o.kind||'cat',p=palette(o,k);
  const [cx,cy,rx,ry]=L.head,[bx,by,brx,bry]=L.body,d=L.d;
  accents(g,L,o);
  if(k==='cat'||k==='fox'){
   const tx=Math.min(L.w-2,bx+brx+2),ty=by-2;
   g.ring(tx,ty,Math.max(2,brx*.32),Math.max(2,bry*.65),p.base);
   if(k==='fox')g.oval(tx+1,ty-1,Math.max(1,brx*.24),Math.max(1,bry*.27),'w');
  }
  animalEars(g,L,k,p);
  if(d>=1)for(const sign of [-1,1]){
   g.ring(bx+sign*Math.round(brx*.9),by+1,Math.max(2,brx*.35),Math.max(2,bry*.42),p.base);
  }
  g.ring(bx,by,brx,bry,p.base);
  if(d>=1){
   g.oval(bx,by+Math.round(bry*.17),Math.max(2,brx*.56),Math.max(2,bry*.6),p.belly);
   for(const sign of [-1,1]){
    const x=bx+sign*Math.round(brx*.66);
    g.ring(x,Math.min(L.h-2,by+bry-1),Math.max(2,brx*.32),Math.max(1,bry*.27),p.base);
    if(d>=3)g.set(x,by+bry-1,p.shadow);
   }
  }
  g.ring(cx,cy,rx,ry,p.base);
  if(d>=2){
   g.oval(cx-rx*.43,cy-ry*.53,Math.max(2,rx*.24),Math.max(1,ry*.14),p.shine);
   g.oval(cx+rx*.64,cy+ry*.2,Math.max(1,rx*.12),Math.max(2,ry*.32),p.shadow);
  }
  if(k==='fox'){
   const y=cy+ry*.23;
   g.poly([[cx-rx+2,y],[cx-rx*.55,y-2],[cx,cy+ry*.75],[cx,cy+ry-1],[cx-rx*.63,cy+ry*.58]],'w');
   g.poly([[cx+rx-2,y],[cx+rx*.55,y-2],[cx,cy+ry*.75],[cx,cy+ry-1],[cx+rx*.63,cy+ry*.58]],'w');
  }else g.oval(cx,cy+Math.round(ry*.42),Math.max(2,rx*.42),Math.max(2,ry*.3),p.belly);
  const gap=Math.max(2,Math.round(rx*.44)),er=Math.max(1,Math.round(rx*(d===0?.16:.19))),y=cy-Math.max(1,Math.round(ry*.1));
  eye(g,cx-gap,y,er,o.eyes||'sparkle',0);
  eye(g,cx+gap,y,er,o.eyes||'sparkle',1);
  const ny=cy+Math.round(ry*.4);
  if(d===0){g.set(cx,ny,'k');g.set(cx-1,ny+1,'k');g.set(cx+1,ny+1,'k')}
  else{
   g.oval(cx,ny,Math.max(1,rx*.13),Math.max(1,ry*.1),k==='fox'?'k':'n');
   g.set(cx,ny+1,'k');
   if(o.mouth==='tongue'){
    g.line(cx-2,ny+2,cx+2,ny+2,'k');g.set(cx,ny+3,'p');
    if(d>=2)g.set(cx,ny+4,'r');
   }else if(o.mouth==='surprised')g.ring(cx,ny+3,Math.max(1,rx*.13),Math.max(1,ry*.11),'r');
   else{
    g.line(cx,ny+1,cx-2,ny+3,'k');g.line(cx,ny+1,cx+2,ny+3,'k');
   }
  }
  if(d>=1){
   g.set(cx-gap-2,cy+Math.round(ry*.34),'t');
   g.set(cx+gap+2,cy+Math.round(ry*.34),'t');
   if(d>=3) {
    for(const sign of [-1,1]){
     g.set(cx+sign*(gap+2),cy+Math.round(ry*.25),'p');
     if(k==='cat'||k==='fox'){
      const x=cx+sign*(rx-2),y=cy+Math.round(ry*.32);
      g.line(x,y,x+sign*2,y-1,'k');
      g.line(x,y+2,x+sign*2,y+2,'k');
     }
    }
   }
  }
  if(k==='cat'&&d>=2)for(const n of [-2,0,2])g.set(cx+n,cy-ry+3,p.shadow);
  if(k==='bunny'&&d>=2){g.set(cx-1,ny-1,'p');g.set(cx+1,ny-1,'p')}
  ornament(g,L,o);
  if(d>=2 && o.extra!=='scarf'){
   g.set(bx-1,by-2,p.shadow);g.set(bx,by-1,'Y');g.set(bx+1,by-2,p.shadow);
  }
 }
 function drawMonster(g,L,o){
  const p=palette(o,'monster'),[cx,cy,rx,ry]=L.head,[bx,by,brx,bry]=L.body,d=L.d;
  accents(g,L,o);
  // Cała postać, nie sama głowa: pełny brzuszek, rączki i nóżki na A4.
  for(const sign of [-1,1]){
    const ax=bx+sign*Math.round(brx*.9);
    if(d>=1)g.ring(ax,by-1,Math.max(2,brx*.4),Math.max(2,bry*.49),p.base);
    g.ring(bx+sign*Math.round(brx*.57),Math.min(L.h-2,by+bry-1),Math.max(2,brx*.34),Math.max(1.5,bry*.26),p.base);
  }
  g.ring(bx,by,brx,bry,p.base);
  if(d>=1)g.oval(bx,by+Math.round(bry*.16),Math.max(2,brx*.55),Math.max(2,bry*.52),p.shine);
  if(d>=2)for(const sign of [-1,1]){
    const px=bx+sign*Math.round(brx*.37);
    g.set(px,by+Math.round(bry*.17),'p');
  }
  if(o.kind==='square')g.roundedRing(cx-rx,cy-ry,rx*2+1,ry*2+1,Math.max(2,rx*.27),p.base);
  else if(o.kind==='jelly'){
   g.ring(cx,cy+ry*.2,rx,ry*.92,p.base);
   for(const shift of [-.55,0,.55])g.ring(cx+rx*shift,cy+ry*.82,Math.max(2,rx*.28),Math.max(2,ry*.28),p.base);
  }else g.ring(cx,cy,rx,ry,p.base);
  if(d>=1){
   g.oval(cx-rx*.36,cy-ry*.5,rx*.27,ry*.15,p.shine);
   for(const sign of [-1,1]){
    g.ring(cx+sign*Math.round(rx*.6),cy+ry-1,Math.max(2,rx*.28),Math.max(1,ry*.24),p.base);
   }
  }
  if(o.extra==='horns'){
   for(const sign of [-1,1]){
    const x=cx+sign*Math.round(rx*.51),top=cy-ry+1;
    g.poly([[x-2,top+3],[x+2,top+3],[x,top-Math.max(2,d+2)]],'k');
    g.poly([[x-1,top+2],[x+1,top+2],[x,top-1]],'Y');
   }
  }else if(o.extra==='antenna'){
   for(const sign of [-1,1]){
    const x=cx+sign*Math.round(rx*.42),top=cy-ry+1;
    g.line(x,top,x+sign*2,top-3,'k');g.ring(x+sign*2,top-3,Math.max(1,d),Math.max(1,d),'p');
   }
  }else if(o.extra==='crown')ornament(g,L,{extra:'crown'});
  const eyes=o.eyes||'two',ey=cy-Math.round(ry*.18),r=Math.max(1,Math.round(rx*.2));
  if(eyes==='one')eye(g,cx,ey,Math.max(2,Math.round(rx*.34)),'sparkle',0);
  else if(eyes==='three'){
   for(const [x,y] of [[cx-rx*.44,ey],[cx,ey-2],[cx+rx*.44,ey]])eye(g,x,y,Math.max(1,Math.round(rx*.16)),'round',0);
  }else{
   eye(g,cx-rx*.38,ey,r,o.face==='happy'?'happy':'sparkle',0);
   eye(g,cx+rx*.38,ey,r,o.face==='happy'?'happy':'sparkle',1);
  }
  const my=cy+Math.round(ry*.46);
  if(o.mouth==='surprised')g.ring(cx,my,Math.max(1,d),Math.max(1,d),'r');
  else if(o.mouth==='tongue'){
   g.line(cx-3,my,cx+3,my,'k');g.rect(cx-1,my+1,3,Math.max(1,d),'p');
   g.set(cx,my+1,'r');
  }else{
   g.line(cx-Math.max(2,d+1),my-1,cx-2,my+1,'k');
   g.line(cx-2,my+1,cx+2,my+1,'k');
   g.line(cx+2,my+1,cx+Math.max(2,d+1),my-1,'k');
   if(d>=2){g.set(cx-2,my,'w');g.set(cx+2,my,'w')}
  }
  if(d>=1){g.set(cx-rx*.62,cy+ry*.26,'t');g.set(cx+rx*.62,cy+ry*.26,'t')}
  if(d>=2)g.oval(cx,cy+ry*.83,Math.max(2,rx*.23),Math.max(1,ry*.1),p.shadow);
 }
 function drawRobot(g,L,o){
  const p=palette(o,'robot'),[cx,cy,rx,ry]=L.head,[bx,by,brx,bry]=L.body,d=L.d;
  accents(g,L,o);
  const top=Math.round(cy-ry*.65),hh=Math.round(ry*1.5),ww=Math.round(rx*1.9),x=Math.round(cx-ww/2);
  if(o.extra==='one'||o.extra==='two'){
   const positions=o.extra==='one'?[cx]:[cx-rx*.47,cx+rx*.47];
   for(const px of positions){
    g.rect(px,top-5,1,5,'k');g.ring(px,Math.max(1,top-5),Math.max(1,d>1?2:1),Math.max(1,d>1?2:1),'Y');
   }
  }
  for(const sign of [-1,1]){
   const ax=bx+sign*(brx+2);
   g.roundedRing(ax-2,by-3,5,Math.max(5,bry*.8),2,p.shadow);
   g.ring(ax,by+Math.max(2,bry*.35),Math.max(1.5,brx*.24),Math.max(1.5,bry*.26),p.base);
  }
  g.roundedRing(bx-brx,by-bry,brx*2+1,bry*2+1,Math.max(1,Math.round(brx*.36)),p.base);
  if(d>=1)for(const sign of [-1,1]){
   g.ring(bx+sign*Math.round(brx*.52),Math.min(L.h-2,by+bry-1),Math.max(2,brx*.32),Math.max(1.5,bry*.29),p.shadow);
  }
  const rad=o.kind==='round'?Math.round(rx*.75):o.kind==='tall'?Math.round(rx*.17):Math.round(rx*.35);
  g.roundedRing(x,top,ww,hh,rad,p.base);
  const screenW=Math.round(ww*.79),screenH=Math.max(4,Math.round(hh*.48));
  const sx=Math.round(cx-screenW/2),sy=top+Math.max(2,Math.round(hh*.21));
  g.roundedRing(sx,sy,screenW,screenH,Math.max(1,Math.round(d*.7)),'u');
  if(d>=1)g.rect(sx+2,sy+2,Math.max(2,Math.round(screenW*.18)),1,'b');
  const ey=sy+Math.round(screenH*.54),sep=Math.max(2,Math.round(rx*.37));
  if(o.eyes==='visor'){
   g.rounded(sx+2,ey-1,screenW-4,Math.max(2,d),1,'b');
   if(d>=2){g.rect(cx-2,ey,3,1,'w');g.set(cx+4,ey,'w')}
  }else if(o.eyes==='sleepy'){
   g.line(cx-sep-1,ey,cx-sep+2,ey+1,'H');
   g.line(cx+sep-1,ey+1,cx+sep+2,ey,'H');
  }else{
   g.ring(cx-sep,ey,Math.max(1,rx*.2),Math.max(1,rx*.19),'b');
   g.ring(cx+sep,ey,Math.max(1,rx*.2),Math.max(1,rx*.19),'b');
   if(d>=1){g.set(cx-sep-1,ey-1,'w');g.set(cx+sep-1,ey-1,'w')}
  }
  if(d>=1){
   for(const px of [x+1,x+ww-2]){g.set(px,top+hh*.57,'s');if(d>=2)g.set(px,top+hh*.7,'k')}
   const cw=Math.max(5,Math.round(brx*1.18)),ch=Math.max(4,Math.round(bry*.75));
   const left=bx-Math.round(cw/2),topChest=by-Math.round(bry*.55);
   g.roundedRing(left,topChest,cw,ch,2,'w');
   // Symbole na panelu muszą nadpisywać białe wypełnienie, a nie znikać pod nim.
   const sy=topChest+Math.max(2,Math.round(ch*.3));
   if(o.mouth==='heart'){
    g.set(bx-1,sy,'r');g.set(bx+1,sy,'r');
    g.rect(bx-2,sy+1,5,1,'r');
    g.rect(bx-1,sy+2,3,1,'r');g.set(bx,sy+3,'r');
   }else if(o.mouth==='star'){
    g.set(bx,sy-1,'Y');g.rect(bx-2,sy,5,1,'Y');g.set(bx,sy+1,'Y');g.set(bx,sy+2,'Y');
   }else{
    g.set(bx-2,sy,'r');g.set(bx,sy,'Y');g.set(bx+2,sy,'l');
    if(d>=2)g.rect(bx-2,sy+2,5,1,'a');
   }
   if(d>=3){
    for(const px of [bx-brx+2,bx+brx-2]){g.set(px,by+2,'s');g.set(px,by+4,'k')}
    g.rect(bx-2,by+bry*.54,5,1,'s');
   }
  }
 }
 return Object.freeze({levels,allowed,palettes,palette,board,flower,drawAnimal,drawMonster,drawRobot});
})();
