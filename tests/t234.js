const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [u,t] of [['http://localhost:8766/','n'],['http://localhost:8767/','r']])for(const [w,h] of [[430,770],[390,844],[390,664],[375,667],[1920,1080],[1440,900],[1280,720]]){const m=w<500;const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:m,hasTouch:m,deviceScaleFactor:m?2:1});const p=await ctx.newPage();
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1300);
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2300);
const r=await p.evaluate(()=>{const R=e=>{const b=(typeof e==='string'?document.querySelector(e):e).getBoundingClientRect();return [Math.round(b.left),Math.round(b.top),Math.round(b.right),Math.round(b.bottom)]};return {tag:R('#lTag'),modes:R('#iModes'),phr:R('#lPhr'),form:R('#rsvForm'),fs:getComputedStyle(document.getElementById('lTag')).fontSize}});
console.log(t,w+'x'+h,JSON.stringify(r));
await p.screenshot({path:`/home/claude/q_${t}_${w}x${h}.png`});await ctx.close()}
await b.close()})();
