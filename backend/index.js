const port = 4000;
const express = require ("express");
const app= express();
const mongoose = require("mongoose");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require("path");



app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
  );


mongoose.connect(
    "mongodb+srv://haninchaito:51oz58DIsMSsRWy7@cluster0.mxeyh.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0",
    {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000,        // 45 seconds
    }
  )
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });
  


app.listen(port,(error)=>{
    if(!error) {
        console.log("Server is Running on " +port)
    }
    else{
        console.log("Error:"+error)
    }
})






app.get("/",(req,res)=>{
res.send("Express App is Running");
})


//I want to store the uploaded image in the upload folder using ulter 

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
    
})


const upload = multer({storage:storage})


app.use('/images',express.static('upload/images')) //using this you an access images via url : http://yourdomain.com/images/profilePic_123.jpg


//Uploading images via endpoint 

app.post("/upload",upload.single('product'),(req,res)=>{
     res.json ({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
}) 




const Product = mongoose.model("Product",{
    id:{
       type: Number ,
       required: true , 
    },

    name :{
        type: String,
        required: true,
    },

    image:{
        type:String,
        required:true,
    },

    category:{
        type:String,
        required:true,
    },

    new_price:{
        type:Number,
        required:true,
    },

    old_price:{
        type:Number,
        required:true,
    },

    condition: {
        type: String,
        enum: ['New', 'Used'],
        required: true,
      },
    
      availableSizes: {
        type: [String], // Array of strings
        required: true, // Ensure the sizes array is always provided
        validate: {
          validator: (sizes) => sizes.length > 0,
          message: 'At least one size must be provided.',
        },
      },

    date:{
        type:Date,
        default:Date.now,
    },

    available:{
        type:Boolean,
        default:true,
    },
 
})


const PromoCode = mongoose.model("Promocode",{
    name :{
      type: String,
      unique: true,
      required: true,
  },
  discount:{
     type: Number ,
     required: true , 
  }

} );


app.post('/addproduct', async (req, res) => {
    try {
      // Retrieve all products from the database
      let products = await Product.find({});
  
      // Generate a new ID for the product
      let id;
      if (products.length > 0) {
        let last_product = products[products.length - 1]; // Get the last product
        id = last_product.id + 1; // Increment the ID
      } else {
        id = 1; // Start with ID 1 for the first product
      }
  
      // Create a new product instance
      const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        old_price: req.body.old_price,
        new_price: req.body.new_price,
        condition: req.body.condition, // Add condition
        availableSizes: req.body.availableSizes, // Add available sizes
      });
  
      console.log(product);
  
      // Save the product to the database
      await product.save();
  
      console.log("Saved");
     return res.json({
        success: true,
        name: req.body.name,
        image: req.body.image,
      });
    } catch (error) {
      console.error('Error saving product:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to add product',
      });
    }
  });


app.post('/removeproduct', async (req,res) => {
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    return res.json({
        success: true,
        name:req.body.name
    })
})



app.get('/allproducts', async (req,res)=> {
let products = await Product.find({});
console.log("All products fetched");
return res.send(products);

})




//Creating User Schema

const User = mongoose.model('Users', { 
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId, // Refers to the Product _id in Product collection
                ref: 'Product',
            },
            
            name: {
                type: String, 
                required: true,
            },
          
            category: {
                type: String, 
                required: true,
            },
            image:{
                type:String,
                required:true,
            },
           price: {
                type: Number,
                required: true,
            },
           
            size: {
                type: String, 
                required: true,
            },
            quantity: {
                type: Number, // Quantity of the product in the cart
                default: 0,
            },
        },
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});



app.post('/signup', async (req, res) => {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "email already used" });
    }
 

    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: []
    });

    await user.save();

    const data = { user: { id: user.id } };
    const token = jwt.sign(data, 'secret_ecom' , { expiresIn: '1h' });
    return res.json({ success: true, token }); // Added return
});

app.post('/login', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = { user: { id: user.id } };
            const token = jwt.sign(data,'secret_ecom' , { expiresIn: '1h' });

            return res.json({ success: true, token }); // Added return
        } else {
            return res.json({ success: false, errors: "Wrong Password" }); // Added return
        }
    }
    return res.json({ success: false, errors: "Wrong Email" }); // Added return
});

app.get('/newcollection', async (req, res) => {
    let products = await Product.find({});
    if (products.length === 0) {
        return res.json({ success: false, message: "No products found" });
    }
    let newcollection = products.slice(1).slice(-8);
    return res.send(newcollection); // Added return
});


