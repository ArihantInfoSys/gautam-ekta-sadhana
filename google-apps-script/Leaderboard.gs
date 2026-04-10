/**
 * Leaderboard.gs - Attendance leaderboard with branch filtering
 */

/**
 * Get top 50 members sorted by total attendance (all branches).
 */
function get() {
  return getByBranch('all');
}

/**
 * Get top 50 members filtered by branch.
 * @param {string} branch - District name or 'all' for all branches
 */
function getByBranch(branch) {
  var sheet = getSheet('MEMBERS');
  var data = sheet.getDataRange().getValues();
  var members = [];

  for (var i = 1; i < data.length; i++) {
    var memberBranch = String(data[i][8]).trim();
    // Filter by branch unless 'all'
    if (branch && branch !== 'all' && memberBranch !== branch) {
      continue;
    }
    members.push({
      id: String(data[i][0]),
      name: String(data[i][1]),
      totalAttendance: Number(data[i][4]),
      currentStreak: Number(data[i][5]),
      branch: memberBranch
    });
  }

  members.sort(function(a, b) {
    return b.totalAttendance - a.totalAttendance;
  });

  var top50 = members.slice(0, 50).map(function(m, index) {
    return {
      rank: index + 1,
      id: m.id,
      name: m.name,
      totalAttendance: m.totalAttendance,
      currentStreak: m.currentStreak,
      branch: m.branch
    };
  });

  return { success: true, data: top50 };
}
