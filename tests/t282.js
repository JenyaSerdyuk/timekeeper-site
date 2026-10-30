const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.mouse.move(700,450);
for(let k=0;k<3;k++){await p.mouse.wheel(0,100);await p.waitForTimeout(2200)}
console.log(await p.evaluate(()=>{const i=document.querySelector('.intro');const nx=i.nextElementSibling;const nav=document.getElementById('nav');const o={y:scrollY,nx:nx.tagName+'#'+nx.id+'.'+nx.className,nxTop:nx.getBoundingClientRect().top,nxH:nx.offsetHeight,nav:nav?[nav.getBoundingClientRect().top,nav.offsetHeight,getComputedStyle(nav).position]:null};const h=document.querySelector('h2');o.h2=h.textContent+' '+Math.round(h.getBoundingClientRect().top);return o}));
await p.screenshot({path:process.argv[2]+'/s4.png'});await b.close()})();
