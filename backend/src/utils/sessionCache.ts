/*
 * File Name: SessionCache.ts
 * Description: This file contains the code for managing user session cache.
 * Author Name: The FinArth Team
 * Creation Date: 27-Jan-2026
 * Version: 1.0
 *
 * Instructions to run: Import the sessionCache module and use its methods to
 *                      manage user sessions.
 *
 * File Execution State: Validation is in progress
 * Note: This module can be imported and used in other parts of the application
 *       to manage user sessions efficiently.
 */

interface UserSession {
  userId: number;
  name: string;
  country: string;
  age: number;
  riskPreference: string;
  familiarInvestments: string[];
  returnEstimate: string;
  selectedOptions: string[];
  isFirstLogin: boolean;
  lastUpdated: Date;
}

class SessionCache {
  private cache: Map<number, UserSession> = new Map();

  set(userId: number, userData: Partial<UserSession>): void {
    const existing = this.cache.get(userId);
    const session: UserSession = {
      userId,
      name: userData.name || existing?.name || '',
      country: userData.country || existing?.country || '',
      age: userData.age || existing?.age || 0,
      riskPreference: userData.riskPreference || existing?.riskPreference || '',
      familiarInvestments: userData.familiarInvestments || existing?.familiarInvestments || [],
      returnEstimate: userData.returnEstimate || existing?.returnEstimate || '',
      selectedOptions: userData.selectedOptions || existing?.selectedOptions || [],
      isFirstLogin: userData.isFirstLogin ?? existing?.isFirstLogin ?? true,
      lastUpdated: new Date()
    };
    this.cache.set(userId, session);
  }

  get(userId: number): UserSession | undefined {
    return this.cache.get(userId);
  }

  delete(userId: number): void {
    this.cache.delete(userId);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const sessionCache = new SessionCache();
export type { UserSession };