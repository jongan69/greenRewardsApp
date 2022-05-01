import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              Home: 'Home'
            }
          },
          Wallet: {
            screens: {
              WalletScreen: 'Wallet'
            }
          },
          Transfer: {
            screens: {
              TransferScreen: 'Transfer'
            }
          }
        },
      },
      NotFound: '*',
    },
  },
};
