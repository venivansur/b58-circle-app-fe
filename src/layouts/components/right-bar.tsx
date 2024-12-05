import { Box } from "@chakra-ui/react";
import { MyProfile } from "./left-bar/my-profile";
import { Credit } from "./left-bar/credit";
import { SuggestedUser } from "./left-bar/sugest-user";

export function RightBar() {
  return (
    <Box
      width={"563px"}
      h={"100vh"}
      borderX={"1px"}
      borderColor={"brand.outline"}
      borderStyle={"solid"}
    >
      <MyProfile />
      <SuggestedUser />
      <Credit />
    </Box>
  );
}