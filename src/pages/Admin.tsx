import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db, type DailyHours, updateMonthHours } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { format, getDaysInMonth, startOfMonth, getDay } from "date-fns";
import { nl } from "date-fns/locale";
import { LogOut, Save, ChevronLeft, ChevronRight, Clock, CalendarDays, Lock } from "lucide-react";
import { toast } from "sonner";

const MONTH_NAMES = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December"
];

const DAY_NAMES = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Month selection
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed

  // Daily hours state
  const [days, setDays] = useState<DailyHours[]>([]);
  const [saving, setSaving] = useState(false);
  const [fetchingMonth, setFetchingMonth] = useState(false);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Build days for selected month
  useEffect(() => {
    if (!user) return;
    buildMonthDays();
  }, [selectedMonth, selectedYear, user]);

  const buildMonthDays = async () => {
    setFetchingMonth(true);
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

    // Now fetch existing data from Firestore and merge
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
      snapshot.forEach((doc) => {
        const data = doc.data() as DailyHours;
        existingMap[data.date] = data;
      });

      // Merge existing data
      for (let i = 0; i < newDays.length; i++) {
        if (existingMap[newDays[i].date]) {
          newDays[i] = { ...newDays[i], ...existingMap[newDays[i].date] };
        }
      }
    } catch (err) {
      console.error("Error fetching existing hours:", err);
    }

    setDays(newDays);
    setFetchingMonth(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setLoginError("Ongeldige inloggegevens. Probeer het opnieuw.");
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const toggleDay = (index: number) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isOpen: !updated[index].isOpen };
      return updated;
    });
  };

  const updateTime = (index: number, field: "openTime" | "closeTime", value: string) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMonthHours(
        `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`,
        days
      );
      toast.success("Openingstijden opgeslagen!", {
        description: `${MONTH_NAMES[selectedMonth]} ${selectedYear} is bijgewerkt.`,
      });
    } catch (err) {
      console.error("Error saving:", err);
      toast.error("Fout bij opslaan", {
        description: "Probeer het opnieuw.",
      });
    }
    setSaving(false);
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

  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    return DAY_NAMES[day === 0 ? 6 : day - 1]; // Convert Sunday=0 to Monday-first
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
              <p className="font-poppins text-muted-foreground">
                Log in om openingstijden te beheren
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
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-7 h-7 text-primary" />
            <div>
              <h1 className="font-playfair text-xl font-bold text-foreground">
                Openingstijden Beheer
              </h1>
              <p className="font-poppins text-sm text-muted-foreground">
                Willa Handmade Studio
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-poppins text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-xl hover:bg-muted"
          >
            <LogOut className="w-4 h-4" />
            Uitloggen
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
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="text-center">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
                {MONTH_NAMES[selectedMonth]}
              </h2>
              <p className="font-poppins text-muted-foreground">{selectedYear}</p>
            </div>
            <button
              onClick={() => navigateMonth(1)}
              className="p-3 rounded-xl hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-primary/5 rounded-2xl p-4 mb-6 border border-primary/10">
          <p className="font-poppins text-sm text-foreground/80 text-center">
            💡 Klik op een dag om deze <strong>open</strong> of <strong>gesloten</strong> te zetten. 
            Pas daarna de tijden aan en klik op <strong>Opslaan</strong>.
          </p>
        </div>

        {/* Days Grid */}
        {fetchingMonth ? (
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
                      onClick={() => toggleDay(index)}
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
                            onChange={(e) => updateTime(index, "openTime", e.target.value)}
                            className="font-poppins text-sm bg-background border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-[100px]"
                          />
                        </div>
                        <span className="font-poppins text-sm text-muted-foreground">tot</span>
                        <input
                          type="time"
                          value={day.closeTime || "17:00"}
                          onChange={(e) => updateTime(index, "closeTime", e.target.value)}
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
            onClick={handleSave}
            disabled={saving || fetchingMonth}
            className="w-full bg-primary text-primary-foreground font-poppins font-semibold py-4 px-6 rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 text-lg"
          >
            {saving ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                Opslaan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Opslaan
              </>
            )}
          </button>
        </div>

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
