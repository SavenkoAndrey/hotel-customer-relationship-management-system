import React, { useState } from "react";
import { Modal, Checkbox } from "antd";

const TypeFilterModal = ({ visible, onOk, onCancel }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);

  const onChange = (type) => {
    // Update choose types of the room

    setSelectedTypes([selectedTypes, type]);
  };

  const options = ["standart", "deluxe", "suite"];

  return (
    <Modal
      title="Filter by Room Types"
      open={visible}
      onOk={() => {
        onOk(selectedTypes);
      }}
      onCancel={onCancel}
    >
      <Checkbox.Group options={options} onChange={onChange} defaultValue={options}/>
    </Modal>
  );
};

export default TypeFilterModal;
