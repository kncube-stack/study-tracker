import { useState, useRef } from "react";
import { CHECKLIST_KEY, loadChecklist } from "./progress";
import { SUMMARY_CHAPTERS } from "./summaryData";
import { ChevronDown, ChevronUp } from "lucide-react";

// ─── Section renderers ────────────────────────────────────────────────────────

function SectionTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto mt-2 mb-4 rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-blue-900 text-white">
            {headers.map((h, i) => (
              <th scope="col" key={i} className="px-3 py-2 text-left font-semibold text-xs tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-blue-50"}>
              {row.map((cell, ci) => (
                <td key={ci} className={`px-3 py-2 text-gray-700 align-top ${ci === 0 ? "font-semibold text-blue-900 whitespace-nowrap" : ""}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionBullets({ items }) {
  return (
    <ul className="mt-2 mb-4 space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-gray-700">
          <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionTips({ items }) {
  return (
    <div className="mt-2 mb-4 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3">
      <p className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">⚡ Exam Tips</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-amber-900 flex gap-2">
            <span className="flex-shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionMnemonic({ text, table }) {
  return (
    <div className="mt-2 mb-4">
      <div className="rounded-lg bg-blue-900 text-white px-4 py-3 mb-3 text-center font-bold tracking-wide text-sm">
        {text}
      </div>
      {table && <SectionTable headers={table.headers} rows={table.rows} />}
    </div>
  );
}

function ChecklistGroup({ group, checked, onToggle }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-2">{group.label}</p>
      <ul className="space-y-2">
        {group.items.map((item, i) => {
          const key = `${group.label}::${i}`;
          const done = checked[key];
          return (
            <li key={i}><label
              className={`flex items-start gap-3 cursor-pointer rounded-lg px-3 py-2 transition-colors ${done ? "bg-green-50 text-gray-500 line-through" : "bg-white hover:bg-blue-50 text-gray-700"}`}
            >
              <input type="checkbox" checked={!!done} onChange={() => onToggle(key)} className="mt-0.5 h-5 w-5 shrink-0 accent-emerald-700" />
              <span className="text-sm">{item}</span>
            </label></li>
          );
        })}
      </ul>
    </div>
  );
}

function SectionChecklist({ groups, checked, onToggle }) {
  const totalItems = groups.reduce((s, g) => s + g.items.length, 0);
  const doneItems = groups.reduce((sum, group) => sum + group.items.filter((_, i) => checked[`${group.label}::${i}`]).length, 0);
  const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-semibold text-green-700">{doneItems}/{totalItems} ticked</span>
      </div>
      {groups.map((g, i) => (
        <ChecklistGroup key={i} group={g} checked={checked} onToggle={onToggle} />
      ))}
    </div>
  );
}

function Section({ section, checklistState, onChecklistToggle }) {
  if (section.type === "table")
    return (
      <div>
        {section.heading && <h4 className="text-sm font-semibold text-blue-900 mt-4 mb-1">{section.heading}</h4>}
        <SectionTable headers={section.headers} rows={section.rows} />
      </div>
    );
  if (section.type === "bullets")
    return (
      <div>
        {section.heading && <h4 className="text-sm font-semibold text-blue-900 mt-4 mb-1">{section.heading}</h4>}
        <SectionBullets items={section.items} />
      </div>
    );
  if (section.type === "tips")
    return <SectionTips items={section.items} />;
  if (section.type === "mnemonic")
    return (
      <div>
        {section.heading && <h4 className="text-sm font-semibold text-blue-900 mt-4 mb-1">{section.heading}</h4>}
        <SectionMnemonic text={section.text} table={section.table} />
      </div>
    );
  if (section.type === "checklist")
    return (
      <div>
        {section.heading && <p className="text-xs text-gray-500 italic mb-3">{section.heading}</p>}
        <SectionChecklist groups={section.groups} checked={checklistState} onToggle={onChecklistToggle} />
      </div>
    );
  return null;
}

// ─── Collapsible chapter ───────────────────────────────────────────────────────

function Chapter({ chapter, isOpen, onToggle, checklistState, onChecklistToggle }) {
  return (
    <div className="border border-gray-200 rounded-xl mb-3 overflow-hidden">
      <button
        aria-expanded={isOpen}
        aria-controls={`chapter-panel-${chapter.id}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-blue-50 transition-colors text-left"
      >
        <span className="font-semibold text-blue-900 text-sm">{chapter.title}</span>
        {isOpen ? <ChevronUp size={16} className="text-blue-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />}
      </button>
      {isOpen && (
        <div id={`chapter-panel-${chapter.id}`} className="px-4 pb-4 bg-white border-t border-gray-100">
          {chapter.sections.map((s, i) => (
            <Section key={i} section={s} checklistState={checklistState} onChecklistToggle={onChecklistToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Summary component ───────────────────────────────────────────────────

export default function Summary() {
  const [openChapters, setOpenChapters] = useState({ ch1: true });
  const [initial] = useState(() => loadChecklist());
  const [checklistState, setChecklistState] = useState(initial.data);
  const [saveError, setSaveError] = useState(initial.error);
  const stored = useRef(initial.raw);

  function toggleChapter(id) {
    setOpenChapters(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function handleChecklistToggle(key) {
    if (saveError) return;
    const next = { ...checklistState, [key]: !checklistState[key] };
    try {
      const current = localStorage.getItem(CHECKLIST_KEY);
      if (current !== stored.current) throw new Error();
      const raw = JSON.stringify(next);
      localStorage.setItem(CHECKLIST_KEY, raw);
      stored.current = raw;
      setChecklistState(next);
    } catch { setSaveError('Checklist could not be saved, or changed in another tab. Your existing data is untouched. Reload before trying again.'); }
  }

  // Quick-jump: open a chapter and scroll to it
  function jumpTo(id) {
    setOpenChapters(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      document.getElementById(`chapter-${id}`)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }, 50);
  }

  return (
    <div className="max-w-2xl mx-auto">
      {saveError && <p role="alert" className="p-3 mb-3 bg-amber-50 border border-amber-400 text-amber-950">{saveError}</p>}
      {/* Quick-jump bar */}
      <div className="flex flex-wrap gap-2 mb-5 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <span className="text-xs text-blue-500 font-medium self-center mr-1">Jump to:</span>
        {SUMMARY_CHAPTERS.map(ch => (
          <button
            key={ch.id}
            onClick={() => jumpTo(ch.id)}
            className="text-xs bg-white border border-blue-200 text-blue-800 rounded-lg px-3 py-1 hover:bg-blue-100 transition-colors"
          >
            {ch.title.split("—")[0].trim()}
          </button>
        ))}
      </div>

      {/* Chapters */}
      {SUMMARY_CHAPTERS.map(ch => (
        <div key={ch.id} id={`chapter-${ch.id}`}>
          <Chapter
            chapter={ch}
            isOpen={!!openChapters[ch.id]}
            onToggle={() => toggleChapter(ch.id)}
            checklistState={checklistState}
            onChecklistToggle={handleChecklistToggle}
          />
        </div>
      ))}
    </div>
  );
}
