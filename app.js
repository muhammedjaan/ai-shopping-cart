/**
 * SmartCart 2.0 - Final Version
 * Logic:
 * - Recognized: Add to cart + Green Feedback + Beep
 * - Unrecognized: Red Feedback + No Cart Entry
 */

// 1. Your Product Database
const products = {
    "6294011607141": { name: "Lulu Yogurt Drink", price: 2.50 },
    "1234567890123": { name: "Test Item", price: 1.00 },
    // Add your other 7 product barcodes here
};

let cart = [];
let total = 0;
let lastScanTime = 0;

// 2. The Main Scanning Function
function onScanSuccess(decodedText, decodedResult) {
    // Cooldown: Prevent scanning the same thing 10 times in 1 second
    const now = new Date().getTime();
    if (now - lastScanTime < 2500) return; 
    lastScanTime = now;

    const feedback = document.getElementById("feedback");
    const item = products[decodedText];

    if (!item) {
        // --- CASE: UNRECOGNIZED ITEM ---
        feedback.innerText = "Unrecognized Item - Not Added";
        feedback.style.color = "red";
        
        // Haptic feedback (Double vibrate for error)
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        
        console.log("Unknown barcode detected:", decodedText);
    } else {
        // --- CASE: SUCCESSFUL MATCH ---
        // 1. Add to the internal cart array
        cart.push(item);
        
        // 2. Update the math
        total += item.price;

        // 3. Update the UI List
        const list = document.getElementById("cart-list");
        const li = document.createElement("li");
        li.innerHTML = `<span>${item.name}</span> <b>$${item.price.toFixed(2)}</b>`;
        list.prepend(li); // Put newest item at the top

        // 4. Update the Total display
        document.getElementById("total-price").innerText = total.toFixed(2);

        // 5. Success Feedback
        feedback.innerText = `Added: ${item.name}`;
        feedback.style.color = "green";
        
        // Play beep and vibrate
        const beep = document.getElementById("beep");
        if (beep) {
            beep.currentTime = 0;
            beep.play().catch(e => console.log("Audio needs user tap first"));
        }
        if (navigator.vibrate) navigator.vibrate(200);
    }

    // Clear the feedback message after 2.5 seconds
    setTimeout(() => {
        feedback.innerText = "";
    }, 2500);
}

// 3. Scanner Initialization
// This uses the html5-qrcode library to build the camera UI
let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", 
    { 
        fps: 15, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true // Adds a flashlight button for dark rooms!
    },
    false
);

html5QrcodeScanner.render(onScanSuccess);

// 4. Checkout and Reset
function checkout() {
    if (cart.length === 0) {
        alert("Your basket is empty!");
        return;
    }

    // Create simple receipt
    let receiptSummary = cart.map(i => `${i.name}: $${i.price.toFixed(2)}`).join('\n');
    alert(`--- RECEIPT ---\n${receiptSummary}\n--------------\nTOTAL: $${total.toFixed(2)}`);

    // Reset everything for the next user
    cart = [];
    total = 0;
    document.getElementById("cart-list").innerHTML = "";
    document.getElementById("total-price").innerText = "0.00";
    
    // Optional: Refresh page to clear camera if needed
    // location.reload();
}
