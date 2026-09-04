/* KWanus University — the curriculum and the exam bank.
   Pure data. No DOM, no state, no behaviour: edit this file to change what
   the university teaches or tests, without touching app.js. */
"use strict";

/* ---------- program shape: 4 academic years inside one calendar year ----------
 * Twelve four-week cycles rather than calendar months. 12 x 28 = 336 days, and
 * the 24-day stagger across five courses puts the last deadline at day 360 —
 * inside one year, which calendar months (390 days) could not manage.
 * Four weeks per unit also lines the exams up exactly with the homework weeks. */
const PROGRAM={units:12,unitsPerYear:3,years:4,pass:80,qPerExam:10,
  cycleDays:28,staggerDays:6};
const YEAR_NAMES=['Year One','Year Two','Year Three','Year Four'];
const yearOfUnit=u=>Math.ceil(u/PROGRAM.unitsPerYear);

/* ---------- curriculum ---------- */
const CURRICULUM=[
 {id:'code',kind:'Major',short:'Software Engineering',name:'Software Engineering & Web Design',
  school:'freeCodeCamp · The Odin Project · Harvard CS50 · MIT OCW',
  watch:[
   ['freeCodeCamp — full-length video courses','https://www.youtube.com/@freecodecamp'],
   ['Harvard CS50 — filmed lectures','https://www.youtube.com/@cs50'],
   ['Traversy Media — build-along projects','https://www.youtube.com/@TraversyMedia'],
   ['Fireship — visual explainers in 100 seconds','https://www.youtube.com/@Fireship']
  ],
  links:[
   ['freeCodeCamp — full curriculum','https://www.freecodecamp.org/learn/'],
   ['The Odin Project — Full Stack JavaScript','https://www.theodinproject.com/paths/full-stack-javascript'],
   ['Harvard CS50x','https://cs50.harvard.edu/x/'],
   ['MDN Web Docs — the reference you keep open','https://developer.mozilla.org/en-US/docs/Web'],
   ['MIT 6.006 — Introduction to Algorithms','https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/']
  ],
  units:[
   {n:1,name:'HTML, CSS & the Box Model',focus:'Document semantics, the cascade, specificity, box model, flexbox and grid.',
    work:['Finish the freeCodeCamp Responsive Web Design projects end to end.','Rebuild one page you admire from screenshot only — no inspecting.','Write out the specificity rules from memory, then check them against MDN.']},
   {n:2,name:'JavaScript Fundamentals',focus:'Types and coercion, scope and closures, arrays and objects, pure functions.',
    work:['CS50 Week 0–1 plus the freeCodeCamp JavaScript Algorithms section.','Solve 30 array/string exercises without looking up syntax.','Explain closures in writing to someone who does not code.']},
   {n:3,name:'The DOM, Events & Async',focus:'DOM traversal, event delegation, the event loop, promises, fetch and error handling.',
    work:['Rebuild this registrar site from memory, then diff it against the source.','Build a small app that fetches a public API and handles the failure case.','Trace the event loop on paper for a mixed sync/promise/timeout snippet.']},
   {n:4,name:'Data Structures',focus:'Arrays, hash maps, stacks, queues, linked lists, trees and when each is correct.',
    work:['Implement each structure from scratch, no library.','Solve 25 problems that force a specific structure.','Write down the access, search, insert and delete cost of each.']},
   {n:5,name:'Algorithms & Complexity',focus:'Big-O analysis, sorting, searching, recursion, greedy and dynamic programming.',
    work:['MIT 6.006 lectures 1–6 with the problem sets.','Hand-trace merge sort and quicksort on an eight-element array.','Solve 20 problems and state the complexity of each solution before coding.']},
   {n:6,name:'Tooling, Git & Testing',focus:'Version control, branching, code review, unit tests, debugging and the terminal.',
    work:['Put every project you own under Git with real commit messages.','Write tests for the grading logic on this site until they catch a bug.','Learn the debugger. Delete every console.log you were using instead.']},
   {n:7,name:'Servers, HTTP & REST APIs',focus:'The request lifecycle, status codes, Node, routing, JSON APIs and statelessness.',
    work:['Build a REST API with full create, read, update and delete.','Explain what happens between typing a URL and seeing pixels.','Consume your own API from a separate front end.']},
   {n:8,name:'Databases & SQL',focus:'Relational modelling, normalisation, joins, indexes, transactions and migrations.',
    work:['Model this university as a real relational schema.','Write 30 queries including multi-table joins and aggregates.','Add an index and measure the difference on a large table.']},
   {n:9,name:'Authentication & Security',focus:'Hashing, sessions and tokens, XSS, CSRF, SQL injection, secrets handling.',
    work:['Add real signup and login to your API. Never store a plain password.','Attack your own app: try XSS and injection until something breaks.','Audit this site for the same class of bug and write up what you find.']},
   {n:10,name:'React & Component Architecture',focus:'Declarative UI, component state, effects, data flow and composition.',
    work:['Rebuild the registrar as components with real state management.','Learn why a key prop matters by breaking a list on purpose.','Ship one interface a stranger can use without instructions.']},
   {n:11,name:'System Design & Deployment',focus:'Architecture tradeoffs, caching, CI/CD, monitoring, cost and scale.',
    work:['Deploy a full stack app to a real domain with automated deploys.','Draw the architecture of a system that serves a million users.','Add logging and an alert that actually wakes you up.']},
   {n:12,name:'Capstone: Ship a Real Product',focus:'One production application, built alone, used by someone who is not you.',
    work:['Ship it. Real users, real domain, real error handling.','Write the README, the tests and the deployment guide.','Get five people to use it and fix everything they trip on.']}
  ],
  homework:[
   'Weeks 1–2: watch CS50 Lecture 0 and finish freeCodeCamp HTML/CSS. Build the Tribute Page.',
   'Week 3: rebuild this site from memory — no copying. Compare afterward.',
   'Week 4: 25 JavaScript exercises. Keep notes on scope, closures and array methods.'
  ]},

 {id:'mkt',kind:'Major',short:'Marketing',name:'Marketing & Social Media',
  school:'HubSpot Academy · Google · Meta Blueprint',
  watch:[
   ['HubSpot Academy — video lessons','https://www.youtube.com/@HubSpotMarketing'],
   ['Alex Hormozi — offers and money','https://www.youtube.com/@AlexHormozi'],
   ['Think Media — content that grows','https://www.youtube.com/@ThinkMediaTV']
  ],
  links:[
   ['HubSpot Academy — free certifications','https://academy.hubspot.com/'],
   ['Google Digital Marketing & E-commerce','https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce'],
   ['Meta Blueprint','https://www.facebook.com/business/learn'],
   ['Google Analytics Skillshop','https://skillshop.withgoogle.com/']
  ],
  units:[
   {n:1,name:'Positioning & the Offer',focus:'Who it is for, what changes for them, why you, and at what price.',
    work:['Write the one-sentence offer for Reset Pressure Washing. Rewrite it ten times.','Price on the value of the outcome, not on your cost. Justify the number.','Add a guarantee that moves the risk off the buyer.']},
   {n:2,name:'Content & Platform Mechanics',focus:'Hooks, retention curves, distribution signals and the compounding of consistency.',
    work:['Post three times a week on one platform for the whole month.','Log every post: hook, format, views, retention, leads.','Rewrite the three worst-performing hooks and repost.']},
   {n:3,name:'Funnels, Email & Conversion',focus:'Awareness to conversion, lead magnets, nurture sequences, landing pages.',
    work:['Build one landing page with exactly one call to action.','Write a five-email nurture sequence that handles the top objection.','Compute your conversion rate at every step and find the leak.']},
   {n:4,name:'Copywriting & Persuasion',focus:'Headlines, specificity, objection handling, proof and the ethics of the ask.',
    work:['Hand-copy ten great sales letters to learn the rhythm.','Rewrite your offer page three ways and test which converts.','Collect three real testimonials with numbers in them.']},
   {n:5,name:'Paid Acquisition',focus:'Auctions, targeting, creative testing, CPM, CPC, CPA and budget discipline.',
    work:['Run a small campaign with a hard budget cap. Track it daily.','Test five creatives against one audience, not the reverse.','Calculate your true cost per booked job, not per lead.']},
   {n:6,name:'Analytics & Attribution',focus:'Events, funnels, cohorts, attribution windows and lying dashboards.',
    work:['Instrument one site with real conversion events.','Build a dashboard that shows booked jobs, not impressions.','Find one metric you have been reporting that means nothing.']},
   {n:7,name:'SEO & Organic Search',focus:'Intent, keyword research, on-page structure, technical SEO, local search.',
    work:['Rank one local page for one real buying-intent phrase.','Fix the technical basics: titles, speed, structure, sitemap.','Claim and fully complete a local business profile.']},
   {n:8,name:'Brand & Creative Strategy',focus:'Category, voice, visual identity and what makes a brand chargeable.',
    work:['Write the brand guide: voice, promise, three things you never do.','Design a visual identity that survives being printed in black and white.','Audit a competitor and name exactly what you will do differently.']},
   {n:9,name:'Sales & CRM',focus:'Pipelines, discovery calls, objection handling, follow-up and closing.',
    work:['Run ten real discovery calls. Script the first two minutes.','Build a pipeline in a CRM and move every lead through stages.','Track your close rate weekly and raise it by one improvement.']},
   {n:10,name:'Pricing & Unit Economics',focus:'Margin, CAC, LTV, payback period and pricing power.',
    work:['Compute CAC, LTV and payback for one real business you own.','Raise a price and measure what actually happens to volume.','Model the business at 3x volume and find what breaks first.']},
   {n:11,name:'Retention & Lifecycle',focus:'Churn, repeat purchase, referral loops and why keeping beats getting.',
    work:['Build a referral mechanic that costs less than an ad.','Win back ten lapsed customers with a single sequence.','Measure repeat rate. Move it.']},
   {n:12,name:'Capstone: Full Go-to-Market Plan',focus:'One business, one complete plan, executed and measured.',
    work:['Write and execute a 90-day go-to-market plan for a business you own.','Report actual revenue against the plan, honestly.','Write the post-mortem: what worked, what you would never repeat.']}
  ],
  homework:[
   'Week 1: HubSpot modules 1–3. Write the one-sentence offer for Reset Pressure Washing.',
   'Weeks 2–3: post three times a week on one platform. Log the results.',
   'Week 4: write a one-page marketing plan for a business you own.'
  ]},

 {id:'math',kind:'General education',short:'Mathematics',name:'Mathematics: Algebra to Calculus',
  school:'Khan Academy · MIT OCW · OpenStax',
  watch:[
   ['3Blue1Brown — math you can see','https://www.youtube.com/@3blue1brown'],
   ['Professor Leonard — full whiteboard lectures','https://www.youtube.com/@ProfessorLeonard'],
   ['Khan Academy — short video lessons','https://www.youtube.com/@khanacademy']
  ],
  links:[
   ['Khan Academy — all math','https://www.khanacademy.org/math'],
   ['Paul’s Online Math Notes','https://tutorial.math.lamar.edu/'],
   ['OpenStax — free textbooks','https://openstax.org/subjects/math'],
   ['MIT 18.06 — Linear Algebra','https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/'],
   ['MIT 18.01 — Single Variable Calculus','https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/']
  ],
  units:[
   {n:1,name:'Algebra I',focus:'Linear equations and inequalities, systems, exponents, factoring, functions.',
    work:['Khan Algebra 1 to full mastery. No skipping the practice.','Work 20 problems a week by hand on paper.','Re-derive the quadratic formula by completing the square.']},
   {n:2,name:'Algebra II & Functions',focus:'Quadratics, polynomials, rationals, logarithms, exponentials, complex numbers.',
    work:['Khan Algebra 2 to mastery.','Graph every function family by hand before touching a calculator.','Explain in writing why logarithms turn multiplication into addition.']},
   {n:3,name:'Geometry & Trigonometry',focus:'Proof, the unit circle, identities, laws of sines and cosines, radians.',
    work:['Memorise the unit circle cold.','Prove ten geometric theorems from axioms.','Solve 20 triangles including ambiguous cases.']},
   {n:4,name:'Precalculus',focus:'Function transformation, sequences, series, vectors, polar and limits at the door.',
    work:['Khan Precalculus to mastery.','Sketch transformations without plotting points.','Build the intuition for a limit before the definition arrives.']},
   {n:5,name:'Limits & Continuity',focus:'The formal limit, one-sided limits, continuity, asymptotes, the squeeze theorem.',
    work:['Work the epsilon-delta definition until it stops being frightening.','Evaluate 30 limits including indeterminate forms.','Explain continuity without using the word "unbroken".']},
   {n:6,name:'Derivatives',focus:'The definition, rules, chain rule, implicit and higher-order derivatives.',
    work:['Derive the power rule from the limit definition.','Differentiate 50 functions by hand.','Explain what a derivative means physically, in one paragraph.']},
   {n:7,name:'Applications of Derivatives',focus:'Optimisation, related rates, curve sketching, the mean value theorem.',
    work:['Solve 15 optimisation problems drawn from real situations.','Sketch curves from derivative information alone.','Model one real business decision as an optimisation.']},
   {n:8,name:'Integration',focus:'Riemann sums, the fundamental theorem, substitution, parts, areas and volumes.',
    work:['Compute an integral as a limit of sums before using the shortcut.','Integrate 50 functions by hand.','State the fundamental theorem in your own words and defend it.']},
   {n:9,name:'Series & Advanced Applications',focus:'Sequences, convergence tests, Taylor and Maclaurin series, differential equations.',
    work:['Derive the Taylor series for e^x, sin x and cos x.','Test 20 series for convergence and justify each test.','Solve separable differential equations from real models.']},
   {n:10,name:'Linear Algebra',focus:'Vectors, matrices, determinants, eigenvalues, span and linear transformations.',
    work:['MIT 18.06 lectures 1–10 with the problem sets.','Watch 3Blue1Brown Essence of Linear Algebra twice.','Explain an eigenvector geometrically without formulas.']},
   {n:11,name:'Probability & Statistics',focus:'Distributions, expectation, variance, inference, hypothesis testing, regression.',
    work:['Work through OpenStax Introductory Statistics.','Run a real hypothesis test on data you collected yourself.','Find one statistic in the news that is being reported dishonestly.']},
   {n:12,name:'Discrete Mathematics',focus:'Logic, proof techniques, combinatorics, graph theory and number theory.',
    work:['Prove twenty results by induction and contradiction.','Solve combinatorics problems until counting stops being guessing.','Model one real network as a graph and analyse it.']}
  ],
  homework:[
   'Daily: 30 minutes of Khan mastery, following the unit you are currently in.',
   'Weekly: one hard problem worked fully by hand. Photo goes to your notes.',
   'Monthly: the unit exam here plus the matching Khan course challenge.'
  ]},

 {id:'sci',kind:'General education',short:'Science',name:'Science: Physics to Quantum',
  school:'Khan Academy → MIT OpenCourseWare',
  watch:[
   ['Veritasium — physics that rewires your head','https://www.youtube.com/@veritasium'],
   ['MIT 8.01 — filmed lectures','https://www.youtube.com/playlist?list=PLyQSN7X0ro203puVhQsmCj9qhlFQ-As8e'],
   ['Kurzgesagt — animated science','https://www.youtube.com/@kurzgesagt'],
   ['PBS Space Time — serious physics, patiently','https://www.youtube.com/@pbsspacetime']
  ],
  links:[
   ['Khan Academy — Physics','https://www.khanacademy.org/science/physics'],
   ['MIT 8.01 — Classical Mechanics','https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/'],
   ['MIT 8.02 — Electricity & Magnetism','https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/'],
   ['MIT 8.04 — Quantum Physics I','https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/'],
   ['OpenStax — University Physics','https://openstax.org/subjects/science']
  ],
  units:[
   {n:1,name:'Kinematics',focus:'Displacement, velocity, acceleration, graphs of motion and projectiles.',
    work:['Derive the kinematic equations rather than memorising them.','Solve 25 motion problems including two-dimensional projectiles.','Sketch position, velocity and acceleration graphs for one motion.']},
   {n:2,name:'Newtonian Dynamics',focus:'The three laws, free-body diagrams, friction, tension and circular motion.',
    work:['Draw a free-body diagram for every problem before any algebra.','Solve 25 dynamics problems including inclines and pulleys.','Explain why the third-law pair does not cancel.']},
   {n:3,name:'Energy & Momentum',focus:'Work, kinetic and potential energy, conservation, collisions and impulse.',
    work:['Solve every problem twice: once with forces, once with energy.','Work 20 collision problems, elastic and inelastic.','Explain conservation of momentum to someone with no physics.']},
   {n:4,name:'Rotation & Gravitation',focus:'Torque, moment of inertia, angular momentum, orbits and Kepler.',
    work:['MIT 8.01 rotation lectures with the problem sets.','Derive orbital velocity from first principles.','Explain why a spinning skater speeds up when they pull their arms in.']},
   {n:5,name:'Waves & Thermodynamics',focus:'Oscillation, resonance, sound, heat, entropy and the laws of thermodynamics.',
    work:['Model simple harmonic motion mathematically and physically.','Work through the four laws and state each in plain language.','Explain entropy without saying the word "disorder".']},
   {n:6,name:'Electricity & Magnetism',focus:'Charge, fields, potential, circuits, induction and Maxwell in outline.',
    work:['MIT 8.02 with the problem sets.','Build and analyse a real circuit. Measure it.','Explain how a motor works, from field to torque.']},
   {n:7,name:'Optics & Modern Physics',focus:'Reflection, refraction, interference, the photoelectric effect, atomic structure.',
    work:['Work the double-slit experiment mathematically.','Explain why the photoelectric effect broke classical physics.','Solve 15 optics problems with ray diagrams drawn by hand.']},
   {n:8,name:'Special Relativity',focus:'Postulates, time dilation, length contraction, simultaneity, mass-energy.',
    work:['Derive time dilation from the light-clock thought experiment.','Work the twin paradox until it is no longer a paradox.','Explain E=mc² correctly, including what it does not mean.']},
   {n:9,name:'Chemistry Foundations',focus:'Atomic structure, bonding, stoichiometry, thermochemistry and equilibrium.',
    work:['Work through OpenStax Chemistry chapters 1–9.','Balance 30 equations and solve stoichiometry problems.','Explain why the periodic table is shaped the way it is.']},
   {n:10,name:'Quantum Mechanics I',focus:'Wave functions, superposition, the Schrödinger equation, the particle in a box.',
    work:['MIT 8.04 lectures 1–10. Do not skip the mathematics.','Solve the infinite square well completely.','Explain superposition without using the cat.']},
   {n:11,name:'Quantum Mechanics II',focus:'Operators, uncertainty, angular momentum, spin, the hydrogen atom, entanglement.',
    work:['Derive the uncertainty principle rather than quoting it.','Work the hydrogen atom through to the energy levels.','Explain entanglement and why it does not permit faster-than-light signalling.']},
   {n:12,name:'Capstone: Physics in Writing',focus:'One rigorous piece of physical explanation, at a level you can defend.',
    work:['Write a ten-page explanation of one modern physics result.','Include the mathematics and derive it yourself.','Present it to someone and survive their questions.']}
  ],
  homework:[
   'Weekly: three lessons in the current unit, plus the problem sets.',
   'Weekly: one problem worked fully by hand with a diagram.',
   'Monthly: the unit exam here. Quantum comes after Calculus, not before.'
  ]},

 {id:'eng',kind:'General education',short:'English & Philosophy',name:'English, Literature & Philosophy',
  school:'Reading list · Writing practice · Stanford Encyclopedia',
  watch:[
   ['Crash Course Philosophy — animated series','https://www.youtube.com/playlist?list=PL8dPuuaLjXtNgK6MZucdYldNkMybYIHKR'],
   ['The School of Life — ideas that apply','https://www.youtube.com/@theschooloflifetv'],
   ['TED-Ed — big ideas in five minutes','https://www.youtube.com/@TEDEd']
  ],
  links:[
   ['Khan Academy — Grammar','https://www.khanacademy.org/humanities/grammar'],
   ['Project Gutenberg — free classics','https://www.gutenberg.org/'],
   ['Stanford Encyclopedia of Philosophy','https://plato.stanford.edu/'],
   ['Purdue OWL — writing and citation','https://owl.purdue.edu/owl/purdue_owl.html'],
   ['Reading list: Meditations, Man’s Search for Meaning, 12 Rules for Life, As a Man Thinketh, Proverbs','#']
  ],
  units:[
   {n:1,name:'Grammar & Sentence Craft',focus:'Clauses, agreement, punctuation, modifiers and the sentence as a unit of thought.',
    work:['Khan Grammar to mastery. Yes, all of it.','Write 200 words daily and edit them the next morning.','Find and fix ten errors in something you wrote last year.']},
   {n:2,name:'Rhetoric & Argument',focus:'Ethos, pathos, logos, validity and soundness, and the common fallacies.',
    work:['Name the fallacy in ten real arguments you encounter this month.','Write one argument, then write the strongest case against it.','Read Aristotle on rhetoric and take notes by hand.']},
   {n:3,name:'The Essay & Close Reading',focus:'Thesis, structure, evidence, revision, diction, syntax and tone.',
    work:['Write four one-page essays. Revise each one twice.','Close-read one page of great prose and annotate every choice.','Give an essay to a stranger. If they miss the point, it is your fault.']},
   {n:4,name:'Ancient Philosophy',focus:'The pre-Socratics, Socrates, Plato’s forms and Aristotle’s ethics.',
    work:['Read the Apology and the Republic Book VII.','Write a dialogue in the Socratic form on a question you care about.','Explain the theory of forms and then argue against it.']},
   {n:5,name:'Stoicism & Ethics',focus:'The dichotomy of control, virtue ethics, duty, consequences and applied ethics.',
    work:['Read Meditations and Epictetus’ Enchiridion in full.','Keep a Stoic journal every morning for the month.','Take a hard moral case and argue it three ways: virtue, duty, consequence.']},
   {n:6,name:'Classic Literature',focus:'Narrative structure, character, theme and why old books survive.',
    work:['Read three classics cover to cover. 20 pages minimum daily.','Write a full essay on one of them with textual evidence.','Identify the author’s claim about human nature and test it.']},
   {n:7,name:'Modern Philosophy',focus:'Descartes, empiricism, Kant, and the problem of knowledge.',
    work:['Read Descartes’ Meditations and one empiricist reply.','Explain Kant’s categorical imperative and apply it to a real decision.','Write on what you can actually claim to know, and how.']},
   {n:8,name:'Logic & Reasoning',focus:'Formal logic, deduction and induction, probability and cognitive bias.',
    work:['Work through propositional and predicate logic exercises.','Formalise ten everyday arguments into symbolic form.','Catch yourself in three biases and write them down.']},
   {n:9,name:'Research & Long-Form Writing',focus:'Sources, citation, synthesis, structure at length and intellectual honesty.',
    work:['Write a 3,000-word researched essay with real citations.','Use at least eight sources and steelman the opposition.','Cut the finished draft by 20% without losing an argument.']},
   {n:10,name:'Political Philosophy',focus:'The social contract, liberty, justice, rights and legitimate authority.',
    work:['Read Locke, Mill and one thinker you expect to disagree with.','Write your own account of what makes authority legitimate.','Argue the position you hold least sympathetically, and well.']},
   {n:11,name:'Existentialism & Meaning',focus:'Nietzsche, Kierkegaard, Camus, Frankl, and the question of how to live.',
    work:['Read Man’s Search for Meaning and The Myth of Sisyphus.','Write your own answer to the question of meaning. Defend it.','Reread what you wrote in Unit 1 and judge how far your writing has moved.']},
   {n:12,name:'Capstone: Thesis',focus:'One sustained argument, researched, structured and defended.',
    work:['Write a 5,000-word thesis on a question you genuinely care about.','Defend it in conversation against someone who disagrees.','Revise it once more after the defence.']}
  ],
  homework:[
   'Daily: read 20 pages minimum and write 200 words.',
   'Weekly: a half-page reflection — what did the author claim, do you agree, and why.',
   'Monthly: one full essay. The grade: could a stranger understand your point.'
  ]}
];

