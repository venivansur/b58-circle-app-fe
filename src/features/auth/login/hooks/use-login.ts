import { useLogin } from '@/services/auth';
import { LoginForm, loginFormSchema } from '@/utils/schemas/auth/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import Swal from 'sweetalert2';

export const useLoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: 'onSubmit',
    resolver: zodResolver(loginFormSchema),
  });

  const { mutateAsync } = useLogin();
  const navigate = useNavigate();

  const { setUser } = useAuthStore();

  const onSubmit = useCallback(
    async (data: LoginForm) => {
      try {
        const response = await mutateAsync(data);
        const { token, user } = response.data;

        if (!token || !user) {
          throw new Error('Invalid login response');
        }

        setUser(user);

        localStorage.setItem('token', token);

        Swal.fire({
          title: 'Success',
          text: 'You have logged in successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#347928',
          background: '#1E201E',
        });

        navigate('/', { replace: true });
      } catch (error: any) {
        console.error('Error saat login:', error);

        const errorMessage =
          error.response?.data?.message || 'Login failed. Please try again.';
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#347928',
          background: '#1E201E',
        });
      }
    },
    [mutateAsync, navigate, setUser]
  );

  return {
    register,
    onSubmit,
    handleSubmit,
    errors,
  };
};
