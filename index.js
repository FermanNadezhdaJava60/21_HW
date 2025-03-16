import { testframework } from "./testframework.js";

//2
export function myBind(context, ...boundArgs) {
  return (...args) => this.apply(context, [...boundArgs, ...args]);
}

function sumElements(a, b) {
  return this.x + a + b;
}

function runBindTests() {
  const commonScript = `
    Function.prototype.myBind = function (context, ...boundArgs) {
    return (...args) => this.apply(context, [...boundArgs, ...args]);
    };
    
    function sumElements(a, b) {
      return this.x + a + b;
    }
    
    const obj = { x: 10 };
    `;

  const scripts = [
    `sumElements.bind(obj)(2, 3)`,
    `sumElements.myBind(obj)(2, 3)`,
    `sumElements.bind(obj, 2)(3)`,
    `sumElements.myBind(obj, 2)(3)`,
    `sumElements.bind(obj, 2, 3)()`,
    `sumElements.myBind(obj, 2, 3)()`,
    `new (sumElements.bind({ x: 100 }, 2, 3))().x`,
  ];

  const expectedResults = [15, 15, 15, 15, 15, 15, undefined];

  testframework("Bind Tests", commonScript, scripts, expectedResults);
}

runBindTests();

//1
class Deferred {
  constructor() {
    this.callbacks = [];
  }

  then(callback) {
    this.callbacks.push(callback);
    
  }

  resolve(startValue) {
    return this.callbacks.reduce((acc, fun) => fun(acc), startValue);
  }
}
const d = new Deferred();
d.then(function (res) {
  console.log("1 ", res);
  return "a";
});
d.then(function (res) {
  console.log("2 ", res);
  return "b";
});
d.then(function (res) {
  console.log("3 ", res);
  return "c";
});
d.resolve("hello");
