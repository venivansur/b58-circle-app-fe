import { useState, useCallback } from "react";
import { api } from "@/libs/api";
import Swal from "sweetalert2";
import { ForgotForm } from "@/utils/schemas/auth/forgot-password";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotFormSchema } from "@/utils/schemas/auth/forgot-password";

export const useForgotForm = () => {
  const [loading, setLoading] = useState(false); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(ForgotFormSchema),
  });

  const onSubmit = useCallback(async (data: ForgotForm) => {
    setLoading(true); 
    try {
      const response = await api.post("/auth/forgot-password", data);

     
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        confirmButtonColor: '#347928',
        background: "#1E201E",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat mengirim email reset password.",
        icon: "error",
      });
    } finally {
      setLoading(false); 
    }
  }, []);

  return {
    register,
    onSubmit,
    handleSubmit,
    errors,
    loading, 
  };
};
