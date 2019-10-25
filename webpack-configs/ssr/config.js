import path from 'path';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import autoprefixer from 'autoprefixer';
import VueSSRPlugin from 'vue-server-renderer/server-plugin'

import getGlobals from '../plugins/globals';
import getExternals from '../utils/externals';
import getEnvs from '../utils/dotenv';

getEnvs();

const context = {
  DIR: path.resolve('./'),
};

export default function configSSRWebpack(props) {
  const { production = true, development = false, } = props;
  const { DIR } = context;

  return {
    target: 'node',
    mode: production ? 'production' : 'development',
    context: DIR,
    entry: {
      ssr: [
        path.join(DIR, 'client', 'ssr'),
      ],
    },
    output: {
      filename: '[name].js',
      path: path.join(DIR, 'bundle'),
      libraryTarget: 'commonjs2',
      publicPath: process.env.PUBLIC_PATH,
    },
    resolve: {
      alias: {
        api$: path.join(DIR, 'fetch', 'server.js'),
      },
      mainFiles: ['index.js'],
      extensions: ['.js', '.jsx', '.styl', '.vue'],
      modules: [DIR, 'node_modules'],
    },
    externals: getExternals(),
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: {
            loader: 'vue-loader',
          },
        },
        {
          test: /\.(png|jpe?g|woff|ttf)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name]@[hash:base64:5].[ext]',
            },
          },
        },
        {
          test: /\.styl|(us)$/,
          use: [
            development && 'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  mode: 'local',
                  localIdentName: '[name]-[local]-[hash:base64:5]',
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false,
                plugins() { return [autoprefixer]; },
              },
            },
            {
              loader: 'stylus-loader',
              options: {
                import: [path.join(DIR, 'client', 'styles', 'import.styl')],
              },
            },
          ].filter(Boolean),
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
              ],              
            },
          },
        },
      ],
    },
    plugins: [
      getGlobals(),
      new VueLoaderPlugin(),
      new VueSSRPlugin(),
    ],
  };
};
