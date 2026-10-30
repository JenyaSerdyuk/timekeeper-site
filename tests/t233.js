const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.route('**/*.woff2',async r=>{await new Promise(z=>setTimeout(z,1500));r.continue()});
p.goto('http://localhost:8766/?x='+Date.now());
for(let i=0;i<10;i++){await p.waitForTimeout(250);try{console.log(i*250,await p.evaluate(()=>[!!document.getElementById('fwS'),getComputedStyle(document.querySelector('.intro .stick')).opacity,document.fonts.status,[...document.fonts].filter(f=>f.status==='loaded').length].join(' ')))}catch(e){console.log('e')}}
await b.close()})();
