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
 *    👉 `fs`, `path` 등의 노드 고유의 API
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
 * 전역 객체는 코드가 실행되는 런-타임 이전 단계에 자바스크립트 엔진에 의해 어떤 객체보다도 먼저 생성되는 특수한 객체다.
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

// 21-4-1. 빌트인 전역 프로퍼티
// 빌트인 전역 프로퍼티는 전역 객체의 프로퍼티를 의미한다.

// 👉 Infinity
// `Infinity` 프로퍼티는 무한대를 나타내는 숫자값 `Infinity`를 갖는다.
window.Infinity === Infinity; // true
typeof Infinity; // number

// 👉 NaN
// `NaN` 프로퍼티는 숫자가 아님을 나타내는 숫자값 `NaN`을 갖는다. `NaN`은 `Number.NaN`과 같다.
// ❗️ 주의할 점은 `NaN`은 다른 값들과도 비교할 때 항상 `false`를 반환하는 특성을 가진다. 즉, `NaN`은 자기 자신과도 동일하지 않다는 규칙을 가지고 있다.
// 특히 `NaN`을 확인하려면 전역 객체의 함수인 `isNaN` 또는 빌트인 객체의 프로퍼티인 `Number.isNaN`을 사용해야 한다.
// `isNaN`은 타입 변환 없이 `NaN` 값만 확인하는 반면 `Number.isNaN`은 정확히 `NaN`인지 판별한다.
window.NaN === Number.NaN; // false
typeof NaN; // number
isNaN(NaN); // true

// 👉 undefined
// `undefined` 프로퍼티는 원시 타입 `undefined`를 값으로 갖는다.
window.undefined === undefined; // true
typeof undefined; // undefined

// 21-4-2. 빌트인 전역 함수
// 빌트인 전역 함수는 전역 객체의 메서드를 의미한다.

// 👉 eval
// `eval` 메서드는 자바스크립트 코드를 나타내는 문자열을 인수로 전달받는다.
// 인수로 전달받은 표현식 또는 코드(문)는 런-타임에 값을 생성하거나 실행한다.

eval("1 + 2"); // 3

eval("var five = 5"); // undefined
five; // 5, `eval` 메서드에 의해 런-타임에 변수 선언문이 실행되어 `z` 변수가 선언됨

eval("var evalObj = ({a: 1})");
evalObj; // {a: 1}, 객체 리터럴은 ()안에 있어야 한다.

eval("var evalFunc = (function (){return evalObj})");
evalFunc(); // {a: 1}, 함수 리터럴도 ()안에 있어야 한다.

// `eval` 메서드는 자신이 호출된 위치에 해당하는 기존의 스코프를 런-타임에 동적으로 수정한다.
{
  const x = 1;

  function evalFoo() {
    // `eval` 메서드는 런-타임에 `evalFoo` 함수의 스코프를 동적으로 수정한다.
    // 즉, `evalFoo` 함수 안에서 사용된 `x`는 `var` 키워드로 선언된 `x` 이다.
    // 단 스트릭트 모드 또는 `let`, `const` 키워드를 사용하면 기존의 스코프를 수정하지 않고 `eval` 메서드 자체적인 스코프를 사용하기 때문에 `x`는 `const` 키워드를 이용한 `x`가 된다.
    eval("var x = 2");
    x; // 2, `var` 키워드를 이용해 선언된 `x`
  }

  evalFoo();
  x; // 1, `const` 키워드를 이용해 선언된 `x`
}

// ❗️ `eval` 메서드를 통해 사용자로부터 입력받은 콘텐츠를 실행하는 것은 보안에 매우 취약하다.
// 또한 `eval` 메서드는 자바스크립트 엔진에 의해 최적화가 수행되지 않아 일반적인 코드에 비해 실행 속도가 매우 느리다.
// 즉, 보안 취약, 디버깅과 코드 실행의 예측 불가, 성능 저하 등의 문제로 `eval` 함수는 절대적으로 사용하지 않아야 한다.

// 👉 isFinite
// `isFinite` 메서드는 전달받은 인수가 유한수인지 무한수인지 구분하여 유한수라면 `true`, 무한수라면 `false`를 반환한다.
// 자바스크립트 엔진에 의해 전달받은 인수를 숫자 타입으로 암묵적으로 변환하여 구분하며, 이때 인수가 `NaN`일 경우 `false`를 반환한다.

// 유한수
isFinite(0); // true
isFinite(2e72); // true
isFinite("10"); //  true, 암묵적 타입 변환 후 평가
isFinite(null); // true, `null`은 암묵적 타입 변환으로 0이 된다.

