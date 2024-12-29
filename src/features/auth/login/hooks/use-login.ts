import { useLogin } from "@/services/auth";
import { LoginForm, loginFormSchema } from "@/utils/schemas/auth/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 

export const useLoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onSubmit",
    resolver: zodResolver(loginFormSchema),
  });
  const { mutateAsync } = useLogin();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (data: LoginForm) => {
      try {
        const response = await mutateAsync(data);
const { token, user } = response.data; 
const userId = user.id; 

localStorage.setItem("userId", JSON.stringify(userId));  
localStorage.setItem("token", token); 

console.log("Token dan userId berhasil disimpan:", token, userId);


     
        Swal.fire({
          title: 'Success',
          text: 'You have logged in successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#347928',
          background: '#1E201E',
        });

       
        navigate("/");
      } catch (error) {
        console.error("Error saat login:", error);

        Swal.fire({
          title: 'Error',
          text: 'Login failed. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#347928',
          background: '#1E201E',
        });
      }
    },
    [mutateAsync, navigate]
  );

  return {
    register,
    onSubmit,
    handleSubmit,
    errors,
  };
};
