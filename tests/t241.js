const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [w,h,m] of [[1440,900,0],[390,844,1]]){const ctx=await b.newContext(m?{...devices['iPhone 13']}:{viewport:{width:w,height:h}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/',async r=>{const res=await r.fetch();let t=await res.text();t=t.replace('const y0=minT+free/2,','window.__dbg=[A.h,M.h,B.h,F.h,P,extra,free].map(Math.round).join(","); const y0=minT+free/2,');r.fulfill({response:res,body:t})});await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1300);
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
const y84=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+0.84*(s.offsetHeight-innerHeight)});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y84);await p.waitForTimeout(2300);await p.evaluate(()=>{window._navJump=false});await p.waitForTimeout(300);
const pos=()=>p.evaluate(()=>['lTag','lPhr','rsvForm','iModes','sceneWin'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return id+':'+Math.round(r.left)+','+Math.round(r.top)}).join(' '));
await p.waitForTimeout(2500);console.log('pre',await pos(),await p.evaluate(()=>(window.__L||[]).slice(-4).join(' / ')));await p.waitForTimeout(600);const a=await pos()+' '+await p.evaluate(()=>window.__dbg+' T='+document.getElementById('lPhr').style.translate+' tf='+getComputedStyle(document.getElementById('lPhr')).transform+' B='+window.__B);await p.evaluate(()=>document.querySelector('#iModes button[data-m="life"]').click());await p.waitForTimeout(2500);const b2=await pos()+' '+await p.evaluate(()=>window.__dbg+' T='+document.getElementById('lPhr').style.translate+' tf='+getComputedStyle(document.getElementById('lPhr')).transform+' B='+window.__B);
await p.screenshot({path:`/home/claude/life_${w}.png`});
console.log(w,a===b2?'NO MOVE':'MOVED\n '+a+'\n '+b2,errs.join(';'),'fs',await p.evaluate(()=>getComputedStyle(document.getElementById('lTag')).fontSize));
await p.evaluate(()=>document.querySelector('#iModes button[data-m="now"]').click());await p.waitForTimeout(500);
// scroll down natively from the painting
const s0=await p.evaluate(()=>scrollY);
if(m){const cdp=await ctx.newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:600}]});for(let k=1;k<=8;k++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y:600-k*30}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})}
else {await p.mouse.move(700,450);for(let i=0;i<6;i++){await p.mouse.wheel(0,60);await p.waitForTimeout(30)}}
const seq=[];for(let i=0;i<8;i++){await p.waitForTimeout(100);seq.push(await p.evaluate(()=>Math.round(scrollY)))}
console.log(' scroll from',Math.round(s0),'->',seq.join(','));await ctx.close()}
await b.close()})();
