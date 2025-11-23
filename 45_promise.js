/**
 * 45. 프로미스
 *
 * 자바스스크립트는 비동기 처리를 위한 하나의 패턴으로 콜백 함수를 사용한다.
 * 하지만 전통적인 콜백 패턴은 콜백 헬로 인해 가독성이 나쁘고 비동기 처리 중 발생한 에러 핸들링이 곤란하며,
 * 여러 개의 비동기 처리를 한 번에 처리하는 데도 한계가 있다.
 *
 * ES6에서는 비동기 처리를 위한 또 하나의 패턴으로 `Promise`를 도입했다.
 * `Promise`는 전통적인 콜백 패턴이 가진 단점ㅇ을 보완하며, 비동기 처리 시점을 명확하게 표현할 수 있다는 장점이 있다.
 */

/**
 * 45-1. 비동기 처리를 위한 콜백 패턴의 단점
 */

/**
 * 45-1-1. 콜백 헬
 */
const BASE_URL = "https://jsonplaceholder.typicode.com";
{
  const get = (url) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.send();
    // `onload` 메서드는 비동기로 동작한다.
    xhr.onload = () => {
      if (xhr.status === 200) {
        return JSON.parse(xhr.response);
      }

      console.error(`${xhr.status} ${xhr.statusText}`);
    };
  };

  // 위의 `get` 함수는 비동기 함수이다. 비동기 함수란 함수 내부에 비동기로 동작하는 코드를 포함한 함수를 말한다.
  // 비동기 함수를 호출하면 함수 내부의 비동기로 동작하는 코드가 완료되지 않았다 해도 기다리지 않고, 동기적 처리만 완료되면 함수는 종료된다.
  // 즉, 비동기 로직은 `Web API`를 통해 `Callback Queue`로 이동되어 함수의 동기적 실행이 모두 종료된 뒤에 `Event Loop`를 통해 스택으로 옮겨진 뒤 실행된다.
  // 따라서 비동기 함수 내부의 비동기로 동작하는 코드에서 처리 결과를 외부로 반환하거나 상위 스코프의 변수에 할당하면 기대한 대로 동작하지 않을 수 있다.
  // 예를 들어 `setTimeout` 메서드를 보자
  {
    let number = 0;

    // 비동기 메서드인 `setTimeout` 내부에서 콜백 함수로 `number`은 값을 100으로 재할당 하였으나,
    // 49번 째 줄의 console.log(number)의 출력은 초기값인 0이다. 이후 실제로 100으로 재할당 되지만, 출력 시점에서 `setTimeout`의 콜백 함수는 동작하지 않는다.
    // 이는 자바스크립트의 싱글 스레드 비동기 처리 특징이며, 동기적 실행이 모두 끝난 뒤에 스택이 비었을 때 비동기 처리를 진행하기 때문이다.
    setTimeout(() => (number = 100), 0);
    console.log(number); // 0
  }

  // `get` 함수 호출
  const response = get(`${BASE_URL}/post`);
  // `get`의 `onload`는 비동기로 동작하기 때문에 `get` 함수가 종료된 이후 `onload`가 동작한다.
  // 따라서, `response`는 `undefined`가 된다.
  console.log(response); // undefined

  // 이처럼 비동기 함수는 비동기 처리 결과를 외부에 반환할 수 없고, 상위 스코프의 변구에도 할당할 수 없다.
  // 🎯 따라서 비동기 함수의 처리 결과(서버 응답 등)에 대한 후속 처리는 비동기 함수 내부에서 수행해야 한다.
  // 이때 비동기 함수를 범용적으로 사용하기 위해 비동기 함수에 비동기 처리 결과에 대한 후속 처리를 수행하는 콜백 함수를 전달하는 것이 일반적이다.
  // 필요에 따라 비동기 처리가 성공하면 호출될 콜백 함수와 비동기 처리가 실패하면 호출될 콜백 함수를 전달할 수 있다.
  const get2 = (url, successCb, failureCb) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.send();
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);

        successCb(response);
      } else {
        failureCb(xhr.status);
      }
    };
  };

  get2(`${BASE_URL}/posts`, console.log, console.error);

  // 이처럼 콜백 함수를 통해 비동기 처리 결과에 대한 후속 처리를 수행하는 비동기 함수가 비동기 처리 결과를 가지고 또다시 비동기 함수를 호출하는 경우를 콜백 헬(callback hell)이라 한다.
  const get3 = (url, cb) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.send();
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);

        // 서버 응답을 콜백 함수에 전달하면서 호출하여 응답에 대한 후속 처리를 콜백 함수에서 처리한다.
        cb(response);
      } else {
        console.error(`${xhr.status} ${xhr.statusText}`);
      }
    };
  };

  // post의 id가 1인 데이터를 응답 받은 뒤, userId를 취득
  get3(`${BASE_URL}/posts/1`, ({ userId }) => {
    console.log(userId); // 1

    // 응답 받은 userId를 사용하여 userInfo를 취득
    get3(`${BASE_URL}/users/${userId}`, (userInfo) => {
      console.log(userInfo);
    });
  });

  // 위와 같은 콜백 헬(callback hell)은 가독성을 나쁘게 하며 실수를 유발하는 원인이 된다.
}

