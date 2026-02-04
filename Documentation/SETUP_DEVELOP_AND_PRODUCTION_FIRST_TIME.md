# Set up Develop and Production — First time (step-by-step)

**Repo:** gmp-web-app  
**Goal:** Create GitHub Environments `develop` and `production`, each with its own Supabase DB. You’ve never done this before — follow in order.

---

## Part A — Supabase: create the “develop” database

You already have **one** Supabase project (production). You need a **second** project for develop.

### A.1 Create a new Supabase project (develop)

1. Go to **[Supabase Dashboard](https://supabase.com/dashboard)** and sign in.
2. Click **“New project”**.
3. **Organization:** use your default (or create one).
4. **Name:** e.g. `gmp-web-app-dev` (or `gmp-develop`).
5. **Database password:** set a strong password and **save it** somewhere safe (you need it for DB access; the app uses URL + anon key only).
6. **Region:** same as production (or closest to you).
7. Click **“Create new project”** and wait until it’s ready.

### A.2 Copy develop project URL and anon key

1. In the new project, open **Project Settings** (gear icon in the left sidebar).
2. Go to **API**.
3. Copy and save:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`) → this is **develop** `VITE_SUPABASE_URL`.
   - **anon public** key (under “Project API keys”) → this is **develop** `VITE_SUPABASE_ANON_KEY`.

### A.3 Same schema as production (tables, etc.)

Your app needs the same tables in develop as in production.

- **Clean develop DB (recommended):** In Supabase **SQL Editor** for the **develop** project:
  1. If the project already has tables, run **`Documentation/DROP_ALL_PUBLIC_TABLES.sql`** first.
  2. Then run **`Documentation/SUPABASE_DEVELOP_BOOTSTRAP.sql`** once. That creates the full PROD schema (categories, products, sales, sales_items, etc.) and seed data.
- **Add data later:** To copy data from production into develop, see **`Documentation/COPY_DATA_BETWEEN_DATABASES.md`** (pg_dump or manual export/import).

---

## Part B — GitHub: create environments and add variables

### B.1 Open Environments

1. Open your **gmp-web-app** repo on GitHub.
2. Click **Settings** (repo top bar).
3. In the left sidebar, click **Environments** (under “Code and automation”).

### B.2 Create environment: production

1. Click **“New environment”**.
2. **Name:** type `production` (lowercase).
3. Click **“Configure environment”**.
4. (Optional) You can add “Required reviewers” later; for now click **“Save protection rules”** or skip.
5. Under **Environment variables**, click **“Add variable”**.
6. Add the **production** Supabase values (your **current** project):
   - **Name:** `VITE_SUPABASE_URL`  
     **Value:** your production Supabase project URL (e.g. `https://xxxxx.supabase.co`).
   - Click **“Add variable”** again.
   - **Name:** `VITE_SUPABASE_ANON_KEY`  
     **Value:** your production Supabase anon (public) key.
7. Save. You should see both variables under **production**.

### B.3 Create environment: develop

1. Back on **Environments**, click **“New environment”** again.
2. **Name:** type `develop`.
3. Click **“Configure environment”**.
4. Under **Environment variables**, add the **develop** Supabase values (from Part A.2):
   - **Name:** `VITE_SUPABASE_URL`  
     **Value:** the **develop** project URL.
   - **Name:** `VITE_SUPABASE_ANON_KEY`  
     **Value:** the **develop** project anon key.
5. Save.

You now have two environments, each with its own DB credentials.

---

## Part C — Deploy workflow: use the environments

The deploy workflow must use an **environment** so GitHub injects that environment’s variables into the build.

**Current behavior:** Build uses repo-level variables.  
**New behavior:** Build and deploy use the **production** environment when you deploy from `main`.

### What we’ll do in the workflow

1. **Build job:** Run with `environment: production` when deploying from `main`, and pass that environment’s variables into the build (so the built app talks to **production** Supabase).
2. **Deploy job:** Use `environment: production` so the deployment is tied to the production environment (and you can add protection rules later).
3. **Later (optional):** Add a branch `develop` and a workflow that uses `environment: develop` so develop builds use the develop DB. For now we only wire **production** so you see how it works.

After the workflow update:

- **Push to main** → build uses **production** → deploys to GitHub Pages. **Run workflow** (manual) lets you choose **environment** (`production` or `develop`) to test against develop DB.
- Your **develop** environment is ready for when you add a develop branch or a manual “deploy develop” workflow.

---

## Part D — Checklist (quick recap)

- [ ] **Supabase:** New project for develop; copied URL + anon key; ran same schema.
- [ ] **GitHub:** Environment **production** with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (production values).
- [ ] **GitHub:** Environment **develop** with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (develop values).
- [ ] **Workflow:** Updated so build + deploy use `environment: production` and vars come from that environment (see next file or section).

---

## If something goes wrong

- **Build fails with “missing Supabase”:** The job must have `environment: production` (or `develop`) and those environments must have both variables set.
- **App shows wrong data:** The build used the wrong environment’s vars; check which branch triggered the workflow and which environment the workflow uses.
- **Develop DB empty:** Run your schema SQL in the develop Supabase project (Part A.3).

The workflow is already updated: the **build** job uses `environment: production`, so it gets `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the **production** environment. Make sure those two variables are set in **Settings → Environments → production** (Part B.2). If you had them as repository variables before, you can keep both or move them only to the production environment.
