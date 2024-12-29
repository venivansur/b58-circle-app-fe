import { GalleryAdd } from '@/assets/index';
import { GreenButton } from '@/components/ui/green-button';
import {
  Box,
  Button,
  Image,
  Input,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import Swal from 'sweetalert2';
import { Avatar } from '@/components/ui/avatar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/libs/api';
import {
  createThreadSchema,
  CreateThread,
} from '@/utils/schemas/thread/create-thread';
import { Thread } from '@/types/thread';

export function CreatePost() {
  const queryClient = useQueryClient();
  const { open, onOpen, onClose } = useDisclosure();


  const [previewImage, setPreviewImage] = useState<string | null>(null);

 
  const [user, setUser] = useState<any>(null);

 
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await api.get(`/users/${userId}`);
          setUser(response.data); 
        } catch (err) {
          console.error('Failed to fetch user data:', err);
        }
      };
      fetchUserData();
    }
  }, []);

  const createThread = async (formData: FormData) => {
    const userString = localStorage.getItem('userId');
    if (!userString) {
      throw new Error('User is not authenticated');
    }

    const user = JSON.parse(userString);
    const token = user.token;

    const response = await api.post('/threads', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

  const { register, handleSubmit, setValue } = useForm<CreateThread>({
    mode: 'onSubmit',
    resolver: zodResolver(createThreadSchema),
  });

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createThread(formData),
    onSuccess: (newThread) => {
      console.log('New thread created:', newThread);

      const threadData = newThread.thread;

      // Invalidasi cache dan optimistik update
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      queryClient.setQueryData<Thread[]>(['threads'], (oldData) => {
        const updatedThreads = [threadData, ...(oldData || [])];
        return updatedThreads;
      });

    
      queryClient.refetchQueries({ queryKey: ['threads'] });

      
      Swal.fire({
        title: 'Post Created!',
        text: 'Post Thread Success!',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#1E201E',
        confirmButtonColor: '#347928',
      });

      onClose();
    },
  });
  const onSubmit = async (data: CreateThread) => {
    console.log('Form data:', data);
    const formData = new FormData();
    formData.append('content', data.content);

    if (data.file) {
      console.log('Appending file to FormData:', data.file);
      formData.append('file', data.file);
    } else {
      console.log('No file selected');
    }

    mutation.mutate(formData);
  };

  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      setValue('file', file); 
    }
  };

  return (
    <Box borderBottomWidth="1px" borderBottomColor={'gray.50'}>
      <Box
        padding={5}
        display={'flex'}
        alignItems={'center'}
        gap={'20px'}
        w={'100%'}
        onClick={onOpen}
      >
        {user && (
          <Avatar
            src={user.profilePicture} 
            border={'2px solid white'}
          />
        )}
        <Text color={'brand.secondary.500'}>What is happening?!</Text>
        <Spacer />
        <Image src={GalleryAdd} w="24px" />
        <GreenButton disabled>Post</GreenButton>
      </Box>

      <DialogRoot
        open={open}
        onOpenChange={onClose}
        size="lg"
        placement={'center'}
      >
        <DialogContent backgroundColor={'brand.background'}>
          <DialogHeader fontSize={'2xl'} color={'white'}>
            Create a New Post
          </DialogHeader>
          <DialogCloseTrigger color={'white'} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogBody>
              <Box
                display={'flex'}
                paddingY={'20px'}
                gap="5px"
                alignItems={'center'}
              >
                {user && (
                  <Avatar
                    src={user?.profilePicture } 
                    border={'2px solid white'}
                  />
                )}
                <Input
                  placeholder="What is happening?!"
                  color={'white'}
                  variant="flushed"
                  {...register('content')}
                />
              </Box>

         
              {previewImage && (
                <Box mt={4}>
                  <Image
                    src={previewImage}
                    alt="Image preview"
                    maxWidth="100px"
                    borderRadius="md"
                  />
                </Box>
              )}
            </DialogBody>

            <DialogFooter
              backgroundColor={'brand.background'}
              display={'flex'}
              alignItems="center"
            >
              <Input
                type="file"
                hidden
                {...register('file')} 
                onChange={handleFileChange} 
              />

              <Button
                variant="outline"
                onClick={() => {
                  const fileInput = document.querySelector(
                    'input[type="file"]'
                  ) as HTMLInputElement;
                  fileInput?.click(); 
                }}
              >
                <Image src={GalleryAdd} w="24px" />
              </Button>
              <Spacer />
              <GreenButton type="submit">Post</GreenButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
