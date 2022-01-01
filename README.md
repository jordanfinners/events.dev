# Welcome to events.dev!

This is the repository for the [events.dev](https://events.dev) website.

We would love to hear your experiences and get different perspectives and opinions on Event Driven Systems.

We welcome all contributions to any blogs or enhancements to this site, check out our contributing guide below.

## Built With

The site is built with [11ty](https://www.11ty.dev/) and enhanced with a [number of plugins](https://github.com/jordanfinners/events.dev/blob/main/package.json#L5).

## Hosting and Serving

The site is hosted on [Cloudflare Pages](https://pages.cloudflare.com/).

A preview build will be generated on every Pull Request. The site will be built and deployed on merging to main branch.

You can serve the site locally using:

```bash
npm run serve
```

## Linting

This site is linted using a number of tools:

*   Markdown - is linted by [remark](https://github.com/remarkjs/remark-lint)
*   CSS - is linted by [stylelint](https://stylelint.io/)
*   Javascript - is linted by [eslint](https://eslint.org/)

Linting can be run with:

```bash
npm run lint
```

It can also be autofixed using:

```bash
npm run lint:fix
```

## Contributing

We'd love your contributions! Whether it is fixing a typo, adding a new blog or anything in between!
We want to make this a hub of information and collective knowledge about Event Driven Systems, we would love to hear your experiences and get different perspectives and opinions on Event Driven Systems!

Please treat others with respect when contributing.

### Set up

```bash
git clone https://github.com/jordanfinners/events.dev.git
cd events.dev
npm install
npm run serve
```

### Adding a new article

We'd would love to hear your thoughts on Event Driven Systems, your experiences with system architecture, how to guides or anything you want to share.
However we do not allow adverts for products.

Articles should be added under the `./blogs` folder.
The filename should be a slugified version of your articles title.

New articles should follow the format specified below.

`tags`, `permalink`, `layout` and `[Table Of Contents]()` should remain as they are in the example.
This will display your article correctly and in all the right places.

`[Table Of Contents]()` will also add a Table of Contents to your blog which is really helpful for readers.

```markdown
---
title: My Example Title
summary: A short summary of my article
topics: Topics covered in the article, comma separated, we recommend up to 5
author:
    name: Your Name
    url: A link to your personal site
    image: An image of yourself

tags: blogs
permalink: "blogs/{{ title | slug }}.html"
layout: blog.liquid
---

[Table Of Contents]()

## Intro

Event driven systems are becoming ever more popular and integral part of our modern lives.
```
