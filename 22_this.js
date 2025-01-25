/**
 * 22-1. this 키워드
 *
 * `this`는 호출되는 곳에 따라 정적 또는 동적으로 바인딩된다.
 * `this`는 크게 5가지로 나눌 수 있다.
 *
 * 1. 전역 컨텍스트에서 호출하는 경우, 최상위 객체인 `window` 또는 `global`을 가리킨다.
 * 2. 객체 안에서 호출하는 경우, 객체 자신을 가리킨다.
 * 3. constructor 생성자 함수에서 호출하는 경우, 미래에 생성될 인스턴스를 가리킨다.
 * 4. 일반 함수에서 호출하는 경우, 동적으로 `this`가 호출되는 위치에 따라 달라진다. (`use strict` 사용 시 `undefined`, 아닐 경우 `window` 또는 `global`)
 * 5. non-constructor 함수에서 호출하는 경우, 정적으로 상위 스코프의 `this`를 가리킨다. (non-constructor인 ES6 메서드 축약은 객체 내부에서 호출되기 때문에 객체 자신을 가리킨다.)
 *
 * `this`는 객체의 프로퍼티나 메서드를 참조하기 위한 자기 참조 변수이다.
 * 즉, 객체의 메서드나 생성자 함수에서만 의미가 있기 때문에 `use strict`에서는 일반 함수의 경우 `undefined`가 바인딩된다.
 * `new` 키워드가 없는 일반 함수에서는 `this`를 사용할 필요가 없기 때문이다.
 *
 */

// 👉 1. 전역 컨텍스트에서 호출하면 최상위 객체를 가리킨다.
this === window; // true

// 👉 2. 객체 안에서 호출하면 객체 자신을 가리킨다.
{
  const fruit = {
    name: "apple",
    getName() {
      return this.name;
    },
  };

  fruit.getName(); // apple
}

// 👉 3. 생성자 함수 내부에서 호출하면 미래에 생성될 인스턴스를 가리킨다.
function Circle() {
  this.radius = 5; // 미래에 생성될 인스턴스를 가리킨다.
}

// 👉 4. constructor 일반 함수(function declaration, function expression)에서 호출하면 전역 객체를 가리킨다.
// ❗️ 단, `use strict` 사용 시 `undefined`를 반환한다.
function foo() {
  console.log(this); // window
}

// 👉 5. non-constructor 화살표 함수에서 호출하면 상위 스코프를 가리킨다.
// ❗️ 단, non-constructor 인 ES6 메서드 축약은 객체 내부에서 호출되기 때문에 객체 자신을 가리킨다.
const bar = () => {
  console.log(this); // window (상위 스코프의 `this`, 즉 `window`를 가리킴)
};

// 객체 내부의 화살표 함수에서 `this`를 호출하면 객체 자신이 아닌 상위 스코프를 가리킨다.
const animal = {
  name: "Tiger",
  getName: () => this.name, // undefined, (상위 스코프의 `this`, 즉 `window`의 프로퍼티에서 name을 찾기 때문이다.)
};

// 객체 내부에서 ES6 축약 메서드에서 `this`를 호출하면 객체 자신을 가리킨다.
const insect = {
  name: "Fly",
  getName() {
    return this.name; // Fly, (ES6 축약 메서드는 객체 자신을 가리킴)
  },
};
