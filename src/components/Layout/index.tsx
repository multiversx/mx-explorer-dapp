import React from 'react';
import Navbar from './Navbar/index';
import Footer from './Footer';

const Layout: React.FC = ({ children }) => (
  <>
    <Navbar />
    <main role="main">{children}</main>
    <Footer />
  </>
);

export default Layout;
