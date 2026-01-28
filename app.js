// app.js
const products = {
    "0123456789012": { name: "Milk", price: 1.50 },
    "1234567890123": { name: "Bread", price: 1.00 },
    "2345678901234": { name: "Chips", price: 2.00 }
};

let cart = [];
let total = 0;
let isPaused = false;

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    initScanner();
});

function initScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#scanner"),
            constraints: {
                facingMode: "environment" // Works on more devices
            }
        },
        decoder: {
            readers: ["ean_reader", "upc_reader", "code_128_reader"] // Support more types
        }
    }, (err) => {
        if (err) {
            document.getElementById("feedback-msg").innerText = "Camera Error";
            return;
        }
        Quagga.start();
        document.getElementById("status-light").style.background = "#2ecc71";
    });

    Quagga.onDetected(handleScan);
}

function handleScan(data) {
    if (isPaused) return;
    
    const code = data.codeResult.code;
    const product = products[code];

    if (product) {
        processItem(product);
        triggerFeedback(product.name);
    }
}

function processItem(item) {
    cart.push(item);
    total += item.price;
    
    // Update UI
    const list = document.getElementById("cart");
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.name}</span> <b>$${item.price.toFixed(2)}</b>`;
    list.prepend(li); // Newest items at top
    
    document.getElementById("total").innerText = total.toFixed(2);
}

function triggerFeedback(name) {
    isPaused = true;
    
    // 1. Sound
    document.getElementById("beep-sound").play();
    
    // 2. Vibration (for phone)
    if (navigator.vibrate) navigator.vibrate(100);
    
    // 3. Visual Feedback
    const msg = document.getElementById("feedback-msg");
    msg.innerText = `Added ${name}!`;
    msg.style.color = "#2ecc71";

    // Wait 2 seconds before allowing next scan
    setTimeout(() => {
        isPaused = false;
        msg.innerText = "Scanning...";
        msg.style.color = "inherit";
    }, 2000);
}

function checkout() {
    if (cart.length === 0) return alert("Cart is empty!");
    
    // Open printable receipt in new tab
    const printWin = window.open('', '', 'width=400,height=600');
    let receiptHTML = `
        <div style="font-family:monospace; text-align:center;">
            <h1>SmartCart🛒</h1>
            <p>${new Date().toLocaleString()}</p>
            <hr>
            ${cart.map(i => `<p style="display:flex; justify-content:space-between;"><span>${i.name}</span><span>$${i.price.toFixed(2)}</span></p>`).join('')}
            <hr>
            <h3>Total: $${total.toFixed(2)}</h3>
            <p>Thank you!</p>
        </div>
    `;
    printWin.document.write(receiptHTML);
    printWin.print();
    
    // Reset Everything
    location.reload(); 
}
