const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendTaskEmail = (data) => {
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
    }/issues/${data.id}" target="_blank">View Task →</a>
    <footer>
      <p>&copy; ${new Date().getFullYear()} Metaborong. All rights reserved.</p>
    </footer>
  </body>
</html>`;

  const assigneeEmails = data.assignees.map((assignee) => assignee.email);

  const mailOptions = {
    from: "rohit@metaborong.com",
    to: assigneeEmails, // This will send the email to all assignees
    subject: `New Task Assigned - ${data.id}`,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendTaskEmail };
