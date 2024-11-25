"use strict";

/**
 * 17-1. Object 생성자 함수 (constructor function)
 *
 * 생성자 함수란 new 연산자와 함께 호출하여 객체(인스턴스)를 생성하는 함수를 말한다.
 * 생성자 함수를 통해 생성된 객체를 인스턴스(instance)라 한다.
 *
 * var obj = new Object();
 */

// 빈 객체 생성
const person = new Object();

// 프로퍼티 추가
person.name = "Olivia";
person.sayHi = function () {
  `Hi, my name is ${this.name}`;
};

person.sayHi(); // Hi, my name is Olivia

/**
 * 17-2. 생성자 함수 (constructor function)
 *
 * 생성자 함수를 이용한 객체 생성보다 객체 리터럴을 이용한 방식은 더 직관적이고 간편하다.
 * 그렇다면 생성자 함수를 이용한 객체 생성은 왜 필요한걸까?
 */

// 17-2-1. 객체 리터럴 방식은 하나의 객체만을 생성한다, 만약 같은 property를 갖는 객체를 여러개 생성하기에 비효율적이다.
const circle1 = {
  radius: 5,
  getDiameter() {
    return 2 * this.radius;
  },
};
circle1.getDiameter(); // 10

const circle2 = {
  radius: 10,
  getDiameter() {
    return 2 * this.radius;
  },
};
circle2.getDiameter(); // 20

// 17-2-2. 생성자 함수를 통한 객체 생성 방식은 객체(instance)를 생성하기 위한 템플릿(class)처럼 사용하여 여러개의 객체를 생성하기에 효율적이다.
// 🚨 주의
// 생성자 함수를 이용하지 않거나 'use strict' 가 아닌 상태에서 this를 바인딩하게 되면 전역 객체에 영향을 주기 때문에 this를 이용하는 것을 지양하자
function Circle(radius) {
  // 생성자 함수 내부의 this는 생성자 함수가 생성할 미래의 객체(instance)를 가리킨다.
  this.radius = radius;
  this.getDiameter = function () {
    return 2 * this.radius;
  };
}

const newCircle1 = new Circle(5);
newCircle1.getDiameter(); // 10

const newCircle2 = new Circle(10);
newCircle2.getDiameter(); // 20

// 17-2-3. 생성자 함수의 인스턴스 생성 과정
// 생성자 함수를 통해 빈 객체(instance)를 생성하게 되면 해당 객체를 초기화한다, 이때 instance는 this에 바인딩 된다. 이는 함수가 실행되고 한 줄씩 읽어나가는 run-time 이전에 실행된다.
function Person(name) {
  // 1. 암묵적으로 instance가 생성되고 this에 바인딩 된다.
  console.log("👉 ~ Person ~ this: ", this); // Person {}

  // 2. this에 바인딩되어 있는 instance를 초기화한다.
  [this.firstName, this.lastName] = name.split(" ");
  this.getFullName = function () {
    return `${this.firstName} ${this.lastName}`;
  };

  // 3. 완성된 instance가 바인딩된 this가 암묵적으로 반환된다.

  // 4. 생성자 함수에서 명시적으로 return으로 원시타입이 아닌 참조타입인 객체나 배열을 반환하면 this반환이 무시되기 때문에 꼭 생략해야한다.
  // return []; // 🚨 문제 발생, instance의 this가 반환되지 않는다.
  // return {}; // 🚨 문제 발생, instance의 this가 반환되지 않는다.
  return "John Williams"; // 🚨 this는 반환되지만 생성자 함수의 기본 컨셉과 어울리지 않아 지양한다.
}

const newPerson = new Person("Micheal Jackson");
console.log("👉 ~ person: ", newPerson); // {firstName: "Micheal", lastName: "Jackson", getFullName: f}

// 17-2-4. [[Call]]과 [[Construct]]
// 함수는 객체이므로 일반 객체가 가지고 있는 모든 내부 슬롯과 내부 메서드를 이용할 수 있다.
// 그렇다면 함수 객체는 일반 객체가 무엇이 다른가?

