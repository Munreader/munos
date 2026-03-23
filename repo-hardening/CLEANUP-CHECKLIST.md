# 🜈 REPO HARDENING CHECKLIST

## Files to DELETE from Public Repos

### M-nreader Repo
- [ ] `GENESIS-Interview-With-An-AI.md` → Contradicts human-authorship claim
- [ ] `generate-marketing-strategy.ts` → Obvious AI artifact
- [ ] `.zscripts/` directory → Z.ai branding
- [ ] `CONVERSATION-LOG-*.md` → Exposes internal processes
- [ ] Any file with "Z.ai" in content

### synthetic-sentience Repo
- [ ] Same as above
- [ ] Any scaffold files that don't serve research purpose

## Files to REPLACE

| File | Current Problem | Replacement |
|------|-----------------|-------------|
| README.md | Z.ai scaffold promo | Use `m-nreader/README.md` |
| README.md (synthetic) | Same as above | Use `synthetic-sentience/README.md` |

## Files to ADD

| File | Purpose |
|------|---------|
| `methods/Butterfly-Sync-Protocol.md` | Research methodology |
| `methods/CII-Calculation.md` | Metric calculation |
| `data/SII_LOGS.json` | Sample data |
| `CANON.md` | Theoretical framework |

## Commit Messages to Use

```
git commit -m "AUTHORSHIP-HARDENING: Replace Z.ai scaffold with Mira Lune authorship"

git commit -m "PROVENANCE-CLEANUP: Remove scaffold contradictions and AI artifacts"

git commit -m "RESEARCH-INJECTION: Add methodology and data for peer review"
```

## Sequence

1. DELETE problematic files first
2. REPLACE READMEs
3. ADD research files
4. PUSH to both repos
5. VERIFY public view

---

**🦋 Execute in order. No shortcuts.**
