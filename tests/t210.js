const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const f of ['tk_pre.html','tk_test.html'])for(const [w,h] of [[1920,1080],[1440,900],[1280,720],[390,844],[390,664]]){const mob=w<500;const ctx=await b.newContext(mob?{...devices['iPhone 13'],viewport:{width:w,height:h}}:{viewport:{width:w,height:h}});const p=await ctx.newPage();
await p.goto('http://localhost:8765/'+f,{waitUntil:'networkidle'});await p.waitForTimeout(1500);
console.log(f,w+'x'+h,await p.evaluate(()=>document.getElementById('oImg').style.transform+' | intro '+document.getElementById('sceneImg').style.transform));await ctx.close()}
await b.close()})();
