// Thin wrappers around the BLA backend API. Same-origin fetches.

const json = async (res) => {
  let body = null;
  try {
    body = await res.json();
  } catch (_) {
    /* ignore */
  }
  if (!res.ok || (body && body.success === false)) {
    const message = (body && body.message) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return body;
};

export const getNotifications = async () => {
  const res = await fetch("/api/notifications", { headers: { Accept: "application/json" } });
  return json(res);
};

export const getBoard = async () => {
  const res = await fetch("/api/board", { headers: { Accept: "application/json" } });
  return json(res);
};

export const getEvents = async () => {
  const res = await fetch("/api/get/events", { headers: { Accept: "application/json" } });
  return json(res);
};

export const submitContact = async (payload) => {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  return json(res);
};

export const submitHelp = async (payload) => {
  const res = await fetch("/api/submit/help", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  return json(res);
};

export const getTerms = async () => {
  const res = await fetch("/api/terms", { headers: { Accept: "application/json" } });
  return json(res);
};

export const getPrivacy = async () => {
  const res = await fetch("/api/privacy", { headers: { Accept: "application/json" } });
  return json(res);
};

export const TURNSTILE_SITEKEY = "0x4AAAAAADnPb97yFwaFokyS";

export const HELP_CATEGORIES = [
  "General Help",
  "Membership",
  "Website Issue",
  "Complaint",
  "Suggestion",
  "Event Issue",
  "Other",
];
