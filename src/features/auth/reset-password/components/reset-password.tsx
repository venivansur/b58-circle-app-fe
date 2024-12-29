import { Logo } from '@/assets/index';
import { GreenButton } from '@/components/ui/green-button';
import { Box, Image, Input, Text } from '@chakra-ui/react';

import { useResetForm } from '../hooks/use-reset-password';

export function ResetPasswordForm() {
  const { register, onSubmit, handleSubmit, errors } = useResetForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        gap={'10px'}
        width={'305px'}
      >
        <Image src={Logo} width={'100px'} />
        <Text as={'h1'} fontSize={'2xl'} color="white" fontWeight={'bold'}>
          Reset Password
        </Text>
        <Input
          placeholder="New Password"
          {...register('resetPassword')}
          color={'white'}
        />

        {errors.resetPassword ? (
          <Text as={'span'} color={'red'}>
            {errors.resetPassword.message}
          </Text>
        ) : null}

        <Input
          type="Confirm Reset Password"
          placeholder="Confirm Reset Password"
          {...register('confirmResetPassword')}
          color={'white'}
        />

        {errors.confirmResetPassword ? (
          <Text as={'span'} color={'red'}>
            {errors.confirmResetPassword.message}
          </Text>
        ) : null}

        <GreenButton type="submit">Create New Password</GreenButton>
      </Box>
    </form>
  );
}
