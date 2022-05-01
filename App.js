import "./global";

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, LogBox } from 'react-native';
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TailwindProvider } from 'tailwind-rn';
import { Provider } from "react-redux";
import store from "./reduxToolkit/store";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from "react-query";
import utilities from './tailwind.json';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
LogBox.ignoreAllLogs()


const SCHEME_FROM_APP_JSON = 'greenrewardsapp'

export default function App() {
  const queryClient = new QueryClient();
  const colorScheme = useColorScheme();
  return (
    <WalletConnectProvider
    redirectUrl={
      Platform.OS === "web"
        ? window.location.origin
        : `${SCHEME_FROM_APP_JSON}://`
    }
    storageOptions={{
      asyncStorage: AsyncStorage,
    }}
  >
    <TailwindProvider utilities={utilities}>
      <Provider store={store}>
        <StatusBar />
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
          </SafeAreaProvider>
        </QueryClientProvider>
      </Provider>
    </TailwindProvider>
  </WalletConnectProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
