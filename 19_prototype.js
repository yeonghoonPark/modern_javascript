"use strict";

// JavaScript는 프로토타입 기반(prototype-based)의 객체지향 프로그래밍 언어(OOP: Object Oriented Programming)이다.
// C++ 또는 Java와 같이 상속과 캡슐화를 위한 public, private, protected가 없지만 프로토타입 기반의 OOP이다.
// primitive type의 값을 제외한 나머지 값들(함수, 객체, 배열, 정규식..)은 모두 객체다.

/**
 * 19-1. 객체지향 프로그래밍 (OOP)
 *
 * 객체지향 프로그래밍이란, 객체의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임을 의미한다.
 * 사물이나 실체를 구별하고 인식하기 위해 특징이나 성질의 "속성(attribute/property)"을 정의함을 프로프래밍에 접목하려는 시도이다.
 * 예를 들어, 사람은 국가, 인종, 이름, 성별, 주소, 나이 등. 다양한 속성을 가지며, 이러한 속성을 통해 실체를 구별하고 인식하는 방식이다.
 * 사물에는 다양한 속성이 있으나 프로그래밍 중 필요한 속성만 간추려 표현하는 것을 "추상화(abstraction)"라 한다.
 *
 */

// 사람을 추상화(abstraction)하여 "이름"과 "국가" 속성을 가지는 객체
const person = {
  name: "Kim Ki Nam",
  country: "Republic Of Korea",
};

// 원을 의미하는 객체의 반지름은 "상태"를 나타내는 데이터이고, 원의 지름, 원의 둘레, 원의 넓이를 구하는 것은 "동작"이다.
const circle = {
  // 반지름 (상태)
  radius: 5,

  // 원의 지름 (동작)
  getDiameter() {
    return 2 * this.radius;
  },

  // 원의 둘레 (동작)
  getPerimeter() {
    return 2 * Math.PI * this.radius;
  },

  // 원의 넓이 (동작)
  getArea() {
    return Math.PI * this.radius ** 2;
  },
};

// 객체지향 프로그래밍은 객체의 "상태(state)"를 나타내는 property와 "동작(behavior)"을 나타내는 method를 한 단위로 묶은 복합적인 자료구조다.
// 각 객체는 고유한 기능을 수행하면서 다른 객체와 관계성을 가지거나 property나 method를 상속받기도 한다.

/**
 * 19-2. 상속(inheritance)과 프로토타입
 *
 * 상속은 객체지향 프로그래밍의 핵심 개념으로, 어떤 객체의 property 또는 method를 상속받아 그대로 사용하는 것을 의미한다.
 * 자바스크립트는 프로토타입을 기반으로 상속을 구현하여 불필요한 코드의 중복을 제거한다.
 * 중복을 제거하는 방법은 기존의 코드를 재사용하는 것이다.
 *
 */

// constructor function
function Circle1(radius) {
  this.radius = radius;
  this.getArea = function () {
    return Math.PI * this.radius ** 2;
  };
}

// 반지름이 1인 Circle1 instance 생성
const circle1 = new Circle1(1);

// 반지름이 2인 Circle1 instance 생성
const circle2 = new Circle1(2);

// Circle1 생성자 함수는 instance를 생성할 때마다 동일한 동작을 하는 getArea method를 중복 생성하고, 모든 instance가 중복 소유한다.
circle1.getArea === circle2.getArea; // false

// Circle1 생성자 함수는 radius state와 getArea method를 가지고 있다.
// 상태를 나타내는 radius의 경우에는 일반적으로 instance마다 다르다. 다만, 동일한 동작인 getArea는 instance마다 다를 이유가 없다.
// 위의 경우, 하나의 method를 생성하여 모든 instance가 상속받아 공유해서 사용하는 것이 바람직하다. (메모리 효율성, 퍼포먼스 측면)

// constructor function
function Circle2(radius) {
  this.radius = radius;
}

// Circle2 instance의 prototype에 getArea method를 추가하여 모든 instance가 새로운 생성 없이 공유하여 사용할 수 있다.
// Circle2로 생성될 미래의 instance는 radius property만 개별적으로 소유하고 getArea method는 prototype에서 상속받음을 의미한다.
Circle2.prototype.getArea = function () {
  return Math.PI * this.radius ** 2;
};

const circle3 = new Circle2(3);
const circle4 = new Circle2(4);
circle3.getArea === circle4.getArea; // true

// ES6의 class 키워드를 사용하면 내부에서 자동으로 prototype에 method가 추가된다.
// class 키워드 사용 시, 번거롭게 생성자 함수의 prototype에 method를 추가하지 않아도 된다.
class Circle3 {
  constructor(radius) {
    this.radius = radius;
  }

