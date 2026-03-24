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

  // Collect all unique words: key=japanese (for manifest), ttsInput=hiragana (for pronunciation)
  const wordMap = new Map<string, { hiragana: string; hash: string }>();
  for (const region of regions) {
    for (const pref of region.prefectures) {
      for (const word of pref.words) {
        // Use hiragana for TTS to ensure correct pronunciation
        const hash = hashText(word.hiragana);
        wordMap.set(word.japanese, { hiragana: word.hiragana, hash });
      }
    }
  }

  console.log(`Found ${wordMap.size} unique words to generate audio for.`);
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  // Clean old mp3 files
  for (const file of fs.readdirSync(AUDIO_DIR)) {
    if (file.endsWith(".mp3")) {
      fs.unlinkSync(path.join(AUDIO_DIR, file));
    }
  }

  const manifest: Record<string, string> = {};
  let count = 0;

  // Dedupe by hiragana to avoid generating the same audio twice
  const hiraganaToHash = new Map<string, string>();
  for (const { hiragana, hash } of wordMap.values()) {
    hiraganaToHash.set(hiragana, hash);
  }

  // Generate audio for each unique hiragana
  for (const [hiragana, hash] of hiraganaToHash) {
    const filePath = path.join(AUDIO_DIR, `${hash}.mp3`);

    if (fs.existsSync(filePath)) {
      count++;
      continue;
    }

    try {
      const { audioStream } = tts.toStream(hiragana);
      const chunks: Buffer[] = [];

      await new Promise<void>((resolve, reject) => {
        audioStream.on("data", (chunk: Buffer) => chunks.push(chunk));
        audioStream.on("end", () => resolve());
        audioStream.on("error", (err: Error) => reject(err));
      });

      const buffer = Buffer.concat(chunks);
      fs.writeFileSync(filePath, buffer);
      count++;
      if (count % 20 === 0) {
        console.log(`Generated: ${count} / ${hiraganaToHash.size}`);
      }
    } catch (err) {
      console.error(`Failed: "${hiragana}":`, (err as Error).message);
    }
  }

  // Build manifest: japanese text -> audio file
  for (const [japanese, { hash }] of wordMap) {
    manifest[japanese] = `${hash}.mp3`;
  }

  fs.writeFileSync(
    path.join(AUDIO_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`Done! Generated ${count} audio files.`);
  tts.close();
}

generateAudio().catch(console.error);
