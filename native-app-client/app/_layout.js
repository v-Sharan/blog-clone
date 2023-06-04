import { Slot } from "expo-router";

import { Provider } from "../context/auth";

export default () => {
  return (
    <Provider>
      <Slot />
    </Provider>
  );
};
