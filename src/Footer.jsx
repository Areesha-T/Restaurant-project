import React from 'react';
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        
        <div className="footer-col brand-col">
          <h2>RestaurantAR</h2>
          <p>
            Restaurant AR digitizes your restaurant's menu, allowing
            customers to view dishes in 3D and augmented reality
          </p>
        </div>

        {/* Column 2: Company Links */}
        <div className="footer-col">
          <h3>Company</h3>
          <ul className="footer-links">
            <li>About</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Column 3: Product Links */}
        <div className="footer-col">
          <h3>Product</h3>
          <ul className="footer-links">
            <li>Restaurant AR SDK</li>
            <li>RestaurantAR Scan</li>
          </ul>
        </div>
      </div>

      <hr className="footer-divider" />

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© Allrights reserved by <strong>RestaurantAR</strong></p>
        <button className="scroll-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;