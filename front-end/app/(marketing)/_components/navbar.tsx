"use client";

import React, { useRef } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useDjangoAuth } from "@/hooks/use-django-auth";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/spinner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "./logo";
import { LoginModal } from "./loginModal";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();
  const scrolled = useScrollTop();
  const { isAuthenticated, isLoading, auth } = useDjangoAuth();

  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleAuth = async (
    e: React.FormEvent<HTMLFormElement>,
    modal: HTMLDialogElement | null
  ) => {
    e.preventDefault();
    await auth(e, modal);
    window.location.reload();
  };

  return (
    <div
      className={cn(
        "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                modalRef.current?.showModal();
              }}
            >
              Log in
            </Button>
            <Button size="sm">Get Notion Free</Button>
          </>
        )}
        {isAuthenticated && (
          <div className="flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                router.push("/documents");
              }}
            >
              Enter Notion
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/juneidea.png" />
            </Avatar>
          </div>
        )}
        <ModeToggle />
      </div>
      <LoginModal ref={modalRef} handleAuth={handleAuth} />
    </div>
  );
};
