import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from "recharts";
import { CheckCircle, Circle, ChevronDown, ChevronUp, Trophy, AlertTriangle, XCircle, StopCircle, Download, Upload, BookOpen, Target, TrendingUp, Calendar } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const DAYS = [
  { id:1,  week:1, title:"Lay the Foundation",              topic:"Ch.2 What is the UK? + Ch.1 Values",          time:"45–60 min",
    tasks:["Read Chapter 2 of Master Summary: 4 nations, capitals, patron saints, national flowers, Union Flag, Crown dependencies","Read Chapter 1 of Master Summary: British values, rights & responsibilities, who takes the test","Write from memory: all 4 nations, capitals, patron saints and dates — then check","Do 1 practice test at britizen.uk or lifeintheuktestweb.co.uk"],
    tips:["England=London=St George=23 Apr | Scotland=Edinburgh=St Andrew=30 Nov","Wales=Cardiff=St David=1 Mar | N.Ireland=Belfast=St Patrick=17 Mar","Great Britain = England+Scotland+Wales (NOT N.Ireland)","Union Flag does NOT represent Wales"],
    reflect:["Can you name all 4 capitals without looking?","Can you name all 4 patron saints and dates?","What's the difference between Great Britain and the UK?"] },
  { id:2,  week:1, title:"Ancient & Medieval Britain",       topic:"Ch.3: Romans → 1066",                         time:"45–60 min",
    tasks:["Read Ch.3 section: Stone Age → Romans → Anglo-Saxons → Vikings → Battle of Hastings","Write from memory: Julius Caesar (55BC), Claudius (43AD), Hadrian's Wall (122AD), Romans leave (410AD), Hastings (1066)","Write: St Augustine, St Columba, Alfred the Great, William the Conqueror, Domesday Book","Do 1 practice test"],
    tips:["Julius Caesar 55 BC = visited, did NOT conquer. Claudius 43 AD = conquered","Hadrian's Wall 122 AD — kept out the Picts (Scottish tribes)","The word 'England' comes from 'Englaland' — land of the Angles","Magna Carta = 1215. Limited royal power. Basis of rule of law"],
    reflect:["What's the difference between Caesar's visits and the Roman Conquest?","What does 'Danelaw' mean?","What year was the Magna Carta and what did it do?"] },
  { id:3,  week:1, title:"From 1066 to the Tudors",          topic:"Ch.3: Middle Ages → Wars of the Roses → Henry VIII", time:"45–60 min",
    tasks:["Read Ch.3: Magna Carta → Black Death → Wars of the Roses → Henry VIII","Memorise Henry VIII's 6 wives in order: Divorced/Beheaded/Died/Divorced/Beheaded/Survived","Write from memory: 1215, 1348, 1381, 1415, 1474, 1485, 1534","Note the difference: Magna Carta (1215) vs Bill of Rights (1689)","Do 1 practice test"],
    tips:["6 wives: Catherine of Aragon, Anne Boleyn, Jane Seymour, Anne of Cleves, Catherine Howard, Catherine Parr","Act of Supremacy 1534 = Henry made head of Church of England = English Reformation","Wars of the Roses: Lancaster (red) vs York (white) 1455–1485","Henry VII won Battle of Bosworth Field 1485 = Tudor dynasty begins"],
    reflect:["Name Henry VIII's 6 wives in order without looking","What did the Act of Supremacy (1534) do?","What ended the Wars of the Roses?"] },
  { id:4,  week:1, title:"Stuarts, Civil War & Glorious Revolution", topic:"Ch.3: Elizabeth I → Stuarts → 1689", time:"45–60 min",
    tasks:["Read Ch.3: Elizabeth I → Spanish Armada → James I → Civil War → Restoration → Glorious Revolution","Memorise: 1588, 1605, 1642, 1649, 1666, 1679, 1688, 1689","Know: Habeas Corpus Act 1679 — forbade unlawful imprisonment","Know: Cromwell = Lord Protector; republic 1649–1660","Do 1 practice test"],
    tips:["1588 = Spanish Armada defeated (Drake helped). 1605 = Gunpowder Plot (Guy Fawkes)","1649 = Charles I EXECUTED. Only monarch executed","1666 = Great Fire of London. Wren rebuilt St Paul's Cathedral","1688 = Glorious Revolution (EVENT). 1689 = Bill of Rights (DOCUMENT)"],
    reflect:["What happened in 1649?","What is the Glorious Revolution?","What did the Bill of Rights (1689) establish?"] },
  { id:5,  week:1, title:"Enlightenment & Industrial Revolution", topic:"Ch.3: 1707 → Victorian Era", time:"45–60 min",
    tasks:["Read Ch.3: Act of Union 1707 → Enlightenment → Industrial Revolution → Slavery abolition → Trafalgar/Waterloo","Memorise: Adam Smith, James Watt, Richard Arkwright, George & Robert Stephenson, Isambard Kingdom Brunel","Know: 1807 (Slave Trade Act) vs 1833 (Emancipation Act). William Wilberforce campaigned","Know: 1805 (Trafalgar, Nelson dies) and 1815 (Waterloo, Wellington wins)","Do 1 practice test"],
    tips:["Arkwright = water frame / factory system. Watt = steam engine. DO NOT swap","Stephensons = railways (Stockton–Darlington 1825). Brunel = bridges + ships","1807 = trading slaves abolished. 1833 = slavery itself abolished in Empire","1707 = Act of Union. England + Scotland = Kingdom of Great Britain"],
    reflect:["What did Richard Arkwright invent (NOT the steam engine)?","Difference between 1807 and 1833 slavery acts?","What happened in 1707?"] },
  { id:6,  week:1, title:"WEEKEND: Victorian Era to Post-War",  topic:"Ch.3: Victorian → WWI → WWII → 1948", time:"2–3 hours",
    tasks:["Read Ch.3: Victorian → Suffragettes → WWI → 1920s-30s → WWII","Memorise: 1914 (WWI), 1918 (ends + women 30+ vote), 1921 (Ireland divided), 1928 (equal vote), 1939 (WWII), 1945 (VE Day 8 May), 1948 (NHS)","Know: Emmeline Pankhurst = suffragettes. Florence Nightingale = Crimean War (NOT WWI/II)","Know: Churchill = WWII PM from May 1940. Attlee = post-war PM who created NHS","Do 3 practice tests with breaks between each"],
    tips:["Nightingale = Crimean War (1853–56). NOT WWI. Very common trap","Attlee created the NHS 1948 — NOT Churchill","Windrush generation 1948 = Caribbean immigrants invited to help rebuild","Beveridge Report = blueprint for welfare state"],
    reflect:["Who was PM during WWII? Who created the NHS?","When did women get equal voting rights? (1928, age 21)","What is the Beveridge Report?"] },
  { id:7,  week:1, title:"WEEKEND: Chapter 4 & 5 First Read", topic:"Ch.4 Society + Ch.5 Government/Law", time:"2–3 hours",
    tasks:["Read all of Chapter 4: religion, customs/dates, sport, arts, famous Britons, places of interest","Read all of Chapter 5: Constitution, Parliament, PM + Cabinet, devolution, courts, voting","Memorise the courts table: England/Wales/NI vs Scotland","Memorise: 12 (Eng/Wales/NI jury) vs 15 (Scotland jury) — Scotland also has 'not proven'","Memorise small claims: £5,000 Eng/Wales vs £3,000 Scotland/NI","Do 2 practice tests"],
    tips:["Scottish Parliament = 129 MSPs. Welsh Assembly = 60 AMs. NI Assembly = 90 MLAs","RESERVED to Westminster: defence, foreign affairs, immigration, taxation, social security","10 Downing Street = PM residence. Chequers = PM country house","Old Bailey = most famous criminal court in the world (London)"],
    reflect:["How many MSPs / AMs / MLAs?","Which powers are reserved to Westminster?","What is the PM's official address and country house?"] },
  { id:8,  week:2, title:"Re-read Weak Areas + 3 Tests",      topic:"Focus on your Week 1 error log",            time:"45–60 min",
    tasks:["Look at your Week 1 tracker — identify your 3 weakest topic areas","Re-read those specific sections in the Master Summary (10–15 mins max)","Do 3 × 24-question practice tests with 5-min breaks","After each test: immediately note wrong answers by topic"],
    tips:["Use britizen.uk for chapter-specific practice tests","If a topic comes up wrong twice: re-read that section before your next test","The act of testing — not reading — is what builds memory","Week 2 target: consistently hitting 70%+ (17/24)"],
    reflect:["Are you seeing the same wrong answers repeatedly?","Record all 3 scores and calculate your average","Compare to Week 1 average — are you improving?"] },
  { id:9,  week:2, title:"Courts, Government & Devolution",    topic:"Chapter 5 intensive",                        time:"45–60 min",
    tasks:["Re-read Chapter 5 courts table in Master Summary (10 mins)","Write from memory: all courts for England/Wales/NI vs Scotland (criminal + civil)","Write from memory: jury sizes, small claims limits, who can vote in what election","Do 3 × 24-question tests, noting specifically which Ch.5 questions you miss"],
    tips:["Scotland: Sheriff Court (serious criminal + civil). High Court of Justiciary (murder etc)","NI minor courts: District Judge (paid, legally qualified) — NOT unpaid magistrates","Magistrates in England/Wales/Scotland = UNPAID, no legal qualification needed","Who can vote in General Elections: UK citizens + Irish + qualifying Commonwealth (NOT other EU)"],
    reflect:["Which court hears murder in Scotland? (High Court of Justiciary)","What makes NI courts different to England? (District Judges, paid and qualified)","Can EU citizens vote in UK General Elections? (No — only local/EU elections)"] },
  { id:10, week:2, title:"History Blitz — All Key Dates",      topic:"Chapter 3 date mastery",                    time:"45–60 min",
    tasks:["Write ALL key dates from memory. Check against Master Summary","Any date you got wrong: write it 5 times and create a memory hook","Do 3 × 24-question tests","Focus especially on: 1066, 1215, 1534, 1649, 1689, 1707, 1918, 1928, 1939, 1945, 1948"],
    tips:["1649: Charles I executed → 1665: Great Plague → 1666: Great Fire → 1688: Glorious Revolution → 1689: Bill of Rights","1707: Act of Union (Scotland+England) → 1801: Ireland joins (full UK)","1918: women 30+ vote, WWI ends → 1928: women vote equally → 1939: WWII → 1945: ends → 1948: NHS","Habeas Corpus 1679 ≠ Bill of Rights 1689. They do different things"],
    reflect:["What happened in 1689 vs 1679 vs 1707?","Difference between 1807 and 1833 slavery acts?","What year did women first get the vote? (1918, age 30+)"] },
  { id:11, week:2, title:"Famous Britons & Culture",           topic:"Chapter 4 names + achievements",             time:"45–60 min",
    tasks:["Study Famous Britons table: cover right column, recall achievements for each name","Most confused pairs to drill: Arkwright vs Watt, Stephenson vs Brunel, Austen vs Hardy","Do 3 × 24-question tests","Note any Famous Britons questions you got wrong"],
    tips:["Sake Dean Mahomet: first curry house in Britain + introduced shampooing","Tim Berners-Lee: World Wide Web. Alan Turing: computing + Enigma codebreaker","Rudyard Kipling = Nobel Prize for Literature 1907. Also wrote The Jungle Book","Roald Dahl = Welsh author. Arthur Conan Doyle = Scottish author"],
    reflect:["What did Isambard Kingdom Brunel build? (GWR, Clifton Bridge, SS Great Britain — NOT steam engine)","Who discovered penicillin and when? (Alexander Fleming, 1928)","What did Sake Dean Mahomet do?"] },
  { id:12, week:2, title:"Full Mixed-Chapter Tests",           topic:"All 5 chapters mixed",                      time:"45–60 min",
    tasks:["Do 3 full 24-question tests — NO pre-reading today","After all 3: identify which CHAPTER most wrong answers come from","Spend final 20 mins re-reading that chapter in the Master Summary"],
    tips:["If scoring 75%+ on all 3 tests — you're on track. Week 3 will push you to 85%","If still below 70%: add an extra 20-min session on your weakest chapter","The real test is reportedly slightly easier than most online practice tests","You should now have completed ~25 practice tests. Patterns are forming"],
    reflect:["What's your average score across Days 8–12?","Is your error list getting shorter?","Which chapter is still your weakest?"] },
  { id:13, week:2, title:"WEEKEND: Mock Marathon",             topic:"All chapters — simulated conditions",        time:"3 hours",
    tasks:["Do 6 × 24-question tests with 5-min breaks between each","Tests 1–3: take them normally","After test 3: review all wrong answers (15 mins)","Tests 4–6: apply what you just reviewed","Record all 6 scores. Calculate average."],
    tips:["Average 78%+ across 6 tests = Week 2 going well","Any individual test below 65%? That topic area is Week 3's priority","Write down your single most common wrong-answer topic and circle it","If scoring 80%+: you could book the test now as a worst case"],
    reflect:["Your average across 6 tests today is more telling than any single score","Are you still getting the same things wrong? That pattern IS the data","Week 2 overall average so far?"] },
  { id:14, week:2, title:"WEEKEND: Targeted Weak Area Review", topic:"Error log topics + 4 tests",                time:"2–3 hours",
    tasks:["Take your error log from this week. List the top 3 wrong topics","Re-read ONLY those sections in the Master Summary (30 mins total)","Do 4 × 24-question tests. After each: did targeted topics improve?","Finish by re-reading the High-Risk Topics Checklist in the Master Summary"],
    tips:["Calculate your Week 2 overall average across all days","If Week 2 average 75%+: Week 3 will get you test-ready","If Week 2 average 65–74%: spend extra Week 3 time on the weakest chapter","You should now have done ~35 practice tests total"],
    reflect:["Week 2 average score?","Top 3 weak topics going into Week 3?","If your lowest test this week was still 75%+ — you can pass right now"] },
  { id:15, week:3, title:"Timed Mocks Begin",                  topic:"Full 45-minute simulations",                time:"45–60 min",
    tasks:["Set a timer: 45 minutes. Do 2 × 24-question TIMED mocks","No pausing, no checking answers during the test — exactly like the real exam","After each test: review every wrong answer","Re-read error log: which topics are STILL coming up?"],
    tips:["85% = 20.4 questions, so you need 21/24 or better consistently to feel safe","You have nearly 2 minutes per question. Don't rush. Read carefully","Being timed should not change your approach — you've done this dozens of times","The real test costs £50 to resit. Be sure before you book"],
    reflect:["Did the timer affect you? If rushing: slow down deliberately","Score on both timed mocks?","Target for this mock: 82%+"] },
  { id:16, week:3, title:"Timed Mocks + Error Focus",          topic:"Continued timed practice",                  time:"45–60 min",
    tasks:["Re-read sections corresponding to yesterday's wrong answers (15 mins)","Do 2 × 24-question timed mocks","After each: check against the Master Summary High-Risk Topics Checklist"],
    tips:["If hitting 85%+ on both mocks: you're on track. Keep the same approach","If below 80%: spend an extra 20 mins on the chapter causing the most errors","Stable improvement is the sign of genuine learning. A single dip is not a crisis","Check Henry VIII wives, patron saints, court distinctions — highest risk areas"],
    reflect:["Are scores stable or improving day-on-day?","Running Week 3 average so far?","Any topic still appearing in wrong answers?"] },
  { id:17, week:3, title:"Timed Mocks — Consistency Check",   topic:"Building a streak",                         time:"45–60 min",
    tasks:["Do 2 × 24-question timed mocks","After both tests: check scores against your running Week 3 average","Review ONLY wrong answers — do not re-read entire chapters","Drill: Henry VIII wives, patron saints, court distinctions, key dates"],
    tips:["Running average after Days 15–17: if 84%+ you are on pace","If 78–83%: add an extra 30-min session each day in Days 18–19","You now know this material. The last step is confidence and pattern recognition","Check: do you know that Scotland's jury has 15, not 12?"],
    reflect:["Running average across Days 15–17?","Are you still making the same mistakes as Week 1?","What's your single most persistent wrong-answer topic?"] },
  { id:18, week:3, title:"Timed Mocks + Memorisation Drills",  topic:"Names, dates, numbers",                     time:"45–60 min",
    tasks:["15 mins: cover and recall each row of the Key Dates table from memory","Write: all 6 Henry VIII wives, all court distinctions, all jury sizes, all devolution member counts","Do 2 × 24-question timed mocks","Run through the High-Risk Checklist. Tick items you're confident on. Circle unsure ones."],
    tips:["Courts: Magistrates (Eng/Wales/NI) = unpaid. JPs = unpaid. District Judge (NI) = paid","Scotland small claims = £3,000. England/Wales = £5,000. NI = £3,000","Devolution: Scotland 129 MSPs / Wales 60 AMs / NI 90 MLAs","Council of Europe ≠ European Union. Council of Europe does the ECHR"],
    reflect:["Any checklist items still not 100% certain? Focus on those tomorrow","Running 3-week average so far?","How many questions (out of 24) are you getting wrong consistently?"] },
  { id:19, week:3, title:"Final Timed Mocks — Pre-Marathon",   topic:"Confidence building",                       time:"45–60 min",
    tasks:["Review your circled checklist items from Day 18 (10 mins only)","Do 2 × 24-question timed mocks","Calculate your Week 3 running average (Days 15–19)","If running average 85%+: you are ready for the weekend final assessment"],
    tips:["If average 85%+: weekend is your confirmation. Book the test for next week","If average 80–84%: still achievable but push harder this weekend","If below 80%: consider whether you need a 4th week — that is fine, not a failure","The real test is reportedly slightly easier than practice tests"],
    reflect:["Week 3 running average?","Overall 3-week average?","Are you ready for the Mock Marathon tomorrow?"] },
  { id:20, week:3, title:"THE MOCK MARATHON — Final Assessment", topic:"8 timed mocks: your readiness test",     time:"~4 hours",
    tasks:["Do 8 × 24-question TIMED mocks. 45 mins each. 10–15 min breaks.","Tests 1–4: DO NOT review answers between tests","After test 4: review wrong answers (20 mins). Then do tests 5–8","Record every score. Calculate average across all 8."],
    tips:["Average 85%+ across all 8 = READY. Book the test for next week","Average 80–84%: borderline. One more focused week OR book and accept some risk","Average below 80%: do not book yet. Give the weakest chapter more time","If your LOWEST test was still 75%+ (18/24): you'd pass even on a bad run"],
    reflect:["8-test average today?","Lowest single test? Highest?","If your lowest test is 18+/24: that's the pass mark. You can handle a bad day"] },
  { id:21, week:3, title:"Final Review — Error Log & Rest",    topic:"Light day: consolidate only",               time:"1–1.5 hours",
    tasks:["Review error log from all 3 weeks. What still appears?","Spend 30–40 mins re-reading ONLY those topics in the Master Summary","Go through the High-Risk Checklist one final time — cover and recall","STOP studying by mid-afternoon. Rest. Do not cram tonight."],
    tips:["Your brain needs rest to consolidate everything learned","Remind yourself: you have done 40+ practice tests. The material is there","Test day: arrive 30 min early. Bring booking reference + valid photo ID","No phones, smart watches, bags or notes allowed in the test room"],
    reflect:["You are ready. Everything you need is already in your head.","Test day tip: 45 mins / 24 questions = nearly 2 mins per question. Don't rush.","Results are given immediately after the test ends"] },
];

