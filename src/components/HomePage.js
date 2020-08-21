import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import {
    Form,
    Input,
    Select,
    Row,
    Col,
    Button,
    DatePicker,
    Radio,
    Table,
    Popconfirm,
    Space,
} from 'antd';
import { DeleteOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { CrudContext } from '../context/crud';
import nationalityData from "../nationality.json";
import NumberFormat from 'react-number-format';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css';

const { Option } = Select;

const EmpForm = () => {
    const history = useHistory();
    const state = useContext(CrudContext);
    const { addUser, updateUserList, getTableData, getDefaultUsers, forceUpdate } = state;

    const [citizenIDState, setCitizenIDState] = useState({
        showError: null,
    });
    const [phoneInput, setPhoneInput] = useState({
        showError: null,
        showHelp: null,
        showSuccess: null,
        value: null,
    });
    const [dataSource, setDataSource] = useState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Name',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Mobile Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) => <div>
                <Button type="link" onClick={() => history.push(`/edit/${record.key}`)}>Edit</Button>/
             <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                    <Button type="link">Delete</Button>
                </Popconfirm>

            </div>,

        },
    ];

    const tableConfig = {
        bordered: true,
        scroll: { x: '90vw' },
        pagination: {
            position: ["topRight"],
            size: "small",
            showSizeChanger: true,
            showQuickJumper: true
        },
        rowKey: (record) => {
            return `${record.key}`;
        }
    }

    const onSelectChange = selectedRowKeys => {
        setSelectedRowKeys(selectedRowKeys)
    };

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
            let userList = JSON.parse(localStorage.getItem("userList"));
            if (userList.length > 0) {
                values.key = String(Math.max.apply(Math, userList.map((u) => { return Number(u.key) + 1; })));
            } else if (userList.length === 0 || userList === undefined) {
                values.key = "0"
            }
            addUser(values)
            setDataSource([...userList])
            form.resetFields();
            setCitizenIDState({
                showError: null,
            });
            setPhoneInput({
                showError: null,
                showHelp: null,
                showSuccess: null,
                value: null,
            })
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
    const rowLen = citizenLength.length;
    const inputs = [];
    citizenLength.map((value, index) => {
        const tag = (
            <Input
                className="inputCitizen"
                key={index}
                name={`citizenID${index}`}
                onChange={handleInputCitizen}
                onKeyDownCapture={handleInputCitizenCheck}
                type="text"
                pattern={`[0-9]{${value}}`}
                inputMode="numeric"
                maxLength={`${value}`}
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
        return true;
    });

    const handleMultipleDelete = () => {
        const dataSource = getTableData();
        let updatedDataSource = [...selectedRowKeys];
        updatedDataSource = dataSource.filter(row => {
            return updatedDataSource.indexOf(row.key) < 0;
        },
            updatedDataSource
        );
        setDataSource(updatedDataSource)
        updateUserList(updatedDataSource)
        setSelectedRowKeys([])
    }

    const handleDelete = key => {
        const dataSource = getTableData();
        const newDataSource = dataSource.filter(item => item.key !== key);
        setDataSource(newDataSource)
        updateUserList(newDataSource)
    }

    useEffect(() => {
        setDataSource(getTableData())
    }, [forceUpdate])

    const userForm = <Form
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        initialValues={{
            title: "Mr"
        }}
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


        <Form.Item>
            <Button type="primary" htmlType="submit">
                Register
</Button>
        </Form.Item>
    </Form >

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;
    return (
        <React.Fragment>
            <Row justify="center">
                <Col style={{ borderStyle: "ridge", padding: "2rem 3rem", borderRadius: "0.5rem", margin: "2rem 0" }}>{userForm}</Col>
            </Row >
            <Space>
                <Button type="primary"
                    disabled={!hasSelected}
                    onClick={handleMultipleDelete}
                    icon={<DeleteOutlined />}
                    danger
                >
                    Delete({selectedRowKeys.length})
                 </Button>
                <Button
                    type={dataSource?.length !== 5 ? "primary" : null}
                    onClick={getDefaultUsers}
                    icon={<UsergroupAddOutlined />}
                >
                    Default Users
                </Button>
            </Space>
            <Row>
                <Table
                    style={{ width: "100%" }}
                    {...tableConfig}
                    rowSelection={rowSelection}
                    dataSource={dataSource}
                    columns={columns}
                />
            </Row>

        </React.Fragment>
    );
}

export default EmpForm;