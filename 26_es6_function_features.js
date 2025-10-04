/**
 * 26-1. 함수의 구분
 *
 * ES6 이전까지 자바스크립트의 함수는 구분 없이 다양한 목적으로 사용되었다.
 * 일반적인 함수, new 연산자와 함께 호출하여 인스턴스를 생성하는 생성자 함수, 객체 바인딩을 통한 메서드로도 활용할 수 있다.
 * 언뜻 보면 편리한 것 같지만 실수를 유발시킬 수 있고 성능 면에서 손해다.
 *
 * 🎯 성능 면에서 손해라는 이유
 * - [[Constructor]] 내부 슬롯을 가진다는 것은 함수 자체가 prototype 프로퍼티를 가진다는 것이며,
 *   이는 불필요한 prototype 객체를 생성하는 것을 의미한다.
 * - prototype 프로퍼티를 유무를 확인하려면 Object.prototype.hasOwnProperty('prototype')을 활용하면 된다.
 *
 *
 * 즉, ES6 이전의 함수(declaration, expression)는 일반 함수는 물론 생성자 함수로도 호출할 수 있다.
 * 이는 ES6 이전의 함수는 `callable` 이면서 `constructor` 임을 의미한다.
 *
 * 📚. `callable`, `constructor`, 'non-constructor`
 * - [[Call]], [[Constructor]] 내부 슬롯에 따라 결정된다.
 * - 호출할 수 있는 함수 객체를 callable이라 한다.
 * - 인스턴스를 생성할 수 있는 함수 객체를 constructor라고 한다.
 * - 인스턴스를 생성할 수 없는 함수 객체를 non-constructor라고 한다.
 *
 */

// 다양한 형태의 함수 활용
var foo = function () {
  return 1;
};

// 1. 일반적인 함수 활용
foo(); // 1

// 2. 생성자 함수 활용
new foo(); // {}

// 3. 메서드 활용
const obj = { foo };
obj.foo(); // 1

// ------------------------------------------------------------------ //
// ------------------------   ECMAScript 6   ------------------------ //
// ------------------------------------------------------------------ //
//   함수 구분  | constructor |  prototype  |    super    |  arguments  //
//   일반 함수  |      O      |      O      |      X      |      O      //
//   Method   |      X      |      X      |      O      |      O      //
//   Arrow    |      X      |      X      |      X      |      X      //
// ------------------------------------------------------------------ //

/**
 * 26-2. 메서드
 *
 * ES6 이전 사양에는 메서드에 대한 명확한 정의가 없었다. 일반적으로 메서드는 객체에 바인딩된 함수를 일컫는 의미로 사용되었다.
 * 하지만, ES6부터 메서드에 대한 정의가 명확하게 규정되었다.
 *
 * 🎯 ES6 메서드 정의
 * - 객체 또는 클래스 내부에서 축약 표현으로 정의된 함수만을 의미한다.
 * - ES6 축약 메서드는 인스턴스를 생성할 수 없는 non-constructor다.
 *
 * 💫 ES6 메서드 특징
 * - 자신을 바딩딩한 객체(수퍼객체)를 가리키는 내부 슬롯인 [[HomeObject]]를 갖는다.
 * - ES6 메서드는 [[HomeObject]] 내부 슬롯을 가지기 때문에 자신을 바인딩한 객체를 `super` 키워드를 통해 참조할 수 있다.
 *   즉, ES6 메서드는 의미적으로 맞지 않는 기능(constructor)를 제거하고, 본연의 기능(super)을 추가된 특징을 가진다.
 *
 */

{
  const obj = {
    x: 1,

    // ES6 메서드 (non-constructor로 생성자 함수로 사용할 수 없다.)
    foo() {
      return this.x;
    },

    // 일반 함수 (constructor로 생성자 함수로 사용할 수 있다.)
    bar: function () {
      return this.x;
    },
  };

  // new obj.foo(); ❌ Uncaught TypeError obj.foo is not a constructor
  new obj.bar(); // bar {}

  // obj.foo는 non-constructor로 prototype 프로퍼티가 없다.
  obj.foo.hasOwnProperty("prototype"); // false

  // obj.bar는 constructor로 prototype 프로퍼티가 있다.
  obj.bar.hasOwnProperty("prototype"); // true

  // super object
  const superObj = {
    name: "Park",
  };

  // sub object
  const subObj = {
    __proto__: superObj,

    // `sayHi`는 ES6 메서드다, ES6메서드는 [[HomeObject]] 내부 슬롯을 갖는다.
    // `super` 키워드를 통해, 자신을 바인딩한 객체인 `superObj`를 참조할 수 있다.
    // ES6 메서드가 아닌 일반 함수, 화살표 함수는 [[HomeObject]] 내부 슬롯을 갖지 않아 참조할 수 없다.
    sayHi() {
      return `Hi, ${super.name}`;
    },
  };

  subObj.sayHi(); // Hi, Park
}
