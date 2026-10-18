"""Tag negative App Store reviews with complaint themes using multilingual keyword rules."""
import json, pathlib, random, re, sys
from collections import defaultdict

DATA = pathlib.Path(__file__).parent / "data"

THEMES = {
    "scam": ["scam", "fraud", "phishing", "cheat", "swindl", "fake buyer", "fake seller", "fake account",
             "fake profile", "fake link", "conman", "penipu", "tipu", "詐欺", "사기", "騙", "詐騙", "骗"],
    "item_mismatch": ["not as described", "different from", "not same as", "wrong item", "counterfeit", "replica",
                      "not original", "fake product", "fake item", "fake phone", "defect", "damaged", "broken",
                      "not working", "doesn't work", "does not work", "scratch", "faulty", "poor condition",
                      "palsu", "rosak", "説明と違", "偽物", "傷", "壊れ", "故障", "不良", "가품", "짝퉁", "하자",
                      "고장", "파손", "假貨", "瑕疵", "損壞"],
    "refund_dispute": ["refund", "return", "dispute", "money back", "chargeback", "not received", "never received",
                       "didn't receive", "did not receive", "bayaran balik", "返金", "返品", "補償", "환불", "반품",
                       "분쟁", "退款", "退貨"],
    "support": ["customer service", "customer support", "customer care", "support", "helpline", "no response",
                "no reply", "chatbot", "call center", "客服", "サポート", "事務局", "問い合わせ", "運営",
                "고객센터", "상담", "문의"],
    "account_ban": ["banned", " ban ", "suspend", "deactivat", "blocked", "account locked", "停止", "凍結",
                    "利用制限", "정지", "차단", "停權", "封鎖"],
    "off_platform_pay": ["bank transfer", "qr code", "whatsapp", "payment link", "outside the app", "upi"],
    "fees": ["fee", "commission", "service charge", "手数料", "수수료", "手續費"],
    "price_cut": ["lowball", "low price", "price drop", "reduced the price", "reduce the price", "quoted",
                  "valuation", "less price", "final price", "deducted"],
    "app_bugs": ["crash", "bug", "lag", "slow", "glitch", "login", "log in", "otp", "error", "バグ", "落ち",
                 "重い", "오류", "버그", "閃退", "當機"],
}
TRUST = ("scam", "item_mismatch", "refund_dispute")

def tags(text):
    t = f" {text.lower()} "
    return {k for k, kws in THEMES.items() if any(kw in t for kw in kws)}

rows, samples = [], defaultdict(list)
tot = defaultdict(lambda: defaultdict(int))
for f in sorted(DATA.glob("*.json")):
    revs = json.loads(f.read_text(encoding="utf-8"))
    neg = [r for r in revs if r["rating"] <= 2]
    counts = defaultdict(int)
    for r in neg:
        tg = tags(r["title"] + " " + r["text"])
        for k in tg:
            counts[k] += 1
            if len(samples[k]) < 400:
                samples[k].append((f.stem, (r["title"] + " | " + r["text"])[:170].replace("\n", " ")))
        if tg & set(TRUST):
            counts["TRUST_ANY"] += 1
    rows.append((f.stem, len(revs), len(neg), counts))

hdr = ["app_cc", "n", "neg%"] + list(THEMES) + ["TRUST_ANY"]
print("\t".join(hdr))
for stem, n, nn, c in rows:
    pct = lambda k: f"{100*c[k]/nn:.0f}" if nn else "-"
    print("\t".join([stem, str(n), f"{100*nn/n:.0f}"] + [pct(k) for k in THEMES] + [pct("TRUST_ANY")]))

N = sum(r[1] for r in rows); NN = sum(r[2] for r in rows)
agg = defaultdict(int)
for *_, c in rows:
    for k, v in c.items():
        agg[k] += v
print(f"\nALL\tn={N}\tneg={NN} ({100*NN/N:.0f}%)\t" + "  ".join(f"{k}={100*agg[k]/NN:.0f}%" for k in list(THEMES) + ["TRUST_ANY"]))

if "--samples" in sys.argv:
    random.seed(1)
    for k in sys.argv[2:]:
        print(f"\n== {k}")
        for s in random.sample(samples[k], min(6, len(samples[k]))):
            print(" -", s[0], ":", s[1])
