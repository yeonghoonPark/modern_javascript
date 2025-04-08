/**
 * 25-1. 클래스는 프로토타입의 문법적 설탕인가?
 *
 * 자바스크립트는 프로토타입 기반 객체지향 언어다.
 * 프로토타입 기반 객체지향 언어는 클래스가 필요 없는 객체지향 프로그래밍 언어다.
 * ES6에 `class` 키워드가 도입되기 전에는 생성자 함수와 프로토타입을 통해 객체 지향 언어의 상속을 구현하였다.
 * `class`는 사실 함수이며, 기존 프로토타입 기반 패턴을 클래스 기반 패턴처럼 사용할 수 있또록 하는 문법적 설탕(syntax sugar)로 볼 수도 있다.
 * 단, `class`와 생성자 함수는 모두 프로토타입 기반의 인스턴스를 생성하지만 정확하게 동일하게 동작하지는 않는다.
 * `class`는 생성자 함수보다 엄격하며 생성자 함수에서는 제공하지 않는 기능도 제공한다.
 *
 * `class`는 생성자 함수와 매우 유사하게 동작하지만 다음과 같은 차이가 있다.
 * 1. `new` 키워드 없이 호출하면 에러가 발생한다. (생성자 함수는 `new` 키워드가 없으면 일반 함수로 호출된다)
 * 2. 상속을 지원하는 `extend`와 `super` 키워드를 제공한다.
 * 3. 호이스팅이 발생하지 않는 것처럼 동작한다. (`function` 키워드로 선언된 생성자 함수는 호이스팅이 발생한다)
 * 4. 내부의 모든 코드에는 암묵적으로 `use strict`가 지정되어 실행되며 해제할 수 없다.
 * 5. `constructor`, `prototype.메서드`, 정적 메서드는 모두 프로퍼티 어트리뷰트 [[Enumerable]]의 값이 `false`이다. (열거되지 않는다)
 *
 * `class`는 생성자 함수보다 강력한 프로토타입 기반의 문법적 설탕이라고 볼 수도 있지만, 새로운 객체 생성 메커니즘으로 보는게 더 합당하다.
 *
 */

/**
 * 25-2. 클래스 정의
 *
 * 클래스는 `class` 키워드를 사용하여 정의한다.
 * 클래스는 익명 클래스 표현식과 기명 클래스 표현식으로도 사용할 수 있다.
 * 이 말은, 클래스는 값으로 사용할 수 있는 일급 객체임을 의미한다.
 *
 * 일급 객체는 다음과 같은 특징을 갖는다.
 * 1. 무명의 리터럴로 생성할 수 있다. 즉, 런타임에 생성이 가능하다.
 * 2. 변수나 자료구조(객체, 배열 등)에 저장할 수 있다.
 * 3. 함수의 매개변수에 전달할 수 있다.
 * 4. 함수의 반환값으로 사용할 수 있다.
 * 즉, 클래스는 함수이다. 따라서 클래스는 값처럼 사용할 수 있는 일급 객체다.
 *
 * 클래스 몸체에 정의할 수 있는 메서드는 세 가지가 있다.
 * 1. constructor(생성자)
 * 2. 프로토타입 메서드
 * 3. 정적 메서드
 *
 */

{
  class Person {
    // constructor
    constructor(name) {
      // create instance and initialize
      this.name = name;
    }

    // prototype method
    sayHi() {
      console.log(`Hi, My name is ${this.name}`);
    }

    // static method
    static sayHello() {
      console.log("Hello!");
    }
  }

  // instance
  const john = new Person("John");

  // call prototype method
  john.sayHi(); // Hi, My name is John

  // call static method
  Person.sayHello(); // Hello!
}

/**
 * 25-3. 클래스 호이스팅
 *
 * 클래스는 함수로 평가된다.
 * `class` 키워드를 이용해 정의한 클래스는 함수 선언문과 같이 소스코드 평가 과정, 즉 런타임 이전에 파싱 단계에서 먼저 평가되어 함수 객체를 생성한다.
 * 이때 클래스가 평가되어 생성된 함수 객체는 생성자 함수로서 호출할 수 있는 함수 즉, constructor다.
 * 생성자 함수로 평가 받는 시점에 프로토타입 또한 더불어 생성된다.
 * 프로토타입과 생성자 함수는 단독으로 존재할 수 없고 언제나 쌍으로 존재하기 때문이다.
 * 🔑 단, 클래스는 클래스 정의 이전에 참조할 수 없다. 그래서 마치 호이스팅이 발생하지 않는 것처럼 보이지만 실제로는 그렇지 않다.
 *
 */

{
  // console.log(Person); // Uncaught ReferenceError: Cannot access 'Person' before initialization

  class Person {}

  // `class` 키워드를 이용하여 선언한 클래스는 선언 전에 참조하면 에러가 발생하며, 마치 호이스팅이 되지 않는 것처럼 보인다.
  // 🔑 하지만 실제로는 호이스팅이 발생하며 초기화 단계를 거치지 않아 접근할 수 없는 일시적 사각지대가 발생하는 `let`, `const` 키워드와 같은 메커니즘으로 호이스팅된다.
  // `var`, `let`, `const`, `function`, `class` 키워드를 사용한 모든 선언문들은 런타임 이전에 먼저 실행되기 때문이다.
}

