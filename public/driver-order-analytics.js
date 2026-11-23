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
  if (consentDenied()) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", d.measurement, {send_page_view: false});
  window.gtag("event", "page_view", {
    page_title: document.title, page_path: "/driver-order/" + (d.paid === "1" ? "paid" : "pending"),
    page_location: location.origin + "/driver-order/" + (d.paid === "1" ? "paid" : "pending"),
  });
  if (d.paid === "1") {
    var total = Number(d.amount);
    var transaction = d.transaction;
    if (/^cs_(?:live|test)_[A-Za-z0-9_]+$/.test(transaction || "") &&
      Number.isFinite(total) && total > 0 && /^[-a-z0-9_]{1,80}$/.test(d.product || "")) {
      // Local dedup plus GA4's transaction_id dedup across Stripe returns / browser sessions.
      var key = "hct_ga4_purchase_" + transaction;
      var sent = false;
      try { sent = localStorage.getItem(key) === "1"; } catch (_error) { /* storage may be blocked */ }
      if (!sent) {
        var common = {currency:"USD", value:total, transaction_id:transaction,
          payment_type: d.paymentType || "full",
          items:[{item_id:d.product, item_name:d.product,price:total,quantity:1}]};
        window.gtag("event","purchase",common);
        window.gtag("event","driver_payment_success",{
          currency:"USD",value:total,payment_type:d.paymentType || "full",product_id:d.product,
        });
        try { localStorage.setItem(key,"1"); } catch (_error) { /* GA4 still deduplicates transaction IDs */ }
      }
    }
  }
  // Clicks are not verified conversations or WeChat friend requests.
  document.addEventListener("click", function(event) {
    var link = event.target && event.target.closest &&
      event.target.closest("[data-driver-contact-channel]");
    if (!link) return;
    var channel = link.getAttribute("data-driver-contact-channel");
    if (!/^(whatsapp|wechat|email)$/.test(channel || "")) return;
    window.gtag("event","driver_contact_after_payment",{
      contact_channel:channel, page_path:"/driver-order/paid",
    });
  });
  if ("IntersectionObserver" in window) {
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
