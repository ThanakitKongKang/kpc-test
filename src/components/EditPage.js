import React, { useState, useEffect, useContext } from 'react';
import Moment from 'moment';
import { useHistory, useParams } from 'react-router-dom'
import {
    Form,
    Input,
    Select,
    Row,
    Col,
    Button,
    DatePicker,
    Radio,
    Space,
} from 'antd';
import { CrudContext } from '../context/crud';
import nationalityData from "../nationality.json";
import NumberFormat from 'react-number-format';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css';

const { Option } = Select;

const EditPage = () => {
    Moment.locale('th')
    const history = useHistory();
    const state = useContext(CrudContext);
    const { updateUser, getTableData } = state;
    const { id } = useParams();

    // initial values
    const dataSource = getTableData();
    const currentUser = dataSource.filter(item => item.key === id);

    const formInitialValues = {
        title: currentUser[0].title ? currentUser[0].title : "Mr",
        fname: currentUser[0].fname ? currentUser[0].fname : null,
        lname: currentUser[0].lname ? currentUser[0].lname : null,
        birthday: currentUser[0].birthday ? Moment(currentUser[0].birthday) : null,
        nationality: currentUser[0].nationality ? currentUser[0].nationality : null,
        gender: currentUser[0].gender ? currentUser[0].gender : null,
        passport: currentUser[0].passport ? currentUser[0].passport : null,
        expectedSalary: currentUser[0].expectedSalary ? currentUser[0].expectedSalary : null,
        phone: currentUser[0].phone ? currentUser[0].phone : null,
    }

    const [citizenIDState, setCitizenIDState] = useState({
        showError: null,
    });

    const [phoneInput, setPhoneInput] = useState({
        showError: null,
        showHelp: null,
        showSuccess: null,
        value: currentUser[0].phone,
    });
    const [form] = Form.useForm();
    const onFinish = values => {
        values.citizenID =
            citizenIDState.citizenID0 +
            citizenIDState.citizenID1 +
            citizenIDState.citizenID2 +
            citizenIDState.citizenID3 +
            citizenIDState.citizenID4;
        values.phone = phoneInput.value;
        values.fullname = `${values.fname} ${values.lname}`;
        if (handleValidate(values) && !phoneInput.showError) {
            values.key = id;
            updateUser(values)
            history.push('/')
        }
    };

    const handleValidate = (values) => {
        validatePhoneNumber();
        const length = values.citizenID.length;
        if (length > 0 && length !== 13) {
            setCitizenIDState({
                ...citizenIDState,
                showError: true,
            })
            return false;
        } else if (length === 0 || length === undefined) {
            setCitizenIDState({
                ...citizenIDState,
                showError: false,
            })
            // delete values.citizenID
            values.citizenID = ""

        } else if (length === 13) {
            setCitizenIDState({
                ...citizenIDState,
                showError: false,
            })

        }
        return true;
    }

    const validatePhoneNumber = () => {
        if (phoneInput.value) {
            if (isValidPhoneNumber(phoneInput.value)) {
                setPhoneInput({
                    ...phoneInput,
                    showError: false,
                    showHelp: null,
                    showSuccess: true,
                })
            }
            else {
                setPhoneInput({
                    ...phoneInput,
                    showError: true,
                    showHelp: "Invalid phone number",
                    showSuccess: false,
                })

            }
        } else {
            setPhoneInput({
                ...phoneInput,
                showError: true,
                showHelp: "Phone number required",
                showSuccess: false,
            })
        }
    }

    const nextFocus = next => {
        while ((next = next.nextElementSibling)) {
            if (next == null) break;
            if (next.tagName.toLowerCase() === "input") {
                next.focus();
                break;
            }
        }
    };

    const prevFocus = prev => {
        while ((prev = prev.previousElementSibling)) {
            if (prev == null) break;
            if (prev.tagName.toLowerCase() === "input") {
                prev.focus();
                break;
            }
        }
    };

    const handleInputCitizen = evt => {
        let target = evt.srcElement || evt.target;
        let maxLength = parseInt(target.attributes["maxLength"].value, 10);
        let length = target.value.length;

        if (length === maxLength) {
            nextFocus(target);
        }

        // Move to previous field if empty (user pressed backspace)
        else if (length === 0) {
            prevFocus(target);
        }

        setCitizenIDState({
            ...citizenIDState,
            [target.name]: target.value ? target.value : null,
        });
    };

    const handleInputCitizenCheck = evt => {
        let target = evt.srcElement || evt.target;
        let maxLength = parseInt(target.attributes["maxLength"].value, 10);
        let length = target.value.length;
        const key = evt.keyCode || evt.charCode;
        if (key === 8 || key === 46) return false;
        if (length === maxLength) {
            nextFocus(target);
        }
    };
    const citizenLength = [1, 4, 5, 2, 1];
    const initCitizenID = currentUser[0].citizenID;
    useEffect(() => {
        let startAt, endAt = 0;
        citizenLength.map((value, index) => {
            endAt += value;
            let inputValue = initCitizenID ? initCitizenID.slice(startAt, endAt) : null;
            citizenIDState['citizenID' + index] = inputValue;
            startAt = endAt;
            return true;
        });
    }, [])
    const rowLen = citizenLength.length;
    const inputs = [];
    let startAt, endAt = 0;
    citizenLength.map((value, index) => {
        endAt += value;
        let inputValue = initCitizenID ? initCitizenID.slice(startAt, endAt) : null;
        const tag = (
            < Input
                className="inputCitizen"
                key={index}
                name={`citizenID${index}`}
                onChange={handleInputCitizen}
                onKeyDownCapture={handleInputCitizenCheck}
                type="text"
                pattern={`[0-9]{${value}}`}
                inputMode="numeric"
                maxLength={`${value}`}
                defaultValue={inputValue}
                style={{
                    width: `${10 + (value - 1) * 2.5}%`,
                }}
            />
        );
        inputs.push(tag);

        if (rowLen !== index + 1) {
            inputs.push(
                <span key={`after_${index}`} style={{ margin: "0.25rem 0.3rem" }}>
                    -
   </span>
            );
        }
        startAt = endAt;
        return true;
    });

    const cancel = () => {
        history.push('/')
    }
    return (
        <Row justify="center">
            <Col style={{ borderStyle: "ridge", padding: "2rem 3rem", borderRadius: "0.5rem", margin: "2rem 0" }}>

                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    initialValues={
                        formInitialValues
                    }
                    scrollToFirstError
                    onSubmitCapture={validatePhoneNumber}
                >
                    <Row>
                        <Space>
                            <Col>
                                <Form.Item
                                    name="title"
                                    label="Title"
                                >
                                    <Select style={{ width: 70 }}>
                                        <Option value="Mr">Mr.</Option>
                                        <Option value="Mrs">Mrs.</Option>
                                        <Option value="Miss">Miss</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    hasFeedback
                                    name="fname"
                                    label="Firstname"
                                    rules={[{ required: true, message: 'Firstname required' },
                                    {
                                        pattern: /^\S+$/,
                                        message: `Firstname not valid`
                                    }
                                    ]}

                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    hasFeedback
                                    name="lname"
                                    label="Lastname"
                                    rules={[
                                        { required: true, message: 'Lastname required' },
                                        {
                                            pattern: /^\S+$/,
                                            message: `Lastname not valid`
                                        }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Space>
                    </Row>
                    <Row>
                        <Space>
                            <Col>
                                <Form.Item name="birthday" label="Birth Day" hasFeedback
                                    rules={[{ type: 'object', required: true, message: 'Birthday required' }]}
                                >
                                    <DatePicker />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item name="nationality" label="Nationality"
                                >
                                    <Select style={{ width: 300 }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        placeholder="-- Please Select --"
                                    >
                                        {nationalityData.nationality.map((n, i) => {
                                            return <Option key={i} value={n}>{n}</Option>;
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Space>
                    </Row>

                    <Row>

                        <Form.Item
                            label="Citizen ID"
                            name="citizenID"
                            validateStatus={citizenIDState.showError ? "error" : null}
                            help={citizenIDState.showError ? "Citizen ID is not VALID" : null}
                        >
                            <Row>
                                {inputs}
                            </Row>
                        </Form.Item>

                    </Row>
                    <Row>
                        <Col>
                            <Form.Item name="gender" label="Gender">
                                <Radio.Group>
                                    <Radio value="Male">Male</Radio>
                                    <Radio value="Female">Female</Radio>
                                    <Radio value="Unisex">Unisex</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Item
                                label="Mobile Phone"
                                // shouldUpdate={false}
                                hasFeedback
                                rules={[{ required: true, message: 'Please input your mobile phone!' }]}
                                validateStatus={phoneInput.showError ? "error" : phoneInput.showSuccess ? "success" : null}
                                help={phoneInput.showHelp ? phoneInput.showHelp : null}
                            >
                                <PhoneInput
                                    displayInitialValueAsLocalNumber
                                    defaultCountry="TH"
                                    placeholder="Enter phone number"
                                    limitMaxLength
                                    value={phoneInput.value}
                                    onChange={(value) => setPhoneInput({
                                        ...phoneInput,
                                        value: value,
                                        showError: false,
                                        showHelp: null,
                                    })}
                                />
                            </Form.Item>

                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Item label="Passport NO" name="passport"
                                rules={[
                                    {
                                        pattern: /^[A-Z][0-9]{8}$/,
                                        message: `Passport is not valid! (e.g. A12345678)`
                                    }
                                ]}
                            >
                                <Input
                                    type="text"
                                    maxLength="9"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Item name="expectedSalary" label="Expected Salary" hasFeedback rules={[{ required: true, message: 'Expected salary required' }]}>
                                <NumberFormat thousandSeparator={true} suffix={'฿'} className="ant-input" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="end">
                        <Form.Item>
                            <Space>
                                <Button onClick={cancel}>
                                    Cancel
                    </Button>
                                <Button type="primary" htmlType="submit">
                                    Edit
                    </Button>
                            </Space>
                        </Form.Item>
                    </Row>
                </Form >
            </Col>
        </Row >
    );
}

export default EditPage;