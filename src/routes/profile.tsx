import { MyProfile } from '@/layouts/components/left-bar/my-profile';
import { Text } from '@chakra-ui/react';
import { Profile } from '@/features/my-profile/components/profile';
import { Box } from '@chakra-ui/react';
export function ProfileRoute() {
  return (
    <Box padding={5}>
      <Text as={'h1'} color="white" fontWeight={'bold'} fontSize={'xl'}>
        Profile
      </Text>

      <MyProfile />
      <Profile />
    </Box>
  );
}
