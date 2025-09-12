const snacks = {
  fishCutlet: { name: "Fish Cutlet", price: 1.00 },
  muttonRoll: { name: "Mutton Roll", price: 1.20 },
  fishPatties: { name: "Fish Patties", price: 1.50 },
  muttonPatties: { name: "Mutton Patties", price: 1.80 },
  seeniChippi: { name: "Seeni Chippi (100g)", price: 0.80 },
  murruku: { name: "Murruku", price: 0.50 },
  vaddai: { name: "Vaddai", price: 0.70 },
  laddu: { name: "Laddu", price: 1.00 },
  ariyatharam: { name: "Ariyatharam", price: 1.50 },
  mixer: { name: "Mixer (100g)", price: 1.20 },
  valapaniyaram: { name: "Valapaniyaram", price: 1.20 }
};

// Populate dropdown on load
(function initDropdown() {
  const select = document.getElementById("snackSelect");
  Object.entries(snacks).forEach(([key, item]) => {
    const opt = document.createElement("option");
    opt.value = key;
    const unit = item.name.includes("(100g)") ? "per 100g" : "each";
    opt.textContent = `${item.name.replace(" (100g)", "")} (£${item.price.toFixed(2)} ${unit})`;
    select.appendChild(opt);
  });
})();

function addItem() {
  const select = document.getElementById("snackSelect");
  const snackKey = select.value;
  if (!snackKey) return;

  const snack = snacks[snackKey];
  const table = document.getElementById("orderTable");
  const row = table.insertRow(-1);

  // Snack name
  const cell1 = row.insertCell(0);
  cell1.innerText = snack.name;

  // Price
  const cell2 = row.insertCell(1);
  cell2.innerText = "£" + snack.price.toFixed(2);

  // Quantity input
  const cell3 = row.insertCell(2);
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.step = "1";
  input.value = "0";
  input.dataset.price = snack.price;
  input.addEventListener("input", calculateTotal);
  cell3.appendChild(input);

  // Remove button
  const cell4 = row.insertCell(3);
  const removeBtn = document.createElement("button");
  removeBtn.innerText = "X";
  removeBtn.onclick = () => {
    row.remove();
    calculateTotal();
  };
  cell4.appendChild(removeBtn);

  calculateTotal();
}

function calculateTotal() {
  let inputs = document.querySelectorAll("#orderTable input[type='number']");
  let total = 0;
  inputs.forEach(input => {
    const qty = parseFloat(input.value) || 0;
    const price = parseFloat(input.dataset.price);
    total += qty * price;
  });
  document.getElementById("total").innerText = "Total: £" + total.toFixed(2);
}

const MUM_PHONE = "+447000000000";

setupContact(); // run once after load

function setupContact() {
  // Fill in tel and basic sms fallback links
  const telLink = document.getElementById("telLink");
  const smsFallback = document.getElementById("smsFallback");

  if (telLink) {
    telLink.href = `tel:${MUM_PHONE}`;
    telLink.textContent = formatPhoneForDisplay(MUM_PHONE);
  }
  if (smsFallback) {
    smsFallback.href = `sms:${MUM_PHONE}`;
  }

  // Handle the SMS form submit
  const form = document.getElementById("smsForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const messageInput = document.getElementById("smsMessage");
    const typed = (messageInput?.value || "").trim();

    // If user didn't type a message, auto-build one from the current order
    const summary = buildOrderSummary();
    const body = typed || summary || "Hi, I'd like to place an order.";

    const smsLink = buildSmsLink(MUM_PHONE, body);
    // Open the SMS app
    window.location.href = smsLink;
  });
}

// Build an order summary from the table (e.g. "Fish Cutlet x 3, Murruku x 2. Total: £5.00")
function buildOrderSummary() {
  const rows = document.querySelectorAll("#orderTable tr");
  const parts = [];
  let total = 0;

  // Skip header row (index 0)
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].cells;
    const name = cells[0]?.innerText || "";
    const priceText = cells[1]?.innerText || "£0.00";
    const input = rows[i].querySelector('input[type="number"]');

    const price = parseFloat(priceText.replace("£", "")) || 0;
    const qty = parseFloat(input?.value) || 0;

    if (qty > 0) {
      parts.push(`${name} x ${qty}`);
      total += qty * price;
    }
  }

  if (parts.length === 0) return "";

  return `Hi, I'd like to order: ${parts.join(", ")}. Total: £${total.toFixed(2)}`;
}
function buildSmsLink(number, body) {
  const encoded = encodeURIComponent(body);
  const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
  return isIOS ? `sms:${number}&body=${encoded}` : `sms:${number}?body=${encoded}`;
}

function formatPhoneForDisplay(e164) {
  // Basic display helper: just returns what you set (customize if you like)
  return e164;
}