import React, { useState } from 'react';
import "./styles.css";
import "./"
import Input from '../input';
import Button from '../Button';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, provider } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function SigupSiginComponent() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingForm, setLoadingForm] = useState(false);
    const navigate = useNavigate();

    const signupWithEmail = () => {
        setLoading(true);
        console.log('name', name);
        console.log('email', email);
        console.log('password', password);
        console.log('confirmPassword', confirmPassword);

        if (name != "" && email != "" && password != "" && confirmPassword != "") {
            if (password == confirmPassword) {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        // Signed up 
                        const user = userCredential.user;
                        console.log("User --->", user);
                        toast.success("User Created!");
                        setLoading(false);
                        setName("");
                        setEmail("");
                        setPassword("");
                        setConfirmPassword("");
                        createDom(user);
                        navigate("/dashboard");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        toast.error(errorMessage);
                        setLoading(false);
                    });
            } else {
                toast.error("Password and Confirm Password are not same");
                setLoading(false);
            }
        } else {
            toast.error("All fields are mandatory!");
            setLoading(false);
        }
    }

    const loginUsingEmail = () => {
        console.log("email", email);
        console.log("password", password);
        setLoading(true);
        if (email != "" && password != "") {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    toast.success("User Logged In!");
                    console.log("User Logged In!", user);
                    setLoading(false);
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage);
                    setLoading(false)
                });
        } else {
            toast.error("All fields are mandatory!");
            setLoading(false);
        }
    }

    async function createDom(user) {
        setLoading(true);
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);

        if (!userData.exists()) {
            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName ? user.displayName : name,
                    email: user.email,
                    photoURL: user.photoURL ? user.photoURL : "",
                    createdAt: new Date(),
                })
                toast.success("Doc created!");
                setLoading(false);
            } catch (error) {
                toast.error("Error creating doc!", error.message);
                setLoading(false);
            }
        } else {
            // toast.error("Doc already exists!");
            setLoading(false);
        }
    }

    function googleAuth() {
        setLoading(true);
        try {
            signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    const user = result.user;
                    console.log("user ==>", user);
                    createDom(user);
                    navigate('/dashboard')
                    toast.success("User Authenticated!")
                    // IdP data available using getAdditionalUserInfo(result)
                    // ...
                }).catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error("Error Authenticating User!", errorMessage);
                });
        } catch (error) {
            toast.error("Error with Google Auth!", error.message);
            setLoading(false);
        }
    }


    return (
        <> 
        {loadingForm ?
            (<div className='signup-wrapper'>
                <h2 className='title'>
                    Login Up on <span style={{ color: "var(--theme)" }}>Financely.</span>
                </h2>
                <form className='form'>
                    <Input
                        type='email'
                        label={"Email"}
                        placeholder='Enter Email'
                        value={email}
                        setState={setEmail}
                    />
                    <Input
                        type='password'
                        label={"Password"}
                        placeholder='Example123'
                        value={password}
                        setState={setPassword}
                    />
                    <Input
                        type='password'
                        label={"Conform Password"}
                        placeholder='Example123'
                        value={confirmPassword}
                        setState={setConfirmPassword}
                    />
                    <Button
                        disabled={loading}
                        onClick={loginUsingEmail}
                        text={loading ? "Loading..." : "Login Using Email & Password"}
                    />

                    <p className='p-login'>or</p>

                    <Button
                        onClick={googleAuth}
                        blue={true}
                        text={loading ? "Loading..." : " Log In with Google"}
                    />
                    <p className='p-login'>
                        Or Don't Have An Account? <span style={{ cursor: "pointer" }} onClick={() => setLoadingForm(!loadingForm)}>Click Here</span>.
                    </p>
                </form>
            </div>)
            :
            (<div className='signup-wrapper'>
                <h2 className='title'>
                    Sign Up on <span style={{ color: "var(--theme)" }}>Financely.</span>
                </h2>
                <form className='form'>
                    <Input
                        type='text'
                        label={"full Name"}
                        placeholder='Enter Name'
                        value={name}
                        setState={setName}
                    />
                    <Input
                        type='email'
                        label={"Email"}
                        placeholder='Enter Email'
                        value={email}
                        setState={setEmail}
                    />
                    <Input
                        type='password'
                        label={"Password"}
                        placeholder='Example123'
                        value={password}
                        setState={setPassword}
                    />
                    <Input
                        type='password'
                        label={"Conform Password"}
                        placeholder='Example123'
                        value={confirmPassword}
                        setState={setConfirmPassword}
                    />
                    <Button
                        disabled={loading}
                        onClick={signupWithEmail}
                        text={loading ? "Loading..." : "Signup Using Email & Password"}
                    />

                    <p className='p-login'>or</p>

                    <Button
                        onClick={googleAuth}
                        blue={true}
                        text={loading ? "Loading..." : " Signup with Google"}
                    />
                    <p className='p-login'
                    // style={{ cursor: "pointer" }}
                    // onClick={() => setLoadingForm(!loading)}
                    >
                        Or Have An Already? <span style={{ cursor: "pointer" }} onClick={() => setLoadingForm(!loadingForm)}>Click Here</span>.
                    </p>
                </form>
            </div>)}
        </>
    )
}

export default SigupSiginComponent;
