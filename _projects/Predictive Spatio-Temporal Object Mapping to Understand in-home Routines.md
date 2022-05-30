---
layout: post
title:  "Objects as a lens to understanding daily Routines"
date:   2021-11-05 10:00:40
blurb: "Assistive robots need to understand users' daily lives to assist the user proactively. The seemingly simple concept of a daily routines is a tricky one for a robotic agent to understand due to lack of a semantic understanding of the concepts involved. We take a stab at this problem through a novel object-centric perspective."
og_image: /assets/img/projects/PSTOM/routine.jpg
draft: False
---

<img src="{{ "/assets/img/projects/PSTOM/routine.jpg" | absolute_url }}" alt="bay" class="post-pic"/>
<br />
<br />

With the elderly forming an increasing fraction of our society, robots have the potential to shoulder some of this rising care-giving burden, and also boost a sense of self-sufficiency amongst the users, enabling elders to live in their
homes independently for longer. Research suggests that elders and people suffering from mild cognitive impairments prefer proactivity from assistive agents. Unfortunately, robot assistants require exact goal or task descriptions, and can proactively assist only the user's ongoing activity. To enable proactivity in assistance at a larger scale, we propose a novel perspective which can help these robots understand their user's lives and needs better.

<br />
<br />

#### OUR PERSPECTIVE

In order to assist people proactively with their daily lives, the robot needs to understand their daily routines. People's routines are composed of a sequence of activities which affect the objects around them, in the form of location and state changes, which a robot can observe. We hypothesize that the patterns in people's routines is reflected in the dynamics of the objects, and learning patterns in these dynamics can help an assistive agent be more proactive.

<br />
<br />

#### PROGRESS SO FAR...

We explored this object-centric perspective to proactive assistance through our work on ['Understanding In-Home Routines Through Spatio-Temporal Object Tracking for Proactiove Assistance'](https://www.iri.upc.edu/workshops/pred-ant-hri/files/papers/PAR-HRI22_paper_8824_pp.pdf). The results show that a predictive model that learns patterns in object movements, based only on object location observations, can predict expected changes in object locations, which can directly be used to assist the user. Following the success of this work, we aim to continue working towards enabling an assistive robot to represent the semantic concepts of objects, actions and how they participate in the user's lives, towards better and more transparent proactive assistance.
