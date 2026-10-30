s=open('timekeeper_ru.html').read()
def R(a,b,c=1):
    global s
    n=s.count(a)
    assert n==c, (n,a[:90])
    s=s.replace(a,b)
# fonts with Cyrillic: Hanken Grotesk has none -> Onest
R("family=Hanken+Grotesk:wght@400;500;600","family=Onest:wght@400;500;600")
s=s.replace("'Hanken Grotesk'","'Onest'").replace('"Hanken Grotesk"','"Onest"')
# prices in rubles (pendant: to confirm)
R("{k:'Keychain',p:'$88',","{k:'Keychain',p:'7 777 ₽',")
R("{k:'Pendant',p:'$133',","{k:'Pendant',p:'11 111 ₽',")
R("{k:'Watch',p:'$345',","{k:'Watch',p:'28 888 ₽',")
R("{k:'Painting',p:'$477',","{k:'Painting',p:'44 444 ₽',")
R("const OLD=p=>String(p).replace(/\\d[\\d,]*/g,d=>Math.round(+d.replace(/,/g,'')*1.85).toLocaleString('en-US'));",
  "const OLD=p=>String(p).replace(/\\d[\\d,\\s\\u00a0]*\\d|\\d/g,d=>Math.round(+d.replace(/\\D/g,'')*1.85).toLocaleString('ru-RU'));")
R("const rng=p=>{ const m=String(p).match(/\\d[\\d,]*/g)||['0']; const a=+m[0].replace(/,/g,''), b=+(m[1]||m[0]).replace(/,/g,''); return [a,b] };",
  "const rng=p=>{ const m=String(p).match(/\\d[\\d,\\s\\u00a0]*\\d|\\d/g)||['0']; const a=+m[0].replace(/\\D/g,''), b=+(m[1]||m[0]).replace(/\\D/g,''); return [a,b] };")
R("const money=([a,b])=>'$'+a.toLocaleString('en-US')+(b!==a?'–'+b.toLocaleString('en-US'):'');",
  "const money=([a,b])=>a.toLocaleString('ru-RU')+(b!==a?'–'+b.toLocaleString('ru-RU'):'')+' ₽';")
# product names shown in Russian (the English k stays as the internal key)
R("  const P=[","  const NK={Keychain:'Брелок',Pendant:'Подвеска',Watch:'Часы',Painting:'Картина'}, NKA={Keychain:'брелок',Pendant:'подвеску',Watch:'часы',Painting:'картину'};\n  const P=[")
R("imgs:[[I('keychain-main'),'Keychain']]","imgs:[[I('keychain-main'),'Брелок']]")
R("(f.dev?'<em class=\"devb\">In development</em>':'')+'<span>'+f.k+'</span>'","(f.dev?'<em class=\"devb\">В разработке</em>':'')+'<span>'+NK[f.k]+'</span>'")
R("$('pBtn').textContent='Reserve the '+f.k.toLowerCase(); $('pBuy').textContent=(f.dev?'Pre-order the ':'Buy the ')+f.k.toLowerCase();",
  "$('pBtn').textContent='Забронировать '+NKA[f.k]; $('pBuy').textContent=(f.dev?'Предзаказ':'Купить '+NKA[f.k]);")
import re
m=re.search(r"\$\('pName'\)\.textContent=f\.k;",s); assert m
s=s.replace("$('pName').textContent=f.k;","$('pName').textContent=NK[f.k];")
R("const lname=l=>{ const f=P[l.i]; return f.k+(f.vars?' · '+f.vars[l.v].n:'')+(f.dev?' · pre-order':'') };",
  "const lname=l=>{ const f=P[l.i]; return NK[f.k]+(f.vars?' · '+f.vars[l.v].n:'')+(f.dev?' · предзаказ':'') };")
R("<div class=\"nm\"><b>'+f.k+'</b>","<div class=\"nm\"><b>'+NK[f.k]+'</b>")
R("+(f.dev?' · pre-order':'')+'</span></div>","+(f.dev?' · предзаказ':'')+'</span></div>")
R("aria-label=\"Add '+f.k+'\"><img class=\"fi\" src=\"'+TH(f.imgs[0][0])+'\" alt=\"\">'+'<b>'+f.k+'</b>","aria-label=\"Добавить: '+NK[f.k]+'\"><img class=\"fi\" src=\"'+TH(f.imgs[0][0])+'\" alt=\"\">'+'<b>'+NK[f.k]+'</b>")
R("img.alt=P[i].k+', вид 360°","img.alt=NK[P[i].k]+', вид 360°")
# notes under the product
R("'<span>Free reservation'+QB(T_FREE)+'</span><span>Delivery'+QB(T_DEL)+'</span>'+(bat?'<span>Battery'+QB(T_BAT)+'</span>':'')",
  "'<span>Бесплатная бронь'+QB(T_FREE)+'</span><span>Доставка'+QB(T_DEL)+'</span>'+(bat?'<span>Батарея'+QB(T_BAT)+'</span>':'')")
