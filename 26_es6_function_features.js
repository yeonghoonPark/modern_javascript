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

/**
 * 26-3. 화살표 함수
 *
 * 화살표 함수는 `function` 키워드 대신 화살표를 이용하여 함수를 정의한다.
 * 특히, 화살표 함수는 콜백 함수 내부에서 `this`가 전역 객체를 가리키는 문제를 해결하기 위한 대안으로 유용하다.
 *
 * 화살표 함수는 일반 함수의 기능을 간략화했으며,
 * 일반 함수가 동적으로 `this`를 바인딩 하는 것과 달리,
 * 화살표 함수의 `this`는 새로운 `this`를 생성하지 않고, 함수가 선언된 위치의 상위 실행 컨텍스트의 `this`를 그대로 사용한다.
 * 화살표 함수 내부에서 `this`는 항상 상위 스코프의 `this`를 가리키게 된다.
 * 즉, 콜백 함수 내부에서 `this` 사용 시, 콜백 함수 내부의 `this`와 외부 함수 내부의 `this`가 서로 다른 문제를 해결하기 위해 의도적으로 설계된 함수다.
 *
 * 🎯 화살표 함수와 일반 함수의 차이
 *  1. `non-constructor`와 `constructor`
 *  2. `this` 바인딩  (정적 vs 동적)
 */

/**
 * 26-3-1. 화살표 함수 정의
 */
{
  // 화살표 함수는 표현식으로 정의해야 한다.
  const foo = () => {};

  // 중괄호를 생략할 경우, 암묵적으로 반환한다.
  const bar = () => 1;

  // 객체를 반환할 때, 소괄호 ()로 감싸 주어야 한다.
  const fuz = (id, name) => ({ id, name });

  // 화살표 함수도 일급 객체로 `Array.prototype.map`, `Array.prototype.reduce` 등 고차 함수의 인수로 전달할 수 있다.
  // ES5
  [1, 2].map(function (n) {
    return n * 2;
  });

  // ES6
  [1, 2].map((n) => n * 2);
}

/**
 * 26-3-2. 화살표 함수와 일반 함수의 차이
 */
// 1️⃣ 화살표 함수는 인스턴스를 생성할 수 없는 `non-constructor`다.
{
  const foo = () => {};

  // 화살표 함수는 생성자 함수로 만들 수 없다. Uncaught TypeError: foo is not a constructor
  // new foo();

  // 화살표 함수는 `prototype` 프로퍼티를 가지지 않으며, 암묵적으로 생성하지도 않는다.
  foo.hasOwnProperty("prototype"); // false
}

// 2️⃣ 중복된 매개변수 이름을 선언할 수 없다.
{
  // ❌ Uncaught SyntaxError: Duplicate parameter name not allowed in this context
  // const foo = (a, a) => {};
}

// 3️⃣ `this`, `arguments`, `super`, `new.target` 바인딩을 갖지 않는다.
// 화살표 함수 내부에서 위 키워드를 참조 시, 스코프 체인을 통해 상위 스코프의 키워드를 참조한다.

