import * as z from "zod";

export const FormSchema = z.object({
  email: z.string().email({message: "Please enter a valid email address."}), // Correct error message for email validation

  timeZone: z
    .string()
    .min(1, {message: "Timezone is required for us to send you daily quotes."}), // Validate for empty string
});
