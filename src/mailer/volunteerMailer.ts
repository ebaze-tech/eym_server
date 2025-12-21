import express from "express";
import { resend } from "../config/resend";

import { validationResult } from "express-validator";
import { VolunteerModel } from "./volunteerModel";

interface VolunteerPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
   occupation:string;
    skills:string;
    interests:string;
    availability:string;
}

export async function volunteerMail(
  req: express.Request,
  res: express.Response
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid request", success: false });
  }

  const {
    fullName,
    occupation,
    skills,
    interests,
    availability,
    email,
    phoneNumber,
  }: VolunteerPayload = req.body;

  if (!fullName || !occupation || !skills || !interests || !availability || !email || !phoneNumber) {
    return res.status(400).json({
      error: "Required fields are missing",
    });
  }

  try {
    const emailSent = await resend.emails.send({
      from: "no-reply@eym.org",
      to: ["eymsince1961@gmail.com"],
      replyTo: email,
      subject: `New Volunteer Notification from ${fullName}`,
      html: `
      <html>
        <body>
          <h2>New Volunteer Request</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phoneNumber}</p>
          <p><strong>Occupation:</strong> ${occupation}</p>
          <p><strong>Skills:</strong> ${skills}</p>
          <p><strong>Interests:</strong> ${interests}</p>
          <p><strong>Availability:</strong> ${availability}</p>
        </body>
      </html>
      `,
    });

    await VolunteerModel.create({
      fullName,
      email,
      phoneNumber,
      occupation,
      skills,
      interests,
      availability,
      emailId: emailSent.data?.id,
      status: emailSent.error ? "rejected" : "approved",
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      emailSent,
    });
  } catch (error) {
    console.error("Resend error:", error);
    return res.status(500).json({
      error: "Failed to send message",
    });
  }
}

