const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [u,t] of [['http://localhost:8766/','n'],['http://localhost:8767/','r']])for(const [w,h] of [[1920,1080],[1440,900],[1280,720],[390,844],[375,667]]){const m=w<500;const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:m,hasTouch:m,deviceScaleFactor:1});const p=await ctx.newPage();
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1300);
const top=await p.evaluate(()=>document.querySelector('.outro').offsetTop);
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},top+10);await p.waitForTimeout(1800);
const r=await p.evaluate(()=>{const R=id=>{const b=document.getElementById(id).getBoundingClientRect();return [Math.round(b.left),Math.round(b.top),Math.round(b.right),Math.round(b.bottom)]};const md=document.querySelector('#oBd .omodes').getBoundingClientRect();return {modes:[Math.round(md.left),Math.round(md.top),Math.round(md.right),Math.round(md.bottom)],order:R('oOrder')}});
const pt=await p.evaluate(()=>{const t=document.getElementById('oImg').style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\) scale\(([\d.]+)/);const sc=+t[3];return [Math.round(+t[1]+1104*sc),Math.round(+t[2]+868*sc),Math.round(+t[1]+2090*sc),Math.round(+t[2]+1444*sc)]});
console.log(t,w+'x'+h,'paint',pt,JSON.stringify(r));
await p.screenshot({path:`/home/claude/ls_${t}_${w}.png`});
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2000);await p.screenshot({path:`/home/claude/fs_${t}_${w}.png`});
await ctx.close()}
await b.close()})();
