import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = "https://173.34.178.13:8001/query";

type ChatMessage = {
  role: string;
  content: string;
};

const useChat = () => {
  const queryClient = useQueryClient();

  const sendMessage = async (message: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30 * 1000); // 30 seconds timeout
    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: message,
        }),
        signal: controller.signal, // Attach the AbortController signal
      });

      clearTimeout(timeoutId); // Clear the timeout if the request completes

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Request failed to send message:", error);
      clearTimeout(timeoutId); // Clear the timeout if the request fails
      throw new Error("Failed to send message");
    }
  };

  const mutation = useMutation({
    mutationFn: sendMessage,
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: ["chatHistory"] });
      const previousMessages = queryClient.getQueryData<ChatMessage[]>([
        "chatHistory",
      ]);

      // Add user message to chat history
      queryClient.setQueryData<ChatMessage[]>(["chatHistory"], (old = []) => [
        ...old,
        { role: "user", content: newMessage },
      ]);

      return { previousMessages };
    },
    onSuccess: (response) => {
      // Add AI response to chat history
      queryClient.setQueryData<ChatMessage[]>(["chatHistory"], (old = []) => [
        ...old,
        { role: "ai", content: response },
      ]);
    },
    onError: (err, newMessage, context) => {
      console.error("Mutation error:", err, newMessage);
      // Rollback to the previous state
      queryClient.setQueryData(["chatHistory"], context?.previousMessages);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
  });

  return {
    sendMessage: mutation.mutate,
    isLoading: mutation.isLoading,
    error: mutation.error,
    chatHistory: queryClient.getQueryData<ChatMessage[]>(["chatHistory"]) || [],
  };
};

export default useChat;
