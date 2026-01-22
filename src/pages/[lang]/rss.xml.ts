import { SITE } from '@/consts'
import rss from '@astrojs/rss'
import type { APIContext, APIRoute } from 'astro'
import { getAllPosts, getAllPostsAndSubpostsLocale } from '@/lib/data-utils'
import { i18n } from "astro:config/client";
import { toCodes } from "astro:i18n";


export async function getStaticPaths() {

  var pages: [] = []

  const locales: [] = toCodes(i18n!.locales)

  for(var l in locales){
    pages = pages.concat([{params: {lang: locales[l]}}])
  }

  return pages
}

export const GET: APIRoute = async ({ params, request }) => {
  const posts = await getAllPostsAndSubpostsLocale(params["lang"])
  
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: SITE.href,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
  })
};
