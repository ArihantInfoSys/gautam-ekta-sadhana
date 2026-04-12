/**
 * Code.gs - Main router for Gautam Ekta Sadhana web app
 *
 * Handles all incoming POST and GET requests and routes them
 * to the appropriate module functions.
 */

/**
 * Handle POST requests.
 * @param {Object} e - Event object from Apps Script
 * @returns {GoogleAppsScript.Content.TextOutput} JSON response
 */
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;

    switch (action) {
      case 'signup':
        return jsonResponse(signup(payload));

      case 'login':
        return jsonResponse(login(payload));

      case 'markAttendance':
        return jsonResponse(mark(payload));

      case 'updateSettings':
        return jsonResponse(updateSettings(payload));

      default:
        return jsonResponse({ success: false, error: 'Unknown action: ' + action });
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Server error: ' + err.message });
  }
}

/**
 * Handle GET requests.
 * @param {Object} e - Event object from Apps Script
 * @returns {GoogleAppsScript.Content.TextOutput} JSON response
 */
function doGet(e) {
  try {
    var action = e.parameter.action;

    switch (action) {
      case 'getLeaderboard':
        return jsonResponse(get(e.parameter.period, e.parameter.branch));

      case 'getUserProfile':
        return jsonResponse(getProfile(e.parameter.userId));

      case 'getAdminDashboard':
        return jsonResponse(getDashboard());

      case 'getDailyBhaav':
        return jsonResponse(getDailyBhaav());

      case 'getSettings':
        return jsonResponse(getSettings());

      case 'getTodayCount':
        return jsonResponse(getTodayCount());

      case 'getTodayAttendees':
        return jsonResponse(getTodayAttendees());

      case 'getLeaderboardByBranch':
        return jsonResponse(getByBranch(e.parameter.branch));

      case 'getBranchAttendanceReport':
        return jsonResponse(getBranchAttendanceReport(e.parameter.branch, e.parameter.period));

      default:
        return jsonResponse({ success: false, error: 'Unknown action: ' + action });
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Server error: ' + err.message });
  }
}
