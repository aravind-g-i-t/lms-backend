import { AdminSigninResponseDTO } from "@presentation/dtos/admin/Signin";
import { IAdminSigninUseCase } from "@application/IUseCases/admin/ISignin";
import { IRefreshTokenUseCase } from "@application/IUseCases/shared/IRefreshToken";
import { logger } from "@infrastructure/logging/Logger";

import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";
import { NextFunction, Response } from "express";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { ResponseBuilder } from "shared/utils/ResponseBuilder";
import { AppError } from "shared/errors/AppError";
import { IGetAdminDashboardUseCase } from "@application/IUseCases/admin/IGetAdminDashboard";

const accessTokenCookieMaxAge= parseInt(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE!)
const refreshTokenCookieMaxAge= parseInt(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE!)

export class AdminController {
    constructor(
        private _adminSigninUseCase: IAdminSigninUseCase,
        private _refreshTokenUseCase: IRefreshTokenUseCase,
        private _getAdminDashboardUseCase:IGetAdminDashboardUseCase
    ) { }

    signin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("Admin signin request recieved.")
            const { email, password } = req.body;

            const result: AdminSigninResponseDTO = await this._adminSigninUseCase.execute({ email, password });

            
            
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: refreshTokenCookieMaxAge
            });

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: accessTokenCookieMaxAge
            });


            logger.info("Admin signed in successfully.")
            res.status(STATUS_CODES.OK).json(ResponseBuilder.success(MESSAGES.LOGIN_SUCCESS,{
                id: result.id,
                accessToken: result.accessToken,
                email: result.email
            }))
            // res.status(STATUS_CODES.OK).json({
            //     success: true,
            //     message: MESSAGES.LOGIN_SUCCESS,
                
            // });
        } catch (error) {
            logger.warn("Failed to signin as Admin")
            next(error)
        }
    }

    logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("Admin logout request recieved.")
            if (!req.cookies?.refreshToken) {
                logger.warn("Failed to get refresh token")

                throw new AppError(MESSAGES.NO_SESSION,STATUS_CODES.BAD_REQUEST)
            }

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            logger.info("Admin logged out successfully.")
            res.status(STATUS_CODES.OK).json(ResponseBuilder.success(MESSAGES.LOGOUT_SUCCESS));
        } catch (error) {
            next(error)
        }
    }

    getDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("Request received to get admin dashboard.")

            const result = await this._getAdminDashboardUseCase.execute();


            logger.info("Admin dashboard data fetched successfully.")
            res.status(STATUS_CODES.OK).json(ResponseBuilder.success("Admin dashboard data fetched successfully.",result))
           
        } catch (error) {
            logger.warn("Failed to fetch admin dashboard data.")
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