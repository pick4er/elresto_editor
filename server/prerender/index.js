import fs from 'fs';
import path from 'path';
import Vue from 'vue';
import { createBundleRenderer } from 'vue-server-renderer';

import getComponentsFromMap from 'helpers/getComponentsFromMap'

import markup from 'server/templates';
import ssrBundle from 'bundle/vue-ssr-server-bundle.json';
import clientManifest from 'build/vue-ssr-client-manifest.json';

const renderer = createBundleRenderer(ssrBundle, {
  inject: false,
  runInNewContext: false,
  clientManifest,
  template: (html, context) => markup.render({
    html,
    layout: context.layout,
    state: context.renderState({
      windowKey: '__INITIAL_STATE__',
    }),
    styles: context.renderStyles(),
    scripts: context.renderScripts(),
    resourceHints: context.renderResourceHints(),
  }),
});

function getMap() {
  const rawMap = fs.readFileSync(
    path.join(process.cwd(), 'public', 'mockMap.json'),
    { encoding: 'utf-8' },
  );
  const { map } = JSON.parse(rawMap);

  return map;
}

function getData() {
  const rawData = fs.readFileSync(
    path.join(process.cwd(), 'public', 'mockData.json'),
    { encoding: 'utf-8' },
  );
  const parsedData = JSON.parse(rawData);

  return parsedData;
}

async function prerender(ctx) {
  const { isMobile = false } = ctx.userAgent;

  const map = getMap();
  const data = getData();
  const componentsToRegister = getComponentsFromMap(map);

  const context = {
    url: ctx.url,
    isMobile,
    layout: isMobile ? 'mobile' : 'desktop',
    map,
    data,
    components: componentsToRegister,
  };

  const html = await renderer.renderToString(context)
    .catch(err => {
      console.log(err);

      if (err.status === 404) {
        ctx.status = 404;
        ctx.body = 'Not found';
      } else {
        ctx.status = 500;
        ctx.body = 'Internal error';
      }
    });

  ctx.status = 200;
  ctx.body = html;
}

export default prerender;
