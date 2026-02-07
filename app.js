// 1. Database of your sample products
const products = {
    "6294011607141": { name: "Lulu Yogurt Drink", price: 2.50 },
    "1234567890123": { name: "Fresh Bread", price: 1.50 },
    "0000000000000": { name: "Demo Product", price: 0.10 }
    // Add your other 6 barcodes here following the same format
};

let cart = [];
let total = 0;
let isPaused = false;

// 2. Camera Configuration
function initScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#scanner"),
            constraints: {
                facingMode: "environment", // Uses back camera
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
        },
        locator: {
            patchSize: "medium",
            halfSample: false // Higher precision for small barcodes
        },
        decoder: {
            readers: ["ean_reader", "upc_reader", "code_128_reader"]
        },
        locate: true
    }, (err) => {
        if (err) {
            document.getElementById("feedback-msg").innerText = "Camera Access Denied";
            return;
        }
        Quagga.start();
        document.getElementById("status-dot").style.background = "#2ecc71"; // Green means ready
    });

    Quagga.onDetected(handleScan);
}

// 3. Scanning Logic & Recognition
function handleScan(data) {
    if (isPaused) return;

    const code = data.codeResult.code;
    let item = products[code];

    // Check if the item is recognized; otherwise, use the default price of 4.98
    if (!item) {
        item = { 
            name: `Unknown Item (${code})`, 
            price: 4.98 
        };
    }

    cart.push(item);
    total += item.price;
    updateUI(item.name, item.price);
    playFeedback(item.name);
}

function updateUI(name, price) {
    const list = document.getElementById("cart");
    const li = document.createElement("li");
    li.innerHTML = `<span>${name}</span> <b>$${price.toFixed(2)}</b>`;
    list.prepend(li); // New items appear at the top
    document.getElementById("total").innerText = total.toFixed(2);
}

function playFeedback(name) {
    isPaused = true; // Stop scanning for 2.5 seconds to avoid duplicates
    
    // Play beep sound
    const beep = document.getElementById("beep-sound");
    beep.currentTime = 0;
    beep.play().catch(() => {});

    // Vibrate phone
    if (navigator.vibrate) navigator.vibrate(100);

    const msg = document.getElementById("feedback-msg");
    msg.innerText = `Added: ${name}`;
    msg.style.color = "#2ecc71";

    setTimeout(() => {
        isPaused = false;
        msg.innerText = "Align barcode to scan...";
        msg.style.color = "#666";
    }, 2500); 
}

// 4. Reset & Checkout Functions
function clearCart() {
    cart = [];
    total = 0;
    document.getElementById("cart").innerHTML = "";
    document.getElementById("total").innerText = "0.00";
}

function checkout() {
    if (cart.length === 0) return alert("Your basket is empty!");
    
    // Create a printable receipt window
    const w = window.open('', '_blank');
    w.document.write(`
        <div style="text-align:center; font-family:monospace; padding: 20px; border: 1px dashed #000;">
            <h1>SmartCart🛒 Receipt</h1>
            <p>${new Date().toLocaleString()}</p>
            <hr>
            ${cart.map(i => `<div style="display:flex; justify-content:space-between;"><span>${i.name}</span><span>$${i.price.toFixed(2)}</span></div>`).join('')}
            <hr>
            <h2>TOTAL: $${total.toFixed(2)}</h2>
            <p>Thank you for shopping!</p>
        </div>
    `);
    w.document.close();
    w.print();
    clearCart(); // Auto-reset after printing
}

// Kick off the scanner when the page finishes loading
window.onload = initScanner;
