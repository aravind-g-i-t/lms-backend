import { IPresenceService } from "@domain/interfaces/IPresenceService";

export class PresenceService implements IPresenceService {
  private connections = new Map<string, number>();

  userConnected(userId: string) {
    const count = this.connections.get(userId) ?? 0;
    this.connections.set(userId, count + 1);
  }

  userDisconnected(userId: string) {
    const count = this.connections.get(userId) ?? 0;

    if (count <= 1) {
      this.connections.delete(userId);
    } else {
      this.connections.set(userId, count - 1);
    }
  }

  isOnline(userId: string): boolean {
    return this.connections.has(userId);
  }

  areOnline(userIds: string[]): Record<string, boolean> {
    const map: Record<string, boolean> = {};
    for (const id of userIds) {
      map[id] = this.connections.has(id);
    }
    return map;
  }
}
