import { Box } from "@chakra-ui/react";
import {  ResetPasswordForm } from "@/features/auth/reset-password/components/reset-password";

export function ResetPasswordRoute() {
  return (
    <Box display={"flex"} justifyContent={"center"} marginTop={"128px"}>
      < ResetPasswordForm />
    </Box>
  );
}