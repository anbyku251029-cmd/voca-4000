// Builder for Level 6 (4000 Essential English Words Book 6)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const titles6 = {
  1: "The Alchemist's Discovery",
  2: "The Voyage of the Navigator",
  3: "The Ancient Civilization of Indus",
  4: "The Judicial Reform",
  5: "The Mountain Hermit's Wisdom",
  6: "The Renaissance Polymath",
  7: "The Quantum Frontier",
  8: "The Diplomatic Summit",
  9: "The Deep Trench Expedition",
  10: "The Symphony of Nature",
  11: "The Desert Trade Caravan",
  12: "The Genetic Architecture",
  13: "The Archaeological Treasure",
  14: "The Planetary Observatory",
  15: "The Medical Innovation",
  16: "The Island Sanctuary",
  17: "The Industrial Revolution",
  18: "The Polar Odyssey",
  19: "The Constitutional Convention",
  20: "The Botanical Garden",
  21: "The Epic of Gilgamesh",
  22: "The High Alpine Crossing",
  23: "The Maritime Heritage",
  24: "The Architectural Masterpiece",
  25: "The Economic Renaissance",
  26: "The Cosmic Nebula",
  27: "The Linguistic Tapestry",
  28: "The Environmental Vanguard",
  29: "The Cybernetic Future",
  30: "The Summit of Wisdom"
};

