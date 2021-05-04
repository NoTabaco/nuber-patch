import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "./apollo";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const onLogIn = () => {
    isLoggedInVar(true);
  };

  const onLogOut = () => {
    isLoggedInVar(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h3>Welcome</h3>
          <button onClick={onLogOut}>Log Out</button>
        </>
      ) : (
        <>
          <h3>Please Log In</h3>
          <button onClick={onLogIn}>Log In</button>
        </>
      )}
    </div>
  );
}

export default App;
