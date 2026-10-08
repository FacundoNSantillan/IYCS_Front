import { useEffect, useState } from 'react';

const CART_KEY = 'cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    return parsed;
  } catch {
    return { items: [] };
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function useCart() {
  const [cart, setCart] = useState(() => loadCart());

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addItem = (product, quantity) => {
  const qty = quantity < 1 ? 1 : quantity;

  setCart(prev => {
    const existingIndex = prev.items.findIndex(
      item => item.productId === product.id
    );

    if (existingIndex !== -1) {
      const items = [...prev.items];

      const stockLimit =
        items[existingIndex].stockQuantity ?? product.stockQuantity ?? Infinity;

      const newQty = items[existingIndex].quantity + qty;

      items[existingIndex] = {
        ...items[existingIndex],
        quantity: newQty > stockLimit ? stockLimit : newQty, 
      };

      return { ...prev, items };
    }

    const stockLimit = product.stockQuantity ?? Infinity;
    const finalQty = qty > stockLimit ? stockLimit : qty;

    return {
      ...prev,
      items: [
        ...prev.items,
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          price: product.price,
          quantity: finalQty,
          stockQuantity: stockLimit, 
        },
      ],
    };
  });
};

  const updateQuantity = (productId, quantity) => {
    const qty = quantity < 1 ? 1 : quantity;

    setCart(prev => {
      const items = prev.items
        .map(item =>
          item.productId === productId ? { ...item, quantity: qty } : item
        )
        .filter(item => item.quantity > 0); 

      return { ...prev, items };
    });
  };

  const removeItem = productId => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.productId !== productId),
    }));
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.items.reduce((acc, item) => acc + (item.price ?? item.currentUnitPrice) * item.quantity , 0);

  return {
    cart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalAmount,
  };
}