import { Router } from "express";

const router = Router();

router.get("/reverse", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  try {
    const response = await fetch(
  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`,
  {
    headers: {
      "User-Agent": "naayu-attire-app",
    },
  }
);

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Reverse geocoding failed" });
  }
});

export default router;