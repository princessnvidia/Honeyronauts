import { useEffect, useState } from "react";

import { loadNights } from "../storage/nightsStorage";

const modules = import.meta.glob("../data/nights/*.js", {
  eager: true,
});

const devSleepSessions = Object.values(modules)
  .map((mod) => mod.default)
  .filter(Boolean)
  .sort(
    (a, b) =>
      Date.parse(b.startedAt) -
      Date.parse(a.startedAt)
  );

const sortSessions = (sessions) => {
  return [...sessions].sort(
    (a, b) =>
      Date.parse(b.startedAt) -
      Date.parse(a.startedAt)
  );
};

const Home = () => {

  const [openedNotes, setOpenedNotes] = useState({});

  const [sleepSessions, setSleepSessions] =
    useState(devSleepSessions);

  const width = 1000;
  const height = 280;

  useEffect(() => {

    const loadStoredSessions = async () => {

      const storedNights =
        await loadNights();

      if (storedNights.length > 0) {

        setSleepSessions(
          sortSessions(storedNights)
        );
      }
    };

    loadStoredSessions();

  }, []);

  const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const formatHour = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const makePath = (
    session,
    key,
    maxValue,
    gridStart,
    gridDuration
  ) => {

    return session.samples
      .map((sample, i) => {

        const time =
          new Date(sample.timestamp)
          .getTime();

        const x =
          ((time - gridStart)
          / gridDuration)
          * width;

        const y =
          height
          - (sample[key] / maxValue)
          * height;

        return `
          ${i === 0 ? "M" : "L"}
          ${x}
          ${y}
        `;
      })
      .join(" ");
  };

  const toggleNote = (id) => {

    setOpenedNotes((prev) => ({
      ...prev,

      [id]: !prev[id],
    }));
  };

  return (

    <div className="home">

      <div className="swipe-container">

        {sleepSessions.map((session) => {

          const titleDate = capitalize(

            new Date(session.date)
            .toLocaleDateString(
              "fr-FR",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )
          );

          const hasDreamHerbs =
            session.intake?.dreamHerbs === true;

          const dreamType =
            session.result?.dreamType
            ?? "no_dream";

          const note =
            session.result?.note?.trim();

          const gridStart =
            new Date(session.startedAt)
            .getTime();

          const gridEnd =
            new Date(session.endedAt)
            .getTime();

          const gridDuration =
            gridEnd - gridStart;

          const hourMarks = [

            {
              label:
                formatHour(gridStart),

              time:
                gridStart,
            },

            {
              label:
                formatHour(
                  gridStart
                  + gridDuration * 0.25
                ),

              time:
                gridStart
                + gridDuration * 0.25,
            },

            {
              label:
                formatHour(
                  gridStart
                  + gridDuration * 0.5
                ),

              time:
                gridStart
                + gridDuration * 0.5,
            },

            {
              label:
                formatHour(
                  gridStart
                  + gridDuration * 0.75
                ),

              time:
                gridStart
                + gridDuration * 0.75,
            },

            {
              label:
                formatHour(gridEnd),

              time:
                gridEnd,
            },
          ];

          const movementPath =
            makePath(
              session,
              "movement",
              100,
              gridStart,
              gridDuration
            );

          const irPath =
            makePath(
              session,
              "ir",
              1000,
              gridStart,
              gridDuration
            );

          return (

            <section
              className="night-slide"
              key={session.id}
            >

              <div className="night-header">

                <h1 className="title">
                  {titleDate}
                </h1>

                <div className="title-dream">

                  <span
                    className={`
                      night-badge
                      ${hasDreamHerbs
                        ? "herbs-active"
                        : "herbs-inactive"
                      }
                    `}
                  >

                    {
                      hasDreamHerbs
                        ? "Dream herbs"
                        : "No herbs"
                    }

                  </span>

                  <span
                    className={`
                      night-badge
                      ${dreamType}
                    `}
                  >

                    {
                      dreamType === "lucid_dream"
                        ? "Lucid dream"

                      : dreamType === "dream"
                        ? "Dream"

                      : "No dream"
                    }

                  </span>

                </div>

              </div>

              <div className="chart-card">

                <svg
                  viewBox={`0 0 ${width} ${height}`}
                  className="chart"
                >

                  {hourMarks.map((mark) => {

                    const x =
                      ((mark.time - gridStart)
                      / gridDuration)
                      * width;

                    return (

                      <line
                        key={mark.label}

                        x1={x}
                        y1="0"

                        x2={x}
                        y2={height}

                        stroke="#2e2e36"

                        strokeWidth="2"
                      />
                    );
                  })}

                  <path
                    d={movementPath}

                    fill="none"

                    stroke="#ff8f17"

                    strokeWidth="4"

                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d={irPath}

                    fill="none"

                    stroke="#ff5500"

                    strokeWidth="4"

                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                </svg>

                <div className="time-row">

                  {hourMarks.map((mark) => (

                    <span key={mark.label}>
                      {mark.label}
                    </span>

                  ))}

                </div>

              </div>

              {note && (

                <div className="night-note-wrapper">

                  <button
                    type="button"

                    className="note-button"

                    onClick={() => toggleNote(session.id)}
                  >

                    {openedNotes[session.id]
                      ? "Close note"
                      : "Open note"}

                  </button>

                  {openedNotes[session.id] && (

                    <div className="dream-note-box">
                      {note}
                    </div>

                  )}

                </div>
              )}

            </section>
          );
        })}

      </div>

    </div>
  );
};

export default Home;