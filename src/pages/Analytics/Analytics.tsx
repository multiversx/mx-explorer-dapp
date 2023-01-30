import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMainnet } from 'hooks';
import { ChartWrapper } from './components/ChartWrapper';
import { analyticsRoutes } from 'routes';

export const Analytics = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const isMainnet = useIsMainnet();

  if (!isMainnet) {
    navigate('/');
  }

  return (
    <>
      <div ref={ref}>
        <div className='analytics container page-content'>
          <div className='card card-lg card-black'>
            <div className='card-header d-flex align-items-center'>
              <div className='analytics-nav-item'>Key Metrics</div>
              <a
                href={analyticsRoutes.compare}
                className='analytics-nav-item link'
              >
                Compare
              </a>
            </div>

            <div className='card-body d-flex justify-content-between flex-wrap'>
              <ChartWrapper>This is a test</ChartWrapper>
              <ChartWrapper size='half'>This is a test</ChartWrapper>
              <ChartWrapper size='half'>This is a test</ChartWrapper>
              <ChartWrapper size='half'>This is a test</ChartWrapper>
              <ChartWrapper size='half'>This is a test</ChartWrapper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
