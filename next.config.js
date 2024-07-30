const webpack = require('webpack');

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    const env = {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      REACT_APP_FIREBASE_API_KEY_P:process.env.REACT_APP_FIREBASE_API_KEY_P,
REACT_APP_FIREBASE_AUTH_DOMAIN_P:process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_P,
REACT_APP_FIREBASE_PROJECT_ID_P:process.env.REACT_APP_FIREBASE_PROJECT_ID_P,
REACT_APP_FIREBASE_STORAGE_BUCKET_P:process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_P,
REACT_APP_FIREBASE_MESSAGING_SENDER_ID_P:process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_P,
REACT_APP_FIREBASE_APP_ID_P=1:process.env.REACT_APP_FIREBASE_APP_ID_P,

    };

    config.plugins.push(new webpack.DefinePlugin({ 'process.env': JSON.stringify(env) }));

    return config;
  },
};
