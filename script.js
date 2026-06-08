const MENU_PRICES = {
  'Veg momos': 180, 
  'paneer momos': 210, 
  'extra cheese momos': 240,
  'Margarita Pizza': 345, 
  'Paneer Pizza': 395, 
  'Red pepper': 375,
  'Veg Burger': 195, 
  'Paneer Burger': 245, 
  'Korean Burger': 275,
  'Red Sauce Pasta': 295, 
  'White Sauce Pasta': 325, 
  'Veg Cheese Pasta': 345,
  'Basic Fries': 125, 
  'Peri Peri': 145, 
  'Cheese Fries': 185,
  'Iced latte': 165, 
  'Black coffee': 120, 
  'Cold coffee': 150,
  'Ice Cream Selection': 145, 
  'Artisan Tiramisu': 195, 
  'Fudge Brownie': 225,
  'Garlic Bread Platter': 225, 
  'Garden Spring Rolls': 250, 
  'Crispy Cheese Balls': 280,
  'Harvest Rice Bowl': 365, 
  'Classic Lasagna': 395, 
  'Stuffed Veggie Bread combo': 450,
  'Corn & Spinach Simmer': 135, 
  'Fennel Roasted Carrot': 145, 
  'Aromatic Spring Soup': 195
};

let checkoutCart = [];

function loadCartFromStorage() {
    const savedCart = localStorage.getItem("lillique_cart");
    if (savedCart) {
        checkoutCart = JSON.parse(savedCart);
    } else {
        checkoutCart = [];
    }
}

function saveCartToStorage() {
    localStorage.setItem("lillique_cart", JSON.stringify(checkoutCart));
}


function orderItem(itemKey) {
    loadCartFromStorage(); 

    const fixedPrice = MENU_PRICES[itemKey] || 150;
    checkoutCart.push({
        id: Date.now() + Math.random().toString(36).substr(2, 5),
        name: itemKey,
        price: fixedPrice
    });
    
    saveCartToStorage(); 
    updateCartUI();
  
    const drawer = document.getElementById('cart-drawer');
    if (drawer) drawer.classList.add('active');
}

function toggleCart() {
    const drawer = document.getElementById("cart-drawer");
    const page = document.getElementById("page-wrapper");

    if (drawer) drawer.classList.toggle("active");
    if (page) page.classList.toggle("cart-open");
}

function deleteItem(targetId) {
    loadCartFromStorage(); 
    checkoutCart = checkoutCart.filter(item => item.id !== targetId);
    saveCartToStorage();
    updateCartUI();
}

function updateCartUI() {
    const countPill = document.getElementById('cart-pill-count');
    const itemsWrapper = document.getElementById('cart-items-wrapper');
    const totalPriceLabel = document.getElementById('cart-total-price');
    
    if (countPill) countPill.innerText = checkoutCart.length;
    
    let calculatedTotal = checkoutCart.reduce((accum, active) => accum + active.price, 0);
    if (totalPriceLabel) totalPriceLabel.innerText = `₹${calculatedTotal.toFixed(2)}`;
    
    if (!itemsWrapper) return;
    
    itemsWrapper.innerHTML = '';
    
    if (checkoutCart.length === 0) {
        itemsWrapper.innerHTML = `<p class="empty-cart-msg">Your basket is empty.</p>`;
        return;
    }
    
    checkoutCart.forEach(item => {
        const rowNode = document.createElement('div');
        rowNode.className = 'cart-item-node';
        rowNode.innerHTML = `
          <div class="cart-item-meta">
            <h4 style="text-transform: capitalize;">${item.name}</h4>
            <span>₹${item.price.toFixed(2)}</span>
          </div>
          <button class="remove-item-btn" onclick="deleteItem('${item.id}')">Remove</button>
        `;
        itemsWrapper.appendChild(rowNode);
    });
}

function checkoutMock() {
   if (checkoutCart.length === 0) {
        showCustomPopup("Selection Needed", "Please add items to your Cart before proceeding down the order pathway.");
        return;
    }
    
    showCustomPopup("Order placed!", "Thank you for choosing The Lillique! Your order has been placed securely with our kitchen team.✨ ");
    
    checkoutCart = [];
    saveCartToStorage(); 
    updateCartUI();
    toggleCart();
}

function initCartEngine() {
    loadCartFromStorage();
    updateCartUI();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCartEngine);
} else {
    initCartEngine();
}

function showCustomPopup(titleText, bodyMessage) {
    const modalOverlay = document.getElementById('custom-popup-modal');
    const modalTitle = document.getElementById('popup-modal-title');
    const modalMessage = document.getElementById('popup-modal-message');
    
    if (modalOverlay && modalTitle && modalMessage) {
        modalTitle.innerText = titleText;
        modalMessage.innerText = bodyMessage;
        modalOverlay.classList.add('active');
    }
}

function closeCustomPopup() {
    const modalOverlay = document.getElementById('custom-popup-modal');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}
