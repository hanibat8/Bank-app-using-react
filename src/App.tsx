import React from 'react';
import { Route,Routes,Navigate } from 'react-router-dom';
import { useAuthUser } from "@react-query-firebase/auth";
import { auth } from './firebase-config';
import LoginController from './conmponents/controller/LoginController';
import SignUpController from './conmponents/controller/SignUpController';
import HomeController from './conmponents/controller/HomeController';
import LoadingSpinner from './conmponents/view/LoadingSpinner';

const App:React.FC=()=>{
  
  const user = useAuthUser(["user"], auth);
  console.log(user)
  //const [loanPending,setLoanPending]=useState(false);

  return (
    <>
      {user.isLoading || user.isFetching && <LoadingSpinner/>}
      {user.isSuccess && <div className="App">
        <Routes>
          <Route path='/' element={!user.data?<LoginController />:<Navigate to='/home'/>} />
          <Route path='/signUp' element={!user.data?<SignUpController/>:<Navigate to='/home'/>} />
          <Route path='/home' element={user.data?<HomeController/>:<Navigate to='/'/>} />
        </Routes>
      </div>}
    </>
  );
}

export default App;
