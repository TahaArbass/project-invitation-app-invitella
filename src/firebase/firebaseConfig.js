import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import firebaseCred from './firebaseCred';

// Initialize Firebase
const app = initializeApp(firebaseCred);
const storage = getStorage(app);

export { storage };
