import React from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Pager: React.FC = () => (
  <div className="float-right">
    <a
      href="{{ prevPage }}"
      className="btn btn-outline-secondary btn-sm"
      ng-class="{disabled: currentPage == 1}"
    >
      <FontAwesomeIcon icon={faChevronLeft} />
    </a>
    <span className="ml-1 mr-1">Page 1</span>
    <a href="{{ nextPage }}" className="btn btn-outline-secondary btn-sm">
      <FontAwesomeIcon icon={faChevronRight} />
    </a>
  </div>
);

export default Pager;
