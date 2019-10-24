import React from 'react';
import Head from './Head';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = ({ children }) => (
  <>
    <Head />
    <Navbar />
    <main role="main">{children}</main>
    <Footer />
  </>
);

export default Layout;
