import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, ScatterChart } from "recharts";
import { IMGS } from "./images"

// ============================================================
// ILLUSTRATIONS SVG DE MIRAGE — D'après les planches du PDF
// ============================================================
const EggAlive_J10 = ({ size = 110 }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 100 125" fill="none">
    <defs>
      <radialGradient id="yolk10" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#F5C842" /><stop offset="60%" stopColor="#E8943A" /><stop offset="100%" stopColor="#C4602A" />
      </radialGradient>
    </defs>
    <path d="M50 5 C28 5,8 28,8 55 C8 82,26 118,50 118 C74 118,92 82,92 55 C92 28,72 5,50 5 Z" fill="url(#yolk10)" stroke="#A0522D" strokeWidth="1.5"/>
    <path d="M50 5 C35 5,20 15,15 28 C22 22,36 18,50 18 C64 18,78 22,85 28 C80 15,65 5,50 5 Z" fill="#F0E8D0" opacity="0.9"/>
    <circle cx="50" cy="68" r="8" fill="#8B2500" opacity="0.85"/>
    {[0,40,80,120,160,200,240,280,320].map((a,i) => {
      const r=a*Math.PI/180, l=18+(i%3)*6;
      return <path key={i} d={`M50,68 Q${50+Math.cos(r+0.3)*l*0.5},${68+Math.sin(r+0.3)*l*0.5} ${50+Math.cos(r)*l},${68+Math.sin(r)*l}`} stroke="#CC2200" strokeWidth={i%2===0?"1.2":"0.7"} fill="none" opacity="0.8"/>;
    })}
    <ellipse cx="35" cy="30" rx="8" ry="12" fill="white" opacity="0.12" transform="rotate(-20 35 30)"/>
  </svg>
);

const EggClear_J10 = ({ size = 90 }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 100 125" fill="none">
    <defs><radialGradient id="clear10" cx="45%" cy="40%" r="60%"><stop offset="0%" stopColor="#F5D070"/><stop offset="100%" stopColor="#E8943A"/></radialGradient></defs>
    <path d="M50 5 C28 5,8 28,8 55 C8 82,26 118,50 118 C74 118,92 82,92 55 C92 28,72 5,50 5 Z" fill="url(#clear10)" stroke="#A0522D" strokeWidth="1.5"/>
    <path d="M50 5 C35 5,20 15,15 28 C22 22,36 18,50 18 C64 18,78 22,85 28 C80 15,65 5,50 5 Z" fill="#F0E8D0" opacity="0.85"/>
    <ellipse cx="36" cy="32" rx="9" ry="13" fill="white" opacity="0.15" transform="rotate(-20 36 32)"/>
  </svg>
);

const EggBloodRing = ({ size = 90 }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 100 125" fill="none">
    <defs><radialGradient id="blood10" cx="45%" cy="45%" r="55%"><stop offset="0%" stopColor="#F0B050"/><stop offset="100%" stopColor="#D07030"/></radialGradient></defs>
    <path d="M50 5 C28 5,8 28,8 55 C8 82,26 118,50 118 C74 118,92 82,92 55 C92 28,72 5,50 5 Z" fill="url(#blood10)" stroke="#A0522D" strokeWidth="1.5"/>
    <path d="M50 5 C35 5,20 15,15 28 C22 22,36 18,50 18 C64 18,78 22,85 28 C80 15,65 5,50 5 Z" fill="#F0E8D0" opacity="0.85"/>
    <ellipse cx="50" cy="65" rx="22" ry="18" fill="none" stroke="#CC0000" strokeWidth="2.5" opacity="0.85"/>
    <ellipse cx="50" cy="65" rx="16" ry="12" fill="none" stroke="#AA0000" strokeWidth="1" opacity="0.5"/>
    <circle cx="50" cy="65" r="4" fill="#880000" opacity="0.7"/>
  </svg>
);

const EggAlive_J18 = ({ size = 110 }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 100 125" fill="none">
    <defs><radialGradient id="alive18" cx="50%" cy="60%" r="55%"><stop offset="0%" stopColor="#C4602A"/><stop offset="100%" stopColor="#7A3010"/></radialGradient></defs>
    <path d="M50 5 C28 5,8 28,8 55 C8 82,26 118,50 118 C74 118,92 82,92 55 C92 28,72 5,50 5 Z" fill="url(#alive18)" stroke="#6B3010" strokeWidth="1.5"/>
    <path d="M50 5 C35 5,18 12,12 30 C20 22,36 19,50 20 C64 19,80 22,88 30 C82 12,65 5,50 5 Z" fill="#F0E8D0" opacity="0.92"/>
    <ellipse cx="50" cy="78" rx="24" ry="22" fill="#3D1A05" opacity="0.9"/>
    <ellipse cx="44" cy="68" rx="10" ry="12" fill="#2A0F02" opacity="0.85"/>
    {[0,60,120,180,240,300].map((a,i)=><line key={i} x1="50" y1="78" x2={50+Math.cos(a*Math.PI/180)*26} y2={78+Math.sin(a*Math.PI/180)*20} stroke="#AA3300" strokeWidth="0.8" opacity="0.6"/>)}
    <path d="M78 60 Q82 55,80 50" stroke="#C4602A" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round"/>
    <path d="M80 68 Q85 63,83 58" stroke="#C4602A" strokeWidth="1.2" fill="none" opacity="0.5" strokeLinecap="round"/>
  </svg>
);

