const user = {
  _id: "1",
  name: "Anup",
  email: "MMMMMM",
  image: "Url"
};
module.exports = {
  Query: {
    me: () => user
  }
};
