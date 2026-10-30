const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [w,h] of [[1512,860],[1512,730],[1728,980],[1440,760]]){const p=await b.newPage({viewport:{width:w,height:h}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);
const top=await p.evaluate(()=>document.querySelector('.outro').offsetTop);const H=await p.evaluate(()=>document.querySelector('.outro').offsetHeight);
// scroll gradually like a user
for(let y=top-400;y<=top+60;y+=60){await p.mouse.wheel(0,60);await p.waitForTimeout(40)}
await p.evaluate(y=>{scrollTo(0,y)},top+20);await p.waitForTimeout(2500);
console.log(w,h,await p.evaluate(()=>{const ob=document.getElementById('oBd');return ob.style.top+' '+ob.style.transformOrigin+' '+innerWidth+' g1='+(typeof sceneLayout!=='undefined'?'':'')}));
await p.screenshot({path:`/home/claude/lsx_${w}_${h}.png`});await p.close()}
await b.close()})();
