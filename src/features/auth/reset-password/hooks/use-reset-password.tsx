import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';  
import Swal from 'sweetalert2'; 
import { ResetForm, ResetFormSchema } from '@/utils/schemas/auth/reset-password';

export const useResetForm = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(window.location.search).get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      console.log("Token from URL:", tokenFromUrl); 
    } else {
      console.log("Token tidak ditemukan di URL.");
    }
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({
    resolver: zodResolver(ResetFormSchema),
  });

  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (data: ResetForm) => {
      if (!token) {
        Swal.fire({
          title: 'Error',
          text: 'Token tidak ditemukan.',
          icon: 'error',
        });
        return;
      }

      try {
        const response = await axios.post('b58-circle-app-be-venivansuryas-projects.vercel.app/api/v1/auth/reset-password', {
          token,
          password: data.password,
        });

        if (response.status === 200) {
          Swal.fire({
            title: 'Success',
            text: 'Password berhasil direset. Silakan login dengan password baru Anda.',
            icon: 'success',
            background: '#1E201E',
          }).then(() => {
            navigate('/login');
          });
        } else {
          console.log(response.data);
          Swal.fire({
            title: 'Error',
            text: response.data.message || 'Gagal mereset password.',
            icon: 'error',
          });
        }
      } catch (err: any) {
        console.error(err); 
        Swal.fire({
          title: 'Error',
          text: err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.',
          icon: 'error',
        });
      }
    },
    [token, navigate]
  );

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
  };
};
