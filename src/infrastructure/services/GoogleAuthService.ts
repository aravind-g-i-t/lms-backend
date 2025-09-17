import axios from "axios";
import { IGoogleAuthService } from "@domain/interfaces/IGoogleAuthService";

export class GoogleAuthService implements IGoogleAuthService {
    constructor(
        private _googleApiUrl=process.env.GOOGLE_API_URL||''
    ){}
  async getUserInfo(accessToken: string) {
    console.log(accessToken);
    
    console.log(this._googleApiUrl);
    
    const res = await axios.get(this._googleApiUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log(res.data);
    
    const { sub, email, name, picture } = res.data;
    
    return { sub, email, name, picture };
  }
}
