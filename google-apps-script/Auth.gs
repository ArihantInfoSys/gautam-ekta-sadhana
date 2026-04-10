/**
 * Auth.gs - Simple phone-based authentication (no OTP)
 */

/**
 * Sign up a new user.
 * @param {Object} data - {name: string, phone: string}
 * @returns {Object} User object or error
 */
function signup(data) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    var name = (data.name || '').trim();
    var phone = (data.phone || '').trim();
    var role = (data.role || 'member').trim();
    // Only allow member or leader from self-registration
    if (role !== 'member' && role !== 'leader') {
      role = 'member';
    }

    if (!name || !phone) {
      return { success: false, error: 'Name and phone are required.' };
    }

    // Check if phone already exists
    var existingRow = findRowByPhone(phone);
    if (existingRow !== -1) {
      return { success: false, error: 'Phone number already registered.' };
    }

    var sheet = getSheet('MEMBERS');
    var id = generateId();
    var joinDate = todayIST();

    // Columns: ID, Name, Phone, JoinDate, TotalAttendance, CurrentStreak, LastAttendanceDate, Role
    var newRow = [id, name, phone, joinDate, 0, 0, '', role];
    sheet.appendRow(newRow);

    return {
      success: true,
      data: {
        id: id,
        name: name,
        phone: phone,
        joinDate: joinDate,
        totalAttendance: 0,
        currentStreak: 0,
        lastAttendanceDate: '',
        role: role
      }
    };
  } catch (err) {
    return { success: false, error: err.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Log in an existing user by phone number.
 * @param {Object} data - {phone: string}
 * @returns {Object} User object or error
 */
function login(data) {
  var phone = (data.phone || '').trim();

  if (!phone) {
    return { success: false, error: 'Phone number is required.' };
  }

  var row = findRowByPhone(phone);
  if (row === -1) {
    return { success: false, error: 'User not found. Please sign up first.' };
  }

  var sheet = getSheet('MEMBERS');
  var values = sheet.getRange(row, 1, 1, 8).getValues()[0];

  return {
    success: true,
    data: {
      id: String(values[0]),
      name: String(values[1]),
      phone: String(values[2]),
      joinDate: String(values[3]),
      totalAttendance: Number(values[4]),
      currentStreak: Number(values[5]),
      lastAttendanceDate: String(values[6]),
      role: String(values[7])
    }
  };
}

/**
 * Get a user's profile by their ID.
 * @param {string} userId - User ID
 * @returns {Object} User data or error
 */
function getProfile(userId) {
  if (!userId) {
    return { success: false, error: 'User ID is required.' };
  }

  var row = findRowById(userId);
  if (row === -1) {
    return { success: false, error: 'User not found.' };
  }

  var sheet = getSheet('MEMBERS');
  var values = sheet.getRange(row, 1, 1, 8).getValues()[0];

  return {
    success: true,
    data: {
      id: String(values[0]),
      name: String(values[1]),
      phone: String(values[2]),
      joinDate: String(values[3]),
      totalAttendance: Number(values[4]),
      currentStreak: Number(values[5]),
      lastAttendanceDate: String(values[6]),
      role: String(values[7])
    }
  };
}