const EggDead = ({ size = 90 }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 100 125" fill="none">
    <defs><radialGradient id="dead" cx="50%" cy="55%" r="55%"><stop offset="0%" stopColor="#8B5A2B"/><stop offset="100%" stopColor="#4A2810"/></radialGradient></defs>
    <path d="M50 5 C28 5,8 28,8 55 C8 82,26 118,50 118 C74 118,92 82,92 55 C92 28,72 5,50 5 Z" fill="url(#dead)" stroke="#6B3010" strokeWidth="1.5"/>
    <path d="M50 5 C35 5,18 12,12 30 C20 22,36 19,50 20 C64 19,80 22,88 30 C82 12,65 5,50 5 Z" fill="#F0E8D0" opacity="0.9"/>
    <ellipse cx="50" cy="78" rx="26" ry="24" fill="#2A1005" opacity="0.95"/>
    <line x1="42" y1="70" x2="58" y2="86" stroke="#CC0000" strokeWidth="2" strokeLinecap="round"/>
    <line x1="58" y1="70" x2="42" y2="86" stroke="#CC0000" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const EggAlive_J25 = ({ size = 110 }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 100 125" fill="none">
    <path d="M50 5 C28 5,8 28,8 55 C8 82,26 118,50 118 C74 118,92 82,92 55 C92 28,72 5,50 5 Z" fill="#3D1A05" stroke="#2A0F02" strokeWidth="1.5"/>
    <path d="M50 5 C33 5,16 10,10 32 C8 42,10 50,18 52 C26 54,38 48,50 48 C62 48,74 54,82 52 C90 50,92 42,90 32 C84 10,67 5,50 5 Z" fill="#F0E8D0" opacity="0.93"/>
    <ellipse cx="50" cy="88" rx="28" ry="26" fill="#1A0A02" opacity="0.98"/>
    <circle cx="50" cy="42" r="5" fill="none" stroke="#8FAF7E" strokeWidth="1.8" strokeDasharray="2 1"/>
    <path d="M80 72 Q86 67,84 60" stroke="#7A4020" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round"/>
    <path d="M82 82 Q88 77,86 70" stroke="#7A4020" strokeWidth="1.2" fill="none" opacity="0.55" strokeLinecap="round"/>
  </svg>
);

// Rendu de l'œuf selon le type
const MirageEgg = ({ type, size }) => {
  if (type === "alive_j10") return <EggAlive_J10 size={size} />;
  if (type === "clear_j10") return <EggClear_J10 size={size} />;
  if (type === "bloodring") return <EggBloodRing size={size} />;
  if (type === "alive_j18") return <EggAlive_J18 size={size} />;
  if (type === "dead") return <EggDead size={size} />;
  if (type === "alive_j25") return <EggAlive_J25 size={size} />;
  return null;
};

// ============================================================
// DONNÉES MIRAGE ENRICHIES AVEC ILLUSTRATIONS                   //OK
// ============================================================
const MIRAGE_GUIDE_RICH = {
  10: { //OK
    title: "👀️ Mirage J10 — 1er mirage",
    desc: "Premier contrôle : détectez les embryons vivants. Réalisez-le dans une pièce sombre, rapidement (max 5 min hors incubateur).",
    airPocket: "Poche d'air = ~10% de l'œuf",
    signs: [
      { icon: "👍🏼", label: "✅ Ce qu'il faut voir", desc: "Réseau vasculaire en araignée rouge, embryon visible au centre, poche d'air petite en haut.", img: "m1_true" },
      { icon: "💀", label: "💀 Œuf clair / anneau de sang", desc: "Transparent sans réseau (non fécondé) ou anneau rouge (mort précoce). Retirer.", img: "m1_false", wide: true },
    ],
    airImg: "m1_airsize",
    tip: "En cas de doute, remettez l'œuf 2-3 jours puis re-mirez.",
  },
  18: { //OK
    title: "👀 Mirage J18 — 2e mirage",
    desc: "Développement avancé. La moitié inférieure doit être sombre. Vérifiez les mouvements de l'embryon.",
    airPocket: "Poche d'air : ~1/4 de l'œuf",
    signs: [
      { icon: "👍🏼", label: "✅ Ce qu'il faut voir", desc: "Silhouette sombre qui bouge, réseau vasculaire visible, poche d'air bien délimitée en haut, environ 20% de l'œuf.", img: "m2_true" },
      { icon: "💀", label: "💀 Mort (aucun mouvement)", desc: "Masse sombre sans mouvement ni réseau vasculaire. Odeur possible. Retirer.", img: "m2_false" },
    ],
    airImg: "m2_airsize",
    tip: "Ajustez l'hygrométrie selon la poche d'air (trop petite → réduire, trop grande → augmenter).",
  },
  21: { //OK
    title: "👀 Mirage J21 — 3e mirage",
    desc: "Avant la mise en éclosion. L'œuf doit être presque entièrement sombre. Vérifiez la poche d'air.",
    airPocket: "Poche d'air : ~1/3 de l'œuf",
    signs: [
      { icon: "👍🏼", label: "✅ Ce qu'il faut voir", desc: "Comme au mirage précédent : œuf très sombre, poche d'air grande et irrégulière (~30% de l'œuf), mouvements visibles, zone de béchage possible.", img: "m3_true"  },
      { icon: "💀", label: "💀 Mort (aucun signe de vie)", desc: "Aucun mouvement depuis 2-3 jours. Retirer délicatement.", img: "m3_false"  },
    ],
    airImg: "m3_airsize",
    tip: "Les mirages sont plus rapprochés pour ajuster au mieux la taille de la poche d'air.",
  },
  25: { //OK
    title: "👀️ Mirage J25 — Mise en éclosion",
    desc: "Dernier mirage. Arrêt du retournement. Placer les œufs à plat.",
    airPocket: "Poche d'air : ~30% de l'œuf",
    signs: [
      { icon: "👍🏼", label: "✅ Prêt à éclore", desc: "Grande poche d'air irrégulière (~35%), zone de béchage visible (étoile), mouvements et sons 'piou piou' possibles !", img: "m4_true" },
      { icon: "💀", label: "💀 Mort (aucune vie)", desc: "Ni mouvement ni son. Aucun béchage. Retirer avec précaution.", img: "m4_false" },
    ],
    airImg: "m4_airsize",
    tip: "🔒 Après ce mirage : œufs à plat, arrêt du retournement, humidité 60-65%, trous d'aération ouverts.",
    warning: "⚠️ Phase critique : ne plus ouvrir la couveuse ! Une chute de T° peut 'serrer' la membrane contre le caneton.",
  },
};

// ============================================================
// GUIDE COMPLET — D'après Lydiane B. & Loïc M. / Coureur Indien 24 //OK
// ============================================================
const GUIDE_SECTIONS = [
  {
    id: "objectifs", emoji: "🎯", titre: "Objectifs", //OK
    contenu: "Ce guide permet à toutes et tous de mener une incubation d'œufs de Coureur Indien à son terme dans les meilleures conditions. Il indique jour après jour tous les paramètres à contrôler.",
  },
  {
    id: "oeuf_feconde", emoji: "🔬", titre: "L'œuf fécondé", //OK
    contenu: "Composition d'un œuf de Coureur Indien fécondé : poche d'air, coquille, vitellus, albumen, membrane, disque germinal (embryon).",
    img: "oeuf_feconde",
  },
  {
    id: "materiel", emoji: "🧰", titre: "Matériel nécessaire", //OK
    liste: ["Un incubateur (manuel ou automatique)", "Une lampe à mirer (ou le flash du téléphone)", "Un thermomètre précis (calibré à 37,3-37,5°C)", "Un hygromètre fonctionnel", "Un spray n'ayant contenu que de l'eau", "Une éponge neuve ou désinfectée"],
  },
  {
    id: "preparation", emoji: "⚕️", titre: "Préparation de la couveuse", //OK
    contenu: "L'incubateur doit être propre et désinfecté. Vérifiez (le cas échéant) : thermomètre, hygromètre, ventilateur, moteur de retournement. Bien contrôler la température avant de lancer l'incubation, éventuellement avec 2 thermomètres différents.",
  },
  {
    id: "selection", emoji: "🥚", titre: "Sélection des œufs", //OK
    contenu: "Ramassage quotidien, ne garder que ceux qui ont une taille, une forme, une couleur et une texture normales. Poids moyen d'un œuf de CCI : 65g. Écarter les œufs :",
    liste: ["Trop petits ou trop gros", "Avec des bosses ou un bourrelet", "À coquille mince, poreuse ou trop épaisse", "Avec des grains de calcaire ou fissures", "Avec une extrémité très pointue", "Trop sales"],
  },
  {
    id: "stockage", emoji: "📦", titre: "Stockage des œufs", //OK
    contenu: "Stockage à l'horizontale, dans un endroit frais (13°C), humide (75%), à l'abri du soleil. Retourner à 180° deux fois par jour. Mise en incubateur idéalement entre 3 et 7 jours. Au-delà de 14 jours : déconseillé.",
  },
  {
    id: "embryon", emoji: "🧬", titre: "Développement de l'embryon", //OK
    contenu: "Du disque germinal à l'éclosion en 28 jours.",
    frise: "frise_dev",
    illustrations: [
      { jour: "J1", img: "j1_illus", desc: "Début du développement" },
      { jour: "J7", img: "j7_illus", desc: "Réseau vasculaire, embryon visible" },
      { jour: "J14", img: "j14_illus", desc: "Membres formés, mouvements" },
      { jour: "J22", img: "j22_illus", desc: "Caneton quasi formé" },
      { jour: "J28", img: "j28_illus", desc: "Prêt à éclore 🐣" },
    ],
  },
  {
    id: "hygro", emoji: "💧", titre: "Importance de l'hygrométrie", //OK
    contenu: "L'hygrométrie contrôle la taille de la poche d'air. Cible : +/- 40% pendant l'incubation, puis 65%+ à partir de J26 pour que la membrane ne sèche pas (le caneton étoufferait).",
    astuce: {
      augmenter: ["Remplir les bacs à eau", "Ajouter des éponges gorgées d'eau", "Réduire le flux d'air"],
      diminuer: ["Ouvrir la trappe d'aération au maximum", "Enlever les éponges"],
    },
  },
  {
    id: "eclosion", emoji: "🐣", titre: "L'éclosion", //OK
    contenu: "Les premiers béchages peuvent survenir dès J26. Il peut ne rien se passer durant 36h : c'est normal. Il se passe en moyenne 48h entre le béchage externe et la sortie. Les canetons peuvent rester 24h en couveuse sans manger.",
    liste: ["Ouvrir tous les trous d'aération", "Ne PAS ouvrir la couveuse pendant l'éclosion !", "Préparer l'éleveuse avant l'éclosion", "Litière : éviter les copeaux les premiers jours", "Aliment poussins/canetons à 22% de protéines", "Lampe infrarouge ou plateau chauffant"],
  },
  {
    id: "semaines", emoji: "🐥", titre: "Les 4 premières semaines", //OK
    semaines: [
      { label: "Semaine 1", temp: "32-35°C", alim: "22% protéines", note: "J1 : pas de nourriture. Dès J2 : granulés concassés + aliments verts hachés." },
      { label: "Semaine 2", temp: "29-32°C", alim: "22% protéines", note: "Commencent à réguler leur température. Ajouter du gravier fin." },
      { label: "Semaine 3", temp: "26-29°C", alim: "20% protéines", note: "Commencer à les sortir dès que le temps le permet." },
      { label: "Semaine 4", temp: "25°C", alim: "20% protéines", note: "Le moins longtemps possible en éleveuse pour leur bien-être." },
    ],
  },
  {
    id: "faq", emoji: "❓", titre: "FAQ complète", //OK
    questions: [
      { q: "Ma cane pond mais ne couve pas, si je ne mange pas les œufs, sont-ils perdus ?", r: "Non, la cane attend ~12 œufs avant de couver. Si vous les mangez, vous repoussez la couvaison." },
      { q: "Un œuf s'est fêlé, puis-je le réparer ?", r: "Possible mais incertain : coller une feuille de papier à cigarette sur la fissure." },
      { q: "Quand nourrir les canetons après l'éclosion ?", r: "24h après l'éclosion (avant, ils vivent sur leurs réserves vitellines)." },
      { q: "Quand retirer la lampe chauffante ?", r: "Quand T° extérieure > 25-30°C ou après la 3e semaine." },
      { q: "À quel âge sortir les canetons dehors ?", r: "Pour le nord de la France, attendre 2 à 3 semaines. Pour le sud ou en fin de printemps, immédiatement en journée." },
      { q: "La première étoile se situe à la pointe de l'œuf, que faire ?", r: "Le caneton mal positionné, difficultés à prévoir. Préparez-vous à l'aider." },
	  { q: "Ma cane a arrêté de couver, puis-je mettre les œufs en couveuse ?", r: "Tout à fait." },
      { q: "Toujours rien à J28, mais ça bouge au mirage ?", r: "Tant qu'il y a du mouvement, il y a de l'espoir ! Le développement peut avoir pris du retard, fiez-vous au mirage." },
      { q: "Un caneton semble très faible après l'éclosion, que faire ?", r: "L'éclosion est éprouvante, il peut avoir besoin d'un shoot de protéines : blanc d'œuf cuit + orties fraîches mixées." },
      { q: "Que faire en cas de malformation d'un caneton (cou, patte) ?", r: "Tentez de la kiné : massez la partie ou utilisez un élastique ajusté." },
      { q: "Quel aliment donner les premiers jours ?", r: "Granulés de démarrage concassés + aliments verts hachés (pissenlit, courgette, salade, ortie, ...)." },
    ],
  },
];

// ============================================================
// DONNÉES MÉTIER - Guide Lydiane B. & Loïc M.
// ============================================================
const INCUBATION_DATA = { //OK
  totalDays: 31,
  dailyParams: (day) => {
    if (day <= 25) return { tempC: 37.5, humMin: 35, humMax: 45 };
    return { tempC: 37, humMin: 60, humMax: 70 };
  },
  mirageDays: [10, 18, 21, 25], //OK
  keyEvents: {
    6: "⚠️ Période de sensibilité : éviter les chocs thermiques",
    10: "💧 Début refroidissement + pulvérisation quotidienne",
    25: "🔒 Arrêt du retournement – Mise en éclosion",
    27: "🐣 Éclosion imminente !",
  },
  mirageGuide: { 
    10: {
      title: "Mirage J10",
      desc: "Premier mirage : détection des embryons vivants", //OK
      signs: [
        { icon: "🟢", label: "Vivant", desc: "Réseau vasculaire visible, araignée rouge, embryon se déplace" },
        { icon: "⚪", label: "Œuf clair", desc: "Transparent, pas de développement. Retirer avec précaution." },
        { icon: "🔴", label: "Anneau de sang", desc: "Décès précoce. Retirer l'œuf." },
        { icon: "❓", label: "Douteux", desc: "Remettre en incubation 2-3 jours, re-mirer." },
      ],
    },
    18: {
      title: "Mirage J18",
      desc: "Développement avancé : moitié de l'œuf obscurcie", //OK
      signs: [
        { icon: "🟢", label: "Vivant", desc: "Moitié sombre (embryon), chambre à air visible, mouvements possibles" },
        { icon: "💀", label: "Mort", desc: "Masse sombre sans réseau vasculaire, odeur possible. Retirer." },
        { icon: "⚪", label: "Non fécondé", desc: "Toujours clair. Retirer." },
      ],
    },
    21: {
      title: "Mirage J21", //OK
      desc: "Avant mise en éclosion : dernière vérification",
      signs: [
        { icon: "🟢", label: "Vivant", desc: "Œuf presque entièrement sombre, chambre à air irrégulière, mouvements" },
        { icon: "💀", label: "Mort", desc: "Pas de mouvement depuis 2-3 jours, chambre à air régulière. Retirer." },
      ],
    },
    25: {
      title: "Mirage J25 – Mise en éclosion", //OK
      desc: "Arrêt du retournement. Placer les œufs à plat.",
      signs: [
        { icon: "🟢", label: "Prêt", desc: "Chambre à air grande et irrégulière, mouvements internes, piou piou possible" },
        { icon: "🔊", label: "Piou piou interne", desc: "Le caneton a percé la membrane interne. Éclosion dans 24-48h." },
        { icon: "💀", label: "Mort", desc: "Aucun signe de vie. Retirer délicatement." },
      ],
    },
  },
};

const S1_DATA = { //OK
  brooding: [
    { day: "J1-J3", temp: "32 à 35°C", note: "Chaleur maximale sous lampe, surveillance intensive" },
    { day: "J4-J7", temp: "33°C", note: "Légère réduction sous lampe" },
    { day: "S2", temp: "29 à 32°C", note: "Les canetons commencent à réguler leur température" },
    { day: "S3+", temp: "T° ambiante", note: "Si > 20°C, lampe optionnelle" },
  ],
  feeding: {
    protein: "22% minimum",
    food: "Granulés starter canard ou poussin (non médicamenté)",
    water: "Abreuvoir peu profond (⛔ sécurité : risque de noyade)",
    grit: "Gravier fin accessible dès J2",
  },
  faq: [
    { q: "Caneton qui titube ?", r: "Hypoglycémie possible. Eau sucrée en urgence (1cc miel/100ml)." },
    { q: "Pâte collée autour du cloaque ?", r: "Nettoyer à l'eau tiède, sécher. Peut indiquer un problème de T°." },
    { q: "Caneton très mou et froid ?", r: "Hypothermie. Réchauffer progressivement sous la lampe. Appeler un vétérinaire si persiste." },
    { q: "Refus de manger 24h ?", r: "Normal les 12 premières heures. Au-delà, vérifier T° et humidité." },
    { q: "Plumes collées ou humides ?", r: "Lampe trop basse ou humidité excessive. Ajuster." },
  ],
};

// Fonction utilitaire pour calculer le jour exact d'incubation //OK
const calculateIncubationDay = (startDateString) => {
  const start = new Date(startDateString);
  start.setHours(0, 0, 0, 0); // On force le début à minuit

  const today = new Date(); // ligne à remplacer par const today = new Date(start.getTime() + 29 * 24 * 60 * 60 * 1000); pour faire les tests //ligne originale : const today = new Date();
  today.setHours(0, 0, 0, 0); // On force aujourd'hui à minuit

  const diffInMs = today.getTime() - start.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffInDays); // Évite les jours négatifs si la date est dans le futur
};

