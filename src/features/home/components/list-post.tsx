import { Box, Text, Stack, HStack, Image, Button, Spinner } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment } from 'react-icons/fa';
import { Avatar } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/libs/api';
import { Thread } from '@/types/thread';
import { timeAgo } from '@/utils/timeAgo';
import { useLikeStore } from '@/store/like'; 

export function ListPost() {
  const { likes, toggleLike } = useLikeStore();

  const { data: threads, isLoading, isError, error } = useQuery<Thread[]>({
    queryKey: ['threads'],
    queryFn: async () => {
      const response = await api.get('/threads');
      console.log('API Response:', response);  
      return response.data.threads;  
    },
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={10}>
        <Spinner size="lg" color="white" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box textAlign="center" color="red.500" mt={10}>
        <Text>{(error as any)?.message || 'Failed to fetch posts'}</Text>
      </Box>
    );
  }


  if (!threads || threads.length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <Text color="gray.500">Tidak ada thread untuk ditampilkan.</Text>
      </Box>
    );
  }

  const sortedThreads = threads.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Box>
      {sortedThreads.length > 0 ? (
        sortedThreads.map((thread: Thread) => {
          const user = thread.user
          const isLiked = likes[thread.id] > 0; 
          const repliesCount = thread.replies?.length 
          const threadContent = thread.content 
          const fileUrl = thread.fileUrl 

          return (
            <Box
              key={thread.id}
              mb={5}
              padding={5}
              borderBottomWidth="1px"
              borderBottomColor={'gray.50'}
              pb={6}
            >
              <HStack gap={4}>
                {user.fullName && (
                  <Avatar name={user.fullName} src={user.profilePicture} />
                )}
                <Stack>
                  <Text color={'white'} fontWeight="bold">
                    {user.fullName }
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {timeAgo(thread.createdAt)}
                  </Text>
                </Stack>
              </HStack>

              <Text color={'white'} mt={2}>
                {threadContent}
              </Text>

              {fileUrl && (
                <Link to={`/post-image/${thread.id}`}>
                  <Image
                    src={fileUrl}
                    alt={`Post by ${user.fullName || 'Unknown'}`}
                    borderRadius="md"
                    mt={4}
                    cursor="pointer"
                  />
                </Link>
              )}

              <HStack mt={4} gap={8}>
                <HStack gap={1}>
                  <Button
                    variant="solid"
                    color={isLiked ? 'red' : 'white'} 
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLike(thread.id);
                    }}
                  >
                    <FaHeart />
                    {likes[thread.id] > 0 ? likes[thread.id] : 0} 
                  </Button>

                  <Link to={`/post/${thread.id}`}>
                    <Button variant="solid" size="sm">
                      <FaComment />
                      {repliesCount} Replies
                    </Button>
                  </Link>
                </HStack>
              </HStack>
            </Box>
          );
        })
      ) : (
        <Text textAlign="center" color="gray.500">
          Tidak ada thread untuk ditampilkan.
        </Text>
      )}
    </Box>
  );
}
