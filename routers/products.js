const express = require('express');
const { Category } = require('../models/category');
const {Product} = require('../models/products')
const mongoose = require('mongoose')
const router = express.Router();



router.get(`/`, async(req,res)=>{
    let filter={};
    if(req.query.categories){
         filter = {category: req.query.categories.split(',')}
    }
    const productList =await Product.find(filter).populate('category');
    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList)
})
router.get(`/:id`, async(req,res)=>{
    const productList =await Product.findById(req.params.id).populate('category');
    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList)
})
router.get(`/get/count`, async(req,res)=>{
    let productCount =await Product.countDocuments((count)=>count)
    if(!productCount){
        return res.status(500).json({message:'product was not found !'})
    }
    res.send({productCount:productCount})
})
router.get(`/get/featured/:count`, async(req,res)=>{
    const count = req.params.count ? req.params.count : 0;
    let products =await Product.find({isFeatured:true}).limit(+count)
    if(!products){
        return res.status(500).json({message:'product was not found !'})
    }
    res.send(products)
})

router.put('/:id',async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid product Id')
    }
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')
    let product =await Product.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:req.body.image,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured: req.body.isFeatured
    },{
        new:true
    });
    if(!product){
        return res.status(400).send({success:false,message:'product not updated !'})
    }
    res.status(201).send(product)

})
router.post(`/`, async (req, res) =>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product = await product.save();

    if(!product) 
    return res.status(500).send('The product cannot be created')

    res.send(product);
})
router.delete('/:id',async (req,res)=>{
   
    Product.findByIdAndRemove(req.params.id).then((product)=>{
        if(product){
            return res.status(200).json({success:true,message:'the product deleted !'})
        }else{
            return res.status(404).json({success:false,message:'product not found !'})
        }
    }).catch((err)=>{
        return res.status(400).json({success:false,error:err})
    })
})

module.exports =router;