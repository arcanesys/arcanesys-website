---
title: "NixFleet — Sovereign Infrastructure for Europe"
---

## 01 The Problem

European infrastructure faces four simultaneous crises:

### Sovereignty

Jamf, Intune, AWX, AWS SSM make your infrastructure a dependency of a US cloud. Cloud Act exposure, opaque internals, proprietary formats. Your ability to deploy depends on their availability.

### Security

Traditional tools stack layers (antivirus, EDR, SIEM, scanners) that observe but never change system properties. Drift, threat persistence, approximate SBOMs, unverified binaries.

### Reproducibility

Ansible, Puppet describe *actions to perform*, not *states to reach*. The outcome depends on pre-existing state. Configuration drift is structurally inevitable.

### Compliance

NIS2, DORA, ISO 27001, ANSSI: traceability, rapid recovery, supply chain security. NIS2 alone covers 15,000+ French entities, deadline end of 2027, fines up to €10M. **Personal liability for executives.**

> **The audit gap:** standard tools manage *desired* state but cannot prove *actual* state. Verifying that a system matches its policy requires a separate audit tool, a separate agent, and trust in the runtime environment. NixFleet closes this gap structurally.

---

## 02 The Solution

NixFleet transforms NixOS's mathematical guarantees — reproducibility, atomicity, traceability — into an enterprise fleet management platform, compliant by construction (NIS2, DORA, ISO 27001, ANSSI) and 100% self-hosted.

| Metric | Value |
|--------|-------|
| Fleet-wide rollback | <90s |
| Compliance controls | 16 |
| Cost reduction | 3-5x |
| Self-hosted | 100% |
| Prototype | TRL 5 validated |

### Nix Framework

Single `mkHost` API to declare an entire fleet in one `flake.nix`. 11 scopes auto-activate. No proprietary DSL — standard NixOS.

### Rust Control Plane

Central server: fleet state, rollout orchestration (canary, staged, all-at-once), full audit trail. mTLS + API key authentication.

### Rust Agent

Autonomous binary on each host. Pull model (polling). State machine with health checks and automatic rollback on failure. Works even if the control plane is temporarily down.

### Compliance

16 control modules across 4 frameworks (NIS2, DORA, ISO 27001, ANSSI BP-028) with enforce + prove pattern. NIS2 preset (essential/important). Automatic evidence collection. Works with or without NixFleet.

---

## 02b What We Built

NixFleet is not a research project or a vision. It is a working product, tested, with production-ready security.

| Component | Status | Detail |
|-----------|--------|--------|
| Nix Framework (`mkHost`) | Working | Simplified API, 11 auto-activating scopes, flake templates |
| Rust Control Plane | Working | Axum, SQLite, HTTPS, mTLS, rollouts, audit trail |
| Rust Agent | Working | State machine, polling, health checks, auto-rollback |
| Rust CLI | Working | bootstrap, deploy, status, rollout, policy, schedule |
| Security | Production-ready | mTLS agent-CP, API keys SHA-256 (RBAC), mandatory HTTPS |
| Compliance | 16 active controls | 4 frameworks (NIS2, DORA, ISO 27001, ANSSI BP-028), automatic evidence collector |
| Tests | 143+ tests | Rust unit, VM fleet (canary mTLS), compliance end-to-end, Nix eval |
| Documentation | Complete | mdbook, getting started, architecture, API reference |

---

## 02c Why NixFleet vs NixOS Alone?

NixOS provides the foundational guarantees. NixFleet adds everything needed to go from a well-configured server to an **enterprise-managed fleet**:

| Capability | NixOS Alone (DIY) | With NixFleet |
|------------|-------------------|---------------|
| Fleet deployment | Manual SSH or Colmena (push) | **Autonomous agent (pull), works through firewalls** |
| Progressive rollout | None — all or nothing | **Canary, staged %, health-gated** |
| Rollback | Manual, host by host | **Automatic on health check failure, fleet-wide <90s** |
| Fleet visibility | No centralized view | **Real-time state of every host via control plane** |
| Security | Configure it yourself | **mTLS + API keys + HTTPS built-in, zero config** |
| Compliance | Considerable manual effort | **16 controls enabled in 1 line (NIS2, DORA, ISO 27001, ANSSI), automatic evidence** |
| Audit trail | Non-existent | **Full log with actor identity, CSV/JSON export** |
| Support | Community (best-effort) | **SLA, dedicated support, compliance expertise** |

> **In short:** NixOS ensures each machine is correct. NixFleet ensures the *entire fleet* is correct, visible, auditable, and compliant — with commercial support and regulatory expertise.

---

## 03 Architecture

The system is structured in four layers, each building on the one below:

**Layer 1 — Declaration**
`flake.nix` · `mkHost` per machine · `flake.lock` (SHA-256 pinned)

**Layer 2 — Binary Cache**
Attic · self-hosted · S3-compatible

**Layer 3 — Control and Operations**

| Node | Role | Auth |
|------|------|------|
| Rust CLI | Operator interface | API keys → |
| Control Plane (Axum · SQLite · Rollouts · Audit) | Fleet state and orchestration | central |
| Rust Agent ×N (Polling · Health check · Auto-rollback) | Per-host execution | ← mTLS |

**Layer 4 — NixOS Machines**
`web-01` · `db-01` · `edge-01` · `...`

