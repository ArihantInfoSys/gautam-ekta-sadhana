/**
 * Leaderboard.gs - Attendance leaderboard with period + branch filtering.
 *
 * Returns top 50 members sorted by attendance for the requested period.
 * Each row also includes the user's branch and the name of the leader for
 * that branch (first MEMBERS row in the same branch with role='leader').
 *
 * Streak intentionally NOT returned — leaderboard focuses on attendance.
 */

/**
 * @param {string} period - 'daily' | 'weekly' | 'monthly' | 'all' (default 'all')
 * @param {string} branch - district name or 'all' (default 'all')
 */
function get(period, branch) {
  period = period || 'all';
  branch = branch || 'all';

  var membersSheet = getSheet('MEMBERS');
  var membersData = membersSheet.getDataRange().getValues();

  // Build leader-by-branch lookup (first leader found per branch wins)
  var leaderByBranch = {};
  for (var k = 1; k < membersData.length; k++) {
    var bRole = String(membersData[k][7]).trim().toLowerCase();
    var bBranch = String(membersData[k][8]).trim();
    if ((bRole === 'leader' || bRole === 'admin') && bBranch && !leaderByBranch[bBranch]) {
      leaderByBranch[bBranch] = String(membersData[k][1]);
    }
  }

  // Collect candidate members (filtered by branch)
  var members = [];
  for (var i = 1; i < membersData.length; i++) {
    var memberBranch = String(membersData[i][8]).trim();
    if (branch !== 'all' && memberBranch !== branch) continue;
    members.push({
      id: String(membersData[i][0]).trim(),
      name: String(membersData[i][1]),
      branch: memberBranch,
      lifetimeAttendance: Number(membersData[i][4]) || 0
    });
  }

  // Compute attendance for the requested period
  var attendanceByUser = {};
  if (period === 'all') {
    members.forEach(function(m) { attendanceByUser[m.id] = m.lifetimeAttendance; });
  } else {
    var days = period === 'daily' ? 1 : (period === 'weekly' ? 7 : 30);
    var windowDates = {};
    for (var d = days - 1; d >= 0; d--) {
      var dt = new Date();
      dt.setDate(dt.getDate() - d);
      windowDates[Utilities.formatDate(dt, 'Asia/Kolkata', 'yyyy-MM-dd')] = true;
    }

    var memberIds = {};
    members.forEach(function(m) { memberIds[m.id] = true; attendanceByUser[m.id] = 0; });

    var attSheet = getOrCreateSheet('ATTENDANCE', ['UserID', 'Date', 'Status', 'Timestamp']);
    var attData = attSheet.getDataRange().getValues();
    for (var j = 1; j < attData.length; j++) {
      var uid = String(attData[j][0]).trim();
      var dateStr = normalizeAttendanceDate(attData[j][1]);
      if (memberIds[uid] && windowDates[dateStr]) {
        attendanceByUser[uid]++;
      }
    }
  }

  // Build, sort, slice
  var rows = members.map(function(m) {
    return {
      id: m.id,
      name: m.name,
      branch: m.branch,
      attendance: attendanceByUser[m.id] || 0,
      leaderName: leaderByBranch[m.branch] || ''
    };
  });

  rows.sort(function(a, b) { return b.attendance - a.attendance; });

  var top50 = rows.slice(0, 50).map(function(r, idx) {
    return {
      rank: idx + 1,
      id: r.id,
      name: r.name,
      branch: r.branch,
      attendance: r.attendance,
      leaderName: r.leaderName
    };
  });

  return { success: true, data: top50 };
}

/**
 * Backwards-compatible wrapper used by older route names.
 * @param {string} branch
 */
function getByBranch(branch) {
  return get('all', branch);
}
