import {
  Box,
  Button,
  Input,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { Avatar } from '@/components/ui/avatar';
import { api } from '@/libs/api';

export function SearchUser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users');
        setSearchResults(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFollow = async (userId: number, isFollowed: boolean) => {
    try {
      setLoading(true);
      const response = isFollowed
        ? await api.post(`/users/${userId}/unfollow`) // Jika mengikuti, lakukan unfollow
        : await api.post(`/users/${userId}/follow`); // Jika tidak mengikuti, lakukan follow

      if (response.data.success) {
        setSearchResults((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, isFollowed: !isFollowed } : user
          )
        );
      }
    } catch (error) {
      setError('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = searchResults.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      ) : !searchTerm ? (
        <Box
          w="100%"
          h="500px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text color="white">Type a username to search</Text>
        </Box>
      ) : filteredResults.length === 0 ? (
        <Box
          w="100%"
          h="500px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          textAlign="center"
        >
          <Text fontWeight="bold" fontSize="lg" color="white">
            No results for "{searchTerm}"
          </Text>
          <Text color="brand.secondary.500">
            Try searching for something else or check the spelling.
          </Text>
        </Box>
      ) : (
        <Box>
          {filteredResults.map((user) => (
            <Box display="flex" marginTop="20px" key={user.id}>
              <Box flex="1">
                <Avatar src={user.profilePicture} />
              </Box>
              <Box flex="8">
                <Text color="white">{user.fullName}</Text>
                <Text color="brand.secondary.400">@{user.username}</Text>
                <Text color="white">{user.profile.bio}</Text>
              </Box>
              <Button
                onClick={() =>
                  handleFollow(Number(user.id), user.isFollowed)
                }
                variant="outline"
                color="white"
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
