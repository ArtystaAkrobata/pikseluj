'use strict';
/* Magiczne piksele — 24x24, te same kolory i zapis co ręczny Kreator. */
const MAGIC_SIZE=24, MAGIC_KEY='pikseluj/magiczne/v1';
const MAGIC_VARIANTS={
 easy:{width:16,height:16,label:'Łatwy',sheet:'A6'},
 medium:{width:24,height:24,label:'Średni',sheet:'A5'},
 hard:{width:32,height:40,label:'Trudny',sheet:'A4'},
 expert:{width:40,height:56,label:'Ekspert',sheet:'A4'}
};
const magicDefs={
 animals:{title:'Zwierzątka',emoji:'🐱',desc:'Słodcy bohaterowie z charakterem',fields:[
  {key:'kind',title:'Wybierz zwierzaka',options:[['cat','Kotek','🐱'],['bear','Miś','🐻'],['bunny','Króliczek','🐰'],['fox','Lisek','🦊']]},
  {key:'eyes',title:'Jakie oczy?',options:[['sparkle','Błyszczące','✨'],['round','Duże','👀'],['happy','Wesołe','😊'],['wink','Mrugające','😉']]},
  {key:'mouth',title:'Jaka minka?',options:[['smile','Uśmiech','😊'],['tongue','Języczek','😋'],['surprised','Zdziwiona','😮']]},
  {key:'extra',title:'Magiczny dodatek',options:[['bow','Kokardka','🎀'],['flower','Kwiatuszek','🌼'],['star','Gwiazdka','⭐'],['crown','Korona','👑'],['scarf','Szalik','🧣'],['none','Bez ozdoby','🌟']]},
  {key:'scene',title:'Małe ozdoby wokół',options:[['stars','Iskierki','✨'],['flowers','Kwiatki','🌸'],['hearts','Serduszka','💕'],['none','Bez tła','☁️']]},
  {key:'color',title:'Kolor bohatera',options:[['natural','Naturalny','🎨'],['w','Biały','🤍'],['n','Brązowy','🤎'],['p','Różowy','🩷'],['v','Fioletowy','💜'],['b','Błękitny','🩵'],['l','Zielony','💚'],['O','Pomarańczowy','🧡']]}
 ]},
 monsters:{title:'Potworki',emoji:'👾',desc:'Śmieszne stworki, których nie da się nie polubić',fields:[
  {key:'kind',title:'Kształt stworka',options:[['round','Puchatek','🟣'],['square','Kwadratek','🧊'],['jelly','Galaretek','🍮']]},
  {key:'eyes',title:'Ile oczu?',options:[['two','Dwoje','👀'],['one','Jedno','👁️'],['three','Troje','👾']]},
  {key:'mouth',title:'Minka',options:[['smile','Uśmiech','😊'],['tongue','Języczek','😛'],['surprised','Zdziwiona','😲']]},
  {key:'extra',title:'Co na głowie?',options:[['horns','Różki','😈'],['antenna','Czułki','📡'],['crown','Korona','👑'],['none','Bez dodatku','✨']]},
  {key:'scene',title:'Magiczne tło',options:[['stars','Iskry','✨'],['hearts','Serduszka','💕'],['flowers','Kwiatki','🌸'],['none','Bez tła','☁️']]},
  {key:'color',title:'Kolor stworka',options:[['v','Fioletowy','💜'],['p','Różowy','🩷'],['b','Błękitny','🩵'],['l','Zielony','💚'],['O','Pomarańczowy','🧡']]}
 ]},
 robots:{title:'Roboty',emoji:'🤖',desc:'Superroboty z własną osobowością',fields:[
  {key:'kind',title:'Głowa robota',options:[['square','Klasyczna','▣'],['round','Okrągła','⚙️'],['tall','Wysoka','🗼']]},
  {key:'eyes',title:'Oczy i wyświetlacz',options:[['dots','Świecące oczy','🤖'],['visor','Wizjer','🥽'],['sleepy','Senne oczka','😴']]},
  {key:'mouth',title:'Znak na panelu',options:[['heart','Serce','❤️'],['star','Gwiazdka','⭐'],['lights','Lampki','🚥']]},
  {key:'extra',title:'Antena',options:[['one','Jedna','📡'],['two','Dwie','✨'],['none','Bez anteny','🚫']]},
  {key:'scene',title:'Otoczenie',options:[['stars','Energia','⚡'],['hearts','Serduszka','💕'],['none','Bez tła','☁️']]},
  {key:'color',title:'Kolor obudowy',options:[['b','Błękitny','🩵'],['v','Fioletowy','💜'],['p','Różowy','🩷'],['l','Zielony','💚'],['O','Pomarańczowy','🧡']]}
 ]},
 worlds:{title:'Bajkowe światy',emoji:'🏰',desc:'Zamki, lasy, tajemnicze domki i morza',fields:[
  {key:'kind',title:'Wybierz krainę',options:[['castle','Magiczny zamek','🏰'],['forest','Leśna bajka','🍄'],['garden','Bajkowy domek','🏡'],['sea','Latarnia morska','🌊']]},
  {key:'eyes',title:'Pora dnia',options:[['day','Słoneczny dzień','☀️'],['evening','Zachód słońca','🌅'],['night','Noc z gwiazdami','🌙']]},
  {key:'extra',title:'Niebo i dekoracje',options:[['cloud','Chmurki','☁️'],['stars','Gwiazdy','✨'],['hearts','Serduszka','💕'],['none','Bez ozdób','🌤️']]},
  {key:'color',title:'Kolor głównego obiektu',options:[['v','Fioletowy','💜'],['p','Różowy','🩷'],['b','Błękitny','🩵'],['l','Zielony','💚'],['O','Pomarańczowy','🧡']]}
 ]}
};
const magicFresh=()=>Object.fromEntries(Object.entries(magicDefs).map(([id,def])=>[id,Object.fromEntries(def.fields.map(f=>[f.key,f.options[0][0]]))]));
const magicState={category:null,name:'',size:'medium',values:magicFresh()},magicUndo=[];
try{
 const saved=JSON.parse(localStorage.getItem(MAGIC_KEY)||'null');
 if(saved && typeof saved==='object'){
  if(saved.category===null||Object.hasOwn(magicDefs,saved.category))magicState.category=saved.category;
  if(typeof saved.name==='string')magicState.name=saved.name.slice(0,42);
  if(Object.hasOwn(MAGIC_VARIANTS,saved.size))magicState.size=saved.size;
  for(const [id,def] of Object.entries(magicDefs))for(const field of def.fields){
   const value=saved.values?.[id]?.[field.key];
   if(field.options.some(opt=>opt[0]===value))magicState.values[id][field.key]=value;
  }
 }
}catch{/* przechowywanie opcjonalne */}
const magicSnapshot=()=>({category:magicState.category,name:magicState.name,size:magicState.size,values:JSON.parse(JSON.stringify(magicState.values))});
function magicHistory(){magicUndo.push(magicSnapshot());if(magicUndo.length>20)magicUndo.shift()}
function magicPersist(){try{localStorage.setItem(MAGIC_KEY,JSON.stringify(magicSnapshot()))}catch{/* bez zapisu */}}
function magicMessage(message=''){document.getElementById('magic-feedback').textContent=message}
function magicCanvas(){
 const data=Array.from({length:24},()=>Array(24).fill('.'));
 const pixel=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<24&&y>=0&&y<24)data[y][x]=c};
 const rect=(x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)pixel(i,j,c)};
 const oval=(cx,cy,rx,ry,c)=>{for(let j=Math.floor(cy-ry);j<=Math.ceil(cy+ry);j++)for(let i=Math.floor(cx-rx);i<=Math.ceil(cx+rx);i++)if(((i-cx)/rx)**2+((j-cy)/ry)**2<=1)pixel(i,j,c)};
 const blob=(cx,cy,rx,ry,c)=>{oval(cx,cy,rx,ry,'k');oval(cx,cy,rx-1,ry-1,c)};
 const hline=(x,y,n,c)=>rect(x,y,n,1,c);
 const line=(x,y,xx,yy,c)=>{const n=Math.max(Math.abs(xx-x),Math.abs(yy-y));for(let i=0;i<=n;i++){const t=i/(n||1);pixel(x+(xx-x)*t,y+(yy-y)*t,c)}};
 const star=(x,y,c)=>{pixel(x,y-2,c);pixel(x,y-1,c);rect(x-2,y,5,1,c);pixel(x,y+1,c);pixel(x,y+2,c)};
 const heart=(x,y,c)=>{pixel(x,y,c);pixel(x+2,y,c);rect(x-1,y+1,5,2,c);rect(x,y+3,3,1,c);pixel(x+1,y+4,c)};
 const eye=(x,y,type)=>{if(type==='happy'){line(x-1,y+1,x,y-1,'k');line(x,y-1,x+1,y+1,'k')}else if(type==='wink')hline(x-1,y,3,'k');else{rect(x-1,y-1,3,4,'w');rect(x,y,2,2,'k');pixel(x,y,'w')}};
 return {pixel,rect,oval,blob,hline,line,star,heart,eye,rows:()=>data.map(row=>row.join(''))};
}
function magicAnimal(g,o){
 const c=o.color;
 if(o.kind==='cat'||o.kind==='fox'){g.blob(19,17,3,4,o.kind==='fox'?'O':c);g.pixel(21,15,'w')}
 g.blob(12,17,6,5,c);
 g.rect(7,20,3,2,'k');g.rect(14,20,3,2,'k');g.pixel(8,20,c);g.pixel(15,20,c);
 if(o.kind==='bunny'){
  g.blob(8,5,2,5,c);g.blob(16,5,2,5,c);g.rect(8,2,1,6,'t');g.rect(16,2,1,6,'t');
 }else if(o.kind==='bear'){
  g.blob(6,7,3,3,c);g.blob(18,7,3,3,c);g.pixel(6,7,'p');g.pixel(18,7,'p');
 }else{
  g.line(4,10,5,3,'k');g.line(5,3,10,7,'k');g.line(14,7,19,3,'k');g.line(19,3,20,10,'k');
  g.rect(6,5,3,5,c);g.rect(16,5,3,5,c);
  g.pixel(7,6,'p');g.pixel(17,6,'p');
 }
 g.blob(12,12,8,7,c);
 g.oval(12,15,o.kind==='fox'?5:3,2,o.kind==='fox'?'w':'c');
 g.eye(9,11,o.eyes==='wink'?'wink':o.eyes);
 g.eye(15,11,o.eyes==='wink'?'round':o.eyes);
 g.pixel(12,14,'k');g.pixel(11,16,'k');g.pixel(13,16,'k');
 g.pixel(6,14,'p');g.pixel(18,14,'p');
 if(o.extra==='bow'){g.rect(3,4,3,3,'p');g.rect(9,4,3,3,'p');g.rect(6,5,3,2,'H')}
 if(o.extra==='star')g.star(20,4,'H');
 if(o.extra==='heart')g.heart(19,3,'r');
}
function magicMonster(g,o){
 const c=o.color;g.rect(7,20,3,2,'k');g.rect(14,20,3,2,'k');
 if(o.kind==='square'){g.rect(4,6,16,14,'k');g.rect(5,7,14,12,c)}
 else if(o.kind==='jelly'){g.blob(12,13,9,8,c);g.rect(5,17,3,3,c);g.rect(16,17,3,3,c)}
 else g.blob(12,12,8,8,c);
 if(o.extra==='horns'){
  g.rect(6,3,3,5,'k');g.rect(15,3,3,5,'k');g.rect(7,4,1,4,'H');g.rect(16,4,1,4,'H');
 }else if(o.extra==='antenna'){g.rect(11,3,2,6,'k');g.blob(12,3,2,2,'p')}
 if(o.eyes==='one'){g.blob(12,11,4,4,'w');g.blob(12,12,2,2,'k');g.pixel(11,11,'w')}
 else if(o.eyes==='three'){for(const [x,y] of [[7,11],[12,9],[17,11]]){g.blob(x,y,2,3,'w');g.pixel(x,y+1,'k')}}
 else{g.blob(8,11,3,3,'w');g.blob(16,11,3,3,'w');g.rect(8,10,2,2,'k');g.rect(16,10,2,2,'k')}
 g.hline(9,16,7,'k');g.pixel(10,17,'w');g.pixel(14,17,'w');
 g.pixel(6,16,'p');g.pixel(18,16,'p');
}
function magicRobot(g,o){
 const c=o.color;g.rect(6,13,12,9,'k');g.rect(7,14,10,7,c);
 g.rect(3,14,3,5,'k');g.rect(18,14,3,5,'k');
 g.rect(4,15,2,2,'s');g.rect(18,15,2,2,'s');
 g.rect(8,22,3,2,'k');g.rect(14,22,3,2,'k');
 g.rect(10,16,4,3,'k');g.rect(11,17,2,1,'H');
 if(o.kind==='tall'){g.rect(5,4,14,10,'k');g.rect(6,5,12,8,c)}
 else if(o.kind==='round')g.blob(12,9,8,6,c);
 else{g.rect(4,6,16,9,'k');g.rect(5,7,14,7,c)}
 g.rect(3,10,2,3,'s');g.rect(19,10,2,3,'s');
 if(o.extra==='one'){g.rect(11,2,2,5,'k');g.rect(10,1,4,3,'r')}
 else if(o.extra==='two'){g.rect(7,2,2,5,'k');g.rect(16,2,2,5,'k');g.rect(6,1,4,3,'H');g.rect(15,1,4,3,'p')}
 if(o.eyes==='visor'){g.rect(7,9,10,4,'k');g.rect(8,10,8,2,'b');g.pixel(9,10,'w')}
 else if(o.eyes==='sleepy'){g.hline(8,10,3,'k');g.hline(14,10,3,'k')}
 else{g.rect(7,9,4,4,'w');g.rect(14,9,4,4,'w');g.rect(9,10,2,2,'k');g.rect(15,10,2,2,'k')}
 g.hline(10,14,5,'k');
}
function magicWorld(g,o){
 const c=o.color, sky=o.eyes==='night'?'u':o.eyes==='evening'?'p':'b';
 g.rect(0,0,24,18,sky);g.rect(0,16,24,8,o.kind==='sea'?'a':'l');
 g.rect(0,19,24,5,o.kind==='sea'?'b':'g');
 if(o.eyes==='night'){g.star(3,3,'H');g.star(18,4,'H')}
 else g.blob(20,4,3,3,o.eyes==='evening'?'O':'H');
 if(o.kind==='castle'){
  g.rect(5,9,14,13,'k');g.rect(6,10,12,11,c);
  g.rect(3,7,5,15,'k');g.rect(4,8,3,13,c);
  g.rect(16,7,5,15,'k');g.rect(17,8,3,13,c);
  for(const x of [3,7,11,15,19])g.rect(x,5,2,4,'k');
  g.rect(10,16,4,6,'n');g.rect(6,11,2,3,'w');g.rect(16,11,2,3,'w');
 }else if(o.kind==='forest'){
  for(const [x,y] of [[5,11],[13,8],[20,12]]){
   g.rect(x-1,y+6,3,9,'n');g.blob(x,y+4,4,6,x===13?c:'d');
   g.blob(x-1,y,3,3,'l');
  }
  g.rect(11,20,4,2,'r');g.rect(11,19,4,1,'w');
 }else if(o.kind==='garden'){
  g.rect(6,12,12,10,'k');g.rect(7,13,10,8,'c');
  g.rect(4,10,16,3,'r');g.rect(8,7,8,3,'r');
  g.rect(10,17,4,5,'n');g.rect(15,15,2,3,'b');
  for(const x of [3,20]){g.rect(x,17,1,6,'d');g.blob(x,16,2,2,x===3?c:'p');g.pixel(x,16,'H')}
 }else{
  g.rect(0,20,12,4,'e');g.rect(4,10,7,12,'k');g.rect(5,11,5,10,'w');
  g.rect(5,14,5,3,'r');g.rect(5,19,5,2,'r');
  g.rect(3,7,9,3,'k');g.rect(4,6,7,2,c);
  g.rect(6,5,3,3,'H');g.rect(7,3,1,2,'k');
  g.hline(14,20,9,'w');
 }
 if(o.extra==='cloud'){g.blob(5,4,3,2,'w');g.blob(10,5,3,2,'w')}
 else if(o.extra==='stars'){g.star(3,3,'H');g.star(15,2,'H')}
 else if(o.extra==='hearts'){g.heart(3,2,'r');g.heart(16,4,'r')}
}
function magicRows(){
 if(!magicState.category)return Array(24).fill('.'.repeat(24));
 return MagicPremiumArt.render(magicState.category,magicState.values[magicState.category],magicState.size);
}
function magicDefaultName(){
 if(!magicState.category)return 'Mój magiczny wzór';
 const d=magicDefs[magicState.category],o=magicState.values[magicState.category];
 const chosen=d.fields[0].options.find(item=>item[0]===o.kind);
 return 'Mój '+(chosen?chosen[1]:d.title).toLowerCase();
}
let magicShowGrid=false;
function magicCelebrate(){
 const art=document.getElementById('magic-art');
 if(!art||magicState.category===null)return;
 art.classList.remove('magic-animate');
 void art.offsetWidth;
 art.classList.add('magic-animate');
}
function magicOptionIcon(field,key,emoji){
 return emoji||({none:'✦',natural:'🎨',stars:'✨'}[key]||'✦');
}
function magicCreateButton(className,label){
 const button=document.createElement('button');
 button.type='button';button.className=className;
 if(label!==undefined)button.textContent=label;
 return button;
}
function magicCategoryPreview(cat,def){
 const first=Object.fromEntries(def.fields.map(field=>[field.key,field.options[0][0]]));
 const rows=MagicPremiumArt.render(cat,first,'medium');
 return sprite(readPattern({id:'mini-'+cat,art:rows.join('\n')}));
}
function magicRender(){
 const choosing=document.getElementById('magic-start');
 const work=document.getElementById('magic-workbench');
 if(!choosing||!work)return;
 const selected=Boolean(magicState.category);
 choosing.hidden=selected;work.hidden=!selected;
 const back=document.getElementById('magic-back');
 back.textContent=selected?'← Wybierz inną przygodę':'← Strona główna';
 if(!selected){
  const container=document.getElementById('magic-categories');
  container.replaceChildren();
  for(const [cat,def] of Object.entries(magicDefs)){
   const button=magicCreateButton('magic-category-card magic-category-'+cat);
   button.dataset.category=cat;
   button.setAttribute('aria-label',def.title+'. '+def.desc);
   const art=document.createElement('span');art.className='magic-category-art';
   art.append(magicCategoryPreview(cat,def));
   const title=document.createElement('strong');title.textContent=def.emoji+' '+def.title;
   const desc=document.createElement('small');desc.textContent=def.desc;
   const hint=document.createElement('span');hint.className='magic-category-arrow';hint.textContent='Twórz ✨';
   button.append(art,title,desc,hint);container.append(button);
  }
  return;
 }
 const def=magicDefs[magicState.category],values=magicState.values[magicState.category];
 const variant=MAGIC_VARIANTS[magicState.size];
 document.getElementById('magic-category-name').textContent=def.emoji+' '+def.title;
 const scene=document.getElementById('magic-art-scene');
 scene.dataset.category=magicState.category;
 document.getElementById('magic-preview-size').textContent=variant.width+' × '+variant.height+' kratek';
 document.getElementById('magic-size-hint').textContent='📄 Zalecana kartka: '+variant.sheet+' · 1 kratka = 5 mm';
 const levelSelect=document.getElementById('magic-size');
 levelSelect.value=magicState.size;
 const levels=document.getElementById('magic-levels');
 levels.replaceChildren();
 const levelIcons={easy:'🌱',medium:'🌈',hard:'🔥',expert:'👑'};
 const levelNotes={easy:'Pierwsze kroki',medium:'Więcej kolorów',hard:'Więcej szczegółów',expert:'Mistrz pikseli'};
 for(const [key,item] of Object.entries(MAGIC_VARIANTS)){
  const selected=key===magicState.size;
  const button=magicCreateButton('magic-level-card'+(selected?' is-selected':''));button.dataset.level=key;
  button.setAttribute('aria-pressed',String(selected));
  const emoji=document.createElement('span');emoji.className='magic-level-icon';emoji.textContent=levelIcons[key];
  const label=document.createElement('strong');label.textContent=item.label;
  const dimensions=document.createElement('small');dimensions.textContent=item.width+' × '+item.height;
  const note=document.createElement('span');note.className='magic-level-note';note.textContent=levelNotes[key];
  button.append(emoji,label,dimensions,note);levels.append(button);
 }
 const fields=document.getElementById('magic-fields');
 fields.replaceChildren();
 for(const field of def.fields){
  const group=document.createElement('fieldset');group.className='magic-trait-group';
  const legend=document.createElement('legend');legend.textContent=field.title;
  const choices=document.createElement('div');choices.className='magic-trait-choices';
  const isColor=field.key==='color';
  if(isColor)choices.classList.add('magic-color-choices');
  for(const [key,label,emoji] of field.options){
   const selected=values[field.key]===key;
   const button=magicCreateButton('magic-choice'+(isColor?' magic-color-choice':'')+(selected?' is-selected':''),undefined);
   button.dataset.field=field.key;button.dataset.option=key;
   button.setAttribute('aria-pressed',String(selected));
   button.setAttribute('aria-label',label);
   if(isColor){
    const circle=document.createElement('i');circle.className='magic-color-dot';
    const colorMap={natural:'#db9c6e',w:'#ffffff',n:'#9c6b4c',p:'#f59cc9',v:'#ad85e9',b:'#7cc9f7',l:'#8bd283',O:'#ffae51'};
    circle.style.setProperty('--magic-dot',colorMap[key]||'#ffd95b');
    button.append(circle);
   }else{
    const icon=document.createElement('span');icon.className='magic-choice-icon';
    icon.textContent=magicOptionIcon(field.key,key,emoji);button.append(icon);
   }
   const words=document.createElement('span');words.textContent=label;button.append(words);
   if(selected){const check=document.createElement('span');check.className='magic-choice-check';check.textContent='✓';button.append(check)}
   choices.append(button);
  }
  group.append(legend,choices);fields.append(group);
 }
 const name=document.getElementById('magic-name');
 if(name.value!==magicState.name)name.value=magicState.name;
 name.placeholder=magicDefaultName();
 document.getElementById('magic-undo').disabled=magicUndo.length===0;
 const rows=magicRows();
 const pattern=readPattern({id:'magic-premium-preview',art:rows.join('\n')});
 const art=document.getElementById('magic-art');
 art.replaceChildren(sprite(pattern,{paper:magicShowGrid}));
 art.setAttribute('aria-label',def.title+'. '+variant.width+' na '+variant.height+' kratek.');
 const gridToggle=document.getElementById('magic-grid-toggle');
 gridToggle.setAttribute('aria-pressed',String(magicShowGrid));
 gridToggle.textContent=magicShowGrid?'✨ Ukryj kratki':'▦ Pokaż kratki';
}
function magicOpen(){magicRender();magicMessage('')}
function magicChoose(category){
 if(!Object.hasOwn(magicDefs,category))return;
 magicHistory();magicState.category=category;magicState.name='';
 magicPersist();magicRender();magicMessage('');
 window.scrollTo(0,0);
 document.getElementById('magic-title').focus({preventScroll:true});
}
function magicUndoLast(){
 if(!magicUndo.length)return;
 const past=magicUndo.pop();
 magicState.category=past.category;magicState.name=past.name;magicState.size=past.size||'medium';magicState.values=past.values;
 magicPersist();magicRender();magicMessage('Cofnięto ostatnią zmianę.');
}
function magicRandomize(){
 if(!magicState.category)return;
 magicHistory();
 const d=magicDefs[magicState.category],v=magicState.values[magicState.category],before=JSON.stringify(v);
 let tries=0;
 do{for(const f of d.fields)v[f.key]=f.options[Math.floor(Math.random()*f.options.length)][0];tries++}
 while(JSON.stringify(v)===before&&tries<6);
 magicState.name='';magicPersist();magicRender();magicMessage('✨ Nowa magiczna kombinacja!');magicCelebrate();
}
function magicSave(){
 if(!magicState.category)return;
 const rows=magicRows();
 if(!validRows(rows)||!filled(rows)){magicMessage('Nie udało się utworzyć wzoru.');return;}
 const name=cleanName(magicState.name.trim()||magicDefaultName()),id=newProjectId();
 studio.projects.unshift({id,name,rows,revision:1});
 if(!persistStudio()){
  studio.projects=studio.projects.filter(p=>p.id!==id);
  magicMessage('Nie można zapisać projektu. Sprawdź pamięć urządzenia.');return;
 }
 $('studio-feedback').textContent='Zapisano „'+name+'”. Możesz go edytować, odrysować i wydrukować.';
 navigateTo('#moje');
}
function magicEdit(){
 if(!magicState.category)return;
 const rows=magicRows();
 if(!validRows(rows)||!filled(rows))return;
 const candidate={name:magicState.name.trim()||magicDefaultName(),rows},old=studio.drafts.get('nowy');
 if(old&&(old.name!==candidate.name||old.rows.join('/')!==rows.join('/'))){
  if(!window.confirm('Masz już szkic w Kreatorze. Zastąpić go magicznym obrazkiem?'))return;
 }
 studio.drafts.set('nowy',candidate);
 if(!persistStudio()){magicMessage('Nie udało się zapisać szkicu w pamięci.');return;}
 navigateTo('#kreator');
}
document.getElementById('magic-categories').addEventListener('click',event=>{
 const btn=event.target.closest('[data-category]');if(btn)magicChoose(btn.dataset.category);
});
document.getElementById('magic-fields').addEventListener('click',event=>{
 const button=event.target.closest('button[data-field][data-option]');
 if(!button||!magicState.category)return;
 const field=magicDefs[magicState.category].fields.find(field=>field.key===button.dataset.field);
 if(!field||!field.options.some(option=>option[0]===button.dataset.option))return;
 if(magicState.values[magicState.category][field.key]===button.dataset.option)return;
 magicHistory();
 magicState.values[magicState.category][field.key]=button.dataset.option;
 magicState.name='';
 magicPersist();magicRender();magicMessage('');magicCelebrate();
 const matching=document.querySelector('#magic-fields button[data-field="'+field.key+'"][data-option="'+button.dataset.option+'"]');
 matching?.focus({preventScroll:true});
});
document.getElementById('magic-levels').addEventListener('click',event=>{
 const button=event.target.closest('button[data-level]');
 if(!button||!Object.hasOwn(MAGIC_VARIANTS,button.dataset.level))return;
 if(button.dataset.level===magicState.size)return;
 magicHistory();magicState.size=button.dataset.level;
 magicPersist();magicRender();magicMessage('');magicCelebrate();
 const matching=document.querySelector('#magic-levels button[data-level="'+button.dataset.level+'"]');
 matching?.focus({preventScroll:true});
});
document.getElementById('magic-grid-toggle').addEventListener('click',()=>{
 magicShowGrid=!magicShowGrid;
 magicRender();
});
document.getElementById('magic-fields').addEventListener('change',event=>{
 const key=event.target.dataset.field;
 if(!magicState.category||!key)return;
 const f=magicDefs[magicState.category].fields.find(item=>item.key===key);
 if(!f||!f.options.some(item=>item[0]===event.target.value))return;
 magicHistory();magicState.values[magicState.category][key]=event.target.value;
 magicState.name='';magicPersist();magicRender();magicMessage('');
});
document.getElementById('magic-name').addEventListener('input',event=>{
 magicState.name=event.target.value.slice(0,42);magicPersist();
});
document.getElementById('magic-size').addEventListener('change',event=>{
 const size=event.target.value;
 if(!Object.hasOwn(MAGIC_VARIANTS,size)||size===magicState.size)return;
 magicHistory();magicState.size=size;
 magicPersist();magicRender();magicMessage('Wybrano: '+MAGIC_VARIANTS[size].label+'.');
});
const magicBestSets={
 animals:[
  {kind:'cat',eyes:'sparkle',mouth:'smile',extra:'flower',scene:'stars',color:'natural'},
  {kind:'bunny',eyes:'sparkle',mouth:'smile',extra:'bow',scene:'flowers',color:'w'},
  {kind:'fox',eyes:'round',mouth:'smile',extra:'scarf',scene:'stars',color:'O'},
  {kind:'bear',eyes:'happy',mouth:'smile',extra:'crown',scene:'hearts',color:'n'},
  {kind:'cat',eyes:'wink',mouth:'tongue',extra:'bow',scene:'hearts',color:'p'},
  {kind:'bunny',eyes:'round',mouth:'smile',extra:'star',scene:'flowers',color:'l'}
 ],
 monsters:[
  {kind:'round',eyes:'two',mouth:'tongue',extra:'horns',scene:'stars',color:'v'},
  {kind:'jelly',eyes:'one',mouth:'smile',extra:'antenna',scene:'hearts',color:'p'},
  {kind:'square',eyes:'three',mouth:'smile',extra:'crown',scene:'stars',color:'b'}
 ],
 robots:[
  {kind:'square',eyes:'visor',mouth:'heart',extra:'one',scene:'stars',color:'b'},
  {kind:'round',eyes:'dots',mouth:'star',extra:'two',scene:'stars',color:'v'},
  {kind:'tall',eyes:'visor',mouth:'lights',extra:'two',scene:'hearts',color:'l'}
 ],
 worlds:[
  {kind:'castle',eyes:'night',extra:'stars',color:'v'},
  {kind:'forest',eyes:'evening',extra:'cloud',color:'l'},
  {kind:'garden',eyes:'day',extra:'hearts',color:'p'},
  {kind:'sea',eyes:'night',extra:'stars',color:'b'}
 ]
};
function magicSuper(){
 if(!magicState.category)return;
 const category=magicState.category;
 magicHistory();
 const presets=magicBestSets[category];
 const previous=JSON.stringify(magicState.values[category]);
 const picks=presets.filter(preset=>JSON.stringify({...magicState.values[category],...preset})!==previous);
 const selected=picks[Math.floor(Math.random()*picks.length)]||presets[0];
 const def=magicDefs[category];
 for(const [field,value] of Object.entries(selected)){
  const entry=def.fields.find(row=>row.key===field);
  if(entry&&entry.options.some(option=>option[0]===value))magicState.values[category][field]=value;
 }
 magicState.name='';
 magicPersist();magicRender();magicMessage('✨ Super wersja gotowa! Możesz ją jeszcze zmieniać.');magicCelebrate();
}
document.getElementById('magic-super').addEventListener('click',magicSuper);
document.getElementById('magic-shuffle').addEventListener('click',magicRandomize);
document.getElementById('magic-undo').addEventListener('click',magicUndoLast);
document.getElementById('magic-save').addEventListener('click',magicSave);
document.getElementById('magic-edit').addEventListener('click',magicEdit);
document.getElementById('magic-back').addEventListener('click',event=>{
 if(!magicState.category)return;
 event.preventDefault();magicHistory();magicState.category=null;
 magicPersist();magicRender();magicMessage('');window.scrollTo(0,0);
});
