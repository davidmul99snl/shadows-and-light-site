import Head from "next/head";
import path from "path";
import fs from "fs";

const HERO = '/hero-giglive.jpg'

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
        <title>Gigs | Shadows &amp; Light</title>
        <meta name="description" content="Upcoming and past gigs for Shadows & Light" />
      </Head>
      <main>
        <h1>Gigs</h1>

        {sorted.length === 0 ? (
          <p>No gigs to show yet.</p>
        ) : (
          <ul>
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

              const where = [gig?.venue, gig?.city, gig?.country]
                .filter(Boolean)
                .join(", ");

              return (
                <li key={key} style={{ marginBottom: "1rem" }}>
                  <article>
                    {when && <div><strong>{when}</strong></div>}
                    <div>{title}</div>
                    {where && <div>{where}</div>}
                    {gig?.notes && <p>{gig.notes}</p>}
                    <div style={{ marginTop: "0.25rem" }}>
                      {gig?.tickets && (
                        <a href={gig.tickets} target="_blank" rel="noopener noreferrer">
                          Tickets
                        </a>
                      )}
                      {gig?.link && (
                        <>
                          {" "}
                          {gig?.tickets ? "· " : null}
                          <a href={gig.link} target="_blank" rel="noopener noreferrer">
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
    const raw = await fs.promises.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);
    gigs = Array.isArray(data) ? data : data?.gigs || [];
  } catch (err) {
    // If gigs.json is missing or invalid, render an empty list instead of failing the build.
    console.warn("gigs.jsx: could not read public/site-data/gigs.json:", err?.message);
    gigs = [];
  }

  return {
    props: { gigs },
  };
}

function formatDate(isoOrText) {
  const d = new Date(isoOrText);
  if (isNaN(d)) return isoOrText; // leave as-is if not parseable
  // Use a compact, locale-friendly format. Adjust to taste.
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    weekday: "short",
  }).format(d);
}
