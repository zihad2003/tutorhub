import { C } from "../constants/tokens";
import { PrimaryButton, SecondaryButton, Badge } from "../components/ui";
import { Calendar, Clock, CheckCircle, Save } from "lucide-react";
import { useState } from "react";

export function Availability({ onNavigate }) {
  const [selectedDays, setSelectedDays] = useState(["Sunday", "Tuesday", "Thursday"]);
  const [selectedTime, setSelectedTime] = useState("Evening (4:00 PM - 8:00 PM)");
  const [maxStudents, setMaxStudents] = useState("4");
  const [saved, setSaved] = useState(false);

  const daysOfWeek = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "Morning (8:00 AM - 12:00 PM)",
    "Afternoon (12:00 PM - 4:00 PM)",
    "Evening (4:00 PM - 8:00 PM)",
    "Night (8:00 PM - 10:00 PM)",
  ];

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => onNavigate("tutor-dashboard")}
            className="mb-6 text-sm font-semibold"
            style={{ color: C.primary }}
          >
            &larr; Back to dashboard
          </button>

          <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Teaching Availability</h1>
          <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
            Set your preferred days, working hours, and student capacity.
          </p>

          {saved && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle size={18} />
              Availability preferences updated successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="mt-6 space-y-6">
            <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
              <label className="mb-3 block text-sm font-semibold" style={{ color: C.text }}>
                <Calendar size={18} className="mr-2 inline" color={C.primary} />
                Preferred Teaching Days
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {daysOfWeek.map((day) => {
                  const active = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`rounded-lg border py-2.5 px-3 text-sm font-semibold transition-all duration-150 ${
                        active 
                          ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm" 
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                      style={{ borderColor: active ? C.primary : C.border }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
              <label className="mb-3 block text-sm font-semibold" style={{ color: C.text }}>
                <Clock size={18} className="mr-2 inline" color={C.primary} />
                Preferred Time Slot
              </label>
              <div className="space-y-2">
                {timeSlots.map((slot) => {
                  const active = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => { setSelectedTime(slot); setSaved(false); }}
                      className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm font-semibold transition-all duration-150 ${
                        active 
                          ? "border-blue-600 bg-blue-50 text-blue-600" 
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                      style={{ borderColor: active ? C.primary : C.border }}
                    >
                      <span>{slot}</span>
                      {active && <Badge tone="accent">Selected</Badge>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
              <label className="mb-2 block text-sm font-semibold" style={{ color: C.text }}>
                Maximum Active Students Capacity
              </label>
              <select
                value={maxStudents}
                onChange={(e) => { setMaxStudents(e.target.value); setSaved(false); }}
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none"
                style={{ borderColor: C.border, color: C.text }}
              >
                <option value="2">2 Students</option>
                <option value="4">4 Students</option>
                <option value="6">6 Students</option>
                <option value="8">8+ Students</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <SecondaryButton onClick={() => onNavigate("tutor-dashboard")}>Cancel</SecondaryButton>
              <PrimaryButton type="submit">
                <Save size={16} className="mr-1.5 inline" /> Save Preferences
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
