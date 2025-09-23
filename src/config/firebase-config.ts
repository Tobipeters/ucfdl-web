import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

//Firebase config
const firebaseConfig = {
  apikey: process.env.NEXT_PUBLIC_API_KEY,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
};

console.log({firebaseConfig})

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { database };
