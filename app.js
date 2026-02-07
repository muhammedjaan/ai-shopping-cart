<script>
    const products = {
        "6294011607141": { name: "Lulu Yogurt Drink", price: 2.50 },
        "1234567890123": { name: "Test Item", price: 1.00 }
    };

    let cart = [];
    let total = 0;
    let lastScanTime = 0;

    function onScanSuccess(decodedText, decodedResult) {
        const now = new Date().getTime();
        if (now - lastScanTime < 2000) return;
        lastScanTime = now;

        let item = products[decodedText];

        // UPDATED: Now only shows "Unrecognized Item"
        if (!item) {
            item = { name: "Unrecognized Item", price: 4.98 };
        }

        cart.push(item);
        total += item.price;

        const li = document.createElement("li");
        li.innerHTML = `<span>${item.name}</span> <b>$${item.price.toFixed(2)}</b>`;
        document.getElementById("cart-list").prepend(li);
        document.getElementById("total-price").innerText = total.toFixed(2);

        document.getElementById("feedback").innerText = `Added: ${item.name}`;
        document.getElementById("beep").play().catch(e => {});
        
        if (navigator.vibrate) navigator.vibrate(200);

        setTimeout(() => { document.getElementById("feedback").innerText = ""; }, 2000);
    }

    let html5QrcodeScanner = new Html5QrcodeScanner(
        "reader", { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 }, false
    );
    
    html5QrcodeScanner.render(onScanSuccess);

    function checkout() {
        if(cart.length === 0) return alert("Cart is empty");
        alert("Printing Receipt...\nTotal: $" + total.toFixed(2));
        location.reload();
    }
</script>
