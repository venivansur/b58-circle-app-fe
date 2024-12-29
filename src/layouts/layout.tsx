import React from 'react';
import { Box } from '@chakra-ui/react';
import { LeftBar } from './components/left-bar';
import { RightBar } from './components/right-bar';
import { useLocation } from 'react-router-dom';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();


  const hideBars = location.pathname.startsWith('/post-image/');

  return (
    <Box display="flex" height="100vh" overflow="hidden">
  
      {!hideBars && <LeftBar />}

      <Box
        width="748px"
        
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

    
      {!hideBars && <RightBar />}
    </Box>
  );
};
