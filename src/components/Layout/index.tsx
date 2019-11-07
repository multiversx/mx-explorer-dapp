import React from 'react';
import Navbar from './Navbar/index';
import Footer from './Footer';
import TestnetRouter from './TestnetRouter';
import RoundManager from './RoundManager';

//TODO: remove form tag from Hero Search

const Layout: React.FC = ({ children }) => (
  <>
    <TestnetRouter />
    <RoundManager />
    <Navbar />
    <main role="main">{children}</main>
    <Footer />
  </>
);

export default Layout;
