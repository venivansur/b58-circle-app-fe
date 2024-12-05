import { useParams } from "react-router-dom";
import { Box, Text, Image, Stack, HStack, Button, Center, Input, Field, FieldLabel } from "@chakra-ui/react";
import { FaHeart, FaReply } from "react-icons/fa";
import fakeUsers from "@/datas/user.json"; 
import { Avatar } from "@/components/ui/avatar";
import { useState } from "react";

// Tipe untuk komentar
interface Comment {
  text: string;
  user: string | undefined;
}

export default function PostPage() {
  const { id } = useParams();
  
  // Mendapatkan post berdasarkan id
  const post = fakeUsers
    .map(user => user.post)
    .find(post => post.id === parseInt(id || "", 10));

  // Jika post tidak ditemukan, tampilkan pesan error
  if (!post) {
    return (
      <Center mt={20}>
        <Text color="red.500" fontSize="xl">
          Post not found!
        </Text>
      </Center>
    );
  }

  // Mendapatkan user terkait dengan post
  const user = fakeUsers.find(user => user.post.id === post.id);

  // Mengonversi komentar yang berupa string (jika ada) menjadi array objek komentar
  const initialComments = typeof post.comments === "string" 
    ? [] // Jika comments berupa string, set ke array kosong
    : post.comments; // Jika sudah berupa array, gunakan langsung

  // State untuk komentar dengan tipe Comment[]
  const [comments, setComments] = useState<Comment[]>(initialComments || []); // Komentar awal bisa diambil dari post
  const [newComment, setNewComment] = useState(""); // Menyimpan komentar baru

  // Fungsi untuk mengirim komentar baru
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newComment.trim() === "") {
      return; // Jangan kirim jika komentar kosong
    }

    const newComments = [...comments, { text: newComment, user: user?.username }];
    setComments(newComments);
    setNewComment(""); // Reset input setelah mengirim komentar
  };

  return (
    <Box p={5}>
      {/* Post Information */}
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

      {/* Komentar Section */}
      <Box mt={6}>
        <Field.Root>
          <FieldLabel color="white">Add a Comment</FieldLabel>
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            color="white"
            bg="gray.700"
            borderColor="gray.500"
            _focus={{ borderColor: "green.400" }}
          />
          <Button
            mt={2}
            onClick={handleCommentSubmit}
            colorScheme="green"
            size="sm"
          >
            Post Comment
          </Button>
        </Field.Root>

        {/* Daftar Komentar */}
        <Box mt={4}>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <Box key={index} mb={3}>
                <HStack>
                  <Avatar size="sm" name={comment.user} />
                  <Stack>
                    <Text color="white" fontWeight="bold">
                      {comment.user}
                    </Text>
                    <Text color="gray.300" fontSize="sm">
                      {comment.text}
                    </Text>
                  </Stack>
                  
                </HStack>
              </Box>
            ))
          ) : (
            <Text color="gray.500">No comments yet.</Text>
          )}
        </Box>
      </Box>
    </Box>
  );
}
