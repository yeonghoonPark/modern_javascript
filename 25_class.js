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

/**
 * 25-6. 클래스의 인스턴스 생성 과정
 *
 * `new` 키워드와 함께 클래스를 호출하면 생성자 함수와 마찬가지로 클래스 내부 메서드 [[Construct]]가 호출된다.
 *  클래스는 `new` 키워드 없이 호출할 수 없으며, 다음과 같은 과정을 거쳐 인스턴스가 생성된다.
 *
 * 1. 인스턴스 생성과 `this` 바인딩
 * - `new` 키워드와 함께 클래스를 호출하면 `constructor`의 내부 코드가 실행되기에 앞서 암묵적으로 빈 객체가 생성된다.
 * - 빈 객체의 프로토타입은 클래스 내부에서 정의된 프로토타입 메서드들의 집합체이다.
 * - 빈 객체의 프로퍼티들은 `constructor`의 내부 코드에서 정의된 `this`에 바인딩된다.
 *
 * 2. 인스턴스 초기화
 * - `constructor`의 내부 코드가 실행되면서 `this`에 바인딩되어 있는 인스턴스를 초기화한다.
 *
 * 3. 인스턴스 반환
 * - 클래스의 모든 처리(`prototype` 바인딩, `this` 바인딩 및 초기화)가 끝나면 완성된 인스턴스가 반환된다.
 *
 */

{
  class Person {
    constructor(name) {
      // 1. 암묵적으로 인스턴스가 생성되고 `this`에 바인딩된다.
      console.log(this); // Person {}
      console.log(Object.getPrototypeOf(this) === Person.prototype); // true

      // 2. `this`에 바인딩되어 있는 인스턴스를 초기화한다.
      this.name = name;
    }

    // 3. 완성된 인스턴스가 반환된다.
  }

  const david = new Person("David");
}

/**
 * 25-7. 프로퍼티
 *
 */

// 25-7-1. 인스턴스 프로퍼티
// 인스턴스의 프로퍼티는 `constructor` 내부에서 정의해야 하며, 내부에서 정의된 프로퍼티는 public 하다.
{
  class Person {
    constructor(name) {
      this.name = name;
    }
  }

  const james = new Person("James");
  console.log(james); // Person {name: 'James'}
}

// 25-7-2. 접근자 프로퍼티
// 접근자 프로퍼티(accessor property)는 자체적으로 값([[Value]] 내부슬롯)을 가지고 있지 않고, 값을 읽거나 저장할 때 사용하는 접근자 함수(accessor function)로 구성된 프로퍼티다.
{
  const person = {
    // 데이터 프로퍼티 (data property)
    firstName: "Julian",
    lastName: "Bream",

    // 접근자 프로퍼티 (accessor property)
    // getter 함수
    get fullName() {
      return this.firstName + " " + this.lastName;
    },

    // setter 함수
    set fullName(name) {
      [this.firstName, this.lastName] = name.split(" ");
    },
  };

  // 데이터 프로퍼티를 통한 프로퍼티 값 참조
  console.log(person.fullName); // Julian Bream

  // 접근자 프로퍼티를 통한 프로퍼티 값 지정
  person.fullName = "John Williams";
  console.log(person.fullName); // John Williams

  // 접근자 프로퍼티는 `configurable`, `enumerable`, `get`, `set` 프로퍼티 어트리뷰트를 갖는다.
  console.log(Object.getOwnPropertyDescriptor(person, "fullName"));
}

