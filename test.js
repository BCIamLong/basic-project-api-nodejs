// const obj = [
//   {
//     name: "long",
//   },
//   {
//     name: "long1",
//   },
//   {
//     name: "long2",
//   },
// ];

// const index = obj.indexOf({
//   name: "long2",
// });
// console.log(index);

const ob1 = {
  name: {
    value: 'a',
    type: 'String',
  },
  age: 1,
};
ob1.name = {
  x: 'a',
  t: 's',
};
// console.log(ob1);

const time = new Date().toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
});

// console.log(time);
