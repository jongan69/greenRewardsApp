

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Camera } from 'expo-camera';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { userSelector, mint } from "../reduxToolkit/userSlice";
import Clarifai from 'clarifai'
import { useWalletConnect } from "@walletconnect/react-native-dapp";

const apiUrl = 'https://api.cloudinary.com/v1_1/dp8lp5b68/image/upload';
const ipfsApiUrl = 'https://api.nft.storage/upload';
const CLARIFAY_KEY = "83e67f71dd034c60b784e4a050228303"
const storageApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDUyMkQzODI3RjUzM0IwRjkzMmUwZGQ5YjhDQTY1NzNCZDBGNDcyOWUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MTIxMDUyMjc0MCwibmFtZSI6ImRlbW8ifQ.2gT7maxJhiHD2e2EtaDIIlqSAb6meTWveph6ywPRe78'
const WINDOW_HEIGHT = Dimensions.get('window').height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

export default function ScannerScreen() {
  const connector = useWalletConnect();
  const cameraRef = useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const navigation = useNavigation();
  const [lastMint, setlastMint] = useState(false)
  const dispatch = useDispatch();
  const user = useSelector(userSelector);



  const [aiData, setAiData] = useState(null)

  const clarifai = new Clarifai.App({
    apiKey: CLARIFAY_KEY
  })

  useEffect(() => {
    onHandlePermission();
  }, []);

  const onHandlePermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType(prevCameraType =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const updateUserProfile = (address, image) => {
    const userData = { 'address': address, 'images': [image || null] };
    console.log('ALL THE MINT DATAS: ', userData)
    dispatch(mint(userData))
    console.log('Data in store: ', user)
    navigation.navigate('Confirm')
  }


  const onSnap = async () => {
    if (cameraRef.current) {
      console.log('MAGIC CAMERA SEES A: ', cameraRef.current)
      const options = { quality: 0.9, base64: true };
      const picture = await cameraRef.current.takePictureAsync(options);
      const source = picture.base64;

      if (source) {
        let base64Img = `data:image/jpg;base64,${source}`;
        let data = {
          file: base64Img,
          upload_preset: 'edscgabu'
        };
        await cameraRef.current.pausePreview();
        setIsPreview(true);
        // First Post To cloudinary for speed
        fetch(apiUrl, {
          body: JSON.stringify(data),
          headers: {
            'content-type': 'application/json'
          },
          method: 'POST'
        })
          .then(async cloud => {
            let cloudData = await cloud.json();
            if (cloudData.secure_url) {
              console.log('Cloudinary URL:', cloudData.secure_url)
              // Then Post to IPFS for immutability
              fetch(ipfsApiUrl, {
                method: 'POST',
                body: picture,
                headers: {
                  'Content-Type': 'image/*',
                  'Authorization': `Bearer ${storageApiKey}`,
                },
              })
                .then(async response => {
                  let IPFS = await response.json();
                  console.log('NFT STORAGE RESPONSE:', IPFS)
                  console.log('IPFS URL:', `ipfs://${IPFS.value.cid}`)
                  Alert.alert('Image IPFS CID: ', IPFS.value.cid);

                  if (IPFS.value.cid) {
                    process.nextTick = setImmediate // RN polyfill
                    // Using dweb.link for AI to read faster, NFT still minted with ipfs:// url
                    clarifai.models.predict(Clarifai.GENERAL_MODEL, cloudData.secure_url)
                      .then((datas) => {
                        const { concepts } = datas.outputs[0].data
                        if (concepts && concepts.length > 0) {
                          for (const prediction of concepts) {
                            if (prediction.name) {
                              // All Predictions should be logged
                              console.log('AI Reading: ', prediction.name)
                              setAiData(prediction.name)
                              // THIS API IS OUT OF MONEY, THE MINT WILL FAIL ON BACKEND
                              // EDIT, API needs to have higher gas limit
                              fetch('https://thirdweb-nextjs-minting-api.vercel.app/api/mint', {
                                method: 'POST',
                                headers: {
                                  'content-type': 'application/json'
                                },
                                body: JSON.stringify({
                                  "mintToAddress": connector.accounts[0],
                                  "supply": 1,
                                  "message": prediction.name,
                                  "metadata": {
                                    "name": prediction.name,
                                    "description": 'A Demo Green Rewards NFT',
                                    "image": `ipfs://${IPFS.value.cid}`,
                                    "external_url": `https://${IPFS.value.cid}.ipfs.nftstorage.link`,
                                    "uri": `https://${IPFS.value.cid}.ipfs.dweb.link`,
                                    "background_color": "",
                                    "attributes": [
                                      {
                                        "ai_reading": prediction.name,
                                        "trait_type": "DEMO"
                                      }
                                    ]
                                  }
                                }),
                              })
                              setlastMint(true)
                              updateUserProfile(connector.accounts[0], `ipfs://${IPFS.value.cid}`)
                              Alert.alert(`AI found ${prediction.name}, minted NFT!`);
                              navigation.navigate('Confirm')
                            } else {
                              // Anything else gets output as alert
                              Alert.alert('Bad NFT: ', prediction.name);
                            }
                            return
                          }
                        }
                      })
                  }
                })
                .catch(err => {
                  Alert.alert('Error Uploading NFT');
                  console.log(err);
                });
            }
          })
          .catch(err => {
            Alert.alert('Error Verifiying Blunt');
            console.log(err);
          });
      }
    }
  };

  const cancelPreview = async () => {
    await cameraRef?.current?.resumePreview();
    setIsPreview(false);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  return (
    <TouchableWithoutFeedback
      delayLongPress={630}
      onLongPress={() => navigation.goBack()}
    >
      <View style={styles.container}>
        <Camera
          ref={cameraRef}
          style={styles.container}
          type={cameraType}
          onCameraReady={onCameraReady}
          useCamera2Api={true}
        />
        <View style={styles.container}>
          {isPreview && (
            <>
              <View style={{ alignSelf: 'center', padding: '80%' }}>
                {!lastMint && <ActivityIndicator size="large" color="#00ff00" />}
              </View>
              <TouchableOpacity
                onPress={cancelPreview}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <AntDesign name='close' size={32} color='#fff' />
              </TouchableOpacity>
            </>
          )}
          {!isPreview && (
            <View style={styles.bottomButtonsContainer}>
              <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
                <MaterialIcons name='flip-camera-ios' size={28} color='white' />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={!isCameraReady}
                onPress={onSnap}
                style={styles.capture}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  text: {
    color: '#fff'
  },
  bottomButtonsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: 35,
    right: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5A45FF',
    opacity: 0.7
  },
  capture: {
    backgroundColor: '#5A45FF',
    // borderRadius: 5,
    height: CAPTURE_SIZE,
    width: CAPTURE_SIZE,
    borderRadius: Math.floor(CAPTURE_SIZE / 2),
    marginBottom: 28,
    marginHorizontal: 30
  }
});