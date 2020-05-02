var webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./utils/env"),
    CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    WriteFilePlugin = require("write-file-webpack-plugin");

// load the secrets
var alias = {};

var secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));

var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}

var options = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    popup: path.join(__dirname, "src", "js", "popup.js"),
    options: path.join(__dirname, "src", "js", "options.js"),
    background: path.join(__dirname, "src", "js", "background.js"),
    content: path.join(__dirname, "src", "js/content", "content.js")
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js"
  },
  resolveLoader: {
    alias: {
      'lit-css-loader': path.join(__dirname, './loaders/lit-css-loader.js')
    }
  },
  module: {
    rules: [  
      // {
      //   test: /\.css$/,
      //   loader: "css-loader",        
      // },        
      {
        test: /\.css$/,
        use: [           
           'lit-css-loader'           
        ]        
      },                  
      {
        type: 'javascript/auto',
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: "file-loader?name=[name].[ext]",        
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/(node_modules|bower_components)/]
       }
    ]
  },
  resolve: {
    alias: alias
  },
  plugins: [    
    // clean the build folder - clears i18n and manifest during dev.
    // enable this only while building a build for publish 
    new CleanWebpackPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new CopyWebpackPlugin([{
      from: "src/manifest.json",
      transform: function (content, path) {
        // generates the manifest file using the package.json informations
        return Buffer.from(JSON.stringify({
          description: process.env.npm_package_description,
          version: process.env.npm_package_version,
          ...JSON.parse(content.toString())
        }))
      }
    }]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "options.html"),
      filename: "options.html",
      chunks: ["options"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "background.html"),
      filename: "background.html",
      chunks: ["background"]
    }),  
    new CopyWebpackPlugin([
      {
        //Wildcard is specified hence will copy only css files        
        from: path.join(__dirname, "src/css", "scroller.css"), //Will resolve to RepoDir/src/css and all *.css files from this directory
        to: 'scroller.css'//Copies all matched css files from above dest to dist/css
      }
    ]),
    new WriteFilePlugin()    
  ]
};

if (env.NODE_ENV === "development") {
  options.devtool = "cheap-module-eval-source-map";
}

module.exports = options;
