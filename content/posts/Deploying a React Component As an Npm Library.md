---
author: "Orinami Olatunji"
date: 2018-02-18
title: Deploying a React Component As an Npm Library
type: "post"

tags: [
  "react", "javascript"
]
---

## Introduction
When writing components in React, we find out that some of these  components are actually reusable and we've been writing the same thing across different applications over and over. While some developers have formed the habit of keeping reusable React components in a special folder on their computer for later usage, it would be nice if we could share our React component with other developers so as to further improve the component and make it available for others. So, in this tutorial we would create a React component and learn how to deploy it to NPM.

Let's start with what is:
* [React](https://reactjs.org/)
* [a React Component](https://scotch.io/tutorials/reactjs-components-learning-the-basics)
* [Node Package Manager(NPM)](https://npmjs.com)

## What We'll be Building
We will be building a simple React button component.

>If you have no idea what React is, you can start from [here](https://reactjs.org/) and do some magic with this tutorial [here](https://scotch.io/tutorials/create-a-simple-to-do-app-with-react).

## Directory Structure
```shell
-- build
	index.js
-- node_modules
	...
-- src
	index.js
.babelrc
.gitignore
LICENSE
package.json
README.md
webpack.config.js
```

## Getting Started
First, let's look for a name on NPM for our React component package. We can do this by typing `https://www.npmjs.com/package/` to the address bar of our browser and adding our proposed package name after `/package/`. This can guide us when creating our project on a source control system.

You should see this if the proposed package name is not taken:
![](https://cdn.scotch.io/32265/a1rFIPTnGTNPceYpHYgW_Screen%20Shot%202017-11-19%20at%207.18.45%20PM.png)

Let's create a repository for our package [here](https://github.com/new). 
![](https://cdn.scotch.io/32265/zdSyivI8QVquru0yTxXe_Screen%20Shot%202017-11-16%20at%204.05.04%20PM.png)

Then clone the repo to a chosen directory on your computer using:
```shell
git clone repo-URL
```

For example: `git clone https://github.com/codediger/react-butin.git`

## Creating the React Component
Let's start with creating our `package.json` file. Be sure you have [Node](https://nodejs.org) installed on your computer to be able to run NPM. Then we'll open our terminal, navigate to the root directory of our project and run:

```shell
npm init
```

This command creates our `package.json` file. Then we'll add a few more things to our package.json file:
```json
"scripts": {
    "start": "webpack --watch", // tells webpack to watch for change in our files
    "build": "webpack" // tells webpack to bundle our files.
  },
  "peerDependencies": {
    "react": "^16.1.1" // tells npm that we would be using the React package of parent application
  },
  "dependencies": {
    "react": "^16.1.1"
  },
  "devDependencies": {
    "webpack": "^3.8.1",
    // babel stuff
    "babel-cli": "^6.26.0",
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-plugin-transform-object-rest-spread": "^6.26.0",
    "babel-plugin-transform-react-jsx": "^6.24.1",
    "babel-preset-env": "^1.6.1"
  }
```

Be sure that your `package.json` file looks like this:
```json
{
  "name": "react-butin",
  "version": "0.1.0",
  "description": "A React component for displaying customizable buttons",
  "main": "build/index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack --watch",
    "build": "webpack"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/codediger/react-butin.git"
  },
  "keywords": [
    "react",
    "javascript"
  ],
  "author": "Orinami Olatunji <orinamiolatunji@gmail.com> (orinamiolatunji.com)",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/codediger/react-butin/issues"
  },
  "homepage": "https://github.com/codediger/react-butin#readme",
  "peerDependencies": {
    "react": "^16.1.1"
  },
  "dependencies": {
    "react": "^16.1.1"
  },
  "devDependencies": {
    "webpack": "^3.8.1",
    "babel-cli": "^6.26.0",
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-plugin-transform-object-rest-spread": "^6.26.0",
    "babel-plugin-transform-react-jsx": "^6.24.1",
    "babel-preset-env": "^1.6.1"
  }
}
```

Then we'll install our package dependencies using: 
```shell
npm install
```

All our dependencies will be installed in the `node_modules` folder that NPM will create for us.

Next, we'll create a `.babel.rc` file. This will store our [babel configuration](https://babeljs.io/docs/usage/babelrc/). Let's add this to the file:
```json
// babel configuration
{
  "presets": ["env"],
  "plugins": [
    "transform-object-rest-spread",
    "transform-react-jsx"
  ]
}
```

Next, we'll set up [webpack](https://webpack.github.io) to bundle our code. We'll store our [configuration](https://webpack.github.io/docs/configuration.html) in `webpack.config.js`. Let's create this file in the root directory and add this configuration:
```javascript
// webpack configuration
var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2' 
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules | build)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  externals: {
    'react': 'commonjs react'
  }
};
```

For more information on setting up webpack, read [here](https://webpack.github.io/docs/configuration.html).

Let's create our `build` and `src` folder in the root directory. The `build` folder will contain our webpack bundled code while `src` would contain an `index.js` file where we would write the code for the component we want to build. 

Now, let's create the `index.js` file in the `src` folder and paste this code:

```javascript
import React from 'react';

/**
 * The simplest way to define a component is to write a JavaScript function.
 * 
 * So, we'll create a Javascript Function and name it "Button"
 */
function Button(props) {
  return (
    <button style={props}>{props.buttonName}</button>
  )
}

/**
 * Here we define the default properties for our React button component.
 * It's just CSS.
 */
Button.defaultProps = {
  display: 'inline-block',
  borderRadius: '3px',
  padding: '0.5rem 0',
  margin: '0.5rem 1rem',
  width: '11rem',
  border: '2px solid white',
  background: 'black',
  color: 'white'
}

export default Button;
```

We are going to create a local copy of our package using the following command:
```shell
npm link
```

What this command does is to take a copy of your package/project and add it to your available NPM local modules.

## Testing the Component
It's time to test our package. Whoohoo! 

Create a new React app using [create-react-app](https://github.com/facebookincubator/create-react-app#getting-started). Follow the instructions to install and create a new React application.

Start the app using:
```shell
npm start
```

You should see this in your browser:
![](https://cdn.scotch.io/32265/UK6HhepvRRmDjntUR4zE_Screen%20Shot%202017-11-17%20at%2012.01.59%20AM.png)

Now, let's get a copy of our package in this our new React application. Be reminded that we have not yet published our package. So how are we going to import it to our project? 

Using the command below, we can simulate the idea that our package is being downloaded from NPM directly when it is being downloaded from the local copy we created earlier using `npm link`. Let's run this command:
```shell
npm link 'package-name'
```

In my case, it would be `npm link react-butin`

Let's go back to the React application we just created. If we navigate to the `src` folder, we'll find an `App.js` file there. Let's open the file, clear the content and add this:
```javascript
import React, { Component } from 'react';
import Button from "react-butin";

const style = {
  background: 'black',
  textAlign: 'center',
  padding: '100px 0'
}

class App extends Component {
  render() {
    return (
      <div style={style}>
        <Button buttonName="New Button" />
      </div>
    );
  }
}

export default App;

```

You should see something like this: 
![](https://cdn.scotch.io/32265/ivT3bi3WQemz20mstvYn_Screen%20Shot%202017-11-17%20at%2012.18.56%20AM.png)

Now that our component is working, let's modify it and add a new property - `background`. Replace the `<Button buttonName="New Button" />` with this:
```javascript
<Button buttonName="New Button" background="midnightblue" />
/**
 * The Button Component accept pre-defined properties and it is also extensible. 
 * Just pass in regular CSS and it would work. Like this:
 * 
 * <Button buttonName="New Button" background="midnightblue" height="4rem"/>
 * 
 * "height" was not defined as a property in the React component we created but it
 * would take effect when declared.
 */
```

You should see this now:
![](https://cdn.scotch.io/32265/iyH2Q9OTOiARBWCrIUQO_Screen%20Shot%202017-11-17%20at%2012.24.53%20AM.png)

So, yeah, our React package works as it should. Whoohoo!

## Deploying to Npm
To deploy our package, all we need to do is to login to our NPM account in the terminal. If you don't have one, signup [here](https://npmjs.com). After that, we login on our terminal using:
```shell
npm login
```

This would ask you for your `username`, `password` and `email`, enter them and if successful, you'll see something like this: `Logged in as codediger on https://registry.npmjs.org/` if not, you'll see `Incorrect username or password`.

Then deploy your package using:
```shell
npm publish
```

That's all! 

## Conclusion
Deploying a React component NPM is not difficult. I hope you enjoyed the tutorial and have learnt how to deploy React components to NPM from this tutorial. Share to your social media platforms if you found this tutorial interesting. Happy Reading!