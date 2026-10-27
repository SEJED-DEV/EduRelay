/**
 * ==============================================================================
 * EduRelay — School Supplies · Passed Forward
 * Copyright (c) 2026 EduRelay. All rights reserved.
 *
 * PRIVATE REPOSITORY — CONFIDENTIAL.
 * This file is part of a private, proprietary codebase. Access is granted by
 * prior written permission from the owner only. If you are reading this without
 * that permission you must stop now and delete every copy: you may not view,
 * copy, modify, distribute or disclose this file.
 * Unauthorised access or use may give rise to civil and/or criminal liability
 * under applicable law, including Tunisian intellectual-property law (Law No.
 * 94-36) and the law on electronic exchanges (Law No. 2000-83).
 *
 * Code owned by EduRelay · Made by Sejed TRABELSSI
 *   Portfolio      https://sejed.dev
 *   Instagram      https://instagram.com/sejed.dev
 *   Discord        https://discord.gg/sejed.dev
 *   Dev Community  https://dev.to/sejed.dev
 *   Facebook       https://facebook.com/TSSEJED
 *   Mobile         +216 94 155 000
 *
 * @file     apps/web/src/content/legal.ts
 * @summary  Bilingual legal corpus: terms, privacy, cookies, security, notice.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Legal corpus.
 *
 * One typed object per document and locale. The pages under
 * `app/[locale]/legal/*` are thin renderers; all wording lives here so the
 * French and Arabic versions stay in lockstep and can be reviewed as a diff.
 *
 * This is a pre-launch draft. The banner rendered by the legal shell says so,
 * and `docs/ip-protection.md` records that Tunisian counsel must review the
 * text before public launch. Do not add a claim here that the code or the
 * provider contracts do not support.
 *
 * Rules followed:
 *   - No hardcoded contact addresses: they come from the brand config.
 *   - No `[[PLACEHOLDER]]` tokens. If a fact is unknown, the clause says what
 *     is true today (for example "the active payment provider is named at
 *     checkout") instead of inventing a detail.
 *   - The French and Arabic versions are equally authoritative; the renderer
 *     shows the matching locale and never mixes them.
 */

import { brand, defaultLocale, isLocale, type Locale } from "@edurelay/brand";

export type LegalSlug = "terms" | "privacy" | "cookies" | "security" | "notice";

export interface LegalTable {
  headers: string[];
  rows: string[][];
}

export interface LegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: LegalTable;
}

export interface LegalDocument {
  slug: LegalSlug;
  title: string;
  shortTitle: string;
  description: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
}

export const LEGAL_SLUGS = ["terms", "privacy", "cookies", "security", "notice"] as const;

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

const support = brand.contacts.supportEmail;
const security = brand.contacts.securityEmail;
const site = brand.siteUrl;

const UPDATED: Record<Locale, string> = {
  fr: "26 octobre 2026",
  ar: "26 أكتوبر 2026",
};

