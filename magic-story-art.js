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
  const p=colors(o,'monsters',kind),d=P.detail;
  const one=o.eyes==='one';
  P.solid(c=>{
   if(kind==='round'){
    if(o.extra==='horns')for(const sx of [-1,1])P.poly([[12+sx*5,9],[12+sx*6,2],[12+sx*2.8,8]],c);
    P.oval(12,12.5,7.1,8.3,c);
    if(d>=1){
     for(const sx of [-1,1]){P.oval(12+sx*7,17.5,2,2,c);P.oval(12+sx*4.3,21,2.7,2,c)}
    }
   }else if(kind==='square'){
    P.rect(4.7,5.4,19.3,19.8,c);
    for(const sx of [-1,1]){
     P.rect(12+sx*6,17,12+sx*9.1,19.5,c);
     P.rect(12+sx*5,19.1,12+sx*2.5,22.5,c);
    }
    if(d>=1)P.rect(10,3,14,6,c);
   }else{
    P.oval(12,12.8,8.6,7.8,c);
    for(const xx of [6,10,14,18])P.oval(xx,19,2.4,3.3,c);
    if(d>=2)for(const xx of [8,16])P.oval(xx,21,1.7,2,c);
   }
  },p.base);
  if(kind==='round'){
   if(o.extra==='horns')for(const sx of [-1,1])P.xy(12+sx*4.6,5.5,'Y');
   if(d>=1)P.oval(12,18.5,4,2.6,p.light);
  }else if(kind==='square'){
   P.oval(12,19,3.8,1.9,p.light);
   if(d>=1){P.xy(6,7,p.shade);P.xy(17,7,p.light);}
  }else{
   P.oval(8.5,9,2,1.3,p.light);
   P.oval(12,19.5,3,1.4,p.shade);
  }
  const eyes=o.eyes||'two';
  if(one)face(P,12,11,'one',o.mouth||'smile');
  else face(P,12,11,eyes==='three'?'three':'round',o.mouth||'smile','wide');
  if(d>=1){P.xy(6,14,'p');P.xy(18,14,'p');}
  if(o.extra==='crown'){P.rect(9,3.1,15,5,'Y');P.xy(9,2,'Y');P.xy(12,1.5,'Y');P.xy(15,2,'Y');}
  else if(o.extra==='antenna'){P.line(12,5,12,2,'k');P.xy(12,1.5,'r');}
  else if(o.extra==='horns'&&kind!=='round'){
   for(const sx of [-1,1])P.poly([[12+sx*5.5,6],[12+sx*7.5,2],[12+sx*3.5,6]],'k');
   for(const sx of [-1,1])P.xy(12+sx*5.2,5,'Y');
  }
  if(d>=2&&o.scene==='stars')P.sparkle(3,7,'Y');
  if(d>=2&&o.scene==='flowers')P.safe(20,19,'p');
  if(d>=2&&o.scene==='hearts')P.safe(4,15,'r');
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
 function decorate(P,cat,options){
  if(P.detail===0||cat==='worlds')return;
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
  else return P.rows();
  decorate(P,cat,options);
  return P.rows();
 }
 return Object.freeze({render,levels});
})();
