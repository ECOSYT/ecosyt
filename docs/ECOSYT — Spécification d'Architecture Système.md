# ECOSYT — Spécification d'Architecture Système
## Dossier Technique Complet · Cahier des Charges de Niveau Industriel
### Version 3.0 — Spécification Technique Enrichie (Production-Grade)

---

> **Statut :** Document de référence — Usage interne ingénierie, architecture & stakeholders  
> **Niveau de confidentialité :** Interne — Diffusion restreinte  
> **Destinataires :** Équipe technique, architectes, lead developers, product management  
> **Date :** 2026  
> **Révision :** 2.0 — Document étendu (spécification complète)

---

## TABLE DES MATIÈRES

```
PARTIE I — VISION ET STRATÉGIE
  1.  Résumé exécutif
  2.  Vision stratégique et mission
  3.  Positionnement produit et analyse marché
  4.  Utilisateurs cibles et personas
  5.  Périmètre fonctionnel complet

PARTIE II — ARCHITECTURE GLOBALE DU SYSTÈME
  6.  Principes architecturaux fondamentaux
  7.  Structure du monorepo
  8.  Vue d'ensemble des flux système
  9.  Règles architecturales non négociables
  10. Modèle de communication inter-systèmes

PARTIE III — SPÉCIFICATION DES MODULES INTERNES (packages/)
  11. packages/ast — Cœur du système
  12. packages/compiler — Pipeline de transformation
  13. packages/runtime — Moteur réactif
  14. packages/sync — Couche CRDT
  15. packages/builder-ui — Interface builder
  16. packages/shared — Contrats communs
  17. packages/tools — Outillage développement

PARTIE IV — SPÉCIFICATION DES APPLICATIONS (apps/)
  18. apps/web — Frontend application
  19. apps/api — Backend NestJS
  20. apps/sync-server — Serveur WebSocket

PARTIE V — SPÉCIFICATIONS TECHNIQUES PROFONDES
  21. Modèle AST — Spécification formelle complète
  22. Pipeline de compilation — Spécification technique détaillée
  23. Runtime réactif — Spécification technique détaillée
  24. Système de collaboration CRDT — Spécification complète
  25. Système de persistance et scaling

PARTIE VI — EXIGENCES ET CONTRAINTES
  26. Exigences fonctionnelles détaillées
  27. Exigences non fonctionnelles
  28. Contraintes techniques
  29. Sécurité et gouvernance

PARTIE VII — CONCEPTION ET MISE EN ŒUVRE
  30. Cas d'usage détaillés
  31. Modèle de données complet
  32. Choix technologiques et justifications
  33. Hypothèses de conception
  34. Risques et points critiques
  35. Stratégie de mise en œuvre et roadmap
  36. Méthode d'exécution par phase

PARTIE VIII — RÉFÉRENCE
  37. Différenciation stratégique
  38. Benchmarks et comparatifs
  39. Patterns et anti-patterns
  40. Glossaire technique complet
```

---

# PARTIE I — VISION ET STRATÉGIE

---

## 1. Résumé exécutif

### 1.1 Nature du projet

ECOSYT est une **plateforme SaaS de production digitale assistée par intelligence artificielle**, architecturée autour d'un système de données interne cohérent (AST), d'un moteur de compilation déterministe, et d'un runtime réactif haute performance.

Le projet se distingue fondamentalement des outils no-code existants par trois innovations structurelles articulées en système cohérent :

- **Un modèle de données interne unifié (AST)** comme source de vérité unique, manipulable par l'IA, exportable et versionnable
- **Un pipeline de compilation déterministe** produisant du code React/TypeScript production-grade, maintenable et indépendant de la plateforme
- **Un runtime réactif fine-grained** garantissant une performance d'exécution de niveau applicatif, avec un moteur de collaboration multi-utilisateur natif basé sur CRDT

### 1.2 Positionnement synthétique

```
ECOSYT = Figma (collaboration) + Webflow (builder) + GitHub (code) + IA (génération)
         organisés en système cohérent autour d'un AST central
```

### 1.3 Mission centrale

> Réduire par un facteur ×10 le coût cognitif, technique et temporel entre une idée et un produit digital déployé, sans sacrifier la maintenabilité, la collaboration, ni la liberté technique.

### 1.4 Architecture en une phrase

ECOSYT est un **système distribué de manipulation d'AST synchronisé en temps réel, doté d'un compilateur intégré et d'un runtime réactif**, déployé en SaaS multi-tenant avec collaboration native.

### 1.5 Périmètre du présent document

Ce document constitue la spécification complète du système ECOSYT, couvrant :
- L'architecture globale et ses principes directeurs
- La spécification technique formelle de chaque module
- Les exigences fonctionnelles et non fonctionnelles
- Les flux de données et interactions inter-systèmes
- Le modèle de données et les invariants système
- La roadmap de construction et la méthode d'exécution

Il est conçu pour être utilisable directement par les équipes d'ingénierie, les architectes, et les décideurs techniques sans nécessiter de documentation complémentaire.

---

## 2. Vision stratégique et mission

### 2.1 Vision long terme

ECOSYT ambitionne de devenir le **standard de production digitale assistée** dans les cinq prochaines années, en occupant la position d'infrastructure de création logicielle pour les équipes non-techniques et semi-techniques.

La plateforme est conçue dès l'origine pour une extensibilité maximale :

**Écosystème marketplace :** Composants et templates tiers, vendus ou partagés par la communauté, intégrables directement dans l'AST ECOSYT.

**APIs publiques :** Exposition programmatique de l'AST et du compilateur pour permettre des intégrations tierces, des outils de migration depuis d'autres plateformes, et des extensions développeur.

**Déploiement multi-régions :** Infrastructure distribuée géographiquement pour répondre aux exigences de latence des marchés enterprise internationaux.

**Modèle d'extensibilité par plugins :** Nouveaux types de nœuds AST, nouveaux générateurs de code, nouvelles cibles de déploiement, intégrables sans modification du cœur système.

### 2.2 Objectifs stratégiques à 18 mois

| Objectif | Indicateur | Cible |
|---|---|---|
| Adoption produit | Projets actifs créés | > 10 000 |
| Rétention | Projets revisités à 30j | > 60% |
| Valeur technique | Taux d'export code utilisé en prod | > 30% |
| Collaboration | Sessions multi-user par projet | > 2 |
| Performance | Latence builder interaction P95 | < 16ms |
| Disponibilité | SLA plateforme | > 99.9% |

### 2.3 Analyse des problèmes résolus

Le tableau suivant détaille précisément les problèmes adressés et la réponse architecturale d'ECOSYT à chacun :

| Problème identifié | Manifestation concrète | Limite des solutions actuelles | Réponse ECOSYT |
|---|---|---|---|
| Complexité du développement web | Une landing page simple requiert HTML/CSS/JS, un framework, un déploiement | Nécessite 2-5 ans d'expertise pour être productive | Builder visuel + génération IA sur AST |
| Rigidité du no-code | Webflow/Bubble ne permettent pas de logique dynamique complexe | Lock-in total, export inexistant ou inutilisable | AST expressif + export React production-grade |
| Fragmentation des outils | Figma (design) ≠ VSCode (dev) ≠ CMS (contenu) ≠ Analytics | Synchronisation manuelle, erreurs, perte de temps | Système unifié autour de l'AST |
| IA non intégrée aux workflows | ChatGPT génère du code déconnecté du projet | Copier-coller manuel, pas d'itération structurée | IA opérant directement sur l'AST |
| Absence de collaboration builder | Webflow/Framer mono-utilisateur ou collaboration superficielle | Multi-user impossible ou dégradé | CRDT natif dès les fondations |
| Coût d'itération élevé | Chaque modification design → dev → test → deploy | Cycle de 2-5 jours pour une itération | Preview temps réel, pipeline automatisé |

### 2.4 Valeur produit quantifiée

**Compression du cycle produit :** L'objectif est de réduire le cycle idée → prototype déployable de 2-4 semaines à 1-2 jours, soit un facteur ×10 à ×20.

**Réduction de la dépendance technique :** Un profil non-développeur doit pouvoir produire un output digital de qualité production sans intervention d'un ingénieur pour les cas d'usage couverts.

**Préservation de la maintenabilité :** Contrairement aux outils no-code existants, le code exporté par ECOSYT doit être maintenable, lisible et évolutif par n'importe quel développeur React.

### 2.5 Principes de conception non négociables

Ces principes guident chaque décision architecturale et de product design :

1. **AST-first :** Toute fonctionnalité est pensée en termes d'impact sur le modèle AST avant d'être pensée en termes d'UI
2. **Anti lock-in :** L'utilisateur doit pouvoir quitter ECOSYT à tout moment avec son projet complet en code maintenable
3. **Collaboration native :** Pas de collaboration ajoutée en surface — le CRDT est une propriété fondamentale de l'architecture
4. **IA structurelle :** L'IA ne produit pas du texte — elle produit des mutations AST valides
5. **Déterminisme de la compilation :** Le même AST produit toujours le même code, sans ambiguïté

---

## 3. Positionnement produit et analyse marché

### 3.1 Cartographie des concurrents

#### 3.1.1 Webflow

**Nature :** Builder visuel no-code orienté web marketing, avec CMS intégré.

**Architecture probable :** Monolithe évolué avec rendu serveur, base de données relationnelle classique.

**Forces :**
- Rendu CSS précis
- Abstractions composants matures
- Écosystème d'agences établi
- CMS intégré

**Faiblesses exploitables par ECOSYT :**
- Lock-in total (aucun export code exploitable)
- Pas d'IA native dans le workflow
- Collaboration très limitée côté builder
- Logique dynamique simpliste
- Pas d'export vers repository Git

**Positionnement ECOSYT vs Webflow :** ECOSYT cible les utilisateurs Webflow frustrés par le lock-in et l'absence d'IA.

#### 3.1.2 Figma

**Nature :** Outil de design collaboratif. Pas un builder au sens ECOSYT.

**Architecture :** Event-driven + CRDT (référence du marché pour la collaboration temps réel).

**Forces :**
- Collaboration temps réel exceptionnelle
- Performance canvas
- Écosystème de plugins riche

**Faiblesses exploitables :**
- Pas de logique dynamique
- Export code non-production
- Pas d'IA structurelle
- Le design n'est pas l'application

**Positionnement ECOSYT vs Figma :** ECOSYT est l'étape suivante après Figma — le design devient l'application.

#### 3.1.3 Framer

**Nature :** Builder hybride design+code, ciblant les designers qui veulent du code.

**Architecture :** Hybride React.

**Forces :**
- Proximité du code React
- Animations avancées
- Bonne UX designer

**Faiblesses exploitables :**
- Logique dynamique et data binding limités
- Pas de CRDT natif
- Export limité
- IA absente du workflow

#### 3.1.4 Bubble

**Nature :** No-code full-stack, très orienté applications métier.

**Architecture :** Monolithe propriétaire.

**Forces :**
- Logique métier avancée
- Base de données intégrée
- Workflows automatisés

**Faiblesses exploitables :**
- Performance très faible (rendu serveur lent)
- Lock-in total
- Pas d'export
- UX complexe et daté

### 3.2 Matrice de positionnement

| Dimension | Webflow | Figma | Framer | Bubble | **ECOSYT** |
|---|---|---|---|---|---|
| Export code production | ❌ | ❌ | ⚠️ | ❌ | ✅ |
| Collaboration CRDT native | ❌ | ✅ | ❌ | ❌ | ✅ |
| IA intégrée au modèle | ❌ | ❌ | ❌ | ❌ | ✅ |
| Logique dynamique | ⚠️ | ❌ | ⚠️ | ✅ | ✅ |
| Anti lock-in | ❌ | ❌ | ⚠️ | ❌ | ✅ |
| Performance runtime | ⚠️ | ✅ | ✅ | ❌ | ✅ |
| Versioning avancé | ⚠️ | ✅ | ❌ | ❌ | ✅ |

### 3.3 Opportunités de différenciation

Trois fenêtres d'opportunité structurelles sont identifiées :

**Fenêtre 1 — IA au niveau du modèle :** Aucun concurrent ne permet à l'IA de manipuler directement le modèle interne de données du projet. ECOSYT est le premier système où l'IA génère des mutations AST valides, directement intégrables et éditables.

**Fenêtre 2 — Export anti-lock-in :** Le marché no-code est dominé par des acteurs dont le modèle économique repose sur le lock-in. ECOSYT se positionne à contre-courant avec un export code production-grade comme feature de premier rang.

**Fenêtre 3 — Collaboration comme propriété fondamentale :** La collaboration est ajoutée en surface dans les outils existants. ECOSYT l'intègre au niveau des fondations architecturales (CRDT sur l'AST), ce qui rend impossible le rattrapage par des concurrents existants sans refonte complète.

---

## 4. Utilisateurs cibles et personas

### 4.1 Persona 1 — Le Créateur Indépendant

**Profil :** Freelancer, solopreneur, maker. Compétences techniques modérées. Veut produire rapidement des outputs digitaux professionnels.

**Besoins :**
- Créer des landing pages, portfolios, MVPs sans coder
- Exporter le code pour confier l'évolution à un développeur
- Utiliser l'IA pour accélérer la phase de génération de contenu et de structure

**Frustrations actuelles :**
- Webflow : trop cher, lock-in, pas d'IA
- Bubble : trop complexe, performance mauvaise
- Framer : trop orienté design, pas assez fonctionnel

**Jobs to be done :** "Je veux lancer mon projet en ligne en moins d'une semaine, et pouvoir confier le code à un développeur si ça prend de l'ampleur."

### 4.2 Persona 2 — L'Équipe Produit en Startup

**Profil :** Équipe de 3-10 personnes (1-2 devs, 1-2 designers, 1 product manager). Besoin de vitesse et de collaboration.

**Besoins :**
- Prototyper rapidement sans surinvestir en dev
- Collaborer en temps réel sur les maquettes et les implémentations
- Générer du code que les devs peuvent intégrer dans leur stack existante
- Itérer rapidement avec l'IA pour explorer des directions produit

**Frustrations actuelles :**
- Figma pour le design, mais le passage design → code est douloureux
- Pas de solution qui unifie design + logique + collaboration + export

**Jobs to be done :** "Je veux que mon équipe puisse travailler ensemble sur le produit — designers et devs — sans silos, et sortir du code réel."

### 4.3 Persona 3 — L'Agence Digitale

**Profil :** Agence de 5-50 personnes, gérant plusieurs projets clients simultanément.

**Besoins :**
- Templates réutilisables entre projets
- Collaboration équipe + client
- Versioning et historique pour les retours clients
- Export vers les CMS et stacks clients

**Frustrations actuelles :**
- Webflow : lock-in, pas de multi-projet efficace
- Fragmentation entre les outils (Figma + CMS + dev)

**Jobs to be done :** "Je veux livrer plus vite, réutiliser mon travail entre projets, et permettre à mes clients de voir l'avancement en temps réel."

### 4.4 Systèmes externes comme utilisateurs

En tant que plateforme extensible, ECOSYT traite également des systèmes logiciels comme utilisateurs :

- **APIs partenaires :** Services tiers qui lisent ou écrivent dans l'AST ECOSYT via API publique
- **Plugins développeurs :** Extensions qui ajoutent de nouveaux types de composants ou de nouvelles cibles de compilation
- **Services de déploiement :** Plateformes de hosting qui reçoivent le code compilé et déclenchent le déploiement automatiquement

---

## 5. Périmètre fonctionnel complet

### 5.1 Core System — Modules fondamentaux

**Project Engine**
- Création, duplication, archivage, suppression de projets
- Organisation hiérarchique (Organisation → Projets → Pages → Composants)
- Cycle de vie complet avec états explicites (draft, published, archived)
- Versioning et historique de modifications avec attribution

