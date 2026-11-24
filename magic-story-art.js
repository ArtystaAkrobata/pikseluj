'use strict';
/* Pikseluj: autorskie kompozycje innych bohaterów.
 * Każdy motyw jest projektowany w docelowych kratkach. Brak bitmapowego
 * rozciągania i losowego mieszania niepasujących części. */
const MagicStoryArt=(()=>{
 const levels={easy:[16,16],medium:[24,24],hard:[32,40],expert:[40,56]};
 const palette={
  k:'k',natural:'v',p:'p',v:'v',b:'b',l:'l',O:'O',w:'w',n:'n',e:'e'
 };
 const colorsets={
  p:{base:'p',shade:'X',light:'t'},v:{base:'v',shade:'u',light:'p'},
  b:{base:'b',shade:'a',light:'w'},l:{base:'l',shade:'d',light:'H'},
  O:{base:'O',shade:'n',light:'H'},n:{base:'n',shade:'e',light:'c'},
  w:{base:'w',shade:'s',light:'w'},e:{base:'e',shade:'n',light:'c'}
 };
 function make(level){
  const [w,h]=levels[level]||levels.medium,detail=['easy','medium','hard','expert'].indexOf(level);
  const cells=Array.from({length:h},()=>Array(w).fill('.'));
  // Nie rozciągamy bohaterów na pionowych kartkach A4.
  // Prawdziwy kwadrat jest centrowany, dodatkowe rzędy służą scenie.
  const scale=w/24,offsetY=(h-w)/2;
  const x=v=>Math.round(v*scale),y=v=>Math.round(v*scale+offsetY);
  const at=(xx,yy,c,onlyBlank=false)=>{
   xx=Math.round(xx); yy=Math.round(yy);
   if(xx>=0&&xx<w&&yy>=0&&yy<h&&(!onlyBlank||cells[yy][xx]==='.'))cells[yy][xx]=c;
  };
  const xy=(xx,yy,c)=>at(x(xx),y(yy),c);
  const rect=(ax,ay,bx,by,c)=>{
   const x1=x(ax),y1=y(ay),x2=x(bx),y2=y(by);
   const left=Math.min(x1,x2),right=Math.max(x1,x2)+Number(x1===x2);
   const top=Math.min(y1,y2),bottom=Math.max(y1,y2)+Number(y1===y2);
   for(let j=Math.max(0,top);j<Math.min(h,bottom);j++)
    for(let i=Math.max(0,left);i<Math.min(w,right);i++)at(i,j,c);
  };
  const oval=(cx,cy,rx,ry,c)=>{
   const xx=x(cx),yy=y(cy),rrx=Math.max(1,Math.round(rx*scale)),rry=Math.max(1,Math.round(ry*scale));
   for(let j=Math.max(0,yy-rry);j<=Math.min(h-1,yy+rry);j++)
    for(let i=Math.max(0,xx-rrx);i<=Math.min(w-1,xx+rrx);i++)
     if(((i-xx)/rrx)**2+((j-yy)/rry)**2<=1.04)at(i,j,c);
  };
  const poly=(pts,c)=>{
   const p=pts.map(([ax,ay])=>[x(ax),y(ay)]);
   const minx=Math.max(0,Math.floor(Math.min(...p.map(t=>t[0])))),maxx=Math.min(w-1,Math.ceil(Math.max(...p.map(t=>t[0]))));
   const miny=Math.max(0,Math.floor(Math.min(...p.map(t=>t[1])))),maxy=Math.min(h-1,Math.ceil(Math.max(...p.map(t=>t[1]))));
   for(let j=miny;j<=maxy;j++)for(let i=minx;i<=maxx;i++){
    let inside=false;
    for(let q=0,k=p.length-1;q<p.length;k=q++){
     const [ax,ay]=p[q],[bx,by]=p[k];
     if((ay>j+.5)!==(by>j+.5)&&i+.5<(bx-ax)*(j+.5-ay)/(by-ay)+ax)inside=!inside;
    }
    if(inside)at(i,j,c);
   }
  };
  const line=(ax,ay,bx,by,c)=>{
   let xx=x(ax),yy=y(ay),ex=x(bx),ey=y(by);
   const dx=Math.abs(ex-xx),dy=-Math.abs(ey-yy),sx=xx<ex?1:-1,sy=yy<ey?1:-1;let err=dx+dy;
   while(true){at(xx,yy,c);if(xx===ex&&yy===ey)break;const q=2*err;if(q>=dy){err+=dy;xx+=sx}if(q<=dx){err+=dx;yy+=sy}}
  };
  const solid=(fn,c)=>{
   const before=cells.map(row=>row.slice());
   fn('#');
   const mark=cells.map(row=>row.map(t=>t==='#'));
   // Delikatne zagłębienie konturu wyłącznie do wewnątrz sylwetki.
   for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(mark[j][i]){
    const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>!mark[j+dy]?.[i+dx]&&before[j+dy]?.[i+dx]!==c);
    cells[j][i]=edge?'k':c;
   }
  };
  const safe=(ax,ay,c)=>{
   const xx=x(ax),yy=y(ay);
   if(xx>=1&&xx<w-1&&yy>=1&&yy<h-1&&cells[yy][xx]==='.'
    &&[[1,0],[-1,0],[0,1],[0,-1]].every(([dx,dy])=>cells[yy+dy][xx+dx]==='.'))
    at(xx,yy,c);
  };
  const sparkle=(xx,yy,c='Y')=>{
   const cx=x(xx),cy=y(yy),pts=[[0,0],[1,0],[-1,0],[0,1],[0,-1]];
   if(pts.every(([dx,dy])=>cx+dx>0&&cx+dx<w-1&&cy+dy>0&&cy+dy<h-1&&cells[cy+dy][cx+dx]==='.'))
    pts.forEach(([dx,dy])=>at(cx+dx,cy+dy,c));
  };
  const rows=()=>cells.map(row=>row.join(''));
  return {w,h,detail,cells,x,y,at,xy,rect,oval,poly,line,solid,safe,sparkle,rows};
 }
 function colors(options,category,kind){
  const key=options.color==='natural'||!options.color
   ?(category==='animals'?({cat:'e',bear:'n',bunny:'w'})[kind]||'O':category==='robots'?'b':category==='worlds'?'v':'v')
   :options.color;
  return colorsets[key]||colorsets.v;
 }
 function face(P,cx,cy,style='happy',mouth='smile',scale='normal'){
  const big=P.detail>=2,wide=scale==='wide';
  const sep=wide?3.5:2.3;
  if(style==='one'){
   P.oval(cx,cy,2,big?2.4:2,'w');P.oval(cx,cy+.3,1.15,1.2,'k');P.xy(cx-.4,cy-.7,'w');
  }else if(style==='wink'){
   P.oval(cx-sep,cy,1.5,big?2:1.4,'w');P.xy(cx-sep,cy+.3,'k');
   P.line(cx+sep-1,cy+.1,cx+sep,cy-1,'k');P.line(cx+sep,cy-1,cx+sep+1,cy+.1,'k');
  }else if(style==='sparkle'){
   for(const xx of [cx-sep,cx+sep]){
    P.oval(xx,cy,1.5,big?2:1.4,'w');
    P.xy(xx,cy+.3,'k');
    P.xy(xx-.75,cy-.7,'w');
    if(big)P.xy(xx+1.15,cy+.6,'w');
   }
  }else if(style==='three'){
   for(const xx of [cx-3.9,cx,cx+3.9]){
    P.oval(xx,cy,1.25,1.3,'w');
    P.xy(xx,cy,'k');
   }
  }else if(style==='happy'||style==='sleepy'){
   P.line(cx-sep-1,cy,cx-sep,cy-1,'k');P.line(cx-sep,cy-1,cx-sep+1,cy,'k');
   P.line(cx+sep-1,cy,cx+sep,cy-1,'k');P.line(cx+sep,cy-1,cx+sep+1,cy,'k');
  }else if(style==='visor'){
   P.rect(cx-5,cy-1.6,cx+5,cy+1.5,'k');P.rect(cx-4,cy-1,cx+4,cy+.8,'b');
   if(big)P.line(cx-3,cy-.5,cx-2,cy-.5,'w');
  }else{
   for(const xx of [cx-sep,cx+sep]){
    P.oval(xx,cy,1.5,big?2:1.4,'w');P.xy(xx,cy+.3,'k');
    if(P.detail>=1&&style!=='round')P.xy(xx-.5,cy-.6,'w');
   }
  }
  if(mouth==='tongue'){P.line(cx-1,cy+3,cx+1,cy+3,'k');P.xy(cx,cy+3.8,'r');}
  else if(mouth==='surprised'){P.oval(cx,cy+3,1,1,'k');}
  else if(P.detail>0){P.line(cx-1.1,cy+3,cx,cy+3.6,'k');P.line(cx,cy+3.6,cx+1.1,cy+3,'k');}
  else P.xy(cx,cy+3,'k');
 }
 function animal(P,kind,o){
  const d=P.detail,p=colors(o,'animals',kind);
  if(d===0){
   // Ikonka do pierwszej klasy: duża głowa zamiast małego ciała.
   P.solid(c=>{
    if(kind==='cat')for(const sign of [-1,1])P.poly([[12+sign*3,7],[12+sign*7,2],[12+sign*8,11]],c);
    if(kind==='bunny')for(const sign of [-1,1])P.oval(12+sign*4,4,2,4,c);
    if(kind==='bear')for(const sign of [-1,1])P.oval(12+sign*6,7,3,3,c);
    P.oval(12,13,8,8,c);
   },p.base);
   if(kind==='cat'||kind==='bunny')for(const sign of [-1,1])P.xy(12+sign*5,6,'p');
   P.oval(12,17,3,2,kind==='bunny'?'c':'w');
   face(P,12,12,o.eyes==='wink'?'wink':o.eyes==='happy'?'happy':o.eyes==='sparkle'?'sparkle':'round',o.mouth||'smile');
   P.xy(12,16,'k');
  }else{
   P.solid(c=>{
    // Ogon i łapki należą do jednej kompletnej sylwetki z czystym obrysem.
    if(kind==='cat')P.poly([[16,16],[20,14],[22,17],[23,21],[20,22],[17,20]],c);
    if(kind==='bunny')P.oval(19,18,2.3,3,c);
    P.oval(12,18,5.3,5.2,c);
    for(const sx of [-1,1])P.oval(12+sx*3.2,21,2.6,2,c);
    if(kind==='bear')for(const sx of [-1,1])P.oval(12+sx*6.5,5.5,3.3,3.4,c);
    if(kind==='cat')for(const sx of [-1,1])P.poly([[12+sx*4.4,8],[12+sx*7.8,2],[12+sx*8.4,11]],c);
    if(kind==='bunny')for(const sx of [-1,1])P.oval(12+sx*4,4,2.5,5,c);
    P.oval(12,10.4,7.5,7.8,c);
   },p.base);
   P.oval(12,18.8,3.4,3.6,'c');
   if(kind==='cat'||kind==='bunny')for(const sx of [-1,1])P.oval(12+sx*5,5.5,1.4,2.3,'p');
   if(kind==='cat'){
    // Biały czubek, odseparowany kontur ogona i łapki wyraźne przy wydruku.
    P.oval(20.2,17.1,1.1,1.8,'w');
    if(d>=1)P.line(17,19,19,20,'k');
   }
   P.oval(12,13.5,3,1.7,'w');
   face(P,12,10.4,o.eyes==='wink'?'wink':o.eyes==='happy'?'happy':o.eyes==='sparkle'?'sparkle':'round',o.mouth||'smile');
   P.xy(12,13,'k');
   if(d>=2){P.xy(5,13,'p');P.xy(19,13,'p');P.xy(9,5,p.light);P.xy(8,20,p.shade);P.xy(16,20,p.shade);}
   if(kind==='cat'&&d>=2)for(const sx of [-1,1])for(const yy of [14,15])P.line(12+sx*6,yy,12+sx*8,yy-.4,'k');
  }
  if(o.extra==='bow'){
   P.xy(18,5,'r');P.xy(20,5,'r');P.xy(19,6,'Y');
  }else if(o.extra==='flower'){
   for(const [xx,yy] of [[18,5],[20,5],[19,4],[19,6]])P.xy(xx,yy,'p');
   P.xy(19,5,'Y');
  }else if(o.extra==='star')P.sparkle(20,4,'Y');
  else if(o.extra==='crown'){
   P.rect(9,2.2,15,4,'Y');
   for(const xx of [9,12,15])P.xy(xx,1.8,'Y');
  }else if(o.extra==='scarf'&&d>0){
   P.rect(8.5,15.1,15.5,16.7,'r');
   P.rect(14,15.2,16,19.1,'r');
   if(d>=2)P.xy(14.5,17,'Y');
  }
  if(d>=2 && o.scene==='stars')P.sparkle(3,8,'Y');
  if(d>=2 && o.scene==='flowers')P.safe(3,20,'p');
  if(d>=2 && o.scene==='hearts')P.safe(20,18,'p');
  return P;
 }
 function monster(P,kind,o){
  // Cztery różne kompozycje zamiast powiększania jednej plamy:
  // Łatwy = portret, Średni = siedzący pupil, Trudny = skrzydlaty bohater,
  // Ekspert = stworek-czarodziej z własną sceną.
  const d=P.detail,p=colors(o,'monsters',kind),hy=d===0?12.5:d===1?9.6:d===2?8.1:7.8;
  const rx=d===0?8.3:d===1?6.7:6.4,ry=d===0?7.5:d===1?6.1:5.9;
  const bodyColor=p.base;
  if(d>=2){
   // Skrzydła i zakręcony ogon są NA ZEWNĄTRZ tułowia, nie zlewają się w jednolitą bryłę.
   if(kind==='round'){
    P.poly([[7,13],[2,8],[3,15],[1,18],[8,20]],'k');
    P.poly([[6.5,14],[3,11],[4,16],[7,18]],'b');
    P.poly([[17,13],[22,8],[21,15],[23,18],[16,20]],'k');
    P.poly([[17.5,14],[21,11],[20,16],[17,18]],'b');
    P.poly([[17,19],[22,17],[23,13],[22,21],[18,23]],'k');
    P.poly([[18,19],[21,18],[21,21],[19,22]],p.shade);
   }else if(kind==='square'){
    P.rect(2,14,8,17,'k');P.rect(16,14,22,17,'k');
    P.rect(2,14.5,7,16.4,'s');P.rect(17,14.5,22,16.4,'s');
   }else{
    P.poly([[6,16],[2,13],[3,20],[8,19]],'k');
    P.poly([[18,16],[22,13],[21,20],[16,19]],'k');
    P.poly([[6,16],[3,15],[5,18]],p.light);
    P.poly([[18,16],[21,15],[19,18]],p.light);
   }
  }
  P.solid(c=>{
   if(d>=1){
    if(kind==='square')P.rect(7,13,17,20.7,c);
    else P.oval(12,17,kind==='jelly'?6.4:5.2,5.2,c);
    if(d>=2){
     P.oval(5.2,16.8,2.4,2.8,c);P.oval(18.8,16.8,2.4,2.8,c);
    }else{
     P.oval(6.9,16.5,2.1,2.8,c);P.oval(17.1,16.5,2.1,2.8,c);
    }
    for(const xx of [8.1,15.9])P.oval(xx,21,2.7,1.8,c);
   }
   if(kind==='square'){
    P.rect(d===0?3.5:5.5,hy-ry,d===0?20.5:18.5,hy+ry,c);
    P.rect(4.2,hy-ry-2,7.5,hy-ry+2,c);
    P.rect(16.5,hy-ry-2,19.8,hy-ry+2,c);
   }else if(kind==='jelly'){
    P.oval(12,hy,rx,ry,c);
    for(const xx of d===0?[6,10,14,18]:[7,10,14,17])
     P.oval(xx,hy+ry-1,1.8,2.5,c);
   }else{
    P.oval(12,hy,rx,ry,c);
    // Dwa smocze uszy, rozpoznawalne również na siatce 16×16.
    P.poly([[6.8,hy-3],[4.4,hy-ry-3],[10.1,hy-ry+1]],c);
    P.poly([[17.2,hy-3],[19.6,hy-ry-3],[13.9,hy-ry+1]],c);
   }
  },bodyColor);
  // Celowe grupy światła i cienia dają objętość bez przypadkowej pikselozy.
  if(kind==='jelly'){
   P.oval(8.3,hy-2.8,2.4,1.3,p.light);
   P.oval(12,hy+ry-1.2,3,1,p.shade);
  }else if(kind==='square'){
   P.rect(7,hy-ry+1.5,9.4,hy-ry+2.5,p.light);
   P.rect(16.5,hy+ry-2,18,hy+ry-1,p.shade);
  }else{
   P.oval(8.1,hy-3.4,2.2,1.2,p.light);
   P.xy(7.6,hy-2.3,p.light);
   if(d>=2)P.oval(16,hy+3.8,1.6,1.1,p.shade);
  }
  if(d>=1){
   P.oval(12,18.2,3.5,2.8,p.light);
   P.oval(12,19,2.3,1.6,'c');
   for(const xx of [7.2,16.8]){
    P.xy(xx,21,'k');P.xy(xx+0.8,21,'w');
   }
  }
  // Oczy muszą być duże, błyszczące i naprawdę widoczne na papierze.
  const eyeY=hy-.8,mode=o.eyes||'two';
  const eye=(xx,yy,big=false)=>{
   P.oval(xx,yy,big?2.7:1.9,big?2.6:2.1,'k');
   P.oval(xx,yy-.15,big?2.1:1.5,big?2.1:1.6,'w');
   P.oval(xx+.32,yy+.28,big?1.3:1,1.2,'u');
   P.xy(xx-.6,yy-.7,'w');
   if(d>=2)P.xy(xx+.9,yy+.9,'w');
  };
  if(mode==='one')eye(12,eyeY, true);
  else if(mode==='three'){
   eye(8.5,eyeY+1);eye(15.5,eyeY+1);eye(12,eyeY-2.4);
  }else{eye(8.5,eyeY);eye(15.5,eyeY);}
  // Usta nie mogą przecinać oczu ani wyglądać jak duży czarny krzyż.
  const my=hy+3.3;
  if(o.mouth==='surprised'){
   P.oval(12,my,1.3,1.5,'k');P.xy(12,my+.5,'r');
  }else if(o.mouth==='tongue'){
   P.rect(9.8,my-0.2,14.2,my+1.4,'k');
   P.rect(11,my+.3,13,my+2,'r');
   P.xy(12,my+1.1,'p');
  }else{
   P.line(9.5,my-.2,10.6,my+.8,'k');
   P.line(10.6,my+.8,13.4,my+.8,'k');
   P.line(13.4,my+.8,14.5,my-.2,'k');
   if(d>=1){P.xy(10.6,my+.9,'w');P.xy(13.4,my+.9,'w');}
  }
  for(const xx of [6.4,17.6])P.oval(xx,hy+2.8,1.1,.7,'p');
  if(d>=1)for(const xx of [7.5,16.5])P.xy(xx,16.5,p.shade);
  if(d>=2){
   // Naramienniki, pazurki, kolorowy brzuszek i mikrowzory.
   for(const xx of [4.9,19.1])P.xy(xx,17,'H');
   for(const xx of [8,9.1,14.9,16])P.xy(xx,22,'w');
   P.xy(11,18,'Y');P.xy(13,18,'Y');P.xy(12,19.7,'Y');
   if(d===3){
    P.rect(7.5,13.1,16.5,14.2,'r');P.rect(14.8,13.7,16.2,17.9,'r');
    P.xy(15.4,16.1,'H');
    // Laska z gwiazdą trzymana w łapce, osobna od sylwetki.
    P.line(21,20,21,9,'n');
    P.line(20.9,11,18.7,8,'Y');P.line(21,5.5,21,10,'Y');
    P.line(18.8,8,23,8,'Y');P.xy(21,8,'w');
    P.rect(19,16.7,21.4,18.2,p.base);
    P.line(4,22,20,22,'g');
    P.sparkle(3,4,'H');P.sparkle(22,3,'Y');
   }
  }
  if(o.extra==='horns'){
   for(const xx of [7.3,16.7]){
    P.line(xx,hy-ry-1,xx+(xx<12?-1:1),hy-ry-3,'k');
    P.xy(xx,hy-ry-1,'H');
   }
  }else if(o.extra==='antenna'){
   P.line(12,hy-ry+1,12,hy-ry-3,'k');
   P.xy(12,hy-ry-4,'r');
   P.xy(11.5,hy-ry-4,'Y');
  }else if(o.extra==='crown'){
   P.rect(8.5,hy-ry-2,15.5,hy-ry,'Y');
   for(const xx of [9,12,15])P.xy(xx,hy-ry-3,'H');
   P.xy(12,hy-ry-1,'r');
  }
  return P;
 }
 function robot(P,kind,o){
  const d=P.detail,p=colors(o,'robots',kind),edge=p.base;
  P.solid(c=>{
   if(kind==='round'){
    P.oval(12,14,7,8,c);
    P.oval(12,7.5,5,5,c);
   }else if(kind==='tall'){
    P.rect(6.5,4.5,17.5,13.6,c);P.rect(8,12,16,21,c);
   }else{
    P.rect(5.5,5.3,18.5,15,c);P.rect(8,14,16,21,c);
   }
   for(const sx of [-1,1]){
    P.rect(12+sx*7,14.8,12+sx*9,19,c);
    P.rect(12+sx*5,19.6,12+sx*2,23,c);
   }
   if(o.extra==='one'||o.extra==='two'){
    if(o.extra==='one')P.rect(11,2.3,13,6,c);
    else for(const xx of [7.2,16.8])P.rect(xx-1,2,xx+1,5.5,c);
   }
  },p.base);
  // Facial plate: solid dark rectangle, windows/lenses entirely inside it.
  if(kind==='round')P.oval(12,9,4.4,2.5,'k');
  else P.rect(7,7.4,17,12.7,'k');
  if(o.eyes==='visor'){
   P.rect(8,9.2,16,10.8,'b');if(d>=2)P.xy(9,9,'w');
  }else if(o.eyes==='sleepy'){
   for(const xx of [9.5,14.5])P.line(xx-1,9.5,xx+1,9.5,'w');
  }else{
   for(const xx of [9.5,14.5]){P.rect(xx-1,9,xx+1,11,'b');if(d>=1)P.xy(xx-.5,9,'w');}
  }
  P.rect(9,15,15,19.8,'w');
  if(o.mouth==='star'){
   P.xy(12,16,'Y');P.line(10.5,17,13.5,17,'Y');P.xy(12,18,'Y');
  }else if(o.mouth==='lights'){
   P.xy(10,17,'r');P.xy(12,17,'Y');P.xy(14,17,'g');
  }else{
   P.xy(11,16.5,'r');P.xy(13,16.5,'r');
   P.rect(10.5,17,13.5,18,'r');P.xy(12,19,'r');
  }
  if(d>=2){
   for(const sx of [-1,1]){P.xy(12+sx*7.6,17,'Y');P.xy(12+sx*3.7,22,'u')}
   P.rect(10,20,14,21,'s');
  }
  if(o.scene==='stars'&&d>=1)P.sparkle(3,5,'Y');
  if(o.scene==='hearts'&&d>=2)P.safe(3,6,'r');
  return P;
 }
 function world(P,kind,o){
  const d=P.detail,p=colors(o,'worlds',kind),sky=o.eyes||'day';
  if(kind==='castle'){
   // Średniowieczna twierdza z wieżami, bramą i flagami.
   P.solid(c=>{
    P.rect(5,10.5,19,21,c);
    for(const xx of [5,16.5])P.rect(xx,6.7,xx+2.5,20.5,c);
    for(const xx of [4.6,7.5,16.1,19])P.rect(xx,5.2,xx+1.2,8,c);
    P.poly([[9.3,10.5],[12,7.5],[14.7,10.5]],c);
   },p.base);
   P.poly([[9.5,10.2],[12,7.5],[14.4,10.2]],'r');
   P.rect(9.9,16.5,14.1,21,'k');
   P.rect(10.9,18,13.1,21,'n');
   P.xy(11.5,18.8,'Y');
   for(const xx of [6.2,17.8]){P.rect(xx-1,11,xx+1,14,'k');P.rect(xx-.45,11.8,xx+.5,13.4,'Y');}
   if(d>=1){P.line(12,8,12,4,'n');P.rect(12,4,15,6,'r');P.line(3,22,21,22,'g');}
   if(d>=2){
    for(const xx of [8.5,15.5])P.xy(xx,15,'H');
    for(const xx of [7,10,13,16])P.xy(xx,20,'n');
   }
  }else if(kind==='forest'){
   P.solid(c=>{
    // Grzybowy domek w leśnej dolinie, nie przypadkowe nakładające się elipsy.
    P.poly([[5,12],[7,9],[11,7],[14,7],[18,9],[20,12],[19,14],[5,14]],c);
    P.rect(9,13,16,21,c);
   },p.base);
   P.rect(10,15,14,21,'c');
   P.rect(11,18,13,21,'n');
   P.xy(12,18.5,'Y');
   // Charakterystyczny czerwony kapelusz i białe kropki.
   P.poly([[6,12],[8,9],[12,7.7],[16,9],[18.5,12.5],[18,13.5],[6,13.5]],'r');
   for(const xx of [8.7,12.2,16])P.oval(xx,11,1.15,.8,'w');
   if(d>=1){
    for(const xx of [3,21]){
     P.line(xx,20,xx,13,'n');
     P.poly([[xx-3,17],[xx,9],[xx+3,17]],'d');
     P.poly([[xx-2,14],[xx,7],[xx+2,14]],'l');
    }
   }
   if(d>=2){P.xy(8,9,'H');P.line(6,22,19,22,'g');}
  }else if(kind==='garden'){
   // Dom z daszkiem, kominem, drzwiami i zielonym ogrodem.
   P.solid(c=>{
    P.rect(5,11,19,21,c);
    P.poly([[3,11],[12,4],[21,11]],c);
    P.rect(16,4,18.5,10,c);
   },'e');
   P.poly([[5,11],[12,6],[19,11]],p.base);
   P.rect(10.3,15,13.7,21,'k');P.rect(11,16,13,21,'n');
   for(const xx of [7,16.5]){P.rect(xx-1.5,13.4,xx+1.4,16.5,'k');P.rect(xx-1,14,xx+1,16,'b');P.xy(xx-.5,14.4,'w');}
   P.line(2,22,22,22,'g');
   if(d>=1)for(const xx of [3.5,20.5]){
    P.line(xx,20,xx,23,'g');P.oval(xx,19.2,1.3,1.2,'p');P.xy(xx,19,'Y');
   }
   if(d>=2){P.rect(8,9.2,16,9.8,'r');P.xy(18,6,'Y');}
  }else if(kind==='sea'){
   // Latarnia na skalistej wyspie; pasy i światło mają wyraźne obramowanie.
   P.solid(c=>{
    P.poly([[7.6,20],[9.8,9],[14.2,9],[16.4,20]],c);
    P.rect(9.5,8,14.5,10,c);
    P.rect(10.4,5,13.6,8,c);
    P.rect(8.5,7.5,15.5,9,c);
   },'w');
   P.rect(9.4,12.5,14.6,14.2,p.base);P.rect(8.6,17,15.3,18.6,p.base);
   P.rect(11,6,13,7.8,'Y');P.xy(12,4,'k');
   P.poly([[5,20.5],[9,18.5],[15,19],[20,21],[22,23],[3,23]],'s');
   P.line(2,22,8,22,'b');P.line(17,23,23,23,'b');
   if(d>=1){P.line(16,7,20,6,'Y');P.line(16,8,20,8,'H');}
   if(d>=2){P.line(3,17,5,16,'k');P.line(5,16,7,17,'k');}
  }
  if(d>=1){
   if(sky==='night'){P.sparkle(19,3,'H');if(d>=2)P.sparkle(4,5,'Y');}
   else if(sky==='day'){P.oval(20,3,1.3,1.3,'Y');}
   else{P.oval(20,4,1.3,1.3,'O');}
  }
  if(o.extra==='stars'&&d>=2)P.sparkle(3,4,'H');
  else if(o.extra==='hearts')P.safe(3,5,'p');
  else if(o.extra==='cloud'&&d>=1){
   P.rect(2.5,4.3,7,5.3,'w');P.oval(4.3,3.7,1.8,1.2,'w');
  }
  return P;
 }
 function landscape(P,kind,o){
  // Pełnoprawne pejzaże, nie przebrany za krajobraz zamek.
  const d=P.detail,sky=o.eyes||'day',p=colors(o,'worlds',kind);
  const line=(pts,c)=>pts.slice(1).forEach((v,i)=>P.line(...pts[i],...v,c));
  if(sky==='night'){
   P.oval(19,4,2.5,2.5,'H');P.oval(20,3.4,2.4,2.5,'w');
   P.sparkle(3,3,'H');if(d>=1)P.sparkle(11,2,'w');
  }else{
   P.oval(kind==='sunset'?12:19,kind==='sunset'?10:4,
    kind==='sunset'?3.4:2.3,kind==='sunset'?3.4:2.3,sky==='evening'?'O':'H');
   if(kind==='sunset')P.oval(12,10,2.2,2.2,'Y');
   if(d>=1&&o.extra==='cloud'){
    P.oval(5,5,3,1.2,'I');P.oval(7,4,2,1.5,'w');
    P.oval(18,7,2,1.2,'w');
   }
  }
  if(kind==='mountains'||kind==='winter'){
   // Trzy plany odległości i widoczne śnieżne szczyty.
   P.poly([[0,17],[5,9],[9,13],[14,5],[23,16],[24,24],[0,24]],'u');
   P.poly([[0,16],[5,10],[8,14],[13.8,6.5],[22,17],[24,24],[0,24]],kind==='winter'?'I':'a');
   P.poly([[2,14],[5,10],[7.2,13],[5.2,12.5],[4.3,13.4]],'w');
   P.poly([[10.8,11],[13.8,6.5],[17.2,12.2],[14.5,10.8],[13.5,11.5]],'w');
   P.poly([[0,19],[4,16],[9,19],[16,14],[24,20],[24,24],[0,24]],kind==='winter'?'s':'d');
   if(kind==='winter'){
    P.poly([[0,20],[4,17.3],[9,20],[16,15.6],[24,21],[24,24],[0,24]],'w');
    P.line(0,22,24,22,'I');
   }else{
    P.poly([[0,21],[5,18],[11,21],[17,19],[24,22],[24,24],[0,24]],'g');
   }
   line([[0,17],[5,9],[9,13],[14,5],[23,16]],'k');
  }else if(kind==='lake'){
   P.poly([[0,16],[5,9],[9,13],[14,8],[18,13],[24,10],[24,24],[0,24]],'d');
   P.poly([[0,18],[4,15],[10,17],[16,15],[24,17],[24,24],[0,24]],'g');
   P.rect(1,18,23,23,'b');P.rect(1,21,23,22,'a');
   for(const [xx,yy,len] of [[5,19,4],[13,20,6],[17,22,4]])
    if(d>=1)P.rect(xx,yy,xx+len,yy+.6,'w');
   if(d>=1)for(const xx of [3.3,20]){
    P.line(xx,16,xx,20,'n');
    P.poly([[xx-2.5,18],[xx,10],[xx+2.5,18]],'d');
    P.poly([[xx-1.8,15],[xx,9],[xx+1.8,15]],'l');
   }
   if(d>=2){P.oval(12,22,1,.7,'w');P.xy(13.5,22,'H');}
  }else{
   // Zachód słońca nad doliną i wijącą się rzeką.
   P.rect(0,13,24,15,'t');
   P.poly([[0,18],[6,12],[11,17],[16,12],[24,18],[24,24],[0,24]],'j');
   P.poly([[0,20],[5,15.5],[9,20],[16,16.8],[24,20],[24,24],[0,24]],'v');
   P.poly([[0,22],[6,19],[11,22],[16,19],[24,22],[24,24],[0,24]],'g');
   P.poly([[10,24],[14,24],[12.5,20],[14,17],[12.8,17],[11,21]],'b');
   if(d>=1)for(const xx of [3.4,20.5]){
    P.line(xx,17,xx,22,'n');
    P.oval(xx,16,2.3,3,'d');P.oval(xx-.5,15,1,1.5,'l');
   }
  }
  if(d>=2){
   for(const [xx,yy] of [[3,22],[19,22]]){
    P.xy(xx,yy,'Y');P.xy(xx-1,yy,'p');P.xy(xx+1,yy,'p');P.xy(xx,yy+1,'g');
   }
   if(sky==='night'){P.sparkle(8,5,'H');P.sparkle(21,9,'Y');}
  }
  if(d===3){
   // Dodatki eksperta pozostają czytelne w kratce 5 mm.
   P.line(2,23,22,23,'n');
   if(kind==='mountains'||kind==='winter'){
    for(const xx of [4,21]){
     P.line(xx,18,xx,22,'n');
     P.poly([[xx-2,20],[xx,13],[xx+2,20]],'d');
     P.poly([[xx-1.6,17],[xx,12],[xx+1.6,17]],'l');
    }
   }
   P.sparkle(7,4,'H');
  }
  if(o.extra==='stars'&&sky!=='night'&&d>=1)P.sparkle(5,4,'H');
  return P;
 }
 function decorate(P,cat,options){
  if(P.detail===0||cat==='worlds'||cat==='landscapes')return;
  const motif=options.scene||'none';
  if(motif==='none')return;
  const first=cat==='animals'?[[3,16],[21,3]]:cat==='robots'?[[3,6],[21,8]]:[[3,4],[21,5]];
  const positions=P.detail>=2?[...first,[3,20]]:first;
  for(const [x,y] of positions){
   if(motif==='stars'){P.sparkle(x,y,'Y');}
   else if(motif==='hearts'){
    P.safe(x-1,y,'r');P.safe(x+1,y,'r');P.safe(x,y+1,'r');
   }else if(motif==='flowers'){
    P.safe(x-1,y,'p');P.safe(x+1,y,'p');
    P.safe(x,y,'Y');P.safe(x,y+1.5,'g');
   }
  }
 }
 function render(cat,options={},level='medium'){
  const P=make(level),kind=options.kind||'round';
  if(cat==='animals'&&['cat','bear','bunny'].includes(kind))animal(P,kind,options);
  else if(cat==='monsters')monster(P,kind,options);
  else if(cat==='robots')robot(P,kind,options);
  else if(cat==='worlds')world(P,kind,options);
  else if(cat==='landscapes')return MagicApprovedLandscapes.render(level,options);
  else return P.rows();
  decorate(P,cat,options);
  return P.rows();
 }
 return Object.freeze({render,levels});
})();

