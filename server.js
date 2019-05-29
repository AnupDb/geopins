const { ApolloServer } = require("apollo-server");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const mongoose = require("mongoose");
require("dotenv").config();

const { findOrCreateUser } = require("./controllers/userController");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    try {
      authToken = req.headers.authorization;
      if (authToken) {
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (err) {
      console.error(`Unable to authenticate user with token ${authToken}`);
      console.log(err);
    }
    return { currentUser };
  }
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
