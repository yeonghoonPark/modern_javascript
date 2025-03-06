"use strict";

/**
 * 24. 클로저(closure)
 *
 * 클로저는 자바스크립트 고유의 개념이 아니다.
 * 함수를 일급 객체로 취급하는 함수형 프로그래밍 언어(Haskell, Lisp, Scala, and etc)에서 사용되는 특성이다.
 * MDN에서는 클로저에 대해 다음과 같이 정의하고 있다.
 *
 * "A closure is the combination of a function and the lexical environment within which that function was declared."
 * "클로저는 함수와 그 함수가 선언된 렉시컬 환경과의 조합이다."
 *
 * 클로저는 렉시컬 스코프에 따라 상위 스코프에서 하위 스코프를 참조할 수 없는 문제를 해결함과 동시에 상위 스코프에서 하위 스코프의 식별자를 계속 참조할 수 있는 개념이다.
 * 실행 컨텍스트가 생성될 때 환경 레코드도 생성되며, 실행 컨텍스트가 종료된다고 하더라도 환경 레코드는 바로 사라지지 않는다는 점을 이용한 것이며,
 * 이는 정보 은닉, 상태의 지속성 유지, 캡슐화, 비동기 처리, 코드 모듈화 등의 장점으로 이어진다.
 *
 *
 * 📚. 일급 객체(`first-class object`)란?
 *  1. 무명으로 생성할 수 있다. 즉, 런-타임에 생성할 수 있다.
 *  2. 변수나 자료구조(객체, 배열)에 저장할 수 있다.
 *  3. 함수의 인자와 반환값으로 사용할 수 있다. 즉 값으로 사용할 수 있다.
 *  위의 조건을 만족하는 객체를 일급 객체라 한다.
 *
 * 📚. 렉시컬 스코프(`lexical scope`)란?
 *  - 함수가 어디서 정의되었냐에 따라 상위 스코프를 참조하는 방식이다.
 *   (반대 개념은 다이나믹 스코프(`dynamic scope`)라 하며 함수가 실행될 때 호출 위치에 따라 상위 스코프를 참조하는 방식이다.)
 *
 */

// 👉 예문
{
  // `inner` 함수는 `outer` 함수의 중첩 함수로 정의되었으며,
  // `outer` 함수는 `inner` 함수의 상위 스코피이다.
  // `inner` 함수는 `outer` 함수의 식별자 `x`를 참조할 수 있지만,
  // 반대로 `outer` 함수는 `inner` 함수 내부에서 선언된 식별자 `y`를 참조할 수 없다.
  // 이는 자바스크립트가 렉시컬 스코프를 따르는 프로그래밍 언어이기 때문에 발생하는 현상이다.

  const outer = () => {
    const x = 10;
    // console.log(y); // ReferenceError: y is not defined

    const inner = () => {
      const y = 10;
      console.log(x); // 10
    };

    inner();
  };

  outer();
}

/**
 * 24-1. 렉시컬 스코프(Lexical scope)
 *
 * 렉시컬 스코프란,
 * 🔑 함수를 어디서 호출했는지가 아니라 함수를 어디에 정의했는지에 따라 상위 스코프를 결정하는 방식을 말한다.
 *
 * 자바스크립트는 렉시컬 스코프를 가진다.
 * 소스코드에 따라 실행 컨텍스트가 생성되면 변수나 함수와 같은 식별자를 관리하기 위한 렉시컬 환경이 생성된다.
 * 렉시컬 환경은 2가지 컴포넌트로 구성된다.
 * 생성된 실행 컨텍스트의 식별자를 관리하기 위한 "환경 레코드"와
 * 상위 스코프의 식별자를 참조하기 위한 "외부 렉시컬 환경 참조"로 구성된다.
 * 여기서 말하는 상위 스코프를 결정하는 방식에 대해 렉시컬 스코프를 따르며, 이 개념을 반영하여 렉시컬 스코프를 정의한다면
 * "외부 렉시컬 환경에 대한 참조"에 저장할 참조값,
 * 🔑 즉 상위 스코프에 대한 참조는 함수 정의가 평가되는 시점에 함수가 정의된 위치에 의해 결정된다.
 *
 * 이를 렉시컬 스코프라 한다.
 *
 */

// 👉 예문

// 자바스크립트에서 상위 스코프는 함수를 어디서 정의했느냐에 따라 결정된다.
// `foo` 함수와 `bar` 함수는 전역 소스코드에서 정의되므로, 두 함수의 상위 스코프는 전역이다.
// `foo` 함수 내부에서 `bar` 함수를 호출하였지만, 함수의 호출 위치는 상위 스코프를 결정하는데 아무런 영향도 주지 못한다.
// 즉, 함수의 상위 스코프는 함수를 정의한 위치에 의해 정적으로 결정되고 변하지 않는다.

const x = 1;

function foo() {
  const x = 10;
  bar();
}

function bar() {
  console.log(x);
}

foo(); // 1
bar(); // 1

