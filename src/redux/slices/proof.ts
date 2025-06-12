import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProofSliceType } from 'types/proofs.types';

export const getInitialProofState = (): ProofSliceType => {
  return {
    proofState: {
      identifier: '',
      name: '',
      nonce: 0
    },
    isFetched: false
  };
};

export const proofSlice = createSlice({
  name: 'proofSlice',
  initialState: getInitialProofState(),
  reducers: {
    setProof: (
      state: ProofSliceType,
      action: PayloadAction<ProofSliceType>
    ) => {
      state.isFetched = action.payload.isFetched;
      state.proofState = {
        ...getInitialProofState().proofState,
        ...action.payload.proofState
      };
    }
  }
});

export const { setProof } = proofSlice.actions;

export const proofReducer = proofSlice.reducer;
