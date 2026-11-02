/**
 * Fake-data proofs for workflow status validation.
 * Does not call Google and does not read clinic PHI.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const source = readFileSync(path.join(ROOT, "crm/code.gs"), "utf8");
const AUDIT_SAFE = [
  "Open Lead",
  "Follow Up",
  "Scheduled",
  "Case Lost",
  "Unrelated",
  "Open Lead / Follow Up",
];
const ACTIVE = AUDIT_SAFE.slice(0, 5);

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function functionBody(name, nextName) {
  const start = source.indexOf(`function ${name}(`);
  const end = source.indexOf(`function ${nextName}(`);

  if (start < 0 || end < start) {
    throw new Error(`missing function slice ${name}`);
  }

  return source.slice(start, end);
}

function createSheet(name, headers, maxRows) {
  const values = new Map();
  const validations = new Map();
  const writes = {
    setValue: 0,
    setValues: 0,
    clearContent: 0,
    deleteRow: 0,
  };

  headers.forEach((header, index) => {
    values.set(`1,${index + 1}`, header);
  });

  function key(row, column) {
    return `${row},${column}`;
  }

  function makeRange(row, column, numRows, numCols) {
    return {
      getValue() {
        return values.get(key(row, column)) ?? "";
      },
      getDisplayValue() {
        const value = values.get(key(row, column));
        return value == null ? "" : String(value);
      },
      getDisplayValues() {
        return this.getValues().map((line) => line.map((value) => (
          value == null ? "" : String(value)
        )));
      },
      getValues() {
        const rows = [];
        for (let r = 0; r < numRows; r += 1) {
          const line = [];
          for (let c = 0; c < numCols; c += 1) {
            line.push(values.get(key(row + r, column + c)) ?? "");
          }
          rows.push(line);
        }
        return rows;
      },
      setValue(value) {
        writes.setValue += 1;
        values.set(key(row, column), value);
        return this;
      },
      setValues(matrix) {
        writes.setValues += 1;
        matrix.forEach((line, r) => {
          line.forEach((value, c) => {
            values.set(key(row + r, column + c), value);
          });
        });
        return this;
      },
      clearContent() {
        writes.clearContent += 1;
        return this;
      },
      setDataValidation(rule) {
        for (let r = 0; r < numRows; r += 1) {
          for (let c = 0; c < numCols; c += 1) {
            validations.set(key(row + r, column + c), rule);
          }
        }
        return this;
      },
      getDataValidations() {
        const rows = [];
        for (let r = 0; r < numRows; r += 1) {
          const line = [];
          for (let c = 0; c < numCols; c += 1) {
            line.push(validations.get(key(row + r, column + c)) || null);
          }
          rows.push(line);
        }
        return rows;
      },
    };
  }

  return {
    writes,
    values,
    validations,
    getName() {
      return name;
    },
    getLastColumn() {
      return headers.length;
    },
    getMaxRows() {
      return maxRows;
    },
    deleteRow() {
      writes.deleteRow += 1;
    },
    getRange(row, column, numRows, numCols) {
      return makeRange(row, column, numRows || 1, numCols || 1);
    },
  };
}

function createHarness() {
  const logs = [];
  const alerts = [];
  const sheetLookups = [];
  const sheets = {};
  let uiAvailable = true;

  const leads = createSheet(
    "Leads",
    ["lead_id", "first_name", "phone", "status", "note"],
    25,
  );
  const activity = createSheet(
    "ActivityLog",
    ["activity_id", "lead_id", "note", "from_status", "to_status"],
    40,
  );
  const lists = createSheet(
    "Lists",
    ["Old Status"],
    10,
  );

  sheets.Leads = leads;
  sheets.ActivityLog = activity;
  sheets.Lists = lists;

  lists.getRange(2, 1).setValue("Open Lead / Follow Up");
  lists.getRange(3, 1).setValue("Scheduled");
  lists.getRange(4, 1).setValue("Case Lost");
  lists.getRange(5, 1).setValue("Unrelated");
  leads.writes.setValue = 0;
  lists.writes.setValue = 0;

  leads.getRange(2, 1).setValue("LEAD-LEGACY");
  leads.getRange(2, 2).setValue("ZZSECRETNAME");
  leads.getRange(2, 3).setValue("555-0100");
  leads.getRange(2, 4).setValue("Open Lead / Follow Up");
  leads.getRange(2, 5).setValue("ZZSECRETMESSAGE");
  activity.getRange(2, 1).setValue("ACT-LEGACY");
  activity.getRange(2, 2).setValue("LEAD-LEGACY");
  activity.getRange(2, 3).setValue("historical Open Lead / Follow Up event");
  activity.getRange(2, 4).setValue("Open Lead / Follow Up");
  activity.getRange(2, 5).setValue("Follow Up");
  activity.getRange(6, 4).setValue("Open Lead");
  activity.getRange(6, 5).setValue("Scheduled");

  const stale = {
    source: "Lists!A2:A5",
    allowInvalid: true,
  };
  leads.getRange(2, 4, 24, 1).setDataValidation(stale);
  activity.getRange(2, 4, 39, 1).setDataValidation(stale);
  activity.getRange(2, 5, 39, 1).setDataValidation(stale);

  leads.writes.setValue = 0;
  activity.writes.setValue = 0;

  const context = {
    console: {
      log(...args) {
        logs.push(args.map((arg) => String(arg)).join(" "));
      },
      error(...args) {
        logs.push(args.map((arg) => String(arg)).join(" "));
      },
    },
    SpreadsheetApp: {
      getActiveSpreadsheet() {
        return {
          getSheetByName(sheetName) {
            sheetLookups.push(sheetName);
            return sheets[sheetName] || null;
          },
        };
      },
      getUi() {
        if (!uiAvailable) {
          throw new Error("no ui");
        }
        return {
          ButtonSet: { OK: "OK" },
          alert(title, message) {
            alerts.push(`${title}\n${message}`);
          },
        };
      },
      newDataValidation() {
        const spec = {
          kind: "",
          values: null,
          showDropdown: false,
          allowInvalid: true,
          range: null,
        };
        return {
          requireValueInList(values, showDropdown) {
            spec.kind = "valueInList";
            spec.values = Array.from(values);
            spec.showDropdown = Boolean(showDropdown);
            return this;
          },
          requireValueInRange(range) {
            spec.kind = "valueInRange";
            spec.range = range;
            return this;
          },
          setAllowInvalid(allowInvalid) {
            spec.allowInvalid = Boolean(allowInvalid);
            return this;
          },
          build() {
            return {
              kind: spec.kind,
              values: spec.values ? spec.values.slice() : null,
              showDropdown: spec.showDropdown,
              allowInvalid: spec.allowInvalid,
              range: spec.range,
            };
          },
        };
      },
    },
  };

  vm.runInNewContext(
    `${source}
this.ACTIVE_WORKFLOW_STATUSES_ = ACTIVE_WORKFLOW_STATUSES_;
this.AUDIT_SAFE_WORKFLOW_STATUSES_ = AUDIT_SAFE_WORKFLOW_STATUSES_;
this.LEGACY_OPEN_FOLLOW_UP_STATUS_ = LEGACY_OPEN_FOLLOW_UP_STATUS_;
this.applyWorkflowStatusValidations_ = applyWorkflowStatusValidations_;
this.syncWorkflowStatusValidations = syncWorkflowStatusValidations;
`,
    context,
  );

  function snapshot() {
    return JSON.stringify({
      leads: leads.getRange(1, 1, leads.getMaxRows(), leads.getLastColumn()).getValues(),
      activity: activity.getRange(1, 1, activity.getMaxRows(), activity.getLastColumn()).getValues(),
      lists: lists.getRange(1, 1, lists.getMaxRows(), lists.getLastColumn()).getValues(),
    });
  }

  function rule(sheet, row, column) {
    return sheet.getRange(row, column).getDataValidations()[0][0];
  }

  return {
    context,
    logs,
    alerts,
    sheetLookups,
    leads,
    activity,
    lists,
    snapshot,
    rule,
    setUiAvailable(value) {
      uiAvailable = value;
    },
  };
}

test("active and audit-safe workflow statuses stay canonical", () => {
  const harness = createHarness();
  assert.deepEqual(
    Array.from(harness.context.ACTIVE_WORKFLOW_STATUSES_),
    ACTIVE,
  );
  assert.equal(
    harness.context.ACTIVE_WORKFLOW_STATUSES_.includes(
      "Open Lead / Follow Up",
    ),
    false,
  );
  assert.deepEqual(
    Array.from(harness.context.AUDIT_SAFE_WORKFLOW_STATUSES_),
    AUDIT_SAFE,
  );
  assert.equal(
    harness.context.LEGACY_OPEN_FOLLOW_UP_STATUS_,
    "Open Lead / Follow Up",
  );

  const declaration = source.slice(
    source.indexOf("const AUDIT_SAFE_WORKFLOW_STATUSES_"),
    source.indexOf("const CLOSED_WORKFLOW_STATUSES_"),
  );
  assert.match(declaration, /ACTIVE_WORKFLOW_STATUSES_/);
  assert.match(declaration, /LEGACY_OPEN_FOLLOW_UP_STATUS_/);
  assert.equal(declaration.includes('"Scheduled"'), false);
  assert.equal(declaration.includes('"Open Lead"'), false);
});

test("workflow validation accepts the six audit-safe statuses and rejects others", () => {
  const harness = createHarness();
  const before = harness.snapshot();
  const beforeWrites = harness.leads.writes.setValue
    + harness.activity.writes.setValue
    + harness.leads.writes.setValues
    + harness.activity.writes.setValues;
  harness.sheetLookups.length = 0;

  const first = harness.context.applyWorkflowStatusValidations_();
  const afterFirst = harness.snapshot();
  const second = harness.context.applyWorkflowStatusValidations_();

  assert.equal(first.ok, true);
  assert.equal(first.valuesChanged, 0);
  assert.deepEqual(plain(first.warnings), []);
  assert.deepEqual(plain(first.statuses), AUDIT_SAFE);
  assert.deepEqual(plain(second), plain(first));
  assert.equal(afterFirst, before);
  assert.equal(harness.snapshot(), before);
  assert.equal(
    harness.leads.writes.setValue
      + harness.activity.writes.setValue
      + harness.leads.writes.setValues
      + harness.activity.writes.setValues
      + harness.leads.writes.clearContent
      + harness.activity.writes.clearContent
      + harness.leads.writes.deleteRow
      + harness.activity.writes.deleteRow,
    beforeWrites,
  );
  assert.equal(harness.sheetLookups.includes("Lists"), false);
  assert.equal(
    harness.logs.join("\n").includes("ZZSECRETNAME"),
    false,
  );

  const leadRule = harness.rule(harness.leads, 2, 4);
  const fromRule = harness.rule(harness.activity, 2, 4);
  const toRule = harness.rule(harness.activity, 2, 5);

  [leadRule, fromRule, toRule].forEach((rule) => {
    assert.equal(rule.kind, "valueInList");
    assert.equal(rule.range, null);
    assert.equal(rule.allowInvalid, false);
    assert.equal(rule.showDropdown, true);
    assert.deepEqual(plain(rule.values), AUDIT_SAFE);
    AUDIT_SAFE.forEach((status) => {
      assert.equal(rule.values.includes(status), true);
    });
    assert.equal(rule.values.includes("Not A Real Status"), false);
    assert.equal(rule.values.includes("Lists!A2:A5"), false);
    assert.equal(JSON.stringify(rule).includes("Lists!A2:A5"), false);
  });

  assert.equal(harness.rule(harness.leads, 1, 4), null);
  assert.equal(harness.rule(harness.activity, 1, 4), null);
  assert.equal(harness.rule(harness.activity, 1, 5), null);
  assert.deepEqual(
    plain(harness.rule(harness.leads, 25, 4).values),
    AUDIT_SAFE,
  );
  assert.deepEqual(
    plain(harness.rule(harness.activity, 40, 4).values),
    AUDIT_SAFE,
  );
  assert.deepEqual(
    plain(harness.rule(harness.activity, 40, 5).values),
    AUDIT_SAFE,
  );
  assert.equal(
    harness.leads.getRange(2, 4).getValue(),
    "Open Lead / Follow Up",
  );
  assert.equal(
    harness.activity.getRange(2, 4).getValue(),
    "Open Lead / Follow Up",
  );
  assert.equal(harness.activity.getRange(2, 5).getValue(), "Follow Up");
  assert.equal(harness.activity.getRange(6, 4).getValue(), "Open Lead");
  assert.equal(harness.activity.getRange(6, 5).getValue(), "Scheduled");
  assert.equal(harness.leads.getRange(2, 2).getValue(), "ZZSECRETNAME");
  assert.equal(
    harness.lists.getRange(2, 1).getValue(),
    "Open Lead / Follow Up",
  );
});

test("admin sync reports validation only and stays quiet without a spreadsheet UI", () => {
  const harness = createHarness();
  const before = harness.snapshot();
  const result = harness.context.syncWorkflowStatusValidations();

  assert.equal(result.ok, true);
  assert.equal(result.valuesChanged, 0);
  assert.deepEqual(plain(result.rules), [
    {
      sheetName: "ActivityLog",
      header: "from_status",
      column: 4,
      rows: 39,
    },
    {
      sheetName: "ActivityLog",
      header: "to_status",
      column: 5,
      rows: 39,
    },
    {
      sheetName: "Leads",
      header: "status",
      column: 4,
      rows: 24,
    },
  ]);
  assert.equal(harness.snapshot(), before);
  assert.match(harness.alerts[0], /Workflow Status Validations/);
  assert.match(harness.alerts[0], /No patient values were changed/);
  assert.equal(harness.alerts[0].includes("ZZSECRETNAME"), false);
  assert.equal(harness.alerts[0].includes("555-0100"), false);
  assert.equal(harness.logs.join("\n").includes("ZZSECRETNAME"), false);
  assert.match(
    harness.logs.join("\n"),
    /\[WORKFLOW_STATUS_VALIDATION\]/,
  );

  harness.setUiAvailable(false);
  const headless = harness.context.syncWorkflowStatusValidations();
  assert.equal(headless.ok, true);
  assert.equal(headless.valuesChanged, 0);
  assert.equal(harness.snapshot(), before);
});

test("staff selectors and setup stay on the active statuses", () => {
  const move = readFileSync(
    path.join(ROOT, "crm/BoardMoveLead.html"),
    "utf8",
  );
  const detail = readFileSync(
    path.join(ROOT, "crm/PatientDetail.html"),
    "utf8",
  );
  const quick = readFileSync(
    path.join(ROOT, "crm/BoardQuickActions.html"),
    "utf8",
  );

  [move, detail, quick].forEach((html) => {
    assert.equal(html.includes("Open Lead / Follow Up"), false);
    assert.equal(html.includes("AUDIT_SAFE_WORKFLOW_STATUSES_"), false);
  });

  const moveOptions = Array.from(
    move.matchAll(/<option value="([^"]*)">/g),
    (match) => match[1],
  ).filter(Boolean);
  assert.deepEqual(moveOptions, ACTIVE);

  const detailOptions = Array.from(
    detail
      .slice(
        detail.indexOf('id="workflow-target-select"'),
        detail.indexOf('id="case-lost-reason-group"'),
      )
      .matchAll(/value="([^"]*)"/g),
    (match) => match[1],
  ).filter(Boolean);
  assert.deepEqual(detailOptions, [
    "Open Lead",
    "Follow Up",
    "Case Lost",
    "Unrelated",
  ]);

  const helper = functionBody(
    "buildAuditSafeWorkflowStatusValidation_",
    "applyWorkflowStatusValidationTarget_",
  );
  const target = functionBody(
    "applyWorkflowStatusValidationTarget_",
    "applyWorkflowStatusValidations_",
  );
  const apply = functionBody(
    "applyWorkflowStatusValidations_",
    "syncWorkflowStatusValidations",
  );
  const setup = functionBody(
    "setupLeadArchiveSchema_",
    "setupLeadArchiveSchema",
  );
  const menu = functionBody("onOpen", "doGet");

  assert.match(helper, /requireValueInList/);
  assert.match(helper, /setAllowInvalid\(\s*false\s*\)/);
  assert.match(helper, /AUDIT_SAFE_WORKFLOW_STATUSES_/);
  assert.equal(helper.includes("Lists!A2:A5"), false);
  assert.equal(helper.includes("requireValueInRange"), false);
  assert.match(target, /getHeaderMap_/);
  assert.match(target, /getMaxRows/);
  assert.match(target, /setDataValidation/);
  assert.equal(target.includes("Lists!A2:A5"), false);
  assert.equal(target.includes("requireValueInRange"), false);
  assert.equal(target.includes("setValue("), false);
  assert.equal(target.includes("setValues("), false);
  assert.equal(target.includes("deleteRow"), false);
  assert.match(apply, /applyWorkflowStatusValidationTarget_/);
  assert.equal(apply.includes("Lists!A2:A5"), false);
  assert.equal(apply.includes("setValue("), false);
  assert.equal(apply.includes("setValues("), false);
  assert.equal(apply.includes("deleteRow"), false);
  assert.match(setup, /applyWorkflowStatusValidations_/);
  assert.match(
    setup,
    /Workflow status validation was not applied\./,
  );
  assert.equal(setup.includes("migrateOpenFollowUpStatuses"), false);
  assert.match(menu, /ADMIN: Sync Workflow Status Validations/);
  assert.match(menu, /"syncWorkflowStatusValidations"/);
  assert.equal(menu.includes("syncWorkflowStatusValidations()"), false);
  assert.equal(menu.includes("applyWorkflowStatusValidations_"), false);
});

test("missing sheets warn and leave stored rows alone", () => {
  const harness = createHarness();
  delete harness.leads;
  const sheets = {
    ActivityLog: harness.activity,
  };
  harness.context.SpreadsheetApp.getActiveSpreadsheet = () => ({
    getSheetByName(sheetName) {
      harness.sheetLookups.push(sheetName);
      return sheets[sheetName] || null;
    },
  });
  const before = JSON.stringify(
    harness.activity.getRange(
      1,
      1,
      harness.activity.getMaxRows(),
      harness.activity.getLastColumn(),
    ).getValues(),
  );
  const result = harness.context.applyWorkflowStatusValidations_();

  assert.equal(result.ok, false);
  assert.equal(result.valuesChanged, 0);
  assert.equal(result.rules.length, 2);
  assert.equal(
    result.warnings.some((warning) => warning.startsWith("Leads worksheet")),
    true,
  );
  assert.equal(
    JSON.stringify(
      harness.activity.getRange(
        1,
        1,
        harness.activity.getMaxRows(),
        harness.activity.getLastColumn(),
      ).getValues(),
    ),
    before,
  );
  assert.equal(
    harness.rule(harness.activity, 2, 4).values.includes(
      "Open Lead / Follow Up",
    ),
    true,
  );
});
