import express from "express";
import { resend } from "../config/resend";
import contactMessageModel from "./contactMessageModel";
import { validationResult } from "express-validator";
import { partnershipModel } from "./partnershipModel";

interface PartnershipPayload {
  organizationName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  partnershipType: string;
  message: string;
}

export async function partnershipMail(
  req: express.Request,
  res: express.Response
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid request", success: false });
  }

  const {
    organizationName,
    contactPerson,
    email,
    phoneNumber,
    partnershipType,
    message,
  }: PartnershipPayload = req.body;

  if (
    !organizationName ||
    !contactPerson ||
    !email ||
    !message ||
    !phoneNumber ||
    !partnershipType
  ) {
    return res.status(400).json({
      error: "Required fields are missing",
    });
  }

  try {
    const emailSent = await resend.emails.send({
      from: email,
      to: ["eymsince1961@gmail.com"],
      replyTo: email,
      subject: `New Partnership Notification from ${contactPerson}`,
      html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>New Partnership Request</title>
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
        background-color: #0f766e;
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
        background: #ecfeff;
        padding: 16px;
        border-left: 4px solid #0f766e;
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
        <h2>New Partnership Request</h2>
        <p>Eruwa Youth Movement</p>
      </div>

      <div class="content">
        <p><span class="label">Organization Name:</span>${organizationName}</p>
        <p><span class="label">Email:</span> ${email}</p>
        <p><span class="label">Phone:</span> ${
          phoneNumber || "Not provided"
        }</p>
        <p><span class="label">Proposed Partnership:</span> ${
          partnershipType || "General Partnership"
        }</p>

        <div class="message">
          ${message.replace(/\n/g, "<br />")}
        </div>
      </div>

      <div class="footer">
        <p>This partnership request was submitted via the EYM website.</p>
        <p>You can reply directly to this email to continue the discussion.</p>
      </div>
    </div>
  </body>
</html>
`,
    });

    await partnershipModel.create({
      organizationName,
      contactPerson,
      email,
      phoneNumber,
      partnershipType,
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
