import { Request, Response } from "express";
import { DashboardService } from "../../services/admin/dashboard.service";


export class DashboardController {
  private service = new DashboardService();

  async getDashboard(req: Request, res: Response) {
    try {
      const data = await this.service.getDashboardStats();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to load dashboard",
      });
    }
  }
}
