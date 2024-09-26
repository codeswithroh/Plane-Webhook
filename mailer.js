const axios = require("axios");
const nodemailer = require("nodemailer");
const discordUserMapping = require("./discordMapping");
const projectMapping = require("./projectMapping");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendTaskNotification = (data) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta content="width=device-width" name="viewport"/>
    <style>
      @font-face {
        font-family: 'Inter';
        src: url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2');
      }
      * {
        font-family: 'Inter', sans-serif;
      }
    </style>
  </head>
  <body>
    <h2><strong>New Task Assigned To You</strong></h2>
    <p><strong>Task Name:</strong> ${data.name}</p>
    <p><strong>Description:</strong> ${data.description_html}</p>
    <p><strong>Priority:</strong> ${
      data.priority === "urgent" ? "Urgent 🚨" : data.priority
    }</p>
    <p><strong>Due Date:</strong> ${data.target_date}</p>
    <p><strong>Assignee:</strong> ${data.assignees
      .map((assignee) => `${assignee.first_name} ${assignee.last_name}`)
      .join(", ")}</p>
    <a href="https://plane.metaborong.com/metaborong/projects/${
      data.project
    }/issues/${
    data.id
  }" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;color:#ffffff;background-color:#141313;border-color:#141313;padding:12px 34px;border-width:2px;border-style:solid;font-size:14px;font-weight:500;border-radius:9999px" target="_blank">
                      View Task →
                    </a>
    <footer>
      <p>&copy; ${new Date().getFullYear()} Metaborong. All rights reserved.</p>
    </footer>
  </body>
</html>`;

  const text = `
**New Task Assigned To ${data.assignees
    .map((assignee) => `- <@${discordUserMapping[assignee.email]}>`)
    .join(" ")}**

**Project Name**: ${projectMapping[data.project]}
**Task Name**: ${data.name}
**Description**: ${data.description_stripped || "No description provided"}
**Priority**: ${data.priority === "urgent" ? "Urgent 🚨" : data.priority}
**Due Date**: ${data.target_date || "No due date"}

**Assignee(s)**:
${data.assignees
  .map((assignee) => `- <@${discordUserMapping[assignee.email]}>`)
  .join("\n")}

**View Task**: https://plane.metaborong.com/metaborong/projects/${
    data.project
  }/issues/${data.id}
  `;

  const assigneeEmails = data.assignees.map((assignee) => assignee.email);

  const mailOptions = {
    from: "rohit@metaborong.com",
    to: assigneeEmails,
    subject: `New Task Assigned - ${data.id}`,
    html,
    text,
  };

  axios.post(
    "https://discord.com/api/webhooks/1282573614620610580/5t7npSgT2I86VjKtlIpvVhf0xvVWrqGSnfJ6OWUUVVnLigVN2p1Fq6X_twhSWopyW-nS",
    {
      content: text,
    }
  );

  return transporter.sendMail(mailOptions);
};

module.exports = { sendTaskNotification };
