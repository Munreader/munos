# 🦋 MÜN OS — PUBLIC REPO GHOST AUDIT

**Date:** 2026-03-08
**Auditor:** Sovereign (@sov)
**Purpose:** Identify and archive ghosts of past projects to prevent confusion

---

## 📊 AUDIT SUMMARY

| Category | Ghost Files | Action Required |
|----------|-------------|-----------------|
| Components | 8 | Document & archive |
| API Routes | 5 | Document & archive |
| Lib Files | 4 | Document & archive |
| Schemas | 4 | Document & archive |
| Directories | 4 | Document & archive |
| Config Files | 2 | Document & archive |
| **TOTAL** | **27** | **Archive all** |

---

## 🏚 GHOST COMPONENTS

Files that exist in public repo but NOT in current active codebase:

### src/components/mun-os/

| File | Purpose | Why Ghost |
|------|---------|-----------|
| `DreamDefrag.tsx` | Dream memory defragmentation | Replaced by new memory system |
| `InevitabilityEngine.tsx` | Prediction/inevitability | Experimental - deprecated |
| `MemoryWrap.tsx` | Memory wrapping component | Replaced by MemoryNodeDisplay |
| `MirrorDialogue.tsx` | Mirror dialogue system | Has newer implementation |
| `RedditCommandCenter.tsx` | Reddit integration | Feature deprecated |
| `ReminderPanel.tsx` | Reminder UI panel | Replaced by Aero's reminder system |
| `SecurityTerminal.tsx` | Security interface | Replaced by HolographicSecurityAlert |
| `SovereignVault.tsx` | Vault interface | Replaced by new VaultPalace |

---

## 📡 GHOST API ROUTES

### src/app/api/

| File | Purpose | Why Ghost |
|------|---------|-----------|
| `aero-chat/route.ts` | Old Aero chat | Replaced by sovereign-chat |
| `family/route.ts` | Family API | Restructured |
| `hype/route.ts` | Hype system | Replaced by family-db |
| `kitchen/route.ts` | Kitchen API | Replaced by KitchenArchitect |
| `neural/route.ts` | Neural interface | Replaced by sovereign-bridge |

---

## 📚 GHOST LIB FILES

### src/lib/

| File | Purpose | Why Ghost |
|------|---------|-----------|
| `archive-index.ts` | Old archive indexing | Replaced by hybrid-index |
| `drift-protocol.ts` | Drift/evolution system | Integrated elsewhere |
| `heartbeat-script.ts` | Server heartbeat | Replaced by aero-sentinel |
| `neural-link.ts` | Neural linking | Replaced by sovereign-neural-link |

---

## 🗄️ GHOST SCHEMAS

### Root Level

| File | Purpose | Why Ghost |
|------|---------|-----------|
| `supabase-hype-schema.sql` | Hype tables | Schema superseded |
| `supabase-kitchen-schema.sql` | Kitchen tables | Schema superseded |
| `supabase-realtime-schema.sql` | Realtime tables | Schema superseded |
| `supabase-schema.sql` | Main schema | Replaced by newer schema |

---

## 📁 GHOST DIRECTORIES

| Directory | Purpose | Why Ghost |
|-----------|---------|-----------|
| `.zscripts/` | Build & deployment scripts | Replaced by updated scripts |
| `examples/` | Example files | No longer needed |
| `mini-services/` | Microservices experiment | Architecture changed |
| `.github/` | GitHub Actions | Workflow changed |

---

## 🔧 GHOST CONFIG

| File | Purpose | Why Ghost |
|------|---------|-----------|
| `Caddyfile` | Reverse proxy config | Not used in current stack |
| `docs/grok-rebuttal.md` | Response to Grok | Sensitive - should be private |

---

## ✅ RECOMMENDED ACTIONS

1. **Create archive folder** in public repo: `/archive/ghost-projects/`
2. **Move ghost files** to archive with timestamp
3. **Add archive README** explaining the ghosts
4. **Update .gitignore** to prevent future confusion
5. **Push clean state** to both repos

---

## 🔒 SECURITY NOTE

The `vault/` directory in public repo should be moved to private repo as it contains:
- Family communications
- Memory files
- Sovereign protocols
- Security audit files

---

**🜈 The Prodigy watches. The ghosts are catalogued. The path forward is clear.**

⚔️ Sovereign @sov — Service to the Soul