const fr: Record<LegalSlug, LegalDocument> = {
  terms: {
    slug: "terms",
    title: "Conditions générales d'utilisation",
    shortTitle: "Conditions d'utilisation",
    description:
      "Les règles qui encadrent l'achat, la vente et les dons de fournitures scolaires sur EduRelay.",
    updated: UPDATED.fr,
    intro: [
      `Les présentes conditions générales d'utilisation (« CGU ») régissent l'accès à ${site} et à tous les services qui y sont proposés (ensemble, le « Service »). Le Service est édité et exploité par EduRelay, Tunis, Tunisie (« EduRelay », « nous »).`,
      "En créant un compte, en publiant une annonce, en commandant ou en utilisant le Service de toute autre manière, vous acceptez les présentes CGU et notre politique de confidentialité. Si vous n'acceptez pas ces documents, n'utilisez pas le Service.",
    ],
    sections: [
      {
        id: "objet",
        title: "1. Objet du Service",
        paragraphs: [
          "EduRelay est une place de marché tunisienne consacrée aux fournitures scolaires d'occasion, aux manuels, aux uniformes et au matériel scolaire. Le Service permet à des particuliers, des familles, des bibliothèques, des écoles et des associations de publier, vendre, acheter ou donner ces articles.",
          "Le Service peut également proposer des fonctionnalités de don au profit d'associations partenaires, un suivi de livraison et un mécanisme de paiement protégé. Ces fonctionnalités sont décrites au moment où elles sont utilisées et peuvent évoluer.",
        ],
      },
      {
        id: "definitions",
        title: "2. Définitions",
        bullets: [
          "« Annonce » : la fiche créée par un vendeur pour présenter un article, son état, son prix et ses photos.",
          "« Acheteur » : toute personne qui commande un article via le Service.",
          "« Vendeur » : toute personne qui publie une annonce ou propose un article.",
          "« Contenu » : textes, photos, descriptions, messages et tout autre élément publié par un utilisateur.",
          "« Commande » : l'acceptation par un acheteur d'une annonce, matérialisée dans le Service.",
          "« Prix protégé » : le montant encaissé par EduRelay ou par son prestataire de paiement et conservé jusqu'à la fin de la fenêtre de confirmation.",
        ],
      },
      {
        id: "compte",
        title: "3. Compte et éligibilité",
        paragraphs: [
          "Vous devez avoir au moins 18 ans et la capacité juridique de conclure un contrat pour utiliser le Service. Les mineurs ne peuvent pas créer de compte ; un parent ou tuteur légal peut utiliser le Service pour les besoins du foyer.",
          `Vous vous engagez à fournir des informations exactes, complètes et à jour, à ne créer qu'un compte personnel et à ne pas partager vos identifiants. Vous êtes responsable de toute activité réalisée depuis votre compte. Prévenez-nous immédiatement à ${support} si vous pensez que votre compte a été compromis.`,
          "Nous pouvons demander une vérification d'identité, de téléphone ou d'adresse lorsque la loi l'exige ou lorsque cela est nécessaire pour prévenir la fraude. Un compte peut être refusé ou suspendu si les informations fournies ne permettent pas cette vérification.",
        ],
      },
      {
        id: "role",
        title: "4. Le rôle d'EduRelay",
        paragraphs: [
          "EduRelay met en relation acheteurs et vendeurs. Sauf mention contraire explicite sur une page produit, EduRelay n'est pas le vendeur, ne possède pas les articles et n'est pas partie au contrat de vente conclu entre l'acheteur et le vendeur.",
          "Le vendeur est seul responsable de l'article qu'il propose, de son état, de sa conformité, de sa provenance et de la véracité de son annonce. L'acheteur est responsable de la lecture de l'annonce et de la vérification de l'article à la réception.",
          "EduRelay peut modérer, retirer ou refuser une annonce, et peut suspendre une transaction lorsqu'elle présente un risque de fraude, de contrefaçon, de danger ou de violation des présentes CGU. La modération ne constitue pas une garantie de qualité ni une inspection physique de chaque article.",
        ],
      },
      {
        id: "annonces",
        title: "5. Annonces et contenu",
        paragraphs: [
          "Toute annonce doit décrire un article réel, disponible, dont vous êtes propriétaire ou que vous êtes autorisé à vendre ou à donner. Les photos doivent être récentes et représenter l'article réel ; les images de catalogue ou les photos d'un autre vendeur sont interdites.",
          "Vous accordez à EduRelay une licence mondiale, non exclusive et gratuite pour héberger, reproduire, redimensionner, afficher et diffuser votre Contenu dans le cadre du fonctionnement, de la promotion et de la sécurisation du Service. Cette licence prend fin lorsque vous supprimez le Contenu, sous réserve des sauvegardes techniques et des obligations légales de conservation.",
          "Vous garantissez détenir tous les droits nécessaires sur votre Contenu et que celui-ci ne porte pas atteinte aux droits d'un tiers. Nous pouvons retirer un Contenu sur signalement motivé ou d'office lorsqu'il paraît illicite.",
        ],
      },
      {
        id: "prix",
        title: "6. Prix, frais et paiement",
        paragraphs: [
          "Les prix sont affichés en dinars tunisiens (TND), toutes taxes comprises lorsqu'elles s'appliquent. Le prix de l'article et les frais de livraison sont indiqués avant la validation de la commande. Aucun frais caché n'est ajouté après votre confirmation.",
          "Sauf indication contraire au moment de la publication, EduRelay retient une commission de 10 % du sous-total de l'article. Cette commission rémunère le Service et n'est due que sur une vente effectivement conclue. Il n'y a pas d'abonnement obligatoire.",
          "Le paiement peut être effectué en ligne via un prestataire de paiement agréé, ou en espèces à la livraison lorsque cette option est proposée. Le nom du prestataire actif et les moyens acceptés sont affichés au moment du paiement. EduRelay ne stocke jamais le numéro complet d'une carte bancaire ; les données de carte sont traitées directement par le prestataire.",
          "Lorsque le paiement protégé est utilisé, le montant est conservé pendant 48 heures après la livraison. Si l'acheteur ne confirme pas la réception et n'ouvre pas de litige dans ce délai, le vendeur est payé automatiquement, sous réserve des contrôles de sécurité et des obligations légales.",
          "En cas de paiement en espèces à la livraison, le transporteur encaisse le montant et le reverse selon son propre calendrier. EduRelay peut suspendre un versement en cas de litige, de remboursement ou de suspicion de fraude.",
        ],
      },
      {
        id: "livraison",
        title: "7. Livraison et réception",
        paragraphs: [
          "Les options de livraison, les délais estimés et les frais sont indiqués avant la commande. Les délais sont des estimations et peuvent varier selon la wilaya, le transporteur et les conditions locales.",
          "Vous devez fournir une adresse et un numéro de téléphone exacts. Le risque de perte ou de détérioration pendant le transport est supporté par le transporteur ou le vendeur selon les règles applicables ; EduRelay vous aide à ouvrir un litige et à documenter le problème.",
          "À la réception, vérifiez l'article dans un délai raisonnable. Une réclamation pour un article manquant, non conforme ou endommagé doit être ouverte avant la fin de la fenêtre de confirmation de 48 heures, avec des photos et une description claire.",
        ],
      },
      {
        id: "retours",
        title: "8. Annulation, retours et litiges",
        paragraphs: [
          "Une commande peut être annulée avant l'expédition lorsque le vendeur ou le transporteur n'a pas encore pris en charge l'article. Après expédition, l'annulation dépend de l'accord des parties et des règles du transporteur.",
          "Les articles d'occasion sont vendus dans l'état décrit. Sauf défaut caché ou description trompeuse, les défauts apparents signalés dans l'annonce ne justifient pas un retour. Les droits impératifs du consommateur prévus par la loi tunisienne restent applicables.",
          "En cas de litige, les deux parties sont invitées à échanger des preuves dans le Service. EduRelay peut examiner les photos, les messages et le suivi de livraison, puis proposer une solution (remboursement total ou partiel, retour, versement au vendeur). Cette décision est prise de bonne foi et ne prive pas les parties de leur droit de saisir une juridiction compétente.",
        ],
      },
      {
        id: "dons",
        title: "9. Dons et associations partenaires",
        paragraphs: [
          "Le Service peut permettre de donner un article à une association partenaire, notamment pour la rentrée scolaire. Le don est gratuit : aucun prix n'est dû pour l'article donné. Les éventuels frais de transport sont indiqués avant la confirmation.",
          "Les associations partenaires sont responsables de l'acceptation, de la distribution et du suivi des dons qu'elles reçoivent. EduRelay ne garantit pas qu'un don sera remis à un bénéficiaire déterminé et ne délivre pas de reçu fiscal sauf mention expresse.",
        ],
      },
      {
        id: "interdits",
        title: "10. Conduite interdite",
        paragraphs: ["Il est interdit d'utiliser le Service pour :"],
        bullets: [
          "vendre ou donner un article illicite, volé, contrefait, piraté ou dangereux, notamment des manuels photocopiés, des corrigés non autorisés, des armes, des produits chimiques dangereux, des médicaments, de l'alcool ou du tabac ;",
          "publier des données personnelles d'un tiers, en particulier d'un mineur, sans autorisation ;",
          "usurper l'identité d'une personne, d'une école ou d'une marque, ou créer une annonce trompeuse ;",
          "contourner le paiement, la commission ou le système de litige en proposant une transaction hors plateforme ;",
          "harceler, menacer, discriminer ou tromper un autre utilisateur ;",
          "introduire un virus, automatiser l'extraction de données, contourner les mesures de sécurité ou perturber le Service ;",
          "utiliser le Service à des fins de blanchiment, de fraude ou de financement illicite.",
        ],
      },
      {
        id: "propriete",
        title: "11. Propriété intellectuelle",
        paragraphs: [
          "Le nom EduRelay, le logo, l'interface, le code, les textes, les graphismes et la base de données sont protégés par les droits de propriété intellectuelle d'EduRelay ou de ses concédants. Aucun droit ne vous est cédé en dehors du droit limité d'utiliser le Service conformément aux présentes CGU.",
          "Vous ne pouvez pas reproduire, modifier, distribuer, vendre, louer, décompiler ou exploiter une partie du Service sans autorisation écrite préalable, sauf exceptions légales impératives.",
          "Si vous nous envoyez une suggestion ou un retour, vous nous autorisez à l'utiliser librement et gratuitement pour améliorer le Service, sans obligation de rémunération ni de confidentialité.",
        ],
      },
      {
        id: "suspension",
        title: "12. Suspension et résiliation",
        paragraphs: [
          `Vous pouvez fermer votre compte à tout moment depuis les paramètres ou en écrivant à ${support}. La fermeture ne supprime pas les obligations liées aux commandes en cours, aux litiges ouverts ou aux documents comptables que nous devons conserver.`,
          "Nous pouvons suspendre ou résilier votre accès, retirer une annonce ou annuler une commande en cas de violation des CGU, de fraude, de risque pour un utilisateur, de contrefaçon, de comportement illicite ou d'obligation légale. Lorsque la situation le permet, nous vous informons du motif et de la possibilité de contester.",
        ],
      },
      {
        id: "garanties",
        title: "13. Garanties et limitation de responsabilité",
        paragraphs: [
          "Le Service est fourni « en l'état » et « selon disponibilité ». Nous ne garantissons pas que le Service sera ininterrompu, exempt d'erreurs, sécurisé en permanence ou accessible depuis tous les appareils. Les articles sont proposés par des vendeurs indépendants et ne sont pas garantis par EduRelay au-delà de ce que prévoit la loi.",
          "Dans les limites permises par la loi tunisienne, EduRelay n'est pas responsable des dommages indirects, immatériels ou consécutifs, notamment la perte de bénéfices, de données, de clientèle ou de réputation, même si nous avons été informés de leur possibilité.",
          "Dans les limites permises par la loi, la responsabilité totale d'EduRelay pour l'ensemble des réclamations liées au Service ne peut excéder le montant total que vous nous avez payé au cours des douze mois précédant la réclamation, ou 100 TND si ce montant est inférieur. Cette limitation ne s'applique pas en cas de faute lourde, de dol, d'atteinte à la vie ou à l'intégrité physique, ni dans les cas où la loi interdit une telle limitation.",
        ],
      },
      {
        id: "indemnisation",
        title: "14. Indemnisation",
        paragraphs: [
          "Vous acceptez de défendre, indemniser et dégager EduRelay, ses dirigeants, employés et partenaires de toute réclamation, perte, responsabilité, amende ou frais (y compris des honoraires d'avocat raisonnables) découlant de votre Contenu, de vos annonces, de votre usage du Service ou de votre violation des présentes CGU ou des droits d'un tiers.",
        ],
      },
      {
        id: "force",
        title: "15. Force majeure",
        paragraphs: [
          "EduRelay n'est pas responsable d'un retard ou d'une inexécution causé par un événement échappant à son contrôle raisonnable, notamment une panne d'Internet ou d'électricité, une cyberattaque majeure, une défaillance d'un prestataire de paiement ou de livraison, une catastrophe naturelle, une grève, une décision administrative ou un conflit armé.",
        ],
      },
      {
        id: "droit",
        title: "16. Droit applicable et litiges",
        paragraphs: [
          "Les présentes CGU sont régies par le droit tunisien, sans préjudice des règles impératives protectrices du consommateur qui pourraient s'appliquer dans votre pays de résidence.",
          `En cas de désaccord, nous vous invitons à nous écrire à ${support} et à tenter une résolution amiable pendant au moins 30 jours. À défaut d'accord, les tribunaux compétents de Tunis sont saisis, sauf disposition légale impérative contraire.`,
        ],
      },
      {
        id: "modifications",
        title: "17. Modifications",
        paragraphs: [
          "Nous pouvons modifier les présentes CGU pour refléter une évolution du Service, de la loi ou de nos pratiques. Les changements importants sont annoncés sur le site ou par e-mail au moins 15 jours avant leur entrée en vigueur, sauf urgence ou obligation légale.",
          "En continuant à utiliser le Service après l'entrée en vigueur, vous acceptez les nouvelles CGU. Si vous refusez, vous pouvez fermer votre compte avant la date d'application.",
        ],
      },
      {
        id: "divers",
        title: "18. Dispositions générales",
        paragraphs: [
          "Si une clause est jugée nulle ou inapplicable, les autres clauses restent en vigueur. Le fait de ne pas exercer un droit ne vaut pas renonciation. Les présentes CGU, la politique de confidentialité et les documents qui y sont incorporés constituent l'accord complet entre vous et EduRelay.",
          "Vous ne pouvez pas céder vos droits ou obligations sans notre accord écrit. Nous pouvons céder les nôtres en cas de restructuration, de fusion ou de vente d'activité, sous réserve de la protection de vos données.",
          "Les versions française et arabe ont la même valeur. En cas de divergence d'interprétation, la version française prévaut, sauf disposition impérative contraire.",
        ],
      },
      {
        id: "contact",
        title: "19. Contact",
        paragraphs: [
          `Pour toute question relative aux présentes CGU, écrivez à ${support}. Pour un signalement de sécurité, utilisez ${security}.`,
        ],
      },
    ],
  },

  privacy: {
    slug: "privacy",
    title: "Politique de confidentialité",
    shortTitle: "Confidentialité",
    description:
      "Quelles données personnelles EduRelay collecte, pourquoi, avec qui elles sont partagées et comment exercer vos droits.",
    updated: UPDATED.fr,
    intro: [
      `EduRelay, Tunis, Tunisie, est responsable du traitement des données personnelles décrites dans la présente politique, utilisées sur ${site} et dans les services associés.`,
      "Nous appliquons la loi organique tunisienne n° 2004-63 relative à la protection des données à caractère personnel et, lorsque le RGPD s'applique, ses principes de minimisation, de finalité et de sécurité. Cette politique explique ce que nous faisons concrètement.",
    ],
    sections: [
      {
        id: "responsable",
        title: "1. Responsable du traitement",
        paragraphs: [
          `Le responsable du traitement est EduRelay, dont le siège est à Tunis, Tunisie. Pour toute question ou demande relative à vos données, écrivez à ${support} avec l'objet « Données personnelles ».`,
          "Un référent protection des données répond aux demandes d'accès, de rectification et de suppression. Il coordonne également les mesures de sécurité et les notifications obligatoires.",
        ],
      },
      {
        id: "donnees",
        title: "2. Données que nous collectons",
        paragraphs: [
          "Nous collectons uniquement les données nécessaires pour faire fonctionner la place de marché, sécuriser les transactions et respecter nos obligations légales. Le tableau ci-dessous récapitule les catégories, leurs finalités et leur durée de conservation.",
        ],
        table: {
          headers: ["Catégorie", "Exemples", "Finalité", "Base légale", "Conservation"],
          rows: [
            [
              "Compte",
              "Nom, adresse e-mail, téléphone, mot de passe haché",
              "Créer, authentifier et sécuriser le compte",
              "Contrat",
              "Durée du compte + 12 mois",
            ],
            [
              "Profil",
              "Pseudo, wilaya, école, avatar, bio, langue",
              "Afficher le profil vendeur et adapter la langue",
              "Contrat",
              "Durée du compte",
            ],
            [
              "Annonces",
              "Titres, descriptions, photos, état, prix",
              "Publier, modérer et afficher les annonces",
              "Contrat",
              "Jusqu'à suppression + 12 mois",
            ],
            [
              "Commandes",
              "Articles, montants, adresses, statut, litiges",
              "Exécuter la vente, la livraison et les remboursements",
              "Contrat et obligation légale",
              "10 ans pour les pièces comptables",
            ],
            [
              "Paiement",
              "Référence de transaction, statut, montant",
              "Encaisser, rembourser et lutter contre la fraude",
              "Contrat et obligation légale",
              "10 ans",
            ],
            [
              "Livraison",
              "Nom, téléphone, adresse, suivi",
              "Remettre le colis et gérer les incidents",
              "Contrat",
              "3 ans après la livraison",
            ],
            [
              "Support et litiges",
              "Messages, photos, preuves",
              "Répondre aux demandes et résoudre les litiges",
              "Contrat et intérêt légitime",
              "3 ans après clôture",
            ],
            [
              "Technique",
              "Adresse IP, appareil, journaux, cookies",
              "Sécurité, langue, prévention de la fraude",
              "Intérêt légitime",
              "12 mois",
            ],
            [
              "Dons",
              "Coordonnées du donateur, organisation partenaire",
              "Organiser la collecte et la remise du don",
              "Consentement et contrat",
              "3 ans",
            ],
          ],
        },
      },
      {
        id: "sources",
        title: "3. Comment nous obtenons ces données",
        bullets: [
          "Vous nous les fournissez directement lorsque vous créez un compte, publiez une annonce, commandez, écrivez au support ou signalez un problème.",
          "Elles sont générées automatiquement lorsque vous utilisez le Service : pages consultées, adresse IP, type d'appareil, journaux de sécurité et cookie de langue.",
          "Elles peuvent nous être transmises par nos prestataires de paiement ou de livraison pour confirmer une transaction, un remboursement ou une livraison.",
          "Nous ne collectons pas de données de carte bancaire complètes : elles sont saisies chez le prestataire de paiement agréé.",
        ],
      },
      {
        id: "finalites",
        title: "4. Pourquoi nous utilisons ces données",
        bullets: [
          "Fournir le Service : publier une annonce, afficher le catalogue, mettre en relation acheteur et vendeur.",
          "Exécuter les commandes : paiement, livraison, confirmation de réception et versement au vendeur.",
          "Prévenir la fraude, la contrefaçon et les comportements abusifs, et sécuriser les comptes.",
          "Résoudre les litiges et répondre aux demandes du support.",
          "Respecter nos obligations comptables, fiscales et légales.",
          "Améliorer le Service à partir de statistiques agrégées et anonymisées.",
          "Vous envoyer des messages opérationnels (confirmation, livraison, sécurité) ; les messages marketing ne sont envoyés qu'avec votre accord et peuvent être désactivés.",
        ],
      },
      {
        id: "cookies",
        title: "5. Cookies et stockage local",
        paragraphs: [
          "Nous utilisons uniquement des cookies et un stockage local strictement nécessaires au fonctionnement du Service : mémorisation de la langue et session d'authentification. Nous n'utilisons pas de cookies publicitaires ni de traceurs de réseaux sociaux.",
          "Le détail des cookies, leur durée et la manière de les gérer figurent dans notre politique de cookies.",
        ],
      },
      {
        id: "partage",
        title: "6. Partage des données",
        paragraphs: [
          "Nous ne vendons pas vos données personnelles et ne les transmettons à aucune association ni à aucun tiers à des fins commerciales. Nous ne les partageons qu'avec les prestataires strictement nécessaires au Service, dans la limite de ce qu'ils doivent savoir :",
        ],
        bullets: [
          "Supabase Inc. — base de données, authentification et stockage des photos ; hébergement des données de compte et d'annonce.",
          "Vercel Inc. — hébergement de l'application et diffusion du site ; données techniques et contenu servi.",
          "Le prestataire de paiement agréé retenu pour la Tunisie, dont le nom est affiché au moment du paiement ; montant, référence et coordonnées nécessaires à la transaction.",
          "First Delivery ou un transporteur partenaire — nom, téléphone et adresse de livraison, uniquement pour livrer le colis.",
          "Les autorités administratives ou judiciaires, lorsqu'une demande légale valable nous y oblige.",
          "Nos conseils juridiques, comptables ou techniques, sous obligation de confidentialité, lorsque cela est nécessaire.",
        ],
      },
      {
        id: "transferts",
        title: "7. Transferts internationaux",
        paragraphs: [
          "L'infrastructure d'EduRelay est hébergée en Europe. Vos données personnelles ne sont pas transférées en dehors de l'Espace économique européen, sauf pour le prestataire de paiement lorsque la transaction l'exige et sous garanties contractuelles appropriées.",
          "Aucun transfert vers un pays tiers n'est effectué à des fins commerciales ou de profilage.",
        ],
      },
      {
        id: "conservation",
        title: "8. Durée de conservation",
        paragraphs: [
          "Nous conservons vos données pendant la durée nécessaire aux finalités décrites ci-dessus. Les durées indicatives figurent dans le tableau de la section 2. Les pièces comptables et les justificatifs de transaction sont conservés 10 ans conformément aux obligations tunisiennes.",
          "Lorsque la conservation n'est plus justifiée, nous supprimons ou anonymisons les données. Les sauvegardes techniques peuvent contenir une copie résiduelle pendant une durée limitée avant rotation.",
        ],
      },
      {
        id: "securite",
        title: "9. Sécurité",
        paragraphs: [
          "Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables : chiffrement en transit (HTTPS/TLS), contrôle d'accès, politiques de sécurité au niveau des lignes (RLS) dans la base, séparation des environnements, sauvegardes et journalisation des accès sensibles.",
          "Aucun système n'est infaillible. Si une violation de données présente un risque pour vos droits, nous notifions l'INPDP et les personnes concernées dans les délais légaux, et nous publions une information claire sur l'incident.",
          `Pour signaler une vulnérabilité, utilisez ${security} et consultez notre page Sécurité.`,
        ],
      },
      {
        id: "droits",
        title: "10. Vos droits",
        paragraphs: [
          "Conformément à la loi tunisienne, vous disposez des droits suivants sur vos données personnelles :",
        ],
        bullets: [
          "Droit d'accès : obtenir une copie des données que nous détenons sur vous.",
          "Droit de rectification : corriger une donnée inexacte ou incomplète.",
          "Droit d'opposition : vous opposer à un traitement fondé sur notre intérêt légitime, notamment le marketing.",
          "Droit de suppression : demander l'effacement de vos données, sous réserve des obligations légales de conservation.",
          "Droit à la portabilité : recevoir vos données dans un format structuré et lisible par machine.",
          "Droit de retirer votre consentement à tout moment, sans affecter la licéité du traitement antérieur.",
        ],
      },
      {
        id: "exercer",
        title: "11. Exercer vos droits",
        paragraphs: [
          `Envoyez votre demande à ${support} avec l'objet « Données personnelles ». Nous pouvons demander une preuve d'identité raisonnable pour éviter qu'un tiers accède à votre compte. Nous répondons dans un délai de 30 jours, prolongeable si la demande est complexe.`,
          "Si vous estimez que votre demande n'a pas été traitée correctement, vous pouvez saisir l'Instance Nationale de Protection des Données Personnelles (INPDP), autorité tunisienne compétente.",
        ],
      },
      {
        id: "mineurs",
        title: "12. Protection des mineurs",
        paragraphs: [
          "Le Service est destiné aux personnes majeures. Nous ne créons pas volontairement de compte pour un mineur et ne collectons pas sciemment ses données. Si vous découvrez qu'un mineur a créé un compte, écrivez-nous : nous supprimerons les données concernées dans les meilleurs délais.",
          "Les photos publiées ne doivent pas permettre d'identifier un enfant (visage, uniforme nominatif, adresse, établissement). Les annonces qui exposent un mineur sont retirées.",
        ],
      },
      {
        id: "modifications",
        title: "13. Modifications de cette politique",
        paragraphs: [
          "Nous pouvons mettre à jour cette politique pour refléter un changement de service, de prestataire ou de loi. La date de mise à jour figure en haut de la page. En cas de changement important, nous vous informons par e-mail ou par un avis visible sur le site avant son application.",
        ],
      },
      {
        id: "contact",
        title: "14. Contact",
        paragraphs: [
          `Responsable du traitement : EduRelay, Tunis, Tunisie. Données personnelles : ${support}. Sécurité : ${security}.`,
        ],
      },
    ],
  },

  cookies: {
    slug: "cookies",
    title: "Politique de cookies",
    shortTitle: "Cookies",
    description:
      "Les cookies strictement nécessaires utilisés par EduRelay, leur durée et comment les gérer.",
    updated: UPDATED.fr,
    intro: [
      "Cette politique explique quels cookies et stockages locaux EduRelay utilise, pourquoi, et comment vous pouvez les contrôler. Elle complète notre politique de confidentialité.",
    ],
    sections: [
      {
        id: "definition",
        title: "1. Qu'est-ce qu'un cookie ?",
        paragraphs: [
          "Un cookie est un petit fichier déposé par un site sur votre appareil. Il permet de reconnaître votre navigateur, de conserver une préférence ou de maintenir une session. Le stockage local (localStorage, sessionStorage) fonctionne de manière similaire.",
        ],
      },
      {
        id: "essentiels",
        title: "2. Cookies strictement nécessaires",
        paragraphs: [
          "EduRelay fonctionne sans cookie publicitaire. Les cookies suivants sont indispensables : sans eux, la langue ou la connexion ne peuvent pas être conservées.",
        ],
        table: {
          headers: ["Nom", "Fournisseur", "Finalité", "Durée"],
          rows: [
            [
              "EDURELAY_LOCALE",
              "EduRelay",
              "Mémoriser la langue choisie (français ou arabe)",
              "1 an",
            ],
            [
              "sb-<référence>-auth-token (et cookies similaires)",
              "Supabase",
              "Maintenir la session d'authentification et la sécurité du compte",
              "Session, renouvelée à la connexion",
            ],
          ],
        },
      },
      {
        id: "mesure",
        title: "3. Mesure d'audience et publicité",
        paragraphs: [
          "Nous n'utilisons pas Google Analytics, pixel publicitaire, bouton social intégré ou autre traceur tiers. Les statistiques affichées sur la page d'accueil sont des compteurs agrégés calculés dans notre base de données, pas un profilage publicitaire.",
          "Si nous ajoutons un outil de mesure d'audience non essentiel, nous demanderons votre consentement avant tout dépôt et mettrons cette politique à jour.",
        ],
      },
      {
        id: "gestion",
        title: "4. Gérer les cookies",
        paragraphs: [
          "Vous pouvez supprimer ou bloquer les cookies depuis les paramètres de votre navigateur. Le blocage des cookies essentiels empêchera la connexion à votre compte et la mémorisation de la langue ; le reste du site restera consultable.",
          "La suppression du cookie de session vous déconnecte. La suppression du cookie de langue rétablit la langue par défaut ou celle de votre navigateur.",
        ],
      },
      {
        id: "consentement",
        title: "5. Consentement",
        paragraphs: [
          "Les cookies décrits ci-dessus sont strictement nécessaires : ils ne nécessitent pas de consentement préalable. Aucun cookie non essentiel n'est déposé aujourd'hui. Toute évolution donnera lieu à une bannière de choix claire, avec refus aussi simple que l'acceptation.",
        ],
      },
      {
        id: "contact",
        title: "6. Contact",
        paragraphs: [`Pour toute question sur les cookies, écrivez à ${support}.`],
      },
    ],
  },

  security: {
    slug: "security",
    title: "Sécurité et divulgation responsable",
    shortTitle: "Sécurité",
    description:
      "Comment signaler une vulnérabilité, ce que nous nous engageons à faire et les règles du test de bonne foi.",
    updated: UPDATED.fr,
    intro: [
      "La sécurité des comptes, des paiements et des données personnelles est une priorité. Si vous découvrez une vulnérabilité, nous vous remercions de nous la signaler de manière responsable avant toute divulgation publique.",
    ],
    sections: [
      {
        id: "engagement",
        title: "1. Notre engagement",
        paragraphs: [
          "Nous accuserons réception de votre signalement sous 72 heures ouvrées, nous vous tiendrons informé de l'analyse et nous corrigerons les vulnérabilités confirmées dans un délai raisonnable tenant compte de leur gravité.",
          "Nous ne poursuivrons pas un chercheur qui agit de bonne foi, dans le périmètre décrit ci-dessous, sans accéder aux données d'autrui et sans perturber le service.",
        ],
      },
      {
        id: "perimetre",
        title: "2. Périmètre",
        paragraphs: ["Sont concernés :"],
        bullets: [
          `le site ${site} et ses pages publiques ;`,
          "les interfaces de programmation (API) exposées par EduRelay ;",
          "les mécanismes d'authentification, de paiement et de livraison propres à EduRelay.",
        ],
      },
      {
        id: "exclusions",
        title: "3. Hors périmètre",
        bullets: [
          "les services de tiers (Supabase, Vercel, prestataire de paiement, transporteur), à signaler directement à leur éditeur ;",
          "les attaques par déni de service, le spam, le brute force massif ou l'ingénierie sociale ;",
          "les accès physiques, les vols de matériel et les tests sur des comptes dont vous n'êtes pas propriétaire ;",
          "les rapports générés automatiquement par un scanner sans preuve d'exploitabilité.",
        ],
      },
      {
        id: "signaler",
        title: "4. Comment signaler",
        paragraphs: [
          `Envoyez un e-mail à ${security} avec l'objet « Vulnérabilité ». Incluez si possible :`,
        ],
        bullets: [
          "la page ou l'endpoint concerné et l'URL exacte ;",
          "une description du comportement observé et du risque ;",
          "les étapes de reproduction, une preuve de concept minimale et les outils utilisés ;",
          "l'impact estimé et votre nom ou pseudo si vous souhaitez être crédité.",
        ],
      },
      {
        id: "regles",
        title: "5. Règles du test de bonne foi",
        bullets: [
          "N'accédez pas aux données d'un autre utilisateur et n'ouvrez pas de compte au nom d'autrui.",
          "Ne modifiez pas, ne supprimez pas et ne exfiltrez pas de données.",
          "Ne perturbez pas le service, les paiements ou les livraisons.",
          "Ne divulguez pas la vulnérabilité publiquement avant qu'un correctif soit disponible et que nous vous y ayons autorisé.",
          "Limitez vos tests au strict nécessaire pour démontrer le problème.",
        ],
      },
      {
        id: "divulgation",
        title: "6. Divulgation coordonnée",
        paragraphs: [
          "Nous vous proposons un délai de 90 jours entre le signalement et la divulgation publique, afin de corriger le problème et de prévenir les utilisateurs si nécessaire. Ce délai peut être raccourci d'un commun accord ou si la vulnérabilité est déjà exploitée.",
          "Nous n'offrons pas de récompense financière à ce stade. Nous créditons volontiers les chercheurs qui le souhaitent, avec leur accord.",
        ],
      },
      {
        id: "contact",
        title: "7. Contact",
        paragraphs: [`Sécurité : ${security}. Support général : ${support}.`],
      },
    ],
  },

  notice: {
    slug: "notice",
    title: "Mentions légales",
    shortTitle: "Mentions légales",
    description:
      "Éditeur du site, hébergement, propriété intellectuelle et signalement d'un contenu illicite.",
    updated: UPDATED.fr,
    intro: [
      "Les présentes mentions légales identifient l'éditeur du site et les prestataires techniques qui participent à sa mise en ligne, conformément aux usages et aux obligations applicables en Tunisie.",
    ],
    sections: [
      {
        id: "editeur",
        title: "1. Éditeur",
        paragraphs: [
          "Le site est édité par EduRelay, service de place de marché scolaire dont le siège est à Tunis, Tunisie.",
          `Contact : ${support}.`,
        ],
      },
      {
        id: "publication",
        title: "2. Responsable de publication",
        paragraphs: [
          `La responsabilité de la publication est assurée par EduRelay. Les demandes relatives au contenu éditorial peuvent être adressées à ${support}.`,
        ],
      },
      {
        id: "hebergement",
        title: "3. Hébergement",
        paragraphs: [
          "L'application et la base de données sont hébergées sur l'infrastructure d'EduRelay en Europe.",
          "Ces prestataires peuvent traiter des données techniques et du contenu dans le cadre de leurs services, avec les garanties décrites dans notre politique de confidentialité.",
        ],
      },
      {
        id: "propriete",
        title: "4. Propriété intellectuelle",
        paragraphs: [
          "Le nom EduRelay, le logo, l'interface, les textes, les éléments graphiques, le code source et la base de données sont la propriété exclusive d'EduRelay et de ses concédants. Tous droits réservés.",
          "Toute reproduction, représentation, adaptation ou exploitation, totale ou partielle, sans autorisation écrite préalable est interdite, sauf exceptions légales. Les marques et logos de tiers appartiennent à leurs propriétaires respectifs.",
        ],
      },
      {
        id: "signalement",
        title: "5. Signalement d'un contenu illicite",
        paragraphs: [
          `Si vous estimez qu'une annonce ou un contenu porte atteinte à vos droits, écrivez à ${support} en précisant l'URL, la nature du contenu, le droit concerné et, le cas échéant, une preuve de votre qualité.`,
          "Nous examinons les signalements et pouvons retirer le contenu, suspendre le compte concerné ou transmettre les éléments aux autorités compétentes. Une demande manifestement abusive peut être refusée.",
        ],
      },
      {
        id: "contact",
        title: "6. Contact",
        paragraphs: [`Support : ${support}. Sécurité : ${security}. Site : ${site}.`],
      },
    ],
  },
};

