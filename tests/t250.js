const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [port,lang] of [[8766,'en'],[8767,'ru']]) for(const [w,h] of [[390,844],[375,667],[430,770],[1440,900],[1920,1080],[1280,720]]){
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
 await p.goto('http://localhost:'+port+'/');await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>{const L=document.getElementById('iL'),c=L.querySelector('.cap'),t=c.firstChild,rg=document.createRange();
  const cp=getComputedStyle(L).clipPath; const m=cp.match(/inset\(0px (\d+(\.\d+)?)px/); const x=L.clientWidth-(+m[1])-1;
  let hit='gap'; for(let k=0;k<t.length;k++){rg.setStart(t,k);rg.setEnd(t,k+1);const b=rg.getBoundingClientRect(); if(x>=b.left&&x<=b.right){hit=JSON.stringify(t.data[k])}}
  return {x,hit,shift:c.style.translate}});
 console.log(lang,w,JSON.stringify(r));
 if(lang=='en'&&(w==390||w==1440)) await p.screenshot({path:process.argv[2]+'/cap_'+w+'.png',clip:{x:0,y:0,width:w,height:80}});
 await p.close()}
await b.close()})();
