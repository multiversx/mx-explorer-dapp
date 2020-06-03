interface HistoricRatingType {
  _id: string;
  _source: {
    validatorsRating: Array<{
      publicKey: string;
      rating: number;
    }>;
  };
}

export default function processHistoricRatings(historicRatings: HistoricRatingType[]) {
  const allShards = historicRatings
    .map(r => r._id.split('_')[0])
    // unique
    .filter((v, i, a) => a.indexOf(v) === i);

  const historicData = {};
  //   allShards.forEach(shard => {
  //       const unique
  //   })

  return 0;
}
