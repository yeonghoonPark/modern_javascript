/**
 * 23-1. 소스코드의 타입
 *
 * 실행 컨텍스트(execution context)는 자바스크립트의 동작 원리를 담고 있는 핵심 개념이다.
 * 실행 컨텍스트를 바르게 이해하면 스코프, 식별자, 호이스팅, 클로저, 태스크 큐, 이벤트 핸들러 등의 동작을 이해할 수 있다.
 * ECMAScript 사양은 소스코드를 4가지 타입으로 구분한다.
 * 아래의 4가지 타입의 소스코드는 실행 컨텍스트를 생성한다.
 *
 * 1. 전역 코드 (global code)
 * - 전역에 존재하는 소스 코드를 말한다. 전역에 정의된 함수, 클래스 등의 내부 코드는 포함되지 않는다.
 *
 * 2. 함수 코드 (function code)
 * - 함수 내부에 존재하는 코드를 말한다. 함수 내부에 중첩 함수, 클래스 등의 내부 코드는 포함되지 않는다.
 *
 * 3. eval 코드 (eval code)
 * - 전역 객체의 메서드인 `eval` 메서드에 인자로 전달되어 실행되는 코드를 말한다.
 *
 * 4. 모듈 코드 (module code)
 * - 모듈 내부에 존재하는 소스 코드를 말한다. 모듈 내부의 함수, 클래스 등의 내부 코드는 포함되지 않는다.
 *
 * 위의 4가지 타입의 소스 코드로 구분하는 이유는 타입에 따라 실행 컨텍트스를 생성하는 과정과 관리 내용이 다르기 때문이다.
 *
 * 즉,
 * 🔑 실행 컨텍스트는 식별자의 유효 범위를 설정하는 스코프 체인을 생성하고 관리하는 역할을 하며,
 * 소스코드의 타입에 따라 실행 컨텍스트를 생성하고 관리하는 방식이 다르다는 점을 유의해야 한다.
 *
 */

// 1️⃣ 전역 코드 (global code) / 전역 실행 컨텍스트 (global execution context)
// 전역 코드는 전역 변수를 관리하기 위해 최상위 스코프인 전역 스코프를 생성한다.
// `var` 키워드로 선언된 전역 변수와 `function` 키워드로 정의된 전역 함수들을 전역 객체의 프로퍼티와 메서드로 참조(바인딩)하기 위해 전역 객체와 연결되어야 한다.
// 이를 위해 전역 코드가 평가되면 전역 실행 컨텍스트가 생성된다.
// 📚 전역 실행 컨텍스트는 브라우저에서 페이지가 로드될 때 자동으로 생성된다.

// 2️⃣ 함수 코드 (function code) / 함수 실행 컨텍스트 (function execution context)
// 함수 코드는 지역 변수, 매개변수, argument 객체를 관리하기 위해 지역 스코프를 생성한다.
// 생성한 지역 스코프는 전역 스코프와 스코프 체인의 일원으로 연결해야 한다.
// 이를 위해 함수 코드가 평가되면 함수 실행 컨텍스트가 생성된다.
// 📚 함수 실행 컨텍스트는 함수로 평가되거나 함수가 호출될 때마다 새로 생성된다.
// 🔑 함수 실행 컨텍스트는 키워드에 따라 다르게 동작한다.
// `function`: 함수 선언이 호이스팅되어 전역 컨텍스트가 생성될 때 이미 함수로 평가되므로, 함수 실행 컨텍스트가 즉시 생성된다.
// `var`: 호이스팅은 발생하지만 변수 선언만 호이스팅되어 함수 표현식이 실제로 할당될 때 함수 실행 컨텍스트가 생성된다.
// `let` / `const`: 호이스팅은 발생하지만 TDZ(Temporal Dead Zone)로 인해 선언 전에 참조할 수 없으며, 정의된 후에 호출 시 함수 실행 컨텍스트가 생성된다.

// 3️⃣ eval 코드 (eval code) / eval 실행 컨텍스트 (eval execution context)
// `eval` 코드는 스트릭트 모드에서는 자신만의 독자적인 스코프를 생성하고, 논-스트릭트 모드라면 외부 스코프(전역 또는 함수)를 공유한다.
// 이를 위해 eval 코드가 평가되면 eval 실행 컨텍스트가 생성된다.
// 📚 eval 실행 컨텍스트는 `eval` 함수가 호출될 때 생성된다.
// ❌ 보안, 성능의 문제로 사용하지 않아야 한다.

