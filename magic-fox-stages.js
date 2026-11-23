'use strict';
/* Pikseluj — autorska rodzina liska zgodna z czterema poziomami.
   Każdy wzór powstał w docelowym rozmiarze (bez skalowania).
   RLE: długość w systemie 36 + piksel koloru, wiersze oddzielone /. */
const MagicFoxStages=(()=>{
 const packed={"easy":"2.3K6.3K2./2.1K1O2K5.1K1O1K2./2.1K1O1D2K3.1K1D1O1K2./2.1K1O1D1O5K1D1O1K2./1.2KaO2K1./1.1KcO1K1./1.1KcO1K1./1.1K3O1K4O1K3O1K1./1.1K3O1K4O1K3O1K1./1.1K1O3W4O3W1O1K1./1.1K2O3W2K3W2O1K1./1.2K2O2W2K2W2O2K1./2.2K2O4W2O2K2./3.2K6O2K3./4.8K4./g.","medium":"o./4.3K9.3K5./4.1K1O2K7.2K1O1K5./4.1K2O2K6.1K2O1K5./4.1K1O1P1O2K4.2K1O1P1K5./4.1K1O2P1O6K2O1P2K4./4.1K1O3P7O2P1O1K4./3.2KbO2P1O2K3./3.1KgO1K3./3.1K4O2K5O2K3O2K2./3.1K4O2K5O2K4O3K/3.1K1O3W8O3W2O1W1O1K/3.2K1O4W1O2K1O4W3O1W1O1K/4.1K2O4W1O1K4W3O3W1K/4.2K2O4W1K3W4O3W1K/5.3K2O1K3W1K5O3W1K/6.1K3O5W5O3W1K/5.2K2O7W5O2W1K/5.1K3O7W5O1W2K/5.1K2O9W5O1K1./5.2K2O8W4O2K1./6.1K3D5W3D3O1K2./6.1K3D1K1O1K1O1K3D2O2K2./6.fK3.","hard":"w./w./w./9.3Kc.3K5./9.1K1O2Ka.2K1O1K5./9.1K2O2K9.1K2O1K5./9.1K3O1K8.2K2O1K5./9.1K1O1D1O2K7.1K1O1D1O1K5./9.1K1O2D1O2K5.2K1O1D1O1K5./9.2K1O1P2O7K1O1D1P1O1K5./a.1K1O2P9O2P1O1K5./8.3K1O2P1O4L4O1P1D1O1K5./8.1K3O3P4L3O1D1P1D1O2K4./8.1KdO3D2O1K4./8.1KiO1K4./8.1KiO1K4./7.2K4O1K1W1K5O1K1W1K3O2K3./7.1K5O3K5O3K4O1K3./7.1K5O3K5O3K4O1K3./2.6KkO1K3./2.1K6O1W2PcO2P1W2K3./1.2K5O1K4WaO4W1K4./1.1K1O1W6O5W2O3K2O4W2K4./2K1O4W2O1K6W1O3K1O5W1K5./1K2O5W2O8W1K7W1K5./1K2O6W2O7W1K6W2K5./1K2O6W4O2W2K1W1K1W2K1W3O2K4./1K2O6W5O8W5O1K4./2K1O6W1O1K3O9W4O1K4./1.1K3O3W3O1K2O9W4O1K4./1.1K4O1W8O9W3O1K4./1.1KdOaW2O1K4./1.2KcOaW2O1K4./2.1KcOaW2O1K4./2.2KbOaW2O1K4./3.1K6O1K4O3W1K6W2O1K4./3.2K7O4D2W1K3W4D1O1K4./4.6K1O1K4D2O1K3O4D1O1K4./9.jK4./w.","expert":"z.5./z.5./z.5./z.5./z.5./z.5./z.5./n.3Ke./n.1K1O2Kd./n.1K2O2K5.3K4./n.1K3O3K3.1K1O1K4./b.1Kb.1K5O2K1.2K1O1K4./b.1Kb.1K6O1K1.1K2O2K3./7.2Y1.1Kc.1K1O1D4O3K1O1D1O1K3./7.2Y1.2Yb.2K2D4O2K1O1D1O1K3./7.2Y1K2Yc.1K1D1P1D3O1K1O1D1P1O1K3./9.1K2Yc.1K1D2P3O1K1O1D1P1O1K3./8.3Dd.1K1D2P5O1D1P1D2K2./l.4K1D3P3O1D3P1O1K2./l.1K3O4D3O1D3P1O1K2./k.2K6O4L1D4O1K2./k.1K3O2L2O4L4O2K2./k.1K3O2LbO2K1./j.2K3O2LcO1K1./j.1K4O2L4O1K1W1K5O1K1./i.2K4O2L4O3K2D3O2K/i.1KbO3K2D4O1K/i.1KdO1W4O3K/i.2KbO6W3K/j.1K9O2P5W2O1K1./i.2K6O3W2P2W4O2K1./i.1K5O9W1O4K2./8.3K7.1K6O7W1O2K5./3.6K1O3K5.1K6O6W2O1K6./3.1K8O7K5O6W2O2K6./2.2KjO6W3O1K7./2.1K2O4WeO6W3O1K7./1.2K1O6WcO8W2O1K7./1.1K1O8WaO9W2O1K7./1.1K1O8W6O3KbW1O1K7./1.1K1O8W4O2K3O2K9W1O1K7./1.1K1O7W3O2K5ObW1O1K7./1.1K1O7W2O1K8OaW1O2K6./1.1K1O7WbOaW2O1K6./1.1K1O6WcOaW2O1K6./1.1K2O3WeOaW2O1K6./1.1K3O1WgO1W5O3W2O1K6./1.2KpO1W4O1K6./2.2KtO1K6./3.1KeO2KdO1K6./3.2KbO5KcO1K6./4.4K6O3K3.2K1O6D1K4D6./7.4K1O3K6.dK6./a.3Kr./z.5./z.5."};
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
   // Dekoracja pojawia się tylko wtedy, gdy cała figura ma odstęp od postaci.
   const coords=pixels.map(([dx,dy])=>[x+dx,y+dy]);
   if(coords.some(([a,b])=>a<0||a>=w||b<0||b>=h||rows[b][a]!=='.'))return;
   for(const [a,b] of coords)set(a,b,c);
  };
  const cross=[[0,0],[-1,0],[1,0],[0,-1],[0,1]];
  const heart=[[-1,0],[1,0],[-2,1],[-1,1],[0,1],[1,1],[2,1],[0,2]];
  const flower=[[-1,0],[1,0],[0,-1],[0,1]];
  const locations=level==='medium'?[[2,3],[w-3,4]]:level==='hard'?[[3,6],[w-4,7],[w-4,h-7]]:[[5,6],[w-5,7],[w-5,h-10]];
  for(const [x,y] of locations){
   if(motif==='stars')shape(x,y,cross,'Y');
   if(motif==='hearts')shape(x,y,heart,'r');
   if(motif==='flowers'){
    shape(x,y,flower,'p');
    set(x,y,'Y');
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
