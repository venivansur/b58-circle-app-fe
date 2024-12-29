import  PostWithImageDetail   from "@/features/home/components/detail-post-image";
import { Text } from '@chakra-ui/react';

export function DetailPostImageRoute() {
  return (
  
     <>
      <Text as={'h1'} color="white" fontWeight={'bold'} fontSize={'xl'}>
        Detail Post Image
      </Text>
       <PostWithImageDetail />
      </>
  );
}
