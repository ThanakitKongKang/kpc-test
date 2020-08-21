import React, { useReducer } from 'react';
import { CrudConstant } from './constant';
import { CrudReducer } from './reducer';
import { message } from 'antd'

const success = (s) => {
    message.success(s);
};

const useDefineRestAPIFunctions = () => {
    const initialObject = {
        forceUpdate: false,
        country: null,
    };

    const initialUserList = [{
        key: "0",
        title: null,
        fname: "Ratvadee",
        lname: "Sagarik",
        fullname: "Ratvadee Sagarik",
        birthday: null,
        nationality: "Thai",
        citizenID: null,
        gender: "Female",
        phone: "+66879862511",
        passport: null,
        expectedSalary: null,
    },
    {
        key: "1",
        title: null,
        fname: "Kangsadan",
        lname: "Poosee",
        fullname: "Kangsadan Poosee",
        birthday: null,
        nationality: "Thai",
        citizenID: null,
        gender: "Female",
        phone: "+66827774997",
        passport: null,
        expectedSalary: null,
    },
    {
        key: "2",
        title: null,
        fname: "Risa",
        lname: "Pansakul",
        fullname: "Risa Pansakul",
        birthday: null,
        nationality: "Thai",
        citizenID: null,
        gender: "Female",
        phone: "+66819956782",
        passport: null,
        expectedSalary: null,
    },
    {
        key: "3",
        title: null,
        fname: "Sawi",
        lname: "Tri",
        fullname: "Sawi Tri",
        birthday: null,
        nationality: "American",
        citizenID: null,
        gender: "Female",
        phone: "+66720779988",
        passport: null,
        expectedSalary: null,
    },
    {
        key: "4",
        title: null,
        fname: "Attapon",
        lname: "Sagarik",
        fullname: "Attapon Sagarik",
        birthday: null,
        nationality: "Thai",
        citizenID: null,
        gender: "Male",
        phone: "+66939077930",
        passport: null,
        expectedSalary: null,
    },]

    const [state, dispatch] = useReducer(CrudReducer, initialObject)
    const addUser = (param) => {
        dispatch({
            type: CrudConstant.ADD_USER,
            data: param,
        })
        success("Added user successfully");
    }
    const updateUser = param => {
        dispatch({
            type: CrudConstant.UPDATE_USER,
            data: param,
        })
        success("Updated user successfully");
    }
    const updateUserList = (param) => {
        dispatch({
            type: CrudConstant.UPDATE_USER_LIST,
            data: param,
        })
    }

    const getTableData = () => {
        let userList = localStorage.getItem("userList");
        if (userList == null || userList.length === 0) {
            localStorage.setItem("userList", JSON.stringify(initialUserList))
            return initialUserList;
        } else {
            return JSON.parse(userList);
        }
    }

    const getDefaultUsers = () => {
        localStorage.setItem("userList", JSON.stringify(initialUserList))
        dispatch({
            type: CrudConstant.FORCE_UPDATE,
        })
    }

    return [
        state,
        dispatch,
        addUser,
        updateUserList,
        getTableData,
        getDefaultUsers,
        updateUser,
    ];
};

export const CrudFunctions = {
    useDefineRestAPIFunctions,
}