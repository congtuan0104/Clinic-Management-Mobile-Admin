import AppRouter from "@/AppRouter";
import "expo-dev-client"; // development build
import { NativeBaseProvider } from "native-base";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";

export default function App() {
  return (
    <ReduxProvider store={store}>
      <NativeBaseProvider>
        <AppRouter />
      </NativeBaseProvider>
    </ReduxProvider>
  );
}
