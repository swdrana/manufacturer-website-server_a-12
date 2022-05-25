const express = require("express");
const cors = require("cors");
require("dotenv").config();

//For Middleware
const app = express();
app.use(cors());
app.use(express.json());

/********************************************\
            MongoDB Connection Start
\********************************************/
//Import
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1z0dn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const productsCollection = client.db("eToolsDB").collection("products");
    const orderCollection = client.db("eToolsDB").collection("orders");
    const cartsCollection = client.db("eToolsDB").collection("carts");
    const usersCollection = client.db("eToolsDB").collection("users");

    // load all item from database
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const allProduct = await cursor.toArray();
      res.send(allProduct);
    });
    // add single item to database
    app.post("/add", async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      res.send({ result: "data received!" });
      const result = await productsCollection.insertOne(newItem);
      console.log("User Inserted. ID: ", result.insertedId);
    });

    // add single item to database for user
    app.post("/newUser", async (req, res) => {
        const newItem = req.body;
        console.log(newItem);
        res.send({ result: "data received!" });
        const result = await usersCollection.insertOne(newItem);
        console.log("User Inserted. ID: ", result.insertedId);
      });














    // load all users from database
    app.get("/users", async (req, res) => {
        const query = {};
        const cursor = usersCollection.find(query);
        const allUsers = await cursor.toArray();
        res.send(allUsers);
      });

    // load single user using email
    app.get("/userInfo/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email };
        const product = await usersCollection.findOne(query);
        res.send(product);
      });

    // update a user
    app.put("/newUser/:email", async (req, res) => {
        const email = req.params.email;
        const user = req.body;
        const filter = { email };
        const options = { upsert: true };
        console.log(user);
        const updatedDoc = {
          $set: { 
              ...user
          },
        };
        const result = await usersCollection.updateOne(
          filter,
          updatedDoc,
          options
        );
        res.send(result);
      });
















    // load all item from database for cart
    app.get("/carts", async (req, res) => {
        const query = {};
        const cursor = cartsCollection.find(query);
        const allProduct = await cursor.toArray();
        res.send(allProduct);
      });
  
      // load multiple item using user email for Cart
      app.get("/my-carts/:searchEmail", async (req, res)=>{
          const query = { userEmail: req.params.searchEmail };
          const cursor = cartsCollection.find(query);
          const findedProductsBasedOnEmail = await cursor.toArray();
          res.send(findedProductsBasedOnEmail);
      })

    // add single item to database for myCart
    app.post("/add-to-cart", async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      res.send({ result: "data received!" });
      const result = await cartsCollection.insertOne(newItem);
      console.log("User Inserted. ID: ", result.insertedId);
    });
    // update myCart
    app.put("/updateCartStatus/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const updateOrder = req.body;
        console.log(updateOrder);
        const filter = {  _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
          $set: { 
            ...updateOrder
          },
        };
        const result = await cartsCollection.updateOne(
          filter,
          updatedDoc,
          options
        );
        res.send(result);
      });

    // delete a product from database for Cart
    app.delete(`/deleteFromCart/:id`, async (req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        console.log(query);
        const result = await cartsCollection.deleteOne(query);
        res.send(result);
    })










    // add single item to database for Order (Order means is paid)
    app.post("/add-to-order", async (req, res) => {
        const newItem = req.body;
        console.log(newItem);
        res.send({ result: "data received!" });
        const result = await orderCollection.insertOne(newItem);
        console.log("User Inserted. ID: ", result.insertedId);
      });

      // load multiple item using user email for myOrders
      app.get("/my-orders/:searchEmail", async (req, res)=>{
          const query = { userEmail: req.params.searchEmail };
          const cursor = orderCollection.find(query);
          const findedProductsBasedOnEmail = await cursor.toArray();
          res.send(findedProductsBasedOnEmail);
      })
















    // load single item using _id
    app.get("/singleProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });
    

    // delete a product from database 
    app.delete(`/deleteProduct/:id`, async (req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        console.log(query);
        const result = await productsCollection.deleteOne(query);
        res.send(result);
    })
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

/********************************************\
            MongoDB Connection End
\********************************************/

// Create Root API
app.get("/", (req, res) => {
  res.send("Running eTools Server");
});

// For Port & Listening
const port = process.env.PORT || 8080;
app.listen(port, (req, res) => {
  console.log("Listening to port: ", port);
});