const COURSE=Object.fromEntries(CURRICULUM.map(c=>[c.id,c]));

/* ---------- built-in exam bank: [prompt, options, correctIndex, why] ---------- */
const BANK={
 code:{
  1:[
   ['With box-sizing: border-box, an element set to width:300px with 20px padding and a 5px border has a content width of…',['300px','250px','350px','270px'],1,'border-box makes width include padding and border: 300 − 40 − 10 = 250.'],
   ['Which selector wins on specificity?',['#nav .item a','.nav .item .link','ul li a.link','a.link:hover'],0,'An ID outranks any number of classes. (1,1,1) beats (0,3,0).'],
   ['position:absolute positions an element relative to…',['The viewport always','The nearest ancestor whose position is not static','Its direct parent always','The document body always'],1,'It resolves against the nearest positioned ancestor, falling back to the initial containing block.'],
   ['flex: 1 1 0 differs from flex: 1 1 auto because…',['One is invalid CSS','The flex-basis starts at zero rather than the content size','Only one allows shrinking','They are identical'],1,'With basis 0 all free space is split evenly; with auto, content size is reserved first.'],
   ['Vertical margin collapsing happens between…',['Any two elements','Adjacent vertical margins of block-level boxes in normal flow','Flex items','Horizontally adjacent elements'],1,'Collapsing applies to block-level boxes in normal flow, not to flex or grid items.'],
   ['z-index has no effect on an element when…',['Its position is static and it is not a flex or grid item','The value is above 100','It has a background','It is inside a div'],0,'z-index applies to positioned elements and to flex/grid items only.'],
   ['1rem is measured against…',['The parent element font size','The root element font size','The viewport width','A fixed 16px'],1,'rem is relative to the root; em is relative to the parent.'],
   ['The correct reason to use <section> instead of <div> is…',['It has default styling','It carries document meaning and should have a heading','It is faster to render','It is required by HTML5'],1,'section is a semantic sectioning element; div carries no meaning.'],
   ['Two rules of equal specificity target the same element. Which applies?',['The first one declared','The last one declared','Neither','Both, averaged'],1,'When specificity ties, source order decides and the later rule wins.'],
   ['display:none differs from visibility:hidden because…',['It removes the element from layout entirely','It only hides text','It fades the element out','There is no difference'],0,'visibility:hidden still reserves the element’s space; display:none does not.']
  ],
  2:[
   ['typeof null evaluates to…',['"null"','"object"','"undefined"','Throws an error'],1,'A long-standing bug in the language, kept for backward compatibility.'],
   ['0.1 + 0.2 === 0.3 evaluates to…',['true','false','NaN','undefined'],1,'Binary floating point cannot represent these exactly; the sum is 0.30000000000000004.'],
   ['Using let instead of var in a for loop that creates closures matters because…',['let is faster','let creates a fresh binding on each iteration','var cannot be used in loops','They behave identically'],1,'Each iteration gets its own binding, so closures capture distinct values.'],
   ['[1,2,3].map(x => x * 2) does what to the original array?',['Doubles it in place','Leaves it unchanged and returns a new array','Empties it','Sorts it'],1,'map is non-mutating; it returns a new array.'],
   ['The difference between == and === is…',['=== is deprecated','== coerces types before comparing','== only works on numbers','They are the same'],1,'Loose equality applies type coercion; strict equality does not.'],
   ['A const declaration before its line is…',['Not hoisted at all','Hoisted but in the temporal dead zone','Initialised to undefined','Automatically a var'],1,'let and const are hoisted but cannot be accessed until initialised.'],
   ['In strict mode, `this` inside a plain function called on its own is…',['The global object','undefined','The function itself','null'],1,'Strict mode stops `this` defaulting to the global object.'],
   ['Arrow functions differ from function declarations because…',['They cannot take arguments','They do not bind their own this','They are always async','They cannot be nested'],1,'Arrows inherit `this` lexically, which is why they suit callbacks.'],
   ['The second argument to reduce is…',['The array length','The initial value of the accumulator','The index to start at','A comparator'],1,'Without it, reduce uses the first element and starts at index 1.'],
   ['{...obj} produces…',['A deep clone','A shallow copy — nested objects stay shared','A frozen object','A reference to the same object'],1,'Spread copies one level; nested references still point at the same objects.']
  ],
  3:[
   ['Event bubbling means an event…',['Travels from the target up through its ancestors','Fires on every element at once','Only fires on the document','Cancels itself'],0,'After the capture phase, the event propagates upward from the target.'],
   ['preventDefault() differs from stopPropagation() because it…',['Stops the event travelling','Cancels the browser’s default action','Removes the listener','Deletes the element'],1,'One cancels default behaviour, the other stops propagation. They are independent.'],
   ['A pending Promise can settle…',['Many times','Exactly once, as fulfilled or rejected','Only as fulfilled','Only if awaited'],1,'A promise settles once and its state is then immutable.'],
   ['An async function always returns…',['The raw value','A Promise','undefined','A generator'],1,'Return values are wrapped in a resolved promise automatically.'],
   ['In the event loop, microtasks such as promise callbacks run…',['After all timers','Before the next macrotask, after the current one finishes','Only on page load','In a separate thread'],1,'The microtask queue drains completely before the next macrotask.'],
   ['addEventListener is preferred over an onclick attribute because…',['It is faster','It allows multiple independent listeners and separates behaviour from markup','onclick is invalid HTML','It works without JavaScript'],1,'Assigning onclick overwrites any previous handler.'],
   ['querySelectorAll returns…',['A live HTMLCollection','A static NodeList','An array','A single element'],1,'It is static: later DOM changes are not reflected. getElementsByClassName is live.'],
   ['await inside a for loop over independent requests causes them to…',['Run concurrently','Run one after another','Fail','Run twice'],1,'Each await pauses the loop. Promise.all runs them concurrently.'],
   ['Event delegation works because…',['Listeners are copied to children','Events bubble to a shared ancestor that can inspect the target','The DOM caches handlers','Children inherit handlers'],1,'One listener on a parent handles current and future children.'],
   ['fetch() rejects its promise when…',['The response is 404','The response is 500','The network request itself fails','Any error occurs'],2,'HTTP error statuses still resolve. You must check response.ok yourself.']
  ]
 },
 mkt:{
  1:[
   ['A complete value proposition states…',['Your company history','Who it is for, the outcome they get, and why you over the alternative','Your price only','Your follower count'],1,'Audience, outcome and differentiation. Missing any one makes it generic.'],
   ['Value-based pricing anchors the price to…',['Your costs plus a margin','What the outcome is worth to the buyer','The cheapest competitor','An industry average'],1,'Cost-plus caps your upside at your own inefficiency.'],
   ['Risk reversal raises conversion because it…',['Lowers your price','Moves the perceived risk from the buyer to the seller','Adds urgency','Increases reach'],1,'A guarantee removes the buyer’s main reason to delay.'],
   ['Choosing a narrow niche tends to…',['Shrink revenue permanently','Sharpen the message and lower acquisition cost','Remove the need for marketing','Guarantee higher prices'],1,'A specific message converts far better than a general one, so you pay less per customer.'],
   ['For a pressure-washing business, the correct primary metric is…',['Follower count','Booked jobs and qualified leads','Impressions','Post likes'],1,'Measure the thing that pays. Everything else is a leading indicator at best.'],
   ['TAM, SAM and SOM stand for total, serviceable available, and…',['Serviceable obtainable market','Sales operations margin','Standard operating model','Secondary offer market'],0,'SOM is the slice you can realistically win in a given period.'],
   ['Meaningful differentiation must be…',['Loud','Valued by the buyer and hard for a competitor to copy','Cheaper','Newer'],1,'A difference the buyer does not care about is not differentiation.'],
   ['You are being treated as a commodity. The strongest response is to…',['Cut the price','Change what is being compared — speed, guarantee, scope, outcome','Advertise harder','Rebrand the logo'],1,'Competing on price in a commodity comparison is a race you win by losing margin.'],
   ['An offer, in the strict sense, is…',['A discount','What they get, at what price, with what promise and what risk removed','A social media post','A price list'],1,'Discount is one lever inside an offer, not the offer itself.'],
   ['The clearest sign your positioning is wrong is…',['Low follower growth','Buyers constantly asking why you cost more than the cheapest option','Slow website','Few likes'],1,'That question means they see no difference. That is a positioning failure.']
  ],
  2:[
   ['Modern feed distribution is driven primarily by…',['Follower count','Early engagement and retention per impression','Hashtag volume','Posting time alone'],1,'Platforms test content on a small audience and expand based on measured response.'],
   ['The job of the first three seconds is to…',['Introduce yourself','Stop the scroll and open a specific curiosity gap','Show the logo','List credentials'],1,'Attention is the only currency at the start. Everything else comes after.'],
   ['Retention curve matters because platforms optimise for…',['Total posts','Watch time and completion','Comments only','Upload frequency'],1,'A short video watched fully often outperforms a long one abandoned early.'],
   ['The correct way to repurpose across platforms is to…',['Cross-post the identical file','Adapt format, aspect ratio and hook to each platform','Post only on one','Automate reposting'],1,'Raw cross-posts read as foreign and underperform on every platform but the origin.'],
   ['A content pillar is…',['A hashtag group','A recurring theme tied to your offer that you can post about indefinitely','A posting schedule','A design template'],1,'Pillars stop you inventing a topic from nothing every day.'],
   ['A call to action performs best when placed…',['At the very start','After value has actually been delivered','In every sentence','Only in the bio'],1,'Asking before earning attention wastes the ask.'],
   ['Which of these is the clearest vanity metric for a service business?',['Booked jobs','Impressions','Cost per lead','Close rate'],1,'Impressions cost nothing to accumulate and correlate weakly with revenue.'],
   ['A valid content test changes…',['Everything at once','One variable, compared against a like-for-like control','Only the platform','Nothing'],1,'Change the hook alone, or you cannot attribute the result.'],
   ['Compared with feed posts, search-driven content tends to…',['Decay faster','Compound over time','Never reach anyone','Cost more'],1,'Feed posts have a short half-life; search content keeps earning.'],
   ['You post consistently for two months with rising views and flat leads. The likely fault is…',['The algorithm','A mismatch between the content topic and the offer','Posting too often','Video quality'],1,'You are reaching people, just not people who want what you sell.']
  ],
  3:[
   ['The standard funnel stages are…',['Post, like, share, repeat','Awareness, consideration, conversion, retention','Cold, warm, hot, sold','Traffic, traffic, traffic, sale'],1,'Each stage needs its own content and its own metric.'],
   ['1,000 visitors produce 40 leads and 8 sales. The close rate is…',['0.8%','20%','4%','8%'],1,'Close rate is sales over leads: 8 / 40 = 20%. The 0.8% figure is visitor-to-sale.'],
   ['A good lead magnet…',['Covers everything you know','Solves one narrow problem fast and points at the paid offer','Is as long as possible','Is unrelated to the offer'],1,'A magnet that attracts the wrong people fills your list with non-buyers.'],
   ['Email deliverability is most damaged by…',['Sending weekly','Purchased lists and spam complaints','Using images','Short subject lines'],1,'Complaint rate is the signal providers punish hardest.'],
   ['The purpose of a nurture sequence is to…',['Fill the calendar','Build trust and answer objections before the ask','Increase unsubscribes','Boost open rates alone'],1,'Most buyers do not convert on first contact; the sequence closes that gap.'],
   ['A landing page converts best with…',['Several equally weighted actions','One primary action','No call to action','A full site navigation'],1,'Every extra choice on the page costs conversion.'],
   ['A rule of thumb for a healthy business is that LTV should exceed CAC by roughly…',['1x','3x','0.5x','100x'],1,'Below 3:1 there is rarely enough margin left to fund growth.'],
   ['An A/B test is only valid when…',['It runs for one hour','Sample size is adequate and one variable changed','You prefer the result','Traffic sources differ'],1,'Small samples produce confident nonsense.'],
   ['Payback period measures…',['Total revenue','How long until a customer repays their acquisition cost','Profit margin','Refund rate'],1,'A long payback period can bankrupt a growing, profitable-on-paper business.'],
   ['Your funnel leaks hardest between leads and sales. The right first move is…',['Buy more traffic','Fix the offer and objection handling at that step','Redesign the logo','Post more often'],1,'Adding traffic to a leaking funnel multiplies the waste.']
  ]
 },
 math:{
  1:[
   ['Solve 3(2x − 4) = 5x + 7',['x = 19','x = 5','x = −5','x = 1'],0,'6x − 12 = 5x + 7, so x = 19.'],
   ['Factor x² − 5x − 14',['(x − 7)(x + 2)','(x + 7)(x − 2)','(x − 7)(x − 2)','(x − 14)(x + 1)'],0,'−7 and +2 multiply to −14 and add to −5.'],
   ['The slope of the line through (2, −3) and (6, 5) is…',['2','−2','1/2','8'],0,'(5 − (−3)) / (6 − 2) = 8/4 = 2.'],
   ['Solve |2x − 5| = 9',['x = 7 only','x = 7 or x = −2','x = −2 only','No solution'],1,'2x − 5 = 9 gives 7; 2x − 5 = −9 gives −2.'],
   ['Simplify (x³y²)(x⁻¹y⁴)',['x²y⁶','x²y⁸','x⁴y⁶','x³y⁶'],0,'Add exponents on like bases: 3 + (−1) = 2 and 2 + 4 = 6.'],
   ['Solve the system y = 2x + 1 and y = −x + 7',['(2, 5)','(5, 2)','(1, 3)','(3, 4)'],0,'2x + 1 = −x + 7 gives x = 2, so y = 5.'],
   ['Solve −3x + 4 > 13',['x > −3','x < −3','x > 3','x < 3'],1,'−3x > 9, and dividing by a negative flips the inequality.'],
   ['The domain of f(x) = 1/(x − 4) is…',['All reals','All reals except 4','x > 4 only','All reals except 0'],1,'The denominator cannot be zero.'],
   ['Simplify (x² − 9)/(x + 3)',['x − 3, where x ≠ −3','x + 3','x − 9','x² − 3'],0,'Factor the difference of squares and cancel, but the restriction survives.'],
   ['If f(x) = 2x² − x, then f(−3) =',['21','15','−21','−15'],0,'2(9) − (−3) = 18 + 3 = 21.']
  ],
  2:[
   ['The discriminant of 2x² + 3x + 5 tells you the equation has…',['Two real roots','One real root','No real roots','Infinitely many roots'],2,'b² − 4ac = 9 − 40 = −31, which is negative.'],
   ['Solve x² + 4x − 21 = 0',['x = 3 or x = −7','x = −3 or x = 7','x = 21 or x = −1','x = −4 or x = 21'],0,'(x − 3)(x + 7) = 0.'],
   ['log₂(32) =',['4','5','6','16'],1,'2⁵ = 32.'],
   ['log(a) + log(b) equals…',['log(a + b)','log(ab)','log(a/b)','log(a)·log(b)'],1,'Logarithms convert multiplication into addition.'],
   ['Solve 2^(x+1) = 32',['x = 4','x = 5','x = 16','x = 6'],0,'32 = 2⁵, so x + 1 = 5.'],
   ['The inverse of f(x) = 3x − 6 is…',['(x + 6)/3','3x + 6','(x − 6)/3','1/(3x − 6)'],0,'Swap and solve: y = 3x − 6 becomes x = (y + 6)/3.'],
   ['The vertex of y = x² − 6x + 5 is…',['(3, −4)','(−3, −4)','(3, 4)','(6, 5)'],0,'x = −b/2a = 3, and y(3) = 9 − 18 + 5 = −4.'],
   ['The sum of the roots of x² − 7x + 12 = 0 is…',['7','12','−7','5'],0,'By Vieta’s formula the sum is −b/a = 7.'],
   ['(2 + 3i)(2 − 3i) =',['13','−5','4 − 9i','4 + 9i'],0,'A complex conjugate pair gives a² + b² = 4 + 9.'],
   ['f(x) = (2x + 1)/(x − 3) has a horizontal asymptote at…',['y = 2','y = 3','y = 0','y = 1/3'],0,'Equal degrees, so the ratio of leading coefficients gives y = 2.']
  ],
  3:[
   ['sin²θ + cos²θ =',['1','0','2','tan²θ'],0,'The Pythagorean identity, straight off the unit circle.'],
   ['A right triangle with legs 5 and 12 has a hypotenuse of…',['13','17','15','11'],0,'25 + 144 = 169.'],
   ['sin(30°) =',['1/2','√3/2','√2/2','1'],0,'From the 30-60-90 triangle.'],
   ['180° in radians is…',['π','2π','π/2','π/4'],0,'A half turn is π radians.'],
   ['The area of a circle of radius 6 is…',['36π','12π','6π','72π'],0,'A = πr².'],
   ['The law of cosines states c² =',['a² + b² − 2ab·cos(C)','a² + b²','a² − b² + 2ab','a² + b² + 2ab·cos(C)'],0,'It generalises Pythagoras to any triangle.'],
   ['The period of y = sin(2x) is…',['π','2π','4π','π/2'],0,'Period = 2π / |b|.'],
   ['tanθ equals…',['sinθ / cosθ','cosθ / sinθ','1 / sinθ','sinθ · cosθ'],0,'Which is why tangent is undefined where cosine is zero.'],
   ['The volume of a cylinder is…',['πr²h','2πrh','πr²','(4/3)πr³'],0,'Base area times height.'],
   ['The interior angles of a hexagon sum to…',['720°','540°','900°','360°'],0,'(n − 2) × 180 = 4 × 180.']
  ]
 },
 sci:{
  1:[
   ['Velocity differs from speed because it…',['Includes direction','Is always larger','Is measured in m/s²','Applies only to falling objects'],0,'Velocity is a vector; speed is its magnitude.'],
   ['An object dropped from rest falls approximately how far in 3 seconds?',['44 m','29 m','15 m','88 m'],0,'d = ½gt² = 0.5 × 9.8 × 9 ≈ 44 m.'],
   ['At the highest point of a projectile’s arc…',['All motion stops','Vertical velocity is zero but acceleration is still 9.8 m/s² downward','Acceleration is zero','Horizontal velocity is zero'],1,'Gravity never switches off, even where the vertical velocity passes through zero.'],
   ['The slope of a velocity-time graph gives…',['Acceleration','Displacement','Distance','Force'],0,'Rate of change of velocity is acceleration.'],
   ['The area under a velocity-time graph gives…',['Displacement','Acceleration','Speed','Momentum'],0,'Integrating velocity over time gives displacement.'],
   ['A car goes from 0 to 27 m/s in 9 seconds. Its acceleration is…',['3 m/s²','27 m/s²','9 m/s²','0.33 m/s²'],0,'a = Δv/Δt = 27/9.'],
   ['Displacement differs from distance because it…',['Is a vector and can be zero on a round trip','Is always larger','Cannot be negative','Is measured in seconds'],0,'Return to the start and displacement is zero while distance is not.'],
   ['A heavy ball and a light ball are dropped in a vacuum. They…',['Land together','The heavy one lands first','The light one lands first','Neither falls'],0,'Acceleration due to gravity is independent of mass.'],
   ['Which equation is dimensionally valid for constant acceleration?',['v = v₀ + at','v = v₀ + at²','v = v₀t + a','v = at/2'],0,'Velocity equals initial velocity plus acceleration times time.'],
   ['A ball thrown straight up returns to the thrower’s hand with…',['The same speed it left, ignoring air resistance','Zero speed','Twice the speed','Half the speed'],0,'Energy conservation in the absence of drag.']
  ],
  2:[
   ['Newton’s second law states…',['F = ma','F = mv','F = m/a','F = ma²'],0,'Net force equals mass times acceleration.'],
   ['Third-law force pairs do not cancel because they…',['Are different sizes','Act on different objects','Act at different times','Are not really equal'],1,'Only forces on the same object can cancel in a free-body diagram.'],
   ['If the net force on an object is zero, the object…',['Must be at rest','Moves at constant velocity, which may be zero','Is accelerating','Has no mass'],1,'Newton’s first law: zero net force means zero acceleration, not zero velocity.'],
   ['A 10 kg mass weighs approximately…',['98 N','10 N','9.8 N','980 N'],0,'W = mg = 10 × 9.8.'],
   ['The force of friction is modelled as…',['μN','μm','N/μ','μma'],0,'Coefficient of friction times the normal force.'],
   ['A 2 kg object experiences a net force of 10 N. Its acceleration is…',['5 m/s²','20 m/s²','0.2 m/s²','10 m/s²'],0,'a = F/m = 10/2.'],
   ['Inertia depends on…',['Mass','Velocity','Shape','Temperature'],0,'Mass is the measure of resistance to a change in motion.'],
   ['In an ideal massless rope over a frictionless pulley, tension is…',['The same throughout','Greater at the top','Zero','Different on each side'],0,'A massless rope transmits tension unchanged.'],
   ['Centripetal acceleration equals…',['v²/r, directed toward the centre','v/r, directed outward','vr, tangential','v²r, toward the centre'],0,'There is no outward force; the "centrifugal" sensation is inertia in a rotating frame.'],
   ['A book rests on a level table. The normal force…',['Equals the book’s weight here, because nothing else acts vertically','Always equals weight in every situation','Is zero','Exceeds weight'],0,'They match in this case, but on an incline or in a lift they do not.']
  ],
  3:[
   ['Kinetic energy equals…',['½mv²','mv','mgh','½mv'],0,'Note the square: energy grows with the square of speed.'],
   ['Doubling an object’s speed changes its kinetic energy by a factor of…',['4','2','8','1.5'],0,'Energy goes with v², which is why crash severity climbs so fast.'],
   ['Momentum is defined as…',['mv','ma','½mv²','mgh'],0,'A vector quantity, conserved in an isolated system.'],
   ['In an inelastic collision…',['Momentum is conserved but kinetic energy is not','Both are conserved','Neither is conserved','Only kinetic energy is conserved'],0,'Momentum is always conserved in an isolated system; kinetic energy only in elastic collisions.'],
   ['Work done by a force equals…',['F·d·cosθ','F·d always','F/d','F·d²'],0,'Only the component of force along the displacement does work.'],
   ['Gravitational potential energy near Earth’s surface is…',['mgh','½mv²','mv','mg/h'],0,'Mass times gravity times height above the chosen reference.'],
   ['Power is…',['Work divided by time, in watts','Force times distance, in joules','Energy times time','Mass times acceleration'],0,'Power is the rate of doing work.'],
   ['A 2 kg object moving at 3 m/s has kinetic energy of…',['9 J','6 J','18 J','3 J'],0,'½ × 2 × 9 = 9 J.'],
   ['Conservation of energy states that energy…',['Changes form but the total in a closed system is constant','Can be created','Is always lost','Only exists as motion'],0,'It transforms; it does not appear or vanish.'],
   ['Impulse equals…',['FΔt, and equals the change in momentum','ma','½mv²','mgh'],0,'Which is why airbags work: extend Δt and F falls for the same Δp.']
  ]
 },
 eng:{
  1:[
   ['"Their going to the store" is wrong because it should be…',['They’re','There','Theirs','It is correct'],0,'They’re is the contraction of "they are".'],
   ['A comma splice is…',['Two independent clauses joined by only a comma','A missing Oxford comma','A comma inside quotation marks','Too many commas'],0,'Fix it with a period, a semicolon, or a coordinating conjunction.'],
   ['A semicolon correctly joins…',['Two closely related independent clauses','A clause and a fragment','Two adjectives','A list to its introduction'],0,'Each side must be able to stand alone as a sentence.'],
   ['"The ball was thrown by John" is in…',['The passive voice','The active voice','The subjunctive mood','The imperative'],0,'The grammatical subject receives the action rather than performing it.'],
   ['"It’s" is correctly used to mean…',['It is','Belonging to it','Its own','Either'],0,'The possessive "its" takes no apostrophe.'],
   ['"The list of items ___ on the desk." The correct verb is…',['is','are','were','have'],0,'The subject is "list", singular. "Of items" is a prepositional phrase.'],
   ['"Walking to the store, the rain began to fall" contains…',['A dangling modifier','A comma splice','A split infinitive','No error'],0,'The rain was not walking. The modifier has no logical subject to attach to.'],
   ['Use "fewer" rather than "less" when the noun is…',['Countable','Abstract','Plural in form only','Always'],0,'Fewer chairs, less furniture.'],
   ['"She likes hiking, swimming, and to run" fails the test of…',['Parallel structure','Subject-verb agreement','Pronoun case','Tense'],0,'All items in a series should take the same grammatical form.'],
   ['The clearest reason to prefer the active voice is that it…',['Names the actor and shortens the sentence','Is always more formal','Is required in academic writing','Avoids all pronouns'],0,'Passive voice has legitimate uses, but it hides responsibility by default.']
  ],
  2:[
   ['Ethos, pathos and logos appeal respectively to…',['Credibility, emotion, logic','Logic, credibility, emotion','Emotion, logic, credibility','Style, length, evidence'],0,'Aristotle’s three modes of persuasion.'],
   ['A thesis statement is…',['An arguable claim stated in one sentence','A summary of your sources','A question','A quotation'],0,'If nobody could disagree with it, it is a topic, not a thesis.'],
   ['An argument that is valid but not sound has…',['Correct form but at least one false premise','Correct premises but bad form','No premises','A true conclusion always'],0,'Validity is about structure; soundness requires validity plus true premises.'],
   ['Attacking the arguer instead of the argument is…',['Ad hominem','Straw man','False dilemma','Circular reasoning'],0,'A fallacy of relevance: the person’s character does not bear on the claim’s truth.'],
   ['Misrepresenting an opponent’s position to defeat it more easily is…',['A straw man','An appeal to authority','Begging the question','A slippery slope'],0,'The steelman is the opposite: argue against their strongest version.'],
   ['Begging the question means…',['Assuming the conclusion inside a premise','Raising an obvious question','Changing the subject','Asking for evidence'],0,'The argument moves in a circle and proves nothing.'],
   ['Deductive reasoning differs from inductive because it aims at…',['Certainty given true premises','Probability','Persuasion','Novelty'],0,'Induction generalises from cases and can only ever be probable.'],
   ['Presenting only two options when more exist is…',['A false dilemma','A red herring','Ad populum','Equivocation'],0,'"Either you agree with me or you hate progress" is the classic shape.'],
   ['Including a counterargument strengthens an essay because it…',['Shows you understand the opposition and defuses it in advance','Fills space','Weakens your claim','Is required by style guides'],0,'An unanswered objection is the reader’s exit from your argument.'],
   ['That two things rise together shows…',['Correlation, which does not establish causation','Causation','Nothing at all','Reverse causation always'],0,'A third variable, coincidence, or reversed direction all remain possible.']
  ],
  3:[
   ['A topic sentence should…',['State the paragraph’s single controlling idea','Quote a source','Ask a question','Summarise the essay'],0,'One idea per paragraph is the test.'],
   ['A strong conclusion…',['Resolves the argument without introducing new evidence','Introduces the best new point','Repeats the introduction verbatim','Adds a fresh source'],0,'New evidence in a conclusion signals a body paragraph you failed to write.'],
   ['Close reading attends primarily to…',['The text’s own language and structure','The author’s biography','Contemporary reviews','Your emotional reaction'],0,'Evidence comes from the page before it comes from context.'],
   ['A primary source is…',['The original material itself','A scholar’s commentary on it','An encyclopaedia entry','A textbook'],0,'Secondary sources interpret primary ones.'],
   ['"Show, do not tell" asks the writer to…',['Use concrete detail instead of abstract assertion','Write shorter sentences','Avoid dialogue','Use more adjectives'],0,'Detail lets the reader conclude for themselves, which is more persuasive.'],
   ['Revision differs from proofreading because it addresses…',['Argument and structure rather than surface errors','Spelling','Punctuation','Formatting'],0,'Proofreading last; revision is where the essay is actually made.'],
   ['Diction refers to word choice; syntax refers to…',['Sentence structure','Tone','Theme','Rhythm of vowels'],0,'Together they produce voice.'],
   ['Tone is the author’s attitude; mood is…',['The feeling produced in the reader','The plot','The setting','The thesis'],0,'One is produced, the other is received.'],
   ['Citing sources correctly serves primarily to…',['Let a reader verify your claims and credit prior work','Increase length','Impress the reader','Satisfy a word count'],0,'Verification is the point; plagiarism avoidance follows from it.'],
   ['The best test of whether an essay works is…',['A stranger reads it and can state your claim back to you','It reaches the word count','It uses long words','You are happy with it'],0,'If the point does not survive transmission, the writing failed.']
  ]
 }
};

