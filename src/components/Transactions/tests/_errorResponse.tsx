const response = {
  error: {
    root_cause: [
      {
        type: 'index_not_found_exception',
        reason: 'no such index',
        'resource.type': 'index_or_alias',
        'resource.id': 'transactions',
        index_uuid: '_na_',
        index: 'transactions',
      },
    ],
    type: 'index_not_found_exception',
    reason: 'no such index',
    'resource.type': 'index_or_alias',
    'resource.id': 'transactions',
    index_uuid: '_na_',
    index: 'transactions',
  },
  status: 404,
};

export default response;
