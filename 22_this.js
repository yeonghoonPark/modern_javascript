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
 * 5. non-constructor 함수인 화살표 함수에서 호출하는 경우, 정적으로 상위 스코프의 `this`를 가리킨다. (non-constructor인 ES6 메서드 축약은 객체 내부에서 호출되기 때문에 객체 자신을 가리킨다.)
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
  getName: () => this.name, // '', (상위 스코프의 `this`, 즉 `window`의 프로퍼티에서 name은 브라우저 창의 이름을 가리키며 기본값을 '' 이다.)
};

// 객체 내부에서 ES6 축약 메서드에서 `this`를 호출하면 객체 자신을 가리킨다.
const insect = {
  name: "Fly",
  getName() {
    return this.name; // Fly, (ES6 축약 메서드는 객체 자신을 가리킴)
  },
};

/**
 * 22-2. 함수 호출 방식과 this 바인딩
 *
 * `this` 바인딩은 함수 호출 방식, 즉 함수가 어떻게 호출되었는지에 따라 동적으로 결정된다.
 *
 * ❗️ 렉시컬 스코프와 this 바인딩은 결정 시기가 다르다.
 * 함수의 상위 스코프를 결정하는 방식인 렉시컬 스코프는 함수가 어디서 호출되었냐가 아닌 함수가 어디서 정의되었냐에 따라 스코프의 유효 범위를 결정하는 방식이다.
 * 즉 함수 정의가 평가되어 객체가 생성되는 시점에 상위 스코프를 결정하는 반면 `this`의 참조 값은 함수 호출 시점에 결정된다.
 *
 * 함수 호출 방식은 크게 4가지로 분류한다.
 *
 * 1. 일반 함수 호출 (function declaration, function expression)
 * 2. 메서드 호출
 * 3. 생성자 함수 호출
 * 4. Function.prototype.apply/call/bind 메서드에 의한 간접 호출
 *
 */

{
  // `this`는 함수 호출 방식에 따라 동적으로 결정된다.
  const foo = function () {
    // "use strict";
    this;
  };

  // 1. 일반 함수 호출, 항상 최상위 객체인 `window`를 참조한다. (단 strict 모드에서는 `undefined`를 참조한다.)
  foo(); // window

  // 2. 메서드 호출, 객체 자신을 참조한다.
  const bar = { foo };
  bar.foo(); // obj, { foo: f }

  // 3. 생성자 함수 호출, 미래에 생성될 인스턴스를 참조한다.
  new foo(); // {}

  // 4. Function.prototype.apply/call/bind 메서드에 의한 간접 호출, `foo` 함수의 `this`는 인자에 의해 결정된다.
  const student = { name: "Alice" };
  foo.apply(student); // student
  foo.call(student); // student
  foo.bind(student)(); // student

  // ❗️ 단, 화살표 함수의 경우 인자와 관계없이 `this`는 항상 상위 스코프를 참조한다.
  const arrowFunc = () => this;
  arrowFunc.apply(student); // window
  arrowFunc.call(student); // window
  arrowFunc.bind(student)(); // window
}

// 1️⃣ 22-2-1. 일반 함수 호출
// 👉 기본적으로 중첩 함수까지 모든 `this`에는 전역 객체가 바인딩된다. (단 strict 모드에서는 `undefined`가 바인딩된다)
function qux() {
  // 'use strict'
  this; // window, (strict 모드 시 undefined)

  function quux() {
    this; // window, (strict 모드 시 undefined)
  }

  quux();
}

qux();

// ❗️ 메서드 내에서 정의한 중첩 함수 또는 콜백 함수가 일반 함수로 호출된다면 `this`는 전역 객체가 바인딩 된다.
// 전역 변수
var value = 1;

{
  const obj = {
    value: 100,
    getValue() {
      console.log(this); // obj
      console.log(this.value); // 100

      // 메서드 내에서 중첩 함수가 일반 함수로 호출된다면 `this`는 전역 객체가 바인딩 된다.
      function getThis() {
        console.log(this); // window
        console.log(this.value); // 1
      }

      // 메서드 내에서 콜백 함수가 일반 함수로 호출된다면 `this`는 전역 객체가 바인딩 된다.
      setTimeout(function () {
        console.log(this); // window
        console.log(this.value); // 1
      });

      getThis();
    },
  };

  obj.getValue();
}

