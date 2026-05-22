import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

const initDB = async () => {
  await pool.query(`

            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(80) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(15) DEFAULT 'contributor'
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
                    CHECK (length(trim(description)) >= 20)
                ,
                type VARCHAR(16) NOT NULL
                    CHECK (type IN ('bug', 'feature_request')),
                status VARCHAR(12) DEFAULT 'open'
                    CHECK (status IN ('open', 'in_progress', 'resolved')),
                reporter_id INT REFERENCES users(id),
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
            
    `);
};

export { initDB, pool };
