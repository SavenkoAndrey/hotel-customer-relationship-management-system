import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { collection, doc, setDoc } from "firebase/firestore/lite";
import { db } from "../DataBase/firebase";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";

const AuthorizationPage = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [isRemember, setIsRemember] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useAuth();

  // get temporaryToken if users doesn't click on 'Remember me'

  const temporaryToken = Math.random().toString(36).substring(2) + Date.now();

  // for get response from ReduxSaga store

  // const dispatch = useDispatch();
  const users = useSelector((state) => state.data.users);
  const userLength = users.length;

  // if a user already authenticat that just navigate to main page

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/hotel");
    }
  }, [navigate, isAuthenticated]);

  // for control input values

  //when form has name + password (correct password* from bd) then call onFinish
  const onFinish = () => {
    // get users password
    const user = users.find((user) => user.password === password);

    if (user && user.name.length === 0) {
      checkRemember();
      messageApi
        .open({
          type: "loading",
          content: "Loading...",
          duration: 2,
        })
        .then(() => message.success("Successful", 2));
      setTimeout(() => {
        navigate("/hotel");
      }, 2100);
    } else if(!user) {
      messageApi.open({
        type: "error",
        content: "Login failed!",
      });
    }
    if (user.name.length > 0 && user) {
      messageApi.open({
        type: "error",
        content: "User already in the system!",
      });
      return;
    }
  };

  const checkRemember = async () => {
    if (isRemember) {
      localStorage.setItem("username", username);
      const user = users.find((user) => user.password === password);

      if (user) {
        const CollectionRef = collection(db, "Accounts");
        const userDocRef = doc(CollectionRef, user.id);
        try {
          await setDoc(userDocRef, { name: username }, { merge: true });
        } catch (error) {
          console.error("Error adding/updating document: ", error);
        }
      }
    } else {
      // save a temporary token, when the user closes the site or browser the token is deleted
      sessionStorage.setItem("temporaryToken", temporaryToken);
    }
  };

  return userLength === 0 ? (
    <div>{<Loading />}</div>
  ) : (
    <div className="authorization-container">
      <div className="authorization-content">
        <div className="authorization-header">
          <span>
            <b>Authorization</b>
          </span>
        </div>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 1000,
          }}
          initialValues={{
            remember: isRemember,
          }}
          onFinish={onFinish}
          autoComplete="off"
          className="authorization-form"
        >
          <Form.Item
            className="authorization-form-input"
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
            />
          </Form.Item>

          <Form.Item
            className="authorization-form-input"
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            className="authorization-checkbox"
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox onChange={(e) => setIsRemember(e.target.checked)}>
              Remember me
            </Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            {contextHolder}

            <Button className="login-button" type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AuthorizationPage;
