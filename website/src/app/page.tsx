export default function Page() {
  return (
    <main className="min-h-screen antialiased text-slate-800 bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-9 h-9"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect x="2" y="2" width="36" height="36" rx="10" className="fill-indigo-600" />
              <path d="M12 14h16M20 14v16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="20" cy="20" r="3" fill="white" />
            </svg>
            <div>
              <div className="text-lg font-semibold tracking-tight">TRACE Protocol</div>
              <div className="text-xs text-slate-500">
                <span className="font-medium">Trusted records</span> for autonomous systems
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#why" className="hover:text-slate-900 text-slate-600">Why TRACE</a>
            <a href="#concepts" className="hover:text-slate-900 text-slate-600">Concepts</a>
            <a href="#demo" className="hover:text-slate-900 text-slate-600">Demo</a>
            <a href="#sdks" className="hover:text-slate-900 text-slate-600">SDKs</a>
            <a href="#labs" className="hover:text-slate-900 text-slate-600">TRACE Labs</a>
            <a href="#community" className="hover:text-slate-900 text-slate-600">Community</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="#manifesto" className="px-3 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-50">Manifesto</a>
            <a
              href="https://github.com/trace-protocol/trace-protocol"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Hero (no gradient on title) */}
      <section className="bg-[radial-gradient(1200px_400px_at_50%_-10%,rgba(99,102,241,.12),transparent_60%),radial-gradient(800px_300px_at_80%_10%,rgba(16,185,129,.10),transparent_60%)]">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Open standard for auditable autonomous systems
          </h1>
          <p className="mt-5 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            TRACE brings <span className="font-semibold">auditability</span> and{" "}
            <span className="font-semibold">governance</span> to AI through a unified{" "}
            <span className="font-semibold">Action → Policy → Evidence</span> model.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <a href="#quickstart" className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">Try the Quickstart</a>
            <a href="#manifesto" className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50">Read Manifesto</a>
            <a
              href="https://github.com/trace-protocol/trace-protocol"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50"
            >
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Why TRACE</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              As agents start to <em>act</em> — send emails, open PRs, publish docs — teams need a shared way to{" "}
              <strong>record intent</strong>, <strong>apply policy</strong>, and <strong>prove outcomes</strong>. TRACE standardizes that loop so any agent can operate under verifiable guardrails.
            </p>
            <ul className="mt-6 space-y-3 text-slate-700">
              <li className="flex items-start gap-3"><span className="mt-1 w-2 h-2 rounded-full bg-emerald-500" /> <span>Vendor-neutral, model-agnostic, lightweight HTTP API.</span></li>
              <li className="flex items-start gap-3"><span className="mt-1 w-2 h-2 rounded-full bg-indigo-500" /> <span>Portable policies: <code className="px-1 py-0.5 bg-slate-100 rounded">enforce</code> or <code className="px-1 py-0.5 bg-slate-100 rounded">observe</code>.</span></li>
              <li className="flex items-start gap-3"><span className="mt-1 w-2 h-2 rounded-full bg-fuchsia-500" /> <span>Evidence ledger for provable human or automated checks.</span></li>
            </ul>
          </div>

          <div className="rounded-2xl p-5 text-[13px] leading-relaxed text-slate-200 bg-[#0b1020] shadow-[0_10px_30px_rgba(2,6,23,0.35)]">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 bg-red-400 rounded-full"></span>
              <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
              <span className="w-3 h-3 bg-emerald-400 rounded-full"></span>
            </div>
            <pre className="whitespace-pre-wrap">{`// Action → Policy → Evidence
const decision = await trace.propose({
  type: "send_email",
  actor: { kind: "agent", name: "mail-bot", provider: "openai" },
  target: "mailto:client@acme.com",
  params: { subject: "Proposal" }
});

if (decision.status === "requires_approval") {
  await fetch(\`/approve/\${decision.actionId}\`, { method: "POST" });
}

await trace.evidence(decision.actionId, [
  { name: "email_sent", pass: true, note: "msgId=123" }
]);`}</pre>
          </div>
        </div>
      </section>

      {/* Concepts */}
      <section id="concepts" className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center">Core Concepts</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200">
              <div className="text-2xl">🧠</div>
              <h3 className="mt-3 font-semibold">Action</h3>
              <p className="text-slate-600 mt-2">What an agent intends to do.</p>
              <pre className="mt-4 text-[12px] bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto">{`{
  "id": "a_123",
  "type": "send_email",
  "actor": { "kind": "agent", "name": "mail-bot" },
  "target": "mailto:client@acme.com",
  "params": { "subject": "Hi" },
  "timestamp": "2025-10-10T12:34:56Z"
}`}</pre>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200">
              <div className="text-2xl">⚖️</div>
              <h3 className="mt-3 font-semibold">Policy</h3>
              <p className="text-slate-600 mt-2">Rules that must hold.</p>
              <pre className="mt-4 text-[12px] bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto">{`rules:
  - when: { actionType: "send_email" }
    require: ["reviewer_approval"]
    mode: enforce`}</pre>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200">
              <div className="text-2xl">📜</div>
              <h3 className="mt-3 font-semibold">Evidence</h3>
              <p className="text-slate-600 mt-2">Proof of outcomes.</p>
              <pre className="mt-4 text-[12px] bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto">{`{
  "actionId": "a_123",
  "checks": [{ "name": "reviewer_approval", "pass": true, "approver": "@fernando" }],
  "timestamp": "2025-10-10T12:40:00Z"
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Demo / Quickstart */}
      <section id="demo" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="md:flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Quickstart</h2>
            <div className="text-sm text-slate-500 mt-3 md:mt-0">5 minutes → run locally</div>
          </div>
          <div id="quickstart" className="mt-6 grid lg:grid-cols-2 gap-6">
            <div className="p-6 border border-slate-200 rounded-2xl">
              <h3 className="font-semibold">Reference server</h3>
              <pre className="mt-3 text-[12.5px] bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto"><code>{`cd server
npm i && npm run dev  # http://localhost:8787`}</code></pre>

              <h3 className="font-semibold mt-6">TypeScript SDK</h3>
              <pre className="mt-3 text-[12.5px] bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto"><code>{`npm -C sdk/packages/client i && npm -C sdk/packages/client run build
node examples/sendEmail.mjs`}</code></pre>

              <h3 className="font-semibold mt-6">Python SDK</h3>
              <pre className="mt-3 text-[12.5px] bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto"><code>{`pip install -e ./sdk/python
python examples/python/send_email.py`}</code></pre>
            </div>

            <div className="p-6 border border-slate-200 rounded-2xl">
              <h3 className="font-semibold">Policy (optional HiTL)</h3>
              <pre className="mt-3 text-[12.5px] bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto">{`rules:
  - when: { actionType: "send_email" }
    require: ["reviewer_approval"]
    mode: enforce`}</pre>

              <h3 className="font-semibold mt-6">Approve in dev</h3>
              <pre className="mt-3 text-[12.5px] bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto"><code>{`curl -X POST http://localhost:8787/approve/<actionId>`}</code></pre>

              <a
                href="https://github.com/trace-protocol/trace-protocol"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
              >
                View repository
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"/><path d="M5 5h5V3H3v7h2V5z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto block */}
      <section id="manifesto" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Autonomy demands accountability</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            TRACE is a community-governed protocol for responsible AI operations. It’s open, model-agnostic, and simple enough to adopt in minutes.
            The core loop is universal: <strong>Action → Policy → Evidence</strong>.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="/MANIFESTO" className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100">Read the Manifesto</a>
            <a href="#community" className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Join the community</a>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section id="sdks" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center">SDKs</h2>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="p-6 border border-slate-200 rounded-2xl">
              <div className="text-sm font-medium text-indigo-600">TypeScript</div>
              <h3 className="text-xl font-semibold mt-1">@trace/client</h3>
              <pre className="mt-4 text-[12.5px] bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto">npm i @trace/client</pre>
              <p className="text-slate-600 mt-3">
                ESM-first, minimal footprint. Includes <code>TraceClient</code> and the <code>withAction</code> helper.
              </p>
              <a
                href="https://github.com/trace-protocol/trace-protocol/tree/main/sdk/ts/client"
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 text-sm text-slate-700 hover:underline"
              >
                View package →
              </a>
            </div>
            <div className="p-6 border border-slate-200 rounded-2xl">
              <div className="text-sm font-medium text-emerald-600">Python</div>
              <h3 className="text-xl font-semibold mt-1">trace-client</h3>
              <pre className="mt-4 text-[12.5px] bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto">pip install trace-client</pre>
              <p className="text-slate-600 mt-3">
                Requests-based, mirrors TS features. Includes <code>with_action</code> helper.
              </p>
              <a
                href="https://github.com/trace-protocol/trace-protocol/tree/main/sdk/python/trace_client"
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 text-sm text-slate-700 hover:underline"
              >
                View package →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TRACE Labs */}
      <section id="labs" className="py-20 bg-slate-900 text-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">TRACE Labs</h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                TRACE Labs is the independent research and engineering group stewarding the TRACE Protocol — an open, model-agnostic standard
                that brings auditability and governance to autonomous systems. We maintain the reference server, SDKs, and community RFCs.
              </p>
              <div className="mt-6 flex gap-3 flex-wrap">
                <a
                  href="https://github.com/trace-protocol"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100"
                >
                  GitHub Org
                </a>
                <a href="#community" className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800">
                  Join the community
                </a>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700">
              <h3 className="font-semibold">Design principles</h3>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li className="flex gap-3"><span className="text-indigo-300">•</span> Open by default (Apache-2.0)</li>
                <li className="flex gap-3"><span className="text-indigo-300">•</span> Simple primitives, pluggable storage</li>
                <li className="flex gap-3"><span className="text-indigo-300">•</span> Human-in-the-loop as a first-class policy</li>
                <li className="flex gap-3"><span className="text-indigo-300">•</span> Evidence you can verify independently</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Join the community</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Help shape the standard: propose RFCs, build integrations, and pilot TRACE in your agent stack.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://github.com/trace-protocol/trace-protocol/discussions"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50"
            >
              GitHub Discussions
            </a>
            <a href="#" className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50">Discord</a>
            <a href="#" className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50">Reddit</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-slate-500">
          <p>© 2025 <span className="font-medium">TRACE Labs</span> — Stewards of the TRACE Protocol</p>
          <p className="mt-1">Open standard for auditable autonomous systems · Apache-2.0</p>
        </div>
      </footer>
    </main>
  );
}
