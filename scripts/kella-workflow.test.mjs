/**
 * Static checks for the Patient Detail workflow UI.
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

function readCrm(name) {
  return readFileSync(path.join(ROOT, "crm", name), "utf8");
}

function scriptSource(html) {
  return Array.from(
    html.matchAll(/<script>([\s\S]*?)<\/script>/g),
    (match) => match[1]
      .replace(/<%[=]?[\s\S]*?%>/g, " null ")
      .replace(/<\?[\s\S]*?\?>/g, " null "),
  ).join("\n");
}

function extractFunction(fileSource, name) {
  const marker = `function ${name}(`;
  const start = fileSource.indexOf(marker);

  if (start < 0) {
    throw new Error(`missing function ${name}`);
  }

  const paren = fileSource.indexOf("(", start);
  let signatureDepth = 0;
  let signatureEnd = -1;

  for (let index = paren; index < fileSource.length; index += 1) {
    const ch = fileSource[index];

    if (ch === "(") {
      signatureDepth += 1;
    } else if (ch === ")") {
      signatureDepth -= 1;

      if (signatureDepth === 0) {
        signatureEnd = index;
        break;
      }
    }
  }

  const bodyStart = fileSource.indexOf("{", signatureEnd);
  let depth = 0;

  for (let index = bodyStart; index < fileSource.length; index += 1) {
    const ch = fileSource[index];
    const next = fileSource[index + 1];

    if (ch === "/" && next === "/") {
      index = fileSource.indexOf("\n", index);
      continue;
    }

    if (ch === "/" && next === "*") {
      index = fileSource.indexOf("*/", index + 2) + 1;
      continue;
    }

    if (ch === "'" || ch === '"' || ch === "`") {
      index += 1;
      while (index < fileSource.length) {
        if (fileSource[index] === "\\") {
          index += 2;
          continue;
        }
        if (fileSource[index] === ch) break;
        index += 1;
      }
      continue;
    }

    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return fileSource.slice(start, index + 1);
      }
    }
  }

  throw new Error(`unclosed function ${name}`);
}

