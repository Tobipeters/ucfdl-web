"use client";
import { useState, useEffect } from "react";
import {
  Activity,
  Zap,
  AlertTriangle,
  Wifi,
  WifiOff,
  MapPin,
} from "lucide-react";
import { ref, onValue } from "firebase/database";
import { database } from "@/config/firebase-config";
import { IFault, IFirebaseResponse } from "@/type";
import { dataArray } from "@/utils/helper";

const FAULT_TYPES = {
  1: {
    name: "Open Circuit",
    color: "text-orange-600",
    bg: "bg-orange-100",
    icon: Activity,
  },
  2: {
    name: "Short Circuit",
    color: "text-red-600",
    bg: "bg-red-100",
    icon: Zap,
  },
  3: {
    name: "Earth Fault",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    icon: AlertTriangle,
  },
};

export default function Home() {
  const [faultData, setFaultData] = useState<IFault | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [actualCableLength, setActualCableLength] = useState<number>(120);

  useEffect(() => {
    setLoading(true);

    const faultRef = ref(database, "fault_report");
    const unsubscribe = onValue(
      faultRef,
      (snapshot) => {
        const data: IFirebaseResponse = snapshot.val();

        if (data) {
          const formatedData = dataArray(data);
          const latestFault = formatedData[formatedData.length - 1];

          setFaultData(latestFault);
          setIsConnected(true);
          setLoading(false);
          setLastUpdated(new Date());
        } else {
          setFaultData(null);
          setIsConnected(false);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Firebase error:", error);
        setIsConnected(false);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const getCurrentFaultType = () => {
    if (!faultData) return null;
    return FAULT_TYPES[faultData.falut_type];
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  const ConnectionStatus = () => (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
        isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
      {isConnected ? "Connected" : "Disconnected"}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Connecting to UCFDL System...
          </h2>
          <p className="text-gray-500">
            Initializing fault detection monitoring
          </p>
        </div>
      </div>
    );
  }

  const faultType = getCurrentFaultType();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">UCFDL</h1>
                <p className="text-sm text-gray-600">
                  Underground Cable Fault Distance Locator
                </p>
              </div>
            </div>
            <ConnectionStatus />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {faultData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Fault Status Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Fault Status
                </h2>
                <div className={`p-3 rounded-xl ${faultType?.bg}`}>
                  {faultType?.icon && (
                    <faultType.icon className={`h-6 w-6 ${faultType?.color}`} />
                  )}
                </div>
              </div>

              <div className={`p-4 rounded-xl ${faultType?.bg} mb-6`}>
                <div className={`text-lg font-semibold ${faultType?.color}`}>
                  {faultType?.name}
                </div>
                <p className="text-gray-700 mt-1">{faultData.message}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cable ID:</span>
                  <span className="font-semibold text-gray-900 uppercase">
                    #{faultData?.id?.substring(3, 15)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-semibold text-gray-900">
                    {faultData?.location ?? "University of Lagos, UNILAG"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Detection Time:</span>
                  {faultData?.timestamp && (
                    <span className="font-semibold text-gray-900">
                      {formatTimestamp(faultData?.timestamp as Date)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Distance Analysis Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Distance Analysis
                </h2>
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>

              {/* Percentage Distance */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-medium text-gray-700">
                    Percentage Distance
                  </span>
                  <span className="text-3xl font-bold text-blue-600">
                    {faultData.percentage_distance}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${faultData.percentage_distance}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Start (0%)</span>
                  <span>End (100%)</span>
                </div>
              </div>

              {/* Relative Distance */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">
                    Estimated Distance from Source
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {faultData.relative_distance}
                  </div>
                  <div className="text-lg text-gray-600">meters</div>
                </div>
              </div>

              {/* Visual Cable Representation */}
              <div className="mt-8">
                <div className="text-sm text-gray-600 mb-5">
                  Cable Visualization
                </div>
                <div className="relative">
                  <div className="h-3 bg-gray-300 rounded-full"></div>
                  <div
                    className="absolute top-0 h-3 bg-red-500 rounded-full transition-all duration-1000"
                    style={{
                      left: `${faultData.percentage_distance}%`,
                      width: "8px",
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                  <div
                    className="absolute -top-6 text-xs text-red-600 font-semibold transition-all duration-1000"
                    style={{
                      left: `${faultData.percentage_distance}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    Fault
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Fault Data Available
            </h3>
            <p className="text-gray-500">
              Waiting for fault detection data from the system...
            </p>
          </div>
        )}

        {/* System Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                System Information
              </h3>
              <p className="text-sm text-gray-600">
                Real-time underground cable fault monitoring system
              </p>
            </div>
            {lastUpdated && (
              <div className="text-right">
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="text-sm font-medium text-gray-900">
                  {lastUpdated.toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2024 UCFDL - Underground Cable Fault Distance Locator
            </p>
            <p className="text-xs mt-1">
              Engineering Project • Real-time Fault Detection & Location System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
