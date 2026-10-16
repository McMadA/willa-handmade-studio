import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  auth,
  db,
  type DailyHours,
  updateMonthHours,
  type NaailesDay,
  updateMonthNaailessen,
  getMonthNaailessen,
  DEFAULT_NAAILES_DAYS,
} from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { format, getDaysInMonth } from "date-fns";
import {
  LogOut,
  Save,
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarDays,
  Lock,
  Sparkles,
  Scissors,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

const MONTH_NAMES = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December"
];

const DAY_NAMES = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

const Admin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab: 'hours' (Openingstijden) | 'naailes' (Naailessen)
  const initialTab = searchParams.get("tab") === "naailes" ? "naailes" : "hours";
  const [activeTab, setActiveTab] = useState<"hours" | "naailes">(initialTab);

  const handleTabChange = (tab: "hours" | "naailes") => {
    setActiveTab(tab);
    setSearchParams(tab === "naailes" ? { tab: "naailes" } : {});
  };

  // Month selection
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed

  // Opening hours state
  const [days, setDays] = useState<DailyHours[]>([]);
  const [savingHours, setSavingHours] = useState(false);
  const [fetchingHours, setFetchingHours] = useState(false);

  // Naailes days state
  const [naailesDays, setNaailesDays] = useState<NaailesDay[]>([]);
  const [savingNaailes, setSavingNaailes] = useState(false);
  const [fetchingNaailes, setFetchingNaailes] = useState(false);

  // Auth listener with safety timeout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (u) => {
        setUser(u);
        setLoading(false);
      },
      (err) => {
        console.error("Auth listener error:", err);
        setLoading(false);
      }
    );

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    return DAY_NAMES[day === 0 ? 6 : day - 1]; // Monday-first
  };

  // ================= OPENING HOURS =================
  const buildMonthHours = useCallback(async () => {
    setFetchingHours(true);
    const numDays = getDaysInMonth(new Date(selectedYear, selectedMonth));
    const newDays: DailyHours[] = [];

    for (let d = 1; d <= numDays; d++) {
      const date = new Date(selectedYear, selectedMonth, d);
      const dateStr = format(date, "yyyy-MM-dd");
      newDays.push({
        date: dateStr,
        isOpen: false,
        openTime: "09:00",
        closeTime: "17:00",
      });
    }

    try {
      const monthStart = new Date(selectedYear, selectedMonth, 1);
      const monthEnd = new Date(selectedYear, selectedMonth, numDays, 23, 59, 59);

      const hoursRef = collection(db, "openingHours");
      const q = query(
        hoursRef,
        where("timestamp", ">=", Timestamp.fromDate(monthStart)),
        where("timestamp", "<=", Timestamp.fromDate(monthEnd))
      );

      const snapshot = await getDocs(q);
      const existingMap: Record<string, DailyHours> = {};
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data() as DailyHours & { isNaailes?: boolean };
        if (!docSnap.id.startsWith("naailes_") && !docData.isNaailes) {
          existingMap[docData.date] = docData;
        }
      });

      for (let i = 0; i < newDays.length; i++) {
        if (existingMap[newDays[i].date]) {
          newDays[i] = { ...newDays[i], ...existingMap[newDays[i].date] };
        }
      }
    } catch (err) {
      console.error("Error fetching existing hours:", err);
    }

    setDays(newDays);
    setFetchingHours(false);
  }, [selectedYear, selectedMonth]);

  const toggleHourDay = (index: number) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isOpen: !updated[index].isOpen };
      return updated;
    });
  };

  const updateHourTime = (index: number, field: "openTime" | "closeTime", value: string) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveHours = async () => {
    setSavingHours(true);
    try {
      await updateMonthHours(
        `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`,
        days
      );
      toast.success("Openingstijden opgeslagen!", {
        description: `${MONTH_NAMES[selectedMonth]} ${selectedYear} is bijgewerkt.`,
      });
    } catch (err) {
      console.error("Error saving hours:", err);
      toast.error("Fout bij opslaan", {
        description: "Probeer het opnieuw.",
      });
    }
    setSavingHours(false);
  };

  // ================= NAAILESSEN =================
  const buildMonthNaailesDays = useCallback(async () => {
    setFetchingNaailes(true);
    const numDays = getDaysInMonth(new Date(selectedYear, selectedMonth));
    const newDays: NaailesDay[] = [];

    // Pre-populate skeleton
    for (let d = 1; d <= numDays; d++) {
      const date = new Date(selectedYear, selectedMonth, d);
      const dateStr = format(date, "yyyy-MM-dd");
      const dayOfWeek = date.getDay(); // 0=Sun, 2=Tue, 6=Sat

      const isTuesday = dayOfWeek === 2;
      const isSaturday = dayOfWeek === 6;

      // Check if we have a default verified schedule for this date
      const defaultEntry = DEFAULT_NAAILES_DAYS[dateStr];

      newDays.push({
        date: dateStr,
        isLesson: defaultEntry ? defaultEntry.isLesson : false,
        group: defaultEntry ? defaultEntry.group : isTuesday ? "dinsdag" : isSaturday ? "zaterdag" : "overig",
        startTime: defaultEntry ? defaultEntry.startTime : isSaturday ? "10:00" : "19:30",
        endTime: defaultEntry ? defaultEntry.endTime : isSaturday ? "12:00" : "21:30",
      });
    }

    // Merge with saved Firestore entries if available
    try {
      const existingMap = await getMonthNaailessen(selectedYear, selectedMonth);
      if (Object.keys(existingMap).length > 0) {
        for (let i = 0; i < newDays.length; i++) {
          if (existingMap[newDays[i].date]) {
            newDays[i] = { ...newDays[i], ...existingMap[newDays[i].date] };
          }
        }
      }
    } catch (err) {
      console.error("Error fetching naailes days:", err);
    }

    setNaailesDays(newDays);
    setFetchingNaailes(false);
  }, [selectedYear, selectedMonth]);

  // Fetch / build days when month or tab changes
  useEffect(() => {
    if (!user) return;
    if (activeTab === "hours") {
      buildMonthHours();
    } else {
      buildMonthNaailesDays();
    }
  }, [user, activeTab, buildMonthHours, buildMonthNaailesDays]);

  const toggleNaailesDay = (index: number) => {
    setNaailesDays((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isLesson: !updated[index].isLesson };
      return updated;
    });
  };

  const updateNaailesTime = (index: number, field: "startTime" | "endTime", value: string) => {
    setNaailesDays((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const quickSetTuesdays = (on: boolean) => {
    setNaailesDays((prev) =>
      prev.map((d) => {
        const date = new Date(d.date);
        if (date.getDay() === 2) {
          return {
            ...d,
            isLesson: on,
            group: "dinsdag",
            startTime: d.startTime || "19:30",
            endTime: d.endTime || "21:30",
          };
        }
        return d;
      })
    );
  };

  const quickSetSaturdays = (on: boolean) => {
    setNaailesDays((prev) =>
      prev.map((d) => {
        const date = new Date(d.date);
        if (date.getDay() === 6) {
          return {
            ...d,
            isLesson: on,
            group: "zaterdag",
            startTime: d.startTime || "10:00",
            endTime: d.endTime || "12:00",
          };
        }
        return d;
      })
    );
  };

  const clearAllNaailesDays = () => {
    setNaailesDays((prev) => prev.map((d) => ({ ...d, isLesson: false })));
  };

  const handleSaveNaailes = async () => {
    setSavingNaailes(true);
    try {
      await updateMonthNaailessen(
        `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`,
        naailesDays
      );
      toast.success("Naailessen opgeslagen!", {
        description: `${MONTH_NAMES[selectedMonth]} ${selectedYear} is bijgewerkt.`,
      });
    } catch (err) {
      console.error("Error saving naailessen:", err);
      toast.error("Fout bij opslaan", {
        description: "Probeer het opnieuw.",
      });
    }
    setSavingNaailes(false);
  };

  // ================= GENERAL =================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setLoginError("Ongeldige inloggegevens. Probeer het opnieuw.");
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navigateMonth = (direction: -1 | 1) => {
    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-2xl border border-border p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
                Admin Portaal
              </h1>
              <p className="font-poppins text-muted-foreground text-sm">
                Log in om openingstijden en naailessen te beheren
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block font-poppins text-sm font-medium text-foreground mb-1.5">
                  E-mailadres
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-poppins focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="uw@email.nl"
                  required
                />
              </div>
              <div>
                <label className="block font-poppins text-sm font-medium text-foreground mb-1.5">
                  Wachtwoord
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-poppins focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-destructive/10 text-destructive text-sm font-poppins p-3 rounded-xl">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-primary text-primary-foreground font-poppins font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                ) : (
                  "Inloggen"
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 font-poppins text-sm text-muted-foreground">
            <a href="/" className="text-primary hover:underline">
              ← Terug naar website
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-30 backdrop-blur-md bg-card/95">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {activeTab === "hours" ? (
              <CalendarDays className="w-7 h-7 text-primary" />
            ) : (
              <Scissors className="w-7 h-7 text-primary" />
            )}
            <div>
              <h1 className="font-playfair text-xl font-bold text-foreground">
                {activeTab === "hours" ? "Openingstijden Beheer" : "Naailessen Beheer"}
              </h1>
              <p className="font-poppins text-xs text-muted-foreground">
                Willa Handmade Studio
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-muted/60 p-1 rounded-2xl border border-border">
            <button
              onClick={() => handleTabChange("hours")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-poppins text-sm font-semibold transition-all ${
                activeTab === "hours"
                  ? "bg-card text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="w-4 h-4 text-primary" />
              <span>Openingstijden</span>
            </button>
            <button
              onClick={() => handleTabChange("naailes")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-poppins text-sm font-semibold transition-all ${
                activeTab === "naailes"
                  ? "bg-card text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Naailessen</span>
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-poppins text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-xl hover:bg-muted"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Uitloggen</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        {/* Month Selector */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-3 rounded-xl hover:bg-muted transition-colors"
              title="Vorige maand"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="text-center">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
                {MONTH_NAMES[selectedMonth]}
              </h2>
              <p className="font-poppins text-muted-foreground text-sm">{selectedYear}</p>
            </div>
            <button
              onClick={() => navigateMonth(1)}
              className="p-3 rounded-xl hover:bg-muted transition-colors"
              title="Volgende maand"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* ================= OPENING HOURS VIEW ================= */}
        {activeTab === "hours" && (
          <>
            {/* Instructions */}
            <div className="bg-primary/5 rounded-2xl p-4 mb-6 border border-primary/10">
              <p className="font-poppins text-sm text-foreground/80 text-center">
                💡 Klik op een dag om deze <strong>open</strong> of <strong>gesloten</strong> te zetten. 
                Pas daarna de openingstijden aan en klik op <strong>Opslaan</strong>.
              </p>
            </div>

            {/* Days Grid */}
            {fetchingHours ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="space-y-2 mb-8">
                {days.map((day, index) => {
                  const dayName = getDayOfWeek(day.date);
                  const dayNum = new Date(day.date).getDate();
                  const isWeekend = dayName === "Za" || dayName === "Zo";

                  return (
                    <div
                      key={day.date}
                      className={`rounded-xl border transition-all duration-200 ${
                        day.isOpen
                          ? "bg-card border-primary/30 shadow-sm"
                          : "bg-muted/30 border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3 p-4">
                        {/* Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleHourDay(index)}
                          className={`w-12 h-7 rounded-full transition-all duration-300 relative flex-shrink-0 ${
                            day.isOpen ? "bg-primary" : "bg-border"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                              day.isOpen ? "left-[calc(100%-1.625rem)]" : "left-0.5"
                            }`}
                          />
                        </button>

                        {/* Day info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-poppins text-xs font-semibold uppercase tracking-wider ${
                                isWeekend ? "text-accent" : "text-muted-foreground"
                              }`}
                            >
                              {dayName}
                            </span>
                            <span className="font-poppins text-base font-bold text-foreground">
                              {dayNum}
                            </span>
                            <span className="font-poppins text-xs text-muted-foreground">
                              {MONTH_NAMES[selectedMonth].toLowerCase()}
                            </span>
                          </div>
                        </div>

                        {/* Time inputs */}
                        {day.isOpen ? (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-primary" />
                              <input
                                type="time"
                                value={day.openTime || "09:00"}
                                onChange={(e) => updateHourTime(index, "openTime", e.target.value)}
                                className="font-poppins text-sm bg-background border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-[100px]"
                              />
                            </div>
                            <span className="font-poppins text-sm text-muted-foreground">tot</span>
                            <input
                              type="time"
                              value={day.closeTime || "17:00"}
                              onChange={(e) => updateHourTime(index, "closeTime", e.target.value)}
                              className="font-poppins text-sm bg-background border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-[100px]"
                            />
                          </div>
                        ) : (
                          <span className="font-poppins text-sm text-muted-foreground italic">
                            Gesloten
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Save Button */}
            <div className="sticky bottom-6 z-10">
              <button
                onClick={handleSaveHours}
                disabled={savingHours || fetchingHours}
                className="w-full bg-primary text-primary-foreground font-poppins font-semibold py-4 px-6 rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 text-lg"
              >
                {savingHours ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                    Openingstijden opslaan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Openingstijden Opslaan
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* ================= NAAILESSEN VIEW ================= */}
        {activeTab === "naailes" && (
          <>
            {/* Quick Actions & Tips */}
            <div className="bg-card rounded-2xl p-5 mb-6 border border-border shadow-sm space-y-4">
              <p className="font-poppins text-sm text-foreground/80">
                💡 Klik op een dag om een <strong>naailes in te plannen</strong> of uit te zetten.
                Standaardtijden: Dinsdagavond <strong>19:30 – 21:30</strong> en Zaterdagochtend <strong>10:00 – 12:00</strong>.
              </p>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => quickSetTuesdays(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-poppins text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Alle dinsdagen aanzetten
                </button>
                <button
                  type="button"
                  onClick={() => quickSetSaturdays(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-poppins text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Alle zaterdagen aanzetten
                </button>
                <button
                  type="button"
                  onClick={clearAllNaailesDays}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground font-poppins text-xs font-medium hover:text-foreground transition-colors ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Alles wissen
                </button>
              </div>
            </div>

            {/* Days Grid */}
            {fetchingNaailes ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="space-y-2 mb-8">
                {naailesDays.map((day, index) => {
                  const dayName = getDayOfWeek(day.date);
                  const dayNum = new Date(day.date).getDate();
                  const isTuesday = dayName === "Di";
                  const isSaturday = dayName === "Za";

                  return (
                    <div
                      key={day.date}
                      className={`rounded-xl border transition-all duration-200 ${
                        day.isLesson
                          ? "bg-card border-primary/40 shadow-sm"
                          : "bg-muted/30 border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3 p-4">
                        {/* Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleNaailesDay(index)}
                          className={`w-12 h-7 rounded-full transition-all duration-300 relative flex-shrink-0 ${
                            day.isLesson ? "bg-primary" : "bg-border"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                              day.isLesson ? "left-[calc(100%-1.625rem)]" : "left-0.5"
                            }`}
                          />
                        </button>

                        {/* Day info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-poppins text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                                isTuesday
                                  ? "bg-primary/10 text-primary"
                                  : isSaturday
                                  ? "bg-accent/30 text-accent-foreground font-bold"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {dayName}
                            </span>
                            <span className="font-poppins text-base font-bold text-foreground">
                              {dayNum}
                            </span>
                            <span className="font-poppins text-xs text-muted-foreground">
                              {MONTH_NAMES[selectedMonth].toLowerCase()}
                            </span>

                            {isTuesday && (
                              <span className="text-[11px] font-poppins text-primary font-medium bg-primary/5 px-2 py-0.5 rounded-full border border-primary/20">
                                Dinsdagavond
                              </span>
                            )}
                            {isSaturday && (
                              <span className="text-[11px] font-poppins text-foreground font-medium bg-accent/20 px-2 py-0.5 rounded-full border border-accent/40">
                                Zaterdagochtend
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Time inputs */}
                        {day.isLesson ? (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-primary" />
                              <input
                                type="time"
                                value={day.startTime || (isSaturday ? "10:00" : "19:30")}
                                onChange={(e) => updateNaailesTime(index, "startTime", e.target.value)}
                                className="font-poppins text-sm bg-background border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-[100px]"
                              />
                            </div>
                            <span className="font-poppins text-sm text-muted-foreground">tot</span>
                            <input
                              type="time"
                              value={day.endTime || (isSaturday ? "12:00" : "21:30")}
                              onChange={(e) => updateNaailesTime(index, "endTime", e.target.value)}
                              className="font-poppins text-sm bg-background border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-[100px]"
                            />
                          </div>
                        ) : (
                          <span className="font-poppins text-sm text-muted-foreground italic">
                            Geen les
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Save Button */}
            <div className="sticky bottom-6 z-10">
              <button
                onClick={handleSaveNaailes}
                disabled={savingNaailes || fetchingNaailes}
                className="w-full bg-primary text-primary-foreground font-poppins font-semibold py-4 px-6 rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 text-lg"
              >
                {savingNaailes ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                    Naailessen opslaan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Naailessen Opslaan
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Back link */}
        <div className="text-center mt-8 pb-8">
          <a href="/" className="font-poppins text-sm text-primary hover:underline">
            ← Terug naar website
          </a>
        </div>
      </main>
    </div>
  );
};

export default Admin;