// 4️⃣ 모듈 코드 (module code) / 모듈 실행 컨텍스트 (module execution context)
// 모듈 코드는 모듈별로 독립적인 모듈 스코프를 생성한다.
// 이를 위해 모듈 코드가 평가되면 모듈 실행 컨텍스트가 생성된다.
// 📚 모듈 실행 컨텍스트는 `export` 키워드가 사용된 변수, 함수, 클래스 등의 모듈이 `import` 키워드를 통해 모듈을 로드할 때 생성된다.

/**
 * 23-2. 소스코드의 평가와 실행
 *
 * 자바스크립트 엔진은 런타임 이전에 소스코드를 평가하고, 런타임에 소스코드를 실행한다.
 * 소스코드를 2개의 과정, 즉 `소스코드 평가` → `소스코드 실행` 과정으로 나누어 처리한다.
 *
 * 소스코드를 평가하는 과정에서는
 * 소스코드에 따라 실행 컨텍스트를 생성하고 변수, 함수 등의 선언문만 먼저 실행하여 생성된 변수나 함수 식별자를 프로퍼티 키로 실행 컨텍스트가 관리하는 스코프에 등록한다.
 *
 * 소스코드를 실행하는 과정에서는
 * 소스코드를 실행하는 데 필요한 정보, 즉 변수나 함수의 참조를 실행 컨텍스트가 관리하는 스코프에서 검색해서 참조한다.
 * 이때 변숫값의 변경 등 소스코드의 실행 결과는 다시 실행 컨텍스트가 관리하는 스코프에 등록된다.
 *
 */

// 👉 소스코드 예문
// 아래의 소스코드는 `소스코드 평가`와 `소스코드 실행`으로 분리할 수 있다.

// 소스코드 평가(런타임 이전): `var` 키워드를 이용하여 선언된 식별자 `x`는 실행 컨텍스트를 통해 스코프에 등록되고 초기화 과정을 거쳐 `undefined`를 참조하게 된다.
var x; // undefined

// 소스 코드 실행(런타임): 식별자 `x`가 선언된 변수인지 확인 후, 식별자 `x`는 10이라는 값을 참조한다. (만약 선언되지 않았다면 암묵적 전역이 발생한다)
x = 10;

/**
 * 23-3. 실행 컨텍스트의 역할
 *
 * 실행 컨텍스트는 식별자(변수, 함수 클래스 등)를 등록하고 관리하는 스코프와 코드 실행 순서 관리를 구현하는 내부 메커니즘이다.
 * 이때 식별자와 스코프는 실행 컨텍스트의 렉시컬 환경으로 관리되며 실행 순서는 실행 컨텍스트의 스택 자료구조로 관리된다.
 *
 */

// 👉 소스코드 예문
// 아래의 소스코드는 실행 컨텍스트 단위로 `소스코드 평가`와 `소스코드 실행`으로 분리할 수 있다.

// 전역 변수 선언
const a = 1;
const b = 2;

// 전연 함수 선언
function foo(number) {
  // 지역 변수 선언
  const a = 10;
  const b = 20;

  // 반환
  return number + a + b;
}

foo(100); // 130

a + b; // 3

// 1. 전역 소스코드 평가
// 소스코드가 평가되는 과정에서는 선언문만 먼저 평가한다.
// 이때 `function` 키워드를 이용하여 선언한 `foo` 함수만 생성된 전역 컨텍스트를 통해 전역 객체의 메서드로 등록된다.
// 만약 `var` 키워드를 이용한 전연 변수가 선언되어 있었다면 해당 식별자는 전역 객체의 프로퍼티로 등록된다.
// 🔑 이때 `let` 또는 `const` 키워드를 이용한 변수 선언문 또한 호이스팅이 발생하고 평가되지만, 초기화는 소스코드를 실행하는 런타임 과정에서 이루어지기 때문에 자바스크립트는 초기화하지 않은 변수를 참조할 수 없어 `TDZ`가 일시적으로 발생한다.
// 즉, `let` 과 `const` 키워드를 통해 선언한 전역 변수는 전역 객체의 프로퍼티로 등록되지 않는다.

// 2. 전역 소스코드 실행
// 전역 소스코드 평가 과정이 끝났다면 전역 소스코드를 순차적으로 실행한다.
// 이때 전역 변수에 값이 할당되고 함수가 호출된다. (즉, `const` 키워드를 사용한 전역 변수인 `a`와 `b`에 선언 → 초기화 → 할당이 이루어진다)
// 순차적으로 코드를 실행하는 중 `foo` 함수가 호출되면 순차적으로 실행되던 전역 소스코드 실행은 일시 중단하고 코드 실행 순서를 변경하여 함수 내부로 진입한다.
// 🔑 코드가 일시적으로 중단된다는 의미는 콜 스택(`Call stack`)에 쌓인 상태라는 의미다.

