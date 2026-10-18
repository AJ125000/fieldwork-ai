import json,re
from collections import Counter
R=[json.loads(l) for l in open('teams.jsonl',encoding='utf-8')]
seen=set();U=[]
for r in R:
    k=(r['name'].strip().lower(),r['desc'].strip().lower())
    if k in seen: continue
    seen.add(k);U.append(r)
print('raw',len(R),'dedup',len(U),'dupnames',len(U)-len({u['name'].lower() for u in U}))
empty=[u for u in U if not u['desc'].strip()]
print('empty',len(empty))
tags={
'manufacturing':r'manufactur|factory|factories|industrial|wafer|semiconductor|fab\b|predictive maintenance|ECU|automotive|supply (chain|disruption)|inventory|logistic|vehicle',
'bfsi':r'BFSI|bank|fraud|financ|fintech|payment|insurance|claims|lending|risk|AML|margin|invoice|UPI|regulat|compliance|money|accounting|investment',
'retail':r'retail|commerce|shop|buyer|seller|merchant|market|basket|purchase|buying|store|cart|CartCue|Kharidoo|brand|MSME|small business|vendor|mall|aisle',
'media':r'video|ads\b|content|creator|media|music|audio|film|story|cinema',
'future_of_work':r'productivity|workflow|enterprise|devops|developer|onboarding|incident|documentation|workplace|knowledge|toil|future of work|automat|copilot|SRE|on-call|engineering',
'sustain':r'sustainab|climate|flood|disaster|social impact|farm|agri|environment|carbon|energy|green|health|education|learn|underprivileged|elder|community|relief|evacue|accessib|vocational|school|edtech',
}
for t,p in tags.items():
    m=[u['name'] for u in U if re.search(p,u['name']+' '+u['desc'],re.I)]
    print(t,len(m))
kw={'agent':r'agent','multimodal':r'multimodal','RAG':r'\bRAG\b|retriev','Gemini':r'gemini','ADK':r'\bADK\b','Vertex':r'vertex','Cloud Run':r'cloud run','Google Cloud/GCP':r'google cloud|\bGCP\b','Veo':r'\bveo\b','human-in-the-loop':r'human.in.the.loop|human-approved|human decides|human in','Claude':r'claude','knowledge graph':r'knowledge graph|graph','voice':r'voice|audio','explainable':r'explainab|evidence|traceab|audit|provenance'}
for k,p in kw.items():
    print(k,sum(1 for u in U if re.search(p,u['name']+' '+u['desc'],re.I)))
# countries/univ
geo={'India/Bharat':r'india|bharat|indian|bengaluru|bangalore|pune|hyderabad|uttarakhand|desi','Indonesia':r'indonesia|bahasa|yogya|BRI\b|nusantara|jakarta|JKT|telkom|KEMNAKER|DPD RI|nusa','Singapore/Malaysia':r'singapor|malaysia|msia|sunway|\bNUS\b','Japan':r'japan|tokyo|japanese','Pakistan':r'pakistan','Nepal':r'nepal','Myanmar':r'burmese|myanmar','Philippines':r'cebu','Sri Lanka':r'lanka','Switzerland':r'swiss','APAC/JAPAC':r'japac|apac|asia','IIT/IIM etc':r'\bIIT|IIM|monash|university|student|school mates|freshmen'}
for k,p in geo.items():
    print(k,[u['name'] for u in U if re.search(p,u['name']+' '+u['desc'],re.I)])
