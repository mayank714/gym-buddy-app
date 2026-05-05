export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

export interface DeleteResponse {
  message: string;
  id: string;
}
