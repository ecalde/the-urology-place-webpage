/*
 * Backend worksheets that staff should not
 * navigate or edit by hand.
 *
 * Board and Dashboard stay visible.
 * Apps Script continues to read/write these
 * tabs while they are hidden.
 */
const PATIENT_BACKEND_SHEETS = Object.freeze([
  "Leads",
  "ActivityLog",
  "Attachments",
  "Reactions",
  "Config",
  "Lists",
  "DashboardData",
  "DevLog",
  "WebsiteIngestLedger",
]);


/*
 * Prefix used to identify sheet protections
 * created by this CRM guardrail feature.
 */
const PATIENT_BACKEND_GUARD_DESCRIPTION_PREFIX =
  "PATIENT_CRM_BACKEND_GUARD:";


/*
 * Visible generated views that staff should not
 * edit by hand. These stay in the tab bar.
 */
const PATIENT_GENERATED_VIEW_SHEETS = Object.freeze([
  "Board",
  "Dashboard",
]);


const PATIENT_GENERATED_VIEW_GUARD_DESCRIPTION_PREFIX =
  "PATIENT_CRM_GENERATED_VIEW_GUARD:";


const PATIENT_LEADS_SYSTEM = Object.freeze({
  requiredSheets: [
    "Board",
    "Leads",
    "ActivityLog",
    "Attachments",
    "Reactions",
    "Config",
    "Lists",
    "DashboardData",
  ],

  /*
   * Staff work in these visible worksheets plus
   * Patient Details. Apps Script still reads and
   * writes the hidden backend tabs.
   */
  staffSheets: [
    "Board",
    "Dashboard",
  ],

  backendSheets: PATIENT_BACKEND_SHEETS,

  backendProtectionDescription:
    "Patient Leads backend — do not edit directly. Use Board, Dashboard, or Patient Details.",

  headers: {
    Leads: [
      "lead_id",
      "created_at",
      "intake_source",
      "first_name",
      "last_name",
      "phone",
      "email",
      "appointment_reason",
      "preferred_contact_method",
      "preferred_contact_time",
      "sms_consent",
      "message",
      "page_name",
      "source_path",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "status",
      "attempt_count",
      "first_attempt_at",
      "last_attempt_at",
      "last_contact_outcome",
      "reached_patient",
      "assigned_to",
      "next_follow_up_on",
      "scheduled_date",
      "scheduled_date_note",
      "schedule_date_missing",
      "workflow_complete",
      "completed_at",
      "completed_by",
      "lost_reason",
      "unrelated_type",
      "last_activity_at",
      "duplicate_flag",
      "created_by",
      "last_modified_at",
      "last_modified_by",
      "archived",
      "archived_at",
      "archived_by",
      "archived_from_status",
      "archive_reason",
    ],

    ActivityLog: [
      "activity_id",
      "lead_id",
      "recorded_at",
      "occurred_at",
      "activity_type",
      "actor_email",
      "actor_name",
      "activity_source",
      "field_name",
      "previous_value",
      "new_value",
      "from_status",
      "to_status",
      "attempt_number",
      "contact_method",
      "contact_outcome",
      "reached_patient",
      "scheduled_date",
      "note",
      "parent_activity_id",
      "system_generated",
      "edited_at",
      "edited_by",
    ],

    Attachments: [
      "attachment_id",
      "lead_id",
      "activity_id",
      "uploaded_at",
      "uploaded_by",
      "file_name",
      "drive_file_id",
      "file_url",
      "mime_type",
      "file_size_bytes",
      "description",
      "system_generated",
    ],

    Reactions: [
      "reaction_id",
      "lead_id",
      "activity_id",
      "emoji",
      "reacted_at",
      "reacted_by_email",
      "reacted_by_name",
      "is_active",
      "removed_at",
      "removed_by",
    ],
  },
});


const PATIENT_BOARD_LANES =
  Object.freeze([
    {
      key: "open",
      status:
        "Open Lead / Follow Up",
      title:
        "Open Lead / Follow Up",
    },

    {
      key: "scheduled",
      status:
        "Scheduled",
      title:
        "Scheduled",
    },

    {
      key: "caseLost",
      status:
        "Case Lost",
      title:
        "Case Lost",
    },

    {
      key: "unrelated",
      status:
        "Unrelated",
      title:
        "Unrelated",
    },
  ]);


const PATIENT_BOARD_LAYOUT =
  Object.freeze({
    applicationHeaderRow: 1,
    laneTitleRow: 2,
    laneCountRow: 3,
    summaryRow: 4,
    firstCardRow: 5,
    firstDynamicRow: 2,

    applicationHeaderRowHeight: 48,
    titleRowHeight: 36,
    countRowHeight: 26,
    summaryRowHeight: 28,
    cardRowHeight: 112,
    spacerRowHeight: 11,

    lastBoardColumn: 20,
    applicationHeaderLastColumn: 24,

    frozenRows: 3,

    gutterColumn: 1,          // A — logo / empty dark padding
    firstValuesColumn: 2,     // B — dynamic Board values origin

    laneStarts: [
      2,   // B
      7,   // G
      12,  // L
      17,  // Q
    ],

    laneColumnWidth: 60,

    spacerColumns: [
      6,   // F
      11,  // K
      16,  // P
    ],

    spacerColumnWidth: 14,

    canvasBackground: "#0F1115",
    fontFamily: "Roboto",
    canvasFontColor: "#F3F4F6",
    cardBorderColor: "#303640",

    actionRailFirstColumn: 21,
    actionRailColumnCount: 4,
    actionRailColumnWidth: 52,
  });


/**
 * Converts a Board physical row to a values-grid
 * index. Dynamic Board writes start at
 * firstDynamicRow, so grid[0] is physical row 2.
 */
function boardPhysicalRowToGridIndex_(physicalRow) {
  return physicalRow - PATIENT_BOARD_LAYOUT.firstDynamicRow;
}


/**
 * Converts an inclusive physical last row into the
 * getRange() row count for the dynamic Board area
 * that starts at firstDynamicRow.
 */
function boardDynamicRowCount_(lastPhysicalRow) {
  return (
    lastPhysicalRow -
    PATIENT_BOARD_LAYOUT.firstDynamicRow +
    1
  );
}


/**
 * First physical column that may receive dynamic
 * Board values. Column A is the logo gutter and
 * is never part of this grid.
 */
function boardFirstValuesColumn_() {
  return PATIENT_BOARD_LAYOUT.firstValuesColumn;
}


/**
 * Inclusive B:T width of the dynamic Board values
 * rectangle. Does not include gutter A or the
 * U:X action rail.
 */
function boardValuesColumnCount_() {
  return (
    PATIENT_BOARD_LAYOUT.lastBoardColumn -
    PATIENT_BOARD_LAYOUT.firstValuesColumn +
    1
  );
}


/**
 * Converts a Board physical column to a values-grid
 * index. Dynamic Board writes start at
 * firstValuesColumn, so grid[row][0] is column B.
 */
function boardPhysicalColumnToValuesIndex_(physicalColumn) {
  return physicalColumn - PATIENT_BOARD_LAYOUT.firstValuesColumn;
}


/**
 * Per-execution caches.
 *
 * Apps Script global state is reset at the start
 * of every invocation, so these never survive
 * across separate user actions.
 */
const EXECUTION_CACHE_ = {
  headerMaps: {},
  configRows: null,
  timezoneWithFallback: null,
  dashboardTimezone: null,
  spreadsheetTimezone: null,
  listValues: {},
  actionOptions: null,
  leadRowsById: {},
  leadSnapshots: {},
  derivedViewLockHeld: false,

  /*
   * Set only by DEV proofs. Production runs leave
   * this null, so UI recording is a no-op.
   */
  derivedViewUiEffects: null,

  /*
   * Pass 3: full canonical sheet tables are reused
   * within one execution so Board and Dashboard do
   * not independently re-read the same Leads or
   * ActivityLog values.
   */
  canonicalTables: {},

  /*
   * Pass 3: one Dashboard refresh context so KPI,
   * operational, trend, and business analytics share
   * the same in-memory snapshot instead of re-reading
   * DashboardData after each write.
   */
  dashboardRefreshContext: null,

  /*
   * Pass 3.5: Utilities.formatDate is expensive when
   * KPI, trend, and filter code convert the same
   * timestamps more than once in one execution.
   */
  dashboardDateKeyCache: {},
};


/*
 * Pass 2: derived Board/Dashboard rebuilds wait
 * on a script-level lock instead of abandoning.
 *
 * Secondary executions may wait because the
 * employee already received the mutation result.
 */
const DERIVED_VIEW_REFRESH_LOCK_WAIT_MS_ =
  240000;


/*
 * Pass 2.5: persistent dirty flags survive across
 * isolated Apps Script executions.
 *
 * Separate keys avoid lost-update races that a
 * single JSON blob would introduce when two
 * mutations set different views concurrently.
 */
const DERIVED_VIEW_DIRTY_BOARD_KEY_ =
  "PASS25_DIRTY_BOARD";

const DERIVED_VIEW_DIRTY_DASHBOARD_KEY_ =
  "PASS25_DIRTY_DASHBOARD";


/*
 * One installable trigger drains the dirty flags
 * above. The handler name is the only identity
 * used to install or remove that trigger.
 */
const DERIVED_VIEW_AUTO_REFRESH_HANDLER_ =
  "refreshDirtyDerivedViewsScheduled";


const DERIVED_VIEW_AUTO_REFRESH_MINUTES_ =
  1;


const LEAD_VIEW_INVALIDATION_ =
  Object.freeze({
    assignment:
      Object.freeze({
        board: true,
        dashboard: true,
        activity: true,
        attachments: false,
      }),

    contact:
      Object.freeze({
        board: true,
        dashboard: true,
        activity: true,
        attachments: false,
      }),

    workflow:
      Object.freeze({
        board: true,
        dashboard: true,
        activity: true,
        attachments: false,
      }),

    followUp:
      Object.freeze({
        board: true,
        dashboard: true,
        activity: true,
        attachments: false,
      }),

    completion:
      Object.freeze({
        board: true,
        dashboard: true,
        activity: true,
        attachments: false,
      }),

    archive:
      Object.freeze({
        board: true,
        dashboard: true,
        activity: true,
        attachments: false,
      }),

    conversation:
      Object.freeze({
        board: false,
        dashboard: false,
        activity: true,
        attachments: false,
      }),

    reaction:
      Object.freeze({
        board: false,
        dashboard: false,
        activity: false,
        attachments: false,
      }),

    attachment:
      Object.freeze({
        board: false,
        dashboard: false,
        activity: true,
        attachments: true,
      }),
  });


function startPerf_(label) {
  return {
    label: String(label || ""),
    startedAt: Date.now(),
  };
}


function endPerf_(token) {
  if (!token) {
    return;
  }

  console.log(
    `[PERF] ${token.label}: ${Date.now() - token.startedAt} ms`
  );
}


function withPerf_(label, fn) {
  const perf = startPerf_(label);

  try {
    return fn();
  } finally {
    endPerf_(perf);
  }
}


/**
 * Spreadsheet timezone, resolved once per execution.
 *
 * Board date labels use this timezone, matching the
 * pre-Pass-3 formatDateForBoard_() behavior.
 */
function getSpreadsheetTimezone_() {
  if (EXECUTION_CACHE_.spreadsheetTimezone) {
    return EXECUTION_CACHE_.spreadsheetTimezone;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const timezone =
    ss.getSpreadsheetTimeZone() ||
    "America/Chicago";

  EXECUTION_CACHE_.spreadsheetTimezone = timezone;

  return timezone;
}


/**
 * Pass 3: one full data-area read per canonical
 * worksheet per execution.
 *
 * Header maps remain the Pass 1 per-execution cache.
 * Data rows are cached separately so Board + Dashboard
 * can share Leads without changing public helpers.
 */
function getCanonicalSheetTable_(sheetName) {
  const cache = EXECUTION_CACHE_.canonicalTables;

  if (cache[sheetName]) {
    return cache[sheetName];
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    if (sheetName === "Leads") {
      throw new Error("Leads worksheet was not found.");
    }

    throw new Error(
      `${sheetName} worksheet was not found.`
    );
  }

  const headers = getHeaderMap_(sheetName);
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  let values = [];

  if (lastRow >= 2 && lastColumn >= 1) {
    values = sheet
      .getRange(2, 1, lastRow - 1, lastColumn)
      .getValues();
  }

  const table = {
    sheetName,
    sheet,
    headers,
    lastRow,
    lastColumn,
    values,
  };

  cache[sheetName] = table;

  return table;
}


function invalidateCanonicalSheetTable_(sheetName) {
  delete EXECUTION_CACHE_.canonicalTables[sheetName];
}


function columnNumberToA1_(column) {
  let n = Number(column) || 0;
  let letters = "";

  while (n > 0) {
    const remainder = (n - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    n = Math.floor((n - 1) / 26);
  }

  return letters;
}


function cellA1Notation_(row, column) {
  return columnNumberToA1_(column) + String(row);
}


function rangeA1Notation_(startRow, startColumn, endRow, endColumn) {
  return (
    cellA1Notation_(startRow, startColumn) +
    ":" +
    cellA1Notation_(endRow, endColumn)
  );
}


function applyRangeListChunks_(sheet, a1List, callback) {
  if (!sheet || !a1List || !a1List.length) {
    return;
  }

  const chunkSize = 100;

  for (let index = 0; index < a1List.length; index += chunkSize) {
    callback(
      sheet.getRangeList(
        a1List.slice(index, index + chunkSize)
      )
    );
  }
}


/**
 * Resolves the Config timezone once per execution.
 *
 * Missing/unreadable Config continues to fall back
 * to America/Chicago, matching the existing Patient
 * Detail / audit date formatters.
 */
function getConfiguredTimezoneWithFallback_() {
  if (EXECUTION_CACHE_.timezoneWithFallback) {
    return EXECUTION_CACHE_.timezoneWithFallback;
  }

  let timezone = "America/Chicago";

  try {
    timezone =
      getConfigValue_("timezone") ||
      timezone;
  } catch (error) {
    // Keep fallback timezone.
  }

  EXECUTION_CACHE_.timezoneWithFallback = timezone;

  return timezone;
}


/**
 * Batch-reads one Leads data row.
 *
 * Callers that need both raw values (dates,
 * booleans, numbers) and display text use this
 * instead of one getRange per field.
 */
function readLeadRowSnapshot_(sheet, row, headers) {
  const lastColumn = sheet.getLastColumn();

  const range = sheet.getRange(
    row,
    1,
    1,
    lastColumn
  );

  return {
    values: range.getValues()[0],
    display: range.getDisplayValues()[0],
    lastColumn,
    headers,
    row,
  };
}


function getLeadRowAccessors_(headers, values, display) {
  return {
    getValue: function (headerName) {
      return values[headers[headerName] - 1];
    },

    getDisplay: function (headerName) {
      const raw = display[headers[headerName] - 1];

      return String(
        raw == null ? "" : raw
      ).trim();
    },
  };
}


function rememberLeadRowSnapshot_(leadId, snapshot) {
  const cleanLeadId = String(leadId || "").trim();

  if (cleanLeadId) {
    EXECUTION_CACHE_.leadSnapshots[cleanLeadId] = snapshot;
  }
}


function invalidateLeadRowSnapshot_(leadId) {
  const cleanLeadId = String(leadId || "").trim();

  if (cleanLeadId) {
    delete EXECUTION_CACHE_.leadSnapshots[cleanLeadId];
  }

  invalidateCanonicalSheetTable_("Leads");
}


/**
 * Resolves a lead once per execution and
 * batch-reads its Leads row.
 *
 * Pass refreshSnapshot: true after a Leads
 * mutation so later readers do not reuse a
 * stale row image. Row numbers remain cached
 * only for this execution.
 */
function getLeadContextById_(leadId, options) {
  const settings = options || {};

  const cleanLeadId = String(leadId || "").trim();

  const row = getPatientDetailLeadRowOrThrow_(
    cleanLeadId
  );

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheet = ss.getSheetByName("Leads");

  if (!sheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  const headers = getHeaderMap_("Leads");

  let snapshot =
    EXECUTION_CACHE_.leadSnapshots[cleanLeadId];

  if (
    settings.refreshSnapshot ||
    !snapshot ||
    snapshot.row !== row
  ) {
    snapshot = readLeadRowSnapshot_(
      sheet,
      row,
      headers
    );

    rememberLeadRowSnapshot_(
      cleanLeadId,
      snapshot
    );
  }

  const accessors = getLeadRowAccessors_(
    headers,
    snapshot.values,
    snapshot.display
  );

  return {
    leadId: cleanLeadId,
    row,
    sheet,
    headers,
    values: snapshot.values,
    display: snapshot.display,
    getValue: accessors.getValue,
    getDisplay: accessors.getDisplay,
  };
}


function validateSystemFoundation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const errors = [];

  // Verify required worksheets exist.
  PATIENT_LEADS_SYSTEM.requiredSheets.forEach((sheetName) => {
    if (!ss.getSheetByName(sheetName)) {
      errors.push(`Missing worksheet: ${sheetName}`);
    }
  });

  // Verify canonical backend schemas.
  Object.entries(PATIENT_LEADS_SYSTEM.headers).forEach(
    ([sheetName, expectedHeaders]) => {
      const sheet = ss.getSheetByName(sheetName);

      if (!sheet) {
        return;
      }

      collectFoundationHeaderErrors_(
        sheetName,
        expectedHeaders,
        sheet
      ).forEach((message) => {
        errors.push(message);
      });
    }
  );

  // Verify basic Config structure.
  const configSheet = ss.getSheetByName("Config");

  if (configSheet) {
    if (configSheet.getRange("A1").getDisplayValue() !== "Setting") {
      errors.push('Config!A1 must contain "Setting".');
    }

    if (configSheet.getRange("B1").getDisplayValue() !== "Value") {
      errors.push('Config!B1 must contain "Value".');
    }
  }

  const ui = SpreadsheetApp.getUi();

  if (errors.length > 0) {
    ui.alert(
      "Foundation Check Failed",
      errors.join("\n"),
      ui.ButtonSet.OK
    );

    return false;
  }

  ui.alert(
    "Foundation Check Passed",
    "All required worksheets and canonical backend headers are present.",
    ui.ButtonSet.OK
  );

  return true;
}


function getConfigValue_(settingName) {
  if (!EXECUTION_CACHE_.configRows) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Config");

    if (!sheet) {
      throw new Error("Config worksheet was not found.");
    }

    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      throw new Error("Config worksheet contains no settings.");
    }

    const rows = sheet
      .getRange(2, 1, lastRow - 1, 2)
      .getDisplayValues();

    const map = {};

    for (const row of rows) {
      if (
        !Object.prototype.hasOwnProperty.call(
          map,
          row[0]
        )
      ) {
        map[row[0]] = row[1];
      }
    }

    EXECUTION_CACHE_.configRows = map;
  }

  if (
    !Object.prototype.hasOwnProperty.call(
      EXECUTION_CACHE_.configRows,
      settingName
    )
  ) {
    throw new Error(`Config setting not found: ${settingName}`);
  }

  return EXECUTION_CACHE_.configRows[settingName];
}


function generateSystemId_(prefix) {
  return `${prefix}-${Utilities.getUuid()}`;
}


function columnNumberToLetter_(columnNumber) {
  let result = "";
  let number = columnNumber;

  while (number > 0) {
    const remainder = (number - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    number = Math.floor((number - 1) / 26);
  }

  return result;
}

/**
 * PHASE 2B
 * Initializes a new lead that already has its intake/form fields entered.
 *
 * TEST USAGE:
 * 1. Enter fake lead information into an EMPTY row in Leads.
 * 2. Select any cell in that row.
 * 3. Run initializeSelectedLead().
 *
 * This function intentionally does NOT use an onEdit trigger.
 */
function initializeSelectedLead() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();

  if (sheet.getName() !== "Leads") {
    throw new Error(
      'initializeSelectedLead() must be run while a cell on the "Leads" worksheet is selected.'
    );
  }

  const row = sheet.getActiveRange().getRow();

  if (row < 2) {
    throw new Error("Select a lead data row, not the header row.");
  }

  initializeLeadRow_(row, {
    source: "Employee",
  });

  SpreadsheetApp.getUi().alert(
    "Lead Initialized",
    `Lead row ${row} was successfully initialized and its lead_created activity was recorded.`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}


/**
 * Returns the lead id stored on a newly initialized row.
 *
 * Omitting options.leadId preserves manual/staff initialization and
 * calls generateSystemId_("LEAD"). An explicit leadId is trimmed and
 * must match WEBSITE_INGEST_LEAD_ID_PATTERN_. A supplied value that
 * does not match is an internal invariant violation: throw, and do
 * not allocate a replacement id.
 */
function resolveInitializeLeadId_(options) {
  if (!options || options.leadId === undefined) {
    return generateSystemId_("LEAD");
  }

  const requestedLeadId = String(options.leadId).trim();

  if (!WEBSITE_INGEST_LEAD_ID_PATTERN_.test(requestedLeadId)) {
    throw new Error(
      "options.leadId is not a valid system lead id."
    );
  }

  return requestedLeadId;
}


/**
 * Initializes the system-managed fields for one lead.
 *
 * The intake fields such as name, phone, email, appointment reason,
 * etc. are expected to already exist in the row.
 *
 * options.leadId is optional. When it is omitted, a new lead id is
 * generated, which is what manual/staff initialization already does.
 * Website ingest passes the lead id reserved on the ledger first.
 * A supplied leadId that is not a canonical LEAD-UUID throws before
 * any lead_id cell is written.
 */
function initializeLeadRow_(row, options = {}) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Leads");

  if (!sheet) {
    throw new Error("Leads worksheet was not found.");
  }

  const headerMap = getHeaderMap_("Leads");
  const currentLeadId = sheet
    .getRange(row, headerMap.lead_id)
    .getDisplayValue()
    .trim();

  if (currentLeadId) {
    throw new Error(
      `Row ${row} already has lead_id "${currentLeadId}". Refusing to initialize the same lead twice.`
    );
  }

  assertLeadHasIntakeData_(sheet, row, headerMap);

  const leadId = resolveInitializeLeadId_(options);

  const now = new Date();
  const actor = getActorIdentity_();

  const source = options.source || "Employee";
  const defaultStatus = getConfigValue_("default_status");

  setCellByHeader_(sheet, row, headerMap, "lead_id", leadId);

  if (source === "Website") {
    // Durable before activity logging, so a crash here is PARTIAL_COMMIT
    // for this exact id rather than an invitation to allocate another.
    SpreadsheetApp.flush();
    maybeWebsiteIngestDevFail_("after_lead_id");
  }

  setCellByHeader_(sheet, row, headerMap, "created_at", now);

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "status",
    defaultStatus
  );

  setCellByHeader_(sheet, row, headerMap, "attempt_count", 0);

  // These Boolean fields begin false for a new open lead.
  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "schedule_date_missing",
    false
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "workflow_complete",
    false
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "duplicate_flag",
    false
  );

  /*
   * Blank archived cells already mean "not archived".
   * Write false only after setup has added the column
   * so existing workbooks keep ingesting before setup.
   */
  if (headerMap.archived) {
    setCellByHeader_(
      sheet,
      row,
      headerMap,
      "archived",
      false
    );
  }

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "last_activity_at",
    now
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "created_by",
    source === "Website"
      ? "Website"
      : actor.email || actor.name || "Employee"
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "last_modified_at",
    now
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "last_modified_by",
    source === "Website"
      ? "Website"
      : actor.email || actor.name || "Employee"
  );

  appendActivity_({
    leadId,
    occurredAt: now,
    activityType: "lead_created",

    actorEmail:
      source === "Website"
        ? ""
        : actor.email,

    actorName:
      source === "Website"
        ? "Website"
        : actor.name,

    activitySource: source,

    note:
      source === "Website"
        ? "Lead created from website."
        : "Lead initialized by employee.",

    systemGenerated: true,
  });

  return leadId;
}


/**
 * Appends one canonical ActivityLog record.
 */
function appendActivity_(activity) {
  const perf = startPerf_("appendActivity_");

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("ActivityLog");

    if (!sheet) {
      throw new Error("ActivityLog worksheet was not found.");
    }

    const headers = getHeaderMap_("ActivityLog");
    const row = findFirstEmptyDataRow_(sheet, headers.activity_id);

    const recordedAt = new Date();
    const activityId = generateSystemId_("ACT");

    const values = {
      activity_id: activityId,
      lead_id: activity.leadId || "",
      recorded_at: recordedAt,
      occurred_at: activity.occurredAt || recordedAt,
      activity_type: activity.activityType || "",
      actor_email: activity.actorEmail || "",
      actor_name: activity.actorName || "",
      activity_source: activity.activitySource || "",
      field_name: activity.fieldName || "",
      previous_value: activity.previousValue || "",
      new_value: activity.newValue || "",
      from_status: activity.fromStatus || "",
      to_status: activity.toStatus || "",
      attempt_number:
        activity.attemptNumber === undefined
          ? ""
          : activity.attemptNumber,
      contact_method: activity.contactMethod || "",
      contact_outcome: activity.contactOutcome || "",
      reached_patient:
        activity.reachedPatient === undefined
          ? false
          : Boolean(activity.reachedPatient),
      scheduled_date: activity.scheduledDate || "",
      note: activity.note || "",
      parent_activity_id: activity.parentActivityId || "",
      system_generated: Boolean(activity.systemGenerated),
      edited_at: "",
      edited_by: "",
    };

    const lastColumn = sheet.getLastColumn();
    const rowRange = sheet.getRange(row, 1, 1, lastColumn);
    const rowValues = rowRange.getValues()[0];

    Object.entries(values).forEach(([headerName, value]) => {
      const column = headers[headerName];

      if (!column) {
        throw new Error(
          `Required header "${headerName}" was not found on worksheet "${sheet.getName()}".`
        );
      }

      rowValues[column - 1] = value;
    });

    rowRange.setValues([rowValues]);

    invalidateCanonicalSheetTable_("ActivityLog");

    return activityId;
  } finally {
    endPerf_(perf);
  }
}


/**
 * Builds a header -> column-number map dynamically.
 *
 * This avoids hardcoding "column R", "column S", etc.
 */
function getHeaderMap_(sheetName) {
  if (EXECUTION_CACHE_.headerMaps[sheetName]) {
    return EXECUTION_CACHE_.headerMaps[sheetName];
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`Worksheet not found: ${sheetName}`);
  }

  const lastColumn = sheet.getLastColumn();

  const headers = sheet
    .getRange(1, 1, 1, lastColumn)
    .getDisplayValues()[0];

  const map = {};

  headers.forEach((header, index) => {
    const cleanHeader = String(header).trim();

    if (cleanHeader) {
      map[cleanHeader] = index + 1;
    }
  });

  EXECUTION_CACHE_.headerMaps[sheetName] = map;

  return map;
}


/**
 * Writes a value using its canonical header name.
 */
function setCellByHeader_(
  sheet,
  row,
  headerMap,
  headerName,
  value
) {
  const column = headerMap[headerName];

  if (!column) {
    throw new Error(
      `Required header "${headerName}" was not found on worksheet "${sheet.getName()}".`
    );
  }

  sheet.getRange(row, column).setValue(value);
}


/**
 * Finds the first row whose key/ID column is actually blank.
 *
 * A blank row can sit above a later record, so this scan does not
 * use getLastRow(). Older template rows may still store checkbox
 * FALSE. Offloaded rows are stored blank. A blank checkbox value
 * means false. Live records still store real booleans.
 */
function findFirstEmptyDataRow_(
  sheet,
  keyColumn,
  startingRow = 2
) {
  const maxRows = sheet.getMaxRows();

  const values = sheet
    .getRange(
      startingRow,
      keyColumn,
      maxRows - startingRow + 1,
      1
    )
    .getDisplayValues();

  for (let index = 0; index < values.length; index++) {
    if (!String(values[index][0]).trim()) {
      return startingRow + index;
    }
  }

  throw new Error(
    `No empty data row remains on worksheet "${sheet.getName()}". Table expansion automation has not been enabled yet.`
  );
}


/**
 * Prevents us from accidentally initializing a completely blank row.
 */
function assertLeadHasIntakeData_(
  sheet,
  row,
  headerMap
) {
  const intakeFields = [
    "first_name",
    "last_name",
    "phone",
    "email",
    "appointment_reason",
  ];

  const hasAnyIntakeData = intakeFields.some((header) => {
    const column = headerMap[header];

    return String(
      sheet.getRange(row, column).getDisplayValue()
    ).trim() !== "";
  });

  if (!hasAnyIntakeData) {
    throw new Error(
      `Row ${row} appears to be completely empty. Enter fake intake data before initializing the lead.`
    );
  }
}


/**
 * Attempts to identify the user performing the action.
 *
 * Google may restrict Session.getActiveUser().getEmail()
 * in some authorization contexts, so we provide fallbacks.
 */
function getActorIdentity_() {
  let email = "";

  try {
    email = Session.getActiveUser().getEmail() || "";
  } catch (error) {
    email = "";
  }

  if (!email) {
    try {
      email =
        Session.getEffectiveUser().getEmail() || "";
    } catch (error) {
      email = "";
    }
  }

  const name = email
    ? email.split("@")[0]
    : "Employee";

  return {
    email,
    name,
  };
}

/**
 * PHASE 2C
 * Records a contact attempt for the currently selected lead.
 *
 * Temporary testing interface.
 * The future Board UI will call recordContactAttempt_() directly.
 */
function recordContactAttemptForSelectedLead() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  if (sheet.getName() !== "Leads") {
    throw new Error(
      'Select a lead on the "Leads" worksheet before recording an attempt.'
    );
  }

  const row = sheet.getActiveRange().getRow();

  if (row < 2) {
    throw new Error("Select a lead data row, not the header row.");
  }

  const headerMap = getHeaderMap_("Leads");
  const leadId = sheet
    .getRange(row, headerMap.lead_id)
    .getDisplayValue()
    .trim();

  if (!leadId) {
    throw new Error(
      `Row ${row} does not have a lead_id. Initialize the lead first.`
    );
  }

  const listsSheet = ss.getSheetByName("Lists");

  if (!listsSheet) {
    throw new Error("Lists worksheet was not found.");
  }

  const allowedMethods = listsSheet
    .getRange("L2:L5")
    .getDisplayValues()
    .flat()
    .map(value => value.trim())
    .filter(Boolean);

  const allowedOutcomes = listsSheet
    .getRange("C2:C10")
    .getDisplayValues()
    .flat()
    .map(value => value.trim())
    .filter(Boolean);

  // Ask for actual contact method.
  const methodResponse = ui.prompt(
    "Record Contact Attempt",
    `Enter the contact method exactly as one of these:\n\n${allowedMethods.join(
      "\n"
    )}`,
    ui.ButtonSet.OK_CANCEL
  );

  if (methodResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const contactMethod = methodResponse.getResponseText().trim();

  if (!allowedMethods.includes(contactMethod)) {
    ui.alert(
      "Invalid Contact Method",
      `Enter exactly one of:\n${allowedMethods.join("\n")}`,
      ui.ButtonSet.OK
    );
    return;
  }

  // Ask for outcome.
  const outcomeResponse = ui.prompt(
    "Contact Outcome",
    `Enter the outcome exactly as one of these:\n\n${allowedOutcomes.join(
      "\n"
    )}`,
    ui.ButtonSet.OK_CANCEL
  );

  if (outcomeResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const contactOutcome = outcomeResponse
    .getResponseText()
    .trim();

  if (!allowedOutcomes.includes(contactOutcome)) {
    ui.alert(
      "Invalid Contact Outcome",
      `Enter exactly one of:\n${allowedOutcomes.join("\n")}`,
      ui.ButtonSet.OK
    );
    return;
  }

  // Explicitly ask whether actual patient contact occurred.
  const reachedResponse = ui.alert(
    "Was the Patient Reached?",
    "Did the employee actually make contact with the patient during this attempt?",
    ui.ButtonSet.YES_NO_CANCEL
  );

  if (reachedResponse === ui.Button.CANCEL) {
    return;
  }

  const reachedPatient =
    reachedResponse === ui.Button.YES;

  // Optional note.
  const noteResponse = ui.prompt(
    "Contact Attempt Note",
    "Enter an optional note about this attempt. Leave blank if no note is needed.",
    ui.ButtonSet.OK_CANCEL
  );

  if (noteResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const note = noteResponse.getResponseText().trim();

  const result = recordContactAttempt_(row, {
    contactMethod,
    contactOutcome,
    reachedPatient,
    note,
    occurredAt: new Date(),
  });

  ui.alert(
    "Contact Attempt Recorded",
    `Attempt #${result.attemptNumber} was recorded successfully.`,
    ui.ButtonSet.OK
  );
}


/**
 * Core reusable contact-attempt automation.
 *
 * The future Board interface will call this function instead
 * of asking employees to work directly in the Leads table.
 */
function assertOperationalLeadById_(leadId) {
  const cleanLeadId = String(leadId || "").trim();

  if (!cleanLeadId) {
    return;
  }

  const row = findLeadRowById_(cleanLeadId);

  if (!row) {
    return;
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Leads");
  const headers = getHeaderMap_("Leads");

  if (!sheet || !headers.archived) {
    return;
  }

  if (
    isSheetBooleanTrue_(
      sheet.getRange(row, headers.archived).getValue()
    )
  ) {
    throw new Error(
      "This lead is archived. Unarchive it before changing the workflow."
    );
  }
}


function recordContactAttempt_(row, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Leads");

  if (!sheet) {
    throw new Error("Leads worksheet was not found.");
  }

  const headers = getHeaderMap_("Leads");

  const leadId = sheet
    .getRange(row, headers.lead_id)
    .getDisplayValue()
    .trim();

  if (!leadId) {
    throw new Error(
      `Lead row ${row} does not contain a lead_id.`
    );
  }

  assertOperationalLeadById_(leadId);

  const actor = getActorIdentity_();

  const recordedNow = new Date();
  const occurredAt =
    data.occurredAt instanceof Date
      ? data.occurredAt
      : recordedNow;

  const attemptCountCell = sheet.getRange(
    row,
    headers.attempt_count
  );

  const existingAttemptCount =
    Number(attemptCountCell.getValue()) || 0;

  const newAttemptNumber =
    existingAttemptCount + 1;

  // Increment attempt counter.
  attemptCountCell.setValue(newAttemptNumber);

  // Preserve the timestamp of the FIRST attempt forever.
  const firstAttemptCell = sheet.getRange(
    row,
    headers.first_attempt_at
  );

  if (!firstAttemptCell.getValue()) {
    firstAttemptCell.setValue(occurredAt);
  }

  // Last attempt always updates.
  setCellByHeader_(
    sheet,
    row,
    headers,
    "last_attempt_at",
    occurredAt
  );

  // Store latest attempt result.
  setCellByHeader_(
    sheet,
    row,
    headers,
    "last_contact_outcome",
    data.contactOutcome
  );

  /*
   * Leads.reached_patient means:
   * "Has this patient ever been successfully reached?"
   *
   * Once TRUE, we do not turn it back to FALSE just because
   * a later attempt receives no answer.
   *
   * Individual attempts retain their own TRUE/FALSE state
   * inside ActivityLog.
   */
  if (data.reachedPatient === true) {
    setCellByHeader_(
      sheet,
      row,
      headers,
      "reached_patient",
      true
    );
  }

  setCellByHeader_(
    sheet,
    row,
    headers,
    "last_activity_at",
    occurredAt
  );

  setCellByHeader_(
    sheet,
    row,
    headers,
    "last_modified_at",
    recordedNow
  );

  setCellByHeader_(
    sheet,
    row,
    headers,
    "last_modified_by",
    actor.email || actor.name || "Employee"
  );

  const activityId = appendActivity_({
    leadId,
    occurredAt,
    activityType: "contact_attempt",
    actorEmail: actor.email,
    actorName: actor.name,
    activitySource: "Employee",
    attemptNumber: newAttemptNumber,
    contactMethod: data.contactMethod,
    contactOutcome: data.contactOutcome,
    reachedPatient: Boolean(data.reachedPatient),
    note: data.note || "",
    systemGenerated: false,
  });

  return {
    leadId,
    activityId,
    attemptNumber: newAttemptNumber,
  };
}

/**
 * PHASE 2D
 * Temporary testing interface for scheduling the selected lead.
 *
 * The future Board will call scheduleLead_() directly.
 */
function scheduleSelectedLead() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  if (sheet.getName() !== "Leads") {
    throw new Error(
      'Select a lead on the "Leads" worksheet before scheduling.'
    );
  }

  const row = sheet.getActiveRange().getRow();

  if (row < 2) {
    throw new Error("Select a lead data row, not the header row.");
  }

  const headers = getHeaderMap_("Leads");

  const leadId = sheet
    .getRange(row, headers.lead_id)
    .getDisplayValue()
    .trim();

  if (!leadId) {
    throw new Error(
      `Row ${row} has no lead_id. Initialize the lead first.`
    );
  }

  const dateResponse = ui.prompt(
    "Schedule Patient",
    "Enter the scheduled date as MM/DD/YYYY.\n\n" +
      "Leave it blank and click OK if you want to move the lead to Scheduled without entering the date yet.",
    ui.ButtonSet.OK_CANCEL
  );

  if (dateResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const dateText = dateResponse
    .getResponseText()
    .trim();

  let scheduledDate = null;

  if (dateText) {
    try {
      scheduledDate = parseUsDate_(dateText);
    } catch (error) {
      ui.alert(
        "Invalid Date",
        error.message,
        ui.ButtonSet.OK
      );
      return;
    }
  }

  const noteResponse = ui.prompt(
    "Scheduled Date Note",
    "Enter an optional note about the appointment date.\n\nLeave blank if no note is needed.",
    ui.ButtonSet.OK_CANCEL
  );

  if (noteResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const note = noteResponse
    .getResponseText()
    .trim();

  const result = scheduleLead_(row, {
    scheduledDate,
    note,
    occurredAt: new Date(),
  });

  if (result.scheduleDateMissing) {
    ui.alert(
      "Lead Moved to Scheduled",
      "The lead is now in Scheduled, but no scheduled date was entered. The missing-date warning has been activated.",
      ui.ButtonSet.OK
    );
  } else {
    ui.alert(
      "Patient Scheduled",
      `The lead was moved to Scheduled for ${formatDateForAudit_(
        result.scheduledDate
      )}.`,
      ui.ButtonSet.OK
    );
  }
}


/**
 * Reusable scheduling automation.
 *
 * Updates the canonical Leads record and writes the appropriate
 * ActivityLog events.
 */
function scheduleLead_(row, data = {}) {
  const perf = startPerf_("scheduleLead_");

  try {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Leads");

  if (!sheet) {
    throw new Error("Leads worksheet was not found.");
  }

  const headers = getHeaderMap_("Leads");

  const leadId = sheet
    .getRange(row, headers.lead_id)
    .getDisplayValue()
    .trim();

  if (!leadId) {
    throw new Error(
      `Lead row ${row} does not contain a lead_id.`
    );
  }

  assertOperationalLeadById_(leadId);

  const actor = getActorIdentity_();
  const recordedNow = new Date();

  const occurredAt =
    data.occurredAt instanceof Date
      ? data.occurredAt
      : recordedNow;

  const statusCell = sheet.getRange(
    row,
    headers.status
  );

  const previousStatus = statusCell
    .getDisplayValue()
    .trim();

  const scheduledDateCell = sheet.getRange(
    row,
    headers.scheduled_date
  );

  const existingScheduledDate =
    scheduledDateCell.getValue();

  const hadScheduledDate =
    existingScheduledDate instanceof Date &&
    !isNaN(existingScheduledDate.getTime());

  const hasNewScheduledDate =
    data.scheduledDate instanceof Date &&
    !isNaN(data.scheduledDate.getTime());

    /*
   * PHASE 2J-C:
   * A meaningful scheduling change reopens a
   * previously completed workflow.
   *
   * This covers:
   * - another status -> Scheduled
   * - missing date -> scheduled date
   * - rescheduling an existing appointment
   *
   * Entering the exact same date again does not
   * reopen the workflow.
   */
  const existingScheduledDateText =
    hadScheduledDate
      ? formatDateForAudit_(
          existingScheduledDate
        )
      : "";

  const incomingScheduledDateText =
    hasNewScheduledDate
      ? formatDateForAudit_(
          data.scheduledDate
        )
      : "";

  const scheduledDateWillChange =
    hasNewScheduledDate &&
    (
      !hadScheduledDate ||
      existingScheduledDateText !==
        incomingScheduledDateText
    );

  const statusWillChangeToScheduled =
    previousStatus !== "Scheduled";

  /*
   * PHASE 3C-C:
   * Once an active follow-up lead becomes Scheduled,
   * it should no longer remain in the future
   * follow-up queue.
   */
  if (statusWillChangeToScheduled) {
    clearFutureFollowUpForWorkflowMove_(
      sheet,
      row,
      headers,
      leadId,
      occurredAt,
      actor,
      "Future follow-up cleared because lead moved to Scheduled."
    );
  }

  if (
    statusWillChangeToScheduled ||
    scheduledDateWillChange
  ) {
    resetCompletionForStatusMove_(
      sheet,
      row,
      headers,
      leadId,
      occurredAt,
      actor,
      previousStatus,
      "Scheduled",
      data.note ||
        (
          statusWillChangeToScheduled
            ? "Lead moved to Scheduled."
            : "Scheduled appointment changed."
        )
    );
  }

  let finalScheduledDate =
    hadScheduledDate
      ? existingScheduledDate
      : null;

  /*
   * STEP 1:
   * Handle the scheduled date itself.
   */
  if (hasNewScheduledDate) {
    finalScheduledDate = data.scheduledDate;

    const previousDateText =
      hadScheduledDate
        ? formatDateForAudit_(
            existingScheduledDate
          )
        : "";

    const newDateText =
      formatDateForAudit_(
        data.scheduledDate
      );

    const dateChanged =
      !hadScheduledDate ||
      previousDateText !== newDateText;

    setCellByHeader_(
      sheet,
      row,
      headers,
      "scheduled_date",
      data.scheduledDate
    );

    setCellByHeader_(
      sheet,
      row,
      headers,
      "schedule_date_missing",
      false
    );

    if (data.note !== undefined) {
      setCellByHeader_(
        sheet,
        row,
        headers,
        "scheduled_date_note",
        data.note || ""
      );
    }

    if (dateChanged) {
      appendActivity_({
        leadId,
        occurredAt,
        activityType:
          hadScheduledDate
            ? "scheduled_date_changed"
            : "scheduled_date_set",

        actorEmail: actor.email,
        actorName: actor.name,
        activitySource: "Employee",

        fieldName: "scheduled_date",
        previousValue: previousDateText,
        newValue: newDateText,

        scheduledDate:
          data.scheduledDate,

        note: data.note || "",
        systemGenerated: false,
      });
    }
  } else {
    /*
     * If there is already a scheduled date, leaving the prompt
     * blank does NOT erase it.
     *
     * If there is no date, activate the missing-date warning.
     */
    setCellByHeader_(
      sheet,
      row,
      headers,
      "schedule_date_missing",
      !hadScheduledDate
    );

    if (data.note) {
      setCellByHeader_(
        sheet,
        row,
        headers,
        "scheduled_date_note",
        data.note
      );
    }
  }

  /*
   * STEP 2:
   * Move the lead into Scheduled if it is not already there.
   */
  if (previousStatus !== "Scheduled") {
    /*
     * PHASE 2J-C:
     * Clear workflow-specific classifications when
     * a lead moves into Scheduled.
     *
     * This prevents stale combinations such as:
     * status = Scheduled
     * lost_reason = No Longer Interested
     */
    const previousLostReason =
      sheet
        .getRange(
          row,
          headers.lost_reason
        )
        .getDisplayValue()
        .trim();

    if (previousLostReason) {
      setCellByHeader_(
        sheet,
        row,
        headers,
        "lost_reason",
        ""
      );

      appendActivity_({
        leadId,
        occurredAt,

        activityType:
          "field_changed",

        actorEmail:
          actor.email,

        actorName:
          actor.name,

        activitySource:
          "Employee",

        fieldName:
          "lost_reason",

        previousValue:
          previousLostReason,

        newValue:
          "",

        note:
          data.note ||
          "Case Lost classification cleared because lead moved to Scheduled.",

        systemGenerated:
          false,
      });
    }

    const previousUnrelatedType =
      sheet
        .getRange(
          row,
          headers.unrelated_type
        )
        .getDisplayValue()
        .trim();

    if (previousUnrelatedType) {
      setCellByHeader_(
        sheet,
        row,
        headers,
        "unrelated_type",
        ""
      );

      appendActivity_({
        leadId,
        occurredAt,

        activityType:
          "field_changed",

        actorEmail:
          actor.email,

        actorName:
          actor.name,

        activitySource:
          "Employee",

        fieldName:
          "unrelated_type",

        previousValue:
          previousUnrelatedType,

        newValue:
          "",

        note:
          data.note ||
          "Unrelated classification cleared because lead moved to Scheduled.",

        systemGenerated:
          false,
      });
    }
    setCellByHeader_(
      sheet,
      row,
      headers,
      "status",
      "Scheduled"
    );

    appendActivity_({
      leadId,
      occurredAt,
      activityType: "status_change",

      actorEmail: actor.email,
      actorName: actor.name,
      activitySource: "Employee",

      fieldName: "status",
      previousValue: previousStatus,
      newValue: "Scheduled",

      fromStatus: previousStatus,
      toStatus: "Scheduled",

      note:
        hasNewScheduledDate
          ? `Lead moved to Scheduled with appointment date ${formatDateForAudit_(
              data.scheduledDate
            )}.`
          : "Lead moved to Scheduled without an appointment date.",

      systemGenerated: false,
    });
  }

  /*
   * STEP 3:
   * Update master-record audit metadata.
   */
  setCellByHeader_(
    sheet,
    row,
    headers,
    "last_activity_at",
    occurredAt
  );

  setCellByHeader_(
    sheet,
    row,
    headers,
    "last_modified_at",
    recordedNow
  );

  setCellByHeader_(
    sheet,
    row,
    headers,
    "last_modified_by",
    actor.email || actor.name || "Employee"
  );

  const scheduleDateMissing =
    !finalScheduledDate;

  return {
    leadId,
    scheduledDate:
      finalScheduledDate,
    scheduleDateMissing,
  };
  } finally {
    endPerf_(perf);
  }
}


/**
 * Parses MM/DD/YYYY into a real Date object.
 *
 * Noon is used to avoid edge cases around DST/date boundaries
 * because this represents a DATE, not a precise timestamp.
 */
function parseUsDate_(text) {
  const value = String(text).trim();

  const match =
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(
      value
    );

  if (!match) {
    throw new Error(
      "Enter the date in MM/DD/YYYY format, for example 09/30/2026."
    );
  }

  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);

  const date = new Date(
    year,
    month - 1,
    day,
    12,
    0,
    0
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(
      `"${value}" is not a valid calendar date.`
    );
  }

  return date;
}


/**
 * Formats a date consistently for audit text.
 */
function formatDateForAudit_(date) {
  if (
    !(date instanceof Date) ||
    isNaN(date.getTime())
  ) {
    return "";
  }

  return Utilities.formatDate(
    date,
    getConfiguredTimezoneWithFallback_(),
    "MM/dd/yyyy"
  );
}

/**
 * PHASE 2E-A
 * Sets or changes the future follow-up date for the selected lead.
 */
function setFollowUpDateForSelectedLead() {
  const context = getSelectedInitializedLead_();
  const { sheet, row, headers, ui } = context;

  const currentStatus = sheet
    .getRange(row, headers.status)
    .getDisplayValue()
    .trim();

  if (currentStatus !== "Open Lead / Follow Up") {
    ui.alert(
      "Follow-Up Date Not Available",
      'Future follow-up dates should currently be set only for leads in "Open Lead / Follow Up".',
      ui.ButtonSet.OK
    );
    return;
  }

  const dateResponse = ui.prompt(
    "Set Future Follow-Up",
    "Enter the future follow-up date as MM/DD/YYYY.",
    ui.ButtonSet.OK_CANCEL
  );

  if (dateResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const dateText = dateResponse.getResponseText().trim();

  if (!dateText) {
    ui.alert(
      "Date Required",
      "Enter a follow-up date. Use the separate clear function if you want to remove an existing follow-up date.",
      ui.ButtonSet.OK
    );
    return;
  }

  let followUpDate;

  try {
    followUpDate = parseUsDate_(dateText);
  } catch (error) {
    ui.alert(
      "Invalid Date",
      error.message,
      ui.ButtonSet.OK
    );
    return;
  }

  const noteResponse = ui.prompt(
    "Follow-Up Note",
    "Enter an optional note explaining why or when the patient should be contacted again.",
    ui.ButtonSet.OK_CANCEL
  );

  if (noteResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const note = noteResponse.getResponseText().trim();

  const result = setFollowUpDate_(row, {
    followUpDate,
    note,
    occurredAt: new Date(),
  });

  if (!result.changed) {
    ui.alert(
      "No Change",
      `The follow-up date is already ${formatDateForAudit_(
        result.followUpDate
      )}.`,
      ui.ButtonSet.OK
    );

    return;
  }

  ui.alert(
    "Follow-Up Date Saved",
    `Future follow-up is now set for ${formatDateForAudit_(
      result.followUpDate
    )}.`,
    ui.ButtonSet.OK
  );
}


/**
 * Clears the future follow-up date for the selected lead.
 */
function clearFollowUpDateForSelectedLead() {
  const context = getSelectedInitializedLead_();
  const { sheet, row, headers, ui } = context;

  const currentStatus = sheet
    .getRange(row, headers.status)
    .getDisplayValue()
    .trim();

  if (currentStatus !== "Open Lead / Follow Up") {
    ui.alert(
      "Follow-Up Date Not Available",
      'Future follow-up dates should currently be managed only for leads in "Open Lead / Follow Up".',
      ui.ButtonSet.OK
    );

    return;
  }

  const followUpCell = sheet.getRange(
    row,
    headers.next_follow_up_on
  );

  const existingDate = followUpCell.getValue();

  if (
    !(existingDate instanceof Date) ||
    isNaN(existingDate.getTime())
  ) {
    ui.alert(
      "No Follow-Up Date",
      "This lead does not currently have a future follow-up date.",
      ui.ButtonSet.OK
    );

    return;
  }

  const noteResponse = ui.prompt(
    "Clear Future Follow-Up",
    "Enter an optional note explaining why the follow-up date is being removed.",
    ui.ButtonSet.OK_CANCEL
  );

  if (noteResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const result = clearFollowUpDate_(row, {
    note: noteResponse.getResponseText().trim(),
    occurredAt: new Date(),
  });

  ui.alert(
    "Follow-Up Date Cleared",
    `The previous follow-up date of ${result.previousDate} was removed.`,
    ui.ButtonSet.OK
  );
}


/**
 * Reusable function for setting/changing next_follow_up_on.
 */
function setFollowUpDate_(row, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Leads");

  const headers = getHeaderMap_("Leads");

  const leadId = sheet
    .getRange(row, headers.lead_id)
    .getDisplayValue()
    .trim();

  if (!leadId) {
    throw new Error(
      `Lead row ${row} does not contain a lead_id.`
    );
  }

  assertOperationalLeadById_(leadId);

  if (
    !(data.followUpDate instanceof Date) ||
    isNaN(data.followUpDate.getTime())
  ) {
    throw new Error(
      "A valid follow-up Date object is required."
    );
  }

  const actor = getActorIdentity_();
  const recordedNow = new Date();

  const occurredAt =
    data.occurredAt instanceof Date
      ? data.occurredAt
      : recordedNow;

  const followUpCell = sheet.getRange(
    row,
    headers.next_follow_up_on
  );

  const existingDate = followUpCell.getValue();

  const hadExistingDate =
    existingDate instanceof Date &&
    !isNaN(existingDate.getTime());

  const previousDateText =
    hadExistingDate
      ? formatDateForAudit_(existingDate)
      : "";

  const newDateText =
    formatDateForAudit_(data.followUpDate);

  if (
    hadExistingDate &&
    previousDateText === newDateText
  ) {
    return {
      leadId,
      followUpDate: existingDate,
      changed: false,
    };
  }

  followUpCell.setValue(data.followUpDate);

  // A lead with a future follow-up remains active.
  setCellByHeader_(
    sheet,
    row,
    headers,
    "workflow_complete",
    false
  );

  setCellByHeader_(
    sheet,
    row,
    headers,
    "schedule_date_missing",
    false
  );

  appendActivity_({
    leadId,
    occurredAt,

    activityType:
      hadExistingDate
        ? "follow_up_date_changed"
        : "follow_up_date_set",

    actorEmail: actor.email,
    actorName: actor.name,
    activitySource: "Employee",

    fieldName: "next_follow_up_on",
    previousValue: previousDateText,
    newValue: newDateText,

    note: data.note || "",

    systemGenerated: false,
  });

  updateLeadAuditMetadata_(
    sheet,
    row,
    headers,
    occurredAt,
    recordedNow,
    actor
  );

  return {
    leadId,
    followUpDate: data.followUpDate,
    changed: true,
  };
}


/**
 * Reusable function for clearing next_follow_up_on.
 */
function clearFollowUpDate_(row, data = {}) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Leads");

  const headers = getHeaderMap_("Leads");

  const leadId = sheet
    .getRange(row, headers.lead_id)
    .getDisplayValue()
    .trim();

  if (!leadId) {
    throw new Error(
      `Lead row ${row} does not contain a lead_id.`
    );
  }

  assertOperationalLeadById_(leadId);

  const followUpCell = sheet.getRange(
    row,
    headers.next_follow_up_on
  );

  const existingDate = followUpCell.getValue();

  if (
    !(existingDate instanceof Date) ||
    isNaN(existingDate.getTime())
  ) {
    throw new Error(
      "This lead does not currently have a valid follow-up date."
    );
  }

  const previousDateText =
    formatDateForAudit_(existingDate);

  const actor = getActorIdentity_();
  const recordedNow = new Date();

  const occurredAt =
    data.occurredAt instanceof Date
      ? data.occurredAt
      : recordedNow;

  followUpCell.clearContent();

  appendActivity_({
    leadId,
    occurredAt,
    activityType: "follow_up_date_cleared",

    actorEmail: actor.email,
    actorName: actor.name,
    activitySource: "Employee",

    fieldName: "next_follow_up_on",
    previousValue: previousDateText,
    newValue: "",

    note: data.note || "",

    systemGenerated: false,
  });

  updateLeadAuditMetadata_(
    sheet,
    row,
    headers,
    occurredAt,
    recordedNow,
    actor
  );

  return {
    leadId,
    previousDate: previousDateText,
  };
}


/**
 * Returns information about the selected initialized lead.
 *
 * We'll reuse this helper in later workflow phases.
 */
function getSelectedInitializedLead_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  if (sheet.getName() !== "Leads") {
    throw new Error(
      'Select a lead on the "Leads" worksheet first.'
    );
  }

  const row = sheet.getActiveRange().getRow();

  if (row < 2) {
    throw new Error(
      "Select a lead data row, not the header."
    );
  }

  const headers = getHeaderMap_("Leads");

  const leadId = sheet
    .getRange(row, headers.lead_id)
    .getDisplayValue()
    .trim();

  if (!leadId) {
    throw new Error(
      `Row ${row} has no lead_id. Initialize the lead first.`
    );
  }

  return {
    ss,
    sheet,
    row,
    headers,
    leadId,
    ui,
  };
}


/**
 * Updates the common audit metadata on a lead.
 */
function updateLeadAuditMetadata_(
  sheet,
  row,
  headers,
  occurredAt,
  recordedAt,
  actor
) {
  setCellByHeader_(
    sheet,
    row,
    headers,
    "last_activity_at",
    occurredAt
  );

  setCellByHeader_(
    sheet,
    row,
    headers,
    "last_modified_at",
    recordedAt
  );

  setCellByHeader_(
    sheet,
    row,
    headers,
    "last_modified_by",
    actor.email || actor.name || "Employee"
  );
}

/**
 * PHASE 2E-B
 * Moves the currently selected lead to Case Lost.
 */
function moveSelectedLeadToCaseLost() {
  const context = getSelectedInitializedLead_();
  const { ss, row, ui } = context;

  const reasons = getListValues_(
    ss.getSheetByName("Lists"),
    "G2:G9"
  );

  const reasonResponse = ui.prompt(
    "Move Lead to Case Lost",
    "Enter the Case Lost reason exactly as one of these:\n\n" +
      reasons.join("\n"),
    ui.ButtonSet.OK_CANCEL
  );

  if (
    reasonResponse.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const reason =
    reasonResponse.getResponseText().trim();

  if (!reasons.includes(reason)) {
    ui.alert(
      "Invalid Case Lost Reason",
      "Enter exactly one of:\n\n" +
        reasons.join("\n"),
      ui.ButtonSet.OK
    );

    return;
  }

  const noteResponse = ui.prompt(
    "Case Lost Note",
    "Enter an optional note explaining what happened.\n\n" +
      "For example: patient confirmed they are no longer interested, " +
      "chose another provider, or could not be reached.",
    ui.ButtonSet.OK_CANCEL
  );

  if (
    noteResponse.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const result = moveLeadToCaseLost_(row, {
    reason,
    note: noteResponse.getResponseText().trim(),
    occurredAt: new Date(),
  });

  ui.alert(
    "Lead Moved to Case Lost",
    `The lead is now in Case Lost.\nReason: ${result.reason}`,
    ui.ButtonSet.OK
  );
}


/**
 * Moves the currently selected lead to Unrelated.
 */
function moveSelectedLeadToUnrelated() {
  const context = getSelectedInitializedLead_();
  const { ss, row, ui } = context;

  const types = getListValues_(
    ss.getSheetByName("Lists"),
    "H2:H8"
  );

  const typeResponse = ui.prompt(
    "Move Lead to Unrelated",
    "Enter the Unrelated type exactly as one of these:\n\n" +
      types.join("\n"),
    ui.ButtonSet.OK_CANCEL
  );

  if (
    typeResponse.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const unrelatedType =
    typeResponse.getResponseText().trim();

  if (!types.includes(unrelatedType)) {
    ui.alert(
      "Invalid Unrelated Type",
      "Enter exactly one of:\n\n" +
        types.join("\n"),
      ui.ButtonSet.OK
    );

    return;
  }

  const noteResponse = ui.prompt(
    "Unrelated Note",
    "Enter an optional note explaining why this lead belongs in Unrelated.",
    ui.ButtonSet.OK_CANCEL
  );

  if (
    noteResponse.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const result = moveLeadToUnrelated_(row, {
    unrelatedType,
    note: noteResponse.getResponseText().trim(),
    occurredAt: new Date(),
  });

  ui.alert(
    "Lead Moved to Unrelated",
    `The lead is now in Unrelated.\nType: ${result.unrelatedType}`,
    ui.ButtonSet.OK
  );
}


/**
 * Core Case Lost automation.
 */
function moveLeadToCaseLost_(row, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Leads");

  if (!sheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  const headers = getHeaderMap_("Leads");

  const leadId = sheet
    .getRange(row, headers.lead_id)
    .getDisplayValue()
    .trim();

  if (!leadId) {
    throw new Error(
      `Lead row ${row} does not contain a lead_id.`
    );
  }

  assertOperationalLeadById_(leadId);

  const actor = getActorIdentity_();
  const recordedNow = new Date();

  const occurredAt =
    data.occurredAt instanceof Date
      ? data.occurredAt
      : recordedNow;

  const previousStatus = sheet
    .getRange(row, headers.status)
    .getDisplayValue()
    .trim();

  const previousReason = sheet
    .getRange(row, headers.lost_reason)
    .getDisplayValue()
    .trim();

  const scheduledDateWasCleared =
  clearScheduledDateForWorkflowMove_(
    sheet,
    row,
    headers,
    leadId,
    occurredAt,
    actor,
    "Scheduled date cleared because lead moved to Case Lost."
  );
  /*
   * A Case Lost lead should no longer sit in the
   * future follow-up queue.
   */
  const followUpWasCleared =
  clearFutureFollowUpForWorkflowMove_(
    sheet,
    row,
    headers,
    leadId,
    occurredAt,
    actor,
    "Lead moved to Case Lost."
  );

  /*
   * PHASE 2J-C:
   * Reset completion if the workflow classification
   * meaningfully changes.
   */
  const statusWillChangeToCaseLost =
    previousStatus !== "Case Lost";

  const lostReasonWillChange =
    previousReason !== data.reason;

  if (
    statusWillChangeToCaseLost ||
    lostReasonWillChange ||
    followUpWasCleared ||
    scheduledDateWasCleared
  ) {
    resetCompletionForStatusMove_(
      sheet,
      row,
      headers,
      leadId,
      occurredAt,
      actor,
      previousStatus,
      "Case Lost",
      data.note ||
        "Lead moved to Case Lost."
    );
  }

  /*
   * Store the current Case Lost reason.
   */
  setCellByHeader_(
    sheet,
    row,
    headers,
    "lost_reason",
    data.reason
  );

  /*
   * Case Lost and Unrelated are mutually exclusive
   * current classifications.
   */
  const previousUnrelatedType = sheet
  .getRange(
    row,
    headers.unrelated_type
  )
  .getDisplayValue()
  .trim();

  if (previousUnrelatedType) {
    setCellByHeader_(
      sheet,
      row,
      headers,
      "unrelated_type",
      ""
    );

    appendActivity_({
      leadId,
      occurredAt,
      activityType: "field_changed",

      actorEmail: actor.email,
      actorName: actor.name,
      activitySource: "Employee",

      fieldName: "unrelated_type",
      previousValue: previousUnrelatedType,
      newValue: "",

      note:
        data.note ||
        "Unrelated classification cleared because lead moved to Case Lost.",

      systemGenerated: false,
    });
  }

  /*
   * Missing scheduled date matters only while
   * the lead is in Scheduled.
   */
  setCellByHeader_(
    sheet,
    row,
    headers,
    "schedule_date_missing",
    false
  );

  /*
   * Record reason change if necessary.
   */
  if (previousReason !== data.reason) {
    appendActivity_({
      leadId,
      occurredAt,
      activityType: "field_changed",

      actorEmail: actor.email,
      actorName: actor.name,
      activitySource: "Employee",

      fieldName: "lost_reason",
      previousValue: previousReason,
      newValue: data.reason,

      note: data.note || "",

      systemGenerated: false,
    });
  }

  /*
   * Move status only if it is not already Case Lost.
   */
  if (previousStatus !== "Case Lost") {
    setCellByHeader_(
      sheet,
      row,
      headers,
      "status",
      "Case Lost"
    );

    appendActivity_({
      leadId,
      occurredAt,
      activityType: "status_change",

      actorEmail: actor.email,
      actorName: actor.name,
      activitySource: "Employee",

      fieldName: "status",
      previousValue: previousStatus,
      newValue: "Case Lost",

      fromStatus: previousStatus,
      toStatus: "Case Lost",

      note: data.note || "",

      systemGenerated: false,
    });
  }

  updateLeadAuditMetadata_(
    sheet,
    row,
    headers,
    occurredAt,
    recordedNow,
    actor
  );

  return {
    leadId,
    reason: data.reason,
  };
}


/**
 * Core Unrelated automation.
 */
function moveLeadToUnrelated_(row, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Leads");

  if (!sheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  const headers = getHeaderMap_("Leads");

  const leadId = sheet
    .getRange(row, headers.lead_id)
    .getDisplayValue()
    .trim();

  if (!leadId) {
    throw new Error(
      `Lead row ${row} does not contain a lead_id.`
    );
  }

  assertOperationalLeadById_(leadId);

  const actor = getActorIdentity_();
  const recordedNow = new Date();

  const occurredAt =
    data.occurredAt instanceof Date
      ? data.occurredAt
      : recordedNow;

  const previousStatus = sheet
    .getRange(row, headers.status)
    .getDisplayValue()
    .trim();

  const previousType = sheet
    .getRange(row, headers.unrelated_type)
    .getDisplayValue()
    .trim();

  const scheduledDateWasCleared =
  clearScheduledDateForWorkflowMove_(
    sheet,
    row,
    headers,
    leadId,
    occurredAt,
    actor,
    "Scheduled date cleared because lead moved to Unrelated."
  );

  const followUpWasCleared =
  clearFutureFollowUpForWorkflowMove_(
    sheet,
    row,
    headers,
    leadId,
    occurredAt,
    actor,
    "Lead moved to Unrelated."
  );

  /*
   * PHASE 2J-C:
   * Reset completion if the workflow classification
   * meaningfully changes.
   */
  const statusWillChangeToUnrelated =
    previousStatus !== "Unrelated";

  const unrelatedTypeWillChange =
    previousType !== data.unrelatedType;

  if (
    statusWillChangeToUnrelated ||
    unrelatedTypeWillChange ||
    followUpWasCleared ||
    scheduledDateWasCleared
  ) {
    resetCompletionForStatusMove_(
      sheet,
      row,
      headers,
      leadId,
      occurredAt,
      actor,
      previousStatus,
      "Unrelated",
      data.note ||
        "Lead moved to Unrelated."
    );
  }

  setCellByHeader_(
    sheet,
    row,
    headers,
    "unrelated_type",
    data.unrelatedType
  );

  /*
   * Clear Case Lost classification because the
   * current classification is now Unrelated.
   */
  const previousLostReason = sheet
  .getRange(
    row,
    headers.lost_reason
  )
  .getDisplayValue()
  .trim();

  if (previousLostReason) {
    setCellByHeader_(
      sheet,
      row,
      headers,
      "lost_reason",
      ""
    );

    appendActivity_({
      leadId,
      occurredAt,
      activityType: "field_changed",

      actorEmail: actor.email,
      actorName: actor.name,
      activitySource: "Employee",

      fieldName: "lost_reason",
      previousValue: previousLostReason,
      newValue: "",

      note:
        data.note ||
        "Case Lost classification cleared because lead moved to Unrelated.",

      systemGenerated: false,
    });
  }

  setCellByHeader_(
    sheet,
    row,
    headers,
    "schedule_date_missing",
    false
  );

  if (previousType !== data.unrelatedType) {
    appendActivity_({
      leadId,
      occurredAt,
      activityType: "field_changed",

      actorEmail: actor.email,
      actorName: actor.name,
      activitySource: "Employee",

      fieldName: "unrelated_type",
      previousValue: previousType,
      newValue: data.unrelatedType,

      note: data.note || "",

      systemGenerated: false,
    });
  }

  if (previousStatus !== "Unrelated") {
    setCellByHeader_(
      sheet,
      row,
      headers,
      "status",
      "Unrelated"
    );

    appendActivity_({
      leadId,
      occurredAt,
      activityType: "status_change",

      actorEmail: actor.email,
      actorName: actor.name,
      activitySource: "Employee",

      fieldName: "status",
      previousValue: previousStatus,
      newValue: "Unrelated",

      fromStatus: previousStatus,
      toStatus: "Unrelated",

      note: data.note || "",

      systemGenerated: false,
    });
  }

  updateLeadAuditMetadata_(
    sheet,
    row,
    headers,
    occurredAt,
    recordedNow,
    actor
  );

  return {
    leadId,
    unrelatedType: data.unrelatedType,
  };
}


/**
 * Clears next_follow_up_on when a lead leaves the
 * active follow-up workflow.
 *
 * If no follow-up exists, this does nothing.
 */
function clearFutureFollowUpForWorkflowMove_(
  sheet,
  row,
  headers,
  leadId,
  occurredAt,
  actor,
  reason
) {
  const followUpCell = sheet.getRange(
    row,
    headers.next_follow_up_on
  );

  const existingDate =
    followUpCell.getValue();

  const hasFollowUp =
    existingDate instanceof Date &&
    !isNaN(existingDate.getTime());

  if (!hasFollowUp) {
    return false;
  }

  const previousDate =
    formatDateForAudit_(existingDate);

  followUpCell.clearContent();

  appendActivity_({
    leadId,
    occurredAt,

    activityType:
      "follow_up_date_cleared",

    actorEmail: actor.email,
    actorName: actor.name,
    activitySource: "Employee",

    fieldName:
      "next_follow_up_on",

    previousValue:
      previousDate,

    newValue: "",

    note:
      reason ||
      "Future follow-up cleared because workflow status changed.",

    systemGenerated: false,
  });

  return true;
}

/**
 * Clears the CURRENT scheduled date when a lead leaves
 * the Scheduled workflow.
 *
 * Historical scheduling remains preserved in ActivityLog.
 *
 * Returns true if a scheduled date was cleared.
 * Returns false if no scheduled date existed.
 */
function clearScheduledDateForWorkflowMove_(
  sheet,
  row,
  headers,
  leadId,
  occurredAt,
  actor,
  reason
) {
  const scheduledDateCell =
    sheet.getRange(
      row,
      headers.scheduled_date
    );

  const existingDate =
    scheduledDateCell.getValue();

  const hasScheduledDate =
    existingDate instanceof Date &&
    !isNaN(existingDate.getTime());

  if (!hasScheduledDate) {
    /*
     * Even if no actual date exists, clear any stale
     * scheduled-date note and missing-date warning.
     */
    sheet
      .getRange(
        row,
        headers.scheduled_date_note
      )
      .clearContent();

    setCellByHeader_(
      sheet,
      row,
      headers,
      "schedule_date_missing",
      false
    );

    return false;
  }

  const previousDateText =
    formatDateForAudit_(
      existingDate
    );

  /*
   * Remove CURRENT scheduling information.
   */
  scheduledDateCell.clearContent();

  sheet
    .getRange(
      row,
      headers.scheduled_date_note
    )
    .clearContent();

  setCellByHeader_(
    sheet,
    row,
    headers,
    "schedule_date_missing",
    false
  );

  /*
   * Preserve the historical date in ActivityLog.
   */
  appendActivity_({
    leadId,
    occurredAt,

    activityType:
      "scheduled_date_cleared",

    actorEmail:
      actor.email,

    actorName:
      actor.name,

    activitySource:
      "Employee",

    fieldName:
      "scheduled_date",

    previousValue:
      previousDateText,

    newValue:
      "",

    note:
      reason ||
      "Scheduled date cleared because workflow status changed.",

    systemGenerated:
      false,
  });

  return true;
}

/**
 * Reads non-empty controlled values from a Lists range.
 */
function getListValues_(
  sheet,
  rangeA1
) {
  if (!sheet) {
    throw new Error(
      "Lists worksheet was not found."
    );
  }

  const cacheKey =
    sheet.getName() + "::" + String(rangeA1 || "");

  if (EXECUTION_CACHE_.listValues[cacheKey]) {
    return EXECUTION_CACHE_.listValues[cacheKey].slice();
  }

  const values = sheet
    .getRange(rangeA1)
    .getDisplayValues()
    .flat()
    .map(value =>
      String(value).trim()
    )
    .filter(Boolean);

  EXECUTION_CACHE_.listValues[cacheKey] = values;

  return values.slice();
}

/**
 * PHASE 2F
 * Marks the currently selected workflow item complete.
 *
 * Completion does NOT change its workflow status.
 */
function markSelectedLeadComplete() {
  const context = getSelectedInitializedLead_();
  const {
    sheet,
    row,
    headers,
    ui,
  } = context;

  const status = sheet
    .getRange(row, headers.status)
    .getDisplayValue()
    .trim();

  const alreadyComplete = Boolean(
    sheet
      .getRange(row, headers.workflow_complete)
      .getValue()
  );

  if (alreadyComplete) {
    ui.alert(
      "Already Complete",
      "This lead is already marked complete.",
      ui.ButtonSet.OK
    );
    return;
  }

  const allowedStatuses = [
    "Scheduled",
    "Case Lost",
    "Unrelated",
  ];

  if (!allowedStatuses.includes(status)) {
    ui.alert(
      "Cannot Mark Complete",
      'Only leads in "Scheduled", "Case Lost", or "Unrelated" can currently be marked complete.',
      ui.ButtonSet.OK
    );
    return;
  }

  /*
   * Scheduled should not be considered complete while
   * its actual appointment date is still missing.
   */
  if (status === "Scheduled") {
    const scheduledDate = sheet
      .getRange(row, headers.scheduled_date)
      .getValue();

    const validScheduledDate =
      scheduledDate instanceof Date &&
      !isNaN(scheduledDate.getTime());

    if (!validScheduledDate) {
      ui.alert(
        "Scheduled Date Required",
        "This lead is in Scheduled but does not have a scheduled date yet. Enter the appointment date before marking it complete.",
        ui.ButtonSet.OK
      );

      return;
    }
  }

  /*
   * Case Lost requires a classification reason.
   */
  if (status === "Case Lost") {
    const lostReason = sheet
      .getRange(row, headers.lost_reason)
      .getDisplayValue()
      .trim();

    if (!lostReason) {
      ui.alert(
        "Case Lost Reason Required",
        "Choose a Case Lost reason before marking this lead complete.",
        ui.ButtonSet.OK
      );

      return;
    }
  }

  /*
   * Unrelated requires an unrelated classification.
   */
  if (status === "Unrelated") {
    const unrelatedType = sheet
      .getRange(row, headers.unrelated_type)
      .getDisplayValue()
      .trim();

    if (!unrelatedType) {
      ui.alert(
        "Unrelated Type Required",
        "Choose an Unrelated type before marking this lead complete.",
        ui.ButtonSet.OK
      );

      return;
    }
  }

  let promptText =
    "Enter an optional completion note.";

  if (status === "Case Lost") {
    promptText =
      "Enter a note explaining why this case is being marked complete. A note is required for Case Lost.";
  } else if (status === "Scheduled") {
    promptText =
      "Enter an optional completion note about the scheduling workflow.";
  } else if (status === "Unrelated") {
    promptText =
      "Enter an optional note explaining how this unrelated request was handled.";
  }

  const noteResponse = ui.prompt(
    "Mark Lead Complete",
    promptText,
    ui.ButtonSet.OK_CANCEL
  );

  if (
    noteResponse.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const note =
    noteResponse.getResponseText().trim();

  if (
    status === "Case Lost" &&
    !note
  ) {
    ui.alert(
      "Completion Note Required",
      "Please enter a note explaining why the Case Lost lead is being marked complete.",
      ui.ButtonSet.OK
    );

    return;
  }

  const result = markLeadComplete_(row, {
    note,
    occurredAt: new Date(),
  });

  ui.alert(
    "Workflow Complete",
    `${result.status} lead marked complete successfully.`,
    ui.ButtonSet.OK
  );
}


/**
 * Reopens the currently selected completed lead.
 *
 * Reopening does not change its workflow status.
 */
function reopenSelectedLead() {
  const context = getSelectedInitializedLead_();
  const {
    sheet,
    row,
    headers,
    ui,
  } = context;

  const isComplete = Boolean(
    sheet
      .getRange(row, headers.workflow_complete)
      .getValue()
  );

  if (!isComplete) {
    ui.alert(
      "Lead Is Already Open",
      "This lead is not currently marked complete.",
      ui.ButtonSet.OK
    );

    return;
  }

  const noteResponse = ui.prompt(
    "Reopen Workflow",
    "Enter an optional note explaining why additional work is needed.",
    ui.ButtonSet.OK_CANCEL
  );

  if (
    noteResponse.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const result = reopenLead_(row, {
    note: noteResponse.getResponseText().trim(),
    occurredAt: new Date(),
  });

  ui.alert(
    "Workflow Reopened",
    `${result.status} lead reopened successfully.`,
    ui.ButtonSet.OK
  );
}


/**
 * Core reusable completion automation.
 */
function markLeadComplete_(row, data = {}) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Leads");

  if (!sheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  const headers = getHeaderMap_("Leads");

  const leadId = sheet
    .getRange(row, headers.lead_id)
    .getDisplayValue()
    .trim();

  if (!leadId) {
    throw new Error(
      `Lead row ${row} does not contain a lead_id.`
    );
  }

  assertOperationalLeadById_(leadId);

  const status = sheet
    .getRange(row, headers.status)
    .getDisplayValue()
    .trim();

  const allowedStatuses = [
    "Scheduled",
    "Case Lost",
    "Unrelated",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error(
      `Status "${status}" cannot currently be marked complete.`
    );
  }

  const workflowCompleteCell =
    sheet.getRange(
      row,
      headers.workflow_complete
    );

  if (
    Boolean(workflowCompleteCell.getValue())
  ) {
    throw new Error(
      "This lead is already marked complete."
    );
  }

  /*
   * Repeat safety validation inside the reusable
   * core function so future Board actions cannot
   * bypass the UI safeguards.
   */
  if (status === "Scheduled") {
    const scheduledDate = sheet
      .getRange(
        row,
        headers.scheduled_date
      )
      .getValue();

    if (
      !(scheduledDate instanceof Date) ||
      isNaN(scheduledDate.getTime())
    ) {
      throw new Error(
        "A Scheduled lead requires a valid scheduled_date before completion."
      );
    }
  }

  if (status === "Case Lost") {
    const lostReason = sheet
      .getRange(
        row,
        headers.lost_reason
      )
      .getDisplayValue()
      .trim();

    if (!lostReason) {
      throw new Error(
        "A Case Lost lead requires a lost_reason before completion."
      );
    }

    if (!String(data.note || "").trim()) {
      throw new Error(
        "A completion note is required for Case Lost."
      );
    }
  }

  if (status === "Unrelated") {
    const unrelatedType = sheet
      .getRange(
        row,
        headers.unrelated_type
      )
      .getDisplayValue()
      .trim();

    if (!unrelatedType) {
      throw new Error(
        "An Unrelated lead requires an unrelated_type before completion."
      );
    }
  }

  const actor = getActorIdentity_();
  const recordedNow = new Date();

  const occurredAt =
    data.occurredAt instanceof Date
      ? data.occurredAt
      : recordedNow;

  const completedBy =
    actor.email ||
    actor.name ||
    "Employee";

  setCellByHeader_(
    sheet,
    row,
    headers,
    "workflow_complete",
    true
  );

  setCellByHeader_(
    sheet,
    row,
    headers,
    "completed_at",
    occurredAt
  );

  setCellByHeader_(
    sheet,
    row,
    headers,
    "completed_by",
    completedBy
  );

  appendActivity_({
    leadId,
    occurredAt,

    activityType:
      "workflow_completed",

    actorEmail:
      actor.email,

    actorName:
      actor.name,

    activitySource:
      "Employee",

    fieldName:
      "workflow_complete",

    previousValue:
      "FALSE",

    newValue:
      "TRUE",

    fromStatus:
      status,

    toStatus:
      status,

    note:
      data.note || "",

    systemGenerated:
      false,
  });

  updateLeadAuditMetadata_(
    sheet,
    row,
    headers,
    occurredAt,
    recordedNow,
    actor
  );

  return {
    leadId,
    status,
    completedAt:
      occurredAt,
    completedBy,
  };
}


/**
 * Core reusable reopen automation.
 */
function reopenLead_(row, data = {}) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Leads");

  if (!sheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  const headers = getHeaderMap_("Leads");

  const leadId = sheet
    .getRange(row, headers.lead_id)
    .getDisplayValue()
    .trim();

  if (!leadId) {
    throw new Error(
      `Lead row ${row} does not contain a lead_id.`
    );
  }

  assertOperationalLeadById_(leadId);

  const workflowCompleteCell =
    sheet.getRange(
      row,
      headers.workflow_complete
    );

  if (
    !Boolean(
      workflowCompleteCell.getValue()
    )
  ) {
    throw new Error(
      "This lead is not currently marked complete."
    );
  }

  const status = sheet
    .getRange(row, headers.status)
    .getDisplayValue()
    .trim();

  const actor = getActorIdentity_();
  const recordedNow = new Date();

  const occurredAt =
    data.occurredAt instanceof Date
      ? data.occurredAt
      : recordedNow;

  /*
   * Save previous completion information before
   * clearing it so the audit note can preserve it.
   */
  const previousCompletedAt =
    sheet
      .getRange(
        row,
        headers.completed_at
      )
      .getValue();

  const previousCompletedBy =
    sheet
      .getRange(
        row,
        headers.completed_by
      )
      .getDisplayValue()
      .trim();

  setCellByHeader_(
    sheet,
    row,
    headers,
    "workflow_complete",
    false
  );

  sheet
    .getRange(
      row,
      headers.completed_at
    )
    .clearContent();

  sheet
    .getRange(
      row,
      headers.completed_by
    )
    .clearContent();

  let auditNote =
    data.note || "";

  const previousCompletionText =
    previousCompletedAt instanceof Date &&
    !isNaN(previousCompletedAt.getTime())
      ? Utilities.formatDate(
          previousCompletedAt,
          getConfigValue_("timezone"),
          "MM/dd/yyyy h:mm a"
        )
      : "";

  if (
    previousCompletionText ||
    previousCompletedBy
  ) {
    const metadataText =
      `Previously completed` +
      `${previousCompletionText
        ? ` at ${previousCompletionText}`
        : ""}` +
      `${previousCompletedBy
        ? ` by ${previousCompletedBy}`
        : ""}.`;

    auditNote =
      auditNote
        ? `${auditNote} ${metadataText}`
        : metadataText;
  }

  appendActivity_({
    leadId,
    occurredAt,

    activityType:
      "workflow_reopened",

    actorEmail:
      actor.email,

    actorName:
      actor.name,

    activitySource:
      "Employee",

    fieldName:
      "workflow_complete",

    previousValue:
      "TRUE",

    newValue:
      "FALSE",

    fromStatus:
      status,

    toStatus:
      status,

    note:
      auditNote,

    systemGenerated:
      false,
  });

  updateLeadAuditMetadata_(
    sheet,
    row,
    headers,
    occurredAt,
    recordedNow,
    actor
  );

  return {
    leadId,
    status,
  };
}

/**
 * PHASE 2G-A
 * Adds a general employee comment to the selected lead.
 */
function addCommentForSelectedLead() {
  const context = getSelectedInitializedLead_();
  const {
    row,
    ui,
  } = context;

  const response = ui.prompt(
    "Add Comment",
    "Enter the comment you want to add to this lead.",
    ui.ButtonSet.OK_CANCEL
  );

  if (
    response.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const note =
    response.getResponseText().trim();

  if (!note) {
    ui.alert(
      "Comment Required",
      "A blank comment cannot be added.",
      ui.ButtonSet.OK
    );
    return;
  }

  const result = addLeadComment_(row, {
    note,
    occurredAt: new Date(),
  });

  ui.alert(
    "Comment Added",
    `Comment added successfully.\n\nActivity ID:\n${result.activityId}`,
    ui.ButtonSet.OK
  );
}


/**
 * Core reusable comment function.
 */
function addLeadComment_(row, data = {}) {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const leadsSheet =
    ss.getSheetByName("Leads");

  if (!leadsSheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  const headers =
    getHeaderMap_("Leads");

  const leadId =
    leadsSheet
      .getRange(
        row,
        headers.lead_id
      )
      .getDisplayValue()
      .trim();

  if (!leadId) {
    throw new Error(
      `Lead row ${row} does not contain a lead_id.`
    );
  }

  assertOperationalLeadById_(leadId);

  const note =
    String(data.note || "").trim();

  if (!note) {
    throw new Error(
      "A comment cannot be blank."
    );
  }

  const actor =
    getActorIdentity_();

  const recordedNow =
    new Date();

  const occurredAt =
    data.occurredAt instanceof Date
      ? data.occurredAt
      : recordedNow;

  const activityId =
    appendActivity_({
      leadId,
      occurredAt,

      activityType:
        "comment",

      actorEmail:
        actor.email,

      actorName:
        actor.name,

      activitySource:
        "Employee",

      note,

      systemGenerated:
        false,
    });

  updateLeadAuditMetadata_(
    leadsSheet,
    row,
    headers,
    occurredAt,
    recordedNow,
    actor
  );

  return {
    leadId,
    activityId,
  };
}

/**
 * PHASE 2G-B
 * Adds a reply to a selected comment/reply
 * in ActivityLog.
 */
function replyToSelectedActivity() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getActiveSheet();

  const ui =
    SpreadsheetApp.getUi();

  if (
    sheet.getName() !== "ActivityLog"
  ) {
    ui.alert(
      "Select a Comment",
      'Go to the "ActivityLog" worksheet and select the comment or reply you want to respond to.',
      ui.ButtonSet.OK
    );
    return;
  }

  const row =
    sheet.getActiveRange().getRow();

  if (row < 2) {
    ui.alert(
      "Select an Activity",
      "Select an ActivityLog data row, not the header.",
      ui.ButtonSet.OK
    );
    return;
  }

  const headers =
    getHeaderMap_("ActivityLog");

  const activityId =
    sheet
      .getRange(
        row,
        headers.activity_id
      )
      .getDisplayValue()
      .trim();

  const leadId =
    sheet
      .getRange(
        row,
        headers.lead_id
      )
      .getDisplayValue()
      .trim();

  const activityType =
    sheet
      .getRange(
        row,
        headers.activity_type
      )
      .getDisplayValue()
      .trim();

  if (!activityId || !leadId) {
    ui.alert(
      "Invalid Activity",
      "The selected ActivityLog row does not contain a valid activity_id and lead_id.",
      ui.ButtonSet.OK
    );
    return;
  }

  if (
    activityType !== "comment" &&
    activityType !== "reply"
  ) {
    ui.alert(
      "Cannot Reply",
      'Replies can currently be attached only to activities with type "comment" or "reply".',
      ui.ButtonSet.OK
    );
    return;
  }

  /*
   * If the selected row is itself a reply,
   * keep all replies attached to the original
   * parent comment.
   */
  let parentActivityId =
    activityId;

  if (activityType === "reply") {
    const existingParent =
      sheet
        .getRange(
          row,
          headers.parent_activity_id
        )
        .getDisplayValue()
        .trim();

    if (existingParent) {
      parentActivityId =
        existingParent;
    }
  }

  const response = ui.prompt(
    "Add Reply",
    "Enter your reply.",
    ui.ButtonSet.OK_CANCEL
  );

  if (
    response.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const note =
    response.getResponseText().trim();

  if (!note) {
    ui.alert(
      "Reply Required",
      "A blank reply cannot be added.",
      ui.ButtonSet.OK
    );
    return;
  }

  const result =
    addActivityReply_({
      leadId,
      parentActivityId,
      note,
      occurredAt: new Date(),
    });

  ui.alert(
    "Reply Added",
    `Reply added successfully.\n\nActivity ID:\n${result.activityId}`,
    ui.ButtonSet.OK
  );
}


/**
 * Resolves any timeline activity to the root activity
 * of its reply thread.
 *
 * A normal activity is already its own root.
 * A reply resolves through parent_activity_id until
 * the original non-reply activity is reached.
 */
function resolveThreadRootActivity_(
  leadId,
  targetActivityId
) {
  const cleanLeadId =
    String(
      leadId || ""
    ).trim();

  let currentActivityId =
    String(
      targetActivityId || ""
    ).trim();

  if (!cleanLeadId) {
    throw new Error(
      "A lead_id is required."
    );
  }

  if (!currentActivityId) {
    throw new Error(
      "An activity_id is required."
    );
  }

  const visited = {};

  while (currentActivityId) {
    if (
      visited[
        currentActivityId
      ]
    ) {
      throw new Error(
        "A circular activity reply relationship was detected."
      );
    }

    visited[
      currentActivityId
    ] = true;

    const activity =
      getActivityById_(
        currentActivityId
      );

    if (!activity) {
      throw new Error(
        `Activity not found: ${currentActivityId}`
      );
    }

    if (
      activity.leadId !==
      cleanLeadId
    ) {
      throw new Error(
        "The selected activity belongs to a different lead."
      );
    }

    if (
      activity.activityType !==
      "reply"
    ) {
      return activity;
    }

    currentActivityId =
      String(
        activity.parentActivityId ||
        ""
      ).trim();

    if (!currentActivityId) {
      throw new Error(
        "The reply does not contain a valid parent activity."
      );
    }
  }

  throw new Error(
    "The thread root could not be determined."
  );
}


/**
 * Core reusable reply function.
 */
function addActivityReply_(
  data = {}
) {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const activitySheet =
    ss.getSheetByName(
      "ActivityLog"
    );

  const leadsSheet =
    ss.getSheetByName(
      "Leads"
    );

  if (!activitySheet) {
    throw new Error(
      "ActivityLog worksheet was not found."
    );
  }

  if (!leadsSheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }


  const leadId =
    String(
      data.leadId || ""
    ).trim();

  const targetActivityId =
    String(
      data.parentActivityId || ""
    ).trim();

  const note =
    String(
      data.note || ""
    ).trim();


  if (!leadId) {
    throw new Error(
      "A lead_id is required for a reply."
    );
  }

  assertOperationalLeadById_(leadId);

  if (!targetActivityId) {
    throw new Error(
      "A parent_activity_id is required for a reply."
    );
  }

  if (!note) {
    throw new Error(
      "A reply cannot be blank."
    );
  }


  /*
   * The clicked target can now be ANY timeline
   * activity, including another reply.
   *
   * Replies always store the original root
   * activity as parent_activity_id.
   */
  const rootActivity =
    resolveThreadRootActivity_(
      leadId,
      targetActivityId
    );

  const parentActivityId =
    rootActivity.activityId;


  const leadRow =
    findLeadRowById_(
      leadId
    );

  if (!leadRow) {
    throw new Error(
      `Lead not found: ${leadId}`
    );
  }


  const actor =
    getActorIdentity_();

  const recordedNow =
    new Date();

  const occurredAt =
    data.occurredAt instanceof Date
      ? data.occurredAt
      : recordedNow;


  const activityId =
    appendActivity_({
      leadId,
      occurredAt,

      activityType:
        "reply",

      actorEmail:
        actor.email,

      actorName:
        actor.name,

      activitySource:
        "Employee",

      note,

      parentActivityId,

      systemGenerated:
        false,
    });


  const leadHeaders =
    getHeaderMap_(
      "Leads"
    );

  updateLeadAuditMetadata_(
    leadsSheet,
    leadRow,
    leadHeaders,
    occurredAt,
    recordedNow,
    actor
  );


  return {
    leadId,
    activityId,
    parentActivityId,
  };
}


/**
 * Finds an initialized lead by lead_id.
 *
 * Returns its row number or null.
 */
function findLeadRowById_(leadId) {
  const perf = startPerf_("findLeadRowById_");

  try {
    if (
      Object.prototype.hasOwnProperty.call(
        EXECUTION_CACHE_.leadRowsById,
        leadId
      )
    ) {
      return EXECUTION_CACHE_.leadRowsById[leadId];
    }

    const ss =
      SpreadsheetApp.getActiveSpreadsheet();

    const sheet =
      ss.getSheetByName("Leads");

    if (!sheet) {
      throw new Error(
        "Leads worksheet was not found."
      );
    }

    const headers =
      getHeaderMap_("Leads");

    const lastRow =
      sheet.getLastRow();

    if (lastRow < 2) {
      EXECUTION_CACHE_.leadRowsById[leadId] = null;
      return null;
    }

    const values =
      sheet
        .getRange(
          2,
          headers.lead_id,
          lastRow - 1,
          1
        )
        .getDisplayValues();

    for (
      let index = 0;
      index < values.length;
      index++
    ) {
      if (
        values[index][0].trim() ===
        leadId
      ) {
        const row = index + 2;
        EXECUTION_CACHE_.leadRowsById[leadId] = row;
        return row;
      }
    }

    EXECUTION_CACHE_.leadRowsById[leadId] = null;
    return null;
  } finally {
    endPerf_(perf);
  }
}


/**
 * Reads one ActivityLog record by activity_id.
 *
 * Returns null if it does not exist.
 */
function getActivityById_(
  activityId
) {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName("ActivityLog");

  if (!sheet) {
    throw new Error(
      "ActivityLog worksheet was not found."
    );
  }

  const headers =
    getHeaderMap_("ActivityLog");

  const lastRow =
    sheet.getLastRow();

  if (lastRow < 2) {
    return null;
  }

  const ids =
    sheet
      .getRange(
        2,
        headers.activity_id,
        lastRow - 1,
        1
      )
      .getDisplayValues();

  for (
    let index = 0;
    index < ids.length;
    index++
  ) {
    if (
      ids[index][0].trim() !==
      activityId
    ) {
      continue;
    }

    const row =
      index + 2;

    return {
      row,

      activityId,

      leadId:
        sheet
          .getRange(
            row,
            headers.lead_id
          )
          .getDisplayValue()
          .trim(),

      activityType:
        sheet
          .getRange(
            row,
            headers.activity_type
          )
          .getDisplayValue()
          .trim(),

      parentActivityId:
        sheet
          .getRange(
            row,
            headers.parent_activity_id
          )
          .getDisplayValue()
          .trim(),
    };
  }

  return null;
}

/**
 * PHASE 2H-A
 * Registers an existing Google Drive file as an attachment
 * for the currently selected lead.
 *
 * DEV TEST ONLY:
 * Use fake files containing no real patient information.
 */
function addDriveAttachmentForSelectedLead() {
  const context = getSelectedInitializedLead_();
  const {
    row,
    ui,
  } = context;

  const linkResponse = ui.prompt(
    "Add Drive Attachment",
    "Paste the Google Drive file link or file ID.",
    ui.ButtonSet.OK_CANCEL
  );

  if (
    linkResponse.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const input =
    linkResponse.getResponseText().trim();

  if (!input) {
    ui.alert(
      "Drive File Required",
      "Paste a Google Drive file link or file ID.",
      ui.ButtonSet.OK
    );
    return;
  }

  let driveFileId;

  try {
    driveFileId =
      extractGoogleDriveFileId_(input);
  } catch (error) {
    ui.alert(
      "Invalid Drive File",
      error.message,
      ui.ButtonSet.OK
    );
    return;
  }

  const descriptionResponse = ui.prompt(
    "Attachment Description",
    "Enter an optional description for this attachment.",
    ui.ButtonSet.OK_CANCEL
  );

  if (
    descriptionResponse.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const description =
    descriptionResponse
      .getResponseText()
      .trim();

  let result;

  try {
    result =
      registerDriveAttachment_(row, {
        driveFileId,
        description,
        occurredAt: new Date(),
      });
  } catch (error) {
    ui.alert(
      "Attachment Could Not Be Added",
      error.message,
      ui.ButtonSet.OK
    );
    return;
  }

  ui.alert(
    "Attachment Added",
    `File: ${result.fileName}\n\nAttachment ID:\n${result.attachmentId}`,
    ui.ButtonSet.OK
  );
}


/**
 * PHASE 5B
 *
 * Checks whether a stored Drive attachment is
 * currently accessible to the active employee.
 *
 * Results are cached briefly because Patient Detail
 * may refresh several times during one session.
 */
function inspectDriveAttachmentFile_(
  driveFileId,
  forceFresh = false
) {
  const cleanFileId =
    String(
      driveFileId || ""
    ).trim();


  if (!cleanFileId) {
    return {
      available: false,

      state:
        "missing_id",

      message:
        "Drive file ID is missing.",

      fileName:
        "",

      fileUrl:
        "",

      mimeType:
        "",

      fileSizeBytes:
        0,

      trashed:
        false,
    };
  }


  const cache =
    CacheService
      .getUserCache();


  const cacheKey =
    "ATTACHMENT_HEALTH_" +
    cleanFileId;


  if (!forceFresh) {
    const cached =
      cache.get(
        cacheKey
      );

    if (cached) {
      try {
        return JSON.parse(
          cached
        );
      } catch (error) {
        /*
         * Ignore malformed cache and perform
         * a fresh Drive lookup.
         */
      }
    }
  }


  let result;


  try {
    const file =
      DriveApp.getFileById(
        cleanFileId
      );


    const trashed =
      Boolean(
        file.isTrashed()
      );


    if (trashed) {
      result = {
        available: false,

        state:
          "trashed",

        message:
          "This Drive file is currently in Trash.",

        fileName:
          file.getName(),

        fileUrl:
          "",

        mimeType:
          file.getMimeType(),

        fileSizeBytes:
          Number(
            file.getSize()
          ) || 0,

        trashed: true,
      };

    } else {

      result = {
        available: true,

        state:
          "available",

        message:
          "Drive file is available.",

        fileName:
          file.getName(),

        fileUrl:
          file.getUrl(),

        mimeType:
          file.getMimeType(),

        fileSizeBytes:
          Number(
            file.getSize()
          ) || 0,

        trashed: false,
      };
    }

  } catch (error) {

    result = {
      available: false,

      state:
        "unavailable",

      message:
        "File unavailable or access denied.",

      fileName:
        "",

      fileUrl:
        "",

      mimeType:
        "",

      fileSizeBytes:
        0,

      trashed:
        false,
    };
  }


  /*
   * Five-minute user-specific cache.
   *
   * Access can differ between employees, so use
   * UserCache rather than one shared ScriptCache.
   */
  try {
    cache.put(
      cacheKey,
      JSON.stringify(
        result
      ),
      300
    );
  } catch (error) {
    /*
     * Cache failure should never break
     * Patient Details.
     */
  }


  return result;
}


/**
 * PHASE 5C
 *
 * Returns and validates the configured attachment
 * storage policy.
 *
 * DEV:
 *   reference_existing
 *
 * PROD:
 *   managed_folder_required
 */
function getAttachmentStorageConfig_() {
  const environment =
    String(
      getConfigValue_(
        "environment"
      ) || ""
    )
      .trim()
      .toLowerCase();


  const policy =
    String(
      getConfigValue_(
        "attachment_storage_policy"
      ) || ""
    )
      .trim()
      .toLowerCase();


  const managedFolderId =
    String(
      getConfigValue_(
        "attachment_managed_folder_id"
      ) || ""
    ).trim();


  const allowedPolicies = [
    "reference_existing",
    "managed_folder_required",
  ];


  if (
    !allowedPolicies.includes(
      policy
    )
  ) {
    throw new Error(
      'Config "attachment_storage_policy" must be either "reference_existing" or "managed_folder_required".'
    );
  }


  /*
   * Production may never silently fall back to
   * arbitrary employee-owned Drive references.
   */
  if (
    environment !==
      "development" &&
    policy !==
      "managed_folder_required"
  ) {
    throw new Error(
      'Non-development environments require attachment_storage_policy = "managed_folder_required".'
    );
  }


  if (
    policy ===
      "managed_folder_required" &&
    !managedFolderId
  ) {
    throw new Error(
      'Config "attachment_managed_folder_id" is required when managed attachment storage is enabled.'
    );
  }


  return {
    environment,
    policy,
    managedFolderId,

    managedStorageRequired:
      policy ===
      "managed_folder_required",
  };
}


/**
 * Returns true when a Drive file is stored inside
 * the configured managed folder or any descendant
 * folder beneath it.
 */
function isDriveFileInsideManagedFolder_(
  file,
  managedFolderId
) {
  const targetFolderId =
    String(
      managedFolderId || ""
    ).trim();


  if (!targetFolderId) {
    return false;
  }


  /*
   * Breadth-first parent traversal.
   *
   * The visited map protects against malformed or
   * unexpected folder relationships.
   */
  const queue = [];

  const visited = {};


  try {
    const parents =
      file.getParents();


    while (
      parents.hasNext()
    ) {
      queue.push(
        parents.next()
      );
    }

  } catch (error) {
    throw new Error(
      "The attachment's Drive folder location could not be inspected."
    );
  }


  let inspected = 0;

  const maxFolders =
    500;


  while (
    queue.length > 0
  ) {
    const folder =
      queue.shift();


    const folderId =
      String(
        folder.getId() || ""
      ).trim();


    if (!folderId) {
      continue;
    }


    if (
      folderId ===
      targetFolderId
    ) {
      return true;
    }


    if (
      visited[
        folderId
      ]
    ) {
      continue;
    }


    visited[
      folderId
    ] = true;


    inspected += 1;


    if (
      inspected >
      maxFolders
    ) {
      throw new Error(
        "The Drive folder hierarchy exceeded the attachment validation limit."
      );
    }


    try {
      const parents =
        folder.getParents();


      while (
        parents.hasNext()
      ) {
        queue.push(
          parents.next()
        );
      }

    } catch (error) {
      /*
       * If an ancestor cannot be inspected,
       * continue checking the remaining paths.
       */
    }
  }


  return false;
}


/**
 * Enforces the configured attachment storage policy
 * against one already-opened Drive file.
 */
function validateAttachmentStoragePolicy_(
  file
) {
  if (!file) {
    throw new Error(
      "A Drive file is required for attachment storage validation."
    );
  }


  const config =
    getAttachmentStorageConfig_();


  /*
   * DEV behavior.
   *
   * The file merely needs to be accessible.
   * Existing Phase 5B validation handles that.
   */
  if (
    config.policy ===
    "reference_existing"
  ) {
    return {
      allowed: true,

      policy:
        config.policy,

      managed:
        false,
    };
  }


  /*
   * Production behavior.
   */
  let managedFolder;


  try {
    managedFolder =
      DriveApp.getFolderById(
        config.managedFolderId
      );

  } catch (error) {
    throw new Error(
      "The configured managed attachment folder could not be opened. Verify the folder ID and your access."
    );
  }


  if (
    managedFolder.isTrashed()
  ) {
    throw new Error(
      "The configured managed attachment folder is in Trash."
    );
  }


  const insideManagedStorage =
    isDriveFileInsideManagedFolder_(
      file,
      config.managedFolderId
    );


  if (
    !insideManagedStorage
  ) {
    throw new Error(
      "This file is outside the clinic-managed attachment folder. Move or upload it into the approved clinic Drive location before attaching it."
    );
  }


  return {
    allowed: true,

    policy:
      config.policy,

    managed: true,

    managedFolderId:
      config.managedFolderId,
  };
}


/**
 * Core reusable attachment-registration function.
 */
function registerDriveAttachment_(
  row,
  data = {}
) {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const leadsSheet =
    ss.getSheetByName("Leads");

  const attachmentsSheet =
    ss.getSheetByName("Attachments");

  if (!leadsSheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  if (!attachmentsSheet) {
    throw new Error(
      "Attachments worksheet was not found."
    );
  }

  const leadHeaders =
    getHeaderMap_("Leads");

  const leadId =
    leadsSheet
      .getRange(
        row,
        leadHeaders.lead_id
      )
      .getDisplayValue()
      .trim();

  if (!leadId) {
    throw new Error(
      `Lead row ${row} does not contain a lead_id.`
    );
  }

  assertOperationalLeadById_(leadId);

  /*
   * Optional relationship to a comment or reply.
   *
   * Attachments.activity_id will still point to the
   * attachment_added event. This parentActivityId
   * tells that event which conversation item the
   * attachment belongs to.
   */
  const parentActivityId =
    String(
      data.parentActivityId || ""
    ).trim();

  if (parentActivityId) {
    const parent =
      getActivityById_(
        parentActivityId
      );

    if (!parent) {
      throw new Error(
        `Parent activity not found: ${parentActivityId}`
      );
    }

    if (parent.leadId !== leadId) {
      throw new Error(
        "The selected conversation activity belongs to a different lead."
      );
    }
  }

  const driveFileId =
    String(
      data.driveFileId || ""
    ).trim();

  if (!driveFileId) {
    throw new Error(
      "A Google Drive file ID is required."
    );
  }

  /*
   * Prevent the same Drive file from being
   * registered twice for the same lead.
   */
  if (
    attachmentExistsForLead_(
      leadId,
      driveFileId
    )
  ) {
    throw new Error(
      "This Drive file is already attached to this lead."
    );
  }

  let file;

  try {
    file =
      DriveApp.getFileById(
        driveFileId
      );
  } catch (error) {
    throw new Error(
      "The Drive file could not be opened. Verify the file ID/link and make sure your Google account has access to it."
    );
  }

  if (
    file.isTrashed()
  ) {
    throw new Error(
      "This Google Drive file is in Trash and cannot be attached."
    );
  }

  /*
   * Phase 5C:
   * DEV can reference accessible fake files.
   *
   * Production requires the file to already live
   * inside clinic-managed Drive storage.
   */
  validateAttachmentStoragePolicy_(
    file
  );

  const fileName =
    file.getName();

  const fileUrl =
    file.getUrl();

  const mimeType =
    file.getMimeType();

  let fileSizeBytes = 0;

  try {
    fileSizeBytes =
      Number(file.getSize()) || 0;
  } catch (error) {
    fileSizeBytes = 0;
  }

  const actor =
    getActorIdentity_();

  const recordedNow =
    new Date();

  const occurredAt =
    data.occurredAt instanceof Date
      ? data.occurredAt
      : recordedNow;

  const description =
    String(
      data.description || ""
    ).trim();

  /*
   * First create the corresponding audit activity.
   *
   * Attachments.activity_id will point to this
   * attachment_added ActivityLog event.
   */
  const activityId =
    appendActivity_({
      leadId,
      occurredAt,

      activityType:
        "attachment_added",

      actorEmail:
        actor.email,

      actorName:
        actor.name,

      activitySource:
        "Employee",

      note:
        description
          ? `Attachment added: ${fileName}. ${description}`
          : `Attachment added: ${fileName}.`,

      parentActivityId,

      systemGenerated:
        false,
    });

  const attachmentId =
    generateSystemId_("ATT");

  const attachmentHeaders =
    getHeaderMap_("Attachments");

  const attachmentRow =
    findFirstEmptyDataRow_(
      attachmentsSheet,
      attachmentHeaders.attachment_id
    );

  const values = {
    attachment_id:
      attachmentId,

    lead_id:
      leadId,

    activity_id:
      activityId,

    uploaded_at:
      occurredAt,

    uploaded_by:
      actor.email ||
      actor.name ||
      "Employee",

    file_name:
      fileName,

    drive_file_id:
      driveFileId,

    file_url:
      fileUrl,

    mime_type:
      mimeType,

    file_size_bytes:
      fileSizeBytes,

    description:
      description,

    system_generated:
      false,
  };

  Object.entries(values).forEach(
    ([headerName, value]) => {
      setCellByHeader_(
        attachmentsSheet,
        attachmentRow,
        attachmentHeaders,
        headerName,
        value
      );
    }
  );

  updateLeadAuditMetadata_(
    leadsSheet,
    row,
    leadHeaders,
    occurredAt,
    recordedNow,
    actor
  );

  return {
    leadId,
    attachmentId,
    activityId,
    fileName,
    driveFileId,
    fileUrl,
    mimeType,
    fileSizeBytes,
  };
}


/**
 * Accepts either:
 *
 * - a raw Google Drive file ID
 * - /file/d/FILE_ID/
 * - ?id=FILE_ID
 * - open?id=FILE_ID
 */
function extractGoogleDriveFileId_(
  input
) {
  const value =
    String(input || "").trim();

  if (!value) {
    throw new Error(
      "Drive file link or ID is blank."
    );
  }

  /*
   * Raw Drive IDs generally contain letters,
   * numbers, hyphens, and underscores.
   */
  if (
    /^[A-Za-z0-9_-]{20,}$/.test(
      value
    )
  ) {
    return value;
  }

  /*
   * Standard Drive file URL:
   * https://drive.google.com/file/d/FILE_ID/view
   */
  const filePathMatch =
    value.match(
      /\/file\/d\/([A-Za-z0-9_-]+)/
    );

  if (
    filePathMatch &&
    filePathMatch[1]
  ) {
    return filePathMatch[1];
  }

  /*
   * Query parameter style:
   * ?id=FILE_ID
   */
  const idParameterMatch =
    value.match(
      /[?&]id=([A-Za-z0-9_-]+)/
    );

  if (
    idParameterMatch &&
    idParameterMatch[1]
  ) {
    return idParameterMatch[1];
  }

  throw new Error(
    "A valid Google Drive file ID could not be found in that value."
  );
}


/**
 * Checks whether the same Drive file is already
 * registered for the same lead.
 */
function attachmentExistsForLead_(
  leadId,
  driveFileId
) {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName("Attachments");

  if (!sheet) {
    throw new Error(
      "Attachments worksheet was not found."
    );
  }

  const headers =
    getHeaderMap_("Attachments");

  const maxRows =
    sheet.getMaxRows();

  if (maxRows < 2) {
    return false;
  }

  const leadValues =
    sheet
      .getRange(
        2,
        headers.lead_id,
        maxRows - 1,
        1
      )
      .getDisplayValues();

  const fileValues =
    sheet
      .getRange(
        2,
        headers.drive_file_id,
        maxRows - 1,
        1
      )
      .getDisplayValues();

  for (
    let index = 0;
    index < leadValues.length;
    index++
  ) {
    const existingLeadId =
      String(
        leadValues[index][0]
      ).trim();

    const existingFileId =
      String(
        fileValues[index][0]
      ).trim();

    if (
      existingLeadId === leadId &&
      existingFileId === driveFileId
    ) {
      return true;
    }
  }

  return false;
}

/**
 * PHASE 2H-B
 * Registers a Google Drive file against the selected
 * comment or reply in ActivityLog.
 */
function addDriveAttachmentToSelectedActivity() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const activitySheet =
    ss.getActiveSheet();

  const ui =
    SpreadsheetApp.getUi();

  if (
    activitySheet.getName() !==
    "ActivityLog"
  ) {
    ui.alert(
      "Select a Comment or Reply",
      'Go to the "ActivityLog" worksheet and select the comment or reply that should receive the attachment.',
      ui.ButtonSet.OK
    );
    return;
  }

  const activityRow =
    activitySheet
      .getActiveRange()
      .getRow();

  if (activityRow < 2) {
    ui.alert(
      "Select an Activity",
      "Select an ActivityLog data row, not the header.",
      ui.ButtonSet.OK
    );
    return;
  }

  const activityHeaders =
    getHeaderMap_(
      "ActivityLog"
    );

  const parentActivityId =
    activitySheet
      .getRange(
        activityRow,
        activityHeaders.activity_id
      )
      .getDisplayValue()
      .trim();

  const leadId =
    activitySheet
      .getRange(
        activityRow,
        activityHeaders.lead_id
      )
      .getDisplayValue()
      .trim();

  const activityType =
    activitySheet
      .getRange(
        activityRow,
        activityHeaders.activity_type
      )
      .getDisplayValue()
      .trim();

  if (
    !parentActivityId ||
    !leadId
  ) {
    ui.alert(
      "Invalid Activity",
      "The selected ActivityLog row does not contain a valid activity_id and lead_id.",
      ui.ButtonSet.OK
    );
    return;
  }

  if (
    activityType !== "comment" &&
    activityType !== "reply"
  ) {
    ui.alert(
      "Cannot Add Attachment Here",
      'Select an ActivityLog row whose activity_type is "comment" or "reply".',
      ui.ButtonSet.OK
    );
    return;
  }

  const leadRow =
    findLeadRowById_(
      leadId
    );

  if (!leadRow) {
    ui.alert(
      "Lead Not Found",
      `Could not find the corresponding lead:\n${leadId}`,
      ui.ButtonSet.OK
    );
    return;
  }

  const linkResponse =
    ui.prompt(
      "Attach Drive File",
      "Paste the Google Drive file link or file ID.",
      ui.ButtonSet.OK_CANCEL
    );

  if (
    linkResponse.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const input =
    linkResponse
      .getResponseText()
      .trim();

  if (!input) {
    ui.alert(
      "Drive File Required",
      "Paste a Google Drive file link or file ID.",
      ui.ButtonSet.OK
    );
    return;
  }

  let driveFileId;

  try {
    driveFileId =
      extractGoogleDriveFileId_(
        input
      );
  } catch (error) {
    ui.alert(
      "Invalid Drive File",
      error.message,
      ui.ButtonSet.OK
    );
    return;
  }

  const descriptionResponse =
    ui.prompt(
      "Attachment Description",
      "Enter an optional description for this attachment.",
      ui.ButtonSet.OK_CANCEL
    );

  if (
    descriptionResponse.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  let result;

  try {
    result =
      registerDriveAttachment_(
        leadRow,
        {
          driveFileId,

          parentActivityId,

          description:
            descriptionResponse
              .getResponseText()
              .trim(),

          occurredAt:
            new Date(),
        }
      );
  } catch (error) {
    ui.alert(
      "Attachment Could Not Be Added",
      error.message,
      ui.ButtonSet.OK
    );
    return;
  }

  ui.alert(
    "Conversation Attachment Added",
    `File: ${result.fileName}\n\nAttachment ID:\n${result.attachmentId}`,
    ui.ButtonSet.OK
  );
}

/**
 * PHASE 2I
 * Adds a reaction to the selected comment or reply.
 */
function addReactionToSelectedActivity() {
  const ui = SpreadsheetApp.getUi();

  let target;

  try {
    target = getSelectedReactionTarget_();
  } catch (error) {
    ui.alert(
      "Cannot Add Reaction",
      error.message,
      ui.ButtonSet.OK
    );
    return;
  }

  const emojis = getListValues_(
    target.ss.getSheetByName("Lists"),
    "M2:M6"
  );

  const emojiResponse = ui.prompt(
    "Add Reaction",
    "Enter exactly one of these reactions:\n\n" +
      emojis.join("   "),
    ui.ButtonSet.OK_CANCEL
  );

  if (
    emojiResponse.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const emoji =
    emojiResponse
      .getResponseText()
      .trim();

  if (!emojis.includes(emoji)) {
    ui.alert(
      "Invalid Reaction",
      "Enter exactly one of:\n\n" +
        emojis.join("   "),
      ui.ButtonSet.OK
    );
    return;
  }

  let result;

  try {
    result = addReaction_({
      leadId: target.leadId,
      activityId: target.activityId,
      emoji,
      occurredAt: new Date(),
    });
  } catch (error) {
    ui.alert(
      "Reaction Could Not Be Added",
      error.message,
      ui.ButtonSet.OK
    );
    return;
  }

  ui.alert(
    "Reaction Added",
    `${emoji} added successfully.\n\nReaction ID:\n${result.reactionId}`,
    ui.ButtonSet.OK
  );
}


/**
 * Removes the current employee's active reaction
 * from the selected comment or reply.
 *
 * The reaction row is NOT deleted.
 */
function removeReactionFromSelectedActivity() {
  const ui = SpreadsheetApp.getUi();

  let target;

  try {
    target = getSelectedReactionTarget_();
  } catch (error) {
    ui.alert(
      "Cannot Remove Reaction",
      error.message,
      ui.ButtonSet.OK
    );
    return;
  }

  const emojis = getListValues_(
    target.ss.getSheetByName("Lists"),
    "M2:M6"
  );

  const emojiResponse = ui.prompt(
    "Remove Reaction",
    "Enter the reaction you want to remove:\n\n" +
      emojis.join("   "),
    ui.ButtonSet.OK_CANCEL
  );

  if (
    emojiResponse.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const emoji =
    emojiResponse
      .getResponseText()
      .trim();

  if (!emojis.includes(emoji)) {
    ui.alert(
      "Invalid Reaction",
      "Enter exactly one of:\n\n" +
        emojis.join("   "),
      ui.ButtonSet.OK
    );
    return;
  }

  let result;

  try {
    result = removeReaction_({
      leadId: target.leadId,
      activityId: target.activityId,
      emoji,
      occurredAt: new Date(),
    });
  } catch (error) {
    ui.alert(
      "Reaction Could Not Be Removed",
      error.message,
      ui.ButtonSet.OK
    );
    return;
  }

  ui.alert(
    "Reaction Removed",
    `${emoji} was removed successfully.\n\nThe historical reaction record was preserved.`,
    ui.ButtonSet.OK
  );
}


/**
 * PHASE 5D
 * Returns the currently configured reaction
 * vocabulary.
 */
function getAllowedReactionEmojis_() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const listsSheet =
    ss.getSheetByName(
      "Lists"
    );

  if (!listsSheet) {
    throw new Error(
      "Lists worksheet was not found."
    );
  }

  return getListValues_(
    listsSheet,
    "M2:M6"
  );
}


/**
 * Validates a new reaction against the configured
 * reaction vocabulary.
 */
function validateReactionEmoji_(
  emoji
) {
  const cleanEmoji =
    String(
      emoji || ""
    ).trim();

  if (!cleanEmoji) {
    throw new Error(
      "A reaction emoji is required."
    );
  }

  const allowed =
    getAllowedReactionEmojis_();

  if (
    !allowed.includes(
      cleanEmoji
    )
  ) {
    throw new Error(
      "That reaction is not allowed."
    );
  }

  return cleanEmoji;
}


/**
 * Reaction-added / reaction-removed audit rows should
 * not themselves become reaction targets.
 *
 * All normal workflow events remain eligible:
 * status changes, scheduling, comments, attempts,
 * attachments, completion, etc.
 */
function isReactionEligibleActivityType_(
  activityType
) {
  const type =
    String(
      activityType || ""
    ).trim();

  return ![
    "reaction_added",
    "reaction_removed",
  ].includes(
    type
  );
}


/**
 * Normalized employee identity used when determining
 * whether the current employee already has a
 * particular reaction active.
 */
function normalizeReactionActor_(
  actor
) {
  const email =
    String(
      actor &&
      actor.email
        ? actor.email
        : ""
    )
      .trim()
      .toLowerCase();

  const name =
    String(
      actor &&
      actor.name
        ? actor.name
        : ""
    )
      .trim()
      .toLowerCase();

  if (
    !email &&
    !name
  ) {
    throw new Error(
      "The current employee identity could not be determined."
    );
  }

  return {
    email,
    name,
  };
}


/**
 * Serializes reaction writes within this workbook.
 *
 * This protects the read → check → write sequence
 * from two near-simultaneous clicks creating two
 * active copies of the same reaction.
 */
function withReactionMutationLock_(
  callback
) {
  const lock =
    LockService
      .getDocumentLock();

  if (
    !lock.tryLock(
      10000
    )
  ) {
    throw new Error(
      "The reaction system is busy. Please try again."
    );
  }

  try {
    return callback();

  } finally {
    lock.releaseLock();
  }
}


/**
 * Core reusable reaction-add function.
 *
 * PHASE 5D:
 * - controlled vocabulary enforced in core
 * - cross-lead validation
 * - audit-event reactions blocked
 * - duplicate check protected by document lock
 */
function addReaction_(
  data = {}
) {
  return withReactionMutationLock_(
    function() {

      const ss =
        SpreadsheetApp
          .getActiveSpreadsheet();

      const reactionsSheet =
        ss.getSheetByName(
          "Reactions"
        );

      const leadsSheet =
        ss.getSheetByName(
          "Leads"
        );


      if (!reactionsSheet) {
        throw new Error(
          "Reactions worksheet was not found."
        );
      }

      if (!leadsSheet) {
        throw new Error(
          "Leads worksheet was not found."
        );
      }


      const leadId =
        String(
          data.leadId || ""
        ).trim();

      const activityId =
        String(
          data.activityId || ""
        ).trim();

      const emoji =
        validateReactionEmoji_(
          data.emoji
        );


      if (!leadId) {
        throw new Error(
          "A lead_id is required."
        );
      }

  assertOperationalLeadById_(leadId);

      if (!activityId) {
        throw new Error(
          "An activity_id is required."
        );
      }


      /*
       * Verify canonical target.
       */
      const target =
        getActivityById_(
          activityId
        );


      if (!target) {
        throw new Error(
          `Activity not found: ${activityId}`
        );
      }


      if (
        target.leadId !==
        leadId
      ) {
        throw new Error(
          "The selected activity belongs to a different lead."
        );
      }


      if (
        !isReactionEligibleActivityType_(
          target.activityType
        )
      ) {
        throw new Error(
          "Reaction audit events cannot receive reactions."
        );
      }


      const actor =
        getActorIdentity_();


      /*
       * Also ensures we actually have enough actor
       * identity to own this reaction.
       */
      normalizeReactionActor_(
        actor
      );


      /*
       * IMPORTANT:
       * This duplicate check occurs INSIDE the lock.
       */
      const existingReaction =
        findActiveReaction_(
          activityId,
          emoji,
          actor
        );


      if (
        existingReaction
      ) {
        throw new Error(
          `You already have an active ${emoji} reaction on this activity.`
        );
      }


      const leadRow =
        findLeadRowById_(
          leadId
        );


      if (!leadRow) {
        throw new Error(
          `Lead not found: ${leadId}`
        );
      }


      const recordedNow =
        new Date();


      const occurredAt =
        data.occurredAt instanceof
          Date
          ? data.occurredAt
          : recordedNow;


      const reactionId =
        generateSystemId_(
          "REACT"
        );


      const reactionHeaders =
        getHeaderMap_(
          "Reactions"
        );


      const reactionRow =
        findFirstEmptyDataRow_(
          reactionsSheet,
          reactionHeaders
            .reaction_id
        );


      const values = {
        reaction_id:
          reactionId,

        lead_id:
          leadId,

        activity_id:
          activityId,

        emoji,

        reacted_at:
          occurredAt,

        reacted_by_email:
          actor.email,

        reacted_by_name:
          actor.name,

        is_active:
          true,

        removed_at:
          "",

        removed_by:
          "",
      };


      withPerf_(
        "Reactions-sheet write",
        function() {
          Object.entries(
            values
          ).forEach(
            (
              [
                headerName,
                value,
              ]
            ) => {
              setCellByHeader_(
                reactionsSheet,
                reactionRow,
                reactionHeaders,
                headerName,
                value
              );
            }
          );
        }
      );


      const auditActivityId =
        appendActivity_({
          leadId,

          occurredAt,

          activityType:
            "reaction_added",

          actorEmail:
            actor.email,

          actorName:
            actor.name,

          activitySource:
            "Employee",

          note:
            `Reaction added: ${emoji}`,

          parentActivityId:
            activityId,

          systemGenerated:
            false,
        });


      const leadHeaders =
        getHeaderMap_(
          "Leads"
        );


      updateLeadAuditMetadata_(
        leadsSheet,
        leadRow,
        leadHeaders,
        occurredAt,
        recordedNow,
        actor
      );


      return {
        reactionId,
        leadId,
        activityId,
        emoji,
        auditActivityId,
      };
    }
  );
}


/**
 * Core reusable reaction-removal function.
 *
 * Historical rows are NEVER deleted.
 */
function removeReaction_(
  data = {}
) {
  return withReactionMutationLock_(
    function() {

      const ss =
        SpreadsheetApp
          .getActiveSpreadsheet();

      const reactionsSheet =
        ss.getSheetByName(
          "Reactions"
        );

      const leadsSheet =
        ss.getSheetByName(
          "Leads"
        );


      if (!reactionsSheet) {
        throw new Error(
          "Reactions worksheet was not found."
        );
      }

      if (!leadsSheet) {
        throw new Error(
          "Leads worksheet was not found."
        );
      }


      const leadId =
        String(
          data.leadId || ""
        ).trim();

      const activityId =
        String(
          data.activityId || ""
        ).trim();

      const emoji =
        String(
          data.emoji || ""
        ).trim();


      if (!leadId) {
        throw new Error(
          "A lead_id is required."
        );
      }

  assertOperationalLeadById_(leadId);

      if (!activityId) {
        throw new Error(
          "An activity_id is required."
        );
      }

      if (!emoji) {
        throw new Error(
          "A reaction emoji is required."
        );
      }


      const target =
        getActivityById_(
          activityId
        );


      if (!target) {
        throw new Error(
          `Activity not found: ${activityId}`
        );
      }


      if (
        target.leadId !==
        leadId
      ) {
        throw new Error(
          "The selected activity belongs to a different lead."
        );
      }


      const actor =
        getActorIdentity_();


      normalizeReactionActor_(
        actor
      );


      /*
       * Find the current employee's ACTIVE copy.
       */
      const reaction =
        findActiveReaction_(
          activityId,
          emoji,
          actor
        );


      if (!reaction) {
        throw new Error(
          `You do not currently have an active ${emoji} reaction on this activity.`
        );
      }


      if (
        reaction.leadId !==
        leadId
      ) {
        throw new Error(
          "The reaction belongs to a different lead."
        );
      }


      const leadRow =
        findLeadRowById_(
          leadId
        );


      if (!leadRow) {
        throw new Error(
          `Lead not found: ${leadId}`
        );
      }


      const recordedNow =
        new Date();


      const occurredAt =
        data.occurredAt instanceof
          Date
          ? data.occurredAt
          : recordedNow;


      const headers =
        getHeaderMap_(
          "Reactions"
        );


      /*
       * Preserve the historical row.
       */
      withPerf_(
        "Reactions-sheet write",
        function() {
          setCellByHeader_(
            reactionsSheet,
            reaction.row,
            headers,
            "is_active",
            false
          );


          setCellByHeader_(
            reactionsSheet,
            reaction.row,
            headers,
            "removed_at",
            occurredAt
          );


          setCellByHeader_(
            reactionsSheet,
            reaction.row,
            headers,
            "removed_by",
            actor.email ||
            actor.name ||
            "Employee"
          );
        }
      );


      const auditActivityId =
        appendActivity_({
          leadId,

          occurredAt,

          activityType:
            "reaction_removed",

          actorEmail:
            actor.email,

          actorName:
            actor.name,

          activitySource:
            "Employee",

          note:
            `Reaction removed: ${emoji}`,

          parentActivityId:
            activityId,

          systemGenerated:
            false,
        });


      const leadHeaders =
        getHeaderMap_(
          "Leads"
        );


      updateLeadAuditMetadata_(
        leadsSheet,
        leadRow,
        leadHeaders,
        occurredAt,
        recordedNow,
        actor
      );


      return {
        reactionId:
          reaction.reactionId,

        leadId,
        activityId,
        emoji,
        auditActivityId,
      };
    }
  );
}


/**
 * Finds the current employee's active reaction.
 *
 * PHASE 5D:
 * - scans only populated rows
 * - normalizes actor identity
 * - preserves email-first identity semantics
 */
function findActiveReaction_(
  activityId,
  emoji,
  actor
) {
  const perf =
    startPerf_(
      "reaction-row lookup"
    );

  try {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      "Reactions"
    );

  if (!sheet) {
    throw new Error(
      "Reactions worksheet was not found."
    );
  }


  const cleanActivityId =
    String(
      activityId || ""
    ).trim();

  const cleanEmoji =
    String(
      emoji || ""
    ).trim();

  if (
    !cleanActivityId ||
    !cleanEmoji
  ) {
    return null;
  }


  const currentActor =
    normalizeReactionActor_(
      actor
    );


  const headers =
    getHeaderMap_(
      "Reactions"
    );

  const lastRow =
    sheet.getLastRow();

  if (
    lastRow < 2
  ) {
    return null;
  }


  const rows =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        sheet.getLastColumn()
      )
      .getValues();


  for (
    let index = 0;
    index < rows.length;
    index++
  ) {
    const rowValues =
      rows[index];


    const readValue =
      headerName =>
        rowValues[
          headers[
            headerName
          ] - 1
        ];


    const existingActivityId =
      String(
        readValue(
          "activity_id"
        ) || ""
      ).trim();


    const existingEmoji =
      String(
        readValue(
          "emoji"
        ) || ""
      ).trim();


    const existingEmail =
      String(
        readValue(
          "reacted_by_email"
        ) || ""
      )
        .trim()
        .toLowerCase();


    const existingName =
      String(
        readValue(
          "reacted_by_name"
        ) || ""
      )
        .trim()
        .toLowerCase();


    const isActive =
      Boolean(
        readValue(
          "is_active"
        )
      );


    const sameActor =
      currentActor.email
        ? existingEmail ===
          currentActor.email
        : existingName ===
          currentActor.name;


    if (
      existingActivityId ===
        cleanActivityId &&
      existingEmoji ===
        cleanEmoji &&
      sameActor &&
      isActive
    ) {
      return {
        row:
          index + 2,

        reactionId:
          String(
            readValue(
              "reaction_id"
            ) || ""
          ).trim(),

        leadId:
          String(
            readValue(
              "lead_id"
            ) || ""
          ).trim(),

        activityId:
          existingActivityId,

        emoji:
          existingEmoji,
      };
    }
  }


  return null;
  } finally {
    endPerf_(perf);
  }
}


/**
 * Returns the selected comment/reply that can
 * receive a reaction.
 */
function getSelectedReactionTarget_() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getActiveSheet();

  if (
    sheet.getName() !==
    "ActivityLog"
  ) {
    throw new Error(
      'Go to "ActivityLog" and select a comment or reply first.'
    );
  }

  const row =
    sheet
      .getActiveRange()
      .getRow();

  if (row < 2) {
    throw new Error(
      "Select an ActivityLog data row, not the header."
    );
  }

  const headers =
    getHeaderMap_("ActivityLog");

  const activityId =
    sheet
      .getRange(
        row,
        headers.activity_id
      )
      .getDisplayValue()
      .trim();

  const leadId =
    sheet
      .getRange(
        row,
        headers.lead_id
      )
      .getDisplayValue()
      .trim();

  const activityType =
    sheet
      .getRange(
        row,
        headers.activity_type
      )
      .getDisplayValue()
      .trim();

  if (
    !activityId ||
    !leadId
  ) {
    throw new Error(
      "The selected ActivityLog row does not contain a valid activity_id and lead_id."
    );
  }

  if (
    activityType !== "comment" &&
    activityType !== "reply"
  ) {
    throw new Error(
      'Reactions can currently be added only to activities with type "comment" or "reply".'
    );
  }

  return {
    ss,
    sheet,
    row,
    headers,
    activityId,
    leadId,
    activityType,
  };
}

/**
 * PHASE 2J-A
 * Assigns or unassigns the selected lead.
 */
function assignSelectedLead() {
  const context = getSelectedInitializedLead_();

  const {
    ss,
    sheet,
    row,
    headers,
    ui,
  } = context;

  const assignees = getListValues_(
    ss.getSheetByName("Lists"),
    "N2:N20"
  );

  const currentAssignee = sheet
    .getRange(
      row,
      headers.assigned_to
    )
    .getDisplayValue()
    .trim();

  const response = ui.prompt(
    "Assign Lead",
    `Current assignee: ${currentAssignee || "Unassigned"}\n\n` +
      "Enter exactly one of these employee emails:\n\n" +
      assignees.join("\n") +
      "\n\nLeave blank to unassign the lead.",
    ui.ButtonSet.OK_CANCEL
  );

  if (
    response.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const assignedTo =
    response.getResponseText().trim();

  if (
    assignedTo &&
    !assignees.includes(assignedTo)
  ) {
    ui.alert(
      "Invalid Assignee",
      "Enter exactly one of the employee emails from the Assignable Employee list, or leave blank to unassign.",
      ui.ButtonSet.OK
    );
    return;
  }

  const noteResponse = ui.prompt(
    "Assignment Note",
    "Enter an optional note explaining the assignment change.",
    ui.ButtonSet.OK_CANCEL
  );

  if (
    noteResponse.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  let result;

  try {
    result = assignLead_(row, {
      assignedTo,
      note:
        noteResponse
          .getResponseText()
          .trim(),
      occurredAt:
        new Date(),
    });
  } catch (error) {
    ui.alert(
      "Assignment Could Not Be Changed",
      error.message,
      ui.ButtonSet.OK
    );
    return;
  }

  if (!result.changed) {
    ui.alert(
      "No Assignment Change",
      result.assignedTo
        ? `This lead is already assigned to ${result.assignedTo}.`
        : "This lead is already unassigned.",
      ui.ButtonSet.OK
    );
    return;
  }

  ui.alert(
    "Assignment Updated",
    result.assignedTo
      ? `Lead assigned to ${result.assignedTo}.`
      : "Lead is now unassigned.",
    ui.ButtonSet.OK
  );
}


/**
 * Core reusable assignment function.
 */
function assignLead_(
  row,
  data = {}
) {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName("Leads");

  const listsSheet =
    ss.getSheetByName("Lists");

  if (!sheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  if (!listsSheet) {
    throw new Error(
      "Lists worksheet was not found."
    );
  }

  const headers =
    getHeaderMap_("Leads");

  const leadId = sheet
    .getRange(
      row,
      headers.lead_id
    )
    .getDisplayValue()
    .trim();

  if (!leadId) {
    throw new Error(
      `Lead row ${row} does not contain a lead_id.`
    );
  }

  assertOperationalLeadById_(leadId);

  const assignedTo =
    String(
      data.assignedTo || ""
    ).trim();

  /*
   * Repeat validation here so a future Board
   * action cannot bypass the controlled list.
   */
  const allowedAssignees =
    getListValues_(
      listsSheet,
      "N2:N20"
    );

  if (
    assignedTo &&
    !allowedAssignees.includes(
      assignedTo
    )
  ) {
    throw new Error(
      `Invalid assignee: ${assignedTo}`
    );
  }

  const previousAssignee =
    sheet
      .getRange(
        row,
        headers.assigned_to
      )
      .getDisplayValue()
      .trim();

  if (
    previousAssignee ===
    assignedTo
  ) {
    return {
      leadId,
      assignedTo,
      changed: false,
    };
  }

  const actor =
    getActorIdentity_();

  const recordedNow =
    new Date();

  const occurredAt =
    data.occurredAt instanceof Date
      ? data.occurredAt
      : recordedNow;

  setCellByHeader_(
    sheet,
    row,
    headers,
    "assigned_to",
    assignedTo
  );

  const activityId =
    appendActivity_({
      leadId,
      occurredAt,

      activityType:
        "assignment_changed",

      actorEmail:
        actor.email,

      actorName:
        actor.name,

      activitySource:
        "Employee",

      fieldName:
        "assigned_to",

      previousValue:
        previousAssignee,

      newValue:
        assignedTo,

      note:
        data.note || "",

      systemGenerated:
        false,
    });

  updateLeadAuditMetadata_(
    sheet,
    row,
    headers,
    occurredAt,
    recordedNow,
    actor
  );

  return {
    leadId,
    assignedTo,
    previousAssignee,
    activityId,
    changed: true,
  };
}

/**
 * PHASE 2J-B
 * Moves a Scheduled, Case Lost, or Unrelated
 * lead back to Open Lead / Follow Up.
 */
function moveSelectedLeadToOpenFollowUp() {
  const context =
    getSelectedInitializedLead_();

  const {
    sheet,
    row,
    headers,
    ui,
  } = context;

  const currentStatus =
    sheet
      .getRange(
        row,
        headers.status
      )
      .getDisplayValue()
      .trim();

  if (
    currentStatus ===
    "Open Lead / Follow Up"
  ) {
    ui.alert(
      "Already Open",
      'This lead is already in "Open Lead / Follow Up".',
      ui.ButtonSet.OK
    );
    return;
  }

  const allowedStatuses = [
    "Scheduled",
    "Case Lost",
    "Unrelated",
  ];

  if (
    !allowedStatuses.includes(
      currentStatus
    )
  ) {
    ui.alert(
      "Cannot Reopen",
      `Status "${currentStatus}" cannot currently be moved back to Open Lead / Follow Up.`,
      ui.ButtonSet.OK
    );
    return;
  }

  const noteResponse = ui.prompt(
    "Reopen Lead",
    `This will move the lead from "${currentStatus}" back to "Open Lead / Follow Up".\n\nEnter a reason for reopening the lead.`,
    ui.ButtonSet.OK_CANCEL
  );

  if (
    noteResponse.getSelectedButton() !==
    ui.Button.OK
  ) {
    return;
  }

  const note =
    noteResponse
      .getResponseText()
      .trim();

  if (!note) {
    ui.alert(
      "Reopen Reason Required",
      "Enter a note explaining why this lead is being reopened.",
      ui.ButtonSet.OK
    );
    return;
  }

  let result;

  try {
    result =
      moveLeadToOpenFollowUp_(
        row,
        {
          note,
          occurredAt:
            new Date(),
        }
      );
  } catch (error) {
    ui.alert(
      "Lead Could Not Be Reopened",
      error.message,
      ui.ButtonSet.OK
    );
    return;
  }

  ui.alert(
    "Lead Reopened",
    `Lead moved from ${result.previousStatus} to Open Lead / Follow Up.`,
    ui.ButtonSet.OK
  );
}

/**
 * PHASE 3A
 * Opens a read-only patient-detail dialog for the
 * currently selected initialized lead.
 *
 * Temporary launcher:
 * Later the Board will open the same patient-detail
 * experience by lead_id.
 */
/**
 * PHASE 4C
 * Opens Patient Details for one permanent lead_id.
 *
 * This is the shared launcher used by both:
 * - the old Leads-row launcher
 * - the new Board-card launcher
 */
function openPatientDetailByLeadId_(
  leadId
) {
  const perf = startPerf_("openPatientDetailByLeadId_");

  try {
  const cleanLeadId =
    String(
      leadId || ""
    ).trim();

  if (!cleanLeadId) {
    throw new Error(
      "A lead_id is required."
    );
  }


  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const leadsSheet =
    ss.getSheetByName(
      "Leads"
    );

  if (!leadsSheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }


  const row =
    withPerf_(
      "patientDetail lead resolution",
      function() {
        return findLeadRowById_(
          cleanLeadId
        );
      }
    );

  if (!row) {
    throw new Error(
      `Lead not found: ${cleanLeadId}`
    );
  }


  const headers =
    getHeaderMap_(
      "Leads"
    );


  /*
   * Pass 4: open the dialog with core patient
   * fields only. Activity, reactions,
   * attachments, and Drive health load after
   * showModalDialog() so they do not block
   * the initial window.
   */
  const patient =
    buildPatientDetailCoreData_(
      leadsSheet,
      row,
      headers,
      cleanLeadId
    );


  const template =
    withPerf_(
      "PatientDetail template creation",
      function() {
        return HtmlService.createTemplateFromFile(
          "PatientDetail"
        );
      }
    );

  template.patient =
    patient;


  const evaluated =
    withPerf_(
      "PatientDetail template evaluate()",
      function() {
        return template.evaluate();
      }
    );

  const html =
    evaluated
      .setWidth(
        1180
      )
      .setHeight(
        760
      );


  withPerf_(
    "showModalDialog",
    function() {
      SpreadsheetApp
        .getUi()
        .showModalDialog(
          html,
          "Patient Details"
        );
    }
  );
  } finally {
    endPerf_(perf);
  }
}


function openSelectedLeadDetail() {
  const context =
    getSelectedInitializedLead_();

  openPatientDetailByLeadId_(
    context.leadId
  );
}


/**
 * Reads invisible Board-card metadata stored
 * at the Board SHEET level.
 *
 * The selected card's anchor A1 notation is
 * encoded into the metadata key.
 */
function getPatientBoardCardMetadata_(
  cell
) {
  if (!cell) {
    return null;
  }


  const sheet =
    cell.getSheet();


  const metadataKey =
    "PATIENT_BOARD_CARD_" +
    cell.getA1Notation();


  const matches =
    sheet
      .createDeveloperMetadataFinder()
      .withKey(
        metadataKey
      )
      .withLocationType(
        SpreadsheetApp
          .DeveloperMetadataLocationType
          .SHEET
      )
      .find();


  const metadata =
    matches &&
    matches.length > 0
      ? matches[0]
      : null;


  if (!metadata) {
    return null;
  }


  const value =
    String(
      metadata.getValue() || ""
    ).trim();


  if (!value) {
    return null;
  }


  let parsed;

  try {
    parsed =
      JSON.parse(
        value
      );

  } catch (error) {
    throw new Error(
      "The selected Board card contains invalid metadata."
    );
  }


  if (
    !parsed ||
    parsed.type !==
      "patient_board_card" ||
    !String(
      parsed.leadId || ""
    ).trim()
  ) {
    return null;
  }


  return {
    type:
      parsed.type,

    leadId:
      String(
        parsed.leadId
      ).trim(),

    status:
      String(
        parsed.status || ""
      ).trim(),
  };
}


/**
 * Resolves the currently selected Board card.
 *
 * Cards are merged across four columns, so this
 * safely resolves the merged range's top-left cell
 * where the permanent metadata note is stored.
 */
function getSelectedPatientBoardCard_() {
  const perf =
    startPerf_(
      "Board card metadata resolution"
    );

  try {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getActiveSheet();


  if (
    !sheet ||
    sheet.getName() !==
      "Board"
  ) {
    throw new Error(
      'Open the "Board" sheet and select a patient card first.'
    );
  }


  const selection =
    sheet.getSelection();

  const currentCell =
    selection.getCurrentCell();

  if (!currentCell) {
    throw new Error(
      "Select a patient card first."
    );
  }


  let anchorCell =
    currentCell;


  /*
   * A Board card is a merged four-column range.
   * The note lives on its top-left cell.
   */
  const mergedRanges =
    currentCell.getMergedRanges();

  if (
    mergedRanges.length > 0
  ) {
    anchorCell =
      mergedRanges[0]
        .getCell(
          1,
          1
        );
  }


  const metadata =
    getPatientBoardCardMetadata_(
      anchorCell
    );


  if (!metadata) {
    throw new Error(
      "The selected cell is not a patient card. Select one of the patient cards on the Board."
    );
  }


  return {
    sheet,

    anchorCell,

    leadId:
      metadata.leadId,

    boardStatus:
      metadata.status,
  };
  } finally {
    endPerf_(perf);
  }
}


/**
 * Opens Patient Details for the currently selected
 * Board card.
 */
function openSelectedBoardCardDetail() {
  const perf = startPerf_("openSelectedBoardCardDetail");

  try {
  const ui =
    SpreadsheetApp.getUi();

  try {
    const card =
      getSelectedPatientBoardCard_();

    openPatientDetailByLeadId_(
      card.leadId
    );

  } catch (error) {

    const message =
      error &&
      error.message
        ? error.message
        : String(error);


    ui.alert(
      "Open Patient Details",
      message,
      ui.ButtonSet.OK
    );
  }
  } finally {
    endPerf_(perf);
  }
}


/**
 * PHASE 4E
 * Builds the compact data object used by the
 * Board Quick Actions dialog.
 */
function buildBoardQuickActionData_(
  leadId
) {
  const context =
    getLeadContextById_(
      leadId
    );

  const readValue =
    headerName =>
      context.getValue(
        headerName
      );

  const readText =
    headerName =>
      String(
        readValue(
          headerName
        ) || ""
      ).trim();


  const firstName =
    readText(
      "first_name"
    );

  const lastName =
    readText(
      "last_name"
    );


  const patientName =
    [
      firstName,
      lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Unnamed Lead";


  const status =
    readText(
      "status"
    );


  const workflowComplete =
    Boolean(
      readValue(
        "workflow_complete"
      )
    );


  const nextFollowUpOn =
    readValue(
      "next_follow_up_on"
    );


  const options =
    buildPatientDetailActionOptions_();


  return {
    leadId,

    patientName,

    appointmentReason:
      readText(
        "appointment_reason"
      ),

    status,

    workflowComplete,

    assignedTo:
      readText(
        "assigned_to"
      ),

    attemptCount:
      Number(
        readValue(
          "attempt_count"
        )
      ) || 0,

    reachedPatient:
      Boolean(
        readValue(
          "reached_patient"
        )
      ),

    lastContactOutcome:
      readText(
        "last_contact_outcome"
      ),

    nextFollowUpOn:
      formatDateForBoard_(
        nextFollowUpOn
      ),

    nextFollowUpInput:
      formatDateForHtmlInput_(
        nextFollowUpOn
      ),


    /*
     * Assignment stays available regardless of
     * completion state.
     */
    canAssign:
      true,


    /*
     * Completed workflows cannot receive new
     * contact attempts.
     */
    canRecordContactAttempt:
      !workflowComplete,


    /*
     * Follow-up controls are only applicable while
     * actively working the Open lane.
     */
    canManageFollowUp:
      (
        status ===
          "Open Lead / Follow Up" &&
        !workflowComplete
      ),


    options: {
      assignees:
        options.assignees,

      contactMethods:
        options.contactMethods,

      contactOutcomes:
        options.contactOutcomes,
    },
  };
}


/**
 * Opens Quick Actions for the currently selected
 * Board card.
 */
function openSelectedBoardQuickActions() {
  const ui =
    SpreadsheetApp.getUi();

  try {
    const card =
      getSelectedPatientBoardCard_();


    const quick =
      buildBoardQuickActionData_(
        card.leadId
      );


    const template =
      HtmlService
        .createTemplateFromFile(
          "BoardQuickActions"
        );


    template.quick =
      quick;


    const html =
      template
        .evaluate()
        .setWidth(
          620
        )
        .setHeight(
          690
        );


    ui.showModalDialog(
      html,
      "Patient Quick Actions"
    );

  } catch (error) {

    const message =
      error &&
      error.message
        ? error.message
        : String(error);


    ui.alert(
      "Quick Actions",
      message,
      ui.ButtonSet.OK
    );
  }
}


/**
 * Returns the latest compact Quick Action state
 * after a successful Board mutation.
 *
 * Pass 2: the Board/Dashboard rebuild is no
 * longer part of this response. The HTML client
 * dispatches refreshLeadDerivedViewsAfterMutation()
 * after the employee already sees success.
 */
function finishBoardQuickAction_(
  leadId,
  shouldRender = true
) {
  invalidateLeadRowSnapshot_(
    leadId
  );


  /*
   * shouldRender is retained so existing callers
   * keep the same signature. Derived Board
   * rendering is now a secondary request.
   */


  return buildBoardQuickActionData_(
    leadId
  );
}


/**
 * Quick assignment.
 */
function boardQuickAssignLead(
  leadId,
  data = {}
) {
  const perf =
    startPerf_(
      "boardQuickAssignLead"
    );

  try {
  const result =
    patientDetailAssignLead(
      leadId,
      data
    );


  return {
    changed:
      result.changed,

    message:
      result.message,

    data:
      finishBoardQuickAction_(
        leadId,
        result.changed
      ),

    invalidation:
      result.invalidation,
  };
  } finally {
    endPerf_(perf);
  }
}


/**
 * Quick contact attempt.
 */
function boardQuickRecordContactAttempt(
  leadId,
  data = {}
) {
  const perf =
    startPerf_(
      "boardQuickRecordContactAttempt"
    );

  try {
  const result =
    patientDetailRecordContactAttempt(
      leadId,
      data
    );


  return {
    changed:
      true,

    message:
      result.message,

    data:
      finishBoardQuickAction_(
        leadId,
        true
      ),

    invalidation:
      result.invalidation,
  };
  } finally {
    endPerf_(perf);
  }
}


/**
 * Quick set/change follow-up date.
 */
function boardQuickSetFollowUpDate(
  leadId,
  data = {}
) {
  const perf =
    startPerf_(
      "boardQuickSetFollowUpDate"
    );

  try {
  const result =
    patientDetailSetFollowUpDate(
      leadId,
      data
    );


  return {
    changed:
      result.changed,

    message:
      result.message,

    data:
      finishBoardQuickAction_(
        leadId,
        result.changed
      ),

    invalidation:
      result.invalidation,
  };
  } finally {
    endPerf_(perf);
  }
}


/**
 * Quick clear follow-up.
 */
function boardQuickClearFollowUpDate(
  leadId,
  data = {}
) {
  const perf =
    startPerf_(
      "boardQuickClearFollowUpDate"
    );

  try {
  const result =
    patientDetailClearFollowUpDate(
      leadId,
      data
    );


  return {
    changed:
      result.changed,

    message:
      result.message,

    data:
      finishBoardQuickAction_(
        leadId,
        result.changed
      ),

    invalidation:
      result.invalidation,
  };
  } finally {
    endPerf_(perf);
  }
}


/**
 * PHASE 4F
 * Builds the data used by the controlled Board
 * workflow-movement dialog.
 */
function buildBoardMoveData_(
  leadId
) {
  const context =
    getLeadContextById_(
      leadId
    );

  const readValue =
    headerName =>
      context.getValue(
        headerName
      );

  const readText =
    headerName =>
      String(
        readValue(
          headerName
        ) || ""
      ).trim();


  const firstName =
    readText(
      "first_name"
    );

  const lastName =
    readText(
      "last_name"
    );


  const scheduledDate =
    readValue(
      "scheduled_date"
    );

  const nextFollowUpOn =
    readValue(
      "next_follow_up_on"
    );


  const options =
    buildPatientDetailActionOptions_();


  return {
    leadId,

    patientName:
      [
        firstName,
        lastName,
      ]
        .filter(Boolean)
        .join(" ") ||
      "Unnamed Lead",

    appointmentReason:
      readText(
        "appointment_reason"
      ),

    status:
      readText(
        "status"
      ),

    workflowComplete:
      Boolean(
        readValue(
          "workflow_complete"
        )
      ),

    scheduledDate:
      formatDateForBoard_(
        scheduledDate
      ),

    scheduledDateInput:
      formatDateForHtmlInput_(
        scheduledDate
      ),

    scheduleDateMissing:
      Boolean(
        readValue(
          "schedule_date_missing"
        )
      ),

    nextFollowUpOn:
      formatDateForBoard_(
        nextFollowUpOn
      ),

    lostReason:
      readText(
        "lost_reason"
      ),

    unrelatedType:
      readText(
        "unrelated_type"
      ),

    options: {
      caseLostReasons:
        options.caseLostReasons,

      unrelatedTypes:
        options.unrelatedTypes,
    },
  };
}


/**
 * Opens controlled workflow movement for the
 * currently selected Board card.
 */
function openSelectedBoardMoveDialog() {
  const ui =
    SpreadsheetApp.getUi();

  try {
    const card =
      getSelectedPatientBoardCard_();


    const moveData =
      buildBoardMoveData_(
        card.leadId
      );


    const template =
      HtmlService
        .createTemplateFromFile(
          "BoardMoveLead"
        );


    template.moveData =
      moveData;


    const html =
      template
        .evaluate()
        .setWidth(
          640
        )
        .setHeight(
          650
        );


    ui.showModalDialog(
      html,
      "Move Patient"
    );

  } catch (error) {

    const message =
      error &&
      error.message
        ? error.message
        : String(error);


    ui.alert(
      "Move Patient",
      message,
      ui.ButtonSet.OK
    );
  }
}


/**
 * Refreshes the two derived staff-facing views
 * after a workflow-status mutation.
 *
 * Pass 2: this private helper remains as the
 * combined Board + Dashboard rebuild used by
 * older call sites. Pass 2.5 coalesced refreshes
 * call renderPatientBoard() and
 * refreshDashboardData() separately under the
 * shared derived-view lock.
 *
 * IMPORTANT:
 * The canonical Leads mutation has already succeeded
 * before this function runs, so a view-refresh failure
 * should not make the employee think the lead mutation
 * itself failed.
 */
function refreshLeadViewsAfterWorkflowChange_() {
  const perf = startPerf_("refreshLeadViewsAfterWorkflowChange_");

  try {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const originalSheet =
    ss.getActiveSheet();

  const warnings = [];


  /*
   * Rebuild Board from canonical Leads data.
   */
  try {
    renderPatientBoard();

  } catch (error) {

    console.error(
      "Board refresh after workflow change failed:",
      error
    );

    warnings.push(
      "Board could not be refreshed automatically."
    );
  }


  /*
   * renderPatientBoard() activates the Board.
   * Restore the user's original worksheet when
   * appropriate.
   */
  try {
    if (
      originalSheet &&
      originalSheet.getName() !==
        "Board"
    ) {
      originalSheet.activate();
    }

  } catch (error) {
    console.error(
      "Could not restore active worksheet:",
      error
    );
  }


  /*
   * Rebuild DashboardData + visible analytics.
   */
  try {
    refreshDashboardData();

  } catch (error) {

    console.error(
      "Dashboard refresh after workflow change failed:",
      error
    );

    warnings.push(
      "Dashboard could not be refreshed automatically."
    );
  }


  return {
    refreshed:
      warnings.length === 0,

    warnings,
  };
  } finally {
    endPerf_(perf);
  }
}


/**
 * Server-owned invalidation flags for secondary
 * Patient Detail / Board / Dashboard refreshes.
 *
 * HTML must not infer these dependencies.
 * changed === false always yields a no-op set.
 */
function buildLeadViewInvalidation_(
  changed,
  flags
) {
  const perf =
    startPerf_(
      "derived invalidation decision"
    );

  try {
    const source =
      flags || {};

    const invalidation = {
      board: false,
      dashboard: false,
      activity: false,
      attachments: false,
    };

    if (changed) {
      invalidation.board =
        Boolean(source.board);

      invalidation.dashboard =
        Boolean(source.dashboard);

      invalidation.activity =
        Boolean(source.activity);

      invalidation.attachments =
        Boolean(source.attachments);
    }

    console.log(
      `[PERF] derived invalidation: board=${invalidation.board} dashboard=${invalidation.dashboard} activity=${invalidation.activity} attachments=${invalidation.attachments}`
    );

    return invalidation;

  } finally {
    endPerf_(perf);
  }
}


function attachLeadViewInvalidation_(
  payload,
  flags
) {
  const result =
    payload || {};

  result.invalidation =
    buildLeadViewInvalidation_(
      result.changed !== false,
      flags
    );

  if (
    result.invalidation.board ||
    result.invalidation.dashboard
  ) {
    try {
      registerDerivedViewDirtyFlags_(
        result.invalidation
      );

    } catch (error) {
      console.error(
        "Derived-view dirty flag registration failed after a successful mutation:",
        error
      );
    }
  }

  return result;
}


/**
 * Accepts only explicit Board/Dashboard booleans
 * from a prior server mutation response.
 */
function sanitizeDerivedViewInvalidation_(
  invalidation
) {
  const source =
    invalidation || {};

  return {
    board:
      source.board === true,

    dashboard:
      source.dashboard === true,
  };
}


function getDerivedViewDirtyProperties_() {
  return PropertiesService
    .getDocumentProperties();
}


/**
 * OR-merge dirty flags without holding the
 * rebuild lock. Mutations must not wait for a
 * 20–30 second Board/Dashboard rebuild just to
 * record that canonical data changed.
 *
 * Independent keys are used so two concurrent
 * setProperty calls cannot overwrite each other
 * the way a single JSON blob could.
 */
function registerDerivedViewDirtyFlags_(
  flags
) {
  const perf =
    startPerf_(
      "derived view dirty flag registration"
    );

  try {
    const source =
      flags || {};

    const props =
      getDerivedViewDirtyProperties_();

    if (source.board) {
      props.setProperty(
        DERIVED_VIEW_DIRTY_BOARD_KEY_,
        "1"
      );
    }

    if (source.dashboard) {
      props.setProperty(
        DERIVED_VIEW_DIRTY_DASHBOARD_KEY_,
        "1"
      );
    }

  } finally {
    endPerf_(perf);
  }
}


/**
 * Snapshot then clear only the flags that were
 * set. Must run while the rebuild lock is held.
 *
 * Concurrency:
 * - A mutation that sets a flag after this
 *   snapshot is preserved for the next loop.
 * - Clearing only snapshotted keys avoids wiping
 *   a flag that appeared between get and set.
 */
function snapshotAndClearDerivedViewDirtyFlags_() {
  const props =
    getDerivedViewDirtyProperties_();

  const board =
    props.getProperty(
      DERIVED_VIEW_DIRTY_BOARD_KEY_
    ) === "1";

  const dashboard =
    props.getProperty(
      DERIVED_VIEW_DIRTY_DASHBOARD_KEY_
    ) === "1";

  if (board) {
    props.setProperty(
      DERIVED_VIEW_DIRTY_BOARD_KEY_,
      "0"
    );
  }

  if (dashboard) {
    props.setProperty(
      DERIVED_VIEW_DIRTY_DASHBOARD_KEY_,
      "0"
    );
  }

  return {
    board,
    dashboard,
  };
}


/**
 * Waits for the shared Board/Dashboard rebuild
 * lock instead of abandoning the refresh.
 *
 * A later mutation must still refresh after an
 * earlier rebuild finishes so the final views
 * reflect the newest canonical Leads data.
 */
function waitForDerivedViewRefreshLock_(
  lock,
  reason
) {
  const label =
    reason
      ? `derived view lock wait ${reason}`
      : "refreshLeadDerivedViewsAfterMutation lock wait";

  const waitPerf =
    startPerf_(
      label
    );

  try {
    const deadline =
      Date.now() +
      DERIVED_VIEW_REFRESH_LOCK_WAIT_MS_;

    while (true) {
      const remaining =
        deadline -
        Date.now();

      if (remaining <= 0) {
        throw new Error(
          "Timed out waiting to refresh Board and Dashboard."
        );
      }

      try {
        lock.waitLock(
          Math.min(
            30000,
            remaining
          )
        );

        return true;

      } catch (error) {

        if (
          Date.now() >=
          deadline
        ) {
          throw error;
        }
      }
    }

  } finally {
    endPerf_(waitPerf);
  }
}


/**
 * Same-execution reentrancy for the derived-view
 * script lock.
 *
 * Script locks are not reentrant. The coalescer
 * holds the lock and then calls renderPatientBoard()
 * / refreshDashboardData(). Menu-initiated calls
 * of those same public functions must also wait
 * on this lock so they cannot rewrite Board or
 * Dashboard at the same time as a background
 * rebuild.
 */
function enterDerivedViewWriteSection_(
  reason
) {
  if (
    EXECUTION_CACHE_
      .derivedViewLockHeld
  ) {
    return {
      acquired: false,
      lock: null,
    };
  }

  const lock =
    LockService.getScriptLock();

  waitForDerivedViewRefreshLock_(
    lock,
    reason
  );

  EXECUTION_CACHE_
    .derivedViewLockHeld = true;

  return {
    acquired: true,
    lock,
  };
}


function exitDerivedViewWriteSection_(
  state
) {
  if (
    !state ||
    !state.acquired ||
    !state.lock
  ) {
    return;
  }

  try {
    EXECUTION_CACHE_
      .derivedViewLockHeld = false;

    state.lock.releaseLock();

  } catch (error) {
    console.error(
      "Derived-view lock release failed:",
      error
    );
  }
}


function restoreSheetAfterBoardRefresh_(
  originalSheet
) {
  try {
    if (
      originalSheet &&
      originalSheet.getName() !==
        "Board"
    ) {
      recordDerivedViewUiEffect_(
        "restore-sheet"
      );

      originalSheet.activate();
    }

  } catch (error) {
    console.error(
      "Could not restore active worksheet:",
      error
    );
  }
}


/*
 * Manual callers keep activate / selection /
 * toast / sheet restore. background: true is the
 * time-driven path and turns all four off.
 */
function normalizeDerivedViewUiOptions_(
  options
) {
  const source =
    options || {};

  if (source.background === true) {
    return {
      background: true,
      activate: false,
      preserveSelection: false,
      showToast: false,
      restoreActiveSheet: false,
    };
  }

  return {
    background: false,
    activate:
      source.activate !== false,
    preserveSelection:
      source.preserveSelection !== false,
    showToast:
      source.showToast !== false,
    restoreActiveSheet:
      source.restoreActiveSheet !== false,
  };
}


function recordDerivedViewUiEffect_(
  effect
) {
  const log =
    EXECUTION_CACHE_
      .derivedViewUiEffects;

  if (
    !log ||
    typeof log.push !== "function"
  ) {
    return;
  }

  log.push(
    String(
      effect || ""
    )
  );
}


function logDerivedViewOperationalError_(
  label,
  error
) {
  let name = "Error";

  if (
    error &&
    error.name
  ) {
    name =
      String(
        error.name
      );
  }

  name = name
    .replace(
      /[^\w]/g,
      ""
    )
    .slice(
      0,
      40
    );

  if (!name) {
    name = "Error";
  }

  console.error(
    String(
      label ||
        "Derived-view refresh failed"
    ) +
      " name=" +
      name
  );
}


function reportDerivedViewRefreshFailure_(
  label,
  error,
  background
) {
  if (background) {
    logDerivedViewOperationalError_(
      label,
      error
    );

    return;
  }

  console.error(
    label,
    error
  );
}


function readDerivedViewDirtyFlags_() {
  const props =
    getDerivedViewDirtyProperties_();

  return {
    board:
      props.getProperty(
        DERIVED_VIEW_DIRTY_BOARD_KEY_
      ) === "1",

    dashboard:
      props.getProperty(
        DERIVED_VIEW_DIRTY_DASHBOARD_KEY_
      ) === "1",
  };
}


function rebuildDirtyDerivedViews_(
  dirty,
  options
) {
  const ui =
    normalizeDerivedViewUiOptions_(
      options
    );

  const warnings = [];
  let originalSheet = null;

  if (ui.restoreActiveSheet) {
    const ss =
      SpreadsheetApp.getActiveSpreadsheet();

    originalSheet =
      ss.getActiveSheet();
  }

  if (dirty.board) {
    try {
      renderPatientBoard(
        ui
      );

    } catch (error) {
      reportDerivedViewRefreshFailure_(
        "Board refresh after workflow change failed:",
        error,
        ui.background
      );

      warnings.push(
        "Board could not be refreshed automatically."
      );
    }

    if (ui.restoreActiveSheet) {
      restoreSheetAfterBoardRefresh_(
        originalSheet
      );
    }

    /*
     * Archive is another derived view. It rides
     * the existing Board dirty refresh and does
     * not install a second rebuild loop.
     */
    try {
      if (
        typeof refreshPatientArchiveView_ ===
        "function"
      ) {
        refreshPatientArchiveView_({
          background: true,
        });
      }
    } catch (error) {
      reportDerivedViewRefreshFailure_(
        "Archive refresh after workflow change failed:",
        error,
        ui.background
      );
    }
  }

  if (dirty.dashboard) {
    try {
      refreshDashboardData();

    } catch (error) {
      reportDerivedViewRefreshFailure_(
        "Dashboard refresh after workflow change failed:",
        error,
        ui.background
      );

      warnings.push(
        "Dashboard could not be refreshed automatically."
      );
    }
  }

  return warnings;
}


/**
 * Pass 2.5 coalesced rebuild loop.
 *
 * 1. Caller already OR-merged dirty flags.
 * 2. Acquire the shared rebuild lock.
 * 3. Snapshot/clear current dirty flags.
 * 4. Rebuild only those views.
 * 5. If new dirty flags appeared during the
 *    rebuild, loop once more.
 * 6. Exit when no dirty views remain.
 *
 * Mutations never hold this lock, so registering
 * a new dirty flag during a rebuild cannot stall
 * the employee's save path.
 */
function runDerivedViewRefreshLoop_(
  options
) {
  const ui =
    normalizeDerivedViewUiOptions_(
      options
    );

  const lockState =
    enterDerivedViewWriteSection_(
      "coalesced"
    );

  let passCount = 0;
  let boardRebuilds = 0;
  let dashboardRebuilds = 0;
  const warnings = [];

  try {
    while (true) {
      const dirty =
        snapshotAndClearDerivedViewDirtyFlags_();

      if (
        !dirty.board &&
        !dirty.dashboard
      ) {
        break;
      }

      passCount += 1;

      if (dirty.board) {
        boardRebuilds += 1;
      }

      if (dirty.dashboard) {
        dashboardRebuilds += 1;
      }

      const passLabel =
        dirty.board &&
        dirty.dashboard
          ? "combined refresh"
          : (
              dirty.board
                ? "Board-only refresh"
                : "Dashboard-only refresh"
            );

      const passPerf =
        startPerf_(
          `derived view ${passLabel}`
        );

      try {
        const passWarnings =
          rebuildDirtyDerivedViews_(
            dirty,
            ui
          );

        passWarnings.forEach(
          warning => {
            warnings.push(
              warning
            );
          }
        );

      } finally {
        endPerf_(passPerf);
      }
    }

    console.log(
      `[PERF] derived view coalesced passes: ${passCount} boardRebuilds=${boardRebuilds} dashboardRebuilds=${dashboardRebuilds}`
    );

    return {
      refreshed:
        warnings.length === 0,

      warnings,

      passes:
        passCount,

      boardRebuilds,

      dashboardRebuilds,
    };

  } finally {
    exitDerivedViewWriteSection_(
      lockState
    );
  }
}


/**
 * HTML-callable Pass 2.5 endpoint.
 *
 * Rebuilds Board, Dashboard, or both based on
 * server-issued invalidation flags. Pending dirty
 * views from other mutations are coalesced into
 * as few locked rebuilds as possible.
 *
 * Do not call trailing-underscore helpers
 * directly from google.script.run.
 */
function refreshLeadDerivedViewsAfterMutation(
  invalidation
) {
  const perf =
    startPerf_(
      "refreshLeadDerivedViewsAfterMutation"
    );

  try {
    const sanitized =
      sanitizeDerivedViewInvalidation_(
        invalidation
      );

    if (
      sanitized.board ||
      sanitized.dashboard
    ) {
      registerDerivedViewDirtyFlags_(
        sanitized
      );
    }

    return runDerivedViewRefreshLoop_();

  } finally {
    endPerf_(perf);
  }
}


/*
 * Bound-script time trigger.
 *
 * A container-bound project can call
 * getActiveSpreadsheet() from an installable
 * trigger and receive the parent spreadsheet.
 * This handler does not store a spreadsheet ID.
 *
 * Dirty flags are read first. A clean minute
 * returns before the rebuild lock and does not
 * render Board or Dashboard. A dirty minute uses
 * the existing coalesced lock loop, with UI
 * activation, selection, and toasts disabled.
 *
 * Install this from the bound project as the
 * Workspace user that should own the trigger.
 */
function refreshDirtyDerivedViewsScheduled() {
  try {
    const pending =
      readDerivedViewDirtyFlags_();

    if (
      !pending.board &&
      !pending.dashboard
    ) {
      return {
        skipped: true,
        refreshed: true,
        warnings: [],
        passes: 0,
        boardRebuilds: 0,
        dashboardRebuilds: 0,
      };
    }

    const result =
      runDerivedViewRefreshLoop_({
        background: true,
      });

    result.skipped = false;

    return result;

  } catch (error) {
    logDerivedViewOperationalError_(
      "Scheduled derived-view refresh failed",
      error
    );

    return {
      skipped: false,
      refreshed: false,
      warnings: [
        "Scheduled refresh failed.",
      ],
      passes: 0,
      boardRebuilds: 0,
      dashboardRebuilds: 0,
    };
  }
}


function listDerivedViewAutoRefreshTriggers_() {
  const handler =
    DERIVED_VIEW_AUTO_REFRESH_HANDLER_;

  const triggers =
    ScriptApp.getProjectTriggers();

  const matches = [];

  for (
    let index = 0;
    index < triggers.length;
    index++
  ) {
    if (
      triggers[index]
        .getHandlerFunction() ===
      handler
    ) {
      matches.push(
        triggers[index]
      );
    }
  }

  return matches;
}


/*
 * Installs one 1-minute trigger for
 * refreshDirtyDerivedViewsScheduled.
 *
 * Safe to run twice as the same user: a second
 * run does not add another trigger for this
 * handler. Triggers for other handlers are not
 * deleted.
 *
 * Apps Script only lists triggers owned by the
 * user who is running this helper. Run it once
 * as the clinic Workspace identity that should
 * own the production trigger. No script property
 * and no spreadsheet ID are required.
 */
function installDerivedViewAutoRefreshTrigger() {
  const existing =
    listDerivedViewAutoRefreshTriggers_();

  for (
    let index = existing.length - 1;
    index >= 1;
    index--
  ) {
    ScriptApp.deleteTrigger(
      existing[index]
    );
  }

  if (existing.length >= 1) {
    return {
      ok: true,
      created: false,
      handler:
        DERIVED_VIEW_AUTO_REFRESH_HANDLER_,
      count: 1,
    };
  }

  ScriptApp
    .newTrigger(
      DERIVED_VIEW_AUTO_REFRESH_HANDLER_
    )
    .timeBased()
    .everyMinutes(
      DERIVED_VIEW_AUTO_REFRESH_MINUTES_
    )
    .create();

  return {
    ok: true,
    created: true,
    handler:
      DERIVED_VIEW_AUTO_REFRESH_HANDLER_,
    count: 1,
  };
}


/*
 * Removes only triggers for
 * refreshDirtyDerivedViewsScheduled that are
 * owned by the user running this helper.
 */
function removeDerivedViewAutoRefreshTrigger() {
  const existing =
    listDerivedViewAutoRefreshTriggers_();

  for (
    let index = 0;
    index < existing.length;
    index++
  ) {
    ScriptApp.deleteTrigger(
      existing[index]
    );
  }

  return {
    ok: true,
    removed:
      existing.length,
    handler:
      DERIVED_VIEW_AUTO_REFRESH_HANDLER_,
    count: 0,
  };
}


/**
 * Performs one controlled Board lane action.
 *
 * Scheduled uses the dedicated scheduling workflow.
 * The other three destinations use the existing
 * workflow-movement bridge.
 */
function boardMoveLead(
  leadId,
  data = {}
) {
  const perf = startPerf_("boardMoveLead");

  try {
  const targetStatus =
    String(
      data.targetStatus || ""
    ).trim();


  const allowedTargets = [
    "Open Lead / Follow Up",
    "Scheduled",
    "Case Lost",
    "Unrelated",
  ];


  if (
    !allowedTargets.includes(
      targetStatus
    )
  ) {
    throw new Error(
      "Select a valid workflow destination."
    );
  }


  let result;


  /*
   * SCHEDULED
   */
  if (
    targetStatus ===
    "Scheduled"
  ) {
    result =
      patientDetailScheduleLead(
        leadId,
        {
          scheduledDateText:
            String(
              data.scheduledDateText ||
              ""
            ).trim(),

          note:
            String(
              data.note || ""
            ).trim(),
        }
      );

  } else {

    /*
     * OPEN / CASE LOST / UNRELATED
     */
    result =
      patientDetailMoveWorkflow(
        leadId,
        {
          targetStatus,

          reason:
            String(
              data.reason || ""
            ).trim(),

          unrelatedType:
            String(
              data.unrelatedType ||
              ""
            ).trim(),

          note:
            String(
              data.note || ""
            ).trim(),
        }
      );
  }


  return {
    changed:
      Boolean(
        result.changed
      ),

    message:
      result.message,

    data:
      buildBoardMoveData_(
        leadId
      ),

    invalidation:
      result.invalidation,
  };
  } finally {
    endPerf_(perf);
  }
}


/**
 * Builds the data needed to render the initial
 * Patient Details dialog shell and core fields.
 *
 * This includes canonical patient, workflow,
 * source, and action options. It does not
 * build the activity timeline, reaction state,
 * attachments, or live Drive health.
 */
function buildPatientDetailCoreData_(
  sheet,
  row,
  headers,
  leadId
) {
  const perf =
    startPerf_(
      "patientDetail core data"
    );

  try {
  const snapshot =
    withPerf_(
      "patientDetail core Leads-row read",
      function() {
        return readLeadRowSnapshot_(
          sheet,
          row,
          headers
        );
      }
    );

  rememberLeadRowSnapshot_(
    leadId,
    snapshot
  );

  const accessors =
    getLeadRowAccessors_(
      headers,
      snapshot.values,
      snapshot.display
    );

  const getDisplay =
    accessors.getDisplay;

  const getValue =
    accessors.getValue;

  const createdAt =
    getValue("created_at");

  const firstAttemptAt =
    getValue("first_attempt_at");

  const lastAttemptAt =
    getValue("last_attempt_at");

  const nextFollowUpOn =
    getValue("next_follow_up_on");

  const scheduledDate =
    getValue("scheduled_date");

  const completedAt =
    getValue("completed_at");

  const lastActivityAt =
    getValue("last_activity_at");

  return {
    leadId,

    patient: {
      firstName:
        getDisplay("first_name"),

      lastName:
        getDisplay("last_name"),

      phone:
        getDisplay("phone"),

      email:
        getDisplay("email"),

      appointmentReason:
        getDisplay(
          "appointment_reason"
        ),

      preferredContactMethod:
        getDisplay(
          "preferred_contact_method"
        ),

      preferredContactTime:
        getDisplay(
          "preferred_contact_time"
        ),

      smsConsent:
        Boolean(
          getValue("sms_consent")
        )
          ? "Yes"
          : "No",

      message:
        getDisplay("message"),
    },

    workflow: {
      status:
        getDisplay("status"),

      assignedTo:
        getDisplay("assigned_to"),

      attemptCount:
        Number(
          getValue("attempt_count")
        ) || 0,

      reachedPatient:
        Boolean(
          getValue("reached_patient")
        )
          ? "Yes"
          : "No",

      lastContactOutcome:
        getDisplay(
          "last_contact_outcome"
        ),

      firstAttemptAt:
        formatDateTimeForPatientDetail_(
          firstAttemptAt
        ),

      lastAttemptAt:
        formatDateTimeForPatientDetail_(
          lastAttemptAt
        ),

      nextFollowUpOn:
        formatDateForAudit_(
          nextFollowUpOn
        ),

      nextFollowUpInput:
        formatDateForHtmlInput_(
          nextFollowUpOn
        ),

      scheduledDate:
        formatDateForAudit_(
          scheduledDate
        ),

      scheduledDateInput:
        formatDateForHtmlInput_(
          scheduledDate
        ),

      scheduleDateMissing:
        Boolean(
          getValue(
            "schedule_date_missing"
          )
        ),

      scheduledDateNote:
        getDisplay(
          "scheduled_date_note"
        ),

      workflowComplete:
        Boolean(
          getValue(
            "workflow_complete"
          )
        )
          ? "Yes"
          : "No",

      completedAt:
        formatDateTimeForPatientDetail_(
          completedAt
        ),

      completedBy:
        getDisplay("completed_by"),

      lostReason:
        getDisplay("lost_reason"),

      unrelatedType:
        getDisplay("unrelated_type"),
    },

    source: {
      intakeSource:
        getDisplay("intake_source"),

      pageName:
        getDisplay("page_name"),

      sourcePath:
        getDisplay("source_path"),

      utmSource:
        getDisplay("utm_source"),

      utmMedium:
        getDisplay("utm_medium"),

      utmCampaign:
        getDisplay("utm_campaign"),

      createdAt:
        formatDateTimeForPatientDetail_(
          createdAt
        ),

      createdBy:
        getDisplay("created_by"),

      lastActivityAt:
        formatDateTimeForPatientDetail_(
          lastActivityAt
        ),
    },

    archive:
      buildLeadArchiveDetail_(
        headers,
        getValue,
        getDisplay
      ),

    options:
      buildPatientDetailActionOptions_(),
  };
  } finally {
    endPerf_(perf);
  }
}


/**
 * Builds the read-only data object used by the
 * Patient Detail interface.
 *
 * Keeping the UI data construction separate from
 * openSelectedLeadDetail() will make it easier for
 * the future Board to reuse this interface.
 *
 * This full helper still includes activity and
 * attachments. The Patient Details open path uses
 * buildPatientDetailCoreData_() instead so those
 * secondary surfaces can load asynchronously.
 */
function buildPatientDetailData_(
  sheet,
  row,
  headers,
  leadId
) {
  const perf = startPerf_("buildPatientDetailData_");

  try {
  const patient =
    buildPatientDetailCoreData_(
      sheet,
      row,
      headers,
      leadId
    );

  patient.activity =
    buildPatientActivityTimeline_(
      leadId
    );

  patient.attachments =
    buildPatientAttachments_(
      leadId
    );

  return patient;
  } finally {
    endPerf_(perf);
  }
}


/**
 * Formats timestamps for display inside the
 * Patient Detail interface.
 *
 * Returns blank if the field does not contain
 * a valid Date.
 */
function formatDateTimeForPatientDetail_(
  date
) {
  if (
    !(date instanceof Date) ||
    isNaN(date.getTime())
  ) {
    return "";
  }

  return Utilities.formatDate(
    date,
    getConfiguredTimezoneWithFallback_(),
    "MM/dd/yyyy h:mm a"
  );
}


/**
 * Formats a canonical Sheet Date for an
 * HTML <input type="date"> value.
 */
function formatDateForHtmlInput_(
  date
) {
  if (
    !(date instanceof Date) ||
    isNaN(date.getTime())
  ) {
    return "";
  }

  return Utilities.formatDate(
    date,
    getConfiguredTimezoneWithFallback_(),
    "yyyy-MM-dd"
  );
}


/**
 * Converts the YYYY-MM-DD string produced by an
 * HTML date input into the existing canonical
 * date parser.
 *
 * google.script.run should receive strings,
 * not browser Date objects.
 */
function parseHtmlDateForPatientDetail_(
  text,
  fieldLabel = "Date"
) {
  const value =
    String(
      text || ""
    ).trim();

  if (!value) {
    return null;
  }

  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value
    );

  if (!match) {
    throw new Error(
      `${fieldLabel} must be a valid date.`
    );
  }

  return parseUsDate_(
    `${match[2]}/${match[3]}/${match[1]}`
  );
}


/**
 * PHASE 3E / PHASE 5B
 *
 * Builds attachment records for Patient Detail
 * and verifies current Drive availability.
 */
function buildPatientAttachments_(
  leadId
) {
  const perf = startPerf_("buildPatientAttachments_");

  try {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  const sheet =
    ss.getSheetByName(
      "Attachments"
    );


  if (!sheet) {
    throw new Error(
      "Attachments worksheet was not found."
    );
  }


  const headers =
    getHeaderMap_(
      "Attachments"
    );


  const lastRow =
    sheet.getLastRow();


  if (lastRow < 2) {
    endPerf_({
      label:
        "buildPatientAttachments_ Drive inspection",
      startedAt:
        Date.now(),
    });

    return [];
  }


  const rows =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        sheet.getLastColumn()
      )
      .getValues();


  const readValue = (
    rowValues,
    headerName
  ) =>
    rowValues[
      headers[
        headerName
      ] - 1
    ];


  const readText = (
    rowValues,
    headerName
  ) =>
    String(
      readValue(
        rowValues,
        headerName
      ) || ""
    ).trim();


  const attachments = [];
  let driveInspectionMs = 0;


  rows.forEach(
    rowValues => {

      const rowLeadId =
        readText(
          rowValues,
          "lead_id"
        );


      const attachmentId =
        readText(
          rowValues,
          "attachment_id"
        );


      if (
        !attachmentId ||
        rowLeadId !==
          leadId
      ) {
        return;
      }


      const uploadedAtValue =
        readValue(
          rowValues,
          "uploaded_at"
        );


      const fileSizeBytes =
        Number(
          readValue(
            rowValues,
            "file_size_bytes"
          )
        ) || 0;


      const driveFileId =
        readText(
          rowValues,
          "drive_file_id"
        );


      /*
       * Stored values are the historical snapshot
       * from the moment the file was attached.
       */
      const storedFileName =
        readText(
          rowValues,
          "file_name"
        );


      const storedFileUrl =
        readText(
          rowValues,
          "file_url"
        );


      const storedMimeType =
        readText(
          rowValues,
          "mime_type"
        );


      /*
       * Live Drive state.
       */
      const driveStarted =
        Date.now();

      const health =
        inspectDriveAttachmentFile_(
          driveFileId
        );

      driveInspectionMs +=
        Date.now() -
        driveStarted;


      const displayFileName =
        health.fileName ||
        storedFileName ||
        "Unavailable Drive file";


      const openUrl =
        health.available
          ? health.fileUrl
          : "";


      /*
       * A rename or changed file does not invalidate
       * the historical attachment record.
       *
       * We merely tell the employee the current Drive
       * metadata differs from the stored snapshot.
       */
      const metadataChanged =
        Boolean(
          health.available &&
          (
            (
              storedFileName &&
              health.fileName &&
              storedFileName !==
                health.fileName
            ) ||
            (
              storedMimeType &&
              health.mimeType &&
              storedMimeType !==
                health.mimeType
            ) ||
            (
              fileSizeBytes > 0 &&
              health.fileSizeBytes > 0 &&
              fileSizeBytes !==
                health.fileSizeBytes
            )
          )
        );


      attachments.push({
        attachmentId,


        activityId:
          readText(
            rowValues,
            "activity_id"
          ),


        uploadedAt:
          formatDateTimeForPatientDetail_(
            uploadedAtValue
          ),


        uploadedSortTime:
          uploadedAtValue instanceof
            Date &&
          !isNaN(
            uploadedAtValue.getTime()
          )
            ? uploadedAtValue
                .getTime()
            : 0,


        uploadedBy:
          readText(
            rowValues,
            "uploaded_by"
          ),


        /*
         * Historical attachment snapshot
         */
        fileName:
          storedFileName,

        fileUrl:
          storedFileUrl,

        mimeType:
          storedMimeType,

        fileSizeBytes,

        fileSize:
          formatPatientAttachmentSize_(
            fileSizeBytes
          ),


        driveFileId,


        description:
          readText(
            rowValues,
            "description"
          ),


        /*
         * Live Drive state
         */
        fileAvailable:
          Boolean(
            health.available
          ),

        fileHealthState:
          health.state,

        fileHealthMessage:
          health.message,

        displayFileName,

        openUrl,

        metadataChanged,

        currentMimeType:
          health.mimeType,

        currentFileSizeBytes:
          Number(
            health.fileSizeBytes
          ) || 0,

        currentFileSize:
          formatPatientAttachmentSize_(
            health.fileSizeBytes
          ),
      });
    }
  );


  attachments.sort(
    (a, b) =>
      b.uploadedSortTime -
      a.uploadedSortTime
  );


  endPerf_({
    label:
      "buildPatientAttachments_ Drive inspection",
    startedAt:
      Date.now() -
      driveInspectionMs,
  });


  return attachments;
  } finally {
    endPerf_(perf);
  }
}


/**
 * Human-readable attachment size.
 */
function formatPatientAttachmentSize_(
  bytes
) {
  const size =
    Number(bytes) || 0;

  if (size <= 0) {
    return "";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return (
      (
        size / 1024
      ).toFixed(1) +
      " KB"
    );
  }

  return (
    (
      size /
      (
        1024 *
        1024
      )
    ).toFixed(1) +
    " MB"
  );
}


/**
 * PHASE 3F
 * Builds active reaction counts for one lead.
 *
 * Returns every configured emoji for every
 * conversation activity, including whether the
 * current employee has that reaction active.
 */
function buildPatientReactionState_(
  leadId
) {
  const perf = startPerf_("buildPatientReactionState_");

  try {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const reactionsSheet =
    ss.getSheetByName(
      "Reactions"
    );

  if (!reactionsSheet) {
    throw new Error(
      "Reactions worksheet was not found."
    );
  }


  const allowedEmojis =
    getAllowedReactionEmojis_();

  const actor =
    getActorIdentity_();

  const normalizedActor =
    normalizeReactionActor_(
      actor
    );

  const byActivity = {};


  const lastRow =
    reactionsSheet.getLastRow();

  if (lastRow >= 2) {
    const headers =
      getHeaderMap_(
        "Reactions"
      );

    const rows =
      reactionsSheet
        .getRange(
          2,
          1,
          lastRow - 1,
          reactionsSheet.getLastColumn()
        )
        .getValues();


    const readValue = (
      rowValues,
      headerName
    ) =>
      rowValues[
        headers[headerName] - 1
      ];


    rows.forEach(
      rowValues => {
        const rowLeadId =
          String(
            readValue(
              rowValues,
              "lead_id"
            ) || ""
          ).trim();

        const activityId =
          String(
            readValue(
              rowValues,
              "activity_id"
            ) || ""
          ).trim();

        const emoji =
          String(
            readValue(
              rowValues,
              "emoji"
            ) || ""
          ).trim();

        const reactedByEmail =
          String(
            readValue(
              rowValues,
              "reacted_by_email"
            ) || ""
          ).trim();

        const reactedByName =
          String(
            readValue(
              rowValues,
              "reacted_by_name"
            ) || ""
          ).trim();

        const isActive =
          Boolean(
            readValue(
              rowValues,
              "is_active"
            )
          );


        if (
          rowLeadId !== leadId ||
          !activityId ||
          !emoji ||
          !isActive
        ) {
          return;
        }


        if (!byActivity[activityId]) {
          byActivity[activityId] = {};
        }

        if (
          !byActivity[
            activityId
          ][emoji]
        ) {
          byActivity[
            activityId
          ][emoji] = {
            count: 0,
            reactedByMe: false,
          };
        }


        byActivity[
          activityId
        ][emoji].count += 1;


        const sameActor =
          normalizedActor.email
            ? reactedByEmail
                .toLowerCase() ===
              normalizedActor.email
            : reactedByName
                .toLowerCase() ===
              normalizedActor.name;

        if (sameActor) {
          byActivity[
            activityId
          ][emoji].reactedByMe =
            true;
        }
      }
    );
  }


  return {
    allowedEmojis,
    byActivity,
  };
  } finally {
    endPerf_(perf);
  }
}


/**
 * Builds active reaction chips for one activity.
 *
 * Used after a reaction toggle so Patient Details
 * can update that item without rebuilding the
 * full timeline.
 */
function buildActivityReactionState_(
  leadId,
  activityId
) {
  const perf =
    startPerf_(
      "target-activity reaction-state construction"
    );

  try {
    const cleanLeadId =
      String(
        leadId || ""
      ).trim();

    const cleanActivityId =
      String(
        activityId || ""
      ).trim();

    const allowedEmojis =
      getAllowedReactionEmojis_();

    const actor =
      getActorIdentity_();

    const normalizedActor =
      normalizeReactionActor_(
        actor
      );

    const byEmoji = {};

    const ss =
      SpreadsheetApp.getActiveSpreadsheet();

    const reactionsSheet =
      ss.getSheetByName(
        "Reactions"
      );

    if (!reactionsSheet) {
      throw new Error(
        "Reactions worksheet was not found."
      );
    }

    const lastRow =
      reactionsSheet.getLastRow();

    if (lastRow >= 2) {
      const headers =
        getHeaderMap_(
          "Reactions"
        );

      const rows =
        withPerf_(
          "Reactions-sheet read",
          function() {
            return reactionsSheet
              .getRange(
                2,
                1,
                lastRow - 1,
                reactionsSheet.getLastColumn()
              )
              .getValues();
          }
        );

      const readValue = (
        rowValues,
        headerName
      ) =>
        rowValues[
          headers[headerName] - 1
        ];

      rows.forEach(
        rowValues => {
          const rowLeadId =
            String(
              readValue(
                rowValues,
                "lead_id"
              ) || ""
            ).trim();

          const rowActivityId =
            String(
              readValue(
                rowValues,
                "activity_id"
              ) || ""
            ).trim();

          const emoji =
            String(
              readValue(
                rowValues,
                "emoji"
              ) || ""
            ).trim();

          const reactedByEmail =
            String(
              readValue(
                rowValues,
                "reacted_by_email"
              ) || ""
            ).trim();

          const reactedByName =
            String(
              readValue(
                rowValues,
                "reacted_by_name"
              ) || ""
            ).trim();

          const isActive =
            Boolean(
              readValue(
                rowValues,
                "is_active"
              )
            );

          if (
            rowLeadId !==
              cleanLeadId ||
            rowActivityId !==
              cleanActivityId ||
            !emoji ||
            !isActive
          ) {
            return;
          }

          if (!byEmoji[emoji]) {
            byEmoji[emoji] = {
              count: 0,
              reactedByMe:
                false,
            };
          }

          byEmoji[emoji].count += 1;

          const sameActor =
            normalizedActor.email
              ? reactedByEmail
                  .toLowerCase() ===
                normalizedActor.email
              : reactedByName
                  .toLowerCase() ===
                normalizedActor.name;

          if (sameActor) {
            byEmoji[emoji].reactedByMe =
              true;
          }
        }
      );
    }

    return {
      activityId:
        cleanActivityId,

      allowedEmojis,

      reactions:
        allowedEmojis
          .map(
            function(emoji) {
              const state =
                byEmoji[emoji] || {
                  count: 0,
                  reactedByMe:
                    false,
                };

              return {
                emoji,

                count:
                  Number(
                    state.count
                  ) || 0,

                reactedByMe:
                  Boolean(
                    state.reactedByMe
                  ),
              };
            }
          )
          .filter(
            function(reaction) {
              return (
                reaction.count >
                0
              );
            }
          ),
    };
  } finally {
    endPerf_(perf);
  }
}

/**
 * PHASE 3B
 * Builds the read-only ActivityLog timeline for
 * one canonical lead_id.
 *
 * Activities are shown newest first based primarily
 * on occurred_at, with recorded_at as the fallback
 * and secondary sort value.
 */
function buildPatientActivityTimeline_(
  leadId
) {
  const perf = startPerf_("buildPatientActivityTimeline_");

  try {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      "ActivityLog"
    );

  if (!sheet) {
    throw new Error(
      "ActivityLog worksheet was not found."
    );
  }

  const headers =
    getHeaderMap_(
      "ActivityLog"
    );

  const lastRow =
    sheet.getLastRow();

  if (lastRow < 2) {
    return [];
  }

  const lastColumn =
    sheet.getLastColumn();

  const rows =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        lastColumn
      )
      .getValues();

  const readValue = (
    rowValues,
    headerName
  ) => {
    return rowValues[
      headers[headerName] - 1
    ];
  };

  const activities = [];

  rows.forEach(
    rowValues => {
      const activityId =
        String(
          readValue(
            rowValues,
            "activity_id"
          ) || ""
        ).trim();

      const rowLeadId =
        String(
          readValue(
            rowValues,
            "lead_id"
          ) || ""
        ).trim();

      /*
       * Ignore unused prepared ActivityLog rows
       * and activities belonging to other leads.
       */
      if (
        !activityId ||
        rowLeadId !== leadId
      ) {
        return;
      }

      const recordedAtValue =
        readValue(
          rowValues,
          "recorded_at"
        );

      const occurredAtValue =
        readValue(
          rowValues,
          "occurred_at"
        );

      const recordedAt =
        recordedAtValue instanceof Date &&
        !isNaN(
          recordedAtValue.getTime()
        )
          ? recordedAtValue
          : null;

      const occurredAt =
        occurredAtValue instanceof Date &&
        !isNaN(
          occurredAtValue.getTime()
        )
          ? occurredAtValue
          : recordedAt;

      const activity = {
        activityId,

        activityType:
          String(
            readValue(
              rowValues,
              "activity_type"
            ) || ""
          ).trim(),

        actorEmail:
          String(
            readValue(
              rowValues,
              "actor_email"
            ) || ""
          ).trim(),

        actorName:
          String(
            readValue(
              rowValues,
              "actor_name"
            ) || ""
          ).trim(),

        activitySource:
          String(
            readValue(
              rowValues,
              "activity_source"
            ) || ""
          ).trim(),

        fieldName:
          String(
            readValue(
              rowValues,
              "field_name"
            ) || ""
          ).trim(),

        previousValue:
          String(
            readValue(
              rowValues,
              "previous_value"
            ) || ""
          ).trim(),

        newValue:
          String(
            readValue(
              rowValues,
              "new_value"
            ) || ""
          ).trim(),

        fromStatus:
          String(
            readValue(
              rowValues,
              "from_status"
            ) || ""
          ).trim(),

        toStatus:
          String(
            readValue(
              rowValues,
              "to_status"
            ) || ""
          ).trim(),

        attemptNumber:
          Number(
            readValue(
              rowValues,
              "attempt_number"
            )
          ) || 0,

        contactMethod:
          String(
            readValue(
              rowValues,
              "contact_method"
            ) || ""
          ).trim(),

        contactOutcome:
          String(
            readValue(
              rowValues,
              "contact_outcome"
            ) || ""
          ).trim(),

        reachedPatient:
          Boolean(
            readValue(
              rowValues,
              "reached_patient"
            )
          ),

        scheduledDate:
          readValue(
            rowValues,
            "scheduled_date"
          ),

        note:
          String(
            readValue(
              rowValues,
              "note"
            ) || ""
          ).trim(),

        parentActivityId:
          String(
            readValue(
              rowValues,
              "parent_activity_id"
            ) || ""
          ).trim(),

        systemGenerated:
          Boolean(
            readValue(
              rowValues,
              "system_generated"
            )
          ),
      };

      const display =
        buildPatientActivityDisplay_(
          activity
        );

      const actor =
        activity.actorName ||
        activity.actorEmail ||
        (
          activity.systemGenerated
            ? "System"
            : activity.activitySource ||
              "Employee"
        );

      const showRecordedAt =
        Boolean(
          occurredAt &&
          recordedAt &&
          Math.abs(
            occurredAt.getTime() -
            recordedAt.getTime()
          ) >= 60000
        );

      activities.push({
        activityId,

        activityType:
          activity.activityType,

        title:
          display.title,

        detail:
          display.detail,

        note:
          activity.note,

        actor,

        source:
          activity.activitySource,

        occurredAt:
          formatDateTimeForPatientDetail_(
            occurredAt
          ),

        recordedAt:
          formatDateTimeForPatientDetail_(
            recordedAt
          ),

        showRecordedAt,

        isReply:
          activity.activityType ===
          "reply",

        isSystem:
          activity.systemGenerated,

        parentActivityId:
          activity.parentActivityId,

        sortTime:
          occurredAt
            ? occurredAt.getTime()
            : 0,

        recordedSortTime:
          recordedAt
            ? recordedAt.getTime()
            : 0,
      });
    }
  );

  /*
   * Add reaction state to EVERY timeline activity.
   *
   * Workflow events, comments, replies, contact
   * attempts, status changes, etc. can all receive
   * reactions.
   */
  const reactionState =
    buildPatientReactionState_(
      leadId
    );


  activities.forEach(
    activity => {
      if (
        !isReactionEligibleActivityType_(
          activity.activityType
        )
      ) {
        activity.canReact =
          false;

        activity.reactions = [];

        return;
      }


      activity.canReact =
        true;


      const activityState =
        reactionState.byActivity[
          activity.activityId
        ] || {};


      activity.reactions =
        reactionState.allowedEmojis
          .map(
            emoji => {
              const state =
                activityState[emoji] || {
                  count: 0,
                  reactedByMe:
                    false,
                };

              return {
                emoji,

                count:
                  Number(
                    state.count
                  ) || 0,

                reactedByMe:
                  Boolean(
                    state.reactedByMe
                  ),
              };
            }
          )
          .filter(
            reaction =>
              Number(
                reaction.count
              ) > 0
          );
    }
  );


  /*
   * Build an activity lookup so replies can be
   * resolved to their original thread root.
   *
   * This also supports any older replies that may
   * have been linked to another reply instead of
   * directly to the root.
   */
  const activityById = {};

  activities.forEach(
    activity => {
      activityById[
        activity.activityId
      ] = activity;
    }
  );


  /*
   * Every non-reply activity is a top-level
   * timeline entry.
   */
  const rootActivities =
    activities.filter(
      activity =>
        activity.activityType !==
        "reply"
    );


  /*
   * Top-level activities remain NEWEST FIRST.
   *
   * A newer reply does NOT change the position
   * of its parent thread.
   */
  rootActivities.sort(
    (a, b) => {
      if (
        b.sortTime !==
        a.sortTime
      ) {
        return (
          b.sortTime -
          a.sortTime
        );
      }

      return (
        b.recordedSortTime -
        a.recordedSortTime
      );
    }
  );


  const repliesByRoot = {};
  const orphanReplies = [];


  /*
   * Group every reply beneath its original root.
   */
  activities.forEach(
    activity => {
      if (
        activity.activityType !==
        "reply"
      ) {
        return;
      }

      let parentId =
        activity.parentActivityId;

      let rootId = "";

      const visited = {};


      while (parentId) {
        if (visited[parentId]) {
          break;
        }

        visited[parentId] = true;

        const parent =
          activityById[
            parentId
          ];

        if (!parent) {
          break;
        }

        if (
          parent.activityType !==
          "reply"
        ) {
          rootId =
            parent.activityId;

          break;
        }

        parentId =
          parent.parentActivityId;
      }


      if (!rootId) {
        /*
         * Never silently lose an invalid historical
         * reply from the timeline.
         */
        orphanReplies.push(
          activity
        );

        return;
      }


      if (!repliesByRoot[rootId]) {
        repliesByRoot[rootId] = [];
      }

      repliesByRoot[rootId].push(
        activity
      );
    }
  );


  /*
   * Replies inside each thread display
   * OLDEST → NEWEST.
   *
   * New replies therefore appear at the bottom
   * of their parent's reply subsection.
   */
  Object.values(
    repliesByRoot
  ).forEach(
    replies => {
      replies.sort(
        (a, b) => {
          if (
            a.sortTime !==
            b.sortTime
          ) {
            return (
              a.sortTime -
              b.sortTime
            );
          }

          return (
            a.recordedSortTime -
            b.recordedSortTime
          );
        }
      );
    }
  );


  /*
   * Flatten the display:
   *
   * Root
   *   Reply
   *   Reply
   * Root
   *   Reply
   */
  const threadedActivities = [];

  rootActivities.forEach(
    root => {
      threadedActivities.push(
        root
      );

      const replies =
        repliesByRoot[
          root.activityId
        ] || [];

      replies.forEach(
        reply => {
          threadedActivities.push(
            reply
          );
        }
      );
    }
  );


  /*
   * Defensive fallback for malformed historical
   * replies whose parent no longer exists.
   */
  orphanReplies.sort(
    (a, b) =>
      b.sortTime -
      a.sortTime
  );

  orphanReplies.forEach(
    reply => {
      threadedActivities.push(
        reply
      );
    }
  );


  return threadedActivities;
  } finally {
    endPerf_(perf);
  }
}


/**
 * Creates a human-readable title and summary for
 * one ActivityLog record.
 *
 * The ActivityLog remains canonical; this function
 * only controls how an event is displayed.
 */
function buildPatientActivityDisplay_(
  activity
) {
  const before =
    activity.previousValue ||
    "—";

  const after =
    activity.newValue ||
    "—";

  switch (
    activity.activityType
  ) {
    case "lead_created":
      return {
        title:
          "Lead created",

        detail:
          activity.activitySource
            ? `Source: ${activity.activitySource}`
            : "",
      };


    case "contact_attempt": {
      const parts = [];

      if (
        activity.attemptNumber
      ) {
        parts.push(
          `Attempt #${activity.attemptNumber}`
        );
      }

      if (
        activity.contactMethod
      ) {
        parts.push(
          activity.contactMethod
        );
      }

      if (
        activity.contactOutcome
      ) {
        parts.push(
          activity.contactOutcome
        );
      }

      if (
        activity.reachedPatient
      ) {
        parts.push(
          "Patient reached"
        );
      }

      return {
        title:
          "Contact attempt",

        detail:
          parts.join(" • "),
      };
    }


    case "comment":
      return {
        title:
          "Comment",

        detail:
          "",
      };


    case "reply":
      return {
        title:
          "Reply",

        detail:
          "",
      };


    case "status_change":
      return {
        title:
          "Status changed",

        detail:
          `${
            activity.fromStatus ||
            before
          } → ${
            activity.toStatus ||
            after
          }`,
      };


    case "scheduled_date_set":
      return {
        title:
          "Scheduled date set",

        detail:
          after,
      };


    case "scheduled_date_changed":
      return {
        title:
          "Scheduled date changed",

        detail:
          `${before} → ${after}`,
      };


    case "scheduled_date_cleared":
      return {
        title:
          "Scheduled date cleared",

        detail:
          before !== "—"
            ? `Previous date: ${before}`
            : "",
      };


    case "follow_up_date_set":
      return {
        title:
          "Follow-up date set",

        detail:
          after,
      };


    case "follow_up_date_changed":
      return {
        title:
          "Follow-up date changed",

        detail:
          `${before} → ${after}`,
      };


    case "follow_up_date_cleared":
      return {
        title:
          "Follow-up date cleared",

        detail:
          before !== "—"
            ? `Previous date: ${before}`
            : "",
      };


    case "workflow_completed":
      return {
        title:
          "Workflow completed",

        detail:
          activity.toStatus ||
          activity.fromStatus ||
          "",
      };


    case "workflow_reopened":
      return {
        title:
          "Workflow reopened",

        detail:
          activity.fromStatus ||
          activity.toStatus
            ? `${
                activity.fromStatus ||
                "—"
              } → ${
                activity.toStatus ||
                "—"
              }`
            : "",
      };


    case "assignment_changed":
      return {
        title:
          "Assignment changed",

        detail:
          `${
            activity.previousValue ||
            "Unassigned"
          } → ${
            activity.newValue ||
            "Unassigned"
          }`,
      };


    case "field_changed":
      return {
        title:
          `Changed ${
            formatActivityFieldLabel_(
              activity.fieldName
            )
          }`,

        detail:
          `${before} → ${after}`,
      };


    case "attachment_added":
      return {
        title:
          "Attachment added",

        detail:
          "",
      };


    case "reaction_added":
      return {
        title:
          "Reaction added",

        detail:
          activity.newValue || "",
      };


    case "reaction_removed":
      return {
        title:
          "Reaction removed",

        detail:
          activity.previousValue || "",
      };


    case "system_note":
      return {
        title:
          "System note",

        detail:
          "",
      };


    default:
      return {
        title:
          formatActivityTypeLabel_(
            activity.activityType
          ),

        detail:
          activity.fieldName
            ? `${before} → ${after}`
            : "",
      };
  }
}


/**
 * Converts a canonical activity type such as
 * scheduled_date_changed into a readable label.
 */
function formatActivityTypeLabel_(
  activityType
) {
  const text =
    String(
      activityType || ""
    )
      .trim()
      .replace(
        /_/g,
        " "
      );

  if (!text) {
    return "Activity";
  }

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
}


/**
 * Converts a canonical field name into a
 * human-readable activity label.
 */
function formatActivityFieldLabel_(
  fieldName
) {
  const knownLabels = {
    assigned_to:
      "assignment",

    lost_reason:
      "Case Lost reason",

    unrelated_type:
      "Unrelated type",

    scheduled_date:
      "scheduled date",

    next_follow_up_on:
      "follow-up date",

    workflow_complete:
      "workflow completion",

    status:
      "status",
  };

  if (
    knownLabels[fieldName]
  ) {
    return (
      knownLabels[fieldName]
    );
  }

  const text =
    String(
      fieldName || "field"
    )
      .replace(
        /_/g,
        " "
      )
      .trim();

  return text || "field";
}

/**
 * Core reusable reopen-to-Open function.
 */
function moveLeadToOpenFollowUp_(
  row,
  data = {}
) {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName("Leads");

  if (!sheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  const headers =
    getHeaderMap_("Leads");

  const leadId =
    sheet
      .getRange(
        row,
        headers.lead_id
      )
      .getDisplayValue()
      .trim();

  if (!leadId) {
    throw new Error(
      `Lead row ${row} does not contain a lead_id.`
    );
  }

  assertOperationalLeadById_(leadId);

  const targetStatus =
    "Open Lead / Follow Up";

  const previousStatus =
    sheet
      .getRange(
        row,
        headers.status
      )
      .getDisplayValue()
      .trim();

  const allowedStatuses = [
    "Scheduled",
    "Case Lost",
    "Unrelated",
  ];

  if (
    !allowedStatuses.includes(
      previousStatus
    )
  ) {
    throw new Error(
      `Status "${previousStatus}" cannot be reopened to Open Lead / Follow Up.`
    );
  }

  const actor =
    getActorIdentity_();

  const recordedNow =
    new Date();

  const occurredAt =
    data.occurredAt instanceof Date
      ? data.occurredAt
      : recordedNow;

  const note =
    String(
      data.note || ""
    ).trim();

  if (!note) {
    throw new Error(
      "A reopen reason is required."
    );
  }

  /*
   * If this workflow had previously been marked
   * complete, reopening it must clear completion
   * state and preserve an audit event.
   */
  resetCompletionForStatusMove_(
    sheet,
    row,
    headers,
    leadId,
    occurredAt,
    actor,
    previousStatus,
    targetStatus,
    note
  );

  /*
   * A former Scheduled lead no longer has
   * current scheduling information once it
   * returns to active follow-up.
   *
   * The shared helper also clears a stale
   * scheduled-date note when the lead was
   * Scheduled without an actual date.
   */
  if (
    previousStatus ===
    "Scheduled"
  ) {
    clearScheduledDateForWorkflowMove_(
      sheet,
      row,
      headers,
      leadId,
      occurredAt,
      actor,
      note
    );
  }

  /*
   * A reopened lead no longer carries a
   * Case Lost classification.
   */
  if (
    previousStatus ===
    "Case Lost"
  ) {
    const previousReason =
      sheet
        .getRange(
          row,
          headers.lost_reason
        )
        .getDisplayValue()
        .trim();

    if (previousReason) {
      setCellByHeader_(
        sheet,
        row,
        headers,
        "lost_reason",
        ""
      );

      appendActivity_({
        leadId,
        occurredAt,

        activityType:
          "field_changed",

        actorEmail:
          actor.email,

        actorName:
          actor.name,

        activitySource:
          "Employee",

        fieldName:
          "lost_reason",

        previousValue:
          previousReason,

        newValue:
          "",

        note,

        systemGenerated:
          false,
      });
    }
  }

  /*
   * A reopened lead no longer carries an
   * Unrelated classification.
   */
  if (
    previousStatus ===
    "Unrelated"
  ) {
    const previousType =
      sheet
        .getRange(
          row,
          headers.unrelated_type
        )
        .getDisplayValue()
        .trim();

    if (previousType) {
      setCellByHeader_(
        sheet,
        row,
        headers,
        "unrelated_type",
        ""
      );

      appendActivity_({
        leadId,
        occurredAt,

        activityType:
          "field_changed",

        actorEmail:
          actor.email,

        actorName:
          actor.name,

        activitySource:
          "Employee",

        fieldName:
          "unrelated_type",

        previousValue:
          previousType,

        newValue:
          "",

        note,

        systemGenerated:
          false,
      });
    }
  }

  /*
   * Missing-date warnings only apply while
   * a lead is actually in Scheduled.
   */
  setCellByHeader_(
    sheet,
    row,
    headers,
    "schedule_date_missing",
    false
  );

  setCellByHeader_(
    sheet,
    row,
    headers,
    "status",
    targetStatus
  );

  appendActivity_({
    leadId,
    occurredAt,

    activityType:
      "status_change",

    actorEmail:
      actor.email,

    actorName:
      actor.name,

    activitySource:
      "Employee",

    fieldName:
      "status",

    previousValue:
      previousStatus,

    newValue:
      targetStatus,

    fromStatus:
      previousStatus,

    toStatus:
      targetStatus,

    note,

    systemGenerated:
      false,
  });

  updateLeadAuditMetadata_(
    sheet,
    row,
    headers,
    occurredAt,
    recordedNow,
    actor
  );

  return {
    leadId,
    previousStatus,
    status:
      targetStatus,
  };
}


/**
 * Clears workflow completion metadata when a
 * completed card is moved into another workflow.
 *
 * If the lead was not complete, this safely
 * does nothing.
 */
function resetCompletionForStatusMove_(
  sheet,
  row,
  headers,
  leadId,
  occurredAt,
  actor,
  fromStatus,
  toStatus,
  note
) {
  const workflowComplete =
    Boolean(
      sheet
        .getRange(
          row,
          headers.workflow_complete
        )
        .getValue()
    );

  const completedAtCell =
    sheet.getRange(
      row,
      headers.completed_at
    );

  const completedByCell =
    sheet.getRange(
      row,
      headers.completed_by
    );

  const previousCompletedAt =
    completedAtCell.getValue();

  const previousCompletedBy =
    completedByCell
      .getDisplayValue()
      .trim();

  /*
   * Always clean stale completion metadata if
   * any exists.
   */
  setCellByHeader_(
    sheet,
    row,
    headers,
    "workflow_complete",
    false
  );

  completedAtCell.clearContent();
  completedByCell.clearContent();

  /*
   * Only create workflow_reopened when the
   * workflow genuinely was complete.
   */
  if (!workflowComplete) {
    return false;
  }

  let auditNote =
    note || "";

  const completedAtText =
    previousCompletedAt instanceof Date &&
    !isNaN(
      previousCompletedAt.getTime()
    )
      ? Utilities.formatDate(
          previousCompletedAt,
          getConfiguredTimezoneWithFallback_(),
          "MM/dd/yyyy h:mm a"
        )
      : "";

  if (
    completedAtText ||
    previousCompletedBy
  ) {
    const metadata =
      "Previously completed" +
      (
        completedAtText
          ? ` at ${completedAtText}`
          : ""
      ) +
      (
        previousCompletedBy
          ? ` by ${previousCompletedBy}`
          : ""
      ) +
      ".";

    auditNote =
      auditNote
        ? `${auditNote} ${metadata}`
        : metadata;
  }

  appendActivity_({
    leadId,
    occurredAt,

    activityType:
      "workflow_reopened",

    actorEmail:
      actor.email,

    actorName:
      actor.name,

    activitySource:
      "Employee",

    fieldName:
      "workflow_complete",

    previousValue:
      "TRUE",

    newValue:
      "FALSE",

    fromStatus,

    toStatus,

    note:
      auditNote,

    systemGenerated:
      false,
  });

  return true;
}

/**
 * PHASE 3C-A
 * Returns controlled values used by workflow
 * actions inside the Patient Detail interface.
 *
 * More action options will be added here during
 * the later Phase 3C slices.
 */
function buildPatientDetailActionOptions_() {
  const perf =
    startPerf_(
      "Patient Detail action-option construction"
    );

  try {
  if (EXECUTION_CACHE_.actionOptions) {
    return EXECUTION_CACHE_.actionOptions;
  }

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const listsSheet =
    ss.getSheetByName("Lists");

  if (!listsSheet) {
    throw new Error(
      "Lists worksheet was not found."
    );
  }

  EXECUTION_CACHE_.actionOptions = {
    assignees:
      getListValues_(
        listsSheet,
        "N2:N20"
      ),

    contactMethods:
      getListValues_(
        listsSheet,
        "L2:L5"
      ),

    contactOutcomes:
      getListValues_(
        listsSheet,
        "C2:C10"
      ),

    caseLostReasons:
      getListValues_(
        listsSheet,
        "G2:G9"
      ),

    unrelatedTypes:
      getListValues_(
        listsSheet,
        "H2:H8"
      ),
  };

  return EXECUTION_CACHE_.actionOptions;
  } finally {
    endPerf_(perf);
  }
}


/**
 * Resolves a permanent lead_id back to its
 * canonical Leads row.
 *
 * Patient Detail actions use this instead of
 * depending on the currently selected row.
 */
function getPatientDetailLeadRowOrThrow_(
  leadId
) {
  const cleanLeadId =
    String(
      leadId || ""
    ).trim();

  if (!cleanLeadId) {
    throw new Error(
      "A lead_id is required."
    );
  }

  const row =
    findLeadRowById_(
      cleanLeadId
    );

  if (!row) {
    throw new Error(
      `Lead "${cleanLeadId}" could not be found.`
    );
  }

  return row;
}


/**
 * Builds the canonical Lead fields needed to
 * update Patient Detail immediately after a
 * mutation, without activity, reactions,
 * attachments, or Drive health checks.
 */
function buildPatientDetailCoreRefreshData_(
  leadId
) {
  const perf =
    startPerf_(
      "buildPatientDetailCoreRefreshData_"
    );

  try {
  const context =
    getLeadContextById_(
      leadId,
      {
        refreshSnapshot: true,
      }
    );

  const firstAttemptAt =
    context.getValue(
      "first_attempt_at"
    );

  const lastAttemptAt =
    context.getValue(
      "last_attempt_at"
    );

  const lastActivityAt =
    context.getValue(
      "last_activity_at"
    );

  const nextFollowUpOn =
    context.getValue(
      "next_follow_up_on"
    );

  const scheduledDate =
    context.getValue(
      "scheduled_date"
    );

  const completedAt =
    context.getValue(
      "completed_at"
    );

  return {
    leadId,

    status:
      context.getDisplay(
        "status"
      ),

    assignedTo:
      context.getDisplay(
        "assigned_to"
      ),

    workflowComplete:
      Boolean(
        context.getValue(
          "workflow_complete"
        )
      )
        ? "Yes"
        : "No",

    attemptCount:
      Number(
        context.getValue(
          "attempt_count"
        )
      ) || 0,

    reachedPatient:
      Boolean(
        context.getValue(
          "reached_patient"
        )
      )
        ? "Yes"
        : "No",

    lastContactOutcome:
      context.getDisplay(
        "last_contact_outcome"
      ),

    firstAttemptAt:
      formatDateTimeForPatientDetail_(
        firstAttemptAt
      ),

    lastAttemptAt:
      formatDateTimeForPatientDetail_(
        lastAttemptAt
      ),

    lastActivityAt:
      formatDateTimeForPatientDetail_(
        lastActivityAt
      ),

    nextFollowUpOn:
      formatDateForAudit_(
        nextFollowUpOn
      ),

    nextFollowUpInput:
      formatDateForHtmlInput_(
        nextFollowUpOn
      ),

    scheduledDate:
      formatDateForAudit_(
        scheduledDate
      ),

    scheduledDateInput:
      formatDateForHtmlInput_(
        scheduledDate
      ),

    scheduledDateNote:
      context.getDisplay(
        "scheduled_date_note"
      ),

    scheduleDateMissing:
      Boolean(
        context.getValue(
          "schedule_date_missing"
        )
      ),

    completedAt:
      formatDateTimeForPatientDetail_(
        completedAt
      ),

    completedBy:
      context.getDisplay(
        "completed_by"
      ),

    lostReason:
      context.getDisplay(
        "lost_reason"
      ),

    unrelatedType:
      context.getDisplay(
        "unrelated_type"
      ),

    archive:
      buildLeadArchiveDetail_(
        context.headers,
        context.getValue,
        context.getDisplay
      ),
  };
  } finally {
    endPerf_(perf);
  }
}


/**
 * Builds the small set of refreshed values needed
 * after a Patient Detail workflow action.
 *
 * Future Phase 3C actions will reuse this helper.
 *
 * This full helper still includes activity and
 * attachments. Mutation responses that do not
 * change those surfaces should use
 * buildPatientDetailCoreRefreshData_() instead.
 */
function buildPatientDetailRefreshData_(
  leadId
) {
  const perf = startPerf_("buildPatientDetailRefreshData_");

  try {
  const refresh =
    buildPatientDetailCoreRefreshData_(
      leadId
    );

  refresh.activity =
    buildPatientActivityTimeline_(
      leadId
    );

  refresh.attachments =
    buildPatientAttachments_(
      leadId
    );

  return refresh;
  } finally {
    endPerf_(perf);
  }
}


/**
 * HTML-callable activity/reaction refresh.
 *
 * Used after Patient Details opens and after a
 * Patient Detail mutation has already succeeded
 * so the timeline can catch up without blocking
 * the initial dialog or the save result.
 *
 * Does not rebuild attachments or Drive health.
 */
function patientDetailLoadActivityData(
  leadId
) {
  const perf =
    startPerf_(
      "patientDetailLoadActivityData"
    );

  try {
    getPatientDetailLeadRowOrThrow_(
      leadId
    );

    const activity =
      buildPatientActivityTimeline_(
        leadId
      );

    return {
      leadId:
        String(
          leadId || ""
        ).trim(),

      activity,

      allowedEmojis:
        getAllowedReactionEmojis_(),
    };

  } finally {
    endPerf_(perf);
  }
}


/**
 * HTML-callable attachment and Drive-health load.
 *
 * Used after Patient Details opens so live Drive
 * inspection does not block the initial dialog.
 *
 * Reuses the existing private attachment builder
 * so available/missing/trashed/renamed behavior
 * stays unchanged.
 */
function patientDetailLoadAttachments(
  leadId
) {
  const perf =
    startPerf_(
      "patientDetailLoadAttachments"
    );

  try {
    getPatientDetailLeadRowOrThrow_(
      leadId
    );

    return {
      leadId:
        String(
          leadId || ""
        ).trim(),

      attachments:
        buildPatientAttachments_(
          leadId
        ),
    };

  } finally {
    endPerf_(perf);
  }
}


/**
 * Public server action called from PatientDetail.html.
 *
 * Assignment is performed using the existing
 * tested assignLead_() core automation.
 */
function patientDetailAssignLead(
  leadId,
  data = {}
) {
  const perf = startPerf_("patientDetailAssignLead");

  try {
  const row =
    getPatientDetailLeadRowOrThrow_(
      leadId
    );

  const assignedTo =
    String(
      data.assignedTo || ""
    ).trim();

  const result =
    assignLead_(
      row,
      {
        assignedTo,
        occurredAt:
          new Date(),
      }
    );

  return attachLeadViewInvalidation_({

    changed:
      result.changed,

    message:
      result.changed
        ? (
            result.assignedTo
              ? `Lead assigned to ${result.assignedTo}.`
              : "Lead is now unassigned."
          )
        : "Assignment is already set to that value.",

    refresh:
      buildPatientDetailCoreRefreshData_(
        leadId
      ),
    },
      LEAD_VIEW_INVALIDATION_.assignment
    );
  } finally {
    endPerf_(perf);
  }
}


/**
 * PHASE 3C-B
 * Records a contact attempt from the
 * Patient Detail interface.
 *
 * The permanent lead_id is resolved back to
 * the canonical Leads row before mutation.
 */
function patientDetailRecordContactAttempt(
  leadId,
  data = {}
) {
  const perf =
    startPerf_(
      "patientDetailRecordContactAttempt"
    );

  try {
  const row =
    getPatientDetailLeadRowOrThrow_(
      leadId
    );

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const leadsSheet =
    ss.getSheetByName("Leads");

  if (!leadsSheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  const headers =
    getHeaderMap_("Leads");

  const workflowComplete =
    Boolean(
      leadsSheet
        .getRange(
          row,
          headers.workflow_complete
        )
        .getValue()
    );

  if (workflowComplete) {
    throw new Error(
      "This workflow is complete. Reopen the workflow before recording another contact attempt."
    );
  }

  const listsSheet =
    ss.getSheetByName("Lists");

  if (!listsSheet) {
    throw new Error(
      "Lists worksheet was not found."
    );
  }

  const contactMethod =
    String(
      data.contactMethod || ""
    ).trim();

  const contactOutcome =
    String(
      data.contactOutcome || ""
    ).trim();

  const reachedPatient =
    data.reachedPatient === true;

  const note =
    String(
      data.note || ""
    ).trim();


  /*
   * Validate again on the server.
   *
   * The HTML dropdown is convenient for employees,
   * but client-side values must not be trusted as
   * the only validation boundary.
   */
  const allowedMethods =
    getListValues_(
      listsSheet,
      "L2:L5"
    );

  const allowedOutcomes =
    getListValues_(
      listsSheet,
      "C2:C10"
    );


  if (
    !allowedMethods.includes(
      contactMethod
    )
  ) {
    throw new Error(
      `Invalid contact method: ${contactMethod || "(blank)"}`
    );
  }


  if (
    !allowedOutcomes.includes(
      contactOutcome
    )
  ) {
    throw new Error(
      `Invalid contact outcome: ${contactOutcome || "(blank)"}`
    );
  }


  const result =
    recordContactAttempt_(
      row,
      {
        contactMethod,
        contactOutcome,
        reachedPatient,
        note,
        occurredAt:
          new Date(),
      }
    );


  return attachLeadViewInvalidation_({

    changed: true,

    message:
      `Attempt #${result.attemptNumber} recorded successfully.`,

    attemptNumber:
      result.attemptNumber,

    refresh:
      buildPatientDetailCoreRefreshData_(
        leadId
      ),
    },
      LEAD_VIEW_INVALIDATION_.contact
    );
  } finally {
    endPerf_(perf);
  }
}


/**
 * PHASE 3C-C
 * Schedules or reschedules a lead from
 * Patient Detail.
 */
function patientDetailScheduleLead(
  leadId,
  data = {}
) {
  const perf = startPerf_("patientDetailScheduleLead");

  try {
  const context =
    getLeadContextById_(
      leadId
    );

  const row = context.row;

  const scheduledDateText =
    String(
      data.scheduledDateText || ""
    ).trim();

  const note =
    String(
      data.note || ""
    ).trim();

  const scheduledDate =
    scheduledDateText
      ? parseHtmlDateForPatientDetail_(
          scheduledDateText,
          "Scheduled date"
        )
      : null;

  const currentStatus =
    context.getDisplay(
      "status"
    );

  const existingDate =
    context.getValue(
      "scheduled_date"
    );

  const hasExistingDate =
    existingDate instanceof Date &&
    !isNaN(
      existingDate.getTime()
    );

  const sameDate =
    Boolean(scheduledDate) &&
    hasExistingDate &&
    formatDateForAudit_(
      scheduledDate
    ) ===
      formatDateForAudit_(
        existingDate
      );

  /*
   * Prevent note-only / same-date calls from
   * silently mutating scheduling metadata without
   * a corresponding scheduling audit event.
   */
  if (
    currentStatus === "Scheduled" &&
    (
      !scheduledDate ||
      sameDate
    )
  ) {
    return attachLeadViewInvalidation_({

      changed: false,

      message:
        sameDate
          ? `The lead is already scheduled for ${formatDateForAudit_(
              existingDate
            )}.`
          : (
              hasExistingDate
                ? `The lead is already scheduled for ${formatDateForAudit_(
                    existingDate
                  )}. Enter a different date to reschedule.`
                : "The lead is already Scheduled without an appointment date."
            ),

      refresh:
        buildPatientDetailCoreRefreshData_(
          leadId
        ),
      },
        LEAD_VIEW_INVALIDATION_.workflow
      );
  }

  const result =
    scheduleLead_(
      row,
      {
        scheduledDate,
        note,
        occurredAt:
          new Date(),
      }
    );

  invalidateLeadRowSnapshot_(
    leadId
  );


  return attachLeadViewInvalidation_({

    changed: true,

    message:
      result.scheduleDateMissing
        ? "Lead moved to Scheduled without an appointment date. The missing-date warning is active."
        : `Lead scheduled for ${formatDateForAudit_(
            result.scheduledDate
          )}.`,

    refresh:
      buildPatientDetailCoreRefreshData_(
        leadId
      ),
    },
      LEAD_VIEW_INVALIDATION_.workflow
    );
  } finally {
    endPerf_(perf);
  }
}


/**
 * Sets or changes a future follow-up date.
 */
function patientDetailSetFollowUpDate(
  leadId,
  data = {}
) {
  const perf =
    startPerf_(
      "patientDetailSetFollowUpDate"
    );

  try {
  const row =
    getPatientDetailLeadRowOrThrow_(
      leadId
    );

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName("Leads");

  if (!sheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  const headers =
    getHeaderMap_("Leads");

  const status =
    sheet
      .getRange(
        row,
        headers.status
      )
      .getDisplayValue()
      .trim();

  if (
    status !==
    "Open Lead / Follow Up"
  ) {
    throw new Error(
      'Future follow-up dates can only be managed while the lead is in "Open Lead / Follow Up".'
    );
  }

  const workflowComplete =
    Boolean(
      sheet
        .getRange(
          row,
          headers.workflow_complete
        )
        .getValue()
    );

  if (workflowComplete) {
    throw new Error(
      "This workflow is complete. Reopen the workflow before setting a follow-up date."
    );
  }

  const followUpDateText =
    String(
      data.followUpDateText || ""
    ).trim();

  if (!followUpDateText) {
    throw new Error(
      "Select a follow-up date."
    );
  }

  const followUpDate =
    parseHtmlDateForPatientDetail_(
      followUpDateText,
      "Follow-up date"
    );

  const note =
    String(
      data.note || ""
    ).trim();

  const result =
    setFollowUpDate_(
      row,
      {
        followUpDate,
        note,
        occurredAt:
          new Date(),
      }
    );

  return attachLeadViewInvalidation_({

    changed:
      result.changed,

    message:
      result.changed
        ? `Future follow-up set for ${formatDateForAudit_(
            result.followUpDate
          )}.`
        : `The follow-up date is already ${formatDateForAudit_(
            result.followUpDate
          )}.`,

    refresh:
      buildPatientDetailCoreRefreshData_(
        leadId
      ),
    },
      LEAD_VIEW_INVALIDATION_.followUp
    );
  } finally {
    endPerf_(perf);
  }
}


/**
 * Clears the current future follow-up date.
 */
function patientDetailClearFollowUpDate(
  leadId,
  data = {}
) {
  const perf =
    startPerf_(
      "patientDetailClearFollowUpDate"
    );

  try {
  const row =
    getPatientDetailLeadRowOrThrow_(
      leadId
    );

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName("Leads");

  if (!sheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  const headers =
    getHeaderMap_("Leads");

  const status =
    sheet
      .getRange(
        row,
        headers.status
      )
      .getDisplayValue()
      .trim();

  if (
    status !==
    "Open Lead / Follow Up"
  ) {
    throw new Error(
      'Future follow-up dates can only be managed while the lead is in "Open Lead / Follow Up".'
    );
  }

  const workflowComplete =
    Boolean(
      sheet
        .getRange(
          row,
          headers.workflow_complete
        )
        .getValue()
    );

  if (workflowComplete) {
    throw new Error(
      "This workflow is complete. Reopen the workflow before clearing a follow-up date."
    );
  }

  const existingDate =
    sheet
      .getRange(
        row,
        headers.next_follow_up_on
      )
      .getValue();

  if (
    !(existingDate instanceof Date) ||
    isNaN(
      existingDate.getTime()
    )
  ) {
    return attachLeadViewInvalidation_({

      changed: false,
      message:
        "No future follow-up date is currently set.",

      refresh:
        buildPatientDetailCoreRefreshData_(
          leadId
        ),
      },
        LEAD_VIEW_INVALIDATION_.followUp
      );
  }

  const note =
    String(
      data.note || ""
    ).trim();

  const result =
    clearFollowUpDate_(
      row,
      {
        note,
        occurredAt:
          new Date(),
      }
    );

  return attachLeadViewInvalidation_({

    changed: true,

    message:
      `Follow-up date ${result.previousDate} cleared.`,

    refresh:
      buildPatientDetailCoreRefreshData_(
        leadId
      ),
    },
      LEAD_VIEW_INVALIDATION_.followUp
    );
  } finally {
    endPerf_(perf);
  }
}


/**
 * PHASE 3C-D
 * Moves a lead between the non-scheduling
 * workflow lanes from Patient Detail.
 *
 * Scheduled remains handled by the dedicated
 * scheduling action.
 */
function patientDetailMoveWorkflow(
  leadId,
  data = {}
) {
  const perf = startPerf_("patientDetailMoveWorkflow");

  try {
  const context =
    getLeadContextById_(
      leadId
    );

  const row = context.row;
  const sheet = context.sheet;
  const headers = context.headers;

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const listsSheet =
    ss.getSheetByName("Lists");

  if (!sheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  if (!listsSheet) {
    throw new Error(
      "Lists worksheet was not found."
    );
  }

  const targetStatus =
    String(
      data.targetStatus || ""
    ).trim();

  const reason =
    String(
      data.reason || ""
    ).trim();

  const unrelatedType =
    String(
      data.unrelatedType || ""
    ).trim();

  const note =
    String(
      data.note || ""
    ).trim();

  const currentStatus =
    context.getDisplay(
      "status"
    );


  const allowedTargets = [
    "Open Lead / Follow Up",
    "Case Lost",
    "Unrelated",
  ];

  if (
    !allowedTargets.includes(
      targetStatus
    )
  ) {
    throw new Error(
      `Invalid workflow target: ${targetStatus || "(blank)"}`
    );
  }


  /*
   * OPEN LEAD / FOLLOW UP
   */
  if (
    targetStatus ===
    "Open Lead / Follow Up"
  ) {
    if (
      currentStatus ===
      "Open Lead / Follow Up"
    ) {
      return attachLeadViewInvalidation_({

        changed: false,
        message:
          'This lead is already in "Open Lead / Follow Up".',
        refresh:
          buildPatientDetailCoreRefreshData_(
            leadId
          ),
        },
          LEAD_VIEW_INVALIDATION_.workflow
        );
    }

    if (!note) {
      throw new Error(
        "Enter a reason for moving this lead back to Open Lead / Follow Up."
      );
    }

    const result =
      moveLeadToOpenFollowUp_(
        row,
        {
          note,
          occurredAt:
            new Date(),
        }
      );

    invalidateLeadRowSnapshot_(
      leadId
    );


    return attachLeadViewInvalidation_({

      changed: true,

      message:
        `Lead moved from ${result.previousStatus} to Open Lead / Follow Up.`,

      refresh:
        buildPatientDetailCoreRefreshData_(
          leadId
        ),
      },
        LEAD_VIEW_INVALIDATION_.workflow
      );
  }


  /*
   * CASE LOST
   */
  if (
    targetStatus ===
    "Case Lost"
  ) {
    const allowedReasons =
      getListValues_(
        listsSheet,
        "G2:G9"
      );

    if (
      !allowedReasons.includes(
        reason
      )
    ) {
      throw new Error(
        `Invalid Case Lost reason: ${reason || "(blank)"}`
      );
    }

    const currentReason =
      context.getDisplay(
        "lost_reason"
      );

    if (
      currentStatus ===
        "Case Lost" &&
      currentReason ===
        reason
    ) {
      return attachLeadViewInvalidation_({

        changed: false,

        message:
          `This lead is already Case Lost with reason "${reason}".`,

        refresh:
          buildPatientDetailCoreRefreshData_(
            leadId
          ),
        },
          LEAD_VIEW_INVALIDATION_.workflow
        );
    }

    const result =
      moveLeadToCaseLost_(
        row,
        {
          reason,
          note,
          occurredAt:
            new Date(),
        }
      );

    invalidateLeadRowSnapshot_(
      leadId
    );


    return attachLeadViewInvalidation_({

      changed: true,

      message:
        currentStatus ===
        "Case Lost"
          ? `Case Lost reason changed to ${result.reason}.`
          : `Lead moved to Case Lost. Reason: ${result.reason}.`,

      refresh:
        buildPatientDetailCoreRefreshData_(
          leadId
        ),
      },
        LEAD_VIEW_INVALIDATION_.workflow
      );
  }


  /*
   * UNRELATED
   */
  const allowedTypes =
    getListValues_(
      listsSheet,
      "H2:H8"
    );

  if (
    !allowedTypes.includes(
      unrelatedType
    )
  ) {
    throw new Error(
      `Invalid Unrelated type: ${unrelatedType || "(blank)"}`
    );
  }

  const currentType =
    context.getDisplay(
      "unrelated_type"
    );

  if (
    currentStatus ===
      "Unrelated" &&
    currentType ===
      unrelatedType
  ) {
    return attachLeadViewInvalidation_({

      changed: false,

      message:
        `This lead is already Unrelated with type "${unrelatedType}".`,

      refresh:
        buildPatientDetailCoreRefreshData_(
          leadId
        ),
      },
        LEAD_VIEW_INVALIDATION_.workflow
      );
  }

  const result =
    moveLeadToUnrelated_(
      row,
      {
        unrelatedType,
        note,
        occurredAt:
          new Date(),
      }
    );

  invalidateLeadRowSnapshot_(
    leadId
  );


  return attachLeadViewInvalidation_({

    changed: true,

    message:
      currentStatus ===
      "Unrelated"
        ? `Unrelated type changed to ${result.unrelatedType}.`
        : `Lead moved to Unrelated. Type: ${result.unrelatedType}.`,

    refresh:
      buildPatientDetailCoreRefreshData_(
        leadId
      ),
    },
      LEAD_VIEW_INVALIDATION_.workflow
    );
  } finally {
    endPerf_(perf);
  }
}


/**
 * PHASE 3C-E
 * Marks the current workflow complete from
 * Patient Detail.
 *
 * Completion does not change workflow status.
 */
function patientDetailCompleteWorkflow(
  leadId,
  data = {}
) {
  const perf =
    startPerf_(
      "patientDetailCompleteWorkflow"
    );

  try {
  const row =
    getPatientDetailLeadRowOrThrow_(
      leadId
    );

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName("Leads");

  if (!sheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  const headers =
    getHeaderMap_("Leads");

  const status =
    sheet
      .getRange(
        row,
        headers.status
      )
      .getDisplayValue()
      .trim();

  const workflowComplete =
    Boolean(
      sheet
        .getRange(
          row,
          headers.workflow_complete
        )
        .getValue()
    );

  if (workflowComplete) {
    return attachLeadViewInvalidation_({

      changed: false,
      message:
        "This workflow is already complete.",

      refresh:
        buildPatientDetailCoreRefreshData_(
          leadId
        ),
      },
        LEAD_VIEW_INVALIDATION_.completion
      );
  }

  const note =
    String(
      data.note || ""
    ).trim();

  /*
   * Give the employee an immediate, specific
   * Patient Detail error before entering the core.
   *
   * The core repeats these checks as the final
   * canonical validation boundary.
   */
  if (
    status === "Case Lost" &&
    !note
  ) {
    throw new Error(
      "A completion note is required for Case Lost."
    );
  }

  const result =
    markLeadComplete_(
      row,
      {
        note,
        occurredAt:
          new Date(),
      }
    );

  return attachLeadViewInvalidation_({

    changed: true,

    message:
      `${result.status} workflow marked complete.`,

    refresh:
      buildPatientDetailCoreRefreshData_(
        leadId
      ),
    },
      LEAD_VIEW_INVALIDATION_.completion
    );
  } finally {
    endPerf_(perf);
  }
}


/**
 * Reopens a completed workflow while preserving
 * its current workflow status.
 */
function patientDetailReopenWorkflow(
  leadId,
  data = {}
) {
  const perf =
    startPerf_(
      "patientDetailReopenWorkflow"
    );

  try {
  const row =
    getPatientDetailLeadRowOrThrow_(
      leadId
    );

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName("Leads");

  if (!sheet) {
    throw new Error(
      "Leads worksheet was not found."
    );
  }

  const headers =
    getHeaderMap_("Leads");

  const workflowComplete =
    Boolean(
      sheet
        .getRange(
          row,
          headers.workflow_complete
        )
        .getValue()
    );

  if (!workflowComplete) {
    return attachLeadViewInvalidation_({

      changed: false,
      message:
        "This workflow is already open.",

      refresh:
        buildPatientDetailCoreRefreshData_(
          leadId
        ),
      },
        LEAD_VIEW_INVALIDATION_.completion
      );
  }

  const note =
    String(
      data.note || ""
    ).trim();

  const result =
    reopenLead_(
      row,
      {
        note,
        occurredAt:
          new Date(),
      }
    );

  return attachLeadViewInvalidation_({

    changed: true,

    message:
      `${result.status} workflow reopened.`,

    refresh:
      buildPatientDetailCoreRefreshData_(
        leadId
      ),
    },
      LEAD_VIEW_INVALIDATION_.completion
    );
  } finally {
    endPerf_(perf);
  }
}


/**
 * PHASE 3E
 * Registers an existing Google Drive file from
 * Patient Detail.
 *
 * parentActivityId is optional. When supplied,
 * the attachment is associated with a comment
 * or reply.
 */
function patientDetailAddAttachment(
  leadId,
  data = {}
) {
  const perf =
    startPerf_(
      "patientDetailAddAttachment"
    );

  try {
  const row =
    getPatientDetailLeadRowOrThrow_(
      leadId
    );

  const driveInput =
    String(
      data.driveInput || ""
    ).trim();

  const description =
    String(
      data.description || ""
    ).trim();

  const parentActivityId =
    String(
      data.parentActivityId || ""
    ).trim();


  if (!driveInput) {
    throw new Error(
      "Paste a Google Drive file link or file ID."
    );
  }


  const driveFileId =
    extractGoogleDriveFileId_(
      driveInput
    );


  /*
   * Give Patient Detail an early validation error.
   * registerDriveAttachment_ repeats the canonical
   * validation.
   */
  if (parentActivityId) {
    const parent =
      getActivityById_(
        parentActivityId
      );

    if (!parent) {
      throw new Error(
        "The selected conversation item could not be found."
      );
    }

    if (
      parent.leadId !==
      leadId
    ) {
      throw new Error(
        "The selected conversation item belongs to a different lead."
      );
    }
  }


  const result =
    registerDriveAttachment_(
      row,
      {
        driveFileId,
        parentActivityId,
        description,
        occurredAt:
          new Date(),
      }
    );


  return attachLeadViewInvalidation_({

    changed: true,

    attachmentId:
      result.attachmentId,

    message:
      `Attachment added: ${result.fileName}.`,

    refresh:
      buildPatientDetailRefreshData_(
        leadId
      ),
    },
      LEAD_VIEW_INVALIDATION_.attachment
    );
  } finally {
    endPerf_(perf);
  }
}


/**
 * PHASE 3F
 * Toggles the current employee's reaction on
 * a comment or reply.
 *
 * Returns reaction-scoped state for the one
 * affected activity so Patient Details can update
 * chips in place without reloading the timeline,
 * attachments, or Board/Dashboard.
 */
function patientDetailToggleReaction(
  leadId,
  data = {}
) {
  const perf =
    startPerf_(
      "patientDetailToggleReaction"
    );

  try {
  /*
   * Confirm this permanent lead still exists.
   */
  getPatientDetailLeadRowOrThrow_(
    leadId
  );


  const activityId =
    String(
      data.activityId || ""
    ).trim();

  const emoji =
    String(
      data.emoji || ""
    ).trim();


  if (!activityId) {
    throw new Error(
      "A conversation activity is required."
    );
  }

  if (!emoji) {
    throw new Error(
      "A reaction is required."
    );
  }


  /*
   * Do not trust the browser-supplied emoji.
   */
  const cleanEmoji =
    validateReactionEmoji_(
      emoji
    );


  /*
   * Verify the activity belongs to this lead
   * and is a conversation item.
   */
  const target =
    getActivityById_(
      activityId
    );

  if (!target) {
    throw new Error(
      `Activity not found: ${activityId}`
    );
  }

  if (
    target.leadId !==
    leadId
  ) {
    throw new Error(
      "The selected conversation item belongs to a different lead."
    );
  }


  if (
    !isReactionEligibleActivityType_(
      target.activityType
    )
  ) {
    throw new Error(
      "Reaction audit events cannot receive reactions."
    );
  }


  const actor =
    getActorIdentity_();

  const existing =
    findActiveReaction_(
      activityId,
      cleanEmoji,
      actor
    );


  const occurredAt =
    new Date();


  /*
   * Existing active reaction means the click
   * removes it. Otherwise the click adds it.
   */
  const result =
    existing
      ? removeReaction_({
          leadId,
          activityId,
          emoji:
            cleanEmoji,
          occurredAt,
        })
      : addReaction_({
          leadId,
          activityId,
          emoji:
            cleanEmoji,
          occurredAt,
        });


  const reactionState =
    buildActivityReactionState_(
      leadId,
      activityId
    );


  return attachLeadViewInvalidation_({

    changed: true,

    activityId,

    emoji:
      cleanEmoji,

    active:
      !existing,

    reactionId:
      result.reactionId,

    message:
      existing
        ? `${cleanEmoji} reaction removed.`
        : `${cleanEmoji} reaction added.`,

    lastActivityAt:
      formatDateTimeForPatientDetail_(
        occurredAt
      ),

    reactions:
      reactionState.reactions,

    allowedEmojis:
      reactionState.allowedEmojis,
    },
      LEAD_VIEW_INVALIDATION_.reaction
    );
  } finally {
    endPerf_(perf);
  }
}


/**
 * PHASE 3D
 * Adds an internal employee comment from
 * Patient Detail.
 */
function patientDetailAddComment(
  leadId,
  data = {}
) {
  const perf =
    startPerf_(
      "patientDetailAddComment"
    );

  try {
  const row =
    getPatientDetailLeadRowOrThrow_(
      leadId
    );

  const note =
    String(
      data.note || ""
    ).trim();

  if (!note) {
    throw new Error(
      "Enter a comment."
    );
  }

  const result =
    addLeadComment_(
      row,
      {
        note,
        occurredAt:
          new Date(),
      }
    );

  return attachLeadViewInvalidation_({

    changed: true,

    activityId:
      result.activityId,

    message:
      "Comment added.",

    refresh:
      buildPatientDetailCoreRefreshData_(
        leadId
      ),
    },
      LEAD_VIEW_INVALIDATION_.conversation
    );
  } finally {
    endPerf_(perf);
  }
}


/**
 * Adds a reply from Patient Detail.
 */
function patientDetailAddReply(
  leadId,
  data = {}
) {
  const perf =
    startPerf_(
      "patientDetailAddReply"
    );

  try {
  getPatientDetailLeadRowOrThrow_(
    leadId
  );


  const targetActivityId =
    String(
      data.targetActivityId || ""
    ).trim();

  const note =
    String(
      data.note || ""
    ).trim();


  if (!targetActivityId) {
    throw new Error(
      "Select an activity first."
    );
  }

  if (!note) {
    throw new Error(
      "Enter a reply."
    );
  }


  const target =
    getActivityById_(
      targetActivityId
    );

  if (!target) {
    throw new Error(
      `Activity not found: ${targetActivityId}`
    );
  }

  if (
    target.leadId !==
    leadId
  ) {
    throw new Error(
      "The selected activity belongs to a different lead."
    );
  }


  const result =
    addActivityReply_({
      leadId,

      /*
       * Core resolves this to the original
       * thread root automatically.
       */
      parentActivityId:
        targetActivityId,

      note,

      occurredAt:
        new Date(),
    });


  return attachLeadViewInvalidation_({

    changed: true,

    activityId:
      result.activityId,

    parentActivityId:
      result.parentActivityId,

    message:
      "Reply added.",

    refresh:
      buildPatientDetailCoreRefreshData_(
        leadId
      ),
    },
      LEAD_VIEW_INVALIDATION_.conversation
    );
  } finally {
    endPerf_(perf);
  }
}


/**
 * PHASE 4A
 * Formats a date for Board display.
 */
function formatDateForBoard_(
  value,
  timezone
) {
  if (
    !(value instanceof Date) ||
    isNaN(value.getTime())
  ) {
    return "";
  }

  return Utilities.formatDate(
    value,
    timezone || getSpreadsheetTimezone_(),
    "MM/dd/yyyy"
  );
}


/**
 * Provides a sortable YYYY-MM-DD representation
 * for date-only Board comparisons.
 */
function getBoardDateKey_(
  value,
  timezone
) {
  if (
    !(value instanceof Date) ||
    isNaN(value.getTime())
  ) {
    return "";
  }

  return Utilities.formatDate(
    value,
    timezone,
    "yyyy-MM-dd"
  );
}


function buildBoardFollowUpState_(
  nextFollowUpOn,
  timezone,
  todayKey
) {
  const followUpKey =
    getBoardDateKey_(
      nextFollowUpOn,
      timezone
    );

  if (!followUpKey) {
    return {
      key: "",
      label: "",
    };
  }

  if (
    followUpKey <
    todayKey
  ) {
    return {
      key: "overdue",
      label:
        "Follow-up overdue",
    };
  }

  if (
    followUpKey ===
    todayKey
  ) {
    return {
      key: "due_today",
      label:
        "Follow-up due today",
    };
  }

  return {
    key: "upcoming",
    label:
      "Follow-up scheduled",
  };
}


/**
 * Builds one staff-facing Board card from one
 * canonical Leads row.
 */
function buildBoardCardFromLeadRow_(
  rowValues,
  rowNumber,
  headers,
  context
) {
  const readValue =
    headerName =>
      rowValues[
        headers[headerName] - 1
      ];

  const readText =
    headerName =>
      String(
        readValue(
          headerName
        ) || ""
      ).trim();


  const leadId =
    readText(
      "lead_id"
    );

  if (!leadId) {
    return null;
  }


  const firstName =
    readText(
      "first_name"
    );

  const lastName =
    readText(
      "last_name"
    );

  const fullName =
    [
      firstName,
      lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Unnamed Lead";


  const status =
    readText(
      "status"
    );


  const attemptCount =
    Number(
      readValue(
        "attempt_count"
      )
    ) || 0;


  const reachedPatient =
    Boolean(
      readValue(
        "reached_patient"
      )
    );


  const workflowComplete =
    Boolean(
      readValue(
        "workflow_complete"
      )
    );


  const scheduleDateMissing =
    Boolean(
      readValue(
        "schedule_date_missing"
      )
    );


  const duplicateFlag =
    Boolean(
      readValue(
        "duplicate_flag"
      )
    );


  const nextFollowUpOn =
    readValue(
      "next_follow_up_on"
    );

  const scheduledDate =
    readValue(
      "scheduled_date"
    );

  const createdAt =
    readValue(
      "created_at"
    );

  const lastActivityAt =
    readValue(
      "last_activity_at"
    );


  const followUpState =
    buildBoardFollowUpState_(
      nextFollowUpOn,
      context.timezone,
      context.todayKey
    );


  /*
   * Attempt display intentionally does not destroy
   * attempts beyond the clinic's normal threshold.
   */
  let attemptLabel = "";

  if (
    attemptCount >
    context.maxStandardAttempts
  ) {
    attemptLabel =
      `${attemptCount} attempts`;
  } else {
    attemptLabel =
      `${attemptCount}/${context.maxStandardAttempts}`;
  }


  const warnings = [];


  if (duplicateFlag) {
    warnings.push({
      key:
        "duplicate",
      label:
        "Possible duplicate",
    });
  }


  if (
    status === "Scheduled" &&
    (
      scheduleDateMissing ||
      !(
        scheduledDate instanceof
        Date
      ) ||
      isNaN(
        scheduledDate.getTime()
      )
    )
  ) {
    warnings.push({
      key:
        "schedule_date_missing",
      label:
        "Schedule date needed",
    });
  }


  if (
    status ===
      "Case Lost" &&
    !readText(
      "lost_reason"
    )
  ) {
    warnings.push({
      key:
        "lost_reason_missing",
      label:
        "Case Lost reason missing",
    });
  }


  if (
    status ===
      "Unrelated" &&
    !readText(
      "unrelated_type"
    )
  ) {
    warnings.push({
      key:
        "unrelated_type_missing",
      label:
        "Unrelated type missing",
    });
  }


  if (
    status ===
      "Open Lead / Follow Up" &&
    followUpState.key ===
      "overdue"
  ) {
    warnings.push({
      key:
        "follow_up_overdue",
      label:
        "Follow-up overdue",
    });
  }


  if (
    status ===
      "Open Lead / Follow Up" &&
    followUpState.key ===
      "due_today"
  ) {
    warnings.push({
      key:
        "follow_up_due_today",

      label:
        "Follow-up due today",
    });
  }


  return {
    leadId,

    /*
     * DEV/debug information only.
     * Board actions should ultimately use leadId,
     * not depend on this row number.
     */
    rowNumber,

    status,

    patient: {
      fullName,
      firstName,
      lastName,

      phone:
        readText(
          "phone"
        ),

      email:
        readText(
          "email"
        ),

      appointmentReason:
        readText(
          "appointment_reason"
        ),
    },


    workflow: {
      assignedTo:
        readText(
          "assigned_to"
        ),

      attemptCount,

      attemptLabel,

      reachedPatient,

      reachedLabel:
        reachedPatient
          ? "Reached"
          : "Not reached",

      lastContactOutcome:
        readText(
          "last_contact_outcome"
        ),

      nextFollowUpOn:
        formatDateForBoard_(
          nextFollowUpOn,
          context.timezone
        ),

      followUpState,

      scheduledDate:
        formatDateForBoard_(
          scheduledDate,
          context.timezone
        ),

      scheduleDateMissing,

      workflowComplete,

      lostReason:
        readText(
          "lost_reason"
        ),

      unrelatedType:
        readText(
          "unrelated_type"
        ),
    },


    source: {
      intakeSource:
        readText(
          "intake_source"
        ),

      pageName:
        readText(
          "page_name"
        ),

      createdAt:
        formatDateTimeForPatientDetail_(
          createdAt
        ),

      lastActivityAt:
        formatDateTimeForPatientDetail_(
          lastActivityAt
        ),
    },


    warnings,


    /*
     * Numeric sort values stay internal to Board
     * logic and are not patient-facing strings.
     */
    sort: {
      createdAt:
        createdAt instanceof Date &&
        !isNaN(
          createdAt.getTime()
        )
          ? createdAt.getTime()
          : 0,

      lastActivityAt:
        lastActivityAt instanceof Date &&
        !isNaN(
          lastActivityAt.getTime()
        )
          ? lastActivityAt.getTime()
          : 0,

      followUpOn:
        nextFollowUpOn instanceof
          Date &&
        !isNaN(
          nextFollowUpOn.getTime()
        )
          ? nextFollowUpOn.getTime()
          : 0,

      scheduledDate:
        scheduledDate instanceof
          Date &&
        !isNaN(
          scheduledDate.getTime()
        )
          ? scheduledDate.getTime()
          : 0,
    },
  };
}


/**
 * Builds the complete four-lane Board data model.
 */
function buildPatientBoardData_(leadsTable) {
  const table =
    leadsTable ||
    getCanonicalSheetTable_(
      "Leads"
    );

  const headers =
    table.headers;

  const timezone =
    getSpreadsheetTimezone_();


  let maxStandardAttempts =
    3;

  try {
    maxStandardAttempts =
      Number(
        getConfigValue_(
          "max_standard_contact_attempts"
        )
      ) || 3;
  } catch (error) {
    maxStandardAttempts =
      3;
  }


  const todayKey =
    Utilities.formatDate(
      new Date(),
      timezone,
      "yyyy-MM-dd"
    );


  const lanes =
    PATIENT_BOARD_LANES.map(
      lane => ({
        key:
          lane.key,

        status:
          lane.status,

        title:
          lane.title,

        cards: [],
      })
    );


  const laneByStatus = {};

  lanes.forEach(
    lane => {
      laneByStatus[
        lane.status
      ] = lane;
    }
  );


  const invalidStatusCards = [];


  if (table.values.length > 0) {
    const rows =
      table.values;


    const context = {
      timezone,
      todayKey,
      maxStandardAttempts,
    };


    rows.forEach(
      (
        rowValues,
        index
      ) => {
        const rowNumber =
          index + 2;

        /*
         * Archived leads stay in Leads and keep
         * their workflow status. They are not a
         * Board lane and are not invalid-status
         * warnings.
         */
        if (
          isLeadRowArchived_(
            headers,
            rowValues
          )
        ) {
          return;
        }

        const card =
          buildBoardCardFromLeadRow_(
            rowValues,
            rowNumber,
            headers,
            context
          );

        if (!card) {
          return;
        }


        const lane =
          laneByStatus[
            card.status
          ];


        if (!lane) {
          /*
           * Never silently hide a lead with a
           * malformed or unexpected workflow status.
           */
          invalidStatusCards.push(
            card
          );

          return;
        }


        lane.cards.push(
          card
        );
      }
    );
  }


  /*
   * Phase 4D:
   * Sort Board presentation without changing
   * canonical Leads row order.
   */
  sortPatientBoardLanes_(
    lanes
  );


  /*
   * Calculate lane-specific operational counts.
   */
  lanes.forEach(
    lane => {
      lane.metrics =
        buildBoardLaneMetrics_(
          lane
        );
    }
  );


  const summary =
    buildPatientBoardSummary_(
      lanes
    );


  const totalCards =
    summary.totalCards;


  return {
    generatedAt:
      formatDateTimeForPatientDetail_(
        new Date()
      ),

    timezone,

    maxStandardAttempts,

    totalCards,

    summary,

    invalidStatusCount:
      invalidStatusCards.length,

    invalidStatusCards,

    lanes,
  };
}


/**
 * Public Board read endpoint.
 *
 * Phase 4B will use this when rendering or
 * refreshing the visible Board.
 */
function getPatientBoardData() {
  return buildPatientBoardData_();
}


/**
 * PHASE 4D
 * Tie-breaker used by Board sorting.
 */
function compareBoardCardsByName_(
  a,
  b
) {
  return String(
    a.patient.fullName || ""
  ).localeCompare(
    String(
      b.patient.fullName || ""
    )
  );
}


/**
 * Priority bucket for Open Lead / Follow Up.
 */
function getOpenBoardPriority_(
  card
) {
  const followUpKey =
    card.workflow.followUpState
      ? card.workflow.followUpState.key
      : "";

  if (
    followUpKey ===
    "overdue"
  ) {
    return 0;
  }

  if (
    followUpKey ===
    "due_today"
  ) {
    return 1;
  }

  if (
    Number(
      card.workflow.attemptCount
    ) === 0
  ) {
    return 2;
  }

  if (
    followUpKey ===
    "upcoming"
  ) {
    return 3;
  }

  return 4;
}


/**
 * Sorts the Open lane operationally.
 */
function sortOpenBoardCards_(
  cards
) {
  cards.sort(
    (a, b) => {
      const aPriority =
        getOpenBoardPriority_(
          a
        );

      const bPriority =
        getOpenBoardPriority_(
          b
        );


      if (
        aPriority !==
        bPriority
      ) {
        return (
          aPriority -
          bPriority
        );
      }


      /*
       * Follow-up groups:
       * earliest follow-up first.
       */
      if (
        aPriority === 0 ||
        aPriority === 1 ||
        aPriority === 3
      ) {
        const aFollowUp =
          a.sort.followUpOn ||
          Number.MAX_SAFE_INTEGER;

        const bFollowUp =
          b.sort.followUpOn ||
          Number.MAX_SAFE_INTEGER;

        if (
          aFollowUp !==
          bFollowUp
        ) {
          return (
            aFollowUp -
            bFollowUp
          );
        }
      }


      /*
       * Within untouched/remaining leads,
       * oldest lead comes first so aging leads
       * do not disappear underneath newer ones.
       */
      const aCreated =
        a.sort.createdAt ||
        Number.MAX_SAFE_INTEGER;

      const bCreated =
        b.sort.createdAt ||
        Number.MAX_SAFE_INTEGER;

      if (
        aCreated !==
        bCreated
      ) {
        return (
          aCreated -
          bCreated
        );
      }


      return (
        compareBoardCardsByName_(
          a,
          b
        )
      );
    }
  );
}


function sortScheduledBoardCards_(
  cards
) {
  cards.sort(
    (a, b) => {
      const aMissing =
        Boolean(
          a.workflow
            .scheduleDateMissing
        ) ||
        !a.sort.scheduledDate;

      const bMissing =
        Boolean(
          b.workflow
            .scheduleDateMissing
        ) ||
        !b.sort.scheduledDate;


      /*
       * Missing date always needs attention first.
       */
      if (
        aMissing !==
        bMissing
      ) {
        return aMissing
          ? -1
          : 1;
      }


      /*
       * Incomplete workflows before completed ones.
       */
      if (
        a.workflow
          .workflowComplete !==
        b.workflow
          .workflowComplete
      ) {
        return a.workflow
          .workflowComplete
          ? 1
          : -1;
      }


      /*
       * Earliest scheduled appointment first.
       */
      const aDate =
        a.sort.scheduledDate ||
        Number.MAX_SAFE_INTEGER;

      const bDate =
        b.sort.scheduledDate ||
        Number.MAX_SAFE_INTEGER;


      if (
        aDate !==
        bDate
      ) {
        return (
          aDate -
          bDate
        );
      }


      /*
       * Most recently active first as tie-breaker.
       */
      if (
        a.sort.lastActivityAt !==
        b.sort.lastActivityAt
      ) {
        return (
          b.sort.lastActivityAt -
          a.sort.lastActivityAt
        );
      }


      return (
        compareBoardCardsByName_(
          a,
          b
        )
      );
    }
  );
}


function sortClosedBoardCards_(
  cards
) {
  cards.sort(
    (a, b) => {
      /*
       * Records that still need workflow completion
       * stay above already-completed records.
       */
      if (
        a.workflow
          .workflowComplete !==
        b.workflow
          .workflowComplete
      ) {
        return a.workflow
          .workflowComplete
          ? 1
          : -1;
      }


      /*
       * Within each group, newest activity first.
       */
      if (
        a.sort.lastActivityAt !==
        b.sort.lastActivityAt
      ) {
        return (
          b.sort.lastActivityAt -
          a.sort.lastActivityAt
        );
      }


      return (
        compareBoardCardsByName_(
          a,
          b
        )
      );
    }
  );
}


/**
 * Applies the correct sort rules to every lane.
 */
function sortPatientBoardLanes_(
  lanes
) {
  lanes.forEach(
    lane => {
      switch (
        lane.status
      ) {
        case "Open Lead / Follow Up":
          sortOpenBoardCards_(
            lane.cards
          );
          break;

        case "Scheduled":
          sortScheduledBoardCards_(
            lane.cards
          );
          break;

        case "Case Lost":
        case "Unrelated":
          sortClosedBoardCards_(
            lane.cards
          );
          break;
      }
    }
  );

  return lanes;
}


function buildBoardLaneMetrics_(
  lane
) {
  const cards =
    lane.cards || [];


  const metrics = {
    count:
      cards.length,

    overdue:
      0,

    dueToday:
      0,

    untouched:
      0,

    scheduleDateNeeded:
      0,

    complete:
      0,
  };


  cards.forEach(
    card => {
      if (
        card.workflow
          .workflowComplete
      ) {
        metrics.complete += 1;
      }


      if (
        lane.status ===
        "Open Lead / Follow Up"
      ) {
        const followUpKey =
          card.workflow
            .followUpState
            ? card.workflow
                .followUpState
                .key
            : "";


        if (
          followUpKey ===
          "overdue"
        ) {
          metrics.overdue += 1;
        }


        if (
          followUpKey ===
          "due_today"
        ) {
          metrics.dueToday += 1;
        }


        if (
          Number(
            card.workflow
              .attemptCount
          ) === 0
        ) {
          metrics.untouched += 1;
        }
      }


      if (
        lane.status ===
          "Scheduled" &&
        (
          card.workflow
            .scheduleDateMissing ||
          !card.sort
            .scheduledDate
        )
      ) {
        metrics
          .scheduleDateNeeded += 1;
      }
    }
  );


  return metrics;
}


function buildPatientBoardSummary_(
  lanes
) {
  const summary = {
    totalCards: 0,

    overdueFollowUps: 0,

    dueToday: 0,

    untouchedOpen: 0,

    scheduleDateNeeded: 0,

    completed: 0,

    warnings: 0,
  };


  lanes.forEach(
    lane => {
      summary.totalCards +=
        lane.cards.length;


      lane.cards.forEach(
        card => {
          if (
            card.workflow
              .workflowComplete
          ) {
            summary.completed +=
              1;
          }


          if (
            Array.isArray(
              card.warnings
            )
          ) {
            summary.warnings +=
              card.warnings.length;
          }


          if (
            lane.status ===
            "Open Lead / Follow Up"
          ) {
            const key =
              card.workflow
                .followUpState
                ? card.workflow
                    .followUpState
                    .key
                : "";


            if (
              key ===
              "overdue"
            ) {
              summary
                .overdueFollowUps +=
                1;
            }


            if (
              key ===
              "due_today"
            ) {
              summary.dueToday +=
                1;
            }


            if (
              Number(
                card.workflow
                  .attemptCount
              ) === 0
            ) {
              summary
                .untouchedOpen +=
                1;
            }
          }


          if (
            lane.status ===
              "Scheduled" &&
            (
              card.workflow
                .scheduleDateMissing ||
              !card.sort
                .scheduledDate
            )
          ) {
            summary
              .scheduleDateNeeded +=
              1;
          }
        }
      );
    }
  );


  return summary;
}


/**
 * PHASE 4B
 * Converts one Board card object into the concise
 * text employees see on the Board.
 */
function buildBoardCardDisplayText_(
  card
) {
  const lines = [];


  /*
   * Identity
   */
  lines.push(
    card.patient.fullName
  );


  if (
    card.patient.appointmentReason
  ) {
    lines.push(
      card.patient.appointmentReason
    );
  }


  /*
   * Contact progress
   */
  lines.push(
    [
      `☎ ${card.workflow.attemptLabel}`,

      card.workflow.reachedPatient
        ? "✓ Reached"
        : "Not reached",
    ].join("  •  ")
  );


  if (
    card.workflow.lastContactOutcome
  ) {
    lines.push(
      `Last: ${card.workflow.lastContactOutcome}`
    );
  }


  /*
   * Assignment
   */
  lines.push(
    card.workflow.assignedTo
      ? `Assigned: ${card.workflow.assignedTo}`
      : "Assigned: Unassigned"
  );


  /*
   * Status-specific information
   */
  if (
    card.status ===
    "Open Lead / Follow Up"
  ) {
    if (
      card.workflow.nextFollowUpOn
    ) {
      lines.push(
        `Follow-up: ${card.workflow.nextFollowUpOn}`
      );
    }
  }


  if (
    card.status ===
    "Scheduled"
  ) {
    if (
      card.workflow.scheduledDate
    ) {
      lines.push(
        `Scheduled: ${card.workflow.scheduledDate}`
      );
    } else {
      lines.push(
        "Scheduled: DATE NEEDED"
      );
    }
  }


  if (
    card.status ===
      "Case Lost" &&
    card.workflow.lostReason
  ) {
    lines.push(
      `Reason: ${card.workflow.lostReason}`
    );
  }


  if (
    card.status ===
      "Unrelated" &&
    card.workflow.unrelatedType
  ) {
    lines.push(
      `Type: ${card.workflow.unrelatedType}`
    );
  }


  /*
   * Completion indicator
   */
  if (
    card.workflow.workflowComplete
  ) {
    lines.push(
      "✓ Workflow complete"
    );
  }


  /*
   * Warnings always appear last.
   */
  if (
    Array.isArray(
      card.warnings
    ) &&
    card.warnings.length > 0
  ) {
    lines.push(
      "⚠ " +
      card.warnings
        .map(
          warning =>
            warning.label
        )
        .join(" • ")
    );
  }


  return lines.join(
    "\n"
  );
}


/**
 * Returns visual styling for one workflow lane.
 *
 * These are deliberately subtle so warnings and
 * patient information remain readable.
 */
function getBoardLaneStyle_(
  status
) {
  switch (status) {

    case "Open Lead / Follow Up":
      return {
        headerBackground:
          "#17233A",

        headerFontColor:
          "#7EB0FF",

        headerAccentColor:
          "#3B82F6",

        cardBackground:
          "#151D2A",

        cardFontColor:
          "#F3F4F6",

        cardBorderColor:
          "#303640",

        leftAccentColor:
          "#3B82F6",
      };


    case "Scheduled":
      return {
        headerBackground:
          "#172B20",

        headerFontColor:
          "#78D391",

        headerAccentColor:
          "#4FA66A",

        cardBackground:
          "#17241C",

        cardFontColor:
          "#EAF7EE",

        cardBorderColor:
          "#304038",

        leftAccentColor:
          "#4FA66A",
      };


    case "Case Lost":
      return {
        headerBackground:
          "#301B1D",

        headerFontColor:
          "#F0928A",

        headerAccentColor:
          "#D06A62",

        cardBackground:
          "#281A1B",

        cardFontColor:
          "#F8EDED",

        cardBorderColor:
          "#493033",

        leftAccentColor:
          "#C85F59",
      };


    case "Unrelated":
      return {
        headerBackground:
          "#24282F",

        headerFontColor:
          "#C3C9D1",

        headerAccentColor:
          "#8A919B",

        cardBackground:
          "#1C2026",

        cardFontColor:
          "#E3E7EC",

        cardBorderColor:
          "#343A43",

        leftAccentColor:
          "#7D8793",
      };


    default:
      return {
        headerBackground:
          "#24282F",

        headerFontColor:
          "#C3C9D1",

        headerAccentColor:
          "#8A919B",

        cardBackground:
          "#1C2026",

        cardFontColor:
          "#E3E7EC",

        cardBorderColor:
          "#343A43",

        leftAccentColor:
          "#7D8793",
      };
  }
}


/**
 * Open Lead / Follow Up patient-card heatmap.
 *
 * Uses the Board card's existing in-memory
 * attemptCount. Scale is capped at 3+.
 * Warning cards are styled separately and
 * take precedence over this heatmap.
 */
function getOpenLeadAttemptBackground_(
  attemptCount
) {
  const cappedAttemptCount =
    Math.max(
      0,
      Math.min(
        3,
        Number(attemptCount) || 0
      )
    );

  switch (cappedAttemptCount) {

    case 0:
      return "#151D2A";

    case 1:
      return "#1B2A3E";

    case 2:
      return "#203E5C";

    case 3:
    default:
      /*
       * Noticeably brighter than level 2, still a
       * muted blue that keeps light card text
       * readable. 4+ uses this same shade.
       */
      return "#285A86";
  }
}


function buildBoardLaneCountText_(
  lane
) {
  const metrics =
    lane.metrics || {
      count:
        lane.cards.length,
    };


  const countText =
    `${metrics.count} ${
      metrics.count === 1
        ? "lead"
        : "leads"
    }`;


  const parts = [
    countText,
  ];


  if (
    lane.status ===
    "Open Lead / Follow Up"
  ) {
    if (
      metrics.overdue > 0
    ) {
      parts.push(
        `${metrics.overdue} overdue`
      );
    }

    if (
      metrics.dueToday > 0
    ) {
      parts.push(
        `${metrics.dueToday} due today`
      );
    }

    if (
      metrics.untouched > 0
    ) {
      parts.push(
        `${metrics.untouched} untouched`
      );
    }
  }


  if (
    lane.status ===
    "Scheduled"
  ) {
    if (
      metrics
        .scheduleDateNeeded >
      0
    ) {
      parts.push(
        `${metrics.scheduleDateNeeded} date needed`
      );
    }

    if (
      metrics.complete > 0
    ) {
      parts.push(
        `${metrics.complete} complete`
      );
    }
  }


  if (
    lane.status ===
      "Case Lost" ||
    lane.status ===
      "Unrelated"
  ) {
    if (
      metrics.complete > 0
    ) {
      parts.push(
        `${metrics.complete} complete`
      );
    }
  }


  return parts.join(
    " • "
  );
}


function renderBoardLaneHeader_(
  sheet,
  lane,
  startColumn
) {
  const layout =
    PATIENT_BOARD_LAYOUT;

  const style =
    getBoardLaneStyle_(
      lane.status
    );


  /*
   * Lane name — laneTitleRow (physical row 2)
   */
  const titleRange =
    sheet.getRange(
      layout.laneTitleRow,
      startColumn,
      1,
      4
    );

  titleRange.merge();

  titleRange
    .setBackground(
      style.headerBackground
    )
    .setFontWeight(
      "bold"
    )
    .setFontSize(
      12
    )
    .setFontColor(
      style.headerFontColor
    )
    .setHorizontalAlignment(
      "left"
    )
    .setVerticalAlignment(
      "middle"
    );


  /*
   * Lead count — laneCountRow (physical row 3)
   */
  const countRange =
    sheet.getRange(
      layout.laneCountRow,
      startColumn,
      1,
      4
    );

  countRange.merge();


  countRange
    .setBackground(
      style.headerBackground
    )
    .setFontSize(
      9
    )
    .setFontColor(
      "#AAB2BF"
    )
    .setHorizontalAlignment(
      "left"
    )
    .setVerticalAlignment(
      "middle"
    );


  /*
   * Hairline around the two-row header, then a
   * stronger bottom accent that does not replace
   * the other edges.
   */
  const headerRange =
    sheet.getRange(
      layout.laneTitleRow,
      startColumn,
      2,
      4
    );

  headerRange.setBorder(
    true,
    true,
    true,
    true,
    false,
    false,
    "#303640",
    SpreadsheetApp
      .BorderStyle
      .SOLID
  );

  headerRange.setBorder(
    null,
    null,
    true,
    null,
    null,
    null,
    style.headerAccentColor,
    SpreadsheetApp
      .BorderStyle
      .SOLID_MEDIUM
  );
}


function renderBoardCard_(
  sheet,
  card,
  startColumn,
  cardRow
) {
  /*
   * Each card occupies four merged columns.
   * Text and shared formatting are applied in
   * batches by renderPatientBoard().
   */
  const cardRange =
    sheet.getRange(
      cardRow,
      startColumn,
      1,
      4
    );

  cardRange.merge();


  /*
   * Store permanent card identity invisibly
   * as SHEET-level developer metadata.
   *
   * Google Sheets does not support adding developer
   * metadata to an arbitrary cell/range, so the
   * card's anchor address is encoded in the key.
   */
  const metadata = {
    type:
      "patient_board_card",

    leadId:
      card.leadId,

    status:
      card.status,
  };


  const metadataKey =
    "PATIENT_BOARD_CARD_" +
    cellA1Notation_(
      cardRow,
      startColumn
    );


  sheet.addDeveloperMetadata(
    metadataKey,

    JSON.stringify(
      metadata
    ),

    SpreadsheetApp
      .DeveloperMetadataVisibility
      .DOCUMENT
  );
}


function preparePatientBoardSheet_(
  sheet,
  boardData
) {
  const layout =
    PATIENT_BOARD_LAYOUT;


  const largestLaneSize =
    Math.max(
      0,
      ...boardData.lanes.map(
        lane =>
          lane.cards.length
      )
    );


  /*
   * Card rows alternate below the static header:
   *
   * row 5 card
   * row 6 spacer
   * row 7 card
   * row 8 spacer
   * ...
   *
   * requiredRows is the inclusive last physical
   * row of the Board presentation area, not a
   * getRange() row count.
   */
  const requiredRows =
    Math.max(
      20,
      layout.firstCardRow +
      (
        largestLaneSize *
        2
      ) +
      2
    );


  if (
    sheet.getMaxRows() <
    requiredRows
  ) {
    sheet.insertRowsAfter(
      sheet.getMaxRows(),
      requiredRows -
      sheet.getMaxRows()
    );
  }


  /*
   * Clear A2:X{lastClearRow}, not merely A2:T.
   *
   * A2:T fully contains old and new lane merges
   * (A:D / B:E … P:S / Q:T) but only the first
   * column of the leftover T:W action-rail merges.
   * breakApart() on that partial range throws:
   * "You must select all cells in a merged range
   * to merge or unmerge them."
   *
   * A2:X fully contains:
   *   old lanes A:D F:I K:N P:S
   *   new lanes B:E G:J L:O Q:T
   *   old rail  T:W
   *   new rail  U:X
   *
   * Column A is the empty logo gutter and is
   * included only so leftover A:D merges unmerge.
   * Row 1 is never part of this range.
   *
   * Canvas paint stays A2:T. Values stay B:T.
   * Rail restyle stays U:X.
   *
   * Clearing getMaxRows() rewrote unused empty rows
   * on every refresh.
   *
   * Do not touch Leads or any backend sheet.
   */
  const lastClearRow =
    Math.max(
      sheet.getLastRow(),
      requiredRows,
      layout.firstCardRow
    );

  const clearRowCount =
    boardDynamicRowCount_(
      lastClearRow
    );

  const boardRange =
    sheet.getRange(
      layout.firstDynamicRow,
      layout.gutterColumn,
      clearRowCount,
      layout.applicationHeaderLastColumn -
        layout.gutterColumn +
        1
    );


  /*
   * Pass 3.5: Board-card developer metadata is
   * sheet-level and survives cell clear/rebuild.
   * renderPatientBoard() diffs it after cards are
   * reconstructed instead of deleting every entry
   * here.
   *
   * Over-grid Drawings (OPEN PATIENT button) are
   * not cell content. Do not delete sheet images
   * or drawings during this rebuild.
   */


  /*
   * Remove old card merges before rebuilding.
   */
  withPerf_(
    "board breakApart/clear",
    () => {
      boardRange.breakApart();
      boardRange.clearContent();
      boardRange.clearFormat();
      boardRange.clearNote();
      boardRange.clearDataValidations();
    }
  );


  /*
   * Hide normal spreadsheet gridlines so the
   * Board feels more like an operational workspace.
   */
  sheet.setHiddenGridlines(
    true
  );


  /*
   * Canvas + default font on the current DYNAMIC
   * Board presentation area only: A2:T{requiredRows}.
   * Column A is an empty dark gutter under the logo.
   * requiredRows is the last physical row; convert
   * it to a row count from firstDynamicRow. Never
   * paint row 1.
   *
   * Stale cards below this area were already reset
   * by the clear above; they are not restyled here.
   */
  withPerf_(
    "board canvas/font",
    () => {
      sheet
        .getRange(
          layout.firstDynamicRow,
          layout.gutterColumn,
          boardDynamicRowCount_(
            requiredRows
          ),
          layout.lastBoardColumn
        )
        .setBackground(
          layout.canvasBackground
        )
        .setFontFamily(
          layout.fontFamily
        )
        .setFontColor(
          layout.canvasFontColor
        );
    }
  );


  /*
   * Logo / empty gutter. Keep 60px so A1 has room
   * and A2:A looks like intentional left padding.
   */
  sheet.setColumnWidth(
    layout.gutterColumn,
    layout.laneColumnWidth
  );


  /*
   * Lane widths.
   */
  layout.laneStarts.forEach(
    startColumn => {
      for (
        let offset = 0;
        offset < 4;
        offset++
      ) {
        sheet.setColumnWidth(
          startColumn +
          offset,
          layout.laneColumnWidth
        );
      }
    }
  );


  /*
   * Spacer columns.
   */
  layout.spacerColumns.forEach(
    column => {
      sheet.setColumnWidth(
        column,
        layout.spacerColumnWidth
      );
    }
  );


  /*
   * Dynamic header heights. Row 1 height is owned
   * by setupStaticApplicationHeaders().
   */
  sheet.setRowHeight(
    layout.laneTitleRow,
    layout.titleRowHeight
  );

  sheet.setRowHeight(
    layout.laneCountRow,
    layout.countRowHeight
  );

  sheet.setRowHeight(
    layout.summaryRow,
    layout.summaryRowHeight
  );


  /*
   * Card/spacer heights.
   */
  for (
    let index = 0;
    index < largestLaneSize;
    index++
  ) {
    const cardRow =
      layout.firstCardRow +
      (
        index *
        2
      );

    const spacerRow =
      cardRow + 1;


    sheet.setRowHeight(
      cardRow,
      layout.cardRowHeight
    );

    sheet.setRowHeight(
      spacerRow,
      layout.spacerRowHeight
    );
  }


  /*
   * Keep the static application header and lane
   * headings visible while scrolling.
   */
  sheet.setFrozenRows(
    layout.frozenRows
  );


  withPerf_(
    "board action rail",
    () => applyBoardActionRail_(
      sheet,
      requiredRows,
      lastClearRow
    )
  );
}


function applyBoardActionRail_(
  sheet,
  requiredRows,
  lastClearRow
) {
  const layout =
    PATIENT_BOARD_LAYOUT;


  /*
   * The action rail begins below the static
   * application header and must end on the same
   * physical row as the Board canvas. Never
   * include row 1. Never use a fixed A1 range.
   *
   * Clear through lastClearRow (already in memory)
   * so a shrinking Board does not leave a taller
   * sidebar. Paint only through requiredRows so
   * the dark rail and canvas bottoms align.
   */
  const railStartRow =
    layout.firstDynamicRow;

  const railClearLastRow =
    Math.max(
      requiredRows,
      lastClearRow
    );


  const railClear =
    sheet.getRange(
      railStartRow,
      layout.actionRailFirstColumn,
      boardDynamicRowCount_(
        railClearLastRow
      ),
      layout.actionRailColumnCount
    );


  railClear.breakApart();
  railClear.clearContent();
  railClear.clearFormat();
  railClear.clearNote();
  railClear.clearDataValidations();


  const rail =
    sheet.getRange(
      railStartRow,
      layout.actionRailFirstColumn,
      boardDynamicRowCount_(
        requiredRows
      ),
      layout.actionRailColumnCount
    );


  rail
    .setBackground(
      "#171A21"
    )
    .setFontFamily(
      layout.fontFamily
    )
    .setFontColor(
      "#F3F4F6"
    )
    .setBorder(
      false,
      true,
      false,
      false,
      false,
      false,
      "#303640",
      SpreadsheetApp
        .BorderStyle
        .SOLID
    );


  for (
    let offset = 0;
    offset < layout.actionRailColumnCount;
    offset++
  ) {
    sheet.setColumnWidth(
      layout.actionRailFirstColumn +
      offset,
      layout.actionRailColumnWidth
    );
  }


  /*
   * U2:X3 stays an empty dark surface for manual
   * OPEN PATIENT / QUICK ACTIONS Drawings. Do not
   * create, move, or delete Drawings here.
   *
   * Rows below the drawings stay an empty dark
   * surface. Do not write a title into this rail.
   */
}


/**
 * True when A1 (or any cell) is part of a merge
 * that spans more than one cell.
 */
function cellIsInMultiCellMerge_(cell) {
  if (!cell) {
    return false;
  }

  const mergedRanges =
    cell.getMergedRanges();

  if (
    !mergedRanges ||
    !mergedRanges.length
  ) {
    return false;
  }

  const merge =
    mergedRanges[0];

  return (
    merge.getNumColumns() > 1 ||
    merge.getNumRows() > 1
  );
}


/**
 * Prepares row 1 for a static application header
 * without destroying A1 after a logo exists.
 *
 * First-time migration: if A1 is part of an old
 * multi-cell merge (Dashboard title or Board lane
 * header), unmerge it and clear leftover title
 * text. An in-cell logo cannot exist in that merge.
 *
 * Later runs: never clear, overwrite, or merge A1.
 * Only B1:lastColumn is breakApart/cleared.
 */
function prepareStaticHeaderRow1_(
  sheet,
  lastColumn
) {
  const logoCell =
    sheet.getRange(
      1,
      1
    );

  if (
    cellIsInMultiCellMerge_(
      logoCell
    )
  ) {
    logoCell
      .getMergedRanges()[0]
      .breakApart();

    logoCell.clearContent();
    logoCell.clearNote();
  }

  const titleRange =
    sheet.getRange(
      1,
      2,
      1,
      lastColumn - 1
    );

  titleRange.breakApart();
  titleRange.clearContent();
  titleRange.clearFormat();
  titleRange.clearNote();
  titleRange.clearDataValidations();

  return titleRange;
}


function applyStaticApplicationHeaderTitle_(
  sheet,
  lastColumn,
  titleText,
  rowHeight
) {
  const headerRow =
    sheet.getRange(
      1,
      1,
      1,
      lastColumn
    );

  const titleRange =
    sheet.getRange(
      1,
      2,
      1,
      lastColumn - 1
    );

  titleRange.merge();

  titleRange
    .setValue(
      titleText
    )
    .setFontFamily(
      "Roboto"
    )
    .setFontSize(
      18
    )
    .setFontWeight(
      "bold"
    )
    .setFontColor(
      "#F3F4F6"
    )
    .setHorizontalAlignment(
      "left"
    )
    .setVerticalAlignment(
      "middle"
    );

  headerRow
    .setBackground(
      "#171A21"
    )
    .setBorder(
      false,
      false,
      true,
      false,
      false,
      false,
      "#303640",
      SpreadsheetApp
        .BorderStyle
        .SOLID
    );

  if (rowHeight) {
    sheet.setRowHeight(
      1,
      rowHeight
    );
  }
}


/**
 * Admin/setup only. Do not call from
 * renderPatientBoard().
 *
 * Safe to rerun: A1 is never cleared, overwritten,
 * or merged after the first-time row-1 migration.
 */
function setupBoardStaticHeader() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      "Board"
    );

  if (!sheet) {
    throw new Error(
      "Board worksheet was not found."
    );
  }

  const layout =
    PATIENT_BOARD_LAYOUT;

  prepareStaticHeaderRow1_(
    sheet,
    layout.applicationHeaderLastColumn
  );

  applyStaticApplicationHeaderTitle_(
    sheet,
    layout.applicationHeaderLastColumn,
    "The Urology Place — Patient Leads",
    layout.applicationHeaderRowHeight
  );

  sheet.setFrozenRows(
    layout.frozenRows
  );

  return {
    sheet:
      "Board",
    title:
      "The Urology Place — Patient Leads",
    logoCell:
      "A1",
  };
}


/**
 * Admin/setup only. Do not call from
 * refreshDashboardData().
 *
 * Safe to rerun: A1 is never cleared, overwritten,
 * or merged after the first-time A1:J1 unmerge.
 */
function setupDashboardStaticHeader() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );

  if (!sheet) {
    throw new Error(
      "Dashboard worksheet was not found."
    );
  }

  prepareStaticHeaderRow1_(
    sheet,
    10
  );

  applyStaticApplicationHeaderTitle_(
    sheet,
    10,
    "The Urology Place — Lead Dashboard",
    PATIENT_BOARD_LAYOUT
      .applicationHeaderRowHeight
  );

  return {
    sheet:
      PATIENT_DASHBOARD
        .dashboardSheet,
    title:
      "The Urology Place — Lead Dashboard",
    logoCell:
      "A1",
  };
}


/**
 * Admin/setup only.
 *
 * Do not call from renderPatientBoard() or
 * refreshDashboardData().
 */
function setupStaticApplicationHeaders() {
  const board =
    setupBoardStaticHeader();

  const dashboard =
    setupDashboardStaticHeader();

  SpreadsheetApp
    .getActiveSpreadsheet()
    .toast(
      "Static application headers are ready. Insert the clinic logo into A1 on Board and Dashboard using Insert → Image → Insert image in cell.",
      "Header Setup",
      8
    );

  return {
    board,
    dashboard,
  };
}


function buildBoardSummaryText_(
  boardData
) {
  const summary =
    boardData.summary;


  const parts = [
    `${summary.totalCards} total`,
  ];


  if (
    summary.overdueFollowUps >
    0
  ) {
    parts.push(
      `${summary.overdueFollowUps} overdue`
    );
  }


  if (
    summary.dueToday >
    0
  ) {
    parts.push(
      `${summary.dueToday} due today`
    );
  }


  if (
    summary.untouchedOpen >
    0
  ) {
    parts.push(
      `${summary.untouchedOpen} untouched`
    );
  }


  if (
    summary.scheduleDateNeeded >
    0
  ) {
    parts.push(
      `${summary.scheduleDateNeeded} schedule date needed`
    );
  }


  parts.push(
    `Refreshed ${boardData.generatedAt}`
  );

  parts.push(
    "Select a patient card, then click OPEN PATIENT"
  );


  return parts.join(
    "  •  "
  );
}


function renderBoardSummaryStrip_(
  sheet,
  boardData
) {
  const layout =
    PATIENT_BOARD_LAYOUT;

  const range =
    sheet.getRange(
      layout.summaryRow,
      boardFirstValuesColumn_(),
      1,
      boardValuesColumnCount_()
    );


  range.merge();

  range
    .setBackground(
      "#171A21"
    )
    .setFontColor(
      "#C7CDD6"
    )
    .setFontSize(
      9
    )
    .setFontWeight(
      "normal"
    )
    .setHorizontalAlignment(
      "left"
    )
    .setVerticalAlignment(
      "middle"
    )
    .setBorder(
      false,
      false,
      true,
      false,
      false,
      false,
      "#303640",
      SpreadsheetApp
        .BorderStyle
        .SOLID
    );
}


/**
 * PHASE 4G
 * Adds a warning note to Board headers explaining
 * that the Board is a generated operational view.
 */
function addBoardUsageNotes_(
  sheet,
  boardData
) {
  boardData.lanes.forEach(
    (
      lane,
      laneIndex
    ) => {
      const startColumn =
        PATIENT_BOARD_LAYOUT
          .laneStarts[
            laneIndex
          ];

      const headerCell =
        sheet.getRange(
          PATIENT_BOARD_LAYOUT.laneTitleRow,
          startColumn
        );

      headerCell.setNote(
        "Generated workflow view.\n\n" +
        "Do not manually edit or move patient cards.\n" +
        "Select a patient card and use the Patient Leads menu instead."
      );
    }
  );
}


function getSelectedBoardLeadIdForRefresh_() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const activeSheet =
    ss.getActiveSheet();


  if (
    !activeSheet ||
    activeSheet.getName() !==
      "Board"
  ) {
    return "";
  }


  try {
    const card =
      getSelectedPatientBoardCard_();

    return (
      card.leadId || ""
    );

  } catch (error) {
    return "";
  }
}


/**
 * Selects a newly-rendered Board card by its
 * permanent lead_id.
 */
function selectRenderedBoardCardByLeadId_(
  sheet,
  boardData,
  leadId
) {
  const cleanLeadId =
    String(
      leadId || ""
    ).trim();

  if (!cleanLeadId) {
    return false;
  }


  const layout =
    PATIENT_BOARD_LAYOUT;


  for (
    let laneIndex = 0;
    laneIndex <
      boardData.lanes.length;
    laneIndex++
  ) {
    const lane =
      boardData.lanes[
        laneIndex
      ];


    for (
      let cardIndex = 0;
      cardIndex <
        lane.cards.length;
      cardIndex++
    ) {
      const card =
        lane.cards[
          cardIndex
        ];


      if (
        card.leadId !==
        cleanLeadId
      ) {
        continue;
      }


      const row =
        layout.firstCardRow +
        (
          cardIndex *
          2
        );

      const column =
        layout.laneStarts[
          laneIndex
        ];


      sheet
        .getRange(
          row,
          column,
          1,
          4
        )
        .activate();


      return true;
    }
  }


  return false;
}


/**
 * PHASE 4B
 * Rebuilds the visible staff-facing Board from
 * canonical Leads data.
 */
function getLargestBoardLaneSize_(boardData) {
  return Math.max(
    0,
    ...boardData.lanes.map(
      lane =>
        lane.cards.length
    )
  );
}


/**
 * Pass 3: one rectangular value write for headers,
 * summary, and every card. Merged cells keep the
 * top-left value.
 *
 * Grid indexes are relative to firstDynamicRow and
 * firstValuesColumn: physical B2 is grid[0][0].
 * Row 1 and column A are never written.
 */
function buildPatientBoardValuesGrid_(boardData) {
  const layout = PATIENT_BOARD_LAYOUT;
  const largestLaneSize = getLargestBoardLaneSize_(boardData);
  const lastPhysicalRow = Math.max(
    layout.summaryRow,
    layout.firstCardRow + (largestLaneSize * 2) - 1
  );
  const rowCount = boardDynamicRowCount_(lastPhysicalRow);
  const columnCount = boardValuesColumnCount_();

  const grid = [];

  for (let row = 0; row < rowCount; row++) {
    const line = [];

    for (let column = 0; column < columnCount; column++) {
      line.push("");
    }

    grid.push(line);
  }

  const titleIndex = boardPhysicalRowToGridIndex_(layout.laneTitleRow);
  const countIndex = boardPhysicalRowToGridIndex_(layout.laneCountRow);
  const summaryIndex = boardPhysicalRowToGridIndex_(layout.summaryRow);

  boardData.lanes.forEach((lane, laneIndex) => {
    const startIndex = boardPhysicalColumnToValuesIndex_(
      layout.laneStarts[laneIndex]
    );

    grid[titleIndex][startIndex] = lane.title;
    grid[countIndex][startIndex] = buildBoardLaneCountText_(lane);

    lane.cards.forEach((card, cardIndex) => {
      const physicalRow = layout.firstCardRow + (cardIndex * 2);
      const rowIndex = boardPhysicalRowToGridIndex_(physicalRow);
      grid[rowIndex][startIndex] = buildBoardCardDisplayText_(card);
    });
  });

  grid[summaryIndex][0] = buildBoardSummaryText_(boardData);

  return grid;
}


function writePatientBoardValues_(sheet, boardData) {
  const layout = PATIENT_BOARD_LAYOUT;
  const grid = buildPatientBoardValuesGrid_(boardData);

  if (!grid.length) {
    return;
  }

  sheet
    .getRange(
      layout.firstDynamicRow,
      boardFirstValuesColumn_(),
      grid.length,
      boardValuesColumnCount_()
    )
    .setValues(grid);
}


function collectBoardCardRangeA1s_(boardData) {
  const layout = PATIENT_BOARD_LAYOUT;
  const all = [];
  const warning = [];
  const normalByStatus = {};
  const openLeadByBackground = {};

  boardData.lanes.forEach((lane, laneIndex) => {
    const startColumn = layout.laneStarts[laneIndex];
    const status = lane.status;

    if (!normalByStatus[status]) {
      normalByStatus[status] = [];
    }

    lane.cards.forEach((card, cardIndex) => {
      const cardRow = layout.firstCardRow + (cardIndex * 2);
      const a1 = rangeA1Notation_(
        cardRow,
        startColumn,
        cardRow,
        startColumn + 3
      );

      all.push(a1);

      const hasWarning =
        Array.isArray(card.warnings) &&
        card.warnings.length > 0;

      if (hasWarning) {
        warning.push(a1);
      } else if (status === "Open Lead / Follow Up") {
        const background = getOpenLeadAttemptBackground_(
          card.workflow &&
          card.workflow.attemptCount
        );

        if (!openLeadByBackground[background]) {
          openLeadByBackground[background] = [];
        }

        openLeadByBackground[background].push(a1);
      } else {
        normalByStatus[status].push(a1);
      }
    });
  });

  return {
    all,
    warning,
    normalByStatus,
    openLeadByBackground,
  };
}


function applyPatientBoardCardBorders_(
  rangeList,
  borderColor,
  leftAccentColor
) {
  rangeList.setBorder(
    true,
    true,
    true,
    true,
    false,
    false,
    borderColor,
    SpreadsheetApp.BorderStyle.SOLID
  );

  if (leftAccentColor) {
    rangeList.setBorder(
      null,
      true,
      null,
      null,
      null,
      null,
      leftAccentColor,
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );
  }

  return rangeList;
}


function formatPatientBoardCards_(sheet, boardData) {
  const ranges = collectBoardCardRangeA1s_(boardData);
  const openLeadStyle = getBoardLaneStyle_(
    "Open Lead / Follow Up"
  );

  applyRangeListChunks_(sheet, ranges.all, rangeList => {
    rangeList
      .setFontColor("#F3F4F6")
      .setFontSize(10)
      .setFontWeight("normal")
      .setWrap(true)
      .setVerticalAlignment("top")
      .setHorizontalAlignment("left");
  });

  Object.keys(ranges.normalByStatus).forEach(status => {
    const style = getBoardLaneStyle_(status);
    const a1s = ranges.normalByStatus[status];

    applyRangeListChunks_(sheet, a1s, rangeList => {
      rangeList
        .setBackground(style.cardBackground)
        .setFontColor(style.cardFontColor);
      applyPatientBoardCardBorders_(
        rangeList,
        style.cardBorderColor,
        style.leftAccentColor
      );
    });
  });

  Object.keys(ranges.openLeadByBackground || {}).forEach(background => {
    const a1s = ranges.openLeadByBackground[background];

    applyRangeListChunks_(sheet, a1s, rangeList => {
      rangeList.setBackground(background);
      applyPatientBoardCardBorders_(
        rangeList,
        openLeadStyle.cardBorderColor,
        openLeadStyle.leftAccentColor
      );

      if (background === "#285A86") {
        rangeList.setFontColor("#FFFFFF");
      }
    });
  });

  applyRangeListChunks_(sheet, ranges.warning, rangeList => {
    rangeList
      .setBackground("#3A2D10")
      .setFontColor("#FFF2C2")
      .setBorder(
        true,
        true,
        true,
        true,
        false,
        false,
        "#D9A21B",
        SpreadsheetApp.BorderStyle.SOLID
      );
  });
}


function mergePatientBoardCards_(sheet, boardData) {
  const layout = PATIENT_BOARD_LAYOUT;

  boardData.lanes.forEach((lane, laneIndex) => {
    const startColumn = layout.laneStarts[laneIndex];

    lane.cards.forEach((card, cardIndex) => {
      const cardRow = layout.firstCardRow + (cardIndex * 2);

      sheet
        .getRange(cardRow, startColumn, 1, 4)
        .merge();
    });
  });
}


function buildPatientBoardCardMetadataValue_(card) {
  return JSON.stringify({
    type: "patient_board_card",
    leadId: card.leadId,
    status: card.status,
  });
}


function buildDesiredPatientBoardCardMetadata_(boardData) {
  const layout = PATIENT_BOARD_LAYOUT;
  const desired = {};

  boardData.lanes.forEach((lane, laneIndex) => {
    const startColumn = layout.laneStarts[laneIndex];

    lane.cards.forEach((card, cardIndex) => {
      const cardRow = layout.firstCardRow + (cardIndex * 2);
      const key =
        "PATIENT_BOARD_CARD_" +
        cellA1Notation_(cardRow, startColumn);

      desired[key] = buildPatientBoardCardMetadataValue_(card);
    });
  });

  return desired;
}


function readPatientBoardCardMetadataState_(sheet) {
  const byKey = {};
  const duplicates = [];

  sheet.getDeveloperMetadata().forEach(metadata => {
    const key = String(metadata.getKey() || "");

    if (!key.startsWith("PATIENT_BOARD_CARD_")) {
      return;
    }

    if (byKey[key]) {
      duplicates.push(metadata);
      return;
    }

    byKey[key] = metadata;
  });

  return {
    byKey,
    duplicates,
  };
}


function diffPatientBoardCardMetadata_(current, desired) {
  const toRemove = current.duplicates.slice();
  const toAdd = [];
  const toChange = [];
  let unchanged = 0;

  Object.keys(current.byKey).forEach(key => {
    const metadata = current.byKey[key];
    const desiredValue = desired[key];

    if (desiredValue === undefined) {
      toRemove.push(metadata);
      return;
    }

    if (String(metadata.getValue() || "") === desiredValue) {
      unchanged += 1;
      return;
    }

    toChange.push({
      metadata,
      value: desiredValue,
    });
  });

  Object.keys(desired).forEach(key => {
    if (!current.byKey[key]) {
      toAdd.push({
        key,
        value: desired[key],
      });
    }
  });

  return {
    unchanged,
    toRemove,
    toAdd,
    toChange,
  };
}


/**
 * Pass 3.5: keep identical Board-card sheet metadata
 * in place. Location is encoded in the key, so the
 * same key + same JSON value is the same card.
 */
function syncPatientBoardCardMetadata_(sheet, boardData) {
  const current = withPerf_(
    "board metadata current-state read",
    () => readPatientBoardCardMetadataState_(sheet)
  );

  const plan = withPerf_(
    "board metadata comparison/diff",
    () => diffPatientBoardCardMetadata_(
      current,
      buildDesiredPatientBoardCardMetadata_(boardData)
    )
  );

  console.log(
    `[PERF] board metadata diff: unchanged=${plan.unchanged} added=${plan.toAdd.length} removed=${plan.toRemove.length} changed=${plan.toChange.length}`
  );

  console.log(
    `[PERF] board metadata entries left unchanged: ${plan.unchanged}`
  );

  withPerf_("board metadata removals actually performed", () => {
    plan.toRemove.forEach(metadata => metadata.remove());
  });

  withPerf_("board metadata replacements actually performed", () => {
    plan.toChange.forEach(entry => {
      entry.metadata.setValue(entry.value);
    });
  });

  withPerf_("board metadata additions actually performed", () => {
    plan.toAdd.forEach(entry => {
      sheet.addDeveloperMetadata(
        entry.key,
        entry.value,
        SpreadsheetApp.DeveloperMetadataVisibility.DOCUMENT
      );
    });
  });
}


/*
 * Manual refresh keeps the historical UI:
 * activate Board, preserve the selected card,
 * and toast.
 *
 * options.background disables those UI effects
 * for the time-driven trigger. Omitted options
 * match a manual refresh exactly.
 */
function renderPatientBoard(options) {
  const perf = startPerf_("renderPatientBoard");
  const ui =
    normalizeDerivedViewUiOptions_(
      options
    );
  const lockState =
    enterDerivedViewWriteSection_(
      "renderPatientBoard"
    );

  try {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      "Board"
    );

  if (!sheet) {
    throw new Error(
      "Board worksheet was not found."
    );
  }


  recordDerivedViewUiEffect_(
    "board-render"
  );


  const selectedLeadId =
    ui.preserveSelection
      ? getSelectedBoardLeadIdForRefresh_()
      : "";


  const leadsTable =
    withPerf_(
      "board source Leads read",
      () => getCanonicalSheetTable_("Leads")
    );


  const boardData =
    withPerf_(
      "board card-model construction",
      () => buildPatientBoardData_(leadsTable)
    );


  withPerf_(
    "board preparation/clear",
    () => preparePatientBoardSheet_(sheet, boardData)
  );


  withPerf_(
    "board card text writes",
    () => writePatientBoardValues_(sheet, boardData)
  );


  const layout =
    PATIENT_BOARD_LAYOUT;


  withPerf_(
    "board lane rendering",
    () => {
      boardData.lanes.forEach((lane, laneIndex) => {
        renderBoardLaneHeader_(
          sheet,
          lane,
          layout.laneStarts[laneIndex]
        );
      });
    }
  );


  withPerf_(
    "board card merges",
    () => mergePatientBoardCards_(sheet, boardData)
  );


  withPerf_(
    "board card formatting",
    () => formatPatientBoardCards_(sheet, boardData)
  );


  withPerf_(
    "board metadata sync",
    () => syncPatientBoardCardMetadata_(sheet, boardData)
  );


  withPerf_(
    "board summary/usage rendering",
    () => {
      renderBoardSummaryStrip_(sheet, boardData);
      addBoardUsageNotes_(sheet, boardData);
    }
  );


  /*
   * Pass 3.5: no explicit SpreadsheetApp.flush().
   *
   * Nothing after this point reads Board cell
   * values or metadata that was just written.
   * Card re-selection uses in-memory boardData
   * coordinates, and Apps Script flushes pending
   * spreadsheet mutations at execution end.
   * Subsequent Dashboard rebuilds use Leads /
   * ActivityLog / Dashboard sheets, not Board
   * cells.
   */


  /*
   * Manual refresh makes the Board the visible
   * workspace. Background refresh must not.
   */
  if (ui.activate) {
    sheet.activate();

    recordDerivedViewUiEffect_(
      "activate"
    );
  }


  if (
    ui.preserveSelection &&
    selectedLeadId
  ) {
    const selected =
      selectRenderedBoardCardByLeadId_(
        sheet,
        boardData,
        selectedLeadId
      );

    if (selected) {
      recordDerivedViewUiEffect_(
        "select"
      );
    }
  }


  if (ui.showToast) {
    if (
      boardData.invalidStatusCount >
      0
    ) {
      ss.toast(
        `${boardData.invalidStatusCount} lead(s) have an invalid workflow status and could not be placed on the Board.`,
        "Board Warning",
        8
      );
    } else {
      ss.toast(
        `${boardData.totalCards} leads loaded across four workflow lanes.`,
        "Board Refreshed",
        4
      );
    }

    recordDerivedViewUiEffect_(
      "toast"
    );
  }


  return boardData;
  } finally {
    exitDerivedViewWriteSection_(
      lockState
    );
    endPerf_(perf);
  }
}


/**
 * PHASE 5A
 *
 * Validates relational integrity across:
 * - Leads
 * - ActivityLog
 * - Attachments
 * - Reactions
 *
 * READ ONLY:
 * This function does not modify workbook data.
 */
function validateAttachmentReactionIntegrity_() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  const leadsSheet =
    ss.getSheetByName(
      "Leads"
    );

  const activitySheet =
    ss.getSheetByName(
      "ActivityLog"
    );

  const attachmentsSheet =
    ss.getSheetByName(
      "Attachments"
    );

  const reactionsSheet =
    ss.getSheetByName(
      "Reactions"
    );

  const listsSheet =
    ss.getSheetByName(
      "Lists"
    );


  const requiredSheets = [
    ["Leads", leadsSheet],
    ["ActivityLog", activitySheet],
    ["Attachments", attachmentsSheet],
    ["Reactions", reactionsSheet],
    ["Lists", listsSheet],
  ];


  requiredSheets.forEach(
    ([name, sheet]) => {
      if (!sheet) {
        throw new Error(
          `${name} worksheet was not found.`
        );
      }
    }
  );


  const issues = [];


  /*
   * =====================================================
   * Build canonical lead/activity lookup maps
   * =====================================================
   */

  const leadHeaders =
    getHeaderMap_(
      "Leads"
    );

  const activityHeaders =
    getHeaderMap_(
      "ActivityLog"
    );


  const leadIds =
    new Set();


  const leadsLastRow =
    leadsSheet.getLastRow();


  if (leadsLastRow >= 2) {
    const rows =
      leadsSheet
        .getRange(
          2,
          1,
          leadsLastRow - 1,
          leadsSheet.getLastColumn()
        )
        .getValues();


    rows.forEach(
      (
        rowValues,
        index
      ) => {
        const leadId =
          String(
            rowValues[
              leadHeaders.lead_id - 1
            ] || ""
          ).trim();


        if (!leadId) {
          return;
        }


        if (
          leadIds.has(
            leadId
          )
        ) {
          issues.push(
            `Leads row ${index + 2}: duplicate lead_id "${leadId}".`
          );
        }


        leadIds.add(
          leadId
        );
      }
    );
  }


  const activitiesById = {};


  const activityLastRow =
    activitySheet.getLastRow();


  if (activityLastRow >= 2) {
    const rows =
      activitySheet
        .getRange(
          2,
          1,
          activityLastRow - 1,
          activitySheet.getLastColumn()
        )
        .getValues();


    rows.forEach(
      (
        rowValues,
        index
      ) => {
        const activityId =
          String(
            rowValues[
              activityHeaders.activity_id - 1
            ] || ""
          ).trim();

        const leadId =
          String(
            rowValues[
              activityHeaders.lead_id - 1
            ] || ""
          ).trim();

        const activityType =
          String(
            rowValues[
              activityHeaders.activity_type - 1
            ] || ""
          ).trim();


        if (!activityId) {
          return;
        }


        if (
          activitiesById[
            activityId
          ]
        ) {
          issues.push(
            `ActivityLog row ${index + 2}: duplicate activity_id "${activityId}".`
          );

          return;
        }


        activitiesById[
          activityId
        ] = {
          leadId,
          activityType,
          row:
            index + 2,
        };


        if (
          leadId &&
          !leadIds.has(
            leadId
          )
        ) {
          issues.push(
            `ActivityLog row ${index + 2}: lead_id "${leadId}" does not exist in Leads.`
          );
        }
      }
    );
  }


  /*
   * =====================================================
   * ATTACHMENTS
   * =====================================================
   */

  const attachmentHeaders =
    getHeaderMap_(
      "Attachments"
    );


  const attachmentIds =
    new Set();

  const driveFileKeys =
    new Set();


  let attachmentCount = 0;


  const attachmentLastRow =
    attachmentsSheet.getLastRow();


  if (attachmentLastRow >= 2) {
    const rows =
      attachmentsSheet
        .getRange(
          2,
          1,
          attachmentLastRow - 1,
          attachmentsSheet.getLastColumn()
        )
        .getValues();


    rows.forEach(
      (
        rowValues,
        index
      ) => {
        const sheetRow =
          index + 2;


        const readText =
          headerName =>
            String(
              rowValues[
                attachmentHeaders[
                  headerName
                ] - 1
              ] || ""
            ).trim();


        const attachmentId =
          readText(
            "attachment_id"
          );

        const leadId =
          readText(
            "lead_id"
          );

        const activityId =
          readText(
            "activity_id"
          );

        const driveFileId =
          readText(
            "drive_file_id"
          );

        const fileName =
          readText(
            "file_name"
          );

        const fileUrl =
          readText(
            "file_url"
          );


        if (
          !attachmentId &&
          !leadId &&
          !activityId &&
          !driveFileId
        ) {
          return;
        }


        attachmentCount += 1;


        if (!attachmentId) {
          issues.push(
            `Attachments row ${sheetRow}: attachment_id is blank.`
          );
        } else if (
          attachmentIds.has(
            attachmentId
          )
        ) {
          issues.push(
            `Attachments row ${sheetRow}: duplicate attachment_id "${attachmentId}".`
          );
        } else {
          attachmentIds.add(
            attachmentId
          );
        }


        if (!leadId) {
          issues.push(
            `Attachments row ${sheetRow}: lead_id is blank.`
          );

        } else if (
          !leadIds.has(
            leadId
          )
        ) {
          issues.push(
            `Attachments row ${sheetRow}: lead_id "${leadId}" does not exist.`
          );
        }


        if (!activityId) {
          issues.push(
            `Attachments row ${sheetRow}: activity_id is blank.`
          );

        } else {
          const activity =
            activitiesById[
              activityId
            ];


          if (!activity) {
            issues.push(
              `Attachments row ${sheetRow}: activity_id "${activityId}" does not exist in ActivityLog.`
            );

          } else {

            if (
              activity.leadId !==
              leadId
            ) {
              issues.push(
                `Attachments row ${sheetRow}: attachment lead_id "${leadId}" does not match ActivityLog lead_id "${activity.leadId}".`
              );
            }


            if (
              activity.activityType !==
              "attachment_added"
            ) {
              issues.push(
                `Attachments row ${sheetRow}: activity_id "${activityId}" is "${activity.activityType}", expected "attachment_added".`
              );
            }
          }
        }


        if (!driveFileId) {
          issues.push(
            `Attachments row ${sheetRow}: drive_file_id is blank.`
          );

        } else if (leadId) {
          const duplicateKey =
            `${leadId}::${driveFileId}`;


          if (
            driveFileKeys.has(
              duplicateKey
            )
          ) {
            issues.push(
              `Attachments row ${sheetRow}: Drive file "${driveFileId}" is registered more than once for lead "${leadId}".`
            );
          }


          driveFileKeys.add(
            duplicateKey
          );
        }


        if (!fileName) {
          issues.push(
            `Attachments row ${sheetRow}: file_name is blank.`
          );
        }


        if (!fileUrl) {
          issues.push(
            `Attachments row ${sheetRow}: file_url is blank.`
          );
        }
      }
    );
  }


  /*
   * =====================================================
   * REACTIONS
   * =====================================================
   */

  const reactionHeaders =
    getHeaderMap_(
      "Reactions"
    );


  const allowedEmojis =
    getListValues_(
      listsSheet,
      "M2:M6"
    );


  const reactionIds =
    new Set();

  const activeReactionKeys =
    new Set();


  let reactionCount = 0;
  let activeReactionCount = 0;


  const reactionLastRow =
    reactionsSheet.getLastRow();


  if (reactionLastRow >= 2) {
    const rows =
      reactionsSheet
        .getRange(
          2,
          1,
          reactionLastRow - 1,
          reactionsSheet.getLastColumn()
        )
        .getValues();


    rows.forEach(
      (
        rowValues,
        index
      ) => {
        const sheetRow =
          index + 2;


        const readValue =
          headerName =>
            rowValues[
              reactionHeaders[
                headerName
              ] - 1
            ];


        const readText =
          headerName =>
            String(
              readValue(
                headerName
              ) || ""
            ).trim();


        const reactionId =
          readText(
            "reaction_id"
          );

        const leadId =
          readText(
            "lead_id"
          );

        const activityId =
          readText(
            "activity_id"
          );

        const emoji =
          readText(
            "emoji"
          );

        const reactedByEmail =
          readText(
            "reacted_by_email"
          );

        const reactedByName =
          readText(
            "reacted_by_name"
          );

        const isActive =
          Boolean(
            readValue(
              "is_active"
            )
          );

        const removedAt =
          readValue(
            "removed_at"
          );

        const removedBy =
          readText(
            "removed_by"
          );


        if (
          !reactionId &&
          !leadId &&
          !activityId &&
          !emoji
        ) {
          return;
        }


        reactionCount += 1;


        if (!reactionId) {
          issues.push(
            `Reactions row ${sheetRow}: reaction_id is blank.`
          );

        } else if (
          reactionIds.has(
            reactionId
          )
        ) {
          issues.push(
            `Reactions row ${sheetRow}: duplicate reaction_id "${reactionId}".`
          );

        } else {
          reactionIds.add(
            reactionId
          );
        }


        if (!leadId) {
          issues.push(
            `Reactions row ${sheetRow}: lead_id is blank.`
          );

        } else if (
          !leadIds.has(
            leadId
          )
        ) {
          issues.push(
            `Reactions row ${sheetRow}: lead_id "${leadId}" does not exist.`
          );
        }


        if (!activityId) {
          issues.push(
            `Reactions row ${sheetRow}: activity_id is blank.`
          );

        } else {
          const activity =
            activitiesById[
              activityId
            ];


          if (!activity) {
            issues.push(
              `Reactions row ${sheetRow}: activity_id "${activityId}" does not exist.`
            );

          } else if (
            activity.leadId !==
            leadId
          ) {
            issues.push(
              `Reactions row ${sheetRow}: reaction lead_id "${leadId}" does not match ActivityLog lead_id "${activity.leadId}".`
            );

          } else if (
            isActive &&
            !isReactionEligibleActivityType_(
              activity.activityType
            )
          ) {
            issues.push(
              `Reactions row ${sheetRow}: active reaction targets "${activity.activityType}", which is not reaction-eligible.`
            );
          }
        }


        if (
          !allowedEmojis.includes(
            emoji
          )
        ) {
          issues.push(
            `Reactions row ${sheetRow}: emoji "${emoji}" is not in Lists!M2:M6.`
          );
        }


        if (isActive) {
          activeReactionCount += 1;


          if (
            removedAt instanceof Date &&
            !isNaN(
              removedAt.getTime()
            )
          ) {
            issues.push(
              `Reactions row ${sheetRow}: active reaction has removed_at populated.`
            );
          }


          if (removedBy) {
            issues.push(
              `Reactions row ${sheetRow}: active reaction has removed_by populated.`
            );
          }


          const actorKey =
            reactedByEmail ||
            reactedByName ||
            "(unknown actor)";


          const activeKey =
            [
              leadId,
              activityId,
              emoji,
              actorKey,
            ].join("::");


          if (
            activeReactionKeys.has(
              activeKey
            )
          ) {
            issues.push(
              `Reactions row ${sheetRow}: duplicate active "${emoji}" reaction for the same employee/activity.`
            );
          }


          activeReactionKeys.add(
            activeKey
          );

        } else {

          const hasRemovedAt =
            removedAt instanceof Date &&
            !isNaN(
              removedAt.getTime()
            );


          if (!hasRemovedAt) {
            issues.push(
              `Reactions row ${sheetRow}: inactive reaction does not have removed_at populated.`
            );
          }


          if (!removedBy) {
            issues.push(
              `Reactions row ${sheetRow}: inactive reaction does not have removed_by populated.`
            );
          }
        }
      }
    );
  }


  return {
    passed:
      issues.length === 0,

    issues,

    counts: {
      leads:
        leadIds.size,

      activities:
        Object.keys(
          activitiesById
        ).length,

      attachments:
        attachmentCount,

      reactions:
        reactionCount,

      activeReactions:
        activeReactionCount,
    },
  };
}


/**
 * Runs the Phase 5A integrity audit and displays
 * a concise result to the developer.
 */
function runAttachmentReactionIntegrityCheck() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const ui =
    SpreadsheetApp.getUi();


  const report =
    validateAttachmentReactionIntegrity_();


  if (
    report.passed
  ) {
    ui.alert(
      "Phase 5A Integrity Check",
      [
        "PASSED",
        "",
        `Leads: ${report.counts.leads}`,
        `Activities: ${report.counts.activities}`,
        `Attachments: ${report.counts.attachments}`,
        `Reactions: ${report.counts.reactions}`,
        `Active reactions: ${report.counts.activeReactions}`,
        "",
        "No attachment/reaction relationship problems were found.",
      ].join("\n"),
      ui.ButtonSet.OK
    );

    return report;
  }


  const visibleIssues =
    report.issues.slice(
      0,
      20
    );


  let message = [
    "FAILED",
    "",
    `${report.issues.length} issue(s) found:`,
    "",
    ...visibleIssues.map(
      (
        issue,
        index
      ) =>
        `${index + 1}. ${issue}`
    ),
  ];


  if (
    report.issues.length >
    visibleIssues.length
  ) {
    message.push(
      "",
      `...and ${
        report.issues.length -
        visibleIssues.length
      } more issue(s).`
    );
  }


  ui.alert(
    "Phase 5A Integrity Check",
    message.join(
      "\n"
    ),
    ui.ButtonSet.OK
  );


  return report;
}


/**
 * PHASE 5B
 *
 * Performs a fresh Drive availability check for
 * every registered attachment.
 *
 * READ ONLY.
 */
function runDriveAttachmentHealthCheck() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const ui =
    SpreadsheetApp.getUi();


  const sheet =
    ss.getSheetByName(
      "Attachments"
    );


  if (!sheet) {
    throw new Error(
      "Attachments worksheet was not found."
    );
  }


  const headers =
    getHeaderMap_(
      "Attachments"
    );


  const lastRow =
    sheet.getLastRow();


  let checked = 0;
  let available = 0;
  let unavailable = 0;


  const issues = [];


  if (
    lastRow >= 2
  ) {
    const rows =
      sheet
        .getRange(
          2,
          1,
          lastRow - 1,
          sheet.getLastColumn()
        )
        .getValues();


    rows.forEach(
      (
        rowValues,
        index
      ) => {

        const rowNumber =
          index + 2;


        const attachmentId =
          String(
            rowValues[
              headers
                .attachment_id - 1
            ] || ""
          ).trim();


        if (!attachmentId) {
          return;
        }


        const driveFileId =
          String(
            rowValues[
              headers
                .drive_file_id - 1
            ] || ""
          ).trim();


        const fileName =
          String(
            rowValues[
              headers
                .file_name - 1
            ] || ""
          ).trim();


        checked += 1;


        if (!driveFileId) {
          unavailable += 1;

          issues.push(
            `Row ${rowNumber}: "${fileName || attachmentId}" has no Drive file ID.`
          );

          return;
        }


        /*
         * Bypass the five-minute UI cache.
         */
        const health =
          inspectDriveAttachmentFile_(
            driveFileId,
            true
          );


        if (
          health.available
        ) {
          available += 1;

          return;
        }


        unavailable += 1;


        issues.push(
          `Row ${rowNumber}: "${fileName || attachmentId}" — ${health.message}`
        );
      }
    );
  }


  const passed =
    unavailable === 0;


  const lines = [
    passed
      ? "PASSED"
      : "ATTENTION NEEDED",

    "",

    `Attachments checked: ${checked}`,
    `Available: ${available}`,
    `Unavailable: ${unavailable}`,
  ];


  if (
    issues.length > 0
  ) {
    lines.push(
      "",
      "Issues:"
    );


    issues
      .slice(
        0,
        20
      )
      .forEach(
        (
          issue,
          index
        ) => {
          lines.push(
            `${index + 1}. ${issue}`
          );
        }
      );


    if (
      issues.length > 20
    ) {
      lines.push(
        "",
        `...and ${
          issues.length - 20
        } more.`
      );
    }
  }


  ui.alert(
    "Phase 5B Drive Attachment Check",
    lines.join(
      "\n"
    ),
    ui.ButtonSet.OK
  );


  return {
    passed,

    checked,

    available,

    unavailable,

    issues,
  };
}


/**
 * PHASE 5C
 *
 * Verifies that the configured attachment storage
 * environment is safe and usable.
 *
 * READ ONLY.
 */
function runAttachmentStoragePolicyCheck() {
  const ui =
    SpreadsheetApp.getUi();


  let config;


  try {
    config =
      getAttachmentStorageConfig_();

  } catch (error) {

    ui.alert(
      "Phase 5C Storage Policy Check",
      "FAILED\n\n" +
      (
        error &&
        error.message
          ? error.message
          : String(error)
      ),
      ui.ButtonSet.OK
    );

    throw error;
  }


  /*
   * Development configuration.
   */
  if (
    config.policy ===
    "reference_existing"
  ) {
    ui.alert(
      "Phase 5C Storage Policy Check",
      [
        "PASSED",
        "",
        `Environment: ${config.environment}`,
        "Policy: reference_existing",
        "",
        "DEV files may be referenced directly.",
        "",
        "Production will be required to use clinic-managed storage.",
      ].join("\n"),
      ui.ButtonSet.OK
    );


    return {
      passed: true,

      environment:
        config.environment,

      policy:
        config.policy,

      managedFolderConfigured:
        false,
    };
  }


  /*
   * Managed-storage configuration.
   */
  let folder;


  try {
    folder =
      DriveApp.getFolderById(
        config.managedFolderId
      );

  } catch (error) {

    ui.alert(
      "Phase 5C Storage Policy Check",
      "FAILED\n\n" +
      "The configured managed attachment folder could not be opened.",
      ui.ButtonSet.OK
    );


    return {
      passed: false,

      environment:
        config.environment,

      policy:
        config.policy,

      managedFolderConfigured:
        true,

      folderAccessible:
        false,
    };
  }


  if (
    folder.isTrashed()
  ) {
    ui.alert(
      "Phase 5C Storage Policy Check",
      "FAILED\n\n" +
      "The configured managed attachment folder is in Trash.",
      ui.ButtonSet.OK
    );


    return {
      passed: false,

      environment:
        config.environment,

      policy:
        config.policy,

      managedFolderConfigured:
        true,

      folderAccessible:
        true,

      folderTrashed:
        true,
    };
  }


  ui.alert(
    "Phase 5C Storage Policy Check",
    [
      "PASSED",
      "",
      `Environment: ${config.environment}`,
      "Policy: managed_folder_required",
      `Folder: ${folder.getName()}`,
      "",
      "New attachments must be inside this managed Drive location.",
    ].join("\n"),
    ui.ButtonSet.OK
  );


  return {
    passed: true,

    environment:
      config.environment,

    policy:
      config.policy,

    managedFolderConfigured:
      true,

    folderAccessible:
      true,

    folderId:
      config.managedFolderId,

    folderName:
      folder.getName(),
  };
}


/**
 * =====================================================
 * PHASE 6 — DASHBOARD & ANALYTICS
 * =====================================================
 */

const PATIENT_DASHBOARD = {
  dashboardSheet:
    "Dashboard",

  dataSheet:
    "DashboardData",

  namedRanges: {
    startDate:
      "DashboardStartDate",

    endDate:
      "DashboardEndDate",

    reason:
      "DashboardReason",

    source:
      "DashboardSource",

    employee:
      "DashboardEmployee",
  },

  dataHeaders: [
    "lead_id",
    "created_at",
    "intake_source",
    "appointment_reason",
    "status",
    "attempt_count",
    "reached_patient",
    "assigned_to",

    "first_attempt_at",
    "first_attempt_minutes",
    "first_attempt_actor",

    "ever_scheduled",
    "first_scheduled_at",
    "current_scheduled_date",

    "next_follow_up_on",
    "workflow_complete",

    "lost_reason",
    "unrelated_type",

    "page_name",
    "source_path",

    "utm_source",
    "utm_medium",
    "utm_campaign",

    "duplicate_flag",
    "last_activity_at",

    "legitimate_appointment_lead",
    "open_untouched",

    "follow_up_overdue",
    "follow_up_due_today",
    "follow_up_due_next_7_days",

    "open_age_hours",
    "schedule_date_missing",
  ],
};


/**
 * PHASE 6B
 *
 * Staff-facing KPI layout.
 *
 * Five cards on the first row,
 * three cards on the second row.
 */
const PATIENT_DASHBOARD_KPI_LAYOUT = {
  area:
    "A8:J16",

  firstRow: [
    {
      key:
        "newToday",

      label:
        "NEW TODAY",

      range:
        "A8:B11",

      labelRange:
        "A8:B8",

      valueRange:
        "A9:B10",

      noteRange:
        "A11:B11",
    },

    {
      key:
        "newThisWeek",

      label:
        "NEW THIS WEEK",

      range:
        "C8:D11",

      labelRange:
        "C8:D8",

      valueRange:
        "C9:D10",

      noteRange:
        "C11:D11",
    },

    {
      key:
        "newThisMonth",

      label:
        "NEW THIS MONTH",

      range:
        "E8:F11",

      labelRange:
        "E8:F8",

      valueRange:
        "E9:F10",

      noteRange:
        "E11:F11",
    },

    {
      key:
        "openUntouched",

      label:
        "OPEN UNTOUCHED",

      range:
        "G8:H11",

      labelRange:
        "G8:H8",

      valueRange:
        "G9:H10",

      noteRange:
        "G11:H11",
    },

    {
      key:
        "needsAttention",

      label:
        "NEEDS ATTENTION",

      range:
        "I8:J11",

      labelRange:
        "I8:J8",

      valueRange:
        "I9:J10",

      noteRange:
        "I11:J11",
    },
  ],

  secondRow: [
    {
      key:
        "scheduled",

      label:
        "SCHEDULED",

      range:
        "A13:B16",

      labelRange:
        "A13:B13",

      valueRange:
        "A14:B15",

      noteRange:
        "A16:B16",
    },

    {
      key:
        "conversion",

      label:
        "SCHEDULING CONVERSION",

      range:
        "C13:D16",

      labelRange:
        "C13:D13",

      valueRange:
        "C14:D15",

      noteRange:
        "C16:D16",
    },

    {
      key:
        "medianFirstAttempt",

      label:
        "MEDIAN FIRST ATTEMPT",

      range:
        "E13:F16",

      labelRange:
        "E13:F13",

      valueRange:
        "E14:F15",

      noteRange:
        "E16:F16",
    },
  ],
};


/**
 * PHASE 6C
 * Dashboard operational analytics layout.
 */
const PATIENT_DASHBOARD_OPERATIONAL_LAYOUT = {
  alertsArea:
    "G13:J16",

  attemptsArea:
    "A20:E27",

  agingArea:
    "F20:J27",
};


/**
 * PHASE 6D
 * Trend-helper and chart layout.
 */
const PATIENT_DASHBOARD_TREND_LAYOUT = {
  dataStartColumn:
    34, // AH

  dataColumnCount:
    4,

  chartHeaderRange:
    "A29:J29",

  chartNoteRange:
    "A47:J47",

  chartRow:
    30,

  chartColumn:
    1,

  chartTitle:
    "New Leads vs First-Time Scheduled",
};


/**
 * PHASE 6E
 * Business-intelligence Dashboard layout.
 */
const PATIENT_DASHBOARD_BUSINESS_LAYOUT = {
  reasonArea:
    "A49:E62",

  sourceArea:
    "F49:J62",

  caseLostArea:
    "A64:E77",

  unrelatedArea:
    "F64:J77",

  workloadArea:
    "A80:J94",

  maxPerformanceRows:
    8,

  maxBreakdownRows:
    8,

  maxWorkloadRows:
    8,
};


/**
 * PHASE 6F
 * Staff-facing Dashboard controls.
 */
const PATIENT_DASHBOARD_CONTROLS = {
  quickRangeCell:
    "B5",

  applyCell:
    "E5",

  resetCell:
    "G5",

  statusCell:
    "I5",

  statusRange:
    "I5:J5",

  quickRanges: [
    "Custom",
    "Today",
    "This Week",
    "This Month",
    "YTD",
    "All Time",
  ],
};


const PATIENT_DASHBOARD_THEME = Object.freeze({
  canvas: "#0F1115",
  fontFamily: "Roboto",
  primary: "#F3F4F6",
  secondary: "#AAB2BF",
  muted: "#8B95A5",
  panel: "#171A21",
  input: "#1C2026",
  tableHeader: "#24282F",
  bodyText: "#E3E7EC",
  border: "#303640",
  blue: "#3B82F6",
  blueBright: "#7EB0FF",
  green: "#4FA66A",
  greenBright: "#78D391",
  dangerSurface: "#301B1D",
  dangerText: "#F0928A",
  warningSurface: "#3A2D10",
  presentationRange: "A2:J94",
});


function applyDashboardRangeBorder_(range) {
  range.setBorder(
    true,
    true,
    true,
    true,
    false,
    false,
    PATIENT_DASHBOARD_THEME.border,
    SpreadsheetApp.BorderStyle.SOLID
  );
}


function applyDashboardTableAreaBase_(area) {
  area
    .setBackground(PATIENT_DASHBOARD_THEME.panel)
    .setFontColor(PATIENT_DASHBOARD_THEME.bodyText)
    .setFontFamily(PATIENT_DASHBOARD_THEME.fontFamily);
}


function applyDashboardPresentationCanvas_(sheet) {
  const theme = PATIENT_DASHBOARD_THEME;

  sheet
    .getRange(theme.presentationRange)
    .setBackground(theme.canvas)
    .setFontFamily(theme.fontFamily)
    .setFontColor(theme.primary);
}


function applyDashboardHeaderToolbarStyles_(sheet) {
  const theme = PATIENT_DASHBOARD_THEME;

  sheet
    .getRange("A2:J2")
    .setBackground(theme.panel)
    .setFontFamily(theme.fontFamily);

  sheet
    .getRange("A2:J2")
    .setFontColor(theme.muted)
    .setFontSize(10)
    .setBorder(
      false,
      false,
      true,
      false,
      false,
      false,
      theme.border,
      SpreadsheetApp.BorderStyle.SOLID
    );

  sheet
    .getRange("A3:J3")
    .setBackground(theme.canvas);

  sheet
    .getRange("A4:J6")
    .setBackground(theme.panel)
    .setFontFamily(theme.fontFamily);

  sheet.getRangeList([
    "A4",
    "C4",
    "E4",
    "G4",
    "I4",
    "A5",
    "D5",
    "F5",
    "H5",
  ])
    .setFontColor(theme.secondary)
    .setFontWeight("bold");

  sheet.getRangeList([
    "B4",
    "D4",
    "F4",
    "H4",
    "J4",
    "B5",
  ])
    .setBackground(theme.input)
    .setFontColor(theme.primary);

  applyDashboardRangeBorder_(
    sheet.getRangeList([
      "B4",
      "D4",
      "F4",
      "H4",
      "J4",
      "B5",
    ])
  );

  sheet
    .getRange(PATIENT_DASHBOARD_CONTROLS.statusRange)
    .setFontColor(theme.muted)
    .setFontSize(8);

  sheet
    .getRange("A6:J6")
    .setFontColor(theme.muted)
    .setFontSize(9);
}


function getDashboardRefreshContext_() {
  return EXECUTION_CACHE_.dashboardRefreshContext;
}


function beginDashboardRefreshContext_() {
  const context = {
    leadsTable: null,
    activityTable: null,
    activityIndex: null,
    snapshotRows: null,
    records: null,
    filterOptions: null,
    filters: null,
    filterStartKey: "",
    filterEndKey: "",
    periodKeys: null,
    filteredCohort: null,
    categoryFilteredRecords: null,
    sharedLeadAggregates: null,
  };

  EXECUTION_CACHE_.dashboardRefreshContext = context;

  return context;
}


function dashboardSnapshotRowsToRecords_(rows) {
  const headers = PATIENT_DASHBOARD.dataHeaders;
  const records = [];

  (rows || []).forEach(rowValues => {
    const leadId = String(rowValues[0] || "").trim();

    if (!leadId) {
      return;
    }

    const record = {};

    headers.forEach((header, index) => {
      record[header] = rowValues[index];
    });

    records.push(record);
  });

  return records;
}


function buildDashboardFilterOptionsFromLeadsTable_(table) {
  const headers = table.headers;
  const reasonSet = new Set();
  const sourceSet = new Set();
  const employeeSet = new Set();

  table.values.forEach(rowValues => {
    if (isLeadRowArchived_(headers, rowValues)) {
      return;
    }

    const reason = String(
      rowValues[headers.appointment_reason - 1] || ""
    ).trim();

    const source = String(
      rowValues[headers.intake_source - 1] || ""
    ).trim();

    const employee = String(
      rowValues[headers.assigned_to - 1] || ""
    ).trim();

    if (reason) {
      reasonSet.add(reason);
    }

    if (source) {
      sourceSet.add(source);
    }

    if (employee) {
      employeeSet.add(employee);
    }
  });

  const sortValues = set =>
    Array.from(set).sort((a, b) => a.localeCompare(b));

  return {
    reasons: sortValues(reasonSet),
    sources: sortValues(sourceSet),
    employees: sortValues(employeeSet),
  };
}


function cacheDashboardFilterBounds_(context, filters) {
  context.filters = filters;
  context.filterStartKey = filters.startDate
    ? getDashboardDateKey_(filters.startDate)
    : "";
  context.filterEndKey = filters.endDate
    ? getDashboardDateKey_(filters.endDate)
    : "";
}


function ensureDashboardRefreshSourceContext_() {
  let context = getDashboardRefreshContext_();

  if (!context) {
    context = beginDashboardRefreshContext_();
  }

  if (!context.snapshotRows) {
    populateDashboardSourceContext_(context);
  }

  return context;
}


function populateDashboardSourceContext_(context) {
  withPerf_("dashboard header resolution", () => {
    getHeaderMap_("Leads");
    getHeaderMap_("ActivityLog");
  });

  withPerf_("dashboard source data read", () => {
    context.leadsTable = getCanonicalSheetTable_("Leads");
    context.activityTable = getCanonicalSheetTable_("ActivityLog");
  });

  withPerf_("dashboard snapshot/normalization", () => {
    context.activityIndex = buildDashboardActivityIndex_(
      context.activityTable
    );

    context.snapshotRows = buildDashboardLeadSnapshot_(
      context.leadsTable,
      context.activityIndex
    );

    context.records = dashboardSnapshotRowsToRecords_(
      context.snapshotRows
    );
  });

  withPerf_("dashboard filter-option construction", () => {
    context.filterOptions = buildDashboardFilterOptionsFromLeadsTable_(
      context.leadsTable
    );
  });

  return context;
}


/**
 * Returns the workbook's configured timezone.
 */
function getDashboardTimezone_() {
  if (EXECUTION_CACHE_.dashboardTimezone) {
    return EXECUTION_CACHE_.dashboardTimezone;
  }

  const timezone =
    String(
      getConfigValue_(
        "timezone"
      ) || ""
    ).trim() ||
    Session.getScriptTimeZone() ||
    "America/Chicago";

  EXECUTION_CACHE_.dashboardTimezone = timezone;

  return timezone;
}


/**
 * Safe Date test.
 */
function isDashboardDate_(
  value
) {
  return (
    value instanceof Date &&
    !isNaN(
      value.getTime()
    )
  );
}


/**
 * Converts a Date to yyyy-MM-dd in the clinic
 * timezone.
 */
function getDashboardDateKey_(
  value
) {
  if (
    !isDashboardDate_(
      value
    )
  ) {
    return "";
  }

  const cache =
    EXECUTION_CACHE_
      .dashboardDateKeyCache;

  const cacheKey =
    String(
      value.getTime()
    );

  if (
    Object.prototype.hasOwnProperty.call(
      cache,
      cacheKey
    )
  ) {
    return cache[cacheKey];
  }

  const key =
    Utilities.formatDate(
      value,
      getDashboardTimezone_(),
      "yyyy-MM-dd"
    );

  cache[cacheKey] = key;

  return key;
}


/**
 * Calendar-day difference in the configured
 * timezone.
 *
 * Positive = future.
 * Zero = today.
 * Negative = past.
 */
function getDashboardDayDifference_(
  value,
  referenceDate = new Date()
) {
  const valueKey =
    getDashboardDateKey_(
      value
    );

  const referenceKey =
    getDashboardDateKey_(
      referenceDate
    );

  if (
    !valueKey ||
    !referenceKey
  ) {
    return null;
  }

  const valueUtc =
    Date.parse(
      valueKey +
      "T00:00:00Z"
    );

  const referenceUtc =
    Date.parse(
      referenceKey +
      "T00:00:00Z"
    );

  return Math.round(
    (
      valueUtc -
      referenceUtc
    ) /
    86400000
  );
}


/**
 * Builds per-lead analytics derived from ActivityLog.
 *
 * READ ONLY.
 */
function buildDashboardActivityIndex_(activityTable) {
  const table =
    activityTable ||
    getCanonicalSheetTable_("ActivityLog");

  const index = {};

  if (table.values.length < 1) {
    return index;
  }

  const headers = table.headers;
  const rows = table.values;


  const readValue = (
    rowValues,
    headerName
  ) =>
    rowValues[
      headers[
        headerName
      ] - 1
    ];


  rows.forEach(
    rowValues => {

      const leadId =
        String(
          readValue(
            rowValues,
            "lead_id"
          ) || ""
        ).trim();


      if (!leadId) {
        return;
      }


      const activityType =
        String(
          readValue(
            rowValues,
            "activity_type"
          ) || ""
        ).trim();


      const occurredAtValue =
        readValue(
          rowValues,
          "occurred_at"
        );


      const recordedAtValue =
        readValue(
          rowValues,
          "recorded_at"
        );


      const activityDate =
        isDashboardDate_(
          occurredAtValue
        )
          ? occurredAtValue
          : (
              isDashboardDate_(
                recordedAtValue
              )
                ? recordedAtValue
                : null
            );


      if (!index[leadId]) {
        index[leadId] = {
          firstAttemptAt:
            null,

          firstAttemptActor:
            "",

          firstScheduledAt:
            null,
        };
      }


      const leadIndex =
        index[
          leadId
        ];


      /*
       * FIRST CONTACT ATTEMPT
       */
      if (
        activityType ===
          "contact_attempt" &&
        activityDate
      ) {
        if (
          !leadIndex.firstAttemptAt ||
          activityDate.getTime() <
            leadIndex
              .firstAttemptAt
              .getTime()
        ) {
          leadIndex.firstAttemptAt =
            activityDate;


          const actorEmail =
            String(
              readValue(
                rowValues,
                "actor_email"
              ) || ""
            ).trim();


          const actorName =
            String(
              readValue(
                rowValues,
                "actor_name"
              ) || ""
            ).trim();


          leadIndex.firstAttemptActor =
            actorEmail ||
            actorName;
        }
      }


      /*
       * FIRST TIME THE LEAD REACHED SCHEDULED
       *
       * status_change is canonical.
       * scheduled_date_set is retained as a useful
       * fallback for older DEV/test history.
       */
      const toStatus =
        String(
          readValue(
            rowValues,
            "to_status"
          ) || ""
        ).trim();


      const scheduledEvent =
        (
          activityType ===
            "status_change" &&
          toStatus ===
            "Scheduled"
        ) ||
        activityType ===
          "scheduled_date_set";


      if (
        scheduledEvent &&
        activityDate
      ) {
        if (
          !leadIndex.firstScheduledAt ||
          activityDate.getTime() <
            leadIndex
              .firstScheduledAt
              .getTime()
        ) {
          leadIndex.firstScheduledAt =
            activityDate;
        }
      }
    }
  );


  return index;
}


/**
 * Builds one analytics row per canonical lead.
 *
 * This is the bridge between operational data and
 * the dashboard.
 */
function buildDashboardLeadSnapshot_(leadsTable, activityIndexOverride) {
  const table =
    leadsTable ||
    getCanonicalSheetTable_("Leads");

  if (table.values.length < 1) {
    return [];
  }

  const headers = table.headers;
  const rows = table.values;


  const activityIndex =
    activityIndexOverride ||
    buildDashboardActivityIndex_();


  const now =
    new Date();


  const readValue = (
    rowValues,
    headerName
  ) =>
    rowValues[
      headers[
        headerName
      ] - 1
    ];


  const readText = (
    rowValues,
    headerName
  ) =>
    String(
      readValue(
        rowValues,
        headerName
      ) || ""
    ).trim();


  const snapshot = [];


  rows.forEach(
    rowValues => {

      const leadId =
        readText(
          rowValues,
          "lead_id"
        );


      if (!leadId) {
        return;
      }

      /*
       * Operational Dashboard population matches
       * the Board. Live-archived leads remain in
       * Leads and ActivityLog until cold storage,
       * but they do not contribute to Dashboard
       * KPIs or filter choices. Offloading an
       * already archived lead therefore does not
       * change these totals.
       */
      if (
        isLeadRowArchived_(
          headers,
          rowValues
        )
      ) {
        return;
      }


      const createdAt =
        readValue(
          rowValues,
          "created_at"
        );


      const intakeSource =
        readText(
          rowValues,
          "intake_source"
        );


      const appointmentReason =
        readText(
          rowValues,
          "appointment_reason"
        );


      const status =
        readText(
          rowValues,
          "status"
        );


      const attemptCount =
        Number(
          readValue(
            rowValues,
            "attempt_count"
          )
        ) || 0;


      const reachedPatient =
        Boolean(
          readValue(
            rowValues,
            "reached_patient"
          )
        );


      const assignedTo =
        readText(
          rowValues,
          "assigned_to"
        );


      const nextFollowUpOn =
        readValue(
          rowValues,
          "next_follow_up_on"
        );


      const scheduledDate =
        readValue(
          rowValues,
          "scheduled_date"
        );


      const workflowComplete =
        Boolean(
          readValue(
            rowValues,
            "workflow_complete"
          )
        );


      const duplicateFlag =
        Boolean(
          readValue(
            rowValues,
            "duplicate_flag"
          )
        );


      const scheduleDateMissing =
        Boolean(
          readValue(
            rowValues,
            "schedule_date_missing"
          )
        );


      const activity =
        activityIndex[
          leadId
        ] || {};


      /*
       * Prefer ActivityLog because it records what
       * actually happened.
       *
       * Leads.first_attempt_at is retained as a
       * fallback for older test data.
       */
      let firstAttemptAt =
        activity.firstAttemptAt;


      if (
        !isDashboardDate_(
          firstAttemptAt
        )
      ) {
        const leadFirstAttempt =
          readValue(
            rowValues,
            "first_attempt_at"
          );

        if (
          isDashboardDate_(
            leadFirstAttempt
          )
        ) {
          firstAttemptAt =
            leadFirstAttempt;
        }
      }


      let firstAttemptMinutes =
        "";


      if (
        isDashboardDate_(
          createdAt
        ) &&
        isDashboardDate_(
          firstAttemptAt
        )
      ) {
        const difference =
          (
            firstAttemptAt.getTime() -
            createdAt.getTime()
          ) /
          60000;

        /*
         * Negative response time indicates bad source
         * data and should not become a KPI value.
         */
        if (
          difference >= 0
        ) {
          firstAttemptMinutes =
            Math.round(
              difference * 10
            ) / 10;
        }
      }


      const everScheduled =
        Boolean(
          isDashboardDate_(
            activity.firstScheduledAt
          ) ||
          status ===
            "Scheduled"
        );


      /*
       * Current definition for conversion eligibility:
       *
       * - Unrelated inquiries are not new-patient
       *   appointment opportunities.
       * - Known duplicate leads are excluded.
       *
       * We will validate this business definition with
       * the clinic during Phase 8.
       */
      const legitimateAppointmentLead =
        (
          status !==
            "Unrelated" &&
          !duplicateFlag
        );


      const openUntouched =
        (
          status ===
            "Open Lead / Follow Up" &&
          !workflowComplete &&
          attemptCount === 0
        );


      let followUpOverdue =
        false;

      let followUpDueToday =
        false;

      let followUpDueNext7Days =
        false;


      if (
        status ===
          "Open Lead / Follow Up" &&
        !workflowComplete &&
        isDashboardDate_(
          nextFollowUpOn
        )
      ) {
        const dayDifference =
          getDashboardDayDifference_(
            nextFollowUpOn,
            now
          );


        followUpOverdue =
          dayDifference < 0;


        followUpDueToday =
          dayDifference === 0;


        followUpDueNext7Days =
          (
            dayDifference > 0 &&
            dayDifference <= 7
          );
      }


      let openAgeHours =
        "";


      if (
        status ===
          "Open Lead / Follow Up" &&
        !workflowComplete &&
        isDashboardDate_(
          createdAt
        )
      ) {
        openAgeHours =
          Math.max(
            0,
            Math.round(
              (
                now.getTime() -
                createdAt.getTime()
              ) /
              360000
            ) /
            10
          );
      }


      snapshot.push([
        leadId,

        createdAt,

        intakeSource,

        appointmentReason,

        status,

        attemptCount,

        reachedPatient,

        assignedTo,

        firstAttemptAt || "",

        firstAttemptMinutes,

        activity.firstAttemptActor ||
          "",

        everScheduled,

        activity.firstScheduledAt ||
          "",

        scheduledDate,

        nextFollowUpOn,

        workflowComplete,

        readText(
          rowValues,
          "lost_reason"
        ),

        readText(
          rowValues,
          "unrelated_type"
        ),

        readText(
          rowValues,
          "page_name"
        ),

        readText(
          rowValues,
          "source_path"
        ),

        readText(
          rowValues,
          "utm_source"
        ),

        readText(
          rowValues,
          "utm_medium"
        ),

        readText(
          rowValues,
          "utm_campaign"
        ),

        duplicateFlag,

        readValue(
          rowValues,
          "last_activity_at"
        ),

        legitimateAppointmentLead,

        openUntouched,

        followUpOverdue,

        followUpDueToday,

        followUpDueNext7Days,

        openAgeHours,

        scheduleDateMissing,
      ]);
    }
  );


  return snapshot;
}


/**
 * Rebuilds the hidden/helper analytics dataset.
 */
function rebuildDashboardData_() {
  ensureDashboardRefreshSourceContext_();

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dataSheet
    );

  if (!sheet) {
    throw new Error(
      "DashboardData worksheet was not found."
    );
  }


  const headers =
    PATIENT_DASHBOARD
      .dataHeaders;


  const context =
    getDashboardRefreshContext_();

  const rows =
    context &&
    context.snapshotRows
      ? context.snapshotRows
      : buildDashboardLeadSnapshot_();


  /*
   * DashboardData is reserved specifically for
   * generated analytics helper data.
   *
   * Pass 3: clear only the helper data columns
   * instead of the entire worksheet. Trend helper
   * columns starting at AH are rewritten later.
   */
  withPerf_(
    "dashboard DashboardData clear/write",
    () => {
      const clearRowCount =
        Math.max(
          sheet.getLastRow(),
          rows.length + 1,
          1
        );

      sheet
        .getRange(
          1,
          1,
          clearRowCount,
          headers.length
        )
        .clearContent()
        .clearFormat();


      sheet
        .getRange(
          1,
          1,
          1,
          headers.length
        )
        .setValues([
          headers,
        ])
        .setFontWeight(
          "bold"
        );


      if (
        rows.length > 0
      ) {
        sheet
          .getRange(
            2,
            1,
            rows.length,
            headers.length
          )
          .setValues(
            rows
          );
      }


      sheet.setFrozenRows(
        1
      );
    }
  );


  /*
   * Date / timestamp formatting.
   */
  const headerMap = {};

  headers.forEach(
    (
      header,
      index
    ) => {
      headerMap[
        header
      ] =
        index + 1;
    }
  );


  const dataRowCount =
    Math.max(
      rows.length,
      1
    );


  withPerf_(
    "dashboard DashboardData formatting",
    () => {
      [
        "created_at",
        "first_attempt_at",
        "first_scheduled_at",
        "last_activity_at",
      ].forEach(
        headerName => {
          sheet
            .getRange(
              2,
              headerMap[
                headerName
              ],
              dataRowCount,
              1
            )
            .setNumberFormat(
              "m/d/yyyy h:mm AM/PM"
            );
        }
      );


      [
        "current_scheduled_date",
        "next_follow_up_on",
      ].forEach(
        headerName => {
          sheet
            .getRange(
              2,
              headerMap[
                headerName
              ],
              dataRowCount,
              1
            )
            .setNumberFormat(
              "m/d/yyyy"
            );
        }
      );
    }
  );


  /*
   * autoResizeColumns was omitted on purpose.
   * It does not change Dashboard metrics or the
   * visible Dashboard sheet, and it was a major
   * helper-sheet cost on every refresh.
   */


  return {
    rowCount:
      rows.length,

    columnCount:
      headers.length,
  };
}


/**
 * Returns the unique filter choices currently
 * represented in Leads.
 */
function getDashboardFilterOptions_() {
  const context =
    getDashboardRefreshContext_();

  if (
    context &&
    context.filterOptions
  ) {
    return context.filterOptions;
  }

  const table =
    getCanonicalSheetTable_("Leads");

  return buildDashboardFilterOptionsFromLeadsTable_(
    table
  );
}


/**
 * Replaces an existing named range safely.
 */
function setDashboardNamedRange_(
  name,
  range
) {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  ss
    .getNamedRanges()
    .forEach(
      namedRange => {
        if (
          namedRange.getName() ===
          name
        ) {
          namedRange.remove();
        }
      }
    );


  ss.setNamedRange(
    name,
    range
  );
}


/**
 * Refreshes Dashboard dropdown values.
 */
function refreshDashboardFilterOptions_() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );

  if (!sheet) {
    throw new Error(
      "Dashboard worksheet was not found."
    );
  }


  const options =
    getDashboardFilterOptions_();


  const buildDropdown =
    values =>
      SpreadsheetApp
        .newDataValidation()
        .requireValueInList(
          [
            "All",
            ...values,
          ],
          true
        )
        .setAllowInvalid(
          false
        )
        .build();


  sheet
    .getRange(
      "F4"
    )
    .setDataValidation(
      buildDropdown(
        options.reasons
      )
    );


  sheet
    .getRange(
      "H4"
    )
    .setDataValidation(
      buildDropdown(
        options.sources
      )
    );


  sheet
    .getRange(
      "J4"
    )
    .setDataValidation(
      buildDropdown(
        options.employees
      )
    );


  /*
   * Date fields.
   */
  const dateValidation =
    SpreadsheetApp
      .newDataValidation()
      .requireDate()
      .setAllowInvalid(
        false
      )
      .build();


  sheet
    .getRange(
      "B4"
    )
    .setDataValidation(
      dateValidation
    );


  sheet
    .getRange(
      "D4"
    )
    .setDataValidation(
      dateValidation
    );
}


/**
 * PHASE 6A
 *
 * Creates the staff-facing Dashboard foundation.
 *
 * Safe to rerun during Phase 6 development.
 */
function setupDashboardFoundation() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  let sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  if (!sheet) {
    sheet =
      ss.insertSheet(
        PATIENT_DASHBOARD
          .dashboardSheet
      );
  }


  /*
   * Preserve current filters if this function is
   * rerun.
   */
  const previousStart =
    sheet
      .getRange(
        "B4"
      )
      .getValue();


  const previousEnd =
    sheet
      .getRange(
        "D4"
      )
      .getValue();


  const previousReason =
    sheet
      .getRange(
        "F4"
      )
      .getDisplayValue()
      .trim();


  const previousSource =
    sheet
      .getRange(
        "H4"
      )
      .getDisplayValue()
      .trim();


  const previousEmployee =
    sheet
      .getRange(
        "J4"
      )
      .getDisplayValue()
      .trim();


  /*
   * Rebuild the Dashboard control area below the
   * static application header. Row 1 is owned by
   * setupStaticApplicationHeaders() and must keep
   * the logo in A1.
   */
  sheet
    .getRange(
      "A2:J6"
    )
    .breakApart()
    .clearContent()
    .clearFormat();


  sheet.setHiddenGridlines(
    true
  );


  /*
   * Subtitle. The row-1 title lives in
   * setupDashboardStaticHeader().
   */
  sheet
    .getRange(
      "A2:J2"
    )
    .merge()
    .setValue(
      "Operational analytics generated from Leads and ActivityLog"
    )
    .setFontSize(
      10
    );


  /*
   * Filter labels
   */
  sheet
    .getRange(
      "A4"
    )
    .setValue(
      "Start Date"
    )
    .setFontWeight(
      "bold"
    );


  sheet
    .getRange(
      "C4"
    )
    .setValue(
      "End Date"
    )
    .setFontWeight(
      "bold"
    );


  sheet
    .getRange(
      "E4"
    )
    .setValue(
      "Appointment Reason"
    )
    .setFontWeight(
      "bold"
    );


  sheet
    .getRange(
      "G4"
    )
    .setValue(
      "Source"
    )
    .setFontWeight(
      "bold"
    );


  sheet
    .getRange(
      "I4"
    )
    .setValue(
      "Assigned Employee"
    )
    .setFontWeight(
      "bold"
    );


  /*
   * Restore or initialize filter values.
   */
  sheet
    .getRange(
      "B4"
    )
    .setValue(
      isDashboardDate_(
        previousStart
      )
        ? previousStart
        : ""
    )
    .setNumberFormat(
      "m/d/yyyy"
    );


  sheet
    .getRange(
      "D4"
    )
    .setValue(
      isDashboardDate_(
        previousEnd
      )
        ? previousEnd
        : ""
    )
    .setNumberFormat(
      "m/d/yyyy"
    );


  sheet
    .getRange(
      "F4"
    )
    .setValue(
      previousReason ||
      "All"
    );


  sheet
    .getRange(
      "H4"
    )
    .setValue(
      previousSource ||
      "All"
    );


  sheet
    .getRange(
      "J4"
    )
    .setValue(
      previousEmployee ||
      "All"
    );


  /*
   * Universal filter named ranges.
   */
  setDashboardNamedRange_(
    PATIENT_DASHBOARD
      .namedRanges
      .startDate,

    sheet.getRange(
      "B4"
    )
  );


  setDashboardNamedRange_(
    PATIENT_DASHBOARD
      .namedRanges
      .endDate,

    sheet.getRange(
      "D4"
    )
  );


  setDashboardNamedRange_(
    PATIENT_DASHBOARD
      .namedRanges
      .reason,

    sheet.getRange(
      "F4"
    )
  );


  setDashboardNamedRange_(
    PATIENT_DASHBOARD
      .namedRanges
      .source,

    sheet.getRange(
      "H4"
    )
  );


  setDashboardNamedRange_(
    PATIENT_DASHBOARD
      .namedRanges
      .employee,

    sheet.getRange(
      "J4"
    )
  );


  refreshDashboardFilterOptions_();


  sheet
    .getRange(
      "A6:J6"
    )
    .merge()
    .setValue(
      "Blank dates = All Time. All future KPIs and charts will use these same filters."
    )
    .setFontSize(
      10
    );


  /*
   * Basic layout.
   */
  [
    110,
    110,
    110,
    110,
    150,
    150,
    110,
    135,
    130,
    180,
  ].forEach(
    (
      width,
      index
    ) => {
      sheet.setColumnWidth(
        index + 1,
        width
      );
    }
  );


  sheet.setFrozenRows(
    4
  );


  setupDashboardFilterControls_();


  const result =
    rebuildDashboardData_();


  ss.setActiveSheet(
    sheet
  );


  return result;
}


/**
 * Opens the staff Dashboard.
 */
function openPatientDashboard() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );

  if (!sheet) {
    throw new Error(
      "Dashboard has not been initialized."
    );
  }

  ss.setActiveSheet(
    sheet
  );
}


/**
 * Reads and validates the five universal
 * Dashboard filters.
 */
function getDashboardFilterState_() {
  const context =
    getDashboardRefreshContext_();

  if (
    context &&
    context.filters
  ) {
    return context.filters;
  }

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  const getNamedValue =
    name => {
      const range =
        ss.getRangeByName(
          name
        );

      if (!range) {
        throw new Error(
          `Dashboard named range "${name}" was not found.`
        );
      }

      return range.getValue();
    };


  const getNamedText =
    name =>
      String(
        getNamedValue(
          name
        ) || ""
      ).trim();


  const startDate =
    getNamedValue(
      PATIENT_DASHBOARD
        .namedRanges
        .startDate
    );


  const endDate =
    getNamedValue(
      PATIENT_DASHBOARD
        .namedRanges
        .endDate
    );


  const cleanStartDate =
    isDashboardDate_(
      startDate
    )
      ? startDate
      : null;


  const cleanEndDate =
    isDashboardDate_(
      endDate
    )
      ? endDate
      : null;


  if (
    cleanStartDate &&
    cleanEndDate
  ) {
    const startKey =
      getDashboardDateKey_(
        cleanStartDate
      );

    const endKey =
      getDashboardDateKey_(
        cleanEndDate
      );


    if (
      startKey >
      endKey
    ) {
      throw new Error(
        "Dashboard Start Date cannot be after End Date."
      );
    }
  }


  const normalizeOption =
    value => {
      const text =
        String(
          value || ""
        ).trim();

      return (
        !text ||
        text === "All"
      )
        ? ""
        : text;
    };


  const filters = {
    startDate:
      cleanStartDate,

    endDate:
      cleanEndDate,

    reason:
      normalizeOption(
        getNamedText(
          PATIENT_DASHBOARD
            .namedRanges
            .reason
        )
      ),

    source:
      normalizeOption(
        getNamedText(
          PATIENT_DASHBOARD
            .namedRanges
            .source
        )
      ),

    employee:
      normalizeOption(
        getNamedText(
          PATIENT_DASHBOARD
            .namedRanges
            .employee
        )
      ),
  };

  if (context) {
    cacheDashboardFilterBounds_(context, filters);
  }

  return filters;
}


/**
 * Reads DashboardData into named row objects.
 */
function getDashboardDataRecords_() {
  const context =
    getDashboardRefreshContext_();

  if (
    context &&
    context.records
  ) {
    return context.records;
  }

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dataSheet
    );


  if (!sheet) {
    throw new Error(
      "DashboardData worksheet was not found."
    );
  }


  const lastRow =
    sheet.getLastRow();

  const lastColumn =
    sheet.getLastColumn();


  if (
    lastRow < 2 ||
    lastColumn < 1
  ) {
    return [];
  }


  const headers =
    sheet
      .getRange(
        1,
        1,
        1,
        lastColumn
      )
      .getDisplayValues()[0]
      .map(
        value =>
          String(
            value || ""
          ).trim()
      );


  const rows =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        lastColumn
      )
      .getValues();


  return rows
    .map(
      rowValues => {

        const record = {};

        headers.forEach(
          (
            header,
            index
          ) => {
            if (header) {
              record[
                header
              ] =
                rowValues[
                  index
                ];
            }
          }
        );

        return record;
      }
    )
    .filter(
      record =>
        String(
          record.lead_id || ""
        ).trim()
    );
}


/**
 * Checks whether a timestamp belongs to the
 * Dashboard's selected lead-cohort range.
 *
 * Blank start/end = open-ended.
 */
function dashboardDateMatchesFilter_(
  value,
  filters
) {
  if (
    !isDashboardDate_(
      value
    )
  ) {
    return false;
  }


  const valueKey =
    getDashboardDateKey_(
      value
    );

  const context =
    getDashboardRefreshContext_();

  const startKey =
    context
      ? context.filterStartKey
      : (
          filters.startDate
            ? getDashboardDateKey_(
                filters.startDate
              )
            : ""
        );

  const endKey =
    context
      ? context.filterEndKey
      : (
          filters.endDate
            ? getDashboardDateKey_(
                filters.endDate
              )
            : ""
        );


  if (
    filters.startDate &&
    valueKey < startKey
  ) {
    return false;
  }


  if (
    filters.endDate &&
    valueKey > endKey
  ) {
    return false;
  }


  return true;
}


/**
 * Applies Appointment Reason, Source, and Assigned
 * Employee to one DashboardData lead.
 */
function dashboardRecordMatchesCategoryFilters_(
  record,
  filters
) {
  const reason =
    String(
      record
        .appointment_reason ||
      ""
    ).trim();


  const source =
    String(
      record
        .intake_source ||
      ""
    ).trim();


  const employee =
    String(
      record
        .assigned_to ||
      ""
    ).trim();


  if (
    filters.reason &&
    reason !==
      filters.reason
  ) {
    return false;
  }


  if (
    filters.source &&
    source !==
      filters.source
  ) {
    return false;
  }


  if (
    filters.employee &&
    employee !==
      filters.employee
  ) {
    return false;
  }


  return true;
}


/**
 * Returns the one canonical cohort used across
 * Phase 6 KPI cards.
 *
 * Date selection uses Leads.created_at.
 */
function buildDashboardFilteredCohort_() {
  const context =
    getDashboardRefreshContext_();

  if (
    context &&
    context.filteredCohort
  ) {
    return context.filteredCohort;
  }

  const filters =
    getDashboardFilterState_();


  const records =
    getDashboardDataRecords_();


  const cohort =
    records.filter(
      record => {

        if (
          !dashboardRecordMatchesCategoryFilters_(
            record,
            filters
          )
        ) {
          return false;
        }


        return dashboardDateMatchesFilter_(
          record.created_at,
          filters
        );
      }
    );


  const result = {
    filters,
    cohort,
    allRecords:
      records,
  };

  if (context) {
    context.filteredCohort = result;
  }

  return result;
}


/**
 * Returns DashboardData records after applying only
 * the categorical universal filters.
 *
 * The trend engine applies the date range separately
 * to lead creation and scheduling-event dates.
 */
function buildDashboardCategoryFilteredRecords_() {
  const context =
    getDashboardRefreshContext_();

  if (
    context &&
    context.categoryFilteredRecords
  ) {
    return context.categoryFilteredRecords;
  }

  const filters =
    getDashboardFilterState_();


  const records =
    getDashboardDataRecords_()
      .filter(
        record =>
          dashboardRecordMatchesCategoryFilters_(
            record,
            filters
          )
      );


  const result = {
    filters,
    records,
  };

  if (context) {
    context.categoryFilteredRecords = result;
  }

  return result;
}


/**
 * Returns clinic-local date keys for the current
 * day, week, and month.
 *
 * Week begins Monday.
 */
function getDashboardCurrentPeriodKeys_() {
  const context =
    getDashboardRefreshContext_();

  if (
    context &&
    context.periodKeys
  ) {
    return context.periodKeys;
  }

  const timezone =
    getDashboardTimezone_();


  const now =
    new Date();


  const todayKey =
    Utilities.formatDate(
      now,
      timezone,
      "yyyy-MM-dd"
    );


  /*
   * Parse only the date key into UTC so date
   * arithmetic doesn't depend on the script/server
   * machine's local timezone.
   */
  const todayUtc =
    new Date(
      `${todayKey}T00:00:00Z`
    );


  const dayOfWeek =
    todayUtc.getUTCDay();


  /*
   * Sunday = 0
   * Monday = 1
   *
   * Convert to Monday-based offset.
   */
  const daysSinceMonday =
    (
      dayOfWeek +
      6
    ) %
    7;


  const weekStartUtc =
    new Date(
      todayUtc.getTime() -
      (
        daysSinceMonday *
        86400000
      )
    );


  const weekStartKey =
    Utilities.formatDate(
      weekStartUtc,
      "UTC",
      "yyyy-MM-dd"
    );


  const monthStartKey =
    todayKey.substring(
      0,
      7
    ) +
    "-01";


  const periodKeys = {
    today:
      todayKey,

    weekStart:
      weekStartKey,

    monthStart:
      monthStartKey,
  };

  if (context) {
    context.periodKeys = periodKeys;
  }

  return periodKeys;
}


/**
 * Returns the numerical median or null when there
 * are no valid values.
 */
function calculateDashboardMedian_(
  values
) {
  const clean =
    values
      .map(
        value =>
          Number(
            value
          )
      )
      .filter(
        value =>
          Number.isFinite(
            value
          ) &&
          value >= 0
      )
      .sort(
        (
          a,
          b
        ) =>
          a - b
      );


  if (
    clean.length === 0
  ) {
    return null;
  }


  const middle =
    Math.floor(
      clean.length / 2
    );


  if (
    clean.length %
      2 ===
    1
  ) {
    return clean[
      middle
    ];
  }


  return (
    clean[
      middle - 1
    ] +
    clean[
      middle
    ]
  ) / 2;
}


/**
 * Formats minutes for staff-facing KPI display.
 */
function formatDashboardDuration_(
  minutes
) {
  if (
    minutes === null ||
    minutes === undefined ||
    !Number.isFinite(
      Number(
        minutes
      )
    )
  ) {
    return "—";
  }


  const totalMinutes =
    Math.max(
      0,
      Math.round(
        Number(
          minutes
        )
      )
    );


  if (
    totalMinutes <
    60
  ) {
    return `${totalMinutes}m`;
  }


  const hours =
    Math.floor(
      totalMinutes / 60
    );


  const remainingMinutes =
    totalMinutes %
    60;


  if (
    hours <
    24
  ) {
    return remainingMinutes
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }


  const days =
    Math.floor(
      hours / 24
    );


  const remainingHours =
    hours %
    24;


  return remainingHours
    ? `${days}d ${remainingHours}h`
    : `${days}d`;
}


function incrementDashboardPerformanceGroup_(
  groups,
  label,
  everScheduled
) {
  if (!groups[label]) {
    groups[label] = {
      label,
      leads: 0,
      scheduled: 0,
    };
  }

  groups[label].leads += 1;

  if (everScheduled) {
    groups[label].scheduled += 1;
  }
}


function finalizeDashboardPerformanceGroups_(groups) {
  const rows = Object.values(groups)
    .map(group => ({
      label: group.label,
      leads: group.leads,
      scheduled: group.scheduled,
      conversion:
        group.leads > 0
          ? group.scheduled / group.leads
          : null,
      smallSample: group.leads < 5,
    }))
    .sort((a, b) => {
      if (a.leads !== b.leads) {
        return b.leads - a.leads;
      }

      return a.label.localeCompare(b.label);
    });

  const totalLeads = rows.reduce(
    (sum, row) => sum + row.leads,
    0
  );
  const totalScheduled = rows.reduce(
    (sum, row) => sum + row.scheduled,
    0
  );

  return {
    rows,
    totalLeads,
    totalScheduled,
    conversion:
      totalLeads > 0
        ? totalScheduled / totalLeads
        : null,
  };
}


function incrementDashboardStatusGroup_(groups, label) {
  groups[label] = (groups[label] || 0) + 1;
}


function finalizeDashboardStatusGroups_(groups, total) {
  const rows = Object.entries(groups)
    .map(([label, count]) => ({
      label,
      count,
      share: total > 0 ? count / total : 0,
    }))
    .sort((a, b) => {
      if (a.count !== b.count) {
        return b.count - a.count;
      }

      return a.label.localeCompare(b.label);
    });

  return {
    rows,
    total,
  };
}


function ensureDashboardEmployeeWorkloadGroup_(groups, employee) {
  if (!groups[employee]) {
    groups[employee] = {
      employee,
      openAssigned: 0,
      attemptsToday: 0,
      followUpsDue: 0,
      scheduledLeadIdsToday: new Set(),
    };
  }

  return groups[employee];
}


function finalizeDashboardEmployeeWorkload_(groups) {
  const rows = Object.values(groups)
    .map(group => ({
      employee: group.employee,
      openAssigned: group.openAssigned,
      attemptsToday: group.attemptsToday,
      followUpsDue: group.followUpsDue,
      scheduledToday: group.scheduledLeadIdsToday.size,
    }))
    .sort((a, b) => {
      if (a.openAssigned !== b.openAssigned) {
        return b.openAssigned - a.openAssigned;
      }

      if (a.followUpsDue !== b.followUpsDue) {
        return b.followUpsDue - a.followUpsDue;
      }

      if (a.attemptsToday !== b.attemptsToday) {
        return b.attemptsToday - a.attemptsToday;
      }

      return a.employee.localeCompare(b.employee);
    });

  const totals = rows.reduce(
    (total, row) => {
      total.openAssigned += row.openAssigned;
      total.attemptsToday += row.attemptsToday;
      total.followUpsDue += row.followUpsDue;
      total.scheduledToday += row.scheduledToday;
      return total;
    },
    {
      openAssigned: 0,
      attemptsToday: 0,
      followUpsDue: 0,
      scheduledToday: 0,
    }
  );

  return {
    rows,
    totals,
  };
}


function applyDashboardWorkloadActivity_(
  leadAssignee,
  groups,
  activityTable
) {
  const table =
    activityTable ||
    getCanonicalSheetTable_("ActivityLog");

  if (!table || table.values.length < 1) {
    return;
  }

  const headers = table.headers;
  const todayKey = getDashboardDateKey_(new Date());

  table.values.forEach(rowValues => {
    const leadId = String(
      rowValues[headers.lead_id - 1] || ""
    ).trim();

    if (
      !Object.prototype.hasOwnProperty.call(
        leadAssignee,
        leadId
      )
    ) {
      return;
    }

    const occurredAt = rowValues[headers.occurred_at - 1];
    const recordedAt = rowValues[headers.recorded_at - 1];
    const activityDate = isDashboardDate_(occurredAt)
      ? occurredAt
      : (
          isDashboardDate_(recordedAt)
            ? recordedAt
            : null
        );

    if (
      !activityDate ||
      getDashboardDateKey_(activityDate) !== todayKey
    ) {
      return;
    }

    const workload = ensureDashboardEmployeeWorkloadGroup_(
      groups,
      leadAssignee[leadId]
    );
    const activityType = String(
      rowValues[headers.activity_type - 1] || ""
    ).trim();

    if (activityType === "contact_attempt") {
      workload.attemptsToday += 1;
    }

    const toStatus = String(
      rowValues[headers.to_status - 1] || ""
    ).trim();

    if (
      activityType === "status_change" &&
      toStatus === "Scheduled"
    ) {
      workload.scheduledLeadIdsToday.add(leadId);
    }
  });
}


/**
 * Pass 3.5: one in-memory pass over the filtered
 * Dashboard cohort produces KPI, operational, and
 * business lead-side aggregates. ActivityLog for
 * employee workload reuses the cached canonical
 * table instead of a second sheet read.
 */
function buildDashboardSharedLeadAggregates_(
  cohort,
  filters,
  period
) {
  let newToday = 0;
  let newThisWeek = 0;
  let newThisMonth = 0;
  let openUntouched = 0;
  let needsAttention = 0;
  let scheduled = 0;
  let legitimateLeadCount = 0;
  let legitimateScheduled = 0;
  const firstAttemptMinutes = [];

  const attemptBuckets = {
    zero: 0,
    one: 0,
    two: 0,
    three: 0,
    fourPlus: 0,
  };
  const agingBuckets = {
    under24Hours: 0,
    oneToTwoDays: 0,
    threeToSevenDays: 0,
    overSevenDays: 0,
  };
  let oldestOpenHours = null;
  let openLeadCount = 0;
  let overdueFollowUps = 0;
  let dueToday = 0;
  let dueNext7Days = 0;
  let scheduleDateNeeded = 0;

  const reasonGroups = {};
  const sourceGroups = {};
  const caseLostGroups = {};
  let caseLostTotal = 0;
  const unrelatedGroups = {};
  let unrelatedTotal = 0;
  const workloadGroups = {};
  const leadAssignee = {};

  cohort.forEach(record => {
    const createdKey = getDashboardDateKey_(record.created_at);

    if (createdKey === period.today) {
      newToday += 1;
    }

    if (
      createdKey &&
      createdKey >= period.weekStart &&
      createdKey <= period.today
    ) {
      newThisWeek += 1;
    }

    if (
      createdKey &&
      createdKey >= period.monthStart &&
      createdKey <= period.today
    ) {
      newThisMonth += 1;
    }

    if (Boolean(record.open_untouched)) {
      openUntouched += 1;
    }

    const status = String(record.status || "").trim();
    const completeBoolean = Boolean(record.workflow_complete);
    const completeFlag = getDashboardBoolean_(
      record.workflow_complete
    );
    const ageHours = Number(record.open_age_hours);

    if (Boolean(record.follow_up_overdue)) {
      needsAttention += 1;
    } else if (
      status === "Open Lead / Follow Up" &&
      !completeBoolean &&
      Number.isFinite(ageHours) &&
      ageHours >= 168
    ) {
      needsAttention += 1;
    }

    const everScheduledBoolean = Boolean(record.ever_scheduled);
    const everScheduledFlag = getDashboardBoolean_(
      record.ever_scheduled
    );

    if (everScheduledBoolean) {
      scheduled += 1;
    }

    if (Boolean(record.legitimate_appointment_lead)) {
      legitimateLeadCount += 1;

      if (everScheduledBoolean) {
        legitimateScheduled += 1;
      }
    }

    const minutes = record.first_attempt_minutes;

    if (
      minutes !== "" &&
      minutes !== null &&
      minutes !== undefined
    ) {
      firstAttemptMinutes.push(minutes);
    }

    if (
      status === "Open Lead / Follow Up" &&
      !completeFlag
    ) {
      openLeadCount += 1;

      const attempts = Math.max(
        0,
        Number(record.attempt_count) || 0
      );

      if (attempts === 0) {
        attemptBuckets.zero += 1;
      } else if (attempts === 1) {
        attemptBuckets.one += 1;
      } else if (attempts === 2) {
        attemptBuckets.two += 1;
      } else if (attempts === 3) {
        attemptBuckets.three += 1;
      } else {
        attemptBuckets.fourPlus += 1;
      }

      if (Number.isFinite(ageHours) && ageHours >= 0) {
        if (
          oldestOpenHours === null ||
          ageHours > oldestOpenHours
        ) {
          oldestOpenHours = ageHours;
        }

        if (ageHours < 24) {
          agingBuckets.under24Hours += 1;
        } else if (ageHours < 72) {
          agingBuckets.oneToTwoDays += 1;
        } else if (ageHours < 192) {
          agingBuckets.threeToSevenDays += 1;
        } else {
          agingBuckets.overSevenDays += 1;
        }
      }
    }

    if (getDashboardBoolean_(record.follow_up_overdue)) {
      overdueFollowUps += 1;
    }

    if (getDashboardBoolean_(record.follow_up_due_today)) {
      dueToday += 1;
    }

    if (getDashboardBoolean_(record.follow_up_due_next_7_days)) {
      dueNext7Days += 1;
    }

    if (
      status === "Scheduled" &&
      getDashboardBoolean_(record.schedule_date_missing)
    ) {
      scheduleDateNeeded += 1;
    }

    if (getDashboardBoolean_(record.legitimate_appointment_lead)) {
      incrementDashboardPerformanceGroup_(
        reasonGroups,
        getDashboardGroupLabel_(record.appointment_reason),
        everScheduledFlag
      );

      incrementDashboardPerformanceGroup_(
        sourceGroups,
        getDashboardPageSourceLabel_(record),
        everScheduledFlag
      );
    }

    if (status === "Case Lost") {
      caseLostTotal += 1;
      incrementDashboardStatusGroup_(
        caseLostGroups,
        getDashboardGroupLabel_(
          record.lost_reason,
          "(Reason missing)"
        )
      );
    }

    if (status === "Unrelated") {
      unrelatedTotal += 1;
      incrementDashboardStatusGroup_(
        unrelatedGroups,
        getDashboardGroupLabel_(
          record.unrelated_type,
          "(Type missing)"
        )
      );
    }

    const leadId = String(record.lead_id || "").trim();

    if (leadId) {
      const employee = getDashboardGroupLabel_(
        record.assigned_to,
        "(Unassigned)"
      );

      leadAssignee[leadId] = employee;

      const workload = ensureDashboardEmployeeWorkloadGroup_(
        workloadGroups,
        employee
      );

      if (
        status === "Open Lead / Follow Up" &&
        !completeFlag
      ) {
        workload.openAssigned += 1;

        if (
          getDashboardBoolean_(record.follow_up_overdue) ||
          getDashboardBoolean_(record.follow_up_due_today)
        ) {
          workload.followUpsDue += 1;
        }
      }
    }
  });

  applyDashboardWorkloadActivity_(
    leadAssignee,
    workloadGroups
  );

  const conversion =
    legitimateLeadCount > 0
      ? legitimateScheduled / legitimateLeadCount
      : null;
  const medianFirstAttemptMinutes =
    calculateDashboardMedian_(firstAttemptMinutes);

  return {
    cohortCount: cohort.length,
    filters,
    kpis: {
      cohortCount: cohort.length,
      legitimateLeadCount,
      legitimateScheduledCount: legitimateScheduled,
      newToday,
      newThisWeek,
      newThisMonth,
      openUntouched,
      needsAttention,
      scheduled,
      conversion,
      medianFirstAttemptMinutes,
      medianFirstAttemptDisplay: formatDashboardDuration_(
        medianFirstAttemptMinutes
      ),
      filters,
    },
    operational: {
      cohortCount: cohort.length,
      openLeadCount,
      attempts: {
        zero: attemptBuckets.zero,
        one: attemptBuckets.one,
        two: attemptBuckets.two,
        three: attemptBuckets.three,
        fourPlus: attemptBuckets.fourPlus,
      },
      aging: {
        under24Hours: agingBuckets.under24Hours,
        oneToTwoDays: agingBuckets.oneToTwoDays,
        threeToSevenDays: agingBuckets.threeToSevenDays,
        overSevenDays: agingBuckets.overSevenDays,
        oldestOpenHours,
      },
      followUps: {
        overdue: overdueFollowUps,
        dueToday,
        dueNext7Days,
      },
      scheduleDateNeeded,
      filters,
    },
    business: {
      cohortCount: cohort.length,
      filters,
      reason: finalizeDashboardPerformanceGroups_(reasonGroups),
      source: finalizeDashboardPerformanceGroups_(sourceGroups),
      caseLost: finalizeDashboardStatusGroups_(
        caseLostGroups,
        caseLostTotal
      ),
      unrelated: finalizeDashboardStatusGroups_(
        unrelatedGroups,
        unrelatedTotal
      ),
      workload: finalizeDashboardEmployeeWorkload_(workloadGroups),
    },
  };
}


function ensureDashboardSharedLeadAggregates_() {
  const context = getDashboardRefreshContext_();

  if (context && context.sharedLeadAggregates) {
    return context.sharedLeadAggregates;
  }

  const filtered = buildDashboardFilteredCohort_();
  const aggregates = buildDashboardSharedLeadAggregates_(
    filtered.cohort,
    filtered.filters,
    getDashboardCurrentPeriodKeys_()
  );

  if (context) {
    context.sharedLeadAggregates = aggregates;
  }

  return aggregates;
}


/**
 * PHASE 6B
 *
 * Calculates all staff-facing KPIs from the same
 * filtered lead cohort.
 */
function calculateDashboardKpis_() {
  return ensureDashboardSharedLeadAggregates_().kpis;
}


/**
 * Returns the display value for one KPI.
 */
function getDashboardKpiDisplayValue_(
  key,
  metrics
) {
  switch (
    key
  ) {
    case "newToday":
      return String(
        metrics.newToday
      );

    case "newThisWeek":
      return String(
        metrics.newThisWeek
      );

    case "newThisMonth":
      return String(
        metrics.newThisMonth
      );

    case "openUntouched":
      return String(
        metrics.openUntouched
      );

    case "needsAttention":
      return String(
        metrics.needsAttention
      );

    case "scheduled":
      return String(
        metrics.scheduled
      );

    case "conversion":
      return metrics.conversion ===
        null
        ? "—"
        : (
            (
              metrics.conversion *
              100
            ).toFixed(
              1
            ) +
            "%"
          );

    case "medianFirstAttempt":
      return (
        metrics
          .medianFirstAttemptDisplay
      );

    default:
      return "—";
  }
}


/**
 * Explanation shown below each KPI.
 */
function getDashboardKpiNote_(
  key,
  metrics
) {
  switch (
    key
  ) {
    case "newToday":
      return "Leads received today";

    case "newThisWeek":
      return "Monday through today";

    case "newThisMonth":
      return "Current calendar month";

    case "openUntouched":
      return "Open • 0 attempts";

    case "needsAttention":
      return "Overdue follow-up or 7+ days open";

    case "scheduled":
      return "Selected leads ever scheduled";

    case "conversion":
      return (
        `${metrics.legitimateScheduledCount}` +
        " of " +
        `${metrics.legitimateLeadCount}` +
        " legitimate leads"
      );

    case "medianFirstAttempt":
      return "Median request → first attempt";

    default:
      return "";
  }
}


function renderDashboardKpiCardsBatched_(
  sheet,
  metrics
) {
  const firstRow =
    PATIENT_DASHBOARD_KPI_LAYOUT.firstRow;
  const secondRow =
    PATIENT_DASHBOARD_KPI_LAYOUT.secondRow;
  const cards = [
    ...firstRow,
    ...secondRow,
  ];

  sheet
    .getRange("A8:J11")
    .breakApart()
    .clearContent()
    .clearFormat();

  sheet
    .getRange("A13:F16")
    .breakApart()
    .clearContent()
    .clearFormat();

  const topGrid = [
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
  ];

  firstRow.forEach((card, index) => {
    const column = index * 2;
    topGrid[0][column] = card.label;
    topGrid[1][column] = getDashboardKpiDisplayValue_(
      card.key,
      metrics
    );
    topGrid[3][column] = getDashboardKpiNote_(
      card.key,
      metrics
    );
  });

  sheet.getRange("A8:J11").setValues(topGrid);

  const bottomGrid = [
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
  ];

  secondRow.forEach((card, index) => {
    const column = index * 2;
    bottomGrid[0][column] = card.label;
    bottomGrid[1][column] = getDashboardKpiDisplayValue_(
      card.key,
      metrics
    );
    bottomGrid[3][column] = getDashboardKpiNote_(
      card.key,
      metrics
    );
  });

  sheet.getRange("A13:F16").setValues(bottomGrid);

  cards.forEach(card => {
    sheet.getRange(card.labelRange).merge();
    sheet.getRange(card.valueRange).merge();
    sheet.getRange(card.noteRange).merge();
  });

  sheet.getRangeList(
    cards.map(card => card.labelRange)
  )
    .setFontSize(9)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBackground(PATIENT_DASHBOARD_THEME.tableHeader)
    .setFontColor(PATIENT_DASHBOARD_THEME.secondary)
    .setFontFamily(PATIENT_DASHBOARD_THEME.fontFamily);

  sheet.getRangeList(
    cards.map(card => card.valueRange)
  )
    .setFontSize(22)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBackground(PATIENT_DASHBOARD_THEME.panel)
    .setFontColor(PATIENT_DASHBOARD_THEME.primary)
    .setFontFamily(PATIENT_DASHBOARD_THEME.fontFamily);

  sheet.getRangeList(
    cards.map(card => card.noteRange)
  )
    .setFontSize(8)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(true)
    .setBackground(PATIENT_DASHBOARD_THEME.panel)
    .setFontColor(PATIENT_DASHBOARD_THEME.muted)
    .setFontFamily(PATIENT_DASHBOARD_THEME.fontFamily);

  applyDashboardRangeBorder_(
    sheet.getRangeList(
      cards.map(card => card.range)
    )
  );

  const openUntouchedCard = cards.find(
    card => card.key === "openUntouched"
  );

  if (openUntouchedCard) {
    sheet
      .getRange(openUntouchedCard.valueRange)
      .setFontColor(PATIENT_DASHBOARD_THEME.blueBright);
  }

  const scheduledCard = cards.find(
    card => card.key === "scheduled"
  );

  if (scheduledCard) {
    sheet
      .getRange(scheduledCard.valueRange)
      .setFontColor(PATIENT_DASHBOARD_THEME.greenBright);
  }

  const needsAttentionCard = cards.find(
    card => card.key === "needsAttention"
  );

  if (
    needsAttentionCard &&
    metrics.needsAttention > 0
  ) {
    sheet
      .getRange(needsAttentionCard.valueRange)
      .setBackground(PATIENT_DASHBOARD_THEME.dangerSurface)
      .setFontColor(PATIENT_DASHBOARD_THEME.dangerText);
  }

  sheet.setRowHeights(8, 9, 24);
}

/**
 * Renders all Phase 6B KPI cards.
 */
function renderDashboardKpis_() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  if (!sheet) {
    throw new Error(
      "Dashboard worksheet was not found."
    );
  }


  const metrics =
    withPerf_(
      "dashboard KPI calculation",
      calculateDashboardKpis_
    );


  withPerf_(
    "dashboard KPI render",
    () => renderDashboardKpiCardsBatched_(
      sheet,
      metrics
    )
  );


  return metrics;
}


/**
 * Staff-readable summary of the currently applied
 * Dashboard cohort.
 */
function buildDashboardFilterSummary_(
  metrics
) {
  const filters =
    metrics.filters;


  const parts = [];


  if (
    filters.startDate ||
    filters.endDate
  ) {
    const start =
      filters.startDate
        ? Utilities.formatDate(
            filters.startDate,
            getDashboardTimezone_(),
            "M/d/yyyy"
          )
        : "Beginning";

    const end =
      filters.endDate
        ? Utilities.formatDate(
            filters.endDate,
            getDashboardTimezone_(),
            "M/d/yyyy"
          )
        : "Today";


    parts.push(
      `${start} – ${end}`
    );

  } else {
    parts.push(
      "All Time"
    );
  }


  if (
    filters.reason
  ) {
    parts.push(
      `Reason: ${filters.reason}`
    );
  }


  if (
    filters.source
  ) {
    parts.push(
      `Source: ${filters.source}`
    );
  }


  if (
    filters.employee
  ) {
    parts.push(
      `Assigned: ${filters.employee}`
    );
  }


  parts.push(
    `${metrics.cohortCount} lead(s)`
  );


  return parts.join(
    "  •  "
  );
}


/**
 * Updates the staff-facing filter summary.
 */
function renderDashboardFilterSummary_(
  metrics
) {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  sheet
    .getRange(
      "A18:J18"
    )
    .breakApart()
    .clearContent()
    .clearFormat()
    .merge()
    .setValue(
      buildDashboardFilterSummary_(
        metrics
      )
    )
    .setFontSize(
      9
    )
    .setHorizontalAlignment(
      "left"
    )
    .setVerticalAlignment(
      "middle"
    )
    .setBackground(
      PATIENT_DASHBOARD_THEME.panel
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.muted
    )
    .setFontFamily(
      PATIENT_DASHBOARD_THEME.fontFamily
    );
}


/**
 * PHASE 6B
 *
 * Initializes and renders the KPI engine.
 */
function setupDashboardKpis() {
  /*
   * Make sure DashboardData reflects current
   * canonical workbook state first.
   */
  rebuildDashboardData_();

  refreshDashboardFilterOptions_();


  const metrics =
    renderDashboardKpis_();


  renderDashboardFilterSummary_(
    metrics
  );


  return metrics;
}


/**
 * Normalizes DashboardData boolean values.
 */
function getDashboardBoolean_(
  value
) {
  if (
    value === true
  ) {
    return true;
  }

  if (
    value === false ||
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return false;
  }

  return (
    String(
      value
    )
      .trim()
      .toUpperCase() ===
    "TRUE"
  );
}


/**
 * PHASE 6C
 *
 * Calculates current operational state from the
 * same filtered lead cohort used by the KPI engine.
 */
function calculateDashboardOperationalAnalytics_() {
  return ensureDashboardSharedLeadAggregates_().operational;
}



/**
 * Formats oldest active lead age for display.
 */
function formatDashboardLeadAge_(
  hours
) {
  if (
    hours === null ||
    hours === undefined ||
    !Number.isFinite(
      Number(
        hours
      )
    )
  ) {
    return "—";
  }


  const cleanHours =
    Math.max(
      0,
      Number(
        hours
      )
    );


  if (
    cleanHours < 24
  ) {
    return (
      Math.round(
        cleanHours
      ) +
      "h"
    );
  }


  const days =
    cleanHours /
    24;


  if (
    days < 2
  ) {
    return (
      days.toFixed(
        1
      ) +
      " days"
    );
  }


  return (
    Math.round(
      days * 10
    ) /
    10 +
    " days"
  );
}


/**
 * Creates a compact text bar relative to the
 * largest value in a distribution.
 */
function buildDashboardTextBar_(
  value,
  maximum,
  maxBlocks = 14
) {
  const cleanValue =
    Math.max(
      0,
      Number(
        value
      ) || 0
    );


  const cleanMaximum =
    Math.max(
      0,
      Number(
        maximum
      ) || 0
    );


  if (
    cleanValue === 0 ||
    cleanMaximum === 0
  ) {
    return "";
  }


  const blocks =
    Math.max(
      1,
      Math.round(
        (
          cleanValue /
          cleanMaximum
        ) *
        maxBlocks
      )
    );


  return "█".repeat(
    blocks
  );
}


/**
 * Renders current follow-up / scheduling alerts
 * into G13:J16.
 */
function renderDashboardOperationalAlerts_(
  sheet,
  analytics
) {
  const area =
    sheet.getRange(
      PATIENT_DASHBOARD_OPERATIONAL_LAYOUT
        .alertsArea
    );


  area
    .breakApart()
    .clearContent()
    .clearFormat();

  applyDashboardTableAreaBase_(
    area
  );


  /*
   * Header
   */
  sheet
    .getRange(
      "G13:J13"
    )
    .merge()
    .setValue(
      "FOLLOW-UP / SCHEDULING ALERTS"
    )
    .setFontSize(
      9
    )
    .setFontWeight(
      "bold"
    )
    .setHorizontalAlignment(
      "center"
    )
    .setVerticalAlignment(
      "middle"
    )
    .setBackground(
      PATIENT_DASHBOARD_THEME.tableHeader
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.secondary
    );


  const rows = [
    [
      "OVERDUE",
      analytics
        .followUps
        .overdue,

      "DUE TODAY",
      analytics
        .followUps
        .dueToday,
    ],

    [
      "NEXT 7 DAYS",
      analytics
        .followUps
        .dueNext7Days,

      "DATE NEEDED",
      analytics
        .scheduleDateNeeded,
    ],
  ];


  sheet
    .getRange(
      "G14:J15"
    )
    .setValues(
      rows
    );


  sheet.getRangeList([
    "G14",
    "I14",
    "G15",
    "I15",
  ])
    .setFontSize(8)
    .setFontWeight("bold")
    .setFontColor(PATIENT_DASHBOARD_THEME.secondary);

  sheet.getRangeList([
    "H14",
    "J14",
    "H15",
    "J15",
  ])
    .setFontSize(15)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setFontColor(PATIENT_DASHBOARD_THEME.primary);


  /*
   * Emphasize urgent states.
   */
  if (
    analytics
      .followUps
      .overdue >
    0
  ) {
    sheet
      .getRange(
        "G14:H14"
      )
      .setBackground(
        PATIENT_DASHBOARD_THEME.dangerSurface
      );
  }


  if (
    analytics
      .followUps
      .dueToday >
    0
  ) {
    sheet
      .getRange(
        "I14:J14"
      )
      .setBackground(
        PATIENT_DASHBOARD_THEME.warningSurface
      );
  }


  if (
    analytics
      .scheduleDateNeeded >
    0
  ) {
    sheet
      .getRange(
        "I15:J15"
      )
      .setBackground(
        PATIENT_DASHBOARD_THEME.warningSurface
      );
  }


  sheet
    .getRange(
      "G16:J16"
    )
    .merge()
    .setValue(
      "Current workflow state within the selected lead cohort"
    )
    .setFontSize(
      8
    )
    .setHorizontalAlignment(
      "center"
    )
    .setVerticalAlignment(
      "middle"
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.muted
    );


  applyDashboardRangeBorder_(
    area
  );
}


/**
 * Renders open-lead attempt distribution.
 */
function renderDashboardAttemptDistribution_(
  sheet,
  analytics
) {
  const area =
    sheet.getRange(
      PATIENT_DASHBOARD_OPERATIONAL_LAYOUT
        .attemptsArea
    );


  area
    .breakApart()
    .clearContent()
    .clearFormat();

  applyDashboardTableAreaBase_(
    area
  );


  sheet
    .getRange(
      "A20:E20"
    )
    .merge()
    .setValue(
      "OPEN LEADS BY CONTACT ATTEMPTS"
    )
    .setFontWeight(
      "bold"
    )
    .setFontSize(
      11
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.primary
    );


  sheet
    .getRange(
      "A21:E21"
    )
    .setValues([
      [
        "Attempts",
        "Count",
        "Share",
        "Distribution",
        "",
      ],
    ])
    .setFontWeight(
      "bold"
    )
    .setBackground(
      PATIENT_DASHBOARD_THEME.tableHeader
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.secondary
    );


  sheet
    .getRange(
      "D21:E21"
    )
    .merge();


  const buckets = [
    [
      "0 attempts",
      analytics
        .attempts
        .zero,
    ],

    [
      "1 attempt",
      analytics
        .attempts
        .one,
    ],

    [
      "2 attempts",
      analytics
        .attempts
        .two,
    ],

    [
      "3 attempts",
      analytics
        .attempts
        .three,
    ],

    [
      "4+ attempts",
      analytics
        .attempts
        .fourPlus,
    ],
  ];


  const maximum =
    Math.max(
      0,
      ...buckets.map(
        row =>
          row[1]
      )
    );


  const attemptValues =
    buckets.map(
      ([label, count]) => {
        const share =
          analytics.openLeadCount > 0
            ? count / analytics.openLeadCount
            : 0;

        return [
          label,
          count,
          share,
          buildDashboardTextBar_(count, maximum),
          "",
        ];
      }
    );


  sheet
    .getRange(22, 1, attemptValues.length, 5)
    .setValues(attemptValues);


  sheet
    .getRange(22, 3, attemptValues.length, 1)
    .setNumberFormat("0.0%");


  attemptValues.forEach((_, index) => {
    sheet
      .getRange(22 + index, 4, 1, 2)
      .merge();
  });


  if (attemptValues.length > 0) {
    sheet
      .getRange(22, 4, attemptValues.length, 2)
      .setFontColor(PATIENT_DASHBOARD_THEME.blue);
  }


  applyDashboardRangeBorder_(
    area
  );
}


/**
 * Renders current age distribution for unresolved
 * open leads.
 */
function renderDashboardLeadAging_(
  sheet,
  analytics
) {
  const area =
    sheet.getRange(
      PATIENT_DASHBOARD_OPERATIONAL_LAYOUT
        .agingArea
    );


  area
    .breakApart()
    .clearContent()
    .clearFormat();

  applyDashboardTableAreaBase_(
    area
  );


  sheet
    .getRange(
      "F20:J20"
    )
    .merge()
    .setValue(
      "AGE OF OPEN LEADS"
    )
    .setFontWeight(
      "bold"
    )
    .setFontSize(
      11
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.primary
    );


  sheet
    .getRange(
      "F21:J21"
    )
    .setValues([
      [
        "Age",
        "Count",
        "Share",
        "Distribution",
        "",
      ],
    ])
    .setFontWeight(
      "bold"
    )
    .setBackground(
      PATIENT_DASHBOARD_THEME.tableHeader
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.secondary
    );


  sheet
    .getRange(
      "I21:J21"
    )
    .merge();


  const buckets = [
    [
      "< 24 hours",
      analytics
        .aging
        .under24Hours,
    ],

    [
      "1–2 days",
      analytics
        .aging
        .oneToTwoDays,
    ],

    [
      "3–7 days",
      analytics
        .aging
        .threeToSevenDays,
    ],

    [
      "> 7 days",
      analytics
        .aging
        .overSevenDays,
    ],
  ];


  const maximum =
    Math.max(
      0,
      ...buckets.map(
        row =>
          row[1]
      )
    );


  const agingValues =
    buckets.map(
      ([label, count]) => {
        const share =
          analytics.openLeadCount > 0
            ? count / analytics.openLeadCount
            : 0;

        return [
          label,
          count,
          share,
          buildDashboardTextBar_(count, maximum),
          "",
        ];
      }
    );


  sheet
    .getRange(22, 6, agingValues.length, 5)
    .setValues(agingValues);


  sheet
    .getRange(22, 8, agingValues.length, 1)
    .setNumberFormat("0.0%");


  agingValues.forEach((_, index) => {
    sheet
      .getRange(22 + index, 9, 1, 2)
      .merge();
  });


  if (agingValues.length > 0) {
    sheet
      .getRange(22, 9, agingValues.length, 2)
      .setFontColor(PATIENT_DASHBOARD_THEME.blue);
  }


  sheet
    .getRange(
      "F26:H26"
    )
    .merge()
    .setValue(
      "Oldest active lead"
    )
    .setFontWeight(
      "bold"
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.secondary
    );


  sheet
    .getRange(
      "I26:J26"
    )
    .merge()
    .setValue(
      formatDashboardLeadAge_(
        analytics
          .aging
          .oldestOpenHours
      )
    )
    .setFontWeight(
      "bold"
    )
    .setHorizontalAlignment(
      "center"
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.primary
    );


  sheet
    .getRange(
      "F27:J27"
    )
    .merge()
    .setValue(
      `${analytics.openLeadCount} unresolved open lead(s) in the selected cohort`
    )
    .setFontSize(
      8
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.muted
    );


  applyDashboardRangeBorder_(
    area
  );
}


/**
 * Renders all Phase 6C operational analytics.
 */
function renderDashboardOperationalAnalytics_() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  if (!sheet) {
    throw new Error(
      "Dashboard worksheet was not found."
    );
  }


  const analytics =
    calculateDashboardOperationalAnalytics_();


  renderDashboardOperationalAlerts_(
    sheet,
    analytics
  );


  renderDashboardAttemptDistribution_(
    sheet,
    analytics
  );


  renderDashboardLeadAging_(
    sheet,
    analytics
  );


  return analytics;
}


/**
 * PHASE 6C
 *
 * Initializes operational analytics.
 */
function setupDashboardOperationalAnalytics() {
  rebuildDashboardData_();


  refreshDashboardFilterOptions_();


  const kpis =
    renderDashboardKpis_();


  renderDashboardFilterSummary_(
    kpis
  );


  const operational =
    renderDashboardOperationalAnalytics_();


  return {
    kpis,
    operational,
  };
}


/**
 * Converts yyyy-MM-dd into a UTC Date used only
 * for safe calendar arithmetic.
 */
function dashboardDateKeyToUtcDate_(
  dateKey
) {
  const clean =
    String(
      dateKey || ""
    ).trim();


  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      clean
    )
  ) {
    throw new Error(
      `Invalid Dashboard date key: ${clean || "(blank)"}`
    );
  }


  return new Date(
    `${clean}T00:00:00Z`
  );
}


/**
 * Adds calendar days to a Dashboard yyyy-MM-dd key.
 */
function addDashboardDaysToKey_(
  dateKey,
  days
) {
  const date =
    dashboardDateKeyToUtcDate_(
      dateKey
    );


  date.setUTCDate(
    date.getUTCDate() +
    Number(
      days || 0
    )
  );


  return Utilities.formatDate(
    date,
    "UTC",
    "yyyy-MM-dd"
  );
}


/**
 * Number of inclusive calendar days between two
 * Dashboard date keys.
 */
function getDashboardInclusiveDayCount_(
  startKey,
  endKey
) {
  const start =
    dashboardDateKeyToUtcDate_(
      startKey
    );


  const end =
    dashboardDateKeyToUtcDate_(
      endKey
    );


  return (
    Math.floor(
      (
        end.getTime() -
        start.getTime()
      ) /
      86400000
    ) +
    1
  );
}


/**
 * Determines the date window shown by the trend
 * chart.
 *
 * Explicit Dashboard Start / End values win.
 * Blank Start = earliest relevant activity.
 * Blank End = today.
 */
function getDashboardTrendDateBounds_(
  records,
  filters
) {
  const todayKey =
    getDashboardDateKey_(
      new Date()
    );


  let startKey =
    filters.startDate
      ? getDashboardDateKey_(
          filters.startDate
        )
      : "";


  let endKey =
    filters.endDate
      ? getDashboardDateKey_(
          filters.endDate
        )
      : todayKey;


  /*
   * When Start Date is blank, find the earliest
   * creation/scheduling date represented by the
   * current categorical filter selection.
   */
  if (!startKey) {
    const candidateKeys = [];


    records.forEach(
      record => {

        if (
          isDashboardDate_(
            record.created_at
          )
        ) {
          candidateKeys.push(
            getDashboardDateKey_(
              record.created_at
            )
          );
        }


        if (
          isDashboardDate_(
            record.first_scheduled_at
          )
        ) {
          candidateKeys.push(
            getDashboardDateKey_(
              record.first_scheduled_at
            )
          );
        }
      }
    );


    candidateKeys.sort();


    startKey =
      candidateKeys.length
        ? candidateKeys[0]
        : endKey;
  }


  /*
   * A future Start Date with a blank End Date should
   * simply produce an empty future period rather than
   * an invalid reversed range.
   */
  if (
    !filters.endDate &&
    startKey >
      endKey
  ) {
    endKey =
      startKey;
  }


  if (
    startKey >
    endKey
  ) {
    throw new Error(
      "Dashboard trend Start Date cannot be after End Date."
    );
  }


  return {
    startKey,
    endKey,

    dayCount:
      getDashboardInclusiveDayCount_(
        startKey,
        endKey
      ),
  };
}


/**
 * Formats one Dashboard trend date key.
 */
function formatDashboardTrendDateKey_(
  dateKey,
  pattern
) {
  return Utilities.formatDate(
    dashboardDateKeyToUtcDate_(
      dateKey
    ),
    "UTC",
    pattern
  );
}


/**
 * Creates a readable chart-axis label.
 */
function formatDashboardTrendPeriodLabel_(
  startKey,
  endKey,
  granularity
) {
  if (
    granularity ===
    "monthly"
  ) {
    return formatDashboardTrendDateKey_(
      startKey,
      "MMM yyyy"
    );
  }


  if (
    granularity ===
    "daily"
  ) {
    return formatDashboardTrendDateKey_(
      startKey,
      "MMM d"
    );
  }


  const startMonth =
    formatDashboardTrendDateKey_(
      startKey,
      "MMM"
    );


  const endMonth =
    formatDashboardTrendDateKey_(
      endKey,
      "MMM"
    );


  const startDay =
    formatDashboardTrendDateKey_(
      startKey,
      "d"
    );


  const endDay =
    formatDashboardTrendDateKey_(
      endKey,
      "d"
    );


  if (
    startMonth ===
    endMonth
  ) {
    return (
      `${startMonth} ` +
      `${startDay}–${endDay}`
    );
  }


  return (
    `${startMonth} ${startDay}` +
    "–" +
    `${endMonth} ${endDay}`
  );
}


/**
 * Builds daily, weekly, or monthly chart periods
 * based on the selected date span.
 */
function buildDashboardTrendBuckets_(
  startKey,
  endKey
) {
  const dayCount =
    getDashboardInclusiveDayCount_(
      startKey,
      endKey
    );


  let granularity;


  if (
    dayCount <= 45
  ) {
    granularity =
      "daily";

  } else if (
    dayCount <= 180
  ) {
    granularity =
      "weekly";

  } else {
    granularity =
      "monthly";
  }


  const buckets = [];


  /*
   * DAILY
   */
  if (
    granularity ===
    "daily"
  ) {
    for (
      let key = startKey;
      key <= endKey;
      key =
        addDashboardDaysToKey_(
          key,
          1
        )
    ) {
      buckets.push({
        startKey:
          key,

        endKey:
          key,

        label:
          formatDashboardTrendPeriodLabel_(
            key,
            key,
            granularity
          ),

        newLeads:
          0,

        scheduled:
          0,
      });
    }


    return {
      granularity,
      buckets,
    };
  }


  /*
   * WEEKLY
   *
   * Seven-day periods begin at the selected Start
   * Date. The final bucket may be shorter.
   */
  if (
    granularity ===
    "weekly"
  ) {
    let bucketStart =
      startKey;


    while (
      bucketStart <=
      endKey
    ) {
      const possibleEnd =
        addDashboardDaysToKey_(
          bucketStart,
          6
        );


      const bucketEnd =
        possibleEnd >
          endKey
          ? endKey
          : possibleEnd;


      buckets.push({
        startKey:
          bucketStart,

        endKey:
          bucketEnd,

        label:
          formatDashboardTrendPeriodLabel_(
            bucketStart,
            bucketEnd,
            granularity
          ),

        newLeads:
          0,

        scheduled:
          0,
      });


      bucketStart =
        addDashboardDaysToKey_(
          bucketEnd,
          1
        );
    }


    return {
      granularity,
      buckets,
    };
  }


  /*
   * MONTHLY
   */
  let current =
    dashboardDateKeyToUtcDate_(
      startKey
    );


  current =
    new Date(
      Date.UTC(
        current.getUTCFullYear(),
        current.getUTCMonth(),
        1
      )
    );


  const endDate =
    dashboardDateKeyToUtcDate_(
      endKey
    );


  while (
    current.getTime() <=
    endDate.getTime()
  ) {
    const monthStartKey =
      Utilities.formatDate(
        current,
        "UTC",
        "yyyy-MM-dd"
      );


    const nextMonth =
      new Date(
        Date.UTC(
          current.getUTCFullYear(),
          current.getUTCMonth() +
            1,
          1
        )
      );


    const monthEnd =
      new Date(
        nextMonth.getTime() -
        86400000
      );


    const monthEndKey =
      Utilities.formatDate(
        monthEnd,
        "UTC",
        "yyyy-MM-dd"
      );


    const bucketStart =
      monthStartKey <
        startKey
        ? startKey
        : monthStartKey;


    const bucketEnd =
      monthEndKey >
        endKey
        ? endKey
        : monthEndKey;


    buckets.push({
      startKey:
        bucketStart,

      endKey:
        bucketEnd,

      label:
        formatDashboardTrendPeriodLabel_(
          monthStartKey,
          monthEndKey,
          granularity
        ),

      newLeads:
        0,

      scheduled:
        0,
    });


    current =
      nextMonth;
  }


  return {
    granularity,
    buckets,
  };
}


/**
 * Pass 3.5: O(1) lookup of the trend bucket that
 * contains one yyyy-MM-dd event date.
 */
function indexDashboardTrendBuckets_(buckets) {
  const byKey = {};

  buckets.forEach(bucket => {
    if (bucket.startKey === bucket.endKey) {
      byKey[bucket.startKey] = bucket;
      return;
    }

    for (
      let key = bucket.startKey;
      key <= bucket.endKey;
      key = addDashboardDaysToKey_(key, 1)
    ) {
      byKey[key] = bucket;
    }
  });

  return byKey;
}



/**
 * PHASE 6D
 *
 * Builds New Leads vs First-Time Scheduled using
 * event dates.
 */
function buildDashboardTrendData_() {
  const filtered =
    buildDashboardCategoryFilteredRecords_();


  const filters =
    filtered.filters;


  const records =
    filtered.records;


  const bounds =
    getDashboardTrendDateBounds_(
      records,
      filters
    );


  const bucketResult =
    buildDashboardTrendBuckets_(
      bounds.startKey,
      bounds.endKey
    );


  const buckets =
    bucketResult.buckets;

  const bucketByDate =
    indexDashboardTrendBuckets_(
      buckets
    );


  let totalNewLeads =
    0;


  let totalScheduled =
    0;


  let scheduledWithoutTimestamp =
    0;


  records.forEach(
    record => {

      /*
       * NEW LEAD EVENT
       */
      if (
        isDashboardDate_(
          record.created_at
        )
      ) {
        const createdKey =
          getDashboardDateKey_(
            record.created_at
          );


        if (
          createdKey >=
            bounds.startKey &&
          createdKey <=
            bounds.endKey
        ) {
          const bucket =
            bucketByDate[createdKey];


          if (bucket) {
            bucket.newLeads +=
              1;

            totalNewLeads +=
              1;
          }
        }
      }


      /*
       * FIRST-TIME SCHEDULED EVENT
       */
      if (
        isDashboardDate_(
          record
            .first_scheduled_at
        )
      ) {
        const scheduledKey =
          getDashboardDateKey_(
            record
              .first_scheduled_at
          );


        if (
          scheduledKey >=
            bounds.startKey &&
          scheduledKey <=
            bounds.endKey
        ) {
          const bucket =
            bucketByDate[scheduledKey];


          if (bucket) {
            bucket.scheduled +=
              1;

            totalScheduled +=
              1;
          }
        }

      } else if (
        getDashboardBoolean_(
          record
            .ever_scheduled
        )
      ) {
        /*
         * Historical/legacy records may know that a
         * lead was scheduled without having a usable
         * first-scheduled timestamp.
         *
         * Do not invent an event date.
         */
        scheduledWithoutTimestamp +=
          1;
      }
    }
  );


  return {
    filters,

    granularity:
      bucketResult
        .granularity,

    startKey:
      bounds.startKey,

    endKey:
      bounds.endKey,

    dayCount:
      bounds.dayCount,

    buckets,

    totalNewLeads,

    totalScheduled,

    scheduledWithoutTimestamp,

    categoryFilteredLeadCount:
      records.length,
  };
}


/**
 * Writes generated Phase 6D helper data beginning
 * in DashboardData!AH1.
 */
function writeDashboardTrendData_(
  trend
) {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dataSheet
    );


  if (!sheet) {
    throw new Error(
      "DashboardData worksheet was not found."
    );
  }


  const startColumn =
    PATIENT_DASHBOARD_TREND_LAYOUT
      .dataStartColumn;


  /*
   * Clear previous trend-helper rows so shrinking
   * date ranges cannot leave stale chart values.
   *
   * Pass 3.5: clear through the used region rather
   * than every unused worksheet row.
   */
  const trendClearRowCount =
    Math.max(
      sheet.getLastRow(),
      trend.buckets.length + 1,
      1
    );

  sheet
    .getRange(
      1,
      startColumn,
      trendClearRowCount,
      PATIENT_DASHBOARD_TREND_LAYOUT
        .dataColumnCount
    )
    .clearContent();


  const headers = [
    "period_key",
    "period_label",
    "new_leads",
    "first_time_scheduled",
  ];


  sheet
    .getRange(
      1,
      startColumn,
      1,
      headers.length
    )
    .setValues([
      headers,
    ])
    .setFontWeight(
      "bold"
    );


  const rows =
    trend.buckets.map(
      bucket => [
        bucket.startKey,
        bucket.label,
        bucket.newLeads,
        bucket.scheduled,
      ]
    );


  if (
    rows.length >
    0
  ) {
    const outputRange =
      sheet.getRange(
        2,
        startColumn,
        rows.length,
        headers.length
      );


    /*
     * period_key is an internal yyyy-MM-dd key,
     * not a spreadsheet calendar value.
     *
     * Force AH to Plain Text before writing so
     * Google Sheets does not automatically convert
     * values such as "2026-09-01" into Date objects.
     */
    sheet
      .getRange(
        2,
        startColumn,
        rows.length,
        1
      )
      .setNumberFormat(
        "@"
      );


    outputRange.setValues(
      rows
    );


    sheet
      .getRange(
        2,
        startColumn +
          2,
        rows.length,
        2
      )
      .setNumberFormat(
        "0"
      );
  }


  sheet.setColumnWidth(
    startColumn,
    100
  );


  sheet.setColumnWidth(
    startColumn +
      1,
    120
  );


  sheet.setColumnWidth(
    startColumn +
      2,
    90
  );


  sheet.setColumnWidth(
    startColumn +
      3,
    140
  );


  return {
    startColumn,

    rowCount:
      rows.length,
  };
}


/**
 * Removes only the Phase 6D trend chart.
 *
 * Future 6E charts are left alone.
 */
function removeDashboardTrendChart_(
  sheet
) {
  sheet
    .getCharts()
    .forEach(
      chart => {

        try {
          const title =
            String(
              chart
                .getOptions()
                .get(
                  "title"
                ) || ""
            ).trim();


          if (
            title ===
            PATIENT_DASHBOARD_TREND_LAYOUT
              .chartTitle
          ) {
            sheet.removeChart(
              chart
            );
          }

        } catch (error) {
          /*
           * An unrelated chart with unusual options
           * should never block Dashboard refresh.
           */
        }
      }
    );
}


/**
 * Creates/replaces the native New Leads vs
 * First-Time Scheduled chart.
 */
function renderDashboardTrendChart_(
  dashboardSheet,
  trend
) {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  const dataSheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dataSheet
    );


  if (!dataSheet) {
    throw new Error(
      "DashboardData worksheet was not found."
    );
  }


  removeDashboardTrendChart_(
    dashboardSheet
  );


  const startColumn =
    PATIENT_DASHBOARD_TREND_LAYOUT
      .dataStartColumn;


  /*
   * Chart uses:
   *
   * AI = human-readable period label
   * AJ = New Leads
   * AK = First-Time Scheduled
   */
  const chartRange =
    dataSheet.getRange(
      1,
      startColumn +
        1,
      trend.buckets.length +
        1,
      3
    );


  const chart =
    dashboardSheet
      .newChart()
      .setChartType(
        Charts.ChartType.LINE
      )
      .addRange(
        chartRange
      )
      .setNumHeaders(
        1
      )
      .setPosition(
        PATIENT_DASHBOARD_TREND_LAYOUT
          .chartRow,

        PATIENT_DASHBOARD_TREND_LAYOUT
          .chartColumn,

        0,
        0
      )
      .setOption(
        "title",
        PATIENT_DASHBOARD_TREND_LAYOUT
          .chartTitle
      )
      .setOption(
        "titleTextStyle",
        {
          color:
            PATIENT_DASHBOARD_THEME.primary,
        }
      )
      .setOption(
        "backgroundColor",
        PATIENT_DASHBOARD_THEME.panel
      )
      .setOption(
        "chartArea",
        {
          backgroundColor:
            PATIENT_DASHBOARD_THEME.panel,
        }
      )
      .setOption(
        "colors",
        [
          PATIENT_DASHBOARD_THEME.blue,
          PATIENT_DASHBOARD_THEME.green,
        ]
      )
      .setOption(
        "legend",
        {
          position:
            "bottom",

          textStyle: {
            color:
              PATIENT_DASHBOARD_THEME.secondary,
          },
        }
      )
      .setOption(
        "vAxis",
        {
          title:
            "Leads",

          minValue:
            0,

          format:
            "0",

          textStyle: {
            color:
              PATIENT_DASHBOARD_THEME.secondary,
          },

          titleTextStyle: {
            color:
              PATIENT_DASHBOARD_THEME.secondary,
          },

          gridlines: {
            color:
              PATIENT_DASHBOARD_THEME.border,
          },
        }
      )
      .setOption(
        "hAxis",
        {
          title:
            trend.granularity ===
              "daily"
              ? "Day"
              : (
                  trend.granularity ===
                    "weekly"
                    ? "Week"
                    : "Month"
                ),

          textStyle: {
            color:
              PATIENT_DASHBOARD_THEME.secondary,
          },

          titleTextStyle: {
            color:
              PATIENT_DASHBOARD_THEME.secondary,
          },

          gridlines: {
            color:
              PATIENT_DASHBOARD_THEME.border,
          },
        }
      )
      .setOption(
        "pointSize",
        5
      )
      .setOption(
        "lineWidth",
        2
      )
      .setOption(
        "width",
        900
      )
      .setOption(
        "height",
        340
      )
      .build();


  dashboardSheet.insertChart(
    chart
  );
}


/**
 * Renders the visible Phase 6D section title and
 * explanatory note.
 */
function renderDashboardTrendSection_(
  sheet,
  trend
) {
  sheet
    .getRange(
      PATIENT_DASHBOARD_TREND_LAYOUT
        .chartHeaderRange
    )
    .breakApart()
    .clearContent()
    .clearFormat()
    .merge()
    .setValue(
      "LEAD VOLUME vs FIRST-TIME SCHEDULED"
    )
    .setFontSize(
      11
    )
    .setFontWeight(
      "bold"
    )
    .setBackground(
      PATIENT_DASHBOARD_THEME.panel
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.primary
    )
    .setFontFamily(
      PATIENT_DASHBOARD_THEME.fontFamily
    );


  const granularityLabel =
    trend.granularity ===
      "daily"
      ? "Daily"
      : (
          trend.granularity ===
            "weekly"
            ? "Weekly"
            : "Monthly"
        );


  let note =
    `${granularityLabel} trend • ` +
    `${trend.startKey} through ${trend.endKey}` +
    ` • ${trend.totalNewLeads} new lead(s)` +
    ` • ${trend.totalScheduled} first-time scheduled`;


  if (
    trend.scheduledWithoutTimestamp >
    0
  ) {
    note +=
      ` • ${trend.scheduledWithoutTimestamp} historically scheduled lead(s) omitted because no first-scheduled timestamp exists`;
  }


  sheet
    .getRange(
      PATIENT_DASHBOARD_TREND_LAYOUT
        .chartNoteRange
    )
    .breakApart()
    .clearContent()
    .clearFormat()
    .merge()
    .setValue(
      note
    )
    .setFontSize(
      8
    )
    .setWrap(
      true
    )
    .setBackground(
      PATIENT_DASHBOARD_THEME.panel
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.muted
    )
    .setFontFamily(
      PATIENT_DASHBOARD_THEME.fontFamily
    );
}


/**
 * PHASE 6D
 *
 * Rebuilds the trend helper data and native chart.
 */
function renderDashboardTrendAnalytics_() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  const dashboardSheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  if (!dashboardSheet) {
    throw new Error(
      "Dashboard worksheet was not found."
    );
  }


  const trend =
    buildDashboardTrendData_();


  writeDashboardTrendData_(
    trend
  );


  renderDashboardTrendSection_(
    dashboardSheet,
    trend
  );


  renderDashboardTrendChart_(
    dashboardSheet,
    trend
  );


  return trend;
}


/**
 * PHASE 6D
 *
 * Initializes all Dashboard components through 6D.
 */
function setupDashboardTrends() {
  rebuildDashboardData_();


  refreshDashboardFilterOptions_();


  const kpis =
    renderDashboardKpis_();


  renderDashboardFilterSummary_(
    kpis
  );


  const operational =
    renderDashboardOperationalAnalytics_();


  const trend =
    renderDashboardTrendAnalytics_();


  return {
    kpis,
    operational,
    trend,
  };
}


/**
 * Normalizes blank categorical values so missing
 * data is visible rather than silently discarded.
 */
function getDashboardGroupLabel_(
  value,
  blankLabel = "(Not specified)"
) {
  const text =
    String(
      value || ""
    ).trim();

  return text ||
    blankLabel;
}


/**
 * Builds Leads / Scheduled / Conversion metrics
 * for one business category.
 *
 * Conversion uses the same legitimate-lead
 * definition as the 6B KPI engine.
 */
function buildDashboardPerformanceBreakdown_(
  records,
  labelGetter
) {
  const groups = {};


  const legitimateRecords =
    records.filter(
      record =>
        getDashboardBoolean_(
          record
            .legitimate_appointment_lead
        )
    );


  legitimateRecords.forEach(
    record => {

      const label =
        getDashboardGroupLabel_(
          labelGetter(
            record
          )
        );


      if (!groups[label]) {
        groups[label] = {
          label,

          leads: 0,

          scheduled: 0,
        };
      }


      groups[
        label
      ].leads += 1;


      if (
        getDashboardBoolean_(
          record
            .ever_scheduled
        )
      ) {
        groups[
          label
        ].scheduled +=
          1;
      }
    }
  );


  const rows =
    Object
      .values(
        groups
      )
      .map(
        group => ({
          label:
            group.label,

          leads:
            group.leads,

          scheduled:
            group.scheduled,

          conversion:
            group.leads >
              0
              ? (
                  group.scheduled /
                  group.leads
                )
              : null,

          smallSample:
            group.leads <
            5,
        })
      )
      .sort(
        (
          a,
          b
        ) => {

          if (
            a.leads !==
            b.leads
          ) {
            return (
              b.leads -
              a.leads
            );
          }


          return a.label
            .localeCompare(
              b.label
            );
        }
      );


  const totalLeads =
    legitimateRecords.length;


  const totalScheduled =
    legitimateRecords
      .filter(
        record =>
          getDashboardBoolean_(
            record
              .ever_scheduled
          )
      )
      .length;


  return {
    rows,

    totalLeads,

    totalScheduled,

    conversion:
      totalLeads >
        0
        ? (
            totalScheduled /
            totalLeads
          )
        : null,
  };
}


/**
 * Builds the most useful source/page label available.
 */
function getDashboardPageSourceLabel_(
  record
) {
  const pageName =
    String(
      record.page_name ||
      ""
    ).trim();


  const sourcePath =
    String(
      record.source_path ||
      ""
    ).trim();


  const intakeSource =
    String(
      record.intake_source ||
      ""
    ).trim();


  if (
    pageName &&
    sourcePath
  ) {
    return (
      `${pageName} — ${sourcePath}`
    );
  }


  return (
    pageName ||
    sourcePath ||
    intakeSource ||
    "(Not specified)"
  );
}


/**
 * Builds Count + Share for a current workflow
 * classification.
 */
function buildDashboardStatusBreakdown_(
  records,
  requiredStatus,
  fieldName,
  blankLabel
) {
  const matching =
    records.filter(
      record =>
        String(
          record.status ||
          ""
        ).trim() ===
        requiredStatus
    );


  const groups = {};


  matching.forEach(
    record => {

      const label =
        getDashboardGroupLabel_(
          record[
            fieldName
          ],
          blankLabel
        );


      groups[
        label
      ] =
        (
          groups[
            label
          ] || 0
        ) + 1;
    }
  );


  const total =
    matching.length;


  const rows =
    Object
      .entries(
        groups
      )
      .map(
        (
          [
            label,
            count,
          ]
        ) => ({
          label,

          count,

          share:
            total >
              0
              ? count /
                total
              : 0,
        })
      )
      .sort(
        (
          a,
          b
        ) => {

          if (
            a.count !==
            b.count
          ) {
            return (
              b.count -
              a.count
            );
          }


          return a.label
            .localeCompare(
              b.label
            );
        }
      );


  return {
    rows,
    total,
  };
}


/**
 * Builds operational workload by the lead's CURRENT
 * assigned employee.
 *
 * Activity counts are attributed to the current
 * assignee because this table represents current
 * workload ownership, not employee-performance
 * scoring.
 */
function buildDashboardEmployeeWorkload_(
  cohort
) {
  const groups = {};

  const leadAssignee = {};


  const ensureEmployee =
    employee => {

      if (
        !groups[
          employee
        ]
      ) {
        groups[
          employee
        ] = {
          employee,

          openAssigned:
            0,

          attemptsToday:
            0,

          followUpsDue:
            0,

          scheduledLeadIdsToday:
            new Set(),
        };
      }


      return groups[
        employee
      ];
    };


  /*
   * Build current assignment / workflow ownership.
   */
  cohort.forEach(
    record => {

      const leadId =
        String(
          record.lead_id ||
          ""
        ).trim();


      if (!leadId) {
        return;
      }


      const employee =
        getDashboardGroupLabel_(
          record.assigned_to,
          "(Unassigned)"
        );


      leadAssignee[
        leadId
      ] =
        employee;


      const workload =
        ensureEmployee(
          employee
        );


      const status =
        String(
          record.status ||
          ""
        ).trim();


      const complete =
        getDashboardBoolean_(
          record
            .workflow_complete
        );


      if (
        status ===
          "Open Lead / Follow Up" &&
        !complete
      ) {
        workload
          .openAssigned +=
          1;


        if (
          getDashboardBoolean_(
            record
              .follow_up_overdue
          ) ||
          getDashboardBoolean_(
            record
              .follow_up_due_today
          )
        ) {
          workload
            .followUpsDue +=
            1;
        }
      }
    }
  );


  /*
   * Count today's activity on leads in the selected
   * cohort. Pass 3.5: reuse the cached ActivityLog
   * table instead of a second worksheet read.
   */
  applyDashboardWorkloadActivity_(
    leadAssignee,
    groups
  );


  const rows =
    Object
      .values(
        groups
      )
      .map(
        group => ({
          employee:
            group.employee,

          openAssigned:
            group.openAssigned,

          attemptsToday:
            group.attemptsToday,

          followUpsDue:
            group.followUpsDue,

          scheduledToday:
            group
              .scheduledLeadIdsToday
              .size,
        })
      )
      .sort(
        (
          a,
          b
        ) => {

          if (
            a.openAssigned !==
            b.openAssigned
          ) {
            return (
              b.openAssigned -
              a.openAssigned
            );
          }


          if (
            a.followUpsDue !==
            b.followUpsDue
          ) {
            return (
              b.followUpsDue -
              a.followUpsDue
            );
          }


          if (
            a.attemptsToday !==
            b.attemptsToday
          ) {
            return (
              b.attemptsToday -
              a.attemptsToday
            );
          }


          return a.employee
            .localeCompare(
              b.employee
            );
        }
      );


  const totals =
    rows.reduce(
      (
        total,
        row
      ) => {

        total.openAssigned +=
          row.openAssigned;

        total.attemptsToday +=
          row.attemptsToday;

        total.followUpsDue +=
          row.followUpsDue;

        total.scheduledToday +=
          row.scheduledToday;

        return total;
      },
      {
        openAssigned: 0,
        attemptsToday: 0,
        followUpsDue: 0,
        scheduledToday: 0,
      }
    );


  return {
    rows,
    totals,
  };
}


/**
 * PHASE 6E
 *
 * Calculates all business-breakdown analytics from
 * the same universal Dashboard lead cohort.
 */
function calculateDashboardBusinessAnalytics_() {
  return ensureDashboardSharedLeadAggregates_().business;
}


/**
 * Renders a Leads / Scheduled / Conversion table.
 */
function renderDashboardPerformanceTable_(
  sheet,
  areaA1,
  title,
  breakdown
) {
  const area =
    sheet.getRange(
      areaA1
    );


  area
    .breakApart()
    .clearContent()
    .clearFormat();

  applyDashboardTableAreaBase_(
    area
  );


  const startRow =
    area.getRow();


  const startColumn =
    area.getColumn();


  const maxRows =
    PATIENT_DASHBOARD_BUSINESS_LAYOUT
      .maxPerformanceRows;


  /*
   * Title
   */
  sheet
    .getRange(
      startRow,
      startColumn,
      1,
      5
    )
    .merge()
    .setValue(
      title
    )
    .setFontSize(
      11
    )
    .setFontWeight(
      "bold"
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.primary
    );


  /*
   * Headers
   */
  sheet
    .getRange(
      startRow + 1,
      startColumn,
      1,
      5
    )
    .setValues([
      [
        "Category",
        "Leads",
        "Scheduled",
        "Conversion",
        "Sample",
      ],
    ])
    .setFontWeight(
      "bold"
    )
    .setBackground(
      PATIENT_DASHBOARD_THEME.tableHeader
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.secondary
    );


  const visibleRows =
    breakdown.rows.slice(
      0,
      maxRows
    );


  if (
    visibleRows.length >
    0
  ) {
    const values =
      visibleRows.map(
        row => [
          row.label,

          row.leads,

          row.scheduled,

          row.conversion ===
            null
            ? ""
            : row.conversion,

          row.smallSample
            ? "Small sample"
            : "",
        ]
      );


    sheet
      .getRange(
        startRow + 2,
        startColumn,
        values.length,
        5
      )
      .setValues(
        values
      );


    sheet
      .getRange(
        startRow + 2,
        startColumn + 3,
        values.length,
        1
      )
      .setNumberFormat(
        "0.0%"
      );
  }


  /*
   * TOTAL row
   */
  const totalRow =
    startRow +
    2 +
    maxRows;


  sheet
    .getRange(
      totalRow,
      startColumn,
      1,
      5
    )
    .setValues([
      [
        "TOTAL",

        breakdown.totalLeads,

        breakdown.totalScheduled,

        breakdown.conversion ===
          null
          ? ""
          : breakdown.conversion,

        "",
      ],
    ])
    .setFontWeight(
      "bold"
    );


  sheet
    .getRange(
      totalRow,
      startColumn + 3
    )
    .setNumberFormat(
      "0.0%"
    );


  /*
   * Explanation
   */
  const noteStartRow =
    totalRow + 1;


  const noteRows =
    area.getLastRow() -
    noteStartRow +
    1;


  sheet
    .getRange(
      noteStartRow,
      startColumn,
      noteRows,
      5
    )
    .merge()
    .setValue(
      "Conversion = ever scheduled ÷ legitimate appointment leads. “Small sample” means fewer than 5 leads."
    )
    .setFontSize(
      8
    )
    .setWrap(
      true
    )
    .setVerticalAlignment(
      "middle"
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.muted
    );


  applyDashboardRangeBorder_(
    area
  );


  area.setWrap(
    true
  );
}


/**
 * Renders a Count / Share categorical breakdown.
 */
function renderDashboardStatusBreakdown_(
  sheet,
  areaA1,
  title,
  breakdown,
  note
) {
  const area =
    sheet.getRange(
      areaA1
    );


  area
    .breakApart()
    .clearContent()
    .clearFormat();

  applyDashboardTableAreaBase_(
    area
  );


  const startRow =
    area.getRow();


  const startColumn =
    area.getColumn();


  const maxRows =
    PATIENT_DASHBOARD_BUSINESS_LAYOUT
      .maxBreakdownRows;


  sheet
    .getRange(
      startRow,
      startColumn,
      1,
      5
    )
    .merge()
    .setValue(
      title
    )
    .setFontSize(
      11
    )
    .setFontWeight(
      "bold"
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.primary
    );


  sheet
    .getRange(
      startRow + 1,
      startColumn,
      1,
      5
    )
    .setValues([
      [
        "Category",
        "Count",
        "Share",
        "Distribution",
        "",
      ],
    ])
    .setFontWeight(
      "bold"
    )
    .setBackground(
      PATIENT_DASHBOARD_THEME.tableHeader
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.secondary
    );


  sheet
    .getRange(
      startRow + 1,
      startColumn + 3,
      1,
      2
    )
    .merge();


  const visibleRows =
    breakdown.rows.slice(
      0,
      maxRows
    );


  const maximum =
    Math.max(
      0,
      ...visibleRows.map(
        row =>
          row.count
      )
    );


  if (visibleRows.length > 0) {
    const values = visibleRows.map(row => [
      row.label,
      row.count,
      row.share,
      buildDashboardTextBar_(row.count, maximum),
      "",
    ]);

    sheet
      .getRange(
        startRow + 2,
        startColumn,
        values.length,
        5
      )
      .setValues(values);

    sheet
      .getRange(
        startRow + 2,
        startColumn + 2,
        values.length,
        1
      )
      .setNumberFormat("0.0%");

    values.forEach((_, index) => {
      sheet
        .getRange(
          startRow + 2 + index,
          startColumn + 3,
          1,
          2
        )
        .merge();
    });

    sheet
      .getRange(
        startRow + 2,
        startColumn + 3,
        values.length,
        2
      )
      .setFontColor(
        PATIENT_DASHBOARD_THEME.blue
      );
  }


  const totalRow =
    startRow +
    2 +
    maxRows;


  sheet
    .getRange(
      totalRow,
      startColumn
    )
    .setValue(
      "TOTAL"
    )
    .setFontWeight(
      "bold"
    );


  sheet
    .getRange(
      totalRow,
      startColumn + 1
    )
    .setValue(
      breakdown.total
    )
    .setFontWeight(
      "bold"
    );


  sheet
    .getRange(
      totalRow,
      startColumn + 2
    )
    .setValue(
      breakdown.total >
        0
        ? 1
        : 0
    )
    .setNumberFormat(
      "0.0%"
    )
    .setFontWeight(
      "bold"
    );


  sheet
    .getRange(
      totalRow,
      startColumn + 3,
      1,
      2
    )
    .merge();


  const noteStart =
    totalRow + 1;


  const noteRows =
    area.getLastRow() -
    noteStart +
    1;


  sheet
    .getRange(
      noteStart,
      startColumn,
      noteRows,
      5
    )
    .merge()
    .setValue(
      note
    )
    .setFontSize(
      8
    )
    .setWrap(
      true
    )
    .setVerticalAlignment(
      "middle"
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.muted
    );


  applyDashboardRangeBorder_(
    area
  );


  area.setWrap(
    true
  );
}


/**
 * Renders assigned-employee operational workload.
 */
function renderDashboardEmployeeWorkload_(
  sheet,
  workload
) {
  const area =
    sheet.getRange(
      PATIENT_DASHBOARD_BUSINESS_LAYOUT
        .workloadArea
    );


  area
    .breakApart()
    .clearContent()
    .clearFormat();

  applyDashboardTableAreaBase_(
    area
  );


  const startRow =
    area.getRow();


  const maxRows =
    PATIENT_DASHBOARD_BUSINESS_LAYOUT
      .maxWorkloadRows;


  /*
   * Title
   */
  sheet
    .getRange(
      startRow,
      1,
      1,
      10
    )
    .merge()
    .setValue(
      "ASSIGNED EMPLOYEE WORKLOAD"
    )
    .setFontSize(
      11
    )
    .setFontWeight(
      "bold"
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.primary
    );


  const visibleRows =
    workload.rows.slice(
      0,
      maxRows
    );

  const tableRowCount = maxRows + 2;
  const grid = [];

  for (let index = 0; index < tableRowCount; index++) {
    grid.push(["", "", "", "", "", "", "", "", "", ""]);
  }

  const headerLabels = [
    "Assigned Employee",
    "Open Assigned",
    "Attempts Today",
    "Follow-ups Due",
    "Scheduled Today",
  ];

  headerLabels.forEach((label, index) => {
    grid[0][index * 2] = label;
  });

  visibleRows.forEach((row, rowIndex) => {
    const values = [
      row.employee,
      row.openAssigned,
      row.attemptsToday,
      row.followUpsDue,
      row.scheduledToday,
    ];

    values.forEach((value, index) => {
      grid[1 + rowIndex][index * 2] = value;
    });
  });

  const totalRowIndex = 1 + maxRows;
  const totalValues = [
    "TOTAL",
    workload.totals.openAssigned,
    workload.totals.attemptsToday,
    workload.totals.followUpsDue,
    workload.totals.scheduledToday,
  ];

  totalValues.forEach((value, index) => {
    grid[totalRowIndex][index * 2] = value;
  });

  sheet
    .getRange(startRow + 1, 1, tableRowCount, 10)
    .setValues(grid);

  const pairColumns = [1, 3, 5, 7, 9];
  const headerA1s = [];
  const dataNameA1s = [];
  const dataNumberA1s = [];
  const totalA1s = [];

  pairColumns.forEach((column, valueIndex) => {
    const headerRange = rangeA1Notation_(
      startRow + 1,
      column,
      startRow + 1,
      column + 1
    );
    headerA1s.push(headerRange);
    sheet.getRange(startRow + 1, column, 1, 2).merge();

    visibleRows.forEach((_, index) => {
      const outputRow = startRow + 2 + index;
      sheet.getRange(outputRow, column, 1, 2).merge();

      const a1 = rangeA1Notation_(
        outputRow,
        column,
        outputRow,
        column + 1
      );

      if (valueIndex === 0) {
        dataNameA1s.push(a1);
      } else {
        dataNumberA1s.push(a1);
      }
    });

    const totalRow = startRow + 2 + maxRows;
    sheet.getRange(totalRow, column, 1, 2).merge();
    totalA1s.push(
      rangeA1Notation_(totalRow, column, totalRow, column + 1)
    );
  });

  if (headerA1s.length) {
    sheet.getRangeList(headerA1s)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground(PATIENT_DASHBOARD_THEME.tableHeader)
      .setFontColor(PATIENT_DASHBOARD_THEME.secondary);
  }

  if (dataNameA1s.length) {
    sheet.getRangeList(dataNameA1s)
      .setHorizontalAlignment("left");
  }

  if (dataNumberA1s.length) {
    sheet.getRangeList(dataNumberA1s)
      .setHorizontalAlignment("center");
  }

  if (totalA1s.length) {
    sheet.getRangeList(totalA1s)
      .setFontWeight("bold");
  }

  sheet
    .getRange(startRow + 2 + maxRows, 1, 1, 2)
    .setHorizontalAlignment("left");

  sheet
    .getRange(startRow + 2 + maxRows, 3, 1, 8)
    .setHorizontalAlignment("center");


  const totalRow =
    startRow +
    2 +
    maxRows;


  /*
   * Explanation
   */
  sheet
    .getRange(
      totalRow + 1,
      1,
      area.getLastRow() -
        totalRow,
      10
    )
    .merge()
    .setValue(
      "Operational workload only — not an employee leaderboard. Activity counts reflect events on leads currently assigned to each employee. Follow-ups Due = overdue + due today."
    )
    .setFontSize(
      8
    )
    .setWrap(
      true
    )
    .setVerticalAlignment(
      "middle"
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.muted
    );


  applyDashboardRangeBorder_(
    area
  );
}


/**
 * PHASE 6E
 *
 * Renders all business-breakdown analytics.
 */
function renderDashboardBusinessAnalytics_() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  if (!sheet) {
    throw new Error(
      "Dashboard worksheet was not found."
    );
  }


  const analytics =
    calculateDashboardBusinessAnalytics_();


  /*
   * Appointment reasons
   */
  renderDashboardPerformanceTable_(
    sheet,

    PATIENT_DASHBOARD_BUSINESS_LAYOUT
      .reasonArea,

    "APPOINTMENT REASON PERFORMANCE",

    analytics.reason
  );


  /*
   * Website/source performance
   */
  renderDashboardPerformanceTable_(
    sheet,

    PATIENT_DASHBOARD_BUSINESS_LAYOUT
      .sourceArea,

    "PAGE / SOURCE PERFORMANCE",

    analytics.source
  );


  /*
   * Case Lost
   */
  renderDashboardStatusBreakdown_(
    sheet,

    PATIENT_DASHBOARD_BUSINESS_LAYOUT
      .caseLostArea,

    "WHY LEADS ARE LOST",

    analytics.caseLost,

    "Current Case Lost classification within the selected lead cohort."
  );


  /*
   * Unrelated
   */
  renderDashboardStatusBreakdown_(
    sheet,

    PATIENT_DASHBOARD_BUSINESS_LAYOUT
      .unrelatedArea,

    "UNRELATED REQUESTS",

    analytics.unrelated,

    "Current Unrelated classification within the selected lead cohort."
  );


  /*
   * Employee workload
   */
  renderDashboardEmployeeWorkload_(
    sheet,
    analytics.workload
  );


  return analytics;
}


/**
 * PHASE 6E
 *
 * Initializes every Dashboard component through
 * the business-breakdown layer.
 */
function setupDashboardBusinessAnalytics() {
  rebuildDashboardData_();


  refreshDashboardFilterOptions_();


  const kpis =
    renderDashboardKpis_();


  renderDashboardFilterSummary_(
    kpis
  );


  const operational =
    renderDashboardOperationalAnalytics_();


  const trend =
    renderDashboardTrendAnalytics_();


  const business =
    renderDashboardBusinessAnalytics_();


  return {
    kpis,
    operational,
    trend,
    business,
  };
}


/**
 * Refreshes the complete Dashboard from canonical
 * workbook data.
 */
function refreshDashboardData() {
  const perf = startPerf_("refreshDashboardData");
  const lockState =
    enterDerivedViewWriteSection_(
      "refreshDashboardData"
    );

  try {
  recordDerivedViewUiEffect_(
    "dashboard-render"
  );


  /*
   * Always start a fresh context so Apply/Reset in
   * the same execution cannot reuse a stale filter
   * snapshot. Canonical Leads/ActivityLog tables
   * remain in EXECUTION_CACHE_ and are not re-read.
   */
  beginDashboardRefreshContext_();


  const result =
    rebuildDashboardData_();


  withPerf_(
    "dashboard filter-option write",
    refreshDashboardFilterOptions_
  );


  withPerf_(
    "dashboard shared aggregates",
    ensureDashboardSharedLeadAggregates_
  );


  const metrics =
    renderDashboardKpis_();


  withPerf_(
    "dashboard filter summary",
    () => renderDashboardFilterSummary_(metrics)
  );


  const operational =
    withPerf_(
      "dashboard operational analytics",
      renderDashboardOperationalAnalytics_
    );


  const trend =
    withPerf_(
      "dashboard trend analytics",
      renderDashboardTrendAnalytics_
    );


  const business =
    withPerf_(
      "dashboard business analytics",
      renderDashboardBusinessAnalytics_
    );


  /*
   * PHASE 6F
   */
  withPerf_(
    "dashboard refresh status",
    setDashboardRefreshStatus_
  );


  return {
    data:
      result,

    metrics,

    operational,

    trend,

    business,
  };
  } finally {
    exitDerivedViewWriteSection_(
      lockState
    );
    endPerf_(perf);
  }
}


/**
 * Converts yyyy-MM-dd into a Date intended for
 * writing to a Google Sheets calendar cell.
 *
 * Noon avoids date-boundary/DST issues.
 */
function dashboardDateKeyToSheetDate_(
  dateKey
) {
  const clean =
    String(
      dateKey || ""
    ).trim();


  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/
      .exec(
        clean
      );


  if (!match) {
    throw new Error(
      `Invalid Dashboard date key: ${clean || "(blank)"}`
    );
  }


  return new Date(
    Number(
      match[1]
    ),

    Number(
      match[2]
    ) - 1,

    Number(
      match[3]
    ),

    12,
    0,
    0
  );
}


/**
 * Returns the start/end date keys represented by
 * one Dashboard Quick Range selection.
 *
 * This Week begins Monday, matching the 6B KPI
 * definition.
 */
function getDashboardQuickRangeDates_(
  quickRange
) {
  const clean =
    String(
      quickRange || ""
    ).trim();


  if (
    !PATIENT_DASHBOARD_CONTROLS
      .quickRanges
      .includes(
        clean
      )
  ) {
    throw new Error(
      `Invalid Dashboard Quick Range: ${clean || "(blank)"}`
    );
  }


  if (
    clean ===
    "Custom"
  ) {
    return null;
  }


  if (
    clean ===
    "All Time"
  ) {
    return {
      startKey: "",
      endKey: "",
    };
  }


  const todayKey =
    getDashboardDateKey_(
      new Date()
    );


  if (
    clean ===
    "Today"
  ) {
    return {
      startKey:
        todayKey,

      endKey:
        todayKey,
    };
  }


  if (
    clean ===
    "This Week"
  ) {
    const todayUtc =
      dashboardDateKeyToUtcDate_(
        todayKey
      );


    const dayOfWeek =
      todayUtc.getUTCDay();


    const daysSinceMonday =
      (
        dayOfWeek +
        6
      ) %
      7;


    return {
      startKey:
        addDashboardDaysToKey_(
          todayKey,
          -daysSinceMonday
        ),

      endKey:
        todayKey,
    };
  }


  if (
    clean ===
    "This Month"
  ) {
    return {
      startKey:
        todayKey.substring(
          0,
          7
        ) +
        "-01",

      endKey:
        todayKey,
    };
  }


  /*
   * YTD
   */
  return {
    startKey:
      todayKey.substring(
        0,
        4
      ) +
      "-01-01",

    endKey:
      todayKey,
  };
}


/**
 * Determines whether the currently selected
 * Start/End dates correspond to a standard quick
 * range.
 */
function getDashboardCurrentQuickRange_() {
  const filters =
    getDashboardFilterState_();


  if (
    !filters.startDate &&
    !filters.endDate
  ) {
    return "All Time";
  }


  const currentStart =
    filters.startDate
      ? getDashboardDateKey_(
          filters.startDate
        )
      : "";


  const currentEnd =
    filters.endDate
      ? getDashboardDateKey_(
          filters.endDate
        )
      : "";


  const candidates = [
    "Today",
    "This Week",
    "This Month",
    "YTD",
  ];


  for (
    const candidate of
    candidates
  ) {
    const expected =
      getDashboardQuickRangeDates_(
        candidate
      );


    if (
      currentStart ===
        expected.startKey &&
      currentEnd ===
        expected.endKey
    ) {
      return candidate;
    }
  }


  return "Custom";
}


/**
 * Updates the staff-facing Dashboard status.
 */
function setDashboardControlStatus_(
  message
) {
  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();


  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  if (!sheet) {
    return;
  }


  sheet
    .getRange(
      PATIENT_DASHBOARD_CONTROLS
        .statusCell
    )
    .setValue(
      String(
        message || ""
      )
    )
    .setFontColor(
      PATIENT_DASHBOARD_THEME.muted
    );
}


/**
 * Shows the latest successful Dashboard refresh
 * time.
 */
function setDashboardRefreshStatus_() {
  const timestamp =
    Utilities.formatDate(
      new Date(),
      getDashboardTimezone_(),
      "M/d/yyyy h:mm a"
    );


  setDashboardControlStatus_(
    `Updated ${timestamp}`
  );
}


/**
 * Marks the visible Dashboard as needing an Apply.
 */
function markDashboardFiltersPending_() {
  setDashboardControlStatus_(
    "Filters changed — click Apply"
  );
}


/**
 * Creates/rebuilds the staff-facing Dashboard
 * controls.
 */
function setupDashboardFilterControls_() {
  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();


  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  if (!sheet) {
    throw new Error(
      "Dashboard worksheet was not found."
    );
  }


  /*
   * Preserve the current filters. Only row 5 is
   * being rebuilt.
   */
  const currentQuickRange =
    getDashboardCurrentQuickRange_();


  sheet
    .getRange(
      "A5:J5"
    )
    .breakApart()
    .clearContent()
    .clearFormat()
    .clearDataValidations();


  /*
   * QUICK RANGE
   */
  sheet
    .getRange(
      "A5"
    )
    .setValue(
      "Quick Range"
    )
    .setFontWeight(
      "bold"
    );


  const quickRangeValidation =
    SpreadsheetApp
      .newDataValidation()
      .requireValueInList(
        PATIENT_DASHBOARD_CONTROLS
          .quickRanges,
        true
      )
      .setAllowInvalid(
        false
      )
      .build();


  sheet
    .getRange(
      PATIENT_DASHBOARD_CONTROLS
        .quickRangeCell
    )
    .setDataValidation(
      quickRangeValidation
    )
    .setValue(
      currentQuickRange
    );


  /*
   * APPLY
   */
  sheet
    .getRange(
      "D5"
    )
    .setValue(
      "Apply Filters"
    )
    .setFontWeight(
      "bold"
    );


  sheet
    .getRange(
      PATIENT_DASHBOARD_CONTROLS
        .applyCell
    )
    .insertCheckboxes()
    .setValue(
      false
    );


  /*
   * RESET
   */
  sheet
    .getRange(
      "F5"
    )
    .setValue(
      "Reset"
    )
    .setFontWeight(
      "bold"
    );


  sheet
    .getRange(
      PATIENT_DASHBOARD_CONTROLS
        .resetCell
    )
    .insertCheckboxes()
    .setValue(
      false
    );


  /*
   * STATUS
   */
  sheet
    .getRange(
      "H5"
    )
    .setValue(
      "Status"
    )
    .setFontWeight(
      "bold"
    );


  sheet
    .getRange(
      PATIENT_DASHBOARD_CONTROLS
        .statusRange
    )
    .merge()
    .setHorizontalAlignment(
      "center"
    )
    .setVerticalAlignment(
      "middle"
    )
    .setFontSize(
      8
    );


  setDashboardRefreshStatus_();


  /*
   * Update the guidance text from Phase 6A.
   */
  sheet
    .getRange(
      "A6:J6"
    )
    .breakApart()
    .merge()
    .setValue(
      "Choose a Quick Range or edit the filters above, then check Apply Filters. Reset returns the Dashboard to All Time / All."
    )
    .setFontSize(
      9
    )
    .setWrap(
      true
    );


  /*
   * Keep both filter rows visible while scrolling.
   */
  sheet.setFrozenRows(
    5
  );


  applyDashboardHeaderToolbarStyles_(
    sheet
  );


  return {
    quickRange:
      currentQuickRange,
  };
}


/**
 * Applies one Quick Range to the Start/End filter
 * cells.
 *
 * The employee still explicitly clicks Apply.
 */
function applyDashboardQuickRangeSelection_(
  quickRange
) {
  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();


  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  if (!sheet) {
    throw new Error(
      "Dashboard worksheet was not found."
    );
  }


  const selection =
    String(
      quickRange || ""
    ).trim();


  if (
    selection ===
    "Custom"
  ) {
    markDashboardFiltersPending_();

    return {
      quickRange:
        selection,
    };
  }


  const dates =
    getDashboardQuickRangeDates_(
      selection
    );


  const startCell =
    sheet.getRange(
      "B4"
    );


  const endCell =
    sheet.getRange(
      "D4"
    );


  if (
    selection ===
    "All Time"
  ) {
    startCell.clearContent();
    endCell.clearContent();

  } else {
    startCell
      .setValue(
        dashboardDateKeyToSheetDate_(
          dates.startKey
        )
      )
      .setNumberFormat(
        "m/d/yyyy"
      );


    endCell
      .setValue(
        dashboardDateKeyToSheetDate_(
          dates.endKey
        )
      )
      .setNumberFormat(
        "m/d/yyyy"
      );
  }


  markDashboardFiltersPending_();


  return {
    quickRange:
      selection,

    startKey:
      dates.startKey,

    endKey:
      dates.endKey,
  };
}


/**
 * Staff-facing Dashboard Apply action.
 */
function applyDashboardFilters() {
  const result =
    refreshDashboardData();


  return result;
}


/**
 * Returns every Dashboard filter to its default
 * All-Time / All state and refreshes everything.
 */
function resetDashboardFilters() {
  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();


  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  if (!sheet) {
    throw new Error(
      "Dashboard worksheet was not found."
    );
  }


  sheet
    .getRange(
      "B4"
    )
    .clearContent();


  sheet
    .getRange(
      "D4"
    )
    .clearContent();


  sheet
    .getRange(
      "F4"
    )
    .setValue(
      "All"
    );


  sheet
    .getRange(
      "H4"
    )
    .setValue(
      "All"
    );


  sheet
    .getRange(
      "J4"
    )
    .setValue(
      "All"
    );


  sheet
    .getRange(
      PATIENT_DASHBOARD_CONTROLS
        .quickRangeCell
    )
    .setValue(
      "All Time"
    );


  sheet
    .getRange(
      PATIENT_DASHBOARD_CONTROLS
        .applyCell
    )
    .setValue(
      false
    );


  sheet
    .getRange(
      PATIENT_DASHBOARD_CONTROLS
        .resetCell
    )
    .setValue(
      false
    );


  return refreshDashboardData();
}


/**
 * PHASE 6F
 *
 * Lightweight Dashboard control trigger.
 *
 * Lead workflow mutations still use explicit,
 * authorized Apps Script actions. This trigger is
 * only for read-only Dashboard/filter behavior.
 */
function onEdit(
  event
) {
  if (
    !event ||
    !event.range
  ) {
    return;
  }


  const range =
    event.range;


  const sheet =
    range.getSheet();


  if (
    sheet.getName() !==
    PATIENT_DASHBOARD
      .dashboardSheet
  ) {
    return;
  }


  /*
   * Only react to single-cell Dashboard controls.
   */
  if (
    range.getNumRows() !==
      1 ||
    range.getNumColumns() !==
      1
  ) {
    return;
  }


  const cell =
    range.getA1Notation();


  try {

    /*
     * QUICK RANGE
     */
    if (
      cell ===
      PATIENT_DASHBOARD_CONTROLS
        .quickRangeCell
    ) {
      applyDashboardQuickRangeSelection_(
        range
          .getDisplayValue()
          .trim()
      );

      return;
    }


    /*
     * APPLY FILTERS CHECKBOX
     */
    if (
      cell ===
      PATIENT_DASHBOARD_CONTROLS
        .applyCell
    ) {
      if (
        range.getValue() ===
        true
      ) {
        range.setValue(
          false
        );


        applyDashboardFilters();
      }

      return;
    }


    /*
     * RESET CHECKBOX
     */
    if (
      cell ===
      PATIENT_DASHBOARD_CONTROLS
        .resetCell
    ) {
      if (
        range.getValue() ===
        true
      ) {
        range.setValue(
          false
        );


        resetDashboardFilters();
      }

      return;
    }


    /*
     * Manual Start / End changes mean Custom.
     */
    if (
      cell === "B4" ||
      cell === "D4"
    ) {
      sheet
        .getRange(
          PATIENT_DASHBOARD_CONTROLS
            .quickRangeCell
        )
        .setValue(
          "Custom"
        );


      markDashboardFiltersPending_();

      return;
    }


    /*
     * Categorical filter changes wait for Apply.
     */
    if (
      cell === "F4" ||
      cell === "H4" ||
      cell === "J4"
    ) {
      markDashboardFiltersPending_();
    }

  } catch (error) {

    /*
     * Never leave command checkboxes stuck TRUE.
     */
    try {
      sheet
        .getRange(
          PATIENT_DASHBOARD_CONTROLS
            .applyCell
        )
        .setValue(
          false
        );


      sheet
        .getRange(
          PATIENT_DASHBOARD_CONTROLS
            .resetCell
        )
        .setValue(
          false
        );

    } catch (
      cleanupError
    ) {
      // Ignore cleanup failure.
    }


    const message =
      error &&
      error.message
        ? error.message
        : String(
            error
          );


    setDashboardControlStatus_(
      "Refresh failed"
    );


    SpreadsheetApp
      .getActiveSpreadsheet()
      .toast(
        message,
        "Dashboard Error",
        8
      );
  }
}


/**
 * PHASE 6F
 *
 * Initializes Dashboard controls and refreshes all
 * analytics through Phase 6F.
 */
function setupDashboardControls() {
  setupDashboardFilterControls_();


  const result =
    refreshDashboardData();


  return result;
}


/**
 * PHASE 6A
 *
 * Validates Dashboard foundation.
 *
 * Run this from the spreadsheet menu, not directly
 * from the Apps Script editor.
 */
function runDashboardFoundationCheck() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const ui =
    SpreadsheetApp.getUi();


  const issues = [];


  const dashboard =
    ss.getSheetByName(
      "Dashboard"
    );


  const dataSheet =
    ss.getSheetByName(
      "DashboardData"
    );


  if (!dashboard) {
    issues.push(
      "Dashboard worksheet is missing."
    );
  }


  if (!dataSheet) {
    issues.push(
      "DashboardData worksheet is missing."
    );
  }


  const expectedRanges = {
    DashboardStartDate:
      "B4",

    DashboardEndDate:
      "D4",

    DashboardReason:
      "F4",

    DashboardSource:
      "H4",

    DashboardEmployee:
      "J4",
  };


  if (dashboard) {
    Object.entries(
      expectedRanges
    ).forEach(
      (
        [
          name,
          expectedA1,
        ]
      ) => {

        const range =
          ss.getRangeByName(
            name
          );


        if (!range) {
          issues.push(
            `Named range "${name}" is missing.`
          );

          return;
        }


        if (
          range.getSheet()
            .getName() !==
            "Dashboard" ||
          range.getA1Notation() !==
            expectedA1
        ) {
          issues.push(
            `Named range "${name}" points to the wrong cell.`
          );
        }
      }
    );
  }


  let leadCount = 0;
  let dashboardCount = 0;


  const leads =
    ss.getSheetByName(
      "Leads"
    );


  if (leads) {
    const headers =
      getHeaderMap_(
        "Leads"
      );

    const lastRow =
      leads.getLastRow();

    if (
      lastRow >= 2
    ) {
      const values =
        leads
          .getRange(
            2,
            headers.lead_id,
            lastRow - 1,
            1
          )
          .getDisplayValues();

      leadCount =
        values.filter(
          row =>
            String(
              row[0] || ""
            ).trim()
        ).length;
    }
  }


  if (
    dataSheet &&
    dataSheet.getLastRow() >= 2
  ) {
    const values =
      dataSheet
        .getRange(
          2,
          1,
          dataSheet.getLastRow() - 1,
          1
        )
        .getDisplayValues();

    const ids =
      values
        .map(
          row =>
            String(
              row[0] || ""
            ).trim()
        )
        .filter(
          Boolean
        );


    dashboardCount =
      ids.length;


    if (
      new Set(
        ids
      ).size !==
      ids.length
    ) {
      issues.push(
        "DashboardData contains duplicate lead_id values."
      );
    }
  }


  if (
    leadCount !==
    dashboardCount
  ) {
    issues.push(
      `Lead count mismatch: Leads=${leadCount}, DashboardData=${dashboardCount}.`
    );
  }


  const passed =
    issues.length === 0;


  ui.alert(
    "Phase 6A Dashboard Check",
    passed
      ? [
          "PASSED",
          "",
          `Canonical leads: ${leadCount}`,
          `Dashboard rows: ${dashboardCount}`,
          "",
          "Universal filters and analytics snapshot are ready.",
        ].join("\n")
      : [
          "FAILED",
          "",
          ...issues,
        ].join("\n"),
    ui.ButtonSet.OK
  );


  return {
    passed,
    leadCount,
    dashboardCount,
    issues,
  };
}


/**
 * PHASE 6B
 *
 * Checks the KPI engine and visible card values.
 */
function runDashboardKpiCheck() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const ui =
    SpreadsheetApp.getUi();

  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  const issues = [];


  if (!sheet) {
    throw new Error(
      "Dashboard worksheet was not found."
    );
  }


  let metrics;


  try {
    metrics =
      calculateDashboardKpis_();

  } catch (error) {

    ui.alert(
      "Phase 6B KPI Check",
      "FAILED\n\n" +
      (
        error &&
        error.message
          ? error.message
          : String(error)
      ),
      ui.ButtonSet.OK
    );

    throw error;
  }


  const expectedCards = {
    "A9":
      String(
        metrics.newToday
      ),

    "C9":
      String(
        metrics.newThisWeek
      ),

    "E9":
      String(
        metrics.newThisMonth
      ),

    "G9":
      String(
        metrics.openUntouched
      ),

    "I9":
      String(
        metrics.needsAttention
      ),

    "A14":
      String(
        metrics.scheduled
      ),

    "E14":
      metrics
        .medianFirstAttemptDisplay,
  };


  Object.entries(
    expectedCards
  ).forEach(
    (
      [
        cell,
        expected,
      ]
    ) => {

      const actual =
        sheet
          .getRange(
            cell
          )
          .getDisplayValue()
          .trim();


      if (
        actual !==
        expected
      ) {
        issues.push(
          `${cell}: expected "${expected}", found "${actual}".`
        );
      }
    }
  );


  /*
   * Conversion is stored/displayed as a percentage.
   * Compare its numeric meaning rather than the exact
   * number of decimal places chosen by Google Sheets.
   */
  const conversionDisplay =
    sheet
      .getRange(
        "C14"
      )
      .getDisplayValue()
      .trim();


  if (
    metrics.conversion ===
    null
  ) {

    if (
      conversionDisplay !==
      "—"
    ) {
      issues.push(
        `C14: expected "—", found "${conversionDisplay}".`
      );
    }

  } else {

    const displayedPercent =
      Number(
        conversionDisplay
          .replace(
            "%",
            ""
          )
          .trim()
      );


    const expectedPercent =
      metrics.conversion *
      100;


    if (
      !Number.isFinite(
        displayedPercent
      ) ||
      Math.abs(
        displayedPercent -
        expectedPercent
      ) >
      0.01
    ) {
      issues.push(
        `C14: expected approximately ${expectedPercent.toFixed(1)}%, found "${conversionDisplay}".`
      );
    }
  }


  if (
    metrics.conversion !==
      null &&
    (
      metrics.conversion <
        0 ||
      metrics.conversion >
        1
    )
  ) {
    issues.push(
      "Scheduling conversion is outside the valid 0–100% range."
    );
  }


  if (
    metrics
      .medianFirstAttemptMinutes !==
      null &&
    metrics
      .medianFirstAttemptMinutes <
      0
  ) {
    issues.push(
      "Median first-attempt time is negative."
    );
  }


  const passed =
    issues.length === 0;


  ui.alert(
    "Phase 6B KPI Check",
    passed
      ? [
          "PASSED",
          "",
          `Filtered leads: ${metrics.cohortCount}`,
          `New today: ${metrics.newToday}`,
          `New this week: ${metrics.newThisWeek}`,
          `New this month: ${metrics.newThisMonth}`,
          `Open untouched: ${metrics.openUntouched}`,
          `Needs attention: ${metrics.needsAttention}`,
          `Scheduled: ${metrics.scheduled}`,
          `Conversion: ${
            metrics.conversion === null
              ? "—"
              : (
                  metrics.conversion *
                  100
                ).toFixed(1) +
                "%"
          }`,
          `Median first attempt: ${
            metrics
              .medianFirstAttemptDisplay
          }`,
        ].join("\n")
      : [
          "FAILED",
          "",
          ...issues,
        ].join("\n"),
    ui.ButtonSet.OK
  );


  return {
    passed,
    metrics,
    issues,
  };
}


/**
 * PHASE 6C
 *
 * Validates operational analytics and visible
 * Dashboard results.
 */
function runDashboardOperationalCheck() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const ui =
    SpreadsheetApp.getUi();


  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  if (!sheet) {
    throw new Error(
      "Dashboard worksheet was not found."
    );
  }


  const analytics =
    calculateDashboardOperationalAnalytics_();


  const issues = [];


  /*
   * Attempt buckets must equal total open leads.
   */
  const attemptTotal =
    analytics.attempts.zero +
    analytics.attempts.one +
    analytics.attempts.two +
    analytics.attempts.three +
    analytics.attempts.fourPlus;


  if (
    attemptTotal !==
    analytics.openLeadCount
  ) {
    issues.push(
      `Attempt distribution totals ${attemptTotal}, expected ${analytics.openLeadCount}.`
    );
  }


  /*
   * Aging may exclude malformed/missing ages.
   * In normal canonical data it should equal open
   * lead count.
   */
  const agingTotal =
    analytics
      .aging
      .under24Hours +
    analytics
      .aging
      .oneToTwoDays +
    analytics
      .aging
      .threeToSevenDays +
    analytics
      .aging
      .overSevenDays;


  if (
    agingTotal !==
    analytics.openLeadCount
  ) {
    issues.push(
      `Lead-aging distribution totals ${agingTotal}, expected ${analytics.openLeadCount}.`
    );
  }


  const expectedCells = {
    "H14":
      analytics
        .followUps
        .overdue,

    "J14":
      analytics
        .followUps
        .dueToday,

    "H15":
      analytics
        .followUps
        .dueNext7Days,

    "J15":
      analytics
        .scheduleDateNeeded,

    "B22":
      analytics
        .attempts
        .zero,

    "B23":
      analytics
        .attempts
        .one,

    "B24":
      analytics
        .attempts
        .two,

    "B25":
      analytics
        .attempts
        .three,

    "B26":
      analytics
        .attempts
        .fourPlus,

    "G22":
      analytics
        .aging
        .under24Hours,

    "G23":
      analytics
        .aging
        .oneToTwoDays,

    "G24":
      analytics
        .aging
        .threeToSevenDays,

    "G25":
      analytics
        .aging
        .overSevenDays,
  };


  Object.entries(
    expectedCells
  ).forEach(
    (
      [
        cell,
        expected,
      ]
    ) => {

      const actual =
        Number(
          sheet
            .getRange(
              cell
            )
            .getValue()
        );


      if (
        actual !==
        Number(
          expected
        )
      ) {
        issues.push(
          `${cell}: expected ${expected}, found ${actual}.`
        );
      }
    }
  );


  const passed =
    issues.length === 0;


  ui.alert(
    "Phase 6C Operational Check",

    passed
      ? [
          "PASSED",
          "",
          `Filtered leads: ${analytics.cohortCount}`,
          `Open leads: ${analytics.openLeadCount}`,
          "",
          `Overdue follow-ups: ${analytics.followUps.overdue}`,
          `Due today: ${analytics.followUps.dueToday}`,
          `Due next 7 days: ${analytics.followUps.dueNext7Days}`,
          `Schedule dates needed: ${analytics.scheduleDateNeeded}`,
          "",
          `Oldest open lead: ${formatDashboardLeadAge_(
            analytics
              .aging
              .oldestOpenHours
          )}`,
        ].join(
          "\n"
        )

      : [
          "FAILED",
          "",
          ...issues,
        ].join(
          "\n"
        ),

    ui.ButtonSet.OK
  );


  return {
    passed,
    analytics,
    issues,
  };
}


/**
 * PHASE 6D
 *
 * Validates trend totals, helper rows, and the
 * embedded native chart.
 */
function runDashboardTrendCheck() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const ui =
    SpreadsheetApp.getUi();


  const dashboard =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  const dataSheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dataSheet
    );


  if (
    !dashboard ||
    !dataSheet
  ) {
    throw new Error(
      "Dashboard or DashboardData worksheet was not found."
    );
  }


  const trend =
    buildDashboardTrendData_();


  const issues = [];


  const bucketNewTotal =
    trend.buckets.reduce(
      (
        total,
        bucket
      ) =>
        total +
        Number(
          bucket.newLeads ||
          0
        ),
      0
    );


  const bucketScheduledTotal =
    trend.buckets.reduce(
      (
        total,
        bucket
      ) =>
        total +
        Number(
          bucket.scheduled ||
          0
        ),
      0
    );


  if (
    bucketNewTotal !==
    trend.totalNewLeads
  ) {
    issues.push(
      `Trend buckets total ${bucketNewTotal} new leads, expected ${trend.totalNewLeads}.`
    );
  }


  if (
    bucketScheduledTotal !==
    trend.totalScheduled
  ) {
    issues.push(
      `Trend buckets total ${bucketScheduledTotal} scheduled leads, expected ${trend.totalScheduled}.`
    );
  }


  /*
   * Verify DashboardData helper output.
   */
  const helperRows =
    dataSheet
      .getRange(
        2,
        PATIENT_DASHBOARD_TREND_LAYOUT
          .dataStartColumn,
        trend.buckets.length,
        PATIENT_DASHBOARD_TREND_LAYOUT
          .dataColumnCount
      )
      .getValues();


  if (
    helperRows.length !==
    trend.buckets.length
  ) {
    issues.push(
      "DashboardData trend-helper row count does not match the calculated bucket count."
    );
  }


  trend.buckets.forEach(
    (
      bucket,
      index
    ) => {

      const helper =
        helperRows[
          index
        ];


      /*
       * Google Sheets may have historically converted a
       * yyyy-MM-dd helper key into a Date object.
       *
       * Normalize either representation before comparing.
       */
      const helperPeriodKey =
        isDashboardDate_(
          helper[0]
        )
          ? getDashboardDateKey_(
              helper[0]
            )
          : String(
              helper[0] || ""
            ).trim();


      if (
        helperPeriodKey !==
        bucket.startKey
      ) {
        issues.push(
          `Trend helper row ${index + 2} has the wrong period key. Expected "${bucket.startKey}", found "${helperPeriodKey}".`
        );
      }


      if (
        Number(
          helper[2]
        ) !==
        bucket.newLeads
      ) {
        issues.push(
          `Trend helper row ${index + 2} has the wrong New Leads count.`
        );
      }


      if (
        Number(
          helper[3]
        ) !==
        bucket.scheduled
      ) {
        issues.push(
          `Trend helper row ${index + 2} has the wrong Scheduled count.`
        );
      }
    }
  );


  /*
   * Verify the expected chart exists.
   */
  let chartFound =
    false;


  dashboard
    .getCharts()
    .forEach(
      chart => {
        try {
          const title =
            String(
              chart
                .getOptions()
                .get(
                  "title"
                ) || ""
            ).trim();


          if (
            title ===
            PATIENT_DASHBOARD_TREND_LAYOUT
              .chartTitle
          ) {
            chartFound =
              true;
          }

        } catch (error) {
          // Ignore unrelated charts.
        }
      }
    );


  if (!chartFound) {
    issues.push(
      "The New Leads vs First-Time Scheduled chart was not found."
    );
  }


  const passed =
    issues.length ===
    0;


  ui.alert(
    "Phase 6D Trend Check",

    passed
      ? [
          "PASSED",
          "",
          `Range: ${trend.startKey} → ${trend.endKey}`,
          `Granularity: ${trend.granularity}`,
          `Periods: ${trend.buckets.length}`,
          "",
          `New leads: ${trend.totalNewLeads}`,
          `First-time scheduled: ${trend.totalScheduled}`,
          `Scheduled without timestamp: ${trend.scheduledWithoutTimestamp}`,
          "",
          "Native trend chart is ready.",
        ].join(
          "\n"
        )

      : [
          "FAILED",
          "",
          ...issues,
        ].join(
          "\n"
        ),

    ui.ButtonSet.OK
  );


  return {
    passed,
    trend,
    issues,
  };
}


/**
 * PHASE 6E
 *
 * Validates business breakdown totals and their
 * visible Dashboard output.
 */
function runDashboardBusinessCheck() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  const ui =
    SpreadsheetApp.getUi();


  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  if (!sheet) {
    throw new Error(
      "Dashboard worksheet was not found."
    );
  }


  const analytics =
    calculateDashboardBusinessAnalytics_();


  const kpis =
    calculateDashboardKpis_();


  const issues = [];


  /*
   * Reason/source tables should use the same
   * legitimate lead denominator as the KPI engine.
   */
  if (
    analytics
      .reason
      .totalLeads !==
    kpis
      .legitimateLeadCount
  ) {
    issues.push(
      "Appointment Reason denominator does not match the Scheduling Conversion KPI denominator."
    );
  }


  if (
    analytics
      .source
      .totalLeads !==
    kpis
      .legitimateLeadCount
  ) {
    issues.push(
      "Page/Source denominator does not match the Scheduling Conversion KPI denominator."
    );
  }


  if (
    analytics
      .reason
      .totalScheduled !==
    kpis
      .legitimateScheduledCount
  ) {
    issues.push(
      "Appointment Reason scheduled total does not match the KPI engine."
    );
  }


  if (
    analytics
      .source
      .totalScheduled !==
    kpis
      .legitimateScheduledCount
  ) {
    issues.push(
      "Page/Source scheduled total does not match the KPI engine."
    );
  }


  /*
   * Visible total cells.
   */
  const expectedCells = {
    "B59":
      analytics
        .reason
        .totalLeads,

    "C59":
      analytics
        .reason
        .totalScheduled,

    "G59":
      analytics
        .source
        .totalLeads,

    "H59":
      analytics
        .source
        .totalScheduled,

    "B74":
      analytics
        .caseLost
        .total,

    "G74":
      analytics
        .unrelated
        .total,

    "C90":
      analytics
        .workload
        .totals
        .openAssigned,

    "E90":
      analytics
        .workload
        .totals
        .attemptsToday,

    "G90":
      analytics
        .workload
        .totals
        .followUpsDue,

    "I90":
      analytics
        .workload
        .totals
        .scheduledToday,
  };


  Object.entries(
    expectedCells
  ).forEach(
    (
      [
        cell,
        expected,
      ]
    ) => {

      const actual =
        Number(
          sheet
            .getRange(
              cell
            )
            .getValue()
        );


      if (
        actual !==
        Number(
          expected
        )
      ) {
        issues.push(
          `${cell}: expected ${expected}, found ${actual}.`
        );
      }
    }
  );


  const passed =
    issues.length ===
    0;


  ui.alert(
    "Phase 6E Business Analytics Check",

    passed
      ? [
          "PASSED",
          "",
          `Filtered leads: ${analytics.cohortCount}`,
          "",
          `Legitimate appointment leads: ${analytics.reason.totalLeads}`,
          `Scheduled legitimate leads: ${analytics.reason.totalScheduled}`,
          `Case Lost: ${analytics.caseLost.total}`,
          `Unrelated: ${analytics.unrelated.total}`,
          "",
          `Open assigned: ${analytics.workload.totals.openAssigned}`,
          `Attempts today: ${analytics.workload.totals.attemptsToday}`,
          `Follow-ups due: ${analytics.workload.totals.followUpsDue}`,
          `Scheduled today: ${analytics.workload.totals.scheduledToday}`,
        ].join(
          "\n"
        )

      : [
          "FAILED",
          "",
          ...issues,
        ].join(
          "\n"
        ),

    ui.ButtonSet.OK
  );


  return {
    passed,
    analytics,
    issues,
  };
}


/**
 * PHASE 6F
 *
 * Read-only validation of Dashboard staff controls.
 */
function runDashboardControlsCheck() {
  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();


  const ui =
    SpreadsheetApp
      .getUi();


  const sheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  if (!sheet) {
    throw new Error(
      "Dashboard worksheet was not found."
    );
  }


  const issues = [];


  const quickRange =
    sheet
      .getRange(
        PATIENT_DASHBOARD_CONTROLS
          .quickRangeCell
      )
      .getDisplayValue()
      .trim();


  if (
    !PATIENT_DASHBOARD_CONTROLS
      .quickRanges
      .includes(
        quickRange
      )
  ) {
    issues.push(
      `B5 contains invalid Quick Range "${quickRange}".`
    );
  }


  /*
   * Verify data-validation controls exist.
   */
  if (
    !sheet
      .getRange(
        "B5"
      )
      .getDataValidation()
  ) {
    issues.push(
      "B5 Quick Range dropdown is missing."
    );
  }


  const applyValidation =
    sheet
      .getRange(
        "E5"
      )
      .getDataValidation();


  if (
    !applyValidation ||
    applyValidation
      .getCriteriaType() !==
      SpreadsheetApp
        .DataValidationCriteria
        .CHECKBOX
  ) {
    issues.push(
      "E5 Apply Filters checkbox is missing."
    );
  }


  const resetValidation =
    sheet
      .getRange(
        "G5"
      )
      .getDataValidation();


  if (
    !resetValidation ||
    resetValidation
      .getCriteriaType() !==
      SpreadsheetApp
        .DataValidationCriteria
        .CHECKBOX
  ) {
    issues.push(
      "G5 Reset checkbox is missing."
    );
  }


  /*
   * Standard Quick Range selections must agree with
   * the actual Start/End cells.
   */
  if (
    quickRange &&
    quickRange !==
      "Custom"
  ) {
    const expected =
      getDashboardQuickRangeDates_(
        quickRange
      );


    const startValue =
      sheet
        .getRange(
          "B4"
        )
        .getValue();


    const endValue =
      sheet
        .getRange(
          "D4"
        )
        .getValue();


    const actualStart =
      isDashboardDate_(
        startValue
      )
        ? getDashboardDateKey_(
            startValue
          )
        : "";


    const actualEnd =
      isDashboardDate_(
        endValue
      )
        ? getDashboardDateKey_(
            endValue
          )
        : "";


    if (
      actualStart !==
        expected.startKey ||
      actualEnd !==
        expected.endKey
    ) {
      issues.push(
        `Quick Range "${quickRange}" does not match the current Start/End dates.`
      );
    }
  }


  const status =
    sheet
      .getRange(
        PATIENT_DASHBOARD_CONTROLS
          .statusCell
      )
      .getDisplayValue()
      .trim();


  if (!status) {
    issues.push(
      "Dashboard refresh status is blank."
    );
  }


  if (
    sheet.getFrozenRows() <
    5
  ) {
    issues.push(
      "Dashboard should freeze through row 5."
    );
  }


  const passed =
    issues.length ===
    0;


  ui.alert(
    "Phase 6F Dashboard Controls Check",

    passed
      ? [
          "PASSED",
          "",
          `Quick Range: ${quickRange}`,
          `Status: ${status}`,
          "",
          "Quick ranges, Apply, Reset, and refresh status are ready.",
        ].join(
          "\n"
        )

      : [
          "FAILED",
          "",
          ...issues,
        ].join(
          "\n"
        ),

    ui.ButtonSet.OK
  );


  return {
    passed,
    quickRange,
    status,
    issues,
  };
}


/**
 * PHASE 6G
 *
 * Final staff-facing Dashboard polish.
 *
 * This does NOT apply production permissions.
 * Permissions/protection are deferred to Phase 9.
 */
function finalizeDashboardPhase6() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  const dashboard =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  const dataSheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dataSheet
    );


  if (!dashboard) {
    throw new Error(
      "Dashboard worksheet was not found."
    );
  }


  if (!dataSheet) {
    throw new Error(
      "DashboardData worksheet was not found."
    );
  }


  /*
   * Staff-facing presentation chrome. Canvas is
   * applied before refresh so gap cells stay dark
   * while section renderers restyle their own
   * clearFormat areas. Do not repaint A2:J94 inside
   * refreshDashboardData(). Row 1 is the static
   * application header and is owned by
   * setupStaticApplicationHeaders().
   */
  dashboard.setHiddenGridlines(
    true
  );

  applyDashboardPresentationCanvas_(
    dashboard
  );

  applyDashboardHeaderToolbarStyles_(
    dashboard
  );


  /*
   * Make sure everything reflects current
   * canonical workbook data before closing Phase 6.
   */
  refreshDashboardData();


  dashboard.setFrozenRows(
    5
  );


  /*
   * General column sizing.
   *
   * Keep enough room for labels without making
   * the Dashboard excessively wide.
   */
  const widths = [
    125, // A
    105, // B
    125, // C
    105, // D
    145, // E
    145, // F
    120, // G
    125, // H
    130, // I
    170, // J
  ];


  widths.forEach(
    (
      width,
      index
    ) => {
      dashboard.setColumnWidth(
        index + 1,
        width
      );
    }
  );


  /*
   * Keep key explanatory rows readable.
   */
  dashboard.setRowHeight(
    1,
    32
  );


  dashboard.setRowHeight(
    2,
    22
  );


  dashboard.setRowHeight(
    5,
    28
  );


  dashboard.setRowHeight(
    6,
    34
  );


  dashboard.setRowHeight(
    18,
    24
  );


  /*
   * DashboardData is a generated backend/helper
   * sheet. Staff should not need to work inside it.
   *
   * Apps Script can continue reading/writing it
   * while hidden.
   */
  if (
    !dataSheet.isSheetHidden()
  ) {
    dataSheet.hideSheet();
  }


  /*
   * Leave the staff-facing Dashboard selected.
   */
  dashboard.activate();


  ss.toast(
    "Phase 6 Dashboard finalized.",
    "Dashboard",
    4
  );


  return {
    finalized: true,
    dashboardDataHidden:
      dataSheet.isSheetHidden(),
  };
}


/**
 * PHASE 6G
 *
 * Lightweight closeout verification for the entire
 * Dashboard implementation.
 *
 * Extended workflow regression remains Phase 8.
 */
function runDashboardPhase6CloseoutCheck() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const ui =
    SpreadsheetApp.getUi();


  const dashboard =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dashboardSheet
    );


  const dataSheet =
    ss.getSheetByName(
      PATIENT_DASHBOARD
        .dataSheet
    );


  const issues = [];


  if (!dashboard) {
    issues.push(
      "Dashboard worksheet is missing."
    );
  }


  if (!dataSheet) {
    issues.push(
      "DashboardData worksheet is missing."
    );
  }


  /*
   * Foundation / filter ranges.
   */
  const requiredNamedRanges = [
    "DashboardStartDate",
    "DashboardEndDate",
    "DashboardReason",
    "DashboardSource",
    "DashboardEmployee",
  ];


  requiredNamedRanges.forEach(
    name => {
      if (
        !ss.getRangeByName(
          name
        )
      ) {
        issues.push(
          `Named range "${name}" is missing.`
        );
      }
    }
  );


  if (dashboard) {

    /*
     * Staff controls.
     */
    if (
      !dashboard
        .getRange(
          "B5"
        )
        .getDataValidation()
    ) {
      issues.push(
        "Dashboard Quick Range control is missing."
      );
    }


    const applyValidation =
      dashboard
        .getRange(
          "E5"
        )
        .getDataValidation();


    if (
      !applyValidation ||
      applyValidation
        .getCriteriaType() !==
        SpreadsheetApp
          .DataValidationCriteria
          .CHECKBOX
    ) {
      issues.push(
        "Dashboard Apply checkbox is missing."
      );
    }


    const resetValidation =
      dashboard
        .getRange(
          "G5"
        )
        .getDataValidation();


    if (
      !resetValidation ||
      resetValidation
        .getCriteriaType() !==
        SpreadsheetApp
          .DataValidationCriteria
          .CHECKBOX
    ) {
      issues.push(
        "Dashboard Reset checkbox is missing."
      );
    }


    /*
     * KPI anchors.
     */
    const requiredKpiCells = [
      "A9",
      "C9",
      "E9",
      "G9",
      "I9",
      "A14",
      "C14",
      "E14",
    ];


    requiredKpiCells.forEach(
      cell => {
        const value =
          dashboard
            .getRange(
              cell
            )
            .getDisplayValue()
            .trim();


        if (!value) {
          issues.push(
            `Dashboard KPI cell ${cell} is blank.`
          );
        }
      }
    );


    /*
     * Operational sections.
     */
    const requiredSectionTitles = [
      [
        "A20",
        "OPEN LEADS BY CONTACT ATTEMPTS",
      ],

      [
        "F20",
        "AGE OF OPEN LEADS",
      ],

      [
        "A49",
        "APPOINTMENT REASON PERFORMANCE",
      ],

      [
        "F49",
        "PAGE / SOURCE PERFORMANCE",
      ],

      [
        "A64",
        "WHY LEADS ARE LOST",
      ],

      [
        "F64",
        "UNRELATED REQUESTS",
      ],

      [
        "A80",
        "ASSIGNED EMPLOYEE WORKLOAD",
      ],
    ];


    requiredSectionTitles.forEach(
      (
        [
          cell,
          expected,
        ]
      ) => {

        const actual =
          dashboard
            .getRange(
              cell
            )
            .getDisplayValue()
            .trim();


        if (
          actual !==
          expected
        ) {
          issues.push(
            `${cell}: expected "${expected}", found "${actual}".`
          );
        }
      }
    );


    /*
     * Trend chart.
     */
    let trendChartFound =
      false;


    dashboard
      .getCharts()
      .forEach(
        chart => {
          try {
            const title =
              String(
                chart
                  .getOptions()
                  .get(
                    "title"
                  ) || ""
              ).trim();


            if (
              title ===
              PATIENT_DASHBOARD_TREND_LAYOUT
                .chartTitle
            ) {
              trendChartFound =
                true;
            }

          } catch (error) {
            // Ignore unrelated charts.
          }
        }
      );


    if (!trendChartFound) {
      issues.push(
        "Dashboard trend chart is missing."
      );
    }


    if (
      dashboard.getFrozenRows() <
      5
    ) {
      issues.push(
        "Dashboard should be frozen through row 5."
      );
    }
  }


  /*
   * DashboardData should now be treated as a
   * generated helper sheet.
   */
  if (
    dataSheet &&
    !dataSheet.isSheetHidden()
  ) {
    issues.push(
      "DashboardData is still visible."
    );
  }


  /*
   * Recalculate major analytics engines once.
   * Any internal inconsistency should throw here.
   */
  try {
    calculateDashboardKpis_();

    calculateDashboardOperationalAnalytics_();

    buildDashboardTrendData_();

    calculateDashboardBusinessAnalytics_();

  } catch (error) {
    issues.push(
      "Dashboard analytics calculation failed: " +
      (
        error &&
        error.message
          ? error.message
          : String(error)
      )
    );
  }


  const passed =
    issues.length ===
    0;


  ui.alert(
    "Phase 6G Dashboard Closeout",

    passed
      ? [
          "PASSED",
          "",
          "Dashboard foundation: OK",
          "Universal filters: OK",
          "KPI engine: OK",
          "Operational analytics: OK",
          "Trend analytics/chart: OK",
          "Business analytics: OK",
          "Staff controls: OK",
          "DashboardData hidden: OK",
          "",
          "Phase 6 implementation is complete.",
        ].join(
          "\n"
        )

      : [
          "FAILED",
          "",
          ...issues,
        ].join(
          "\n"
        ),

    ui.ButtonSet.OK
  );


  return {
    passed,
    issues,
  };
}


/**
 * =====================================================
 * PHASE 9 — STAFF ACCESS vs BACKEND TABS
 * =====================================================
 *
 * Normal staff experience:
 *   Board, Dashboard, Patient Details
 *   Apps Script continues to write backend sheets.
 *
 * Backend tabs:
 *   hidden
 *   warning-protected
 *
 * Warning-only protection is intentional.
 * Hard sheet locks can block Patient Details and
 * derived-view writes when a staff member runs
 * the script.
 *
 * These helpers are setup/admin operations.
 * Do not call them from Patient Detail, Board,
 * Dashboard, or other staff workflow paths.
 */


function getBackendGuardDescription_(sheetName) {
  return (
    PATIENT_BACKEND_GUARD_DESCRIPTION_PREFIX +
    sheetName
  );
}


function getGeneratedViewGuardDescription_(sheetName) {
  return (
    PATIENT_GENERATED_VIEW_GUARD_DESCRIPTION_PREFIX +
    sheetName
  );
}


function isBackendGuardProtectionDescription_(description) {
  const text =
    description == null
      ? ""
      : String(description);

  if (
    text.indexOf(
      PATIENT_BACKEND_GUARD_DESCRIPTION_PREFIX
    ) === 0
  ) {
    return true;
  }

  /*
   * The first Phase 9 pass used one shared
   * description for every backend sheet.
   * Treat those as this same feature so
   * apply/remove stay idempotent.
   */
  return (
    text ===
    PATIENT_LEADS_SYSTEM
      .backendProtectionDescription
  );
}


function isGeneratedViewGuardProtectionDescription_(description) {
  const text =
    description == null
      ? ""
      : String(description);

  return (
    text.indexOf(
      PATIENT_GENERATED_VIEW_GUARD_DESCRIPTION_PREFIX
    ) === 0
  );
}


function getMatchingSheetProtections_(sheet, isGuardDescription) {
  return sheet
    .getProtections(
      SpreadsheetApp.ProtectionType.SHEET
    )
    .filter(
      protection =>
        isGuardDescription(
          protection.getDescription()
        )
    );
}


function getBackendGuardProtections_(sheet) {
  return getMatchingSheetProtections_(
    sheet,
    isBackendGuardProtectionDescription_
  );
}


function getGeneratedViewGuardProtections_(sheet) {
  return getMatchingSheetProtections_(
    sheet,
    isGeneratedViewGuardProtectionDescription_
  );
}


function formatBackendGuardList_(names) {
  return names.length > 0
    ? names.join(", ")
    : "(none)";
}


function presentBackendGuardResult_(title, result, lines) {
  Logger.log(
    JSON.stringify(result)
  );

  try {
    SpreadsheetApp
      .getUi()
      .alert(
        title,
        lines.join("\n"),
        SpreadsheetApp.getUi().ButtonSet.OK
      );
  } catch (error) {
    /*
     * Script-editor / non-UI calls still
     * receive the return object.
     */
  }
}


function forEachConfiguredSheets_(sheetNames, result, callback) {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  sheetNames.forEach(
    sheetName => {
      try {
        const sheet =
          ss.getSheetByName(
            sheetName
          );

        if (!sheet) {
          result.missing.push(
            sheetName
          );
          return;
        }

        callback(
          sheet,
          sheetName
        );
      } catch (error) {
        result.warnings.push(
          sheetName +
          ": " +
          (
            error &&
            error.message
              ? error.message
              : String(error)
          )
        );
      }
    }
  );
}


function forEachPatientBackendSheet_(result, callback) {
  forEachConfiguredSheets_(
    PATIENT_BACKEND_SHEETS,
    result,
    callback
  );
}


function forEachPatientGeneratedViewSheet_(result, callback) {
  forEachConfiguredSheets_(
    PATIENT_GENERATED_VIEW_SHEETS,
    result,
    callback
  );
}


/*
 * Warning-only protection is intentional.
 *
 * Normal staff workflows use Apps Script to write
 * these backend sheets under the spreadsheet user's
 * authorization. Hard editor restrictions at this
 * stage could block canonical mutations.
 *
 * This is accident-prevention, not the final
 * production authorization model.
 */
function ensureWarningOnlyGuardProtection_(
  sheet,
  description,
  getExistingProtections
) {
  const existing =
    getExistingProtections(
      sheet
    );

  if (
    existing.length ===
    0
  ) {
    sheet
      .protect()
      .setDescription(
        description
      )
      .setWarningOnly(
        true
      );

    return {
      created: true,
      alreadyProtected: false,
    };
  }

  const keep =
    existing[0];

  if (
    !keep.canEdit()
  ) {
    return {
      created: false,
      alreadyProtected:
        keep.isWarningOnly(),
      warning:
        sheet.getName() +
        ": existing CRM guard protection could not be updated.",
    };
  }

  keep.setDescription(
    description
  );

  keep.setWarningOnly(
    true
  );

  existing
    .slice(1)
    .forEach(
      protection => {
        if (
          protection.canEdit()
        ) {
          protection.remove();
        }
      }
    );

  return {
    created: false,
    alreadyProtected: true,
  };
}


function ensureBackendGuardProtection_(sheet) {
  return ensureWarningOnlyGuardProtection_(
    sheet,
    getBackendGuardDescription_(
      sheet.getName()
    ),
    getBackendGuardProtections_
  );
}


function ensureGeneratedViewGuardProtection_(sheet) {
  /*
   * Warning-only on purpose. Apps Script must still
   * rebuild Board and Dashboard. Do not call this
   * from renderPatientBoard() or refreshDashboardData().
   */
  const result =
    ensureWarningOnlyGuardProtection_(
      sheet,
      getGeneratedViewGuardDescription_(
        sheet.getName()
      ),
      getGeneratedViewGuardProtections_
    );

  applyGeneratedViewUnprotectedRanges_(
    sheet
  );

  return result;
}


function getDashboardGuardUnprotectedRanges_(sheet) {
  return [
    sheet.getRange("B4"),
    sheet.getRange("D4"),
    sheet.getRange("F4"),
    sheet.getRange("H4"),
    sheet.getRange("J4"),
    sheet.getRange("B5"),
    sheet.getRange("E5"),
    sheet.getRange("G5"),
  ];
}


function applyGeneratedViewUnprotectedRanges_(sheet) {
  if (
    sheet.getName() ===
    ARCHIVE_VIEW_SHEET_NAME_
  ) {
    const archiveProtection =
      getGeneratedViewGuardProtections_(
        sheet
      );

    if (
      !archiveProtection.length ||
      !archiveProtection[0].canEdit()
    ) {
      return;
    }

    /*
     * Column A is the staff selection checkbox.
     * The rest of the generated Archive sheet
     * stays warning-protected.
     */
    archiveProtection[0].setUnprotectedRanges([
      sheet.getRange(
        2,
        1,
        Math.max(sheet.getMaxRows() - 1, 1),
        1
      ),
    ]);

    return;
  }

  if (
    sheet.getName() !==
    PATIENT_DASHBOARD.dashboardSheet
  ) {
    return;
  }

  const existing =
    getGeneratedViewGuardProtections_(
      sheet
    );

  if (
    !existing.length ||
    !existing[0].canEdit()
  ) {
    return;
  }

  existing[0].setUnprotectedRanges(
    getDashboardGuardUnprotectedRanges_(
      sheet
    )
  );
}


function removeMatchingGuardProtections_(
  sheet,
  getExistingProtections
) {
  const existing =
    getExistingProtections(
      sheet
    );

  const warnings = [];
  let removed = 0;

  existing.forEach(
    protection => {
      if (
        !protection.canEdit()
      ) {
        warnings.push(
          sheet.getName() +
          ": CRM guard protection could not be removed."
        );
        return;
      }

      protection.remove();
      removed += 1;
    }
  );

  return {
    removed,
    warnings,
  };
}


function removeBackendGuardProtections_(sheet) {
  return removeMatchingGuardProtections_(
    sheet,
    getBackendGuardProtections_
  );
}


function removeGeneratedViewGuardProtections_(sheet) {
  return removeMatchingGuardProtections_(
    sheet,
    getGeneratedViewGuardProtections_
  );
}


function ensureStaffSheetsVisible_() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  PATIENT_LEADS_SYSTEM
    .staffSheets
    .forEach(
      sheetName => {
        const sheet =
          ss.getSheetByName(
            sheetName
          );

        if (
          sheet &&
          sheet.isSheetHidden()
        ) {
          sheet.showSheet();
        }
      }
    );
}


function hideBackendSheets_() {
  return hideBackendSheetsCore_(
    false
  );
}


function hideBackendSheetsCore_(showAlert) {
  const result = {
    hidden: [],
    alreadyHidden: [],
    missing: [],
    warnings: [],
  };

  forEachPatientBackendSheet_(
    result,
    (sheet, sheetName) => {
      if (
        sheet.isSheetHidden()
      ) {
        result.alreadyHidden.push(
          sheetName
        );
        return;
      }

      sheet.hideSheet();
      result.hidden.push(
        sheetName
      );
    }
  );

  if (showAlert) {
    presentBackendGuardResult_(
      "ADMIN: Hide Backend Sheets",
      result,
      [
        "Backend tabs are hidden.",
        "Warning-only protections were left unchanged.",
        "",
        "Hidden: " +
        formatBackendGuardList_(
          result.hidden
        ),
        "Already hidden: " +
        formatBackendGuardList_(
          result.alreadyHidden
        ),
        "Missing: " +
        formatBackendGuardList_(
          result.missing
        ),
        "Warnings: " +
        formatBackendGuardList_(
          result.warnings
        ),
      ]
    );
  }

  return result;
}


function hideBackendSheets() {
  return hideBackendSheetsCore_(
    true
  );
}


function showBackendSheetsForAdmin() {
  const result = {
    shown: [],
    alreadyVisible: [],
    missing: [],
    warnings: [],
  };

  forEachPatientBackendSheet_(
    result,
    (sheet, sheetName) => {
      if (
        sheet.isSheetHidden()
      ) {
        sheet.showSheet();
        result.shown.push(
          sheetName
        );
        return;
      }

      result.alreadyVisible.push(
        sheetName
      );
    }
  );

  presentBackendGuardResult_(
    "ADMIN: Show Backend Sheets",
    result,
    [
      "Backend tabs are visible for inspection.",
      "Warning-only protections remain in place.",
      "Run Hide Backend Sheets or Apply Backend Guardrails to hide them again.",
      "",
      "Shown: " +
      formatBackendGuardList_(
        result.shown
      ),
      "Already visible: " +
      formatBackendGuardList_(
        result.alreadyVisible
      ),
      "Missing: " +
      formatBackendGuardList_(
        result.missing
      ),
      "Warnings: " +
      formatBackendGuardList_(
        result.warnings
      ),
    ]
  );

  return result;
}


function applyBackendSheetGuardrails() {
  const result = {
    hidden: [],
    alreadyHidden: [],
    protected: [],
    alreadyProtected: [],
    generatedViewProtected: [],
    generatedViewAlreadyProtected: [],
    missing: [],
    warnings: [],
  };

  ensureStaffSheetsVisible_();

  forEachPatientBackendSheet_(
    result,
    (sheet, sheetName) => {
      const protectResult =
        ensureBackendGuardProtection_(
          sheet
        );

      if (
        protectResult.warning
      ) {
        result.warnings.push(
          protectResult.warning
        );
      }

      if (
        protectResult.created
      ) {
        result.protected.push(
          sheetName
        );
      } else if (
        protectResult.alreadyProtected
      ) {
        result.alreadyProtected.push(
          sheetName
        );
      }

      if (
        hasHardSheetProtection_(
          sheet
        )
      ) {
        result.warnings.push(
          sheetName +
          ": existing hard protection was left unchanged and may block Apps Script writes."
        );
      }

      if (
        sheet.isSheetHidden()
      ) {
        result.alreadyHidden.push(
          sheetName
        );
        return;
      }

      sheet.hideSheet();
      result.hidden.push(
        sheetName
      );
    }
  );

  forEachPatientGeneratedViewSheet_(
    result,
    (sheet, sheetName) => {
      const protectResult =
        ensureGeneratedViewGuardProtection_(
          sheet
        );

      if (
        protectResult.warning
      ) {
        result.warnings.push(
          protectResult.warning
        );
      }

      if (
        protectResult.created
      ) {
        result.generatedViewProtected.push(
          sheetName
        );
      } else if (
        protectResult.alreadyProtected
      ) {
        result.generatedViewAlreadyProtected.push(
          sheetName
        );
      }

      if (
        hasHardSheetProtection_(
          sheet
        )
      ) {
        result.warnings.push(
          sheetName +
          ": existing hard protection was left unchanged and may block Apps Script writes."
        );
      }

      if (
        sheet.isSheetHidden()
      ) {
        sheet.showSheet();
      }
    }
  );

  presentBackendGuardResult_(
    "ADMIN: Apply Backend Guardrails",
    result,
    [
      "Staff sheets remain visible: Board, Dashboard.",
      "Board and Dashboard are warning-protected against accidental edits.",
      "Dashboard filter/control cells remain editable without a warning.",
      "Backend tabs are hidden and warning-protected.",
      "Apps Script can still write these sheets.",
      "",
      "Hidden: " +
      formatBackendGuardList_(
        result.hidden
      ),
      "Already hidden: " +
      formatBackendGuardList_(
        result.alreadyHidden
      ),
      "Protected: " +
      formatBackendGuardList_(
        result.protected
      ),
      "Already protected: " +
      formatBackendGuardList_(
        result.alreadyProtected
      ),
      "Generated views protected: " +
      formatBackendGuardList_(
        result.generatedViewProtected
      ),
      "Generated views already protected: " +
      formatBackendGuardList_(
        result.generatedViewAlreadyProtected
      ),
      "Missing: " +
      formatBackendGuardList_(
        result.missing
      ),
      "Warnings: " +
      formatBackendGuardList_(
        result.warnings
      ),
    ]
  );

  return result;
}


function removeBackendSheetGuardrails() {
  const result = {
    shown: [],
    alreadyVisible: [],
    removedProtections: [],
    alreadyUnprotected: [],
    generatedViewRemovedProtections: [],
    generatedViewAlreadyUnprotected: [],
    missing: [],
    warnings: [],
  };

  forEachPatientBackendSheet_(
    result,
    (sheet, sheetName) => {
      const removed =
        removeBackendGuardProtections_(
          sheet
        );

      if (
        removed.warnings.length >
        0
      ) {
        result.warnings.push(
          ...removed.warnings
        );
      }

      if (
        removed.removed >
        0
      ) {
        result.removedProtections.push(
          sheetName
        );
      } else {
        result.alreadyUnprotected.push(
          sheetName
        );
      }

      if (
        sheet.isSheetHidden()
      ) {
        sheet.showSheet();
        result.shown.push(
          sheetName
        );
        return;
      }

      result.alreadyVisible.push(
        sheetName
      );
    }
  );

  forEachPatientGeneratedViewSheet_(
    result,
    (sheet, sheetName) => {
      const removed =
        removeGeneratedViewGuardProtections_(
          sheet
        );

      if (
        removed.warnings.length >
        0
      ) {
        result.warnings.push(
          ...removed.warnings
        );
      }

      if (
        removed.removed >
        0
      ) {
        result.generatedViewRemovedProtections.push(
          sheetName
        );
      } else {
        result.generatedViewAlreadyUnprotected.push(
          sheetName
        );
      }
    }
  );

  presentBackendGuardResult_(
    "ADMIN: Remove Backend Guardrails",
    result,
    [
      "Backend tabs are visible.",
      "Only CRM warning protections were removed, including Board and Dashboard generated-view guards.",
      "Board and Dashboard remain visible. Unrelated protections and sheet data were not changed.",
      "",
      "Shown: " +
      formatBackendGuardList_(
        result.shown
      ),
      "Already visible: " +
      formatBackendGuardList_(
        result.alreadyVisible
      ),
      "Protections removed: " +
      formatBackendGuardList_(
        result.removedProtections
      ),
      "Already unprotected: " +
      formatBackendGuardList_(
        result.alreadyUnprotected
      ),
      "Generated views unprotected: " +
      formatBackendGuardList_(
        result.generatedViewRemovedProtections
      ),
      "Generated views already unprotected: " +
      formatBackendGuardList_(
        result.generatedViewAlreadyUnprotected
      ),
      "Missing: " +
      formatBackendGuardList_(
        result.missing
      ),
      "Warnings: " +
      formatBackendGuardList_(
        result.warnings
      ),
    ]
  );

  return result;
}


function activateStaffSheetIfNeeded_() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  const activeSheet =
    ss.getActiveSheet();


  const activeName =
    activeSheet
      ? activeSheet.getName()
      : "";


  if (
    PATIENT_LEADS_SYSTEM
      .staffSheets
      .indexOf(
        activeName
      ) !==
    -1
  ) {
    return;
  }


  const board =
    ss.getSheetByName(
      "Board"
    );


  if (board) {
    board.activate();
    return;
  }


  const dashboard =
    ss.getSheetByName(
      "Dashboard"
    );


  if (dashboard) {
    dashboard.activate();
  }
}


/**
 * PHASE 9
 *
 * Applies the production staff vs backend layout.
 *
 * Staff keep Board and Dashboard visible.
 * Backend tabs are hidden and warning-protected.
 * Patient Details and other Apps Script writes
 * continue to use those backend sheets normally.
 */
function applyPhase9SheetAccess() {
  const result =
    applyBackendSheetGuardrails();

  activateStaffSheetIfNeeded_();

  return {
    applied:
      result.missing.length ===
      0,
    hiddenCount:
      result.hidden.length +
      result.alreadyHidden.length,
    missing: result.missing,
    unprotected: result.warnings,
  };
}


/**
 * DEV helper.
 *
 * Unhides backend tabs for inspection.
 * Warning protection stays in place.
 */
function revealBackendSheetsForDev() {
  return showBackendSheetsForAdmin();
}


function isBackendSheetWarningProtected_(sheet) {
  return getBackendGuardProtections_(
    sheet
  ).some(
    protection =>
      protection.isWarningOnly()
  );
}


function hasHardSheetProtection_(sheet) {
  const protections =
    sheet.getProtections(
      SpreadsheetApp.ProtectionType.SHEET
    );


  return protections.some(
    protection =>
      !protection.isWarningOnly()
  );
}


/**
 * PHASE 9
 *
 * Verifies the staff vs backend access layout
 * without changing workbook data.
 */
function runPhase9SheetAccessCheck() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  const ui =
    SpreadsheetApp.getUi();


  const issues = [];


  PATIENT_LEADS_SYSTEM
    .staffSheets
    .forEach(
      sheetName => {
        const sheet =
          ss.getSheetByName(
            sheetName
          );


        if (!sheet) {
          issues.push(
            `Staff worksheet "${sheetName}" is missing.`
          );
          return;
        }


        if (
          sheet.isSheetHidden()
        ) {
          issues.push(
            `Staff worksheet "${sheetName}" is hidden.`
          );
        }
      }
    );


  PATIENT_LEADS_SYSTEM
    .backendSheets
    .forEach(
      sheetName => {
        const sheet =
          ss.getSheetByName(
            sheetName
          );


        if (!sheet) {
          issues.push(
            `Backend worksheet "${sheetName}" is missing.`
          );
          return;
        }


        if (
          !sheet.isSheetHidden()
        ) {
          issues.push(
            `Backend worksheet "${sheetName}" is visible.`
          );
        }


        if (
          hasHardSheetProtection_(
            sheet
          )
        ) {
          issues.push(
            `Backend worksheet "${sheetName}" has hard protection, which can block Apps Script writes. Use warning-only protection.`
          );
        } else if (
          !isBackendSheetWarningProtected_(
            sheet
          )
        ) {
          issues.push(
            `Backend worksheet "${sheetName}" is not warning-protected.`
          );
        }
      }
    );


  const passed =
    issues.length ===
    0;


  ui.alert(
    "Phase 9 Sheet Access Check",

    passed
      ? [
          "PASSED",
          "",
          "Staff sheets visible: Board, Dashboard.",
          "Patient Details / Apps Script backend writes: unrestricted by hard locks.",
          "Backend tabs hidden: OK",
          "Backend tabs warning-protected: OK",
        ].join(
          "\n"
        )

      : [
          "FAILED",
          "",
          ...issues,
        ].join(
          "\n"
        ),

    ui.ButtonSet.OK
  );


  return {
    passed,
    issues,
  };
}


function onOpen() {
  SpreadsheetApp
    .getUi()
    .createMenu(
      "Patient Leads"
    )
    .addItem(
      "Open Selected Patient",
      "openSelectedBoardCardDetail"
    )
    .addItem(
      "Quick Actions",
      "openSelectedBoardQuickActions"
    )
    .addItem(
      "Move Selected Lead",
      "openSelectedBoardMoveDialog"
    )
    .addSeparator()
    .addItem(
      "Refresh Board",
      "renderPatientBoard"
    )
    .addSeparator()
    .addItem(
      "Archive Selected Patient",
      "archiveSelectedBoardPatient"
    )
    .addItem(
      "Open Archive",
      "openPatientArchive"
    )
    .addItem(
      "Refresh Archive",
      "renderPatientArchive"
    )
    .addItem(
      "Open Archived Patient",
      "openSelectedArchivedPatient"
    )
    .addItem(
      "Unarchive Selected Patient",
      "unarchiveSelectedArchivePatient"
    )
    .addItem(
      "Restore Selected Cold-Stored Patient",
      "restoreSelectedColdStoredPatient"
    )
    .addSeparator()
    .addItem(
      "Open Dashboard",
      "openPatientDashboard"
    )
    .addItem(
      "Apply Dashboard Filters",
      "applyDashboardFilters"
    )
    .addItem(
      "Reset Dashboard Filters",
      "resetDashboardFilters"
    )
    .addItem(
      "Refresh Dashboard Data",
      "refreshDashboardData"
    )
    .addSeparator()
    .addItem(
      "DEV: Validate Attachments/Reactions",
      "runAttachmentReactionIntegrityCheck"
    )
    .addItem(
      "DEV: Check Drive Attachments",
      "runDriveAttachmentHealthCheck"
    )
    .addItem(
      "DEV: Check Attachment Storage Policy",
      "runAttachmentStoragePolicyCheck"
    )
    .addItem(
      "DEV: Check Dashboard Foundation",
      "runDashboardFoundationCheck"
    )
    .addItem(
      "DEV: Check Dashboard KPIs",
      "runDashboardKpiCheck"
    )
    .addItem(
      "DEV: Check Dashboard Operations",
      "runDashboardOperationalCheck"
    )
    .addItem(
      "DEV: Check Dashboard Trends",
      "runDashboardTrendCheck"
    )
    .addItem(
      "DEV: Check Dashboard Business Analytics",
      "runDashboardBusinessCheck"
    )
    .addItem(
      "DEV: Check Dashboard Controls",
      "runDashboardControlsCheck"
    )
    .addItem(
      "DEV: Check Phase 6 Dashboard",
      "runDashboardPhase6CloseoutCheck"
    )
    .addItem(
      "DEV: Apply Phase 9 Sheet Access",
      "applyPhase9SheetAccess"
    )
    .addItem(
      "DEV: Check Phase 9 Sheet Access",
      "runPhase9SheetAccessCheck"
    )
    .addItem(
      "DEV: Reveal Backend Sheets",
      "revealBackendSheetsForDev"
    )
    .addSeparator()
    .addItem(
      "ADMIN: Setup Lead Archive Schema",
      "setupLeadArchiveSchema"
    )
    .addItem(
      "ADMIN: Archive Maintenance",
      "openArchiveMaintenanceDialog"
    )
    .addItem(
      "ADMIN: Resume Cold Storage Cleanup",
      "promptResumeColdStorageCleanup"
    )
    .addItem(
      "ADMIN: Apply Backend Guardrails",
      "applyBackendSheetGuardrails"
    )
    .addItem(
      "ADMIN: Show Backend Sheets",
      "showBackendSheetsForAdmin"
    )
    .addItem(
      "ADMIN: Hide Backend Sheets",
      "hideBackendSheets"
    )
    .addItem(
      "ADMIN: Remove Backend Guardrails",
      "removeBackendSheetGuardrails"
    )
    .addToUi();

  /*
   * Do not hide or re-protect backend sheets
   * here. Guardrails are setup operations and
   * must not run on every spreadsheet open.
   */
}


/*
 * ============================================================================
 * PHASE 7B — Website lead ingest (Apps Script Web App)
 * ============================================================================
 *
 * Server-to-server only. HMAC-SHA256 signed JSON envelope in POST body.
 * No Authorization headers. Secret: Script Property CRM_INGEST_HMAC_SECRET.
 *
 * HMAC CONTRACT (must match Phase 7C Node/Next.js exactly):
 * 1. Build canonical_payload_json = recursive sorted-key JSON of `payload`
 *    only (arrays keep order; no insignificant whitespace).
 * 2. signing_string =
 *      String(version) + "\n" + timestamp + "\n" + submission_id + "\n" +
 *      canonical_payload_json
 * 3. signature = lowercase hex of HMAC-SHA256(UTF-8 signing_string, UTF-8 secret)
 *    via Utilities.computeHmacSha256Signature(..., Utilities.Charset.UTF_8)
 * 4. Envelope field `signature` is NOT included in the signed bytes.
 *
 * DEV and production use this same code.
 * Script Property CRM_INGEST_ENV_LABEL must be exactly dev or prod.
 * A missing or other value fails closed and does not behave as dev.
 *
 * PHASE 7E adds WebsiteIngestLedger. A submission_id creates at most one
 * Lead. The ledger stores no patient fields. Run setupWebsiteIngestLedger()
 * once before ingest; requests do not create the sheet themselves.
 */


const WEBSITE_INGEST_API_VERSION_ = 1;


const WEBSITE_INGEST_TIMESTAMP_SKEW_MS_ =
  5 * 60 * 1000;


const WEBSITE_INGEST_LOCK_WAIT_MS_ =
  10000;


const WEBSITE_INGEST_ENV_LABEL_PROPERTY_ =
  "CRM_INGEST_ENV_LABEL";


const WEBSITE_INGEST_HMAC_SECRET_PROPERTY_ =
  "CRM_INGEST_HMAC_SECRET";


/**
 * CRM_INGEST_ENV_LABEL after trim and lower-case.
 * Only "dev" and "prod" are configured. Missing,
 * blank, or any other value is unconfigured.
 * Never defaults to dev.
 */
function websiteIngestEnvLabel_() {
  let raw = "";

  try {
    raw =
      PropertiesService
        .getScriptProperties()
        .getProperty(
          WEBSITE_INGEST_ENV_LABEL_PROPERTY_
        ) || "";
  } catch (error) {
    return "";
  }

  const label =
    String(raw)
      .trim()
      .toLowerCase();

  if (
    label === "dev" ||
    label === "prod"
  ) {
    return label;
  }

  return "";
}


function websiteIngestEnvLabelForLog_() {
  return (
    websiteIngestEnvLabel_() ||
    "unconfigured"
  );
}


function requireWebsiteIngestDev_(
  helperName
) {
  if (
    websiteIngestEnvLabel_() !==
    "dev"
  ) {
    throw new Error(
      String(
        helperName ||
          "This helper"
      ) +
        " runs only when Script Property CRM_INGEST_ENV_LABEL is dev."
    );
  }
}


const WEBSITE_INGEST_ALLOWED_PAYLOAD_KEYS_ =
  Object.freeze([
    "first_name",
    "last_name",
    "phone",
    "email",
    "appointment_reason",
    "preferred_contact_method",
    "preferred_contact_time",
    "sms_consent",
    "message",
    "page_name",
    "source_path",
    "utm_source",
    "utm_medium",
    "utm_campaign",
  ]);


const WEBSITE_INGEST_INTAKE_COLUMNS_ =
  Object.freeze([
    "intake_source",
    "first_name",
    "last_name",
    "phone",
    "email",
    "appointment_reason",
    "preferred_contact_method",
    "preferred_contact_time",
    "sms_consent",
    "message",
    "page_name",
    "source_path",
    "utm_source",
    "utm_medium",
    "utm_campaign",
  ]);


const WEBSITE_INGEST_FIELD_LIMITS_ =
  Object.freeze({
    first_name: 50,
    last_name: 50,
    phone: 25,
    email: 100,
    appointment_reason: 100,
    preferred_contact_method: 20,
    preferred_contact_time: 100,
    message: 1000,
    page_name: 200,
    source_path: 500,
    utm_source: 200,
    utm_medium: 200,
    utm_campaign: 200,
  });


const WEBSITE_INGEST_CONTACT_METHODS_ =
  Object.freeze([
    "Phone",
    "Text",
    "Email",
  ]);


const WEBSITE_INGEST_LEDGER_SHEET_NAME_ =
  "WebsiteIngestLedger";


const WEBSITE_INGEST_LEDGER_HEADERS_ =
  Object.freeze([
    "submission_id",
    "payload_fingerprint",
    "state",
    "lead_id",
    "first_seen_at",
    "last_seen_at",
    "completed_at",
    "attempt_count",
    "last_result_code",
  ]);


const WEBSITE_INGEST_LEDGER_STATE_PROCESSING_ =
  "PROCESSING";


const WEBSITE_INGEST_LEDGER_STATE_SUCCESS_ =
  "SUCCESS";


const WEBSITE_INGEST_LEDGER_STATE_CLEAN_FAILED_ =
  "CLEAN_FAILED";


const WEBSITE_INGEST_LEDGER_STATE_PARTIAL_ =
  "PARTIAL_COMMIT";


const WEBSITE_INGEST_STALE_PROCESSING_MS_ =
  60 * 1000;


const WEBSITE_INGEST_FINGERPRINT_PREFIX_ =
  "sha256:";


const WEBSITE_INGEST_LEAD_ID_PATTERN_ =
  /^LEAD-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;


const WEBSITE_INGEST_DEV_FAIL_PROPERTY_ =
  "CRM_INGEST_DEV_FAIL_POINT";


const WEBSITE_INGEST_DEV_WEB_APP_URL_PROPERTY_ =
  "CRM_INGEST_DEV_WEB_APP_URL";


const WEBSITE_INGEST_EXEC_URL_PATTERN_ =
  /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;


const WEBSITE_INGEST_LEDGER_CACHE_PREFIX_ =
  "wil:";


const WEBSITE_INGEST_LEDGER_CACHE_TTL_SECONDS_ =
  21600;


/**
 * Web App POST entry — website lead ingest.
 */
function doPost(e) {
  const startedAt = Date.now();
  let submissionId = "";

  try {
    if (
      !e ||
      !e.postData ||
      typeof e.postData.contents !== "string"
    ) {
      logWebsiteIngestEvent_(
        "",
        "INVALID_ENVELOPE",
        "",
        Date.now() - startedAt
      );

      return websiteIngestJsonResponse_({
        ok: false,
        version: WEBSITE_INGEST_API_VERSION_,
        code: "INVALID_ENVELOPE",
      });
    }

    const envelope =
      parseWebsiteIngestEnvelope_(
        e.postData.contents
      );

    submissionId =
      envelope.submission_id;

    validateWebsiteIngestTimestamp_(
      envelope.timestamp
    );

    validateWebsiteIngestSubmissionId_(
      envelope.submission_id
    );

    if (
      !verifyWebsiteIngestSignature_(
        envelope
      )
    ) {
      logWebsiteIngestEvent_(
        submissionId,
        "AUTH_FAILED",
        "",
        Date.now() - startedAt
      );

      return websiteIngestJsonResponse_({
        ok: false,
        version: WEBSITE_INGEST_API_VERSION_,
        code: "AUTH_FAILED",
        submission_id: submissionId,
      });
    }

    if (!websiteIngestEnvLabel_()) {
      logWebsiteIngestEvent_(
        submissionId,
        "INGEST_FAILED",
        "",
        Date.now() - startedAt,
        {
          reason: "env_unconfigured",
        }
      );

      return websiteIngestJsonResponse_({
        ok: false,
        version: WEBSITE_INGEST_API_VERSION_,
        code: "INGEST_FAILED",
        submission_id: submissionId,
      });
    }

    const dto =
      validateWebsiteLeadDto_(
        envelope.payload
      );

    const fingerprint =
      buildWebsiteIngestPayloadFingerprint_(
        envelope.submission_id,
        envelope.payload
      );

    const ingestResult =
      withWebsiteIngestMutationLock_(
        function () {
          return ingestWebsiteLead_(
            dto,
            {
              submissionId:
                envelope.submission_id,
              fingerprint: fingerprint,
            }
          );
        }
      );

    if (
      ingestResult &&
      ingestResult.lockTimeout
    ) {
      logWebsiteIngestEvent_(
        submissionId,
        "LOCK_TIMEOUT",
        "",
        Date.now() - startedAt
      );

      return websiteIngestJsonResponse_({
        ok: false,
        version: WEBSITE_INGEST_API_VERSION_,
        code: "LOCK_TIMEOUT",
        submission_id: submissionId,
      });
    }

    if (
      ingestResult &&
      ingestResult.ok === true
    ) {
      logWebsiteIngestEvent_(
        submissionId,
        "OK",
        ingestResult.lead_id || "",
        Date.now() - startedAt,
        websiteIngestLogMeta_(
          ingestResult
        )
      );

      const okBody = {
        ok: true,
        version: WEBSITE_INGEST_API_VERSION_,
        lead_id: ingestResult.lead_id,
        submission_id: submissionId,
      };

      if (ingestResult.replayed === true) {
        okBody.replayed = true;
      }

      const envLabel =
        websiteIngestEnvLabel_();

      if (envLabel) {
        okBody.environment = envLabel;
      }

      const safeState =
        websiteIngestSafeState_(
          ingestResult.state
        );

      if (safeState) {
        okBody.state = safeState;
      }

      return websiteIngestJsonResponse_(
        okBody
      );
    }

    const failCode =
      ingestResult &&
      ingestResult.code
        ? ingestResult.code
        : "INGEST_FAILED";

    logWebsiteIngestEvent_(
      submissionId,
      failCode,
      ingestResult &&
        ingestResult.lead_id
        ? ingestResult.lead_id
        : "",
      Date.now() - startedAt,
      websiteIngestLogMeta_(
        ingestResult
      )
    );

    const failBody = {
      ok: false,
      version: WEBSITE_INGEST_API_VERSION_,
      code: failCode,
      submission_id: submissionId,
    };

    if (
      failCode === "PARTIAL_COMMIT" &&
      ingestResult &&
      ingestResult.lead_id
    ) {
      failBody.lead_id =
        ingestResult.lead_id;
    }

    return websiteIngestJsonResponse_(
      failBody
    );

  } catch (error) {
    const code =
      extractWebsiteIngestErrorCode_(
        error
      );

    logWebsiteIngestEvent_(
      submissionId,
      code,
      "",
      Date.now() - startedAt
    );

    const body = {
      ok: false,
      version: WEBSITE_INGEST_API_VERSION_,
      code: code,
    };

    if (submissionId) {
      body.submission_id =
        submissionId;
    }

    return websiteIngestJsonResponse_(
      body
    );
  }
}


/**
 * Web App GET — ingest is POST-only.
 */
function doGet(e) {
  return websiteIngestJsonResponse_({
    ok: false,
    version: WEBSITE_INGEST_API_VERSION_,
    code: "METHOD_NOT_ALLOWED",
  });
}


function websiteIngestJsonResponse_(
  obj
) {
  return ContentService
    .createTextOutput(
      JSON.stringify(obj)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );
}


function extractWebsiteIngestErrorCode_(
  error
) {
  if (
    error &&
    error.websiteIngestCode
  ) {
    return String(
      error.websiteIngestCode
    );
  }

  return "INGEST_FAILED";
}


function websiteIngestThrow_(
  code
) {
  const error = new Error(
    String(code || "INGEST_FAILED")
  );

  error.websiteIngestCode =
    String(code || "INGEST_FAILED");

  throw error;
}


/**
 * Parse and structurally validate the signed envelope.
 * Does not verify HMAC (caller does that next).
 */
function parseWebsiteIngestEnvelope_(
  raw
) {
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    websiteIngestThrow_(
      "INVALID_ENVELOPE"
    );
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed)
  ) {
    websiteIngestThrow_(
      "INVALID_ENVELOPE"
    );
  }

  if (
    parsed.version !==
    WEBSITE_INGEST_API_VERSION_
  ) {
    websiteIngestThrow_(
      "INVALID_ENVELOPE"
    );
  }

  if (
    typeof parsed.timestamp !==
      "string" ||
    !String(parsed.timestamp).trim()
  ) {
    websiteIngestThrow_(
      "INVALID_ENVELOPE"
    );
  }

  if (
    typeof parsed.submission_id !==
      "string" ||
    !String(
      parsed.submission_id
    ).trim()
  ) {
    websiteIngestThrow_(
      "INVALID_ENVELOPE"
    );
  }

  if (
    !parsed.payload ||
    typeof parsed.payload !==
      "object" ||
    Array.isArray(parsed.payload)
  ) {
    websiteIngestThrow_(
      "INVALID_ENVELOPE"
    );
  }

  if (
    typeof parsed.signature !==
      "string" ||
    !String(parsed.signature).trim()
  ) {
    websiteIngestThrow_(
      "INVALID_ENVELOPE"
    );
  }

  return {
    version: parsed.version,
    timestamp: String(
      parsed.timestamp
    ).trim(),
    submission_id: String(
      parsed.submission_id
    ).trim(),
    payload: parsed.payload,
    signature: String(
      parsed.signature
    )
      .trim()
      .toLowerCase(),
  };
}


function verifyWebsiteIngestSignature_(
  envelope
) {
  const secret =
    getWebsiteIngestHmacSecret_();

  const signingString =
    buildWebsiteIngestSigningString_(
      envelope.version,
      envelope.timestamp,
      envelope.submission_id,
      envelope.payload
    );

  const expected =
    hmacSha256Hex_(
      signingString,
      secret
    );

  return secureHexEquals_(
    expected,
    envelope.signature
  );
}


/**
 * Exact signing string for Phase 7C parity:
 * {version}\n{timestamp}\n{submission_id}\n{canonical_payload_json}
 */
function buildWebsiteIngestSigningString_(
  version,
  timestamp,
  submissionId,
  payload
) {
  return (
    String(version) +
    "\n" +
    String(timestamp) +
    "\n" +
    String(submissionId) +
    "\n" +
    canonicalJsonStringify_(payload)
  );
}


/**
 * Deterministic JSON: object keys sorted recursively;
 * arrays preserve order; no insignificant whitespace.
 */
function canonicalJsonStringify_(
  value
) {
  if (value === null) {
    return "null";
  }

  const valueType = typeof value;

  if (
    valueType === "boolean" ||
    valueType === "number"
  ) {
    if (
      valueType === "number" &&
      !Number.isFinite(value)
    ) {
      websiteIngestThrow_(
        "INVALID_PAYLOAD"
      );
    }

    return JSON.stringify(value);
  }

  if (valueType === "string") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    const parts = [];

    for (
      let index = 0;
      index < value.length;
      index++
    ) {
      parts.push(
        canonicalJsonStringify_(
          value[index]
        )
      );
    }

    return "[" + parts.join(",") + "]";
  }

  if (valueType === "object") {
    const keys =
      Object.keys(value).sort();

    const parts = [];

    for (
      let index = 0;
      index < keys.length;
      index++
    ) {
      const key = keys[index];

      parts.push(
        JSON.stringify(key) +
          ":" +
          canonicalJsonStringify_(
            value[key]
          )
      );
    }

    return "{" + parts.join(",") + "}";
  }

  websiteIngestThrow_(
    "INVALID_PAYLOAD"
  );
}


function hmacSha256Hex_(
  message,
  secret
) {
  const signatureBytes =
    Utilities.computeHmacSha256Signature(
      message,
      secret,
      Utilities.Charset.UTF_8
    );

  const hex = [];

  for (
    let index = 0;
    index < signatureBytes.length;
    index++
  ) {
    let byte =
      signatureBytes[index];

    if (byte < 0) {
      byte += 256;
    }

    const part =
      byte.toString(16);

    hex.push(
      part.length === 1
        ? "0" + part
        : part
    );
  }

  return hex.join("");
}


/**
 * Full-length compare; avoids obvious early-exit
 * on first differing character.
 */
function secureHexEquals_(
  left,
  right
) {
  const a = String(left || "");
  const b = String(right || "");

  if (a.length !== b.length) {
    return false;
  }

  if (
    !/^[0-9a-f]*$/.test(a) ||
    !/^[0-9a-f]*$/.test(b)
  ) {
    return false;
  }

  let diff = 0;

  for (
    let index = 0;
    index < a.length;
    index++
  ) {
    diff |=
      a.charCodeAt(index) ^
      b.charCodeAt(index);
  }

  return diff === 0;
}


function validateWebsiteIngestTimestamp_(
  timestamp
) {
  const text = String(timestamp || "");

  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/.test(
      text
    )
  ) {
    websiteIngestThrow_(
      "INVALID_ENVELOPE"
    );
  }

  const parsedMs =
    Date.parse(text);

  if (!Number.isFinite(parsedMs)) {
    websiteIngestThrow_(
      "INVALID_ENVELOPE"
    );
  }

  const skew =
    Math.abs(
      Date.now() - parsedMs
    );

  if (
    skew >
    WEBSITE_INGEST_TIMESTAMP_SKEW_MS_
  ) {
    websiteIngestThrow_(
      "TIMESTAMP_EXPIRED"
    );
  }
}


function validateWebsiteIngestSubmissionId_(
  submissionId
) {
  const text =
    String(submissionId || "");

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      text
    )
  ) {
    websiteIngestThrow_(
      "INVALID_ENVELOPE"
    );
  }
}


/**
 * Strict allowlist + type/length checks.
 * Forces Website intake_source outside the DTO.
 */
function validateWebsiteLeadDto_(
  payload
) {
  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    websiteIngestThrow_(
      "INVALID_PAYLOAD"
    );
  }

  const keys =
    Object.keys(payload);

  for (
    let index = 0;
    index < keys.length;
    index++
  ) {
    if (
      WEBSITE_INGEST_ALLOWED_PAYLOAD_KEYS_
        .indexOf(keys[index]) === -1
    ) {
      websiteIngestThrow_(
        "INVALID_PAYLOAD"
      );
    }
  }

  function requireString(
    fieldName,
    options
  ) {
    const allowEmpty =
      options &&
      options.allowEmpty;

    const raw =
      payload[fieldName];

    if (typeof raw !== "string") {
      websiteIngestThrow_(
        "INVALID_PAYLOAD"
      );
    }

    const trimmed =
      raw.replace(
        /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
        ""
      ).trim()
        .replace(/\s+/g, " ");

    const maxLen =
      WEBSITE_INGEST_FIELD_LIMITS_[
        fieldName
      ];

    if (
      trimmed.length > maxLen
    ) {
      websiteIngestThrow_(
        "INVALID_PAYLOAD"
      );
    }

    if (
      !allowEmpty &&
      !trimmed
    ) {
      websiteIngestThrow_(
        "INVALID_PAYLOAD"
      );
    }

    return trimmed;
  }

  const firstName =
    requireString("first_name");

  const lastName =
    requireString("last_name");

  if (
    firstName.length < 2 ||
    lastName.length < 2
  ) {
    websiteIngestThrow_(
      "INVALID_PAYLOAD"
    );
  }

  const phone =
    requireString("phone");

  const digits =
    phone.replace(/\D/g, "");

  if (
    digits.length < 10 ||
    digits.length > 15
  ) {
    websiteIngestThrow_(
      "INVALID_PAYLOAD"
    );
  }

  if (
    !/^[\d\s\-+().]*$/.test(phone)
  ) {
    websiteIngestThrow_(
      "INVALID_PAYLOAD"
    );
  }

  const email =
    requireString("email")
      .toLowerCase();

  if (
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i.test(
      email
    )
  ) {
    websiteIngestThrow_(
      "INVALID_PAYLOAD"
    );
  }

  const appointmentReason =
    requireString(
      "appointment_reason"
    );

  const preferredContactMethod =
    requireString(
      "preferred_contact_method"
    );

  if (
    WEBSITE_INGEST_CONTACT_METHODS_
      .indexOf(
        preferredContactMethod
      ) === -1
  ) {
    websiteIngestThrow_(
      "INVALID_PAYLOAD"
    );
  }

  const preferredContactTime =
    requireString(
      "preferred_contact_time"
    );

  if (
    typeof payload.sms_consent !==
    "boolean"
  ) {
    websiteIngestThrow_(
      "INVALID_PAYLOAD"
    );
  }

  const message =
    requireString("message", {
      allowEmpty: true,
    });

  const pageName =
    requireString("page_name");

  const sourcePath =
    requireString("source_path");

  function optionalUtm(
    fieldName
  ) {
    if (
      payload[fieldName] ===
        undefined ||
      payload[fieldName] === null
    ) {
      return "";
    }

    return requireString(
      fieldName,
      {
        allowEmpty: true,
      }
    );
  }

  return {
    first_name: firstName,
    last_name: lastName,
    phone: phone,
    email: email,
    appointment_reason:
      appointmentReason,
    preferred_contact_method:
      preferredContactMethod,
    preferred_contact_time:
      preferredContactTime,
    sms_consent: Boolean(
      payload.sms_consent
    ),
    message: message,
    page_name: pageName,
    source_path: sourcePath,
    utm_source: optionalUtm(
      "utm_source"
    ),
    utm_medium: optionalUtm(
      "utm_medium"
    ),
    utm_campaign: optionalUtm(
      "utm_campaign"
    ),
  };
}


function getWebsiteIngestHmacSecret_() {
  const secret =
    PropertiesService
      .getScriptProperties()
      .getProperty(
        WEBSITE_INGEST_HMAC_SECRET_PROPERTY_
      );

  if (
    !secret ||
    !String(secret).trim()
  ) {
    websiteIngestThrow_(
      "AUTH_FAILED"
    );
  }

  return String(secret);
}


/**
 * Narrow ScriptLock around ledger lookup, claim, row
 * allocate, write, and init. Auth, HMAC, timestamp,
 * DTO validation, and fingerprinting are already done.
 * Do not render Board or Dashboard while this lock is held.
 */
function withWebsiteIngestMutationLock_(
  callback
) {
  const lock =
    LockService.getScriptLock();

  if (
    !lock.tryLock(
      WEBSITE_INGEST_LOCK_WAIT_MS_
    )
  ) {
    return {
      lockTimeout: true,
    };
  }

  try {
    return callback();

  } finally {
    try {
      lock.releaseLock();
    } catch (error) {
      // Avoid leaking lock-release details to clients.
    }
  }
}


/**
 * Canonical website lead create. Caller holds ScriptLock.
 * context.fingerprint is the bare sha256 hex of
 * submission_id + "\n" + canonical payload JSON.
 */
function ingestWebsiteLead_(
  dto,
  context
) {
  const submissionId =
    String(
      context &&
        context.submissionId ||
        ""
    ).trim();

  const fingerprint =
    String(
      context &&
        context.fingerprint ||
        ""
    )
      .trim()
      .toLowerCase();

  if (
    !submissionId ||
    !/^[0-9a-f]{64}$/.test(
      fingerprint
    )
  ) {
    websiteIngestThrow_(
      "INGEST_FAILED"
    );
  }

  const ledger =
    requireWebsiteIngestLedger_();

  const rows =
    findWebsiteIngestLedgerRows_(
      ledger.sheet,
      ledger.headerMap,
      submissionId
    );

  if (rows.length > 1) {
    return websiteIngestFailedResult_(
      "INGEST_FAILED",
      "",
      0
    );
  }

  if (rows.length === 1) {
    const record =
      readWebsiteIngestLedgerRecord_(
        ledger.sheet,
        ledger.headerMap,
        rows[0]
      );

    return handleExistingWebsiteIngest_(
      ledger,
      rows[0],
      record,
      dto,
      fingerprint
    );
  }

  const claimed =
    claimNewWebsiteIngest_(
      ledger,
      submissionId,
      fingerprint
    );

  return createReservedWebsiteLead_(
    ledger,
    claimed,
    dto
  );
}


function writeWebsiteLeadIntakeRow_(
  sheet,
  row,
  headerMap,
  dto
) {
  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "intake_source",
    "Website"
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "first_name",
    dto.first_name
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "last_name",
    dto.last_name
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "phone",
    dto.phone
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "email",
    dto.email
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "appointment_reason",
    dto.appointment_reason
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "preferred_contact_method",
    dto.preferred_contact_method
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "preferred_contact_time",
    dto.preferred_contact_time
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "sms_consent",
    Boolean(dto.sms_consent)
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "message",
    dto.message
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "page_name",
    dto.page_name
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "source_path",
    dto.source_path
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "utm_source",
    dto.utm_source || ""
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "utm_medium",
    dto.utm_medium || ""
  );

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "utm_campaign",
    dto.utm_campaign || ""
  );
}


/**
 * Clears only website intake columns so the row
 * remains reusable when lead_id was never assigned.
 */
function clearWebsiteLeadIntakeRow_(
  sheet,
  row,
  headerMap
) {
  for (
    let index = 0;
    index <
      WEBSITE_INGEST_INTAKE_COLUMNS_
        .length;
    index++
  ) {
    const headerName =
      WEBSITE_INGEST_INTAKE_COLUMNS_[
        index
      ];

    const column =
      headerMap[headerName];

    if (!column) {
      continue;
    }

    /*
     * Blank, including sms_consent. Checkbox
     * validation stays. A stored FALSE would keep
     * this unused row inside getLastRow().
     */
    sheet
      .getRange(row, column)
      .setValue("");
  }
}


/**
 * Non-PHI operational log for DEV ingest.
 */
function logWebsiteIngestEvent_(
  submissionId,
  code,
  leadId,
  elapsedMs,
  meta
) {
  try {
    const details = meta || {};
    let line =
      "[website-ingest]" +
      " env=" +
      websiteIngestEnvLabelForLog_() +
      " submission_id=" +
      String(
        submissionId || ""
      ) +
      " code=" +
      String(code || "") +
      " lead_id=" +
      String(leadId || "") +
      " elapsedMs=" +
      String(
        Number(elapsedMs) || 0
      );

    if (details.state) {
      line +=
        " state=" +
        String(details.state);
    }

    if (
      details.attempt_count !==
        undefined &&
      details.attempt_count !== ""
    ) {
      line +=
        " attempt_count=" +
        String(
          details.attempt_count
        );
    }

    if (
      details.replayed === true ||
      details.replayed === false
    ) {
      line +=
        " replayed=" +
        (
          details.replayed
            ? "true"
            : "false"
        );
    }

    if (
      typeof details.reason ===
        "string" &&
      /^[a-z0-9_]{1,40}$/.test(
        details.reason
      )
    ) {
      line +=
        " reason=" +
        details.reason;
    }

    console.log(line);
  } catch (error) {
    // Logging must never fail the request.
  }
}


/**
 * DEV helper: build a signed ingest envelope for
 * fake-data Web App testing (Script Editor / curl).
 * Does not log the secret or patient-like fields
 * beyond what you pass in.
 */
function devBuildSignedWebsiteIngestEnvelope_(
  payload,
  options
) {
  const opts = options || {};

  const timestamp =
    opts.timestamp ||
    new Date().toISOString();

  const submissionId =
    opts.submission_id ||
    Utilities.getUuid();

  const version =
    WEBSITE_INGEST_API_VERSION_;

  const secret =
    getWebsiteIngestHmacSecret_();

  const signingString =
    buildWebsiteIngestSigningString_(
      version,
      timestamp,
      submissionId,
      payload
    );

  const signature =
    hmacSha256Hex_(
      signingString,
      secret
    );

  return {
    version: version,
    timestamp: timestamp,
    submission_id: submissionId,
    payload: payload,
    signature: signature,
  };
}


/**
 * DEV helper: sample fake payload for ingest tests.
 */
function devSampleWebsiteLeadPayload_() {
  return {
    first_name: "Fake",
    last_name: "Patient",
    phone: "2105550100",
    email: "fake.patient@example.com",
    appointment_reason: "General Urology",
    preferred_contact_method: "Phone",
    preferred_contact_time: "Morning",
    sms_consent: true,
    message: "DEV Phase 7B fake lead only.",
    page_name: "Home",
    source_path: "/",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
  };
}


/**
 * DEV helper: run ingest locally through doPost
 * without HTTP (valid signed fake lead).
 * Run from Apps Script editor.
 */
function devRunWebsiteIngestSelfTest_() {
  requireWebsiteIngestDev_(
    "devRunWebsiteIngestSelfTest_"
  );

  if (
    !SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        WEBSITE_INGEST_LEDGER_SHEET_NAME_
      )
  ) {
    throw new Error(
      "Run setupWebsiteIngestLedger() once before website ingest tests."
    );
  }

  const envelope =
    devBuildSignedWebsiteIngestEnvelope_(
      devSampleWebsiteLeadPayload_()
    );

  const output = doPost({
    postData: {
      contents: JSON.stringify(
        envelope
      ),
      type: "application/json",
    },
  });

  const text =
    output.getContent();

  console.log(
    "[website-ingest-self-test] " +
      text
  );

  return JSON.parse(text);
}


/**
 * Public Run-menu wrapper for the private DEV self-test helper.
 */
function devRunWebsiteIngestSelfTest() {
  requireWebsiteIngestDev_(
    "devRunWebsiteIngestSelfTest"
  );

  return devRunWebsiteIngestSelfTest_();
}


/*
 * ============================================================================
 * PHASE 7E — WebsiteIngestLedger
 * ============================================================================
 *
 * Fingerprint algorithm (bare digest, never logged or returned):
 *   canonical = canonicalJsonStringify_(envelope.payload)
 *   material  = submission_id + "\n" + canonical
 *   digest    = lowercase hex SHA-256 of the UTF-8 material
 * The canonical JSON is the same string already used in the HMAC signing
 * bytes. The digest does not include the timestamp, signature, or secret.
 *
 * Sheet cell value is "sha256:" + digest so Google Sheets cannot coerce
 * the hex into a number. The prefix is storage-only.
 *
 * Crash windows, all under ScriptLock:
 *   W0  Before the ledger setValues returns: no ledger row, no Lead.
 *       A resend starts a new claim. Nothing was committed.
 *   W1  Ledger row flushed with PROCESSING + lead_id, no Leads write yet.
 *       Resume reuses that lead_id. It does not generate another.
 *   W2  Intake written, lead_id cell still blank.
 *       Classify clears only that intake and marks CLEAN_FAILED.
 *       Resume reuses the reserved lead_id.
 *   W3  lead_id cell flushed, lead_created not proven.
 *       Classify/resume marks PARTIAL_COMMIT and does not call
 *       initializeLeadRow_ again.
 *   W4  Exactly one Leads row and exactly one lead_created exist, ledger
 *       not yet SUCCESS. Resume marks SUCCESS and does not append another
 *       activity. Dirty flags are registered before SUCCESS is saved, so a
 *       pure SUCCESS replay does not need to mark views dirty.
 *   W5  Ledger already SUCCESS. Replay returns the same lead_id.
 *
 * initializeLeadRow_ appends lead_created only after every system field
 * write, and only when that row's lead_id cell was blank. A reserved id
 * that is already on a row is never passed to initializeLeadRow_ again.
 * A supplied options.leadId that does not match the LEAD-UUID pattern
 * throws inside resolveInitializeLeadId_. It is never replaced with
 * generateSystemId_("LEAD"). Omitting leadId still generates one.
 *
 * Normal ingest does not create this sheet. Run setupWebsiteIngestLedger
 * once. Patient requests must not add workbook structure implicitly.
 *
 * DEV failure injection stays in this file and
 * cannot run unless CRM_INGEST_ENV_LABEL is dev:
 *   Script Property CRM_INGEST_DEV_FAIL_POINT
 *     before_initialize | after_lead_id
 *   Absent, blank, or any other value is off.
 *   Ignored unless the env label is exactly dev.
 *   Never read from the request body, query
 *   string, or a website environment variable.
 *   Leave it unset in production.
 *
 * DEV concurrency URL is not read by doPost:
 *   Script Property CRM_INGEST_DEV_WEB_APP_URL
 *   Read only by devRunWebsiteIngestHttpConcurrencyTestFromProperty.
 *   Not a secret. Do not hardcode it. Do not read it from the request
 *   body. Do not change CRM_INGEST_HMAC_SECRET.
 *   Leave it unset in production.
 */


function buildWebsiteIngestPayloadFingerprint_(
  submissionId,
  payload
) {
  const canonical =
    canonicalJsonStringify_(payload);

  const material =
    String(submissionId) +
    "\n" +
    canonical;

  const digest = sha256Hex_(material);

  if (!/^[0-9a-f]{64}$/.test(digest)) {
    websiteIngestThrow_("INGEST_FAILED");
  }

  return digest;
}


function sha256Hex_(message) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    message,
    Utilities.Charset.UTF_8
  );

  return digestBytesToLowerHex_(bytes);
}


function digestBytesToLowerHex_(bytes) {
  const hex = [];

  for (let index = 0; index < bytes.length; index++) {
    let byte = bytes[index];

    if (byte < 0) {
      byte += 256;
    }

    const part = byte.toString(16);
    hex.push(part.length === 1 ? "0" + part : part);
  }

  return hex.join("");
}


function websiteIngestBareFingerprint_(stored) {
  let text = String(stored || "").trim().toLowerCase();
  const prefix = WEBSITE_INGEST_FINGERPRINT_PREFIX_;

  while (text.indexOf(prefix) === 0) {
    text = text.substring(prefix.length);
  }

  return text;
}


function websiteIngestStoredFingerprint_(hex) {
  const bare = websiteIngestBareFingerprint_(hex);
  return WEBSITE_INGEST_FINGERPRINT_PREFIX_ + bare;
}


/**
 * DEV ONLY. Honored only when CRM_INGEST_ENV_LABEL
 * is dev and CRM_INGEST_DEV_FAIL_POINT equals point.
 * Prod, missing, and malformed labels return
 * without reading a request field. Default is off.
 */
function maybeWebsiteIngestDevFail_(point) {
  if (
    websiteIngestEnvLabel_() !== "dev"
  ) {
    return;
  }

  let configured = "";

  try {
    configured =
      PropertiesService
        .getScriptProperties()
        .getProperty(
          WEBSITE_INGEST_DEV_FAIL_PROPERTY_
        ) || "";
  } catch (error) {
    return;
  }

  if (String(configured).trim() !== point) {
    return;
  }

  const error = new Error("DEV_FAIL");
  error.websiteIngestDevFail = point;
  throw error;
}


function websiteIngestLogMeta_(result) {
  const source = result || {};
  const meta = {
    state: websiteIngestSafeState_(source.state),
    attempt_count: source.attempt_count,
  };

  if (
    source.replayed === true ||
    source.replayed === false
  ) {
    meta.replayed = source.replayed === true;
  }

  return meta;
}


function websiteIngestSafeState_(value) {
  const text = String(value || "").trim();

  if (/^[A-Z0-9_]{1,32}$/.test(text)) {
    return text;
  }

  return "";
}


function websiteIngestFailedResult_(
  code,
  state,
  attemptCount
) {
  return {
    ok: false,
    code: code,
    state: websiteIngestSafeState_(state),
    attempt_count: Number(attemptCount) || 0,
  };
}


function websiteIngestTimeMs_(value) {
  if (
    Object.prototype.toString.call(value) ===
      "[object Date]" &&
    !isNaN(value.getTime())
  ) {
    return value.getTime();
  }

  const parsed = Date.parse(String(value || ""));

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}


function websiteIngestClaimAgeMs_(lastSeen) {
  const seenMs = websiteIngestTimeMs_(lastSeen);

  if (seenMs === null) {
    return null;
  }

  return Date.now() - seenMs;
}


function websiteIngestCacheGet_(key) {
  try {
    return CacheService.getScriptCache().get(key);
  } catch (error) {
    return null;
  }
}


function websiteIngestCachePut_(key, value) {
  try {
    CacheService
      .getScriptCache()
      .put(
        key,
        String(value),
        WEBSITE_INGEST_LEDGER_CACHE_TTL_SECONDS_
      );
  } catch (error) {
    // The sheet remains the source of truth.
  }
}


function websiteIngestCacheRemove_(key) {
  try {
    CacheService.getScriptCache().remove(key);
  } catch (error) {
    // Ignore cache maintenance failures.
  }
}


/**
 * One-time, idempotent ledger setup. Does not clear existing rows.
 * Ingest will not create this sheet on a patient request.
 */
function setupWebsiteIngestLedger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(
    WEBSITE_INGEST_LEDGER_SHEET_NAME_
  );
  let created = false;

  if (!sheet) {
    sheet = ss.insertSheet(
      WEBSITE_INGEST_LEDGER_SHEET_NAME_,
      ss.getNumSheets()
    );
    sheet
      .getRange(
        1,
        1,
        1,
        WEBSITE_INGEST_LEDGER_HEADERS_.length
      )
      .setValues([
        WEBSITE_INGEST_LEDGER_HEADERS_.slice(),
      ]);
    sheet.setFrozenRows(1);
    created = true;
  } else if (!websiteIngestLedgerHeadersMatch_(sheet)) {
    throw new Error(
      "WebsiteIngestLedger headers do not match Phase 7E. Existing rows were not modified."
    );
  }

  const fingerprintColumn =
    WEBSITE_INGEST_LEDGER_HEADERS_.indexOf(
      "payload_fingerprint"
    ) + 1;
  const submissionColumn =
    WEBSITE_INGEST_LEDGER_HEADERS_.indexOf(
      "submission_id"
    ) + 1;

  if (sheet.getMaxRows() >= 2) {
    sheet
      .getRange(
        2,
        fingerprintColumn,
        sheet.getMaxRows() - 1,
        1
      )
      .setNumberFormat("@");
    sheet
      .getRange(
        2,
        submissionColumn,
        sheet.getMaxRows() - 1,
        1
      )
      .setNumberFormat("@");
  }

  let hidden = sheet.isSheetHidden();
  let hideWarning = "";

  try {
    if (!hidden) {
      sheet.hideSheet();
    }
    hidden = sheet.isSheetHidden();
  } catch (error) {
    hideWarning = "Ledger sheet could not be hidden.";
  }

  const protection =
    ensureBackendGuardProtection_(sheet);

  const result = {
    ok: true,
    created: created,
    hidden: hidden,
    warningProtected:
      protection.created === true ||
      protection.alreadyProtected === true,
  };

  if (hideWarning) {
    result.warning = hideWarning;
  } else if (protection.warning) {
    result.warning = String(protection.warning);
  }

  return result;
}


function websiteIngestLedgerHeadersMatch_(sheet) {
  const width =
    WEBSITE_INGEST_LEDGER_HEADERS_.length;

  if (sheet.getLastColumn() !== width) {
    return false;
  }

  const actual = sheet
    .getRange(1, 1, 1, width)
    .getDisplayValues()[0];

  for (let index = 0; index < width; index++) {
    if (
      String(actual[index]).trim() !==
      WEBSITE_INGEST_LEDGER_HEADERS_[index]
    ) {
      return false;
    }
  }

  return true;
}


function requireWebsiteIngestLedger_() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(
      WEBSITE_INGEST_LEDGER_SHEET_NAME_
    );

  if (
    !sheet ||
    !websiteIngestLedgerHeadersMatch_(sheet)
  ) {
    try {
      console.log(
        "[website-ingest]" +
          " env=" +
          websiteIngestEnvLabelForLog_() +
          " code=INGEST_FAILED" +
          " reason=ledger_unavailable"
      );
    } catch (error) {
      // Logging must not replace the ingest error.
    }

    websiteIngestThrow_("INGEST_FAILED");
  }

  return {
    sheet: sheet,
    headerMap: getHeaderMap_(
      WEBSITE_INGEST_LEDGER_SHEET_NAME_
    ),
  };
}


function findWebsiteIngestLedgerRows_(
  sheet,
  headerMap,
  submissionId
) {
  const column = headerMap.submission_id;
  const cachedRow =
    websiteIngestCachedLedgerRow_(
      sheet,
      column,
      submissionId
    );

  if (cachedRow) {
    return [cachedRow];
  }

  const rows = findExactColumnRows_(
    sheet,
    column,
    submissionId
  );

  if (rows.length === 1) {
    websiteIngestCachePut_(
      WEBSITE_INGEST_LEDGER_CACHE_PREFIX_ +
        submissionId,
      rows[0]
    );
  }

  return rows;
}


function websiteIngestCachedLedgerRow_(
  sheet,
  column,
  submissionId
) {
  const cached = websiteIngestCacheGet_(
    WEBSITE_INGEST_LEDGER_CACHE_PREFIX_ +
      submissionId
  );
  const rowNumber = Number(cached);

  if (!rowNumber || rowNumber < 2) {
    return 0;
  }

  const cell = String(
    sheet.getRange(rowNumber, column).getDisplayValue() ||
      ""
  ).trim();

  if (cell !== submissionId) {
    return 0;
  }

  return rowNumber;
}


function findExactColumnRows_(
  sheet,
  column,
  expected
) {
  const needle = String(expected || "").trim();

  if (!needle || !sheet || !column) {
    return [];
  }

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return [];
  }

  const values = sheet
    .getRange(2, column, lastRow - 1, 1)
    .getDisplayValues();
  const rows = [];

  for (let index = 0; index < values.length; index++) {
    if (String(values[index][0]).trim() === needle) {
      rows.push(index + 2);
    }
  }

  return rows;
}


function readWebsiteIngestLedgerRecord_(
  sheet,
  headerMap,
  row
) {
  const width = Math.max(
    sheet.getLastColumn(),
    WEBSITE_INGEST_LEDGER_HEADERS_.length
  );
  const values = sheet
    .getRange(row, 1, 1, width)
    .getValues()[0];
  const record = { row: row };

  for (
    let index = 0;
    index < WEBSITE_INGEST_LEDGER_HEADERS_.length;
    index++
  ) {
    const name = WEBSITE_INGEST_LEDGER_HEADERS_[index];
    const column = headerMap[name];
    record[name] = column ? values[column - 1] : "";
  }

  record.submission_id = String(
    record.submission_id || ""
  ).trim();
  record.payload_fingerprint =
    websiteIngestBareFingerprint_(
      record.payload_fingerprint
    );
  record.state = String(record.state || "").trim();
  record.lead_id = String(record.lead_id || "").trim();
  record.last_result_code = String(
    record.last_result_code || ""
  ).trim();

  const attempt = Number(record.attempt_count);
  record.attempt_count = Number.isFinite(attempt)
    ? attempt
    : 0;

  return record;
}


function draftWebsiteIngestLedgerRecord_(record) {
  return {
    submission_id: record.submission_id,
    payload_fingerprint: record.payload_fingerprint,
    state: record.state,
    lead_id: record.lead_id || "",
    first_seen_at: record.first_seen_at || "",
    last_seen_at: record.last_seen_at || "",
    completed_at: record.completed_at || "",
    attempt_count: Number(record.attempt_count) || 0,
    last_result_code: record.last_result_code || "",
    row: record.row,
  };
}


function saveWebsiteIngestLedgerRecord_(
  sheet,
  headerMap,
  row,
  record
) {
  const lastColumn = Math.max(
    sheet.getLastColumn(),
    WEBSITE_INGEST_LEDGER_HEADERS_.length
  );
  const rowValues = sheet
    .getRange(row, 1, 1, lastColumn)
    .getValues()[0];
  const fields = {
    submission_id: record.submission_id,
    payload_fingerprint: websiteIngestStoredFingerprint_(
      record.payload_fingerprint
    ),
    state: record.state,
    lead_id: record.lead_id || "",
    first_seen_at: record.first_seen_at || "",
    last_seen_at: record.last_seen_at || "",
    completed_at: record.completed_at || "",
    attempt_count: Number(record.attempt_count) || 0,
    last_result_code: record.last_result_code || "",
  };

  for (
    let index = 0;
    index < WEBSITE_INGEST_LEDGER_HEADERS_.length;
    index++
  ) {
    const name = WEBSITE_INGEST_LEDGER_HEADERS_[index];
    const column = headerMap[name];

    if (!column) {
      websiteIngestThrow_("INGEST_FAILED");
    }

    rowValues[column - 1] = fields[name];
  }

  sheet
    .getRange(row, headerMap.payload_fingerprint)
    .setNumberFormat("@");
  sheet
    .getRange(row, headerMap.submission_id)
    .setNumberFormat("@");
  sheet
    .getRange(row, 1, 1, lastColumn)
    .setValues([rowValues]);
}


function handleExistingWebsiteIngest_(
  ledger,
  row,
  record,
  dto,
  fingerprint
) {
  if (
    !secureHexEquals_(
      record.payload_fingerprint,
      fingerprint
    )
  ) {
    return {
      ok: false,
      code: "IDEMPOTENCY_CONFLICT",
      state: websiteIngestSafeState_(record.state),
      attempt_count: record.attempt_count,
    };
  }

  if (
    record.state ===
    WEBSITE_INGEST_LEDGER_STATE_SUCCESS_
  ) {
    return replayWebsiteIngestSuccess_(
      ledger,
      row,
      record
    );
  }

  if (
    record.state ===
    WEBSITE_INGEST_LEDGER_STATE_PARTIAL_
  ) {
    return replayWebsiteIngestPartial_(
      ledger,
      row,
      record
    );
  }

  if (
    record.state ===
    WEBSITE_INGEST_LEDGER_STATE_CLEAN_FAILED_
  ) {
    return retryWebsiteIngestCleanFailed_(
      ledger,
      row,
      record,
      dto
    );
  }

  if (
    record.state ===
    WEBSITE_INGEST_LEDGER_STATE_PROCESSING_
  ) {
    return resumeWebsiteIngestProcessing_(
      ledger,
      row,
      record,
      dto
    );
  }

  return websiteIngestFailedResult_(
    "INGEST_FAILED",
    record.state,
    record.attempt_count
  );
}


function claimNewWebsiteIngest_(
  ledger,
  submissionId,
  fingerprint
) {
  const leadId = generateSystemId_("LEAD");

  if (!WEBSITE_INGEST_LEAD_ID_PATTERN_.test(leadId)) {
    websiteIngestThrow_("INGEST_FAILED");
  }

  const row = findFirstEmptyDataRow_(
    ledger.sheet,
    ledger.headerMap.submission_id
  );
  const now = new Date();
  const record = {
    submission_id: submissionId,
    payload_fingerprint: fingerprint,
    state: WEBSITE_INGEST_LEDGER_STATE_PROCESSING_,
    lead_id: leadId,
    first_seen_at: now,
    last_seen_at: now,
    completed_at: "",
    attempt_count: 1,
    last_result_code: "",
    row: row,
  };

  // lead_id is durable on the ledger before any Leads cell is written.
  saveWebsiteIngestLedgerRecord_(
    ledger.sheet,
    ledger.headerMap,
    row,
    record
  );
  websiteIngestCachePut_(
    WEBSITE_INGEST_LEDGER_CACHE_PREFIX_ + submissionId,
    row
  );
  SpreadsheetApp.flush();

  return record;
}


function reopenWebsiteIngestProcessing_(
  ledger,
  row,
  record,
  leadId
) {
  const reserved = String(leadId || "").trim();

  if (!WEBSITE_INGEST_LEAD_ID_PATTERN_.test(reserved)) {
    websiteIngestThrow_("INGEST_FAILED");
  }

  const next = draftWebsiteIngestLedgerRecord_(record);
  next.state = WEBSITE_INGEST_LEDGER_STATE_PROCESSING_;
  next.lead_id = reserved;
  next.attempt_count =
    (Number(record.attempt_count) || 0) + 1;
  next.last_seen_at = new Date();
  next.last_result_code = "";
  next.completed_at = "";
  next.row = row;

  saveWebsiteIngestLedgerRecord_(
    ledger.sheet,
    ledger.headerMap,
    row,
    next
  );
  websiteIngestCachePut_(
    WEBSITE_INGEST_LEDGER_CACHE_PREFIX_ +
      record.submission_id,
    row
  );
  SpreadsheetApp.flush();

  return next;
}


function replayWebsiteIngestSuccess_(
  ledger,
  row,
  record
) {
  if (!record.lead_id) {
    return websiteIngestFailedResult_(
      "INGEST_FAILED",
      record.state,
      record.attempt_count
    );
  }

  touchWebsiteIngestLastSeen_(ledger, row, record);

  return {
    ok: true,
    lead_id: record.lead_id,
    replayed: true,
    state: WEBSITE_INGEST_LEDGER_STATE_SUCCESS_,
    attempt_count: record.attempt_count,
  };
}


function replayWebsiteIngestPartial_(
  ledger,
  row,
  record
) {
  if (!record.lead_id) {
    touchWebsiteIngestLastSeen_(ledger, row, record);
    return {
      ok: false,
      code: "PARTIAL_COMMIT",
      state: WEBSITE_INGEST_LEDGER_STATE_PARTIAL_,
      attempt_count: record.attempt_count,
    };
  }

  let proof = null;

  try {
    proof = inspectWebsiteReservedLead_(
      record.lead_id
    );
  } catch (inspectError) {
    proof = null;
  }

  if (
    proof &&
    proof.leadRows === 1 &&
    proof.leadCreated === 1
  ) {
    return commitWebsiteIngestSuccess_(
      ledger,
      row,
      record,
      record.lead_id,
      true
    );
  }

  touchWebsiteIngestLastSeen_(ledger, row, record);

  return {
    ok: false,
    code: "PARTIAL_COMMIT",
    lead_id: record.lead_id,
    state: WEBSITE_INGEST_LEDGER_STATE_PARTIAL_,
    attempt_count: record.attempt_count,
  };
}


function retryWebsiteIngestCleanFailed_(
  ledger,
  row,
  record,
  dto
) {
  const leadId = String(record.lead_id || "").trim();

  if (leadId) {
    const proof = inspectWebsiteReservedLead_(leadId);

    if (
      proof.leadRows > 0 ||
      proof.leadCreated > 0
    ) {
      return reconcileWebsiteReservedLead_(
        ledger,
        row,
        record,
        proof
      );
    }
  }

  const reopened = reopenWebsiteIngestProcessing_(
    ledger,
    row,
    record,
    leadId || generateSystemId_("LEAD")
  );

  return createReservedWebsiteLead_(
    ledger,
    reopened,
    dto
  );
}


function resumeWebsiteIngestProcessing_(
  ledger,
  row,
  record,
  dto
) {
  if (!record.lead_id) {
    const ageMs = websiteIngestClaimAgeMs_(
      record.last_seen_at
    );
    const fresh =
      ageMs !== null &&
      ageMs < WEBSITE_INGEST_STALE_PROCESSING_MS_;

    if (fresh) {
      return {
        ok: false,
        code: "LOCK_TIMEOUT",
        state: WEBSITE_INGEST_LEDGER_STATE_PROCESSING_,
        attempt_count: record.attempt_count,
      };
    }

    const reopened = reopenWebsiteIngestProcessing_(
      ledger,
      row,
      record,
      generateSystemId_("LEAD")
    );

    return createReservedWebsiteLead_(
      ledger,
      reopened,
      dto
    );
  }

  let proof;

  try {
    proof = inspectWebsiteReservedLead_(
      record.lead_id
    );
  } catch (error) {
    return websiteIngestFailedResult_(
      "INGEST_FAILED",
      WEBSITE_INGEST_LEDGER_STATE_PROCESSING_,
      record.attempt_count
    );
  }

  if (
    proof.leadRows === 0 &&
    proof.leadCreated === 0
  ) {
    const reopened = reopenWebsiteIngestProcessing_(
      ledger,
      row,
      record,
      record.lead_id
    );

    return createReservedWebsiteLead_(
      ledger,
      reopened,
      dto
    );
  }

  return reconcileWebsiteReservedLead_(
    ledger,
    row,
    record,
    proof
  );
}


function reconcileWebsiteReservedLead_(
  ledger,
  row,
  record,
  proof
) {
  if (
    proof &&
    proof.leadRows === 1 &&
    proof.leadCreated === 1 &&
    record.lead_id
  ) {
    return commitWebsiteIngestSuccess_(
      ledger,
      row,
      record,
      record.lead_id,
      true
    );
  }

  const invalidate =
    record.state !==
    WEBSITE_INGEST_LEDGER_STATE_PARTIAL_;

  return commitWebsiteIngestPartial_(
    ledger,
    row,
    record,
    record.lead_id,
    invalidate
  );
}


function createReservedWebsiteLead_(
  ledger,
  record,
  dto
) {
  const leadId = String(record.lead_id || "").trim();

  if (!WEBSITE_INGEST_LEAD_ID_PATTERN_.test(leadId)) {
    websiteIngestThrow_("INGEST_FAILED");
  }

  const proof = inspectWebsiteReservedLead_(leadId);

  if (
    proof.leadRows > 0 ||
    proof.leadCreated > 0
  ) {
    return reconcileWebsiteReservedLead_(
      ledger,
      record.row,
      record,
      proof
    );
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Leads");

  if (!sheet) {
    websiteIngestThrow_("INGEST_FAILED");
  }

  const headerMap = getHeaderMap_("Leads");
  const leadRow = findFirstEmptyDataRow_(
    sheet,
    headerMap.lead_id
  );

  writeWebsiteLeadIntakeRow_(
    sheet,
    leadRow,
    headerMap,
    dto
  );

  try {
    maybeWebsiteIngestDevFail_("before_initialize");

    const createdId = initializeLeadRow_(
      leadRow,
      {
        source: "Website",
        leadId: leadId,
      }
    );

    if (String(createdId || "").trim() !== leadId) {
      return classifyWebsiteInitFailure_(
        ledger,
        record,
        sheet,
        leadRow,
        headerMap,
        leadId
      );
    }

    return commitWebsiteIngestSuccess_(
      ledger,
      record.row,
      record,
      leadId,
      false
    );
  } catch (error) {
    return classifyWebsiteInitFailure_(
      ledger,
      record,
      sheet,
      leadRow,
      headerMap,
      leadId
    );
  }
}


function classifyWebsiteInitFailure_(
  ledger,
  record,
  sheet,
  leadRow,
  headerMap,
  reservedLeadId
) {
  const leadCell = sheet.getRange(
    leadRow,
    headerMap.lead_id
  );
  const existingId = String(
    leadCell.getDisplayValue() ||
      leadCell.getValue() ||
      ""
  ).trim();

  if (!existingId) {
    try {
      clearWebsiteLeadIntakeRow_(
        sheet,
        leadRow,
        headerMap
      );
    } catch (clearError) {
      SpreadsheetApp.flush();
      return websiteIngestFailedResult_(
        "INGEST_FAILED",
        WEBSITE_INGEST_LEDGER_STATE_PROCESSING_,
        record.attempt_count
      );
    }

    invalidateCanonicalSheetTable_("Leads");
    return markWebsiteIngestCleanFailed_(
      ledger,
      record
    );
  }

  if (existingId !== reservedLeadId) {
    return markWebsiteIngestCleanFailed_(
      ledger,
      record
    );
  }

  SpreadsheetApp.flush();

  let proof = {
    leadRows: 1,
    leadCreated: 0,
  };

  try {
    proof = inspectWebsiteReservedLead_(
      reservedLeadId
    );
  } catch (inspectError) {
    proof = {
      leadRows: 1,
      leadCreated: 0,
    };
  }

  if (
    proof.leadRows === 1 &&
    proof.leadCreated === 1
  ) {
    return commitWebsiteIngestSuccess_(
      ledger,
      record.row,
      record,
      reservedLeadId,
      false
    );
  }

  return commitWebsiteIngestPartial_(
    ledger,
    record.row,
    record,
    reservedLeadId,
    true
  );
}


function markWebsiteIngestCleanFailed_(
  ledger,
  record
) {
  const next = draftWebsiteIngestLedgerRecord_(record);
  next.state = WEBSITE_INGEST_LEDGER_STATE_CLEAN_FAILED_;
  next.last_result_code = "INGEST_FAILED";
  next.last_seen_at = new Date();
  next.completed_at = "";

  saveWebsiteIngestLedgerRecord_(
    ledger.sheet,
    ledger.headerMap,
    record.row,
    next
  );
  invalidateCanonicalSheetTable_("Leads");
  SpreadsheetApp.flush();

  return {
    ok: false,
    code: "INGEST_FAILED",
    state: WEBSITE_INGEST_LEDGER_STATE_CLEAN_FAILED_,
    attempt_count: next.attempt_count,
  };
}


function commitWebsiteIngestSuccess_(
  ledger,
  row,
  record,
  leadId,
  replayed
) {
  try {
    invalidateLeadRowSnapshot_(leadId);
  } catch (snapshotError) {
    invalidateCanonicalSheetTable_("Leads");
  }

  registerDerivedViewDirtyFlags_({
    board: true,
    dashboard: true,
  });

  const next = draftWebsiteIngestLedgerRecord_(record);
  next.lead_id = leadId;
  next.state = WEBSITE_INGEST_LEDGER_STATE_SUCCESS_;
  next.last_result_code = "OK";
  next.last_seen_at = new Date();

  if (!next.completed_at) {
    next.completed_at = next.last_seen_at;
  }

  saveWebsiteIngestLedgerRecord_(
    ledger.sheet,
    ledger.headerMap,
    row,
    next
  );
  SpreadsheetApp.flush();

  return {
    ok: true,
    lead_id: leadId,
    replayed: replayed === true,
    state: WEBSITE_INGEST_LEDGER_STATE_SUCCESS_,
    attempt_count: next.attempt_count,
  };
}


function commitWebsiteIngestPartial_(
  ledger,
  row,
  record,
  leadId,
  invalidate
) {
  if (invalidate && leadId) {
    try {
      invalidateLeadRowSnapshot_(leadId);
    } catch (snapshotError) {
      invalidateCanonicalSheetTable_("Leads");
    }
  }

  const next = draftWebsiteIngestLedgerRecord_(record);
  next.lead_id = leadId || "";
  next.state = WEBSITE_INGEST_LEDGER_STATE_PARTIAL_;
  next.last_result_code = "PARTIAL_COMMIT";
  next.last_seen_at = new Date();

  saveWebsiteIngestLedgerRecord_(
    ledger.sheet,
    ledger.headerMap,
    row,
    next
  );
  SpreadsheetApp.flush();

  const result = {
    ok: false,
    code: "PARTIAL_COMMIT",
    state: WEBSITE_INGEST_LEDGER_STATE_PARTIAL_,
    attempt_count: next.attempt_count,
  };

  if (leadId) {
    result.lead_id = leadId;
  }

  return result;
}


function touchWebsiteIngestLastSeen_(
  ledger,
  row,
  record
) {
  try {
    const next = draftWebsiteIngestLedgerRecord_(record);
    next.last_seen_at = new Date();
    saveWebsiteIngestLedgerRecord_(
      ledger.sheet,
      ledger.headerMap,
      row,
      next
    );
    SpreadsheetApp.flush();
  } catch (error) {
    // A replay response does not depend on this timestamp.
  }
}


function inspectWebsiteReservedLead_(leadId) {
  const id = String(leadId || "").trim();

  if (!id) {
    return {
      leadRows: 0,
      leadCreated: 0,
    };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const leads = ss.getSheetByName("Leads");
  const activities = ss.getSheetByName("ActivityLog");
  let leadRows = 0;
  let leadCreated = 0;

  if (leads) {
    const leadHeaders = getHeaderMap_("Leads");
    leadRows = findExactColumnRows_(
      leads,
      leadHeaders.lead_id,
      id
    ).length;
  }

  if (activities) {
    const activityHeaders = getHeaderMap_("ActivityLog");
    const activityRows = findExactColumnRows_(
      activities,
      activityHeaders.lead_id,
      id
    );

    for (
      let index = 0;
      index < activityRows.length;
      index++
    ) {
      const activityType = String(
        activities
          .getRange(
            activityRows[index],
            activityHeaders.activity_type
          )
          .getDisplayValue() || ""
      ).trim();

      if (activityType === "lead_created") {
        leadCreated++;
      }
    }
  }

  return {
    leadRows: leadRows,
    leadCreated: leadCreated,
  };
}


function devExecuteWebsiteIngest_(body) {
  const contents =
    typeof body === "string"
      ? body
      : JSON.stringify(body);
  const output = doPost({
    postData: {
      contents: contents,
      type: "application/json",
    },
  });

  return JSON.parse(output.getContent());
}


function devIdempotencyPayload_(label) {
  const payload = devSampleWebsiteLeadPayload_();
  payload.message =
    "DEV Phase 7E case " +
    label +
    " fake lead only.";
  payload.email =
    "fake-7e-" +
    String(label).toLowerCase() +
    "@example.com";
  return payload;
}


function devSafeError_(error) {
  return String(
    error && error.message ? error.message : error || ""
  )
    .replace(/[\r\n]/g, " ")
    .slice(0, 180);
}


function devReadDerivedDirtyFlags_() {
  const props = PropertiesService.getDocumentProperties();

  return {
    board: props.getProperty(
      DERIVED_VIEW_DIRTY_BOARD_KEY_
    ),
    dashboard: props.getProperty(
      DERIVED_VIEW_DIRTY_DASHBOARD_KEY_
    ),
  };
}


function devWriteDerivedDirtyFlags_(saved) {
  const props = PropertiesService.getDocumentProperties();

  if (saved.board === null || saved.board === undefined) {
    props.deleteProperty(DERIVED_VIEW_DIRTY_BOARD_KEY_);
  } else {
    props.setProperty(
      DERIVED_VIEW_DIRTY_BOARD_KEY_,
      saved.board
    );
  }

  if (
    saved.dashboard === null ||
    saved.dashboard === undefined
  ) {
    props.deleteProperty(
      DERIVED_VIEW_DIRTY_DASHBOARD_KEY_
    );
  } else {
    props.setProperty(
      DERIVED_VIEW_DIRTY_DASHBOARD_KEY_,
      saved.dashboard
    );
  }
}


function devSetDerivedDirtyZero_() {
  const props = PropertiesService.getDocumentProperties();
  props.setProperty(DERIVED_VIEW_DIRTY_BOARD_KEY_, "0");
  props.setProperty(
    DERIVED_VIEW_DIRTY_DASHBOARD_KEY_,
    "0"
  );
}


function devDerivedDirtyFlags_() {
  const props = PropertiesService.getDocumentProperties();

  return {
    board:
      props.getProperty(
        DERIVED_VIEW_DIRTY_BOARD_KEY_
      ) === "1",
    dashboard:
      props.getProperty(
        DERIVED_VIEW_DIRTY_DASHBOARD_KEY_
      ) === "1",
  };
}


function devWithFailPoint_(point, fn) {
  requireWebsiteIngestDev_(
    "devWithFailPoint_"
  );

  const props = PropertiesService.getScriptProperties();
  props.setProperty(
    WEBSITE_INGEST_DEV_FAIL_PROPERTY_,
    point
  );

  try {
    return fn();
  } finally {
    props.deleteProperty(
      WEBSITE_INGEST_DEV_FAIL_PROPERTY_
    );
  }
}


function devClearSheetRows_(sheet, rows) {
  const width = Math.max(sheet.getLastColumn(), 1);

  for (let index = 0; index < rows.length; index++) {
    if (rows[index] >= 2) {
      sheet
        .getRange(rows[index], 1, 1, width)
        .clearContent();
    }
  }
}


function devCleanupWebsiteIngestSubmission_(
  submissionId
) {
  requireWebsiteIngestDev_(
    "devCleanupWebsiteIngestSubmission_"
  );

  const id = String(submissionId || "").trim();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ledgerSheet = ss.getSheetByName(
    WEBSITE_INGEST_LEDGER_SHEET_NAME_
  );

  if (!ledgerSheet || !id) {
    return;
  }

  const headerMap = getHeaderMap_(
    WEBSITE_INGEST_LEDGER_SHEET_NAME_
  );
  const ledgerRows = findExactColumnRows_(
    ledgerSheet,
    headerMap.submission_id,
    id
  );
  const leadIds = [];

  for (let index = 0; index < ledgerRows.length; index++) {
    const record = readWebsiteIngestLedgerRecord_(
      ledgerSheet,
      headerMap,
      ledgerRows[index]
    );

    if (
      record.lead_id &&
      leadIds.indexOf(record.lead_id) === -1
    ) {
      leadIds.push(record.lead_id);
    }
  }

  const leads = ss.getSheetByName("Leads");
  const activities = ss.getSheetByName("ActivityLog");

  for (let index = 0; index < leadIds.length; index++) {
    const leadId = leadIds[index];

    if (activities) {
      const activityHeaders = getHeaderMap_(
        "ActivityLog"
      );
      devClearSheetRows_(
        activities,
        findExactColumnRows_(
          activities,
          activityHeaders.lead_id,
          leadId
        )
      );
    }

    if (leads) {
      const leadHeaders = getHeaderMap_("Leads");
      devClearSheetRows_(
        leads,
        findExactColumnRows_(
          leads,
          leadHeaders.lead_id,
          leadId
        )
      );
    }
  }

  devClearSheetRows_(ledgerSheet, ledgerRows);
  websiteIngestCacheRemove_(
    WEBSITE_INGEST_LEDGER_CACHE_PREFIX_ + id
  );
  SpreadsheetApp.flush();
}


function devRunOwnedSubmission_(name, fn) {
  let submissionId = "";
  let pass = false;
  let result = {
    name: name,
    pass: false,
  };

  try {
    const produced = fn({
      setSubmissionId: function (id) {
        submissionId = id;
      },
    });
    submissionId =
      produced.submission_id || submissionId;
    pass = produced.pass === true;
    result = produced;
    result.name = name;
  } catch (error) {
    pass = false;
    result = {
      name: name,
      pass: false,
      submission_id: submissionId,
      error: devSafeError_(error),
    };
  } finally {
    if (pass && submissionId) {
      try {
        devCleanupWebsiteIngestSubmission_(
          submissionId
        );
      } catch (cleanupError) {
        pass = false;
        result = {
          name: name,
          pass: false,
          submission_id: submissionId,
          error: "cleanup_failed",
        };
      }
    }
  }

  if (!pass) {
    result.left_in_place = true;
  }

  return result;
}


function devIdempotencyCaseA_() {
  return devRunOwnedSubmission_(
    "A_first_success",
    function (ctx) {
      const envelope =
        devBuildSignedWebsiteIngestEnvelope_(
          devIdempotencyPayload_("A")
        );
      ctx.setSubmissionId(envelope.submission_id);
      devSetDerivedDirtyZero_();

      const first = devExecuteWebsiteIngest_(envelope);
      const counts =
        devInspectWebsiteIngestSubmission(
          envelope.submission_id
        );
      const dirty = devDerivedDirtyFlags_();

      if (first.ok !== true || first.replayed === true) {
        throw new Error(
          "A expected a first success without replayed"
        );
      }

      if (
        !first.lead_id ||
        counts.lead_id !== first.lead_id ||
        counts.ledger_rows !== 1 ||
        counts.lead_rows !== 1 ||
        counts.lead_created_rows !== 1 ||
        counts.state !== "SUCCESS" ||
        counts.attempt_count !== 1
      ) {
        throw new Error(
          "A expected 1 ledger, 1 lead, 1 lead_created"
        );
      }

      if (
        dirty.board !== true ||
        dirty.dashboard !== true
      ) {
        throw new Error(
          "A expected Board and Dashboard dirty flags"
        );
      }

      return {
        pass: true,
        submission_id: envelope.submission_id,
        lead_id: first.lead_id,
        ledger_rows: counts.ledger_rows,
        lead_rows: counts.lead_rows,
        lead_created_rows: counts.lead_created_rows,
        attempt_count: counts.attempt_count,
      };
    }
  );
}


function devIdempotencyCaseB_() {
  return devRunOwnedSubmission_(
    "B_sequential_replay",
    function (ctx) {
      const envelope =
        devBuildSignedWebsiteIngestEnvelope_(
          devIdempotencyPayload_("B")
        );
      const body = JSON.stringify(envelope);
      ctx.setSubmissionId(envelope.submission_id);

      const first = devExecuteWebsiteIngest_(body);

      if (first.ok !== true || !first.lead_id) {
        throw new Error("B first request failed");
      }

      devSetDerivedDirtyZero_();
      const second = devExecuteWebsiteIngest_(body);
      const counts =
        devInspectWebsiteIngestSubmission(
          envelope.submission_id
        );
      const dirty = devDerivedDirtyFlags_();

      if (
        second.ok !== true ||
        second.replayed !== true ||
        second.lead_id !== first.lead_id
      ) {
        throw new Error(
          "B replay did not return the same lead"
        );
      }

      if (
        counts.ledger_rows !== 1 ||
        counts.lead_rows !== 1 ||
        counts.lead_created_rows !== 1 ||
        counts.state !== "SUCCESS"
      ) {
        throw new Error(
          "B expected 1 ledger, 1 lead, 1 lead_created"
        );
      }

      if (
        dirty.board !== false ||
        dirty.dashboard !== false
      ) {
        throw new Error(
          "B replay marked derived views dirty"
        );
      }

      return {
        pass: true,
        submission_id: envelope.submission_id,
        lead_id: first.lead_id,
        ledger_rows: 1,
        lead_rows: 1,
        lead_created_rows: 1,
      };
    }
  );
}


function devIdempotencyCaseD_() {
  return devRunOwnedSubmission_(
    "D_payload_conflict",
    function (ctx) {
      const firstEnvelope =
        devBuildSignedWebsiteIngestEnvelope_(
          devIdempotencyPayload_("D")
        );
      ctx.setSubmissionId(firstEnvelope.submission_id);

      const first = devExecuteWebsiteIngest_(
        firstEnvelope
      );
      const conflictEnvelope =
        devBuildSignedWebsiteIngestEnvelope_(
          devIdempotencyPayload_("D2"),
          {
            submission_id: firstEnvelope.submission_id,
            timestamp: firstEnvelope.timestamp,
          }
        );
      const second = devExecuteWebsiteIngest_(
        conflictEnvelope
      );
      const counts =
        devInspectWebsiteIngestSubmission(
          firstEnvelope.submission_id
        );

      if (first.ok !== true || !first.lead_id) {
        throw new Error("D first request failed");
      }

      if (
        second.ok !== false ||
        second.code !== "IDEMPOTENCY_CONFLICT" ||
        second.lead_id
      ) {
        throw new Error(
          "D expected IDEMPOTENCY_CONFLICT without a lead_id"
        );
      }

      if (
        counts.ledger_rows !== 1 ||
        counts.lead_rows !== 1 ||
        counts.lead_created_rows !== 1 ||
        counts.state !== "SUCCESS" ||
        counts.lead_id !== first.lead_id
      ) {
        throw new Error(
          "D conflict changed the original lead"
        );
      }

      return {
        pass: true,
        submission_id: firstEnvelope.submission_id,
        lead_id: first.lead_id,
        ledger_rows: 1,
        lead_rows: 1,
        lead_created_rows: 1,
      };
    }
  );
}


function devIdempotencyCaseE_() {
  return devRunOwnedSubmission_(
    "E_clean_failed_retry",
    function (ctx) {
      const envelope =
        devBuildSignedWebsiteIngestEnvelope_(
          devIdempotencyPayload_("E")
        );
      const body = JSON.stringify(envelope);
      ctx.setSubmissionId(envelope.submission_id);

      const first = devWithFailPoint_(
        "before_initialize",
        function () {
          return devExecuteWebsiteIngest_(body);
        }
      );
      const midway =
        devInspectWebsiteIngestSubmission(
          envelope.submission_id
        );

      if (
        first.ok !== false ||
        first.code !== "INGEST_FAILED" ||
        first.lead_id ||
        midway.ledger_rows !== 1 ||
        midway.lead_rows !== 0 ||
        midway.lead_created_rows !== 0 ||
        midway.state !== "CLEAN_FAILED" ||
        !midway.lead_id
      ) {
        throw new Error(
          "E expected CLEAN_FAILED and no lead row"
        );
      }

      devSetDerivedDirtyZero_();
      const second = devExecuteWebsiteIngest_(body);
      const counts =
        devInspectWebsiteIngestSubmission(
          envelope.submission_id
        );

      if (
        second.ok !== true ||
        second.lead_id !== midway.lead_id ||
        counts.ledger_rows !== 1 ||
        counts.lead_rows !== 1 ||
        counts.lead_created_rows !== 1 ||
        counts.state !== "SUCCESS" ||
        counts.attempt_count !== 2
      ) {
        throw new Error(
          "E retry did not reuse the reserved lead"
        );
      }

      return {
        pass: true,
        submission_id: envelope.submission_id,
        lead_id: second.lead_id,
        ledger_rows: 1,
        lead_rows: 1,
        lead_created_rows: 1,
        attempt_count: 2,
      };
    }
  );
}


function devIdempotencyCaseF_() {
  return devRunOwnedSubmission_(
    "F_partial_commit_replay",
    function (ctx) {
      const envelope =
        devBuildSignedWebsiteIngestEnvelope_(
          devIdempotencyPayload_("F")
        );
      const body = JSON.stringify(envelope);
      ctx.setSubmissionId(envelope.submission_id);
      devSetDerivedDirtyZero_();

      const first = devWithFailPoint_(
        "after_lead_id",
        function () {
          return devExecuteWebsiteIngest_(body);
        }
      );
      const midway =
        devInspectWebsiteIngestSubmission(
          envelope.submission_id
        );
      const dirtyAfterFirst = devDerivedDirtyFlags_();

      if (
        first.ok !== false ||
        first.code !== "PARTIAL_COMMIT" ||
        !first.lead_id ||
        midway.lead_id !== first.lead_id ||
        midway.ledger_rows !== 1 ||
        midway.lead_rows !== 1 ||
        midway.lead_created_rows !== 0 ||
        midway.state !== "PARTIAL_COMMIT" ||
        dirtyAfterFirst.board !== false ||
        dirtyAfterFirst.dashboard !== false
      ) {
        throw new Error(
          "F expected PARTIAL_COMMIT without lead_created"
        );
      }

      const second = devExecuteWebsiteIngest_(body);
      const counts =
        devInspectWebsiteIngestSubmission(
          envelope.submission_id
        );
      const dirtyAfterReplay = devDerivedDirtyFlags_();

      if (
        second.ok !== false ||
        second.code !== "PARTIAL_COMMIT" ||
        second.lead_id !== first.lead_id ||
        counts.ledger_rows !== 1 ||
        counts.lead_rows !== 1 ||
        counts.lead_created_rows !== 0 ||
        counts.state !== "PARTIAL_COMMIT" ||
        dirtyAfterReplay.board !== false ||
        dirtyAfterReplay.dashboard !== false
      ) {
        throw new Error(
          "F replay created another lead or activity"
        );
      }

      return {
        pass: true,
        submission_id: envelope.submission_id,
        lead_id: first.lead_id,
        ledger_rows: 1,
        lead_rows: 1,
        lead_created_rows: 0,
      };
    }
  );
}


function devIdempotencyCaseG_() {
  return devRunOwnedSubmission_(
    "G_timeout_resend",
    function (ctx) {
      const envelope =
        devBuildSignedWebsiteIngestEnvelope_(
          devIdempotencyPayload_("G")
        );
      const body = JSON.stringify(envelope);
      ctx.setSubmissionId(envelope.submission_id);
      const first = devExecuteWebsiteIngest_(body);

      // The client timed out and discarded `first`.
      const second = devExecuteWebsiteIngest_(body);
      const counts =
        devInspectWebsiteIngestSubmission(
          envelope.submission_id
        );

      if (
        first.ok !== true ||
        second.ok !== true ||
        second.replayed !== true ||
        !first.lead_id ||
        second.lead_id !== first.lead_id ||
        counts.ledger_rows !== 1 ||
        counts.lead_rows !== 1 ||
        counts.lead_created_rows !== 1
      ) {
        throw new Error(
          "G resend did not resolve to the original lead"
        );
      }

      return {
        pass: true,
        submission_id: envelope.submission_id,
        lead_id: first.lead_id,
        ledger_rows: 1,
        lead_rows: 1,
        lead_created_rows: 1,
      };
    }
  );
}


function devLeadIdContractCell_(
  sheet,
  headerMap,
  row
) {
  const cell = sheet.getRange(row, headerMap.lead_id);

  return String(
    cell.getDisplayValue() || cell.getValue() || ""
  ).trim();
}


function devLeadIdContractBlankRow_() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Leads");

  if (!sheet) {
    throw new Error("Leads worksheet was not found.");
  }

  const headerMap = getHeaderMap_("Leads");
  const row = findFirstEmptyDataRow_(
    sheet,
    headerMap.lead_id
  );

  if (devLeadIdContractCell_(sheet, headerMap, row)) {
    throw new Error(
      "DEV lead-id contract test could not find a blank Leads row."
    );
  }

  setCellByHeader_(
    sheet,
    row,
    headerMap,
    "first_name",
    "ZZDEV7E"
  );
  SpreadsheetApp.flush();

  return {
    sheet: sheet,
    headerMap: headerMap,
    row: row,
  };
}


function devCleanupInitializedLead_(leadId) {
  const id = String(leadId || "").trim();

  if (!id) {
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const leads = ss.getSheetByName("Leads");
  const activities = ss.getSheetByName("ActivityLog");

  if (activities) {
    const activityHeaders = getHeaderMap_("ActivityLog");
    devClearSheetRows_(
      activities,
      findExactColumnRows_(
        activities,
        activityHeaders.lead_id,
        id
      )
    );
  }

  if (leads) {
    const leadHeaders = getHeaderMap_("Leads");
    devClearSheetRows_(
      leads,
      findExactColumnRows_(
        leads,
        leadHeaders.lead_id,
        id
      )
    );
  }

  SpreadsheetApp.flush();
}


function devReleaseLeadIdContractRow_(
  prepared,
  leadIds
) {
  const ids = [];

  for (let index = 0; index < leadIds.length; index++) {
    const id = String(leadIds[index] || "").trim();

    if (id && ids.indexOf(id) === -1) {
      ids.push(id);
      devCleanupInitializedLead_(id);
    }
  }

  if (
    devLeadIdContractCell_(
      prepared.sheet,
      prepared.headerMap,
      prepared.row
    )
  ) {
    return;
  }

  setCellByHeader_(
    prepared.sheet,
    prepared.row,
    prepared.headerMap,
    "first_name",
    ""
  );
  SpreadsheetApp.flush();
}


function devExpectSuppliedLeadIdRejected_(
  badLeadId,
  invalidMessage
) {
  const prepared = devLeadIdContractBlankRow_();
  let thrownMessage = "";
  let written = "";
  let releaseError = "";

  try {
    initializeLeadRow_(prepared.row, {
      source: "Employee",
      leadId: badLeadId,
    });
  } catch (error) {
    thrownMessage = String(
      error && error.message ? error.message : error || ""
    );
  } finally {
    written = devLeadIdContractCell_(
      prepared.sheet,
      prepared.headerMap,
      prepared.row
    );

    try {
      devReleaseLeadIdContractRow_(prepared, [written]);
    } catch (error) {
      releaseError = devSafeError_(error);
    }
  }

  if (written) {
    throw new Error(
      "invalid supplied leadId wrote a lead_id"
    );
  }

  if (releaseError) {
    throw new Error(releaseError);
  }

  if (thrownMessage !== invalidMessage) {
    throw new Error(
      "invalid supplied leadId must throw and must not allocate a replacement id"
    );
  }
}


function devExpectExactSuppliedLeadId_(supplied) {
  const prepared = devLeadIdContractBlankRow_();
  let created = "";
  let stored = "";
  let thrown = null;
  let releaseError = "";

  try {
    created = String(
      initializeLeadRow_(prepared.row, {
        source: "Employee",
        leadId: "  " + supplied + "  ",
      }) || ""
    );
    stored = devLeadIdContractCell_(
      prepared.sheet,
      prepared.headerMap,
      prepared.row
    );
  } catch (error) {
    thrown = error;
    stored = devLeadIdContractCell_(
      prepared.sheet,
      prepared.headerMap,
      prepared.row
    );
  } finally {
    try {
      devReleaseLeadIdContractRow_(prepared, [
        created,
        stored,
      ]);
    } catch (error) {
      releaseError = devSafeError_(error);
    }
  }

  if (thrown) {
    throw thrown;
  }

  if (created !== supplied || stored !== supplied) {
    throw new Error(
      "valid supplied leadId was not stored exactly"
    );
  }

  if (releaseError) {
    throw new Error(releaseError);
  }
}


function devExpectOmittedLeadIdGenerates_(supplied) {
  const prepared = devLeadIdContractBlankRow_();
  let created = "";
  let stored = "";
  let thrown = null;
  let releaseError = "";

  try {
    created = String(
      initializeLeadRow_(prepared.row, {
        source: "Employee",
      }) || ""
    );
    stored = devLeadIdContractCell_(
      prepared.sheet,
      prepared.headerMap,
      prepared.row
    );
  } catch (error) {
    thrown = error;
    stored = devLeadIdContractCell_(
      prepared.sheet,
      prepared.headerMap,
      prepared.row
    );
  } finally {
    try {
      devReleaseLeadIdContractRow_(prepared, [
        created,
        stored,
      ]);
    } catch (error) {
      releaseError = devSafeError_(error);
    }
  }

  if (thrown) {
    throw thrown;
  }

  if (
    !created ||
    created === supplied ||
    created !== stored ||
    !WEBSITE_INGEST_LEAD_ID_PATTERN_.test(created)
  ) {
    throw new Error(
      "omitted leadId did not generate a system lead id"
    );
  }

  if (releaseError) {
    throw new Error(releaseError);
  }
}


/**
 * DEV proof that a supplied leadId cannot be replaced.
 * Fake row only. Deletes any Lead and lead_created it creates.
 */
function devAssertInitializeLeadIdFailClosed_() {
  const supplied =
    "LEAD-7e7e7e7e-7e7e-47e7-8e7e-7e7e7e7e7e7e";
  const invalidMessage =
    "options.leadId is not a valid system lead id.";

  try {
    if (websiteIngestEnvLabel_() !== "dev") {
      throw new Error(
        "devAssertInitializeLeadIdFailClosed is DEV-only."
      );
    }

    const absentA = resolveInitializeLeadId_({});
    const absentB = resolveInitializeLeadId_({
      source: "Employee",
    });

    if (
      absentA === absentB ||
      !WEBSITE_INGEST_LEAD_ID_PATTERN_.test(absentA) ||
      !WEBSITE_INGEST_LEAD_ID_PATTERN_.test(absentB)
    ) {
      throw new Error(
        "omitted leadId should keep generating distinct system lead ids"
      );
    }

    if (
      resolveInitializeLeadId_({
        leadId: "  " + supplied + "  ",
      }) !== supplied
    ) {
      throw new Error(
        "valid supplied leadId should be returned exactly"
      );
    }

    const rejected = [
      "",
      "   ",
      "LEAD-not-a-uuid",
      null,
    ];

    for (
      let index = 0;
      index < rejected.length;
      index++
    ) {
      let threw = false;

      try {
        resolveInitializeLeadId_({
          leadId: rejected[index],
        });
      } catch (error) {
        threw =
          String(
            error && error.message
              ? error.message
              : ""
          ) === invalidMessage;
      }

      if (!threw) {
        throw new Error(
          "invalid supplied leadId must throw and must not allocate a replacement id"
        );
      }
    }

    devExpectSuppliedLeadIdRejected_(
      "",
      invalidMessage
    );
    devExpectSuppliedLeadIdRejected_(
      "   ",
      invalidMessage
    );
    devExpectSuppliedLeadIdRejected_(
      "LEAD-not-a-uuid",
      invalidMessage
    );
    devExpectExactSuppliedLeadId_(supplied);
    devExpectOmittedLeadIdGenerates_(supplied);

    return {
      name: "H_supplied_lead_id_fail_closed",
      pass: true,
    };
  } catch (error) {
    return {
      name: "H_supplied_lead_id_fail_closed",
      pass: false,
      error: devSafeError_(error),
    };
  }
}


/**
 * Run-menu wrapper for the supplied-leadId contract proof.
 */
function devAssertInitializeLeadIdFailClosed() {
  requireWebsiteIngestDev_(
    "devAssertInitializeLeadIdFailClosed"
  );

  const result =
    devAssertInitializeLeadIdFailClosed_();

  console.log(
    "[website-ingest-lead-id-contract] " +
      JSON.stringify(result)
  );

  return result;
}


/**
 * Editor proof for the supplied-leadId contract and cases A/B/D/E/F/G.
 * Uses doPost directly, so it runs the saved script, not the deployed
 * Web App. Fake data only. Passed cases clear only the rows they created.
 * A failed ingest case is left in place. Temporarily writes derived-view
 * dirty flags, then restores them.
 */
function devRunWebsiteIngestIdempotencyTests() {
  requireWebsiteIngestDev_(
    "devRunWebsiteIngestIdempotencyTests"
  );

  if (
    !SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        WEBSITE_INGEST_LEDGER_SHEET_NAME_
      )
  ) {
    return {
      ok: false,
      code: "LEDGER_NOT_SETUP",
    };
  }

  const scriptProps =
    PropertiesService.getScriptProperties();
  const savedFail = scriptProps.getProperty(
    WEBSITE_INGEST_DEV_FAIL_PROPERTY_
  );
  const savedDirty = devReadDerivedDirtyFlags_();
  const cases = [];

  try {
    cases.push(devAssertInitializeLeadIdFailClosed_());
    cases.push(devIdempotencyCaseA_());
    cases.push(devIdempotencyCaseB_());
    cases.push(devIdempotencyCaseD_());
    cases.push(devIdempotencyCaseE_());
    cases.push(devIdempotencyCaseF_());
    cases.push(devIdempotencyCaseG_());
  } finally {
    if (
      savedFail === null ||
      savedFail === undefined
    ) {
      scriptProps.deleteProperty(
        WEBSITE_INGEST_DEV_FAIL_PROPERTY_
      );
    } else {
      scriptProps.setProperty(
        WEBSITE_INGEST_DEV_FAIL_PROPERTY_,
        savedFail
      );
    }

    devWriteDerivedDirtyFlags_(savedDirty);
  }

  let ok = cases.length === 7;

  for (let index = 0; index < cases.length; index++) {
    if (!cases[index] || cases[index].pass !== true) {
      ok = false;
    }
  }

  if (!ok) {
    registerDerivedViewDirtyFlags_({
      board: true,
      dashboard: true,
    });
  }

  const report = {
    ok: ok,
    cases: cases,
  };

  console.log(
    "[website-ingest-idempotency-test] " +
      JSON.stringify(report)
  );

  return report;
}


function devParseIngestHttpResponse_(response) {
  let parsed = null;

  try {
    parsed = JSON.parse(
      response.getContentText() || ""
    );
  } catch (error) {
    parsed = null;
  }

  return {
    httpStatus: response.getResponseCode(),
    ok: !!(parsed && parsed.ok === true),
    code:
      parsed && parsed.code
        ? String(parsed.code)
        : "",
    lead_id:
      parsed && parsed.lead_id
        ? String(parsed.lead_id)
        : "",
    replayed: !!(parsed && parsed.replayed === true),
  };
}


/**
 * True concurrent duplicate against the DEPLOYED DEV Web App.
 * Run only after Manage deployments → DEV Web App → New version.
 * Pass the DEV /exec URL, or run the zero-argument wrapper
 * devRunWebsiteIngestHttpConcurrencyTestFromProperty.
 * Do not pass a production deployment.
 * Counts are read from the spreadsheet after both responses return.
 */
function devRunWebsiteIngestHttpConcurrencyTest(
  webAppUrl
) {
  requireWebsiteIngestDev_(
    "devRunWebsiteIngestHttpConcurrencyTest"
  );

  const url = String(webAppUrl || "").trim();

  if (!WEBSITE_INGEST_EXEC_URL_PATTERN_.test(url)) {
    return {
      ok: false,
      code: "DEV_URL_REJECTED",
    };
  }

  if (
    !SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        WEBSITE_INGEST_LEDGER_SHEET_NAME_
      )
  ) {
    return {
      ok: false,
      code: "LEDGER_NOT_SETUP",
    };
  }

  const envelope =
    devBuildSignedWebsiteIngestEnvelope_(
      devIdempotencyPayload_("C")
    );
  const body = JSON.stringify(envelope);
  const request = {
    url: url,
    method: "post",
    contentType: "application/json",
    payload: body,
    muteHttpExceptions: true,
    followRedirects: true,
  };
  let responses;

  try {
    responses = UrlFetchApp.fetchAll([
      request,
      request,
    ]);
  } catch (error) {
    return {
      ok: false,
      code: "DEV_HTTP_FAILED",
      submission_id: envelope.submission_id,
    };
  }

  const parsed = [
    devParseIngestHttpResponse_(responses[0]),
    devParseIngestHttpResponse_(responses[1]),
  ];
  const counts =
    devInspectWebsiteIngestSubmission(
      envelope.submission_id
    );
  const successes = [];
  const locks = [];

  for (let index = 0; index < parsed.length; index++) {
    if (parsed[index].ok && parsed[index].lead_id) {
      successes.push(parsed[index]);
    } else if (parsed[index].code === "LOCK_TIMEOUT") {
      locks.push(parsed[index]);
    }
  }

  const leadIds = [];

  for (let index = 0; index < successes.length; index++) {
    if (leadIds.indexOf(successes[index].lead_id) === -1) {
      leadIds.push(successes[index].lead_id);
    }
  }

  const fresh = successes.filter(function (item) {
    return item.replayed !== true;
  });
  const replays = successes.filter(function (item) {
    return item.replayed === true;
  });
  const pass =
    leadIds.length === 1 &&
    counts.ledger_rows === 1 &&
    counts.lead_rows === 1 &&
    counts.lead_created_rows === 1 &&
    counts.state === "SUCCESS" &&
    counts.lead_id === leadIds[0] &&
    (
      (fresh.length === 1 && replays.length === 1) ||
      (
        fresh.length === 1 &&
        locks.length === 1 &&
        successes.length === 1
      )
    );

  const report = {
    ok: pass,
    name: "C_concurrent_http",
    submission_id: envelope.submission_id,
    lead_id: leadIds[0] || "",
    responses: parsed,
    ledger_rows: counts.ledger_rows,
    lead_rows: counts.lead_rows,
    lead_created_rows: counts.lead_created_rows,
    state: counts.state,
  };

  if (pass) {
    try {
      devCleanupWebsiteIngestSubmission_(
        envelope.submission_id
      );
    } catch (cleanupError) {
      report.ok = false;
      report.error = "cleanup_failed";
      report.left_in_place = true;
    }
  } else {
    report.left_in_place = true;
  }

  console.log(
    "[website-ingest-concurrency-test] " +
      JSON.stringify(report)
  );

  return report;
}


/**
 * Run-menu wrapper. Reads Script Property
 * CRM_INGEST_DEV_WEB_APP_URL. Does not take the URL from the
 * editor, the request body, or source code.
 */
function devRunWebsiteIngestHttpConcurrencyTestFromProperty() {
  requireWebsiteIngestDev_(
    "devRunWebsiteIngestHttpConcurrencyTestFromProperty"
  );

  const url = String(
    PropertiesService
      .getScriptProperties()
      .getProperty(
        WEBSITE_INGEST_DEV_WEB_APP_URL_PROPERTY_
      ) || ""
  ).trim();

  if (!url) {
    throw new Error(
      "Set Script Property CRM_INGEST_DEV_WEB_APP_URL to the DEV Web App /exec URL before running devRunWebsiteIngestHttpConcurrencyTestFromProperty."
    );
  }

  if (!WEBSITE_INGEST_EXEC_URL_PATTERN_.test(url)) {
    throw new Error(
      "Script Property CRM_INGEST_DEV_WEB_APP_URL must be a non-empty Apps Script /exec URL."
    );
  }

  return devRunWebsiteIngestHttpConcurrencyTest(
    url
  );
}


/**
 * Operational counts for one submission. Does not return the
 * fingerprint, payload, or patient fields.
 */
function devInspectWebsiteIngestSubmission(
  submissionId
) {
  if (websiteIngestEnvLabel_() !== "dev") {
    return {
      ok: false,
      code: "DEV_ONLY",
    };
  }

  const id = String(submissionId || "").trim();

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id
    )
  ) {
    return {
      ok: false,
      code: "INVALID_SUBMISSION_ID",
    };
  }

  try {
    const ledger = requireWebsiteIngestLedger_();
    const rows = findWebsiteIngestLedgerRows_(
      ledger.sheet,
      ledger.headerMap,
      id
    );
    const record =
      rows.length > 0
        ? readWebsiteIngestLedgerRecord_(
            ledger.sheet,
            ledger.headerMap,
            rows[0]
          )
        : null;
    const proof = inspectWebsiteReservedLead_(
      record ? record.lead_id : ""
    );

    return {
      ok: true,
      submission_id: id,
      ledger_rows: rows.length,
      state: record
        ? websiteIngestSafeState_(record.state)
        : "",
      lead_id: record ? record.lead_id : "",
      attempt_count: record ? record.attempt_count : 0,
      last_result_code: record
        ? websiteIngestSafeState_(
            record.last_result_code
          )
        : "",
      lead_rows: proof.leadRows,
      lead_created_rows: proof.leadCreated,
    };
  } catch (error) {
    return {
      ok: false,
      code: "INSPECT_FAILED",
      submission_id: id,
    };
  }
}


/*
 * DEV proof for Board label removal and dirty-view
 * auto-refresh. Fake example.com leads only.
 *
 * Refuses unless Script Property CRM_INGEST_ENV_LABEL
 * is dev. Performs real Board and Dashboard rebuilds,
 * so run it only on the fake DEV workbook.
 *
 * Several full rebuilds run in one execution. Let it
 * finish; it can take several minutes.
 */
function devRunDerivedViewAutoRefreshTests() {
  requireWebsiteIngestDev_(
    "devRunDerivedViewAutoRefreshTests"
  );

  if (
    !SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        WEBSITE_INGEST_LEDGER_SHEET_NAME_
      )
  ) {
    return {
      ok: false,
      code: "LEDGER_NOT_SETUP",
    };
  }

  const savedDirty = devReadDerivedDirtyFlags_();
  const savedView = devActiveStaffView_();
  const cases = [];
  let staleBoard = false;

  try {
    try {
    cases.push(
      devRunDerivedViewCase_(
        "H",
        devCaseTriggerInstall_
      )
    );
    cases.push(
      devRunDerivedViewCase_(
        "B",
        devCaseCleanScheduled_
      )
    );

    const manual = devRunDerivedViewCase_(
      "A",
      devCaseManualBoardRefresh_
    );
    cases.push(manual);
    if (manual.pass === true) {
      staleBoard = true;
    }

    devCaseScheduledIngest_().forEach(
      function (item) {
        cases.push(item);
        if (
          item &&
          item.name === "F" &&
          item.pass === true
        ) {
          staleBoard = true;
        }
      }
    );

    devCaseBoardOnlyBackground_().forEach(
      function (item) {
        cases.push(item);
        if (
          item &&
          item.name === "C" &&
          item.pass === true
        ) {
          staleBoard = false;
        }
      }
    );

    cases.push(
      devRunDerivedViewCase_(
        "D",
        devCaseDashboardOnly_
      )
    );
    } catch (error) {
      cases.push({
        name: "suite",
        pass: false,
        code: devDerivedViewCaseCode_(error),
      });
    }
  } finally {
    if (staleBoard) {
      try {
        devDropDerivedViewCaches_();
        renderPatientBoard({
          background: true,
        });
        SpreadsheetApp.flush();
      } catch (error) {
        cases.push({
          name: "cleanup",
          pass: false,
          code: "BOARD_RESYNC_FAILED",
        });
      }
    }

    try {
      devWriteDerivedDirtyFlags_(
        savedDirty
      );
    } catch (error) {
      cases.push({
        name: "cleanup",
        pass: false,
        code: "DIRTY_RESTORE_FAILED",
      });
    }

    try {
      devRestoreStaffView_(savedView);
    } catch (error) {
      cases.push({
        name: "cleanup",
        pass: false,
        code: "VIEW_RESTORE_FAILED",
      });
    }

    EXECUTION_CACHE_
      .derivedViewUiEffects = null;
  }

  const expected = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
  ];
  let ok = true;

  for (
    let index = 0;
    index < expected.length;
    index++
  ) {
    const passed = cases.filter(
      function (item) {
        return (
          item &&
          item.name === expected[index] &&
          item.pass === true
        );
      }
    );

    if (passed.length !== 1) {
      ok = false;
    }
  }

  for (
    let index = 0;
    index < cases.length;
    index++
  ) {
    if (
      !cases[index] ||
      cases[index].pass !== true
    ) {
      ok = false;
    }
  }

  const report = {
    ok: ok,
    cases: cases,
  };

  console.log(
    "[derived-view-refresh-test] " +
      JSON.stringify(report)
  );

  return report;
}


function devRunDerivedViewCase_(name, fn) {
  try {
    const result = fn();

    if (result && result.name) {
      return result;
    }

    return {
      name: name,
      pass: false,
      code: "NO_RESULT",
    };
  } catch (error) {
    return {
      name: name,
      pass: false,
      code: devDerivedViewCaseCode_(error),
    };
  }
}


function devDerivedViewCaseCode_(error) {
  const message = String(
    error && error.message ? error.message : ""
  );

  if (/^[A-Z0-9_]+$/.test(message)) {
    return message;
  }

  return "CASE_FAILED";
}


function devClearDerivedViewUiEffects_() {
  EXECUTION_CACHE_.derivedViewUiEffects = [];
}


function devDerivedViewUiEffectCount_(effect) {
  const log =
    EXECUTION_CACHE_.derivedViewUiEffects || [];
  let count = 0;

  for (let index = 0; index < log.length; index++) {
    if (log[index] === effect) {
      count++;
    }
  }

  return count;
}


function devDropDerivedViewCaches_() {
  invalidateCanonicalSheetTable_("Leads");
  invalidateCanonicalSheetTable_("ActivityLog");
  EXECUTION_CACHE_.dashboardRefreshContext = null;
  EXECUTION_CACHE_.leadRowsById = {};
  EXECUTION_CACHE_.leadSnapshots = {};
  EXECUTION_CACHE_.dashboardDateKeyCache = {};
}


function devActiveStaffView_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  let a1 = "";

  try {
    const cell = sheet ? sheet.getActiveCell() : null;
    if (cell) {
      a1 = cell.getA1Notation();
    }
  } catch (error) {
    a1 = "";
  }

  return {
    sheetName: sheet ? sheet.getName() : "",
    a1: a1,
  };
}


function devRestoreStaffView_(saved) {
  if (!saved || !saved.sheetName) {
    return;
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(saved.sheetName);

  if (!sheet) {
    return;
  }

  if (saved.a1) {
    sheet.getRange(saved.a1).activate();
    return;
  }

  sheet.activate();
}


function devFocusDashboardCorner_() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Dashboard");

  if (!sheet) {
    throw new Error("NO_DASHBOARD");
  }

  sheet.getRange("A1").activate();
}


function devDashboardStatusText_() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Dashboard");

  if (!sheet) {
    throw new Error("NO_DASHBOARD");
  }

  return String(
    sheet
      .getRange(PATIENT_DASHBOARD_CONTROLS.statusCell)
      .getDisplayValue() || ""
  );
}


function devBoardSummaryText_() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Board");

  if (!sheet) {
    throw new Error("NO_BOARD");
  }

  return String(
    sheet
      .getRange(
        PATIENT_BOARD_LAYOUT.summaryRow,
        PATIENT_BOARD_LAYOUT.firstValuesColumn
      )
      .getDisplayValue() || ""
  );
}


function devActionRailHasBoardWord_() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Board");

  if (!sheet) {
    return true;
  }

  const layout = PATIENT_BOARD_LAYOUT;
  const lastRow = Math.max(
    sheet.getLastRow(),
    layout.firstDynamicRow
  );
  const values = sheet
    .getRange(
      layout.firstDynamicRow,
      layout.actionRailFirstColumn,
      lastRow - layout.firstDynamicRow + 1,
      layout.actionRailColumnCount
    )
    .getDisplayValues();

  for (let row = 0; row < values.length; row++) {
    for (
      let column = 0;
      column < values[row].length;
      column++
    ) {
      if (
        String(values[row][column] || "").trim() ===
        "BOARD"
      ) {
        return true;
      }
    }
  }

  return false;
}


function devBoardLeadAnchor_(leadId) {
  const id = String(leadId || "").trim();

  if (!id) {
    return "";
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Board");

  if (!sheet) {
    return "";
  }

  const needle = '"leadId":"' + id + '"';
  const prefix = "PATIENT_BOARD_CARD_";
  const metadata = sheet.getDeveloperMetadata();

  for (let index = 0; index < metadata.length; index++) {
    const key = String(metadata[index].getKey() || "");

    if (key.indexOf(prefix) !== 0) {
      continue;
    }

    const value = String(
      metadata[index].getValue() || ""
    );

    if (value.indexOf(needle) !== -1) {
      return key.substring(prefix.length);
    }
  }

  return "";
}


function devCreateFakeBoardLead_(label) {
  const payload = devSampleWebsiteLeadPayload_();
  payload.email =
    "fake-board-" +
    String(label).toLowerCase() +
    "-" +
    Date.now() +
    "@example.com";
  payload.message =
    "DEV board refresh fake lead only.";

  const envelope =
    devBuildSignedWebsiteIngestEnvelope_(payload);
  const result = devExecuteWebsiteIngest_(envelope);

  return {
    ok: result.ok === true,
    code: result.code ? String(result.code) : "",
    submissionId: envelope.submission_id,
    leadId: result.lead_id
      ? String(result.lead_id)
      : "",
  };
}


function devCleanupFakeBoardLead_(submissionId) {
  devCleanupWebsiteIngestSubmission_(submissionId);
  devDropDerivedViewCaches_();
}


function devForeignTriggerCounts_() {
  const counts = {};
  const triggers = ScriptApp.getProjectTriggers();

  for (let index = 0; index < triggers.length; index++) {
    const name = String(
      triggers[index].getHandlerFunction() || ""
    );

    if (name === DERIVED_VIEW_AUTO_REFRESH_HANDLER_) {
      continue;
    }

    counts[name] = (counts[name] || 0) + 1;
  }

  return counts;
}


function devSameTriggerCounts_(left, right) {
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (let index = 0; index < leftKeys.length; index++) {
    if (leftKeys[index] !== rightKeys[index]) {
      return false;
    }

    if (left[leftKeys[index]] !== right[leftKeys[index]]) {
      return false;
    }
  }

  return true;
}


function devAutoRefreshTriggerCount_() {
  return listDerivedViewAutoRefreshTriggers_().length;
}


function devUiQuiet_() {
  return (
    devDerivedViewUiEffectCount_("activate") === 0 &&
    devDerivedViewUiEffectCount_("select") === 0 &&
    devDerivedViewUiEffectCount_("toast") === 0 &&
    devDerivedViewUiEffectCount_("restore-sheet") === 0
  );
}


function devCaseManualBoardRefresh_() {
  devDropDerivedViewCaches_();
  devSetDerivedDirtyZero_();

  const created = devCreateFakeBoardLead_("A");

  if (!created.ok || !created.leadId) {
    return {
      name: "A",
      pass: false,
      code: created.code || "INGEST_NO_LEAD",
      submission_id: created.submissionId,
      left_in_place: true,
    };
  }

  try {
    devClearDerivedViewUiEffects_();
    renderPatientBoard();
    SpreadsheetApp.flush();

    if (devDerivedViewUiEffectCount_("activate") < 1) {
      throw new Error("A_NO_ACTIVATE");
    }

    if (devDerivedViewUiEffectCount_("toast") < 1) {
      throw new Error("A_NO_TOAST");
    }

    if (devDerivedViewUiEffectCount_("board-render") < 1) {
      throw new Error("A_NO_RENDER");
    }

    if (devActionRailHasBoardWord_()) {
      throw new Error("A_BOARD_LABEL");
    }

    const anchor = devBoardLeadAnchor_(created.leadId);

    if (!anchor) {
      throw new Error("A_LEAD_NOT_ON_BOARD");
    }

    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("Board")
      .getRange(anchor)
      .activate();

    devClearDerivedViewUiEffects_();
    renderPatientBoard();
    SpreadsheetApp.flush();

    if (devDerivedViewUiEffectCount_("board-render") !== 1) {
      throw new Error("A_SECOND_RENDER");
    }

    if (devDerivedViewUiEffectCount_("activate") !== 1) {
      throw new Error("A_SECOND_ACTIVATE");
    }

    if (devDerivedViewUiEffectCount_("toast") !== 1) {
      throw new Error("A_SECOND_TOAST");
    }

    if (devDerivedViewUiEffectCount_("select") !== 1) {
      throw new Error("A_NO_SELECT");
    }

    if (
      getSelectedBoardLeadIdForRefresh_() !==
      created.leadId
    ) {
      throw new Error("A_SELECTION_LOST");
    }

    if (devActionRailHasBoardWord_()) {
      throw new Error("A_BOARD_LABEL");
    }

    if (
      SpreadsheetApp
        .getActiveSpreadsheet()
        .getActiveSheet()
        .getName() !== "Board"
    ) {
      throw new Error("A_SHEET");
    }

    devCleanupFakeBoardLead_(created.submissionId);

    return {
      name: "A",
      pass: true,
    };
  } catch (error) {
    return {
      name: "A",
      pass: false,
      code: devDerivedViewCaseCode_(error),
      submission_id: created.submissionId,
      lead_id: created.leadId,
      left_in_place: true,
    };
  }
}


function devCaseCleanScheduled_() {
  const summaryBefore = devBoardSummaryText_();
  const statusBefore = devDashboardStatusText_();

  devSetDerivedDirtyZero_();
  devClearDerivedViewUiEffects_();

  const result = refreshDirtyDerivedViewsScheduled();
  const flags = devDerivedDirtyFlags_();

  if (result.skipped !== true) {
    throw new Error("B_NOT_SKIPPED");
  }

  if (
    result.boardRebuilds !== 0 ||
    result.dashboardRebuilds !== 0 ||
    result.passes !== 0
  ) {
    throw new Error("B_REBUILT");
  }

  if (
    devDerivedViewUiEffectCount_("board-render") !== 0 ||
    devDerivedViewUiEffectCount_("dashboard-render") !== 0
  ) {
    throw new Error("B_RENDER_CALL");
  }

  if (!devUiQuiet_()) {
    throw new Error("B_UI");
  }

  if (flags.board || flags.dashboard) {
    throw new Error("B_FLAGS");
  }

  if (devBoardSummaryText_() !== summaryBefore) {
    throw new Error("B_BOARD_CHANGED");
  }

  if (devDashboardStatusText_() !== statusBefore) {
    throw new Error("B_DASHBOARD_CHANGED");
  }

  return {
    name: "B",
    pass: true,
  };
}


function devCaseBoardOnlyBackground_() {
  try {
    devFocusDashboardCorner_();
    const statusBefore = devDashboardStatusText_();

    devDropDerivedViewCaches_();
    devSetDerivedDirtyZero_();
    registerDerivedViewDirtyFlags_({
      board: true,
    });
    devClearDerivedViewUiEffects_();

    const result = refreshDirtyDerivedViewsScheduled();
    SpreadsheetApp.flush();

    const flags = devDerivedDirtyFlags_();
    const view = devActiveStaffView_();
    const cPass =
      result.skipped !== true &&
      result.boardRebuilds === 1 &&
      result.dashboardRebuilds === 0 &&
      result.passes === 1 &&
      flags.board === false &&
      flags.dashboard === false &&
      devDerivedViewUiEffectCount_("board-render") === 1 &&
      devDerivedViewUiEffectCount_("dashboard-render") === 0 &&
      devDashboardStatusText_() === statusBefore;
    const gPass =
      view.sheetName === "Dashboard" &&
      view.a1 === "A1" &&
      devUiQuiet_();

    return [
      {
        name: "C",
        pass: cPass,
        code: cPass ? "" : "C_FAILED",
      },
      {
        name: "G",
        pass: gPass,
        code: gPass ? "" : "G_FAILED",
      },
    ];
  } catch (error) {
    const failed = {
      pass: false,
      code: devDerivedViewCaseCode_(error),
    };

    return [
      Object.assign({ name: "C" }, failed),
      Object.assign({ name: "G" }, failed),
    ];
  }
}


function devCaseDashboardOnly_() {
  const summaryBefore = devBoardSummaryText_();

  devDropDerivedViewCaches_();
  devSetDerivedDirtyZero_();
  registerDerivedViewDirtyFlags_({
    dashboard: true,
  });
  devClearDerivedViewUiEffects_();

  const result = refreshDirtyDerivedViewsScheduled();
  const flags = devDerivedDirtyFlags_();

  if (result.skipped === true) {
    throw new Error("D_SKIPPED");
  }

  if (
    result.boardRebuilds !== 0 ||
    result.dashboardRebuilds !== 1 ||
    result.passes !== 1
  ) {
    throw new Error("D_REBUILD_COUNT");
  }

  if (flags.board || flags.dashboard) {
    throw new Error("D_FLAGS");
  }

  if (devDerivedViewUiEffectCount_("board-render") !== 0) {
    throw new Error("D_BOARD_CALL");
  }

  if (devDerivedViewUiEffectCount_("dashboard-render") !== 1) {
    throw new Error("D_DASHBOARD_CALL");
  }

  if (!devUiQuiet_()) {
    throw new Error("D_UI");
  }

  if (devBoardSummaryText_() !== summaryBefore) {
    throw new Error("D_BOARD_CHANGED");
  }

  return {
    name: "D",
    pass: true,
  };
}


function devCaseScheduledIngest_() {
  devDropDerivedViewCaches_();
  devSetDerivedDirtyZero_();

  const created = devCreateFakeBoardLead_("F");

  if (!created.ok || !created.leadId) {
    const failed = {
      pass: false,
      code: created.code || "INGEST_NO_LEAD",
      submission_id: created.submissionId,
      left_in_place: true,
    };

    return [
      Object.assign({ name: "E" }, failed),
      Object.assign({ name: "F" }, failed),
    ];
  }

  try {
    const dirty = devDerivedDirtyFlags_();
    const onBoardBefore = Boolean(
      devBoardLeadAnchor_(created.leadId)
    );

    devClearDerivedViewUiEffects_();
    const result = refreshDirtyDerivedViewsScheduled();
    SpreadsheetApp.flush();

    const flags = devDerivedDirtyFlags_();
    const onBoardAfter = Boolean(
      devBoardLeadAnchor_(created.leadId)
    );
    const ePass =
      dirty.board === true &&
      dirty.dashboard === true &&
      result.skipped !== true &&
      result.boardRebuilds === 1 &&
      result.dashboardRebuilds === 1 &&
      result.passes === 1 &&
      flags.board === false &&
      flags.dashboard === false &&
      devDerivedViewUiEffectCount_("board-render") === 1 &&
      devDerivedViewUiEffectCount_("dashboard-render") === 1;
    const fPass =
      dirty.board === true &&
      dirty.dashboard === true &&
      onBoardBefore === false &&
      onBoardAfter === true &&
      devUiQuiet_();

    if (ePass && fPass) {
      devCleanupFakeBoardLead_(created.submissionId);
    }

    return [
      {
        name: "E",
        pass: ePass,
        code: ePass ? "" : "E_FAILED",
        submission_id: ePass ? "" : created.submissionId,
        lead_id: ePass ? "" : created.leadId,
        left_in_place: ePass ? false : true,
      },
      {
        name: "F",
        pass: fPass,
        code: fPass ? "" : "F_FAILED",
        submission_id: fPass ? "" : created.submissionId,
        lead_id: fPass ? "" : created.leadId,
        left_in_place: fPass ? false : true,
      },
    ];
  } catch (error) {
    const failed = {
      pass: false,
      code: devDerivedViewCaseCode_(error),
      submission_id: created.submissionId,
      lead_id: created.leadId,
      left_in_place: true,
    };

    return [
      Object.assign({ name: "E" }, failed),
      Object.assign({ name: "F" }, failed),
    ];
  }
}


function devCaseTriggerInstall_() {
  const beforeForeign = devForeignTriggerCounts_();
  const beforeCount = devAutoRefreshTriggerCount_();
  let created = false;

  try {
    if (beforeCount === 0) {
      const first = installDerivedViewAutoRefreshTrigger();
      created = true;

      if (first.created !== true || first.count !== 1) {
        throw new Error("H_FIRST_CREATE");
      }

      if (devAutoRefreshTriggerCount_() !== 1) {
        throw new Error("H_FIRST_COUNT");
      }
    }

    const second = installDerivedViewAutoRefreshTrigger();

    if (second.created !== false || second.count !== 1) {
      throw new Error("H_SECOND");
    }

    if (devAutoRefreshTriggerCount_() !== 1) {
      throw new Error("H_SECOND_COUNT");
    }

    if (
      !devSameTriggerCounts_(
        beforeForeign,
        devForeignTriggerCounts_()
      )
    ) {
      throw new Error("H_UNRELATED");
    }

    return {
      name: "H",
      pass: true,
      created: created,
      before_count: beforeCount,
    };
  } finally {
    if (created) {
      removeDerivedViewAutoRefreshTrigger();

      if (devAutoRefreshTriggerCount_() !== 0) {
        throw new Error("H_REMOVE");
      }

      if (
        !devSameTriggerCounts_(
          beforeForeign,
          devForeignTriggerCounts_()
        )
      ) {
        throw new Error("H_UNRELATED_REMOVE");
      }
    }
  }
}

/*
 * Long-term archive and cold storage.
 *
 * Archive is reversible and stays in Leads.
 * Cold storage is manual. A scheduled reminder
 * refresh may redraw the Archive tab. It must
 * not export, clear, or delete operational rows.
 *
 * Full-sheet scans shrink when trailing
 * offloaded rows are blank, because getLastRow()
 * ignores cells with no stored value. Checkbox
 * validation can remain. Older template rows that
 * still store FALSE can keep the used range open:
 * - Leads: Board, Dashboard, findLeadRowById_
 * - ActivityLog: timelines and dashboard activity
 * - Attachments and Reactions
 * - WebsiteIngestLedger
 * Website ingest does not read archive bundles.
 */


const LEAD_ARCHIVE_HEADER_NAMES_ = Object.freeze([
  "archived",
  "archived_at",
  "archived_by",
  "archived_from_status",
  "archive_reason",
]);


const ARCHIVE_ELIGIBLE_STATUSES_ = Object.freeze([
  "Scheduled",
  "Case Lost",
  "Unrelated",
]);


const ARCHIVE_INDEX_HEADERS_ = Object.freeze([
  "archive_index_id",
  "lead_id",
  "first_name",
  "last_name",
  "archived_from_status",
  "archived_at",
  "offloaded_at",
  "bundle_id",
  "bundle_file_id",
  "bundle_format_version",
  "restored_at",
  "restored_by",
]);


const ARCHIVE_INDEX_SHEET_NAME_ = "ArchiveIndex";


const ARCHIVE_VIEW_SHEET_NAME_ = "Archive";


const ARCHIVE_FORMAT_VERSION_ = 1;


const ARCHIVE_REMINDER_DAYS_DEFAULT_ = 180;


const ARCHIVE_COLD_STORAGE_DAYS_DEFAULT_ = 365;


const ARCHIVE_DAY_MS_ = 86400000;


const COLD_STORAGE_LOCK_WAIT_MS_ = 120000;


const ARCHIVE_BUNDLE_FILE_NAMES_ = Object.freeze([
  "manifest.json",
  "leads.json",
  "activity.json",
  "attachments.json",
  "reactions.json",
  "website-ingest-ledger.json",
]);


const ARCHIVE_CONFIG_DEFAULTS_ = Object.freeze({
  archive_cold_storage_days: "365",
  archive_reminder_days: "180",
  archive_storage_folder_id: "",
  archive_format_version: "1",
  archive_last_cold_storage_at: "",
  archive_last_cold_storage_bundle_id: "",
});


const ARCHIVE_VIEW_COLUMN_COUNT_ = 12;


const ARCHIVE_RESULT_MESSAGES_ = Object.freeze({
  ARCHIVED:
    "The lead was archived and will leave the Board and operational Dashboard on the next refresh. Workflow status was not changed.",
  UNARCHIVED:
    "The lead was returned to its previous workflow lane. Workflow completion was not changed. Use Reopen Workflow only if more work is needed.",
  SCHEMA_MISSING:
    "Run ADMIN: Setup Lead Archive Schema first. Nothing was changed.",
  SCHEMA_READY:
    "Archive fields, the Archive tab, and ArchiveIndex are ready. No Drive folders were created. Set Config archive_storage_folder_id before cold storage.",
  INELIGIBLE_STATUS:
    "Only Scheduled, Case Lost, and Unrelated leads can be archived.",
  SCHEDULED_NOT_COMPLETE:
    "A Scheduled lead can be archived only after its workflow is complete.",
  ALREADY_ARCHIVED:
    "That lead is already archived.",
  NOT_ARCHIVED:
    "That lead is not archived.",
  NOT_FOUND:
    "The requested record was not found.",
  DRY_RUN:
    "Dry run only. Nothing was exported or removed.",
  NOTHING_SELECTED:
    "Select at least one archived lead on the Archive tab.",
  NOTHING_TO_OFFLOAD:
    "No archived leads matched that cold-storage scope. Nothing was removed.",
  CONFIRMATION_REQUIRED:
    "Offloading every archived lead needs the extra confirmation. Nothing was exported.",
  ACTIVE_LEAD_BLOCKED:
    "Cold storage can include only archived leads. Nothing was exported or removed.",
  INVALID_SCOPE:
    "Choose selected archived leads, eligible archived leads, or all archived leads.",
  FOLDER_MISSING:
    "Cold storage needs Config archive_storage_folder_id for a clinic-controlled Drive folder. Nothing was removed.",
  EXPORT_FAILED:
    "The archive bundle was not stored. Operational records were not changed.",
  VERIFY_FAILED:
    "The archive bundle could not be verified. Operational records were not changed.",
  UNSUPPORTED_VERSION:
    "This workbook can write and restore archive format version 1 only. Nothing was changed.",
  MALFORMED_BUNDLE:
    "The archive bundle is malformed or incomplete. Nothing was written.",
  ALREADY_PRESENT:
    "That record is already in the live workbook. Restoration stopped before writing.",
  ALREADY_IMPORTED:
    "That bundle or lead is already in the archive index. Nothing was written.",
  PARTIAL:
    "The bundle was verified, but operational cleanup did not finish.",
  LOCK_TIMEOUT:
    "Another archive operation is running. Nothing was changed.",
  SUCCESS:
    "Cold storage finished. Archived leads were removed from the operational tables only after the bundle was verified.",
  RESTORED:
    "The lead was restored into the Archive. It was not placed on the active Board.",
  RESTORED_UNARCHIVED:
    "The lead was restored and unarchived into its previous lane. Workflow completion was not changed.",
  CLEANUP_FINISHED:
    "Cold-storage cleanup finished. No second export was created.",
  ARCHIVE_SHEET_MISSING:
    "Run ADMIN: Setup Lead Archive Schema before opening the Archive tab.",
  ARCHIVE_READY:
    "Archive tab refreshed.",
  ARCHIVE_REFRESH_FAILED:
    "The Archive tab could not be refreshed.",
  ELIGIBLE:
    "The lead can be archived.",
});


function isSheetBooleanTrue_(value) {
  if (value === true) {
    return true;
  }

  if (
    value === false ||
    value == null ||
    value === ""
  ) {
    return false;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  const text = String(value).trim().toLowerCase();

  return text === "true" || text === "yes";
}


function isLeadRowArchived_(headers, rowValues) {
  if (
    !headers ||
    !headers.archived ||
    !rowValues
  ) {
    return false;
  }

  return isSheetBooleanTrue_(
    rowValues[headers.archived - 1]
  );
}


function leadArchiveSchemaReady_(headers) {
  return LEAD_ARCHIVE_HEADER_NAMES_.every(
    (name) => headers && headers[name]
  );
}


function partitionLeadHeadersForFoundation_(expectedHeaders) {
  const start = expectedHeaders.indexOf("archived");

  if (start < 0) {
    return {
      required: expectedHeaders.slice(),
      optional: [],
    };
  }

  return {
    required: expectedHeaders.slice(0, start),
    optional: expectedHeaders.slice(start),
  };
}


function collectFoundationHeaderErrors_(
  sheetName,
  expectedHeaders,
  sheet
) {
  const errors = [];
  const split = sheetName === "Leads"
    ? partitionLeadHeadersForFoundation_(expectedHeaders)
    : {
      required: expectedHeaders.slice(),
      optional: [],
    };

  const actual = sheet
    .getRange(1, 1, 1, split.required.length)
    .getDisplayValues()[0];

  split.required.forEach((expectedHeader, index) => {
    if (actual[index] !== expectedHeader) {
      const column = columnNumberToLetter_(index + 1);

      errors.push(
        `${sheetName}!${column}1 expected "${expectedHeader}" but found "${actual[index] || ""}".`
      );
    }
  });

  if (!split.optional.length) {
    return errors;
  }

  const extra = sheet
    .getRange(
      1,
      split.required.length + 1,
      1,
      split.optional.length
    )
    .getDisplayValues()[0];

  const anyInstalled = extra.some(
    (value) => String(value || "").trim()
  );

  if (!anyInstalled) {
    return errors;
  }

  split.optional.forEach((expectedHeader, index) => {
    const actualHeader = String(extra[index] || "").trim();

    if (actualHeader !== expectedHeader) {
      const column = columnNumberToLetter_(
        split.required.length + index + 1
      );

      errors.push(
        `${sheetName}!${column}1 expected "${expectedHeader}" but found "${actualHeader}".`
      );
    }
  });

  return errors;
}


function evaluateArchiveEligibility_(status, workflowComplete) {
  if (
    ARCHIVE_ELIGIBLE_STATUSES_.indexOf(status) < 0
  ) {
    return {
      ok: false,
      code: "INELIGIBLE_STATUS",
    };
  }

  if (
    status === "Scheduled" &&
    workflowComplete !== true
  ) {
    return {
      ok: false,
      code: "SCHEDULED_NOT_COMPLETE",
    };
  }

  return {
    ok: true,
    code: "ELIGIBLE",
  };
}


function archiveResultMessage_(result) {
  const code = typeof result === "string"
    ? result
    : (result && result.code) || "";
  const base = ARCHIVE_RESULT_MESSAGES_[code]
    || "The archive action could not be completed.";

  if (result && result.instructions) {
    return `${base} ${result.instructions}`;
  }

  if (result && result.normalization) {
    const stats = result.normalization;

    return `${base} Unused template rows cleared: ${stats.normalized_rows}. Suspicious rows left unchanged: ${stats.skipped_rows}.`;
  }

  return base;
}


function logArchiveEvent_(event) {
  const source = event || {};
  const payload = {
    result_code: String(source.code || ""),
    bundle_id: String(source.bundleId || ""),
    elapsed_ms: Number(source.elapsedMs) || 0,
    archive_format_version:
      Number(source.version) || ARCHIVE_FORMAT_VERSION_,
  };

  if (source.leadId) {
    payload.lead_id = String(source.leadId);
  }

  if (source.counts) {
    payload.counts = source.counts;
  }

  console.log(`[ARCHIVE] ${JSON.stringify(payload)}`);
}


function finishArchiveOperation_(startedAt, result) {
  const value = result || {
    ok: false,
    code: "EXPORT_FAILED",
  };

  logArchiveEvent_({
    code: value.code,
    bundleId: value.bundleId || "",
    leadId: value.logLeadId || "",
    counts: value.counts || null,
    elapsedMs: Date.now() - startedAt,
    version: value.version || ARCHIVE_FORMAT_VERSION_,
  });

  return value;
}


function archiveSheetExists_(sheetName) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(sheetName);

  return Boolean(sheet);
}


function getArchiveConfigNumber_(settingName, fallback) {
  try {
    const value = Number(
      String(getConfigValue_(settingName) || "").trim()
    );

    if (!isFinite(value) || value <= 0) {
      return fallback;
    }

    return Math.floor(value);
  } catch (error) {
    return fallback;
  }
}


function getArchiveStorageFolderId_() {
  try {
    return String(
      getConfigValue_("archive_storage_folder_id") || ""
    ).trim();
  } catch (error) {
    return "";
  }
}


function requireArchiveFormatVersion_() {
  const version = getArchiveConfigNumber_(
    "archive_format_version",
    ARCHIVE_FORMAT_VERSION_
  );

  if (version !== ARCHIVE_FORMAT_VERSION_) {
    return {
      ok: false,
      code: "UNSUPPORTED_VERSION",
    };
  }

  return {
    ok: true,
    version: ARCHIVE_FORMAT_VERSION_,
  };
}


function configSettingExists_(settingName) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Config");

  if (!sheet) {
    return false;
  }

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return false;
  }

  const values = sheet
    .getRange(2, 1, lastRow - 1, 1)
    .getDisplayValues();

  return values.some(
    (row) => String(row[0] || "").trim() === settingName
  );
}


function setConfigValue_(settingName, value) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Config");

  if (!sheet) {
    throw new Error("Config worksheet was not found.");
  }

  const lastRow = sheet.getLastRow();

  if (lastRow >= 2) {
    const rows = sheet
      .getRange(2, 1, lastRow - 1, 1)
      .getDisplayValues();

    for (let index = 0; index < rows.length; index += 1) {
      if (String(rows[index][0] || "").trim() === settingName) {
        sheet.getRange(index + 2, 2).setValue(value);
        EXECUTION_CACHE_.configRows = null;
        return;
      }
    }
  }

  const row = findFirstEmptyDataRow_(sheet, 1);

  sheet.getRange(row, 1).setValue(settingName);
  sheet.getRange(row, 2).setValue(value);
  EXECUTION_CACHE_.configRows = null;
}


function ensureConfigDefault_(settingName, value) {
  if (configSettingExists_(settingName)) {
    return false;
  }

  setConfigValue_(settingName, value);
  return true;
}


function appendMissingSheetHeaders_(sheet, headerNames) {
  const added = [];
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const existing = sheet
    .getRange(1, 1, 1, lastColumn)
    .getDisplayValues()[0];
  const have = {};

  existing.forEach((header) => {
    const name = String(header || "").trim();

    if (name) {
      have[name] = true;
    }
  });

  headerNames.forEach((name) => {
    if (have[name]) {
      return;
    }

    const column = Math.max(sheet.getLastColumn(), 0) + 1;

    sheet.getRange(1, column).setValue(name);
    have[name] = true;
    added.push(name);
  });

  delete EXECUTION_CACHE_.headerMaps[sheet.getName()];
  invalidateCanonicalSheetTable_(sheet.getName());

  return added;
}


function ensureWorksheet_(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  return sheet;
}


const UNUSED_TEMPLATE_ROW_SHEETS_ = Object.freeze([
  Object.freeze({
    sheetName: "Leads",
    idHeader: "lead_id",
    checkboxHeaders: Object.freeze([
      "sms_consent",
      "reached_patient",
      "schedule_date_missing",
      "workflow_complete",
      "duplicate_flag",
      "archived",
    ]),
  }),
  Object.freeze({
    sheetName: "ActivityLog",
    idHeader: "activity_id",
    checkboxHeaders: Object.freeze([
      "reached_patient",
      "system_generated",
    ]),
  }),
  Object.freeze({
    sheetName: "Attachments",
    idHeader: "attachment_id",
    checkboxHeaders: Object.freeze([
      "system_generated",
    ]),
  }),
  Object.freeze({
    sheetName: "Reactions",
    idHeader: "reaction_id",
    checkboxHeaders: Object.freeze([
      "is_active",
    ]),
  }),
  Object.freeze({
    sheetName: "WebsiteIngestLedger",
    idHeader: "submission_id",
    checkboxHeaders: Object.freeze([]),
  }),
  Object.freeze({
    sheetName: ARCHIVE_INDEX_SHEET_NAME_,
    idHeader: "archive_index_id",
    checkboxHeaders: Object.freeze([]),
  }),
]);


function isBlankTemplateValue_(value) {
  if (value == null) {
    return true;
  }

  return typeof value === "string" && value.trim() === "";
}


function headerNameForColumn_(headers, columnNumber) {
  const names = Object.keys(headers || {});

  for (let index = 0; index < names.length; index += 1) {
    if (headers[names[index]] === columnNumber) {
      return names[index];
    }
  }

  return "";
}


function isAllowedUnusedTemplateValue_(value, headerName, checkboxHeaders) {
  if (isBlankTemplateValue_(value)) {
    return true;
  }

  return value === false && checkboxHeaders[headerName] === true;
}


/**
 * Blank identity plus only checkbox FALSE may be
 * cleared. Any id, text, number, timestamp, TRUE,
 * formula, or other value keeps the whole row.
 */
function unusedTemplateRowAction_(
  headers,
  idHeader,
  checkboxHeaders,
  rowValues,
  rowFormulas
) {
  const idColumn = headers[idHeader];

  if (!idColumn) {
    return "skip-sheet";
  }

  if (!isBlankTemplateValue_(rowValues[idColumn - 1])) {
    return "keep";
  }

  let hasDefaultToClear = false;
  const width = Math.max(
    rowValues.length,
    (rowFormulas || []).length
  );

  for (let index = 0; index < width; index += 1) {
    const formula = rowFormulas ? rowFormulas[index] : "";

    if (formula && String(formula).trim()) {
      return "skip";
    }

    const value = rowValues[index];

    if (
      !isAllowedUnusedTemplateValue_(
        value,
        headerNameForColumn_(headers, index + 1),
        checkboxHeaders
      )
    ) {
      return "skip";
    }

    if (value === false) {
      hasDefaultToClear = true;
    }
  }

  return hasDefaultToClear ? "clear" : "blank";
}


function normalizeUnusedTemplateRows_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const summary = {
    normalized_rows: 0,
    skipped_rows: 0,
    sheets_checked: [],
  };

  UNUSED_TEMPLATE_ROW_SHEETS_.forEach((spec) => {
    const sheet = ss.getSheetByName(spec.sheetName);

    if (!sheet) {
      return;
    }

    summary.sheets_checked.push(spec.sheetName);

    const headers = getHeaderMap_(spec.sheetName);

    if (!headers[spec.idHeader]) {
      return;
    }

    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();

    if (lastRow < 2 || lastColumn < 1) {
      return;
    }

    const checkboxHeaders = {};

    spec.checkboxHeaders.forEach((name) => {
      if (headers[name]) {
        checkboxHeaders[name] = true;
      }
    });

    let values;
    let formulas;

    try {
      values = sheet
        .getRange(2, 1, lastRow - 1, lastColumn)
        .getValues();
      formulas = sheet
        .getRange(2, 1, lastRow - 1, lastColumn)
        .getFormulas();
    } catch (error) {
      return;
    }

    const rowsToClear = [];

    values.forEach((rowValues, index) => {
      const action = unusedTemplateRowAction_(
        headers,
        spec.idHeader,
        checkboxHeaders,
        rowValues,
        formulas[index] || []
      );

      if (action === "clear") {
        rowsToClear.push(index + 2);
      } else if (action === "skip") {
        summary.skipped_rows += 1;
      }
    });

    if (!rowsToClear.length) {
      return;
    }

    const blank = new Array(lastColumn).fill("");

    rowsToClear.forEach((rowNumber) => {
      sheet
        .getRange(rowNumber, 1, 1, lastColumn)
        .setValues([blank]);
    });

    summary.normalized_rows += rowsToClear.length;
    invalidateCanonicalSheetTable_(spec.sheetName);
  });

  return summary;
}


function applyArchivedCheckboxValidation_(sheet) {
  delete EXECUTION_CACHE_.headerMaps.Leads;

  const headers = getHeaderMap_("Leads");

  if (!headers.archived) {
    return;
  }

  const maxRows = sheet.getMaxRows();

  if (maxRows < 2) {
    return;
  }

  const rule = SpreadsheetApp
    .newDataValidation()
    .requireCheckbox()
    .build();

  sheet
    .getRange(2, headers.archived, maxRows - 1, 1)
    .setDataValidation(rule);
}


function setupLeadArchiveSchema_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const leads = ss.getSheetByName("Leads");
  const config = ss.getSheetByName("Config");

  if (!leads) {
    return {
      ok: false,
      code: "SCHEMA_MISSING",
    };
  }

  if (!config) {
    return {
      ok: false,
      code: "SCHEMA_MISSING",
    };
  }

  EXECUTION_CACHE_.configRows = null;

  const headersAdded = appendMissingSheetHeaders_(
    leads,
    LEAD_ARCHIVE_HEADER_NAMES_
  );

  try {
    applyArchivedCheckboxValidation_(leads);
  } catch (error) {
    // Header installation still stands if checkbox
    // validation cannot be applied in this runtime.
  }

  const index = ensureWorksheet_(ARCHIVE_INDEX_SHEET_NAME_);

  appendMissingSheetHeaders_(
    index,
    ARCHIVE_INDEX_HEADERS_
  );

  const archive = ensureWorksheet_(ARCHIVE_VIEW_SHEET_NAME_);
  const warnings = [];

  try {
    ensureBackendGuardProtection_(index);
    index.hideSheet();
  } catch (error) {
    warnings.push("ArchiveIndex protection was not applied.");
  }

  try {
    ensureGeneratedViewGuardProtection_(archive);
  } catch (error) {
    warnings.push("Archive tab protection was not applied.");
  }

  const configAdded = [];

  Object.keys(ARCHIVE_CONFIG_DEFAULTS_).forEach((name) => {
    if (
      ensureConfigDefault_(
        name,
        ARCHIVE_CONFIG_DEFAULTS_[name]
      )
    ) {
      configAdded.push(name);
    }
  });

  let normalization = {
    normalized_rows: 0,
    skipped_rows: 0,
    sheets_checked: [],
  };

  try {
    normalization = normalizeUnusedTemplateRows_();
  } catch (error) {
    warnings.push("Unused template rows were not normalized.");
  }

  refreshPatientArchiveView_({
    background: true,
  });

  return {
    ok: true,
    code: "SCHEMA_READY",
    headersAdded,
    configAdded,
    warnings,
    normalization,
  };
}


function setupLeadArchiveSchema() {
  const result = setupLeadArchiveSchema_();

  try {
    const ui = SpreadsheetApp.getUi();

    ui.alert(
      "Lead Archive Schema",
      archiveResultMessage_(result),
      ui.ButtonSet.OK
    );
  } catch (error) {
    // Headless DEV proofs have no spreadsheet UI.
  }

  return result;
}


function normalizeArchiveReason_(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}


function buildLeadArchiveDetail_(headers, getValue, getDisplay) {
  const schemaReady = leadArchiveSchemaReady_(headers);

  if (!schemaReady) {
    return {
      schemaReady: false,
      archived: false,
      canArchive: false,
      canUnarchive: false,
      blockCode: "SCHEMA_MISSING",
      archivedAt: "",
      archivedBy: "",
      archivedFromStatus: "",
      archiveReason: "",
    };
  }

  const archived = isSheetBooleanTrue_(getValue("archived"));
  const status = getDisplay("status");
  const workflowComplete = isSheetBooleanTrue_(
    getValue("workflow_complete")
  );
  const eligibility = evaluateArchiveEligibility_(
    status,
    workflowComplete
  );
  let blockCode = "";

  if (archived) {
    blockCode = "ALREADY_ARCHIVED";
  } else if (!eligibility.ok) {
    blockCode = eligibility.code;
  }

  return {
    schemaReady: true,
    archived,
    canArchive: !archived && eligibility.ok,
    canUnarchive: archived,
    blockCode,
    archivedAt: formatDateTimeForPatientDetail_(
      getValue("archived_at")
    ),
    archivedBy: getDisplay("archived_by"),
    archivedFromStatus: getDisplay("archived_from_status"),
    archiveReason: getDisplay("archive_reason"),
  };
}


function readHeaderValue_(headers, rowValues, name) {
  if (!headers || !headers[name]) {
    return "";
  }

  const value = rowValues[headers[name] - 1];

  return value == null ? "" : value;
}


function readHeaderText_(headers, rowValues, name) {
  return String(
    readHeaderValue_(headers, rowValues, name) || ""
  ).trim();
}


function listArchiveLeadSnapshots_() {
  if (!archiveSheetExists_("Leads")) {
    return {
      ok: false,
      code: "SCHEMA_MISSING",
      leads: [],
    };
  }

  const table = getCanonicalSheetTable_("Leads");

  if (!leadArchiveSchemaReady_(table.headers)) {
    return {
      ok: false,
      code: "SCHEMA_MISSING",
      leads: [],
    };
  }

  const leads = [];

  table.values.forEach((rowValues, index) => {
    const leadId = readHeaderText_(
      table.headers,
      rowValues,
      "lead_id"
    );

    if (!leadId) {
      return;
    }

    leads.push({
      leadId,
      rowNumber: index + 2,
      status: readHeaderText_(
        table.headers,
        rowValues,
        "status"
      ),
      archived: isLeadRowArchived_(
        table.headers,
        rowValues
      ),
      archivedAt: readHeaderValue_(
        table.headers,
        rowValues,
        "archived_at"
      ),
      archivedBy: readHeaderText_(
        table.headers,
        rowValues,
        "archived_by"
      ),
      archivedFromStatus: readHeaderText_(
        table.headers,
        rowValues,
        "archived_from_status"
      ),
      archiveReason: readHeaderText_(
        table.headers,
        rowValues,
        "archive_reason"
      ),
      workflowComplete: isSheetBooleanTrue_(
        readHeaderValue_(
          table.headers,
          rowValues,
          "workflow_complete"
        )
      ),
      firstName: readHeaderText_(
        table.headers,
        rowValues,
        "first_name"
      ),
      lastName: readHeaderText_(
        table.headers,
        rowValues,
        "last_name"
      ),
      appointmentReason: readHeaderText_(
        table.headers,
        rowValues,
        "appointment_reason"
      ),
    });
  });

  return {
    ok: true,
    leads,
  };
}


function forgetLeadCaches_(leadId) {
  invalidateLeadRowSnapshot_(leadId);
  delete EXECUTION_CACHE_.leadRowsById[leadId];
  invalidateCanonicalSheetTable_("Leads");
}


function archiveLeadById_(leadId, options) {
  const startedAt = Date.now();
  const cleanLeadId = String(leadId || "").trim();
  const settings = options || {};

  if (!cleanLeadId) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "NOT_FOUND",
    });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Leads");

  if (!sheet) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "SCHEMA_MISSING",
    });
  }

  const headers = getHeaderMap_("Leads");

  if (!leadArchiveSchemaReady_(headers)) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "SCHEMA_MISSING",
    });
  }

  const row = findLeadRowById_(cleanLeadId);

  if (!row) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "NOT_FOUND",
    });
  }

  const archived = isSheetBooleanTrue_(
    sheet.getRange(row, headers.archived).getValue()
  );

  if (archived) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "ALREADY_ARCHIVED",
      logLeadId: cleanLeadId,
    });
  }

  const status = sheet
    .getRange(row, headers.status)
    .getDisplayValue()
    .trim();
  const workflowComplete = isSheetBooleanTrue_(
    sheet.getRange(row, headers.workflow_complete).getValue()
  );
  const eligibility = evaluateArchiveEligibility_(
    status,
    workflowComplete
  );

  if (!eligibility.ok) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: eligibility.code,
      logLeadId: cleanLeadId,
    });
  }

  const now = new Date();
  const actor = getActorIdentity_();
  const reason = normalizeArchiveReason_(settings.reason);

  setCellByHeader_(
    sheet,
    row,
    headers,
    "archived",
    true
  );
  setCellByHeader_(
    sheet,
    row,
    headers,
    "archived_at",
    now
  );
  setCellByHeader_(
    sheet,
    row,
    headers,
    "archived_by",
    actor.email || actor.name || "Employee"
  );
  setCellByHeader_(
    sheet,
    row,
    headers,
    "archived_from_status",
    status
  );
  setCellByHeader_(
    sheet,
    row,
    headers,
    "archive_reason",
    reason
  );
  updateLeadAuditMetadata_(
    sheet,
    row,
    headers,
    now,
    now,
    actor
  );
  appendActivity_({
    leadId: cleanLeadId,
    occurredAt: now,
    activityType: "lead_archived",
    actorEmail: actor.email,
    actorName: actor.name,
    activitySource: "Employee",
    fieldName: "archived",
    previousValue: "FALSE",
    newValue: "TRUE",
    fromStatus: status,
    toStatus: status,
    note: "",
    systemGenerated: false,
  });
  forgetLeadCaches_(cleanLeadId);

  let refresh = null;

  try {
    refresh = buildPatientDetailCoreRefreshData_(cleanLeadId);
  } catch (error) {
    refresh = null;
  }

  const payload = attachLeadViewInvalidation_(
    {
      ok: true,
      code: "ARCHIVED",
      changed: true,
      logLeadId: cleanLeadId,
      message: archiveResultMessage_("ARCHIVED"),
      refresh,
    },
    LEAD_VIEW_INVALIDATION_.archive
  );

  return finishArchiveOperation_(startedAt, payload);
}


function unarchiveLeadById_(leadId) {
  const startedAt = Date.now();
  const cleanLeadId = String(leadId || "").trim();

  if (!cleanLeadId) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "NOT_FOUND",
    });
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Leads");

  if (!sheet) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "SCHEMA_MISSING",
    });
  }

  const headers = getHeaderMap_("Leads");

  if (!leadArchiveSchemaReady_(headers)) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "SCHEMA_MISSING",
    });
  }

  const row = findLeadRowById_(cleanLeadId);

  if (!row) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "NOT_FOUND",
    });
  }

  if (
    !isSheetBooleanTrue_(
      sheet.getRange(row, headers.archived).getValue()
    )
  ) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "NOT_ARCHIVED",
      logLeadId: cleanLeadId,
    });
  }

  const currentStatus = sheet
    .getRange(row, headers.status)
    .getDisplayValue()
    .trim();
  const priorStatus = sheet
    .getRange(row, headers.archived_from_status)
    .getDisplayValue()
    .trim();
  let finalStatus = currentStatus;

  if (
    priorStatus &&
    priorStatus !== currentStatus &&
    ARCHIVE_ELIGIBLE_STATUSES_.indexOf(priorStatus) >= 0
  ) {
    setCellByHeader_(
      sheet,
      row,
      headers,
      "status",
      priorStatus
    );
    finalStatus = priorStatus;
  }

  const now = new Date();
  const actor = getActorIdentity_();

  setCellByHeader_(
    sheet,
    row,
    headers,
    "archived",
    false
  );
  updateLeadAuditMetadata_(
    sheet,
    row,
    headers,
    now,
    now,
    actor
  );
  appendActivity_({
    leadId: cleanLeadId,
    occurredAt: now,
    activityType: "lead_unarchived",
    actorEmail: actor.email,
    actorName: actor.name,
    activitySource: "Employee",
    fieldName: "archived",
    previousValue: "TRUE",
    newValue: "FALSE",
    fromStatus: currentStatus,
    toStatus: finalStatus,
    note: "",
    systemGenerated: false,
  });
  forgetLeadCaches_(cleanLeadId);

  let refresh = null;

  try {
    refresh = buildPatientDetailCoreRefreshData_(cleanLeadId);
  } catch (error) {
    refresh = null;
  }

  const payload = attachLeadViewInvalidation_(
    {
      ok: true,
      code: "UNARCHIVED",
      changed: true,
      logLeadId: cleanLeadId,
      message: archiveResultMessage_("UNARCHIVED"),
      refresh,
    },
    LEAD_VIEW_INVALIDATION_.archive
  );

  return finishArchiveOperation_(startedAt, payload);
}


function patientDetailArchiveLead(leadId, data) {
  const result = archiveLeadById_(leadId, data || {});

  if (!result.ok) {
    throw new Error(archiveResultMessage_(result));
  }

  return result;
}


function patientDetailUnarchiveLead(leadId) {
  const result = unarchiveLeadById_(leadId);

  if (!result.ok) {
    throw new Error(archiveResultMessage_(result));
  }

  return result;
}


function archiveTimestamp_(value) {
  const decoded = decodeArchiveValue_(value);

  if (
    decoded &&
    typeof decoded.getTime === "function"
  ) {
    const time = decoded.getTime();

    if (!isNaN(time)) {
      return time;
    }
  }

  if (typeof decoded === "number" && isFinite(decoded)) {
    return decoded;
  }

  if (typeof decoded === "string" && decoded.trim()) {
    const parsed = Date.parse(decoded);

    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
}


function archiveAgeDays_(archivedAt, now) {
  const timestamp = archiveTimestamp_(archivedAt);
  const nowTime = now && typeof now.getTime === "function"
    ? now.getTime()
    : NaN;

  if (timestamp == null || isNaN(nowTime)) {
    return null;
  }

  return Math.floor(
    (nowTime - timestamp) / ARCHIVE_DAY_MS_
  );
}


function classifyArchivedLeadAge_(
  archivedAt,
  now,
  reminderDays,
  coldDays
) {
  const days = archiveAgeDays_(archivedAt, now);

  if (days == null || days < reminderDays) {
    return "normal";
  }

  if (days < coldDays) {
    return "approaching";
  }

  return "eligible";
}


function summarizeArchiveAges_(
  leads,
  now,
  reminderDays,
  coldDays
) {
  const summary = {
    total: 0,
    normal: 0,
    approaching: 0,
    eligible: 0,
  };

  (leads || []).forEach((lead) => {
    if (!lead || !lead.archived) {
      return;
    }

    summary.total += 1;
    const bucket = classifyArchivedLeadAge_(
      lead.archivedAt,
      now,
      reminderDays,
      coldDays
    );

    summary[bucket] += 1;
  });

  return summary;
}


function buildArchiveReminderText_(summary) {
  const source = summary || {};
  const total = Number(source.total) || 0;
  const approaching = Number(source.approaching) || 0;
  const eligible = Number(source.eligible) || 0;
  const parts = [
    `Archived in the workbook: ${total}.`,
  ];

  if (approaching > 0 || eligible > 0) {
    parts.push("Archive maintenance:");
  }

  if (approaching > 0) {
    parts.push(
      `${approaching} archived record(s) are at least 6 months old and approaching cold storage.`
    );
  }

  if (eligible > 0) {
    parts.push(
      `${eligible} archived record(s) are eligible for cold storage.`
    );
  }

  if (approaching === 0 && eligible === 0) {
    parts.push("None are in the cold-storage review window.");
  }

  parts.push(
    source.lastColdStorageAt
      ? `Last cold storage: ${source.lastColdStorageAt}.`
      : "Last cold storage: none."
  );
  parts.push(
    `Cold-stored index entries: ${Number(source.coldIndexCount) || 0}.`
  );

  return parts.join(" ");
}


function encodeArchiveValue_(value) {
  if (
    Object.prototype.toString.call(value) === "[object Date]"
  ) {
    if (isNaN(value.getTime())) {
      return "";
    }

    return {
      t: "date",
      v: value.toISOString(),
    };
  }

  if (value == null) {
    return "";
  }

  return value;
}


function decodeArchiveValue_(value) {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    value.t === "date"
  ) {
    const date = new Date(value.v);

    if (!isNaN(date.getTime())) {
      return date;
    }

    return "";
  }

  return value;
}


function sortArchiveJson_(value) {
  if (Array.isArray(value)) {
    return value.map(sortArchiveJson_);
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const sorted = {};

    Object.keys(value).sort().forEach((key) => {
      sorted[key] = sortArchiveJson_(value[key]);
    });

    return sorted;
  }

  return value;
}


function stringifyArchiveJson_(value) {
  return JSON.stringify(sortArchiveJson_(value));
}


function parseArchiveJson_(text) {
  try {
    return JSON.parse(String(text || ""));
  } catch (error) {
    return null;
  }
}


function buildArchiveBundleFileMap_(bundle) {
  const source = bundle || {};
  const manifest = source.manifest || {};

  return {
    "manifest.json": stringifyArchiveJson_(manifest),
    "leads.json": stringifyArchiveJson_(source.leads || []),
    "activity.json": stringifyArchiveJson_(source.activity || []),
    "attachments.json": stringifyArchiveJson_(source.attachments || []),
    "reactions.json": stringifyArchiveJson_(source.reactions || []),
    "website-ingest-ledger.json": stringifyArchiveJson_(
      source.ledger || []
    ),
  };
}


function archiveRecordId_(record, headerName) {
  if (!record || typeof record !== "object") {
    return "";
  }

  return String(record[headerName] || "").trim();
}


function validateArchiveBundleFileMap_(fileMap) {
  const source = fileMap || {};

  for (let index = 0; index < ARCHIVE_BUNDLE_FILE_NAMES_.length; index += 1) {
    const name = ARCHIVE_BUNDLE_FILE_NAMES_[index];

    if (typeof source[name] !== "string") {
      return {
        ok: false,
        code: "MALFORMED_BUNDLE",
      };
    }
  }

  const manifest = parseArchiveJson_(source["manifest.json"]);
  const leads = parseArchiveJson_(source["leads.json"]);
  const activity = parseArchiveJson_(source["activity.json"]);
  const attachments = parseArchiveJson_(source["attachments.json"]);
  const reactions = parseArchiveJson_(source["reactions.json"]);
  const ledger = parseArchiveJson_(
    source["website-ingest-ledger.json"]
  );

  if (
    !manifest ||
    !Array.isArray(leads) ||
    !Array.isArray(activity) ||
    !Array.isArray(attachments) ||
    !Array.isArray(reactions) ||
    !Array.isArray(ledger) ||
    !Array.isArray(manifest.lead_ids) ||
    !manifest.counts
  ) {
    return {
      ok: false,
      code: "MALFORMED_BUNDLE",
    };
  }

  if (
    manifest.archive_format_version == null
  ) {
    return {
      ok: false,
      code: "MALFORMED_BUNDLE",
    };
  }

  if (
    manifest.archive_format_version !== ARCHIVE_FORMAT_VERSION_
  ) {
    return {
      ok: false,
      code: "UNSUPPORTED_VERSION",
    };
  }

  if (
    !/^BUNDLE-[0-9a-f-]+$/i.test(
      String(manifest.bundle_id || "")
    )
  ) {
    return {
      ok: false,
      code: "MALFORMED_BUNDLE",
    };
  }

  const counts = manifest.counts;
  const expectedCounts = {
    leads: leads.length,
    activity: activity.length,
    attachments: attachments.length,
    reactions: reactions.length,
    website_ingest_ledger: ledger.length,
  };
  const countNames = Object.keys(expectedCounts);

  for (let index = 0; index < countNames.length; index += 1) {
    const name = countNames[index];

    if (counts[name] !== expectedCounts[name]) {
      return {
        ok: false,
        code: "MALFORMED_BUNDLE",
      };
    }
  }

  if (manifest.lead_ids.length !== leads.length) {
    return {
      ok: false,
      code: "MALFORMED_BUNDLE",
    };
  }

  const leadIds = {};

  for (let index = 0; index < leads.length; index += 1) {
    const lead = leads[index];
    const leadId = archiveRecordId_(lead, "lead_id");

    if (
      !leadId ||
      leadIds[leadId] ||
      manifest.lead_ids[index] !== leadId ||
      !isSheetBooleanTrue_(
        decodeArchiveValue_(lead.archived)
      )
    ) {
      return {
        ok: false,
        code: "MALFORMED_BUNDLE",
      };
    }

    leadIds[leadId] = true;
  }

  const collections = [
    [activity, "activity_id"],
    [attachments, "attachment_id"],
    [reactions, "reaction_id"],
    [ledger, "submission_id"],
  ];

  for (let group = 0; group < collections.length; group += 1) {
    const records = collections[group][0];
    const idHeader = collections[group][1];
    const seen = {};

    for (let index = 0; index < records.length; index += 1) {
      const record = records[index];
      const recordId = archiveRecordId_(record, idHeader);
      const leadId = archiveRecordId_(record, "lead_id");

      if (
        !recordId ||
        seen[recordId] ||
        !leadIds[leadId]
      ) {
        return {
          ok: false,
          code: "MALFORMED_BUNDLE",
        };
      }

      seen[recordId] = true;
    }
  }

  return {
    ok: true,
    code: "VALID",
    manifest,
    leads,
    activity,
    attachments,
    reactions,
    ledger,
    version: ARCHIVE_FORMAT_VERSION_,
  };
}


function verifyArchiveBundleFileMap_(fileMap, expectedLeadIds) {
  const parsed = validateArchiveBundleFileMap_(fileMap);

  if (!parsed.ok) {
    return {
      ok: false,
      code: parsed.code === "UNSUPPORTED_VERSION"
        ? "UNSUPPORTED_VERSION"
        : "VERIFY_FAILED",
    };
  }

  const expected = (expectedLeadIds || [])
    .map((leadId) => String(leadId || "").trim())
    .filter(Boolean)
    .sort();
  const actual = parsed.manifest.lead_ids.slice().sort();

  if (
    expected.length !== actual.length ||
    expected.some((leadId, index) => leadId !== actual[index])
  ) {
    return {
      ok: false,
      code: "VERIFY_FAILED",
    };
  }

  return parsed;
}


function isSafeArchiveFileName_(name) {
  return /^PatientLeadArchive_\d{4}-\d{2}-\d{2}_[0-9a-fA-F-]+\.zip$/
    .test(String(name || ""));
}


function buildArchiveFileName_(now) {
  const day = Utilities.formatDate(
    now,
    getConfiguredTimezoneWithFallback_(),
    "yyyy-MM-dd"
  );

  return `PatientLeadArchive_${day}_${Utilities.getUuid()}.zip`;
}


function zipArchiveFileMap_(fileMap, fileName) {
  const blobs = ARCHIVE_BUNDLE_FILE_NAMES_.map((name) =>
    Utilities.newBlob(
      fileMap[name],
      "application/json",
      name
    )
  );
  const zipped = Utilities.zip(blobs);

  zipped.setName(fileName);

  return zipped;
}


function unzipArchiveFileMap_(blob) {
  const parts = Utilities.unzip(blob);
  const fileMap = {};

  parts.forEach((part) => {
    const name = String(part.getName() || "")
      .split("/")
      .pop();

    if (name) {
      fileMap[name] = part.getDataAsString();
    }
  });

  return fileMap;
}


function headerNamesByColumn_(headerMap) {
  const names = [];

  Object.keys(headerMap || {}).forEach((name) => {
    names[headerMap[name] - 1] = name;
  });

  return names;
}


function rowToArchiveRecord_(headerMap, rowValues) {
  const record = {};
  const names = headerNamesByColumn_(headerMap);

  for (let index = 0; index < rowValues.length; index += 1) {
    if (!names[index]) {
      continue;
    }

    record[names[index]] = encodeArchiveValue_(rowValues[index]);
  }

  return record;
}


function findSheetRowByColumnValue_(
  sheetName,
  headerName,
  expected
) {
  if (!archiveSheetExists_(sheetName)) {
    return null;
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(sheetName);
  const headers = getHeaderMap_(sheetName);
  const column = headers[headerName];
  const target = String(expected || "").trim();

  if (!column || !target) {
    return null;
  }

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return null;
  }

  const values = sheet
    .getRange(2, column, lastRow - 1, 1)
    .getDisplayValues();

  for (let index = 0; index < values.length; index += 1) {
    if (String(values[index][0] || "").trim() === target) {
      return index + 2;
    }
  }

  return null;
}


function findPresentIds_(sheetName, idHeader, ids) {
  const wanted = {};
  const pending = (ids || [])
    .map((id) => String(id || "").trim())
    .filter(Boolean);

  if (!pending.length || !archiveSheetExists_(sheetName)) {
    return [];
  }

  pending.forEach((id) => {
    wanted[id] = true;
  });

  const table = getCanonicalSheetTable_(sheetName);
  const column = table.headers[idHeader];

  if (!column) {
    return [];
  }

  const found = [];

  table.values.forEach((rowValues) => {
    const id = String(rowValues[column - 1] || "").trim();

    if (wanted[id]) {
      found.push(id);
    }
  });

  return found;
}


function writeRecordOntoEmptyRow_(sheetName, record, idHeader) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(sheetName);
  const headers = getHeaderMap_(sheetName);
  const row = findFirstEmptyDataRow_(sheet, headers[idHeader]);
  const lastColumn = sheet.getLastColumn();
  const rowValues = sheet
    .getRange(row, 1, 1, lastColumn)
    .getValues()[0];

  Object.keys(record || {}).forEach((key) => {
    if (!headers[key]) {
      return;
    }

    rowValues[headers[key] - 1] = decodeArchiveValue_(record[key]);
  });

  sheet.getRange(row, 1, 1, lastColumn).setValues([rowValues]);
  invalidateCanonicalSheetTable_(sheetName);

  return row;
}


function clearOperationalDataRow_(sheetName, rowNumber) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(sheetName);
  const lastColumn = sheet.getLastColumn();

  /*
   * Blank values, not Boolean FALSE. Checkbox and
   * other data validations stay on the range.
   * Formatting is not cleared. A stored FALSE would
   * keep getLastRow() from contracting.
   */
  sheet
    .getRange(rowNumber, 1, 1, lastColumn)
    .setValues([new Array(lastColumn).fill("")]);
  invalidateCanonicalSheetTable_(sheetName);
}


function collectRelatedArchiveRows_(sheetName, leadIds, idHeader) {
  if (!archiveSheetExists_(sheetName)) {
    return [];
  }

  const table = getCanonicalSheetTable_(sheetName);
  const leadColumn = table.headers.lead_id;
  const idColumn = table.headers[idHeader];
  const wanted = {};

  if (!leadColumn || !idColumn) {
    return [];
  }

  leadIds.forEach((leadId) => {
    wanted[leadId] = true;
  });

  const records = [];

  table.values.forEach((rowValues, index) => {
    const leadId = String(rowValues[leadColumn - 1] || "").trim();
    const recordId = String(rowValues[idColumn - 1] || "").trim();

    if (!wanted[leadId] || !recordId) {
      return;
    }

    records.push({
      rowNumber: index + 2,
      leadId,
      record: rowToArchiveRecord_(table.headers, rowValues),
    });
  });

  return records;
}


function gatherColdStorageGroups_(leadIds) {
  const required = [
    "Leads",
    "ActivityLog",
    "Attachments",
    "Reactions",
    ARCHIVE_INDEX_SHEET_NAME_,
  ];

  for (let index = 0; index < required.length; index += 1) {
    if (!archiveSheetExists_(required[index])) {
      return {
        ok: false,
        code: "SCHEMA_MISSING",
      };
    }
  }

  const indexHeaders = getHeaderMap_(ARCHIVE_INDEX_SHEET_NAME_);

  if (
    !ARCHIVE_INDEX_HEADERS_.every((name) => indexHeaders[name])
  ) {
    return {
      ok: false,
      code: "SCHEMA_MISSING",
    };
  }

  const leadsTable = getCanonicalSheetTable_("Leads");

  if (!leadArchiveSchemaReady_(leadsTable.headers)) {
    return {
      ok: false,
      code: "SCHEMA_MISSING",
    };
  }

  const wanted = {};

  leadIds.forEach((leadId) => {
    wanted[leadId] = true;
  });

  const groups = [];

  leadsTable.values.forEach((rowValues, index) => {
    const leadId = readHeaderText_(
      leadsTable.headers,
      rowValues,
      "lead_id"
    );

    if (!wanted[leadId]) {
      return;
    }

    if (!isLeadRowArchived_(leadsTable.headers, rowValues)) {
      groups.push({
        blocked: true,
        leadId,
      });
      return;
    }

    groups.push({
      leadId,
      leadRow: index + 2,
      lead: rowToArchiveRecord_(leadsTable.headers, rowValues),
    });
  });

  if (groups.length !== leadIds.length) {
    return {
      ok: false,
      code: "NOT_FOUND",
    };
  }

  if (groups.some((group) => group.blocked)) {
    return {
      ok: false,
      code: "ACTIVE_LEAD_BLOCKED",
    };
  }

  const activity = collectRelatedArchiveRows_(
    "ActivityLog",
    leadIds,
    "activity_id"
  );
  const attachments = collectRelatedArchiveRows_(
    "Attachments",
    leadIds,
    "attachment_id"
  );
  const reactions = collectRelatedArchiveRows_(
    "Reactions",
    leadIds,
    "reaction_id"
  );
  const ledger = archiveSheetExists_(WEBSITE_INGEST_LEDGER_SHEET_NAME_)
    ? collectRelatedArchiveRows_(
      WEBSITE_INGEST_LEDGER_SHEET_NAME_,
      leadIds,
      "submission_id"
    )
    : [];

  groups.forEach((group) => {
    group.activity = activity.filter(
      (row) => row.leadId === group.leadId
    );
    group.attachments = attachments.filter(
      (row) => row.leadId === group.leadId
    );
    group.reactions = reactions.filter(
      (row) => row.leadId === group.leadId
    );
    group.ledger = ledger.filter(
      (row) => row.leadId === group.leadId
    );
  });

  return {
    ok: true,
    groups,
    counts: {
      leads: groups.length,
      activity: activity.length,
      attachments: attachments.length,
      reactions: reactions.length,
      website_ingest_ledger: ledger.length,
    },
  };
}


function countByArchiveStatus_(leads) {
  const counts = {
    Scheduled: 0,
    "Case Lost": 0,
    Unrelated: 0,
  };

  (leads || []).forEach((lead) => {
    if (Object.prototype.hasOwnProperty.call(counts, lead.status)) {
      counts[lead.status] += 1;
    }
  });

  return counts;
}


function readArchiveSelection_() {
  if (!archiveSheetExists_(ARCHIVE_VIEW_SHEET_NAME_)) {
    return {
      ok: false,
      code: "ARCHIVE_SHEET_MISSING",
      rows: [],
    };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ARCHIVE_VIEW_SHEET_NAME_);
  const lastRow = sheet.getLastRow();
  const rows = [];

  if (lastRow >= 2) {
    const values = sheet
      .getRange(2, 1, lastRow - 1, ARCHIVE_VIEW_COLUMN_COUNT_)
      .getValues();

    values.forEach((row, index) => {
      if (!isSheetBooleanTrue_(row[0])) {
        return;
      }

      const leadId = String(row[9] || "").trim();
      const kind = String(row[10] || "").trim();

      if (kind !== "live" && kind !== "cold") {
        return;
      }

      if (!leadId) {
        return;
      }

      rows.push({
        rowNumber: index + 2,
        leadId,
        kind,
        bundleId: String(row[11] || "").trim(),
      });
    });
  }

  if (
    !rows.length &&
    ss.getActiveSheet() &&
    ss.getActiveSheet().getName() === ARCHIVE_VIEW_SHEET_NAME_
  ) {
    const active = sheet.getActiveRange && sheet.getActiveRange();

    if (active && active.getRow() >= 2) {
      const row = sheet
        .getRange(active.getRow(), 1, 1, ARCHIVE_VIEW_COLUMN_COUNT_)
        .getValues()[0];
      const leadId = String(row[9] || "").trim();
      const kind = String(row[10] || "").trim();

      if (
        leadId &&
        (kind === "live" || kind === "cold")
      ) {
        rows.push({
          rowNumber: active.getRow(),
          leadId,
          kind,
          bundleId: String(row[11] || "").trim(),
        });
      }
    }
  }

  return {
    ok: true,
    rows,
  };
}


function resolveColdStorageSelection_(options) {
  const settings = options || {};
  const scope = String(settings.scope || "").trim();

  if (
    ["selected", "eligible", "all_archived"].indexOf(scope) < 0
  ) {
    return {
      ok: false,
      code: "INVALID_SCOPE",
    };
  }

  if (
    scope === "all_archived" &&
    settings.confirmAllArchived !== true
  ) {
    return {
      ok: false,
      code: "CONFIRMATION_REQUIRED",
    };
  }

  const live = listArchiveLeadSnapshots_();

  if (!live.ok) {
    return live;
  }

  const now = settings.now instanceof Date
    ? settings.now
    : new Date();
  const reminderDays = getArchiveConfigNumber_(
    "archive_reminder_days",
    ARCHIVE_REMINDER_DAYS_DEFAULT_
  );
  const coldDays = getArchiveConfigNumber_(
    "archive_cold_storage_days",
    ARCHIVE_COLD_STORAGE_DAYS_DEFAULT_
  );
  const byId = {};

  live.leads.forEach((lead) => {
    byId[lead.leadId] = lead;
  });

  let chosen = [];

  if (scope === "selected") {
    let ids = [];

    if (Array.isArray(settings.leadIds)) {
      ids = settings.leadIds
        .map((leadId) => String(leadId || "").trim())
        .filter(Boolean);
    } else {
      const selection = readArchiveSelection_();

      if (!selection.ok) {
        return selection;
      }

      ids = selection.rows
        .filter((row) => row.kind === "live")
        .map((row) => row.leadId);
    }

    if (!ids.length) {
      return {
        ok: false,
        code: "NOTHING_SELECTED",
      };
    }

    for (let index = 0; index < ids.length; index += 1) {
      const lead = byId[ids[index]];

      if (!lead || !lead.archived) {
        return {
          ok: false,
          code: "ACTIVE_LEAD_BLOCKED",
        };
      }

      chosen.push(lead);
    }
  } else if (scope === "eligible") {
    chosen = live.leads.filter((lead) =>
      lead.archived &&
      classifyArchivedLeadAge_(
        lead.archivedAt,
        now,
        reminderDays,
        coldDays
      ) === "eligible"
    );
  } else {
    chosen = live.leads.filter((lead) => lead.archived);
  }

  const seen = {};
  const unique = [];

  chosen.forEach((lead) => {
    if (seen[lead.leadId]) {
      return;
    }

    seen[lead.leadId] = true;
    unique.push(lead);
  });

  return {
    ok: true,
    scope,
    now,
    coldDays,
    leads: unique,
    leadIds: unique.map((lead) => lead.leadId),
    byStatus: countByArchiveStatus_(unique),
  };
}


function withColdStorageLock_(callback) {
  const lock = LockService.getScriptLock();
  let acquired = false;

  try {
    lock.waitLock(COLD_STORAGE_LOCK_WAIT_MS_);
    acquired = true;
  } catch (error) {
    return {
      ok: false,
      code: "LOCK_TIMEOUT",
    };
  }

  try {
    return callback();
  } finally {
    if (acquired) {
      try {
        lock.releaseLock();
      } catch (error) {
        // The operation result is already decided.
      }
    }
  }
}


function trashDriveFileQuietly_(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);

    if (file.setTrashed) {
      file.setTrashed(true);
    }

    return true;
  } catch (error) {
    return false;
  }
}


function writeArchiveBundleFile_(folderId, blob) {
  const folder = DriveApp.getFolderById(folderId);
  const file = folder.createFile(blob);

  return {
    fileId: file.getId(),
    fileName: file.getName(),
  };
}


function loadArchiveBundleFileMapFromDrive_(fileId) {
  const file = DriveApp.getFileById(fileId);

  if (
    file.isTrashed &&
    file.isTrashed()
  ) {
    throw new Error("trashed");
  }

  return {
    fileName: file.getName(),
    fileMap: unzipArchiveFileMap_(file.getBlob()),
  };
}


function partialColdStorageInstructions_(info) {
  return [
    "Operational cleanup did not finish.",
    "Do not start another export for this bundle.",
    `Bundle id: ${info.bundleId || ""}.`,
    `Drive file id: ${info.fileId || ""}.`,
    `Cleared lead count: ${info.clearedCount || 0}.`,
    `Remaining lead count: ${info.remainingCount || 0}.`,
    "Run ADMIN: Resume Cold Storage Cleanup and paste the Drive file id.",
  ].join(" ");
}


function upsertArchiveIndexEntry_(entry) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(ARCHIVE_INDEX_SHEET_NAME_);
  const headers = getHeaderMap_(ARCHIVE_INDEX_SHEET_NAME_);
  let row = findSheetRowByColumnValue_(
    ARCHIVE_INDEX_SHEET_NAME_,
    "lead_id",
    entry.lead_id
  );

  if (!row) {
    row = findFirstEmptyDataRow_(
      sheet,
      headers.archive_index_id
    );
  }

  if (!entry.archive_index_id) {
    const existing = row
      ? String(
        sheet
          .getRange(row, headers.archive_index_id)
          .getDisplayValue() || ""
      ).trim()
      : "";

    entry.archive_index_id = existing || generateSystemId_("AIDX");
  }

  const lastColumn = sheet.getLastColumn();
  const values = sheet
    .getRange(row, 1, 1, lastColumn)
    .getValues()[0];

  ARCHIVE_INDEX_HEADERS_.forEach((name) => {
    if (
      !headers[name] ||
      !Object.prototype.hasOwnProperty.call(entry, name)
    ) {
      return;
    }

    values[headers[name] - 1] = entry[name];
  });

  sheet.getRange(row, 1, 1, lastColumn).setValues([values]);
  invalidateCanonicalSheetTable_(ARCHIVE_INDEX_SHEET_NAME_);

  return row;
}


function indexEntryFromLeadRecord_(
  lead,
  bundleId,
  fileId,
  offloadedAt
) {
  return {
    lead_id: archiveRecordId_(lead, "lead_id"),
    first_name: String(
      decodeArchiveValue_(lead.first_name) || ""
    ),
    last_name: String(
      decodeArchiveValue_(lead.last_name) || ""
    ),
    archived_from_status: String(
      decodeArchiveValue_(lead.archived_from_status) || ""
    ),
    archived_at: decodeArchiveValue_(lead.archived_at) || "",
    offloaded_at: offloadedAt,
    bundle_id: bundleId,
    bundle_file_id: fileId,
    bundle_format_version: ARCHIVE_FORMAT_VERSION_,
    restored_at: "",
    restored_by: "",
  };
}


function clearColdStorageGroup_(group) {
  const sheets = [
    ["ActivityLog", group.activity],
    ["Attachments", group.attachments],
    ["Reactions", group.reactions],
    [WEBSITE_INGEST_LEDGER_SHEET_NAME_, group.ledger],
  ];

  sheets.forEach(([sheetName, rows]) => {
    if (!archiveSheetExists_(sheetName)) {
      return;
    }

    (rows || []).forEach((row) => {
      clearOperationalDataRow_(sheetName, row.rowNumber);
    });
  });

  clearOperationalDataRow_("Leads", group.leadRow);
  forgetLeadCaches_(group.leadId);
}


function clearColdStorageGroups_(groups, options) {
  const settings = options || {};
  const cleared = [];
  const remaining = [];

  for (let index = 0; index < groups.length; index += 1) {
    if (
      settings.failPoint === "clear-after-first" &&
      index > 0
    ) {
      groups.slice(index).forEach((group) => {
        remaining.push(group.leadId);
      });

      return {
        ok: false,
        cleared,
        remaining,
      };
    }

    try {
      clearColdStorageGroup_(groups[index]);
      cleared.push(groups[index].leadId);
    } catch (error) {
      remaining.push(groups[index].leadId);
      groups.slice(index + 1).forEach((group) => {
        remaining.push(group.leadId);
      });

      return {
        ok: false,
        cleared,
        remaining,
      };
    }
  }

  return {
    ok: true,
    cleared,
    remaining,
  };
}


function rememberColdStorageSuccess_(bundleId, when) {
  try {
    setConfigValue_(
      "archive_last_cold_storage_at",
      when.toISOString()
    );
    setConfigValue_(
      "archive_last_cold_storage_bundle_id",
      bundleId
    );
  } catch (error) {
    // The verified bundle and cleanup remain the source of truth.
  }
}


function markBoardAndDashboardDirty_() {
  registerDerivedViewDirtyFlags_({
    board: true,
    dashboard: true,
  });
}


function offloadArchivedLeadsUnlocked_(options) {
  const settings = options || {};
  const resolved = resolveColdStorageSelection_(settings);

  if (!resolved.ok) {
    return resolved;
  }

  const versionCheck = requireArchiveFormatVersion_();

  if (!versionCheck.ok) {
    return versionCheck;
  }

  if (settings.dryRun) {
    return {
      ok: true,
      code: "DRY_RUN",
      dryRun: true,
      scope: resolved.scope,
      leadIds: resolved.leadIds,
      byStatus: resolved.byStatus,
      counts: {
        leads: resolved.leadIds.length,
      },
      version: ARCHIVE_FORMAT_VERSION_,
    };
  }

  if (!resolved.leadIds.length) {
    return {
      ok: true,
      code: "NOTHING_TO_OFFLOAD",
      leadIds: [],
      counts: {
        leads: 0,
      },
    };
  }

  const folderId = getArchiveStorageFolderId_();

  if (!folderId) {
    return {
      ok: false,
      code: "FOLDER_MISSING",
    };
  }

  const gathered = gatherColdStorageGroups_(resolved.leadIds);

  if (!gathered.ok) {
    return gathered;
  }

  const now = new Date();
  const actor = getActorIdentity_();
  const bundleId = generateSystemId_("BUNDLE");
  const fileName = buildArchiveFileName_(now);
  const fileMap = buildArchiveBundleFileMap_({
    manifest: {
      archive_format_version: ARCHIVE_FORMAT_VERSION_,
      bundle_id: bundleId,
      created_at: now.toISOString(),
      created_by: actor.email || actor.name || "Employee",
      scope: resolved.scope,
      cold_storage_threshold_days: resolved.coldDays,
      lead_ids: gathered.groups.map((group) => group.leadId),
      counts: gathered.counts,
    },
    leads: gathered.groups.map((group) => group.lead),
    activity: gathered.groups.reduce(
      (rows, group) => rows.concat(
        group.activity.map((row) => row.record)
      ),
      []
    ),
    attachments: gathered.groups.reduce(
      (rows, group) => rows.concat(
        group.attachments.map((row) => row.record)
      ),
      []
    ),
    reactions: gathered.groups.reduce(
      (rows, group) => rows.concat(
        group.reactions.map((row) => row.record)
      ),
      []
    ),
    ledger: gathered.groups.reduce(
      (rows, group) => rows.concat(
        group.ledger.map((row) => row.record)
      ),
      []
    ),
  });

  if (!isSafeArchiveFileName_(fileName)) {
    return {
      ok: false,
      code: "EXPORT_FAILED",
    };
  }

  let fileId = "";

  try {
    if (settings.failPoint === "export") {
      throw new Error("export");
    }

    try {
      DriveApp.getFolderById(folderId);
    } catch (error) {
      return {
        ok: false,
        code: "FOLDER_MISSING",
      };
    }

    const written = writeArchiveBundleFile_(
      folderId,
      zipArchiveFileMap_(fileMap, fileName)
    );

    fileId = written.fileId;
  } catch (error) {
    if (fileId) {
      trashDriveFileQuietly_(fileId);
    }

    return {
      ok: false,
      code: "EXPORT_FAILED",
    };
  }

  if (settings.failPoint === "verify") {
    const trashed = trashDriveFileQuietly_(fileId);

    return {
      ok: false,
      code: "VERIFY_FAILED",
      bundleId,
      fileId,
      instructions: trashed
        ? "The unverified file was moved to trash. Operational records were not changed."
        : `Operational records were not changed. Do not import the unverified file. File id: ${fileId}.`,
    };
  }

  let loaded;

  try {
    loaded = loadArchiveBundleFileMapFromDrive_(fileId);
  } catch (error) {
    const trashed = trashDriveFileQuietly_(fileId);

    return {
      ok: false,
      code: "VERIFY_FAILED",
      bundleId,
      fileId,
      instructions: trashed
        ? "The unverified file was moved to trash. Operational records were not changed."
        : `Operational records were not changed. Do not import the unverified file. File id: ${fileId}.`,
    };
  }

  if (!isSafeArchiveFileName_(loaded.fileName)) {
    trashDriveFileQuietly_(fileId);

    return {
      ok: false,
      code: "VERIFY_FAILED",
      bundleId,
      fileId,
    };
  }

  const verified = verifyArchiveBundleFileMap_(
    loaded.fileMap,
    gathered.groups.map((group) => group.leadId)
  );

  if (!verified.ok) {
    trashDriveFileQuietly_(fileId);

    return {
      ok: false,
      code: "VERIFY_FAILED",
      bundleId,
      fileId,
      instructions:
        "Operational records were not changed.",
    };
  }

  if (settings.failPoint === "index") {
    return {
      ok: false,
      code: "PARTIAL",
      bundleId,
      fileId,
      version: ARCHIVE_FORMAT_VERSION_,
      counts: gathered.counts,
      clearedCount: 0,
      remainingCount: gathered.groups.length,
      instructions: partialColdStorageInstructions_({
        bundleId,
        fileId,
        clearedCount: 0,
        remainingCount: gathered.groups.length,
      }),
    };
  }

  try {
    gathered.groups.forEach((group) => {
      upsertArchiveIndexEntry_(
        indexEntryFromLeadRecord_(
          group.lead,
          bundleId,
          fileId,
          now
        )
      );
    });
  } catch (error) {
    return {
      ok: false,
      code: "PARTIAL",
      bundleId,
      fileId,
      version: ARCHIVE_FORMAT_VERSION_,
      counts: gathered.counts,
      clearedCount: 0,
      remainingCount: gathered.groups.length,
      instructions: partialColdStorageInstructions_({
        bundleId,
        fileId,
        clearedCount: 0,
        remainingCount: gathered.groups.length,
      }),
    };
  }

  if (settings.failPoint === "clear") {
    return {
      ok: false,
      code: "PARTIAL",
      bundleId,
      fileId,
      version: ARCHIVE_FORMAT_VERSION_,
      counts: gathered.counts,
      clearedCount: 0,
      remainingCount: gathered.groups.length,
      instructions: partialColdStorageInstructions_({
        bundleId,
        fileId,
        clearedCount: 0,
        remainingCount: gathered.groups.length,
      }),
    };
  }

  const cleared = clearColdStorageGroups_(
    gathered.groups,
    settings
  );

  if (!cleared.ok) {
    return {
      ok: false,
      code: "PARTIAL",
      bundleId,
      fileId,
      version: ARCHIVE_FORMAT_VERSION_,
      counts: gathered.counts,
      clearedCount: cleared.cleared.length,
      remainingCount: cleared.remaining.length,
      instructions: partialColdStorageInstructions_({
        bundleId,
        fileId,
        clearedCount: cleared.cleared.length,
        remainingCount: cleared.remaining.length,
      }),
    };
  }

  rememberColdStorageSuccess_(bundleId, now);
  markBoardAndDashboardDirty_();

  return {
    ok: true,
    code: "SUCCESS",
    bundleId,
    fileId,
    fileName,
    version: ARCHIVE_FORMAT_VERSION_,
    counts: gathered.counts,
    byStatus: resolved.byStatus,
    leadIds: gathered.groups.map((group) => group.leadId),
  };
}


function offloadArchivedLeads_(options) {
  const startedAt = Date.now();
  const result = withColdStorageLock_(() =>
    offloadArchivedLeadsUnlocked_(options || {})
  );

  return finishArchiveOperation_(startedAt, result);
}


function publicArchiveResult_(result) {
  const value = result || {
    ok: false,
    code: "EXPORT_FAILED",
  };

  return {
    ok: value.ok === true,
    code: value.code || "",
    message: archiveResultMessage_(value),
    dryRun: value.dryRun === true,
    counts: value.counts || null,
    byStatus: value.byStatus || null,
    unavailableAttachmentCount:
      Number(value.unavailableAttachmentCount) || 0,
  };
}


function previewArchiveMaintenance(scope, confirmAllArchived) {
  return publicArchiveResult_(
    offloadArchivedLeads_({
      scope,
      confirmAllArchived: confirmAllArchived === true,
      dryRun: true,
    })
  );
}


function runArchiveMaintenance(scope, confirmAllArchived) {
  return publicArchiveResult_(
    offloadArchivedLeads_({
      scope,
      confirmAllArchived: confirmAllArchived === true,
    })
  );
}


function listArchiveIndexRecords_() {
  if (!archiveSheetExists_(ARCHIVE_INDEX_SHEET_NAME_)) {
    return [];
  }

  const table = getCanonicalSheetTable_(ARCHIVE_INDEX_SHEET_NAME_);
  const headers = table.headers;

  if (!headers.lead_id || !headers.bundle_file_id) {
    return [];
  }

  const records = [];

  table.values.forEach((rowValues, index) => {
    const leadId = readHeaderText_(headers, rowValues, "lead_id");

    if (!leadId) {
      return;
    }

    records.push({
      rowNumber: index + 2,
      leadId,
      firstName: readHeaderText_(headers, rowValues, "first_name"),
      lastName: readHeaderText_(headers, rowValues, "last_name"),
      archivedFromStatus: readHeaderText_(
        headers,
        rowValues,
        "archived_from_status"
      ),
      archivedAt: readHeaderValue_(headers, rowValues, "archived_at"),
      offloadedAt: readHeaderValue_(headers, rowValues, "offloaded_at"),
      bundleId: readHeaderText_(headers, rowValues, "bundle_id"),
      bundleFileId: readHeaderText_(
        headers,
        rowValues,
        "bundle_file_id"
      ),
      restoredAt: readHeaderValue_(headers, rowValues, "restored_at"),
      restoredBy: readHeaderText_(headers, rowValues, "restored_by"),
    });
  });

  return records;
}


function countActiveColdIndexEntries_() {
  return listArchiveIndexRecords_().filter(
    (record) => !String(record.restoredAt || "").trim()
  ).length;
}


function readLastColdStorageAt_() {
  try {
    return String(
      getConfigValue_("archive_last_cold_storage_at") || ""
    ).trim();
  } catch (error) {
    return "";
  }
}


function resumeColdStorageCleanup_(options) {
  const startedAt = Date.now();
  const result = withColdStorageLock_(() =>
    resumeColdStorageCleanupUnlocked_(options || {})
  );

  return finishArchiveOperation_(startedAt, result);
}


function resumeColdStorageCleanupUnlocked_(options) {
  const fileId = String(
    (options && options.fileId) || ""
  ).trim();

  if (!fileId) {
    return {
      ok: false,
      code: "NOT_FOUND",
    };
  }

  let loaded;

  try {
    loaded = loadArchiveBundleFileMapFromDrive_(fileId);
  } catch (error) {
    return {
      ok: false,
      code: "NOT_FOUND",
    };
  }

  const parsed = validateArchiveBundleFileMap_(loaded.fileMap);

  if (!parsed.ok) {
    return {
      ok: false,
      code: parsed.code,
    };
  }

  if (!archiveSheetExists_(ARCHIVE_INDEX_SHEET_NAME_)) {
    return {
      ok: false,
      code: "SCHEMA_MISSING",
    };
  }

  const now = new Date();
  let clearedCount = 0;
  let skippedCount = 0;

  for (let index = 0; index < parsed.leads.length; index += 1) {
    const lead = parsed.leads[index];
    const leadId = archiveRecordId_(lead, "lead_id");
    const row = findLeadRowById_(leadId);
    let archived = false;

    if (row) {
      const headers = getHeaderMap_("Leads");
      const sheet = SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName("Leads");

      archived = isSheetBooleanTrue_(
        sheet.getRange(row, headers.archived).getValue()
      );

      if (!archived) {
        skippedCount += 1;
        continue;
      }
    }

    try {
      upsertArchiveIndexEntry_(
        indexEntryFromLeadRecord_(
          lead,
          parsed.manifest.bundle_id,
          fileId,
          decodeArchiveValue_(parsed.manifest.created_at) || now
        )
      );
    } catch (error) {
      return {
        ok: false,
        code: "PARTIAL",
        bundleId: parsed.manifest.bundle_id,
        fileId,
        instructions: partialColdStorageInstructions_({
          bundleId: parsed.manifest.bundle_id,
          fileId,
          clearedCount,
          remainingCount: parsed.leads.length - index,
        }),
      };
    }

    if (!row) {
      [
        "ActivityLog",
        "Attachments",
        "Reactions",
        WEBSITE_INGEST_LEDGER_SHEET_NAME_,
      ].forEach((sheetName) => {
        const idHeader = sheetName === "ActivityLog"
          ? "activity_id"
          : sheetName === "Attachments"
            ? "attachment_id"
            : sheetName === "Reactions"
              ? "reaction_id"
              : "submission_id";

        collectRelatedArchiveRows_(sheetName, [leadId], idHeader)
          .forEach((related) => {
            clearOperationalDataRow_(sheetName, related.rowNumber);
          });
      });
      clearedCount += 1;
      continue;
    }

    const group = gatherColdStorageGroups_([leadId]);

    if (!group.ok) {
      return {
        ok: false,
        code: "PARTIAL",
        bundleId: parsed.manifest.bundle_id,
        fileId,
        instructions: partialColdStorageInstructions_({
          bundleId: parsed.manifest.bundle_id,
          fileId,
          clearedCount,
          remainingCount: parsed.leads.length - index,
        }),
      };
    }

    clearColdStorageGroups_(group.groups, {});
    clearedCount += 1;
  }

  rememberColdStorageSuccess_(
    parsed.manifest.bundle_id,
    now
  );
  markBoardAndDashboardDirty_();

  return {
    ok: true,
    code: skippedCount ? "CLEANUP_FINISHED" : "SUCCESS",
    bundleId: parsed.manifest.bundle_id,
    fileId,
    version: ARCHIVE_FORMAT_VERSION_,
    counts: parsed.manifest.counts,
    skippedCount,
    clearedCount,
  };
}


function resumeColdStorageCleanup(fileId) {
  return publicArchiveResult_(
    resumeColdStorageCleanup_({
      fileId,
    })
  );
}


function promptResumeColdStorageCleanup() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    "Resume Cold Storage Cleanup",
    "Paste the Drive file id from the partial cold-storage result. This does not create a new export.",
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const result = resumeColdStorageCleanup_({
    fileId: response.getResponseText(),
  });

  ui.alert(
    "Cold Storage Cleanup",
    archiveResultMessage_(result),
    ui.ButtonSet.OK
  );
}


function importArchiveBundle_(options) {
  const startedAt = Date.now();
  const fileId = String(
    (options && options.fileId) || ""
  ).trim();

  if (!fileId) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "NOT_FOUND",
    });
  }

  if (!archiveSheetExists_(ARCHIVE_INDEX_SHEET_NAME_)) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "SCHEMA_MISSING",
    });
  }

  let loaded;

  try {
    loaded = loadArchiveBundleFileMapFromDrive_(fileId);
  } catch (error) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "NOT_FOUND",
    });
  }

  const parsed = validateArchiveBundleFileMap_(loaded.fileMap);

  if (!parsed.ok) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: parsed.code,
    });
  }

  const existingIndex = listArchiveIndexRecords_();

  if (
    existingIndex.some(
      (record) => record.bundleId === parsed.manifest.bundle_id
    )
  ) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "ALREADY_IMPORTED",
      bundleId: parsed.manifest.bundle_id,
    });
  }

  for (let index = 0; index < parsed.leads.length; index += 1) {
    const leadId = archiveRecordId_(parsed.leads[index], "lead_id");

    if (findLeadRowById_(leadId)) {
      return finishArchiveOperation_(startedAt, {
        ok: false,
        code: "ALREADY_PRESENT",
        conflict: "lead_id",
        bundleId: parsed.manifest.bundle_id,
      });
    }

    if (
      existingIndex.some((record) => record.leadId === leadId)
    ) {
      return finishArchiveOperation_(startedAt, {
        ok: false,
        code: "ALREADY_IMPORTED",
        bundleId: parsed.manifest.bundle_id,
      });
    }
  }

  const offloadedAt = decodeArchiveValue_(parsed.manifest.created_at)
    || new Date();

  try {
    parsed.leads.forEach((lead) => {
      upsertArchiveIndexEntry_(
        indexEntryFromLeadRecord_(
          lead,
          parsed.manifest.bundle_id,
          fileId,
          offloadedAt
        )
      );
    });
  } catch (error) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "PARTIAL",
      bundleId: parsed.manifest.bundle_id,
      fileId,
      instructions:
        "Import validation passed, but the archive index was not fully written. Do not restore until ADMIN: Resume Cold Storage Cleanup has been run for this Drive file id.",
    });
  }

  return finishArchiveOperation_(startedAt, {
    ok: true,
    code: "SUCCESS",
    bundleId: parsed.manifest.bundle_id,
    fileId,
    version: ARCHIVE_FORMAT_VERSION_,
    counts: parsed.manifest.counts,
  });
}


function importArchiveBundle(fileId) {
  return publicArchiveResult_(
    importArchiveBundle_({
      fileId,
    })
  );
}


function attachmentUnavailableCount_(attachments) {
  let count = 0;

  (attachments || []).forEach((record) => {
    const fileId = archiveRecordId_(record, "drive_file_id");

    if (!fileId) {
      count += 1;
      return;
    }

    try {
      const file = DriveApp.getFileById(fileId);

      if (file.isTrashed && file.isTrashed()) {
        count += 1;
      }
    } catch (error) {
      count += 1;
    }
  });

  return count;
}


function restoreColdStoredLead_(options) {
  const startedAt = Date.now();
  const settings = options || {};
  const leadId = String(settings.leadId || "").trim();

  if (!leadId) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "NOT_FOUND",
    });
  }

  const indexRows = listArchiveIndexRecords_()
    .filter((record) => record.leadId === leadId);
  const activeIndex = indexRows.find(
    (record) => !String(record.restoredAt || "").trim()
  ) || indexRows[indexRows.length - 1];
  const fileId = String(
    settings.fileId ||
    (activeIndex && activeIndex.bundleFileId) ||
    ""
  ).trim();

  if (!fileId) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "NOT_FOUND",
      logLeadId: leadId,
    });
  }

  let loaded;

  try {
    loaded = loadArchiveBundleFileMapFromDrive_(fileId);
  } catch (error) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "NOT_FOUND",
      logLeadId: leadId,
    });
  }

  const parsed = validateArchiveBundleFileMap_(loaded.fileMap);

  if (!parsed.ok) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: parsed.code,
      bundleId: "",
      logLeadId: leadId,
    });
  }

  const lead = parsed.leads.find(
    (record) => archiveRecordId_(record, "lead_id") === leadId
  );

  if (!lead) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "NOT_FOUND",
      bundleId: parsed.manifest.bundle_id,
      logLeadId: leadId,
    });
  }

  const activity = parsed.activity.filter(
    (record) => archiveRecordId_(record, "lead_id") === leadId
  );
  const attachments = parsed.attachments.filter(
    (record) => archiveRecordId_(record, "lead_id") === leadId
  );
  const reactions = parsed.reactions.filter(
    (record) => archiveRecordId_(record, "lead_id") === leadId
  );
  const ledger = parsed.ledger.filter(
    (record) => archiveRecordId_(record, "lead_id") === leadId
  );

  if (!settings.resume && findLeadRowById_(leadId)) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "ALREADY_PRESENT",
      conflict: "lead_id",
      bundleId: parsed.manifest.bundle_id,
      logLeadId: leadId,
    });
  }

  const duplicateActivity = findPresentIds_(
    "ActivityLog",
    "activity_id",
    activity.map((record) => archiveRecordId_(record, "activity_id"))
  );

  if (duplicateActivity.length && !settings.resume) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "ALREADY_PRESENT",
      conflict: "activity_id",
      bundleId: parsed.manifest.bundle_id,
      logLeadId: leadId,
    });
  }

  const duplicateAttachments = findPresentIds_(
    "Attachments",
    "attachment_id",
    attachments.map((record) =>
      archiveRecordId_(record, "attachment_id")
    )
  );
  const duplicateReactions = findPresentIds_(
    "Reactions",
    "reaction_id",
    reactions.map((record) => archiveRecordId_(record, "reaction_id"))
  );
  const duplicateLedger = findPresentIds_(
    WEBSITE_INGEST_LEDGER_SHEET_NAME_,
    "submission_id",
    ledger.map((record) => archiveRecordId_(record, "submission_id"))
  );

  if (
    !settings.resume &&
    (
      duplicateAttachments.length ||
      duplicateReactions.length ||
      duplicateLedger.length
    )
  ) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "ALREADY_PRESENT",
      conflict: duplicateAttachments.length
        ? "attachment_id"
        : duplicateReactions.length
          ? "reaction_id"
          : "submission_id",
      bundleId: parsed.manifest.bundle_id,
      logLeadId: leadId,
    });
  }

  const leadRecord = Object.assign({}, lead, {
    archived: true,
  });

  try {
    if (!findLeadRowById_(leadId)) {
      writeRecordOntoEmptyRow_("Leads", leadRecord, "lead_id");
      forgetLeadCaches_(leadId);
    }

    activity.forEach((record) => {
      const activityId = archiveRecordId_(record, "activity_id");

      if (
        !findPresentIds_("ActivityLog", "activity_id", [activityId]).length
      ) {
        writeRecordOntoEmptyRow_("ActivityLog", record, "activity_id");
      }
    });
    attachments.forEach((record) => {
      const attachmentId = archiveRecordId_(record, "attachment_id");

      if (
        !findPresentIds_(
          "Attachments",
          "attachment_id",
          [attachmentId]
        ).length
      ) {
        writeRecordOntoEmptyRow_(
          "Attachments",
          record,
          "attachment_id"
        );
      }
    });
    reactions.forEach((record) => {
      const reactionId = archiveRecordId_(record, "reaction_id");

      if (
        !findPresentIds_("Reactions", "reaction_id", [reactionId]).length
      ) {
        writeRecordOntoEmptyRow_("Reactions", record, "reaction_id");
      }
    });

    if (archiveSheetExists_(WEBSITE_INGEST_LEDGER_SHEET_NAME_)) {
      ledger.forEach((record) => {
        const submissionId = archiveRecordId_(record, "submission_id");

        if (
          !findPresentIds_(
            WEBSITE_INGEST_LEDGER_SHEET_NAME_,
            "submission_id",
            [submissionId]
          ).length
        ) {
          writeRecordOntoEmptyRow_(
            WEBSITE_INGEST_LEDGER_SHEET_NAME_,
            record,
            "submission_id"
          );
        }
      });
    }
  } catch (error) {
    return finishArchiveOperation_(startedAt, {
      ok: false,
      code: "PARTIAL",
      bundleId: parsed.manifest.bundle_id,
      fileId,
      logLeadId: leadId,
      instructions:
        "Restoration did not finish. Do not create a new lead id. Run restore again with resume for the same Drive file id and lead id.",
    });
  }

  const unavailableAttachmentCount =
    attachmentUnavailableCount_(attachments);
  const actor = getActorIdentity_();
  const now = new Date();

  appendActivity_({
    leadId,
    occurredAt: now,
    activityType: "lead_restored",
    actorEmail: actor.email,
    actorName: actor.name,
    activitySource: "Employee",
    fieldName: "cold_storage",
    previousValue: parsed.manifest.bundle_id,
    newValue: settings.unarchive === true
      ? "restored_unarchived"
      : "restored_archived",
    note: "",
    systemGenerated: true,
  });

  if (activeIndex || indexRows.length || fileId) {
    upsertArchiveIndexEntry_({
      lead_id: leadId,
      first_name: String(decodeArchiveValue_(lead.first_name) || ""),
      last_name: String(decodeArchiveValue_(lead.last_name) || ""),
      archived_from_status: String(
        decodeArchiveValue_(lead.archived_from_status) || ""
      ),
      archived_at: decodeArchiveValue_(lead.archived_at) || "",
      offloaded_at: activeIndex
        ? activeIndex.offloadedAt
        : (decodeArchiveValue_(parsed.manifest.created_at) || now),
      bundle_id: parsed.manifest.bundle_id,
      bundle_file_id: fileId,
      bundle_format_version: ARCHIVE_FORMAT_VERSION_,
      restored_at: now,
      restored_by: actor.email || actor.name || "Employee",
    });
  }

  forgetLeadCaches_(leadId);
  markBoardAndDashboardDirty_();

  if (settings.unarchive === true) {
    const unarchived = unarchiveLeadById_(leadId);

    if (!unarchived.ok) {
      return finishArchiveOperation_(startedAt, {
        ok: false,
        code: "PARTIAL",
        bundleId: parsed.manifest.bundle_id,
        fileId,
        logLeadId: leadId,
        unavailableAttachmentCount,
        instructions:
          "The lead was restored into the Archive. Unarchive did not finish. Use Unarchive Selected Patient. Do not restore again.",
      });
    }

    return finishArchiveOperation_(startedAt, {
      ok: true,
      code: "RESTORED_UNARCHIVED",
      bundleId: parsed.manifest.bundle_id,
      fileId,
      version: ARCHIVE_FORMAT_VERSION_,
      logLeadId: leadId,
      unavailableAttachmentCount,
      refresh: unarchived.refresh,
      invalidation: unarchived.invalidation,
    });
  }

  return finishArchiveOperation_(startedAt, {
    ok: true,
    code: "RESTORED",
    bundleId: parsed.manifest.bundle_id,
    fileId,
    version: ARCHIVE_FORMAT_VERSION_,
    logLeadId: leadId,
    unavailableAttachmentCount,
    message: archiveResultMessage_("RESTORED"),
  });
}


function blankArchiveViewRow_() {
  return new Array(ARCHIVE_VIEW_COLUMN_COUNT_).fill("");
}


function archiveViewSectionRow_(title) {
  const row = blankArchiveViewRow_();

  row[1] = title;

  return row;
}


function archiveViewHeaderRow_() {
  return [
    "Select",
    "Name",
    "Appointment reason",
    "Original workflow status",
    "Archived",
    "Archived by",
    "Archive reason",
    "Workflow complete",
    "Offloaded",
    "",
    "",
    "",
  ];
}


function archivePersonName_(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(" ")
    || "Archived patient";
}


function archiveViewLiveRow_(lead) {
  const fromStatus = lead.archivedFromStatus || lead.status;

  return [
    false,
    archivePersonName_(lead.firstName, lead.lastName),
    lead.appointmentReason || "",
    fromStatus,
    formatDateTimeForPatientDetail_(lead.archivedAt),
    lead.archivedBy || "",
    lead.archiveReason || "",
    lead.workflowComplete ? "Yes" : "No",
    "",
    lead.leadId,
    "live",
    "",
  ];
}


function archiveViewColdRow_(record) {
  return [
    false,
    archivePersonName_(record.firstName, record.lastName),
    "",
    record.archivedFromStatus || "",
    formatDateTimeForPatientDetail_(record.archivedAt),
    "",
    "",
    "",
    formatDateTimeForPatientDetail_(record.offloadedAt),
    record.leadId,
    "cold",
    record.bundleId || "",
  ];
}


function compareArchiveNewestFirst_(left, right, fieldName) {
  const leftTime = archiveTimestamp_(left[fieldName]) || 0;
  const rightTime = archiveTimestamp_(right[fieldName]) || 0;

  if (leftTime !== rightTime) {
    return rightTime - leftTime;
  }

  return String(left.leadId || "").localeCompare(
    String(right.leadId || "")
  );
}


function renderPatientArchiveViewUnsafe_(options) {
  const settings = options || {};
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ARCHIVE_VIEW_SHEET_NAME_);

  if (!sheet) {
    return {
      ok: false,
      code: "ARCHIVE_SHEET_MISSING",
    };
  }

  const now = new Date();
  const reminderDays = getArchiveConfigNumber_(
    "archive_reminder_days",
    ARCHIVE_REMINDER_DAYS_DEFAULT_
  );
  const coldDays = getArchiveConfigNumber_(
    "archive_cold_storage_days",
    ARCHIVE_COLD_STORAGE_DAYS_DEFAULT_
  );
  const live = listArchiveLeadSnapshots_();
  const archived = live.ok
    ? live.leads.filter((lead) => lead.archived)
    : [];
  const summary = summarizeArchiveAges_(
    archived,
    now,
    reminderDays,
    coldDays
  );

  summary.lastColdStorageAt = readLastColdStorageAt_();
  summary.coldIndexCount = countActiveColdIndexEntries_();

  let reminder = buildArchiveReminderText_(summary);

  if (!live.ok) {
    reminder = `${ARCHIVE_RESULT_MESSAGES_.SCHEMA_MISSING} ${reminder}`;
  }

  const title = blankArchiveViewRow_();
  const reminderRow = blankArchiveViewRow_();

  title[1] = "The Urology Place — Archive";
  reminderRow[0] = reminder;

  const lines = [
    title,
    reminderRow,
    blankArchiveViewRow_(),
  ];
  const sections = [
    ["ARCHIVED FROM SCHEDULED", "Scheduled"],
    ["ARCHIVED FROM CASE LOST", "Case Lost"],
    ["ARCHIVED FROM UNRELATED", "Unrelated"],
  ];

  sections.forEach(([titleText, status]) => {
    const rows = archived
      .filter((lead) =>
        (lead.archivedFromStatus || lead.status) === status
      )
      .sort((left, right) =>
        compareArchiveNewestFirst_(left, right, "archivedAt")
      );

    lines.push(archiveViewSectionRow_(titleText));
    lines.push(archiveViewHeaderRow_());

    if (!rows.length) {
      const empty = blankArchiveViewRow_();

      empty[1] = "None";
      lines.push(empty);
    } else {
      rows.forEach((lead) => {
        lines.push(archiveViewLiveRow_(lead));
      });
    }

    lines.push(blankArchiveViewRow_());
  });

  const cold = listArchiveIndexRecords_()
    .filter((record) => !String(record.restoredAt || "").trim())
    .sort((left, right) =>
      compareArchiveNewestFirst_(left, right, "offloadedAt")
    );

  lines.push(archiveViewSectionRow_("COLD STORAGE"));
  lines.push(archiveViewHeaderRow_());

  if (!cold.length) {
    const empty = blankArchiveViewRow_();

    empty[1] = "None";
    lines.push(empty);
  } else {
    cold.forEach((record) => {
      lines.push(archiveViewColdRow_(record));
    });
  }

  const width = ARCHIVE_VIEW_COLUMN_COUNT_;
  const lastRow = Math.max(sheet.getLastRow(), lines.length, 1);

  sheet.getRange(1, 1, lastRow, width).clearContent();
  sheet.getRange(1, 1, lines.length, width).setValues(lines);

  if (sheet.hideColumns) {
    sheet.hideColumns(10, 3);
  }

  if (sheet.setFrozenRows) {
    sheet.setFrozenRows(2);
  }

  try {
    const rule = SpreadsheetApp
      .newDataValidation()
      .requireCheckbox()
      .build();
    const checks = [];

    lines.forEach((line, index) => {
      if (line[10] === "live" || line[10] === "cold") {
        checks.push(index + 1);
      }
    });

    checks.forEach((rowNumber) => {
      sheet.getRange(rowNumber, 1).setDataValidation(rule);
    });
  } catch (error) {
    // The Select values are still written.
  }

  if (settings.activate && sheet.activate) {
    sheet.activate();
  }

  return {
    ok: true,
    code: "ARCHIVE_READY",
    reminder,
    summary,
  };
}


function refreshPatientArchiveView_(options) {
  try {
    return renderPatientArchiveViewUnsafe_(options || {});
  } catch (error) {
    logDerivedViewOperationalError_(
      "Archive view refresh failed",
      error
    );

    return {
      ok: false,
      code: "ARCHIVE_REFRESH_FAILED",
    };
  }
}


function renderPatientArchive() {
  const result = refreshPatientArchiveView_({
    activate: true,
  });

  if (!result || result.ok !== true) {
    try {
      const ui = SpreadsheetApp.getUi();

      ui.alert(
        "Archive",
        archiveResultMessage_(result || {
          code: "ARCHIVE_REFRESH_FAILED",
        }),
        ui.ButtonSet.OK
      );
    } catch (error) {
      // No spreadsheet UI in headless proofs.
    }
  }

  return result;
}


function openPatientArchive() {
  return renderPatientArchive();
}


function refreshArchiveReminderScheduled() {
  try {
    refreshPatientArchiveView_({
      background: true,
    });
  } catch (error) {
    logDerivedViewOperationalError_(
      "Archive reminder refresh failed",
      error
    );
  }
}


function archiveSelectedBoardPatient() {
  const ui = SpreadsheetApp.getUi();

  try {
    const card = getSelectedPatientBoardCard_();
    const response = ui.prompt(
      "Archive Patient",
      "Optional archive note. Scheduled leads must already be workflow-complete. Case Lost and Unrelated can be archived. Open leads stay on the Board.",
      ui.ButtonSet.OK_CANCEL
    );

    if (response.getSelectedButton() !== ui.Button.OK) {
      return;
    }

    const result = archiveLeadById_(card.leadId, {
      reason: response.getResponseText(),
    });

    ui.alert(
      "Archive",
      archiveResultMessage_(result),
      ui.ButtonSet.OK
    );
  } catch (error) {
    ui.alert(
      "Archive",
      error && error.message
        ? error.message
        : "The lead could not be archived.",
      ui.ButtonSet.OK
    );
  }
}


function openSelectedArchivedPatient() {
  const ui = SpreadsheetApp.getUi();
  const selection = readArchiveSelection_();
  const live = (selection.rows || []).filter(
    (row) => row.kind === "live"
  );
  const cold = (selection.rows || []).filter(
    (row) => row.kind === "cold"
  );

  if (live.length !== 1) {
    ui.alert(
      "Archive",
      cold.length === 1
        ? "Restore this cold-stored patient before opening the record."
        : "Select one archived patient on the Archive tab.",
      ui.ButtonSet.OK
    );
    return;
  }

  openPatientDetailByLeadId_(live[0].leadId);
}


function unarchiveSelectedArchivePatient() {
  const ui = SpreadsheetApp.getUi();
  const selection = readArchiveSelection_();
  const live = (selection.rows || []).filter(
    (row) => row.kind === "live"
  );

  if (!live.length) {
    ui.alert(
      "Archive",
      "Select an archived patient on the Archive tab. Cold-stored patients must be restored first.",
      ui.ButtonSet.OK
    );
    return;
  }

  for (let index = 0; index < live.length; index += 1) {
    const result = unarchiveLeadById_(live[index].leadId);

    if (!result.ok) {
      ui.alert(
        "Archive",
        archiveResultMessage_(result),
        ui.ButtonSet.OK
      );
      return;
    }
  }

  ui.alert(
    "Archive",
    `${live.length} patient record(s) unarchived. Workflow completion was not changed.`,
    ui.ButtonSet.OK
  );
}


function restoreSelectedColdStoredPatient() {
  const ui = SpreadsheetApp.getUi();
  const selection = readArchiveSelection_();
  const cold = (selection.rows || []).filter(
    (row) => row.kind === "cold"
  );

  if (cold.length !== 1) {
    ui.alert(
      "Restore",
      "Select one cold-stored patient on the Archive tab.",
      ui.ButtonSet.OK
    );
    return;
  }

  const result = restoreColdStoredLead_({
    leadId: cold[0].leadId,
    unarchive: false,
  });
  let message = archiveResultMessage_(result);

  if (result.unavailableAttachmentCount) {
    message += " Attachment files that are no longer in Drive were kept as metadata.";
  }

  ui.alert("Restore", message, ui.ButtonSet.OK);
}


function restoreSelectedFromMaintenance(unarchive) {
  const selection = readArchiveSelection_();
  const cold = (selection.rows || []).filter(
    (row) => row.kind === "cold"
  );

  if (cold.length !== 1) {
    return publicArchiveResult_({
      ok: false,
      code: "NOTHING_SELECTED",
    });
  }

  const result = restoreColdStoredLead_({
    leadId: cold[0].leadId,
    unarchive: unarchive === true,
  });

  return publicArchiveResult_(result);
}


function openArchiveMaintenanceDialog() {
  const html = HtmlService
    .createHtmlOutputFromFile("ArchiveMaintenance")
    .setWidth(560)
    .setHeight(680);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "Archive Maintenance"
  );
}
