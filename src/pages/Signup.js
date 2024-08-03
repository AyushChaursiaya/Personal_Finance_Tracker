import React from 'react'
import Header from '../components/Header';
import "../App.css";
import SigupSiginComponent from '../components/SignupSignin';

function Signup() {
  return (
    <div>
      <Header/>
      <div className='wrapper'>
        <SigupSiginComponent />
      </div>
    </div>
  )
}

export default Signup;