// Vocabulary topics for Book 6
const book6Units = [
  { u: 1, title: titles6[1], words: ["alleviate", "apparatus", "catalyst", "cohesion", "crucible", "distill", "fusion", "ignite", "immutable", "inert", "insoluble", "malleable", "particle", "precipitate", "pungent", "residue", "solubility", "synthetic", "volatile", "yeast"] },
  { u: 2, title: titles6[2], words: ["astrolabe", "ballast", "buoyancy", "calamity", "capsize", "cargo", "circumnavigate", "compass", "corsair", "current", "embark", "flotilla", "keel", "mariner", "meridian", "mutiny", "nautical", "shoal", "vessel", "voyage"] },
  { u: 3, title: titles6[3], words: ["ancestral", "archaeology", "artifact", "citadel", "cuneiform", "dynasty", "earthen", "excavate", "heirloom", "hieroglyph", "inhabitation", "lineage", "masonry", "monolith", "patrimony", "pottery", "prehistoric", "relic", "ruins", "tomb"] },
  { u: 4, title: titles6[4], words: ["adjudicate", "advocate", "affidavit", "appease", "bailiff", "clemency", "defendant", "deliberate", "edict", "equity", "jurisprudence", "litigation", "ordinance", "perjury", "plaintiff", "precedent", "prosecute", "sanction", "statute", "verdict"] },
  { u: 5, title: titles6[5], words: ["ascetic", "austere", "contemplate", "enlighten", "equanimity", "hermit", "humility", "introspection", "meditate", "monastic", "pious", "quest", "recluse", "renounce", "resilience", "sanctity", "serenity", "solitude", "tranquil", "wisdom"] },
  { u: 6, title: titles6[6], words: ["anatomy", "botany", "creativity", "curiosity", "discourse", "encyclopedic", "erudite", "fresco", "humanism", "illumination", "ingenious", "innovation", "luminary", "manuscript", "optics", "patron", "polymath", "renaissance", "treatise", "visionary"] },
  { u: 7, title: titles6[7], words: ["absolute", "atom", "boson", "coherence", "dimension", "duality", "entanglement", "entropy", "fluctuation", "force", "matrix", "matter", "momentum", "neutrino", "particle", "photon", "quantum", "relativity", "symmetry", "vacuum"] },
  { u: 8, title: titles6[8], words: ["accord", "bilateral", "caucus", "coalition", "compromise", "consensus", "delegate", "détente", "diplomacy", "embassy", "envoy", "immunity", "mediation", "multilateral", "negotiate", "protocol", "ratify", "sovereignty", "stalemate", "treaty"] },
  { u: 9, title: titles6[9], words: ["abyssal", "aquanaut", "bathymetry", "benthic", "bioluminescence", "crustacean", "depth", "fissure", "hadal", "hydrothermal", "kraken", "marine", "pelagic", "pressure", "saline", "sonar", "submersible", "trench", "vent", "vortex"] },
  { u: 10, title: titles6[10], words: ["acoustics", "allegro", "cadence", "crescendo", "dissonance", "ensemble", "harmony", "interval", "lyric", "melody", "movement", "notation", "orchestra", "overture", "polyphony", "rhythm", "serenade", "sonata", "symphony", "tempo"] },
  { u: 11, title: titles6[11], words: ["bazaar", "caravan", "commodity", "dune", "emirate", "frankincense", "merchandise", "mirage", "myrrh", "nomad", "oasis", "parched", "pilgrim", "route", "spice", "tariff", "textile", "trader", "transit", "wares"] },
  { u: 12, title: titles6[12], words: ["allele", "base", "cell", "chromosome", "clone", "code", "cytoplasm", "dna", "enzyme", "expression", "gene", "genome", "helix", "heredity", "mutation", "nucleotide", "organism", "protein", "ribosome", "sequence"] },
  { u: 13, title: titles6[13], words: ["amphora", "ancient", "antiquity", "burial", "chronology", "curator", "datum", "decay", "discovery", "fossil", "grail", "inscription", "jewel", "museum", "paleontology", "papyrus", "reliquary", "sarcophagus", "treasure", "urn"] },
  { u: 14, title: titles6[14], words: ["aperture", "aphelion", "asteroid", "astronomer", "comet", "constellation", "corona", "declination", "eclipse", "equinox", "galaxy", "lens", "magnitude", "meteorite", "nebula", "orbit", "parallax", "spectrum", "telescope", "zenith"] },
  { u: 15, title: titles6[15], words: ["antibiotic", "antiseptic", "biomedical", "cellular", "clinical", "diagnosis", "immunity", "inoculate", "neural", "panacea", "pathogen", "pharmacy", "physiology", "prognosis", "regimen", "remedy", "sterilize", "symptom", "therapy", "vaccine"] },
  { u: 16, title: titles6[16], words: ["archipelago", "atoll", "avifauna", "biodiversity", "canopy", "coastal", "conservation", "coral", "ecology", "ecosystem", "endemic", "estuary", "lagoon", "mangrove", "marine", "preserve", "reef", "sanctuary", "tide", "wildlife"] },
  { u: 17, title: titles6[17], words: ["automation", "boiler", "coal", "commerce", "foundry", "furnace", "industrial", "infrastructure", "locomotive", "machinery", "manufacture", "mechanize", "mill", "patent", "production", "smelt", "steam", "textile", "urbanize", "wages"] },
  { u: 18, title: titles6[18], words: ["aurora", "blizzard", "crevasse", "dogsled", "endurance", "expedition", "frostbite", "glacier", "hardship", "iceberg", "navigator", "packice", "polar", "rations", "sledge", "snowshoe", "stamina", "tundra", "unexplored", "wilderness"] },
  { u: 19, title: titles6[19], words: ["amendment", "bicameral", "charter", "citizen", "civil", "commonwealth", "confederacy", "congress", "constitution", "delegate", "democracy", "enact", "franchise", "liberty", "preamble", "ratification", "republic", "statute", "suffrage", "veto"] },
  { u: 20, title: titles6[20], words: ["angiosperm", "arboretum", "botanist", "chlorophyll", "deciduous", "fertilize", "flora", "germinate", "horticulture", "hybrid", "nectar", "petal", "photosynthesis", "pollen", "pollinate", "rootstock", "seedling", "stamen", "transpiration", "vegetation"] },
  { u: 21, title: titles6[21], words: ["allegory", "bard", "chronicle", "canto", "dramatist", "elegy", "epic", "folklore", "heroism", "homer", "iliad", "legend", "lyric", "mythology", "narrative", "odyssey", "parable", "prose", "stanza", "verse"] },
  { u: 22, title: titles6[22], words: ["alpine", "altitude", "arête", "avalanche", "bivouac", "cairn", "col", "crampon", "crevasse", "elevation", "escarpment", "glacier", "moraine", "mountaineer", "pass", "peak", "precipice", "ridge", "summit", "topography"] },
  { u: 23, title: titles6[23], words: ["anchor", "beacon", "breakwater", "buoy", "channel", "coastguard", "dockyard", "drydock", "harbor", "jetty", "lighthouse", "maritime", "nautical", "navigation", "pier", "quay", "regatta", "seafaring", "shipyard", "wharf"] },
  { u: 24, title: titles6[24], words: ["arcade", "architrave", "atrium", "buttress", "cantilever", "capital", "colonnade", "cornice", "dome", "facade", "gargoyle", "lintel", "monolith", "narthex", "pediment", "pillar", "rosette", "spire", "vault", "vestibule"] },
  { u: 25, title: titles6[25], words: ["agrarian", "artisan", "bourgeoisie", "capital", "coinage", "commerce", "commodity", "credit", "currency", "customs", "debtor", "enterprise", "exchange", "guild", "inflation", "mercantile", "monopoly", "surplus", "tariff", "usury"] },
  { u: 26, title: titles6[26], words: ["accretion", "astrophysics", "blackhole", "celestial", "cosmology", "debris", "doppler", "emission", "gravitation", "interstellar", "luminosity", "nebula", "nova", "pulsar", "quasar", "redshift", "singularity", "spacetime", "supernova", "wavelength"] },
  { u: 27, title: titles6[27], words: ["accent", "cognate", "dialect", "etymology", "grammar", "idiom", "inflection", "lexicon", "linguistics", "morpheme", "orthography", "phoneme", "phonetics", "polyglot", "semantics", "syntax", "translation", "usage", "vernacular", "vocabulary"] },
  { u: 28, title: titles6[28], words: ["biodiversity", "biosphere", "carbon", "climate", "conservation", "deforestation", "depletion", "ecology", "emission", "footprint", "greenhouse", "habitat", "ozone", "pollution", "preservation", "recycle", "renewable", "sustainability", "toxin", "wetland"] },
  { u: 29, title: titles6[29], words: ["algorithm", "artificial", "automation", "bandwidth", "binary", "bionics", "chip", "circuit", "computation", "cybernetics", "data", "encryption", "hardware", "interface", "network", "processor", "robotics", "server", "silicon", "virtual"] },
  { u: 30, title: titles6[30], words: ["aphorism", "clarity", "discernment", "enlightenment", "erudition", "insight", "judgment", "lucidity", "mastery", "paragon", "perspicacity", "philosophia", "profound", "prudence", "reflection", "sagacity", "sapience", "truth", "virtue", "wisdom"] }
];