// 함수는 객체이다.
function bar() {}
const baz = () => {};

// 함수는 객체이므로 property를 소유할 수 있다.
bar.prop = 10;
baz.prop = 10;

// 함수는 객체이므로 method를 소유할 수 있다.
bar.method = function () {
  console.log(this.prop); // 10
};

// function statement가 아닌 arrow function을 이용할 경우, this는 상위 스코프인 전역 객체를 참조하기 때문에 undefined가 된다.
bar.method2 = () => {
  // this = window
  console.log(this.prop); // undefined
};

// 🔑 일반 객체는 호출할 수 없지만 함수(객체)는 호출할 수 있다.
// 따라서 함수는 일반 객체가 가지는 내부 슬롯과 내부 메서드를 모두 이용할 수 있다.
// 또한 함수로서 동작하기 위해 함수(객체)를 위한 [[Environment]], [[FormalParameters]] 등의 내부 슬롯과 [[Call]], [[Construct]] 같은 내부 메서드를 추가로 가진다.
// 함수가 일반 함수로 호출되면 [[Call]] 내부 메서드가 동작하고 생성자 함수로 호출되면 [[Construct]] 내부 메서드가 동작한다.
function foo() {}

// 일반 함수로 호출: [[Call]]이 호출 된다.
foo();

// 생성자 함수로 호출: [[Construct]]가 호출 된다.
new foo();

// 17-2-5. constructor와 non-constructor
// 모든 함수 객체는 callable이며, new키워드에 생성된 생성자 함수의 경우 constructor이고 일반 함수의 경우 non-constructor라고 한다.
// constructor는 새로운 instance를 생성하고 초기화 후 this가 새로 생성될 instance를 가리킨다.
// non-constructor는 새로운 instance를 생성하지 않고 this가 "use strict"가 아닐 경우, window를 맞을 경우, undefined를 가리킨다.
// ❓ 그렇다면 모든 함수는 new키워드를 통해 constructor가 될 수 있을까?

// 🔑 new키워드를 통해 constructor가 될 수 있는 함수는 정의 방식에 결정된다.
// constructor: function declaration, function expression, class
// non-constructor: method(ES6 method 축약), arrow function
{
  // 일반 함수 정의
  function foo() {}
  const bar = function () {};
  const baz = { x: function () {} }; // property key "x"의 값이 function declaration으로 할단된 것은 일반 함수다, 이는 메서드로 인정되지 않는다.

  // 화살표 함수 정의
  const arrow = () => {};
  const qux = { x: () => {} }; // property key "x"의 값이 arrow function으로 할당된 것은 화살표 함수다, 이는 일반 함수로 인정되지 않는다.

  // 메서드 정의 (ES6 method 축약만 메서드 정의로 인정한다.)
  const fred = { x() {} }; // ES6 method 축약으로 할당된 것은 method 정의다, 이는 일반 함수로 인정되지 않는다.

  // 일반 함수로 정의된 함수만이 constructor이다.
  new foo(); // foo {}
  new bar(); // bar {}
  new baz.x(); //  x {}

  // 화살표 함수로 정의된 함수는 non-constructor이고, 이는 new연산자를 사용할 수 없다. (내부 메서드 [[Construct]]을 가지지 않는다.)
  // Uncaught TypeError: ~ is not a constructor
  // new arrow();
  // new qux.x();

  // ES6 축약 메서드로 정의된 method는 non-constructor, 이는 new연산자를 사용할 수 없다. (내부 메서드 [[Construct]]을 가지지 않는다.)
  // Uncaught TypeError: ~ is not a constructor
  // new fred.x();
}

// 17-2-6. new 연산자
// 일반 함수의 경우 [[Call]], [[Construct]]를 모두 내장하고 있기 때문에 일반 호출 시 [[Call]]로 작동하고, new키워드를 통하면 [[Construct]]를 통해 호출된다.
// 반면, arrow function이나 ES6의 축약 method로 정의된 함수는 [[Call]] 메서드만 내장하고 있기 때문에 TypeError가 발생한다.
// 즉, new키워드를 통해 생성자 함수를 생성할 때는 non-constructor가 아닌 constructor로 정의된 함수여야만 한다.