// ============================================================
// ŒUF QUI ÉVOLUE SELON LA PROGRESSION                         //OK
// pct : pourcentage de progression global (0-100)
// filled : true si cet œuf est "dépassé" par la barre
// ============================================================
const EvolutionEgg = ({ pct, filled, size = 22 }) => {
  // Stade visuel selon le pourcentage global
  const stage = pct < 40 ? 0 : pct < 75 ? 1 : pct < 90 ? 2 : 3;

  // Couleurs
  const eggFill   = filled ? "#8B6340" : "#C4A882";  // brun chaud si actif, beige si inactif
  const eggStroke = filled ? "#6B4F2A" : "#A08860";
  const crackColor = "#FEFCF5";                        // fêlures claires bien visibles
  const opacity    = filled ? 1 : 0.35;

  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 40 52"
      fill="none"
      opacity={opacity}
      style={{ flexShrink: 0 }}
    >
      {/* Forme de l'œuf : ovale pointu vers le haut */}
      <path
        d="M20 2 C10 2, 2 16, 2 28 C2 41, 10 50, 20 50 C30 50, 38 41, 38 28 C38 16, 30 2, 20 2 Z"
        fill={eggFill}
        stroke={eggStroke}
        strokeWidth="1.5"
      />

      {/* Reflet léger pour donner du volume */}
      <ellipse cx="14" cy="14" rx="4" ry="6" fill="white" opacity="0.15" transform="rotate(-15 14 14)" />

      {/* Stade 1 : première fêlure (zigzag central) */}
      {stage >= 1 && (
        <path
          d="M18 18 L21 23 L17 27 L22 32"
          stroke={crackColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}

      {/* Stade 2 : deuxième fêlure (branche latérale) */}
      {stage >= 2 && (
        <path
          d="M21 23 L25 21 M17 27 L13 29"
          stroke={crackColor}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Stade 3 : petit bec de caneton (triangle jaune/orange) */}
      {stage >= 3 && (
        <polygon
          points="20,24 25,27 20,30"
          fill="#F5A623"
          stroke="#D4821A"
          strokeWidth="0.8"
        />
      )}
    </svg>
  );
};

// ============================================================
// BARRE DE PROGRESSION — ŒUFS QUI ÉVOLUENT                     //OK
// ============================================================
const DuckProgressBar = ({ current, total }) => {
  const pct = Math.min(100, (current / total) * 100);
  const steps = 10;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-[#8B7355] mb-1 font-semibold">
        <span>J{current}</span>
        <span>J{total}</span>
      </div>

      {/* Piste de fond */}
      <div className="relative bg-[#EDE4D0] rounded-full border border-[#C4A882] shadow-inner"
           style={{ height: "44px" }}>

        {/* Barre de remplissage verte */}
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#8FAF7E] to-[#5A8A4A] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />

        {/* Œufs répartis sur la barre */}
        <div className="absolute inset-0 flex items-center justify-around px-2">
          {Array.from({ length: steps }).map((_, i) => {
            // Position de cet œuf dans la progression (0→100)
            const eggPct = ((i + 0.5) / steps) * 100;
            const filled = pct >= eggPct;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: filled ? 1.1 : 0.85 }}
                transition={{ delay: i * 0.05, type: "spring", damping: 12 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <EvolutionEgg pct={pct} filled={filled} size={20} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MODAL GÉNÉRIQUE                                                //OK
// ============================================================
const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-[#2A1A0E]/70 backdrop-blur-md" onClick={onClose} />
        <motion.div
          className="relative bg-white border-2 border-[#C4A882] rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-[#3D2B1F]">{title}</h3>
              <button
                onClick={onClose}
                className="ml-4 flex-shrink-0 w-9 h-9 rounded-full bg-[#E8DCC8] flex items-center justify-center text-[#6B5040] hover:bg-[#D4C4A8] transition-colors font-bold text-lg"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ============================================================
// BOUTON PRINCIPAL                                                //OK
// ============================================================
const PrimaryBtn = ({ onClick, children, className = "", disabled = false }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: disabled ? 1 : 1.03 }}
    whileTap={{ scale: disabled ? 1 : 0.97 }}
    className={`px-6 py-3 rounded-2xl font-bold text-white bg-gradient-to-b from-[#7AAF6A] to-[#5A8A4A] border border-[#4A7A3A] shadow-lg transition-all ${disabled ? "opacity-40 cursor-not-allowed" : "hover:from-[#8ABF7A] hover:to-[#6A9A5A]"} ${className}`}
  >
    {children}
  </motion.button>
);

// ============================================================
// PAGE ACCUEIL                                                   //OK
// ============================================================
const HomePage = ({ sessions, onNewSession, onSelectSession, onExport, onImportClick, onGuide, onAide }) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #F9F5EC 0%, #EDE4D0 100%)" }}>
      {/* En-tête */}
      <header className="pt-12 pb-6 text-center px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-7xl mb-3 drop-shadow-md">🦆</div>
          <h1 className="text-5xl font-black text-[#2A1A0E] tracking-tight" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Incub'app
          </h1>
          <p className="text-[#7A5C3E] mt-2 text-base font-semibold tracking-wide">Carnet de suivi de l'incubation du Coureur Indien</p>
        </motion.div>
        <div className="flex items-center justify-center gap-3 mt-5">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#C4A882]" />
          <EvolutionEgg pct={50} filled={true} size={16} />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#C4A882]" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 gap-6 max-w-sm mx-auto w-full pb-10">
        {/* Bouton démarrer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 14 }}
          className="w-full flex flex-col items-center gap-3"
        >
          <PrimaryBtn onClick={onNewSession} className="w-full text-lg py-4 text-xl">
            🥚 Démarrer un projet
          </PrimaryBtn>
          <button onClick={onAide}
            className="w-full py-3 rounded-2xl border-2 border-[#C4A882] text-[#5A3E2B] font-bold text-sm bg-white/60 hover:bg-[#EDE4D0] transition-all"
          >
            ❓ Aide & Import/Export
          </button>
		  <button onClick={onGuide}
            className="w-full py-3 rounded-2xl border-2 border-[#C4A882] text-[#5A3E2B] font-bold text-sm bg-white/60 hover:bg-[#EDE4D0] transition-all">
            📖 Guide complet de l'incubation des CCI
          </button>
        </motion.div>

        {/* Menu Données */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full bg-white/70 rounded-2xl border-2 border-[#C4A882] p-4 shadow-sm"
        >
          <h3 className="text-sm font-bold text-[#3D2B1F] mb-3 flex items-center gap-2">
            <span>🔐</span> Sauvegarder mes données
          </h3>
          <div className="flex gap-3">
            <button
              onClick={onExport}
              disabled={sessions.length === 0}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-bold border-2 transition-all ${
                sessions.length === 0
                  ? "opacity-40 cursor-not-allowed bg-[#F5F0E8] border-[#C4A882] text-[#8B7355]"
                  : "bg-gradient-to-b from-[#7AAF6A] to-[#5A8A4A] border-[#4A7A3A] text-white hover:from-[#8ABF7A]"
              }`}
            >
              ⬆️ Exporter .json
            </button>
            <button
              onClick={onImportClick}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold border-2 bg-gradient-to-b from-[#C4A882] to-[#A08060] border-[#907050] text-white hover:from-[#D4B892] transition-all"
            >
              ⬇️ Importer .json
            </button>
          </div>
          {sessions.length === 0 && (
            <p className="text-xs text-[#A08870] mt-2 text-center italic">Aucun projet actif pour l'export</p>
          )}
        </motion.div>

        {/* Liste des projets en cours */}
        {sessions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full">
            <h3 className="text-sm font-bold text-[#3D2B1F] mb-3 flex items-center gap-2">
              <span>📋</span> Projet(s) en cours
            </h3>
            <div className="flex flex-col gap-3">
              {sessions.map((s) => {
                const day = Math.min(calculateIncubationDay(s.startDate), 31);
                return (
                  <motion.button
                    key={s.id}
                    onClick={() => onSelectSession(s.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white/80 border-2 border-[#C4A882] rounded-2xl p-4 text-left shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-[#2A1A0E] text-lg">{s.name}</div>
                        <div className="text-xs text-[#8B7355] mt-0.5 font-medium">
                          Démarré le {new Date(s.startDate).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-[#5A8A4A]">J{day}</div>
                        <div className="text-xs text-[#8B7355] font-semibold">
                          {day <= 25 ? "Incubation" : day <= 27 ? "Éclosion" : "S1"}
                        </div>
                      </div>
                    </div>
                    <DuckProgressBar current={day} total={31} />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>

      <footer className="py-5 text-center text-xs text-[#A08870] font-medium">
        D'après le guide de Lydiane B. & Loïc M. • Coureurs Indiens 🦆
      </footer>
    </div>
  );
};

// ============================================================
// PAGE SETUP                                                    //OK
// ============================================================
const SetupPage = ({ onConfirm, onBack }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [eggCount, setEggCount] = useState(12); // On met 12 par défaut
  const [checklist, setChecklist] = useState({
    incubateur: false,
    thermometre: false,
    hygrometre: false,
    mineur: false,
    bouteille: false,
  });

  const checklistItems = [
    { key: "incubateur", label: "Incubateur nettoyé & désinfecté", icon: "⚕️" },
    { key: "thermometre", label: "Thermomètre calibré à 37.5°C", icon: "🌡️" },
    { key: "hygrometre", label: "Hygromètre fonctionnel (45-50%)", icon: "💧" },
    { key: "mineur", label: "Lampe de mirage disponible", icon: "🔦" },
    { key: "bouteille", label: "Réservoir d'eau rempli", icon: "🚰" },
  ];

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #F9F5EC 0%, #EDE4D0 100%)" }}>
      <header className="pt-8 pb-4 px-4 max-w-sm mx-auto w-full">
        <button onClick={onBack} className="text-[#8B7355] text-sm mb-4 flex items-center gap-1 hover:text-[#5A3E2B] font-semibold">
          ← Retour
        </button>
        <h2 className="text-3xl font-black text-[#2A1A0E]">Nouvelle couvée</h2>
        <p className="text-sm text-[#7A5C3E] mt-1 font-medium">Configurez votre projet d'incubation</p>
      </header>

      <main className="flex-1 px-4 flex flex-col gap-4 max-w-sm mx-auto w-full pb-8">
        <div className="bg-white/70 rounded-2xl border-2 border-[#C4A882] p-4 shadow-sm">
          <label className="block text-sm font-bold text-[#3D2B1F] mb-2">🦆 Nom de la couvée</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Couvée du printemps"
            className="w-full bg-[#FEFCF5] border-2 border-[#C4A882] rounded-xl px-4 py-2.5 text-[#3D2B1F] focus:outline-none focus:ring-2 focus:ring-[#8FAF7E] placeholder-[#C4A882] font-medium"
          />
        </div>

{/* Nouveau bloc : Nombre d'œufs au départ */}
        <div className="bg-white/70 rounded-2xl border-2 border-[#C4A882] p-4 shadow-sm">
          <label className="block text-sm font-bold text-[#3D2B1F] mb-2">🥚 Nombre d'œufs au départ</label>
          <input
            type="number"
            value={eggCount}
            onChange={(e) => setEggCount(parseInt(e.target.value) || 0)}
            className="w-full bg-[#FEFCF5] border-2 border-[#C4A882] rounded-xl px-4 py-2.5 text-[#3D2B1F] focus:outline-none focus:ring-2 focus:ring-[#8FAF7E] font-bold"
          />
        </div>

        <div className="bg-white/70 rounded-2xl border-2 border-[#C4A882] p-4 shadow-sm">
          <label className="block text-sm font-bold text-[#3D2B1F] mb-2">📅 Date de mise en incubation (J0)</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-[#FEFCF5] border-2 border-[#C4A882] rounded-xl px-4 py-2.5 text-[#3D2B1F] focus:outline-none focus:ring-2 focus:ring-[#8FAF7E] font-medium"
          />
        </div>

        <div className="bg-white/70 rounded-2xl border-2 border-[#C4A882] p-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#3D2B1F] mb-3">🗂️ Checklist matériel</h3>
          <div className="flex flex-col gap-2">
            {checklistItems.map((item) => (
              <motion.button
                key={item.key}
                onClick={() => setChecklist((c) => ({ ...c, [item.key]: !c[item.key] }))}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                  checklist[item.key] ? "bg-[#8FAF7E]/25 border-[#6A9A5A]" : "bg-[#FEFCF5] border-[#C4A882]"
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  checklist[item.key] ? "bg-[#5A8A4A] border-[#5A8A4A]" : "border-[#C4A882]"
                }`}>
                  {checklist[item.key] && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white text-xs font-bold">✓</motion.span>
                  )}
                </div>
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-[#3D2B1F] font-semibold">{item.label}</span>
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {allChecked && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-center text-sm text-[#5A8A4A] font-bold"
              >
                ✅ Tout est prêt pour la couvée !
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <PrimaryBtn onClick={() => onConfirm({ name, startDate, eggCount })} disabled={!name.trim()} className="w-full text-lg py-4">
          🥚 Lancer l'incubation
        </PrimaryBtn>
      </main>
    </div>
  );
};

// ============================================================
// COMPOSANT CHECKITEM                                            //OK
// ============================================================
const CheckItem = ({ label, icon, checked, onChange }) => (
  <motion.button
    onClick={() => onChange(!checked)}
    whileTap={{ scale: 0.97 }}
    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
      checked ? "bg-[#8FAF7E]/25 border-[#6A9A5A]" : "bg-[#FEFCF5] border-[#C4A882]"
    }`}
  >
    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
      checked ? "bg-[#5A8A4A] border-[#5A8A4A]" : "border-[#C4A882]"
    }`}>
      {checked && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white text-xs font-bold">✓</motion.span>
      )}
    </div>
    <span className="text-base">{icon}</span>
    <span className="text-sm text-[#3D2B1F] font-semibold">{label}</span>
  </motion.button>
);

// ============================================================
// PAGE DASHBOARD                                                 //OK
// ============================================================
const DashboardPage = ({ session, onBack, onDeleteSession, onGuide, onUpdateSession, onBilan }) => {
  // 1. Gestion du jour et actualisation automatique
  const [day, setDay] = useState(Math.min(calculateIncubationDay(session.startDate), 31));

  useEffect(() => {
    const refreshDay = () => {
      const updatedDay = Math.min(calculateIncubationDay(session.startDate), 31);
      if (updatedDay !== day) setDay(updatedDay);
    };
    const interval = setInterval(refreshDay, 60000);
    return () => clearInterval(interval);
  }, [day, session.startDate]);

  const params = INCUBATION_DATA.dailyParams(day);
  const isMirageDay = INCUBATION_DATA.mirageDays.includes(day);
  const isLockdown = day >= 26 && day <= 31;
  const keyEvent = INCUBATION_DATA.keyEvents[day];

  const storageKey = `incubapp_daily_${session.id}_${day}`;
  const [daily, setDaily] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { return {}; }
  });

  const saveDaily = (key, val) => {
    const updated = { ...daily, [key]: val };
    setDaily(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const [mirageOpen, setMirageOpen] = useState(false);
  const [eclosionOpen, setEclosionOpen] = useState(false);
  const [finIncubationOpen, setFinIncubationOpen] = useState(false);
  const [eclosionCount, setEclosionCount] = useState(1);
  const [rapportOpen, setRapportOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [s1Open, setS1Open] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [validationOpen, setValidationOpen] = useState(false);
  const [saveReminderOpen, setSaveReminderOpen] = useState(false);
  const [tempEntry, setTempEntry] = useState(daily.temp || "");
  const [humEntry, setHumEntry] = useState(daily.hum || "");

  // 2. Fonctions d'action
  const handleRemoveEgg = () => {
    if (session.currentEggs > 0) {
      const updatedSession = { ...session, currentEggs: session.currentEggs - 1 };
      onUpdateSession(updatedSession);
    }
  };
  
  // Construction des données pour le graphique Rapport
  const rapportData = Array.from({ length: day + 1 }, (_, i) => {
    const ref = INCUBATION_DATA.dailyParams(i);
    const stored = (() => {
      try { return JSON.parse(localStorage.getItem(`incubapp_daily_${session.id}_${i}`)) || {}; } catch { return {}; }
    })();
    return {
      jour: `J${i}`,
      tempRef: ref.tempC,
      humRefMin: ref.humMin,
      humRefMax: ref.humMax,
      tempReelle: stored.temp ? parseFloat(stored.temp) : null,
      humReelle: stored.hum ? parseFloat(stored.hum) : null,
    };
  }).filter(d => d.tempReelle !== null || d.humReelle !== null);
  
  const isCardComplete = () => {
    const temp = parseFloat(tempEntry);
    const isTempValid = !isNaN(temp) && temp >= 35 && temp <= 42;
    const hum = parseFloat(humEntry);
    const isHumValid = !isNaN(hum) && hum >= 30 && hum <= 80;
    return isTempValid && isHumValid && !!daily.visual;
  };

  const handleValidate = () => setValidationOpen(true);
  
  const phaseLabel = isLockdown ? "Mise en éclosion" : "Incubation";
  const phaseColor = isLockdown ? "#8B7355" : "#5A8A4A";

  const isTempAlarm = tempEntry && (parseFloat(tempEntry) < 36.5 || parseFloat(tempEntry) > 38.5);
  const isHumAlarm = humEntry && (parseFloat(humEntry) < 35 || (day < 26 && parseFloat(humEntry) > 60));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #F9F5EC 0%, #EDE4D0 100%)" }}>
      <header className="pt-8 pb-4 px-4 max-w-lg mx-auto w-full">
        <div className="flex justify-between items-center">
          <button onClick={onBack} className="text-[#8B7355] text-sm flex items-center gap-1 hover:text-[#5A3E2B] font-semibold">← 🏠 Accueil</button>
          <button onClick={() => setConfirmDelete(true)} className="text-xs text-[#C4703E] hover:underline font-semibold">🗑️ Supprimer le projet</button>
        </div>
        <div className="mt-4 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-[#2A1A0E]">{session.name}</h2>
            <span className="text-xs font-bold px-3 py-1 rounded-full border-2" style={{ background: phaseColor + "22", color: phaseColor, borderColor: phaseColor + "55" }}>{phaseLabel}</span>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black" style={{ color: phaseColor }}>J{day}</div>
            <div className="text-xs text-[#8B7355] font-semibold">{new Date(session.startDate).toLocaleDateString("fr-FR")}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center bg-white/50 rounded-2xl p-3 border-2 border-[#C4A882] mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🥚</span>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#8B7355]">Œufs restants</div>
                <div className="text-lg font-black text-[#2A1A0E]">{session.currentEggs || session.initialEggs} / {session.initialEggs}</div>
              </div>
            </div>
            <button onClick={handleRemoveEgg} className="bg-[#FFE4E4] border-2 border-[#C45050] text-[#8B2020] px-3 py-1 rounded-xl text-xs font-bold hover:bg-red-100">➖ Retirer</button>
          </div>
          <DuckProgressBar current={day} total={31} />
        </div>
      </header>

      <main className="flex-1 px-4 pb-8 flex flex-col gap-4 max-w-lg mx-auto w-full">
        {keyEvent && <div className="bg-[#FFF3CD] border-2 border-[#C4A460] rounded-2xl px-4 py-3 text-sm text-[#5A3E2B] font-semibold shadow-sm">{keyEvent}</div>}
        
        {isMirageDay && (
          <PrimaryBtn onClick={() => setMirageOpen(true)} className="w-full flex items-center gap-3">
            <span className="text-2xl">🔦</span> Mirage J{day} : Guide diagnostic
          </PrimaryBtn>
        )}
		{day >= 26 && (
          <button
            onClick={() => setEclosionOpen(true)}
            className="w-full py-3 rounded-2xl border-2 border-[#C4703E] text-white font-bold text-sm bg-gradient-to-b from-[#D4703E] to-[#A05030] shadow-md hover:from-[#E4804E] transition-all"
          >
            🐣 Signaler une éclosion
          </button>
        )}

        {day <= 31 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className={`bg-white/70 rounded-2xl border-2 p-4 shadow-sm ${isTempAlarm ? 'border-red-500 animate-pulse' : 'border-[#8FAF7E]'}`}>
                <span className="text-xs font-bold text-[#3A5A2A] uppercase">🌡️ Temp</span>
                <div className="text-2xl font-black">{params.tempC}°C</div>
              </div>
              <div className={`bg-white/70 rounded-2xl border-2 p-4 shadow-sm ${isHumAlarm ? 'border-red-500 animate-pulse' : 'border-[#8FAF7E]'}`}>
                <span className="text-xs font-bold text-[#3A5A2A] uppercase">💧 Hygro</span>
                <div className="text-2xl font-black">{params.humMin}-{params.humMax}%</div>
              </div>
            </div>

            <div className="bg-white/70 rounded-2xl border-2 border-[#C4A882] p-4 shadow-sm">
              <h3 className="text-sm font-bold text-[#3D2B1F] mb-3">📝 Relevé du jour</h3>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={tempEntry} onChange={(e) => {setTempEntry(e.target.value); saveDaily("temp", e.target.value)}} className={`w-full border-2 rounded-xl px-3 py-2 text-sm ${isTempAlarm ? 'border-red-500 bg-red-50' : 'border-[#C4A882]'}`} placeholder="Temp °C" />
                <input type="number" value={humEntry} onChange={(e) => {setHumEntry(e.target.value); saveDaily("hum", e.target.value)}} className={`w-full border-2 rounded-xl px-3 py-2 text-sm ${isHumAlarm ? 'border-red-500 bg-red-50' : 'border-[#C4A882]'}`} placeholder="Hygro %" />
              </div>
            </div>

            {/* Historique 7 jours */}
            <div className="bg-white/70 rounded-2xl border-2 border-[#C4A882] p-4 shadow-sm">
              <h3 className="text-xs font-bold text-[#3D2B1F] mb-3 uppercase">📈 Historique (7j)</h3>
              <div className="flex justify-between gap-1">
                {[...Array(7)].map((_, i) => {
                  const checkDay = day - (6 - i);
                  if (checkDay < 0) return <div key={i} className="flex-1 h-8 rounded-lg bg-gray-100 border border-dashed border-gray-300" />;
                  const pastData = JSON.parse(localStorage.getItem(`incubapp_daily_${session.id}_${checkDay}`)) || {};
                  const t = parseFloat(pastData.temp);
                  let color = "bg-gray-200";
                  if (t) color = (t < 36.5 || t > 38.5) ? "bg-red-400" : "bg-[#8FAF7E]";
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`w-full h-8 rounded-lg ${color}`} />
                      <span className="text-[9px] font-bold text-[#A08870]">J{checkDay}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
		)}

        <div className="bg-white/70 rounded-2xl border-2 border-[#C4A882] p-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#3D2B1F] mb-3">✅ Actions</h3>
          <div className="flex flex-col gap-2">
		    {day >= 2 && day <= 25 && <CheckItem label="Retournement" icon="🔄" checked={!!daily.turning} onChange={(v) => saveDaily("turning", v)} />}
		    {day >= 2 && day <= 25 && <CheckItem label="Pulvérisation" icon="🚿" checked={!!daily.spray} onChange={(v) => saveDaily("spray", v)} />}
		    {isLockdown && <CheckItem label="Œufs à plat" icon="🔒" checked={!!daily.lockdown} onChange={(v) => saveDaily("lockdown", v)} />}
		    <CheckItem label="Vérification visuelle" icon="👁️" checked={!!daily.visual} onChange={(v) => saveDaily("visual", v)} />
		  </div>
        </div>
		{rapportData.length > 0 && (
        <button
          onClick={() => setRapportOpen(true)}
          className="w-full py-3 rounded-2xl border-2 border-[#8FAF7E] text-[#3A5A2A] font-bold text-sm bg-white/60 hover:bg-[#EDE4D0] transition-all"
        >
         📊 Rapport T° & hygrométrie
        </button>
		)}
        <PrimaryBtn onClick={handleValidate} disabled={!isCardComplete()} className="w-full">
          {isCardComplete() ? "✅ Valider la journée" : "Saisie incomplète"}
        </PrimaryBtn>
		{session.hatchCount > 0 && (
          <div className="mt-4">
            <PrimaryBtn onClick={() => setS1Open(true)} className="w-full">
              🐥 Soins Semaine S1
            </PrimaryBtn>
          </div>
        )}
		{day >= 28 && !session.incubationTerminee && (
          <button
            onClick={() => setFinIncubationOpen(true)}
            className="w-full py-3 rounded-2xl border-2 border-[#8B7355] text-white font-bold text-sm bg-gradient-to-b from-[#8B7355] to-[#6B5535] shadow-md hover:from-[#9B8365] transition-all"
          >
            🐣 Terminer l'incubation
          </button>
        )}
      </main>
	  
	  <Modal isOpen={finIncubationOpen} onClose={() => setFinIncubationOpen(false)} title="🐣 Terminer l'incubation">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[#5A3E2B] font-medium">
            Êtes-vous sûr de vouloir terminer cette incubation ? Cette action déclenchera le suivi de la première semaine de vie des canetons.
          </p>
          <div className="bg-[#F5F0E8] rounded-xl p-3 border-2 border-[#C4A882] text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-[#5A3E2B] font-medium">Œufs de départ</span>
              <span className="font-black text-[#2A1A0E]">{session.initialEggs}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-[#5A3E2B] font-medium">Éclosions</span>
              <span className="font-black text-[#5A8A4A]">{session.hatchCount || 0} 🐥</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A3E2B] font-medium">Œufs écartés</span>
              <span className="font-black text-[#C4703E]">{(session.initialEggs || 0) - (session.currentEggs || 0) - (session.hatchCount || 0)}</span>
            </div>
          </div>
          <PrimaryBtn onClick={() => {
            const updated = {
              ...session,
              incubationTerminee: true,
              dateFinIncubation: new Date().toISOString(),
            };
            onUpdateSession(updated);
            setFinIncubationOpen(false);
            onBilan();
          }} className="w-full">
            🏆 Terminer et voir le bilan
          </PrimaryBtn>
        </div>
      </Modal>
	  
	  <Modal isOpen={eclosionOpen} onClose={() => setEclosionOpen(false)} title="🐣 Signaler une éclosion">
        <div className="flex flex-col gap-4">
	      <p className="text-sm text-[#5A3E2B] font-medium">Combien d'œufs ont éclos ?</p>
		  <div className="flex items-center justify-center gap-4">
		    <button
		      onClick={() => setEclosionCount(c => Math.max(1, c - 1))}
			  className="w-10 h-10 rounded-full bg-[#EDE4D0] border-2 border-[#C4A882] text-xl font-bold text-[#3D2B1F] hover:bg-[#D4C4A8]"
			>−</button>
		    <span className="text-4xl font-black text-[#3D2B1F]">{eclosionCount}</span>
	        <button
              onClick={() => setEclosionCount(c => Math.min(session.currentEggs, c + 1))}
			  className="w-10 h-10 rounded-full bg-[#EDE4D0] border-2 border-[#C4A882] text-xl font-bold text-[#3D2B1F] hover:bg-[#D4C4A8]"
			>+</button>
	      </div>
	      <PrimaryBtn onClick={() => {
		    const updated = {
			  ...session,
			  hatchCount: (session.hatchCount || 0) + eclosionCount,
			  currentEggs: Math.max(0, (session.currentEggs || session.initialEggs) - eclosionCount),
			};
			onUpdateSession(updated);
			setEclosionOpen(false);
			setEclosionCount(1);
		  }} className="w-full">
		    ✅ Confirmer {eclosionCount} éclosion{eclosionCount > 1 ? "s" : ""}
		  </PrimaryBtn>
		</div>
      </Modal>	  
	  
	  <Modal isOpen={rapportOpen} onClose={() => setRapportOpen(false)} title="📊 Rapport T° & Hygrométrie">
  <div className="flex flex-col gap-4">
    <p className="text-xs text-[#5A3E2B] font-medium">{rapportData.length} jour(s) de données enregistrées</p>
    <div className="w-full" style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDE4D0" />
          <XAxis dataKey="jour" tick={{ fontSize: 9 }} />
          <YAxis yAxisId="temp" domain={[35, 40]} tick={{ fontSize: 9 }} stroke="#C4703E" />
          <YAxis yAxisId="hum" orientation="right" domain={[30, 80]} tick={{ fontSize: 9 }} stroke="#5A8A4A" />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Scatter yAxisId="temp" name="T° réelle" data={rapportData.filter(d => d.tempReelle)} dataKey="tempReelle" fill="#C4703E" />
          <Scatter yAxisId="temp" name="T° référence" data={rapportData} dataKey="tempRef" fill="#F5C4A0" shape="cross" />
          <Scatter yAxisId="hum" name="Hygro réelle" data={rapportData.filter(d => d.humReelle)} dataKey="humReelle" fill="#5A8A4A" />
          <Scatter yAxisId="hum" name="Hygro min ref" data={rapportData} dataKey="humRefMin" fill="#B0D4A0" shape="cross" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
    <div className="flex gap-3 text-xs flex-wrap">
      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#C4703E] inline-block"/>T° réelle</span>
      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#F5C4A0] inline-block"/>T° référence (37.5°C)</span>
      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#5A8A4A] inline-block"/>Hygro réelle</span>
      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#B0D4A0] inline-block"/>Hygro référence</span>
    </div>
  </div>
</Modal>
<Modal isOpen={mirageOpen} onClose={() => setMirageOpen(false)} title={MIRAGE_GUIDE_RICH[day]?.title}>
  <div className="flex flex-col gap-4">
    {/* 1. Image de l'état de développement */}
    {MIRAGE_GUIDE_RICH[day]?.illus && (
      <div className="text-center bg-[#F5F0E8] p-4 rounded-2xl border-2 border-[#C4A882]">
        <div className="text-[10px] uppercase font-bold text-[#8B7355] mb-2">Stade de développement</div>
        {IMGS[MIRAGE_GUIDE_RICH[day].illus] ? (
          <img src={IMGS[MIRAGE_GUIDE_RICH[day].illus]} className="h-24 mx-auto object-contain" alt="Développement" />
        ) : (
          <div className="h-24 flex items-center justify-center text-5xl">🥚</div>
        )}
      </div>
    )}

    <p className="text-sm text-[#5A3E2B] font-medium leading-relaxed">
      {MIRAGE_GUIDE_RICH[day]?.desc}
    </p>

    {/* 2. Comparaison Vivant / Mort */}
    <div className="grid grid-cols-2 gap-3">
      {MIRAGE_GUIDE_RICH[day]?.signs.map((sign, idx) => (
        <div key={idx} className="flex flex-col items-center bg-[#F5F0E8] rounded-2xl p-3 border-2 border-[#C4A882] shadow-sm">
          {IMGS[sign.img] ? (
		    <img src={IMGS[sign.img]} className="h-20 object-contain mb-2" alt={sign.label} />
          ) : (
            <div className="h-20 w-20 flex items-center justify-center text-4xl mb-2">{sign.icon}</div>
          )}
          <div className="font-bold text-xs text-[#3D2B1F] text-center mb-1">{sign.label}</div>
          <div className="text-[10px] text-[#5A3E2B] text-center leading-tight">{sign.desc}</div>
        </div>
      ))}
    </div>

    {/* 3. Poche d'air */}
    {MIRAGE_GUIDE_RICH[day]?.airImg && (
      <div className="flex items-center gap-4 bg-[#EDF5E8] p-4 rounded-2xl border-2 border-[#8FAF7E]">
        <img src={IMGS[MIRAGE_GUIDE_RICH[day].airImg]} className="h-16 object-contain" alt="Poche d'air" />
        <div>
          <div className="font-bold text-sm text-[#3A5A2A]">Taille de la poche d'air</div>
          <div className="text-xs text-[#5A3E2B] font-medium">{MIRAGE_GUIDE_RICH[day].airPocket}</div>
        </div>
      </div>
    )}

    <div className="bg-[#FFF3E8] p-3 rounded-xl border border-[#D4A082] text-[10px] text-[#7A4010] italic">
      💡 {MIRAGE_GUIDE_RICH[day]?.tip}
    </div>
  </div>
</Modal>
<Modal isOpen={s1Open} onClose={() => setS1Open(false)} title="🐥 Soins Semaine S1">
  <div className="flex flex-col gap-4">
    <p className="text-sm text-[#5A3E2B] font-medium">Paramètres de l'éleveuse selon l'âge du caneton :</p>
    <div className="flex flex-col gap-2">
      {S1_DATA.brooding.map((row, idx) => (
        <div key={idx} className="flex items-start gap-3 bg-[#F5F0E8] rounded-xl p-3 border border-[#C4A882]">
          <div className="font-bold text-sm text-[#3D2B1F] w-16 flex-shrink-0">{row.day}</div>
          <div className="font-bold text-sm text-[#C4703E] w-16 flex-shrink-0">{row.temp}</div>
          <div className="text-xs text-[#5A3E2B]">{row.note}</div>
        </div>
      ))}
    </div>
    <div className="bg-[#EDF5E8] rounded-xl p-3 border border-[#8FAF7E]">
      <div className="font-bold text-sm text-[#3A5A2A] mb-2">🍽️ Alimentation</div>
      <div className="text-xs text-[#5A3E2B] flex flex-col gap-1">
        <span>Protéines : <b>{S1_DATA.feeding.protein}</b></span>
        <span>Aliment : {S1_DATA.feeding.food}</span>
        <span>Eau : {S1_DATA.feeding.water}</span>
        <span>Gravier : {S1_DATA.feeding.grit}</span>
      </div>
    </div>
    <div className="font-bold text-sm text-[#3D2B1F]">❓ FAQ Semaine S1</div>
    {S1_DATA.faq.map((item, idx) => (
      <div key={idx} className="bg-[#F5F0E8] rounded-xl p-3 border border-[#C4A882]">
        <div className="font-bold text-xs text-[#3D2B1F] mb-1">{item.q}</div>
        <div className="text-xs text-[#5A3E2B]">{item.r}</div>
      </div>
    ))}
  </div>
</Modal>
      {/* Modals simplifiées pour l'exemple */}
      <Modal isOpen={validationOpen} onClose={() => {setValidationOpen(false); setSaveReminderOpen(true)}} title="🎉 Validé !">
        <PrimaryBtn onClick={() => {setValidationOpen(false); onBack()}} className="w-full">OK</PrimaryBtn>
      </Modal>
      <Modal isOpen={saveReminderOpen} onClose={() => setSaveReminderOpen(false)} title="💾 Sauvegarde">
        <p className="text-sm mb-4">Pensez à exporter votre fichier .json !</p>
        <PrimaryBtn onClick={() => setSaveReminderOpen(false)} className="w-full">Compris</PrimaryBtn>
      </Modal>
      <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} title="Supprimer complètement le projet ?">
        <button onClick={() => onDeleteSession(session.id)} className="w-full p-3 bg-red-500 text-white rounded-xl font-bold">🗑️ Confirmer la suppression</button>
      </Modal>
    </div>
  );
};

// ============================================================
// PAGE BILAN                                                     //OK
// ============================================================
const BilanPage = ({ session, onBack }) => {
  const [s1Open, setS1Open] = useState(false);
  const totalDays = session.dateFinIncubation
    ? Math.floor((new Date(session.dateFinIncubation) - new Date(session.startDate)) / 86400000)
    : calculateIncubationDay(session.startDate);

  const eclosions = session.hatchCount || 0;
  const ecartes = (session.initialEggs || 0) - (session.currentEggs || 0) - eclosions;
  const tauxEclosion = session.initialEggs ? Math.round((eclosions / session.initialEggs) * 100) : 0;

  // Récupérer toutes les données quotidiennes
  const bilanData = Array.from({ length: totalDays + 1 }, (_, i) => {
    const ref = INCUBATION_DATA.dailyParams(i);
    const stored = (() => {
      try { return JSON.parse(localStorage.getItem(`incubapp_daily_${session.id}_${i}`)) || {}; } catch { return {}; }
    })();
    return {
      jour: `J${i}`,
      tempRef: ref.tempC,
      humRefMin: ref.humMin,
      humRefMax: ref.humMax,
      tempReelle: stored.temp ? parseFloat(stored.temp) : null,
      humReelle: stored.hum ? parseFloat(stored.hum) : null,
    };
  }).filter(d => d.tempReelle !== null || d.humReelle !== null);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #F9F5EC 0%, #EDE4D0 100%)" }}>
      <header className="pt-8 pb-4 px-4 max-w-lg mx-auto w-full">
        <button onClick={onBack} className="text-[#8B7355] text-sm flex items-center gap-1 hover:text-[#5A3E2B] font-semibold mb-4">← Retour</button>
        <h2 className="text-3xl font-black text-[#2A1A0E]">📊 Bilan</h2>
        <p className="text-sm text-[#7A5C3E] mt-1 font-medium">{session.name}</p>
      </header>

      <main className="flex-1 px-4 pb-10 flex flex-col gap-4 max-w-lg mx-auto w-full">
        {/* Stats globales */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/80 rounded-2xl border-2 border-[#8FAF7E] p-4 text-center shadow-sm">
            <div className="text-3xl font-black text-[#5A8A4A]">{eclosions}</div>
            <div className="text-xs font-bold text-[#5A3E2B] mt-1">🐥 Éclosions</div>
          </div>
          <div className="bg-white/80 rounded-2xl border-2 border-[#C4A882] p-4 text-center shadow-sm">
            <div className="text-3xl font-black text-[#3D2B1F]">{session.initialEggs}</div>
            <div className="text-xs font-bold text-[#5A3E2B] mt-1">🥚 Œufs de départ</div>
          </div>
          <div className="bg-white/80 rounded-2xl border-2 border-[#C4703E] p-4 text-center shadow-sm">
            <div className="text-3xl font-black text-[#C4703E]">{ecartes}</div>
            <div className="text-xs font-bold text-[#5A3E2B] mt-1">❌ Œufs écartés</div>
          </div>
          <div className="bg-white/80 rounded-2xl border-2 border-[#8FAF7E] p-4 text-center shadow-sm">
            <div className="text-3xl font-black text-[#5A8A4A]">{tauxEclosion}%</div>
            <div className="text-xs font-bold text-[#5A3E2B] mt-1">📈 Taux d'éclosion</div>
          </div>
        </div>

        {/* Durée */}
        <div className="bg-white/80 rounded-2xl border-2 border-[#C4A882] p-4 shadow-sm flex justify-between items-center">
          <span className="text-sm font-bold text-[#5A3E2B]">⏳ Durée totale</span>
          <span className="text-xl font-black text-[#2A1A0E]">{totalDays} jours</span>
        </div>

        {/* Graphique global */}
        {(
          <div className="bg-white/80 rounded-2xl border-2 border-[#C4A882] p-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#3D2B1F] mb-3">📉 T° & Hygrométrie sur toute l'incubation</h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE4D0" />
                  <XAxis dataKey="jour" tick={{ fontSize: 8 }} />
                  <YAxis yAxisId="temp" domain={[35, 40]} tick={{ fontSize: 8 }} stroke="#C4703E" />
                  <YAxis yAxisId="hum" orientation="right" domain={[30, 80]} tick={{ fontSize: 8 }} stroke="#5A8A4A" />
                  <Tooltip />
                  <Scatter yAxisId="temp" name="T° réelle" data={bilanData.filter(d => d.tempReelle)} dataKey="tempReelle" fill="#C4703E" />
                  <Scatter yAxisId="temp" name="T° ref" data={bilanData} dataKey="tempRef" fill="#F5C4A0" shape="cross" />
                  <Scatter yAxisId="hum" name="Hygro réelle" data={bilanData.filter(d => d.humReelle)} dataKey="humReelle" fill="#5A8A4A" />
                  <Scatter yAxisId="hum" name="Hygro ref min" data={bilanData} dataKey="humRefMin" fill="#B0D4A0" shape="cross" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Dates clés */}
        <div className="bg-white/80 rounded-2xl border-2 border-[#C4A882] p-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#3D2B1F] mb-3">📅 Dates clés</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#5A3E2B] font-medium">🥚 Mise en incubation</span>
              <span className="font-bold">{new Date(session.startDate).toLocaleDateString("fr-FR")}</span>
            </div>
            {session.dateFinIncubation && (
              <div className="flex justify-between">
                <span className="text-[#5A3E2B] font-medium">🚩 Fin d'incubation</span>
                <span className="font-bold">{new Date(session.dateFinIncubation).toLocaleDateString("fr-FR")}</span>
              </div>
            )}
          </div>
        </div>
		<PrimaryBtn onClick={() => setS1Open(true)} className="w-full">
          🐥 Soins Semaine S1
        </PrimaryBtn>
      </main>

      <Modal isOpen={s1Open} onClose={() => setS1Open(false)} title="❤️ Soins Semaine S1">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[#5A3E2B] font-medium">Paramètres de l'éleveuse selon l'âge du caneton :</p>
          <div className="flex flex-col gap-2">
            {S1_DATA.brooding.map((row, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-[#F5F0E8] rounded-xl p-3 border border-[#C4A882]">
                <div className="font-bold text-sm text-[#3D2B1F] w-16 flex-shrink-0">{row.day}</div>
                <div className="font-bold text-sm text-[#C4703E] w-16 flex-shrink-0">{row.temp}</div>
                <div className="text-xs text-[#5A3E2B]">{row.note}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#EDF5E8] rounded-xl p-3 border border-[#8FAF7E]">
            <div className="font-bold text-sm text-[#3A5A2A] mb-2">🍽️ Alimentation</div>
            <div className="text-xs text-[#5A3E2B] flex flex-col gap-1">
              <span>Protéines : <b>{S1_DATA.feeding.protein}</b></span>
              <span>Aliment : {S1_DATA.feeding.food}</span>
              <span>Eau : {S1_DATA.feeding.water}</span>
              <span>Gravier : {S1_DATA.feeding.grit}</span>
            </div>
          </div>
          <div className="font-bold text-sm text-[#3D2B1F]">❓ FAQ Semaine S1</div>
          {S1_DATA.faq.map((item, idx) => (
            <div key={idx} className="bg-[#F5F0E8] rounded-xl p-3 border border-[#C4A882]">
              <div className="font-bold text-xs text-[#3D2B1F] mb-1">{item.q}</div>
              <div className="text-xs text-[#5A3E2B]">{item.r}</div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// PAGE GUIDE COMPLET                                              //OK
// ============================================================
const GuidePage = ({ onBack }) => {
  const [open, setOpen] = useState(null);
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #F9F5EC 0%, #EDE4D0 100%)" }}>
      <header className="pt-8 pb-4 px-4 max-w-lg mx-auto w-full">
        <button onClick={onBack} className="text-[#8B7355] text-sm flex items-center gap-1 hover:text-[#5A3E2B] font-semibold mb-4">← Retour</button>
        <h2 className="text-3xl font-black text-[#2A1A0E]">📖 Guide complet</h2>
        <p className="text-sm text-[#7A5C3E] mt-1 font-medium">D'après le guide de Lydiane B. & Loïc M. — Coureur Indien 24</p>
      </header>
      <main className="flex-1 px-4 pb-10 flex flex-col gap-3 max-w-lg mx-auto w-full">
        {GUIDE_SECTIONS.map((section) => (
          <motion.div key={section.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 rounded-2xl border-2 border-[#C4A882] overflow-hidden shadow-sm">
            <button onClick={() => setOpen(open === section.id ? null : section.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{section.emoji}</span>
                <span className="font-bold text-[#2A1A0E]">{section.titre}</span>
              </div>
              <span className="text-[#8B7355] font-bold text-lg">{open === section.id ? "▲" : "▼"}</span>
            </button>
            <AnimatePresence>
              {open === section.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                  className="px-4 pb-4 border-t-2 border-[#EDE4D0]">
                  <div className="pt-3 flex flex-col gap-2 text-sm text-[#3D2B1F]">
                    {section.contenu && <p className="font-medium leading-relaxed">{section.contenu}</p>}
                    {section.img && (
                      <img src={IMGS[section.img]} alt={section.titre} className="w-full max-h-64 object-contain rounded-2xl mx-auto" />
                    )}
                    {section.frise && (
                      <img src={IMGS[section.frise]} alt="Frise développement embryon" className="w-full object-contain rounded-xl" />
                    )}
                    {section.illustrations && (
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {section.illustrations.map((illus, i) => (
                          <div key={i} className="flex flex-col items-center gap-1 bg-[#F5F0E8] rounded-xl p-2 border border-[#C4A882]">
                            <img src={IMGS[illus.img]} alt={illus.jour} className="h-16 object-contain" />
                            <span className="text-xs font-black text-[#3D2B1F]">{illus.jour}</span>
                            <span className="text-xs text-[#7A5C3E] text-center leading-tight">{illus.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {section.liste && (
                      <ul className="flex flex-col gap-1">
                        {section.liste.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 font-medium">
                            <span className="text-[#6A8A5A] mt-0.5 flex-shrink-0">•</span>{item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.astuce && (
                      <div className="flex flex-col gap-2 mt-1">
                        <div className="bg-[#E8F5E8] rounded-xl p-3 border border-[#8FAF7E]">
                          <div className="font-bold text-[#3A5A2A] text-xs mb-1">↑ Pour augmenter</div>
                          {section.astuce.augmenter.map((a, i) => <div key={i} className="text-xs font-medium">• {a}</div>)}
                        </div>
                        <div className="bg-[#FFF3E8] rounded-xl p-3 border border-[#C4A460]">
                          <div className="font-bold text-[#7A4A10] text-xs mb-1">↓ Pour diminuer</div>
                          {section.astuce.diminuer.map((a, i) => <div key={i} className="text-xs font-medium">• {a}</div>)}
                        </div>
                      </div>
                    )}
                    {section.semaines && (
                      <div className="flex flex-col gap-2 mt-1">
                        {section.semaines.map((s, i) => (
                          <div key={i} className="bg-[#F5F0E8] rounded-xl p-3 border-2 border-[#C4A882]">
                            <div className="font-black text-[#3D2B1F]">{s.label}</div>
                            <div className="text-xs mt-1 flex flex-col gap-0.5">
                              <div>🌡️ <strong>{s.temp}</strong> sous lampe</div>
                              <div>🌾 <strong>{s.alim}</strong></div>
                              <div className="text-[#7A5C3E] mt-0.5">{s.note}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {section.questions && (
                      <div className="flex flex-col gap-2 mt-1">
                        {section.questions.map((faq, i) => (
                          <details key={i} className="bg-[#F5F0E8] rounded-xl border-2 border-[#C4A882] overflow-hidden">
                            <summary className="px-3 py-2 cursor-pointer font-bold text-[#3D2B1F] text-xs">❓ {faq.q}</summary>
                            <div className="px-3 pb-3 text-xs text-[#5A3E2B] border-t-2 border-[#C4A882] pt-2 font-medium">➡️ {faq.r}</div>
                          </details>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        <div className="text-center text-xs text-[#A08870] font-medium mt-2">
          📚 Guide de Lydiane B. pour Coureur Indien 24 • Développement : Loïc M. • Illustrations : sophie-fernandez.com
        </div>
      </main>
    </div>
  );
};

// ============================================================
// APPLICATION PRINCIPALE                                         //OK
// ============================================================
export default function IncubApp() {
  const [page, setPage] = useState("home");
  const [aideOpen, setAideOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const importRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("incubapp_sessions")) || [];
      setSessions(saved);
    } catch { setSessions([]); }
  }, []);

  const saveSessions = (arr) => {
    setSessions(arr);
    localStorage.setItem("incubapp_sessions", JSON.stringify(arr));
  };

  const handleNewSession = ({ name, startDate, eggCount }) => {
    // On enregistre le nombre d'œufs initial ET le nombre actuel (au début, c'est le même)
    const session = { 
      id: Date.now().toString(), 
      name, 
      startDate, 
      initialEggs: eggCount,
      currentEggs: eggCount,
      createdAt: new Date().toISOString() 
    };
    const updated = [...sessions, session];
    saveSessions(updated);
    setActiveSessionId(session.id);
    setPage("dashboard");
  };

  const handleSelectSession = (id) => {
    setActiveSessionId(id);
    setPage("dashboard");
  };

  const handleDeleteSession = (id) => {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(`incubapp_daily_${id}`)) localStorage.removeItem(k);
    });
    saveSessions(sessions.filter((s) => s.id !== id));
    setPage("home");
  };
  
  // Cette fonction permet de mettre à jour les données d'une couvée (comme le nombre d'œufs)
  const handleUpdateSession = (updatedSession) => {
    const updated = sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s));
    saveSessions(updated);
  };

  const handleExport = () => {
    const dailyData = {};
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith("incubapp_daily_")) {
        try { dailyData[k] = JSON.parse(localStorage.getItem(k)); } catch {}
      }
    });
    const blob = new Blob([JSON.stringify({ sessions, dailyData }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `incubapp_sauvegarde_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => importRef.current?.click();

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
	const confirmImport = window.confirm(
      "⚠️ Attention : L'importation d'un fichier va remplacer TOUS vos projets actuels. Voulez-vous continuer ?"
    );

    if (!confirmImport) {
      e.target.value = ""; // On vide l'input pour pouvoir choisir le même fichier plus tard
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.sessions) {
          saveSessions(data.sessions);
          // Optionnel : on informe l'utilisateur du nombre de sessions importées
          alert(`✅ Importation réussie : ${data.sessions.length} projet(s) chargé(s).`);
        }
        if (data.dailyData) {
          Object.entries(data.dailyData).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
        }
      } catch {
        alert("❌ Erreur : Le fichier est corrompu ou n'est pas au bon format.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  return (
    <>
      <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Nunito', system-ui, sans-serif; box-sizing: border-box; }
        body { margin: 0; }
        details summary { list-style: none; }
        details summary::-webkit-details-marker { display: none; }
      `}</style>
      <Modal isOpen={aideOpen} onClose={() => setAideOpen(false)} title="❓ Aide & Import/Export">
        <div className="flex flex-col gap-4 text-sm text-[#3D2B1F]">
          <div className="bg-[#F5F0E8] rounded-xl p-3 border-2 border-[#C4A882]">
            <div className="font-black mb-1">🦆 Bienvenue sur Incub'app</div>
            <p className="font-medium text-[#5A3E2B]">Votre carnet de bord numérique pour l'incubation des œufs de Coureur Indien, d'après le guide de Lydiane B. et Loïc M.</p>
          </div>
          <div className="bg-[#F5F0E8] rounded-xl p-3 border-2 border-[#C4A882]">
            <div className="font-black mb-2">📋 Comment démarrer</div>
            <ol className="flex flex-col gap-1 font-medium text-[#5A3E2B]">
              <li>1. Cliquez sur "Démarrer un suivi"</li>
              <li>2. Donnez un nom à votre couvée et saisissez la date J0</li>
              <li>3. Renseignez le nombre d'œufs</li>
              <li>4. Chaque jour, remplissez le relevé des paramètres</li>
            </ol>
          </div>
          <div className="bg-[#FFF3CD] rounded-xl p-3 border-2 border-[#C4A460]">
            <div className="font-black mb-2">💾 Sauvegarder vos données</div>
            <p className="font-medium text-[#5A3E2B] mb-2">⚠️ L'app stocke vos données dans le cache du navigateur. Ce cache peut être vidé à tout moment !</p>
            <ul className="flex flex-col gap-1 font-medium text-[#5A3E2B]">
              <li>• Exportez régulièrement vos données via le bouton "⬆️ Exporter .json"</li>
              <li>• En cas de perte, réimportez-les via "⬇️ Importer .json"</li>
              <li>• Conseil : exportez après chaque journée validée</li>
            </ul>
          </div>
          <div className="bg-[#F5F0E8] rounded-xl p-3 border-2 border-[#C4A882]">
            <div className="font-black mb-2">⚙️ Fonctionnalités</div>
            <ul className="flex flex-col gap-1 font-medium text-[#5A3E2B]">
              <li>• Relevé quotidien T° et hygrométrie avec graphique</li>
              <li>• Guide de mirage illustré (J10, J18, J21, J25)</li>
              <li>• Signalement des éclosions dès J26</li>
              <li>• Bilan final avec statistiques</li>
            </ul>
         </div>
         <div className="bg-[#F5F0E8] rounded-xl p-3 border-2 border-[#C4A882]">
           <div className="font-black mb-1">📖 Guide complet</div>
           <p className="font-medium text-[#5A3E2B]">Consultez le guide intégral depuis l'accueil pour tout savoir sur la sélection des œufs, l'hygrométrie, l'éclosion et les soins à S1.</p>
         </div>
       </div>
     </Modal>
      <AnimatePresence mode="wait">
        {page === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}>
            <HomePage sessions={sessions} onNewSession={() => setPage("setup")} onSelectSession={handleSelectSession} onExport={handleExport} onImportClick={handleImportClick} onGuide={() => setPage("guide")} onAide={() => setAideOpen(true)} />
          </motion.div>
        )}
        {page === "setup" && (
          <motion.div key="setup" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <SetupPage onConfirm={handleNewSession} onBack={() => setPage("home")} />
          </motion.div>
        )}
        {page === "dashboard" && activeSession && (
          <motion.div key="dashboard" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <DashboardPage 
			  session={activeSession} 
			  onBack={() => setPage("home")} 
			  onDeleteSession={handleDeleteSession} 
			  onGuide={() => setPage("guide")} 
			  onUpdateSession={handleUpdateSession}
              onBilan={() => setPage("bilan")}			  
			/>
          </motion.div>
        )}
		{page === "bilan" && activeSession && (
          <motion.div key="bilan" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <BilanPage session={activeSession} onBack={() => setPage("dashboard")} />
          </motion.div>
        )}
        {page === "guide" && (
          <motion.div key="guide" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <GuidePage onBack={() => setPage(activeSessionId ? "dashboard" : "home")} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
