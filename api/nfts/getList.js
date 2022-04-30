import 'isomorphic-fetch';

const getList = async () => {
  const response = await fetch(`https://thirdweb-nextjs-minting-api.vercel.app/api/getNfts`);
  const data = await response.json();
  console.log('getList res: ', data)
  return data;
}

export default getList