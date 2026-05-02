export interface LimitResponse {
  success: boolean;
  message: string;
  newLimit?: number; 
}

export interface AlertResponse {
  alert: boolean;
  message?: string;
}