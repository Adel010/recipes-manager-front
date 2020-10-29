import { useEffect, useState } from "react";
import LoginForm from "./App/LoginForm";
import { ApiErrors, fetchApi } from "./funcs/fetchApi";

function App() {
  const [user, setUser] = useState(null);

  useEffect(function(){
    fetchApi("me")
      .then(u => setUser(u))
      .catch(() => setUser(false))
  }, [])

  if(user === null){
    return <div>
      Loading...
    </div>
  }
  return (
    user ? <div>Loged in</div> : <LoginForm onConnect={setUser}/>
  );
}

export default App;
