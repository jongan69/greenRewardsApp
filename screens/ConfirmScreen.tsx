import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import {
  View,
  Text,
  Keyboard,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert
} from "react-native";
import tw from 'twrnc';
import Header from "../components/Header";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useDispatch, useSelector } from "react-redux";
import { userSelector, mint } from "../reduxToolkit/userSlice";


export default function ConfirmScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const user = useSelector(userSelector);
  const connector = useWalletConnect();
  const [address, setAddress] = useState(connector?.accounts[0]);
  const [image, setImage] = useState(user.images[0]);
  const [weight, setWeight] = useState();
  const incomplete = !address || !image;

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(
      address.length - 4,
      address.length
    )}`
  };

  const updateUserProfile = (address, image) => {
    const userData = { 'address': address, 'images': [image || null] };
    console.log('ALL THE MINT DATAS: ', userData)
    dispatch(mint(userData))
    console.log('Data in store: ', user)
    return
  }

  return (
    <SafeAreaView style={tw.style('flex-1')} onPress={Keyboard.dismiss}>
      <View style={tw.style("flex-1 pt-1")}>
        <Header title="Confirm" />
        <View style={tw.style("flex-1 items-center pt-0")}>
          <Text style={tw.style("text-center p-4 font-black text-3xl text-red-400")}>
            Green Rewards
          </Text>
          {connector?.accounts[0] &&
            <>
              <Text style={tw.style("text-xl text-gray-500 p-0 font-bold")}>
                Collect Your Rewards!
              </Text>
              <Text style={[tw.style("text-center p-2 font-bold text-green-500"),{ margin: 30}]}>
              Step 1. Current Wallet {shortenAddress(connector?.accounts[0])}
              </Text>

              <Text style={tw.style("text-center p-4 font-bold text-blue-500")}>
                Step 2. Image of Recyclable Material
              </Text>
              <Text style={[tw.style("text-center p-2 font-bold text-green-500"),{ margin: 30}]}>
                IPFS: {image}
              </Text>

              {/* <TextInput
                value={image}
                onChangeText={setImage}
                style={tw.style("text-center text-xl pb-2")}
                placeholder="Enter your Email"
              /> */}

              <Text style={tw.style("text-center p-4 font-bold text-blue-500")}>
                Step 3. Weight
              </Text>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                style={tw.style("text-center text-xl pb-2")}
                placeholder="Enter Weight"
                keyboardType="numeric"
                maxLength={12}
                onEndEditing={Keyboard.dismiss}
              />
              
              <Text style={tw.style("text-center p-2 font-bold text-blue-500")}>
                Step 4: Confirm & Sign
              </Text>

              
              {incomplete ? null 
              :
              <TouchableOpacity
              onPress={() => {
                Alert.alert('Success!', 'Great job saving the earth!');
                navigation.navigate('Home')
              }}
              disabled={incomplete}
              style={[
                tw.style("w-64 p-3 rounded-xl absolute bottom-10"),
                incomplete ? tw.style("bg-gray-400") : tw.style("bg-red-400"),
              ]}
            >
              <Text style={tw.style("text-center text-white text-xl")}  >
                Collect Rewards
              </Text>
            </TouchableOpacity>
              }
            </>
          }
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#5A45FF",
    color: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

