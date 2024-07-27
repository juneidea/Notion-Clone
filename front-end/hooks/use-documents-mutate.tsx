import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/app/api";

export const useDocumentsMutate = () => {
  const queryClient = useQueryClient();
  const newDocumentMutation = useMutation({
    mutationFn: (title: string) =>
      api.post("/api/documents/", {
        title,
        is_archived: false,
        is_published: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("New note created!");
    },
  });

  const onCreate = () => {
    newDocumentMutation.mutate("Untitled Document");
    if (newDocumentMutation.isPending) toast.loading("Creating a new note...");
    if (newDocumentMutation.isError)
      toast.error("Failed to create a new note.");
  };
  return { onCreate };
};
