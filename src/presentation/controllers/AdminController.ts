import { AdminSigninResponseDTO } from "@application/dtos/admin/Signin";
import { IAdminSigninUseCase } from "@application/IUseCases/admin/ISignin";
import { IRefreshTokenUseCase } from "@application/IUseCases/shared/IRefreshToken";

import { AuthenticatedRequest } from "@presentation/middlewares/createAuthMiddleware";
import { NextFunction, Response } from "express";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";

export class AdminController {
    constructor(
        private _adminSigninUseCase: IAdminSigninUseCase,
        private _refreshTokenUseCase: IRefreshTokenUseCase
    ) { }

    signin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {email,password}=req.body;

            const result:AdminSigninResponseDTO = await this._adminSigninUseCase.execute({email,password});


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
                email: result.email
            });
        } catch (error) {
            next(error)
        }
    }

    logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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

    // refreshToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    //     try {

    //         const refreshToken = req.cookies?.adminRefreshToken

    //         if (!refreshToken) {
    //             res.status(STATUS_CODES.BAD_REQUEST).json({
    //                 success: false,
    //                 message: MESSAGES.SESSION_EXPIRED,
    //             });
    //             return;
    //         }


    //         const accessToken = await this._refreshTokenUseCase.execute(refreshToken);

    //         const response: RefreshTokenResponseDTO = {
    //             success: true,
    //             message: MESSAGES.REFRESH_TOKEN_SUCCESS,
    //             accessToken
    //         }

    //         res.status(STATUS_CODES.OK).json(response);
    //     } catch (error) {
    //         res.clearCookie("adminRefreshToken", {
    //             httpOnly: true,
    //             secure: process.env.NODE_ENV === "production",
    //             sameSite: "strict",
    //         });
    //         next(error)
    //     }
    // }
}