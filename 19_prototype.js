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
const Person = {
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
 * 모든 객체는 [[Prototype]]이란 내부 슬롯을 가지며, 이 내부 슬롯의 값은 프로토타입 객체의 참조다. (null인 경우도 있다 👉 Object.create(null))
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

// 🔑 __proto__ 접근자 프로퍼티를 코드 내에서 직접 사용하는 것은 권장하지 않는다. Object.prototype을 상속받지 않는 객체가 존재하기 때문이다.
// 예를 들면 객체 생성과 프로토타입을 동시에 지정하는 Object.create 메서드가 있다. (프로토타입은 객체 생성 방식에 따라 정해지기 때문)
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
Guitarist.prototype.constructor === Guitarist; // true
Object.prototype.constructor === Object; // true

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
arrowFunc.__proto__.__proto__.constructor === Object.prototype.constructor; // true

/**
 * 19-4. 리터럴 표기법에 의해 생성된 객체의 생성자 함수와 프로토타입
 *
 * 앞서 constructor 프로퍼티는 객체를 생성한 생성자 함수 자체를 참조한다고 했다.
 * 하지만, 객체를 생성하는 방식은 생성자 함수뿐만 아니라 리터럴 방식도 존재한다.
 * 리터럴 방식은 명시적인 생성자 함수 호출 없이 객체를 생성한다. 그렇다면 해당 객체는 생성자 함수를 통해 생성된 객체일까?
 * 결론은 "아니다" 이다.
 * 단, 리터럴 방식으로 생성한 객체 또한 프로토타입 체인이 필요하고 이를 위해 가상의 Built-In 생성자 함수를 가지고 동작한다.
 * 이는 실제로 생성자 함수를 통해 생성된 것은 아니지만 마치 그와 동일하게 동작한다고 봐도 무방하다. (차이점은 생성자 함수가 호출되지 않은 점)
 * 즉, 리터럴 방식을 이용하든 생성자 함수를 이용하든 prototype과 constructor는 항상 쌍을 이룬다.
 *
 */

// 생성자 함수에 의해 생성된 객체의 constructor 프로퍼티는 함수 자체이다.
const newObject = new Object(); // Object 생성자 함수는 new 키워드를 붙이지 않아도 new 키워드를 사용한 것과 동일하게 동작한다.
newObject.constructor === Object; // true
Object.prototype.constructor === Object; // true

const newFunction = new Function(); // Function 생성자 함수는 new 키워드를 붙이지 않아도 new 키워드를 사용한 것과 동일하게 동작한다.
newFunction.constructor === Function; // true
Function.prototype.constructor === Function;

function Weapon(name) {
  this.name = name;
}
const knife = new Weapon("knife");
knife.constructor === Weapon; // true
Weapon.prototype.constructor === Weapon; // true

// 알고 있듯이 생성자 함수를 이용하지 않고(인스턴트를 생성하지 않음) 리터럴 표기법으로 객체를 생성하는 방식도 있다.
const literalObject = {};
const literalFunction = function () {};
const literalArray = [];
const literalRegexp = /is/gi;
// 위의 방식을 통해 생성한 객체들 또한 프로토타입을 가지고 있다.
// 단, 리터럴 방식을 통해 생성된 객체의 constructor 프로퍼티는 객체를 생성한 생성자 함수라고 단정 지을 수 없다.

literalObject.constructor === Object; // true
literalFunction.constructor === Function; // true
literalArray.constructor === Array; // true
literalRegexp.constructor === RegExp; // true
// 위 식의 리터럴 방식으로 생성된 객체는 사실 생성자 함수가 호출되어 생성된 것이 아니다.
// 하지만, 마치 생성자 함수가 호출된 것처럼 동작한다.
// 이는 프로토타입체인이 필요하기 때문에 가상의 생성자 함수가 연결되는 것이다.
literalObject.__proto__ === Object.prototype; // true
literalFunction.__proto__ === Function.prototype; // true
literalArray.__proto__ === Array.prototype; // true
literalRegexp.__proto__ === RegExp.prototype; // true

/**
 * 19-5. 프로토타입의 생성 시점
 *
 * 앞에서 리터럴 표기법에 의해 생성된 객체도 생성자 함수와 연결되는 것을 살펴보았다.
 * 객체는 리터럴 표기법과 생성자 함수에 의해 생성되므로 결국 모든 객체는 생성자 함수와 연결되어 있다.
 * 프로토타입은 생성자 함수를 선언하는 방식에 따라 함수를 정의하거나 호출하는 시점에 더불어 생성된다.
 * 자바스크립트에서 생성자 함수는 `사용자 정의 생성자 함수`와 `Built-In 생성자 함수`로 구분된다.
 * 이렇게 구분된 두 가지 생성자 함수는 프로토타입 생성 시점 또한 다르다.
 *
 */

// 19-5-1. 사용자 정의 생성자 함수와 프로토타입 생성 시점

// 생성자 함수로 호출할 수 있는 함수, 즉 [[Construct]] 내부 슬롯을 지니는 함수 객체는 함수를 정의하거나 호출하는 시점에 프로토타입이 생성된다.
// function declaration 경우, 함수가 정의되는 시점에 생성자 함수의 prototype 객체가 생성된다. (호이스팅 시점, 함수로 평가되는 시점이 run-time 이전이다)
// function expression 경우, 함수가 호출되는 시점에 생성자 함수의 prototype 객체가 생성된다. (할당되는 시점, 함수로 평가되는 시점이 run-time 이다)
// construct: function declaration, function expression
console.log(DeclarationFunc.prototype); // {}
function DeclarationFunc() {
  this.name = "constructor: function declaration";
}
new DeclarationFunc();

// console.log(ExpressionFunc.prototype); // TypeError: Cannot read properties of undefined (reding 'prototype')
var ExpressionFunc = function () {
  this.name = "constructor: function expression";
};
new ExpressionFunc();
// 🔑 function expression은 var키워드를 사용하여 호이스팅이 발생하더라도 함수로 평가받지 못한다.
// 왜냐하면 run-time 이전의 호이스팅 단계에서 식별자인 `ExpressionFunc`는 선언 단계와 초기화 단계를 동시에 거쳐 undefined를 참조하고 있다.
// 즉, run-time의 재할당 단계를 거쳐야 함수로 평가받고 이때 prototype 객체가 생성된다.

// 생성자 함수로 호출할 수 없는 함수, arrow function, ES6 method 는 [[Construct]]가 존재하지 않기 때문에 프로토타입이 생성되지 않는다.
// non-construct: arrow function, ES6 method
const ArrowFunc = (name) => {
  this.name = "non-constructor: arrow function"; // 여기서 this는 globalThis를 가리킨다.
};
ArrowFunc(); // new 키워드를 사용하면, TypeError: ArrowFunc is not a constructor
console.log(ArrowFunc.prototype); // undefined

// 위의 `DeclarationFunc` 함수의 프로퍼티인 프로토타입은 객체이며 생성 시점에는 constructor 프로퍼티만 가지는 객체이다. (나중에 추가할 수 있다)
// 결국 constructor 프로퍼티도 객체이기 때문에 프로토타입이 필요하고 이는 Object.prototype과 프로토타입체인 된다.
// 🔑 즉, 사용자 정의 함수의 프로토타입은 호이스팅에 의해 run-time 이전에 정의 되고 호출 시점에 Object.prototype과 바인딩되어 생성된다.
// 사용자 정의 함수에 의해 생성된 객체는 `사용자 정의 함수.prototype`에 바인딩되고, 해당 프로토타입은 `Object.prototype`에 바인딩되는 형식으로 프로토타입체이닝이 이뤄진다. (Object.prototype은 가장 최상위 프로토타입이다)
// 이처럼 사용자 정의 함수에 의해 생성된 객체의 프로토타입은 함수로 객체를 생성하는 시점에 프로토타입도 더불어 생성되며 생성된 프로토타입의 프로토타입은 언제나 Object.prototype이다.

// 19-5-2. 빌트인 생성자 함수와 프로토타입 생성 시점

// 모든 Built-In 생성자 함수는 전역 객체(window, global, globalThis)가 생성될 때 프로토타입도 같이 생성된다.
// 전역 객체는 자바스크립트 엔진에 의해 run-time 이전에 생성되는 특수한 객체다.
// 생성된 프로토타입은 Built-In 생성자 함수의 prototype 프로퍼티에 바인딩된다.
// 🔑 즉, Built-In 생성자 함수의 프로토타입은 호출되는 시점 이전에 이미 객체화 되어 존재한다. (run-time 이전에 전역 객체가 생성되는 시점)
RegExp.prototype; // 해당 생성자 함수의 prototype은 이미 존재한다.

/**
 * 19-6. 객체의 생성 방식과 프로토타입의 결정
 *
 * 객체를 생성하는 방식은 다양하다.
 * 1. 객체 리터럴
 * 2. Object 생성자 함수
 * 3. 생성자 함수
 * 4. Object.create 메서드
 * 5. class
 *
 * 자바스크립트 엔진은 객체를 생성할 때, 내부 추상 연산(OrdinaryObjectCreate)을 호출하여 객체를 생성한다.
 * 이 연산은 객체의 프로토타입을 설정하고, 객체의 내부 속성인 [[Prototype]]은 설정된 프로토타입을 참조한다.
 * 즉, 각 객체의 프로토타입은 내부 추상 연산(OrdinaryObjectCreate)에 전달되는 인수에 의해 결정된다.
 */

// 19-6-1. 객체 리터럴에 의해 생성된 객체의 프로토타입
// 객체 리터럴로 객체를 생성할 때, OrdinaryObjectCreate를 호출하고 호출 시 매개변수로 전달되는 값은 Object.prototype이다.
// 즉, 객체 리터럴로 생성된 객체의 __proto__는 Object.prototype을 참조하고 있다.

// 객체 리터럴 방식으로 객체 생성
const literalObj = { x: 1 };

// 객체 리터럴로 생성된 객체는 Object.prototype을 상속받는다.
// 따라서, literalObj는 Object.prototype에 정의된 메서드들(`constructor`, `hasOwnProperty`)을 사용할 수 있다.
literalObj.constructor === Object; // true
literalObj.hasOwnProperty("x"); // true

// literalObj는 프로퍼티로 `constructor`와 `hasOwnProperty`를 가지고 있지 않다.
// 하지만, 프로토타입으로 `Object.prototype`을 상속받았기 때문에 이를 자유롭게 사용할 수 있다.
literalObj.hasOwnProperty("constructor"); // false
literalObj.__proto__ === Object.prototype; // true

// 19-6-2. Object 생성자 함수에 의해 생성된 객체의 프로토타입
// Object 생성자 함수로 객체를 생성할 때, OrdinaryObjectCreate를 호출하고 호출 시 매개변수로 전달되는 Object.prototype이다.
// 즉, Object 생성자 함수로 생성된 객체의 __proto__는 Object.prototype을 참조하고 있다.

// Object 생성자 함수를 호출하여 객체 생성
const objectObj = new Object();
objectObj.x = 1;

// 생성자 함수를 통해 생성된 객체는 Object.prototype을 상속 받는다.
// 따라서, 리터럴 방식으로 생성된 객체와 동일하게 Object.prototype에 정의된 메서드들을 사용할 수 있다.
objectObj.constructor === Object; // true
objectObj.hasOwnProperty("x"); // true

// objectObj 또한 프로퍼티로 `constructor`와 `hasOwnProperty`를 가지고 있지 않지만 `Object.prototype`을 상속받았기에 이를 자유롭게 사용할 수 있다.
objectObj.hasOwnProperty("constructor"); // false
objectObj.__proto__ === Object.prototype; // true

// 19-6-3. 생성자 함수에 의해 정의된 객체의 프로토타입
// new 연산자를 이용해 객체를 생성할 경우에도 OrdinaryObjectCreate를 호출한다.
// 다만 이때 전달되는 매개변수는 생성자 함수의 prototype 프로퍼티에 바인딩된 객체다.
// 즉, new 연산자를 이용한 사용자 정의 생성자 함수를 통해 생성된 객체의 프로토타입은 함수의 prototype 프로퍼티에 바인딩 된 객체로 결정된다.
function Carrier(name) {
  this.name = name;
}

const sk = new Carrier("SK Telecom");

// 사용자 정의 생성자 함수를 통해 생성된 객체는 함수 자체의 prototype 프로퍼티에 바인딩 된 객체를 상속받는다.
sk.constructor === Carrier; // true
sk.hasOwnProperty("name"); // true

// 생성된 객체의 프로토타입은 Carrier.prototype에 바인딩된 객체
Object.getPrototypeOf(sk); // Carrier { constructor: f Carrier(name) }

// `hasOwnProperty` 메서드는 `sk` 객체에 직접적으로 존재하지 않지만,
// `sk`의 프로토타입 체인 상에 존재하는 Object.prototype에서 상속받아 사용할 수 있다.
sk.hasOwnProperty("name"); // true

// 또한 프로토타입에 프로퍼티를 추가/삭제하여 미래에 생성될 인스턴스가 상속받도록 할 수 있다.
Carrier.prototype.getCompanyName = function () {
  return this.name;
};

// `Carrier` 생성자 함수를 통해 생성된 모든 객체는 프로토타입에 추가된 `getCompanyName`을 상속 받아 자신의 메서드처럼 사용할 수 있다.
const kt = new Carrier("kt");
kt.getCompanyName(); // kt

/**
 * 19-7. 프로토타입 체인
 *
 * 사용자 정의 생성자 함수에 의해 생성된 객체는 Object.prototype의 메서드인 `hasOwnProperty`를 사용할 수 있다.
 * 이는 사용자 정의 생성자 함수의 프로토타입뿐만 아니라, Object.prototype 또한 상속받았음을 의미한다.
 * 즉, 사용자 정의 생성자 함수의 프로토타입의 프로퍼티를 상속받은 객체는, 최종적으로 Object.prototype을 상속받게 된다.
 * 이처럼 객체가 여러 프로토타입을 거쳐 최종적으로 Object.prototype에 도달하는 구조가 만들어지며, 이를 프로타타입 체인이라 한다.
 *
 */

function Member(name) {
  if (!new.target) {
    return new Member(name);
  }

  this.name = name;
}

Member.prototype.getMemberName = function () {
  return this.name;
};

const jamie = new Member("Jamie");

// `hasOwnProperty`는 Object.prototype의 메서드이며, 이는 Object.prototype을 상속받았음을 의미한다.
jamie.hasOwnProperty("name"); // true

// `jamie` 객체의 프로토타입은 Member.prototype이다.
jamie.__proto__ === Member.prototype; // true
Object.getPrototypeOf(jamie) === Member.prototype; // true

// `Member.prototype`의 프로토타입은 Object.prototype 이다.
Object.getPrototypeOf(Member.prototype) === Object.prototype; // true

// 🔑 자바스크립트는 객체의 프로퍼티(메서드 포함)에 접근하려고 할 때 해당 객체에 접근하려는 프로퍼티가 없다면
// [[Prototype]] 내부 슬롯의 참조를 따라서 자신의 부모 역할을 하는 프로토타입의 프로퍼티를 순차적으로 검색한다.
// 이를 프로토타입 체인이라 하며 이는 자바스크립트가 객체지향 프로그래밍의 상속을 구현하는 메커니즘이다.
// 프로토타입의 최상위는 항상 Object.prototype이며 이를 프로토타입의 종점(end of prototype chain)이라 한다.
// 단 주의할 점은 프로타입의 종점에서도 접근하려는 프로퍼티가 없더라도 에러를 발생시키지 않고 undefined를 반환한다.

/**
 * 19-8. 오버라이딩과 프로퍼티 섀도잉
 *
 * 오버라이딩(Overriding)이란 상위 클래스에서 정의된 메서드를 하위 클래스에서 재정의하여 사용하는 방식이다.
 * 이를 통해 하위 클래스에서 상위 클래스의 메서드를 변경하거나 확장하여 사용할 수 있다.
 * 오버라이딩을 통해 기존의 상위 클래스가 가진 property가 하위 클래스에서 동일한 이름의 프로퍼티로 덮어씌워지는 현상을 말한다.
 * 즉, 하위 클래스에서 상위 클래스의 프로퍼티가 가려지거나 덮어지는 현상을 의미하며, 이를 프로퍼티 섀도잉(Property shadowing)이라 한다.
 *
 */

function Singer(name) {
  this.name = name;
}

// Singer 생성자 함수의 prototype에 `getSingerName` 메서드를 정의
Singer.prototype.getSingerName = function () {
  return this.name;
};

// Singer 생성자 함수를 통해 eminem 객체 생성
const eminem = new Singer("Eminem");

// eminem 객체에서 `getSingerName` 메서드를 오버라이딩 (섀도잉)
eminem.getSingerName = function () {
  return `The singer's name is ${this.name}`;
};

eminem.getSingerName(); // The singer's name is Eminem

// 또한 delete 키워드를 통해 프로퍼티를 삭제할 수도 있다.
delete eminem.getSingerName;

eminem.getSingerName(); // Eminem

// 단 주의할 점은 하위 클래스에서 상위 클래스의 프로퍼티(메서드)는 삭제할 수 없다.
// 즉, 하위 클래스에서 상위 클래스의 프로토타입에 get 엑세스는 허용되나 set 엑세스는 허용되지 않는다.
delete eminem.getSingerName;

// delete를 한 번 더 하더라도 상위 클래스의 메서드인 `getSingerName`은 삭제되지 않는다.
eminem.getSingerName(); // Eminem

// 프로토타입 프로퍼티를 변경 또는 삭제하려면 하위 객체를 통한 프토로타입 체인이 아닌 해당 객체의 프로토타입에 직접 접근해야 한다.
delete Singer.prototype.getSingerName; // 프로퍼티 삭제
Singer.prototype; // { constructor: f Singer(name) }

// 🔑 오버라이딩은 하위 클래스에서 상위 클래스의 메서드를 재정의하는 방법이다.
// 이때 프로퍼티 섀도잉이 발생하면, 상위 클래스의 프로퍼티가 하위 클래스에서 덮어씌워지거나 가려진다.
// 프로퍼티를 삭제할 때에도 하위 클래스에서 상위 클래스의 프로토타입 메서드는 절대 삭제할 수 없으며, 상위 클래스의 프로토타입에 직접 접근하여 삭제해야 한다는 점이다.
// 즉, 하위 클래스에서 상위 클래스의 메서드를 동일한 이름으로 재정의하여 변경, 확장하여 사용할 수 있지만(오버라이딩), 삭제할 수는 없다.

// ES6 class 키워드를 이용한 예제
class SingerSongWriter {
  // constructor(): 클래스 내에서 인스턴스를 초기화하는 메서드
  constructor(name) {
    this.name = name;
  }

  getSingerSongWriterName() {
    return this.name;
  }
}

class PopSingASongWriter extends SingerSongWriter {
  constructor(name) {
    // super(): 자식 클래스에서 부모 클래스의 생성자를 호출하는 메서드
    super(name);
    this.genre = "POP";
  }

  getSingerSongWriterName() {
    return `POP ` + this.name;
  }
}

const taylorSwift = new PopSingASongWriter("Taylor Swift");

// 클래스의 프로토타입에 직접 접근하여 삭제해야 한다. 하위 클래스에서는 메서드를 삭제할 수 없다.
delete PopSingASongWriter.prototype.getSingerSongWriterName;
delete SingerSongWriter.prototype.getSingerSongWriterName;

/**
 * 19-9. 프로토타입의 교체
 *
 * 프로토타입은 임의의 다른 객체로 변경할 수 있다.
 * 부모 객체인 프로토타입을 동적으로 변경할 수 있다는 것을 의미하며, 이러한 특징을 활용하여 객체 간의 상속을 동적으로 변경할 수 있다.
 * 즉, 프로토타입은 생성자 함수 또는 인스턴스에 의해 교체할 수 있다.
 *
 */

// 19-9-1. 생성자 함수에 의한 프로토타입의 교체
function Cigarette(name) {
  this.name = name;
}

// `Cigarette` 생성자 함수의 prototype을 객체 리터럴로 할당함
// 이는 생성자 함수가 미래에 생성할 인스턴스의 constructor 프로퍼티만 가지는 프로토타입을 객체 리터럴 형식으로 교체한 것이다.
// 상속 관계가 깨지기 때문에 객체 리터럴로 교체하면 constructor가 사라지게 된다.
// 즉, 프로토타입을 교체하게 되면 객체 인스턴스가 새로운 프로토타입을 참조하게 되어, 기존 프로토타입의 constructor가 새로운 프로토타입 객체로 덮어씌워지기 때문이다.
Cigarette.prototype = {
  getName() {
    return this.name;
  },
};

Cigarette.prototype; // { getName: f getName() }, constructor가 존재하지 않는다.

const marlboro = new Cigarette("marlboro");

marlboro.getName();

// prototype을 객체 리터럴로 교체 함으로 상속 관계가 깨짐
marlboro.constructor === Cigarette; // false
// marlboro의 constructor는 객체 리터럴 형식의 prototype인 Object를 참조하고 있다.
marlboro.constructor === Object; // true

// 상속 관계를 복원하기 위해서는 프로토타입을 할당하는 객체 리터럴에 명시적으로 constructor 프로퍼티를 추가하면 된다.
Cigarette.prototype = {
  constructor: Cigarette, // constructor를 명시적으로 추가하여 상속 관계 복원
  getName() {
    return this.name;
  },
};

Cigarette.prototype; // { constructor: f Cigarette(name), getName: f getName() }

// constructor를 추가하여 상속 관계 복원
marlboro.constructor === Cigarette; // true
marlboro.constructor === Object; // false

// 🔑 프로토타입을 객체 리터럴 형식으로 사용하는 이유는,
// 사용하게 될 프로토타입의 프로퍼티(메서드)들을 하나씩 정의하는 것보다 객체 리터럴을 통해 한 번에 정의할 수 있는 간편함 때문이다.
// 하지만 상속 관계가 깨지기 때문에 constructor를 명시적으로 기재해줘야 하는 번거로움이 있다.
// 이에 대한 해결책으로 간편하고 직관적인 class 키워드가 존재한다.

class Marlboro {
  constructor() {
    this.name = "marlboro";
  }

  getName() {
    return this.name;
  }
}

// extends 키워드를 이용하여 상속 관계를 손쉽게 유지할 수 있다.
class MarlboroMenthol extends Marlboro {
  constructor() {
    // 부모 class인 `Marlboro`의 name은 미래에 동적으로 생성할 인스턴스와 관계없이 이미 값이 정해져 있어서 인자가 필요하지 않다.
    // 즉, 부모 객체에서 고정된 값을 처리할 때 인자가 필요하지 않고 동적으로 변하는 값이라면 인자로 넣어줘야 한다.
    super();
    this.flavor = "menthol";
  }
}

const marlboroMenthol = new MarlboroMenthol();
marlboroMenthol.getName(); // marlboro

// 19-9-2. 인스턴스에 의한 프로토타입의 교체
function Champion(name) {
  this.name = name;
}

const gangplank = new Champion("Gangplank");
const gangplankPrototype = {
  getName() {
    return this.name;
  },
};

// `gangplank` 객체의 프로토타입을 `gangplankPrototype`으로 교체, 상속 관계가 파괴됨
// gangplank.__proto__ = gangplankPrototype
Object.setPrototypeOf(gangplank, gangplankPrototype);

gangplank.__proto__; // { getName: f getName() }, constructor가 존재하지 않는다.
gangplank.getName(); // Gangplank

// 프로토타입을 교체하였기 때문에 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴됨
gangplank.constructor === Champion; // false
// 프로토타입 체인을 따라 Object.prototype의 constructor 프로퍼티를 참조하고 있다.
gangplank.constructor === Object; // true

// 🔑 프로토타입을 교체할 때 생성자 함수의 프로퍼티를 통해  변경하는 것과 인스턴스(__proto__, setPrototypeOf)를 통해 변경하는 것은 차이가 없어 보인다.
// 하지만 두 가지 방식의 차이점은 미묘한 차이가 존재한다.
// 두 방식 모두 constructor가 사라지고 상속 관계가 파괴된다는 점은 동일하다.
// 하지만, 생성자 함수를 통해 변경할 때는 생성자 함수의 프로토타입 프로퍼티가 직접 프로토타입을 가리키고,
// 인스턴스를 통해 변경할 때는 생성자 함수의 프로토타입 프로퍼티는 프로토타입을 간접적으로 참조만 하게 된다.

// 상속 관계를 복원하기 위해서는 프로토타입을 할당하는 객체에 명시적으로 constructor 프로퍼티를 추가하면 된다.
const newGangplankPrototype = {
  ...gangplankPrototype,
  constructor: Champion,
};

// `Champion` 생성자 함수의 프로토타입을 `newGangplankPrototype` 변경
Champion.prototype = newGangplankPrototype;

// `gangplank` 객체의 프로토타입을 `newGangplankPrototype`으로 교체
Object.setPrototypeOf(gangplank, newGangplankPrototype);

gangplank.constructor === Champion; // true
gangplank.constructor === Object; // false
Champion.prototype === gangplank.__proto__; // true

// 🔑 프로토타입을 직접 변경하여 객체 간의 상속 관계를 변경하는 것은 매우 복잡하고 실수할 여지가 많다.
// 대신, ES6 `class` 키워드를 사용하면 상속 관계와 `constructor`를 자동으로 관리할 수 있어 훨씬 직관적이고 편리하다.

/**
 * 19-10. instanceOf 연산자
 *
 * instanceOf 연산자는 이항 연산자로 좌변에는 객체를 가리키는 식별자, 우변에는 생성자 함수를 가리키는 식별자를 피연산자로 받는다.
 * 우변의 피연산자는 항상 함수여야 하며, 함수가 아닌 값이 피연산자로 들어간다면 TypeError가 발생한다.
 *
 * 객체 instanceOf 생성자 함수(class 포함)
 *
 * 우변의 생성자 함수의 prototype에 바인딩된 객체가 좌변 객체의 프로토타입 체인 상에 존재하면 true, 아니라면 false로 평가된다.
 *
 */

function Animal(name) {
  this.name = name;
}

const dog = new Animal("Dog");

// `Animal.prototype`이 `dog`의 프로토타입 체인 상에 존재하므로 `true`로 평가된다.
dog instanceof Animal; // true
// `Object.prototype`이 `dog`의 프로토타입 체인 상에 존재하므로 `true`로 평간된다.
dog instanceof Object; // true

// 프로토타입을 교체할 경우, `Animal.prototype`을 객체 리터럴로 재할당 (상속 관계 파괴)
Animal.prototype = {};

// `Animal.prototype`을 재할당하고 `cat` 인스턴스 생성
const cat = new Animal("Cat");
// 상속 관계가 파괴되어 `constructor` 프로퍼티와 생성자 함수 간의 연결이 끊어짐
cat.constructor === Animal; // false

// ❗️ 주의.
// 상속 관계가 파괴되어 `constructor` 프로퍼티와 생성자 함수 간의 연결이 끊어지더라도 `instanceOf` 연산자는 영향을 받지 않는다.
// 즉, `Animal.prototype`을 교체하여 `constructor`가 사라져 상속 관계가 파괴되었지만, 프로토타입 체인 상에는 `Animal.prototype`이 존재한다.
cat instanceof Animal; // true
cat.__proto__ === Animal.prototype; // true

cat instanceof Object; // true
cat.__proto__.__proto__ === Object.prototype; // true

// 🔑 즉, `instanceOf` 연산자는 좌항의 객체의 프로토타입 체인 상에 우항의 생성자 함수(class 포함)의 프로토타입이 존재 여부만을 평가한다.

/**
 * 19-11. 직접 상속
 *
 * 프로토타입을 직접 상속할 때, `Object.create` 메서드 또는 객체 리터럴 내부에서 __proto__를 이용하는 방법이 있다.
 *
 */

// 19-11-1. `Object.create` 를 이용한 직접 상속
// `Object.create` 메서드의 첫 번째 매개변수는 생성할 객체의 프로토타입으로 지정할 객체를 전달한다.
// 두 번째 매개변수는 생성할 객체의 프로퍼티 키와 프로퍼티 디스크립터 객체로 이뤄진 객체를 전달한다.
// (두 번째 매개변수는 `Object.defineProperties` 메서드의 두 번째 인자와 동일하며 옵션이므로 생략 가능하다.)
// 즉, Object.create 메서드를 통해 객체를 생성할 때도 추상 연산(OrdinaryObjectCreate)이 호출되며,
// 이때 추상 연산의 인자로 Object.create 메서드의 첫 번째 인자가 전달된다.

// 첫 번째, 두 번째 인자를 생략할 경우 TypeError가 발생한다, 첫 번째 인자는 항상 객체 또는 null을 전달해야 한다.
// 만약 객체가 아닌 null을 전달하는 경우 프로토타입의 종점이 null이 된다.
const createdObj = Object.create(null);
Object.getPrototypeOf(createdObj); // null
Object.getPrototypeOf(createdObj) === null; // true
createdObj.__proto__; // undefined
createdObj instanceof Object; // false

// `Object.prototype`이 종점이 아니기 때문에 Object로부터 메서드들을 상속받을 수 없다.
// createdObj.toString(); // TypeError: createObj.toString is not a function at ~

// const createdObj2 = {}; 와 동일
const createdObj2 = Object.create(Object.prototype);
Object.getPrototypeOf(createdObj2) === Object.prototype; // true
createdObj2.__proto__ === Object.prototype; // true
createdObj2 instanceof Object; // true

// const createdObj3 = { x: 1 }; 과 동일
const createdObj3 = Object.create(Object.prototype, {
  x: { configurable: true, enumerable: true, value: 1, writable: true },
});

const tempProto = { x: 1 };
const createdObj4 = Object.create(tempProto);
createdObj4.__proto__ === tempProto; // true

function TempProto() {
  this.name = "Temporary Prototype";
}
const createdObj5 = Object.create(TempProto.prototype);
createdObj5.__proto__ === TempProto.prototype;
createdObj5.__proto__.__proto__ === Object.prototype;

// `Object.create` 메서드를 이용하면 프로토타입을 직접 설정하여 상속할 수 있다.
// 해당 메서드의 장점은 다음과 같다.
// 1. new 연산자 없이 객체를 생성할 수 있다.
// 2. 프로토타입을 지정하면서 동시에 객체를 생성할 수 있다.
// 3. 객체 리터럴에 의해 생성될 객체도 프로토타입을 직접 상속받을 수 있다.

// 프로토타입의 직접 상속으로 객체를 인자로 넘기는 경우, 집적 상속 받는 객체의 프로토타입이 `Object.prototype`으로 설정된다.
const createdObj6 = Object.create({});
createdObj6.__proto__; // {}
createdObj6.__proto__.__proto__ === Object.prototype; // true
createdObj6 instanceof Object; // true

// `Object.prototype`의 메서드들을 모두 사용할 수 있다.
createdObj6.hasOwnProperty("x"); // false

// 하지만 ESLint에서는 위의 예제와 같이 `Object.prototype`의 빌트-인 메서드를 객체가 직접 호출하는 것을 권장하지 않는다.
// 왜냐하면 `Object.create` 메서드는 프로토타입의 종점에 위치하는 객체를 생성할 수 있기 때문이다. (ex: null)
// 프로토타입의 종점에 위치하는 객체는 `Object.prototype`의 메서드들을 사용할 수 없기 때문이다.
const createdObj7 = Object.create(null); // prototype의 종점을 null로 설정
createdObj7.x = 1;
createdObj7; // {x: 1}, [[Prototype]] 내부 슬롯이 존재하지 않는다. 즉 __proto__로 접근이 불가능하다.
createdObj7.__proto__; // undefined
// createdObj7.hasOwnProperty("x"); // TypeError: createdObj7.hasOwnProperty is not a function at ~

// 따라서 직접 상속 받는 프로토타입 또는 바로 상위의 프로토타입이 `Object.prototype`이 아니라면 간접적으로 호출하는게 좋다.
Object.prototype.hasOwnProperty.call(createdObj7, "x"); // true

// 🔑 `Object.create`는 프로토타입을 명시적으로 설정하고자 할 때, 프로토타입 체인을 세밀하게 제어할 때 유용하다.
// null을 프로토타입으로 설정하여 상속 관계를 완전히 끊고, 단순한 속성만을 다룰 때도 좋다.
// 다만 대부분의 경우 객체 리터럴, 클래스, 생성자 함수가 더 직관적이고 간편하다.

// 19-11-2. 객체 리터럴 내부에서 __proto__에 의한 직접 상속
// ES6에서는 객체 리터럴 내부에서 `__proto__` 접근자 프로퍼티를 사용하여 직접 상속을 구현할 수 있다.

// 프로토타입으로 이용할 객체 선언
const testObjProto = {
  getNumberOne() {
    return 1;
  },
};

// 객체 리터럴 내부에서 `__proto__` 접근자 프로퍼티를 이용한 직접 상속
const testObj = {
  name: "Test-Object",
  __proto__: testObjProto,
};
Object.getPrototypeOf(testObj) === testObjProto; // true

// 위의 `__proto__`를 이용하여 직접 상속을 구현한 코드를 `Object.create`메서드를 이용하면 다음과 동일하다.
const testObj2 = Object.create(testObjProto, {
  name: {
    configurable: true,
    enumerable: true,
    value: "Test-Object",
    writable: true,
  },
});
Object.getPrototypeOf(testObj2) === testObjProto; // true

// 🔑 `__proto__` 접근자 프로퍼티는 ECMAScript5.1 이후 표준화되었지만, 사용을 권장하지 않는다.
// 성능상의 문제나 코드의 가독성 측면에서 사용하지 않는 것이 일반적이다.
// 프로토타입 체인을 세밀하게 제어할 필요가 있어 직접 상속을 구현해야 한다면 `Object.create`가 더 나은 선택이다.
// 다만, 꼭 프로토타입 체인을 세밀하게 제어할 필요가 없다면 자바스크립트가 암묵적으로 바인딩해주는 프로토타입을 사용하는 것이 직관적이고 편리하다.

/**
 * 19-12. 정적 프로퍼티/메서드
 *
 * 정적(static) 프로퍼티/메서드란,
 * 생성자 함수로 인스턴스를 생성하지 않아도 참조/호출할 수 있는 프로퍼티/메서드를 의미한다.
 * 함수는 일급 객체로 객체에 메서드/프로퍼티를 추가하여 참조/호출할 수 있는 말과 동일하다.
 * 즉, 정적 프로퍼티/메서드는 함수 객체에 추가한 프로퍼티/메서드를 말한다.
 * 이는 생성자 함수를 통해 생성한 미래의 인스턴스가 상속받을 프로토타입과는 다름을 의미하며,
 * 인스턴스는 함수 객체의 프로퍼티/메서드에 접근할 수 없고 오직 프로토타입 체인 상에 존재하는 프로퍼티/메서드만을 참조/호출할 수 있다.
 * 예를 들면 `Object.create` 는 정적 프로퍼티/메서드이고 `Object.prototype.hasOwnProperty`는 프로토타입 메서드이다.
 *
 */

// 생성자 함수
function Car(name) {
  this.name = name;
}

// 프로토타입 메서드
Car.prototype.getName = function () {
  return this.name;
};

// 정적 프로퍼티
Car.staticProp = "static prop";

// 정적 메서드
Car.staticMethod = function () {
  return "static method";
};

// 인스턴스 생성
const sm5 = new Car("SM5");

// 생성자 함수에 추가한 정적 프로퍼티/메서드는 생성자 함수로 참조/호출한다.
Car.staticMethod(); // static method

// ❗️ 정적 프로퍼티/메서드는 생성자 함수가 생성한 인스턴스로는 참조/호출할 수 없다.
// 즉, 인스턴스가 참조/호출할 수 있는 프로퍼티/메서드는 항상 프로토타입 체인 상에 존재해야만 한다.
// sm5.staticMethod(); // TypeError: sm5.staticMethod is not a function at ~

// 🔑 정적 프로퍼티/메서드란, 함수 객체에 추가한 프로퍼티/메서드를 의미한다.
// 이는 프로포타입의 프로퍼티 또는 프로토타입 체인 상에 추가한 것이 아닌 함수 객체 자체에 추가한 프로퍼티/메서드이다.
// 미래에 생성할 인스턴스와는 관계없이 오직 함수 자체만 호출할 수 있으며 인스턴스는 참조/호출할 수 없다.
// 생성된 인스턴스는 프로토타입 체인 상에 존재하는 프로퍼티/메서드만을 참조/호출할 수 있다.
// 즉, 정적 프로퍼티/메서드는 생성자 함수 자체에 정의되어 있고, 인스턴스에서는 접근할 수 없다.
// 반면, 프로토타입 메서드는 인스턴스에서 호출할 수 있다.

/**
 * 19-13. 프로퍼티 존재 확인
 *
 */

// 19-13-1. in 연산자
// `in` 연산자는 객체 내에 특정 프로퍼티가 존재하는지 여부를 확인한다.
// 문법: key in object

const monitorInfo = { brand: "SamSung" };

// `monitorInfo` 객체에 `brand` 프로퍼티 키가 존재함
"brand" in monitorInfo; // true

// `monitorInfo` 객체에 `asPeriod` 프로퍼티 키가 존재하지 않음
"asPeriod" in monitorInfo; // false

// ❗️ `in` 연산자는 객체의 프로퍼티 키뿐만 아니라 프로토타입 체인 상에 상속받은 프로토타입의 프로퍼티 키도 포함하기 때문에 주의가 필요하다.
"hasOwnProperty" in monitorInfo; // true (프로토타입 체인 상에서 상속받은 프로퍼티)

// `in` 연산자 대신에 ES6에서 도입된 `Reflect.has` 메서드를 이용할 수도 있다. (`in` 연산자와 동일, 프로토타입의 프로퍼티 키도 포함)
Reflect.has(monitorInfo, "brand"); // true
Reflect.has(monitorInfo, "asPeriod"); // false
Reflect.has(monitorInfo, "hasOwnProperty"); // true

// 19-13-2. Object.prototype.hasOwnProperty 메서드
Object.prototype.hasOwnProperty.call(monitorInfo, "brand"); // true

// `hasOwnProperty` 메서드의 장점은 프로토타입의 프로퍼티 키는 포함하지 않고, 객체의 고유한 프로퍼티 키만을 대상으로 삼는다는 점이다.
Object.prototype.hasOwnProperty.call(monitorInfo, "hasOwnProperty"); // false

// 🔑 객체의 고유한 프로퍼티 키의 존재를 확인할 때는 `in` 연산자보다는 `hasOwnProperty` 메서드를 사용하는 것이 좋다.
// `hasOwnProperty` 메서드는 프로토타입 체인 상의 프로퍼티는 포함하지 않고 객체 자체의 고유한 프로퍼티만 확인할 수 있다.
// 프로토타입 체인 상의 프로퍼티 키까지 확인하는 경우에만 `in` 연산자를 사용하는 것이 좋다.

/**
 * 19-14. 프로퍼티 열거
 *
 */

// 19-14-1. for...in 문
// 객체의 프로퍼티를 순회하며 처음부터 끝까지 열거(enumerable)한다.
// 문법: for 변수 선언문 in 객체
{
  // 객체 리터럴로 객체 선언, 해당 객체의 프로토타입은 `Object.prototype`이다.
  const personKim = {
    name: "Kim",
    address: "Seoul",
  };

  // `Object.prototype`에서 상속받은 프로토타입의 프로퍼티 `toString`
  "toString" in personKim; // true

  for (const key in personKim) {
    key; // name, address
    personKim[key]; // Kim, Seoul
  }

  // `for...in` 문 역시 `in` 연산자를 사용하기 때문에 객체의 고유한 프로퍼티뿐 아니라 프로토타입 체인 상의 모든 프로퍼티 키를 열거한다.
  // 하지만 `person` 객체의 프로토타입인  `Object.prototype`의 프로퍼티인 `toString`은 열거되지 않았다.
  // 이유는 `Object.prototype`의 모든 프로퍼티들은 프로퍼티 어트리뷰트인 `[[Enumerable]]`의 값이 `false`이기 때문이다.
  console.log(Object.getOwnPropertyDescriptors(Object.prototype));

  // `for...in` 문은 `[[Enumerable]]`의 값이 `true`인 프로퍼티에 한해 객체 고유의 프로퍼티뿐만 아니라 모든 프로토타입 체인 상의 프로퍼티를 열거한다.

  // `Object.create` 메서드를 이용해 프로토타입을 직접 상속하면 프로토타입의 프로퍼티인 `sayHello`가 열거된다. (`enumerable`의 값이 `true`이다)
  const personPark = Object.create(
    {
      sayHello() {
        console.log(`Hi, I'm ${this.name}`);
      },
    },
    {
      name: {
        configurable: true,
        enumerable: true,
        value: "Park",
        writable: true,
      },
    }
  );

  // `personPark.__proto__`에서 상속받은 프로토타입의 프로퍼티 `sayHello`
  "sayHello" in personPark; // true

  for (const key in personPark) {
    key; // name, sayHello
    personPark[key]; // Park, f sayHello() ~
  }

  // `for...in` 문을 통해 객체의 고유한 프로퍼티만을 열거하기 위해서는 `hasOwnProperty` 메서드를 활용
  for (const key in personPark) {
    // 객체의 고유 프로퍼티가 아닌 경우 `continue`
    if (!Object.prototype.hasOwnProperty.call(personPark, key)) {
      continue;
    }

    key; // name
    personPark[key]; // Park
  }

  // `Symbol` 함수로 정의된 심벌 키 또한 열거되지 않는다.
  const symbolKey = Symbol();
  const personDavid = {
    name: "David",
    [symbolKey]: "symbolKey",
  };

  for (const key in personDavid) {
    key; // name
    personDavid[key]; // David
  }

  // `for...in` 문은 숫자(실제로는 문자)에 대해서는 순서를 보장하지 않고 정렬한다.
  const alphabet = {
    2: 2,
    1: 1,
  };

  for (const key in alphabet) {
    if (Object.prototype.hasOwnProperty.call(alphabet, key)) {
      key; // 1, 2
    }
  }

  // ❗️ 배열도 객체이기 때문에 `for...in` 문을 사용할 수 있다. 하지만 권장하지 않는다.
  // `for`, `for...of`, `forEach`를 권장한다.
  const arr = [1, 2, 3];
  arr.x = 4;
  arr; // [1, 2, 3, x: 4]

  // 배열에서 `for..in` 문은 변수에 `index`를 할당한다.
  for (const key in arr) {
    if (Object.prototype.hasOwnProperty.call(arr, key)) {
      key; // 0, 1, 2, x
      arr[key]; // 1, 2, 3, 4
    }
  }

  // `for...of` 문은 프로퍼티를 제외하고 변수에 값을 할당한다.
  for (const value of arr) {
    value; // 1, 2, 3
  }

  // 🔑 `for...in` 문은 객체 고유의 프로퍼티와 프로토타입 체인 상의 프로퍼티 중 `[[Enumerable]]`의 값이 `true`인 모든 프로퍼티들을 열거한다.
  // 객체 고유의 프로퍼티를 열거할 땐 `hasOwnProperty`메서드를 같이 활용하는 것이 좋다.
  // 단, 배열에서는 사용하지 않는 것을 권장하며 배열의 경우에는 `for...of` 문 또는 `forEach` 메서드를 활용하는 것이 좋다.
}
