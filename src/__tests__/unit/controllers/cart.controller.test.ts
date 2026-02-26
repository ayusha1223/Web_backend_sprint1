import { CartController } from "../../../controllers/cart.controller";

const mockResponse = () => {
  const res: any = {};
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("CartController", () => {

  test("should return getCart response", async () => {
    const req: any = {};
    const res = mockResponse();

    await CartController.getCart(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "GET CART (to be connected)"
    });
  });

  test("should return saveCart response", async () => {
    const req: any = {};
    const res = mockResponse();

    await CartController.saveCart(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "SAVE CART (to be connected)"
    });
  });

});