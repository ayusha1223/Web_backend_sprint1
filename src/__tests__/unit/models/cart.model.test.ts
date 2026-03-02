import mongoose from "mongoose";
import Cart from "../../../models/cart.model";

describe("Cart Model", () => {

  it("should be defined", () => {
    expect(Cart).toBeDefined();
  });

  it("should have correct schema paths", () => {
    const schemaPaths = Cart.schema.paths;

    expect(schemaPaths.userId).toBeDefined();
    expect(schemaPaths.items).toBeDefined();
  });

  it("should create a cart document instance", () => {
    const cart = new Cart({
      userId: new mongoose.Types.ObjectId(),
      items: [
        {
          img: "img.jpg",
          qty: 2,
          price: 100,
        },
      ],
    });

    expect(cart.userId).toBeDefined();
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].img).toBe("img.jpg");
  });

});