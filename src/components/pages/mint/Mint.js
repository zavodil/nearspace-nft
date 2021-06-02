import React, { useContext, useEffect, useState } from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import Big from 'big.js';

import { MarketContractContext, NftContractContext } from '../../../contexts';

import { Page } from '../../../router';
import { MintDescribe, MintUpload, MintReview } from './steps';

import NotFound404 from '../not-found-404';

import APP from '../../../constants/app';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 90px);
  padding: 100px 28px 60px;
`;

export default function Mint() {
  const match = useRouteMatch();
  const [nft, setNft] = useState({ conditions: {} });
  const [isMintAllowed, setIsMintAllowed] = useState(null);
  const { getStoragePaid, getSalesSupplyForOwner, marketContract, minStorage } = useContext(MarketContractContext);
  const { nftContract, getIsFreeMintAvailable } = useContext(NftContractContext);

  const setNftField = (field, value) => {
    setNft((nftOld) => ({ ...nftOld, [field]: value }));
  };

  useEffect(() => {
    if (!APP.USE_STORAGE_FEES) {
      (async () => {
        const is_free_mint_available = await getIsFreeMintAvailable(nftContract.account.accountId);
        setIsMintAllowed(is_free_mint_available);
      })();

      return;
    }

    (async () => {
      if (minStorage) {
        const [storagePaid, salesNumber] = await Promise.all([
          getStoragePaid(marketContract.account.accountId),
          getSalesSupplyForOwner(marketContract.account.accountId),
        ]);

        if (new Big(storagePaid).lte(new Big(minStorage).times(salesNumber))) {
          setIsMintAllowed(false);
        } else {
          setIsMintAllowed(true);
        }
      }
    })();
  }, [minStorage]);

  if (isMintAllowed === false) {
    return (
      <Redirect
        to={{
          pathname: '/mint-not-allowed',
          state: { isMintAllowed },
        }}
      />
    );
  }

  if (isMintAllowed === null) {
    return null;
  }

  return (
    <Container>
      <Switch>
        <Route path={`${match.path}/upload`}>
          <MintUpload
            onUpload={({ imageDataUrl, imageThumbnailDataUrl }) => {
              setNftField('artDataUrl', imageDataUrl);
              setNftField('artThumbnailDataUrl', imageThumbnailDataUrl);
            }}
            onCompleteLink={`${match.path}/review`}
            nft={nft}
          />
        </Route>
        <Route path={`${match.path}/review`}>
          <MintReview nft={nft} backLink={`${match.path}/upload`} />
        </Route>
        <Route exact path={match.path}>
          <MintDescribe onCompleteLink={`${match.path}/upload`} nft={nft} setNft={setNft} setNftField={setNftField} />
        </Route>
        <Page component={NotFound404} />
      </Switch>
    </Container>
  );
}
