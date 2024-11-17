"use strict";

// Internal Slot (내장 슬롯)
//
// 자바스크립트 엔진 내부에서 사용되는 숨겨진 저장 공간이다. 이 슬롯은 외부에서는 직접 접근할 수 없으며, 객체의 상태를 저장하는데 사용된다.
// 단, 직접 접근할 수 없지만 일부 슬롯과 메서드들은 간접적으로 확인할 수 있는 수단(__proto__, Object.getOwnPropertyDescriptors()...)을 제공한다.
// ex: length, [[Prototype]], [[Value]], [[Configurable]], [[Writable]], [[Enumerable]]

// Internal Methods (내장 메서드)
//
// 자바스크립트 엔진 내부에서 특정 동작을 수행하기 위해 사용되는 메서드이다. 이 메서드들도 외부에서 직접 호출할 수 없다.
// ex: [[Get]], [[Set]], [[Has]], [[Call]], [[Construct]]...and so on

// Data Properties (데이터 프로퍼티)
//
// 상태를 나타내는 내장 슬롯의 [[Value]], [[Configurable]], [[Writable]], [[Enumerable]]의 value, configurable, writable, enumerable을 가지는 property이다.

// Accessor Properties (접근자 프로퍼티)
//
// 자체적으로 값을 가지지 않으며, 데이터 프로퍼티의 값을 읽거나 저장할 때 호출되는 Accessor function(접근자 함수)로 구성되어있다.
// 객체의 특정 동작을 수행하기 위한 메서드인 [[Get]], [[Set]]의 get, set을 가지는 property이다.

const person = {};

Object.defineProperties(person, {
  firstName: {
    configurable: true,
    enumerable: true,
    value: "Max",
    writable: true,
  },

  fullName: {
    configurable: true,
    enumerable: true,
    get() {
      return this.firstName + " " + this.lastName;
    },
    set(name) {
      [this.firstName, this.lastName] = name.split(" ");
    },
  },

  lastName: {
    configurable: true,
    enumerable: true,
    value: "Jason",
    writable: true,
  },
});

person.fullName = "YoungHun Park";

let descriptors = Object.getOwnPropertyDescriptors(person);

console.log("👉 ~ descriptors: ", descriptors);
console.log("👉 ~ person: ", person);
console.log("👉 ~ Object.keys(person): ", Object.keys(person));
console.log("👉 ~ Object.values(person): ", Object.values(person));

// Uncaught TypeError, because "writable" is false
// person.lastName = "Nicolas";

// Uncaught TypeError, because "configurable" is false
// delete person.lastName;

// Uncaught TypeError, because "configurable" is false
// Object.defineProperty(person, "lastName", {
//   enumerable: true,
// });

// 객체 확장 금지, Object.preventExtensions()
// property attribute configure: O
// property delete: O
// property extension: X
// property read: O
// property write: O
const preventedExtensionsObj = Object.preventExtensions({
  name: "Olivia",
});

const isExtensible = Object.isExtensible(preventedExtensionsObj);
console.log("👉 ~ isExtensible: ", isExtensible); // false

// 객체 밀봉, Object.seal()
// property attribute configure: X
// property delete: X
// property extension: X
// property read: O
// property write: O
const sealedObj = Object.seal({
  name: "Olivia",
});

const isSealed = Object.isSealed(sealedObj);
console.log("👉 ~ isSealed: ", isSealed); // true

const sealedObjDescriptors = Object.getOwnPropertyDescriptors(sealedObj);
console.log("👉 ~ sealedObjDescriptors: ", sealedObjDescriptors);

// Uncaught TypeError: Cannot redefine property: name at Function.defineProperty
// Object.defineProperty(sealedObj, "name", { configurable: true });

sealedObj.name = "Jason";
console.log("👉 ~ sealedObj: ", sealedObj); // { name: 'Jason' }

// 객체 동결, Object.freeze()
// property attribute configure: X
// property delete: X
// property extension: X
// property read: O
// property write: X
const frozenObj = Object.freeze({
  name: "Olivia",
  age: [35, 37],
});

const isFrozenObj = Object.isFrozen(frozenObj);
console.log("👉 ~ isFrozenObj: ", isFrozenObj);

// Uncaught TypeError
// frozenObj.name = "Max";

frozenObj.age[0] = 100; // 객체의 프로퍼티 밸류가 레퍼런스 타입일 경우, freeze되지 않는다, 이때는 deep freeze를 사용해야 한다.

console.log("👉 ~ frozenObj: ", frozenObj);

// 깊은 객체 동결
const deepFreeze = (obj) => {
  if (obj && typeof obj === "object" && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    Object.keys(obj).forEach((key) => deepFreeze(obj[key]));
  }

  return obj;
};

const deepFrozenObj = deepFreeze({
  name: "Olivia",
  address: { city: "Seoul" },
});

const deepFrozenObjDescriptors =
  Object.getOwnPropertyDescriptors(deepFrozenObj);
console.log("👉 ~ deepFrozenObjDescriptors: ", deepFrozenObjDescriptors);

const isDeepFrozen = Object.isFrozen(deepFrozenObj.address);
console.log("👉 ~ isDeepFrozen: ", isDeepFrozen);

// Uncaught TypeError: Cannot assign to read only property
// deepFrozenObj.address = "California";
