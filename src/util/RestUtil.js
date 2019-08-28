//Utility Function
async function getCards(value) {
  let res = await fetch(
    "http://localhost:3000/products/getProductList?key=" + value
  );
  let data = await res.json();
  return data;
}

export { getCards };
