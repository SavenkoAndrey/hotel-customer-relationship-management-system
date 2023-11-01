import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, message, Space } from "antd";
import { HomeOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import Loading from "../Components/Loading";
import CheckInModal from "../Modals/CheckInModal";
import CheckOutModal from "../Modals/CheckOutModal";
import { db } from "../DataBase/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";

const RoomPage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  // styles

  const styles = {
    checkIn: {
      borderRadius: "0px",
      color: "#6e6e6e",
      marginRight: "2vh",
      border: "1px solid",
    },
    checkOut: {
      backgroundColor: "#4291F7",
      borderRadius: "0px",
      color: "#fff",
    },
    backHomeBlock: {
      width: "110px",
      display: "flex",
      justifyContent: "space-between",
      margin: "3vh 0px 3vh 0px",
    },
    homeOutlined: {},
  };
  const navigate = useNavigate();
  const rooms = useSelector((state) => state.roomsData.rooms);

  // States
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisibleCheckInModal, setIsVisibleCheckInModal] = useState(false);
  const [isVisibleCheckOutModal, setIsVisibleCheckOutModal] = useState(false);
  const [isUpdataData, setIsUpdataData] = useState(false);

  // find the room with a help id
  const { roomId } = useParams();

  const roomInfo = rooms.find((room) => room.id === roomId);
  const [roomsUpdatedData, setRoomsUpdatedData] = useState([]);

  // swap the image

  const showPreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const showNextImage = () => {
    if (currentImageIndex < roomInfo.gallery.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  useEffect(() => {
    if (!isUpdataData) {
      const colRef = collection(db, "Rooms");
      const docRef = doc(colRef, roomInfo.id);

      // for real time db 
      onSnapshot(docRef, (doc) => {
        const updatedRoomsInformation = [];
        updatedRoomsInformation.push({ ...doc.data(), id: doc.id });

        setIsUpdataData(true);
        setRoomsUpdatedData(updatedRoomsInformation);
        console.log(updatedRoomsInformation);
      });
    }
  }, [isUpdataData, roomInfo]);

  console.log(roomsUpdatedData);

  // Modal
  const openCheckInModal = () => {
    if (roomsUpdatedData[0].isCheckedIn === false) {
      setIsVisibleCheckInModal(true);
    } else {
      messageApi.open({
        type: "warning",
        content: "The room is not a free!",
      });
    }
  };

  const openCheckOutModal = () => {
    if (roomsUpdatedData[0].isCheckedIn === true) {
      setIsVisibleCheckOutModal(true);
    } else {
      messageApi.open({
        type: "warning",
        content: "No any guests for out from the room!",
      });
    }
  };

  const closeTheModal = () => {
    setIsVisibleCheckInModal(false);
    setIsVisibleCheckOutModal(false);
  };

  return !roomInfo ? (
    <Loading />
  ) : (
    <>
      <header>
        <Header />
      </header>
      {contextHolder}
      <div className="room-container">
        <div className="room-container-content">
          <div className="text-back-home">
            <span
              onClick={() => navigate("/hotel")}
              style={styles.backHomeBlock}
            >
              <HomeOutlined />
              <b>Back home</b>
            </span>
          </div>
          <div className="room-container-context">
            <div className="context-image">
              <img
                className="room-image"
                src={roomInfo.gallery[currentImageIndex]}
                alt="RoomImage"
              />
              {currentImageIndex < roomInfo.gallery.length - 1 && (
                <RightOutlined
                  className="right-outlined"
                  onClick={showNextImage}
                />
              )}
              {currentImageIndex > 0 && (
                <LeftOutlined
                  className="left-outlined"
                  onClick={showPreviousImage}
                />
              )}
              <div className="all-of-rooms-image">
                {roomInfo.gallery.map((image, index) => (
                  <img
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className="all-rooms-image"
                    src={image}
                    alt="RoomImage"
                    style={{
                      border:
                        currentImageIndex === index
                          ? "3px solid #00028d"
                          : "none",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="room-context">
              <div className="room-number">
                <h2>Room {roomInfo.number}</h2>
              </div>
              <div className="room-info">
                <b>Type:</b> {roomInfo.type}
              </div>
              <div className="room-info">
                <b>Occupancy:</b> {roomInfo.occupancy}
              </div>
              <div className="room-info">
                <b>Price:</b> {roomInfo.price}$
              </div>
              <div className="room-info">
                <b>Guest:</b>{" "}
                {!isUpdataData ? roomInfo.guest : roomsUpdatedData[0].guest}
              </div>
            </div>
            <div className="room-features">
              <div className="features-buttons">
                <Space>
                  <Button onClick={openCheckInModal} style={styles.checkIn}>
                    Check In
                  </Button>
                  <Button onClick={openCheckOutModal} style={styles.checkOut}>
                    Check Out
                  </Button>
                </Space>
              </div>
              <CheckInModal
                visible={isVisibleCheckInModal}
                onCancel={closeTheModal}
              />
              <CheckOutModal
                visible={isVisibleCheckOutModal}
                onCancel={closeTheModal}
              />
              <div className="features-text">
                <p>
                  <b>Features:</b>
                </p>
                {roomInfo.features.map((features, index) => (
                  <p key={index}>
                    <span style={{ color: "#636363", fontSize: "17px" }}>
                      <b>✔</b>
                    </span>{" "}
                    {features}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="room-container-description">
            <p>
              <b>Description:</b> {roomInfo.description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomPage;
