const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Nap catalog event 1 lan luc module duoc require, khong doc lai file
// moi lan log (events.yaml khong thay doi luc runtime).
const events = yaml.load(
  fs.readFileSync(path.join(__dirname, '..', 'events.yaml'), 'utf8')
);

/**
 * Thay the placeholder dang {key} trong template bang gia tri tuong ung trong params.
 * Neu key khong co trong params, giu nguyen placeholder (de de nhan ra cho thieu data
 * khi debug, thay vi am tham in ra "undefined").
 *
 * @param {string} template - vi du "Login failed: {email}"
 * @param {Record<string, unknown>} params - vi du { email: 'a@a.com' }
 * @returns {string} chuoi da thay the, vi du "Login failed: a@a.com"
 */
function interpolate(template, params) {
  return template.replace(/{(\w+)}/g, (_, key) =>
    key in params ? params[key] : `{${key}}`
  );
}

// Map level logic (info/warn/error) sang dung method cua console.
const CONSOLE_METHOD = { info: 'log', warn: 'warn', error: 'error' };

/**
 * Ghi 1 dong log ra console, tra cuu template mo ta tu events.yaml theo eventKey.
 * Day la ham noi bo, khong export truc tiep - dung qua log()/log.info()/log.warn()/log.error().
 *
 * @param {string} level - 'info' | 'warn' | 'error', quyet dinh dung console.log/warn/error nao
 * @param {string} eventKey - key khai bao trong events.yaml, vi du 'login_failed'
 * @param {Record<string, unknown>} [params] - data de thay vao placeholder cua description
 */
function write(level, eventKey, params = {}) {
  const event = events[eventKey];
  const description = event ? event.description : eventKey;
  const message = interpolate(description, params);
  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] [${eventKey}] ${message}`;
  console[CONSOLE_METHOD[level] || 'log'](line);
}

/**
 * Log 1 event, dung dung level da khai bao san trong events.yaml cho event do
 * (khong can nho/lap lai level o moi cho goi). Neu eventKey khong ton tai trong
 * events.yaml, mac dinh log o muc 'info' va in thang eventKey lam message.
 *
 * @param {string} eventKey - key trong events.yaml, vi du 'login_success'
 * @param {Record<string, unknown>} [params] - data de thay vao placeholder, vi du { userId: 1 }
 */
function log(eventKey, params) {
  const event = events[eventKey];
  write(event ? event.level : 'info', eventKey, params);
}

/**
 * log.info/log.warn/log.error: ghi de level mac dinh trong events.yaml khi call site
 * can log o muc nghiem trong khac (vi du 1 event thuong la 'warn' nhung muon escalate
 * thanh 'error' trong 1 tinh huong dac biet).
 *
 * @param {string} eventKey
 * @param {Record<string, unknown>} [params]
 */
log.info = (eventKey, params) => write('info', eventKey, params);
log.warn = (eventKey, params) => write('warn', eventKey, params);
log.error = (eventKey, params) => write('error', eventKey, params);

module.exports = log;
