---
date: 2017-05-31
title: Build a Simple GraphQL API Server With Express and NodeJS
type: "post"

tags: [
  "graphql", "javascript", "node", "express"
]
---
Originally published on scotch.io

---

GraphQL is a query language for APIs that offers declarative data fetching. It enables clients to ask for the exact data they need from a web server and nothing more. Developed in 2012 by Facebook, GraphQL API is currently being used in-house by Facebook and other companies such as Yelp, Shopify and Github. A GraphQL spec released in 2015 and is now available in many environments and used by teams of all sizes. GraphQL is open-source and maintained by Facebook.

While REST APIs typically send requests to multiple endpoints, GraphQL API allows you to send just a single request to an endpoint to retrive data needed for your application. GraphQL is great for slow mobile network connections because it needs just one round-trip to the server to get the data it needs. Using GraphQL, front-end engineers can construct a query based on the fields they need from the endpoint rather than overfetching resources from a REST API.

Versioning APIs can be headache for development teams. With GraphQL you have no worries. GraphQL allows you to add new fields and types (this will be discussed later on) to your GraphQL API without affecting existing queries. Older and unused fields can be deprecated and hidden from API clients. By using a single evolving version, GraphQL APIs give your application constant access to newer API implementations and allows clean and easily maintainable code base.

## Prerequisite
Before starting, make sure you have preferrably Node v6 installed. Open your command-line utitlity or terminal and type the command below:
```bash
node -v
# expected outcome or similar - v6.10.3

```
If you can't find Node installed, go the URL: https://nodejs.org/ and follow the instructions to install it.

## Setting up GraphQL and Express
A simple way to create a GraphQL API server is to use Express, a popular web application framework for Node.js. To get Express up and running you'll need to install it using npm:
```bash
//follow the instructions to create a package.json file.
npm init 
npm install express --save
```

Then, install `graphql` and `express-graphql` dependencies like this:
```bash
npm install graphql express-graphql --save 
```

The `--save` flag is to add it as a dependency in your application so that anyone that installs your application automatical installs the dependencies when `npm install` is initiated.

The initial structure of the folder will look like this:

```bash
	|---- node_modules  // this folder stores packages installed locally in a project
	|---- package.json  //stores information about your application
```

## Basic GraphQL API Implementation

Let's have a sneak peak into the power that GraphQL API wields. We are going to be using the `buildSchema` object from `graphql` to create a `schema`. Create a `example.js` file in the `root directory` and add this code:

```javascript
// example.js
const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
let port = 3000;

/* Here a simple schema is constructed using the GraphQL schema language (buildSchema). 
   More information can be found in the GraphQL spec release */
   
let schema = buildSchema(`
  type Query {
    postTitle: String,
    blogTitle: String
  }
`);

// Root provides a resolver function for each API endpoint
let root = {
  postTitle: () => {
    return 'Build a Simple GraphQL Server With Express and NodeJS';
  },
  blogTitle: () => {
    return 'scotch.io';
  }
};

const app = express();
app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true //Set to false if you don't want graphiql enabled
}));

app.listen(port);
console.log('GraphQL API server running at localhost:'+ port);

```

`example.js` contains a basic structure of  `graphql`. This API is implemented using the GraphQL schema language. `Express` is not needed to execute this file. In your CLI terminal execute `example.js` using the node command: 

```bash
node example.js
```

This is just to show you a quick example of a GraphQL API. I would explain later in this tutorial GraphQL Schema and how it works.

A key feature using `graphiql` is that it allows you to test your API in the browser, autocomplete and make suggestions for you based on the types and fields available in your defined schema. 

{{% img "https://cdn.scotch.io/32265/OYDD5sEHSEinerajo7XO_graphautocomplete.PNG" %}}

Now lets query our schema for `blogTitle` :

{{% img "https://cdn.scotch.io/32265/onQd1KRE6yMNs0ykQTzA_graphautocompleteblog.PNG" %}}
There you go! You have queried your GraphQL API.

