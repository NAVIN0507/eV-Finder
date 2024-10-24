import React, { useState, useRef } from 'react';
import './Login.css';
import loginImage from './assets/login_image.png';
import logo from './assets/logo.png';
import googleLogo from './assets/google_logo.png';
import openEye from './assets/open_eye.png';
import closeEye from './assets/close_eye.png';
import {useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const passwordRef = useRef(null);
  const submitButtonRef = useRef(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(false); // Reset error on change
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.key === 'Enter' && e.target.value) {
      // Move focus to the submit button if Enter key is pressed
      submitButtonRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!email.endsWith('@bitsathy.ac.in')) {
      setEmailError(true);
    } else {
      setEmailError(false);
      passwordRef.current.focus(); // Focus the password input field
      // Submit form or perform login action here
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to Google OAuth login
    window.location.href = 'http://localhost:5000/auth/google';
  };
const navigate = useNavigate();
 
  return (
    <>
    <div className="login-container">
      <div className="left-section">
        <img src={loginImage} alt="Login" className="login-image" />
      </div>
      <div className="right-section">
        <div className="login-content">
          <div className="title-container">
            <img src={logo} alt="Logo" className="logo" />
            <h2>eV finder</h2>
          </div>
          <p className="sub-head">Hi, Welcome Back</p>
          <p className="sub-sub">Login to continue</p>
          <button className="google-button" onClick={handleGoogleSignIn}>
            <img src={googleLogo} alt="Google" className="google-logo" />
            Sign in with Google
          </button>
          <p>or</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email"
              className="first-input-field"
              value={email}
              onChange={handleEmailChange}
            />
            {submitted && emailError && <p className="error">Please enter bitsathy Gmail address.</p>}
            <div className="password-container">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={handlePasswordChange}
                ref={passwordRef}
                onKeyDown={handlePasswordChange} // Add onKeyDown to handle Enter key press
              />
              <img
                src={passwordVisible ? openEye : closeEye}
                alt="Toggle visibility"
                className="eye-icon"
                onClick={togglePasswordVisibility}
              />
            </div>
            <button
              className="sign-in-button"
              type="submit"
              ref={submitButtonRef} // Ref for the submit button
              onClick={()=>navigate('/book')}
            >
              Sign In
            </button>
          </form>
          <p className="footer">Sign In with your BITSathy Account</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
