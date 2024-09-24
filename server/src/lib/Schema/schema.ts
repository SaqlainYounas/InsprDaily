import * as z from "zod";

// Define the Timezone schema
const TimezoneSchema = z.object({
  value: z.string().min(1, {message: "Timezone value is required."}),
  label: z.string().optional(), // Optional, since some use cases might not require this
  offset: z.number().optional(), // Optional, depending on whether this is required
  abbrev: z.string().optional(), // Optional timezone abbreviation
});

export const UserSchema = z.object({
  email: z.string().email({message: "Invalid email address."}),
  timeZone: TimezoneSchema,
});
