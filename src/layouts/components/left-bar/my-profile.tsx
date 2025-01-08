import { Box, Button, Card, CardBody, Text, Field, FieldLabel, Input, Spacer, HStack, Spinner } from '@chakra-ui/react';
import { DialogRoot, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { useState, useEffect, useRef } from 'react';
import { Avatar } from '@/components/ui/avatar';
import BGProfileCover from '@/assets/img/cover.png';
import { GalleryAdd } from '@/assets/index';
import Swal from 'sweetalert2';
import { GreenButton } from '@/components/ui/green-button';
import { useAuthStore } from '@/store/auth';  
import { useFollowStore } from '@/store/follow';
import { api } from '@/libs/api';

export function MyProfile({ selectedUserId }: { selectedUserId?: string }) {
  const { user, setUser } = useAuthStore();  
  const { followers, following, setFollowers, setFollowing} = useFollowStore();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [open, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
    bio: '',
    profilePicture: '',
  });
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (user) {
      api.get(`/users/${user.id}`).then((response) => {
        const updatedUser = response.data;
        setProfileData({
          fullName: updatedUser.fullName,
          username: updatedUser.username,
          bio: updatedUser.profile?.bio || '',
          profilePicture: updatedUser.profilePicture || '',
        });
      }).catch((error) => {
        console.error('Error fetching user data:', error);
      });
    }
  }, [user]); 
  

  useEffect(() => {
    if (selectedUserId) {
     
      api.get(`/users/${selectedUserId}`).then((response) => {
        const selectedUser = response.data;
        setProfileData({
          fullName: selectedUser.fullName || '',
          username: selectedUser.username || '',
          bio: selectedUser.profile?.bio || '',
          profilePicture: selectedUser.profilePicture || '',
        });
  
        
        setFollowers(selectedUser.followers || []);
        setFollowing(selectedUser.following || []);
      }).catch((error) => {
        console.error('Error fetching user data:', error);
      });
    }
  }, [selectedUserId]);
  
  

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleSave = async () => {
    try {
   
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save your profile changes?',
        icon: 'warning',
        background:'#1E201E',
        showCancelButton: true,
        confirmButtonText: 'Yes, save it!',
        cancelButtonText: 'No, cancel',
        confirmButtonColor: '#347928',
        cancelButtonColor: '#e74c3c',
      });
  
      
      if (result.isConfirmed) {
       
        const token = localStorage.getItem('token');
    
        if (!token) {
          throw new Error('User is not authenticated');
        }
    
        const response = await api.put(
          `/users/${user?.id}`,  
          {
            fullName: profileData.fullName,
            username: profileData.username,
            bio: profileData.bio, 
            profilePicture: profileData.profilePicture,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
    
        if (response.data && response.data.updatedUser) {
          if (user?.id) { 
            setUser({
              ...user,
              fullName: profileData.fullName,
              username: profileData.username,
              
              profilePicture: profileData.profilePicture,
              profile: {
                ...user.profile, 
                bio: profileData.bio,
            }});
          }
    
          Swal.fire({
            title: 'Success',
            text: 'Your profile has been updated.',
            icon: 'success',
            background:'#1E201E',
            confirmButtonText: 'Okay',
            confirmButtonColor: '#347928',
          });
    
          onClose(); 
        }
      } else {
       
        Swal.fire({
          title: 'Cancelled',
          text: 'Your profile update was cancelled.',
          icon: 'error',
          background:'#1E201E',
          confirmButtonText: 'Okay',
          confirmButtonColor: '#e74c3c',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update profile. Please try again.',
        icon: 'error',
        background:'#1E201E',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#e74c3c',
      });
    }
  };
  
  

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);  
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
          setProfileData((prev) => ({
            ...prev,
            profilePicture: data.secure_url,
          }));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setLoading(false);  
      }
    }
  };
  
  return (
    <Box marginX={'20px'} marginY={'20px'} >
      <Card.Root backgroundColor={'brand.secondary.800'} borderStyle={"none"}>
        <CardBody>
          <Text as="h1" color={'white'} fontWeight={'bold'} mb="10px">
            {selectedUserId ? 'User Profile' : 'My Profile'}
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
            {!selectedUserId && (
              <Box mt={'20px'} display={'flex'} justifyContent={'flex-end'}>
                <Button
                  variant={'subtle'}
                  color={'black'}
                  fontSize={'sm'}
                  onClick={onOpen}
                >
                  Edit Profile
                </Button>
              </Box>
            )}
            <Box>
              <Text mt={'45px'} as="h1" color={'white'} fontWeight={'bold'} fontSize={'xl'}>
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
                  {followers.length} Followers
                </Text>
                <Text as="h1" color={'white'}>
                {following.length} Following
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
      src={profileData.profilePicture || (loading ? '' : undefined)} 
      border={'1px solid black'}
    />
    {loading && (  
      <Spinner
        position="absolute"
        top="60%"
        left="50%"
        transform="translate(-50%, -50%)"
        color="green.400"
      />
    )}
  </Box>
  <Button
    variant="solid"
    position={"relative"}
    left={'5'}
    bottom={'-10'}
    border={'none'}
    onClick={() => inputFileRef.current?.click()}
  >
    <Avatar src={GalleryAdd} w={'30px'} h={'30px'} bg={'#1E201E'} />
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
