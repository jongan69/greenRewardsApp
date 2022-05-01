import 'isomorphic-fetch';

const getList = async () => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/1`);
  const data = await response.json();
  console.log('getList res: ', data)
  return data;
}

export default getList