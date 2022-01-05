---
title: What is Idempotency?
summary: Idempotency is a principle where receiving multiple of the same event or request, leads to the same result every time. There is no guarantee in event driven systems that events or requests will only be received once.
topics: idempotency, architecture, event driven, software design
author:
  name: jordanfinners
  url: https://jordanfinners.dev
  image: https://jordanfinners.dev/images/me.jpg

tags: blogs
permalink: "blogs/{{ title | slug }}.html"
layout: blog.liquid
---

[Table Of Contents]()

## Intro

Idempotency is a principle where receiving multiple of the same event or request, leads to the same result every time.
There is no guarantee in event driven systems that events or requests will only be received once.

Imagine for example that you are receiving a HTTP Request and there is some network issue so the client isn't sure on the status of the response. The client sending the request then retries the HTTP Request, you now have received the request twice. If this was charging your bank account, charging you twice wouldn't be ideal!

## API Idempotency

By definition there are several idempotent HTTP methods, note this doesn't mean the server has to respond the same way, but the state of the server shouldn't change when receiving multiple identical requests.

For example GET, HEAD, OPTIONS and TRACE HTTP methods are all idempotent as they cannot modify the servers contents.
PUT and DELETE methods are also idempotent as they specify the ID of the resource as part of the request.
For example receiving multiple identical DELETE requests will on the first request delete the resource, but subsequent requests to DELETE the same resource, will have no effect as the resource has also been deleted.

POST and PATCH requests are not idempotent by nature as they create or modify resources. But they can be made idempotent by using request IDs for example.

[Stripe has a great blog post on idempotency and best practices for retrying requests](https://stripe.com/blog/idempotency)

## Event Idempotency

Now we've discussed API idempotency, which is a great start. But what happens when we get multiple of the same events inside our event driven system. This could happen when ingesting webhooks from a third party or when replaying events through the system for example.

You could handle this in multiple ways inside your system.
You could for example store the event in a cache or database, and check to see if the event has already been seen, if it has then don't emit any other events further down your system.
You could also ensure any databases or integrations perform upserts or HTTP PUT requests so that it doesn't matter how many times you receive the requests.

## Summary

In summary, we've seen why you may want to make your system idempotent and some methods to ensure your systems, both API and Event Driven, can be made idempotent.

Idempotency is really important in systems, but it can be a challenge to implement and must be a consideration when designing your systems.