/* Year Two — units 4 to 6. Same standard, one academic year harder. */
const BANK_Y2={
 code:{
  4:[
   ['Average-case lookup in a hash map is O(1) because…',['Keys hash directly to a bucket index','The table is kept sorted','It uses binary search','Buckets are linked lists'],0,'Hashing turns a key into an index in constant time. Collisions degrade it toward O(n).'],
   ['Appending to a dynamic array is amortised O(1) because…',['Resizing doubles capacity, so copies are rare enough to average out','Arrays never resize','Memory is pre-allocated infinitely','Appends happen at the front'],0,'Doubling means n appends cost O(n) copying in total, so each averages constant.'],
   ['A stack is the right structure when you need…',['Last in, first out — undo, call frames, bracket matching','First in, first out','Sorted iteration','Constant-time lookup by key'],0,'The call stack itself is the canonical example.'],
   ['Inserting at the head of a singly linked list is…',['O(1)','O(n)','O(log n)','O(n log n)'],0,'You only rewrite one pointer. Indexing, by contrast, is O(n).'],
   ['A binary search tree degrades to O(n) lookup when…',['It becomes unbalanced, effectively a linked list','It has too many nodes','Keys are integers','It is stored in an array'],0,'Balanced variants like AVL and red-black trees exist precisely to prevent this.'],
   ['Choosing an array over a linked list mainly buys you…',['Cache locality and O(1) indexing','Cheaper insertion in the middle','Unbounded growth','Automatic sorting'],0,'Contiguous memory is why arrays beat linked lists in practice far more often than Big-O suggests.'],
   ['A queue is the natural structure for…',['Breadth-first traversal and task scheduling','Depth-first traversal','Sorting in place','Recursion'],0,'BFS explores level by level, which is exactly FIFO order.'],
   ['A set is preferable to an array when you need…',['Membership tests and uniqueness','Ordered iteration','Index access','Duplicate storage'],0,'Membership drops from O(n) to O(1) and duplicates are impossible by construction.'],
   ['Two keys hashing to the same bucket is called…',['A collision, resolved by chaining or open addressing','An overflow','A rehash','A fault'],0,'Collisions are expected, not exceptional — the resolution strategy is the design decision.'],
   ['A graph is the right model when your data has…',['Arbitrary many-to-many relationships','Strict parent-child nesting','A fixed sequence','A single root only'],0,'Trees are a restricted kind of graph; use the general form when cycles or multiple parents exist.']
  ],
  5:[
   ['An algorithm running in O(n log n) will, on a large input, beat one running in…',['O(n²)','O(n)','O(log n)','O(1)'],0,'Quadratic growth overtakes everything below it as n rises.'],
   ['Binary search requires that the input be…',['Sorted','Unique','Numeric','Balanced'],0,'Without ordering there is no way to discard half the space each step.'],
   ['Merge sort guarantees O(n log n) but costs…',['O(n) extra space','O(1) extra space','O(n²) time in the worst case','Nothing extra'],0,'Quicksort trades that guarantee for in-place operation and an O(n²) worst case.'],
   ['Every recursive function must have…',['A base case that stops the recursion','A loop','A global variable','Exactly two calls'],0,'Without one you exhaust the call stack.'],
   ['Dynamic programming beats naive recursion by…',['Storing subproblem results so each is computed once','Using less memory','Avoiding recursion entirely','Sorting the input first'],0,'Overlapping subproblems are the signal that memoisation will pay.'],
   ['Naive recursive Fibonacci is exponential because…',['The same subproblems are recomputed across branches','Addition is slow','It uses too much memory','Integers overflow'],0,'fib(n-2) is computed in both branches, and that duplication compounds.'],
   ['A greedy algorithm is only correct when…',['A locally optimal choice leads to a globally optimal one','The input is sorted','The problem is small','Recursion is unavailable'],0,'Dijkstra works greedily; the knapsack problem does not.'],
   ['Big-O notation describes…',['An upper bound on growth as input size rises','Exact runtime in seconds','Memory only','Average performance always'],0,'It is about growth rate, not machine speed — constants are deliberately dropped.'],
   ['Two nested loops over the same n-element array give…',['O(n²)','O(2n)','O(n log n)','O(n)'],0,'Nesting multiplies; sequencing adds.'],
   ['Constant factors matter in practice because…',['Big-O ignores them, yet real inputs are finite','They change the complexity class','They affect correctness','They only matter in theory'],0,'An O(n log n) algorithm with a huge constant can lose to O(n²) on small n.']
  ],
  6:[
   ['git rebase differs from git merge because it…',['Rewrites commits onto a new base, producing linear history','Deletes the branch','Is always safer','Cannot cause conflicts'],0,'Which is why you never rebase a branch someone else has pulled.'],
   ['A good commit message explains…',['Why the change was made, not just what changed','Every line touched','The author’s mood','The file names'],0,'The diff already shows what. Why is the part that is lost otherwise.'],
   ['git revert is preferred over git reset on a shared branch because it…',['Adds a new commit undoing the change, leaving history intact','Is faster','Deletes the commit','Works offline'],0,'Rewriting shared history breaks every other checkout.'],
   ['A unit test should…',['Test one behaviour, and fail for exactly one reason','Cover the whole system','Hit the real database','Depend on test order'],0,'Tests that fail for many reasons do not tell you what broke.'],
   ['A test that passes whether or not the code is correct is…',['Worse than no test, because it manufactures confidence','Still useful','A smoke test','An integration test'],0,'Always confirm a new test fails before you make it pass.'],
   ['Test-driven development means writing…',['A failing test first, then the code that passes it','Tests after shipping','Only integration tests','Documentation first'],0,'Red, green, refactor.'],
   ['A merge conflict happens when…',['Two branches change the same lines and git cannot choose','A branch is deleted','You forget to commit','The remote is offline'],0,'Git surfaces the ambiguity rather than guessing.'],
   ['A debugger is better than print statements because it…',['Lets you inspect and step through live state without editing code','Runs faster','Finds bugs automatically','Replaces tests'],0,'You see every variable at every step, not the three you thought to print.'],
   ['.gitignore exists to keep out…',['Build artifacts, dependencies and secrets','All new files','Documentation','Test files'],0,'A committed API key is in the history forever, even after deletion.'],
   ['A pull request review is primarily for…',['Catching design problems and spreading knowledge','Blocking teammates','Counting lines','Enforcing style manually'],0,'Style belongs to a linter; judgment is what review is actually for.']
  ]
 },
 mkt:{
  4:[
   ['The job of a headline is to…',['Sell the next line, not the product','Describe the company','List features','Be clever'],0,'Every element of copy exists to earn attention for the element after it.'],
   ['"We increased bookings 40% in six weeks" beats "We get great results" because…',['Specificity is more believable than superlatives','It is longer','It uses numbers for their own sake','It sounds humble'],0,'Vague praise reads as unverifiable; specifics invite belief.'],
   ['The strongest place to handle an objection is…',['Inside the copy, before the reader raises it','After the sale','In the FAQ only','Never'],0,'An unaddressed objection is a silent exit.'],
   ['Features describe the product; benefits describe…',['What changes for the buyer','The price','The competition','The technology'],0,'"Twin-cylinder pump" is a feature; "your driveway is done in an hour" is the benefit.'],
   ['Social proof works best when the person giving it…',['Resembles the reader','Is famous','Is the founder','Is anonymous'],0,'People are persuaded by evidence that someone like them got the result.'],
   ['A call to action converts better when it…',['Names the specific next step and lowers perceived effort','Is repeated ten times','Is vague','Uses pressure alone'],0,'"Get a free quote in 60 seconds" outperforms "Contact us".'],
   ['Writing at a lower reading level generally…',['Increases comprehension and conversion','Insults the reader','Reduces credibility','Only suits children'],0,'Clarity is not condescension; even expert readers skim.'],
   ['The ethical line in persuasion is crossed when copy…',['Creates a belief the product cannot deliver on','Uses urgency','Names a benefit','Tells a story'],0,'Manufactured scarcity that is not real is the common failure.'],
   ['Hand-copying proven sales letters teaches…',['Structure and rhythm at a level reading alone does not','Nothing useful','Only vocabulary','Design'],0,'It forces you to notice every decision the writer made.'],
   ['The best source of copy for your offer is…',['The words your actual customers use to describe the problem','A thesaurus','A competitor','Your own vocabulary'],0,'Voice-of-customer language converts because it is already in the reader’s head.']
  ],
  5:[
   ['In an ad auction, your cost is driven by bid and…',['Predicted relevance and engagement quality','Account age','Budget size','Number of ads'],0,'Better creative literally lowers what you pay per result.'],
   ['CPM measures…',['Cost per thousand impressions','Cost per click','Cost per acquisition','Clicks per thousand'],0,'It is a delivery cost, not a performance metric.'],
   ['When testing creative, the correct method is to…',['Hold the audience constant and vary the creative','Vary both at once','Vary the audience only','Change budget daily'],0,'Change one variable or you cannot attribute the result.'],
   ['A campaign with cheap clicks but no bookings most likely has…',['A mismatch between the ad promise and the landing page','Too small a budget','Bad targeting only','A bidding error'],0,'Cheap traffic that does not convert is the most common expensive mistake.'],
   ['Judging a campaign on cost per lead alone is dangerous because…',['Lead quality varies, and only booked jobs pay','Leads are unmeasurable','It is too precise','CPL is always wrong'],0,'Measure cost per booked job, which is the only number that reaches the bank.'],
   ['Raising budget sharply on a working campaign often…',['Disrupts delivery and raises cost per result','Always scales linearly','Has no effect','Lowers CPM'],0,'Scale in steps and let delivery re-stabilise.'],
   ['Ad fatigue shows up as…',['Rising frequency with falling click-through','Falling impressions','Rising CPM only','Higher conversions'],0,'The same people have seen it too many times; refresh the creative.'],
   ['Retargeting outperforms cold traffic mainly because…',['The audience already knows you, so less persuasion is needed','It is cheaper per impression','It reaches more people','It needs no creative'],0,'It is a smaller, warmer pool — good for conversion, useless for growth on its own.'],
   ['A hard budget cap matters most when…',['You are testing something unproven','The campaign is working','You have unlimited funds','Costs are fixed'],0,'Discipline protects you from learning an expensive lesson slowly.'],
   ['Before scaling any paid campaign you should first prove…',['The offer converts organically','That CPM is low','That reach is high','That the creative is beautiful'],0,'Paid traffic amplifies an offer; it does not fix one.']
  ],
  6:[
   ['Attribution is difficult primarily because…',['Buyers touch many channels before converting','Analytics tools are broken','Conversions are rare','Data is expensive'],0,'Last-click credits the final touch and ignores everything that created demand.'],
   ['Last-click attribution systematically undervalues…',['Top-of-funnel channels that create awareness','Paid search','Email','Direct traffic'],0,'The channel that closed gets all the credit; the one that introduced you gets none.'],
   ['A cohort analysis groups users by…',['When they joined, then tracks them over time','Age','Channel only','Revenue'],0,'It separates genuine improvement from changes in traffic mix.'],
   ['A conversion event should be defined as…',['The action that actually creates value, such as a booked job','Any page view','A click','Time on site'],0,'Instrument what pays, or your dashboard will flatter you.'],
   ['Your dashboard shows rising traffic and flat revenue. The most likely cause is…',['Traffic quality or intent has shifted','A tracking outage','Seasonality alone','Nothing, it is normal'],0,'More of the wrong visitor is not growth.'],
   ['A statistically meaningless A/B result usually comes from…',['Too small a sample stopped too early','Too many users','Running too long','Using one variable'],0,'Stopping the moment you see the result you want is how you fool yourself.'],
   ['A vanity metric is one that…',['Rises reliably without predicting revenue','Is hard to measure','Is always small','Comes from ads'],0,'If it cannot go down when the business does badly, it is not measuring the business.'],
   ['Tracking UTM parameters lets you…',['Attribute sessions to a specific campaign and source','Increase reach','Improve SEO','Lower CPM'],0,'Without consistent tagging, channel reporting is guesswork.'],
   ['Survivorship bias in marketing data looks like…',['Studying only the customers who stayed','Sampling too many','Using averages','Tracking churn'],0,'The people who left hold the information you most need.'],
   ['The correct response to a metric you cannot act on is to…',['Stop reporting it','Report it more often','Add it to the dashboard','Set a target for it'],0,'A dashboard is a decision tool, not a scoreboard.']
  ]
 },
 math:{
  4:[
   ['If f(x) = x² and g(x) = x + 3, then f(g(2)) =',['25','7','13','10'],0,'g(2) = 5, and f(5) = 25. Composition works from the inside out.'],
   ['The graph of y = (x − 4)² + 1 is y = x² shifted…',['Right 4 and up 1','Left 4 and up 1','Right 4 and down 1','Left 4 and down 1'],0,'Inside the function the shift is horizontal and inverted in sign.'],
   ['The 10th term of the arithmetic sequence 3, 7, 11, … is',['39','40','43','36'],0,'aₙ = 3 + (n−1)·4, so a₁₀ = 3 + 36.'],
   ['The sum of the infinite geometric series with a = 8, r = 1/2 is',['16','8','4','Divergent'],0,'S = a/(1 − r) = 8/(1/2), valid because |r| < 1.'],
   ['The magnitude of the vector (3, 4) is',['5','7','12','25'],0,'√(9 + 16) = 5.'],
   ['In polar form, the point (0, 5) has angle θ =',['π/2','0','π','3π/2'],0,'Straight up the positive y-axis is a quarter turn.'],
   ['A function has an inverse only if it is…',['One-to-one','Continuous','Increasing','Polynomial'],0,'Otherwise two inputs share an output and the inverse is not a function.'],
   ['As x grows without bound, (3x² + 5)/(x² − 2) approaches',['3','0','Infinity','1'],0,'Equal degrees, so the limit is the ratio of leading coefficients.'],
   ['The domain of f(x) = √(x − 3) is',['x ≥ 3','x > 3','All reals','x ≤ 3'],0,'The radicand cannot be negative; equality is allowed.'],
   ['y = 2ˣ and y = log₂x are related as…',['Reflections of one another across y = x','Parallel lines','Identical','Perpendicular'],0,'That is what being inverse functions looks like graphically.']
  ],
  5:[
   ['lim(x→0) sin(x)/x =',['1','0','Undefined','Infinity'],0,'A standard limit, provable by the squeeze theorem.'],
   ['lim(x→2) (x² − 4)/(x − 2) =',['4','0','Undefined','2'],0,'Factor to (x + 2) for x ≠ 2, then substitute.'],
   ['A function is continuous at a point when…',['It is defined there and the limit equals its value','It is differentiable there','It is increasing there','The limit exists'],0,'All three conditions are required; any one alone is insufficient.'],
   ['0/0 is called an indeterminate form because…',['The limit could be anything until you do more work','It equals zero','It equals one','It is an error'],0,'It signals that algebra or L’Hôpital’s rule is needed, not that the limit fails.'],
   ['f(x) = 1/(x − 3) has a vertical asymptote at',['x = 3','x = 0','y = 0','x = −3'],0,'The function grows without bound as the denominator approaches zero.'],
   ['A left-hand limit differs from a right-hand limit at a point. Then…',['The two-sided limit does not exist','The function is continuous','The limit is zero','The function is differentiable'],0,'A two-sided limit exists only when both sides agree.'],
   ['The squeeze theorem lets you find a limit by…',['Bounding the function between two others with the same limit','Differentiating','Factoring','Graphing'],0,'It is how lim sin(x)/x = 1 is established rigorously.'],
   ['A removable discontinuity is one where…',['The limit exists but the value is missing or wrong','The function jumps','The function is unbounded','The limit is infinite'],0,'It can be patched by redefining a single point — hence removable.'],
   ['In the epsilon-delta definition, delta controls…',['How close x must be to a to force f(x) within epsilon','The size of the limit','The output error','The slope'],0,'Epsilon is the challenge on the output; delta is your answer on the input.'],
   ['Differentiability at a point implies…',['Continuity at that point','Nothing about continuity','That the function is linear','That the limit is zero'],0,'The converse fails: |x| is continuous at 0 but not differentiable there.']
  ],
  6:[
   ['The derivative of x⁵ is',['5x⁴','x⁴','5x⁵','4x⁵'],0,'The power rule: bring the exponent down, reduce it by one.'],
   ['d/dx [sin(x)] =',['cos(x)','−cos(x)','−sin(x)','tan(x)'],0,'And differentiating again gives −sin(x).'],
   ['d/dx [(3x + 1)⁴] =',['12(3x + 1)³','4(3x + 1)³','12(3x + 1)⁴','3(3x + 1)³'],0,'Chain rule: outer derivative times inner derivative, and the inner derivative is 3.'],
   ['The product rule states d/dx[uv] =',['u′v + uv′','u′v′','u′v − uv′','(u + v)′'],0,'Differentiating a product term by term is the classic error.'],
   ['d/dx [eˣ] =',['eˣ','xeˣ⁻¹','e','ln x'],0,'The exponential function is its own derivative.'],
   ['d/dx [ln x] =',['1/x','ln x','x','1/x²'],0,'Valid for x > 0.'],
   ['The derivative measures…',['The instantaneous rate of change at a point','The area under the curve','The average slope','The maximum value'],0,'It is the limit of the difference quotient as h approaches zero.'],
   ['If f′(x) > 0 on an interval, then f is…',['Increasing there','Decreasing there','Constant there','Concave up there'],0,'The second derivative governs concavity, not the first.'],
   ['The second derivative tells you about…',['Concavity and acceleration','Slope','Area','Domain'],0,'Position, velocity, acceleration is the standard physical reading.'],
   ['Implicit differentiation is needed when…',['y cannot be isolated as an explicit function of x','The function is linear','x is negative','The derivative is zero'],0,'Differentiate both sides with respect to x and solve for dy/dx.']
  ]
 },
 sci:{
  4:[
   ['Torque equals…',['rF sin θ','mv','ma','Fd/t'],0,'Only the perpendicular component of force produces rotation.'],
   ['Moment of inertia depends on mass and…',['How that mass is distributed about the axis','Velocity','Temperature','Force applied'],0,'Mass far from the axis contributes far more — it goes as r².'],
   ['A skater pulls their arms in and spins faster because…',['Angular momentum is conserved while moment of inertia falls','They apply torque','Friction decreases','Gravity assists'],0,'L = Iω is constant, so reducing I must raise ω.'],
   ['Angular momentum is conserved when…',['No external torque acts','No external force acts','The system is at rest','Mass is constant'],0,'Torque is to rotation what force is to translation.'],
   ['Kepler’s second law says a planet sweeps…',['Equal areas in equal times','Equal distances in equal times','Circular orbits always','Constant speed'],0,'It is conservation of angular momentum, stated geometrically.'],
   ['Orbital speed for a circular orbit comes from setting…',['Gravitational force equal to the required centripetal force','Kinetic energy to zero','Torque to zero','Mass to one'],0,'GMm/r² = mv²/r gives v = √(GM/r).'],
   ['Gravitational force between two masses varies as…',['1/r²','1/r','r','r²'],0,'Double the separation and the force falls to a quarter.'],
   ['A hollow and a solid cylinder of equal mass roll down a ramp. The solid one…',['Arrives first, because more of its mass is near the axis','Arrives second','Ties','Does not roll'],0,'Lower moment of inertia means less energy diverted into rotation.'],
   ['An astronaut in orbit is weightless because they are…',['In continuous free fall around the Earth','Beyond gravity','Moving too fast for gravity','Massless'],0,'Gravity in low orbit is nearly as strong as at the surface.'],
   ['Rotational kinetic energy is…',['½Iω²','½mv²','Iω','mgh'],0,'It is the rotational analogue of translational kinetic energy.']
  ],
  5:[
   ['The period of a simple pendulum depends on…',['Length and gravity, not mass','Mass and length','Amplitude only','Mass only'],0,'T = 2π√(L/g), for small angles.'],
   ['In simple harmonic motion the restoring force is…',['Proportional to displacement and opposite in direction','Constant','Proportional to velocity','Zero'],0,'F = −kx is what produces sinusoidal motion.'],
   ['Resonance occurs when a driving frequency…',['Matches the system’s natural frequency','Is very low','Is very high','Is zero'],0,'Energy is transferred efficiently on each cycle, so amplitude climbs.'],
   ['Wave speed equals…',['Frequency × wavelength','Frequency ÷ wavelength','Amplitude × frequency','Period × amplitude'],0,'v = fλ holds for every wave.'],
   ['The first law of thermodynamics states…',['Energy is conserved; internal energy changes by heat added minus work done','Entropy always rises','Absolute zero is unreachable','Heat flows from cold to hot'],0,'It is conservation of energy applied to thermal systems.'],
   ['The second law of thermodynamics says that in an isolated system…',['Total entropy never decreases','Energy is lost','Temperature is constant','Work is free'],0,'It is what gives time a direction.'],
   ['Entropy is best described as…',['A measure of how many microstates correspond to a macrostate','Disorder, strictly','Heat','Temperature'],0,'The statistical definition is the one that actually explains the second law.'],
   ['Heat always flows spontaneously from…',['Hotter to colder','Colder to hotter','Larger to smaller','Solid to gas'],0,'Reversing it requires work, which is what a refrigerator does.'],
   ['Doubling the amplitude of a wave changes its energy by a factor of…',['4','2','8','1'],0,'Wave energy goes as the square of amplitude.'],
   ['An adiabatic process is one in which…',['No heat is exchanged with the surroundings','Temperature is constant','Pressure is constant','Volume is constant'],0,'Isothermal, isobaric and isochoric name the other three cases.']
  ],
  6:[
   ['Coulomb’s law says the force between two charges varies as…',['1/r²','1/r','r','r²'],0,'Same inverse-square form as gravity, but it can attract or repel.'],
   ['Electric field is defined as…',['Force per unit positive charge','Force times charge','Potential times distance','Charge per unit area'],0,'Units are newtons per coulomb, equivalently volts per metre.'],
   ['Ohm’s law states…',['V = IR','V = I/R','I = VR','R = VI'],0,'It is an empirical relationship, not a fundamental law — many materials disobey it.'],
   ['Two 6 Ω resistors in parallel give a total resistance of',['3 Ω','12 Ω','6 Ω','1.5 Ω'],0,'Equal parallel resistors halve; in series they would give 12 Ω.'],
   ['Faraday’s law says an EMF is induced by…',['A changing magnetic flux','A constant magnetic field','A static charge','Current alone'],0,'Change is essential — a stationary magnet in a coil induces nothing.'],
   ['Lenz’s law states that the induced current opposes…',['The change in flux that produced it','The applied voltage','Its own field','Gravity'],0,'It is conservation of energy expressed as a direction.'],
   ['A charged particle moving parallel to a magnetic field experiences…',['No magnetic force','Maximum force','A force along the field','A force that grows with time'],0,'F = qvB sin θ, and sin 0 is zero.'],
   ['Electric potential difference is measured in…',['Volts, equal to joules per coulomb','Amperes','Ohms','Watts'],0,'It is energy per unit charge, not a force.'],
   ['Maxwell’s equations predict that light is…',['A self-propagating electromagnetic wave','A stream of particles only','A form of sound','A static field'],0,'They also predict its speed from purely electrical and magnetic constants.'],
   ['An electric motor produces torque because…',['A current-carrying loop in a magnetic field feels a force','Charges repel','Magnets attract iron','Voltage rotates'],0,'The commutator reverses current each half turn to keep the torque in one direction.']
  ]
 },
 eng:{
  4:[
   ['Socrates claimed his wisdom consisted in…',['Knowing that he did not know','Knowing the most','Winning arguments','Teaching for pay'],0,'The Delphic oracle puzzle in the Apology turns on exactly this.'],
   ['Plato’s allegory of the cave is primarily about…',['The difference between appearance and reality, and the pain of learning','Politics only','Fear of the dark','Storytelling'],0,'The prisoner who returns is not thanked — that is part of the argument.'],
   ['Plato’s Forms are…',['Perfect abstract realities of which physical things are imperfect copies','Physical shapes','Mental images','Social conventions'],0,'Aristotle’s central disagreement with his teacher was over exactly this.'],
   ['Aristotle located virtue…',['At a mean between excess and deficiency','At the maximum','In pleasure','In wealth'],0,'Courage sits between cowardice and recklessness.'],
   ['Eudaimonia is best translated as…',['Flourishing across a whole life','Momentary pleasure','Wealth','Fame'],0,'It is an activity of living well, not a feeling.'],
   ['The Socratic method proceeds by…',['Questioning that exposes contradictions in a stated position','Lecturing','Citing authority','Voting'],0,'The aim is to reveal what the interlocutor did not know they believed.'],
   ['Aristotle held that virtue is acquired through…',['Habit and practice','Birth','Instruction alone','Divine gift'],0,'We become just by doing just acts — character is trained, not taught.'],
   ['The pre-Socratics are chiefly notable for…',['Seeking natural rather than mythological explanations','Writing dialogues','Founding democracy','Rejecting reason'],0,'Asking what everything is made of was itself the innovation.'],
   ['A key objection to the theory of Forms is…',['It multiplies entities without explaining how they relate to particulars','It is too simple','It is untestable only','It denies mathematics'],0,'Aristotle’s "third man" argument presses precisely here.'],
   ['For Aristotle, the highest human activity was…',['Contemplation, as the fullest use of reason','Politics','Athletics','Commerce'],0,'Reason is what he takes to be distinctively human.']
  ],
  5:[
   ['The Stoic dichotomy of control distinguishes…',['What is up to us from what is not','Good from evil','Rich from poor','Mind from body'],0,'Epictetus opens the Enchiridion with it because everything else follows.'],
   ['For the Stoics, external events…',['Are indifferent; our judgements about them cause suffering','Are the cause of suffering','Should be avoided','Do not exist'],0,'It is the judgement, not the event, that disturbs.'],
   ['Marcus Aurelius wrote the Meditations…',['As private notes to himself','As a published treatise','As letters to the Senate','As a legal code'],0,'Which is why it reads as self-correction rather than instruction.'],
   ['Virtue ethics asks primarily…',['What kind of person should I be','What rule applies','What maximises happiness','What is legal'],0,'Character is the unit of evaluation, not the individual act.'],
   ['Deontological ethics judges an action by…',['Whether it conforms to duty or a moral rule','Its consequences','Its popularity','The actor’s character'],0,'Kant is the standard example.'],
   ['Utilitarianism judges an action by…',['Its consequences for overall wellbeing','The actor’s intention','A moral rule','Tradition'],0,'Which is why it can, uncomfortably, justify harming a few for the many.'],
   ['A common objection to utilitarianism is that it…',['Can permit injustice to a minority for aggregate gain','Ignores consequences','Is too rigid','Requires religion'],0,'The rights-based reply is the standard counter.'],
   ['Stoic negative visualisation means…',['Rehearsing loss in advance to reduce its power','Expecting the worst pessimistically','Avoiding planning','Suppressing feeling'],0,'It is preparation, not gloom.'],
   ['The Stoics regarded emotions as…',['Arising from judgements, and therefore trainable','Purely physical','Always to be suppressed','Irrelevant'],0,'Change the judgement and the emotion changes with it.'],
   ['Applying three ethical frameworks to one dilemma is valuable because…',['Each surfaces considerations the others obscure','One is always right','It avoids deciding','It is traditional'],0,'The disagreements are where the real moral work is.']
  ],
  6:[
   ['A novel’s theme is best described as…',['The idea the work explores about how things are','The plot','The setting','The moral'],0,'Plot is what happens; theme is what it is about.'],
   ['A round character is one who…',['Has complexity and can change convincingly','Appears often','Is likeable','Narrates'],0,'Flat characters are not a flaw — they serve a different function.'],
   ['An unreliable narrator is one whose…',['Account the reader has reason to doubt','Story is sad','Voice is first person','Grammar is poor'],0,'The gap between what is told and what is true carries the meaning.'],
   ['In medias res means the story begins…',['In the middle of the action','At the end','With a description','With dialogue'],0,'The Iliad and the Odyssey both do it.'],
   ['Dramatic irony occurs when…',['The reader knows something a character does not','A character is sarcastic','The ending is sad','Events are coincidental'],0,'The tension comes from the reader’s superior knowledge.'],
   ['A foil character exists to…',['Illuminate another character by contrast','Provide comic relief','Narrate','Resolve the plot'],0,'The contrast is the point, not the character’s own arc.'],
   ['A symbol differs from a motif in that a motif…',['Recurs across the work','Appears once','Is always an object','Is stated directly'],0,'Repetition is what makes a motif do its work.'],
   ['Close reading argues from…',['Specific textual evidence','The author’s biography','Reader consensus','Historical context alone'],0,'Quote the line, then explain how it works.'],
   ['Old books survive mainly because they…',['Address problems that have not stopped being human problems','Are required reading','Are well marketed','Are short'],0,'Relevance, not reputation, is what keeps a book alive.'],
   ['The strongest evidence in a literary essay is…',['A short quotation analysed closely','A long quotation','A plot summary','Another critic’s view'],0,'Summary shows you read it; analysis shows you understood it.']
  ]
 }
};
/* Year Three — units 7 to 9. */
const BANK_Y3={
 code:{
  7:[
   ['HTTP is described as stateless, meaning…',['Each request carries everything needed to serve it','No data can be stored','Sessions are impossible','Connections never close'],0,'Cookies and tokens exist precisely to reintroduce state on top of a stateless protocol.'],
   ['A 401 differs from a 403 because 401 means…',['Not authenticated; 403 means authenticated but not permitted','The page is missing','A server error','A redirect'],0,'Confusing the two leaks information about what exists.'],
   ['In REST, POST /articles and PUT /articles/12 differ in that PUT is…',['Idempotent — repeating it leaves the same result','Faster','Cacheable','Read-only'],0,'Repeating a POST creates a second article; repeating that PUT does not.'],
   ['A 500 status code indicates…',['The server failed to handle a valid request','A missing resource','Bad client input','Successful creation'],0,'Client mistakes belong in the 400 range; blaming the client for your bug hides real failures.'],
   ['Node handles many concurrent connections on one thread because…',['I/O is non-blocking and completions are queued on the event loop','It spawns a thread per request','JavaScript is compiled','It uses less memory'],0,'CPU-bound work still blocks that thread, which is the trade.'],
   ['Middleware in a server framework is…',['A function in the request pipeline that can act and pass control on','A database layer','A template engine','A build step'],0,'Authentication, logging and body parsing are all naturally middleware.'],
   ['A 201 response should normally include…',['A Location header pointing at the created resource','An error body','A redirect','Nothing'],0,'The client should not have to guess where the new thing lives.'],
   ['CORS exists to…',['Let a server declare which other origins may read its responses','Encrypt traffic','Speed up requests','Compress payloads'],0,'The browser enforces it; it is not a server-side security boundary.'],
   ['Query parameters belong in a URL when they…',['Filter or shape a retrieval','Carry passwords','Contain large bodies','Modify state'],0,'URLs land in logs and history, so secrets must never travel in them.'],
   ['Between typing a URL and seeing pixels, the first step is…',['DNS resolution of the hostname to an IP address','Rendering','Parsing HTML','Running JavaScript'],0,'Then TCP, then TLS, then the HTTP request itself.']
  ],
  8:[
   ['A primary key must be…',['Unique and never null','Numeric','Auto-incrementing','Indexed manually'],0,'It is the row’s identity; nulls would make identity undefined.'],
   ['A foreign key enforces…',['That a referenced row actually exists','Uniqueness','Sort order','Encryption'],0,'This is referential integrity, and it is why the database can refuse a bad delete.'],
   ['An INNER JOIN returns…',['Only rows matching in both tables','All rows from the left table','All rows from both','Non-matching rows'],0,'A LEFT JOIN keeps unmatched left rows with nulls on the right.'],
   ['Third normal form primarily eliminates…',['Redundancy, so a fact is stored in exactly one place','All joins','Indexes','Null values'],0,'Duplicated facts drift apart the moment one copy is updated.'],
   ['An index speeds up reads but costs…',['Slower writes and extra storage','Correctness','Query flexibility','Nothing'],0,'Every insert must also update every index on the table.'],
   ['A transaction is atomic, meaning…',['All of its statements commit, or none do','It is fast','It locks the table','It runs alone'],0,'Atomicity is the A in ACID; the money never leaves one account without arriving in the other.'],
   ['SELECT COUNT(*) FROM orders GROUP BY customer_id returns…',['One row per customer, with their order count','A single number','Every order','Customer names'],0,'GROUP BY collapses rows into one per distinct group.'],
   ['WHERE filters rows before grouping; HAVING filters…',['After grouping, on aggregate results','Before grouping','Only indexes','Only joins'],0,'HAVING COUNT(*) > 5 cannot be expressed in WHERE.'],
   ['SQL injection is prevented by…',['Parameterised queries that never concatenate input into SQL','Escaping quotes manually','Hiding the query','Using POST'],0,'Parameters keep data and code in separate channels, which is the whole fix.'],
   ['A migration file exists so that…',['Schema changes are versioned, reviewable and repeatable','The database runs faster','Backups are automatic','Queries are shorter'],0,'Hand-edited production schemas cannot be reproduced or rolled back.']
  ],
  9:[
   ['Passwords must be stored…',['Hashed with a slow, salted algorithm such as bcrypt or Argon2','Encrypted','In plain text','Base64 encoded'],0,'Encryption is reversible; hashing is the point. Slowness defeats brute force.'],
   ['A salt prevents…',['Identical passwords producing identical hashes, defeating rainbow tables','Brute force entirely','Network sniffing','SQL injection'],0,'It must be unique per user, and it is not a secret.'],
   ['Base64 is not encryption because it…',['Is trivially reversible with no key','Is too short','Is slow','Uses ASCII'],0,'It is an encoding for transport, and treating it as security is a classic error.'],
   ['XSS is best prevented by…',['Escaping or encoding untrusted data on output','Validating on input only','Using HTTPS','Hiding the source'],0,'Context matters — HTML, attribute and JavaScript contexts each escape differently.'],
   ['A CSRF attack works by…',['Making a victim’s browser send an authenticated request they did not intend','Stealing the database','Guessing passwords','Reading memory'],0,'Anti-CSRF tokens and SameSite cookies are the standard defences.'],
   ['The HttpOnly cookie flag stops…',['JavaScript from reading the cookie, limiting XSS damage','All cookie theft','CSRF','Session expiry'],0,'It reduces the blast radius of an XSS bug; it does not prevent one.'],
   ['A JWT is signed rather than encrypted, which means…',['Anyone can read its contents, but not alter them undetected','It is secret','It cannot expire','It is compressed'],0,'Never put anything confidential in a JWT payload.'],
   ['Principle of least privilege means…',['Granting only the access strictly required','Granting admin by default','Denying all access','Auditing after the fact'],0,'A compromised component should be able to do as little as possible.'],
   ['Secrets belong in…',['Environment variables or a secret manager, never in the repository','A config file in git','The frontend bundle','A code comment'],0,'A key committed once lives in the history forever.'],
   ['Rate limiting on a login endpoint defends against…',['Credential stuffing and brute force','SQL injection','XSS','CSRF'],0,'Without it, a leaked password list can be tested at machine speed.']
  ]
 },
 mkt:{
  7:[
   ['Search intent matters more than volume because…',['A low-volume buying-intent phrase converts far better than a high-volume informational one','Volume is fake','Google ignores volume','Intent is easier to rank'],0,'"Pressure washing near me" beats "how does pressure washing work" for a service business.'],
   ['A title tag should…',['Contain the target phrase and read as a compelling result','Repeat the keyword many times','Be as long as possible','Match the H1 exactly'],0,'It is both a ranking signal and the advertisement in the result page.'],
   ['Backlinks act as a ranking signal because they…',['Function as third-party votes of confidence','Increase page speed','Add keywords','Improve design'],0,'Which is why relevance and authority of the linking site matter more than count.'],
   ['For a local service business, the highest-leverage SEO action is usually…',['Completing and maintaining a Google Business Profile','Buying links','Blogging daily','Adding meta keywords'],0,'Local pack visibility drives calls in a way that ordinary listings do not.'],
   ['Core Web Vitals matter to SEO because they measure…',['Real user experience such as loading and interaction responsiveness','Keyword density','Backlink quality','Content length'],0,'Slow pages lose rankings and conversions at the same time.'],
   ['Duplicate content across URLs is best resolved with…',['A canonical tag naming the preferred URL','Deleting the pages','Blocking crawlers','Adding keywords'],0,'It consolidates signals rather than splitting them.'],
   ['A sitemap primarily helps search engines…',['Discover pages efficiently','Rank pages higher','Compress content','Block competitors'],0,'Discovery is not ranking; the sitemap only gets you looked at.'],
   ['Writing for the search phrase rather than the reader tends to…',['Rank briefly and convert poorly','Always rank first','Improve authority','Increase backlinks'],0,'Search engines increasingly measure whether the reader was satisfied.'],
   ['The advantage of organic search over paid is that it…',['Compounds and continues earning after the work stops','Is faster','Is easier','Guarantees position'],0,'Paid stops the moment the budget does.'],
   ['robots.txt disallow tells a crawler…',['Not to crawl a path, though the URL may still be indexed','To delete the page','To rank it lower','To ignore links'],0,'To keep something out of the index, use a noindex directive instead.']
  ],
  8:[
   ['A brand is best defined as…',['The expectation a customer holds before you speak','A logo','A colour palette','A slogan'],0,'The visual identity is a signal of the brand, not the brand itself.'],
   ['Category design matters because…',['Being first in a category people understand beats being better in a crowded one','Categories are free','It avoids competition entirely','It lowers costs'],0,'You would rather be the only obvious choice than the marginally superior one.'],
   ['A brand guide exists to…',['Keep every touchpoint consistent as more people produce work','Impress investors','Satisfy designers','Fix pricing'],0,'Consistency is what converts repetition into recognition.'],
   ['A logo should survive being printed in one colour because…',['It must work at every size and medium, not just on screen','Colour printing is expensive','Clients prefer it','It is a legal rule'],0,'If it only works in full colour at large size, it is an illustration, not a mark.'],
   ['Brand voice is best documented as…',['Concrete examples of what you do and do not say','A list of adjectives','A font choice','A mission statement'],0,'"We never say synergy" is actionable; "we are approachable" is not.'],
   ['Brand equity shows up commercially as…',['The ability to charge more for the same thing','Higher costs','More employees','Larger reach'],0,'Pricing power is the measurable output of a strong brand.'],
   ['Rebranding is most often a mistake when…',['The real problem is the offer or the product','The logo is dated','Competitors rebranded','Sales are flat'],0,'A new coat of paint on a weak offer changes nothing.'],
   ['Consistency across channels matters because…',['Recognition is built by repetition of the same signals','Algorithms require it','It is cheaper','Customers demand it'],0,'Every inconsistent touchpoint resets the accumulation.'],
   ['The strongest differentiator is usually…',['Something structurally hard for a competitor to copy','A lower price','A nicer logo','A larger ad budget'],0,'Price is the easiest thing in the world to match.'],
   ['A positioning statement should name…',['The audience, the category, the benefit and the reason to believe','Only the product','The price','The founder'],0,'Missing any one of the four leaves the reader unable to place you.']
  ],
  9:[
   ['The purpose of a discovery call is to…',['Establish whether and why there is a real problem worth solving','Pitch the product','Quote a price','Close immediately'],0,'Diagnosis before prescription; pitching first is malpractice.'],
   ['Open questions outperform closed ones in sales because they…',['Surface the buyer’s own reasoning and priorities','Take less time','Sound friendlier','Avoid objections'],0,'You learn what they actually value, in their words.'],
   ['A CRM pipeline stage should represent…',['A verifiable change in buyer behaviour','How you feel about the deal','Time elapsed','Deal size'],0,'"Proposal sent" is verifiable; "interested" is a feeling.'],
   ['"Your price is too high" most often means…',['The value has not been established yet','You must discount','The buyer cannot pay','The deal is dead'],0,'Price objections are usually value problems wearing a disguise.'],
   ['The most common cause of lost deals is…',['Inadequate follow-up','Price','Product gaps','Competition'],0,'Most buyers need several contacts, and most sellers stop after one.'],
   ['Qualifying out a bad-fit prospect early is valuable because…',['It protects the time that closes good-fit deals','It reduces competition','It raises prices','It improves marketing'],0,'A fast no is worth far more than a slow maybe.'],
   ['Close rate is calculated as…',['Deals won divided by qualified opportunities','Revenue divided by leads','Leads divided by visitors','Calls divided by emails'],0,'Mixing unqualified leads into the denominator hides the real problem.'],
   ['Talking less than the buyer on a discovery call generally…',['Correlates with higher close rates','Signals weakness','Wastes time','Reduces trust'],0,'Recorded-call research consistently finds sellers who listen more close more.'],
   ['A proposal should be sent…',['After the problem and its cost are agreed','Immediately on first contact','Before discovery','Only when asked'],0,'A proposal is a summary of an agreement already reached in conversation.'],
   ['Following up without new value tends to…',['Erode goodwill — each touch should add something','Always help','Be neutral','Close deals'],0,'"Just checking in" asks the buyer to do the work of remembering why they cared.']
  ]
 },
 math:{
  7:[
   ['A critical point occurs where f′(x) is…',['Zero or undefined','Positive','Negative','Increasing'],0,'These are the only candidates for interior maxima and minima.'],
   ['If f′(c) = 0 and f″(c) > 0, then c is…',['A local minimum','A local maximum','An inflection point','Undefined'],0,'Concave up at a flat point means the curve turns upward there.'],
   ['An inflection point is where…',['Concavity changes sign','The slope is zero','The function is undefined','The maximum occurs'],0,'It requires f″ to change sign, not merely to equal zero.'],
   ['To maximise the area of a rectangle with perimeter 40, the correct dimensions are…',['10 by 10','15 by 5','19 by 1','12 by 8'],0,'For a fixed perimeter the square maximises area: 100 versus 75, 19 and 96.'],
   ['In a related rates problem you differentiate…',['Both sides of a relating equation with respect to time','Only the left side','With respect to x','After substituting values'],0,'Substituting numbers before differentiating is the classic mistake — it freezes the variables.'],
   ['The mean value theorem guarantees a point where…',['The instantaneous rate equals the average rate over the interval','The function is zero','The derivative is zero','The function is maximised'],0,'Rolle’s theorem is the special case where the endpoints are equal.'],
   ['On a closed interval, an absolute extremum must occur…',['At a critical point or an endpoint','Only at a critical point','Only at an endpoint','At an inflection point'],0,'Endpoints are easy to forget and are frequently the answer.'],
   ['If f′(x) < 0 and f″(x) > 0, the graph is…',['Decreasing and concave up','Increasing and concave up','Decreasing and concave down','Increasing and concave down'],0,'Falling, but flattening out as it falls.'],
   ['L’Hôpital’s rule applies only to limits of the form…',['0/0 or ∞/∞','Any quotient','0 × ∞ directly','a/0 with a ≠ 0'],0,'Other indeterminate forms must first be algebraically rewritten into one of these.'],
   ['Marginal cost in economics corresponds to…',['The derivative of the cost function','The average cost','Total cost','Fixed cost'],0,'It is the cost of producing one more unit — a rate of change.']
  ],
  8:[
   ['The integral of 3x² dx is',['x³ + C','3x³ + C','6x + C','x³'],0,'Reverse the power rule, and never omit the constant of integration.'],
   ['∫₀² 2x dx =',['4','2','8','0'],0,'The antiderivative is x², evaluated as 4 − 0.'],
   ['The fundamental theorem of calculus links…',['Differentiation and integration as inverse operations','Limits and continuity','Series and sequences','Vectors and matrices'],0,'It is why definite integrals can be evaluated without limits of sums.'],
   ['A Riemann sum approximates…',['The area under a curve using rectangles','The slope','The derivative','A limit at a point'],0,'The definite integral is its limit as the rectangle width goes to zero.'],
   ['∫ 1/x dx =',['ln|x| + C','x⁻² + C','1/x² + C','ln x'],0,'The absolute value matters, since the domain includes negative x.'],
   ['Integration by substitution reverses…',['The chain rule','The product rule','The quotient rule','The power rule'],0,'Integration by parts is the reverse of the product rule.'],
   ['∫ cos(x) dx =',['sin(x) + C','−sin(x) + C','cos(x) + C','tan(x) + C'],0,'Differentiating sin(x) returns cos(x), which confirms it.'],
   ['A definite integral evaluating to a negative number means…',['Net signed area, with more area below the axis','An error','Zero area','Divergence'],0,'For total geometric area you must integrate the absolute value.'],
   ['Integration by parts uses the formula…',['∫u dv = uv − ∫v du','∫u dv = uv + ∫v du','∫uv = ∫u∫v','∫u dv = u∫dv'],0,'Choosing u to simplify on differentiation is the whole skill.'],
   ['The volume of a solid of revolution by the disc method integrates…',['πr² along the axis of rotation','2πr','r²','πr'],0,'Each infinitesimal slice is a disc whose area is πr².']
  ],
  9:[
   ['The geometric series Σ rⁿ converges when…',['|r| < 1','r > 1','r = 1','r is an integer'],0,'Otherwise the terms do not approach zero and the sum grows without bound.'],
   ['If the terms of a series do not approach zero, the series…',['Diverges','Converges','May converge','Converges conditionally'],0,'The nth-term test can only prove divergence, never convergence.'],
   ['The harmonic series Σ 1/n…',['Diverges, though its terms approach zero','Converges to 1','Converges to e','Oscillates'],0,'The classic proof that vanishing terms are not sufficient for convergence.'],
   ['The Maclaurin series for eˣ is…',['Σ xⁿ/n!','Σ xⁿ','Σ n!xⁿ','Σ x/n'],0,'Every derivative of eˣ is 1 at zero, which produces the factorials.'],
   ['A Taylor series expands a function about…',['A chosen point, using its derivatives there','Zero only','Infinity','Its roots'],0,'The Maclaurin series is the special case centred at zero.'],
   ['A separable differential equation can be written as…',['dy/dx = g(x)h(y), then integrated after separating','y = mx + b','A polynomial','A matrix equation'],0,'Collect y terms on one side and x terms on the other, then integrate both.'],
   ['Exponential growth arises from the differential equation…',['dy/dt = ky','dy/dt = k','dy/dt = kt','dy/dt = k/y'],0,'Rate proportional to current amount gives y = y₀e^{kt}.'],
   ['The ratio test concludes convergence when the limiting ratio is…',['Less than 1','Greater than 1','Exactly 1','Negative'],0,'A limit of exactly 1 is inconclusive and needs another test.'],
   ['An alternating series converges if its terms…',['Decrease monotonically to zero','Are positive','Are bounded','Increase'],0,'This is the alternating series test.'],
   ['A power series has a radius of convergence R, meaning it converges for…',['|x − a| < R','All x','Only x = a','x > R'],0,'The endpoints must always be tested separately.']
  ]
 },
 sci:{
  7:[
   ['The angle of incidence equals the angle of reflection, both measured from…',['The normal to the surface','The surface itself','The horizontal','The light source'],0,'Measuring from the surface is a common and costly error.'],
   ['Light entering glass from air…',['Slows and bends toward the normal','Speeds up','Bends away from the normal','Is unaffected'],0,'Snell’s law, with the higher refractive index on the glass side.'],
   ['Total internal reflection requires…',['Light travelling into a less dense medium beyond the critical angle','A mirror','A vacuum','Monochromatic light'],0,'It is what makes fibre optics possible.'],
   ['The double-slit experiment demonstrates that light…',['Interferes, and therefore behaves as a wave','Is a particle only','Travels in straight lines','Has mass'],0,'Doing it one photon at a time is what makes the result genuinely strange.'],
   ['The photoelectric effect broke classical physics because emission depended on…',['Frequency, not intensity','Intensity only','Temperature','Wavelength alone'],0,'Below a threshold frequency, no brightness whatsoever ejects an electron.'],
   ['Einstein explained the photoelectric effect by proposing that light…',['Arrives in quanta of energy E = hf','Is a continuous wave','Has mass','Travels instantly'],0,'It is the work that earned him the Nobel Prize, not relativity.'],
   ['Emission spectra are discrete lines because…',['Electrons occupy quantised energy levels','Atoms are small','Light is a wave','Gases are hot'],0,'Each line corresponds to one specific transition between levels.'],
   ['The de Broglie hypothesis states that matter…',['Has an associated wavelength λ = h/p','Cannot be a wave','Is made of light','Has no momentum'],0,'Confirmed by electron diffraction, which is why electron microscopes work.'],
   ['A converging lens forms a real image when the object is…',['Beyond the focal point','Inside the focal point','At the lens','At infinity only'],0,'Inside the focal length it produces a virtual, magnified image instead.'],
   ['Diffraction becomes noticeable when the aperture is…',['Comparable to the wavelength','Much larger than the wavelength','Perfectly square','Made of glass'],0,'It is why sound diffracts around doorways and visible light essentially does not.']
  ],
  8:[
   ['The two postulates of special relativity are the invariance of physical laws and…',['The constancy of the speed of light for all inertial observers','The existence of ether','Absolute time','Newtonian gravity'],0,'Everything else follows from taking those two seriously.'],
   ['Time dilation means a moving clock…',['Runs slow as measured in the observer’s frame','Runs fast','Stops','Is unaffected'],0,'Each observer sees the other’s clock as slow, which is why simultaneity must go.'],
   ['Length contraction occurs…',['Along the direction of motion only','In all directions','Perpendicular to motion','Only at rest'],0,'Transverse dimensions are unchanged.'],
   ['The relativity of simultaneity means…',['Two events simultaneous in one frame need not be in another','Time does not exist','Clocks are inaccurate','Light is instantaneous'],0,'This is what resolves most apparent paradoxes.'],
   ['E = mc² states that…',['Mass and energy are the same quantity in different units','Mass becomes energy when burned','Energy has no mass','c is a speed limit only'],0,'It applies to a system at rest; the full relation includes a momentum term.'],
   ['In the twin paradox, the travelling twin ages less because…',['They change inertial frames, breaking the symmetry','Motion always slows time','Gravity is stronger','They are younger'],0,'Acceleration is what distinguishes the two histories.'],
   ['As an object approaches the speed of light, the energy required to accelerate it further…',['Grows without bound','Stays constant','Decreases','Becomes zero'],0,'Which is why a massive object can never reach c.'],
   ['The Lorentz factor γ equals 1 when…',['The relative velocity is zero','v equals c','v is very large','Mass is zero'],0,'Relativistic effects are always present, just negligible at everyday speeds.'],
   ['Spacetime interval is invariant, meaning…',['All inertial observers agree on it, even when they disagree on space and time separately','It is always zero','It equals distance','It is frame-dependent'],0,'It is the quantity that replaces absolute distance and absolute time.'],
   ['GPS satellites must correct for relativity because…',['Both velocity and gravitational potential shift their clocks','They move fast only','Of magnetic fields','Of atmospheric drag'],0,'Uncorrected, positions would drift by kilometres a day.']
  ],
  9:[
   ['The periodic table is arranged by…',['Increasing atomic number, grouping similar electron configurations','Atomic mass','Discovery date','Density'],0,'Columns share valence structure, which is why they behave alike.'],
   ['An ionic bond forms when…',['Electrons transfer, producing oppositely charged ions','Electrons are shared equally','Atoms collide','Protons move'],0,'Covalent bonds share; metallic bonds delocalise.'],
   ['A mole contains…',['6.022 × 10²³ particles','1000 particles','One gram','A litre'],0,'Avogadro’s number is a counting unit, not a mass.'],
   ['Balancing a chemical equation enforces…',['Conservation of mass — atoms of each element are equal on both sides','Conservation of energy','Equal volumes','Equal charges only'],0,'You may change coefficients but never subscripts.'],
   ['An exothermic reaction…',['Releases energy to the surroundings','Absorbs energy','Has no energy change','Always explodes'],0,'Its enthalpy change is negative.'],
   ['Le Chatelier’s principle says a system at equilibrium responds to a stress by…',['Shifting to partially oppose the change','Stopping','Reversing completely','Exploding'],0,'It is how ammonia synthesis conditions are chosen industrially.'],
   ['A catalyst increases reaction rate by…',['Lowering the activation energy','Increasing temperature','Adding energy','Changing the equilibrium position'],0,'It speeds both directions equally, so equilibrium is unmoved.'],
   ['A pH of 3 is how many times more acidic than a pH of 6?',['1000','3','2','300'],0,'The scale is logarithmic: three units is a factor of 10³.'],
   ['Oxidation is defined as…',['Loss of electrons','Gain of electrons','Adding water','Losing mass'],0,'Reduction is gain — the standard mnemonic is OIL RIG.'],
   ['The ideal gas law states…',['PV = nRT','PV = nR','P = VnRT','PV = T/nR'],0,'Real gases deviate at high pressure and low temperature.']
  ]
 },
 eng:{
  7:[
   ['Descartes’ method of doubt aimed to…',['Find a foundation immune to all possible doubt','Prove God first','Reject reason','Defend tradition'],0,'The cogito is what survives the demolition.'],
   ['"Cogito, ergo sum" establishes…',['That the doubter must exist in order to doubt','That God exists','That the senses are reliable','That matter is real'],0,'The act of doubting is self-refuting evidence of a doubter.'],
   ['Empiricists hold that knowledge comes primarily from…',['Sense experience','Pure reason','Divine revelation','Innate ideas'],0,'Locke and Hume against Descartes and Leibniz.'],
   ['Hume’s problem of induction points out that…',['Past regularity cannot logically guarantee future regularity','Experiments are unreliable','Reason is useless','Causation is obvious'],0,'The sun rising a million times entails nothing with certainty about tomorrow.'],
   ['Kant’s synthesis claims that the mind…',['Actively structures experience through categories it supplies','Passively receives data','Cannot know anything','Invents reality'],0,'Space, time and causality are contributions of the knower.'],
   ['The categorical imperative tests an action by asking…',['Whether its maxim could be willed as a universal law','Whether it feels right','Whether it maximises happiness','Whether it is legal'],0,'A second formulation forbids treating people merely as means.'],
   ['A priori knowledge is knowledge…',['Independent of experience','From experience','That is uncertain','That is scientific'],0,'"All bachelors are unmarried" needs no survey.'],
   ['Kant distinguished the phenomenal world from the noumenal, meaning…',['Things as they appear to us versus things as they are in themselves','Mind and body','Good and evil','Reason and emotion'],0,'He argued the noumenal is permanently beyond our knowledge.'],
   ['Hume argued that our idea of causation comes from…',['Habitual expectation after repeated conjunction','Direct perception of causal force','Logical deduction','Divine guarantee'],0,'We see one event follow another; we never see the necessity linking them.'],
   ['Epistemology is the study of…',['Knowledge — its nature, sources and limits','Being','Morality','Beauty'],0,'Metaphysics asks what exists; epistemology asks how we could know.']
  ],
  8:[
   ['In propositional logic, P → Q is false only when…',['P is true and Q is false','Both are false','Both are true','P is false'],0,'A false antecedent makes the conditional vacuously true.'],
   ['The contrapositive of P → Q is…',['¬Q → ¬P','¬P → ¬Q','Q → P','P → ¬Q'],0,'It is logically equivalent; the converse Q → P is not.'],
   ['Affirming the consequent is a fallacy of the form…',['P → Q, Q, therefore P','P → Q, P, therefore Q','P → Q, ¬Q, therefore ¬P','P or Q, ¬P, therefore Q'],0,'The second is modus ponens and is valid.'],
   ['Modus tollens has the form…',['P → Q, ¬Q, therefore ¬P','P → Q, Q, therefore P','P → Q, P, therefore Q','¬P → Q'],0,'Denying the consequent denies the antecedent.'],
   ['A valid argument with a false conclusion must have…',['At least one false premise','No premises','A logical error','A true conclusion'],0,'Validity preserves truth; it cannot manufacture it.'],
   ['Confirmation bias is the tendency to…',['Seek and weight evidence that supports what you already believe','Trust experts','Change your mind too readily','Avoid evidence'],0,'The remedy is actively seeking the strongest disconfirming case.'],
   ['The base rate fallacy is ignoring…',['How common the condition is in the population','The sample size','The margin of error','The test result'],0,'A very accurate test for a very rare disease still yields mostly false positives.'],
   ['The conjunction fallacy is judging P and Q more probable than…',['P alone','P or Q','Neither','Both'],0,'A conjunction can never be more probable than either conjunct.'],
   ['Falsifiability, per Popper, means a scientific claim must…',['Be capable in principle of being shown false','Be proven true','Be mathematical','Be repeatable'],0,'A theory compatible with every possible observation explains nothing.'],
   ['Anchoring describes how judgements are pulled toward…',['An initial number, even an irrelevant one','The average','The most recent value','The extreme'],0,'It is why the first number named in a negotiation matters so much.']
  ],
  9:[
   ['A peer-reviewed article differs from a blog post chiefly in that it has…',['Been scrutinised by qualified specialists before publication','More words','Better writing','More citations'],0,'Review is imperfect, but it is a filter that self-publishing lacks.'],
   ['Citing a source serves primarily to…',['Let a reader verify the claim and trace the idea','Lengthen the essay','Impress the marker','Avoid writing'],0,'Plagiarism avoidance follows from verification, not the other way round.'],
   ['Steelmanning an opposing view means…',['Arguing against its strongest form','Ignoring it','Misrepresenting it','Quoting it at length'],0,'Defeating the weak version proves nothing.'],
   ['A literature review should…',['Synthesise sources into an argument about the state of the question','List sources one by one','Summarise each source','Quote extensively'],0,'An annotated list is not a review.'],
   ['Paraphrasing without citation is…',['Still plagiarism','Acceptable','Only a style issue','Fine if reworded'],0,'The idea is borrowed even when the words are not.'],
   ['A primary source in historical research is…',['A document produced at the time by a participant','A textbook','A modern analysis','An encyclopaedia'],0,'Secondary sources interpret primary ones and can inherit their errors.'],
   ['Cherry-picking sources produces…',['A conclusion that was decided before the research began','A balanced view','Stronger evidence','A shorter essay'],0,'Honest research reports the evidence that cost you your first hypothesis.'],
   ['A long essay holds together when…',['Each section advances one overall argument','Each section is interesting','It is well referenced','It reaches the word count'],0,'Structure is argument made visible.'],
   ['Cutting a finished draft by twenty percent typically…',['Strengthens it, because the weakest material goes first','Damages the argument','Removes evidence','Is unnecessary'],0,'Length is not rigour; most drafts carry a fifth in padding.'],
   ['Intellectual honesty in research requires reporting…',['Evidence that weakens your thesis as well as evidence that supports it','Only strong evidence','Only recent sources','Only agreeing sources'],0,'Concealing the counter-evidence is the failure that discredits everything else.']
  ]
 }
};

