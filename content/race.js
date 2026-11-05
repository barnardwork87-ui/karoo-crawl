/* =====================================================================
   CONTENT CONFIG · Karoo Crawl
   The only file to edit. See README for tokens and the build steps.
   TBC items are marked  // TODO  so they're easy to find.
===================================================================== */
window.CONTENT = {

  site: {
    slug: 'karoo',
    title: 'Karoo Crawl · 60 km around Place of Dreams',
    description: 'The Karoo Crawl: a 60 km run around Place of Dreams in the Tankwa Karoo. Headtorches at dawn, gravel until lunch, braai at the finish.',
    navTitle: '<img class="nav__wordmark" src="assets/karoo-crawl-logo.svg" alt="Karoo Crawl">',
    navSub: 'Place of Dreams · Aug 2027',
    navCta: 'tickets.html',
    countdownLabel: 'Next crawl in',
    countdownDone: 'Crawling'
  },

  nav: [
    ['index.html', 'Home', 'home'],
    ['about.html', 'About the Crawl', 'about'],
    ['tickets.html', 'Get your tickets<span class="tag">OPEN</span>', 'tickets']
  ],

  runner: {
    name: 'Barney',
    image: 'assets/barney.webp',
    imageAlt: 'Barney, seated, which is how most people finish this'
  },

  race: {
    name: 'Karoo Crawl',
    short: 'Karoo Crawl',
    date: '2027-08-21',          // TODO confirm date (Saturday a year on from 22 Aug 2026)
    start: '05:55',
    tz: '+02:00',
    days: ['Sat', 'Sun'],
    distanceKm: 60,
    climbM: 435,
    goalHours: 8,                // used for the "ETA" on the route map: a mid-pack 8 h
    survivalHours: 11,
    cutoffHours: 12,             // TODO confirm cut-off
    slider: [6, 12],
    sunrise: '07:22',            // Tankwa, late August
    sunset: '18:12',
    penalty: 'water only',
    crewAt: 'Aid at',
    stopsLabel: 'aid stops',
    etaLabel: 'ETA @ 8h pace',
    model: { upPer: 100, downPer: 250, fatiguePerKm: 0.006, nightFactor: 1.08 }
  },

  // 3D fly-down (home): where you land and which way you look
  fly: { startKm: 1.0, lookKm: 3.5, runKm: 2.5, exaggeration: 2.6, eye: 6 },

  loader: {
    messages: ['Finding the R356', 'Waking the husky', 'Counting the hills (one)', 'Lowering expectations', 'Charging headtorches', 'Lighting the braai early', 'Losing signal', 'Crawling']
  },

  /* Indicative route: last year's track around Place of Dreams. New route TBC. */
  stations: [
    { name: 'Start', label: 'Start · Place of Dreams', crew: true, stop: 0, kind: 'start', mapLabel: [12, 18, 'Place of Dreams'], flyLabel: 'Start · 05:55',
      photo: 'assets/img/start-group.jpg' },
    { name: 'The Van', label: 'The Van', crew: true, stop: 10, mapLabel: [12, 4, 'The Van'], photo: 'assets/img/aid-dog.jpg',
      leg: { title: 'The Dark Bit', where: 'Place of Dreams → the R356 gravel → the Van',
        blurb: 'Headtorches on at 05:55. It is cold, it is dark, and everyone is running a pace they will deny later. The sun comes up around km 12 and immediately starts judging you.' } },
    { name: 'Base', label: 'Base · Place of Dreams', crew: true, stop: 30, mapLabel: [-12, -8, 'Base (again)', 'end'], photo: 'assets/img/pod-three.jpg',
      leg: { title: 'The Long Road Home', where: 'The Van → back to Place of Dreams',
        blurb: 'Thirteen kilometres of road that is visibly the same road. You will see the base from very far away. It will not get closer for a while. This is called the Karoo.' } },
    { name: 'The Van (again)', label: 'The Van (again)', crew: true, stop: 10, mapLabel: [12, 14, null], photo: 'assets/img/van-road.jpg',
      leg: { title: 'Lap Two, Unfortunately', where: 'Place of Dreams → back out to the Van',
        blurb: 'You were at the pool. There was a chair. You left the chair. The Van is where you left it, and so is the husky, who has not moved and does not respect you.' } },
    { name: 'Finish', label: 'Finish · Place of Dreams', crew: true, stop: 0, kind: 'finish', photo: 'assets/img/braai.jpg',
      leg: { title: 'The Crawl', where: 'The Van → Place of Dreams',
        blurb: 'The last eleven. This is where the name comes from. Nobody runs this bit, they negotiate with it. The braai is already lit, which is either motivating or cruel.' } }
  ],

  pages: {
    home: {
      hero: {
        eyebrow: 'Place of Dreams · Tankwa Karoo · Aug 2027',
        side: 'The Karoo Crawl is 60 km on foot around Place of Dreams, an hour past Ceres on the R356. You start in the dark, you run on gravel, and you finish at a braai. That’s it. That’s the whole pitch. We’re not going to dress it up.',
        title: ['Sixty kilometres', 'of absolutely', 'nothing.', '*On purpose.'],
        meta: [['Start', 'Sat 05:55'], ['Distance', '60 km'], ['Climbing', '435 m'], ['Signal', 'None']],
        scroll: 'SCROLL ↓ TO START CRAWLING',
        startTag: 'km 0 · 05:55 · dark',
        finishTag: 'FINISH · braai'
      },
      statement: {
        eyebrow: 'The situation',
        text: 'One loop, twice. Four hundred metres of climbing, which out here counts as a mountain range. No spectators, no signal, one van, one husky. The husky is not crew. The husky is management.',
        photos: [['assets/img/start-group.jpg', 'The start, 05:50'], ['assets/img/sunrise-road.jpg', 'Sunrise on the road'], ['assets/img/husky-van.jpg', 'Management'], ['assets/img/road-dance.jpg', 'Morale, briefly'], ['assets/img/braai.jpg', 'The finish line']]
      },
      fly: {
        eyebrow: '01 · The view',
        caps: [
          ['From up here it looks easy.', 'Every brown line is twenty metres of up. You can count them. There aren’t many. Don’t get excited.'],
          ['That orange line is you.', 'Sixty kilometres of it. Twice past the same van. On purpose, again.'],
          ['Lower. The hills have opinions.', 'They’re small hills. They’re still hills. You will meet every single one of them personally.'],
          ['05:55. Headtorch on.', 'This is your view for the first hour, minus the light. The road goes that way for a very long time.'],
          ['That’s it. That’s the race.', 'Keep going until the van. Then keep going until the braai.']
        ]
      },
      report: {
        eyebrow: '02 · What to expect',
        title: 'We graded the course. It wasn’t close.',
        cards: [
          { colour: 'olive', icon: 'VRT', grade: 'C', title: 'Vert', text: '435 m over 60 km. Basically flat. The word “basically” is doing a lot of work at km 45.' },
          { colour: 'sky', icon: 'SHD', grade: 'F', title: 'Shade', text: 'There is a tree. It’s at the start. You will think about that tree for six hours.' },
          { colour: 'blue', icon: 'SIG', grade: 'F', title: 'Signal', text: 'None. Your Strava will upload on Monday, in Ceres, at a Wimpy, to a standing ovation from no one.' },
          { colour: 'paper', icon: 'VUE', grade: 'A', title: 'Scenery', text: 'Sunrise over the Tankwa is genuinely beautiful. You will see it for four seconds between looking at your feet.' },
          { colour: 'navy', icon: 'AID', grade: 'B+', title: 'Aid', text: 'A white Vito with Coke in it. Twice. The husky in the front seat does not hand anything out.' },
          { colour: 'lime', icon: 'VIB', grade: 'A+', title: 'Après', text: 'Pool. Braai. A man in a white shirt holding tongs like a weapon. The real race is the one to the fire.' }
        ],
        stamp: 'OVERALL: B−',
        stampSmall: 'Will finish · Will bring it up at work for a year'
      },
      route: {
        eyebrow: '03 · The route (indicative)',
        title: ['60 km of', 'gravel and regret.'],
        lede: 'Real contours, every 20 m, from elevation data. The orange line is indicative: it’s last year’s loop around Place of Dreams, and this year’s will be new. Hover a section to find out what you’re in for. Orange dots are where the Van is.',
        overviewWhere: 'Indicative · Place of Dreams → R356 gravel → the Van → Place of Dreams → the Van → Place of Dreams',
        overviewBlurb: 'Out, back, out, back. Mostly flat, mostly gravel, entirely exposed. The base is halfway, which is the most dangerous place in ultrarunning because it has a chair.'
      },
      marquee: ['Headtorches at 05:55', 'One husky, no notes', 'R356, then gravel', 'The Van has Coke', 'No signal, some problems', 'Braai at the finish'],
      cta: { photo: 'assets/img/sunrise-crew.jpg', eyebrow: '04 · Your move', title: ['Sixty kilometres.', 'One braai. Get in.'],
        links: [['tickets.html', 'Get your tickets'], ['about.html', 'What is this, exactly']] }
    },

    about: {
      eyebrow: 'About the Karoo Crawl',
      title: ['It’s a run.', 'In the Karoo.', '*That’s the pitch.'],
      lede: 'The Karoo Crawl started as a few people deciding a 60 km run in the desert was a weekend. It turned out it was. There’s a start, a finish, a van in between, and a braai at the end. Nobody has asked us to stop, so we haven’t.',
      whatTitle: ['What it is'],
      what: [
        ['60 km, mostly gravel', 'One loop around Place of Dreams, done twice-ish. Around 435 m of climbing, which is nothing, until it isn’t. Last year Barney did it in 8 hours 14. He’d like that on the record.'],
        ['You start in the dark', 'Gun at 05:55. Sunrise is around 07:20. That first hour is headtorches, cold air and people telling each other they feel great, which they do, for now.'],
        ['You finish at a braai', 'There is a pool and there is a fire. Those are the two finish lines. Most people cross both.']
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
      weekendEyebrow: 'The weekend (roughly how last year went)',
      weekend: [
        ['Friday · arrive', 'Drive in, find your pod, look at the stars, go to bed at nine like a person with plans.'],
        ['Saturday · 05:55', 'Headtorches. The group photo where everyone looks fresh. It will be the last one.'],
        ['Saturday · the middle', 'Gravel, sun, the Van, the husky, the base, the chair you’re not allowed to sit in. Repeat.'],
        ['Saturday · after', 'Pool, braai, someone with tongs taking it very seriously. Lies about pacing.']
      ],
      galleryTitle: ['Last year,', 'on film.'],
      galleryLede: 'Shot on 35 mm by Justin, who has no further notes. Everything here happened. Some of it was on purpose.',
      gallery: [
        ['assets/img/start-group.jpg', 'Start line. Optimism.', 'w8'],
        ['assets/img/headtorch-laugh.jpg', 'Km 2. Still laughing.', 'w4'],
        ['assets/img/sunrise-road.jpg', 'First light', 'w6'],
        ['assets/img/van-road.jpg', 'The Van', 'w6'],
        ['assets/img/coffee-stop.jpg', 'Aid station, artisanal', 'w3'],
        ['assets/img/husky-cab.jpg', 'Management', 'w6'],
        ['assets/img/road-dog.jpg', 'Pacer, unpaid', 'w3'],
        ['assets/img/road-dance.jpg', 'Morale was high. Briefly.', 'w4'],
        ['assets/img/aid-dog.jpg', 'Aid station two', 'w4'],
        ['assets/img/watch-check.jpg', 'Checking a watch that has no good news', 'w4'],
        ['assets/img/canyon.jpg', 'The canyon', 'w6'],
        ['assets/img/braai.jpg', 'The real finish line', 'w6'],
        ['assets/img/pool-day.jpg', 'Recovery protocol', 'w8'],
        ['assets/img/cactus.jpg', 'Local', 'w4']
      ],
      cta: { photo: 'assets/img/road-wave.jpg', eyebrow: 'Next', title: ['Fine.', 'Where do I sign.'],
        links: [['tickets.html', 'Get your tickets'], ['index.html', 'Back to the route']] }
    },

    tickets: {
      eyebrow: 'Get your tickets',
      title: ['Get in', 'the van.', '*(Figuratively.)'],
      lede: 'Entries for the 2027 Karoo Crawl. Numbers are small because the Van is small. Prices and the date are still being finalised, which is a polite way of saying someone has to call the farm.',
      tiersTitle: ['Pick your', 'suffering.'],
      tiers: [   // TODO prices + links
        { cls: 'card--paper', tag: 'Run only', name: 'The Crawl', price: 'TBC', unit: 'per runner',
          copy: 'You, 60 km, the Van, the braai. You sort out where you sleep.',
          items: ['Race entry, 60 km', 'Two visits to the Van (Coke, water, encouragement of a kind)', 'Braai at the finish', 'A story you will tell too often'],
          cta: ['#register', 'Register interest'] },
        { cls: 'card--orange', tag: 'The full weekend', name: 'Crawl & Camp', price: 'TBC', unit: 'per runner', sticker: 'Most sensible',
          copy: 'Everything in the Crawl, plus two nights at Place of Dreams, so you don’t drive home after 60 km like a lunatic.',
          items: ['Race entry, 60 km', 'Friday + Saturday night on site', 'Braai + pool access', 'Sunday: lying down'],
          cta: ['#register', 'Register interest'] },
        { cls: 'card--navy', tag: 'Not running', name: 'Crew / Plus-one', price: 'TBC', unit: 'per person',
          copy: 'For the people who come to watch, drive, hold things and say “you look great” without meaning it.',
          items: ['Weekend on site', 'Ride-along in the Van (subject to husky approval)', 'Braai', 'Bragging rights by association'],
          cta: ['#register', 'Register interest'] }
      ],
      rulesEyebrow: 'Before you click anything',
      rules: [
        ['Headtorch', 'Mandatory. The start is in the dark. Phone torches are not headtorches and we will laugh.'],
        ['Carry water', 'At least 1.5 L. The Van is a long way apart from itself.'],
        ['No signal', 'Tell someone where you are. Then tell them again. Then come back.'],
        ['Respect the land', 'Place of Dreams is a private wilderness. Leave nothing but footprints and a bit of your dignity.']
      ],
      registerTitle: ['Register interest'],
      registerLede: 'Tickets open when the date is locked. Leave your name with us and you’ll hear first.',
      registerUrl: 'mailto:hello@example.com?subject=Karoo%20Crawl%202027',   // TODO real ticket link or address
      registerLabel: 'Email us to get on the list',
      cta: { photo: 'assets/img/braai.jpg', eyebrow: 'The finish', title: ['See you at', 'the fire.'],
        links: [['about.html', 'About the Crawl'], ['index.html', 'Home']] }
    }
  },

  footer: {
    title: 'Karoo Crawl',
    blurb: 'Sixty kilometres around Place of Dreams in the Tankwa Karoo. Organised by people who should not be trusted with a clipboard.',
    groups: [
      ['The Crawl', [['index.html', 'Home'], ['about.html', 'About'], ['tickets.html', 'Tickets']]],
      ['Out there', [['https://placeofdreams.co.za/', 'Place of Dreams ↗'], ['https://www.strava.com/', 'Strava (upload Monday) ↗']]]
    ],
    big: 'See you at the Van.',
    legal: 'Indicative route from last year’s GPS track. Contours: AWS Terrain Tiles. Photos on 35 mm by Justin.',
    legalRight: 'Distances are estimates. The husky is not.'
  }
};
