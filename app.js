/**
 * SmartCart Pro - Science Fair Edition
 * Features: Barcode scanning, Audio/Haptic feedback, Printing
 */

// 1. Product Database
const products = {
    "0123456789012": { name: "Milk", price: 1.50 },
    "1234567890123": { name: "Bread", price: 1.00 },
    "2345678901234": { name: "Chips", price: 2.00 },
    "0000000000000": { name: "Demo Item", price: 0.01 } // Use for testing
};

let cart = [];
let total = 0;
let isPaused = false;

// 2. Initialize Scanner on Page Load
document.addEventListener("DOMContentLoaded", () => {
    startScanner();
});

function startScanner() {
    const feedback = document.getElementById("feedback-msg");
    
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#scanner"),
            constraints: {
                // 'ideal' is safer than 'exact' to prevent black screens
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: "environment" 
            },
        },
        decoder: {
            // Added more readers to support different types of barcodes
            readers: ["ean_reader", "upc_reader", "code_128_reader", "code_39_reader"]
        },
        locate: true
    }, (err) => {
        if (err) {
            console.error(err);
            feedback.innerText = "Camera Error: Check Permissions";
            feedback.style.color = "red";
            return;
        }
        console.log("Quagga Ready");
        Quagga.start();
        feedback.innerText = "Ready to Scan";
    });

    Quagga.onDetected(handleDetection);
}

// 3. Handle the Barcode Logic
function handleDetection(data) {
    if (isPaused) return;

    const code = data.codeResult.code;
    const product = products[code];

    if (product) {
        addToCart(product);
        triggerSuccess(product.name);
    } else {
        // Optional: Log unknown codes to help you build your database
        console.log("Unknown Barcode: " + code);
    }
}

function addToCart(item) {
    cart.push(item);
    total += item.price;

    // Update UI List
    const cartList = document.getElementById("cart");
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.padding = "8px";
    li.style.borderBottom = "1px solid #ddd";
    li.innerHTML = `<span>${item.name}</span> <strong>$${item.price.toFixed(2)}</strong>`;
    
    // Add new items to the top
    cartList.insertBefore(li, cartList.firstChild);

    // Update Total
    document.getElementById("total").innerText = total.toFixed(2);
}

// 4. Feedback (Sound, Vibration, Visual)
function triggerSuccess(itemName) {
    isPaused = true;
    
    // Play Beep
    const beep = document.getElementById("beep-sound");
    if(beep) beep.play().catch(e => console.log("Audio play blocked until user interaction"));

    // Vibrate phone
    if (navigator.vibrate) navigator.vibrate(100);

    // Visual feedback
    const msg = document.getElementById("feedback-msg");
    msg.innerText = `Added ${itemName}!`;
    msg.style.color = "#2ecc71";

    // Pause for 2.5 seconds so
