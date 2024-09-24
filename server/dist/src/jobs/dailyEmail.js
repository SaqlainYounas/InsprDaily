"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
exports.scheduleDailyQuotes = scheduleDailyQuotes;
/* This file contains cron job which will send out a daily email */
const node_cron_1 = __importDefault(require("node-cron"));
const resend_1 = require("resend");
const luxon_1 = require("luxon");
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("../lib/Db/prisma");
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
/* Use Resend to send the verification email along with the token created while Registering */
function sendEmail(email, randomQuote, id) {
    return __awaiter(this, void 0, void 0, function* () {
        //TODO: Add Email Unsubscribe Link
        try {
            const data = yield resend.emails.send({
                from: "onboarding@resend.dev",
                to: email,
                subject: "Your Daily Quote",
                html: `<p>${randomQuote}</p>`, // Include the quote in the email body
            });
            return data;
        }
        catch (error) {
            console.error("Error sending email:", error);
        }
    });
}
// Function to schedule daily quotes
function scheduleDailyQuotes() {
    // Cron job to check every minute
    node_cron_1.default
        .schedule("* * * * *", () => __awaiter(this, void 0, void 0, function* () {
        console.log("Running the cron job...");
        const users = yield prisma_1.db.user.findMany({
            select: { id: true, email: true, timeZone: true },
        });
        const currentUtcTime = luxon_1.DateTime.utc(); // Get current UTC time
        for (const user of users) {
            const userLocalTime = currentUtcTime.setZone(user.timeZone.value); // Convert UTC time to user's local time
            // Check if it's 6 AM in user's local time
            if (userLocalTime.hour === 6 && userLocalTime.minute === 0) {
                const alreadySentToday = yield prisma_1.db.emailSentLog.findFirst({
                    where: {
                        userId: user.id,
                        sentAt: {
                            gte: luxon_1.DateTime.now().startOf("day").toJSDate(),
                        },
                    },
                });
                if (!alreadySentToday) {
                    const quotes = yield prisma_1.db.quotes.findMany();
                    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                    yield sendEmail(user.email, randomQuote.quote, user.id); // Send the email
                    // Log that the email was sent
                    yield prisma_1.db.emailSentLog.create({
                        data: {
                            userId: user.id,
                            sentAt: new Date(),
                        },
                    });
                }
            }
        }
    }))
        .start();
    console.log("Cron job scheduled to run every minute.");
}
