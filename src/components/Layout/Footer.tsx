import React from 'react';

const Footer: React.FC = () => {
  const activeNetworkName: string = 'TODO';
  return (
    <footer className="footer">
      <div className="container text-center text-muted">
        <small>
          {activeNetworkName}
          &nbsp; • &nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://elrond.com/">
            &copy; Elrond Network
          </a>
        </small>
      </div>
    </footer>
  );
};

export default Footer;