// 접근자 프로퍼티는 클래스에서도 사용할 수 있으며, 위의 예제를 클래스로 표현하면 다음과 같다.
{
  class Person {
    // 데이터 프로퍼티
    constructor(firstName, lastName) {
      this.firstName = firstName;
      this.lastName = lastName;
    }

    // 접근자 프로퍼티
    // getter
    get fullName() {
      return this.firstName + " " + this.lastName;
    }

    // setter
    set fullName(name) {
      [this.firstName, this.lastName] = name.split(" ");
    }
  }

  const person = new Person("Andy", "James");

  // 데이터 프로퍼티를 통한 프로퍼티 값 참조
  console.log(person.fullName); // Andy James

  // 접근자 프로퍼티를 통한 프로퍼티 값 지정
  person.fullName = "Steve Vai";
  console.log(person.fullName); // Steve Vai

  // 접근자 프로퍼티는 `configurable`, `enumerable`, `get`, `set` 프로퍼티 어트리뷰트를 갖는다.
  console.log(Object.getOwnPropertyDescriptor(Person.prototype, "fullName"));

  // 클래스 내부의 `getter`, `setter` 함수는 프로퍼티의 인스턴스처럼 사용된다.
  // 즉, `getter`와 `setter`는 호출하는 것이 아니라 참조시에 내부적으로 호출되거나 값을 할당하는 형식이다.
  // 🔑 `getter`는 이름 그대로 무언가를 취득할 때 사용하므로 반드시 무언가를 `return` 해야한다.
  // 🔑 `setter`는 무언가를 프로퍼티에 할당해야 할 때 사용하므로 반드시 매개변수가 필요하다. 다만 단 하나의 값만 할당받기 때문에 단 하나의 매개변수만 선언할 수 있다.
}

// 25-7-3. 클래스 필드 정의 제안
// 클래스 필드(멤버)란, 클래스 기반 객체지향 언어에서 클래스가 생성할 인스턴스의 프로퍼티를 가리키는 용어다.
// 자바스크립트에서 클래스 필드를 생성하기 위해서는 `constructor` 내부에서 초기화를 거쳐야한다.
{
  class Person {
    constructor(name) {
      // 인스턴스 생성 및 초기화
      this.name = name;
    }
  }

  const john = new Person("John"); // Person {name: 'John'}
}

// 25-7-4. private 필드 정의 제안
// 자바스크립트에서 클래스는 다른 객체 지향 언어에서 지원하는 `private`, `public`, `protected`를 지원하지 않는다.
// 따라서 인스턴스의 프로퍼티는 외부에서 언제나 참조할 수 있는 `public` 프로퍼티이다.
// 하지만 Chrome 74이상의 브라우저에서 Node.js 12버전 이상을 사용하면 `private` 필드를 정의할 수 있다.
// `private` 필드를 정의하기 위해서는 필드의 선두에 `#`을 붙여주고, 참조할 때도 `#`을 붙여주어야 한다.
// 🚨 `private` 필드는 클래스 내부에서만 참조 가능하다. 즉, 외부에서 접근할 수 없다.
{
  class Person {
    // `private` 필드 정의
    #name = "";

    constructor(name) {
      // `private` 필드 참조
      this.#name = name;
    }
  }

  const john = new Person("John");

  // `private` 필드인 `#name`은 외부에서 참조할 수 없다.
  // console.log(john.#name); // Uncaught SyntaxError: Private field '#name' must be ~
}

// 이처럼 클래스 외부에서 `private` 필드에 직접 전근할 수 있는 방법은 없다.
// 다만 접근자 프로퍼티를 통해 간접적으로 접근하는 방법은 유효하다.
{
  class Person {
    // `private` 필드 정의
    #name = "";

    constructor(name) {
      // `private` 필드 참조
      this.#name = name;
    }

    // getter 접근자 프로퍼티
    get name() {
      return this.#name;
    }
  }

  const john = new Person("John");
  console.log(john.name); // John
}

// 25-7-5. static 필드 정의 제안
// 자바스크립트의 클래스에는 `static` 키워드를 사용하여 정적 메서드를 정의할 수 있다.
// 마찬가지로 `static` 키워드를 이용하여 프로퍼티 필드를 정의할 수 있다.
{
  class CustomMath {
    // `static public` 필드 정의
    static PI = 22 / 7;

    // `static private` 필드 정의
    static #num = 10;

    // `static` 메서드
    static increment() {
      return ++CustomMath.#num;
    }
  }

  console.log(CustomMath.PI); // 3.142857142857143
  console.log(CustomMath.increment()); // 11
  console.log(CustomMath.increment()); // 12
}

