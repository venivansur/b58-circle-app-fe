import { Box, Button, Card, CardBody, Spacer, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { Avatar } from '@/components/ui/avatar';
import { api } from '@/libs/api';

export function SuggestedUser() {
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await api.get('/users/:userId/suggest-users');
        setSuggestedUsers(response.data);
      } catch {
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  const handleFollowToggle = async (userId: string, isFollowed: boolean) => {
    const updatedUsers = suggestedUsers.map((user) =>
      user.id === userId ? { ...user, isFollowed: !isFollowed } : user
    );
    setSuggestedUsers(updatedUsers);

    try {
      const endpoint = `/users/${userId}/follow`;
      const response = await api.post(endpoint);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update follow status. Please try again.');
      setSuggestedUsers(suggestedUsers);
    }
  };

  if (loading) return <Text color="white">Loading...</Text>;
  if (error) return <Text color="white">{error}</Text>;

  return (
    <Box marginX="20px" marginY="20px">
      <Card.Root backgroundColor="brand.secondary.800" borderStyle="none">
        <CardBody>
          <Text as="h1" color="white" fontWeight="bold" mb="10px">
            Suggested for you
          </Text>
          <Box display="flex" flexDirection="column" gap="20px">
            {suggestedUsers.slice(0, 3).map((user) => (
              <Box display="flex" key={user.id} gap={3}>
                <Avatar src={user.profilePicture} />
                <Box>
                  <Text color="white">{user.fullName}</Text>
                  <Text color="brand.secondary.500">@{user.username}</Text>
                </Box>
                <Spacer />
                <Button
                  onClick={() => handleFollowToggle(user.id, user.isFollowed)}
                  variant="outline"
                  color="white"
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
