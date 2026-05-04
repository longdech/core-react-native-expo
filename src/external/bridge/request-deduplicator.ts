/**
 * Utility để deduplicate concurrent requests
 */
export class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<unknown>>();
  private debug = false;

  constructor(debug = false) {
    this.debug = debug;
  }

  async request<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: { skipDeduplication?: boolean },
  ): Promise<T> {
    if (options?.skipDeduplication) {
      return fetcher();
    }

    if (this.pendingRequests.has(key)) {
      if (this.debug) {
        console.log(`[Deduplicator] Reusing pending request for key: ${key}`);
      }
      return this.pendingRequests.get(key) as Promise<T>;
    }

    if (this.debug) {
      console.log(`[Deduplicator] Starting new request for key: ${key}`);
    }

    const promise = fetcher().finally(() => {
      this.pendingRequests.delete(key);
      if (this.debug) {
        console.log(`[Deduplicator] Completed request for key: ${key}`);
      }
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  clear() {
    this.pendingRequests.clear();
  }

  getPendingCount(): number {
    return this.pendingRequests.size;
  }
}
