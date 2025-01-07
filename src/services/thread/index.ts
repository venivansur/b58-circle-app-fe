import { api } from "@/libs/api";
import { Thread } from "@/types/thread";
import { useQuery } from "@tanstack/react-query";

export function useFindThreads(userId?: string) {
  const resolvedUserId = userId || Number(localStorage.getItem('userId'));

  return useQuery<Thread[]>({
    queryKey: ["threads", resolvedUserId],
    queryFn: async () => {
      const response = await api.get(`/threads?userId=${resolvedUserId}`);

      
    
      if (response.data && response.data.threads && response.data.threads.length === 0) {
        return []; 
      }
      
      return response.data.threads;
    },
    enabled: Boolean(resolvedUserId), 
  });
}




