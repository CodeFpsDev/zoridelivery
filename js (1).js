// js.js - Proyecto Zory App

// Base de Datos de los locales con su número oficial unificado
const database = {
    "burgerland.html": {
        nombre: "Burgerland",
        banner: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "b1", nombre: "Cheddar Burger", descripcion: "Doble carne, cheddar y aderezo especial.", precio: 5500, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200" },
            { id: "b2", nombre: "Bacon Monster", descripcion: "Triple carne, triple cheddar y mucha panceta.", precio: 6800, img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200" }
        ]
    },
    "Acai berry.html": {
        nombre: "Açaí Berry",
        banner: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "ac1", nombre: "Bowl Tradicional", descripcion: "Açaí puro, banana, granolas y miel.", precio: 25000, img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=200" },
            { id: "ac2", nombre: "Berry Explosion", descripcion: "Açaí, frutillas, arándanos y leche condensada.", precio: 30000, img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=200" }
        ]
    },
    "Absoluto.html": {
        nombre: "Absoluto",
        banner: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "abs1", nombre: "Pizza Mozzarella", descripcion: "Salsa casera, abundante mozzarella y orégano.", precio: 40000, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200" }
        ]
    },
    "home burger.html": {
        nombre: "Home Burger",
        banner: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "hb1", nombre: "Home Classic", descripcion: "Carne casera, queso mozzarella, lechuga y tomate.", precio: 26000, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200" }
        ]
    },
    "Valhalla.html": {
        nombre: "Valhalla",
        banner: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "v1", nombre: "Valquiria Burger", descripcion: "Medallón de vacío, provoleta y cebolla caramelizada.", precio: 36000, img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200" }
        ]
    },
    "Rolling Cook.html": {
        nombre: "Rolling Cook",
        banner: "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "rc1", nombre: "Rolling Burger", descripcion: "Medallón smash, cheddar, pepinillos y aderezo especial.", precio: 28000, img: "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=200" }
        ]
    }
};

// Carrito global
let cart = {};

// Obtener la clave del local basándose en el nombre de la página actual
function getCurrentStoreKey() {
    const rawPath = window.location.pathname.split("/").pop();
    return decodeURIComponent(rawPath);
}

// Renderizar la información del local y sus productos dinámicamente
function initStore() {
    const pageName = getCurrentStoreKey();
    const store = database[pageName];

    if (!store) return; // Si la página es index.html u otra sin catálogo dinámico

    // Actualizar Banner/Título si existen los elementos
    const titleElem = document.getElementById('storeTitle');
    if (titleElem) titleElem.innerText = store.nombre;

    const bannerElem = document.getElementById('storeBanner');
    if (bannerElem && store.banner) bannerElem.src = store.banner;

    // Renderizar lista de productos si existe el contenedor 'menuContainer'
    const menuContainer = document.getElementById('menuContainer');
    if (menuContainer && store.productos) {
        let html = '';
        store.productos.forEach(prod => {
            const qty = cart[prod.nombre] ? cart[prod.nombre].qty : 0;
            html += `
                <div class="item">
                    <img src="${prod.img}" alt="${prod.nombre}" class="item-img" />
                    <div class="item-info">
                        <div class="item-title">${prod.nombre}</div>
                        <div class="item-desc">${prod.descripcion}</div>
                        <div class="item-price">Gs. ${prod.precio.toLocaleString('es-PY')}</div>
                    </div>
                    <div class="controls">
                        <button class="btn-qty" onclick="updateQty('${prod.nombre}', ${prod.precio}, -1)">-</button>
                        <span class="qty-count" id="qty-${prod.nombre}">${qty}</span>
                        <button class="btn-qty" onclick="updateQty('${prod.nombre}', ${prod.precio}, 1)">+</button>
                    </div>
                </div>
            `;
        });
        menuContainer.innerHTML = html;
    }
}

// Modificar cantidades en el carrito
function updateQty(name, price, change) {
    if (!cart[name]) {
        cart[name] = { price: price, qty: 0 };
    }

    cart[name].qty += change;

    if (cart[name].qty <= 0) {
        delete cart[name];
        const qtyElement = document.getElementById(`qty-${name}`);
        if (qtyElement) qtyElement.innerText = 0;
    } else {
        const qtyElement = document.getElementById(`qty-${name}`);
        if (qtyElement) qtyElement.innerText = cart[name].qty;
    }

    renderCart();
}

// Renderizar estado del carrito flotante
function renderCart() {
    let totalItems = 0;
    let totalPrice = 0;

    for (let item in cart) {
        totalItems += cart[item].qty;
        totalPrice += cart[item].qty * cart[item].price;
    }

    const cartBar = document.getElementById('cartBar');
    if (!cartBar) return;

    if (totalItems > 0) {
        cartBar.style.display = 'flex';
        document.getElementById('cartCount').innerText = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
        document.getElementById('cartTotal').innerText = `Gs. ${totalPrice.toLocaleString('es-PY')}`;
    } else {
        cartBar.style.display = 'none';
    }
}

// Enviar pedido mediante WhatsApp
function sendWhatsApp() {
    const pageName = getCurrentStoreKey();
    const store = database[pageName] || { nombre: document.title, whatsapp: "595982309464" };

    let message = `¡Hola *${store.nombre}*! 👋 Quisiera realizar el siguiente pedido:\n\n`;
    let totalPrice = 0;

    for (let item in cart) {
        let itemTotal = cart[item].qty * cart[item].price;
        totalPrice += itemTotal;
        message += `▪ *${cart[item].qty}x* ${item} - Gs. ${itemTotal.toLocaleString('es-PY')}\n`;
    }

    message += `\n*Total a pagar:* Gs. ${totalPrice.toLocaleString('es-PY')}\n\n`;
    message += "¿Me confirman el tiempo estimado de entrega? ¡Gracias!";

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${store.whatsapp}?text=${encodedMessage}`, '_blank');
}

// Cargar tienda al iniciar la página
document.addEventListener('DOMContentLoaded', initStore);