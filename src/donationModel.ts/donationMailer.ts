import express from "express";
import { resend } from "../config/resend";
import contactMessageModel from "./contactMessageModel";
import { validationResult } from "express-validator";
import { donationModel } from "./donationModel";

interface DonationPayload {
  fullName: string;
  amount: string;
  reference: string;
  email: string;
  message: string;
}
export async function donationEmail(req: express.Request, res: express.Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid request", success: false });
  }

  const { fullName, amount, reference, email, message }: DonationPayload =
    req.body;

  if (!email || !message || !fullName || !reference || !amount) {
    return res.status(400).json({
      error: "Required fields are missing",
    });
  }

  try {
    const emailSent = await resend.emails.send({
      from: email,
      to: ["ebaze.technologies@gmail.com"],
      replyTo: email,
      subject: `Donation Made by : ${fullName || "Anonymous Donor"}`,
      html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>New Donation Inquiry</title>
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
        background-color: #7c2d12;
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
        background: #fff7ed;
        padding: 16px;
        border-left: 4px solid #7c2d12;
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
        <h2>New Donation Inquiry</h2>
        <p>Eruwa Youth Movement</p>
      </div>

      <div class="content">
        <p><span class="label">Donor Name:</span> ${fullName}</p>
        <p><span class="label">Email:</span> ${email}</p>

        <div class="message">
          ${message.replace(/\n/g, "<br />")}
        </div>
      </div>

      <div class="footer">
        <p>This donation inquiry was submitted via the EYM website.</p>
        <p>You can reply directly to this email to follow up.</p>
      </div>
    </div>
  </body>
</html>
`,
    });

    await donationModel.create({
      fullName,
      email,
      amount,
      reference,
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