/**
 * 45-1-2. 에러 처리의 한계
 *
 * 비동기 처리를 위한 콜백 패턴의 가장 큰 문제는 에러 처리(Error Handling)가 곤란한 것이다.
 */
{
  // 참고로 `try... catch... finally` 문은 에러 처리를 구현하는 방법이다.
  // 실행 시, `try` 코드 블록이 실행되고 내부에서 에러가 발생하면 `catch`문이 실행된다, 이때 발생한 에러는 `catch`문의 변수에 전달된다.
  try {
    setTimeout(() => {
      throw new Error("Error!");
    }, 1000);
  } catch (error) {
    // 에러를 캐치하지 못한다.
    console.warn("Caught Error", error);
  }
}

/**
 * 45-2. 프로미스의 생성
 *
 * `Promise` 생성자 함수를 `new` 연산자와 함께 호출하면 `Promise`객체를 생성한다.
 * ES6에 도입된 `Promise`는 호스트 객체가 아닌 ECMAScript 사양에 정의된 표준 빌트인 객체다.
 * `Promise` 생성자 함수는 비동기 처리를 수행할 콜백 함수(executor)를 인수로 전달 받는데, 이 콜백 함수는 `resolve`와 `reject`함수를 인수로 전달받는다.
 *
 * `Promise`는 비동기 처리의 진행도에 따라 상태 정보를 갖는다.
 * // ------------------------------------------------------------------------------ //
 * // -----------------------------   Promise Status   ----------------------------- //
 * // ------------------------------------------------------------------------------ //
 * //   상태 정보   |                의미                |      상태 변경 조건             //
 * //   pending   |   비동기 처리가 아직 수행되지 않은 상태   |  프로미스가 생성된 직후 기본 상태   //
 * //   fulfilled |   비동기 처리가 수행된 상태 / 성공      |   resolve 함수 호출            //
 * //   rejected  |   비동기 처리가 수행된 상태 / 실패      |   reject 함수 호출             //
 * // ------------------------------------------------------------------------------ //
 *
 * 즉, `Promise`는 비동기 처리 상태와 처리 결과를 관리하는 객체다.
 */
{
  const promise = new Promise((resolve, reject) => {
    // Promise 함수의 콜백 함수 내부에서 비동기 처리를 수행한다.

    // 비동기 처리 성공
    if (true) {
      resolve("result");
    }
    // 비동기 처리 실패
    else {
      reject("failure reason");
    }
  });

  // 콜백 구조의 `get` 함수를 `Promise`구조로 변경
  const promiseGet = (url) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("GET", url);
      xhr.send();
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.response);

          // 성공적으로 응답을 전달 받으면 `resolve`함수를 호출한다.
          resolve(response);
        } else {
          // 실패 시 에러 처리를 위해 `reject`함수를 호출한다.
          reject(new Error(xhr.status));
        }
      };
    });
  };

  promiseGet(`${BASE_URL}/posts`) //
    .then((response) => {
      console.log("[promiseGet] response: ", response);
    })
    .catch((error) => {
      console.error("error", error);
    });

  // 콜백 구조의 `get` 함수를 `Promise`구조인 `fetch`로 변경
  const promiseGetWithFetch = (url) => {
    return fetch(url) //
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }

        return response.json();
      })
      .then((data) => data);
  };

  promiseGetWithFetch(`${BASE_URL}/posts`)
    .then((response) => {
      console.log("[promiseGetWithFetch] response: ", response);
    })
    .catch((error) => {
      console.error("error", error);
    });
}

