import { api } from "@/libs/api";
import { UserJWTPayload } from "@/types/user";
import { useQuery, useMutation } from "@tanstack/react-query";
import { UpdateUserPayload } from "@/types/user";
export function useGetUserById(userId: string | number | undefined) {
    return useQuery<UserJWTPayload>({
      queryKey: ["user", userId],
      queryFn: async () => {
        if (!userId) {
          throw new Error("User ID is undefined");
        }
        const response = await api.get(`/users/${userId}`);
        return response.data;
      },
    });
}
export function useUpdateUserById() {
  return useMutation<UpdateUserPayload, Error, UpdateUserPayload>({
    mutationFn: async (profileData) => {
      const response = await api.put(`/users/${profileData.id}`, profileData);
      return response.data;
    },
  });
}
