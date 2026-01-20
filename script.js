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

document.getElementById("fetchBtn").addEventListener("click", fetchPrice);
document.getElementById("shareBtn").addEventListener("click", shareImage);

document.getElementById("goldPrice").addEventListener("input", updateList);
document.getElementById("discount").addEventListener("input", updateList);

/* ================= PANAMA TIMESTAMP ================= */

function getFormattedTimestamp() {
    const now = new Date();

    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "America/Panama",
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });

    const parts = formatter.formatToParts(now);

    const day = parts.find(p => p.type === "day").value;
    const month = parts.find(p => p.type === "month").value;
    const year = parts.find(p => p.type === "year").value;
    const hour = parts.find(p => p.type === "hour").value;
    const minute = parts.find(p => p.type === "minute").value;
    const period = parts.find(p => p.type === "dayPeriod").value.toUpperCase();

    return `${day}/${month}/${year}   ${hour}:${minute} ${period}`;
}

/* ================= FETCH GOLD PRICE ================= */

async function fetchPrice() {
    try {
        const res = await fetch("https://api.gold-api.com/price/XAU");
        const data = await res.json();

        document.getElementById("goldPrice").value = data.price.toFixed(2);
        updateList();

        // Timestamp updates ONLY when price is fetched
        document.getElementById("timeStamp").innerText = getFormattedTimestamp();

    } catch (e) {
        console.log("fetch error", e);
    }
}

/* ================= PRICE CALCULATION ================= */

function updateList() {
    const oz = parseFloat(document.getElementById("goldPrice").value);
    const discount = parseFloat(document.getElementById("discount").value);
    const list = document.getElementById("priceList");
    const refDisplay = document.getElementById("refDisplay");

    if (!oz || !discount) return;

    list.innerHTML = "";

    const gramBase = oz / 31.1035;
    const pct = discount / 100;

    karats.forEach(k => {
        const perGram = (gramBase * k.purity * pct).toFixed(2);
        const row = document.createElement("div");
        row.className = "row";
        row.innerHTML = `<span>${k.label}</span><span>$${perGram}</span>`;
        list.appendChild(row);
    });

    const refCode = `Ref#9${Math.floor(oz)}${Math.floor(discount - 30)}`;
    refDisplay.innerText = refCode;
}

/* ================= QUICK % BUTTONS ================= */

document.querySelectorAll(".disc-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.getElementById("discount").value = btn.dataset.val;
        updateList();
    });
});

/* ================= SHARE IMAGE ================= */

async function shareImage() {
    const card = document.getElementById("priceCard");
    const canvas = await html2canvas(card, { scale: 3 });

    canvas.toBlob(blob => {
        if (!blob) return;

        const file = new File([blob], "gold-prices.png", { type: "image/png" });

        if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({ files: [file] });
                return;
            }
        }

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "gold-prices.png";
        link.click();
    });
}

/* ================= AUTO FETCH ON LOAD ================= */

fetchPrice();
