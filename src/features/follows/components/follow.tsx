import { Box, Spacer, Text, Button, Flex } from '@chakra-ui/react';
import * as Tabs from '@radix-ui/react-tabs';
import { useEffect, useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { api } from '@/libs/api';
import { useFollowStore } from '@/store/follow';
import { useAuthStore } from '@/store/auth'; 
import { Link } from 'react-router-dom';

export function Follows() {
  const { user } = useAuthStore(); 
  const { followers, following, setFollowers, setFollowing, toggleFollow } = useFollowStore();
  const [tabValue, setTabValue] = useState('Followers');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
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

  const handleToggleFollow = async (targetUserId: string, isCurrentlyFollowing: boolean) => {
   

   
    toggleFollow(targetUserId, !isCurrentlyFollowing);

    if (isCurrentlyFollowing) {
      setFollowing(following.filter((user) => user.id !== targetUserId));
    } else {
      const newFollowing = [...following, { id: targetUserId }];
      setFollowing(newFollowing as any);
    }

    try {
      const endpoint = isCurrentlyFollowing
        ? `/users/${targetUserId}/follow`
        : `/users/${targetUserId}/follow`; 

      const response = await api.post(endpoint);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const [followersResponse, followingResponse] = await Promise.all([
        api.get(`/users/${userId}/followers`),
        api.get(`/users/${userId}/following`),
      ]);

      setFollowers(followersResponse.data || []);
      setFollowing(followingResponse.data || []);
    } catch (err: any) {
      console.error('Error toggling follow:', err.response?.data || err.message);
      toggleFollow(targetUserId, isCurrentlyFollowing); 

      
      if (isCurrentlyFollowing) {
        setFollowing(following);
      } else {
        setFollowing(following.filter((user) => user.id !== targetUserId));
      }
    }
  };

  const filteredUsers = tabValue === 'Followers' ? (followers || []) : (following || []);

  if (!userId) {
    return <Text color="red.500">User not found</Text>;
  }

  return (
    <Box padding={5}>
      <Tabs.Root value={tabValue} onValueChange={setTabValue}>
        <Box position="relative">
          <Tabs.List
            style={{
              margin: '30px',
              display: 'flex',
              justifyContent: 'space-around',
              position: 'relative',
            }}
          >
            <Tabs.Trigger
              value="Followers"
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                color: tabValue === 'Followers' ? 'white' : 'gray',
                fontWeight: tabValue === 'Followers' ? 'bold' : 'normal',
              }}
            >
              Followers
            </Tabs.Trigger>
            <Tabs.Trigger
              value="Following"
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                color: tabValue === 'Following' ? 'white' : 'gray',
                fontWeight: tabValue === 'Following' ? 'bold' : 'normal',
              }}
            >
              Following
            </Tabs.Trigger>
          </Tabs.List>
          <Box
            position="absolute"
            bottom="-4px"
            left={tabValue === 'Followers' ? '5%' : '50%'}
            width="300px"
            height="4px"
            bg="green.500"
            borderRadius="md"
            transition="all 0.3s ease"
          />
        </Box>

        <Tabs.Content value="Followers">
          {loading ? (
            <Text color="white">Loading...</Text>
          ) : error ? (
            <Text color="red.500">{error}</Text>
          ) : (
            filteredUsers.map((user) => (
              <Flex
                key={user.id}
                alignItems="center"
                justifyContent="space-between"
                mb={4}
              >
                <Avatar
                  src={user.profilePicture}
                  name={user.fullName}
                  size="md"
                  border="2px solid white"
                />
                <Box ml={3}>
                  <Link to={`/profile-page/${user.id}`}>
                    <Text
                      color="white"
                      fontWeight="bold"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      {user.fullName}
                    </Text>
                  </Link>
                  <Text fontSize="sm" color="gray.400">
                    @{user.username}
                  </Text>
                </Box>
                <Spacer />
                <Button
                  onClick={() =>
                    handleToggleFollow(user.id, following.some((f) => f.id === user.id))
                  }
                  variant="subtle"
                  colorScheme="whiteAlpha"
                  color="black"
                >
                  {following.some((f) => f.id === user.id) ? 'Following' : 'Follow'}
                </Button>
              </Flex>
            ))
          )}
        </Tabs.Content>

        <Tabs.Content value="Following">
          {loading ? (
            <Text color="white">Loading...</Text>
          ) : error ? (
            <Text color="red.500">{error}</Text>
          ) : (
            filteredUsers.map((user) => (
              <Flex
                key={user.id}
                alignItems="center"
                justifyContent="space-between"
                mb={4}
              >
                <Avatar
                  src={user.profilePicture}
                  name={user.fullName}
                  size="md"
                  border="2px solid white"
                />
                <Box ml={3}>
                  <Text color="white">{user.fullName}</Text>
                  <Text fontSize="sm" color="gray.400">
                    @{user.username}
                  </Text>
                </Box>
                <Spacer />
                <Button
                  onClick={() =>
                    handleToggleFollow(user.id, following.some((f) => f.id === user.id))
                  }
                  variant="subtle"
                  colorScheme="whiteAlpha"
                  color="black"
                >
                  {following.some((f) => f.id === user.id) ? 'Following' : 'Follow'}
                </Button>
              </Flex>
            ))
          )}
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
