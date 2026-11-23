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
 const features={
  easy:{eye:[[5,9],[10,9]],mouth:[8,11],extra:[2,1],scene:[13,1]},
  medium:{eye:[[9,10],[15,10]],mouth:[12,13],extra:[2,4],scene:[21,3]},
  hard:{eye:[[12,17],[20,17]],mouth:[16,22],extra:[3,8],scene:[28,4]},
  expert:{eye:[[15,31],[25,31]],mouth:[20,36],extra:[3,10],scene:[36,13]}
 };
 const tint={p:'p',v:'v',b:'b',l:'l',O:'O',n:'n',w:'w'};
 function render(level='medium',o={}){
  if(!Object.hasOwn(originals,level))level='medium';
  const g=originals[level].map(row=>[...row]),[w,h]=sizes[level],c=colors[level],f=features[level];
  const set=(x,y,id,empty=false)=>{
   if(x>=0&&y>=0&&x<w&&y<h&&(!empty||g[y][x]==='.'))g[y][x]=id;
  };
  const stamp=(x,y,type,onlyEmpty=true)=>{
   const shapes={
    bow:[[-2,0,c.pink],[-1,0,c.pink],[0,0,c.gold],[1,0,c.pink],[2,0,c.pink],[-2,1,c.pink],[2,1,c.pink]],
    flower:[[0,0,c.gold],[-1,0,c.pink],[1,0,c.pink],[0,-1,c.pink],[0,1,c.pink]],
    star:[[0,0,c.gold],[-1,0,c.gold],[1,0,c.gold],[0,-1,c.gold],[0,1,c.gold]],
    crown:[[-2,0,c.gold],[-1,0,c.gold],[0,0,c.gold],[1,0,c.gold],[2,0,c.gold],[-2,-1,c.gold],[0,-2,c.gold],[2,-1,c.gold]],
    scarf:[[-2,0,c.pink],[-1,0,c.pink],[0,0,c.pink],[1,0,c.pink],[2,0,c.pink],[1,1,c.gold],[1,2,c.pink]],
    hearts:[[-1,-1,c.pink],[1,-1,c.pink],[-1,0,c.pink],[0,0,c.pink],[1,0,c.pink],[0,1,c.pink]],
    stars:[[0,0,c.gold],[-1,0,c.gold],[1,0,c.gold],[0,-1,c.gold],[0,1,c.gold]],
    flowers:[[0,0,c.gold],[-1,0,c.pink],[1,0,c.pink],[0,-1,c.pink],[0,1,c.pink]]
   };
   for(const [dx,dy,color] of shapes[type]||[])set(x+dx,y+dy,color,onlyEmpty);
  };
  if(o.eyes&&o.eyes!=='sparkle'){
   for(let n=0;n<2;n++){
    const [x,y]=f.eye[n];
    if(o.eyes==='happy'){set(x-1,y,c.ink);set(x,y,c.face);set(x+1,y,c.ink);}
    else if(o.eyes==='round'){set(x,y-1,c.face);set(x,y,c.ink);}
    else if(o.eyes==='wink'&&n===1){set(x-1,y,c.ink);set(x,y,c.ink);set(x+1,y,c.ink);set(x,y-1,c.face);}
   }
  }
  if(o.mouth&&o.mouth!=='smile'){
   const [x,y]=f.mouth;
   if(o.mouth==='tongue'){set(x,y,c.ink);set(x,y+1,c.pink);set(x+1,y+1,c.pink);set(x+2,y+2,c.pink);}
   else if(o.mouth==='surprised'){set(x,y,c.ink);set(x+1,y,c.ink);set(x-1,y+1,c.ink);set(x,y+1,c.pink);set(x+1,y+1,c.pink);}
  }
  if(o.extra&&o.extra!=='none')stamp(...f.extra,o.extra,false);
  if(o.scene&&o.scene!=='none')stamp(...f.scene,o.scene,true);
  if(o.color&&o.color!=='natural'&&Object.hasOwn(tint,o.color)){
   for(let y=0;y<h;y++)for(let x=0;x<w;x++)
    if(g[y][x]===c.fur)g[y][x]=tint[o.color];
  }
  return g.map(row=>row.join(''));
 }
 return Object.freeze({palette,sizes,originals,render,hashes});
})();