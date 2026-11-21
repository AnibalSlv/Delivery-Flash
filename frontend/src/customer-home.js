const cart = new Map();
const productCards = document.querySelectorAll(".store-product-card");
const cartPanel = document.getElementById("cart-panel");
const cartBackdrop = document.getElementById("cart-backdrop");
const openCartButton = document.getElementById("open-cart");
const cartView = document.getElementById("cart-view");
const checkoutView = document.getElementById("checkout-view");
const checkoutButton = document.getElementById("checkout-button");
const backToCartButton = document.getElementById("back-to-cart");
const checkoutForm = document.getElementById("checkout-form");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutMessage = document.getElementById("checkout-message");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTitleCount = document.getElementById("cart-title-count");
const cartSubtotal = document.getElementById("cart-subtotal");
const closeCartButton = document.getElementById("close-cart");
const searchInput = document.getElementById("product-search");
const noProductsMessage = document.getElementById("no-products");

const moneyFormat = new Intl.NumberFormat("es-US", {
    style: "currency",
    currency: "USD",
});

function openCart() {
    showCartView();
    cartPanel.hidden = false;
    cartBackdrop.hidden = false;
    openCartButton.setAttribute("aria-expanded", "true");
    closeCartButton.focus();
}

function closeCart() {
    cartPanel.hidden = true;
    cartBackdrop.hidden = true;
    openCartButton.setAttribute("aria-expanded", "false");
    openCartButton.focus();
}

function showCartView() {
    cartView.hidden = false;
    checkoutView.hidden = true;
    checkoutMessage.hidden = true;
}

function showCheckoutView() {
    cartView.hidden = true;
    checkoutView.hidden = false;
    checkoutTotal.textContent = cartSubtotal.textContent;
    checkoutForm.elements.namedItem("name").focus();
}

function renderCart() {
    const products = Array.from(cart.values());
    const itemCount = products.reduce((total, product) => total + product.quantity, 0);
    const subtotal = products.reduce((total, product) => total + product.price * product.quantity, 0);

    cartCount.textContent = itemCount;
    cartTitleCount.textContent = `(${itemCount})`;
    cartSubtotal.textContent = moneyFormat.format(subtotal);
    checkoutTotal.textContent = cartSubtotal.textContent;
    checkoutButton.disabled = itemCount === 0;
    cartItems.replaceChildren();

    if (products.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "cart-empty";
        emptyMessage.textContent = "Tu carrito está vacío. Agrega algo rico para empezar.";
        cartItems.append(emptyMessage);
        return;
    }

    products.forEach((product) => {
        const item = document.createElement("article");
        item.className = "cart-item";

        const icon = document.createElement("span");
        icon.className = "cart-item-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = product.icon;

        const details = document.createElement("div");
        details.className = "cart-item-details";

        const name = document.createElement("strong");
        name.textContent = product.name;

        const category = document.createElement("span");
        category.textContent = product.category;

        const price = document.createElement("b");
        price.textContent = moneyFormat.format(product.price * product.quantity);

        const controls = document.createElement("div");
        controls.className = "cart-item-controls";

        const decrease = document.createElement("button");
        decrease.type = "button";
        decrease.textContent = "−";
        decrease.setAttribute("aria-label", `Quitar una unidad de ${product.name}`);
        decrease.addEventListener("click", () => changeQuantity(product.name, -1));

        const quantity = document.createElement("span");
        quantity.textContent = product.quantity;

        const increase = document.createElement("button");
        increase.type = "button";
        increase.textContent = "+";
        increase.setAttribute("aria-label", `Agregar una unidad de ${product.name}`);
        increase.addEventListener("click", () => changeQuantity(product.name, 1));

        const remove = document.createElement("button");
        remove.className = "cart-item-remove";
        remove.type = "button";
        remove.textContent = "Quitar";
        remove.addEventListener("click", () => {
            cart.delete(product.name);
            renderCart();
        });

        controls.append(decrease, quantity, increase);
        details.append(name, category, price, controls);
        item.append(icon, details, remove);
        cartItems.append(item);
    });
}

function changeQuantity(name, amount) {
    const product = cart.get(name);
    if (!product) return;

    product.quantity += amount;
    if (product.quantity <= 0) {
        cart.delete(name);
    }
    renderCart();
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".store-product-card");
        const name = card.dataset.name;
        const product = cart.get(name);

        if (product) {
            product.quantity += 1;
        } else {
            cart.set(name, {
                name,
                category: card.dataset.category,
                price: Number(card.dataset.price),
                icon: card.dataset.icon,
                quantity: 1,
            });
        }

        renderCart();
        openCart();
    });
});

openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
checkoutButton.addEventListener("click", showCheckoutView);
backToCartButton.addEventListener("click", () => {
    showCartView();
    checkoutButton.focus();
});

checkoutForm.addEventListener("input", () => {
    checkoutMessage.hidden = true;
});

checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    checkoutMessage.hidden = false;
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !cartPanel.hidden) {
        closeCart();
    }
});

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let visibleProducts = 0;

    productCards.forEach((card) => {
        const matches = `${card.dataset.name} ${card.dataset.category}`
            .toLocaleLowerCase()
            .includes(query);
        card.hidden = !matches;
        if (matches) visibleProducts += 1;
    });

    noProductsMessage.hidden = visibleProducts > 0;
});

renderCart();
