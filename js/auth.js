// auth.js - Firebase initialization with your project config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// 🔐 Firebase configuration (مأخوذ من مشروعك)
const firebaseConfig = {
  apiKey: "AIzaSyCsUgZc3ftjw8b5V0188SzekRjxW_BN1mc",
  authDomain: "odexa-24a18.firebaseapp.com",
  projectId: "odexa-24a18",
  storageBucket: "odexa-24a18.firebasestorage.app",
  messagingSenderId: "999493823802",
  appId: "1:999493823802:web:c2213fc9fce7ee3a8ab403",
  measurementId: "G-V1S0WVCDL4"
};

let app, auth, db, analytics;

export function initFirebase() {
    if (!app) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        analytics = getAnalytics(app); // اختياري، لا يؤثر على المصادقة
    }
    return { auth, db };
}

export function getCurrentUser() {
    if (!auth) initFirebase();
    return auth.currentUser;
}

async function saveUserToFirestore(uid, name, email) {
    if (!db) initFirebase();
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
        name: name,
        email: email,
        createdAt: new Date().toISOString()
    }, { merge: true });
}

export async function getUserDataFromFirestore(uid) {
    if (!db) initFirebase();
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
}

export async function signUpWithEmail(email, password, fullName) {
    const { auth } = initFirebase();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: fullName });
    await saveUserToFirestore(user.uid, fullName, email);
    return user;
}

export async function signInWithEmail(email, password) {
    const { auth } = initFirebase();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

export async function logout() {
    const { auth } = initFirebase();
    await signOut(auth);
}
