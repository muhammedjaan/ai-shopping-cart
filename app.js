function onScanSuccess(decodedText, decodedResult) {
    const now = new Date().getTime();
    if (now - lastScanTime < 2500) return; 
    lastScanTime = now;

    const feedback = document.getElementById("feedback");
    const item = products[decodedText];

    // --- THE GUARD CLAUSE ---
    if (!item) {
        // 1. Show the error message
        feedback.innerText = "Unrecognized Item - Not Added";
        feedback.style.color = "red";
        
        // 2. Play error vibration
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

        // 3. STOP EVERYTHING. Do not pass this line.
        console.log("Access Denied for barcode:", decodedText);
        
        // Clear message after 2.5s and EXIT
        setTimeout(() => { feedback.innerText = ""; }, 2500);
        return; 
    }

    // --- ONLY RECOGNIZED ITEMS REACH THIS PART ---
    cart.push(item);
    total += item.price;

    const list = document.getElementById("cart-list");
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.name}</span> <b>$${item.price.toFixed(2)}</b>`;
    list.prepend(li);

    document.getElementById("total-price").innerText = total.toFixed(2);

    feedback.innerText = `Added: ${item.name}`;
    feedback.style.color = "green";
    
    const beep = document.getElementById("beep");
    if (beep) { beep.currentTime = 0; beep.play().catch(e => {}); }
    if (navigator.vibrate) navigator.vibrate(200);

    setTimeout(() => { feedback.innerText = ""; }, 2500);
}
