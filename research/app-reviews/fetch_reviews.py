"""Pull recent App Store reviews for second-hand marketplace apps via Apple's public RSS feed."""
import json, time, urllib.request, urllib.parse, pathlib

OUT = pathlib.Path(__file__).parent / "data"
OUT.mkdir(exist_ok=True)

# (label, search term, expected name fragment, countries)
APPS = [
    ("Carousell", "carousell", "carousell", ["sg", "my", "ph", "hk", "tw"]),
    ("OLX", "olx", "olx", ["in", "id"]),
    ("Cashify", "cashify", "cashify", ["in"]),
    ("Cars24", "cars24", "cars24", ["in", "au"]),
    ("Spinny", "spinny", "spinny", ["in"]),
    ("Mercari JP", "mercari", "メルカリ", ["jp"]),
    ("Yahoo Flea Market", "Yahoo!フリマ", "フリマ", ["jp"]),
    ("Karrot", "karrot", "당근", ["kr"]),
    ("Bunjang", "bunjang", "번개장터", ["kr"]),
    ("Gumtree", "gumtree", "gumtree", ["au"]),
    ("Reebelo", "reebelo", "reebelo", ["au", "sg"]),
    ("Mudah", "mudah", "mudah", ["my"]),
]

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))

def find_app(term, frag, cc):
    q = urllib.parse.urlencode({"term": term, "country": cc, "entity": "software", "limit": 10})
    for r in get(f"https://itunes.apple.com/search?{q}")["results"]:
        if frag.lower() in r["trackName"].lower():
            return r["trackId"], r["trackName"]
    return None, None

summary = []
for label, term, frag, ccs in APPS:
    for cc in ccs:
        try:
            app_id, name = find_app(term, frag, cc)
        except Exception as e:
            print("lookup fail", label, cc, e); continue
        if not app_id:
            print("not found", label, cc); continue
        reviews = []
        for page in range(1, 11):
            url = f"https://itunes.apple.com/{cc}/rss/customerreviews/page={page}/id={app_id}/sortby=mostrecent/json"
            try:
                entries = get(url).get("feed", {}).get("entry", [])
            except Exception:
                break
            if isinstance(entries, dict):
                entries = [entries]
            entries = [e for e in entries if "im:rating" in e]
            if not entries:
                break
            for e in entries:
                reviews.append({
                    "rating": int(e["im:rating"]["label"]),
                    "title": e.get("title", {}).get("label", ""),
                    "text": e.get("content", {}).get("label", ""),
                    "date": e.get("updated", {}).get("label", "")[:10],
                })
            time.sleep(0.3)
        (OUT / f"{label.replace(' ', '_')}_{cc}.json").write_text(json.dumps(reviews, ensure_ascii=False), encoding="utf-8")
        dates = sorted(r["date"] for r in reviews)
        summary.append((label, cc, name, len(reviews), dates[0] if dates else "", dates[-1] if dates else ""))
        print(f"{label:18} {cc}  {name[:35]:35} n={len(reviews):4}  {dates[0] if dates else ''} to {dates[-1] if dates else ''}")