> **Security:** mTLS between each agent and the control plane (per-host client certificate). SHA-256 scoped API keys (readonly/deploy/admin) for operators. Mandatory HTTPS in production. The Nix store is content-addressed — a modified binary is physically impossible to substitute.

---

## 04 Compliance

NixFleet Compliance covers **4 frameworks** (NIS2, DORA, ISO 27001, ANSSI BP-028) with **16 control modules**, each following the **enforce + prove** pattern: enforce the control at the infrastructure layer, then emit machine-readable evidence. The NIS2 Directive (Article 21) defines 10 categories of measures — all 10 are covered. A preset adjusts thresholds based on `entityType = essential | important`.

| NIS2 Obligation | Traditional Approach | NixFleet |
|-----------------|---------------------|----------|
| Change traceability | SIEM + separate tools (+€30k/yr) | **Every change = signed Git commit** |
| Incident recovery <24h | Manual runbooks, uncertain outcome | **Atomic rollback < 90 seconds** |
| Supply chain security | Separate SBOM tools, manual integration | **Auto-generated SBOM from flake.lock** |
| Cryptography (Art. 21h) | Per-system manual config, inconsistent | **LUKS + mTLS + TLS policy, fleet-wide** |
| Access control (Art. 21i) | Separate IAM, manual CMDB | **SSH hardening + access audit built-in** |
| Asset inventory | Expensive CMDB, often inaccurate | **Complete inventory in nixosConfigurations** |

> **Compliance is a by-product of the architecture, not an additional effort.** The Nix configuration IS the security policy. An auditor reading the Nix expression knows exactly what is enforced — no gap between documentation and reality.

---

## 05 Competitive Advantage

| Capability | Ansible / Puppet | Jamf / Intune | Colmena | NixFleet |
|------------|-----------------|---------------|---------|---------|
| Bitwise reproducibility | No | No | Yes | Yes |
| Full sovereignty (self-hosted) | Partial | No | Yes | Yes |
| Commercial support / SLA | Yes | Yes | No | Yes |
| Atomic fleet rollback | No | No | No | Yes |
| Built-in compliance (4 frameworks) | No | No | No | Yes |
| Rollout strategies | Manual | Limited | No | Yes |
| Evidence collection | No | Partial | No | Yes |

---

## 06 Market

### Primary Target

European SMBs and mid-market enterprises (50–500 employees) subject to NIS2, without dedicated compliance teams. These organizations face regulatory pressure but lack the budget and staff to stack traditional tools.

### Priority Verticals

- **Public sector** — sovereignty mandate, ANSSI/BSI
- **Finance** — NIS2 + DORA, operational resilience
- **Energy / Telecom** — critical infrastructure
- **Research / HPC** — reproducibility, large fleets
- **Tech startups** — rapid growth, small infra teams

### Geographies

| Country | Opportunity |
|---------|------------|
| France | 15,000+ NIS2 entities, largest EU market |
| Germany | BSI sovereignty mandate |
| Netherlands | Strong NixOS community |
| Belgium | EU institutions headquarters |
| Switzerland | Finance, pharma, neutrality |
| Nordics | High digital maturity |

### Cost Comparison (200 machines/year)

| Solution | Cost |
|----------|------|
| Ansible + AWX + compliance | €80–150k |
| Jamf / Intune | €40–100k |
| **NixFleet Pro** | **€6–36k** |

---

## 07 Business Model

**Open-core** model: the engine is open source (MIT/AGPL), commercial value lies in enterprise orchestration and compliance expertise. Clients never depend on NixFleet — if they leave, their Nix configuration works without us.

### Pricing Tiers

| Tier | Price | Target |
|------|-------|--------|
| Community | Free | < 10 machines |
| Pro | €499–2,999/mo | 10–200 machines, SMBs |
| Enterprise | €50–500k/yr | 200+ machines |
| Sovereign | Custom | Government, defense |

### Services

| Service | Description |
|---------|-------------|
| NIS2 Audit | Gap analysis + remediation plan |
| Pilot | Audit + deployment on 5–10 machines |
| Migration | Transition from Ansible/Puppet |
| Training | Nix/NixOS for infrastructure teams |

---

## 08 Project Status

| Status | Phase | Description |
|--------|-------|-------------|
| Done | Phase 0–4 | Nix simplification, Rust hardening (mTLS, audit), fleet orchestration, infra modules, compliance framework |
| In progress | Phase 5 | Open source launch: documentation, templates, public repos |
| Next | Phase 6 | Outreach and pilots: ANSSI, consulting partners, Horizon Europe, 3 pilots |
| Blocked | Phase 7 | Enterprise: multi-tenant, RBAC, dashboard — pending pilot feedback |

**By the numbers:** ~35.7k lines of code (24.7k source + 11k tests) · 12 VM fleet scenarios · 23 API endpoints

---

## 09 What We're Looking For

### Early Adopters

NIS2-regulated operators (5–10 machines) for a free 3-month pilot. You get the audit + deployment, we get a real-world use case.

### Consulting Partners

Firms with NIS2/DORA expertise (Capgemini, Wavestone, Deloitte). Co-pilot model: your regulatory expertise + our platform.

### Research Partners

Horizon Europe CL3 consortium (deadline Sept. 2026). Formal verification, security audit, compliance research.

**Free pilot program — deploy your first NixFleet in 15 minutes**
[github.com/arcanesys](https://github.com/arcanesys) · [contact@arcanesys.fr](mailto:contact@arcanesys.fr)
