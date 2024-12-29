import * as Tabs from '@radix-ui/react-tabs';
import { useState } from 'react';
import {
  Box,
  Text,
  Stack,
  IconButton,
  Button,
  HStack,
  Separator,
  Image,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaComment } from 'react-icons/fa';
import { Avatar } from '@/components/ui/avatar';
import { useLikeStore } from '@/store/like';
import { useFindThreads } from '@/services/thread';

export function Profile() {
  const storedUserId = localStorage.getItem('userId');
  const parsedUserId = storedUserId ? parseInt(storedUserId) : undefined;

  console.log('User ID:', parsedUserId);

  const { data: threadsData, isLoading, error } = useFindThreads(parsedUserId);
  const [tabValue, setTabValue] = useState('All Post');
  const navigate = useNavigate();

 
  const { toggleLike, likes } = useLikeStore(); 

  const handleLike = async (threadId: number) => {
    console.log('Toggling like for thread ID:', threadId);
    try {
      await toggleLike(threadId);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (isLoading) {
    return <Text color="white">Loading threads...</Text>;
  }

  if (error) {
    return <Text color="red.500">Error fetching threads</Text>;
  }

  const threads = Array.isArray(threadsData) ? threadsData : [];
  console.log('threadsData:', threadsData);

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
                      variant="solid"
                      color={likes[thread.id] ? 'red' : 'white'}
                      size="sm"
                      onClick={() => handleLike(thread.id)}
                    >
                      <FaHeart />
                      {likes[thread.id] || 0} Likes
                    </Button>
                    <Link to={`/post/${thread.id}`}>
                      <IconButton variant="solid" color="white" size="sm">
                        <FaComment />
                        {thread.replies?.length || 0} Replies
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
                      onClick={() => navigate(`/post/${thread.id}`)}
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
