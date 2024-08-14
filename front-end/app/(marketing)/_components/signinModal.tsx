"use client";

import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface forwardProps {}

export const SigninModal = forwardRef(function SigninModal(
  props: forwardProps,
  ref: any
) {
  const handleModalClick = (
    e: React.MouseEvent<HTMLDialogElement>,
    modal: HTMLDialogElement | null
  ) => {
    if (modal) {
      const dialogDimensions = modal.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        modal.close();
      }
    }
  };

  const handleSignInGithub = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`
    );
  };

  return (
    <dialog
      ref={ref}
      className="rounded-xl p-6"
      onClick={(e) => handleModalClick(e, ref.current)}
    >
      <div className="flex flex-col p-6 gap-4">
        <div>
          <h1 className="text-xl font-bold">Sign in</h1>
          <p className="text-sm font-light">with Github</p>
        </div>
        <Image src="/github.svg" height="150" width="150" alt="Github" />
        <Button type="button" onClick={handleSignInGithub}>
          Log in
        </Button>
      </div>
    </dialog>
  );
});
