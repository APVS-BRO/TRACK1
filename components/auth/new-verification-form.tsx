"use client";
import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./Cardwrapper";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Missing Token!");
      return;
    }
    newVerification(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success);
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <>
        <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-black via-gray-900 to-gray-600">

        <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {/* Show loader only if neither success nor error */}
        {!success && !error && <BeatLoader />}
        {/* If verification succeeds, show only success */}
        {success ? (
          <FormSuccess message={success} />
        ) : (
          // Otherwise, if an error exists, show error.
          error && <FormError message={error} />
        )}
      </div>
    </CardWrapper>


    </div>
    </>
   
  );
};
