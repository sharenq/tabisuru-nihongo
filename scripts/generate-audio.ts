import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { regions } from "../src/data/regions.js";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const AUDIO_DIR = path.resolve(import.meta.dirname, "../public/audio");
const VOICE = "ja-JP-NanamiNeural";

function hashText(text: string): string {
  return crypto.createHash("md5").update(text).digest("hex").slice(0, 12);
}

async function generateAudio() {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  // Collect all unique Japanese words
  const wordSet = new Map<string, string>();
  for (const region of regions) {
    for (const pref of region.prefectures) {
      for (const word of pref.words) {
        const hash = hashText(word.japanese);
        wordSet.set(word.japanese, hash);
      }
    }
  }

  console.log(`Found ${wordSet.size} unique words to generate audio for.`);
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const manifest: Record<string, string> = {};
  let count = 0;
  let skipped = 0;

  for (const [text, hash] of wordSet) {
    const filePath = path.join(AUDIO_DIR, `${hash}.mp3`);
    manifest[text] = `${hash}.mp3`;

    if (fs.existsSync(filePath)) {
      skipped++;
      count++;
      continue;
    }

    try {
      const { audioStream } = tts.toStream(text);
      const chunks: Buffer[] = [];

      await new Promise<void>((resolve, reject) => {
        audioStream.on("data", (chunk: Buffer) => chunks.push(chunk));
        audioStream.on("end", () => resolve());
        audioStream.on("error", (err: Error) => reject(err));
      });

      const buffer = Buffer.concat(chunks);
      fs.writeFileSync(filePath, buffer);
      count++;
      if ((count - skipped) % 20 === 0) {
        console.log(`Generated: ${count - skipped} / ${wordSet.size - skipped}`);
      }
    } catch (err) {
      console.error(`Failed: "${text}":`, (err as Error).message);
    }
  }

  fs.writeFileSync(
    path.join(AUDIO_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`Done! ${count - skipped} generated, ${skipped} skipped (already existed).`);
  tts.close();
}

generateAudio().catch(console.error);
