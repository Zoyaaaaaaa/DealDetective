"use server"

import { EmailContent, EmailProductInfo, NotificationType } from '@/types';
import nodemailer from 'nodemailer';

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
};

export async function generateEmailBody(
  product: EmailProductInfo,
  type: NotificationType
) {
  const THRESHOLD_PERCENTAGE = 40;
  // Shorten the product title
  const shortenedTitle =
    product.title.length > 20
      ? `${product.title.substring(0, 20)}...`
      : product.title;

  let subject = "";
  let body = "";

  switch (type) {
    case Notification.WELCOME:
      subject = `Welcome to Price Tracking for ${shortenedTitle}`;
      body = `
      <div>
  <h2>Welcome to DealDetective 🕵️‍♂️</h2>
  <p>You are now tracking 🔍 <strong>${product.title}</strong> with us.</p>
  <p>Here's a sneak peek of the updates you'll receive:</p>
  <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
    <h3>Good News! <strong>${product.title}</strong> is Back in Stock!</h3>
    <p>We're thrilled to inform you that <strong>${product.title}</strong> is now available again.</p>
    <p>Don't miss out - <a href="${product.url}" target="_blank" rel="noopener noreferrer">buy it now</a>!</p>
    <img src="https://i.ibb.co/pwFBRMC/Screenshot-2023-09-26-at-1-47-50-AM.png" alt="Product Image" style="max-width: 100%;" />
  </div>
  <p>Stay tuned for more updates on <strong>${product.title}</strong> and other exciting deals you're tracking with DealDetective.</p>
  <p>Happy Saving!</p>
</div>

      `;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `🚨 ${shortenedTitle} is Back in Stock! 🚨`;
      body = `
     <div>
    <h4>🎉 Great News! ${product.title} is Restocked! 🎉</h4>
    <p>Don't miss out this time – grab yours before they sell out again! Click <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a> to get it now!</p>
  </div>
      `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `Lowest Price Alert for ${shortenedTitle}`;
      body = `
        <div>
          <h4>Hey, ${product.title} has reached its lowest price ever!!</h4>
          <p>Grab the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a> now.</p>
        </div>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `🚨 Unbeatable Discount Alert for ${shortenedTitle}! 🎉`;
      body = `
      <div>
        <h4>🎉 Great News! ${product.title} is Now Over ${THRESHOLD_PERCENTAGE}% Off! 🎉</h4>
         <p>Don't miss out on this fantastic deal! Click <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a> to grab yours before it's gone!</p>
      </div>
      `;
      break;

    default:
      throw new Error("Invalid notification type.");
  }

  return { subject, body };
}

const transporter = nodemailer.createTransport({
  pool: true,
  service: 'hotmail',
  port: 587, // Use the correct port for Hotmail
  secure: false, // Set to true if using port 465
  auth: {
    user: 'zoyah234@outlook.com',
    pass: 'Zoya@123',
  },
  maxConnections: 1,
});

export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
  const mailOptions = {
    from: 'zoyah234@outlook.com',
    to: sendTo,
    html: emailContent.body,
    subject: emailContent.subject,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error("Error sending email:", error);
      console.error("Error code:", error.code);
      console.error("Error response:", error.response);
      return;
    }
    console.log('Email sent:', info.response);
  });
};
