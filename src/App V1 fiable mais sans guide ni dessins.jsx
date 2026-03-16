import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// DONNÉES MÉTIER - Guide Lydiane B. et Loïc M.
// ============================================================
const INCUBATION_DATA = {
  totalDays: 35,
  dailyParams: (day) => {
    if (day <= 25) return { tempC: 37.5, humMin: 45, humMax: 50 };
    return { tempC: 37.2, humMin: 65, humMax: 70 };
  },
  mirageDays: [7, 14, 22, 26],
  keyEvents: {
    6: "⚠️ Période de sensibilité : éviter les chocs thermiques",
    10: "💧 Début refroidissement + pulvérisation quotidienne",
    26: "🔒 Arrêt du retournement – Mise en éclosion",
    27: "🐣 Éclosion imminente !",
  },
  mirageGuide: {
    7: {
      title: "Mirage J7",
      desc: "Premier mirage : détection des embryons vivants",
      signs: [
        { icon: "🟢", label: "Vivant", desc: "Réseau vasculaire visible, araignée rouge, embryon se déplace" },
        { icon: "⚪", label: "Œuf clair", desc: "Transparent, pas de développement. Retirer avec précaution." },
        { icon: "🔴", label: "Anneau de sang", desc: "Décès précoce. Retirer l'œuf." },
        { icon: "❓", label: "Douteux", desc: "Remettre en incubation 2-3 jours, re-mirer." },
      ],
    },
    14: {
      title: "Mirage J14",
      desc: "Développement avancé : moitié de l'œuf obscurcie",
      signs: [
        { icon: "🟢", label: "Vivant", desc: "Moitié sombre (embryon), chambre à air visible, mouvements possibles" },
        { icon: "⚫", label: "Mort", desc: "Masse sombre sans réseau vasculaire, odeur possible. Retirer." },
        { icon: "⚪", label: "Non fécondé", desc: "Toujours clair. Retirer." },
      ],
    },
    22: {
      title: "Mirage J22",
      desc: "Avant mise en éclosion : dernière vérification",
      signs: [
        { icon: "🟢", label: "Vivant", desc: "Œuf presque entièrement sombre, chambre à air irrégulière, mouvements" },
        { icon: "⚫", label: "Mort", desc: "Pas de mouvement depuis 2-3 jours, chambre à air régulière. Retirer." },
      ],
    },
    26: {
      title: "Mirage J26 – Mise en éclosion",
      desc: "Arrêt du retournement. Placer les œufs à plat.",
      signs: [
        { icon: "🟢", label: "Prêt", desc: "Chambre à air grande et irrégulière, mouvements internes, pip possible" },
        { icon: "🔔", label: "Pip interne", desc: "Le caneton a percé la membrane interne. Éclosion dans 24-48h." },
        { icon: "⚫", label: "Mort", desc: "Aucun signe de vie. Retirer délicatement." },
      ],
    },
  },
};

const S1_DATA = {
  brooding: [
    { day: "J1-J3", temp: "35°C", note: "Chaleur maximale, surveillance intensive" },
    { day: "J4-J7", temp: "33°C", note: "Légère réduction" },
    { day: "S2", temp: "30°C", note: "Les canetons commencent à réguler" },
    { day: "S3+", temp: "Ambiante", note: "Si > 20°C, lampe optionnelle" },
  ],
  feeding: {
    protein: "22% minimum",
    food: "Granulés starter canard ou poussin (non médicamenté)",
    water: "Abreuvoir peu profond (sécurité noyade)",
    grit: "Gravier fin accessible dès J2",
  },
  faq: [
    { q: "Caneton qui titube ?", r: "Hypoglycémie possible. Eau sucrée en urgence (1cc miel/100ml)." },
    { q: "Pâte collée autour du cloaque ?", r: "Nettoyer à l'eau tiède, sécher. Peut indiquer un problème de t°." },
    { q: "Caneton très mou et froid ?", r: "Hypothermie. Réchauffer progressivement sous la lampe. Appeler un vétérinaire si persiste." },
    { q: "Refus de manger 24h ?", r: "Normal les 12 premières heures. Au-delà, vérifier t° et humidité." },
    { q: "Plumes collées ou humides ?", r: "Lampe trop basse ou humidité excessive. Ajuster." },
  ],
};

