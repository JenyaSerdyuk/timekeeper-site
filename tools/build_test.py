
import re
s=open('/home/claude/timekeeper.html').read()
s=re.sub(r'src="https://[^"]*lenis[^"]*"','src="lenis.min.js"',s)
s=re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^"]*">','<link rel="stylesheet" href="fonts_t/local.css">',s)
open('/home/claude/tk_test.html','w').write('<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'+s+'</body></html>')
