import { api } from "@/libs/api";
import { LoginForm } from "@/utils/schemas/auth/login";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  return useMutation<{ data: { user: any; token: string } }, Error, LoginForm>({
    mutationFn: async (data: LoginForm) => {
      const response = await api.post("/auth/login", data);
     
      return response.data;
    },
  });
}

