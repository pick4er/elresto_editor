import fs from 'fs';
import path from 'path';
import Vue from 'vue';
import { createBundleRenderer } from 'vue-server-renderer';
import uniqby from 'lodash.uniqby';

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

function parsePreciseTag(preciseTag) {
  const tagParts = preciseTag.split('_');

  const commonTagName = tagParts[0];
  const tagSitePosition = tagParts[1];
  const siteTag = tagParts[2];

  return { commonTagName, tagSitePosition, siteTag };
}

function parseMapField(mapField) {
  const preciseTag = mapField[0];
  const componentName = mapField[1];

  return { preciseTag, componentName };
}

function getComponents(map) {
  const uniqMapFields = uniqby(
    map,
    mapField => parseMapField(mapField || []).componentName,
  );

  const components = [];
  for (let i = 0; i < uniqMapFields.length; i += 1) {
    const { preciseTag, componentName } = parseMapField(uniqMapFields[i]);
    const { commonTagName } = parsePreciseTag(preciseTag);

    components.push([commonTagName, componentName]);
  }

  return components;
}

async function prerender(ctx) {
  const { isMobile = false } = ctx.userAgent;

  const map = getMap();
  const componentsToRegister = getComponents(map);

  const context = {
    url: ctx.url,
    isMobile,
    layout: isMobile ? 'mobile' : 'desktop',
    map,
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
