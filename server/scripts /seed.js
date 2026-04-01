import 'dotenv/config';
import mongoose, { Types } from 'mongoose';
import { Course } from '../models/Course.model.js';
import { Lesson } from '../models/Lesson.model.js';

function attachLessonIdToExercises(exercises, lessonId) {
  return (exercises || []).map((ex) => ({
    _id: new Types.ObjectId(),
    ...ex,
    lesson: lessonId,
  }));
}

const TEMPLATES = {
  en: {
    A1: [
      {
        title: 'Greetings & Introductions',
        introText:
          'Start with greetings, introducing yourself, and asking simple questions.',
        phrases: [
          { native: 'Hello', target: 'Hello', note: 'General greeting' },
          { native: 'Good morning', target: 'Good morning', note: '' },
          {
            native: 'My name is …',
            target: 'My name is John.',
            note: 'Self-introduction',
          },
          {
            native: 'Nice to meet you',
            target: 'Nice to meet you.',
            note: 'Polite phrase',
          },
          {
            native: 'How are you?',
            target: 'How are you?',
            note: 'Common question',
          },
        ],
        grammarNotes:
          'Subject pronouns (I, you, he/she/it, we, they). Be-verb (am/is/are) in simple present.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Choose the most common greeting.',
            options: ['Goodbye', 'Hello', 'Thanks'],
            correctAnswer: 'Hello',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate into English: "Drago mi je."',
            correctAnswer: 'Nice to meet you.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill the gap: "___ are you?"',
            correctAnswer: 'How',
            points: 10,
          },
        ],
      },
      {
        title: 'Countries & Nationalities',
        introText:
          'Learn to say where you are from and ask others about their origin.',
        phrases: [
          {
            native: 'Where are you from?',
            target: 'Where are you from?',
            note: '',
          },
          {
            native: 'I am from Serbia.',
            target: 'I am from Serbia.',
            note: '',
          },
          { native: 'I am Serbian.', target: 'I am Serbian.', note: '' },
          {
            native: 'What is your nationality?',
            target: 'What is your nationality?',
            note: '',
          },
        ],
        grammarNotes:
          'Using "from" for origin. Articles with countries vary; no article for most countries.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Pick the correct response: "Where are you from?"',
            options: [
              'I from Serbia.',
              'I am from Serbia.',
              'From Serbia I am.',
            ],
            correctAnswer: 'I am from Serbia.',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Ja sam iz Nemačke."',
            correctAnswer: 'I am from Germany.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill the gap: "I ___ from Italy."',
            correctAnswer: 'am',
            points: 10,
          },
        ],
      },
      {
        title: 'Everyday Politeness',
        introText:
          'Say thanks, ask politely, and excuse yourself in everyday situations.',
        phrases: [
          { native: 'Please', target: 'Please', note: '' },
          { native: 'Thank you', target: 'Thank you', note: '' },
          { native: 'You’re welcome', target: "You're welcome", note: '' },
          {
            native: 'Excuse me',
            target: 'Excuse me',
            note: 'To get attention',
          },
        ],
        grammarNotes:
          'Modal verbs can soften requests (could/would). At A1, use “please” and “can I…”.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Choose the polite way to ask for water.',
            options: [
              'Give water.',
              'Water now.',
              'Can I have some water, please?',
            ],
            correctAnswer: 'Can I have some water, please?',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Izvinite, koliko ovo košta?"',
            correctAnswer: 'Excuse me, how much does this cost?',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill the gap: "_____ me, where is the station?"',
            correctAnswer: 'Excuse',
            points: 10,
          },
        ],
      },
    ],
    B1: [
      {
        title: 'Past Experiences',
        introText:
          'Discuss past experiences using simple past and present perfect.',
        phrases: [
          {
            native: 'I have visited London.',
            target: 'I have visited London.',
            note: 'Present perfect',
          },
          {
            native: 'I went there last year.',
            target: 'I went there last year.',
            note: 'Simple past',
          },
          {
            native: 'Have you ever tried sushi?',
            target: 'Have you ever tried sushi?',
            note: '',
          },
        ],
        grammarNotes:
          'Present perfect for life experiences; simple past for finished time expressions.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Choose correct: "I ___ the museum last weekend."',
            options: ['have visited', 'visited', 'have been visit'],
            correctAnswer: 'visited',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Da li si ikada probao susi?"',
            correctAnswer: 'Have you ever tried sushi?',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill the gap: "I have never ___ to Spain."',
            correctAnswer: 'been',
            points: 10,
          },
        ],
      },
      {
        title: 'Giving Opinions',
        introText: 'Express your opinion politely and support it with reasons.',
        phrases: [
          { native: 'I think that…', target: 'I think that…', note: '' },
          { native: 'In my opinion…', target: 'In my opinion…', note: '' },
          {
            native: 'From my perspective…',
            target: 'From my perspective…',
            note: '',
          },
        ],
        grammarNotes:
          'Opinion phrases + that-clauses. Use linking words: because, however, although.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Choose a polite opener:',
            options: ['You are wrong.', 'Listen.', 'In my opinion,'],
            correctAnswer: 'In my opinion,',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Mislim da je ovo dobra ideja."',
            correctAnswer: 'I think that this is a good idea.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "I prefer tea ___ I don’t like coffee."',
            correctAnswer: 'because',
            points: 10,
          },
        ],
      },
      {
        title: 'Problem Solving',
        introText:
          'Describe problems and propose solutions at work or while traveling.',
        phrases: [
          {
            native: 'There seems to be a problem.',
            target: 'There seems to be a problem.',
            note: '',
          },
          {
            native: 'Could you help me with…?',
            target: 'Could you help me with…?',
            note: '',
          },
          {
            native: 'One possible solution is…',
            target: 'One possible solution is…',
            note: '',
          },
        ],
        grammarNotes:
          'Polite requests (could/would), conditional suggestions (If we…, we could…).',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Pick the best request:',
            options: [
              'Help me now.',
              'Could you help me with this?',
              'You help me.',
            ],
            correctAnswer: 'Could you help me with this?',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Izgleda da imamo problem."',
            correctAnswer: 'It seems that we have a problem.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "If we start earlier, we ___ finish on time."',
            correctAnswer: 'could',
            points: 10,
          },
        ],
      },
    ],
  },

  de: {
    A1: [
      {
        title: 'Begrüßungen & Vorstellung',
        introText:
          'Lerne Grüße, dich vorzustellen und einfache Fragen zu stellen.',
        phrases: [
          { native: 'Hello', target: 'Hallo', note: 'Allgemeine Begrüßung' },
          { native: 'Good morning', target: 'Guten Morgen', note: '' },
          {
            native: 'My name is …',
            target: 'Ich heiße …',
            note: 'Selbstvorstellung',
          },
          { native: 'How are you?', target: 'Wie geht’s?', note: '' },
          { native: 'Nice to meet you', target: 'Freut mich.', note: '' },
        ],
        grammarNotes:
          'Personalpronomen ich/du/er/sie/es; Verb sein (bin/bist/ist).',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Wähle die richtige Begrüßung.',
            options: ['Tschüss', 'Bitte', 'Hallo'],
            correctAnswer: 'Hallo',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate into German: "My name is Anna."',
            correctAnswer: 'Ich heiße Anna.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "Wie ___ es dir?"',
            correctAnswer: 'geht',
            points: 10,
          },
        ],
      },
      {
        title: 'Kaffee bestellen',
        introText: 'Bestelle Getränke und benutze höfliche Formen im Café.',
        phrases: [
          {
            native: 'A coffee, please.',
            target: 'Einen Kaffee, bitte.',
            note: '',
          },
          {
            native: 'I would like…',
            target: 'Ich hätte gern…',
            note: 'Höfliche Form',
          },
          { native: 'How much is it?', target: 'Was kostet das?', note: '' },
          { native: 'Thank you', target: 'Danke', note: '' },
        ],
        grammarNotes:
          'Akkusativ bei Bestellungen (einen Kaffee). Höfliche Form "ich hätte gern".',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Höflich bestellen:',
            options: [
              'Ich will einen Kaffee.',
              'Gib mir Kaffee.',
              'Ich hätte gern einen Kaffee.',
            ],
            correctAnswer: 'Ich hätte gern einen Kaffee.',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Koliko to košta?"',
            correctAnswer: 'Wie viel kostet das?',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "___ Kaffee, bitte."',
            correctAnswer: 'Einen',
            points: 10,
          },
        ],
      },
      {
        title: 'Wegbeschreibung',
        introText: 'Frage nach dem Weg und verstehe einfache Richtungen.',
        phrases: [
          {
            native: 'Where is the station?',
            target: 'Wo ist der Bahnhof?',
            note: '',
          },
          { native: 'Go straight ahead', target: 'Geradeaus gehen', note: '' },
          { native: 'Turn left', target: 'Links abbiegen', note: '' },
        ],
        grammarNotes: 'Fragen mit "wo" und Imperativformen für Anweisungen.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: '„Bahnhof“ bedeutet…',
            options: ['Airport', 'Train station', 'Bus stop'],
            correctAnswer: 'Train station',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Skrenite levo."',
            correctAnswer: 'Biegen Sie links ab.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "___ ist der Bahnhof?"',
            correctAnswer: 'Wo',
            points: 10,
          },
        ],
      },
    ],
    B1: [
      {
        title: 'Vergangene Erlebnisse',
        introText: 'Spreche über Erfahrungen mit Perfekt und Präteritum.',
        phrases: [
          {
            native: 'I have visited Berlin.',
            target: 'Ich habe Berlin besucht.',
            note: 'Perfekt',
          },
          {
            native: 'Last year I was in Munich.',
            target: 'Letztes Jahr war ich in München.',
            note: 'Präteritum sein',
          },
          {
            native: 'Have you ever tried…?',
            target: 'Hast du jemals … probiert?',
            note: '',
          },
        ],
        grammarNotes:
          'Perfekt für gesprochene Sprache; Präteritum häufig mit sein/haben.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Richtig: "Ich ___ nach Köln gefahren."',
            options: ['bin', 'habe', 'war'],
            correctAnswer: 'bin',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Da li si ikada bio u Berlinu?"',
            correctAnswer: 'Warst du jemals in Berlin?',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "Ich habe es nie ___."',
            correctAnswer: 'probiert',
            points: 10,
          },
        ],
      },
      {
        title: 'Meinung ausdrücken',
        introText: 'Formuliere deine Meinung und begründe sie.',
        phrases: [
          { native: 'I think that…', target: 'Ich denke, dass…', note: '' },
          {
            native: 'In my opinion…',
            target: 'Meiner Meinung nach…',
            note: '',
          },
          { native: 'However…', target: 'Allerdings…', note: '' },
        ],
        grammarNotes:
          'Nebensätze mit "dass"; Satzklammer beachten; Konnektoren (weil, obwohl).',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Wähle eine höfliche Einleitung:',
            options: ['Du liegst falsch.', 'Hör zu.', 'Meiner Meinung nach'],
            correctAnswer: 'Meiner Meinung nach',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Mislim da je to dobra ideja."',
            correctAnswer: 'Ich denke, dass das eine gute Idee ist.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "Ich mag Tee, ___ ich keinen Kaffee mag."',
            correctAnswer: 'weil',
            points: 10,
          },
        ],
      },
      {
        title: 'Probleme lösen',
        introText: 'Beschreibe Probleme und schlage Lösungen vor.',
        phrases: [
          {
            native: 'There is a problem.',
            target: 'Es gibt ein Problem.',
            note: '',
          },
          {
            native: 'Could you help me?',
            target: 'Könnten Sie mir helfen?',
            note: 'Höflich',
          },
          { native: 'One solution is…', target: 'Eine Lösung ist…', note: '' },
        ],
        grammarNotes: 'Konjunktiv II für Höflichkeit (könnte/würde).',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Beste Bitte:',
            options: [
              'Hilf mir sofort.',
              'Du hilfst mir.',
              'Könnten Sie mir helfen?',
            ],
            correctAnswer: 'Könnten Sie mir helfen?',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Izgleda da postoji problem."',
            correctAnswer: 'Es scheint, dass es ein Problem gibt.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "Wir ___ früher anfangen."',
            correctAnswer: 'könnten',
            points: 10,
          },
        ],
      },
    ],
  },

  es: {
    A2: [
      {
        title: 'En el restaurante',
        introText: 'Pide comida y entiende preguntas del camarero.',
        phrases: [
          { native: 'I would like…', target: 'Quisiera…', note: 'Cortesía' },
          {
            native: 'The menu, please.',
            target: 'La carta, por favor.',
            note: '',
          },
          {
            native: 'The bill, please.',
            target: 'La cuenta, por favor.',
            note: '',
          },
        ],
        grammarNotes: 'Uso de condicional de cortesía (quisiera), por favor.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Elige la forma más cortés:',
            options: [
              'Quiero agua.',
              'Dame agua.',
              'Quisiera agua, por favor.',
            ],
            correctAnswer: 'Quisiera agua, por favor.',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Račun, molim."',
            correctAnswer: 'La cuenta, por favor.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "La ___, por favor."',
            correctAnswer: 'cuenta',
            points: 10,
          },
        ],
      },
      {
        title: 'Direcciones en la ciudad',
        introText: 'Pregunta por direcciones y sigue indicaciones.',
        phrases: [
          { native: 'Where is…?', target: '¿Dónde está…?', note: '' },
          { native: 'Turn right', target: 'Gira a la derecha', note: '' },
          { native: 'Go straight', target: 'Sigue recto', note: '' },
        ],
        grammarNotes: 'Imperativo informal para direcciones; preposición "a".',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: '“A la derecha” significa…',
            options: ['Left', 'Right', 'Straight'],
            correctAnswer: 'Right',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Gde je stanica?"',
            correctAnswer: '¿Dónde está la estación?',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "Sigue ___."',
            correctAnswer: 'recto',
            points: 10,
          },
        ],
      },
      {
        title: 'Planes y preferencias',
        introText: 'Habla de planes y lo que te gusta.',
        phrases: [
          { native: 'I like…', target: 'Me gusta…', note: '' },
          { native: 'I prefer…', target: 'Prefiero…', note: '' },
          {
            native: 'We are going to…',
            target: 'Vamos a…',
            note: 'Futuro perifrástico',
          },
        ],
        grammarNotes: 'Verbos gustar/preferir; ir a + infinitivo para planes.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Completa: "Me ___ el café."',
            options: ['gusta', 'gusto', 'gustan'],
            correctAnswer: 'gusta',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Planiramo da idemo na plažu."',
            correctAnswer: 'Vamos a ir a la playa.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "___ ir al cine." (I prefer)',
            correctAnswer: 'Prefiero',
            points: 10,
          },
        ],
      },
    ],
    B2: [
      {
        title: 'Conversaciones avanzadas',
        introText: 'Expresa matices y usa conectores con soltura.',
        phrases: [
          { native: 'However', target: 'Sin embargo', note: '' },
          { native: 'Therefore', target: 'Por lo tanto', note: '' },
          { native: 'Although', target: 'Aunque', note: '' },
        ],
        grammarNotes:
          'Conectores y subjuntivo en oraciones subordinadas donde aplique.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Equivalente de “However”:',
            options: ['Por lo tanto', 'Sin embargo', 'Aunque'],
            correctAnswer: 'Sin embargo',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Iako je kasno, izašli smo."',
            correctAnswer: 'Aunque es tarde, salimos.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "No vino, ___ estaba enfermo."',
            correctAnswer: 'porque',
            points: 10,
          },
        ],
      },
      {
        title: 'Narración en pasado',
        introText: 'Distingue pretérito indefinido vs. imperfecto.',
        phrases: [
          { native: 'I used to…', target: 'Solía…', note: 'Costumbre' },
          { native: 'Suddenly…', target: 'De repente…', note: '' },
          { native: 'While…', target: 'Mientras…', note: '' },
        ],
        grammarNotes:
          'Imperfecto para descripciones/hábito; Indefinido para acciones puntuales.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: '“Solía” expresa…',
            options: ['Acción puntual', 'Hábito', 'Futuro'],
            correctAnswer: 'Hábito',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Dok sam učio, nazvao me je."',
            correctAnswer: 'Mientras estudiaba, me llamó.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "___ repente empezó a llover."',
            correctAnswer: 'De',
            points: 10,
          },
        ],
      },
      {
        title: 'Debate y persuasión',
        introText: 'Argumenta y refuta con cortesía.',
        phrases: [
          {
            native: 'From my point of view…',
            target: 'Desde mi punto de vista…',
            note: '',
          },
          {
            native: 'I disagree with…',
            target: 'No estoy de acuerdo con…',
            note: '',
          },
          {
            native: 'It is essential that…',
            target: 'Es esencial que…',
            note: 'Subjuntivo',
          },
        ],
        grammarNotes:
          'Subjuntivo tras expresiones de necesidad/valoración; conectores adversativos.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Elige la mejor apertura cortés:',
            options: [
              'Escucha.',
              'Estás equivocado.',
              'Desde mi punto de vista,',
            ],
            correctAnswer: 'Desde mi punto de vista,',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Nisam saglasan sa tim."',
            correctAnswer: 'No estoy de acuerdo con eso.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "Es esencial ___ practiquemos."',
            correctAnswer: 'que',
            points: 10,
          },
        ],
      },
    ],
  },

  fr: {
    A1: [
      {
        title: 'Salutations & Présentations',
        introText: 'Apprends à saluer et te présenter.',
        phrases: [
          { native: 'Hello', target: 'Bonjour', note: '' },
          { native: 'Good evening', target: 'Bonsoir', note: '' },
          { native: 'My name is…', target: 'Je m’appelle …', note: '' },
          { native: 'Nice to meet you', target: 'Enchanté(e)', note: '' },
        ],
        grammarNotes: 'Verbe être (je suis/tu es/il est) et pronoms sujets.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'La salutation la plus courante:',
            options: ['Au revoir', 'Bonjour', 'Merci'],
            correctAnswer: 'Bonjour',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Zovem se Ana."',
            correctAnswer: 'Je m’appelle Ana.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "Comment ___ tu?"',
            correctAnswer: 'vas',
            points: 10,
          },
        ],
      },
      {
        title: 'Au café',
        introText: 'Commande poliment et demande le prix.',
        phrases: [
          {
            native: 'A coffee, please.',
            target: 'Un café, s’il vous plaît.',
            note: '',
          },
          { native: 'How much is it?', target: 'C’est combien ?', note: '' },
          { native: 'Thank you', target: 'Merci', note: '' },
        ],
        grammarNotes:
          'Formes de politesse (s’il vous plaît), article indéfini.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Choisis la formule polie:',
            options: [
              'Donne-moi un café.',
              'Je veux un café.',
              'Un café, s’il vous plaît.',
            ],
            correctAnswer: 'Un café, s’il vous plaît.',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Koliko ovo košta?"',
            correctAnswer: 'Ça coûte combien ?',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "___ café, s’il vous plaît."',
            correctAnswer: 'Un',
            points: 10,
          },
        ],
      },
      {
        title: 'Demander son chemin',
        introText: 'Demande le chemin et comprends les indications.',
        phrases: [
          { native: 'Where is…?', target: 'Où est… ?', note: '' },
          { native: 'Turn right', target: 'Tournez à droite', note: '' },
          { native: 'Go straight ahead', target: 'Allez tout droit', note: '' },
        ],
        grammarNotes: 'Impératif de politesse (vous).',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: '“À gauche” signifie…',
            options: ['Right', 'Left', 'Straight'],
            correctAnswer: 'Left',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Gde je stanica?"',
            correctAnswer: 'Où est la gare ?',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "Tournez à ___."',
            correctAnswer: 'droite',
            points: 10,
          },
        ],
      },
    ],
    B1: [
      {
        title: 'Parler du passé',
        introText: 'Utilise passé composé et imparfait.',
        phrases: [
          {
            native: 'I went yesterday',
            target: 'Je suis allé(e) hier',
            note: 'Passé composé',
          },
          {
            native: 'I used to…',
            target: "J'avais l'habitude de… / Je faisais…",
            note: 'Imparfait / périphrase',
          },
        ],
        grammarNotes:
          'Passé composé (actions finies) vs imparfait (description/habitude).',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Bon choix: "Hier, je ___ au cinéma."',
            options: ['suis allé', 'allais', 'vais'],
            correctAnswer: 'suis allé',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Dok sam učio, on je došao."',
            correctAnswer: 'Pendant que j’étudiais, il est venu.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "Quand j’étais petit, je ___ au parc."',
            correctAnswer: 'allais',
            points: 10,
          },
        ],
      },
      {
        title: 'Exprimer une opinion',
        introText: 'Exprime ton avis avec des connecteurs.',
        phrases: [
          { native: 'I think that…', target: 'Je pense que…', note: '' },
          { native: 'In my opinion…', target: 'À mon avis…', note: '' },
          { native: 'However…', target: 'Cependant…', note: '' },
        ],
        grammarNotes:
          'Subordonnées avec "que". Connecteurs: cependant, donc, pourtant.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Choisis une ouverture polie:',
            options: ['Tu as tort.', 'Écoute.', 'À mon avis,'],
            correctAnswer: 'À mon avis,',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Mislim da je ovo dobar plan."',
            correctAnswer: 'Je pense que c’est un bon plan.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "Je préfère le thé ___ je n’aime pas le café."',
            correctAnswer: 'parce que',
            points: 10,
          },
        ],
      },
      {
        title: 'Résoudre un problème',
        introText: 'Décris un problème et demande de l’aide poliment.',
        phrases: [
          {
            native: 'There is a problem',
            target: 'Il y a un problème',
            note: '',
          },
          {
            native: 'Could you help me?',
            target: 'Pourriez-vous m’aider ?',
            note: '',
          },
        ],
        grammarNotes: 'Conditionnel de politesse (pourriez-vous).',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Meilleure demande:',
            options: ['Aide-moi.', 'Tu m’aides.', 'Pourriez-vous m’aider ?'],
            correctAnswer: 'Pourriez-vous m’aider ?',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Izgleda da postoji problem."',
            correctAnswer: 'Il semble qu’il y ait un problème.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "Nous ___ commencer plus tôt."',
            correctAnswer: 'pourrions',
            points: 10,
          },
        ],
      },
    ],
  },

  sr: {
    A1: [
      {
        title: 'Pozdravi i upoznavanje',
        introText: 'Nauči osnovne pozdrave i predstavljanje.',
        phrases: [
          { native: 'Hello', target: 'Zdravo', note: '' },
          { native: 'Good day', target: 'Dobar dan', note: '' },
          { native: 'My name is…', target: 'Zovem se …', note: '' },
          { native: 'Nice to meet you', target: 'Drago mi je', note: '' },
        ],
        grammarNotes:
          'Lični glagolski oblici i glagol "biti" (ja sam, ti si…).',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Odaberi pozdrav:',
            options: ['Doviđenja', 'Zdravo', 'Molim'],
            correctAnswer: 'Zdravo',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate into Serbian: "My name is Ana."',
            correctAnswer: 'Zovem se Ana.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Popuni: "___ dan."',
            correctAnswer: 'Dobar',
            points: 10,
          },
        ],
      },
      {
        title: 'U kafiću',
        introText: 'Poruči piće i budi ljubazan.',
        phrases: [
          {
            native: 'A coffee, please.',
            target: 'Jednu kafu, molim.',
            note: '',
          },
          { native: 'How much is it?', target: 'Koliko košta?', note: '' },
          { native: 'Thank you', target: 'Hvala', note: '' },
        ],
        grammarNotes: 'Akuzativ za poručivanje i čestice ljubaznosti.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Najljubaznije:',
            options: ['Daj kafu.', 'Hoću kafu.', 'Jednu kafu, molim.'],
            correctAnswer: 'Jednu kafu, molim.',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Hvala."',
            correctAnswer: 'Thank you.',
            points: 10,
          },
          {
            type: 'fill_gap',
            prompt: 'Popuni: "___ košta?"',
            correctAnswer: 'Koliko',
            points: 10,
          },
        ],
      },
      {
        title: 'Putanje i smerovi',
        introText: 'Pitaje za put i razumi smernice.',
        phrases: [
          {
            native: 'Where is the station?',
            target: 'Gde je stanica?',
            note: '',
          },
          { native: 'Turn right', target: 'Skrenite desno', note: '' },
          { native: 'Go straight', target: 'Idite pravo', note: '' },
        ],
        grammarNotes: 'Imperativ i upitne reči (gde, kako).',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: '„Desno“ znači…',
            options: ['Left', 'Right', 'Straight'],
            correctAnswer: 'Right',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Idite pravo."',
            correctAnswer: 'Go straight.',
            points: 10,
          },
          {
            type: 'fill_gap',
            prompt: 'Popuni: "Skrenite ___."',
            correctAnswer: 'desno',
            points: 10,
          },
        ],
      },
    ],
  },

  it: {
    A2: [
      {
        title: 'All’aeroporto',
        introText:
          'Impara frasi utili per il check-in e il controllo passaporti.',
        phrases: [
          {
            native: 'Passport, please.',
            target: 'Passaporto, per favore.',
            note: '',
          },
          { native: 'Where is gate A?', target: 'Dov’è il gate A?', note: '' },
          {
            native: 'I have a carry-on.',
            target: 'Ho un bagaglio a mano.',
            note: '',
          },
        ],
        grammarNotes: 'Preposizioni semplici (a, in), uso di “avere/essere”.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'Scegli la domanda corretta:',
            options: [
              'Dove è il gate A?',
              'Dov’è il gate A?',
              'Dove il gate A?',
            ],
            correctAnswer: 'Dov’è il gate A?',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Imam ručni prtljag."',
            correctAnswer: 'Ho un bagaglio a mano.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "___ passaporto, per favore."',
            correctAnswer: 'Il',
            points: 10,
          },
        ],
      },
      {
        title: 'In albergo',
        introText: 'Prenota una stanza e fai richieste cortesi.',
        phrases: [
          {
            native: 'I have a reservation.',
            target: 'Ho una prenotazione.',
            note: '',
          },
          {
            native: 'I would like a room.',
            target: 'Vorrei una camera.',
            note: 'Cortesia',
          },
          {
            native: 'Is breakfast included?',
            target: 'La colazione è inclusa?',
            note: '',
          },
        ],
        grammarNotes: 'Condizionale per cortesia (vorrei).',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: 'La forma più cortese:',
            options: [
              'Voglio una camera.',
              'Dammi una camera.',
              'Vorrei una camera.',
            ],
            correctAnswer: 'Vorrei una camera.',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Da li je doručak uključen?"',
            correctAnswer: 'La colazione è inclusa?',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "Ho ___ prenotazione."',
            correctAnswer: 'una',
            points: 10,
          },
        ],
      },
      {
        title: 'Al ristorante',
        introText: 'Ordina cibo e chiedi il conto.',
        phrases: [
          {
            native: 'The menu, please.',
            target: 'Il menù, per favore.',
            note: '',
          },
          {
            native: 'The bill, please.',
            target: 'Il conto, per favore.',
            note: '',
          },
          { native: 'Water', target: 'Acqua', note: '' },
        ],
        grammarNotes: 'Articoli determinativi/indeterminativi; per favore.',
        exercises: [
          {
            type: 'multiple_choice',
            prompt: '“Il conto” significa…',
            options: ['The table', 'The cook', 'The bill'],
            correctAnswer: 'The bill',
            points: 10,
          },
          {
            type: 'translate',
            prompt: 'Translate: "Meni, molim."',
            correctAnswer: 'Il menù, per favore.',
            points: 15,
          },
          {
            type: 'fill_gap',
            prompt: 'Fill: "___ menù, per favore."',
            correctAnswer: 'Il',
            points: 10,
          },
        ],
      },
    ],
  },
};

