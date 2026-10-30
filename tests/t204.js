const {chromium,devices}=require('playwright');
const H=+process.argv[2]||640, url=process.argv[3]||'http://localhost:8766/', tag=process.argv[4]||'a';
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({...devices['iPhone 13'],viewport:{width:390,height:H}});const p=await ctx.newPage();
await p.goto(url,{waitUntil:'networkidle'});await p.waitForTimeout(1200);
for(let k=0;k<8;k++){const y=k*H*0.5;await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(1300);await p.screenshot({path:`/home/claude/fs_${tag}_${H}_${k}.png`})}
await b.close()})();
