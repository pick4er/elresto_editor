import fs from 'fs';
import path from 'path';
import Vue from 'vue';
import { createBundleRenderer } from 'vue-server-renderer';

import { get_site_file } from '../routes/site'

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


function get_resto_files(resto_name) {
  try {
    const { map, data, components } = get_site_file(resto_name)

    return { map, data, components }
  } catch (e) {
    console.log('e:', e)
    return null
  }
}

async function prerender(ctx) {
  const { isMobile = false } = ctx.userAgent;
  const { subdomains = [] } = ctx.request
  const resto_name = subdomains[0]

  const isEdit = !resto_name

  console.log('resto_name:', resto_name)
  console.log('isEdit:', isEdit)

  const context = {
    url: ctx.url,
    isMobile,
    layout: isMobile ? 'mobile' : 'desktop',
    isEdit,
    map: [],
    data: {},
    components: [],
  };

  if (!isEdit) {
    const { map, data, components } = get_resto_files(resto_name) || {}
    context.map = map,
    context.data = data
    context.components = components
  }
  
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
