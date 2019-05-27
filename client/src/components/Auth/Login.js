import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogin } from "react-google-login";
import { GraphQLClient } from "graphql-request";
// import Typography from "@material-ui/core/Typography";

const ME_QUERY = `{
  me{
    _id
    name
    email
    picture
  }
}`;

const Login = ({ classes }) => {
  const onSuccess = async googleUser => {
    const idToken = googleUser.getAuthResponse().id_token;
    const client = new GraphQLClient("http://localhost:4000/graphql", {
      headers: { authorization: idToken }
    });
    const data = await client.request(ME_QUERY);
    console.log({ data });
  };

  return (
    <GoogleLogin
      clientId="1079055788836-h99pp4ksgj0jqqar65ka4d59vnm2j9qb.apps.googleusercontent.com"
      onSuccess={onSuccess}
      isSignedIn={true}
    />
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
