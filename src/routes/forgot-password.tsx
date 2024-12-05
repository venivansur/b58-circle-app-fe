import { Box } from "@chakra-ui/react";
import {  ForgotPasswordForm } from "@/features/auth/forgot-password/components/forgot-password";

export function ForgotPasswordRoute() {
  return (
    <Box display={"flex"} justifyContent={"center"} marginTop={"128px"}>
      < ForgotPasswordForm />
    </Box>
  );
}