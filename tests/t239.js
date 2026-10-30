const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [u,w,h] of [['http://localhost:8766/',1440,900],['http://localhost:8767/',1440,900],['http://localhost:8766/',390,844]]){const p=await b.newPage({viewport:{width:w,height:h}});
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1800);await p.screenshot({path:`/home/claude/cl_${u.slice(-5,-1)}_${w}.png`});await p.close()}
await b.close()})();
