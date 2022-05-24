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
    const usersCollection = client.db("eToolsDB").collection("users");

    // load all item from database
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const allProduct = await cursor.toArray();
      res.send(allProduct);
    });
    // load all item from database for Orders
    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query);
      const allProduct = await cursor.toArray();
      res.send(allProduct);
    });

    // load multiple item using user email for Order
    app.get("/my-orders/:searchEmail", async (req, res)=>{
        const query = { userEmail: req.params.searchEmail };
        const cursor = orderCollection.find(query);
        const findedProductsBasedOnEmail = await cursor.toArray();
        res.send(findedProductsBasedOnEmail);
    })
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

    // load single user using email
    app.get("/userInfo/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email };
        const product = await usersCollection.findOne(query);
        res.send(product);
      });

    // update a product
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
















    // add single item to database for myOrder
    app.post("/newOrder", async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      res.send({ result: "data received!" });
      const result = await orderCollection.insertOne(newItem);
      console.log("User Inserted. ID: ", result.insertedId);
    });

    // delete a product from database 
    app.delete(`/deleteOrder/:id`, async (req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        console.log(query);
        const result = await orderCollection.deleteOne(query);
        res.send(result);
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
