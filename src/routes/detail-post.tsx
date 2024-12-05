import  DetailPost  from "@/features/home/components/detail-post";
import { Text } from '@chakra-ui/react';
function DetailPostRoute() {
  return (
  
     <>
      <Text as={'h1'} color="white" fontWeight={'bold'} fontSize={'xl'}>
        Detail Post
      </Text>
       <DetailPost />
      </>
  );
}

export default DetailPostRoute;
