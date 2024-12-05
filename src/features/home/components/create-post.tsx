import { GalleryAdd } from '@/assets/index';
import { GreenButton } from '@/components/ui/green-button';
import {
  createThreadSchema,
  CreateThread,
} from '@/utils/schemas/thread/create-thread';
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
  DialogTrigger,
} from '@chakra-ui/react';
import { useAuthStore } from '@/store/auth';
import { Avatar } from '@/components/ui/avatar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export function CreatePost() {
  const { open, onOpen, onClose } = useDisclosure();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const { register, handleSubmit } = useForm<CreateThread>({
    mode: 'onSubmit',
    resolver: zodResolver(createThreadSchema),
  });

  const { ref: fileRef, ...registerFile } = register('file');

  const [threads, setThreads] = useState<CreateThread[]>([]);

  const onSubmit = (data: CreateThread) => {
    const newThread = {
      ...data,
      file: data.file.length > 0 ? URL.createObjectURL(data.file[0]) : null,
    };

    setThreads((prevThreads) => [...prevThreads, newThread]);
    alert('Post Thread Success!');
    onClose();
  };

  return (
    <Box>
      <Box
        display={'flex'}
        alignItems={'center'}
        gap={'20px'}
        w={'100%'}
        marginY={'10'}
        onClick={onOpen}
      >
        <Avatar src={user.profile.profilePicture} border={'2px solid white'} />

        <Text color={'brand.secondary.500'}>What is happening?!</Text>
        <Spacer />
        <Image src={GalleryAdd} w="24px" />
        <GreenButton disabled>Post</GreenButton>
      </Box>

      <DialogRoot open={open} onOpenChange={onClose} size="lg">
        <DialogTrigger />
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
                <Avatar
                  src={user.profile.profilePicture}
                  border={'2px solid white'}
                />
                <Input
                  placeholder="What is happening?!"
                  color={'white'}
                  variant="flushed"
                  {...register('content')}
                />
              </Box>
            </DialogBody>

            <DialogFooter
              backgroundColor={'brand.background'}
              display={'flex'}
              alignItems="center"
            >
              <Input
                type="file"
                hidden
                ref={(e) => {
                  (inputFileRef as any).current = e;
                  fileRef(e);
                }}
                {...registerFile}
              />
              <Button
                variant="outline"
                onClick={() => inputFileRef.current?.click()}
              >
                <Image src={GalleryAdd} w="24px" />
              </Button>
              <Spacer />
              <GreenButton type="submit">{'Post'}</GreenButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>

      <Box mt={5}>
        {threads.map((thread, index) => (
          <Box
            key={index}
            p={4}
            bg="gray.700"
            borderRadius="md"
            mb={3}
            boxShadow="md"
          >
            <Text color="white" mb={2}>
              {thread.content}
            </Text>
            {thread.file && (
              <Image
                src={thread.file}
                alt="Uploaded File"
                borderRadius="md"
                objectFit="cover"
                maxH="300px"
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