/**
 * 25-4. 인스턴스 생성
 *
 * 클래스는 생성자 함수이며 `new` 키워드와 함께 호출되어 인스턴스를 생성한다.
 * 생성자(constructor) 함수는 `new` 키워드 여부에 따라 일반 함수 또는 생성자 함수로 동작할 수 있다.
 * 하지만, 클래스는 인스턴스를 생성하는 것이 유일한 존재 이유이므로 반드시 `new` 키워드와 함께 호출해야 한다.
 *
 */

{
  // 클래스 선언
  class Person {}

  // 인스턴스 생성
  const john = new Person(); // Person {}

  // `new` 키워드가 없다면 에러가 발생한다.
  // const james = Person(); // Uncaught TypeError: Class constructor Person cannot be invoked without 'new' at ~
}

/**
 * 25-5. 메서드
 *
 * 클래스 몸체에는 0개 이상의 메서드만 선언할 수 있다.
 * 클래스 몸체에서 생성할 수 있는 메서드는 다음과 같다.
 *
 * 1. constructor
 * 2. prototype method
 * 3. static method
 *
 */

// 25-5-1. constructor
// `constructor`는 인스턴스를 생성하고 초기화하기 위한 특수한 메서드이다.
// `constructor`의 특징은 다음과 같다.
// 1. 이름을 변경할 수 없다.
// 2. 클래스 내부에서 2개 이상 호출할 수 없다.
// 3. 생략할 수 있다.
{
  class Person {
    // `constructor`
    constructor(name) {
      // 인스턴스 생성 및 초기화
      this.name = name;
    }
  }

  // 클래스는 함수이다.
  console.log(typeof Person); // function
  console.dir(Person);

  // `constructor` 메서드에 의해 인자로 전달된 'John'은 생성된 인스턴스의 'name' 프로퍼티 값이 된다.
  const john = new Person("John");
  console.log(john); // Person {name: 'John'}
}

// 25-5-2. prototype method

// 생성자 함수의 경우, `prototype` 메서드를 생성하기 위해서는 명시적으로 메서드를 추가해야 한다.
{
  function Person(name) {
    this.name = name;
  }

  Person.prototype.sayHello = function () {
    console.log(`Hi, I'm ${this.name}`);
  };

  const olivia = new Person("Olivia");

  olivia.sayHello(); // Hi, I'm Olivia

  Object.getPrototypeOf(olivia) === Person.prototype; // true
  olivia instanceof Person; // true
  olivia.constructor === Person; // true
}

// 클래스의 경우, 클래스 몸체에서 메서드를 정의하면 기본적으로 `prototype`의 메서드가 된다.
{
  class Person {
    constructor(name) {
      this.name = name;
    }

    sayHello() {
      console.log(`Hi, I'm ${this.name}`);
    }
  }

  const mike = new Person("Mike");

  mike.sayHello(); // Hi, I'm Mike

  Object.getPrototypeOf(mike) === Person.prototype; // true
  mike instanceof Person; // true
  mike.constructor === Person; // true
}

// 25-5-3. static method
// static method(정적 메서드)는 인스턴스를 생성하지 않아도 호출할 수 있는 메서드를 말한다.

// 생성자 함수의 경우, static method를 생성하기 위해서는 명시적으로 생성자 함수에 메서드를 추가해야 한다.
{
  function Person(name) {
    this.name = name;
  }

  Person.sayHello = function () {
    console.log("Hello");
  };

  Person.sayHello(); // Hello
}

// 클래스의 경우, 클래스 몸체에서 `static` 키워드를 이용하여 메서드를 정의하면 static method가 된다.
{
  class Person {
    constructor(name) {
      this.name = name;
    }

    static sayHi() {
      console.log("Hi");
    }
  }

  Person.sayHi(); // Hi
}

// 25-5-4. 정적 메서드와 프로토타입 메서드의 차이
// 1. 정적 메서드와 프로토타입 메서드는 자신이 속해 있는 프로토타입 체인이 다르다.
// 2. 정적 메서드는 클래스로 호출하고 프로토타입 메서드는 인스턴스로 호출한다.
// 3. 정적 메서드는 인스턴스 프로퍼티를 참조할 수 없지만 프로토타입 메서드는 인스턴스 프로퍼티를 참조할 수 있다.

{
  // static methods cannot reference instance properties
  class Square {
    // static method
    static printArea(width, height) {
      // "this" refers to the class constructor(itself)
      console.log(this === Square); // true
      console.log(width * height);
    }
  }

  // cannot reference instance properties
  Square.printArea(2, 5); // 10
}

{
  // prototype methods can reference instance properties
  class Square {
    // constructor
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }

    // prototype method
    printArea() {
      // "this" refers to the instance of the class
      console.log(this === Square); // false
      console.log(this.width * this.height);
    }
  }

  // declaration instance
  const square = new Square(10, 10);

  // call "printArea"
  square.printArea(); // 100
}

// 🔑 So, if you don't need to reference instance properties, you should use static methods; otherwise, use prototype methods

// 25-5-5. 클래스에서 정의한 메서드의 특징
// 1. `function` 키워드를 생략한 메서드 축약 표현을 사용한다.
// 2. 객체 리터럴과는 다르게 클래스에 메서드를 정의할 때는 콤마(,)가 필요 없다.
// 3. 암묵적으로 `use strict`가 실행된다.
// 4. `for...in` 또는 `Object.keys` 메서드 등으로 열거할 수 없다. 즉, [[Enumerable]] 슬롯의 값이 `false`다.
// 5. 내부 슬롯 [[Constructor]]를 갖지 않는 non-constructor이다. 따라서 new 연산자와 함께 호출할 수 없다.
