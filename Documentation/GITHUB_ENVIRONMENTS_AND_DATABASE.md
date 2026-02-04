# GitHub Environments (develop + production) and Database Strategy

**Repo:** gmp-web-app  
**Goal:** Use two GitHub Environments (develop, production) and understand how the database works across them.

---

## 1. Is it a good idea to add develop + production first?

**Yes.** Doing it before the UI regression pipeline is the right order:

1. **Environments** define *where* the app runs and *which* config (e.g. DB) it uses.
2. **Deploy workflow** can then deploy to “develop” or “production” and use the right DB per environment.
3. **UI test pipeline** (in gmp-ui-test) can later run against “develop” or “production” URL, matching the same two environments.

So: **first** set up develop + production in GitHub and in the deploy workflow; **then** point the regression pipeline at those URLs.

---

## 2. What are GitHub Environments?

Environments are **names** (e.g. `develop`, `production`) that you use in workflows. For each environment you can:

- Store **variables** (e.g. `VITE_SUPABASE_URL`) and **secrets** (e.g. `VITE_SUPABASE_ANON_KEY` if you treat it as secret).
- Add **protection rules** (e.g. “production” requires an approval before deploy).
- Optionally restrict which branches can use which environment.

Your workflow then runs a job with `environment: develop` or `environment: production`, and that job gets that environment’s variables/secrets.

**Where to create them:**  
Repo **Settings** → **Environments** → **New environment** → create `develop` and `production`.

---

## 3. How to handle the database across develop and production

### Rule: one database per environment

- **Develop** → its own Supabase project (or schema), with its own URL and anon key.
- **Production** → your current Supabase project, with its own URL and anon key.

You **do not** share one database between develop and production. Reasons:

- Develop can have test data, experiments, and breaking changes without affecting real users.
- You can test migrations and new features on develop first.
- Production stays isolated and stable.

So “how we handle the db across?” = **we use two separate DBs and two sets of credentials.**

---

## 4. What you need in practice

### 4.1 Two Supabase “databases”

| Environment | What it is | Where credentials live |
|-------------|------------|-------------------------|
| **Production** | Your current Supabase project (the one you use today) | GitHub Environment **production** (variables/secrets) |
| **Develop** | A second Supabase project (e.g. “gmp-web-app-dev”) | GitHub Environment **develop** (variables/secrets) |

**Production:**  
You already have one Supabase project. Keep using it for production. Put its URL and anon key in the **production** environment in GitHub (as repo variables or environment variables for `production`).

