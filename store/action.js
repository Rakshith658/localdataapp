import AsyncStorage from "@react-native-async-storage/async-storage";

export const AUTH = "AUTH";

export const currentUser = (Authdata) => {
  return {
    type: AUTH,
    Authdata: Authdata,
  };
};

const saveData = (Authdata) => {
  AsyncStorage.setItem("userData", JSON.stringify(Authdata));
};
