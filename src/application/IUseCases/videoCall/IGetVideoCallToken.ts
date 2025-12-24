export interface IGetVideoCallTokenUseCase {

  execute(userId: string, roomId: string):string;
}