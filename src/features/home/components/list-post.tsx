import { Box, Text, Stack, HStack, Image, Button, IconButton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaHeart, FaReply } from "react-icons/fa";
import { Avatar } from "@/components/ui/avatar";
import fakeUsers from "@/datas/user.json";
import { useLikeStore } from "@/store/like";

export function ListPost() {
  const { likes, toggleLike } = useLikeStore();

  return (
    <Box mt={5}>
      {fakeUsers.map((user) =>
        user.post && (
          <Box key={user.post.id} mb={5}>
          
            <HStack gap={4}>
              <Avatar name={user.profile.fullName} src={user.profile.profilePicture} />
              <Stack>
                <Text color={"white"} fontWeight="bold">{user.profile.fullName}</Text>
                <Text color="gray.500" fontSize="sm">{user.post.timeAgo}</Text>
              </Stack>
            </HStack>

           
            <Text color={"white"} mt={2}>{user.post.postText}</Text>

            {user.post.postPicture && (
              <Image src={user.post.postPicture} alt={`Post by ${user.username}`} borderRadius="md" mt={4} />
            )}

           
            <HStack mt={4} gap={8}>
              <HStack gap={1}>
                <Button
                  variant="solid"
                  color={likes[user.post.id] ? "red" : "white"}
                  size="sm"
                  onClick={() => toggleLike(user.post.id)}
                >
                  <FaHeart />
                  {likes[user.post.id] ? "Unlike" : "Like"} ({user.post.likes + (likes[user.post.id] ? 1 : 0)})
                </Button>
                <IconButton variant="solid" colorScheme="blue" size="sm">
                  <FaReply />
                  {user.post.replies} Replies
                </IconButton>
              </HStack>
            </HStack>

           
            <Box mt={2}>
              <Link to={`/post/${user.post.id}`}>
                <Text color="blue.400" fontSize="sm">Lihat detail</Text>
              </Link>
            </Box>
          </Box>
        )
      )}
    </Box>
  );
}
