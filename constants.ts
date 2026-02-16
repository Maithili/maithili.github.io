
import { Project, Publication, Update } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'soft-gripper',
    title: 'Soft Gripper Control',
    category: ['Soft Robotics', 'Python'],
    description: 'Developing pneumatically-actuated grippers with embedded flex sensors for delicate material handling.',
    image: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=800',
    fullOverview: 'This research focuses on the development of advanced control algorithms for soft pneumatic actuators. The primary challenge lies in the non-linear deformation of elastomeric materials, which complicates traditional rigid-body kinematic modeling. By treating the actuator as a continuum robot, we developed a series of differential equations that better predict tip position under variable pressure loads.',
    motivation: 'Industrial manipulation has long relied on stiff, high-torque actuators that prioritize position accuracy over interaction safety. However, these systems fail catastrophically when encountering unmodeled obstacles or fragile goods.',
    motivationQuote: 'Traditional rigid robots struggle with the infinite degrees of freedom present in the real world. To truly interact with our environment, machines must learn to yield.',
    benchmarks: [
      { label: 'Grasping Stability (Standard)', value: 0.62 },
      { label: 'Grasping Stability (Ours)', value: 0.88, improvement: '+42% Improvement over baseline' }
    ],
    contributions: [
      {
        icon: 'settings_input_component',
        title: 'Hardware-Software Co-Design',
        description: 'Engineered a custom multi-chamber pneumatic manifold that reduces response latency by 120ms.'
      },
      {
        icon: 'psychology',
        title: 'Tactile ML Model',
        description: 'Developed a lightweight neural network for slip detection that runs directly on an ESP32.'
      }
    ],
    citations: [
      {
        label: 'ICRA 2023',
        bibtex: `@inproceedings{softgrasp2023,\n  title={Dynamic Grasping of Fragile Objects},\n  author={Patel, M. and Smith, J.},\n  booktitle={ICRA 2023},\n  year={2023}\n}`
      }
    ]
  },
  {
    id: 'hri-interface',
    title: 'HRI Interface Design',
    category: ['HRI', 'Unity'],
    description: 'Optimizing AR interfaces for collaborative manufacturing tasks between workers and cobots.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    fullOverview: 'Collaborative robotics (cobots) are transforming manufacturing, yet worker trust remains a significant bottleneck. This project explores how Augmented Reality (AR) can visualize a robot\'s internal state—such as its planned trajectory and speed—to reduce worker anxiety and improve hand-over efficiency.',
    motivation: 'Humans feel unsafe when robot movements are unpredictable. AR provides a "digital leash" that communicates intent before physical movement occurs.',
    motivationQuote: 'Transparency is the foundation of trust in any partnership, human or machine.',
    benchmarks: [
      { label: 'Worker Task Fluency', value: 0.55 },
      { label: 'With AR Visualization', value: 0.78, improvement: '+23% Task Throughput' }
    ],
    contributions: [
      {
        icon: 'visibility',
        title: 'Predictive Pathing',
        description: 'Real-time holographic projection of future joint states on Microsoft HoloLens 2.'
      },
      {
        icon: 'groups',
        title: 'User Study (N=40)',
        description: 'Conducted a large-scale qualitative study measuring cognitive load and trust metrics.'
      }
    ],
    citations: [
      {
        label: 'RO-MAN 2023',
        bibtex: `@inproceedings{hritrust2023,\n  title={Visualizing Robot Intent via AR},\n  author={Patel, M. and Yamaguchi, K.},\n  booktitle={RO-MAN 2023},\n  year={2023}\n}`
      }
    ]
  },
  {
    id: 'adaptive-exoskeleton',
    title: 'Adaptive Exoskeleton Loop',
    category: ['AI', 'PyTorch'],
    description: 'Real-time adaptation of motor torque based on gait-phase prediction using LSTM networks.',
    image: 'https://images.unsplash.com/photo-1517433447755-d1dd91139a0c?auto=format&fit=crop&q=80&w=800',
    fullOverview: 'Lower-limb exoskeletons often impose a fixed rhythm on the wearer, which can lead to fatigue or falls if the user changes their walking speed. We developed a closed-loop controller that uses LSTM-based gait phase prediction to modulate motor assistance in real-time.',
    motivation: 'Current gait assistance relies on rigid state-machines. We need fluid, bio-inspired adaptation for real-world terrain navigation.',
    motivationQuote: 'The machine should assist the human, not force them into a pre-defined pattern.',
    benchmarks: [
      { label: 'Phase Error (Heuristics)', value: 0.45 },
      { label: 'Phase Error (Ours)', value: 0.92, improvement: '-50% RMS Error in prediction' }
    ],
    contributions: [
      {
        icon: 'memory',
        title: 'LSTM Architecture',
        description: 'Custom lightweight recurrent network optimized for sub-5ms inference on embedded hardware.'
      },
      {
        icon: 'directions_walk',
        title: 'Torque Modulation',
        description: 'Adaptive impedance control scheme that yields to user-initiated velocity changes.'
      }
    ],
    citations: [
      {
        label: 'Journal of Soft Robotics',
        bibtex: `@article{exogait2023,\n  title={LSTM-based Gait Phase Prediction for Exoskeletons},\n  author={Smith, J. and Patel, M.},\n  journal={Journal of Soft Robotics},\n  year={2023}\n}`
      }
    ]
  }
];

