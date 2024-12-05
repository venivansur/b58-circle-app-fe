import { Logo, Logout } from '@/assets/index';
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
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { leftBarMenu } from '../../constants/left-bar.constant';
import { useAuthStore } from '@/store/auth';
import { Link as ChakraLink } from '@chakra-ui/react';
import { useState } from 'react';

export function LeftBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearUser } = useAuthStore();
  const { open, onOpen, onClose } = useDisclosure();
  const [postContent, setPostContent] = useState('');

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem('auth-storage');
    navigate('/login');
  };

  const handleCreatePost = () => {
    alert(`Post Created: ${postContent}`);
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

        <Dialog.Root open={open} onOpenChange={onClose}>
          <DialogTrigger />
          <DialogContent>
            <DialogHeader>Create a New Post</DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              <Input
                placeholder="What is happening?!"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                ml={3}
                onClick={handleCreatePost}
                disabled={!postContent.trim()}
              >
                Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog.Root>

        <Button
          onClick={handleLogout}
          marginTop={'270px'}
          justifyContent={'flex-start'}
          display={'flex'}
          alignItems={'center'}
          variant={'ghost'}
          gap={'16px'}
          _hover={{
            backgroundColor: 'rgba(255,255,255, 0.1)',
          }}
        >
          <Image src={Logout} w={'24px'} />{' '}
          <ChakraLink color={'white'}>Logout</ChakraLink>
        </Button>
      </Box>
    </Box>
  );
}