**Develop:**  
1. In [Supabase Dashboard](https://supabase.com/dashboard), create a **new project** (e.g. “gmp-web-app-dev”).  
2. In that project, apply the **same schema** as production (run your SQL migrations: tables, RLS, etc.). You can copy from production or from your repo’s SQL files.  
3. Copy the new project’s **URL** and **anon (public) key** and store them in the **develop** environment in GitHub.

So you have:

- **Production DB** → production Supabase project → credentials in GitHub Environment **production**  
- **Develop DB** → develop Supabase project → credentials in GitHub Environment **develop**

No shared DB; each environment has its own.

### 4.2 How the app gets the right DB

Your app uses Vite and reads `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`. Those are **baked in at build time**. So:

- When GitHub Actions builds for **develop**, it must receive develop’s `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (from the **develop** environment).
- When it builds for **production**, it must receive production’s URL and key (from the **production** environment).

So in the workflow you run the **same** `npm run build`, but you pass different env vars depending on which environment you’re deploying to. The “handling the db across” part is: **different env vars per environment, each pointing to its own Supabase project.**

---

## 5. Step-by-step: set up GitHub Environments and vars

### 5.1 Create the two environments

1. Open your repo on GitHub → **Settings** → **Environments**.
2. Click **New environment**.
3. Create **develop** (no protection needed for now).
4. Create **production** (you can add “Required reviewers” later if you want).

### 5.2 Add variables (or secrets) per environment

For each environment you’ll store the Supabase config the build needs.

**Option A – Variables (simplest)**  
- **develop:**  
  - `VITE_SUPABASE_URL` = your **develop** Supabase project URL  
  - `VITE_SUPABASE_ANON_KEY` = develop project’s anon key  
- **production:**  
  - `VITE_SUPABASE_URL` = your **production** Supabase project URL  
  - `VITE_SUPABASE_ANON_KEY` = production project’s anon key  

**Option B – Secrets**  
If you prefer not to show the anon key in the UI, you can put `VITE_SUPABASE_ANON_KEY` (and optionally URL) in **Secrets** for each environment. The workflow references them the same way (`vars.*` or `secrets.*`).

**Where to set them:**  
- **Environment-specific:** Settings → Environments → click **develop** → “Environment variables” (or “Environment secrets”). Then same for **production**.  
- Then in the workflow you use that **environment** (see below) so the job gets the right set.

### 5.3 Deploy workflow: use the environment and pass vars to build

Right now your deploy workflow has one build that uses repo-level `vars`. To support develop vs production:

1. **Decide when each environment runs** (examples):
   - **develop:** on push to branch `develop`, or manual with `workflow_dispatch` choosing “develop”.
   - **production:** on push to `main`, or manual with “production”.

2. **Use `environment:`** in the job that deploys, so GitHub shows “develop” or “production” in the UI and applies that environment’s protection rules and variables.

3. **Pass that environment’s vars into the build:**  
   In the **build** job, set `env` from the **same** environment. The clean way is to have the build job also use `environment: develop` or `environment: production` (e.g. from a matrix or an input), and then use that environment’s variables.  
   Alternatively you can use **environment** only on the deploy job and pass variables explicitly using `env` from GitHub (e.g. `${{ vars.VITE_SUPABASE_URL }}`). For that to be per-environment, the variables must be set **per environment** (develop vs production), and the workflow must choose which environment’s vars to use (e.g. from `github.ref` or an input).

**Minimal pattern:**  
- Build job: `environment: ${{ inputs.env || (github.ref == 'refs/heads/main' && 'production') || 'develop' }}` (or similar), and in that job use `env: VITE_SUPABASE_URL: ${{ vars.VITE_SUPABASE_URL }}`, etc.  
- Deploy job: same `environment`, so it deploys to the right place (e.g. different Pages branch or different target).

So “how we handle the db across” in the workflow: **each job runs with one environment (develop or production); that environment’s variables point to the correct Supabase project for that environment.**

---

## 6. Summary diagram

```
GitHub repo
  │
  ├─ Environment: develop
  │     Variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY  (develop Supabase project)
  │     → Build uses these → Deploy to “develop” URL (e.g. develop branch or subpath)
  │
  └─ Environment: production
        Variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY  (production Supabase project)
        → Build uses these → Deploy to “production” URL (e.g. main → GitHub Pages)
```

- **Develop DB** = develop Supabase project (separate from production).  
- **Production DB** = current Supabase project.  
- **Handling the DB across** = two DBs, two sets of credentials, chosen by which GitHub Environment the workflow uses.

---

## 7. Next steps (short)

1. In Supabase: create a second project for develop; run the same schema (see **SETUP_DEVELOP_AND_PRODUCTION_FIRST_TIME.md** Part A.3: use `SUPABASE_DEVELOP_BOOTSTRAP.sql`); copy URL + anon key.
2. In GitHub: create environments **develop** and **production**; add the two Supabase variables (or secrets) to each.
3. Update **deploy workflow** so it:
   - Uses `environment: develop` or `environment: production` (e.g. from branch or input).
   - Builds with that environment’s `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   - Deploys to the matching target (e.g. develop branch vs main).
4. After that, the UI regression pipeline in gmp-ui-test can run against develop URL and production URL using the same two concepts (develop vs production).

If you want, the next step can be a concrete `deploy.yml` example that uses `develop` and `production` and passes the right vars into `npm run build`.
