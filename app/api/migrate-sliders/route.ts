import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const SECRET = "bedouin-migrate-2026";

const sqlReplacements = [
  { col: "description_ar", from: "واحة سيوة", to: "الصحراء الغربية" },
  { col: "description_ar", from: "في سيوة", to: "في الصحراء الغربية" },
  { col: "description_ar", from: "سيوة", to: "الصحراء الغربية" },
  { col: "description_en", from: "Siwa Oasis", to: "the Western Desert" },
  { col: "description_en", from: "in Siwa", to: "in the Western Desert" },
  { col: "description_en", from: "Siwa", to: "the Western Desert" },
  { col: "title_ar", from: "واحة سيوة", to: "الصحراء الغربية" },
  { col: "title_ar", from: "سيوة", to: "الصحراء الغربية" },
  { col: "title_en", from: "Siwa Oasis", to: "the Western Desert" },
  { col: "title_en", from: "Siwa", to: "the Western Desert" },
];

const i18nReplacements: Record<string, [string, string][]> = {
  ar: [["واحة سيوة", "الصحراء الغربية"], ["في سيوة", "في الصحراء الغربية"], ["سيوة", "الصحراء الغربية"]],
  en: [["Siwa Oasis", "the Western Desert"], ["in Siwa", "in the Western Desert"], ["Siwa", "the Western Desert"]],
  de: [["Oase Siwa", "der Westlichen Wüste"], ["Siwa-Oase", "Westliche Wüste"], ["Siwa", "Westliche Wüste"]],
  es: [["Oasis de Siwa", "el Desierto Occidental"], ["en Siwa", "en el Desierto Occidental"], ["Siwa", "el Desierto Occidental"]],
  fr: [["l'oasis de Siwa", "le Désert Occidental"], ["oasis de Siwa", "Désert Occidental"], ["Siwa", "le Désert Occidental"]],
  it: [["Oasi di Siwa", "il Deserto Occidentale"], ["a Siwa", "nel Deserto Occidentale"], ["Siwa", "il Deserto Occidentale"]],
  nl: [["Siwa-oase", "de Westelijke Woestijn"], ["in Siwa", "in de Westelijke Woestijn"], ["Siwa", "de Westelijke Woestijn"]],
  pt: [["Oásis de Siwa", "o Deserto Ocidental"], ["em Siwa", "no Deserto Ocidental"], ["Siwa", "o Deserto Ocidental"]],
  zh: [["锡瓦绿洲", "西部沙漠"], ["在锡瓦", "在西部沙漠"], ["锡瓦", "西部沙漠"], ["Siwa", "Western Desert"]],
};

function applyReplacements(text: string, locale: string): string {
  let result = text;
  for (const [from, to] of (i18nReplacements[locale] || [])) {
    result = result.replaceAll(from, to);
  }
  return result;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const log: string[] = [];

  // 1. Raw SQL REPLACE on text columns
  for (const { col, from, to } of sqlReplacements) {
    const result = await prisma.$executeRawUnsafe(
      `UPDATE sliders SET "${col}" = REPLACE("${col}", $1, $2) WHERE "${col}" LIKE $3`,
      from, to, `%${from}%`
    );
    if (result > 0) log.push(`SQL: ${result} row(s) updated ${col} "${from}" → "${to}"`);
  }

  // 2. Handle JSON i18n fields
  const sliders = await prisma.slider.findMany();
  for (const slider of sliders) {
    let changed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newDescI18n = slider.descriptionI18n as Record<string, string> | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newTitleI18n = slider.titleI18n as Record<string, string> | null;

    if (newDescI18n && typeof newDescI18n === "object") {
      newDescI18n = { ...newDescI18n };
      for (const [locale, text] of Object.entries(newDescI18n)) {
        const updated = applyReplacements(String(text), locale);
        if (updated !== String(text)) { newDescI18n[locale] = updated; changed = true; }
      }
    }

    if (newTitleI18n && typeof newTitleI18n === "object") {
      newTitleI18n = { ...newTitleI18n };
      for (const [locale, text] of Object.entries(newTitleI18n)) {
        const updated = applyReplacements(String(text), locale);
        if (updated !== String(text)) { newTitleI18n[locale] = updated; changed = true; }
      }
    }

    if (changed) {
      await prisma.slider.update({
        where: { id: slider.id },
        data: { descriptionI18n: newDescI18n ?? undefined, titleI18n: newTitleI18n ?? undefined },
      });
      log.push(`JSON i18n updated for slider #${slider.id}`);
    }
  }

  // 3. Return final state
  const final = await prisma.slider.findMany();
  return NextResponse.json({
    log,
    sliders: final.map(s => ({
      id: s.id,
      titleEn: s.titleEn,
      titleAr: s.titleAr,
      descEn: s.descriptionEn,
      descAr: s.descriptionAr,
      descI18n: s.descriptionI18n,
    })),
  });
}
