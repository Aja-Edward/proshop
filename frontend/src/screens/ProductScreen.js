import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useMatch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, FormControl } from 'react-bootstrap'
import Rating from '../components/Rating'
import { listProductDetails } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
// import axios from 'axios'


const ProductScreen = () => {
    const [qty, setQty] = useState(1)
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails
    useEffect(() => {

        // const fetchProduct = async () => {
        //     const res = await axios.get(`/api/products/${params.id}`);
        //     setProduct(res.data)
        // }
        dispatch(listProductDetails(params.id))
    }, [params, dispatch])

    const addToCartHandler = () => {
        navigate(`/cart/${params.id}?qty=${qty}`)
    }

    // const product = { review: [] }

    return (
        <>

            <Link className='btn btn-light my-3' to='/'>
                Go Back
            </Link>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
                (<Row >
                    <Col md={6} >
                        <Image src={product.image} alt={product.name} fluid />
                    </Col>
                    <Col md={3}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating
                                    value={product.rating}
                                    text={`${product.numReviews} reviews`}
                                />
                            </ListGroup.Item>
                        </ListGroup>
                        <ListGroupItem>
                            Price: ${product.price}
                        </ListGroupItem>
                        <ListGroup.Item>
                            <h6>Description:</h6>  {product.description}
                        </ListGroup.Item>

                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col> <strong>Price:</strong></Col>
                                        <Col>
                                            ${product.price}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>

                                            {product.countInstock > 0 ? 'In stock' : 'Out of stock'}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>Category:</Col>
                                        <Col>{product.category}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Brand:</Col>
                                        <Col>{product.brand}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {product.countInstock > 0 && (
                                    <ListGroupItem>
                                        <Row>
                                            <Col>Qty:</Col>
                                            <Col>
                                                <FormControl
                                                    as='select'
                                                    value={qty}
                                                    onChange={(e) => setQty(e.target.value)}
                                                >
                                                    {[...Array(product.countInstock).keys()].map(x => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </FormControl>

                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                )}
                                <ListGroup.Item>
                                    { }
                                    <Button
                                        onClick={addToCartHandler}
                                        className='btn-block'
                                        type='button'
                                        disabled={product.countInstock === 0}
                                    >
                                        Add To Cart
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
                )
            }
        </>
    )

}

export default ProductScreen
