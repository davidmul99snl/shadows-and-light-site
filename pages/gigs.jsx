// pages/gigs.jsx
import { useState } from "react";
import Head from "next/head";
import path from "path";
import fs from "fs/promises";

const HERO = "/hero-giglive.jpg";

function formatIrishDate(isoDate) {
  const d = new Date(isoDate);
  if (isNaN(d)) return isoDate;
  return d.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getGigTime(gig) {
  if (!gig?.date) return Number.MAX_SAFE_INTEGER;
  const time = new Date(gig.date).getTime();
  return isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
}

export default function Gigs({ gigs }) {
  const [activeTab, setActiveTab] = useState("upcoming");

  const list = Array.isArray(gigs) ? gigs : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sorted = [...list].sort((a, b) => getGigTime(a) - getGigTime(b));

  const upcoming = sorted.filter((gig) => {
    const d = new Date(gig?.date);
    if (isNaN(d)) return true;
    d.setHours(0, 0, 0, 0);
    return d >= today;
  });

  const past = sorted
    .filter((gig) => {
      const d = new Date(gig?.date);
      if (isNaN(d)) return false;
      d.setHours(0, 0, 0, 0);
      return d < today;
    })
    .reverse();

  const visibleGigs = activeTab === "upcoming" ? upcoming : past;

  return (
    <>
      <Head>
        <title>Gigs — Shadows &amp; Light</title>
        <meta
          name="description"
          content="Upcoming and past gigs for Shadows & Light"
        />
      </Head>

      {/* Hero banner */}
      <div className="mt-6 px-4">
        <div className="mx-auto max-w-6xl">
          <img
            src={HERO}
            alt="Shadows & Light live"
            className="w-full h-[240px] sm:h-[320px] md:h-[380px] object-cover object-center rounded-xl shadow-sm"
          />
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Gigs</h1>

        <div
          className="mt-8 border border-neutral-800 rounded-lg overflow-hidden"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            width: "100%",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className="px-4 py-3 text-sm font-medium text-center transition"
            style={{
              display: "block",
              width: "100%",
              backgroundColor:
                activeTab === "upcoming" ? "#ffffff" : "#111111",
              color: activeTab === "upcoming" ? "#000000" : "#737373",
            }}
          >
            Upcoming gigs
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("past")}
            className="px-4 py-3 text-sm font-medium text-center transition"
            style={{
              display: "block",
              width: "100%",
              borderLeft: "1px solid #262626",
              backgroundColor: activeTab === "past" ? "#404040" : "#000000",
              color: activeTab === "past" ? "#f5f5f5" : "#737373",
            }}
          >
            Past gigs
          </button>
        </div>

        {visibleGigs.length === 0 ? (
          <p className="mt-8 text-neutral-400">
            {activeTab === "upcoming"
              ? "No upcoming gigs to show yet."
              : "No past gigs to show yet."}
          </p>
        ) : (
          <ul className="mt-8">
            {visibleGigs.map((gig, i) => {
              const key = `${gig?.id || gig?.slug || gig?.date || "gig"}-${i}`;

              const when =
                gig?.date && !isNaN(new Date(gig.date))
                  ? formatIrishDate(gig.date)
                  : gig?.date || "";

              const title = gig?.title || gig?.venue || "Untitled event";

              // City and optionally country only — avoids printing venue twice
              const where = [gig?.city, gig?.country].filter(Boolean).join(", ");

              return (
                <li key={key} className="py-4">
                  {when && (
                    <div className="text-sm text-neutral-300 font-medium">
                      {when}
                    </div>
                  )}

                  <div className="text-base font-medium">{title}</div>

                  {where && (
                    <div className="text-sm text-neutral-400">{where}</div>
                  )}

                  {gig?.notes && (
                    <div className="text-sm text-neutral-300">{gig.notes}</div>
                  )}

                  <div className="pt-2 text-sm">
                    {activeTab === "upcoming" &&
                    gig?.tickets &&
                    gig.tickets !== "TBC" ? (
                      <a
                        href={gig.tickets}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#2563eb",
                          textDecoration: "underline",
                          textDecorationColor: "#2563eb",
                          fontWeight: 500,
                        }}
                      >
                        Tickets
                      </a>
                    ) : activeTab === "upcoming" && gig?.tickets === "TBC" ? (
                      <span className="text-neutral-400">Tickets TBC</span>
                    ) : null}

                    {gig?.link && (
                      <>
                        {" "}
                        {activeTab === "upcoming" && gig?.tickets ? "· " : null}
                        <a
                          href={gig.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline decoration-blue-500 underline-offset-4 font-medium"
                        >
                          Details
                        </a>
                      </>
                    )}

                    {gig?.sold_out ? (
                      <>
                        {" "}
                        <em className="text-neutral-300">(Sold out)</em>
                      </>
                    ) : null}
                  </div>

                  {/* Divider between gigs */}
                  {i < visibleGigs.length - 1 && (
                    <hr className="mt-4 border-neutral-800" />
                  )}
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
    console.warn(
      "gigs.jsx: could not read public/site-data/gigs.json:",
      err?.message
    );
    gigs = [];
  }

  return { props: { gigs } };
}
