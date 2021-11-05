---
layout: post
title:  "Motion Potential RRT for Motion Planning"
date:   2020-12-01 10:00:40
blurb: "This work proposes gradient descent on artificial potential fields as a steer function in RRT and it's variants. This provides superior obstacle clearance with no compromise on the runtime performance against straight-line steer on RRT, RRT-connect and RRT*."
og_image: /assets/img/projects/MP-RRT/project_mprrt.jpeg
category: "projects"
---

<img src="{{ "/assets/img/projects/MP-RRT/project_mprrt.jpeg" | absolute_url }}" alt="MP-RRT" class="post-pic"/>
<br />
<br />

Motion planning in robotics, as the problem of finding a path from a specified start state to an end state without colliding with obstacles, is necessary for navigation as well as manipulation. Robots would be deployed in several real world environments where they need to work alongside humans. In such applications, in addition to being feasible, the paths for navigation and manipulation need to be safe and stay adequately away from obstacles.

Sampling-based planners like RRTs have been largely adopted as the practical solution to planning problems, especially in higher-dimensional spaces, due to their efficiency. But the paths they create lack a consideration of path quality. Owing to this, a lot of work has focused on post-processing paths obtained from RRT and its variants to enhance path quality, like utilizing splines to smoothen the obtained path, and using elastic band approach to improve optimality. Optimization methods like CHOMP can be used for such a trade-off, but the path is not guaranteed to be feasible. Our proposed method allows us to find such paths by taking into account potentials during the sampling-based planning, and also obviates the extra costs that come with post-processing methods.

<br />


#### Table of Contents
1. [MP-RRT Algorithm](#mp-rrt-algorithm)
    * [Motion Potential](#motion-potential)
    * [MP-RRT](#MP-RRT)
2. [Experiments](#experiments)
    * [Obstacle Clearance](#obstacle-clearance)
    * [Time Complexity](#time-complexity)
3. [Final Thoughts](#final-thoughts)

#### MP-RRT Algorithm
In MP-RRT, we propose to modify the steer function to account for obstacles by gradient descent on artificial potential fields. This concept involves repulsive potentials corresponding to obstacles and attractive potential corresponding to the target. The robot can be thought of as moving under the influence of the resulting force field. Using this force field as the steer function gives us benefits of larger obstacle clearance and better probability of a successful extension, compared to the original straight-line steer function. This method allows us to find such paths by taking into account potentials during the sampling-based planning, and also obviates the extra costs that come with post-processing methods. 

<br />

##### MOTION POTENTIAL
The motion potential comprises of two components: 
* Repulsive potential fields created by obstacles, which falls off as we move away from obstacles, and
* Attractive potential field created by a target point, which is proportional to the distance from the goal
<br />

##### MP-RRT
The vanilla RRT algorithm samples a random point in free space and uses a *steer* function to drive towards it. This function, typically a straight line step, is replaced by a step under the influence of the motion potentials in our MP-RRT algorithm. We also experiment with variants of RRT, namely RRT-connect and RRT\*, wherein we replace the *connect* and *rewire* functions with our motion-potential based counterparts.
<br />


#### EXPERIMENTS
We implemented MP-RRT, as well as the connect and star variants in C++ using OpenRAVE for visualization, and compared it against the vanilla versions of these. We tested these on four mazes shown below.

<img src="{{ "/assets/img/projects/MP-RRT/mazes.png" | absolute_url }}" alt="mazes" width="250" class="post-pic-internal"/>

<br />

##### OBSTACLE CLEARANCE
Obstacle clearance of MP-RRT is by design better than the baseline RRT variants. We compared the performance of MP-RRT and RRT (with variants) on the four maze worlds; means and individual results from each run is plotted below

<img src="{{ "/assets/img/projects/MP-RRT/ObstacleResults.png" | absolute_url }}" alt="times" class="post-pic-internal"/>

It is evident how MP-RRT stays away from obstacles on average and also in the worst case, especially in tight areas where the path must pass closer to obstacles. Moreover, the 'NarrowMaze' world is a good example of how even though MP-RRT stays away from obstacles most of the time, it can also find paths through the narrow passages, when there isn't another alternative. A planner with hard clearance bounds would fail in such narrow passage scenarios.
<br />

##### TIME COMPLEXITY
The run-time performance of the MP variants against the baselines on the four maze worlds was found to be comparable. The performance of MP-variants of each of the RRT, RRT-connect and RRT* for individual runs as well as the average is plotted below.

<img src="{{ "/assets/img/projects/MP-RRT/MazeTimes.png" | absolute_url }}" alt="times" class="post-pic-internal" width="300"/>

<br />

#### FINAL THOUGHTS
Potential fields are a time-tested concept to manage soft constraints like 'good' obstacle clearance that we dealt with here. The obstacle clearance improvements were hence by design. However some time gains were observed (more so on random worlds than the shown mazes), and that deserves some discussion, as it is not straightforward why that would happen. We did expect this method to allow for more successful extensions and connections as these functions are more obstacle-aware. This also grows the tree in a more focused fashion, requiring a smaller tree to achieve the goal. Since the slowest step in RRTs is the nearest neighbor search which in-turn  depends on the tree size, this plays a part in time efficiency.

Similar concepts have been studied for safety under the name Kinetostatic Danger Fields, which create dynamic fields taking into accout positions and velocities. This concept proposed by [Kinetostatic Danger Field - a Novel Safety Assessment for Human-Robot Interaction](https://www.researchgate.net/publication/224199154_Kinetostatic_danger_field_-_A_novel_safety_assessment_for_human-robot_interaction)
proposes to create danger fields around the robot rather than the obstacles, which allows them to take into account the robot velocities to skew the fields to have a higher value towards where the robot is moving. In essence this is very similar to what we did here, and probably leaves with similar effects as this one if the velocities are disregarded. In a later work they propose to use their idea of Kinetostatic Danger Fields as a steer function for the RRTs.
<br />
