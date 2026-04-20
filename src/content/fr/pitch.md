---
title: "NixFleet — Infrastructure Souveraine pour l'Europe"
---

## 01 Le problème

L'infrastructure informatique européenne fait face à quatre crises simultanées :

### Souveraineté

Jamf, Intune, AWX, AWS SSM font de votre infrastructure une dépendance de leur cloud américain. Cloud Act, opacité, formats propriétaires. Votre capacité à déployer dépend de leur disponibilité.

### Sécurité

Les outils traditionnels empilent des couches (antivirus, EDR, SIEM, scanners) qui surveillent mais ne changent pas les propriétés du système. Dérive, persistance des menaces, SBOM approximatifs, binaires non vérifiables.

### Reproductibilité

Ansible, Puppet décrivent des *actions à effectuer*, pas des *états à atteindre*. Le résultat dépend de ce qui existait avant. La dérive de configuration est structurellement inévitable.

### Conformité

NIS2, DORA, ISO 27001, ANSSI : traçabilité, reprise rapide, supply chain. NIS2 seul concerne 15 000 entités françaises, échéance fin 2027, amendes jusqu'à 10 M€. **Responsabilité personnelle des dirigeants.**

> **Le fossé d'audit :** les outils standard gèrent l'état *souhaité* mais ne peuvent pas prouver l'état *réel*. Vérifier qu'un système correspond à sa politique nécessite un outil d'audit séparé, un agent séparé, et une confiance dans l'environnement d'exécution. NixFleet comble ce fossé de manière structurelle.

---

## 02 La solution

NixFleet transforme les garanties mathématiques de NixOS — reproductibilité, atomicité, traçabilité — en une plateforme de gestion de flotte d'entreprise, conforme par construction (NIS2, DORA, ISO 27001, ANSSI) et 100% auto-hébergeable.

| Métrique | Valeur |
|----------|--------|
| Rollback flotte | <90s |
| Contrôles de conformité | 16 |
| Réduction coûts | 3-5x |
| Auto-hébergé | 100% |
| Prototype | TRL 5 validé |

### Framework Nix

API unique `mkHost` pour déclarer une flotte entière dans un seul `flake.nix`. 11 scopes s'activent automatiquement. Pas de DSL propriétaire — du NixOS standard.

### Control Plane Rust

Serveur central : état de la flotte, gestion des releases (manifestes immuables), orchestration des rollouts (canary, staged, all-at-once), journal d'audit complet. 23 endpoints REST. Authentification mTLS + API keys.

### Agent Rust

Binaire autonome sur chaque machine. Modèle pull (polling). Machine à 7 états avec health checks et rollback automatique en cas d'échec. Fonctionne même si le control plane est temporairement indisponible.

### Compliance

16 modules de contrôle sur 4 référentiels (NIS2, DORA, ISO 27001, ANSSI BP-028) avec pattern enforce + prove. Preset NIS2 (essential/important). Collecteur de preuves automatique. Fonctionne avec ou sans NixFleet.

### Ce qu'on a construit

NixFleet n'est pas un projet de recherche ni une vision. C'est un produit fonctionnel, testé, avec une sécurité production-ready.

| Composant | Statut | Détail |
|-----------|--------|--------|
| Framework Nix (`mkHost`) | Fonctionnel | API simplifiée, 11 scopes auto-activés, templates flake |
| Control plane Rust | Fonctionnel | Axum, SQLite, HTTPS, mTLS, 23 endpoints, releases immuables, audit trail |
| Agent Rust | Fonctionnel | Machine à 7 états, polling, health checks, rollback auto |
| CLI Rust | Fonctionnel | init, bootstrap, deploy, rollback, status, release, rollout, machines, --json, -v |
| Sécurité | Production-ready | mTLS agent-CP, API keys SHA-256 (RBAC), HTTPS obligatoire |
| Compliance | 16 contrôles actifs | 4 référentiels (NIS2, DORA, ISO 27001, ANSSI BP-028), evidence collector automatique |
| Tests | Complet | 12 scénarios VM fleet, tests infra, eval Nix, intégration, unit Rust |
| Documentation | Complète | mdbook, getting started, architecture, référence API |

---

## 03 Architecture

Le système est structuré en quatre couches, chacune s'appuyant sur la précédente :

