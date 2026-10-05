import { useEffect, useRef, useState } from "react"
import {
  Badge,
  Button,
  Card,
  HealthRing,
  Icon,
  Logo,
  MapIllustration,
  SectionTitle,
  type IconName,
} from "./ui"

type Page = "home" | "vehicle" | "location" | "trips" | "diagnostics" | "dtc" | "ai" | "security" | "alert" | "maintenance" | "costs" | "smartbox" | "users" | "profile" | "device" | "compatibility" | "architecture" | "roadmap" | "vision" | "admin" | "adminVehicles" | "adminBoxes" | "adminDiagnostics" | "adminSecurity" | "audit" | "history" | "key" | "design"
type Command = "lock" | "unlock"
type NavigationItem = {
  id: Page
  name: string
  icon: IconName
  tag?: string
}
const navigation: NavigationItem[] = [
  { id: "home", name: "Vue d’ensemble", icon: "grid" },
  { id: "vehicle", name: "Mon véhicule", icon: "car" },
  { id: "location", name: "Localisation", icon: "pin" },
  { id: "trips", name: "Mes trajets", icon: "route" },
  { id: "diagnostics", name: "Diagnostics", icon: "scan", tag: "1" },
  { id: "security", name: "Sécurité", icon: "shield" },
  { id: "maintenance", name: "Maintenance", icon: "tool" },
  { id: "smartbox", name: "SmartBox", icon: "cpu" },
  { id: "ai", name: "SmartCar AI", icon: "spark", tag: "AI" },
]
const titles: Partial<Record<Page, string>> = {
  home: "Vue d’ensemble",
  vehicle: "Contrôle du véhicule",
  location: "Localisation",
  trips: "Mes trajets",
  diagnostics: "Diagnostics",
  dtc: "Détail du diagnostic",
  ai: "SmartCar AI",
  security: "Centre de sécurité",
  alert: "Détail de l’événement",
  maintenance: "Maintenance",
  costs: "Coûts du véhicule",
  smartbox: "Ma SmartBox",
  users: "Utilisateurs autorisés",
  profile: "Mon profil",
  device: "Appareil & autorisations",
  compatibility: "Compatibilité véhicule",
  architecture: "Architecture de la plateforme",
  roadmap: "Notre feuille de route",
  vision: "La mobilité de demain",
  admin: "Administration",
  adminVehicles: "Véhicules",
  adminBoxes: "SmartBoxes",
  adminDiagnostics: "Diagnostics de la flotte",
  adminSecurity: "Security Operations Center",
  audit: "Journal d’audit",
  history: "Historique des commandes",
  key: "Clé digitale",
  design: "Design System",
}
const carImage = "/vehicle.png"
const demoEvents = [
  {
    time: "09:42",
    title: "Mouvement détecté",
    desc: "Déplacement autorisé · Cocody",
    badge: "Normal",
  },
  {
    time: "Hier",
    title: "SmartBox reconnectée",
    desc: "Connexion 4G rétablie automatiquement",
    badge: "Résolu",
  },
  {
    time: "Lundi",
    title: "Tentative d’accès non autorisée",
    desc: "Commande refusée par la plateforme",
    badge: "Bloqué",
  },
]

