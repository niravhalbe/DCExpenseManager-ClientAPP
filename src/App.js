import './App.css';
import "react-datepicker/dist/react-datepicker.css";

import { Navigation } from './containers/Navigation';
import { Login } from './containers/Login';
import { deleteValueFromLocalstorage, getValueFromLocalstorage, setValueInLocalstorage } from './utils/helperFunctions';
import { useState } from 'react';

const loggedInDetails = JSON.parse(getValueFromLocalstorage());
export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(loggedInDetails && loggedInDetails.userId > 0);

  const userLoggedIn = (data) => {
    setValueInLocalstorage(data);
    setIsLoggedIn(true);
  }

  const userLoggedOut = () => {
    deleteValueFromLocalstorage();
    setIsLoggedIn(false);
  }

  return (
    <>
      {isLoggedIn
        ? <Navigation userLoggedOut={userLoggedOut} />
        : <Login userLoggedIn={userLoggedIn} />}
    </>
  );
};
