import { Router } from "express";
import auth from "../middlewares/auth.middleware";
import Notification from "../models/notification.model";

const router = Router();

// 🔔 Get My Notifications
router.get("/", auth, async (req: any, res) => {
  const notifications = await Notification.find({
    userId: req.user.id,
  }).sort({ createdAt: -1 });

  res.json({ success: true, data: notifications });
});

// ✅ Mark as Read
router.patch("/:id/read", auth, async (req: any, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });

  res.json({ success: true });
});

export default router;