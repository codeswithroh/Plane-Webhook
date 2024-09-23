require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sendTaskNotification } = require("./mailer");
const { verifySignature } = require("./verifySignature");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

app.post("/webhook", (req, res) => {
  if (!verifySignature(req)) {
    return res.status(403).send("Invalid signature");
  }

  const { event, action, data } = req.body;

  if (event === "issue" && action === "updated") {
    sendTaskNotification(data)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(200);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Webhook server running on port 3000");
});
