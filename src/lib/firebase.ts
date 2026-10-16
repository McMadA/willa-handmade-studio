import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDocs, query, where, Timestamp } from "firebase/firestore";

// Your web app's Firebase configuration
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

export interface NaailesDay {
  date: string; // ISO string format YYYY-MM-DD
  isLesson: boolean;
  group?: "dinsdag" | "zaterdag" | "overig";
  startTime?: string; // e.g., "19:30"
  endTime?: string; // e.g., "21:30"
  note?: string;
}

// Default verified schedule (September, October, and November 2026)
export const DEFAULT_NAAILES_DAYS: Record<
  string,
  { isLesson: boolean; group: "dinsdag" | "zaterdag" | "overig"; startTime: string; endTime: string }
> = {
  // September 2026
  "2026-09-08": { isLesson: true, group: "dinsdag", startTime: "19:30", endTime: "21:30" },
  "2026-09-15": { isLesson: true, group: "dinsdag", startTime: "19:30", endTime: "21:30" },
  "2026-09-22": { isLesson: true, group: "dinsdag", startTime: "19:30", endTime: "21:30" },
  "2026-09-29": { isLesson: true, group: "dinsdag", startTime: "19:30", endTime: "21:30" },
  "2026-09-19": { isLesson: true, group: "zaterdag", startTime: "10:00", endTime: "12:00" },
  "2026-09-26": { isLesson: true, group: "zaterdag", startTime: "10:00", endTime: "12:00" },

  // Oktober 2026
  "2026-10-06": { isLesson: true, group: "dinsdag", startTime: "19:30", endTime: "21:30" },
  "2026-10-13": { isLesson: true, group: "dinsdag", startTime: "19:30", endTime: "21:30" },
  "2026-10-20": { isLesson: true, group: "dinsdag", startTime: "19:30", endTime: "21:30" },
  "2026-10-27": { isLesson: true, group: "dinsdag", startTime: "19:30", endTime: "21:30" },
  "2026-10-10": { isLesson: true, group: "zaterdag", startTime: "10:00", endTime: "12:00" },
  "2026-10-17": { isLesson: true, group: "zaterdag", startTime: "10:00", endTime: "12:00" },
  "2026-10-24": { isLesson: true, group: "zaterdag", startTime: "10:00", endTime: "12:00" },
  "2026-10-31": { isLesson: true, group: "zaterdag", startTime: "10:00", endTime: "12:00" },

  // November 2026 (provided by Willeke)
  "2026-11-03": { isLesson: true, group: "dinsdag", startTime: "19:30", endTime: "21:30" },
  "2026-11-10": { isLesson: true, group: "dinsdag", startTime: "19:30", endTime: "21:30" },
  "2026-11-17": { isLesson: true, group: "dinsdag", startTime: "19:30", endTime: "21:30" },
  "2026-11-24": { isLesson: true, group: "dinsdag", startTime: "19:30", endTime: "21:30" },
  "2026-11-14": { isLesson: true, group: "zaterdag", startTime: "10:00", endTime: "12:00" },
  "2026-11-21": { isLesson: true, group: "zaterdag", startTime: "10:00", endTime: "12:00" },
  "2026-11-28": { isLesson: true, group: "zaterdag", startTime: "10:00", endTime: "12:00" },
};

// Helper to update opening hours for a specific month
export const updateMonthHours = async (monthYear: string, days: DailyHours[]) => {
  const batch = days.map(day => {
    const docRef = doc(db, "openingHours", day.date);
    return setDoc(docRef, {
      ...day,
      isNaailes: false,
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
  querySnapshot.forEach((d) => {
    const data = d.data() as DailyHours & { isNaailes?: boolean };
    // Exclude naailessen documents from regular opening hours
    if (d.id.startsWith("naailes_") || data.isNaailes) {
      return;
    }
    hours.push({
      date: data.date,
      isOpen: data.isOpen,
      openTime: data.openTime,
      closeTime: data.closeTime,
    });
  });
  
  return hours.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Helper to update naailessen for a specific month in Firestore
export const updateMonthNaailessen = async (monthYear: string, days: NaailesDay[]) => {
  const batch = days.map(day => {
    const docRef = doc(db, "openingHours", `naailes_${day.date}`);
    return setDoc(docRef, {
      ...day,
      isNaailes: true,
      timestamp: Timestamp.fromDate(new Date(day.date))
    });
  });

  await Promise.all(batch);
};

// Helper to fetch saved naailessen for a specific month (used by Admin)
export const getMonthNaailessen = async (year: number, month: number): Promise<Record<string, NaailesDay>> => {
  const monthStart = new Date(year, month, 1);
  const numDays = new Date(year, month + 1, 0).getDate();
  const monthEnd = new Date(year, month, numDays, 23, 59, 59);

  try {
    const hoursRef = collection(db, "openingHours");
    const q = query(
      hoursRef,
      where("timestamp", ">=", Timestamp.fromDate(monthStart)),
      where("timestamp", "<=", Timestamp.fromDate(monthEnd))
    );

    const snapshot = await getDocs(q);
    const existingMap: Record<string, NaailesDay> = {};
    snapshot.forEach((d) => {
      const data = d.data() as NaailesDay & { isNaailes?: boolean };
      if (d.id.startsWith("naailes_") || data.isNaailes) {
        existingMap[data.date] = data;
      }
    });

    return existingMap;
  } catch (err) {
    console.error("Error fetching month naailessen:", err);
    return {};
  }
};

// Helper to get upcoming naailessen for public display on homepage
export const getUpcomingNaailessen = async (): Promise<NaailesDay[]> => {
  const now = new Date();
  // Start from the beginning of current month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const futureLimit = new Date(now.getFullYear(), now.getMonth() + 4, 0, 23, 59, 59);

  const lessonsMap: Record<string, NaailesDay> = {};

  // Initialize with verified defaults in the window
  Object.entries(DEFAULT_NAAILES_DAYS).forEach(([dateStr, def]) => {
    const d = new Date(dateStr);
    if (d >= monthStart && d <= futureLimit) {
      lessonsMap[dateStr] = {
        date: dateStr,
        isLesson: def.isLesson,
        group: def.group,
        startTime: def.startTime,
        endTime: def.endTime,
      };
    }
  });

  // Then merge with Firestore updates if available
  try {
    const hoursRef = collection(db, "openingHours");
    const q = query(
      hoursRef,
      where("timestamp", ">=", Timestamp.fromDate(monthStart)),
      where("timestamp", "<=", Timestamp.fromDate(futureLimit))
    );

    const snapshot = await getDocs(q);
    snapshot.forEach((d) => {
      const data = d.data() as NaailesDay & { isNaailes?: boolean };
      if (d.id.startsWith("naailes_") || data.isNaailes) {
        lessonsMap[data.date] = data;
      }
    });
  } catch (err) {
    console.error("Error fetching upcoming naailessen:", err);
  }

  return Object.values(lessonsMap)
    .filter((l) => l.isLesson)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