/**
 * 45-3. 프로미스의 후속 처리 메서드
 *
 * `Promise`의 비동기 처리 상태가 변화하면 이에 따른 후속 처리를 해야 한다.
 * 예를 들어, `fulfilled` 상태가 되면 처리 결과를 가지고 무언가를 해야하고, `rejected` 상태가 되면 처리 결과(에러)를 가지고 에러 처리를 해야한다.
 * 이를 위해 `Promise`는 후속 메서드인 `then`, `catch`, `finally`를 제공한다.
 * `Promise`의 비동기 처리 상태가 변화하면 후속 처리 메서드의 인수로 전달한 콜백 함수가 선택적으로 호출된다.
 */

/**
 * 45-3-1. Promise.prototype.then
 *
 * `then` 메서드는 두 개의 콜백 함수(성공 콜백 함수와 실패 콜백 함수)를 인수로 전달받는다.
 *  - 첫 번째 콜백 함수는 `fulfilled` 상태(`resolve` 함수가 호출된 상태)가 되면 호출된다. 이때 콜백 함수는 프로미스의 비동기 처리 결과를 인수로 전달 받는다.
 *  - 두 번째 콜백 함수는 `rejected` 상태(`reject` 함수가 호출된 상태)가 되면 호출된다. 이때 콜백 함수는 프로미스의 비동기 에러 처리 결과를 인수로 전달 받는다.
 *
 * `then` 메서드는 언제나 `Promise`를 반환한다. 만약 then 메서드의 콜백 함수가 프로미스를 반환하면 해당 `Promise`를 반환하고,
 * 만약 콜백 함수가 `Promise`가 아닌 값을 반환하면 그 값을 암묵적으로 `resolve` 또는 `reject` 하여 `Promise`를 생성하여 반환한다.
 * - (이는 `useCallback`의 첫 번째 인자인 콜백 함수가 `async` 키워드를 사용할 수 없는 이유가 된다.)
 */
{
  // `fulfilled`
  new Promise((resolve, reject) => resolve("fulfilled")) //
    .then(
      (response) => console.log("fulfilled", response),
      (error) => console.error("fulfilled", error)
    );

  // `rejected`
  new Promise((resolve, reject) => reject("rejected")) //
    .then(
      (response) => console.log("rejected", response),
      (error) => console.error("rejected", error)
    );
}

/**
 * 45-3-2. Promise.prototype.catch
 *
 * `catch` 메서드는 한 개의 콜백 함수(실패 콜백 함수)를 인수로 전달받는다.
 *  - `rejected` 상태(`reject` 함수가 호출된 상태)인 경우에만 호출된다.
 *
 * `catch` 메서드는 `then` 메서드와 마찬가지로 항상 `Promise`를 반환한다.
 */
{
  // `rejected`
  new Promise((resolve, reject) => reject(new Error("rejected"))) //
    .catch((error) => console.error("rejected", error));
}

/**
 * 45-3-3. Promise.prototype.finally
 *
 * `finally` 메서드는 한개의 콜백 함수를 인자로 전달받는다.
 *  - 인자로 전달받은 콜백 함수는 `fulfilled`, `rejected` 상태와 상관없이 무조건 한 번만 호출된다.
 *  - 단, `Promise`의 상태와 관계는 없지만 `Promise`가 settled 되어야 하기 때문에 내부에서 `resolve` 또는 `reject` 함수가 호출되어야만 실행된다. (즉 `pending` 상태에서는 호출되지 않음)
 *
 * `finally` 메서드도 항상 `Promise`를 반환한다.
 */
{
  // `finally`
  new Promise((resolve, reject) => resolve()) //
    .finally(() => console.log("finally"));
}

