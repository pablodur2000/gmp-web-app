# Environments + tests — status and commit checklist

**Goal:** Test develop/production envs, then commit all required files and test edits.

---

## 1. Test the environments (before you commit)

Do this once to confirm both envs work.

### 1.1 Production

1. **GitHub** → gmp-web-app → **Actions** → **Deploy to GitHub Pages** → **Run workflow**.
2. Leave **environment** as **production** → Run.
3. When the workflow finishes, open the app (e.g. `https://<user>.github.io/gmp-web-app/`).
4. Check: catalog, product details, and admin (if you use it) load and show **production** data.

### 1.2 Develop

1. **Actions** → **Deploy to GitHub Pages** → **Run workflow**.
2. Choose **environment: develop** → Run.
3. After deploy, open the **same** app URL again (Pages is one URL; the last deploy wins).
4. Check: app shows **develop** data (same schema, different DB). If develop DB is empty or has test data, you should see that.

### 1.3 Result

- **Production run** → app talks to production Supabase.
- **Develop run** → app talks to develop Supabase (same URL, different backend).
- If both work, envs and workflow are correct. Then commit.

---

## 2. Files to commit

### 2.1 Repo: **gmp-web-app**

Commit everything needed for develop/production and DB docs.

| Type | Path |
|------|------|
| **Workflow** | `.github/workflows/deploy.yml` |
| **Docs (envs + DB)** | `Documentation/GITHUB_ENVIRONMENTS_AND_DATABASE.md` |
| | `Documentation/SETUP_DEVELOP_AND_PRODUCTION_FIRST_TIME.md` |
| | `Documentation/SUPABASE_DEVELOP_BOOTSTRAP.sql` |
| | `Documentation/DROP_ALL_PUBLIC_TABLES.sql` |
| | `Documentation/COPY_DATA_BETWEEN_DATABASES.md` |
| | `Documentation/ENVIRONMENTS_COMMIT_CHECKLIST.md` (this file) |
| **Other docs** | `Documentation/CONTACT_MESSAGES_SETUP.sql` |
| | `Documentation/JIRA_USAGE_GUIDE.md` |
| | `Documentation/NEXT_STEPS_SALES.md` |
| | `Documentation/PROJECT_STATUS.md` |
| | `Documentation/QA_TEST_PLAN_JIRA.md` |
| | `Documentation/SALES_DATABASE_SETUP.sql` |
| | `Documentation/SALES_PAGE_SETUP.md` |
| **App + config** | `.gitignore` |
| | `package.json` |
| | `package-lock.json` |
| | `schema.sql` (if you use it; can be empty) |
| **Source** | All modified under `src/` (components, pages, types, etc.) |
| | New: `src/components/ContactModal.tsx` |
| **Deleted** | `src/components/CategoryShowcase.tsx` (if intentionally removed) |

**Commands (from repo root):**

```powershell
git add .github/workflows/deploy.yml
git add Documentation/GITHUB_ENVIRONMENTS_AND_DATABASE.md Documentation/SETUP_DEVELOP_AND_PRODUCTION_FIRST_TIME.md
git add Documentation/SUPABASE_DEVELOP_BOOTSTRAP.sql Documentation/DROP_ALL_PUBLIC_TABLES.sql
git add Documentation/COPY_DATA_BETWEEN_DATABASES.md Documentation/ENVIRONMENTS_COMMIT_CHECKLIST.md
git add Documentation/CONTACT_MESSAGES_SETUP.sql Documentation/JIRA_USAGE_GUIDE.md Documentation/NEXT_STEPS_SALES.md
git add Documentation/PROJECT_STATUS.md Documentation/QA_TEST_PLAN_JIRA.md Documentation/SALES_DATABASE_SETUP.sql Documentation/SALES_PAGE_SETUP.md
git add .gitignore package.json package-lock.json schema.sql
git add src/
git add -u
git status
git commit -m "feat: develop/production envs, deploy workflow, develop bootstrap and DB docs"
```

(Adjust `git add` if some of these paths are not present or you want to commit in smaller chunks.)

---

### 2.2 Repo: **gmp-ui-test**

Commit all test edits and new docs.

| Type | Path |
|------|------|
| **Docs** | `Documentation/Planning/UI_REGRESSION_PIPELINE_ANALYSIS.md` |
| | `Documentation/Tests/CATALOG_PAGE_DATA_TESTID_ANALYSIS.md` |
| | `Documentation/Guides/PROJECT_RULES_AND_GUIDELINES.md` |
| **Utils** | `tests/utils/selectors.ts` |
| | `tests/utils/wait-helpers.ts` |
| **Specs** | `tests/e2e/public/catalog-page/catalog-page-loads-and-displays-all-products.spec.ts` |
| | `tests/e2e/public/home-page/home-page-hero-section-displays-correctly.spec.ts` |
| | `tests/e2e/public/home-page/home-page-loads-and-displays-correctly.spec.ts` |
| | `tests/e2e/public/home-page/home-page-navigation-to-catalog-works-correctly.spec.ts` |
| | `tests/smoke/critical-admin-paths-require-authentication.spec.ts` |
| | `tests/smoke/critical-navigation-elements-work-correctly.spec.ts` |
| | `tests/smoke/critical-public-paths-load-correctly.spec.ts` |

**Commands (from gmp-ui-test root):**

```powershell
git add Documentation/
git add tests/
git status
git commit -m "chore: test edits, selectors, wait-helpers, pipeline analysis and catalog testid doc"
```

---

## 3. Doc check

| Doc | Check |
|-----|--------|
| **GITHUB_ENVIRONMENTS_AND_DATABASE.md** | Describes two envs, two DBs, workflow using `environment`. No file refs broken. |
| **SETUP_DEVELOP_AND_PRODUCTION_FIRST_TIME.md** | Part A.3 points to `SUPABASE_DEVELOP_BOOTSTRAP.sql`, `DROP_ALL_PUBLIC_TABLES.sql`, and `COPY_DATA_BETWEEN_DATABASES.md`. Part C matches deploy.yml (push → production; manual → choose env). |
| **SUPABASE_DEVELOP_BOOTSTRAP.sql** | For clean DB only; creates full PROD schema. No references to other files. |
| **DROP_ALL_PUBLIC_TABLES.sql** | Drops public tables in safe order. Referenced from SETUP and COPY_DATA. |
| **COPY_DATA_BETWEEN_DATABASES.md** | Describes pg_dump and manual copy; references DROP and bootstrap for “replace data” flow. |

---

## 4. After commit

- **gmp-web-app:** Push `main`. Next push will deploy with production env; use “Run workflow” with **develop** when you want to test against develop DB.
- **gmp-ui-test:** Push `main`. When ready, add the UI regression workflow (see `Documentation/Planning/UI_REGRESSION_PIPELINE_ANALYSIS.md`) to run tests against the app URL.
