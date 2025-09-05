// pages/gigs.jsx
import Head from "next/head";
import path from "path";
import fs from "fs/promises";

const HERO = "/hero-giglive.jpg";

export default function Gigs({ gigs }) {
  const list = Array.isArray(gigs) ? gigs : [];
  const sorted = [...list].sort((a, b) => {
    const da = a?.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
    const db = b?.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
    return da - db;
  });

  return (
    <>
      <Head>
        <title>Gigs — Shadows &amp; Light</title>
        <meta name="description" content="Upcoming and past gigs for Shadows & Light" />
      </Head>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Gigs</h1>

        {/* Hero banner */}
        <div className="mt-6">
          <img
            src={HERO}
            alt="Shadows & Light live"
            className="w-full h-auto rounded-xl shadow-sm"
          />
        </div>

        {sorted.length === 0 ? (
          <p className="mt-8 text-neutral-400">No gigs to show yet.</p>
        ) : (
          <ul className="mt-8 space-y-6">
            {sorted.map((gig, i) => {
              const key = `${gig?.id || gig?.slug || gig?.date || "gig"}-${i}`;
              const when =
                gig?.date && !isNaN(new Date(gig.date))
                  ? formatDate(gig.date)
                  : gig?.date || "";

              const title =
                gig?.title ||
                [gig?.venue, gig?.city, gig?.country].filter(Boolean).join(", ") ||
                "Untitled event";

              const where = [gig?.venue, gig?.city, gig?.country].filter(Boolean).join(", ");

              return (
                <li key={key} className="rounded-xl border border-neutral-800 p-4">
                  <article className="space-y-1">
                    {when && <div className="text-sm text-neutral-300"><strong>{when}</strong></div>}
                    <div className="text-base font-medium">{title}</div>
                    {where && <div className="text-sm text-neutral-400">{where}</div>}
                    {gig?.notes && <p className="mt-2 text-sm text-neutral-300">{gig.notes}</p>}
                    <div className="mt-2 text-sm">
                      {gig?.tickets && (
                        <a
                          href={gig.tickets}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Tickets
                        </a>
                      )}
                      {gig?.link && (
                        <>
                          {" "}
                          {gig?.tickets ? "· " : null}
                          <a
                            href={gig.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            Details
                          </a>
                        </>
                      )}
                      {gig?.sold_out ? (
                        <>
                          {" "}
                          <em>(Sold out)</em>
                        </>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "public", "site-data", "gigs.json");
  let gigs = [];
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);
    gigs = Array.isArray(data) ? data : data?.gigs || [];
  } catch (err) {
    console.warn("gigs.jsx: could not read public/site-data/gigs.json:", err?.message);
    gigs = [];
  }

  return { props: { gigs } };
}

function formatDate(isoOrText) {
  const d = new Date(isoOrText);
  if (isNaN(d)) return isoOrText;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    weekday: "short",
  }).format(d);
}
