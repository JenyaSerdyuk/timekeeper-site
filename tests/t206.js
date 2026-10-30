const {chromium,devices}=require('playwright');
const url=process.argv[2]||'http://localhost:8766/', tag=process.argv[3]||'x';
const VPS=[[1440,900],[1920,1080],[1280,720],[700,800],[390,664],[390,844],[375,548]];
(async()=>{const b=await chromium.launch();
for(const [w,h] of VPS){const mob=w<500;const ctx=await b.newContext(mob?{...devices['iPhone 13'],viewport:{width:w,height:h}}:{viewport:{width:w,height:h}});const p=await ctx.newPage();
await p.goto(url,{waitUntil:'networkidle'});await p.waitForTimeout(1200);
for(const f of [2.4,3.0]){await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},f*h);await p.waitForTimeout(2200);await p.screenshot({path:`/home/claude/fs2_${tag}_${w}x${h}_${f}.png`})}
await ctx.close()}
await b.close()})();