/**
 * 24-2. 함수 객체의 내부 슬롯 [[Environment]]
 *
 * 함수는 정의된 위치(환경)와 호출되는 위치(환경)가 다를 수 있다.
 * 렉시컬 스코프가 가능하게 하려면 함수 자신이 호출되는 위치와 상관없이 자신이 정의된 위치,
 * 상위 스코프(함수 정의가 위치하는 스코프가 바로 상위 스코프다)를 기억해야한다.
 * 🔑 함수는 자신이 정의된 위치, 즉 상위 스코프를 기억하기 위해 [[Environment]]에 자신이 정의된 환경을 참조한다.
 * 다시 말해 [[Environment]]에 참조된 값은 "외부 렉시컬 환경 참조"다.
 *
 */

// 👉 예문
{
  const x = 1;

  // `bar` 함수는 [[Environment]] 내부 슬롯에 예문의 {} 스코프의 환경을 참조한다.
  const bar = () => {
    console.log(x);
  };

  const foo = () => {
    const x = 10;

    // `bar` 함수의 상위 스코프는 `bar` 함수가 정의된 곳이다.
    // 따라서 해당 예문에서는 {} 내부를 의미한다.
    bar();
  };

  foo(); // 1
  bar(); // 1
}

/**
 * 24-3. 클로저와 렉시컬 환경
 *
 */

// 👉 예문
{
  const x = 1;

  // 1.
  const outer = () => {
    const x = 10;

    const inner = () => {
      // 2.
      console.log(x);
    };

    return inner;
  };

  // 3. `outer` 함수를 호출하면, `outer` 함수는 `inner` 함수를 반환하고, `outer` 함수의 실행 컨텍스트는 호출 스택에서 제거된다.
  const innerFunc = outer();

  // 4. 반환된 `inner` 함수
  innerFunc(); // 10

  // 🔑 이미 생명 주기가 종료한 `outer` 외부 함수의 식별자를 참조할 수 있다. 이러한 중첩 함수를 클로저라 한다.
  // `outer` 함수의 실행 컨텍스트가 종료되고 호출 스택에서 제거되더라도,
  // 함께 생성된 렉시컬 환경은 바로 소멸하지 않는다. 또한 어딘가에서 참조하고 있다면 제거되지 않는다.
  // 위 예문에서 `inner` 함수는 `innerFunc` 라는 식별자에 의해 참조되고 있으므로 가비지 컬렉션의 대상이 아니다.
  // 가비지 컬렉터는 누군가가 참조하고 있는 메모리 공간을 함부로 해제하지 않는다.
}

// 자바스크립트의 모든 함수는 상위 스코프를 기억하므로 이론적으로 모든 함수는 클로저다.
// 하지만 일반적으로 모든 함수를 클로저라고 하지는 않는다.

// 👉 예문
{
  function foo() {
    const x = 1;
    const y = 2;

    // 🔑 `bar` 함수는 상위 스코프의 식별자를 참조하지 않아 클로저라 하지 않는다.
    function bar() {
      const z = 3;

      // debugger;
      console.log(z);
    }

    return bar();
  }

  foo();
}

// 👉 예문
{
  function foo() {
    const x = 1;

    // 🔑 `bar` 함수는 클로저였지만 반환되지 않아 곧 소멸한다. 이러한 함수는 클로저라 하지 않는다.
    // `foo` 함수의 라이프 사이클이 중첩 함수인 `bar` 함수보다 길다.
    function bar() {
      // debugger;

      // 상위 스코프를 참조하고 있다.
      console.log(x);
    }

    // 반환하지 않고 단지 호출한다.
    bar();
  }

  foo();
}

// 👉 예문
{
  function foo() {
    const x = 1;
    const y = 2;

    // 🔑 `bar` 함수는 외부 함수 `foo` 보다 더 오래 유지되며 상위 스코프의 식별자를 참조하는 클로저다.
    function bar() {
      // debugger;
      console.log(x);
    }

    return bar;
  }

  // 블록 내부에서 `foo` 함수를 참조하고 있다.
  const bar = foo();

  bar();

  // 🔑 클로저는 중첩 함수가 상위 스코프의 식별자를 참조하고,
  // 중첩 함수가 외부 함수보다 라이프 사이클이 더 오래 유지되는 경우에 한정하는 것이 일반적이다.

  // 📚 이론적으로 클로저는 상위 스코프를 기억해야 하므로 불필요한 메모리의 점유를 걱정할 수 있다.
  // 하지만 모던 자바스크립트 엔진은 최적화가 잘 되어 있어 걱정할 대상은 아니다.
}

/**
 * 24-5. 클로저의 활용
 *
 * 클로저는 상태를 안전하게 변경하고 유지하기 위해 사용한다.
 * 쉽게 말하면, 상태가 의도치 않게 변경되지 않도록 상태를 안전하게 은닉하고 특정 함수에게만 상태 변경을 허용한다.
 *
 */

