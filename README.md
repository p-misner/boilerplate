# React Set Up without `create-react-app`

I'm using [this medium article](https://medium.com/swlh/a-complete-webpack-setup-for-react-e56a2edf78ae) as a reference.

## Configuring Webpack

Webpack is a static module bundler for javascript which basically means it processes all the files you've written then bundles your code up into (usually) a single file to serve to the site. Further, the bundler ensures files are served to the site in the right order so everything functions.

## Using Babel

Babel is a loader. Loaders allow webpack to process other types of files and convert them into valid modules that can be consumed by your application and added to the dependency graph. Babel is a third party library that is used to convert ECMAScript 2015+ code into a backward-compatible version of JavaScript in current and older browsers or environments.

- babel/core: The core babel library
- babel/preset-env: Is a smart preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms (and optionally, browser polyfills) are needed by your target environment(s)This is also known as browser polyfills
- babel/preset-react: Transform React JSX into regular JavaScript code
- babel-loader: Webpack loader helper

### Step 0: Making a .gitignore file

To save you the hassle later when you defintely forget to make this before commiting for the first time, create a .gitignore file that contains this:

```
# dependencies
/node_modules
/.pnp
.pnp.js
apiKeys.js

# testing
/coverage

# production
/build
/dist

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local
.env

npm-debug.log*
yarn-debug.log*
```

### Step 1: Create a `webpack.config.js` file

The `entry` field specifies the entry point or start for webpack to build dependency graph
The `output` field tells webpack where to emit the bundles it creates and how to name these files. It defaults to `./dist/main.js` for the main output file and to the `./dist` folder for any other generated file

```
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  },
  mode: "production"
};
```

### Step 2: Initialize

Run `npm init -y` to download dependencies. This will create a `package.json` file

### Step 3: Adding more dependencies

Install webpack, CLI and the development server for testing by running:

```
npm install --save-dev webpack webpack-cli webpack-dev-server
```

Install React and React DOM as dependencies by running:

```
npm install react react-dom
```

Install Core and JavasScipt Loaders by running:

```
npm install --save-dev @babel/core babel-loader @babel/preset-env @babel/preset-react
```

Install css loaders by running:

```
npm install --save-dev css-loader style-loader postcss-loader --save-dev
```

Install image loader by running:

```
npm install --save-dev file-loader url-loader
```

Finally install some plug-ins:

```
npm install --save-dev autoprefixer
npm install --save-dev html-webpack-plugin
```

Running these commands should also automatically update the package.json file created in the previous step. If for some reason it doesn't add `--save` to force it to be added to your local development env

The devDependecies section of package.json should look like this:

```
"devDependencies": {
    "@babel/core": "^7.12.3",
    "@babel/preset-env": "^7.12.1",
    "@babel/preset-react": "^7.12.1",
    "autoprefixer": "^10.0.1",
    "babel-cli": "^6.26.0",
    "babel-loader": "^8.1.0",
    "css-loader": "^5.0.0",
    "file-loader": "^6.1.1",
    "html-webpack-plugin": "^4.5.0",
    "postcss-loader": "^4.0.4",
    "style-loader": "^2.0.0",
    "url-loader": "^4.1.1",
    "webpack": "^4.44.1",
    "webpack-cli": "^3.3.12",
    "webpack-dev-server": "^3.11.0"
  }
```

### Step 4: Project File Structure

Create a `src` folder and put your project files there. Unsure what to put in? Here's some boilerplate react.

#### index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boilerplate</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

#### App.js

```
import React from "react";
import ReactDOM from "react-dom";

import './style.css';

const App = () => {
  return (
    <div>
        <div>Hello React Boilerplate</div>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
```

#### style.css

```
body {
   min-width: 200px;
   max-width: 500px;
   width: 80vw;
   margin: 0 auto;
   font-family: monospace;
}

div {
    background-color: teal;
}
```

### Step 5: `.babelrc`

Create a `.babelrc` file in the project folder root to configure how Babel behaves. Babel will automatically look for this file on startup. File looks like this:

```
{
  "presets": ["@babel/preset-react"],
  "env": {
    "development": {
      "presets": [["@babel/preset-react", { "development": true }]]
    }
  }
}
```

### Step 6

