import React, { useState } from "react";
import { TimelineItem } from "../types";
import { Trash2, Edit2, Check, Plus, Calendar, AlertCircle } from "lucide-react";

interface TimelineSectionProps {
  items: TimelineItem[];
  referenceDate: string;
  setReferenceDate: (date: string) => void;
  onUpdateItems: (items: TimelineItem[]) => void;
}

export default function TimelineSection({
  items,
  referenceDate,
  setReferenceDate,
  onUpdateItems,
}: TimelineSectionProps) {
  // Local state to keep track of temporary edits while editing a row
  const [editingData, setEditingData] = useState<{ [id: string]: TimelineItem }>({});

  const calculateProgress = (startStr: string, etcStr: string) => {
    if (!startStr || !etcStr) return 0;
    const start = new Date(startStr).getTime();
    const etc = new Date(etcStr).getTime();
    const today = new Date(referenceDate).getTime();

    if (isNaN(start) || isNaN(etc) || isNaN(today)) return 0;
    if (today < start) return 0;
    if (today > etc) return 100;

    const total = etc - start;
    if (total <= 0) return 100;

    const percent = ((today - start) / total) * 100;
    return Math.min(100, Math.max(0, Math.round(percent)));
  };

  const getProgressColorClass = (percent: number) => {
    if (percent <= 25) return "bg-rose-500";
    if (percent <= 50) return "bg-amber-500";
    if (percent <= 75) return "bg-emerald-500";
    return "bg-blue-500";
  };

  const handleAddRow = () => {
    const newItem: TimelineItem = {
      id: `timeline-${Date.now()}`,
      project: "New Project",
      startDate: referenceDate,
      etcDate: new Date(new Date(referenceDate).getTime() + 10 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // Default 10 days out
      pic: "Unassigned",
      note: "Pending launch outline.",
      isEditing: true,
      completed: false,
    };
    // Initialize temporary editing data for the new row
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
          } else {
            // Saving - apply local editing data
            const updated = editingData[id];
            if (updated) {
              return { ...updated, isEditing: false };
            }
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

    if (!updated.project.trim()) {
      alert("Project name cannot be empty.");
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
    if (window.confirm("Are you sure you want to delete this project timeline?")) {
      onUpdateItems(items.filter((item) => item.id !== id));
      setEditingData((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleToggleComplete = (id: string) => {
    onUpdateItems(
      items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleLocalChange = (id: string, field: keyof TimelineItem, value: any) => {
    setEditingData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" id="timeline-container">
      {/* Header controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#223a9a] border border-[#223a9a] rounded-sm"></span>
            LINE Project Timeline
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <Calendar className="w-4 h-4 text-white bg-[#223a9a] rounded-sm p-0.5" />
            <span className="text-xs font-medium text-slate-600">Simulate Today:</span>
            <input
              type="date"
              value={referenceDate}
              onChange={(e) => setReferenceDate(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent outline-hidden cursor-pointer"
              title="Change simulated project evaluation date to calculate status progress dynamically"
            />
          </div>

          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 bg-[#223a9a] hover:bg-[#1a2e7c] text-white font-medium text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
            id="timeline-add-btn"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      </div>

      {/* Main Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border-spacing-0">
          <thead>
            <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <th className="px-5 py-4 w-1/3">Project</th>
              <th className="px-5 py-4">Note</th>
              <th className="px-5 py-4 w-[140px]">ETC</th>
              <th className="px-5 py-4 w-[160px]">PIC</th>
              <th className="px-5 py-4 text-right w-[110px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                    <p className="font-medium text-slate-500">No active projects found</p>
                    <p className="text-xs text-slate-400">Click Add Project to create a customizable timeline row.</p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isEditing = !!item.isEditing;
                const activeData = isEditing ? editingData[item.id] || item : item;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Project Name and Checkbox */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!!item.completed}
                          onChange={() => handleToggleComplete(item.id)}
                          className="w-4 h-4 text-[#223a9a] hover:text-[#1a2e7c] border-slate-300 rounded-sm focus:ring-[#223a9a] cursor-pointer accent-[#223a9a]"
                          title="Mark Project as Complete"
                        />
                        {isEditing ? (
                          <input
                            type="text"
                            value={activeData.project}
                            onChange={(e) => handleLocalChange(item.id, "project", e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1 text-sm focus:border-[#223a9a] focus:ring-1 focus:ring-[#223a9a] outline-hidden font-medium text-slate-900"
                            placeholder="Project title..."
                            id={`timeline-proj-${item.id}`}
                          />
                        ) : (
                          <div className={`font-medium transition-colors ${item.completed ? "text-slate-400 line-through" : "text-slate-900"}`}>
                            {item.project}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Note */}
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.note}
                          onChange={(e) => handleLocalChange(item.id, "note", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-sm focus:border-[#223a9a] focus:ring-1 focus:ring-[#223a9a] outline-hidden text-slate-900"
                          placeholder="Notes..."
                          id={`timeline-note-${item.id}`}
                        />
                      ) : (
                        <p className={`text-xs max-w-[320px] transition-colors break-words ${item.completed ? "text-slate-400 line-through" : "text-slate-600"}`} title={item.note}>
                          {item.note || <span className="text-slate-400 italic">None</span>}
                        </p>
                      )}
                    </td>

                    {/* ETC Date */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="date"
                          value={activeData.etcDate}
                          onChange={(e) => handleLocalChange(item.id, "etcDate", e.target.value)}
                          className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:border-[#223a9a] focus:ring-1 focus:ring-[#223a9a] outline-hidden text-slate-700"
                          id={`timeline-etc-${item.id}`}
                        />
                      ) : (
                        <span className={`font-mono text-xs transition-colors ${item.completed ? "text-slate-400 line-through" : "text-slate-600"}`}>
                          {item.etcDate}
                        </span>
                      )}
                    </td>

                    {/* PIC Name */}
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activeData.pic}
                          onChange={(e) => handleLocalChange(item.id, "pic", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-sm focus:border-[#223a9a] focus:ring-1 focus:ring-[#223a9a] outline-hidden text-slate-900"
                          placeholder="PIC Name..."
                          id={`timeline-pic-${item.id}`}
                        />
                      ) : (
                        <span className={`inline-block font-medium text-xs px-2 py-1 rounded transition-colors ${item.completed ? "text-slate-400 bg-slate-50 line-through" : "text-slate-800 bg-slate-100"}`}>
                          {item.pic}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveRow(item.id)}
                            className="p-1 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-xs rounded-md border border-emerald-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Save Row"
                            id={`timeline-save-${item.id}`}
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
                            title="Edit row"
                            id={`timeline-edit-${item.id}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(item.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 text-rose-500 rounded-md border border-rose-100 transition-colors cursor-pointer"
                            title="Delete row"
                            id={`timeline-del-${item.id}`}
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