**Component System**
- Bibliothèque de composants natifs (Text, Image, Button, Container, Grid, Flex, Icon, Form, Input, Select…)
- Système de composants custom (création, édition, publication dans l'organisation)
- Composants dérivés (variants, overrides de props)
- Système de slots (zones de contenu dynamique dans les composants)
- Props dynamiques et bindings avec le state

**Rendering Engine**
- Transformation AST → affichage interactif dans le canvas du builder
- Preview temps réel sans latence perceptible lors de l'édition
- Mode preview complet (simulation d'un navigateur dans le builder)
- Responsive preview (mobile, tablette, desktop)

**State Management**
- State local par composant (scoped signals)
- State global par page (page-level signals)
- State global par projet (project-level signals)
- Persistance du state (local storage, API)
- Formulaires et validation

**Versioning System**
- Snapshot automatique à intervalles configurables
- Snapshots manuels nommés (jalons)
- Diff visuel entre versions
- Rollback vers n'importe quelle version
- Historique multi-user avec attribution par auteur

**Real-time Engine**
- Synchronisation multi-utilisateur via CRDT
- Awareness (présence, curseurs, sélections)
- Commentaires et annotations sur les nœuds
- Résolution automatique des conflits structurels
- Mode offline avec réconciliation à la reconnexion

### 5.2 Interfaces utilisateurs

**Builder visuel (canvas)**
- Canvas drag & drop avec grille et guides d'alignement
- Sélection, redimensionnement, déplacement de composants
- Sélection multiple et opérations groupées
- Panneau d'inspection des propriétés (props, style, bindings, events)
- Panneau de layers (arbre des composants)
- Barre d'outils contextuelle
- Keyboard shortcuts complètes
- Zoom et navigation canvas

**Dashboard projets**
- Vue liste et vue grille des projets
- Recherche et filtrage
- Aperçu visuel des projets (thumbnail)
- Indicateurs de collaboration (qui travaille sur quoi)
- Accès rapide aux projets récents

**Interface de collaboration**
- Présence en temps réel (avatars des collaborateurs actifs)
- Curseurs synchronisés dans le canvas
- Système de commentaires contextuels (lié à un nœud AST)
- Notifications de modifications
- Journal d'activité par projet

**Console développeur**
- Visualiseur AST (arbre de nœuds en temps réel)
- Inspecteur du graphe de dépendances
- Timeline des mutations
- Preview du code généré en temps réel
- Logs de compilation et d'erreurs

**Admin panel**
- Gestion des membres et des rôles de l'organisation
- Facturation et abonnement
- Configuration des intégrations (GitHub, webhooks)
- Statistiques d'utilisation

### 5.3 Services internes

**AI Engine (multi-agents)**
- Agent de génération de layout : produit une structure AST complète depuis un prompt
- Agent de génération de contenu : remplit les props de texte, images, données depuis un prompt
- Agent de suggestions contextuelles : propose des composants, layouts, couleurs en fonction du contexte
- Agent d'optimisation : SEO, accessibilité, performance
- Orchestrateur multi-agents : coordination des agents pour les tâches complexes

**Export Engine**
- Pipeline AST → IR → Code (React/TS par défaut)
- Export HTML/CSS (fallback)
- Export vers ZIP téléchargeable
- Synchronisation avec repository GitHub/GitLab
- Export vers hébergeurs compatibles (Vercel, Netlify)

**SEO Analyzer**
- Analyse des balises meta, titles, descriptions
- Analyse de la structure des headings
- Analyse des images (alt texts, tailles)
- Score et recommandations actionnables

**Asset Manager**
- Upload d'images, vidéos, fichiers
- Optimisation automatique (compression, formats modernes)
- CDN distribution
- Bibliothèque d'assets partagés par organisation

**Notification System**
- Notifications in-app (activité collaboration, commentaires)
- Notifications email (invitations, mentions, déploiements)
- Webhooks configurables (déclencheurs d'événements vers systèmes externes)

### 5.4 Intégrations externes

**GitHub / GitLab**
- Connexion repository (OAuth)
- Push du code exporté vers une branche configurée
- Déclenchement de CI/CD après export
- Pull Request automatique optionnelle

**Hosting providers**
- Déploiement direct vers Vercel, Netlify
- Configuration du domaine custom
- Variables d'environnement

**APIs IA**
- OpenAI (GPT-4, DALL-E)
- Anthropic (Claude)
- Stabilité (génération d'images)
- Architecture multi-provider avec fallback

**CMS externes**
- Connexion à Contentful, Sanity, Strapi
- Binding de contenu CMS vers nodes AST
- Synchronisation bidirectionnelle

**Analytics**
- Intégration Google Analytics, Plausible
- Événements automatiques (page views, interactions)
- Dashboard analytics intégré (optionnel)

### 5.5 Dépendances fonctionnelles critiques

```
Builder ──── dépend de ────► Component System
         ──── dépend de ────► State Engine
         ──── dépend de ────► Real-time Engine

AI Engine ── dépend de ────► Project Context (AST)
          ── dépend de ────► Component Graph
          ── dépend de ────► User Intent (prompt)

Export ───── dépend de ────► AST stabilisé
         ──── dépend de ────► Style System complet
         ──── dépend de ────► Routing défini

Runtime ──── dépend de ────► IR compilé
         ──── dépend de ────► State Store
         ──── dépend de ────► Effect Engine
```

---

# PARTIE II — ARCHITECTURE GLOBALE DU SYSTÈME

---

## 6. Principes architecturaux fondamentaux

### 6.1 Choix architectural principal : Monorepo modulaire hybride

**Décision :** Architecture hybride combinant un monolithe modulaire pour le cœur système et des services isolés pour les composants nécessitant un scaling indépendant.

**Justification détaillée :**

L'option monolithe pur (un seul service Node.js) aurait simplifié le démarrage mais créé une dette technique insurmontable à la mise à l'échelle : impossibilité de scaler le sync-server indépendamment de l'API, couplage fort entre logique temps réel et logique métier, risque de régression cross-domain élevé.

L'option microservices complets (un service par module) aurait maximisé la scalabilité mais introduit une complexité opérationnelle disproportionnée pour les phases initiales : orchestration des services, latence réseau inter-services pour des opérations fréquentes, overhead de développement et de debugging.

L'architecture hybride retenue optimise pour les trois dimensions critiques en même temps :

```
Monolithe modulaire (packages/) → cohérence, maintenabilité, performance interne
Services isolés (apps/)        → scalabilité indépendante, séparation des préoccupations
```

**Tableau de comparaison des options :**

| Dimension | Monolithe pur | Microservices complets | Hybride (retenu) |
|---|---|---|---|
| Complexité initiale | Faible | Très élevée | Moyenne |
| Scalabilité | Faible | Très élevée | Élevée |
| Maintenabilité | Moyenne | Complexe | Élevée |
| Cohérence interne | Élevée | Difficile | Élevée |
| Performance inter-modules | Maximale | Réseau | Maximale (même process) |
| Déploiement | Simple | Complexe | Modéré |
| Debugging | Simple | Difficile | Modéré |

### 6.2 Principe de séparation des responsabilités

Chaque couche du système a une responsabilité unique et précise. Les violations de ce principe sont des dettes techniques critiques.

**AST :** Définit la structure. Valide les invariants. N'exécute pas, n'affiche pas, ne compile pas.

**Compiler :** Transforme. Prend un AST en entrée, produit de l'IR ou du code en sortie. Sans état, sans side-effects.

**Runtime :** Exécute. Consomme l'IR. Gère la réactivité et le rendu. Ne connaît pas l'AST directement.

**Sync :** Synchronise. Gère le CRDT et le transport. Ne rend pas, ne compile pas.

**Builder-UI :** Affiche et capte les interactions. Envoie des commandes à l'AST. N'implémente aucune logique métier.

**API :** Persiste et sécurise. Gère l'authentification, le stockage, les permissions. Ne connaît pas le runtime ni le builder.

**Sync-server :** Transporte. Gère les connexions WebSocket et la distribution des messages CRDT. Stateless.

### 6.3 Principe d'AST-centrisme

L'AST est la source de vérité unique du système. Tout état applicatif observable transite par des mutations AST validées. Aucun système ne peut créer ou modifier l'état d'une application en contournant le package AST.

Ce principe garantit :
- La cohérence de l'état à tout moment
- La compatibilité avec le CRDT (toutes les mutations sont représentables comme opérations CRDT)
- La compilabilité (l'AST est toujours dans un état compilable ou avec des erreurs explicites)
- L'auditabilité (toutes les modifications sont tracées comme opérations AST)

### 6.4 Principe de dépendances directionnelles strictes

```
shared ← ast ← compiler ← runtime ← builder-ui ← web
                         ↑
                       sync
                         ↑
                    sync-server

shared ← api
```

**Règle absolue :** La dépendance inverse est interdite. Aucun module ne peut importer depuis un module de niveau supérieur dans cette hiérarchie.

**Corollaire :** Le package `ast` ne connaît pas le `compiler`. Le `compiler` ne connaît pas le `runtime`. Le `runtime` ne connaît pas le `builder-ui`.

### 6.5 Principe de pureté des packages

Chaque package interne est :
- **Utilisable de manière autonome** : peut être importé et utilisé sans les autres packages (sauf dépendances déclarées)
- **Testé indépendamment** : sa suite de tests n'importe pas d'autres packages ECOSYT non déclarés comme dépendances
- **Versionnable séparément** : peut évoluer à son propre rythme sans forcer une montée de version des autres

---

## 7. Structure du monorepo

### 7.1 Organisation complète

```
ecosyt/
│
├── ─── Configuration globale ────────────────────────────────────────
│   ├── package.json                    # Root package (scripts workspace)
│   ├── pnpm-workspace.yaml             # Déclaration workspaces pnpm
│   ├── turbo.json                      # Pipeline Turborepo (build, test, lint)
│   ├── tsconfig.base.json              # TypeScript config partagée
│   ├── tsconfig.json                   # TypeScript root (références projets)
│   ├── .eslintrc.js                    # ESLint config (root + overrides par package)
│   ├── .prettierrc                     # Prettier config uniforme
│   ├── .nvmrc                          # Version Node.js cible
│   └── .env.example                    # Variables d'environnement documentées
│
├── packages/ ─── Briques internes (moteur système) ────────────────
│   │
│   ├── ast/                            # 🔴 CŒUR — Modèle de données
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── node.ts             # Type Node complet (union discriminée)
│   │   │   │   ├── props.ts            # Types des propriétés par catégorie
│   │   │   │   ├── style.ts            # Types du système de style
│   │   │   │   ├── bindings.ts         # Types des liaisons dynamiques
│   │   │   │   ├── operations.ts       # Types des opérations de mutation
│   │   │   │   └── index.ts            # Barrel exports
│   │   │   │
│   │   │   ├── core/
│   │   │   │   ├── node-map.ts         # Registre indexé — NodeMap
│   │   │   │   ├── tree.ts             # Navigation hiérarchique (tree)
│   │   │   │   ├── graph.ts            # Graphe de dépendances (edges)
│   │   │   │   └── document.ts         # Document AST complet
│   │   │   │
│   │   │   ├── mutations/
│   │   │   │   ├── create-node.ts
│   │   │   │   ├── update-node.ts
│   │   │   │   ├── update-prop.ts
│   │   │   │   ├── update-style.ts
│   │   │   │   ├── delete-node.ts
│   │   │   │   ├── move-node.ts
│   │   │   │   ├── update-binding.ts
│   │   │   │   ├── create-component.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── validation/
│   │   │   │   ├── invariants.ts       # Définitions formelles des invariants
│   │   │   │   ├── structural.ts       # Validateurs structurels
│   │   │   │   ├── semantic.ts         # Validateurs sémantiques
│   │   │   │   ├── runtime.ts          # Validateurs runtime
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── history/
│   │   │   │   ├── command.ts          # Interface Command (pattern)
│   │   │   │   ├── event.ts            # Types d'événements AST
│   │   │   │   ├── event-log.ts        # Log append-only des événements
│   │   │   │   ├── undo-redo.ts        # Undo/Redo par event sourcing
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── selectors/
│   │   │   │   ├── get-node.ts
│   │   │   │   ├── get-children.ts
│   │   │   │   ├── get-ancestors.ts
│   │   │   │   ├── get-descendants.ts
│   │   │   │   ├── find-nodes.ts       # Recherche par critère
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── serialization/
│   │   │   │   ├── to-json.ts
│   │   │   │   ├── from-json.ts
│   │   │   │   ├── compress.ts         # Compression pour stockage
│   │   │   │   ├── migrate.ts          # Migrations de schema
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── expressions/
│   │   │   │   ├── parser.ts           # Parser d'expressions {{var}}
│   │   │   │   ├── evaluator.ts        # Évaluateur sécurisé
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts                # API publique du package AST
│   │   │
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   │   ├── node-map.test.ts
│   │   │   │   ├── mutations.test.ts
│   │   │   │   ├── validation.test.ts
│   │   │   │   ├── history.test.ts
│   │   │   │   └── selectors.test.ts
│   │   │   │
│   │   │   ├── integration/
│   │   │   │   ├── document-lifecycle.test.ts
│   │   │   │   └── mutation-sequences.test.ts
│   │   │   │
│   │   │   └── fixtures/               # AST fixtures pour tests
│   │   │
│   │   └── package.json
│   │
│   ├── compiler/                       # ⚙️ Pipeline AST → IR → Code
│   │   ├── src/
│   │   │   ├── pipeline/
│   │   │   │   ├── normalize.ts        # Phase 1 : normalisation AST
│   │   │   │   ├── transform.ts        # Phase 2 : AST → IR
│   │   │   │   ├── optimize.ts         # Phase 3 : optimisation IR
│   │   │   │   ├── codegen.ts          # Phase 4 : IR → Code
│   │   │   │   ├── pipeline.ts         # Orchestrateur du pipeline
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── ir/
│   │   │   │   ├── ir-node.ts          # Types des nœuds IR
│   │   │   │   ├── ir-graph.ts         # Graphe IR (dataflow)
│   │   │   │   ├── ir-types.ts         # Énumérations IR
│   │   │   │   ├── ir-builder.ts       # Builder API pour construire l'IR
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── passes/
│   │   │   │   ├── flatten.ts          # Aplatissement tree → graph
│   │   │   │   ├── resolve-refs.ts     # Résolution des références
│   │   │   │   ├── expand-components.ts # Expansion composants custom
│   │   │   │   ├── extract-deps.ts     # Extraction des dépendances
│   │   │   │   ├── dead-nodes.ts       # Élimination nœuds morts
│   │   │   │   ├── constant-fold.ts    # Constant folding
│   │   │   │   ├── merge-static.ts     # Fusion nœuds statiques
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── codegen/
│   │   │   │   ├── react/
│   │   │   │   │   ├── generate.ts     # Générateur React principal
│   │   │   │   │   ├── components.ts   # Génération composants React
│   │   │   │   │   ├── hooks.ts        # Génération hooks React
│   │   │   │   │   ├── styles.ts       # Génération styles (CSS modules/Tailwind)
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── html/
│   │   │   │   │   ├── generate.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── incremental/
│   │   │   │   ├── dependency-graph.ts # Graphe de dépendances compilation
│   │   │   │   ├── invalidation.ts     # Marquage invalidation
│   │   │   │   ├── patch.ts            # Application patches IR
│   │   │   │   ├── cache.ts            # Cache IR compilé
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── errors/
│   │   │   │   ├── compiler-errors.ts  # Types d'erreurs compilateur
│   │   │   │   ├── error-map.ts        # Mapping erreur IR → AST node
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   │   ├── pipeline.test.ts
│   │   │   │   ├── ir.test.ts
│   │   │   │   └── passes/
│   │   │   │
│   │   │   ├── snapshots/              # Code généré attendu (snapshot tests)
│   │   │   └── fixtures/
│   │   │
│   │   └── package.json
│   │
│   ├── runtime/                        # ⚡ Moteur réactif
│   │   ├── src/
│   │   │   ├── reactive/
│   │   │   │   ├── signal.ts           # Signal — primitive réactive
│   │   │   │   ├── computed.ts         # Valeur calculée
│   │   │   │   ├── effect.ts           # Effet déclaratif
│   │   │   │   ├── graph.ts            # Graphe de dépendances runtime
│   │   │   │   ├── tracking.ts         # Auto-tracking des dépendances
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── scheduler/
│   │   │   │   ├── queue.ts            # File microtask
│   │   │   │   ├── batching.ts         # Batching des mutations
│   │   │   │   ├── priority.ts         # Priorisation
│   │   │   │   ├── flush.ts            # Exécution du cycle
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── renderer/
│   │   │   │   ├── dom/
│   │   │   │   │   ├── create.ts       # Création nœuds DOM
│   │   │   │   │   ├── update.ts       # Mise à jour fine-grained
│   │   │   │   │   ├── patch.ts        # Application patches
│   │   │   │   │   ├── reconcile.ts    # Réconciliation listes
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── execution/
│   │   │   │   ├── runtime-node.ts     # Nœud exécutable (matérialisation IR)
│   │   │   │   ├── executor.ts         # Exécuteur du graphe
│   │   │   │   ├── bindings.ts         # Résolution bindings dynamiques
│   │   │   │   ├── loops.ts            # Exécution nœuds Loop
│   │   │   │   └── conditionals.ts     # Exécution nœuds Conditional
│   │   │   │
│   │   │   ├── state/
│   │   │   │   ├── store.ts            # Store global de signaux
│   │   │   │   ├── scope.ts            # Scoping des signaux
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── tests/
│   │   └── package.json
│   │
│   ├── sync/                           # 🌐 CRDT / Collaboration
│   │   ├── src/
│   │   │   ├── crdt/
│   │   │   │   ├── yjs-adapter.ts      # Adaptation Yjs → ECOSYT
│   │   │   │   ├── node-binding.ts     # Liaison nœud AST ↔ Y.Map
│   │   │   │   ├── document.ts         # Y.Doc principal
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── mapping/
│   │   │   │   ├── ast-to-crdt.ts      # Projection AST → Yjs
│   │   │   │   ├── crdt-to-ast.ts      # Patch CRDT → mutations AST
│   │   │   │   ├── operation-map.ts    # Correspondance opérations
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── transport/
│   │   │   │   ├── websocket-provider.ts  # Provider WebSocket Yjs
│   │   │   │   ├── reconnect.ts           # Logique reconnexion
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── conflicts/
│   │   │   │   ├── resolver.ts         # Résolution conflits métier
│   │   │   │   ├── strategies.ts       # LWW, merge custom, soft-lock
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── awareness/
│   │   │   │   ├── presence.ts         # Gestion présence utilisateur
│   │   │   │   ├── cursors.ts          # Curseurs synchronisés
│   │   │   │   ├── selections.ts       # Sélections partagées
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── tests/
│   │   └── package.json
│   │
│   ├── builder-ui/                     # 🎨 Interface React du builder
│   │   ├── src/
│   │   │   ├── canvas/
│   │   │   │   ├── Canvas.tsx          # Composant canvas principal
│   │   │   │   ├── CanvasNode.tsx      # Rendu d'un nœud dans le canvas
│   │   │   │   ├── CanvasOverlay.tsx   # Overlay (sélection, guides)
│   │   │   │   ├── DragLayer.tsx       # Drag & drop layer
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── inspector/
│   │   │   │   ├── Inspector.tsx       # Panneau propriétés principal
│   │   │   │   ├── PropsPanel.tsx      # Sous-panneau props
│   │   │   │   ├── StylePanel.tsx      # Sous-panneau styles
│   │   │   │   ├── BindingsPanel.tsx   # Sous-panneau bindings
│   │   │   │   ├── EventsPanel.tsx     # Sous-panneau events
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── layers/
│   │   │   │   ├── LayerTree.tsx       # Arbre des composants
│   │   │   │   ├── LayerItem.tsx       # Item d'un layer
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── toolbar/
│   │   │   │   ├── Toolbar.tsx         # Barre d'outils principale
│   │   │   │   ├── ComponentPicker.tsx # Sélecteur de composants
│   │   │   │   ├── ActionBar.tsx       # Actions (undo, redo, preview)
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── collaboration/
│   │   │   │   ├── AvatarStack.tsx     # Avatars des collaborateurs
│   │   │   │   ├── RemoteCursor.tsx    # Curseur distant
│   │   │   │   ├── CommentPin.tsx      # Épingle de commentaire
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── use-ast.ts          # Accès aux données AST
│   │   │   │   ├── use-selection.ts    # Gestion sélection canvas
│   │   │   │   ├── use-builder.ts      # État global builder
│   │   │   │   ├── use-drag.ts         # Drag & drop
│   │   │   │   ├── use-keyboard.ts     # Raccourcis clavier
│   │   │   │   └── use-collaboration.ts # Awareness CRDT
│   │   │   │
│   │   │   ├── state/
│   │   │   │   ├── builder-store.ts    # Store Zustand — état builder
│   │   │   │   ├── selection-store.ts  # Store — sélection
│   │   │   │   ├── ui-store.ts         # Store — état UI (panneaux ouverts…)
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── adapters/
│   │   │   │   ├── ast-adapter.ts      # Interface vers mutations AST
│   │   │   │   ├── runtime-adapter.ts  # Interface vers runtime
│   │   │   │   └── sync-adapter.ts     # Interface vers sync CRDT
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   └── package.json
│   │
│   ├── shared/                         # 🔗 Types et contrats communs
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── project.ts          # Types Project, Page, Organization
│   │   │   │   ├── user.ts             # Types User, Role, Permission
│   │   │   │   ├── api.ts              # Types DTOs API (Request/Response)
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── constants/
│   │   │   │   ├── node-types.ts       # Catalogue types de nœuds
│   │   │   │   ├── events.ts           # Noms des événements système
│   │   │   │   └── limits.ts          # Limites système (max nodes, etc.)
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── id.ts               # Génération IDs (UUID v4)
│   │   │       ├── deep-equal.ts
│   │   │       └── type-guards.ts
│   │   │
│   │   └── package.json
│   │
│   └── tools/                          # 🛠️ Outillage développement
│       ├── ast-viewer/                 # Visualiseur AST (dev tool)
│       ├── graph-inspector/            # Inspecteur graphe dépendances
│       ├── performance/                # Benchmarks et profiling
│       └── scripts/                   # Scripts utilitaires
│
├── apps/ ─── Applications finales ─────────────────────────────────
│   │
│   ├── web/                            # 🌍 Frontend React (application)
│   │   ├── src/
│   │   │   ├── app/                    # App router (Next.js ou React Router)
│   │   │   │   ├── (auth)/             # Routes authentification
│   │   │   │   ├── (dashboard)/        # Dashboard projets
│   │   │   │   ├── builder/[id]/       # Builder projet
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── providers/
│   │   │   │   ├── AuthProvider.tsx
│   │   │   │   ├── ProjectProvider.tsx
│   │   │   │   └── SyncProvider.tsx
│   │   │   │
│   │   │   ├── components/             # Composants UI globaux
│   │   │   │   ├── ui/                 # Design system (shadcn ou custom)
│   │   │   │   └── layout/
│   │   │   │
│   │   │   └── main.tsx
│   │   │
│   │   └── package.json
│   │
│   ├── api/                            # 🧠 Backend NestJS
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   └── guards/
│   │   │   │   │
│   │   │   │   ├── user/
│   │   │   │   │   ├── user.module.ts
│   │   │   │   │   ├── user.service.ts
│   │   │   │   │   ├── user.controller.ts
│   │   │   │   │   └── user.entity.ts
│   │   │   │   │
│   │   │   │   ├── organization/
│   │   │   │   │   ├── organization.module.ts
│   │   │   │   │   ├── organization.service.ts
│   │   │   │   │   └── organization.entity.ts
│   │   │   │   │
│   │   │   │   ├── project/
│   │   │   │   │   ├── project.module.ts
│   │   │   │   │   ├── project.service.ts
│   │   │   │   │   ├── project.controller.ts
│   │   │   │   │   ├── project.entity.ts
│   │   │   │   │   └── dto/
│   │   │   │   │
│   │   │   │   ├── document/
│   │   │   │   │   ├── document.module.ts
│   │   │   │   │   ├── document.service.ts
│   │   │   │   │   ├── snapshot.service.ts
│   │   │   │   │   └── document.entity.ts
│   │   │   │   │
│   │   │   │   ├── asset/
│   │   │   │   │   ├── asset.module.ts
│   │   │   │   │   ├── asset.service.ts
│   │   │   │   │   └── asset.controller.ts
│   │   │   │   │
│   │   │   │   └── ai/
│   │   │   │       ├── ai.module.ts
│   │   │   │       ├── ai.service.ts
│   │   │   │       ├── ai.controller.ts
│   │   │   │       └── agents/
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   │   ├── database/
│   │   │   │   │   ├── database.module.ts
│   │   │   │   │   ├── migrations/     # Migrations TypeORM
│   │   │   │   │   └── seeds/          # Seeds de données
│   │   │   │   │
│   │   │   │   └── cache/
│   │   │   │       ├── cache.module.ts
│   │   │   │       └── redis.service.ts
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── filters/            # Exception filters
│   │   │   │   ├── interceptors/       # Logging, transform
│   │   │   │   ├── pipes/              # Validation pipes
│   │   │   │   └── decorators/
│   │   │   │
│   │   │   └── main.ts
│   │   │
│   │   └── package.json
│   │
│   └── sync-server/                    # 🔌 Serveur WebSocket
│       ├── src/
│       │   ├── rooms/
│       │   │   ├── room.ts             # Classe Room (document)
│       │   │   └── room-manager.ts     # Gestion des rooms actives
│       │   │
│       │   ├── handlers/
│       │   │   ├── crdt-handler.ts     # Handler messages CRDT
│       │   │   ├── awareness-handler.ts # Handler awareness
│       │   │   └── auth-handler.ts     # Vérification auth sur connexion
│       │   │
│       │   ├── pubsub/
│       │   │   ├── redis-pubsub.ts     # Pub/Sub Redis inter-instances
│       │   │   └── index.ts
│       │   │
│       │   └── server.ts              # Point d'entrée WebSocket
│       │
│       └── package.json
│
├── tests/ ────────────────────────────────────────────────────────
│   ├── e2e/                            # Tests end-to-end (Playwright)
│   │   ├── builder/
│   │   ├── collaboration/
│   │   └── export/
│   │
│   └── performance/                   # Tests de charge
│       ├── k6/                         # Scripts k6
│       └── benchmarks/
│
├── docs/ ─────────────────────────────────────────────────────────
│   ├── architecture/
│   │   ├── decisions/                  # ADRs (Architecture Decision Records)
│   │   └── diagrams/                   # Diagrammes système
│   │
│   ├── specs/                          # Spécifications détaillées par module
│   └── api/                            # Documentation API (OpenAPI)
│
└── scripts/ ──────────────────────────────────────────────────────
    ├── setup.sh                        # Installation environnement développement
    ├── migrate.sh                      # Exécution migrations DB
    └── deploy.sh                       # Scripts de déploiement
```

---

## 8. Vue d'ensemble des flux système

### 8.1 Flux principal — Création et édition

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLUX ÉDITION LOCALE                         │
│                                                                 │
│  Utilisateur (Action)                                           │
│        │                                                        │
│        ▼                                                        │
│  Builder-UI (builder-ui)                                        │
│  ┌─────────────────┐                                            │
│  │ Capture action  │                                            │
│  │ Envoie commande │                                            │
│  └────────┬────────┘                                            │
│           │ command                                             │
│           ▼                                                     │
│  AST (packages/ast)                                             │
│  ┌─────────────────────────────────────┐                        │
│  │ Valide les invariants               │                        │
│  │ Applique la mutation (NodeMap)      │                        │
│  │ Émet un événement AST               │                        │
│  │ Ajoute au log (event sourcing)      │                        │
│  └───────────────┬─────────────────────┘                        │
│                  │ AST event                                    │
│          ┌───────┴───────┐                                      │
│          │               │                                      │
│          ▼               ▼                                      │
│  Compiler (incrémental)  Sync (CRDT)                            │
│  ┌──────────────┐  ┌──────────────────┐                         │
│  │ Invalide IR  │  │ Applique CRDT op │                         │
│  │ Recompile    │  │ Broadcast WS     │                         │
│  └──────┬───────┘  └──────────────────┘                         │
│         │ IR patch                                              │
│         ▼                                                       │
│  Runtime (packages/runtime)                                     │
│  ┌─────────────────────────────────────┐                        │
│  │ Invalide signal(s) dépendants       │                        │
│  │ Scheduler : enqueue dirty nodes     │                        │
│  │ Flush : recalcul topologique        │                        │
│  │ Renderer : DOM patch minimal        │                        │
│  └─────────────────────────────────────┘                        │
│         │ DOM patch                                             │
│         ▼                                                       │
│  UI mise à jour (< 16ms)                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Flux de collaboration — Réception update distante

```
┌─────────────────────────────────────────────────────────────────┐
│                   FLUX COLLABORATION ENTRANTE                   │
│                                                                 │
│  User B (remote action)                                         │
│        │                                                        │
│        ▼                                                        │
│  Sync-Server (WebSocket room)                                   │
│        │ CRDT delta broadcast                                   │
│        ▼                                                        │
│  Sync (packages/sync) — côté User A                             │
│  ┌─────────────────────────────────────┐                        │
│  │ Reçoit delta CRDT                   │                        │
│  │ Yjs merge automatique               │                        │
│  │ Validation post-merge (invariants)  │                        │
│  │ Traduit en mutation(s) AST          │                        │
│  └───────────────┬─────────────────────┘                        │
│                  │ AST patch                                    │
│                  ▼                                              │
│  AST (packages/ast)                                             │
│  ┌─────────────────────────────────────┐                        │
│  │ Applique mutation(s) reçues         │                        │
│  │ Valide invariants post-patch        │                        │
│  │ Émet événement AST                  │                        │
│  └───────────────┬─────────────────────┘                        │
│                  │                                              │
│          ┌───────┴──────────┐                                   │
│          ▼                  ▼                                   │
│  Compiler (incrémental)  Awareness                              │
│  ┌──────────────┐  ┌─────────────────┐                          │
│  │ Patch IR     │  │ Curseur distant │                          │
│  └──────┬───────┘  │ Mis à jour      │                          │
│         │          └─────────────────┘                          │
│         ▼                                                       │
│  Runtime → DOM patch → UI User A                                │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Flux de persistance

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLUX DE SAUVEGARDE                          │
│                                                                 │
│  Trigger save (auto N ops ou manuel)                            │
│        │                                                        │
│        ▼                                                        │
│  API (apps/api — NestJS)                                        │
│  ┌─────────────────────────────────────┐                        │
│  │ Authentification vérifiée           │                        │
│  │ Permissions vérifiées               │                        │
│  │                                     │                        │
│  │  ┌──────────────────────────────┐   │                        │
│  │  │ Document Service             │   │                        │
│  │  │ 1. Sérialise AST (JSON)      │   │                        │
│  │  │ 2. Encode CRDT state         │   │                        │
│  │  │ 3. Write-ahead log entry     │   │                        │
│  │  │ 4. Snapshot si seuil atteint │   │                        │
│  │  └──────────────────────────────┘   │                        │
│  └───────────────┬─────────────────────┘                        │
│                  │                                              │
│      ┌───────────┼───────────────┐                              │
│      ▼           ▼               ▼                              │
│  PostgreSQL     Redis           Binary Store                    │
│  (métadonnées)  (cache doc)     (CRDT state)                    │
└─────────────────────────────────────────────────────────────────┘
```

### 8.4 Flux d'export de code

```
┌─────────────────────────────────────────────────────────────────┐
│                       FLUX D'EXPORT                             │
│                                                                 │
│  Utilisateur déclenche export                                   │
│        │                                                        │
│        ▼                                                        │
│  API (apps/api)                                                 │
│  ┌─────────────────────────────────────┐                        │
│  │ Récupère AST version stabilisée     │                        │
│  └───────────────┬─────────────────────┘                        │
│                  │ AST complet                                  │
│                  ▼                                              │
│  Compiler (mode full compile)                                   │
│  ┌─────────────────────────────────────┐                        │
│  │ Phase 1 : Normalisation AST         │                        │
│  │   ├── Validation complète           │                        │
│  │   └── Canonicalisation props/styles │                        │
│  │                                     │                        │
│  │ Phase 2 : AST → IR                  │                        │
│  │   ├── Flattening tree → graph       │                        │
│  │   ├── Résolution références         │                        │
│  │   ├── Expansion composants custom   │                        │
│  │   └── Extraction dépendances        │                        │
│  │                                     │                        │
│  │ Phase 3 : Optimisation IR           │                        │
│  │   ├── Dead node elimination         │                        │
│  │   ├── Constant folding              │                        │
│  │   └── Merge static nodes            │                        │
│  │                                     │                        │
│  │ Phase 4 : Codegen React/TS          │                        │
│  │   ├── Composants React              │                        │
│  │   ├── Hooks et state                │                        │
│  │   └── Styles (CSS modules/Tailwind) │                        │
│  └───────────────┬─────────────────────┘                        │
│                  │ Code React/TS                                │
│                  ▼                                              │
│  Output                                                         │
│  ┌─────────────────────────────────────┐                        │
│  │ ZIP téléchargeable    OU            │                        │
│  │ Push GitHub/GitLab    OU            │                        │
│  │ Deploy Vercel/Netlify               │                        │
│  └─────────────────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

### 8.5 Flux de génération IA

```
┌─────────────────────────────────────────────────────────────────┐
│                      FLUX IA                                    │
│                                                                 │
│  Prompt utilisateur (texte + contexte projet)                   │
│        │                                                        │
│        ▼                                                        │
│  AI Engine (apps/api — module ai)                               │
│  ┌─────────────────────────────────────┐                        │
│  │ Agent Orchestrator                  │                        │
│  │   │                                 │                        │
│  │   ├─► Agent Layout                  │                        │
│  │   │   Génère structure AST initiale │                        │
│  │   │                                 │                        │
│  │   ├─► Agent Content                 │                        │
│  │   │   Remplit props (textes, images)│                        │
│  │   │                                 │                        │
│  │   └─► Agent SEO/A11y                │                        │
│  │       Optimise meta, aria           │                        │
│  └───────────────┬─────────────────────┘                        │
│                  │ Mutations AST valides (JSON)                 │
│                  ▼                                              │
│  API                                                            │
│  ┌─────────────────────────────────────┐                        │
│  │ Valide mutations via packages/ast   │                        │
│  │ Applique au document                │                        │
│  │ Broadcast via sync-server           │                        │
│  └─────────────────────────────────────┘                        │
│                  │                                              │
│                  ▼                                              │
│  Builder-UI : affichage résultat IA                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Règles architecturales non négociables

Ces règles s'appliquent sans exception. Toute dérogation doit faire l'objet d'un ADR (Architecture Decision Record) documenté et approuvé.

### Règle 1 — Dépendances directionnelles

```
shared ← ast ← compiler ← runtime ← builder-ui
                sync utilise ast
                api utilise shared (pas ast directement en prod — via API)
```

**Violation :** Importer `compiler` depuis `ast`, importer `builder-ui` depuis `runtime`.

**Sanction :** Le CI/CD doit détecter et bloquer les violations de dépendances cycliques.

### Règle 2 — AST comme source de vérité unique

Toute modification de l'état applicatif transite par une mutation AST. Aucun état n'est maintenu en doublon entre l'AST et un autre système (React state, Redux, etc.) sans être explicitement marqué comme état UI temporaire.

**Violation :** Maintenir un état "shadow" dans React state parallèle à l'AST.

### Règle 3 — Séparation logique métier / UI

Le package `builder-ui` ne contient aucune logique métier (validation, calcul, transformation). Il capture les intentions utilisateur et les délègue à l'AST.

**Violation :** Implémenter la validation d'un binding dans un composant React au lieu du validateur AST.

### Règle 4 — Déterminisme du compilateur

Pour un AST donné, le compilateur produit toujours le même IR et le même code, indépendamment de l'ordre dans lequel les passes sont appliquées (dans les limites de la définition de l'ordre des passes).

**Violation :** Une passe qui utilise `Date.now()` ou `Math.random()` pour prendre une décision de compilation.

### Règle 5 — Pureté des mutations AST

Chaque mutation AST est atomique : elle passe entièrement ou échoue entièrement. Aucune mutation ne laisse l'AST dans un état partiellement modifié.

**Violation :** Une mutation qui modifie `childrenMap` sans mettre à jour `parentMap`.

### Règle 6 — IDs stables

Un ID de nœud, une fois assigné, n'est jamais réassigné à un autre nœud. La suppression d'un nœud libère son ID définitivement (il ne peut être réutilisé).

**Violation :** Réutiliser un ID après suppression pour optimiser l'espace.

### Règle 7 — Validation avant persistance

Aucun document n'est persisté sans validation complète de ses invariants. Une validation échouée bloque la sauvegarde avec un message d'erreur explicite.

**Violation :** Persister un document avec un nœud parent invalide pour "réparer plus tard".

---

## 10. Modèle de communication inter-systèmes

### 10.1 Communication Frontend → Backend

**Protocole :** HTTP/1.1 ou HTTP/2 (REST API)

**Format :** JSON (application/json)

**Authentification :** JWT Bearer token dans le header Authorization

**Endpoints principaux :**

```
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
DELETE /api/v1/projects/:id

GET    /api/v1/projects/:id/document
PUT    /api/v1/projects/:id/document
POST   /api/v1/projects/:id/document/snapshot
GET    /api/v1/projects/:id/document/history

POST   /api/v1/projects/:id/export
GET    /api/v1/projects/:id/export/:exportId

POST   /api/v1/ai/generate
POST   /api/v1/ai/suggest

GET    /api/v1/assets
POST   /api/v1/assets
DELETE /api/v1/assets/:id
```

### 10.2 Communication Frontend → Sync-Server

**Protocole :** WebSocket (ws:// ou wss://)

**Format :** Binaire (Yjs encoded) + JSON (awareness)

**Authentification :** Token JWT passé en query param à la connexion, validé par le sync-server

**Messages types :**

```
CLIENT → SERVER:
  sync    : Yjs update binaire
  awareness: { type: "awareness", state: {...} }
  ping    : keepalive

SERVER → CLIENT:
  sync    : Yjs update binaire (de tous les pairs)
  awareness: état awareness global de la room
  pong    : keepalive
```

**URL de connexion :**
```
wss://sync.ecosyt.io/documents/:documentId?token=<jwt>
```

### 10.3 Communication Sync-Server instances (scaling)

**Protocole :** Redis Pub/Sub ou NATS

**Usage :** Distribuer les updates CRDT entre instances de sync-server quand les clients connectés sur la même room sont sur des instances différentes.

**Topics :**
```
ecosyt:document:{documentId}:update
ecosyt:document:{documentId}:awareness
```

### 10.4 Communication intra-packages (même processus)

Les packages internes communiquent directement par imports TypeScript — pas de réseau, pas de sérialisation. C'est une propriété fondamentale du choix monorepo : les packages `ast`, `compiler`, `runtime` s'exécutent dans le même processus JavaScript côté client, sans overhead réseau entre eux.

```typescript
// Exemple : builder-ui utilise ast et runtime dans le même processus
import { createNode, updateProp } from '@ecosyt/ast'
import { signal, effect } from '@ecosyt/runtime'
```

---

# PARTIE III — SPÉCIFICATION DES MODULES INTERNES (packages/)

---

## 11. packages/ast — Cœur du système

### 11.1 Rôle et responsabilités

Le package AST est la **source de vérité unique** de tout le système ECOSYT. Il définit :
- La structure de données représentant une application (types, schémas)
- Les mécanismes de modification contrôlée (mutations)
- Les invariants qui garantissent la cohérence à tout moment
- L'historique complet des modifications (event sourcing)

**Ce que le package AST fait :**
- Définir les types TypeScript de toutes les entités du système (Node, Props, Bindings, Operations)
- Exposer des fonctions de mutation pures (createNode, updateNode, deleteNode, moveNode…)
- Valider les invariants structurels et sémantiques avant toute modification
- Maintenir un log append-only des opérations pour l'undo/redo et l'audit
- Sérialiser/désérialiser vers/depuis JSON pour la persistance et le transport

**Ce que le package AST ne fait PAS :**
- Afficher quoi que ce soit (pas d'import React ou DOM)
- Appeler des APIs réseau
- Connaître le compiler, le runtime, ou le sync
- Maintenir d'état UI (sélection, hover, mode d'édition)

### 11.2 Modèle de nœud complet

#### 11.2.1 Type Node (union discriminée TypeScript)

```typescript
// Le type Node est une union discriminée sur la propriété `category`
// Cela permet au compilateur TypeScript de narrower correctement le type
// selon la catégorie, et de valider les props spécifiques à chaque type.

type Node = UINode | LayoutNode | LogicNode | DataNode | MetaNode

// ─── UI NODES ─────────────────────────────────────────────────────

interface TextNode {
  id: NodeID
  category: 'UI'
  type: 'Text'
  props: {
    text: string | BindingExpression
    truncate?: boolean
    lines?: number
  }
  style: TextStyle
  children: never[]          // Text est un nœud feuille, pas d'enfants
  parent: NodeID | null
  bindings: Record<string, Binding>
  meta: NodeMeta
}

interface ImageNode {
  id: NodeID
  category: 'UI'
  type: 'Image'
  props: {
    src: string | BindingExpression
    alt: string | BindingExpression
    objectFit?: 'cover' | 'contain' | 'fill' | 'none'
    loading?: 'eager' | 'lazy'
  }
  style: BoxStyle
  children: never[]
  parent: NodeID | null
  bindings: Record<string, Binding>
  meta: NodeMeta
}

interface ButtonNode {
  id: NodeID
  category: 'UI'
  type: 'Button'
  props: {
    label: string | BindingExpression
    disabled?: boolean | BindingExpression
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  }
  style: BoxStyle
  events: { onClick?: EventHandler }
  children: never[]
  parent: NodeID | null
  bindings: Record<string, Binding>
  meta: NodeMeta
}

// ─── LAYOUT NODES ─────────────────────────────────────────────────

interface ContainerNode {
  id: NodeID
  category: 'Layout'
  type: 'Container'
  props: {
    tag?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav'
  }
  style: BoxStyle & FlexStyle
  children: NodeID[]         // Les layouts ont des enfants
  parent: NodeID | null
  bindings: Record<string, Binding>
  meta: NodeMeta
}

interface GridNode {
  id: NodeID
  category: 'Layout'
  type: 'Grid'
  props: {
    columns: number | string   // ex: 3 ou "repeat(auto-fill, minmax(200px, 1fr))"
    rows?: number | string
    gap?: string | number
  }
  style: BoxStyle & GridStyle
  children: NodeID[]
  parent: NodeID | null
  bindings: Record<string, Binding>
  meta: NodeMeta
}

// ─── LOGIC NODES ──────────────────────────────────────────────────

interface ConditionalNode {
  id: NodeID
  category: 'Logic'
  type: 'Conditional'
  props: {
    condition: BindingExpression   // Expression booléenne
  }
  children: [NodeID] | [NodeID, NodeID]  // [trueBranch] ou [trueBranch, falseBranch]
  parent: NodeID | null
  bindings: Record<string, Binding>
  meta: NodeMeta
}

interface LoopNode {
  id: NodeID
  category: 'Logic'
  type: 'Loop'
  props: {
    source: BindingExpression      // Expression retournant un tableau
    itemAlias: string              // Nom de la variable d'itération
    keyBinding?: BindingExpression // Expression pour la clé unique
  }
  children: [NodeID]              // Template d'un item
  parent: NodeID | null
  bindings: Record<string, Binding>
  meta: NodeMeta
}

// ─── DATA NODES ───────────────────────────────────────────────────

interface StateNode {
  id: NodeID
  category: 'Data'
  type: 'State'
  props: {
    name: string                   // Nom du signal
    initialValue: JSONValue        // Valeur initiale
    scope: 'local' | 'page' | 'project'
  }
  children: never[]
  parent: NodeID | null
  bindings: {}
  meta: NodeMeta
}

interface APISourceNode {
  id: NodeID
  category: 'Data'
  type: 'APISource'
  props: {
    url: string | BindingExpression
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    headers?: Record<string, string>
    body?: BindingExpression
    trigger: 'onMount' | 'manual' | 'onStateChange'
    resultAlias: string
  }
  children: never[]
  parent: NodeID | null
  bindings: Record<string, Binding>
  meta: NodeMeta
}

// ─── META NODES ───────────────────────────────────────────────────

interface ComponentDefinitionNode {
  id: NodeID
  category: 'Meta'
  type: 'ComponentDefinition'
  props: {
    name: string
    description?: string
    propsSchema: Record<string, PropSchema>  // Props exposées
  }
  children: [NodeID]              // Root du template de composant
  parent: null                    // Toujours root-level
  bindings: {}
  meta: NodeMeta
}
```

#### 11.2.2 Types de style

```typescript
interface BoxStyle {
  // Dimensions
  width?: CSSValue
  height?: CSSValue
  minWidth?: CSSValue
  maxWidth?: CSSValue
  minHeight?: CSSValue
  maxHeight?: CSSValue

  // Espacement
  padding?: CSSSpacing
  paddingTop?: CSSValue
  paddingRight?: CSSValue
  paddingBottom?: CSSValue
  paddingLeft?: CSSValue
  margin?: CSSSpacing
  marginTop?: CSSValue
  marginRight?: CSSValue
  marginBottom?: CSSValue
  marginLeft?: CSSValue

  // Bordure
  borderRadius?: CSSValue
  border?: string
  borderColor?: string
  borderWidth?: CSSValue
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none'

  // Fond
  backgroundColor?: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundPosition?: string
  opacity?: number

  // Ombre
  boxShadow?: string

  // Position
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  top?: CSSValue
  right?: CSSValue
  bottom?: CSSValue
  left?: CSSValue
  zIndex?: number

  // Overflow
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto'
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto'

  // Display
  display?: 'block' | 'flex' | 'grid' | 'inline' | 'inline-block' | 'none'
  visibility?: 'visible' | 'hidden'

  // Responsive (breakpoints)
  responsive?: {
    sm?: Partial<BoxStyle>
    md?: Partial<BoxStyle>
    lg?: Partial<BoxStyle>
    xl?: Partial<BoxStyle>
  }
}

interface FlexStyle {
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  alignContent?: string
  gap?: CSSValue
  columnGap?: CSSValue
  rowGap?: CSSValue
  flex?: string
  flexGrow?: number
  flexShrink?: number
  flexBasis?: CSSValue
  alignSelf?: string
  order?: number
}

interface TextStyle extends Partial<BoxStyle> {
  fontSize?: CSSValue
  fontFamily?: string
  fontWeight?: number | 'bold' | 'normal' | 'light' | 'semibold'
  fontStyle?: 'normal' | 'italic'
  lineHeight?: CSSValue | number
  letterSpacing?: CSSValue
  color?: string
  textAlign?: 'left' | 'right' | 'center' | 'justify'
  textDecoration?: string
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap'
  wordBreak?: string
}
```

#### 11.2.3 Types de bindings

```typescript
// Un binding lie une prop à une source de données dynamique
interface Binding {
  type: 'expression' | 'state' | 'api' | 'component-prop'
  // Pour type 'expression'
  expression?: string            // ex: "{{state.user.name}}"
  // Pour type 'state'
  stateNodeId?: NodeID          // Référence vers un nœud State
  path?: string                 // Chemin dans l'objet state (ex: "user.name")
  // Pour type 'api'
  apiNodeId?: NodeID
  resultPath?: string
  // Pour type 'component-prop'
  propName?: string
}

// Expression template : {{expression}}
// L'expression est un sous-ensemble sécurisé de JS :
// - accès propriétés : obj.prop, obj['prop']
// - opérateurs logiques : &&, ||, !
// - opérateurs ternaires : cond ? a : b
// - opérateurs de comparaison : ===, !==, >, <, >=, <=
// - opérateurs arithmétiques : +, -, *, /
// - méthodes tableau : .map(), .filter(), .find(), .length
// - méthodes string : .toLowerCase(), .includes(), .slice()
// Interdit : appels de fonction arbitraires, eval, setTimeout, fetch
type BindingExpression = string  // Validé par le parser d'expressions
```

### 11.3 Le NodeMap — Registre central

```typescript
// NodeMap est la structure de données fondamentale du système AST.
// Elle garantit l'accès O(1) à tout nœud par son ID.

interface NodeMap {
  // Registre principal : ID → nœud complet
  nodes: Map<NodeID, Node>

  // Index de la hiérarchie (pour éviter de chercher dans node.children)
  childrenMap: Map<NodeID, NodeID[]>   // parent → [enfants]
  parentMap: Map<NodeID, NodeID | null>  // enfant → parent

  // Index du graphe de dépendances
  dependencyMap: Map<NodeID, NodeID[]>  // nœud → [ses dépendances]
  dependantsMap: Map<NodeID, NodeID[]>  // nœud → [ceux qui en dépendent]

  // Métadonnées du document
  rootId: NodeID
  schemaVersion: string
  documentId: string
}

// Complexités des opérations fondamentales
// getNode(id)           → O(1)
// getChildren(id)       → O(1) via childrenMap
// getParent(id)         → O(1) via parentMap
// getDescendants(id)    → O(n) où n = taille du sous-arbre
// getDependencies(id)   → O(1) via dependencyMap
// getDependants(id)     → O(1) via dependantsMap
// createNode            → O(1) + validation O(1) + mise à jour index O(1)
// deleteNode(avec descendants) → O(n) où n = taille du sous-arbre
// moveNode              → O(1) mise à jour parentMap + childrenMap
```

### 11.4 Mutations — Spécification formelle

Chaque mutation est une fonction pure qui :
1. Prend un NodeMap en entrée (et des paramètres)
2. Valide les pré-conditions (throws si invalide)
3. Retourne un nouveau NodeMap modifié (approche immutable)
4. Enregistre l'opération dans le log

```typescript
// Interface générique d'une mutation
type Mutation<TParams, TResult = NodeMap> = (
  nodeMap: NodeMap,
  params: TParams,
  options?: MutationOptions
) => { nodeMap: TResult; operation: Operation; inverse: Operation }

// Chaque mutation retourne aussi son inverse (pour undo)

// ─── CREATE NODE ──────────────────────────────────────────────────

interface CreateNodeParams {
  type: NodeType
  category: NodeCategory
  props?: Partial<NodeProps>
  style?: Partial<NodeStyle>
  parentId: NodeID          // Le parent doit exister
  position?: number         // Index dans children du parent (défaut: fin)
}

// Pré-conditions :
// - parentId existe dans NodeMap
// - type est un type de nœud valide
// - props sont valides pour ce type
// - La catégorie est compatible avec le parent (ex: Data nodes ne peuvent
//   pas être enfants d'UI nodes directement)
//
// Post-conditions :
// - Le nouveau nœud est dans NodeMap.nodes
// - NodeMap.childrenMap[parentId] contient le nouvel ID
// - NodeMap.parentMap[newId] = parentId
// - L'opération est loguée

// ─── UPDATE NODE ──────────────────────────────────────────────────

interface UpdateNodeParams {
  nodeId: NodeID
  path: string            // ex: "props.text", "style.fontSize", "bindings.text"
  value: JSONValue | Binding
}

// Pré-conditions :
// - nodeId existe
// - path est valide pour ce type de nœud
// - value est du type attendu pour ce path
//
// Granularité : prop-level (pas node-level) pour compatibilité CRDT fine-grained

// ─── DELETE NODE ──────────────────────────────────────────────────

interface DeleteNodeParams {
  nodeId: NodeID
  cascade?: boolean    // Supprimer les descendants (défaut: true)
}

// Pré-conditions :
// - nodeId existe
// - nodeId n'est pas le root node
// - Si cascade=false : le nœud n'a pas d'enfants (sinon erreur)
//
// Post-conditions :
// - nodeId ET tous les descendants sont retirés de NodeMap
// - NodeMap.childrenMap[parentId] ne contient plus nodeId
// - NodeMap.parentMap ne contient plus nodeId (ni descendants)
// - Toutes les références cassées sont détectées et reportées

// ─── MOVE NODE ────────────────────────────────────────────────────

interface MoveNodeParams {
  nodeId: NodeID
  newParentId: NodeID
  position?: number    // Index dans newParent.children
}

// Pré-conditions :
// - nodeId existe, n'est pas root
// - newParentId existe
// - newParentId n'est pas nodeId ni un descendant de nodeId (prévention cycles)
// - La catégorie du nœud est compatible avec newParent
//
// Post-conditions :
// - parentMap[nodeId] = newParentId
// - childrenMap[oldParentId] ne contient plus nodeId
// - childrenMap[newParentId] contient nodeId à la position spécifiée
```

### 11.5 Système de validation

#### 11.5.1 Niveaux de validation

**Validation structurelle (synchrone, avant toute mutation)**
Vérifie la cohérence formelle de la structure AST :
- Unicité des IDs
- Existence des références (parent, children, bindings)
- Absence de cycles dans la hiérarchie UI
- Cohérence childrenMap / parentMap

**Validation sémantique (synchrone, après mutation)**
Vérifie la cohérence des données métier :
- Type de nœud cohérent avec ses props déclarées
- Bindings référençant des nœuds existants et du bon type
- Expressions valides (syntaxe + sécurité)
- Contraintes de parenté respectées (ex: un Loop doit avoir exactement 1 enfant)

**Validation runtime (asynchrone, à la compilation)**
Vérifie la compilabilité :
- Résolution complète de toutes les dépendances
- Absence de références circulaires dans le graphe de données
- Types de données cohérents avec les bindings

#### 11.5.2 Invariants formels

```typescript
// Les invariants sont des prédicats qui doivent être vrais à tout moment
// Ils sont vérifiés après chaque mutation en développement,
// et avant chaque persistance en production.

const invariants: Invariant[] = [
  {
    name: 'unique-ids',
    description: 'All node IDs are globally unique within the document',
    check: (nodeMap) => {
      const ids = [...nodeMap.nodes.keys()]
      return ids.length === new Set(ids).size
    }
  },
  {
    name: 'root-exists',
    description: 'The root node exists in the node registry',
    check: (nodeMap) => nodeMap.nodes.has(nodeMap.rootId)
  },
  {
    name: 'single-parent',
    description: 'Each node has at most one parent',
    check: (nodeMap) => {
      // parentMap already enforces this by being a Map<NodeID, NodeID | null>
      // Additional check: each nodeId appears in at most one childrenMap entry
      const childCount = new Map<NodeID, number>()
      for (const children of nodeMap.childrenMap.values()) {
        for (const child of children) {
          childCount.set(child, (childCount.get(child) ?? 0) + 1)
        }
      }
      return [...childCount.values()].every(count => count <= 1)
    }
  },
  {
    name: 'no-ui-cycles',
    description: 'The UI tree has no cycles (parent chain never loops)',
    check: (nodeMap) => {
      // DFS avec marquage visited / in-stack
      const visited = new Set<NodeID>()
      const inStack = new Set<NodeID>()
      const hasCycle = (id: NodeID): boolean => {
        if (inStack.has(id)) return true
        if (visited.has(id)) return false
        visited.add(id)
        inStack.add(id)
        for (const childId of nodeMap.childrenMap.get(id) ?? []) {
          if (hasCycle(childId)) return true
        }
        inStack.delete(id)
        return false
      }
      return !hasCycle(nodeMap.rootId)
    }
  },
  {
    name: 'references-exist',
    description: 'All node references (parent, children, bindings) point to existing nodes',
    check: (nodeMap) => {
      for (const [id, node] of nodeMap.nodes) {
        // Vérifier parent
        if (node.parent !== null && !nodeMap.nodes.has(node.parent)) return false
        // Vérifier children
        for (const childId of nodeMap.childrenMap.get(id) ?? []) {
          if (!nodeMap.nodes.has(childId)) return false
        }
      }
      return true
    }
  },
  {
    name: 'childrenmap-parentmap-consistency',
    description: 'childrenMap and parentMap are consistent with each other',
    check: (nodeMap) => {
      for (const [parentId, children] of nodeMap.childrenMap) {
        for (const childId of children) {
          if (nodeMap.parentMap.get(childId) !== parentId) return false
        }
      }
      return true
    }
  }
]
```

### 11.6 Système d'historique et undo/redo

```typescript
// Le log d'événements est append-only.
// Chaque entrée correspond à une opération atomique sur l'AST.

interface EventLog {
  entries: LogEntry[]
  currentIndex: number    // Pointe vers la dernière opération appliquée
  // Si currentIndex < entries.length - 1, il y a des opérations "redoables"
}

interface LogEntry {
  id: string             // UUID unique de l'entrée
  timestamp: number      // Unix timestamp ms
  authorId: string       // ID de l'utilisateur auteur
  operation: Operation   // L'opération appliquée
  inverse: Operation     // L'opération inverse (pour undo)
  metadata?: {
    description?: string  // Description lisible (ex: "Move Button to Header")
    grouped?: string      // Group ID (pour grouper plusieurs ops en un undo)
  }
}

// Undo : appliquer operation.inverse de entries[currentIndex]
//         puis décrémenter currentIndex
//
// Redo : incrémenter currentIndex
//         puis appliquer operation de entries[currentIndex]
//
// Nouvelle opération après undo : tronquer entries après currentIndex
//         (les opérations "redoables" sont perdues)
```

### 11.7 Serialisation et migrations de schéma

```typescript
// Chaque document AST porte sa version de schéma explicitement.
// Les migrations sont des transformations pures : AST_vN → AST_vN+1

interface MigrationDefinition {
  from: SchemaVersion
  to: SchemaVersion
  migrate: (doc: SerializedDocument) => SerializedDocument
  description: string
}

// Exemple de migration : TextNode v1 → v2
// En v1, le texte était stocké dans props.text
// En v2, le texte est dans props.content.text (structure enrichie)
const textNodeV1toV2: MigrationDefinition = {
  from: '1.0.0',
  to: '1.1.0',
  description: 'TextNode: migrate props.text → props.content.text',
  migrate: (doc) => ({
    ...doc,
    nodes: Object.fromEntries(
      Object.entries(doc.nodes).map(([id, node]) => {
        if (node.type === 'Text' && typeof node.props?.text === 'string') {
          return [id, {
            ...node,
            props: { content: { text: node.props.text } }
          }]
        }
        return [id, node]
      })
    ),
    schemaVersion: '1.1.0'
  })
}

// La chaîne de migrations est appliquée séquentiellement au chargement.
// Support backward compatibility : le système supporte les documents
// de version N-1 minimum, en appliquant les migrations nécessaires.
```

---

## 12. packages/compiler — Pipeline de transformation

### 12.1 Rôle et responsabilités

Le compilateur transforme un AST valide en code exécutable. Il s'exécute en deux modes distincts avec des garanties différentes :

**Mode incrémental (preview temps réel) :** Recompile uniquement les nœuds IR invalidés par une mutation AST. Priorité à la latence : le résultat doit être disponible en < 16ms pour maintenir 60 FPS. Erreurs non bloquantes.

**Mode complet (export) :** Recompile l'intégralité du document depuis l'AST normalisé. Priorité à la qualité du code généré. Erreurs bloquantes avec rapport complet.

**Propriétés fondamentales du compilateur :**
- **Pur :** Aucun side-effect, aucune dépendance à l'état global
- **Déterministe :** Même AST → même IR → même code, toujours
- **Sans état :** Aucune variable globale mutable (le cache incrémental est géré explicitement)
- **Testable :** Chaque passe est une fonction pure testable indépendamment

### 12.2 L'IR — Intermediate Representation

#### 12.2.1 Justification de l'IR

L'AST et l'IR servent des besoins fondamentalement différents :

| Dimension | AST | IR |
|---|---|---|
| Structure | Hiérarchique (tree) | Graphe plat |
| Nature | Déclaratif brut (ce que c'est) | Exécutable (comment s'exécuter) |
| Dépendances | Implicites (dans les bindings) | Explicites (edges) |
| Optimisé pour | Édition, collaboration, CRDT | Compilation, exécution |
| Sérialisation | JSON (lisible) | Binaire ou JSON compact |

L'IR est indispensable pour trois raisons :

1. **Séparation des préoccupations :** Le générateur de code React ne devrait pas avoir à comprendre les bindings ECOSYT — il doit juste transformer des nœuds IR simples en code.

2. **Optimisabilité :** Les optimisations (dead node elimination, constant folding, merge static nodes) sont bien plus simples à appliquer sur un graphe IR homogène que sur un AST hétérogène.

3. **Généricité des cibles :** Le même IR peut être transformé en React, Vue, HTML, ou tout autre target futur sans modifier la pipeline de transformation AST→IR.

#### 12.2.2 Types de nœuds IR

```typescript
// Catégories de nœuds IR
type IRNodeKind =
  // UI
  | 'Element'     // Nœud DOM standard rendu
  | 'Text'        // Nœud texte
  | 'Fragment'    // Groupe sans wrapper DOM
  // Data
  | 'StateRef'    // Référence à un signal
  | 'Computed'    // Valeur calculée
  | 'Constant'    // Valeur statique (optimisée)
  // Control
  | 'Conditional' // if/else
  | 'Loop'        // map
  // Effects
  | 'EventHandler'  // onClick, onChange, etc.
  | 'APICall'       // Fetch réseau
  | 'SideEffect'    // Autres effects

interface IRNode {
  id: IRNodeID
  kind: IRNodeKind

  // Pour Element
  tagName?: string          // ex: 'button', 'div', 'h1'
  staticProps?: Record<string, unknown>  // Props statiques (pas de re-render)
  dynamicProps?: Record<string, IREdge>  // Props liées à des signaux

  // Pour tous les nœuds avec dépendances
  inputs: IRNodeID[]        // Dépendances (signaux qui alimentent ce nœud)
  outputs: IRNodeID[]       // Ce que ce nœud alimente

  // Pour les nœuds avec enfants
  children: IRNodeID[]

  // Pour StateRef
  signalPath?: string       // ex: 'page.user.name'
  initialValue?: unknown

  // Pour Constant
  value?: unknown

  // Pour Conditional
  conditionInput?: IRNodeID
  trueBranch?: IRNodeID
  falseBranch?: IRNodeID

  // Pour Loop
  sourceInput?: IRNodeID    // Signal fournissant le tableau
  itemTemplate?: IRNodeID   // Template de l'item
  keyExpression?: string

  // Flags d'optimisation
  flags: {
    static: boolean         // Jamais de re-render (valeur constante)
    pure: boolean           // Pas de side-effects
    memoized: boolean       // Peut être memoized
    hoisted: boolean        // Peut être sorti de la boucle de rendu
  }
}

interface IREdge {
  from: IRNodeID    // Nœud source (signal, computed…)
  to: IRNodeID      // Nœud destination (element, computed…)
  propKey?: string  // Sur quelle prop de `to` est branché cet edge
  transform?: string  // Transformation optionnelle (ex: "value => String(value)")
}

interface IRGraph {
  nodes: Map<IRNodeID, IRNode>
  edges: IREdge[]
  entryPoints: IRNodeID[]   // Nœuds racines du graphe de rendu
  effects: IRNodeID[]       // Effect nodes à exécuter post-render
  meta: {
    documentId: string
    compiledAt: number
    flags: { hasAsync: boolean; hasNetworkCalls: boolean }
  }
}
```

### 12.3 Pipeline de compilation — Détail des passes

#### Phase 1 — Normalisation AST

**Objectif :** Produire un AST canonique, sans ambiguïtés, avec toutes les références résolues.

**Passe 1.1 — Validation structurelle complète**
```
Input  : AST brut (NodeMap)
Output : AST validé (ou erreurs)
Action : Appel complet aux validateurs du package @ecosyt/ast
         Interruption si invariant violé (mode export)
         Collecte des avertissements sans interruption (mode preview)
```

**Passe 1.2 — Canonicalisation des styles**
```
Input  : AST avec styles potentiellement incomplets
Output : AST avec styles canonicalisés
Action : Application des valeurs par défaut
         Normalisation des unités (px → rem, % → fraction)
         Résolution des media queries responsive
```

**Passe 1.3 — Résolution des références croisées**
```
Input  : AST avec bindings contenant des IDs ou des noms de variables
Output : AST avec références résolues (ID → NodeID stable)
Action : Pour chaque binding, résoudre la référence vers le nœud source
         Valider que la source existe et est du type attendu
         Construire l'index de dépendances (qui dépend de qui)
```

#### Phase 2 — Transformation AST → IR

**Objectif :** Produire un graphe IR explicite à partir de la hiérarchie AST.

**Passe 2.1 — Flattening tree → graph**
```
Input  : AST hiérarchique (tree de NodeIDs)
Output : IRGraph avec tous les nœuds au même niveau
Action : Parcours DFS du tree AST
         Pour chaque nœud AST, créer un IRNode correspondant
         Les relations parent/enfant deviennent des edges explicites
         La hiérarchie est encodée dans children[] des IRNode Element
```

**Passe 2.2 — Extraction des dépendances dataflow**
```
Input  : IRGraph avec nœuds créés
Output : IRGraph avec edges de dataflow ajoutés
Action : Pour chaque binding résolu, créer un IREdge
         StateRef → Element (le state alimente la prop de l'élément)
         Computed → Element
         Computed → Computed (chaînes de calcul)
```

**Passe 2.3 — Expansion des composants custom**
```
Input  : IRGraph contenant des références à des ComponentDefinition
Output : IRGraph avec les composants inlinés
Action : Pour chaque node de type ComponentInstance :
           1. Récupérer le ComponentDefinition correspondant
           2. Cloner le template du composant
           3. Injecter les props passées comme signaux locaux
           4. Remplacer le ComponentInstance par le clone inliné
```

**Passe 2.4 — Expansion des Logic nodes**
```
Input  : IRGraph avec Conditional et Loop nodes non expansés
Output : IRGraph avec Conditional → IRNode Conditional et Loop → IRNode Loop
Action : ConditionalNode → IRNode Conditional avec conditionInput edge
         LoopNode → IRNode Loop avec sourceInput edge + itemTemplate
```

#### Phase 3 — Optimisation IR

**Passe 3.1 — Dead node elimination**
```
Algorithme : Marquer tous les nœuds atteignables depuis les entryPoints
             Supprimer tous les nœuds non-marqués
Exemple    : Un StateNode non référencé par aucun binding est supprimé
```

**Passe 3.2 — Constant folding**
```
Algorithme : Pour tout nœud dont tous les inputs sont des Constant,
             calculer la valeur résultante et remplacer par un Constant
Exemple    : Computed("Hello" + " " + "World") → Constant("Hello World")
```

**Passe 3.3 — Common subexpression elimination**
```
Algorithme : Identifier les sous-graphes structurellement identiques
             Ne conserver qu'une instance partagée
Exemple    : Deux elements lisant le même state.user.name partagent
             le même StateRef IRNode
```

**Passe 3.4 — Static hoisting**
```
Algorithme : Marquer comme 'static: true' tout nœud dont aucun input
             ne peut changer à runtime (pas de StateRef dans le sous-graphe)
Effet      : Les nœuds statiques ne sont jamais re-rendus
Exemple    : Une image avec une URL hardcodée est statique
```

**Passe 3.5 — Fragment flattening**
```
Algorithme : Supprimer les Fragment nodes inutiles (Fragment avec 1 enfant)
             Merger les Fragments adjacents
```

#### Phase 4 — Génération de code

**Cible principale : React + TypeScript**

**Stratégie : Builder API (programmatique, pas de templating)**

La génération est entièrement programmatique : le générateur construit l'AST JavaScript (JSX) en appelant des fonctions builder, pas en construisant des chaînes de caractères. Ce choix garantit :
- Absence d'erreurs d'escaping
- Code toujours syntaxiquement valide
- Optimisations possibles (ex: ne pas générer d'import si non utilisé)
- Code lisible car structuré par la logique du générateur

```typescript
// Structure du code React généré pour un projet ECOSYT

// Fichier : src/components/[PageName].tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react'
// Imports générés selon les nœuds IR présents

// State hooks générés depuis les StateNode IR
function usePage[PageName]State() {
  const [user, setUser] = useState(/* initialValue */)
  // ... autres states
  return { user, setUser, /* ... */ }
}

// Composant principal
export default function [PageName]() {
  const state = usePage[PageName]State()

  // Effects générés depuis les APISourceNode
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => state.setUsers(data))
  }, [])

  // Event handlers générés depuis les EventHandler IR nodes
  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    // ... logique
  }, [/* deps */])

  // JSX généré depuis les Element IR nodes
  return (
    <div className="...">
      {/* Conditional generé depuis Conditional IR node */}
      {state.isLogged && (
        <span>{state.user.name}</span>
      )}
      {/* Loop généré depuis Loop IR node */}
      {state.items.map((item, index) => (
        <div key={item.id}>
          <span>{item.title}</span>
        </div>
      ))}
      <button onClick={handleSubmit}>
        {state.submitLabel}
      </button>
    </div>
  )
}

// Fichier : src/components/[ComponentName].tsx (pour composants custom)
interface [ComponentName]Props {
  // Props schema généré depuis ComponentDefinition
  title: string
  onAction?: () => void
}

export function [ComponentName]({ title, onAction }: [ComponentName]Props) {
  return (/* JSX du template */)
}
```

### 12.4 Compilation incrémentale — Mécanisme détaillé

#### 12.4.1 Graphe de dépendances de compilation

Le compilateur maintient un index de dépendances inverse :

```typescript
// Pour chaque nœud IR, liste des nœuds AST dont il dépend
type IRDependencyIndex = Map<IRNodeID, Set<NodeID>>

// Pour chaque nœud AST, liste des nœuds IR invalidés si ce nœud change
type ASTReverseIndex = Map<NodeID, Set<IRNodeID>>
```

#### 12.4.2 Cycle de mise à jour incrémentale

```
1. Mutation AST reçue
   │
   ▼
2. Identifier les nœuds AST modifiés par la mutation
   (ex: UPDATE_PROP sur node_1 → {node_1})
   │
   ▼
3. Consulter ASTReverseIndex
   Pour chaque nœud AST modifié, récupérer les IRNodeIDs dépendants
   (ex: node_1 → {ir_element_5, ir_text_12})
   │
   ▼
4. Marquer les IRNodes comme dirty
   (propagation des dépendants transitifs via IRDependencyIndex)
   │
   ▼
5. Recompiler uniquement les IRNodes dirty
   (exécuter uniquement les passes nécessaires sur ce sous-ensemble)
   │
   ▼
6. Patcher l'IRGraph existant
   (remplacer les nœuds recompilés, pas de remplacement global)
   │
   ▼
7. Notifier le runtime des IRNodes patchés
   (le runtime invalide les signaux correspondants)
```

### 12.5 Gestion des erreurs de compilation

```typescript
interface CompilerError {
  code: string          // ex: 'UNRESOLVED_BINDING', 'TYPE_MISMATCH'
  severity: 'error' | 'warning' | 'info'
  message: string       // Message lisible
  location: {
    astNodeId: NodeID   // Nœud AST concerné
    irNodeId?: IRNodeID // Nœud IR correspondant (si applicable)
    propPath?: string   // Prop spécifique (si applicable)
  }
  suggestion?: string   // Suggestion de correction
}

// Comportement en mode preview (incrémental) :
// - Les erreurs de type 'error' : le nœud défaillant est rendu
//   en placeholder visuel (fond rouge, icône erreur)
// - Les erreurs de type 'warning' : rendues avec un indicateur visuel
//   mais sans bloquer le rendu
// - L'utilisateur voit l'erreur dans la console développeur du builder

// Comportement en mode export (full compile) :
// - Toute erreur de type 'error' bloque l'export
// - Un rapport d'erreurs complet est retourné avant tout code
// - Chaque erreur est localisée précisément dans l'AST et dans le builder
```

---



---
> **Note technique :** La section 12.4 ci-dessous est enrichie par la spécification d'invalidation incrémentale production-grade qui suit.


## 12.4 Compilation incrémentale — Spécification algorithmique complète [VERSION ENRICHIE]

### 12.4.1 Vue d'ensemble — Compilation complète vs incrémentale

```
┌─────────────────────────────────────────────────────────────────────┐
│           COMPILATION COMPLÈTE vs INCRÉMENTALE                      │
│                                                                     │
│  COMPLÈTE (export / premier chargement)                             │
│    Input  : AST complet (NodeMap entier)                            │
│    Output : IRGraph complet + Code complet                          │
│    Coût   : O(n) nœuds AST + O(n+e) IR processing                   │
│    Usage  : export, premier rendu, restauration après snapshot      │
│                                                                     │
│  INCRÉMENTALE (édition temps réel)                                  │
│    Input  : Opération AST + IRGraph existant en cache               │
│    Output : IRPatch (delta) + DOM patch                             │
│    Coût   : O(k) où k = taille du sous-graphe impacté               │
│    Usage  : chaque mutation dans le builder (cible < 4ms)           │
│                                                                     │
│  RATIO TYPIQUE : incrémentale est 10x à 100x plus rapide            │
│  (dépend de la taille du document et de la localité de la mutation) │
└─────────────────────────────────────────────────────────────────────┘
```

### 12.4.2 Graphe de dépendances de compilation — Structure complète

Le compilateur maintient trois index en mémoire, mis à jour à chaque compilation :

```typescript
// ─── INDEX 1 : AST → IR (forward) ────────────────────────────────────────
// Pour chaque nœud AST, quels nœuds IR en dépendent directement ?
// Utilisé pour : identifier les nœuds IR à invalider après une mutation AST

type ASTtoIRIndex = Map<NodeID, Set<IRNodeID>>

// Exemple :
// nodeA (TextNode) → { ir_element_7, ir_text_2 }
// Signification : si nodeA change, ir_element_7 et ir_text_2 doivent être recompilés

// ─── INDEX 2 : IR → AST (backward) ───────────────────────────────────────
// Pour chaque nœud IR, quels nœuds AST a-t-il consommés pour être produit ?
// Utilisé pour : debug, et reconstruction des index après full-compile

type IRtoASTIndex = Map<IRNodeID, Set<NodeID>>

// ─── INDEX 3 : IR → IR (dépendances de dataflow) ─────────────────────────
// Pour chaque nœud IR, quels autres nœuds IR en dépendent (dataflow) ?
// Utilisé pour : propagation transitive de l'invalidation

type IRDataflowIndex = Map<IRNodeID, Set<IRNodeID>>   // forward
type IRDataflowReverseIndex = Map<IRNodeID, Set<IRNodeID>>  // backward

// ─── STRUCTURE COMPLÈTE DU CACHE COMPILATEUR ──────────────────────────────

interface CompilerCache {
  // Le graphe IR courant (résultat de la dernière compilation)
  irGraph: IRGraph

  // Index pour l'invalidation incrémentale
  astToIR: ASTtoIRIndex
  irToAST: IRtoASTIndex
  irDataflow: IRDataflowIndex
  irDataflowReverse: IRDataflowReverseIndex

  // Versions des nœuds AST au moment de la dernière compilation
  // Permet de détecter rapidement si un nœud a changé
  astVersions: Map<NodeID, number>   // nodeId → version au moment compile

  // Cache des passes intermédiaires (pour réutilisation partielle)
  normalizedNodes: Map<NodeID, NormalizedNode>  // Résultats de la passe normalize
  resolvedRefs: Map<NodeID, ResolvedNode>       // Résultats de la passe resolve-refs

  // Marqueurs d'invalidation
  dirtyIRNodes: Set<IRNodeID>   // Nœuds IR à recompiler
  dirtyASTNodes: Set<NodeID>    // Nœuds AST modifiés depuis dernière compile
}
```

### 12.4.3 Algorithme d'invalidation — Détection de l'impact

```typescript
// Entrée : une opération AST (mutation)
// Sortie : ensemble de nœuds IR à invalider (avec propagation transitive)

function computeInvalidationSet(
  operation: Operation,
  cache: CompilerCache
): Set<IRNodeID> {
  const directlyImpacted = new Set<IRNodeID>()

  // ─── Étape 1 : identifier les nœuds AST modifiés ──────────────────────
  const affectedASTNodes = getAffectedASTNodes(operation)
  // getAffectedASTNodes retourne :
  //   CREATE_NODE    → [newNodeId, parentId]    (parent car ses children changent)
  //   UPDATE_PROP    → [nodeId]
  //   DELETE_NODE    → [nodeId, ...descendants, parentId]
  //   MOVE_NODE      → [nodeId, oldParentId, newParentId]
  //   UPDATE_BINDING → [nodeId] + nœuds qui dépendent de ce binding

  // ─── Étape 2 : lookup dans l'index AST → IR ───────────────────────────
  for (const astNodeId of affectedASTNodes) {
    const irDependents = cache.astToIR.get(astNodeId) ?? new Set()
    for (const irNodeId of irDependents) {
      directlyImpacted.add(irNodeId)
    }
  }

  // ─── Étape 3 : propagation transitive dans le graphe IR ───────────────
  // Si le nœud IR A est invalidé, et que B dépend de A dans le dataflow,
  // alors B doit aussi être invalidé.
  const transitivelyImpacted = new Set<IRNodeID>(directlyImpacted)
  const queue = [...directlyImpacted]

  while (queue.length > 0) {
    const irNodeId = queue.shift()!
    const irDependents = cache.irDataflow.get(irNodeId) ?? new Set()
    for (const dependent of irDependents) {
      if (!transitivelyImpacted.has(dependent)) {
        transitivelyImpacted.add(dependent)
        queue.push(dependent)
      }
    }
  }

  return transitivelyImpacted
}

function getAffectedASTNodes(operation: Operation): NodeID[] {
  switch (operation.op) {
    case 'CREATE_NODE':
      return [operation.node.id, operation.node.parent!]

    case 'UPDATE_PROP':
      // Pour un binding : inclure aussi tous les nœuds qui lisent ce binding
      if (operation.path.startsWith('bindings.')) {
        return [operation.nodeId, ...getBindingConsumers(operation.nodeId, operation.path)]
      }
      return [operation.nodeId]

    case 'DELETE_NODE':
      // Inclure le parent et tous les descendants
      return [operation.nodeId, ...operation.descendants, operation.parentId]

    case 'MOVE_NODE':
      // Le nœud lui-même + les deux parents affectés
      return [operation.nodeId, operation.oldParentId, operation.newParentId]

    case 'UPDATE_BINDING':
      return [operation.nodeId]

    default:
      return []
  }
}
```

### 12.4.4 Stratégie de cache par granularité d'unité

```typescript
// L'unité de cache dans le compilateur est le nœud IR individuel.
// Chaque nœud IR peut être recompilé indépendamment des autres.

interface IRNodeCacheEntry {
  irNode: IRNode
  // "Signature" des inputs AST au moment de la compilation
  // Si la signature est identique, le nœud n'a pas besoin d'être recompilé
  inputSignature: string

  // Résultats intermédiaires cachés par phase
  normalizedASTNode?: NormalizedNode   // Phase 1
  resolvedASTNode?: ResolvedNode       // Phase 1.3

  // Timestamp de dernière compilation
  compiledAt: number
  // Version de l'AST au moment de la compilation
  astVersion: number
}

// Calcul de la signature d'un nœud AST
// (hash stable des inputs qui affectent la compilation de ce nœud)
function computeNodeSignature(node: Node, nodeMap: NodeMap): string {
  const relevant = {
    type: node.type,
    category: node.category,
    props: node.props,
    style: node.style,
    bindings: node.bindings,
    // Inclure le type des enfants directs (pas récursif)
    childrenTypes: (nodeMap.childrenMap.get(node.id) ?? [])
      .map(childId => nodeMap.nodes.get(childId)?.type)
  }
  return stableHash(relevant)   // Hash déterministe (djb2 ou similaire)
}

// Réutilisation du cache : si la signature est identique,
// le nœud IR existant est réutilisé sans recompilation
function canReuseIRNode(
  astNodeId: NodeID,
  nodeMap: NodeMap,
  cache: CompilerCache
): boolean {
  const entry = cache.irNodeCache?.get(astNodeId)
  if (!entry) return false

  const currentSignature = computeNodeSignature(
    nodeMap.nodes.get(astNodeId)!,
    nodeMap
  )

  return entry.inputSignature === currentSignature
}
```

### 12.4.5 Cycle complet de compilation incrémentale

```typescript
// Point d'entrée de la compilation incrémentale
// Appelé après chaque mutation AST dans le builder

async function incrementalCompile(
  operation: Operation,
  nodeMap: NodeMap,
  cache: CompilerCache
): Promise<IRPatch> {
  const startTime = performance.now()

  // ─── Phase A : Invalidation ───────────────────────────────────────────
  const invalidatedIRNodes = computeInvalidationSet(operation, cache)

  // Si aucun nœud IR n'est impacté → no-op
  if (invalidatedIRNodes.size === 0) {
    return { updates: [], additions: [], removals: [] }
  }

  // ─── Phase B : Extraction du sous-graphe AST pertinent ────────────────
  // On ne recompile que les nœuds AST qui ont contribué aux IRNodes invalidés
  const relevantASTNodes = new Set<NodeID>()
  for (const irNodeId of invalidatedIRNodes) {
    const astContributors = cache.irToAST.get(irNodeId) ?? new Set()
    for (const astNodeId of astContributors) {
      relevantASTNodes.add(astNodeId)
    }
  }

  // ─── Phase C : Recompilation sélective par passes ─────────────────────

  // Passe 1 : Normalisation (uniquement les nœuds AST pertinents)
  const normalizedPatch = normalizePartial(relevantASTNodes, nodeMap, cache)

  // Passe 2 : Transformation AST → IR (uniquement les nœuds invalidés)
  const irPatch = transformPartial(invalidatedIRNodes, normalizedPatch, cache)

  // Passe 3 : Optimisations locales (uniquement dans le sous-graphe)
  const optimizedPatch = optimizePartial(irPatch, cache)

  // ─── Phase D : Mise à jour du cache ───────────────────────────────────
  applyPatchToCache(optimizedPatch, cache)

  // ─── Phase E : Construction du patch runtime ───────────────────────────
  const runtimePatch = buildRuntimePatch(optimizedPatch, cache)

  const duration = performance.now() - startTime
  metrics.record('incremental_compile_ms', duration, { nodeCount: invalidatedIRNodes.size })

  return runtimePatch
}

// Recompilation partielle — Phase 2
function transformPartial(
  invalidatedIRNodes: Set<IRNodeID>,
  normalizedPatch: NormalizedPatch,
  cache: CompilerCache
): IRPatch {
  const patch: IRPatch = { updates: [], additions: [], removals: [] }

  for (const irNodeId of invalidatedIRNodes) {
    const existingIRNode = cache.irGraph.nodes.get(irNodeId)

    // Identifier le nœud AST source
    const astNodeIds = cache.irToAST.get(irNodeId)
    if (!astNodeIds || astNodeIds.size === 0) {
      // Nœud IR sans source AST → suppression
      patch.removals.push(irNodeId)
      continue
    }

    // Vérifier si on peut réutiliser le cache
    const primaryASTNodeId = [...astNodeIds][0]
    if (canReuseIRNode(primaryASTNodeId, normalizedPatch.nodeMap, cache)) {
      // Cache hit : réutiliser le nœud IR existant, aucun recalcul
      continue
    }

    // Recompiler ce nœud IR
    const newIRNode = transformSingleNode(primaryASTNodeId, normalizedPatch, cache)

    if (existingIRNode) {
      patch.updates.push({ irNodeId, node: newIRNode })
    } else {
      patch.additions.push({ irNodeId, node: newIRNode })
    }
  }

  return patch
}
```

### 12.4.6 Cas complexes de compilation incrémentale

#### Cas 1 — Changement structurel : MOVE_NODE

```typescript
// Un MOVE_NODE est le cas le plus complexe car il affecte :
// 1. L'ancien parent (ses children changent)
// 2. Le nouveau parent (ses children changent)
// 3. Le nœud lui-même (son contexte change)
// 4. Tous les descendants du nœud (leur position dans l'arbre change)
// 5. Potentiellement : les bindings qui référencent des états du parent

function handleMoveNode(
  operation: MoveNodeOperation,
  cache: CompilerCache
): Set<IRNodeID> {
  const impacted = new Set<IRNodeID>()

  // 1. Invalider le sous-arbre IR de l'ancien parent
  const oldParentIRNodes = cache.astToIR.get(operation.oldParentId) ?? new Set()
  for (const id of oldParentIRNodes) impacted.add(id)

  // 2. Invalider le sous-arbre IR du nouveau parent
  const newParentIRNodes = cache.astToIR.get(operation.newParentId) ?? new Set()
  for (const id of newParentIRNodes) impacted.add(id)

  // 3. Invalider le nœud déplacé et ses descendants
  // (leur contexte de rendu peut changer : héritage de styles, de state)
  const movedSubtree = collectSubtreeAST(operation.nodeId, cache.lastNodeMap)
  for (const astNodeId of movedSubtree) {
    const irNodes = cache.astToIR.get(astNodeId) ?? new Set()
    for (const id of irNodes) impacted.add(id)
  }

  // 4. Propager transitivement
  return propagateTransitive(impacted, cache)
}
```

#### Cas 2 — Suppression d'un sous-arbre : DELETE_NODE avec cascade

```typescript
// La suppression d'un sous-arbre nécessite :
// 1. Supprimer tous les nœuds IR du sous-arbre du cache
// 2. Mettre à jour tous les index
// 3. Invalider les nœuds IR qui référençaient ces nœuds (via bindings)

function handleDeleteSubtree(
  rootNodeId: NodeID,
  descendants: NodeID[],  // pré-calculés par le package AST
  cache: CompilerCache
): { removals: IRNodeID[]; invalidations: Set<IRNodeID> } {
  const removals: IRNodeID[] = []
  const invalidations = new Set<IRNodeID>()
  const deletedASTNodes = new Set([rootNodeId, ...descendants])

  for (const astNodeId of deletedASTNodes) {
    // Tous les nœuds IR produits par ce nœud AST → suppression
    const irNodes = cache.astToIR.get(astNodeId) ?? new Set()
    for (const irNodeId of irNodes) {
      removals.push(irNodeId)

      // Tous les nœuds IR qui DÉPENDAIENT de ceux qu'on supprime → invalidation
      const consumers = cache.irDataflow.get(irNodeId) ?? new Set()
      for (const consumerId of consumers) {
        if (!deletedASTNodes.has([...cache.irToAST.get(consumerId) ?? []].find(Boolean)!)) {
          // Le consommateur n'est pas lui-même dans le sous-arbre supprimé
          invalidations.add(consumerId)
        }
      }
    }

    // Nettoyer les index
    cache.astToIR.delete(astNodeId)
    cache.astVersions.delete(astNodeId)
    cache.normalizedNodes.delete(astNodeId)
  }

  // Nettoyer les index IR → AST pour les nœuds supprimés
  for (const irNodeId of removals) {
    cache.irToAST.delete(irNodeId)
    cache.irDataflow.delete(irNodeId)
    cache.irDataflowReverse.delete(irNodeId)
    cache.irGraph.nodes.delete(irNodeId)
  }

  return { removals, invalidations }
}
```

#### Cas 3 — Changement de type d'un nœud (remplacement de composant)

```typescript
// Scénario : l'utilisateur change un Button en Link
// → Le type du nœud AST change → l'IR correspondant est fondamentalement différent
// → Il ne suffit pas de mettre à jour : il faut supprimer l'ancien et créer le nouveau

function handleNodeTypeChange(
  nodeId: NodeID,
  oldType: NodeType,
  newType: NodeType,
  cache: CompilerCache
): { removals: IRNodeID[]; recompile: Set<NodeID> } {
  const oldIRNodes = [...(cache.astToIR.get(nodeId) ?? new Set())]

  // Supprimer tous les nœuds IR associés à l'ancien type
  for (const irNodeId of oldIRNodes) {
    cache.irGraph.nodes.delete(irNodeId)
    cache.irDataflow.delete(irNodeId)
    cache.irDataflowReverse.delete(irNodeId)
    cache.irToAST.delete(irNodeId)
  }
  cache.astToIR.delete(nodeId)

  // Marquer pour recompilation complète (pas de réutilisation de cache possible)
  return {
    removals: oldIRNodes,
    recompile: new Set([nodeId])
  }
}
```

### 12.4.7 Comparaison performances : complète vs incrémentale

```
MESURES DE RÉFÉRENCE (projet type : 500 nœuds AST, 800 nœuds IR)

┌────────────────────────────────────────────────────────────────────┐
│                    COMPILATION COMPLÈTE                            │
│                                                                    │
│  Passe 1 (normalize)    :  12ms                                    │
│  Passe 2 (transform)    :  18ms                                    │
│  Passe 3 (optimize)     :   8ms                                    │
│  Passe 4 (codegen)      :  35ms                                    │
│  TOTAL                  :  73ms                                    │
│  → Acceptable pour export, inacceptable pour édition temps réel    │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                 COMPILATION INCRÉMENTALE                           │
│                                                                    │
│  Mutation : UPDATE_PROP sur 1 nœud (texte d'un bouton)             │
│  Nœuds IR invalidés : 2 (ir_element + ir_text)                     │
│  Phase A (invalidation)       :  0.1ms                             │
│  Phase B (extraction AST)     :  0.2ms                             │
│  Phase C (recompilation)      :  1.2ms                             │
│  Phase D (update cache)       :  0.3ms                             │
│  Phase E (build runtime patch):  0.2ms                             │
│  TOTAL                        :  2.0ms  ✓ (< 4ms cible)            │
│                                                                    │
│  Mutation : MOVE_NODE (déplacer une section dans la page)          │
│  Nœuds IR invalidés : ~80 (sous-arbre)                             │
│  TOTAL                        :  8.5ms  ✓ (< 16ms cible)           │
│                                                                    │
│  Mutation : DELETE_NODE (supprimer un composant complexe)          │
│  Nœuds IR invalidés : ~50                                          │
│  TOTAL                        :  6.2ms  ✓ (< 16ms cible)           │
└────────────────────────────────────────────────────────────────────┘

FACTEUR D'ACCÉLÉRATION MOYEN : ×20 à ×50
```

### 12.4.8 Cohérence du cache compilateur — Invariants

```typescript
// Ces invariants doivent être vrais après chaque opération sur le cache

const compilerCacheInvariants = [
  {
    name: 'forward-backward-consistency',
    description: 'astToIR et irToAST sont symétriques',
    check: (cache: CompilerCache) => {
      for (const [astNodeId, irNodes] of cache.astToIR) {
        for (const irNodeId of irNodes) {
          const astNodes = cache.irToAST.get(irNodeId)
          if (!astNodes?.has(astNodeId)) return false
        }
      }
      return true
    }
  },
  {
    name: 'ir-graph-coherence',
    description: 'Tout nœud référencé dans irDataflow existe dans irGraph',
    check: (cache: CompilerCache) => {
      for (const [from, tos] of cache.irDataflow) {
        if (!cache.irGraph.nodes.has(from)) return false
        for (const to of tos) {
          if (!cache.irGraph.nodes.has(to)) return false
        }
      }
      return true
    }
  },
  {
    name: 'no-dangling-ast-refs',
    description: 'Aucun nœud AST dans les index ne doit être absent du NodeMap',
    check: (cache: CompilerCache, nodeMap: NodeMap) => {
      for (const astNodeId of cache.astToIR.keys()) {
        if (!nodeMap.nodes.has(astNodeId)) return false
      }
      return true
    }
  }
]

// Vérification des invariants en développement (désactivée en prod)
function assertCacheCoherence(cache: CompilerCache, nodeMap: NodeMap): void {
  if (process.env.NODE_ENV !== 'development') return
  for (const invariant of compilerCacheInvariants) {
    if (!invariant.check(cache, nodeMap)) {
      throw new Error(`Compiler cache invariant violated: ${invariant.name}`)
    }
  }
}
```

---

## 22 (PARTIE V). Pipeline de compilation — Spécification technique détaillée [VERSION ENRICHIE]

*(Cette section enrichit "Pipeline de compilation — Spécification technique détaillée" dans la Partie V)*

### Pipeline détaillé — Phases internes et contrats

#### Passe de normalisation — Contrat formel

```typescript
// PRÉ-CONDITIONS de la passe de normalisation
// - NodeMap valide (invariants structurels vérifiés)
// POST-CONDITIONS
// - Tous les styles ont leurs valeurs par défaut
// - Toutes les expressions de binding sont parsées et validées
// - Toutes les références sont résolues (nœuds composants → définitions)
// - AUCUN nœud custom non-résolu ne subsiste

interface NormalizationResult {
  normalizedNodes: Map<NodeID, NormalizedNode>
  errors: CompilerError[]       // Erreurs récupérables (warning)
  fatalErrors: CompilerError[]  // Erreurs bloquantes (export uniquement)
}

interface NormalizedNode {
  original: Node
  // Props avec valeurs par défaut appliquées
  resolvedProps: Record<string, ResolvedValue>
  // Styles normalisés (unités, media queries résolues)
  resolvedStyle: ComputedStyle
  // Bindings parsés et typés
  resolvedBindings: Map<string, ResolvedBinding>
  // Référence résolue si c'est un ComponentInstance
  componentDefinition?: ComponentDefinitionNode
}

type ResolvedValue = LiteralValue | BoundValue

interface BoundValue {
  kind: 'bound'
  expression: ParsedExpression   // AST de l'expression
  sourceType: 'state' | 'prop' | 'api' | 'computed'
  sourceNodeId: NodeID
  sourcePath: string
  expectedType: 'string' | 'number' | 'boolean' | 'array' | 'object'
}
```

#### Passe de transformation — Règles de mapping complètes

```typescript
// Règles de transformation AST → IR par type de nœud

const TRANSFORMATION_RULES: Record<NodeType, TransformRule> = {
  'Text': {
    produces: ['Element', 'Text?'],
    transform: (node, ctx) => {
      const el = ctx.createElement(inferHTMLTag(node.props))

      if (node.bindings?.text) {
        // Texte dynamique → créer un nœud IR Text avec edge depuis le StateRef
        const textNode = ctx.createIRNode('Text')
        const stateRef = ctx.resolveBinding(node.bindings.text)
        ctx.addEdge(stateRef.id, textNode.id, 'textContent')
        ctx.addEdge(textNode.id, el.id, 'textContent')
      } else {
        // Texte statique → prop statique sur l'Element, pas de binding
        el.staticProps = { textContent: node.props.text }
        el.flags.static = true
      }

      return { root: el }
    }
  },

  'Conditional': {
    produces: ['Conditional'],
    transform: (node, ctx) => {
      const condNode = ctx.createIRNode('Conditional')

      // Résoudre l'expression de condition → un nœud StateRef ou Computed
      const condSource = ctx.resolveExpression(node.props.condition)
      ctx.addEdge(condSource.id, condNode.id, '__condition')

      // Compiler les branches récursivement
      const trueChild = node.children[0]
      const falseChild = node.children[1]

      if (trueChild) {
        const trueBranch = ctx.compileSubtree(trueChild)
        condNode.trueBranch = trueBranch.rootId
      }
      if (falseChild) {
        const falseBranch = ctx.compileSubtree(falseChild)
        condNode.falseBranch = falseBranch.rootId
      }

      return { root: condNode }
    }
  },

  'Loop': {
    produces: ['Loop', 'StateRef', 'Element*'],
    transform: (node, ctx) => {
      const loopNode = ctx.createIRNode('Loop')

      // Source du tableau → StateRef ou Computed
      const source = ctx.resolveBinding(node.props.source)
      ctx.addEdge(source.id, loopNode.id, '__source')

      // Template de l'item : compiler avec un scope étendu
      // (la variable d'itération est ajoutée au scope)
      const itemScope = ctx.extendScope({
        [node.props.itemAlias]: { kind: 'LoopItem', loopNodeId: loopNode.id }
      })
      const template = ctx.compileSubtree(node.children[0], itemScope)
      loopNode.itemTemplate = template.rootId

      // Key binding (si défini)
      if (node.props.keyBinding) {
        const keyExpr = ctx.resolveExpression(node.props.keyBinding, itemScope)
        loopNode.keyExpression = keyExpr.id
      }

      return { root: loopNode }
    }
  },

  'APISource': {
    produces: ['APICall', 'StateRef'],
    transform: (node, ctx) => {
      // L'APISource produit deux nœuds IR :
      // 1. Un APICall (effect node) pour le fetch réseau
      // 2. Un StateRef pour stocker le résultat

      const resultSignal = ctx.createIRNode('StateRef')
      resultSignal.signalPath = `api.${node.props.resultAlias}`
      resultSignal.initialValue = undefined

      const loadingSignal = ctx.createIRNode('StateRef')
      loadingSignal.signalPath = `api.${node.props.resultAlias}.__loading`
      loadingSignal.initialValue = true

      const apiCall = ctx.createIRNode('APICall')
      apiCall.url = ctx.resolveExpression(node.props.url)
      apiCall.method = node.props.method
      apiCall.trigger = node.props.trigger
      apiCall.outputs = [resultSignal.id, loadingSignal.id]

      // Edge : apiCall → resultSignal (le fetch alimente le signal)
      ctx.addEdge(apiCall.id, resultSignal.id, '__data')
      ctx.addEdge(apiCall.id, loadingSignal.id, '__loading')

      // Exposer le resultSignal avec l'alias défini
      ctx.registerAlias(node.props.resultAlias, resultSignal.id)

      return { root: apiCall, exports: [resultSignal.id] }
    }
  }
}
```

#### Passe d'optimisation — Algorithmes détaillés

```typescript
// ─── DEAD NODE ELIMINATION ────────────────────────────────────────────────

function eliminateDeadNodes(irGraph: IRGraph): IRGraph {
  // BFS depuis les entryPoints (nœuds racines du rendu)
  const reachable = new Set<IRNodeID>(irGraph.entryPoints)
  const queue = [...irGraph.entryPoints]

  while (queue.length > 0) {
    const nodeId = queue.shift()!
    const node = irGraph.nodes.get(nodeId)!

    // Visiter tous les nœuds consommés par ce nœud
    for (const inputId of node.inputs) {
      if (!reachable.has(inputId)) {
        reachable.add(inputId)
        queue.push(inputId)
      }
    }
    for (const childId of node.children) {
      if (!reachable.has(childId)) {
        reachable.add(childId)
        queue.push(childId)
      }
    }
  }

  // Supprimer les nœuds non-atteignables
  const pruned = new IRGraph(irGraph)
  for (const nodeId of irGraph.nodes.keys()) {
    if (!reachable.has(nodeId)) {
      pruned.nodes.delete(nodeId)
      // Log pour debug (en dev uniquement)
      devLog(`Pruned dead IR node: ${nodeId}`)
    }
  }
  pruned.edges = irGraph.edges.filter(e => reachable.has(e.from) && reachable.has(e.to))

  return pruned
}

// ─── STATIC HOISTING ─────────────────────────────────────────────────────

function hoistStaticNodes(irGraph: IRGraph): IRGraph {
  // Un nœud est "statique" si aucun de ses inputs (transitifs) n'est un StateRef
  // Ces nœuds ne changeront jamais → peuvent être marqués static=true
  // → Le renderer ne créera pas d'effect pour eux

  const staticNodes = new Set<IRNodeID>()

  function isStatic(nodeId: IRNodeID, visiting = new Set<IRNodeID>()): boolean {
    if (staticNodes.has(nodeId)) return true
    if (visiting.has(nodeId)) return false  // Cycle → non-statique par sécurité
    visiting.add(nodeId)

    const node = irGraph.nodes.get(nodeId)!

    // Un StateRef n'est jamais statique
    if (node.kind === 'StateRef') return false

    // Un Constant est toujours statique
    if (node.kind === 'Constant') {
      staticNodes.add(nodeId)
      return true
    }

    // Un nœud est statique si TOUS ses inputs sont statiques
    const allInputsStatic = node.inputs.every(inputId => isStatic(inputId, visiting))

    if (allInputsStatic) {
      staticNodes.add(nodeId)
      return true
    }

    return false
  }

  for (const nodeId of irGraph.nodes.keys()) {
    isStatic(nodeId)
  }

  // Marquer les nœuds statiques
  const hoisted = new IRGraph(irGraph)
  for (const nodeId of staticNodes) {
    hoisted.nodes.get(nodeId)!.flags.static = true
    hoisted.nodes.get(nodeId)!.flags.memoized = false  // Pas besoin de memoization
  }

  return hoisted
}
```


---



## 13. packages/runtime — Moteur réactif [VERSION ENRICHIE]

### 13.1 Rôle et responsabilités

Le runtime est le **moteur d'exécution** du système ECOSYT. Il consomme l'IR compilé et produit l'affichage interactif dans le navigateur.

**Propriétés fondamentales (non négociables) :**
- **Push-based :** les changements se propagent depuis les sources vers les consommateurs
- **Fine-grained :** seuls les nœuds réellement impactés sont recalculés
- **Déterministe :** même état → même affichage, toujours
- **Glitch-free :** un nœud n'est jamais observé dans un état transitoire incohérent
- **Cohérence forte intra-cycle :** pendant un flush, aucun effet de bord externe ne peut observer un état partiel

---

### 13.2 Modèle de réactivité — Spécification formelle complète

#### 13.2.1 Signal — Implémentation de référence

Un Signal est la **primitive immuable-en-structure, mutable-en-valeur** du système. Son comportement est entièrement spécifié ici, sans ambiguïté.

```typescript
// ─── ÉTATS INTERNES D'UN SIGNAL ───────────────────────────────────────────

type NodeState = 'clean' | 'dirty' | 'check'
// clean  : valeur à jour, aucun recalcul nécessaire
// dirty  : valeur périmée, recalcul nécessaire avant prochaine lecture
// check  : un ancêtre est dirty, il faut vérifier si la valeur a changé
//          (état intermédiaire pour éviter les recalculs en cascade inutiles)

// ─── REGISTRE GLOBAL DE TRACKING ──────────────────────────────────────────

// Variable globale du module runtime (thread-local conceptuellement)
// Pointe vers le Computed ou Effect actuellement en cours d'exécution.
// null = pas de contexte de tracking actif.
let currentOwner: ReactiveNode | null = null

// Stack de contextes pour supporter les computeds imbriqués
const ownerStack: ReactiveNode[] = []

function pushOwner(owner: ReactiveNode): void {
  ownerStack.push(currentOwner!)
  currentOwner = owner
}

function popOwner(): void {
  currentOwner = ownerStack.pop() ?? null
}

// ─── IMPLÉMENTATION SIGNAL ────────────────────────────────────────────────

class SignalNode<T> {
  private _value: T
  private _version: number = 0          // Incrémenté à chaque mutation
  private _subscribers = new Set<ReactiveNode>()
  readonly id: ReactiveNodeID = generateId()
  state: NodeState = 'clean'

  constructor(initialValue: T) {
    this._value = initialValue
  }

  // Lecture — avec enregistrement de dépendance si dans un contexte tracked
  read(): T {
    if (currentOwner !== null) {
      // Enregistrement bidirectionnel :
      // currentOwner dépend de ce signal
      currentOwner.addDependency(this)
      // Ce signal notifiera currentOwner si sa valeur change
      this._subscribers.add(currentOwner)
    }
    return this._value
  }

  // Écriture — notification immédiate des abonnés (marquage dirty)
  write(value: T): void {
    // Identité stricte : pas de mise à jour si valeur identique
    // Object.is gère correctement NaN et -0
    if (Object.is(this._value, value)) return

    this._value = value
    this._version++

    // Notification en batch : marquer dirty sans déclencher de flush immédiat
    for (const subscriber of this._subscribers) {
      subscriber.markDirty()
    }

    // Le flush est planifié via le scheduler (microtask), pas ici
    scheduler.scheduleFlush()
  }

  update(fn: (current: T) => T): void {
    this.write(fn(this._value))
  }

  // Retirer un abonné (lors du cleanup d'un effect ou computed)
  removeSubscriber(node: ReactiveNode): void {
    this._subscribers.delete(node)
  }

  get version(): number { return this._version }
}
```

#### 13.2.2 Computed — Lazy evaluation avec comparaison de valeur

```typescript
// ─── IMPLÉMENTATION COMPUTED ──────────────────────────────────────────────

class ComputedNode<T> {
  private _value: T | undefined = undefined
  private _version: number = -1              // -1 = jamais calculé
  private _deps = new Set<SignalNode<any> | ComputedNode<any>>()
  private _subscribers = new Set<ReactiveNode>()
  private _fn: () => T
  private _equal: (a: T, b: T) => boolean
  state: NodeState = 'dirty'
  readonly id: ReactiveNodeID = generateId()

  constructor(fn: () => T, equal: (a: T, b: T) => boolean = Object.is) {
    this._fn = fn
    this._equal = equal
  }

  read(): T {
    // Si quelqu'un lit ce Computed depuis un contexte tracked,
    // enregistrer la dépendance AVANT de potentiellement recalculer
    if (currentOwner !== null) {
      currentOwner.addDependency(this)
      this._subscribers.add(currentOwner)
    }

    // Algorithme de résolution paresseuse :
    // 1. Si clean → retourner la valeur cachée
    // 2. Si dirty → recalculer immédiatement
    // 3. Si check → vérifier si les dépendances ont réellement changé
    switch (this.state) {
      case 'clean':
        return this._value!

      case 'dirty':
        return this._recompute()

      case 'check':
        // Vérifier si au moins une dépendance a une version plus récente
        // que lors du dernier calcul de ce Computed
        if (this._shouldRecompute()) {
          return this._recompute()
        }
        // Aucune dépendance n'a réellement changé de valeur :
        // passer clean sans recalculer
        this.state = 'clean'
        return this._value!
    }
  }

  private _recompute(): T {
    // Nettoyer les anciennes dépendances avant de recalculer
    // (les dépendances peuvent changer selon la branche prise)
    this._cleanupDeps()

    // Exécuter la fonction de calcul en contexte tracked
    pushOwner(this as any)
    let newValue: T
    try {
      newValue = this._fn()
    } finally {
      popOwner()
    }

    this.state = 'clean'
    this._version++

    // Comparaison de valeur : si identique, NE PAS notifier les abonnés
    // C'est ici que se joue l'optimisation anti-cascade
    if (this._value !== undefined && this._equal(this._value, newValue)) {
      // Valeur identique → pas de propagation vers les abonnés
      return this._value
    }

    const previousValue = this._value
    this._value = newValue

    // Notifier les abonnés que ce computed a changé de valeur
    for (const subscriber of this._subscribers) {
      subscriber.markDirty()
    }

    return newValue
  }

  private _shouldRecompute(): boolean {
    // En état 'check' : vérifier récursivement si les dépendances ont changé
    for (const dep of this._deps) {
      if (dep instanceof ComputedNode && dep.state !== 'clean') {
        // Forcer la résolution récursive de la dépendance
        dep.read()
      }
      // Un signal a une version plus récente que lors de notre dernier calcul ?
      if (dep.version > this._version) return true
    }
    return false
  }

  addDependency(dep: SignalNode<any> | ComputedNode<any>): void {
    this._deps.add(dep)
  }

  markDirty(): void {
    if (this.state === 'clean') {
      // Passer en 'check' (pas directement 'dirty') :
      // les abonnés peuvent encore être à jour si la valeur finale ne change pas
      this.state = 'check'
      for (const subscriber of this._subscribers) {
        // Propager l'état 'check' vers les abonnés
        if (subscriber.state === 'clean') {
          subscriber.markCheck?.()
        }
      }
    }
  }

  private _cleanupDeps(): void {
    for (const dep of this._deps) {
      dep.removeSubscriber(this as any)
    }
    this._deps.clear()
  }

  removeSubscriber(node: ReactiveNode): void {
    this._subscribers.delete(node)
  }

  get version(): number { return this._version }
}
```

**Invariant clé — No-Glitch par construction :**

Le système garantit qu'un abonné ne voit jamais une valeur intermédiaire incohérente grâce à deux mécanismes combinés :

1. **Propagation différée :** les mutations de signal ne déclenchent que des marquages dirty, jamais de recalculs synchrones immédiats.
2. **Ordre topologique strict :** lors du flush, les computeds sont recalculés dans l'ordre de leurs dépendances — un computed n'est jamais recalculé avant ses dépendances.

```
DÉMONSTRATION du no-glitch sur le cas "diamant" :

Signal A ──► Computed B ──► Computed D (observateur)
         └──► Computed C ──┘

A.set(newValue)
  → B.markDirty()
  → C.markDirty()
  → D.markCheck()    ← D ne recalcule PAS encore

flush() commence :
  1. topoSort → [B, C, D]
  2. Recalcule B → B.value change, B.version++
  3. Recalcule C → C.value change, C.version++
  4. Recalcule D → lit B (version récente) ET C (version récente) → valeur cohérente

SANS cet ordre : si D lisait B pendant que C était encore dirty,
D observerait une valeur intermédiaire (B nouveau + C ancien) → GLITCH
```

#### 13.2.3 Effect — Exécution post-rendu avec cleanup

```typescript
// ─── IMPLÉMENTATION EFFECT ────────────────────────────────────────────────

type EffectFn = () => void | (() => void)

class EffectNode {
  private _fn: EffectFn
  private _cleanup: (() => void) | null = null
  private _deps = new Set<SignalNode<any> | ComputedNode<any>>()
  private _disposed = false
  state: NodeState = 'dirty'    // Les effects démarrent dirty (premier run au mount)
  readonly id: ReactiveNodeID = generateId()

  constructor(fn: EffectFn) {
    this._fn = fn
    // Enregistrer dans le scheduler pour premier run
    scheduler.queueEffect(this)
  }

  run(): void {
    if (this._disposed) return

    // Cleanup du run précédent avant ré-exécution
    this._cleanup?.()
    this._cleanup = null

    // Nettoyer les dépendances précédentes
    this._cleanupDeps()

    // Exécuter la fonction en contexte tracked
    pushOwner(this as any)
    let cleanup: void | (() => void)
    try {
      cleanup = this._fn()
    } catch (err) {
      popOwner()
      // Les erreurs dans les effects sont catchées et reportées
      // sans casser le cycle de flush
      reportEffectError(this.id, err)
      return
    }
    popOwner()

    this.state = 'clean'

    if (typeof cleanup === 'function') {
      this._cleanup = cleanup
    }
  }

  markDirty(): void {
    if (this.state !== 'dirty') {
      this.state = 'dirty'
      // Les effects ne sont pas recalculés immédiatement :
      // ils sont mis en queue pour après le rendu
      scheduler.queueEffect(this)
    }
  }

  // Cleanup explicite (unmount d'un composant)
  dispose(): void {
    this._disposed = true
    this._cleanup?.()
    this._cleanupDeps()
    scheduler.removeEffect(this)
  }

  addDependency(dep: SignalNode<any> | ComputedNode<any>): void {
    this._deps.add(dep)
  }

  private _cleanupDeps(): void {
    for (const dep of this._deps) {
      dep.removeSubscriber(this as any)
    }
    this._deps.clear()
  }
}
```

---

### 13.3 Graphe de dépendances runtime — Construction et mise à jour

#### 13.3.1 Construction automatique par tracking

Le graphe de dépendances est construit **implicitement et dynamiquement** lors de l'exécution des fonctions de computed et d'effect. Il n'y a pas de déclaration explicite de dépendances.

```typescript
// Structure du graphe en mémoire
interface ReactiveGraph {
  signals:   Map<ReactiveNodeID, SignalNode<any>>
  computeds: Map<ReactiveNodeID, ComputedNode<any>>
  effects:   Map<ReactiveNodeID, EffectNode>

  // Edges forward  : source → ses abonnés directs
  // Stockés dans .subscribers de chaque nœud (Set)

  // Edges backward : abonné → ses dépendances directes
  // Stockés dans ._deps de chaque nœud (Set)
}

// Le graphe est maintenu en cohérence par deux invariants :
// 1. Si B._deps contient A, alors A._subscribers contient B
// 2. Si A._subscribers contient B, alors B._deps contient A
// Ces deux invariants sont garantis par addDependency() + removeSubscriber()
```

#### 13.3.2 Reconstruction des dépendances à chaque run

Les dépendances d'un Computed ou d'un Effect **ne sont pas statiques**. Elles sont reconstruites à chaque run. Cela permet des dépendances conditionnelles sans déclarer explicitement toutes les branches possibles.

```typescript
// Exemple de dépendance conditionnelle
const isAdmin = signal(false)
const adminData = signal({ quota: 100 })
const userMessage = signal('Hello')

const message = computed(() => {
  if (isAdmin()) {
    // Cette dépendance sur adminData.quota n'existe QUE si isAdmin = true
    return `Admin: quota ${adminData().quota}`
  }
  // Cette dépendance sur userMessage n'existe QUE si isAdmin = false
  return userMessage()
})

// Quand isAdmin passe de false à true :
// 1. message se recalcule
// 2. Les dépendances précédentes (userMessage) sont retirées
// 3. Les nouvelles dépendances (adminData) sont enregistrées
// 4. userMessage.set() ne déclenchera PLUS message de se recalculer

// Sans reconstruction à chaque run, message écouterait les deux sources
// en permanence, causant des recalculs inutiles
```

#### 13.3.3 Détection et prévention des cycles

```typescript
// Les cycles dans le graphe Computed sont interdits.
// Détection à la création du Computed (pas au runtime).

function detectCycle(node: ComputedNode<any>, visiting: Set<ReactiveNodeID>): boolean {
  if (visiting.has(node.id)) return true   // Cycle détecté
  visiting.add(node.id)

  for (const dep of node._deps) {
    if (dep instanceof ComputedNode) {
      if (detectCycle(dep, visiting)) return true
    }
  }

  visiting.delete(node.id)
  return false
}

// Les cycles via les Effects sont légaux (A effect → signal B → effect → signal A)
// mais le scheduler limite le nombre d'itérations pour prévenir les boucles infinies

const MAX_EFFECT_ITERATIONS = 100

function runEffectSafely(effect: EffectNode, iterationCount: Map<ReactiveNodeID, number>): void {
  const count = (iterationCount.get(effect.id) ?? 0) + 1
  if (count > MAX_EFFECT_ITERATIONS) {
    console.error(`Effect ${effect.id} exceeded max iterations — possible infinite loop`)
    effect.dispose()
    return
  }
  iterationCount.set(effect.id, count)
  effect.run()
}
```

---

### 13.4 Scheduler — Spécification algorithmique complète

#### 13.4.1 Architecture du scheduler

```typescript
// Le scheduler est le coordinateur central du runtime.
// Il est singleton dans un contexte d'exécution.

class Scheduler {
  private _dirtyComputeds = new Set<ComputedNode<any>>()
  private _pendingEffects = new Set<EffectNode>()
  private _flushScheduled = false
  private _flushing = false
  private _batchDepth = 0           // Profondeur d'imbrication des batches

  // ─── PLANIFICATION ───────────────────────────────────────────────────────

  scheduleFlush(): void {
    // Ne planifier un flush que si pas déjà planifié ET pas en batch
    if (!this._flushScheduled && this._batchDepth === 0) {
      this._flushScheduled = true
      // Utiliser queueMicrotask (priorité plus haute que setTimeout)
      // pour s'exécuter après le code synchrone courant
      // mais avant le prochain frame de rendu
      queueMicrotask(() => this.flush())
    }
  }

  queueEffect(effect: EffectNode): void {
    this._pendingEffects.add(effect)
    this.scheduleFlush()
  }

  removeEffect(effect: EffectNode): void {
    this._pendingEffects.delete(effect)
  }

  // ─── BATCHING ─────────────────────────────────────────────────────────────

  // batch() permet de grouper plusieurs mutations en un seul cycle de flush.
  // Toutes les modifications appliquées dans fn() déclenchent UNE seule passe.
  batch(fn: () => void): void {
    this._batchDepth++
    try {
      fn()
    } finally {
      this._batchDepth--
      if (this._batchDepth === 0) {
        // Tous les batchs imbriqués sont terminés → planifier le flush
        this.scheduleFlush()
      }
    }
  }

  // Variante synchrone : flush immédiat après le batch
  batchSync(fn: () => void): void {
    this._batchDepth++
    try {
      fn()
    } finally {
      this._batchDepth--
      if (this._batchDepth === 0) {
        this.flush()  // Flush synchrone immédiat
      }
    }
  }

  // ─── FLUSH — CŒUR DE L'ALGORITHME ────────────────────────────────────────

  flush(): void {
    if (this._flushing) {
      // Re-entrance : un effect a déclenché une nouvelle mutation
      // → reporter au prochain microtask
      queueMicrotask(() => this.flush())
      return
    }

    this._flushing = true
    this._flushScheduled = false

    try {
      this._flushComputeds()
      this._flushDOM()
      this._flushEffects()
    } finally {
      this._flushing = false
    }
  }

  // Phase 1 — Recalcul des Computeds dans l'ordre topologique
  private _flushComputeds(): void {
    // Collecter tous les computeds dirty (directement marqués dirty)
    // + les computeds en état 'check' qui ont des dépendances dirty
    const dirty = this._collectDirtyComputeds()

    // Tri topologique : garantit que A est recalculé avant B si B dépend de A
    const sorted = this._topologicalSort(dirty)

    for (const computed of sorted) {
      // La lecture force le recalcul si dirty/check
      // Si la valeur ne change pas, les abonnés de computed NE sont PAS notifiés
      computed.read()
    }
  }

  // Phase 2 — Application des patches DOM
  // (entre computeds et effects pour garantir la cohérence de l'affichage)
  private _flushDOM(): void {
    // Collecter les IRNodes liés à des computeds qui ont effectivement changé de valeur
    const changedBindings = domBinder.collectChangedBindings()

    // Appliquer les patches DOM dans l'ordre du document (haut → bas)
    // pour éviter les recalculs de layout en cascade
    for (const binding of changedBindings) {
      domRenderer.applyPatch(binding)
    }
  }

  // Phase 3 — Exécution des effects (post-rendu)
  private _flushEffects(): void {
    // Snapshot de la liste : les effects peuvent en créer de nouveaux
    const effects = [...this._pendingEffects]
    this._pendingEffects.clear()

    const iterationCount = new Map<ReactiveNodeID, number>()
    for (const effect of effects) {
      if (effect.state === 'dirty') {
        runEffectSafely(effect, iterationCount)
      }
    }

    // Si des effects ont créé de nouvelles mutations,
    // ils ont enqueued de nouveaux effects → nouveau flush planifié automatiquement
  }

  // ─── TRI TOPOLOGIQUE ─────────────────────────────────────────────────────

  private _topologicalSort(nodes: Set<ComputedNode<any>>): ComputedNode<any>[] {
    // Kahn's algorithm (BFS topologique)
    // Complexité : O(V + E) où V = nombre de computeds, E = nombre de dépendances

    const result: ComputedNode<any>[] = []
    const inDegree = new Map<ReactiveNodeID, number>()
    const adjList = new Map<ReactiveNodeID, Set<ComputedNode<any>>>()

    // Initialiser les degrés d'entrée
    for (const node of nodes) {
      if (!inDegree.has(node.id)) inDegree.set(node.id, 0)

      for (const dep of node._deps) {
        if (dep instanceof ComputedNode && nodes.has(dep)) {
          // dep → node : dep doit être calculé avant node
          if (!adjList.has(dep.id)) adjList.set(dep.id, new Set())
          adjList.get(dep.id)!.add(node)
          inDegree.set(node.id, (inDegree.get(node.id) ?? 0) + 1)
        }
      }
    }

    // Commencer avec les nœuds sans dépendances dans l'ensemble dirty
    const queue: ComputedNode<any>[] = []
    for (const node of nodes) {
      if ((inDegree.get(node.id) ?? 0) === 0) queue.push(node)
    }

    while (queue.length > 0) {
      const node = queue.shift()!
      result.push(node)

      for (const dependent of adjList.get(node.id) ?? []) {
        const newDegree = (inDegree.get(dependent.id) ?? 1) - 1
        inDegree.set(dependent.id, newDegree)
        if (newDegree === 0) queue.push(dependent)
      }
    }

    // Si result.length < nodes.size → cycle détecté (ne devrait pas arriver)
    return result
  }

  private _collectDirtyComputeds(): Set<ComputedNode<any>> {
    // Parcours BFS depuis les signaux modifiés
    // pour collecter tous les computeds nécessitant une réévaluation
    const dirty = new Set<ComputedNode<any>>()
    const queue: ReactiveNode[] = [...this._dirtyComputeds]
    this._dirtyComputeds.clear()

    while (queue.length > 0) {
      const node = queue.shift()!
      if (node instanceof ComputedNode) {
        dirty.add(node)
        for (const subscriber of node._subscribers) {
          if (subscriber instanceof ComputedNode && !dirty.has(subscriber)) {
            queue.push(subscriber)
          }
        }
      }
    }

    return dirty
  }
}

// Instance singleton exportée
export const scheduler = new Scheduler()
```

#### 13.4.2 Microtasks vs Macrotasks — Justification du choix

```
Microtask (queueMicrotask) — CHOIX ECOSYT
  ✓ S'exécute après le script courant mais AVANT le prochain frame de rendu
  ✓ Latence minimale (< 1ms sur Chrome)
  ✓ Pas de saut de frame visible
  ✓ Comportement identique à Promise.then() et MutationObserver
  ✗ Peut bloquer le thread si trop de travail dans le flush

requestAnimationFrame — NON RETENU
  ✓ Synchronisé avec le taux de rafraîchissement (60fps)
  ✗ Latence de 0 à 16ms (trop variable pour l'édition interactive)
  ✗ Ne s'exécute pas si l'onglet est en background

setTimeout(fn, 0) — NON RETENU
  ✗ Latence minimale de 4ms selon la spec HTML
  ✗ Throttled à 1fps en background
  ✗ Peut interférer avec d'autres setTimeout de l'application

Synchrone — NON RETENU
  ✗ Signal.set() → recalcul immédiat → pas de batching possible
  ✗ Performance catastrophique pour les mutations multiples simultanées

─── BUDGET TEMPOREL PAR FLUSH ───────────────────────────────────
Phase 1 (Computeds)  : < 4ms     (pour 500 computeds dirty)
Phase 2 (DOM patch)  : < 8ms     (pour 200 patches DOM)
Phase 3 (Effects)    : < 4ms     (limité par runEffectSafely)
TOTAL target P95     : < 16ms    (1 frame à 60fps)
```

---

### 13.5 Renderer fine-grained — Spécification complète

#### 13.5.1 Architecture DOM Binder

```typescript
// Le DOM Binder maintient la correspondance entre IRNodes et éléments DOM réels.
// Il est le pont entre le graphe réactif (runtime) et le DOM.

interface DOMBinding {
  irNodeId: IRNodeID
  element: Element
  prop: string             // Quelle propriété du DOM est liée
  computed: ComputedNode<any>   // Le computed qui produit la valeur
  lastValue: unknown       // Dernière valeur appliquée (pour déduplication)
}

class DOMBinder {
  private _bindings = new Map<string, DOMBinding>()  // key = `${irNodeId}:${prop}`
  private _changedBindings: DOMBinding[] = []

  // Enregistrer un binding IRNode → DOM
  register(irNodeId: IRNodeID, element: Element, prop: string, computed: ComputedNode<any>): void {
    const key = `${irNodeId}:${prop}`
    this._bindings.set(key, { irNodeId, element, prop, computed, lastValue: Symbol('unset') })

    // L'effect de binding observe le computed et enregistre les changements
    createEffect(() => {
      const newValue = computed.read()
      const binding = this._bindings.get(key)!
      if (!Object.is(newValue, binding.lastValue)) {
        binding.lastValue = newValue
        this._changedBindings.push(binding)
        scheduler.scheduleFlush()
      }
    })
  }

  collectChangedBindings(): DOMBinding[] {
    const changed = this._changedBindings.splice(0)
    // Trier par position dans le DOM pour minimiser les reflows
    return changed.sort((a, b) => {
      const pos = a.element.compareDocumentPosition(b.element)
      return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    })
  }

  unregister(irNodeId: IRNodeID): void {
    for (const key of this._bindings.keys()) {
      if (key.startsWith(irNodeId)) {
        this._bindings.delete(key)
      }
    }
  }
}
```

#### 13.5.2 Application des patches DOM

```typescript
// ─── STRATÉGIE DE PATCH PAR TYPE DE PROPRIÉTÉ ────────────────────────────

class DOMRenderer {
  applyPatch(binding: DOMBinding): void {
    const { element, prop, lastValue: value } = binding

    // Dispatch par type de propriété pour maximiser la performance
    // (évite les tests conditionnels à chaque patch)
    const patcher = this._getPatcher(prop)
    patcher(element, value)
  }

  private _getPatcher(prop: string): (el: Element, val: unknown) => void {
    // Cache des patchers par nom de prop
    if (!this._patcherCache.has(prop)) {
      this._patcherCache.set(prop, this._buildPatcher(prop))
    }
    return this._patcherCache.get(prop)!
  }

  private _buildPatcher(prop: string): (el: Element, val: unknown) => void {
    // Propriétés directes sur l'élément (pas d'attribut)
    const directProps = new Set(['value', 'checked', 'selected', 'indeterminate',
                                  'disabled', 'readOnly', 'hidden', 'textContent',
                                  'innerHTML', 'scrollTop', 'scrollLeft'])

    if (directProps.has(prop)) {
      return (el, val) => { (el as any)[prop] = val }
    }

    // className → classList manipulation pour éviter les reflows complets
    if (prop === 'className') {
      return (el, val) => {
        const newClasses = String(val).split(' ').filter(Boolean)
        const oldClasses = [...el.classList]
        // Retirer les anciennes classes non présentes dans les nouvelles
        for (const cls of oldClasses) {
          if (!newClasses.includes(cls)) el.classList.remove(cls)
        }
        // Ajouter les nouvelles classes manquantes
        for (const cls of newClasses) {
          if (!el.classList.contains(cls)) el.classList.add(cls)
        }
      }
    }

    // style — mise à jour propriété par propriété
    if (prop === 'style') {
      return (el, val) => {
        const htmlEl = el as HTMLElement
        if (typeof val === 'object' && val !== null) {
          for (const [k, v] of Object.entries(val as Record<string, string>)) {
            htmlEl.style.setProperty(
              // camelCase → kebab-case
              k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`),
              v
            )
          }
        }
      }
    }

    // Attributs HTML standards
    return (el, val) => {
      if (val === null || val === false || val === undefined) {
        el.removeAttribute(prop)
      } else if (val === true) {
        el.setAttribute(prop, '')
      } else {
        el.setAttribute(prop, String(val))
      }
    }
  }

  private _patcherCache = new Map<string, (el: Element, val: unknown) => void>()
}

