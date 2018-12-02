const reducer = (acc, cur) => acc + cur.price * cur.quantity;
//const reducer = (acc, cur) => acc.price*acc.quantity + cur.price*cur.quantity;

const data = [{ buyPrice: 0, price: 2, quantity: 100 }, { buyPrice: 0, price: 1, quantity: 200 }];

console.log(data.reduce(reducer));
