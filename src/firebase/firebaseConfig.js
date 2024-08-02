import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseCred from './firebaseCred';

const app = initializeApp(firebaseCred);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };
