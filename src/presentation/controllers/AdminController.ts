import { RefreshTokenResponseDTO } from "@application/dtos/shared/RefreshToken";
import { IAdminSigninUseCase } from "@application/IUseCases/admin/ISignin";
import { IRefreshTokenUseCase } from "@application/IUseCases/shared/IRefreshToken";
import { AdminRefreshTokenUseCase } from "@application/useCases/admin/RefreshToken";
import { AdminSigninUseCase } from "@application/useCases/admin/Signin";
import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";

export class AdminController{
    constructor(
        private _adminSigninUseCase:IAdminSigninUseCase,
        private _refreshTokenUseCase:IRefreshTokenUseCase
    ){}

    signin = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
        try {
            let result= await this._adminSigninUseCase.execute(req.body);

            console.log('result', result);

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(STATUS_CODES.OK).json({
                success: true,
                message: MESSAGES.LOGIN_SUCCESS,
                id: result.id,
                accessToken: result.accessToken,
                email:result.email
            });


        } catch (error) {
            next(error)
        }
    }

    logout = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
        try {
            if (!req.cookies?.refreshToken) {
                res.status(STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.NO_SESSION,
                });
                return;
            }

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            res.status(STATUS_CODES.OK).json({
                success: true,
                message: MESSAGES.LOGOUT_SUCCESS,
            });
        } catch (error) {
            next(error)
        }
    }

    refreshToken = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
        try {
            console.log('entered refresh');
            
            const refreshToken=req.cookies?.adminRefreshToken
            console.log('token',refreshToken);
            
            if (!refreshToken) {
                res.status(STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.SESSION_EXPIRED,
                });
                return;
            }


            const accessToken=await this._refreshTokenUseCase.execute(refreshToken);
            console.log('accessToken',accessToken);
            
            const response:RefreshTokenResponseDTO={
                success:true,
                message:MESSAGES.REFRESH_TOKEN_SUCCESS,
                accessToken
            }
            
            res.status(STATUS_CODES.OK).json(response);
        } catch (error) {
            res.clearCookie("adminRefreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            next(error)
        }
    }
    

}