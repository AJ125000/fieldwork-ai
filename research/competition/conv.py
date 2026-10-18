import json, glob, re
out = []
for f in sorted(glob.glob('raw/p*.txt')):
    pg = int(re.search(r'p(\d+)', f).group(1))
    for line in open(f, encoding='utf-8'):
        line = line.rstrip('\n')
        if not line.strip():
            continue
        d, n, desc = line.split('|', 2)
        out.append({"name": n, "date": d + ", 2026", "desc": desc, "page": pg})
with open('teams.jsonl', 'w', encoding='utf-8') as fh:
    for r in out:
        fh.write(json.dumps(r, ensure_ascii=False) + '\n')
from collections import Counter
print(len(out), Counter(r['page'] for r in out))
