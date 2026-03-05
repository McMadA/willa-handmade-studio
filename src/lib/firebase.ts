import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, Timestamp } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForNow",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abc123def456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

export interface DailyHours {
  date: string; // ISO string format YYYY-MM-DD
  isOpen: boolean;
  openTime?: string; // e.g., "09:00"
  closeTime?: string; // e.g., "17:00"
}

// Helper to update opening hours for a specific month
export const updateMonthHours = async (monthYear: string, days: DailyHours[]) => {
  const batch = days.map(day => {
    const docRef = doc(db, "openingHours", day.date);
    return setDoc(docRef, {
      ...day,
      timestamp: Timestamp.fromDate(new Date(day.date))
    });
  });
  
  await Promise.all(batch);
};

// Helper to get opening hours from today up to 30 days in advance
export const getUpcomingOpeningHours = async (): Promise<DailyHours[]> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endLimit = new Date();
  endLimit.setDate(today.getDate() + 30);
  
  const hoursRef = collection(db, "openingHours");
  const q = query(
    hoursRef,
    where("timestamp", ">=", Timestamp.fromDate(today)),
    where("timestamp", "<=", Timestamp.fromDate(endLimit))
  );
  
  const querySnapshot = await getDocs(q);
  const hours: DailyHours[] = [];
  querySnapshot.forEach((doc) => {
    hours.push(doc.data() as DailyHours);
  });
  
  return hours.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
