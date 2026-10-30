import re, json, os, shutil
s=open('/home/claude/timekeeper.html').read()
s=s.replace('<title>Time Keeper</title>','<title>Time · Time Keeper — the keeper of your time</title>')
# leads: send every reservation / order to the Google Sheet endpoint (set in TK_LEADS)
a="""    try{ localStorage.setItem('tk_email',email) }catch(e){}
    try{
      const C=window.claude;"""
assert s.count(a)==1
s=s.replace(a,"""    try{ localStorage.setItem('tk_email',email) }catch(e){}
    if(window.TK_LEADS){ try{ fetch(window.TK_LEADS,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({email,format:format||'',start:tkStart,page:location.href,ua:navigator.userAgent,at:new Date().toISOString()},extra||{}))}) }catch(e){} return 'saved' }
    try{
      const C=window.claude;""")
leads=open('/home/claude/leads_url.txt').read().strip() if os.path.exists('/home/claude/leads_url.txt') else ''
head=('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
 '<meta name="description" content="Time Keeper — an art object that anchors your moment on the blockchain and counts every second of your time.">'
 '<meta property="og:title" content="Time · Time Keeper"><meta property="og:description" content="Your personal art object that will outlive you by hundreds of years."><meta property="og:image" content="img/w/scene.webp"><meta property="og:type" content="website">'
 '<link rel="icon" href="favicon.ico" sizes="48x48"><link rel="icon" type="image/png" sizes="32x32" href="fav32.png"><link rel="icon" type="image/png" sizes="192x192" href="fav192.png"><link rel="apple-touch-icon" href="fav180.png">'
 '<style>:root{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;padding:0;background:#fff;color:#000}img{max-width:100%}[hidden]{display:none!important}</style>'
 '<script>window.TK_LEADS='+json.dumps(leads)+'</script></head><body>')
out='site_en'
# fonts from our own server (no requests to Google)
import re as _re
s=_re.sub(r'<link rel="preconnect"[^>]*>','',s)
s=s.replace('https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js','js/lenis.min.js')
s=_re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^"]*">','<link rel="stylesheet" href="fonts/fonts.css">',s)
# consent: a small note appears under a form as soon as its email field is used; the cart form shows it always
CONSENT='By submitting, you agree to our <a href="privacy.html" target="_blank">privacy policy</a>'
s=s.replace('<button type="submit" class="btn co-send" id="coSend">','<p class="tk-cons tk-cons-static">'+CONSENT+'</p><button type="submit" class="btn co-send" id="coSend">')
s=s.replace('</body></html>','')
s+=("<style>.tk-cons{margin:0;font:400 11px/1.4 'Hanken Grotesk',sans-serif;color:#8b8b8b;text-align:center}.tk-cons a{color:inherit;text-decoration:underline}"
    ".tk-cons-float{position:absolute;left:0;right:0;top:calc(100% + 6px);opacity:0;pointer-events:none;transition:opacity .2s}.tk-cons-float.on{opacity:1;pointer-events:auto}.intro .tk-cons-float{color:rgba(255,255,255,.6)}</style>"
    "<script>(function(){var T="+json.dumps(CONSENT,ensure_ascii=False)+";['rsvForm','pForm','tlForm','llReg'].forEach(function(id){var f=document.getElementById(id);if(!f)return;if(getComputedStyle(f).position==='static')f.style.position='relative';var p=document.createElement('p');p.className='tk-cons tk-cons-float';p.innerHTML=T;f.appendChild(p);f.addEventListener('focusin',function(){p.classList.add('on')})})})();</script>")
if os.path.exists(out): shutil.rmtree(out)
os.makedirs(out)
open(out+'/index.html','w').write(head+s+'</body></html>')
os.makedirs(out+'/fonts',exist_ok=True)
css=open('fonts_t/local.css').read()
for m in _re.findall(r'url\(([^)]+)\)',css):
    fn=os.path.basename(m); shutil.copy('fonts_t/'+m,out+'/fonts/'+fn); css=css.replace(m,fn)
css=css.replace('font-display:block','font-display:swap')
open(out+'/fonts/fonts.css','w').write(css)
shutil.copy('privacy_en.html',out+'/privacy.html')
os.makedirs(out+'/js',exist_ok=True); shutil.copy('vendor/lenis.min.js',out+'/js/lenis.min.js')
files=json.load(open('/tmp/claude-0/-home-claude/a45a2340-2bd1-5ade-9aa0-7c944c85ba5a/scratchpad/ru_files.json'))
for f in files:
    os.makedirs(os.path.dirname(out+'/'+f),exist_ok=True); shutil.copy(f,out+'/'+f)
print('ok',len(files))
