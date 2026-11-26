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
  {key:'kind',title:'Wybierz zwierzaka',options:[['cat','Kotek','🐱'],['dog','Piesek','🐶'],['bunny','Króliczek','🐰'],['owl','Sówka','🦉'],['fox','Lisek','🦊'],['bear','Miś','🐻']]},
  {key:'pose',title:'Jak wygląda Twój lisek?',options:[['sitting','Siedzący','🦊'],['head','Główka','😊'],['sleeping','Śpiący','💤'],['profile','Z profilu','🌿']]},
  {key:'eyes',title:'Jakie oczy?',options:[['sparkle','Błyszczące','✨'],['round','Duże','👀'],['happy','Wesołe','😊'],['wink','Mrugające','😉']]},
  {key:'mouth',title:'Jaka minka?',options:[['smile','Uśmiech','😊'],['tongue','Języczek','😋'],['surprised','Zdziwiona','😮']]},
  {key:'extra',title:'Dodatek na zwierzaku',options:[['none','Bez dodatkowej ozdoby','🌟'],['bow','Kokardka','🎀'],['flower','Kwiatuszek','🌼'],['star','Gwiazdka','⭐'],['crown','Korona','👑'],['scarf','Szalik','🧣']]},
  {key:'scene',title:'Dekoracje wokół postaci',options:[['none','Bez dekoracji','☁️'],['stars','Iskierki','✨'],['flowers','Kwiatki','🌸'],['hearts','Serduszka','💕']]},
  {key:'color',title:'Kolor bohatera',options:[['natural','Naturalny','🎨'],['w','Biały','🤍'],['n','Brązowy','🤎'],['p','Różowy','🩷'],['v','Fioletowy','💜'],['b','Błękitny','🩵'],['l','Zielony','💚'],['O','Pomarańczowy','🧡']]}
 ]},
 monsters:{title:'Potworki',emoji:'👾',desc:'Sam wybierasz oczy, minkę, dodatki i kolor!',fields:[
  {key:'eyes',title:'Jakie oczy ma Twój bohater?',options:[['original','Błyszczące','✨'],['happy','Wesołe','😊'],['wink','Mrugające','😉'],['sleepy','Przymknięte','😴']]},
  {key:'mouth',title:'Jaka minka?',options:[['original','Oryginalna','😄'],['smile','Uśmiech','😊'],['tongue','Języczek','😋'],['surprised','Zdziwiona','😮']]},
  {key:'accessory',title:'Co dodamy bohaterowi?',options:[['original','Oryginalna ozdoba','👑'],['bow','Kokarda','🎀'],['star','Gwiazdka','⭐'],['heart','Serduszko','💕'],['none','Bez ozdoby','✨']]},
  {key:'scene',title:'Ozdoby wokół postaci',options:[['none','Bez tła','☁️'],['stars','Iskierki','✨'],['hearts','Serduszka','💕'],['flowers','Kwiatuszki','🌸']]},
  {key:'color',title:'Kolor bohatera',options:[['original','Oryginalny','🎨'],['p','Różowy','🩷'],['b','Błękitny','🩵'],['l','Zielony','💚'],['v','Fioletowy','💜'],['O','Pomarańczowy','🧡']]}
 ]},
 robots:{title:'Roboty',emoji:'🤖',desc:'Superroboty z własną osobowością',fields:[
  {key:'kind',title:'Głowa robota',options:[['square','Klasyczna','▣'],['round','Okrągła','⚙️'],['tall','Wysoka','🗼']]},
  {key:'eyes',title:'Oczy i wyświetlacz',options:[['dots','Świecące oczy','🤖'],['visor','Wizjer','🥽'],['sleepy','Senne oczka','😴']]},
  {key:'mouth',title:'Znak na panelu',options:[['heart','Serce','❤️'],['star','Gwiazdka','⭐'],['lights','Lampki','🚥']]},
  {key:'extra',title:'Antena',options:[['one','Jedna','📡'],['two','Dwie','✨'],['none','Bez anteny','🚫']]},
  {key:'scene',title:'Dekoracje wokół robota',options:[['none','Bez dekoracji','☁️'],['stars','Energia','⚡'],['hearts','Serduszka','💕']]},
  {key:'color',title:'Kolor obudowy',options:[['b','Błękitny','🩵'],['v','Fioletowy','💜'],['p','Różowy','🩷'],['l','Zielony','💚'],['O','Pomarańczowy','🧡']]}
 ]},
 landscapes:{title:'Krajobrazy',emoji:'🏞️',desc:'Cztery zatwierdzone krajobrazy, każdy z własnymi dodatkami',fields:[
  {key:'apples',title:'Jabłka na drzewie',options:[['few','Kilka jabłek','🍎'],['none','Bez jabłek','🌳'],['many','Więcej jabłek','🍎']]},
  {key:'hollow',title:'Dziupla w pniu',options:[['none','Bez dziupli','🌳'],['yes','Dodaj dziuplę','🕳️']]},
  {key:'extra',title:'Dodatki do krajobrazu',options:[['none','Bez dodatków','🌤️'],['cloud','Dodatkowa chmurka','☁️'],['flowers','Dodatkowe kwiatki','🌼'],['stars','Gwiazdki','✨']]},
  {key:'bird',title:'Ptaszek nad wodospadem',options:[['none','Bez ptaszka','🌤️'],['yes','Dodaj ptaszka','🐦']]},
  {key:'season',title:'Pora roku',options:[['summer','☀️ Lato','☀️'],['autumn','🍁 Jesień','🍁']]},
  {key:'bridge',title:'Mostek nad rzeką',options:[['none','Bez mostku','🌊'],['wood','Drewniany mostek','🪵']]}

 ]},
 worlds:{title:'Zamki',emoji:'🏰',desc:'Cztery zamki, własne kolory dachów, murów, flag i bram',fields:[{"key":"roof","title":"Kolor dachów","options":[["original","Oryginalny","🏰"],["blue","Niebieski","🟦"],["red","Czerwony","🟥"],["purple","Fioletowy","🟪"],["green","Zielony","🟩"]]},{"key":"wall","title":"Kolor murów","options":[["original","Oryginalny","🏰"],["sand","Piaskowy","🟫"],["pink","Różowy","🩷"],["blue","Błękitny","🩵"],["gray","Szary","🩶"]]},{"key":"flag","title":"Kolor flag","options":[["original","Oryginalny","🚩"],["red","Czerwony","🟥"],["blue","Niebieski","🟦"],["yellow","Żółty","🟨"],["purple","Fioletowy","🟪"]]},{"key":"gate","title":"Kolor bramy","options":[["original","Oryginalny","🚪"],["brown","Drewniany","🟫"],["gold","Złoty","🟨"],["gray","Stalowy","🩶"]]}]}

};
function magicOriginalValues(category,kind){
 const def=magicDefs[category];
 const values=Object.fromEntries(def.fields.map(field=>[field.key,field.options[0][0]]));
 if(category==='animals'){
  if(def.fields[0].options.some(option=>option[0]===kind))values.kind=kind;
  Object.assign(values,{eyes:'sparkle',mouth:'smile',extra:'none',scene:'none',color:'natural'});
 }
 return values;
}
const magicFresh=()=>Object.fromEntries(Object.keys(magicDefs).map(category=>[category,magicOriginalValues(category)]));
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
// Migracja zapisanych ustawień ze starego generatora: nowe postacie startują w zatwierdzonych kolorach.
try{
 const migration='pikseluj/magiczne/potworki-crayons-v2';
 if(localStorage.getItem(migration)!=='done'){
  magicState.values.monsters.color='original';
  magicState.values.monsters.scene='none';
  localStorage.setItem(migration,'done');
 }
}catch{magicState.values.monsters.color='original';magicState.values.monsters.scene='none';}
// Jednorazowo pokaż zatwierdzony wygląd kotka użytkownikom poprzedniej wersji.
try{
 const key='pikseluj/magiczne/cats-editable-layers-v2';
 if(localStorage.getItem(key)!=='done'&&magicState.values.animals.kind==='cat'){
  Object.assign(magicState.values.animals,{eyes:'sparkle',mouth:'smile',extra:'none',scene:'none',color:'natural'});
  magicState.name='';
  localStorage.setItem(key,'done');
 }
}catch{}
// Pierwsze uruchomienie zatwierdzonych robotów bez dekoracji i starych modyfikacji.
try{
 const version='pikseluj/magiczne/robots-approved-20261124';
 if(localStorage.getItem(version)!=='done'){
  Object.assign(magicState.values.robots,{kind:'square',eyes:'dots',mouth:'heart',extra:'one',scene:'none',color:'b'});
  localStorage.setItem(version,'done');
 }
}catch{}
// Jednorazowe ustawienie oryginalnych, zatwierdzonych krajobrazów na wszystkich poziomach.
try{
 const version='pikseluj/magiczne/landscapes-approved-v1';
 if(localStorage.getItem(version)!=='done'){
  Object.assign(magicState.values.landscapes,{eyes:'day',extra:'none',color:'b'});
  if(magicState.category==='landscapes')magicState.name='';
  localStorage.setItem(version,'done');
 }
}catch{}
// Odrzuć dawny wybór „Dodaj słońce”: słońce jest już w bazie krajobrazów.
// Resetujemy także zapisane błędne nakładki, ale nie ustawienia innych kategorii.
try{
 const version='pikseluj/magiczne/landscapes-corrected-sky-20261125';
 if(localStorage.getItem(version)!=='done'){
  Object.assign(magicState.values.landscapes,{eyes:'day',extra:'none',color:'b'});
  if(magicState.category==='landscapes')magicState.name='';
  localStorage.setItem(version,'done');
 }
}catch{magicState.values.landscapes.extra='none';}
// Krajobrazy: zatwierdzona kolorystyka bez nieudanych przeróbek wody.
try{
 const stamp='pikseluj/magiczne/landscapes-original-only-20261125';
 if(localStorage.getItem(stamp)!=='done'){
  magicState.values.landscapes.extra='none';
  magicState.values.landscapes.apples='few';
  magicState.values.landscapes.hollow='none';
  magicState.name=magicState.category==='landscapes'?'':magicState.name;
  localStorage.setItem(stamp,'done');
 }
}catch{}
// Przy pierwszym uruchomieniu zatwierdzonego wzoru 24×24 wyłącz stare dodatki.
try{
 const key='pikseluj/magiczne/wodospad-exact-24-20261125';
 if(localStorage.getItem(key)!=='done'){
  magicState.values.landscapes.extra='none';
  magicState.values.landscapes.bird='none';
  if(magicState.category==='landscapes')magicState.name='';
  localStorage.setItem(key,'done');
 }
}catch{}
// Nowy oryginalny krajobraz średni: bez wcześniejszych dekoracji.
try{
 const token='pikseluj/magiczne/wodospad-z-obrazka-26x26-v1';
 if(localStorage.getItem(token)!=='done'){
  magicState.values.landscapes.extra='none';
  magicState.values.landscapes.bird='none';
  localStorage.setItem(token,'done');
 }
}catch{}
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
 if(magicState.category==='worlds')return 'Mój magiczny zamek';
 if(magicState.category==='landscapes')return MagicApprovedLandscapes.names[magicState.size]||'Krajobraz';
 const d=magicDefs[magicState.category],o=magicState.values[magicState.category];
 if(magicState.category==='monsters'&&typeof MagicApprovedMonsters!=='undefined')return MagicApprovedMonsters.names[magicState.size];
 const chosen=d.fields[0].options.find(item=>item[0]===o.kind);
 if(magicState.category==='animals'&&o.kind==='fox'){
  const stage=MagicFoxStages.descriptions[magicState.size]||'Lisek';
  return stage;
 }
 return 'Mój '+(chosen?chosen[1]:d.title).toLowerCase();
}
let magicShowGrid=true;
// Zmiana wzoru nie przenosi personalizacji z poprzedniego rysunku.
// Wybrany gatunek zwierzątka pozostaje przy zmianie poziomu, nie jego dodatki.
function magicResetDrawing(category,kind){
 if(!Object.hasOwn(magicDefs,category))return;
 magicState.values[category]=magicOriginalValues(category,kind);
 magicState.name='';
 magicShowGrid=true;
}
function magicSelectLevel(level){
 if(!Object.hasOwn(MAGIC_VARIANTS,level)||level===magicState.size)return false;
 const category=magicState.category;
 const kind=category==='animals'?magicState.values.animals.kind:undefined;
 magicHistory();magicState.size=level;
 if(category)magicResetDrawing(category,kind);
 return true;
}
function magicSelectTrait(key,value){
 const category=magicState.category;
 if(!category)return false;
 const field=magicDefs[category].fields.find(f=>f.key===key);
 if(!field||!field.options.some(option=>option[0]===value))return false;
 if(magicState.values[category][key]===value)return false;
 if(category==='animals'&&magicState.values.animals.kind==='fox'&&(key==='pose'||magicState.size==='easy'&&['eyes','mouth','extra'].includes(key)))return false;
 magicHistory();
 if(category==='animals'&&key==='kind')magicResetDrawing(category,value);
 else magicState.values[category][key]=value;
 return true;
}

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
 const first=magicOriginalValues(cat);
 const rows=cat==='landscapes' ? MagicStoryArt.render(cat,first,'medium') : MagicPremiumArt.render(cat,first,'medium');
 return sprite(readPattern({id:'mini-'+cat,art:rows.join('\n')}));
}
function magicRender(){
 const choosing=document.getElementById('magic-start');
 const work=document.getElementById('magic-workbench');
 if(!choosing||!work)return;
 // Zachowaj pozycję przewijanych opcji również po przebudowaniu przycisków.
 const controls=work.querySelector('.magic-v2-controls');
 const controlsScrollTop=controls?.scrollTop||0;
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
 // Telefon: tematy są częścią przewijanych opcji, a podgląd nie rusza się.
 // Komputer: zachowaj dotychczasowy wybór tematów nad dwoma kolumnami.
 const compactEditor=window.matchMedia('(max-width:859px)').matches;
 if(compactEditor){
  if(switcher.parentElement!==controls)controls.prepend(switcher);
 }else if(switcher.parentElement!==workspace)workspace.prepend(switcher);
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
 const approvedCastle=magicState.category==='worlds';
 const variant=magicState.category==='animals'&&values.kind==='bunny'&&magicState.size==='easy'&&values.extra==='scarf'
  ?{...MAGIC_VARIANTS.easy,height:17}
  :approvedCastle&&magicState.size==='hard'
  ?{...MAGIC_VARIANTS.hard,height:32}
  :magicState.category==='landscapes'&&magicState.size==='medium'
  ?{...MAGIC_VARIANTS.medium,width:26,height:26}
  :MAGIC_VARIANTS[magicState.size];
 document.getElementById('magic-category-name').textContent=
   magicState.category==='monsters' ? '👾 '+MagicApprovedMonsters.names[magicState.size]
   :magicState.category==='animals'&&values.kind==='fox'
     ?'🦊 '+(MagicFoxStages.descriptions[magicState.size]||'Lisek')
     :magicState.category==='landscapes' ? '🏞️ '+MagicApprovedLandscapes.names[magicState.size]
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
 const levelNotes=approvedCastle
  ?{easy:'Bajkowy zamek',medium:'Trzy wieże',hard:'Cztery flagi',expert:'Niebieska twierdza'}
  :magicState.category==='animals'&&values.kind==='fox'
  ?{easy:'Główka',medium:'Siedzący lisek',hard:'Lisek na czterech łapkach',expert:'Puszysty ogon'}
  :magicState.category==='animals'&&values.kind==='cat'
  ?{easy:'Kocia główka',medium:'Szary kotek',hard:'Złote oczy i dzwoneczek',expert:'Kotek Czarodziej'}
  :magicState.category==='animals'&&values.kind==='dog'
  ?{easy:'Psia główka',medium:'Corgi z łapkami',hard:'Siedzący corgi',expert:'Corgi z ogonem'}
  :magicState.category==='animals'&&values.kind==='owl'
  ?{easy:'Wesoła sówka',medium:'Sowa z dużymi oczami',hard:'Portret sowy',expert:'Rdzawa sowa'}
  :magicState.category==='animals'&&values.kind==='bear'
  ?{easy:'Główka misia',medium:'Siedzący miś',hard:'Miś z cieniowaniem',expert:'Pluszak z czerwoną kokardą'}
  :magicState.category==='animals'&&values.kind==='bunny'
  ?{easy:'Królicza główka',medium:'Długie uszy',hard:'Królik w podskoku',expert:'Neonowy króliczek'}
  :magicState.category==='robots'
  ?{easy:'Błękitek',medium:'Błękitek 2.0',hard:'TurboBot',expert:'MECHA NOVA'}
  :magicState.category==='landscapes'
  ?{easy:'Drzewo z jabłkami',medium:'Wodospad',hard:'Górska dolina',expert:'Tropikalna zatoka'}
  :magicState.category==='monsters'
   ?{easy:'Z koroną · 5 kolorów',medium:'Turkusowy smoczek · 6 kolorów',hard:'Czerwony smok',expert:'Magiczny czarodziej'}
   :{easy:'Pierwsze kroki',medium:'Więcej kolorów',hard:'Więcej szczegółów',expert:'Mistrz pikseli'};
 for(const [key,item] of Object.entries(MAGIC_VARIANTS)){
  const selected=key===magicState.size;
  const button=magicCreateButton('magic-level-card'+(selected?' is-selected':''));button.dataset.level=key;
  button.setAttribute('aria-pressed',String(selected));
  const emoji=document.createElement('span');emoji.className='magic-level-icon';emoji.textContent=levelIcons[key];
  const label=document.createElement('strong');label.textContent=item.label;
  const dimensions=document.createElement('small');
  dimensions.textContent=approvedCastle&&key==='hard'?'32 × 32':magicState.category==='landscapes'&&key==='medium'
   ?'26 × 26':item.width+' × '+item.height;
  const note=document.createElement('span');note.className='magic-level-note';note.textContent=levelNotes[key];
  button.append(emoji,label,dimensions,note);levels.append(button);
 }
 const fields=document.getElementById('magic-fields');
 fields.replaceChildren();
 for(const field of def.fields){
  if(magicState.category==='landscapes'){
   if(magicState.size==='easy'&&!['apples','hollow'].includes(field.key))continue;
   if(magicState.size!=='easy'&&['apples','hollow'].includes(field.key))continue;
   if(magicState.size!=='medium'&&field.key==='bird')continue;
   if(magicState.size!=='hard'&&['season','bridge'].includes(field.key))continue;
  }
  if(magicState.category==='animals'){
   if(values.kind==='fox'&&(field.key==='pose'||magicState.size==='easy'&&['eyes','mouth','extra'].includes(field.key)))continue;
   if(values.kind==='fox'&&magicState.size==='easy'&&field.key==='scene')continue;
   if(values.kind!=='fox'&&field.key==='pose')continue;
  }
  // Najmniejsze obrazy mają najmniej elementów; nie pokazuj opcji bez efektu.
  if(magicState.size==='easy'&&field.key==='scene'&&!['monsters','animals','robots'].includes(magicState.category))continue;
  if(magicState.category==='worlds'&&magicState.size==='easy'&&['eyes','extra'].includes(field.key))continue;
  const group=document.createElement('fieldset');group.className='magic-trait-group';
  const legend=document.createElement('legend');legend.textContent=field.title;
  const choices=document.createElement('div');choices.className='magic-trait-choices';
  const isColor=field.key==='color';
  if(isColor)choices.classList.add('magic-color-choices');
  for(const [key,label,emoji] of field.options){
   if(magicState.category==='landscapes'&&field.key==='extra'&&magicState.size==='expert'&&key==='flowers')continue;
   const selected=values[field.key]===key;
   const button=magicCreateButton('magic-choice'+(isColor?' magic-color-choice':'')+(selected?' is-selected':''),undefined);
   button.dataset.field=field.key;button.dataset.option=key;
   button.setAttribute('aria-pressed',String(selected));
   button.setAttribute('aria-label',label);
   if(isColor){
    const circle=document.createElement('i');circle.className='magic-color-dot';
    const colorMap={natural:'#db9c6e',original:magicState.size==='easy'?'#a76be8':magicState.size==='medium'?'#32cdbb':magicState.size==='hard'?'#fb2430':'#00b9f7',w:'#ffffff',n:'#9c6b4c',p:'#f59cc9',v:'#ad85e9',b:'#7cc9f7',l:'#8bd283',O:'#ffae51'};
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
 // Nie cofaj listy cech do początku po kliknięciu oczu, minki lub koloru.
 if(controls)controls.scrollTop=controlsScrollTop;
}
function magicOpen(){magicRender();magicMessage('')}
function magicChoose(category){
 if(!Object.hasOwn(magicDefs,category))return;
 const firstEntry=!magicState.category;
 magicHistory();magicState.category=category;magicResetDrawing(category);
 magicPersist();magicRender();magicMessage('');
 if(firstEntry&&window.matchMedia('(max-width:859px)').matches){
  // Po wybraniu przygody pokaż cały edytor, nie nagłówek daleko nad obrazkiem.
  document.getElementById('magic-workbench').scrollIntoView({block:'start',behavior:'auto'});
 }else if(firstEntry){
  window.scrollTo(0,0);
  document.getElementById('magic-title').focus({preventScroll:true});
 }
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
 if(fox&&magicState.size==='easy'){
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
   if(magicState.category==='landscapes'){
    if(magicState.size==='easy'&&!['apples','hollow'].includes(f.key))continue;
    if(magicState.size!=='easy'&&['apples','hollow'].includes(f.key))continue;
    if(magicState.size!=='medium'&&f.key==='bird')continue;
    if(magicState.size!=='hard'&&['season','bridge'].includes(f.key))continue;
   }
   if(magicState.category==='animals'&&['kind','pose'].includes(f.key))continue;
   if(magicState.size==='easy'&&f.key==='scene'&&!['monsters','animals','robots'].includes(magicState.category))continue;
   if(magicState.category==='worlds'&&magicState.size==='easy'&&['eyes','extra'].includes(f.key))continue;
   const choices=magicState.category==='landscapes'&&f.key==='extra'&&magicState.size==='expert'
    ?f.options.filter(option=>option[0]!=='flowers'):f.options;
   v[f.key]=choices[Math.floor(Math.random()*choices.length)][0];
  }
  tries++;
 }while(JSON.stringify(v)===before&&tries<6);
 magicState.name='';magicPersist();magicRender();magicMessage(magicState.category==='monsters'?'✨ Nowy wygląd: oczy, minka, ozdoby i kolory!':'✨ Nowa magiczna kombinacja!');magicCelebrate();
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
// Przenoś przełącznik tematów także przy obrocie telefonu, bez resetowania formularza.
window.addEventListener('resize',()=>{
 const workspace=document.querySelector('#magic-workbench .magic-v2-workspace');
 const controls=workspace?.querySelector('.magic-v2-controls');
 const switcher=document.getElementById('magic-theme-switcher');
 if(!workspace||!controls||!switcher)return;
 const destination=window.matchMedia('(max-width:859px)').matches?controls:workspace;
 if(switcher.parentElement!==destination)destination.prepend(switcher);
});
document.getElementById('magic-fields').addEventListener('click',event=>{
 const button=event.target.closest('button[data-field][data-option]');
 if(!button||!magicState.category)return;
 const field=magicDefs[magicState.category].fields.find(field=>field.key===button.dataset.field);
 if(!field||!field.options.some(option=>option[0]===button.dataset.option))return;
 if(!magicSelectTrait(field.key,button.dataset.option))return;
 // Zmiana oczu/koloru nie kasuje nazwy wpisanej przez dziecko.
 magicPersist();magicRender();magicMessage('');magicCelebrate();
 const matching=document.querySelector('#magic-fields button[data-field="'+field.key+'"][data-option="'+button.dataset.option+'"]');
 matching?.focus({preventScroll:true});
});
document.getElementById('magic-levels').addEventListener('click',event=>{
 const button=event.target.closest('button[data-level]');
 if(!button||!Object.hasOwn(MAGIC_VARIANTS,button.dataset.level))return;
 if(!magicSelectLevel(button.dataset.level))return;
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
 if(!magicSelectTrait(key,event.target.value))return;
 magicPersist();magicRender();magicMessage('');
});
document.getElementById('magic-name').addEventListener('input',event=>{
 magicState.name=event.target.value.slice(0,42);magicPersist();
});
document.getElementById('magic-size').addEventListener('change',event=>{
 const size=event.target.value;
 if(!magicSelectLevel(size))return;
 magicPersist();magicRender();magicMessage('Wybrano: '+MAGIC_VARIANTS[size].label+'.');
});
const magicBestSets={
 animals:[
  {kind:'cat',eyes:'sparkle',mouth:'smile',extra:'none',scene:'none',color:'natural'},
  {kind:'cat',eyes:'wink',mouth:'tongue',extra:'bow',scene:'hearts',color:'p'},
  {kind:'cat',eyes:'happy',mouth:'surprised',extra:'crown',scene:'stars',color:'O'},
  {kind:'dog',eyes:'sparkle',mouth:'smile',extra:'none',scene:'none',color:'natural'},
  {kind:'dog',eyes:'wink',mouth:'tongue',extra:'scarf',scene:'hearts',color:'n'},
  {kind:'dog',eyes:'happy',mouth:'smile',extra:'flower',scene:'flowers',color:'b'},
  {kind:'bunny',eyes:'sparkle',mouth:'smile',extra:'none',scene:'none',color:'natural'},
  {kind:'bunny',eyes:'happy',mouth:'tongue',extra:'bow',scene:'flowers',color:'p'},
  {kind:'bunny',eyes:'wink',mouth:'surprised',extra:'crown',scene:'stars',color:'l'},
  {kind:'owl',eyes:'round',mouth:'smile',extra:'none',scene:'none',color:'natural'},
  {kind:'owl',eyes:'wink',mouth:'surprised',extra:'star',scene:'stars',color:'v'},
  {kind:'owl',eyes:'happy',mouth:'tongue',extra:'flower',scene:'flowers',color:'b'},
  {kind:'bear',eyes:'happy',mouth:'smile',extra:'crown',scene:'hearts',color:'n'},
  {kind:'bear',eyes:'round',mouth:'tongue',extra:'bow',scene:'stars',color:'p'},
  {kind:'fox',eyes:'sparkle',mouth:'smile',extra:'none',scene:'none',color:'natural'}
 ],
 monsters:[
  {eyes:'original',mouth:'original',accessory:'original',scene:'none',color:'original'},
  {eyes:'wink',mouth:'smile',accessory:'bow',scene:'stars',color:'original'},
  {eyes:'happy',mouth:'tongue',accessory:'star',scene:'hearts',color:'p'},
  {eyes:'sleepy',mouth:'surprised',accessory:'heart',scene:'flowers',color:'b'},
  {eyes:'original',mouth:'smile',accessory:'none',scene:'stars',color:'l'},
  {eyes:'happy',mouth:'smile',accessory:'bow',scene:'flowers',color:'v'}
 ],
 robots:[
  {kind:'square',eyes:'visor',mouth:'heart',extra:'one',scene:'stars',color:'b'},
  {kind:'round',eyes:'dots',mouth:'star',extra:'two',scene:'stars',color:'v'},
  {kind:'tall',eyes:'visor',mouth:'lights',extra:'two',scene:'hearts',color:'l'}
 ],
 landscapes:[
  {eyes:'day',extra:'none',color:'b'},
  {eyes:'evening',extra:'stars',color:'b'},
  {eyes:'night',extra:'none',color:'b'},
  {eyes:'day',extra:'stars',color:'l'},
  {eyes:'day',extra:'none',color:'v'}
 ],
 worlds:[
  {roof:'blue',wall:'sand',flag:'red',gate:'brown'},
  {roof:'purple',wall:'pink',flag:'yellow',gate:'gold'},
  {roof:'green',wall:'gray',flag:'blue',gate:'brown'}
 ]
};
function magicSuper(){
 if(!magicState.category)return;
 const category=magicState.category;
 if(category==='worlds'){
  magicHistory();Object.assign(magicState.values.worlds,{roof:'original',wall:'original',flag:'original',gate:'original'});
  magicPersist();magicRender();magicMessage('🏰 Przywrócono oryginalny zamek.');magicCelebrate();return;
 }
 if(category==='animals'&&magicState.values.animals.kind==='fox'){
  const o=magicState.values.animals;
  const curated={
   easy:{color:'natural',scene:'none'},
   medium:{color:'natural',scene:'none'},
   hard:{color:'natural',scene:'none'},
   expert:{color:'natural',scene:'none'}
  }[magicState.size];
  if(o.color!==curated.color||o.scene!==curated.scene||o.eyes!=='sparkle'||o.mouth!=='smile'||o.extra!=='none'){
   magicHistory();Object.assign(o,curated,{eyes:'sparkle',mouth:'smile',extra:'none'});
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
