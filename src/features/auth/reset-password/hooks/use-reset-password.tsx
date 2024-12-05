import fakeUser from '@/datas/user.json';
import { useAuthStore } from '@/store/auth';
import { User } from '@/types/user';
import {
  ResetForm,
  ResetFormSchema,
} from '@/utils/schemas/auth/reset-password';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const useResetForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    mode: 'onSubmit',
    resolver: zodResolver(ResetFormSchema),
  });

  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    (data: ResetForm) => {
      const user = fakeUser.find(
        (user) => user.password === data.resetPassword
      ) as User;

      if (user) {
        user.password = data.resetPassword;
        setUser(user);

        navigate('/login');
      } else {
        alert('User tidak ditemukan atau password salah!');
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
