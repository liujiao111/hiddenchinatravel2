/* Analytics for signed private order pages. Never expose the signed token, contacts or PII to GA4. */
(function () {
  "use strict";
  var root = document.getElementById("driver-order-analytics");
  if (!root) return;
  var d = root.dataset;
  if (!/^G-[A-Z0-9]+$/.test(d.measurement || "")) return;
  function consentDenied() {
    try {
      var entry = window.google_tag_data && window.google_tag_data.ics &&
        window.google_tag_data.ics.entries && window.google_tag_data.ics.entries.analytics_storage;
      if (entry && (entry.update === false || (entry.update === undefined && entry.default === false))) return true;
      var queue = window.dataLayer || [];
      for (var i = 0; i < queue.length; i++) {
        var item = queue[i];
        if (item && item[0] === "consent" && (item[1] === "default" || item[1] === "update") &&
          item[2] && item[2].analytics_storage === "denied") return true;
      }
    } catch (_error) { return true; }
    return false;
  }
  if (consentDenied() || (navigator && navigator.globalPrivacyControl === true) || window["ga-disable-" + d.measurement] === true) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", d.measurement, {send_page_view: false});
  window.gtag("event", "page_view", {
    page_title: document.title, page_path: "/driver-order/" + (d.paid === "1" ? "paid" : "pending"),
    page_location: location.origin + "/driver-order/" + (d.paid === "1" ? "paid" : "pending"),
  });
  if (d.paid === "1") {
    var payments = [];
    try { payments = JSON.parse(d.purchases || "[]"); } catch (_error) { payments = []; }
    if (Array.isArray(payments)) payments.forEach(function (payment) {
      if (!payment || !/^cs_(?:live|test)_[A-Za-z0-9_]+$/.test(payment.transaction_id || "")
        || !/^[a-z0-9-]{1,80}$/.test(payment.item_id || "")
        || !Number.isSafeInteger(payment.amount_cents) || payment.amount_cents < 1
        || !/^(initial|balance)$/.test(payment.stage || "")) return;
      var key = "hct_ga4_purchase_" + payment.transaction_id;
      var sent = false;
      try { sent = localStorage.getItem(key) === "1"; } catch (_error) { /* blocked */ }
      if (sent) return;
      var amount = payment.amount_cents / 100;
      // Store Stripe session ID as transaction ID to avoid double-counting after refresh.
      window.gtag("event", "purchase", {
        currency: "USD", value: amount, transaction_id: payment.transaction_id,
        payment_type: payment.payment_type || "full", service_category: "private_driver",
        page_path: "/driver-order/paid", page_location: location.origin + "/driver-order/paid",
        items: [{item_id: payment.item_id, item_name: payment.item_id, price: amount, quantity: 1}],
        transport_type: "beacon",
      });
      window.gtag("event", "driver_payment_success", {
        currency: "USD", value: amount, payment_type: payment.payment_type || "full",
        product_id: payment.item_id, page_path: "/driver-order/paid",
      });
      try { localStorage.setItem(key, "1"); } catch (_error) { /* GA4 also deduplicates same transaction_id */ }
    });
  }
  // Clicks are not verified conversations or WeChat friend requests.
  document.addEventListener("click", function(event) {
    var link = event.target && event.target.closest &&
      event.target.closest("[data-driver-contact-channel]");
    if (!link) return;
    var channel = link.getAttribute("data-driver-contact-channel");
    if (!/^(whatsapp|wechat|email|wechat_qr|whatsapp_qr)$/.test(channel || "")) return;
    window.gtag("event","driver_contact_after_payment",{
      contact_channel:channel, page_path:"/driver-order/paid",
    });
  });
  if ("IntersectionObserver" in window && d.paid === "1") {
    var observed = {};
    var watcher = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var channel = entry.target.getAttribute("data-driver-qr-channel");
        if (observed[channel]) return;
        observed[channel] = true;
        window.gtag("event","driver_contact_qr_view",{
          contact_channel:channel,page_path:"/driver-order/paid",
        });
        watcher.unobserve(entry.target);
      });
    },{threshold:0.5});
    document.querySelectorAll("[data-driver-qr-channel]").forEach(function(el){watcher.observe(el);});
  }
})();