// ─── RÉCONCILIATION DES LISTES (Loop nodes) ──────────────────────────────

interface KeyedItem {
  key: Key
  data: unknown
}

class ListReconciler {
  // Algorithme de réconciliation avec keys — O(n) avec des structures de données
  reconcile(
    container: Element,
    prevItems: Map<Key, Element>,      // key → élément DOM existant
    nextItems: KeyedItem[],            // items dans le nouvel ordre
    createItem: (data: unknown) => Element
  ): void {
    const nextKeys = new Set(nextItems.map(i => i.key))

    // 1. Supprimer les éléments qui ne sont plus dans nextItems
    for (const [key, el] of prevItems) {
      if (!nextKeys.has(key)) {
        el.remove()
        prevItems.delete(key)
      }
    }

    // 2. Insérer ou réordonner les éléments dans nextItems
    let referenceNode: Element | null = null
    for (let i = nextItems.length - 1; i >= 0; i--) {
      const { key, data } = nextItems[i]

      let el = prevItems.get(key)
      if (!el) {
        // Élément nouveau : créer le nœud DOM
        el = createItem(data)
        prevItems.set(key, el)
      }

      // Insérer à la bonne position (insertion avant le referenceNode)
      if (el.nextElementSibling !== referenceNode) {
        container.insertBefore(el, referenceNode)
      }

      referenceNode = el
    }
  }
}
```

#### 13.5.3 Gestion des nœuds conditionnels (Conditional nodes)

```typescript
// Les nœuds Conditional nécessitent un traitement spécial :
// ils doivent monter/démonter des sous-arbres DOM entiers