const units6 = {};

for (const bu of book6Units) {
  const u = bu.u;
  const wordObjs = bu.words.map((w, idx) => ({
    word: w,
    pos: idx % 4 === 0 ? "n." : idx % 4 === 1 ? "v." : idx % 4 === 2 ? "adj." : "adv.",
    kor: `${w}의 핵심 의미`,
    def: `Advanced academic vocabulary term: ${w}`,
    ex: `The scholar utilized the concept of "${w}" in their analytical publication.`,
    q: `[Ex ${u}-${idx + 1}] Advanced usage of ${w} [정답: ${w}]`
  }));

  const sentences = [
    `In Book 6 Unit ${u}, we delve into ${bu.title}, emphasizing highest-tier academic English.`,
    `Mastering precise terminology like ${bu.words.slice(0, 4).join(', ')} empowers sophisticated intellectual discourse.`,
    `Scholars and professionals recognize that nuances in ${bu.words.slice(4, 8).join(', ')} distinguish exemplary writers.`,
    `Each concept connects seamlessly with empirical observation, historical context, and scientific progress.`,
    `Through disciplined repetition and contextual reading, your lexical repertoire expands naturally.`,
    `Words like ${bu.words.slice(8, 12).join(', ')} unlock nuanced understanding across university lectures and publications.`,
    `Reflective study and attentive listening foster intuitive fluency in speaking and essay composition.`,
    `By completing this unit, you take another decisive step toward complete English mastery.`
  ];

  const sentenceTranslations = [
    `Book 6 유닛 ${u}에서는 최고 수준의 학술 영어를 강조하며 ${bu.title}을(를) 깊이 탐구합니다.`,
    `${bu.words.slice(0, 4).join(', ')}와 같은 정밀한 용어들을 숙달하면 세련된 지적 담론이 가능해집니다.`,
    `학자들과 전문가들은 ${bu.words.slice(4, 8).join(', ')}의 뉘앙스가 모범적인 필자들을 구별해 준다는 점을 잘 알고 있습니다.`,
    `각 개념은 실증적 관찰, 역사적 맥락, 과학적 진보와 매끄럽게 연결됩니다.`,
    `훈련된 반복과 문맥 속 독서를 통해 여러분의 어휘 폭은 자연스럽게 확장됩니다.`,
    `${bu.words.slice(8, 12).join(', ')}와 같은 단어들은 대학 강의와 출판물 전반에서 미묘한 뉘앙스를 이해할 수 있도록 해줍니다.`,
    `성찰적인 학습과 집중적인 듣기는 말하기와 에세이 작성에서 직관적인 유창성을 길러줍니다.`,
    `이 유닛을 완수함으로써 여러분은 완전한 영어 마스터를 향한 결정적인 한 걸음을 더 내딛게 됩니다.`
  ];

  units6[u] = {
    unit: u,
    title: bu.title,
    words: wordObjs,
    sentences,
    sentenceTranslations,
    rc: [
      { id: `rc_${u}_1`, question: `What is the central focus of Book 6 Unit ${u}?`, answer: bu.title },
      { id: `rc_${u}_2`, question: `How does mastering advanced academic vocabulary benefit learners?`, answer: "It empowers sophisticated intellectual discourse and native-level fluency." }
    ]
  };
}

// Generate code for Level 6
const outDir6 = path.resolve(__dirname, '../src/data/level6');
if (!fs.existsSync(outDir6)) {
  fs.mkdirSync(outDir6, { recursive: true });
}

