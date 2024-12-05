import { useParams } from "react-router-dom";
import { Box, Text, Image, Stack, HStack, Button, Center } from "@chakra-ui/react";
import { FaHeart, FaReply } from "react-icons/fa";
import fakeUsers from "@/datas/user.json"; 
import { Avatar } from "@/components/ui/avatar";

export default function PostPage() {

  const { id } = useParams();

  
  const post = fakeUsers
    .map(user => user.post)
    .find(post => post.id === parseInt(id || "", 10)); 

 
  if (!post) {
    return (
      <Center mt={20}>
        <Text color="red.500" fontSize="xl">
          Post not found!
        </Text>
      </Center>
    );
  }

  
  const user = fakeUsers.find(user => user.post.id === post.id);

  return (
    <Box p={5}>
    
      <HStack gap={4}>
        <Avatar name={user?.profile.fullName || "Unknown"} src={user?.profile.profilePicture} />
        <Stack>
          <Text color="white" fontWeight="bold">
            {user?.username}
          </Text>
          <Text color="gray.500" fontSize="sm">
            {post.timeAgo}
          </Text>
        </Stack>
      </HStack>

     
      <Text color={"white"} mt={4}>
        {post.postText}
      </Text>

     
      {post.postPicture && (
        <Image
          src={post.postPicture}
          alt={`Image posted by ${user?.username}`}
          borderRadius="md"
          mt={4}
        />
      )}


      <HStack mt={4} gap={8}>
        <Button variant="solid" colorScheme="red" size="sm">
          <FaHeart />
          {post.likes}
        </Button>
        <Button variant="solid" colorScheme="blue" size="sm">
          <FaReply />
          {post.replies} Replies
        </Button>
      </HStack>
    </Box>
  );
}
