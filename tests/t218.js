const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [w0,w1] of [[1920,1920],[2560,2560],[900,1920],[1920,1200],[390,1440]]){const p=await b.newPage({viewport:{width:w0,height:1000}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(800);
if(w1!==w0){await p.setViewportSize({width:w1,height:1000});await p.waitForTimeout(800)}
await p.evaluate(()=>{window._navJump=true;const e=document.querySelector('#ll');scrollTo(0,e.getBoundingClientRect().top+scrollY-120)});await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const v=document.getElementById('llView').getBoundingClientRect();const its=[...document.querySelectorAll('#llItems .ll-it:not(.hid)')].map(e=>e.getBoundingClientRect());const yb=[...document.querySelectorAll('.ll-ys')].map(e=>e.getBoundingClientRect());return 'view '+Math.round(v.left)+'-'+Math.round(v.right)+' years '+Math.round(Math.min(...yb.map(x=>x.left)))+'-'+Math.round(Math.max(...yb.map(x=>x.right)))+' cards '+its.length});
console.log(w0+'->'+w1,r);
await p.screenshot({path:`/home/claude/llw_${w0}_${w1}.png`,clip:{x:0,y:100,width:w1,height:450}});
await p.click('#llIn');await p.waitForTimeout(1300);
console.log('  months',await p.evaluate(()=>{const yb=[...document.querySelectorAll('.ll-ms')].map(e=>e.getBoundingClientRect()).filter(x=>x.right>0&&x.left<innerWidth);return yb.length}));
await p.close()}
await b.close()})();
