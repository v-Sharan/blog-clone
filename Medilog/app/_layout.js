import { Stack } from "expo-router";
import { Provider } from "../context/auth";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function Root() {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="[id]/index" options={{ headerShown: true }} />
        </Stack>
      </QueryClientProvider>
    </Provider>
  );
}
