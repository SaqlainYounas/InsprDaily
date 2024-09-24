/* This file contains cron job which will send out a daily email */
import cron from "node-cron";
import {Resend} from "resend";
import {DateTime} from "luxon";

import dotenv from "dotenv";
import {db} from "../lib/Db/prisma";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
/* Use Resend to send the verification email along with the token created while Registering */
export async function sendEmail(
  email: string,
  randomQuote: string,
  id: string,
) {
  //TODO: Add Email Unsubscribe Link
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your Daily Quote",
      html: `<p>${randomQuote}</p>`, // Include the quote in the email body
    });
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Function to schedule daily quotes
export function scheduleDailyQuotes() {
  // Cron job to check every minute
  cron
    .schedule("* * * * *", async () => {
      console.log("Running the cron job...");

      const users = await db.user.findMany({
        select: {id: true, email: true, timeZone: true},
      });

      const currentUtcTime = DateTime.utc(); // Get current UTC time

      for (const user of users) {
        const userLocalTime = currentUtcTime.setZone(user.timeZone.value); // Convert UTC time to user's local time

        // Check if it's 6 AM in user's local time
        if (userLocalTime.hour === 6 && userLocalTime.minute === 0) {
          const alreadySentToday = await db.emailSentLog.findFirst({
            where: {
              userId: user.id,
              sentAt: {
                gte: DateTime.now().startOf("day").toJSDate(),
              },
            },
          });

          if (!alreadySentToday) {
            const quotes = await db.quotes.findMany();
            const randomQuote =
              quotes[Math.floor(Math.random() * quotes.length)];
            await sendEmail(user.email, randomQuote.quote, user.id); // Send the email

            // Log that the email was sent
            await db.emailSentLog.create({
              data: {
                userId: user.id,
                sentAt: new Date(),
              },
            });
          }
        }
      }
    })
    .start();

  console.log("Cron job scheduled to run every minute.");
}
