/**
 * Fake-data proofs for archive and cold storage.
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
const SOURCE_PATH = path.join(ROOT, "crm/code.gs");
const source = readFileSync(SOURCE_PATH, "utf8");

const PHI = [
  "ZZSECRETNAME",
  "ZZSECRETLAST",
  "555-0100",
  "zzsecret@patient.test",
  "ZZSECRETMESSAGE",
  "ZZSECRETREASONTEXT",
  "ZZSECRETREASON",
  "ZZSECRETFILENAME",
  "staff@example.com",
];

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
  const stack = ["code"];
  let depth = 0;

  for (let index = bodyStart; index < fileSource.length; index += 1) {
    const ch = fileSource[index];
    const next = fileSource[index + 1];
    const state = stack[stack.length - 1];

    if (state === "line") {
      if (ch === "\n") stack.pop();
      continue;
    }

    if (state === "block") {
      if (ch === "*" && next === "/") {
        stack.pop();
        index += 1;
      }
      continue;
    }

    if (state === "sq") {
      if (ch === "\\") index += 1;
      else if (ch === "'") stack.pop();
      continue;
    }

    if (state === "dq") {
      if (ch === "\\") index += 1;
      else if (ch === '"') stack.pop();
      continue;
    }

    if (state === "tpl") {
      if (ch === "\\") {
        index += 1;
        continue;
      }
      if (ch === "`") {
        stack.pop();
        continue;
      }
      if (ch === "$" && next === "{") {
        stack.push("code");
        index += 1;
      }
      continue;
    }

    if (ch === "'") stack.push("sq");
    else if (ch === '"') stack.push("dq");
    else if (ch === "`") stack.push("tpl");
    else if (ch === "/" && next === "/") {
      stack.push("line");
      index += 1;
    } else if (ch === "/" && next === "*") {
      stack.push("block");
      index += 1;
    } else if (ch === "{") {
      if (stack.length === 1) depth += 1;
    } else if (ch === "}") {
      if (stack.length > 1) stack.pop();
      else {
        depth -= 1;
        if (depth === 0) {
          return fileSource.slice(start, index + 1);
        }
      }
    }
  }

  throw new Error(`unclosed function ${name}`);
}

function displayValue(value) {
  if (value == null || value === "") return "";
  if (value === true) return "TRUE";
  if (value === false) return "FALSE";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function zoneParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone || "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const map = {};
  parts.forEach((part) => {
    if (part.type !== "literal") map[part.type] = part.value;
  });
  if (map.hour === "24") map.hour = "00";
  return map;
}

function formatZoned(date, timeZone, pattern) {
  const map = zoneParts(date, timeZone);
  if (pattern === "yyyy-MM-dd") {
    return `${map.year}-${map.month}-${map.day}`;
  }
  if (pattern === "MM/dd/yyyy") {
    return `${map.month}/${map.day}/${map.year}`;
  }
  if (pattern === "HH:mm") {
    return `${map.hour}:${map.minute}`;
  }
  if (pattern === "MM/dd/yyyy HH:mm:ss") {
    return `${map.month}/${map.day}/${map.year} ${map.hour}:${map.minute}:${map.second}`;
  }
  return "";
}

function parseZonedDate(text, timeZone) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/.exec(
    String(text || ""),
  );
  if (!match) return new Date(NaN);
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const desired = Date.UTC(year, month - 1, day, hour, minute, second);
  let guess = desired;
  for (let index = 0; index < 4; index += 1) {
    const map = zoneParts(new Date(guess), timeZone);
    const actual = Date.UTC(
      Number(map.year),
      Number(map.month) - 1,
      Number(map.day),
      Number(map.hour),
      Number(map.minute),
      Number(map.second),
    );
    guess += desired - actual;
  }
  return new Date(guess);
}

function columnNumber(letters) {
  let number = 0;

  for (const letter of letters) {
    number = number * 26 + (letter.charCodeAt(0) - 64);
  }

  return number;
}

function createSheet(name, workbook) {
  const grid = [];
  const protections = [];
  const validations = {};
  const formulas = {};
  const backgrounds = {};
  const rowHeights = {};
  const maxRows = 80;
  let hidden = false;
  let activeRow = 1;

  function ensure(row, column) {
    while (grid.length < row) grid.push([]);
    const values = grid[row - 1];
    while (values.length < column) values.push("");
  }

  function getCell(row, column) {
    const values = grid[row - 1];
    if (!values || values.length < column) return "";
    return values[column - 1] == null ? "" : values[column - 1];
  }

  function setCell(row, column, value) {
    ensure(row, column);
    grid[row - 1][column - 1] = value;
    delete formulas[`${row},${column}`];
  }

  function formulaRows() {
    const rows = [];
    Object.keys(formulas).forEach((key) => {
      if (formulas[key]) {
        rows.push(Number(key.split(",")[0]));
      }
    });
    return rows;
  }

  function makeRange(row, column, numRows, numCols) {
    const range = {
      getValue() {
        return getCell(row, column);
      },
      getDisplayValue() {
        return displayValue(getCell(row, column));
      },
      getValues() {
        const values = [];
        for (let r = 0; r < numRows; r += 1) {
          const line = [];
          for (let c = 0; c < numCols; c += 1) {
            line.push(getCell(row + r, column + c));
          }
          values.push(line);
        }
        return values;
      },
      getDisplayValues() {
        return range.getValues().map((line) => line.map(displayValue));
      },
      setValue(value) {
        setCell(row, column, value);
        return range;
      },
      setValues(values) {
        values.forEach((line, r) => {
          line.forEach((value, c) => {
            setCell(row + r, column + c, value);
          });
        });
        return range;
      },
      clearContent() {
        for (let r = 0; r < numRows; r += 1) {
          for (let c = 0; c < numCols; c += 1) {
            setCell(row + r, column + c, "");
          }
        }
        return range;
      },
      setDataValidation(rule) {
        for (let r = 0; r < numRows; r += 1) {
          for (let c = 0; c < numCols; c += 1) {
            validations[`${row + r},${column + c}`] = rule;
          }
        }
        return range;
      },
      getDataValidations() {
        const matrix = [];
        for (let r = 0; r < numRows; r += 1) {
          const line = [];
          for (let c = 0; c < numCols; c += 1) {
            line.push(validations[`${row + r},${column + c}`] || null);
          }
          matrix.push(line);
        }
        return matrix;
      },
      setFormula(formula) {
        ensure(row, column);
        formulas[`${row},${column}`] = String(formula || "");
        return range;
      },
      getFormula() {
        return formulas[`${row},${column}`] || "";
      },
      getFormulas() {
        const matrix = [];
        for (let r = 0; r < numRows; r += 1) {
          const line = [];
          for (let c = 0; c < numCols; c += 1) {
            line.push(formulas[`${row + r},${column + c}`] || "");
          }
          matrix.push(line);
        }
        return matrix;
      },
      setBackground(color) {
        for (let r = 0; r < numRows; r += 1) {
          for (let c = 0; c < numCols; c += 1) {
            backgrounds[`${row + r},${column + c}`] = color;
          }
        }
        return range;
      },
      getBackground() {
        return backgrounds[`${row},${column}`] || null;
      },
      getRow() {
        return row;
      },
      getColumn() {
        return column;
      },
      getNumRows() {
        return numRows;
      },
      getNumColumns() {
        return numCols;
      },
      getA1Notation() {
        return `R${row}C${column}`;
      },
      getSheet() {
        return sheet;
      },
    };

    return new Proxy(range, {
      get(target, prop) {
        if (prop in target) return target[prop];
        return () => target;
      },
    });
  }

  const sheet = {
    getName() {
      return name;
    },
    getLastRow() {
      const last = Math.max(grid.length, ...formulaRows(), 0);
      for (let row = last; row >= 1; row -= 1) {
        const values = grid[row - 1] || [];
        if (values.some((value) => value !== "" && value != null)) {
          return row;
        }
        if (formulaRows().includes(row)) {
          return row;
        }
      }
      return 0;
    },
    setRowHeight(row, height) {
      rowHeights[row] = height;
    },
    getRowHeight(row) {
      return rowHeights[row] || 21;
    },
    getLastColumn() {
      let last = 0;
      grid.forEach((values) => {
        for (let column = values.length; column >= 1; column -= 1) {
          const value = values[column - 1];
          if (value !== "" && value != null && column > last) {
            last = column;
          }
        }
      });
      return last;
    },
    getMaxRows() {
      return maxRows;
    },
    getMaxColumns() {
      return Math.max(26, sheet.getLastColumn());
    },
    hideSheet() {
      hidden = true;
    },
    showSheet() {
      hidden = false;
    },
    isSheetHidden() {
      return hidden;
    },
    activate() {
      workbook.activeName = name;
    },
    setActiveRange(range) {
      activeRow = range.getRow();
    },
    getActiveRange() {
      return makeRange(activeRow, 1, 1, 1);
    },
    hideColumns() {},
    setFrozenRows() {},
    getProtections() {
      return protections.slice();
    },
    protect() {
      const protection = {
        description: "",
        warningOnly: false,
        setDescription(value) {
          this.description = value;
          return this;
        },
        getDescription() {
          return this.description;
        },
        setWarningOnly(value) {
          this.warningOnly = value;
          return this;
        },
        isWarningOnly() {
          return this.warningOnly;
        },
        canEdit() {
          return true;
        },
        remove() {},
        unprotectedRanges: [],
        setUnprotectedRanges(ranges) {
          this.unprotectedRanges = ranges || [];
          return this;
        },
        getUnprotectedRanges() {
          return this.unprotectedRanges;
        },
      };
      protections.push(protection);
      return protection;
    },
    getRange(rowOrA1, column, numRows, numCols) {
      if (typeof rowOrA1 === "string") {
        const match = /^([A-Z]+)(\d+)(?::([A-Z]+)(\d+))?$/.exec(rowOrA1);
        if (!match) {
          throw new Error(`unsupported range ${rowOrA1}`);
        }
        const startRow = Number(match[2]);
        const startColumn = columnNumber(match[1]);
        const endRow = match[4] ? Number(match[4]) : startRow;
        const endColumn = match[3] ? columnNumber(match[3]) : startColumn;
        return makeRange(
          startRow,
          startColumn,
          endRow - startRow + 1,
          endColumn - startColumn + 1,
        );
      }
      return makeRange(
        rowOrA1,
        column,
        numRows || 1,
        numCols || 1,
      );
    },
  };

  sheet._setActiveRow = (row) => {
    activeRow = row;
  };

  return sheet;
}

function createHarness() {
  const logs = [];
  const files = {};
  const driveReads = [];
  const lockState = { held: false };
  let fileSeq = 1;
  let uuid = 0;
  const docProps = {};
  const scriptProps = {};
  const projectTriggers = [];
  const sheets = {};
  const workbook = {
    activeName: "Board",
    getSheetByName(name) {
      return sheets[name] || null;
    },
    insertSheet(name) {
      sheets[name] = createSheet(name, workbook);
      return sheets[name];
    },
    getActiveSheet() {
      return sheets[workbook.activeName];
    },
    getSpreadsheetTimeZone() {
      return "America/Chicago";
    },
    toast() {},
  };

  function propBag(store) {
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
  }

  function makeBlob(text, name) {
    let blobName = name || "blob";
    return {
      getName() {
        return blobName;
      },
      setName(next) {
        blobName = next;
        return this;
      },
      getDataAsString() {
        return text;
      },
      getBytes() {
        return Buffer.from(text);
      },
    };
  }

  const context = {
    console: {
      log(...args) {
        logs.push(args.map((arg) => String(arg)).join(" "));
      },
      error(...args) {
        logs.push(args.map((arg) => {
          if (arg instanceof Error) return `${arg.name} ${arg.message}`;
          return String(arg);
        }).join(" "));
      },
    },
    Utilities: {
      getUuid() {
        uuid += 1;
        return `00000000-0000-4000-8000-${String(uuid).padStart(12, "0")}`;
      },
      formatDate(date, timeZone, format) {
        const value = date instanceof Date ? date : new Date(date);
        if (Number.isNaN(value.getTime())) return "";
        const pattern = String(format || "");
        if (
          pattern === "yyyy-MM-dd"
          || pattern === "MM/dd/yyyy"
          || pattern === "HH:mm"
          || pattern === "MM/dd/yyyy HH:mm:ss"
        ) {
          return formatZoned(value, timeZone, pattern);
        }
        const month = String(value.getMonth() + 1).padStart(2, "0");
        const day = String(value.getDate()).padStart(2, "0");
        return `${value.getFullYear()}-${month}-${day}`;
      },
      parseDate(text, timeZone, format) {
        const parsed = format === "MM/dd/yyyy HH:mm:ss"
          ? parseZonedDate(text, timeZone)
          : new Date(text);
        const VmDate = context.__exports && context.__exports.Date;
        if (!VmDate || Number.isNaN(parsed.getTime())) return parsed;
        return new VmDate(parsed.getTime());
      },
      newBlob(data, _type, name) {
        return makeBlob(String(data), name);
      },
      zip(blobs) {
        const payload = {};
        blobs.forEach((blob) => {
          payload[blob.getName()] = blob.getDataAsString();
        });
        return makeBlob(JSON.stringify(payload), "bundle.zip");
      },
      unzip(blob) {
        const payload = JSON.parse(blob.getDataAsString());
        return Object.keys(payload).map((name) =>
          makeBlob(payload[name], name)
        );
      },
    },
    Session: {
      getActiveUser() {
        return { getEmail: () => "staff@example.com" };
      },
      getEffectiveUser() {
        return { getEmail: () => "staff@example.com" };
      },
    },
    LockService: {
      getScriptLock() {
        return {
          waitLock() {
            if (lockState.held) throw new Error("timeout");
            lockState.held = true;
          },
          releaseLock() {
            lockState.held = false;
          },
        };
      },
    },
    ScriptApp: {
      getProjectTriggers() {
        return projectTriggers.slice();
      },
      newTrigger(handler) {
        const spec = { handler };
        const builder = {
          timeBased() {
            return builder;
          },
          everyMinutes() {
            return builder;
          },
          everyDays() {
            return builder;
          },
          create() {
            const trigger = {
              getHandlerFunction() {
                return spec.handler;
              },
            };
            projectTriggers.push(trigger);
            return trigger;
          },
        };
        return builder;
      },
      deleteTrigger(trigger) {
        const index = projectTriggers.indexOf(trigger);
        if (index >= 0) projectTriggers.splice(index, 1);
      },
    },
    PropertiesService: {
      getDocumentProperties() {
        return propBag(docProps);
      },
      getScriptProperties() {
        return propBag(scriptProps);
      },
    },
    DriveApp: {
      getFolderById(id) {
        if (id === "missing-folder") {
          throw new Error("missing folder");
        }
        return {
          createFile(blob) {
            const fileId = `FILE-${fileSeq}`;
            fileSeq += 1;
            files[fileId] = {
              id: fileId,
              name: blob.getName(),
              blob,
              trashed: false,
            };
            return {
              getId: () => fileId,
              getName: () => files[fileId].name,
              setTrashed: (value) => {
                files[fileId].trashed = Boolean(value);
              },
            };
          },
        };
      },
      getFileById(id) {
        driveReads.push(id);
        const file = files[id];
        if (!file || file.trashed) throw new Error("missing file");
        return {
          getId: () => id,
          getName: () => file.name,
          getBlob: () => file.blob,
          isTrashed: () => file.trashed,
          setTrashed: (value) => {
            file.trashed = Boolean(value);
          },
        };
      },
    },
    SpreadsheetApp: {
      getActiveSpreadsheet() {
        return workbook;
      },
      flush() {},
      getUi() {
        return {
          alert() {},
          Button: { OK: "OK", CANCEL: "CANCEL" },
          ButtonSet: { OK: "OK", OK_CANCEL: "OK_CANCEL" },
        };
      },
      newDataValidation() {
        const spec = {
          checkbox: false,
          values: null,
          showDropdown: false,
          allowInvalid: true,
        };
        return {
          requireCheckbox() {
            spec.checkbox = true;
            return this;
          },
          requireValueInList(values, showDropdown) {
            spec.values = Array.from(values);
            spec.showDropdown = Boolean(showDropdown);
            return this;
          },
          setAllowInvalid(allowInvalid) {
            spec.allowInvalid = Boolean(allowInvalid);
            return this;
          },
          build() {
            return {
              checkbox: spec.checkbox,
              values: spec.values ? spec.values.slice() : null,
              showDropdown: spec.showDropdown,
              allowInvalid: spec.allowInvalid,
            };
          },
        };
      },
      ProtectionType: { SHEET: "SHEET" },
      BorderStyle: { SOLID: "SOLID" },
    },
  };

  vm.runInNewContext(
    `${source}\nthis.__exports = { EXECUTION_CACHE_, PATIENT_LEADS_SYSTEM, WEBSITE_INGEST_LEDGER_HEADERS_, Date };`,
    context,
  );

  function resetCache() {
    const cache = context.__exports.EXECUTION_CACHE_;
    cache.headerMaps = {};
    cache.canonicalTables = {};
    cache.configRows = null;
    cache.leadRowsById = {};
    cache.leadSnapshots = {};
    cache.listValues = {};
    cache.dashboardDateKeyCache = {};
    cache.timezoneWithFallback = null;
    cache.dashboardTimezone = null;
    cache.spreadsheetTimezone = null;
    cache.actionOptions = null;
    cache.derivedViewLockHeld = false;
    cache.derivedViewUiEffects = null;
    cache.dashboardRefreshContext = null;
  }

  function headerMap(sheet) {
    const last = Math.max(sheet.getLastColumn(), 1);
    const headers = sheet.getRange(1, 1, 1, last).getValues()[0];
    const map = {};
    headers.forEach((header, index) => {
      const name = String(header || "").trim();
      if (name) map[name] = index + 1;
    });
    return map;
  }

  function writeHeaders(sheet, headers) {
    headers.forEach((header, index) => {
      sheet.getRange(1, index + 1).setValue(header);
    });
  }

  function writeObject(sheet, row, values) {
    const map = headerMap(sheet);
    Object.keys(values).forEach((key) => {
      if (!map[key]) {
        throw new Error(`missing header ${key} on ${sheet.getName()}`);
      }
      sheet.getRange(row, map[key]).setValue(values[key]);
    });
  }

  function readObjectValue(sheet, row, key) {
    const map = headerMap(sheet);
    return sheet.getRange(row, map[key]).getValue();
  }

  function boot(options = {}) {
    Object.keys(sheets).forEach((name) => {
      delete sheets[name];
    });
    Object.keys(files).forEach((id) => {
      delete files[id];
    });
    Object.keys(docProps).forEach((key) => {
      delete docProps[key];
    });
    driveReads.length = 0;
    logs.length = 0;
    lockState.held = false;
    fileSeq = 1;
    projectTriggers.splice(0, projectTriggers.length);
    resetCache();

    const leadHeaders = context.__exports.PATIENT_LEADS_SYSTEM.headers.Leads;
    const coreLeadHeaders = options.archiveHeaders === false
      ? leadHeaders.slice(0, leadHeaders.indexOf("archived"))
      : leadHeaders;

    writeHeaders(
      workbook.insertSheet("Leads"),
      coreLeadHeaders,
    );
    writeHeaders(
      workbook.insertSheet("ActivityLog"),
      context.__exports.PATIENT_LEADS_SYSTEM.headers.ActivityLog,
    );
    writeHeaders(
      workbook.insertSheet("Attachments"),
      context.__exports.PATIENT_LEADS_SYSTEM.headers.Attachments,
    );
    writeHeaders(
      workbook.insertSheet("Reactions"),
      context.__exports.PATIENT_LEADS_SYSTEM.headers.Reactions,
    );
    writeHeaders(
      workbook.insertSheet("WebsiteIngestLedger"),
      context.__exports.WEBSITE_INGEST_LEDGER_HEADERS_,
    );
    const config = workbook.insertSheet("Config");
    writeHeaders(config, ["Setting", "Value"]);
    [
      ["timezone", "America/Chicago"],
      ["default_status", "Open Lead / Follow Up"],
      ["max_standard_contact_attempts", "3"],
    ].forEach((pair, index) => {
      config.getRange(index + 2, 1).setValue(pair[0]);
      config.getRange(index + 2, 2).setValue(pair[1]);
    });
    workbook.insertSheet("Board");
    workbook.insertSheet("Dashboard");
    workbook.activeName = "Board";

    if (options.setup !== false) {
      const setup = context.setupLeadArchiveSchema_();
      assert.equal(setup.ok, true, setup.code);
      context.setConfigValue_(
        "archive_storage_folder_id",
        "DEV-FOLDER",
      );
      resetCache();
    }

    files["ATT-FILE"] = {
      id: "ATT-FILE",
      name: "attachment.bin",
      blob: makeBlob("attachment", "attachment.bin"),
      trashed: false,
    };

    return {
      leads: workbook.getSheetByName("Leads"),
      activity: workbook.getSheetByName("ActivityLog"),
      attachments: workbook.getSheetByName("Attachments"),
      reactions: workbook.getSheetByName("Reactions"),
      ledger: workbook.getSheetByName("WebsiteIngestLedger"),
    };
  }

  function daysAgo(days) {
    return new Date(Date.now() - days * 86400000);
  }

  function putLead(row, values) {
    writeObject(
      workbook.getSheetByName("Leads"),
      row,
      values,
    );
  }

  function leadValue(row, key) {
    return readObjectValue(
      workbook.getSheetByName("Leads"),
      row,
      key,
    );
  }

  function activityTypes() {
    const sheet = workbook.getSheetByName("ActivityLog");
    const map = headerMap(sheet);
    const types = [];
    for (let row = 2; row <= sheet.getLastRow(); row += 1) {
      const id = sheet.getRange(row, map.activity_id).getValue();
      if (id) types.push(sheet.getRange(row, map.activity_type).getValue());
    }
    return types;
  }

  function idsIn(sheetName, idHeader) {
    const sheet = workbook.getSheetByName(sheetName);
    const map = headerMap(sheet);
    const ids = [];
    for (let row = 2; row <= Math.max(sheet.getLastRow(), 1); row += 1) {
      const id = String(sheet.getRange(row, map[idHeader]).getValue() || "").trim();
      if (id) ids.push(id);
    }
    return ids;
  }

  function assertNoPhi() {
    const text = logs.join("\n");
    PHI.forEach((token) => {
      assert.equal(text.includes(token), false, token);
    });
  }

  return {
    context,
    logs,
    files,
    driveReads,
    lockState,
    workbook,
    boot,
    daysAgo,
    putLead,
    leadValue,
    activityTypes,
    idsIn,
    assertNoPhi,
    writeObject,
    readObjectValue,
    headerMap,
  };
}

const harness = createHarness();
const { context } = harness;

function baseLead(extra) {
  return Object.assign({
    first_name: "ZZSECRETNAME",
    last_name: "ZZSECRETLAST",
    phone: "555-0100",
    email: "zzsecret@patient.test",
    appointment_reason: "ZZSECRETREASONTEXT",
    message: "ZZSECRETMESSAGE",
    workflow_complete: false,
    archived: false,
    attempt_count: 1,
    created_at: new Date("2026-01-01T00:00:00Z"),
  }, extra);
}

test("archive code parses and scheduled reminder cannot offload", () => {
  assert.doesNotThrow(() => new vm.Script(source));
  const reminder = extractFunction(source, "refreshArchiveReminderScheduled");
  const setup = extractFunction(source, "setupLeadArchiveSchema_");
  const post = extractFunction(source, "doPost");
  const commit = extractFunction(source, "commitWebsiteIngestSuccess_");
  const scheduled = extractFunction(source, "refreshDirtyDerivedViewsScheduled");

  assert.doesNotMatch(reminder, /offloadArchivedLeads_|clearOperationalDataRow_|deleteRow|DriveApp/);
  assert.doesNotMatch(setup, /newTrigger|createFolder|deleteRow|offloadArchivedLeads_/);
  assert.doesNotMatch(post, /offloadArchivedLeads_|archiveLeadById_|restoreColdStoredLead_|ArchiveIndex/);
  assert.doesNotMatch(commit, /offloadArchivedLeads_|refreshPatientArchiveView_/);
  assert.doesNotMatch(scheduled, /offloadArchivedLeads_|clearOperationalDataRow_|deleteRow|archiveEligibleScheduledLeads/);
  assert.equal(
    source.includes('const DERIVED_VIEW_AUTO_REFRESH_MINUTES_ =\n  1;'),
    true,
  );
  assert.doesNotMatch(
    extractFunction(source, "archiveEligibleScheduledLeads_"),
    /offloadArchivedLeads_|DriveApp|deleteRow/,
  );
  assert.doesNotMatch(
    extractFunction(source, "archiveEligibleScheduledLeadsDaily"),
    /offloadArchivedLeads_|DriveApp|deleteRow|getUi\(/,
  );
  const clearer = extractFunction(source, "clearOperationalDataRow_");
  assert.doesNotMatch(clearer, /clearDataValidations|clearFormat|deleteRow|\bfalse\b/);
  assert.match(extractFunction(source, "buildDashboardLeadSnapshot_"), /isLeadRowArchived_/);
  const normalizer = extractFunction(source, "normalizeUnusedTemplateRows_");
  assert.doesNotMatch(normalizer, /deleteRow|clearFormat|clearDataValidations|console\.log/);
  assert.match(extractFunction(source, "setupLeadArchiveSchema_"), /normalizeUnusedTemplateRows_/);
  assert.match(commit, /registerDerivedViewDirtyFlags_/);
  assert.doesNotMatch(
    extractFunction(source, "unarchiveLeadById_"),
    /workflow_complete/,
  );
});

test("A-E archive eligibility and F-H board exclusion", () => {
  harness.boot();
  harness.putLead(2, baseLead({
    lead_id: "LEAD-OPEN",
    status: "Open Lead / Follow Up",
  }));
  harness.putLead(3, baseLead({
    lead_id: "LEAD-SCHED-OPEN",
    status: "Scheduled",
    workflow_complete: false,
  }));
  harness.putLead(4, baseLead({
    lead_id: "LEAD-SCHED-DONE",
    status: "Scheduled",
    workflow_complete: true,
  }));
  harness.putLead(5, baseLead({
    lead_id: "LEAD-LOST",
    status: "Case Lost",
    workflow_complete: false,
    lost_reason: "Cost",
  }));
  harness.putLead(6, baseLead({
    lead_id: "LEAD-UNRELATED",
    status: "Unrelated",
    workflow_complete: false,
    unrelated_type: "Vendor",
  }));
  harness.putLead(7, baseLead({
    lead_id: "LEAD-BLANK",
    status: "Scheduled",
    workflow_complete: true,
    archived: "",
  }));
  harness.putLead(8, baseLead({
    lead_id: "LEAD-BAD",
    status: "Not A Real Status",
  }));

  const open = context.archiveLeadById_("LEAD-OPEN", { force: true });
  assert.equal(open.code, "INELIGIBLE_STATUS");
  assert.equal(harness.leadValue(2, "archived"), false);

  const incomplete = context.archiveLeadById_("LEAD-SCHED-OPEN");
  assert.equal(incomplete.code, "ARCHIVED");
  assert.equal(harness.leadValue(3, "status"), "Scheduled");
  assert.equal(harness.leadValue(3, "workflow_complete"), false);
  assert.equal(harness.leadValue(3, "archived"), true);
  assert.equal(harness.activityTypes().includes("lead_archived"), true);

  const scheduled = context.archiveLeadById_("LEAD-SCHED-DONE", {
    reason: "ZZSECRETREASON",
  });
  assert.equal(scheduled.ok, true);
  assert.equal(scheduled.invalidation.board, true);
  assert.equal(scheduled.invalidation.dashboard, true);
  assert.equal(harness.leadValue(4, "archived"), true);
  assert.equal(harness.leadValue(4, "archived_from_status"), "Scheduled");
  assert.equal(harness.leadValue(4, "status"), "Scheduled");
  assert.equal(harness.leadValue(4, "workflow_complete"), true);
  assert.equal(harness.leadValue(4, "archive_reason"), "ZZSECRETREASON");

  assert.equal(context.archiveLeadById_("LEAD-LOST").ok, true);
  assert.equal(context.archiveLeadById_("LEAD-UNRELATED").ok, true);

  const board = context.buildPatientBoardData_();
  const statuses = board.lanes.flatMap((lane) =>
    lane.cards.map((card) => card.leadId)
  );
  assert.equal(statuses.includes("LEAD-SCHED-DONE"), false);
  assert.equal(statuses.includes("LEAD-LOST"), false);
  assert.equal(statuses.includes("LEAD-UNRELATED"), false);
  assert.equal(statuses.includes("LEAD-OPEN"), true);
  assert.equal(statuses.includes("LEAD-SCHED-OPEN"), false);
  assert.equal(statuses.includes("LEAD-BLANK"), true);
  assert.equal(statuses.includes("LEAD-BAD"), false);
  assert.equal(board.invalidStatusCount, 1);
  assert.equal(board.totalCards, 2);

  context.renderPatientArchive();
  const archive = harness.workbook.getSheetByName("Archive");
  const grid = archive.getRange(1, 1, archive.getLastRow(), 2).getDisplayValues();
  const caseLostAt = grid.findIndex((row) => row[1] === "ARCHIVED FROM CASE LOST");
  const unrelatedAt = grid.findIndex((row) => row[1] === "ARCHIVED FROM UNRELATED");
  const scheduledAt = grid.findIndex((row) => row[1] === "ARCHIVED FROM SCHEDULED");
  const caseLostNames = grid.slice(caseLostAt, unrelatedAt).map((row) => row[1]);
  assert.equal(caseLostNames.includes("ZZSECRETNAME ZZSECRETLAST"), true);
  const scheduledNames = grid.slice(scheduledAt, caseLostAt).map((row) => row[1]);
  assert.equal(
    scheduledNames.includes("ZZSECRETNAME ZZSECRETLAST"),
    true,
  );
  harness.assertNoPhi();
});

test("I-L unarchive restores the lane and keeps workflow completion", () => {
  harness.boot();
  harness.putLead(2, baseLead({
    lead_id: "LEAD-DONE",
    status: "Scheduled",
    workflow_complete: true,
  }));
  assert.equal(context.archiveLeadById_("LEAD-DONE").code, "ARCHIVED");
  assert.throws(
    () => context.reopenLead_(2, { note: "again" }),
    /archived/i,
  );
  assert.throws(
    () => context.recordContactAttempt_(2, {}),
    /archived/i,
  );
  assert.equal(harness.leadValue(2, "workflow_complete"), true);
  assert.equal(harness.leadValue(2, "attempt_count"), 1);

  const unarchived = context.unarchiveLeadById_("LEAD-DONE");
  assert.equal(unarchived.code, "UNARCHIVED");
  assert.equal(harness.leadValue(2, "archived"), false);
  assert.equal(harness.leadValue(2, "status"), "Scheduled");
  assert.equal(harness.leadValue(2, "workflow_complete"), true);
  assert.equal(harness.leadValue(2, "archived_from_status"), "Scheduled");
  assert.equal(
    Object.prototype.toString.call(harness.leadValue(2, "archived_at")),
    "[object Date]",
  );
  assert.equal(harness.activityTypes().includes("lead_archived"), true);
  assert.equal(harness.activityTypes().includes("lead_unarchived"), true);

  const board = context.buildPatientBoardData_();
  const scheduled = board.lanes.find((lane) => lane.status === "Scheduled");
  assert.equal(scheduled.cards.some((card) => card.leadId === "LEAD-DONE"), true);
  harness.assertNoPhi();
});

test("M-O reminder windows use 180 and 365 days", () => {
  const now = new Date("2026-10-08T12:00:00Z");
  const at = (days) => new Date(now.getTime() - days * 86400000);

  assert.equal(
    context.classifyArchivedLeadAge_(at(179), now, 180, 365),
    "normal",
  );
  assert.equal(
    context.classifyArchivedLeadAge_(at(180), now, 180, 365),
    "approaching",
  );
  assert.equal(
    context.classifyArchivedLeadAge_(at(364), now, 180, 365),
    "approaching",
  );
  assert.equal(
    context.classifyArchivedLeadAge_(at(365), now, 180, 365),
    "eligible",
  );

  const young = context.buildArchiveReminderText_({
    total: 1,
    approaching: 0,
    eligible: 0,
    coldIndexCount: 0,
  });
  const approaching = context.buildArchiveReminderText_({
    total: 1,
    approaching: 1,
    eligible: 0,
    coldIndexCount: 0,
  });
  const eligible = context.buildArchiveReminderText_({
    total: 1,
    approaching: 0,
    eligible: 1,
    coldIndexCount: 0,
  });

  assert.doesNotMatch(young, /\beligible\b/i);
  assert.doesNotMatch(young, /approaching cold storage/i);
  assert.match(approaching, /approaching cold storage/i);
  assert.doesNotMatch(approaching, /\beligible\b/i);
  assert.match(eligible, /eligible for cold storage/i);

  harness.boot();
  harness.putLead(2, baseLead({
    lead_id: "LEAD-YOUNG",
    status: "Case Lost",
    archived: true,
    archived_at: harness.daysAgo(10),
    archived_from_status: "Case Lost",
  }));
  const rendered = context.refreshPatientArchiveView_({ background: true });
  assert.doesNotMatch(rendered.reminder, /\beligible\b/i);
  context.refreshArchiveReminderScheduled();
  assert.equal(Object.keys(harness.files).filter((id) => id.startsWith("FILE-")).length, 0);
});

test("P-Q dry run and active-lead exclusion", () => {
  harness.boot();
  harness.putLead(2, baseLead({
    lead_id: "LEAD-OLD",
    status: "Scheduled",
    workflow_complete: true,
    archived: true,
    archived_at: harness.daysAgo(400),
    archived_from_status: "Scheduled",
  }));
  harness.putLead(3, baseLead({
    lead_id: "LEAD-YOUNG",
    status: "Case Lost",
    archived: true,
    archived_at: harness.daysAgo(20),
    archived_from_status: "Case Lost",
  }));
  harness.putLead(4, baseLead({
    lead_id: "LEAD-ACTIVE",
    status: "Open Lead / Follow Up",
    archived: false,
  }));

  const dry = context.offloadArchivedLeads_({
    scope: "eligible",
    dryRun: true,
  });
  assert.equal(dry.code, "DRY_RUN");
  assert.deepEqual(Array.from(dry.leadIds), ["LEAD-OLD"]);
  assert.equal(Object.keys(harness.files).some((id) => id.startsWith("FILE-")), false);
  assert.equal(harness.leadValue(2, "lead_id"), "LEAD-OLD");

  const blocked = context.offloadArchivedLeads_({
    scope: "selected",
    leadIds: ["LEAD-ACTIVE"],
  });
  assert.equal(blocked.code, "ACTIVE_LEAD_BLOCKED");
  assert.equal(harness.leadValue(4, "lead_id"), "LEAD-ACTIVE");

  const all = context.resolveColdStorageSelection_({
    scope: "all_archived",
    confirmAllArchived: true,
  });
  assert.equal(all.leadIds.includes("LEAD-ACTIVE"), false);
  assert.equal(all.leadIds.includes("LEAD-OLD"), true);
  assert.equal(all.leadIds.includes("LEAD-YOUNG"), true);
  harness.assertNoPhi();
});

test("R-V atomic offload, manifest, and archive index", () => {
  function seed() {
    harness.boot();
    harness.putLead(2, baseLead({
      lead_id: "LEAD-A",
      status: "Scheduled",
      workflow_complete: true,
      archived: true,
      archived_at: harness.daysAgo(400),
      archived_from_status: "Scheduled",
      archive_reason: "ZZSECRETREASON",
    }));
    harness.putLead(3, baseLead({
      lead_id: "LEAD-B",
      status: "Open Lead / Follow Up",
    }));
    harness.writeObject(harness.workbook.getSheetByName("ActivityLog"), 2, {
      activity_id: "ACT-1",
      lead_id: "LEAD-A",
      activity_type: "comment",
      note: "ZZSECRETMESSAGE",
    });
    harness.writeObject(harness.workbook.getSheetByName("ActivityLog"), 3, {
      activity_id: "ACT-B",
      lead_id: "LEAD-B",
      activity_type: "comment",
    });
    harness.writeObject(harness.workbook.getSheetByName("Attachments"), 2, {
      attachment_id: "ATT-1",
      lead_id: "LEAD-A",
      drive_file_id: "ATT-FILE",
      file_name: "ZZSECRETFILENAME.pdf",
    });
    harness.writeObject(harness.workbook.getSheetByName("Reactions"), 2, {
      reaction_id: "REACT-1",
      lead_id: "LEAD-A",
      activity_id: "ACT-1",
      is_active: true,
    });
    harness.writeObject(harness.workbook.getSheetByName("WebsiteIngestLedger"), 2, {
      submission_id: "SUB-1",
      lead_id: "LEAD-A",
      state: "SUCCESS",
      payload_fingerprint: "sha256:abc",
    });
  }

  seed();
  const exported = context.offloadArchivedLeads_({
    scope: "selected",
    leadIds: ["LEAD-A"],
    failPoint: "export",
  });
  assert.equal(exported.code, "EXPORT_FAILED");
  assert.equal(harness.leadValue(2, "lead_id"), "LEAD-A");
  assert.equal(harness.idsIn("ActivityLog", "activity_id").includes("ACT-1"), true);
  assert.equal(Object.keys(harness.files).some((id) => id.startsWith("FILE-")), false);

  seed();
  const verified = context.offloadArchivedLeads_({
    scope: "selected",
    leadIds: ["LEAD-A"],
    failPoint: "verify",
  });
  assert.equal(verified.code, "VERIFY_FAILED");
  assert.equal(harness.leadValue(2, "lead_id"), "LEAD-A");
  assert.equal(harness.idsIn("ArchiveIndex", "lead_id").length, 0);
  const trashed = Object.values(harness.files).find((file) => file.id.startsWith("FILE-"));
  assert.equal(trashed.trashed, true);

  seed();
  const readsBefore = harness.driveReads.length;
  const success = context.offloadArchivedLeads_({
    scope: "selected",
    leadIds: ["LEAD-A"],
  });
  assert.equal(success.code, "SUCCESS");
  assert.equal(success.version, 1);
  assert.match(success.fileName, /^PatientLeadArchive_\d{4}-\d{2}-\d{2}_[0-9a-f-]+\.zip$/i);
  assert.equal(success.fileName.includes("ZZSECRET"), false);
  assert.equal(harness.leadValue(2, "lead_id"), "");
  assert.equal(harness.leadValue(3, "lead_id"), "LEAD-B");
  assert.equal(harness.idsIn("ActivityLog", "activity_id").includes("ACT-1"), false);
  assert.equal(harness.idsIn("ActivityLog", "activity_id").includes("ACT-B"), true);
  assert.equal(harness.idsIn("Attachments", "attachment_id").includes("ATT-1"), false);
  assert.equal(harness.idsIn("Reactions", "reaction_id").includes("REACT-1"), false);
  assert.equal(harness.idsIn("WebsiteIngestLedger", "submission_id").includes("SUB-1"), false);
  assert.equal(harness.files["ATT-FILE"].trashed, false);
  assert.equal(
    harness.driveReads.slice(readsBefore).includes("ATT-FILE"),
    false,
  );

  const indexLead = harness.idsIn("ArchiveIndex", "lead_id");
  assert.deepEqual(indexLead, ["LEAD-A"]);
  const indexSheet = harness.workbook.getSheetByName("ArchiveIndex");
  const indexMap = harness.headerMap(indexSheet);
  assert.equal(
    indexSheet.getRange(2, indexMap.bundle_file_id).getValue(),
    success.fileId,
  );
  assert.equal(
    indexSheet.getRange(2, indexMap.bundle_format_version).getValue(),
    1,
  );
  assert.equal(indexSheet.isSheetHidden(), true);

  const loaded = context.loadArchiveBundleFileMapFromDrive_(success.fileId);
  const parsed = context.validateArchiveBundleFileMap_(loaded.fileMap);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.manifest.archive_format_version, 1);
  assert.equal(parsed.manifest.counts.leads, 1);
  assert.equal(parsed.manifest.counts.activity, 1);
  assert.equal(parsed.manifest.counts.attachments, 1);
  assert.equal(parsed.manifest.counts.reactions, 1);
  assert.equal(parsed.manifest.counts.website_ingest_ledger, 1);
  assert.equal(parsed.leads[0].lead_id, "LEAD-A");
  harness.assertNoPhi();

  return { success };
});

test("W-Z restore, duplicate safety, and explicit unarchive", () => {
  harness.boot();
  harness.putLead(2, baseLead({
    lead_id: "LEAD-A",
    status: "Scheduled",
    workflow_complete: true,
    archived: true,
    archived_at: harness.daysAgo(400),
    archived_from_status: "Scheduled",
  }));
  harness.writeObject(harness.workbook.getSheetByName("ActivityLog"), 2, {
    activity_id: "ACT-1",
    lead_id: "LEAD-A",
    activity_type: "comment",
    recorded_at: new Date("2024-01-01T00:00:00Z"),
  });
  harness.writeObject(harness.workbook.getSheetByName("Attachments"), 2, {
    attachment_id: "ATT-1",
    lead_id: "LEAD-A",
    drive_file_id: "ATT-FILE",
    file_name: "ZZSECRETFILENAME.pdf",
  });
  harness.writeObject(harness.workbook.getSheetByName("Reactions"), 2, {
    reaction_id: "REACT-1",
    lead_id: "LEAD-A",
    activity_id: "ACT-1",
    is_active: true,
  });
  harness.writeObject(harness.workbook.getSheetByName("WebsiteIngestLedger"), 2, {
    submission_id: "SUB-1",
    lead_id: "LEAD-A",
    state: "SUCCESS",
  });

  const offloaded = context.offloadArchivedLeads_({
    scope: "selected",
    leadIds: ["LEAD-A"],
  });
  assert.equal(offloaded.code, "SUCCESS");

  const restored = context.restoreColdStoredLead_({
    leadId: "LEAD-A",
    unarchive: false,
  });
  assert.equal(restored.code, "RESTORED");
  assert.equal(restored.unavailableAttachmentCount, 0);
  assert.equal(harness.leadValue(2, "lead_id"), "LEAD-A");
  assert.equal(harness.leadValue(2, "archived"), true);
  assert.equal(harness.leadValue(2, "status"), "Scheduled");
  assert.equal(harness.leadValue(2, "workflow_complete"), true);
  assert.equal(harness.idsIn("ActivityLog", "activity_id").includes("ACT-1"), true);
  assert.equal(harness.idsIn("Attachments", "attachment_id").includes("ATT-1"), true);
  assert.equal(harness.idsIn("Reactions", "reaction_id").includes("REACT-1"), true);
  assert.equal(harness.idsIn("WebsiteIngestLedger", "submission_id").includes("SUB-1"), true);
  assert.equal(harness.activityTypes().includes("lead_restored"), true);

  const board = context.buildPatientBoardData_();
  assert.equal(
    board.lanes.some((lane) => lane.cards.some((card) => card.leadId === "LEAD-A")),
    false,
  );

  const duplicate = context.restoreColdStoredLead_({ leadId: "LEAD-A" });
  assert.equal(duplicate.code, "ALREADY_PRESENT");
  assert.equal(harness.idsIn("Leads", "lead_id").filter((id) => id === "LEAD-A").length, 1);

  harness.boot();
  harness.putLead(2, baseLead({
    lead_id: "LEAD-C",
    status: "Case Lost",
    workflow_complete: false,
    archived: true,
    archived_at: harness.daysAgo(20),
    archived_from_status: "Case Lost",
  }));
  assert.equal(
    context.offloadArchivedLeads_({
      scope: "selected",
      leadIds: ["LEAD-C"],
    }).code,
    "SUCCESS",
  );
  const returned = context.restoreColdStoredLead_({
    leadId: "LEAD-C",
    unarchive: true,
  });
  assert.equal(returned.code, "RESTORED_UNARCHIVED");
  assert.equal(harness.leadValue(2, "archived"), false);
  assert.equal(harness.leadValue(2, "status"), "Case Lost");
  assert.equal(harness.leadValue(2, "workflow_complete"), false);
  const after = context.buildPatientBoardData_();
  const lost = after.lanes.find((lane) => lane.status === "Case Lost");
  assert.equal(lost.cards.some((card) => card.leadId === "LEAD-C"), true);
  harness.assertNoPhi();
});

test("AA all-archived scope requires explicit confirmation", () => {
  harness.boot();
  harness.putLead(2, baseLead({
    lead_id: "LEAD-OLD",
    status: "Unrelated",
    archived: true,
    archived_at: harness.daysAgo(400),
    archived_from_status: "Unrelated",
  }));
  harness.putLead(3, baseLead({
    lead_id: "LEAD-YOUNG",
    status: "Case Lost",
    archived: true,
    archived_at: harness.daysAgo(15),
    archived_from_status: "Case Lost",
  }));

  const denied = context.offloadArchivedLeads_({
    scope: "all_archived",
  });
  assert.equal(denied.code, "CONFIRMATION_REQUIRED");
  assert.equal(harness.leadValue(2, "lead_id"), "LEAD-OLD");
  assert.equal(Object.keys(harness.files).some((id) => id.startsWith("FILE-")), false);

  const preview = context.offloadArchivedLeads_({
    scope: "all_archived",
    confirmAllArchived: true,
    dryRun: true,
  });
  assert.equal(preview.code, "DRY_RUN");
  assert.equal(preview.leadIds.includes("LEAD-OLD"), true);
  assert.equal(preview.leadIds.includes("LEAD-YOUNG"), true);
  assert.equal(Object.keys(harness.files).some((id) => id.startsWith("FILE-")), false);
});

test("partial cleanup resumes without a second export", () => {
  harness.boot();
  harness.putLead(2, baseLead({
    lead_id: "LEAD-1",
    status: "Case Lost",
    archived: true,
    archived_at: harness.daysAgo(400),
    archived_from_status: "Case Lost",
  }));
  harness.putLead(3, baseLead({
    lead_id: "LEAD-2",
    status: "Unrelated",
    archived: true,
    archived_at: harness.daysAgo(400),
    archived_from_status: "Unrelated",
  }));
  const partial = context.offloadArchivedLeads_({
    scope: "eligible",
    failPoint: "clear-after-first",
  });
  assert.equal(partial.code, "PARTIAL");
  assert.match(partial.instructions, /Do not start another export/);
  assert.match(partial.instructions, new RegExp(partial.fileId));
  assert.equal(partial.instructions.includes("ZZSECRET"), false);
  const remainingBefore = [
    harness.leadValue(2, "lead_id"),
    harness.leadValue(3, "lead_id"),
  ].filter(Boolean);
  assert.equal(remainingBefore.length, 1);
  const fileCount = Object.keys(harness.files).filter((id) => id.startsWith("FILE-")).length;

  const resumed = context.resumeColdStorageCleanup_({
    fileId: partial.fileId,
  });
  assert.equal(resumed.ok, true);
  assert.equal(harness.leadValue(2, "lead_id"), "");
  assert.equal(harness.leadValue(3, "lead_id"), "");
  assert.equal(
    Object.keys(harness.files).filter((id) => id.startsWith("FILE-")).length,
    fileCount,
  );
  harness.assertNoPhi();
});

test("import validates before writing and duplicate restore ids stop early", () => {
  harness.boot();
  harness.putLead(2, baseLead({
    lead_id: "LEAD-A",
    status: "Scheduled",
    workflow_complete: true,
    archived: true,
    archived_at: harness.daysAgo(400),
    archived_from_status: "Scheduled",
  }));
  harness.writeObject(harness.workbook.getSheetByName("ActivityLog"), 2, {
    activity_id: "ACT-1",
    lead_id: "LEAD-A",
    activity_type: "comment",
  });
  const offloaded = context.offloadArchivedLeads_({
    scope: "selected",
    leadIds: ["LEAD-A"],
  });
  const index = harness.workbook.getSheetByName("ArchiveIndex");
  const map = harness.headerMap(index);
  index.getRange(2, 1, 1, index.getLastColumn()).clearContent();
  assert.equal(harness.idsIn("ArchiveIndex", "lead_id").length, 0);

  const malformed = context.buildArchiveBundleFileMap_({
    manifest: {
      archive_format_version: 2,
      bundle_id: "BUNDLE-nope",
      lead_ids: [],
      counts: {},
    },
    leads: [],
    activity: [],
    attachments: [],
    reactions: [],
    ledger: [],
  });
  const badBlob = context.zipArchiveFileMap_(malformed, "bad.zip");
  harness.files["BAD-FILE"] = {
    id: "BAD-FILE",
    name: "bad.zip",
    blob: badBlob,
    trashed: false,
  };
  assert.equal(
    context.importArchiveBundle_({ fileId: "BAD-FILE" }).code,
    "UNSUPPORTED_VERSION",
  );
  assert.equal(harness.idsIn("ArchiveIndex", "lead_id").length, 0);

  const imported = context.importArchiveBundle_({ fileId: offloaded.fileId });
  assert.equal(imported.ok, true);
  assert.deepEqual(harness.idsIn("ArchiveIndex", "lead_id"), ["LEAD-A"]);
  assert.equal(harness.idsIn("Leads", "lead_id").includes("LEAD-A"), false);
  assert.equal(
    context.importArchiveBundle_({ fileId: offloaded.fileId }).code,
    "ALREADY_IMPORTED",
  );

  index.getRange(2, map.lead_id).setValue("");
  harness.workbook.getSheetByName("ActivityLog").getRange(2, 1).setValue("ACT-1");
  const activityMap = harness.headerMap(harness.workbook.getSheetByName("ActivityLog"));
  harness.workbook.getSheetByName("ActivityLog").getRange(2, activityMap.activity_id).setValue("ACT-1");
  harness.workbook.getSheetByName("ActivityLog").getRange(2, activityMap.lead_id).setValue("LEAD-A");
  context.__exports.EXECUTION_CACHE_.canonicalTables = {};
  context.__exports.EXECUTION_CACHE_.leadRowsById = {};
  const conflict = context.restoreColdStoredLead_({
    leadId: "LEAD-A",
    fileId: offloaded.fileId,
  });
  assert.equal(conflict.code, "ALREADY_PRESENT");
  assert.equal(conflict.conflict, "activity_id");
  assert.equal(harness.idsIn("Leads", "lead_id").includes("LEAD-A"), false);
  harness.assertNoPhi();
});

test("missing attachment files stay in metadata and blank archive means false", () => {
  harness.boot({ setup: false, archiveHeaders: false });
  harness.putLead(2, {
    lead_id: "LEAD-OLDROW",
    status: "Scheduled",
    workflow_complete: true,
    first_name: "ZZSECRETNAME",
    last_name: "ZZSECRETLAST",
  });
  const before = harness.leadValue(2, "status");
  const setup = context.setupLeadArchiveSchema_();
  assert.equal(setup.ok, true);
  assert.equal(harness.leadValue(2, "status"), before);
  assert.equal(harness.leadValue(2, "archived"), "");
  const board = context.buildPatientBoardData_();
  assert.equal(
    board.lanes.some((lane) => lane.cards.some((card) => card.leadId === "LEAD-OLDROW")),
    true,
  );

  const leads = harness.workbook.getSheetByName("Leads");
  const core = context.partitionLeadHeadersForFoundation_(
    context.__exports.PATIENT_LEADS_SYSTEM.headers.Leads,
  );
  assert.deepEqual(Array.from(core.optional), [
    "archived",
    "archived_at",
    "archived_by",
    "archived_from_status",
    "archive_reason",
    "next_follow_up_window_start",
    "next_follow_up_window_end",
  ]);
  const bare = harness.workbook.insertSheet("BareLeads");
  core.required.forEach((header, index) => {
    bare.getRange(1, index + 1).setValue(header);
  });
  assert.equal(
    context.collectFoundationHeaderErrors_("Leads", context.__exports.PATIENT_LEADS_SYSTEM.headers.Leads, bare).length,
    0,
  );

  harness.boot();
  delete harness.files["ATT-FILE"];
  harness.putLead(2, baseLead({
    lead_id: "LEAD-FILE",
    status: "Unrelated",
    archived: true,
    archived_at: harness.daysAgo(400),
    archived_from_status: "Unrelated",
  }));
  harness.writeObject(harness.workbook.getSheetByName("Attachments"), 2, {
    attachment_id: "ATT-MISSING",
    lead_id: "LEAD-FILE",
    drive_file_id: "ATT-FILE",
    file_name: "ZZSECRETFILENAME.pdf",
  });
  assert.equal(
    context.offloadArchivedLeads_({
      scope: "selected",
      leadIds: ["LEAD-FILE"],
    }).code,
    "SUCCESS",
  );
  const restored = context.restoreColdStoredLead_({ leadId: "LEAD-FILE" });
  assert.equal(restored.code, "RESTORED");
  assert.equal(restored.unavailableAttachmentCount, 1);
  assert.equal(harness.idsIn("Attachments", "attachment_id").includes("ATT-MISSING"), true);
  assert.equal(harness.leadValue(2, "archived"), true);

  harness.putLead(4, {
    first_name: "New",
    last_name: "Lead",
  });
  const created = context.initializeLeadRow_(4, { source: "Employee" });
  assert.match(created, /^LEAD-/);
  assert.equal(harness.leadValue(4, "archived"), false);
  harness.assertNoPhi();
});

test("folder failure and lock overlap delete nothing", () => {
  harness.boot();
  context.setConfigValue_("archive_storage_folder_id", "");
  context.__exports.EXECUTION_CACHE_.configRows = null;
  harness.putLead(2, baseLead({
    lead_id: "LEAD-A",
    status: "Case Lost",
    archived: true,
    archived_at: harness.daysAgo(400),
    archived_from_status: "Case Lost",
  }));
  assert.equal(
    context.offloadArchivedLeads_({
      scope: "eligible",
    }).code,
    "FOLDER_MISSING",
  );
  assert.equal(harness.leadValue(2, "lead_id"), "LEAD-A");

  context.setConfigValue_("archive_storage_folder_id", "DEV-FOLDER");
  context.__exports.EXECUTION_CACHE_.configRows = null;
  harness.lockState.held = true;
  assert.equal(
    context.offloadArchivedLeads_({
      scope: "eligible",
    }).code,
    "LOCK_TIMEOUT",
  );
  assert.equal(harness.leadValue(2, "lead_id"), "LEAD-A");
  harness.lockState.held = false;
  harness.assertNoPhi();
});

test("trailing offloaded rows are blank and leave getLastRow", () => {
  harness.boot();
  const leads = harness.workbook.getSheetByName("Leads");
  const activity = harness.workbook.getSheetByName("ActivityLog");
  const leadMap = harness.headerMap(leads);
  const activityMap = harness.headerMap(activity);
  const checkbox = context.SpreadsheetApp
    .newDataValidation()
    .requireCheckbox()
    .build();

  harness.putLead(2, baseLead({
    lead_id: "LEAD-KEEP",
    status: "Open Lead / Follow Up",
  }));
  harness.putLead(3, baseLead({
    lead_id: "LEAD-TRAIL",
    status: "Case Lost",
    archived: true,
    archived_at: harness.daysAgo(400),
    archived_from_status: "Case Lost",
    workflow_complete: true,
    sms_consent: true,
  }));
  leads.getRange(3, leadMap.workflow_complete).setDataValidation(checkbox);
  harness.writeObject(activity, 2, {
    activity_id: "ACT-TRAIL",
    lead_id: "LEAD-TRAIL",
    activity_type: "comment",
    reached_patient: false,
    system_generated: false,
  });
  activity.getRange(2, activityMap.reached_patient).setDataValidation(checkbox);

  assert.equal(leads.getLastRow(), 3);
  assert.equal(activity.getLastRow(), 2);
  assert.equal(
    leads.getRange(3, leadMap.archived).getDataValidations()[0][0].checkbox,
    true,
  );

  const archive = harness.workbook.getSheetByName("Archive");
  const protection = archive.getProtections()[0];
  assert.equal(protection.isWarningOnly(), true);
  assert.equal(
    protection.getDescription().indexOf("PATIENT_CRM_GENERATED_VIEW_GUARD:"),
    0,
  );
  const selectable = protection.getUnprotectedRanges();
  assert.equal(selectable.length, 1);
  assert.equal(selectable[0].getColumn(), 1);
  assert.equal(selectable[0].getNumColumns(), 1);
  assert.ok(selectable[0].getNumRows() > 1);

  assert.equal(
    context.offloadArchivedLeads_({
      scope: "selected",
      leadIds: ["LEAD-TRAIL"],
    }).code,
    "SUCCESS",
  );

  assert.equal(leads.getLastRow(), 2);
  assert.equal(activity.getLastRow(), 1);
  const clearedLead = leads
    .getRange(3, 1, 1, leads.getLastColumn())
    .getValues()[0];
  const clearedActivity = activity
    .getRange(2, 1, 1, activity.getLastColumn())
    .getValues()[0];
  assert.equal(clearedLead.every((value) => value === ""), true);
  assert.equal(clearedActivity.every((value) => value === ""), true);
  assert.equal(
    leads.getRange(3, leadMap.archived).getDataValidations()[0][0].checkbox,
    true,
  );
  assert.equal(
    leads.getRange(3, leadMap.workflow_complete).getDataValidations()[0][0].checkbox,
    true,
  );
  assert.equal(
    activity.getRange(2, activityMap.reached_patient).getDataValidations()[0][0].checkbox,
    true,
  );
  assert.equal(harness.leadValue(2, "lead_id"), "LEAD-KEEP");

  leads.getRange(4, leadMap.archived).setValue(false);
  assert.equal(leads.getLastRow(), 4);
  leads.getRange(4, leadMap.archived).setValue("");
  assert.equal(leads.getLastRow(), 2);

  assert.equal(
    context.findFirstEmptyDataRow_(leads, leadMap.lead_id),
    3,
  );
  harness.putLead(3, {
    first_name: "Reuse",
    last_name: "Row",
  });
  const reused = context.initializeLeadRow_(3, { source: "Employee" });
  assert.match(reused, /^LEAD-/);
  assert.equal(harness.leadValue(3, "archived"), false);
  assert.equal(harness.leadValue(3, "workflow_complete"), false);
  assert.equal(typeof harness.leadValue(3, "workflow_complete"), "boolean");
  assert.equal(
    context.isSheetBooleanTrue_(harness.leadValue(3, "archived")),
    false,
  );
  leads.getRange(3, leadMap.reached_patient).setValue(true);
  assert.equal(
    context.isSheetBooleanTrue_(harness.leadValue(3, "reached_patient")),
    true,
  );
  assert.equal(
    context.isSheetBooleanTrue_(""),
    false,
  );
  harness.assertNoPhi();
});

test("dashboard operational population excludes archived leads", () => {
  harness.boot();

  function dashboardIds() {
    return Array.from(
      context.buildDashboardLeadSnapshot_(),
      (row) => row[0],
    );
  }

  function liveSnapshot() {
    const row = context.buildDashboardLeadSnapshot_()
      .find((item) => item[0] === "LEAD-LIVE");
    return JSON.stringify(Array.from(row));
  }

  function reasons() {
    return Array.from(
      context.buildDashboardFilterOptionsFromLeadsTable_(
        context.getCanonicalSheetTable_("Leads"),
      ).reasons,
    );
  }

  harness.putLead(2, baseLead({
    lead_id: "LEAD-LIVE",
    status: "Open Lead / Follow Up",
    appointment_reason: "ZZ-LIVE-REASON",
    workflow_complete: false,
  }));
  harness.putLead(3, baseLead({
    lead_id: "LEAD-MOVE",
    status: "Scheduled",
    appointment_reason: "ZZ-MOVE-REASON",
    workflow_complete: true,
  }));

  assert.deepEqual(dashboardIds().sort(), ["LEAD-LIVE", "LEAD-MOVE"]);
  assert.deepEqual(reasons().sort(), ["ZZ-LIVE-REASON", "ZZ-MOVE-REASON"]);

  assert.equal(context.archiveLeadById_("LEAD-MOVE").code, "ARCHIVED");
  assert.equal(
    harness.activityTypes().includes("lead_archived"),
    true,
  );

  const board = context.buildPatientBoardData_();
  const boardIds = board.lanes.flatMap((lane) =>
    lane.cards.map((card) => card.leadId)
  );
  assert.equal(boardIds.includes("LEAD-MOVE"), false);
  assert.equal(boardIds.includes("LEAD-LIVE"), true);
  assert.deepEqual(dashboardIds().sort(), ["LEAD-LIVE", "LEAD-MOVE"]);
  assert.deepEqual(reasons().sort(), ["ZZ-LIVE-REASON", "ZZ-MOVE-REASON"]);
  const archivedSnapshot = context.buildDashboardLeadSnapshot_()
    .find((row) => row[0] === "LEAD-MOVE");
  assert.equal(archivedSnapshot[archivedSnapshot.length - 1], true);
  assert.equal(archivedSnapshot[4], "Scheduled");
  assert.equal(archivedSnapshot[15], true);

  context.renderPatientArchive();
  const archive = harness.workbook.getSheetByName("Archive");
  const grid = archive.getRange(1, 1, archive.getLastRow(), 2).getDisplayValues();
  const scheduledAt = grid.findIndex((row) => row[1] === "ARCHIVED FROM SCHEDULED");
  assert.equal(
    grid.slice(scheduledAt).some((row) => row[1] === "ZZSECRETNAME ZZSECRETLAST"),
    true,
  );

  const beforeColdStorage = liveSnapshot();
  assert.equal(
    context.offloadArchivedLeads_({
      scope: "selected",
      leadIds: ["LEAD-MOVE"],
    }).code,
    "SUCCESS",
  );
  assert.equal(liveSnapshot(), beforeColdStorage);
  assert.deepEqual(dashboardIds(), ["LEAD-LIVE"]);
  assert.deepEqual(reasons(), ["ZZ-LIVE-REASON"]);
  assert.equal(
    harness.idsIn("ActivityLog", "activity_id").includes("ACT-1")
      || harness.activityTypes().includes("lead_archived"),
    false,
  );

  assert.equal(
    context.restoreColdStoredLead_({
      leadId: "LEAD-MOVE",
      unarchive: false,
    }).code,
    "RESTORED",
  );
  assert.equal(liveSnapshot(), beforeColdStorage);
  assert.deepEqual(dashboardIds().sort(), ["LEAD-LIVE", "LEAD-MOVE"]);
  assert.equal(harness.leadValue(3, "archived"), true);
  const restoredSnapshot = context.buildDashboardLeadSnapshot_()
    .find((row) => row[0] === "LEAD-MOVE");
  assert.equal(restoredSnapshot[restoredSnapshot.length - 1], true);

  assert.equal(context.unarchiveLeadById_("LEAD-MOVE").code, "UNARCHIVED");
  const returned = context.buildDashboardLeadSnapshot_()
    .find((row) => row[0] === "LEAD-MOVE");
  assert.ok(returned);
  assert.equal(returned[4], "Scheduled");
  assert.equal(returned[15], true);
  assert.equal(returned[returned.length - 1], false);
  assert.equal(harness.leadValue(3, "workflow_complete"), true);
  assert.deepEqual(reasons().sort(), ["ZZ-LIVE-REASON", "ZZ-MOVE-REASON"]);
  const after = context.buildPatientBoardData_();
  const scheduled = after.lanes.find((lane) => lane.status === "Scheduled");
  assert.equal(
    scheduled.cards.some((card) => card.leadId === "LEAD-MOVE"),
    true,
  );
  harness.assertNoPhi();
});

test("unused template FALSE rows normalize once and fail closed", () => {
  harness.boot();
  const leads = harness.workbook.getSheetByName("Leads");
  const activity = harness.workbook.getSheetByName("ActivityLog");
  const leadMap = harness.headerMap(leads);
  const activityMap = harness.headerMap(activity);
  const checkbox = context.SpreadsheetApp
    .newDataValidation()
    .requireCheckbox()
    .build();
  const keptDate = new Date("2020-01-01T00:00:00Z");

  function snapshot(sheet) {
    const lastRow = Math.max(sheet.getLastRow(), 1);
    const lastColumn = Math.max(sheet.getLastColumn(), 1);
    return JSON.stringify(
      sheet.getRange(1, 1, lastRow, lastColumn).getValues()
    );
  }

  harness.putLead(2, baseLead({
    lead_id: "LEAD-KEEP",
    status: "Open Lead / Follow Up",
    workflow_complete: false,
  }));
  leads.getRange(3, leadMap.sms_consent).setValue(false);
  leads.getRange(3, leadMap.workflow_complete).setValue(false);
  leads.getRange(3, leadMap.archived).setValue(false);
  leads.getRange(3, leadMap.sms_consent).setBackground("#fff2cc");
  leads.getRange(3, leadMap.workflow_complete).setDataValidation(checkbox);
  leads.setRowHeight(3, 36);
  leads.getRange(4, leadMap.first_name).setValue("ZZSECRETNAME");
  leads.getRange(5, leadMap.lead_id).setValue("LEAD-REAL");
  leads.getRange(5, leadMap.workflow_complete).setValue(false);
  leads.getRange(6, leadMap.phone).setFormula("=1+1");
  leads.getRange(7, leadMap.attempt_count).setValue(0);
  leads.getRange(8, leadMap.created_at).setValue(keptDate);
  leads.getRange(9, leadMap.archived).setValue(false);

  activity.getRange(2, activityMap.lead_id).setValue("LEAD-KEEP");
  activity.getRange(2, activityMap.note).setValue("not a template");
  activity.getRange(3, activityMap.system_generated).setValue(false);
  activity.getRange(4, activityMap.reached_patient).setValue(false);
  activity.getRange(4, activityMap.reached_patient).setDataValidation(checkbox);

  assert.equal(leads.getLastRow(), 9);
  assert.equal(activity.getLastRow(), 4);

  const first = context.normalizeUnusedTemplateRows_();
  assert.equal(first.normalized_rows, 4);
  assert.equal(first.skipped_rows, 5);
  assert.deepEqual(Array.from(first.sheets_checked), [
    "Leads",
    "ActivityLog",
    "Attachments",
    "Reactions",
    "WebsiteIngestLedger",
    "ArchiveIndex",
  ]);
  assert.equal(first.sheets_checked.includes("Config"), false);
  assert.equal(first.sheets_checked.includes("Board"), false);
  assert.equal(first.sheets_checked.includes("Archive"), false);

  assert.equal(leads.getLastRow(), 8);
  assert.equal(activity.getLastRow(), 2);
  assert.equal(
    leads.getRange(3, 1, 1, leads.getLastColumn()).getValues()[0]
      .every((value) => value === ""),
    true,
  );
  assert.equal(
    leads.getRange(9, 1, 1, leads.getLastColumn()).getValues()[0]
      .every((value) => value === ""),
    true,
  );
  assert.equal(
    activity.getRange(3, 1, 1, activity.getLastColumn()).getValues()[0]
      .every((value) => value === ""),
    true,
  );
  assert.equal(
    activity.getRange(4, 1, 1, activity.getLastColumn()).getValues()[0]
      .every((value) => value === ""),
    true,
  );
  assert.equal(
    leads.getRange(3, leadMap.workflow_complete).getDataValidations()[0][0].checkbox,
    true,
  );
  assert.equal(
    leads.getRange(3, leadMap.archived).getDataValidations()[0][0].checkbox,
    true,
  );
  assert.equal(
    activity.getRange(4, activityMap.reached_patient).getDataValidations()[0][0].checkbox,
    true,
  );
  assert.equal(leads.getRange(3, leadMap.sms_consent).getBackground(), "#fff2cc");
  assert.equal(leads.getRowHeight(3), 36);
  assert.equal(leads.getRange(4, leadMap.first_name).getValue(), "ZZSECRETNAME");
  assert.equal(leads.getRange(5, leadMap.lead_id).getValue(), "LEAD-REAL");
  assert.equal(leads.getRange(5, leadMap.workflow_complete).getValue(), false);
  assert.equal(leads.getRange(6, leadMap.phone).getFormula(), "=1+1");
  assert.equal(leads.getRange(7, leadMap.attempt_count).getValue(), 0);
  assert.equal(
    leads.getRange(8, leadMap.created_at).getValue().getTime(),
    keptDate.getTime(),
  );
  assert.equal(harness.leadValue(2, "lead_id"), "LEAD-KEEP");
  assert.equal(harness.leadValue(2, "workflow_complete"), false);
  assert.equal(activity.getRange(2, activityMap.lead_id).getValue(), "LEAD-KEEP");
  assert.equal(activity.getRange(2, activityMap.note).getValue(), "not a template");

  assert.equal(
    context.findFirstEmptyDataRow_(leads, leadMap.lead_id),
    3,
  );
  harness.putLead(3, {
    first_name: "Reuse",
    last_name: "Row",
  });
  const reused = context.initializeLeadRow_(3, { source: "Employee" });
  assert.match(reused, /^LEAD-/);
  assert.equal(harness.leadValue(3, "workflow_complete"), false);
  assert.equal(typeof harness.leadValue(3, "workflow_complete"), "boolean");
  assert.equal(harness.leadValue(3, "archived"), false);
  leads.getRange(3, leadMap.reached_patient).setValue(true);
  assert.equal(
    context.isSheetBooleanTrue_(harness.leadValue(3, "reached_patient")),
    true,
  );

  const beforeSecond = snapshot(leads);
  const second = context.normalizeUnusedTemplateRows_();
  assert.equal(second.normalized_rows, 0);
  assert.equal(snapshot(leads), beforeSecond);
  assert.equal(leads.getRange(6, leadMap.phone).getFormula(), "=1+1");
  assert.equal(leads.getLastRow(), 8);

  const beforeSetup = snapshot(leads);
  const again = context.setupLeadArchiveSchema_();
  assert.equal(again.ok, true);
  assert.equal(again.normalization.normalized_rows, 0);
  assert.equal(snapshot(leads), beforeSetup);
  assert.equal(harness.leadValue(2, "lead_id"), "LEAD-KEEP");
  assert.equal(harness.leadValue(5, "lead_id"), "LEAD-REAL");
  harness.assertNoPhi();
});

function chicagoDate(dateKey, timeText) {
  const parts = String(dateKey).split("-");
  const parsed = context.Utilities.parseDate(
    `${parts[1]}/${parts[2]}/${parts[0]} ${timeText || "12:00"}:00`,
    "America/Chicago",
    "MM/dd/yyyy HH:mm:ss",
  );
  return new context.__exports.Date(parsed.getTime());
}

function installWorkflowLists() {
  const lists = harness.workbook.insertSheet("Lists");
  lists.getRange("L2").setValue("Phone");
  lists.getRange("L3").setValue("Email");
  lists.getRange("L4").setValue("Text");
  lists.getRange("G2").setValue("Insurance / Cost");
  lists.getRange("G3").setValue("Unable to Reach");
  lists.getRange("G4").setValue("No Longer Interested");
  lists.getRange("G5").setValue("  Insurance/Cost ");
  lists.getRange("G6").setValue("Cost / Insurance");
  lists.getRange("G7").setValue("Insurance");
  lists.getRange("G8").setValue("cost");
  lists.getRange("H2").setValue("Vendor");
  return lists;
}

function activityRows() {
  const sheet = harness.workbook.getSheetByName("ActivityLog");
  const map = harness.headerMap(sheet);
  const rows = [];
  for (let row = 2; row <= sheet.getLastRow(); row += 1) {
    if (!sheet.getRange(row, map.activity_id).getValue()) continue;
    rows.push({
      type: sheet.getRange(row, map.activity_type).getValue(),
      method: sheet.getRange(row, map.contact_method).getValue(),
      outcome: sheet.getRange(row, map.contact_outcome).getValue(),
      occurred: sheet.getRange(row, map.occurred_at).getValue(),
      attempt: sheet.getRange(row, map.attempt_number).getValue(),
      note: sheet.getRange(row, map.note).getValue(),
      leadId: sheet.getRange(row, map.lead_id).getValue(),
      source: sheet.getRange(row, map.activity_source).getValue(),
      generated: sheet.getRange(row, map.system_generated).getValue(),
    });
  }
  return rows;
}

test("contact attempts, case-lost reasons, and callback windows", () => {
  harness.boot();
  installWorkflowLists();
  const reasonOptions = context.getCaseLostReasonOptions_(
    harness.workbook.getSheetByName("Lists"),
  );
  assert.equal(JSON.stringify(reasonOptions), JSON.stringify([
    "Insurance",
    "Cost",
    "Unable to Reach",
    "No Longer Interested",
  ]));
  assert.equal(
    JSON.stringify(context.normalizeCaseLostReasonOptions_([
      "  Insurance/Cost ",
      "insurance",
      "COST",
      "Cost / Insurance",
      "Unable to Reach",
    ])),
    JSON.stringify(["Insurance", "Cost", "Unable to Reach"]),
  );
  assert.equal(
    JSON.stringify(context.normalizeCaseLostReasonOptions_([
      "insurance",
      "Cost",
      "Insurance / Cost",
    ])),
    JSON.stringify(["insurance", "Cost"]),
  );
  assert.equal(
    context.formatLostReasonsForDisplay_("Insurance / Cost"),
    "Insurance / Cost",
  );
  assert.equal(
    context.formatLostReasonsForDisplay_("Insurance/Cost"),
    "Insurance/Cost",
  );
  assert.equal(JSON.stringify(context.parseLostReasons_("Cost")), JSON.stringify(["Cost"]));
  assert.equal(
    JSON.stringify(context.parseLostReasons_("Insurance / Cost")),
    JSON.stringify(["Insurance / Cost"]),
  );
  assert.equal(
    JSON.stringify(context.parseLostReasons_("Insurance | Cost")),
    JSON.stringify(["Insurance", "Cost"]),
  );

  harness.putLead(2, baseLead({
    lead_id: "LEAD-CONTACT",
    status: "Open Lead / Follow Up",
    assigned_to: "Historical Staff",
    reached_patient: true,
    last_contact_outcome: "Left voicemail",
    workflow_complete: true,
    completed_at: chicagoDate("2026-01-02"),
    completed_by: "Historical Staff",
    attempt_count: 4,
  }));

  assert.throws(
    () => context.patientDetailRecordContactAttempt("LEAD-CONTACT", {
      contactMethods: [],
    }),
    /at least one contact method/i,
  );
  assert.equal(harness.leadValue(2, "attempt_count"), 4);

  const one = context.patientDetailRecordContactAttempt("LEAD-CONTACT", {
    contactMethods: ["Email"],
    note: "emailed only",
  });
  assert.equal(one.changed, true);
  assert.equal(harness.leadValue(2, "attempt_count"), 5);

  const both = context.patientDetailRecordContactAttempt("LEAD-CONTACT", {
    contactMethods: ["Email", "Phone"],
    note: "called and emailed",
  });
  assert.equal(both.changed, true);
  assert.equal(harness.leadValue(2, "attempt_count"), 6);
  assert.equal(harness.leadValue(2, "status"), "Open Lead / Follow Up");
  assert.equal(harness.leadValue(2, "assigned_to"), "Historical Staff");
  assert.equal(harness.leadValue(2, "reached_patient"), true);
  assert.equal(harness.leadValue(2, "last_contact_outcome"), "Left voicemail");
  assert.equal(harness.leadValue(2, "workflow_complete"), true);
  assert.equal(harness.leadValue(2, "completed_by"), "Historical Staff");

  const contacts = activityRows().filter((row) => row.type === "contact_attempt");
  const paired = contacts.filter((row) => row.attempt === 6);
  assert.equal(paired.length, 2);
  assert.deepEqual(paired.map((row) => row.method), ["Phone", "Email"]);
  assert.equal(paired[0].occurred.getTime(), paired[1].occurred.getTime());
  assert.equal(paired[0].note, "called and emailed");
  assert.equal(paired[1].note, "called and emailed");
  assert.equal(paired.every((row) => row.outcome === ""), true);

  const followUp = context.patientDetailSetFollowUpDate("LEAD-CONTACT", {
    followUpDateText: "2026-10-22",
    windowStartText: "10:00",
    windowEndText: "11:00",
    note: "callback window",
  });
  assert.equal(followUp.changed, true);
  assert.equal(harness.leadValue(2, "workflow_complete"), true);
  assert.equal(
    context.formatHtmlTimeFromValue_(
      harness.leadValue(2, "next_follow_up_window_start"),
      "America/Chicago",
    ),
    "10:00",
  );
  assert.equal(
    context.formatHtmlTimeFromValue_(
      harness.leadValue(2, "next_follow_up_window_end"),
      "America/Chicago",
    ),
    "11:00",
  );
  const followUpAudit = activityRows().find((row) => row.type === "follow_up_date_set");
  assert.match(followUpAudit.note, /callback window/);

  context.patientDetailClearFollowUpDate("LEAD-CONTACT", {});
  assert.equal(harness.leadValue(2, "next_follow_up_on"), "");
  assert.equal(harness.leadValue(2, "next_follow_up_window_start"), "");
  assert.equal(harness.leadValue(2, "next_follow_up_window_end"), "");
  assert.equal(harness.leadValue(2, "workflow_complete"), true);
  assert.equal(
    activityRows().some((row) => row.type === "follow_up_date_cleared"),
    true,
  );

  const moved = context.patientDetailMoveWorkflow("LEAD-CONTACT", {
    targetStatus: "Case Lost",
    reasons: ["Cost", "Insurance"],
    note: "Aetna not accepted",
  });
  assert.equal(moved.changed, true);
  assert.equal(harness.leadValue(2, "lost_reason"), "Insurance | Cost");
  assert.equal(harness.leadValue(2, "workflow_complete"), true);
  assert.equal(
    JSON.stringify(context.parseLostReasons_(harness.leadValue(2, "lost_reason"))),
    JSON.stringify(["Insurance", "Cost"]),
  );
  harness.assertNoPhi();
});

test("open-lane callback priority leaves the other lanes unchanged", () => {
  const classify = (spec) => context.classifyOpenCallback_(spec).key;
  assert.equal(classify({
    dateKey: "2026-10-19",
    todayKey: "2026-10-20",
    nowMinutes: 600,
  }), "overdue");
  assert.equal(classify({
    dateKey: "2026-10-20",
    todayKey: "2026-10-20",
    nowMinutes: 600,
  }), "due_today");
  assert.equal(classify({
    dateKey: "2026-10-22",
    todayKey: "2026-10-20",
    nowMinutes: 600,
  }), "upcoming");
  assert.equal(classify({
    dateKey: "2026-10-20",
    todayKey: "2026-10-20",
    nowMinutes: 9 * 60,
    startMinutes: 10 * 60,
  }), "upcoming");
  assert.equal(classify({
    dateKey: "2026-10-20",
    todayKey: "2026-10-20",
    nowMinutes: 10 * 60,
    startMinutes: 10 * 60,
  }), "due_today");
  assert.equal(classify({
    dateKey: "2026-10-19",
    todayKey: "2026-10-20",
    nowMinutes: 15 * 60,
    startMinutes: 10 * 60,
  }), "overdue");
  assert.equal(classify({
    dateKey: "2026-10-20",
    todayKey: "2026-10-20",
    nowMinutes: 10 * 60 + 30,
    startMinutes: 10 * 60,
    endMinutes: 11 * 60,
  }), "due_today");
  assert.equal(classify({
    dateKey: "2026-10-20",
    todayKey: "2026-10-20",
    nowMinutes: 11 * 60 + 1,
    startMinutes: 10 * 60,
    endMinutes: 11 * 60,
  }), "overdue");

  const early = context.classifyOpenCallback_({
    dateKey: "2026-10-22",
    todayKey: "2026-10-20",
    nowMinutes: 600,
    startMinutes: 14 * 60 + 30,
  });
  const later = context.classifyOpenCallback_({
    dateKey: "2026-10-23",
    todayKey: "2026-10-20",
    nowMinutes: 600,
    startMinutes: 9 * 60,
  });
  assert.equal(early.key, "upcoming");
  assert.equal(later.key, "upcoming");
  assert.ok(early.sortAt < later.sortAt);

  function openCard(id, key, sortAt, attempts, created, name) {
    return {
      leadId: id,
      patient: { fullName: name },
      workflow: {
        followUpState: { key },
        attemptCount: attempts,
      },
      sort: { followUpOn: sortAt, createdAt: created },
    };
  }
  const openCards = [
    openCard("normal-new", "", 0, 2, 50, "Zed"),
    openCard("future-late", "upcoming", 300, 0, 1, "Late"),
    openCard("due", "due_today", 20, 1, 1, "Due"),
    openCard("future-early", "upcoming", 100, 4, 1, "Early"),
    openCard("future-new", "upcoming", 200, 0, 80, "Future"),
    openCard("overdue", "overdue", 80, 3, 1, "Over"),
    openCard("normal-touched", "", 0, 1, 10, "Touched"),
    openCard("normal-untouched", "", 0, 0, 40, "Untouched"),
  ];
  context.sortOpenBoardCards_(openCards);
  assert.deepEqual(openCards.map((card) => card.leadId), [
    "future-new",
    "normal-untouched",
    "future-late",
    "normal-new",
    "normal-touched",
    "due",
    "future-early",
    "overdue",
  ]);
  const followCards = [
    openCard("normal-new", "", 0, 2, 50, "Zed"),
    openCard("future-late", "upcoming", 300, 0, 1, "Late"),
    openCard("due", "due_today", 20, 1, 1, "Due"),
    openCard("future-early", "upcoming", 100, 4, 1, "Early"),
    openCard("future-new", "upcoming", 200, 0, 80, "Future"),
    openCard("overdue", "overdue", 80, 3, 1, "Over"),
    openCard("normal-touched", "", 0, 1, 10, "Touched"),
    openCard("normal-untouched", "", 0, 0, 40, "Untouched"),
  ];
  context.sortFollowUpBoardCards_(followCards);
  assert.deepEqual(followCards.map((card) => card.leadId), [
    "overdue",
    "due",
    "future-early",
    "future-new",
    "future-late",
    "normal-untouched",
    "normal-touched",
    "normal-new",
  ]);

  const scheduledCards = [
    {
      leadId: "DONE",
      patient: { fullName: "Done" },
      workflow: { scheduleDateMissing: false, workflowComplete: true },
      sort: { scheduledDate: 1, lastActivityAt: 1 },
    },
    {
      leadId: "STILL",
      patient: { fullName: "Still" },
      workflow: { scheduleDateMissing: false, workflowComplete: false },
      sort: { scheduledDate: 9, lastActivityAt: 9 },
    },
  ];
  context.sortScheduledBoardCards_(scheduledCards);
  assert.deepEqual(scheduledCards.map((card) => card.leadId), ["DONE", "STILL"]);

  const closedCards = [
    {
      leadId: "COMPLETE",
      patient: { fullName: "Complete" },
      workflow: { workflowComplete: true },
      sort: { lastActivityAt: 9 },
    },
    {
      leadId: "INCOMPLETE",
      patient: { fullName: "Incomplete" },
      workflow: { workflowComplete: false },
      sort: { lastActivityAt: 1 },
    },
  ];
  context.sortClosedBoardCards_(closedCards);
  assert.equal(closedCards[0].leadId, "COMPLETE");
  assert.doesNotMatch(
    extractFunction(source, "sortScheduledBoardCards_"),
    /getOpenBoardPriority_/,
  );
  assert.doesNotMatch(
    extractFunction(source, "sortClosedBoardCards_"),
    /getOpenBoardPriority_/,
  );

  harness.boot();
  const todayKey = context.Utilities.formatDate(
    new Date(),
    "America/Chicago",
    "yyyy-MM-dd",
  );
  harness.putLead(2, baseLead({
    lead_id: "LEAD-PLAIN",
    status: "Open Lead / Follow Up",
    first_name: "Plain",
    last_name: "Lead",
    attempt_count: 0,
    created_at: chicagoDate("2026-01-01"),
  }));
  harness.putLead(3, baseLead({
    lead_id: "LEAD-CALLBACK",
    status: "Open Lead / Follow Up",
    first_name: "Callback",
    last_name: "Lead",
    attempt_count: 2,
    created_at: chicagoDate("2026-03-01"),
    next_follow_up_on: chicagoDate(
      context.addCalendarDaysToDateKey_(todayKey, -1),
    ),
  }));
  harness.putLead(4, baseLead({
    lead_id: "LEAD-WINDOW",
    status: "Open Lead / Follow Up",
    first_name: "Window",
    last_name: "Lead",
    attempt_count: 3,
    created_at: chicagoDate("2026-04-01"),
    next_follow_up_on: chicagoDate(todayKey),
    next_follow_up_window_start: chicagoDate(todayKey, "10:00"),
    next_follow_up_window_end: chicagoDate(todayKey, "11:00"),
  }));
  harness.putLead(5, baseLead({
    lead_id: "LEAD-FUTURE",
    status: "Open Lead / Follow Up",
    first_name: "Future",
    last_name: "Lead",
    attempt_count: 0,
    created_at: chicagoDate("2026-02-01"),
    next_follow_up_on: chicagoDate(
      context.addCalendarDaysToDateKey_(todayKey, 21),
    ),
  }));
  harness.putLead(6, baseLead({
    lead_id: "LEAD-DUE",
    status: "Open Lead / Follow Up",
    first_name: "Due",
    last_name: "Lead",
    attempt_count: 4,
    created_at: chicagoDate("2026-05-01"),
    next_follow_up_on: chicagoDate(todayKey),
  }));
  context.__exports.EXECUTION_CACHE_.canonicalTables = {};
  context.__exports.EXECUTION_CACHE_.leadRowsById = {};
  const board = context.buildPatientBoardData_();
  const open = board.lanes.find((lane) => lane.status === "Open Lead");
  const follow = board.lanes.find((lane) => lane.status === "Follow Up");
  assert.deepEqual(Array.from(open.cards.map((card) => card.leadId)), ["LEAD-PLAIN"]);
  const ids = follow.cards.map((card) => card.leadId);
  assert.ok(ids.indexOf("LEAD-CALLBACK") < ids.indexOf("LEAD-DUE"));
  assert.ok(ids.indexOf("LEAD-DUE") < ids.indexOf("LEAD-FUTURE"));
  assert.equal(ids.includes("LEAD-PLAIN"), false);
  const windowCard = follow.cards.find((card) => card.leadId === "LEAD-WINDOW");
  assert.match(windowCard.workflow.followUpState.callbackLabel, /10:00 AM/);
  assert.match(windowCard.workflow.followUpState.callbackLabel, /11:00 AM/);
  const plainCard = open.cards.find((card) => card.leadId === "LEAD-PLAIN");
  const futureCard = follow.cards.find((card) => card.leadId === "LEAD-FUTURE");
  assert.ok(
    context.getFollowUpBoardPriority_(futureCard) <
      context.getFollowUpBoardPriority_(plainCard),
  );
  assert.equal(context.getFollowUpBoardPriority_(futureCard) > context.getFollowUpBoardPriority_(
    follow.cards.find((card) => card.leadId === "LEAD-DUE"),
  ), true);
  harness.assertNoPhi();
});

test("scheduled leads auto-archive after the configured calendar days", () => {
  harness.boot();
  assert.equal(context.getConfigValue_("scheduled_auto_archive_days"), "7");
  assert.equal(context.getConfigValue_("archive_cold_storage_days"), "365");
  context.setConfigValue_("archive_cold_storage_days", "365");
  context.__exports.EXECUTION_CACHE_.configRows = null;
  const setup = context.setupLeadArchiveSchema_();
  assert.equal(setup.ok, true);
  context.__exports.EXECUTION_CACHE_.configRows = null;
  assert.equal(context.getConfigValue_("archive_cold_storage_days"), "365");

  const todayKey = context.Utilities.formatDate(
    new Date(),
    "America/Chicago",
    "yyyy-MM-dd",
  );
  harness.putLead(2, baseLead({
    lead_id: "LEAD-YOUNG",
    status: "Scheduled",
    workflow_complete: false,
    scheduled_date: chicagoDate(context.addCalendarDaysToDateKey_(todayKey, -6)),
  }));
  harness.putLead(3, baseLead({
    lead_id: "LEAD-DUE",
    status: "Scheduled",
    workflow_complete: false,
    scheduled_date: chicagoDate(context.addCalendarDaysToDateKey_(todayKey, -7)),
  }));
  harness.putLead(4, baseLead({
    lead_id: "LEAD-BLANKDATE",
    status: "Scheduled",
    workflow_complete: true,
  }));
  harness.putLead(5, baseLead({
    lead_id: "LEAD-MOVED",
    status: "Scheduled",
    workflow_complete: false,
    scheduled_date: chicagoDate(todayKey),
  }));
  harness.writeObject(harness.workbook.getSheetByName("ActivityLog"), 2, {
    activity_id: "ACT-KEEP",
    lead_id: "LEAD-DUE",
    activity_type: "contact_attempt",
    contact_method: "Phone",
    occurred_at: chicagoDate("2026-10-01", "10:43"),
    note: "earlier call",
  });
  harness.writeObject(harness.workbook.getSheetByName("Attachments"), 2, {
    attachment_id: "ATT-KEEP",
    lead_id: "LEAD-DUE",
    drive_file_id: "ATT-FILE",
    file_name: "note.pdf",
  });
  context.__exports.EXECUTION_CACHE_.canonicalTables = {};
  context.__exports.EXECUTION_CACHE_.leadRowsById = {};

  context.setConfigValue_("scheduled_auto_archive_days", "nope");
  context.__exports.EXECUTION_CACHE_.configRows = null;
  assert.equal(context.archiveEligibleScheduledLeadsDaily().code, "CONFIG_INVALID");
  assert.equal(harness.leadValue(3, "archived"), false);

  context.setConfigValue_("scheduled_auto_archive_days", "7");
  context.__exports.EXECUTION_CACHE_.configRows = null;
  const props = context.PropertiesService.getDocumentProperties();
  props.deleteProperty("PASS25_DIRTY_BOARD");
  props.deleteProperty("PASS25_DIRTY_DASHBOARD");
  const drivesBefore = harness.driveReads.length;
  const archived = context.archiveEligibleScheduledLeadsDaily();
  assert.equal(archived.ok, true);
  assert.equal(archived.archivedCount, 1);
  assert.equal(harness.leadValue(2, "archived"), false);
  assert.equal(harness.leadValue(3, "archived"), true);
  assert.equal(harness.leadValue(3, "archived_by"), "System");
  assert.equal(harness.leadValue(3, "archived_from_status"), "Scheduled");
  assert.equal(harness.leadValue(3, "status"), "Scheduled");
  assert.equal(harness.leadValue(3, "workflow_complete"), false);
  assert.equal(
    Number.isFinite(harness.leadValue(3, "scheduled_date").getTime()),
    true,
  );
  assert.equal(
    harness.leadValue(3, "archive_reason"),
    "Automatically archived 7 days after scheduled visit.",
  );
  assert.equal(harness.leadValue(4, "archived"), false);
  assert.equal(harness.leadValue(5, "archived"), false);
  assert.equal(harness.leadValue(3, "lead_id"), "LEAD-DUE");
  const kept = activityRows().find((row) => row.method === "Phone");
  assert.equal(kept.leadId, "LEAD-DUE");
  assert.equal(kept.note, "earlier call");
  const audit = activityRows().find((row) => row.type === "lead_archived");
  assert.equal(audit.leadId, "LEAD-DUE");
  assert.equal(audit.source, "System");
  assert.equal(audit.generated, true);
  assert.equal(
    harness.idsIn("Attachments", "attachment_id").includes("ATT-KEEP"),
    true,
  );
  assert.equal(props.getProperty("PASS25_DIRTY_BOARD"), "1");
  assert.equal(props.getProperty("PASS25_DIRTY_DASHBOARD"), "1");
  assert.equal(harness.driveReads.length, drivesBefore);
  assert.equal(
    context.evaluateArchiveEligibility_("Scheduled", false).ok,
    true,
  );
  assert.equal(
    context.evaluateArchiveEligibility_("Scheduled", true).ok,
    true,
  );

  const refreshed = context.refreshDirtyDerivedViewsScheduled();
  assert.equal(refreshed.skipped, false);
  const archive = harness.workbook.getSheetByName("Archive");
  const archiveGrid = archive.getRange(
    1,
    1,
    Math.max(archive.getLastRow(), 1),
    12,
  ).getValues();
  assert.equal(
    archiveGrid.some((row) => row.includes("LEAD-DUE")),
    true,
  );
  assert.notEqual(props.getProperty("PASS25_DIRTY_BOARD"), "1");

  const second = context.archiveEligibleScheduledLeadsDaily();
  assert.equal(second.archivedCount, 0);
  assert.equal(harness.idsIn("Leads", "lead_id").filter((id) => id === "LEAD-DUE").length, 1);

  harness.lockState.held = true;
  assert.equal(context.archiveEligibleScheduledLeadsDaily().code, "LOCK_TIMEOUT");
  harness.lockState.held = false;

  const firstInstall = context.installScheduledAutoArchiveTrigger();
  const secondInstall = context.installScheduledAutoArchiveTrigger();
  assert.equal(firstInstall.created, true);
  assert.equal(secondInstall.created, false);
  assert.equal(secondInstall.count, 1);
  assert.equal(
    context.ScriptApp.getProjectTriggers()
      .filter((trigger) => trigger.getHandlerFunction() === "archiveEligibleScheduledLeadsDaily")
      .length,
    1,
  );
  assert.equal(context.removeScheduledAutoArchiveTrigger().removed, 1);
  assert.equal(context.installScheduledAutoArchiveTrigger().created, true);

  assert.equal(context.unarchiveLeadById_("LEAD-DUE").code, "UNARCHIVED");
  assert.equal(harness.leadValue(3, "archived"), false);
  assert.equal(harness.leadValue(3, "status"), "Scheduled");
  harness.assertNoPhi();
});

test("archived unable-to-reach history keeps exact contact timestamps", () => {
  harness.boot();
  installWorkflowLists();
  harness.putLead(2, baseLead({
    lead_id: "LEAD-REACH",
    status: "Open Lead / Follow Up",
    attempt_count: 0,
    reached_patient: false,
    last_contact_outcome: "",
  }));
  const recorded = context.patientDetailRecordContactAttempt("LEAD-REACH", {
    contactMethods: ["Text", "Phone", "Email"],
    note: "all three",
  });
  assert.equal(recorded.changed, true);
  assert.equal(harness.leadValue(2, "attempt_count"), 1);
  context.patientDetailMoveWorkflow("LEAD-REACH", {
    targetStatus: "Case Lost",
    reasons: ["Unable to Reach"],
  });
  assert.equal(harness.leadValue(2, "lost_reason"), "Unable to Reach");
  assert.equal(context.archiveLeadById_("LEAD-REACH").code, "ARCHIVED");
  const methods = activityRows()
    .filter((row) => row.type === "contact_attempt")
    .map((row) => ({
      method: row.method,
      time: row.occurred.getTime(),
      note: row.note,
    }));
  assert.deepEqual(methods.map((row) => row.method), ["Phone", "Email", "Text"]);
  assert.equal(methods[0].time, methods[1].time);
  assert.equal(methods[1].time, methods[2].time);
  assert.equal(methods.every((row) => row.note === "all three"), true);
  assert.equal(harness.leadValue(2, "reached_patient"), false);
  assert.equal(harness.leadValue(2, "last_contact_outcome"), "");
  assert.equal(harness.leadValue(2, "lead_id"), "LEAD-REACH");
  assert.equal(context.unarchiveLeadById_("LEAD-REACH").code, "UNARCHIVED");
  assert.equal(activityRows().filter((row) => row.type === "contact_attempt").length, 3);
  harness.assertNoPhi();
});

test("open lead and follow up split keeps adjacent workflows", () => {
  harness.boot();
  installWorkflowLists();
  const layout = {
    laneStarts: [2, 7, 12, 17, 22],
    spacerColumns: [6, 11, 16, 21],
    lastBoardColumn: 25,
    actionRailFirstColumn: 26,
    actionRailColumnCount: 4,
    applicationHeaderLastColumn: 29,
  };
  assert.equal(
    source.includes("lastBoardColumn: 25"),
    true,
  );
  assert.equal(source.includes("actionRailFirstColumn: 26"), true);
  assert.ok(layout.actionRailFirstColumn > layout.lastBoardColumn);
  assert.equal(
    layout.actionRailFirstColumn + layout.actionRailColumnCount - 1,
    layout.applicationHeaderLastColumn,
  );

  context.setConfigValue_("default_status", "Scheduled");
  context.__exports.EXECUTION_CACHE_.configRows = null;
  assert.equal(context.normalizeLegacyDefaultStatus_().changed, false);
  assert.equal(context.getConfigValue_("default_status"), "Scheduled");

  context.setConfigValue_("default_status", "Open Lead / Follow Up");
  context.__exports.EXECUTION_CACHE_.configRows = null;
  assert.equal(context.resolveConfiguredDefaultLeadStatus_(), "Open Lead");
  harness.putLead(4, {
    first_name: "New",
    last_name: "Lead",
  });
  const created = context.initializeLeadRow_(4, { source: "Employee" });
  assert.match(created, /^LEAD-/);
  assert.equal(harness.leadValue(4, "status"), "Open Lead");
  assert.equal(context.normalizeLegacyDefaultStatus_().changed, true);
  assert.equal(context.getConfigValue_("default_status"), "Open Lead");
  assert.equal(context.normalizeLegacyDefaultStatus_().changed, false);

  const todayKey = context.Utilities.formatDate(
    new Date(),
    "America/Chicago",
    "yyyy-MM-dd",
  );
  harness.putLead(2, baseLead({
    lead_id: "LEAD-OPEN",
    status: "Open Lead",
    attempt_count: 0,
    created_at: chicagoDate("2026-01-01"),
  }));
  harness.putLead(3, baseLead({
    lead_id: "LEAD-FOLLOW",
    status: "Follow Up",
    attempt_count: 2,
    next_follow_up_on: chicagoDate(
      context.addCalendarDaysToDateKey_(todayKey, -3),
    ),
  }));
  harness.putLead(5, baseLead({
    lead_id: "LEAD-SCHED",
    status: "Scheduled",
    scheduled_date: chicagoDate("2020-01-01"),
    workflow_complete: true,
  }));

  const attempted = context.patientDetailRecordContactAttempt("LEAD-OPEN", {
    contactMethods: ["Phone"],
    note: "called",
  });
  assert.equal(attempted.changed, true);
  assert.equal(harness.leadValue(2, "status"), "Open Lead");

  const saved = context.patientDetailSetFollowUpDate("LEAD-OPEN", {
    followUpDateText: "2026-12-15",
    note: "call back",
  });
  assert.equal(saved.changed, true);
  assert.equal(harness.leadValue(2, "status"), "Follow Up");
  const statusEvents = () => activityRows().filter((row) => row.type === "status_change");
  assert.equal(
    statusEvents().filter((row) => row.leadId === "LEAD-OPEN").length,
    1,
  );

  const updated = context.patientDetailSetFollowUpDate("LEAD-OPEN", {
    followUpDateText: "2026-12-20",
  });
  assert.equal(updated.changed, true);
  assert.equal(harness.leadValue(2, "status"), "Follow Up");
  assert.equal(
    statusEvents().filter((row) => row.leadId === "LEAD-OPEN").length,
    1,
  );

  context.patientDetailClearFollowUpDate("LEAD-OPEN", {});
  assert.equal(harness.leadValue(2, "status"), "Open Lead");
  assert.equal(harness.leadValue(2, "next_follow_up_on"), "");
  assert.equal(
    statusEvents().filter((row) => row.leadId === "LEAD-OPEN").length,
    2,
  );

  const manual = context.patientDetailMoveWorkflow("LEAD-OPEN", {
    targetStatus: "Follow Up",
  });
  assert.equal(manual.changed, true);
  assert.equal(harness.leadValue(2, "status"), "Follow Up");
  assert.equal(harness.leadValue(2, "next_follow_up_on"), "");
  assert.equal(context.archiveLeadById_("LEAD-OPEN").code, "INELIGIBLE_STATUS");
  const back = context.patientDetailMoveWorkflow("LEAD-OPEN", {
    targetStatus: "Open Lead",
  });
  assert.equal(back.changed, true);
  assert.equal(harness.leadValue(2, "status"), "Open Lead");

  const scheduled = context.patientDetailScheduleLead("LEAD-FOLLOW", {
    scheduledDateText: "2026-11-02",
    note: "booked",
  });
  assert.equal(scheduled.changed, true);
  assert.equal(harness.leadValue(3, "status"), "Scheduled");
  assert.equal(harness.leadValue(3, "next_follow_up_on"), "");

  const lost = context.patientDetailMoveWorkflow("LEAD-OPEN", {
    targetStatus: "Case Lost",
    reasons: ["Cost"],
    note: "too expensive",
  });
  assert.equal(lost.changed, true);
  assert.equal(harness.leadValue(2, "status"), "Case Lost");
  const unrelated = context.patientDetailMoveWorkflow("LEAD-OPEN", {
    targetStatus: "Unrelated",
    unrelatedType: "Vendor",
  });
  assert.equal(unrelated.changed, true);
  assert.equal(harness.leadValue(2, "status"), "Unrelated");
  assert.equal(harness.leadValue(2, "lost_reason"), "");

  const reopened = context.patientDetailMoveWorkflow("LEAD-OPEN", {
    targetStatus: "Follow Up",
    note: "patient called back",
  });
  assert.equal(reopened.changed, true);
  assert.equal(harness.leadValue(2, "status"), "Follow Up");
  assert.equal(context.archiveLeadById_("LEAD-OPEN").code, "INELIGIBLE_STATUS");
  const auto = context.archiveEligibleScheduledLeads_(7, new Date("2026-10-20T18:00:00Z"));
  assert.equal(auto.archivedCount, 1);
  assert.equal(harness.leadValue(5, "archived"), true);
  assert.equal(harness.leadValue(2, "archived"), false);

  harness.putLead(6, baseLead({
    lead_id: "LEAD-LEGACY-DATE",
    status: "Open Lead / Follow Up",
    archived: true,
    archived_from_status: "Open Lead / Follow Up",
    next_follow_up_on: chicagoDate("2026-12-01"),
  }));
  harness.putLead(7, baseLead({
    lead_id: "LEAD-LEGACY-NONE",
    status: "Open Lead / Follow Up",
    archived: true,
    archived_from_status: "Open Lead / Follow Up",
  }));
  assert.equal(context.unarchiveLeadById_("LEAD-LEGACY-DATE").code, "UNARCHIVED");
  assert.equal(harness.leadValue(6, "status"), "Follow Up");
  assert.equal(harness.leadValue(6, "archived_from_status"), "Open Lead / Follow Up");
  assert.equal(context.unarchiveLeadById_("LEAD-LEGACY-NONE").code, "UNARCHIVED");
  assert.equal(harness.leadValue(7, "status"), "Open Lead");

  harness.putLead(8, baseLead({
    lead_id: "LEAD-MIGRATE-DATE",
    status: "Open Lead / Follow Up",
    next_follow_up_on: chicagoDate("2026-12-02"),
    created_at: chicagoDate("2026-01-03"),
    attempt_count: 1,
    first_name: "ZZSECRETNAME",
  }));
  harness.putLead(9, baseLead({
    lead_id: "LEAD-MIGRATE-NONE",
    status: "Open Lead / Follow Up",
    attempt_count: 0,
    created_at: chicagoDate("2026-01-02"),
  }));
  const activity = harness.workbook.getSheetByName("ActivityLog");
  const activityMap = harness.headerMap(activity);
  const historicalRow = activity.getLastRow() + 1;
  harness.writeObject(activity, historicalRow, {
    activity_id: "ACT-HISTORICAL",
    lead_id: "LEAD-MIGRATE-NONE",
    activity_type: "status_change",
    previous_value: "Open Lead / Follow Up",
    new_value: "Scheduled",
    from_status: "Open Lead / Follow Up",
    to_status: "Scheduled",
    note: "historical Open Lead / Follow Up event",
    actor_name: "Historical Staff",
    system_generated: false,
  });

  const beforePreview = JSON.stringify(
    harness.workbook.getSheetByName("Leads").getRange(8, 1, 2, 5).getValues(),
  );
  const preview = context.previewOpenFollowUpStatusMigration();
  assert.equal(preview.legacyRows, 2);
  assert.equal(preview.toFollowUp, 1);
  assert.equal(preview.toOpenLead, 1);
  assert.equal(preview.changed, 0);
  assert.equal(
    JSON.stringify(
      harness.workbook.getSheetByName("Leads").getRange(8, 1, 2, 5).getValues(),
    ),
    beforePreview,
  );
  assert.equal(harness.logs.join("\n").includes("ZZSECRETNAME"), false);

  const migrated = context.migrateOpenFollowUpStatuses();
  assert.equal(migrated.changed, 2);
  assert.equal(migrated.toFollowUp, 1);
  assert.equal(migrated.toOpenLead, 1);
  assert.equal(harness.leadValue(8, "status"), "Follow Up");
  assert.equal(harness.leadValue(9, "status"), "Open Lead");
  assert.equal(harness.leadValue(8, "first_name"), "ZZSECRETNAME");
  assert.equal(
    activity.getRange(historicalRow, activityMap.note).getValue(),
    "historical Open Lead / Follow Up event",
  );
  assert.equal(
    activity.getRange(historicalRow, activityMap.previous_value).getValue(),
    "Open Lead / Follow Up",
  );
  const migrationEvents = activityRows().filter((row) =>
    String(row.note || "").includes("System migration: split legacy")
  );
  assert.equal(migrationEvents.length, 2);
  assert.equal(migrationEvents.every((row) => row.source === "System"), true);
  assert.equal(context.migrateOpenFollowUpStatuses().changed, 0);

  const board = context.buildPatientBoardData_();
  assert.deepEqual(
    Array.from(board.lanes.map((lane) => lane.status)),
    ["Open Lead", "Follow Up", "Scheduled", "Case Lost", "Unrelated"],
  );
  const snapshot = context.buildDashboardLeadSnapshot_();
  const openRow = snapshot.find((row) => row[0] === "LEAD-MIGRATE-NONE");
  const followRow = snapshot.find((row) => row[0] === "LEAD-MIGRATE-DATE");
  assert.equal(openRow[4], "Open Lead");
  assert.equal(followRow[4], "Follow Up");
  assert.equal(openRow[26], true);
  assert.notEqual(followRow[30], "");
  harness.assertNoPhi();
});

test("setup applies audit-safe workflow status validation without rewriting rows", () => {
  harness.boot();
  const leads = harness.workbook.getSheetByName("Leads");
  const activity = harness.workbook.getSheetByName("ActivityLog");
  const leadMap = harness.headerMap(leads);
  const activityMap = harness.headerMap(activity);
  const expected = [
    "Open Lead",
    "Follow Up",
    "Scheduled",
    "Case Lost",
    "Unrelated",
    "Open Lead / Follow Up",
  ];

  harness.putLead(4, baseLead({
    lead_id: "LEAD-VALIDATION",
    status: "Open Lead / Follow Up",
  }));
  harness.writeObject(activity, 3, {
    activity_id: "ACT-VALIDATION",
    lead_id: "LEAD-VALIDATION",
    from_status: "Open Lead / Follow Up",
    to_status: "Follow Up",
    note: "historical Open Lead / Follow Up event",
  });

  const beforeLeads = JSON.stringify(
    leads.getRange(1, 1, leads.getMaxRows(), leads.getLastColumn()).getValues(),
  );
  const beforeActivity = JSON.stringify(
    activity.getRange(1, 1, activity.getMaxRows(), activity.getLastColumn()).getValues(),
  );
  const again = context.setupLeadArchiveSchema_();

  assert.equal(again.ok, true);
  assert.equal(
    again.warnings.some((warning) => /validation/i.test(warning)),
    false,
  );
  assert.equal(
    JSON.stringify(
      leads.getRange(1, 1, leads.getMaxRows(), leads.getLastColumn()).getValues(),
    ),
    beforeLeads,
  );
  assert.equal(
    JSON.stringify(
      activity.getRange(1, 1, activity.getMaxRows(), activity.getLastColumn()).getValues(),
    ),
    beforeActivity,
  );

  function ruleAt(sheet, column, row) {
    return sheet.getRange(row, column).getDataValidations()[0][0];
  }

  [
    [leads, leadMap.status],
    [activity, activityMap.from_status],
    [activity, activityMap.to_status],
  ].forEach(([sheet, column]) => {
    const rule = ruleAt(sheet, column, 2);
    assert.deepEqual(rule.values, expected);
    assert.equal(rule.allowInvalid, false);
    assert.equal(rule.showDropdown, true);
    assert.equal(rule.checkbox, false);
    assert.deepEqual(ruleAt(sheet, column, sheet.getMaxRows()).values, expected);
    assert.equal(ruleAt(sheet, column, 1), null);
  });

  assert.equal(harness.leadValue(4, "status"), "Open Lead / Follow Up");
  assert.equal(
    activity.getRange(3, activityMap.from_status).getValue(),
    "Open Lead / Follow Up",
  );
  assert.equal(
    activity.getRange(3, activityMap.to_status).getValue(),
    "Follow Up",
  );
  harness.assertNoPhi();
});
