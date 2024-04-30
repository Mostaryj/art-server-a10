const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://art-store-64ab6.web.app"]
}));
app.use(express.json());

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kc8fcbi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const artCollection = client.db("artDB").collection("art");
    const categoryCollection = client.db("artDB").collection("artCraft");

 //my list
    app.get("/art", async (req, res) => {
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });




       // update

       app.get("/art/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await artCollection.findOne(query);
        res.send(result);
      });


    //update put
   app.put("/art/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatedArt = req.body;
    const art = {
      $set: {
        photo: updatedArt.photo,
        item: updatedArt.item,
        sub: updatedArt.sub,
        description: updatedArt.description,
        price: updatedArt.price,
        rating: updatedArt.rating,
        customization: updatedArt.customization,
        time: updatedArt.time,
        stock:updatedArt.stock,
       

      },
    };
    const result = await artCollection.updateOne(filter, art, options);
     res.send(result);
    
 });


//delete
    app.delete('/art-craft/:id', async (req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await artCollection.deleteOne(query);
   
      res.send(result);
     
    })

    app.post("/art", async (req, res) => {
      const newArt = req.body;
      console.log(newArt);
      const result = await artCollection.insertOne(newArt);
      res.send(result);
    });


    
    app.get("/art/:id", async (req, res) => {
      const id = req.params.id;
      const query = { email: new ObjectId(id) };
      const result = await artCollection.findOne(query);
      res.send(result);
    });

   


   
  

    app.get('/art-email/:email', async (req, res) => {
      const query = { email: req.params.email }
      const cursor =artCollection.find(query)
      const data = await cursor.toArray()
      res.send(data)
    });




  
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("art server is running");
});

app.listen(port, () => {
  console.log(` art is running on port: ${port}`);
});
