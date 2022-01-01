---
title: 5 things to consider when Designing Event Driven Systems
summary: Event driven systems are becoming ever more popular and integral part of our modern lives. Event driven systems consume and take action based on events, these systems also emit and define the events.
topics: events, architecture, event driven, software design
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

Event driven systems are becoming ever more popular and integral part of our modern lives.

Event driven systems consume and take action based on events, these systems also emit and define the events.

This allows for you to loosely couple your services in the system allowing each service to be developed faster, independently and reduce complexity as each service is only responsible for a single thing, normally a domain or entity.
For example Twitter could have domain for users, lists, bookmarks etc.

Each of these services is responsible for a single domain even though lists are made up of users for example, they remain independent and follow [the principle of single responsibility](https://en.wikipedia.org/wiki/Single-responsibility_principle).

In this example you could have teams independently developing the list and user services, which means those services could be developed faster and focus on features for each rather than having them rely on each other.

The bookmark service could for example take action on a `tweet-bookmarked` event and store the reference to the tweet that a user bookmarked so that user can view a list of them later. It could also define and emit it's own events too!

These events are published to a queue or bus, which can be subscribed or listened too by multiple subscribers and services. Often referred to as [pub/sub pattern](https://aws.amazon.com/pub-sub-messaging/).

Event driven systems are great as the events logically make sense, in the systems we interact with everyday, when you start to model them.

However they come with plenty of things to think about. How to model your events, and what events to emit and how to separate your services. These are fundamental to the design of your event driven system.

On top of this there are a few key things that you need to consider when designing event driven systems.

## Idempotent Nature

Idempotent means that multiple events being received have the same result every time.

Event driven systems need to be designed and programmed in an idempotent nature as there is no guarantee events will only be received once. Imagine for instance that your system receives [webhooks](https://zapier.com/blog/what-are-webhooks/) from a third party that notifies you of events, this is a very common pattern for event driven systems.

With webhooks there is no guarantee that you will only get one webhook received, it can happen for a number of reasons I won't go into now.
Likewise you will often want events to be replayed incase of a system failure.

If this happens your system needs to be able to handle it and ensure the same result occurs no matter how many times the event is received. It would be no good if you ended up creating two orders instead of a single one due to receiving an order event twice.

This means that your storage solutions and business logic needs factor this in when being built. For example using UPSERT rather than INSERT into a database so that events are updated if they already exist rather than inserted twice. Ensuring the business logic has the same output every time an event is put through it, regardless of the datetime or number of times an event has been seen.

There's so much more to think about and detail when considering idempotency in systems, but hopefully this gives you a starting point to consider it.

## Data structure and storage

We touched on it in the previous section but data is at the heart of any event driven system, so it crucial to consider it when designing your systems.

One of the first things to consider is the structure of your events, as we talked about previously your events shouldn't be stateful. For example they shouldn't have properties that depend on other events occurring and store state.

One of the first thing to consider is how are you planning on structuring your events, a common pattern is to have an event wrapper that contains metadata about an event around the data of the event itself. Below is [an example from AWS](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events.html)

```json
{
  "version": "0",
  "id": "6a7e8feb-b491-4cf7-a9f1-bf3703467718",
  "detail-type": "EC2 Instance State-change Notification",
  "source": "aws.ec2",
  "account": "111122223333",
  "time": "2017-12-22T18:43:48Z",
  "region": "us-west-1",
  "resources": [
    "arn:aws:ec2:us-west-1:123456789012:instance/i-1234567890abcdef0"
  ],
  "detail": {
    "instance-id": " i-1234567890abcdef0",
    "state": "terminated"
  }
}
```

Where detail contains the body of the event, the other top level properties cover off the metadata around the event. You can also see it contains a version property which we'll talk about later.

The next thing to consider is how will you be storing your events and data?

Are you going to use an [event sourcing pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing) and store all your events and build up views of the data either as the events are stored or at read time. Or will your database be your view of the world and be the state of your system. Remembering of course this must handle receiving events possibly multiple times and out of order.

As there will be possible significant number of events to be stored you will need to consider the storage solution carefully as well.

## APIs

You event driven system will likely include APIs to both access and affect the data held within it.

The first thing to remember is you are working with a system with eventual consistency, so any time sensitive events need to be carefully considered. No matter how fast you make your system there will be occurrences where an event isn't processes 'in time'.

If you have a user interface (UI) displaying these events or data resulting from these events you could use an optimistic UI, for example if an tweet is bookmarked the UI could add the tweet to the bookmarked list on the device (client) side before waiting to get the list from the backend as it may not be processed in time.

You could also consider how you are handling events, for example you could use an API which synchronously updates the bookmarked database and then emits an event to other systems with a `tweet-bookmarked` event for example. This ensures that your data store is up to date and ready for UIs to display the information when they call to get it but you still have other event driven options.

When designing your API for an event driven system you also need to consider what methods you use and how you design your API, for example POST methods don't behave in an idempotent nature as they create something new each time. Whereas PUT methods do as its specific to an ID. [This is a really straightforward article covering off idempotent HTTP methods](https://restfulapi.net/idempotent-rest-apis/).

Depending how you are ensuring idempotency in your system e.g. constructing an ID consistently you might be able to still use a POST method and dedupe on the constructed ID, this doesn't truly follow HTTP specification but may be more pragmatic for your use case.

## Versioning

Alongside considering your [Data structure](#data) and [APIs](#apis), we need to consider how to version them. Now I'm not really going to talk about versioning your API's here as there are plenty of articles about this but I am going talk to versioning your events.

You will need to change and version your events inevitably, however when you do there is more to think about in an event driven system.

The first thing to consider is how will your systems determine what version of event they are receiving. You can make all your events backwards compatible however this can be really tricky in the future.

You can also [include a version field on your event. E.g. how the Eventbridge team at AWS does](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events.html). You can then use this version in your downstream systems to correctly handle that version of your event.

When you need to update an event, you should consider the changes you need to make to your event, once happy with the new version of your event schema. You need to ensure you work backwards, up stream, towards the producer of the events.

Making changes to all these downstream services so they can handle both versions of your events will make the change over much smoother as each can then be deployed independently and remove any possible downtime as events could still be in transit with the old version when releasing the services.

Once that has been completed you can swap over to your new event version in the producer of the event.

You then need to decide if and how you are going to deprecate the previous event version.

This needs real thought if you are intend to store and replay events through a system.

## Reconciliation

We spoke earlier about receiving webhooks from a third party, a common pattern in event driven systems. We also spoke about if they are delivered more than once, but what happens if they are delivered at all?

We need to consider fault tolerance in your event driven system and reconciliation plays a large part here.

If we are dealing with third parties outside of our control we need to reconcile the state they are in as we may have not either received or delivered events. Ideally you should ensure your system is fault tolerant enough to always deliver to third parties and retry or handle any failures but this might be hard initially, so a good fallback is reconciliation.

Normally reconciliation jobs are run on a time schedule e.g. a common usage is every night at midnight to get all the items from a third party and check your system to ensure we have received them all, if not push the correct events through the system. I would try to reconcile each domain or entity of your system independently, although depending on the third party, you may have to be flexible with this.

You could similarly do the same with a system you are delivering to and check everything is as expected.

Although with all event driven systems you have levels of [eventual consistency](https://en.wikipedia.org/wiki/Eventual_consistency), where you cannot guarantee at what point in time the system is up to date, reconciliation gives you a tighter timeframe on when you can be confident that your system is correct.

## Summary

Event driven systems can be really powerful, scalable and solve many business problems. However all the benefits don't come without responsibility and plenty of considerations when designing them.

I'd love to hear any other tips or things you'd had to consider when designing or building event driven systems!

Happy event-ing!
