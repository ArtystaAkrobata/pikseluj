'use strict';
/* Bajkowe światy mają osobną kompozycję (nie bitmapę rozciąganą do A4). */
const MagicPremiumArt=(()=>{
 const C=MagicPremiumCore;
 function drawWorld(g,L,o){
  const {w,h,d}=L;
  const kind=o.kind||'castle';
  const theme=C.palette(o,'world');
  const horizon=Math.round(h*.73);
  const sky=o.eyes||'day';
  const tint=sky==='night'?'u':sky==='evening'?'t':'b';
  // Nie pokrywaj całej kartki tłem: rysowanie w zeszycie ma pozostać przyjemne.
  if(d>=2){
   g.rect(0,0,w,Math.max(2,Math.round(h*.065)),tint);
   for(let x=3;x<w-3;x+=Math.max(5,Math.round(w*.2)))g.set(x,Math.round(h*.08),tint);
  }
  const sunX=Math.round(w*.79),sunY=Math.max(3,Math.round(h*.16));
  if(sky==='night'){
   g.ring(sunX,sunY,Math.max(2,w*.075),Math.max(2,w*.075),'H');
   g.oval(sunX+1,sunY-1,Math.max(1,w*.047),Math.max(1,w*.047),'w');
   g.sparkle(Math.round(w*.16),Math.round(h*.14),'H');
  }else{
   g.ring(sunX,sunY,Math.max(2,w*.075),Math.max(2,w*.075),sky==='evening'?'O':'Y');
   if(d>=2)g.sparkle(Math.round(w*.17),Math.round(h*.14),'H');
  }
  if(kind==='sea'){
   g.rect(0,horizon,w,h-horizon,'b');
   for(let y=horizon+2;y<h;y+=Math.max(2,Math.round(h*.075)))
    for(let x=(y%4);x<w-3;x+=6)g.rect(x,y,Math.min(3,w-x),1,y%3?'w':'a');
  }else{
   g.poly([[0,horizon+2],[w*.26,horizon-1],[w*.52,horizon+2],[w*.76,horizon-2],[w,horizon+1],[w,h],[0,h]],'g');
   g.rect(0,horizon+Math.round((h-horizon)*.4),w,Math.ceil((h-horizon)*.61),'l');
  }
  const sc=Math.max(1,Math.round(w/25));
  function flower(x,y){C.flower(g,x,y)}
  function turret(x,top,bottom,ww){
   x=Math.round(x);top=Math.round(top);bottom=Math.round(bottom);ww=Math.max(3,Math.round(ww));
   g.rect(x-1,top-1,ww+2,bottom-top+2,'k');
   g.rect(x,top,ww,bottom-top,theme.base);
   g.rect(x-1,top-2,ww+2,2,'n');
   for(let xx=x-1;xx<=x+ww;xx+=Math.max(2,Math.floor(ww/3)))
    g.rect(xx,top-4,Math.min(2,ww),2,'n');
   if(d>=1)g.rect(x+Math.floor(ww/2),top+Math.max(3,Math.floor((bottom-top)*.3)),1,Math.max(2,sc),'Y');
   if(d>=2){
    g.poly([[x-2,top-2],[x+ww/2,top-Math.max(5,Math.round(h*.12))],[x+ww+2,top-2]],'k');
    g.poly([[x,top-2],[x+ww/2,top-Math.max(3,Math.round(h*.1))],[x+ww,top-2]],'r');
    g.set(x+Math.floor(ww/2),top-3,'Y');
   }
  }
  if(kind==='castle'){
   const left=Math.round(w*.22),right=Math.round(w*.78);
   const floor=horizon+Math.round((h-horizon)*.35);
   const cw=Math.round(w*.48),cx=Math.round((w-cw)/2),mid=Math.round(h*.39);
   g.roundedRing(cx,mid,cw,Math.max(5,floor-mid),2,theme.base);
   const tw=Math.max(4,Math.round(w*.19));
   turret(left-tw/2,Math.round(h*.28),floor,tw);
   turret(right-tw/2,Math.round(h*.28),floor,tw);
   g.poly([[cx+1,mid],[w/2,mid-Math.max(3,Math.round(h*.1))],[cx+cw-1,mid]],'r');
   if(d>=1){
    g.line(w/2,mid-3,w/2,mid-8,'n');
    g.rect(w/2,mid-9,Math.max(2,sc),Math.max(2,sc),'Y');
   }
   const dw=Math.max(3,Math.round(w*.16)),dh=Math.max(4,Math.round(h*.14));
   g.roundedRing(Math.round(w/2-dw/2),floor-dh+1,dw,dh,Math.max(1,dw*.4),'n');
   if(d>=1){
    const wy=mid+Math.round((floor-mid)*.34);
    g.rect(Math.round(w*.43),wy,Math.max(1,sc),Math.max(2,sc*2),'Y');
    g.rect(Math.round(w*.56),wy,Math.max(1,sc),Math.max(2,sc*2),'Y');
   }
   if(d>=2){
    for(const x of [left,right])g.rect(x-2,Math.round(h*.42),Math.max(2,sc+1),Math.max(2,sc*2),'b');
    g.poly([[w/2-2,floor],[w/2+2,floor],[w*.62,h],[w*.36,h]],'e');
    g.line(w*.48,floor+2,w*.44,h-1,'H');
    g.set(w*.18,h*.81,'p');g.set(w*.85,h*.77,'Y');
   }
  }else if(kind==='forest'){
   function tree(x,top,height){
    const trunk=Math.max(1,Math.round(w*.07));
    const bottom=horizon+Math.round((h-horizon)*.58);
    g.rect(x-Math.floor(trunk/2),top+Math.round(height*.43),trunk,bottom-top,'n');
    g.ring(x,top+Math.round(height*.35),Math.max(3,w*.18),Math.max(4,height*.43),'d');
    g.oval(x-w*.055,top+height*.27,Math.max(1,w*.09),Math.max(2,height*.13),'l');
    if(d>=2){
     g.set(x+w*.07,top+height*.33,'H');
     g.set(x-w*.12,top+height*.45,'l');
    }
   }
   tree(Math.round(w*.19),Math.round(h*.3),Math.round(h*.35));
   tree(Math.round(w*.76),Math.round(h*.2),Math.round(h*.47));
   const x=Math.round(w*.5),y=horizon+2;
   g.rect(x-1,y,2,Math.max(3,Math.round(h*.11)),'c');
   g.ring(x,y,Math.max(3,w*.115),Math.max(2,w*.09),theme.base);
   g.set(x-2,y-1,'w');g.set(x+2,y,'w');
   if(d>=1){
    g.set(x,y,'H');g.set(x+1,y+1,'w');
    g.set(Math.round(w*.35),h-3,'Y');g.set(Math.round(w*.67),h-3,'p');
   }
   if(d>=2){flower(Math.round(w*.37),h-4);flower(Math.round(w*.64),h-4)}
  }else if(kind==='garden'){
   const ww=Math.round(w*.41),xx=Math.round(w/2-ww/2);
   const roof=Math.round(h*.41),floor=horizon+2;
   g.roundedRing(xx,roof+Math.max(3,Math.round(h*.1)),ww,Math.max(3,floor-roof),2,'c');
   g.poly([[xx-2,roof+Math.round(h*.15)],[w/2,roof-3],[xx+ww+2,roof+Math.round(h*.15)]],'k');
   g.poly([[xx+1,roof+Math.round(h*.12)],[w/2,roof],[xx+ww-1,roof+Math.round(h*.12)]],theme.base);
   const dx=Math.round(w*.47),dy=floor-Math.round(h*.13);
   g.roundedRing(dx,dy,Math.max(3,Math.round(w*.12)),Math.max(4,Math.round(h*.12)),2,'n');
   if(d>=1)for(const x of [xx+2,xx+ww-4]){
    g.rect(x,roof+Math.round(h*.16),Math.max(2,sc),Math.max(2,sc),'b');
    g.set(x+1,roof+Math.round(h*.17),'w');
   }
   for(const x of [Math.round(w*.1),Math.round(w*.86)]){
    const y=horizon+Math.round((h-horizon)*.23);
    g.line(x,y+2,x,h-3,'g');
    g.oval(x,y,Math.max(2,sc*1.5),Math.max(2,sc*1.5),'p');
    g.set(x,y,'Y');
   }
   if(d>=2){flower(Math.round(w*.27),h-5);flower(Math.round(w*.7),h-4)}
  }else{
   const x=Math.round(w*.31),y=Math.round(h*.29);
   const ww=Math.max(5,Math.round(w*.26)),hh=horizon-y+Math.round(h*.12);
   g.roundedRing(x,y,ww,hh,Math.max(1,sc),'w');
   const band=Math.max(2,Math.round(hh*.13));
   g.rect(x+1,y+Math.round(hh*.38),ww-2,band,theme.base);
   if(d>=2)g.rect(x+1,y+Math.round(hh*.68),ww-2,band,theme.base);
   g.rect(x-2,y-3,ww+4,4,'k');g.rect(x-1,y-2,ww+2,2,theme.base);
   g.rect(x+Math.round(ww*.28),y-8,Math.max(2,Math.round(ww*.45)),6,'k');
   g.rect(x+Math.round(ww*.28)+1,y-7,Math.max(1,Math.round(ww*.45)-2),4,'Y');
   g.rect(x+Math.round(ww*.49),y-11,1,3,'n');
   const rockY=horizon+Math.round((h-horizon)*.26);
   g.poly([[0,rockY+3],[w*.15,rockY-4],[w*.41,rockY+3],[w*.46,h],[0,h]],'s');
   if(d>=1)for(let yy=horizon+2;yy<h-2;yy+=Math.max(3,sc*2))
    g.line(w*.53,yy,w*.85,yy,'w');
  }
  if(kind!=='sea'&&d>=1){
   flower(Math.round(w*.08),h-3);
   flower(Math.round(w*.9),h-3);
  }
  if(d>=3){
   // Dodatki zależne od krainy: powtarzalne i dopracowane, bez przypadkowych plamek.
   if(kind==='castle'){
    g.rect(Math.round(w*.15),Math.round(h*.43),2,5,'n');
    g.poly([[w*.13,h*.43],[w*.15,h*.38],[w*.19,h*.43]],'r');
    g.rect(Math.round(w*.84),Math.round(h*.44),2,5,'n');
    g.poly([[w*.81,h*.44],[w*.85,h*.39],[w*.89,h*.44]],'r');
   }else if(kind==='forest'){
    for(const x of [Math.round(w*.28),Math.round(w*.55)]){
     const y=horizon+Math.round((h-horizon)*.33);
     g.rect(x,y,2,4,'c');g.oval(x+1,y,3,2,theme.base);
     g.set(x-1,y-1,'w');g.set(x+2,y,'w');
    }
   }else if(kind==='garden'){
    g.rect(Math.round(w*.2),horizon+3,Math.round(w*.18),1,'w');
    g.rect(Math.round(w*.65),horizon+3,Math.round(w*.16),1,'w');
    g.poly([[w*.43,horizon+2],[w*.57,horizon+2],[w*.68,h],[w*.32,h]],'e');
   }else{
    g.line(Math.round(w*.64),Math.round(h*.27),Math.round(w*.68),Math.round(h*.25),'k');
    g.line(Math.round(w*.68),Math.round(h*.25),Math.round(w*.72),Math.round(h*.27),'k');
    g.line(Math.round(w*.74),Math.round(h*.32),Math.round(w*.78),Math.round(h*.3),'k');
    g.line(Math.round(w*.78),Math.round(h*.3),Math.round(w*.82),Math.round(h*.32),'k');
   }
  }
  if(o.extra==='stars'){
   g.sparkle(Math.max(3,Math.round(w*.17)),Math.max(3,Math.round(h*.17)),'H');
   if(d>=2)g.sparkle(Math.round(w*.56),Math.max(3,Math.round(h*.11)),'Y');
  }else if(o.extra==='cloud'){
   const cx=Math.max(4,Math.round(w*.24)),cy=Math.max(3,Math.round(h*.18));
   g.ring(cx,cy,Math.max(2,w*.11),Math.max(1,w*.05),'w');
   if(d>=2)g.ring(cx+w*.25,cy+2,Math.max(2,w*.11),Math.max(1,w*.05),'w');
  }else if(o.extra==='hearts')g.heart(Math.round(w*.18),Math.round(h*.17),'p');
 }
 function render(category,options={},level='medium'){
  const L=C.levels[level]||C.levels.medium;
  const g=C.board(L.w,L.h);
  const o={kind:'cat',eyes:'sparkle',extra:'bow',color:'natural',mouth:'smile',scene:'stars',...options};
  if(category==='worlds'&&typeof MagicApprovedCastles!=='undefined')
   return MagicApprovedCastles.render(level,o);
  // Zatwierdzone wzory potworków: osobny projekt dla każdego poziomu, bez skalowania. 
  if(category==='monsters'&&typeof MagicApprovedMonsters!=='undefined')
   return MagicApprovedMonsters.render(level,o);
  // Cztery zatwierdzone roboty: natywne pełne kratki i osobne warstwy kreatora.
  if(category==='robots'&&typeof MagicApprovedRobots!=='undefined')
   return MagicApprovedRobots.render(level,o);
  // Kotki zaakceptowane przez użytkownika: cztery dokładne tablice, bez rysowania z geometrii.
  if(category==='animals'&&o.kind==='cat'&&typeof MagicApprovedCats!=='undefined')
   return MagicApprovedCats.render(level,o);
  if(category==='animals'&&o.kind==='dog'&&typeof MagicApprovedDogs!=='undefined')
   return MagicApprovedDogs.render(level,o);
  // Pozostałe zwierzęta — rysunki z natywnych kratek pod kreator.
  if(category==='animals'&&typeof MagicAnimalStudio!=='undefined'&&Object.hasOwn(MagicAnimalStudio.names,o.kind))
   return MagicAnimalStudio.render(o.kind,o,level);
  // Cztery niezależne, zaakceptowane kompozycje liska — poziom decyduje o pozie.
  if(category==='animals'&&o.kind==='fox'&&typeof MagicFoxStages!=='undefined')
   return MagicFoxStages.render(o,level);
  // Nowe projekty pozostałych zwierząt i trzech kategorii: oddzielne sylwetki dla każdego motywu.
  if(typeof MagicStoryArt!=='undefined'){
   if(category==='animals'&&['cat','bear','bunny'].includes(o.kind))
    return MagicStoryArt.render(category,o,level);
   if(category==='monsters'||category==='robots'||category==='worlds')
    return MagicStoryArt.render(category,o,level);
  }
  if(category==='animals'&&o.kind==='fox'&&typeof MagicFoxPoses!=='undefined')
   return MagicFoxPoses.render(o,level);
  if(category==='animals'&&typeof MagicCuratedAnimals!=='undefined'&&MagicCuratedData[o.kind])
   return MagicCuratedAnimals.render(o.kind,o,level);
  if(category==='animals')C.drawAnimal(g,L,o);
  else if(category==='monsters')C.drawMonster(g,L,o);
  else if(category==='robots')C.drawRobot(g,L,o);
  else if(category==='worlds')drawWorld(g,L,o);
  else C.drawAnimal(g,L,o);
  return g.rows();
 }
 return Object.freeze({render,levels:C.levels,allowed:C.allowed});
})();
