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