/* Year Four — units 10 to 12. The capstone year. */
const BANK_Y4={
 code:{
  10:[
   ['Declarative UI means you describe…',['What the interface should look like for a given state','Each DOM mutation in order','The network layer','The build process'],0,'The framework works out the mutations; you stop hand-writing them.'],
   ['React state differs from props in that state is…',['Owned and mutable by the component itself','Passed from the parent','Always global','Read-only'],0,'Props flow down; state is local until you lift it.'],
   ['Lifting state up means moving it…',['To the closest common ancestor of the components that need it','Into global scope','Into the server','Into a context always'],0,'It is the standard fix for two siblings that must stay in sync.'],
   ['A key prop on a list item lets the framework…',['Match elements across renders so state is preserved correctly','Sort the list','Style the item','Cache the data'],0,'Using an array index as key breaks on reorder or deletion.'],
   ['A pure component renders…',['The same output for the same props and state','Faster always','Without children','Only once'],0,'Purity is what makes memoisation and time-travel debugging possible.'],
   ['Side effects belong in an effect hook rather than the render body because…',['Render must stay pure and may run more than once','Effects are faster','It is a style rule','Render cannot use variables'],0,'A fetch in the render body can fire repeatedly and unpredictably.'],
   ['An effect’s dependency array controls…',['When the effect re-runs','How fast it runs','Whether it is async','Its return value'],0,'An empty array means once after mount; omitting it means after every render.'],
   ['Composition is preferred over inheritance in component design because it…',['Combines small independent pieces without rigid hierarchies','Is faster','Uses less memory','Is required by the language'],0,'Passing children and props scales where deep class trees do not.'],
   ['Controlled inputs keep the value in…',['Component state, with the DOM following it','The DOM only','Local storage','The server'],0,'One source of truth, which is what makes validation straightforward.'],
   ['Premature memoisation is a problem because it…',['Adds complexity and its own cost without measured benefit','Breaks rendering','Is unsupported','Slows the build'],0,'Measure first: most components are not the bottleneck.']
  ],
  11:[
   ['Horizontal scaling means…',['Adding more machines','Adding more CPU to one machine','Reducing load','Caching more'],0,'Vertical scaling hits a ceiling; horizontal needs statelessness to work.'],
   ['A load balancer in front of several servers requires that they be…',['Stateless, or that session state be shared externally','Identical in hardware','In one region','Single-threaded'],0,'Otherwise a user’s second request lands on a server that has never seen them.'],
   ['A cache primarily trades…',['Freshness for speed','Correctness for cost','Memory for disk','Security for speed'],0,'Which is why invalidation is the hard part.'],
   ['A CDN improves performance mainly by…',['Serving assets from a location near the user','Compressing code','Reducing bugs','Caching database queries'],0,'Latency is bounded by physics; moving the bytes closer is the fix.'],
   ['CI differs from CD in that continuous integration…',['Builds and tests every change on merge','Deploys to production','Monitors uptime','Manages secrets'],0,'CD carries a passing build onward to release.'],
   ['A database read replica helps when the workload is…',['Read-heavy','Write-heavy','Purely in-memory','Single-user'],0,'Writes still bottleneck on the primary, and replicas lag.'],
   ['The CAP theorem says that during a network partition a system must choose between…',['Consistency and availability','Cost and performance','Speed and security','Reads and writes'],0,'Partitions are not optional, so the real choice is CP or AP.'],
   ['Structured logging is preferable because it…',['Can be queried and aggregated, not just read','Is smaller','Is human-readable only','Is faster to write'],0,'Free-text logs are unsearchable at the moment you most need them.'],
   ['An alert should fire when…',['A human needs to act now','Any error occurs','Traffic changes','A deploy happens'],0,'Alerts that do not require action train you to ignore alerts.'],
   ['A blue-green deployment reduces risk by…',['Keeping the previous version running so rollback is immediate','Deploying slowly','Testing more','Reducing traffic'],0,'The rollback path is the feature, not the deployment itself.']
  ],
  12:[
   ['A README’s first job is to tell a reader…',['What the project does and how to run it','Who wrote it','The licence','The file structure'],0,'If a stranger cannot start it in five minutes, the README failed.'],
   ['Semantic versioning increments the major number when…',['A backwards-incompatible change is made','Any feature is added','A bug is fixed','The docs change'],0,'Minor for compatible features, patch for fixes.'],
   ['An environment variable is preferred over a hard-coded value because it…',['Lets the same build run in different environments without edits','Is faster','Is encrypted','Is versioned'],0,'One artifact, many environments, no rebuild.'],
   ['Graceful degradation means the application…',['Still delivers core function when a dependency fails','Shuts down cleanly','Retries forever','Logs everything'],0,'A failing recommendations service should not take down checkout.'],
   ['An error message shown to a user should…',['Say what happened and what they can do next','Include the stack trace','Say "an error occurred"','Be hidden'],0,'Stack traces belong in your logs, not in front of a customer.'],
   ['Shipping to real users first reveals…',['Assumptions that were wrong, which testing alone rarely surfaces','Nothing new','Only performance issues','Only design flaws'],0,'Every project has assumptions the author cannot see from inside.'],
   ['Technical debt is best described as…',['A deliberate trade of future cost for present speed','Bad code','Old code','Missing tests'],0,'Debt taken knowingly and repaid is a tool; debt taken unknowingly is a trap.'],
   ['The most important thing to monitor after launch is…',['Whether users complete the action the product exists for','CPU usage','Line count','Deploy frequency'],0,'Green infrastructure dashboards above a broken funnel are a false comfort.'],
   ['A rollback plan should be written…',['Before the deploy','After a failure','Only for major releases','Never'],0,'Designing it during an outage is how outages get longer.'],
   ['The strongest evidence that you have learned to build software is…',['A stranger uses what you built without your help','A finished tutorial','A passing exam','A large repository'],0,'Everything in this program has been pointing at exactly that.']
  ]
 },
 mkt:{
  10:[
   ['Gross margin is calculated as…',['(Revenue − cost of goods sold) ÷ revenue','Revenue − all expenses','Profit ÷ costs','Revenue ÷ units'],0,'It measures the money left to cover everything else.'],
   ['Customer acquisition cost includes…',['All sales and marketing spend divided by customers acquired','Ad spend only','Fulfilment cost','Salaries only'],0,'Excluding labour flatters the number and misleads the decision.'],
   ['Lifetime value depends most on…',['Margin per purchase, purchase frequency and retention','Revenue alone','Follower count','Ad spend'],0,'Retention is the term most businesses under-invest in.'],
   ['A price increase with inelastic demand causes revenue to…',['Rise, because volume falls less than price rose','Fall','Stay flat','Become unpredictable'],0,'Testing this empirically beats assuming your customers are price-sensitive.'],
   ['Contribution margin measures…',['Revenue minus variable costs per unit','Total profit','Fixed costs','Gross revenue'],0,'It tells you what each additional sale actually contributes to fixed costs.'],
   ['Payback period is important to cash flow because…',['You fund acquisition before the customer repays it','It measures profit','It sets price','It predicts churn'],0,'A profitable business can still run out of money by growing.'],
   ['A business at 3x volume most often breaks first at…',['Delivery capacity and cash flow','Marketing','Branding','Pricing'],0,'Demand is rarely the constraint that actually bites when you scale.'],
   ['Discounting to win a price-sensitive customer risks…',['Attracting buyers who churn and never pay full price','Nothing','Higher margins','Better retention'],0,'You train a segment to wait for the next discount.'],
   ['Fixed costs differ from variable costs in that fixed costs…',['Do not change with volume in the short run','Are larger','Are avoidable','Change per unit'],0,'High fixed costs raise both the break-even point and the operating leverage.'],
   ['Pricing power ultimately comes from…',['Differentiation the customer values and cannot easily substitute','Low costs','Large volume','Advertising spend'],0,'It is the commercial payoff of everything in the branding unit.']
  ],
  11:[
   ['Churn rate measures…',['The share of customers lost over a period','New customers','Revenue growth','Visit frequency'],0,'Small differences in churn compound enormously over time.'],
   ['Retention usually beats acquisition economically because…',['Selling to an existing customer costs far less','New customers spend more','It is easier to measure','Ads are expensive'],0,'The existing customer needs no acquisition spend and already trusts you.'],
   ['A referral loop is powerful because…',['Each customer can produce more customers at near-zero marginal cost','Referrals are free','It replaces marketing','It is fast'],0,'It has to be built deliberately; it rarely appears on its own.'],
   ['A win-back campaign targets…',['Lapsed customers who already know the product','Cold prospects','Current customers','Competitors'],0,'They are the warmest audience you are not currently talking to.'],
   ['Net revenue retention above 100% means…',['Existing customers grow enough to outweigh those lost','No churn','New sales are strong','Prices rose'],0,'The business grows even with no new customers at all.'],
   ['Cohort retention curves that flatten indicate…',['A stable core of customers who keep returning','Total churn','Measurement error','Seasonality'],0,'A curve that decays to zero means no lasting product-market fit.'],
   ['The most valuable moment for retention is usually…',['The first experience after purchase','The renewal date','The second year','The first ad'],0,'Onboarding is where most churn is decided, long before it is recorded.'],
   ['Sending more email to a lapsing customer typically…',['Accelerates unsubscribes unless the value is real','Always helps','Is neutral','Improves deliverability'],0,'Frequency without relevance is how a list is destroyed.'],
   ['Measuring repeat purchase rate requires…',['Identifying customers across transactions','Counting orders','Counting visitors','Tracking ads'],0,'Without identity resolution, every purchase looks like a new customer.'],
   ['A loyalty programme works only when it…',['Rewards behaviour the business actually wants to increase','Is generous','Is complicated','Is universal'],0,'Discounting behaviour customers would have shown anyway is pure margin loss.']
  ],
  12:[
   ['A go-to-market plan must specify…',['Who, what offer, through which channel, at what cost, measured how','A budget only','A logo','A timeline'],0,'Any missing element makes the plan unexecutable.'],
   ['The first thing to validate in a new market is…',['That the problem is real and painful enough to pay for','That the product works','That the brand is strong','That competitors exist'],0,'Everything downstream is wasted if this is false.'],
   ['A 90-day plan should be judged against…',['Outcomes committed to in advance','Effort expended','Activity volume','Competitor moves'],0,'Retrofitting the target to the result is how teams lie to themselves.'],
   ['A leading indicator differs from a lagging one in that it…',['Predicts future results and can still be acted on','Is more accurate','Is measured later','Is financial'],0,'Revenue is lagging; booked calls this week is leading.'],
   ['Competitor presence in a market usually signals…',['That money is being spent there','That entry is hopeless','A saturated market','Low margins'],0,'An empty market is more often a warning than an opportunity.'],
   ['The correct response to a channel that stops working is to…',['Diagnose whether it is the offer, the creative or the audience','Abandon it immediately','Increase spend','Wait it out'],0,'Most channel "deaths" are creative fatigue with a different name.'],
   ['A post-mortem is valuable primarily when it…',['Names what you would not repeat, specifically','Assigns blame','Celebrates wins','Is thorough'],0,'A post-mortem without a changed decision is a diary entry.'],
   ['Reporting actual revenue against plan matters because…',['It is the only test of whether the strategy worked','Investors require it','It is traditional','It motivates staff'],0,'Marketing that cannot be tied to revenue is decoration.'],
   ['Concentrating on one channel until it works usually beats spreading thin because…',['Each channel needs sustained iteration to reach competence','Channels are expensive','It is simpler','Reach is higher'],0,'Five half-run channels produce five inconclusive results.'],
   ['The capstone test of this course is whether you can…',['Produce revenue you predicted, and explain the gap where you did not','Write a plan','Pass an exam','Describe a funnel'],0,'The market is the examiner; everything else is rehearsal.']
  ]
 },
 math:{
  10:[
   ['A vector space requires that it be closed under…',['Addition and scalar multiplication','Multiplication of vectors','Division','Composition'],0,'Those two operations, with the axioms, define the whole structure.'],
   ['The span of a set of vectors is…',['All linear combinations of them','Their sum','Their length','Their dot product'],0,'It is always a subspace containing the origin.'],
   ['Vectors are linearly independent when…',['No one of them is a linear combination of the others','They are perpendicular','They have unit length','There are exactly two'],0,'Independence, not orthogonality, is what a basis requires.'],
   ['A square matrix is invertible if and only if its determinant is…',['Non-zero','Positive','One','Zero'],0,'A zero determinant means the transformation collapses space and loses information.'],
   ['Geometrically, the determinant of a 2×2 matrix gives…',['The signed area scaling factor of the transformation','The rotation angle','The vector length','The trace'],0,'A negative determinant means orientation is flipped.'],
   ['An eigenvector of A satisfies…',['Av = λv — its direction is unchanged by A','Av = 0 always','A = λv','Av = v + λ'],0,'The transformation only stretches or compresses it along its own line.'],
   ['Matrix multiplication is…',['Associative but not generally commutative','Commutative','Neither','Always commutative for square matrices'],0,'AB and BA are usually different matrices, and may not both exist.'],
   ['The rank of a matrix equals…',['The dimension of its column space','Its number of rows','Its determinant','Its trace'],0,'Rank is the number of genuinely independent directions in the output.'],
   ['A system of linear equations has no solution when…',['The augmented matrix has a row implying 0 = nonzero','The determinant is one','There are more variables','It is homogeneous'],0,'A homogeneous system always has at least the trivial solution.'],
   ['A linear transformation must preserve…',['Vector addition and scalar multiplication','Length','Angles','Area'],0,'Rotations preserve length; general linear maps need not.']
  ],
  11:[
   ['The expected value of a fair six-sided die is',['3.5','3','4','6'],0,'The mean of 1 through 6 — a value the die can never actually show.'],
   ['Two events are independent when…',['P(A and B) = P(A)P(B)','They cannot co-occur','P(A) = P(B)','They are opposites'],0,'Mutually exclusive events are strongly dependent, not independent.'],
   ['Standard deviation measures…',['Typical spread about the mean','The centre','The maximum','The sample size'],0,'It is the square root of the variance, in the units of the data.'],
   ['The central limit theorem says the distribution of sample means approaches…',['Normal, regardless of the population’s shape','The population distribution','Uniform','Exponential'],0,'It is why so much inference relies on the normal distribution.'],
   ['A p-value is the probability of…',['Data at least this extreme, assuming the null hypothesis is true','The null being true','The hypothesis being false','A correct decision'],0,'Reading it as the probability the null is true is the most common error in statistics.'],
   ['A 95% confidence interval means that…',['95% of intervals built this way would contain the true parameter','There is a 95% chance the parameter is in this interval','The data is 95% accurate','95% of values fall inside'],0,'The parameter is fixed; the interval is what varies between samples.'],
   ['A type I error is…',['Rejecting a true null hypothesis','Failing to reject a false null','A calculation mistake','A sampling error'],0,'A false positive. Type II is the false negative.'],
   ['Correlation coefficients near zero indicate…',['No linear relationship, though a non-linear one may exist','No relationship at all','A strong relationship','Causation'],0,'A perfect parabola can have a correlation of zero.'],
   ['In linear regression, the slope coefficient estimates…',['The change in y per unit change in x','The correlation','The mean of y','The error'],0,'Causal interpretation requires assumptions well beyond the regression itself.'],
   ['Increasing sample size primarily…',['Narrows the confidence interval','Changes the mean','Removes bias','Guarantees significance'],0,'It does nothing about bias — a bigger biased sample is just confidently wrong.']
  ],
  12:[
   ['Proof by induction requires…',['A base case and an inductive step','Only a base case','A counterexample','Infinitely many checks'],0,'The step must show that truth at k forces truth at k+1.'],
   ['Proof by contradiction assumes…',['The negation of the claim, then derives an absurdity','The claim is true','A special case','Nothing'],0,'The classic example is the irrationality of √2.'],
   ['A single counterexample is enough to…',['Disprove a universal claim','Prove a claim','Prove an existential claim','Do nothing'],0,'"All swans are white" dies to one black swan.'],
   ['The number of ways to choose 3 items from 8, order irrelevant, is',['56','336','24','512'],0,'C(8,3) = 8!/(3!5!) = 56. The 336 figure is the ordered count.'],
   ['Permutations differ from combinations in that permutations…',['Count order as significant','Allow repetition','Are always larger sets','Ignore order'],0,'P(n,r) = C(n,r) × r!'],
   ['The pigeonhole principle guarantees that…',['With more items than containers, some container holds at least two','Every container is full','Items are evenly spread','Containers are equal'],0,'Trivial to state and surprisingly powerful in proofs.'],
   ['In graph theory, the degree of a vertex is…',['The number of edges incident to it','Its distance from the root','Its label','The number of vertices'],0,'The handshake lemma: degrees sum to twice the edge count.'],
   ['A tree with n vertices has exactly…',['n − 1 edges','n edges','2n edges','n² edges'],0,'Adding any further edge creates a cycle.'],
   ['The set of real numbers is uncountable, proven by…',['Cantor’s diagonal argument','Induction','The pigeonhole principle','Contradiction alone'],0,'Any proposed enumeration can be diagonalised to produce a missing real.'],
   ['Modular arithmetic is central to cryptography because…',['It is easy to compute forward and hard to invert without the key','It is fast','It uses small numbers','It avoids fractions'],0,'That asymmetry is exactly what public-key cryptography is built on.']
  ]
 },
 sci:{
  10:[
   ['The wave function ψ itself represents…',['A probability amplitude, whose squared magnitude gives a probability density','A physical wave','The particle’s position','Energy'],0,'ψ is complex; |ψ|² is the measurable, real quantity.'],
   ['The Schrödinger equation describes…',['How a quantum state evolves in time','Particle collisions','Electromagnetic fields','Thermal flow'],0,'Its evolution is deterministic; measurement is where probability enters.'],
   ['Superposition means a system can be…',['In a combination of states until measured','In two places physically','Undefined','Randomly located'],0,'The combination is a definite state, not ignorance about which one it is.'],
   ['For a particle in an infinite square well, energy levels are…',['Quantised, proportional to n²','Continuous','Evenly spaced','Zero'],0,'Confinement is what forces quantisation.'],
   ['The ground state of a confined particle has non-zero energy because…',['Zero energy would violate the uncertainty principle','Of thermal effects','Of gravity','Of measurement'],0,'Zero-point energy is a direct consequence of confinement.'],
   ['Normalising a wave function ensures that…',['Total probability over all space equals one','Energy is minimised','It is real-valued','It is continuous'],0,'The particle must be found somewhere.'],
   ['Quantum tunnelling allows a particle to…',['Cross a barrier higher than its energy, with some probability','Move faster than light','Gain energy','Disappear'],0,'It is how nuclear fusion proceeds in stars at achievable temperatures.'],
   ['Measurement in quantum mechanics…',['Yields an eigenvalue, and the state changes accordingly','Has no effect','Is always exact','Is classical'],0,'Which measurement you choose determines what is even definable.'],
   ['The correspondence principle requires quantum results to…',['Reproduce classical physics in the appropriate limit','Contradict classical physics','Ignore classical physics','Only apply to atoms'],0,'Large quantum numbers must recover Newtonian behaviour.'],
   ['A potential barrier of infinite height forces the wave function to…',['Vanish at the boundary','Peak there','Be constant','Be discontinuous'],0,'The boundary conditions are what select the allowed energies.']
  ],
  11:[
   ['The uncertainty principle states a limit on simultaneously knowing…',['Position and momentum','Energy and charge','Mass and velocity','Spin and colour'],0,'It is a property of conjugate variables, not of the measuring apparatus.'],
   ['The uncertainty principle arises from…',['The wave nature of matter and the Fourier relation between conjugate variables','Imperfect instruments','Observer disturbance alone','Thermal noise'],0,'A perfect instrument would not evade it.'],
   ['Two operators that do not commute correspond to observables that…',['Cannot both have definite values simultaneously','Are unrelated','Are always equal','Cannot be measured'],0,'Commutation is the formal statement of compatibility.'],
   ['Electron spin is best described as…',['An intrinsic angular momentum with no classical analogue','Physical rotation','Orbital motion','Magnetic charge'],0,'Picturing a spinning ball gives the wrong magnitude and the wrong statistics.'],
   ['The Pauli exclusion principle states that…',['No two identical fermions share the same quantum state','Electrons repel','Spin is conserved','Energy is quantised'],0,'It is why atoms have structure and matter occupies volume.'],
   ['Hydrogen energy levels depend, to first approximation, on…',['The principal quantum number n','Spin only','The magnetic quantum number','Temperature'],0,'The degeneracy in l is a special feature of the 1/r potential.'],
   ['Entanglement means measurement outcomes on separated particles are…',['Correlated beyond what any classical shared variable can explain','Identical always','Causally linked','Simultaneous'],0,'Bell’s theorem is what rules out the classical explanation.'],
   ['Entanglement cannot transmit information faster than light because…',['Each local outcome is random until the results are compared','It is too weak','Light is faster','It decays'],0,'You need a classical channel to see the correlation at all.'],
   ['Decoherence explains why…',['Large systems lose quantum behaviour through entanglement with their environment','Particles decay','Energy is lost','Measurement is exact'],0,'It is why cats are not observed in superposition.'],
   ['Bell’s theorem shows that…',['No local hidden-variable theory can reproduce quantum predictions','Quantum mechanics is wrong','Measurement is subjective','Particles are waves'],0,'Experiment has repeatedly sided with quantum mechanics.']
  ],
  12:[
   ['A scientific explanation is stronger when it…',['Makes risky predictions that could have failed','Explains everything','Is mathematically complex','Is widely believed'],0,'A theory compatible with any outcome forbids nothing and explains nothing.'],
   ['Deriving a result yourself rather than quoting it demonstrates…',['That you understand the assumptions it rests on','A better memory','Faster calculation','Advanced notation'],0,'Every derivation makes its assumptions explicit.'],
   ['Dimensional analysis is useful because it…',['Catches errors and can suggest the form of a relationship','Proves theories','Replaces experiment','Simplifies algebra'],0,'An equation whose units do not balance is definitely wrong.'],
   ['An order-of-magnitude estimate is valuable when…',['You need to know whether an idea is plausible before doing the work','Precision is required','Data is complete','The answer is known'],0,'Fermi problems are the discipline of being approximately right quickly.'],
   ['Reporting a result to ten significant figures from three-figure data is…',['False precision that misrepresents the uncertainty','Good practice','More accurate','Required'],0,'Precision must never exceed what the measurement supports.'],
   ['A model is useful when it…',['Captures the features that matter for the question asked','Includes everything','Is simple','Is complex'],0,'A frictionless sphere is wrong and often exactly right.'],
   ['Peer review functions primarily as…',['A filter that catches errors before publication, imperfectly','A guarantee of truth','A popularity contest','A formality'],0,'Replication, not review, is what ultimately settles a result.'],
   ['Explaining a result to a non-specialist tests whether you…',['Understand it, rather than having memorised its vocabulary','Can simplify','Are a good speaker','Know the history'],0,'Jargon is often understanding’s convincing impostor.'],
   ['Surviving questions on your written explanation requires…',['Knowing the limits and assumptions of your own argument','Confidence','More citations','Longer answers'],0,'The best question is usually about the case you did not consider.'],
   ['The capstone of a physics education is the ability to…',['Reason from principles to a defensible conclusion about a new problem','Recall formulas','Pass exams','Use software'],0,'Formulas are lookups; the reasoning is the education.']
  ]
 },
 eng:{
  10:[
   ['Social contract theory grounds political authority in…',['The consent of the governed','Divine right','Military power','Tradition'],0,'Hobbes, Locke and Rousseau differ sharply on what that consent implies.'],
   ['Hobbes argued that without a sovereign, life would be…',['Solitary, poor, nasty, brutish and short','Peaceful','Free and happy','Communal'],0,'His state of nature is a war of all against all.'],
   ['Locke held that legitimate government exists chiefly to protect…',['Life, liberty and property','Order alone','The monarch','Equality of outcome'],0,'And that a government failing to do so may rightly be replaced.'],
   ['Mill’s harm principle says liberty may be restricted only to…',['Prevent harm to others','Improve the person','Enforce morality','Protect tradition'],0,'Paternalism over a competent adult is precisely what it rules out.'],
   ['Rawls’ veil of ignorance asks you to choose principles without knowing…',['Your own position in the resulting society','The rules','Other people','History'],0,'It is a device for stripping self-interest out of the choice.'],
   ['Negative liberty is freedom from…',['Interference by others','Poverty','Ignorance','Yourself'],0,'Positive liberty is the capacity actually to act — the distinction is Berlin’s.'],
   ['The tyranny of the majority describes…',['A majority using democratic power to oppress a minority','Minority rule','Anarchy','Dictatorship'],0,'Constitutional rights exist largely to constrain it.'],
   ['A right is best understood as…',['A claim others have a duty to respect','A privilege','A preference','A law'],0,'Every right implies a corresponding duty somewhere.'],
   ['Distributive justice concerns…',['How benefits and burdens are allocated across a society','Criminal punishment','Contract law','Voting rules'],0,'Retributive justice is the punishment question.'],
   ['Arguing your least sympathetic position well demonstrates…',['That you understand it rather than a caricature of it','Weak conviction','Indecision','Neutrality'],0,'Only then is your disagreement worth anything.']
  ],
  11:[
   ['Nietzsche’s claim that "God is dead" was primarily a diagnosis of…',['The collapse of shared foundations for value in modern life','Atheism’s triumph','Religious history','Personal belief'],0,'He regarded it as a crisis to be answered, not a victory to celebrate.'],
   ['Kierkegaard’s leap of faith responds to…',['The impossibility of grounding ultimate commitments in reason alone','Scientific evidence','Church authority','Social pressure'],0,'The leap is necessary precisely because the gap cannot be argued away.'],
   ['Camus argued that the absurd arises from…',['The collision between our demand for meaning and the world’s silence','Human cruelty','Death alone','Ignorance'],0,'Neither term can be removed, which is why he rejects suicide as an answer.'],
   ['Camus concluded that Sisyphus…',['Must be imagined happy, having owned his fate','Is doomed','Should stop','Is a warning'],0,'Revolt, not resignation, is his answer to the absurd.'],
   ['Sartre’s "existence precedes essence" means…',['We exist first and define ourselves through choices','Essence is fixed','Nothing exists','Choices are determined'],0,'There is no human nature to appeal to as an excuse.'],
   ['Sartrean bad faith is…',['Denying your own freedom by pretending your role is fixed','Lying to others','Weak belief','Self-doubt'],0,'"I had no choice" is its most common formulation.'],
   ['Frankl argued that meaning can be found even in suffering, provided…',['We choose our attitude toward what we cannot change','The suffering ends','We are rescued','We forget it'],0,'The last human freedom, in his phrase, is the choice of response.'],
   ['Frankl’s logotherapy locates the primary human drive in…',['The will to meaning','Pleasure','Power','Security'],0,'A deliberate contrast with Freud and Adler.'],
   ['Existentialism holds that freedom is accompanied by…',['Full responsibility, which is why it is experienced as anguish','Relief','Certainty','Comfort'],0,'If nothing is decided for you, everything is on you.'],
   ['Comparing your writing now with your writing in Unit 1 tests…',['Whether the program changed how you think, not just what you know','Your memory','Your speed','Your vocabulary'],0,'That change is the only outcome worth the year.']
  ],
  12:[
   ['A thesis worth 5,000 words must be…',['Narrow enough to argue and large enough to matter','As broad as possible','Uncontroversial','Purely descriptive'],0,'Too broad and you summarise; too narrow and there is nothing at stake.'],
   ['The strongest structure for a long argument moves…',['From the least controversial claim to the most','From strongest to weakest','Chronologically always','Randomly'],0,'Each agreed step makes the next easier to grant.'],
   ['Addressing the best objection to your thesis…',['Strengthens the work, because the reader is already thinking it','Weakens it','Is optional','Adds length'],0,'An unanswered objection is where the reader stops believing you.'],
   ['A defence is going well when…',['The questions expose assumptions you can articulate and defend','Nobody asks anything','Everyone agrees','It ends early'],0,'Silence usually means the argument was not understood.'],
   ['If a question reveals a genuine flaw, the right response is to…',['Concede it precisely and say what it does and does not damage','Deflect','Concede everything','Restate the thesis'],0,'Precise concession is the mark of someone who understands their own argument.'],
   ['Revising after the defence matters because…',['The objections raised are the best available evidence of what is weak','It is customary','It adds length','The defence was a test'],0,'A thesis unchanged by its defence wasted the defence.'],
   ['Original contribution in an undergraduate thesis usually means…',['A new synthesis or application, not a new discovery','A discovery','A new theory','New data'],0,'Connecting existing work in a way nobody has is genuinely original.'],
   ['Reading your own draft aloud reliably exposes…',['Sentences that do not work, which the eye forgives','Spelling errors','Citation errors','Formatting'],0,'The ear catches what silent reading smooths over.'],
   ['The most common failure in a long thesis is…',['Losing the through-line, so sections stop serving one argument','Being too short','Too few sources','Poor grammar'],0,'Every section should be answerable to the question "how does this advance the claim".'],
   ['Having completed this program, the real test is whether you can…',['Take a question nobody has answered for you and reason your way to a defensible position','Recall the syllabus','Pass an exam','List your courses'],0,'That capacity, not the transcript, is what an education is.']
  ]
 }
};

