// application/usecases/video/GetZegoTokenUseCase.ts

import { IGetVideoCallTokenUseCase } from "@application/IUseCases/videoCall/IGetVideoCallToken";
import { IVideoCallService } from "@domain/interfaces/IVideoCallService";

export class GetVideoCallTokenUseCase implements IGetVideoCallTokenUseCase{
  constructor(private zegoService: IVideoCallService) {}

  execute(userId: string, roomId: string):string {
    return this.zegoService.generateToken(userId, roomId);
  }
}
