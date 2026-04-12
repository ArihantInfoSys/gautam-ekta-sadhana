/**
 * Attendance.gs - Mark attendance and track streaks
 */

/**
 * Normalize a date cell value to 'yyyy-MM-dd' string.
 * Google Sheets auto-converts string cells that look like dates into Date
 * objects when read via getValues(), so String(cell) can produce something
 * like "Sat Apr 11 2026 00:00:00 GMT+0530". Always funnel date cells through
 * this helper before comparing.
 */
function normalizeAttendanceDate(val) {
  if (val instanceof Date) {
    return Utilities.formatDate(val, 'Asia/Kolkata', 'yyyy-MM-dd');
  }
  return String(val).trim();
}

/**
 * Mark attendance for a user.
 * @param {Object} data - {userId: string}
 * @returns {Object} {success, streak, total} or error
 */
function mark(data) {
  var lock = LockService.getScriptLock();
  try {
    // 6:15 AM IST cutoff check (before acquiring lock)
    var now = new Date();
    var hour = parseInt(Utilities.formatDate(now, 'Asia/Kolkata', 'HH'));
    var minute = parseInt(Utilities.formatDate(now, 'Asia/Kolkata', 'mm'));
    if (hour > 6 || (hour === 6 && minute > 15)) {
      return { success: false, error: 'उपस्थिति का समय समाप्त हो गया है। कृपया कल सुबह 6 बजे जुड़ें।' };
    }

    lock.waitLock(15000);

    var userId = (data.userId || '').trim();
    if (!userId) {
      return { success: false, error: 'User ID is required.' };
    }

    // Verify user exists
    var memberRow = findRowById(userId);
    if (memberRow === -1) {
      return { success: false, error: 'User not found.' };
    }

    var today = todayIST();
    var attendanceSheet = getOrCreateSheet('ATTENDANCE', ['UserID', 'Date', 'Status', 'Timestamp']);

    // Check for duplicate attendance today
    var attendanceData = attendanceSheet.getDataRange().getValues();
    for (var i = 1; i < attendanceData.length; i++) {
      if (String(attendanceData[i][0]).trim() === userId &&
          normalizeAttendanceDate(attendanceData[i][1]) === today) {
        return { success: false, error: 'Attendance already marked for today.' };
      }
    }

    // Add attendance row: UserID, Date, Status, Timestamp
    var timestamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');
    attendanceSheet.appendRow([userId, today, 'present', timestamp]);

    // Update MEMBERS sheet
    var membersSheet = getSheet('MEMBERS');
    var memberValues = membersSheet.getRange(memberRow, 1, 1, 8).getValues()[0];

    var totalAttendance = Number(memberValues[4]) + 1;
    var currentStreak = Number(memberValues[5]);
    var lastAttendanceDate = String(memberValues[6]).trim();
    var yesterday = yesterdayIST();

    // Streak logic
    if (lastAttendanceDate === yesterday) {
      currentStreak = currentStreak + 1;
    } else {
      currentStreak = 1;
    }

    // Update: TotalAttendance (col 5), CurrentStreak (col 6), LastAttendanceDate (col 7)
    membersSheet.getRange(memberRow, 5).setValue(totalAttendance);
    membersSheet.getRange(memberRow, 6).setValue(currentStreak);
    membersSheet.getRange(memberRow, 7).setValue(today);

    return {
      success: true,
      data: {
        marked: true,
        totalAttendance: totalAttendance,
        currentStreak: currentStreak,
        lastAttendanceDate: today
      }
    };
  } catch (err) {
    return { success: false, error: err.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Get the count of attendance records for today.
 * @returns {Object} {success, count}
 */
function getTodayCount() {
  var today = todayIST();
  var sheet = getOrCreateSheet('ATTENDANCE', ['UserID', 'Date', 'Status', 'Timestamp']);
  var data = sheet.getDataRange().getValues();
  var count = 0;

  for (var i = 1; i < data.length; i++) {
    if (normalizeAttendanceDate(data[i][1]) === today) {
      count++;
    }
  }

  return { success: true, data: { count: count, date: today } };
}

/**
 * Get list of members who attended today, with their names.
 * @returns {Object} {success, data: [{name, userId}]}
 */
function getTodayAttendees() {
  var today = todayIST();
  var attendanceSheet = getOrCreateSheet('ATTENDANCE', ['UserID', 'Date', 'Status', 'Timestamp']);
  var attendanceData = attendanceSheet.getDataRange().getValues();

  // Collect userIds for today
  var todayIds = [];
  for (var i = 1; i < attendanceData.length; i++) {
    if (normalizeAttendanceDate(attendanceData[i][1]) === today) {
      todayIds.push(String(attendanceData[i][0]).trim());
    }
  }

  // Build name map from MEMBERS
  var membersSheet = getSheet('MEMBERS');
  var membersData = membersSheet.getDataRange().getValues();
  var nameMap = {};
  for (var j = 1; j < membersData.length; j++) {
    nameMap[String(membersData[j][0]).trim()] = String(membersData[j][1]);
  }

  var attendees = todayIds.map(function(id) {
    return { userId: id, name: nameMap[id] || 'साधक' };
  });

  return { success: true, data: { attendees: attendees, count: attendees.length, date: today } };
}

/**
 * Get weekly or monthly attendance report filtered by branch.
 * Returns a per-user attendance matrix so the frontend can render
 * ratios like "5/7" and day-by-day dot visualizations.
 *
 * @param {string} branch - District name or 'all'
 * @param {string} period - 'weekly' (7 days) or 'monthly' (30 days)
 */
function getBranchAttendanceReport(branch, period) {
  var days = period === 'monthly' ? 30 : 7;

  // Build ordered date array for the period (oldest → newest, yyyy-MM-dd)
  var dates = [];
  for (var d = days - 1; d >= 0; d--) {
    var dt = new Date();
    dt.setDate(dt.getDate() - d);
    dates.push(Utilities.formatDate(dt, 'Asia/Kolkata', 'yyyy-MM-dd'));
  }

  // Collect members in the requested branch, plus streak lookup
  var membersSheet = getSheet('MEMBERS');
  var membersData = membersSheet.getDataRange().getValues();
  var branchMemberIds = {};
  var memberNames = {};
  var memberStreaks = {};

  for (var i = 1; i < membersData.length; i++) {
    var memberBranch = String(membersData[i][8]).trim();
    if (!branch || branch === 'all' || memberBranch === branch) {
      var id = String(membersData[i][0]).trim();
      branchMemberIds[id] = true;
      memberNames[id] = String(membersData[i][1]);
      memberStreaks[id] = Number(membersData[i][5]) || 0;
    }
  }

  // Scan ATTENDANCE sheet
  var attendanceSheet = getOrCreateSheet('ATTENDANCE', ['UserID', 'Date', 'Status', 'Timestamp']);
  var attendanceData = attendanceSheet.getDataRange().getValues();

  var dayCounts = {};
  dates.forEach(function(date) { dayCounts[date] = 0; });

  var userDates = {}; // userId -> { "2026-04-11": true, ... }

  for (var j = 1; j < attendanceData.length; j++) {
    var userId = String(attendanceData[j][0]).trim();
    var dateStr = normalizeAttendanceDate(attendanceData[j][1]);
    if (dayCounts.hasOwnProperty(dateStr) && branchMemberIds[userId]) {
      dayCounts[dateStr]++;
      if (!userDates[userId]) userDates[userId] = {};
      userDates[userId][dateStr] = true;
    }
  }

  var dailyData = dates.map(function(date) {
    return { date: date, count: dayCounts[date] };
  });

  // Build userAttendance — every branch member (including 0-attendance),
  // sorted by attendance desc, then streak desc as tiebreaker.
  var userAttendance = Object.keys(branchMemberIds).map(function(uid) {
    var attended = userDates[uid] ? Object.keys(userDates[uid]).sort() : [];
    return {
      userId: uid,
      name: memberNames[uid] || 'साधक',
      attendedCount: attended.length,
      totalDays: days,
      attendedDates: attended,
      currentStreak: memberStreaks[uid] || 0
    };
  }).sort(function(a, b) {
    if (b.attendedCount !== a.attendedCount) return b.attendedCount - a.attendedCount;
    return b.currentStreak - a.currentStreak;
  });

  // Compute summary metrics from active members only
  var active = userAttendance.filter(function(u) { return u.attendedCount > 0; });
  var totalAttendance = active.reduce(function(s, u) { return s + u.attendedCount; }, 0);
  var avg = active.length
    ? Math.round(active.reduce(function(s, u) { return s + (u.attendedCount / days) * 100; }, 0) / active.length)
    : 0;

  return {
    success: true,
    data: {
      period: period,
      branch: branch,
      totalDays: days,
      dailyData: dailyData,
      userAttendance: userAttendance,
      totalUniqueCount: active.length,
      totalAttendance: totalAttendance,
      averagePercentage: avg
    }
  };
}
