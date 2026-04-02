/**
 * Cronjob types for CoreFoundry
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Cronjob {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  url: string;
  method: HttpMethod;
  headers: Record<string, string> | null;
  body: Record<string, any> | null;
  interval_minutes: number;
  is_active: boolean;
  last_run_at: string | null;
  last_status_code: number | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCronjobRequest {
  name: string;
  description?: string;
  url: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: Record<string, any>;
  interval_minutes?: number;
  is_active?: boolean;
}

export interface UpdateCronjobRequest {
  name?: string;
  description?: string;
  url?: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: Record<string, any>;
  interval_minutes?: number;
  is_active?: boolean;
}

export interface CronjobLog {
  id: number;
  cronjob_id: number;
  executed_at: string;
  status_code: number | null;
  response_time_ms: number | null;
  error_message: string | null;
  response_body: string | null;
}

export interface CronjobStats {
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  average_response_time_ms: number;
  last_execution?: CronjobLog;
}
