// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
// Import SESClient AND SendRawEmailCommand from @aws-sdk/client-ses
import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";

// Ensure these environment variables are set in .env.local and Vercel
const AWS_REGION = process.env.AWS_SES_REGION!;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID_SES!;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY_SES!;
const MELOFY_SUPPORT_EMAIL_TO = process.env.MELOFY_CONTACT_EMAIL!; // Your melofycontact@gmail.com
const MELOFY_SYSTEM_EMAIL_FROM = process.env.SES_SEND_FROM_EMAIL!; // Your noreply@melofyapp.com

// Basic check for environment variables for module loading - critical ones
if (!AWS_REGION || !MELOFY_SUPPORT_EMAIL_TO || !MELOFY_SYSTEM_EMAIL_FROM) {
  console.error("SES API Route (Module Load): Missing critical environment variables for email configuration (AWS_SES_REGION, MELOFY_CONTACT_EMAIL, SES_SEND_FROM_EMAIL).");
}
// Credentials will be checked during SESClient initialization

let sesClient: SESClient | null = null;
if (AWS_REGION && AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
    sesClient = new SESClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
} else {
    console.error("SES API Route (Module Load): AWS credentials (AWS_ACCESS_KEY_ID_SES, AWS_SECRET_ACCESS_KEY_SES) are missing. SESClient not initialized.");
}

// Create Nodemailer transport that uses the SES client
let transporter: nodemailer.Transporter | null = null;
if (sesClient) {
    transporter = nodemailer.createTransport({
        SES: {
            ses: sesClient,
            aws: { SendRawEmailCommand } // Explicitly provide the SendRawEmailCommand
        }
    });
} else {
    console.error("SES API Route (Module Load): Transporter not created because SESClient failed to initialize.");
}


export async function POST(req: NextRequest) {
  // Re-check critical components for this specific request
  if (!transporter) { // Also implicitly checks if sesClient was initialized
    console.error('SES API Route POST: Email service is not configured properly. Transporter is null (likely due to missing env vars or SES client init failure).');
    return NextResponse.json({ message: 'Server configuration error. Email service unavailable.' }, { status: 500 });
  }
  // Ensure other necessary env vars for the function logic are present
  if (!MELOFY_SUPPORT_EMAIL_TO || !MELOFY_SYSTEM_EMAIL_FROM) {
    console.error('SES API Route POST: Missing MELOFY_CONTACT_EMAIL or SES_SEND_FROM_EMAIL.');
    return NextResponse.json({ message: 'Server configuration error. Email recipient or sender not defined.' }, { status: 500 });
  }


  try {
    const { name: userNameFromForm, email: userEmailFromForm, message: userMessageFromForm } = await req.json();

    // Validate input
    if (!userNameFromForm || !userEmailFromForm || !userMessageFromForm) {
      return NextResponse.json({ message: 'Missing required fields: name, email, and message are required.' }, { status: 400 });
    }
    if (typeof userNameFromForm !== 'string' || typeof userEmailFromForm !== 'string' || typeof userMessageFromForm !== 'string') {
        return NextResponse.json({ message: 'Invalid data types for one or more fields.' }, { status: 400 });
    }
    // Basic email format validation for the user's input email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmailFromForm)) {
        return NextResponse.json({ message: 'Invalid user email format provided.' }, { status: 400 });
    }
    if (userNameFromForm.trim().length === 0 || userMessageFromForm.trim().length === 0) {
        return NextResponse.json({ message: 'Name and message cannot be empty.' }, { status: 400 });
    }

    const mailOptions = {
      from: `"Melofy Support System" <${MELOFY_SYSTEM_EMAIL_FROM}>`, // e.g., "Melofy Support System" <noreply@melofyapp.com>
      to: MELOFY_SUPPORT_EMAIL_TO,                             // e.g., melofycontact@gmail.com
      replyTo: userEmailFromForm,                             // The email address the user entered in the form
      subject: `New Melofy Ticket from: ${userNameFromForm.trim()}`,
      text: `You have received a new message from your Melofy contact form:\n\nName: ${userNameFromForm.trim()}\nUser's Email: ${userEmailFromForm}\n\nMessage:\n${userMessageFromForm.trim()}`,
      html: `<h3>New Contact Form Submission via Melofy</h3>
             <p><b>Name:</b> ${userNameFromForm.trim()}</p>
             <p><b>User's Email (for reply):</b> ${userEmailFromForm}</p>
             <p><b>Message:</b></p>
             <p>${userMessageFromForm.trim().replace(/\n/g, '<br>')}</p>`,
    };

    // Log the options before sending for debugging
    // console.log("Attempting to send email with options:", JSON.stringify(mailOptions, null, 2));

    await transporter.sendMail(mailOptions);
    console.log(`Contact form email sent successfully TO: ${MELOFY_SUPPORT_EMAIL_TO} FROM: ${MELOFY_SYSTEM_EMAIL_FROM} regarding user: ${userEmailFromForm}`);
    return NextResponse.json({ message: 'Thank you! Your ticket has been submitted successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('Error sending contact form email via SES:', error);
    // Log the full error object if possible, or specific parts
    console.error('Error details:', {
        message: error.message,
        code: error.Code || error.code, // AWS SDK errors often have a .Code
        name: error.name,
        stack: error.stack
    });

    let errorMessage = 'Failed to send your message. Please try again later.';
    if (error.Code === 'MessageRejected' || error.name === 'MessageRejected') { // Check both .Code and .name
        errorMessage = "Your message was rejected by the email service. This might be due to content policies or other issues. Please try contacting support directly if the problem persists."
    } else if (error.name === 'CredentialsError' || (error.message && error.message.toLowerCase().includes('credentials'))) {
        errorMessage = "Server authentication error with email service. Please contact support."
    }
    return NextResponse.json({ message: errorMessage, errorDetails: error.message || 'Unknown server error during email dispatch' }, { status: 500 });
  }
}