// 무한수
isFinite(Infinity); // false
isFinite(-Infinity); // false

// NaN
isFinite(NaN); // false
isFinite("a"); // false
isFinite(Date()); // false

// 👉 isNaN
// `isNaN` 메서드는 전달받은 인수가 `NaN`인지 구분하여 불리언값을 반환한다.
// 자바스크립트 엔진에 의해 전달받은 인수를 숫자 타입으로 암묵적으로 변환하여 구분한다.

// number
isNaN(NaN); // true
isNaN(10); // false

// string
isNaN("a"); // true
isNaN("1"); // false
isNaN("1.5"); // false
isNaN(""); // false, 빈 문자열은 암묵적 타입 변환으로 0이 된다.
isNaN(" "); // false, 빈 문자열은 암묵적 타입 변환으로 0이 된다.

// boolean
isNaN(true); // false
isNaN(false); // false

// null
isNaN(null); // false, `null`은 암묵적 타입 변환으로 0이 된다.

// undefined
isNaN(undefined); // true, `undefined`는 암묵적 타입 변환으로 `NaN`이 된다.

// object
isNaN({}); // true, `NaN`

// date
isNaN(new Date()); // false, `new Date()`로 반환된 객체는 암묵적 타입 변환으로 `number`타입이 된다.
isNaN(new Date().toString()); // true, string

// 👉 parseFloat
// `parseFloat` 메서드는 전달받은 인수를 부동 소수점 숫자, 즉 실수로 해석하여 숫자로 반환한다.

// 문자열을 실수로 해석하여 반환한다.
parseFloat("3.14"); // 3.14
parseFloat("1.00"); // 1

// 공백으로 구분된 문자열은 첫 번째 문자열만 반환한다.
parseFloat("10 20 30"); // 10
parseFloat("40 years"); // 40

// 첫 번째 문자열이 파싱한 결과가 숫자가 아니라면 `NaN`을 반환한다.
parseFloat("price 10 $"); // NaN

// 앞 뒤 공백은 무시된다.
parseFloat(" 100.00 "); // 100

// 👉 parseInt
// `parseInt` 메서드는 전달받은 인수를 정수로 해석하여 반환한다.
// 첫 번째 인수는 문자열, 두 번째 인수는 진수를 나타내는 기수이다. (2 ~ 36진수, 기본: 10진수)

// 문자열을 정수로 해석하여 반환한다.
parseInt("1"); // 1
parseInt("1.00"); // 1

// 공백으로 구분된 문자열은 첫 번째 문자열만 반환한다.
parseInt("10 20 30"); // 10
parseInt("40 years"); // 40

// 첫 번째 문자열이 파싱한 결과가 숫자가 아니라면 `NaN`을 반환한다.
parseInt("price 10 $"); // NaN

// 앞 뒤 공백은 무시된다.
parseInt(" 100.00 "); // 100

// "10"을 10진수로 해석하고 그 결과를 10진수 정수로 반환한다.
parseInt("10"); // 10
// "10"을 2진수로 해석하고 그 결과를 10진수 정수로 반환한다.
parseInt("10", 2); // 2
// "10"을 8진수로 해석하고 그 결과를 10진수 정수로 반환한다.
parseInt("10", 8); // 8
// "10"을 16진수로 해석하고 그 결과를 10진수 정수로 반환한다.
parseInt("10", 16); // 16

// 📖 `URI`란?
// Uniform Resource Identifier의 약자로 인터넷상의 자원을 식별하는 고유한 문자열(주소)을 의미한다.
// `URI`의 하위 개념으로는 `URL`과 `URN`이 있으며, `URI`는 이 두 가지를 포함한 상위 개념이다.

// 📖 `URL`이란?
// Uniform Resource Locator의 약자로 인터넷상의 자원 중 위치를 지정하는 `URI`의 하위 개념이다.
// `URL`은 프로토콜, 호스트, 포트, 경로 등을 포함하며 자원에 접근하기 위한 주소를 제공한다.
// 예: `https://www.mydomain.com:80/docs/search?category=javascript&lang=ko#into`
// 1. Protocol(Scheme): `https:`(보안된 HTTP), `http:`(보안이 없는 HTTP), `ftp:`(파일 전송 프로토콜), `mailto:`(이메일 프로토콜)
// 2. Host(Domain): `www.mydomain.com`
// 3. Port: `:80`(HTTP 기본 포트), `:443`(HTTPS 기본 포트), `:8080`(일반적으로 개발 서버에서 사용)
// 3. Path: `/docs/search` (디렉토리 구조)
// 4. Query: `?category=javascript&lang=ko` (? 뒤에 오는 키=값)
// 5. Fragment: `#into` (서버로 전달되지 않고 브라우저에서 처리되며 페이지내 특정 위치로 이동하기 위한 부분, 스크롤 되거나 해당 컨텐츠로 이동)

