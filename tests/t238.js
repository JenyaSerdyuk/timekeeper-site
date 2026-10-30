const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [u,w,h,dpr] of [['http://localhost:8766/',1440,900,2],['http://localhost:8767/',390,844,3]]){const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:dpr});
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1800);
await p.screenshot({path:`/home/claude/seam_${w}.png`,clip:{x:w/2-60,y:0,width:120,height:h}});
console.log(await p.evaluate(()=>[document.getElementById('iL').style.transform,document.getElementById('iL').style.clipPath,document.getElementById('iNameL').style.translate].join(' | ')));await p.close()}
await b.close()})();
