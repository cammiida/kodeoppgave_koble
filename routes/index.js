import express from "express";
import UrlController from "../urlsController/urls";

const router = express.Router();

router.get("/api/v1/url?", UrlController.getLongUrl);
router.post("/api/v1/url", UrlController.generateShortUrl);
router.get("/api/v1/urls", UrlController.getAllUrls);

export default router;
