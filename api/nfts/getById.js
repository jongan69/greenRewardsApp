const getById = async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/1`,
    {
      method: "GET",
    }
  );
  const data = await response.json();
  console.log('getById res')
  return data;
}