Inside scripts section of `package.json` include start and build script directions.

```
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack-dev-server --open --hot --mode development",
    "build": "webpack --mode production"
  }
```

### Step 7

Update webpack.config.js to look like this:

```
const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        chunkFilename: '[id].js',
        publicPath: ''
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: "[name]__[local]___[hash:base64:5]",
                            },
                            sourceMap: true
                        }
                     },
                     {
                         loader: 'postcss-loader',
                         options: {
                             ident: 'postcss',
                             plugins: () => [
                                 autoprefixer({})
                             ]
                         }
                      }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'url-loader?limit=10000&name=img/[name].[ext]'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ]
};
```

### Step 8: Run Project

```
npm run start
```

# Deploying to Heroku

I'm using [this article](https://codeburst.io/deploy-your-webpack-apps-to-heroku-in-3-simple-steps-4ae072af93a8) as a reference.

## Building an Express Server

### Step 1: Build

run `npm build` to have a bundle.js file created. This is what will be running inside heroku. Also `npm install express --save-dev`

### Step 2: Express Server

This is used to serve index.html file. Code is pretty standard and boilerplate

```
const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

// the __dirname is the current directory from where the script is running
//bc of [htmlWebpackPlugin] in webpack, output is generated in dist folder
app.use(express.static(__dirname + "/dist"));

// send the user to index html page inspite of the url
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port);
```

### Step 3

To check if steps 1 and 2 succeeded, run `node server.js` in terminal and then go to `localhost:8080` to see if app is running;

### Step 4

Inside the package.json file add these two new script directions. Because heroku needs the "start" script to be the express server to succeed, rename the start script you are using for local dev to `dev` so that now when you start the application you should type `npm run dev`

```
"scripts": {
  "start": "node server.js", // serves the application
  "heroku-postbuild": "webpack -p" // runs after installation
},
```

## Connecting to Heroku

### Creating Heroku Git Repo

Once the Heroku CLI is installed, follow these steps to launch on heroku. Afer final step it should say "Build Succeeded" if everything is kinda working correctly

```
heroku create //this makes a new heroku git repo
heroku git:remote --app <your-heroku-app-name>
git add . && git commit -m "initial commit"
git push heroku master

```

### Issues?

Heroku says the build suceeded but nothing happens on the actual site? Run `heroku logs --tail` to get more detail on whats happening in the app.

## Setting up Sublime Workspace

### Emmett

Run “Package Control: Install Package” command, find and install Emmet plugin. Once it's installed, it should work whenever you press `Ctrl + E`. If you want to get it to work with tab, add this into the `Emmet Sublime Settings` json.

```
"keys": ["tab"],
  "args": {"action": "expand_abbreviation"},
  "command": "run_emmet_action",
  "context": [
    {"key": "emmet_action_enabled.expand_abbreviation"}
  ]
```

If `Ctrl+e` isn't working, adjust the key binding in the Settings json. Go to Sublime Text > Preferences > Package Settings > Emmet > Key Bindings - User and add in this code

```
[{
  "keys": ["ctrl+e"],
  "command": "emmet_expand_abbreviation",
}]
```

### Prettier

prettier is purely concerned with mechanical formatting (doesn't care about the code's ability to function)

First, install prettier:

```
npm i --save-dev prettier
```

Then, use the Package Control Manager to install jsPrettier from the dropdown. To get jsPrettier to format on save, open `Preferences>Package Settings>JsPrettier>Settings - Default` and set the `auto_format_on_save option` to true.

### Eslint

eslint unlike prettier is concerned with style --> what methods are you using, is it accessible, are your variables being used, etc. Make sure eslint is installed in sublime package manager.

#### Installations

First install eslint:

```
npm install --save-dev eslint
```

And then a lot of add-ons, some especially for react:

```
npm install --save-dev eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks
```

#### .eslintrc

Create this file and add stuff from below:

```
{
  "extends": [ "eslint:recommended", "plugin:react/recommended" ],
  "env": {
    "node": true,
    "browser": true,
    "es6":true
  },
  "parserOptions": {
      ecmaVersion: 8,
      ecmaFeatures: {
          jsx: true,
      },
      sourceType: "module"
  },
  "plugins": [ "react" ]
}
```

### Spellcheck

Press `fn + F6`
