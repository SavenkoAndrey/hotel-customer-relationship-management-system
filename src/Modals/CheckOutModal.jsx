import React from "react";
import { Modal, message, Form } from "antd";
import { useParams } from "react-router-dom";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../DataBase/firebase";
import { useSelector } from "react-redux";

const CheckOutModal = ({ visible, onCancel }) => {
  const [messageApi, contextHolder] = message.useMessage();
  // get rooms data
  const { roomId } = useParams();

  const rooms = useSelector((state) => state.roomsData.rooms);

  const roomNumber = rooms.find((room) => room.id === roomId);

  console.log(roomNumber);
  const onFinish = async () => {
    const CollectionRef = collection(db, "Rooms");
    const userDocRef = doc(CollectionRef, roomId);

    try {
      await setDoc(
        userDocRef,
        { guest: "", isCheckedIn: false, checkInDate: null },
        { merge: true }
      );
      messageApi.open({
        type: "success",
        content: "The guest delete successful!",
      });
      onCancel();
    } catch (error) {
      console.error("Something wrong: " + error);
    }
  };

  return (
    <Modal
      className="check-out-modal"
      title={"Check Out"}
      open={visible}
      onCancel={onCancel}
      okText={<b>Confirm</b>}
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
        className="checkOut-form"
      >
        <Form.Item
          className="checkOut-form-input"
          label={`Do you confirm the check-out Room ${roomNumber.number}?`}
          name="Confirm room"
        ></Form.Item>
      </Form>
    </Modal>
  );
};

export default CheckOutModal;
