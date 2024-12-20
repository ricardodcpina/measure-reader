import 'dotenv/config.js';
import { connect } from 'mongoose';
import app from './app';

const PORT = process.env.API_PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL as string;

async function main() {
  try {
    await connect(DATABASE_URL);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error: any) {
    console.log('Error connecting to database');
    process.exit(1);
  }
}

main();
