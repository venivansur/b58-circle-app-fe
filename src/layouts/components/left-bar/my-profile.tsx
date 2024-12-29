import { Box, Button, Card, CardBody, Text, Field, FieldLabel, Input, Spacer, HStack } from '@chakra-ui/react';
import { DialogRoot, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { useState, useRef, useEffect } from 'react';
import { Avatar } from '@/components/ui/avatar';
import BGProfileCover from '@/assets/img/cover.png';
import { GalleryAdd } from '@/assets/index';
import Swal from 'sweetalert2';
import { GreenButton } from '@/components/ui/green-button';
import { useGetUserById, useUpdateUserById } from '@/services/users';
import { UpdateUserPayload } from '@/types/user';

export function MyProfile() {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      try {
        const userId = JSON.parse(storedUserId);
        setUserId(userId);  
      } catch (error) {
        console.error("Gagal memparsing data pengguna dari localStorage:", error);
      }
    } else {
      console.error("Data pengguna tidak ditemukan dalam localStorage");
    }
  }, []); 

  const { data, isLoading, error } = useGetUserById(userId);
  const { mutate } = useUpdateUserById();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [open, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState<UpdateUserPayload>({
    id: '', 
    fullName: '',
    username: '',
    bio: '',
    profilePicture: '',
    following: [],
    followers: [] 
  });

  useEffect(() => {
    if (data && userId) {
      setProfileData({
        id: userId,
        fullName: data.fullName || '',
        username: data.username || '',
        bio: data.profile?.bio || '',
        profilePicture: data.profilePicture || '',
        following: Array.isArray(data.following) ? data.following : [],
        followers: Array.isArray(data.followers) ? data.followers : [],
      });
    }

    if (error) {
      console.error("Error saat mengambil data profil:", error);
    }
  }, [data, error, userId]);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleSave = () => {
    if (!profileData.id) {
      Swal.fire({
        title: 'Error',
        text: 'User ID is missing!',
        icon: 'error',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#D32F2F',
        background: '#1E201E',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save these changes to your profile?',
      icon: 'warning',
      showCancelButton: true,
      background: '#1E201E',
      confirmButtonText: 'Yes, save it!',
      confirmButtonColor: '#347928',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData: UpdateUserPayload = {
          id: profileData.id,
          fullName: profileData.fullName,
          username: profileData.username,
          bio: profileData.bio,
          profilePicture: profileData.profilePicture,
          following: profileData.following,
          followers: profileData.followers,
        };

        localStorage.setItem("userProfile", JSON.stringify(updatedData));

        mutate(updatedData, {
          onSuccess: (response) => {
            console.log("Response from API:", response);
            Swal.fire({
              title: 'Success',
              text: 'Your profile has been updated in the database.',
              icon: 'success',
              confirmButtonText: 'Okay',
              confirmButtonColor: '#347928',
              background: '#1E201E',
            });
          },
          onError: (error) => {
            console.error("Error during API call:", error);
            Swal.fire({
              title: 'Error',
              text: 'Failed to update the profile in the database.',
              icon: 'error',
              confirmButtonText: 'Okay',
              confirmButtonColor: '#D32F2F',
              background: '#1E201E',
            });
          },
        });
      }
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'venivansurya');
      formData.append('folder', 'profile_pictures');
      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dbuz666bp/image/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          setProfileData({
            ...profileData,
            profilePicture: data.secure_url,
          });
          console.log('Image uploaded to Cloudinary:', data.secure_url);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

 
  const followingCount = Array.isArray(profileData.following) ? profileData.following.length : 0;
  const followersCount = Array.isArray(profileData.followers) ? profileData.followers.length : 0;

  return (
    <Box margin={'20px'}>
      <Card.Root backgroundColor={'brand.secondary.800'} borderStyle={"none"}>
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
                src={profileData.profilePicture}
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
                {profileData.fullName}
              </Text>
              <Text as="h1" color={'brand.secondary.500'}>
                @{profileData.username || 'username'}
              </Text>
              <Text as="h1" color={'white'}>
                {profileData.bio || 'No bio available'}
              </Text>
              <HStack gap={5}>
                <Text as="h1" color={'white'}>
                  {followingCount} Following
                </Text>
                <Text as="h1" color={'white'}>
                  {followersCount} Followers
                </Text>
              </HStack>
            </Box>
          </Box>
        </CardBody>
      </Card.Root>

      <DialogRoot open={open} onOpenChange={onClose} placement={'top'}>
        <DialogTrigger />
        <DialogContent backgroundColor={'brand.background'} height={"520px"} margin="auto" color={'white'}>
          <DialogHeader>Edit Profile</DialogHeader>
          <Box
            bgImage={`url(${BGProfileCover})`}
            w={'100%'}
            height="100px"
            borderRadius="lg"
            position={'relative'}
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
            p={4}
          >
            <Field.Root id="profileImage" mb={4}>
              <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={3}>
                <Box>
                  <Avatar
                    w={'100px'}
                    h={'100px'}
                    bottom={'-14'}
                    position={'absolute'}
                    src={profileData.profilePicture}
                    border={'1px solid black'}
                  />
                </Box>
                <Button
                  variant="outline"
                  position={"relative"}
                  left={'5'}
                  bottom={'-10'}
                  border={'none'}
                  onClick={() => inputFileRef.current?.click()}
                >
                  <Avatar src={GalleryAdd} w={'30px'} h={'30px'} />
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  ref={inputFileRef}
                  hidden
                  onChange={handleFileChange}
                />
              </Box>
            </Field.Root>
            <Spacer />
            <Field.Root id="fullName" mb={4} mt={20}>
              <FieldLabel>Full Name</FieldLabel>
              <Input
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                placeholder="Enter your full name"
              />
            </Field.Root>

            <Field.Root id="username" mb={4}>
              <FieldLabel>Username</FieldLabel>
              <Input
                value={profileData.username}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                placeholder="Enter your username"
              />
            </Field.Root>

            <Field.Root id="bio" mb={4}>
              <FieldLabel>Bio</FieldLabel>
              <Input
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Enter your bio"
              />
            </Field.Root>

            <DialogFooter>
              <GreenButton onClick={handleSave}>Save</GreenButton>
            </DialogFooter>
          </Box>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