{
  // `Promise`로 구현한 `get`함수 후속 처리
  const promiseGet = (url) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("GET", url);
      xhr.send();
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.response);

          return resolve(response);
        }

        return reject(new Error(xhr.status));
      };
    });
  };

  promiseGet(`${BASE_URL}/posts`) //
    .then((response) => console.log("[promiseGet] response", response))
    .catch((error) => console.error("[promiseGet] error", error))
    .finally(() => console.log("[promiseGet] finally"));

  // `fetch` 메서드를 활용한 `get`함수 후속 처리
  const fetchGet = (url) => {
    return fetch(url) //
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(new Error(response.status));
        }

        return response.json();
      });
  };

  fetchGet(`${BASE_URL}/posts`) //
    .then((response) => console.log("[fetchGet] response", response))
    .catch((error) => console.error("[fetchGet] error", error))
    .finally(() => console.log("[fetchGet] finally"));
}

/**
 * 45-4. 프로미스의 에러 처리
 */
{
  const promiseGet = (url) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("GET", url);
      xhr.send();
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.response);

          return resolve(response);
        }

        return reject(new Error(xhr.status));
      };
    });
  };

  const wrongUrl = `${BASE_URL}/xxx`;

  // 부적절한 URL이 지정되었기 때문에 에러가 발생한다.
  promiseGet(wrongUrl) //
    .then(
      (res) => console.log(res),
      (err) => console.error(err)
    );

  // `catch`를 사용해 처리할 수도 있다. (`catch` 메서드는 `then` 메서드에서 발생한 에러까지 모두 처리할 수 있고 가독성도 좋다.)
  promiseGet(`${BASE_URL}/posts`) //
    .then((res) => console.xxx("res: ", res))
    .catch((err) => console.error("err: ", err)); // TypeError: console.xxx is not a function
}

/**
 * 45-5. 프로미스 체이닝
 *
 * 비동기 처리를 위한 콜백 패턴은 콜백 헬이 발생하는 문제가 있다.
 * 프로미스는 `then`, `catch`, `finally` 후속 처리 메서드를 통해 콜백 헬을 해결한다.
 */
{
  const promiseChainingGet = (url) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("GET", url);
      xhr.send();
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.response);

          return resolve(response);
        }

        return reject(new Error(xhr.statusText));
      };
    });
  };

  // `then`, `catch`, `finally` 후속 처리 메서드를 통한 프로미스 체이닝
  promiseChainingGet(`${BASE_URL}/posts/1`) //
    // `userId` 는 `promiseChainingGet(`${BASE_URL}/posts/1`)` 함수가 반환한 프로미스가 `resolve`한 값
    .then(({ userId }) => promiseChainingGet(`${BASE_URL}/users/${userId}`))
    // `userInfo` 는 `promiseChainingGet(`${BASE_URL}/users/${userId}`))` 함수가 반환한 프로미스가 `resolve`한 값
    .then((userInfo) => console.log("[promiseChainingGet] ", userInfo))
    // `promiseChainingGet(`${BASE_URL}/users/${userId}`))` 함수 또는 앞선 후속 처리 메서드가 반환한 프로미스가 `reject`한 값 (단, `reject`가 호출되지 않으면 `catch` 자체가 호출되지 않는다.)
    .catch((error) => console.error("[promiseChainingGet] ", error))
    .finally(() => console.log("[promiseChainingGet] finally"));

  // 이처럼 `Promise`의 후속 처리 메서드를 활용하면 비동기 처리를 위한 콜백 패턴이 발생하지는 않는다.
  // 다만, 프로미스도 콜백 패턴을 사용하므로 콜백 함수를 완전히 사용하지 않는 것은 아니다.
  // 또한 후속 처리 메서드의 콜백 함수가 `Promise`가 아닌 값을 반환하더라도 그 값을 암묵적으로 `resolve` 또는 `reject`하여 프로미스를 생성해 반환한다.
  // 이는 `useEffect`의 첫 번째 인자로 전달되는 `setup` 함수가 `async` 함수가 될 수 없는 이유가 된다.

  // 프로미스는 에러 핸들링이나 후속 처리 메서드 지원으로 콜백 패턴보다 장점을 가지지만 콜백 함수를 사용하기 때문에 가독성이 좋지 않다.
  // 이는 ES8에서 도입된 `async/await` 키워드를 통해 후속 처리 메서드 없이 마치 동기 처리처럼 프로미스 처리 결과를 반환하도록 구현할 수 있다.

  (async () => {
    const { userId } = await promiseChainingGet(`${BASE_URL}/posts/1`);
    const userInfo = await promiseChainingGet(`${BASE_URL}/users/${userId}`);

    console.log("[async await]", userInfo);
  })();
}

