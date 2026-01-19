const karats = [
  { label: "10k", purity: 0.41 },
  { label: "14k", purity: 0.575 },
  { label: "18k", purity: 0.735 },
  { label: "90%", purity: 0.9 },
  { label: "91%", purity: 0.91 },
  { label: "92%", purity: 0.92 },
  { label: "93%", purity: 0.93 },
  { label: "95%", purity: 0.95 },
  { label: "99%", purity: 0.99 },
];

document.querySelectorAll(".quick-buttons button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("discount").value = btn.dataset.val;
    updateList();
  });
});

document.getElementById("discount").addEventListener("input", updateList);
document.getElementById("shareBtn").addEventListener("click", shareImage);

function updateList() {
  const discount = parseFloat(document.getElementById("discount").value);
  if (!discount) return;

  const oz = 4000;
  const gramBase = oz / 31.1035;
  const pct = discount / 100;
  const list = document.getElementById("priceList");
  list.innerHTML = "";

  karats.forEach(k => {
    const val = (gramBase * k.purity * pct).toFixed(2);
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<span>${k.label}</span><span>$${val}</span>`;
    list.appendChild(row);
  });

  document.getElementById("refDisplay").innerText =
    `Ref#9${Math.floor(oz)}${Math.floor(discount - 30)}`;
}

async function shareImage() {
  const card = document.getElementById("priceCard");
  const canvas = await html2canvas(card, { scale: 3 });
  canvas.toBlob(async blob => {
    const file = new File([blob], "prices.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] });
    }
  });
}
