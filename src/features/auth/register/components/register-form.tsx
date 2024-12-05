import { Logo } from '@/assets/index';
import { GreenButton } from '@/components/ui/green-button';
import { Image, Box, Link as ChakraLink, Input, Text } from '@chakra-ui/react';

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
        <Input placeholder="Full Name" {...register('name')} color={'white'} />

        {errors.name ? (
          <Text as={'span'} color={'red'}>
            {errors.name.message}
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

<Input placeholder="Address" {...register("address")} color={"white"} />

{errors.address ? (
  <Text as={"span"} color={"red"}>
    {errors.address.message}
  </Text>
) : null}

        <Box display={'flex'} justifyContent={'flex-end'}>
          <ChakraLink href={'/login'} color="white">
            Already have account?
          </ChakraLink>
        </Box>
        <GreenButton type="submit">Register</GreenButton>
      </Box>
    </form>
  );
}
