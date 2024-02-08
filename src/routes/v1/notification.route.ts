import { Router } from "express";
import NotificationController from "../../controllers/notification.controller";
import UserController from "../../controllers/user.controller";

const router = Router();

router.post("/", UserController.verifyToken, NotificationController.getManyNotification);

router.post("/seen", UserController.verifyToken, NotificationController.notificationSeen);

export default router;
