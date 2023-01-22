import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import FlutterWave from "../components/FlutterWave";
import PaystackPayment from "../components/PaystackPayment";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  ListGroupItem,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePayment from "../components/StripePayment";
import { getOrderDetails, payOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET } from "../constants/orderConstants";

const OrderScreen = () => {
  const params = useParams();
  const [sdkReady, setSdkReady] = useState(false);
  const [clientId, setClientId] = useState(undefined);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderId = params.id;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const stripePromise = loadStripe(
    "pk_test_51MLh77AcQ0Nej3ZVjJVKTjEZV4AM63VEdB3IvQ0E5dCXWOxKNS96YDqqYNTzMEhtxfK97jSQtcpSKX5i9FsT65gA00ILWlOifa"
  );

  if (!loading) {
    // Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }
  useEffect(() => {
    if (!order || successPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [order, successPay, orderId]);
  //   const addPayPalScript = async () => {
  //     const { data: clientId } = await axios.get("/api/config/paypal");
  //     const script = document.createElement("script");
  //     script.type = "text/javascript";
  //     script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
  //     script.async = true;
  //     script.onload = () => {
  //       setSdkReady(true);
  //     };
  //     document.body.appendChild(script);
  //   };

  //   if (!order || successPay) {
  //     dispatch({ type: ORDER_PAY_RESET });
  //     dispatch(getOrderDetails(orderId));
  //   } else if (!order?.isPaid) {
  //     if (order?.paymentMethod === "PayPal") {
  //       if (!window.paypal) {
  //         addPayPalScript();
  //       } else {
  //         setSdkReady(true);
  //       }
  //     }
  //   }

  //   // setClientId();
  //   // (async () => {
  //   //     const { data: clientId } = await axios.get('/api/config/flutterwave')
  //   //     setClientId(clientId)
  //   //     setSdkReady(true)
  //   // })()
  //   // setClientId()
  // }, [dispatch, order, orderId, successPay]);

  // useEffect(() => {
  //   console.log(stripePromise);
  //   if (order?.isPaid || order?.paymentMethod !== "Stripe") return;

  //   if (!stripePromise) setSdkReady(false);
  //   setSdkReady(true);
  //   // if (order.paymentMethod === "Stripe") {
  //   //   if (!stripePromise) {
  //   //     setSdkReady(false);
  //   //   }
  //   // } else {
  //   //   setSdkReady(true);
  //   // }
  // }, [stripePromise, order?.paymentMethod]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                Email:{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                {" "}
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city} ,
                {order.shippingAddress.postalCode} ,{" "}
                {order.shippingAddress.country},
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroupItem>
              <h2>Payment Method:</h2>
              <p>
                {" "}
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not paid</Message>
              )}
            </ListGroupItem>

            <ListGroupItem>
              <h2>Order Items: </h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroupItem key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary: </h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order?.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {order?.paymentMethod === "PayPal" ? (
                    <PayPalScriptProvider
                      options={{ "client-id": order?.clientId }}
                    >
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: order.totalPrice,
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order
                            .capture()
                            .then(successPaymentHandler);
                        }}
                      />
                    </PayPalScriptProvider>
                  ) : order.paymentMethod === "Stripe" ? (
                    !sdkReady ? (
                      <Loader />
                    ) : (
                      <Elements stripe={stripePromise}>
                        <StripePayment
                          email_address={order.user.email}
                          orderId={orderId}
                          amount={order.totalPrice}
                        />
                      </Elements>
                    )
                  ) : order.paymentMethod === "flutterwave" ? (
                    sdkReady ? (
                      <Loader />
                    ) : (
                      <FlutterWave
                        amount={order.totalPrice}
                        name={order.user.name}
                        email={order.user.email}
                      />
                    )
                  ) : order.paymentMethod === "Paystack" ? (
                    sdkReady ? (
                      <Loader />
                    ) : (
                      <PaystackPayment
                        amount={order.totalPrice}
                        name={order.user.name}
                        email={order.user.email}
                        orderId={orderId}
                      />
                    )
                  ) : (
                    ""
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default OrderScreen;
