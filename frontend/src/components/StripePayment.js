import React, { useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import "../../src/index.css";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { useDispatch } from "react-redux";
import { payOrder } from "../actions/orderActions";
import Loader from "./Loader";

const StripePayment = ({ email, name, orderId, amount, clientSecret }) => {
  const dispatch = useDispatch();

  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);

  const handleChange = (e) => {
    console.log(e);
    setDisabled(e.empty);
    if (e.empty === false) {
      setDisabled(!e.complete);
    }
    setError(e.error ? e.error.message : "");
  };

  console.log(clientSecret);
  const handleSubmit = async (e) => {
    console.log(clientSecret);
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })
      .then(({ paymentIntent }) => {
        console.log("succeeded");
        console.log(email);
        setSucceeded(true);
        setError(null);
        setProcessing(false);

        const paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: paymentIntent.created,
          payer: { email_address: email, name: name },
        };

        console.log(paymentResult);
        dispatch(payOrder(orderId, paymentResult));
      })
      .catch((error) => {
        setError(error);
        console.log(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        onChange={handleChange}
        onBlur={() => {
          console.log("CardElement [blur]");
        }}
        onFocus={() => {
          console.log("CardElement [focus]");
        }}
      />

      <Button
        variant={disabled ? "secondary" : processing ? "secondary" : "success"}
        type="submit"
        style={{ width: "100%" }}
        disabled={processing || disabled || succeeded}
      >
        {processing ? <Loader /> : "Pay"}
      </Button>
    </form>
  );
};

export default StripePayment;
