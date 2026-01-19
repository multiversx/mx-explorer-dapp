import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { MAX_SEARCH_SUGGESTION_COUNT } from 'appConstants';
import { urlBuilder } from 'helpers';
import { searchSelector } from 'redux/selectors';

import { SearchNodeRow } from './rows/SearchNodeRow';
import { SearchAllResults } from './SearchAllResults';

export const SearchNodes = () => {
  const { search, searchQuery } = useSelector(searchSelector);
  const { node, nodes: searchNodes = [] } = search;

  const nodes = useMemo(() => {
    const merged = [...searchNodes];
    if (node) {
      merged.push(node);
    }

    const unique = [
      ...new Map(merged.map((node) => [node.bls, node])).values()
    ];
    return unique;
  }, [node, searchNodes]);

  if (searchNodes.length === 0 && !node) {
    return null;
  }

  return (
    <div className='search-group search-nodes'>
      <div className='search-category'>
        Nodes<div className='ms-auto'>Status</div>
      </div>
      {nodes.slice(0, MAX_SEARCH_SUGGESTION_COUNT).map((node) => {
        return <SearchNodeRow key={node.bls} node={node} />;
      })}
      {nodes.length > MAX_SEARCH_SUGGESTION_COUNT && (
        <SearchAllResults to={urlBuilder.nodes({ search: searchQuery })}>
          All Nodes
        </SearchAllResults>
      )}
    </div>
  );
};
