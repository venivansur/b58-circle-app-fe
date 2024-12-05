import fakeUser from "@/datas/user.json";
import { useAuthStore } from "@/store/auth";
import { User } from "@/types/user";
import { ForgotForm, ForgotFormSchema } from "@/utils/schemas/auth/forgot-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const useForgotForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    mode: "onSubmit",
    resolver: zodResolver(ForgotFormSchema),
  });

  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    (data: ForgotForm) => {
     
      const user = fakeUser.find(
        (user) =>
          user.email === data.emailOrUsername ||
          user.username === data.emailOrUsername
      ) as User | undefined; 

      if (user) {
      
        user.password = ""; 
        setUser(user); 
        navigate("/login");
      } else {
       
        alert("User tidak ditemukan!");
      }
    },
    [navigate, setUser]
  );

  return {
    register,
    onSubmit,
    handleSubmit,
    errors,
  };
};
