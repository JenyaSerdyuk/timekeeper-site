const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2200);
console.log(await p.evaluate(()=>['.ltag .ul','.to-rsv','.rsv-cta'].map(q=>{const c=getComputedStyle(document.querySelector(q));return q+' '+c.textDecorationThickness+' '+c.textUnderlineOffset}).join(' | ')));
await p.screenshot({path:'/home/claude/ul.png',clip:{x:300,y:20,width:840,height:220}});await b.close()})();
