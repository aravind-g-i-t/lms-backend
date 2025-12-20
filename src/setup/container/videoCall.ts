import { GetVideoCallTokenUseCase } from "@application/useCases/videoCall/GetVideoCallToken";
import { ZegoService } from "@infrastructure/services/ZegoService";

const zegoService= new ZegoService();

export const getVideoCallTokenUseCase= new GetVideoCallTokenUseCase(zegoService)