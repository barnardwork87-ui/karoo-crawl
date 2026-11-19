/* =====================================================================
   CONTENT CONFIG · Karoo Crawl
   The only file to edit. See the template README for tokens and build steps.
   TBC items are marked  // TODO  so they're easy to find.

   The idea: a run and a campout with a party on the end of it. Everyone starts
   together in the morning on a route you can repeat, then picks their own
   distance and pace. Beating your longest run is a challenge you can set
   yourself, not a condition of anything. Everyone is done by sunset. 100
   runners is the current target; crew and hangers-on sit on top of that.

   The spot, the date and the route are all still open. Keep general copy vague
   about all three.

   NO MAP ON THE SITE ANY MORE. Both map sections have been taken off the home
   page: the lower route/elevation block first, then the 3D fly-down. Nothing
   now renders a route, a contour route line, an elevation profile or the
   Place of Dreams / Cannon / Party Bus markers.

   These keys are therefore UNUSED. They are kept, intact, so either section
   can be put back by restoring its markup - do not prune them, and do not
   bother rewriting the copy inside them:
     stations[]        (mapLabel, flyLabel, leg tooltips)
     fly{}             (camera path for the fly-down)
     pages.home.fly    (fly-down captions)
     pages.home.route  (route map + elevation copy)

   Still LIVE and still feeding things, so edit with care:
     race.distanceKm / climbM / goalHours / survivalHours / cutoffHours
     race.overviewStats / crewAt / penalty / stopsLabel
       - read by model.js and the stats/chart block
     terrain.js is still needed: the hero, report and loader topo artwork are
       drawn from it even though the route line is gone.
===================================================================== */
window.CONTENT = {

  site: {
    slug: 'karoo',
    title: 'Karoo Crawl · Run further than you ever have',
    description: 'A running and camping weekend somewhere in the Karoo. Everyone starts together, everyone picks their own distance, everyone is done by sunset. Then there’s a fire.',
    logo: 'assets/karoo-crawl-logo.svg',   // wordmark in the nav + loader (no runner illustration)
    logoAlt: 'Karoo Crawl',
    // Kept short: at 390px this sits beside the burger, and anything longer
    // runs under it. The old 'Place of Dreams · 100 places' already did.
    navSub: 'Middle of nowhere',
    navCta: 'https://tally.so/r/o9RgbO',
    // The nav pill is a call to action, not a clock. Small text carries the
    // when, bold text carries the ask.
    countdownLabel: 'Winter. Probably August.',
    countdownDone: 'Crawling',
    countdownStatic: 'Register interest'
  },

  nav: [
    ['index.html', 'Home', 'home'],
    ['about.html', 'About the Crawl', 'about'],
    ['partners.html', 'Partners', 'partners']
  ],

  runner: { name: 'you' },

  race: {
    name: 'Karoo Crawl',
    short: 'Karoo Crawl',
    date: '2027-08-21',          // TODO confirm date
    start: '05:55',              // TODO confirm start time
    tz: '+02:00',
    days: ['Sat', 'Sun'],
    showDistance: false,         // never show km: the distance is yours
    distanceKm: 13.4,            // one lap of the indicative valley loop (internal only)
    climbM: 600,                 // per lap
    goalHours: 3,
    survivalHours: 4,
    cutoffHours: 14,             // TODO confirm cut-off
    sunrise: '07:22',
    sunset: '18:12',
    penalty: 'no aid',
    crewAt: 'Aid at',
    stopsLabel: 'aid stops',
    overviewStats: [['Distance', 'Further'], ['Up / lap', '+600 m'], ['Aid / lap', '2'], ['Places', '100']]
  },

  // 3D fly-down: top view → hovering behind Place of Dreams, looking up the valley
  fly: { startKm: 0.3, lookKm: 4.6, runKm: 0, exaggeration: 1.7, eye: 340, back: 1500, lookHeight: 0, endFov: 48, fog: [1.6, 3.6], groundLine: false },

  loader: {
    count: 101,
    unit: '% of your longest run',
    messages: ['Finding the gravel', 'Checking the long-range forecast', 'Ignoring your PB', 'Charging headtorches', 'Packing a speaker', 'Losing signal', 'Pitching a tent in the dark', 'Crawling']
  },

  /* Indicative valley loop. Real route + station spots TBC. */
  stations: [
    { name: 'Start', label: 'Start · Place of Dreams', crew: true, stop: 0, kind: 'start', mapLabel: [12, 18, 'Place of Dreams'], flyLabel: 'Place of Dreams',
      photo: 'assets/img/start-group.jpg' },
    { name: 'The Cannon', label: 'The Cannon', crew: true, stop: 3, mapLabel: [12, -8, 'The Cannon'], photo: 'assets/img/aid-dog.jpg',
      leg: { title: 'Into the Valley', where: 'Place of Dreams → the valley mouth → the Cannon',
        blurb: 'Out the gate and straight into the valley. It’s flat enough to lie to yourself, which you will. The first aid station is the Cannon. You’ll know it when you see it. It’s a cannon.' } },
    { name: 'The Party Bus', label: 'The Party Bus', crew: true, stop: 5, mapLabel: [-12, 16, 'The Party Bus', 'end'], photo: 'assets/img/van-road.jpg',
      leg: { title: 'The Climb', where: 'The Cannon → up the valley → over the top → the Party Bus',
        blurb: 'All of the climbing, in one go. Nearly five hundred metres of it, up the valley and over the head of it. At the top there is a bus, and the bus is having a party, and you are invited for four minutes.' } },
    { name: 'Finish', label: 'Place of Dreams', crew: true, stop: 0, kind: 'finish', photo: 'assets/img/braai.jpg',
      leg: { title: 'Home, Then Again', where: 'The Party Bus → down the next valley → Place of Dreams',
        blurb: 'Downhill, home, chair. Then you decide whether to go round again. You go round again. That’s the format. You stop when you’ve gone further than you ever have, and not one step before.' } }
  ],

  pages: {
    home: {
      hero: {
        eyebrow: 'Somewhere in the Karoo · 100 places',
        side: 'A place to push yourself, somewhere in the Karoo. Everyone starts together in the dark on a route you can repeat, then picks their own distance and their own pace. Run as far as you can. Stop whenever you like. Everyone’s done by sunset, and then the fun starts.',
        title: ['Run further', 'than you', 'ever have.', '*On purpose.'],
        meta: [['When', 'Winter'], ['Distance', 'Yours'], ['Done by', 'Sunset'], ['Runners', '100']],
        scroll: 'SCROLL ↓ TO START CRAWLING',
        startTag: 'Somewhere in the Karoo',
        finishTag: 'Home. Again?'
      },
      statement: {
        eyebrow: 'The situation',
        // Three blocks, not one paragraph. The middle one is the whole point,
        // so it gets a line to itself.
        text: [
          'Karoo Crawl is a place to push yourself. An early start, running under the stars, cut-off at sunset.',
          'Nobody is racing you.',
          'Run slow, run fast, just run as far as you can. Once the run is done, we start the fun. Call it a festival of running if you will.'
        ],
        photos: [['assets/img/start-group.jpg', 'The start, archive'], ['assets/img/sunrise-road.jpg', 'Sunrise'], ['assets/img/canyon.jpg', 'Big country'], ['assets/img/road-dance.jpg', 'Morale, briefly'], ['assets/img/braai.jpg', 'The real finish line']]
      },
      fly: {
        eyebrow: '01 · The view',
        caps: [
          ['From up here it looks easy.', 'Every brown line is twenty metres of up. Look where they bunch together. That’s the valley. That’s where you’re going.'],
          ['That orange line is one lap.', 'You’ll do it more than once. How many times is between you and the longest run of your life.'],
          ['Lower. The valley has opinions.', 'About six hundred metres of climbing a lap. Most of it arrives at once, just after the Cannon.'],
          ['This is the start.', 'Place of Dreams below you. The valley in front of you. The Cannon somewhere in there. Off you go.']
        ]
      },
      report: {
        eyebrow: '02 · The event',
        title: 'Everything you need to know. It isn’t much.',
        // big value + title + text, shuffled in like a deck as you scroll
        cards: [
          { colour: 'orange', icon: 'DST', grade: 'Yours', title: 'Your distance', text: 'No set distance and no set pace. This is only an ultra if you want it to be. Run slow, run fast, just run as far as you can — and if you want a target, the furthest you’ve ever run is sitting right there.' },
          { colour: 'lime', icon: 'GUN', grade: 'Stars', title: 'One start', text: 'Everyone goes at once, early, running under the stars. It’s the only organised part of the day. It’s also the best photo you’ll take all weekend.' },
          { colour: 'sky', icon: 'SUN', grade: 'Sunset', title: 'Done by dark', text: 'Call it whenever you like. One lap is a fine day out. Everyone stops by sunset. That’s not really a cut-off. That’s when the other thing starts.' },
          { colour: 'navy', icon: 'KIT', grade: 'BYO', title: 'Bring your own', text: 'Tent, food, drinks, water and whatever you run on. Treat it as self-supported and pack like it. Anything past that is still being worked out.' },
          { colour: 'olive', icon: 'CMP', grade: 'Tent', title: 'Camping', text: 'Arrive the day before, pitch in the dark, go to bed too late. Friends, crew and people with no intention of running are part of it, not an afterthought.' },
          { colour: 'paper', icon: 'END', grade: 'Rave', title: 'Then the fun', text: 'Once the run is done we start the fun. A fire, a speaker with a bit of life left in it and a hundred people in various states of repair. Call it a festival of running if you will.' }
        ],
        stamp: '100 RUNNERS',
        stampSmall: 'The target for now · Crew and hangers-on on top · Register interest'
      },
      route: {
        eyebrow: '03 · The loop (indicative)',
        title: ['One valley.', 'As many times as it takes.'],
        lede: 'Real contours, every 20 m, from elevation data. The orange line is an indicative loop through the valley behind Place of Dreams. The final route gets confirmed closer to the day. Hover a section to see what you’re in for. Orange dots are aid: the Cannon and the Party Bus.',
        overviewWhere: 'Indicative loop · Place of Dreams → the valley → the Cannon → over the top → the Party Bus → Place of Dreams → repeat',
        overviewBlurb: 'Out through one valley, back through the next. Gentle, then very much not gentle, then downhill. Every lap you pass the start, which has a chair, which is the most dangerous object in ultrarunning.'
      },
      marquee: ['Run further than you ever have', 'Your distance', 'Start together', 'Done by sunset', 'Pitch a tent', 'Rave with whatever’s left'],
      cta: { photo: 'assets/img/sunrise-crew.jpg', eyebrow: '04 · Your move', title: ['A hundred runners.', 'Put your hand up.'],
        links: [['https://tally.so/r/o9RgbO', 'Register interest'], ['about.html', 'What is this, exactly']] }
    },

    about: {
      eyebrow: 'About the Karoo Crawl',
      title: ['Further than', 'you ever have.', '*That’s the pitch.'],
      lede: 'A run and a campout, somewhere in the Karoo, with a party on the end of it. Everyone starts together in the morning on a route you can repeat, then picks their own distance and their own pace. If you want a number to aim at, the furthest you’ve ever run is a good one. You don’t have to. One lap and a cold drink is a completely respectable weekend.',
      whatTitle: ['How it works'],
      what: [
        ['Pick your own distance', 'One route you can repeat, as many times as you like. People track their own laps. Nobody is checking, and there is no list at the end with everyone’s numbers on it.'],
        ['Beat your longest run, if you want', 'It’s the challenge most people set themselves, and it’s a good one, because it’s different for everybody. It is not a condition of anything. You can stop whenever you’ve had enough.'],
        ['Start together, done by sunset', 'One start, in the morning, everyone at once. After that the day is yours. Running stops at sunset whether you’re ready or not, and then the evening starts.'],
        ['Bring your own', 'Tent, food, drinks, water and whatever you run on. Plan for self-supported. Catering, cabins, a pool and staffed aid stops are all still open questions, so don’t pack as though they’re settled.'],
        ['Come for the vibes', 'Friends, crew, partners and people who have no intention of running are welcome and genuinely wanted. Somebody has to hold the speaker.']
      ],
      placeEyebrow: 'Where you’ll be had',
      placeTitle: 'Somewhere in the Karoo',
      placeLede: 'Middle of nowhere, within reason. A VW Polo’s got to make it. We’re still locking the spot down, so take the photos as a general mood rather than a street address. Big sky, dirt underfoot, nothing much for miles.',
      placePhoto: 'assets/img/van-road.jpg',
      placeFacts: [
        ['Where', 'Somewhere in the Karoo. Middle of nowhere, within reason. A VW Polo’s got to make it.'],
        ['When', 'Sometime in winter. Midwinter, probably. Maybe August. August feels right.'],
        ['Sleep', 'Bring a tent. Camping is the plan.'],
        ['Still open', 'The spot, the date, the route and most of the details. Register interest and you’ll hear as they land.']
      ],
      weekendEyebrow: 'The weekend',
      weekend: [
        ['Arrive', 'Drive in, pitch a tent, probably in the dark. Meet the people you will later be overtaken by. Go to bed far too late.'],
        ['Morning', 'Everyone starts together. Headtorches, cold hands, the group photo where nobody has suffered yet.'],
        ['All day', 'Laps, at your pace, for as long as you want them. Stop for a chair and a snack. Go again, or don’t.'],
        ['Sunset', 'Running stops. Fire, food, music and a speaker with a bit of life left in it. Rave with whatever’s left in the tank.']
      ],
      galleryTitle: ['This isn’t our', 'first bad idea.'],
      galleryLede: 'Archive shots on 35 mm by Justin from a previous Crawl, who has no further notes. Everything here happened. Some of it was on purpose. None of it is the confirmed spot for this one — treat it as the general idea.',
      gallery: [
        ['assets/img/start-group.jpg', 'Start line. Optimism.', 'w8'],
        ['assets/img/headtorch-laugh.jpg', 'Still laughing', 'w4'],
        ['assets/img/sunrise-road.jpg', 'First light', 'w6'],
        ['assets/img/canyon.jpg', 'Big country', 'w6'],
        ['assets/img/coffee-stop.jpg', 'Coffee, artisanal', 'w3'],
        ['assets/img/husky-cab.jpg', 'Management', 'w6'],
        ['assets/img/road-dog.jpg', 'Pacer, unpaid', 'w3'],
        ['assets/img/road-dance.jpg', 'Morale was high. Briefly.', 'w4'],
        ['assets/img/aid-dog.jpg', 'Support crew', 'w4'],
        ['assets/img/watch-check.jpg', 'Checking a watch that has no good news', 'w4'],
        ['assets/img/canyon-hike.jpg', 'Uphill, obviously', 'w3'],
        ['assets/img/braai.jpg', 'The real finish line', 'w6'],
        ['assets/img/pool-day.jpg', 'Recovery protocol', 'w6'],
        ['assets/img/cactus.jpg', 'Local', 'w3']
      ],
      cta: { photo: 'assets/img/road-wave.jpg', eyebrow: 'Next', title: ['Fine.', 'Where do I sign.'],
        links: [['https://tally.so/r/o9RgbO', 'Register interest'], ['index.html', 'Back to the start']] }
    },

    partners: {
      eyebrow: 'Partners & sponsors',
      title: ['Help us get', 'the first one', 'off the ground.'],
      lede: 'The Karoo Crawl is a hundred people running as far as they fancy in the middle of nowhere, then camping and having a party about it. It does not exist yet. We’re looking for a few people and brands who want to help make the first one happen — and who’d like their name on it permanently.',
      whyTitle: ['Why bother'],
      why: [
        ['It’s the first one', 'Nothing is locked. No history, no incumbents, nobody else’s logo in the photos. Whoever helps now is part of how the thing gets built, not a sticker applied afterwards.'],
        ['Got a crew? Bring them', 'If you’re a brand, a run club or just a group chat that runs together, bring your people along to run, camp, help out or stand near the fire. That’s not a package. It’s an open invitation.'],
        ['Small on purpose', 'A hundred runners, plus crew and hangers-on. Nobody is a number on a bib wall. Your name isn’t either.']
      ],
      // One ask, not a tier sheet. Four things we need, no prices, no buttons
      // on the cards - the single CTA is the block at the bottom of the page.
      packagesTitle: ['What we need'],
      packagesLede: 'Short version: everything. It’s a running event and a festival in the same field, with a long day in between for people who’ve finished or never started. Pick any part of that and help with it. Money also works, and covers all four at once.',
      packages: [
        ['Somewhere to put it', 'A farm, a reserve, a stretch of nowhere with road access and room for a hundred tents. Everything else is waiting on this one.'],
        ['The running part', 'Water, fuel, food, kit, medical cover and people to hand out cups. The unglamorous half, and the half that keeps everyone upright.'],
        ['The party part', 'Sound, lights, power, somewhere to put a fire and something cold at the end of it. A festival with a run attached, or the other way round.'],
        ['The bit in between', 'People finish at different times and plenty never start. That’s a long day in a field. Shade, coffee, somewhere to sit, something to do.']
      ],
      factsTitle: ['The numbers'],
      facts: [
        ['Runners', '100 — the target for now'],
        ['Crew + hangers-on', 'On top, and still open'],
        ['Where', 'Somewhere in the Karoo. Middle of nowhere, within reason. A VW Polo’s got to make it.'],
        ['When', 'Sometime in winter. Midwinter, probably. Maybe August. August feels right.'],
        ['Format', 'Start together, a route you can repeat, your own distance, done by sunset.'],
        ['After', 'Camping, a fire, music and a party.']
      ],
      enquireTitle: ['Become a Founding Partner'],
      enquireLede: 'Help us get the first Crawl off the ground and we’ll always credit you as a Founding Partner. Even if you never sponsor another edition, you’ll still be one of the original brands that made it happen. Tell us what you can bring and we’ll take it from there.',
      // Kept for reference: the Founding Partner block no longer carries its own
      // button, so the page has exactly one way through to the form.
      enquireUrl: 'https://tally.so/r/o9RgbO',
      enquireLabel: 'I can help',
      cta: { photo: 'assets/img/road-dance.jpg', eyebrow: 'One form. That’s the whole process.', title: ['Tell us what', 'you can bring.'],
        links: [['https://tally.so/r/o9RgbO', 'I can help']] }
    }
  },

  footer: {
    title: 'Karoo Crawl',
    blurb: 'A run, a campout and a party, somewhere in the Karoo. Start together, pick your own distance, be done by sunset. Organised by people who should not be trusted with a clipboard.',
    groups: [
      ['The Crawl', [['index.html', 'Home'], ['about.html', 'About'], ['partners.html', 'Partners']]],
      ['Get involved', [['https://tally.so/r/o9RgbO', 'Register interest ↗']]]
    ],
    big: 'See you at the fire.',
    legal: 'Indicative route only; spot, date and route all still TBC. Contours: AWS Terrain Tiles. Photos on 35 mm by Justin.',
    legalRight: 'Distance not included. That’s on you.'
  }
};
