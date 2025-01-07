import {
  Box,
  Button,
  Card,
  CardBody,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { api } from '@/libs/api';
import { useFollowStore } from '@/store/follow';
import { useAuthStore } from '@/store/auth';  // Mengimpor store auth
import { Link } from 'react-router-dom';

export function SuggestedUser() {
  const { suggestedUsers, setSuggestedUsers, toggleFollow, setFollowers, setFollowing } = useFollowStore();
  const { user } = useAuthStore();  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {  following, } = useFollowStore();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return; 

    const fetchData = async () => {
    
      setError(null);

      try {
        const [followersResponse, followingResponse] = await Promise.all([
          api.get(`/users/${userId}/followers`),
          api.get(`/users/${userId}/following`),
        ]);

        setFollowers(followersResponse.data || []);
        setFollowing(followingResponse.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch followers or following');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, setFollowers, setFollowing]);





  useEffect(() => {
    if (userId) {
      const fetchSuggestedUsers = async () => {
        try {
          const response = await api.get(`/users/${userId}/suggest-users`);
          setSuggestedUsers(response.data);
        } catch (err) {
          console.error('Error fetching suggested users:', err);
        }
      };
  
      fetchSuggestedUsers();
    }
  }, [userId, following]); 
  


  
  const handleToggleFollow = async (targetUserId: string, isCurrentlyFollowing: boolean) => {
    toggleFollow(targetUserId, !isCurrentlyFollowing); 
  
    try {
      const endpoint = isCurrentlyFollowing
        ? `/users/${targetUserId}/follow`
        : `/users/${targetUserId}/follow`;
  
      const response = await api.post(endpoint);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
  
   
      const suggestedResponse = await api.get(`/users/${userId}/suggest-users`);
      setSuggestedUsers(suggestedResponse.data);
  
      const [followersResponse, followingResponse] = await Promise.all([
        api.get(`/users/${userId}/followers`),
        api.get(`/users/${userId}/following`),
      ]);
      setFollowers(followersResponse.data || []);
      setFollowing(followingResponse.data || []);
    } catch (err: any) {
      console.error('Error toggling follow:', err.response?.data || err.message);
      toggleFollow(targetUserId, isCurrentlyFollowing); 
    }
  };
  
  
  

  if (loading) return <Text color="white">Loading...</Text>;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box marginX="20px" marginTop={'20px'} >
      <Card.Root backgroundColor="brand.secondary.800" borderStyle="none">
        <CardBody>
          <Text as="h1" color="white" fontWeight="bold" mb="10px">
            Suggested for you
          </Text>
          <Box   maxH="200px" 
            overflowY="auto" 
            display="flex"
            flexDirection="column"
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
            gap="20px">
            {suggestedUsers.slice(0, 10).map((user) => (
              <Box display="flex" key={user.id} gap={3}>
                <Avatar src={user.profilePicture} />
                <Box>
               
                  <Link to={`/profile-page/${user.id}`}>
                    <Text
                      color="white"
                      fontWeight="bold"
                      _hover={{ textDecoration: 'none' }}
                    >
                      {user.fullName}
                    </Text>
                  </Link>
                  <Text color="brand.secondary.500">@{user.username}</Text>
                </Box>
                <Spacer />
                <Button
                  onClick={() =>
                    handleToggleFollow(user.id, user.isFollowed)
                  }
                  variant="subtle"
                  color="black"
                >
                  {user.isFollowed ? 'Followed' : 'Follow'}
                </Button>
              </Box>
            ))}
          </Box>
        </CardBody>
      </Card.Root>
    </Box>
  );
}  