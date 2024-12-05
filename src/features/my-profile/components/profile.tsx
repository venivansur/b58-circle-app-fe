import * as Tabs from '@radix-ui/react-tabs'; // Pastikan import Tabs dari Radix UI
import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import {
  Box,
  Text,
  Stack,
  Button,
  HStack,
  Separator,
  Image,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { FaHeart, FaReply } from 'react-icons/fa';
import { Avatar } from '@/components/ui/avatar';

export function Profile() {
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState('All Post');

  return (
    <Box>
      <Tabs.Root value={tabValue} onValueChange={setTabValue}>
        <Box position="relative">
          <Tabs.List
            style={{
              margin: '30px',
              display: 'flex',
              justifyContent: 'space-around',
              position: 'relative',
            }}
          >
            <Tabs.Trigger
              value="All Post"
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                color: tabValue === 'All Post' ? 'white' : 'gray',
                fontWeight: tabValue === 'All Post' ? 'bold' : 'normal',
              }}
            >
              All Post
            </Tabs.Trigger>
            <Tabs.Trigger
              value="Media"
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                color: tabValue === 'Media' ? 'white' : 'gray',
                fontWeight: tabValue === 'Media' ? 'bold' : 'normal',
              }}
            >
              Media
            </Tabs.Trigger>
          </Tabs.List>

          <Box
            position="absolute"
            bottom="-4px"
            left={tabValue === 'All Post' ? '5%' : '50%'}
            width="300px"
            height="4px"
            bg="green.500"
            borderRadius="md"
            transition="all 0.3s ease"
          />
        </Box>

        <Tabs.Content value="All Post">
          <Box mt={5}>
            <HStack gap={4}>
              <Avatar
                name={user.profile.fullName}
                src={user.profile.profilePicture}
              />
              <Stack>
                <Text color={'white'} fontWeight="bold">
                  {user.profile.fullName}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  {user.post.timeAgo}
                </Text>
              </Stack>
            </HStack>

            <Text color={'white'} mt={2}>
              {user.post.postText}
            </Text>

            {user.post.postPicture && (
              <Image
                src={user.post.postPicture}
                alt={user.profile.fullName}
                borderRadius="md"
                mt={4}
              />
            )}

            <HStack mt={4} gap={8}>
              <HStack gap={1}>
                <Button variant="solid" colorScheme="red" size="sm">
                  <FaHeart />
                  {user.post.likes}
                </Button>
                <Button
                  variant="solid"
                  colorScheme="blue"
                  size="sm"
                  aria-label="Reply"
                >
                  <FaReply />
                  {user.post.replies}
                </Button>
              </HStack>
            </HStack>

            <Separator mt={4} />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="Media">
          {user.post.postPicture ? (
            <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={4}>
              <GridItem>
                <Image
                  src={user.post.postPicture}
                  width="244px"
                  height="244px"
                  objectFit="cover"
                  borderRadius="md"
                />
              </GridItem>
            </Grid>
          ) : (
            <Text color="gray.500" textAlign="center" mt={4}>
              "No media uploaded yet."
            </Text>
          )}
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
