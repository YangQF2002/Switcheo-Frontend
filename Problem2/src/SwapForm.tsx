import React, { useState } from "react";
import './SwapForm.css'
import BuyForm from "./BuyForm.tsx";
import SellForm from "./SellForm.tsx";
import { MdSwapVert } from 'react-icons/md'; 
import { IconContext } from "react-icons";

const SwapForm: React.FC = () => {
  const [status, setStatus] = useState<string>("No transactions made yet!"); 
  const [isBuy, setIsBuy] = useState<boolean>(true); 

  return (
    <div className="overall-form-container">
      <BuyForm setStatus={setStatus} isBuy={isBuy} />

      <IconContext.Provider value={{ color: "white", size: "32px" }}>
        <div className="swap-button-container ">
          <button className="swap-button" onClick={() => setIsBuy(!isBuy)}>
            <MdSwapVert />
          </button>
        </div>
      </IconContext.Provider>

      <SellForm setStatus={setStatus} isBuy={isBuy} />
      <div className="status-bar-container shared-container-style">
        <div className="status-bar">Status </div>
        <br />
        {status.split("\n").map((line, index) => {
          return <div key={index}>{line}</div>;
        })}
      </div>
    </div>
  );
};

export default SwapForm;
