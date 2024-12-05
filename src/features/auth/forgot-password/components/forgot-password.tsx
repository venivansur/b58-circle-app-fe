import { Logo } from '@/assets/index';
import { GreenButton } from '@/components/ui/green-button';
import { Box, Link as ChakraLink, Image, Input, Text } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useForgotForm } from '../hooks/use-forgot-password';

export function ForgotPasswordForm() {
  const { register, onSubmit, handleSubmit, errors } = useForgotForm();

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
          Forgot Password
        </Text>
        <Input
          placeholder="Email/Username"
          {...register('emailOrUsername')}
          color={'white'}
        />

        {errors.emailOrUsername ? (
          <Text as={'span'} color={'red'}>
            {errors.emailOrUsername.message}
          </Text>
        ) : null}

        <Box display={'flex'} justifyContent={'flex-end'}>
          <ChakraLink as={ReactRouterLink} href={'/login'} color="white">
            Already Have Account?Login
          </ChakraLink>
        </Box>
        <GreenButton type="submit">Send Instruction</GreenButton>
      </Box>
    </form>
  );
}