  getDiameter() {
    return 2 * this.radius;
  }
}

const circle5 = new Circle3(5);
const circle6 = new Circle3(6);
circle5.getDiameter === circle6.getDiameter; // true

/**
 * 19-3. 프로토타입 객체
 *
 * 프로토타입 객체(이하 프로토타입)란 객체지향 프로그래밍의 근간을 이루는 객체 간 상속(inheritance)을 구현하기 위해 사용된다.
 * 프로토타입은 어떤 객체의 상위(부모) 객체의 역할을 하는 객체로서 하위(자식) 객체에 공유 프로퍼티와 메서드를 제공한다.
 * 프로토타입을 상속받은 하위(자식) 객체는 상위(부모) 객체의 공유 프로퍼티와 메서드를 자유롭게 사용할 수 있다.
 *
 * 모든 객체는 [[Prototype]]이란 내부 슬롯을 가지며, 이 내부 슬롯의 값은 프로토타입 객체의 참조다. (null인 경우도 있다 👉 Object.create())
 * [[Prototype]]의 내부 슬롯 값은 객체의 생성 방식에 의해 결정된다. 즉, 객체가 생성될 때 그 방식에 따라 자동으로 결정된다.
 * 예를 들어, 객체 리터럴의 의해 생성된 객체의 프로토타입은 Object.prototype이고 생성자 함수에 의해 생성된 객체의 프로토타입은 생성자 함수의 prototype 프로퍼티 객체다.
 *
 * 쉽게 말하면 프로토타입은 각 객체가 생성되는 방식에 따라 자동으로 연결되는 기본 부모 객체이다.
 * 객체에서 프로퍼티나 메서드를 찾을 때 해당 객체에 없다면 상위 객체에 접근한다. 이를 프로토타입 체인이라고 한다. (최상위 객체는 Object.prototype이다)
 *
 * 모든 객체는 하나의 프로토타입을 갖는다. 그리고 모든 프로토타입은 생성자 함수와 연결되어 있다.
 *
 */

// 19-3-1. __proto__ 접근자 프로퍼티

// 모든 객체는 [[Prototype]]이란 내부 슬롯을 가지며, __proto__ 접근자 프로퍼티를 이용하여 내부 슬롯의 참조를 확인할 수 있다.
const apple = { color: "red" };
// 객체 리터럴을 이용하여 객체를 생성하면 [[Prototype]] 내부 슬롯은 Object.prototype을 참조한다.
apple.__proto__ === Object.prototype; // true

// __proto__ 는 데이터 프로퍼티가 아닌 접근자 프로퍼티 즉, [[Get]], [[Set]] 프로퍼티 어트리뷰트로 구성된 프로퍼티다.
Object.getOwnPropertyDescriptor(Object.prototype, "__proto__"); // { configurable: true, enumerable: false, get: f __proto__(), set: f __proto__() }

const obj1 = {};

// [[Get]], getter 함수 호출
obj1.__proto__;

// [[Set]], setter 함수 호출
// obj1의 [[Prototype]] 내부 슬롯 참조 값이 setter 함수로 인해 변경된다. (단, 변경하려는 값이 참조 타입일 경우에만 변경된다)
obj1.__proto__ = { x: 1 }; // obj1.__proto__ = { x: 1 }
obj1.__proto__ = [1]; // obj1.__proto__ = [1]
obj1.__proto__ = () => {}; // obj1.__proto__ = () => {}

// __proto__ 접근자 프로퍼티는 객체가 직접 소유하는 property가 아니라 Object.prototype의 property이다.
const animal = { name: "Lion" };

animal.hasOwnProperty("__proto__"); // false
animal.hasOwnProperty("name"); // true, 하지만 hasOwnProperty 메서드 조차 Object.prototype에서 상속받은 메서드이다.
animal.hasOwnProperty() === Object.prototype.hasOwnProperty(); // true

// 모든 객체는 Object.prototype의 접근자 프로퍼티인 __proto__를 상속받아 사용할 수 있다.
({}).__proto__ === Object.prototype; // true

// __proto__ 접근자 프로퍼티를 통해 프로토타입에 접근해야 하는 이유는 상호 참조에 의해 프로토타입 체인이 생성되는 것을 방지하기 위함이다.
const parent = {};
const child = {};
child.__proto__ = parent;
// 상호 양방으로 프로토타입 체인이 걸리기 때문에 TypeError가 발생한다. 즉, 프로토타입 체인은 단 방향으로 체결되어야 한다.
// parent.__proto__ = child; // Uncaught TypeError: Cyclic __proto__ value at set __proto__

