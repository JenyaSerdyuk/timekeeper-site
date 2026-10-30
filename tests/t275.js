const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.mouse.move(700,450);
await p.evaluate(()=>{const sig=()=>[document.getElementById('iL').style.transform,document.getElementById('tyt').style.opacity,document.querySelector('.intro .launch').style.opacity].join('|');let last=sig(),lt=0;window._ch=[];const f=t=>{const s=sig();if(s!==last){window._ch.push(Math.round(t));last=s}requestAnimationFrame(f)};requestAnimationFrame(f)});
const swipe=async(dir)=>{const ds=[2,6,14,28,40,44,40,34,28,22,18,14,11,9,7,6,5,4,3,3,2,2,2,1,1,1,1,1,1,1];for(const d of ds){await p.mouse.wheel(0,dir*d);await p.waitForTimeout(17)}};
const run=async(t,dir)=>{await p.evaluate(()=>window._ch=[]);const t0=await p.evaluate(()=>performance.now());await swipe(dir);await p.waitForTimeout(3500);const ch=await p.evaluate(()=>window._ch);console.log(t,'visual change from',ch.length?Math.round(ch[0]-t0):'-','to',ch.length?Math.round(ch[ch.length-1]-t0):'-','ms  y',await p.evaluate(()=>Math.round(scrollY)))};
for(const [t,d] of [['d1',1],['d2',1],['d3',1],['u1',-1],['u2',-1],['u3',-1],['d1b',1],['d2b',1],['u1b',-1],['u2b',-1]]) await run(t,d);
await b.close()})();
