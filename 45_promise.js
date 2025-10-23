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