export const PUBLICATIONS: Publication[] = [
  {
    id: 'adapt',
    title: 'ADAPT: Actively Discovering and Adapting to Preferences for any Task',
    authors: 'Maithili Patel, Xavier Puig, Ruta Desai, Roozbeh Mottaghi, Sonia Chernova, Joanne Truong, Akshara Rai',
    venue: 'Conference on Language Modeling (COLM), 2025',
    year: '2025',
    pdf: 'https://openreview.net/pdf?id=Z8vtD1egtI',
  },
  {
    id: 'disamb',
    title: 'A Model-Agnostic Approach for Semantically Driven Disambiguation in Human-Robot Interaction',
    authors: 'Fethiye Irmak Dogan, Maithili Patel, Weiyu Liu, Iolanda Leite, Sonia Chernova',
    venue: 'IEEE Robot and Human Interactive Communication (RO-MAN), 2025',
    year: '2025',
    pdf: 'https://arxiv.org/pdf/2409.17004',
  },
  {
    id: 'taaco',
    title: 'Robot Behavior Personalization from Sparse User Feedback',
    authors: 'Maithili Patel, Sonia Chernova',
    venue: 'IEEE Robotics and Automation Letters (RAL), 2025',
    year: '2025',
    pdf: 'https://ieeexplore.ieee.org/document/10924711',
    vid: 'https://youtu.be/bFqubhycs-c',
  },
  {
    id: 'corl23',
    title: 'Predicting Routine Object Usage for Proactive Robot Assistance',
    authors: 'Maithili Patel, Aswin Prakash, Sonia Chernova',
    venue: 'Conference on Robot Learning (CoRL), 2023',
    year: '2023',
    pdf: 'https://openreview.net/pdf?id=rvh0vkwKUM',
    vid: 'https://youtu.be/zLlyM20Bi_8',
  },
  {
    id: 'corl22',
    title: 'Proactive Robot Assistance via Spatio Temporal Object Tracking',
    authors: 'Maithili Patel, Sonia Chernova',
    venue: 'Conference on Robot Learning (CoRL), 2022',
    year: '2022',
    pdf: 'https://openreview.net/pdf?id=th7GW868Pok',
    vid: 'https://youtu.be/p79IAyvnOuY',
  },
  {
    id: 'survey',
    title: 'A Survey of Semantic Reasoning Frameworks for Robotic Systems',
    authors: 'Weiyu Liu*, Angel Daruna*, Maithili Patel^, Kartik Ramachandruni^, Sonia Chernova',
    venue: 'Robotics and Autonomous Systems (RAS) Journal, 2022',
    year: '2022',
    pdf: '/assets/papers/A_Survey_of_Semantic_Reasoning_Frameworks_for_Robotic_Systems.pdf',
  },
  {
    id: 'icra22ws',
    title: 'Understanding In-home Routines through Spatio-temporal Object Tracking for Proactive Assistance',
    authors: 'Maithili Patel, Sonia Chernova',
    venue: 'ICRA 2022 Workshop - Prediction and Anticipation Reasoning in Human Robot Interaction',
    year: '2022',
    pdf: '/assets/papers/PAR-HRI22_paper_8824_pp.pdf',
  },
];

