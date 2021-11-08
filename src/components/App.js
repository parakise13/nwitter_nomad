import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  // 로그인 상태에 currentUser를 기본값으로 주어 유저의 로그인 여부를 알 수 있게함
  // setInterval(() => {
  //   console.log(authService.currentUser);
  // }, 2000);

  // 우리가 실제로 로그인이 되었는지 안되었는지를 알 수 있는 eventListener과 같은 역할.
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // 기본적으로 onAuthStateChanged는 로그인이 될때, 로그아웃 할때 앱이 리셋될때를 인지함
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };

  return (
    <>
      {/* init이 true가 되면 화면을 보여주고 아니면 initializing...을 보여줌 */}
      {init ? (
        // Boolean으로 userObj가 true일때 즉, userObj가 있을때 로그인이 됨
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      {/* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
    </>
  );
}

export default App;
