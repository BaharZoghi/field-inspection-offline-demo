import React from "react";
import { Droplet, Wifi, WifiOff, Bell, RefreshCw } from "lucide-react";

const InspectionHeader = ({
  isOnline,
  pendingSync,
  notifications,
  toggleOnlineStatus,
  syncData,
  showNotifications,
  setShowNotifications,
}) => {
  return (
    <>
      {/* Desktop header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Droplet className="w-8 h-8" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Field Inspection
                </h1>
                <p className="text-blue-200 text-xs sm:text-sm">
                  Petroleum Safety Management
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 sm:gap-4">
              {/* Online / Offline */}
              <button
                onClick={toggleOnlineStatus}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition ${
                  isOnline
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isOnline ? (
                  <Wifi className="w-4 h-4" />
                ) : (
                  <WifiOff className="w-4 h-4" />
                )}
                <span>{isOnline ? "Online" : "Offline"}</span>
              </button>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-blue-800 rounded-lg transition"
              >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Sync */}
              <button
                onClick={syncData}
                disabled={!isOnline || pendingSync.length === 0}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition ${
                  isOnline && pendingSync.length > 0
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-600 opacity-50 cursor-not-allowed"
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sync ({pendingSync.length})</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile footer */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-2xl z-50 border-t border-blue-600">
        <div className="flex items-center justify-around px-4 py-2">
          {/* Online / Offline */}
          <button
            onClick={toggleOnlineStatus}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition ${
              isOnline ? "text-green-400" : "text-red-400"
            }`}
          >
            {isOnline ? (
              <Wifi className="w-5 h-5" />
            ) : (
              <WifiOff className="w-5 h-5" />
            )}
            <span className="text-xs font-semibold">
              {isOnline ? "Online" : "Offline"}
            </span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition hover:bg-blue-800"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-0.5 right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {notifications.length}
              </span>
            )}
            <span className="text-xs font-semibold">Alerts</span>
          </button>

          {/* Sync */}
          <button
            onClick={syncData}
            disabled={!isOnline || pendingSync.length === 0}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition ${
              isOnline && pendingSync.length > 0
                ? "text-orange-400"
                : "text-gray-400 opacity-50"
            }`}
          >
            <RefreshCw className="w-5 h-5" />
            <span className="text-xs font-semibold">
              Sync ({pendingSync.length})
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default InspectionHeader;
