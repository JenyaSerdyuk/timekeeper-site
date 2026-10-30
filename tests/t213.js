const {chromium,devices}=require('playwright');
const VPS=[[1920,1080],[1440,900],[1280,720],[1024,768],[667,560],[390,844],[390,664],[375,548]];
(async()=>{const b=await chromium.launch();
for(const [w,h] of VPS){const mob=w<500;const ctx=await b.newContext(mob?{...devices['iPhone 13'],viewport:{width:w,height:h}}:{viewport:{width:w,height:h}});const p=await ctx.newPage();
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2200);
const g=await p.evaluate(()=>{const R=e=>{const b=(typeof e==='string'?document.querySelector(e):e).getBoundingClientRect();return [Math.round(b.left),Math.round(b.top),Math.round(b.right),Math.round(b.bottom)]};
 const sc=+document.getElementById('sceneImg').style.transform.match(/scale\(([\d.]+)/)[1];const t=document.getElementById('sceneImg').style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px/);
 const obj=[1104,868,986,576];const pl=[+t[1]+obj[0]*sc,+t[2]+obj[1]*sc,+t[1]+(obj[0]+obj[2])*sc,+t[2]+(obj[1]+obj[3])*sc].map(Math.round);
 return {fs:getComputedStyle(document.getElementById('lTag')).fontSize,tag:R('#lTag'),phr:R('#lPhr'),paint:pl,modes:R('#iModes'),form:R('#rsvForm'),yours:R('#yours')}});
const ov=[];if(g.phr[3]>g.paint[1])ov.push('text>paint');if(g.modes[1]<g.paint[3])ov.push('modes<paint');if(g.form[1]<g.modes[3])ov.push('form<modes');if(g.form[3]>h)ov.push('form off');
console.log(w+'x'+h,JSON.stringify(g),ov.join(','));
await p.screenshot({path:`/home/claude/rv_${w}x${h}.png`});await ctx.close()}
await b.close()})();