R('T_FREE="Reserving is free and not binding. We send a message to your email, and the moment counting on this page becomes yours. It is held for 10,000,000 seconds, about 116 days: buy and connect your Time Keeper before then, or the moment disappears."',
  'T_FREE="Бронь бесплатная и ни к чему не обязывает. Мы пришлём письмо на почту, и момент, который считается на этой странице, станет твоим. Он держится 10 000 000 секунд, примерно 116 дней: успей купить и подключить свой Time Keeper, иначе момент исчезнет."')
R('T_DEL="Standard delivery. We will email you the dates before shipping."','T_DEL="Стандартная доставка. Сроки пришлём на почту перед отправкой."')
R('T_BAT="One charge lasts about a month. When you charge it, it syncs with your moment, so no second is lost. Water protection is minimal, so keep it away from water."',
  'T_BAT="Одного заряда хватает примерно на месяц. Во время зарядки он синхронизируется с твоим моментом, так что ни одна секунда не теряется. Защита от воды минимальная, так что береги его от воды."')
s=s.replace('aria-label="More about this"','aria-label="Подробнее"')
R("n.endsWith('Gold')","n.endsWith('Золото')")
# reservation messages
R("$('pOk').textContent='Reserved: '+f+'. Your moment: '+startStr()+'. It is held for '+held()+' more seconds. A message is on its way to your email'",
  "$('pOk').textContent='Забронировано: '+f+'. Твой момент: '+startStr()+'. Он держится ещё '+held()+' секунд. Письмо уже летит к тебе на почту'")
R("$('mOk').textContent='Reserved. Your moment: '+startStr()+'. It is held for '+left.toLocaleString('en-US')+' more seconds. A message is on its way to your email'",
  "$('mOk').textContent='Забронировано. Твой момент: '+startStr()+'. Он держится ещё '+left.toLocaleString('ru-RU')+' секунд. Письмо уже летит к тебе на почту'")
R("const D=P[dev], f=[D.k].concat(","const D=P[dev], f=[NK[D.k]].concat(")
R("return left.toLocaleString('en-US') };","return left.toLocaleString('ru-RU') };")
R("t.textContent='Thank you, '+name+'. Your request is sent: '+item+'. We will write to '+email+' with the final price, delivery and a secure payment link.';",
  "t.textContent='Спасибо, '+name+'. Заявка отправлена: '+item+'. Мы напишем на '+email+' с итоговой ценой, доставкой и безопасной ссылкой на оплату.';")
R("ok.textContent='Done';","ok.textContent='Готово';")
R("+(gift?' · Gift':'')","+(gift?' · Подарок':'')")
R(".replace('Total','')",".replace('Итого','')")
R("'<span>Total</span>'","'<span>Итого</span>'")
# hints for the counting modes
R("'<span class=\"one\">Every second you have lived, from 0 to now. Enter your birth date</span>'","'<span class=\"one\">Каждая секунда твоей жизни, с рождения до сейчас. Укажи дату рождения</span>'")
# dates and numbers
R("d.toLocaleDateString('en-GB',{month:'long'})","d.toLocaleDateString('ru-RU',{month:'long',day:'numeric'}).replace(/^\\d+\\s*/,'')")
R("const fmt=n=>Math.floor(n).toLocaleString('en-US');","const fmt=n=>Math.floor(n).toLocaleString('ru-RU');")
R("['January','February','March','April','May','June','July','August','September','October','November','December']","['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']")
R("const MONTH=t=>new Date(t).toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'UTC'});","const MONTH=t=>{ const s=new Date(t).toLocaleDateString('ru-RU',{month:'long',year:'numeric',timeZone:'UTC'}).replace(' г.',''); return s[0].toUpperCase()+s.slice(1) };")
R("const MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];","const MO=['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];")
R("const fmtD=d=>d.toLocaleDateString('en-US',{month:'short',year:'numeric',timeZone:'UTC'});","const fmtD=d=>MO[d.getUTCMonth()]+' '+d.getUTCFullYear();")
R("'Video · 0:'","'Видео · 0:'")

R("$('rsvBtn').textContent='Reserving…';","$('rsvBtn').textContent='Бронируем…';")
R("$('rsvBtn').textContent='Reserved';","$('rsvBtn').textContent='Забронировано';")
R("$('spinLoad').textContent='Loading 360°';","$('spinLoad').textContent='Загрузка 360°';")
R("const meta=e.mine?'':' · 3 photos · 1 video';","const meta=e.mine?'':' · 3 фото · 1 видео';")
R("(isV?'video':'photo '+(boxI+1)+' of 3')","(isV?'видео':'фото '+(boxI+1)+' из 3')")
R("(j===3?'Video':'Photo '+(j+1))","(j===3?'Видео':'Фото '+(j+1))")
R("$('llStore').textContent='Loading…';","$('llStore').textContent='Загрузка…';")
R("(k===0?'My moment':'')","(k===0?'Мой момент':'')")
s=s.replace("(j<3?'Photo '+(j+1):'Video')","(j<3?'Фото '+(j+1):'Видео')")
# Russian hyphenation and language
R("<title>Time Keeper</title>","<title>Time Keeper RU</title>\n<script>document.documentElement.lang='ru'</script>")
open('timekeeper_ru.html','w').write(s)
print('ok')
