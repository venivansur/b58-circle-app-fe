import {
  Box,
  Button,
  Input,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { api } from '@/libs/api';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { useFollowStore } from '@/store/follow';
import { User } from '@/types/user';

export function SearchUser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuthStore();
  const { following, setFollowing,toggleFollow,setFollowers } = useFollowStore();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
  
      setError(null);

      try {
        const response = await api.get('/users');
        setUsers(response.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);


  useEffect(() => {
    if (!users.length || !following.length) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        following.some((followedUser) => followedUser.id === user.id)
          ? { ...user, isFollowed: true }
          : { ...user, isFollowed: false }
      )
    );
  }, [following, users]);

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


  const filteredResults = searchTerm
    ? users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) && user.id !== userId
      )
    : users.filter((user) => user.id !== userId);

  return (
    <Box margin="30px">
      <Input
        placeholder="Search your friend"
        backgroundColor="brand.secondary.800"
        color="white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <Text color="white">Loading...</Text>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : filteredResults.length === 0 && searchTerm ? (
        <Box
          w="100%"
          h="500px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text color="white">No results found</Text>
        </Box>
      ) : (
        <Box>
          {filteredResults.map((user) => (
            <Box display="flex" marginTop="20px" key={user.id}>
              <Box flex="1">
                <Avatar src={user.profilePicture} />
              </Box>
              <Box flex="8">
                <Link to={`/profile-page/${user.id}`}>
                  <Text
                    color="white"
                    fontWeight="bold"
                    _hover={{ textDecoration: 'none' }}
                  >
                    {user.fullName}
                  </Text>
                </Link>
                <Text color="brand.secondary.400">@{user.username}</Text>
                <Text color="white">{user.profile?.bio || 'No bio available'}</Text>
              </Box>
              <Button
                onClick={() => handleToggleFollow(user.id, user.isFollowed)}
                variant="subtle"
                color="black"
                flex="1"
                disabled={loading}
              >
                {user.isFollowed ? 'Following' : 'Follow'}
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
