import { DetailItem, NodeOnlineState } from 'components';
import { NodeType } from 'types';

// import { PercentageBar } from './components/PercentageBar';
import { RatingArrow } from './components/RatingArrow';
// import { getUptimeDowntime } from './helpers/getUptimeDowntime';

export const NetworkMetrics = ({ node }: { node: NodeType }) => {
  // const { uptimeLabel, downtimeLabel } = getUptimeDowntime(node);

  return (
    <div className='card network-metrics h-100'>
      <div className='card-header'>
        <div className='card-header-item'>
          <h5 className='m-0'>Network Metrics</h5>
        </div>
      </div>

      <div className='card-body'>
        <DetailItem title='Rating' colWidth='3'>
          <div className='d-flex align-items-center h-100'>
            <div className='gradient-bar progress progress-sm w-100'>
              <RatingArrow node={node} showTemp={true} />
              <RatingArrow node={node} />
            </div>
          </div>
        </DetailItem>
        {/* <DetailItem title="Uptime" colWidth="3">
            <PercentageBar
              downtimeLabel={downtimeLabel}
              uptimeLabel={uptimeLabel}
              uptimePercentage={node.uptime ? node.uptime : 0}
              downtimePercentage={node.downtime ? node.downtime : 0}
              tooltipPlacementUp={false}
            />
          </DetailItem> */}

        <DetailItem title='Status' colWidth='3'>
          <NodeOnlineState node={node} />
        </DetailItem>
      </div>
    </div>
  );
};
