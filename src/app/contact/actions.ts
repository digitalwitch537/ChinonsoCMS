
"use server";

import * as z from "zod";
import nodemailer from "nodemailer";
import { addContactSubmission, getContactInfo } from "@/lib/data-service"; 
import type { ContactSubmission, ContactInfo } from "@/lib/types";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

interface SubmissionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function submitContactForm(
  values: z.infer<typeof contactFormSchema>
): Promise<SubmissionResult> {
  const validationResult = contactFormSchema.safeParse(values);

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;
    const errorMessages = Object.values(errors).flat().join(' ');
    return { success: false, error: errorMessages || "Invalid form data." };
  }

  const { name, email, subject, message } = validationResult.data;

  let adminContactInfo: ContactInfo;
  try {
    adminContactInfo = await getContactInfo();
    if (!adminContactInfo || !adminContactInfo.email) {
      console.error("Admin contact email not configured.");
      return { success: false, error: "System error: Recipient email not configured." };
    }
  } catch (e) {
    console.error("Failed to get admin contact info:", e);
    return { success: false, error: "System error: Could not retrieve recipient email." };
  }
  
  const recipientEmail = adminContactInfo.email;

  // Save to JSON log file first
  try {
    const submissionData: Omit<ContactSubmission, 'id' | 'submittedAt'> = {
      name,
      email,
      subject,
      message,
      recipientEmail: recipientEmail,
    };
    await addContactSubmission(submissionData);
    console.log("Contact form submission saved to log:", submissionData);
  } catch (e) {
    console.error("Error saving contact form submission to log:", e);
    // Continue to attempt email sending even if log saving fails, but log the error.
  }

  // Send email using Nodemailer
  // IMPORTANT: Configure these environment variables in your hosting environment (e.g., Netlify)
  // EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_SMTP_USER, EMAIL_SMTP_PASS
  const { EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_SMTP_USER, EMAIL_SMTP_PASS } = process.env;

  if (!EMAIL_SMTP_HOST || !EMAIL_SMTP_PORT || !EMAIL_SMTP_USER || !EMAIL_SMTP_PASS) {
    console.error("Email SMTP environment variables not configured. Email not sent.");
    // Return success because the submission was logged, but with a message about email.
    // Or, if email is critical, return failure. For now, let's inform it was logged.
    return { 
        success: true, // Form data was captured
        message: "Your message has been logged. Email delivery is pending system configuration.",
        error: "Email service not configured by admin." // This error is more for the admin
    };
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_SMTP_HOST,
    port: parseInt(EMAIL_SMTP_PORT, 10),
    secure: parseInt(EMAIL_SMTP_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_SMTP_USER,
      pass: EMAIL_SMTP_PASS,
    },
    // Consider adding timeout options if needed:
    // connectionTimeout: 5 * 60 * 1000, // 5 min
    // greetingTimeout: 5 * 60 * 1000, 
    // socketTimeout: 5 * 60 * 1000,
  });

  const mailOptions = {
    from: `"${name}" <${EMAIL_SMTP_USER}>`, // Sender address (use your configured email user)
    replyTo: email, // Set reply-to as the form submitter's email
    to: recipientEmail, // Admin's email from contactInfo.json
    subject: `New Contact Form Submission: ${subject}`,
    text: `You have a new message from ${name} (${email}):\n\n${message}`,
    html: `
      <p>You have a new message from <strong>${name}</strong> (<a href="mailto:${email}">${email}</a>):</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${message}</p>
      <hr>
      <p><em>This email was sent from the contact form on ChinonsoIT.</em></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", recipientEmail);
    return { success: true, message: "Thank you for your message! It has been sent." };
  } catch (error) {
    console.error("Error sending email with Nodemailer:", error);
    // Log the detailed error for server-side debugging
    // For the client, give a more generic error but acknowledge receipt if logged
    return { 
        success: true, // Still true if logged
        message: "Your message has been logged, but there was an issue sending the email notification. The admin will be notified.",
        error: `Failed to send email. Please try again later or contact support directly. Error: ${(error as Error).message}` 
    };
  }
}
