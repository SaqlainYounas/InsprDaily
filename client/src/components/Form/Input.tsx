/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as z from "zod";
import { useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAddUserEmailMutation } from "@/redux/state/stateApi";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector

import { useTimezoneSelect } from "react-timezone-select";
import { FormSchema } from "@/app/Lib/Schema";
import { setEmail } from "@/redux/state/state";

export const InputForm: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();

  // Get email and timezone from Redux

  const { email, timeZone } = useSelector((state: any) => state.global);

  // Hook to fetch timezone options
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle: "original",
  });

  const [addUserEmail] = useAddUserEmailMutation();

  // Initialize form with useForm
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "", // Empty initially, will be reset from Redux state
      timeZone: "", // Same for timezone
    },
  });

  const {
    reset,
    formState: { errors },
  } = form;

  // Dynamically reset form values when Redux state (email, timeZone) changes
  useEffect(() => {
    if (email || timeZone) {
      reset({
        email: email || "",
        timeZone: timeZone ? timeZone.toString() : "",
      });
    }
  }, [email, timeZone, reset]);
  // Form submission
  async function onSubmit({ email, timeZone }: z.infer<typeof FormSchema>) {
    const sanitizedTimeZone = parseTimezone(timeZone);

    startTransition(async () => {
      try {
        // Dispatch to Redux store
        dispatch(setEmail({ email, timeZone: sanitizedTimeZone }));
        console.log("EMI", email, timeZone);
        // Call the API
        await addUserEmail({
          email,
          timeZone: sanitizedTimeZone,
        }).unwrap();

        //setSuccess(data.message);
      } catch (error: any) {
        //setError(error.data.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="text-start">
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input
                    className="bg-blue-100"
                    {...field}
                    type="email"
                    placeholder="Your Email"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage>{errors.email?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timeZone"
            render={({ field }) => (
              <FormItem className="text-start">
                <FormLabel className="text-white">
                  Your Timezone - Please select a different timezone according
                  to your preference
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value} // Dynamically bind selected timezone
                >
                  <FormControl className="bg-blue-100">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Your timezone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-blue-100">
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>{errors.timeZone?.message}</FormMessage>
              </FormItem>
            )}
          />
        </>

        <Button disabled={isPending} type="submit">
          {isPending ? "Submitting" : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
