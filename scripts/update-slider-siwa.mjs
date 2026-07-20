import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ── Raw SQL replacements for description_ar and description_en ──
const sqlReplacements = [
  // Arabic
  { col: "description_ar", from: "واحة سيوة", to: "الصحراء الغربية" },
  { col: "description_ar", from: "في سيوة", to: "في الصحراء الغربية" },
  { col: "description_ar", from: "سيوة", to: "الصحراء الغربية" },
  // English
  { col: "description_en", from: "Siwa Oasis", to: "the Western Desert" },
  { col: "description_en", from: "in Siwa", to: "in the Western Desert" },
  { col: "description_en", from: "Siwa", to: "the Western Desert" },
  // Arabic titles too
  { col: "title_ar", from: "واحة سيوة", to: "الصحراء الغربية" },
  { col: "title_ar", from: "سيوة", to: "الصحراء الغربية" },
  // English titles
  { col: "title_en", from: "Siwa Oasis", to: "the Western Desert" },
  { col: "title_en", from: "Siwa", to: "the Western Desert" },
];

// ── JSON i18n field replacements (descriptionI18n, titleI18n) ──
const i18nReplacements = {
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

function applyReplacements(text, locale) {
  if (!text) return text;
  let result = text;
  for (const [from, to] of (i18nReplacements[locale] || [])) {
    result = result.replaceAll(from, to);
  }
  return result;
}

async function main() {
  console.log("=== Updating sliders table ===\n");

  // 1. Raw SQL REPLACE on text columns (works even if text doesn't match — no-op)
  for (const { col, from, to } of sqlReplacements) {
    const result = await prisma.$executeRawUnsafe(
      `UPDATE sliders SET "${col}" = REPLACE("${col}", $1, $2) WHERE "${col}" LIKE $3`,
      from, to, `%${from}%`
    );
    if (result > 0) console.log(`  Updated ${result} row(s): ${col} "${from}" → "${to}"`);
  }

  // 2. Handle JSON i18n fields (description_i18n, title_i18n)
  const sliders = await prisma.slider.findMany();
  let jsonUpdates = 0;

  for (const slider of sliders) {
    let changed = false;
    let newDescI18n = slider.descriptionI18n;
    let newTitleI18n = slider.titleI18n;

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
        data: { descriptionI18n: newDescI18n, titleI18n: newTitleI18n },
      });
      jsonUpdates++;
      console.log(`  Updated i18n JSON for slider #${slider.id}`);
    }
  }

  // 3. Print final state
  console.log("\n=== Final slider data ===\n");
  const final = await prisma.slider.findMany();
  for (const s of final) {
    console.log(`Slider #${s.id}: ${s.titleEn}`);
    console.log(`  AR: ${s.descriptionAr?.slice(0, 100)}`);
    console.log(`  EN: ${s.descriptionEn?.slice(0, 100)}`);
    if (s.descriptionI18n) {
      for (const [loc, txt] of Object.entries(s.descriptionI18n)) {
        console.log(`  ${loc.toUpperCase()}: ${String(txt).slice(0, 100)}`);
      }
    }
    console.log("");
  }

  console.log(`Done! SQL updates applied. JSON i18n updates: ${jsonUpdates}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
