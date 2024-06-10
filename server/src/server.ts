import { createYoga } from "graphql-yoga";
import Koa from "koa";
import { schema } from "./Graphql/schema"; 
import mongoose from "mongoose";

const app = new Koa();

const yoga = createYoga<Koa.ParameterizedContext>({
  schema,
  context: {
    models: {
      User: require("./Models/user").default, 
    },
  },
});



mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.6", {

});
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(async (ctx) => {
  const response = await yoga.handleNodeRequestAndResponse(
    ctx.req,
    ctx.res,
    ctx
  );

  ctx.status = response.status;

  response.headers.forEach((value, key) => {
    ctx.append(key, value);
  });

  ctx.body = response.body;
});

app.listen(4000, () => {
  console.log(
    `Running a GraphQL API server at http://localhost:4000/${yoga.graphqlEndpoint}`
  );
});