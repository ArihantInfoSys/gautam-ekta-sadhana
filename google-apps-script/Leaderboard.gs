/**
 * Leaderboard.gs - Attendance leaderboard
 */

/**
 * Get the top 50 members sorted by total attendance.
 * @returns {Object} {success, leaderboard: [{rank, name, totalAttendance, currentStreak}]}
 */
function get() {
  var sheet = getSheet('MEMBERS');
  var data = sheet.getDataRange().getValues();
  var members = [];

  // Skip header row (index 0)
  for (var i = 1; i < data.length; i++) {
    members.push({
      id: String(data[i][0]),
      name: String(data[i][1]),
      totalAttendance: Number(data[i][4]),
      currentStreak: Number(data[i][5])
    });
  }

  // Sort by TotalAttendance descending
  members.sort(function(a, b) {
    return b.totalAttendance - a.totalAttendance;
  });

  // Take top 50 and add rank
  var top50 = members.slice(0, 50).map(function(m, index) {
    return {
      rank: index + 1,
      id: m.id,
      name: m.name,
      totalAttendance: m.totalAttendance,
      currentStreak: m.currentStreak
    };
  });

  return { success: true, data: top50 };
}
