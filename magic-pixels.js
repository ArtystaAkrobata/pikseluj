'use strict';
/* Magiczne piksele — cztery niezależne poziomy 16×16 / 24×24 / 32×40 / 40×56, z zachowaniem siatki papieru. */
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
  {key:'pose',title:'Jak wygląda Twój lisek?',options:[['sitting','Siedzący','🦊'],['head','Główka','😊'],['sleeping','Śpiący','💤'],['profile','Z profilu','🌿']]},
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
 landscapes:{title:'Krajobrazy',emoji:'🏞️',desc:'Góry, jeziora, zachody słońca i zimowe doliny',fields:[
  {key:'kind',title:'Wybierz krajobraz',options:[['mountains','Górskie szczyty','🏔️'],['lake','Jezioro w dolinie','🏞️'],['sunset','Zachód nad rzeką','🌄'],['winter','Zimowa kraina','❄️']]},
  {key:'eyes',title:'Pora dnia',options:[['day','Słoneczny dzień','☀️'],['evening','Złota godzina','🌅'],['night','Gwiaździsta noc','🌙']]},
  {key:'extra',title:'Dekoracje nieba',options:[['cloud','Białe chmury','☁️'],['stars','Iskierki','✨'],['none','Czyste niebo','🩵']]},
  {key:'color',title:'Nastrój kolorów',options:[['b','Błękitny','🩵'],['l','Zielony','💚'],['v','Bajkowy fiolet','💜'],['O','Ciepły zachód','🧡']]}
 ]},
 worlds:{title:'Zamki i bajkowe światy',emoji:'🏰',desc:'Zamki, lasy, tajemnicze domki i morza',fields:[
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
// Dawny silnik rozciągania został zastąpiony MagicPremiumArt.
function magicRows(){
 if(!magicState.category)return Array(24).fill('.'.repeat(24));
 return magicState.category==='landscapes' ? MagicStoryArt.render('landscapes',magicState.values.landscapes,magicState.size) : MagicPremiumArt.render(magicState.category,magicState.values[magicState.category],magicState.size);
}
function magicDefaultName(){
 if(!magicState.category)return 'Mój magiczny wzór';
 const d=magicDefs[magicState.category],o=magicState.values[magicState.category];
 const chosen=d.fields[0].options.find(item=>item[0]===o.kind);
 if(magicState.category==='animals'&&o.kind==='fox'){
  const stage=MagicFoxStages.descriptions[magicState.size]||'Lisek';
  return stage;
 }
 return 'Mój '+(chosen?chosen[1]:d.title).toLowerCase();
}
let magicShowGrid=true;
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
 const rows=cat==='landscapes' ? MagicStoryArt.render(cat,first,'medium') : MagicPremiumArt.render(cat,first,'medium');
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

 // Tematy zawsze pozostają dostępne także PO rozpoczęciu rysowania.
 // Wcześniej przełącznik znikał i trzeba było wracać strzałką.
 const workspace=work.querySelector('.magic-v2-workspace');
 let switcher=document.getElementById('magic-theme-switcher');
 if(!switcher){
  switcher=document.createElement('nav');
  switcher.id='magic-theme-switcher';
  switcher.className='magic-theme-switcher';
  switcher.setAttribute('aria-label','Wybierz temat magicznych pikseli');
  workspace.prepend(switcher);
 }
 switcher.replaceChildren();
 const switchTitle=document.createElement('strong');
 switchTitle.className='magic-theme-heading';switchTitle.textContent='🎨 Wybierz temat:';
 const switchList=document.createElement('div');switchList.className='magic-theme-list';
 for(const [key,item] of Object.entries(magicDefs)){
  const selectedTheme=key===magicState.category;
  const switchButton=magicCreateButton('magic-theme-button'+(selectedTheme?' is-selected':''),item.emoji+' '+item.title);
  switchButton.dataset.switchCategory=key;
  switchButton.setAttribute('aria-pressed',String(selectedTheme));
  switchList.append(switchButton);
 }
 switcher.append(switchTitle,switchList);
 const def=magicDefs[magicState.category],values=magicState.values[magicState.category];
 const variant=MAGIC_VARIANTS[magicState.size];
 document.getElementById('magic-category-name').textContent=
   magicState.category==='animals'&&values.kind==='fox'
     ?'🦊 '+(MagicFoxStages.descriptions[magicState.size]||'Lisek')
     :def.emoji+' '+def.title;
 const scene=document.getElementById('magic-art-scene');
 scene.dataset.category=magicState.category;
 document.getElementById('magic-preview-size').textContent=variant.width+' × '+variant.height+' kratek';
 document.getElementById('magic-size-hint').textContent='📄 Zalecana kartka: '+variant.sheet+' · 1 kratka = 5 mm';
 const stageInfo=document.getElementById('magic-stage-info');
 const fox=magicState.category==='animals'&&values.kind==='fox';
 if(stageInfo){
  stageInfo.hidden=!fox;
  stageInfo.textContent=fox?'🦊 '+(MagicFoxStages.descriptions[magicState.size]||'Lisek')+' · Każdy poziom ma osobny, dopracowany wzór.':'';
 }
 const levelSelect=document.getElementById('magic-size');
 levelSelect.value=magicState.size;
 const levels=document.getElementById('magic-levels');
 levels.replaceChildren();
 const levelIcons={easy:'🌱',medium:'🌈',hard:'🔥',expert:'👑'};
 const levelNotes=magicState.category==='animals'&&values.kind==='fox'
  ?{easy:'Główka',medium:'Lisek przodem',hard:'Duży ogon',expert:'Profil + motylek'}
  :{easy:'Pierwsze kroki',medium:'Więcej kolorów',hard:'Więcej szczegółów',expert:'Mistrz pikseli'};
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
  if(magicState.category==='animals'){
   if(values.kind==='fox'&&['pose','eyes','mouth','extra'].includes(field.key))continue;
   if(values.kind==='fox'&&magicState.size==='easy'&&field.key==='scene')continue;
   if(values.kind!=='fox'&&field.key==='pose')continue;
  }
  // Najmniejsze obrazy mają najmniej elementów; nie pokazuj opcji bez efektu.
  if(magicState.size==='easy'&&field.key==='scene')continue;
  if(magicState.category==='worlds'&&magicState.size==='easy'&&['eyes','extra'].includes(field.key))continue;
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
 magicHistory();magicState.category=category;magicState.name='';magicShowGrid=true;
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
 const fox=magicState.category==='animals'&&magicState.values.animals.kind==='fox';
 if(fox){
  // Bezpieczne warianty: nie zmieniamy poziomu ani pozy przypisanej do siatki.
  const o=magicState.values.animals;
  const colors=['natural','O','p','v','b','l','n'];
  const scenes=magicState.size==='easy'?['none']:['none','stars','hearts','flowers'];
  const current=o.color+'|'+(magicState.size==='easy'?'none':o.scene);
  const combos=colors.flatMap(color=>scenes.map(scene=>({color,scene})))
    .filter(pair=>pair.color+'|'+pair.scene!==current);
  if(!combos.length)return;
  const selected=combos[Math.floor(Math.random()*combos.length)];
  magicHistory();
  o.color=selected.color;o.scene=selected.scene;
  magicState.name='';magicPersist();magicRender();
  magicMessage('🎲 Nowa kolorystyka liska. Kontur i sylwetka pozostają bez zmian.');
  magicCelebrate();return;
 }
 magicHistory();
 const d=magicDefs[magicState.category],v=magicState.values[magicState.category],before=JSON.stringify(v);
 let tries=0;
 do{
  for(const f of d.fields){
   if(magicState.category==='animals'&&f.key==='kind')continue;
   if(magicState.size==='easy'&&f.key==='scene')continue;
   if(magicState.category==='worlds'&&magicState.size==='easy'&&['eyes','extra'].includes(f.key))continue;
   v[f.key]=f.options[Math.floor(Math.random()*f.options.length)][0];
  }
  tries++;
 }while(JSON.stringify(v)===before&&tries<6);
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
document.getElementById('magic-workbench').addEventListener('click',event=>{
 const button=event.target.closest('button[data-switch-category]');
 if(button&&button.dataset.switchCategory!==magicState.category)magicChoose(button.dataset.switchCategory);
});
document.getElementById('magic-fields').addEventListener('click',event=>{
 const button=event.target.closest('button[data-field][data-option]');
 if(!button||!magicState.category)return;
 const field=magicDefs[magicState.category].fields.find(field=>field.key===button.dataset.field);
 if(!field||!field.options.some(option=>option[0]===button.dataset.option))return;
 if(magicState.category==='animals'&&magicState.values.animals.kind==='fox'&&['pose','eyes','mouth','extra'].includes(field.key))return;
 if(magicState.values[magicState.category][field.key]===button.dataset.option)return;
 magicHistory();
 magicState.values[magicState.category][field.key]=button.dataset.option;
 if(magicState.category==='animals'&&field.key==='kind'&&button.dataset.option==='fox'){
  magicState.values.animals.color='natural';
  magicState.values.animals.scene=magicState.size==='easy'?'none':'stars';
  magicState.name='';
 }
 // Zmiana oczu/koloru nie kasuje nazwy wpisanej przez dziecko.
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
 landscapes:[
  {kind:'mountains',eyes:'day',extra:'cloud',color:'b'},
  {kind:'lake',eyes:'evening',extra:'cloud',color:'l'},
  {kind:'sunset',eyes:'evening',extra:'none',color:'O'},
  {kind:'winter',eyes:'night',extra:'stars',color:'b'}
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
 if(category==='animals'&&magicState.values.animals.kind==='fox'){
  const o=magicState.values.animals;
  const curated={
   easy:{color:'natural',scene:'none'},
   medium:{color:'natural',scene:'none'},
   hard:{color:'natural',scene:'flowers'},
   expert:{color:'natural',scene:'none'}
  }[magicState.size];
  if(o.color!==curated.color||o.scene!==curated.scene){
   magicHistory();o.color=curated.color;o.scene=curated.scene;
   magicState.name='';magicPersist();magicRender();magicCelebrate();
  }
  magicMessage('✨ Autorska wersja liska na ten poziom — gotowa do zapisania!');
  return;
 }
 magicHistory();
 const presets=category==='animals' ? magicBestSets.animals.filter(x=>x.kind===magicState.values.animals.kind) : magicBestSets[category];
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
