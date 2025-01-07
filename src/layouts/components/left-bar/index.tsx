import {
  Logo,
  Logout,
  GalleryAdd,
} from '@/assets/index';
import {
  createThreadSchema,
  CreateThread,
} from '@/utils/schemas/thread/create-thread';
import { Avatar } from '@/components/ui/avatar';
import { GreenButton } from '@/components/ui/green-button';
import {
  Box,
  Button,
  Image,
  Text,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  Input,
  useDisclosure,
  Spacer
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { leftBarMenu } from '../../constants/left-bar.constant';
import { useAuthStore } from '@/store/auth';
import { Link as ChakraLink } from '@chakra-ui/react';
import { useState, useRef } from 'react';
import Swal from 'sweetalert2';

export function LeftBar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<CreateThread>({
    mode: 'onSubmit',
    resolver: zodResolver(createThreadSchema),
  });
  const { clearUser } = useAuthStore();
  const [threads, setThreads] = useState<CreateThread[]>([]);
  const { ref: fileRef, ...registerFile } = register('file');
  const { open, onOpen, onClose } = useDisclosure();
  const [postContent, setPostContent] = useState('');
  const inputFileRef = useRef<HTMLInputElement>(null);
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      background:'#1E201E',
      confirmButtonColor: '#347928',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        clearUser();
        localStorage.removeItem("token");
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("follow-storage");
        navigate('/login');
      }
    });
  };

  const onSubmit = (data: CreateThread) => {
    const newThread = {
      ...data,
      file: data.file.length > 0 ? URL.createObjectURL(data.file[0]) : null,
    };
    setThreads((prevThreads) => [...prevThreads, newThread]);
    Swal.fire({
      title: 'Post Created!',
      text: `Your post content: "${postContent}"`,
      icon: 'success',  
      confirmButtonText: 'OK',
      background:'#1E201E',
      confirmButtonColor: '#347928',
    });
    setPostContent('');
    onClose();
  };

  return (
    <Box
      padding={'1px'}
      w={'417px'}
      h="100vh"
      margin="1px"
      border={'1px'}
      borderColor="brand.outline"
      borderStyle="solid"
    >
      <Box display={'flex'} flexDirection={'column'} marginX={'40px'} gap={'5'}>
        <Image src={Logo} w={'135px'} marginY={'10'} />
        {leftBarMenu.map((menu, index) => (
          <Button
            key={index}
            onClick={() => {
              navigate(menu.path);
            }}
            fontSize={'medium'}
            justifyContent={'flex-start'}
            display={'flex'}
            alignItems={'center'}
            variant={'ghost'}
            gap={'10'}
            _hover={{
              backgroundColor: 'rgba(255,255,255, 0.1)',
            }}
          >
            {location.pathname === menu.path ? (
              <>
                <Image src={menu.icon.solid} w={'24px'} />{' '}
                <Text color="white">{menu.name}</Text>
              </>
            ) : (
              <>
                <Image src={menu.icon.outline} w={'24px'} />{' '}
                <Text color="white" fontWeight={'bold'}>
                  {menu.name}
                </Text>
              </>
            )}
          </Button>
        ))}
        <GreenButton mb={'auto'} onClick={onOpen}>
          Create Post
        </GreenButton>

        <Dialog.Root open={open} onOpenChange={onClose} placement={"center"}>
          <DialogTrigger />
          <DialogContent backgroundColor={'brand.background'}>
            <DialogHeader fontSize={'2xl'} color={'white'}>Create a New Post</DialogHeader>
            <DialogCloseTrigger />
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogBody>
                <Box
                  display={'flex'}
                  paddingY={'20px'}
                  gap="5px"
                  alignItems={'center'}
                >
                  {user && user.profile && <Avatar
                    src={user.profile.profilePicture}
                    border={'2px solid white'}
                  />}
                  <Input
                    placeholder="What is happening?!"
                    color={'white'}
                    variant="flushed"
                    {...register('content')}
                  />
                </Box>
              </DialogBody>
              <DialogFooter>
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
        </Dialog.Root>
        <Box mt={5}>
          <Box>
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
        <Button
          onClick={handleLogout}
          marginTop={'200px'}
          justifyContent={'flex-start'}
          display={'flex'}
          alignItems={'center'}
          variant={'ghost'}
          gap={'16px'}
          _hover={{
            backgroundColor: 'rgba(255,255,255, 0.1)',
          }}
        >
          <Image src={Logout} w={'24px'} />
          <ChakraLink color={'white'}>Logout</ChakraLink>
        </Button>
      </Box>
    </Box>
  );
}
