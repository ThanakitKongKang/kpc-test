import React, { createContext } from 'react';
import { CrudProvider } from './crud'
export const AppContext = createContext();

const AppProvider = ({ children }) => {
    return (
        <AppContext.Provider value={null}>
            <CrudProvider>
                {children}
            </CrudProvider>
        </AppContext.Provider>
    )
}

export { AppProvider };