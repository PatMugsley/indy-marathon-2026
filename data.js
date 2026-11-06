// Site content. Race facts mirror reference/race-info.md; spots and the plan
// mirror cheer-spots.md in the private planning repo.
// PUBLIC SITE: first names only. No phone numbers, hotels or addresses of
// where anyone is staying. Public spots and street corners are fine.
window.SITE = {
  title: "Monumental Marathon · Cheer Plan",
  raceDate: "2026-11-07",
  timeZone: "America/Indiana/Indianapolis",
  runners: "Jill, Anne & Belle",
  wave: "F",
  waveStart: "08:15", // ESTIMATE: Wave F release time not yet published
  // Every time on the site is a range: best case at fastPace, worst at slowPace.
  fastPace: "9:00",
  slowPace: "12:00",

  // false = the final crew plan isn't written yet, so the Plan tab shows a
  // "draft" note. Mirrors the "Final plan" in cheer-spots.md and the race-day
  // table in weekend-plan.md (as of Nov 6). Leave out anything about where the
  // crew is staying: no "home base" location on this public site.
  planFinal: true,

  meetingSpot: {
    name: "Indiana State Museum (proposed)",
    time: "13:30",
    where: "Front of the museum, on the canal",
    detail: "Two blocks west of gear check, which the runners pass anyway. Phone signal near the finish is poor, so agree on this before the start.",
    map: "Indiana State Museum, 650 W Washington St, Indianapolis, IN",
    latlng: [39.7686, -86.1696]
  },

  // Cheer spots on the course, numbered in this order on the map. `map` is the
  // search sent to Maps; `latlng` overrides placement on the course line.
  spots: [
    { id: "sendoff", name: "Wave F send-off", mile: 0, fixedTime: "7:15", until: "7:35", latlng: [39.7697, -86.1625],
      where: "Capitol Ave & Ohio St", map: "N Capitol Ave & W Ohio St, Indianapolis, IN",
      note: "Where Waves E and F walk to the corral. Last hugs." },
    { id: "nyst", name: "New York St", mile: 2.6, latlng: [39.7712, -86.1556],
      where: "New York St at Pennsylvania St, north sidewalk", map: "E New York St & N Pennsylvania St, Indianapolis, IN",
      note: "Be out by 8:30. The leaders pass around 8:10." },
    { id: "penn", name: "Pennsylvania St", mile: 4.7, latlng: [39.7780, -86.1562],
      where: "Pennsylvania St at Fort Wayne Ave, west sidewalk", map: "N Pennsylvania St & Fort Wayne Ave, Indianapolis, IN",
      note: "Walk north on Pennsylvania St right after they pass (10 min). No course to cross." },
    { id: "riverside", name: "Riverside Park", mile: 20,
      where: "White River Pkwy by Heslar Naval Armory", map: "Heslar Naval Armory, Indianapolis, IN",
      note: "Optional, with a second car or if you're early. Exit 116, west on 30th St to Riverside Dr. Drive (don't walk) on to mile 22." },
    { id: "mile22", name: "Mile 22 · Red Bull zone", mile: 22,
      where: "Burdsal Pkwy at Milburn St", map: "Milburn St & Burdsal Pkwy, Indianapolis, IN",
      note: "Park on a side street north of Burdsal Pkwy (inside the loop) and walk south. Don't park south of Burdsal." },
    { id: "meridian", name: "Meridian St", mile: 25.6, latlng: [39.7712, -86.1581],
      where: "Meridian St at New York St", map: "N Meridian St & W New York St, Indianapolis, IN",
      note: "Then head to the meeting spot. Allow 20–25 min: crossing the course on foot means a marshaled crossing." },
    { id: "finish", name: "Finish", mile: 26.2,
      where: "Washington St at Senate Ave", map: "W Washington St & N Senate Ave, Indianapolis, IN",
      note: "Park in the Senate Ave garage and walk 9 min." }
  ],

  // The race-day plan, in order. Either { spot: id, who, note } (time is
  // a range computed from the spot's mile at fastPace and slowPace) or
  // { time: "8:00", title, who, detail } for fixed-time steps, or { meet: true }.
  plan: [
    { spot: "sendoff", who: "Everyone" },
    { time: "8:00", title: "Race starts", detail: "Wave F crosses the line around 8:15 (estimate)." },
    { spot: "nyst", who: "Everyone" },
    { spot: "penn", who: "Everyone" },
    { time: "9:20", title: "Brunch near Mass Ave", who: "Everyone", detail: "A 5–10 min walk from Pennsylvania St. Hard stop at 10:35." },
    { time: "10:50", title: "Car group heads out", who: "Car group",
      detail: "You can't drive west downtown. Go east to I-65 North, Exit 116 (29th/30th St), then west on 30th St. Leave right away if the halfway split posts before about 10:15." },
    { spot: "riverside", who: "Optional" },
    { spot: "mile22", who: "Car group" },
    { time: "12:25", title: "Drive back", who: "Car group",
      detail: "29th or 30th St east to I-65 South, Exit 114, West St, then the Senate Ave garage. About 10 min." },
    { spot: "meridian", who: "Anyone on foot" },
    { spot: "finish", who: "Car group" },
    { meet: true }
  ],

  rule: "On the course itself: no bikes, strollers, dogs or coolers. Sidewalks are fine.",

  links: [
    { group: "Track the runners", items: [
      { title: "Live tracking (RTRT)", desc: "Search Jill, Anne or Belle. Updates at timing mats, so it lags a little.",
        url: "https://track.rtrt.me/e/BM-MONUMENTAL-MARATHON-2026" },
      { title: "Official race app", desc: "Opens the Beyond Monumental app on your phone, or web tracking if you don't have it.",
        url: "https://rtrt.me/ulink/BMA/BM-MONUMENTAL-MARATHON-2026" }
    ]},
    { group: "Official info", items: [
      { title: "Spectators & road closures", desc: "The race's page for spectators.",
        url: "https://monumentalmarathon.com/news-2/spectators-road-closures/" }
    ]}
  ],

  maps: [
    { title: "Course map", file: "course-map",
      pdf: "https://monumentalmarathon.com/wp-content/uploads/2026/10/CNOIMM_Official_Course_Maps.pdf" },
    { title: "Race morning", file: "race-morning-map",
      pdf: "https://monumentalmarathon.com/wp-content/uploads/2026/10/CNOIMM_Race_Day_Morning_Map.pdf" },
    { title: "Road closures", file: "traffic-restrictions-map",
      pdf: "https://monumentalmarathon.com/wp-content/uploads/2026/10/CNOIMM_Official_Race_Day_Traffic_Restriction_Map.pdf" },
    { title: "Drive to Riverside Park", file: "drive-to-riverside-park",
      pdf: "https://monumentalmarathon.kinsta.cloud/wp-content/uploads/2024/09/Race-site-to-Riverside-Final.pdf" },
    { title: "Bike trails", file: "bike-trails-map",
      pdf: "https://monumentalmarathon.com/wp-content/uploads/2026/10/CNOIMM_Course_Map_Bike_Trails.pdf" },
    { title: "Parking", file: "hotels-parking-map",
      pdf: "https://monumentalmarathon.com/wp-content/uploads/2026/10/CNOIMM_Hotels_Parking_Map.pdf" }
  ]
};
