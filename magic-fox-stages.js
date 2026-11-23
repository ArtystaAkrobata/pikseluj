'use strict';
/* Pikseluj — autorska rodzina liska zgodna z czterema poziomami.
   Każdy wzór powstał w docelowym rozmiarze (bez skalowania).
   RLE: długość w systemie 36 + piksel koloru, wiersze oddzielone /. */
const MagicFoxStages=(()=>{
 const packed={"easy":"2.3K6.3K2./2.1K1O2K5.1K1O1K2./2.1K1O1D2K3.1K1D1O1K2./2.1K1O1D1O5K1D1O1K2./1.2KaO2K1./1.1KcO1K1./1.1KcO1K1./1.1K3O1K4O1K3O1K1./1.1K3O1K4O1K3O1K1./1.1K1O3W4O3W1O1K1./1.1K2O3W2K3W2O1K1./1.2K2O2W2K2W2O2K1./2.2K2O4W2O2K2./3.2K6O2K3./4.8K4./g.","medium":"o./4.3K9.3K5./4.1K1O2K7.2K1O1K5./4.1K2O2K6.1K2O1K5./4.1K1O1D1O2K4.2K1O1D1K5./4.1K1O1P1D1O6K2O1P2K4./4.1K1O1D1P1D7O2P1O1K4./3.2K2O1P9O1P1O2K3./3.1KgO1K3./3.1K4O2K5O2K3O1K3./3.1K4O2K5O2K3O1K3./3.1K1O1WcO1W1O1K3./3.2K1O2W3O2K3O2W1O2K3./1.4K1O5W1O1K5W1O1K4./1.1K3O1K2O4W1K3W2O2K4./2K4O1K2O1W1K3W1K3O1K5./1K1O2W3O1K2O5W3O2K4./1K1O3W4O7W3O1K4./1K1O4W1K2O8W2O1K4./1K3O1W2O1K9W2O1K4./2K6O1K8W2O1K4./1.1K6O1K2D4W3D1O1K4./1.2K6O2D1O1K2O3D1O1K4./2.iK4.","hard":"w./w./w./9.3Kc.3K5./9.1K1O2Ka.2K1O1K5./9.1K2O2K9.1K2O1K5./9.1K3O1K8.2K2O1K5./9.1K1O1D1O2K7.1K1O1D1O1K5./9.1K1O2D1O2K5.2K1O1D1O1K5./9.2K1O1P2O7K1O1D1P1O1K5./a.1K1O2P9O2P1O1K5./8.3K1O2P1O4L4O1P1D1O1K5./8.1K3O3P4L3O1D1P1D1O2K4./8.1KdO3D2O1K4./8.1KiO1K4./8.1KiO1K4./7.2K4O1K1W1K5O1K1W1K3O2K3./7.1K5O3K5O3K4O1K3./7.1K5O3K5O3K4O1K3./7.1KkO1K3./3.3K1.1K1O1W2PcO2P1W2K3./2.2K1O4K1O3WaO4W1K4./2.1K5O1K1O5W2O3K2O4W2K4./1.2K2O1W3O1K6W1O3K1O5W1K5./1.1K1O4W3O8W1K7W1K5./1.1K1O5W3O7W1K6W2K5./1.1K1O5W5O2W2K1W1K1W2K1W3O2K4./1.1K1O5W1O1K4O8W5O1K4./1.1K1O4W3O1K3O9W4O1K4./1.1K3O1W4O2K2O9W4O1K4./1.1KdO9W3O1K4./1.1KdOaW2O1K4./1.2KcOaW2O1K4./2.1KcOaW2O1K4./2.2KbOaW2O1K4./3.1KbO3W1K6W2O1K4./3.3K4O1K1O4D2W1K3W4D1O1K4./5.2K1O4K4D2O1K3O4D1O1K4./6.3K2.hK4./w.","expert":"z.5./z.5./z.5./z.5./z.5./z.5./z.5./z.5./z.5./k.3Kh./k.1K1O3K6.3K6./k.1K3O2K5.1K1O1K6./7.2Yb.1K2O1D1O3K2.2K1O2K5./7.2Y2K2Y7.2K2D3O1K2.1K1O1D1O1K5./7.2Y2K2Y8.1K3D2O2K1.1K1O1D1O1K5./9.2K2Y8.1K1D2P3O3K1D1P1O2K4./8.1D2Ka.1K1O2P1D2O2K1O1D1P1D1O1K4./8.1D2.1D9.1K1O2P1D3O1K1O1D2P1O1K4./k.2K1O3P1D3O1D3P1O2K3./j.2K2O1D1O1P4O1D1P1D3O1K3./i.2K6O4L6O1K3./h.2K7O4L4O3K3./f.3KgO2K4./c.4KjO1K4./b.2K9O4K9O1K4./a.2KeO1K8O1K4./a.1K1O2K3O1WhO1K4./a.4K8WcO2K4./b.1K2O9WbO1K5./b.2K2OeW4O2K5./c.3K1W2KbW4O1K6./h.1KcW2O2K6./h.2KbW3O1K6./6.8K4.2K9W4O2K5./5.2K6O3K3.1K1O9W4O1K5./3.3K9O2K1.2K2O8W4O2K4./3.1K5O1W6O3K2OaW4O1K4./2.2K2O4W8O1K2OaW4O2K3./2.1K2O6WaObW4O1K3./1.2K1O6W6O1K4ObW4O1K3./1.1K2O6W4O2K1O2K2ObW4O1K3./1.1K2O5W4O1K5O1K1ObW4O1K3./1.1K1O6WaO1K1OcW3O1K3./1.2K4WdO1KcW3O1K3./2.1K2O1WbO1K2O1KcW3O1K3./2.1K6O2W7O1K1O1KcW3O1K3./2.1K6O2W8O1K5O7W4O1K3./2.2KmO6W4O1K3./3.3K2O1DhO5W5O1K3./5.2K2O2DgO1W1K2W5O1K3./6.2K2O6D6O5D1O1K1O5D1O1K3./7.4K2O1D4O2K2O5D1O1K1O5D2K3./a.4K1O6K7O1K2O3K6./d.3K4.cK8./z.5./z.5."};
 const levels={"easy":[16,16],"medium":[24,24],"hard":[32,40],"expert":[40,56]};
 const allowed=new Set(['.','K','O','L','D','W','P','Y','R']);
 const descriptions={
  easy:'Główka liska',
  medium:'Mały lisek przodem',
  hard:'Lisek z dużym ogonem',
  expert:'Lisek z profilu i motylkiem'
 };
 const palettes={
  natural:{O:'O',L:'H',D:'n'},O:{O:'O',L:'H',D:'n'},
  p:{O:'p',L:'t',D:'X'},v:{O:'v',L:'p',D:'u'},
  b:{O:'b',L:'w',D:'a'},l:{O:'l',L:'H',D:'g'},
  n:{O:'n',L:'e',D:'d'},w:{O:'w',L:'c',D:'s'}
 };
 const permanent={'.':'.',K:'k',W:'w',P:'p',Y:'Y',R:'r'};
 const templates=new Map();
 function master(level='medium'){
  if(!Object.hasOwn(levels,level))level='medium';
  if(templates.has(level))return templates.get(level);
  const rows=packed[level].split('/').map(line=>{
   if(line.length%2)throw new Error('Niepoprawny wzór liska: '+level);
   let row='';
   for(let i=0;i<line.length;i+=2){
    const n=parseInt(line[i],36),color=line[i+1];
    if(!Number.isInteger(n)||n<1||!allowed.has(color))throw new Error('Uszkodzona paleta: '+level);
    row+=color.repeat(n);
   }
   return row;
  });
  const [w,h]=levels[level];
  if(rows.length!==h||rows.some(r=>r.length!==w))throw new Error('Niepoprawne wymiary: '+level);
  templates.set(level,rows);
  return rows;
 }
 function scene(rows,level,motif){
  if(level==='easy'||!motif||motif==='none')return;
  const w=rows[0].length,h=rows.length;
  const set=(x,y,c)=>{
   x=Math.round(x);y=Math.round(y);
   if(x>=0&&x<w&&y>=0&&y<h&&rows[y][x]==='.')rows[y][x]=c;
  };
  const shape=(x,y,pixels,c)=>{
   const coords=pixels.map(([dx,dy])=>[x+dx,y+dy]);
   // Nie rysujemy połowy ozdoby. Potrzebna jest cała figurka
   // i minimum jedna pusta kratka odstępu od sylwetki liska.
   if(coords.some(([a,b])=>
      a<1||a>=w-1||b<1||b>=h-1||rows[b][a]!=='.'
      ||[[-1,0],[1,0],[0,-1],[0,1]].some(([dx,dy])=>{
        const xx=a+dx,yy=b+dy;
        return !coords.some(([px,py])=>px===xx&&py===yy) && rows[yy][xx]!=='.';
      })
   ))return false;
   for(const [a,b] of coords)set(a,b,c);
   return true;
  };
  const cross=[[0,0],[-1,0],[1,0],[0,-1],[0,1]];
  const heart=[[-1,0],[1,0],[-2,1],[-1,1],[0,1],[1,1],[2,1],[0,2]];
  const flower=[[-1,0],[1,0],[0,-1],[0,1]];
  const locations=level==='medium'?[[2,3],[w-3,4]]:level==='hard'?[[3,6],[w-4,7],[w-4,h-7]]:[[5,6],[w-5,7],[w-5,h-10]];
  for(const [x,y] of locations){
   if(motif==='stars')shape(x,y,cross,'Y');
   if(motif==='hearts')shape(x,y,heart,'r');
   if(motif==='flowers'){
    // Płatki i środek dodajemy razem, inaczej powstają samotne żółte kropki.
    shape(x,y,[...flower,[0,0]],'p') && (rows[y][x]='Y');
   }
  }
 }
 function render(options={},level='medium'){
  if(!Object.hasOwn(levels,level))level='medium';
  const rows=master(level).map(r=>r.split(''));
  scene(rows,level,options.scene||'none');
  const color=palettes[options.color]||palettes.natural;
  return rows.map(row=>row.map(c=>color[c]||permanent[c]||'.').join(''));
 }
 return Object.freeze({master,render,levels,descriptions,stages:['easy','medium','hard','expert']});
})();
