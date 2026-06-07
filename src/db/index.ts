import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

const initDB = async () => {
  await pool.query(`

            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'contributor'
                    CHECK (role IN ('contributor', 'maintainer')),
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
            
    `);

  await pool.query(`

            CREATE TABLE IF NOT EXISTS issues(
                id SERIAL PRIMARY KEY,
                title VARCHAR(150) NOT NULL,
                description TEXT NOT NULL
                    CHECK (length(trim(description)) >= 20),
                type VARCHAR(20) NOT NULL
                    CHECK (type IN ('bug', 'feature_request')),
                status VARCHAR(20) DEFAULT 'open'
                    CHECK (status IN ('open', 'in_progress', 'resolved')),
                reporter_id INT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
            
    `);

  // Function to update updated_at
  await pool.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

  // Users trigger
  await pool.query(`
        DROP TRIGGER IF EXISTS users_set_updated_at ON users;

        CREATE TRIGGER users_set_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

  // Issues trigger
  await pool.query(`
        DROP TRIGGER IF EXISTS issues_set_updated_at ON issues;

        CREATE TRIGGER issues_set_updated_at
        BEFORE UPDATE ON issues
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
};

export { initDB, pool };
