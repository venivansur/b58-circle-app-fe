import * as Tabs from '@radix-ui/react-tabs';
import { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Text,
  Stack,
  Button,
  HStack,
  Separator,
  Image,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaComment } from 'react-icons/fa';
import { Avatar } from '@/components/ui/avatar';
import { useLikeStore } from '@/store/like';
import { api } from '@/libs/api'; 

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>(); 
  const navigate = useNavigate();


  const [, setUserProfile] = useState<any>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState('All Post');

  const { toggleLike, likes } = useLikeStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
       

       
        const profileResponse = await api.get(`/users/${userId}`);
        const threadsResponse = await api.get(`/threads?userId=${userId}`);

      
        setUserProfile(profileResponse.data);
        setThreads(threadsResponse.data.threads);
      } catch (err) {
        setError('Error fetching profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <Text color="white">Loading...</Text>;
  }

  if (error) {
    return <Text color="red.500">Error fetching profile data</Text>;
  }

  const handleLike = async (threadId: number) => {
    try {
      await toggleLike(threadId);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <Box>
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
              value="All Post"
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                color: tabValue === 'All Post' ? 'white' : 'gray',
                fontWeight: tabValue === 'All Post' ? 'bold' : 'normal',
              }}
            >
              All Post
            </Tabs.Trigger>
            <Tabs.Trigger
              value="Media"
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                color: tabValue === 'Media' ? 'white' : 'gray',
                fontWeight: tabValue === 'Media' ? 'bold' : 'normal',
              }}
            >
              Media
            </Tabs.Trigger>
          </Tabs.List>
          <Box
            position="absolute"
            bottom="-4px"
            left={tabValue === 'All Post' ? '5%' : '50%'}
            width="300px"
            height="4px"
            bg="green.500"
            borderRadius="md"
            transition="all 0.3s ease"
          />
        </Box>

        <Tabs.Content value="All Post">
          {threads.length > 0 ? (
            threads.map((thread) => (
              <Box mt={5} key={thread.id}>
                <HStack gap={4}>
                  <Avatar
                    name={thread.user.fullName}
                    src={thread.user.profilePicture}
                  />
                  <Stack>
                    <Text color={'white'} fontWeight="bold">
                      {thread.user.fullName}
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                      {new Date(thread.createdAt).toLocaleString()}
                    </Text>
                  </Stack>
                </HStack>

                <Text color={'white'} mt={2}>
                  {thread.content}
                </Text>

                {thread.fileUrl && (
                  <Image
                    src={thread.fileUrl}
                    alt={thread.user.fullName}
                    borderRadius="md"
                    mt={4}
                    cursor="pointer"
                    onClick={() => navigate(`/post-image/${thread.id}`)}
                  />
                )}

                <HStack mt={4} gap={8}>
                  <HStack gap={1}>
                    <Button
                      variant="plain"
                      color={likes[thread.id] ? 'red' : 'white'}
                      size="sm"
                      onClick={() => handleLike(thread.id)}
                    >
                      <FaHeart />
                      {likes[thread.id] || 0} 
                    </Button>
                    <Link to={`/post/${thread.id}`}>
                      <IconButton variant="plain" color="white" size="sm">
                        <FaComment />
                        {thread.replies?.length || 0} 
                      </IconButton>
                    </Link>
                  </HStack>
                </HStack>

                <Separator mt={4} />
              </Box>
            ))
          ) : (
            <Text color="gray.500" textAlign="center">
              No posts available.
            </Text>
          )}
        </Tabs.Content>

        <Tabs.Content value="Media">
          {threads.some((thread) => thread.fileUrl) ? (
            <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={4}>
              {threads
                .filter((thread) => thread.fileUrl)
                .map((thread) => (
                  <GridItem key={thread.id}>
                    <Image
                      src={thread.fileUrl}
                      width="244px"
                      height="244px"
                      objectFit="cover"
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => navigate(`/post-image/${thread.id}`)}
                    />
                  </GridItem>
                ))}
            </Grid>
          ) : (
            <Text color="gray.500" textAlign="center" mt={4}>
              No media uploaded yet.
            </Text>
          )}
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