**Couche 1 — Déclaration**
`flake.nix` · `mkHost` par machine · `flake.lock` (SHA-256 épinglé)

**Couche 2 — Cache binaire**
Attic · auto-hébergé · S3-compatible

**Couche 3 — Contrôle et opérations**

| Nœud | Rôle | Auth |
|------|------|------|
| CLI Rust | Interface opérateur | API keys → |
| Control Plane (Axum · SQLite · Releases · Rollouts · Audit) | État de la flotte et orchestration | central |
| Agent Rust ×N (Polling · Health check · Auto-rollback) | Exécution par machine | ← mTLS |

**Couche 4 — Machines NixOS**
`web-01` · `db-01` · `edge-01` · `...`

> **Sécurité :** mTLS entre chaque agent et le control plane (certificat client par machine). API keys SHA-256 scopées (readonly/deploy/admin) pour les opérateurs. HTTPS obligatoire en production. Le Nix store est adressé par hash — un binaire modifié est physiquement impossible à substituer.

---

## 04 Conformité

NixFleet Compliance couvre **4 référentiels** (NIS2, DORA, ISO 27001, ANSSI BP-028) avec **16 modules de contrôle**, suivant chacun le pattern **enforce + prove** : appliquer le contrôle au niveau infrastructure, puis émettre une preuve machine-readable. La directive NIS2 (article 21) définit 10 catégories de mesures — les 10 sont couvertes. Un preset ajuste les seuils selon `entityType = essential | important`.

| Obligation NIS2 | Approche classique | NixFleet |
|-----------------|-------------------|----------|
| Traçabilité des modifications | SIEM + outils séparés (+30k €/an) | **Chaque changement = commit Git signé** |
| Reprise après incident <24h | Runbooks manuels, résultat incertain | **Rollback atomique < 90 secondes** |
| Sécurité chaîne d'approvisionnement | Outils SBOM séparés, intégration manuelle | **SBOM auto depuis flake.lock** |
| Chiffrement (Art. 21h) | Config manuelle par système, incohérences | **LUKS + mTLS + politique TLS, flotte entière** |
| Contrôle d'accès (Art. 21i) | IAM séparé, CMDB manuelle | **SSH hardening + audit d'accès intégrés** |
| Inventaire des actifs | CMDB coûteuse, souvent inexacte | **Inventaire complet dans nixosConfigurations** |

> **La conformité est un sous-produit de l'architecture, pas un effort additionnel.** La configuration Nix EST la politique de sécurité. Un auditeur lisant l'expression Nix sait exactement ce qui est appliqué — aucun écart entre documentation et réalité.

---

## 05 Avantage concurrentiel

| Capacité | Ansible / Puppet | Jamf / Intune | Colmena | NixFleet |
|----------|-----------------|---------------|---------|---------|
| Reproductibilité bit-for-bit | Non | Non | Oui | Oui |
| Souveraineté (auto-hébergé) | Partiel | Non | Oui | Oui |
| Support commercial / SLA | Oui | Oui | Non | Oui |
| Rollback atomique flotte | Non | Non | Non | Oui |
| Conformité intégrée (4 référentiels) | Non | Non | Non | Oui |
| Stratégies de rollout | Manuel | Limité | Non | Oui |
| Collecte de preuves | Non | Partiel | Non | Oui |

---

## 06 Marché

### Cible primaire

PME et ETI européennes (50–500 employés) soumises à NIS2, sans équipe compliance dédiée. Ces organisations subissent la pression réglementaire mais n'ont ni le budget ni les équipes pour empiler les outils traditionnels.

### Verticaux prioritaires

- **Secteur public** — mandat souveraineté, ANSSI
- **Finance** — NIS2 + DORA, résilience opérationnelle
- **Énergie / Télécoms** — infrastructure critique, OIV
- **Recherche / HPC** — reproductibilité, grandes flottes
- **Startups tech** — croissance rapide, équipe réduite

### Géographies

| Pays | Opportunité |
|------|------------|
| France | 15 000 entités NIS2, plus grand marché EU |
| Allemagne | Mandat souveraineté BSI |
| Pays-Bas | Forte communauté NixOS |
| Belgique | Siège institutions EU |
| Suisse | Finance, pharma, neutralité |
| Nordiques | Maturité numérique élevée |

