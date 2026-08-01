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
    "acai berry.html": {
        nombre: "Açaí Berry",
        banner: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "ac1", nombre: "Bowl Tradicional", descripcion: "Açaí puro, banana, granolas y miel.", precio: 25000, img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=200" },
            { id: "ac2", nombre: "Berry Explosion", descripcion: "Açaí, frutillas, arándanos y leche condensada.", precio: 30000, img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=200" }
        ]
    },
    "absoluto.html": {
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
    "valhalla.html": {
        nombre: "Valhalla",
        banner: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "v1", nombre: "Valquiria Burger", descripcion: "Medallón de vacío, provoleta y cebolla caramelizada.", precio: 36000, img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200" }
        ]
    },
    "rolling cook.html": {
        nombre: "Rolling Cook",
        banner: "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=600",
        whatsapp: "595982309464",
        productos: [
            { id: "rc1", nombre: "Rolling Burger", descripcion: "Medallón smash, cheddar, pepinillos y aderezo especial.", precio: 28000, img: "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=200" }
        ]
    }
};

// Carrito en memoria (se limpia automáticamente al recargar la página)
let cart = {};

// Obtener la clave del local basándose en el nombre de la página actual
function getCurrentStoreKey() {
    const rawPath = window.location.pathname.split("/").pop().toLowerCase();
    return decodeURIComponent(rawPath);
}

// Renderizar la información del local y sus productos dinámicamente
function initStore() {
    // Limpiamos cualquier rastro viejo en localStorage para asegurar que empiece limpio
    localStorage.removeItem('zori_cart');
    localStorage.removeItem('zori_cart_data');

    const pageName = getCurrentStoreKey();
    const store = database[pageName];

    if (store) {
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

    // Asegurar que el contenedor flotante y modal del carrito existan en el DOM
    crearEstructuraCarritoUI();
    renderCart();
}

// Inyectar elementos visuales del carrito si faltan en el HTML estático
function crearEstructuraCarritoUI() {
    if (!document.getElementById('cartBar')) {
        const cartBarHTML = `
            <div id="cartBar" onclick="abrirModalCarrito()" style="position: fixed; bottom: 20px; right: 20px; background: #25d366; color: white; padding: 12px 20px; border-radius: 50px; font-weight: bold; cursor: pointer; display: none; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 1000; align-items: center; gap: 10px; font-family: 'Poppins', sans-serif;">
                <i class="fa-solid fa-cart-shopping"></i> 
                <span id="cartCount">0</span> • 
                <span id="cartTotal">Gs. 0</span>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cartBarHTML);
    }

    if (!document.getElementById('modalCarritoZori')) {
        const modalHTML = `
            <div id="modalCarritoZori" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: none; justify-content: center; align-items: flex-end; z-index: 2000; font-family: 'Poppins', sans-serif;">
                <div style="background: #222; width: 100%; max-width: 600px; max-height: 80vh; border-top-left-radius: 20px; border-top-right-radius: 20px; padding: 20px; box-sizing: border-box; color: white; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px; margin-bottom: 15px;">
                        <h3 style="margin:0; font-size: 18px;">Tu Carrito</h3>
                        <button onclick="cerrarModalCarrito()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">&times;</button>
                    </div>
                    <div id="listaModalCarrito"></div>
                    <p id="totalModalCarrito" style="font-weight:bold; margin-top:15px; font-size: 16px;"></p>
                    <button onclick="sendWhatsApp()" style="background: #25d366; color: white; border: none; padding: 12px; width: 100%; border-radius: 8px; font-weight: bold; margin-top: 10px; cursor: pointer;">Enviar por WhatsApp</button>
                    <button onclick="cerrarModalCarrito()" style="background: #444; color: white; border: none; padding: 10px; width: 100%; border-radius: 8px; font-weight: bold; margin-top: 8px; cursor: pointer;">Seguir comprando</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
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
    }

    const qtyElement = document.getElementById(`qty-${name}`);
    if (qtyElement) {
        qtyElement.innerText = cart[name] ? cart[name].qty : 0;
    }

    renderCart();
}

// Alias para compatibilidad con botones estáticos (como Absoluto)
function agregarAlCarrito(nombre, precio) {
    updateQty(nombre, precio, 1);
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
        const countElem = document.getElementById('cartCount');
        const totalElem = document.getElementById('cartTotal');
        
        if (countElem) countElem.innerText = `${totalItems} ${totalItems === 1 ? 'pedido' : 'pedidos'}`;
        if (totalElem) totalElem.innerText = `Gs. ${totalPrice.toLocaleString('es-PY')}`;
    } else {
        cartBar.style.display = 'none';
        cerrarModalCarrito();
    }
}

// Abrir Modal del Carrito
function abrirModalCarrito() {
    const modal = document.getElementById('modalCarritoZori');
    const listaDiv = document.getElementById('listaModalCarrito');
    const totalP = document.getElementById('totalModalCarrito');

    if (!modal || !listaDiv) return;

    listaDiv.innerHTML = '';
    let totalPrecio = 0;

    for (let nombre in cart) {
        let item = cart[nombre];
        let subtotal = item.price * item.qty;
        totalPrecio += subtotal;

        listaDiv.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #333; padding-bottom: 8px;">
                <div>
                    <span style="font-weight: 600; font-size: 14px;">${nombre}</span><br>
                    <small style="color: #aaa;">${item.qty} x Gs. ${item.price.toLocaleString('es-PY')} = <strong>Gs. ${subtotal.toLocaleString('es-PY')}</strong></small>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button onclick="updateQty('${nombre}', ${item.price}, -1); abrirModalCarrito();" style="background:#444; color:white; border:none; border-radius:4px; width:28px; height:28px; cursor:pointer; font-weight:bold;">-</button>
                    <span>${item.qty}</span>
                    <button onclick="updateQty('${nombre}', ${item.price}, 1); abrirModalCarrito();" style="background:#ff7300; color:white; border:none; border-radius:4px; width:28px; height:28px; cursor:pointer; font-weight:bold;">+</button>
                </div>
            </div>
        `;
    }

    if (totalP) {
        totalP.innerText = `Total a pagar: Gs. ${totalPrecio.toLocaleString('es-PY')}`;
    }

    modal.style.display = 'flex';
}

// Cerrar Modal
function cerrarModalCarrito() {
    const modal = document.getElementById('modalCarritoZori');
    if (modal) modal.style.display = 'none';
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