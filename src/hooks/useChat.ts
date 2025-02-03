import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Mock AI responses for simulation
const mockResponses = [
  "Hello! How can I assist you today?",
  "Sure, I can help with that. Could you provide more details?",
  "That sounds interesting! Let me look into it.",
  "I've found some information for you. Here it is!",
  "Is there anything else I can help you with?",
];

type OldData = {
  role: string;
  content: string;
};

const useChat = () => {
  const queryClient = useQueryClient();
  const [responseIndex, setResponseIndex] = useState(0); // Track which mock response to use

  const sendMessage = async (message) => {
    // Simulate an API call to your AI model
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockResponses[responseIndex];
        setResponseIndex((prevIndex) => (prevIndex + 1) % mockResponses.length); // Cycle through responses
        resolve(response);
      }, 2000); // Simulate a 2-second delay for the AI response
    });
  };

  const mutation = useMutation({
    mutationFn: sendMessage,
    onMutate: async (newMessage) => {
      // Optimistically update the chat history
      await queryClient.cancelQueries(["chatHistory"]);
      const previousChatHistory = queryClient.getQueryData(["chatHistory"]);
      queryClient.setQueryData(
        ["chatHistory"],
        (oldData: OldData[] | undefined) => [
          ...(oldData || []),
          { role: "user", content: newMessage },
        ],
      );
      return { previousChatHistory };
    },
    onSuccess: (data) => {
      // Add the AI's response to the chat history
      queryClient.setQueryData(
        ["chatHistory"],
        (oldData: OldData[] | undefined) => [
          ...(oldData || []),
          { role: "ai", content: data as string },
        ],
      );
    },
    onError: (err, newMessage, context) => {
      // Rollback on error
      queryClient.setQueryData(["chatHistory"], context?.previousChatHistory);
    },
  });

  return {
    sendMessage: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    error: mutation.error,
    chatHistory: queryClient.getQueryData(["chatHistory"]) || [],
  };
};

export default useChat;
