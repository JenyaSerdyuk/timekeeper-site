import re, json
from ru_dict import H, J
H['Country']='Страна'
s=open('timekeeper.html').read()

# ---- 1. the SH label map for exploded views: English keys stay, Russian values
SH_RU={'Back cover':'Задняя крышка','Back plate':'Задняя пластина','Battery':'Батарея','Brushed steel face':'Стальная панель','Brushed steel panel':'Стальная панель','Crystal':'Стекло','Dial · LED counter':'Циферблат · счётчик','Front panel':'Передняя панель','Gold case':'Золотой корпус','Gold face':'Золотая панель','Hands':'Стрелки','Keypad':'Клавиатура','LCD · LED display':'Дисплеи','Logic board':'Плата','Polished bezel':'Безель','Protective glass':'Стекло','Red LED display':'LED-дисплей','Screws':'Винты','Side button':'Боковая кнопка','Steel case':'Стальной корпус','Steel case · bail':'Корпус · ушко','Steel case · bracelet':'Корпус · браслет','Steel frame':'Стальная рамка'}
old=re.search(r"const SH=\{[^}]*\}",s).group(0)
s=s.replace(old,'const SH='+json.dumps(SH_RU,ensure_ascii=False).replace('"',"'"))

# ---- 2. split into script / non-script parts
parts=re.split(r'(<script[^>]*>.*?</script>|<style[^>]*>.*?</style>)',s,flags=re.S)
miss=set()
def tr_html(chunk):
    # attributes
    def attr(m):
        k,q,v=m.group(1),m.group(2),m.group(3)
        if v in H: return f'{k}={q}{H[v]}{q}'
        if re.search('[A-Za-z]{3}',v): miss.add('@'+v)
        return m.group(0)
    chunk=re.sub(r'\b(placeholder|aria-label|alt|title|data-q)=(["\'])(.*?)\2',attr,chunk)
    # text nodes
    def txt(m):
        t=m.group(1); st=t.strip()
        if not st or not re.search('[A-Za-z]{2}',st): return m.group(0)
        if st in H:
            tr=H[st]; t2=t.replace(st,tr)
            if tr[:1] in ',.': t2=t2.lstrip()
            return '>'+t2+'<'
        miss.add('T:'+st); return m.group(0)
    return re.sub(r'>([^<>]+)<',txt,chunk)
def tr_js(chunk):
    if 'const SH=' in chunk:
        a,b=chunk.split('const SH=',1); sh,rest=b.split('}',1)
        return tr_js(a)+'const SH='+sh+'}'+tr_js(rest)
    def lit(m):
        v=m.group(1)
        return "'"+J[v]+"'" if v in J else m.group(0)
    return re.sub(r"'((?:[^'\\\n]|\\.)*)'",lit,chunk)
out=[]
for p in parts:
    if p.startswith('<script') and 'src=' not in p.split('>')[0]: out.append(tr_js(p))
    elif p.startswith('<script') or p.startswith('<style'): out.append(p)
    else: out.append(tr_html(p))
s=''.join(out)
open('timekeeper_ru.html','w').write(s)
print('untranslated:'); [print(' ',x[:120]) for x in sorted(miss)]
