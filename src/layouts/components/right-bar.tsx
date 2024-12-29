import { Box } from "@chakra-ui/react";
import { MyProfile } from "./left-bar/my-profile";
import { Credit } from "./left-bar/credit";
import { SuggestedUser } from "./left-bar/sugest-user";
import { useLocation } from 'react-router-dom';

export function RightBar() {
  const location = useLocation();

  return (
    <Box
      width={"563px"}
      h={"100vh"}
      borderX={"1px"}
      borderColor={"brand.outline"}
      borderStyle={"solid"}
    >
     
      {location.pathname !== '/profile' && <MyProfile />}
      <SuggestedUser />
      <Credit />
    </Box>
  );
}