/**
 * 25-8. 상속에 의한 클래스 확장
 *
 */

// 25-8-1. 클래스 상속과 생성자 함수 상속
// 상속에 의한 클래스 확장은 프로토타입 기반의 상속과는 다른 개념이다.
// 프로토타입 기반의 상속은 프로토타입 체인을 통해 다른 객체의 자산을 상속받는 개념이지만,
// 상속에 의한 클래스 확장은 `기존 클래스를 상속받아 새로운 클래스를 확장(extends)하여 정의`하는 것이다.
// 클래스와 생성자 함수는  인스턴스를 생성하는 함수라는 점에서 유사하지만,
// 클래스는 상속을 통해 기존 클래스를 확장할 수 있는 문법이 제공되지만 생성자 함수는 그렇지 않다.
{
  class Animal {
    constructor(age, weight) {
      this.age = age;
      this.weight = weight;
    }

    eat() {
      return "Eat";
    }

    move() {
      return "Move";
    }
  }

  // 상속을 통해 `Animal` 클래스를 확장한 `Bird` 클래스
  class Bird extends Animal {
    fly() {
      return "Fly";
    }
  }

  const sparrow = new Bird(1, 200);

  console.log(sparrow); // Bird {age: 1, weight: 200}
  console.log(sparrow instanceof Bird); // true
  console.log(sparrow instanceof Animal); // true
  console.log(sparrow.eat()); // Eat
  console.log(sparrow.fly()); // Fly
  console.log(sparrow.move()); // Move
}

// 25-8-2. extends 키워드
// 상속을 통해 클래스를 확장하려면 `extends` 키워드를 사용하여 상속받을 클래스를 정의한다.
// 상속을 통해 확장된 클래스는 sub-class라 부르고, 그에 상속된 클래스를 super-class라 부른다.
// super-class와 sub-class는 인스턴스의 프로토타입 체인 뿐만 아니라 클래스의 프로토타입 체인도 생성한다.
// 따라서 프로토타입 메서드, 정적 메서드 모두 상속이 가능하다.
{
  // Super class (전신/부모)
  class Base {}

  // Sub class (파생/자식)
  class Derived extends Base {}
}

// 25-8-3. 동적 상속
// `extends` 키워드는 클래스뿐만 아니라 생성자 함수를 상속받아 클래스를 확장할 수 있다.
// 단, `extends` 키워드 앞에는 항상 클래스가 위치해야 한다.
{
  // constructor function
  function Base(name) {
    this.name = name;
  }

  // sub class
  class Derived extends Base {}

  const derived = new Derived("Derived Instance");

  console.log(derived); // Derived {name: 'Derived Instance'}
}

// `extends` 키워드의 우측 피연산자는 클래스뿐만 아니라
// [[Construct]] 내부 메서드를 갖는 함수 객체로 평가될 수 있는 모든 표현식을 사용할 수 있다.
{
  // constructor function
  function BaseConstructor() {}

  // class
  class BaseClass {}

  // condition
  const condition = true;

  // dynamic sub class
  class DynamicDerived extends (condition ? BaseConstructor : BaseClass) {}

  const dynamicDerived = new DynamicDerived();

  console.log(dynamicDerived); // Derived {}
  console.log(dynamicDerived instanceof BaseConstructor); // true
  console.log(dynamicDerived instanceof BaseClass); // false
}

// 25-8-4. 서브클래스의 constructor
// 클래스 내부에서 `constructor`를 생략하면 암묵적으로 비어있는 `constructor`가 정의된다.
// 👉 constructor () {}

// 확장된 sub class 내부에서 `constructor`를 생략하면 암묵적으로 다음과 같은 `constructor`가 정의된다.
// 👉 constructor (...args) { super(...args); }
// `super` 함수는 super class의 `constructor`를 호출하여 인스턴스를 생성한다.

