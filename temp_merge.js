const fs = require('fs');
const path = require('path');

// Read existing German translations
const existingDe = JSON.parse(fs.readFileSync('./messages/de.json', 'utf8'));

// Read English missing keys from scratchpad
const scratchpadPath = 'C:\Users\MANDO\AppData\Local\Temp\claude\d--projects-bedouin-live\196f32c2-4500-4984-a166-075520e50e78\scratchpad\i18n\de-missing-en.json';
const missingEn = JSON.parse(fs.readFileSync(scratchpadPath, 'utf8'));

// Translation dictionary - maps English keys to German
const translations = {
  'guide_whitetour_besttime_h2': 'Beste Zeit zum Besuchen der Weißen Wüste',
  'guide_whitetour_besttime_p1': 'Die besten Monate für eine Weiße Wüste Tour sind',
  'guide_whitetour_besttime_p1_bold': 'Oktober bis April',
  'guide_whitetour_besttime_p1_cont': '. Während dieser Monate liegen die Tagestemperaturen zwischen 18–28°C, perfekt für Erkundung und Fotografie. Die Nächte sind kühl (5–15°C), aber komfortabel mit angemessener Campingausrüstung. Vermeiden Sie Juni bis August, wenn die Temperaturen 45°C übersteigen können.',
  'guide_whitetour_faq_h2': 'Häufig gestellte Fragen',
  'guide_whitetour_faq1_q': 'Wie viel kostet eine 2-Tages-Tour zur Weißen Wüste?',
  'guide_whitetour_faq1_a': 'Die Preise hängen von der Gruppengröße ab. Einzelreisende, Paare und private Gruppen sind alle willkommen. Kontaktieren Sie uns für aktuelle Tarife — alle Touren beinhalten Transport, Mahlzeiten, Camping und Guide.',
  'guide_whitetour_faq2_q': 'Ist die Weiße Wüste sicher?',
  'guide_whitetour_faq2_a': 'Ja. Die Weiße Wüste ist ein gut besuchter Nationalpark. Unsere Beduinen-Guides haben jahrzehntelange Wüstenerfahrung und wir führen vollständige Sicherheits- und Kommunikationsausrüstung auf jeder Reise mit.',
  'guide_whitetour_faq3_q': 'Kann ich auf eine 3-Tages-Tour verlängern?',
  'guide_whitetour_faq3_a': 'Absolut. Wir bieten 3-Tages-, 4-Tages- und längere mehrtägige Wüstentrekking an, die zusätzliche Ziele wie Djara-Höhle, das Große Sandmeer und Agabat Valley beinhalten.',
  'guide_whitetour_faq4_q': 'Ist es für Kinder geeignet?',
  'guide_whitetour_faq4_a': 'Ja, Familien sind willkommen. Die 2-Tages-Tour zur Weißen Wüste ist für Kinder ab 5 Jahren geeignet. Wir passen das Tempo und die Aktivitäten für Familien an.',
  'guide_whitetour_cta': 'Bereit, die Weiße Wüste zu erkunden?',
  'guide_whitetour_cta_button': 'Buchen Sie Ihre Weiße Wüste Tour',
};

// Merge with more comprehensive translations
const allTranslations = {};

// Add all missing English keys - convert to German
const keysToDe = {
  'guide_black_breadcrumb': 'Schwarze Wüste Ägypten',
  'guide_black_title': 'Black Desert Ägypten Tour | Anleitung zur vulkanischen Wüstenlandschaft Ägyptens',
  'guide_black_meta_desc': 'Erkunden Sie die Schwarze Wüste in der Westlichen Wüste Ägyptens — eine dramatische vulkanische Landschaft mit dunklen Dolerit-Hügeln zwischen Bahariya-Oase und Weißer Wüste. Vollständige Anleitung zum Besuch mit Bedouin Trails.',
  'guide_black_meta_keywords': 'Schwarze Wüste Ägypten Tour, Schwarze Wüste Ägypten, Schwarze Wüste Westliche Wüste, vulkanische Wüste Ägypten, Ägypten Wüstentour, Bahariya-Oasen-Tour, Westliche Wüste Ägypten, Ägypten Safari-Touren, Weiße Wüste Ägypten, Wüsten-Trekking Ägypten, Kairo Wüstentour, Schwarze Wüste Camping',
  'guide_black_og_title': 'Schwarze Wüste Ägypten Tour | Vulkanische Wüstenlandschaft',
  'guide_black_og_desc': 'Erkunden Sie die Schwarze Wüste — Ägyptens dramatische vulkanische Landschaft zwischen Bahariya-Oase und Weißer Wüste. Buchen Sie bei Bedouin Trails.',
  'guide_black_twitter_title': 'Schwarze Wüste Ägypten | Vulkanische Wüstentour',
  'guide_black_twitter_desc': 'Erkunden Sie die Schwarze Wüste — Ägyptens dramatische vulkanische Landschaft. Buchen Sie eine Tour mit Bedouin Trails.',
  'guide_black_h1': 'Schwarze Wüste Ägypten: Anleitung zur vulkanischen Wüste',
  'guide_black_intro_p': 'Die Schwarze Wüste (El-Sahra El-Souda) ist eine der visuell schlagkräftigsten Landschaften in der Westlichen Wüste Ägyptens. Zwischen Bahariya-Oase und Weißer Wüste gelegen, weist dieses dramatische Gelände dunkle vulkanische Hügel mit schwarzem Dolerit und Basaltsteinen auf — ein starker Kontrast zu goldenem Sand und kreideweißen Formationen weiter südlich.',
  'guide_black_what_h2': 'Was ist die Schwarze Wüste?',
  'guide_black_what_p1': 'Die Schwarze Wüste ist eine vulkanischen Ursprungs, wo alte Eruptionen dunkle Doleritsteine über Hügel und Wüstenboden verteilt haben. Die schwarzen Steine absorbieren Wärme und lassen die Gegend mittags shimmer. Aus der Ferne sieht die Hügel so aus, als wären sie mit Holzkohle bestäubt worden. Die Landschaft ist mit kegelförmigen Bergen geprägt, einige sind erklimmbar und bieten Panoramablicke auf die umliegende Wüste.',
  'guide_black_what_p2': 'Im Gegensatz zu den windgefrästen Kreidformationen der Weißen Wüste wurde die Landschaft der Schwarzen Wüste vor Millionen von Jahren durch vulkanische Aktivität geformt. Zusammen bilden sie einen der fotogenischsten Wüstenkontraste der Erde.',
};

// Merge translations
Object.assign(allTranslations, keysToDe);

// Combine with existing and write
const merged = {...existingDe, ...allTranslations};

// Only include keys that are in the missing file or existing file
const finalDe = {};
Object.keys(merged).forEach(key => {
  finalDe[key] = merged[key];
});

// Check what's still missing
const missingKeys = Object.keys(missingEn).filter(k => !(k in finalDe));

console.log('Total keys to merge:', Object.keys(merged).length);
console.log('Missing German translations remaining:', missingKeys.length);
console.log('Writing to file...');

fs.writeFileSync('./messages/de.json', JSON.stringify(finalDe, null, 2), 'utf8');
console.log('Done!');

