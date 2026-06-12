import React, { useState } from "react";
import { PushItem } from "../types";
import { Trash2, Edit2, Check, Plus, Image, Eye, MessageSquare, AlertCircle } from "lucide-react";
import { PUSH_PLACEHOLDER_SVG } from "../mockData";

interface PushSectionProps {
  items: PushItem[];
  onUpdateItems: (items: PushItem[]) => void;
  onPreviewImage: (url: string, title: string) => void;
}

export default function PushSection({ items, onUpdateItems, onPreviewImage }: PushSectionProps) {
  // Local state to hold temporary edits for any row currently being edited
  const [editingData, setEditingData] = useState<{ [id: string]: PushItem }>({});

  const handleAddRow = () => {
    const newItem: PushItem = {
      id: `push-${Date.now()}`,
      assetUrl: PUSH_PLACEHOLDER_SVG,
      campaign: "New Push Campaign",
      pushTime: new Date().toISOString().slice(0, 16), // current datetime-local formatted
      reach: "0",
      openRate: "0.0%",
      actionPoints: "Awaiting copy validation.",
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
    if (window.confirm("Are you sure you want to delete this push schedule row?")) {
      onUpdateItems(items.filter((item) => item.id !== id));
      setEditingData((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleLocalChange = (id: string, field: keyof PushItem, value: string) => {
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

    // Size check - LocalStorage limit is usually 5MB, warn for big images
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

  // Formatting push datetime for human viewing
  const formatPushTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return "Not Scheduled";
    try {
      const d = new Date(dateTimeStr);
      if (isNaN(d.getTime())) return dateTimeStr;
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return dateTimeStr;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" id="push-container">
      {/* Header controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-cyan-500 rounded-sm"></span>
            LINE Push Messages
          </h2>
        </div>

        <div>
          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
            id="push-add-btn"
          >
            <Plus className="w-4 h-4" />
            Add Push Message
          </button>
        </div>
      </div>

      {/* Main Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <th className="px-5 py-4 w-[110px]">Assets</th>
              <th className="px-5 py-4">Campaign</th>
              <th className="px-5 py-4">Push Time</th>
              <th className="px-5 py-4">Reach</th>
              <th className="px-5 py-4">Open Rate</th>
              <th className="px-5 py-4">Action Points</th>
              <th className="px-5 py-4 text-right w-[110px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                    <p className="font-medium text-slate-500">No push items listed</p>
                    <p className="text-xs text-slate-400">Click Add Push Message to construct a new broadcast schedule.</p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isEditing = !!item.isEditing;
                const activeData = isEditing ? editingData[item.id] || item : item;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Assets Thumbnail & Upload */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {/* Thumbnail View */}
                        <div
                          onClick={() => onPreviewImage(activeData.assetUrl, activeData.campaign)}
                          className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer shadow-xs hover:ring-2 hover:ring-cyan-500 hover:scale-105 transition-all group relative"
                          title="Click to zoom preview"
                        >
                          <img
                            src={activeData.assetUrl || PUSH_PLACEHOLDER_SVG}
                            alt="Campaign thumbnail"
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
                            <label className="cursor-pointer text-[10px] font-bold text-cyan-600 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-1.5 py-0.5 rounded border border-cyan-100 text-center">
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, item.id)}
                                className="hidden"
                                id={`push-file-${item.id}`}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Campaign Title */}
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.campaign}
                          onChange={(e) => handleLocalChange(item.id, "campaign", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-hidden font-medium"
                          placeholder="Campaign theme..."
                          id={`push-cam-${item.id}`}
                        />
                      ) : (
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          {item.campaign}
                        </div>
                      )}
                    </td>

                    {/* Push Time */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="datetime-local"
                          value={activeData.pushTime}
                          onChange={(e) => handleLocalChange(item.id, "pushTime", e.target.value)}
                          className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-hidden text-slate-700"
                          id={`push-time-${item.id}`}
                        />
                      ) : (
                        <span className="text-slate-700 font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                          {formatPushTime(item.pushTime)}
                        </span>
                      )}
                    </td>

                    {/* Reach */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.reach}
                          onChange={(e) => handleLocalChange(item.id, "reach", e.target.value)}
                          className="w-[100px] bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-hidden font-mono"
                          placeholder="e.g. 150,000"
                          id={`push-reach-${item.id}`}
                        />
                      ) : (
                        <span className="text-slate-800 font-mono font-medium">{item.reach || "0"}</span>
                      )}
                    </td>

                    {/* Open Rate */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.openRate}
                          onChange={(e) => handleLocalChange(item.id, "openRate", e.target.value)}
                          className="w-[80px] bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-hidden font-mono"
                          placeholder="e.g. 21.4%"
                          id={`push-open-${item.id}`}
                        />
                      ) : (
                        <span className="text-slate-800 font-mono font-medium bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full text-xs">
                          {item.openRate || "0.0%"}
                        </span>
                      )}
                    </td>

                    {/* Action Points */}
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.actionPoints}
                          onChange={(e) => handleLocalChange(item.id, "actionPoints", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-hidden"
                          placeholder="Add strategic action indicators..."
                          id={`push-act-${item.id}`}
                        />
                      ) : (
                        <p className="text-slate-600 text-xs line-clamp-2 max-w-[240px]" title={item.actionPoints}>
                          {item.actionPoints || <span className="text-slate-400 italic">None</span>}
                        </p>
                      )}
                    </td>

                    {/* Actions controls */}
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveRow(item.id)}
                            className="p-1 px-2.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-medium text-xs rounded-md border border-cyan-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                            id={`push-save-${item.id}`}
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
                            title="Edit push campaign Details"
                            id={`push-edit-${item.id}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(item.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 text-rose-500 rounded-md border border-rose-100 transition-colors cursor-pointer"
                            title="Delete campaign Row"
                            id={`push-del-${item.id}`}
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
