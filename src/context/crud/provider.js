import React, { createContext } from 'react';
import { CrudFunctions } from './functions';

const CrudContext = createContext();
const CrudProvider = ({ children }) => {
    const [
        state,
        dispatch,
        addUser,
        updateUserList,
        getTableData,
        getDefaultUsers,
        updateUser
    ] = CrudFunctions.useDefineRestAPIFunctions();

    return (
        <CrudContext.Provider
            value={{
                ...state,
                dispatch,
                addUser,
                updateUserList,
                getTableData,
                getDefaultUsers,
                updateUser
            }}
        >
            {children}
        </CrudContext.Provider>
    );
};

export { CrudContext, CrudProvider }
