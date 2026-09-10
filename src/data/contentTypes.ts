import { ContentTypeDefinition } from '../types';

export const CONTENT_TYPES: ContentTypeDefinition[] = [
  {
    id: 'book',
    name: 'Book / Complete Novel',
    badge: 'Flagship Pipeline',
    description: 'Multi-chapter fiction or non-fiction book with full continuity, deep character bible, world rules, and literary prose.',
    icon: 'BookOpen',
    unitName: 'Chapters',
    defaultCount: 5,
    targetWordCountRange: '15,000 – 90,000 words',
    outputFormats: ['EPUB 3.0', 'Print-Ready PDF', 'DOCX', 'JSON Archive']
  },
  {
    id: 'children_book',
    name: "Illustrated Children's Book",
    badge: 'Visual Narrative',
    description: 'Storybook formatted with paired text passages and vivid full-page illustration prompts for young readers.',
    icon: 'Sparkles',
    unitName: 'Pages / Spreads',
    defaultCount: 6,
    targetWordCountRange: '800 – 3,000 words',
    outputFormats: ['EPUB Fixed Layout', 'Landscape PDF', 'Printable Folio']
  },
  {
    id: 'picture_book',
    name: 'Art & Picture Book',
    badge: 'Visual First',
    description: 'High visual density format combining poetic captions, thematic visual motifs, and gallery plates.',
    icon: 'Image',
    unitName: 'Spreads',
    defaultCount: 8,
    targetWordCountRange: '500 – 2,500 words',
    outputFormats: ['High-Res PDF', 'Digital Portfolio']
  },
  {
    id: 'magazine',
    name: 'Magazine / Editorial Issue',
    badge: 'Periodical',
    description: 'Multi-article publication featuring cover stories, feature columns, editorial notes, and pull-quote sidebars.',
    icon: 'Layout',
    unitName: 'Articles',
    defaultCount: 4,
    targetWordCountRange: '5,000 – 18,000 words',
    outputFormats: ['Editorial PDF', 'Web Edition', 'HTML Bundle']
  },
  {
    id: 'screenplay',
    name: 'Screenplay / Dramatic Script',
    badge: 'Dramatic Arts',
    description: 'Industry-standard screenplay format with scene headings (SLUG lines), action paragraphs, and parenthetical character dialogues.',
    icon: 'Film',
    unitName: 'Scenes / Sequences',
    defaultCount: 6,
    targetWordCountRange: '8,000 – 25,000 words',
    outputFormats: ['Fountain / PDF', 'Script DOCX']
  },
  {
    id: 'comic',
    name: 'Comic & Graphic Novel',
    badge: 'Sequential Art',
    description: 'Panel-by-panel script outlining camera angles, visual descriptions, speech balloons, sound effects (SFX), and page breaks.',
    icon: 'Palette',
    unitName: 'Pages',
    defaultCount: 6,
    targetWordCountRange: '1,500 – 6,000 words',
    outputFormats: ['Comic Script PDF', 'CBZ Metadata']
  },
  {
    id: 'educational',
    name: 'Educational / Course Text',
    badge: 'Pedagogical',
    description: 'Structured pedagogical work with learning outcomes, core explanatory text, case studies, and review questions.',
    icon: 'GraduationCap',
    unitName: 'Modules',
    defaultCount: 5,
    targetWordCountRange: '10,000 – 40,000 words',
    outputFormats: ['Textbook PDF', 'SCORM / Web Course', 'EPUB']
  },
  {
    id: 'report',
    name: 'Strategic Whitepaper & Report',
    badge: 'Enterprise',
    description: 'Executive briefing with executive summary, methodology, analytical findings, and strategic recommendations.',
    icon: 'FileText',
    unitName: 'Sections',
    defaultCount: 4,
    targetWordCountRange: '4,000 – 15,000 words',
    outputFormats: ['Executive PDF', 'DOCX', 'Briefing Slide-deck']
  }
];

export const GENRE_PRESETS = [
  { label: 'Speculative Sci-Fi / Cyberpunk', genre: 'Sci-Fi', tone: 'Atmospheric, neon-noir, philosophical', pacing: 'measured' },
  { label: 'Nordic Noir / Investigative Mystery', genre: 'Mystery', tone: 'Bleak, psychologically tense, grounded', pacing: 'measured' },
  { label: 'Epic Mythic Fantasy', genre: 'Fantasy', tone: 'Grand, lyrical, high-stakes, mythopoetic', pacing: 'epic' },
  { label: 'Historical Drama / Court Intrigue', genre: 'Historical', tone: 'Intricate, sharp subtext, lavish yet dangerous', pacing: 'measured' },
  { label: 'Psychological Thriller', genre: 'Thriller', tone: 'Claustrophobic, unreliable, electric pacing', pacing: 'brisk' },
  { label: 'Philosophical Non-Fiction', genre: 'Non-Fiction', tone: 'Eloquent, rigorous, contemplative', pacing: 'contemplative' }
];
