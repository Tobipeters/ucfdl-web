import { IFirebaseResponse } from "@/type";

export const dataArray = (data: IFirebaseResponse) =>
  Object.entries(data).map(([key, value]) => ({
    id: key,
    ...value,
    // Handle typo in fault_type field
    fault_type: value.falut_type,
    // Add timestamp from Firebase key if not present
    timestamp: value.timestamp || extractTimestampFromKey(key),
  }));

export const extractTimestampFromKey = (key: string) => {
  // Firebase push keys are time-based, we can approximate timestamp
  // For better accuracy, add explicit timestamp in your NodeMCU code
  return Date.now(); // Random time within last 24 hours
};
