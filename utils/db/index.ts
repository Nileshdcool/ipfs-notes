import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
        });
    } catch (error: any) {
        console.log('Firebase admin initialization error', error.stack);
    }
}

export default admin.firestore();
