import React, { useState } from "react";
import { Modal, Checkbox } from "antd";

const MainFilterModal = ({ visible, onOk, onCancel }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [chooseMinPrice, setChooseMinPrice] = useState(0);
  const [chooseMaxPrice, setChooseMaxPrice] = useState(5000);
  const [selectedOccupancy, setChooseOccupancy] = useState(0);

  const onTypeChange = (type) => {
    // Update chose types of the room
    setSelectedTypes([selectedTypes, type]);
  };

  const onFiltersChange = () => {
    // Choose price
    onOk(selectedTypes, chooseMinPrice, chooseMaxPrice, selectedOccupancy);
  };

  // style

  const styles = {
    priceFilter: {
      display: "flex",
      width: "215px",
      justifyContent: "space-between",
      marginLeft: "60px",
    },
  };

  const options = ["standart", "deluxe", "suite"];

  return (
    <Modal
      title="Choose any filters!"
      open={visible}
      onOk={onFiltersChange}
      onCancel={onCancel}
    >
      <div className="type-filter">
        <span>
          <b>Type</b>
        </span>
        <br />
        <Checkbox.Group
          options={options}
          onChange={onTypeChange}
          defaultValue={options}
        />
      </div>
      <br />
      <div className="occupancy-filter">
        <span>
          <b>Occupancy</b>
        </span>
        <br />
        <form>
          <input
            type="radio"
            name="fav_occupancy"
            value={2}
            onChange={(e) => setChooseOccupancy(e.target.value)}
          />
          <label>2</label>
          <br />
          <input
            type="radio"
            name="fav_occupancy"
            value={3}
            onChange={(e) => setChooseOccupancy(e.target.value)}
          />
          <label>3</label>
          <br />
          <input
            type="radio"
            name="fav_occupancy"
            value={4}
            onChange={(e) => setChooseOccupancy(e.target.value)}
          />
          <label>4</label>
          <br />
        </form>
        <br />
        <div className="price-filter">
          <span>
            <b>Price</b>
          </span>
          <br />
          <input
            type="range"
            min={0}
            max={500}
            value={chooseMinPrice}
            onChange={(e) => setChooseMinPrice(e.target.value)}
          />
          <span style={{ margin: "0px 20px 0px 20px" }}>
            <b>To</b>
          </span>
          <input
            type="range"
            min={500}
            max={5000}
            value={chooseMaxPrice}
            onChange={(e) => setChooseMaxPrice(e.target.value)}
          />

          <br />
          <div className="choose-price" style={styles.priceFilter}>
            <span>{chooseMinPrice}$</span>
            <span>{chooseMaxPrice}$</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MainFilterModal;
