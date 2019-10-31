import React from 'react';
import { useGlobalState } from '../../context';

const Footer: React.FC = () => {
  const {
    activeTestnet: { name },
  } = useGlobalState();
  return (
    <footer className="footer">
      <div className="container text-center text-muted">
        <small>
          {name}
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