export const UPDATES: Update[] = [
  { date: 'Jan 2026', title: '', description: 'Served as Area Chair for Late Breaking Reports at the ACM/IEEE International Conference on Human Robot Interaction (HRI), 2026.' },
  { date: 'Aug 2025', title: '', description: 'Presented my work "Robot Behavior Personalization From Sparse User Feedback" at IEEE-ROMAN, Netherlands.' },
  { date: 'Jun 2025', title: '', description: 'I successfully proposed my thesis titled "Proactivity and Personalization in Longitudinal Robotic Assistance".' },
  { date: 'May 2025', title: '', description: 'Served as Student Volunteer for IEEE International Conference on Robotics and Automation (ICRA), 2025.' },
  { date: 'Feb 2025', title: '', description: 'Our paper <a href="https://ieeexplore.ieee.org/document/10924711" target="_blank" rel="noopener noreferrer"><b>Robot Behavior Personalization From Sparse User Feedback</b></a> was accepted at IEEE-Robotics and Automation Letters RAL.' },
  { date: 'Jan 2025', title: '', description: 'Served as an Area Chair for Late Breaking Reports at the International Conference on Human Robot Interaction (HRI), 2025.' },
  { date: 'Oct 2024', title: '', description: 'Selected to participate in the Doctoral Consortium at the <a href="https://rcais.github.io/" target="_blank" rel="noopener noreferrer">Summit on Responsible Computing, AI, and Society</a>.' },
  { date: 'Oct 2024', title: '', description: 'Gave an invited talk at the <a href="https://edmws.github.io/" target="_blank" rel="noopener noreferrer">Environment Dynamics Matters</a> workshop at IROS, 2024, Abu Dhabi.' },
  { date: 'Apr 2024', title: '', description: 'Was awarded a fellowship from the Georgia Robotics Fellowship program, funded by the College of Computing at GeorgiaTech.' },
  { date: 'Nov 2023', title: '', description: 'Helped organize Conference on Robot Learning, 2023 in Atlanta, as a Student Volunteer Coordinator.' },
  { date: 'Aug 2023', title: '', description: 'Our paper <a href="https://openreview.net/forum?id=rvh0vkwKUM" target="_blank" rel="noopener noreferrer"><b>Predicting Routine Object Usage for Proactive Robot Assistance</b></a> was accepted at Conference on Robot Learning, 2023.' },
  { date: 'Mar 2023', title: '', description: 'Co-organized the <a href="https://sites.google.com/view/semanticsforhri/?pli=1" target="_blank" rel="noopener noreferrer"><b>Semantic Scene Understanding for Human Robot Interaction</b></a> workshop at the ACM/IEEE International Conference on Human Robot Interaction (HRI), 2023.' },
  { date: 'Dec 2022', title: '', description: 'My research on "Longitudinal Proactive Robot Assistance" has been accepted for inclusion in the <a href="https://hripioneers.org" target="_blank" rel="noopener noreferrer"><b>HRI Pioneers 2023</b></a> Workshop.' },
  { date: 'Oct 2022', title: '', description: 'Our paper <a href="https://doi.org/10.1016/j.robot.2022.104294" target="_blank" rel="noopener noreferrer"><b>A survey of semantic reasoning frameworks for robotic systems</b></a> is available online and will be published at the Robotics and Autonomous Systems (RAS) journal.' },
  { date: 'Sep 2022', title: '', description: 'Selected to participate in the 2022 class of <a href="https://research.google/outreach/csrmp/" target="_blank" rel="noopener noreferrer"><b>Google CS Research Mentorship Program</b></a>.' },
  { date: 'Sep 2022', title: '', description: 'Our paper <a href="https://openreview.net/forum?id=th7GW868Pok" target="_blank" rel="noopener noreferrer"><b>Proactive Robot Assistance via Spatio-Temporal Object Modeling</b></a> got accepted at Conference on Robot Learning, 2022.' },
  { date: 'Jun 2022', title: '', description: 'Attended <a href="https://www.summer-school.rpl.eecs.kth.se" target="_blank" rel="noopener noreferrer"><b>Summer School organized by KTH Royal University</b></a> in Stockholm, Sweden. Wonderfully organized event fostering networking and collaboration with robotics researchers across the globe.' },
  { date: 'May 2022', title: '', description: 'Presented our work on <a href="https://www.iri.upc.edu/workshops/pred-ant-hri/files/papers/PAR-HRI22_paper_8824_pp.pdf" target="_blank" rel="noopener noreferrer"><b>Understanding In-home Routines through Spatio-temporal Object Tracking for Proactive Assistance</b></a> at <a href="https://www.iri.upc.edu/workshops/pred-ant-hri/index.html" target="_blank" rel="noopener noreferrer">PAR-HRI workshop</a> at ICRA in Philadelphia.' },
];
