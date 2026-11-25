'use strict';
// Approved Pikseluj monsters. One palette entry per cell, four independent grids.
const MagicApprovedMonsters=(()=>{
 const raw={"easy":".......6......../.....66}6.6...../....6}6}66}6..../....6}}}}}}6..../.....6}}}}6...../.....666666...../....6&&&&&&6..../...6&&&&&&&&6.../..6&&||&&||&&6../..6&&|6&&6|&&6../..6[[&&&&&&[[6../...6&&6[[6&&6.../....6&&66&&6..../....6&&66&&6..../.....66..66...../................","medium":"......................../......................../......66........66....../......6}6......6}6....../.......666....666......./.........666666........./.......6688888866......./......688888888886....../.....68888888888886...../....6886|688886|6886..../....688|668888|66886..../...668866688886668866.../..6}6[[8888668888[[6}6../..6}}68888888888886}}6../..6}}}688868868886}}}6../...6}}688886688886}}6.../....668888;;;;888866..../.....6888;[;;[;888666.../......688;;[[;;886.6866./.......68;;;;;;86...686./.......688;;;;886....66./.......686....686......./.......666....666......./........................","hard":"................................/............22........22......../...........2>>2......2>>2......./.........22><_2.......2<>2....../........2>>__2..22....2>_2....../.......2<___2..2::2.22><_2....../......2><__2|22::=22>><__2....../......2_<__22^2:=2>><<<_2......./......2__22^^^^22><><__2......../.......22^^^^^^^2_<__22........./....2222^^^^^{^^^2__222222....../....2^^2^2^^{^^^^^2?2^^^^2....../.....2^^^222^^^222^2^^$$2......./.....2-22|||2^2|||2^^$=]2......./......2^2|042^2|042^$]]2......../......2^2|142^2|142^$22........./....22^^^222^^^222^^$:2.222...../...2^2))^^^2((^^22^^$:<.2^^2..../..2^^2^^^$02222^)))^2:2.2^^(2.../.2($$|2^^^2@@@2^^^^2.2..2^$$(2../2($=$2|2^^^)))^^^^2....2^^$=$(2./2$]]$^2|22^2)2^^22::2..2^$$==$^2/^]]]$^^2||2^^^22-^:2..2^$=$=]]-2/^::]$=$^222-<<<-^^2..2($=]$]:{](/]::]$]]$^2^$<<<$^^2.2($=]]${::{^/{::{$]:{2^$___$^^^^2^$={{{${:::]/:22:$:::2^$><<$^^^^2^${:::$:222{/2..2-:222$_><<>$^^^^2]:22:-2...2/...2=2|2^$_____$^^$^^22..2=2..../....2||2^$>>>>2^^^222^:2..2..22./.....222^^2<><2^^2^^^2::2...2:{2/....2^^2^^2___2^^2^^^^2:2...2:$^/...2^^^2^^^2<2^^2^^^^^^2:2...2(^/...2^^^2^^^2_2^^2^^^^--2::22.2^^/...2^^-2^^^2<2^^2^^^---2-$::2^^^/....2$-2^^^-2^^^2^$$$$-2^^$$^^^2/...2^^2^^^^^2^^^^2^^(22-^^^(^^$2/..2>->2>$>$^2^$>$>->->2$$$$$$22./..2>2>2>2>22.22>2>2>2>2222222.../...2.2.2.2.....2.2.2.2..........","expert":"......................................../............................222222....../..........................22+++++%2...../........................22++%%%%#%%2..../.......................2++%%:%%###%%2.../......................2%%%%:::#####%2.../.......!.............2%#####:#9922##%2../......!7!...........2%##::##99952299#2../.....!7|7!.........2%##::####992..29#2../......!7!.........2%##::####9#2....222../....!..!..........2#:#:::#:##52....2:1../...!7!.....!.....2#:::#:::###2.....220../....!.....!7!...2###:######:#2.....2:2../.!.........!....5##52222##:::#2..22:>:22/....222........2222:::::{9#:##2..2:>>>:2/..2211122.....2{::2:2222:522##5...2:::2./.217474!72....2::{2:2++2:2:{22#2..2{2{2./21747|74!12..222222:2222:2{{:{22..22.22./27!7|||7!12.2++++%2{::::{222:{{{2......./:1!17|71!1:2+++++++222222###22{{2......./:27!171472:2##2222++++%#######222......./::27!!!75::222>299222+++%%####%#22....../{::2:>:5::{22><22!90222+++%%#%22%%22..../2{{2:::2:{22>>222110000222++%%2>2+%%22../.22{2{2:22#2<>>21111109!0222%52>>2%%%%2./.2=2*2{{2%#2{<:11221131011132>>><2+++++2/.2=2==*2%###2{112||2111112221:><:2#222+2/..2=2==222222212|22211112||221{{22299992/...22**2#92111122222711122222122299999#5/...2:::{29521112!2|271112!2|2111129###2./....2222|2952112!4!117171!4!211129###2../....2==2||2111))227122221122))1229#22.../.....2=2||2121))112|5$$2|211))11122...../.....2*22||221111115))))2111111222....../....211122|2221311112))2111111222......./...21112112:{#22131111111112225{{2....../...211112122::%#22122221122%##::{2....../...23711212%2::###2:::{22#%##:{22......./....2312332+#2:::{:#|45{{::::22%#2....../.....222322+##2222{#175{222222%++2....../.....2*=22%##2##{22:##{2%#21112%+%2...../.....2*=2%%#2##::2%2{{2{#2111112++2...../....2#2=2#22###:2%++22%2:21217129+%2..../....2%2=222#:#:2#+2222+2{2211112#2%%2.../...2%#2==2#::::222::::222{223122#2#%2.../..2%##2*=2##:#:2=2:22:2=2:##229#92%%%2../.2%##:2==2####:2=2:$2:2=2:####:#92:%%%2./.2##::2==2:::#:222{::{222::##:::#2::%%2./2%#::22==2#:#:2#++2222++#2:###:###2::#%2/2#::292==2##::2#++##++#+#9{:######92::{2/2{:2992==2#::222++%%++%+222::####:{22:{2/.2{::95==2::233422++++221112::##:{22{{2./..22{:2==22211113222222311112{::{2%%22../....222==223>3>132....231>3>32222222..../.......22.22>2>22......22>2>22........../........................................"};
 const shades={"0":"#0065B5","1":"#00B9F7","2":"#050423","3":"#0A97FA","4":"#0D6EE7","5":"#12113E","6":"#201637","7":"#22DDFB","8":"#32CDBB","9":"#3D0C7E","!":"#5B51D5","#":"#800FD0","$":"#8D0023","%":"#A02AEF","&":"#A76BE8","*":"#B3561B","+":"#C852F9","-":"#D3102D","=":"#E17D22","?":"#F7B864","@":"#F93374","^":"#FB2430","_":"#FBDD80","(":"#FF4B45",")":"#FF74A5","[":"#FF7EAC","]":"#FF9117","{":"#FFBE1D","}":"#FFCF48",":":"#FFDF0B",";":"#FFE1A3","<":"#FFEC8E",">":"#FFF4C4","|":"#FFFFFF"};
 // Uproszczone palety kredek: czytelne nazwy, bez 20 podobnych odcieni.
 const pencilNames={
  '6':['#201637','Ciemny kontur'],'&':['#9670E6','Fioletowy'], '}':['#F5CD53','Żółty'],
  '|':['#FFFFFF','Biały'],'[':['#F58CB1','Różowy'],'8':['#53BFDE','Turkusowy'],'6':['#201637','Ciemny kontur'],
  ';':['#F7DFAC','Kremowy'],
  '2':['#1A1A1C','Czarny'], '^':['#ED343B','Czerwony'],'$':['#A52D43','Ciemnoczerwony'],
  ':':['#F5CD53','Żółty'], ']':['#F6A449','Pomarańczowy'],'>':['#F7DFAC','Kremowy'],
  '4':['#4A75C9','Niebieski'], ')':['#F58CB1','Różowy'],
  '#':['#61369B','Ciemnofioletowy'],'%':['#9670E6','Fioletowy'],
  '+':['#A76BE8','Fioletowy'],'1':['#53BFDE','Błękitny'],
  '7':['#B2E5F2','Jasnobłękitny'],'=':['#CE934F','Brązowy']
 };
 // Zamiana odcieni w każdym poziomie odbywa się na danych, nie na grafice.
 // Dzięki temu zawsze jeden piksel odpowiada dokładnie jednemu kolorowi kredki.
 const limited={
  hard:{
   '0':'4','1':'4','4':'4','@':')','(': '^','-':'$','?':'>','_':'>',
   '<':'>','=':']','{':':'
  },
  expert:{
   '0':'1','3':'1','4':'1','7':'1','5':'2','9':'#','!':'+','%':'+',
   '*':'=','$':')','{':':','<':'|','>':'|'
  }
 };
 const palette=Object.freeze(Object.fromEntries(Object.entries(shades).map(([id,hex])=>
  [id,pencilNames[id]||[hex,'Kolor wzoru '+hex]])));
 const size={easy:[16,16],medium:[24,24],hard:[32,40],expert:[40,56]};
 const masters={};
 for(const [level,packed] of Object.entries(raw)){
  const [w,h]=size[level];
  const rows=packed.split('/').map(row=>[...row].map(c=>limited[level]?.[c]||c).join(''));
  if(rows.length!==h||rows.some(row=>row.length!==w||[...row].some(c=>c!=='.'&&!Object.hasOwn(shades,c))))throw Error('Pikseluj: niepoprawny wzór '+level);
  masters[level]=Object.freeze(rows);
 }
 const names=Object.freeze({easy:'Koronowany potworek',medium:'Turkusowy smoczek',hard:'Czerwony smok',expert:'Magiczny czarodziej'});
 const original=Object.freeze(Object.fromEntries(Object.entries(masters).map(([k,v])=>[k,Object.freeze(v.slice())])));
 const groups={easy:['#A76BE8'],medium:['#32CDBB'],hard:['#FB2430','#FF4B45','#D3102D','#8D0023'],expert:['#00B9F7','#0A97FA','#0D6EE7','#22DDFB','#0065B5']};
 const variants={p:['p','p','X','X','X'],b:['b','b','a','u','a'],l:['l','l','d','d','d'],v:['v','v','u','u','u'],O:['O','O','n','n','n']};
 const backgrounds={easy:[[1,1],[14,1]],medium:[[2,5],[21,5]],hard:[[4,7],[28,8]],expert:[[3,12],[36,14]]};

 // Małe, ręcznie wyznaczone obszary twarzy i dodatków na NATYWNYCH siatkach.
 // Nie interpolujemy obrazu i nie nakładamy grafiki na pół kratki.
 const face={easy:{eye:[{x:5,y:8,w:2,h:2},{x:9,y:8,w:2,h:2}],skin:'&',ink:'6'},
 medium:{eye:[{x:7,y:9,w:3,h:3},{x:14,y:9,w:3,h:3}],skin:'8',ink:'6'},
 hard:{eye:[{x:9,y:13,w:3,h:3},{x:15,y:13,w:3,h:3}],skin:'^',ink:'2'},
 expert:{eye:[{x:16,y:26,w:4,h:5},{x:24,y:26,w:4,h:5}],skin:'1',ink:'2'}};
 const marks={easy:{ink:'6',yellow:'}',pink:'[',white:'|',skin:'&'},
 medium:{ink:'6',yellow:'}',pink:'[',white:'|',skin:'8'},
 hard:{ink:'2',yellow:':',pink:')',white:'|',skin:'^'},
 expert:{ink:'2',yellow:':',pink:')',white:'|',skin:'#'}};
 const sceneSpots={easy:[[2,3],[13,3]],medium:[[3,4],[20,4]],hard:[[3,6],[28,6]],expert:[[4,4],[13,4]]};
 const put=(g,x,y,c)=>{
  if(y>=0&&y<g.length&&x>=0&&x<g[0].length)g[y][x]=c;
 };
 function eyes(g,level,style){
  if(!style||style==='original')return;
  const {eye,skin,ink}=face[level];
  for(let i=0;i<2;i++){
   if(style==='wink'&&i===1)continue;
   const a=eye[i];
   for(let yy=a.y;yy<a.y+a.h;yy++)
    for(let xx=a.x;xx<a.x+a.w;xx++)put(g,xx,yy,skin);
   const middle=a.y+Math.floor(a.h/2);
   for(let xx=a.x;xx<a.x+a.w;xx++)put(g,xx,middle,ink);
   if(style==='happy'){
    if(a.w>=3){
     put(g,a.x,middle-1,ink);
     put(g,a.x+a.w-1,middle-1,ink);
    }
   }else if(style==='wink'&&a.w>=3){
    put(g,a.x+a.w-1,middle-1,ink);
   }else if(style==='sleepy'){
    // Ukośna powieka: odróżnia się od wesołego uśmiechu także na 16×16.
    if(a.w>=3)put(g,a.x+a.w-1,middle+1,ink);
    else put(g,a.x,middle-1,ink);
   }
  }
 }
 function mouth(g,level,style){
  if(!style||style==='original')return;
  const spec={easy:{x:7,y:11,w:2,h:2,base:'&',ink:'6',lip:'['},
   medium:{x:10,y:17,w:4,h:2,base:';',ink:'6',lip:'['},
   hard:{x:12,y:19,w:4,h:3,base:'^',ink:'2',lip:')'},
   expert:{x:19,y:31,w:5,h:3,base:'1',ink:'2',lip:')'}}[level];
  const {x,y,w,h,base,ink,lip}=spec;
  for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)put(g,xx,yy,base);
  if(style==='smile'){
   for(let xx=x;xx<x+w;xx++)put(g,xx,y+(h>2?1:0),ink);
   if(h>2){put(g,x,y,ink);put(g,x+w-1,y,ink);}
  }else if(style==='surprised'){
   const mid=x+Math.floor(w/2);
   put(g,mid,y,ink);put(g,mid,y+1,ink);
   if(w>=4)put(g,mid-1,y+1,ink);
   if(h>2)put(g,mid,y+h-1,lip);
  }else if(style==='tongue'){
   for(let xx=x+1;xx<x+w-1;xx++)put(g,xx,y,ink);
   for(let xx=x+1;xx<x+w-1;xx++)put(g,xx,y+1,lip);
   if(h>2)put(g,x+Math.floor(w/2),y+2,lip);
  }
 }
 function insignia(g,cx,cy,kind,colors){
  // Duże symbole 3-5 kratek, nie pojedynczy niemal niewidoczny piksel.
  const {ink,yellow,pink,white}=colors;
  if(kind==='star'){
   for(const [dx,dy] of [[0,-2],[0,-1],[-2,0],[-1,0],[0,0],[1,0],[2,0],[0,1],[0,2]])put(g,cx+dx,cy+dy,yellow);
  }else if(kind==='heart'){
   for(const [dx,dy] of [[-2,-1],[-1,-1],[1,-1],[2,-1],[-2,0],[-1,0],[0,0],[1,0],[2,0],[-1,1],[0,1],[1,1],[0,2]])put(g,cx+dx,cy+dy,pink);
  }else if(kind==='flower'){
   for(const [dx,dy] of [[0,-2],[-2,0],[2,0],[0,2]])put(g,cx+dx,cy+dy,pink);
   put(g,cx,cy,yellow);put(g,cx-1,cy,pink);put(g,cx+1,cy,pink);
  }else if(kind==='moon'){
   for(const [dx,dy] of [[0,-2],[-1,-1],[-2,0],[-1,1],[0,2]])put(g,cx+dx,cy+dy,yellow);
   put(g,cx,cy-1,white);
  }
 }
 function accessory(g,level,kind){
  if(!kind||kind==='original')return;
  const p=marks[level];
  if(level==='easy'||level==='medium'){
   // Korona / różki zajmują ten sam obszar — podmieniamy go na prawdziwy dodatek.
   const x0=level==='easy'?4:6, x1=level==='easy'?11:17;
   const y0=level==='easy'?0:2,y1=5;
   for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)put(g,x,y,'.');
   const cx=level==='easy'?8:12;
   if(kind==='bow'){
    for(const [dx,dy] of [[-3,-1],[-2,-1],[2,-1],[3,-1],[-3,0],[-2,0],[-1,0],[0,0],[1,0],[2,0],[3,0],[-2,1],[2,1]])
     put(g,cx+dx,level==='easy'?5+dy:4+dy,p.pink);
    put(g,cx,level==='easy'?5:4,p.yellow);
    for(const dx of [-4,4])put(g,cx+dx,level==='easy'?5:4,p.ink);
   }else if(kind==='star'){
    insignia(g,cx,level==='easy'?3:4,'star',p);
    put(g,cx-2,level==='easy'?5:6,p.ink);
    put(g,cx+2,level==='easy'?5:6,p.ink);
   }else if(kind==='heart'){
    insignia(g,cx,level==='easy'?3:4,'heart',p);
    put(g,cx-2,level==='easy'?5:6,p.ink);
    put(g,cx+2,level==='easy'?5:6,p.ink);
   }else if(kind==='none'){
    // Sama główka bez nakrycia.
   }
  }else{
   // Nie usuwamy rogów smoka ani kapelusza czarodzieja.
   // Zmieniamy duży emblemat na czole lub kapeluszu.
   const cx=level==='hard'?13:25,cy=level==='hard'?11:11;
   const base=level==='hard'?'^':'#';
   for(let y=cy-2;y<=cy+2;y++)for(let x=cx-2;x<=cx+2;x++)put(g,x,y,base);
   if(kind==='bow'){
    for(const [dx,dy] of [[-2,-1],[-1,-1],[1,-1],[2,-1],[-2,0],[-1,0],[0,0],[1,0],[2,0],[-1,1],[1,1]])
     put(g,cx+dx,cy+dy,p.pink);
    put(g,cx,cy,p.yellow);
   }else if(kind==='star')insignia(g,cx,cy,'star',p);
   else if(kind==='heart')insignia(g,cx,cy,'heart',p);
  }
 }
 function sceneDraw(g,level,kind){
  if(!kind||kind==='none')return;
  const pal=marks[level];
  const sprites={
   stars:[[0,0,pal.yellow],[0,-1,pal.yellow],[0,1,pal.yellow],[-1,0,pal.yellow],[1,0,pal.yellow]],
   hearts:[[-1,-1,pal.pink],[1,-1,pal.pink],[-1,0,pal.pink],[0,0,pal.pink],[1,0,pal.pink],[0,1,pal.pink]],
   flowers:[[0,0,pal.yellow],[0,-1,pal.pink],[0,1,pal.pink],[-1,0,pal.pink],[1,0,pal.pink]]
  };
  for(const [cx,cy] of sceneSpots[level]){
   // Dodatek do tła wolno rysować wyłącznie na pustych kratkach.
   // Jeśli motyw zahacza o postać, przesuwamy go w pobliskie wolne miejsce.
   let placed=false;
   for(const [dx,dy] of [[0,0],[-1,0],[1,0],[0,-2],[0,2],[-2,0],[2,0]]){
    const pts=sprites[kind]?.map(([ox,oy,c])=>[cx+dx+ox,cy+dy+oy,c]);
    if(!pts?.every(([x,y])=>y>=0&&y<g.length&&x>=0&&x<g[0].length&&g[y][x]==='.'))continue;
    pts.forEach(([x,y,c])=>put(g,x,y,c));
    placed=true;break;
   }
   if(!placed)continue;
  }
 }
 function render(level='medium',opts={}){
  const key=Object.hasOwn(masters,level)?level:'medium';
  const rows=masters[key].map(row=>row.split(''));
  eyes(rows,key,opts.eyes||'original');
  mouth(rows,key,opts.mouth||'original');
  accessory(rows,key,opts.accessory||'original');
  sceneDraw(rows,key,opts.scene||'none');
  const tint=variants[opts.color];
  if(tint){
   const src=groups[key];
   for(let y=0;y<rows.length;y++)for(let x=0;x<rows[y].length;x++){
    const id=rows[y][x];
    const shade=shades[id];
    const order=src.indexOf(shade);
    if(order>=0)rows[y][x]=tint[Math.min(order,tint.length-1)];
   }
  }
  return rows.map(row=>row.join(''));
 }
 return Object.freeze({palette,render,original,names,dimensions:size});
})();