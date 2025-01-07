import { FaArrowLeft } from 'react-icons/fa';
import { Box, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import PostWithoutImageDetail from '@/features/home/components/detail-post';

export function DetailPostRoute() {
  return (
    <>
      <Box display="flex" alignItems="center">
        <Link to="/">
          <Button variant="plain" color="white" aria-label="Go back to home">
            <FaArrowLeft />
          </Button>
        </Link>
        <Text as="h1" color="white" fontWeight="bold" fontSize="xl">
          Status
        </Text>
      </Box>

      <PostWithoutImageDetail />
    </>
  );
}
