import 'dotenv/config.js';
import { connect } from 'mongoose';

import app from './app.js';
const PORT = 3000;

async function main() {
  try {
    await connect(process.env.DATABASE_URL as string);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch {
    console.log('Error connecting to database');
    process.exit(0);
  }
}

main();