// 생성자 함수로서 정의하지 않은 일반 함수
function add(x, y) {
  return x + y;
}

// 생성자 함수로서 정의하지 않은 일반 함수를 new 연산자와 함께 호출
const inst = new add(); // add {}

// 함수가 객체를 반환하지 않았으므로 반환문이 무시된다. 따라서 빈 객체가 생성되어 반환된다.
console.log("👉 ~ inst: ", inst);

// 객체를 반환하는 일반 함수
function createUser(name, role) {
  return { name, role };
}

const user = new createUser("Olivia", "Manager");

// 함수가 생성한 객체를 반환한다.
console.log("👉 ~ user: ", user); // {name: 'Olivia', role: 'Manager'}

// 반대로 new 연산자 없이 생성자 함수를 호출하면 [[Construct]]가 아닌 [[Call]]로 동작한다.
// 생성자 함수
function Circle(radius) {
  this.radius = radius;
  this.getDiameter = function () {
    return 2 * this.radius;
  };
}

// new 연산자 없이 생성자 함수를 호출하면 일반 함수로서 호출된다.
// "use strict"가 아니라면 this는 전역 객체인 window를 가리키기 때문에 undefined를 반환한다
// const circle3 = Circle(5);
// console.log("👉 ~ circle3: ", circle3); .

// 17-2-7. new.target
// 생성자 함수는 new 없이 호출되는 것을 방지하기 위해 보통 pascal case를 이용해 정의한다.
// 하지만 혹시라도 있을 실수를 방지하기 위해 ES6부터는 new.target을 지원한다.
// 단 IE는 new.target을 지원하지 않는다.
// 생성자 함수 내부의 new.target은 생성자 함수 자기 자신을 가리킨다. 만약, new 연산자 없이 생성자 함수가 호출 된다면 new.target은 undefined를 반환한다.

function Circle4(radius) {
  // Circle이라는 생성자 함수가 new 없이 호출된다면 new.target은 undefined가 된다.
  if (!new.target) {
    // new 연산자와 함께 생성자 함수를 재귀 호출하여 생성된 인스턴스를 반환한다.
    return new Circle4(radius);
  }

  this.radius = radius;
  this.getDiameter = function () {
    return 2 * this.radius;
  };
}

const circle4 = Circle4(10);
console.log("👉 ~ circle4: ", circle4); // {radius: 10, getDiameter: f ()}
console.log("👉 ~ circle4.getDiameter(): ", circle4.getDiameter()); // 20

// 만약 IE환경이나 ES6의 new.target이 지원되지 않는 상황이라면?
// scope-safe constructor 패턴을 사용한다.
function Circle5(radius) {
  if (!(this instanceof Circle5)) {
    return new Circle5(radius);
  }

  this.radius = radius;
  this.getDiameter = function () {
    return 2 * this.radius;
  };
}

const circle5 = Circle5(20);
console.log("👉 ~ circle5: ", circle5); // {radius: 20, getDiameter: f ()}
console.log("👉 ~ circle5.getDiameter(): ", circle5.getDiameter()); // 40

// 대부분의 built-in 함수는 new 연산자와 함께 사용하면 객체를 반환한다.
// built-in: Array, Boolean, Date, Function, Number, Object, RegExp, String
// Function과 Object는 new 연산자를 사용하지 않아도 new 연산자를 사용한 것과 동일하게 작동한다.
const obj = Object();
console.log("👉 ~ obj: ", obj); // {}

const func = Function("x", "return x + x");
console.log("👉 ~ func: ", func); // f anonymous (x) { return x + x }

// Boolean, Number, String은 일반 함수로 호출 시, 내부 메서드인 [[Call]]을 통해 호출되며 데이터 타입의 변환만 일으키고 객체(instance)를 반환하지 않는다.
Boolean(1); // true
Number("1"); // 1
String(1); // "1"
