import React, { useState } from 'react';
import './Register.css'; // Assuming styles are moved to CSS

import auth from '@react-native-firebase/auth';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const createProfile = async (response) => {
    // Create Profile Query Here
  };

  const registerAndGoToMainFlow = async () => {
    if (email && password) {
      try {
        const response = await auth().createUserWithEmailAndPassword(
          email, 
          password);

        if (response.user) {
          await createProfile(response);
        }

      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="contentView" onClick={() => document.activeElement.blur()}>
      <div className="container">
        <div className="titleContainer">
          <h1 className="titleText">Register</h1>
        </div>
        <div className="mainContent">
          <input
            className="loginTextField"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="loginTextField"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="loginTextField"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="ctaButton primary" onClick={registerAndGoToMainFlow}>Sign Up</button>
      </div>
    </div>
  );
};
