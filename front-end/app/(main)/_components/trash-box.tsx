"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTrashMutate } from "@/hooks/use-trash-mutate";
import { useTrashQuery } from "@/hooks/use-trash-query";
import { Spinner } from "@/components/spinner";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/modals/confirm-modal";

export const TrashBox = () => {
  const router = useRouter();
  const documents = useTrashQuery(-1);
  const { remove, restore } = useTrashMutate();

  const [search, setSearch] = useState("");

  const filteredDocuments = documents.data?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLocaleLowerCase());
  });

  const onClick = (documentId: number) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: number
  ) => {
    event.stopPropagation();
    restore(documentId);
  };

  const onRemove = (documentId: number) => {
    router.push("/documents");
    setTimeout(() => remove(documentId), 300);
  };

  if (!documents) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground">
          No documents found.
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document.id}
            role="button"
            onClick={() => onClick(document.id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e) => onRestore(e, document.id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document.id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
