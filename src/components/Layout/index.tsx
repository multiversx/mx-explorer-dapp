import React from 'react';
import Navbar from './Navbar/index';
import Footer from './Footer';
import TestnetRouter from './TestnetRouter';

const Layout: React.FC = ({ children }) => (
  <>
    <TestnetRouter />
    <Navbar />
    <main role="main">{children}</main>
    <Footer />
  </>
);

export default Layout;