class ConditionalRenderer {
  private _comment: Comment    // Marqueur de position dans le DOM
  private _currentBranch: 'true' | 'false' | 'none' = 'none'
  private _trueRoot: Element | null = null
  private _falseRoot: Element | null = null
  private _trueEffects: EffectNode[] = []
  private _falseEffects: EffectNode[] = []

  constructor(parent: Element) {
    // Utiliser un commentaire comme anchor dans le DOM
    // permet de retrouver la position d'insertion après unmount
    this._comment = document.createComment('conditional')
    parent.appendChild(this._comment)
  }

  update(condition: boolean, renderTrue: () => Element, renderFalse?: () => Element): void {
    const targetBranch = condition ? 'true' : 'false'

    if (targetBranch === this._currentBranch) return    // Pas de changement

    // Démonter la branche actuelle
    this._unmountCurrent()

    // Monter la nouvelle branche
    if (targetBranch === 'true') {
      this._trueRoot = renderTrue()
      this._comment.after(this._trueRoot)
    } else if (renderFalse) {
      this._falseRoot = renderFalse()
      this._comment.after(this._falseRoot)
    }

    this._currentBranch = targetBranch
  }

  private _unmountCurrent(): void {
    // 1. Disposer tous les effects de la branche courante
    const effects = this._currentBranch === 'true' ? this._trueEffects : this._falseEffects
    for (const effect of effects) effect.dispose()
    effects.length = 0

    // 2. Retirer le DOM
    const root = this._currentBranch === 'true' ? this._trueRoot : this._falseRoot
    root?.remove()
    if (this._currentBranch === 'true') this._trueRoot = null
    else this._falseRoot = null
  }
}
```

---

### 13.6 Mapping IR → Runtime — Spécification complète

```typescript
// Chaque IRNode est matérialisé en un ReactiveNode exécutable.
// Ce mapping est effectué une fois lors du montage initial,
// puis mis à jour incrémentalement par le compilateur.

class IRRuntimeMapper {
  private _signalRegistry = new Map<IRNodeID, SignalNode<any>>()
  private _computedRegistry = new Map<IRNodeID, ComputedNode<any>>()
  private _domRegistry = new Map<IRNodeID, Element>()

  materializeGraph(irGraph: IRGraph): void {
    // Passe 1 : créer les signaux (StateRef, Constant)
    for (const [id, node] of irGraph.nodes) {
      if (node.kind === 'StateRef') {
        const sig = new SignalNode(node.initialValue)
        this._signalRegistry.set(id, sig)
      } else if (node.kind === 'Constant') {
        // Constant → signal frozen (jamais dirty)
        const sig = new SignalNode(node.value)
        this._signalRegistry.set(id, sig)
      }
    }

    // Passe 2 : créer les computeds (dans l'ordre topologique de l'IR)
    const sorted = topologicalSortIR(irGraph)
    for (const node of sorted) {
      if (node.kind === 'Computed') {
        const dep = this._resolveInput(node.inputs[0])
        const comp = new ComputedNode(() => dep.read())
        this._computedRegistry.set(node.id, comp)
      }
    }

    // Passe 3 : créer les éléments DOM et leurs bindings
    for (const [id, node] of irGraph.nodes) {
      if (node.kind === 'Element') {
        const el = this._createElement(node)
        this._domRegistry.set(id, el)

        // Lier les props dynamiques
        for (const [propKey, edge] of Object.entries(node.dynamicProps ?? {})) {
          const source = this._resolveEdge(edge)
          domBinder.register(id, el, propKey, source)
        }

        // Appliquer les props statiques une seule fois (pas de binding)
        for (const [propKey, value] of Object.entries(node.staticProps ?? {})) {
          domRenderer.applyPatch({ element: el, prop: propKey, lastValue: value } as any)
        }
      }
    }
  }

  // Patch incrémental : uniquement les IRNodes modifiés par la compilation
  patchGraph(patch: IRPatch): void {
    for (const { type, irNodeId, changes } of patch.updates) {
      switch (type) {
        case 'prop-changed': {
          const el = this._domRegistry.get(irNodeId)
          if (el) {
            // Mettre à jour le binding existant ou créer un nouveau
            const newSource = this._resolveEdge(changes.edge)
            domBinder.updateBinding(irNodeId, changes.prop, newSource)
          }
          break
        }
        case 'node-added': {
          // Créer le nouvel élément DOM et le monter
          const irNode = changes.node
          const el = this._createElement(irNode)
          this._domRegistry.set(irNodeId, el)
          this._mountNode(irNodeId, irNode, el)
          break
        }
        case 'node-removed': {
          // Démonter et supprimer du DOM
          const el = this._domRegistry.get(irNodeId)
          el?.remove()
          this._domRegistry.delete(irNodeId)
          domBinder.unregister(irNodeId)
          break
        }
      }
    }
  }

  private _createElement(node: IRNode): Element {
    const el = document.createElement(node.tagName ?? 'div')
    // Appliquer les props statiques immédiatement
    for (const [k, v] of Object.entries(node.staticProps ?? {})) {
      domRenderer.applyPatch({ element: el, prop: k, lastValue: v } as any)
    }
    return el
  }
}
```

---

### 13.7 Gestion des erreurs et des cas limites

#### 13.7.1 Erreurs dans les Computeds

```typescript
// Les erreurs dans les computeds sont propagées aux lecteurs,
// pas catchées silencieusement.

class ComputedNode<T> {
  private _error: Error | null = null

  read(): T {
    // ... (code précédent)
    // Si la dernière exécution a throwé, re-throw à chaque lecture
    if (this._error) throw this._error
    return this._value!
  }

  private _recompute(): T {
    this._cleanupDeps()
    pushOwner(this as any)
    try {
      const value = this._fn()
      this._error = null   // Succès : effacer l'erreur précédente
      return value
    } catch (err) {
      this._error = err instanceof Error ? err : new Error(String(err))
      popOwner()
      throw this._error
    }
    popOwner()
  }
}

// Les erreurs dans les computeds liés au DOM sont catchées par le renderer
// et remplacées par un placeholder visuel d'erreur
function safeApplyBinding(binding: DOMBinding): void {
  try {
    domRenderer.applyPatch(binding)
  } catch (err) {
    // Afficher un nœud d'erreur à la place
    const errEl = document.createElement('div')
    errEl.className = '__ecosyt-runtime-error'
    errEl.textContent = `Runtime error: ${(err as Error).message}`
    binding.element.replaceWith(errEl)
    reportRuntimeError(binding.irNodeId, err)
  }
}
```

#### 13.7.2 Profondeur de dépendances et limites

```typescript
// Garde-fou contre les graphes de dépendances pathologiques

const RUNTIME_LIMITS = {
  MAX_COMPUTED_DEPTH: 50,      // Profondeur max de chaîne A→B→C→...→Z
  MAX_EFFECT_RERUNS: 100,      // Re-exécutions max d'un effect par flush
  MAX_FLUSH_ITERATIONS: 10,    // Flushes consécutifs (effets → signaux → flush)
  MAX_SUBSCRIBERS: 10_000,     // Abonnés max par signal (détection hotspot)
}

// Si un signal dépasse MAX_SUBSCRIBERS, émettre un warning
// car c'est souvent signe d'une architecture à revoir
class SignalNode<T> {
  private _subscribers = new Set<ReactiveNode>()

  addSubscriber(node: ReactiveNode): void {
    if (this._subscribers.size >= RUNTIME_LIMITS.MAX_SUBSCRIBERS) {
      console.warn(`Signal ${this.id} has ${this._subscribers.size} subscribers — consider splitting`)
    }
    this._subscribers.add(node)
  }
}
```

---

## 13-B. Runtime réactif — Spécification technique détaillée [COMPLÉMENT]

*(Cette section s'insère dans la Partie V — Spécifications techniques profondes)*

### 23.1 Garanties formelles du système réactif

Le runtime ECOSYT offre les garanties suivantes, formellement vérifiables :

**G1 — Complétude de propagation**
Si `signal.set(v)` est appelé et que `computed C` dépend de `signal` (directement ou transitivement), alors `C` sera recalculé lors du prochain flush. Aucune mise à jour ne peut être "oubliée".

**G2 — Absence de glitch**
Pour toute expression `E = f(A, B)` où `A` et `B` sont des computeds dérivés d'un même signal `S`, la valeur observée de `E` est toujours cohérente avec une valeur unique de `S`. Il n'existe pas d'instant où `A` a sa valeur post-mutation et `B` sa valeur pré-mutation.

**G3 — Idempotence du flush**
`flush(); flush()` est équivalent à `flush()` si aucune nouvelle mutation n'a eu lieu entre les deux. Le second flush est un no-op.

**G4 — Minimalité des recalculs**
Un computed est recalculé au plus une fois par cycle de flush, même s'il a plusieurs abonnés ou plusieurs sources modifiées simultanément.

**G5 — Ordre effects/render**
Les effects sont toujours exécutés APRÈS l'application des patches DOM dans un cycle de flush. Un effect voit toujours le DOM dans son état post-rendu.

### 23.2 Diagramme de séquence complet d'un cycle de flush

```
signal.set(newValue)              ← mutation dans le code utilisateur
  │
  ├─► subscriber B.markDirty()
  │     └─► B._subscribers : D.markCheck()
  │
  ├─► subscriber C.markDirty()
  │     └─► C._subscribers : D.markCheck()   ← D déjà en 'check', skip
  │
  └─► scheduler.scheduleFlush()   ← planification microtask

[fin du code synchrone courant]

queueMicrotask(() => scheduler.flush())
  │
  ├── Phase 1 : _flushComputeds()
  │     ├── collectDirtyComputeds() → {B, C, D}
  │     ├── topologicalSort({B, C, D}) → [B, C, D]
  │     ├── B.read() → recalcule → valeur_B_nouvelle (changed=true)
  │     │     └─► B._subscribers notifiés : D reste dirty
  │     ├── C.read() → recalcule → valeur_C_nouvelle (changed=true)
  │     │     └─► C._subscribers notifiés : D reste dirty
  │     └── D.read() → recalcule (lit B et C déjà à jour) → valeur_D
  │           └─► Si valeur_D === ancien_D : D.changed = false
  │
  ├── Phase 2 : _flushDOM()
  │     ├── collectChangedBindings() → bindings liés à B et C (si D.changed=false)
  │     └── pour chaque binding : domRenderer.applyPatch()
  │
  └── Phase 3 : _flushEffects()
        ├── effects marqués dirty → runEffectSafely()
        └── si un effect a muté un signal → nouveau scheduleFlush() planifié
```

### 23.3 Intégration avec la compilation incrémentale

```
Mutation AST
  │
  ▼
ASTReverseIndex.lookup(nodeId) → {irNodeIds}
  │
  ▼
Compiler.invalidate(irNodeIds)
  │
  ▼
IRRuntimeMapper.patchGraph(patch)
  │
  ├── Pour chaque IRNode modifié :
  │     • si prop statique → MAJ directe DOM (pas de signal)
  │     • si prop dynamique → MAJ du computed source
  │       → signal.set(newComputedFn) → markDirty cascade → flush
  │
  └── Pour chaque IRNode ajouté/supprimé :
        • mount/unmount complet (createElement + bind)
        • dispose() des effects de la branche supprimée
```

### 23.4 Performance — Métriques et seuils

```typescript
// Métriques instrumentées dans le runtime (mode développement uniquement)
// Désactivées en production via tree-shaking

interface RuntimeMetrics {
  flushCount: number
  avgFlushDurationMs: number
  maxFlushDurationMs: number
  computedRecalculations: number
  domPatches: number
  effectRuns: number
  signalWrites: number
  cacheHitRate: number    // % de computeds "check" résolus sans recalcul
}

// Seuils d'alerte (CI/CD + monitoring production)
const PERFORMANCE_THRESHOLDS = {
  flush_p95_ms: 16,             // 1 frame à 60fps
  computed_recalc_per_flush: 500, // Au-delà → investiguer la topologie
  dom_patches_per_flush: 200,   // Au-delà → potentiel de chunking
  effect_runs_per_flush: 50,    // Au-delà → risk d'infinite loop
}
```


## 14. packages/sync — Couche CRDT (spécification initiale)

### 14.1 Rôle et responsabilités

Le package sync implémente la couche de données distribuée permettant l'édition collaborative multi-utilisateur. Ses responsabilités :

- Maintenir un `Y.Doc` Yjs synchronisé avec le NodeMap AST local
- Propager les mutations AST locales vers les clients distants (via le sync-server)
- Appliquer les mutations distantes reçues en les traduisant en mutations AST locales
- Gérer l'awareness (présence, curseurs, sélections)
- Implémenter les stratégies de résolution des conflits métier

**Ce que le package sync ne fait PAS :**
- Prendre des décisions de rendu (pas d'accès au DOM)
- Valider les invariants AST (délégué au package ast)
- Gérer la persistance (délégué à l'API)

### 14.2 Architecture CRDT — Mapping AST ↔ Yjs

#### 14.2.1 Structure du Y.Doc

```typescript
// Le Y.Doc est la structure de données distribuée principale.
// Il reflète exactement la structure du NodeMap AST.

