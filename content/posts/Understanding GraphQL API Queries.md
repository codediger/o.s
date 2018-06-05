---
date: 2017-06-19
title: Understanding GraphQL API Queries
type: "post"

tags: [
  "graphql", "javascript", "node", "express"
]
---
Originally published on scotch.io

---

Queries in GraphQL enable you to request for data like `GET` verb in `REST API`. A GraphQL query allows you to specify the shape you want to retrieve data from a server. If you have no idea of what GraphQL is, I would suggest that you read this blog post - [Build a Simple GraphQL API Server With Express and NodeJS](/posts/build-a-simple-graphql-api-server-with-express-and-nodejs) to get started.

## Introduction
In this tutorial we would be using a sample inventory API to explore GraphQL queries. You can get the repo [here](https://github.com/codediger/graphql-inventory-api) and follow the instructions to make it available on your machine.

## Basic Query
Queries can be performed on either objects or scalar types. When querying objects, we need to choose which field or fields("columns") that will be sent as part of the request to the server. Lets take a look at a basic query.
```graphql
{
  getItems{
    item_id
    item_type
    item_name
  }
}
```
`getItems` is object type which is also root field that acts at the entry point to get all Items. `item_id`, `item_type`, `item_name` are fields of `ItemType`.

Here’s the data we get back:

{{% img "https://cdn.scotch.io/32265/AUbwjitT7OLmze9dPDS0_Screen%20Shot%202017-06-18%20at%204.43.13%20PM.png" %}}

## Named Queries
A named query isn't much different from a basic query. Infact, the only difference is that a query has a name that it can be associated with. Here's an example:
```graphql
query getItemsQuery{
  getItems{
    item_id
    item_type
    item_name
  }
}
```
Now, we have given our query a name `getItemsQuery`. Think of a named query as a `named function` in `JavaScript`. Also, giving a query a name can be important as it helps in debugging and logging queries.  

## Field Aliases
We might want to query a GraphQL server to get two individual items. Let's say we want to get two items from the Inventory API and we do something like this: 
```graphql
query getTwoItems{
  getItem(filter: {item_id: 481500000004420}){
    item_id
    item_name
    item_type
    is_taxable
  }
  getItem(filter: {item_id: 982000000030049}){
    item_id
    item_name
    item_type
    is_taxable
  }
}
```
Here’s what we get back:

{{% img "https://cdn.scotch.io/32265/rTJBQXetQ1KCQeRpyfsp_Screen%20Shot%202017-06-19%20at%208.16.41%20AM.png" %}}

We get an error: ` "message": "Fields \"getItem\" conflict because they have differing arguments. Use different aliases on the fields to fetch both if this was intentional."` There is a way to get this issue resolved and this is where `field aliasing` is used. 

Let's write a query using field aliasing to get our two individual items:
```graphql
query getTwoItems{
  firstItem: getItem(filter: {item_id: 481500000004420}){
    item_id
    item_name
    item_type
    is_taxable
  }
  secondItem: getItem(filter: {item_id: 982000000030049}){
    item_id
    item_name
    item_type
    is_taxable
  }
}
```

Here's the result: 

{{% img "https://cdn.scotch.io/32265/wnQe7FSPeFBG7sN2ByfQ_Screen%20Shot%202017-06-19%20at%208.23.32%20AM.png" %}}

Now we can see how field aliasing helps us handle querying two items of the `getItems field`. 

## Fragments
In the example above, we had repeat query fields `item_id`, `item_name`, `item_type`, `is_taxable`. Using fragments is a better way to write queries that has to do with repeating fields.

Here's is a better way to write `query getTwoItems` using fragments:

```graphql
query getTwoItems{
  firstItem: getItem(filter: {item_id: 481500000004420}){
    ...itemFragment
  }
  secondItem: getItem(filter: {item_id: 982000000030049}){
    ...itemFragment
  }
}

fragment itemFragment on Items {
  item_id
  item_name
  item_type
  is_taxable
}
```
What we've done here is to `DRY` our query. `DRY` simply means `Don't Repeat Yourself`. So we created a fragment `itemFragment` on `Items` field. Think of `fragment` and `on` as keywords used in writing `fragments` in GraphQL.

## Arguments
In many cases we'll need to pass `arguments` in our query. Let's say we want to get the first two items, we can do this: 
```graphql
query getFirstTwoItems {
  getItems(first: 2){
    item_id
    item_name
    item_type
    is_taxable
  }
}
```

Here's the result:

{{% img "https://cdn.scotch.io/32265/m1JZjVRhT3ezjImxTOGF_Screen%20Shot%202017-06-19%20at%209.17.17%20AM.png" %}}

`getItems`field in this case takes an argument `first`, accepts an integer literal as its value and returns the first two items in the datastore.

## Variables
Rather than using literal values directly as arguments in queries, we can use variables instead. We do this by creating a `variable name` prepended by `$` and a `variable type` then add it it the query name. On the field `getItems` we'll pass the variable name instead of directly passing the variable literal:

```graphql
query getFirstTwoItems($value: Int) {
  getItems(first: $value){
    item_id
    item_name
    item_type
    is_taxable
  }
}
```

We would pass the query variable value like this: 
```graphql
{
  "value": 3
}
```

Here is the result:

{{% img "https://cdn.scotch.io/32265/QL7I9mAzRWedDUAjGYwR_Screen%20Shot%202017-06-19%20at%209.19.48%20AM.png" %}}

## Directives
GraphQL comes with two `built-in directives`: `@skip` and `@include`, and they allow `data filtering`.

Let’s create our query variable to explore directives in GraphQL:
```graphql
{
  "itemIdDirective": true
}
```

### @skip
We use `@skip` to remove data returned by the server if the value passed in is true.

Let's see `@skip` usage:

```graphql
query getFirstTwoItems($itemIdDirective: Boolean!) {
  getItems {
    item_id @skip(if: $itemIdDirective)
    item_name
    item_type
    is_taxable
  }
}
```
Here's the result: 

{{% img "https://cdn.scotch.io/32265/rYFgfGDbToyxMrNdKQkb_Screen%20Shot%202017-06-19%20at%2012.06.14%20PM.png" %}}

Notice the `Boolean!`, the `!` symbol is used to indicate that the value is `required`. 

### @include
We use `@include` to include data returned by the server if the value passed in is true. It's the opposite of `@skip`. 

Let's see it in action:

```graphql
query getFirstTwoItems($itemIdDirective: Boolean!) {
  getItems {
    item_id @include(if: $itemIdDirective)
    item_name
    item_type
    is_taxable
  }
}
```
Here's the result: 

{{% img "https://cdn.scotch.io/32265/6BaAp8bQSPikzKDyPGbw_Screen%20Shot%202017-06-19%20at%2012.04.03%20PM.png" %}}

We can see `item_id` now as part of the data returned by the server because the query variable $`itemIdDirective` has a boolean value - `true`.

## Conclusion
In this tutorial, you have learn't how to construct basic queries up to using directives in a GraphQL. I hope the tutorial was interesting and you were able learn't alot. Let me know if you have any questions or contributions. I would be glad to hear it! 