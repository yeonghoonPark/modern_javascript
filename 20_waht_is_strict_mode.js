/**
 * 20-1. strict mode란?
 *
 * 오타나 문법 지식의 미비로 인한 실수는 언제나 발생하며 이러한 오류를 줄이기 위한 환경을 만들기 위해 `strict mode`가 추가되었다.
 * `strict mode`는 ES5에 도입되었으며, ES6에서 도입된 `class`, `module`은 기본적으로 `strict mode`가 적용된다.
 *
 */

function foo() {
  x = 10;
}
foo();
console.log(x);
// 위의 코드는 `foo`함수를 정의하고 호출하였다.
// `foo`함수 내에는 선언하지 않는 `x` 변수에 10을 할당하는 명령을 했다.
// 이때 식별자로서의 `x`를 찾아야만 값을 할당할 수 있기 때문에 자바스크립트 엔진은 `x`가 어디에서 선언되었는지 스코프 체인을 따라 검색한다.
// 스코프 체인을 따라 결국 최상위의 전역 스코프에도 `x`의 선언이 존재하지 않기 때문에 ReferenceError를 발생시킬 것 같으나
// 자바스크립트 엔진은 전역 객체에 `x`프로퍼티를 동적으로 생성한다.
// 이 현상을 암묵적 전역(`implicit global`)이라 하며, 암묵적 전역은 오류를 발생시킬 가능성이 매우 높다.
// 위의 문제를 예방하기 위해서는 변수 선언을 확실히 하거나 `ESLint` 또는 `strict mode`를 사용할 수 있다.

function bar() {
  "use strict";
  y = 10;
}
// bar(); // ReferenceError: y is not defined ~

// 🔑 `strict mode`는 더 안전하고 예측 가능한 코드를 작성하기 위한 지시어이다.
