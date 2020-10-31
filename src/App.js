import { useEffect, useState } from "react";
import LoginForm from "./App/LoginForm";
import { Site } from "./App/site";
import { ApiErrors, fetchApi } from "./funcs/fetchApi";
import { Loader } from "./ui/loader";

function App() {
  const [user, setUser] = useState(null);

  useEffect(function(){
    fetchApi("me")
      .then(u => setUser(u))
      .catch(() => setUser(false))
  }, [])

  if(user === null){
    return <div>
      <Loader/>
    </div>
  }
  return (
    user ? <Site /> : <LoginForm onConnect={setUser}/>
  );
}

export default App;
