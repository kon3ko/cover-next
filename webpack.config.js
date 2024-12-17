// Generated using webpack-cli https://github.com/webpack/webpack-cli
const webpack = require('webpack');
const WebpackObfuscator = require('webpack-obfuscator');
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";
const stylesHandler = "style-loader";

const config = {
    entry     : "./src/cover-next.js",
    output    : {
        path     : path.resolve(__dirname, "dist"),
        filename : "cover-next.js"
    },
    devServer : {
        open : true,
        host : "localhost",
    },
    plugins   : [
        new webpack.ProvidePlugin({
            $      : "jquery",
            jQuery : "jquery"
        }),
        isProduction ? new WebpackObfuscator({
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 1,
            debugProtection: true,
            debugProtectionInterval: 1000,
            stringArray: true,
            stringArrayEncoding: ['rc4'],
            stringArrayThreshold: 1,
            renameGlobals: true,
            identifierNamesGenerator: 'mangled',
            selfDefending: true,
            simplify: true,
            output: {
                beautify: false,
                comments: false,
            }
        }) : () => {},
    ],
    module    : {
        rules : [
            {
                test   : /\.(js|jsx)$/i,
                loader : "babel-loader",
            },
            {
                test : /\.css$/i,
                use  : [stylesHandler, "css-loader"],
            },
            {
                test : /\.s[ac]ss$/i,
                use  : [stylesHandler, "css-loader", "sass-loader", "postcss-loader"],
            },
            {
                test : /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type : "asset",
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve   : {
        fallback : {
            "crypto" : false,
            "buffer" : false
        },
    }
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";
    } else {
        config.mode = "development";
    }
    return config;
};
