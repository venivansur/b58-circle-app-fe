import { MyProfile } from '@/layouts/components/left-bar/my-profile';
import { Text, Box, Button } from '@chakra-ui/react';
import { useAuthStore } from '@/store/auth';
import { Profile } from '@/features/my-profile/components/profile';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
export function ProfileRoute() {
  const { user } = useAuthStore();

  return (
    <Box padding={5}>
      <Box display={'flex'} alignItems="center">
        <Link to="/">
          <Button variant="plain" color="white" aria-label="Go back to home">
            <FaArrowLeft />
          </Button>
        </Link>
        <Text as={'h1'} color="white" fontWeight={'bold'} fontSize={'xl'}>
          {user ? ` ${user.fullName}` : ''}
        </Text>
      </Box>
      <MyProfile />
      <Profile />
    </Box>
  );
}
