import fakeUsers from '@/datas/user.json';
import { Box, Spacer, Text, Button, Flex } from '@chakra-ui/react';
import * as Tabs from '@radix-ui/react-tabs';
import { User } from '@/types/user';
import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
export function Follows() {
  const [tabValue, setTabValue] = useState('Followers');
  const [Follows] = useState<User[]>(fakeUsers);

  const filteredUsers =
    tabValue === 'Followers'
      ? Follows.filter((user) => user.isFollowed)
      : Follows.filter((user) => user.following);

  return (
    <Box>
      <Text color={'white'} fontSize="xl" fontWeight="bold" mb={4}>
        Follows
      </Text>

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
              value="Followers"
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                color: tabValue === 'Followers' ? 'white' : 'gray',
                fontWeight: tabValue === 'Followers' ? 'bold' : 'normal',
              }}
            >
              Followers
            </Tabs.Trigger>
            <Tabs.Trigger
              value="Following"
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                color: tabValue === 'Following' ? 'white' : 'gray',
                fontWeight: tabValue === 'Following' ? 'bold' : 'normal',
              }}
            >
              Following
            </Tabs.Trigger>
          </Tabs.List>

          <Box
            position="absolute"
            bottom="-4px"
            left={tabValue === 'Followers' ? '5%' : '50%'}
            width="300px"
            height="4px"
            bg="green.500"
            borderRadius="md"
            transition="all 0.3s ease"
          />
        </Box>

        <Tabs.Content value="Followers">
          {filteredUsers.slice(0, 10).map((user, index) => (
            <Flex
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={4}
            >
              <Avatar
                src={user.profile.profilePicture}
                name={user.profile.fullName}
                size="md"
                border="2px solid white"
              />
              <Box ml={3}>
                <Text color="white">{user.profile.fullName}</Text>
                <Text fontSize="sm" color="gray.400">
                  @{user.username}
                </Text>
              </Box>
              <Spacer />
              <Button
                disabled={user.isFollowed}
                variant="outline"
                colorScheme="whiteAlpha"
                color={'white'}
              >
                {user.isFollowed ? 'Followed' : 'Follow'}
              </Button>
            </Flex>
          ))}
        </Tabs.Content>

        <Tabs.Content value="Following">
          {filteredUsers.slice(0, 10).map((user, index) => (
            <Flex
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={4}
            >
              <Avatar
                src={user.profile.profilePicture}
                name={user.profile.fullName}
                size="md"
                border="2px solid white"
              />
              <Box ml={3}>
                <Text color="white">{user.profile.fullName}</Text>
                <Text fontSize="sm" color="gray.400">
                  @{user.username}
                </Text>
              </Box>
              <Spacer />
              <Button
                disabled={user.isFollowed}
                variant="outline"
                colorScheme="whiteAlpha"
                color={'white'}
              >
                {user.isFollowed ? 'Followed' : 'Follow'}
              </Button>
            </Flex>
          ))}
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