// 3. 함수 소스코드 평가
// `foo` 함수 호출에 의해 코드 실행 순서가 변경되어 함수 내부로 진입하면 함수 내부의 문들을 실행하기에 앞서 함수 내부의 선언문을 평가한다.
// 이때 매개변수로 전달된 인자와 지역 변수 등을 평가하고 함수 실행 컨텍스트에 등록한다. (이때 `this` 바인딩도 결정된다)
// 🔑 함수 실행 컨텍스트가 콜 스택에 쌓이기 전에 매개변수로 전달된 인자와 지역 변수는 호이스팅이 발생한다.

// 4. 함수 소스코드 실행
// 함수 소스코드 평가가 끝나면 순차적으로 함수 소스코드를 순차적으로 실행한다.
// 이때 매개변수로 전달된 인자와 지역 변수의 값이 할당되고 연산을 통해 값을 반환한다.
// 모든 소스코드를 실행하여 반환까지 완료하면 함수 호출 이전으로 되돌아가 전역 코드 실행을 계속한다.
// 🔑 함수 소스코드 실행될 때 콜 스택에 쌓이고 실행이 종료되면 콜 스택에서 해당 함수 실행 컨텍스트가 빠져나온다는 것을 의미한다.
// 콜 스택은 `LIFO`(Last In First Out)의 구조를 가지며 스택이 종료되면 전역 소스코드를 실행하는 부분으로 돌아가 순차적으로 코드를 끝까지 실행한다.

// 🔑 실행 컨텍스트는 스코프, 식별자, 코드 실행 순서를 관리한다.
// 1. 선언에 의해 생성된 모든 식별자(변수, 함수, 클래스 등)의 스코프를 구분하고 등록하여 지속적으로 관리한다.
// 2. 스코프는 중첩 관계에 의해 스코프 체인을 형성하며 상위 스코프의 식별자를 참조할 수 있다.
// 3. 현재 실행 중인 코드의 실행 순서를 변경할 수 있고 종료되면 다시 돌아갈 수 있다.
// 즉, 실행 컨텍스트는 소스코드를 실행하는 데 필요한 환경을 제공하고 코드의 실행 결과를 실제로 관리하는 역할을 한다.

/**
 * 23-4. 실행 컨텍스트 스택
 *
 * 소스코드에 따라 스코프의 유효 범위, 스코프체인, 실행 순서를 관리하는 실행 컨텍스트는 스택(stack) 자료구조로 관리된다.
 * 이를 실행 컨텍스트 스택이라고 한다. (실행 컨텍스트 스택을 콜 스택이라 부르기도 한다)
 * 실행 컨텍스트 스택(콜 스택)은 `LIFO`의 구조를 가지며 순서에 따라 추가(push)되고 제거(pop)된다.
 *
 */

// 👉 소스코드 예문
// 전역 변수 선언
const numOne = 1;

// 전역 함수 선언
function qux() {
  // 지역 변수 선언
  const numTwo = 2;

  // 중첩 함수 선언
  function bar() {
    // 지역 변수 선언
    const numThree = 3;

    return numOne + numTwo + numThree;
  }

  return bar();
}

qux(); // 6

// 위 소스코드를 실행 컨텍스트 스택에 쌓이는 구조는
// `전역 실행 컨텍스트` → `quz 함수 실행 컨텍스트` → `bar 함수 실행 컨텍스트` 순으로 추가되고.
// `bar 함수 실행 컨텍스트` → `quz 함수 실행 컨텍스트` → `전역 실행 컨텍스트` 순으로 제거된다.

// 위 소스코드의 평가와 실행 단계를 기술하면 다음과 같다.
// 1. 전역 소스코드 평가와 실행
// * 평가: 전역 코드를 평가하여 전역 실행 컨텍스트를 생성하고 실행 컨텍스트 스택에 추가한다.
// 이때 전역 변수 `numOne`과 전역 함수 `qux`는 전역 실행 컨텍스트에 등록된다.
// * 실행: 전역 코드가 순차적으로 실행된다.
// 이때 `const` 키워드로 선언된 `numOn`은 초기화와 재할당 단계를 거쳐 값을 가지고 함수 `qux`가 호출된다.

// 2. qux 함수 소스코드 평가와 실행
// `qux` 함수가 호출되면 전역 실행 컨텍스트는 스택에 쌓인 채 잠시 중단되고 코드의 제어권은 `qux` 함수 내부로 이동하여 평가와 실행 단계를 거친다.
// * 평가: 함수 코드를 평가하여 `qux` 함수 실행 컨텍스트를 생성하고 실행 컨텍스트 스택에 추가한다.
// 이때 지역 변수인 `numTwo`와 중첩 함수 `bar`는 함수 실행 컨텍스트에 등록된다.
// * 실행: 함수 코드가 순차적으로 실행된다.
// 이때 `const` 키워드로 선언된 `numTwo`는 초기화와 재할당 단계를 거쳐 값을 가지고 반환값인 함수 `bar`가 호출된다.