// 📖 `URN`이란?
// Uniform Resource Name의 약자로 인터넷상의 자원의 위치를 알 필요 없이, 자원의 고유한 이름을 통해 해당 자원을 식별하는 `URI`의 하위 개념이다.
// `URN`은 영구적인 식별자로 해당 자원의 위치가 변경되더라도 동일한 `URN`을 사용하여 자원을 식별할 수 있다.
// 예: `urn:isbn:0451450523`

// 📖 `escape processing`이란?
// 특수 문자나 공백 문자를 다른 문자로 변환하여 문자열을 안전하게 처리 또는 특정 규약에 맞게 변환하는 작업을 의미한다.
// 이는 특수 문자를 보호하고 공백을 변환하여 안전한 전송을 이루기 위함이다.
// 예를 들어 `#`, `&`, `?`, `=` 등의 여러 특수 문자는 `fragment`, `and`, `query`, `equal`과 같은 예약된 의미가 있다.
// 이때, 데이터가 올바르게 해석되고 정상적으로 전달되도록 공백은 `%20`으로, 앰퍼샌드는 `%26`과 같이 변환하는 작업을 `escape processing`이라 한다.

// 👉 encodeURI / decodeURI
// `encodeURI` 메서드는 완전한 `URI`를 문자열로 전달받아 이스케이프 처리를 위해 인코딩한다.
// `decodeURI` 메서드는 완전한 `URI`를 문자열로 전달받아 이스케이프 이전으로 처리하기 위해 디코딩한다.
{
  // URL 문자열
  const YOUTUBE_URL = `https://www.youtube.com/results?search_query=best+of+funny+&+영상`;

  // `encodeURI` 메서드는 문자열을 인자로 받아 이스케이프 처리를 위해 인코딩한 문자열을 반환한다.
  const encodedURL = encodeURI(YOUTUBE_URL); // https://www.youtube.com/results?search_query=best+of+funny+&+%EC%98%81%EC%83%81

  // `decodeURI` 메서드는 이스케이프 처리된 문자열을 인자로 받아 이스케이프 처리 이전으로 디코딩한 문자열을 반환한다.
  const decodedURL = decodeURI(encodedURL); // https://www.youtube.com/results?search_query=best+of+funny+&+영상
}

// 👉 encodeURIComponent / decodeURIComponent
// `encodeURIComponent` 메서드는 `URI`의 구성 요소만을 인자로 전달받아 이스케이프 처리를 위해 인코딩한다.
// `decodeURIComponent` 메서드는 `URI`의 구성 요소만을 인자로 전달받아 이스케이프 이전으로 처리하기 위해 디코딩한다.
// ❗️ `encodeURI / decodeURI` 메서드와 다른 점은 인자로 전달받은 문자열을 `URI`의 구성요소인 쿼리 파라미터 값, 경로의 일부를 간주한다.
// 따라서 ?", "=", "&", "/", "#" 모두 인/디코딩한다.
// 즉,
// `encodeURI / decodeURI`는 `URI` 전체를 다룰 때, "?", "=", "&"는 그대로 두고, 다른 특수 문자들만 인/디코딩한다.
// `encodeURIComponent / decodeURIComponent`는 `URI` 구성 요소를 다룰 때, "?", "=", "&", "/", "#" 포함, 다른 특수 문자 모두 인/디코딩한다.
{
  const query = "best+of+funny & 영상";

  // `encodeURIComponent` 메서드는 문자열을 인자로 받아 이스케이프 처리할 때, "?", "=", "&", "/", "#" 를 포함한 모든 특수 문자열을 인코딩해 반환한다.
  const encodedComponent = encodeURIComponent(query); // best%2Bof%2Bfunny%20%26%20%EC%98%81%EC%83%81

  // `decodeURIComponent` 메서드는 이스케이프 처리된 문자열을 인수로 받아 "?", "=", "&", "/", "#" 를 포함한 모든 특수 문자열을 이스케이프 처리 이전으로 디코딩해 반환한다.
  const decodedComponent = decodeURIComponent(encodedComponent); // best+of+funny & 영상
}
