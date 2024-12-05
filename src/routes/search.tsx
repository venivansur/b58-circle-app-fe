import { SearchUser } from "@/features/search/components/search-user";
import { Text } from "@chakra-ui/react";
export function SearchRoute() {
  return (
  <>
  <Text as={"h1"} color="white" fontWeight={"bold"} fontSize={"xl"}>
   Search
  </Text>
  <SearchUser />;
  </>
  )
}