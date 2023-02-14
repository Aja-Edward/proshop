import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import Logo from "../images/flutterwavelogo.png";
import { payOrder } from "../actions/orderActions";
import { Button, Image } from "react-bootstrap";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

export default function FlutterWave({ amount, name, email, orderId }) {
  const dispatch = useDispatch();

  const [key, setKey] = useState("");

  useEffect(() => {
    const getKey = async () => {
      const { data: clientKey } = await axios.get("/api/config/flutterwave");
      setKey(clientKey);
    };
    getKey();
  }, [key]);

  const config = {
    public_key: key,
    tx_ref: Date.now(),
    amount: amount,
    currency: "USD",
    payment_options: "card,mobilemoney,ussd",

    customer: {
      email: email,
      orderId: orderId,
      name: name,
    },

    customizations: {
      title: "Mern Stack Proshop",
      description: "Payment for items in cart",
      logo: "https://media.licdn.com/dms/image/C4D0BAQGD3qXHOQmQgQ/company-logo_100_100/0/1563965294797?e=1680739200&v=beta&t=1ag1cOygq0yuBVfD4SKMM0gQlkz01ipxRjAOwQRi8ZM",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <div className="fluttercontainer">
      <Button
        className="flutterwave"
        onClick={() => {
          handleFlutterPayment({
            callback: (response) => {
              const paymentResult = {
                id: response.id,
                status: response.status,
                update_time: response.created_at,
                payer: { email_address: email },
              };
              dispatch(payOrder(orderId, paymentResult));
              console.log(response);
              closePaymentModal();
            },

            onClose: (res) => {
              console.log(res);
            },
          });
        }}
      >
        Pay with Flutterwave
      </Button>

      <div>
        {" "}
        <em>Powered by</em> <span>FlutterWave</span>
      </div>
    </div>
  );
}