app.get('/popularinwomen',async(req,res)=>{
    let products = await  Product.find({category:"women"});
    if (products.length === 0) {
        return res.json({ success: false, message: "No products found" });
    }
    let popular_in_women = products.slice(0,4);
    console.log("Populaar in women fetched " );
   return res.send(popular_in_women);

})


const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    console.log(token) ;
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, 'secret_ecom'); 
        req.user = data.user; 
        next(); 
    } catch (error) {
        console.log(error);
        return res.status(401).send({ errors: "the catch block" });
    }
};

app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        const { productId, size } = req.body;

        console.log("Received productId:", productId, "size:", size);

        
        if (!productId || !size) {
            return res.status(400).json({ success: false, error: "Missing productId or size" });
        }

      
        let userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        let addedproduct = await Product.findOne({id:productId});
        if (!addedproduct) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        console.log(addedproduct);

        // Check if the item already exists in the cart
        const existingItemIndex = userData.cartData.findIndex(
            (item) => item.productId.toString() === addedproduct._id.toString() && item.size === size
        );

        if (existingItemIndex > -1) {
            // If item exists, update its quantity
            userData.cartData[existingItemIndex].quantity += 1;
        } else {
            // Otherwise, add a new item to the cart
            userData.cartData.push({
                productId:addedproduct._id,
                size,
                quantity: 1,
                image:addedproduct.image,
                price: addedproduct.new_price,
                category: addedproduct.category,
                name:addedproduct.name ,
                condition: addedproduct.condition ,
            });
        }

        // Save changes to DB
        await userData.save();

        // Respond to client
        return res.json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});



app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        const { productId, size } = req.body;

        console.log("Received productId:", productId, "size:", size);
        // Validate input
        if (!productId || !size) {
            return res.status(400).json({ success: false, error: "Missing productId or size" });
        }

        // Fetch user data from DB
        let userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, error: "User not found" });
        }


        let productToBeRemoved = await Product.findOne({_id:productId});
        if (!productToBeRemoved) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        // Check if the item exists in the cart
        const existingItemIndex = userData.cartData.findIndex(
            (item) => item.productId.toString() === productToBeRemoved._id.toString() && item.size === size
        );
        

        if (existingItemIndex > -1) {
            
                // remove the item from the cart
                userData.cartData.splice(existingItemIndex, 1);
            }
         else {
            return res.status(404).json({ success: false, error: "Item not found in cart" });
        }

        await userData.save();

        return res.json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
        console.error("Error removing from cart:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});





app.post('/getcart', fetchUser, async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

       
        return res.json(userData.cartData);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});


//PROMOCODE and Checkout 









app.post('/addpromo',async (req,res) => {
  
    const code = await PromoCode.findOne({ name: req.body.name });
    if (code) {
        return res.status(404).json({ success: false, error: "PromoCode exists" });
    } 

    const promo = new PromoCode({
       
        name:req.body.name,
        discount:req.body.discount

    });

 

    console.log(promo);

    await promo.save();

    console.log("PromoCode Saved");
    res.json({
        success:true,
        name:req.body.name
    })
})



app.post('/removepromo', async (req, res) => {
    const { name } = req.body; 

console.log(name);
    try {
        const promo = await PromoCode.findOneAndDelete({name});
        if (promo) {
            console.log("PromoCode Removed:", promo);
           return res.json({
                success: true,
                name
            });
        } else {
            return res.status(404).json({ success: false, message: "PromoCode not found" });
        }
    } catch (error) {
        console.error("Error removing PromoCode:", error);
       return res.status(500).json({ success: false, message: "Server error" });
    }
});


app.post('/getpromocode', async (req, res) => {
    const { name } = req.body; 

console.log(name);
    try {
        const promo = await PromoCode.findOne({name});
      
        if (promo) {
            console.log("PromoCode Found:", promo); 
             const discount = promo.discount;
           return res.json({
                success: true,
                discount
            });
        } else {
           return res.status(404).json({ success: false, message: "PromoCode not Valid" });
        }
    } catch (error) {
        console.error("Error fetching PromoCode:", error);
       return res.status(500).json({ success: false, message: "Server error" });
    }
});







