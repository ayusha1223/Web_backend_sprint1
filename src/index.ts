import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./database";

const PORT = process.env.PORT || 5050;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});
