import { View, Text, TouchableOpacity } from "react-native";
import { Button, HStack, Heading } from "native-base";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setUserInfo, userInfoSelector } from "@/store";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "@/constants";
import { SCREENS } from "@/config";

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const userInfo = useAppSelector(userInfoSelector);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(setUserInfo(undefined));
    AsyncStorage.removeItem(STORAGE_KEY.USER_INFO);
    AsyncStorage.removeItem(STORAGE_KEY.TOKEN);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Heading mb={3}>Trang chủ</Heading>

      {userInfo ? (
        <>
          <Text>Bạn đã đăng nhập vào {userInfo.email}</Text>
          <Button
            size="lg"
            variant="outline"
            color="red.50"
            borderRadius={15}
            onPress={handleLogout}
          >
            Đăng xuất
          </Button>
        </>
      ) : (
        <HStack space={4}>
          <Button
            variant="solid"
            borderRadius={25}
            onPress={() => navigation.navigate(SCREENS.LOGIN)}
          >
            Đăng nhập
          </Button>
          <Button
            variant="outline"
            borderRadius={25}
            onPress={() => navigation.navigate(SCREENS.REGISTER)}
          >
            Đăng ký
          </Button>
        </HStack>
      )}
    </View>
  );
};

export default HomeScreen;
