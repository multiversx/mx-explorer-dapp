import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { NetworkLink } from 'sharedComponents';
import { useNetworkPathname } from 'helpers';

export const MethodList = () => {
  const { search: locationSearch } = useLocation();
  const urlParams = new URLSearchParams(locationSearch);
  const { function: method } = Object.fromEntries(urlParams);
  const networkPathname = useNetworkPathname();

  const methodLink = (method: string) => {
    const { ...rest } = Object.fromEntries(urlParams);

    if (method === '' && rest?.function) {
      delete rest.function;
    }
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(method ? { function: method } : {}),
    }).toString();
    return `${networkPathname}?${nextUrlParams}`;
  };

  if (!method) {
    return null;
  }

  return (
    <div className="card-header-item d-flex justify-content-between align-items-center">
      Method:
      <div className="filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row ml-3 mr-auto">
        <ul className="list-inline m-0">
          {method && (
            <li className="list-inline-item my-1 my-md-0">
              <div className="btn btn-sm btn-light border btn-pill text-capitalize pr-0">
                {method}
                <NetworkLink to={methodLink('')} className="text-body py-2 pl-2 pr-3">
                  ×
                </NetworkLink>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
