import request from "supertest";
import express from "express";
import reverseRouter from "../../../routes/reverse.route";

const app = express();
app.use(express.json());
app.use(reverseRouter);

describe("Reverse Route", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return 400 if coordinates missing", async () => {
    const res = await request(app).get("/reverse");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing coordinates");
  });

  test("should return data on success", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ address: "Test Location" })
    }) as any;

    const res = await request(app)
      .get("/reverse")
      .query({ lat: "27.7", lon: "85.3" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ address: "Test Location" });
  });

  test("should return 500 if fetch fails", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("API fail")) as any;

    const res = await request(app)
      .get("/reverse")
      .query({ lat: "27.7", lon: "85.3" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Reverse geocoding failed");
  });

});