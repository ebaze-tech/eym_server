import express from "express";
import { resend } from "../config/resend";
import contactMessageModel from "./contactMessageModel";
import { validationResult } from "express-validator";

export async function contactMail(req: express.Request, res: express.Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid request", success: false });
  }

  const { firstName, lastName, email, phone, subject, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({
      error: "Required fields are missing",
    });
  }

  try {
    const emailSent = await resend.emails.send({
      from: email,
      to: ["eymsince1961@gmail.com"],
      replyTo: email,
      subject: `New Contact Message: ${subject || "No Subject"}`,
      html: `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>New Contact Message</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      }
      .header {
        background-color: #2b59c3;
        padding: 24px;
        text-align: center;
        color: #ffffff;
      }
      .content {
        padding: 30px;
        color: #333;
      }
      .label {
        font-weight: bold;
        color: #555;
      }
      .message {
        background: #f1f5ff;
        padding: 16px;
        border-left: 4px solid #2b59c3;
        border-radius: 6px;
        margin-top: 20px;
        line-height: 1.6;
      }
      .footer {
        padding: 20px;
        font-size: 12px;
        text-align: center;
        color: #777;
        background: #f4f6f8;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h2>New Contact Form Message</h2>
      </div>

      <div class="content">
        <p><span class="label">Name:</span> ${firstName} ${lastName}</p>
        <p><span class="label">Email:</span> ${email}</p>
        <p><span class="label">Phone:</span> ${phone || "Not provided"}</p>
        <p><span class="label">Subject:</span> ${subject || "N/A"}</p>

        <div class="message">
          ${message.replace(/\n/g, "<br />")}
        </div>
      </div>

      <div class="footer">
        <p>This message was sent from the Eruwa Youth Movement website.</p>
        <p>Reply directly to this email to respond.</p>
      </div>
    </div>
  </body>
</html>
      `,
    });

    await contactMessageModel.create({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
      emailId: emailSent.data?.id,
      status: emailSent.error ? "failed" : "sent",
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      emailSent: emailSent,
    });
  } catch (error) {
    console.error("Resend error:", error);
    return res.status(500).json({
      error: "Failed to send message",
    });
  }
}
