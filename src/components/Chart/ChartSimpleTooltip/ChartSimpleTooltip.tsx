import BigNumber from 'bignumber.js';
import moment from 'moment';
import styles from './styles.module.scss';

export const ChartSimpleTooltip = (props: any) => {
  const { payload, active, formatter } = props;

  if (!payload || !active) {
    return null;
  }

  return payload.map((item: any) => (
    <div
      className={styles.tooltip}
      style={{ color: item.color }}
      key={item.value}
    >
      <span className={styles.dot} style={{ background: item.color }} />
      <span className={styles.background} style={{ background: item.color }} />
      <span className={styles.border} style={{ borderColor: item.color }} />

      <div className={styles.wrapper}>
        {item?.payload?.timestamp ? (
          <span className={styles.date}>
            {moment.unix(item.payload.timestamp).utc().format('MMM DD, YYYY')}
          </span>
        ) : (
          ''
        )}
        {formatter ? formatter(item) : new BigNumber(item.value).toFormat()}
      </div>
    </div>
  ));
};