/**
 * 26-3-3. this
 *
 * 화살표 함수가 일반 함수와 구별되는 가장 큰 특징은 `this`이다.
 * 화살표 함수의 `this`는 일반 함수의 `this`와 다르게 동작한다.
 * 이는 "콜백 함수 내부의 `this`문제", 즉 콜백 함수 내부의 `this`와 외부 함수의 `this`가 다름을 해결하기 위한 의도적으로 설계된 것이다.
 */
{
  class Prefix {
    constructor(prefix) {
      this.prefix = prefix;
    }

    // ES6메서드(외부 함수) 내부에 선언된 일반 함수의 `this`는 `undefined`이다.
    // 사실 일반 함수에서 호출되는 모든 `this`는 전역 객체를 가리키지만, class 내부는 암묵적으로 `strict-mode`가 적용된다.
    // `strict-mode`가 적용될 시, 일반 함수 내부의 모든 `this`는 `undefined`가 바인딩된다.
    // 즉, 콜백 함수(1️⃣)의 `this`와 외부 함수(2️⃣)의 `this`가 서로 다른 값을 참조하기 때문에 TypeError가 발생한다.
    add(arr) {
      // 1️⃣
      return arr.map(function (item) {
        // 2️⃣
        return this.prefix + item; //  ❌ Uncaught TypeError: Cannot read properties of undefined (reding 'prefix')
      });
    }

    // 콜백 함수와 외부 함수의 `this`가 서로 다른 값을 참조하는 것을 막기 위한 방법
    // ES5
    // 1️⃣. 외부 함수의 `this`를 변수화하여 참조하는 방법
    add1(arr) {
      const that = this;

      return arr.map(function (item) {
        return that.prefix + item; // ✅ ['-webkit-transition', '-webkit-user-select']
      });
    }

    // 2️⃣. `Array.prototype.map`의 두 번째 인수로 `this`를 전달하는 방법
    add2(arr) {
      return arr.map(function (item) {
        return this.prefix + item; // ✅ ['-webkit-transition', '-webkit-user-select']
      }, this);
    }

    // 3️⃣. `Function.prototype.bind`를 활용하여 `this`를 참조하는 방법
    add3(arr) {
      return arr.map(
        function (item) {
          return this.prefix + item; // ✅ ['-webkit-transition', '-webkit-user-select']
        }.bind(this)
      );
    }

    // 🎯 ES6
    // 화살표 함수는 함수 자체의 `this` 바인딩을 갖지 않는다.
    // 따라서, 화살표 함수 내부에서 `this`를 참조하면 상위 스코프의 `this`를 그대로 참조한다.
    // 이를 lexical this라 한다.
    add4(arr) {
      return arr.map((item) => this.prefix + item); // ✅ ['-webkit-transition', '-webkit-user-select']
    }
  }

  const prefix = new Prefix("-webkit-");
  // const properties = prefix.add(["transition", "user-select"]); // ❌ Uncaught TypeError: Cannot read properties of undefined (reding 'prefix')
  const properties4 = prefix.add4(["transition", "user-select"]); // ✅ ['-webkit-transition', '-webkit-user-select']
}

// 화살표 함수는 `this` 바인딩을 가지지 않기 때문에, 아래의 3가지 메서드를 사용하더라도 화살표 함수 내부의 `this`를 교체할 수 없다.
// `Function.prototype.apply`, `Function.prototype.bind`, `Function.prototype.call`
{
  window.x = 1;

  const arrow = () => this.x;

  const expression = function () {
    return this.x;
  };

  // `Function.prototype.call` 메서드를 사용하더라도 `this`는 바인딩되지 않고, 상위 스코프의 `x`를 참조하게 된다.
  arrow.call({ x: 10 }); // 1

  // `Function.prototype.call` 메서드를 통해 `this`가 동적으로 전달된 인자로 바인딩 된다.
  expression.call({ x: 10 }); // 10
}

// 메서드를 정의할 때, 화살표 함수를 사용하는 것을 피해야한다. 왜냐면 생성될 instance를 가리키는 것이 아닌 정적으로 상위 스코프의 `this`를 참조하기 때문이다.
{
  // ❌ Bad
  const person = {
    firstName: "Park",
    sayHi: () => `Hi, ${this.firstName}`,
  };

  person.sayHi(); // Hi, undefined

  // ✅ Good
  const person2 = {
    firstName: "Park",
    sayHi() {
      return `Hi, ${this.firstName}`;
    },
  };

  person2.sayHi(); // Hi, Park

  // ❌ Bad, `this.sayHi`는 프로토타입 메서드가 아닌 인스턴스 메서드가 된다.
  class Park {
    constructor() {
      this.name = "Park";
      this.sayHi = () => `Hi, ${this.name}`;
    }
  }
  const park = new Park();
  park.sayHi(); // Hi, Park
  park.hasOwnProperty("sayHi");

  // ❌ `park.sayHi`는 prototype 메서드가 아니다.
  console.log(park.__proto__.hasOwnProperty("sayHi")); // false

  // ✅ Good, `this.sayHi`는 프로토타입 메서드가 된다.
  class Park2 {
    constructor() {
      this.name = "Park";
    }

    sayHi() {
      return `Hi, ${this.name}`;
    }
  }
  const park2 = new Park2();
  park2.sayHi(); // Hi, Park

  // ✅ `park2.sayHi`는 prototype 메서드다.
  console.log(park2.__proto__.hasOwnProperty("sayHi")); // true
}

