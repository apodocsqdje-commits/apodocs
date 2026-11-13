export type Language = "ar" | "fr" | "en";

export interface Translations {
  [key: string]: {
    ar: string;
    fr: string;
    en: string;
  };
}

export const translations: Translations = {
  // Navigation
  "nav.home": {
    ar: "الرئيسية",
    fr: "Accueil",
    en: "Home",
  },
  "nav.documents": {
    ar: "تصفح المستندات",
    fr: "Explorer",
    en: "Browse Documents",
  },
  "nav.faculties": {
    ar: "المؤسسات والكليات",
    fr: "Facultés & Portails",
    en: "Faculties & Portals",
  },
  "nav.upload": {
    ar: "رفع مستند",
    fr: "Déposer",
    en: "Upload",
  },
  "nav.my_uploads": {
    ar: "مرفوعاتي",
    fr: "Mes Dépôts",
    en: "My Uploads",
  },
  "nav.about": {
    ar: "حول المنصة",
    fr: "À propos",
    en: "About",
  },
  "nav.admin": {
    ar: "لوحة الإدارة",
    fr: "Administration",
    en: "Admin",
  },
  "nav.language": {
    ar: "اللغة",
    fr: "Langue",
    en: "Language",
  },

  // Hero Section
  "hero.pill": {
    ar: "جامعة محمد الأول • قطب التعليم العالي بالناظور",
    fr: "Université Mohammed Premier • Campus Universitaire de Nador",
    en: "Mohammed Premier University • Nador Campus",
  },
  "hero.title_prefix": {
    ar: "مكتبتك الجامعية",
    fr: "Votre Bibliothèque",
    en: "Your Digital",
  },
  "hero.title_highlight": {
    ar: "الرقمية المفتوحة",
    fr: "Universitaire Numérique",
    en: "University Library",
  },
  "hero.subtitle": {
    ar: "منصة أكاديمية آمنة ومجانية لتقاسم المحاضرات، والامتحانات السابقة، والملخصات لطلبة كليات التعليم العالي بالناظور.",
    fr: "Accédez aux cours vérifiés, examens et résumés pour l'ensemble des facultés de Nador. Gratuit et collaboratif.",
    en: "Access verified lecture notes, past exams, and summaries for all faculties in Nador. Free, open, and moderated.",
  },
  "hero.search_placeholder": {
    ar: "ابحث عن درس، امتحان، أو ملخص...",
    fr: "Rechercher un cours, examen, résumé...",
    en: "Search for a course, exam, summary...",
  },
  "hero.search_btn": {
    ar: "بحث",
    fr: "Rechercher",
    en: "Search",
  },
  "hero.browse_all": {
    ar: "استعراض كافة الوثائق",
    fr: "Explorer les documents",
    en: "Browse All Documents",
  },
  "hero.upload_cta": {
    ar: "مشاركة وثيقة",
    fr: "Déposer un document",
    en: "Upload Document",
  },
  "hero.official_portals": {
    ar: "البوابات الرسمية",
    fr: "Portails Officiels",
    en: "Official Portals",
  },
  "hero.stats_docs": {
    ar: "وثيقة معتمدة",
    fr: "Documents",
    en: "Documents",
  },
  "hero.stats_faculties": {
    ar: "مؤسسات جامعية",
    fr: "Établissements",
    en: "Institutions",
  },
  "hero.stats_verified": {
    ar: "تدقيق واعتماد 100%",
    fr: "100% Modéré",
    en: "100% Verified",
  },
  "hero.stats_free": {
    ar: "مجاني ومفتوح",
    fr: "Accès Libre",
    en: "Open Access",
  },
  "hero.browse_faculties_title": {
    ar: "تصفح حسب المؤسسة الجامعية",
    fr: "Explorer par Établissement Universitaire",
    en: "Browse by Academic Institution",
  },
  "hero.browse_faculties_desc": {
    ar: "استكشف كليات الناظور وروابط منصاتها الرسمية",
    fr: "Découvrez les 4 facultés de Nador et accédez directement à leurs portails",
    en: "Explore Nador's 4 faculties and access their official platforms",
  },
  "hero.view_full_dir": {
    ar: "عرض الدليل الكامل للمؤسسات",
    fr: "Voir l'annuaire complet",
    en: "View Full Directory",
  },

  // Document Filters & Browsing
  "filter.title": {
    ar: "تصفية الوثائق",
    fr: "Filtres de recherche",
    en: "Filter Documents",
  },
  "filter.search_label": {
    ar: "البحث بالعنوان أو الكلمات المفتاحية",
    fr: "Recherche par titre",
    en: "Search by title",
  },
  "filter.faculty": {
    ar: "المؤسسة / الكلية",
    fr: "Établissement / Faculté",
    en: "Faculty / Institution",
  },
  "filter.filiere": {
    ar: "الشعبة / المسلك",
    fr: "Filière / Spécialité",
    en: "Filiere / Major",
  },
  "filter.semester": {
    ar: "السداسي (الفصل)",
    fr: "Semestre",
    en: "Semester",
  },
  "filter.module": {
    ar: "المادة / الوحدة",
    fr: "Module / Matière",
    en: "Module / Course",
  },
  "filter.type": {
    ar: "نوع الوثيقة",
    fr: "Type de document",
    en: "Document Type",
  },
  "filter.all_faculties": {
    ar: "جميع المؤسسات والكليات",
    fr: "Toutes les facultés",
    en: "All Faculties",
  },
  "filter.all_filieres": {
    ar: "جميع الشعب والمسالك",
    fr: "Toutes les filières",
    en: "All Filieres",
  },
  "filter.all_semesters": {
    ar: "جميع السداسيات",
    fr: "Tous les semestres",
    en: "All Semesters",
  },
  "filter.all_modules": {
    ar: "جميع المواد",
    fr: "Tous les modules",
    en: "All Modules",
  },
  "filter.all_types": {
    ar: "جميع الأنواع",
    fr: "Tous les types",
    en: "All Types",
  },
  "filter.reset": {
    ar: "إعادة ضبط الفلاتر",
    fr: "Réinitialiser les filtres",
    en: "Clear All Filters",
  },
  "filter.found_prefix": {
    ar: "تم العثور على",
    fr: "Résultats :",
    en: "Found",
  },
  "filter.found_suffix": {
    ar: "وثيقة معتمدة",
    fr: "document(s)",
    en: "document(s)",
  },

  // Document Types
  "type.course": {
    ar: "دروس ومحاضرات",
    fr: "Cours / Notes",
    en: "Course / Notes",
  },
  "type.exam": {
    ar: "امتحانات سابقة",
    fr: "Examen / Past Paper",
    en: "Exam / Past Paper",
  },
  "type.td_tp": {
    ar: "أعمال تطبيقية وتوجيهية",
    fr: "TD / TP / Travaux",
    en: "TD / TP / Labs",
  },
  "type.summary": {
    ar: "ملخصات شاملة",
    fr: "Résumé / Fiche",
    en: "Summary / Cheatsheet",
  },

  // Document Card & Preview Modal
  "card.quick_preview": {
    ar: "معاينة سريعة",
    fr: "Aperçu rapide",
    en: "Quick Preview",
  },
  "card.details": {
    ar: "التفاصيل",
    fr: "Détails",
    en: "Details",
  },
  "card.author_prefix": {
    ar: "بواسطة:",
    fr: "Par :",
    en: "By:",
  },
  "card.default_author": {
    ar: "طالب",
    fr: "Étudiant",
    en: "Student",
  },
  "card.download": {
    ar: "تحميل الوثيقة",
    fr: "Télécharger",
    en: "Download",
  },
  "card.fullscreen": {
    ar: "شاشة كاملة",
    fr: "Plein écran",
    en: "Fullscreen",
  },
  "card.close": {
    ar: "إغلاق",
    fr: "Fermer",
    en: "Close",
  },
  "card.direct_link": {
    ar: "فتح الرابط المباشر",
    fr: "Ouvrir le fichier original",
    en: "Open Direct File",
  },
  "card.likes": {
    ar: "إعجاب",
    fr: "J'aime",
    en: "Likes",
  },

  // My Uploads Section
  "myuploads.title": {
    ar: "وثائقي المرفوعة (حالة المراجعة والاعتماد)",
    fr: "Mes Documents Déposés (Suivi de Validation)",
    en: "My Uploaded Documents (Status Tracker)",
  },
  "myuploads.subtitle": {
    ar: "تظهر هنا الوثائق التي قمت برفعها حتى تتمكن من متابعتها ومراجعتها مباشرة قبل أو بعد اعتمادها من الإدارة.",
    fr: "Consultez ici les documents que vous avez soumis pour suivre leur état de validation en temps réel.",
    en: "View your uploaded documents here to track their moderation status in real-time.",
  },
  "myuploads.pending": {
    ar: "قيد المراجعة - سيظهر للعامة بعد تدقيق الإدارة",
    fr: "En attente de validation par l'administration",
    en: "Pending moderation - will be public upon approval",
  },
  "myuploads.approved": {
    ar: "تمت الموافقة - منشور ومتاح للجميع",
    fr: "Approuvé - Visible sur la plateforme",
    en: "Approved - Publicly available",
  },

  // Upload Form
  "upload.page_title": {
    ar: "رفع ومشاركة مستند أكاديمي",
    fr: "Téléverser un Document Académique",
    en: "Upload Academic Document",
  },
  "upload.page_subtitle": {
    ar: "شارك المحاضرات والامتحانات والملخصات لمساعدة زملائك في مختلف كليات الناظور.",
    fr: "Partagez cours, examens ou résumés pour aider vos collègues des facultés de Nador.",
    en: "Share notes, exams, or summaries across faculties in Nador.",
  },
  "upload.step1": {
    ar: "1. التوجيه والمسار الأكاديمي",
    fr: "1. Arborescence Académique",
    en: "1. Academic Classification",
  },
  "upload.faculty_label": {
    ar: "المؤسسة / الكلية",
    fr: "Établissement / Faculté",
    en: "Faculty / Institution",
  },
  "upload.filiere_label": {
    ar: "الشعبة أو المسلك",
    fr: "Filière / Spécialité",
    en: "Filiere / Track",
  },
  "upload.semester_label": {
    ar: "السداسي (الفصل)",
    fr: "Semestre",
    en: "Semester",
  },
  "upload.module_label": {
    ar: "المادة / الوحدة",
    fr: "Module / Matière",
    en: "Module / Course",
  },
  "upload.step2": {
    ar: "2. تفاصيل الوثيقة",
    fr: "2. Informations du Document",
    en: "2. Document Details",
  },
  "upload.title_label": {
    ar: "عنوان الوثيقة (واضح ومفصل)",
    fr: "Titre du document",
    en: "Document Title",
  },
  "upload.title_placeholder": {
    ar: "مثال: امتحان مادة الرياضيات الدورة العادية 2024",
    fr: "Ex: Examen Microéconomie Session Normale 2024",
    en: "e.g., Final Exam Applied Mathematics 2024",
  },
  "upload.type_label": {
    ar: "نوع الوثيقة",
    fr: "Type de document",
    en: "Document Type",
  },
  "upload.step3": {
    ar: "3. بيانات الناشر والنزاهة الأكاديمية",
    fr: "3. Attribution & Confidentialité",
    en: "3. Author Attribution & Privacy",
  },
  "upload.realname_label": {
    ar: "الاسم الحقيقي الكامل (سري - للإدارة فقط)",
    fr: "Nom complet réel (Confidentiel - Administration uniquement)",
    en: "Full Real Name (Confidential - Admins only)",
  },
  "upload.realname_help": {
    ar: "🔒 إلزامي لأسباب أمنية ومكافحة الانتحال. لن يظهر هذا الاسم في البحث أو بطاقات المستندات العامة إطلاقاً.",
    fr: "🔒 Requis pour garantir l'authenticité et la traçabilité. Ce nom ne sera jamais affiché publiquement.",
    en: "🔒 Required for academic integrity and moderation. Will NEVER be displayed publicly.",
  },
  "upload.pseudonym_label": {
    ar: "الاسم المستعار (اختياري - سيظهر للعامة)",
    fr: "Pseudonyme public (Optionnel - Affiché aux étudiants)",
    en: "Public Pseudonym (Optional - Displayed to users)",
  },
  "upload.pseudonym_placeholder": {
    ar: "مثلاً: طالب، باحث، أو اسمك المستعار المفضل",
    fr: "Ex: Étudiant S3, Anonyme, ou votre pseudo",
    en: "e.g., Student, S2 Scholar, or preferred nickname",
  },
  "upload.pseudonym_help": {
    ar: "إذا تركته فارغاً، سيظهر المستند باسم 'طالب'.",
    fr: "Si laissé vide, le document sera signé comme 'Étudiant'.",
    en: "If left blank, the document will be attributed to 'Student'.",
  },
  "upload.step4": {
    ar: "4. ملف الوثيقة",
    fr: "4. Fichier du Document",
    en: "4. Document File",
  },
  "upload.drop_title": {
    ar: "انقر لاختيار الملف أو اسحبه وأفلته هنا",
    fr: "Cliquez pour choisir un fichier ou glissez-le ici",
    en: "Click to upload or drag and drop",
  },
  "upload.drop_formats": {
    ar: "ملفات PDF، أو صور عالية الدقة (JPG, PNG, WEBP) بحد أقصى 25MB",
    fr: "PDF, PNG, JPG ou WEBP (Max 25 Mo)",
    en: "PDF, PNG, JPG, or WEBP (Max 25MB)",
  },
  "upload.submit_btn": {
    ar: "رفع المستند الآن",
    fr: "Téléverser le document",
    en: "Upload Document",
  },
  "upload.submitting": {
    ar: "جاري التحقق والرفع بأمان...",
    fr: "Téléversement et vérification...",
    en: "Uploading and verifying...",
  },

  // About Page
  "about.badge": {
    ar: "مبادرة معرفية مفتوحة • إقليم الناظور",
    fr: "Initiative Académique Ouverte • Province de Nador",
    en: "Open Academic Initiative • Nador Province",
  },
  "about.title": {
    ar: "حول منصة ApoDocs الناظور",
    fr: "À propos de la plateforme ApoDocs Nador",
    en: "About ApoDocs Nador Academic Platform",
  },
  "about.lead": {
    ar: "ApoDocs هي المنصة الأكاديمية المخصصة لخدمة طلبة كليات الناظور (جامعة محمد الأول)، بهدف تيسير الوصول إلى المذكرات، والامتحانات السابقة، والمصادر التعليمية المعتمدة في بيئة آمنة ومنظمة.",
    fr: "ApoDocs est la première plateforme académique collaborative dédiée aux étudiants des 4 facultés de Nador (Université Mohammed Premier), facilitant l'accès aux cours, examens et résumés dans un environnement sécurisé et modéré.",
    en: "ApoDocs is the premier collaborative academic platform serving students of Nador's 4 faculties (Mohammed Premier University), streamlining access to lecture notes, exams, and verified study materials in a secure, moderated environment.",
  },
};
