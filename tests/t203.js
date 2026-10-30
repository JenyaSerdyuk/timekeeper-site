const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [u,t] of [['http://localhost:8766/','en'],['http://localhost:8767/','ru']]){const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1000);
await p.evaluate(()=>{window._navJump=true;scrollTo(0,document.documentElement.scrollHeight)});await p.waitForTimeout(1500);
await p.screenshot({path:`/home/claude/out_${t}.png`,clip:{x:0,y:0,width:390,height:140}});await ctx.close()}
await b.close()})();
