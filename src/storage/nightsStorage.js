import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

const NIGHTS_DIR = "nights";

export const saveNight = async (session) => {
  const filename = `${session.date}_${session.id}.json`;

  try {
    await Filesystem.mkdir({
      path: NIGHTS_DIR,
      directory: Directory.Data,
      recursive: true,
    });
  } catch {}

  await Filesystem.writeFile({
    path: `${NIGHTS_DIR}/${filename}`,
    data: JSON.stringify(session, null, 2),
    directory: Directory.Data,
    encoding: Encoding.UTF8,
  });

  return filename;
};

export const loadNights = async () => {
  try {
    const dir = await Filesystem.readdir({
      path: NIGHTS_DIR,
      directory: Directory.Data,
    });

    const files = dir.files.filter((file) =>
      file.name.endsWith(".json")
    );

    const sessions = await Promise.all(
      files.map(async (file) => {
        const result = await Filesystem.readFile({
          path: `${NIGHTS_DIR}/${file.name}`,
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        });

        return JSON.parse(result.data);
      })
    );

    return sessions.sort(
      (a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt)
    );
  } catch {
    return [];
  }
};