/* Zatwierdzone krajobrazy w rodzimych siatkach, bez interpolacji. */
const MagicApprovedLandscapes=(()=>{
 const DATA={"easy":[".dglrn","AAAAAAAAAAAAAAAREQAAAAAAESIiEQAAAAEiIzIiEAAAEiIyJCIhAAASMiIiIjEAASIiQiIyIhABIjMiIjIiEAASIiIyQiEAAAEiIiIiEAAAABEiIhEAAAAAABVRAAAAAAAAFVEAAAAAAAAVUQAAAAAAARVREAAAAAAiJVIiAAA="],"medium":["wysbldnp","AAAAAAAAAAAAAAAAAAAAAAABAAIAAAAgAAAzAAEAAQIAAAAgAAMzMAAREAIAMwAgADMzMxAREBIDMzAgAAAAAAAREAIzMzMgAAAAAAEAAQIAAAAgAABEAAABAAIARAAgAAREQCAAAAIEREAgAlVVVSIiIiJVVVUgBGZmZlAAAAVmZmZQBmZEZlMwMzZmRGZgBmRVRmMDMDZkVUZgBkVVVGMDMDZFVVRgBlVVVWMzAzZVVVVgBmVVVmMDAzZlVVZgBmZlZmMDMzZmVmZgBWZmY2MDMDIGZmZQBVVgBSAAAAJQBlVQBEREVSAAAAVVRERQBHRERCMzMzVEREdQBxdEdCAAM0VHRHEgBHRHF1MzADVxdEdQAAAAAAAAAAAAAAAA"],"hard":["csnokdlb","AAAAABAAAAAAAAACAAAAAAAAAAAQAAMzMzAAAgAAAAAAAAAAEAAzMzMzMAIAAAAAAAAAABAzMzMzMzMCAAAAAAAAAAETMzMzMzMzMgAAAAAAAAABEzMzMzMzMzIAAAAAAAAAADMzMzMzMzMyAAAAABERERETMzMzMzMzMRAREQEAAAATEzMzMzRDMzEwAAAAAAAAAzMzMzNEREMxMAAAAAAAAAMzQzM0EURDMTAAAAAAAAAANEQzQRRERDEAAAAABQAABCFERBEUREQiQAAAAFVQBEQRFEERRBFEQUQABQBVUEQREUERFEEREUIUQFVQVVVBESERERERURESURRVVVVVURUlERURFVUREVUVVVVVZlVVJVFVUVVVUVFVVWZVVmZmZSVVVVVVVVVRVVZmZWZlVWYlVVVVVmZVUVVmZmVVZmZmFmZ3ZlVVJmFWZmZmVmZmZmZwdmVVVmZhVmZWVWZmZmZldwB3ZmZVUWVVJVVmZmZmFXd3AHdlVVFmVSVWVmZWZmZWZ3cHd2ZhZmYiZlVVZmYWVmZmdwd3YWZVIlZSJVZVFWZlZmdwd3FlVVVVZSJVJSZlVVZmdwd3ZmZmZmYiUlVmVVVVZ3d3AXZlZmZmIiVmZmZmZ3dwAHF2VVZmZiEWYRZmcXcXEXdxYRERFmUiVVV3d3cHd3ciAWZmZmZVVVVVd3dwd3dyAAEmZmZmVmZmInd3B3d3UQABJmZmZmZmIgEXdwB3d1IiIWZlZmZmYgAAEndwB3d1VVFmVVZWZiERABAnd3B3d3dxUiVVVWUhEREQJ3d3AHd3cSACVVVVUhERIicHd3cAB3EAACVVVVd3d3cAd3d3cAdxIiIndQ=="],"expert":["rUncwgayb","AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAAAAAAAAAAAAMAAAAAA0QAARIAAAAAAAAAAAAEREMAAAM0REAAESAAAAAAAAAANDRERDAAAzMzMAAhUgAAAiIAADNERDAAAAAAAAAAACFVAAIRVVIAAAAAAAAAAAACEREgARUgIVUSERAAAAAAAAAAAhVVVVEhFVIWESEAAAAAAAAAAAAhEREVVRIVURESAAAAAAAAAAAAAhEiESEVURFREgAAAAAAAAAAAAACAAAAISFVEREiERIgAAAAAAAAAAAAAAAAIRURERVVVVIAAABERAAAAAAAIRERESchYRFVVSAHMzMzMzADQAIVVVUSIiEREhEVUgAAAAM0RDMzIVURERIichIAIhJSAAAAAAAAAAIVEREiEREhVRAAACEAAAAAAAAAAVERIgIRIREVUQAAAnd3cAAAAAABESAAISECERFVIAB3d3d3AAAAAAEQAAASIgABEVUgB3d3d3dwAAAAAQAAASIgAAAhFVAHd3d3d3cEQCAAADMhIQAAAAEVUHd3d3czMzMzEQAAAhIQADMAABEgd3d3d3d3AAAVEiABIiAzMzMAISAHd3d3VnIAAFVRUSIhAAAAAAByJ3d3dydyERIAEVVVEiIiEAAAAAIAAHd3VRFlURIRFVEiFVFRJ3d3d3d3IRERFVFVURURESIRVVVhVVVVVSIlIiIiJmZmVRUSISIRIRImZmZmZmV3dYZmZmZVVRIhIiEiEiJohmaIVVVVWIhmZhFRIhEiCIKCImKIhmZoV3WGZmZmImEiZzSIgoiIiGZmiIVViGZmaIZ3YiEnc4iIiIZmZmZmaIVVWGiIZncSIXOIiIiGZmaIiGZmZmZmZmZmchIidIiIiIiIhmZmaIVVhmZmZmZxIhV0iIiIiIiIiIhmZmiGZmZmZnEiF3NIiIiIiIiIiIiGaIhmiIZmISIndzSIiIiIiIiIiIiIhmaIiIgSISd3c0SIiIiIiIiIiIiIiIhmZhFRVVd3dzRIiIiIiIiIiIiIiIiIFVFVdVd3c0iIiIiIiIiIiIiIiIhVFRVlVXd3NIiISIiIiIiIiIiIiFVVFVd3d3dzRIiIiEREiIiIiIiIVSIhVVd3d3dzNESIiIiIiIiIiIhVIAASFXd3d3d3czRIiISIiIiIiGEQAHAGd3d3d3d3NIiIiIiESIiIEAAnAAJ1V3d3d3dzRESIiIiIREggACUiJlZ3d3d3d3dzM0REiIiIiBAAIgABYlVVd3d3d3d3dzM0REiIERAAIAESIVV3d3d3d3dwd3czREQVEAASEgABZXd3d3d3cAAAd3d3c1URIhEQAAAnVVd3czd3AAd3d3d3VRURZREAAidVd3cjMnd3B3d3VXVRVVZVUQIBFVVVd3cnd3d3d1V1VRFVEVVREREVVWdVd3d3d3d1VVVREVERFVEVYRVRVmVXd3d3d1d1VlERERERURFRERESd3d3d3d3d1EREQ=="]},SIZES={"easy":[16,16],"medium":[24,24],"hard":[32,40],"expert":[40,56]};
 const names={easy:'Drzewo z jabłkami',medium:'Wodospad w dolinie',hard:'Górska dolina z rzeką',expert:'Tropikalna zatoka'};
 function base(level){
  level=Object.hasOwn(DATA,level)?level:'medium';
  const [abc,payload]=DATA[level],[w,h]=SIZES[level],bytes=atob(payload);
  const cells=[];
  for(let i=0;i<w*h;i++)cells.push(abc[(bytes.charCodeAt(i>>1)>>(i%2?0:4))&15]);
  const rows=Array.from({length:h},(_,y)=>cells.slice(y*w,y*w+w));
  const pick=(x,y)=>rows[y]?.[x];
  if(level==='medium'){
   // Odtworzenie zaakceptowanego wodospadu: pionowe artefakty x=15 i x=22
   // oraz przypadkowy szary pas w wierszu 9 nie należą do rysunku.
   for(let y=1;y<=9;y++){
    if(pick(15,y)==='s')rows[y][15]='w';
    if(pick(22,y)==='s')rows[y][22]=y===9?'d':'w';
   }
   if(pick(8,8)==='s')rows[8][8]='w';
   if(pick(1,9)==='s')rows[9][1]='w';
   for(let x=8;x<=14;x++)if(pick(x,9)==='s')rows[9][x]=x===8?'d':'w';
   // Druga pionowa linia przecięła wodę i kwiaty, nie skały.
   for(let y=17;y<=22;y++){
    if(pick(15,y)==='s')rows[y][15]=y>=20?'b':'w';
   }
   for(let y=18;y<=21;y++)if(pick(8,y)==='s')rows[y][8]=y===18?'d':'l';
   if(pick(22,21)==='s')rows[21][22]='l';
  }
  if(level==='hard'){
   // Popraw tylko ślady dawnej siatki. Cienie skał i białe śniegi zostają.
   for(let y=0;y<=8;y++)for(let x=0;x<w;x++)
    if(rows[y][x]==='s')rows[y][x]=rows[y][Math.max(0,x-1)]==='o'?'o':'c';
   // Ciągła, jednokratkowa kreska schodziła przez prawą część doliny.
   for(let y=17;y<h;y++)if(pick(23,y)==='s'){
    const left=pick(22,y),right=pick(24,y);
    rows[y][23]=left===right?left:(['b','c'].includes(left)?left:(['b','c'].includes(right)?right:left));
   }
   // Podobny ślad po lewej przebiegał przez trawę i koryto rzeki.
   for(let y=20;y<=36;y++)if(['s','n'].includes(pick(8,y))){
    const left=pick(7,y),right=pick(9,y);
    rows[y][8]=left===right?left:(['l','d','b'].includes(right)?right:left);
   }
   // Pozioma linia w rzędzie 30. Bez ingerencji w właściwe skały na dole.
   for(let x=0;x<w;x++)if(pick(x,30)==='s'){
    const above=pick(x,29),below=pick(x,31);
    rows[30][x]=above===below?above:(above==='b'||below==='b'?'b':(['l','d'].includes(above)?above:['l','d'].includes(below)?below:'l'));
   }
   // Na zatwierdzonym wzorze są dwie białe chmurki; przywróć je wyłącznie
   // w wolnym niebie, bez przykrywania słońca i gór.
   for(const [cx,cy] of [[3,3],[27,4]]){
    for(const [dx,dy] of [[1,0],[2,0],[0,1],[1,1],[2,1],[3,1],[1,2],[2,2]])
     if(pick(cx+dx,cy+dy)==='c')rows[cy+dy][cx+dx]='w';
   }
  }
  return rows.map(row=>row.join(''));
 }
 function render(level='medium',options={}){
  const original=base(level);
  const rows=original.map(row=>row.split(''));
  const h=rows.length,w=rows[0].length;
  const baseAt=(x,y)=>original[y]?.[x];
  const at=(x,y)=>rows[y]?.[x];
  const set=(x,y,c)=>{if(x>=0&&y>=0&&x<w&&y<h)rows[y][x]=c;};
  if(level==='easy'){
   const apples=options.apples||'few';
   if(apples==='none')for(let y=0;y<h;y++)for(let x=0;x<w;x++)
    if(at(x,y)==='r')set(x,y,'g');
   if(apples==='many')for(const [x,y] of [[5,4],[8,5],[11,7],[5,8]])
    if(['g','l'].includes(at(x,y)))set(x,y,'r');
   if(options.hollow==='yes')set(7,12,'k');
   const leaves=options.color==='O'?['o','y']:options.color==='v'?['v','p']:options.color==='l'?['l','h']:null;
   if(leaves)for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    if(at(x,y)==='g')set(x,y,leaves[0]);
    else if(at(x,y)==='l')set(x,y,leaves[1]);
   }
  }else{
   // Pora dnia zmienia spójnie całe światło, wodę i roślinność.
   // Nie stosujemy pasów na sztywnej wysokości ani flood-fill,
   // który zatrzymywał się na chmurach i barwił tylko pół nieba.
   const evening=options.eyes==='evening',night=options.eyes==='night';
   if(evening||night){
    const region={medium:10,hard:17,expert:28}[level];
    const scene={
     medium:evening?{y:'O',b:'a',l:'g',d:'G',n:'e'}:{y:'h',b:'a',l:'d',d:'G',n:'N'},
     hard:evening?{o:'O',b:'a',l:'g',d:'G'}:{o:'v',b:'a',l:'d',d:'G',n:'N'},
     expert:evening?{y:'h',b:'a',g:'l',d:'G'}:{y:'h',b:'a',g:'G',d:'u',n:'N'}
    }[level];
    const sky={medium:evening?'c':'u',hard:evening?'t':'u',expert:evening?'t':'u'}[level];
    const skyBase={medium:'w',hard:'c',expert:'r'}[level];
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
     const src=baseAt(x,y);
     if(y<region&&src===skyBase)set(x,y,sky);
     else if(Object.hasOwn(scene,src))set(x,y,scene[src]);
    }
   }
   // Wariant kolorystyczny przestawia akcenty wody, ale nie linie horyzontu.
   const water={l:'g',v:'v',O:'o'}[options.color];
   if(water)for(let y=0;y<h;y++)for(let x=0;x<w;x++)
    if(baseAt(x,y)==='b'&&at(x,y)===(evening||night?'a':'b'))set(x,y,water);
   const extra=options.extra||'none';
   // Dodatki mogą zmieniać tylko niebo lub łąkę, nigdy słońce bazowe.
   const skyBase={medium:'w',hard:'c',expert:'r'}[level];
   const skyHeight={medium:8,hard:10,expert:18}[level];
   const skyCell=(x,y,color)=>{if(y>=0&&y<skyHeight&&baseAt(x,y)===skyBase)set(x,y,color);};
   if(extra==='stars')for(const [x,y] of ({medium:[[2,1],[21,1]],hard:[[2,2],[28,2]],expert:[[3,2],[36,3]]}[level]))
    skyCell(x,y,night?'h':'y');
   if(extra==='cloud'){
    const [x,y]={medium:[15,0],hard:[2,8],expert:[31,6]}[level];
    for(const [dx,dy] of [[1,0],[2,0],[0,1],[1,1],[2,1],[3,1]])
     skyCell(x+dx,y+dy,level==='medium'?'b':night?'I':'w');
   }
   if(extra==='flowers'&&['medium','hard'].includes(level)){
    const y=level==='medium'?20:32;
    for(const x of level==='medium'?[4,19]:[5,27]){
     for(const [dx,dy,color] of [[0,0,'y'],[-1,0,'p'],[1,0,'p'],[0,-1,'p']])
      if(['g','l','d','G'].includes(at(x+dx,y+dy)))set(x+dx,y+dy,color);
    }
   }
  }
  return rows.map(row=>row.join(''));
 }
 return Object.freeze({base,render,names});
})();
