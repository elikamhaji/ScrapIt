function calculatePrices() {
    const ounceInput = document.getElementById("ounceInput").value;
    const discountInput = document.getElementById("discountInput").value;

    const ounce = parseFloat(ounceInput);
    const discount = parseFloat(discountInput);

    const resultsList = document.getElementById("resultsList");
    const refDisplay = document.getElementById("refDisplay");

    resultsList.innerHTML = "";

    if (isNaN(ounce) || isNaN(discount)) {
        return;
    }

    const karats = [
        { label: "10k", value: 0.4167 },
        { label: "14k", value: 0.585 },
        { label: "18k", value: 0.75 },
        { label: "85%", value: 0.85 },
        { label: "87%", value: 0.87 },
        { label: "90%", value: 0.90 },
        { label: "91%", value: 0.91 },
        { label: "92%", value: 0.92 },
        { label: "93%", value: 0.93 },
        { label: "95%", value: 0.95 },
        { label: "99%", value: 0.99 }
    ];

    karats.forEach(k => {
        const price = (ounce * k.value) * (1 - discount / 100);
        const li = document.createElement("li");

        li.innerHTML = `
            <span class="karat">${k.label}</span>
            <span class="price">$${price.toFixed(2)}</span>
        `;

        resultsList.appendChild(li);
    });

    // --- REF LOGIC ---
    // Option A — Full reference on bottom left
    const rawOunce = Math.round(ounce);                      
    const modifiedDiscount = Math.round(discount - 30);      
    const refCode = `Ref#${rawOunce}${modifiedDiscount}`;

    refDisplay.innerText = refCode;
}


// SHARE FUNCTION
function sharePrices() {
    const captureElement = document.querySelector(".results-box");

    html2canvas(captureElement, { scale: 3 }).then(canvas => {
        canvas.toBlob(blob => {
            const file = new File([blob], "gold-prices.png", { type: "image/png" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: "Gold Prices",
                });
            } else {
                const link = document.createElement("a");
                link.href = canvas.toDataURL();
                link.download = "gold-prices.png";
                link.click();
            }
        });
    });
}


// --- AUTO-CALCULATE ON PAGE LOAD ---
window.addEventListener("load", () => {
    calculatePrices();
});
