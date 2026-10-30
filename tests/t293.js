const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);
await p.addStyleTag({content:'.splitsec .stick{height:600px!important}'});
const P1=await p.evaluate(()=>{const i=document.querySelector('.intro');return i.offsetHeight-innerHeight});
for(const [y,n] of [[0,'a'],[P1,'b']]){await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2500);await p.screenshot({path:process.argv[2]+'/is_'+n+'.png'})}
console.log(errs.join(';'));await ctx.close();await b.close()})();
