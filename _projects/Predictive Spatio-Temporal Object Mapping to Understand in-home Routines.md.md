---
layout: post
title:  "Spatio-Temporal Object Mapping to Understand In-home Routines"
date:   2021-11-05 10:00:40
blurb: "Between the symbols that machines can manipulate and the fuzziness of the real world lies a 'semantic gap'. Whilst it doesn't bear a unified definition, we target a form of it by modeling daily routines. The simple reasoning being that to proactively assist a human through their daily life, a robot must first understand their daily life."
og_image: /assets/img/projects/PSTOM/routine.jpg
---

<img src="{{ "/assets/img/projects/PSTOM/routine.jpg" | absolute_url }}" alt="bay" class="post-pic"/>
<br />
<br />

<!-- I recently started this research effort towards Predictive Spatio-Temporal Semantic Mapping of household objects. Once the five words have had the time to sink in, allow me to explain why we would want to do such a thing and how we can go about thinking through the problem! -->

People's routine activities in spaces like their homes alter the locations and states of the objects around them in a stochastic manner, but there is some underlying pattern which we humans naturally understand. We notice these patterns, especially the disruption of them. For instance, seeing a thick coat out in a Texas summer or seeing coffee out at night will feel out of place. Moreover, if you knew your friend to prefer eggs for breakfast and to hate pancakes, seeing pancake batter out on their kitchen counter in the morning will also raise flags in your mind. The fact that that sense does not currently exist for robots alludes to a semantic gap in understanding human routines and the role of objects therein. As portrayed in my examples, this depends on the objects themselves as well as follows some temporal patterns and is even affected by specific user preferences.

The object locations and states resulting from a person's routine will be our lens to understanding their routine. The idea is to spatio-temporally model these objects and learn the patterns therein to be able to predict them at a future time. We hypothesize that the daily, weekly, monthly, etc. periodicity in routines is a major predictor of the temporal patterns in our behavior and hence in these object states. Therefore, in addition to the static rules and preferences, we aim to capture temporal context in our work.

<br />
<br />

#### RELATED RESEARCH

The fields of semantic and human activity understanding have recently gotten significant attention from researchers. Semantic mapping, an offshoot of SLAM, has thrived with great results on accurate metric maps annotated with semantic labels with methods like [3D Dynamic Scene Graphs](https://arxiv.org/abs/2002.06289). These however offer a shallower semantic understanding of these objects than what our goals require. 

Activity recognition through Computer Vision has shown success in detecting the activity from images and videos. [Motion prediction](https://arxiv.org/abs/1811.00233) for applications like collision avoidance, predicting future video frames for [capturing Newtonian dynamics](https://openaccess.thecvf.com/content_cvpr_2016/html/Mottaghi_Newtonian_Scene_Understanding_CVPR_2016_paper.html), and [predicting intents](https://link.springer.com/article/10.1007/s11263-019-01234-9) for next action have been studied. These do not use context outside of the image frame, which is done by some work on [context-aware activity recognition](https://onlinelibrary.wiley.com/doi/abs/10.1111/exsy.12481) but it deals only with recognition without a predictive component. These activity recognition and prediction methods are not grounded in objects which is necessary to enable assistance. This work on [reactive assistance](https://ieeexplore.ieee.org/document/7102751) aims to ground actions in objects towards assistance but is only reactive. In addition, all of these methods work over time horizons of minutes, if not seconds, while we intend to predict high-level activity routines over days and months.

Since we propose using object locations and states as a reflection of the routines, we would be remiss not to mention work on object location modelling and prediction. Predictive models for objects include [temporal persistence](https://ieeexplore.ieee.org/document/7989365) to model when an object ceases to be in it's last known location, and frequency analysis based [FreMEn](https://ieeexplore.ieee.org/abstract/document/7878680) which analyzes periodic changes and has been used to model [object locations](https://ieeexplore.ieee.org/document/7139481) and even [human presence](https://ieeexplore.ieee.org/document/8793534). While these models predict object dynamics in time, they do not take into account any semantic information or inter-object relationships. [SLiM](https://www.researchgate.net/publication/342352465_Semantic_Linking_Maps_for_Active_Visual_Object_Search) and [COS-POMDP](https://arxiv.org/abs/2110.09991) use semantic knowledge in the form of object co-occurences to guide object search. These methods however use basic or no predictive models; a simple temporal coherence model wherein probabilities over spatial location of objects diffuses farther in space as time passes is used in SLiM to model dynamic objects. With our system, we aim to create a temporal predictive model of joint state dynamics over all objects in the house, which can learn from data obtained from people's routines.

<!-- Understanding object layouts and associated preferences, and attaining them have recently emerged as a research area under the umbrella of object rearrangement... Work on [learning user preferences for object layout](https://openreview.net/forum?id=Ei3MOY2rDHB) towards arranging them to fit the user...  -->

<br />
<br />

#### OUR PERSPECTIVE ON THE PROBLEM

Recently scene graphs have been used as a natural way of expressing semantic objects and spatial (topological) relations between them. The following portray some examples of scene graphs

<img src="{{ "/assets/img/projects/PSTOM/scene_graph_1.png" | absolute_url }}" alt="SceneGraph1" width="550" class="post-pic-internal"/>
Kim et al. [^1]

<img src="{{ "/assets/img/projects/PSTOM/scene_graph_2.png" | absolute_url }}" alt="SceneGraph2" width="550" class="post-pic-internal"/>
Liu et al. [^2]

We intend to adopt this representation to express objects in the house at a given time as a scene graph. We formuate the temporal learning problem over such a scene graph as that of conditional graph translation, i.e. that of producing a graph, given a graph and conditioned on a context. For our problem, the given graph is the scene graph at a past/present time, and we want to infer one at future time from that conditioned on a context which encodes information about the times, and possibly even about human preferences and any human activity that we may know about.

As a first step to testing the viability of this approach, we plan on adopting a neural network based graph translation framework called [NEC_DGT](https://ieeexplore.ieee.org/document/8970898) which shows promising results on synthetic data and small molecular and cyber-networks. We would adapt this method for our problem of predicting the scene graph representation of the scene at a query time, given the scene graph at a prior time, with the context being a function of the query and prior timestamps.

<br />
<br />

##### REFERENCES

[^1]: Kim, Ue-Hwan, et al. "3-d scene graph: A sparse and semantic representation of physical environments for intelligent agents." IEEE transactions on cybernetics 50.12 (2019): 4921-4933.
[^2]: Liu, Tianqiang, et al. "Creating consistent scene graphs using a probabilistic grammar." ACM Transactions on Graphics (TOG) 33.6 (2014): 1-12.
