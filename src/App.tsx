import React, { useState, useEffect } from "react";
import { TimelineItem, CalendarEvent, PushItem, LapAdItem } from "./types";
import {
  defaultTimelineItems,
  defaultCalendarEvents,
  defaultPushItems,
  defaultLapAdItems
} from "./mockData";
import TimelineSection from "./components/TimelineSection";
import CalendarSection from "./components/CalendarSection";
import PushSection from "./components/PushSection";
import LapAdsSection from "./components/LapAdsSection";
import {
  FolderKanban,
  CalendarDays,
  Target,
  Send,
  ArrowRight,
  TrendingUp,
  Award,
  Users2,
  X,
  Search,
  Settings,
  HelpCircle,
  Clock,
  Download,
  RotateCcw
} from "lucide-react";

export default function App() {
  // --- Persistent States ---
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(() => {
    const saved = localStorage.getItem("pm_timeline_items");
    return saved ? JSON.parse(saved) : defaultTimelineItems;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem("pm_calendar_events");
    return saved ? JSON.parse(saved) : defaultCalendarEvents;
  });

  const [pushItems, setPushItems] = useState<PushItem[]>(() => {
    const saved = localStorage.getItem("pm_push_items");
    return saved ? JSON.parse(saved) : defaultPushItems;
  });

  const [lapAdItems, setLapAdItems] = useState<LapAdItem[]>(() => {
    const saved = localStorage.getItem("pm_lap_ad_items");
    return saved ? JSON.parse(saved) : defaultLapAdItems;
  });

  // Reference current date for progress calculations (default to simulated 2026-06-12)
  const [referenceDate, setReferenceDate] = useState("2026-06-12");

  // Filter Search Queries
  const [searchQuery, setSearchQuery] = useState("");

  // Visual View Tab selector ("timeline", "calendar", "push", "lap")
  const [activeTab, setActiveTab] = useState<"timeline" | "calendar" | "push" | "lap">("timeline");

  // Global Image Lightbox Modal Previewing State
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");

  // --- Sync storage ---
  useEffect(() => {
    localStorage.setItem("pm_timeline_items", JSON.stringify(timelineItems));
  }, [timelineItems]);

  useEffect(() => {
    localStorage.setItem("pm_calendar_events", JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem("pm_push_items", JSON.stringify(pushItems));
  }, [pushItems]);

  useEffect(() => {
    localStorage.setItem("pm_lap_ad_items", JSON.stringify(lapAdItems));
  }, [lapAdItems]);

  // --- Dynamic Dashboard Widget Computations ---
  const totalProjects = timelineItems.length;
  const pushCampaignsCount = pushItems.length;

  const totalReach = pushItems.reduce((acc, item) => {
    const digits = String(item.reach).replace(/[^0-9]/g, "");
    const parsed = parseInt(digits, 10);
    return acc + (isNaN(parsed) ? 0 : parsed);
  }, 0);

  const averageCtr = (() => {
    if (lapAdItems.length === 0) return 0;
    const totalCtr = lapAdItems.reduce((acc, item) => {
      const numeric = parseFloat(String(item.ctr).replace(/[^0-9.]/g, ""));
      return acc + (isNaN(numeric) ? 0 : numeric);
    }, 0);
    return Number((totalCtr / lapAdItems.length).toFixed(2));
  })();

  // Reset to initial mock data
  const handleResetToFactoryDefault = () => {
    if (window.confirm("Are you sure you want to reset all tracking statistics to initial factory mockup benchmarks? This overrides localStorage.")) {
      setTimelineItems(defaultTimelineItems);
      setCalendarEvents(defaultCalendarEvents);
      setPushItems(defaultPushItems);
      setLapAdItems(defaultLapAdItems);
      setReferenceDate("2026-06-12");
      setSearchQuery("");
      setActiveTab("timeline");
    }
  };

  // Launch modal preview from inline thumbnails
  const handlePreviewImageTrigger = (url: string, title: string) => {
    setPreviewImage(url);
    setPreviewTitle(title || "Campaign Asset Showcase");
  };

  // --- Search query filtering logic across different components ---
  const filteredTimeline = timelineItems.filter(item =>
    item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.note.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPush = pushItems.filter(item =>
    item.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.actionPoints.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLap = lapAdItems.filter(item =>
    item.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.taGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white" id="main-app">
      {/* Top Universal Corporate Alert Header banner */}
      <div className="bg-slate-900 text-slate-300 py-2.5 px-4 text-xs font-medium flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="font-semibold text-white">Line Corporate Systems</span>
          <span className="text-slate-400">|</span>
          <span className="font-mono text-slate-400">Workspace Active: Tokyo Central</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-slate-200">System Today: {referenceDate}</span>
          </div>
          <button
            onClick={handleResetToFactoryDefault}
            className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-400 px-2 py-0.5 rounded border border-slate-700 transition-colors cursor-pointer"
            title="Scribble override state and replenish demo benchmarks"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Data
          </button>
        </div>
      </div>

      {/* Main Suite Hero Branding Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-6 sm:px-8">
        <div className="max-w-[1550px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#223a9a] bg-blue-50 border border-[#bcf1f9] font-['Verdana'] px-2.5 py-1 rounded-full uppercase tracking-wider">
              LINE Ecosystem Management
            </span>
            <h1 className="text-[30px] font-bold tracking-tight text-slate-900 mt-2 font-[system-ui] leading-[40px] text-left">
              LINE Project Workplace
            </h1>
            <p className="text-slate-500 text-[11px] font-normal font-['Verdana'] mt-1 max-w-2xl">
              LINE Project Timeline - LINE Calendar - OA Push - LAP Ads
            </p>
          </div>

          {/* Quick Universal Filter Input */}
          <div className="relative max-w-sm w-full shrink-0">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search campaigns, PICs, audiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden transition-all text-slate-800 font-medium"
              id="global-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>


      {/* Corporate Tab selectors */}
      <section className="px-6 sm:px-8 max-w-[1550px] mx-auto">
        <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto pb-px scrollbar-none">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`py-3 px-4 font-semibold text-xs border-b-2 transition-all whitespace-nowrap cursor-pointer uppercase tracking-wider ${
              activeTab === "timeline"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
            id="tab-timeline"
          >
            LINE Project Timeline
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`py-3 px-4 font-semibold text-xs border-b-2 transition-all whitespace-nowrap cursor-pointer uppercase tracking-wider ${
              activeTab === "calendar"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
            id="tab-calendar"
          >
            LINE Calendar
          </button>
          <button
            onClick={() => setActiveTab("push")}
            className={`py-3 px-4 font-semibold text-xs border-b-2 transition-all whitespace-nowrap cursor-pointer uppercase tracking-wider ${
              activeTab === "push"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
            id="tab-push"
          >
            OA Push
          </button>
          <button
            onClick={() => setActiveTab("lap")}
            className={`py-3 px-4 font-semibold text-xs border-b-2 transition-all whitespace-nowrap cursor-pointer uppercase tracking-wider ${
              activeTab === "lap"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
            id="tab-lap"
          >
            LAP Ads
          </button>
        </div>
      </section>

      {/* Main Sections block wrapper */}
      <main className="px-6 sm:px-8 py-6 max-w-[1550px] mx-auto space-y-8 pb-20">
        
        {/* Dynamic Section showing alerts if results are isolated using search */}
        {searchQuery && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between text-yellow-800 text-xs font-medium">
            <span>
              ℹ️ Displaying search outcomes filtering database rows for keyword: <strong>"{searchQuery}"</strong>.
            </span>
            <button
              onClick={() => setSearchQuery("")}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border border-yellow-300 px-2 py-0.5 rounded cursor-pointer transition-colors"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* SECTION 1: LINE Project Timeline */}
        {activeTab === "timeline" && (
          <div className="transition-all" id="sec-timeline">
            <TimelineSection
              items={filteredTimeline}
              referenceDate={referenceDate}
              setReferenceDate={setReferenceDate}
              onUpdateItems={setTimelineItems}
            />
          </div>
        )}

        {/* SECTION 2: LINE Calendar */}
        {activeTab === "calendar" && (
          <div className="transition-all" id="sec-calendar">
            <CalendarSection
              events={calendarEvents}
              onUpdateEvents={setCalendarEvents}
              referenceDate={referenceDate}
            />
          </div>
        )}

        {/* SECTION 3: LINE Push Messages */}
        {activeTab === "push" && (
          <div className="transition-all" id="sec-push">
            <PushSection
              items={filteredPush}
              onUpdateItems={setPushItems}
              onPreviewImage={handlePreviewImageTrigger}
            />
          </div>
        )}

        {/* SECTION 4: LAP Ads Programmatic metrics */}
        {activeTab === "lap" && (
          <div className="transition-all" id="sec-lap">
            <LapAdsSection
              items={filteredLap}
              onUpdateItems={setLapAdItems}
              onPreviewImage={handlePreviewImageTrigger}
            />
          </div>
        )}

      </main>

      {/* Full-Screen Image Lightbox Showcase Preview Popover Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl max-w-2xl w-full animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest block">
                  Campaign Visual Asset Zoom
                </span>
                <span className="text-sm font-bold text-slate-800 block truncate max-w-[400px]">
                  {previewTitle || "Ad Ops Showcase"}
                </span>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors cursor-pointer"
                title="Dismiss image preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-900 flex items-center justify-center max-h-[500px] overflow-hidden group relative">
              <img
                src={previewImage}
                alt={previewTitle}
                className="max-h-[400px] max-w-full object-contain rounded-lg shadow-lg border border-slate-700/50"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-[10px] text-slate-400 font-mono">
                Source type: JPEG/PNG/SVG base64 string
              </div>
              <a
                href={previewImage}
                download={`${previewTitle.replace(/\s+/g, "_")}_asset.png`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Download this asset locally to storage"
              >
                <Download className="w-3.5 h-3.5" />
                Download Media
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Corporate Dashboard Compact Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-20">
        <div className="max-w-[1550px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; 2026 Line Marketing Ops. Built for high efficiency workspace performance.
          </div>
          <div className="flex gap-4">
            <span className="text-slate-300">Offline LocalStorage Engine: Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