/** Map from your COURSES list titles to templates above */
const COURSE_DEFS = [
  ['en', 'A1', 'English for Beginners', ['beginner', 'conversation', 'travel']],
  [
    'en',
    'B1',
    'English Intermediate Essentials',
    ['intermediate', 'grammar', 'vocabulary'],
  ],
  ['de', 'A1', 'German for Beginners', ['beginner', 'daily-life']],
  ['de', 'B1', 'German Speaking Practice', ['speaking', 'listening']],
  ['es', 'A2', 'Spanish for Everyday Use', ['beginner', 'phrases']],
  ['es', 'B2', 'Spanish Advanced Conversations', ['advanced', 'conversation']],
  ['fr', 'A1', 'French Basics', ['beginner', 'pronunciation']],
  ['fr', 'B1', 'French Communication Skills', ['intermediate', 'dialogues']],
  ['sr', 'A1', 'Serbian from Scratch', ['alphabet', 'beginner']],
  ['it', 'A2', 'Italian Traveler Toolkit', ['travel', 'phrases']],
];

function buildCourseDoc([language, level, title, tags]) {
  return {
    language,
    title,
    level,
    description: `A structured ${title} course with real lessons, practical exercises, and clear objectives.`,
    coverImage: '',
    lessonCount: 0,
    tags,
  };
}

