/**
 * Local proofs for Board label removal and dirty-view auto-refresh.
 * Executes the repository Apps Script functions with fake services.
 * Does not call Google and does not read PHI.
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
const SOURCE_PATH = path.join(ROOT, "crm/code.gs");
const source = readFileSync(SOURCE_PATH, "utf8");

const BOARD_KEY = "PASS25_DIRTY_BOARD";
const DASHBOARD_KEY = "PASS25_DIRTY_DASHBOARD";
const HANDLER = "refreshDirtyDerivedViewsScheduled";

function extractFunction(fileSource, name) {
  const marker = `function ${name}(`;
  const start = fileSource.indexOf(marker);

  if (start < 0) {
    throw new Error(`missing function ${name}`);
  }

  let index = fileSource.indexOf("{", start);
  const stack = ["code"];
  let depth = 0;

  for (; index < fileSource.length; index++) {
    const ch = fileSource[index];
    const next = fileSource[index + 1];
    const state = stack[stack.length - 1];

    if (state === "line") {
      if (ch === "\n") {
        stack.pop();
      }
      continue;
    }

    if (state === "block") {
      if (ch === "*" && next === "/") {
        stack.pop();
        index++;
      }
      continue;
    }

    if (state === "sq") {
      if (ch === "\\") {
        index++;
      } else if (ch === "'") {
        stack.pop();
      }
      continue;
    }

    if (state === "dq") {
      if (ch === "\\") {
        index++;
      } else if (ch === '"') {
        stack.pop();
      }
      continue;
    }

    if (state === "tpl") {
      if (ch === "\\") {
        index++;
        continue;
      }
      if (ch === "`") {
        stack.pop();
        continue;
      }
      if (ch === "$" && next === "{") {
        stack.push("code");
        index++;
      }
      continue;
    }

    if (ch === "'") {
      stack.push("sq");
    } else if (ch === '"') {
      stack.push("dq");
    } else if (ch === "`") {
      stack.push("tpl");
    } else if (ch === "/" && next === "/") {
      stack.push("line");
      index++;
    } else if (ch === "/" && next === "*") {
      stack.push("block");
      index++;
    } else if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      if (stack.length > 1) {
        stack.pop();
      } else {
        depth--;
        if (depth === 0) {
          return fileSource.slice(start, index + 1);
        }
      }
    }
  }

  throw new Error(`unclosed function ${name}`);
}

function extractConstString(fileSource, name) {
  const match = fileSource.match(
    new RegExp(
      `const ${name}\\s*=\\s*"([^"]*)"\\s*;`,
    ),
  );

  if (!match) {
    throw new Error(`missing string const ${name}`);
  }

  return match[1];
}

function extractConstNumber(fileSource, name) {
  const match = fileSource.match(
    new RegExp(`const ${name}\\s*=\\s*(\\d+)\\s*;`),
  );

  if (!match) {
    throw new Error(`missing number const ${name}`);
  }

  return Number(match[1]);
}

function extractStatement(fileSource, name) {
  const marker = `const ${name}`;
  const start = fileSource.indexOf(marker);

  if (start < 0) {
    throw new Error(`missing const ${name}`);
  }

  let index = start;
  const stack = ["code"];
  let depth = 0;
  let started = false;

  for (; index < fileSource.length; index++) {
    const ch = fileSource[index];
    const next = fileSource[index + 1];
    const state = stack[stack.length - 1];

    if (state === "line") {
      if (ch === "\n") {
        stack.pop();
      }
      continue;
    }

    if (state === "block") {
      if (ch === "*" && next === "/") {
        stack.pop();
        index++;
      }
      continue;
    }

    if (state === "sq") {
      if (ch === "\\") {
        index++;
      } else if (ch === "'") {
        stack.pop();
      }
      continue;
    }

    if (state === "dq") {
      if (ch === "\\") {
        index++;
      } else if (ch === '"') {
        stack.pop();
      }
      continue;
    }

    if (ch === "'") {
      stack.push("sq");
    } else if (ch === '"') {
      stack.push("dq");
    } else if (ch === "/" && next === "/") {
      stack.push("line");
      index++;
    } else if (ch === "/" && next === "*") {
      stack.push("block");
      index++;
    } else if (ch === "{" || ch === "(") {
      depth++;
      started = true;
    } else if (ch === "}" || ch === ")") {
      depth--;
    } else if (ch === ";" && started && depth === 0 && stack.length === 1) {
      return fileSource.slice(start, index + 1);
    }
  }

  throw new Error(`unclosed const ${name}`);
}

function loadSandbox() {
  const names = [
    "startPerf_",
    "endPerf_",
    "getDerivedViewDirtyProperties_",
    "registerDerivedViewDirtyFlags_",
    "snapshotAndClearDerivedViewDirtyFlags_",
    "readDerivedViewDirtyFlags_",
    "normalizeDerivedViewUiOptions_",
    "recordDerivedViewUiEffect_",
    "logDerivedViewOperationalError_",
    "reportDerivedViewRefreshFailure_",
    "waitForDerivedViewRefreshLock_",
    "enterDerivedViewWriteSection_",
    "exitDerivedViewWriteSection_",
    "restoreSheetAfterBoardRefresh_",
    "rebuildDirtyDerivedViews_",
    "runDerivedViewRefreshLoop_",
    "refreshDirtyDerivedViewsScheduled",
    "listDerivedViewAutoRefreshTriggers_",
    "installDerivedViewAutoRefreshTrigger",
    "removeDerivedViewAutoRefreshTrigger",
  ];

  const scriptSource = [
    `const DERIVED_VIEW_DIRTY_BOARD_KEY_ = ${JSON.stringify(extractConstString(source, "DERIVED_VIEW_DIRTY_BOARD_KEY_"))};`,
    `const DERIVED_VIEW_DIRTY_DASHBOARD_KEY_ = ${JSON.stringify(extractConstString(source, "DERIVED_VIEW_DIRTY_DASHBOARD_KEY_"))};`,
    `const DERIVED_VIEW_AUTO_REFRESH_HANDLER_ = ${JSON.stringify(extractConstString(source, "DERIVED_VIEW_AUTO_REFRESH_HANDLER_"))};`,
    `const DERIVED_VIEW_AUTO_REFRESH_MINUTES_ = ${extractConstNumber(source, "DERIVED_VIEW_AUTO_REFRESH_MINUTES_")};`,
    `const DERIVED_VIEW_REFRESH_LOCK_WAIT_MS_ = ${extractConstNumber(source, "DERIVED_VIEW_REFRESH_LOCK_WAIT_MS_")};`,
    ...names.map((name) => extractFunction(source, name)),
  ].join("\n\n");

  const store = {};
  const renders = [];
  const lockCalls = [];
  const spreadsheetCalls = [];
  const errorLogs = [];
  const triggers = [];
  let triggerSeq = 1;
  const active = {
    name: "Dashboard",
  };

  function defaultRender(options) {
    renders.push({
      kind: "board",
      options,
    });
  }

  function defaultDashboard() {
    renders.push({
      kind: "dashboard",
    });
  }

  const context = {
    EXECUTION_CACHE_: {
      derivedViewLockHeld: false,
      derivedViewUiEffects: null,
    },
    console: {
      log() {},
      error(...args) {
        errorLogs.push(
          args
            .map((arg) => {
              if (arg instanceof Error) {
                return `${arg.name} ${arg.message}`;
              }
              return String(arg);
            })
            .join(" "),
        );
      },
    },
    PropertiesService: {
      getDocumentProperties() {
        return {
          getProperty(key) {
            return Object.prototype.hasOwnProperty.call(store, key)
              ? store[key]
              : null;
          },
          setProperty(key, value) {
            store[key] = String(value);
          },
          deleteProperty(key) {
            delete store[key];
          },
        };
      },
    },
    LockService: {
      getScriptLock() {
        return {
          waitLock(ms) {
            lockCalls.push(ms);
          },
          releaseLock() {
            lockCalls.push("release");
          },
        };
      },
    },
    SpreadsheetApp: {
      getActiveSpreadsheet() {
        spreadsheetCalls.push("getActiveSpreadsheet");
        return {
          getActiveSheet() {
            spreadsheetCalls.push("getActiveSheet");
            return {
              getName() {
                return active.name;
              },
              activate() {
                spreadsheetCalls.push(`activate:${active.name}`);
              },
            };
          },
          getSheetByName(name) {
            spreadsheetCalls.push(`getSheetByName:${name}`);
            return {
              getName() {
                return name;
              },
            };
          },
          toast(_message, title) {
            spreadsheetCalls.push(`toast:${title || ""}`);
          },
        };
      },
    },
    ScriptApp: {
      getProjectTriggers() {
        return triggers.map((trigger) => ({
          id: trigger.id,
          getHandlerFunction() {
            return trigger.handler;
          },
        }));
      },
      deleteTrigger(trigger) {
        const index = triggers.findIndex(
          (item) => item.id === trigger.id,
        );
        if (index >= 0) {
          triggers.splice(index, 1);
        }
      },
      newTrigger(handler) {
        return {
          timeBased() {
            return {
              everyMinutes(minutes) {
                return {
                  create() {
                    const created = {
                      id: triggerSeq++,
                      handler,
                      minutes,
                    };
                    triggers.push(created);
                    return created;
                  },
                };
              },
            };
          },
        };
      },
    },
    renderPatientBoard: defaultRender,
    refreshDashboardData: defaultDashboard,
  };

  vm.runInNewContext(scriptSource, context);

  function reset() {
    for (const key of Object.keys(store)) {
      delete store[key];
    }
    renders.length = 0;
    lockCalls.length = 0;
    spreadsheetCalls.length = 0;
    errorLogs.length = 0;
    triggers.length = 0;
    context.EXECUTION_CACHE_.derivedViewLockHeld = false;
    context.EXECUTION_CACHE_.derivedViewUiEffects = null;
    context.renderPatientBoard = defaultRender;
    context.refreshDashboardData = defaultDashboard;
    active.name = "Dashboard";
  }

  return {
    context,
    store,
    renders,
    lockCalls,
    spreadsheetCalls,
    errorLogs,
    triggers,
    active,
    reset,
    defaultRender,
    defaultDashboard,
  };
}

const sandbox = loadSandbox();

function boardRenders() {
  return sandbox.renders.filter((item) => item.kind === "board");
}

function dashboardRenders() {
  return sandbox.renders.filter((item) => item.kind === "dashboard");
}

test("code.gs parses", () => {
  assert.doesNotThrow(() => {
    new vm.Script(source);
  });
});

test("A: manual Board refresh keeps UI and does not write a rail title", () => {
  const rail = extractFunction(source, "applyBoardActionRail_");
  const render = extractFunction(source, "renderPatientBoard");

  assert.equal(rail.includes('"BOARD"'), false);
  assert.doesNotMatch(rail, /\.setValue\(/);
  assert.match(rail, /#171A21/);
  assert.match(rail, /actionRailColumnWidth/);
  assert.doesNotMatch(rail, /getDrawings|deleteDrawing|removeDrawing/);
  assert.match(source, /"Refresh Board",\s*"renderPatientBoard"/);

  assert.match(render, /function renderPatientBoard\(options\)/);
  assert.match(render, /normalizeDerivedViewUiOptions_\(/);

  const activateIf = render.indexOf("if (ui.activate)");
  const activateCall = render.indexOf("sheet.activate()");
  const toastIf = render.indexOf("if (ui.showToast)");
  const toastCall = render.indexOf("ss.toast(");
  const preserve = render.indexOf("ui.preserveSelection");
  const selectedRead = render.indexOf(
    "getSelectedBoardLeadIdForRefresh_",
  );

  assert.ok(activateIf !== -1 && activateIf < activateCall);
  assert.ok(toastIf !== -1 && toastIf < toastCall);
  assert.equal(render.split("ss.toast(").length - 1, 2);
  assert.ok(preserve !== -1 && preserve < selectedRead);
  assert.match(render, /selectRenderedBoardCardByLeadId_/);

  const manual = sandbox.context.normalizeDerivedViewUiOptions_();
  assert.equal(manual.background, false);
  assert.equal(manual.activate, true);
  assert.equal(manual.preserveSelection, true);
  assert.equal(manual.showToast, true);
  assert.equal(manual.restoreActiveSheet, true);

  const hiddenActivate = sandbox.context.normalizeDerivedViewUiOptions_({
    activate: false,
  });
  assert.equal(hiddenActivate.activate, false);
  assert.equal(hiddenActivate.showToast, true);
  assert.equal(hiddenActivate.preserveSelection, true);
});

test("B: a clean scheduled run does not rebuild or take the lock", () => {
  sandbox.reset();
  sandbox.store[BOARD_KEY] = "0";
  sandbox.store[DASHBOARD_KEY] = "0";

  const result = sandbox.context.refreshDirtyDerivedViewsScheduled();

  assert.equal(result.skipped, true);
  assert.equal(result.boardRebuilds, 0);
  assert.equal(result.dashboardRebuilds, 0);
  assert.equal(result.passes, 0);
  assert.equal(sandbox.renders.length, 0);
  assert.equal(sandbox.lockCalls.length, 0);
  assert.equal(sandbox.spreadsheetCalls.length, 0);
  assert.equal(sandbox.store[BOARD_KEY], "0");
  assert.equal(sandbox.store[DASHBOARD_KEY], "0");

  sandbox.reset();
  const unset = sandbox.context.refreshDirtyDerivedViewsScheduled();
  assert.equal(unset.skipped, true);
  assert.equal(sandbox.renders.length, 0);
  assert.equal(sandbox.lockCalls.length, 0);
});

test("C: board-only dirty state rebuilds Board once and clears that flag", () => {
  sandbox.reset();
  sandbox.store[BOARD_KEY] = "1";
  sandbox.store[DASHBOARD_KEY] = "0";

  const result = sandbox.context.refreshDirtyDerivedViewsScheduled();
  const boards = boardRenders();

  assert.equal(result.skipped, false);
  assert.equal(result.passes, 1);
  assert.equal(result.boardRebuilds, 1);
  assert.equal(result.dashboardRebuilds, 0);
  assert.equal(boards.length, 1);
  assert.equal(dashboardRenders().length, 0);
  assert.equal(boards[0].options.background, true);
  assert.equal(boards[0].options.activate, false);
  assert.equal(boards[0].options.preserveSelection, false);
  assert.equal(boards[0].options.showToast, false);
  assert.equal(boards[0].options.restoreActiveSheet, false);
  assert.equal(sandbox.store[BOARD_KEY], "0");
  assert.equal(sandbox.store[DASHBOARD_KEY], "0");
  assert.equal(
    sandbox.spreadsheetCalls.includes("getActiveSheet"),
    false,
  );
  assert.equal(
    sandbox.spreadsheetCalls.some((call) => call.startsWith("toast:")),
    false,
  );
  assert.equal(
    sandbox.spreadsheetCalls.some((call) => call.startsWith("activate:")),
    false,
  );
  assert.ok(sandbox.lockCalls.includes("release"));
});

test("D: dashboard-only dirty state rebuilds Dashboard once", () => {
  sandbox.reset();
  sandbox.store[BOARD_KEY] = "0";
  sandbox.store[DASHBOARD_KEY] = "1";

  const result = sandbox.context.refreshDirtyDerivedViewsScheduled();

  assert.equal(result.skipped, false);
  assert.equal(result.passes, 1);
  assert.equal(result.boardRebuilds, 0);
  assert.equal(result.dashboardRebuilds, 1);
  assert.equal(boardRenders().length, 0);
  assert.equal(dashboardRenders().length, 1);
  assert.equal(sandbox.store[BOARD_KEY], "0");
  assert.equal(sandbox.store[DASHBOARD_KEY], "0");
  assert.equal(sandbox.spreadsheetCalls.length, 0);
});

test("E: both dirty flags coalesce into one Board and one Dashboard rebuild", () => {
  sandbox.reset();
  sandbox.context.registerDerivedViewDirtyFlags_({
    board: true,
    dashboard: true,
  });
  sandbox.context.registerDerivedViewDirtyFlags_({
    board: true,
    dashboard: true,
  });

  const result = sandbox.context.refreshDirtyDerivedViewsScheduled();

  assert.equal(result.skipped, false);
  assert.equal(result.passes, 1);
  assert.equal(result.boardRebuilds, 1);
  assert.equal(result.dashboardRebuilds, 1);
  assert.equal(boardRenders().length, 1);
  assert.equal(dashboardRenders().length, 1);
  assert.equal(sandbox.store[BOARD_KEY], "0");
  assert.equal(sandbox.store[DASHBOARD_KEY], "0");
});

test("a flag set during a rebuild is covered by the existing second pass", () => {
  sandbox.reset();
  sandbox.store[BOARD_KEY] = "1";
  sandbox.store[DASHBOARD_KEY] = "1";
  let extra = true;

  sandbox.context.renderPatientBoard = function (options) {
    sandbox.renders.push({
      kind: "board",
      options,
    });
    if (extra) {
      extra = false;
      sandbox.store[BOARD_KEY] = "1";
    }
  };

  const result = sandbox.context.runDerivedViewRefreshLoop_({
    background: true,
  });

  assert.equal(result.passes, 2);
  assert.equal(result.boardRebuilds, 2);
  assert.equal(result.dashboardRebuilds, 1);
  assert.equal(boardRenders().length, 2);
  assert.equal(dashboardRenders().length, 1);
  assert.equal(sandbox.store[BOARD_KEY], "0");
  assert.equal(sandbox.store[DASHBOARD_KEY], "0");
});

test("F: website ingest marks dirty and does not render", () => {
  const commit = extractFunction(source, "commitWebsiteIngestSuccess_");
  const post = extractFunction(source, "doPost");
  const scheduled = extractFunction(
    source,
    "refreshDirtyDerivedViewsScheduled",
  );

  assert.match(commit, /registerDerivedViewDirtyFlags_/);
  assert.match(commit, /board:\s*true/);
  assert.match(commit, /dashboard:\s*true/);
  assert.doesNotMatch(
    commit,
    /renderPatientBoard|refreshDashboardData|runDerivedViewRefreshLoop_|refreshDirtyDerivedViewsScheduled/,
  );
  assert.doesNotMatch(
    post,
    /renderPatientBoard|refreshDashboardData|runDerivedViewRefreshLoop_|refreshDirtyDerivedViewsScheduled/,
  );
  assert.doesNotMatch(post, /refreshDirtyDerivedViewsScheduled/);

  const earlyReturn = scheduled.indexOf("skipped: true");
  const loopCall = scheduled.indexOf("runDerivedViewRefreshLoop_");
  const readCall = scheduled.indexOf("readDerivedViewDirtyFlags_");
  assert.ok(readCall !== -1 && readCall < earlyReturn);
  assert.ok(earlyReturn !== -1 && earlyReturn < loopCall);
  assert.match(scheduled, /background:\s*true/);
  assert.doesNotMatch(scheduled, /getUi\(|\.toast\(|\.activate\(|openById\(/);
  assert.match(scheduled, /function refreshDirtyDerivedViewsScheduled\(\)/);
});

test("G: background refresh does not activate, reselect, toast, or restore the sheet", () => {
  sandbox.reset();
  sandbox.active.name = "Leads";
  sandbox.store[BOARD_KEY] = "1";
  sandbox.store[DASHBOARD_KEY] = "1";

  sandbox.context.refreshDirtyDerivedViewsScheduled();

  assert.equal(sandbox.spreadsheetCalls.length, 0);
  assert.equal(boardRenders()[0].options.activate, false);
  assert.equal(boardRenders()[0].options.preserveSelection, false);
  assert.equal(boardRenders()[0].options.showToast, false);
  assert.equal(boardRenders()[0].options.restoreActiveSheet, false);

  const dashboard = extractFunction(source, "refreshDashboardData");
  const status = extractFunction(source, "setDashboardRefreshStatus_");
  const control = extractFunction(source, "setDashboardControlStatus_");

  for (const body of [dashboard, status, control]) {
    assert.doesNotMatch(body, /\.toast\(|\.activate\(|getUi\(/);
  }

  sandbox.reset();
  sandbox.active.name = "Dashboard";
  sandbox.store[BOARD_KEY] = "1";
  sandbox.store[DASHBOARD_KEY] = "0";

  const interactive = sandbox.context.runDerivedViewRefreshLoop_();
  const manual = boardRenders()[0].options;

  assert.equal(interactive.boardRebuilds, 1);
  assert.equal(interactive.dashboardRebuilds, 0);
  assert.equal(manual.background, false);
  assert.equal(manual.activate, true);
  assert.equal(manual.preserveSelection, true);
  assert.equal(manual.showToast, true);
  assert.equal(manual.restoreActiveSheet, true);
  assert.equal(
    sandbox.spreadsheetCalls.includes("getActiveSheet"),
    true,
  );
  assert.equal(
    sandbox.spreadsheetCalls.includes("activate:Dashboard"),
    true,
  );
});

test("background errors log only an error name", () => {
  sandbox.reset();
  sandbox.store[BOARD_KEY] = "1";
  sandbox.store[DASHBOARD_KEY] = "0";
  sandbox.context.renderPatientBoard = function () {
    const error = new Error("FAKE_NAME_TOKEN 555-0199");
    error.name = "Error";
    throw error;
  };

  const result = sandbox.context.refreshDirtyDerivedViewsScheduled();
  const logged = sandbox.errorLogs.join("\n");

  assert.equal(result.refreshed, false);
  assert.equal(result.boardRebuilds, 1);
  assert.match(logged, /name=Error/);
  assert.equal(logged.includes("FAKE_NAME_TOKEN"), false);
  assert.equal(logged.includes("555-0199"), false);
});

test("H: trigger setup creates one trigger and a second run does not duplicate it", () => {
  sandbox.reset();
  sandbox.triggers.push({
    id: 50,
    handler: "onOpen",
    minutes: null,
  });

  assert.equal(
    extractConstString(source, "DERIVED_VIEW_AUTO_REFRESH_HANDLER_"),
    HANDLER,
  );
  assert.equal(
    extractConstNumber(source, "DERIVED_VIEW_AUTO_REFRESH_MINUTES_"),
    1,
  );

  const install = extractFunction(
    source,
    "installDerivedViewAutoRefreshTrigger",
  );
  const remove = extractFunction(
    source,
    "removeDerivedViewAutoRefreshTrigger",
  );
  const list = extractFunction(
    source,
    "listDerivedViewAutoRefreshTriggers_",
  );

  assert.match(
    install,
    /everyMinutes\(\s*DERIVED_VIEW_AUTO_REFRESH_MINUTES_\s*\)/,
  );
  assert.match(list, /DERIVED_VIEW_AUTO_REFRESH_HANDLER_/);
  assert.match(list, /getHandlerFunction\(\)/);
  assert.doesNotMatch(list, /deleteTrigger/);
  assert.doesNotMatch(install, /getProjectTriggers/);
  assert.doesNotMatch(remove, /getProjectTriggers/);
  assert.doesNotMatch(install, /openById\(/);
  assert.doesNotMatch(remove, /openById\(/);

  const first = sandbox.context.installDerivedViewAutoRefreshTrigger();
  assert.equal(first.created, true);
  assert.equal(first.count, 1);
  assert.equal(
    sandbox.triggers.filter((trigger) => trigger.handler === HANDLER)
      .length,
    1,
  );
  assert.equal(
    sandbox.triggers.find((trigger) => trigger.handler === HANDLER)
      .minutes,
    1,
  );

  const second = sandbox.context.installDerivedViewAutoRefreshTrigger();
  assert.equal(second.created, false);
  assert.equal(second.count, 1);
  assert.equal(
    sandbox.triggers.filter((trigger) => trigger.handler === HANDLER)
      .length,
    1,
  );
  assert.equal(
    sandbox.triggers.filter((trigger) => trigger.handler === "onOpen")
      .length,
    1,
  );

  sandbox.triggers.push({
    id: 80,
    handler: HANDLER,
    minutes: 1,
  });
  const collapsed = sandbox.context.installDerivedViewAutoRefreshTrigger();
  assert.equal(collapsed.created, false);
  assert.equal(
    sandbox.triggers.filter((trigger) => trigger.handler === HANDLER)
      .length,
    1,
  );
  assert.equal(
    sandbox.triggers.filter((trigger) => trigger.handler === "onOpen")
      .length,
    1,
  );

  const removed = sandbox.context.removeDerivedViewAutoRefreshTrigger();
  assert.equal(removed.removed, 1);
  assert.equal(removed.count, 0);
  assert.equal(
    sandbox.triggers.filter((trigger) => trigger.handler === HANDLER)
      .length,
    0,
  );
  assert.equal(
    sandbox.triggers.filter((trigger) => trigger.handler === "onOpen")
      .length,
    1,
  );

  const removedAgain = sandbox.context.removeDerivedViewAutoRefreshTrigger();
  assert.equal(removedAgain.removed, 0);
  assert.equal(sandbox.triggers.length, 1);
});

function loadBoardCanvasSandbox() {
  const scriptSource = [
    extractStatement(source, "PATIENT_BOARD_LAYOUT"),
    extractFunction(source, "boardDynamicRowCount_"),
    extractFunction(source, "isDefaultSheetBackground_"),
    extractFunction(source, "boardRowHasSurfaceFormatting_"),
    extractFunction(source, "boardSurfaceTailLastRow_"),
    extractFunction(source, "startPerf_"),
    extractFunction(source, "endPerf_"),
    extractFunction(source, "withPerf_"),
    extractFunction(source, "applyBoardActionRail_"),
    extractFunction(source, "preparePatientBoardSheet_"),
    "globalThis.__boardLayout = PATIENT_BOARD_LAYOUT;",
  ].join("\n\n");

  const context = {
    console: {
      log() {},
      error() {},
    },
    SpreadsheetApp: {
      BorderStyle: {
        SOLID: "SOLID",
      },
    },
  };

  vm.runInNewContext(scriptSource, context);
  return context;
}

function createFakeBoardSheet({
  lastRow,
  maxRows,
  backgroundAt = () => "#ffffff",
}) {
  const operations = [];
  let seq = 0;

  function geometry(row, column, numRows, numColumns) {
    return {
      row,
      column,
      numRows,
      numColumns,
      lastRow: row + numRows - 1,
      lastColumn: column + numColumns - 1,
    };
  }

  function push(op) {
    operations.push({
      seq: seq++,
      ...op,
    });
  }

  function makeRange(row, column, numRows, numColumns) {
    const bounds = geometry(row, column, numRows, numColumns);
    const range = {
      ...bounds,
      breakApart() {
        push({ op: "breakApart", ...bounds });
      },
      clearContent() {
        push({ op: "clearContent", ...bounds });
      },
      clearFormat() {
        push({ op: "clearFormat", ...bounds });
      },
      clearNote() {
        push({ op: "clearNote", ...bounds });
      },
      clearDataValidations() {
        push({ op: "clearDataValidations", ...bounds });
      },
      setBackground(color) {
        push({ op: "setBackground", color, ...bounds });
        return range;
      },
      setFontFamily(font) {
        push({ op: "setFontFamily", font, ...bounds });
        return range;
      },
      setFontColor(color) {
        push({ op: "setFontColor", color, ...bounds });
        return range;
      },
      setBorder() {
        push({ op: "setBorder", ...bounds });
        return range;
      },
      getBackgrounds() {
        push({ op: "getBackgrounds", ...bounds });
        const rows = [];

        for (let row = bounds.row; row <= bounds.lastRow; row++) {
          const colors = [];

          for (
            let column = bounds.column;
            column <= bounds.lastColumn;
            column++
          ) {
            colors.push(backgroundAt(row, column));
          }

          rows.push(colors);
        }

        return rows;
      },
    };

    push({ op: "getRange", ...bounds });
    return range;
  }

  return {
    operations,
    getLastRow() {
      return lastRow;
    },
    getMaxRows() {
      push({ op: "getMaxRows", maxRows });
      return maxRows;
    },
    insertRowsAfter(after, count) {
      push({ op: "insertRowsAfter", after, count, lastRow: after + count });
    },
    getRange(row, column, numRows, numColumns) {
      return makeRange(row, column, numRows, numColumns);
    },
    setHiddenGridlines() {},
    setColumnWidth() {},
    setRowHeight(row) {
      push({ op: "setRowHeight", row, lastRow: row });
    },
    setFrozenRows() {},
  };
}

test("zero-lead Board repaints the dark canvas through every cleared row", () => {
  const board = loadBoardCanvasSandbox();
  const layout = board.__boardLayout;
  const previousLastRow = 64;
  const maxRows = 400;
  const requiredRows = Math.max(
    20,
    layout.firstCardRow + 2,
  );
  const lastClearRow = Math.max(
    previousLastRow,
    requiredRows,
    layout.firstCardRow,
  );

  assert.equal(requiredRows, 20);
  assert.ok(previousLastRow > requiredRows);
  assert.ok(maxRows > lastClearRow);
  assert.equal(lastClearRow, previousLastRow);

  const sheet = createFakeBoardSheet({
    lastRow: previousLastRow,
    maxRows,
  });

  assert.deepEqual(Array.from(layout.laneStarts), [2, 7, 12, 17, 22]);
  assert.deepEqual(Array.from(layout.spacerColumns), [6, 11, 16, 21]);
  Array.from(layout.laneStarts).forEach((start) => {
    assert.ok(start + 3 <= layout.lastBoardColumn);
  });
  assert.equal(layout.lastBoardColumn, 25);
  assert.equal(layout.actionRailFirstColumn, 26);
  assert.equal(layout.actionRailColumnCount, 4);
  assert.equal(
    layout.actionRailFirstColumn + layout.actionRailColumnCount - 1,
    layout.applicationHeaderLastColumn,
  );
  assert.equal(layout.applicationHeaderLastColumn, 29);

  board.preparePatientBoardSheet_(sheet, {
    lanes: [
      { cards: [], status: "Open Lead" },
      { cards: [], status: "Follow Up" },
      { cards: [], status: "Scheduled" },
      { cards: [], status: "Case Lost" },
      { cards: [], status: "Unrelated" },
    ],
  });

  const boardClear = sheet.operations.find(
    (op) =>
      op.op === "clearFormat" &&
      op.column === layout.gutterColumn &&
      op.numColumns ===
        layout.applicationHeaderLastColumn - layout.gutterColumn + 1,
  );
  const canvasPaint = sheet.operations.find(
    (op) =>
      op.op === "setBackground" &&
      op.column === layout.gutterColumn &&
      op.numColumns === layout.lastBoardColumn,
  );
  const canvasFont = sheet.operations.find(
    (op) =>
      op.op === "setFontFamily" &&
      op.column === layout.gutterColumn &&
      op.lastColumn === layout.lastBoardColumn,
  );
  const canvasFontColor = sheet.operations.find(
    (op) =>
      op.op === "setFontColor" &&
      op.column === layout.gutterColumn &&
      op.lastColumn === layout.lastBoardColumn,
  );

  assert.ok(boardClear);
  assert.equal(boardClear.row, layout.firstDynamicRow);
  assert.equal(boardClear.lastRow, lastClearRow);
  assert.ok(canvasPaint);
  assert.ok(canvasPaint.seq > boardClear.seq);
  assert.equal(canvasPaint.color, layout.canvasBackground);
  assert.equal(canvasPaint.row, layout.firstDynamicRow);
  assert.equal(canvasPaint.lastColumn, layout.lastBoardColumn);
  assert.equal(canvasPaint.lastRow, lastClearRow);
  assert.equal(canvasPaint.numRows, lastClearRow - layout.firstDynamicRow + 1);
  assert.equal(canvasFont.lastRow, lastClearRow);
  assert.equal(canvasFontColor.lastRow, lastClearRow);
  assert.equal(canvasFont.font, layout.fontFamily);
  assert.equal(canvasFontColor.color, layout.canvasFontColor);

  const unpaintedClearedRows = [];

  for (let row = boardClear.row; row <= boardClear.lastRow; row++) {
    if (row < canvasPaint.row || row > canvasPaint.lastRow) {
      unpaintedClearedRows.push(row);
    }
  }

  assert.deepEqual(unpaintedClearedRows, []);

  const rewrittenPastClear = sheet.operations.filter(
    (op) =>
      op.lastRow > lastClearRow &&
      op.op !== "getBackgrounds" &&
      op.op !== "getRange" &&
      op.op !== "getMaxRows",
  );

  assert.deepEqual(rewrittenPastClear, []);
  assert.equal(
    sheet.operations.some(
      (op) =>
        op.op === "getBackgrounds" &&
        op.row === lastClearRow + 1 &&
        op.numRows < maxRows,
    ),
    true,
  );
  assert.equal(
    sheet.operations.some((op) => op.op === "insertRowsAfter"),
    false,
  );
  assert.equal(
    sheet.operations.some(
      (op) =>
        op.op === "getRange" &&
        op.numRows === maxRows - layout.firstDynamicRow + 1,
    ),
    false,
  );

  const railClear = sheet.operations.find(
    (op) =>
      op.op === "clearFormat" &&
      op.column === layout.actionRailFirstColumn &&
      op.numColumns === layout.actionRailColumnCount,
  );
  const railPaint = sheet.operations.find(
    (op) =>
      op.op === "setBackground" &&
      op.column === layout.actionRailFirstColumn,
  );

  assert.ok(railClear);
  assert.ok(railPaint);
  assert.ok(railPaint.seq > railClear.seq);
  assert.equal(railPaint.color, "#171A21");
  assert.equal(railClear.row, layout.firstDynamicRow);
  assert.equal(railPaint.row, layout.firstDynamicRow);
  assert.equal(railClear.lastRow, lastClearRow);
  assert.equal(railPaint.lastRow, lastClearRow);
  assert.equal(railPaint.lastRow, canvasPaint.lastRow);
  assert.equal(railPaint.lastColumn, layout.applicationHeaderLastColumn);
  assert.ok(lastClearRow > requiredRows);

  const railGap = [];

  for (let row = railClear.row; row <= railClear.lastRow; row++) {
    const canvasCovers =
      row >= canvasPaint.row && row <= canvasPaint.lastRow;
    const railCovers =
      row >= railPaint.row && row <= railPaint.lastRow;

    if (!canvasCovers || !railCovers) {
      railGap.push(row);
    }
  }

  assert.deepEqual(railGap, []);
  assert.equal(
    sheet.operations.some(
      (op) =>
        op.op === "setBackground" &&
        op.numRows === maxRows - layout.firstDynamicRow + 1,
    ),
    false,
  );
});

test("stale four-lane tail is repainted through the same canvas and rail row", () => {
  const board = loadBoardCanvasSandbox();
  const layout = board.__boardLayout;
  const contentLastRow = 30;
  const tailLastRow = 34;
  const maxRows = 400;
  const sheet = createFakeBoardSheet({
    lastRow: contentLastRow,
    maxRows,
    backgroundAt(row, column) {
      if (row < contentLastRow + 1 || row > tailLastRow) {
        return "#ffffff";
      }

      if (column <= 20) {
        return "#0f1115";
      }

      if (column >= 21 && column <= 24) {
        return "#171a21";
      }

      return "#ffffff";
    },
  });

  board.preparePatientBoardSheet_(sheet, {
    lanes: [
      { cards: [] },
      { cards: [] },
      { cards: [] },
      { cards: [] },
      { cards: [] },
    ],
  });

  const canvasPaint = sheet.operations.find(
    (op) =>
      op.op === "setBackground" &&
      op.column === layout.gutterColumn &&
      op.numColumns === layout.lastBoardColumn,
  );
  const railPaint = sheet.operations.find(
    (op) =>
      op.op === "setBackground" &&
      op.column === layout.actionRailFirstColumn,
  );
  const boardClear = sheet.operations.find(
    (op) =>
      op.op === "clearFormat" &&
      op.column === layout.gutterColumn &&
      op.numColumns ===
        layout.applicationHeaderLastColumn - layout.gutterColumn + 1,
  );

  assert.equal(canvasPaint.lastRow, tailLastRow);
  assert.equal(canvasPaint.lastColumn, layout.lastBoardColumn);
  assert.equal(railPaint.lastRow, tailLastRow);
  assert.equal(railPaint.lastColumn, layout.applicationHeaderLastColumn);
  assert.equal(boardClear.lastRow, tailLastRow);
  assert.ok(tailLastRow > contentLastRow);

  const paintedPastTail = sheet.operations.filter(
    (op) =>
      op.op === "setBackground" &&
      op.lastRow > tailLastRow,
  );
  const clearedPastTail = sheet.operations.filter(
    (op) =>
      op.op === "clearFormat" &&
      op.lastRow > tailLastRow,
  );

  assert.deepEqual(paintedPastTail, []);
  assert.deepEqual(clearedPastTail, []);
  assert.equal(
    sheet.operations.some(
      (op) =>
        op.op === "setBackground" &&
        op.numRows === maxRows - layout.firstDynamicRow + 1,
    ),
    false,
  );
});

test("setupBoardStaticHeader styles row 1 through AC and preserves A1", () => {
  const scriptSource = [
    extractStatement(source, "PATIENT_BOARD_LAYOUT"),
    extractFunction(source, "cellIsInMultiCellMerge_"),
    extractFunction(source, "prepareStaticHeaderRow1_"),
    extractFunction(source, "applyStaticApplicationHeaderTitle_"),
    extractFunction(source, "setupBoardStaticHeader"),
  ].join("\n\n");

  const cells = new Map();
  cells.set("1:1", { value: "CLINIC_LOGO_CELL" });

  const operations = [];

  function bounds(row, column, numRows, numColumns) {
    return {
      row,
      column,
      numRows,
      numColumns,
      lastRow: row + numRows - 1,
      lastColumn: column + numColumns - 1,
    };
  }

  function cellAt(row, column) {
    const key = `${row}:${column}`;

    if (!cells.has(key)) {
      cells.set(key, { value: "" });
    }

    return cells.get(key);
  }

  function cellsIn(rangeBounds) {
    const found = [];

    for (let row = rangeBounds.row; row <= rangeBounds.lastRow; row++) {
      for (
        let column = rangeBounds.column;
        column <= rangeBounds.lastColumn;
        column++
      ) {
        found.push(cellAt(row, column));
      }
    }

    return found;
  }

  function makeRange(row, column, numRows, numColumns) {
    const rangeBounds = bounds(row, column, numRows, numColumns);
    const range = {
      ...rangeBounds,
      getMergedRanges() {
        return [];
      },
      breakApart() {
        operations.push({ op: "breakApart", ...rangeBounds });
      },
      clearContent() {
        operations.push({ op: "clearContent", ...rangeBounds });
        cellsIn(rangeBounds).forEach((cell) => {
          cell.value = "";
        });
      },
      clearFormat() {
        operations.push({ op: "clearFormat", ...rangeBounds });
      },
      clearNote() {
        operations.push({ op: "clearNote", ...rangeBounds });
      },
      clearDataValidations() {
        operations.push({ op: "clearDataValidations", ...rangeBounds });
      },
      merge() {
        operations.push({ op: "merge", ...rangeBounds });
        return range;
      },
      setValue(value) {
        operations.push({ op: "setValue", value, ...rangeBounds });
        cellsIn(rangeBounds).forEach((cell) => {
          cell.value = value;
        });
        return range;
      },
      setFontFamily(font) {
        operations.push({ op: "setFontFamily", font, ...rangeBounds });
        return range;
      },
      setFontSize(size) {
        operations.push({ op: "setFontSize", size, ...rangeBounds });
        return range;
      },
      setFontWeight(weight) {
        operations.push({ op: "setFontWeight", weight, ...rangeBounds });
        return range;
      },
      setFontColor(color) {
        operations.push({ op: "setFontColor", color, ...rangeBounds });
        return range;
      },
      setHorizontalAlignment(alignment) {
        operations.push({
          op: "setHorizontalAlignment",
          alignment,
          ...rangeBounds,
        });
        return range;
      },
      setVerticalAlignment(alignment) {
        operations.push({
          op: "setVerticalAlignment",
          alignment,
          ...rangeBounds,
        });
        return range;
      },
      setBackground(color) {
        operations.push({ op: "setBackground", color, ...rangeBounds });
        return range;
      },
      setBorder() {
        operations.push({ op: "setBorder", ...rangeBounds });
        return range;
      },
    };

    operations.push({ op: "getRange", ...rangeBounds });
    return range;
  }

  const sheet = {
    getName() {
      return "Board";
    },
    getRange(row, column, numRows, numColumns) {
      return makeRange(row, column, numRows || 1, numColumns || 1);
    },
    setRowHeight(row, height) {
      operations.push({ op: "setRowHeight", row, height });
    },
    setFrozenRows(rows) {
      operations.push({ op: "setFrozenRows", rows });
    },
  };

  const context = {
    PATIENT_BOARD_LAYOUT: null,
    SpreadsheetApp: {
      BorderStyle: { SOLID: "SOLID" },
      getActiveSpreadsheet() {
        return {
          getSheetByName(name) {
            assert.equal(name, "Board");
            return sheet;
          },
        };
      },
    },
  };

  vm.runInNewContext(
    `${scriptSource}\nthis.PATIENT_BOARD_LAYOUT = PATIENT_BOARD_LAYOUT;`,
    context,
  );

  const layout = context.PATIENT_BOARD_LAYOUT;
  const result = context.setupBoardStaticHeader();

  assert.equal(result.logoCell, "A1");
  assert.equal(result.sheet, "Board");
  assert.equal(cellAt(1, 1).value, "CLINIC_LOGO_CELL");

  const headerPaint = operations.find(
    (op) => op.op === "setBackground" && op.row === 1,
  );
  const titleValue = operations.find(
    (op) => op.op === "setValue" && op.row === 1,
  );
  const titleMerge = operations.find(
    (op) => op.op === "merge" && op.row === 1,
  );

  assert.ok(headerPaint);
  assert.equal(headerPaint.column, 1);
  assert.equal(headerPaint.numRows, 1);
  assert.equal(headerPaint.lastColumn, layout.applicationHeaderLastColumn);
  assert.equal(headerPaint.lastColumn, 29);
  assert.equal(headerPaint.color, "#171A21");
  assert.ok(titleValue);
  assert.equal(titleValue.column, 2);
  assert.equal(titleValue.lastColumn, 29);
  assert.equal(titleValue.value, "The Urology Place — Patient Leads");
  assert.equal(titleMerge.column, 2);
  assert.equal(titleMerge.lastColumn, 29);
  assert.equal(
    operations.some(
      (op) =>
        op.row === 1 &&
        op.column === 1 &&
        ["clearContent", "setValue", "merge"].includes(op.op) &&
        op.numColumns === 1,
    ),
    false,
  );
  assert.equal(
    operations.some(
      (op) =>
        ["clearContent", "setValue", "merge"].includes(op.op) &&
        op.column === 1 &&
        op.numColumns > 1,
    ),
    false,
  );
  assert.equal(
    operations.find((op) => op.op === "setFontWeight").weight,
    "bold",
  );
  assert.equal(
    operations.find((op) => op.op === "setFontSize").size,
    18,
  );
  assert.equal(
    operations.find((op) => op.op === "setFrozenRows").rows,
    layout.frozenRows,
  );
  assert.equal(
    operations.some((op) =>
      /insertImage|getImages|removeImage|deleteImage/.test(op.op),
    ),
    false,
  );

  const render = extractFunction(source, "renderPatientBoard");
  assert.equal(render.includes("setupBoardStaticHeader"), false);
  assert.equal(render.includes("setupStaticApplicationHeaders"), false);
  assert.match(
    source,
    /"ADMIN: Refresh Board Static Header",\s*"setupBoardStaticHeader"/,
  );
});
