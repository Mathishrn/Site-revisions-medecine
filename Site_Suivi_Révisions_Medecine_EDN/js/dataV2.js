// js/data.js
// data.js
// Liste complète des chapitres ECN + matières associées

const CHAPITRES = [
  {
    id: 1,
    titre: "La relation médecin-malade. La communication avec le patient et son entourage. L’annonce d’une maladie grave ou létale ou d’un dommage associé aux soins. La formation du patient. La personnalisation de la prise en charge médicale.",
    matieres: ["Médecine Interne", "Psychiatrie - Addictologie"],
  },
  {
    id: 2,
    titre: "Les valeurs professionnelles du médecin et des autres professions de santé",
    matieres: ["Médecine Interne"],
  },
  {
    id: 3,
    titre: "Le raisonnement et la décision en médecine. La médecine fondée sur les preuves (Evidence Based Medicine, EBM). La décision médicale partagée. La controverse.",
    matieres: ["Médecine Interne", "Santé Publique"],
  },
  {
    id: 4,
    titre: "Qualité et sécurité des soins. La sécurité du patient. La gestion des risques. Les événements indésirables associés aux soins. Démarche qualité et évaluation des pratiques professionnelles.",
    matieres: ["Anesthésie - Réanimation", "Infectiologie", "MIR - Urgences", "Santé Publique"],
  },
  {
    id: 5,
    titre: "La gestion des erreurs et des plaintes ; l’aléa thérapeutique",
    matieres: ["MIR - Urgences", "Médecine Légal - Médecine du Travail", "Santé Publique"],
  },
  {
    id: 6,
    titre: "L’organisation de l’exercice clinique et les méthodes qui permettent de sécuriser le parcours du patient",
    matieres: ["Santé Publique"],
  },
  {
    id: 7,
    titre: "Les droits individuels et collectifs du patient",
    matieres: ["Médecine Légal - Médecine du Travail"],
  },
  {
    id: 8,
    titre: "Les discriminations",
    matieres: ["Médecine Générale", "Santé Publique"],
  },
  {
    id: 9,
    titre: "Éthique médicale",
    matieres: [
      "Anesthésie - Réanimation",
      "Gériatrie",
      "Gynécologie Obstétrique",
      "MPR",
      "Médecine Générale",
      "Médecine Légal - Médecine du Travail",
    ],
  },
  {
    id: 10,
    titre: "Approches transversales du corps",
    matieres: [],
    nonClasseCaptures: true,
  },
  {
    id: 11,
    titre: "Violences et santé",
    matieres: ["Médecine Générale", "Médecine Légal - Médecine du Travail"],
  },
  {
    id: 12,
    titre: "Violences sexuelles",
    matieres: ["Gynécologie Médicale", "Gynécologie Obstétrique", "Médecine Légal - Médecine du Travail"],
  },
  {
    id: 13,
    titre: "Certificats médicaux. Décès et législation. Prélèvements d’organes et législation",
    matieres: ["Médecine Légal - Médecine du Travail", "Pédiatrie"],
  },
  {
    id: 14,
    titre: "La mort",
    matieres: ["Médecine Légal - Médecine du Travail"],
  },
  {
    id: 15,
    titre: "Soins psychiatriques sans consentement",
    matieres: ["Psychiatrie - Addictologie"],
  },
  {
    id: 16,
    titre: "Organisation du système de soins. Sa régulation. Les indicateurs. Parcours de soins.",
    matieres: ["Santé Publique"],
  },
  {
    id: 17,
    titre: "Télémédecine, télésanté et téléservices en santé",
    matieres: ["Santé Publique"],
  },
  {
    id: 18,
    titre: "Santé et numérique",
    matieres: ["Santé Publique"],
  },
  {
    id: 19,
    titre: "La sécurité sociale. L’assurance maladie. Les assurances complémentaires. La complémentaire santé solidaire (CSS). La consommation médicale. Protection sociale. Consommation médicale et économie de la santé.",
    matieres: ["Santé Publique"],
  },
  {
    id: 20,
    titre: "La méthodologie de la recherche en santé",
    matieres: ["Santé Publique"],
  },
  {
    id: 21,
    titre: "Mesure de l’état de santé de la population",
    matieres: ["MPR", "Santé Publique"],
  },
  {
    id: 22,
    titre: "Maladies rares",
    matieres: ["Génétique", "Médecine Interne"],
  },
  {
    id: 23,
    titre: "Grossesse normale",
    matieres: ["Gynécologie Obstétrique", "Médecine Générale", "Néphrologie"],
  },
  {
    id: 24,
    titre: "Principales complications de la grossesse",
    matieres: ["Gynécologie Médicale", "Gynécologie Obstétrique", "Néphrologie"],
  },
  {
    id: 25,
    titre: "Grossesse extra-utérine",
    matieres: ["Gynécologie Médicale", "Gynécologie Obstétrique"],
  },
  {
    id: 26,
    titre: "Douleur abdominale aiguë chez une femme enceinte",
    matieres: ["Gynécologie Obstétrique"],
  },
  {
    id: 27,
    titre: "Prévention des risques fœtaux : infection, médicaments, toxiques, irradiation",
    matieres: ["Gynécologie Obstétrique", "Infectiologie", "Médecine Générale", "Pédiatrie"],
  },
  {
    id: 28,
    titre: "Infection urinaire au cours de la grossesse",
    matieres: ["Gynécologie Obstétrique", "Infectiologie"],
  },
  {
    id: 29,
    titre: "Risques professionnels pour la maternité, liés au travail de la mère",
    matieres: ["Gynécologie Obstétrique", "Médecine Légal - Médecine du Travail"],
  },
  {
    id: 30,
    titre: "Prématurité et retard de croissance intra-utérin : facteurs de risque et prévention",
    matieres: ["Gynécologie Obstétrique", "Pédiatrie"],
  },
  {
    id: 31,
    titre: "Accouchement, délivrance et suites de couches normales",
    matieres: ["Gynécologie Obstétrique"],
  },
  {
    id: 32,
    titre: "Évaluation et soins du nouveau-né à terme",
    matieres: ["Pédiatrie"],
  },
  {
    id: 33,
    titre: "Allaitement maternel",
    matieres: ["Gynécologie Obstétrique", "Médecine Générale", "Nutrition", "Pédiatrie"],
  },
  {
    id: 34,
    titre: "Suites de couches pathologiques : pathologie maternelle dans les 40 jours",
    matieres: ["Gynécologie Obstétrique"],
  },
  {
    id: 35,
    titre: "Anomalies du cycle menstruel. Métrorragies",
    matieres: ["Gynécologie Médicale", "Gynécologie Obstétrique"],
  },
  {
    id: 36,
    titre: "Contraception",
    matieres: ["Endocrinologie", "Gynécologie Médicale", "Gynécologie Obstétrique", "Médecine Générale", "Thérapeutique", "Urologie"],
  },
  {
    id: 37,
    titre: "Interruption volontaire de grossesse",
    matieres: ["Gynécologie Médicale", "Gynécologie Obstétrique", "Médecine Générale"],
  },
  {
    id: 38,
    titre: "Infertilité du couple : conduite de la première consultation",
    matieres: ["Endocrinologie", "Gynécologie Médicale", "Gynécologie Obstétrique", "Urologie"],
  },
  {
    id: 39,
    titre: "Assistance médicale à la procréation : principaux aspects biologiques, médicaux et éthiques",
    matieres: ["Gynécologie Médicale", "Gynécologie Obstétrique"],
  },
  {
    id: 40,
    titre: "Algies pelviennes chez la femme",
    matieres: ["Gynécologie Médicale", "Gynécologie Obstétrique", "Urologie"],
  },
  {
    id: 41,
    titre: "Endométriose",
    matieres: ["Gynécologie Médicale", "Gynécologie Obstétrique"],
  },
  {
    id: 42,
    titre: "Aménorrhée",
    matieres: ["Endocrinologie", "Gynécologie Médicale", "Gynécologie Obstétrique"],
  },
  {
    id: 43,
    titre: "Hémorragie génitale chez la femme",
    matieres: ["Gynécologie Médicale", "Gynécologie Obstétrique"],
  },
  {
    id: 44,
    titre: "Tuméfaction pelvienne chez la femme",
    matieres: ["Chirurgie Digestive", "Gynécologie Médicale", "Gynécologie Obstétrique", "Urologie"],
  },
  {
    id: 45,
    titre: "Spécificités des maladies génétiques",
    matieres: ["Génétique", "Pédiatrie"],
  },
  {
    id: 46,
    titre: "Médecine génomique",
    matieres: ["Génétique"],
  },
  {
    id: 47,
    titre: "Suivi d’un nourrisson, d’un enfant et d’un adolescent normal...",
    matieres: ["CMF", "Médecine Générale", "ORL", "Ophtalmologie", "Orthopédie - Traumatologie", "Pédiatrie"],
  },
  {
    id: 48,
    titre: "Alimentation et besoins nutritionnels du nourrisson et de l’enfant",
    matieres: ["Pédiatrie"],
  },
  {
    id: 49,
    titre: "Puberté normale et pathologique",
    matieres: ["Gynécologie Médicale", "Gynécologie Obstétrique", "Médecine Générale", "Pédiatrie"],
  },
  {
    id: 50,
    titre: "Pathologie génito-scrotale chez le garçon et chez l’homme",
    matieres: ["Endocrinologie", "Pédiatrie", "Urologie"],
  },
  {
    id: 51,
    titre: "Troubles de la miction chez l’enfant",
    matieres: ["Pédiatrie"],
  },
  {
    id: 52,
    titre: "Strabisme et amblyopie de l’enfant",
    matieres: ["Ophtalmologie", "Pédiatrie"],
  },
  {
    id: 53,
    titre: "Retard de croissance staturo-pondérale",
    matieres: ["Pédiatrie"],
  },
  {
    id: 54,
    titre: "Boiterie chez l’enfant",
    matieres: ["Orthopédie - Traumatologie", "Pédiatrie", "Rhumatologie"],
  },
  {
    id: 55,
    titre: "Développement psychomoteur du nourrisson et de l’enfant",
    matieres: ["Médecine Générale", "Pédiatrie", "Psychiatrie - Addictologie"],
  },
  {
    id: 56,
    titre: "L’enfant handicapé : orientation et prise en charge",
    matieres: ["MPR", "ORL", "Pédiatrie"],
  },
  {
    id: 57,
    titre: "Maltraitance et enfants en danger. Protection maternelle et infantile",
    matieres: ["Médecine Légal - Médecine du Travail", "Pédiatrie"],
  },
  {
    id: 58,
    titre: "Sexualité normale et ses troubles",
    matieres: ["Gynécologie Médicale", "Gynécologie Obstétrique", "Psychiatrie - Addictologie", "Urologie"],
  },
  {
    id: 59,
    titre: "Sujets en situation de précarité",
    matieres: ["Médecine Interne", "Pédiatrie", "Psychiatrie - Addictologie", "Santé Publique"],
  },
  {
    id: 60,
    titre: "Connaître les facteurs de risque, prévention, dépistage des troubles psychiques...",
    matieres: ["Psychiatrie - Addictologie"],
  },
  {
    id: 61,
    titre: "Connaître les bases des classifications des troubles mentaux...",
    matieres: ["Psychiatrie - Addictologie"],
  },
  {
    id: 62,
    titre: "Décrire l’organisation de l’offre de soins en psychiatrie...",
    matieres: ["Psychiatrie - Addictologie"],
  },
  {
    id: 63,
    titre: "Trouble schizophrénique",
    matieres: ["Psychiatrie - Addictologie"],
  },
  {
    id: 64,
    titre: "Trouble bipolaire",
    matieres: ["Psychiatrie - Addictologie"],
  },
  {
    id: 65,
    titre: "Trouble délirant persistant",
    matieres: ["Psychiatrie - Addictologie"],
  },
  {
    id: 66,
    titre: "Diagnostiquer : un trouble dépressif, un trouble anxieux généralisé...",
    matieres: ["Médecine Générale", "Psychiatrie - Addictologie"],
  },
  {
    id: 67,
    titre: "Troubles envahissants du développement",
    matieres: ["Psychiatrie - Addictologie"],
  },
  {
    id: 68,
    titre: "Troubles du comportement de l’adolescent",
    matieres: ["Psychiatrie - Addictologie"],
  },
  {
    id: 69,
    titre: "Troubles psychiques de la grossesse et du post-partum",
    matieres: ["Gynécologie Obstétrique", "Psychiatrie - Addictologie"],
  },
  {
    id: 70,
    titre: "Troubles psychiques du sujet âgé",
    matieres: ["Gériatrie", "Psychiatrie - Addictologie"],
  },
  {
    id: 71,
    titre: "Troubles des conduites alimentaires chez l’adolescent et l’adulte",
    matieres: ["Nutrition", "Pédiatrie", "Psychiatrie - Addictologie"],
  },
  {
    id: 72,
    titre: "Troubles à symptomatologie somatique et apparentés à tous les âges",
    matieres: ["Douleurs - Soins Palliatifs", "Médecine Générale", "Médecine Interne", "Psychiatrie - Addictologie"],
  },
  {
    id: 73,
    titre: "Différents types de techniques psychothérapeutiques",
    matieres: ["Psychiatrie - Addictologie"],
  },
  {
    id: 74,
    titre: "Prescription et surveillance des psychotropes",
    matieres: ["Gériatrie", "Médecine Générale", "Psychiatrie - Addictologie", "Thérapeutique"],
  },
  {
    id: 75,
    titre: "Addiction au tabac",
    matieres: ["Médecine Générale", "Médecine Vasculaire", "Pneumologie", "Psychiatrie - Addictologie", "Santé Publique"],
  },
  {
    id: 76,
    titre: "Addiction à l'alcool",
    matieres: ["Médecine Générale", "Neurologie", "Psychiatrie - Addictologie", "Santé Publique"],
  },
  {
    id: 77,
    titre: "Addiction aux médicaments psychotropes (benzodiazépines et apparentés)",
    matieres: ["Psychiatrie - Addictologie", "Santé Publique"],
  },
  {
    id: 78,
    titre: "Addiction au cannabis, à la cocaïne, aux amphétamines, aux opiacés, aux drogues de synthèse",
    matieres: ["Psychiatrie - Addictologie", "Santé Publique"],
  },
  {
    id: 79,
    titre: "Addictions comportementales",
    matieres: ["Médecine Générale", "Psychiatrie - Addictologie", "Santé Publique"],
  },
  {
    id: 80,
    titre: "Dopage et conduites dopantes",
    matieres: ["Médecine Générale", "Psychiatrie - Addictologie"],
  },
  {
    id: 81,
    titre: "Altération chronique de la vision",
    matieres: ["Gériatrie", "Ophtalmologie"],
  },
  {
    id: 82,
    titre: "Altération aiguë de la vision",
    matieres: ["Neurologie", "Ophtalmologie"],
  },
  {
    id: 83,
    titre: "Infections et inflammations oculaires",
    matieres: ["Ophtalmologie"],
  },
  {
    id: 84,
    titre: "Glaucomes",
    matieres: ["Ophtalmologie"],
  },
  {
    id: 85,
    titre: "Troubles de la réfraction",
    matieres: ["Ophtalmologie"],
  },
  {
    id: 86,
    titre: "Pathologie des paupières",
    matieres: ["Ophtalmologie"],
  },
  {
    id: 87,
    titre: "Epistaxis",
    matieres: ["ORL"],
  },
  {
    id: 88,
    titre: "Trouble aigu de la parole. Dysphonie",
    matieres: ["Neurologie", "ORL"],
  },
  {
    id: 89,
    titre: "Altération de la fonction auditive",
    matieres: ["Gériatrie", "ORL", "Pédiatrie"],
  },
  {
    id: 90,
    titre: "Pathologie des glandes salivaires",
    matieres: ["Anatomie-Cytologie Pathologiques", "CMF", "ORL"],
  },
  {
    id: 91,
    titre: "Déficit neurologique récent",
    matieres: ["Neurologie"],
  },
  {
    id: 92,
    titre: "Déficit moteur et/ou sensitif des membres",
    matieres: ["Neurologie"],
  },
  {
    id: 93,
    titre: "Compression médullaire non traumatique et syndrome de la queue de cheval",
    matieres: ["MPR", "Neurochirurgie", "Neurologie", "Orthopédie - Traumatologie", "Rhumatologie"],
  },
  {
    id: 94,
    titre: "Rachialgie",
    matieres: ["Douleurs - Soins Palliatifs", "MPR", "Médecine Générale", "Orthopédie - Traumatologie", "Rhumatologie"],
  },
  {
    id: 95,
    titre: "Radiculalgie et syndrome canalaire",
    matieres: ["Douleurs - Soins Palliatifs", "Neurochirurgie", "Neurologie", "Orthopédie - Traumatologie", "Rhumatologie"],
  },
  {
    id: 96,
    titre: "Neuropathies périphériques",
    matieres: ["Neurologie"],
  },
  {
    id: 97,
    titre: "Polyradiculonévrite aiguë inflammatoire (syndrome de Guillain-Barré)",
    matieres: ["MIR - Urgences", "Neurologie"],
  },
  {
    id: 98,
    titre: "Myasthénie",
    matieres: ["MIR - Urgences", "Neurologie"],
  },
  {
    id: 99,
    titre: "Migraine, névralgie du trijumeau et algies de la face",
    matieres: ["CMF", "Douleurs - Soins Palliatifs", "Médecine Générale", "Neurochirurgie", "Neurologie", "ORL"],
  },
  {
    id: 100,
    titre: "Céphalée inhabituelle aiguë et chronique chez l’adulte et l’enfant",
    matieres: ["Douleurs - Soins Palliatifs", "Neurologie", "Pédiatrie"],
  },
  {
    id: 101,
    titre: "Paralysie faciale",
    matieres: ["CMF", "Neurologie", "ORL"],
  },
  {
    id: 102,
    titre: "Diplopie",
    matieres: ["Neurologie", "Ophtalmologie"],
  },
  {
    id: 103,
    titre: "Vertige",
    matieres: ["Neurologie", "ORL"],
  },
  {
    id: 104,
    titre: "Sclérose en plaques",
    matieres: ["MPR", "Neurologie", "Ophtalmologie"],
  },
  {
    id: 105,
    titre: "Épilepsie de l’enfant et de l’adulte",
    matieres: ["MIR - Urgences", "Neurologie", "Pédiatrie"],
  },
  {
    id: 106,
    titre: "Maladie de Parkinson",
    matieres: ["MPR", "Neurologie"],
  },
  {
    id: 107,
    titre: "Mouvements anormaux",
    matieres: ["Neurologie"],
  },
  {
    id: 108,
    titre: "Confusion, démences",
    matieres: ["Gériatrie", "MIR - Urgences", "Neurologie"],
  },
  {
    id: 109,
    titre: "Troubles de la marche et de l’équilibre",
    matieres: ["Gériatrie", "MPR", "Médecine Générale", "Neurologie", "ORL", "Rhumatologie"],
  },
  {
    id: 110,
    titre: "Troubles du sommeil de l’enfant et de l’adulte",
    matieres: ["Médecine Générale", "Neurologie", "ORL", "Pédiatrie", "Pneumologie", "Psychiatrie - Addictologie"],
  },
  {
    id: 111,
    titre: "Dermatoses faciales : acné, rosacée, dermatite séborrhéique",
    matieres: ["Dermatologie"],
  },
  {
    id: 112,
    titre: "Dermatose bulleuse touchant la peau et/ou les muqueuses externes",
    matieres: ["Anatomie-Cytologie Pathologiques", "Dermatologie"],
  },
  {
    id: 113,
    titre: "Hémangiomes et malformations vasculaires cutanées",
    matieres: ["CMF", "Dermatologie", "Médecine Vasculaire"],
  },
  {
    id: 114,
    titre: "Exanthème et érythrodermie de l’adulte et de l’enfant",
    matieres: ["Dermatologie"],
  },
  {
    id: 115,
    titre: "Toxidermies",
    matieres: ["Dermatologie"],
  },
  {
    id: 116,
    titre: "Prurit",
    matieres: ["Dermatologie"],
  },
  {
    id: 117,
    titre: "Psoriasis",
    matieres: ["Dermatologie", "Rhumatologie"],
  },
  {
    id: 118,
    titre: "La personne handicapée : bases de l’évaluation fonctionnelle et thérapeutique",
    matieres: ["MPR", "Neurologie", "ORL"],
  },
  {
    id: 119,
    titre: "Soin et accompagnement dans la maladie chronique et le handicap",
    matieres: ["Médecine Générale"],
  },
  {
    id: 120,
    titre: "Complications de l’immobilité et du décubitus. Prévention et prise en charge",
    matieres: ["Gériatrie", "MPR"],
  },
  {
    id: 121,
    titre: "Le handicap psychique",
    matieres: ["Psychiatrie - Addictologie"],
  },
  {
    id: 122,
    titre: "Principales techniques de rééducation et de réadaptation",
    matieres: ["MPR", "ORL"],
  },
  {
    id: 123,
    titre: "Vieillissement normal : aspects biologiques, fonctionnels et relationnels...",
    matieres: ["Gériatrie", "Médecine Générale"],
  },
  {
    id: 124,
    titre: "Ménopause, insuffisance ovarienne prématurée, andropause...",
    matieres: ["Endocrinologie", "Gynécologie Médicale", "Gynécologie Obstétrique", "Thérapeutique", "Urologie"],
  },
  {
    id: 125,
    titre: "Troubles de la miction et incontinence urinaire de l’adulte et du sujet âgé",
    matieres: ["Gériatrie", "Gynécologie Médicale", "MPR", "Urologie"],
  },
  {
    id: 126,
    titre: "Trouble de l’érection",
    matieres: ["Endocrinologie", "Urologie"],
  },
  {
    id: 127,
    titre: "Hypertrophie bénigne de la prostate",
    matieres: ["Urologie"],
  },
  {
    id: 128,
    titre: "Ostéopathies fragilisantes",
    matieres: ["Endocrinologie", "Gériatrie", "Rhumatologie"],
  },
  {
    id: 129,
    titre: "Arthrose",
    matieres: ["Gériatrie", "MPR", "Rhumatologie"],
  },
  {
    id: 130,
    titre: "La personne âgée malade : particularités sémiologiques...",
    matieres: ["Gériatrie"],
  },
  {
    id: 131,
    titre: "Troubles de la marche et de l’équilibre",
    matieres: ["Gériatrie", "Neurologie", "Rhumatologie"],
  },
  {
    id: 132,
    titre: "Troubles cognitifs du sujet âgé",
    matieres: ["Gériatrie", "Médecine Générale", "Neurologie"],
  },
  {
    id: 133,
    titre: "Autonomie et dépendance chez le sujet âgé",
    matieres: ["Gériatrie", "Médecine Générale"],
  },
  {
    id: 134,
    titre: "Bases neurophysiologiques, mécanismes physiopathologiques d’une douleur...",
    matieres: ["Anesthésie - Réanimation", "Douleurs - Soins Palliatifs", "Gériatrie", "Neurochirurgie", "Neurologie", "Rhumatologie"],
  },
  {
    id: 135,
    titre: "Thérapeutiques antalgiques, médicamenteuses et non médicamenteuses",
    matieres: ["Anesthésie - Réanimation", "Douleurs - Soins Palliatifs", "MIR - Urgences", "Neurochirurgie", "Rhumatologie", "Thérapeutique"],
  },
  {
    id: 136,
    titre: "Anesthésie locale, locorégionale et générale",
    matieres: ["Anesthésie - Réanimation", "Douleurs - Soins Palliatifs"],
  },
  {
    id: 137,
    titre: "Douleur chez l’enfant : évaluation et traitements antalgiques",
    matieres: ["Douleurs - Soins Palliatifs", "Pédiatrie"],
  },
  {
    id: 138,
    titre: "Douleur chez la personne vulnérable",
    matieres: ["Douleurs - Soins Palliatifs", "Psychiatrie - Addictologie"],
  },
  {
    id: 139,
    titre: "Soins palliatifs pluridisciplinaires chez un malade en phase palliative... (1)",
    matieres: ["Douleurs - Soins Palliatifs", "Gériatrie", "Médecine Générale"],
  },
  {
    id: 140,
    titre: "Soins palliatifs pluridisciplinaires chez un malade en phase palliative... (2)",
    matieres: ["Douleurs - Soins Palliatifs", "Gériatrie"],
  },
  {
    id: 141,
    titre: "Soins palliatifs pluridisciplinaires chez un malade en phase palliative... (3)",
    matieres: ["Douleurs - Soins Palliatifs", "Gériatrie"],
  },
  {
    id: 142,
    titre: "Connaître les aspects spécifiques des soins palliatifs en pédiatrie",
    matieres: ["Douleurs - Soins Palliatifs", "Pédiatrie"],
  },
  {
    id: 143,
    titre: "Connaître les aspects spécifiques des soins palliatifs en réanimation",
    matieres: ["Anesthésie - Réanimation", "Douleurs - Soins Palliatifs", "MIR - Urgences"],
  },
  {
    id: 144,
    titre: "Deuil normal et pathologique",
    matieres: ["Médecine Générale", "Psychiatrie - Addictologie"],
  },
  {
    id: 145,
    titre: "Surveillance des maladies infectieuses transmissibles",
    matieres: ["Infectiologie", "Médecine Générale", "Santé Publique"],
  },
  {
    id: 146,
    titre: "Vaccinations",
    matieres: ["Infectiologie", "Médecine Générale", "Pédiatrie", "Santé Publique"],
  },
  {
    id: 147,
    titre: "Fièvre aiguë chez l'enfant et l'adulte",
    matieres: ["Infectiologie", "Médecine Générale", "Pédiatrie"],
  },
  {
    id: 148,
    titre: "Infections naso-sinusiennes de l'adulte et de l'enfant",
    matieres: ["Infectiologie", "Médecine Générale", "ORL", "Pédiatrie"],
  },
  {
    id: 149,
    titre: "Angines de l'adulte et de l'enfant et rhinopharyngites de l'enfant",
    matieres: ["Infectiologie", "Médecine Générale", "ORL", "Pédiatrie"],
  },
  {
    id: 150,
    titre: "Otites infectieuses de l'adulte et de l'enfant",
    matieres: ["Infectiologie", "Médecine Générale", "ORL", "Pédiatrie"],
  },
  {
    id: 151,
    titre: "Méningites, méningoencéphalites, abcès cérébral chez l'adulte et l'enfant",
    matieres: ["Infectiologie", "MIR - Urgences", "Neurologie", "Pédiatrie"],
  },
  {
    id: 152,
    titre: "Endocardite infectieuse",
    matieres: ["Infectiologie", "MIR - Urgences", "Médecine Cardiovasculaire", "Médecine Interne"],
  },
  {
    id: 153,
    titre: "Surveillance des porteurs de valve et prothèses vasculaires",
    matieres: ["Infectiologie", "Médecine Cardiovasculaire", "Médecine Vasculaire"],
  },
  {
    id: 154,
    titre: "Infections broncho pulmonaires communautaires de l'adulte et de l'enfant",
    matieres: ["Infectiologie", "Médecine Générale", "Pédiatrie", "Pneumologie"],
  },
  {
    id: 155,
    titre: "Infections cutanéo-muqueuses et des phanères...",
    matieres: ["Anesthésie - Réanimation", "CMF", "Dermatologie", "Infectiologie", "MIR - Urgences", "Pédiatrie"],
  },
  {
    id: 156,
    titre: "Infections ostéo articulaires (IOA) de l'enfant et de l'adulte",
    matieres: ["Infectiologie", "Orthopédie - Traumatologie", "Pédiatrie", "Rhumatologie"],
  },
  {
    id: 157,
    titre: "Septicémie/Bactériémie/Fongémie de l'adulte et de l'enfant",
    matieres: ["Anesthésie - Réanimation", "Infectiologie", "MIR - Urgences", "Pédiatrie"],
  },
  {
    id: 158,
    titre: "Sepsis et choc septique de l’enfant et de l’adulte",
    matieres: ["Anesthésie - Réanimation", "MIR - Urgences"],
  },
  {
    id: 159,
    titre: "Tuberculose de l'adulte et de l'enfant",
    matieres: ["Anatomie-Cytologie Pathologiques", "Infectiologie", "Pédiatrie", "Pneumologie"],
  },
  {
    id: 160,
    titre: "Tétanos",
    matieres: ["Infectiologie"],
  },
  {
    id: 161,
    titre: "Infections urinaires de l'enfant et de l'adulte",
    matieres: ["Infectiologie", "MIR - Urgences", "Médecine Générale", "Néphrologie", "Pédiatrie", "Urologie"],
  },
  {
    id: 162,
    titre: "Infections sexuellement transmissibles (IST)...",
    matieres: ["Dermatologie", "Gynécologie Médicale", "Gynécologie Obstétrique", "Infectiologie", "Médecine Générale"],
  },
  {
    id: 163,
    titre: "Coqueluche",
    matieres: ["Infectiologie", "Pédiatrie"],
  },
  {
    id: 164,
    titre: "Exanthèmes fébriles de l'enfant",
    matieres: ["Dermatologie", "Pédiatrie"],
  },
  {
    id: 165,
    titre: "Oreillons",
    matieres: ["Infectiologie"],
  },
  {
    id: 166,
    titre: "Grippe",
    matieres: ["Infectiologie", "Médecine Générale"],
  },
  {
    id: 167,
    titre: "Hépatites virales",
    matieres: ["Anatomie-Cytologie Pathologiques", "HGE", "Infectiologie", "MIR - Urgences"],
  },
  {
    id: 168,
    titre: "Infections à herpès virus du sujet immunocompétent",
    matieres: ["CMF", "Dermatologie", "Infectiologie", "Médecine Générale", "Neurologie", "Pédiatrie"],
  },
  {
    id: 169,
    titre: "Infections à VIH",
    matieres: ["Dermatologie", "Infectiologie", "Neurologie", "Pédiatrie"],
  },
  {
    id: 170,
    titre: "Paludisme",
    matieres: ["Infectiologie", "MIR - Urgences", "Pédiatrie"],
  },
  {
    id: 171,
    titre: "Gale et pédiculose",
    matieres: ["Dermatologie", "Infectiologie"],
  },
  {
    id: 172,
    titre: "Parasitoses digestives : giardiose, amoebose, téniasis...",
    matieres: ["Infectiologie"],
  },
  {
    id: 173,
    titre: "Zoonoses",
    matieres: ["Infectiologie"],
  },
  {
    id: 174,
    titre: "Pathologie infectieuse chez les migrants adultes et enfants",
    matieres: ["Infectiologie", "Pédiatrie"],
  },
  {
    id: 175,
    titre: "Voyage en pays tropical de l'adulte et de l'enfant...",
    matieres: ["Infectiologie", "Médecine Générale", "Pédiatrie"],
  },
  {
    id: 176,
    titre: "Diarrhées infectieuses de l'adulte et de l'enfant",
    matieres: ["Infectiologie", "Pédiatrie", "Santé Publique"],
  },
  {
    id: 177,
    titre: "Prescription et surveillance des anti-infectieux chez l'adulte et l'enfant",
    matieres: ["Infectiologie", "MIR - Urgences", "Médecine Générale", "Pédiatrie", "Thérapeutique"],
  },
  {
    id: 178,
    titre: "Risques émergents, bioterrorisme, maladies hautement transmissibles",
    matieres: ["Infectiologie"],
  },
  {
    id: 179,
    titre: "Risques sanitaires liés à l'eau et à l'alimentation. Toxi-infections alimentaires",
    matieres: ["Santé Publique"],
  },
  {
    id: 180,
    titre: "Risques sanitaires liés aux irradiations. Radioprotection",
    matieres: ["Médecine Légal - Médecine du Travail"],
  },
  {
    id: 181,
    titre: "La sécurité sanitaire des produits destinés à l'homme. La veille sanitaire",
    matieres: ["Santé Publique"],
  },
  {
    id: 182,
    titre: "Environnement professionnel et santé au travail",
    matieres: ["Médecine Légal - Médecine du Travail"],
  },
  {
    id: 183,
    titre: "Organisation de la médecine du travail. Prévention des risques professionnels",
    matieres: ["Médecine Légal - Médecine du Travail"],
  },
  {
    id: 184,
    titre: "Accidents du travail et maladies professionnelles : définitions et enjeux",
    matieres: ["Médecine Légal - Médecine du Travail"],
  },
  {
    id: 185,
    titre: "Réaction inflammatoire : aspects biologiques et cliniques. Conduite à tenir",
    matieres: ["Immunologie", "Médecine Interne", "Rhumatologie"],
  },
  {
    id: 186,
    titre: "Hypersensibilités et allergies chez l’enfant et l’adulte...",
    matieres: ["Immunologie", "Médecine Légal - Médecine du Travail", "Pédiatrie", "Pneumologie"],
  },
  {
    id: 187,
    titre: "Hypersensibilités et allergies cutanéomuqueuses chez l’enfant et l’adulte...",
    matieres: ["Dermatologie", "Immunologie", "Médecine Légal - Médecine du Travail", "Ophtalmologie"],
  },
  {
    id: 188,
    titre: "Hypersensibilité et allergies respiratoires chez l’enfant et chez l’adulte...",
    matieres: ["Immunologie", "MIR - Urgences", "Médecine Légal - Médecine du Travail", "Pédiatrie", "Pneumologie"],
  },
  {
    id: 189,
    titre: "Déficit immunitaire.",
    matieres: ["Immunologie", "Médecine Interne", "Pédiatrie"],
  },
  {
    id: 190,
    titre: "Fièvre prolongée.",
    matieres: ["Immunologie", "Infectiologie", "Médecine Interne"],
  },
  {
    id: 191,
    titre: "Fièvre chez un patient immunodéprimé.",
    matieres: ["Immunologie", "Infectiologie", "MIR - Urgences", "Médecine Interne"],
  },
  {
    id: 192,
    titre: "Pathologies auto-immunes : aspects épidémiologiques...",
    matieres: ["Immunologie", "Médecine Interne", "Rhumatologie"],
  },
  {
    id: 193,
    titre: "Connaître les principaux types de vascularite systémique...",
    matieres: ["Anatomie-Cytologie Pathologiques", "Immunologie", "Médecine Interne", "Néphrologie", "Rhumatologie"],
  },
  {
    id: 194,
    titre: "Lupus systémique. Syndrome des anti-phospholipides (SAPL).",
    matieres: ["Anatomie-Cytologie Pathologiques", "Dermatologie", "Immunologie", "Médecine Interne", "Médecine Vasculaire", "Néphrologie", "Rhumatologie"],
  },
  {
    id: 195,
    titre: "Artérite à cellules géantes.",
    matieres: ["Anatomie-Cytologie Pathologiques", "Immunologie", "Médecine Interne", "Médecine Vasculaire", "Rhumatologie"],
  },
  {
    id: 196,
    titre: "Polyarthrite rhumatoïde.",
    matieres: ["Immunologie", "MPR", "Rhumatologie"],
  },
  {
    id: 197,
    titre: "Spondyloarthrite.",
    matieres: ["Immunologie", "MPR", "Rhumatologie"],
  },
  {
    id: 198,
    titre: "Arthropathie microcristalline.",
    matieres: ["Immunologie", "Rhumatologie"],
  },
  {
    id: 199,
    titre: "Syndrome douloureux régional complexe (ex algodystrophie).",
    matieres: ["Douleurs - Soins Palliatifs", "MPR", "Orthopédie - Traumatologie", "Rhumatologie"],
  },
  {
    id: 200,
    titre: "Douleur et épanchement articulaire. Arthrite d’évolution récente.",
    matieres: ["Immunologie", "Orthopédie - Traumatologie", "Rhumatologie"],
  },
  {
    id: 201,
    titre: "Transplantation d’organes : aspects épidémiologiques et immunologiques...",
    matieres: ["Anesthésie - Réanimation", "Chirurgie Digestive", "Dermatologie", "Immunologie", "MIR - Urgences", "Néphrologie", "Ophtalmologie", "Urologie"],
  },
  {
    id: 202,
    titre: "Biothérapies et thérapies ciblées.",
    matieres: ["Hématologie", "Immunologie", "Médecine Interne", "Rhumatologie"],
  },
  {
    id: 203,
    titre: "Dyspnée aiguë et chronique.",
    matieres: ["MIR - Urgences", "Médecine Cardiovasculaire", "ORL", "Pédiatrie", "Pneumologie"],
  },
  {
    id: 204,
    titre: "Toux chez l’enfant et chez l’adulte (avec le traitement).",
    matieres: ["Médecine Générale", "Pédiatrie", "Pneumologie"],
  },
  {
    id: 205,
    titre: "Hémoptysie",
    matieres: ["MIR - Urgences", "Pneumologie"],
  },
  {
    id: 206,
    titre: "Epanchement pleural liquidien",
    matieres: ["Anatomie-Cytologie Pathologiques", "MIR - Urgences", "Pneumologie"],
  },
  {
    id: 207,
    titre: "Opacités et masses intra-thoraciques chez l'enfant et chez l'adulte",
    matieres: ["Pédiatrie", "Pneumologie"],
  },
  {
    id: 208,
    titre: "Insuffisance respiratoire chronique",
    matieres: ["Pneumologie"],
  },
  {
    id: 209,
    titre: "Bronchopneumopathie chronique obstructive chez l'adulte",
    matieres: ["MIR - Urgences", "Médecine Générale", "Pneumologie"],
  },
  {
    id: 210,
    titre: "Pneumopathie interstitielle diffuse",
    matieres: ["Anatomie-Cytologie Pathologiques", "Immunologie", "Médecine Interne", "Pneumologie"],
  },
  {
    id: 211,
    titre: "Sarcoïdose",
    matieres: ["Anatomie-Cytologie Pathologiques", "Dermatologie", "Immunologie", "Médecine Interne", "Pneumologie", "Rhumatologie"],
  },
  {
    id: 212,
    titre: "Hémogramme chez l'adulte et l'enfant : indications et interprétation",
    matieres: ["Hématologie", "Immunologie", "Pédiatrie"],
  },
  {
    id: 213,
    titre: "Anémie chez l'adulte et l'enfant",
    matieres: ["Hématologie", "Immunologie", "Médecine Interne", "Pédiatrie"],
  },
  {
    id: 214,
    titre: "Thrombopénie chez l'adulte et l'enfant",
    matieres: ["Hématologie", "Immunologie", "MIR - Urgences", "Médecine Interne"],
  },
  {
    id: 215,
    titre: "Purpuras chez l'adulte et l'enfant",
    matieres: ["Dermatologie", "Hématologie", "Infectiologie", "MIR - Urgences", "Médecine Interne", "Pédiatrie"],
  },
  {
    id: 216,
    titre: "Syndrome hémorragique d'origine hématologique",
    matieres: ["Hématologie", "Pédiatrie"],
  },
  {
    id: 217,
    titre: "Syndrome mononucléosique",
    matieres: ["Hématologie", "Immunologie", "Infectiologie", "Médecine Interne"],
  },
  {
    id: 218,
    titre: "Éosinophilie",
    matieres: ["Hématologie", "Immunologie", "Infectiologie", "Médecine Interne"],
  },
  {
    id: 219,
    titre: "Pathologie du fer chez l'adulte et l'enfant",
    matieres: ["Anatomie-Cytologie Pathologiques", "Endocrinologie", "HGE", "Médecine Interne", "Pédiatrie", "Rhumatologie"],
  },
  {
    id: 220,
    titre: "Adénopathie superficielle de l'adulte et de l'enfant",
    matieres: ["Anatomie-Cytologie Pathologiques", "Hématologie", "Immunologie", "Infectiologie", "Médecine Interne", "ORL", "Pédiatrie"],
  },
  {
    id: 221,
    titre: "Athérome : épidémiologie et physiopathologie. Le malade poly-athéromateux",
    matieres: ["Médecine Cardiovasculaire", "Médecine Générale", "Médecine Vasculaire", "Santé Publique"],
  },
  {
    id: 222,
    titre: "Facteurs de risque cardio-vasculaire et prévention",
    matieres: ["Endocrinologie", "Médecine Cardiovasculaire", "Médecine Générale", "Médecine Vasculaire", "Nutrition", "Santé Publique"],
  },
  {
    id: 223,
    titre: "Dyslipidémies",
    matieres: ["Endocrinologie", "Médecine Cardiovasculaire", "Médecine Générale", "Médecine Vasculaire", "Nutrition"],
  },
  {
    id: 224,
    titre: "Hypertension artérielle de l'adulte et de l’enfant",
    matieres: ["Endocrinologie", "MIR - Urgences", "Médecine Cardiovasculaire", "Médecine Générale", "Médecine Interne", "Médecine Vasculaire", "Néphrologie", "Ophtalmologie", "Pédiatrie"],
  },
  {
    id: 225,
    titre: "Artériopathie oblitérante de l'aorte, des artères viscérales et des membres inférieurs...",
    matieres: ["Médecine Cardiovasculaire", "Médecine Vasculaire"],
  },
  {
    id: 226,
    titre: "Thrombose veineuse profonde et embolie pulmonaire",
    matieres: ["Hématologie", "MIR - Urgences", "Médecine Cardiovasculaire", "Médecine Interne", "Médecine Vasculaire", "Pneumologie"],
  },
  {
    id: 227,
    titre: "Insuffisance veineuse chronique. Varices",
    matieres: ["Médecine Vasculaire"],
  },
  {
    id: 228,
    titre: "Ulcère de jambe",
    matieres: ["Dermatologie", "Médecine Vasculaire"],
  },
  {
    id: 229,
    titre: "Surveillance et complications des abords veineux",
    matieres: ["Anesthésie - Réanimation", "MIR - Urgences"],
  },
  {
    id: 230,
    titre: "Douleur thoracique aiguë",
    matieres: ["Médecine Cardiovasculaire", "Pneumologie"],
  },
  {
    id: 231,
    titre: "Électrocardiogramme : indications et interprétations",
    matieres: ["Médecine Cardiovasculaire"],
  },
  {
    id: 232,
    titre: "Fibrillation atriale",
    matieres: ["Médecine Cardiovasculaire"],
  },
  {
    id: 233,
    titre: "Valvulopathies",
    matieres: ["Médecine Cardiovasculaire"],
  },
  {
    id: 234,
    titre: "Insuffisance cardiaque de l'adulte",
    matieres: ["MIR - Urgences", "Médecine Cardiovasculaire"],
  },
  {
    id: 235,
    titre: "Péricardite aiguë",
    matieres: ["Médecine Cardiovasculaire"],
  },
  {
    id: 236,
    titre: "Troubles de la conduction intracardiaque",
    matieres: ["Médecine Cardiovasculaire"],
  },
  {
    id: 237,
    titre: "Palpitations",
    matieres: ["Médecine Cardiovasculaire", "Médecine Générale"],
  },
  {
    id: 238,
    titre: "Souffle cardiaque chez l'enfant",
    matieres: ["Médecine Cardiovasculaire", "Pédiatrie"],
  },
  {
    id: 239,
    titre: "Acrosyndromes (phénomène de Raynaud, érythermalgie...)",
    matieres: ["Dermatologie", "Médecine Interne", "Médecine Vasculaire"],
  },
  {
    id: 240,
    titre: "Hypoglycémie chez l'adulte et l'enfant",
    matieres: ["Endocrinologie", "Pédiatrie"],
  },
  {
    id: 241,
    titre: "Goitre, nodules thyroïdiens et cancers thyroïdiens",
    matieres: ["Anatomie-Cytologie Pathologiques", "Chirurgie Digestive", "Endocrinologie", "ORL"],
  },
  {
    id: 242,
    titre: "Hyperthyroïdie",
    matieres: ["Endocrinologie", "Ophtalmologie"],
  },
  {
    id: 243,
    titre: "Hypothyroïdie",
    matieres: ["Endocrinologie", "Pédiatrie"],
  },
  {
    id: 244,
    titre: "Adénome hypophysaire",
    matieres: ["Endocrinologie", "Neurochirurgie"],
  },
  {
    id: 245,
    titre: "Insuffisance surrénale chez l'adulte et l'enfant",
    matieres: ["Endocrinologie", "MIR - Urgences", "Pédiatrie"],
  },
  {
    id: 246,
    titre: "Gynécomastie",
    matieres: ["Endocrinologie"],
  },
  {
    id: 247,
    titre: "Diabète sucré de types 1 et 2 de l'enfant et de l'adulte. Complications",
    matieres: ["Endocrinologie", "Gynécologie Obstétrique", "MIR - Urgences", "Médecine Générale", "Nutrition", "Néphrologie", "Ophtalmologie", "Pédiatrie", "Thérapeutique"],
  },
  {
    id: 248,
    titre: "Prévention primaire par la nutrition chez l'adulte et chez l'enfant",
    matieres: ["Médecine Générale", "Médecine Vasculaire", "Nutrition"],
  },
  {
    id: 249,
    titre: "Modifications thérapeutiques du mode de vie (alimentation et activité physique)...",
    matieres: ["MPR", "Médecine Générale", "Nutrition", "Pédiatrie"],
  },
  {
    id: 250,
    titre: "Dénutrition chez l'adulte et l'enfant",
    matieres: ["Médecine Générale", "Nutrition", "Pédiatrie"],
  },
  {
    id: 251,
    titre: "Amaigrissement à tous les âges",
    matieres: ["Médecine Générale", "Médecine Interne", "Nutrition", "Pédiatrie"],
  },
  {
    id: 252,
    titre: "Troubles nutritionnels chez le sujet âgé",
    matieres: ["Gériatrie", "Nutrition"],
  },
  {
    id: 253,
    titre: "Obésité de l'enfant et de l'adulte",
    matieres: ["Chirurgie Digestive", "Endocrinologie", "Médecine Générale", "Nutrition", "Pédiatrie"],
  },
  {
    id: 254,
    titre: "Besoins nutritionnels et grossesse",
    matieres: ["Gynécologie Obstétrique", "Nutrition"],
  },
  {
    id: 255,
    titre: "Diabète gestationnel",
    matieres: ["Endocrinologie", "Gynécologie Obstétrique", "Nutrition", "Pédiatrie"],
  },
  {
    id: 256,
    titre: "Aptitude au sport chez l'adulte et l'enfant ; besoins nutritionnels chez le sportif",
    matieres: ["MPR", "Médecine Générale", "Nutrition", "Pédiatrie", "Rhumatologie"],
  },
  {
    id: 257,
    titre: "Œdèmes des membres inférieurs localisés ou généralisés",
    matieres: ["Médecine Interne", "Néphrologie"],
  },
  {
    id: 258,
    titre: "Élévation de la créatininémie",
    matieres: ["MIR - Urgences", "Néphrologie", "Pédiatrie"],
  },
  {
    id: 259,
    titre: "Protéinurie et syndrome néphrotique de chez l'l'adulte et de l'enfant",
    matieres: ["MIR - Urgences", "Néphrologie", "Pédiatrie"],
  },
  {
    id: 260,
    titre: "Hématurie",
    matieres: ["Néphrologie", "Pédiatrie", "Urologie"],
  },
  {
    id: 261,
    titre: "Néphropathie glomérulaire",
    matieres: ["Anatomie-Cytologie Pathologiques", "Néphrologie"],
  },
  {
    id: 262,
    titre: "Néphropathies interstitielles",
    matieres: ["Néphrologie"],
  },
  {
    id: 263,
    titre: "Néphropathies vasculaires",
    matieres: ["Anatomie-Cytologie Pathologiques", "Médecine Vasculaire", "Néphrologie"],
  },
  {
    id: 264,
    titre: "Insuffisance rénale chronique chez l'adulte et l'enfant",
    matieres: ["Néphrologie", "Pédiatrie"],
  },
  {
    id: 265,
    titre: "Lithiase urinaire",
    matieres: ["Néphrologie", "Urologie"],
  },
  {
    id: 266,
    titre: "Polykystose rénale",
    matieres: ["Néphrologie"],
  },
  {
    id: 267,
    titre: "Troubles de l'équilibre acido-basique et désordres hydro-électrolytiques",
    matieres: ["Anesthésie - Réanimation", "Endocrinologie", "MIR - Urgences", "Néphrologie"],
  },
  {
    id: 268,
    titre: "Hypercalcémie",
    matieres: ["Endocrinologie", "MIR - Urgences", "Médecine Interne", "Néphrologie", "Rhumatologie"],
  },
  {
    id: 269,
    titre: "Douleurs abdominales aiguës chez l'enfant et chez l'adulte",
    matieres: ["HGE", "Pédiatrie"],
  },
  {
    id: 270,
    titre: "Douleurs lombaires aiguës chez l'enfant et chez l'adulte",
    matieres: ["Médecine Générale"],
  },
  {
    id: 271,
    titre: "Reflux gastro-œsophagien chez le nourrisson, chez l'enfant et chez l'adulte...",
    matieres: ["Anatomie-Cytologie Pathologiques", "HGE", "Médecine Générale", "Pédiatrie"],
  },
  {
    id: 272,
    titre: "Ulcère gastrique et duodénal. Gastrite",
    matieres: ["Anatomie-Cytologie Pathologiques", "HGE"],
  },
  {
    id: 273,
    titre: "Dysphagie",
    matieres: ["Anatomie-Cytologie Pathologiques", "HGE", "ORL"],
  },
  {
    id: 274,
    titre: "Vomissements du nourrisson, de l'enfant et de l'adulte",
    matieres: ["HGE", "Pédiatrie"],
  },
  {
    id: 275,
    titre: "Splénomégalie",
    matieres: ["Hématologie", "Médecine Interne"],
  },
  {
    id: 276,
    titre: "Hépatomégalie et masse abdominale",
    matieres: ["Chirurgie Digestive", "HGE"],
  },
  {
    id: 277,
    titre: "Lithiase biliaire et complications",
    matieres: ["Chirurgie Digestive", "HGE"],
  },
  {
    id: 278,
    titre: "Ictère",
    matieres: ["HGE", "MIR - Urgences", "Pédiatrie"],
  },
  {
    id: 279,
    titre: "Cirrhose et complications",
    matieres: ["Anatomie-Cytologie Pathologiques", "HGE", "MIR - Urgences"],
  },
  {
    id: 280,
    titre: "Ascite",
    matieres: ["Chirurgie Digestive", "HGE", "MIR - Urgences"],
  },
  {
    id: 281,
    titre: "Pancréatite chronique",
    matieres: ["HGE"],
  },
  {
    id: 282,
    titre: "Maladies Inflammatoires Chroniques de l'Intestin (MICI) chez l'adulte",
    matieres: ["Chirurgie Digestive", "HGE"],
  },
  {
    id: 283,
    titre: "Constipation chez l'enfant et l'adulte (avec le traitement)",
    matieres: ["HGE", "Médecine Générale", "Pédiatrie"],
  },
  {
    id: 284,
    titre: "Colopathie fonctionnelle",
    matieres: ["HGE", "Médecine Générale"],
  },
  {
    id: 285,
    titre: "Diarrhée chronique chez l'adulte et l'enfant",
    matieres: ["Anatomie-Cytologie Pathologiques", "HGE", "Pédiatrie"],
  },
  {
    id: 286,
    titre: "Diarrhée aiguë et déshydratation chez le nourrisson, l'enfant et l'adulte",
    matieres: ["HGE", "Médecine Générale", "Pédiatrie"],
  },
  {
    id: 287,
    titre: "Diverticulose colique et diverticulite aiguë du sigmoïde",
    matieres: ["Chirurgie Digestive", "HGE"],
  },
  {
    id: 288,
    titre: "Pathologie hémorroïdaire",
    matieres: ["Chirurgie Digestive", "HGE"],
  },
  {
    id: 289,
    titre: "Hernie pariétale chez l'enfant et l'adulte",
    matieres: ["Chirurgie Digestive", "Pédiatrie"],
  },
  {
    id: 290,
    titre: "Épidémiologie, facteurs de risque, prévention et dépistage des cancers",
    matieres: ["Cancérologie", "Gynécologie Médicale", "Gynécologie Obstétrique", "Médecine Générale", "Médecine Légal - Médecine du Travail", "Santé Publique"],
  },
  {
    id: 291,
    titre: "Cancer : cancérogénèse, oncogénétique",
    matieres: ["Cancérologie", "Médecine Légal - Médecine du Travail"],
  },
  {
    id: 292,
    titre: "Diagnostic des cancers : signes d'appel et investigations para-cliniques...",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Médecine Générale"],
  },
  {
    id: 293,
    titre: "Le médecin préleveur de cellules et/ou de tissus pour des examens d'ACP...",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie"],
  },
  {
    id: 294,
    titre: "Traitement des cancers : principales modalités, classes thérapeutiques...",
    matieres: ["Cancérologie", "Chirurgie Digestive"],
  },
  {
    id: 295,
    titre: "Prise en charge et accompagnement d'un malade atteint de cancer...",
    matieres: ["Cancérologie"],
  },
  {
    id: 296,
    titre: "Agranulocytose médicamenteuse : conduite à tenir",
    matieres: ["Hématologie"],
  },
  {
    id: 297,
    titre: "Cancer de l'enfant : particularités épidémiologiques, diagnostiques et thérapeutiques",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Neurochirurgie", "Pédiatrie", "Santé Publique"],
  },
  {
    id: 298,
    titre: "Tumeurs de la cavité buccale, naso-sinusiennes et du cavum...",
    matieres: ["Anatomie-Cytologie Pathologiques", "CMF", "Cancérologie", "ORL"],
  },
  {
    id: 299,
    titre: "Tumeurs intracrâniennes",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Neurochirurgie", "Neurologie"],
  },
  {
    id: 300,
    titre: "Tumeurs du col utérin, tumeur du corps utérin",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Gynécologie Médicale", "Gynécologie Obstétrique", "Médecine Générale"],
  },
  {
    id: 301,
    titre: "Tumeurs du colon et du rectum",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Chirurgie Digestive", "HGE", "Médecine Générale"],
  },
  {
    id: 302,
    titre: "Tumeurs cutanées, épithéliales et mélaniques",
    matieres: ["Anatomie-Cytologie Pathologiques", "CMF", "Cancérologie", "Dermatologie"],
  },
  {
    id: 303,
    titre: "Tumeurs de l'estomac",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Chirurgie Digestive", "HGE"],
  },
  {
    id: 304,
    titre: "Tumeurs du foie, primitives et secondaires",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Chirurgie Digestive", "HGE"],
  },
  {
    id: 305,
    titre: "Tumeurs de l'oesophage",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Chirurgie Digestive", "HGE"],
  },
  {
    id: 306,
    titre: "Tumeurs de l'ovaire",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Gynécologie Médicale", "Gynécologie Obstétrique"],
  },
  {
    id: 307,
    titre: "Tumeurs des os primitives et secondaires",
    matieres: ["Anatomie-Cytologie Pathologiques", "CMF", "Cancérologie", "Orthopédie - Traumatologie", "Rhumatologie"],
  },
  {
    id: 308,
    titre: "Tumeurs du pancréas",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Chirurgie Digestive", "Endocrinologie", "HGE"],
  },
  {
    id: 309,
    titre: "Tumeurs du poumon, primitives et secondaires",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Pneumologie"],
  },
  {
    id: 310,
    titre: "Tumeurs de la prostate",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Urologie"],
  },
  {
    id: 311,
    titre: "Tumeurs du rein de l’adulte",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Urologie"],
  },
  {
    id: 312,
    titre: "Tumeurs du sein",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Gynécologie Médicale", "Gynécologie Obstétrique", "Médecine Générale"],
  },
  {
    id: 313,
    titre: "Tumeurs du testicule",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Urologie"],
  },
  {
    id: 314,
    titre: "Tumeurs vésicales",
    matieres: ["Anatomie-Cytologie Pathologiques", "Cancérologie", "Urologie"],
  },
  {
    id: 315,
    titre: "Leucémies aiguës",
    matieres: ["Hématologie", "Pédiatrie"],
  },
  {
    id: 316,
    titre: "Syndromes myélodysplasiques",
    matieres: ["Hématologie"],
  },
  {
    id: 317,
    titre: "Syndromes myéloprolifératifs",
    matieres: ["Hématologie"],
  },
  {
    id: 318,
    titre: "Leucémies lymphoïdes chroniques",
    matieres: ["Anatomie-Cytologie Pathologiques", "Hématologie"],
  },
  {
    id: 319,
    titre: "Lymphomes malins",
    matieres: ["Anatomie-Cytologie Pathologiques", "Dermatologie", "Hématologie"],
  },
  {
    id: 320,
    titre: "Myélome multiple des os",
    matieres: ["Anatomie-Cytologie Pathologiques", "Hématologie", "Néphrologie", "Rhumatologie"],
  },
  {
    id: 321,
    titre: "Principe du bon usage du médicament",
    matieres: ["Médecine Générale", "Thérapeutique"],
  },
  {
    id: 322,
    titre: "La décision thérapeutique personnalisée : bon usage dans des situations à risque",
    matieres: ["Anesthésie - Réanimation", "Gériatrie", "Médecine Générale", "Thérapeutique"],
  },
  {
    id: 323,
    titre: "Analyser et utiliser les résultats des études cliniques dans la perspective du bon usage...",
    matieres: ["Santé Publique", "Thérapeutique"],
  },
  {
    id: 324,
    titre: "Éducation thérapeutique, observance et automédication",
    matieres: ["Médecine Générale", "Médecine Interne", "Thérapeutique"],
  },
  {
    id: 325,
    titre: "Identification et gestion des risques liés aux médicaments...",
    matieres: ["Gériatrie", "MIR - Urgences", "Santé Publique", "Thérapeutique"],
  },
  {
    id: 326,
    titre: "Cadre réglementaire de la prescription thérapeutique et recommandations pour le bon usage",
    matieres: ["Thérapeutique"],
  },
  {
    id: 327,
    titre: "Principes de la médecine intégrative, utilité et risques des interventions...",
    matieres: ["Médecine Générale", "Thérapeutique"],
  },
  {
    id: 328,
    titre: "Thérapeutiques non médicamenteuses et dispositifs médicaux",
    matieres: ["MPR", "Thérapeutique"],
  },
  {
    id: 329,
    titre: "Transfusion sanguine et produits dérivés du sang : indications, complications...",
    matieres: ["Anesthésie - Réanimation", "Gériatrie", "Hématologie", "MIR - Urgences", "Pédiatrie", "Thérapeutique"],
  },
  {
    id: 330,
    titre: "Prescription et surveillance des classes de médicaments les plus courantes...",
    matieres: ["Dermatologie", "Douleurs - Soins Palliatifs", "Gériatrie", "Hématologie", "MIR - Urgences", "Médecine Cardiovasculaire", "Médecine Interne", "Médecine Vasculaire", "Néphrologie", "Pédiatrie", "Rhumatologie", "Thérapeutique"],
  },
  {
    id: 331,
    titre: "Arrêt cardio-circulatoire.",
    matieres: ["Anesthésie - Réanimation", "MIR - Urgences", "Médecine Cardiovasculaire", "Pédiatrie"],
  },
  {
    id: 332,
    titre: "État de choc. Principales étiologies : hypovolémique, septique, cardiogénique...",
    matieres: ["Anesthésie - Réanimation", "MIR - Urgences", "Pédiatrie"],
  },
  {
    id: 333,
    titre: "Situations sanitaires exceptionnelles.",
    matieres: ["Anesthésie - Réanimation", "MIR - Urgences"],
  },
  {
    id: 334,
    titre: "Prise en charge immédiate pré-hospitalière et à l'arrivée à l'hôpital...",
    matieres: ["Anesthésie - Réanimation", "Chirurgie Digestive", "MIR - Urgences", "Médecine Vasculaire", "Neurochirurgie", "ORL", "Orthopédie - Traumatologie", "Pédiatrie"],
  },
  {
    id: 335,
    titre: "Orientation diagnostique et conduite à tenir devant un traumatisme maxillo-facial...",
    matieres: ["CMF", "Neurochirurgie", "ORL", "Ophtalmologie", "Pédiatrie"],
  },
  {
    id: 336,
    titre: "Coma non traumatique chez l'adulte et chez l'enfant.",
    matieres: ["Anesthésie - Réanimation", "MIR - Urgences", "Neurologie"],
  },
  {
    id: 337,
    titre: "Principales intoxications aiguës.",
    matieres: ["Anesthésie - Réanimation", "MIR - Urgences", "Pédiatrie"],
  },
  {
    id: 338,
    titre: "Œdème de Quincke et anaphylaxie.",
    matieres: ["Anesthésie - Réanimation", "MIR - Urgences", "Pneumologie"],
  },
  {
    id: 339,
    titre: "Syndromes coronariens aigus.",
    matieres: ["MIR - Urgences", "Médecine Cardiovasculaire"],
  },
  {
    id: 340,
    titre: "Accidents vasculaires cérébraux.",
    matieres: ["MIR - Urgences", "MPR", "Médecine Vasculaire", "Neurochirurgie", "Neurologie"],
  },
  {
    id: 341,
    titre: "Hémorragie méningée.",
    matieres: ["Anesthésie - Réanimation", "MIR - Urgences", "Neurochirurgie", "Neurologie"],
  },
  {
    id: 342,
    titre: "Malaise, perte de connaissance, crise convulsive chez l'adulte.",
    matieres: ["MIR - Urgences", "Médecine Cardiovasculaire", "Neurologie"],
  },
  {
    id: 343,
    titre: "État confusionnel et trouble de conscience chez l'adulte et chez l'enfant.",
    matieres: ["Gériatrie", "MIR - Urgences", "Neurologie", "Pédiatrie"],
  },
  {
    id: 344,
    titre: "Prise en charge d'une patiente atteinte de pré-éclampsie.",
    matieres: ["Anesthésie - Réanimation", "Gynécologie Obstétrique", "MIR - Urgences", "Néphrologie"],
  },
  {
    id: 345,
    titre: "Malaise grave du nourrisson et mort inattendue du nourrisson.",
    matieres: ["Pédiatrie"],
  },
  {
    id: 346,
    titre: "Convulsions chez le nourrisson et chez l'enfant.",
    matieres: ["Pédiatrie"],
  },
  {
    id: 347,
    titre: "Rétention aiguë d'urine.",
    matieres: ["Gériatrie", "Urologie"],
  },
  {
    id: 348,
    titre: "Insuffisance rénale aiguë - Anurie.",
    matieres: ["Anesthésie - Réanimation", "MIR - Urgences", "Néphrologie", "Pédiatrie", "Urologie"],
  },
  {
    id: 349,
    titre: "Infection aiguë des parties molles (abcès, panaris, phlegmon des gaines).",
    matieres: ["Anesthésie - Réanimation", "Orthopédie - Traumatologie"],
  },
  {
    id: 350,
    titre: "Grosse jambe rouge aiguë.",
    matieres: ["Dermatologie"],
  },
  {
    id: 351,
    titre: "Agitation et délire aiguë.",
    matieres: ["Psychiatrie - Addictologie"],
  },
  {
    id: 352,
    titre: "Crise d'angoisse aiguë et attaque de panique.",
    matieres: ["Psychiatrie - Addictologie"],
  },
  {
    id: 353,
    titre: "Risque et conduite suicidaires chez l'enfant, l'adolescent et l'adulte...",
    matieres: ["Médecine Générale", "Pédiatrie", "Psychiatrie - Addictologie"],
  },
  {
    id: 354,
    titre: "Syndrome occlusif de l'enfant et de l'adulte.",
    matieres: ["Chirurgie Digestive", "Pédiatrie"],
  },
  {
    id: 355,
    titre: "Hémorragie digestive.",
    matieres: ["Anesthésie - Réanimation", "HGE", "MIR - Urgences", "Pédiatrie"],
  },
  {
    id: 356,
    titre: "Appendicite de l'enfant et de l'adulte.",
    matieres: ["Chirurgie Digestive", "Pédiatrie"],
  },
  {
    id: 357,
    titre: "Péritonite aiguë chez l'enfant et chez l'adulte.",
    matieres: ["Anesthésie - Réanimation", "Chirurgie Digestive", "Infectiologie", "Pédiatrie"],
  },
  {
    id: 358,
    titre: "Pancréatite aiguë.",
    matieres: ["Anesthésie - Réanimation", "Chirurgie Digestive", "HGE", "MIR - Urgences"],
  },
  {
    id: 359,
    titre: "Détresse et insuffisance respiratoire aigüe du nourrisson, de l'enfant et de l'adulte.",
    matieres: ["Anesthésie - Réanimation", "MIR - Urgences", "ORL", "Pédiatrie", "Pneumologie"],
  },
  {
    id: 360,
    titre: "Pneumothorax.",
    matieres: ["MIR - Urgences", "Pneumologie"],
  },
  {
    id: 361,
    titre: "Lésions péri-articulaires et ligamentaires du genou, de la cheville et de l'épaule.",
    matieres: ["Orthopédie - Traumatologie", "Rhumatologie"],
  },
  {
    id: 362,
    titre: "Prothèses et ostéosynthèses.",
    matieres: ["Infectiologie", "Orthopédie - Traumatologie"],
  },
  {
    id: 363,
    titre: "Fractures fréquentes de l'adulte et du sujet âgé.",
    matieres: ["Orthopédie - Traumatologie"],
  },
  {
    id: 364,
    titre: "Fractures chez l'enfant : particularités épidémiologiques, diagnostiques et thérapeutiques.",
    matieres: ["Orthopédie - Traumatologie", "Pédiatrie"],
  },
  {
    id: 365,
    titre: "Surveillance d'un malade sous plâtre/résine, diagnostiquer une complication.",
    matieres: ["Orthopédie - Traumatologie", "Pédiatrie"],
  },
  {
    id: 366,
    titre: "Exposition accidentelle aux liquides biologiques : conduite à tenir.",
    matieres: ["Infectiologie"],
  },
  {
    id: 367,
    titre: "Impact de l’environnement sur la santé",
    matieres: ["Médecine Générale", "Médecine Légal - Médecine du Travail", "Santé Publique"],
  },
];


// Date de fin de révisions (30 août 2026)
const END_DATE_STR = "2026-08-30";

// AJOUT : Date de début des révisions (1er septembre 2025)
const START_DATE_STR = "2025-09-01";

// Intervalles J+ pour les re-révisions
const REVIEW_OFFSETS_DAYS = [1, 3, 7, 14, 25, 50, 100, 160, 220, 300];
