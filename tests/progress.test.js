import test from 'node:test';
import assert from 'node:assert/strict';
import {validateProgress, encodeProgress, decodeProgress, loadProgress, loadChecklist, incomingProgress} from '../src/progress.js';
const valid = () => ({scores:{1:0,21:24},checks:{1:[true,null,false]},startDate:'2026-10-01'});
test('legacy sparse task arrays and zero scores round-trip', () => {
  const result=decodeProgress(encodeProgress(valid()));
  assert.equal(result.scores[1],0);assert.deepEqual(result.checks[1],[true,false,false]);
});
test('rejects invalid roots, scores, days, checks and dates atomically',()=>{
  for(const bad of [null, [], {}, {...valid(),scores:{22:20}}, {...valid(),scores:{'01':20}}, {...valid(),scores:{1:'20'}}, {...valid(),scores:{1:24.5}}, {...valid(),scores:{1:-1}}, {...valid(),checks:{1:'oops'}}, {...valid(),checks:{1:[true,true,true,true,true]}}, {...valid(),checks:{1:['true']}}, {...valid(),startDate:'2026-02-30'}]) assert.throws(()=>validateProgress(bad));
});
test('rejects malformed/oversized codes',()=>{
 for(const code of ['not-valid', 'a'.repeat(20001), btoa('null')]) assert.throws(()=>decodeProgress(code));
});
test('unreadable persisted data is never modified',()=>{
 const raw='not json';let writes=0;
 const state=loadProgress({getItem:()=>raw,setItem:()=>writes++});
 assert.equal(state.raw,raw);assert.ok(state.error);assert.equal(writes,0);
});
test('storage access denial is recoverable',()=>{
 const storage={getItem(){throw new Error('denied')}};
 assert.ok(loadProgress(storage).error);assert.ok(loadChecklist(storage).error);
});
test('legacy and private fragment links stage data; bad links do not change stored data',()=>{
 const code=encodeURIComponent(encodeProgress(valid()));
 for(const sep of ['?','#']) assert.equal(incomingProgress({href:`https://example.com/${sep}sync=${code}`}).pending.scores[21],24);
 assert.ok(incomingProgress({href:'https://example.com/?sync=bad'}).error);
 assert.deepEqual(incomingProgress({href:'https://example.com/'}),{pending:null,error:''});
});
test('checklist shape is validated and raw bytes retained',()=>{
 const raw='{ "chapter::0": true }';assert.equal(loadChecklist({getItem:()=>raw}).raw,raw);
 for(const raw of ['null','[]','{"x":"yes"}']) assert.ok(loadChecklist({getItem:()=>raw}).error);
});