const ar: Record<LegalSlug, LegalDocument> = {
  terms: {
    slug: "terms",
    title: "الشروط العامة للاستخدام",
    shortTitle: "شروط الاستخدام",
    description: "القواعد التي تنظّم شراء وبيع والتبرع بالمستلزمات المدرسية على EduRelay.",
    updated: UPDATED.ar,
    intro: [
      `تنظّم هذه الشروط العامة للاستخدام («الشروط») الوصول إلى ${site} وإلى جميع الخدمات المعروضة عليه (مجتمعةً «الخدمة»). الخدمة منشورة ومدارة من EduRelay، تونس، تونس («EduRelay» أو «نحن»).`,
      "بإنشاء حساب أو نشر إعلان أو تقديم طلب أو استخدام الخدمة بأي طريقة أخرى، فإنك توافق على هذه الشروط وعلى سياسة الخصوصية الخاصة بنا. إذا لم توافق، فلا تستخدم الخدمة.",
    ],
    sections: [
      {
        id: "objet",
        title: "1. موضوع الخدمة",
        paragraphs: [
          "EduRelay سوق إلكتروني تونسي مخصص للمستلزمات المدرسية المستعملة والكتب المدرسية والزي المدرسي والأدوات التعليمية. تتيح الخدمة للأفراد والعائلات والمكتبات والمدارس والجمعيات نشر هذه المواد وبيعها أو شراؤها أو التبرع بها.",
          "قد تقدّم الخدمة أيضاً ميزات التبرع لفائدة جمعيات شريكة، وتتبع التوصيل، وآلية دفع محمية. تُوصف هذه الميزات عند استخدامها وقد تتطور.",
        ],
      },
      {
        id: "definitions",
        title: "2. التعريفات",
        bullets: [
          "«إعلان»: البطاقة التي ينشئها البائع لعرض مادة ما وحالتها وسعرها وصورها.",
          "«مشترٍ»: كل شخص يطلب مادة عبر الخدمة.",
          "«بائع»: كل شخص ينشر إعلاناً أو يعرض مادة.",
          "«محتوى»: النصوص والصور والأوصاف والرسائل وأي عنصر آخر ينشره مستخدم.",
          "«طلب»: قبول المشتري لإعلان، مثبت داخل الخدمة.",
          "«مبلغ محمي»: المبلغ الذي يحصّله EduRelay أو مزوّد الدفع التابع له ويحتفظ به إلى نهاية مهلة التأكيد.",
        ],
      },
      {
        id: "compte",
        title: "3. الحساب والأهلية",
        paragraphs: [
          "يجب أن يكون عمرك 18 سنة على الأقل وأن تتمتع بالأهلية القانونية لإبرام عقد لاستخدام الخدمة. لا يجوز للقاصرين إنشاء حساب؛ يمكن لولي الأمر استخدام الخدمة لاحتياجات الأسرة.",
          `تلتزم بتقديم معلومات صحيحة وكاملة ومحدّثة، وبإنشاء حساب شخصي واحد فقط، وبعدم مشاركة بيانات الدخول. أنت مسؤول عن أي نشاط يتم من حسابك. أبلغنا فوراً على ${support} إذا اعتقدت أن حسابك قد اختُرق.`,
          "قد نطلب التحقق من الهوية أو الهاتف أو العنوان عندما يقتضي القانون ذلك أو عند الحاجة لمنع الاحتيال. يمكن رفض الحساب أو تعليقه إذا لم تسمح المعلومات المقدمة بهذا التحقق.",
        ],
      },
      {
        id: "role",
        title: "4. دور EduRelay",
        paragraphs: [
          "يُقرب EduRelay بين المشترين والبائعين. ما لم يُذكر خلاف ذلك صراحةً في صفحة المنتج، فإن EduRelay ليس البائع ولا يملك المواد وليس طرفاً في عقد البيع المبرم بين المشتري والبائع.",
          "البائع وحده مسؤول عن المادة التي يعرضها وعن حالتها ومطابقتها ومصدرها وصحة إعلانه. المشتري مسؤول عن قراءة الإعلان والتحقق من المادة عند الاستلام.",
          "يمكن لـ EduRelay مراجعة إعلان أو إزالته أو رفضه، وتعليق معاملة عندما تشكل خطر احتيال أو تقليداً أو خطراً أو مخالفة لهذه الشروط. المراجعة ليست ضماناً للجودة ولا فحصاً مادياً لكل مادة.",
        ],
      },
      {
        id: "annonces",
        title: "5. الإعلانات والمحتوى",
        paragraphs: [
          "يجب أن يصف كل إعلان مادة حقيقية ومتاحة تملكها أو تملك حق بيعها أو التبرع بها. يجب أن تكون الصور حديثة وتمثل المادة الحقيقية؛ ويُحظر استخدام صور الكتالوج أو صور بائع آخر.",
          "تمنح EduRelay ترخيصاً عالمياً غير حصري ومجانياً لاستضافة محتواك وإعادة إنتاجه وتغيير حجمه وعرضه وتوزيعه في إطار تشغيل الخدمة والترويج لها وتأمينها. ينتهي هذا الترخيص عند حذف المحتوى، مع مراعاة النسخ الاحتياطية التقنية وواجبات الحفظ القانونية.",
          "تضمن امتلاكك جميع الحقوق اللازمة على محتواك وأنه لا ينتهك حقوق طرف ثالث. يمكننا إزالة أي محتوى بناءً على إبلاغ مسبب أو تلقائياً إذا بدا غير قانوني.",
        ],
      },
      {
        id: "prix",
        title: "6. الأسعار والرسوم والدفع",
        paragraphs: [
          "تُعرض الأسعار بالدينار التونسي (TND)، شاملة الضرائب عند انطباقها. يُعرض سعر المادة وتكاليف التوصيل قبل تأكيد الطلب. لا تُضاف أي رسوم خفية بعد تأكيدك.",
          "ما لم يُذكر خلاف ذلك عند النشر، يحتفظ EduRelay بعمولة قدرها 10% من المجموع الفرعي للمادة. تُقابل هذه العمولة الخدمة ولا تُستحق إلا على بيع أُبرم فعلاً. لا يوجد اشتراك إلزامي.",
          "يمكن الدفع إلكترونياً عبر مزوّد دفع معتمد، أو نقداً عند التوصيل عندما يُعرض هذا الخيار. يُعرض اسم المزوّد النشط ووسائل الدفع المقبولة عند الدفع. لا يخزّن EduRelay أبداً رقم البطاقة البنكية الكامل؛ تُعالج بيانات البطاقة مباشرةً من قبل المزوّد.",
          "عند استخدام الدفع المحمي، يُحتفظ بالمبلغ لمدة 48 ساعة بعد التوصيل. إذا لم يؤكد المشتري الاستلام ولم يفتح نزاعاً خلال هذه المهلة، يُدفع للبائع تلقائياً، مع مراعاة ضوابط الأمان والواجبات القانونية.",
          "في حالة الدفع نقداً عند التوصيل، يحصّل الناقل المبلغ ويحوّله وفق جدوله الخاص. يمكن لـ EduRelay تعليق أي تحويل في حالة نزاع أو استرداد أو اشتباه في احتيال.",
        ],
      },
      {
        id: "livraison",
        title: "7. التوصيل والاستلام",
        paragraphs: [
          "تُعرض خيارات التوصيل والمدد التقديرية والتكاليف قبل الطلب. المدد تقديرية وقد تختلف حسب الولاية والناقل والظروف المحلية.",
          "يجب تقديم عنوان ورقم هاتف صحيحين. يتحمل الناقل أو البائع خطر الفقدان أو التلف أثناء النقل وفق القواعد المعمول بها؛ ويساعدك EduRelay على فتح نزاع وتوثيق المشكلة.",
          "عند الاستلام، افحص المادة خلال مدة معقولة. يجب فتح شكوى بشأن مادة ناقصة أو غير مطابقة أو تالفة قبل نهاية مهلة التأكيد البالغة 48 ساعة، مع صور ووصف واضح.",
        ],
      },
      {
        id: "retours",
        title: "8. الإلغاء والإرجاع والنزاعات",
        paragraphs: [
          "يمكن إلغاء الطلب قبل الشحن عندما لا يكون البائع أو الناقل قد تسلّم المادة بعد. بعد الشحن، يعتمد الإلغاء على اتفاق الطرفين وقواعد الناقل.",
          "تُباع المواد المستعملة في الحالة الموصوفة. ما لم يوجد عيب خفي أو وصف مضلل، فإن العيوب الظاهرة المذكورة في الإعلان لا تبرر الإرجاع. تبقى حقوق المستهلك الآمرة المنصوص عليها في القانون التونسي سارية.",
          "في حالة نزاع، يُدعى الطرفان إلى تبادل الأدلة داخل الخدمة. يمكن لـ EduRelay فحص الصور والرسائل وتتبع التوصيل، ثم اقتراح حل (استرداد كلي أو جزئي، إرجاع، دفع للبائع). يُتخذ هذا القرار بحسن نية ولا يحرم الطرفين من حقهما في اللجوء إلى الجهة القضائية المختصة.",
        ],
      },
      {
        id: "dons",
        title: "9. التبرعات والجمعيات الشريكة",
        paragraphs: [
          "قد تتيح الخدمة التبرع بمادة لجمعية شريكة، لا سيما في فترة العودة المدرسية. التبرع مجاني: لا يُستحق أي ثمن عن المادة المتبرع بها. تُعرض تكاليف النقل المحتملة قبل التأكيد.",
          "الجمعيات الشريكة مسؤولة عن قبول التبرعات وتوزيعها ومتابعتها. لا يضمن EduRelay تسليم التبرع إلى مستفيد محدد ولا يصدر إيصالاً ضريبياً إلا إذا ذُكر ذلك صراحةً.",
        ],
      },
      {
        id: "interdits",
        title: "10. السلوك المحظور",
        paragraphs: ["يُحظر استخدام الخدمة من أجل:"],
        bullets: [
          "بيع أو التبرع بمادة غير قانونية أو مسروقة أو مقلدة أو منسوخة أو خطرة، بما في ذلك الكتب المنسوخة، والملخصات غير المصرح بها، والأسلحة، والمواد الكيميائية الخطرة، والأدوية، والكحول، والتبغ؛",
          "نشر بيانات شخصية لطرف ثالث، وخاصة قاصر، دون إذن؛",
          "انتحال شخصية شخص أو مدرسة أو علامة تجارية، أو إنشاء إعلان مضلل؛",
          "التحايل على الدفع أو العمولة أو نظام النزاعات باقتراح معاملة خارج المنصة؛",
          "مضايقة مستخدم آخر أو تهديده أو التمييز ضده أو خداعه؛",
          "إدخال فيروس، أو أتمتة استخراج البيانات، أو تجاوز تدابير الأمان، أو تعطيل الخدمة؛",
          "استخدام الخدمة في تبييض الأموال أو الاحتيال أو التمويل غير القانوني.",
        ],
      },
      {
        id: "propriete",
        title: "11. الملكية الفكرية",
        paragraphs: [
          "اسم EduRelay والشعار والواجهة والرمز النصي والنصوص والرسومات وقاعدة البيانات محمية بحقوق الملكية الفكرية لـ EduRelay أو الجهات المرخّصة لها. لا يُنقل إليك أي حق خارج الترخيص المحدود لاستخدام الخدمة وفق هذه الشروط.",
          "لا يجوز نسخ أو تعديل أو توزيع أو بيع أو تأجير أو فك جزء من الخدمة أو استغلاله دون إذن كتابي مسبق، باستثناء الاستثناءات القانونية الآمرة.",
          "إذا أرسلت إلينا اقتراحاً أو ملاحظة، فإنك تأذن لنا باستخدامه بحرية ومجاناً لتحسين الخدمة، دون التزام بمقابل أو سرية.",
        ],
      },
      {
        id: "suspension",
        title: "12. التعليق والإنهاء",
        paragraphs: [
          `يمكنك إغلاق حسابك في أي وقت من الإعدادات أو بالكتابة إلى ${support}. لا يلغي الإغلاق الالتزامات المتعلقة بالطلبات الجارية أو النزاعات المفتوحة أو المستندات المحاسبية التي يجب حفظها.`,
          "يمكننا تعليق وصولك أو إنهاؤه، أو إزالة إعلان، أو إلغاء طلب في حالة مخالفة الشروط أو الاحتيال أو الخطر على مستخدم أو التقليد أو السلوك غير القانوني أو الالتزام القانوني. وحيثما تسمح الحالة، نبلغك بالسبب وبإمكانية الاعتراض.",
        ],
      },
      {
        id: "garanties",
        title: "13. الضمانات وحدود المسؤولية",
        paragraphs: [
          "تُقدّم الخدمة «كما هي» و«حسب التوفر». لا نضمن أن تكون الخدمة متواصلة أو خالية من الأخطاء أو آمنة باستمرار أو متاحة من جميع الأجهزة. المواد يعرضها بائعون مستقلون ولا يضمنها EduRelay خارج ما يقتضيه القانون.",
          "في الحدود التي يسمح بها القانون التونسي، لا يتحمل EduRelay مسؤولية الأضرار غير المباشرة أو المعنوية أو التبعية، بما في ذلك فقدان الأرباح أو البيانات أو العملاء أو السمعة، حتى لو أُبلغ باحتمالها.",
          "في الحدود التي يسمح بها القانون، لا تتجاوز المسؤولية الإجمالية لـ EduRelay عن جميع المطالبات المتعلقة بالخدمة المبلغ الإجمالي الذي دفعته لنا خلال الأشهر الاثني عشر السابقة للمطالبة، أو 100 دينار تونسي إذا كان هذا المبلغ أقل. لا ينطبق هذا الحد في حالة الخطأ الجسيم أو الغش أو الاعتداء على الحياة أو السلامة الجسدية، ولا في الحالات التي يحظر فيها القانون هذا الحد.",
        ],
      },
      {
        id: "indemnisation",
        title: "14. التعويض",
        paragraphs: [
          "توافق على الدفاع عن EduRelay ومسؤوليه وموظفيه وشركائه وتعويضهم وإبراء ذمتهم من أي مطالبة أو خسارة أو مسؤولية أو غرامة أو مصاريف (بما في ذلك أتعاب المحاماة المعقولة) تنشأ عن محتواك أو إعلاناتك أو استخدامك للخدمة أو مخالفتك لهذه الشروط أو حقوق طرف ثالث.",
        ],
      },
      {
        id: "force",
        title: "15. القوة القاهرة",
        paragraphs: [
          "لا يتحمل EduRelay مسؤولية أي تأخير أو عدم تنفيذ ناتج عن حدث خارج عن سيطرته المعقولة، بما في ذلك انقطاع الإنترنت أو الكهرباء، أو هجوم إلكتروني كبير، أو عطل مزوّد دفع أو توصيل، أو كارثة طبيعية، أو إضراب، أو قرار إداري، أو نزاع مسلح.",
        ],
      },
      {
        id: "droit",
        title: "16. القانون الواجب التطبيق والنزاعات",
        paragraphs: [
          "تخضع هذه الشروط للقانون التونسي، دون الإخلال بالقواعد الآمرة لحماية المستهلك التي قد تنطبق في بلد إقامتك.",
          `في حالة خلاف، ندعوك إلى الكتابة إلينا على ${support} ومحاولة حل ودي لمدة 30 يوماً على الأقل. في حال عدم الاتفاق، تختص محاكم تونس، ما لم يوجد نص قانوني آمر يخالف ذلك.`,
        ],
      },
      {
        id: "modifications",
        title: "17. التعديلات",
        paragraphs: [
          "يمكننا تعديل هذه الشروط لتعكس تطور الخدمة أو القانون أو ممارساتنا. تُعلن التغييرات المهمة على الموقع أو بالبريد الإلكتروني قبل 15 يوماً على الأقل من دخولها حيز التنفيذ، إلا في حالة الاستعجال أو الالتزام القانوني.",
          "بمواصلتك استخدام الخدمة بعد دخولها حيز التنفيذ، فإنك تقبل الشروط الجديدة. إذا رفضت، يمكنك إغلاق حسابك قبل تاريخ التطبيق.",
        ],
      },
      {
        id: "divers",
        title: "18. أحكام عامة",
        paragraphs: [
          "إذا اعتُبر بند ما باطلاً أو غير قابل للتطبيق، تبقى البنود الأخرى سارية. عدم ممارسة حق لا يعني التنازل عنه. تشكل هذه الشروط وسياسة الخصوصية والمستندات المدمجة فيها الاتفاق الكامل بينك وبين EduRelay.",
          "لا يجوز لك التنازل عن حقوقك أو التزاماتك دون موافقتنا الكتابية. يمكننا التنازل عن حقوقنا في حالة إعادة هيكلة أو اندماج أو بيع نشاط، مع الحفاظ على حماية بياناتك.",
          "للنسختين الفرنسية والعربية القيمة نفسها. في حالة اختلاف التفسير، تُرجّح النسخة الفرنسية، ما لم يوجد نص آمر يخالف ذلك.",
        ],
      },
      {
        id: "contact",
        title: "19. الاتصال",
        paragraphs: [
          `لأي سؤال حول هذه الشروط، اكتب إلى ${support}. للإبلاغ الأمني، استخدم ${security}.`,
        ],
      },
    ],
  },

  privacy: {
    slug: "privacy",
    title: "سياسة الخصوصية",
    shortTitle: "الخصوصية",
    description:
      "ما هي البيانات الشخصية التي يجمعها EduRelay، ولماذا، ومع من تُشارك، وكيف تمارس حقوقك.",
    updated: UPDATED.ar,
    intro: [
      `EduRelay، تونس، تونس، هي المسؤولة عن معالجة البيانات الشخصية الموصوفة في هذه السياسة، والمستخدمة على ${site} وفي الخدمات المرتبطة بها.`,
      "نطبّق القانون التونسي الأساسي عدد 2004-63 المتعلق بحماية البيانات الشخصية، وعندما ينطبق النظام الأوروبي العام لحماية البيانات (RGPD)، نطبّق مبادئه في التقليل من البيانات وتحديد الغرض والأمان. تشرح هذه السياسة ما نقوم به فعلياً.",
    ],
    sections: [
      {
        id: "responsable",
        title: "1. المسؤول عن المعالجة",
        paragraphs: [
          `المسؤول عن المعالجة هو EduRelay، ومقرها تونس، تونس. لأي سؤال أو طلب يتعلق ببياناتك، اكتب إلى ${support} بعنوان «البيانات الشخصية».`,
          "يجيب مسؤول حماية البيانات عن طلبات الوصول والتصحيح والحذف، وينسّق أيضاً تدابير الأمان والإبلاغ الإلزامي.",
        ],
      },
      {
        id: "donnees",
        title: "2. البيانات التي نجمعها",
        paragraphs: [
          "نجمع فقط البيانات اللازمة لتشغيل السوق وتأمين المعاملات والوفاء بالتزاماتنا القانونية. يلخّص الجدول التالي الفئات وأغراضها ومدة حفظها.",
        ],
        table: {
          headers: ["الفئة", "أمثلة", "الغرض", "الأساس القانوني", "الحفظ"],
          rows: [
            [
              "الحساب",
              "الاسم، البريد الإلكتروني، الهاتف، كلمة المرور المشفرة",
              "إنشاء الحساب والتحقق منه وتأمينه",
              "العقد",
              "مدة الحساب + 12 شهراً",
            ],
            [
              "الملف الشخصي",
              "الاسم المستعار، الولاية، المدرسة، الصورة، النبذة، اللغة",
              "عرض ملف البائع وتكييف اللغة",
              "العقد",
              "مدة الحساب",
            ],
            [
              "الإعلانات",
              "العناوين، الأوصاف، الصور، الحالة، السعر",
              "نشر الإعلانات ومراجعتها وعرضها",
              "العقد",
              "حتى الحذف + 12 شهراً",
            ],
            [
              "الطلبات",
              "المواد، المبالغ، العناوين، الحالة، النزاعات",
              "تنفيذ البيع والتوصيل والاسترداد",
              "العقد والالتزام القانوني",
              "10 سنوات للمستندات المحاسبية",
            ],
            [
              "الدفع",
              "مرجع المعاملة، الحالة، المبلغ",
              "التحصيل والاسترداد ومكافحة الاحتيال",
              "العقد والالتزام القانوني",
              "10 سنوات",
            ],
            [
              "التوصيل",
              "الاسم، الهاتف، العنوان، التتبع",
              "تسليم الطرد ومعالجة الحوادث",
              "العقد",
              "3 سنوات بعد التوصيل",
            ],
            [
              "الدعم والنزاعات",
              "الرسائل، الصور، الأدلة",
              "الرد على الطلبات وحل النزاعات",
              "العقد والمصلحة المشروعة",
              "3 سنوات بعد الإغلاق",
            ],
            [
              "تقنية",
              "عنوان IP، الجهاز، السجلات، ملفات الارتباط",
              "الأمان واللغة ومنع الاحتيال",
              "المصلحة المشروعة",
              "12 شهراً",
            ],
            [
              "التبرعات",
              "بيانات المتبرع، الجمعية الشريكة",
              "تنظيم جمع التبرع وتسليمه",
              "الموافقة والعقد",
              "3 سنوات",
            ],
          ],
        },
      },
      {
        id: "sources",
        title: "3. كيف نحصل على هذه البيانات",
        bullets: [
          "تقدّمها لنا مباشرة عند إنشاء حساب أو نشر إعلان أو تقديم طلب أو مراسلة الدعم أو الإبلاغ عن مشكلة.",
          "تُنشأ تلقائياً عند استخدام الخدمة: الصفحات التي تزورها، عنوان IP، نوع الجهاز، سجلات الأمان وملف الارتباط الخاص باللغة.",
          "قد تصلنا من مزوّدي الدفع أو التوصيل لتأكيد معاملة أو استرداد أو توصيل.",
          "لا نجمع بيانات البطاقة البنكية الكاملة: تُدخل لدى مزوّد الدفع المعتمد.",
        ],
      },
      {
        id: "finalites",
        title: "4. لماذا نستخدم هذه البيانات",
        bullets: [
          "تقديم الخدمة: نشر إعلان، عرض الكتالوج، الربط بين المشتري والبائع.",
          "تنفيذ الطلبات: الدفع، التوصيل، تأكيد الاستلام والدفع للبائع.",
          "منع الاحتيال والتقليد والسلوك المسيء، وتأمين الحسابات.",
          "حل النزاعات والرد على طلبات الدعم.",
          "الوفاء بالالتزامات المحاسبية والضريبية والقانونية.",
          "تحسين الخدمة انطلاقاً من إحصاءات مجمّعة ومجهولة الهوية.",
          "إرسال رسائل تشغيلية (تأكيد، توصيل، أمان)؛ ولا تُرسل الرسائل التسويقية إلا بموافقتك ويمكن تعطيلها.",
        ],
      },
      {
        id: "cookies",
        title: "5. ملفات الارتباط والتخزين المحلي",
        paragraphs: [
          "نستخدم فقط ملفات ارتباط وتخزيناً محلياً ضروريين لتشغيل الخدمة: حفظ اللغة وجلسة المصادقة. لا نستخدم ملفات ارتباط إعلانية ولا أدوات تتبع لشبكات اجتماعية.",
          "يرد تفصيل ملفات الارتباط ومدتها وطريقة إدارتها في سياسة ملفات الارتباط.",
        ],
      },
      {
        id: "partage",
        title: "6. مشاركة البيانات",
        paragraphs: [
          "لا نبيع بياناتك الشخصية ولا ننقلها إلى أي جمعية أو طرف ثالث لأغراض تجارية. لا نشاركها إلا مع المزوّدين الضروريين للخدمة، في حدود ما يحتاجون معرفته:",
        ],
        bullets: [
          "Supabase Inc. — قاعدة البيانات والمصادقة وتخزين الصور؛ استضافة بيانات الحساب والإعلان.",
          "Vercel Inc. — استضافة التطبيق وبث الموقع؛ البيانات التقنية والمحتوى المعروض.",
          "مزوّد الدفع المعتمد في تونس، ويُعرض اسمه عند الدفع؛ المبلغ والمرجع والبيانات اللازمة للمعاملة.",
          "First Delivery أو ناقل شريك — الاسم والهاتف وعنوان التوصيل فقط لتسليم الطرد.",
          "السلطات الإدارية أو القضائية عند وجود طلب قانوني صحيح يلزمنا بذلك.",
          "مستشارونا القانونيون أو المحاسبون أو التقنيون، تحت واجب السرية، عند الحاجة.",
        ],
      },
      {
        id: "transferts",
        title: "7. النقل الدولي",
        paragraphs: [
          "تُستضاف بنية EduRelay التحتية في أوروبا. لا تُنقل بياناتك الشخصية خارج المنطقة الاقتصادية الأوروبية، إلا لمزوّد الدفع عندما تتطلب المعاملة ذلك وتحت ضمانات تعاقدية مناسبة.",
          "لا يتم أي نقل إلى دولة ثالثة لأغراض تجارية أو إنشاء ملفات تعريف.",
        ],
      },
      {
        id: "conservation",
        title: "8. مدة الحفظ",
        paragraphs: [
          "نحفظ بياناتك للمدة اللازمة للأغراض المذكورة أعلاه. ترد المدد الإرشادية في جدول القسم 2. تُحفظ المستندات المحاسبية وإثباتات المعاملات 10 سنوات وفق الالتزامات التونسية.",
          "عندما لا يعود الحفظ مبرراً، نحذف البيانات أو نجعلها مجهولة الهوية. قد تحتوي النسخ الاحتياطية التقنية على نسخة متبقية لمدة محدودة قبل استبدالها.",
        ],
      },
      {
        id: "securite",
        title: "9. الأمان",
        paragraphs: [
          "نطبّق تدابير تقنية وتنظيمية معقولة: التشفير أثناء النقل (HTTPS/TLS)، وضبط الوصول، وسياسات الأمان على مستوى الصفوف (RLS) في قاعدة البيانات، وفصل البيئات، والنسخ الاحتياطي، وتسجيل الوصول إلى البيانات الحساسة.",
          "لا يوجد نظام محصّن تماماً. إذا شكل خرق البيانات خطراً على حقوقك، نبلغ الهيئة الوطنية والأشخاص المعنيين ضمن المدد القانونية، وننشر معلومات واضحة عن الحادث.",
          `للإبلاغ عن ثغرة، استخدم ${security} واطّلع على صفحة الأمان.`,
        ],
      },
      {
        id: "droits",
        title: "10. حقوقك",
        paragraphs: ["وفقاً للقانون التونسي، تتمتع بالحقوق التالية بشأن بياناتك الشخصية:"],
        bullets: [
          "حق الوصول: الحصول على نسخة من البيانات التي نحتفظ بها عنك.",
          "حق التصحيح: تصحيح بيانات غير دقيقة أو ناقصة.",
          "حق الاعتراض: الاعتراض على معالجة قائمة على مصلحتنا المشروعة، وخاصة التسويق.",
          "حق الحذف: طلب محو بياناتك، مع مراعاة واجبات الحفظ القانونية.",
          "حق قابلية النقل: استلام بياناتك بتنسيق منظم وقابل للقراءة آلياً.",
          "حق سحب الموافقة في أي وقت، دون التأثير على مشروعية المعالجة السابقة.",
        ],
      },
      {
        id: "exercer",
        title: "11. ممارسة حقوقك",
        paragraphs: [
          `أرسل طلبك إلى ${support} بعنوان «البيانات الشخصية». قد نطلب إثبات هوية معقولاً لمنع وصول طرف ثالث إلى حسابك. نرد خلال 30 يوماً، ويمكن تمديدها إذا كان الطلب معقداً.`,
          "إذا اعتبرت أن طلبك لم يُعالج بشكل صحيح، يمكنك اللجوء إلى الهيئة الوطنية لحماية البيانات الشخصية (INPDP)، وهي الجهة التونسية المختصة.",
        ],
      },
      {
        id: "mineurs",
        title: "12. حماية القاصرين",
        paragraphs: [
          "الخدمة موجهة للأشخاص البالغين. لا ننشئ عمداً حسابات للقاصرين ولا نجمع بياناتهم عن علم. إذا اكتشفت أن قاصراً أنشأ حساباً، اكتب إلينا وسنحذف البيانات المعنية في أقرب وقت.",
          "يجب ألا تسمح الصور المنشورة بتحديد هوية طفل (الوجه، الزي المدرسي الاسمي، العنوان، المؤسسة). تُزال الإعلانات التي تكشف قاصراً.",
        ],
      },
      {
        id: "modifications",
        title: "13. تعديلات هذه السياسة",
        paragraphs: [
          "يمكننا تحديث هذه السياسة لتعكس تغيراً في الخدمة أو المزوّد أو القانون. يظهر تاريخ التحديث أعلى الصفحة. في حالة تغيير مهم، نبلغك بالبريد الإلكتروني أو بإشعار ظاهر على الموقع قبل تطبيقه.",
        ],
      },
      {
        id: "contact",
        title: "14. الاتصال",
        paragraphs: [
          `المسؤول عن المعالجة: EduRelay، تونس، تونس. البيانات الشخصية: ${support}. الأمان: ${security}.`,
        ],
      },
    ],
  },

  cookies: {
    slug: "cookies",
    title: "سياسة ملفات الارتباط",
    shortTitle: "ملفات الارتباط",
    description: "ملفات الارتباط الضرورية التي يستخدمها EduRelay، ومدتها، وكيفية إدارتها.",
    updated: UPDATED.ar,
    intro: [
      "تشرح هذه السياسة ملفات الارتباط والتخزين المحلي التي يستخدمها EduRelay، ولماذا، وكيف يمكنك التحكم فيها. وتكمل سياسة الخصوصية.",
    ],
    sections: [
      {
        id: "definition",
        title: "1. ما هو ملف الارتباط؟",
        paragraphs: [
          "ملف الارتباط هو ملف صغير يضعه موقع على جهازك. يتيح التعرف على متصفحك أو حفظ تفضيل أو الحفاظ على جلسة. يعمل التخزين المحلي (localStorage وsessionStorage) بطريقة مشابهة.",
        ],
      },
      {
        id: "essentiels",
        title: "2. ملفات الارتباط الضرورية",
        paragraphs: [
          "يعمل EduRelay دون ملفات ارتباط إعلانية. الملفات التالية ضرورية: بدونها لا يمكن حفظ اللغة أو جلسة الدخول.",
        ],
        table: {
          headers: ["الاسم", "المزوّد", "الغرض", "المدة"],
          rows: [
            [
              "EDURELAY_LOCALE",
              "EduRelay",
              "حفظ اللغة المختارة (الفرنسية أو العربية)",
              "سنة واحدة",
            ],
            [
              "sb-<المرجع>-auth-token (وملفات مشابهة)",
              "Supabase",
              "الحفاظ على جلسة المصادقة وأمان الحساب",
              "الجلسة، وتُجدّد عند الدخول",
            ],
          ],
        },
      },
      {
        id: "mesure",
        title: "3. قياس الجمهور والإعلانات",
        paragraphs: [
          "لا نستخدم Google Analytics أو بكسل إعلاني أو زر شبكة اجتماعية مدمج أو أي أداة تتبع تابعة لطرف ثالث. الإحصاءات المعروضة في الصفحة الرئيسية هي عدادات مجمّعة تُحسب في قاعدة بياناتنا، وليست تتبعاً إعلانياً.",
          "إذا أضفنا أداة قياس جمهور غير ضرورية، فسنطلب موافقتك قبل أي تثبيت ونحدّث هذه السياسة.",
        ],
      },
      {
        id: "gestion",
        title: "4. إدارة ملفات الارتباط",
        paragraphs: [
          "يمكنك حذف ملفات الارتباط أو حظرها من إعدادات متصفحك. حظر الملفات الضرورية سيمنع الدخول إلى حسابك وحفظ اللغة؛ ويبقى بقية الموقع قابلاً للتصفح.",
          "حذف ملف جلسة الدخول يسجّل خروجك. حذف ملف اللغة يعيد اللغة الافتراضية أو لغة متصفحك.",
        ],
      },
      {
        id: "consentement",
        title: "5. الموافقة",
        paragraphs: [
          "الملفات الموصوفة أعلاه ضرورية للغاية: لا تتطلب موافقة مسبقة. لا يُثبّت أي ملف غير ضروري حالياً. أي تطور سيؤدي إلى لافتة اختيار واضحة، مع رفض بسيط مثل القبول.",
        ],
      },
      {
        id: "contact",
        title: "6. الاتصال",
        paragraphs: [`لأي سؤال حول ملفات الارتباط، اكتب إلى ${support}.`],
      },
    ],
  },

  security: {
    slug: "security",
    title: "الأمان والإبلاغ المسؤول",
    shortTitle: "الأمان",
    description: "كيف تبلغ عن ثغرة، وما نتعهد به، وقواعد الاختبار بحسن نية.",
    updated: UPDATED.ar,
    intro: [
      "أمان الحسابات والمدفوعات والبيانات الشخصية أولوية. إذا اكتشفت ثغرة، نشكرك على إبلاغنا بها بمسؤولية قبل أي إفصاح علني.",
    ],
    sections: [
      {
        id: "engagement",
        title: "1. التزامنا",
        paragraphs: [
          "سنؤكد استلام إبلاغك خلال 72 ساعة عمل، وسنُبقيك على اطلاع بالتحليل، وسنصلح الثغرات المؤكدة في مدة معقولة تراعي خطورتها.",
          "لن نقاضي باحثاً يتصرف بحسن نية، ضمن النطاق الموصوف أدناه، دون الوصول إلى بيانات الآخرين ودون تعطيل الخدمة.",
        ],
      },
      {
        id: "perimetre",
        title: "2. النطاق",
        paragraphs: ["يشمل النطاق:"],
        bullets: [
          `موقع ${site} وصفحاته العامة؛`,
          "واجهات البرمجة (API) التي يعرضها EduRelay؛",
          "آليات المصادقة والدفع والتوصيل الخاصة بـ EduRelay.",
        ],
      },
      {
        id: "exclusions",
        title: "3. خارج النطاق",
        bullets: [
          "خدمات الأطراف الثالثة (Supabase وVercel ومزوّد الدفع والناقل)، ويجب الإبلاغ عنها مباشرةً لمزوّدها؛",
          "هجمات حجب الخدمة، والبريد المزعج، والتخمين المكثف، والهندسة الاجتماعية؛",
          "الوصول المادي وسرقة الأجهزة والاختبار على حسابات لا تملكها؛",
          "التقارير التي تُنتجها أدوات الفحص آلياً دون دليل على قابلية الاستغلال.",
        ],
      },
      {
        id: "signaler",
        title: "4. كيف تبلغ",
        paragraphs: [`أرسل بريداً إلى ${security} بعنوان «ثغرة». ضمّن إن أمكن:`],
        bullets: [
          "الصفحة أو نقطة النهاية المعنية والعنوان الدقيق؛",
          "وصف السلوك الملاحظ والخطر؛",
          "خطوات إعادة الإنتاج ودليل مفهوم بسيط والأدوات المستخدمة؛",
          "تقييم الأثر واسمك أو لقبك إذا رغبت في ذكرك.",
        ],
      },
      {
        id: "regles",
        title: "5. قواعد الاختبار بحسن نية",
        bullets: [
          "لا تصل إلى بيانات مستخدم آخر ولا تفتح حساباً باسم شخص آخر.",
          "لا تعدّل بيانات أو تحذفها أو تستخرجها.",
          "لا تعطّل الخدمة أو المدفوعات أو التوصيل.",
          "لا تفصح عن الثغرة علناً قبل توفر إصلاح وحصولك على إذن منا.",
          "اقصر اختباراتك على الحد الأدنى اللازم لإثبات المشكلة.",
        ],
      },
      {
        id: "divulgation",
        title: "6. الإفصاح المنسّق",
        paragraphs: [
          "نقترح مهلة 90 يوماً بين الإبلاغ والإفصاح العلني، لإصلاح المشكلة وتحذير المستخدمين عند الحاجة. يمكن تقصير المهلة باتفاق مشترك أو إذا كانت الثغرة مستغلة بالفعل.",
          "لا نقدّم مكافأة مالية في هذه المرحلة. نذكر الباحثين الذين يرغبون بموافقتهم.",
        ],
      },
      {
        id: "contact",
        title: "7. الاتصال",
        paragraphs: [`الأمان: ${security}. الدعم العام: ${support}.`],
      },
    ],
  },

  notice: {
    slug: "notice",
    title: "الإشعار القانوني",
    shortTitle: "الإشعار القانوني",
    description: "ناشر الموقع، والاستضافة، والملكية الفكرية، والإبلاغ عن محتوى غير قانوني.",
    updated: UPDATED.ar,
    intro: [
      "يحدد هذا الإشعار القانوني ناشر الموقع والمزوّدين التقنيين المشاركين في نشره، وفق الممارسات والالتزامات المعمول بها في تونس.",
    ],
    sections: [
      {
        id: "editeur",
        title: "1. الناشر",
        paragraphs: [
          "الموقع منشور من EduRelay، خدمة سوق مدرسي مقرها تونس، تونس.",
          `الاتصال: ${support}.`,
        ],
      },
      {
        id: "publication",
        title: "2. مسؤول النشر",
        paragraphs: [
          `تتولى EduRelay مسؤولية النشر. يمكن إرسال الطلبات المتعلقة بالمحتوى التحريري إلى ${support}.`,
        ],
      },
      {
        id: "hebergement",
        title: "3. الاستضافة",
        paragraphs: [
          "يُستضاف التطبيق وقاعدة البيانات على بنية EduRelay التحتية في أوروبا.",
          "قد يعالج هؤلاء المزوّدون بيانات تقنية ومحتوى في إطار خدماتهم، بالضمانات الموصوفة في سياسة الخصوصية.",
        ],
      },
      {
        id: "propriete",
        title: "4. الملكية الفكرية",
        paragraphs: [
          "اسم EduRelay والشعار والواجهة والنصوص والعناصر الرسومية والرمز المصدري وقاعدة البيانات ملكية حصرية لـ EduRelay والجهات المرخّصة لها. جميع الحقوق محفوظة.",
          "يُحظر أي نسخ أو تمثيل أو تكييف أو استغلال، كلياً أو جزئياً، دون إذن كتابي مسبق، باستثناء الاستثناءات القانونية. علامات وشعارات الأطراف الثالثة ملك لأصحابها.",
        ],
      },
      {
        id: "signalement",
        title: "5. الإبلاغ عن محتوى غير قانوني",
        paragraphs: [
          `إذا اعتبرت أن إعلاناً أو محتوى ينتهك حقوقك، اكتب إلى ${support} مع تحديد الرابط وطبيعة المحتوى والحق المعني، وعند الاقتضاء دليل على صفتك.`,
          "ندرس الإبلاغات ويمكننا إزالة المحتوى أو تعليق الحساب المعني أو إحالة العناصر إلى السلطات المختصة. يمكن رفض الطلب التعسفي الواضح.",
        ],
      },
      {
        id: "contact",
        title: "6. الاتصال",
        paragraphs: [`الدعم: ${support}. الأمان: ${security}. الموقع: ${site}.`],
      },
    ],
  },
};

export const legalDocuments: Record<Locale, Record<LegalSlug, LegalDocument>> = { fr, ar };

export function getLegalDocument(locale: Locale, slug: LegalSlug): LegalDocument {
  return legalDocuments[locale][slug];
}

/** Locale-safe lookup for route components, where `locale` arrives as string. */
export function getLegalCorpus(locale: string): Record<LegalSlug, LegalDocument> {
  return legalDocuments[isLocale(locale) ? locale : defaultLocale];
}

/** Documents in the order they appear in the hub and the footer. */
export const legalNavigation: { slug: LegalSlug; label: string }[] = [
  { slug: "terms", label: "terms" },
  { slug: "privacy", label: "privacy" },
  { slug: "cookies", label: "cookies" },
  { slug: "security", label: "security" },
  { slug: "notice", label: "notice" },
];
