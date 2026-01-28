const products = {
    "0123456789012": { name: "Fresh Milk", price: 1.50 },
    "1234567890123": { name: "Whole Grain Bread", price: 1.00 },
    "2345678901234": { name: "Potato Chips", price: 2.00 },
    "049000028203": { name: "Coca Cola", price: 1.25 } 
};

let cart = [];
let total = 0;
let isPaused = false;

// 1. Initialize with Fallback logic
function startScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#scanner"),
            constraints: {
                // If 'environment' fails, the browser will fall back to any available camera
                facingMode: "environment", 
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            willReadFrequently: true
        },
        decoder: {
            readers: ["ean_reader", "upc_reader", "code_128_reader"]
        }
    }, function(err) {
        if (err) {
            console.error("Quagga Startup Error:", err);
            document.getElementById("feedback-msg").innerText = "Camera Error: Please Refresh & Allow Access";
            return;
        }
        Quagga.start();
        document.getElementById("feedback-msg").innerText = "Ready to Scan";
    });

    Quagga.onDetected(handleScan);
}

// 2. Scan Logic
function handleScan(data) {
    if (isPaused) return;

    const code = data.codeResult.code;
    const item = products[code];

    if (item) {
        addtoBasket(item);
        showFeedback(item.name);
    }
}

function addtoBasket(item) {
    cart.push(item);
    total += item.price;

    const list = document.getElementById("cart");
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.name}</span> <strong>$${item.price.toFixed(2)}</strong>`;
    list.prepend(li); // New items at the top

    document.getElementById("total").innerText = total.toFixed(2);
}

// 3. Audio & Visual Feedback
function showFeedback(name) {
    isPaused = true;
    
    // Play beep
    const beep = document.getElementById("beep-sound");
    beep.currentTime = 0;
    beep.play().catch(() => console.log("Sound interaction required"));

    // Phone vibration
    if (navigator.vibrate) navigator.vibrate(100);

    const msg = document.getElementById("feedback-msg");
    msg.innerText = `Added ${name}!`;
    msg.style.color = "#2ecc71";

    setTimeout(() => {
        isPaused = false;
        msg.innerText = "Scanning...";
        msg.style.color = "inherit";
    }, 2000);
}

// 4. Checkout System
function checkout() {
    if (cart.length === 0) return alert("Your basket is empty!");

    const receipt = window.open('', '_blank');
    let content = `
        <div style="font-family:monospace; text-align:center; padding: 20px;">
            <h2>SmartCart🛒</h2>
            <p>${new Date().toLocaleString()}</p>
            <hr>
            ${cart.map(i => `<p style="display:flex; justify-content:space-between;"><span>${i.name}</span><span>$${i.price.toFixed(2)}</span></p>`).join('')}
            <hr>
            <h3>TOTAL: $${total.toFixed(2)}</h3>
            <p>Thank you for shopping!</p>
        </div>
    `;
    receipt.document.write(content);
    receipt.print();

    // Clear cart after checkout
    cart = [];
    total = 0;
    document.getElementById("cart").innerHTML = "";
    document.getElementById("total").innerText = "0.00";
}

// Start once page loads
window.onload = startScanner;
