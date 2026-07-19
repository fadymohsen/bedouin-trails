import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const SECRET = "bedouin-migrate-2026";

// Fix doubled articles from previous replacement
const sqlFixes = [
  { col: "description_en", from: "in the the Western Desert", to: "in the Western Desert" },
  { col: "description_en", from: "the the Western Desert", to: "the Western Desert" },
];

const i18nFixes: Record<string, [string, string][]> = {
  en: [["in the the Western Desert", "in the Western Desert"], ["the the Western Desert", "the Western Desert"]],
  es: [["en el el Desierto Occidental", "en el Desierto Occidental"], ["el el Desierto Occidental", "el Desierto Occidental"]],
  fr: [["à l'Oasis de le Désert Occidental", "dans le Désert Occidental"], ["l'Oasis de le Désert Occidental", "le Désert Occidental"]],
  it: [["nell'il Deserto Occidentale", "nel Deserto Occidentale"]],
  nl: [["Oase de Westelijke Woestijn", "de Westelijke Woestijn"], ["in de Oase de Westelijke Woestijn", "in de Westelijke Woestijn"]],
  pt: [["no o Deserto Ocidental", "no Deserto Ocidental"], ["o o Deserto Ocidental", "o Deserto Ocidental"]],
  zh: [["西瓦绿洲", "西部沙漠"]],
};

function applyFixes(text: string, locale: string): string {
  let result = text;
  for (const [from, to] of (i18nFixes[locale] || [])) {
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

  // 1. Fix SQL columns
  for (const { col, from, to } of sqlFixes) {
    const result = await prisma.$executeRawUnsafe(
      `UPDATE sliders SET "${col}" = REPLACE("${col}", $1, $2) WHERE "${col}" LIKE $3`,
      from, to, `%${from}%`
    );
    if (result > 0) log.push(`SQL: ${result} row(s) fixed ${col}`);
  }

  // 2. Fix JSON i18n fields
  const sliders = await prisma.slider.findMany();
  for (const slider of sliders) {
    let changed = false;
    let newDescI18n = slider.descriptionI18n as Record<string, string> | null;

    if (newDescI18n && typeof newDescI18n === "object") {
      newDescI18n = { ...newDescI18n };
      for (const [locale, text] of Object.entries(newDescI18n)) {
        const updated = applyFixes(String(text), locale);
        if (updated !== String(text)) { newDescI18n[locale] = updated; changed = true; }
      }
    }

    if (changed) {
      await prisma.slider.update({
        where: { id: slider.id },
        data: { descriptionI18n: newDescI18n ?? undefined },
      });
      log.push(`Fixed i18n for slider #${slider.id}`);
    }
  }

  // 3. Return final state
  const final = await prisma.slider.findMany();
  return NextResponse.json({
    log,
    sliders: final.map(s => ({
      id: s.id,
      titleEn: s.titleEn,
      descEn: s.descriptionEn,
      descAr: s.descriptionAr,
      descI18n: s.descriptionI18n,
    })),
  });
}