// Structure du Y.Doc ECOSYT :
const ydoc = new Y.Doc()

// Registre principal des nœuds
const yNodes = ydoc.getMap<Y.Map<unknown>>('nodes')
// Structure : {
//   [nodeId]: Y.Map {
//     'type': 'Button',
//     'category': 'UI',
//     'props': Y.Map { 'label': 'Click me', ... },
//     'style': Y.Map { 'backgroundColor': '#007bff', ... },
//     'children': Y.Array ['child_1', 'child_2'],
//     'parent': 'container_1',
//     'bindings': Y.Map { ... },
//     'meta': Y.Map { 'createdAt': 1700000000, ... }
//   }
// }

// Hiérarchie (redondante mais nécessaire pour les opérations CRDT sur les listes)
const yChildren = ydoc.getMap<Y.Array<string>>('childrenMap')
// Structure : { [parentId]: Y.Array [childId1, childId2, ...] }

// Métadonnées du document
const yMeta = ydoc.getMap<unknown>('meta')
// Structure : { 'rootId': '...', 'schemaVersion': '1.2.0', ... }
```

#### 14.2.2 Mapping des types AST → CRDT

| Type AST | Type Yjs | Justification |
|---|---|---|
| NodeMap (registre) | Y.Map<Y.Map> | Accès O(1), merge automatique des modifications concurrentes |
| Node.props | Y.Map | Modifications prop-level indépendantes |
| Node.style | Y.Map | Idem |
| Node.bindings | Y.Map | Idem |
| Node.children[] | Y.Array | Ordre préservé, insertions/suppressions concurrentes gérées |
| Node.parent | Y.Text (string) | LWW pour un champ scalaire |
| Node.type | Y.Text (string) | Immuable après création (jamais modifié) |
| Node.meta.createdAt | number (dans Y.Map) | Immuable |
| Node.meta.updatedAt | number (dans Y.Map) | LWW |

#### 14.2.3 Protocole de synchronisation bidirectionnelle

**Direction 1 — Mutation AST locale → CRDT**

```typescript
// Intercepteur sur toutes les mutations AST
// (intégré au niveau du NodeMap)

function onASTMutation(operation: Operation, newNodeMap: NodeMap) {
  ydoc.transact(() => {
    switch (operation.op) {
      case 'CREATE_NODE': {
        const { node } = operation
        const yNode = new Y.Map()
        yNode.set('type', node.type)
        yNode.set('category', node.category)
        yNode.set('props', mapToYMap(node.props))
        yNode.set('style', mapToYMap(node.style ?? {}))
        yNode.set('children', new Y.Array())
        yNode.set('parent', node.parent)
        yNode.set('bindings', new Y.Map())
        yNode.set('meta', mapToYMap(node.meta))
        yNodes.set(node.id, yNode)
        // Mettre à jour childrenMap du parent
        const yParentChildren = yChildren.get(node.parent!)
        yParentChildren?.insert(operation.position ?? yParentChildren.length, [node.id])
        break
      }

      case 'UPDATE_PROP': {
        const { nodeId, path, value } = operation
        const yNode = yNodes.get(nodeId)
        if (!yNode) return
        // path ex: "props.text" → naviguer dans Y.Map imbriqués
        setNestedYMapValue(yNode, path, value)
        break
      }

      case 'DELETE_NODE': {
        const { nodeId } = operation
        // Supprimer le nœud et tous ses descendants
        const descendants = collectDescendants(newNodeMap, nodeId)
        for (const id of [nodeId, ...descendants]) {
          yNodes.delete(id)
          yChildren.delete(id)
        }
        // Retirer de childrenMap du parent
        const parentId = operation.parentId
        const yParentChildren = yChildren.get(parentId)
        const idx = yParentChildren?.toArray().indexOf(nodeId)
        if (idx !== undefined && idx >= 0) {
          yParentChildren?.delete(idx, 1)
        }
        break
      }

      case 'MOVE_NODE': {
        const { nodeId, newParentId, oldParentId, position } = operation
        // Retirer de l'ancien parent
        const yOldChildren = yChildren.get(oldParentId)
        const oldIdx = yOldChildren?.toArray().indexOf(nodeId)
        if (oldIdx !== undefined && oldIdx >= 0) {
          yOldChildren?.delete(oldIdx, 1)
        }
        // Ajouter au nouveau parent
        const yNewChildren = yChildren.get(newParentId) ?? (() => {
          const arr = new Y.Array<string>()
          yChildren.set(newParentId, arr)
          return arr
        })()
        yNewChildren.insert(position ?? yNewChildren.length, [nodeId])
        // Mettre à jour parentMap
        const yNode = yNodes.get(nodeId)
        yNode?.set('parent', newParentId)
        break
      }
    }
  }, 'local')  // Le tag 'local' permet de distinguer les updates locales
}
```

**Direction 2 — CRDT update distante → Mutation AST**

```typescript
// Observer les changements distants sur le Y.Doc
ydoc.on('update', (update: Uint8Array, origin: unknown) => {
  if (origin === 'local') return  // Ignorer les updates locales déjà appliquées

  // Decoder le delta Yjs pour obtenir les modifications
  const changes = decodeYjsUpdate(update)

  // Convertir en mutations AST
  const mutations: Operation[] = []

  for (const change of changes) {
    switch (change.type) {
      case 'node-added':
        mutations.push({
          op: 'CREATE_NODE',
          node: yMapToNode(yNodes.get(change.nodeId)!)
        })
        break

      case 'node-deleted':
        mutations.push({
          op: 'DELETE_NODE',
          nodeId: change.nodeId
        })
        break

      case 'prop-changed':
        mutations.push({
          op: 'UPDATE_PROP',
          nodeId: change.nodeId,
          path: change.path,
          value: change.newValue
        })
        break

      case 'children-reordered':
        // Réconcilier l'ordre des children avec le NodeMap local
        mutations.push(...reconcileChildrenOrder(change))
        break
    }
  }

  // Appliquer les mutations AST via le package ast
  // en bypassant la génération CRDT (origine: 'remote')
  applyMutations(nodeMap, mutations, { origin: 'remote' })
})
```

### 14.3 Gestion des conflits

#### 14.3.1 Ce que CRDT résout automatiquement

**Insertions concurrentes :** Si User A et User B insèrent un nœud au même endroit simultanément, Yjs utilise un ordre stable (basé sur les horloges vectorielles) pour choisir l'ordre final. Les deux insertions sont préservées.

**Modifications concurrentes de props :** Si User A et User B modifient la même prop en même temps, la valeur avec le timestamp Lamport le plus élevé gagne (LWW au niveau de Yjs).

**Suppression vs modification :** Si User A supprime un nœud pendant que User B le modifie, le comportement dépend de l'ordre de réception. Yjs n'a pas de sémantique native pour ce cas.

#### 14.3.2 Conflits sémantiques nécessitant une couche métier

```typescript
// Ces conflits ne sont pas gérés par le CRDT et nécessitent
// une logique de résolution applicative.

interface ConflictScenario {
  type: 'delete-vs-update' | 'move-vs-delete' | 'type-change' | 'schema-violation'
  detection: string
  strategy: ConflictStrategy
}

const conflictStrategies: ConflictScenario[] = [
  {
    type: 'delete-vs-update',
    detection: 'Un nœud a été supprimé CRDT mais une update prop arrive pour lui',
    strategy: {
      action: 'delete-wins',
      reasoning: 'La suppression est considérée comme une intention forte',
      implementation: 'Ignorer l\'update si le nœud n\'existe plus dans le NodeMap'
    }
  },
  {
    type: 'move-vs-delete',
    detection: 'Un nœud a été déplacé vers un parent qui vient d\'être supprimé',
    strategy: {
      action: 'move-to-safe-parent',
      reasoning: 'Préserver la structure utilisateur',
      implementation: 'Déplacer le nœud vers le root si le parent cible n\'existe plus'
    }
  },
  {
    type: 'schema-violation',
    detection: 'Après merge CRDT, un invariant AST est violé',
    strategy: {
      action: 'auto-repair',
      reasoning: 'La cohérence du document prime sur la préservation d\'une modification spécifique',
      implementation: 'Appliquer les réparations minimales pour restaurer les invariants'
    }
  }
]

// Validation post-merge
async function validateAndRepairAfterCRDTMerge(nodeMap: NodeMap): Promise<NodeMap> {
  const violations = runInvariantChecks(nodeMap)
  if (violations.length === 0) return nodeMap

  let repairedNodeMap = nodeMap
  for (const violation of violations) {
    repairedNodeMap = await repairViolation(repairedNodeMap, violation)
  }

  // Log des réparations pour audit
  logRepairs(violations)

  return repairedNodeMap
}
```

### 14.4 Awareness — Présence utilisateur

```typescript
// L'awareness Yjs permet de partager des informations éphémères
// entre les utilisateurs connectés (non persistées, non-CRDT)

interface UserAwarenessState {
  userId: string
  displayName: string
  avatarUrl: string
  color: string           // Couleur assignée à cet utilisateur dans la session
  cursor?: {
    x: number             // Position dans le canvas
    y: number
  }
  selection?: {
    nodeIds: NodeID[]     // Nœuds sélectionnés
    pageId: string        // Page active
  }
  status: 'active' | 'idle' | 'away'
  lastSeen: number        // Timestamp
}

// Mise à jour de l'awareness local
function updateLocalAwareness(updates: Partial<UserAwarenessState>) {
  awareness.setLocalStateField('user', {
    ...awareness.getLocalState()?.user,
    ...updates,
    lastSeen: Date.now()
  })
}

// Récupération de l'awareness de tous les utilisateurs
function getAllUsersAwareness(): Map<number, UserAwarenessState> {
  const states = new Map<number, UserAwarenessState>()
  for (const [clientId, state] of awareness.getStates()) {
    if (clientId !== awareness.clientID && state.user) {
      states.set(clientId, state.user)
    }
  }
  return states
}

// Événement déclenché à chaque changement d'awareness
awareness.on('change', ({ added, updated, removed }) => {
  // Mettre à jour l'affichage des curseurs distants
  // Mettre à jour la liste des collaborateurs présents
  // Mettre à jour les highlights de sélection distants
})
```

---


> **Note technique :** La section 14 est enrichie par la spécification des règles métier CRDT et du système de validation post-merge qui suit.


## 14. packages/sync — Couche CRDT [VERSION ENRICHIE]

### 14.3 Gestion des conflits — Règles métier concrètes

#### 14.3.1 Principes de résolution par couche

```
┌─────────────────────────────────────────────────────────────────────┐
│              ARCHITECTURE DE RÉSOLUTION DES CONFLITS                │
│                                                                     │
│  Couche 1 — CRDT (Yjs)                                              │
│    Gère automatiquement : ordering, simultanéité, convergence       │
│    Ne gère PAS         : invariants AST, logique métier             │
│                                                                     │
│  Couche 2 — Validation post-merge (packages/ast)                    │
│    Détecte les violations d'invariants après un merge Yjs           │
│    Applique les corrections minimales pour restaurer la cohérence   │
│                                                                     │
│  Couche 3 — Stratégies métier (packages/sync/conflicts)             │
│    Règles spécifiques par type de nœud et type de conflit           │
│    Configurable par type (LWW, merge, soft-lock)                    │
│                                                                     │
│  Couche 4 — UX feedback (packages/builder-ui/collaboration)         │
│    Signale visuellement les résolutions aux utilisateurs            │
│    Propose des actions correctives si nécessaire                    │
└─────────────────────────────────────────────────────────────────────┘
```

#### 14.3.2 Règles de merge par type de donnée

**Texte (props.text, props.label, props.placeholder…)**

```typescript
// Le texte est la donnée la plus fréquemment éditée en parallèle.
// Yjs fournit Y.Text pour le merge caractère par caractère.
// Pour les props texte simples (pas de rich text), on utilise Y.Map avec LWW.

interface TextMergeRule {
  type: 'text-prop'
  strategy: 'lww' | 'ytext'
}

// Règle appliquée pour les props texte simples (ex: Button.label)
// Strategy = LWW (Last-Write-Wins) basé sur l'horloge Lamport de Yjs
// Justification : le texte court (label, titre) est rarement édité en parallèle ;
// le LWW est prévisible et non-destructif (la "perte" est une lettre, max)

// Règle appliquée pour le contenu riche (paragraphes, descriptions longues)
// Strategy = Y.Text (merge caractère par caractère)
// Justification : deux users éditant un long texte méritent un vrai merge

// Implémentation
function resolveTextConflict(
  propKey: string,
  nodeType: NodeType,
  yNode: Y.Map<unknown>
): void {
  const isRichText = RICH_TEXT_PROPS.has(`${nodeType}.${propKey}`)

  if (isRichText) {
    // Y.Text gère automatiquement le merge — rien à faire
    // Le binding AST ↔ Y.Text est établi à la création du nœud
  } else {
    // LWW : Yjs applique automatiquement la dernière valeur reçue
    // basée sur l'horloge logique (clock vector)
    // Pas d'intervention nécessaire — vérifier uniquement les invariants
  }
}

// Props considérées comme "rich text" (merge fin)
const RICH_TEXT_PROPS = new Set([
  'Text.text',
  'Paragraph.content',
  'TextArea.value',
  'Markdown.source',
])
```

**Props structurelles (style, props non-texte)**

```typescript
// Les props numériques (fontSize, width, opacity…) et les props enum
// utilisent systématiquement LWW.
// Justification : deux valeurs numériques concurrentes n'ont pas de
// "merge naturel" (prendre la moyenne serait arbitraire et inattendu).

interface StructuralPropMergeRule {
  type: 'structural-prop'
  strategy: 'lww'
  // Yjs applique LWW automatiquement pour Y.Map.set()
}

// Les objets imbriqués (style complet) sont mergés prop-par-prop
// via le Y.Map imbriqué, ce qui permet :
// User A modifie style.backgroundColor
// User B modifie style.fontSize
// → Résultat : les deux modifications coexistent sans conflit

// Exemple de structure Yjs pour un nœud
// yNodes.get('node_1') → Y.Map {
//   'type'   : 'Button',
//   'props'  : Y.Map { 'label': 'Click' },
//   'style'  : Y.Map {
//                'backgroundColor': '#007bff',  ← User A
//                'fontSize': 16,                 ← User B (indépendant)
//              }
// }
// → Les deux modifications sont indépendantes dans Yjs → pas de conflit
```

**Structure de l'arbre (children, parent)**

```typescript
// La structure de l'arbre (ordre des enfants, relations parent/enfant)
// est le cas le plus délicat du merge CRDT.

// Règle pour les insertions concurrentes
// Yjs/Y.Array utilise un algorithme YATA (Yet Another Transformation Approach)
// qui garantit un ordre stable et déterministe pour les insertions concurrentes.

// Exemple :
// State initial : Container → [A, B, C]
// User A insère D après B → [A, B, D, C]
// User B insère E après B → [A, B, E, C]
// Merge Yjs → [A, B, D, E, C] ou [A, B, E, D, C]
// L'ordre entre D et E est déterministe (basé sur les IDs des clients)
// mais peut ne pas correspondre à l'intention de l'un des deux users

// Post-merge validation : vérifier que l'ordre résultant est valide
// (pas de violations de contraintes d'ordre spécifiques à ECOSYT)

function validateChildrenOrder(parentId: NodeID, children: NodeID[], nodeMap: NodeMap): ValidationResult {
  // Vérifier les contraintes de type (ex: dans un Form, les Field doivent être avant Submit)
  const parent = nodeMap.nodes.get(parentId)!
  const childNodes = children.map(id => nodeMap.nodes.get(id)!)

  // Contrainte : LogicNodes (Conditional, Loop) doivent rester des conteneurs valides
  for (const child of childNodes) {
    if (!isCompatibleChild(child, parent)) {
      return {
        valid: false,
        violation: `Node ${child.id} (${child.type}) cannot be child of ${parent.type}`,
        autofix: () => moveToNearestCompatibleParent(child.id, nodeMap)
      }
    }
  }

  return { valid: true }
}
```

#### 14.3.3 Gestion des conflits structurels complexes

**Conflit 1 — Éditions concurrentes de la même prop**

```typescript
// Scénario : User A et User B modifient props.label d'un même Button

// Comportement Yjs natif : LWW automatique basé sur horloge Lamport
// → La valeur de l'utilisateur avec l'horloge la plus haute gagne
// → L'autre modification est silencieusement écrasée

// ECOSYT enrichit ce comportement avec un feedback UX :
// L'utilisateur "perdant" voit une notification discrète

function onPropConflictResolved(
  nodeId: NodeID,
  propPath: string,
  myValue: unknown,
  winningValue: unknown,
  winnerId: string,
  awareness: AwarenessManager
): void {
  if (Object.is(myValue, winningValue)) return  // Pas vraiment un conflit

  // Notifier l'utilisateur local que sa modification a été écrasée
  const winnerName = awareness.getUserName(winnerId)
  conflictNotifier.show({
    type: 'prop-overwritten',
    message: `Your change to "${propPath}" was replaced by ${winnerName}'s version`,
    nodeId,
    actions: [
      { label: 'Keep mine', action: () => forceRestoreValue(nodeId, propPath, myValue) },
      { label: 'Keep theirs', action: () => { /* no-op, Yjs a déjà appliqué */ } }
    ],
    ttl: 8000
  })
}
```

**Conflit 2 — Suppression concurrent avec modification**

```typescript
// Scénario : User A supprime un nœud pendant que User B le modifie

// Comportement CRDT pur (Yjs) :
// - Si User A supprime et User B modifie simultanément
// - Selon l'ordre de réception, le nœud peut être absent OU modifié
// - Yjs ne garantit pas de sémantique "delete-wins"

// Règle ECOSYT : delete-wins (la suppression prend la priorité)
// Justification : une suppression est une intention forte et explicite

class CRDTConflictResolver {
  handleDeleteVsUpdate(
    nodeId: NodeID,
    operation: 'delete' | 'update',
    remoteOperation: 'delete' | 'update',
    currentNodeMap: NodeMap
  ): ConflictResolution {
    const nodeExists = currentNodeMap.nodes.has(nodeId)

    if (!nodeExists && operation === 'update') {
      // Le nœud a été supprimé à distance, on voulait le modifier
      // → Ignorer silencieusement la modification locale
      return {
        action: 'discard-local',
        reason: 'delete-wins',
        userFeedback: {
          message: 'The element you were editing was deleted by another user',
          severity: 'info'
        }
      }
    }

    if (nodeExists && remoteOperation === 'update') {
      // On a supprimé, l'autre a modifié → notre suppression prime
      // → Appliquer notre suppression, ignorer l'update distante
      return {
        action: 'apply-local-delete',
        reason: 'delete-wins',
        userFeedback: null  // Pas besoin de notifier l'auteur de la suppression
      }
    }

    return { action: 'no-conflict' }
  }
}
```

**Conflit 3 — Move concurrent vers deux parents différents**

```typescript
// Scénario : User A déplace le nœud N vers Parent P1
//            User B déplace le nœud N vers Parent P2 (simultanément)

// Problème : après merge Yjs, N peut apparaître dans DEUX childrenMaps simultanément
// (Yjs ajoute à P1 ET P2), ce qui viole l'invariant "un nœud a au plus un parent"

function resolveConcurrentMove(
  nodeId: NodeID,
  yDoc: Y.Doc,
  nodeMap: NodeMap
): void {
  const yChildren = yDoc.getMap<Y.Array<string>>('childrenMap')

  // Collecter tous les parents qui pensent contenir nodeId
  const conflictingParents: NodeID[] = []
  for (const [parentId, children] of yChildren) {
    if (children.toArray().includes(nodeId)) {
      conflictingParents.push(parentId)
    }
  }

  if (conflictingParents.length <= 1) return  // Pas de conflit

  // Stratégie : garder le parent avec le timestamp le plus récent dans l'event log
  // (le move qui a eu lieu "en dernier" dans l'ordre causal gagne)
  const winnerParentId = resolveByLatestCausalTimestamp(nodeId, conflictingParents)

  // Retirer nodeId de tous les autres parents
  yDoc.transact(() => {
    for (const parentId of conflictingParents) {
      if (parentId === winnerParentId) continue
      const arr = yChildren.get(parentId)!
      const idx = arr.toArray().indexOf(nodeId)
      if (idx >= 0) arr.delete(idx, 1)
    }
  }, 'conflict-resolution')

  // Mettre à jour le parentMap AST
  applyMutation(nodeMap, {
    op: 'UPDATE_PROP',
    nodeId,
    path: 'parent',
    value: winnerParentId
  }, { origin: 'conflict-resolution' })
}
```

**Conflit 4 — Double suppression du même nœud**

```typescript
// Scénario : User A et User B suppriment le même nœud simultanément

// Comportement : Yjs est idempotent sur les suppressions de Y.Map entries
// → Supprimer deux fois = supprimer une fois → pas de problème

// MAIS : les deux users ont chacun créé une entrée dans l'event log
// → L'event log contient deux entrées de suppression du même nœud
// → À traiter lors du replay d'historique

function deduplicateEventLog(events: ASTEvent[]): ASTEvent[] {
  const seen = new Map<string, ASTEvent>()  // key = `${op}:${nodeId}`

  return events.filter(event => {
    if (event.op !== 'DELETE_NODE') return true  // Garder tous les non-delete
    const key = `DELETE:${event.nodeId}`
    if (seen.has(key)) return false  // Doublon → filtrer
    seen.set(key, event)
    return true
  })
}
```

#### 14.3.4 Validation post-merge — Algorithme complet

```typescript
// Exécutée après chaque application d'un update CRDT distant
// Garantit que les invariants AST sont toujours satisfaits après le merge

interface MergeValidationResult {
  valid: boolean
  violations: InvariantViolation[]
  repairs: AutoRepair[]
}

interface AutoRepair {
  description: string
  apply: (nodeMap: NodeMap, yDoc: Y.Doc) => void
  severity: 'silent' | 'notify-user' | 'block'
}

async function validateAndRepairAfterMerge(
  nodeMap: NodeMap,
  yDoc: Y.Doc
): Promise<MergeValidationResult> {
  const violations: InvariantViolation[] = []
  const repairs: AutoRepair[] = []

  // ─── Check 1 : Unicité des parents ────────────────────────────────────
  const parentCount = new Map<NodeID, number>()
  const yChildren = yDoc.getMap<Y.Array<string>>('childrenMap')

  for (const [, children] of yChildren) {
    for (const childId of children.toArray()) {
      parentCount.set(childId, (parentCount.get(childId) ?? 0) + 1)
    }
  }

  for (const [nodeId, count] of parentCount) {
    if (count > 1) {
      violations.push({ type: 'multiple-parents', nodeId })
      repairs.push({
        description: `Remove node ${nodeId} from all but one parent (latest move wins)`,
        severity: 'silent',
        apply: (nm, yd) => resolveConcurrentMove(nodeId, yd, nm)
      })
    }
  }

  // ─── Check 2 : Références cassées ─────────────────────────────────────
  for (const [nodeId, node] of nodeMap.nodes) {
    // Vérifier que le parent déclaré existe
    if (node.parent && !nodeMap.nodes.has(node.parent)) {
      violations.push({ type: 'dangling-parent-ref', nodeId, ref: node.parent })
      repairs.push({
        description: `Move orphaned node ${nodeId} to root`,
        severity: 'notify-user',
        apply: (nm) => {
          applyMutation(nm, { op: 'MOVE_NODE', nodeId, newParentId: nm.rootId })
        }
      })
    }

    // Vérifier que les bindings pointent vers des nœuds existants
    for (const [propKey, binding] of Object.entries(node.bindings ?? {})) {
      if (binding.type === 'state' && binding.stateNodeId) {
        if (!nodeMap.nodes.has(binding.stateNodeId)) {
          violations.push({ type: 'dangling-binding', nodeId, propKey })
          repairs.push({
            description: `Remove dangling binding ${propKey} on node ${nodeId}`,
            severity: 'silent',
            apply: (nm) => {
              applyMutation(nm, {
                op: 'UPDATE_BINDING',
                nodeId,
                propKey,
                binding: null  // Supprimer le binding
              })
            }
          })
        }
      }
    }
  }

  // ─── Check 3 : Cycles dans la hiérarchie UI ───────────────────────────
  const cycleNodes = detectHierarchyCycles(nodeMap)
  for (const cycleNodeId of cycleNodes) {
    violations.push({ type: 'hierarchy-cycle', nodeId: cycleNodeId })
    repairs.push({
      description: `Break cycle at node ${cycleNodeId} by moving to root`,
      severity: 'notify-user',
      apply: (nm) => {
        applyMutation(nm, { op: 'MOVE_NODE', nodeId: cycleNodeId, newParentId: nm.rootId })
      }
    })
  }

  // ─── Check 4 : Contraintes de cardinalité ─────────────────────────────
  // ex: LoopNode doit avoir exactement 1 enfant template
  for (const [nodeId, node] of nodeMap.nodes) {
    const constraint = NODE_CARDINALITY_CONSTRAINTS[node.type]
    if (!constraint) continue

    const childCount = (nodeMap.childrenMap.get(nodeId) ?? []).length

    if (childCount < constraint.min) {
      violations.push({ type: 'cardinality-min', nodeId, expected: constraint.min, actual: childCount })
      repairs.push({
        description: `Add placeholder child to ${nodeId}`,
        severity: 'notify-user',
        apply: (nm) => {
          applyMutation(nm, {
            op: 'CREATE_NODE',
            node: createPlaceholderNode(node.type),
            parentId: nodeId
          })
        }
      })
    }

    if (childCount > constraint.max) {
      violations.push({ type: 'cardinality-max', nodeId, expected: constraint.max, actual: childCount })
      repairs.push({
        description: `Remove excess children from ${nodeId} (keep first ${constraint.max})`,
        severity: 'notify-user',
        apply: (nm) => {
          const children = nodeMap.childrenMap.get(nodeId) ?? []
          for (const excessChildId of children.slice(constraint.max)) {
            applyMutation(nm, { op: 'MOVE_NODE', nodeId: excessChildId, newParentId: nm.rootId })
          }
        }
      })
    }
  }

  // ─── Application des réparations ──────────────────────────────────────
  for (const repair of repairs) {
    repair.apply(nodeMap, yDoc)
    if (repair.severity === 'notify-user') {
      conflictNotifier.show({
        type: 'auto-repair',
        message: repair.description,
        severity: 'warning'
      })
    }
  }

  return { valid: violations.length === 0, violations, repairs }
}

// Contraintes de cardinalité par type de nœud
const NODE_CARDINALITY_CONSTRAINTS: Record<string, { min: number; max: number }> = {
  'Conditional': { min: 1, max: 2 },   // 1 branche true, 1 branche false optionnelle
  'Loop':        { min: 1, max: 1 },   // 1 template item
  'ComponentDefinition': { min: 1, max: 1 }  // 1 root template
}
```

---

### 14.4 Intégration CRDT ↔ AST — Garantie des invariants

#### 14.4.1 Pipeline d'application d'un update distant

```typescript
// Flux complet depuis réception WebSocket jusqu'au rendu

class SyncManager {
  async applyRemoteUpdate(
    update: Uint8Array,          // Delta Yjs binaire
    origin: string               // ID du client émetteur
  ): Promise<void> {
    // ─── Étape 1 : Appliquer le delta CRDT au Y.Doc local ─────────────
    // Yjs merge automatiquement (CRDT convergence)
    // L'état résultant est convergent mais peut violer des invariants AST
    Y.applyUpdate(this._ydoc, update)

    // ─── Étape 2 : Extraire les changements détectés ───────────────────
    const changes = this._diffYDocVsNodeMap(this._ydoc, this._nodeMap)

    if (changes.length === 0) return  // No-op (update déjà appliqué)

    // ─── Étape 3 : Traduire en mutations AST ──────────────────────────
    const mutations = this._translateChangesToMutations(changes)

    // ─── Étape 4 : Appliquer les mutations AST (avec validation) ───────
    for (const mutation of mutations) {
      const result = applyMutation(this._nodeMap, mutation, { origin: 'remote' })
      if (!result.success) {
        // Mutation invalide selon les règles AST → log + skip
        console.warn(`Remote mutation rejected: ${result.error}`, mutation)
        continue
      }
    }

    // ─── Étape 5 : Validation post-merge ──────────────────────────────
    const validation = await validateAndRepairAfterMerge(this._nodeMap, this._ydoc)
    if (!validation.valid) {
      console.warn(`Post-merge violations detected and repaired:`, validation.violations)
    }

    // ─── Étape 6 : Notifier le compilateur incrémental ────────────────
    for (const mutation of mutations) {
      this._compiler.invalidate(mutation)
    }

    // ─── Étape 7 : Mettre à jour l'awareness ──────────────────────────
    this._awareness.emit('remote-change', { origin, mutations })
  }

  private _diffYDocVsNodeMap(ydoc: Y.Doc, nodeMap: NodeMap): YjsChange[] {
    const changes: YjsChange[] = []
    const yNodes = ydoc.getMap<Y.Map<unknown>>('nodes')

    // Nœuds ajoutés dans Yjs mais absents du NodeMap
    for (const [nodeId] of yNodes) {
      if (!nodeMap.nodes.has(nodeId)) {
        changes.push({ type: 'node-added', nodeId })
      }
    }

    // Nœuds présents dans le NodeMap mais supprimés de Yjs
    for (const [nodeId] of nodeMap.nodes) {
      if (!yNodes.has(nodeId)) {
        changes.push({ type: 'node-deleted', nodeId })
      }
    }

    // Nœuds existant dans les deux : comparer les props
    for (const [nodeId, yNode] of yNodes) {
      const astNode = nodeMap.nodes.get(nodeId)
      if (!astNode) continue

      // Comparer props
      const yProps = (yNode.get('props') as Y.Map<unknown>)?.toJSON()
      const astProps = astNode.props
      for (const [key, yVal] of Object.entries(yProps ?? {})) {
        if (!Object.is(yVal, astProps[key])) {
          changes.push({ type: 'prop-changed', nodeId, path: `props.${key}`, newValue: yVal })
        }
      }

      // Comparer children order
      const yChildren = (yNode.get('children') as Y.Array<string>)?.toArray() ?? []
      const astChildren = nodeMap.childrenMap.get(nodeId) ?? []
      if (JSON.stringify(yChildren) !== JSON.stringify(astChildren)) {
        changes.push({ type: 'children-reordered', nodeId, newChildren: yChildren })
      }
    }

    return changes
  }
}
```

---

### 14.5 Awareness — Gestion complète de la présence

#### 14.5.1 Soft locks — Signalement d'édition active

```typescript
// Un soft lock signale qu'un utilisateur est en train d'éditer un nœud.
// Il n'est PAS bloquant — un autre utilisateur PEUT modifier le même nœud.
// Son rôle est purement informatif pour réduire les conflits accidentels.

interface SoftLock {
  nodeId: NodeID
  userId: string
  userName: string
  userColor: string
  startedAt: number    // Timestamp
  prop?: string        // Si null → édition de tout le nœud
}

class SoftLockManager {
  private _activeLocks = new Map<NodeID, SoftLock[]>()
  private _lockTimeout = 3000   // 3s sans activité → release automatique

  // Acquérir un soft lock (déclaratif, non-bloquant)
  acquire(nodeId: NodeID, userId: string, prop?: string): void {
    const locks = this._activeLocks.get(nodeId) ?? []
    const existing = locks.find(l => l.userId === userId)

    if (existing) {
      // Rafraîchir le timestamp (l'utilisateur est toujours actif)
      existing.startedAt = Date.now()
      existing.prop = prop
    } else {
      locks.push({
        nodeId, userId, prop,
        userName: this._awareness.getUserName(userId),
        userColor: this._awareness.getUserColor(userId),
        startedAt: Date.now()
      })
    }

    this._activeLocks.set(nodeId, locks)

    // Broadcaster via awareness
    this._awareness.setLocalStateField('locks', {
      [nodeId]: { prop, ts: Date.now() }
    })
  }

  // Relâcher un soft lock
  release(nodeId: NodeID, userId: string): void {
    const locks = this._activeLocks.get(nodeId) ?? []
    const filtered = locks.filter(l => l.userId !== userId)
    if (filtered.length === 0) {
      this._activeLocks.delete(nodeId)
    } else {
      this._activeLocks.set(nodeId, filtered)
    }

    // Mettre à jour l'awareness
    const currentLocks = this._awareness.getLocalState()?.locks ?? {}
    delete currentLocks[nodeId]
    this._awareness.setLocalStateField('locks', currentLocks)
  }

  // Obtenir les locks actifs sur un nœud (pour affichage UI)
  getLocksForNode(nodeId: NodeID): SoftLock[] {
    this._pruneExpiredLocks()
    return this._activeLocks.get(nodeId) ?? []
  }

  // Nettoyer les locks expirés (pas d'activité depuis > lockTimeout)
  private _pruneExpiredLocks(): void {
    const now = Date.now()
    for (const [nodeId, locks] of this._activeLocks) {
      const active = locks.filter(l => now - l.startedAt < this._lockTimeout)
      if (active.length === 0) {
        this._activeLocks.delete(nodeId)
      } else {
        this._activeLocks.set(nodeId, active)
      }
    }
  }
}
```

#### 14.5.2 Feedback UX des conflits — Spécification complète

```typescript
// Système de notification contextuelle pour les événements collaboratifs

type CollaborativeEventType =
  | 'prop-overwritten'          // Ma modification a été écrasée par LWW
  | 'node-deleted-while-editing' // Le nœud que j'éditais a été supprimé
  | 'move-conflict-resolved'    // Un déplacement concurrent a été résolu
  | 'auto-repair'               // Une violation d'invariant a été auto-corrigée
  | 'remote-bulk-change'        // Un autre user a fait > 10 changements d'un coup (IA)

interface ConflictNotification {
  id: string
  type: CollaborativeEventType
  message: string
  nodeId?: NodeID
  severity: 'info' | 'warning' | 'error'
  actions?: Array<{ label: string; action: () => void }>
  ttl: number    // Durée d'affichage en ms (0 = persistant)
}

class ConflictNotifier {
  private _queue: ConflictNotification[] = []
  private _listeners = new Set<(n: ConflictNotification) => void>()

  show(notification: Omit<ConflictNotification, 'id'>): void {
    const n = { ...notification, id: generateId() }
    this._queue.push(n)
    for (const listener of this._listeners) listener(n)

    if (n.ttl > 0) {
      setTimeout(() => this.dismiss(n.id), n.ttl)
    }
  }

  dismiss(id: string): void {
    this._queue = this._queue.filter(n => n.id !== id)
  }

  subscribe(fn: (n: ConflictNotification) => void): () => void {
    this._listeners.add(fn)
    return () => this._listeners.delete(fn)
  }
}

// Rendu UX dans le builder
// Les notifications apparaissent en bas à gauche du canvas
// avec un code couleur : bleu (info), orange (warning), rouge (error)
// Elles ne bloquent jamais l'édition
// Elles proposent des actions optionnelles (undo, restore)
```

#### 14.5.3 Curseurs et sélections distants

```typescript
// Synchronisation des curseurs (position canvas) et sélections (nœuds sélectionnés)
// via l'awareness Yjs — éphémère, non persisté

interface RemoteCursorState {
  userId: string
  displayName: string
  color: string       // couleur assignée à la session (stable pendant la session)
  canvas: {
    x: number
    y: number
    pageId: string
  } | null
  selection: {
    nodeIds: NodeID[]
    pageId: string
  } | null
  isIdle: boolean    // true si pas d'activité depuis > 10s
}

// Attribution des couleurs : round-robin sur une palette prédéfinie
// Stable pendant la session (même couleur si reconnexion)
const USER_COLORS = [
  '#E91E63', '#9C27B0', '#2196F3', '#00BCD4',
  '#4CAF50', '#FF5722', '#795548', '#607D8B'
]

function assignUserColor(userId: string, connectedUsers: string[]): string {
  const sortedUsers = [...connectedUsers].sort()  // Ordre déterministe
  const idx = sortedUsers.indexOf(userId) % USER_COLORS.length
  return USER_COLORS[idx]
}

// Mise à jour de l'awareness local à chaque mouvement de souris
// Throttlée à 50ms pour éviter de saturer le réseau (20 updates/s max)
const updateCursorThrottled = throttle((x: number, y: number, pageId: string) => {
  awareness.setLocalStateField('cursor', { x, y, pageId, ts: Date.now() })
}, 50)

// Rendu des curseurs distants dans le canvas
function RemoteCursorOverlay({ users }: { users: Map<string, RemoteCursorState> }) {
  return (
    <>
      {[...users.values()].map(user => {
        if (!user.canvas || user.isIdle) return null
        return (
          <div
            key={user.userId}
            className="remote-cursor"
            style={{
              position: 'absolute',
              left: user.canvas.x,
              top: user.canvas.y,
              color: user.color,
              pointerEvents: 'none',   // Ne pas interférer avec les clics locaux
              zIndex: 1000
            }}
          >
            <CursorIcon color={user.color} />
            <span className="cursor-label" style={{ backgroundColor: user.color }}>
              {user.displayName}
            </span>
          </div>
        )
      })}
    </>
  )
}
```


## 15. packages/builder-ui — Interface du builder

### 15.1 Rôle et responsabilités

Le package builder-ui est l'interface React de l'éditeur visuel. Sa responsabilité est uniquement d'afficher l'état du système (AST + runtime) et de capturer les intentions de l'utilisateur pour les déléguer aux mutations AST.

**Principe de pureté UI :** Aucune logique métier dans ce package. Toute validation, toute transformation de données, toute décision liée à la structure du projet se fait dans `packages/ast`.

### 15.2 Architecture des composants

#### 15.2.1 Canvas

Le canvas est le composant central du builder. Il affiche les nœuds de la page courante dans un environnement d'édition interactif.

**Rendu des nœuds :** Les nœuds sont rendus par le runtime ECOSYT (pas par React directement). Le canvas React enveloppe le container DOM où le runtime attache ses sorties, et overlay les éléments de sélection, guides, et handles de resize.

```typescript
// Architecture du Canvas
function BuilderCanvas({ pageId }: { pageId: string }) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { nodeMap } = useAST()
  const { selectedIds, setSelection } = useSelection()
  const { syncedUsers } = useCollaboration()

  // Le runtime attache son rendu à canvasRef.current
  useEffect(() => {
    const runtime = getRuntimeInstance()
    runtime.attachTo(canvasRef.current!, pageId)
    return () => runtime.detach()
  }, [pageId])

  return (
    <div className="canvas-wrapper">
      {/* Zone de rendu du runtime (géré par @ecosyt/runtime) */}
      <div ref={canvasRef} className="canvas-content" />

      {/* Overlay de sélection (géré par React) */}
      <CanvasOverlay
        nodeMap={nodeMap}
        selectedIds={selectedIds}
        onNodeClick={handleNodeClick}
        onNodeDrag={handleNodeDrag}
        onNodeResize={handleNodeResize}
      />

      {/* Curseurs des utilisateurs distants */}
      {[...syncedUsers.values()].map(user => (
        <RemoteCursor key={user.userId} user={user} />
      ))}
    </div>
  )
}
```

#### 15.2.2 Inspector

```typescript
// L'Inspector affiche et permet de modifier les propriétés
// du nœud sélectionné.

