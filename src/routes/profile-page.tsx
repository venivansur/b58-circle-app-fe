import { MyProfile } from '@/layouts/components/left-bar/my-profile';
import { Text, Box, Button } from '@chakra-ui/react';
import { ProfilePage } from '@/features/my-profile/components/profile-page';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { useState, useEffect } from 'react';
import { api } from '@/libs/api';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
export function ProfilePageRoute() {
  const { userId } = useParams<{ userId?: string }>();
  const { user } = useAuthStore();
  const [profileName, setProfileName] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId) {
        try {
          const response = await api.get(`/users/${userId}`);
          setProfileName(response.data.fullName);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else if (user) {
        setProfileName(user.fullName);
      }
    };

    fetchUserProfile();
  }, [userId, user]);

  return (
    <Box padding={5}>
      <Box display={'flex'} alignItems="center">
        <Link to="/">
          <Button variant="plain" color="white" aria-label="Go back to home">
            <FaArrowLeft />
          </Button>
        </Link>
        <Text as={'h1'} color="white" fontWeight={'bold'} fontSize={'xl'}>
          {profileName ? ` ${profileName}` : 'Page'}
        </Text>
      </Box>

      <MyProfile selectedUserId={userId} />
      <ProfilePage />
    </Box>
  );
}
