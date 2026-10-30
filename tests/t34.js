const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1440,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.addInitScript(()=>{ localStorage.setItem('tk_start',String(Date.now()-2592000e3)) });
await p.goto('http://localhost:8765/tk_test.html',{waitUntil:'load'}); await p.waitForTimeout(800);
await p.evaluate(()=>{ window._navJump=true; const o=document.getElementById('outro'); window._lenis.scrollTo(o.offsetTop-1500,{immediate:true,force:true}); }); await p.waitForTimeout(600); await p.evaluate(()=>{window._navJump=false});
for(let i=0;i<25;i++){ await p.mouse.wheel(0,200); await p.waitForTimeout(60);} await p.waitForTimeout(1500);
const dig=()=>p.evaluate(()=>[...document.querySelectorAll('#oDigits g > g')].map(g=>{ const on=[...g.querySelectorAll('polygon')].filter(x=>x.getAttribute('class')==='seg-on').map(x=>x.dataset.s).sort().join(''); const M={'abcdef':0,'bc':1,'abdeg':2,'abcdg':3,'bcfg':4,'acdfg':5,'acdefg':6,'abc':7,'abcdefg':8,'abcdfg':9}; return M[on]??'?' }).join(''));
console.log('painting',await dig());
for(let i=0;i<10;i++){ await p.mouse.wheel(0,200); await p.waitForTimeout(80);}
const t0=Date.now(); for(let i=0;i<16;i++){ console.log(((Date.now()-t0)/1000).toFixed(2), await dig()); await p.waitForTimeout(170); }
console.log(errs); await b.close()})();
