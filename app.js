// 1. Your Database
const products = {
    "6294011607141": { name: "Lulu Yogurt Drink", price: 2.50 },
    "1234567890123": { name: "Test Item", price: 1.00 }
};

let cart = [];
let total = 0;
let lastScanTime = 0;

function onScanSuccess(decodedText, decodedResult) {
    const now = new Date().getTime();
    if (now - lastScanTime < 2500) return; 
    lastScanTime = now;

    const feedback = document.getElementById("feedback");
    const item = products[decodedText];

    // --- THE FORK IN THE ROAD ---
    if (!item) {
        // PATH A: UNRECOGNIZED
        console.log("Unknown Item Detected. Not adding to cart.");
        
        feedback.innerText = "Unrecognized Item - Not Added";
        feedback.style.color = "red";
        
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

        // We stop here and clear the message later
        setTimeout(() => { feedback.innerText = ""; }, 2500);

    } else {
        // PATH B: RECOGNIZED (Only this path adds to cart)
        console.log("Product Found: " + item.name);

        // 1. Add to Data
        cart.push(item);
        total += item.price;

        // 2. Update UI List
        const list = document.getElementById("cart-list");
        const li = document.createElement("li");
        li.innerHTML = `<span>${item.name}</span> <b>$${item.price.toFixed(2)}</b>`;
        list.prepend(li);

        // 3. Update Total
        document.getElementById("total-price").innerText = total.toFixed(2);

        // 4. Success Feedback
        feedback.innerText = `Added: ${item.name}`;
        feedback.style.color = "green";
        
        const beep = document.getElementById("beep");
        if (beep) { beep.currentTime = 0; beep.play().catch(e => {}); }
        if (navigator.vibrate) navigator.vibrate(200);

        setTimeout(() => { feedback.innerText = ""; }, 2500);
    }
}

// Initialize Scanner
let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 15, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 }, false
);
html5QrcodeScanner.render(onScanSuccess);

// Checkout Logic
function checkout() {
    if (cart.length === 0) return alert("Your basket is empty!");
    alert(`--- RECEIPT ---\nTotal: $${total.toFixed(2)}`);
    location.reload(); 
}
