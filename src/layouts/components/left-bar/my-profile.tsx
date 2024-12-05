import {
  Box,
  Button,
  Card,
  CardBody,
  Text,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogCloseTrigger,
  Field,
  FieldLabel,
  Input,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth';
import BGProfileCover from '@/assets/img/cover.png';

export function MyProfile() {
  const { user } = useAuthStore();

  const [open, setIsOpen] = useState(false);
  const [name, setName] = useState(user.profile.fullName);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.profile.bio);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleSave = () => {
    console.log('Profile updated:', { name, username, bio });
    onClose();
  };

  return (
    <Box margin={'20px'}>
      <Card.Root backgroundColor={'brand.secondary.800'}>
        <CardBody>
          <Text as="h1" color={'white'} fontWeight={'bold'} mb="10px">
            My Profile
          </Text>
          <Box>
            <Box
              bgImage={`url(${BGProfileCover})`}
              w={'100%'}
              height="100px"
              borderRadius="lg"
              position={'relative'}
              backgroundSize="cover"
              backgroundRepeat="no-repeat"
            >
              <Avatar
                w={'100px'}
                h={'100px'}
                bottom={'-10'}
                left={'3'}
                position={'absolute'}
                src={user.profile.profilePicture}
                border={'1px solid black'}
              />
            </Box>
            <Box mt={'20px'} display={'flex'} justifyContent={'flex-end'}>
              <Button
                variant={'outline'}
                color={'white'}
                fontSize={'sm'}
                onClick={onOpen}
              >
                Edit Profile
              </Button>
            </Box>
            <Box>
              <Text as="h1" color={'white'} fontWeight={'bold'} fontSize={'xl'}>
                {user.profile.fullName}
              </Text>
              <Text as="h1" color={'brand.secondary.500'}>
                @{user.username}
              </Text>
              <Text as="h1" color={'white'}>
                {user.profile.bio}
              </Text>
              <Box display={'flex'} gap="20px" mt="10px">
                <Text as="h1" color={'white'}>
                  <Text as="span" fontWeight={'bold'}>
                    {user.following}
                  </Text>
                  Following
                </Text>
                <Text as="h1" color={'white'}>
                  <Text as="span" fontWeight={'bold'}>
                    {user.followers}
                  </Text>
                  Followers
                </Text>
              </Box>
            </Box>
          </Box>
        </CardBody>
      </Card.Root>

      <Dialog.Root open={open} onOpenChange={onClose} placement={'center'}>
        <DialogTrigger />
        <DialogContent maxWidth="500px">
          <DialogHeader>Edit Profile</DialogHeader>
          <DialogCloseTrigger />
          <Box p={4}>
            <Field.Root id="name" mb={4}>
              <FieldLabel>Name</FieldLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </Field.Root>

            <Field.Root id="username" mb={4}>
              <FieldLabel>Username</FieldLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </Field.Root>

            <Field.Root id="bio" mb={4}>
              <FieldLabel>Bio</FieldLabel>
              <Input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
              />
            </Field.Root>
          </Box>

          <DialogFooter>
            <Button
              variant="outline"
              colorScheme="gray"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog.Root>
    </Box>
  );
}