{
  // super class
  class SuperClass {}

  // sub class
  class SubClass extends SuperClass {}

  // 위의 `SuperClass`와 `SubClass`의 내부 `constructor`는 실제로 다음과 같이 구성된다.
  // super class
  class SuperClass2 {
    constructor() {}
  }

  // sub class
  class SubClass2 extends SuperClass2 {
    constructor(...args) {
      super(...args);
    }
  }

  const derived = new SubClass2();
  console.log(derived); // SubClass2 {}

  // super class와 sub class 모두 `constructor`를 생략하면 빈 객체가 생성된다.
  // 미래에 생성될 인스턴스의 프로퍼티를 추가하려면 `constructor` 내부에 프로퍼티를 추가해야 한다.
}

// 25-8-5. super 키워드
// `super` 키워드는 함수처럼 호출할 수도 있고 `this`와 같이 식별자처럼 참조할 수 있는 특수한 키워드다.
// `super`는 다음과 같이 동작한다.

// 👉 `super`를 호출하면 super class의 `constructor`를 호출한다.
// 👉 `super`를 참조하면 super class의 메서드를 호출할 수 있다.

// 🎯 `super` 호출 (sub class에 인스턴스의 property가 없는 경우)
{
  // super class
  class Base {
    constructor(a, b) {
      this.a = a;
      this.b = b;
    }
  }

  // sub class
  class Derived extends Base {
    // 암묵적으로 `constructor`가 정의된다.
    // constructor (...args) { super(...args); }
  }

  const derived = new Derived(1, 2);
  console.log(derived); // Derived {a: 1, b: 2}
}

// 🎯 `super` 호출 (sub class에 인스턴스의 property가 있는 경우)
{
  // super class
  class Base {
    constructor(a, b) {
      this.a = a;
      this.b = b;
    }
  }

  // sub class
  class Derived extends Base {
    constructor(a, b, c) {
      super(a, b);
      this.c = c;
    }
  }

  const derived = new Derived(1, 2, 3);
  console.log(derived); // Derived {a: 1, b: 2, c: 3}
}

// 🎯 `super` 참조
// 메드드 내부에세 `super`를 참조하면 수퍼클래스의 메서드를 호출할 수 있다.
{
  // super class
  class Base {
    constructor(name) {
      this.name = name;
    }

    sayHi() {
      return `Hi, ${this.name}`;
    }
  }

  // sub class
  class Derived extends Base {
    constructor(name) {
      super(name);
    }
  }

  const john = new Derived("John");
  john.sayHi(); // Hi, John
}

// 25-8-6. 상속 클래스의 인스턴스 생성 과정
// 상속 관계에 있는 두 클래스가 협력하여 인스턴스를 생성하는 방법
{
  // super class
  class Rectangle {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }

    getArea() {
      return this.width * this.height;
    }

    toString() {
      return `width = ${this.width}, height = ${this.height}`;
    }
  }

  // sub class
  class ColorRectangle extends Rectangle {
    constructor(width, height, color) {
      super(width, height);
      this.color = color;
    }

    // method overriding
    toString() {
      return super.toString() + `, color = ${this.color}`;
    }
  }

  const colorRectangle = new ColorRectangle(2, 4, "red");
  console.log(colorRectangle); // {width: 2, height: 4, color: 'red'}

  // 상속을 통한 `getArea` 메서드 호출
  console.log(colorRectangle.getArea()); // 8

  // 오버라이딩된 `toString` 메서드 호출
  console.log(colorRectangle.toString()); // width = 2, height = 4, color = red
}

// 25-8-7. 표준 빌트인 생성자 함수 확장
// `extends` 키워드를 활용하면 클래스뿐만이 아니라 [[Constructor]] 내부 메서드를 갖는 함수 객체로 평가되는 모든 표현식을 사용할 수 있다.
// 쉽게 말하면, `String`, `Number`, `Array` 같은 표준 빌트인 객체도 `extends` 키워드를 활용하여 확장할 수 있다는 의미다.
{
  class MyArray extends Array {
    // 중복된 배열 요소를 제거하고 반환
    uniq() {
      return this.filter((val, idx, arr) => arr.indexOf(val) === idx);
    }
  }

  const myArray = new MyArray(1, 1, 2, 3);
  console.log(myArray.uniq()); // [1, 2, 3]
}
