import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';
const INK = '#0F172A';
const BLUE = '#2F6FE6';
const BLUE_LIGHT = '#5DA8FF';
const SLATE = '#475569';
const MUTED = '#64748B';
const DIVIDER = '#EAF2FF';

const capabilities = [
  {
    title: 'Intelligence Orchestration',
    text: 'Agentic system coordinating analytical models, financial logic, and data pipelines into a unified intelligence layer.',
  },
  {
    title: 'Enterprise Data Integration',
    text: 'Integration with institutional systems including CRM, portfolio platforms, deal data rooms, and internal research.',
  },
  {
    title: 'Signal Extraction',
    text: 'Automated identification of financial signals across structured and unstructured datasets.',
  },
  {
    title: 'Decision Intelligence',
    text: 'Generation of investment memos, diligence summaries, risk indicators, and analytical insights.',
  },
];

const pipelineStages = [
  { num: '01', title: 'Data Ingestion', items: ['CRM systems', 'portfolio platforms', 'deal materials', 'market feeds'] },
  { num: '02', title: 'Data Harmonization', items: ['Normalization and validation of institutional datasets.'] },
  { num: '03', title: 'Feature Extraction', items: ['Identification of patterns, signals, and analytical features.'] },
  { num: '04', title: 'Intelligence Layer', items: ['Agentic orchestration combining models and financial logic.'] },
  { num: '05', title: 'Insight Generation', items: ['investment memos', 'portfolio analytics', 'alerts', 'advisor reports'] },
];

export default function CapabilityBrief() {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', fontFamily: FONT }}>
      {/* Toolbar — hidden in print */}
      <div className="print:hidden sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b"
        style={{ background: 'hsla(0,0%,100%,0.92)', backdropFilter: 'blur(20px)', borderColor: DIVIDER }}>
        <Link to="/" className="flex items-center gap-2 text-sm" style={{ color: SLATE }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-medium transition hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE_LIGHT})` }}
        >
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      {/* Print container */}
      <div ref={printRef} className="max-w-[816px] mx-auto">
        {/* ═══════════════ PAGE 1 ═══════════════ */}
        <div className="bg-white print:shadow-none shadow-lg my-8 print:my-0 print:break-after-page"
          style={{ padding: '72px', minHeight: '1056px', position: 'relative' }}>
          {/* Top divider */}
          <div style={{ height: 2, background: BLUE, marginBottom: 48 }} />

          {/* Header */}
          <p style={{ fontSize: 18, fontWeight: 500, color: INK, marginBottom: 48, fontFamily: FONT }}>
            Neuralpositive
          </p>

          {/* Hero title */}
          <h1 style={{ fontSize: 48, fontWeight: 600, color: INK, lineHeight: 1.1, marginBottom: 8, letterSpacing: '-0.02em' }}>
            Agentic Intelligence<br />Infrastructure
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 24, fontWeight: 500, color: BLUE, marginBottom: 24 }}>
            Platform Capabilities
          </p>

          {/* Intro paragraph */}
          <p style={{ fontSize: 16, fontWeight: 400, color: SLATE, lineHeight: 1.55, maxWidth: 560, marginBottom: 48 }}>
            Neuralpositive provides modular intelligence infrastructure that enables financial institutions to generate decision-grade insight directly from internal data systems.
          </p>

          {/* Section title */}
          <h2 style={{ fontSize: 22, fontWeight: 600, color: INK, marginBottom: 8 }}>
            Core Capabilities
          </h2>
          <div style={{ height: 1, background: DIVIDER, marginBottom: 28 }} />

          {/* Capability blocks */}
          {capabilities.map((cap, i) => (
            <div key={i} style={{ marginBottom: i < capabilities.length - 1 ? 32 : 0 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: INK, marginBottom: 6 }}>
                {cap.title}
              </h3>
              <p style={{ fontSize: 15, fontWeight: 400, color: SLATE, lineHeight: 1.55 }}>
                {cap.text}
              </p>
            </div>
          ))}
        </div>

        {/* ═══════════════ PAGE 2 ═══════════════ */}
        <div className="bg-white print:shadow-none shadow-lg my-8 print:my-0 print:break-after-page"
          style={{ padding: '72px', minHeight: '1056px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {/* Top gradient bar */}
          <div style={{ height: 6, background: `linear-gradient(90deg, ${BLUE}, ${BLUE_LIGHT})`, marginBottom: 48, borderRadius: 3 }} />

          {/* Section title */}
          <h2 style={{ fontSize: 26, fontWeight: 600, color: INK, marginBottom: 12 }}>
            Intelligence Pipeline
          </h2>
          <p style={{ fontSize: 16, fontWeight: 400, color: SLATE, lineHeight: 1.55, marginBottom: 36 }}>
            Institutional data is transformed into decision-grade analysis through a modular intelligence pipeline.
          </p>

          {/* Pipeline stages */}
          {pipelineStages.map((stage, i) => (
            <div key={i} style={{ marginBottom: 28, display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: BLUE, minWidth: 28, paddingTop: 2 }}>
                {stage.num}
              </span>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: INK, marginBottom: 4 }}>
                  {stage.title}
                </h3>
                {stage.items.length === 1 ? (
                  <p style={{ fontSize: 15, color: SLATE, lineHeight: 1.55 }}>{stage.items[0]}</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {stage.items.map((item, j) => (
                      <li key={j} style={{ fontSize: 15, color: SLATE, lineHeight: 1.7 }}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}

          {/* Pipeline diagram */}
          <div className="print:mt-6 mt-8 flex-1 flex items-end">
            <div className="w-full">
              {/* Visual pipeline flow */}
              <div className="flex items-center justify-between gap-1 mb-6">
                {pipelineStages.map((stage, i) => (
                  <React.Fragment key={i}>
                    <div className="flex-1 text-center">
                      <div className="mx-auto w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                        style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE_LIGHT})` }}>
                        {stage.num}
                      </div>
                      <p className="mt-2 text-[10px] leading-tight" style={{ color: SLATE }}>{stage.title}</p>
                    </div>
                    {i < pipelineStages.length - 1 && (
                      <div className="w-8 h-[2px] shrink-0 -mt-4" style={{ background: `linear-gradient(90deg, ${BLUE}, ${BLUE_LIGHT})` }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 'auto', paddingTop: 24 }}>
            <div style={{ height: 1, background: DIVIDER, marginBottom: 16 }} />
            <div className="flex justify-between items-center">
              <div>
                <p style={{ fontSize: 12, fontWeight: 500, color: MUTED }}>Neuralpositive AI Labs</p>
                <p style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Research context: Weill Cornell Medicine</p>
              </div>
              <p style={{ fontSize: 10, color: MUTED }}>© 2026 Neuralpositive</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: letter; margin: 0; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:my-0 { margin-top: 0 !important; margin-bottom: 0 !important; }
          .print\\:break-after-page { break-after: page; page-break-after: always; }
          .print\\:mt-6 { margin-top: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
