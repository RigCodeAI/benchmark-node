"use strict";

function escapeHtml(value) {
  return value.replace(/[&<>"']/gu, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
  })[character]);
}

function escapeLdap(value) {
  return value.replace(/[\\*()\0]/gu, (character) => `\\${character.codePointAt(0).toString(16).padStart(2, "0")}`);
}

function escapeXpath(value) {
  return value.replace(/["']/gu, "");
}

module.exports = { escapeHtml, escapeLdap, escapeXpath };
