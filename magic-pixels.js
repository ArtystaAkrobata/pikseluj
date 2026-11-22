'use strict';
/* Magiczne piksele — 24x24, te same kolory i zapis co ręczny Kreator. */
const MAGIC_SIZE=24, MAGIC_KEY='pikseluj/magiczne/v1';
const magicDefs={
 animals:{title:'Zwierzątka',emoji:'🐱',desc:'Kotki, króliczki, liski i misie',fields:[
  {key:'kind',title:'Zwierzątko',options:[['cat','Kotek'],['bunny','Króliczek'],['fox','Lisek'],['bear','Miś']]},
  {key:'eyes',title:'Oczy',options:[['round','Duże'],['happy','Wesołe'],['wink','Mrugające']]},
  {key:'extra',title:'Ozdoba',options:[['none','Bez dodatku'],['bow','Kokardka'],['star','Gwiazdka'],['heart','Serduszko']]},
  {key:'color',title:'Kolor',options:[['p','Różowy'],['v','Fioletowy'],['b','Błękitny'],['l','Zielony'],['O','Pomarańczowy']]}]},
 monsters:{title:'Potworki',emoji:'👾',desc:'Śmieszne buźki, rogi i czułki',fields:[
  {key:'kind',title:'Kształt',options:[['round','Okrągły'],['square','Kwadratowy'],['jelly','Galaretek']]},
  {key:'eyes',title:'Oczy',options:[['one','Jedno oko'],['two','Dwoje oczu'],['three','Troje oczu']]},
  {key:'extra',title:'Ozdoba',options:[['horns','Rogi'],['antenna','Czułki'],['none','Bez dodatku']]},
  {key:'color',title:'Kolor',options:[['v','Fioletowy'],['g','Zielony'],['b','Błękitny'],['p','Różowy'],['O','Pomarańczowy']]}]},
 robots:{title:'Roboty',emoji:'🤖',desc:'Roboty z różnymi głowami i oczami',fields:[
  {key:'kind',title:'Głowa',options:[['square','Kwadratowa'],['round','Okrągła'],['tall','Wysoka']]},
  {key:'eyes',title:'Oczy',options:[['dots','Okrągłe'],['visor','Wyświetlacz'],['sleepy','Śpiące']]},
  {key:'extra',title:'Antena',options:[['one','Jedna'],['two','Dwie'],['none','Bez anteny']]},
  {key:'color',title:'Kolor',options:[['b','Błękitny'],['v','Fioletowy'],['l','Zielony'],['p','Różowy'],['O','Pomarańczowy']]}]},
 worlds:{title:'Bajkowe światy',emoji:'🏰',desc:'Zamki, lasy, ogrody i morze',fields:[
  {key:'kind',title:'Kraina',options:[['castle','Zamek'],['forest','Las'],['garden','Ogród'],['sea','Morze']]},
  {key:'eyes',title:'Niebo',options:[['day','Dzień'],['evening','Zachód słońca'],['night','Noc']]},
  {key:'extra',title:'Dekoracje',options:[['cloud','Chmurki'],['stars','Gwiazdki'],['hearts','Serduszka'],['none','Bez dodatku']]},
  {key:'color',title:'Kolor krainy',options:[['v','Fioletowy'],['b','Błękitny'],['l','Zielony'],['p','Różowy'],['O','Pomarańczowy']]}]}
};
const magicFresh=()=>Object.fromEntries(Object.entries(magicDefs).map(([id,def])=>[id,Object.fromEntries(def.fields.map(f=>[f.key,f.options[0][0]]))]));
const magicState={category:null,name:'',values:magicFresh()},magicUndo=[];
try{
 const saved=JSON.parse(localStorage.getItem(MAGIC_KEY)||'null');
 if(saved && typeof saved==='object'){
  if(saved.category===null||Object.hasOwn(magicDefs,saved.category))magicState.category=saved.category;
  if(typeof saved.name==='string')magicState.name=saved.name.slice(0,42);
  for(const [id,def] of Object.entries(magicDefs))for(const field of def.fields){
   const value=saved.values?.[id]?.[field.key];
   if(field.options.some(opt=>opt[0]===value))magicState.values[id][field.key]=value;
  }
 }
}catch{/* przechowywanie opcjonalne */}
const magicSnapshot=()=>({category:magicState.category,name:magicState.name,values:JSON.parse(JSON.stringify(magicState.values))});
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
 if(o.extra==='bow'){g.rect(3,4,3,3,'p');g.rect(9,4,3,3,'p');g.rect(6,5,3,2,'y')}
 if(o.extra==='star')g.star(20,4,'y');
 if(o.extra==='heart')g.heart(19,3,'r');
}
function magicMonster(g,o){
 const c=o.color;g.rect(7,20,3,2,'k');g.rect(14,20,3,2,'k');
 if(o.kind==='square'){g.rect(4,6,16,14,'k');g.rect(5,7,14,12,c)}
 else if(o.kind==='jelly'){g.blob(12,13,9,8,c);g.rect(5,17,3,3,c);g.rect(16,17,3,3,c)}
 else g.blob(12,12,8,8,c);
 if(o.extra==='horns'){
  g.rect(6,3,3,5,'k');g.rect(15,3,3,5,'k');g.rect(7,4,1,4,'y');g.rect(16,4,1,4,'y');
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
 g.rect(10,16,4,3,'k');g.rect(11,17,2,1,'y');
 if(o.kind==='tall'){g.rect(5,4,14,10,'k');g.rect(6,5,12,8,c)}
 else if(o.kind==='round')g.blob(12,9,8,6,c);
 else{g.rect(4,6,16,9,'k');g.rect(5,7,14,7,c)}
 g.rect(3,10,2,3,'s');g.rect(19,10,2,3,'s');
 if(o.extra==='one'){g.rect(11,2,2,5,'k');g.rect(10,1,4,3,'r')}
 else if(o.extra==='two'){g.rect(7,2,2,5,'k');g.rect(16,2,2,5,'k');g.rect(6,1,4,3,'y');g.rect(15,1,4,3,'p')}
 if(o.eyes==='visor'){g.rect(7,9,10,4,'k');g.rect(8,10,8,2,'b');g.pixel(9,10,'w')}
 else if(o.eyes==='sleepy'){g.hline(8,10,3,'k');g.hline(14,10,3,'k')}
 else{g.rect(7,9,4,4,'w');g.rect(14,9,4,4,'w');g.rect(9,10,2,2,'k');g.rect(15,10,2,2,'k')}
 g.hline(10,14,5,'k');
}
function magicWorld(g,o){
 const c=o.color, sky=o.eyes==='night'?'u':o.eyes==='evening'?'p':'b';
 g.rect(0,0,24,18,sky);g.rect(0,16,24,8,o.kind==='sea'?'a':'l');
 g.rect(0,19,24,5,o.kind==='sea'?'b':'g');
 if(o.eyes==='night'){g.star(3,3,'y');g.star(18,4,'y')}
 else g.blob(20,4,3,3,o.eyes==='evening'?'O':'y');
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
  for(const x of [3,20]){g.rect(x,17,1,6,'d');g.blob(x,16,2,2,x===3?c:'p');g.pixel(x,16,'y')}
 }else{
  g.rect(0,20,12,4,'e');g.rect(4,10,7,12,'k');g.rect(5,11,5,10,'w');
  g.rect(5,14,5,3,'r');g.rect(5,19,5,2,'r');
  g.rect(3,7,9,3,'k');g.rect(4,6,7,2,c);
  g.rect(6,5,3,3,'y');g.rect(7,3,1,2,'k');
  g.hline(14,20,9,'w');
 }
 if(o.extra==='cloud'){g.blob(5,4,3,2,'w');g.blob(10,5,3,2,'w')}
 else if(o.extra==='stars'){g.star(3,3,'y');g.star(15,2,'y')}
 else if(o.extra==='hearts'){g.heart(3,2,'r');g.heart(16,4,'r')}
}
function magicRows(){
 if(!magicState.category)return Array(24).fill('.'.repeat(24));
 const g=magicCanvas(),o=magicState.values[magicState.category];
 if(magicState.category==='animals')magicAnimal(g,o);
 else if(magicState.category==='monsters')magicMonster(g,o);
 else if(magicState.category==='robots')magicRobot(g,o);
 else magicWorld(g,o);
 return g.rows();
}
function magicDefaultName(){
 if(!magicState.category)return 'Mój magiczny wzór';
 const d=magicDefs[magicState.category],o=magicState.values[magicState.category];
 const chosen=d.fields[0].options.find(item=>item[0]===o.kind);
 return 'Mój '+(chosen?chosen[1]:d.title).toLowerCase();
}
function magicRender(){
 const choosing=document.getElementById('magic-start'),work=document.getElementById('magic-workbench');
 if(!choosing||!work)return;
 const selected=Boolean(magicState.category);
 choosing.hidden=selected;work.hidden=!selected;
 document.getElementById('magic-back').textContent=selected?'← Wybierz kategorię':'← Wróć do galerii';
 if(!selected){
  const items=document.getElementById('magic-categories');items.replaceChildren();
  for(const [id,d] of Object.entries(magicDefs)){
   const button=document.createElement('button');button.type='button';button.className='magic-category';button.dataset.category=id;
   const pic=document.createElement('span');pic.className='magic-category-icon';pic.textContent=d.emoji;
   const title=document.createElement('strong');title.textContent=d.title;
   const desc=document.createElement('small');desc.textContent=d.desc;
   button.append(pic,title,desc);items.append(button);
  }
  return;
 }
 const d=magicDefs[magicState.category],values=magicState.values[magicState.category];
 document.getElementById('magic-category-name').textContent=d.emoji+' '+d.title;
 const fields=document.getElementById('magic-fields');fields.replaceChildren();
 for(const field of d.fields){
  const label=document.createElement('label');label.className='field-label';label.textContent=field.title;
  const select=document.createElement('select');select.className='magic-select';select.dataset.field=field.key;
  for(const [id,name] of field.options){const opt=document.createElement('option');opt.value=id;opt.textContent=name;select.append(opt)}
  select.value=values[field.key];label.append(select);fields.append(label);
 }
 const name=document.getElementById('magic-name');name.value=magicState.name;name.placeholder=magicDefaultName();
 document.getElementById('magic-undo').disabled=!magicUndo.length;
 const rows=magicRows(),pattern=readPattern({id:'magiczne-podglad',art:rows.join('\n')});
 const art=document.getElementById('magic-art');
 art.replaceChildren(sprite(pattern,{paper:true}));
 art.setAttribute('aria-label','Podgląd '+d.title.toLowerCase()+', 24 na 24 kratki');
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
 magicState.category=past.category;magicState.name=past.name;magicState.values=past.values;
 magicPersist();magicRender();magicMessage('Cofnięto ostatnią zmianę.');
}
function magicRandomize(){
 if(!magicState.category)return;
 magicHistory();
 const d=magicDefs[magicState.category],v=magicState.values[magicState.category],before=JSON.stringify(v);
 let tries=0;
 do{for(const f of d.fields)v[f.key]=f.options[Math.floor(Math.random()*f.options.length)][0];tries++}
 while(JSON.stringify(v)===before&&tries<6);
 magicState.name='';magicPersist();magicRender();magicMessage('✨ Nowa magiczna kombinacja!');
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
document.getElementById('magic-shuffle').addEventListener('click',magicRandomize);
document.getElementById('magic-undo').addEventListener('click',magicUndoLast);
document.getElementById('magic-save').addEventListener('click',magicSave);
document.getElementById('magic-edit').addEventListener('click',magicEdit);
document.getElementById('magic-back').addEventListener('click',event=>{
 if(!magicState.category)return;
 event.preventDefault();magicHistory();magicState.category=null;
 magicPersist();magicRender();magicMessage('');window.scrollTo(0,0);
});