// ============================================================
// ŒUF QUI ÉVOLUE SELON LA PROGRESSION
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
// BARRE DE PROGRESSION — ŒUFS QUI ÉVOLUENT
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
// MODAL GÉNÉRIQUE
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
// BOUTON PRINCIPAL
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
// PAGE ACCUEIL
// ============================================================
const HomePage = ({ sessions, onNewSession, onSelectSession, onExport, onImportClick }) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #F9F5EC 0%, #EDE4D0 100%)" }}>
      {/* En-tête */}
      <header className="pt-12 pb-6 text-center px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-7xl mb-3 drop-shadow-md">🦆</div>
          <h1 className="text-5xl font-black text-[#2A1A0E] tracking-tight" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Incub'app
          </h1>
          <p className="text-[#7A5C3E] mt-2 text-base font-semibold tracking-wide">Carnet de suivi d'incubation du Coureur Indien</p>
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
            🥚 Démarrer un suivi
          </PrimaryBtn>
        </motion.div>

        {/* Menu Données */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full bg-white/70 rounded-2xl border-2 border-[#C4A882] p-4 shadow-sm"
        >
          <h3 className="text-sm font-bold text-[#3D2B1F] mb-3 flex items-center gap-2">
            <span>📁</span> Gérer mes données d'incubation(s)
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
            <p className="text-xs text-[#A08870] mt-2 text-center italic">Aucun suivi actif pour l'export</p>
          )}
        </motion.div>

        {/* Liste des suivis en cours */}
        {sessions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full">
            <h3 className="text-sm font-bold text-[#3D2B1F] mb-3 flex items-center gap-2">
              <span>📋</span> Projet(s) d'incubation en cours
            </h3>
            <div className="flex flex-col gap-3">
              {sessions.map((s) => {
                const daysSince = Math.floor((Date.now() - new Date(s.startDate).getTime()) / 86400000);
                const day = Math.min(daysSince, 35);
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
                          {day <= 25 ? "Incubation" : day <= 27 ? "Éclosion" : "S+1"}
                        </div>
                      </div>
                    </div>
                    <DuckProgressBar current={day} total={35} />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>

      <footer className="py-5 text-center text-xs text-[#A08870] font-medium">
        D'après le guide de Lydiane B. et le dev de Loïc M. • Coureurs Indiens 🦆
      </footer>
    </div>
  );
};

// ============================================================
// PAGE SETUP
// ============================================================
const SetupPage = ({ onConfirm, onBack }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [checklist, setChecklist] = useState({
    incubateur: false,
    thermometre: false,
    hygrometre: false,
    mineur: false,
    bouteille: false,
  });

  const checklistItems = [
    { key: "incubateur", label: "Incubateur nettoyé & désinfecté", icon: "🏠" },
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
        <p className="text-sm text-[#7A5C3E] mt-1 font-medium">Configurez votre suivi d'incubation</p>
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

        <PrimaryBtn onClick={() => onConfirm({ name, startDate })} disabled={!name.trim()} className="w-full text-lg py-4">
          🥚 Lancer l'incubation
        </PrimaryBtn>
      </main>
    </div>
  );
};

// ============================================================
// COMPOSANT CHECKITEM
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
// PAGE DASHBOARD
// ============================================================
const DashboardPage = ({ session, onBack, onDeleteSession }) => {
  const daysSince = Math.floor((Date.now() - new Date(session.startDate).getTime()) / 86400000);
  const day = Math.min(daysSince, 35);
  const params = INCUBATION_DATA.dailyParams(day);
  const isMirageDay = INCUBATION_DATA.mirageDays.includes(day);
  const isLockdown = day >= 26 && day <= 27;
  const isS1 = day >= 28;
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
  const [infoOpen, setInfoOpen] = useState(false);
  const [s1Open, setS1Open] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [validationOpen, setValidationOpen] = useState(false);
  const [saveReminderOpen, setSaveReminderOpen] = useState(false);
  const [tempEntry, setTempEntry] = useState(daily.temp || "");
  const [humEntry, setHumEntry] = useState(daily.hum || "");

  const needsTurning = day >= 1 && day <= 25;
  const needsSpray = day >= 10 && day <= 25;

  // Vérifie si la carte du jour est suffisamment remplie pour valider
  const isCardComplete = () => {
    if (isS1) return !!daily.water && !!daily.food && !!daily.lamp;
    const hasTemp = tempEntry !== "" && tempEntry !== undefined;
    const hasHum = humEntry !== "" && humEntry !== undefined;
    const hasVisual = !!daily.visual;
    return hasTemp && hasHum && hasVisual;
  };

  const handleValidate = () => {
    setValidationOpen(true);
  };

  const handleValidationClose = () => {
    setValidationOpen(false);
    setSaveReminderOpen(true);
  };

  const handleSaveReminderClose = () => {
    setSaveReminderOpen(false);
    onBack();
  };

  const phaseLabel = isS1 ? "Semaine +1" : isLockdown ? "Mise en éclosion" : "Incubation";
  const phaseColor = isS1 ? "#C4703E" : isLockdown ? "#8B7355" : "#5A8A4A";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: isS1 ? "linear-gradient(160deg, #FFF5EC 0%, #F5E8D0 100%)" : "linear-gradient(160deg, #F9F5EC 0%, #EDE4D0 100%)" }}>
      {/* Header */}
      <header className="pt-8 pb-4 px-4 max-w-lg mx-auto w-full">
        <div className="flex justify-between items-center">
          <button onClick={onBack} className="text-[#8B7355] text-sm flex items-center gap-1 hover:text-[#5A3E2B] font-semibold">
            ← Accueil
          </button>
          <button onClick={() => setConfirmDelete(true)} className="text-xs text-[#C4703E] hover:underline font-semibold">
            Supprimer
          </button>
        </div>

        <div className="mt-4 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-[#2A1A0E]">{session.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold px-3 py-1 rounded-full border-2" style={{ background: phaseColor + "22", color: phaseColor, borderColor: phaseColor + "55" }}>
                {phaseLabel}
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black" style={{ color: phaseColor }}>J{day}</div>
            <div className="text-xs text-[#8B7355] font-semibold">{new Date(session.startDate).toLocaleDateString("fr-FR")}</div>
          </div>
        </div>

        <div className="mt-4">
          <DuckProgressBar current={day} total={35} />
        </div>
      </header>

      <main className="flex-1 px-4 pb-8 flex flex-col gap-4 max-w-lg mx-auto w-full">
        {/* Alerte événement clé */}
        <AnimatePresence>
          {keyEvent && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#FFF3CD] border-2 border-[#C4A460] rounded-2xl px-4 py-3 text-sm text-[#5A3E2B] font-semibold shadow-sm"
            >
              {keyEvent}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bouton Mirage */}
        {isMirageDay && (
          <motion.button
            onClick={() => setMirageOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-2xl p-4 flex items-center justify-between shadow-lg border-2 border-[#6A8A5A]"
            style={{ background: "linear-gradient(135deg, #8FAF7E 0%, #6A9A5A 100%)" }}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔦</span>
              <div className="text-left">
                <div className="font-black text-[#F5E8C0] text-lg">👀 Mirage J{day}</div>
                <div className="text-xs text-[#C4A882]">Ouvrir le guide de diagnostic</div>
              </div>
            </div>
            <span className="text-[#C4A882] text-2xl font-bold">→</span>
          </motion.button>
        )}

        {/* Bouton S+1 */}
        {isS1 && (
          <motion.button
            onClick={() => setS1Open(true)}
            whileHover={{ scale: 1.02 }}
            className="w-full rounded-2xl p-4 flex items-center justify-between shadow-lg border-2 border-[#A05830]"
            style={{ background: "linear-gradient(135deg, #C4703E 0%, #A05830 100%)" }}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐥</span>
              <div className="text-left">
                <div className="font-black text-white text-lg">Soins S+1</div>
                <div className="text-xs text-orange-100">Température, alimentation, FAQ urgences</div>
              </div>
            </div>
            <span className="text-orange-100 text-2xl font-bold">→</span>
          </motion.button>
        )}

        {/* Paramètres recommandés */}
        {!isS1 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/70 rounded-2xl border-2 border-[#8FAF7E] p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🌡️</span>
                <span className="text-xs font-bold text-[#3A5A2A] uppercase tracking-wide">Température</span>
              </div>
              <div className="text-2xl font-black text-[#2A1A0E]">{params.tempC}<span className="text-sm font-semibold ml-1 text-[#5A3E2B]">°C</span></div>
              <div className="text-xs text-[#7A6A5A] mt-1 font-medium">Sonde au niveau des œufs</div>
            </div>
            <div className="bg-white/70 rounded-2xl border-2 border-[#8FAF7E] p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">💧</span>
                <span className="text-xs font-bold text-[#3A5A2A] uppercase tracking-wide">Humidité</span>
              </div>
              <div className="text-2xl font-black text-[#2A1A0E]">{params.humMin}-{params.humMax}<span className="text-sm font-semibold ml-1 text-[#5A3E2B]">%</span></div>
              <div className="text-xs text-[#7A6A5A] mt-1 font-medium">{day >= 26 ? "↑ 65%+ éclosion" : "Phase incubation"}</div>
            </div>
          </div>
        )}

        {/* Saisie quotidienne */}
        {!isS1 && (
          <div className="bg-white/70 rounded-2xl border-2 border-[#C4A882] p-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#3D2B1F] mb-3">📝 Relevé du jour</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#5A3E2B] mb-1 font-bold">T° mesurée (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tempEntry}
                  onChange={(e) => { setTempEntry(e.target.value); saveDaily("temp", e.target.value); }}
                  placeholder="37.5"
                  className="w-full bg-[#FEFCF5] border-2 border-[#C4A882] rounded-xl px-3 py-2 text-[#3D2B1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#8FAF7E] font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5A3E2B] mb-1 font-bold">Humidité (%)</label>
                <input
                  type="number"
                  value={humEntry}
                  onChange={(e) => { setHumEntry(e.target.value); saveDaily("hum", e.target.value); }}
                  placeholder="48"
                  className="w-full bg-[#FEFCF5] border-2 border-[#C4A882] rounded-xl px-3 py-2 text-[#3D2B1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#8FAF7E] font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Checklist quotidienne */}
        <div className="bg-white/70 rounded-2xl border-2 border-[#C4A882] p-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#3D2B1F] mb-3">✅ Actions du jour</h3>
          <div className="flex flex-col gap-2">
            {needsTurning && (
              <CheckItem label="Retournement des œufs (3x/jour minimum)" icon="🔄" checked={!!daily.turning} onChange={(v) => saveDaily("turning", v)} />
            )}
            {needsSpray && (
              <CheckItem label="Pulvérisation d'eau tiède" icon="🌿" checked={!!daily.spray} onChange={(v) => saveDaily("spray", v)} />
            )}
            {isLockdown && (
              <CheckItem label="Œufs posés à plat (arrêt retournement)" icon="🔒" checked={!!daily.lockdown} onChange={(v) => saveDaily("lockdown", v)} />
            )}
            {!isS1 && (
              <CheckItem label="Vérification visuelle de l'incubateur" icon="👁️" checked={!!daily.visual} onChange={(v) => saveDaily("visual", v)} />
            )}
            {isS1 && (
              <>
                <CheckItem label="Eau fraîche disponible" icon="🚰" checked={!!daily.water} onChange={(v) => saveDaily("water", v)} />
                <CheckItem label="Alimentation starter donnée" icon="🌾" checked={!!daily.food} onChange={(v) => saveDaily("food", v)} />
                <CheckItem label="Vérification température lampe" icon="💡" checked={!!daily.lamp} onChange={(v) => saveDaily("lamp", v)} />
              </>
            )}
          </div>
        </div>

        {/* Boutons actions */}
        <div className="flex flex-col gap-3">
          <PrimaryBtn
            onClick={handleValidate}
            disabled={!isCardComplete()}
            className="w-full text-base py-4"
          >
            ✅ Valider la journée
          </PrimaryBtn>
          {!isCardComplete() && (
            <p className="text-xs text-center text-[#A08870] italic font-medium">
              Remplissez la température, l'humidité et la vérification visuelle pour valider
            </p>
          )}
          <button
            onClick={() => setInfoOpen(true)}
            className="text-sm text-[#6A8A5A] underline underline-offset-2 text-center hover:text-[#4A6A3A] font-semibold"
          >
            📖 En savoir plus sur J{day}
          </button>
        </div>
      </main>

      {/* ===== MODALS ===== */}

      {/* Modal Validation journée */}
      <Modal isOpen={validationOpen} onClose={handleValidationClose} title="🎉 Journée validée !">
        <div className="flex flex-col items-center gap-4 py-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
            className="text-7xl"
          >
            🦆
          </motion.div>
          <p className="text-center text-[#3D2B1F] font-bold text-lg">
            Bravo ! J{day} est bien enregistré.
          </p>
          <p className="text-center text-sm text-[#7A5C3E]">
            {day <= 25
              ? `Plus que ${25 - day} jour${25 - day > 1 ? "s" : ""} avant la mise en éclosion !`
              : day <= 27
              ? "L'éclosion approche, restez attentif !"
              : "Vos canetons grandissent bien, continuez comme ça !"}
          </p>
          <PrimaryBtn onClick={handleValidationClose} className="w-full py-3 text-base">
            Retour à l'accueil →
          </PrimaryBtn>
        </div>
      </Modal>

      {/* Modal Rappel sauvegarde */}
      <Modal isOpen={saveReminderOpen} onClose={handleSaveReminderClose} title="💾 Pensez à sauvegarder !">
        <div className="flex flex-col gap-4">
          <div className="bg-[#FFF3CD] border-2 border-[#C4A460] rounded-2xl p-4 text-sm text-[#5A3E2B] font-medium">
            ⚠️ Le cache de votre navigateur peut se vider à tout moment (mise à jour, nettoyage...). <br /><br />
            <strong>Exportez régulièrement votre sauvegarde .json</strong> depuis l'écran d'accueil pour ne jamais perdre votre suivi ! Il vous suffira d'importer le fichier .json sur la page principale pour récupérer votre sauvegarde 😉.
          </div>
          <PrimaryBtn onClick={handleSaveReminderClose} className="w-full py-3 text-base">
            J'ai compris, retour à l'accueil
          </PrimaryBtn>
        </div>
      </Modal>

      {/* Modal Mirage */}
      <Modal isOpen={mirageOpen} onClose={() => setMirageOpen(false)} title={INCUBATION_DATA.mirageGuide[day]?.title || `Mirage J${day}`}>
        {INCUBATION_DATA.mirageGuide[day] && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#5A3E2B] font-medium">{INCUBATION_DATA.mirageGuide[day].desc}</p>
            <div className="flex flex-col gap-3">
              {INCUBATION_DATA.mirageGuide[day].signs.map((sign, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 bg-[#F5F0E8] rounded-xl p-3 border-2 border-[#C4A882]"
                >
                  <span className="text-2xl flex-shrink-0">{sign.icon}</span>
                  <div>
                    <div className="font-bold text-[#3D2B1F] text-sm">{sign.label}</div>
                    <div className="text-xs text-[#5A3E2B] mt-0.5 font-medium">{sign.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="bg-[#FFF3CD] border-2 border-[#C4A460] rounded-xl p-3 text-xs text-[#5A3E2B] font-medium">
              ⚠️ Réalisez le mirage dans une pièce sombre, rapidement (max 5 min hors incubateur). En cas de doute, remettez l'œuf 2 jours puis re-mirez.
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Info J */}
      <Modal isOpen={infoOpen} onClose={() => setInfoOpen(false)} title={`Informations J${day}`}>
        <div className="flex flex-col gap-3 text-sm text-[#3D2B1F]">
          <div className="bg-[#F5F0E8] rounded-xl p-3 border-2 border-[#C4A882]">
            <div className="font-bold mb-1">🌡️ Température</div>
            <div className="font-medium">Maintenir <strong>{params.tempC}°C</strong> en continu. Vérifier 2× par jour minimum.</div>
          </div>
          <div className="bg-[#F5F0E8] rounded-xl p-3 border-2 border-[#C4A882]">
            <div className="font-bold mb-1">💧 Humidité</div>
            <div className="font-medium">Cible : <strong>{params.humMin}-{params.humMax}%</strong>. {day >= 26 ? "Augmenter pour ramollir la coquille." : "Maintenir stable."}</div>
          </div>
          {day >= 1 && day <= 25 && (
            <div className="bg-[#F5F0E8] rounded-xl p-3 border-2 border-[#C4A882]">
              <div className="font-bold mb-1">🔄 Retournement</div>
              <div className="font-medium">Minimum <strong>3 fois/jour</strong>, en nombre impair pour alterner la position de nuit.</div>
            </div>
          )}
          {day >= 10 && day <= 25 && (
            <div className="bg-[#F5F0E8] rounded-xl p-3 border-2 border-[#C4A882]">
              <div className="font-bold mb-1">🌿 Pulvérisation</div>
              <div className="font-medium">Brumiser les œufs avec de l'eau tiède 1× par jour.</div>
            </div>
          )}
          {day === 6 && (
            <div className="bg-[#FFF3CD] border-2 border-[#C4A460] rounded-xl p-3 font-medium">
              ⚠️ <strong>Sensibilité J6 :</strong> Éviter chocs, vibrations et ouvertures prolongées.
            </div>
          )}
        </div>
      </Modal>

      {/* Modal S+1 */}
      <Modal isOpen={s1Open} onClose={() => setS1Open(false)} title="🐥 Soins Semaine +1">
        <div className="flex flex-col gap-4 text-sm">
          <div>
            <h4 className="font-bold text-[#3D2B1F] mb-2">💡 Température lampe chauffante</h4>
            <div className="flex flex-col gap-2">
              {S1_DATA.brooding.map((b, i) => (
                <div key={i} className="flex justify-between items-center bg-[#F5F0E8] rounded-xl px-3 py-2 border-2 border-[#C4A882]">
                  <span className="font-bold text-[#3D2B1F]">{b.day}</span>
                  <span className="font-black text-[#C4703E]">{b.temp}</span>
                  <span className="text-xs text-[#7A5C3E] font-medium">{b.note}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#F5F0E8] rounded-xl p-3 border-2 border-[#C4A882]">
            <h4 className="font-bold text-[#3D2B1F] mb-2">🌾 Alimentation</h4>
            <div className="text-xs text-[#5A3E2B] flex flex-col gap-1 font-medium">
              <div>• Protéines : <strong>{S1_DATA.feeding.protein}</strong></div>
              <div>• {S1_DATA.feeding.food}</div>
              <div>• Eau : {S1_DATA.feeding.water}</div>
              <div>• {S1_DATA.feeding.grit}</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[#3D2B1F] mb-2">🆘 FAQ Urgences</h4>
            <div className="flex flex-col gap-2">
              {S1_DATA.faq.map((f, i) => (
                <details key={i} className="bg-[#F5F0E8] rounded-xl border-2 border-[#C4A882] overflow-hidden">
                  <summary className="px-3 py-2 cursor-pointer font-bold text-[#3D2B1F] text-xs">❓ {f.q}</summary>
                  <div className="px-3 pb-3 text-xs text-[#5A3E2B] border-t-2 border-[#C4A882] pt-2 font-medium">➡️ {f.r}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal Confirmation suppression */}
      <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} title="Supprimer ce suivi ?">
        <p className="text-sm text-[#5A3E2B] mb-4 font-medium">Cette action est irréversible. Toutes les données de "<strong>{session.name}</strong>" seront effacées.</p>
        <div className="flex gap-3">
          <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2.5 rounded-xl border-2 border-[#C4A882] text-[#5A3E2B] text-sm font-bold hover:bg-[#EDE4D0]">
            Annuler
          </button>
          <button onClick={() => { setConfirmDelete(false); onDeleteSession(session.id); }} className="flex-1 py-2.5 rounded-xl bg-gradient-to-b from-[#D4703E] to-[#A05030] text-white text-sm font-bold border-2 border-[#903020]">
            Supprimer
          </button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// APPLICATION PRINCIPALE
// ============================================================
export default function IncubApp() {
  const [page, setPage] = useState("home");
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

  const handleNewSession = ({ name, startDate }) => {
    const session = { id: Date.now().toString(), name, startDate, createdAt: new Date().toISOString() };
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
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.sessions) saveSessions(data.sessions);
        if (data.dailyData) {
          Object.entries(data.dailyData).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
        }
        alert("✅ Importation réussie !");
      } catch {
        alert("❌ Fichier invalide. Veuillez utiliser un fichier .json exporté depuis Incub'app.");
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

      <AnimatePresence mode="wait">
        {page === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}>
            <HomePage sessions={sessions} onNewSession={() => setPage("setup")} onSelectSession={handleSelectSession} onExport={handleExport} onImportClick={handleImportClick} />
          </motion.div>
        )}
        {page === "setup" && (
          <motion.div key="setup" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <SetupPage onConfirm={handleNewSession} onBack={() => setPage("home")} />
          </motion.div>
        )}
        {page === "dashboard" && activeSession && (
          <motion.div key="dashboard" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <DashboardPage session={activeSession} onBack={() => setPage("home")} onDeleteSession={handleDeleteSession} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
