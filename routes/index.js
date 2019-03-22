import express from "express";
import UrlController from "../urlsController/urls";

const router = express.Router();

router.get("/api/v1/urls", UrlController.getAllUrls);
router.get("/api/v1/urls/:id", UrlController.getUrl);
router.post("/api/v1/urls", UrlController.createUrl);
router.put("/api/v1/urls/:id", UrlController.updateUrl);
router.delete("/api/v1/urls/:id", UrlController.deleteUrl);

export default router;
