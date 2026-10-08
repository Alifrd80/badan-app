const fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript'),assert=require('node:assert/strict');
function moduleFrom(path){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{exports,require,console});return exports;}
const {levelFromAnswers,validProfile}=moduleFrom('src/lib/assessment.ts');
for(const [answer,level] of [[0,'beginner'],[1,'intermediate'],[2,'professional']]){assert.equal(levelFromAnswers([answer,2,1]),level);assert.equal(validProfile({version:1,answers:[answer,2,1],level}),true);}
assert.equal(validProfile({version:1,answers:[99,2,1],level:'beginner'}),false);assert.equal(validProfile(null),false);
const {initialSession,sessionReducer:r,restoreSession,completedGroups}=moduleFrom('src/lib/workoutSession.ts');
const steps=[{key:'a',group:'main',reps:10,restAfter:90},{key:'b',group:'main',reps:10,restAfter:120},{key:'c',group:'abs',seconds:30,restAfter:15}];
let s=r(initialSession(),{type:'tick',seconds:10},steps);s=r(s,{type:'tick',seconds:99},steps);assert.equal(s.cursor,0);assert.equal(s.completed.length,0);
s=r(s,{type:'advance'},steps);assert.equal(s.phase,'rest');assert.equal(s.remaining,90);s=r(s,{type:'addRest',seconds:20},steps);assert.equal(s.remaining,110);s=r(s,{type:'pause'},steps);assert.equal(r(s,{type:'tick',seconds:30},steps).remaining,110);
const saved=restoreSession(JSON.stringify({signature:'same',state:s}),'same',steps);assert.equal(saved.cursor,1);assert.equal(saved.paused,true);assert.equal(saved.remaining,110);assert.equal(restoreSession('bad','same',steps),null);assert.equal(restoreSession(JSON.stringify({signature:'same',state:s}),'different',steps),null);
s=r(s,{type:'advance'},steps);s=r(s,{type:'advance'},steps);assert.equal(s.remaining,120);assert.equal(completedGroups(s,steps).join(','),'main');s=r(s,{type:'advance'},steps);s=r(s,{type:'tick',seconds:30},steps);assert.equal(s.phase,'finished');assert.equal(s.completed.length,3);
let skipped=r(r(initialSession(),{type:'advance'},steps),{type:'skip'},steps);assert.equal(skipped.completed.length,0);
const map=JSON.parse(fs.readFileSync('src/lib/localVideos.json','utf8'));const original=JSON.parse(fs.readFileSync('src/data/exercise-video-map.json','utf8')).items;for(const item of original){if(item.videoId){assert.ok(map[item.id],item.id);const file='public'+map[item.id];assert.ok(fs.existsSync(file));assert.equal(fs.readFileSync(file).subarray(4,8).toString(),'ftyp');}}
console.log('PASS: all 3 assessment levels, invalid profiles, manual reps, set/rest/timed transitions, pause, +20, restore, skip accounting and all original video mappings.');
