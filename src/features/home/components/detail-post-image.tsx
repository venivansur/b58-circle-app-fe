 import {
  Box,
  Text,
  Image,
  HStack,
  Button,
  Center,
  Input,
  Grid,
  GridItem,
  Stack,
} from '@chakra-ui/react';
import {
  DialogRoot,
  DialogCloseTrigger,
  DialogContent,
  DialogBody,
} from '@/components/ui/dialog';
import { FaHeart, FaComment } from 'react-icons/fa';
import { Avatar } from '@/components/ui/avatar';
import { useState, useRef, useEffect, useCallback } from 'react';
import { GreenButton } from '@/components/ui/green-button';
import { api } from '@/libs/api';
import { useParams } from 'react-router-dom';
import { GalleryAdd } from '@/assets';
import { useDisclosure } from '@chakra-ui/react';
import { timeAgo } from '@/utils/timeAgo';
import { Thread, Reply } from '@/types/thread';
import { useLikeStore } from '@/store/like'; 
export default function PostWithImageDetail() {
  const { id } = useParams();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { open, onOpen, onClose } = useDisclosure();
  const [usersData, setUsersData] = useState<any[]>([]);
  const [thread, setThread] = useState<Thread | null>(null);
  const [threadsUser, setThreadsUser] = useState<any>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [newReplyImage, setNewReplyImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
 
  const { likes, toggleLike } = useLikeStore();
  const likesCount = likes[parseInt(id!)] || 0; 
 
  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);

    const fetch = async () => {
  
      try {
        const storedUserId = localStorage.getItem('userId');
        const userId = storedUserId ? parseInt(storedUserId) : null;
        console.log('User Response:', userId);
  
        if (!userId) {
          setError('User ID not found in localStorage.');
          return;
        }
  
        const userResponse = await api.get('/users');
        const usersData = userResponse.data;
        setUsersData(usersData);
  
        const threadResponse = await api.get(`/threads/${id}`);
        console.log('Threads Response:', threadResponse);
  
        const threadData = threadResponse.data.thread;
        console.log('Threads Data:', threadData);
        if (!threadData || !threadData.userId) {
          setError('Thread or userId is missing.');
          return;
        }
  
        setThread(threadData);
  
        const userWhoCreatedThread = usersData.find(
          (user: any) => user.id === threadData.userId
        );
        if (userWhoCreatedThread) {
          setThreadsUser(userWhoCreatedThread);
        } else {
          setError('User not found for this thread.');
        }
  
       
        const repliesResponse = await api.get(`/threads/${id}/replies`);
        setReplies(repliesResponse.data.replies || []);
        console.log('Replies Data:', repliesResponse.data.replies);
  
      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetch();
  }, [id]);
  

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!newReply.trim() && !newReplyImage) return;
  
    try {
      const storedUserId = localStorage.getItem('userId');
      const userId = storedUserId ? parseInt(storedUserId) : null;
      const loggedInUser = usersData.find((user: any) => user.id === userId);
  
      if (!loggedInUser) {
        setError('Logged-in user not found.');
        return;
      }
  
      const newReplyData = {
        content: newReply,
        userId: loggedInUser.id,
        user: loggedInUser.fullName,
        fileUrl: newReplyImage,
      };
  
      const response = await api.post(`/threads/${id}/replies`, newReplyData);
      const addedReply = response.data.reply;
      
  
      setReplies((prevReplies) => [...prevReplies, addedReply]);
      setNewReply('');
      setNewReplyImage(null);
  
      if (inputFileRef.current) inputFileRef.current.value = '';
    } catch (err) {
      setError('Failed to add reply.');
      console.error(err);
    }
  };
  

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setNewReplyImage(imageUrl);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Invalid file type. Please upload an image.');
    }
  };
  
  if (loading) {
    return (
      <Center mt={20}>
        <Text color="gray.500" fontSize="xl">
          Loading...
        </Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center mt={20}>
        <Text color="red.500" fontSize="xl">
          {error}
        </Text>
      </Center>
    );
  }

  if (!thread || !threadsUser) {
    return (
      <Center mt={20}>
        <Text color="red.500" fontSize="xl">
          Post or User not found!
        </Text>
      </Center>
    );
  }

  const user = thread.user || {};
  const repliesCount = thread.replies?.length || 0;
  const threadContent = thread.content || 'No content';

  return (
    <Box p={5}>
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={4}>
        <GridItem>
          {thread.fileUrl && (
            <Image
              src={thread.fileUrl}
              alt={`Image posted by ${threadsUser?.username}`}
              borderRadius="md"
              width="90%"
              objectFit="cover"
              cursor="pointer"
              onClick={onOpen}
            />
          )}
        </GridItem>

        <GridItem>
          <Box key={thread.id} mb={5} padding={5} pb={6}>
            <HStack gap={4}>
              {user.fullName && (
                <Avatar name={user.fullName} src={user.profilePicture || ''} />
              )}
              <Stack>
                <Text color="white" fontWeight="bold">
                  {user.fullName || 'Unknown User'}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  {timeAgo(thread.createdAt)}
                </Text>
              </Stack>
            </HStack>

            <Text color="white" mt={2}>
              {threadContent}
            </Text>

            <HStack mt={4} gap={8}>
              <HStack gap={1}>
                <Button
                  variant="solid"
                  color={likesCount > 0 ? 'red' : 'white'}
                  size="sm"
                  onClick={() => toggleLike(thread.id)}
                >
                  <FaHeart />
                  {likesCount}
                </Button>

                <Button variant="solid" size="sm">
                  <FaComment />
                  {repliesCount} Replies
                </Button>
              </HStack>
            </HStack>

           
          </Box>

          <Box mt={6}>
            <HStack width="100%">
              <Input
                placeholder="Type your reply!"
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                color="white"
                borderColor="gray.500"
                fontSize="sm"
              />
              <Input
                type="file"
                accept="image/*"
                hidden
                ref={inputFileRef}
                onChange={handleImageUpload}
              />
              <Button
                variant="outline"
                onClick={() => inputFileRef.current?.click()}
              >
                <Image src={GalleryAdd} w="24px" />
              </Button>
              <GreenButton mt={2} onClick={handleCommentSubmit}>
                Reply
              </GreenButton>
            </HStack>

            {newReplyImage && (
              <Box mt={2}>
                <Text color="gray.400" fontSize="sm">
                  Preview:
                </Text>
                <Image
                  src={newReplyImage}
                  alt="Comment Preview"
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                  mt={2}
                />
              </Box>
            )}

<Box mt={4}>
  {replies && replies.length > 0 ? (
    replies.map((replies) => {
      
      const user = replies?.user;
      const fullName = user?.fullName
      const userProfilePicture = user?.profilePicture 

      return (
        <Box key={replies?.id} mt={4}>
          <HStack align="start">
            <Avatar name={fullName} src={userProfilePicture} />
            <Stack>
              <Text color="white" fontWeight="bold">
                {fullName}
              </Text>
              <Text color="gray.300">{replies?.content }</Text>
              {replies?.fileUrl && (
                <Image
                  src={replies?.fileUrl}
                  alt="Reply image"
                  borderRadius="md"
                  objectFit="cover"
                  width="100%"
                  maxW="200px"
                  mt={2}
                />
              )}
            </Stack>
          </HStack>
        </Box>
      );
    })
  ) : (
    <Text color="gray.500">No replies yet.</Text>
  )}
</Box>

          </Box>
        </GridItem>
      </Grid>

      <DialogRoot
        open={open}
        onOpenChange={onClose}
        size="full"
        motionPreset="slide-in-bottom"
        placement="center"
      >
        <DialogContent bg="black">
        <DialogBody>
  <Image
    src={thread.fileUrl}
    alt={`Image posted by ${threadsUser?.fullName}`}
    width="1117px"
    height="750px"
    marginX="305px"
  />
</DialogBody>

          <DialogCloseTrigger color="white" />
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}