## Introduction

By now you should have an understanding of how GraphQL works. Let's get started with building an Express GraphQL server. In the root directory create a folder `src`, inside `src` folder create a file and save it as `schema.js`. Now open the file and add this code: 

```javascript
const Authors = require('./data/authors'); // This is to make available authors.json file
const Posts = require('./data/posts'); // This is to make available post.json file

/* Here a simple schema is constructed without using the GraphQL query language. 
  e.g. using 'new GraphQLObjectType' to create an object type 
*/

let {
  // These are the basic GraphQL types need in this tutorial
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  // This is used to create required fileds and arguments
  GraphQLNonNull,
  // This is the class we need to create the schema
  GraphQLSchema,
} = require('graphql');

```

The code is self explanatory. If you don't understand it, I bet you would as you go on in this tutorial. Create a `data` folder inside `src` folder and copy the content of `authors.json` and `posts.json` files available at: https://github.com/codediger/graphql-express-nodejs/tree/master/src/data

## Types in GraphQL

GraphQL has a `graphql/type` module used in type definition. Types can be imported from the `graphql/type` module or from the root `graphql` module

Basic Types include `ID`, `String`, `Int`, `Float` and `Boolean`. We would be adding an ` Author` Type to our `schema.js` file:

```javascript
const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represent an author",
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLString)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    twitterHandle: {type: GraphQLString}
  })
});
```

What this does is to create an object of a `GraphQLObjectType`. `Name` is self descriptive. `Description` is self descriptive. `Fields` contain the attributes of the ` Author Schema` such as the  author's `id`, `name` and `twitterHandle` which all have their types defined. For more explanation on `types` check  [here](https://graphql.org/graphql-js/type/)

Let's create our PostType:

```javascript
const PostType = new GraphQLObjectType({
  name: "Post",
  description: "This represent a Post",
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    body: {type: GraphQLString},
    author: {
      type: AuthorType,
      resolve: function(post) {
        return _.find(Authors, a => a.id == post.author_id);
      }
    }
  })
});

```
Add it to `schema.js` This will create a PostType object to be used in the `Root Query`.

## Root Query
Root query is an entry point to your GraphQL API server. It is used to expose the resources available to clients of your application. We would be making two resources available: authors and posts.

Let's add this to the `schema.js` file:

```javascript
// This is the Root Query
const BlogQueryRootType = new GraphQLObjectType({
  name: 'BlogAppSchema',
  description: "Blog Application Schema Query Root",
  fields: () => ({
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of all Authors",
      resolve: function() {
        return Authors
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      description: "List of all Posts",
      resolve: function() {
        return Posts
      }
    }
  })
});
```

Here `Root query` is defined as `BlogQueryRootType`. `name` and `description` is self descriptive. If you noticed, there is a new type declared: `new GraphQLList()`. What `GraphQLList` does is to create a type wrapper around other types that represents a list of those types.

## Defining a Schema
Schema defines how you want the data in your application to be shaped and how you want the data to be related with each other. Schema defination affects the way data will be stored in your database(s). In schema defination you’ll also be defining what `queries`, `mutations`, and `subscriptions` that will be made available to the front-end displaying the data.

Lets add this schema to our file:
```javascript
// This is the schema declaration
const BlogAppSchema = new GraphQLSchema({
  query: BlogQueryRootType
  // If you need to create or updata a datasource, 
  // you use mutations. Note:
  // mutations will not be explored in this post.
  // mutation: BlogMutationRootType 
});
```

Here `query` is assigned the `BlogQueryRootType` object to be used as the `root query` of the API.

## GraphQL API implementation using GraphQL schema language

We will be needing a package `lodash`. Lodash is a toolkit of Javascript functions that provides clean, performant methods for manipulating objects and collections. If you're familiar with the `underscore` library that's great!. `Lodash` was created from it with some modifications made to provide additional functionality and deal with some performance issues in the `underscore` library. 

