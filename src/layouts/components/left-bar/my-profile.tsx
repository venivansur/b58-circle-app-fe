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
  Image,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { Avatar } from '@/components/ui/avatar';
import BGProfileCover from '@/assets/img/cover.png';
import { GalleryAdd } from '@/assets/index';
import { useAuthStore } from '@/store/auth';

export function MyProfile() {
  const { user } = useAuthStore(); // Asumsi data user tersedia
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [open, setIsOpen] = useState(false);
  const [name, setName] = useState(user.profile.fullName);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.profile.bio);
  const [profilePicture, setProfilePicture] = useState(user.profile.profilePicture);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleSave = () => {
    console.log('Profile updated:', { name, username, bio, profilePicture });
    // Tambahkan logika untuk menyimpan perubahan ke server
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newProfilePicture = URL.createObjectURL(file);
      setProfilePicture(newProfilePicture);
    }
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
                src={profilePicture}
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
                {name}
              </Text>
              <Text as="h1" color={'brand.secondary.500'}>
                @{username}
              </Text>
              <Text as="h1" color={'white'}>
                {bio}
              </Text>
            </Box>
          </Box>
        </CardBody>
      </Card.Root>

      <Dialog.Root open={open} onOpenChange={onClose} placement={'center'}>
        <DialogTrigger />
        <DialogContent
          width="100%"
          bg={'gray.800'}
          borderRadius="md"
          boxShadow="lg"
          margin="auto"
          color={'white'}
          transform="translateY(-70%)"
          position="absolute"
          left="68%"
        >
          <DialogHeader>Edit Profile</DialogHeader>
          <DialogCloseTrigger />
          <Box p={4}>
            <Field.Root id="profileImage" mb={4}>
              <FieldLabel>Profile Picture</FieldLabel>
              <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={3}>
                <Avatar
                  w={'100px'}
                  h={'100px'}
                  src={profilePicture}
                  border={'1px solid black'}
                />
                {/* Tombol untuk mengganti gambar dengan ikon Gallery Add */}
                <Button
                  variant="outline"
                  onClick={() => inputFileRef.current?.click()}
                >
                  <Image src={GalleryAdd} w="24px" />
                </Button>
                {/* Input untuk memilih file, disembunyikan */}
                <Input
                  type="file"
                  accept="image/*"
                  ref={inputFileRef}
                  hidden
                  onChange={handleFileChange}
                />
              </Box>
            </Field.Root>
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
            <Button variant="outline" colorScheme="gray" mr={3} onClick={onClose}>
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
