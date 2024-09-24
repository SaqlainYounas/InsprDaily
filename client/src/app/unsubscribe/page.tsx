"use client";
import React, {useCallback, useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {FormSuccess} from "@/components/Form/FormSuccess";
import {FormError} from "@/components/Form/FormError";
import {useUnsubscribeMutation} from "@/redux/state/stateApi";
export default function Unsubscribe() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [unsubscribe] = useUnsubscribeMutation();
  /* Use the Search params to find the id in the page - this page is opened by clicking link sent in the email */
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const onSubmit = useCallback(async () => {
    //if there is already something in the success or erro then return
    if (success || error) return;
    //if there is no token in the params then set the Error.
    if (!id) {
      setError("Missing ID");
      return;
    }
    console.log("ID", id);
    try {
      await unsubscribe({id})
        .unwrap()
        .then(() => {
          setSuccess("You are Unsubscribed!");
        });
    } catch (error: any) {
      setError(error.data.message);
    }
  }, [id, success, error]);
  /* On page load run submit to verify the token. */
  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <div className="flex h-full flex-col justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className='className="space-y-6 text-center"'>
        <h1
          className={
            "text-6xl font-semibold text-white drop-shadow-md text-center"
          }
        >
          Inspir Daily ✨
        </h1>
        <p className="text-white text-lg p-10">Its Sad to see you go 🥹</p>
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </div>
  );
}
