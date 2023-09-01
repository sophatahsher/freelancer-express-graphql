import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { freelancers } from "./graphql-data/data.js";

// create GraphQL schema
const schema = buildSchema(`
    type Query {
          freelancer(id: Int!): Freelancer
          freelancers(category: String): [Freelancer]
    }
    type Freelancer {
        id: Int
        name: String
        category: String
        expertise: String
        location: String
        skills: [String]
        profilePicture: String
    }
`);

// Find specific freelancer with id
const findFreelancer = (args) => {
  for (const freelancer of freelancers) {
      if (freelancer.id === args.id) {
          return freelancer;
      }
  }
}

// Find freelancers with tech category
const findFreelancersByCategory = (args) => {
    if (args.category) {
        return freelancers.filter((freelancer) => freelancer.category.toLowerCase() === args.category.toLowerCase());
    } else {
        return freelancers;
    } 
}

// Root resolver
const graphqlData = {
    freelancer: findFreelancer,
    freelancers: findFreelancersByCategory,
};

// Create an express server and a GraphQL endpoint
const app = express();
const port = 4000;
app.use("/graphql", graphqlHTTP({
      schema: schema,
      rootValue: graphqlData,
      graphiql: true,
    })
);

app.listen(port, () => {
    console.log(`Express GraphQL Server is running a GraphQL server at http://localhost:${port}/graphql`)
});