export default function App() {
  const [page, setPage] = useState<Page>("home")
  const [mode, setMode] = useState<"driver" | "admin">("driver")
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState("")
  const [selectedEvent, setSelectedEvent] = useState(2)
  const [command, setCommand] = useState<Command | null>(null)
  const [commandState, setCommandState] = useState("ready")
  const [locked, setLocked] = useState(true)
  const [outcome, setOutcome] = useState("success")
  const [commandHistory, setCommandHistory] = useState([
    { time: "10:42", action: "Verrouillage", status: "Succès" },
    { time: "08:32", action: "Déverrouillage", status: "Succès" },
  ])
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [flow, setFlow] =
    useState<"login" | "onboarding" | "add" | "compatibility" | "pair" | null>(
      null,
    )
  const [onboarding, setOnboarding] = useState(0)
  const [userModal, setUserModal] = useState(false)
  const [userName, setUserName] = useState("")
  const [additionalUsers, setAdditionalUsers] = useState<string[]>([])
  const [messages, setMessages] = useState<{
    role: "user" | "ai"
    text: string
  }[]>([])
  const [question, setQuestion] = useState("")
  const [thinking, setThinking] = useState(false)
  const [period, setPeriod] = useState("Mensuel")
  const [search, setSearch] = useState("")
  const [gpsTracking, setGpsTracking] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [bluetoothGranted, setBluetoothGranted] = useState(true)
  const [biometricsEnabled, setBiometricsEnabled] = useState(true)
  const [secureStorageEnabled, setSecureStorageEnabled] = useState(true)
  const [bleState, setBleState] = useState<"connected" | "scanning">(
    "connected",
  )
  const [presenterOpen, setPresenterOpen] = useState(false)
  const [activeScenario, setActiveScenario] = useState<number | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 4000)
      return () => clearTimeout(t)
    }
  }, [toast])
  useEffect(() => {
    document.title = "SmartCar Access — Prototype CIR"
    document.documentElement.lang = "fr"
  }, [])
  useEffect(() => {
    if (flow === "login") setOnboarding(0)
  }, [flow])
  useEffect(() => {
    if (!command && !flow && !userModal) return
    const previousFocus = document.activeElement as HTMLElement | null
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')
    if (!dialog) return
    dialog.tabIndex = -1
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, [tabindex="0"]'))
    const focusTimer = setTimeout(() => (focusable()[0] || dialog).focus(), 40)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && commandState !== "processing") {
        setCommand(null); setUserModal(false); setFlow(null)
      }
      if (event.key !== "Tab") return
      const elements = focusable()
      const first = elements[0], last = elements[elements.length - 1]
      if (!first) { event.preventDefault(); dialog.focus(); return }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault(); last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
        event.preventDefault(); first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKey)
      previousFocus?.focus()
    }
  }, [command, flow, userModal, commandState])
  const go = (target: Page) => {
    setPage(target)
    setMenuOpen(false)
    setSearch("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const changeMode = (next: "driver" | "admin") => {
    setMode(next)
    go(next === "admin" ? "admin" : "home")
  }
  const startCommand = (c: Command) => {
    setCommand(c)
    setCommandState("confirm")
  }
  const executeCommand = () => {
    setCommandState("processing")
    later(() => {
      setCommandState(outcome)
      if (outcome === "success") setLocked(command === "lock")
      setCommandHistory((h) => [
        {
          time: new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          action: command === "lock" ? "Verrouillage" : "Déverrouillage",
          status:
            outcome === "success"
              ? "Succès"
              : outcome === "failed"
                ? "Échec"
                : "Inconnu",
        },
        ...h,
      ])
    }, 1700)
  }
  const runScan = () => {
    setScanning(true)
    setScanned(false)
    later(() => {
      setScanning(false)
      setScanned(true)
      setToast("Diagnostic simulé terminé — 1 anomalie détectée.")
    }, 2600)
  }
  const askAI = (q = question) => {
    if (!q.trim() || thinking) return
    setMessages((m) => [...m, { role: "user", text: q }])
    setQuestion("")
    setThinking(true)
    later(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: /batterie|battery/i.test(q)
            ? "Dans les données simulées, la tension de batterie est stable à 12,6 V. Aucun signe de sous-tension n’est observé. Confiance indicative : 94 %. Un contrôle professionnel reste nécessaire en cas de difficulté au démarrage."
            : /entretien|maintenance|vidange/i.test(q)
              ? "Une révision est recommandée dans environ 1 250 km, à 83 700 km. Prévoyez une vidange et un contrôle des pneus. Cette recommandation est inférée à partir des données fictives du prototype."
              : "Les données simulées sont compatibles avec une efficacité réduite du système catalytique (P0420). Causes possibles : catalyseur vieillissant, capteur O2 ou fuite d’échappement. La température moteur reste normale. Confiance indicative : 78 %. Faites contrôler le système d’échappement par un professionnel. Cette analyse ne constitue pas un diagnostic.",
        },
      ])
      setThinking(false)
    }, 1200)
  }
  const downloadAudit = () => {
    const rows = commandHistory.map(h => [h.time, "Koffi Modeste", h.action, "VH-001", `${h.status} — SIMULÉ`, "Mobile App"])
    const csv = [["Timestamp", "Actor", "Action", "Vehicle", "Result", "Source"], ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    const a = document.createElement("a")
    a.href = url
    a.download = "smartcar-audit-simulation.csv"
    a.click()
    URL.revokeObjectURL(url)
    setToast("Journal de démonstration exporté.")
  }
  const runScenario = (scenario: number) => {
    setActiveScenario(scenario)
    setPresenterOpen(false)
    if (scenario === 1) startCommand("lock")
    if (scenario === 2) startCommand("unlock")
    if (scenario === 3) {
      setSelectedEvent(2)
      go("alert")
    }
    if (scenario === 4) go("diagnostics")
    if (scenario === 5) {
      go("smartbox")
      setToast("Scénario SmartBox hors ligne prêt à présenter.")
    }
    if (scenario === 6) go("dtc")
    if (scenario === 7) go("location")
    if (scenario === 8) go("ai")
  }
  const scanForSmartBox = () => {
    setBleState("scanning")
    later(() => {
      setBleState("connected")
      setBluetoothGranted(true)
      setToast("SmartBox SCB-DEMO-001 détectée et associée.")
    }, 1400)
  }
  const presenterScenarios: {
    label: string
    detail: string
    icon: IconName
  }[] = [
    { label: "Verrouillage", detail: "Commande sécurisée", icon: "lock" },
    { label: "Déverrouillage", detail: "Validation à distance", icon: "unlock" },
    { label: "Alerte intrusion", detail: "Événement critique", icon: "shield" },
    { label: "Diagnostic", detail: "Scan des systèmes", icon: "scan" },
    { label: "SmartBox offline", detail: "Résilience réseau", icon: "cpu" },
    { label: "Anomalie véhicule", detail: "Code défaut P0420", icon: "alert" },
    { label: "Localisation", detail: "Cocody, Abidjan", icon: "pin" },
    { label: "SmartCar AI", detail: "Analyse explicable", icon: "spark" },
  ]

  const VehicleVisual = ({ compact = false }: { compact?: boolean }) => (
    <div className={`vehicle-visual ${compact ? "compact" : ""}`}>
      <div className="vehicle-grid" />
      <div className="vehicle-shadow" />
      <img
        src={carImage}
        alt="Toyota Corolla blanche — illustration du véhicule de démonstration"
      />
      <div className="vehicle-chip">
        <span className="status-dot" /> SmartBox connectée{" "}
        <span className="chip-line" />
      </div>
    </div>
  )
  const EventList = () => (
    <div className="event-list">
      {demoEvents.map((e, i) => (
        <button className="event-row" key={e.title} onClick={() => { setSelectedEvent(i); go("alert") }}>
          <span className={`event-icon ${i === 2 ? "amber" : ""}`}>
            <Icon
              name={i === 0 ? "car" : i === 1 ? "cpu" : "shield"}
              size={19}
            />
          </span>
          <div>
            <strong>{e.title}</strong>
            <small>{e.desc}</small>
          </div>
          <div className="event-right">
            <Badge tone={i === 2 ? "amber" : "green"}>{e.badge}</Badge>
            <small>{e.time}</small>
          </div>
        </button>
      ))}
    </div>
  )
  const Dashboard = () => (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">VOTRE MOBILITÉ, EN TOUTE CONFIANCE</div>
          <h1>
            Bonjour Koffi<span className="greeting-dot">.</span>
          </h1>
          <p>Votre véhicule vous attend. Tout est sous contrôle.</p>
        </div>
        <Button icon="plus" onClick={() => setFlow("add")}>
          Ajouter un véhicule
        </Button>
      </div>
      <div className="dashboard-top">
        <Card className="vehicle-card">
          <div className="vehicle-card-top">
            <div>
              <span className="overline">MON VÉHICULE</span>
              <h2>
                Toyota Corolla <span className="year">2018</span>
              </h2>
              <div className="vehicle-meta">
                Berline <span>·</span> Essence <span>·</span> AB 2847 CI
              </div>
            </div>
            <Badge dot>Connecté · Simulation</Badge>
          </div>
          <VehicleVisual />
          <div className="vehicle-card-bottom">
            <div className="odometer">
              <Icon name="chart" size={17} />
              <strong>82 450</strong>
              <span>km</span>
            </div>
            <div className="lock-actions">
              <Button
                variant="primary"
                icon="lock"
                onClick={() => startCommand("lock")}
              >
                Verrouiller
              </Button>
              <Button icon="unlock" onClick={() => startCommand("unlock")}>
                Déverrouiller
              </Button>
            </div>
          </div>
          <div className="simulation-caption">
            <Icon name="shield" size={12} /> Commandes sécurisées · Simulation,
            aucune action réelle
          </div>
        </Card>
        <Card className="health-card">
          <SectionTitle icon="chart">Santé du véhicule</SectionTitle>
          <HealthRing />
          <div className="health-stats">
            <div>
              <span>
                <Icon name="engine" size={17} /> Moteur
              </span>
              <strong>
                Normal <span className="mini-dot" />
              </strong>
            </div>
            <div>
              <span>
                <Icon name="battery" size={17} /> Batterie
              </span>
              <strong>
                12.6 <small>V</small>
              </strong>
            </div>
            <div>
              <span>
                <Icon name="pin" size={17} /> GPS
              </span>
              <strong>
                Disponible <span className="mini-dot" />
              </strong>
            </div>
            <div>
              <span>
                <Icon name="cpu" size={17} /> SmartBox
              </span>
              <strong>
                En ligne <span className="mini-dot" />
              </strong>
            </div>
          </div>
          <button className="health-footer" onClick={() => go("diagnostics")}>
            Voir le diagnostic complet <Icon name="arrow" size={16} />
          </button>
        </Card>
      </div>
      <div className="dashboard-middle">
        <Card className="location-card">
          <SectionTitle
            icon="pin"
            action="Ouvrir"
            onAction={() => go("location")}
          >
            Dernière position
          </SectionTitle>
          <button
            className="map-button"
            onClick={() => go("location")}
            aria-label="Voir la localisation simulée"
          >
            <MapIllustration />
          </button>
          <div className="location-bottom">
            <div>
              <strong>Cocody, Abidjan</strong>
              <small>
                <Icon name="clock" size={12} /> Il y a 2 minutes
              </small>
            </div>
            <span className="location-arrow">
              <Icon name="arrow" size={17} />
            </span>
          </div>
        </Card>
        <Card className="security-card">
          <SectionTitle
            icon="shield"
            action="Détails"
            onAction={() => go("security")}
          >
            Sécurité
          </SectionTitle>
          <div className="security-symbol">
            <Icon name="shield" size={34} />
          </div>
          <h3>Votre véhicule est protégé</h3>
          <p>Aucun incident actif détecté.</p>
          <div className="card-bottom-line">
            <span className="mini-dot" /> Surveillance active{" "}
            <span>Simulation</span>
          </div>
        </Card>
        <Card className="maintenance-card">
          <SectionTitle
            icon="tool"
            action="Voir"
            onAction={() => go("maintenance")}
          >
            Prochain entretien
          </SectionTitle>
          <div className="maintenance-number">
            1 250 <span>km</span>
          </div>
          <p>avant votre prochaine révision</p>
          <div className="progress-track">
            <span />
          </div>
          <div className="progress-labels">
            <span>82 450 km</span>
            <strong>83 700 km</strong>
          </div>
          <div className="card-bottom-line">
            <Icon name="calendar" size={14} /> Anticiper, c’est préserver.
          </div>
        </Card>
      </div>
      <section className="ai-banner">
        <div className="ai-emblem">
          <Icon name="spark" size={27} />
        </div>
        <div className="ai-banner-copy">
          <div className="ai-title">
            SmartCar AI <span>VOTRE COPILOTE INTELLIGENT</span>
          </div>
          <p>
            Votre véhicule fonctionne normalement. Une maintenance préventive
            est recommandée dans environ <strong>1 250 km.</strong>
          </p>
          <small>
            <span className="mini-dot" /> Recommandation inférée à partir des
            données simulées
          </small>
        </div>
        <Button onClick={() => go("ai")}>
          Explorer les insights <Icon name="arrow" size={16} />
        </Button>
        <div className="african-pattern" />
      </section>
      <div className="dashboard-lower">
        <Card>
          <SectionTitle
            icon="clock"
            action="Tout voir"
            onAction={() => go("security")}
          >
            Activité récente
          </SectionTitle>
          <EventList />
        </Card>
        <Card className="connection-card">
          <SectionTitle
            icon="cpu"
            action="Détails"
            onAction={() => go("smartbox")}
          >
            Un écosystème connecté
          </SectionTitle>
          <div className="ecosystem">
            <div>
              <Icon name="phone" size={25} />
              <small>Application</small>
            </div>
            <span />
            <div>
              <Icon name="cloud" size={28} />
              <small>Cloud sécurisé</small>
            </div>
            <span />
            <div>
              <Icon name="cpu" size={25} />
              <small>SmartBox</small>
            </div>
          </div>
          <div className="connection-foot">
            <Badge dot>Opérationnel · Démo</Badge>
            <span>SCB-DEMO-001</span>
          </div>
        </Card>
      </div>
    </>
  )

  const PageHeading = ({
    title,
    description,
    action,
  }: {
    title: string
    description: string
    action?: React.ReactNode
  }) => (
    <div className="page-heading">
      <div>
        <div className="eyebrow">TOYOTA COROLLA · 2018 · PROTOTYPE</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
  const SimpleStats = ({ items }: { items: [string, string, IconName][] }) => (
    <div className="stats-grid">
      {items.map(([label, value, icon]) => (
        <Card className="stat-card" key={label}>
          <span className="stat-label">
            <Icon name={icon} size={19} />
            {label}
          </span>
          <strong>{value}</strong>
          <small>Données de démonstration</small>
        </Card>
      ))}
    </div>
  )

  const renderPage = () => {
    if (page === "home") return <Dashboard />
    if (page === "vehicle")
      return (
        <>
          <PageHeading
            title="Votre véhicule, à portée de main."
            description="Un accès simple, autorisé et sécurisé aux fonctions compatibles."
            action={<Badge dot>Prêt · Simulation</Badge>}
          />
          <div className="two-columns">
            <Card className="control-card">
              <div className="vehicle-card-top">
                <div>
                  <h2>Toyota Corolla</h2>
                  <p>2018 · AB 2847 CI</p>
                </div>
                <Badge dot>Connecté · Démo</Badge>
              </div>
              <VehicleVisual />
              <button
                className="circular-control"
                onClick={() => startCommand(locked ? "unlock" : "lock")}
              >
                <Icon name={locked ? "lock" : "unlock"} size={38} />
                <strong>{locked ? "Verrouillé" : "Déverrouillé"}</strong>
                <small>État simulé · Prêt</small>
              </button>
              <div className="center-buttons">
                <Button
                  variant="primary"
                  icon="lock"
                  onClick={() => startCommand("lock")}
                >
                  Verrouiller
                </Button>
                <Button icon="unlock" onClick={() => startCommand("unlock")}>
                  Déverrouiller
                </Button>
              </div>
              <p className="legal-note">
                <Icon name="shield" size={15} /> Les commandes sont autorisées
                de manière sécurisée avant exécution.
              </p>
              <p className="simulation-caption">
                Simulation — aucune commande exécutée sur un véhicule réel.
              </p>
            </Card>
            <div className="stack">
              <Card>
                <SectionTitle icon="shield">Accès sécurisé</SectionTitle>
                <div className="info-rows">
                  <div>
                    <span>Utilisateur autorisé</span>
                    <strong>Koffi Modeste</strong>
                  </div>
                  <div>
                    <span>Rôle</span>
                    <Badge>Propriétaire</Badge>
                  </div>
                  <div>
                    <span>Canal</span>
                    <strong>Cloud chiffré · Démo</strong>
                  </div>
                  <div>
                    <span>Fonctions compatibles</span>
                    <strong>Lock / Unlock</strong>
                  </div>
                </div>
                <Button
                  className="full-width"
                  icon="clock"
                  onClick={() => go("history")}
                >
                  Historique des commandes
                </Button>
              </Card>
              <Card>
                <SectionTitle icon="layers">
                  Scénario de démonstration
                </SectionTitle>
                <p className="muted">
                  Choisissez le résultat de la prochaine commande simulée.
                </p>
                <label className="field">
                  Résultat attendu
                  <select
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                  >
                    <option value="success">Succès</option>
                    <option value="failed">Échec</option>
                    <option value="unknown">État inconnu</option>
                  </select>
                </label>
              </Card>
              <Card>
                <SectionTitle icon="key">Clé digitale</SectionTitle>
                <p className="muted">L’accès véhicule de demain.</p>
                <Button variant="ghost" onClick={() => go("key")}>
                  Découvrir la vision <Icon name="arrow" size={16} />
                </Button>
              </Card>
            </div>
          </div>
        </>
      )
    if (page === "location")
      return (
        <>
          <PageHeading
            title="Toujours savoir où il se trouve."
            description="Dernière position connue de votre véhicule. Coordonnées simulées."
            action={
              <Button
                icon="pin"
                onClick={() =>
                  setToast(
                    "Position simulée actualisée · Cocody, Abidjan · Précision ±8 m.",
                  )
                }
              >
                Actualiser la position
              </Button>
            }
          />
          <Card className="map-page">
            <MapIllustration large />
            <div className="map-detail">
              <div>
                <Badge dot>GPS disponible · Simulation</Badge>
                <h2>Cocody, Abidjan</h2>
                <p>Dernière position connue · Il y a 2 min</p>
              </div>
              <div>
                <small>PRÉCISION</small>
                <strong>±8 m</strong>
              </div>
              <div>
                <small>COORDONNÉES SIMULÉES</small>
                <strong>5.3599° N · 4.0083° W</strong>
              </div>
            </div>
          </Card>
          <Card>
            <SectionTitle icon="route">Timeline du véhicule</SectionTitle>
            <div className="horizontal-timeline">
              {[
                ["08:42", "Véhicule détecté", "Cocody"],
                ["08:50", "Véhicule en mouvement", "Boulevard Latrille"],
                ["09:12", "Véhicule à l’arrêt", "Cocody, Abidjan"],
              ].map(([t, title, loc]) => (
                <div key={t}>
                  <span className="timeline-dot" />
                  <small>{t}</small>
                  <h3>{title}</h3>
                  <p>{loc}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )
    if (page === "trips")
      return (
        <>
          <PageHeading
            title="Chaque trajet raconte une histoire."
            description="Retrouvez vos déplacements et comprenez vos habitudes."
            action={
              <label className="date-input">
                <Icon name="calendar" size={17} />
                <input
                  aria-label="Date des trajets"
                  type="date"
                  defaultValue="2026-10-02"
                  onChange={() =>
                    setToast(
                      "Historique de démonstration — les trajets présentés sont fictifs.",
                    )
                  }
                />
              </label>
            }
          />
          <SimpleStats
            items={[
              ["Distance aujourd’hui", "32,8 km", "route"],
              ["Vitesse moyenne", "31 km/h", "chart"],
              ["Temps de conduite", "1 h 04", "clock"],
            ]}
          />
          <div className="two-columns">
            <Card>
              <SectionTitle icon="route">Trajets récents</SectionTitle>
              {[
                ["Cocody → Plateau", "12,4 km", "24 min", "08:42"],
                ["Plateau → Marcory", "8,2 km", "18 min", "12:15"],
                ["Marcory → Cocody", "12,2 km", "22 min", "17:30"],
              ].map(([name, dist, time, at]) => (
                <button
                  key={name}
                  className="trip-row"
                  onClick={() => go("location")}
                >
                  <span className="event-icon">
                    <Icon name="route" />
                  </span>
                  <div>
                    <h3>{name}</h3>
                    <p>Aujourd’hui · {at}</p>
                  </div>
                  <strong>
                    {dist}
                    <small>{time}</small>
                  </strong>
                  <Icon name="chevron" size={18} />
                </button>
              ))}
            </Card>
            <Card className="trip-map">
              <MapIllustration large />
              <div className="map-detail">
                <div>
                  <h3>Vos déplacements à Abidjan</h3>
                  <p>3 trajets simulés aujourd’hui</p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )
    if (page === "diagnostics")
      return (
        <>
          <PageHeading
            title="Comprendre, avant d’agir."
            description="Un regard précis sur les systèmes compatibles de votre véhicule."
            action={
              <Button
                variant="primary"
                icon="scan"
                disabled={scanning}
                onClick={runScan}
              >
                {scanning ? "Analyse en cours…" : "Lancer un diagnostic"}
              </Button>
            }
          />
          <div className="two-columns diagnostics-layout">
            <Card>
              <SectionTitle icon="scan">Diagnostic du véhicule</SectionTitle>
              <div className="scan-visual">
                <div className={scanning ? "scan-line active" : "scan-line"} />
                <Icon name="car" size={94} />
                <Badge tone={scanning ? "blue" : "green"}>
                  {scanning
                    ? "Analyse des systèmes…"
                    : scanned
                      ? "Analyse terminée"
                      : "Dernière analyse · 10:24"}
                </Badge>
              </div>
              <div className="scan-systems">
                {["Moteur", "Transmission", "Batterie", "Capteurs", "ECU"].map(
                  (s, i) => (
                    <div key={s}>
                      <span>{s}</span>
                      {scanning ? (
                        <span className="spinner" />
                      ) : (
                        <>
                          <Badge tone={i === 0 ? "amber" : "green"}>
                            {i === 0 ? "À contrôler" : "Normal"}
                          </Badge>
                        </>
                      )}
                    </div>
                  ),
                )}
              </div>
              <p className="legal-note">
                Diagnostic compatible simulé. Une validation hardware et un
                contrôle professionnel sont requis.
              </p>
            </Card>
            <div className="stack">
              <Card className="issue-card">
                <Badge tone="amber">1 anomalie détectée</Badge>
                <h2>P0420</h2>
                <h3>Efficacité du système catalytique</h3>
                <p>
                  Une efficacité inférieure au seuil attendu a été détectée dans
                  les données simulées.
                </p>
                <div className="info-rows">
                  <div>
                    <span>Sévérité</span>
                    <Badge tone="amber">Modérée</Badge>
                  </div>
                  <div>
                    <span>Détecté</span>
                    <strong>Aujourd’hui · 10:24</strong>
                  </div>
                </div>
                <Button className="full-width" onClick={() => go("dtc")}>
                  Comprendre cette anomalie <Icon name="arrow" size={17} />
                </Button>
              </Card>
              <Card>
                <SectionTitle icon="spark">
                  L’intelligence en contexte
                </SectionTitle>
                <p className="muted">
                  SmartCar AI vous aide à interpréter les codes défaut et à
                  préparer votre prochain contrôle.
                </p>
                <Button variant="ghost" onClick={() => go("ai")}>
                  Demander à SmartCar AI <Icon name="arrow" size={16} />
                </Button>
              </Card>
            </div>
          </div>
        </>
      )
    if (page === "dtc")
      return (
        <>
          <PageHeading
            title="P0420"
            description="Catalyst System Efficiency Below Threshold"
            action={<Badge tone="amber">Sévérité modérée</Badge>}
          />
          <div className="two-columns">
            <Card>
              <SectionTitle icon="info">Comprendre le code</SectionTitle>
              <span className="overline">DÉTECTÉ · AUJOURD’HUI, 10:24</span>
              <h2 className="content-heading">
                Efficacité du système catalytique inférieure au seuil
              </h2>
              <p className="body-copy">
                Les données disponibles indiquent une efficacité du système
                catalytique inférieure au seuil attendu. Le système de
                dépollution pourrait ne plus fonctionner de manière optimale.
              </p>
              <h3 className="content-heading">Causes possibles</h3>
              <div className="cause-list">
                {[
                  "Catalyseur vieillissant",
                  "Capteur d’oxygène (O2)",
                  "Fuite du système d’échappement",
                ].map((c, i) => (
                  <div key={c}>
                    <span>{i + 1}</span>
                    {c}
                  </div>
                ))}
              </div>
              <p className="legal-note">
                Observé : code P0420. Les causes sont des hypothèses, pas des
                défauts confirmés.
              </p>
            </Card>
            <Card className="recommendation-card">
              <SectionTitle icon="spark">
                Recommandation SmartCar AI
              </SectionTitle>
              <div className="ai-emblem">
                <Icon name="spark" size={28} />
              </div>
              <h2>Un contrôle professionnel est recommandé.</h2>
              <p className="body-copy">
                Faites vérifier le système d’échappement et les capteurs O2 par
                un technicien qualifié avant toute intervention.
              </p>
              <div className="confidence">
                <span>Confiance indicative</span>
                <strong>78 %</strong>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  go("ai")
                  askAI("Pourquoi mon véhicule affiche-t-il P0420 ?")
                }}
              >
                Approfondir avec SmartCar AI <Icon name="arrow" size={17} />
              </Button>
              <p className="legal-note">
                L’analyse SmartCar AI est indicative et ne remplace pas un
                diagnostic professionnel.
              </p>
            </Card>
          </div>
        </>
      )
    if (page === "ai")
      return (
        <>
          <PageHeading
            title="Votre véhicule a des choses à vous dire."
            description="SmartCar AI transforme les données en informations utiles."
            action={<Badge tone="gray">Assistant de démonstration</Badge>}
          />
          <div className="ai-layout">
            <Card className="chat-card">
              <div className="chat-top">
                <div className="ai-emblem">
                  <Icon name="spark" size={25} />
                </div>
                <div>
                  <h3>SmartCar AI</h3>
                  <p>Vehicle Intelligence · Toyota Corolla</p>
                </div>
                <span className="mini-dot" />
              </div>
              <div className="chat-content">
                <div className="chat-message ai">
                  <span className="message-label">
                    <Icon name="spark" size={14} /> SMARTCAR AI
                  </span>
                  <h2>Une mobilité plus éclairée.</h2>
                  <p>
                    Bonjour Koffi. Je peux vous aider à comprendre les données
                    de votre Corolla, les codes défaut et les prochaines étapes
                    d’entretien.
                  </p>
                  <p>Que souhaitez-vous comprendre aujourd’hui ?</p>
                  <div className="suggestions">
                    {[
                      "Que signifie P0420 ?",
                      "Comment va ma batterie ?",
                      "Quand prévoir l’entretien ?",
                    ].map((q) => (
                      <button key={q} onClick={() => askAI(q)}>
                        {q}
                        <Icon name="arrow" size={14} />
                      </button>
                    ))}
                  </div>
                </div>
                {messages.map((m, i) => (
                  <div key={i} className={`chat-message ${m.role}`}>
                    <span className="message-label">
                      {m.role === "user"
                        ? "VOUS"
                        : "SMARTCAR AI · ANALYSE INDICATIVE"}
                    </span>
                    <p>{m.text}</p>
                  </div>
                ))}
                {thinking && (
                  <div className="chat-message ai thinking">
                    <span className="spinner" />
                    Analyse des données simulées…
                  </div>
                )}
              </div>
              <form
                className="chat-input"
                onSubmit={(e) => {
                  e.preventDefault()
                  askAI()
                }}
              >
                <input
                  aria-label="Votre question pour SmartCar AI"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Posez votre question à SmartCar AI…"
                />
                <Button
                  variant="primary"
                  type="submit"
                  aria-label="Envoyer"
                  disabled={thinking || !question.trim()}
                  icon="send"
                />
              </form>
              <p className="chat-disclaimer">
                Réponses de démonstration · Pas de service IA connecté · Ne
                remplace pas un diagnostic professionnel.
              </p>
            </Card>
            <div className="stack">
              <Card>
                <SectionTitle icon="layers">
                  Le contexte de votre véhicule
                </SectionTitle>
                <div className="info-rows">
                  <div>
                    <span>Kilométrage observé</span>
                    <strong>82 450 km</strong>
                  </div>
                  <div>
                    <span>Code détecté</span>
                    <Badge tone="amber">P0420</Badge>
                  </div>
                  <div>
                    <span>Température moteur</span>
                    <strong>Normale</strong>
                  </div>
                  <div>
                    <span>Santé globale</span>
                    <strong>92 / 100</strong>
                  </div>
                </div>
              </Card>
              {[
                [
                  "battery",
                  "Batterie stable",
                  "Tension observée : 12,6 V.",
                  "94 % de confiance",
                ],
                [
                  "tool",
                  "Anticiper votre entretien",
                  "Révision recommandée dans 1 250 km.",
                  "Recommandation",
                ],
                [
                  "chart",
                  "Votre conduite en perspective",
                  "Consommation en hausse de 8 % par rapport à la moyenne récente.",
                  "Tendance inférée",
                ],
              ].map(([icon, title, desc, confidence]) => (
                <Card className="insight-card" key={title}>
                  <Icon name={icon as IconName} size={22} />
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <small>{confidence} · Simulation</small>
                </Card>
              ))}
            </div>
          </div>
        </>
      )
    if (page === "security" || page === "adminSecurity")
      return (
        <>
          <PageHeading
            title={
              page === "security"
                ? "La confiance, à chaque instant."
                : "Security Operations Center"
            }
            description="Surveillance, autorisation et traçabilité au cœur de votre mobilité."
            action={<Badge dot>Surveillance simulée</Badge>}
          />
          <Card className="security-hero">
            <div className="security-symbol">
              <Icon name="shield" size={48} />
            </div>
            <div>
              <span className="overline">STATUT DE SÉCURITÉ</span>
              <h2>Protégé.</h2>
              <p>Aucun incident actif. Vos accès sont sous contrôle.</p>
            </div>
            <Badge>0 incident actif</Badge>
            <div className="african-pattern" />
          </Card>
          <SimpleStats
            items={[
              ["Commandes autorisées", "24", "lock"],
              ["Tentatives bloquées", "1", "shield"],
              ["Appareils autorisés", "2", "phone"],
            ]}
          />
          <div className="two-columns">
            <Card>
              <SectionTitle icon="clock">Événements récents</SectionTitle>
              <EventList />
            </Card>
            <Card>
              <SectionTitle icon="shield">Votre protection</SectionTitle>
              <div className="info-rows">
                <div>
                  <span>Autorisation des commandes</span>
                  <Badge>Active · Démo</Badge>
                </div>
                <div>
                  <span>Communication chiffrée</span>
                  <Badge>Cible architecture</Badge>
                </div>
                <div>
                  <span>Journalisation des actions</span>
                  <Badge>Active · Démo</Badge>
                </div>
                <div>
                  <span>Utilisateurs autorisés</span>
                  <strong>{3 + additionalUsers.length}</strong>
                </div>
              </div>
              <Button icon="users" onClick={() => go("users")}>
                Gérer les utilisateurs
              </Button>
            </Card>
          </div>
        </>
      )
    if (page === "alert")
      return (
        <>
          <PageHeading
            title={demoEvents[selectedEvent].title}
            description={`Événement de démonstration · ${demoEvents[selectedEvent].desc}`}
            action={<Badge tone={selectedEvent === 2 ? "amber" : "green"}>{demoEvents[selectedEvent].badge}</Badge>}
          />
          <Card className="detail-card">
            <div className="alert-emblem">
              <Icon name="shield" size={42} />
            </div>
            <h2>{selectedEvent === 2 ? "Votre accès est resté protégé." : selectedEvent === 0 ? "Un déplacement autorisé." : "La connexion est rétablie."}</h2>
            <p>{selectedEvent === 2 ? "La demande n’a pas satisfait les critères d’autorisation." : demoEvents[selectedEvent].desc}</p>
            <div className="info-rows">
              <div>
                <span>Véhicule</span>
                <strong>Toyota Corolla · VH-001</strong>
              </div>
              <div>
                <span>Horodatage simulé</span>
                <strong>{demoEvents[selectedEvent].time} · Simulation</strong>
              </div>
              <div>
                <span>Source</span>
                <strong>SmartBox · SCB-DEMO-001</strong>
              </div>
              <div>
                <span>Statut</span>
                <Badge tone={selectedEvent === 2 ? "amber" : "green"}>{demoEvents[selectedEvent].badge}</Badge>
              </div>
              <div>
                <span>Action</span>
                <strong>{selectedEvent === 2 ? "Compte vérifié" : "Événement journalisé"} · Simulation</strong>
              </div>
            </div>
            <Button icon="clock" onClick={() => go("audit")}>
              Consulter le journal d’audit
            </Button>
          </Card>
        </>
      )
    if (page === "smartbox")
      return (
        <>
          <PageHeading
            title="Le lien entre vous et votre véhicule."
            description="Une SmartBox embarquée. Un écosystème connecté."
            action={<Badge dot>En ligne · Simulation</Badge>}
          />
          <div className="two-columns">
            <Card className="smartbox-card">
              <span className="overline">SMARTBOX · SCB-DEMO-001</span>
              <div className="hardware-scene">
                <div className="hardware-box">
                  <div className="hardware-top">
                    <Logo small />
                    <div className="hardware-indicators">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="hardware-label">
                      SMARTBOX
                      <br />
                      <small>CONNECTED VEHICLE MODULE</small>
                    </span>
                    <div className="hardware-lines" />
                  </div>
                </div>
                <div className="hardware-shadow" />
              </div>
              <h2>SCB-DEMO-001</h2>
              <p>Design conceptuel du boîtier · Hardware à valider</p>
              <div className="connection-foot">
                <Badge dot>Connectée · Démo</Badge>
                <small>Dernière communication : il y a 12 s</small>
              </div>
            </Card>
            <Card>
              <SectionTitle icon="signal">État de la SmartBox</SectionTitle>
              <div className="smartbox-stats">
                {[
                  ["4G / LTE", "Excellent", "signal"],
                  ["GPS / GNSS", "Disponible", "pin"],
                  ["Bluetooth LE", "Disponible", "phone"],
                  ["Véhicule", "Connecté", "car"],
                  ["Tension", "12,6 V", "battery"],
                  ["Température", "34 °C", "cpu"],
                ].map(([label, value, icon]) => (
                  <div key={label}>
                    <Icon name={icon as IconName} size={23} />
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <div className="firmware-line">
                <div>
                  <small>FIRMWARE</small>
                  <strong>v0.8.2</strong>
                </div>
                <Badge>À jour · Démo</Badge>
              </div>
              <Button
                icon="layers"
                className="full-width"
                onClick={() => go("architecture")}
              >
                Explorer l’architecture technique
              </Button>
            </Card>
          </div>
          <Card>
            <SectionTitle icon="shield">Pensée pour la fiabilité</SectionTitle>
            <div className="feature-row">
              {[
                ["shield", "Stockage sécurisé", "Protection des identifiants"],
                [
                  "battery",
                  "Gestion d’alimentation",
                  "Protection de la batterie",
                ],
                ["cpu", "IMU embarquée", "Détection des mouvements"],
              ].map(([i, t, d]) => (
                <div key={t}>
                  <Icon name={i as IconName} size={25} />
                  <h3>{t}</h3>
                  <p>{d} · Cible architecture</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )
    if (page === "maintenance")
      return (
        <>
          <PageHeading
            title="Prenez une longueur d’avance."
            description="Un entretien anticipé pour une mobilité qui dure."
            action={
              <Button icon="chart" onClick={() => go("costs")}>
                Coûts du véhicule
              </Button>
            }
          />
          <div className="two-columns">
            <Card className="service-hero">
              <span className="overline">PROCHAINE RÉVISION</span>
              <div className="maintenance-number">
                1 250 <span>km</span>
              </div>
              <p>À prévoir à 83 700 km</p>
              <div className="progress-track">
                <span />
              </div>
              <div className="info-rows">
                {[
                  ["Huile moteur", "Bon état"],
                  ["Freins", "Bon état"],
                  ["Batterie", "Bon état"],
                  ["Pneus", "À contrôler bientôt"],
                ].map(([label, status], i) => (
                  <div key={label}>
                    <span>{label}</span>
                    <Badge tone={i === 3 ? "amber" : "green"}>{status}</Badge>
                  </div>
                ))}
              </div>
              <p className="legal-note">
                États simulés. Non issus d’une inspection physique.
              </p>
            </Card>
            <Card>
              <SectionTitle icon="clock">Historique d’entretien</SectionTitle>
              <div className="vertical-timeline">
                {[
                  [
                    "Septembre 2026",
                    "Vidange moteur",
                    "81 200 km · Huile et filtre remplacés",
                  ],
                  [
                    "Juillet 2026",
                    "Inspection des freins",
                    "78 650 km · Contrôle préventif",
                  ],
                  [
                    "Mai 2026",
                    "Contrôle de la batterie",
                    "75 900 km · Tension normale",
                  ],
                ].map(([date, title, desc]) => (
                  <div key={date}>
                    <span className="timeline-dot" />
                    <small>{date}</small>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <section className="ai-banner">
            <div className="ai-emblem">
              <Icon name="spark" size={28} />
            </div>
            <div className="ai-banner-copy">
              <div className="ai-title">
                Entretenir aujourd’hui. Préserver demain.
              </div>
              <p>
                Anticipez la révision et faites contrôler vos pneus au prochain
                passage en atelier.
              </p>
              <small>Recommandation inférée · SmartCar AI</small>
            </div>
            <Button onClick={() => go("ai")}>
              En savoir plus <Icon name="arrow" size={16} />
            </Button>
          </section>
        </>
      )
    if (page === "costs")
      return (
        <>
          <PageHeading
            title="Votre mobilité, en chiffres."
            description="Une vision claire de votre budget automobile."
          />
          <div className="tabs">
            {["Mensuel", "Trimestriel", "Annuel"].map((p) => (
              <button
                key={p}
                className={p === period ? "active" : ""}
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <SimpleStats
            items={[
              [
                `Budget ${period.toLowerCase()}`,
                period === "Mensuel"
                  ? "145 000 FCFA"
                  : period === "Trimestriel"
                    ? "420 000 FCFA"
                    : "1 680 000 FCFA",
                "chart",
              ],
              [
                "Carburant",
                period === "Mensuel" ? "85 000 FCFA" : "255 000 FCFA",
                "car",
              ],
              [
                "Entretien",
                period === "Mensuel" ? "35 000 FCFA" : "105 000 FCFA",
                "tool",
              ],
            ]}
          />
          <Card>
            <SectionTitle icon="chart">
              Répartition des dépenses simulées
            </SectionTitle>
            <div className="cost-bars">
              {[
                ["Carburant", 58],
                ["Maintenance", 24],
                ["Assurance", 12],
                ["Réparations", 4],
                ["Autres", 2],
              ].map(([label, percent]) => (
                <div key={label}>
                  <span>{label}</span>
                  <div>
                    <span style={{ width: `${percent}%` }} />
                  </div>
                  <strong>{percent} %</strong>
                </div>
              ))}
            </div>
          </Card>
        </>
      )
    if (page === "users")
      return (
        <>
          <PageHeading
            title="La bonne personne. Le bon accès."
            description="Gérez les utilisateurs autorisés et leurs permissions."
            action={
              <Button
                variant="primary"
                icon="plus"
                onClick={() => setUserModal(true)}
              >
                Inviter un utilisateur
              </Button>
            }
          />
          <div className="user-grid">
            {[
              ["Koffi Modeste", "Propriétaire", "Accès complet", "KM"],
              [
                "Awa Konan",
                "Conductrice",
                "Véhicule, position et commandes",
                "AK",
              ],
              ["Garage Partner", "Maintenance", "Diagnostics uniquement", "GP"],
              ...additionalUsers.map((n) => [
                n,
                "Conducteur",
                "Accès véhicule · Invitation simulée",
                n
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join(""),
              ]),
            ].map(([name, role, access, initials]) => (
              <Card className="user-card" key={name}>
                <div className="avatar">{initials}</div>
                <h2>{name}</h2>
                <Badge tone={role === "Propriétaire" ? "green" : "gray"}>
                  {role}
                </Badge>
                <p>{access}</p>
                <div className="permission-list">
                  {[
                    "Accès véhicule",
                    "Localisation",
                    "Diagnostics",
                    "Commandes",
                    "Maintenance",
                    "Administration",
                  ].map((p, i) => (
                    <div key={p}>
                      <Icon
                        name={
                          role === "Propriétaire" ||
                          (role === "Maintenance" ? i === 2 || i === 4 : i < 4)
                            ? "check"
                            : "close"
                        }
                        size={15}
                      />
                      {p}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </>
      )
    if (page === "profile")
      return (
        <>
          <PageHeading
            title="Votre espace personnel."
            description="Vos préférences, vos accès et votre expérience SmartCar."
          />
          <div className="two-columns">
            <Card className="profile-card">
              <div className="avatar">KM</div>
              <h2>Koffi Modeste</h2>
              <p>koffi.modeste@example.com</p>
              <Badge>Propriétaire · Compte démo</Badge>
              <div className="profile-links">
                {[
                  ["users", "Utilisateurs autorisés", "users"],
                  ["key", "Clé digitale", "key"],
                  ["device", "Appareil & autorisations", "phone"],
                  ["compatibility", "Compatibilité véhicule", "car"],
                  ["design", "Design System", "layers"],
                ].map(([target, text, icon]) => (
                  <button key={target} onClick={() => go(target as Page)}>
                    <Icon name={icon as IconName} />
                    {text}
                    <Icon name="chevron" size={16} />
                  </button>
                ))}
              </div>
              <Button icon="logout" onClick={() => setFlow("login")}>
                Voir le parcours de connexion
              </Button>
            </Card>
            <Card>
              <SectionTitle icon="settings">Préférences</SectionTitle>
              <div className="toggle-row">
                <div>
                  <strong>Notifications de sécurité</strong>
                  <p>Être informé des événements importants.</p>
                </div>
                <button
                  className={`toggle ${notifications ? "on" : ""}`}
                  role="switch"
                  aria-checked={notifications}
                  aria-label="Notifications de sécurité"
                  onClick={() => setNotifications(!notifications)}
                >
                  <span />
                </button>
              </div>
              <div className="toggle-row">
                <div>
                  <strong>Suivi de localisation</strong>
                  <p>Préférence de démonstration, sans suivi réel.</p>
                </div>
                <button
                  className={`toggle ${gpsTracking ? "on" : ""}`}
                  role="switch"
                  aria-checked={gpsTracking}
                  aria-label="Suivi de localisation"
                  onClick={() => setGpsTracking(!gpsTracking)}
                >
                  <span />
                </button>
              </div>
              <label className="field">
                Langue
                <select>
                  <option>Français</option>
                </select>
              </label>
              <p className="legal-note">
                Vos préférences sont conservées uniquement pendant cette session
                de démonstration.
              </p>
            </Card>
          </div>
        </>
      )
    if (page === "device")
      return (
        <>
          <PageHeading
            title="Votre téléphone. Votre clé de confiance."
            description="Pilotez les capacités natives simulées de l’application mobile SmartCar Access."
            action={
              <Badge dot>
                {bleState === "connected"
                  ? "Appareil opérationnel"
                  : "Recherche en cours"}
              </Badge>
            }
          />
          <Card className="native-device-hero">
            <div className="native-phone">
              <Icon name="phone" size={31} />
              <span className="native-signal">
                <Icon name="signal" size={13} />
              </span>
            </div>
            <div>
              <span className="overline">APPAREIL DE CONFIANCE</span>
              <strong className="native-device-title">
                Smartphone de Koffi
              </strong>
              <p>
                iOS / Android · Session locale sécurisée · Dernière
                synchronisation à 10:42
              </p>
            </div>
            <div className="native-trust-score">
              <strong>4/4</strong>
              <small>services disponibles</small>
            </div>
          </Card>
          <div className="native-capability-grid">
            {[
              {
                icon: "signal" as IconName,
                title: "Bluetooth & BLE",
                description: "Détection et proximité de la SmartBox",
                active: bluetoothGranted,
                action: () => setBluetoothGranted(!bluetoothGranted),
                label: "Bluetooth",
              },
              {
                icon: "bell" as IconName,
                title: "Notifications push",
                description: "Alertes de sécurité et commandes",
                active: notifications,
                action: () => setNotifications(!notifications),
                label: "Notifications push",
              },
              {
                icon: "pin" as IconName,
                title: "Localisation",
                description: "Position du véhicule en arrière-plan",
                active: gpsTracking,
                action: () => setGpsTracking(!gpsTracking),
                label: "Localisation en arrière-plan",
              },
              {
                icon: "key" as IconName,
                title: "Biométrie",
                description: "Validation locale des actions sensibles",
                active: biometricsEnabled,
                action: () => setBiometricsEnabled(!biometricsEnabled),
                label: "Authentification biométrique",
              },
            ].map((capability) => (
              <Card className="native-capability" key={capability.title}>
                <div className="native-capability-icon">
                  <Icon name={capability.icon} size={21} />
                </div>
                <div>
                  <strong>{capability.title}</strong>
                  <p>{capability.description}</p>
                </div>
                <Button
                  variant="ghost"
                  className={`toggle ${capability.active ? "on" : ""}`}
                  role="switch"
                  aria-checked={capability.active}
                  aria-label={capability.label}
                  onClick={capability.action}
                >
                  <span />
                </Button>
              </Card>
            ))}
          </div>
          <div className="two-columns">
            <Card>
              <SectionTitle icon="cpu">Connexion SmartBox</SectionTitle>
              <div className="ble-device-row">
                <span
                  className={`ble-device-symbol ${bleState === "scanning" ? "scanning" : ""}`}
                >
                  <Icon name="cpu" size={24} />
                </span>
                <div>
                  <strong>SCB-DEMO-001</strong>
                  <p>Toyota Corolla 2018 · Signal excellent</p>
                </div>
                <Badge tone={bleState === "connected" ? "green" : "blue"} dot>
                  {bleState === "connected" ? "Connectée" : "Recherche"}
                </Badge>
              </div>
              <div className="native-detail-list">
                <div>
                  <span>Canal simulé</span>
                  <strong>BLE 5.2 chiffré</strong>
                </div>
                <div>
                  <span>Portée indicative</span>
                  <strong>8 mètres</strong>
                </div>
                <div>
                  <span>Clé de session</span>
                  <strong>Renouvelée · 10:42</strong>
                </div>
              </div>
              <Button
                className="full-width"
                icon={bleState === "scanning" ? "scan" : "signal"}
                onClick={scanForSmartBox}
                disabled={bleState === "scanning"}
              >
                {bleState === "scanning"
                  ? "Recherche de la SmartBox…"
                  : "Relancer la détection BLE"}
              </Button>
            </Card>
            <Card>
              <SectionTitle icon="shield">Protection locale</SectionTitle>
              <div className="secure-storage-block">
                <span>
                  <Icon name="key" size={28} />
                </span>
                <div>
                  <strong>Coffre sécurisé actif</strong>
                  <p>
                    Les jetons, clés digitales et secrets de session sont
                    isolés dans le stockage sécurisé simulé.
                  </p>
                </div>
              </div>
              <div className="toggle-row">
                <div>
                  <strong>Stockage sécurisé</strong>
                  <p>Simulation Keychain / Android Keystore.</p>
                </div>
                <Button
                  variant="ghost"
                  className={`toggle ${secureStorageEnabled ? "on" : ""}`}
                  role="switch"
                  aria-checked={secureStorageEnabled}
                  aria-label="Stockage sécurisé"
                  onClick={() =>
                    setSecureStorageEnabled(!secureStorageEnabled)
                  }
                >
                  <span />
                </Button>
              </div>
              <div className="native-security-note">
                <Icon name="info" size={16} />
                Intégrations simulées dans le prototype React. Les interfaces
                sont prêtes à être reliées aux plugins natifs Flutter.
              </div>
            </Card>
          </div>
        </>
      )
    if (page === "key")
      return (
        <>
          <PageHeading
            title="Votre clé, réinventée."
            description="Une vision pour l’accès automobile de demain."
          />
          <Card className="future-card">
            <Badge tone="gray">Version future · Non disponible</Badge>
            <div className="digital-key">
              <Icon name="key" size={56} />
              <Logo small />
              <strong>TOYOTA COROLLA</strong>
              <span>SECURE DIGITAL ACCESS</span>
            </div>
            <h2>L’accès digital sécurisé au véhicule.</h2>
            <p>
              Une fonctionnalité à l’étude, dépendante de la compatibilité
              véhicule et de la validation hardware.
            </p>
            <Button onClick={() => go("roadmap")}>
              Explorer la feuille de route <Icon name="arrow" size={16} />
            </Button>
          </Card>
        </>
      )
    if (page === "compatibility")
      return (
        <>
          <PageHeading
            title="La compatibilité, en toute transparence."
            description="Le périmètre réel dépendra des véhicules et de la validation hardware."
            action={
              <Button icon="plus" onClick={() => setFlow("add")}>
                Vérifier mon véhicule
              </Button>
            }
          />
          <Card>
            <SectionTitle icon="car">Périmètre du prototype</SectionTitle>
            <div className="search-field">
              <Icon name="search" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une marque ou un modèle…"
                aria-label="Rechercher un véhicule"
              />
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {[
                      "Véhicule",
                      "Année",
                      "Diagnostics",
                      "GPS",
                      "Lock",
                      "Unlock",
                      "Statut",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Toyota Corolla", "2018", "Validé · Prototype"],
                    ["Toyota Yaris", "2019", "Partiel"],
                    ["Hyundai Tucson", "2020", "En validation"],
                    ["Peugeot 308", "2017", "Non pris en charge"],
                  ]
                    .filter((r) =>
                      r.join(" ").toLowerCase().includes(search.toLowerCase()),
                    )
                    .map(([car, year, status], i) => (
                      <tr key={car}>
                        <td>
                          <strong>{car}</strong>
                        </td>
                        <td>{year}</td>
                        {[0, 1, 2, 3].map((j) => (
                          <td key={j}>
                            {i === 0 || (i === 1 && j < 2) ? (
                              <Icon name="check" size={17} />
                            ) : (
                              "—"
                            )}
                          </td>
                        ))}
                        <td>
                          <Badge
                            tone={
                              i === 0 ? "green" : i === 1 ? "amber" : "gray"
                            }
                          >
                            {status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <p className="legal-note">
              Compatibilité simulée pour la démonstration. Aucune fonction
              véhicule n’est certifiée pour une utilisation réelle.
            </p>
          </Card>
        </>
      )
    if (page === "architecture")
      return (
        <>
          <PageHeading
            title="Un écosystème. Une vision."
            description="SmartCar Access Architecture · Présentation au Centre Ivoirien de Robotique"
            action={
              <Button icon="arrow" onClick={() => go("roadmap")}>
                Notre roadmap
              </Button>
            }
          />
          <Card className="architecture-card">
            <div className="architecture-intro">
              <span className="overline">DE L’ACCÈS À L’INTELLIGENCE</span>
              <h2>
                Connecter le véhicule.
                <br />
                Donner du sens aux données.
              </h2>
              <p>Une architecture cible modulaire, sécurisée et évolutive.</p>
            </div>
            <div className="architecture-flow">
              <div className="architecture-node">
                <Icon name="phone" size={29} />
                <strong>Application mobile</strong>
                <small>Expérience conducteur</small>
              </div>
              <div className="flow-connector">HTTPS · AUTHENTIFICATION</div>
              <div className="architecture-node cloud-node">
                <Icon name="cloud" size={30} />
                <strong>Cloud API</strong>
                <div className="cloud-services">
                  <span>Données & Analytics</span>
                  <span>Sécurité & Autorisation</span>
                  <span>SmartCar AI</span>
                </div>
              </div>
              <div className="flow-connector">IoT / MQTT · 4G / LTE</div>
              <div className="architecture-node">
                <Icon name="cpu" size={30} />
                <strong>SmartBox embarquée</strong>
                <div className="cloud-services">
                  <span>GNSS</span>
                  <span>BLE</span>
                  <span>MCU</span>
                  <span>IMU</span>
                </div>
                <small>Secure Storage · Power Management</small>
              </div>
              <div className="flow-connector">
                OBD / CAN · COMPATIBILITÉ REQUISE
              </div>
              <div className="architecture-node">
                <Icon name="car" size={30} />
                <strong>Véhicule</strong>
                <small>Données & fonctions compatibles</small>
              </div>
            </div>
            <p className="legal-note">
              <Icon name="info" size={15} /> Architecture cible — validation
              hardware, sécurité et véhicule requise.
            </p>
          </Card>
          <div className="pillar-row">
            {[
              "Connecter",
              "Observer",
              "Comprendre",
              "Protéger",
              "Prédire",
              "Automatiser",
              "Assister",
            ].map((p, i) => (
              <div key={p}>
                <small>0{i + 1}</small>
                <strong>{p}</strong>
              </div>
            ))}
          </div>
        </>
      )
    if (page === "roadmap")
      return (
        <>
          <PageHeading
            title="Une ambition. Des étapes concrètes."
            description="Du prototype à une plateforme de Vehicle Intelligence."
            action={
              <Button onClick={() => go("vision")}>
                Découvrir la vision <Icon name="arrow" size={16} />
              </Button>
            }
          />
          <div className="roadmap-grid">
            {[
              ["Fondations", "Architecture", "UX/UI", "Étude véhicule"],
              ["Prototype", "SmartBox", "Cloud", "Mobile"],
              ["Intégration", "Véhicule", "OBD/CAN", "Télémétrie"],
              ["Intelligence", "Diagnostics", "Analytics", "IA"],
              ["Pilote", "Véhicules validés", "Tests terrain", "Sécurité"],
              ["Échelle", "Multimarque", "Flottes", "Partenaires"],
            ].map(([title, ...items], i) => (
              <Card
                key={title}
                className={`roadmap-card ${i === 0 ? "current" : ""}`}
              >
                <span className="overline">PHASE 0{i + 1}</span>
                <div className="phase-number">0{i + 1}</div>
                <h2>{title}</h2>
                {items.map((t) => (
                  <p key={t}>
                    <Icon name={i === 0 ? "check" : "arrow"} size={16} />
                    {t}
                  </p>
                ))}
                <Badge tone={i === 0 ? "green" : "gray"}>
                  {i === 0 ? "En conception" : "À venir"}
                </Badge>
              </Card>
            ))}
          </div>
          <section className="vision-strip">
            <Logo />
            <h2>From access to intelligence.</h2>
            <p>
              Une vision conçue en Côte d’Ivoire, pour une mobilité plus
              intelligente.
            </p>
          </section>
        </>
      )
    if (page === "vision")
      return (
        <>
          <PageHeading
            title="The Future of Connected Mobility"
            description="Transformer progressivement les véhicules traditionnels en véhicules intelligents."
          />
          <Card className="vision-card">
            <div className="eyebrow">SMARTCAR ACCESS · VISION</div>
            <h2>
              From access
              <br />
              to <em>intelligence.</em>
            </h2>
            <div className="intelligence-pipeline">
              {[
                "Véhicule connecté",
                "Données véhicule",
                "Vehicle Intelligence",
                "Maintenance prédictive",
                "Sécurité intelligente",
                "Mobilité intelligente",
              ].map((s, i) => (
                <div key={s}>
                  <span>0{i + 1}</span>
                  <strong>{s}</strong>
                  {i < 5 && <Icon name="arrow" size={19} />}
                </div>
              ))}
            </div>
            <p>
              Connecter → Observer → Comprendre → Protéger → Prédire →
              Automatiser → Assister
            </p>
            <Button onClick={() => go("architecture")}>
              Explorer l’architecture
            </Button>
          </Card>
        </>
      )
    if (page === "history" || page === "audit")
      return (
        <>
          <PageHeading
            title={
              page === "audit"
                ? "La confiance se trace."
                : "Chaque commande, en toute transparence."
            }
            description="Historique de démonstration. Aucune commande automobile réelle exécutée."
            action={
              <Button icon="download" onClick={downloadAudit}>
                Exporter le journal
              </Button>
            }
          />
          <Card>
            <SectionTitle icon="clock">
              {page === "audit"
                ? "Journal d’audit"
                : "Historique des commandes"}
            </SectionTitle>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {[
                      "Heure",
                      "Utilisateur",
                      "Action",
                      "Véhicule",
                      "Résultat",
                      "Source",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {commandHistory.map((h, i) => (
                    <tr key={i}>
                      <td>{h.time}</td>
                      <td>Koffi Modeste</td>
                      <td>{h.action}</td>
                      <td>VH-001</td>
                      <td>
                        <Badge tone={h.status === "Succès" ? "green" : "amber"}>
                          {h.status} · Simulé
                        </Badge>
                      </td>
                      <td>Mobile App</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )
    if (page === "admin")
      return (
        <>
          <PageHeading
            title="Une plateforme. Toute votre flotte."
            description="Vue opérationnelle globale · Environnement de démonstration CIR"
            action={
              <Button icon="download" onClick={downloadAudit}>
                Exporter le rapport
              </Button>
            }
          />
          <SimpleStats
            items={[
              ["Véhicules connectés", "1 284", "car"],
              ["SmartBoxes en ligne", "1 231", "cpu"],
              ["Alertes actives", "18", "alert"],
              ["Anomalies diagnostics", "47", "scan"],
              ["Commandes aujourd’hui", "3 842", "lock"],
              ["Disponibilité système", "99,8 %", "cloud"],
            ]}
          />
          <div className="two-columns">
            <Card>
              <SectionTitle icon="chart">Véhicules connectés</SectionTitle>
              <div className="chart-summary">
                <strong>1 284</strong>
                <Badge>+12,8 % ce mois</Badge>
              </div>
              <svg
                className="line-chart"
                viewBox="0 0 600 220"
                aria-label="Progression simulée des véhicules connectés"
                role="img"
              >
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--green)" stopOpacity=".18" />
                    <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[40, 90, 140, 190].map((y) => (
                  <path
                    key={y}
                    d={`M0 ${y}H600`}
                    stroke="var(--line)"
                    strokeDasharray="4 4"
                  />
                ))}
                <path
                  d="M0 180 55 164 100 169 150 137 200 143 250 95 300 100 350 76 400 91 450 40 500 47 550 28 600 12V220H0Z"
                  fill="url(#chartFill)"
                />
                <path
                  d="m0 180 55-16 45 5 50-32 50 6 50-48 50 5 50-24 50 15 50-51 50 7 50-19 50-16"
                  fill="none"
                  stroke="var(--green)"
                  strokeWidth="3"
                />
              </svg>
              <div className="chart-labels">
                <span>Mai</span>
                <span>Juin</span>
                <span>Juillet</span>
                <span>Août</span>
                <span>Sept.</span>
                <span>Oct.</span>
              </div>
            </Card>
            <Card>
              <SectionTitle icon="chart">Santé de la flotte</SectionTitle>
              <div className="fleet-health">
                <HealthRing value={88} />
                <div>
                  <p>
                    <span className="mini-dot" /> Excellente{" "}
                    <strong>72 %</strong>
                  </p>
                  <p>
                    <span className="mini-dot amber" /> À surveiller{" "}
                    <strong>23 %</strong>
                  </p>
                  <p>
                    <span className="mini-dot gray" /> Critique{" "}
                    <strong>5 %</strong>
                  </p>
                </div>
              </div>
              <Button
                className="full-width"
                onClick={() => go("adminDiagnostics")}
              >
                Consulter les diagnostics <Icon name="arrow" size={16} />
              </Button>
            </Card>
          </div>
          <Card>
            <SectionTitle icon="phone">Services de l’application mobile</SectionTitle>
            <div className="admin-mobile-services">
              {[
                ["Appareils actifs", "986", "98,7 %", "phone"],
                ["Sessions BLE", "742", "Stable", "signal"],
                ["Push délivrés", "12 480", "99,4 %", "bell"],
                ["Coffres sécurisés", "981", "Conformes", "shield"],
              ].map(([label, value, status, icon]) => (
                <div key={label}>
                  <span className="admin-service-icon">
                    <Icon name={icon as IconName} size={19} />
                  </span>
                  <div>
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </div>
                  <Badge>{status}</Badge>
                </div>
              ))}
            </div>
            <div className="admin-service-foot">
              <span>
                <span className="mini-dot" /> Passerelle mobile opérationnelle
              </span>
              <span>
                Dernière télémétrie simulée · Aujourd’hui à 10:42
              </span>
            </div>
          </Card>
          <Card>
            <SectionTitle
              icon="car"
              action="Tous les véhicules"
              onAction={() => go("adminVehicles")}
            >
              Véhicules récemment synchronisés
            </SectionTitle>
            {renderAdminTable("vehicles")}
          </Card>
        </>
      )
    if (
      page === "adminVehicles" ||
      page === "adminBoxes" ||
      page === "adminDiagnostics"
    )
      return (
        <>
          <PageHeading
            title={titles[page] || ""}
            description="Supervision de la flotte · Toutes les données sont fictives."
            action={
              <Button icon="download" onClick={downloadAudit}>
                Exporter les données de démo
              </Button>
            }
          />
          {page === "adminDiagnostics" && (
            <SimpleStats
              items={[
                ["Analyses effectuées", "2 847", "scan"],
                ["Anomalies détectées", "47", "alert"],
                ["Sévérité modérée", "28", "engine"],
              ]}
            />
          )}
          <Card>
            <div className="search-field">
              <Icon name="search" size={18} />
              <input
                aria-label="Rechercher dans la flotte"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un véhicule, un propriétaire, une SmartBox…"
              />
            </div>
            {renderAdminTable(
              page === "adminBoxes"
                ? "boxes"
                : page === "adminDiagnostics"
                  ? "diagnostics"
                  : "vehicles",
            )}
          </Card>
        </>
      )
    if (page === "design")
      return (
        <>
          <PageHeading
            title="Une identité. Un langage commun."
            description="SmartCar Access Design System · Automotive / African Contemporary"
          />
          <Card>
            <SectionTitle icon="layers">Palette sémantique</SectionTitle>
            <div className="swatch-row">
              {["graphite", "green", "bronze", "ivory", "amber"].map((c) => (
                <div key={c}>
                  <span className={`swatch ${c}`} />
                  <strong>{c}</strong>
                </div>
              ))}
            </div>
            <SectionTitle>Typographie · Manrope</SectionTitle>
            <h1>Connected Vehicle Intelligence</h1>
            <h2>La mobilité, en toute confiance.</h2>
            <p className="body-copy">
              Une hiérarchie claire, des chiffres lisibles, des actions
              explicites.
            </p>
          </Card>
          <div className="two-columns">
            <Card>
              <SectionTitle>Actions & interactions</SectionTitle>
              <div className="component-examples">
                <Button
                  variant="primary"
                  onClick={() => setToast("Action primaire · Design System")}
                >
                  Primaire
                </Button>
                <Button
                  onClick={() => setToast("Action secondaire · Design System")}
                >
                  Secondaire
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setToast("Action discrète · Design System")}
                >
                  Discrète
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setToast("Action sensible · Démonstration")}
                >
                  Destructive
                </Button>
                <Button disabled>Désactivé</Button>
              </div>
              <label className="field">
                Champ texte
                <input placeholder="Votre identifiant" />
              </label>
            </Card>
            <Card>
              <SectionTitle>États sémantiques</SectionTitle>
              <div className="component-examples">
                <Badge dot>En ligne</Badge>
                <Badge tone="gray">Hors ligne</Badge>
                <Badge tone="amber">Attention</Badge>
                <Badge tone="blue">En cours</Badge>
                <Badge>Succès</Badge>
                <Badge tone="gray">Inconnu</Badge>
              </div>
              <HealthRing />
            </Card>
          </div>
        </>
      )
    return null
  }

  function renderAdminTable(type: "vehicles" | "boxes" | "diagnostics") {
    const data = [
      [
        "VH-001",
        "Koffi Modeste",
        "Toyota Corolla",
        "SCB-DEMO-001",
        "92",
        "2 min",
      ],
      ["VH-002", "Awa Konan", "Toyota Yaris", "SCB-DEMO-002", "89", "1 min"],
      ["VH-003", "Yao Kouamé", "Hyundai Tucson", "SCB-DEMO-003", "76", "5 min"],
      ["VH-004", "CIR · Flotte", "Toyota Hilux", "SCB-DEMO-004", "95", "3 min"],
    ]
    const heads =
      type === "vehicles"
        ? [
            "Véhicule",
            "Propriétaire",
            "Modèle",
            "SmartBox",
            "Statut",
            "Santé",
            "Dernière sync.",
          ]
        : type === "boxes"
          ? [
              "SmartBox",
              "Véhicule",
              "Firmware",
              "4G / GPS",
              "Température",
              "Tension",
              "Statut",
            ]
          : ["Véhicule", "Propriétaire", "DTC", "Sévérité", "Détecté", "Action"]
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {heads.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data
              .filter((r) =>
                r.join(" ").toLowerCase().includes(search.toLowerCase()),
              )
              .map(([id, owner, car, box, health, sync], i) => (
                <tr
                  key={id}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === "Enter") e.currentTarget.click() }}
                  onClick={() => id === "VH-001" ? go(type === "boxes" ? "smartbox" : type === "diagnostics" ? "dtc" : "vehicle") : setToast(`${car} · ${id} : fiche détaillée hors du périmètre de la démo. Explorez VH-001, Toyota Corolla.`)}
                  className="clickable-row"
                >
                  {type === "vehicles" ? (
                    <>
                      <td>
                        <strong>{id}</strong>
                      </td>
                      <td>{owner}</td>
                      <td>{car}</td>
                      <td>{box}</td>
                      <td>
                        <Badge dot>En ligne</Badge>
                      </td>
                      <td>
                        <strong className="green-text">{health}</strong> /100
                      </td>
                      <td>
                        {sync} <Icon name="chevron" size={13} />
                      </td>
                    </>
                  ) : type === "boxes" ? (
                    <>
                      <td>
                        <strong>{box}</strong>
                      </td>
                      <td>{id}</td>
                      <td>v0.8.2</td>
                      <td>Excellent / Disponible</td>
                      <td>{34 + i} °C</td>
                      <td>12,6 V</td>
                      <td>
                        <Badge dot>En ligne</Badge>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <strong>{id}</strong>
                        <small>{car}</small>
                      </td>
                      <td>{owner}</td>
                      <td>P0420</td>
                      <td>
                        <Badge tone="amber">Modérée</Badge>
                      </td>
                      <td>Aujourd’hui · 10:24</td>
                      <td>
                        <Button variant="ghost" onClick={() => go("dtc")}>
                          Voir <Icon name="arrow" size={14} />
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )
  }

  const adminNav: NavigationItem[] = [
    { id: "admin", name: "Dashboard", icon: "grid" },
    { id: "users", name: "Utilisateurs", icon: "users" },
    { id: "adminVehicles", name: "Véhicules", icon: "car" },
    { id: "adminBoxes", name: "SmartBoxes", icon: "cpu" },
    { id: "compatibility", name: "Compatibilité", icon: "layers" },
    { id: "history", name: "Commandes", icon: "lock" },
    { id: "adminDiagnostics", name: "Diagnostics", icon: "scan" },
    { id: "adminSecurity", name: "Sécurité & incidents", icon: "shield" },
    { id: "maintenance", name: "Maintenance", icon: "tool" },
    { id: "audit", name: "Journal d’audit", icon: "clock" },
  ]
  const onboardContent = [
    [
      "Connectez votre véhicule.",
      "Un lien intelligent entre votre smartphone, le cloud et votre voiture.",
      "phone",
    ],
    [
      "Comprenez votre véhicule.",
      "Des données lisibles, des diagnostics en contexte et des recommandations utiles.",
      "chart",
    ],
    [
      "Protégez votre mobilité.",
      "Gardez le contrôle de vos accès et suivez les événements importants.",
      "shield",
    ],
    [
      "Votre mobilité commence ici.",
      "Ajoutez votre véhicule et découvrez l’expérience SmartCar Access.",
      "car",
    ],
  ]

  return (
    <div className="app-shell">
      {menuOpen && (
        <div className="sidebar-scrim" onClick={() => setMenuOpen(false)} />
      )}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <Logo />
        <div className="workspace-selector">
          <div className="workspace-icon">
            <Icon name={mode === "driver" ? "car" : "layers"} size={19} />
          </div>
          <div>
            <strong>
              {mode === "driver"
                ? "Mon espace véhicule"
                : "Espace administration"}
            </strong>
            <small>
              {mode === "driver"
                ? "Compte personnel"
                : "Plateforme de démonstration"}
            </small>
          </div>
        </div>
        <div className="nav-label">
          {mode === "driver" ? "MON VÉHICULE" : "PLATEFORME"}
        </div>
        <nav>
          {(mode === "driver" ? navigation : adminNav).map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`nav-item ${
                page === n.id ||
                (n.id === "diagnostics" && page === "dtc") ||
                (n.id === "security" && page === "alert")
                  ? "active"
                  : ""
              }`}
            >
              <Icon name={n.icon} size={19} />
              <span>{n.name}</span>
              {"tag" in n && n.tag && (
                <span className={`nav-tag ${n.tag === "AI" ? "ai" : ""}`}>
                  {n.tag}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="nav-divider" />
        <div className="nav-label">ÉCOSYSTÈME</div>
        <nav>
          <button
            className={`nav-item ${page === "architecture" ? "active" : ""}`}
            onClick={() => go("architecture")}
          >
            <Icon name="layers" size={19} />
            <span>Architecture</span>
            <Icon name="external" size={13} />
          </button>
          <button
            className={`nav-item ${page === "roadmap" ? "active" : ""}`}
            onClick={() => go("roadmap")}
          >
            <Icon name="route" size={19} />
            <span>Vision & Roadmap</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="prototype-side">
            <span className="prototype-icon">
              <Icon name="layers" size={17} />
            </span>
            <div>
              <strong>Le futur se construit ici.</strong>
              <p>Prototype de présentation CIR</p>
              <button
                onClick={() =>
                  changeMode(mode === "driver" ? "admin" : "driver")
                }
              >
                {mode === "driver"
                  ? "Explorer l’administration"
                  : "Revenir à mon véhicule"}{" "}
                <Icon name="arrow" size={14} />
              </button>
            </div>
          </div>
          <button className="profile-switch" onClick={() => go("profile")}>
            <span className="avatar">KM</span>
            <div>
              <strong>Koffi Modeste</strong>
              <small>Propriétaire</small>
            </div>
            <Icon name="settings" size={18} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Icon name="menu" />
            </button>
            <span>Mon espace</span>
            <Icon name="chevron" size={12} />
            <strong>{titles[page]}</strong>
          </div>
          <div className="topbar-right">
            <span className="prototype-badge">
              <span />
              PROTOTYPE — DONNÉES SIMULÉES
            </span>
            <span className="topbar-divider" />
            <button
              className="notification-button"
              onClick={() => go("security")}
              aria-label="Consulter les événements de sécurité"
            >
              <Icon name="bell" size={20} />
              <span />
            </button>
            <button
              className="topbar-avatar avatar"
              onClick={() => go("profile")}
              aria-label="Mon profil"
            >
              KM
            </button>
          </div>
        </header>
        <main>
          {renderPage()}
          <footer className="page-footer">
            <span>
              SMARTCAR ACCESS <span>·</span> Connected Vehicle Intelligence
            </span>
            <span>
              Conçu pour le CIR <span className="footer-dot" /> Abidjan, Côte
              d’Ivoire
            </span>
          </footer>
        </main>
      </div>
      <nav className="mobile-bottom-nav">
        {[
          { id: "home", label: "Accueil", icon: "grid" },
          { id: "vehicle", label: "Véhicule", icon: "car" },
          { id: "security", label: "Sécurité", icon: "shield" },
          { id: "ai", label: "AI", icon: "spark" },
          { id: "profile", label: "Profil", icon: "users" },
        ].map((n) => (
          <button
            key={n.id}
            className={page === n.id ? "active" : ""}
            onClick={() => go(n.id as Page)}
          >
            <Icon name={n.icon as IconName} size={21} />
            <span>{n.label}</span>
          </button>
        ))}
      </nav>
      <aside
        className={`presenter-console ${presenterOpen ? "open" : ""}`}
        aria-label="Console de démonstration"
      >
        {presenterOpen && (
          <div className="presenter-panel">
            <div className="presenter-head">
              <div>
                <span className="presenter-kicker">PARCOURS CIR</span>
                <strong>Scénarios de présentation</strong>
                <small>Choisissez un moment clé de la démonstration.</small>
              </div>
              <Button
                variant="ghost"
                icon="close"
                className="presenter-close"
                onClick={() => setPresenterOpen(false)}
                aria-label="Fermer la console de démonstration"
              />
            </div>
            <div className="presenter-progress">
              <span>
                {activeScenario
                  ? `Étape ${activeScenario} active`
                  : "Prêt à présenter"}
              </span>
              <span>8 scénarios</span>
            </div>
            <div className="presenter-list">
              {presenterScenarios.map((scenario, index) => (
                <Button
                  key={scenario.label}
                  variant="ghost"
                  className={activeScenario === index + 1 ? "active" : ""}
                  onClick={() => runScenario(index + 1)}
                >
                  <span className="presenter-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="presenter-scenario-icon">
                    <Icon name={scenario.icon} size={16} />
                  </span>
                  <span className="presenter-scenario-copy">
                    <strong>{scenario.label}</strong>
                    <small>{scenario.detail}</small>
                  </span>
                  <Icon name="chevron" size={14} />
                </Button>
              ))}
            </div>
            <div className="presenter-foot">
              <span className="status-dot" />
              PROTOTYPE — DONNÉES SIMULÉES
            </div>
          </div>
        )}
        <Button
          variant="primary"
          icon={presenterOpen ? "close" : "layers"}
          className="presenter-trigger"
          onClick={() => setPresenterOpen((open) => !open)}
          aria-expanded={presenterOpen}
        >
          {presenterOpen ? "Fermer" : "Mode présentation"}
          {!presenterOpen && activeScenario && (
            <span className="presenter-active-dot">{activeScenario}</span>
          )}
        </Button>
      </aside>
      {toast && (
        <div className="toast" role="status">
          <Icon name="check" size={20} />
          <span>{toast}</span>
          <button
            onClick={() => setToast("")}
            aria-label="Fermer la notification"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
      {command && (
        <div className="modal-backdrop">
          <section
            className="modal command-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-title"
          >
            <button
              className="modal-close"
              onClick={() => {
                if (commandState !== "processing") setCommand(null)
              }}
              disabled={commandState === "processing"}
              aria-label="Fermer"
            >
              <Icon name="close" />
            </button>
            <span className="overline">TOYOTA COROLLA · SIMULATION</span>
            <div
              className={`command-emblem ${
                commandState === "failed" ? "failed" : ""
              }`}
            >
              {commandState === "processing" ? (
                <span className="spinner large" />
              ) : (
                <Icon
                  name={
                    commandState === "success"
                      ? "check"
                      : commandState === "failed" || commandState === "unknown"
                        ? "alert"
                        : command
                  }
                  size={38}
                />
              )}
            </div>
            <h2 id="command-title">
              {commandState === "confirm"
                ? `${
                    command === "lock" ? "Verrouiller" : "Déverrouiller"
                  } le véhicule ?`
                : commandState === "processing"
                  ? "Autorisation de la commande…"
                  : commandState === "success"
                    ? "Commande simulée réussie."
                    : commandState === "failed"
                      ? "La commande simulée a échoué."
                      : "Résultat de la commande inconnu."}
            </h2>
            <p>
              {commandState === "confirm"
                ? "Cette action nécessite votre confirmation. Elle sera exécutée uniquement dans le prototype."
                : commandState === "processing"
                  ? "Vérification des droits et simulation de l’exécution."
                  : commandState === "success"
                    ? `La Corolla est ${
                        command === "lock" ? "verrouillée" : "déverrouillée"
                      } dans la simulation.`
                    : commandState === "failed"
                      ? "La SmartBox n’a pas confirmé la commande. Vous pouvez relancer la simulation."
                      : "Aucune confirmation reçue. Ne considérez pas le véhicule comme verrouillé ou déverrouillé."}
            </p>
            <div className="modal-note">
              <Icon name="info" size={17} /> Simulation — aucune action sur un
              véhicule réel.
            </div>
            {commandState === "confirm" ? (
              <div className="center-buttons">
                <Button onClick={() => setCommand(null)}>Annuler</Button>
                <Button variant="primary" onClick={executeCommand}>
                  Confirmer la simulation
                </Button>
              </div>
            ) : commandState !== "processing" ? (
              <Button
                variant="primary"
                className="full-width"
                onClick={() => {
                  setCommand(null)
                }}
              >
                Terminer
              </Button>
            ) : null}
            {commandState !== "confirm" && commandState !== "processing" && (
              <button
                className="text-link centered"
                onClick={() => {
                  setCommand(null)
                  go("history")
                }}
              >
                Voir l’historique <Icon name="arrow" size={14} />
              </button>
            )}
          </section>
        </div>
      )}
      {userModal && (
        <div className="modal-backdrop">
          <form
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-title"
            onSubmit={(e) => {
              e.preventDefault()
              setAdditionalUsers((a) => [...a, userName])
              setUserModal(false)
              setUserName("")
              setToast("Invitation simulée créée. Aucun email réel envoyé.")
            }}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setUserModal(false)}
              aria-label="Fermer"
            >
              <Icon name="close" />
            </button>
            <span className="overline">ACCÈS AUTORISÉS</span>
            <h2 id="invite-title">Inviter un utilisateur</h2>
            <p>Toyota Corolla · Accès conducteur</p>
            <label className="field">
              Nom complet
              <input
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nom et prénom"
              />
            </label>
            <label className="field">
              Adresse email
              <input type="email" required placeholder="nom@example.com" />
            </label>
            <label className="field">
              Rôle
              <select>
                <option>Conducteur — Accès véhicule</option>
              </select>
            </label>
            <Button type="submit" variant="primary" className="full-width">
              Créer l’invitation simulée
            </Button>
          </form>
        </div>
      )}
      {flow && (
        <div className="flow-backdrop">
          <div className="flow-brand-panel">
            <Logo />
            <div className="flow-story">
              <span className="eyebrow">CENTRE IVOIRIEN DE ROBOTIQUE</span>
              <h1>
                La connexion.
                <br />
                La confiance.
                <br />
                <em>L’intelligence.</em>
              </h1>
              <p>Votre véhicule, réinventé.</p>
              <img
                src="https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=1200&q=85"
                alt="Toyota Corolla blanche — illustration de la mobilité connectée"
              />
            </div>
            <span className="prototype-badge">
              PROTOTYPE — DONNÉES SIMULÉES
            </span>
          </div>
          <section
            className="flow-form"
            role="dialog"
            aria-modal="true"
            aria-labelledby="flow-title"
          >
            <button
              className="modal-close"
              onClick={() => setFlow(null)}
              aria-label="Retour au tableau de bord"
            >
              <Icon name="close" />
            </button>
            <Logo small />
            {flow === "login" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setFlow("onboarding")
                }}
              >
                <span className="overline">CONNECTED VEHICLE INTELLIGENCE</span>
                <h2 id="flow-title">
                  Bienvenue dans
                  <br />
                  SmartCar Access.
                </h2>
                <p>Votre mobilité commence ici.</p>
                <label className="field">
                  Email
                  <input
                    type="email"
                    defaultValue="koffi.modeste@example.com"
                    required
                  />
                </label>
                <label className="field">
                  Mot de passe
                  <input
                    type="password"
                    defaultValue="demo2026"
                    required
                    minLength={4}
                  />
                </label>
                <button
                  type="button"
                  className="text-link"
                  onClick={() =>
                    setToast(
                      "Mode prototype : utilisez les identifiants de démonstration préremplis.",
                    )
                  }
                >
                  Mot de passe oublié ?
                </button>
                <Button type="submit" variant="primary" className="full-width">
                  Se connecter · Démo <Icon name="arrow" size={16} />
                </Button>
                <Button
                  type="button"
                  className="full-width"
                  icon="scan"
                  onClick={() => {
                    setFlow("onboarding")
                    setToast("Biométrie simulée — aucun capteur utilisé.")
                  }}
                >
                  Continuer avec la biométrie
                </Button>
                <p className="legal-note">
                  Pas de compte réel ni d’authentification connectée.
                </p>
              </form>
            )}
            {flow === "onboarding" && (
              <div>
                <div className="onboarding-visual">
                  <Icon
                    name={onboardContent[onboarding][2] as IconName}
                    size={70}
                  />
                  <div className="orbit one" />
                  <div className="orbit two" />
                </div>
                <div className="onboarding-dots">
                  {onboardContent.map((_, i) => (
                    <span
                      className={i === onboarding ? "active" : ""}
                      key={i}
                    />
                  ))}
                </div>
                <h2 id="flow-title">{onboardContent[onboarding][0]}</h2>
                <p>{onboardContent[onboarding][1]}</p>
                <Button
                  variant="primary"
                  className="full-width"
                  onClick={() => {
                    if (onboarding < 3) setOnboarding(onboarding + 1)
                    else setFlow("add")
                  }}
                >
                  {onboarding < 3 ? "Suivant" : "Ajouter mon véhicule"}
                  <Icon name="arrow" size={16} />
                </Button>
                <button
                  className="text-link centered"
                  onClick={() => {
                    setFlow(null)
                    go("home")
                  }}
                >
                  Explorer directement la démo
                </button>
              </div>
            )}
            {flow === "add" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setFlow("compatibility")
                }}
              >
                <span className="overline">01 / 03 · MON VÉHICULE</span>
                <h2 id="flow-title">Connectons votre véhicule.</h2>
                <p>Véhicule de référence pour la démonstration.</p>
                <label className="field">
                  Marque
                  <select>
                    <option>Toyota</option>
                  </select>
                </label>
                <label className="field">
                  Modèle
                  <select>
                    <option>Corolla</option>
                  </select>
                </label>
                <div className="form-row">
                  <label className="field">
                    Année
                    <select>
                      <option>2018</option>
                    </select>
                  </label>
                  <label className="field">
                    Motorisation
                    <select>
                      <option>Essence</option>
                    </select>
                  </label>
                </div>
                <p className="legal-note">
                  Les autres véhicules seront étudiés lors de la phase
                  d’intégration.
                </p>
                <Button variant="primary" type="submit" className="full-width">
                  Vérifier la compatibilité <Icon name="arrow" size={16} />
                </Button>
              </form>
            )}
            {flow === "compatibility" && (
              <div>
                <span className="overline">02 / 03 · COMPATIBILITÉ</span>
                <h2 id="flow-title">Un premier périmètre validé.</h2>
                <p>Toyota Corolla · 2018 · Simulation</p>
                <div className="info-rows">
                  {[
                    ["Diagnostics", true],
                    ["GPS", true],
                    ["Verrouillage", true],
                    ["Déverrouillage", true],
                    ["Coffre", false],
                    ["Démarrage à distance", false],
                  ].map(([label, supported]) => (
                    <div key={String(label)}>
                      <span>{label}</span>
                      {supported ? (
                        <Icon name="check" size={19} />
                      ) : (
                        <span>Non disponible</span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="legal-note">
                  Compatibilité validée uniquement pour le périmètre fictif du
                  prototype. Validation hardware requise.
                </p>
                <Button
                  variant="primary"
                  className="full-width"
                  onClick={() => setFlow("pair")}
                >
                  Associer ma SmartBox <Icon name="arrow" size={16} />
                </Button>
              </div>
            )}
            {flow === "pair" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setFlow(null)
                  go("home")
                  setToast("SmartBox SCB-DEMO-001 associée dans la simulation.")
                }}
              >
                <span className="overline">03 / 03 · SMARTBOX</span>
                <h2 id="flow-title">Le lien est presque établi.</h2>
                <p>Associez votre SmartBox de démonstration.</p>
                <div className="qr-demo">
                  <Icon name="scan" size={80} />
                  <small>QR DE DÉMONSTRATION</small>
                </div>
                <Button
                  type="button"
                  className="full-width"
                  icon="scan"
                  onClick={() =>
                    setToast(
                      "QR simulé reconnu : SCB-DEMO-001. Aucun accès caméra.",
                    )
                  }
                >
                  Simuler le scan QR
                </Button>
                <label className="field">
                  Identifiant SmartBox
                  <input
                    defaultValue="SCB-DEMO-001"
                    required
                    pattern="SCB-DEMO-001"
                  />
                </label>
                <Button type="submit" variant="primary" className="full-width">
                  Associer · Simulation <Icon name="arrow" size={16} />
                </Button>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
