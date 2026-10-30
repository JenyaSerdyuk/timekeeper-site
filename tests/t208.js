const {chromium,devices}=require('playwright');
const url=process.argv[2];
const VPS=[[1920,1080],[1440,900],[1280,720],[700,800],[390,844],[390,664],[375,548]];
(async()=>{const b=await chromium.launch();
for(const [w,h] of VPS){const mob=w<500;const ctx=await b.newContext(mob?{...devices['iPhone 13'],viewport:{width:w,height:h}}:{viewport:{width:w,height:h}});const p=await ctx.newPage();
await p.goto(url,{waitUntil:'networkidle'});await p.waitForTimeout(1500);
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2200);
console.log(w+'x'+h, await p.evaluate(()=>{const f=id=>parseFloat(getComputedStyle(document.getElementById(id)).fontSize).toFixed(1);const r=id=>{const b=document.getElementById(id).getBoundingClientRect();return Math.round(b.left)+'-'+Math.round(b.right)+'/'+Math.round(b.top)+'-'+Math.round(b.bottom)};
 const im=document.getElementById('sceneWin').getBoundingClientRect();
 return 'tag '+f('lTag')+' phr '+f('lPhr')+' | tag '+r('lTag')+' phr '+r('lPhr')+' modes '+r('iModes')+' form '+r('rsvForm')+' tight '+document.querySelector('.intro .launch').classList.contains('tight')}));
await ctx.close()}
await b.close()})();
