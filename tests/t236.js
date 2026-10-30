const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const u of ['http://localhost:8766/','http://localhost:8767/'])for(const [w,h] of [[1440,900],[390,844]]){const p=await b.newPage({viewport:{width:w,height:h}});
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1500);
console.log(u.slice(-5),w,await p.evaluate(()=>[document.getElementById('iL').style.clipPath,document.getElementById('oL').style.clipPath,innerWidth/2].join(' | ')));
await p.evaluate(()=>{window._navJump=true;scrollTo(0,innerHeight*0.35)});await p.waitForTimeout(900);await p.screenshot({path:`/home/claude/cu_${u.slice(-5,-1)}_${w}.png`});await p.close()}
await b.close()})();
