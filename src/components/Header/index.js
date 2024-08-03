import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import React, { useEffect } from 'react'
import './styles.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import userImg from '../../assets/user.svg';


const Header = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user)  {
      navigate('/dashboard');
    }
  }, [user, loading])

  function logoutFnc() {
    try {
      signOut(auth).then(() => {
        // Sign-out successful.
        toast.success("Logged Out Successfully!")
        navigate('/');
      }).catch((error) => {
        // An error happened.
        toast.error(error.message);
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='navbar'>
      <p className='logo'>Financely-Tracker</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src={user.photoURL ? user.photoURL : userImg} width='1.5rem' height='1.5rem' style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} />
          <p className="logo link" onClick={logoutFnc}>
            Logout
          </p>
        </div>
      )
      }
    </div >
  )
}

export default Header;
