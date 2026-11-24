// Uruchom w katalogu repozytorium: node tests/cats-editor.test.cjs
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const script=['magic-approved-cats-data.js','magic-approved-cats.js']
 .map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n');
const ctx=vm.createContext({});
const cats=vm.runInContext(script+'\nMagicApprovedCats;',ctx,{timeout:30000});
const settings={
 eyes:['sparkle','round','happy','wink'],
 mouth:['smile','tongue','surprised'],
 extra:['none','bow','flower','star','crown','scarf'],
 scene:['none','stars','flowers','hearts'],
 color:['natural','w','n','p','v','b','l','O']
};
const limits={easy:5,medium:6,hard:8,expert:10};
const rightEyes={easy:[9,12,8,9],medium:[14,17,9,11],hard:[19,22,15,19],expert:[22,27,28,33]};
const gold={easy:'β',medium:'θ',hard:'ο',expert:'υ'};
let tested=0;
for(const [level,[width,height]] of Object.entries(cats.sizes)){
 const original=cats.render(level),originalString=original.join('/');
 assert.equal(original.length,height);
 for(const row of original)assert.equal(row.length,width);
 for(const [field,options] of Object.entries(settings)){
  const samples=options.map(value=>cats.render(level,{[field]:value}).join('/'));
  assert.equal(new Set(samples).size,options.length,level+' '+field+' has inert/duplicate choices');
 }
 const wink=cats.render(level,{eyes:'wink'});
 const [x0,x1,y0,y1]=rightEyes[level];
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)
  assert.notEqual(wink[y][x],gold[level],level+' must have a fully shut right eye');
 const stars=cats.render(level,{scene:'stars'});
 let added=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  if(original[y][x]!==stars[y][x]){
   assert.equal(original[y][x],'.',level+' scene overwrites character');
   added++;
  }
 }
 assert.ok(added>=5,level+' must add visible decorations');
 for(const eyes of settings.eyes)for(const mouth of settings.mouth)for(const extra of settings.extra)
 for(const scene of settings.scene)for(const color of settings.color){
  const rows=cats.render(level,{eyes,mouth,extra,scene,color});
  assert.equal(rows.length,height);
  for(const row of rows)assert.equal(row.length,width);
  const used=new Set(rows.join('').replace(/\./g,''));
  assert.ok(used.size<=limits[level],level+' crayon limit exceeded');
  for(const key of used)
   assert.ok(Object.hasOwn(cats.palette,key)||'wnpvblO'.includes(key),level+' unknown color '+key);
  tested++;
 }
 // Pure render: after any edits, the baseline must not have changed.
 assert.equal(cats.render(level).join('/'),originalString,level+' did not restore its original');
}
console.log('Pikseluj cats: PASS; checked '+tested+' combinations + masks, backgrounds and rollback');
