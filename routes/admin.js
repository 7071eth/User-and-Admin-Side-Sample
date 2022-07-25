var express = require('express');
// const { response } = require('../app');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
let userName = "owner"
let Pin = "12345"
var productHelper=require('../helpers/sample')

/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.users) {
      res.redirect('/admin/view-users') 
  } else {
    res.render('admin/admin-login',{errout:req.session.err});
    req.session.err=false;
  }
})

router.get('/view-users',  (req, res, next)=> {
  if (req.session.users) {
    productHelpers.getAlluser().then((products)=>{
      res.render('admin/view-users', { admin: true, products })
     })
  } else {
    res.render('admin/admin-login',{errout:req.session.err,admin: true});
    req.session.err=false;
  }
})
router.get('/view-products',(req,res,next)=>{
  if(req.session.users){
    productHelper.getAllProducts().then((products)=>{
      console.log(products)
      res.render('admin/view-products',{admin: true,products})
    })
    
  }
})

router.get('/add-user', function (req, res) {
  if (req.session.users) {
  res.render('admin/add-user',{ admin: true})
  }else{
    res.redirect('/admin')
  }
})
router.post('/add-user', (req, res) => {
  productHelpers.doAdd(req.body).then((response) => {
        res.redirect('/admin')
  })
})
router.post('/view-users', (req, res) => {

  const { Email, Password } = req.body;
  if (userName === Email && Pin === Password) {
    req.session.check = true;
    req.session.users = {
      userName
    }
    productHelpers.getAlluser().then((products)=>{
      res.redirect('/admin/view-users')
     })
  }
  else {
    req.session.err="incorrect username or password"
    res.redirect('/admin')
  }
})
router.get('/delete-user/:id',(req,res)=>{
  let proId=req.params.id
productHelpers.deleteUser(proId).then((response)=>{
  res.redirect('/admin/')
})
})
router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
productHelper.deleteProduct(proId).then((response)=>{
  res.redirect('/admin/view-products/')
})
})
router.get('/update-user/:id',async(req,res)=>{
  if (req.session.users) {
    let user=await productHelpers.getProductDetails(req.params.id)
    res.render('admin/update-user',{user, admin: true})
    }else{
      res.redirect('/admin')
    }
  
})
router.post('/update-user/:id',(req,res)=>{

  productHelpers.updateUser(req.params.id,req.body).then((response)=>{
    res.redirect('/admin')
  })
})
router.get('/logout',(req,res)=>{
  req.session.users=null
  res.redirect('/admin')
})
router.get('/add-product',function(req,res){
  res.render('admin/add-product',{admin:true})
})
router.post('/add-product',(req,res)=>{
  console.log(req.body)
  console.log(req.files.image)

  productHelper.addProduct(req.body,(id)=>{
    console.log(id)
    let image=req.files.image
    image.mv('C:/Users/7071/Desktop/Weekly task/Week6/admin/public/product-images/'+id+'.png',(err,done)=>{
      if(err){
        console.log(err)
      }else{
        res.render("admin/add-product.hbs",{admin:true})
      }
    })
    
  })
})
module.exports = router;