const BAND = (score) => {
  if (score === null || score === undefined || score === "") return null;
  const pct = (score / 24) * 100;
  if (pct >= 85) return { label: "A", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-300", icon: "✅", status: "On Track", advice: "Keep going as planned." };
  if (pct >= 75) return { label: "B", color: "text-amber-600", bg: "bg-amber-50 border-amber-300", icon: "⚠️", status: "Borderline", advice: "Review today's weak areas before sleeping. The pass mark is 75% — this is too close for comfort." };
  if (pct >= 65) return { label: "C", color: "text-orange-600", bg: "bg-orange-50 border-orange-300", icon: "❌", status: "Behind", advice: "Re-read the relevant chapter section tonight. Repeat this day's content tomorrow before moving on." };
  return { label: "D", color: "text-red-700", bg: "bg-red-50 border-red-400", icon: "🛑", status: "Reset", advice: "Stop and consolidate. Spend an extra session on this chapter. Do not advance yet." };
};

const WEEK_COLORS = { 1: "#0D7A5F", 2: "#5B2C6F", 3: "#C0392B" };
const WEEK_LABELS = { 1: "Read & Absorb", 2: "Practice Tests", 3: "Mock Exams" };

export default function LifeInUKTracker() {
  const [scores, setScores] = useState({});
  const [checks, setChecks] = useState({});
  const [activeDay, setActiveDay] = useState(null);
  const [importCode, setImportCode] = useState("");
  const [importMsg, setImportMsg] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [activeTab, setActiveTab] = useState("tracker");

  const scoreEntries = useMemo(() => Object.entries(scores).map(([k, v]) => [parseInt(k), v]).filter(([, v]) => v !== "" && v !== null && v !== undefined), [scores]);
  const completedDays = scoreEntries.length;
  const avg = scoreEntries.length ? scoreEntries.reduce((s, [, v]) => s + v, 0) / scoreEntries.length : null;
  const avgPct = avg !== null ? (avg / 24 * 100).toFixed(1) : null;
  const currentBand = avg !== null ? BAND(avg) : null;
  const chartData = DAYS.map(d => ({ day: d.id, score: scores[d.id] !== undefined && scores[d.id] !== "" ? Math.round((scores[d.id] / 24) * 100) : null, week: d.week }));
  const isReady = useMemo(() => {
    const w3scores = scoreEntries.filter(([d]) => d >= 15).map(([, v]) => v);
    const allAvgPct = avg !== null ? avg / 24 * 100 : 0;
    const w3avg = w3scores.length ? w3scores.reduce((a, b) => a + b, 0) / w3scores.length / 24 * 100 : 0;
    const minW3 = w3scores.length ? Math.min(...w3scores) / 24 * 100 : 0;
    return w3scores.length >= 5 && w3avg >= 85 && minW3 >= 75 && allAvgPct >= 80;
  }, [scoreEntries, avg]);

  const exportCode = () => {
    const data = JSON.stringify({ scores, checks, startDate });
    const b64 = btoa(unescape(encodeURIComponent(data)));
    navigator.clipboard.writeText(b64).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const importProgress = () => {
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(importCode.trim()))));
      if (data.scores) setScores(data.scores);
      if (data.checks) setChecks(data.checks);
      if (data.startDate) setStartDate(data.startDate);
      setImportMsg("✅ Progress restored successfully!");
      setShowImport(false);
      setImportCode("");
      setTimeout(() => setImportMsg(""), 3000);
    } catch {
      setImportMsg("❌ Invalid code. Please paste the exact exported code.");
    }
  };

  const handleScore = (dayId, val) => {
    const n = parseInt(val);
    if (val === "") { setScores(p => ({ ...p, [dayId]: "" })); return; }
    if (!isNaN(n) && n >= 0 && n <= 24) {
      setScores(p => ({ ...p, [dayId]: n }));
      if (!startDate && completedDays === 0) setStartDate(new Date().toISOString().split("T")[0]);
    }
  };

  const toggleCheck = (dayId, i) => {
    setChecks(p => {
      const prev = p[dayId] || [];
      const next = [...prev];
      next[i] = !next[i];
      return { ...p, [dayId]: next };
    });
  };

  const dayChecks = (dayId) => checks[dayId] || [];
  const dayScore = (dayId) => scores[dayId];
  const dayComplete = (dayId) => dayScore(dayId) !== undefined && dayScore(dayId) !== "";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #2C5F9E 100%)" }} className="text-white px-4 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">🇬🇧 Life in the UK — 21-Day Tracker</h1>
              <p className="text-blue-200 text-sm mt-1">For Kennedy · 24 questions · 45 min · Pass: 18/24 (75%)</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowImport(!showImport)} className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm px-3 py-2 rounded-lg transition">
                <Upload size={14} /> Import
              </button>
              <button onClick={exportCode} className="flex items-center gap-1 bg-white text-blue-900 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-blue-50 transition">
                <Download size={14} /> {copied ? "Copied!" : "Export Save"}
              </button>
            </div>
          </div>
          {showImport && (
            <div className="mt-3 flex gap-2 flex-wrap">
              <input value={importCode} onChange={e => setImportCode(e.target.value)} placeholder="Paste your save code here…" className="flex-1 min-w-0 text-gray-800 text-sm px-3 py-2 rounded-lg border" />
              <button onClick={importProgress} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg font-semibold">Restore</button>
            </div>
          )}
          {importMsg && <p className="mt-2 text-sm font-medium text-yellow-200">{importMsg}</p>}

          {/* STATS ROW */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={<Calendar size={16}/>} label="Days Done" value={`${completedDays}/21`} />
            <StatCard icon={<TrendingUp size={16}/>} label="Avg Score" value={avgPct ? `${avgPct}%` : "—"} sub={avg ? `${avg.toFixed(1)}/24` : ""} />
            <StatCard icon={<Target size={16}/>} label="Status" value={currentBand ? currentBand.status : "Not started"} sub={currentBand ? `Band ${currentBand.label}` : ""} />
            <StatCard icon={<Trophy size={16}/>} label="Ready?" value={isReady ? "YES — BOOK IT" : completedDays < 18 ? `${21 - completedDays} days left` : "Not yet"} highlight={isReady} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex border-b border-gray-200 mt-4 gap-1">
          {[["tracker", "📅 Daily Tracker"], ["chart", "📊 Progress Chart"], ["ready", "🏆 Am I Ready?"]].map(([k, l]) => (
            <button key={k} onClick={() => setActiveTab(k)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${activeTab === k ? "bg-white border border-b-white text-blue-800 border-gray-200" : "text-gray-500 hover:text-gray-700"}`}>{l}</button>
          ))}
        </div>

        {/* TAB: TRACKER */}
        {activeTab === "tracker" && (
          <div className="py-4 space-y-6">
            {[1, 2, 3].map(week => (
              <div key={week}>
                <div className="flex items-center gap-3 mb-3">
                  <div style={{ background: WEEK_COLORS[week] }} className="text-white text-xs font-bold px-3 py-1 rounded-full">WEEK {week}</div>
                  <span className="text-gray-600 font-medium text-sm">{WEEK_LABELS[week]}</span>
                  <span className="text-gray-400 text-xs">{week === 1 ? "Target: 60%+" : week === 2 ? "Target: 75%+" : "Target: 85%+"}</span>
                </div>
                <div className="space-y-2">
                  {DAYS.filter(d => d.week === week).map(day => {
                    const score = dayScore(day.id);
                    const band = score !== undefined && score !== "" ? BAND(score) : null;
                    const isOpen = activeDay === day.id;
                    const checks_done = dayChecks(day.id).filter(Boolean).length;
                    const total_tasks = day.tasks.length;

                    return (
                      <div key={day.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Day Header Row */}
                        <button onClick={() => setActiveDay(isOpen ? null : day.id)} className="w-full text-left">
                          <div className="flex items-center gap-3 p-3">
                            <div style={{ background: WEEK_COLORS[week], minWidth: 44 }} className="text-white text-xs font-bold rounded-lg p-2 text-center">
                              <div className="text-base font-black leading-none">{day.id}</div>
                              <div style={{ fontSize: 9 }}>DAY</div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-gray-800 text-sm">{day.title}</span>
                                {day.id === 6 || day.id === 7 || day.id === 13 || day.id === 14 || day.id === 20 || day.id === 21 ? <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Weekend</span> : null}
                              </div>
                              <div className="text-gray-500 text-xs mt-0.5 truncate">{day.topic} · {day.time}</div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {dayComplete(day.id) && band ? (
                                <div className={`text-xs font-bold px-2 py-1 rounded-lg border ${band.bg} ${band.color}`}>
                                  {score}/24 · {Math.round(score/24*100)}% · {band.icon}
                                </div>
                              ) : (
                                <div className="text-xs text-gray-400 px-2 py-1 rounded-lg bg-gray-50 border border-gray-200">
                                  {checks_done > 0 ? `${checks_done}/${total_tasks} tasks` : "Not started"}
                                </div>
                              )}
                              {isOpen ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                            </div>
                          </div>
                        </button>

                        {/* Expanded Day Panel */}
                        {isOpen && (
                          <div className="border-t border-gray-100 p-4 space-y-4">
                            {/* Tasks */}
                            <div>
                              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">✅ Tasks</h4>
                              <div className="space-y-2">
                                {day.tasks.map((task, i) => (
                                  <label key={i} className="flex items-start gap-2 cursor-pointer group">
                                    <button onClick={() => toggleCheck(day.id, i)} className="mt-0.5 shrink-0">
                                      {dayChecks(day.id)[i] ? <CheckCircle size={18} className="text-emerald-500"/> : <Circle size={18} className="text-gray-300 group-hover:text-gray-400"/>}
                                    </button>
                                    <span className={`text-sm leading-snug ${dayChecks(day.id)[i] ? "line-through text-gray-400" : "text-gray-700"}`}>{task}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Key Tips */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                              <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">💡 Key Facts to Know Today</h4>
                              <div className="space-y-1">
                                {day.tips.map((tip, i) => <p key={i} className="text-xs text-amber-900 leading-snug">• {tip}</p>)}
                              </div>
                            </div>

                            {/* Score input */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">📊 Log Your Practice Test Score</h4>
                              <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number" min="0" max="24"
                                    value={score !== undefined && score !== "" ? score : ""}
                                    onChange={e => handleScore(day.id, e.target.value)}
                                    placeholder="0–24"
                                    className="w-20 text-center text-lg font-bold border-2 border-gray-300 rounded-lg py-2 focus:border-blue-500 focus:outline-none"
                                  />
                                  <span className="text-gray-500 text-sm font-medium">/ 24</span>
                                  {score !== undefined && score !== "" && <span className="text-gray-600 text-sm font-medium">=  {Math.round(score/24*100)}%</span>}
                                </div>
                                {band && (
                                  <div className={`flex-1 rounded-lg p-2 border ${band.bg}`}>
                                    <p className={`font-bold text-sm ${band.color}`}>Band {band.label} — {band.icon} {band.status}</p>
                                    <p className="text-xs text-gray-600 mt-0.5">{band.advice}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Reflection */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">🧠 End of Day Reflection</h4>
                              <div className="space-y-1">
                                {day.reflect.map((r, i) => <p key={i} className="text-xs text-blue-900">→ {r}</p>)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: CHART */}
        {activeTab === "chart" && (
          <div className="py-4 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h3 className="font-bold text-gray-800 mb-1">Score History (%)</h3>
              <p className="text-gray-500 text-xs mb-4">Log scores on Day cards to see your progress chart. Green line = 85% target. Red line = 75% pass mark.</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData.filter(d => d.score !== null)} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} label={{ value: "Day", position: "insideBottom", offset: -2, fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v) => [`${v}%`, "Score"]} labelFormatter={(l) => `Day ${l}`} />
                  <ReferenceLine y={85} stroke="#059669" strokeDasharray="4 2" label={{ value: "85% Target", position: "right", fontSize: 10, fill: "#059669" }} />
                  <ReferenceLine y={75} stroke="#DC2626" strokeDasharray="4 2" label={{ value: "75% Pass", position: "right", fontSize: 10, fill: "#DC2626" }} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {chartData.filter(d => d.score !== null).map((d, i) => (
                      <Cell key={i} fill={d.score >= 85 ? "#059669" : d.score >= 75 ? "#D97706" : d.score >= 65 ? "#EA580C" : "#DC2626"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Per-week averages */}
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3].map(w => {
                const ws = scoreEntries.filter(([d]) => DAYS.find(x => x.id === d)?.week === w);
                const wa = ws.length ? ws.reduce((s,[,v])=>s+v,0)/ws.length/24*100 : null;
                return (
                  <div key={w} className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm">
                    <div style={{ color: WEEK_COLORS[w] }} className="text-xs font-bold uppercase tracking-wider">Week {w}</div>
                    <div className="text-2xl font-black text-gray-800 mt-1">{wa ? `${wa.toFixed(0)}%` : "—"}</div>
                    <div className="text-xs text-gray-400">{ws.length} sessions</div>
                    <div className="text-xs text-gray-500">{WEEK_LABELS[w]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: READY? */}
        {activeTab === "ready" && (
          <div className="py-4 space-y-4">
            {isReady ? (
              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-5 text-center">
                <div className="text-4xl mb-2">🏆</div>
                <h2 className="text-xl font-black text-emerald-700">YOU ARE READY — BOOK THE TEST</h2>
                <p className="text-emerald-600 text-sm mt-2">Your scores meet all the criteria. Go to the official booking site and book it.</p>
                <p className="text-emerald-500 text-xs mt-1 font-medium">gov.uk/life-in-the-uk-test · Cost: £50</p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold text-blue-800 text-sm">Book when all criteria are met:</h3>
                <p className="text-blue-600 text-xs mt-1">Log enough scores to unlock the full assessment.</p>
              </div>
            )}

            {/* Checklist */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
              <h3 className="font-bold text-gray-800 mb-3">Ready-to-Book Criteria</h3>
              {(() => {
                const w3s = scoreEntries.filter(([d]) => d >= 15).map(([,v]) => v);
                const allAvg = avg ? avg/24*100 : 0;
                const w3avg = w3s.length ? w3s.reduce((a,b)=>a+b,0)/w3s.length/24*100 : 0;
                const minW3 = w3s.length ? Math.min(...w3s)/24*100 : 0;
                const criteria = [
                  { label: "3-week average ≥ 80%", met: allAvg >= 80, current: avgPct ? `Current: ${avgPct}%` : "No data yet" },
                  { label: "Week 3 average ≥ 85%", met: w3avg >= 85, current: w3s.length ? `Current: ${w3avg.toFixed(0)}%` : "No Week 3 scores yet" },
                  { label: "Lowest Week 3 mock ≥ 75% (18/24)", met: minW3 >= 75, current: w3s.length ? `Lowest: ${minW3.toFixed(0)}%` : "No Week 3 scores yet" },
                  { label: "At least 5 Week 3 sessions logged", met: w3s.length >= 5, current: `${w3s.length}/5 logged` },
                ];
                return criteria.map((c, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${c.met ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"}`}>
                    {c.met ? <CheckCircle size={18} className="text-emerald-500 shrink-0"/> : <Circle size={18} className="text-gray-300 shrink-0"/>}
                    <div>
                      <p className={`text-sm font-medium ${c.met ? "text-emerald-700" : "text-gray-600"}`}>{c.label}</p>
                      <p className="text-xs text-gray-400">{c.current}</p>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Scoring guide */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h3 className="font-bold text-gray-800 mb-3">Scoring Band Guide</h3>
              <div className="space-y-2">
                {[
                  { band:"A", range:"≥85% (21+/24)", icon:"✅", color:"text-emerald-700", bg:"bg-emerald-50 border-emerald-200", action:"Keep going as planned" },
                  { band:"B", range:"75–84% (18–20/24)", icon:"⚠️", color:"text-amber-700", bg:"bg-amber-50 border-amber-200", action:"Review weak areas before sleeping" },
                  { band:"C", range:"65–74% (16–17/24)", icon:"❌", color:"text-orange-700", bg:"bg-orange-50 border-orange-200", action:"Re-read the relevant chapter section" },
                  { band:"D", range:"<65% (≤15/24)", icon:"🛑", color:"text-red-700", bg:"bg-red-50 border-red-200", action:"Stop and consolidate. Extra session needed." },
                ].map(b => (
                  <div key={b.band} className={`flex items-center gap-3 p-2.5 rounded-lg border ${b.bg}`}>
                    <span className="text-lg w-6 text-center">{b.icon}</span>
                    <div>
                      <span className={`text-sm font-bold ${b.color}`}>Band {b.band} — {b.range}</span>
                      <p className="text-xs text-gray-500">{b.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HOW TO SAVE */}
        <div className="my-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-xs text-yellow-800 font-medium">💾 <strong>To save progress between sessions:</strong> tap <strong>Export Save</strong> (top right) → it copies a code to your clipboard → save it somewhere (Notes app, email to yourself). Next session: paste it into Import and hit Restore.</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, highlight }) {
  return (
    <div className={`rounded-xl px-3 py-2 text-center ${highlight ? "bg-yellow-400 text-yellow-900" : "bg-white bg-opacity-15 text-white"}`}>
      <div className={`flex items-center justify-center gap-1 text-xs mb-1 ${highlight ? "text-yellow-800" : "text-blue-200"}`}>{icon} {label}</div>
      <div className={`font-black text-sm leading-tight ${highlight ? "text-yellow-900" : "text-white"}`}>{value}</div>
      {sub && <div className={`text-xs ${highlight ? "text-yellow-700" : "text-blue-300"}`}>{sub}</div>}
    </div>
  );
}
