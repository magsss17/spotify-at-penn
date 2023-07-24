/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
//   AuthProvider.defaultProps = {
//     children: null,
//   };
//   AuthProvider.propTypes = {
//     // eslint-disable-next-line react/forbid-prop-types
//     children: PropTypes.any,
//   };
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const requireAuth = (nextState, replace) => {
    if (!isAuthenticated) {
      replace({ pathname: '/login' });
    }
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{
      isAuthenticated, login, logout, requireAuth,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}
