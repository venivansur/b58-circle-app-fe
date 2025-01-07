import { Box, Image, Input, Text } from '@chakra-ui/react';
import { GreenButton } from '@/components/ui/green-button';
import { Logo } from '@/assets/index';
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
        margin="auto"
        marginTop="100px"
      >
        <Image src={Logo} width={'100px'} alt="Logo"  />
        <Text as={'h1'} fontSize={'2xl'} color="white" fontWeight={'bold'}>
          Reset Password
        </Text>
        <Input
          placeholder="New Password"
          {...register('password')}
          color={'white'}
          type="password"
        />
        {errors.password && (
          <Text as={'span'} color={'red'}>
            {errors.password.message}
          </Text>
        )}
        <GreenButton type="submit">Create New Password</GreenButton>
      </Box>
    </form>
  );
}
