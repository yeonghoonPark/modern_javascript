// 기본적으로 use strict가 권장되지만 해당 챕터에서는 논외를 둔다.
// "use strict";

/**
 * 18-1. 일급 객체 (First Class Object)
 *
 * 자바스크립트의 함수는 일급 객체이며 일급 객체의 조건은 다음과 같다.
 * 1. 무명의 리터럴로 생성할 수 있다. 즉, 런타임에 생성이 가능하다.
 * 2. 변수나 자료구조(객체, 배열)에 저장할 수 있다.
 * 3. 함수의 매개변수(Parameter)에 전달할 수 있다.
 * 4. 함수의 반환값으로 사용할 수 있다.
 *
 * 함수는 객체이지만 일반 객체와 가장 다른 점은 호출할 수 있냐 없냐의 차이다.
 * 이는 함수 객체가 일반 객체가 가지지 못하는 [[Call]], [[Construct]] 내부 메서드를 가지고 있기 때문이다.
 */

// 1. 함수는 무명의 리터럴 (익명)으로 생성할 수 있다.
// 2. 함수는 변수나 자료구조에 저장할 수 있다.
const increase = function (num) {
  return ++num;
};

const decrease = function (num) {
  return --num;
};

// 2. 함수는 변수나 자료구조에 저장할 수 있다.
const aux = { increase, decrease };

// 3. 함수의 매개변수에 전달할 수 있다.
// 4. 함수의 반환값으로 사용할 수 있다.
function makeCounter(aux) {
  let num = 0;

  return function () {
    num = aux(num);
    return num;
  };
}

// 3. 함수의 매개변수에 전달할 수 있다.
const increaser = makeCounter(aux.increase);
increaser(); // 1
increaser(); // 2

const decreaser = makeCounter(aux.decrease);
decreaser(); // -1
decreaser(); // -2

/**
 * 18-2. 함수 객체의 프로퍼티
 *
 * 함수는 객체이기 때문에 일반 객체와 동일하게 프로퍼티를 가질 수 있다.
 *
 * 함수는 객체와 마찬가지로 데이터 프로퍼티를 가지고 있다. 다만, 함수의 데이터 프로퍼티는 "use strict" 여부에 따라 다르게 동작한다.
 * 단, 여기서 의미하는 함수는 일반 함수로 ES6 method, arrow function은 제외된다.
 * use strict: length, name, prototype
 * non strict: arguments, caller, length, name, prototype
 *
 * 참고로 ES6 method, arrow function은 length, name 프로퍼티만 가지고 있다.
 *
 */

function square(num) {
  return num * num;
}
console.dir(square);

const squareDescriptors = Object.getOwnPropertyDescriptors(square);
console.log("👉 ~ squareDescriptors: ", squareDescriptors);

const arrowSquare = (num) => num * num;
console.dir(arrowSquare);

const arrowSquareDescriptors = Object.getOwnPropertyDescriptors(arrowSquare);
console.log("👉 ~ arrowSquareDescriptors: ", arrowSquareDescriptors);

// 18-2-1. arguments 프로퍼티
// arguments는 객체이다. 함수 선언시의 parameter에 실제로 전달되는 값을 가진 유사 배열 객체(Array-like Object)이다.
function multiple(x, y) {
  console.log(arguments);
  return x * y;
}

multiple(); // return: NaN
multiple(1); // return: NaN, arguments: { 0: 1 }
multiple(1, 2); // return: 2, arguments: { 0: 1, 1: 2 }
multiple(1, 2, 3); // return: 3, arguments: { 0: 1, 1: 2, 2: 3 }

// arguments는 함수의 매개변수(Parameter)의 개수를 확정지을 수 없는 가변 인자 함수(Variadic function)을 정의할 때 유용하다.
// 다만 ES6에서 Rest parameter가 도입되면서 비중이 줄었다.
function sum() {
  let res = 0;

  // ❓. arguments의 property attribute 중 enumerable은 false인데 어떻게 접근 가능한지 의문이다..
  for (let i = 0; i < arguments.length; i++) {
    res += arguments[i];
  }

  return res;
}

sum(1, 2, 3); // 6

// arguments는 실제 배열이 아니기 때문에 Array methods를 사용할 수 없다.
// length 프로퍼티와 index를 통해 접근할 수 있는 언제까지나 유사 배열 객체이다.
// Array methods를 사용하려면 apply, call 같은 작업이 필요하다.
function sum2() {
  const array = Array.prototype.slice.call(arguments);
  return array.reduce((pre, cur) => pre + cur, 0);
}

sum2(1, 2); // 3
console.log("👉 ~ sum2(1, 2): ", sum2(1, 2));

