export interface IAuthorizationService {
  checkUserActive(userId: string, role: string): Promise<boolean>;
}
