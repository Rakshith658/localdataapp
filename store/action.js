import AsyncStorage from "@react-native-async-storage/async-storage";

export const AUTH = "AUTH";

export const DataRegister = (Authdata) => {
  saveData(Authdata);
  return {
    type: AUTH,
    Authdata: Authdata,
  };
};

const saveData = (Authdata) => {
  AsyncStorage.setItem("userData", JSON.stringify(Authdata));
};