// 3. bar 함수 소스코드 평가와 실행
// `bar` 함수가 호출되면 `bar` 함수 실행 컨텍스트는 스택에 쌓인 채 잠시 중단되고 코드의 제어권은 `bar` 함수 내부로 이동하여 평가와 실행 단계를 거친다.
// * 평가: 함수 코드를 평가하여 `bar` 함수 실행 컨텍스트를 생성하고 실행 컨텍스트 스택에 추가한다.
// 이때 지역 변수인 `numThree`는 `bar` 함수 실행 컨텍스트에 등록된다.
// * 실행: 함수 코드가 순차적으로 실행된다.
// 이때 `const` 키워드로 선언된 `numThree` 는 초기화와 재할당 단계를 거쳐 값을 가지고 연산한 값을 반환하는 것을 끝으로 함수를 종료한다.

// 4. qux 함수 소스코드로 복귀
// `bar` 함수가 종료되면 코드의 제어권은 다시 `foo` 함수로 이동한다.
// 이때 자바스크립트 엔진은 `bar` 함수 실행 컨텍스트를 실행 컨텍스트 스택에서 제거한다.
// `quz` 함수는 `bar` 함수를 반환하는 것을 끝으로 함수를 종료한다.

// 5. 전역 실행 소스코드로 복귀
// `foo` 함수가 종료되면 코드의 제어권은 다시 전역 소스코드로 이동한다.
// 이때 자바스크립트 엔진은 `foo` 함수 실행 컨텍스트를 실행 컨텍스트 스택에서 제거한다.
// 이로써 실행 컨텍스트에는 아무것도 남아있지 않게 된다.

// 🔑 실행 컨텍스트 스택은 코드의 실행 순서를 관리한다.
// 실행 컨텍스트 스택인 `LIFO`의 구조를 가지며 스택의 최상위에 존재하는 실행 컨텍스트는 언제나 실행 중인 코드의 실행 컨텍스트다.
// 이를 실행 중인 실행 컨텍스트(running execution context)라 한다.

/**
 * 23-5. 렉시컬 환경
 *
 * 렉시컬 환경(lexical environment)는
 * 식별자와 식별자가에 바인딩된 값, 그리고 상위 스코프에 대한 참조를 기록하는 자료구조로 실행 컨텍스트를 구성하는 컴포넌트다.
 * 실행 컨텍스트 스택(호출 스택)이 코드의 실행 순서를 관리한다면 렉시컬 환경은 스코프와 식별자를 관리한다.
 * 렉시컬 환경은 키와 값을 갖는 객체 형태의 스코프(전역, 함수, 블록)를 생성하여 식별자를 키로 등록하고 식별자에 바인딩된 값을 관리한다.
 * 🔑 즉, 렉시컬 환경은 스코프를 구분하여 식별자를 등록하고 관리하는 저장소 역할을 하는 렉시컬 스코프의 실체이다.
 *
 */

// 👉 소스코드 예문
const r = 1;

function rux() {
  const t = 2;
  return r + t;
}

rux(); // 3

// 위 소스코드 예문이 실행되면 전역 렉시컬 환경과 함수 렉시컬 환경에 식별자가 등록된다.
// 1️⃣. 전역 렉시컬 환경에는 const 키워드로 등록된 식별자 `r`과 function 키워드로 등록된 `rux` 함수가 등록된다.
// 2️⃣. 함수 렉시컬 환경에는 const 키워드로 등록된 식별자 `t`가 등록된다.
// 전역 렉시컬 환경과 `rux` 함수 렉시컬 환경은 스코프체인 관계를 맺는다.

// 👉 렉시컬 환경은 2개의 컴포넌트로 구분된다.
// 1️⃣. 환경 레코드(environment record)
// - 스코프에 포함된 식별자를 등록하고 바인딩된 값을 관리하는 저장소다.
// 2️⃣. 외부 렉시컬 환경에 대한 참조(outer lexical environment reference)
// - 해당 렉시컬 환경 스코프의 상위 스코프를 가리킨다.
// 이때 상위 스코프란 해당 실행 컨텍스트를 생성한 소스코드를 포함하는 상위 코드의 렉시컬 환경을 말한다.
// 이 참조를 통해 스코프체인을 구현한다.