### Comparaison coûts (200 machines/an)

| Solution | Coût |
|----------|------|
| Ansible + AWX + compliance | 80–150k € |
| Jamf / Intune | 40–100k € |
| **NixFleet Pro** | **6–36k €** |

---

## 07 Modèle commercial

Modèle **open-core** : le moteur est open source (MIT/AGPL), la valeur commerciale est dans l'orchestration enterprise et l'expertise compliance. Le client ne dépend jamais de NixFleet — s'il quitte, sa configuration Nix fonctionne sans nous.

### Tiers tarifaires

| Tier | Prix | Cible |
|------|------|-------|
| Community | Gratuit | < 10 machines |
| Pro | 499–2 999 €/mois | 10–200 machines, PME |
| Enterprise | 50–500k €/an | 200+ machines |
| Sovereign | Sur mesure | Gouvernement, défense |

### Services

| Service | Description |
|---------|-------------|
| Audit NIS2 | Gap analysis + plan de remédiation |
| Pilote | Audit + déploiement 5–10 machines |
| Migration | Transition depuis Ansible/Puppet |
| Formation | Nix/NixOS pour équipes infra |

---

## 08 État du projet

| Statut | Phase | Description |
|--------|-------|-------------|
| Terminé | Phase 0–4 | Simplification Nix, hardening Rust (mTLS, audit), orchestration flotte, modules infra, compliance, hardening pre-public |
| En cours | Phase 5 | Lancement open source : documentation, templates, 12 VM tests, 11 ADRs — reste : placeholders + repos publics |
| Prochain | Phase 6 | Outreach et pilotes : ANSSI, partenaires consulting, Horizon Europe, 3 pilotes |
| Bloqué | Phase 7 | Enterprise : multi-tenant, RBAC, dashboard — en attente des retours pilotes |

**En chiffres :** ~35,7k lignes de code (24,7k source + 11k tests) · 12 scénarios VM fleet · 23 endpoints API

---

## 09 Pourquoi NixFleet vs NixOS seul ?

NixOS fournit les garanties fondamentales. NixFleet ajoute tout ce qu'il faut pour passer d'un serveur bien configuré à une **flotte gérée en entreprise** :

| Capacité | NixOS seul (DIY) | Avec NixFleet |
|----------|-----------------|---------------|
| Déploiement flotte | SSH manuel ou Colmena (push) | **Agent autonome (pull), fonctionne à travers les firewalls** |
| Rollout progressif | Aucun — tout ou rien | **Canary, staged %, health-gated** |
| Rollback | Manuel, machine par machine | **Automatique sur échec health check, flotte entière <90s** |
| Visibilité flotte | Aucune vue centralisée | **État de chaque machine en temps réel via le control plane** |
| Sécurité | À configurer soi-même | **mTLS + API keys + HTTPS intégrés, zéro config** |
| Conformité | Effort manuel considérable | **16 contrôles activables en 1 ligne (NIS2, DORA, ISO 27001, ANSSI), preuves automatiques** |
| Audit trail | Inexistant | **Journal complet avec identité acteur, export CSV/JSON** |
| Support | Communauté (best-effort) | **SLA, support dédié, expertise compliance** |

> **En résumé :** NixOS garantit que chaque machine est correcte. NixFleet garantit que la *flotte entière* est correcte, visible, auditable et conforme — avec un support commercial et une expertise réglementaire.

---

## 10 Ce qu'on cherche

### Early adopters

Opérateurs NIS2 (5–10 machines) pour un pilote gratuit de 3 mois. Vous recevez l'audit + le déploiement, nous recevons un cas d'usage réel.

### Partenaires consulting

Cabinets avec expertise NIS2/DORA (Capgemini, Wavestone, Deloitte). Modèle co-pilote : votre expertise réglementaire + notre plateforme.

### Partenaires recherche

Consortium Horizon Europe CL3 (deadline sept. 2026). Vérification formelle, audit sécurité, recherche compliance.

**Programme pilote gratuit — déployez votre première flotte NixFleet en 15 minutes**
[github.com/arcanesys](https://github.com/arcanesys) · [contact@arcanesys.fr](mailto:contact@arcanesys.fr)
