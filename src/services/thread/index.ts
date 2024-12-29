import { api } from "@/libs/api";
import { Thread } from "@/types/thread";
import { useQuery } from "@tanstack/react-query";

export function useFindThreads(userId?: number) {
  const resolvedUserId = userId || Number(localStorage.getItem('userId'));

  return useQuery<Thread[]>({
    queryKey: ["threads", resolvedUserId],
    queryFn: async () => {
      const response = await api.get(`/threads?userId=${resolvedUserId}`);
      console.log("API:", response.data);
      return response.data.threads;
    },
    enabled: Boolean(resolvedUserId), // Pastikan userId ada
  });
}



