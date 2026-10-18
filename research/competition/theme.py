import json,re
from collections import Counter,defaultdict
R=[json.loads(l) for l in open('teams.jsonl',encoding='utf-8')]
seen=set();U=[]
for r in R:
    k=(r['name'].strip().lower(),r['desc'].strip().lower())
    if k in seen: continue
    seen.add(k);U.append(r)
T={
'Retail & Commerce':"Cartonauts|ShopSphere|Emptiq|Kharidoo|AisleMint|Retail Revoluts|Ananta Studio|PetZonic AI|Ngonaroid|A2A Relay|LeadNova|Cygnus|OnboardIQ|3nity|Lanka Loop|Stock Overflow|CartCue|SellItR8|PayProof Labs|Lekkalu|Brandhints|one utama",
'BFSI':"NestedLoops|Provenance|FinMasters|MarginMaestro|Coupled Weights|Two Bees|RegNexus AI|Zeus Shield|Vigilo|SentinX AML|AlphaShield|PropertyCheck AI|Homely FinHub|Sardaukar|FORGE AI|SemanticBase|Team AegisGov|Kavach AI|RakshaPayKavach|IntelliClaims AI|JAGA|Nusantara Secure|MAXI|Cuan|Kharcha|GemmaFin|Finackers|Risk Theory|+2|game-of-codes|Amex Archons|AI Alchemists|Team Scam Shield|ScamSentinel",
'Manufacturing & Industry':"TRACE|Synthra|ShiftProof|Relay Foundry|Revoryx|Parallax.Ai|Verdant|TorqueShift|TorqueIQ|TorqueMind|Yield Mind AI|MECA Queens|Zero Downtime|Bijak|NEXON LABS|RAGNOVA|Future Tech|Absolute Zero|CortexCraft|Wsidom|ChadGPT|Chengfeng Lab|Logiops.AI|Team Hero|EmoldinoUnited|Cradle to Cradle",
'Media & Content':"Semantic Audio Engine|Cognify|Insightomedia|GhostCursor|Kataribe|BackpackAndJandals|Odyssey|Makerverse|Seoul Cinema|CreatorsHub|CreatorGoose",
'Future of Work / Productivity':"AI Builder – Intelligent Automation|NextGen Architects|Juniper|Agentic Ultron|OceanEd Team|Protocol Mind|Team Core-X|DeepLore|Ease my life|Gen6th|Organa|Neurix|MARS.ai|Go_Builders|Good Company Simulator|DelegateHQ|KAT|Neural nexus|PandaSheild|Bug Busters|VISN|Nexus Prime|Simpul|AutoBots|Alchemist Agent|EkaTantra AI|CogniShield|CognifyOps|ContextOps|AIHustlers|SpinUp Insights|Histic SentinelAI|DeciSync|Team taqelah!|Panic! At the Debug|Team Exception|IntelliForge|Prisma|Lucifer’s Forge|Hyderabad Hackforce|ALIVE|Ripple|Ease my life|Eternauts|Team Beavers_GoggleEye|Wind surfers|ArchSentinel|Agent Forge|AgentForge|The Taskmasters|Workaction|AgenticApex|Neural Forge",
'Sustainability & Social Impact':"Next AI|The Agent Store|TerraMinds|REGEN-X|GreenLedger|Team iPilot|Team RainRecast|Redeemer|Vitalis Network|HotSpot Sentinels|Prana Lab|FurrowMind|Elevate|Team Saathi|PetakAPP|Vokastanauts|Eco-AI-guild|GreenRev|Team Siblings|Tech for Good|Team Xynapse|Afisena Education|Praxis|Exambites|TTKK|CBRAT-MSRUTE|visualize it|EntraGuard|CultivAI|Ground Truth|VeriTrace|SeniorAI|EcoSentinel|GeoGuardian AI|Sustain_withAI|AGRIMA|Nusa Titans|Build3ds|BayaWeaver.AI|Triple-8|HomeStory",
}
names={u['name'] for u in U}
assign={}
for th,s in T.items():
    for n in s.split('|'):
        if n not in names: print('MISSING',n); continue
        assign.setdefault(n,th)
c=Counter(assign.values())
print(c, len(assign))
# substantive defined: has desc with >=8 words and concrete, approximated by assigned & nonempty desc
nonempty=[u for u in U if u['desc'].strip()]
subst_named=[u for u in U if u['name'] in assign and u['desc'].strip()]
print('nonempty',len(nonempty),'assigned w/ desc',len(subst_named),'assigned name-only',len([n for n in assign if not next(u for u in U if u['name']==n)['desc'].strip()]))
