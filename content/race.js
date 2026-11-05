/* =====================================================================
   CONTENT CONFIG · Karoo Crawl
   The only file to edit. See the template README for tokens and build steps.
   TBC items are marked  // TODO  so they're easy to find.

   The idea: there is no set distance. One valley loop from Place of Dreams,
   aid at the Cannon and the Party Bus. You run until you've gone further
   than you ever have. 100 places.
===================================================================== */
window.CONTENT = {

  site: {
    slug: 'karoo',
    title: 'Karoo Crawl · Run further than you ever have',
    description: 'The Karoo Crawl at Place of Dreams, Tankwa Karoo. No set distance. One valley loop. Run until you’ve gone further than you ever have. 100 places.',
    navTitle: '<img class="nav__wordmark" src="assets/karoo-crawl-logo.svg" alt="Karoo Crawl">',
    navSub: 'Place of Dreams · 100 places',
    navCta: 'tickets.html',
    countdownLabel: 'Next crawl in',
    countdownDone: 'Crawling'
  },

  nav: [
    ['index.html', 'Home', 'home'],
    ['about.html', 'About the Crawl', 'about'],
    ['tickets.html', 'Get your tickets<span class="tag">100</span>', 'tickets']
  ],

  runner: {
    name: 'Barney',
    image: 'assets/barney.webp',
    imageAlt: 'Barney, seated, which is how most people finish this'
  },

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
    messages: ['Finding the R356', 'Locating the Cannon', 'Fuelling the Party Bus', 'Measuring the valley', 'Ignoring your PB', 'Charging headtorches', 'Losing signal', 'Crawling']
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
        eyebrow: 'Place of Dreams · Tankwa Karoo · 100 places',
        side: 'There’s no distance. That’s the point. One loop through a valley at Place of Dreams, an hour past Ceres. You run it until you’ve gone further than you ever have in your life. Then you stop, eat something from a fire, and tell everyone. That’s the whole event.',
        title: ['Run further', 'than you', 'ever have.', '*On purpose.'],
        meta: [['Start', 'Sat 05:55'], ['Distance', 'Further'], ['Places', '100'], ['Signal', 'None']],
        scroll: 'SCROLL ↓ TO START CRAWLING',
        startTag: 'Place of Dreams · 05:55',
        finishTag: 'Home. Again?'
      },
      statement: {
        eyebrow: 'The situation',
        text: 'No finish distance. One valley. Two aid stations, one of which is a cannon and one of which is a bus having a party. A hundred people, each trying to beat the furthest they’ve ever run. Nobody is racing you. You are racing a number you made up years ago.',
        photos: [['assets/img/start-group.jpg', 'The start, 05:50'], ['assets/img/sunrise-road.jpg', 'Sunrise'], ['assets/img/canyon.jpg', 'The valley'], ['assets/img/road-dance.jpg', 'Morale, briefly'], ['assets/img/braai.jpg', 'The finish line']]
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
        eyebrow: '02 · What to expect',
        title: 'We graded the course. It wasn’t close.',
        cards: [
          { colour: 'olive', icon: 'DST', grade: '?', title: 'Distance', text: 'There isn’t one. You run until you’ve beaten your longest run ever. The course doesn’t know your PB. You do. You can’t lie to it, but people will try.' },
          { colour: 'sky', icon: 'VRT', grade: 'B', title: 'Vert', text: 'About six hundred metres a lap. Do four laps and do the maths. Actually, don’t do the maths.' },
          { colour: 'blue', icon: 'SIG', grade: 'F', title: 'Signal', text: 'None. Your Strava will upload on Monday, in Ceres, at a Wimpy, to a standing ovation from no one.' },
          { colour: 'paper', icon: 'VUE', grade: 'A', title: 'The valley', text: 'Genuinely beautiful. You will see it for four seconds per lap, between looking at your feet and looking for the bus.' },
          { colour: 'navy', icon: 'AID', grade: 'A', title: 'Aid', text: 'The Cannon and the Party Bus. Every lap. One of them has a sound system. It isn’t the cannon.' },
          { colour: 'lime', icon: 'VIB', grade: 'A+', title: 'Après', text: 'Pool. Braai. A man in a white shirt holding tongs like a weapon. The real race is the one to the fire.' }
        ],
        stamp: 'OVERALL: PB',
        stampSmall: 'Will go further than ever · Will mention it at work for a year'
      },
      route: {
        eyebrow: '03 · The loop (indicative)',
        title: ['One valley.', 'As many times as it takes.'],
        lede: 'Real contours, every 20 m, from elevation data. The orange line is an indicative loop through the valley behind Place of Dreams. The final route gets confirmed closer to the day. Hover a section to see what you’re in for. Orange dots are aid: the Cannon and the Party Bus.',
        overviewWhere: 'Indicative loop · Place of Dreams → the valley → the Cannon → over the top → the Party Bus → Place of Dreams → repeat',
        overviewBlurb: 'Out through one valley, back through the next. Gentle, then very much not gentle, then downhill. Every lap you pass the start, which has a chair, which is the most dangerous object in ultrarunning.'
      },
      marquee: ['No distance', 'Further than ever', 'The Cannon', 'The Party Bus', '100 places', 'Braai at the end'],
      cta: { photo: 'assets/img/sunrise-crew.jpg', eyebrow: '04 · Your move', title: ['A hundred places.', 'One valley. Get in.'],
        links: [['tickets.html', 'Get your tickets'], ['about.html', 'What is this, exactly']] }
    },

    about: {
      eyebrow: 'About the Karoo Crawl',
      title: ['Further than', 'you ever have.', '*That’s the pitch.'],
      lede: 'The Karoo Crawl has one rule: go further than you’ve ever gone. If your longest run is 21 km, today it’s 22. If it’s 100, good luck, see you at the bus. Everyone’s finish line is different and every single one of them is in the same valley.',
      whatTitle: ['How it works'],
      what: [
        ['There’s no distance', 'One valley loop from Place of Dreams. You run laps. You stop when you’ve beaten your longest run ever. That might be two laps. It might be eight. The valley does not care.'],
        ['Aid every lap', 'The Cannon at the mouth of the valley, the Party Bus at the top. Water, Coke, food, encouragement of a kind. One of them plays music.'],
        ['100 people', 'That’s the cap. A hundred people, a hundred different finish lines, one braai.']
      ],
      placeEyebrow: 'Where you’ll be had',
      placeTitle: 'Place of Dreams',
      placeLede: '3,700 hectares of semi-desert in the Karoo Hoogland, with a million-year-old canyon, an ancient waterfall and houses made of natural stone. It runs on solar and good intentions. It describes itself as being “in the middle of nowhere”, and it’s being modest.',
      placePhoto: 'assets/img/pool-day.jpg',
      placeFacts: [
        ['Where', 'Tankwa Karoo, Western Cape. About 50 minutes from Ceres on the R356, the Sutherland road.'],
        ['Sleep', 'On site. Natural-stone pods with showers, kitchens and solar power, or camping. Booked through Place of Dreams.'],
        ['Signal', 'Let’s say it’s a feature.'],
        ['More', '<a href="https://placeofdreams.co.za/" target="_blank" rel="noopener" style="text-decoration:underline">placeofdreams.co.za ↗</a>']
      ],
      weekendEyebrow: 'The weekend',
      weekend: [
        ['Friday · arrive', 'Drive in, find your pod, look at the stars, go to bed at nine like a person with plans.'],
        ['Saturday · 05:55', 'Headtorches. The group photo where everyone looks fresh. It will be the last one.'],
        ['Saturday · laps', 'The valley, the Cannon, the climb, the Party Bus, the chair you’re not allowed to sit in. Repeat until you’ve made history, personally.'],
        ['Saturday · after', 'Pool, braai, someone with tongs taking it very seriously. Lies about how many laps.']
      ],
      galleryTitle: ['Last time,', 'on film.'],
      galleryLede: 'Shot on 35 mm by Justin at the last Crawl, who has no further notes. Everything here happened. Some of it was on purpose.',
      gallery: [
        ['assets/img/start-group.jpg', 'Start line. Optimism.', 'w8'],
        ['assets/img/headtorch-laugh.jpg', 'Still laughing', 'w4'],
        ['assets/img/sunrise-road.jpg', 'First light', 'w6'],
        ['assets/img/canyon.jpg', 'The valley', 'w6'],
        ['assets/img/coffee-stop.jpg', 'Aid station, artisanal', 'w3'],
        ['assets/img/husky-cab.jpg', 'Management', 'w6'],
        ['assets/img/road-dog.jpg', 'Pacer, unpaid', 'w3'],
        ['assets/img/road-dance.jpg', 'Morale was high. Briefly.', 'w4'],
        ['assets/img/aid-dog.jpg', 'Aid station', 'w4'],
        ['assets/img/watch-check.jpg', 'Checking a watch that has no good news', 'w4'],
        ['assets/img/canyon-hike.jpg', 'Up the valley', 'w3'],
        ['assets/img/braai.jpg', 'The real finish line', 'w6'],
        ['assets/img/pool-day.jpg', 'Recovery protocol', 'w6'],
        ['assets/img/cactus.jpg', 'Local', 'w3']
      ],
      cta: { photo: 'assets/img/road-wave.jpg', eyebrow: 'Next', title: ['Fine.', 'Where do I sign.'],
        links: [['tickets.html', 'Get your tickets'], ['index.html', 'Back to the valley']] }
    },

    tickets: {
      eyebrow: 'Get your tickets',
      title: ['A hundred', 'places.', '*That’s it.'],
      lede: 'Entries for the next Karoo Crawl at Place of Dreams. A hundred places, because the valley is only so wide and the Party Bus is only so big. Prices and the date are being finalised, which is a polite way of saying someone has to call the farm.',
      tiersTitle: ['Pick your', 'suffering.'],
      tiers: [   // TODO prices + links
        { cls: 'card--paper', tag: 'Run only', name: 'The Crawl', price: 'TBC', unit: 'per runner',
          copy: 'You, the valley, as many laps as it takes. You sort out where you sleep.',
          items: ['Entry: unlimited laps', 'The Cannon + the Party Bus, every lap', 'Braai at the end', 'A new longest run, guaranteed or your dignity back'],
          cta: ['#register', 'Register interest'] },
        { cls: 'card--orange', tag: 'The full weekend', name: 'Crawl & Camp', price: 'TBC', unit: 'per runner', sticker: 'Most sensible',
          copy: 'Everything in the Crawl, plus two nights at Place of Dreams, so you don’t drive home after your longest run ever like a lunatic.',
          items: ['Entry: unlimited laps', 'Friday + Saturday night on site', 'Braai + pool access', 'Sunday: lying down'],
          cta: ['#register', 'Register interest'] },
        { cls: 'card--navy', tag: 'Not running', name: 'Crew / Plus-one', price: 'TBC', unit: 'per person',
          copy: 'For the people who come to watch, hold things and say “you look great” without meaning it. Does not count toward the hundred.',
          items: ['Weekend on site', 'A shift on the Party Bus (optional, encouraged)', 'Braai', 'Bragging rights by association'],
          cta: ['#register', 'Register interest'] }
      ],
      rulesEyebrow: 'Before you click anything',
      rules: [
        ['Know your number', 'Your longest run ever. Bring it. That’s your target, plus one step. We’ll take your word for it, which is a mistake.'],
        ['Headtorch', 'Mandatory. The start is in the dark. Phone torches are not headtorches and we will laugh.'],
        ['Carry water', 'At least 1 L between aid. The climb to the Party Bus is longer than it looks from the Cannon.'],
        ['Respect the land', 'Place of Dreams is a private wilderness. Leave nothing but footprints and a bit of your dignity.']
      ],
      registerTitle: ['Register interest'],
      registerLede: 'Tickets open when the date is locked. A hundred places, first come. Leave your name and you’ll hear first.',
      registerUrl: 'mailto:hello@example.com?subject=Karoo%20Crawl',   // TODO real ticket link or address
      registerLabel: 'Email us to get on the list',
      cta: { photo: 'assets/img/braai.jpg', eyebrow: 'The finish', title: ['See you at', 'the fire.'],
        links: [['about.html', 'About the Crawl'], ['index.html', 'Home']] }
    }
  },

  footer: {
    title: 'Karoo Crawl',
    blurb: 'Run further than you ever have, in a valley at Place of Dreams in the Tankwa Karoo. A hundred places. Organised by people who should not be trusted with a clipboard.',
    groups: [
      ['The Crawl', [['index.html', 'Home'], ['about.html', 'About'], ['tickets.html', 'Tickets']]],
      ['Out there', [['https://placeofdreams.co.za/', 'Place of Dreams ↗']]]
    ],
    big: 'See you at the Party Bus.',
    legal: 'Indicative route through the valley at Place of Dreams; final route TBC. Contours: AWS Terrain Tiles. Photos on 35 mm by Justin.',
    legalRight: 'Distance not included. That’s on you.'
  }
};
