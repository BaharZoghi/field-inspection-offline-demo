// Inspection Form Component
import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
const InspectionForm = ({ inspection, isOnline, onSave, onCancel }) => {
  const isEdit = !!inspection;

  const [formData, setFormData] = useState(() =>
    isEdit
      ? inspection
      : {
          id: Date.now(),
          site: "",
          status: "pending",
          date: new Date().toISOString().split("T")[0],
          inspector: "Current User",
          pressure: "",
          temperature: "",
          leaks: "none",
          notes: "",
          synced: false,
        }
  );

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        {inspection ? "Edit Inspection" : "New Inspection"}
      </h2>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Site Location
          </label>
          <input
            type="text"
            value={formData.site}
            onChange={(e) => setFormData({ ...formData, site: e.target.value })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
            placeholder="e.g., Well Pad A-12"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Inspector
            </label>
            <input
              type="text"
              value={formData.inspector}
              onChange={(e) =>
                setFormData({ ...formData, inspector: e.target.value })
              }
              className="w-full p-2 sm:p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-sm sm:text-base"
              placeholder="Inspector Name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full p-2 sm:p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-sm sm:text-base"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pressure (PSI)
            </label>
            <input
              type="number"
              value={formData.pressure}
              onChange={(e) =>
                setFormData({ ...formData, pressure: e.target.value })
              }
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              placeholder="1500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Temperature (°F)
            </label>
            <input
              type="number"
              value={formData.temperature}
              onChange={(e) =>
                setFormData({ ...formData, temperature: e.target.value })
              }
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              placeholder="72"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Leak Detection
          </label>
          <select
            value={formData.leaks}
            onChange={(e) =>
              setFormData({ ...formData, leaks: e.target.value })
            }
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
          >
            <option value="none">None Detected</option>
            <option value="minor">Minor Leak</option>
            <option value="major">Major Leak</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full p-2 sm:p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none h-20 sm:h-24 text-sm sm:text-base"
            placeholder="Additional observations..."
          />
        </div>

        <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
          <button
            onClick={() => onSave(formData)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            Save {!isOnline && "(Offline)"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspectionForm;
