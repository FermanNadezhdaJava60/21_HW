import { myBind } from "./index.js";

function test(commonScript, testObj) {
  const expectedJSON = JSON.stringify(testObj.expected);
  let evalRes;
  try {
    evalRes = eval(commonScript + ";" + testObj.script);
  } catch (error) {
    evalRes = error.message;
  }
  const actualJSON = JSON.stringify(evalRes);
  const result = expectedJSON === actualJSON ? "passed" : "failed";
  const testResult = createTestResult(
    testObj.script,
    expectedJSON,
    actualJSON,
    result
  );
  return testResult;
}
function createTestResult(script, expectedJSON, actualJSON, result) {
  return { script, expectedJSON, actualJSON, result };
}
export function testframework(
  testName,
  commonScript,
  scripts,
  expectedResults
) {
  const bodyElem = document.querySelector("body");
  const resultObjects = getResultObjects(
    commonScript,
    scripts,
    expectedResults
  );
  const summary = getSummaryObject(resultObjects);
  const resultItemsList = getResultItemsList(resultObjects);
  const summaryLine = getSummaryLine(summary);
  const commonScriptLines = getCommonScriptLines(commonScript);
  const header = getHeader(testName);
  bodyElem.innerHTML = `${header}${commonScriptLines}${resultItemsList}${summaryLine}`;
}
function getHeader(testName) {
  const res = `<header class="logo">${testName}</header>`;
  return res;
}
function getCommonScriptLines(commonScript) {
  const commonScriptLines = commonScript.replaceAll(";", "<br>");
  const res = `<span class=arranging>${commonScriptLines}</span>`;
  return res;
}
function getResultObjects(commonScript, scripts, expectedResults) {
  const res = scripts.map((script, index) =>
    test(commonScript, { script, expected: expectedResults[index] })
  );
  return res;
}
function getSummaryObject(resultObjects) {
  const res = resultObjects.reduce(
    (acc, cur) => ({
      passed: cur.result === "passed" ? acc.passed + 1 : acc.passed,
      failed: cur.result === "failed" ? acc.failed + 1 : acc.failed,
    }),
    { passed: 0, failed: 0 }
  );
  return res;
}
function getResultItemsList(resultObjects) {
  const resItems = resultObjects.map(getResItem).join("");
  const resList = `<ol>${resItems}</ol>`;
  return resList;
}
function getResItem(resultObject) {
  const resItem = `<li class="item ${
    resultObject.result === "passed" ? "item_passed" : "item_failed"
  }"> ${getResText(resultObject)} </li>`;
  return resItem;
}
function getResText(resultObject) {
  const resStr = `${resultObject.script} ; expected is ${resultObject.expectedJSON}; actual is ${resultObject.actualJSON}`;
  return resStr;
}
function getSummaryLine(summary) {
  const summaryLine = `<div class="summary"><span class="item_passed">passed ${summary.passed}</span>
  <span class="item_failed" >failed ${summary.failed}</span></div>`;
  return summaryLine;
}