/**
 * 45-6. 프로미스의 정적 메서드
 */

/**
 * 45-6-1. Promise.resolve / Promise.reject
 *
 * `Promise.resolve`와 `Promise.reject` 메서드는 이미 존재하는 값을 래핑하여 프로미스를 생성하기 위해 사용한다.
 * `Promise.resolve`는 인수로 전달받은 값을 `resolve`하는 프로미스를 생성한다.
 * `Promise.reject`는 인수로 전달받은 값을 `reject`하는 프로미스를 생성한다.
 */
{
  // 배열을 resolve하는 프로미스를 생성
  const resolvedPromise = Promise.resolve([1, 2, 3]);
  resolvedPromise.then(console.log); // [1, 2, 3]

  // 위 예제는 다음과 동일하게 동작한다.
  const resolvedPromise2 = new Promise((resolve) => resolve(["a", "b", "c"]));
  resolvedPromise2.then(console.log); // ['a', 'b', 'c']

  // 에러 객체를 reject하는 프로미스를 생성
  const rejectedPromise = Promise.reject(new Error("[rejectedPromise]"));
  rejectedPromise.catch(console.log); // Error: [rejectedPromise]

  // 위 예제는 다음과 동일하게 동작한다.
  const rejectedPromise2 = new Promise((_, reject) => reject(new Error("[rejectedPromise2]")));
  rejectedPromise2.catch(console.log); // Error: [rejectedPromise2]
}

/**
 * 45-6-2. Promise.all
 *
 * `Promise.all` 메서드는 여러 개의 비동기 처리를 모두 병렬(parallel) 처리할 때 사용한다.
 * `Promise.all` 메서드는 `Promise`를 요소로 갖는 배열 등의 이터러블을 인수로 전달받는다.
 * 그리고 전달 받은 `Promise`가 모두 `fulfilled` 상태가 되면 모든 처리 결과를 배열에 저장해 새로운 프로미스를 반환한다.
 * 또한 전달받은 `Promise`는 순서에 따라 배열의 순서를 보장 받는다.
 * 단, 전달받은 `Promise` 중 하나라도 `rejected` 상태가 되면 나머지 프로미스가 `fulfilled` 상태여도 즉시 종료한다.
 */
{
  const requestData1 = () => new Promise((resolve) => setTimeout(() => resolve(1), 3000));
  const requestData2 = () => new Promise((resolve) => setTimeout(() => resolve(2), 2000));
  const requestData3 = () => new Promise((resolve) => setTimeout(() => resolve(3), 1000));

  // 위 3개의 비동기를 순차적으로 처리하는 경우
  const res = [];
  requestData1() //
    .then((data) => {
      res.push(data);

      return requestData2();
    })
    .then((data) => {
      res.push(data);

      return requestData3();
    })
    .then((data) => {
      res.push(data);

      console.log("[res]: ", res); // [1, 2, 3] => 총 6초 소요
    });

  // 위 3개의 비동기를 병렬(parallel)로 처리하는 경우
  Promise.all([requestData1(), requestData2(), requestData3()]) // 순서 보장
    .then((data) => {
      console.log("[res 2]:", data); // [1, 2, 3] => 총 3초 소요
    });

  // 인수로 전달받은 배열의 프로미스가 단 하나라도 `rejected` 상태가 발생하면 나머지 프로미스 상태를 기다리지 않고 즉시 종료된다.
  Promise.all([
    new Promise((_, reject) => setTimeout(() => reject(new Error("[Error 1]")), 3000)),
    new Promise((_, reject) => setTimeout(() => reject(new Error("[Error 2]")), 2000)),
    new Promise((_, reject) => setTimeout(() => reject(new Error("[Error 3]")), 1000)),
  ]) //
    .then(console.log)
    // 가장 먼저 반환되는 프로미스인 세 번째 프로미스의 `reject`한 에러가 `catch` 메서드로 전달된다.
    .catch(console.log); // Error: [Error 3]
}

