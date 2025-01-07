import { Logo } from '@/assets/index';
import { GreenButton } from '@/components/ui/green-button';
import { Image, Box, Link as ChakraLink, Input, Text, HStack } from '@chakra-ui/react';
import { useRegisterForm } from '../hooks/use-register-form';

export function RegisterForm() {
  const { register, onSubmit, handleSubmit, errors } = useRegisterForm();

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
          Register to Circle
        </Text>
        <Input placeholder="Full Name" {...register('fullName')} color={'white'} />

        {errors.fullName ? (
          <Text as={'span'} color={'red'}>
            {errors.fullName.message}
          </Text>
        ) : null}

        <Input placeholder="Email" {...register('email')} color={'white'} />

        {errors.email ? (
          <Text as={'span'} color={'red'}>
            {errors.email.message}
          </Text>
        ) : null}

        <Input
          type="password"
          placeholder="Password"
          {...register('password')}
          color={'white'}
        />

        {errors.password ? (
          <Text as={'span'} color={'red'}>
            {errors.password.message}
          </Text>
        ) : null}


        <Box>
          <HStack>
            <Text color={"white"}>
              Already have account?
            </Text>
          <ChakraLink href={'/login'} color="green">
            Login
          </ChakraLink>
          </HStack>
        </Box>
        <GreenButton type="submit">Register</GreenButton>
      </Box>
    </form>
  );
}
