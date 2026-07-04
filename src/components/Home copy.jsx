import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { loadNights, saveNight } from "../storage/nightsStorage";

const modules = import.meta.glob("../data/nights/*.js", {
  eager: true,
});

const devSleepSessions = Object.values(modules)
  .map((mod) => mod.default)
  .filter(Boolean)
  .sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));

const sortSessions = (sessions) => {
  return [...sessions].sort(
    (a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt)
  );
};

const Notes = () => {
  const [sleepSessions, setSleepSessions] = useState(devSleepSessions);
  const [currentIndex, setCurrentIndex] = useState(devSleepSessions.length - 1);

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [modalStep, setModalStep] = useState("setup");

  const [dreamHerbs, setDreamHerbs] = useState(false);
  const [recordingStart, setRecordingStart] = useState(null);
  const [recordingEnd, setRecordingEnd] = useState(null);
  const [recordedSamples, setRecordedSamples] = useState([]);

  const [finalDreamType, setFinalDreamType] = useState("no_dream");
  const [finalNote, setFinalNote] = useState("");

  const width = 1000;
  const height = 1000;

  useEffect(() => {
    const loadStoredSessions = async () => {
      const storedNights = await loadNights();

      if (storedNights.length > 0) {
        const sorted = sortSessions(storedNights);
        setSleepSessions(sorted);
        setCurrentIndex(sorted.length - 1);
      } else {
        setSleepSessions([]);
        setCurrentIndex(0);
      }
    };

    loadStoredSessions();
  }, []);

  const session = sleepSessions[currentIndex];

  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const formatHour = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateForFile = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return {
      date: `${y}-${m}-${d}`,
      time: `${h}-${min}`,
      id: `night_${y}-${m}-${d}_${h}-${min}`,
    };
  };

  const makePath = (session, key, maxValue, gridStart, gridDuration) => {
    return session.samples
      .map((sample, i) => {
        const time = new Date(sample.timestamp).getTime();
        const x = ((time - gridStart) / gridDuration) * width;
        const y = height - (sample[key] / maxValue) * height;

        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const randomBetween = (min, max) => {
    return Math.round(min + Math.random() * (max - min));
  };

  const generateFakeSamples = (startedAt, endedAt) => {
    const start = new Date(startedAt).getTime();
    const end = new Date(endedAt).getTime();
    const duration = end - start;

    const totalSamples = randomBetween(14, 20);

    return Array.from({ length: totalSamples }).map((_, index) => {
      const ratio = index / (totalSamples - 1);
      const time = new Date(start + duration * ratio);

      const remWave = Math.max(
        0,
        Math.sin(ratio * Math.PI * randomBetween(3, 6) - 1)
      );

      const rhythmSpike = Math.random() > 0.72 ? randomBetween(35, 70) : 0;

      const movement = Math.min(
        100,
        Math.max(4, randomBetween(12, 45) + rhythmSpike - remWave * 18)
      );

      const ir = Math.min(
        1000,
        Math.max(30, randomBetween(80, 260) + remWave * randomBetween(520, 850))
      );

      return {
        timestamp: time.toISOString(),
        movement,
        ir,
      };
    });
  };

  const previousNight = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const nextNight = () => {
    setCurrentIndex((prev) => Math.min(sleepSessions.length - 1, prev + 1));
  };

  const handleSwipeEnd = (event, info) => {
    if (!session) return;

    if (info.offset.x < -60 || info.velocity.x < -500) {
      nextNight();
    }

    if (info.offset.x > 60 || info.velocity.x > 500) {
      previousNight();
    }
  };

  const openNewModal = () => {
    setDreamHerbs(false);
    setRecordingStart(null);
    setRecordingEnd(null);
    setRecordedSamples([]);
    setFinalDreamType("no_dream");
    setFinalNote("");
    setModalStep("setup");
    setIsNewOpen(true);
  };

  const startRecording = () => {
    const startedAt = new Date();

    setRecordingStart(startedAt);
    setRecordingEnd(null);
    setRecordedSamples([]);
    setModalStep("recording");
  };

  const stopRecording = () => {
    const endedAt = new Date();
    const samples = generateFakeSamples(recordingStart, endedAt);

    setRecordingEnd(endedAt);
    setRecordedSamples(samples);
    setModalStep("finish");
  };

  const saveRecording = async () => {
    const startedAt = recordingStart;
    const endedAt = recordingEnd;

    const fileData = formatDateForFile(startedAt);

    const savedSession = {
      id: fileData.id,
      date: fileData.date,

      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),

      result: {
        dreamType: finalDreamType,
        savedAt: new Date().toISOString(),
        note: finalDreamType === "no_dream" ? " " : finalNote,
      },

      intake: {
        dreamHerbs,
      },

      samples: recordedSamples,
    };

    await saveNight(savedSession);

    const storedNights = await loadNights();
    const nextSessions = sortSessions(storedNights);

    setSleepSessions(nextSessions);
    setCurrentIndex(nextSessions.length - 1);
    setIsNewOpen(false);
  };

  const renderModal = () => {
    if (!isNewOpen) return null;

    return (
      <div className="new-night-modal">
        <div className="new-night-card">
          {modalStep === "setup" && (
            <>
              <h2 className="new-night-title">New recording</h2>

              <div className="dream-herbs">
                <p className="new-night-description">
                  Did you take dream herbs before sleep?
                </p>

                <div className="new-night-choice-row">
                  <button
                    className={`new-night-choice-button ${
                      dreamHerbs ? "active" : ""
                    }`}
                    onClick={() => setDreamHerbs(true)}
                  >
                    Yes
                  </button>

                  <button
                    className={`new-night-choice-button ${
                      !dreamHerbs ? "active" : ""
                    }`}
                    onClick={() => setDreamHerbs(false)}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="new-night-actions">
                <button
                  className="new-night-button"
                  onClick={() => setIsNewOpen(false)}
                >
                  Close
                </button>

                <button
                  className="new-night-button primary"
                  onClick={startRecording}
                >
                  Start recording
                </button>
              </div>
            </>
          )}

          {modalStep === "recording" && (
            <>
              <h2 className="new-night-title">Recording...</h2>

              <p className="new-night-description">
                Fake BLE recording is running.
              </p>

              <div className="new-night-actions">
                <button
                  className="new-night-button primary"
                  onClick={stopRecording}
                >
                  Stop
                </button>
              </div>
            </>
          )}

          {modalStep === "finish" && (
            <>
              <h2 className="new-night-title">Dream result</h2>

              <p className="new-night-description">
                What happened during this sleep session?
              </p>

              <div className="new-night-choice-row">
                <button
                  className={`new-night-choice-button ${
                    finalDreamType === "no_dream" ? "active" : ""
                  }`}
                  onClick={() => setFinalDreamType("no_dream")}
                >
                  No dream
                </button>

                <button
                  className={`new-night-choice-button ${
                    finalDreamType === "dream" ? "active" : ""
                  }`}
                  onClick={() => setFinalDreamType("dream")}
                >
                  Dream
                </button>

                <button
                  className={`new-night-choice-button ${
                    finalDreamType === "lucid_dream" ? "active" : ""
                  }`}
                  onClick={() => setFinalDreamType("lucid_dream")}
                >
                  Lucid dream
                </button>
              </div>

              {finalDreamType !== "no_dream" && (
                <textarea
                  className="new-night-textarea"
                  value={finalNote}
                  onChange={(event) => setFinalNote(event.target.value)}
                  placeholder="Write your dream note..."
                />
              )}

              <div className="new-night-actions">
                <button
                  className="new-night-button"
                  onClick={() => setIsNewOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="new-night-button primary"
                  onClick={saveRecording}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderNightSlide = () => {
    if (!session) {
      return (
        <div className="empty-night-main">
          <h1 className="no-night-title-main">No nights yet</h1>
          <p className="no-new-night-description">
            Press <span className="span-description">New</span> to start your first recording.
          </p>
        </div>
      );
    }

    const titleDate = capitalize(
      new Date(session.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );

    const hasDreamHerbs = session.intake?.dreamHerbs === true;
    const dreamType = session.result?.dreamType ?? "no_dream";
    const note = session.result?.note;

    const gridStart = new Date(session.startedAt).getTime();
    const gridEnd = new Date(session.endedAt).getTime();
    const gridDuration = gridEnd - gridStart;

    const hourMarks = [
      { label: formatHour(gridStart), time: gridStart },
      {
        label: formatHour(gridStart + gridDuration * 0.25),
        time: gridStart + gridDuration * 0.25,
      },
      {
        label: formatHour(gridStart + gridDuration * 0.5),
        time: gridStart + gridDuration * 0.5,
      },
      {
        label: formatHour(gridStart + gridDuration * 0.75),
        time: gridStart + gridDuration * 0.75,
      },
      { label: formatHour(gridEnd), time: gridEnd },
    ];

    const movementPath = makePath(
      session,
      "movement",
      100,
      gridStart,
      gridDuration
    );

    const irPath = makePath(session, "ir", 1000, gridStart, gridDuration);

    return (
      <motion.section
        className="night-slide-main"
        key={session.id}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleSwipeEnd}
      >
        <div className="test-main">
          <div className="night-header-main">
            <h1 className="title-main">{titleDate}</h1>

            <div className="title-dream-main">
              <span
                className={`night-badge-main ${
                  hasDreamHerbs ? "herbs-active-main" : "herbs-inactive-main"
                }`}
              >
                {hasDreamHerbs ? "Dream herbs" : "No herbs"}
              </span>

              <span className={`night-badge-main ${dreamType}`}>
                {dreamType === "lucid_dream"
                  ? "Lucid dream"
                  : dreamType === "dream"
                  ? "Dream"
                  : "No dream"}
              </span>
            </div>
          </div>

          <div className="chart-card-main">
            <svg viewBox={`0 0 ${width} ${height}`} className="chart-main">
              {hourMarks.map((mark) => {
                const x = ((mark.time - gridStart) / gridDuration) * width;

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

            <div className="time-row-main">
              {hourMarks.map((mark) => (
                <span key={mark.label}>{mark.label}</span>
              ))}
            </div>
          </div>

          {note && (
            <div className="dream-note-wrapper">
              <div className="dream-note-box-main">{note}</div>
              <div className="dream-note-fade" />
            </div>
          )}
        </div>
      </motion.section>
    );
  };

  return (
    <div className="home-main">
      <div className="swipe-container-main">
        {renderNightSlide()}

        <div className="dreams-navigation-main">
          <div className="buttons">
            <button className="note-button-main" onClick={openNewModal}>
              New
            </button>
          </div>
        </div>

        {renderModal()}
      </div>
    </div>
  );
};

export default Notes;