/** Build real lessons from templates */
function buildLessonsForCourse(course) {
  const tpl = TEMPLATES?.[course.language]?.[course.level];
  if (!tpl || !tpl.length) return []; // no template, skip

  return tpl.map((L, idx) => {
    const lessonId = new Types.ObjectId();
    return {
      _id: lessonId,
      course: course._id,
      order: idx + 1,
      title: L.title,
      objectives: deriveObjectivesFromPhrases(L.phrases),
      content: {
        introText: L.introText,
        phrases: L.phrases,
        grammarNotes: L.grammarNotes,
      },
      exercises: attachLessonIdToExercises(L.exercises, lessonId),
      passThresholdPercent: 70,
      estDurationMin: 10 + idx * 2,
    };
  });
}

function deriveObjectivesFromPhrases(phrases = []) {
  const o = [];
  if (phrases.length) o.push('Learn and practice key phrases');
  o.push('Understand and apply the grammar note');
  o.push('Complete interactive exercises with feedback');
  return o;
}

async function main() {
  const { MONGO_URI } = process.env;
  if (!MONGO_URI) {
    console.error('Missing MONGO_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const reset = process.argv.includes('--reset');
  if (reset) {
    console.log('Reset mode: clearing Courses & Lessons…');
    await Lesson.deleteMany({});
    await Course.deleteMany({});
  }

  const courseDocs = COURSE_DEFS.map(buildCourseDoc);
  const createdCourses = await Course.insertMany(courseDocs);
  console.log(`Inserted ${createdCourses.length} courses`);

  let totalLessons = 0;
  for (const c of createdCourses) {
    const lessons = buildLessonsForCourse(c);
    if (lessons.length) {
      await Lesson.insertMany(lessons);
      totalLessons += lessons.length;

      await Course.findByIdAndUpdate(c._id, { lessonCount: lessons.length });
    } else {
      console.log(
        `No templates for ${c.language.toUpperCase()} ${
          c.level
        } - skipped lessons`
      );
    }
  }

  console.log(`Inserted ${totalLessons} lessons (with embedded exercises)`);

  await mongoose.connection.close();
  console.log('Seed finished, connection closed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
