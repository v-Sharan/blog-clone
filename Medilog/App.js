import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/Navigations";
import { Provider } from "./context/auth";
import { QueryClient, QueryClientProvider } from "react-query";
import "expo-dev-client";

const queryClient = new QueryClient();
function App() {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
