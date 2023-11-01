import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { collection, doc, setDoc } from "firebase/firestore/lite";
import { db } from "../DataBase/firebase";
import Loading from "./Loading";
import { fetchUsers } from "../ReduxStore/reducers/reduxSaga/userReducer";

const Header = () => {
  const userToken = localStorage.getItem("username");
  const users = useSelector((state) => state.data.users);
  const user = users.find((user) => user.name === userToken);
  const navigate = useNavigate();
  const dispatch = useDispatch()


  const logOut = async () => {
    if (user) {
      const CollectionRef = collection(db, "Accounts");
      const userDocRef = doc(CollectionRef, user.id);
      try {
        localStorage.removeItem("username");
        await setDoc(userDocRef, { name: "" }, { merge: true });
      } catch (error) {
        console.error("Something wrong: ", error);
      }
    } else {
      sessionStorage.removeItem("temporaryToken");
    }
    navigate("/");
    dispatch(fetchUsers());
  };

  return user === undefined && userToken ? (
    <Loading />
  ) : (
    <div className="header-container">
      <div className="header-content">
        <div className="header-logo" onClick={() => navigate("/hotel")}>
          <p className="header-logo-text">Hotel</p>
          <div className="header-logo-stars"> ⭐⭐⭐⭐⭐ </div>
        </div>
        <div className="header-login">
          <div className="header-image">
            <div className="header-image-icon">
              {user ? (
                <img src={user.image} alt="userimg" />
              ) : (
                <div>
                  {" "}
                  <UserOutlined />{" "}
                </div>
              )}
            </div>
          </div>
          <span className="login">
            <b onClick={logOut}>Log out</b>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