// 🔑 __proto__ 접근자 프로퍼티를 코드 내에서 직접 사용하는 것은 권장하지 않는다.
// 🔑 이유는 Object.prototype을 상속받지 않는 객체가 존재하기 때문이다.
// 예를 들면 객체 생성과 프로토타입을 동시에 지정하는 Object.create() 메서드가 있다. (프로토타입은 객체 생성 방식에 따라 정해지기 때문)
const obj = Object.create(null); // Object.create(object | null)는 객체를 생성하고 해당 객체의 prototype을 설정하는 메서드이다.
obj.__proto__; // undefined, 프로토타입을 null 값으로 지정했기 때문에 Object.prototype을 상속받을 수 없어 undefined가 출력된다.

const obj2 = {};
obj2.__proto__ = null;
obj2.__proto__; // undefined

// 따라서 [[Prototype]]의 참조 값을 알고 싶은 경우, __proto__ 보다는 Object.getPrototypeOf 메서드를 사용하는게 더 정확하다.
Object.getPrototypeOf(obj); // null
Object.getPrototypeOf(obj2); // null

// 또한 prototype을 변경하고 싶을 경우, "{}.__proto__ = " 보다 Object.setPrototypeOf 메서드를 사용하는게 좋다.
const obj3 = {};
const obj4 = {
  sayHello() {
    console.log(`Hi, I'm ${this.name ?? "Olivia"}`);
  },
};

Object.getPrototypeOf(obj3); // Object.prototype
Object.setPrototypeOf(obj3, obj4);
Object.getPrototypeOf(obj3); // { sayHello: f sayHello() }
obj3.sayHello(); // Hi, I'm Olivia

// 19-3-2. 함수 객체의 prototype 프로퍼티

// 함수 객체만이 소유하는 prototype 프로퍼티는 생성자 함수가 미래에 생성할 instance의 prototype 객체를 가리킨다.

// 함수 객체(function declaration, function expression) 즉, constructor는 prototype 프로퍼티를 소유한다.
const foo = function () {};
foo.hasOwnProperty("prototype"); // true
(function () {}).hasOwnProperty("prototype"); // true

// arrow function, 일반 객체, ES6 축약 메서드 즉, non-constructor는 prototype을 소유하지 않는다.
const bar = () => {};
bar.hasOwnProperty("prototype"); // false
({}).hasOwnProperty("prototype"); // false

// 모든 객체가 가지는 __proto__(Object.prototype)과 생성자 함수의 객체가 가지는 prototype 프로퍼티는 동일한 프로토타입을 의미한다.
function Banana() {
  if (!new.target) {
    return new Banana();
  }

  this.color = "yellow";
}

const banana = new Banana();
banana.__proto__ === Banana.prototype; // true

// 🔑 결국 생성자 함수를 이용하여 생성한 객체의 __proto__는 Object.prototype인 최상위 prototype을 거치기전에 생성자 함수의 prototype 프로퍼티가 위치한다.
banana.__proto__; // {}, Banana 함수의 prototype 프로퍼티
banana.__proto__.__proto__; // Object.prototype
banana.__proto__.__proto__ === Object.prototype; // true
banana.__proto__.hasOwnProperty("hasOwnProperty"); // false
banana.__proto__.__proto__.hasOwnProperty("hasOwnProperty"); // true

// 19-3-3. 프로토타입의 constructor 프로퍼티와 생성자 함수
function Guitarist(name) {
  this.name = name;
}

// constructor 프로퍼티는 prototype 프로퍼티로 자신을 참조하는 생성자 함수 자체를 가리킨다.
Guitarist === Guitarist.prototype.constructor; // true

const johnWilliams = new Guitarist("John Williams");
// 실제로 생성자 함수를 통해 생성한 객체인 johnWilliams는 constructor 프로퍼티가 없다.
// 하지만 johnWilliams 객체의 prototype인 Guitarist.prototype에는 constructor 프로퍼티가 있다.
// 따라서 johnWilliams 객체는 프로토타입인 Guitarist.prototype의 constructor 프로퍼티를 상속 받아 사용할 수 있다.
johnWilliams.constructor === Guitarist; // true

// function declaration, function expression을 이용하지 않는 arrow function과 ES6 method는 constructor 프로퍼티를 가지지 못한다.
// 이유는 생성자 함수로 호출할 수 있는 조건인 내부 메서드인 [[Construct]]가 없기 때문이다. (단, 호출 조건인 [[Call]]은 가지고 있다)
const arrowFunc = () => {};
arrowFunc.__proto__; // f () { [native code] }
arrowFunc.__proto__.__proto__; // Object.prototype
arrowFunc.__proto__.__proto__ === Object.prototype; // true
arrowFunc.__proto__.hasOwnProperty("hasOwnProperty"); // false
arrowFunc.__proto__.__proto__.hasOwnProperty("hasOwnProperty"); // true