test("patient detail removes retired controls and adds the new pickers", () => {
  const html = readCrm("PatientDetail.html");
  const removed = [
    'id="assignment-select"',
    'id="save-assignment-button"',
    'id="assigned-to-value"',
    "Save Assignment",
    "Assigned To",
    'id="reached-patient-checkbox"',
    'id="contact-outcome-select"',
    'id="contact-method-select"',
    'id="complete-workflow-button"',
    'id="reopen-workflow-button"',
    'id="archive-lead-button"',
    'id="unarchive-lead-button"',
    'id="archive-reason-input"',
    "Workflow Completion",
    "Archive Patient",
  ];
  removed.forEach((token) => {
    assert.equal(html.includes(token), false, token);
  });
  assert.equal(html.includes("patientDetailAssignLead"), false);
  assert.match(html, /id="contact-method-picker"/);
  assert.match(html, /id="case-lost-reason-picker"/);
  assert.match(html, /id="follow-up-start-input"/);
  assert.match(html, /id="follow-up-end-input"/);
  assert.match(html, /List the patient's insurance if it is not accepted\./);
  assert.match(html, /Explain case lost; list patient's insurance if unaccepted\./);
  assert.match(html, /id="archive-banner"/);
  assert.match(html, /value="Open Lead"/);
  assert.match(html, /value="Follow Up"/);
  assert.equal(html.includes('value="Open Lead / Follow Up"'), false);
  assert.doesNotThrow(() => new vm.Script(scriptSource(html)));
});

test("board dialogs use multi-choice contact methods and case-lost reasons", () => {
  const quick = readCrm("BoardQuickActions.html");
  const move = readCrm("BoardMoveLead.html");
  assert.equal(quick.includes('id="quick-contact-outcome"'), false);
  assert.equal(quick.includes('id="quick-contact-reached"'), false);
  assert.equal(quick.includes('id="quick-assignment-select"'), false);
  assert.equal(quick.includes('id="quick-assignment-button"'), false);
  assert.equal(quick.includes("Save Assignment"), false);
  assert.equal(quick.includes("boardQuickAssignLead"), false);
  assert.equal(move.includes("assignment-select"), false);
  assert.match(quick, /id="quick-contact-methods"/);
  assert.match(quick, /contactMethods/);
  assert.match(move, /value="Open Lead"/);
  assert.match(move, /value="Follow Up"/);
  assert.match(move, /value="Scheduled"/);
  assert.equal(move.includes('value="Open Lead / Follow Up"'), false);
  assert.match(move, /id="move-case-lost-reasons"/);
  assert.match(move, /reasons/);
  assert.match(move, /List the patient's insurance if it is not accepted\./);
  assert.doesNotThrow(() => new vm.Script(scriptSource(quick)));
  assert.doesNotThrow(() => new vm.Script(scriptSource(move)));
});

test("board cards and dashboard drop retired assignment displays", () => {
  const source = readFileSync(path.join(ROOT, "crm/code.gs"), "utf8");
  const card = extractFunction(source, "buildBoardCardDisplayText_");
  assert.doesNotMatch(card, /Assigned:/);
  assert.doesNotMatch(card, /Not reached/);
  assert.doesNotMatch(card, /Reached/);
  assert.doesNotMatch(card, /Workflow complete/);
  assert.doesNotMatch(
    extractFunction(source, "sortScheduledBoardCards_"),
    /workflowComplete/,
  );
  assert.doesNotMatch(
    extractFunction(source, "sortClosedBoardCards_"),
    /workflowComplete/,
  );
  assert.doesNotMatch(
    extractFunction(source, "buildBoardLaneCountText_"),
    /complete/,
  );
  assert.doesNotMatch(
    extractFunction(source, "buildDashboardLeadSnapshot_"),
    /!workflowComplete/,
  );
  assert.doesNotMatch(
    extractFunction(source, "buildDashboardSharedLeadAggregates_"),
    /workflow_complete/,
  );
  assert.match(card, /attemptLabel/);
  assert.match(card, /callbackLabel/);
  assert.doesNotMatch(
    extractFunction(source, "setupDashboardFoundation"),
    /Assigned Employee/,
  );
  assert.doesNotMatch(
    extractFunction(source, "dashboardRecordMatchesCategoryFilters_"),
    /assigned_to/,
  );
  assert.match(
    extractFunction(source, "applyDashboardWorkloadActivity_"),
    /dashboardActivityActorLabel_/,
  );
  assert.match(
    extractFunction(source, "renderDashboardEmployeeWorkload_"),
    /EMPLOYEE ACTIONS TODAY/,
  );
  assert.doesNotMatch(
    extractFunction(source, "renderDashboardEmployeeWorkload_"),
    /Open Assigned|Follow-ups Due/,
  );
  assert.equal(source.includes("function getOpenBoardPriority_("), false);
  assert.doesNotMatch(
    extractFunction(source, "sortOpenBoardCards_"),
    /getFollowUpBoardPriority_|followUpOn/,
  );
  assert.match(
    extractFunction(source, "getFollowUpBoardPriority_"),
    /upcoming/,
  );
  assert.match(
    extractFunction(source, "evaluateArchiveEligibility_"),
    /void workflowComplete/,
  );
  assert.doesNotMatch(
    extractFunction(source, "patientDetailMoveWorkflow"),
    /workflow_complete/,
  );
  assert.doesNotMatch(
    extractFunction(source, "patientDetailRecordContactAttempt"),
    /workflow_complete/,
  );
  assert.doesNotMatch(
    extractFunction(source, "archiveEligibleScheduledLeadsDaily"),
    /getUi\(|\.toast\(|\.activate\(|setActiveSheet\(/,
  );
  assert.match(
    extractFunction(source, "rebuildDirtyDerivedViews_"),
    /refreshPatientArchiveView_\(\{\s*background:\s*true/,
  );
});

test("board white-band paint and one-minute refresh stay in place", () => {
  const source = readFileSync(path.join(ROOT, "crm/code.gs"), "utf8");
  assert.match(source, /Never paint getMaxRows\(\)/);
  assert.match(source, /const DERIVED_VIEW_AUTO_REFRESH_HANDLER_ =\n {2}"refreshDirtyDerivedViewsScheduled";/);
  assert.match(source, /const DERIVED_VIEW_AUTO_REFRESH_MINUTES_ =\n {2}1;/);
  assert.equal(source.includes("function doPost("), true);
  assert.equal(source.includes("function previewOpenFollowUpStatusMigration("), true);
  assert.equal(source.includes("function migrateOpenFollowUpStatuses("), true);
  assert.doesNotMatch(
    extractFunction(source, "doPost"),
    /WORKFLOW_STATUS_OPEN_LEAD_|normalizeLegacyDefaultStatus_/,
  );
});

test("five-lane board layout does not overlap the action rail", () => {
  const source = readFileSync(path.join(ROOT, "crm/code.gs"), "utf8");
  const context = {
    console,
    Utilities: { formatDate() { return ""; }, getUuid() { return "uuid"; } },
  };
  vm.runInNewContext(
    `${source}\nthis.PATIENT_BOARD_LAYOUT = PATIENT_BOARD_LAYOUT;\nthis.PATIENT_BOARD_LANES = PATIENT_BOARD_LANES;\nthis.ACTIVE_WORKFLOW_STATUSES_ = ACTIVE_WORKFLOW_STATUSES_;`,
    context,
  );
  const layout = context.PATIENT_BOARD_LAYOUT;
  const lanes = Array.from(context.PATIENT_BOARD_LANES.map((lane) => lane.status));
  assert.deepEqual(lanes, [
    "Open Lead",
    "Follow Up",
    "Scheduled",
    "Case Lost",
    "Unrelated",
  ]);
  assert.deepEqual(Array.from(layout.laneStarts), [2, 7, 12, 17, 22]);
  assert.deepEqual(Array.from(layout.spacerColumns), [6, 11, 16, 21]);
  assert.equal(layout.lastBoardColumn, 25);
  assert.equal(layout.actionRailFirstColumn, 26);
  assert.equal(layout.actionRailColumnCount, 4);
  assert.equal(layout.applicationHeaderLastColumn, 29);
  assert.equal(
    layout.actionRailFirstColumn,
    layout.lastBoardColumn + 1,
  );
  assert.equal(
    layout.actionRailFirstColumn + layout.actionRailColumnCount - 1,
    layout.applicationHeaderLastColumn,
  );
  lanes.forEach((status, index) => {
    const start = layout.laneStarts[index];
    const end = start + 3;
    assert.ok(end <= layout.lastBoardColumn);
    assert.equal(layout.spacerColumns.includes(start), false);
    assert.equal(layout.spacerColumns.includes(end), false);
  });
  assert.equal(
    context.ACTIVE_WORKFLOW_STATUSES_.includes("Open Lead / Follow Up"),
    false,
  );
});
