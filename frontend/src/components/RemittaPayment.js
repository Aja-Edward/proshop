import { useState, useEffect } from "react";
import axios from "axios";
import RemitaPayment from "react-remita";
// import "./RemittaPayment.css";
import { useDispatch } from "react-redux";
import { payOrder } from "../actions/orderActions";

const RemittaPayment = () => {
  const [key, setKey] = useState();

  useEffect(() => {
    const getKey = async () => {
      const { data: clientKey } = await axios.get("api/config/remitta");
      setKey(clientKey);
    };
    getKey();
  }, [key]);
  const [paymentData, setpaymentData] = useState({
    key: key,
    customerId: "",
    firstName: "",
    lastName: "",
    email: "",
    amount: null,
    narration: "",
  });

  let data = {
    ...paymentData,
    onSuccess: function (response) {
      // function callback when payment is successful
      console.log("callback Successful Response", response);
    },
    onError: function (response) {
      // function callback when payment fails
      console.log("callback Error Response", response);
    },
    onClose: function () {
      // function callback when payment modal is closed
      console.log("closed");
    },
  };

  return (
    <div className="remitta-container">
      <div className="remitta-wrapper">
        <p>Pay with remita example</p>
        <input
          type="text"
          placeholder="firstname"
          onChange={(e) =>
            setpaymentData({ ...paymentData, firstName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="lastname"
          onChange={(e) =>
            setpaymentData({ ...paymentData, lastName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="email"
          onChange={(e) =>
            setpaymentData({ ...paymentData, email: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="amount"
          onChange={(e) =>
            setpaymentData({ ...paymentData, amount: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="description(optional)"
          onChange={(e) =>
            setpaymentData({ ...paymentData, narration: e.target.value })
          }
        />
        <RemitaPayment
          remitaData={data}
          className="btn" // class to style the button
          text="Pay with Remita" //text to show on button
          // add a 'live' prop to use the live urls/keys
        />
      </div>
    </div>
  );
};
export default RemittaPayment;
