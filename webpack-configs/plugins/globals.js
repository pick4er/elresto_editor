/* eslint-disable-next-line import/no-extraneous-dependencies */
import webpack from 'webpack';

const envs = [
  'BACKEND_URL',
  'PUBLIC_PATH',
  'DEV_SERVER_PORT',
];

function stringifyEnv(envValue) {
  if (
    typeof envValue === 'boolean' ||
    typeof envValue === 'number'
  ) {
    return envValue;
  }

  return JSON.stringify(envValue);
}

export default function getGlobals() {
  const globals = {};

  envs.forEach(env => {
    globals[env] = stringifyEnv(process.env[env] || null);
  });

  return new webpack.DefinePlugin(globals);
};
