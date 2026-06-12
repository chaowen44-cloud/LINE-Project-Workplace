import React, { useState } from "react";
import { LapAdItem } from "../types";
import { Trash2, Edit2, Check, Plus, Eye, Megaphone, Target, Percent, TrendingUp, AlertCircle } from "lucide-react";
import { LAP_PLACEHOLDER_SVG_1 } from "../mockData";

const formatPeriod = (periodStr: string): string => {
  if (!periodStr) return "";
  
  // If already in MM/DD - MM/DD format, return as is
  const trimmed = periodStr.trim();
  if (/^\d{2}\/\d{2}\s*-\s*\d{2}\/\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // Split by common separators: to, and, -, ~, or spaces around them
  const parts = trimmed.split(/\s+(?:to|and|\-|~)\s+|\s*[\-~]\s*/);
  if (parts.length >= 2) {
    const formatPart = (p: string) => {
      const partTrim = p.trim();
      // Match YYYY-MM-DD or YYYY/MM/DD
      const ymdMatch = partTrim.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
      if (ymdMatch) {
        const m = ymdMatch[2].padStart(2, "0");
        const d = ymdMatch[3].padStart(2, "0");
        return `${m}/${d}`;
      }
      // Match MM-DD or MM/DD
      const mdMatch = partTrim.match(/^(\d{1,2})[-\/](\d{1,2})$/);
      if (mdMatch) {
        const m = mdMatch[1].padStart(2, "0");
        const d = mdMatch[2].padStart(2, "0");
        return `${m}/${d}`;
      }
      return partTrim;
    };
    const start = formatPart(parts[0]);
    const end = formatPart(parts[1]);
    return `${start} - ${end}`;
  }

  // Fallback: strip year if any, otherwise return
  return trimmed.replace(/\b\d{4}[-\/年]?/g, "");
};

interface LapAdsSectionProps {
  items: LapAdItem[];
  onUpdateItems: (items: LapAdItem[]) => void;
  onPreviewImage: (url: string, title: string) => void;
}

export default function LapAdsSection({ items, onUpdateItems, onPreviewImage }: LapAdsSectionProps) {
  // Local state to hold temporary edits for any row currently being edited
  const [editingData, setEditingData] = useState<{ [id: string]: LapAdItem }>({});

  const handleAddRow = () => {
    const newItem: LapAdItem = {
      id: `lap-${Date.now()}`,
      assetUrl: LAP_PLACEHOLDER_SVG_1,
      campaign: "New LAP Group Ad",
      period: "06/12 - 06/22",
      taGroup: "All Users, Aged 18-35",
      impression: "1,200,000",
      addedFriends: "5,400",
      ctr: "1.50%",
      cpm: "¥480",
      cpf: "¥85",
      cost: "¥576,000",
      isEditing: true,
    };
    // Initialize temporary editing data for the row
    setEditingData((prev) => ({ ...prev, [newItem.id]: { ...newItem, isEditing: undefined } }));
    onUpdateItems([newItem, ...items]);
  };

  const handleEditToggle = (id: string) => {
    onUpdateItems(
      items.map((item) => {
        if (item.id === id) {
          const toggledState = !item.isEditing;
          if (toggledState) {
            // Copy data to local editing state
            setEditingData((prev) => ({ ...prev, [id]: { ...item, isEditing: undefined } }));
          }
          return { ...item, isEditing: toggledState };
        }
        return item;
      })
    );
  };

  const handleSaveRow = (id: string) => {
    const updated = editingData[id];
    if (!updated) return;

    if (!updated.campaign.trim()) {
      alert("Campaign title cannot be empty.");
      return;
    }

    onUpdateItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...updated, isEditing: false };
        }
        return item;
      })
    );
    // Clean up local editing state
    setEditingData((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleDeleteRow = (id: string) => {
    if (window.confirm("Are you sure you want to delete this LAP ad row?")) {
      onUpdateItems(items.filter((item) => item.id !== id));
      setEditingData((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleLocalChange = (id: string, field: keyof LapAdItem, value: string) => {
    setEditingData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // Convert uploaded image to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Warning: This image is larger than 2MB. Please upload small assets to conserve browser LocalStorage memory.");
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      handleLocalChange(id, "assetUrl", base64String);
    };
    reader.onerror = () => {
      alert("Failed to process image file upload.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" id="lap-ads-container">
      {/* Header controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#00b8db] rounded-sm"></span>
            LINE LAP Ads Metrics
          </h2>

        </div>

        <div>
          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 bg-[#00b8db] hover:bg-[#009bba] text-white font-medium text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
            id="lap-add-btn"
          >
            <Plus className="w-4 h-4" />
            Add Ad Campaign
          </button>
        </div>
      </div>

      {/* Main Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <th className="px-4 py-4 w-[110px]">Assets</th>
              <th className="px-4 py-4 min-w-[180px]">Campaign</th>
              <th className="px-4 py-4">Period</th>
              <th className="px-4 py-4">TA Group</th>
              <th className="px-4 py-4 text-right">Impression</th>
              <th className="px-4 py-4 text-right">Add Friend</th>
              <th className="px-4 py-4 text-right">CTR</th>
              <th className="px-4 py-4 text-right">CPM</th>
              <th className="px-4 py-4 text-right">CPF</th>
              <th className="px-4 py-4 text-right">Cost</th>
              <th className="px-4 py-4 text-right w-[110px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {items.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                    <p className="font-medium text-slate-500">No LAP Ad metrics recorded</p>
                    <p className="text-xs text-slate-400">Click Add Ad Campaign to start tracking real-time programmatic ad flights.</p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const isEditing = !!item.isEditing;
                const activeData = isEditing ? editingData[item.id] || item : item;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Assets Thumbnail & Upload */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* Thumbnail view */}
                        <div
                          onClick={() => onPreviewImage(activeData.assetUrl, activeData.campaign)}
                          className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer shadow-xs hover:ring-2 hover:ring-blue-500 hover:scale-105 transition-all group relative"
                          title="Click to zoom preview"
                        >
                          <img
                            src={activeData.assetUrl || LAP_PLACEHOLDER_SVG_1}
                            alt="Ad asset thumbnail"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>

                        {/* File Upload Selector if editing */}
                        {isEditing && (
                          <div className="flex flex-col gap-1">
                            <label className="cursor-pointer text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded border border-blue-100 text-center">
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, item.id)}
                                className="hidden"
                                id={`lap-file-${item.id}`}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Campaign Name */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.campaign}
                          onChange={(e) => handleLocalChange(item.id, "campaign", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden font-medium"
                          placeholder="Campaign theme..."
                          id={`lap-cam-${item.id}`}
                        />
                      ) : (
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <Megaphone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          {item.campaign}
                        </div>
                      )}
                    </td>

                    {/* Period */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.period}
                          onChange={(e) => handleLocalChange(item.id, "period", e.target.value)}
                          className="w-[140px] bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden font-mono"
                          placeholder="e.g. 06/12 - 06/22"
                          id={`lap-per-${item.id}`}
                        />
                      ) : (
                        <span className="text-slate-600 font-mono text-xs">
                          {formatPeriod(item.period)}
                        </span>
                      )}
                    </td>

                    {/* Target Audience Group (TA) */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.taGroup}
                          onChange={(e) => handleLocalChange(item.id, "taGroup", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
                          placeholder="Target group..."
                          id={`lap-ta-${item.id}`}
                        />
                      ) : (
                        <span className="text-slate-700 text-xs bg-slate-100 flex items-center gap-1 w-fit px-2 py-1 rounded">
                          <Target className="w-3 h-3 text-slate-500" />
                          {item.taGroup}
                        </span>
                      )}
                    </td>

                    {/* Impression */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.impression}
                          onChange={(e) => handleLocalChange(item.id, "impression", e.target.value)}
                          className="w-[100px] text-right bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden font-mono"
                          placeholder="Impression counts"
                          id={`lap-imp-${item.id}`}
                        />
                      ) : (
                        <span className="font-mono text-xs text-slate-800 font-medium">{item.impression}</span>
                      )}
                    </td>

                    {/* Added Friends */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.addedFriends}
                          onChange={(e) => handleLocalChange(item.id, "addedFriends", e.target.value)}
                          className="w-[90px] text-right bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden font-mono"
                          placeholder="Added count"
                          id={`lap-add-${item.id}`}
                        />
                      ) : (
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          index === 0
                            ? "border border-[#d8bfcb] text-[#920933] bg-[#ede7e7]"
                            : "text-[#920933] bg-[#ede7e7]"
                        }`}>
                          +{item.addedFriends}
                        </span>
                      )}
                    </td>

                    {/* CTR */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.ctr}
                          onChange={(e) => handleLocalChange(item.id, "ctr", e.target.value)}
                          className="w-[70px] text-right bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden font-mono"
                          placeholder="CTR %"
                          id={`lap-ctr-${item.id}`}
                        />
                      ) : (
                        <span className="font-mono text-xs text-[#0d2c88] font-bold bg-[#eaeaf8] px-2 py-0.5 rounded flex items-center justify-end gap-0.5 w-fit ml-auto">
                          <Percent className="w-2.5 h-2.5" />
                          {item.ctr}
                        </span>
                      )}
                    </td>

                    {/* CPM */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.cpm}
                          onChange={(e) => handleLocalChange(item.id, "cpm", e.target.value)}
                          className="w-[80px] text-right bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden font-mono"
                          placeholder="CPM CPM"
                          id={`lap-cpm-${item.id}`}
                        />
                      ) : (
                        <span className="font-mono text-xs text-slate-700">{item.cpm}</span>
                      )}
                    </td>

                    {/* CPF */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.cpf}
                          onChange={(e) => handleLocalChange(item.id, "cpf", e.target.value)}
                          className="w-[80px] text-right bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden font-mono"
                          placeholder="CPF CPF"
                          id={`lap-cpf-${item.id}`}
                        />
                      ) : (
                        <span className="font-mono text-xs text-slate-700">{item.cpf}</span>
                      )}
                    </td>

                    {/* Cost */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.cost}
                          onChange={(e) => handleLocalChange(item.id, "cost", e.target.value)}
                          className="w-[100px] text-right bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden font-mono"
                          placeholder="Total budget"
                          id={`lap-cost-${item.id}`}
                        />
                      ) : (
                        <span className="font-mono text-xs text-slate-900 font-bold text-right flex items-center justify-end gap-1">
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                          {item.cost}
                        </span>
                      )}
                    </td>

                    {/* Actions panel */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveRow(item.id)}
                            className="p-1 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-xs rounded-md border border-blue-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                            id={`lap-save-${item.id}`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditToggle(item.id)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-md border border-slate-200 transition-colors cursor-pointer"
                            title="Edit Programmatic Ad Details"
                            id={`lap-edit-${item.id}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(item.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 text-rose-500 rounded-md border border-rose-100 transition-colors cursor-pointer"
                            title="Delete Programmatic Ad Row"
                            id={`lap-del-${item.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