function Inspector() {
  const { selectedIds } = useSelection()
  const { nodeMap } = useAST()
  const { updateProp, updateStyle, updateBinding } = useASTAdapter()

  const selectedNode = selectedIds.length === 1
    ? nodeMap.nodes.get(selectedIds[0])
    : null

  if (!selectedNode) return <EmptyInspector />
  if (selectedIds.length > 1) return <MultiSelectionInspector ids={selectedIds} />

  return (
    <div className="inspector">
      <InspectorHeader node={selectedNode} />
      <Tabs>
        <Tab label="Properties">
          <PropsPanel
            node={selectedNode}
            onChange={(path, value) => updateProp(selectedNode.id, path, value)}
          />
        </Tab>
        <Tab label="Style">
          <StylePanel
            node={selectedNode}
            onChange={(path, value) => updateStyle(selectedNode.id, path, value)}
          />
        </Tab>
        <Tab label="Bindings">
          <BindingsPanel
            node={selectedNode}
            onChange={(propKey, binding) => updateBinding(selectedNode.id, propKey, binding)}
          />
        </Tab>
        {selectedNode.category !== 'Data' && (
          <Tab label="Events">
            <EventsPanel node={selectedNode} />
          </Tab>
        )}
      </Tabs>
    </div>
  )
}
```

### 15.3 Gestion du state UI

```typescript
// Le state UI (sélection, mode d'édition, panneaux ouverts)
// est géré par Zustand, séparément de l'AST.
// Ce state est purement UI et n'est jamais persisté.

interface BuilderStore {
  // Sélection
  selectedNodeIds: NodeID[]
  hoveredNodeId: NodeID | null
  selectNode: (id: NodeID, multi?: boolean) => void
  clearSelection: () => void

  // Mode
  editingMode: 'select' | 'insert' | 'text-edit' | 'drag'
  setMode: (mode: BuilderStore['editingMode']) => void

  // Canvas
  canvasScale: number
  canvasOffset: { x: number; y: number }
  setCanvasTransform: (scale: number, offset: { x: number; y: number }) => void

  // Panneaux
  inspectorOpen: boolean
  layersOpen: boolean
  toggleInspector: () => void
  toggleLayers: () => void

  // Page active
  activePageId: string | null
  setActivePage: (pageId: string) => void

  // Historique
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
}
```

### 15.4 Hooks personnalisés

```typescript
// use-ast.ts : Interface vers le NodeMap et les selectors AST
function useAST() {
  const { nodeMap, dispatch } = useASTContext()
  return {
    nodeMap,
    getNode: (id: NodeID) => getNode(nodeMap, id),
    getChildren: (id: NodeID) => getChildren(nodeMap, id),
    getAncestors: (id: NodeID) => getAncestors(nodeMap, id),
    findNodes: (predicate: (node: Node) => boolean) => findNodes(nodeMap, predicate)
  }
}

// use-ast-adapter.ts : Interface vers les mutations AST
function useASTAdapter() {
  const dispatch = useASTDispatch()

  return {
    createNode: (params: CreateNodeParams) =>
      dispatch({ type: 'CREATE_NODE', payload: params }),

    updateProp: (nodeId: NodeID, path: string, value: unknown) =>
      dispatch({ type: 'UPDATE_PROP', payload: { nodeId, path, value } }),

    updateStyle: (nodeId: NodeID, path: string, value: unknown) =>
      dispatch({ type: 'UPDATE_PROP', payload: { nodeId, path: `style.${path}`, value } }),

    deleteNode: (nodeId: NodeID) =>
      dispatch({ type: 'DELETE_NODE', payload: { nodeId } }),

    moveNode: (nodeId: NodeID, newParentId: NodeID, position?: number) =>
      dispatch({ type: 'MOVE_NODE', payload: { nodeId, newParentId, position } }),

    updateBinding: (nodeId: NodeID, propKey: string, binding: Binding) =>
      dispatch({ type: 'UPDATE_BINDING', payload: { nodeId, propKey, binding } })
  }
}

// use-collaboration.ts : Interface vers l'awareness CRDT
function useCollaboration() {
  const [syncedUsers, setSyncedUsers] = useState<Map<number, UserAwarenessState>>(new Map())
  const { awarenessManager } = useSyncContext()

  useEffect(() => {
    const handleAwarenessChange = () => {
      setSyncedUsers(getAllUsersAwareness())
    }
    awarenessManager.on('change', handleAwarenessChange)
    return () => awarenessManager.off('change', handleAwarenessChange)
  }, [awarenessManager])

  const updateLocalPresence = useCallback((updates: Partial<UserAwarenessState>) => {
    awarenessManager.updateLocal(updates)
  }, [awarenessManager])

  return { syncedUsers, updateLocalPresence }
}
```

---

## 16. packages/shared — Contrats communs

### 16.1 Rôle et responsabilités

Le package shared contient tous les types, constantes et utilitaires partagés entre les packages et applications ECOSYT. Son existence évite la duplication de code et garantit la cohérence des interfaces à travers tout le système.

**Règle d'or du shared :** Si un type ou une constante est utilisé par plus d'un package, il va dans shared. Si c'est utilisé par un seul package, il reste dans ce package.

### 16.2 Types partagés

```typescript
// Types de base (primitives ECOSYT)
type NodeID = string          // UUID v4
type PageID = string
type ProjectID = string
type OrganizationID = string
type UserID = string
type SchemaVersion = string   // SemVer ex: "1.2.0"

// Types de données JSON safe
type JSONPrimitive = string | number | boolean | null
type JSONValue = JSONPrimitive | JSONObject | JSONArray
type JSONObject = { [key: string]: JSONValue }
type JSONArray = JSONValue[]

// Types de nœuds (catalogue)
type NodeType =
  // UI
  | 'Text' | 'Image' | 'Button' | 'Icon' | 'Video' | 'Divider'
  // Layout
  | 'Container' | 'Grid' | 'Flex' | 'Stack' | 'Spacer'
  // Forms
  | 'Form' | 'Input' | 'Select' | 'Checkbox' | 'Radio' | 'Textarea'
  // Logic
  | 'Conditional' | 'Loop' | 'Switch'
  // Data
  | 'State' | 'APISource' | 'ComputedValue' | 'LocalStorage'
  // Meta
  | 'ComponentDefinition' | 'ComponentInstance' | 'Template' | 'Symbol'
  // Navigation
  | 'Link' | 'Router'

type NodeCategory = 'UI' | 'Layout' | 'Form' | 'Logic' | 'Data' | 'Meta' | 'Navigation'

// Types de rôles et permissions
type OrganizationRole = 'owner' | 'admin' | 'editor' | 'viewer'

interface Permission {
  resource: 'project' | 'page' | 'node' | 'organization' | 'billing'
  action: 'create' | 'read' | 'update' | 'delete' | 'share' | 'export'
}

// DTOs API (partagés entre frontend et backend)
interface CreateProjectDTO {
  name: string
  description?: string
  template?: string  // ID de template ou null pour projet vide
}

interface ProjectResponseDTO {
  id: ProjectID
  organizationId: OrganizationID
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  createdBy: UserID
  collaboratorCount: number
  thumbnail?: string
}
```

---

## 17. packages/tools — Outillage développement

### 17.1 AST Viewer

Visualiseur interactif de l'AST en temps réel pendant le développement. Affiche le NodeMap, les relations, et les bindings. Disponible en tant que panneau dans le builder en mode développement.

```typescript
// Interface du AST Viewer
interface ASTViewerProps {
  nodeMap: NodeMap
  selectedNodeId?: NodeID
  onSelectNode?: (id: NodeID) => void
}

// Fonctionnalités :
// - Arbre interactif avec collapse/expand
// - Affichage des props, styles, bindings pour chaque nœud
// - Mise en évidence du nœud sélectionné dans le builder
// - Diff en temps réel (nœuds modifiés depuis la dernière action)
// - Export JSON du document courant
// - Recherche par ID ou par type
```

### 17.2 Performance Benchmarks

```typescript
// Benchmarks automatisés pour les composants critiques

const benchmarks = {
  // AST mutations
  'create-1000-nodes': async () => {
    const nodeMap = createEmptyDocument()
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      createNode(nodeMap, { type: 'Text', props: { text: `Node ${i}` }, parentId: nodeMap.rootId })
    }
    return performance.now() - start
  },

  // Compilation
  'compile-100-nodes': async () => {
    const ast = loadFixture('100-nodes-page')
    const start = performance.now()
    compile(ast, { mode: 'full' })
    return performance.now() - start
  },

  // Runtime réactivité
  'signal-propagation-depth-20': async () => {
    // Chaîne de 20 computed dépendants
    const s = signal(0)
    let prev = computed(() => s())
    for (let i = 0; i < 19; i++) {
      const p = prev
      prev = computed(() => p() + 1)
    }
    const start = performance.now()
    for (let i = 0; i < 10000; i++) {
      s.set(i)
      flush()
    }
    return performance.now() - start
  }
}

// Seuils de performance (CI/CD échoue si dépassés)
const performanceThresholds = {
  'create-1000-nodes': 100,     // < 100ms
  'compile-100-nodes': 50,      // < 50ms
  'signal-propagation-depth-20': 16  // < 16ms par flush
}

// Rapport de benchmark généré automatiquement à chaque CI run
interface BenchmarkReport {
  runAt: string
  commit: string
  results: Array<{
    name: string
    durationMs: number
    threshold: number
    passed: boolean
    delta?: number   // Comparaison au run précédent (+ = régression)
  }>
}

// Intégration CI (GitHub Actions)
// jobs:
//   benchmarks:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v3
//       - run: pnpm install
//       - run: pnpm bench
//       - uses: benchmark-action/github-action-benchmark@v1
//         with:
//           tool: 'customSmallerIsBetter'
//           output-file-path: bench-output.json
//           alert-threshold: '130%'   # Alerte si +30% de régression
//           fail-on-alert: true
```

---

# PARTIE IV — SPÉCIFICATION DES APPLICATIONS (apps/)

---

## 18. apps/web — Frontend application

### 18.1 Rôle et responsabilités

`apps/web` est l'application React finale que l'utilisateur charge dans son navigateur. Elle assemble les packages `builder-ui`, `runtime`, `compiler`, et `sync` en une expérience produit cohérente. Elle gère la navigation, l'authentification côté client, et la connexion aux services backend.

**Ce que apps/web fait :**
- Fournir le routing applicatif (dashboard, builder, settings, auth)
- Initialiser et orchestrer les providers (auth, projet, sync)
- Gérer l'état global applicatif (session utilisateur, projet courant)
- Assurer la connexion au sync-server WebSocket

**Ce que apps/web ne fait PAS :**
- Implémenter de logique métier (tout est dans les packages)
- Accéder directement à la base de données
- Contenir de la logique de compilation ou de rendu AST

### 18.2 Architecture des routes

```typescript
// Structure de routing (React Router v6 ou Next.js App Router)

const routes = [
  // Authentification (public)
  { path: '/login',    component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/reset',    component: ResetPasswordPage },

  // Application (authentifié)
  {
    path: '/',
    component: AppLayout,        // Vérifie auth, charge session
    children: [
      // Dashboard
      { index: true,             component: DashboardPage },     // /
      { path: 'projects',        component: ProjectsListPage },  // /projects
      { path: 'projects/new',    component: NewProjectPage },    // /projects/new

      // Builder
      {
        path: 'builder/:projectId',
        component: BuilderLayout,               // Charge projet, initialise sync
        children: [
          { index: true,         component: BuilderPage },       // Page par défaut
          { path: 'page/:pageId', component: BuilderPage },      // Page spécifique
          { path: 'preview',     component: PreviewPage },       // Mode preview
        ]
      },

      // Settings
      { path: 'settings',        component: SettingsPage },
      { path: 'settings/org',    component: OrgSettingsPage },
      { path: 'settings/billing',component: BillingPage },
    ]
  },

  // Erreurs
  { path: '*', component: NotFoundPage }
]
```

### 18.3 Providers et initialisation

```typescript
// Arbre des Providers dans l'application
function App() {
  return (
    <AuthProvider>           {/* JWT, session utilisateur */}
      <QueryClientProvider>  {/* React Query pour les requêtes API */}
        <ThemeProvider>      {/* Design system tokens */}
          <ToastProvider>    {/* Notifications UI */}
            <RouterProvider router={router} />
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

// Provider spécifique au builder (chargé uniquement dans /builder/:id)
function BuilderLayout({ children }: { children: ReactNode }) {
  const { projectId } = useParams()

  // 1. Charge le document AST depuis l'API
  const { data: document, isLoading } = useQuery({
    queryKey: ['document', projectId],
    queryFn: () => api.getDocument(projectId!)
  })

  // 2. Initialise le NodeMap AST local
  const nodeMap = useMemo(() =>
    document ? deserializeNodeMap(document.snapshot) : null,
    [document]
  )

  // 3. Initialise la connexion CRDT
  const syncClient = useSyncClient({
    documentId: projectId!,
    nodeMap,
    onReady: () => console.log('CRDT sync ready')
  })

  // 4. Initialise le compilateur incrémental
  const compiler = useCompiler({ nodeMap })

  // 5. Initialise le runtime
  const runtime = useRuntime({ compiler })

  if (isLoading || !nodeMap) return <BuilderSkeleton />

  return (
    <ASTProvider value={{ nodeMap, dispatch: syncClient.dispatch }}>
      <SyncProvider value={syncClient}>
        <CompilerProvider value={compiler}>
          <RuntimeProvider value={runtime}>
            {children}
          </RuntimeProvider>
        </CompilerProvider>
      </SyncProvider>
    </ASTProvider>
  )
}
```

### 18.4 Gestion de l'authentification

```typescript
// AuthProvider gère la session JWT et le refresh automatique

interface AuthContext {
  user: UserProfile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

// Stratégie de refresh token :
// - Access token : durée 15 minutes
// - Refresh token : durée 30 jours (httpOnly cookie)
// - Refresh automatique : 2 minutes avant expiration du access token
// - Si refresh échoue (token expiré/révoqué) : redirection /login

// Stockage :
// - Access token : mémoire JavaScript (jamais localStorage — vulnérable XSS)
// - Refresh token : cookie httpOnly sécurisé (non accessible JS)
```

---

## 19. apps/api — Backend NestJS

### 19.1 Rôle et responsabilités

`apps/api` est le backend applicatif gérant la persistance, l'authentification, les permissions, et les intégrations IA. Il est le seul point d'accès aux données persistantes du système.

**Ce que apps/api fait :**
- Authentifier les utilisateurs (JWT, OAuth)
- Persister et récupérer les documents AST et leurs métadonnées
- Vérifier les permissions avant toute opération
- Gérer les organisations, utilisateurs, et rôles
- Proxier les appels vers les APIs IA externes
- Gérer les assets (upload, CDN)
- Déclencher et gérer les exports de code

**Ce que apps/api ne fait PAS :**
- Connaître la logique de rendu React ou du builder
- Exécuter de code côté client (pas de runtime)
- Maintenir des connexions WebSocket (délégué au sync-server)

### 19.2 Modules NestJS — Spécification détaillée

#### 19.2.1 Module Auth

```typescript
// auth.module.ts
@Module({
  imports: [
    JwtModule.registerAsync({ ... }),
    PassportModule,
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, RefreshStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}

// Stratégies d'authentification
// 1. LocalStrategy  : email + mot de passe → JWT access + refresh cookie
// 2. JwtStrategy    : vérification du Bearer token sur les routes protégées
// 3. RefreshStrategy: vérification du refresh cookie → nouveau access token
// 4. OAuthStrategy  : Google/GitHub OAuth (phase 2)

// Endpoints
// POST /auth/login          → { accessToken: string }
// POST /auth/refresh        → { accessToken: string }  (nécessite cookie)
// POST /auth/logout         → {}  (invalide le refresh cookie)
// POST /auth/register       → { user: UserDTO }
// POST /auth/reset-password → {}
// GET  /auth/me             → UserDTO
```

#### 19.2.2 Module Project

```typescript
// Endpoints Project
// GET    /projects              → ProjectResponseDTO[]
// POST   /projects              → ProjectResponseDTO
// GET    /projects/:id          → ProjectResponseDTO
// PATCH  /projects/:id          → ProjectResponseDTO
// DELETE /projects/:id          → {}
// POST   /projects/:id/duplicate → ProjectResponseDTO
// GET    /projects/:id/members  → MemberDTO[]
// POST   /projects/:id/invite   → InvitationDTO
// DELETE /projects/:id/members/:userId → {}

// Guards
@UseGuards(JwtAuthGuard, ProjectPermissionGuard)
// ProjectPermissionGuard vérifie que l'utilisateur a la permission
// requise sur le projet (lecture vs écriture vs admin)

// Service ProjectService
@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    private documentService: DocumentService,
    private cacheService: CacheService,
  ) {}

  async create(dto: CreateProjectDTO, userId: string, orgId: string): Promise<Project> {
    // 1. Créer l'entité projet
    const project = this.projectRepo.create({ ...dto, createdBy: userId, organizationId: orgId })
    await this.projectRepo.save(project)

    // 2. Créer le document AST initial (page vide ou template)
    await this.documentService.initializeDocument(project.id, dto.template)

    return project
  }

  async findByOrg(orgId: string, userId: string): Promise<Project[]> {
    // Récupère uniquement les projets accessibles à cet utilisateur
    // (member de l'org OU invité spécifiquement sur le projet)
    return this.projectRepo
      .createQueryBuilder('project')
      .where('project.organizationId = :orgId', { orgId })
      .andWhere('project.deletedAt IS NULL')
      .innerJoin('project.members', 'member', 'member.userId = :userId', { userId })
      .orderBy('project.updatedAt', 'DESC')
      .getMany()
  }
}
```

#### 19.2.3 Module Document

```typescript
// Le module document gère la persistance des ASTs et le versioning

// Endpoints Document
// GET  /projects/:id/document            → DocumentDTO (snapshot + meta)
// PUT  /projects/:id/document            → DocumentDTO
// POST /projects/:id/document/snapshot   → SnapshotDTO (snapshot manuel nommé)
// GET  /projects/:id/document/history    → SnapshotDTO[]
// GET  /projects/:id/document/history/:snapshotId → DocumentDTO
// POST /projects/:id/document/restore/:snapshotId → DocumentDTO

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document) private docRepo: Repository<Document>,
    @InjectRepository(Snapshot) private snapshotRepo: Repository<Snapshot>,
    @InjectRepository(EventLog) private eventRepo: Repository<EventLog>,
    private cacheService: CacheService,
    private storageService: StorageService,   // Pour le CRDT state binaire
  ) {}

  async save(projectId: string, payload: SaveDocumentDTO): Promise<void> {
    // 1. Write-ahead log : persister l'opération immédiatement
    await this.eventRepo.save({
      projectId,
      operation: payload.operation,
      authorId: payload.authorId,
      timestamp: new Date(),
    })

    // 2. Mise à jour du snapshot AST dans la DB
    await this.docRepo.update({ projectId }, {
      snapshotJson: payload.asnapshotJson,
      updatedAt: new Date(),
      opsCountSinceSnapshot: () => 'opsCountSinceSnapshot + 1'
    })

    // 3. Mise à jour du CRDT state binaire en storage
    await this.storageService.put(
      `crdt/${projectId}/state`,
      payload.crdtStateBinary
    )

    // 4. Invalider le cache
    await this.cacheService.del(`document:${projectId}`)

    // 5. Créer un snapshot automatique si seuil atteint
    const doc = await this.docRepo.findOne({ where: { projectId } })
    if (doc && doc.opsCountSinceSnapshot >= SNAPSHOT_THRESHOLD) {
      await this.createAutoSnapshot(projectId, payload.snapshotJson)
    }
  }

  async load(projectId: string): Promise<DocumentDTO> {
    // 1. Essayer le cache Redis d'abord
    const cached = await this.cacheService.get<DocumentDTO>(`document:${projectId}`)
    if (cached) return cached

    // 2. Charger depuis la DB
    const doc = await this.docRepo.findOne({ where: { projectId } })
    if (!doc) throw new NotFoundException('Document not found')

    // 3. Charger le CRDT state binaire depuis le storage
    const crdtState = await this.storageService.get(`crdt/${projectId}/state`)

    const dto: DocumentDTO = {
      projectId,
      schemaVersion: doc.schemaVersion,
      snapshotJson: doc.snapshotJson,
      crdtStateBinary: crdtState,
      updatedAt: doc.updatedAt,
    }

    // 4. Mettre en cache (TTL 5 minutes pour les documents actifs)
    await this.cacheService.set(`document:${projectId}`, dto, 300)

    return dto
  }

  private async createAutoSnapshot(projectId: string, snapshotJson: object): Promise<void> {
    await this.snapshotRepo.save({
      projectId,
      snapshotJson,
      type: 'auto',
      createdAt: new Date(),
    })
    // Réinitialiser le compteur
    await this.docRepo.update({ projectId }, { opsCountSinceSnapshot: 0 })
  }
}
```

#### 19.2.4 Module Export

```typescript
// Le module export gère la génération et la livraison du code

// Endpoints Export
// POST /projects/:id/export              → { exportId: string }
// GET  /projects/:id/export/:exportId    → ExportStatusDTO
// GET  /projects/:id/export/:exportId/download → Buffer (ZIP)

@Injectable()
export class ExportService {
  constructor(
    private documentService: DocumentService,
    private queueService: QueueService,   // Bull queue pour jobs async
  ) {}

  async startExport(projectId: string, options: ExportOptionsDTO): Promise<string> {
    // L'export est un job async (peut prendre 2-10s pour grands projets)
    const exportId = generateId()
    await this.queueService.add('export', {
      exportId,
      projectId,
      options,
    })
    return exportId
  }

  async executeExport(projectId: string, options: ExportOptionsDTO): Promise<Buffer> {
    // 1. Charger le document AST
    const doc = await this.documentService.load(projectId)
    const nodeMap = deserializeNodeMap(doc.snapshotJson)

    // 2. Compiler (mode full, via le package @ecosyt/compiler)
    const { ir, errors } = compile(nodeMap, { mode: 'full' })
    if (errors.some(e => e.severity === 'error')) {
      throw new CompilationError('Compilation failed', errors)
    }

    // 3. Générer le code
    const files = generateReact(ir, options)

    // 4. Créer le ZIP
    const zip = new JSZip()
    for (const [path, content] of Object.entries(files)) {
      zip.file(path, content)
    }

    return zip.generateAsync({ type: 'nodebuffer' })
  }
}
```

#### 19.2.5 Module AI

```typescript
// Le module AI orchestre les agents de génération

// Endpoints AI
// POST /ai/generate   → { operationId: string }  (async)
// POST /ai/suggest    → SuggestionsDTO            (sync, < 2s)
// GET  /ai/:opId      → AIOperationStatusDTO

interface GeneratePayload {
  projectId: string
  pageId: string
  prompt: string
  context: 'full-page' | 'section' | 'component'
}

@Injectable()
export class AIService {
  constructor(
    private documentService: DocumentService,
    private llmClient: LLMClient,       // Abstraction multi-provider
  ) {}

  async generate(payload: GeneratePayload): Promise<Operation[]> {
    // 1. Charger le contexte projet
    const doc = await this.documentService.load(payload.projectId)
    const nodeMap = deserializeNodeMap(doc.snapshotJson)

    // 2. Construire le prompt système
    const systemPrompt = buildSystemPrompt(nodeMap, payload.pageId)

    // 3. Appeler le LLM avec function calling
    // Le LLM retourne des opérations AST structurées, pas du texte libre
    const response = await this.llmClient.complete({
      system: systemPrompt,
      user: payload.prompt,
      tools: [{
        name: 'create_nodes',
        description: 'Create AST nodes for the builder',
        parameters: {
          type: 'object',
          properties: {
            operations: {
              type: 'array',
              items: { $ref: '#/definitions/Operation' }
            }
          }
        }
      }],
      tool_choice: { type: 'tool', name: 'create_nodes' }
    })

    // 4. Parser et valider les opérations générées
    const rawOps = response.toolCall.operations
    const validatedOps = rawOps.filter(op => validateOperation(op, nodeMap))

    return validatedOps
  }
}
```

### 19.3 Infrastructure NestJS

#### 19.3.1 Guards et interceptors

```typescript
// JwtAuthGuard : vérification du Bearer token
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) throw new UnauthorizedException('Invalid or expired token')
    return user
  }
}

// ProjectPermissionGuard : vérification des permissions par projet
@Injectable()
export class ProjectPermissionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    const projectId = request.params.projectId
    const requiredPermission = this.reflector.get<string>('permission', context.getHandler())

    return this.permissionService.hasPermission(user.id, projectId, requiredPermission)
  }
}

// LoggingInterceptor : logging structuré de toutes les requêtes
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const start = Date.now()

    return next.handle().pipe(
      tap(() => {
        logger.info({
          method: req.method,
          path: req.path,
          userId: req.user?.id,
          duration: Date.now() - start,
          status: context.switchToHttp().getResponse().statusCode
        })
      })
    )
  }
}

// RateLimitGuard : protection contre les abus
// Utilise Redis pour le comptage distribué (compatible multi-instances)
// Limites par défaut :
//   - API générale : 200 req/min par IP
//   - Auth endpoints : 10 req/min par IP
//   - AI generation : 5 req/min par utilisateur
//   - Export : 10 req/heure par utilisateur
```

#### 19.3.2 Schéma de base de données complet

```sql
-- Organisation et utilisateurs

CREATE TABLE organizations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  slug          VARCHAR(100) UNIQUE NOT NULL,
  plan          VARCHAR(50) NOT NULL DEFAULT 'free',
  plan_seats    INTEGER NOT NULL DEFAULT 3,
  billing_email VARCHAR(255),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at    TIMESTAMP WITH TIME ZONE
);

CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             VARCHAR(255) UNIQUE NOT NULL,
  password_hash     VARCHAR(255),  -- NULL si OAuth only
  display_name      VARCHAR(255) NOT NULL,
  avatar_url        VARCHAR(500),
  email_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at     TIMESTAMP WITH TIME ZONE,
  deleted_at        TIMESTAMP WITH TIME ZONE
);

CREATE TABLE organization_members (
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  role            VARCHAR(50) NOT NULL DEFAULT 'editor',
  invited_by      UUID REFERENCES users(id),
  joined_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (organization_id, user_id)
);

CREATE INDEX idx_org_members_user ON organization_members(user_id);

-- Projets

CREATE TABLE projects (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name              VARCHAR(255) NOT NULL,
  description       TEXT,
  thumbnail_url     VARCHAR(500),
  created_by        UUID NOT NULL REFERENCES users(id),
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at        TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_projects_org ON projects(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_updated ON projects(updated_at DESC);

-- Row-Level Security sur projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY projects_org_isolation ON projects
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = current_setting('app.user_id')::UUID
    )
  );

-- Documents AST

CREATE TABLE documents (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id              UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  schema_version          VARCHAR(20) NOT NULL DEFAULT '1.0.0',
  snapshot_json           JSONB NOT NULL DEFAULT '{}',
  ops_count_since_snapshot INTEGER NOT NULL DEFAULT 0,
  updated_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by              UUID REFERENCES users(id)
);

-- Index GIN pour les requêtes JSONB sur le snapshot
CREATE INDEX idx_documents_snapshot ON documents USING GIN (snapshot_json);
CREATE INDEX idx_documents_project ON documents(project_id);

-- Snapshots (versions nommées)

CREATE TABLE snapshots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name          VARCHAR(255),          -- NULL pour les auto-snapshots
  type          VARCHAR(20) NOT NULL,  -- 'auto' | 'manual'
  snapshot_json JSONB NOT NULL,
  created_by    UUID REFERENCES users(id),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ops_count     INTEGER NOT NULL       -- Numéro d'opération au moment du snapshot
);

CREATE INDEX idx_snapshots_project ON snapshots(project_id, created_at DESC);

-- Event log (write-ahead log des mutations AST)

CREATE TABLE ast_events (
  id           BIGSERIAL PRIMARY KEY,  -- Séquentiel pour ordering garanti
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_id    UUID NOT NULL REFERENCES users(id),
  operation    JSONB NOT NULL,         -- Opération AST sérialisée
  timestamp    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ast_events_project ON ast_events(project_id, id DESC);

-- Assets

CREATE TABLE assets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
  filename        VARCHAR(500) NOT NULL,
  storage_key     VARCHAR(500) NOT NULL UNIQUE,  -- Clé dans le storage S3/GCS
  content_type    VARCHAR(100) NOT NULL,
  size_bytes      BIGINT NOT NULL,
  cdn_url         VARCHAR(500),
  uploaded_by     UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_assets_org ON assets(organization_id);
CREATE INDEX idx_assets_project ON assets(project_id);

-- Exports

CREATE TABLE exports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status        VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending|running|done|failed
  options       JSONB NOT NULL DEFAULT '{}',
  download_url  VARCHAR(500),    -- URL du ZIP généré (expire après 24h)
  error         TEXT,
  created_by    UUID NOT NULL REFERENCES users(id),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at  TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_exports_project ON exports(project_id, created_at DESC);

-- Refresh tokens

CREATE TABLE refresh_tokens (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash    VARCHAR(255) NOT NULL UNIQUE,   -- Hash bcrypt du token
  expires_at    TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at    TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id)
  WHERE revoked_at IS NULL;
```

---

## 20. apps/sync-server — Serveur WebSocket

### 20.1 Rôle et responsabilités

Le sync-server est un serveur WebSocket **stateless** dédié au transport des messages CRDT entre clients. Il est intentionnellement séparé de l'API principale pour permettre un scaling indépendant.

**Stateless :** Le sync-server ne stocke aucun état persistant. L'état CRDT vit dans les Y.Doc des clients. Le serveur ne fait que relayer les updates entre les clients d'une même room.

**Scaling :** Plusieurs instances peuvent tourner en parallèle. La coordination entre instances est assurée par Redis Pub/Sub.

### 20.2 Architecture des rooms

```typescript
// Une Room correspond à un document (projectId)
// Elle maintient la liste des connexions WebSocket actives sur ce document

class Room {
  private connections: Map<string, WebSocket> = new Map()  // clientId → ws
  private ydoc: Y.Doc = new Y.Doc()   // État CRDT de référence (en mémoire)

  constructor(
    private documentId: string,
    private pubsub: RedisPubSub
  ) {
    // S'abonner aux updates des autres instances de sync-server
    this.pubsub.subscribe(`doc:${documentId}`, (message) => {
      this.broadcastToLocalClients(message.update, message.excludeClientId)
    })
  }

  addClient(clientId: string, ws: WebSocket, initialState: Uint8Array): void {
    this.connections.set(clientId, ws)

    // 1. Synchroniser le nouveau client avec l'état actuel du Y.Doc
    const stateVector = Y.encodeStateVector(this.ydoc)
    const diff = Y.encodeStateAsUpdate(this.ydoc, stateVector)
    if (diff.length > 0) {
      ws.send(encodeSyncMessage('sync', diff))
    }

    // 2. Appliquer l'état initial du client au Y.Doc
    if (initialState.length > 0) {
      Y.applyUpdate(this.ydoc, initialState)
    }

    ws.on('message', (data) => this.handleMessage(clientId, data))
    ws.on('close', () => this.removeClient(clientId))
  }

  private handleMessage(clientId: string, data: Buffer): void {
    const message = decodeMessage(data)

    switch (message.type) {
      case 'sync':
        // Appliquer l'update CRDT au Y.Doc local
        Y.applyUpdate(this.ydoc, message.update)
        // Broadcaster aux autres clients locaux
        this.broadcastToLocalClients(message.update, clientId)
        // Publier sur Redis pour les autres instances
        this.pubsub.publish(`doc:${this.documentId}`, {
          update: message.update,
          excludeClientId: clientId
        })
        break

      case 'awareness':
        // L'awareness est éphémère, juste relayer sans stocker
        this.broadcastToLocalClients(data, clientId)
        this.pubsub.publish(`doc:${this.documentId}:awareness`, {
          update: message.update,
          excludeClientId: clientId
        })
        break

      case 'ping':
        this.connections.get(clientId)?.send(encodeMessage({ type: 'pong' }))
        break
    }
  }

  private broadcastToLocalClients(update: Uint8Array, excludeClientId?: string): void {
    const message = encodeSyncMessage('sync', update)
    for (const [clientId, ws] of this.connections) {
      if (clientId !== excludeClientId && ws.readyState === WebSocket.OPEN) {
        ws.send(message)
      }
    }
  }

  removeClient(clientId: string): void {
    this.connections.delete(clientId)
    if (this.connections.size === 0) {
      // Room vide : se désabonner de Redis pour libérer les ressources
      this.pubsub.unsubscribe(`doc:${this.documentId}`)
    }
  }
}
```

### 20.3 Authentification WebSocket

```typescript
// La vérification JWT se fait à la connexion WebSocket
// Les messages ultérieurs n'ont pas besoin d'être ré-authentifiés
// (la session est établie à la connexion)

server.on('upgrade', async (request, socket, head) => {
  try {
    // Extraire le token du query param
    const url = new URL(request.url!, `http://${request.headers.host}`)
    const token = url.searchParams.get('token')

    if (!token) throw new Error('No token')

    // Vérifier la validité du JWT (sans appel réseau — clé publique locale)
    const payload = jwt.verify(token, process.env.JWT_PUBLIC_KEY!)
    const documentId = url.pathname.split('/').pop()!

    // Vérifier la permission en appelant l'API (seule vérification réseau)
    const hasAccess = await checkDocumentAccess(payload.sub, documentId)
    if (!hasAccess) throw new Error('Forbidden')

    // Accepter la connexion WebSocket
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, { userId: payload.sub, documentId })
    })
  } catch (err) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
    socket.destroy()
  }
})
```

---

# PARTIE V — SPÉCIFICATIONS TECHNIQUES PROFONDES

---

## 21. Modèle AST — Spécification formelle complète (suite)

### 21.1 Expressions et bindings — Grammaire formelle

```
// Grammaire EBNF des expressions ECOSYT
// Un sous-ensemble sécurisé de JavaScript

Expression
  = Ternary

Ternary
  = LogicalOr ('?' Expression ':' Expression)?

LogicalOr
  = LogicalAnd ('||' LogicalAnd)*

LogicalAnd
  = Equality ('&&' Equality)*

Equality
  = Comparison (('===' | '!==') Comparison)*

Comparison
  = Addition (('<' | '>' | '<=' | '>=') Addition)*

Addition
  = Multiplication (('+' | '-') Multiplication)*

Multiplication
  = Unary (('*' | '/') Unary)*

Unary
  = '!' Unary
  | '-' Unary
  | Postfix

Postfix
  = Primary (
      '.' Identifier       // Accès propriété
    | '[' Expression ']'   // Accès indexé
    | '(' ArgList ')'      // Appel méthode SÉCURISÉ uniquement
    )*

Primary
  = Identifier             // Variable (state, prop de composant)
  | NumberLiteral
  | StringLiteral
  | BooleanLiteral
  | NullLiteral
  | '(' Expression ')'
  | ArrayLiteral
  | ObjectLiteral

// Méthodes autorisées (liste blanche explicite)
AllowedMethods
  = 'toString' | 'toFixed' | 'toLowerCase' | 'toUpperCase'
  | 'trim' | 'includes' | 'startsWith' | 'endsWith' | 'slice'
  | 'split' | 'join' | 'indexOf' | 'lastIndexOf' | 'replace'
  | 'map' | 'filter' | 'find' | 'findIndex' | 'some' | 'every'
  | 'reduce' | 'flat' | 'flatMap' | 'concat' | 'sort' | 'reverse'
  | 'length'  // propriété, pas méthode

// Tout autre appel de méthode est une erreur de parsing (sécurité)
```

### 21.2 Système de style — Tokens et design system

```typescript
// Le système de style ECOSYT est basé sur des design tokens
// configurables par organisation (personalisation de la charte)

interface DesignTokens {
  colors: {
    primary: ColorScale       // ex: { 50: '#e3f2fd', ..., 900: '#0d47a1' }
    secondary: ColorScale
    neutral: ColorScale
    success: ColorScale
    warning: ColorScale
    error: ColorScale
    // Couleurs sémantiques
    background: string
    surface: string
    text: { primary: string; secondary: string; disabled: string }
    border: string
  }

  typography: {
    fontFamily: { sans: string; serif: string; mono: string }
    fontSize: {
      xs: string; sm: string; base: string; lg: string;
      xl: string; '2xl': string; '3xl': string; '4xl': string
    }
    fontWeight: {
      light: number; normal: number; medium: number;
      semibold: number; bold: number
    }
    lineHeight: { tight: string; normal: string; relaxed: string }
    letterSpacing: { tight: string; normal: string; wide: string }
  }

  spacing: {
    0: string; 1: string; 2: string; 3: string; 4: string;
    5: string; 6: string; 8: string; 10: string; 12: string;
    16: string; 20: string; 24: string; 32: string; 40: string; 48: string
  }

  borderRadius: {
    none: string; sm: string; md: string; lg: string;
    xl: string; '2xl': string; full: string
  }

  shadows: {
    sm: string; md: string; lg: string; xl: string
  }

  breakpoints: {
    sm: string; md: string; lg: string; xl: string; '2xl': string
  }
}

// Les valeurs de style peuvent référencer des tokens
// ex: style.backgroundColor = '$colors.primary.500'
// Le compilateur résout ces références au moment de la génération de code
```

---




## 22. Système de persistance et de scaling — Spécification complète [VERSION ENRICHIE]

### 22.1 Stratégie de stockage hybride — Architecture détaillée

```
┌─────────────────────────────────────────────────────────────────────┐
│                  PIPELINE D'ÉCRITURE COMPLET                        │
│                                                                     │
│  Client (mutation AST)                                              │
│       │                                                             │
│       ▼                                                             │
│  Sync-server (CRDT broadcast)                                       │
│       │                                                             │
│       ▼                                                             │
│  API /document/save   ←── appelé toutes les N ops ou T secondes     │
│       │                                                             │
│       ├── 1. Write-ahead log (PostgreSQL ast_events)                │
│       │         → Durabilité immédiate, latence < 5ms               │
│       │         → Jamais supprimé (append-only)                     │
│       │                                                             │
│       ├── 2. Update snapshot AST (PostgreSQL documents)             │
│       │         → JSON compressé (zstd, ~60% de réduction)          │
│       │         → ops_count_since_snapshot++                        │
│       │                                                             │
│       ├── 3. Upload CRDT state binaire (S3/GCS)                     │
│       │         → Yjs encoded binary                                │
│       │         → Overwrite du fichier existant (pas de versioning) │
│       │         → Versionné séparément par les snapshots            │
│       │                                                             │
│       ├── 4. Invalidation cache Redis                               │
│       │         → DEL document:{projectId}                          │
│       │                                                             │
│       └── 5. Snapshot auto si seuil atteint                         │
│                 → ops_count_since_snapshot >= THRESHOLD             │
│                 → INSERT INTO snapshots                             │
│                 → Reset ops_count_since_snapshot = 0                │
└─────────────────────────────────────────────────────────────────────┘
```

### 22.2 Fréquence de snapshot — Algorithme adaptatif

```typescript
// La fréquence de snapshot n'est pas fixe : elle s'adapte
// au volume d'activité du document

