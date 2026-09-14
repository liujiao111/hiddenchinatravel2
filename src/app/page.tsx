import Link from "next/link";

const pillars = [
  {
    title: "Travel with confidence",
    description: "Practical guidance for payments, connectivity, transport, hotels, and entry requirements.",
  },
  {
    title: "Discover beyond the obvious",
    description: "Thoughtful destination guides beginning with Yunnan, Dali, and lesser-known local experiences.",
  },
  {
    title: "Plan at your pace",
    description: "Flexible journeys shaped around interests, comfort, and a realistic travel rhythm.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="border-b border-black/10">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="font-semibold tracking-tight">Hidden China Travel</Link>
          <span className="text-sm text-black/55">New site foundation</span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-red-700">China, at your pace</p>
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-7xl">
          Practical guidance. Local insight. Journeys worth remembering.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-black/65">
          A clean Next.js foundation for the next version of Hidden China Travel—built around trustworthy guides and experience-led journeys.
        </p>
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-px bg-black/10 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="bg-white p-7 sm:p-9">
              <h2 className="text-xl font-semibold tracking-tight">{pillar.title}</h2>
              <p className="mt-3 leading-7 text-black/60">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-black/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>Hidden China Travel</span>
        <span>Next.js · TypeScript · Tailwind CSS</span>
      </footer>
    </main>
  );
}
