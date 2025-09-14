require('dotenv').config();

// Parse Railway database URL if provided
const parseDatabaseUrl = (url) => {
  if (!url) return null;
  
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port),
      database: parsed.pathname.slice(1), // Remove leading slash
      user: parsed.username,
      password: parsed.password,
      ssl: { rejectUnauthorized: false }
    };
  } catch (error) {
    console.error('Error parsing database URL:', error);
    return null;
  }
};

// Get connection config
const getConnectionConfig = () => {
  // If DATABASE_URL is provided (Railway), use it
  if (process.env.DATABASE_URL) {
    const parsed = parseDatabaseUrl(process.env.DATABASE_URL);
    if (parsed) return parsed;
  }
  
  // Fallback to individual environment variables
  return {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
};

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'malisha_edu_db',
      user: process.env.DB_USER || 'asif2',
      password: process.env.DB_PASSWORD || 'asif10018'
    },
    migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: getConnectionConfig(),
    migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
