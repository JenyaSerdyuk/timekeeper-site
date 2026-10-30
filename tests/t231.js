const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();
await p.route('**/*.woff2',async r=>{await new Promise(z=>setTimeout(z,700));r.continue()});
p.goto('http://localhost:8766/');
const t0=Date.now();for(let i=0;i<14;i++){await p.waitForTimeout(i<6?150:300);try{const r=await p.evaluate(()=>{const n=document.getElementById('iNameL');const s=document.querySelector('.intro .stick');return n?[getComputedStyle(n).fontFamily.slice(0,10),Math.round(n.getBoundingClientRect().width),getComputedStyle(s).opacity,document.documentElement.className,document.fonts.status].join(' '):'-'});console.log(Date.now()-t0,r);await p.screenshot({path:`/home/claude/ld_${i}.png`,clip:{x:0,y:0,width:1440,height:900}})}catch(e){console.log('err',e.message.slice(0,80))}}
await b.close()})();
