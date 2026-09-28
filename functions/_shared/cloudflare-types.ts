export interface D1RunResult {
  success: boolean;
  meta?: Record<string, unknown>;
}

export interface D1AllResult<T> {
  results: T[];
  success?: boolean;
  meta?: Record<string, unknown>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<D1RunResult>;
  all<T = Record<string, unknown>>(): Promise<D1AllResult<T>>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface DvrSignalEnv {
  RESEARCH_DB?: D1Database;
  CONTACT_DB?: D1Database;
  TURNSTILE_SECRET_KEY?: string;
  AGGREGATION_ADMIN_TOKEN?: string;
  COLLECTION_ENABLED?: string;
  CONTACT_COLLECTION_ENABLED?: string;
  AGGREGATION_ENABLED?: string;
}

export interface FunctionContext {
  request: Request;
  env: DvrSignalEnv;
}
