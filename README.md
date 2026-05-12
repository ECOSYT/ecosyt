# ECOSYT

Plateforme SaaS de production digitale assistée par IA, centrée sur un AST comme source de vérité, avec compilation déterministe et collaboration temps réel native.

> Référence : [Spécification d’architecture système](docs/ECOSYT%20%E2%80%94%20Sp%C3%A9cification%20d%27Architecture%20Syst%C3%A8me.md) (Version 2.0 — Spécification de Production)

## Sommaire

- [Présentation](#présentation)
- [Vision et objectifs](#vision-et-objectifs)
- [Problèmes adressés et valeur](#problèmes-adressés-et-valeur)
- [Architecture du système](#architecture-du-système)
- [Flux clés](#flux-clés)
- [Modules et applications](#modules-et-applications)
- [Périmètre fonctionnel](#périmètre-fonctionnel)
- [Communication inter-systèmes](#communication-inter-systèmes)
- [Persistance et scalabilité](#persistance-et-scalabilité)
- [Exigences non fonctionnelles](#exigences-non-fonctionnelles)
- [Sécurité et gouvernance](#sécurité-et-gouvernance)
- [Choix technologiques](#choix-technologiques)
- [Roadmap d’implémentation](#roadmap-dimplémentation)
- [Risques, patterns et anti-patterns](#risques-patterns-et-anti-patterns)

## Qualité et sécurité du repo

Le repo embarque un socle CI/CD GitHub Actions pour garantir la qualité et la sécurité :

- **Quality workflow** (`.github/workflows/quality.yml`)
  - `format:check`
  - `lint`
  - `typecheck`
  - `test` (hors e2e/performance)
  - `build`
- **Security workflow** (`.github/workflows/security.yml`)
  - `CodeQL` (PR, `main` et scan planifié hebdomadaire)
- **CI workflow** (`.github/workflows/ci.yml`)
  - gates qualité + sécurité centralisés (lint, tests, build, audit des dépendances, gitleaks, couverture, duplication)

Documents de gouvernance :

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [SECURITY.md](SECURITY.md)
- [CODEOWNERS](CODEOWNERS)

Commandes locales recommandées avant PR :

- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Présentation

ECOSYT est conçu comme un système distribué de manipulation d’AST synchronisé en temps réel, déployé en SaaS multi-tenant.

Positionnement synthétique de la spécification :

```text
ECOSYT = Figma (collaboration) + Webflow (builder) + GitHub (code) + IA (génération)
         organisés en système cohérent autour d'un AST central
```

Mission centrale : réduire par ×10 le coût cognitif, technique et temporel entre une idée et un produit digital déployé, sans sacrifier la maintenabilité, la collaboration et la liberté technique.

## Vision et objectifs

### Vision long terme

- Standard de production digitale assistée
- Extensibilité native (plugins, nouveaux types de nœuds, nouvelles cibles de génération)
- APIs publiques pour intégrations tierces et migrations
- Déploiement multi-régions
- Écosystème marketplace (composants et templates)

### Objectifs stratégiques à 18 mois

| Objectif         | Indicateur                         | Cible    |
| ---------------- | ---------------------------------- | -------- |
| Adoption produit | Projets actifs créés               | > 10 000 |
| Rétention        | Projets revisités à 30j            | > 60%    |
| Valeur technique | Taux d’export code utilisé en prod | > 30%    |
| Collaboration    | Sessions multi-user par projet     | > 2      |
| Performance      | Latence builder interaction P95    | < 16ms   |
| Disponibilité    | SLA plateforme                     | > 99.9%  |

## Problèmes adressés et valeur

ECOSYT adresse notamment :

- La complexité technique du développement web
- Le lock-in des outils no-code
- La fragmentation design/dev/contenu
- L’IA déconnectée du projet réel
- L’absence de collaboration robuste dans les builders
- Le coût élevé des cycles d’itération

Valeur visée :

- Compression du cycle idée → prototype déployable de 2–4 semaines à 1–2 jours
- Production par profils non-développeurs sur les cas couverts
- Export de code React maintenable et exploitable hors plateforme

## Architecture du système

### Choix architectural

Architecture **hybride monorepo modulaire** :

- `packages/` : cœur système (cohérence, maintenabilité, performance intra-process)
- `apps/` : services isolés (scalabilité indépendante)

### Principes fondamentaux

1. **AST-first** : toute fonctionnalité est conçue autour de l’impact AST
2. **Anti lock-in** : export et sortie de plateforme possibles
3. **Collaboration native** : CRDT intégré aux fondations
4. **IA structurelle** : l’IA produit des mutations AST valides
5. **Déterminisme** : même AST, même résultat de compilation

### Séparation stricte des responsabilités

- **AST** : structure, invariants, mutations
- **Compiler** : AST → IR → code (pur, déterministe)
- **Runtime** : exécution réactive fine-grained
- **Sync** : collaboration CRDT et transport
- **Builder-UI** : interaction utilisateur et affichage UI d’édition
- **API** : persistance, sécurité, permissions
- **Sync-server** : transport WebSocket stateless

### Dépendances directionnelles

```text
shared ← ast ← compiler ← runtime ← builder-ui ← web
                         ↑
                       sync
                         ↑
                    sync-server

shared ← api
```

## Flux clés

### 1) Édition locale

Action utilisateur → `builder-ui` → mutation AST validée → émission d’événement AST → compilation incrémentale + sync CRDT → runtime → patch DOM ciblé (< 16ms).

### 2) Collaboration entrante

Update distante via sync-server → merge Yjs côté `packages/sync` → traduction en mutations AST → recompilation incrémentale → mise à jour runtime + awareness.

### 3) Persistance

`apps/api` valide auth/permissions, sérialise AST + état CRDT, écrit métadonnées et snapshots (PostgreSQL), cache (Redis), état binaire (object storage).

### 4) Export de code

AST stabilisé → pipeline complet (normalisation, AST→IR, optimisation, codegen React/TS) → ZIP ou push GitHub/GitLab ou déploiement Vercel/Netlify.

### 5) Génération IA

Prompt + contexte projet → AI Engine multi-agents → mutations AST validées → intégration immédiate dans le flux standard de compilation/rendu.

## Modules et applications

### Packages internes

- `packages/ast` : source de vérité, mutations, validation, historique, sérialisation
- `packages/compiler` : pipeline AST → IR → code, mode incrémental et complet
- `packages/runtime` : moteur réactif push-based, fine-grained, glitch-free
- `packages/sync` : mapping AST ↔ Yjs, propagation locale/distante, awareness
- `packages/builder-ui` : interface React du builder, sans logique métier
- `packages/shared` : types/contrats transverses
- `packages/tools` : outillage (AST Viewer, benchmarks)

### Applications

- `apps/web` : frontend React (routing, providers, session, orchestration)
- `apps/api` : backend NestJS (auth, permissions, persistance, exports, IA)
- `apps/sync-server` : WebSocket stateless, rooms document, relay CRDT, scaling Redis Pub/Sub

## Périmètre fonctionnel

### Core system

- Project Engine (cycle de vie projet)
- Component System (natif + custom + variants + slots)
- Rendering Engine (preview temps réel responsive)
- State Management (local/page/projet)
- Versioning (snapshots, rollback, historique multi-user)
- Real-time Engine (CRDT, awareness, offline/reconciliation)

### Interfaces

- Builder visuel (canvas, inspector, layers, shortcuts)
- Dashboard projets
- Interface de collaboration
- Console développeur (AST viewer, graphe dépendances, timeline, code preview)
- Admin panel (membres, rôles, facturation, intégrations)

### Services internes

- AI Engine multi-agents
- Export Engine
- SEO Analyzer
- Asset Manager
- Notification System

### Intégrations externes

- GitHub / GitLab
- Vercel / Netlify
- OpenAI / Anthropic
- CMS (Contentful, Sanity, Strapi)
- Analytics (Google Analytics, Plausible)

## Communication inter-systèmes

- **Frontend → Backend** : HTTP/1.1 ou HTTP/2, JSON, JWT Bearer
- **Frontend → Sync-server** : WebSocket (sync + awareness)
- **Sync-server inter-instances** : Redis Pub/Sub
- **Intra-packages** : appels TypeScript synchrones avec dépendances directionnelles strictes

## Persistance et scalabilité

### Stockage hybride

- **Hot** : Redis (cache documents actifs, sessions, metadata légère)
- **Warm** : PostgreSQL (snapshots JSON, métadonnées SaaS)
- **Cold** : object storage S3/GCS (état CRDT binaire, event log, assets, archives export)

### Snapshots

- Snapshots automatiques par seuil d’opérations/temps
- Snapshots manuels nommés
- Restauration avec snapshot de sécurité préalable, reconstruction CRDT et invalidation cache

### Scalabilité horizontale

- Load balancer L7
- Multiples instances API et sync-server
- Sticky sessions WS
- Coordination temps réel par Redis Pub/Sub

## Exigences non fonctionnelles

### Performance

- Interaction builder P95 < 16ms
- Propagation CRDT P95 < 100ms
- Chargement projet P95 < 2s
- Compilation export (100 nœuds) P95 < 3s
- 60 FPS cible en édition active

### Scalabilité cible

Jusqu’à 100 000 utilisateurs simultanés, 1 000 000 projets actifs, 200 collaborateurs/document selon les phases.

### Disponibilité et résilience

- SLA cible : 99.9%
- RTO < 30 min
- RPO < 5 min
- Circuit breaker, retry exponentiel, health checks, graceful shutdown, bulkheads

### Observabilité

Métriques Prometheus couvrant API, sync-server, compilation, runtime et métriques business.

## Sécurité et gouvernance

- Authentification JWT double-token (access court + refresh cookie httpOnly)
- Rotation/révocation refresh tokens et détection de réutilisation
- Autorisation RBAC (`owner`, `admin`, `editor`, `viewer`)
- TLS 1.3, HSTS, chiffrement au repos (bcrypt, AES-256-GCM)
- Validation stricte des entrées, sanitisation, CORS restreint

## Choix technologiques

| Composant        | Choix retenu               |
| ---------------- | -------------------------- |
| Langage          | TypeScript 6.x             |
| Monorepo         | pnpm + Turborepo           |
| Backend          | NestJS 11.x                |
| ORM              | TypeORM                    |
| Frontend         | React 18.x + TypeScript    |
| State UI         | Zustand                    |
| Requêtes API     | TanStack Query             |
| CRDT             | Yjs                        |
| DB               | PostgreSQL 18.x            |
| Cache / PubSub   | Redis 8.x                  |
| Jobs             | BullMQ                     |
| Object storage   | AWS S3 / GCS               |
| Monitoring       | Prometheus + Grafana       |
| Logging          | Pino + ELK                 |
| Tests            | Vitest + Playwright        |
| CI/CD            | GitHub Actions             |
| Containerisation | Docker + Kubernetes (prod) |

### ADRs structurants

1. AST plat (NodeMap) indexé par ID
2. CRDT (Yjs) plutôt qu’Operational Transform
3. IR intermédiaire obligatoire entre AST et code
4. Runtime basé sur signals
5. Event sourcing pour historique + undo/redo

## Roadmap d’implémentation

Ordre de construction validé :

1. Fondation AST
2. Builder minimal
3. Runtime réactif
4. Compilateur
5. Collaboration CRDT
6. Persistance et SaaS
7. IA et fonctionnalités avancées

La roadmap détaille, pour chaque phase, livrables, critères de sortie et contraintes d’exécution.

## Risques, patterns et anti-patterns

### Risques majeurs identifiés

- Rigidité/flexibilité du modèle AST
- Bugs CRDT en collaboration intensive
- Qualité du code généré
- Performance builder sur gros projets
- Risques sécurité (injection via IA)
- Risques de migration de schéma AST

### Patterns recommandés

- Command (mutations AST)
- Visitor (passes compilateur)
- Observer/signals (runtime)
- Repository (persistance)
- Strategy (résolution conflits CRDT)

### Anti-patterns interdits

- État UI couplé à l’AST
- CRDT implémenté avant stabilisation AST
- Génération directe AST → code sans IR
- Mutations trop grossières (non prop-level)
- Persistance avant validation complète

---

Pour la spécification exhaustive (modèle AST formel, pipeline détaillé, exigences complètes, cas d’usage, glossaire), consulter :

- [Spécification d’architecture système](docs/ECOSYT%20%E2%80%94%20Sp%C3%A9cification%20d%27Architecture%20Syst%C3%A8me.md)
