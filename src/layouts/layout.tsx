import React from 'react';
import { Box } from '@chakra-ui/react';
import { LeftBar } from './components/left-bar';
import { RightBar } from './components/right-bar';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box display="flex" height="100vh" overflow="hidden">
      <LeftBar />

      <Box
        width="748px"
        mx="30px"
        my="10px"
        flex="1"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {children}
      </Box>

      <RightBar />
    </Box>
  );
};
