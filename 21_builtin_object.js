// "use strict";

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

/**
 * 21-3. 원시값과 래퍼 객체
 *
 * 문자열, 숫자, 불리언 등의 원시값이 있는데 `String`, `Number`, `Boolean`과 같은 표준 빌트인 객체는 왜 존재할까?
 * 기본적으로 원시값은 객체가 아니기 때문에 프로퍼티나 메서드를 가질 수 없다.
 * 하지만, 원시값을 사용할 때 메서드를 사용한 경험이 있을 것이다.
 * 원시값에 대해 객체에 접근하는 방법처럼 `.`, `[]`을 사용하면 자바스크립트 엔진이 원시값을 연관된 객체로 변환해 주기 때문이다.
 * 자바스크립트 엔진은 암묵적으로 연관된 객체를 생성하여 객체의 프로퍼티에 접근하거나 메서드를 호출하고 다시 원시값으로 되돌린다.
 * 이때 문자열, 숫자, 불리언 값에 대해 객체처럼 접근하면 생성되는 임시 객체를 래퍼 객체(wrapper object)라고 한다.
 *
 */

// 문자열
{
  const str = "a";

  // 원시타입인 문자열이 래퍼 객체인 `String` 인스턴스를 생성하고 원시값을 감싸서 메서드를 실행한다.
  // 이때 [[StringData]] 내부 슬롯은 `String` 인스턴스를 참조한다.
  str.length; // 1
  str.toUpperCase(); // 'A'

  // 래퍼 객체로 프로퍼티에 접근하거나 메서드를 호출한 후, 다시 원시값으로 되돌린다. ([[StringData]] 슬롯은 원시값 `str`을 참조한다.)
  // 이때 생성되었던 인스턴스는 무엇에도 참조되지 않는 상태로 가비지 컬렉션의 대상이 된다.
  typeof str; // string
}

// 숫자
{
  const num = 1.5;

  // 원시타입인 숫자가 래퍼 객체인 `Number` 인스턴스를 생성하고 원시값을 감싸서 메서드를 실행한다.
  // 이때 [[NumberData]] 내부 슬롯은 `Number` 인스턴스를 참조한다.
  num.toFixed(); // 2

  // 래퍼 객체로 프로퍼티에 접근하거나 메서드를 호출한 후, 다시 원시값으로 되돌린다. ([[NumberData]] 슬롯은 원시값 `num`을 참조한다.)
  // 이때 생성되었던 인스턴스는 무엇에도 참조되지 않는 상태로 가비지 컬렉션의 대상이 된다.
  typeof num; // number
}

// 불리언도 마찬가지이지만 불리언 값으로 메서드를 호출하는 경우는 거의 없다.
// ❗️ ES6에서 추가된 `Symbol`도 래퍼 객체를 생성한다. 다만, `Symbol`은 생성자 함수가 아닐뿐더러 리터럴 표기법으로 생성할 수 없다.
// `Symbol`은 `new` 키워드를 통해 생성자 함수로 호출이 불가능하며, `Symbol` 함수로만 생성이 가능하다.

// 🔑 원시값 중 문자열, 숫자, 불리언, 심볼은 래퍼 객체를 생성하며 이외의 원시값인 `null`, `undefined`는 래퍼 객체를 생성하지 않는다.
// 따라서 `null`과 `undefined`를 객체로 변환되지 않으며, 이 값들로 프로퍼티나 메서드를 호출하면 에러가 발생한다.

/**
 * 21-4. 전역 객체
 *
 * 전역 객체는 코가 실행되는 런-타임 이전 단계에 자바스크립트 엔진에 의해 어떤 객체보다도 먼저 생성되는 특수한 객체다.
 * 전역 객체는 어떤 객체에도 속하지 않는 최상위 객체다.
 * 전역 객체는 자바스크립트 실행 환경에 따라 지칭하는 이름이 다르다.
 * 브라우저 환경에서는 `window`, `this`, `self`, `frames`가 전역 객체를 가리키지만,
 * 노드 환경에서는 `global`이 전역 객체를 가리킨다.
 *
 * 전역 객체는 아래의 프로퍼티를 갖는다. (🔑 아래 3가지는 런-타임 이전에 생성된다는 의미를 가진다)
 * 1. 표준 빌트인 객체(`String`, `Number`, `Array` 등)
 * 2. 실행 환경(브라우저 또는 노드)에 따른 호스트 객체
 * 3. `var` 또는 `function` 키워들을 이용한 전역 변수와 전역 함수
 *
 * 즉, 전역 객체는 계층적 구조상 어떤 객체에도 속하지 않는 최상위 객체다.
 *
 */

// 전역 객체의 특징

// 1. 개발자가 의도적으로 생성할 수 없다. 즉, 전역 객체를 생성하는 생성자 함수를 제공하지 않는다.

// 2. 프로퍼티를 참조할 때 생략할 수 있다.
window.location === location; // true

// 3. 모든 표준 빌트인 객체를 프로퍼티로 가지고 있다.
window.Object === Object; // true
Object.prototype.hasOwnProperty.call(window, "Object"); // true

// 4. 실행 환경에 따라 추가적인 프로퍼티와 메서드를 갖는다.
// 브라우저의 경우, `document`, `DOM`, `BOM`, `Canvas`, `requestAnimationFrame`, `fetch` 등
// 노드의 경우, `fs`, `path` 등

// 5. `var` 키워드로 선언한 변수와 선언하지 않은 변수에 값을 할당한 암묵적 전역, 그리고 `function` 키워드를 이용한 전역 함수는 전역 객체의 프로퍼티가 된다.
// 전역 변수
var foo = 1;
window.foo === foo; // true

// 암묵적 전역 (스트릭트 모드가 아닐 경우, 스트릭트 모드라면 에러가 발생한다.)
// 여기서 `bar`는 전역 변수가 아닌 전역 객체의 프로퍼티가 된다.
bar = 2;
window.bar === bar; // true

// 전역 함수
function baz() {
  return 1;
}
window.baz(); // 1
window.baz === baz; // true

// `let` 또는 `const` 키워드를 이용한 변수나 함수는 전역 객체의 프로퍼티가 아니다. (블록 스코프)
let quz = 1;
window.quz; // undefined

const qux = () => 2;
window.qux; // undefined

// 브라우저 환경의 모든 자바스크립트 코드는 하나의 전역 객체를 공유한다.
// 여러개의 <script> 태그를 통해 코드를 분리해도 하나의 전역 객체를 공유함은 변함이 없다.
// 이는 분리된 모든 <script> 태그가 하나의 전역 객체를 공유한다는 의미다.
