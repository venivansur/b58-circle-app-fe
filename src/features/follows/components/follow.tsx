import { Box, Spacer, Text, Button, Flex } from '@chakra-ui/react';
import * as Tabs from '@radix-ui/react-tabs';
import { User } from '@/types/user';
import { useState, useEffect } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { api } from '@/libs/api';

export function Follows() {
  const [tabValue, setTabValue] = useState('Followers');
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userId = parseInt(localStorage.getItem('userId') || '0', 10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const followersResponse = await api.get(`/users/${userId}/followers`);
        const followingResponse = await api.get(`/users/${userId}/following`);
  
        console.log('Followers Response:', followersResponse.data);  
        console.log('Following Response:', followingResponse.data);  
  
        if (followersResponse.data && followersResponse.data.length > 0) {
          setFollowers(followersResponse.data);
        } else {
          setFollowers([]);
        }
  
        if (followingResponse.data && followingResponse.data.length > 0) {
          setFollowing(followingResponse.data);
        } else {
          setFollowing([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch followers or following');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userId]);
  

  const filteredUsers =
    tabValue === 'Followers' ? followers : following;

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
            filteredUsers.slice(0, 10).map((user, index) => (
              <Flex
                key={index}
                display="flex"
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
                  disabled={user.isFollowed}
                  variant="outline"
                  colorScheme="whiteAlpha"
                  color={'white'}
                >
                  {user.isFollowed ? 'Followed' : 'Follow'}
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
            filteredUsers.slice(0, 10).map((user, index) => (
              <Flex
                key={index}
                display="flex"
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
                  disabled={user.isFollowed}
                  variant="outline"
                  colorScheme="whiteAlpha"
                  color={'white'}
                >
                  {user.isFollowed ? 'Followed' : 'Follow'}
                </Button>
              </Flex>
            ))
          )}
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
