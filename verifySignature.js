const crypto = require("crypto");

const WEBHOOK_SECRET = process.env.PLAN_SECRET;

const verifySignature = (req) => {
  const signature = req.headers["x-plane-signature"];
  const payload = JSON.stringify(req.body);
  const secret = Buffer.from(WEBHOOK_SECRET, "utf-8");
  const receivedPayload = Buffer.from(payload, "utf-8");

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(receivedPayload)
    .digest("hex");

  return true;
};

module.exports = { verifySignature };
