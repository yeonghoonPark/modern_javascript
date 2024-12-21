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

// 위의 `ConstructFunc` 함수의 프로퍼티인 프로토타입은 객체이며 생성 시점에는 constructor 프로퍼티만 가지는 객체이다. (나중에 추가할 수 있다)
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
// new 연산자를 이용해 객체를 생성할 경우에도 OrdinaryObjectCreate를 호출한다. 다만 이때 전달되는 매개변수는 생성자 함수의 prototype 프로퍼티에 바인딩된 객체다.
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
Object.getPrototypeOf(jamie) === Member.prototype; // true

// `Member.prototype`의 프로토타입은 Object.prototype 이다.
Object.getPrototypeOf(Member.prototype) === Object.prototype; // true

// 🔑 자바스크립트는 객체의 프로퍼티(메서드 포함)에 접근하려고 할 때 해당 객체에 접근하려는 프로퍼티가 없다면
// [[Prototype]] 내부 슬롯의 참조를 따라서 자신의 부모 역할을 하는 프로토타입의 프로퍼티를 순차적으로 검색한다.
// 이를 프로토타입 체인이라 하며 이는 자바스크립트가 객체지향 프로그래밍의 상속을 구현하는 메커니즘이다.
// 프로토타입의 최상위는 항상 Object.prototype이며 이를 프로토타입의 종점(end of prototype chain)이라 한다.