app.post('/checkout', fetchUser, async (req, res) => {
    const { discount = 0, totalPrice } = req.body; // Use default value for discount if not provided


    try {
        const userData = await User.findOne({ _id: req.user.id });
        let email = userData.email ;
        let username = userData.name ;
        if (!userData) {
            return res.status(404).json({ success: false, error: "User not authenticated , You must Log in" });
        }

        let finalPrice = totalPrice - (discount / 100) * totalPrice;
        console.log("final price is ",finalPrice)

        
        
        userData.cartData = [];
        await userData.save();

        return res.json({
            success: true,
            finalPrice: finalPrice.toString(),
            email ,
            username
        });

        

       
    } catch (error) {
        console.error("Error checking out:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});




const Request = mongoose.model("Requests",{
    id:{
       type: Number ,
       required: true , 
    },
 

    DonorId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
     DonorEmail :{
        type : String , 
        required: true ,
     },

    
    Product_name :{
        type: String,
        required: true,
    },

    image:{
        type:String,
        required:true,
    },

    category:{
        type:String,
        required:true,
    },

      availableSizes: {
        type: [String], // Array of strings
        required: true, // Ensure the sizes array is always provided
        validate: {
          validator: (sizes) => sizes.length > 0,
          message: 'At least one size must be provided.',
        },
      },

    date:{
        type:Date,
        default:Date.now,
    },

    pickupAddress:{
        type:String,
        required:true,
    },

    suggestedPrice:{
        type:Number,
        required:true,
    },
   
    status: {
        type: String,
        enum: ['Pending', 'Accepted' , 'Denied'],
        default: 'Pending',
        required: true,
      },

    
 
})




app.post('/addrequest', fetchUser, async (req, res) => {
    try {
        let requests = await Request.find({});

        let DonorId = req.user.id ;

     

        let user = await User.findOne({_id: DonorId});

        

    

        let id;
        if (requests.length > 0) {
            let last_request = requests[requests.length - 1]; // Get the last product
            id = last_request.id + 1; // Increment the ID
        } else {
            id = 1; // Start with ID 1 for the first request
        }

        // Create a new request instance with DonorId from the token
        const request = new Request({
            id: id,
            Product_name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            availableSizes: req.body.availableSizes,
            DonorId: DonorId, // Use the authenticated user's ID
            DonorEmail : user.email ,
            pickupAddress: req.body.pickupAddress,
            status: req.body.status,
            suggestedPrice:req.body.price
        });

        console.log(request);

        // Save the request to the database
        await request.save();

        console.log("Request Saved");

        return res.json({
            success: true,

        });
    } catch (error) {
        console.error('Error saving request:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add request',
        });
    }
});



app.get('/AdminGetRequest', async (req, res) => {
    try {
        const requests = await Request.find({status :'Pending'}); // Resolve the query
        return res.json({
            success: true,
            requests
        });
    } catch (error) {
        console.error("Error fetching requests:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch requests",
        });
    }
});



app.post('/AdminDenyRequest', async (req, res) => {
    const { id } = req.body;

    try {
        // Find the request by ID
        const request = await Request.findOne({ id });

        if (request) {
            // Update the status of the request to 'Denied'
            request.status = 'Denied';

            // Save the updated request
            await request.save(); // Don't forget to save the request

            return res.json({
                success: true,
                message: 'Request status updated to Denied',
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Request not found',
            });
        }
    } catch (error) {
        console.error("Error fetching Request:", error);
        return res.status(500).json({ 
            success: false,
        });
    }
});



app.post('/AdminAcceptRequest' , async(req,res) => {

    const { id , price} = req.body;
    console.log('ID:', id, 'Price:', price);

    try {
        const request = await Request.findOne({ id });

        if (request) {
            
            request.status = 'Accepted';

            // Save the updated request
            await request.save(); }

            let products = await Product.find({});
  
            // Generate a new ID for the product
            let Productid;
            if (products.length > 0) {
              let last_product = products[products.length - 1]; // Get the last product
              Productid = last_product.id + 1; // Increment the ID
            } else {
              Productid = 1; // Start with ID 1 for the first product
            }



        const product = new Product({
            id: Productid,
            name: request.Product_name,
            image: request.image,
            category: request.category,
            old_price: price,
            new_price: price,
            condition: 'Used', 
            availableSizes: request.availableSizes, // Add available sizes
          });
          console.log(product);
  
          // Save the product to the database
          await product.save();
      
          console.log("Saved");
         return res.json({
            success: true,
          });


    }catch (error) {
        console.error("Error fetching Request:", error);
        return res.status(500).json({ 
            success: false,
        });
    }

})


app.get('/getrequests', fetchUser, async (req, res) => {
    try {
        const DonorId = req.user.id;

        // Fetch all requests for the user
        const requests = await Request.find({ DonorId });

        // Check if requests were found
        if (!requests || requests.length === 0) {
            return res.json({
                success: true,
                message: 'No requests found for this user',
                data: []
            });
        }

        // Return the requests
        return res.json({
            success: true,
            message: 'Requests fetched successfully',
            data: requests
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching requests. Please try again later.',
            error: error.message // Optional for debugging
        });
    }
});
