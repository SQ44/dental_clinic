'use client';

import Link from 'next/link';

const featureHighlights = [
  {
    title: 'Effortless Scheduling',
    description:
      'Drag-and-drop calendars, instant confirmations, and automated reminders keep every chair productive.',
    icon: (
      <svg
        className="h-6 w-6 text-sky-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-8 4h8M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: 'Patient-Centric CRM',
    description:
      'Stay ahead with unified patient records, treatment plans, and proactive follow-ups across your team.',
    icon: (
      <svg
        className="h-6 w-6 text-sky-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5V10l-2-2h-3M7 20H2v-6l2-2h3m8-5a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    title: 'Revenue Intelligence',
    description:
      'See cash flow, insurance claims, and outstanding balances at a glance with real-time analytics.',
    icon: (
      <svg
        className="h-6 w-6 text-sky-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h4v11H3zm7-6h4v17h-4zm7 9h4v8h-4z"
        />
      </svg>
    ),
  },
];

const workflowSteps = [
  {
    label: '1. Welcome Patients',
    detail: 'Collect intake forms on any device and sync with their medical history instantly.',
  },
  {
    label: '2. Deliver Care',
    detail: 'Share treatment notes, X-rays, and prescriptions securely with your care team.',
  },
  {
    label: '3. Optimize Revenue',
    detail: 'Automate invoices, send reminders, and keep the ledger tidy without spreadsheets.',
  },
];

const testimonials = [
  {
    quote:
      'Our front office finally runs itself. Missed appointments dropped by 40% within the first month.',
    name: 'Dr. Ana Morgan',
    role: 'Owner, BrightSmile Studio',
  },
  {
    quote:
      'Mobile access means I can check today’s schedule from anywhere. The team loves how intuitive it feels.',
    name: 'Dr. Khalid Usman',
    role: 'Lead Orthodontist',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-slate-900">
      <header className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-sky-50">
        <div
          className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl"
          aria-hidden="true"
        />
        <div className="absolute -bottom-10 left-1/3 h-56 w-56 rounded-full bg-cyan-200/40 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-20">
          <nav className="flex items-center justify-between text-sm text-slate-600">
            <span className="font-semibold tracking-wide text-slate-900">Lumineer DentalOS</span>
            <div className="hidden md:flex gap-6 text-slate-600">
              <a className="hover:text-slate-900" href="#features">
                Platform
              </a>
              <a className="hover:text-slate-900" href="#workflow">
                Workflow
              </a>
              <a className="hover:text-slate-900" href="#trust">
                Stories
              </a>
            </div>
            <Link
              href="/login"
              className="rounded-full border border-slate-200 px-4 py-1.5 font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900"
            >
              Sign in
            </Link>
          </nav>

          <div className="mt-16 grid gap-12 md:grid-cols-2 md:items-center">
            <div className="space-y-8">
              <p className="inline-flex rounded-full bg-white px-4 py-1 text-sm text-slate-600 shadow-sm ring-1 ring-slate-100">
                Modern care for non-logged-in visitors
              </p>
              <div>
                <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                  Showcase your dental clinic from any device.
                </h1>
                <p className="mt-6 text-lg text-slate-600">
                  Give prospective patients a stunning, responsive experience before they ever log in.
                  Highlight treatments, availability, and your team’s expertise within a single branded
                  home page.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="flex-1 rounded-full bg-sky-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-sky-400 shadow"
                >
                  Explore Dashboard
                </Link>
                <Link
                  href="/appointments"
                  className="flex-1 rounded-full border border-slate-200 px-6 py-3 text-center font-semibold text-slate-900 transition hover:border-slate-400"
                >
                  See Availability
                </Link>
              </div>
              <dl className="grid grid-cols-2 gap-6 text-left text-slate-600 sm:grid-cols-3">
                {[
                  ['12k+', 'Appointments / mo'],
                  ['98%', 'Same-day confirmations'],
                  ['250+', 'Clinics onboarded'],
                ].map(([stat, label]) => (
                  <div key={label}>
                    <dt className="text-3xl font-semibold text-slate-900">{stat}</dt>
                    <dd className="text-sm text-slate-500">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Today&apos;s Snapshot</span>
                <span className="text-slate-600">Updated live</span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  {
                    label: 'Open Slots',
                    value: '08',
                    progress: 'w-3/5',
                    color: 'bg-green-400',
                  },
                  {
                    label: 'New Patient Leads',
                    value: '24',
                    progress: 'w-4/5',
                    color: 'bg-sky-400',
                  },
                  {
                    label: 'Pending Payments',
                    value: '$4,320',
                    progress: 'w-2/5',
                    color: 'bg-amber-400',
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{item.label}</span>
                      <span className="font-medium text-slate-900">{item.value}</span>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${item.color} ${item.progress}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl bg-gradient-to-r from-sky-100 to-cyan-100 p-5 text-sm">
                <p className="font-semibold text-slate-900">Real-time patient experience</p>
                <p className="mt-2 text-slate-600">
                  Visitors can browse services, view openings, and request a spot without logging in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="space-y-24 pb-24" id="features">
        <section className="px-6">
          <div className="mx-auto max-w-6xl rounded-3xl bg-white text-slate-900 px-8 py-16 shadow-xl">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold">Stay professional on every screen size.</h2>
              <p className="mt-4 text-lg text-slate-600">
                From widescreen displays in the lobby to phones in a rideshare, the experience adapts
                instantly so visitors can discover your clinic comfortably.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featureHighlights.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-100 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-sky-50 p-3">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-slate-600">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6" id="workflow">
          <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-3xl border border-slate-100 bg-white p-10 shadow-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">workflow</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">Guide visitors from hello to chair.</h2>
              <p className="mt-4 text-slate-600">
                Each section of the public experience is designed for clarity, making it easy to show what
                you do best and funnel leads to your team.
              </p>

              <ol className="mt-10 space-y-6 text-slate-600">
                {workflowSteps.map((step) => (
                  <li key={step.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
                      {step.label}
                    </p>
                    <p className="mt-2 text-lg text-slate-800">{step.detail}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white via-sky-50 to-white p-8 shadow-xl">
                <h3 className="text-2xl font-semibold text-slate-900">Mobile-first interface</h3>
                <p className="mt-3 text-slate-600">
                  Cards stack elegantly, typography scales, and key actions remain thumb-friendly for fast
                  booking on the go.
                </p>
                <ul className="mt-6 list-disc space-y-2 pl-4 text-slate-600">
                  <li>No downloads required</li>
                  <li>Supports light and dark mode preferences</li>
                  <li>Optimized SVG icons and gradients</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
                <p className="text-slate-500">Security & Privacy</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Invite-only dashboard access</h3>
                <p className="mt-3 text-slate-600">
                  Only staff with credentials can reach operational tools, while visitors enjoy an always-on,
                  informative overview.
                </p>
                <Link
                  href="/login"
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-sky-600 hover:text-sky-500"
                >
                  Launch secure portal
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6" id="trust">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-600">trusted by teams</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900">Designed with clinics in mind.</h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <blockquote
                key={item.name}
                className="rounded-3xl border border-slate-100 bg-white p-8 text-left text-slate-600 shadow"
              >
                <p className="text-lg leading-relaxed text-slate-900">{item.quote}</p>
                <footer className="mt-6 text-sm text-slate-500">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p>{item.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="px-6">
          <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-sky-400 to-cyan-300 px-8 py-14 text-center shadow-2xl">
            <h2 className="text-3xl font-semibold text-white">Ready to welcome new patients?</h2>
            <p className="mt-3 text-lg text-white/90">
              Turn your public landing page into a proactive concierge. Start by logging in to configure
              content, services, and automations.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="w-full max-w-xs rounded-full bg-white px-6 py-3 text-center font-semibold text-sky-600"
              >
                Log in to DentalOS
              </Link>
              <Link
                href="/patients"
                className="w-full max-w-xs rounded-full border border-white/50 px-6 py-3 text-center font-semibold text-white"
              >
                Preview patient view
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/90">Demo access: use any email and password &quot;password&quot;.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-6 py-8 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Lumineer DentalOS. Modern patient experiences without a login wall.</p>
        <p className="mt-1 font-semibold text-slate-600">Namataa Namataa</p>
      </footer>
    </div>
  );
}
