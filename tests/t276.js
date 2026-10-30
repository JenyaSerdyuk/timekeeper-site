const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.mouse.move(700,450);
await p.evaluate(()=>{window._ch=[];let last='';const f=t=>{const s=document.getElementById('iL').style.transform+'|'+document.querySelector('.intro .launch').style.opacity;if(s!==last){window._ch.push(Math.round(t));last=s}requestAnimationFrame(f)};requestAnimationFrame(f)});
const swipe=async(dir)=>{const ds=[2,6,14,28,40,44,40,34,28,22,18,14,11,9,7,6,5,4,3,3,2,2,2,1,1,1,1,1,1,1];for(const d of ds){await p.mouse.wheel(0,dir*d);await p.waitForTimeout(17)}};
const run=async(t,dir,w)=>{await p.evaluate(()=>window._ch=[]);const t0=await p.evaluate(()=>performance.now());await swipe(dir);await p.waitForTimeout(w);const ch=await p.evaluate(()=>window._ch);console.log(t,ch.length?Math.round(ch[ch.length-1]-ch[0]):'-','ms frames',ch.length,'y',await p.evaluate(()=>Math.round(scrollY)))};
await run('open TIME',1,1800); await run('close TIME',-1,3000); await run('open TIME',1,1800); await run('close',-1,3000);
await run('open',1,1800); await run('to painting',1,3000); await run('back to black',-1,3000); await run('back to TIME',-1,3000);
await b.close()})();
