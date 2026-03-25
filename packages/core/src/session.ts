import type { SessionAccessor, StateScope } from './types.js';

interface SessionEntry {
  data: Map<string, unknown>;
  createdAt: number;
  lastAccessed: number;
}

export interface SessionStoreConfig {
  ttl?: number;
  cleanupInterval?: number;
}

export class SessionStore {
  private sessions = new Map<string, SessionEntry>();
  private ttl: number;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(config: SessionStoreConfig = {}) {
    this.ttl = config.ttl ?? 30 * 60 * 1000;
    const interval = config.cleanupInterval ?? 60 * 1000;
    this.cleanupTimer = setInterval(() => this.cleanup(), interval);
    if (this.cleanupTimer.unref) this.cleanupTimer.unref();
  }

  buildKey(scope: StateScope, id: string): string {
    return `${scope}:${id}`;
  }

  getAccessor(scope: StateScope, id: string): SessionAccessor {
    const key = this.buildKey(scope, id);
    return {
      get: <T = unknown>(k: string) => this.get<T>(key, k),
      set: <T = unknown>(k: string, v: T) => this.set(key, k, v),
      has: (k: string) => this.has(key, k),
      delete: (k: string) => this.deleteKey(key, k),
      clear: () => this.clearSession(key),
    };
  }

  private ensureSession(key: string): SessionEntry {
    let entry = this.sessions.get(key);
    if (!entry) {
      entry = { data: new Map(), createdAt: Date.now(), lastAccessed: Date.now() };
      this.sessions.set(key, entry);
    }
    entry.lastAccessed = Date.now();
    return entry;
  }

  private get<T>(sessionKey: string, dataKey: string): T | undefined {
    const entry = this.sessions.get(sessionKey);
    if (!entry) return undefined;
    entry.lastAccessed = Date.now();
    return entry.data.get(dataKey) as T | undefined;
  }

  private set(sessionKey: string, dataKey: string, value: unknown): void {
    const entry = this.ensureSession(sessionKey);
    entry.data.set(dataKey, value);
  }

  private has(sessionKey: string, dataKey: string): boolean {
    const entry = this.sessions.get(sessionKey);
    return entry?.data.has(dataKey) ?? false;
  }

  private deleteKey(sessionKey: string, dataKey: string): boolean {
    const entry = this.sessions.get(sessionKey);
    return entry?.data.delete(dataKey) ?? false;
  }

  private clearSession(sessionKey: string): void {
    this.sessions.delete(sessionKey);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.sessions) {
      if (now - entry.lastAccessed > this.ttl) {
        this.sessions.delete(key);
      }
    }
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.sessions.clear();
  }

  get size(): number {
    return this.sessions.size;
  }
}
