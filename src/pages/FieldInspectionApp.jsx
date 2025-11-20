import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Wifi,
  WifiOff,
  CheckCircle,
  Clock,
  RefreshCw,
  Bell,
  Save,
  MapPin,
  Droplet,
  Gauge,
  AlertTriangle,
  Settings,
  Download,
  Upload,
} from "lucide-react";

import InspectionForm from "../components/InspectionForm";
import InspectionHeader from "../components/InspectionHeader";

const FieldInspectionApp = () => {
  // State management for offline/online functionality
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState([]);
  const [lastSync, setLastSync] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [inspections, setInspections] = useState([
    {
      id: 1,
      site: "Well Pad A-12",
      status: "completed",
      date: "2025-11-18",
      inspector: "John Smith",
      synced: true,
    },
    {
      id: 2,
      site: "Pipeline Segment B-45",
      status: "in-progress",
      date: "2025-11-19",
      inspector: "Sarah Johnson",
      synced: true,
    },
    {
      id: 3,
      site: "Storage Tank C-7",
      status: "pending",
      date: "2025-11-19",
      inspector: "Mike Davis",
      synced: true,
    },
  ]);
  const [currentInspection, setCurrentInspection] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Simulate online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Simulate auto-sync when coming back online
      if (pendingSync.length > 0) {
        setTimeout(() => syncData(), 1000);
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [pendingSync]);

  // Simulate push notifications from server
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline && Math.random() > 0.7) {
        const messages = [
          {
            id: Date.now(),
            type: "update",
            message: "Inspection data updated for Well Pad A-12",
            timestamp: new Date(),
          },
          {
            id: Date.now(),
            type: "alert",
            message: "Safety alert: High pressure detected at Pipeline B-45",
            timestamp: new Date(),
          },
          {
            id: Date.now(),
            type: "sync",
            message: "New inspection protocols available",
            timestamp: new Date(),
          },
        ];
        const randomMessage =
          messages[Math.floor(Math.random() * messages.length)];
        setNotifications((prev) => [randomMessage, ...prev].slice(0, 10));
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [isOnline]);

  // Local storage for offline data
  useEffect(() => {
    const stored = localStorage.getItem("inspectionData");
    if (stored) {
      const data = JSON.parse(stored);
      setInspections(data.inspections || inspections);
      setPendingSync(data.pendingSync || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "inspectionData",
      JSON.stringify({
        inspections,
        pendingSync,
        lastSync,
      })
    );
  }, [inspections, pendingSync, lastSync]);

  // Sync function
  const syncData = () => {
    if (!isOnline) {
      alert(
        "Cannot sync while offline. Changes will be synced when connection is restored."
      );
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const updatedInspections = inspections.map((insp) =>
        pendingSync.includes(insp.id) ? { ...insp, synced: true } : insp
      );
      setInspections(updatedInspections);
      setPendingSync([]);
      setLastSync(new Date());

      setNotifications((prev) => [
        {
          id: Date.now(),
          type: "success",
          message: `Successfully synced ${pendingSync.length} inspection(s)`,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }, 1500);
  };

  // Save inspection (works offline)
  const saveInspection = (inspection) => {
    const existingIndex = inspections.findIndex(
      (insp) => insp.id === inspection.id
    );

    let updated;
    if (existingIndex >= 0) {
      // Update existing inspection
      updated = inspections.map((insp) =>
        insp.id === inspection.id ? { ...inspection, synced: isOnline } : insp
      );
    } else {
      // Add new inspection
      updated = [...inspections, { ...inspection, synced: isOnline }];
    }
    setInspections(updated);

    if (!isOnline) {
      setPendingSync((prev) => [...new Set([...prev, inspection.id])]);
      setNotifications((prev) => [
        {
          id: Date.now(),
          type: "warning",
          message: "Saved locally. Will sync when online.",
          timestamp: new Date(),
        },
        ...prev,
      ]);
    } else {
      setNotifications((prev) => [
        {
          id: Date.now(),
          type: "success",
          message: "Inspection saved and synced",
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }
    setCurrentInspection(null);
  };

  // Toggle offline mode for demo
  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header / Footer*/}
      <InspectionHeader
        isOnline={isOnline}
        pendingSync={pendingSync}
        notifications={notifications}
        toggleOnlineStatus={toggleOnlineStatus}
        syncData={syncData}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
      />
      {/* Header / Footer*/}

      {showNotifications && (
        <div
          className="fixed inset-0 z-[60]" // full-screen overlay above header
          onClick={() => setShowNotifications(false)} // click anywhere closes
        >
          <div
            className="fixed sm:top-20 sm:right-4 bottom-16 sm:bottom-auto left-0 right-0 sm:left-auto sm:w-96 bg-white sm:rounded-lg shadow-2xl z-40 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // clicks inside panel DON’T close
          >
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="divide-y">
              {notifications.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">
                  No new notifications
                </p>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      {notif.type === "alert" && (
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      {notif.type === "success" && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      )}
                      {notif.type === "warning" && (
                        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      )}
                      {notif.type === "update" && (
                        <Download className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      )}
                      {notif.type === "sync" && (
                        <RefreshCw className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notif.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Data Form */}
      {currentInspection !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <InspectionForm
            inspection={currentInspection}
            isOnline={isOnline}
            onSave={saveInspection}
            onCancel={() => setCurrentInspection(null)}
          />
        </div>
      )}
      {/* Data Form */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Inspections</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {inspections.length}
                </p>
              </div>
              <Gauge className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Sync</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-500">
                  {pendingSync.length}
                </p>
              </div>
              <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Last Sync</p>
                <p className="text-sm sm:text-base font-semibold text-gray-800">
                  {lastSync.toLocaleTimeString()}
                </p>
              </div>
              <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Connection</p>
                <p
                  className={`text-base sm:text-lg font-bold ${
                    isOnline ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
              {isOnline ? (
                <Wifi className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
              ) : (
                <WifiOff className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
              )}
            </div>
          </div>
        </div>

        {/* Offline Mode Banner */}
        {!isOnline && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-yellow-800">Offline Mode</p>
                <p className="text-sm text-yellow-700">
                  You're working offline. All changes will be saved locally and
                  synced when connection is restored.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Inspection Form Modal */}
        {currentInspection !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <InspectionForm
              inspection={currentInspection}
              onSave={saveInspection}
              onCancel={() => setCurrentInspection(null)}
            />
          </div>
        )}

        {/* Inspections List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Recent Inspections
            </h2>
            <button
              onClick={() => setCurrentInspection()}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition w-full sm:w-auto cursor-pointer"
            >
              + New Inspection
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Site
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                    Inspector
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sync
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inspections.map((inspection) => (
                  <tr key={inspection.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="font-medium text-gray-800 text-sm">
                          {inspection.site}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                      {inspection.inspector}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                      {inspection.date}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          inspection.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : inspection.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {inspection.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      {inspection.synced ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-orange-500" />
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      {inspection.status === "completed" ? (
                        <span className="text-gray-400 text-sm">Locked</span>
                      ) : (
                        <button
                          onClick={() => setCurrentInspection(inspection)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Info Footer */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Technical Features Demonstrated
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Offline Storage:</strong> LocalStorage persistence for
                offline work
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Auto-Sync:</strong> Automatic sync when connection
                restored
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Push Updates:</strong> Simulated server notifications
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Responsive Design:</strong> Mobile-first, cross-device
                compatible
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>State Management:</strong> React hooks for complex state
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Real-time Status:</strong> Connection monitoring &
                feedback
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FieldInspectionApp;
