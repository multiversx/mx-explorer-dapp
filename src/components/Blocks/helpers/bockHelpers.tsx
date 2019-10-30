// export default function getBlocks(response: Object) {
//     const { hits } = response.data;
//     const blocks = hits.hits.map(block => block._source);

//     let min = blocks[0].nonce;
//     let max = min;
//     for (let block in blocks) {
//       if (blocks[block].nonce < min)
//         min = blocks[block].nonce;

//       if (blocks[block].nonce > max)
//         max = blocks[block].nonce;
//     }

//     const startBlockNr = min;
//     const endBlockNr = max;
//     return {
//       blocks,
//       startBlockNr,
//       endBlockNr
//     };
//   }

export default {};
