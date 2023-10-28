import {
  Box,
  Button,
  Divider,
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
  Flex,
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

interface IRegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validateSchema = yup.object().shape({
  firstName: yup.string().required("Bạn chưa nhập họ"),
  lastName: yup.string().required("Bạn chưa nhập tên"),
  email: yup
    .string()
    .required("Thông tin email là bắt buộc")
    .email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Bạn chưa nhập mật khẩu")
    .min(8, "Mật khẩu phải có tối thiểu 8 ký tự"),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận lại mật khẩu")
    .oneOf([yup.ref("password"), ""], "Không trùng với mật khẩu đã nhập"),
});

const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterFormData>({
    resolver: yupResolver(validateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = async (data: IRegisterFormData) => {
    const { confirmPassword, ...registerData } = data; // xóa thông tin xác nhận mật khẩu trước khi gửi api

    await authApi
      .register(registerData)
      .then((res) => {
        // console.log(res);
        if (res.status && !res.errors && res.data) {
          const userInfo = res.data?.user;

          // lưu thông tin user vào storage
          AsyncStorage.setItem(STORAGE_KEY.USER_INFO, JSON.stringify(userInfo));

          // lưu thông tin user vào redux
          dispatch(setUserInfo(userInfo));

          // Hiển thị thông báo
          toast.show({
            description: "Đăng ký tài khoản thành công",
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
        }
      })
      .catch((error) => {
        console.log(error.message);
        toast.show({
          description: error.message.response.data
            ? error.message.response.data
            : "Đăng ký thất bại",
          variant: "left-accent",
          color: "red",
        });
      });
  };

  return (
    <ScrollView w="100%">
      <Stack bgColor="white" borderRadius={10} px="8" pb={16} safeArea w="100%">
        <Center>
          <Image source={require("@/assets/logo.png")} alt="logo" size="40" />
        </Center>

        <Box mb={4} mt={10}>
          <Heading size="xl" mb="1">
            Đăng ký
          </Heading>

          <HStack space={1}>
            <Text fontSize="md">Đã có tài khoản?</Text>
            <Pressable onPress={() => navigation.navigate(SCREENS.LOGIN)}>
              <Text fontSize="md" color="blue.500">
                Đăng nhập
              </Text>
            </Pressable>
          </HStack>
        </Box>

        <Box>
          <HStack space={3}>
            <Box w="30%">
              <FormControl isRequired isInvalid={!!errors.firstName}>
                <FormControl.Label>Họ</FormControl.Label>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={(val) => onChange(val)}
                      value={value}
                    />
                  )}
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.firstName && <Text>{errors.firstName.message}</Text>}
                </FormControl.ErrorMessage>
              </FormControl>
            </Box>

            <Box flex={1}>
              <FormControl isRequired isInvalid={!!errors.lastName}>
                <FormControl.Label>Tên</FormControl.Label>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={(val) => onChange(val)}
                      value={value}
                    />
                  )}
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.lastName && <Text>{errors.lastName.message}</Text>}
                </FormControl.ErrorMessage>
              </FormControl>
            </Box>
          </HStack>

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

          <FormControl isRequired isInvalid={!!errors.confirmPassword}>
            <FormControl.Label>Xác nhận mật khẩu</FormControl.Label>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  placeholder="Nhập mật khẩu của bạn một lần nưuax"
                  type="password"
                  onChangeText={(val) => onChange(val)}
                  value={value}
                />
              )}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.confirmPassword && (
                <Text>{errors.confirmPassword.message}</Text>
              )}
            </FormControl.ErrorMessage>
          </FormControl>

          <Button onPress={handleSubmit(handleRegister)} mt={4}>
            Đăng ký
          </Button>
        </Box>
      </Stack>
    </ScrollView>
  );
};

export default RegisterScreen;
