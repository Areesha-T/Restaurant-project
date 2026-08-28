import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { QRCodeSVG } from 'qrcode.react';
import './App.css';

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [userRole, setUserRole] = useState('Customer');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newSrc, setNewSrc] = useState('');
  const [newCategory, setNewCategory] = useState('Pizza'); 
  const [cart, setCart] = useState([]); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Single Source of Truth for Categories
  const categories = ['All', 'Pizza', 'Burger', 'BBQ', 'Rice Bowls', 'Seafood', 'Desserts', 'Beverages'];

  const initialMenuItems = [
    { id: '1', name: 'Classic Beef Cheeseburger', price: 750, src: '/burger.glb', category: 'Burger' },
    { id: '2', name: 'Italian Margherita Pizza', price: 1200, src: '/pizza.glb', category: 'Pizza' },
    { id: '3', name: 'Grilled Whole Sea Fish', price: 950, src: '/fish_scan.glb', category: 'Seafood' },
    { id: '4', name: 'Sizzling Mixed BBQ Platter', price: 950, src: '/bbq.glb', category: 'BBQ' },
    { id: '5', name: 'Loaded Chicken Fried Rice', price: 1500, src: '/rice.glb', category: 'Rice Bowls' },
    { id: '6', name: 'Special Combo Meal', price: 1500, src: '/meal.glb', category: 'BBQ' },
    { id: '7', name: 'Traditional Chicken Mandi', price: 1150, src: '/Full_Chicken.glb', category: 'Rice Bowls' },
    { id: '8', name: 'Crispy Fries With Drink', price: 500, src: '/french_fries.glb', category: 'Burger' },
    { id: '9', name: 'Classic Honey Pancakes', price: 800, src: '/pancake.glb', category: 'Desserts' },
    { id: '10', name: 'Creamy Alfredo Pasta', price: 850, src: '/pasta.glb', category: 'Rice Bowls' },
    { id: '11', name: 'Cappuccino', price: 450, src: '/coffee_cup.glb', category: 'Beverages' },
    { id: '12', name: 'Refreshing Soda', price: 350, src: '/drink.glb', category: 'Beverages' }
  ];

  useEffect(() => {
    fetch('https://slick-nails-check.loca.lt/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setMenuItems(data);
        } else {
          setMenuItems(initialMenuItems);
        }
      })
      .catch((err) => {
        console.warn('Backend server connection failed, loading local fallback data.', err);
        setMenuItems(initialMenuItems);
      });
  }, []);

  const handleAddItemSubmit = (e) => {
    e.preventDefault();
    const newItemData = { 
      id: Date.now().toString(),
      name: newName, 
      price: Number(newPrice), 
      src: newSrc,
      category: newCategory 
    };

    fetch('http://localhost:5000/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItemData)
    })
    
      .then((res) => res.json())
      .then((savedItem) => {
        setMenuItems((prevItems) => [...prevItems, savedItem]);
        alert('New Item Added to Database Successfully! 👌');
      })
      .catch(() => {
        setMenuItems((prevItems) => [...prevItems, newItemData]);
        alert('New Item Added (Local Mode)! 👌');
      });

    setNewName('');
    setNewPrice('');
    setNewSrc('');
    setNewCategory('Pizza');
  };

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
    alert(`${item.name} added to cart!`);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  // Robust Normalization Filter (Handles Database Variances)
  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory === 'All') return true;
    
    const selected = selectedCategory.trim().toLowerCase();
    const itemCat = item.category ? item.category.trim().toLowerCase() : '';
    const itemName = item.name ? item.name.trim().toLowerCase() : '';

    // Direct match OR plural/singular loose match (e.g. dessert vs desserts)
    if (itemCat === selected) return true;
    if (itemCat.replace(/s$/, '') === selected.replace(/s$/, '')) return true;
    
    return itemName.includes(selected);
  });

  return (
    <div>
      <Navbar 
        userRole={userRole} 
        setUserRole={setUserRole} 
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {userRole === 'Manager' && (
        <div style={{ padding: '20px' }}>
          <h2> Add New Item</h2>
          <form onSubmit={handleAddItemSubmit}>
            <div>
              <label>Food Name: </label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Item Name" required />
            </div>
            <br />
            <div>
              <label>Price (Rs.): </label>
              <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="Price" required />
            </div>
            <br />
            <div>
              <label>Category: </label>
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <br />
            <div>
              <label>3D Model Path: </label>
              <input type="text" value={newSrc} onChange={(e) => setNewSrc(e.target.value)} placeholder="/burger.glb" required />
            </div>
            <br />
            <button type="submit">Save Item</button>
          </form>
        </div>
      )}

      {userRole === 'Customer' && (
        <div>
          <div style={{ textAlign: 'center', paddingRight: '20px', paddingTop: '10px' }}>
            <button type="button" className="view-cart-btn" onClick={() => setIsCartOpen(true)}>
              🛒 View Cart ({cart.length})
            </button>
          </div>
          
          {isCartOpen && (
            <div className="cart-container">
              <div className="cart-header">
                <h2>🛒 Cart Status</h2>
                <span className="cart-badge">{cart.length} Items</span>
              </div>

              {cart.length === 0 ? (
                <p className="cart-empty-msg">Your cart is empty.</p>
              ) : (
                <div>
                  <div className="cart-items-list">
                    {cart.map((cartItem, index) => (
                      <div key={index} className="cart-item-row">
                        <span className="cart-item-name">{cartItem.name}</span>
                        <strong className="cart-item-price">Rs. {cartItem.price}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="cart-total-row">
                    <span>Total Bill:</span>
                    <span className="cart-total-price">Rs. {totalAmount}</span>
                  </div>
                </div>
              )}

              <div className="cart-actions">
                <button 
                  type="button" 
                  className="btn-submit" 
                  onClick={() => alert('Order Submitted!')}
                  disabled={cart.length === 0}
                > 
                  Submit Order
                </button>

                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setIsCartOpen(false)}
                >
                  Close Cart
                </button>
              </div>
            </div>
          )}

          <div>
            <center>
              <h1>Our Food Menu</h1>
              <h3>📱 Scan with Mobile to View Full Menu in AR</h3>
              <QRCodeSVG value={window.location.href} size={150} />
            </center>
          </div>
          <hr />

          <div className="menu-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', padding: '20px' }}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item._id || item.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', textAlign: 'center', width: '250px' }}>
                  <h2>{item.name}</h2>
                  <p>Rs. {item.price}</p>

                  <model-viewer
                    src={item.src}
                    alt={item.name}
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    auto-rotate
                    style={{ width: '100%', height: '200px' }}
                  ></model-viewer>

                  <button type="button" onClick={() => addToCart(item)} style={{ marginTop: '10px' }}>
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>No items found in <strong>{selectedCategory}</strong> category!</p>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;