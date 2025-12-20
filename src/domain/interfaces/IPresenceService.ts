export interface IPresenceService {
  isOnline(userId: string): boolean;
  areOnline(userIds: string[]): Record<string, boolean>;
  userConnected(userId: string): void;
  userDisconnected(userId: string): void;

}
