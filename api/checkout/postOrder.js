import 'isomorphic-fetch';

const postOrder = async (completeOrder) => {

  const url = 'https://mobilenft-admin-app.vercel.app/api/order'
  const options = {
    method: 'POST',
    body: JSON.stringify(completeOrder),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch(url, options);
  const data = await response.json();
  console.log('postOrder res: ', data)
  return data;
}

export default postOrder