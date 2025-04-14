import { generateAccessToken, paypal } from "../lib/paypal";

// Test to generate access token from paypal
test("generates an access token from paypal", async () => {
  const tokenResponse = await generateAccessToken();
  console.log(tokenResponse);
  expect(typeof tokenResponse).toBe("string");
  expect(tokenResponse.length).toBeGreaterThan(0);
});

// Test to create a paypal order
test('Creates a paypal order', async () => {
  const price = 10.00;
  const orderResponse = await paypal.createOrder(price);
  console.log(orderResponse);

  expect(orderResponse).toHaveProperty("id");
  expect(orderResponse).toHaveProperty("links");
  expect(orderResponse).toHaveProperty("status");
  expect(orderResponse.status).toBe("CREATED");
});

// Test to capture payment with a mock order
test("Simulates capturing payment from an order", async () => {
  const orderId = "100";
  const mockCapturePayment = jest
    .spyOn(paypal, "capturePayment")
    .mockResolvedValue({ status: "COMPLETED" });

  const captureResponse = await paypal.capturePayment(orderId);
  console.log(captureResponse);
  expect(captureResponse).toHaveProperty("status", "COMPLETED");

  mockCapturePayment.mockRestore();
})