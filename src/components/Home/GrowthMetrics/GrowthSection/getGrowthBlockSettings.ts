import { GrowthBlockType } from '../GrowthBlock';
import { GrowthMetricsType, GrowthDataType } from 'context/state';

export type GrowthBlockSettingsType = keyof GrowthMetricsType['metrics'];

const getGrowthBlockSettings = ({
  type,
  data,
}: {
  type: GrowthBlockSettingsType;
  data?: GrowthDataType;
}): GrowthBlockType => {
  if (!data) {
    return {
      title: '',
      value: {
        text: '',
      },
    };
  }

  switch (type) {
    case 'egldUsdPrice':
      return {
        title: 'EGLD / USD Price',
        value: {
          text: data.primaryValue,
          isUsd: true,
        },
        description: {
          text: data.secondaryValue,
          showPercentage: true,
        },
        size: 'sm',
        color: 'primary',
      };
    default:
      return {
        title: '',
        value: {
          text: '',
        },
      };
  }
};

/* <div className="row">

        <GrowthBlock
          title="EGLD / EUR Price"
          value="€145.74"
          description="0.50%"
          size="sm"
          color="primary"
        />
        <GrowthBlock
          title="EGLD / BTC Price"
          value="0.003233"
          description="0.20%"
          size="sm"
          color="warning"
        />
        <GrowthBlock
          title="EGLD / ETH Price"
          value="0.049421"
          description="0.20%"
          size="sm"
          color="primary"
        />
        <GrowthBlock title="All-Time High" value="$258.98" description="09 May 2021" size="sm" />
        <GrowthBlock
          title="Market Capitalization"
          value="$2,842,732,948"
          description="09 May 2021"
          size="sm"
        />

        <GrowthBlock title="24H Change" value="1.53%" size="sm" color="danger" />
        <GrowthBlock title="7-Day Change" value="7.15%" size="sm" color="success" />
        <GrowthBlock title="14-Day Change" value="7.15%" size="sm" color="success" />
        <GrowthBlock title="30-Day Change" value="7.15%" size="sm" color="success" />
        <GrowthBlock title="200-Day Change" value="7.15%" size="sm" color="danger" />
        <GrowthBlock title="1-Year Change" value="7.15%" size="sm" color="success" />
      </div>
      <div className="row">
        <GrowthBlock
          title="24H Exchange Volume"
          value="$258,129,643"
          description="1,720,864 EGLD"
          size="lg"
        />
        <GrowthBlock
          title="24H Exchange Withdraw"
          value="-6,429 EGLD"
          description="$964,350"
          size="lg"
        />
        <GrowthBlock
          title="24H Exchange Deposits"
          value="+3,952 EGLD"
          description="$592,800"
          size="lg"
        />
      </div>
      <div className="row">
        <GrowthBlock
          title="Current EGLD Supply"
          value="19,306,408 EGLD"
          description="$964,350"
          size="md"
        />
        <GrowthBlock title="Locked EGLD" value="11,833,408 EGLD" description="60.12%" size="md" />
        <GrowthBlock
          title="Free Floating EGLD"
          value="7,473,000 EGLD"
          description="39.88%"
          size="md"
        />
        <GrowthBlock title="EGLD Left Per User" value="0.0132 EGLD" description="$1.98" size="md" />
        <GrowthBlock title="Addresses" value="710,363" size="md" />
        <GrowthBlock title="New Addresses" value="+560" size="md" color="primary" />
        <GrowthBlock title="Maiar Users" value="565,234" size="md" />
        <GrowthBlock title="New Maiar Users" value="+149" size="md" color="primary" />
      </div> */

export default getGrowthBlockSettings;
