// APPROXIMATE marathon course, hand-traced from the official course map PDF
// (reference/maps/course-map.pdf). Points are [lat, lon] or [lat, lon, mile].
// The third value pins an official mile marker to that point; miles between
// anchors are spread by distance. Good enough to see the shape and where spots
// sit, not survey-accurate. TODO: replace with a line traced from OpenStreetMap.
window.COURSE = [
  [39.76583, -86.16715, 0],      // Start: West St at Maryland St, heading south
  [39.76162, -86.16555],         // Missouri St at South St
  [39.75669, -86.16575],         // Missouri St at McCarty St
  [39.75642, -86.15488, 1],      // McCarty St at Delaware St
  [39.76137, -86.15470],         // Delaware St at South St
  [39.76124, -86.14927],         // South St at Virginia Ave
  [39.76580, -86.15330, 2],      // Virginia Ave at Maryland St
  [39.76730, -86.15470],         // Delaware St at Washington St
  [39.77120, -86.15470],         // Delaware St at New York St
  [39.77120, -86.15170],         // New York St at Alabama St
  [39.77380, -86.15170, 3],      // Alabama St at Mass Ave
  [39.78150, -86.14130, 4],      // Mass Ave at 10th St / Bellefontaine
  [39.78150, -86.14700],         // 10th St at Fort Wayne Ave
  [39.77800, -86.15620],         // Fort Wayne Ave at Pennsylvania St
  [39.78300, -86.15620, 5],      // Pennsylvania St, heading north
  [39.79600, -86.15620, 6],      // Pennsylvania St at 22nd St
  [39.80300, -86.15600],         // Pennsylvania St near Fall Creek
  [39.80550, -86.15200, 7],      // Fall Creek Pkwy S Dr near Delaware / 28th
  [39.81050, -86.14200],         // Fall Creek Pkwy N Dr near 30th
  [39.82000, -86.13600, 8],      // Fall Creek Pkwy N Dr
  [39.82500, -86.13850],         // Coliseum Ave at 38th St
  [39.82500, -86.14400, 9],      // 38th St, heading west
  [39.82500, -86.15100],         // 38th St at Washington Blvd
  [39.83300, -86.15100, 10],     // Washington Blvd, heading north
  [39.84800, -86.15100, 11],     // Washington Blvd
  [39.85950, -86.15100, 12],     // Washington Blvd at 58th St
  [39.85950, -86.14570],         // 58th St at College Ave
  [39.87000, -86.14570, 13],     // College Ave
  [39.87100, -86.14570, 13.1],   // College Ave at 64th St: halfway, Broad Ripple
  [39.87100, -86.14800],         // 64th St at Park Ave
  [39.87700, -86.14800],         // Park Ave, north end
  [39.87500, -86.15300, 14],     // Riverview Dr
  [39.87300, -86.15750],         // Riverview Dr at Meridian St
  [39.86000, -86.15750, 15],     // Meridian St, heading south
  [39.84400, -86.15750, 16],     // Meridian St
  [39.83900, -86.15750],         // Meridian St at 46th St
  [39.83900, -86.16000],         // 46th St at Illinois St
  [39.83300, -86.16300, 17],     // Boulevard Pl at 42nd St
  [39.83300, -86.17700],         // 42nd St, heading west
  [39.82900, -86.18000, 18],     // 42nd St bends southwest by Newfields
  [39.82500, -86.18750, 19],     // 38th St at White River Pkwy E Dr
  [39.82040, -86.18880],         // White River Pkwy E Dr, heading south
  [39.81540, -86.18990],         // White River Pkwy E Dr
  [39.81000, -86.19400, 20],     // By Heslar Naval Armory
  [39.80570, -86.19680],         // White River Pkwy E Dr through Riverside Park
  [39.80070, -86.19720, 21],     // Riverside Park, at Burdsal Pkwy
  [39.80060, -86.19370],         // Burdsal Pkwy by Taggart Memorial
  [39.80090, -86.18000, 22],     // Burdsal Pkwy at Milburn St
  [39.79900, -86.17200],         // Fall Creek Blvd
  [39.79780, -86.16460],         // Fall Creek Pkwy N Dr
  [39.80120, -86.16360],         // Fall Creek Pkwy N Dr
  [39.80300, -86.15780, 23],     // Fall Creek Pkwy at Meridian St
  [39.79000, -86.15810, 24],     // Meridian St, heading south
  [39.77600, -86.15810, 25],     // Meridian St
  [39.77120, -86.15810],         // Meridian St at New York St
  [39.77120, -86.16250, 26],     // New York St at Capitol Ave
  [39.76730, -86.16250],         // Capitol Ave at Washington St
  [39.76730, -86.16500, 26.2]    // Finish: Washington St at Senate Ave
];
