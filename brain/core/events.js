// brain/core/events.js

const listeners = {};

function emit(eventName, payload = {}) {

  if (!eventName) return;

  if (!listeners[eventName]) return;

  const safeEvent = {
    event: eventName,
    payload: payload || {},
    timestamp: Date.now()
  };

  listeners[eventName].forEach(fn => {
    try {
      fn(safeEvent);
    } catch (err) {
      console.error("[EVENT ERROR]", err.message);
    }
  });
}

function on(eventName, callback) {

  if (!listeners[eventName]) {
    listeners[eventName] = [];
  }

  listeners[eventName].push(callback);
}

module.exports = {
  emit,
  on
};
