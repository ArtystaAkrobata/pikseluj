'use strict';
/* Nowe, autorskie liski: cztery pozy zamiast przypadkowego składania części.
   Bazy 16×16 i 24×24 są zapisane niezależnie. Większe siatki otrzymują
   proporcjonalnie powiększony rysunek, ponownie obrysowany i otoczenie sceny.
   Żadne przekształcenie nie rozciąga głowy w pionie ani poziomie. */
const MagicFoxPoses=(()=>{
 const sizeTable={easy:[16,16],medium:[24,24],hard:[32,40],expert:[40,56]};
 const allowed=new Set(['.','K','O','L','D','W','P','R','B']);
 const decodedCache=new Map();
 function decode(pose,level){
  const id=pose+'/'+level;if(decodedCache.has(id))return decodedCache.get(id);
  const input=MagicFoxPoseData[pose]?.[level];
  const expected=sizeTable[level];
  if(!input)throw new Error('Brak wzoru: '+id);
  const rows=input.split('/').map(line=>{
   if(line.length%2!==0)throw new Error('Uszkodzony wzór: '+id);
   let expanded='';
   for(let i=0;i<line.length;i+=2){
    const count=parseInt(line[i],36),char=line[i+1];
    if(!Number.isInteger(count)||count<1||!allowed.has(char))throw new Error('Błąd koloru: '+id);
    expanded+=char.repeat(count);
   }
   return expanded;
  });
  if(rows.length!==expected[1]||rows.some(row=>row.length!==expected[0]))throw new Error('Błędne wymiary: '+id);
  const mat=rows.map(row=>row.split(''));
  decodedCache.set(id,mat);
  return mat;
 }
 function enlarged(pose,level){
  if(level==='easy'||level==='medium'||(pose==='sitting'&&MagicFoxPoseData.sitting[level]))return decode(pose,level).map(row=>row.slice());
  const [w,h]=sizeTable[level];
  const src=decode(pose,'medium');
  const side=level==='hard'?30:36;
  const left=Math.floor((w-side)/2),top=Math.floor((h-side)/2);
  const out=Array.from({length:h},()=>Array(w).fill('.'));
  for(let y=0;y<side;y++)for(let x=0;x<side;x++){
   const sy=Math.min(23,Math.floor((y+.5)*24/side));
   const sx=Math.min(23,Math.floor((x+.5)*24/side));
   out[top+y][left+x]=src[sy][sx];
  }
  // Ręcznie rozrysowana obwódka zewnętrzna 1 kratki po dodaniu rozdzielczości.
  // Środek rysunku (oczy, nos, białe futerko) pozostaje nietknięty.
  const occupied=out.map(row=>row.map(c=>c!=='.'));
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   if(!occupied[y][x])continue;
   if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>
     x+dx<0||x+dx>=w||y+dy<0||y+dy>=h||!occupied[y+dy][x+dx]))
      out[y][x]='K';
  }
  return out;
 }
 function paintScene(rows,pose,size,scene){
  if(scene==='none'||!scene)return;
  const h=rows.length,w=rows[0].length;
  const set=(x,y,c)=>{
   x=Math.round(x);y=Math.round(y);
   if(x>=0&&x<w&&y>=0&&y<h&&rows[y][x]==='.')rows[y][x]=c;
  };
  const star=(x,y,c)=>{
   for(const [dx,dy] of [[0,0],[-1,0],[1,0],[0,-1],[0,1]])set(x+dx,y+dy,c);
  };
  const heart=(x,y)=>{
   for(const [dx,dy] of [[-1,0],[1,0],[-2,1],[-1,1],[0,1],[1,1],[2,1],[0,2]])set(x+dx,y+dy,'R');
  };
  const flower=(x,y)=>{
   for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])set(x+dx,y+dy,'P');
   set(x,y,'L');set(x,y+2,'D');
  };
  const level=size==='expert'?3:size==='hard'?2:size==='medium'?1:0;
  if(level===0)return; // mały obrazek 16×16 pozostaje czysty i bardzo prosty
  if(scene==='stars'){
    star(3,Math.max(3,Math.round(h*.22)),'L');
    star(w-4,Math.max(3,Math.round(h*.24)),'L');
    if(level>=2)star(w-5,Math.round(h*.72),'L');
    if(level>=3)star(7,Math.round(h*.12),'L');
  }else if(scene==='flowers'){
    flower(3,h-5);flower(w-4,h-6);
    if(level>=3)flower(8,h-4);
  }else if(scene==='hearts'){
    heart(3,Math.max(3,Math.round(h*.19)));
    if(level>=2)heart(w-5,Math.round(h*.71));
    if(level>=3)heart(6,h-7);
  }
  // Dekoracja nie dotyka sylwetki: wszystkie kolorowe elementy trafiają
  // jedynie do dotąd pustych kratek.
 }
 const palettes={
  natural:{main:'O',light:'H',shade:'n'},
  O:{main:'O',light:'H',shade:'n'},
  p:{main:'p',light:'t',shade:'X'},
  v:{main:'v',light:'p',shade:'u'},
  b:{main:'b',light:'w',shade:'a'},
  l:{main:'l',light:'H',shade:'g'},
  n:{main:'n',light:'e',shade:'d'},
  w:{main:'w',light:'c',shade:'s'}
 };
 const baseMap={'.':'.',K:'k',O:'O',L:'H',D:'n',W:'w',P:'p',R:'r',B:'b'};
 function render(options={},size='medium'){
  const level=sizeTable[size]?size:'medium';
  const pose=Object.hasOwn(MagicFoxPoseData,options.pose)?options.pose:'sitting';
  const rows=enlarged(pose,level);
  paintScene(rows,pose,level,options.scene||'stars');
  const colors=palettes[options.color]||palettes.natural;
  return rows.map(row=>row.map(c=>{
   if(c==='O')return colors.main==='O'?'O':colors.main;
   if(c==='L')return colors.light;
   if(c==='D')return colors.shade;
   // Pink inner ears / blush are stable regardless of main fur shade.
   return baseMap[c]||'.';
  }).join(''));
 }
 return Object.freeze({render,decode,poses:['sitting','head','sleeping','profile'],sizes:sizeTable});
})();
