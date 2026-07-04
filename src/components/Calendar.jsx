import { useEffect, useState } from "react";

import Hexagon from "../assets/icons/hexagon.svg";
import HexagonBlank from "../assets/icons/hexagon-blank.svg";
import HexagonBrown from "../assets/icons/hexagon-brown.svg";
import HexagonOrange from "../assets/icons/hexagon-orange.svg";

import { loadNights } from "../storage/nightsStorage";

const modules = import.meta.glob("../data/nights/*.js", {
  eager: true,
});

const devSleepSessions = Object.values(modules)
  .map((mod) => mod.default)
  .filter(Boolean)
  .sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));

const sortSessions = (sessions) => {
  return [...sessions].sort(
    (a, b) =>
      Date.parse(a.startedAt) -
      Date.parse(b.startedAt)
  );
};

const getHexagonIcon = (dreamType) => {
  if (dreamType === "lucid_dream") return HexagonOrange;
  if (dreamType === "dream") return HexagonBrown;
  if (dreamType === "no_dream") return HexagonBlank;

  return Hexagon;
};

const Calendar = () => {
  const [sleepSessions, setSleepSessions] =
    useState(devSleepSessions);

  useEffect(() => {
    const loadStoredSessions = async () => {
      const storedNights = await loadNights();

      if (storedNights.length > 0) {
        setSleepSessions(sortSessions(storedNights));
      }
    };

    loadStoredSessions();
  }, []);

  const totalSlots = 200;

  const slots = Array.from({
    length: totalSlots,
  });

  sleepSessions.forEach((session, index) => {
    slots[index] = session;
  });

  const rows = [];

  for (let i = 0; i < slots.length; i += 5) {
    rows.push(slots.slice(i, i + 5));
  }

  const getLineClass = (index) => {
    if (index === 0) return "five-line-one";
    if (index % 2 === 1) return "five-line-two";

    return "five-line-three";
  };

  return (
    <div className="hexagonal-calendar">
      {rows.map((row, rowIndex) => (
        <div
          className={getLineClass(rowIndex)}
          key={rowIndex}
        >
          {row.map((session, index) => {
            if (!session) {
              return (
                <img
                  key={`empty-${rowIndex}-${index}`}
                  src={Hexagon}
                  alt="Empty"
                  style={{
                    position: "relative",
                    zIndex: 1,
                  }}
                />
              );
            }

            const dreamType =
              session.result?.dreamType ?? "no_dream";

            const icon = getHexagonIcon(dreamType);

            const isDream =
              dreamType === "dream" ||
              dreamType === "lucid_dream";

            const isNoDream = dreamType === "no_dream";

            return (
              <img
                key={session.id}
                src={icon}
                alt={dreamType}
                title={`${session.date} — ${dreamType}`}
                style={{
                  position: "relative",
                  zIndex: isDream ? 10 : isNoDream ? 5 : 1,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Calendar;