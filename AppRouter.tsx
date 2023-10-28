import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen, LoginScreen, RegisterScreen } from "@/screens";
import { Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SCREENS } from "@/config";

const Stack = createNativeStackNavigator();

const AppRouter = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        // screenOptions={{
        //   headerStyle: { backgroundColor: "teal" },
        //   headerTintColor: "white",
        //   headerTitleStyle: { fontWeight: "bold" },
        // }}
      >
        <Stack.Screen
          name={SCREENS.HOME}
          component={HomeScreen}
          options={{
            title: "Trang chủ",
            // headerRight: () => (
            //   <Button
            //     onPress={() => alert("This is a button!")}
            //     title="Đăng nhập"
            //     color="gray"
            //   />
            // ),
          }}
        />
        <Stack.Screen name={SCREENS.LOGIN} component={LoginScreen} />
        <Stack.Screen name={SCREENS.REGISTER} component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppRouter;
