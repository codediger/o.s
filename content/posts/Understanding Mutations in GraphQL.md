---
author: "Orinami Olatunji"
date: 2017-06-27
title: Understanding Mutations in GraphQL
type: "post"

tags: [
  "graphql", "javascript", "node", "express"
]
---
Originally published on scotch.io

---

We started with [Build a Simple GraphQL API Server With Express and NodeJS](/posts/build-a-simple-graphql-api-server-with-express-and-nodejs), then [Understanding GraphQL API Queries](/posts/understanding-graphql-api-queries), now let's take a dive into Mutations in GraphQL.

## Introduction
When we hear GraphQL, three popular words are usually associated with it. We have `Query`, `Mutation` and `Subscription`. In this post, We would be looking into mutations, how it work and the idea behind it.

## Getting Started
Most discussions on GraphQL focuses on declarative data fetching, but a complete data platform needs to be able to manipulate or change data. It must be able to create, update and delete data. An API should have `CRUD` operations. `CRUD` simply means `CREATE`, `READ`, `UPDATE`, `DELETE`. 

A GraphQL query performs the  `READ` operation in a GraphQL API while a GraphQL mutation performs other operations such as `CREATE`, `UPDATE` and `DELETE`. This simply means that queries don't change data, a mutation does.

## Simple Mutation
I have created a Chuck Norris Quote API which we'll use for this tutorial. You can get it [here](https://github.com/codediger/graphql-mutation-example).  There is a demo [here](https://graphql-mutation.herokuapp.com) which you can use to follow along. 

Let's query our Chuck Norris API:
```graphql
query getQuote {
  quotes {
    id
    quote
  }
}
```

Here's what we get:

{{% img "https://cdn.scotch.io/32265/Ve6xFQyCQwa96sZour2D_Screen%20Shot%202017-06-27%20at%202.02.13%20PM.png" %}}

Lets add a new quote:

```graphql
mutation createNewQuote {
  createQuote(input: {quote: "When Chuck Norris turned 18, his parents moved out."}) {
    id
    quote
  }
}
```

Here's what we get:


{{% img "https://cdn.scotch.io/32265/m3FwzX0sSfumU9wvUAuk_Screen%20Shot%202017-06-27%20at%202.25.10%20PM.png" %}}

The `mutation` keyword is used to indicate that the operation is a `mutation`. The mutation has an `operationName` `createNewQuote` which is used to identify the operation. `createQuote` is a field in the root mutation type `ChuckNorrisMutationType`. `createQuote` accepts an `input` argument of a `GraphQLInputObjectType` which in turn accepts parameters of any field defined in its `GraphQLInputObjectType`. For every mutation, there must be a returned object. In this case, the new `id` and `quote` is returned.

## GraphQLInputObjectType
`GraphQLInputObjectType` simply allows you to define input type for an argument in a mutation. Why is this useful? Well it helps you define what is required to perform a mutation operation. `GraphQLNonNull` enforces that the field is provided. See below:

```javascript
const QuoteCreateType = new GraphQLInputObjectType({
  name: 'QuoteCreateType',
  type: QuoteType,
  fields: {
    quote: { type: new GraphQLNonNull(GraphQLString) }
  }
});
```

We can see its usage here:
```javascript
    createQuote: {
      type: QuoteType,
      args: {
        input: { type: new GraphQLNonNull(QuoteCreateType) }
      },
      resolve: (source, { input }) => {
       // some code here.....
      }
    }
```

## Naming Mutations
Naming mutations can be challenging. The decision to make it `verb` first or `action` first. Examples of verb first: `userCreate`, `storiesUpdate`, Examples of action first: `createUser`, `updateStories`. I am unopinionated about how you should name your mutations. I would say it depends on how you want to name your mutations, the order you want them to be arranged or the convention your application follows.

## Mutation Input

Mutations should have just one input argument. The argument should be giving a generic name such as `input` and should have a `GraphQLNonNull` type. Therefore your mutation should look like this:

```graphql
updateQuote(input: {id: "f8d36d2f-1109-412c-a55c-f222ff744b9c", quote: "Chuck Norris knows Victoria's secret."}) { .... }
```

and not this:

```graphql
updateQuote(id: "f8d36d2f-1109-412c-a55c-f222ff744b9c", quote: "Chuck Norris knows Victoria's secret.") { ....  }
```

Why? 
* You would have a version-less API which is one of the benefits of GraphQL.
* You can easily deprecate fields that are not being used anymore and add new ones.
* Passing data from client-side becomes easy. Rather than passing 12 different argument, you pass an object into the `input` argument, therefore making your code clean.

## Mutation Payload
Mutation payload is the data you receive back from a mutation operation. The mutation payload is often used for confirmation that the mutation operation was performed successfully. It is compulsory to specify at least a single field in the mutation payload even though sometimes we may not need any data returned.

It's a good idea to always create custom object types for each mutation. We might want to get the metadata of a mutation payload and if we define a default object type like `QuoteType` which has two fields: `id` and `quote`, we would not be able to get something like:
```graphql
mutation deleteAQuote {
  deleteQuote(input: {id: "f8d36d2f-1109-412c-a55c-f222ff744b9c"}) {
    id
    quoteMetadata {
      quoteId
      quoteCount
      quoteLikeCount
      quoteRetweetCount
    }
  }
}

```

We would get an error. How can we fix this? We would have to create custom object type for mutations and then add whatever output we want as a field of the custom object type, in this case `quoteMetadata`. By doing this, we will be able to add other types of output or metadata fields as our API grows. Keep it in mind that the idea is to create a maintainable and version-less API.

It is sometimes difficult to predict the future and the how your API would evolve. Choosing to return a single defined type such as `QuoteType` used here, removes the possibility of improving an existing API in a situation where other types or metadata needs to be returned with the mutation payload. This is something you should seriously take into consideration when building GraphQL APIs.

## Code Snippets 
Code snippet for mutation operations on the Chuck Norris Query API:

### Create
To create a new quote:
```graphql
mutation createNewQuote {
  createQuote(input: {quote: "When Chuck Norris turned 18, his parents moved out."}) {
    id
    quote
  }
}
```

### Update
To update an existing quote:
```graphql
mutation updateOldQuote {
  updateQuote(input: {id: "f8d36d2f-1109-412c-a55c-f222ff744b9c", quote: "Chuck Norris knows Victoria's secret."}) {
    id
    quote
  }
}
```

### Delete
To delete a quote:
```graphql
mutation deleteAQuote {
  deleteQuote(input: {id: "f8d36d2f-1109-412c-a55c-f222ff744b9c"}) {
    id
  }
}
```

## Conclusion
In this tutorial, you have learn't about mutations. I hope the tutorial was engaging and you were able to learn something new. Let me know if you have any questions or contributions. I would be glad to hear it! :)