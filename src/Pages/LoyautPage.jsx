import React, { useEffect, useState } from "react";
import { Button, message, Space } from "antd";

import { Pagination } from "antd";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import Header from "../Components/Header";
import { useSelector } from "react-redux";
import Loading from "../Components/Loading";
import TypeFilterModal from "../Modals/TypeFilterModal";
import MainFilterModal from "../Modals/MainFilterModal";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../DataBase/firebase";

// pages

const LoyautPage = () => {
  // Take a room`s data from SAGA STORE

  const rooms = useSelector((state) => state.roomsData.rooms);

  // Stats
  /*The state for sort and free rooms */
  const [sortBy, setSortBy] = useState(null);
  const [checkFreeRoom, setCheckFreeRoom] = useState(false);

  /*The state for selected types */
  const [selectedRoomType, setSelectedRoomType] = useState([]);
  const [selectedRoomPrice, setSelectedRoomPrice] = useState({});
  const [selectedOccupancy, setSelectedOccupancy] = useState(0);

  /*The state for filtered rooms and for clean the new state */
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [isClearAllFilters, setIsClearAllFilters] = useState(false);

  /*The state for modals vivsible */
  const [isTypeFilterModalVisible, setIsTypeFilterModalVisible] =
    useState(false);
  const [isMainFilterModalVisible, setIsMainFilterModalVisible] =
    useState(false);

  /*The state for real time db */

  const [isUpdataData, setIsUpdataData] = useState(false);
  const [roomsUpdatedData, setRoomsUpdatedData] = useState([]);

  // Message API and navigate to rooms info

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // for change the page

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // for split the page (10el for every pages)

  const [currentPage, setCurrentPage] = useState(1);
  const [dataLengthPerPage, setDataLengthPerPage] = useState(10);
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // create a filter logics

  useEffect(() => {
    if (isClearAllFilters) {
      messageApi.open({
        type: "success",
        content: "Success",
      });
      setSelectedRoomType([]);
      setSelectedRoomPrice({});
      setSelectedOccupancy(0);
      setIsClearAllFilters(false);
    }
    // for real time db

    if (!isUpdataData) {
      const colRef = collection(db, "Rooms");

      onSnapshot(colRef, (snapshot) => {
        const updatedRoomsInformation = [];
        snapshot.docs.forEach((doc) => {
          updatedRoomsInformation.push({ ...doc.data(), id: doc.id });
        });
        setIsUpdataData(true);
        setRoomsUpdatedData(updatedRoomsInformation);
      });
    }

    // if checkInDate less or equal current data

    roomsUpdatedData.map((room) => {
      const currentDate = new Date();
      const CollectionRef = collection(db, "Rooms");
      const userDocRef = doc(CollectionRef, room.id);
      const checkInDate = new Date(room.checkInDate);

      console.log(currentDate, checkInDate);

      if (currentDate >= checkInDate) {
        try {
          setDoc(
            userDocRef,
            { guest: "", isCheckedIn: false, checkInDate: null },
            { merge: true }
          );
          console.log("All rooms are update");
        } catch (error) {
          console.error("Something wrong: " + error);
        }
      }
      return roomsUpdatedData;
    });

    const filteredData = roomsUpdatedData.filter((room) => {
      let isRoomValid = true;

      // Check for selected room types
      if (selectedRoomType[1] && selectedRoomType[1].length > 0) {
        isRoomValid = isRoomValid && selectedRoomType[1].includes(room.type);
      }

      // Check for occupancy / two variants

      /*First*/

      // switch (selectedOccupancy) {
      //   case 2:
      //     isRoomValid = isRoomValid && room.occupancy === 2;
      //     break;
      //   case 3:
      //     isRoomValid = isRoomValid && room.occupancy === 3;
      //     break;
      //   case 4:
      //     isRoomValid = isRoomValid && room.occupancy === 4;
      //     break;
      //   default:
      //     // No specific occupancy selected, no filter is applied
      //     break;
      // }

      /* Second */

      if (selectedOccupancy > 0) {
        isRoomValid = isRoomValid && room.occupancy === selectedOccupancy;
      }

      // Check for free rooms
      if (checkFreeRoom) {
        isRoomValid = isRoomValid && room.isCheckedIn === false;
      }

      // Check for price range
      if (selectedRoomPrice.min !== undefined) {
        isRoomValid = isRoomValid && room.price >= selectedRoomPrice.min;
      }
      if (selectedRoomPrice.max !== undefined) {
        isRoomValid = isRoomValid && room.price <= selectedRoomPrice.max;
      }

      //default value
      return isRoomValid;
    });
    const dataLenth = filteredData.length;

    // Slice the data from start index to end
    const sliceTheData = filteredData.slice(startIndex, endIndex);

    // it's for the check all of the data` rooms, for ex.: the data equal 20, but the slice only 10 el. per page if it's only 11 el. after the sort/fiter that pagination shold be visible if not hiden (if the el = 10 or less)
    setDataLengthPerPage(dataLenth);

    // for slice state
    setFilteredRooms(sliceTheData);

    //effect`s dependencies
  }, [
    rooms,
    selectedRoomType,
    selectedRoomPrice,
    checkFreeRoom,
    startIndex,
    endIndex,
    isClearAllFilters,
    messageApi,
    selectedOccupancy,
    isUpdataData,
    roomsUpdatedData,
  ]);

  // choose the filter type

  const applyTypeFilters = (selectedTypes) => {
    const chooseType = selectedTypes;

    setSelectedRoomType(chooseType);
    setIsTypeFilterModalVisible(false);
  };

  // choose the all of filters

  const applyMainFilters = (
    selectedTypes,
    chooseMinPrice,
    chooseMaxPrice,
    selectedOccupancy
  ) => {
    const chooseType = selectedTypes;
    const chooseOccupancy = parseInt(selectedOccupancy, 10);
    setSelectedRoomType(chooseType);
    setSelectedRoomPrice({ min: chooseMinPrice, max: chooseMaxPrice });
    setSelectedOccupancy(chooseOccupancy);
    setIsMainFilterModalVisible(false);
  };

  // call back function for the sort

  const sortData = (columnName) => {
    const sortedData = [...filteredRooms];

    sortedData.sort((a, b) => {
      if (columnName === "Number") {
        return a.number - b.number;
      } else if (columnName === "Price") {
        return a.price - b.price;
      } else if (columnName === "Occupancy") {
        return a.occupancy - b.occupancy;
      }
      return 0;
    });
    setFilteredRooms(sortedData);
    setSortBy(columnName);
  };

  const newLocal = "th-content";

  return rooms.length === 0 ? (
    <Loading />
  ) : (
    <>
      <header>
        <Header />
      </header>
      <div className="loyaut-container">
        <div className="loyaut-header">
          {contextHolder}
          <Space>
            <Button
              className="loyaut-btn"
              onClick={() => setIsClearAllFilters(true)}
            >
              Clear all filters
            </Button>
          </Space>
          <div>
            <input
              type="checkbox"
              onChange={(e) => setCheckFreeRoom(e.target.checked)}
              title="Free rooms only"
            />{" "}
            Free rooms only
          </div>
        </div>
        <div className="loyaut-content">
          <table className="loyaut-table">
            <thead className="loyaut-header-table">
              <tr>
                <th onClick={() => sortData("Number")}>
                  <div className={newLocal}>
                    <span>
                      Number
                      {sortBy === "Number" ? (
                        <CaretUpOutlined />
                      ) : (
                        <CaretDownOutlined />
                      )}
                    </span>
                    <div className="line-space" />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <span>Type</span>
                    <div className="filter">
                      <FilterOutlined
                        onClick={() => setIsTypeFilterModalVisible(true)}
                      />

                      <TypeFilterModal
                        visible={isTypeFilterModalVisible}
                        onOk={applyTypeFilters}
                        onCancel={() => setIsTypeFilterModalVisible(false)}
                      />
                      <div className="line-space" />
                    </div>
                  </div>
                </th>
                <th onClick={() => sortData("Occupancy")}>
                  <div className="th-content">
                    <span>
                      Occupancy
                      {sortBy === `Occupancy` ? (
                        <CaretUpOutlined />
                      ) : (
                        <CaretDownOutlined />
                      )}
                    </span>
                    <div className="line-space" />
                  </div>
                </th>
                <th onClick={() => sortData("Price")}>
                  <div className="th-content">
                    <span>
                      Price
                      {sortBy === `Price` ? (
                        <CaretUpOutlined />
                      ) : (
                        <CaretDownOutlined />
                      )}
                    </span>
                    <div className="line-space" />
                  </div>
                </th>
                <th onClick={() => sortData("Guest")}>
                  <div className="th-content">
                    <span>Guest</span>
                  </div>
                </th>
                <th onClick={() => sortData("Guest")}>
                  <div className="th-content">
                    <div className="main-filter">
                      <FilterOutlined
                        onClick={() => setIsMainFilterModalVisible(true)}
                      />
                      <MainFilterModal
                        className="main-modal"
                        visible={isMainFilterModalVisible}
                        onOk={applyMainFilters}
                        onCancel={() => setIsMainFilterModalVisible(false)}
                      />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="loyaut-body-table">
              {filteredRooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.number}</td>
                  <td>{room.type}</td>
                  <td>{room.occupancy}</td>
                  <td>{room.price}$</td>
                  <td>{room.guest}</td>
                  <Space>
                    <Button
                      className="loyaut-btn"
                      onClick={() => navigate(`/room/${room.id}`)}
                    >
                      More information
                    </Button>
                  </Space>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {dataLengthPerPage >= itemsPerPage && (
          <footer className="loyaut-footer">
            <Pagination
              pageSize={itemsPerPage}
              current={currentPage}
              total={rooms.length}
              onChange={handlePageChange}
            />
          </footer>
        )}
      </div>
    </>
  );
};

export default LoyautPage;
