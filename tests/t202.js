const {chromium,devices}=require('playwright');
const url=process.argv[2]||'http://localhost:8766/';const tag=process.argv[3]||'en';
(async()=>{const b=await chromium.launch();
for(const dn of ['iPhone 13','Pixel 7']){const ctx=await b.newContext({...devices[dn]});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
await p.goto(url,{waitUntil:'networkidle'});await p.waitForTimeout(1500);
const H=await p.evaluate(()=>document.documentElement.scrollHeight);const W=await p.evaluate(()=>[innerWidth,document.documentElement.scrollWidth]);
console.log(dn,'H',H,'W',W,errs.slice(0,5).join(' | '));
// screenshots by scrolling viewport
let i=0;for(let y=0;y<H;y+=p.viewportSize().height){await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(500);await p.screenshot({path:`/home/claude/m_${tag}_${dn.replace(' ','')}_${String(i++).padStart(2,'0')}.png`})}
await ctx.close()}
await b.close()})();
