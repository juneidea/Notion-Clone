"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useDjangoAuth } from "../../../../hooks/use-django-auth";

const DocumentsPage = () => {
  const { user } = useDjangoAuth();
  const userName = user
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : "Anonymous";
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height="192"
        width="300"
        alt="Empty"
        sizes="300px"
        priority
      />
      <h2 className="text-lg font-medium">
        Welcome to {userName}&apos;s Notion
      </h2>
      <Button>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;
