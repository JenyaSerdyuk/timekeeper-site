const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const mode of ['desk','phone']){
const ctx=mode==='phone'?await b.newContext({...devices['iPhone 13']}):await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();
await p.addInitScript(()=>{window._log=[];const t0=performance.now();const f=()=>{const n=document.getElementById('iNameL');const c=document.querySelector('#iL .cap');const st=document.querySelector('.intro .stick');
 window._log.push([Math.round(performance.now()-t0),Math.round(scrollY),n?Math.round(n.getBoundingClientRect().left)+','+Math.round(n.getBoundingClientRect().top)+','+getComputedStyle(n).fontSize:'-',c?Math.round(c.getBoundingClientRect().left)+','+Math.round(c.getBoundingClientRect().top):'-',st?getComputedStyle(st).opacity:'-',document.getElementById('iL')?document.getElementById('iL').style.transform:''].join(' '));if(performance.now()-t0<4000)requestAnimationFrame(f)};requestAnimationFrame(f)});
await p.goto('http://localhost:8766/');await p.waitForTimeout(4200);
const log=await p.evaluate(()=>window._log);let prev='';const out=[];for(const l of log){const k=l.split(' ').slice(1).join(' ');if(k!==prev){out.push(l);prev=k}}
console.log(mode,'\n'+out.join('\n'));await ctx.close()}
await b.close()})();