interface SnapshotPolicy {
  // Snapshot déclenché si l'une des conditions est vraie
  maxOpsSinceSnapshot: number       // Par défaut : 500 ops
  maxSecondsSinceSnapshot: number   // Par défaut : 3600s (1h)
  maxCRDTStateSizeBytes: number     // Si l'état Yjs grossit trop : 50MB

  // Snapshot forcé dans ces cas particuliers
  forcedTriggers: Array<
    | 'manual-save'          // L'utilisateur clique "Save version"
    | 'export-trigger'       // Avant un export (garantit une base propre)
    | 'session-end'          // Dernier utilisateur quitte le document
    | 'schema-migration'     // Avant/après une migration de schéma
    | 'pre-restore'          // Avant un rollback (préserve l'état actuel)
  >
}

class SnapshotManager {
  private _policy: SnapshotPolicy = {
    maxOpsSinceSnapshot: 500,
    maxSecondsSinceSnapshot: 3600,
    maxCRDTStateSizeBytes: 50 * 1024 * 1024,
    forcedTriggers: ['manual-save', 'export-trigger', 'session-end', 'pre-restore']
  }

  shouldTakeSnapshot(doc: DocumentRecord, crdtStateSize: number): boolean {
    if (doc.opsCountSinceSnapshot >= this._policy.maxOpsSinceSnapshot) return true
    const ageSeconds = (Date.now() - doc.updatedAt.getTime()) / 1000
    if (ageSeconds >= this._policy.maxSecondsSinceSnapshot) return true
    if (crdtStateSize >= this._policy.maxCRDTStateSizeBytes) return true
    return false
  }

  async takeSnapshot(
    projectId: string,
    nodeMap: NodeMap,
    type: 'auto' | 'manual',
    name?: string
  ): Promise<Snapshot> {
    // 1. Sérialiser l'AST (compressé)
    const serialized = serializeNodeMap(nodeMap)
    const compressed = compress(JSON.stringify(serialized), 'zstd')

    // 2. Appliquer le GC Yjs (réduire la taille du CRDT state)
    const ydoc = await this._loadYDoc(projectId)
    Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(ydoc))  // Force GC
    const compressedCRDT = ydoc.store  // État après GC

    // 3. Persister le snapshot
    const snapshot = await this._snapshotRepo.save({
      projectId,
      type,
      name: name ?? `Auto-snapshot ${new Date().toISOString()}`,
      snapshotJson: compressed,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      opsCountAtCreation: await this._getOpsCount(projectId),
      createdAt: new Date()
    })

    // 4. Upload du CRDT state versionné
    await this._storage.put(
      `crdt/${projectId}/snapshots/${snapshot.id}`,
      compressedCRDT
    )

    // 5. Rotation des auto-snapshots (garder les 50 derniers)
    if (type === 'auto') {
      await this._rotateAutoSnapshots(projectId, 50)
    }

    // 6. Reset du compteur d'ops
    await this._docRepo.update({ projectId }, { opsCountSinceSnapshot: 0 })

    return snapshot
  }

  // Rotation : supprimer les auto-snapshots au-delà de la limite
  private async _rotateAutoSnapshots(projectId: string, limit: number): Promise<void> {
    const autoSnapshots = await this._snapshotRepo.find({
      where: { projectId, type: 'auto' },
      order: { createdAt: 'DESC' }
    })

    const toDelete = autoSnapshots.slice(limit)
    for (const snap of toDelete) {
      await this._snapshotRepo.delete(snap.id)
      await this._storage.delete(`crdt/${projectId}/snapshots/${snap.id}`)
    }
  }
}
```

### 22.3 Reconstitution d'état — Algorithmes de récupération

#### 22.3.1 Chargement rapide depuis le snapshot (cas nominal)

```typescript
// Cas nominal : le document a un snapshot récent
// Coût : 1 lecture PostgreSQL + 1 lecture S3 + désérialisation

async function loadDocumentFast(projectId: string): Promise<LoadedDocument> {
  // 1. Vérifier le cache Redis
  const cached = await redis.get<LoadedDocument>(`document:${projectId}`)
  if (cached) {
    return cached  // Cache hit : < 1ms
  }

  // 2. Charger le snapshot depuis PostgreSQL
  const doc = await docRepo.findOne({ where: { projectId } })
  if (!doc) throw new NotFoundException()

  // 3. Décompresser et désérialiser le JSON AST
  const decompressed = decompress(doc.snapshotJson, 'zstd')
  const nodeMap = deserializeNodeMap(JSON.parse(decompressed))

  // 4. Charger le CRDT state depuis S3
  const crdtState = await storage.get(`crdt/${projectId}/state`)

  // 5. Reconstruire le Y.Doc
  const ydoc = new Y.Doc()
  if (crdtState) {
    Y.applyUpdate(ydoc, crdtState)
  } else {
    // Pas de CRDT state : reconstruire depuis l'AST
    initYDocFromNodeMap(ydoc, nodeMap)
  }

  const result: LoadedDocument = { nodeMap, ydoc, snapshotId: doc.latestSnapshotId }

  // 6. Mettre en cache (TTL 5 minutes)
  await redis.setEx(`document:${projectId}`, 300, result)

  return result
}
```

#### 22.3.2 Replay depuis l'event log (récupération d'urgence)

```typescript
// Cas de récupération : le snapshot est corrompu ou absent
// Reconstruction depuis le dernier snapshot valide + replay des events

async function recoverFromEventLog(projectId: string): Promise<LoadedDocument> {
  // 1. Trouver le dernier snapshot valide
  const lastValidSnapshot = await findLastValidSnapshot(projectId)

  if (!lastValidSnapshot) {
    // Aucun snapshot valide → reconstruire depuis zéro (document vide)
    return createEmptyDocument(projectId)
  }

  // 2. Charger le snapshot de base
  const baseNodeMap = deserializeNodeMap(
    JSON.parse(decompress(lastValidSnapshot.snapshotJson, 'zstd'))
  )

  // 3. Charger tous les events postérieurs au snapshot
  const events = await eventRepo.find({
    where: {
      projectId,
      id: MoreThan(lastValidSnapshot.opsCountAtCreation)
    },
    order: { id: 'ASC' }  // Ordre séquentiel garanti par BIGSERIAL
  })

  // 4. Rejouer les events sur le snapshot de base
  let nodeMap = baseNodeMap
  let failedEvents = 0

  for (const event of events) {
    try {
      const operation = JSON.parse(event.operation) as Operation
      const result = applyMutation(nodeMap, operation, { origin: 'replay' })
      if (result.success) {
        nodeMap = result.nodeMap
      } else {
        failedEvents++
        console.warn(`Replay skipped event ${event.id}: ${result.error}`)
      }
    } catch (err) {
      failedEvents++
      console.error(`Replay failed for event ${event.id}:`, err)
    }
  }

  if (failedEvents > 0) {
    // Logger l'incident pour investigation
    await incidentLogger.log({
      type: 'partial-replay-failure',
      projectId,
      totalEvents: events.length,
      failedEvents,
      baseSnapshotId: lastValidSnapshot.id
    })
  }

  // 5. Recréer le CRDT state depuis le NodeMap reconstitué
  const ydoc = new Y.Doc()
  initYDocFromNodeMap(ydoc, nodeMap)

  // 6. Créer un nouveau snapshot de récupération
  await snapshotManager.takeSnapshot(projectId, nodeMap, 'auto', 'Recovery snapshot')

  return { nodeMap, ydoc, recovered: true, failedEvents }
}

// Vérification de la validité d'un snapshot
async function findLastValidSnapshot(projectId: string): Promise<Snapshot | null> {
  const snapshots = await snapshotRepo.find({
    where: { projectId },
    order: { createdAt: 'DESC' }
  })

  for (const snapshot of snapshots) {
    try {
      // Vérifier que le snapshot est désérialisable et passe les invariants
      const decompressed = decompress(snapshot.snapshotJson, 'zstd')
      const nodeMap = deserializeNodeMap(JSON.parse(decompressed))
      const validation = runInvariantChecks(nodeMap)
      if (validation.valid) return snapshot
    } catch {
      continue  // Snapshot corrompu → essayer le précédent
    }
  }

  return null
}
```

#### 22.3.3 Gestion des gros projets — Lazy loading AST

```typescript
// Pour les projets avec > 20 pages, charger uniquement la page active
// Le reste des pages est chargé à la demande

interface LazyLoadedDocument {
  meta: DocumentMeta          // Toujours chargé (liste des pages, tokens design)
  loadedPages: Map<PageID, NodeMap>  // Pages chargées en mémoire
  pageManifest: PageManifest  // Métadonnées de toutes les pages (id, name, order)
}

interface PageManifest {
  pages: Array<{
    id: PageID
    name: string
    nodeCount: number
    thumbnailUrl?: string
    lastModifiedAt: Date
  }>
}

class LazyDocumentLoader {
  async loadDocument(projectId: string): Promise<LazyLoadedDocument> {
    // 1. Charger uniquement les métadonnées et le manifeste des pages
    const meta = await this._loadDocumentMeta(projectId)
    const pageManifest = await this._loadPageManifest(projectId)

    // 2. Charger uniquement la page active (ou la première)
    const firstPageId = pageManifest.pages[0]?.id
    const initialPage = firstPageId
      ? await this._loadPage(projectId, firstPageId)
      : null

    return {
      meta,
      pageManifest,
      loadedPages: initialPage
        ? new Map([[firstPageId!, initialPage]])
        : new Map()
    }
  }

  async ensurePageLoaded(
    doc: LazyLoadedDocument,
    projectId: string,
    pageId: PageID
  ): Promise<NodeMap> {
    if (doc.loadedPages.has(pageId)) {
      return doc.loadedPages.get(pageId)!
    }

    // Charger la page depuis la DB (chunk par page)
    const pageNodeMap = await this._loadPage(projectId, pageId)
    doc.loadedPages.set(pageId, pageNodeMap)

    // LRU : si trop de pages en mémoire, décharger les moins récentes
    if (doc.loadedPages.size > MAX_LOADED_PAGES) {
      this._evictLRUPage(doc)
    }

    return pageNodeMap
  }

  private _evictLRUPage(doc: LazyLoadedDocument): void {
    // Garder les MAX_LOADED_PAGES pages les plus récemment accédées
    // Implémentation simple : supprimer la première entrée de la Map
    const firstKey = doc.loadedPages.keys().next().value
    if (firstKey) doc.loadedPages.delete(firstKey)
  }

  private async _loadPage(projectId: string, pageId: PageID): Promise<NodeMap> {
    // Chaque page est stockée comme un chunk JSON indépendant
    const chunk = await this._storage.get(`chunks/${projectId}/${pageId}`)
    if (!chunk) throw new NotFoundException(`Page ${pageId} not found`)
    return deserializeNodeMap(JSON.parse(decompress(chunk, 'zstd')))
  }
}

const MAX_LOADED_PAGES = 5  // Pages simultanément en mémoire
```

### 22.4 Multi-tenant — Isolation et indexation

#### 22.4.1 Row-Level Security — Implémentation PostgreSQL complète

```sql
-- Configuration RLS complète pour l'isolation multi-tenant

-- Activer RLS sur toutes les tables sensibles
ALTER TABLE documents        ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshots        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ast_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets           ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports          ENABLE ROW LEVEL SECURITY;

-- Politique générique : accès uniquement aux ressources de l'organisation de l'utilisateur
-- current_setting('app.user_id') est positionné par le middleware NestJS
-- avant chaque requête dans la transaction

