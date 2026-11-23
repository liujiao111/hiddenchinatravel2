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
  var safePath = "/driver-order/" + (d.paid === "1" ? "paid" : "pending");
  var safeUrl = location.origin + safePath;
  window.gtag("config", d.measurement, {send_page_view: false, page_path: safePath, page_location: safeUrl});
  window.gtag("event", "page_view", {
    page_title: document.title, page_path: safePath,
    page_location: safeUrl,
  });
  if (d.paid === "1") {
    var purchases = [];
    try { purchases = JSON.parse(d.purchases || "[]"); } catch (_error) { /* malformed data is ignored */ }
    if (Array.isArray(purchases)) purchases.forEach(function(record) {
      if (!record || !/^cs_(?:live|test)_[A-Za-z0-9_]+$/.test(record.transaction_id || "") ||
        !Number.isSafeInteger(record.amount_cents) || record.amount_cents < 1 ||
        !/^[a-z0-9-]{1,80}$/.test(record.item_id || "") ||
        !/^(initial|balance)$/.test(record.stage || "")) return;
      var total = record.amount_cents / 100;
      var transaction = record.transaction_id;
      var paymentType = record.payment_type || "full";
      var key = "hct_ga4_purchase_" + transaction;
      var sent = false;
      try { sent = localStorage.getItem(key) === "1"; } catch (_error) { /* optional storage */ }
      if (sent) return;
      window.gtag("event","purchase",{
        currency:"USD",value:total,transaction_id:transaction,payment_type:paymentType,
        items:[{item_id:record.item_id,item_name:record.item_id,price:total,quantity:1}],
        transport_type:"beacon",page_path:safePath,page_location:safeUrl,
      });
      window.gtag("event","driver_payment_success",{
        currency:"USD",value:total,payment_type:paymentType,product_id:record.item_id,
        page_path:safePath,page_location:safeUrl,
      });
      try { localStorage.setItem(key,"1"); } catch (_error) { /* GA4 transaction dedup still applies */ }
    });
  }
  // Clicks are not verified conversations or WeChat friend requests.
  document.addEventListener("click", function(event) {
    var link = event.target && event.target.closest &&
      event.target.closest("[data-driver-contact-channel]");
    if (!link) return;
    var copyId = link.getAttribute("data-copy-wechat");
    if (copyId && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(copyId).then(function () {
        link.textContent = "✓ " + (link.textContent || "Copied");
      }).catch(function () {});
    }
    var channel = link.getAttribute("data-driver-contact-channel");
    if (!/^(whatsapp|wechat|email|wechat_qr|whatsapp_qr)$/.test(channel || "")) return;
    window.gtag("event","driver_contact_after_payment",{
      contact_channel:channel, page_path:safePath, page_location:safeUrl,
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
          contact_channel:channel,page_path:safePath,page_location:safeUrl,
        });
        watcher.unobserve(entry.target);
      });
    },{threshold:0.5});
    document.querySelectorAll("[data-driver-qr-channel]").forEach(function(el){watcher.observe(el);});
  }
})();
