const karats = [
    { label: "10k", purity: 0.41 },
    { label: "14k", purity: 0.575 },
    { label: "18k", purity: 0.735 },
    { label: "87%", purity: 0.87 },
    { label: "88%", purity: 0.88 },
    { label: "90%", purity: 0.90 },
    { label: "91%", purity: 0.91 },
    { label: "92%", purity: 0.92 },
    { label: "93%", purity: 0.93 },
    { label: "95%", purity: 0.95 },
    { label: "99%", purity: 0.99 }
];

const goldPriceInput = document.getElementById("goldPrice");
const discountInput = document.getElementById("discount");
const fetchBtn = document.getElementById("fetchBtn");
const shareBtn = document.getElementById("shareBtn");

const priceList = document.getElementById("priceList");
const refDisplay = document.getElementById("refDisplay");
const priceCard = document.getElementById("priceCard");

/* ================= FETCH GOLD PRICE ================= */

fetchBtn.addEventListener("click", fetchPrice);

async function fetchPrice() {
    try {
        const res = await fetch("https://api.gold-api.com/price/XAU");
        const data = await res.json();
        goldPriceInput.value = data.price.toFixed(2);
        updateList();
    } catch (e) {
        console.log("Error fetching gold price", e);
    }
}

/* ================= UPDATE PRICE LIST ================= */

goldPriceInput.addEventListener("input", updateList);
discountInput.addEventListener("input", updateList);

function updateList() {
    const oz = parseFloat(goldPriceInput.value);
    const discount = parseFloat(discountInput.value);

    if (!oz || !discount) return;

    priceList.innerHTML = "";

    const gramBase = oz / 31.1035;
    const pct = discount / 100;

    karats.forEach(k => {
        const perGram = (gramBase * k.purity * pct).toFixed(2);
        const row = document.createElement("div");
        row.className = "row";
        row.innerHTML = `<span>${k.label}</span><span>$${perGram}</span>`;
        priceList.appendChild(row);
    });

    // REF code (internal use)
    const refCode = `Ref#9${Math.floor(oz)}${Math.floor(discount - 30)}`;
    refDisplay.textContent = refCode;
}

/* ================= QUICK % BUTTONS ================= */

document.querySelectorAll(".disc-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        discountInput.value = btn.dataset.val;
        updateList();
    });
});

/* ================= SHARE IMAGE (WHATSAPP FIRST) ================= */

shareBtn.addEventListener("click", shareImage);

async function shareImage() {
    const canvas = await html2canvas(priceCard, { scale: 3 });

    canvas.toBlob(blob => {
        if (!blob) return;

        const file = new File([blob], "gold-prices.png", { type: "image/png" });

        // Mobile → go straight to WhatsApp via native share
        if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: "Gold Prices"
                });
                return;
            }
        }

        // Desktop fallback → download image
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "gold-prices.png";
        link.click();
    });
}
