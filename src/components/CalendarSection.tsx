import React, { useState } from "react";
import { CalendarEvent } from "../types";
import { ChevronLeft, ChevronRight, Plus, X, Trash2, Calendar, ClipboardList } from "lucide-react";

interface CalendarSectionProps {
  events: CalendarEvent[];
  onUpdateEvents: (events: CalendarEvent[]) => void;
  referenceDate: string; // "2026-06-12"
}

const PRESET_COLORS = [
  { value: "#1e3a8a", label: "Navy Blue" },
  { value: "#223a9a", label: "Classic Deep Blue" },
  { value: "#5c1d24", label: "Wine Red" },
  { value: "#800020", label: "Burgundy" },
  { value: "#f5e6d3", label: "Soft Beige" },
  { value: "#d7c0a7", label: "Warm Beige" },
];

const isLightColor = (hexColor: string) => {
  if (!hexColor || hexColor.length < 6) return false;
  const base = hexColor.replace("#", "");
  const r = parseInt(base.substring(0, 2), 16);
  const g = parseInt(base.substring(2, 4), 16);
  const b = parseInt(base.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  return hsp > 175;
};


export default function CalendarSection({
  events,
  onUpdateEvents,
  referenceDate,
}: CalendarSectionProps) {
  // Parse initial state from reference date "2026-06-12"
  const initialDate = new Date(referenceDate);
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear() || 2026);
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth() || 5); // 0-indexed, 5 is June

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [startDateStr, setStartDateStr] = useState("");
  const [endDateStr, setEndDateStr] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].value);

  // Month Names list
  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  // Helper date generators
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleTodayClick = () => {
    const today = new Date(referenceDate);
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const openAddEventModal = (dateStr?: string) => {
    setSelectedEventId(null);
    setEventName("");
    setStartDateStr(dateStr || referenceDate);
    setEndDateStr(dateStr || referenceDate);
    setSelectedColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)].value);
    setIsModalOpen(true);
  };

  const openEditEventModal = (event: CalendarEvent) => {
    setSelectedEventId(event.id);
    setEventName(event.name);
    setStartDateStr(event.startDate);
    setEndDateStr(event.endDate || event.startDate);
    setSelectedColor(event.color);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !startDateStr || !endDateStr) {
      alert("Please fill in all event fields.");
      return;
    }

    if (new Date(startDateStr) > new Date(endDateStr)) {
      alert("Start Date cannot be after End Date.");
      return;
    }

    if (selectedEventId) {
      // Edit
      onUpdateEvents(
        events.map((evt) =>
          evt.id === selectedEventId
            ? { ...evt, name: eventName, startDate: startDateStr, endDate: endDateStr, color: selectedColor }
            : evt
        )
      );
    } else {
      // Create
      const newEvent: CalendarEvent = {
        id: `evt-${Date.now()}`,
        name: eventName,
        startDate: startDateStr,
        endDate: endDateStr,
        color: selectedColor,
      };
      onUpdateEvents([...events, newEvent]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteEvent = () => {
    if (!selectedEventId) return;
    if (window.confirm("Are you sure you want to delete this calendar event?")) {
      onUpdateEvents(events.filter((evt) => evt.id !== selectedEventId));
      setIsModalOpen(false);
    }
  };

  // Generate calendar cells (grid view)
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  // Prev month filler padding days
  const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYearIdx = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevYearIdx, prevMonthIdx);

  const prevMonthPadding: { dayNum: number; dateStr: string; currentMonth: boolean }[] = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dNum = daysInPrevMonth - i;
    const mStr = String(prevMonthIdx + 1).padStart(2, "0");
    const dStr = String(dNum).padStart(2, "0");
    prevMonthPadding.push({
      dayNum: dNum,
      dateStr: `${prevYearIdx}-${mStr}-${dStr}`,
      currentMonth: false,
    });
  }

  // Current month days
  const currentMonthDays: { dayNum: number; dateStr: string; currentMonth: boolean }[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const mStr = String(currentMonth + 1).padStart(2, "0");
    const dStr = String(i).padStart(2, "0");
    currentMonthDays.push({
      dayNum: i,
      dateStr: `${currentYear}-${mStr}-${dStr}`,
      currentMonth: true,
    });
  }

  // Next month filler padding days to fill 6 rows (42 cells total)
  const totalCells = 42;
  const nextMonthPaddingNeeded = totalCells - (prevMonthPadding.length + currentMonthDays.length);
  const nextMonthPadding: { dayNum: number; dateStr: string; currentMonth: boolean }[] = [];
  const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYearIdx = currentMonth === 11 ? currentYear + 1 : currentYear;

  for (let i = 1; i <= nextMonthPaddingNeeded; i++) {
    const mStr = String(nextMonthIdx + 1).padStart(2, "0");
    const dStr = String(i).padStart(2, "0");
    nextMonthPadding.push({
      dayNum: i,
      dateStr: `${nextYearIdx}-${mStr}-${dStr}`,
      currentMonth: false,
    });
  }

  const allCells = [...prevMonthPadding, ...currentMonthDays, ...nextMonthPadding];

  // Filter out Sunday (0) and Saturday (6) to only show Monday through Friday
  const filteredCells = allCells.filter((_, idx) => {
    const dayOfWeek = idx % 7;
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  });

  // Helper to determine active overlapping events for a given cell date
  const getEventsForDate = (dateStr: string) => {
    const cellTime = new Date(dateStr).getTime();
    return events
      .filter((evt) => {
        const start = new Date(evt.startDate).getTime();
        const end = new Date(evt.endDate || evt.startDate).getTime();
        return cellTime >= start && cellTime <= end;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime() || a.name.localeCompare(b.name));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" id="calendar-container">
      {/* Calendar Header block */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#223a9a] border border-[#223a9a] rounded-sm"></span>
            LINE Calendar
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Calendar Select Month Sliders */}
          <div className="inline-flex bg-slate-100/80 p-1 rounded-lg border border-slate-200">
            <button
              onClick={handlePrevMonth}
              className="p-1 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all font-medium text-sm cursor-pointer"
              title="Previous Month"
              id="calendar-prev-btn"
            >
              <ChevronLeft className="w-4 h-4 inline" />
            </button>
            <div className="px-4 py-1 text-xs font-bold text-slate-800 flex items-center min-w-[130px] justify-center select-none font-mono">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all font-medium text-sm cursor-pointer"
              title="Next Month"
              id="calendar-next-btn"
            >
              <ChevronRight className="w-4 h-4 inline" />
            </button>
          </div>

          <button
            onClick={handleTodayClick}
            className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg font-medium text-xs transition-colors cursor-pointer"
            id="calendar-today-btn"
          >
            Reset
          </button>

          <button
            onClick={() => openAddEventModal()}
            className="inline-flex items-center gap-1.5 bg-[#223a9a] hover:bg-[#1a2e7c] border border-[#223a9a] text-white font-medium text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
            id="calendar-add-event-btn"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Weekday Names row */}
      <div className="grid grid-cols-5 border-b border-slate-100 bg-slate-50 text-center py-2 text-xs font-semibold text-slate-500 uppercase tracking-older">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-5 gap-px bg-slate-200">
        {filteredCells.map((cell, idx) => {
          const isToday = cell.dateStr === referenceDate;
          const dayEvents = getEventsForDate(cell.dateStr);

          return (
            <div
              key={`${cell.dateStr}-${idx}`}
              onClick={() => openAddEventModal(cell.dateStr)}
              className={`min-h-[78px] bg-white p-1.5 flex flex-col gap-1 transition-all relative group cursor-pointer hover:bg-slate-50/45 ${
                !cell.currentMonth ? "text-slate-300 bg-slate-50/10" : "text-slate-800"
              } ${isToday ? "ring-2 ring-[#223a9a] z-10" : ""}`}
            >
              {/* Day Number Label */}
              <div className="flex items-center justify-between pointer-events-none select-none mb-1">
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                    isToday
                      ? "bg-[#223a9a] text-white shadow-xs"
                      : cell.currentMonth
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  {cell.dayNum}
                </span>

                {isToday && (
                  <span className="text-[9px] font-bold text-[#223a9a] uppercase tracking-widest">
                    Today
                  </span>
                )}
              </div>

              {/* Event Bars List for this Day */}
              <div className="flex flex-col gap-1 overflow-hidden pointer-events-auto">
                {dayEvents.map((evt) => {
                  const isStart = cell.dateStr === evt.startDate;
                  const isEnd = cell.dateStr === evt.endDate;

                  // Corner rounding styling based on event period coverage
                  let rClass = "rounded-none";
                  if (isStart && isEnd) rClass = "rounded-md mx-0.5";
                  else if (isStart) rClass = "rounded-l-md ml-0.5 mr-0";
                  else if (isEnd) rClass = "rounded-r-md mr-0.5 ml-0";

                  const isLight = isLightColor(evt.color);

                  // Inline styles for colors so they display beautifully
                  return (
                    <div
                      key={evt.id}
                      onClick={(e) => {
                        e.stopPropagation(); // Stop clicking day cell parent
                        openEditEventModal(evt);
                      }}
                      style={{ backgroundColor: evt.color }}
                      className={`text-[10px] font-bold px-1.5 py-1 transition-transform hover:scale-[1.02] active:scale-95 truncate shadow-xs flex items-center justify-between ${
                        isLight ? "text-slate-800" : "text-white"
                      } ${rClass}`}
                      title={`${evt.name} (${evt.startDate} to ${evt.endDate})`}
                    >
                      {/* Show text only on start day or if single day event to avoid overlap text mess */}
                      <span className="truncate leading-none pointer-events-none">
                        {isStart || cell.dayNum === 1 ? evt.name : "\u00A0"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Day Cell Empty Indicator (only visible on hover for creating) */}
              <span className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 text-[10px] text-blue-500 font-medium transition-opacity pointer-events-none">
                + Add
              </span>
            </div>
          );
        })}
      </div>

      {/* Popover Event Addition / Detail Modification Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 outline-hidden max-w-md w-full shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                {selectedEventId ? "Modify Calendar Event" : "Create Calendar Event"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. Sticker Drop, Coupon Blast"
                  className="w-full bg-white border border-slate-300 rounded-md p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
                  id="calendar-event-name-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md p-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
                    id="calendar-event-start-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDateStr}
                    onChange={(e) => setEndDateStr(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md p-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
                    id="calendar-event-end-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Color Scheme Accent
                </label>
                <div className="flex gap-2.5">
                  {PRESET_COLORS.map((col) => (
                    <button
                      key={col.value}
                      type="button"
                      onClick={() => setSelectedColor(col.value)}
                      style={{ backgroundColor: col.value }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        selectedColor === col.value
                          ? "ring-4 ring-offset-2 ring-blue-400 scale-105"
                          : "hover:scale-105"
                      }`}
                      title={col.label}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {selectedEventId ? (
                  <button
                    type="button"
                    onClick={handleDeleteEvent}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    id="calendar-event-delete-btn"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Event
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
                    id="calendar-event-submit-btn"
                  >
                    {selectedEventId ? "Save Changes" : "Create Event"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
