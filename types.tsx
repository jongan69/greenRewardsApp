import { GestureResponderEvent } from "react-native";

export type HomeStackParamList = {
  Home: undefined;
  Confirm: undefined;
  Scan: undefined;
  NotFound: undefined;
};


export type DrawerParamList = {
  Home: undefined;
  Wallet: undefined;
  Transfer: undefined;
};


export type HomeParamList = {
  Home: undefined;
};

export type WalletParamList = {
  Wallet: undefined;
};

export type TransferParamList = {
  Transfer: undefined;
};

export type ScanParamList = {
  ScanScreen: undefined;
};

export type onPressFunc = (event: GestureResponderEvent) => void;
