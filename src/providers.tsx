import React from "react";
import { system } from "./libs/chakra-theme"; 
import { ChakraProvider } from "@chakra-ui/react"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


interface ProvidersProps {
  children: React.ReactNode;

}
const queryClient = new QueryClient();
export function Providers({ children }: ProvidersProps) {
  return (

    <QueryClientProvider client={queryClient}>
    <ChakraProvider value={system as any}>
      
        {children}
        </ChakraProvider>
        </QueryClientProvider>
    
  );
}
