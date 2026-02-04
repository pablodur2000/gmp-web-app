# Copy data between Supabase databases (e.g. PROD → develop)

Use this when you want to fill **develop** with data from **production** (same schema in both).

---

## Option 1: pg_dump + psql

If you have PostgreSQL client tools (`pg_dump`, `psql`) in your PATH:

1. **Dump data only from production** (use your prod DB connection string, port 5432):
   ```bash
   pg_dump "postgresql://postgres.[PROD-REF]:[PASSWORD]@...supabase.com:5432/postgres" --data-only --no-owner --no-privileges -f prod-data.sql
   ```
2. **Load into develop** (use your develop DB connection string):
   ```bash
   psql "postgresql://postgres.[DEV-REF]:[PASSWORD]@...supabase.com:5432/postgres" -f prod-data.sql
   ```
3. Delete the file: `del prod-data.sql` (Windows) or `rm prod-data.sql` (Mac/Linux).

Connection strings: Supabase Dashboard → Project → **Project Settings** → **Database** → Connection string (URI), port **5432**; replace the password placeholder.

---

## Option 2: Manual (small datasets)

1. **Production:** Supabase → Table Editor → select table → **Export** (CSV).
2. **Develop:** Table Editor → same table → **Insert** → paste or import CSV.

---

## Notes

- Source and target must have the **same schema** (e.g. develop bootstrapped from `SUPABASE_DEVELOP_BOOTSTRAP.sql`).
- To replace develop data: run `Documentation/DROP_ALL_PUBLIC_TABLES.sql` in develop, then `SUPABASE_DEVELOP_BOOTSTRAP.sql`, then copy data again.
