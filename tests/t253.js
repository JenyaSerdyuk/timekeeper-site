const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1000);
await p.addStyleTag({content:'.splitsec .stick{height:600px!important}'});
const top=await p.evaluate(()=>document.querySelector('.outro').offsetTop);
for(const [q,n] of [[0.03,'a'],[0.6,'b'],[1,'c']]){
await p.evaluate(([y,q])=>{window._navJump=true;const o=document.querySelector('.outro');scrollTo(0,o.offsetTop+q*(o.offsetHeight-innerHeight))},[top,q]);await p.waitForTimeout(3500);
await p.screenshot({path:process.argv[2]+'/lv_'+n+'.png'});}
await ctx.close();await b.close()})();
