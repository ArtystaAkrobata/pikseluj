'use strict';
/* Pikseluj: ręcznie opracowane i sprawdzone ilustracje zwierzątek.
   Wymiary i kontury są autorskimi siatkami dla każdego poziomu. Zmiana
   cech dotyka tylko miejsc przeznaczonych na te cechy. */
const MagicCuratedAnimals=(()=>{
  const specs={
    easy:{w:16,h:16,eyes:[6,10,7],nose:[8,9],neck:12,top:1},
    medium:{w:24,h:24,eyes:[9,15,10],nose:[12,13],neck:17,top:4},
    hard:{w:32,h:40,eyes:[12,20,17],nose:[16,23],neck:28,top:10},
    expert:{w:40,h:56,eyes:[15,25,23],nose:[20,31],neck:38,top:14}
  };
  const palettes={
    p:{main:'p',shade:'X',light:'t'},v:{main:'v',shade:'u',light:'p'},
    b:{main:'b',shade:'a',light:'w'},l:{main:'l',shade:'g',light:'H'},
    O:{main:'O',shade:'n',light:'H'},w:{main:'w',shade:'s',light:'w'},
    n:{main:'n',shade:'e',light:'H'},e:{main:'e',shade:'n',light:'H'}
  };
  const natural={fox:'O',cat:'e',bear:'n',bunny:'w'};
  const cache=new Map();
  function master(kind,size){
    const id=kind+':'+size;
    if(cache.has(id))return cache.get(id);
    const entry=MagicCuratedData[kind]?.[size],spec=specs[size];
    if(!entry||!spec)throw new Error('Brak wzoru premium: '+id);
    const rows=entry.split('/').map(encoded=>{
      let row='';
      if(encoded.length%2)throw new Error('Błędny zapis wiersza '+id);
      for(let i=0;i<encoded.length;i+=2){
        const count=parseInt(encoded[i],36),color=encoded[i+1];
        if(!(count>=1&&count<=35)||!'.kOnecwpHY'.includes(color))throw new Error('Błędna paleta '+id);
        row+=color.repeat(count);
      }
      return row;
    });
    if(rows.length!==spec.h||rows.some(row=>row.length!==spec.w))throw new Error('Błędne wymiary '+id);
    cache.set(id,rows);
    return rows;
  }
  function render(kind,options={},size='medium'){
    const spec=specs[size]||specs.medium,w=spec.w,h=spec.h;
    const matrix=master(kind,size).map(row=>row.split(''));
    const want=options.color==='natural'||!options.color?(natural[kind]||'O'):options.color;
    const palette=palettes[want]||palettes.O;
    // Recolour only pigment roles, never the 1-cell ink outline.
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const old=matrix[y][x];
      if(old==='O')matrix[y][x]=palette.main;
      else if(old==='n')matrix[y][x]=palette.shade;
      else if(old==='H')matrix[y][x]=palette.light;
      else if(old==='p'&&palette.main==='p')matrix[y][x]='t';
    }
    const pixel=(x,y,v,blank=false)=>{
      x=Math.round(x);y=Math.round(y);
      if(x<0||x>=w||y<0||y>=h)return;
      if(blank&&matrix[y][x]!=='.')return;
      matrix[y][x]=v;
    };
    const get=(x,y)=>matrix[y]?.[x]??'.';
    const line=(x0,y0,x1,y1,v)=>{
      let x=Math.round(x0),y=Math.round(y0),xx=Math.round(x1),yy=Math.round(y1);
      const dx=Math.abs(xx-x),dy=-Math.abs(yy-y),sx=x<xx?1:-1,sy=y<yy?1:-1;
      let err=dx+dy;
      while(true){
        pixel(x,y,v);
        if(x===xx&&y===yy)break;
        const e=2*err;
        if(e>=dy){err+=dy;x+=sx}
        if(e<=dx){err+=dx;y+=sy}
      }
    };
    const segment=(x,y,ww,hh,v)=>{
      for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++)pixel(xx,yy,v);
    };
    const star=(x,y,c='Y')=>{
      for(const [dx,dy] of [[0,0],[-1,0],[1,0],[0,-1],[0,1]])pixel(x+dx,y+dy,c,true);
    };
    const flower=(x,y)=>{
      for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])
        pixel(x+dx,y+dy,'p',true);
      pixel(x,y,'Y',true);pixel(x,y+2,'g',true);
    };
    const heart=(x,y)=>{
      for(const [dx,dy] of [[-1,0],[1,0],[-2,1],[-1,1],[0,1],[1,1],[2,1],[0,2]])
        pixel(x+dx,y+dy,'r',true);
    };
    // Dekoracje zachowują czarny kontur sylwetki.
    const trim=(x,y,v)=>{if(get(x,y)!=='k')pixel(x,y,v)};
    const trimRect=(x,y,ww,hh,v)=>{for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++)trim(xx,yy,v)};
    const [left,right,eyeY]=spec.eyes;
    const [noseX,noseY]=spec.nose;
    const eyes=options.eyes||'sparkle';
    const faceFill=palette.main;
    const radius=size==='easy'?0:size==='medium'?1:size==='hard'?2:2;
    if(eyes==='round'){
      for(const center of [left,right]){
        for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
          if(Math.abs(dx)+Math.abs(dy)<=radius+1 && get(center+dx,eyeY+dy)==='w')pixel(center+dx,eyeY+dy,'k');
        }
      }
    }else if(eyes==='happy'||eyes==='wink'){
      const centers=eyes==='wink'?[right]:[left,right];
      for(const center of centers){
        const half=size==='easy'?0:size==='medium'?1:size==='hard'?2:3;
        const top=eyeY-Math.max(1,radius+1),bottom=eyeY+Math.max(1,radius+1);
        for(let yy=top;yy<=bottom;yy++)for(let xx=center-half-1;xx<=center+half+1;xx++){
          if(get(xx,yy)==='k'||get(xx,yy)==='w')pixel(xx,yy,faceFill);
        }
        if(size==='easy'){
          pixel(center,eyeY,'k');
          if(eyes==='happy')pixel(center,eyeY+1,'k');
        }else{
          line(center-half,eyeY,center,eyeY-1,'k');
          line(center,eyeY-1,center+half,eyeY,'k');
        }
      }
    }
    // Nose is always in a fixed position; only the tiny mouth changes.
    const mouth=options.mouth||'smile';
    if(mouth==='tongue'){
      pixel(noseX,noseY+2,'r');
      if(size!=='easy')pixel(noseX,noseY+3,'p');
    }else if(mouth==='surprised'){
      pixel(noseX,noseY+2,'k');
      if(size==='hard'||size==='expert')pixel(noseX,noseY+3,'k');
    }
    const extra=options.extra||'none';
    if(extra==='scarf'){
      const width=size==='easy'?4:size==='medium'?9:size==='hard'?12:16;
      const x=Math.round(w/2-width/2),y=spec.neck;
      segment(x,y,width,size==='easy'?1:2,'r');
      if(size==='hard'||size==='expert'){
        const x2=x+width-4;
        segment(x2,y+2,3,size==='hard'?4:6,'r');
        pixel(x2+1,y+4,'H');
      }
    }else if(extra==='bow'){
      const x=size==='easy'?11:size==='medium'?18:size==='hard'?24:30;
      const y=size==='easy'?3:size==='medium'?6:size==='hard'?9:11;
      trimRect(x-2,y,2,2,'r');trimRect(x+1,y,2,2,'r');
      trim(x,y+1,'Y');
    }else if(extra==='flower'){
      const x=size==='easy'?11:size==='medium'?18:size==='hard'?24:30;
      const y=size==='easy'?3:size==='medium'?5:size==='hard'?8:10;
      // Accessible flower, isolated from eyes by design.
      for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])trim(x+dx,y+dy,'p');
      trim(x,y,'Y');
    }else if(extra==='crown'){
      const x=Math.round(w/2),y=spec.top;
      const radius=size==='easy'?1:size==='medium'?2:3;
      trimRect(x-radius,y+1,2*radius+1,2,'Y');
      trim(x-radius,y,'Y');trim(x,y-1,'Y');trim(x+radius,y,'Y');
      if(size!=='easy')trim(x,y+2,'r');
    }else if(extra==='star'){
      const x=size==='easy'?12:size==='medium'?20:size==='hard'?28:35;
      const y=size==='easy'?3:size==='medium'?6:size==='hard'?10:12;
      star(x,y,'Y');
    }
    const scene=options.scene||'stars';
    if(size!=='easy'){
      if(scene==='stars'){
        const sizeScale=size==='medium'?0:size==='hard'?1:2;
        star(2+sizeScale,Math.max(3,Math.round(h*.16)),'Y');
        star(w-3-sizeScale,Math.max(4,Math.round(h*.26)),'H');
        if(size==='expert')star(4,h-8,'H');
      }else if(scene==='flowers'){
        flower(3,h-4);if(size==='hard'||size==='expert')flower(w-4,h-6);
      }else if(scene==='hearts'){
        heart(3,Math.max(3,Math.round(h*.14)));
        if(size==='expert')heart(w-5,h-8);
      }
    }
    return matrix.map(row=>row.join(''));
  }
  return Object.freeze({render,master,specs});
})();