const { ApolloServer } = require("apollo-server");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const mongoose = require("mongoose");
require("dotenv").config();

const server = new ApolloServer({
  typeDefs,
  resolvers
});
try {
  server.listen(4000, async () => {
    console.log("Listenining on port 4000");
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    console.log("Db Connected");
  });
} catch (err) {
  console.log("Connection Error");
}
