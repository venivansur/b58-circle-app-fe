import { useState, useRef} from 'react';
import {
  Box,
  Text,
  HStack,
  Image,
  Button,
  Spinner,
  Input,
  useDisclosure,
  FieldLabel,
  FieldRoot,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaEdit, FaTrash } from 'react-icons/fa';
import { Avatar } from '@/components/ui/avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/libs/api';
import { Thread } from '@/types/thread';
import { timeAgo } from '@/utils/timeAgo';
import { useLikeStore } from '@/store/like';
import { useAuthStore } from '@/store/auth';
import Swal from 'sweetalert2';
import {
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from '@/components/ui/dialog';
import { GalleryAdd } from '@/assets/index';
import { GreenButton } from '@/components/ui/green-button';
export function ListPost() {
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { likes, toggleLike } = useLikeStore((state) => state);
  const queryClient = useQueryClient();
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedFile, setEditedFile] = useState<File | null>(null);
  const {
    open: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    open: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const { user } = useAuthStore();
  const userId = user?.id;


  

  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
const { data: threads, isLoading, isError, error } = useQuery<Thread[]>({
  queryKey: ['threads'],
  queryFn: async () => {
    const response = await api.get('/threads');
    return response.data.threads.map((thread: any) => ({
      ...thread,
    
    }));
  },
});


  const editThreadMutation = useMutation({
    mutationFn: async ({
      id,
      content,
      file,
    }: {
      id: number;
      content: string;
      file?: File;
    }) => {
      setIsSaving(true);
      const formData = new FormData();
      formData.append('content', content);
      if (file) formData.append('file', file);

      const response = await api.put(`/thread/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      onEditClose();
      setIsSaving(false);
      Swal.fire({
        title: 'Success!',
        text: 'Thread updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#1E201E',
      });
    },
    onError: (error) => {
      setIsSaving(false);
      console.error('Error editing thread:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update the thread.',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#1E201E',
      });
    },
  });

  const deleteThreadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/thread/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      onDeleteClose();
      Swal.fire({
        title: 'Deleted!',
        text: 'Thread deleted successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#1E201E',
      });
    },
    onError: (error) => {
      console.error('Error deleting thread:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the thread.',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#1E201E',
      });
    },
  });

  const handleEdit = (thread: Thread) => {
    setCurrentThread(thread);
    setEditedContent(thread.content || '');
    setEditedFile(null);
    setPreviewImage(thread.fileUrl || null);
    onEditOpen();
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDelete = (thread: Thread) => {
    setCurrentThread(thread);
    onDeleteOpen();
  };

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
        <Text color="gray.500">No threads available.</Text>
      </Box>
    );
  }

  return (
    <Box>
      {threads.map((thread) => (
        <Box
          key={thread.id}
          mb={5}
          p={5}
          borderBottomWidth="1px"
          borderBottomColor={'gray.50'}
        >
          <HStack gap={4}>
            <Avatar
              name={thread.user?.fullName || 'Unknown'}
              src={thread.user?.profilePicture}
            />
            <HStack>
              <Link to={`/profile-page/${thread.user?.id}`}>
                <Text color="white" fontWeight="bold">
                  {thread.user?.fullName}
                </Text>
              </Link>
              <Text color="gray.500" fontSize="medium">
                @{thread.user?.username}
              </Text>
            </HStack>
            <Text color="gray.500" fontSize="sm">
              • {timeAgo(thread.createdAt)}
            </Text>
          </HStack>

          <Text color={'white'} mt={2}>
            {thread.content}
          </Text>

          {thread.fileUrl && (
            <Link to={`/post-image/${thread.id}`}>
              <Image
                src={thread.fileUrl}
                alt={`Post by ${thread.user?.fullName}`}
                borderRadius="md"
                mt={4}
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
              />
            </Link>
          )}

          <HStack mt={4} gap={8}>
            <HStack gap={1}>
            <Button
  variant="plain"
  color={thread.isLikedByUser ? 'red' : 'white'}
  size="sm"
  onClick={() => toggleLike(thread.id)}
>
  <FaHeart />
  {likes[thread.id] ?? thread._count?.likes ?? 0}  
</Button>

              <Link to={`/post/${thread.id}`}>
                <Button variant="plain" color={'white'} size="sm">
                  <FaComment />
                  {thread.replies?.length || 0}
                </Button>
              </Link>
            </HStack>

            {userId === thread.user?.id && (
              <HStack gap={2} ml="auto">
                <Button
                  size="sm"
                  bg="green.500"
                  color="white"
                  onClick={() => handleEdit(thread)}
                >
                  <FaEdit />
                </Button>
                <Button
                  size="sm"
                  color="white"
                  onClick={() => handleDelete(thread)}
                >
                  <FaTrash />
                </Button>
              </HStack>
            )}
          </HStack>
        </Box>
      ))}
      {currentThread && (
        <DialogRoot open={isEditOpen} onOpenChange={onEditClose}>
          <DialogContent color={'white'} backgroundColor={'brand.background'}>
            <DialogHeader>Edit Thread</DialogHeader>
            <DialogBody>
              <FieldRoot>
                <FieldLabel>Content</FieldLabel>
                <Input
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              </FieldRoot>

              <FieldRoot mt={4}>
                <FieldLabel>Image (Optional)</FieldLabel>

                <HStack alignItems="center" gap={4} position="relative">
                  <Box
                    position="relative"
                    cursor="pointer"
                    display="inline-block"
                    padding="10px"
                    borderRadius="md"
                    _hover={{ backgroundColor: 'gray.700' }}
                    width="100%"
                  >
                    <Image
                      src={GalleryAdd}
                      w="40px"
                      bg={'whiteAlpha.900'}
                      alt="Change image"
                      _hover={{ opacity: 0.8 }}
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      onClick={handleFileInputClick}
                    />

                    {previewImage && (
                      <Image
                        src={previewImage}
                        alt="Preview"
                        objectFit="cover"
                        width="100%"
                        height="100%"
                        borderRadius="md"
                      />
                    )}
                  </Box>
                </HStack>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setEditedFile(file);

                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setPreviewImage(null);
                    }
                  }}
                />
              </FieldRoot>
            </DialogBody>

            <DialogFooter>
              <Button onClick={onEditClose}>Cancel</Button>
              {isSaving ? (
                <Spinner size="md" color="white" />
              ) : (
                <GreenButton
                  colorScheme="blue"
                  ml={3}
                  onClick={() =>
                    editThreadMutation.mutate({
                      id: currentThread.id,
                      content: editedContent,
                      file: editedFile || undefined,
                    })
                  }
                >
                  Save
                </GreenButton>
              )}
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      )}
      ;
      {currentThread && (
        <DialogRoot open={isDeleteOpen} onOpenChange={onDeleteClose}>
          <DialogContent color={'white'} backgroundColor={'brand.background'}>
            <DialogHeader>Delete Thread</DialogHeader>
            <DialogBody>
              Are you sure you want to delete this thread? This action cannot be
              undone.
            </DialogBody>
            <DialogFooter>
              <Button onClick={onDeleteClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={() => deleteThreadMutation.mutate(currentThread.id)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      )}
    </Box>
  );
}
