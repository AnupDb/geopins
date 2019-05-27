const { AuthenticationError } = require("apollo-server");

const user = {
  _id: "1",
  name: "Anup",
  email: "MMMMMM",
  image: "Url"
};
const authenticated = next => (_, args, ctx) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError(`You must be logged in`);
  }
  return next(_, args, ctx);
};

module.exports = {
  Query: {
    me: authenticated((_, args, ctx) => ctx.currentUser)
  }
};