// 🚨 Arrow function은 arguments property를 가지고 있지 않아 접근할 수 없다.
// strict mode에서 arguments, callee가 Object.getOwnPropertyDescriptors()로 출력되지 않는 이유다.
const arrowSum2 = () => {
  const array = Array.prototype.slice.call(arguments);
  return array.reduce((pre, cur) => pre + cur, 0);
};

// ReferenceError: arguments is not defined
// arrowSum2(1, 2, 3, 4, 5);

// Function.prototype의 번거로움과 Arrow function, strict mode의 문제점을 해결하고자 ES6에서는 Rest parameter를 도입했다.
// Rest parameter의 도입으로 arguments의 중요성은 감소했지만, ES6 이전의 환경에 놓일 수 있다.
const arrowSum3 = (...args) => {
  return args.reduce((pre, cur) => pre + cur, 0);
};

arrowSum3(1); // 1
arrowSum3(1, 2, 3, 4, 5); // 15

// 18-2-2. caller 프로퍼티 (ECMAScript 포함되지 않는 비표준 프로퍼티, 중요도가 낮다.)
// 자기 자신을 호출한 함수를 가리킨다.

function foo(func) {
  return func();
}

function bar() {
  console.log("👉 ~ bar ~ bar.caller: ", bar.caller);
}

bar(); // caller: null, callback으로 호출되지 않고 혼자 호출하는 경우 null 값을 가진다.
foo(bar); // caller: f foo(func) {...}, callback으로 호출되는 경우 자기 자신을 호출한 함수를 가리킨다.

// 18-2-3. length 프로퍼티
// 함수의 length 프로퍼티는 함수를 정의할 때 정한 매개변수(parameter)의 개수를 가리킨다.
// 단, 함수 객체의 length 프로퍼티와 arguments 객체의 length 프로퍼티는 다를 수 있다.
// 함수 객체의 length 프로퍼티는 매개변수(parameter)의 수이고, arguments 객체의 length 프로퍼티는 인자(argument)의 수이다.

function qux() {
  console.log("👉 ~ qux ~ qux.length: ", qux.length);
}
qux(); // 0

function baz(x) {
  console.log("👉 ~ baz ~ baz.length: ", baz.length);
  return x;
}
baz("x"); // 1

// 18-2-4. name 프로퍼티
// 함수의 이름을 나타낸다.
// 단, ES5는 value로 빈 문자열을 가지고 ES6는 함수 이름을 가진다.

// function declaration
function namedFunc() {
  console.log("👉 ~ namedFunc ~ namedFunc.name: ", namedFunc.name);
}
namedFunc(); // "namedFunc"

// function expression
const anonymousFunc = function () {
  console.log("👉 ~ anonymousFunc ~ anonymousFunc.name: ", anonymousFunc.name);
};
anonymousFunc(); // ES5: "", ES6: anonymousFunc

// 18-2-5. __proto__ 접근자 프로퍼티
// 모든 객체는 [[Prototype]] 내부 슬롯을 갖는다. __proto__ 는 해당 내부 슬롯에 접근하기 위한 접근자 프로퍼티이다.
// 단, 내부 슬롯에 직접 접근하는게 아닌 간접 접근 방법을 제공하는 것 뿐이다.

const obj = { a: 1 };
console.log("👉 obj.__proto__ ", obj.__proto__ === Object.prototype); // true

const arr = [];
console.log("👉 ~ arr.__proto__ ", arr.__proto__ === Array.prototype); // true

// 객체 리터럴로 생성한 객체는 Object.prototype을 상속받는다.
// 단, hasOwnProperty는 고유의 프로퍼티 key인 경우 true, 상속받은 프로퍼티 key는 false를 반환한다.
console.log("👉 ~ hasOwnProperty(a)", obj.hasOwnProperty("a")); // true
console.log("👉 ~ hasOwnProperty(__proto__)", obj.hasOwnProperty(__proto__)); // false

// 18-2-6. prototype 프로퍼티
// prototype은 일반 함수(function declaration, function expression, class)만 갖는 프로퍼티다.
// 즉, 생성자 함수로 호출할 수 있는 함수 객체, [[Construct]] 내부 메서드를 가진 constructor 함수 객체만 가지는 프로퍼티다.

const hasPrototype = (obj) => {
  console.log(
    "👉 ~ hasPrototype ~ obj.hasOwnProperty('prototype'): ",
    obj.hasOwnProperty("prototype")
  );
};

// 일반 함수 객체는 prototype을 가진다.
hasPrototype(function () {}); // true

// 일반 객체나, non-constructor인 arrow function, ES6 method는 prototype을 가지지 않는다.
hasPrototype(() => {}); // false
hasPrototype({}); // false
