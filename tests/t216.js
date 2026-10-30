const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1000);
await p.evaluate(()=>{window._navJump=true;const e=document.querySelector('#uses');scrollTo(0,e.getBoundingClientRect().top+scrollY-80)});await p.waitForTimeout(1500);
await (await p.$('#uses>.cw-t')).screenshot({path:'/home/claude/uses_b.png'});await b.close()})();
