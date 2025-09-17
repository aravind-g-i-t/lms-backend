export interface IOTPService{
    generateOTP():Promise<string>;
    sendOTP(email:string,otp:string):Promise<Date>
    deleteOTP(email:string):Promise<void>
}