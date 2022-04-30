import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';

import { Text, View } from '../components/Themed';
import MenuIcon from '../components/MenuIcon';
import { useEffect } from 'react';
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import main from '../styles/main';

export default function WalletScreen() {
  const navigation = useNavigation();
  const connector = useWalletConnect();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon />)
    });
  });

  return (
    <View style={main.centered}>
      {connector.accounts[0]
        ?
        <Text
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          Wallet Screen
        </Text>
        :
        <Text
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          No Wallet Connected
        </Text>
      }
    </View>
  )
};