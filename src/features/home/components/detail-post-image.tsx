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
  Spinner,
} from '@chakra-ui/react';
import {
  DialogRoot,
  DialogCloseTrigger,
  DialogContent,
  DialogBody,
} from '@/components/ui/dialog';
import { FaHeart, FaComment, FaTrash } from 'react-icons/fa';
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
import { useAuthStore } from '@/store/auth';
import Swal from 'sweetalert2';
export default function PostWithImageDetail() {
  const { id } = useParams(); 
  const inputFileRef = useRef<HTMLInputElement>(null); 

  const { user: loggedInUser } = useAuthStore(); 
  const [thread, setThread] = useState<Thread | null>(null);

  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState(''); 
  const [newReplyImage, setNewReplyImage] = useState<string | null>(null); 
  const [loading, setLoading] = useState(true); 
  const [isReplying, setIsReplying] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const { open, onOpen, onClose } = useDisclosure();
  const { likes,  toggleLike } = useLikeStore();

   
    const fetchData = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const threadResponse = await api.get(`/threads/${id}`);
        setThread(threadResponse.data.thread);
  
        const repliesResponse = await api.get(`/threads/${id}/replies`);
        setReplies(repliesResponse.data.replies || []);
      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, [id]);
  
    useEffect(() => {
      fetchData();
    }, [fetchData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setNewReplyImage(objectUrl);
    }
  };

 


  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() && !newReplyImage) return;

    setIsReplying(true);
    try {
      const formData = new FormData();
      formData.append('content', newReply);

      const file = inputFileRef.current?.files?.[0];
      if (file) formData.append('file', file);

      await api.post(`/threads/${id}/replies`, formData);
      setNewReply('');
      setNewReplyImage(null);
      fetchData(); 
    } catch (err) {
      setError('Failed to add reply.');
      console.error(err);
    } finally {
      setIsReplying(false);
    }
  };

  
  if (loading || error) {
    return (
      <Center mt={20}>
        <Text color={loading ? 'gray.500' : 'red.500'} fontSize="xl">
          {loading ? 'Loading...' : error}
        </Text>
      </Center>
    );
  }

 
  if (!thread) {
    return (
      <Center mt={20}>
        <Text color="red.500" fontSize="xl">
          Post not found!
        </Text>
      </Center>
    );
  }

  const handleDeleteReply = async (replyId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/threads/${id}/replies/${replyId}`);
          setReplies((prevReplies) =>
            prevReplies.filter((reply) => reply.id !== replyId)
          );
          Swal.fire('Deleted!', 'Your reply has been deleted.', 'success');
        } catch (err) {
          console.error('Failed to delete reply:', err);
          setError('Failed to delete reply.');
          Swal.fire('Error!', 'Failed to delete the reply.', 'error');
        }
      }
    });
  };


  const repliesCount = replies.length;

  return (
    <Box p={5}>
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={4}>
        <GridItem>
          {thread.fileUrl && (
            <Image
              src={thread.fileUrl}
              alt={`Image posted by ${thread.user.username}`}
              borderRadius="md"
              width="100%"
              height={"730px"}
              objectFit="cover"
              cursor="pointer"
              onClick={onOpen}
            />
          )}
        </GridItem>

        <GridItem>
          <Box key={thread.id} padding={5} pb={6}>
            <HStack gap={4}>
              {thread.user?.fullName && (
                <Avatar name={thread.user.fullName} src={thread.user.profilePicture || ''} />
              )}
              <Stack>
                <Text color="white" fontWeight="bold">
                  {thread.user.fullName || 'Unknown User'}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  {timeAgo(thread.createdAt)}
                </Text>
              </Stack>
            </HStack>

            <Text color="white" mt={2}>
              {thread.content}
            </Text>

            <HStack mt={4} gap={8}>
              <HStack gap={1}>
              <Button
              variant="solid"
              color={likes[thread.id] > 0 ? 'red' : 'white'}
              size="sm"
              onClick={() => {
                if (loggedInUser) {
                  toggleLike(thread.id);
                } else {
                  alert('You need to log in to like posts.');
                }
              }}
            >
              <FaHeart />
              {likes[thread.id] || 0}
            </Button>

                <Button variant="solid" size="sm">
                  <FaComment />
                  {repliesCount} Replies
                </Button>
              </HStack>
            </HStack>
          </Box>

          <Box p={5}>
      
    

      <Box >
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
          <GreenButton
            mt={2}
            onClick={handleCommentSubmit}
            disabled={isReplying}
          >
            {isReplying ? <Spinner size="sm" color="white" /> : 'Reply'}
          </GreenButton>
        </HStack>

        {newReplyImage && (
          <Box mt={2}>
            <Text color="gray.400" fontSize="sm">
              Preview:
            </Text>
            <Image
              src={newReplyImage}
              alt="Preview image"
              boxSize="100px"
              objectFit="cover"
              borderRadius="md"
              mt={2}
            />
          </Box>
        )}
      </Box>

      <Box mt={6}>
        {replies.length > 0 ? (
          replies.map((reply) => (
            <Box display={'flex'} key={reply.id} mt={4} gap={'4'}>
              <Avatar
                name={reply.user?.fullName || 'Unknown'}
                src={reply.user?.profilePicture || ''}
              />
              <HStack>
                <HStack gap={0}>
                  <Stack>
                    <Text color="white" fontWeight="bold">
                      {reply.user?.fullName || 'Unknown User'}
                      {(reply.user.id === loggedInUser?.id ||
                        thread.user.id === loggedInUser?.id) && (
                        <Button
                          size="xs"
                          marginLeft={'450px'}
                          colorScheme="red"
                          onClick={() => handleDeleteReply(reply.id)}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </Text>

                    <Text color="gray.300">{reply.content}</Text>
                    {reply.fileUrl && (
                      <Image
                        src={reply.fileUrl}
                        alt={`Image from ${reply.user?.fullName}`}
                        borderRadius="md"
                        objectFit="cover"
                        width="100%"
                        maxW="200px"
                        mt={2}
                      />
                    )}
                  </Stack>
                </HStack>
              </HStack>
            </Box>
          ))
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
              alt={`Image posted by ${thread.user?.fullName}`}
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