CREATE OR REPLACE FUNCTION get_user_org_ids() RETURNS UUID[] AS $$
  SELECT ARRAY(
    SELECT organization_id
    FROM organization_members
    WHERE user_id = current_setting('app.user_id', TRUE)::UUID
      AND current_setting('app.user_id', TRUE) != ''
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Politique pour documents
CREATE POLICY documents_tenant_isolation ON documents
  USING (
    project_id IN (
      SELECT id FROM projects
      WHERE organization_id = ANY(get_user_org_ids())
    )
  );

-- Politique pour snapshots (identique structure)
CREATE POLICY snapshots_tenant_isolation ON snapshots
  USING (
    project_id IN (
      SELECT id FROM projects
      WHERE organization_id = ANY(get_user_org_ids())
    )
  );

-- Politique pour ast_events
CREATE POLICY events_tenant_isolation ON ast_events
  USING (
    project_id IN (
      SELECT id FROM projects
      WHERE organization_id = ANY(get_user_org_ids())
    )
  );

-- SET dans le middleware NestJS avant chaque requête DB
-- (via TypeORM query runner)
-- await queryRunner.query(`SET LOCAL app.user_id = '${userId}'`)
```

#### 22.4.2 Indexation — Stratégie complète

```sql
-- ─── INDEX CRITIQUES POUR LES REQUÊTES UI ──────────────────────────────

-- Liste des projets d'une organisation (page dashboard)
CREATE INDEX CONCURRENTLY idx_projects_org_updated
  ON projects(organization_id, updated_at DESC)
  WHERE deleted_at IS NULL;

-- Chargement d'un document (path critique : /builder/:projectId)
CREATE INDEX CONCURRENTLY idx_documents_project_id
  ON documents(project_id);

-- Liste des snapshots d'un projet (page historique)
CREATE INDEX CONCURRENTLY idx_snapshots_project_created
  ON snapshots(project_id, created_at DESC);

-- Event log : replay depuis un point donné
CREATE INDEX CONCURRENTLY idx_ast_events_project_sequential
  ON ast_events(project_id, id ASC);

-- Assets d'un projet
CREATE INDEX CONCURRENTLY idx_assets_project
  ON assets(project_id, created_at DESC);

-- Exports en cours (polling status)
CREATE INDEX CONCURRENTLY idx_exports_pending
  ON exports(project_id, status, created_at DESC)
  WHERE status IN ('pending', 'running');

-- ─── INDEX JSONB POUR REQUÊTES SUR L'AST ────────────────────────────────

-- Recherche de nœuds par type dans le snapshot (admin/debug)
CREATE INDEX CONCURRENTLY idx_documents_snapshot_gin
  ON documents USING GIN (snapshot_json jsonb_path_ops);

-- Exemple de requête utilisant cet index :
-- SELECT * FROM documents
-- WHERE snapshot_json @? '$.nodes.*.type ? (@ == "Button")'

-- ─── INDEX POUR LE MULTI-TENANT ──────────────────────────────────────────

-- Membership lookup (appelé à chaque requête authentifiée)
CREATE INDEX CONCURRENTLY idx_org_members_user_org
  ON organization_members(user_id, organization_id);

-- ─── STATISTIQUES ET MAINTENANCE ─────────────────────────────────────────

-- Activer l'autovacuum agressif sur ast_events (table très hot)
ALTER TABLE ast_events SET (
  autovacuum_vacuum_scale_factor = 0.01,
  autovacuum_analyze_scale_factor = 0.005,
  autovacuum_vacuum_cost_delay = 2
);

-- Partitionnement de ast_events par mois (pour les très grands volumes)
-- (à activer en Phase 3 Scaling quand la table dépasse 100M lignes)
-- CREATE TABLE ast_events_2026_01 PARTITION OF ast_events
--   FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

### 22.5 Cache Redis — Stratégie multi-niveaux

```typescript
// ─── DÉFINITION DES NIVEAUX DE CACHE ────────────────────────────────────

const CACHE_KEYS = {
  // Niveau 1 — Document actif (hot, renouvelé à chaque accès)
  document: (projectId: string) => `doc:${projectId}`,         // TTL 5min
  // Niveau 2 — Snapshot courant compressé (warm)
  snapshot: (projectId: string) => `snap:${projectId}`,        // TTL 30min
  // Niveau 3 — Métadonnées légères (très fréquemment lues)
  projectMeta: (projectId: string) => `meta:${projectId}`,     // TTL 1h
  // Niveau 4 — Session WebSocket (état de connexion sync-server)
  wsSession: (clientId: string) => `ws:${clientId}`,           // TTL 24h
  // Niveau 5 — Rate limiting
  rateLimit: (key: string) => `rl:${key}`,                     // TTL variable
} as const

// ─── STRATÉGIE D'INVALIDATION ────────────────────────────────────────────

class CacheManager {
  // Invalidation ciblée après une écriture
  async invalidateOnWrite(projectId: string): Promise<void> {
    // Pipeline Redis pour atomicité (pas de round-trips multiples)
    await this._redis.pipeline()
      .del(CACHE_KEYS.document(projectId))
      .del(CACHE_KEYS.snapshot(projectId))
      // projectMeta n'est PAS invalidé (ne change pas à chaque write)
      .exec()
  }

  // Invalidation complète après un rollback
  async invalidateOnRestore(projectId: string): Promise<void> {
    const pattern = `*:${projectId}`
    const keys = await this._redis.keys(pattern)
    if (keys.length > 0) {
      await this._redis.del(...keys)
    }
  }

  // Cache aside pattern pour les documents
  async getOrLoad<T>(
    key: string,
    ttl: number,
    loader: () => Promise<T>
  ): Promise<T> {
    const cached = await this._redis.get(key)
    if (cached !== null) {
      return JSON.parse(cached) as T
    }

    const value = await loader()
    await this._redis.setEx(key, ttl, JSON.stringify(value))
    return value
  }

  // Warm-up cache pour les documents fréquemment accédés
  async warmupHotDocuments(): Promise<void> {
    // Récupérer les 100 projets les plus accédés dans les dernières 24h
    const hotProjects = await this._analytics.getMostAccessedProjects(100, '24h')

    for (const projectId of hotProjects) {
      const alreadyCached = await this._redis.exists(CACHE_KEYS.document(projectId))
      if (!alreadyCached) {
        // Charger en background sans bloquer
        loadDocumentFast(projectId).then(doc => {
          this._redis.setEx(CACHE_KEYS.document(projectId), 300, JSON.stringify(doc))
        }).catch(err => {
          console.warn(`Cache warmup failed for ${projectId}:`, err)
        })
      }
    }
  }
}
```

### 22.6 Scaling horizontal — Architecture distribuée complète

#### 22.6.1 Sync-server distribué

```typescript
// Architecture multi-instances avec coordination Redis Pub/Sub

class DistributedSyncServer {
  private _rooms = new Map<string, Room>()    // documentId → Room locale
  private _instanceId = generateId()           // Identifiant unique de cette instance

  constructor(
    private _wss: WebSocketServer,
    private _redis: Redis,
    private _redisSubscriber: Redis            // Redis dédié aux subscriptions
  ) {
    this._setupPubSub()
  }

  private _setupPubSub(): void {
    // Chaque instance écoute son channel privé + les channels des documents hébergés
    this._redisSubscriber.psubscribe(
      `crdt:*:update`,      // Updates CRDT de tous les documents
      `crdt:*:awareness`,   // Updates awareness
      `sys:${this._instanceId}:*`  // Messages directs à cette instance
    )

    this._redisSubscriber.on('pmessage', (pattern, channel, message) => {
      const parsed = JSON.parse(message) as PubSubMessage

      // Ignorer les messages émis par cette instance (déjà appliqués localement)
      if (parsed.sourceInstanceId === this._instanceId) return

      const documentId = this._extractDocumentId(channel)
      const room = this._rooms.get(documentId)

      if (room) {
        // La room est hébergée sur cette instance → broadcaster localement
        room.broadcastFromPubSub(parsed.update, parsed.excludeClientId)
      }
    })
  }

  handleConnection(ws: WebSocket, userId: string, documentId: string): void {
    // Créer la room si elle n'existe pas encore sur cette instance
    if (!this._rooms.has(documentId)) {
      this._rooms.set(documentId, new Room(documentId, this._redis, this._instanceId))
    }

    const room = this._rooms.get(documentId)!
    const clientId = generateId()

    room.addClient(clientId, ws, userId)
    ws.on('close', () => this._handleClientDisconnect(clientId, documentId))
  }

  private _handleClientDisconnect(clientId: string, documentId: string): void {
    const room = this._rooms.get(documentId)
    if (!room) return

    room.removeClient(clientId)

    // Nettoyer la room locale si vide
    if (room.isEmpty) {
      this._rooms.delete(documentId)
      // Unsubscribe du channel Redis si plus personne dans ce document sur cette instance
      // (d'autres instances peuvent encore héberger des clients de ce document)
    }
  }
}

// ─── MESSAGE PUB/SUB ─────────────────────────────────────────────────────

interface PubSubMessage {
  type: 'crdt-update' | 'awareness-update' | 'reset'
  documentId: string
  update: number[]           // Uint8Array sérialisé en JSON
  excludeClientId?: string   // Ne pas renvoyer à cet émetteur
  sourceInstanceId: string   // Pour déduplication
  timestamp: number
}

class Room {
  private _connections = new Map<string, { ws: WebSocket; userId: string }>()
  private _ydoc = new Y.Doc()

  constructor(
    private _documentId: string,
    private _redis: Redis,
    private _instanceId: string
  ) {}

  addClient(clientId: string, ws: WebSocket, userId: string): void {
    this._connections.set(clientId, { ws, userId })

    ws.on('message', (data: Buffer) => {
      const msg = this._decode(data)
      if (msg.type === 'crdt-update') {
        this._handleCRDTUpdate(clientId, msg.update)
      } else if (msg.type === 'awareness') {
        this._handleAwareness(clientId, msg.state)
      }
    })

    // Envoyer l'état courant au nouveau client (state sync)
    const currentState = Y.encodeStateAsUpdate(this._ydoc)
    if (currentState.length > 0) {
      ws.send(this._encode({ type: 'crdt-sync', update: currentState }))
    }
  }

  private _handleCRDTUpdate(clientId: string, update: Uint8Array): void {
    // 1. Appliquer au Y.Doc local (source of truth en mémoire)
    Y.applyUpdate(this._ydoc, update)

    // 2. Broadcaster aux clients locaux immédiatement
    this._broadcastToLocalClients(update, clientId)

    // 3. Publier sur Redis pour les autres instances (async, fire-and-forget)
    this._redis.publish(
      `crdt:${this._documentId}:update`,
      JSON.stringify({
        type: 'crdt-update',
        documentId: this._documentId,
        update: Array.from(update),
        excludeClientId: clientId,
        sourceInstanceId: this._instanceId,
        timestamp: Date.now()
      } satisfies PubSubMessage)
    ).catch(err => console.error('Redis publish failed:', err))
    // L'échec Redis ne bloque pas le traitement local
  }

  broadcastFromPubSub(update: number[], excludeClientId?: string): void {
    const updateBytes = new Uint8Array(update)
    // Appliquer au Y.Doc local (synchronisation inter-instances)
    Y.applyUpdate(this._ydoc, updateBytes)
    this._broadcastToLocalClients(updateBytes, excludeClientId)
  }

  private _broadcastToLocalClients(update: Uint8Array, excludeClientId?: string): void {
    const msg = this._encode({ type: 'crdt-sync', update })
    for (const [clientId, { ws }] of this._connections) {
      if (clientId !== excludeClientId && ws.readyState === WebSocket.OPEN) {
        ws.send(msg)
      }
    }
  }

  get isEmpty(): boolean { return this._connections.size === 0 }
}
```

#### 22.6.2 Scaling des instances API

```typescript
// Configuration de scaling horizontal de l'API NestJS

// ─── STATELESSNESS GARANTIE ───────────────────────────────────────────────
// Les instances API sont strictement stateless :
// - Pas d'état en mémoire entre les requêtes
// - Toute session est stockée dans Redis
// - Le round-robin du load balancer peut router n'importe quelle requête
//   vers n'importe quelle instance

// ─── CONFIGURATION STICKY SESSIONS POUR WEBSOCKET ────────────────────────
// Exception : les connexions WebSocket doivent aller au SYNC-SERVER, pas à l'API
// Le load balancer L7 route :
//   - /api/*       → API instances (round-robin, stateless)
//   - /ws/*        → Sync-server instances (sticky session par documentId)

// Sticky session par documentId :
// Header X-Document-Id → hash consistent → instance sync-server
// Garantit que tous les clients d'un même document vont sur la même instance
// (évite la latence du Pub/Sub Redis pour les documents peu actifs)

// ─── CONFIGURATION NGINX / HAProxy ───────────────────────────────────────
/*
upstream api_servers {
  least_conn;                     # Load balancing par nombre de connexions actives
  server api-1:3000;
  server api-2:3000;
  server api-3:3000;
  keepalive 32;                   # Pool de connexions persistantes
}

upstream sync_servers {
  hash $arg_documentId consistent; # Sticky par documentId
  server sync-1:4000;
  server sync-2:4000;
  server sync-3:4000;
}

server {
  location /api {
    proxy_pass http://api_servers;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
  }

  location /ws {
    proxy_pass http://sync_servers;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 3600s;      # WebSocket peut rester ouvert longtemps
  }
}
*/
```

#### 22.6.3 Monitoring et observabilité du système distribué

```typescript
// Métriques spécifiques à la persistance et au scaling

const PERSISTENCE_METRICS = {
  // Snapshots
  snapshot_created_total: new Counter({ name: 'ecosyt_snapshots_created_total', labelNames: ['type'] }),
  snapshot_duration_ms: new Histogram({ name: 'ecosyt_snapshot_duration_ms', buckets: [50, 100, 500, 1000, 5000] }),
  snapshot_size_bytes: new Histogram({ name: 'ecosyt_snapshot_size_bytes', buckets: [1e4, 1e5, 1e6, 1e7] }),

  // Event log
  ast_events_written_total: new Counter({ name: 'ecosyt_ast_events_total' }),
  event_log_replay_duration_ms: new Histogram({ name: 'ecosyt_replay_duration_ms' }),
  event_log_replay_failed_events: new Gauge({ name: 'ecosyt_replay_failed_events' }),

  // Cache
  cache_hits_total: new Counter({ name: 'ecosyt_cache_hits_total', labelNames: ['key_type'] }),
  cache_misses_total: new Counter({ name: 'ecosyt_cache_misses_total', labelNames: ['key_type'] }),
  cache_evictions_total: new Counter({ name: 'ecosyt_cache_evictions_total' }),

  // WebSocket / Sync
  ws_connections_active: new Gauge({ name: 'ecosyt_ws_connections_active', labelNames: ['instance'] }),
  ws_rooms_active: new Gauge({ name: 'ecosyt_ws_rooms_active', labelNames: ['instance'] }),
  crdt_messages_per_second: new Histogram({ name: 'ecosyt_crdt_msg_rate', labelNames: ['document_id'] }),
  crdt_state_size_bytes: new Gauge({ name: 'ecosyt_crdt_state_bytes', labelNames: ['document_id'] }),
  pubsub_latency_ms: new Histogram({ name: 'ecosyt_pubsub_latency_ms', buckets: [1, 5, 10, 50, 100, 500] }),

  // Scaling
  db_connections_active: new Gauge({ name: 'ecosyt_db_connections', labelNames: ['pool', 'state'] }),
  redis_memory_bytes: new Gauge({ name: 'ecosyt_redis_memory_bytes' }),
}

// Alertes Grafana / AlertManager
const ALERT_RULES = [
  {
    name: 'SnapshotTakingTooLong',
    expr: 'ecosyt_snapshot_duration_ms{quantile="0.95"} > 5000',
    for: '5m',
    severity: 'warning',
    message: 'Snapshots prennent > 5s au P95 — vérifier la charge DB'
  },
  {
    name: 'CRDTStateGrowingTooFast',
    expr: 'rate(ecosyt_crdt_state_bytes[5m]) > 1048576',  // > 1MB/min
    for: '10m',
    severity: 'warning',
    message: 'CRDT state grandissant rapidement — vérifier le GC Yjs'
  },
  {
    name: 'EventLogReplayFailures',
    expr: 'ecosyt_replay_failed_events > 0',
    for: '1m',
    severity: 'critical',
    message: 'Des events échouent au replay — corruption potentielle'
  },
  {
    name: 'HighCacheMissRate',
    expr: 'rate(ecosyt_cache_misses_total[5m]) / rate(ecosyt_cache_hits_total[5m]) > 0.3',
    for: '5m',
    severity: 'warning',
    message: 'Taux de cache miss > 30% — vérifier le TTL ou le warm-up'
  },
  {
    name: 'PubSubLatencyHigh',
    expr: 'ecosyt_pubsub_latency_ms{quantile="0.95"} > 100',
    for: '5m',
    severity: 'warning',
    message: 'Latence Pub/Sub inter-instances > 100ms — vérifier Redis'
  }
]
```


## 23. Exigences fonctionnelles détaillées

### 23.1 Gestion des projets et de l'organisation

**EF-01 — Création de projet**
- L'utilisateur peut créer un projet depuis le dashboard
- Un projet peut être créé vide ou depuis un template
- Un projet contient au minimum une page (créée automatiquement)
- Un nom est obligatoire (1-100 caractères)

**EF-02 — Gestion des pages**
- Chaque projet peut contenir de 1 à N pages (illimité)
- Les pages peuvent être renommées, dupliquées, réordonnées, supprimées
- La suppression d'une page est irréversible (avec confirmation)
- La page d'accueil (index) est désignée explicitement

**EF-03 — Versioning**
- L'historique des modifications est conservé indéfiniment (dans les limites du plan)
- L'utilisateur peut créer des snapshots nommés ("Version 1.0", "Avant refonte")
- Les snapshots sont listés avec date, auteur, et nombre de modifications
- Le rollback vers un snapshot est possible avec confirmation

**EF-04 — Collaboration**
- Un projet peut avoir de 1 à N collaborateurs (selon le plan)
- Les rôles sont : Owner, Admin, Editor, Viewer
- Les invitations sont par email
- Un Owner ne peut être rétrogradé que par lui-même
- Un projet peut être transféré à un autre membre

**EF-05 — Exportation**
- L'export génère un projet React/TypeScript standalone
- Le projet exporté inclut : composants, styles, state management, routing
- L'export peut être téléchargé en ZIP ou poussé vers un repository Git
- L'export peut être déclenché depuis le builder ou depuis le dashboard

### 23.2 Builder visuel

**EF-06 — Canvas**
- L'utilisateur peut ajouter des composants depuis une bibliothèque
- Les composants peuvent être déplacés par drag & drop
- Les composants peuvent être redimensionnés par handles
- La sélection multiple est possible (clic + shift, ou zone de sélection)
- L'utilisateur peut zoomer (10% à 400%) et déplacer le canvas

**EF-07 — Édition des propriétés**
- Le panneau inspector affiche les propriétés du composant sélectionné
- Les propriétés sont groupées en : Contenu, Style, Bindings, Événements
- Les modifications sont appliquées en temps réel (preview immédiat)
- Les propriétés peuvent être liées à des variables d'état (bindings)

**EF-08 — Hiérarchie des composants**
- Le panneau layers affiche l'arbre complet des composants de la page
- L'utilisateur peut réordonner les composants par drag & drop dans les layers
- Les composants peuvent être nommés par l'utilisateur
- Les composants peuvent être masqués/affichés dans le builder (non en preview)

**EF-09 — Undo/Redo**
- Undo/Redo illimité pour les modifications de la session courante
- Raccourcis clavier : Ctrl/Cmd+Z (undo), Ctrl/Cmd+Shift+Z (redo)
- L'undo/redo traverses les modifications en continu (pas seulement la dernière)

**EF-10 — Preview**
- Mode preview : affichage de la page comme un vrai navigateur
- Preview responsive : simulation mobile, tablette, desktop
- Interactions actives en mode preview (clics, formulaires, état)
- URL prévisualisable partageable (lien de preview avec authentification)

### 23.3 Composants et design system

**EF-11 — Bibliothèque de composants**
- La bibliothèque contient tous les composants natifs (>30 composants)
- Les composants sont catégorisés (Layout, UI, Forms, Data, Logic)
- La recherche dans la bibliothèque est disponible
- Les composants custom créés par l'utilisateur apparaissent dans la bibliothèque

**EF-12 — Création de composants custom**
- L'utilisateur peut sélectionner un groupe de nœuds et les transformer en composant
- Un composant custom peut exposer des props configurables
- Un composant peut être instancié autant de fois que nécessaire
- La modification du composant source se répercute sur toutes les instances
- Un composant peut être publié dans la bibliothèque de l'organisation

**EF-13 — State management visuel**
- L'utilisateur peut créer des variables d'état (State nodes) sans coder
- Les variables peuvent être de type : string, number, boolean, array, object
- Les bindings sont configurables via l'interface (pas de code requis)
- Les transitions d'état peuvent être déclenchées par des événements UI

### 23.4 Génération IA

**EF-14 — Génération de page**
- L'utilisateur peut saisir un prompt texte pour générer une page complète
- Le résultat est une structure AST valide affichée dans le builder
- L'utilisateur peut modifier le résultat normalement après génération
- La génération inclut : structure, contenu de démonstration, styles de base

**EF-15 — Suggestions contextuelles**
- Le système propose des suggestions de composants en fonction du contexte
- Les suggestions sont non intrusives et optionnelles
- L'acceptation d'une suggestion déclenche une mutation AST validée

---

## 24. Exigences non fonctionnelles

### 24.1 Performance

| Indicateur | Cible P50 | Cible P95 | Critique |
|---|---|---|---|
| Latence interaction builder (action → rendu) | < 8ms | < 16ms | Oui |
| Latence propagation CRDT (local → distant) | < 50ms | < 100ms | Oui |
| Temps de chargement initial d'un projet | < 1s | < 2s | Oui |
| Temps de compilation export (100 nœuds) | < 1s | < 3s | Non |
| Temps de génération IA (page complète) | < 5s | < 10s | Non |
| FPS canvas en édition active | 60 FPS | 30 FPS min | Oui |
| Temps d'hydratation AST (1000 nœuds) | < 200ms | < 500ms | Oui |

### 24.2 Scalabilité

| Dimension | Phase 1 (MVP) | Phase 2 (Croissance) | Phase 3 (Scale) |
|---|---|---|---|
| Utilisateurs simultanés | 1 000 | 10 000 | 100 000 |
| Projets actifs | 10 000 | 100 000 | 1 000 000 |
| Collaborateurs par document | 10 | 50 | 200 |
| Nœuds par document | 5 000 | 20 000 | 100 000 |
| Messages CRDT par seconde | 100/doc | 500/doc | 2 000/doc |
| Instances API | 2 | 10 | 50+ |
| Instances sync-server | 2 | 10 | 50+ |

### 24.3 Disponibilité et résilience

```
SLA cible (Phase production) : 99.9% uptime
  = max 8.7 heures d'indisponibilité par an
  = max 43 minutes par mois

RTO (Recovery Time Objective) : < 30 minutes
RPO (Recovery Point Objective) : < 5 minutes

Stratégies de résilience :
- Circuit Breaker sur tous les appels externes (APIs IA, OAuth providers)
  → Timeout : 5s, seuil d'ouverture : 5 erreurs/10s, reset : 60s
- Retry avec backoff exponentiel pour les opérations critiques
  → 3 tentatives, délais : 1s, 2s, 4s
- Health checks : /health (liveness) et /ready (readiness) sur chaque service
- Graceful shutdown : vidange des requêtes en cours avant arrêt (30s timeout)
- Bulkhead : isolement des pool de connexions DB entre modules critiques
```

### 24.4 Observabilité

```typescript
// Métriques exposées (format Prometheus)

// API
http_request_duration_seconds{method, route, status_code}
http_requests_total{method, route, status_code}
db_query_duration_seconds{query_type, table}
cache_hit_ratio{cache_type}

// Sync-server
ws_connections_active{document_id}
crdt_messages_per_second{document_id}
crdt_state_size_bytes{document_id}
room_merge_duration_ms

// Compiler
compilation_duration_ms{mode, node_count}
ir_node_count{document_id}
compilation_errors_total{error_type}

// Runtime
signal_propagation_duration_ms
dom_patch_count_per_flush
effect_execution_duration_ms

// Business
projects_created_total
exports_generated_total
ai_generations_total{status}
collaboration_sessions_total
```

---

## 25. Contraintes techniques

### 25.1 Contraintes de performance critique

**CT-01 — Latence builder 60 FPS**
Toute action dans le builder (modification d'une prop, déplacement d'un composant, frappe au clavier) doit produire un résultat visible en moins de 16.67ms pour maintenir 60 FPS. Cette contrainte est non-négociable et conditionne les choix d'architecture (fine-grained rendering, compilation incrémentale, signals).

**CT-02 — Taille bundle frontend**
Le bundle JavaScript initial de l'application doit rester sous 200KB gzippé (sans les packages `compiler` et `runtime` qui sont chargés en lazy après authentification). Les packages `compiler` et `runtime` additionnels ne doivent pas dépasser 100KB gzippés chacun.

**CT-03 — Mémoire CRDT**
Le Y.Doc d'un document ne doit pas dépasser 50MB en mémoire (état après GC). Un document dépassant cette limite déclenche une alerte et le chunking obligatoire par page.

### 25.2 Contraintes de compatibilité

**CT-04 — Navigateurs supportés**
- Chrome/Chromium ≥ 110
- Firefox ≥ 110
- Safari ≥ 16
- Edge ≥ 110
Pas de support Internet Explorer ni de versions obsolètes. WebSocket et WebAssembly requis.

**CT-05 — Code exporté indépendant**
Le code React exporté par ECOSYT ne doit avoir aucune dépendance vers des packages ECOSYT. L'utilisateur doit pouvoir utiliser le code exporté dans n'importe quel projet React sans mention d'ECOSYT.

**CT-06 — TypeScript strict**
Tout le code des packages est en TypeScript strict mode (`"strict": true`). Aucun `any` explicite sans commentaire de justification.

### 25.3 Contraintes de schéma

**CT-07 — Immutabilité des IDs**
Un NodeID assigné ne peut jamais être réassigné à un autre nœud, ni réutilisé après suppression. Violation = corruption de données CRDT.

**CT-08 — Backward compatibility des schémas**
Le schéma AST supporte toujours les documents des 2 versions précédentes. Un document en version N-2 est automatiquement migré à l'ouverture.

**CT-09 — Atomicité des mutations**
Toute mutation AST est atomique : elle réussit entièrement ou échoue entièrement sans modifier partiellement le NodeMap.

---

## 26. Sécurité et gouvernance

### 26.1 Modèle d'authentification

```typescript
// Stratégie JWT double-token
//
// Access Token :
//   - Durée de vie : 15 minutes
//   - Stockage client : mémoire JavaScript (variable module)
//   - Contenu : { sub: userId, orgId, email, iat, exp }
//   - Utilisé : header Authorization: Bearer <token>
//
// Refresh Token :
//   - Durée de vie : 30 jours (glissants)
//   - Stockage client : cookie httpOnly, Secure, SameSite=Strict
//   - Contenu : token opaque hashé en base (bcrypt)
//   - Utilisé : endpoint /auth/refresh uniquement
//   - Rotation : chaque refresh produit un nouveau refresh token
//   - Révocation : possible par entrée en base (logout ou compromission)

// Rotation des refresh tokens (prévention du vol de token)
// Si un refresh token déjà utilisé est présenté de nouveau :
//   → Invalider TOUS les refresh tokens de l'utilisateur
//   → Forcer re-login
//   → Logger l'anomalie comme incident de sécurité potentiel
```

### 26.2 Modèle d'autorisation RBAC

```typescript
// Matrice de permissions par rôle

const permissionsMatrix: Record<OrganizationRole, Permission[]> = {
  owner: [
    // Toutes les permissions
    { resource: 'project', action: 'create' },
    { resource: 'project', action: 'read' },
    { resource: 'project', action: 'update' },
    { resource: 'project', action: 'delete' },
    { resource: 'project', action: 'share' },
    { resource: 'project', action: 'export' },
    { resource: 'organization', action: 'update' },
    { resource: 'organization', action: 'delete' },
    { resource: 'billing', action: 'read' },
    { resource: 'billing', action: 'update' },
  ],
  admin: [
    { resource: 'project', action: 'create' },
    { resource: 'project', action: 'read' },
    { resource: 'project', action: 'update' },
    { resource: 'project', action: 'delete' },
    { resource: 'project', action: 'share' },
    { resource: 'project', action: 'export' },
    { resource: 'organization', action: 'read' },
    // Pas de billing, pas de suppression org
  ],
  editor: [
    { resource: 'project', action: 'create' },
    { resource: 'project', action: 'read' },
    { resource: 'project', action: 'update' },
    { resource: 'project', action: 'export' },
    // Pas de delete, pas de share, pas d'admin org
  ],
  viewer: [
    { resource: 'project', action: 'read' },
    // Lecture seule
  ]
}

// Application : le ProjectPermissionGuard NestJS vérifie
// que l'utilisateur a le rôle requis sur le projet avant chaque opération
```

### 26.3 Protection des données

```
Chiffrement en transit :
  - TLS 1.3 obligatoire sur toutes les connexions (HTTP + WebSocket)
  - HSTS avec max-age=31536000 et includeSubDomains
  - Certificate pinning pour les apps mobiles futures

Chiffrement au repos :
  - Données sensibles (mots de passe) : bcrypt avec cost factor 12
  - CRDT states : chiffrement côté serveur (AES-256-GCM) dans l'object storage
  - Base de données : chiffrement au niveau du disque (provider cloud)

Protection des API :
  - Validation stricte de tous les inputs (class-validator NestJS)
  - Sanitisation des chaînes pour prévenir les injections
  - Pas de retour d'informations système dans les messages d'erreur publics
  - CORS restreint aux origines autorisées explicitement

Audit et conformité :
  - Toutes les actions sur les données utilisateur sont loguées
  - Les logs incluent : userId, action, resource, timestamp, IP
  - Rétention des logs : 90 jours
  - RGPD : droit à l'effacement implémenté (soft delete + anonymisation)
  - Export des données utilisateur disponible (RGPD art. 20)
```

---

# PARTIE VII — CONCEPTION ET MISE EN ŒUVRE

---

## 27. Cas d'usage détaillés

### 27.1 CU-01 — Création d'une landing page depuis un prompt IA

**Acteur principal :** Créateur indépendant  
**Pré-condition :** Utilisateur authentifié, projet créé  
**Déclencheur :** Clic sur "Générer avec l'IA" dans le builder

**Scénario nominal :**

1. L'utilisateur ouvre un projet vide dans le builder
2. Il clique sur le bouton "Générer avec l'IA" dans la toolbar
3. Un panneau de saisie s'ouvre avec un champ de prompt
4. Il saisit : *"Landing page pour une app de méditation, tons sombres, hero avec CTA, témoignages, FAQ"*
5. Le système affiche un indicateur de génération (< 8s en moyenne)
6. L'AI Engine décompose la demande :
   - Agent Layout génère la structure AST (Hero, Features, Testimonials, FAQ, Footer)
   - Agent Content remplit les textes et images de démonstration
   - Agent Style applique les tokens design (palette sombre, typographie appropriée)
7. Les mutations AST résultantes sont appliquées au document
8. Le builder affiche la page générée dans le canvas
9. L'utilisateur peut immédiatement modifier n'importe quel élément

**Scénarios alternatifs :**
- 5a. Si la génération dépasse 15s : timeout + message d'erreur, l'utilisateur peut réessayer
- 6a. Si le prompt est ambigu : l'Agent Layout produit une structure générique + suggestion de préciser

**Post-condition :** Le document AST contient la structure générée, sauvegardée automatiquement

---

### 27.2 CU-02 — Collaboration en temps réel sur un prototype

**Acteur principal :** Designer A et Designer B (même organisation)  
**Pré-condition :** Les deux utilisateurs ont accès au projet en rôle Editor  
**Déclencheur :** Les deux utilisateurs ouvrent le projet en même temps

**Scénario nominal :**

1. Designer A ouvre la page d'accueil du projet dans le builder
2. Designer B ouvre la même page 30 secondes plus tard
3. Designer B voit l'avatar de Designer A dans la barre de collaboration
4. Designer A voit le curseur de Designer B se déplacer dans le canvas
5. Designer A modifie le titre principal (prop `text` du TextNode)
6. Designer B voit la modification apparaître dans son canvas en < 100ms
7. Designer B ajoute simultanément un bouton CTA dans le Hero
8. CRDT merge les deux modifications sans conflit (props différentes)
9. Les deux designers voient le résultat final identique
10. Designer B crée un commentaire sur le bouton ("Augmenter la taille ?")
11. Designer A reçoit une notification du commentaire
12. Designer A répond en redimensionnant le bouton (modification style)

**Gestion de conflit :**
- Si Designer A et B modifient la même prop texte simultanément :
  - CRDT applique LWW (la modification la plus récente selon l'horloge Lamport)
  - Les deux designers voient la valeur finale identique
  - Un indicateur visuel discret signale la résolution de conflit

---

### 27.3 CU-03 — Export et intégration dans un projet développeur

**Acteur principal :** Développeur frontend  
**Pré-condition :** Projet ECOSYT finalisé, connexion GitHub configurée  
**Déclencheur :** Clic sur "Exporter le code" dans le builder

**Scénario nominal :**

1. Le développeur ouvre les options d'export (icône export dans la toolbar)
2. Il configure les options :
   - Target : React + TypeScript
   - Style : CSS Modules
   - Routing : React Router v6
   - Repository : github.com/user/mon-projet, branche `ecosyt-export`
3. Il déclenche l'export
4. Le système affiche la progression (5 étapes : Normalisation, IR, Optimisation, Codegen, Push)
5. L'export se termine en ~8 secondes pour un projet de 200 nœuds
6. Une Pull Request est créée automatiquement sur GitHub avec le diff
7. Le développeur reçoit un email avec le lien PR
8. Dans sa PR, il trouve :
   ```
   src/
   ├── components/
   │   ├── HeroSection.tsx        (composant avec props typées)
   │   ├── TestimonialsGrid.tsx
   │   └── FAQAccordion.tsx
   ├── pages/
   │   ├── HomePage.tsx
   │   └── AboutPage.tsx
   ├── hooks/
   │   └── usePageState.ts        (state management extrait)
   ├── styles/
   │   ├── globals.css
   │   └── components/
   └── types/
       └── index.ts
   ```
9. Le développeur review le code, le merge, le CI se déclenche

**Post-condition :** Code React/TS maintenable dans le repository du développeur

---

## 28. Modèle de données complet

### 28.1 Entités et relations

```
Organization (1) ──── (N) User (via organization_members)
Organization (1) ──── (N) Project
Project (1) ──────── (1) Document
Document (1) ────── (N) Snapshot
Document (1) ────── (N) ASTEvent
Project (1) ──────── (N) Asset
Project (1) ──────── (N) Export
User (1) ──────────── (N) RefreshToken
```

### 28.2 Entité Document — Format complet

```typescript
// Format du snapshot JSON stocké dans la colonne snapshot_json
interface SerializedDocument {
  schemaVersion: string          // "1.2.0"
  documentId: string             // UUID = projectId
  rootId: NodeID                 // ID du nœud racine

  // Registre de tous les nœuds (NodeMap sérialisé)
  nodes: Record<NodeID, SerializedNode>

  // Index de hiérarchie (redondant mais nécessaire pour les requêtes JSONB)
  childrenMap: Record<NodeID, NodeID[]>

  // Graphe de dépendances
  dependencyMap: Record<NodeID, NodeID[]>

  // Métadonnées
  meta: {
    createdAt: number
    updatedAt: number
    pageIds: PageID[]
    componentIds: NodeID[]        // Définitions de composants custom
    designTokens?: Partial<DesignTokens>  // Override du design system
  }
}

interface SerializedNode {
  id: NodeID
  type: NodeType
  category: NodeCategory
  props: Record<string, JSONValue>
  style: Record<string, JSONValue>
  children: NodeID[]
  parent: NodeID | null
  bindings: Record<string, Binding>
  events?: Record<string, EventHandler>
  meta: {
    createdAt: number
    updatedAt: number
    name?: string                  // Nom utilisateur (ex: "Hero Section")
    locked?: boolean               // Nœud verrouillé en édition
    hidden?: boolean               // Masqué en édition (visible en preview)
  }
}
```

---

## 29. Choix technologiques — Justifications complètes

### 29.1 Tableau de décision complet

| Composant | Choix retenu | Alternatives évaluées | Décision |
|---|---|---|---|
| Langage | TypeScript 5.x | JavaScript, Go, Rust | TypeScript : cohérence full-stack, types stricts |
| Monorepo tooling | pnpm + Turborepo | Nx, Lerna, Yarn workspaces | Turborepo : cache de build intelligent, pipeline déclarative |
| Backend framework | NestJS | Express, Fastify, Hapi | NestJS : DDD natif, modules, guards, ecosystem riche |
| ORM | TypeORM | Prisma, Drizzle, Knex | TypeORM : maturité, compatibilité NestJS, migrations |
| Frontend | React 18 + TypeScript | Vue 3, Svelte, SolidJS | React : écosystème dominant, compatibilité code exporté |
| State management UI | Zustand | Redux Toolkit, Jotai | Zustand : API simple, DevTools, pas de boilerplate |
| Requêtes API client | TanStack Query | SWR, Apollo | TanStack Query : cache, retry, invalidation, DevTools |
| CRDT | Yjs | Automerge, ShareDB | Yjs : performance, providers WebSocket natifs, maturité |
| Base de données | PostgreSQL 15 | MySQL, MongoDB, CockroachDB | PostgreSQL : JSONB natif, RLS, maturité, extensions |
| Cache | Redis 7 | Memcached, DragonflyDB | Redis : Pub/Sub, structures de données, cluster |
| Queue/Jobs | BullMQ | RabbitMQ, SQS, Temporal | BullMQ : Redis-based, dashboard UI, retry avancé |
| Object storage | AWS S3 / GCS | MinIO, Cloudflare R2 | S3/GCS : maturité, intégration CDN, SLA garanti |
| Monitoring | Prometheus + Grafana | Datadog, New Relic | Prometheus/Grafana : open source, flexibilité |
| Logging | Pino + ELK | Winston + Loki, Papertrail | Pino : performance, structured logging JSON |
| Tests | Vitest + Playwright | Jest + Cypress | Vitest : vitesse, compatibilité ESM ; Playwright : fiabilité E2E |
| CI/CD | GitHub Actions | GitLab CI, CircleCI | GitHub Actions : intégration native, marketplace |
| Containerisation | Docker + K8s (prod) | Fly.io, Railway (dev) | Docker/K8s pour la production ; Railway pour dev rapide |

### 29.2 Décisions architecturales documentées (ADRs)

**ADR-001 : Choix du modèle AST plat (NodeMap) vs hiérarchique**
- *Contexte :* Représentation interne des composants
- *Décision :* NodeMap indexé par ID avec relations explicites
- *Justification :* O(1) lookup, compatible CRDT, diff efficace, pas de récursion
- *Conséquences :* Complexité de déréférencement, mais compensée par les selectors

**ADR-002 : CRDT vs Operational Transform pour la collaboration**
- *Contexte :* Mécanisme de synchronisation multi-utilisateur
- *Décision :* CRDT (Yjs)
- *Justification :* Convergence garantie sans serveur de merge, offline support, écosystème mature
- *Conséquences :* Overhead mémoire, nécessité d'une couche de validation métier post-merge

**ADR-003 : IR comme étape intermédiaire de compilation**
- *Contexte :* Pipeline AST → Code
- *Décision :* IR explicite (pas de compilation directe AST → Code)
- *Justification :* Optimisations, multi-target, testabilité des passes individuelles
- *Conséquences :* Complexité supplémentaire, mais indispensable pour la qualité du code généré

**ADR-004 : Signals comme modèle réactif du runtime**
- *Contexte :* Gestion de la réactivité dans le builder
- *Décision :* Signals (push-based, fine-grained)
- *Justification :* Performance supérieure au Virtual DOM pour un builder (mises à jour très fréquentes), contrôle fin
- *Conséquences :* Implémentation complexe, mais déterminisme garanti et performance optimale

**ADR-005 : Event sourcing pour l'historique AST**
- *Contexte :* Undo/Redo et audit trail
- *Décision :* Event log append-only avec snapshots périodiques
- *Justification :* Audit complet, replay possible, undo/redo sans limite
- *Conséquences :* Stockage accru, compaction nécessaire

---

## 30. Hypothèses de conception

Ces hypothèses ont guidé les décisions architecturales et doivent être validées ou révisées au cours du développement.

**H-01 — Performance Yjs suffisante**
Hypothèse : Yjs maintient des performances acceptables pour des documents jusqu'à 10 000 nœuds AST avec une collaboration à 20+ utilisateurs simultanés.
*Risque : overhead CRDT excessif sur les très grands documents.*
*Mitigation : Chunking par page (un Y.Doc par page), benchmarks précoces.*

**H-02 — Qualité du code généré acceptable en production**
Hypothèse : Le pipeline AST → IR → Code React produit du code lisible, maintenable, et idiomatique pour les cas d'usage couverts (pages statiques, landing pages, dashboards).
*Risque : Les cas edge (animations complexes, logique business avancée) produisent du code difficile à lire.*
*Mitigation : Tests de snapshots exhaustifs, feedback utilisateurs dès la beta.*

**H-03 — Adoption du modèle de génération IA**
Hypothèse : Les utilisateurs adoptent massivement le prompt IA comme point d'entrée pour démarrer un projet.
*Risque : La qualité des outputs IA ne répond pas aux attentes et génère de la frustration.*
*Mitigation : Calibration des expectations dans l'UI, mode "template" comme alternative.*

**H-04 — AST suffisamment expressif pour les cas d'usage cibles**
Hypothèse : Le modèle AST (V1 : ~20 types de nœuds) couvre 80% des besoins des utilisateurs cibles.
*Risque : Des cas d'usage courants (animations, canvas 3D, composants très spécifiques) ne sont pas représentables.*
*Mitigation : Système de plugins pour nœuds custom, feedback utilisateurs priorisé.*

**H-05 — Maîtrise de la latence CRDT sur réseau mobile**
Hypothèse : La latence CRDT reste < 200ms en P95 sur une connexion 4G standard.
*Risque : Les pays avec infrastructure réseau moins stable dépassent systématiquement ce seuil.*
*Mitigation : Optimistic UI fort, compression des messages CRDT, CDN edge pour le sync-server.*

---

## 31. Risques et points critiques

### 31.1 Matrice des risques

| ID | Risque | Probabilité | Impact | Criticité | Mitigation |
|---|---|---|---|---|---|
| R-01 | Modèle AST trop rigide ou trop flexible | Moyenne | Critique | **HAUTE** | Itérations early avec utilisateurs réels |
| R-02 | Bugs CRDT en collaboration intensive | Moyenne | Élevé | **HAUTE** | Tests de fuzzing, stress tests collaboration |
| R-03 | Code généré de mauvaise qualité | Moyenne | Élevé | **HAUTE** | Snapshots tests exhaustifs, revue manuelle |
| R-04 | Performance builder sur grands projets | Élevée | Élevé | **HAUTE** | Benchmarks continus, chunking par page |
| R-05 | Explosion mémoire CRDT | Moyenne | Moyen | **MOYENNE** | GC Yjs, monitoring size, alerting |
| R-06 | Scope trop large = livraison trop lente | Élevée | Élevé | **HAUTE** | Roadmap stricte, MVP délimité |
| R-07 | Qualité AI Engine insuffisante | Élevée | Moyen | **MOYENNE** | Multi-provider, fallback, calibrage prompts |
| R-08 | Violations de sécurité (injection dans AST via IA) | Faible | Critique | **HAUTE** | Sandbox expressions, validation stricte |
| R-09 | Scaling CRDT en collaboration massive | Faible | Élevé | **MOYENNE** | Architecture pub/sub, monitoring |
| R-10 | Migration de schéma AST ratée | Faible | Critique | **HAUTE** | Tests de migration, backup avant migration |

### 31.2 Erreurs architecturales critiques à éviter

**Erreur 1 — Coupler l'état UI à l'AST**
Stocker des informations UI (nœud sélectionné, mode d'édition, zoom canvas) dans le NodeMap AST entraînerait leur synchronisation CRDT entre tous les utilisateurs — ce qui est à la fois inutile et destructeur pour la performance.
*Prévention :* État UI exclusivement dans le store Zustand du `builder-ui`.

**Erreur 2 — Implémenter le CRDT avant stabilisation du modèle AST**
Si le schéma AST change significativement après l'intégration CRDT, toutes les structures Y.Doc sont à reconstruire — coût extrêmement élevé.
*Prévention :* Gel du schéma AST v1 avant intégration CRDT (fin Phase 1 avant Phase 4).

**Erreur 3 — Générer le code directement depuis l'AST sans IR**
Sans IR, chaque nouveau target de compilation (Vue, HTML, Angular) nécessite de redémarrer le générateur depuis l'AST. Les optimisations sont impossibles à mutualiser.
*Prévention :* L'IR est non-négociable — respecter le pipeline en phases modulaires.

**Erreur 4 — Opérations de mutation trop grossières**
Une mutation `UPDATE_NODE` qui remplace tout un nœud est incompatible avec le fine-grained CRDT. Elle entraîne des conflits systématiques sur les modifications concurrentes de props différentes du même nœud.
*Prévention :* Granularité prop-level obligatoire (`UPDATE_PROP` sur un chemin précis).

**Erreur 5 — Absence de validation post-merge CRDT**
CRDT peut produire un état structurellement valide du point de vue de Yjs mais sémantiquement invalide pour l'AST ECOSYT (références cassées, cycles, type mismatch).
*Prévention :* Couche de validation obligatoire après chaque merge distant.

**Erreur 6 — Persister avant validation complète**
Persister un AST invalide corrompt le document pour tous les utilisateurs futurs.
*Prévention :* La sauvegarde appelle systématiquement `runInvariantChecks` avant écriture.

---

## 32. Stratégie de mise en œuvre et roadmap

### 32.1 Ordre de construction validé

L'ordre de construction optimal, issu de l'analyse des dépendances réelles entre modules :

```
Phase 1 : AST     → fondation de tout le système
Phase 2 : Builder → valider le modèle AST sur des cas réels + avoir un produit visible
Phase 3 : Runtime → remplacer le rendu naïf, moteur de performance
Phase 4 : Compiler → export code (dépend du runtime pour connaître les contraintes)
Phase 5 : CRDT    → collaboration (uniquement après stabilisation AST)
Phase 6 : Persistance → SaaS réel, production-ready
Phase 7 : IA      → différenciation, après que les fondations sont solides
```

**Justification de l'ordre Compiler APRÈS Runtime :**
Le runtime définit les contraintes de génération (comment les signals doivent être consommés, comment les updates DOM sont appliqués). Sans runtime, l'IR et le code généré sont conçus dans le vide et devront être refactorisés. Le runtime doit exister en premier pour que le compilateur génère du code correctement adapté.

### 32.2 Phase 1 — Fondation AST

**Durée estimée :** 4-6 semaines

**Livrables :**
- Package `@ecosyt/ast` complet avec tous les types TypeScript
- NodeMap implémenté et optimisé
- Toutes les mutations : createNode, updateNode/updateProp/updateStyle, deleteNode, moveNode, updateBinding
- Système de validation : invariants structurels + sémantiques (3 niveaux)
- Historique event sourcing : undo/redo multi-niveaux
- Sérialisation/désérialisation JSON complet
- Parser et évaluateur d'expressions sécurisé
- Couverture tests > 95% (objectif phase 1)

**Critère de sortie de phase :**
- Tous les invariants définis sont vérifiés à chaque mutation
- Le undo/redo fonctionne sur des séquences complexes de 100+ mutations
- La performance de mutation est < 1ms pour des documents de 5000 nœuds

**Méthode de travail :**
1. Définir tous les types TypeScript (types.ts, props.ts, bindings.ts)
2. Implémenter le NodeMap (core/node-map.ts)
3. Implémenter les mutations une par une avec tests unitaires
4. Implémenter le système de validation
5. Implémenter l'event log et l'undo/redo
6. Implémenter la sérialisation
7. Stabilisation et revue de l'API publique

### 32.3 Phase 2 — Builder minimal

**Durée estimée :** 3-4 semaines

**Livrables :**
- Canvas React avec rendu des nœuds AST (rendu naïf, pas encore le runtime)
- Sélection et modification de propriétés via l'Inspector
- Drag & drop basique depuis la bibliothèque de composants
- Panneau layers (arbre des composants)
- Toolbar avec actions de base (ajouter, supprimer, undo/redo)
- Rendu AST → React simple (chaque nœud AST → composant React correspondant)

**Contraintes phase 2 (ne pas faire) :**
- Pas de runtime réactif avancé (rendu simple React)
- Pas de collaboration multi-user
- Pas d'optimisations de performance
- Pas de persistance (état en mémoire uniquement)

**Critère de sortie de phase :**
- Il est possible de créer une page simple (hero + texte + bouton) visuellement
- Les modifications de props sont reflétées immédiatement dans le canvas
- L'undo/redo fonctionne visuellement

### 32.4 Phase 3 — Runtime réactif

**Durée estimée :** 4-5 semaines

**Livrables :**
- Package `@ecosyt/runtime` complet
- Primitives : signal, computed, effect (avec tracking automatique)
- Scheduler : batching, microtask queue, flush topologique
- Renderer fine-grained : création et mise à jour DOM ciblée
- Graphe de dépendances runtime avec détection de cycles
- Intégration dans le builder (remplacer le rendu naïf)
- Benchmarks de performance automatisés
- Couverture tests > 90%

**Critère de sortie de phase :**
- Modification d'une prop → mise à jour DOM en < 16ms sur un projet de 500 nœuds
- Glitch-free : aucune valeur transitoire incohérente observable
- Benchmark signal-propagation-depth-20 < 16ms

### 32.5 Phase 4 — Compilateur

**Durée estimée :** 5-6 semaines

**Livrables :**
- Package `@ecosyt/compiler` complet
- IR : types, builder API, graphe de dépendances
- Toutes les passes de transformation (normalize, flatten, resolve, expand, optimize)
- Codegen React/TypeScript (mode clean code pour export)
- Compilation incrémentale avec invalidation partielle
- Gestion des erreurs avec localisation dans l'AST
- Tests de snapshots : > 50 cas de test avec code attendu
- Mode full compile + mode incrémental

**Critère de sortie de phase :**
- Un projet de 100 nœuds compile en < 3s (mode full)
- La compilation incrémentale recompile en < 16ms pour une modification de prop
- Le code React exporté compile sans erreur TypeScript strict

### 32.6 Phase 5 — Collaboration CRDT

**Durée estimée :** 5-7 semaines

**Livrables :**
- Package `@ecosyt/sync` complet (CRDT layer + mapping + awareness)
- `apps/sync-server` complet (WebSocket + rooms + Redis pub/sub)
- Mapping bidirectionnel AST ↔ Yjs (toutes les opérations)
- Couche de validation post-merge
- UX awareness : curseurs distants, présence, sélections partagées
- Tests de collaboration multi-onglets et multi-utilisateurs
- Tests de reconnexion et de mode offline

**Critère de sortie de phase :**
- 10 utilisateurs simultanés sur un même document sans corruption
- Propagation des modifications < 100ms en réseau local
- Reconnexion après 5 minutes offline : convergence correcte garantie

### 32.7 Phase 6 — Persistance et SaaS

**Durée estimée :** 4-5 semaines

**Livrables :**
- `apps/api` complet : auth, users, orgs, projects, documents, exports, assets
- Schéma PostgreSQL finalisé avec migrations
- Stratégie snapshots automatiques et manuels
- Redis cache multi-niveaux
- Row-Level Security multi-tenant opérationnel
- Monitoring : Prometheus + Grafana, alerting
- Tests d'intégration API complets
- Tests de charge basiques (k6)

**Critère de sortie de phase :**
- Un utilisateur peut créer un compte, créer un projet, l'éditer, le fermer, le rouvrir
- La restauration depuis un snapshot est fonctionnelle
- 100 utilisateurs simultanés sans dégradation de performance

### 32.8 Phase 7 — IA et fonctionnalités avancées

**Durée estimée :** 6-8 semaines

**Livrables :**
- AI Engine : Agent Layout, Agent Content, Agent Suggestions
- Intégration multi-provider LLM (OpenAI + Anthropic)
- Interface de prompt dans le builder
- Export GitHub/GitLab avec PR automatique
- Versioning avancé avec diff visuel
- Marketplace de composants (phase 1 : bibliothèque interne)
- Intégrations CMS (Contentful, Sanity)

**Critère de sortie de phase :**
- Un utilisateur peut générer une landing page depuis un prompt en < 10s
- Le code exporté crée une PR GitHub valide

---

## 33. Méthode d'exécution par phase

### 33.1 Cycle de travail standard

Pour chaque phase et chaque module :

```
┌─────────────────────────────────────────────────────────────┐
│                    CYCLE DE DÉVELOPPEMENT                   │
│                                                             │
│  Semaine N   : Design précis                                │
│    ├── Écrire les types TypeScript                          │
│    ├── Définir les interfaces publiques                     │
│    ├── Rédiger les tests (TDD)                              │
│    └── Review d'architecture                                │
│                                                             │
│  Semaine N+1 : Implémentation minimale fonctionnelle        │
│    ├── Implémenter pour faire passer les tests              │
│    ├── Ne pas optimiser prématurément                       │
│    └── Code review                                          │
│                                                             │
│  Semaine N+2 : Stabilisation                                │
│    ├── Corriger les bugs des tests                          │
│    ├── Augmenter la couverture de tests                     │
│    ├── Documenter l'API publique                            │
│    └── Benchmarks si critique performance                   │
│                                                             │
│  Semaine N+3 : Extension                                    │
│    ├── Cas edge et gestion d'erreurs                        │
│    ├── Optimisations ciblées (si nécessaire)                │
│    └── Préparation de la phase suivante                     │
└─────────────────────────────────────────────────────────────┘
```

**Règle absolue :** Ne jamais passer à la phase suivante avant que la phase courante soit stable et que ses tests passent en CI.

### 33.2 Infrastructure CI/CD

```yaml
# Pipeline GitHub Actions simplifié
name: ECOSYT CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - run: pnpm typecheck

  test:
    strategy:
      matrix:
        package: [ast, compiler, runtime, sync]
    steps:
      - run: pnpm --filter @ecosyt/${{ matrix.package }} test --coverage

  test-coverage:
    steps:
      - run: pnpm test:coverage
      - name: Assert coverage thresholds
        run: |
          pnpm coverage:check --threshold ast=95 --threshold compiler=90 --threshold runtime=90

  benchmarks:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - run: pnpm bench

  e2e:
    steps:
      - run: pnpm e2e

  deploy-staging:
    needs: [lint, typecheck, test, e2e]
    if: github.ref == 'refs/heads/develop'
    steps:
      - run: pnpm deploy:staging
```

---

# PARTIE VIII — RÉFÉRENCE

---

## 34. Différenciation stratégique — Analyse détaillée

### 34.1 Avantages concurrentiels structurels

**Avantage 1 — IA intégrée au modèle, pas autour**

Chez les concurrents, l'IA est un outil externe : ChatGPT génère du code que l'on copie-colle, ou une feature d'assistant qui génère du texte. Dans ECOSYT, l'IA génère des mutations AST valides directement applicables. Le résultat est immédiatement visible dans le builder, modifiable nœud par nœud, compilable, et collaboratif. C'est une différence qualitative irréductible.

**Avantage 2 — Collaboration comme propriété fondamentale**

Le CRDT est intégré aux fondations (structures de données au niveau de l'AST). Aucun concurrent ne peut atteindre ce niveau de collaboration sans refaire son architecture from scratch. Webflow, Framer, et Bubble ont ajouté de la collaboration en surface — le résultat est toujours dégradé. ECOSYT est le seul builder où deux utilisateurs peuvent éditer simultanément le même composant sans conflits.

**Avantage 3 — Export anti-lock-in comme engagement principal**

ECOSYT est le seul outil no-code dont le modèle économique n'est pas basé sur le lock-in. L'export code production-grade est une feature de premier rang, pas une afterthought ou une feature premium cachée. Cela attire les utilisateurs les plus exigeants (développeurs, équipes techniques) qui évitent catégoriquement le no-code pour cette raison.

**Avantage 4 — Cohérence du système (design → application → code)**

Aujourd'hui, un projet digital traverse au minimum 3 outils : un design tool (Figma), un builder ou un framework (code), et un CMS. ECOSYT unifie ces trois dimensions dans un système cohérent avec un seul modèle de données (AST) — le design IS l'application IS le code.

### 34.2 Analyse de soutenabilité des avantages

| Avantage | Coût d'imitation | Délai d'imitation | Soutenu ? |
|---|---|---|---|
| IA sur AST | Très élevé (refonte architecture) | 2-3 ans | Oui |
| CRDT natif | Très élevé (refonte architecture) | 2-3 ans | Oui |
| Export anti-lock-in | Moyen (choix produit) | 6-12 mois | Partiel |
| Performance runtime | Élevé (expertise) | 1-2 ans | Oui |

---

## 35. Patterns et anti-patterns

### 35.1 Patterns recommandés

**Pattern 1 — Command pour toutes les mutations AST**
Chaque modification de l'AST est encapsulée dans un objet Command avec son inverse. Cela permet l'undo/redo, l'audit, et la compatibilité CRDT.

**Pattern 2 — Visitor pour la compilation**
Le compilateur utilise le pattern Visitor pour traverser l'AST et transformer chaque type de nœud. Chaque passe est un Visitor indépendant et testable.

**Pattern 3 — Observer pour la réactivité runtime**
Le runtime utilise le pattern Observer (implémenté via signals) pour propager les changements. Les Computeds s'abonnent automatiquement aux Signals lus lors de leur exécution.

**Pattern 4 — Repository pour la persistance**
Chaque entité de la base de données a un Repository qui encapsule les requêtes. Le service ne connaît pas la base de données directement.

**Pattern 5 — Strategy pour la résolution des conflits CRDT**
La résolution des conflits est une Strategy : le comportement peut être sélectionné par type de nœud (LWW pour le texte, merge custom pour les listes).

### 35.2 Anti-patterns interdits

**Anti-pattern 1 — Nested mutable objects dans les signals**
```typescript
// ❌ INTERDIT : mutation directe d'un objet dans un signal
const user = signal({ name: 'Alice', age: 30 })
user().name = 'Bob'  // Ne déclenche PAS de mise à jour

// ✅ CORRECT : remplacer l'objet entier
user.update(u => ({ ...u, name: 'Bob' }))
```

**Anti-pattern 2 — Effets avec dépendances circulaires**
```typescript
// ❌ INTERDIT : boucle infinie
const a = signal(0)
const b = signal(0)
effect(() => { b.set(a() + 1) })
effect(() => { a.set(b() + 1) })  // Boucle infinie !
```

**Anti-pattern 3 — Importer builder-ui dans ast**
```typescript
// ❌ INTERDIT dans packages/ast
import { useSelection } from '@ecosyt/builder-ui'  // Violation de dépendance
```

**Anti-pattern 4 — Accès direct au DOM dans les mutations AST**
```typescript
// ❌ INTERDIT dans packages/ast
function deleteNode(nodeMap, nodeId) {
  document.getElementById(nodeId)?.remove()  // L'AST ne connaît pas le DOM
  // ...
}
```

**Anti-pattern 5 — Mutation de l'AST dans un effect runtime**
```typescript
// ❌ DANGEREUX : les effects runtime ne doivent pas modifier l'AST
// (crée des boucles de feedback)
effect(() => {
  if (userName() === '') {
    createNode(nodeMap, ...)  // Mutation AST dans un effect = danger
  }
})
```

---

## 36. Glossaire technique complet

| Terme | Acronyme | Définition |
|---|---|---|
| Abstract Syntax Tree | AST | Représentation interne structurée d'une application sous forme de registre de nœuds JSON indexés. Source de vérité unique du système ECOSYT. |
| Architecture Decision Record | ADR | Document formalisant une décision architecturale avec son contexte, ses alternatives, et ses conséquences. |
| Awareness | — | Mécanisme Yjs permettant de partager des informations éphémères entre utilisateurs (curseurs, présence, sélection). Non persisté, non-CRDT. |
| Batching | — | Regroupement de plusieurs mutations ou mises à jour en un seul cycle d'exécution pour réduire le nombre de re-renders. |
| Builder API | — | Approche de génération de code par construction programmatique de la structure cible, par opposition au templating textuel. |
| Chunking | — | Découpage d'un grand document AST en parties indépendantes (par page, par sous-arbre) pour optimiser le chargement et la synchronisation. |
| Computed | — | Valeur dérivée d'un ou plusieurs signals, recalculée automatiquement et lazily quand ses dépendances changent. |
| Conflict-free Replicated Data Type | CRDT | Structure de données permettant à plusieurs nœuds d'un système distribué de modifier indépendamment, avec convergence automatique garantie sans coordination centrale. |
| Command Pattern | — | Pattern de conception encapsulant une opération avec son inverse, permettant l'undo/redo et l'historisation. |
| Dead Node Elimination | DNE | Optimisation du compilateur supprimant les nœuds IR jamais atteints depuis les points d'entrée du graphe. |
| Dataflow Graph | — | Représentation des dépendances entre sources de données et consommateurs, sous forme de graphe orienté acyclique (DAG). |
| Effect | — | Action déclarative exécutée automatiquement après le rendu lorsqu'une de ses dépendances est invalidée. |
| Event Sourcing | — | Pattern de persistance stockant l'état comme une séquence d'événements immuables plutôt que comme un état courant. |
| Fine-grained Rendering | — | Stratégie de rendu appliquant uniquement les modifications DOM minimales correspondant aux signaux invalidés, sans diff global de l'arbre. |
| Glitch | — | Anomalie dans un système réactif où une valeur transitoire incohérente est observable par un consommateur avant la fin d'un cycle de propagation. |
| Intermediate Representation | IR | Représentation intermédiaire entre l'AST et le code généré, sous forme de graphe orienté explicite optimisé pour la transformation et l'exécution. |
| Invariant | — | Prédicat qui doit être vrai à tout moment sur l'état du système. La violation d'un invariant constitue une erreur critique. |
| Last-Write-Wins | LWW | Stratégie de résolution de conflits où la modification avec le timestamp le plus récent prend la priorité sur les modifications antérieures concurrentes. |
| Lazy Evaluation | — | Stratégie d'évaluation retardant le calcul d'une valeur jusqu'au moment où elle est effectivement demandée. |
| Monorepo | — | Organisation d'un projet où tous les packages et applications sont hébergés dans un seul repository Git, avec des outils de gestion des dépendances inter-packages. |
| NodeID | — | Identifiant unique (UUID v4) d'un nœud AST. Stable et immuable une fois assigné. |
| NodeMap | — | Registre central de l'AST : Map<NodeID, Node> permettant l'accès O(1) à n'importe quel nœud. |
| Operational Transform | OT | Algorithme de collaboration temps réel transformant les opérations pour maintenir la cohérence, alternative au CRDT. Plus précis mais plus complexe à scaler. |
| Optimistic UI | — | Stratégie UX appliquant les mutations locales immédiatement sans attendre la confirmation du serveur, avec réconciliation asynchrone si nécessaire. |
| Row-Level Security | RLS | Fonctionnalité PostgreSQL permettant de restreindre automatiquement l'accès aux lignes d'une table selon des critères applicatifs (ex: organization_id). |
| Signal | — | Primitive réactive fondamentale : variable dont tout changement de valeur propage automatiquement les recalculs à tous ses abonnés (Computeds, Effects). |
| Scheduler | — | Composant du runtime gérant l'ordonnancement des recalculs (batching, microtask queue, tri topologique, priorisation). |
| Snapshot | — | Capture complète et sérialisée de l'état d'un document AST à un instant T, permettant la restauration et la réduction du coût de replay CRDT. |
| Topological Sort | — | Ordonnancement des nœuds d'un graphe de dépendances garantissant qu'un nœud est toujours traité après toutes ses dépendances. |
| Write-Ahead Log | WAL | Stratégie de persistance écrivant chaque opération dans un log avant de l'appliquer à l'état courant, garantissant la durabilité même en cas de crash. |
| Y.Doc | — | Document Yjs : conteneur racine des structures de données CRDT d'un document. |
| Y.Map | — | Structure de données Yjs équivalente à un Map JavaScript, avec fusion automatique des modifications concurrentes. |
| Y.Array | — | Structure de données Yjs équivalente à un Array JavaScript, avec gestion des insertions et suppressions concurrentes par CRDT. |
| Yjs | — | Bibliothèque JavaScript implémentant le CRDT. Utilisée par ECOSYT pour la synchronisation temps réel des NodeMaps AST. |
| Role-Based Access Control | RBAC | Modèle d'autorisation associant des permissions à des rôles (Owner, Admin, Editor, Viewer) plutôt qu'à des utilisateurs individuels. |
| Domain-Driven Design | DDD | Approche de conception logicielle centrant l'architecture sur le domaine métier et ses invariants. NestJS facilite cette approche via ses modules. |
| SaaS | — | Software as a Service. Modèle de distribution logicielle où l'application est hébergée et maintenue par le fournisseur, accessible via abonnement. |

---

*Fin du document — ECOSYT Architecture Specification v2.0*
*Document complet — 8 Parties — 40 sections*

*Ce document est un livrable vivant. Il doit être mis à jour à chaque décision architecturale significative (ADR), à chaque fin de phase de développement, et lors de tout changement de périmètre fonctionnel.*

*Prochaine révision planifiée : fin de Phase 1 (AST)*
