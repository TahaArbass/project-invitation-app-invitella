import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseCred from './firebaseCred';
import { signInAnonymously } from 'firebase/auth';

const app = initializeApp(firebaseCred);
const auth = getAuth(app);
const storage = getStorage(app);

// sign in anonymously
async function signInAnon() {
    try {
        const userCredential = await signInAnonymously(getAuth());
        return userCredential.user;
    } catch (error) {
        throw new Error(error.message);
    }
}

export { app, auth, storage, signInAnon };
