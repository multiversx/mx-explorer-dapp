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
  const ratingHistory: any = {};
  historicRatings.forEach(({ _id, _source }) => {
    const epoch = _id.split('_').pop();
    _source.validatorsRating.forEach(({ publicKey, rating }) => {
      if (!(publicKey in ratingHistory)) {
        ratingHistory[publicKey] = [];
      }
      ratingHistory[publicKey].push({
        epoch: parseInt(String(epoch)),
        rating,
      });
      ratingHistory[publicKey].sort((a: any, b: any) => a.epoch - b.epoch);
    });
  });

  return ratingHistory;
}
