
import { s3Controller } from "@setup/container/shared/controllers";
import express from "express";

const s3Router = express.Router();

s3Router.get("/presigned-url", (req, res) => s3Controller.getUploadUrl(req, res));
s3Router.get("/download-url", (req, res) => s3Controller.getViewURL(req, res));

export default s3Router;