// 👉 예문1
{
  // 함수가 호출될 때마다 호출된 횟수를 누적하여 출력하는 카운터를 만든다.
  // 호출된 횟수(`calledCount`)가 바로 안전하게 변경하고 유지해야 할 상태다.

  let calledCount = 0;

  const increaseCount = () => {
    return ++calledCount;
  };

  increaseCount(); // 1
  increaseCount(); // 2
  increaseCount(); // 3

  // 얼핏보면 잘 동작하지만, 오류를 발생시킬 가능성을 내포하고 있다.
  // 오류 없이 동작하기 위해서는 전제 조건이 지켜져야 하기 때문이다.
  // 1. 카운트 상태는 `increaseCount` 함수가 호출되기 전까지 변경되지 않고 유지되어야 한다.
  // 2. 1번을 위해 `calledCount` 변수는 `increaseCount` 함수에 의해서만 값을 변경할 수 있어야 한다.
}

// 👉 예문2
{
  // 예문1의 문제점을 해결하기 위해 호출된 횟수 변수를 함수 내부에 선언하여 함수만이 변수를 참조할 수 있도록 한다.
  const increaseCount = () => {
    let calledCount = 0;

    return ++calledCount;
  };

  increaseCount(); // 1
  increaseCount(); // 1
  increaseCount(); // 1

  // 이전 상태를 유지하지 못하고 함수를 여러번 호출하더라도 동일한 값 1을 반환한다.
  // 이러한 현상이 나타나는 이유는 함수가 호출될 때마다 지역 변수 `calledCount`는 0으로 초기화되기 때문이다.
  // 다시 말해, 상태가 변경되기 이전 상태를 유지하지 못한다는 문제점이 있다.
}

// 👉 예문3
{
  const increaseCount = () => {
    let calledCount = 0;

    return () => {
      return ++calledCount;
    };
  };

  const getCalledCount = increaseCount();

  getCalledCount(); // 1
  getCalledCount(); // 2
  getCalledCount(); // 3

  // 변수 `getCalledCount`에 참조되는 `increaseCount` 함수는 실행 뒤 종료되지만,
  // `increaseCount` 함수가 반환한 화살표 함수는 `getCalledCount` 변수에게 참조되고 있어 상위 스코프의 렉시컬 환경을 기억하고 있다.
  // `increaseCount` 함수 내부의 변수 `calledCount`는 외부에서 직접 접근할 수 없는 은닉된 변수이므로 의도되지 않은 변경에 대해 안정성을 확보한다.
  // 🔑 클로저는 상태가 의도치 않게 변경되지 않도록 안전하게 은닉하고 특정 함수에게만 상태 변경을 허용하여 상태를 안전하게 변경하고 유지할 수 있다.
}

// 👉 예문4
{
  // `makeCounter` 함수는 함수를 인자로 전달 받는 고차 함수이다.
  // 이 함수는 카운트 상태를 유지하기 위한 `counter` 변수를 기억하는 클로저 함수를 반환한다.
  const makeCounter = (func) => {
    // 카운트 상태를 유지하기 위한 변수
    let counter = 0;

    // 클로저 함수를 반환
    return () => {
      counter = func(counter);
      return counter;
    };
  };

  // 보조 함수 `increase`는 `makeCounter` 함수의 인자로 전달된다.
  const increase = (counter) => ++counter;

  // 보조 함수 `decrease`는 `makeCounter` 함수의 인자로 전달된다.
  const decrease = (counter) => --counter;

  const increaseCount = makeCounter(increase);
  increaseCount(); // 1
  increaseCount(); // 2

  const decreaseCount = makeCounter(decrease);
  decreaseCount(); // -1
  decreaseCount(); // -2

  // 🚨 주의할 점은 식별자로 선언된 `increaseCount`와 `decreaseCount`는 `makeCounter` 함수에게 반환된 독립적 렉시컬 환경을 갖는다.
  // 즉, `increaseCount`와 `decreaseCount` 함수들은 각각 자신만의 독립된 렉시컬 환경을 갖기 때문에 클로저를 반환하는 `makeCounter`의 자유 변수 `counter`를 공유하지 않는다.
  // 따라서 클로저를 반환하는 함수의 `counter`를 공유하는 클로저를 만들어야 한다.
}

// 👉 예문5
{
  const makeCounter = () => {
    // 카운트 상태를 유지하기 위한 자유 변수
    let counter = 0;

    return {
      // 클로저 반환
      increase: () => ++counter,
      decrease: () => --counter,
    };
  };

  const counter = makeCounter();

  counter.increase(); // 1
  counter.increase(); // 2
  counter.decrease(); // 1
  counter.decrease(); // 0

  // `makeCounter` 함수는 자유 변수 `counter`를 참조하는 클로저 함수 `increase`와 `decrease`를 반환한다.
  // 상탯값을 유지하고, 외부에서는 `increase`와 `decrease` 메서드를 통해서만 상탯값을 제어할 수 있다.
  // 즉, 상탯값 변경에 대한 캡슐화와 외부로 부터 은닉되어 안정성을 가진다.
}
