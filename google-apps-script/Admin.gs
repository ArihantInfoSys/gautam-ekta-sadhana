/**
 * Admin.gs - Admin dashboard and settings management
 */

/**
 * Get the admin dashboard data.
 * @returns {Object} {success, todayCount, last7Days: [{date, count}], inactiveUsers: [{id, name, phone, lastAttendanceDate}]}
 */
function getDashboard() {
  var today = todayIST();

  // Build an array of the last 7 dates
  var last7Dates = [];
  for (var d = 6; d >= 0; d--) {
    var dt = new Date();
    dt.setDate(dt.getDate() - d);
    last7Dates.push(Utilities.formatDate(dt, 'Asia/Kolkata', 'yyyy-MM-dd'));
  }

  // Count attendance per day from ATTENDANCE sheet
  var attendanceSheet = getSheet('ATTENDANCE');
  var attendanceData = attendanceSheet.getDataRange().getValues();

  var dayCounts = {};
  for (var i = 0; i < last7Dates.length; i++) {
    dayCounts[last7Dates[i]] = 0;
  }

  var todayCount = 0;
  for (var j = 1; j < attendanceData.length; j++) {
    var dateStr = String(attendanceData[j][1]).trim();
    if (dateStr === today) {
      todayCount++;
    }
    if (dayCounts.hasOwnProperty(dateStr)) {
      dayCounts[dateStr]++;
    }
  }

  var last7DaysArray = last7Dates.map(function(date) {
    return { date: date, count: dayCounts[date] };
  });

  // Find inactive users (LastAttendanceDate older than 7 days)
  var membersSheet = getSheet('MEMBERS');
  var membersData = membersSheet.getDataRange().getValues();
  var cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 7);
  var cutoffStr = Utilities.formatDate(cutoffDate, 'Asia/Kolkata', 'yyyy-MM-dd');

  var todayDateObj = new Date();
  var inactiveUsers = [];
  for (var k = 1; k < membersData.length; k++) {
    var lastDate = String(membersData[k][6]).trim();
    // Inactive if never attended or last attendance is older than 7 days
    if (!lastDate || lastDate < cutoffStr) {
      var daysInactive;
      if (!lastDate) {
        daysInactive = -1;
      } else {
        var lastDateObj = new Date(lastDate);
        daysInactive = Math.floor((todayDateObj - lastDateObj) / (1000 * 60 * 60 * 24));
      }
      inactiveUsers.push({
        name: String(membersData[k][1]),
        lastDate: lastDate || '',
        daysInactive: daysInactive
      });
    }
  }

  return {
    success: true,
    data: {
      todayCount: todayCount,
      weeklyData: last7DaysArray,
      inactiveUsers: inactiveUsers
    }
  };
}

/**
 * Get all settings as key-value pairs.
 * @returns {Object} {success, settings: {key: value, ...}}
 */
function getSettings() {
  var sheet = getSheet('SETTINGS');
  var data = sheet.getDataRange().getValues();
  var settings = {};

  for (var i = 1; i < data.length; i++) {
    var key = String(data[i][0]).trim();
    var value = String(data[i][1]).trim();
    if (key) {
      settings[key] = value;
    }
  }

  return { success: true, data: settings };
}

/**
 * Update a setting. Only admins can do this.
 * @param {Object} data - {userId: string, key: string, value: string}
 * @returns {Object} {success} or error
 */
function updateSettings(data) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    var userId = (data.userId || '').trim();
    var key = (data.key || '').trim();
    var value = data.value !== undefined ? String(data.value) : '';

    if (!userId || !key) {
      return { success: false, error: 'userId and key are required.' };
    }

    // Check if user is admin
    var memberRow = findRowById(userId);
    if (memberRow === -1) {
      return { success: false, error: 'User not found.' };
    }

    var membersSheet = getSheet('MEMBERS');
    var role = String(membersSheet.getRange(memberRow, 8).getValue()).trim();
    if (role !== 'admin') {
      return { success: false, error: 'Only admins can update settings.' };
    }

    // Find or create the setting row
    var settingsSheet = getSheet('SETTINGS');
    var settingsData = settingsSheet.getDataRange().getValues();
    var settingRow = -1;

    for (var i = 1; i < settingsData.length; i++) {
      if (String(settingsData[i][0]).trim() === key) {
        settingRow = i + 1;
        break;
      }
    }

    if (settingRow === -1) {
      // Add new setting
      settingsSheet.appendRow([key, value]);
    } else {
      // Update existing setting
      settingsSheet.getRange(settingRow, 2).setValue(value);
    }

    return { success: true, data: { updated: true } };
  } catch (err) {
    return { success: false, error: err.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Get the daily bhaav (spiritual thought) from SETTINGS.
 * @returns {Object} {success, bhaav: string}
 */
function getDailyBhaav() {
  var settingsResult = getSettings();
  if (!settingsResult.success) {
    return { success: false, error: 'Could not read settings.' };
  }

  var bhaav = settingsResult.data['DailyBhaav'] || '';
  return { success: true, data: { text: bhaav, date: todayIST() } };
}