```bash
npm install lodash --save
```

This will install the `lodash` package and save it as a dependency in your `package.json` file.

Add the following code at the top in your schema.js:

```javascript
const _ = require('lodash');
```

The following line of code makes the `lodash` library functionalities usable in `schema.js`.

Now let's take a look into the `schema.js` file, this is how schema.js file should look. You can get it on [github] (https://github.com/codediger/graphql-express-nodejs/blob/master/src/schema.js).

```javascript
// schema.js
const _ = require('lodash');

// Authors and Posts get data from JSON Arrays in the respective files.
const Authors = require('./data/authors');
const Posts = require('./data/posts');


/* Here a simple schema is constructed without using the GraphQL query language. 
  e.g. using 'new GraphQLObjectType' to create an object type 
*/

let {
  // These are the basic GraphQL types need in this tutorial
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  // This is used to create required fileds and arguments
  GraphQLNonNull,
  // This is the class we need to create the schema
  GraphQLSchema,
} = require('graphql');

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represent an author",
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLString)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    twitterHandle: {type: GraphQLString}
  })
});

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "This represent a Post",
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    body: {type: GraphQLString},
    author: {
      type: AuthorType,
      resolve: function(post) {
        return _.find(Authors, a => a.id == post.author_id);
      }
    }
  })
});

// This is the Root Query
const BlogQueryRootType = new GraphQLObjectType({
  name: 'BlogAppSchema',
  description: "Blog Application Schema Root",
  fields: () => ({
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of all Authors",
      resolve: function() {
        return Authors
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      description: "List of all Posts",
      resolve: function() {
        return Posts
      }
    }
  })
});

// This is the schema declaration
const BlogAppSchema = new GraphQLSchema({
  query: BlogQueryRootType
  // If you need to create or updata a datasource, 
  // you use mutations. Note:
  // mutations will not be explored in this post.
  // mutation: BlogMutationRootType 
});

module.exports = BlogAppSchema;
```

If you notice in `PostType`, we have an additional attribute `resolve`. The function of `resolve` is perform operations that involve data manipulation or transformation with a value returned at the end of the operation.

Types and query has already been discussed above.  `BlogAppSchema` will be exported to the `server.js` file using `module.exports` and by exporting `BlogAppSchema` we make everything available to our `server.js` file.

Create a` server.js` file in the `root directory` and add this code:

```javascript
// server.js

/*	
	Required modules {express and express-graphql} 
	will be imported along with the schema object
	from the schema.js file in src/schema.js 
*/

const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./src/schema.js');

let port = 3000;
const app = express();
app.use('/', graphqlHTTP({
  schema: schema,
  graphiql: true //set to false if you don't want graphiql enabled
}));

app.listen(port);
console.log('GraphQL API server running at localhost:'+ port);
```

We can test is at `localhost:3000`. In the root directory, open CLI terminal and execute:

```bash
node server.js
```

Result:

{{% img "https://cdn.scotch.io/32265/MjRU5G3SXWnVno87GonZ_initialLayout.PNG" %}}

This is how the server will come up. This is `graphiql` and its helps you query your API in the browser. To test the API type the following query:

```
{
  posts{
    id
    title
    author{
      name
    }
  }
}

```

The result should look like this: 

{{% img "https://cdn.scotch.io/32265/pkFKgqtnT9Cawur1JffX_finalLayout.PNG" %}}

## Conclusion
I am so excited and proud to have completed this tutorial with you. This is how to create a GraphQL API server powered by Express and NodeJS. I hope the tutorial was interesting and you learn't alot. Let me know if you have any questions or contributions. I would be glad to hear it!

If you want to know more about GraphQL visit https://graphql.org. 

For GraphQL vs REST comparism, take a look at this blog post written by Adam Zaczek - https://www.netguru.co/blog/grapghql-vs-rest

