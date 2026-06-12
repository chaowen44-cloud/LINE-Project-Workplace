import { TimelineItem, CalendarEvent, PushItem, LapAdItem } from "./types";

export const PUSH_PLACEHOLDER_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='120' height='120' rx='10' fill='%2306b6d4'/><circle cx='60' cy='50' r='18' fill='white' opacity='0.2'/><path d='M45 75 L60 60 L75 75 Z' fill='white'/><text x='60' y='105' fill='white' font-family='sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>Voucher Push</text></svg>";

export const LAP_PLACEHOLDER_SVG_1 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='120' height='120' rx='10' fill='%233b82f6'/><circle cx='60' cy='50' r='15' fill='white' opacity='0.25'/><rect x='40' y='65' width='40' height='20' rx='4' fill='white' opacity='0.3'/><text x='60' y='105' fill='white' font-family='sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>Fashion Ad</text></svg>";

export const LAP_PLACEHOLDER_SVG_2 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='120' height='120' rx='10' fill='%23f97316'/><path d='M40 40 L80 80 M80 40 L40 80' stroke='white' stroke-width='4' opacity='0.3'/><text x='60' y='105' fill='white' font-family='sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>Food Campaign</text></svg>";

export const defaultTimelineItems: TimelineItem[] = [
  {
    id: "timeline-1",
    project: "LINE Official Account Redesign",
    startDate: "2026-06-01",
    etcDate: "2026-06-30",
    pic: "Sarah Chen",
    note: "Migrating rich menu configurations to the new design guidelines."
  },
  {
    id: "timeline-2",
    project: "LINE Summer Promo Campaign",
    startDate: "2026-06-15",
    etcDate: "2026-06-25",
    pic: "Kenji Sato",
    note: "Pre-launch tests are underway. Assets are being prepared."
  },
  {
    id: "timeline-3",
    project: "LINE Stickers Launch & Collab",
    startDate: "2026-05-01",
    etcDate: "2026-06-10",
    pic: "Elena Rostova",
    note: "Finished stickers approval process. Event is now live."
  },
  {
    id: "timeline-4",
    project: "LINE Reward Points Bonanza",
    startDate: "2026-06-05",
    etcDate: "2026-06-15",
    pic: "Hiroshi Tanaka",
    note: "Halfway through. Daily active participations are high."
  }
];

export const defaultCalendarEvents: CalendarEvent[] = [
  {
    id: "evt-1",
    name: "Sticker Launch Promo",
    startDate: "2026-06-09",
    endDate: "2026-06-12",
    color: "#ec4899" // Pink-500
  },
  {
    id: "evt-2",
    name: "Summer Campaign Prep",
    startDate: "2026-06-15",
    endDate: "2026-06-18",
    color: "#3b82f6" // Blue-500
  },
  {
    id: "evt-3",
    name: "Weekly Campaign Sync",
    startDate: "2026-06-08",
    endDate: "2026-06-08",
    color: "#10b981" // Emerald-500
  },
  {
    id: "evt-4",
    name: "LINE Push Broadcast Peak",
    startDate: "2026-06-12",
    endDate: "2026-06-13",
    color: "#8b5cf6" // Violet-500
  },
  {
    id: "evt-5",
    name: "Global Ads Review",
    startDate: "2026-06-23",
    endDate: "2026-06-25",
    color: "#f59e0b" // Amber-500
  }
];

export const defaultPushItems: PushItem[] = [
  {
    id: "push-1",
    assetUrl: PUSH_PLACEHOLDER_SVG,
    campaign: "Summer Fest Coupon Push",
    pushTime: "2026-06-12T12:00",
    reach: "185,000",
    openRate: "24.5%",
    actionPoints: "A/B tested headers. Target sub-group: Active 30d users."
  },
  {
    id: "push-2",
    assetUrl: PUSH_PLACEHOLDER_SVG,
    campaign: "New Stickers Collab Alert",
    pushTime: "2026-06-10T18:30",
    reach: "320,000",
    openRate: "18.9%",
    actionPoints: "Direct rich menu sticker-shop deep link enabled."
  }
];

export const defaultLapAdItems: LapAdItem[] = [
  {
    id: "lap-1",
    assetUrl: LAP_PLACEHOLDER_SVG_1,
    campaign: "LAP Summer Apparel Banner",
    period: "2026-06-01 to 2026-06-20",
    taGroup: "Female 20-34, Retail Interests",
    impression: "2,450,000",
    addedFriends: "14,800",
    ctr: "2.14%",
    cpm: "¥450",
    cpf: "¥75",
    cost: "¥1,110,000"
  },
  {
    id: "lap-2",
    assetUrl: LAP_PLACEHOLDER_SVG_2,
    campaign: "LAP Food Delivery Double-Points",
    period: "2026-06-08 to 2026-06-15",
    taGroup: "All 18-45, Foodie & Tech Interests",
    impression: "1,890,000",
    addedFriends: "9,200",
    ctr: "1.85%",
    cpm: "¥510",
    cpf: "¥90",
    cost: "¥860,000"
  }
];