/**
 * 45-6-3. Promise.race
 *
 * `Promise.race` 메서드는 `Promise.all` 메서드와 동일하게 프로미스를 요소로 갖는 배열 등의 이터러블을 인수로 전달받는다.
 * 단, `Promise.race` 메서드는 인수로 전달된 모든 프로미스의 `fulfilled` 상태가 되는 것을 기다리지 않고,
 * 가장 먼저 `fulfilled` 상태가 된 프로미스의 처리 결과를 `resolve` 하는 새로운 프로미스를 반환한다.
 * 또한 `Promise.all` 메서드와 동일하게 `Promise.race`에 인수로 전달된 프로미스 중 단 하나라도 `rejected` 상태가 되면 에러를 `reject`하는 새로운 프로미스를 즉시 반환한다.
 */
{
  Promise.race([
    new Promise((resolve) => setTimeout(() => resolve(1), 3000)),
    new Promise((resolve) => setTimeout(() => resolve(2), 2000)),
    new Promise((resolve) => setTimeout(() => resolve(3), 1000)),
  ]) //
    .then((res) => console.log("[race resolve]", res)); // 3

  Promise.race([
    new Promise((_, reject) => setTimeout(() => reject(new Error("[Error 1]")), 3000)),
    new Promise((_, reject) => setTimeout(() => reject(new Error("[Error 2]")), 2000)),
    new Promise((_, reject) => setTimeout(() => reject(new Error("[Error 3]")), 1000)),
  ]) //
    .then()
    .catch((error) => console.log("[race reject]", error)); // [race reject] Error: [Error 3]
}

/**
 * 45-6-4. Promise.allSettled
 *
 * `Promise.allSettled` 메서드는 프로미스를 요소로 갖는 배열 등의 이터러블을 인수로 전달 받는다.
 * 전달 받은 프로미스가 모두 settled 상태(`fulfilled` or `rejected`)가 되면 처리 결과를 배열로 반환한다.
 * `Promise.allSettled` 메서드가 반환한 배열에는 `fulfilled` 또는 `rejected` 상태와는 상관없이 인수로 전달받은 모든 프로미스의 처리 결과가 모두 담겨 있다.
 * 프로미스의 처리 결과를 나타내는 객체는 다음과 같다.
 *
 * - fulfilled: 비동기 처리 상태를 나타내는 `status`, 처리 결과를 나타내는 `value` 프로퍼티를 갖는다.
 * - rejected: 비동기 처리 상태를 나타내는 `status`, 에러를 나타내는 `reason` 프로퍼티를 갖는다.
 */
{
  Promise.allSettled([
    new Promise((resolve) => setTimeout(() => resolve("[allSettled]: resolve"), 2000)),
    new Promise((_, reject) => setTimeout(() => reject(new Error("[allSettled]: reject")), 1000)),
  ]) //
    .then((res) => console.log("[allSettled]: res", res));
  // [
  //  {status: "fulfilled", value: "[allSettled: resolve]"},
  //  {status: "rejected", reason: "Error: [allSettled: reject]: reject at http ~"},
  // ]
}

/**
 * 45-7. 마이크로태스트 큐
 *
 * 비동기 큐는 3가지로 분류된다.
 *
 * 1. microtask queue
 * 2. animation frame queue
 * 3. task queue
 *
 * 위 순서대로 우선 순위를 가지며,
 * `Promise`의 후속 처리 메서드는 `microtask queue`에 배정되고,
 * `setTimeout`의 후속 처리 콜백 함수는 `task queue`에 배정된다.
 *
 * 같은 비동기라도 어느 큐에 배정되느냐에 따라 우선순위가 결정된다.
 *
 */
{
  setTimeout(() => console.log("[task Queue]: by setTimeout"), 0);

  Promise.resolve() //
    .then(() => console.log("[microtask Queue]: 1 by Promise"))
    .then(() => console.log("[microtask Queue]: 2 by Promise"));
}
