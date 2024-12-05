import fakeUsers from '@/datas/user.json';
import { User } from '@/types/user';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const useSearchUser = () => {
  const { register, watch } = useForm({
    defaultValues: {
      search: '',
    },
  });

  const [users] = useState<User[]>(fakeUsers);

  return {
    register,
    watch,
    users,
  };
};
