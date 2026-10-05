import type { ButtonHTMLAttributes, ReactNode } from "react"

export type IconName = "grid" | "car" | "shield" | "spark" | "pin" | "route" | "tool" | "cpu" | "users" | "settings" | "chevron" | "arrow" | "plus" | "bell" | "lock" | "unlock" | "battery" | "engine" | "signal" | "check" | "close" | "clock" | "external" | "logout" | "chart" | "layers" | "info" | "search" | "send" | "cloud" | "phone" | "key" | "scan" | "download" | "menu" | "calendar" | "eye" | "alert"
const paths: Record<IconName, ReactNode> = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  car: (
    <>
      <path d="m5 8 2-4h10l2 4M3 10l2-2h14l2 2v8H3Z" />
      <path d="M6 18v2m12-2v2M6 13h2m8 0h2M3 8H1m20 0h2" />
    </>
  ),
  shield: (
    <>
      <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  spark: (
    <>
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" />
      <path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5Z" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  route: (
    <>
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M7 5h10a4 4 0 0 1 0 8H7a3 3 0 0 0 0 6h10" />
    </>
  ),
  tool: (
    <path d="M14 6a5 5 0 0 0-6 6l-5 5a2.8 2.8 0 0 0 4 4l5-5a5 5 0 0 0 6-6l-4 4-4-4Z" />
  ),
  cpu: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="3" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-3a6 6 0 0 1 12 0v3m1-17a3 3 0 0 1 0 6m2 5a5 5 0 0 1 3 4v2" />
    </>
  ),
  settings: (
    <>
      <path d="m9 3-1 3-3 1-2 3 2 2-1 4 3 2 3-1 3 3 3-2 1-3 4-1v-4l-3-2-1-4h-4Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  chevron: <path d="m9 5 7 7-7 7" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M10 21h4" />
      <path d="M12 2v1" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" />
    </>
  ),
  unlock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 7-2m-3 9v3" />
    </>
  ),
  battery: (
    <>
      <rect x="3" y="6" width="16" height="12" rx="2" />
      <path d="M21 10v4M7 12h4m-2-2v4m5-2h2" />
    </>
  ),
  engine: (
    <>
      <path d="M6 8h11l4 4v7H7l-3-4V8Zm3-3h6m-3 0v3M1 11v5m0-3h3m17 0h2v6h-2" />
    </>
  ),
  signal: (
    <>
      <path d="M4 20v-4m5 4v-8m5 8V8m5 12V4" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  external: (
    <>
      <path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
    </>
  ),
  logout: (
    <>
      <path d="M9 3H4v18h5m5-14 5 5-5 5M8 12h11" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18M7 15l4-5 4 3 6-8" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 10 5-10 5L2 8ZM2 12l10 5 10-5M2 16l10 5 10-5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10v.1" />
    </>
  ),
  search: (
    <>
      <circle cx="10" cy="10" r="6" />
      <path d="m15 15 6 6" />
    </>
  ),
  send: <path d="m22 2-7 20-4-9-9-4Zm-11 11L22 2" />,
  cloud: <path d="M6 19a5 5 0 0 1-1-10 7 7 0 0 1 13-2 6 6 0 0 1 0 12Z" />,
  phone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M10 18h4" />
    </>
  ),
  key: (
    <>
      <circle cx="7" cy="8" r="5" />
      <path d="m11 12 10 10m-5-5 3-3m-6 0 3-3" />
    </>
  ),
  scan: (
    <>
      <path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5M2 12h20" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4m10-4v4M3 11h18m-13 4h1m6 0h1" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12S6 5 12 5s10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  alert: (
    <>
      <path d="m12 3 10 18H2Z" />
      <path d="M12 9v5m0 3v.1" />
    </>
  ),
}
export function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
export function Button({
  children,
  variant = "secondary",
  icon,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  icon?: IconName
}) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {icon && <Icon name={icon} size={18} />} {children}
    </button>
  )
}
export function Badge({
  children,
  tone = "green",
  dot = false,
}: {
  children: ReactNode
  tone?: "green" | "amber" | "gray" | "blue"
  dot?: boolean
}) {
  return (
    <span className={`badge badge-${tone}`}>
      {dot && <span className="status-dot" />}
      {children}
    </span>
  )
}
export function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return <section className={`card ${className}`}>{children}</section>
}
export function SectionTitle({
  children,
  icon,
  action,
  onAction,
}: {
  children: ReactNode
  icon?: IconName
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="section-title">
      <h3>
        {icon && <Icon name={icon} size={18} />} {children}
      </h3>
      {action && (
        <button className="text-link" onClick={onAction}>
          {action}
          <Icon name="chevron" size={14} />
        </button>
      )}
    </div>
  )
}
export function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className={`brand ${small ? "small" : ""}`}>
      <div className="brand-mark">
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path
            d="m20 3 14 8v17l-14 9L6 28V11Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="m12 21 3-7h10l3 7v7H12Zm0 0h16m-12 7v3m8-3v3M17 18h6"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <circle cx="20" cy="9" r="2" fill="currentColor" />
        </svg>
      </div>
      <div>
        <strong>
          SMARTCAR<span> ACCESS</span>
        </strong>
        <small>CONNECTED VEHICLE INTELLIGENCE</small>
      </div>
    </div>
  )
}
export function HealthRing({ value = 92 }: { value?: number }) {
  return (
    <div className="health-ring">
      <svg viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r="73"
          fill="none"
          stroke="var(--green-light)"
          strokeWidth="10"
        />
        <circle
          cx="90"
          cy="90"
          r="73"
          fill="none"
          stroke="var(--green)"
          strokeWidth="10"
          strokeDasharray={`${value * 4.587} 459`}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div>
        <strong>
          {value}
          <span>/100</span>
        </strong>
        <small>HEALTH SCORE</small>
        <span className="health-rating">Excellent</span>
      </div>
    </div>
  )
}
export function MapIllustration({ large = false }: { large?: boolean }) {
  return (
    <div className={`map-art ${large ? "large" : ""}`}>
      <svg
        viewBox="0 0 600 260"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Carte illustrative de Cocody, Abidjan — position simulée"
      >
        <rect width="600" height="260" fill="#eef0e8" />
        <path
          d="M430-20C390 50 440 90 365 135S250 230 290 280H620V-20Z"
          fill="#d9e8e4"
        />
        <g fill="#e0e5d9">
          <path d="M10 10h90v45H10ZM130 10h105v70H130ZM260 15h87v43h-87ZM15 105h96v62H15ZM149 110h86v55h-86ZM260 90h74v50h-74ZM24 200h95v55H24ZM152 190h81v65h-81Z" />
        </g>
        <g stroke="#fff" strokeWidth="12" fill="none">
          <path d="M-10 88 345 75 470 0M120-10l8 290M-10 184l290-14 180-53M242-10l6 280" />
          <path d="m32-20 180 310M310-10l-32 155 84 160" strokeWidth="7" />
        </g>
        <g stroke="#d7dbcf" strokeWidth="1" fill="none">
          <path d="M-10 88 345 75 470 0M120-10l8 290M-10 184l290-14 180-53M242-10l6 280" />
        </g>
        <text
          x="164"
          y="47"
          fill="#838b79"
          fontSize="11"
          fontFamily="sans-serif"
        >
          COCODY
        </text>
        <text
          x="420"
          y="211"
          fill="#73958c"
          fontSize="10"
          fontFamily="sans-serif"
        >
          Lagune Ébrié
        </text>
        <text
          x="14"
          y="242"
          fill="#89907e"
          fontSize="9"
          fontFamily="sans-serif"
        >
          PLATEAU
        </text>
        <circle cx="251" cy="134" r="37" fill="#1b6852" opacity=".08" />
        <circle cx="251" cy="134" r="22" fill="#1b6852" opacity=".1" />
        <circle
          cx="251"
          cy="134"
          r="12"
          fill="#1b6852"
          stroke="white"
          strokeWidth="4"
        />
      </svg>
      <span className="map-label">
        <Icon name="car" size={14} /> Toyota Corolla
      </span>
      <span className="map-disclaimer">Carte illustrative · Simulation</span>
    </div>
  )
}
