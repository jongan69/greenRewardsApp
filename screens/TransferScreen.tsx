import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';

import { Text, View } from '../components/Themed';
import MenuIcon from '../components/MenuIcon';
import { useEffect } from 'react';
import main from '../styles/main';
import { useWalletConnect } from "@walletconnect/react-native-dapp";

export default function TransferScreen() {
  const connector = useWalletConnect();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon />)
    });
  });

  return (
    <View style={main.centered}>

      {connector.accounts[0]
        ? <Text
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          We store tokens until Users request a transfer for a small fee.
          To get started, login with the wallet used to recycle.
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