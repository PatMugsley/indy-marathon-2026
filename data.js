// Site content. Race facts come from reference/race-info.md; spots from cheer-spots.md.
// No phone numbers, hotels or other personal details here: this site is public.
window.SITE = {
  raceStartISO: "2026-11-07T08:00:00-05:00", // gun time, Eastern
  courseCloses: "3:30 p.m.",
  timeZone: "America/Indiana/Indianapolis",
  defaultWaveStart: "08:15", // ESTIMATE: Wave F release time not yet published
  finishOptions: ["4:40", "5:00", "5:30", "6:00", "6:30"],
  defaultFinish: "5:30",
  trackingUrl: "https://track.rtrt.me/e/BM-MONUMENTAL-MARATHON-2026",
  spectatorInfoUrl: "https://monumentalmarathon.com/news-2/spectators-road-closures/",

  meetingSpot: {
    decided: false,
    name: "Still deciding",
    detail: "We'll pick a spot a few blocks from the finish crowd, near the Statehouse or Monument Circle. Check back here before Saturday.",
    mapQuery: ""
  },

  runners: [
    { name: "Jill", outfit: "Outfit coming soon", goal: "" },
    { name: "Anne", outfit: "Outfit coming soon", goal: "" },
    { name: "Belle", outfit: "Outfit coming soon", goal: "" }
  ],

  spots: [
    { name: "Corral send-off", mile: 0, fixedTime: "~7:30 a.m.",
      where: "West St & New York St", map: "West St & New York St, Indianapolis, IN",
      why: "Last hugs before the start. Wave F lines up farthest north on West St.",
      tags: ["Walkable from downtown"] },
    { name: "Virginia Ave", mile: 2,
      where: "Virginia Ave & Maryland St", map: "Virginia Ave & E Maryland St, Indianapolis, IN",
      why: "Early spot close to Monument Circle. Easy walk from the start.",
      tags: ["On foot"] },
    { name: "Mass Ave", mile: 3.3,
      where: "Mass Ave, Alabama St to College Ave", map: "Massachusetts Ave & N Alabama St, Indianapolis, IN",
      why: "Big crowds and music: cloggers at mile 3.3, Bottleworks at 3.7. Best early spot on foot.",
      tags: ["On foot", "Music"] },
    { name: "Pennsylvania St", mile: 6,
      where: "Pennsylvania St around 16th–22nd St", map: "N Pennsylvania St & E 22nd St, Indianapolis, IN",
      why: "Herron HS Band at 16th. Meridian St (mile 24.5) is one block west, so you can see them twice without moving.",
      tags: ["See them twice"] },
    { name: "Broad Ripple (halfway)", mile: 13.1,
      where: "College Ave & 64th St", map: "N College Ave & E 64th St, Indianapolis, IN",
      why: "The halfway point. Most food, coffee and restrooms, and a lively crowd. On the Monon Trail.",
      tags: ["Food & coffee", "Restrooms", "Bike: Monon Trail"] },
    { name: "Newfields", mile: 18,
      where: "W 42nd St by Newfields", map: "Newfields, 4000 N Michigan Rd, Indianapolis, IN",
      why: "A quieter stretch where encouragement goes a long way.",
      tags: ["Quiet stretch"] },
    { name: "Riverside Park", mile: 20,
      where: "Heslar Naval Armory, White River Pkwy", map: "Heslar Naval Armory, Indianapolis, IN",
      why: "The race's recommended spectator spot. Miles 20+ are the hard part, so this one counts. Drive up I-65; 38th St stays open.",
      tags: ["Recommended", "By car"] },
    { name: "Mile 22 spectator zone", mile: 22,
      where: "Milburn St & Burdsal Pkwy", map: "Milburn St & Burdsal Pkwy, Indianapolis, IN",
      why: "Red Bull DJ and an organized spectator area.",
      tags: ["Music"] },
    { name: "Fall Creek & Meridian", mile: 23,
      where: "Fall Creek Pkwy & Meridian St", map: "Fall Creek Pkwy N Dr & N Meridian St, Indianapolis, IN",
      why: "Also about mile 7 on the way out, so it's another see-them-twice spot.",
      tags: ["See them twice"] },
    { name: "Meridian St", mile: 24.5,
      where: "Meridian St around 12th–16th St", map: "N Meridian St & W 14th St, Indianapolis, IN",
      why: "Last push before the finish. Shared with the half marathon, so it may be crowded earlier.",
      tags: ["Near finish"] },
    { name: "Finish", mile: 26.2,
      where: "Washington St at Senate Ave", map: "W Washington St & N Senate Ave, Indianapolis, IN",
      why: "By the Indiana Statehouse. Phone signal is often poor here, so agree on the meeting spot ahead of time.",
      tags: ["Finish line"] }
  ],

  maps: [
    { title: "Course map", file: "course-map", desc: "The whole marathon route with mile markers and aid stations.",
      pdf: "https://monumentalmarathon.com/wp-content/uploads/2026/10/CNOIMM_Official_Course_Maps.pdf" },
    { title: "Race morning map", file: "race-morning-map", desc: "Start corrals, gear check and the finish area downtown.",
      pdf: "https://monumentalmarathon.com/wp-content/uploads/2026/10/CNOIMM_Race_Day_Morning_Map.pdf" },
    { title: "Road closures", file: "traffic-restrictions-map", desc: "Which roads close, and when. Check before driving.",
      pdf: "https://monumentalmarathon.com/wp-content/uploads/2026/10/CNOIMM_Official_Race_Day_Traffic_Restriction_Map.pdf" },
    { title: "Drive to Riverside Park", file: "drive-to-riverside-park", desc: "Official route from downtown to mile 20 and back.",
      pdf: "https://monumentalmarathon.kinsta.cloud/wp-content/uploads/2024/09/Race-site-to-Riverside-Final.pdf" },
    { title: "Bike trails", file: "bike-trails-map", desc: "Monon, Fall Creek and White River trails that cross the course.",
      pdf: "https://monumentalmarathon.com/wp-content/uploads/2026/10/CNOIMM_Course_Map_Bike_Trails.pdf" },
    { title: "Hotels & parking", file: "hotels-parking-map", desc: "Garages and lots near the start and finish.",
      pdf: "https://monumentalmarathon.com/wp-content/uploads/2026/10/CNOIMM_Hotels_Parking_Map.pdf" }
  ],

  schedule: [
    { day: "Thursday, Nov 5", items: [
      { time: "4–7 p.m.", what: "Expo & packet pickup", detail: "Indiana Convention Center, Halls A & B. Garages on Maryland St get busy; park a few blocks away." }
    ]},
    { day: "Friday, Nov 6", items: [
      { time: "11 a.m.–8 p.m.", what: "Expo & packet pickup", detail: "Indiana Convention Center." },
      { time: "Evening", what: "Pre-race dinner", detail: "Place and time to be decided." }
    ]},
    { day: "Saturday, Nov 7 — race day", items: [
      { time: "6:30 a.m.", what: "Gear check opens", detail: "Washington St & West St." },
      { time: "~7:30 a.m.", what: "Corral send-off", detail: "Runners head into the Wave F corral on West St, north of New York St." },
      { time: "8:00 a.m.", what: "Race starts", detail: "Wave F crosses the start line a few minutes later." },
      { time: "Morning", what: "Crew moves between spots", detail: "See the Spots tab for estimated times." },
      { time: "~1–3 p.m.", what: "Finish", detail: "Washington St at Senate Ave, depending on pace." },
      { time: "3:30 p.m.", what: "Course closes", detail: "" }
    ]}
  ],

  tips: {
    bring: ["A sign or a cowbell", "A charged phone and a battery pack", "Warm layers (it's early November)", "A card or phone pay — the event is mostly cashless"],
    rules: ["No bikes, strollers, dogs, coolers or selfie sticks on the course itself. Sidewalks are fine.", "Don't run alongside the runners."],
    gettingAround: [
      "Roads around the start and finish are closed 5 a.m.–5:30 p.m. Crossing the course by car is hard from 8–11 a.m.",
      "38th St, I-65 and I-70 stay open all day.",
      "Street parking and flat lots use ParkMobile. Downtown has construction, so use a navigation app.",
      "Pacers Bike Share is available. Free, secure bike parking is on Senate Ave by the Statehouse."
    ]
  }
};
