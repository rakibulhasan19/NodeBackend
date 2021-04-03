const {Order} = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const orderList = await Order.find().populate('user','name').sort({'dateOrdered': -1});

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})
router.get(`/:id`, async (req, res) =>{
    const order= await Order.findById(req.params.id)
    .populate('user','name')
    .populate({
        path:'orderItems',populate:
            {path:'product',populate:'category'}})

    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
})
router.post('/', async (req,res)=>{
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    })) 
    const orderItemResovled= await orderItemsIds
    let order = new Order({
        orderItems: orderItemResovled,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if(!order)
    return res.status(400).send('the order cannot be created!')

    res.status(201).send(order);
})
router.put('/:id',async (req,res)=>{
    let order =await Order.findByIdAndUpdate(
        req.params.id,
        {
            status:req.body.status
        }
    ,{
        new:true
    }) 
    if(!order){
        res.status(400).send({success:false,message:'category not updated'})
    }
    res.send(order)
})
router.delete('/:id',async (req,res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})
module.exports= router;

// {
//     "orderItems" : [
//         {
//             "quantity": 3,
//             "product" : "5fcfc406ae79b0a6a90d2585"
//         },
//         {
//             "quantity": 2,
//             "product" : "5fd293c7d3abe7295b1403c4"
//         }
//     ],
//     "shippingAddress1" : "Flowers Street , 45",
//     "shippingAddress2" : "1-B",
//     "city": "Prague",
//     "zip": "00000",
//     "country": "Czech Republic",
//     "phone": "+420702241333",
//     "user": "5fd51bc7e39ba856244a3b44"
// }