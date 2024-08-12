"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface forwardProps {
  handleAuth: (
    e: React.FormEvent<HTMLFormElement>,
    modal: HTMLDialogElement | null
  ) => void;
}

export const LoginModal = forwardRef(function LoginModal(
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

  return (
    <dialog
      ref={ref}
      className="rounded-xl p-6"
      onClick={(e) => handleModalClick(e, ref.current)}
    >
      <form
        className="flex flex-col p-6 gap-4"
        onSubmit={(e) => props.handleAuth(e, ref.current)}
      >
        <div>
          <h1 className="text-xl font-bold">Sign in</h1>
          <p className="text-sm font-light">to continue to notion</p>
        </div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          className={cn("bg-stone-200 dark:bg-stone-700")}
          autoComplete="username"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className={cn("bg-stone-200 dark:bg-stone-700")}
          autoComplete="current-password webauthn"
        />
        <Button type="submit">Log in</Button>
      </form>
    </dialog>
  );
});
