import React, { useState } from "react";
import { Modal, message, Form, Input } from "antd";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../DataBase/firebase";
import { useParams } from "react-router-dom";

const CheckInModal = ({ visible, onCancel }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [guestName, setGuestName] = useState('');
  const [guestCheckInDate, setGuestCheckInDate] = useState(null);

  const { roomId } = useParams();


  const onFinish = async () => {
    const CollectionRef = collection(db, "Rooms");
    const userDocRef = doc(CollectionRef, roomId);

    try {
      await setDoc(
        userDocRef,
        { guest: guestName, isCheckedIn: true, checkInDate: guestCheckInDate },
        { merge: true }
      );
      messageApi.open({
        type: "success",
        content: "The guest add successful!",
      });
      onCancel();
    } catch (error) {
      console.error("Something wrong: " + error);
    }
  };
  return (
    <Modal
      title={"Check In"}
      open={visible}
      onCancel={onCancel}
      onOk={onFinish}
    >
      {contextHolder}
      <Form
        name="basic"
        labelCol={{
          span: 100,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 1000,
        }}
        onFinish={onFinish}
        autoComplete="off"
        className="checkIn-form"
      >
        <Form.Item
          className="checkIn-form-input"
          label="Please, enter the guest`s name"
          name="Please, enter the guest`s name"
          rules={[
            {
              required: true,
              message: "Please, enter the guest`s name",
            },
          ]}
        >
          <Input
            className="checkIn-input"
            onChange={(e) => setGuestName(e.target.value)}
            placeholder={`Guest\`s Name`}
            addonBefore={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item
          className="checkIn-form-input"
          label="Please, enter the approximate date of guest checkout"
          name="Enter guest's date"
        >
          <Input
            type="date"
            className="checkIn-input"
            onChange={(e) => setGuestCheckInDate(e.target.value)}
            placeholder={`Select date`}
            addonBefore={<CalendarOutlined />}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CheckInModal;
