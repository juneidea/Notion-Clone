import { useQuery } from "@tanstack/react-query";
import { Document } from "@/lib/types";
import api from "@/app/api";

export const useDocumentsQuery = () => {
  return useQuery({
    queryFn: (): Promise<Document[]> =>
      api.get("/api/documents/").then((res) => res.data),
    queryKey: ["documents"],
  });
};
