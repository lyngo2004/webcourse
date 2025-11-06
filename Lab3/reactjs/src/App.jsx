import React, { useContext } from "react";
import { CartProvider, CartContext } from "./CartContext";

function AppContent() {
  const { cart, addToCart, removeFromCart, total } = useContext(CartContext);

  const products = [
    { id: 1, name: "Laptop", price: 999 },
    { id: 2, name: "Smartphone", price: 699 },
    { id: 3, name: "Headphones", price: 199 },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        border: "1px solid #ccc",
        padding: 20,
        width: 600,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* PRODUCTS */}
      <div style={{ flex: 1, paddingRight: 20 }}>
        <h2 style={{ fontWeight: "bold" }}>Products</h2>
        {products.map((p) => (
          <div key={p.id} style={{ marginBottom: 15 }}>
            <p style={{ marginBottom: 5 }}>
              {p.name} - ${p.price}
            </p>
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* CART */}
      <div style={{ flex: 1, borderLeft: "1px solid #ccc", paddingLeft: 20 }}>
        <h2 style={{ fontWeight: "bold" }}>Cart</h2>
        {cart.length === 0 ? (
          <p>The cart is empty</p>
        ) : (
          <>
            <ul style={{ listStyleType: "disc", paddingLeft: 20 }}>
              {cart.map((item) => (
                <li key={item.id} style={{ marginBottom: 6 }}>
                  {item.name} - ${item.price} x {item.quantity}{" "}
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </li>
              ))}
            </ul>
            <h3>
              <strong>Total: ${total}</strong>
            </h3>
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
