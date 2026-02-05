import { Request, Response } from "express";

export class PaymentController {
  static initiateEsewa(req: Request, res: Response) {
    const { amount } = req.body;

    const delivery = 99;
    const service = 20;
    const totalAmount = amount + delivery + service;

    /**
     * ✅ DEVELOPMENT / DEMO FALLBACK
     * (Esewa UAT unreachable in many networks)
     */
    if (process.env.NODE_ENV !== "production") {
      return res.send(`
        <html>
          <head>
            <title>Esewa Payment</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background: #f5f5f5;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
              }
              .card {
                background: #fff;
                padding: 30px;
                width: 400px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                text-align: center;
              }
              .logo {
                font-size: 28px;
                font-weight: bold;
                color: #60bb46;
                margin-bottom: 10px;
              }
              .loader {
                margin: 20px auto;
                border: 4px solid #eee;
                border-top: 4px solid #60bb46;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
              .amount {
                font-size: 18px;
                margin-top: 10px;
              }
            </style>
            <script>
              // ✅ REDIRECT DIRECTLY TO FRONTEND PAGE
              setTimeout(() => {
                window.location.href = "http://localhost:3000/order-success";
              }, 2500);
            </script>
          </head>
          <body>
            <div class="card">
              <div class="logo">eSewa</div>
              <p>Authorizing payment…</p>
              <div class="loader"></div>
              <div class="amount">Amount: ₹${totalAmount}</div>
              <p>Please do not refresh</p>
            </div>
          </body>
        </html>
      `);
    }

    /**
     * ✅ REAL ESEWA (PRODUCTION ONLY)
     */
    const esewaForm = `
      <html>
        <body onload="document.forms[0].submit()">
          <form action="https://esewa.com.np/epay/main" method="POST">
            <input type="hidden" name="tAmt" value="${totalAmount}" />
            <input type="hidden" name="amt" value="${amount}" />
            <input type="hidden" name="psc" value="${delivery}" />
            <input type="hidden" name="txAmt" value="${service}" />
            <input type="hidden" name="scd" value="YOUR_MERCHANT_CODE" />
            <input type="hidden" name="pid" value="ORDER_${Date.now()}" />
            <input
              type="hidden"
              name="su"
              value="http://localhost:5050/api/payment/success"
            />
            <input
              type="hidden"
              name="fu"
              value="http://localhost:5050/api/payment/failure"
            />
          </form>
        </body>
      </html>
    `;

    res.send(esewaForm);
  }

  /**
   * ✅ REAL ESEWA CALLBACKS
   */
  static paymentSuccess(req: Request, res: Response) {
    res.redirect("http://localhost:3000/order-success");
  }

  static paymentFailure(req: Request, res: Response) {
    res.redirect("http://localhost:3000/order-failed");
  }
}
