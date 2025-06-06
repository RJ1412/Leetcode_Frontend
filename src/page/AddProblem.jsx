import React, { useState } from "react";
import CreateProblemForm from "../components/CreateProblemForm"; // update path as needed

const AddProblem = () => {
  const [isOpen, setIsOpen] = useState(true); // initially true so modal shows

  return (
    <div>
     
      <CreateProblemForm  />

    </div>
  );
};

export default AddProblem;
