import {
  AntDesign,
  Entypo, FontAwesome, Ionicons
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useRef, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Button,
  Dimensions
} from "react-native";
import { useQuery, } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, selectItem } from "../reduxToolkit/cartSlice";
import { addToignore, ignoreList } from "../reduxToolkit/ignoreSlice";
import getList from '../api/nfts/getList'
import { truncate } from "../lib/truncate";
import { StackHeaderLeftButtonProps } from '@react-navigation/stack';
import MenuIcon from '../components/MenuIcon';
import tw from 'twrnc';
import WalletConnectButton from "../components/WalletConnect";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

let defaultAvatar = 'https://avatars.dicebear.com/api/bottts/hi.svg?scale=10&colorful=true'

const HomeScreen = () => {
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    //Get device Height
    setHeight(Dimensions.get('window').height);
    //Get device Width
    setWidth(Dimensions.get('window').width);
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon />)
    });

  });

  const dispatch = useDispatch()
  const swipeRef = useRef(null);

  // Indicates the amount of items in basket
  const nfts = useSelector(selectItem)
  const ignore = useSelector(ignoreList)
  // Grabs the NFTS to display.
  const { data: nftCard, isLoading } = useQuery("cards", async () => await getList());

  // let random = Math.floor(Math.random() * nftCard?.length);
  // console.log('Random index is ', random)
  // console.log('nfts length is ', nftCard?.length)
  const connector = useWalletConnect();

  if (isLoading)
    return (
      <SafeAreaView>
        <View style={{
          paddingTop: '50%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <WalletConnectButton />
          <Text style={{ padding: 20 }}>Awaiting Data</Text>
          <ActivityIndicator
            color='#0a1142'
            size='large'
          />
        </View>
      </SafeAreaView>
    );





  return (
    <SafeAreaView style={tw.style("flex-1")}>
      <Text> Welcome to Green Rewards </Text>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});