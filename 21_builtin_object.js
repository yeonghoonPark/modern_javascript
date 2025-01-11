"use strict";

/**
 * 21-1. 자바스크립트 객체의 분류
 *
 * 자바스크립트 객체는 크게 3가지로 분류할 수 있다.
 *
 * 1. 표준 빌트인 객체(standard built-in objects)
 *  ECMAScript 사양에 정의된 객체를 의미한다.
 *  표준 빌트인 객체는 실행 환경이 브라우저이든 노드이든 관계없이 언제나 사용할 수 있다.
 *    👉 `Object`, `Number`, `String`...
 *
 * 2. 호스트 객체(host objects)
 *  ECMAScript 사양에 정의되어 있지 않는 객체를 의미한다.
 *  하지만, 자바스크립트 실행 환경(브라우저 또는 노드)에 따라 추가로 제공되는 객체를 의미한다.
 *  ✅ 브라우저 환경
 *    👉 `DOM`, `BOM`, `Canvas`, `XMLHttpRequest`, `fetch`, `requestAnimationFrame` 등의 클라이언트 사이드 Web API
 *  ✅ 노드 환경
 *    👉 `process`, `global`, `__dirname`, `__filename`, `require` 등의 노드 고유의 API
 *
 * 3. 사용자 정의 객체(user defined objects)
 *  사용자 정의 객체는 표준 빌트인 객체와 호스트 객체처럼 실행 환경에 따라 제공되는 객체가 아닌 사용자가 직접 정의 객체를 의미한다.
 *
 */

/**
 * 21-2. 표준 빌트인 객체
 *
 * 표준 빌트인 객체 중 `Math`, `Reflect`, `JSON`을 제외하면 모두 인스턴트를 생성할 수 있는 생성자 함수이다.
 * 생성자 함수인 표준 빌트인 객체는 프로토타입 메서드(인스턴트에서 호출)와 정적 메서드(객체 자체에서 호출)를 제공하고,
 * 생성자 함수가 아닌 표준 빌트인 객체는 정적 메서드만을 제공한다.
 *
 * 🔑 프로토타입 메서드는 인스턴트에서 호출, 정적 메서드는 객체 자체에서 호출하는 메서드를 의미한다.
 *
 */

// 예를 들어 표준 빌트인 객체인 `String`, `Number`, `Boolean`, `Array`, `Date` 등은 생성자 함수로 호출하여 인스턴트를 생성할 수 있다.
{
  const strObj = new String("a"); // String {'a'}
  typeof strObj; // object

  const numObj = new Number(1); // Number {1}
  typeof numObj; // object

  const boolObj = new Boolean(true); // Boolean {true}
  typeof boolObj; // object

  const arrObj = new Array(1, 2, 3); // (3) [1, 2, 3]
  typeof arrObj; // object

  const dataObj = new Date(); // Sat Jan 11 2025 20:50:24 GMT+0900 ~
  typeof dataObj; // object ❗️ `new` 키워드가 없다면 `string` 타입이 된다.
}

// 생성자 함수인 표준 빌트인 객체가 생성한 인트턴트의 프로토타입은 표준 빌트인 객체의 `prototype` 프로퍼티에 바인딩된 객체다.
// 즉, 생성된 인스턴트는 다양한 기능의 프로토타입 메서드를 사용할 수 있다.
{
  const numObj = new Number(1.5); // Number {1.5}
  Object.getPrototypeOf(numObj) === Number.prototype; // true
  numObj.__proto__ === Number.prototype; // true (ES6 이후에는 `__proto__` 접근자 프로퍼티 사용을 지양하는 것이 좋다)

  // `toFixed` 는 `Number.prototype`의 메서드이다.
  numObj.toFixed(); // 2
  // ❗️ `prototype` 메서드는 객체 자체에서 호출할 수 없다.
  // Number.toFixed(); // TypeError: Number.toFixed is not a function at ~

  // `isInteger`는 `Number` 객체 자체의 정적 메서드이다.
  Number.isInteger(numObj.valueOf()); // false
  // ❗️ 정적 메서드는 인스턴트에서는 호출할 수 없다.
  // numObj.isInteger(1.5); // TypeError: numObj.isInteger is not a function at ~
}