/* Fold Years Two, Three and Four into the shipped bank. */
[BANK_Y2,BANK_Y3,BANK_Y4].forEach(extra=>{
  Object.keys(extra).forEach(cid=>{
    BANK[cid]=BANK[cid]||{};
    Object.keys(extra[cid]).forEach(u=>{BANK[cid][u]=extra[cid][u];});
  });
});

/* ---------- certificates: threshold is the coursework each one represents ---------- */
const CERTS=[
 ['freeCodeCamp: Responsive Web Design','Free','https://www.freecodecamp.org/learn/2022/responsive-web-design/','code',25],
 ['freeCodeCamp: JavaScript Algorithms','Free','https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/','code',50],
 ['Harvard CS50x — Verified Certificate','$199 (the course itself is free)','https://cs50.harvard.edu/x/','code',75],
 ['HubSpot: Digital Marketing','Free','https://academy.hubspot.com/courses/digital-marketing','mkt',25],
 ['HubSpot: Social Media Marketing','Free','https://academy.hubspot.com/courses/social-media','mkt',50],
 ['Meta Certified Digital Marketing Associate','About $99 for the exam','https://www.facebook.com/business/learn/certification','mkt',75],
 ['Google Digital Marketing & E-commerce','About $49 per month','https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce','mkt',50],
 ['Khan Academy mastery — Math & Science','Free, tracked as mastery percent','https://www.khanacademy.org/','math',25]
];

