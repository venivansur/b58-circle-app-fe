import {
  RegisterForm,
  registerFormSchema,
} from '@/utils/schemas/auth/register';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useRegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    mode: 'onSubmit',
    resolver: zodResolver(registerFormSchema),
  });

  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (data: RegisterForm) => {
      const { email, name, password } = data;

      try {
        const response = await axios.post(
          'https://jsonplaceholder.typicode.com/users',
          {
            name,
            email,
            password,
          }
        );

        console.log('Registration successful:', response.data);

        alert('Berhasil register!');

        navigate('/login');
      } catch (error) {
        console.error('Error during registration:', error);

        if (axios.isAxiosError(error)) {
          alert('Gagal register, silakan coba lagi.');
        } else {
          alert('Terjadi kesalahan, coba lagi.');
        }
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
