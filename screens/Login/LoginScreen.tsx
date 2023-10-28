import {
  Box,
  Button,
  FormControl,
  HStack,
  Heading,
  Input,
  Pressable,
  ScrollView,
  Stack,
  Text,
  WarningOutlineIcon,
  useToast,
  Image,
  Center,
  Icon,
} from "native-base";
import { Controller, useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { authApi } from "@/services";
import { useAppDispatch } from "@/hooks";
import { setUserInfo } from "@/store";
import { STORAGE_KEY } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SCREENS } from "@/config";
import { AntDesign } from "@expo/vector-icons";

interface ILoginFormData {
  email: string;
  password: string;
  isRemember?: boolean;
}

// định nghĩa điều kiện xác định input hợp lệ
const validateSchema = yup.object().shape({
  email: yup
    .string()
    .required("Bạn chưa nhập email")
    .email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Bạn chưa nhập mật khẩu")
    .min(8, "Mật khẩu phải có tối thiểu 8 ký tự"),
  isRemember: yup.boolean(),
});

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormData>({
    resolver: yupResolver(validateSchema),
    defaultValues: {
      email: "",
      password: "",
      isRemember: false,
    },
  });

  const handleLogin = async (data: ILoginFormData) => {
    await authApi
      .login({ email: data.email, password: data.password })
      .then((res) => {
        // console.log(res);
        if (res.status && !res.errors && res.data) {
          const userInfo = res.data?.user;
          const token = res.data?.token;

          // lưu vào token và thông tin user vào cookie
          AsyncStorage.setItem(STORAGE_KEY.TOKEN, JSON.stringify(token));
          AsyncStorage.setItem(STORAGE_KEY.USER_INFO, JSON.stringify(userInfo));

          // lưu thông tin user vào redux
          dispatch(setUserInfo(userInfo));

          // Hiển thị thông báo
          toast.show({
            description: "Đăng nhập thành công",
            variant: "left-accent",
            color: "green",
          });

          // chuyển hướng về trang chủ
          navigation.navigate(SCREENS.HOME);
        } else {
          toast.show({
            description: res.message,
            variant: "left-accent",
            color: "red",
          });
          console.log("Loi dang nhap:", res.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
        toast.show({
          description: error.message.response.data
            ? error.message.response.data
            : "Đăng nhập thất bại",
          variant: "left-accent",
          color: "red",
        });
      });
  };

  return (
    <ScrollView w="100%">
      <Stack
        bgColor="white"
        borderRadius={10}
        px="8"
        pb={16}
        safeArea
        w="100%"
        h="100vh"
      >
        <Center>
          <Image source={require("@/assets/logo.png")} alt="logo" size="40" />
        </Center>

        <Box mb={4} mt={10}>
          <Heading size="xl" mb="1">
            Đăng nhập
          </Heading>

          <HStack space={1}>
            <Text fontSize="md">hoặc</Text>
            <Pressable onPress={() => navigation.navigate(SCREENS.REGISTER)}>
              <Text fontSize="md" color="blue.500">
                Tạo tài khoản mới
              </Text>
            </Pressable>
          </HStack>
        </Box>

        <Box>
          <FormControl isRequired isInvalid={!!errors.email}>
            <FormControl.Label>Email</FormControl.Label>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  placeholder="Nhập email của bạn"
                  onChangeText={(val) => onChange(val)}
                  value={value}
                />
              )}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.email && <Text>{errors.email.message}</Text>}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.password}>
            <FormControl.Label>Mật khẩu</FormControl.Label>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  placeholder="Nhập mật khẩu của bạn"
                  type="password"
                  onChangeText={(val) => onChange(val)}
                  value={value}
                />
              )}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.password && <Text>{errors.password.message}</Text>}
            </FormControl.ErrorMessage>
          </FormControl>

          <Button onPress={handleSubmit(handleLogin)} mt={4}>
            Đăng nhập
          </Button>

          <Button
            variant="outline"
            mt={4}
            leftIcon={<Icon as={AntDesign} name="google" size="sm" />}
          >
            Đăng nhập bằng tài khoản Google
          </Button>
        </Box>
      </Stack>
    </ScrollView>
  );
};

export default LoginScreen;