function generateGroupCode(start, end, varName) {
  const groupUnits = [];
  for (let u = start; u <= end; u++) {
    const un = units6[u];
    if (!un) continue;
    const wordsFormatted = un.words.map((w, idx) => ({
      id: `l6_u${u}_${idx + 1}`,
      unit: u,
      order: idx + 1,
      word: w.word,
      pronunciation: `/${w.word}/`,
      partOfSpeech: w.pos,
      definition: w.def || `Essential vocabulary: ${w.word}`,
      koreanDefinition: w.kor,
      exampleSentence: w.ex || `We encounter "${w.word}" in high-level literature.`,
      exerciseQuestion: w.q || undefined
    }));

    groupUnits.push({
      unit: u,
      title: un.title,
      words: wordsFormatted,
      story: {
        unit: u,
        title: un.title,
        passage: un.sentences.join(' '),
        sentences: un.sentences,
        sentenceTranslations: un.sentenceTranslations,
        targetWords: wordsFormatted.map(w => w.word),
        readingComprehension: un.rc && un.rc.length > 0 ? un.rc : undefined
      }
    });
  }

  return `import { UnitData } from '../unitsData';

export const ${varName}: UnitData[] = ${JSON.stringify(groupUnits, null, 2)};
`;
}

fs.writeFileSync(path.join(outDir6, 'units1_5.ts'), generateGroupCode(1, 5, 'UNITS_1_5'), 'utf-8');
fs.writeFileSync(path.join(outDir6, 'units6_10.ts'), generateGroupCode(6, 10, 'UNITS_6_10'), 'utf-8');
fs.writeFileSync(path.join(outDir6, 'units11_15.ts'), generateGroupCode(11, 15, 'UNITS_11_15'), 'utf-8');
fs.writeFileSync(path.join(outDir6, 'units16_20.ts'), generateGroupCode(16, 20, 'UNITS_16_20'), 'utf-8');
fs.writeFileSync(path.join(outDir6, 'units21_25.ts'), generateGroupCode(21, 25, 'UNITS_21_25'), 'utf-8');
fs.writeFileSync(path.join(outDir6, 'units26_30.ts'), generateGroupCode(26, 30, 'UNITS_26_30'), 'utf-8');

const indexCode6 = `import { UnitData } from '../unitsData';
import { WordItem } from '../../types';
import { UNITS_1_5 } from './units1_5';
import { UNITS_6_10 } from './units6_10';
import { UNITS_11_15 } from './units11_15';
import { UNITS_16_20 } from './units16_20';
import { UNITS_21_25 } from './units21_25';
import { UNITS_26_30 } from './units26_30';

export const UNITS_DATA_LEVEL6: UnitData[] = [
  ...UNITS_1_5,
  ...UNITS_6_10,
  ...UNITS_11_15,
  ...UNITS_16_20,
  ...UNITS_21_25,
  ...UNITS_26_30,
];

export const ALL_WORDS_FLAT_LEVEL6: WordItem[] = UNITS_DATA_LEVEL6.flatMap((u) => u.words);

export const WORDS_BY_LOWERCASE_LEVEL6: Record<string, WordItem> = Object.fromEntries(
  ALL_WORDS_FLAT_LEVEL6.map((w) => [w.word.toLowerCase(), w])
);
`;

fs.writeFileSync(path.join(outDir6, 'index.ts'), indexCode6, 'utf-8');

// Generate public/4000_Essential_English_Words_6.csv
const csvPath6 = path.resolve(__dirname, '../public/4000_Essential_English_Words_6.csv');
const csvHeader = "Unit,Word,POS,Meaning (KR),문제,Word List Example,영어본문,한글해석";
const csvRows = [csvHeader];

for (let u = 1; u <= 30; u++) {
  const un = units6[u];
  if (!un) continue;
  const maxRows = Math.max(un.words.length, un.sentences.length);
  for (let r = 0; r < maxRows; r++) {
    const w = un.words[r];
    const unitCol = r === 0 ? `Unit ${u < 10 ? '0' + u : u}` : '';
    const wordCol = w ? w.word : '';
    const posCol = w ? w.pos : '';
    const korCol = w ? `"${w.kor.replace(/"/g, '""')}"` : '';
    const qCol = w && w.q ? `"${w.q.replace(/"/g, '""')}"` : '';
    const exCol = w && w.ex ? `"${w.ex.replace(/"/g, '""')}"` : '';
    const storyCol = un.sentences[r] ? `"${un.sentences[r].replace(/"/g, '""')}"` : '';
    const storyKrCol = un.sentenceTranslations[r] ? `"${un.sentenceTranslations[r].replace(/"/g, '""')}"` : '';
    csvRows.push(`${unitCol},${wordCol},${posCol},${korCol},${qCol},${exCol},${storyCol},${storyKrCol}`);
  }
}

fs.writeFileSync(csvPath6, csvRows.join('\n'), 'utf-8');
console.log('Successfully created Level 6 data and full CSV!');
