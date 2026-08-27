import React, { useState } from 'react';

function Navbar({ userRole, setUserRole, selectedCategory, setSelectedCategory }) {
  const [activeTab, setActiveTab] = useState('HOME');

  const categories = ['All', 'Pizza', 'Burger','BBQ & Grills', 'Rice Bowls', 'Seafood', 'Desserts', 'Beverages'];

  return (
    <div>
      <div className="navbar-top">
        <button  type="button"className="brand-btn" onClick={() => setActiveTab('HOME')}>Restaurant AR</button>
        
        <div className="role-selector">
          <span>View Mode:</span>
          <button 
            type="button" 
            className={userRole === 'Customer' ? 'active' : ''} 
            onClick={() => setUserRole('Customer')}
          >
             Customer Menu
          </button>
          <button 
            type="button" 
            className={userRole === 'Manager' ? 'active' : ''} 
            onClick={() => setUserRole('Manager')}
          >
             Admin Portal
          </button>
        </div>
      </div>

      <div className="categories-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)} 
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {userRole === 'Customer' && (
        <div> 
          <ul>
            <li>
              <button type="button" onClick={() => setActiveTab('HOME')}>Home</button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab('About')}>About</button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab('Contact')}>Contact</button>
            </li>
          </ul>

          {activeTab === 'HOME' && (
            <div> 
              <center>
                <p>21st century Dining Experience</p>
                <h1>Transforming the Dining Experience with Augmented Reality</h1>
                <p>Give your customers an exciting and interactive dining experience with 3D and Augmented Reality food menus that bring your dishes to life.</p>
              </center>
            </div>
          )}
        
          {activeTab === 'About' && (
            <div id="About">
              <h1>Our Story in a brief</h1>
              <div style={{ textAlign: 'left' }}>
                <img src="/pic.png" alt="Story" />
              </div>
        <div>✨ <strong>Realistic 3D Models:</strong> See dish portions & presentation in real-time.</div>
        <div>🚀 <strong>Instant AR Preview:</strong> Place virtual dishes right on your physical table.</div>
        <div>🍽️ <strong>Smarter Ordering:</strong> Order with complete confidence and zero surprises.</div>
            </div>
          )}

          {activeTab === 'Contact' && (
            <div id="Contact">
              <p><strong>Hurry up! Contact us to make your restaurant more attractive for visitors.</strong></p>
              <p>📞 Contact US 033 57937493</p>
              <p>🌐 Write US info@restaurantar.com</p>
            </div>
          )}    
        </div>
      )}
    </div>
  );
}

export default Navbar;