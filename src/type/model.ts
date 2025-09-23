import { Fault_Type } from "./enum";

export interface IFault {
  message: string;
  falut_type: Fault_Type;
  percentage_distance: number;
  relative_distance: number;
  id?: string;
  timestamp?: Date | number;
  cable_id?: string;
  location?: string;
}

export interface IFirebaseResponse {
  [key: string]: IFault;
}
