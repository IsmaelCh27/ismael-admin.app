const { writeFileSync, mkdirSync, readFileSync, existsSync } = require('fs');

// Cargar variables de entorno desde .env si existe (sin usar dotenv)
if (existsSync('.env')) {
  const envConfig = readFileSync('.env', 'utf8');
  envConfig.split('\n').forEach((line) => {
    if (line && line.includes('=')) {
      const [key, ...value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.join('=').trim();
      }
    }
  });
}

const targetPath = './src/environments/environment.ts';
const targetPathDev = './src/environments/environment.development.ts';

const envConfigFile = (isProduction) => `export const environment = {
  production: ${isProduction},
  supabaseUrl: '${process.env.SUPABASE_URL}',
  supabaseKey: '${process.env.SUPABASE_KEY}',
};
`;

mkdirSync('./src/environments', { recursive: true });

writeFileSync(targetPath, envConfigFile(true));
writeFileSync(targetPathDev, envConfigFile(false));

