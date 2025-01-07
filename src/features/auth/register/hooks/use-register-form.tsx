import { api } from "@/libs/api";
import { RegisterForm, registerFormSchema } from "@/utils/schemas/auth/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const useRegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    mode: "onSubmit",
    resolver: zodResolver(registerFormSchema),
  });

  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (data: RegisterForm) => {
      const { email, fullName, password } = data;

      try {
        await api.post<unknown, unknown, RegisterForm>("/auth/register", {
          fullName,
          email,
          password,
        });

       
        Swal.fire({
          title: "Registration Successful!",
          text: "You have successfully registered. Please log in.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: '#347928',
          background: '#1E201E',
        }).then(() => {
          navigate("/login");
        });
      } catch (error) {
       
        Swal.fire({
          title: "Registration Failed",
          text: "There was an issue with your registration. Please try again.",
          icon: "error",
          confirmButtonText: "Retry",
          background: '#1E201E',
        });
      }
    },
    [navigate]
  );

  return {
    register,
    onSubmit,
    handleSubmit,
    errors,
  };
};
