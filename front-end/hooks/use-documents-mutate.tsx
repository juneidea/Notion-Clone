import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/app/api";
import { Document } from "@/lib/types";

export const useDocumentsMutate = () => {
  const queryClient = useQueryClient();

  // New Document

  const newDocumentMutation = useMutation({
    mutationFn: ({ title, parentId }: { title: string; parentId?: number }) =>
      api.post("/api/documents/", {
        title,
        is_archived: false,
        is_published: false,
        parent_id: parentId,
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["documents", variables.parentId],
      });
      toast.success("New note created!");
    },
  });

  const onCreate = ({
    title,
    parentId,
  }: {
    title: string;
    parentId?: number;
  }) => {
    newDocumentMutation.mutate({ title, parentId });
    if (newDocumentMutation.isPending) toast.loading("Creating a new note...");
    if (newDocumentMutation.isError)
      toast.error("Failed to create a new note.");
  };

  // Update Document

  const updateDocumentMutation = useMutation({
    mutationFn: ({
      id,
      title,
      is_archived,
    }: {
      id: number;
      title: string;
      is_archived: boolean;
    }) =>
      api.put(`/api/documents/update/${id}/`, {
        title,
        is_archived,
      }),
    onSuccess: (data, variables) => {
      const parentId =
        data.data.parent_id === -1 ? undefined : data.data.parent_id;
      queryClient.invalidateQueries({
        queryKey: ["documents", parentId],
      });
      toast.success("Note moved to trash!");
    },
  });

  const archive = async (id: number) => {
    const byIdDocumentQuery: Document[] = await api
      .get(`/api/documents/?documentId=${id}`)
      .then((res) => res.data);
    if (!byIdDocumentQuery) {
      throw new Error("Not found");
    }
    const document = byIdDocumentQuery[0];
    const updatedDocument = updateDocumentMutation.mutate({
      id,
      title: document.title,
      is_archived: true,
    });
    if (updateDocumentMutation.isPending) toast.loading("Moving to trash...");
    if (updateDocumentMutation.isError) toast.error("Failed to archive note.");
    await recursiveArchive(id);
    return updatedDocument;
  };

  const recursiveArchive = async (parent_id: number) => {
    const childDocuments: Document[] = await api
      .get(`/api/documents/?parentId=${parent_id}`)
      .then((res) => res.data);
    childDocuments?.forEach((document) => {
      updateDocumentMutation.mutate({
        id: document.id,
        title: document.title,
        is_archived: true,
      });
      recursiveArchive(document.id);
    });
  };

  return { onCreate, archive };
};
