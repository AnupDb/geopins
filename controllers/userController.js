const User = require("../models/User");

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async token => {
  //verify auth token
  console.log("Before verify");
  const googleUser = await verifyAuthToken(token);
  //check if user exist
  console.log("Before check");

  const user = await checkIfUserExists(googleUser.email);
  //is user exists return them otherwise create new user in db
  return user ? user : await createNewUser(googleUser);
};
const verifyAuthToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID
    });
    return ticket.getPayload();
  } catch (err) {
    console.error("Error verifying auth token", err);
  }
};

const checkIfUserExists = async email => await User.findOne({ email }).exec();

const createNewUser = async googleUser => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };

  return await User.create(user);
};
