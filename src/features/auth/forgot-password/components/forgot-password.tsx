import { Logo } from '@/assets/index';
import { GreenButton } from '@/components/ui/green-button';
import { Box, Link as ChakraLink, Image, Input, Text, Spinner } from '@chakra-ui/react';
import { useForgotForm } from '../hooks/use-forgot-password';

export function ForgotPasswordForm() {
  const { register, onSubmit, handleSubmit, errors, loading } = useForgotForm(); // Pastikan loading dihandle dalam hook

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
          placeholder="Email"
          {...register('emailOrUsername')}
          color={'white'}
        />

        {errors.emailOrUsername ? (
          <Text as={'span'} color={'red'}>
            {errors.emailOrUsername.message}
          </Text>
        ) : null}

        <GreenButton type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Send Instruction'}
        </GreenButton>

        <Box display={'flex'}>
          <Text color={"white"}>
            Already have account?
          </Text>
          <ChakraLink href={'/login'} color="green">
            Login
          </ChakraLink>
        </Box>
      </Box>
    </form>
  );
}
