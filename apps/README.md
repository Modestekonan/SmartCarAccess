# Applications SmartCar Access

Ce dépôt contient deux applications déployables indépendamment qui partagent
le design system et les composants métier du prototype.

## Application mobile

- Dossier : `apps/mobile`
- Entrée : `apps/mobile/src/main.tsx`
- Build : `pnpm build:mobile`
- Sortie : `apps/mobile/dist`

Cette application démarre directement dans l’espace conducteur. Elle comprend
le véhicule, les commandes, la localisation, les diagnostics, la sécurité,
SmartCar AI, la SmartBox et les intégrations mobiles simulées.

## Administration web

- Dossier : `apps/admin-web`
- Entrée : `apps/admin-web/src/main.tsx`
- Build : `pnpm build:admin`
- Sortie : `apps/admin-web/dist`

Cette application démarre directement dans la console d’administration,
verrouille la navigation principale sur les outils d’administration et
n’expose pas le mode présentateur mobile. Les fiches véhicule détaillées
restent partagées avec le socle métier.

## Code partagé

- Application et logique de prototype : `src/App.tsx`
- Design system local : `src/ui.tsx`
- Styles et tokens : `src/index.css`
- Ressources : `public`

Le point d’entrée historique à la racine reste disponible comme vitrine
combinée Figma Make. Il peut être construit avec `pnpm build`.
