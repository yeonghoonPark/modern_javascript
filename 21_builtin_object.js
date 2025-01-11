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
