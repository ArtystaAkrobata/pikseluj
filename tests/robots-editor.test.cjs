// node tests/robots-editor.test.cjs
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=['magic-approved-robots-data.js','magic-approved-robots.js'].map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n');
const robots=vm.runInNewContext(source+'\nMagicApprovedRobots;');
const opts={kind:['square','round','tall'],eyes:['dots','visor','sleepy'],mouth:['heart','star','lights'],extra:['one','two','none'],scene:['none','stars','hearts'],color:['b','v','p','l','O']};
const limits={easy:5,medium:6,hard:8,expert:10};
let n=0;
for(const [level,[w,h]] of Object.entries(robots.dims)){
 const original=robots.render(level).join('/');
 assert.equal(robots.originals[level].length,h);
 for(const row of robots.originals[level])assert.equal(row.length,w);
 for(const [field,values] of Object.entries(opts)){
  const variants=values.map(value=>robots.render(level,{[field]:value}).join('/'));
  assert.equal(new Set(variants).size,values.length,'inert option '+level+' '+field);
 }
 for(const kind of opts.kind)for(const eyes of opts.eyes)for(const mouth of opts.mouth)
 for(const extra of opts.extra)for(const scene of opts.scene)for(const color of opts.color){
  const rows=robots.render(level,{kind,eyes,mouth,extra,scene,color});
  assert.equal(rows.length,h);
  assert.ok(rows.every(row=>row.length===w));
  const used=new Set(rows.join('').replace(/\./g,''));
  assert.ok(used.size<=limits[level],'palette limit '+level);
  for(const key of used)assert.ok(Object.hasOwn(robots.palette,key)||'vplO'.includes(key),'unknown color '+key);
  n++;
 }
 assert.equal(robots.render(level).join('/'),original,'base edited by variant '+level);
}
console.log('Robot creator PASS: '+n+' combinations, four approved baselines, independent options and full cells');
