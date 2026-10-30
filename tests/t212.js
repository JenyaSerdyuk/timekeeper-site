const {chromium,devices}=require('playwright');
const VPS=[[667,560],[640,550],[700,800],[390,844],[390,664],[1440,900]];
(async()=>{const b=await chromium.launch();
for(const [w,h] of VPS){const mob=w<500;const ctx=await b.newContext(mob?{...devices['iPhone 13'],viewport:{width:w,height:h}}:{viewport:{width:w,height:h}});const p=await ctx.newPage();
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2200);
console.log(w+'x'+h,await p.evaluate(()=>{const r=id=>{const b=document.getElementById(id).getBoundingClientRect();return Math.round(b.left)+'-'+Math.round(b.right)};const w=document.getElementById('sceneWin');const im=document.getElementById('sceneImg').style.transform;return 'fs '+getComputedStyle(document.getElementById('lTag')).fontSize+' tag '+r('lTag')+' form '+r('rsvForm')+' '+im}));
await p.screenshot({path:`/home/claude/fs4_${w}x${h}.png`});await ctx.close()}
await b.close()})();
