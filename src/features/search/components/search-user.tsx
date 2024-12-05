import {
  Box,
  Button,
  Image,
  Input,
  InputElement,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import fakeUsers from '@/datas/user.json';
import { User } from '@/types/user';

export function SearchUser() {
  const [SearchUser] = useState<User[]>(fakeUsers);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Box margin={'30px'}>
      <InputElement
        pointerEvents="none"
        color="gray.300"
        fontSize="1.2em"
      ></InputElement>
      <Input
        placeholder="Search your friend"
        backgroundColor={'brand.secondary.800'}
        color={'white'}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {!searchTerm ? (
        <Box
          w={'100%'}
          h={'500px'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        ></Box>
      ) : (
        <>
          {SearchUser.filter((user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
          ).length === 0 ? (
            <Box
              w={'100%'}
              h={'500px'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              flexDirection={'column'}
              textAlign={'center'}
            >
              <Box w={'300px'}>
                <Text
                  as="h1"
                  fontWeight={'bold'}
                  fontSize={'lg'}
                  color={'white'}
                >
                  No results for "{searchTerm}"
                </Text>
                <Text color="brand.secondary.500">
                  Try searching for something else or check the spelling of what
                  you typed.
                </Text>
              </Box>
            </Box>
          ) : (
            <>
              {SearchUser.filter((user) =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((user) => {
                return (
                  <Box
                    gap={5}
                    display={'flex'}
                    marginTop={'20px'}
                    key={user.username}
                  >
                    <Box flex={'1'}>
                      <Image src={user.profile.profilePicture} />
                    </Box>
                    <Box flex={'5'}>
                      <Text color={'white'}>{user.profile.fullName}</Text>
                      <Text color={'brand.secondary.400'}>
                        @{user.username}
                      </Text>
                      <Text color={'white'}>{user.profile.bio}</Text>
                    </Box>
                    <Button variant={'outline'} color={'white'} flex="1">
                      Follow
                    </Button>
                  </Box>
                );
              })}
            </>
          )}
        </>
      )}
    </Box>
  );
}
