export const  generateOTP= (): string=> {
    let otp= Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);
    return otp;
    
}