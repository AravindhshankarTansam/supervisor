import React, { createContext, useState, useContext } from 'react';

const IPAddressContext = createContext();

export const IPAddressProvider = ({ children }) => {
  const [ipAddress, setIpAddress] = useState('');

  return (
    <IPAddressContext.Provider value={{ ipAddress, setIpAddress }}>
      {children}
    </IPAddressContext.Provider>
  );
};

export const useIPAddress = () => {
  return useContext(IPAddressContext);
};
