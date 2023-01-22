import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { usePaystackPayment } from 'react-paystack';
import { useDispatch } from 'react-redux';
import { payOrder } from "../actions/orderActions";
import { Image } from "react-bootstrap"
import Paystack from '../../src/images/paystacklogo.png';

const PaystackPayment = ({ amount, name, email, orderId }) => {
    const dispatch = useDispatch()
    const [key, setKey] = useState("")
    useEffect(() => {
        const getKey = async () => {
            const { data: clientKey } = await axios.get('/api/config/paystack')
            setKey(clientKey)
        }
        getKey()
        console.log(key)
    }, [key])
    const config = {
        reference: (new Date()).getTime().toString(),
        email: email,
        amount: parseInt(amount) * 100,
        publicKey: key,
        name: name
    };


    const PaystackHook = () => {
        const initializePayment = usePaystackPayment(config);
        return (
            <div>
                <button
                    style={{ border: '2px solid #3678D3' }}
                    type='button'
                    className='btn btn-block btn success'
                    onClick={() => {
                        initializePayment(onSuccess, onClose)
                    }}>
                    <Image src={Paystack}
                        alt="Pay with Paystack" width="40%"></Image>

                </button>
            </div>
        );
    };


    const onSuccess = (reference) => {
        const paymentResult = {
            id: reference.trxref,
            status: reference.status,
            update_time: String(new Date().getTime()),
            payer: { email_address: email }
        }
        dispatch(payOrder(orderId, paymentResult))
        console.log(reference);
    };


    const onClose = (ref) => {

        console.log(ref)
    }


    return (
        <div className="App">

            <PaystackHook />
        </div>
    );
}



export default PaystackPayment
