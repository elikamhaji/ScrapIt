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

async function fetchPrice() {
    try {
        const res = await fetch("https://api.gold-api.com/price/XAU");
        const data = await res.json();
        document.getElementById("goldPrice").value = data.price.toFixed(2);
        updateList();
    } catch (e) {
        console.log("fetch error", e);
    }
}

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

async function shareImage() {
    const card = document.getElementById("priceCard");

    const canvas = await html2canvas(card, { scale: 3 });

    canvas.toBlob(async (blob) => {
        const file = new File([blob], "gold-prices.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file] });
        } else {
            const link = document.createElement("a");
            link.href = canvas.toDataURL();
            link.download = "gold-prices.png";
            link.click();
        }
    });
}

fetchPrice();
