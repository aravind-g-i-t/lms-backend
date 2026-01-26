import { ICacheService } from "@domain/interfaces/ICacheService";
import { connectRedis } from "@infrastructure/database/redis/redisConnection";
import { CacheService } from "@infrastructure/services/CacheService";
import { CertificateTemplateService } from "@infrastructure/services/CertificateTemplateService ";
import { GoogleAuthService } from "@infrastructure/services/GoogleAuthService";
import { NodemailerService } from "@infrastructure/services/NodemailerService";
import { PdfGeneratorService } from "@infrastructure/services/PdfGeneratorService";
import { PresenceService } from "@infrastructure/services/PresenceService";
import { S3ServiceImpl } from "@infrastructure/services/S3ServiceImpl";
import { StripeService } from "@infrastructure/services/StripeService";
import { TokenService } from "@infrastructure/services/TokenService";
import { ZegoService } from "@infrastructure/services/ZegoService";


const redisClient=await connectRedis();
export const tokenService=new TokenService();
export const s3Service = new S3ServiceImpl()
export const certificateTemplateService= new CertificateTemplateService();

export const cacheService:ICacheService=new CacheService(redisClient)

export const pdfGeneratorService= new PdfGeneratorService();

export const stripeService = new StripeService();

export const nodemailerService=new NodemailerService();

export const googleAuthService=new GoogleAuthService();

export const presenceService = new PresenceService();

export const zegoService= new ZegoService();
