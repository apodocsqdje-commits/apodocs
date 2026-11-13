export interface Semester {
  id: string;
  modules: string[];
}

export interface Filiere {
  id: string;
  name: string;
  semesters: Semester[];
}

export interface Faculty {
  id: string;
  name: string;
  filieres: Filiere[];
}

export const NADOR_FACULTIES: Faculty[] = [
  {
    id: "FEGN",
    name: "Faculté d'économie et de gestion (FEGN)",
    filieres: [
      {
        id: "ECO_TRONC",
        name: "Economie (Tronc Commun S1-S4)",
        semesters: [
          {
            id: "S1",
            modules: [
              "Introduction aux sciences économiques",
              "Microéconomie 1",
              "Économie d'entreprise",
              "Mathématiques 1",
              "Comptabilité générale 1",
              "Initiation aux études de droit",
              "Méthodologie du travail universitaire",
            ],
          },
          {
            id: "S2",
            modules: [
              "Microéconomie 2",
              "Macroéconomie 1",
              "Statistique descriptive",
              "Mathématiques 2",
              "Comptabilité générale 2",
              "Compétence numérique et IA",
              "Management fondamentale",
            ],
          },
          {
            id: "S3",
            modules: [
              "Macroéconomie 2",
              "Histoire de la pensée économique",
              "Économie du Maroc",
              "Probabilité",
              "Droit de l'entreprise",
              "Informatique de gestion",
              "Langue étrangère (Français 1)",
            ],
          },
          {
            id: "S4",
            modules: [
              "Économie monétaire et financière",
              "Problèmes économiques et sociaux",
              "Finances publiques",
              "Sociologie",
              "Echantillonnage et estimation",
              "Comptabilité analytique",
              "Langue étrangère: Français",
            ],
          },
        ],
      },
      {
        id: "ECO_POLITIQUES",
        name: "Economie: Politiques Économiques (S5-S6)",
        semesters: [
          {
            id: "S5",
            modules: [
              "Politiques économiques structurelles",
              "Comptabilité nationale",
              "Économie industrielle",
              "Finances locales",
              "Management public et gouvernance territoriale",
              "Intelligence artificielle et intelligence économique",
              "langues étrangère (anglais 1)",
            ],
          },
          {
            id: "S6",
            modules: [
              "Politique monétaire et financière",
              "Politiques budgétaires et fiscale",
              "Introduction aux méthodes économétrique",
              "Fiscalité des entreprises",
              "Droit des affaires",
              "Culture entrepeneuriale",
              "Langue étrangère: Anglais",
            ],
          },
        ],
      },
      {
        id: "GESTION_TRONC",
        name: "Gestion (Tronc Commun S1-S4)",
        semesters: [
          {
            id: "S1",
            modules: [
              "Introduction aux sciences de gestion",
              "Comptabilité générale 1",
              "Mathématiques",
              "Introduction à l’étude du droit",
              "Microéconomie 1",
              "Macroéconomie 1",
              "Méthododlogie de travail universitaire",
            ],
          },
          {
            id: "S2",
            modules: [
              "Microéconomie 2",
              "Comptabilité générale 2",
              "Management fondamental",
              "Macroéconomie 2",
              "Statistique descriptive",
              "Mathématiques financieres",
              "Compétence numérique et IA",
            ],
          },
          {
            id: "S3",
            modules: [
              "Comptabilité analytique de gestion",
              "Management des organisations",
              "Droit de l’entreprise",
              "Economie du maroc",
              "Probabilités",
              "Sociologie des organisations",
              "Français",
            ],
          },
          {
            id: "S4",
            modules: [
              "Analyse financière",
              "Gestion des ressources humaine",
              "Comptabilité des sociétés",
              "Analyse et traitement des données",
              "Informatique de gestion",
              "Marketing de base",
              "Langue étrangère: Français",
            ],
          },
        ],
      },
      {
        id: "GESTION_CCA",
        name: "Gestion: Comptabilité Contrôle et Audit (S5-S6)",
        semesters: [
          {
            id: "S5",
            modules: [
              "Audit comptable et financier",
              "Comptabilité approfondie",
              "Contrôle de gestion 1",
              "Fiscalité des entreprises 1",
              "Gestion financière",
              "Droit fiscal",
              "Anglais",
            ],
          },
          {
            id: "S6",
            modules: [
              "Controle de gestion 2",
              "Comptabilite de groupe et normes internationales",
              "Fiscalite des entreprises 2",
              "Audit operationnel",
              "Management des systemes d’information",
              "Culture entrepreneriale",
              "Langue étrangère: Anglais",
            ],
          },
        ],
      },
      {
        id: "GESTION_CFF",
        name: "Gestion: Comptabilité Finance et Fiscalité (S5-S6)",
        semesters: [
          {
            id: "S5",
            modules: [
              "Comptabilité approfondie",
              "Choix d’investissement et modes de financement",
              "Fiscalité des entreprises 1",
              "Contrôle de gestion",
              "Management stratégique",
              "Droit des affaires",
              "Anglais",
            ],
          },
          {
            id: "S6",
            modules: [
              "Gestion de portefeuille",
              "Fiscalité des entreprises 2",
              "Gestion de trésorerie",
              "Audit comptable et financier",
              "Anglais des affaires",
              "Culture entrepreneuriale",
              "Langue étrangère: Anglais",
            ],
          },
        ],
      },
      {
        id: "GESTION_PME",
        name: "Gestion: Management des PME PMI (S5-S6)",
        semesters: [
          {
            id: "S5",
            modules: [
              "Marketing Stratégique et Différenciation en PME",
              "Fiscalité et Optimisation des PME",
              "Entrepreneuriat Digital et Innovation pour les PME",
              "Gestion de la Relation Client en PME (CRM)",
              "Informatique de gestion approfondie",
              "Pilotage Stratégique et Leadership en PME",
              "ANGLAIS",
            ],
          },
          {
            id: "S6",
            modules: [
              "Pilotage et Contrôle de Performance en PME",
              "Management des systèmes d'information",
              "Marketing Digital pour les PME",
              "Droit de travail",
              "Logistique de Distribution et Efficacité Opérationnelle en PME",
              "Culture entrepreneuriale",
              "Langue étrangère: Anglais",
            ],
          },
        ],
      },
      {
        id: "GESTION_MPL",
        name: "Gestion: Management Portuaire et Logistique (S5-S6)",
        semesters: [
          {
            id: "S5",
            modules: [
              "Stratégies Logistiques",
              "Gestion des plateformes portuaires",
              "Gestion des systèmes d’informations logistiques et portuaires",
              "Économie et gestion des opérations portuaires",
              "Gestion des approvisionnements",
              "Management de projet",
              "Anglais",
            ],
          },
          {
            id: "S6",
            modules: [
              "Logistique portuaire et maritime",
              "Controle de gestion logistique",
              "Audit logistique",
              "Les opérations douanières et pratiques de transit",
              "Droit portuaire et maritime",
              "Anglais pour le transport et la logistique",
              "Langue étrangère: Anglais",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "FLLAN",
    name: "Faculté des Langues, des Lettres et des Arts (FLLAN)",
    filieres: [
      // --- ENGLISH STUDIES ---
      {
        id: "ENG_TRONC",
        name: "English Studies (Tronc Commun S1-S5)",
        semesters: [
          { id: "S1", modules: ["Grammar 1", "Paragraph Writing", "Reading Comprehension & Precis 1", "Spoken English", "Guided Reading 1", "ACADEMIC VOCULARY", "Methodology of University Work"] },
          { id: "S2", modules: ["Grammar 2", "Composition", "Reading Comprehension & Precis 2", "Oral Communication", "Guided Reading 2", "British/American Civilization", "Digital skills"] },
          { id: "S3", modules: ["Advanced grammar", "Advanced composition", "Extensive Reading", "Public Speaking", "Readings in Global cultures", "French", "initiation to translation"] },
          { id: "S4", modules: ["Introduction to Research", "Introduction to Discourse Analysis", "Translation", "Introduction to Linguistics", "Introduction to Cultural Studies", "Introduction to Media Studies", "French 2"] },
          { id: "S5", modules: ["African literature", "Literary Criticism", "General Linguistics", "ENGLISH LANGUAGE TEACHING", "Research Methods", "Media and Cultural Studies", "SPANISH 1"] }
        ]
      },
      {
        id: "ENG_LINGUISTICS",
        name: "English Studies: Linguistics (S6)",
        semesters: [
          { id: "S6", modules: ["Phonetics and Phonology", "Morphology and Syntax", "Sociolinguistics", "Semantics and Pragmatics", "Discourse Analysis (in Arabic)", "Entrepreneurial Culture", "Spanish 2"] }
        ]
      },
      {
        id: "ENG_LITERATURE",
        name: "English Studies: Literature (S6)",
        semesters: [
          { id: "S6", modules: ["Drama & Poetry", "Literature & Environment", "Diaspora Literature", "American & British Novels", "Semiotics (in Arabic)", "Entrepreneurial Culture", "Spanish 2"] }
        ]
      },

      // --- ETUDES ARABES ---
      {
        id: "AR_TRONC",
        name: "Etudes Arabes (Tronc Commun S1-S5)",
        semesters: [
          { id: "S1", modules: ["نحو 1", "مدخل إلى علوم اللغةالعربية", "الصرف", "نصوص نثرية", "تاريخ املغرب", "مدخل إلى الأدب المغربي", "منهجية العمل الجامعي"] },
          { id: "S2", modules: ["صواتة", "نصوص شعرية", "مدخل إلى التراث الثقافي", "البلاغة", "الدلالة", "مدخل إلى الآداب وفنونه", "المهارات الرقمية والذكاء الاصطناعي"] },
          { id: "S3", modules: ["نحو 2", "نصوص درامية", "أجناس أدبية", "الفلسفة", "المعجم", "اللغة الفرنسية", "نقد قديم"] },
          { id: "S4", modules: ["النقد الأدبي والفني", "مناهج تحليل النصوص", "مدخل إلى علم الاجتماع", "العروض", "تركيب", "فقه اللغة", "اللغة الفرنسية"] },
          { id: "S5", modules: ["المنطق وآليات الاستدلال", "شعر مغربي حديث", "تحليل الخطاب", "بلاغة الحجاج", "السيميائيات", "مناهج البحث", "اللغات الأجنبية"] }
        ]
      },
      {
        id: "AR_ADAB",
        name: "Etudes Arabes: أدب و نقد (S6)",
        semesters: [
          { id: "S6", modules: ["اتجاهات ما بعد النقد البنيوي", "سرد مغربي حديث", "نظرية الأدب", "قضايا نقدية قديمة", "مفاهيم أدبية ونقدية بالفرنسية", "ثقافة ريادة الأعمال", "اللغة الإنجليزية"] }
        ]
      },
      {
        id: "AR_LING",
        name: "Etudes Arabes: اللسانيات (S6)",
        semesters: [
          { id: "S6", modules: ["أصول النحو", "نماذج تركيبية", "نماذج تداولية", "علم اللغة الاجتماعي", "مفاهيم لسانية بالفرنسية", "ثقافة ريادة الأعمال", "الإنجليزية"] }
        ]
      },

      // --- ETUDES HISPANIQUES ---
      {
        id: "HISP_TRONC",
        name: "Etudes Hispaniques (S1-S6)",
        semesters: [
          { id: "S1", modules: ["Gramática española I", "Lectura y comprensión de textos", "expresion oral I", "expresion escrita y redacción", "geografia del mundo hispanico", "Prácticas de lengua", "methodologie du travail universitaire"] },
          { id: "S2", modules: ["Expresión Escrita y Redacción II", "Gramática Española II", "Comunicación Oral", "Textos culturales hispánicos", "Introducción a la Historia del mundo Hispánico", "Competencia Digital e Inteligencia Artificial", "Practica de lengua II"] },
          { id: "S3", modules: ["Técnicas de comentario de textos literarios", "Langue etrangere", "Cultura y Civilización de Al Andalus", "Estudio de artículos traducidos al español", "Sintáxis del español", "Fonética y fonología", "Panorama de la Literatura española I"] },
          { id: "S4", modules: ["Panorama de la literatura hispánica I", "Cuestiones de lexicología y semántica", "Iniciación a la linguística", "Análisis literario I", "Iniciación a las traducciones directa e inversa", "Analisis de textos traducidos de la literatura espanola", "Lenguas extranjeras"] },
          { id: "S5", modules: ["Literatura y Migración", "Pragmática", "Literatura hispánica", "Análisis semiótico de textos", "Traducción espaol/arabe", "Historia del pensamiento y del arte español", "Langue estrangere"] },
          { id: "S6", modules: ["Narrativa Hispanoamericana (El cuento)", "Sociolinguística", "Relaciones hispanomarroquíes", "España y el Rif", "Literatura Española Moderna y Contemporánea", "Traduction Arabe espagnole", "Lenguas extranjeras"] }
        ]
      },

      // --- ETUDES FRANCAISES ---
      {
        id: "FR_TRONC",
        name: "Etudes Françaises (Tronc Commun S1-S5)",
        semesters: [
          { id: "S1", modules: ["Eléments de grammaire1", "Phonétique", "Techni d’express et de commun écrite", "Lecture méthodique des textes littéraires1", "Histoire des idées", "IMR", "MTU"] },
          { id: "S2", modules: ["LECTURE METHODIQUE DES TEXTES LITTÉRAIRES 2", "PHONOLOGIE", "HISTOIRE DES IDEES (18ème siècle)", "CULTURE DIGITALE 1", "GRAMMAIRE II", "LEXICOGRAPHIE", "TECHNIQUES D’EXPRESSION ET DE COMMUNICATION ORALES"] },
          { id: "S3", modules: ["Morphosyntaxe", "Lexicologie", "Histoire, art et patrimoine du Maroc", "Exercices littéraires 1", "Histoire des idées", "Anglais", "Introduction à l’interculturel"] },
          { id: "S4", modules: ["ANALYSE DU DISCOURS", "EXERCICES LITTÉRAIRES II", "HISTOIRE DES IDEES XXEME SIECLE", "INTRODUCTION AUX LITTÉRATURES FRANCOPHONES", "INITIATION A LA LINGUISTIQUE", "DÉVELOPPEMENT PERSONNEL", "ADVANCED ENGLISH"] },
          { id: "S5", modules: ["Théories de sens", "Linguistique et communication", "Méthodologie de recherche", "Traductologie", "Culture digitale", "Théâtre du XXème siècle", "Anglais"] }
        ]
      },
      {
        id: "FR_LING",
        name: "Etudes Françaises: Linguistique (S6)",
        semesters: [
          { id: "S6", modules: ["SEMANTIQUE", "DIDACTIQUE DES LANGUES", "SEMIOTIQUE", "CULTURE ENTREPRENEURIALE", "Communication interculturelle", "AMENAGEMENT DES LANGUES", "Law, eco-citizenship and civics"] }
        ]
      },
      {
        id: "FR_LIT",
        name: "Etudes Françaises: Littérature (S6)",
        semesters: [
          { id: "S6", modules: ["CRITIQUE LITTERAIRE", "LITTERATURE MONDIALE ET TRADUCTION", "LITTERATURE MAROCAINE D’EXPRESSION FRANÇAISE", "DIDACTIQUE DES LANGUES", "SEMIOTIQUE", "Culture entrepreneuriale", "Law, eco-citizenship and civics"] }
        ]
      },

      // --- LANGUES ET CULTURE AMAZIGHE ---
      {
        id: "AMZ_TRONC",
        name: "Langues et Culture Amazighe (S1-S6)",
        semesters: [
          { id: "S1", modules: ["Graphie et orthographe", "Introduction à la linguis", "Intro littéra amazighe", "Histoire et Civilisation", "Introduction aux sciences", "terminologie", "منهجية العمل الجامعي"] },
          { id: "S2", modules: ["خط واملائية 2", "النحو الامازيغي", "الصوتيات", "الجغرفيا البشرية", "الانتروبولوجيا الثقافية", "الادب الامازيغي من الشفوي الى المكتوب", "المهارات الرقمية والذكاء الاصطناعي"] },
          { id: "S3", modules: ["Morphologie", "Phonologie 1", "Genres poétiques", "تحليل النصوص", "مجتمع المعلومات والمعرفة", "فرنسية", "بيبليوغرافيا امازيغية"] },
          { id: "S4", modules: ["التركيب النحوي 1", "المعجمية 2", "الاجناس السردية", "تحليل النصوص 2", "النقد الادبي الامازيغي 1", "مدخل الى علوم التربية", "اللغة الفرنسية"] },
          { id: "S5", modules: ["شعر امازيغي", "النقد الادبي 2", "البنيات التركيبية", "معجمية امازيغية", "صواتية 2", "فنون درامية وموسيقية", "اللغة الأجنبية"] },
          { id: "S6", modules: ["الرواية والقصة الامازيغية", "السمياء في الادب الامازيغي", "النحو ، قواعد الافعال", "نظريات وتطبيقات لسانية", "السينما والمسرح الامازيغي", "الثقافة المقاولاتية", "اللغة والانجليزية"] }
        ]
      },

      // --- ETUDES ISLAMIQUES ---
      {
        id: "ISL_TRONC",
        name: "Etudes Islamiques (S1-S6)",
        semesters: [
          { id: "S1", modules: ["مدخل لدراسة علوم الحديث", "فقه السيرة النبوية", "النحو والصرف", "مدخل لدراسة علوم القرآن", "الثوابت الدينية المغربية", "تاريخ التصنيف في العلوم الإسلامية", "منهجية عمل الجامعة"] },
          { id: "S2", modules: ["مدخل لدراسة العقيدة الإسلامية", "علوم القرآن", "مفاهيم وقضايا فلسفية", "الثقافة الرقمية", "البلاغة", "فقه العبادات في المذهب المالكي", "مدخل لدراسة تاريخ التشريع الإسلامي"] },
          { id: "S3", modules: ["أصول الفقه1", "اللغة الأجنبية 1", "مدخل إلى علم الاجتماع وعلم النفس", "الفكر الإصلاحي في المدرسة المغربية", "القراءات القرآنية", "علوم الحديث", "فقه المعاملات في المذهب المالكي"] },
          { id: "S4", modules: ["التأويل وعلوم التفسير", "تاريخ الأديان", "فقه الحديث", "اللغة الأجنبية 1", "الفكر الإسلامي", "أصول الفقه2", "المواريث"] },
          { id: "S5", modules: ["أصول التفسير", "اللغة الأجنبية2", "أصول الدين", "مقاصد الشريعة", "مناهج التصنيف الحديثي وطرق التخريج", "فقه الزواج والطلاق", "قضايا فكرية معاصرة"] },
          { id: "S6", modules: ["الإعجاز القرآني", "اللغة الأجنبية 2", "علم علل الحديث وعلم مختلفه", "فقه الولادة ونتائجها", "الاجتهاد والنوازل", "الحضارة الإسلامية", "القانون والمدنية والمواطنة"] }
        ]
      },

      // --- GEOGRAPHIE ET AMENAGEMENT ---
      {
        id: "GEO_TRONC",
        name: "Géographie et Aménagement (S1-S6)",
        semesters: [
          { id: "S1", modules: ["جيومورفولوجيا عامة", "جغرافية السكان والديموغرافيا", "قراءة و تحليل الخرائط الطبوغرافية 1", "مدخل لدراسة التاريخ الوسيط", "مدخل إلى علم الاجتماع", "مدخل إلى علم الجغرافيا", "منهجية عمل الجامعة"] },
          { id: "S2", modules: ["جغرافية المغرب العامة", "الاتجاهات الكلاسيكية والحديثة في علم الاجتماع", "قراءة و تحليل الخرائط الطبوغرافية 2", "المهارات الرقمية والذكاء الاصطناعي", "المناخ", "جغرافية الأرياف", "مدخل لدراسة التاريخ المعاصر والراهن"] },
          { id: "S3", modules: ["اللغات الأجنبية (الفرنسية)", "جيومورفولوجيا بنيوية", "قراءة و تحليل الخرائط الجيولوجية و الجيومورفولوجية", "دينامية المجال الريفي", "جغرافيا اقتصادية", "جغرافية المدن", "المناخ الدينامي"] },
          { id: "S4", modules: ["الخرائطية والسيميولوجيا", "دينامية المجال الحضري", "الإحصاء والتعبير البياني", "النظم البيئية ونبات وتربة", "جغرافية البحر المتوسط وإفريقيا جنوب الصحراء", "جغرافية الطاقة", "اللغات الأجنبية (الفرنسية)"] },
          { id: "S5", modules: ["الاستشعار عن بعد", "تهيئة السواحل", "اللغات الأجنبية (الإنجليزية)", "مناهج البحث الجغرافي", "التهيئة الريفية", "مدخل إلى نظم المعلومات الجغرافية مستوى (1)", "سياسة إعداد التراب"] },
          { id: "S6", modules: ["السياحة والتنمية الترابية", "اللغة الإنجليزية", "تقنيات المسح والمعالجة الإحصائية", "مدخل إلى نظم المعلومات الجغرافية مستوى (2)", "التسويق الترابي", "التهيئة الحضرية", "تدبير المخاطر الطبيعية"] }
        ]
      },

      // --- PHILOSOPHIE ---
      {
        id: "PHILO_TRONC",
        name: "Philosophie (S1-S6)",
        semesters: [
          { id: "S1", modules: ["أسس وقضايا الفلسفة", "الفلسفة والمجال", "الفكر الإسلامي", "مدخل إلى علم الاجتماع", "المدخل إلى الأنثروبولوجيا", "المناهج في الفلسفة", "منهجية العمل الجامعي"] },
          { id: "S2", modules: ["علم النفس الاجتماعي", "لوجيز في تاريخ الفلسفة", "الفكر الشرقي", "وحدة في المهارات الرقمية والذكاء الاصطناعي", "الاتجاهات الكلاسيكية والحديثة في علم الاجتماع", "تاريخ العلوم", "مفاهيم ونصوص فلسفية"] },
          { id: "S3", modules: ["فلسفة التاريخ والسياسة", "قضايا علم الكلام", "فلسفة التواصل", "العلم والتقنيات", "المنطق وآليات الاستدلال", "الإيكولوجيا وفلسفة الحياة", "اللغات الأجنبية"] },
          { id: "S4", modules: ["فلسفة الدين", "المنطق المعاصر وفلسفة اللغة", "الجماليات وفلسفة الفن", "فلسفة الأخلاق", "فلسفة العلوم", "فلسفة القانون وحقوق الإنسان", "اللغات الأجنبية"] },
          { id: "S5", modules: ["الذكاء الاصطناعي", "الفلسفة الحديثة", "العلوم المعرفية والذكاء الاصطناعي", "الفلسفة الغربية في العصر الوسيط", "قضايا في الفكر العربي المعاصر", "المنطق الفلسفي", "اللغات الأجنبية"] },
          { id: "S6", modules: ["الفلسفة الاجتماعية", "فلسفة التربية وديداكتيك الفلسفة", "تيارات فلسفية معاصرة", "فلسفة الحداثة وما بعد الحداثة", "الفلسفة والترجمة", "الثقافة المقاولاتية", "اللغات الأجنبية"] }
        ]
      }
    ]
  },
  {
    id: "FSJPN",
    name: "Faculté des sciences juridiques et politiques (FSJPN)",
    filieres: [
      // --- DROIT PUBLIC ---
      {
        id: "DROIT_PUB_TRONC",
        name: "Droit Public (Tronc Commun S1-S5)",
        semesters: [
          { id: "S1", modules: ["المدخل لدراسة القانون", "المدخل لدراسة الشريعة", "النظرية العامة للقانون الدستوري", "المدخل لعلم السياسة", "المدخل إلى علم الاجتماع", "المدخل لدراسة الاقتصاد والتسيير", "منهجية العمل الجامعي"] },
          { id: "S2", modules: ["النظرية العامة للالتزامات والعقود", "الأنظمة الدستورية الكبرى", "القانون الجنائي العام", "المدخل للعلاقات الدولية", "المدخل للقانون الإداري والتنظيم الإداري", "القانون العام الاقتصادي", "المهارات الرقمية والذكاء الاصطناعي"] },
          { id: "S3", modules: ["قانون الأسرة", "القانون الاجتماعي", "القانون الدولي العام", "المالية العامة", "النشاط الإداري", "قانون البيئة", "اللغة الأجنبية : الفرنسية"] },
          { id: "S4", modules: ["تاريخ الفكر السياسي", "التنظيم القضائي", "حقوق الإنسان والحريات العامة", "قانون المساطر", "المنازعات الإدارية", "المشاكل السياسية الكبرى", "اللغة الأجنبية : الفرنسية"] },
          { id: "S5", modules: ["القانون الانتخابي", "القانون البرلماني", "علم الاجتماع السياسي", "حكامة المرافق العمومية", "تحليل السياسات العمومية", "نظرية العلاقات الدولية", "اللغة الأجنبية : الإنجليزية"] }
        ]
      },
      {
        id: "DROIT_PUB_ADMIN",
        name: "Droit Public: الدراسات الإدارية والمالية (S6)",
        semesters: [
          { id: "S6", modules: ["التنمية السياسية", "قانون المحاسبة العمومية", "المالية المحلية", "الصفقات العمومية", "القانون الضريبي", "الثقافة المقاولاتية", "اللغة الأجنبية : الإنجليزية"] }
        ]
      },
      {
        id: "DROIT_PUB_POL",
        name: "Droit Public: الدراسات السياسية والدولية (S6)",
        semesters: [
          { id: "S6", modules: ["القانون الدبلوماسي والقنصلي", "السياسة الخارجية", "القانون الدولي الاقتصادي", "القضاء الدستوري", "السياسات العمومية والذكاء الاصطناعي", "الثقافة المقاولاتية", "اللغة الأجنبية : الإنجليزية"] }
        ]
      },

      // --- DROIT PRIVÉ ---
      {
        id: "DROIT_PRIV_TRONC",
        name: "Droit Privé (Tronc Commun S1-S5)",
        semesters: [
          { id: "S1", modules: ["المدخل لدراسة القانون", "المدخل لدراسة الشريعة", "النظرية العامة للقانون الدستوري", "المدخل لعلم السياسة", "المدخل لعلم الاجتماع القانوني", "المدخل لدراسة الاقتصاد والتسيير", "منهجية العمل الجامعي"] },
          { id: "S2", modules: ["النظرية العامة للالتزامات والعقود", "القانون التجاري الأساسي", "القانون الجنائي العام", "المدخل للعلاقات الدولية", "المدخل للقانون الإداري والتنظيم الإداري", "قانون المعاملات الإلكترونية", "المهارات الرقمية والذكاء الاصطناعي"] },
          { id: "S3", modules: ["قانون الأسرة", "القانون الاجتماعي", "القانون الجنائي الخاص", "المالية العامة", "النشاط الإداري", "المسؤولية المدنية", "اللغة الأجنبية : الفرنسية"] },
          { id: "S4", modules: ["قانون الشركات", "التنظيم القضائي", "القانون العقاري", "المنازعات الإدارية", "حقوق الإنسان والحريات العامة", "علم الإجرام", "اللغة الأجنبية : الفرنسية"] },
          { id: "S5", modules: ["القانون الدولي الخاص", "الحقوق العينية", "وسائل الأداء والائتمان", "قانون التأمين", "الوسائل البديلة لتسوية المنازعات", "مساعدو العدالة", "اللغة الأجنبية : الإنجليزية"] }
        ]
      },
      {
        id: "DROIT_PRIV_JUD",
        name: "Droit Privé: المهن القانونية والقضائية (S6)",
        semesters: [
          { id: "S6", modules: ["المسطرة المدنية", "المسطرة الجنائية", "المواريث والحقوق المالية", "نظام التوثيق", "ممارسة الترافع", "الثقافة المقاولاتية", "اللغة الأجنبية : الإنجليزية"] }
        ]
      },
      {
        id: "DROIT_PRIV_AFFAIRES",
        name: "Droit Privé: قانون المال والاعمال (S6)",
        semesters: [
          { id: "S6", modules: ["المسطرة المدنية", "قانون صعوبات المقاولة", "القانون البنكي", "قانون الملكية الفكرية", "القانون الضريبي", "الثقافة المقاولاتية", "اللغة الأجنبية : الإنجليزية"] }
        ]
      }
    ]
  },
  {
    id: "FSAN",
    name: "Faculté des sciences appliquées (FSAN)",
    filieres: [
      // --- PHYSIQUE ---
      {
        id: "PHYS",
        name: "Physique (S1-S6)",
        semesters: [
          { id: "S1", modules: ["Mécanique du point", "Thermodynamique 1", "Atomistique", "Thermochimie", "Analyse 1", "Algèbre 1", "Méthodologie de travail universitaire"] },
          { id: "S2", modules: ["Optique géométrique", "Electricité", "Chimie en solution", "Liaisons chimiques", "Analyse 2", "Algèbre 2", "Digital skills & intelligence artificielle"] },
          { id: "S3", modules: ["Mécanique du solide", "Thermodynamique 2", "Électromagnétisme", "Mathématiques pour la physique", "Circuits électriques", "Chimie organique générale", "Langues étrangères : Français"] },
          { id: "S4", modules: ["Electronique analogique 1", "Optique ondulatoire", "Electronique numérique", "Mécanique quantique", "Analyse numérique, algorithmique et programmation Python", "Cristallographie géométrique", "Langue étrangère : Français"] },
          { id: "S5", modules: ["Mécanique analytique", "Physique des matériaux", "Physique statistique", "Physique nucléaire", "Méthodes numériques", "Développement personnel", "Langues étrangères : Anglais"] },
          { id: "S6", modules: ["Electronique analogique 2", "Physique quantique", "Mécaniques des fluides", "Transferts thermiques", "Physique relativiste", "Culture entrepreneuriale", "Langue étrangère : Anglais"] }
        ]
      },

      // --- BIOLOGIE ---
      {
        id: "BIO_BIOMED",
        name: "Biologie: Sciences Biomédicales (S1-S6)",
        semesters: [
          { id: "S1", modules: ["Biologie cellulaire", "Histologie et notion d'embryologie", "Géologie générale", "Atomistique et Liaison chimique", "Mathématiques", "Thermodynamique et Mécanique", "Méthodologie de travail universitaire"] },
          { id: "S2", modules: ["Biologie des organismes animaux", "Biologie des organismes végétaux", "Chimie des solutions et initiation à la chimie organique", "Géodynamique interne", "Géodynamique externe", "Optique et Electricité", "Culture digitale"] },
          { id: "S3", modules: ["Biochimie structurale", "Microbiologie générale", "Écologie générale", "Techniques d'analyse", "Biostatistique", "Informatique pour la biologie", "Langues étrangères : Français"] },
          { id: "S4", modules: ["Systématique et notion de biodiversité", "Enzymologie et biochimie métabolique", "Génétique", "Biologie moléculaire", "Physiologie végétale", "Physiologie animale", "Langue étrangère : Français"] },
          { id: "S5", modules: ["Physiologie humaine", "Pharmacologie", "Immunoligie", "Techniques d'analyse médicales", "Embryologie humaine", "Excel avancé", "Langues étrangères : Anglais"] },
          { id: "S6", modules: ["Microbiologie et maladies infectieuses", "Pharmacognosie / Phytothérapie", "Nutrition et régimes alimentaires", "Genomics and advanced molecular biology", "Epidemiologie", "Culture entrepreneuriale", "Langue étrangère : Anglais"] }
        ]
      },

      // --- CHIMIE (Branched) ---
      {
        id: "CHIM_TRONC",
        name: "Chimie (Tronc Commun S1-S5)",
        semesters: [
          { id: "S1", modules: ["Mécanique du point", "Thermodynamique 1", "Atomistique", "Thermochimie", "Analyse 1", "Algèbre 1", "Méthodologie de travail universitaire"] },
          { id: "S2", modules: ["Optique géométrique", "Electricité", "Chimie en solution", "Liaisons chimiques", "Analyse 2", "Algèbre 2", "Digital skills & intelligence artificielle"] },
          { id: "S3", modules: ["Chimie Organique générale", "Chimie descriptive I et Diagrammes de phases", "Chimie des électrolytes", "Electromagnétisme", "Mathématiques pour la chimie", "Algorithmique et programmation en Python", "Langues étrangères : Français"] },
          { id: "S4", modules: ["Hydrocarbures et Fonctions Monovalentes", "Cristallographie géométrique et cristallochimie", "Thermodynamique chimique", "Techniques spectroscopiques d’analyse", "Mécanique quantique", "Probabilités et statistiques", "Langue étrangère : Français"] },
          { id: "S5", modules: ["Chimie Organique Fonctionnelle", "Electrochimie et ses applications industrielles", "Techniques d’analyses et de caractérisation des matériaux", "Cinétique et catalyse", "Radiocristallo- graphie et cristallochimie II", "Systèmes de Gestion de Contenu (CMS)", "Langues étrangères : Anglais"] }
        ]
      },
      {
        id: "CHIM_MAT",
        name: "Chimie: Chimie des Materiaux (S6)",
        semesters: [
          { id: "S6", modules: ["Méthodes d'élaboration et caractérisation des matériaux inorganiques", "Chimie descriptive II et chimie de coordination", "Techniques d’analyses chromatographiques", "Matériaux et applications", "Chimie des Surfaces et Interfaces", "Culture entrepreneuriale", "Langue étrangère : Anglais"] }
        ]
      },
      {
        id: "CHIM_ORG",
        name: "Chimie: Chimie Organique et Materiaux Inorganiques (S6)",
        semesters: [
          { id: "S6", modules: ["Les grandes classes des réactions organiques", "Chimie descriptive II et chimie de coordination", "Techniques d’analyses chromatographiques", "Introduction à la chimie des polymères", "Chimie des Surfaces et Interfaces", "Culture entrepreneuriale", "Langue étrangère : Anglais"] }
        ]
      },

      // --- INFORMATIQUE ---
      {
        id: "INFO_IA",
        name: "Informatique et Intelligence Artificielle (S1-S6)",
        semesters: [
          { id: "S1", modules: ["Analyse 1", "Algèbre 1", "Algorithmique & programmation Python 1", "Mécanique du point", "Thermodynamique", "Algèbre 2", "Methodologie de travail universitaire"] },
          { id: "S2", modules: ["Algèbre 3", "Analyse 2", "Algorithmique & programmation Python 2", "Analyse 3", "Electrostatique et magnétostatique", "Optique géométrique", "Digital skills & intelligence artificielle"] },
          { id: "S3", modules: ["Programmation en langage C", "Architecture des ordinateurs", "Conception orientée objet UML", "Programmation web 1", "Système d’exploitation 1", "Probabilités et statistiques", "Langues étrangères 1"] },
          { id: "S4", modules: ["Programmation objet avec C++", "Algebre relationnel & langage SQL", "Structures de donnees", "Analyse numérique", "Systeme d’exploitation 2", "Programmation web 2 : langage JavaScript", "Langue étrangère: Français"] },
          { id: "S5", modules: ["Fondements de l’Intelligence Artificielle", "Programmation avancée en python", "Bases de données, administration et programmation avancée", "Recherche opérationnelle", "Traitement d’Images", "Comptabilité Générale", "Langues étrangères 3"] },
          { id: "S6", modules: ["Développement web avancé PHP", "Développement mobile avec kotlin", "Introduction to machine learning", "Introduction à la cryptographie et à la sécurité informatique", "Administration réseaux", "Droit, civisme et citoyennete", "Langue étrangère: Anglais"] }
        ]
      },

      // --- MATHEMATIQUES ---
      {
        id: "MATH_APP",
        name: "Mathématiques Appliquées (S1-S6)",
        semesters: [
          { id: "S1", modules: ["Analyse 1", "Algèbre 1", "Algorithmique & programmation Python 1", "Mécanique du point", "Thermodynamique", "Algèbre 2", "Methodologie de travail universitaire"] },
          { id: "S2", modules: ["Algèbre 3", "Analyse 2", "Algorithmique & programmation Python 2", "Analyse 3", "Electrostatique et magnétostatique", "Optique géométrique", "Digital skills & intelligence artificielle"] },
          { id: "S3", modules: ["Analyse 4", "Analyse 5", "Algèbre 4", "Probabilités et Statistiques", "Algorithmique et programmation", "Mécanique du solide", "Français"] },
          { id: "S4", modules: ["Algèbre 5", "Algèbre 6", "Analyse 6", "Informatique 4 : Algorithmique et structures de données", "Electromagnétisme", "Analyse Numérique", "Langue étrangère: Français"] },
          { id: "S5", modules: ["Analyse numérique 2", "Intégration 2", "Calcul différentiel", "Topologie", "Analyse de données", "Systèmes de Gestion de Contenu (CMS)", "Anglais"] },
          { id: "S6", modules: ["Calcul scientifique", "Programmation mathématique", "Analyse de Fourier et distributions", "Probabilités avancées", "Analyse complexe", "Culture entrepreneuriale", "Anglais"] }
        ]
      }
    ]
  }
];

