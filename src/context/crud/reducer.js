import { CrudConstant } from './constant';

export const CrudReducer = (state = {}, action) => {
    let userList = JSON.parse(localStorage.getItem("userList"));

    switch (action.type) {
        case CrudConstant.ADD_USER:
            userList.push(action.data)
            localStorage.setItem("userList", JSON.stringify(userList))
            return {
                ...state,
                forceUpdate: !state.forceUpdate,
            };
        case CrudConstant.UPDATE_USER_LIST:
            action.data.length === 0 ? localStorage.removeItem("userList") : localStorage.setItem("userList", JSON.stringify(action.data))
            return {
                ...state,
            }
        case CrudConstant.UPDATE_USER:
            let updatedDataSource = [...userList];

            for (let i in updatedDataSource) {
                if (updatedDataSource[i].key == action.data.key) {
                    updatedDataSource[i].title = action.data.title ? action.data.title : null;
                    updatedDataSource[i].fname = action.data.fname ? action.data.fname : null;
                    updatedDataSource[i].lname = action.data.lname ? action.data.lname : null;
                    updatedDataSource[i].fullname = action.data.fname && action.data.lname ? `${action.data.fname} ${action.data.lname}` : null;
                    updatedDataSource[i].birthday = action.data.birthday ? action.data.birthday : null;
                    updatedDataSource[i].nationality = action.data.nationality ? action.data.nationality : null;
                    updatedDataSource[i].gender = action.data.gender ? action.data.gender : null;
                    updatedDataSource[i].passport = action.data.passport ? action.data.passport : null;
                    updatedDataSource[i].expectedSalary = action.data.expectedSalary ? action.data.expectedSalary : null;
                    updatedDataSource[i].phone = action.data.phone ? action.data.phone : null;
                    updatedDataSource[i].citizenID = action.data.citizenID ? action.data.citizenID : null;
                    break;
                }
            }
            localStorage.setItem("userList", JSON.stringify(updatedDataSource))
            return {
                ...state,
            }
        case CrudConstant.FORCE_UPDATE:
            return {
                ...state,
                forceUpdate: !state.forceUpdate,
            }
        default:
            return state;
    }
};