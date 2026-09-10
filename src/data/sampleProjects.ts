import { Project } from '../types';

export const INITIAL_PROJECT: Project = {
  id: 'proj-glass-meridian',
  title: 'The Glass Meridian',
  subtitle: 'A Chronicle of the Long Silence',
  author: 'S. K. Valen',
  contentType: 'book',
  rawIdea: 'In a world where sound has been outlawed by the High Archivists to preserve civil harmony, an acoustician discovers a concealed frequency that proves the catastrophic Silence of 1912 was an orchestrated lie. To survive, she must partner with an exiled vault keeper to decode the resonant meridian before the seasonal eclipse shuts down the outer conduits forever.',
  intent: {
    genre: 'Speculative Mystery & Dystopian Drama',
    subgenre: 'Acoustic Cyberpunk / Archival Thriller',
    targetAudience: 'Adult Speculative Fiction & Thoughtful Thriller Readership',
    tone: 'Atmospheric, tension-laden, tactile, melancholic yet urgent',
    targetWordCount: 28000,
    language: 'English',
    pacing: 'measured',
    stylisticDirectives: [
      'Render acoustic phenomena with sensory physical weight: vibrations in teeth, cold resonance of stone, dry rattle of vellum.',
      'Dialogue should be economical and subtext-heavy, reflecting characters accustomed to speaking in low murmurs.',
      'Escalating moral consequence with each chapter break.'
    ],
    visualArtStyle: 'Dark basalt slate with burnished copper foil linework and geometric meridian diagrams.',
    logline: 'When an acoustician decodes the sound that broke an empire, she must breach the world’s quietest fortress before silence becomes permanent.'
  },
  plan: {
    premise: 'Elena Vance, senior tuner in the Citadel of Oakhaven, accidentally intercepts a rhythmic acoustic pulse originating from the forbidden Subterranean Meridian. She realizes the historical catastrophe that stripped humanity of voice was artificially engineered.',
    centralConflict: 'The High Archivists demand ideological stillness to prevent factional chaos; Elena’s discovery guarantees catastrophic political upheaval if revealed, but continued silence ensures quiet extinction.',
    threeActBreakdown: [
      { act: 'Act I: The Acoustic Anomaly', focus: 'Elena intercepts the meridian frequency and seeks out Kaelen Thorne in the Sub-Basalt vaults.', climaxEvent: 'The breach of the Upper Archive and theft of the Cipher Cylinder.' },
      { act: 'Act II: The Descent along the Line', focus: 'Navigating the damp conduits of the Lower City while pursued by Corvus’s pneumatic hounds.', climaxEvent: 'The confrontation at the Acoustic Well, where Kaelen’s true identity is exposed.' },
      { act: 'Act III: The Resonance Reborn', focus: 'Reconnecting the severed transmitter tower during the five-minute totality of the solar eclipse.', climaxEvent: 'The transmission broadcast across seven valleys, shattering the state silencer array.' }
    ],
    chaptersPlan: [
      {
        chapterNumber: 1,
        title: 'The Resonance of Cold Stone',
        povCharacter: 'Elena Vance',
        setting: 'The High Listening Gallery, Citadel of Oakhaven',
        dramaticObjective: 'Isolate the anomalous acoustic frequency without alerting the acoustic surveillance dampeners.',
        plotBeats: [
          'Elena tunes the giant copper dish during the midnight inspection cycle.',
          'A discordant harmonic vibrates through her bronze tuning stylus, repeating every 14 seconds.',
          'She matches the waveform to the legendary pre-Silence meridian recordings.',
          'The security bells begin their automated diagnostic chime, forcing her to hide the wax transcription coil.'
        ],
        estimatedWords: 1200
      },
      {
        chapterNumber: 2,
        title: 'The Keeper of Broken Gauges',
        povCharacter: 'Kaelen Thorne',
        setting: 'The Sub-basalt Drainage Sluice 4B',
        dramaticObjective: 'Confront the intruder in the conduits and determine if she is a spy or a genuine runaway.',
        plotBeats: [
          'Kaelen inspects oil seepage along the iron floor plates while listening for unauthorized vibrations.',
          'Elena drops from the service shaft, carrying the stolen listening apparatus.',
          'A tense standoff at needle-point where Elena plays back five seconds of the recorded meridian frequency.',
          'Kaelen recognizes the cadence of his dead brother’s signature cipher.'
        ],
        estimatedWords: 1350
      },
      {
        chapterNumber: 3,
        title: 'The Cartography of Whispers',
        povCharacter: 'Elena Vance',
        setting: 'The Flooded Map Room beneath Saint Jude’s Cistern',
        dramaticObjective: 'Cross-reference the frequency with the forgotten geological maps to find the master transmitter.',
        plotBeats: [
          'Unfurling waterlogged parchment charts across rusted workbenches.',
          'Elena explains the mathematical illusion behind the state-mandated Silent Decade.',
          'Disturbant sounds overhead: the thud of Magister Corvus’s pneumatic search team.',
          'They discover the meridian was never destroyed—merely buried beneath two hundred feet of lead slag.'
        ],
        estimatedWords: 1400
      },
      {
        chapterNumber: 4,
        title: 'In the Throat of the Foundry',
        povCharacter: 'Kaelen Thorne',
        setting: 'The Abandoned Lead Kilns of the Iron Quarter',
        dramaticObjective: 'Bypass the hydraulic pressure gates before the evening curfew closes the sluices.',
        plotBeats: [
          'Elena and Kaelen crawl through the cooling flues of the ancient smelter.',
          'Kaelen reveals why he was cashiered from the Archivist Guard twelve years ago.',
          'An ambush by Corvus’s enforcers triggers a localized acoustic blast.',
          'Elena uses her tuning stylus to shatter the glass viewport of the control booth, allowing their escape.'
        ],
        estimatedWords: 1250
      },
      {
        chapterNumber: 5,
        title: 'The Awakening Frequency',
        povCharacter: 'Elena Vance',
        setting: 'The Apex Transmitter Needle, Mount Caelum',
        dramaticObjective: 'Complete the circuit connection and broadcast the truth before the eclipse passes.',
        plotBeats: [
          'Ascending the gale-swept open iron ladder as the sun’s corona begins to dim.',
          'Magister Corvus confronts them on the platform with an offer of archival amnesty.',
          'Kaelen holds the gate mechanism against the guards while Elena connects the bronze terminal leads.',
          'The chime strikes, the wave propagates through the air, and for the first time in fifty years, speech echoes in the valley.'
        ],
        estimatedWords: 1600
      }
    ]
  },
  bible: {
    characters: [
      {
        id: 'char-1',
        name: 'Elena Vance',
        role: 'protagonist',
        archetype: 'The Rebellious Cartographer of Sound',
        personality: 'Analytical, intensely focused, cautious until an undeniable truth is uncovered, fiercely principled.',
        physicalAppearance: 'Mid-thirties, wiry frame, ash-blond hair pinned back with copper calipers, fingers stained with graphite and lamp oil.',
        coreMotivation: 'To restore human voice and dismantle the fraudulent theology of the Great Silence.',
        internalConflict: 'Guilt over abandoning her younger sister in the Citadel’s residential ward to pursue this dangerous quest.',
        voiceAndDiction: 'Crisp, measured, uses technical acoustic and harmonic vocabulary; rarely raises her tone beyond an intense whisper.'
      },
      {
        id: 'char-2',
        name: 'Kaelen Thorne',
        role: 'deuteragonist',
        archetype: 'The Reluctant Veteran / Pariah Guardian',
        personality: 'Pragmatic, cynical on the surface, observant of mechanical vulnerabilities, deeply protective.',
        physicalAppearance: 'Weathered forty-something, broad shoulders rounded from years in tunnels, scar across jawline, heavy oilskin coat.',
        coreMotivation: 'Vindication for his executed brother and revenge against the Archivists who erased his family line.',
        internalConflict: 'Fears that broadcasting the truth will incite an immediate civil slaughter rather than enlightenment.',
        voiceAndDiction: 'Gruff, laconic, asks sharp tactical questions, peppered with engineering jargon.'
      },
      {
        id: 'char-3',
        name: 'Magister Corvus',
        role: 'antagonist',
        archetype: 'The Paternal Inquisitor',
        personality: 'Erudite, unfailingly courteous, ruthless in execution, convinced of his own merciful cruelty.',
        physicalAppearance: 'Tall, immaculate dark silk robes edged with silver wire, hands gloved in white kidskin, piercing pale gray eyes.',
        coreMotivation: 'Preserving the peace of the commonwealth through total acoustic sensory deprivation.',
        internalConflict: 'Secretly listens to forbidden musical cylinders in his private sanctuary late at night.',
        voiceAndDiction: 'Melodious, slow, persuasive, cloaking violent directives in ecclesiastical terminology.'
      }
    ],
    worldBuilding: [
      {
        id: 'wb-1',
        category: 'setting',
        name: 'The Citadel of Oakhaven',
        description: 'A towering fortress of black basalt and polished copper arches perched atop the jagged cliffs of the Soundless Reach.',
        narrativeSignificance: 'The geopolitical capital of the Archivist Order, where all human speech is monitored through seismic acoustic pendulums.'
      },
      {
        id: 'wb-2',
        category: 'technology_magic',
        name: 'Acoustic Dampener Array',
        description: 'A network of subterranean resonance chambers that emits a perpetual, inaudible subsonic frequency designed to numb the vocal cords of citizens.',
        narrativeSignificance: 'The mechanism that enforces the universal silence; its destruction is the primary objective of the narrative.'
      },
      {
        id: 'wb-3',
        category: 'social_order',
        name: 'The Covenant of the Silent Mouth',
        description: 'The civic religion claiming that vocal sound attracts the sky-blight that devastated the old world.',
        narrativeSignificance: 'The cultural barrier Elena must overcome to convince citizens to listen.'
      }
    ],
    timeline: [
      { id: 'tl-1', order: 1, timeframe: 'Fifty-two Years Ago', event: 'The Great Harmonic Severance', consequences: 'Vocal speech banned across all six territories.' },
      { id: 'tl-2', order: 2, timeframe: 'Twelve Years Ago', event: 'Execution of Julian Thorne', consequences: 'Kaelen Thorne stripped of rank and banished to the lower sluices.' },
      { id: 'tl-3', order: 3, timeframe: 'Seven Days Ago', event: 'The Meridian Flare', consequences: 'First harmonic anomaly recorded in the upper listening dish.' }
    ],
    thematicPillars: [
      'The weaponization of peace to suppress truth',
      'The visceral necessity of human expression as an act of resistance',
      'Memory as the only true resistance against institutional erasure'
    ],
    narrativeRules: [
      'All auditory sensations must be described through vibration, pressure, bone conduction, or resonance.',
      'Never break the physical acoustic limitations of the 19th-century-styled steampunk instruments.',
      'Dialogue is always spoken at minimal volume, necessitating close physical proximity and heightened body language.'
    ],
    continuityChecklist: [
      'Elena carries the wax cylinder in a velvet-lined lead canister in her coat pocket.',
      'Kaelen’s left leg has a slight limp caused by an old mine collapse.',
      'Magister Corvus never raises his voice above conversational cadence.'
    ]
  },
  chapters: [
    {
      id: 'chap-1',
      chapterNumber: 1,
      title: 'The Resonance of Cold Stone',
      povCharacter: 'Elena Vance',
      summary: 'Elena intercepts the anomalous meridian pulse on the High Listening Gallery and escapes before the automated security bells trigger.',
      wordCount: 1184,
      status: 'completed',
      qualityScore: 94,
      qualityFeedback: [
        'Sensory descriptions of cold basalt and bronze stylus vibration are exceptionally immersive.',
        'Pacing is taut and establishes the totalitarian stakes with immediate clarity.',
        'Character voice is distinctively analytical.'
      ],
      prose: `The cold stone had a voice, if a person knew how to set their teeth against the balustrade and wait for the iron to shudder.

Elena Vance did not use her teeth; she had the calipers. They were fashioned from cold-drawn Swedish bronze, slender as locust legs and tipped with polished amber needles that picked up the seismic tremble of Oakhaven long before the bells in the tower could swing. She knelt on the damp tiles of the High Listening Gallery, the cuffs of her wool coat sodden with sea-fog, watching the tiny needle scratch its signature across a drum of smoked glass.

Outside the arched embrasures, the city lay drowned in its customary, mandated hush. Three hundred thousand people slept in the basalt tenements below, their windows shuttered with heavy felt, their chimneys fitted with acoustic baffles that choked the crackle of burning birch into a dull, sighing draft. In the streets, the cobblestones were covered in pulverized slag to deaden the iron tires of the night carts. To make a sound above twelve decibels between dusk and dawn was to invite the Black Carters, and the Black Carters did not carry ledgers; they carried copper gags and leg-irons.

The smoked glass drum rotated with the steady, water-clock tick of a brass escapement. Usually, the needle drew a dead, straight line—the flatline of an obedient world.

Then the amber tip shuddered.

It did not twitch with the rhythmic rumble of the tide-race against the cliffs, nor the distant thrum of the Citadel’s ventilation bellows. It skipped upward, three sharp incisions in the soot, paused for the space of two heartbeats, and dipped down into a harmonic loop so delicate it looked like the rib-cage of a bird.

Fourteen seconds.

Elena held her breath until the veins behind her temples began to drum. She reached with trembling, ink-bitten fingers for the vernier screw, fine-tuning the acoustic horn that thrust out into the void of the sea-chasm. The brass horn was thirty feet across, hung from gantry chains that groaned in the north wind.

The loop repeated.

"Three, seven, eleven," she whispered, her lips scarcely parting. The words were not voiced—she had not spoken aloud in four years, not since the third decree—but formed on the breath alone, an exhalation shaped by the palate.

It was not wind. It was not geological fracture. It was a modulation curve—a voice signal compressed into carrier frequencies so low that no human ear could register them as pitch, only as a sick, twisting pressure in the inner ear.

She reached for the lead stylus to mark the timestamp on the parchment register. But as the tip touched paper, the air in the gallery changed.

The pressure dropped sharply, the way it always did when the Great Dampeners on the lower tier engaged their pneumatics. Down in the courtyard, four hundred yards beneath her roost, the bronze telltale bells began their low, mechanical rattle.

They knew.

Someone on the subterranean switchboard had registered the harmonic impedance on the meridian line. In less than three minutes, the steam-lift would groan to the gallery level, and Magister Corvus’s apprentices would step out with their acoustic calipers and their wax sealers.

Elena did not hesitate. With a practiced twist of her wrist, she released the spring-catch on the smoked glass cylinder. The delicate sleeve slid into her gloved palm, still warm from the friction of the needle. She slipped it into the cylindrical zinc case she wore tied beneath her skirts, replaced the mechanism with a blank cylinder from her pocket, and dropped flat against the floor.

Footsteps echoed on the iron spiral stair—not running, for nobody ran in Oakhaven, but climbing with the slow, terrifying certainty of a hydraulic piston.`
    },
    {
      id: 'chap-2',
      chapterNumber: 2,
      title: 'The Keeper of Broken Gauges',
      povCharacter: 'Kaelen Thorne',
      summary: 'Kaelen confronts Elena in the flooded drainage sluices and recognizes the cadence of his brother’s cipher.',
      wordCount: 1240,
      status: 'completed',
      qualityScore: 92,
      qualityFeedback: [
        'Excellent atmospheric depth in the subterranean sluice environment.',
        'Sharp, subtextual standoff dialogue between Kaelen and Elena.',
        'Seamless continuity with Chapter 1 events.'
      ],
      prose: `Water down in the sluices smelled like wet coal and forty years of municipal tallow. It was the only place in the territory where a man could clear his throat without someone writing down the room number.

Kaelen Thorne sat on an upturned grease cask, an oily rag clamped between his teeth as he tightened the packing gland on Drain Pump Number Nine. His knuckles were raw, swollen at the joints from twenty years of working in bilge that rarely rose above freezing. Overhead, the immense brick vaulting of the Great Sewer groaned as the tide backed up into the river mouth.

A pebble bounced off the iron catwalk twenty yards down the passage.

Kaelen did not jump. In Sluice 4B, jumping got you drowned or wrapped around an unshielded drive-shaft. He quietly slipped the 18-inch iron spanner from the bolt-head and let his arm hang limp against his thigh. He shifted his weight off the cask, his felt-soled boots making no sound against the greasy flagstones.

The shadow that dropped from the ventilation hatch was small, light on its feet, and clumsy with exhaustion. It tumbled into the drainage ditch, came up gasping, and immediately clutched its coat front with both arms as though protecting broken ribs.

"You’re two minutes ahead of the inspection float," Kaelen said into the gloom. He didn’t shout; he pitched his voice into the frequency of the pump’s low-pressure piston, letting the diesel throb swallow his consonants. "And you’re bleeding on my clean grating."

The figure froze. In the dim amber glow of the kerosene lantern, Kaelen saw the face of an Archivist—or at least someone who had stolen an Archivist’s high-collared coat. The silver calipers of a Senior Listener swung from her neck-cord like an executioner’s pendulum.

"You are Thorne," she breathed. Her voice had the thin, rustling quality of paper being torn under blankets. "Julian’s brother."

Kaelen’s grip on the spanner hardened until the iron bit through his wool mitt. "Julian was buried in the salt-pans twelve years back. Don't use that name here."

"He wasn't buried," she whispered, stepping onto the iron catwalk. She didn't look like an inquisitor. Her hair was coming down in damp blonde hanks, and there was a crescent of soot across her cheekbone that could only have come from a smoking draft-flue. "He was silenced. There's a difference."

"Not to him there isn't," Kaelen muttered. "Now climb back up that shaft before the watchman floats by. I don't harbor Citadel strays."

Instead of turning, she reached into the folds of her coat and withdrew a zinc cylinder. She unscrewed the knurled cap with quick, frantic movements and tipped something into her palm: a smoked glass sleeve, scored with fine white lines.

"Look at the third register," she said.

"I don't read glass," he retorted, but his eyes were already drawn to the pattern in the soot.

"You read Julian's clockwork," Elena insisted, holding the sleeve toward the lantern light. "He built the transmitter array for the Western Conduit in ’08. Look at the lead-in cadence. Two shorts, a long, and a rising triad. Tell me that's not his handwriting."

Kaelen stepped closer, despite the voice in his skull screaming that this was an Archivist trap designed to finish what was left of his family. He took the cylinder between thumb and forefinger, angling it against the kerosene flame.

The lines were clean. Precise. The signature flourish on the third harmonic was unmistakable—it was the same idiosyncratic cadence Julian used to rap on the timber headboard when they were boys sharing an attic bed in the Old Quarter.

*Two shorts. A long. Wait.*

"Where did this come from?" Kaelen's voice dropped an octave, the gruff indifference stripping away to reveal the raw iron underneath.

"The Glass Meridian," Elena whispered. "It started broadcasting forty minutes ago. And it's calling for someone who knows the emergency key."`
    }
  ],
  coverConfig: {
    title: 'THE GLASS MERIDIAN',
    subtitle: 'A Chronicle of the Long Silence',
    author: 'S. K. Valen',
    accentColor: '#d4af37',
    bgColor: '#090e17',
    fontFamily: 'cinzel',
    motif: 'celestial-crest',
    backCoverBlurb: 'In a civilization where human speech has been outlawed by decree, an acoustician decodes the forbidden frequency that proves the Great Silence was an orchestrated lie. A tour de force of tension, craft, and rebellion.',
    spineWidthMm: 18,
    barcodeText: '978-1-VELORA-7729'
  },
  visualAssets: [
    {
      id: 'asset-cover-front',
      type: 'cover_front',
      title: 'The Glass Meridian — Flagship Front Cover',
      prompt: 'Minimalist luxury book cover for The Glass Meridian, deep basalt slate background, burnished gold linework, acoustic wave concentric circles, elegant serif typography.',
      style: 'Burnished Gold on Slate Basalt',
      placementDescription: 'Front cover folio'
    },
    {
      id: 'asset-ill-ch1',
      type: 'illustration',
      chapterNumber: 1,
      title: 'The High Listening Gallery at Midnight',
      prompt: 'Interior of a vast Gothic-industrial listening chamber, giant bronze acoustic dish hung from iron chains overlooking a sea shrouded in dark mist, solitary female researcher with calipers, amber lantern light.',
      style: 'Atmospheric Woodcut & Copperplate Engraving',
      placementDescription: 'Chapter 1 Opener'
    }
  ],
  createdAt: '2026-09-08T18:30:00Z',
  updatedAt: '2026-09-09T04:40:00Z',
  version: 2,
  isCompleted: false
};