// 👉 위와 같은 문제를 해결하기 위해서는 `this`를 객체 자신을 참조하는 식별자로 바꿔주거나 화살표 함수를 사용할 수 있다.
{
  const obj = {
    value: 100,
    getValue() {
      console.log(this); // obj
      console.log(this.value); // 100

      // `this` 바인딩을 `that`에 할당
      const that = this;

      // 메서드 내에서 중첩 함수가 일반 함수로 호출할 때, 함수 내의 `this`가 아닌 상위 스코프의 `this`를 참조하는 `that`을 사용한다.
      function getThat() {
        console.log(that); // obj
        console.log(that.value); // 100
      }

      // 메서드 내에서 중첩 함수를 화살표 함수로 호출하여 `this`가 정적으로 상위 스코프(`obj`)의 `this`를 참조하도록 한다.
      const getThis = () => {
        console.log(this); // obj
        console.log(this.value); // 100
      };

      // 메서드 내에서 콜백 함수를 화살표 함수로 호출하여 `this`가 정적으로 상위 스코프(`obj`) `this`를 참조하도록 한다.
      setTimeout(() => {
        console.log(this); // obj
        console.log(this.value); // 100
      });

      // 명시적으로 `Function.prototype.bind` 메서드를 이용하여 `this`를 바인딩할 수 있다.
      setTimeout(
        function () {
          console.log(this); // obj
          console.log(this.value); // 100
        }.bind(this)
      );

      getThat();
      getThis();
    },
  };

  obj.getValue();
}

// 🔑 constructor임에도 불구하고 `new` 키워드가 없는 일반 함수에서 `this`를 사용하는 것은 지양해야 한다.
// strict 모드에서 `undefined`를 참조하도록 하는 이유가 있다. (예상치 못한 오류나 혼란을 방지하는 목적)
// 코드를 트랙킹 하는 입장에서 메서드 내의 중첩 함수나 콜백 함수를 일반 함수로 호출하게 되면 `this`는 해당 객체가 아닌 전역 객체를 참조하기 때문에 많은 혼란을 준다.
// `this`는 일반 함수에서는 사용하지 말고, 명확하게 필요로 하는 곳(객체, 생성자 함수, 클래스)에서만 사용해야 한다.

// 2️⃣ 22-2-2. 메서드 호출
// 👉 메서드 내부의 `this`는 메서드를 호출한 객체, 즉 호출한 객체를 참조한다.
// ❗️ 주의할 점은 메서드 내부의 `this`는 메서드를 소유한 객체가 아닌 메서드를 호출한 객체를 참조한다는 점이다.
{
  const person = {
    name: "Jeff",
    getName() {
      // 메서드 내부의 `this`는 `this`를 소유한 `getName`이 아닌 호출한 객체를 참조한다.
      return this.name;
    },
  };

  // `getName`을 호출한 객체는 `person`으로 `this`는 `person`을 참조한다.
  person.getName(); // Jeff

  // 위의 `person`객체의 `getName`은 객체에 바인딩된 함수다.
  // 즉, `person`객체의 `getName`프로퍼티가 가리키는 함수 객체는 `person`객체에 포함된 것이 아닌 독립적인 별도의 객체다.
  // `getName`프로퍼티가 독립적인 함수 객체를 참조하고 있을 뿐이다.
  // 따라서 `getName`프로퍼티가 가리키는 독립적인 함수 객체는 다른 객체의 프로퍼티로도 활용할 수 있다.

  const anotherPerson = {
    name: "Mark",
  };

  // `anotherPerson`객체에 `getName`프로퍼티 키를 추가하여 참조값을 `person`의 `getName`이 참조하는 독립적인 함수로 할당
  anotherPerson.getName = person.getName;
  anotherPerson.getName(); // Mark

  // `person`의 `getName`이 참조하는 독립적인 함수를 변수에 할당
  const getName = person.getName;
  getName(); // '', `this`는 window를 가리킨다. (브라우저에서 window.name은 브라우저 창의 이름을 나타내는 프로퍼티이며 기본값은 '' 이다.)

  // 프로토타입 메서드 내부에서 사용된 `this`도 일반 메서드와 마찬가지로 해당 메서드를 호출한 객체를 참조한다.
  function Person(name) {
    this.name = name;
  }

  Person.prototype.getName = function () {
    return this.name;
  };

  const julian = new Person("Julian");

  // `getName`메서드를 호출한 객체는 `julian`이다.
  julian.getName(); // Julian

  Person.prototype.name = "Williams";

  // `getName`메서드를 호출한 객체는 `Person.prototype`이다.
  Person.prototype.getName(); // Williams

  // 🔑 `this`를 메서드 내부에서 사용하면 `this`를 소유하는 객체가 아닌 메서드를 호출한 객체를 참조한다.
  // 즉 메서드 내부에서 `this`는 호출 시점에 따라 참조할 객체가 정해진다.
}
