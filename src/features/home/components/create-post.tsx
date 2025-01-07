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
  Spinner,
} from '@chakra-ui/react';
import Swal from 'sweetalert2';
import { Avatar } from '@/components/ui/avatar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/libs/api';
import { createThreadSchema, CreateThread } from '@/utils/schemas/thread/create-thread';
import { Thread } from '@/types/thread';
import { useAuthStore } from '@/store/auth';

export function CreatePost() {
  const { user } = useAuthStore();  
  const queryClient = useQueryClient();
  const { open, onOpen, onClose } = useDisclosure();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

 
  const userId = user?.id;

  const { register, handleSubmit, setValue } = useForm<CreateThread>({
    mode: 'onSubmit',
    resolver: zodResolver(createThreadSchema),
  });

  const createThread = async (formData: FormData) => {
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const token = user.token;

    const response = await api.post('/threads', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createThread(formData),
    onMutate: () => setIsLoading(true),
    onSuccess: (newThread) => {
      const threadData = newThread.thread;

      queryClient.invalidateQueries({ queryKey: ['threads'] });
      queryClient.setQueryData<Thread[]>(['threads'], (oldData) => {
        const updatedThreads = [threadData, ...(oldData || [])];
        return updatedThreads;
      });

      Swal.fire({
        title: 'Post Created!',
        text: 'Post Thread Success!',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#1E201E',
        confirmButtonColor: '#347928',
      });

      setIsLoading(false); 
      onClose();
    },
    onError: (err) => {
      console.error('Error creating thread:', err);
      setIsLoading(false);
    },
  });

  const onSubmit = async (data: CreateThread) => {
    const formData = new FormData();
    formData.append('content', data.content);

    if (data.file) {
      formData.append('file', data.file);
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
        {user && <Avatar src={user.profilePicture} border={'2px solid white'} />}
        <Text color={'brand.secondary.500'}>What is happening?!</Text>
        <Spacer />
        <Image src={GalleryAdd} w="24px" />
        <GreenButton disabled>Post</GreenButton>
      </Box>

      <DialogRoot open={open} onOpenChange={onClose} size="lg" placement={'center'}>
        <DialogContent backgroundColor={'brand.background'}>
          <DialogHeader fontSize={'2xl'} color={'white'}>Create a New Post</DialogHeader>
          <DialogCloseTrigger color={'white'} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogBody>
              <Box display={'flex'} paddingY={'20px'} gap="5px" alignItems={'center'}>
                {user && <Avatar src={user.profilePicture} border={'2px solid white'} />}
                <Input
                  placeholder="What is happening?!"
                  color={'white'}
                  variant="flushed"
                  {...register('content')}
                />
              </Box>

              {previewImage && (
                <Box mt={4}>
                  <Image src={previewImage} alt="Image preview" maxWidth="100px" borderRadius="md" />
                </Box>
              )}
            </DialogBody>

            <DialogFooter backgroundColor={'brand.background'} display={'flex'} alignItems="center">
              <Input
                type="file"
                hidden
                {...register('file')}
                onChange={handleFileChange}
              />
              <Button variant="outline" onClick={() => {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  fileInput?.click(); 
}}>
  <Image src={GalleryAdd} w="24px" />
</Button>

              {isLoading ? <Spinner size="md" color="white" /> : <GreenButton type="submit">Post</GreenButton>}
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