/**
 * 26-3-4. super
 *
 * 화살표 함수는 `super` 바인딩을 가지지 않는다.
 * 따라서 화살표 함수 내부에서 `super`를 참조하면 상위 스코프의 `super`를 찾는다.
 * `super` 키워드는 [[HomeObject]] 내부 슬롯을 갖는 ES6 메서드 내에서만 사용할 수 있는 키워드다.
 */
{
  class SuperClass {
    constructor(name) {
      this.name = name;
    }

    sayHi() {
      return `Hi, ${this.name}`;
    }
  }

  class DerivedClass extends SuperClass {
    // 화살표 함수는 `super` 바인딩을 갖지 않기 때문에 여기서 `super`는 상위 스코프인 `SuperClass`의 `constructor`를 참조한다.
    sayHi = () => `${super.sayHi()}`;
  }

  const derived = new DerivedClass("Park");

  derived.sayHi(); // Hi, Park
}

/**
 * 26-3-5. arguments
 *
 * 화살표 함수는 함수 자체의 `arguments` 바인딩을 갖지 않는다.
 * 따라서 화살표 함수 내부에서 `arguments` 객체를 참조하면 `this`, `super`와 마찬가지로 상위 스코프의 `arguments`를 참조한다.
 *
 * `arguments` 객체는 함수를 정의할 때, 매개변수의 갯수를 확정할 수 없는 가변 인자 함수를 구현할 때 유용하다.
 * 단, 화살표 함수에서는 `arguments` 바인딩을 갖지 않아 상위 스코프의 `arguments`를 참조하기 때문에 도움이 되지 않는다.
 * 따라서, 화살표 함수의 가변 인자 함수를 구현할 때는 반드시 `rest` 파라미터를 사용해야 한다.
 */
{
  function fnDeclaration() {
    console.log(arguments); // Arguments(3) [1, 2, 3, callee: f, Symbol: f]
  }
  fnDeclaration(1, 2, 3);

  const arrowFn = () => {
    console.log(arguments); // ❌ Uncaught ReferenceError: arguments is not defined
  };
  // arrowFn(1, 2, 3);
}

/**
 * 26-4. Rest 파라미터
 *
 */

/**
 * 26-4-1. 기본 문법
 *
 * Rest 파라미터는 매개변수 이름 앞에 세개의 점 (...)을 붙여서 정의한 매개변수를 의미한다.
 */
{
  // Rest 파라미터는 함수에 전달된 인수들의 목록을 배열로 전달 받는다.
  const foo = (...rest) => {
    console.log(rest); // [1, 2, 3]
  };
  foo(1, 2, 3);

  // 일반 매개변수와 Rest 파라미터를 함께 사용할 수 있으며, 함수에 전달된 인수들은 배열에 순차적으로 할당된다.
  // 따라서, Rest 파라미터는 항상 마지막 파라미터야 한다.
  const fuz = (param, ...rest) => {
    console.log(param); // 1
    console.log(rest); // [2, 3]
  };
  fuz(1, 2, 3);
}

/**
 * 26-4-2. Rest 파라미터와 arguments 객체
 *
 * ES5에서는 Rest 파라미터가 없었기 때문에 가변 인자 함수를 활용할 때 `arguments` 객체를 사용하여 인수를 전달받았다.
 * `arguments` 객체는 순회 가능한 유사 배열 객체이며, 함수 내부에서 지역 변수처럼 활용할 수 있다.
 * 하지만, `arguments` 객체는 배열이 아닌 유사 배열 객체이므로 `Array.prototype` 메서드를 활용할 수 없다.
 * 배열 메서드를 활용하기 위해서는 `Function.prototype.call`, `Function.prototype.bind` 메서드를 사용해 `arguments` 객체를 배열로 변환해야 하는 번거로움을 가진다.
 * 반면, ES6의 Rest 파라미터는 배열로 인수 목록을 직접 전달 받기 때문에 배열로 변환하는 번거로움을 피할 수 있다.
 */
{
  function fnSum() {
    // 유사 배열 객체인 `arguments`를 배열로 변환
    var array = Array.prototype.slice.call(arguments);

    return array.reduce(function (acc, val) {
      return acc + val;
    }, 0);
  }
  fnSum(1, 2, 3); // 6

  const arrowSum = (...args) => {
    // 화살표 함수는 `arguments` 바인딩을 하지 않는다.
    // 따라서, 화살표 함수로 가변 인자 함수를 구현할 때는 반드시 Rest 파라미터를 사용해야 한다.
    return args.reduce((acc, val) => acc + val, 0);
  };
  arrowSum(1, 2, 3); // 6
}
