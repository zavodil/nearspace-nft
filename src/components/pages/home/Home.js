import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { NearContext, MarketContractContext, NftContractContext } from '~/contexts';

import { useInfiniteQueryGemsWithBlackList } from '~/hooks';

import { DisplayText } from '~/components/common/typography';
import { Contribute, MintPlus } from '~/components/common/popups';
import { ArtItemPriced } from '~/components/common/art';
import { Button } from '~/components/common/buttons';

import { DiamondIcon } from '~/components/common/icons';

import { QUERY_KEYS, APP } from '~/constants';
import { Loading } from '~/components/common/utils';

import defaultLogo from '~/assets/images/nearspace.png';

const Container = styled('div')`
  padding: 15px;
  max-width: 1200px;
  margin: 100px auto 0;

  .description-container {
    margin-left: 30px;
  }

  .items-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .items {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-evenly;
    }

    .load-more {
      margin-top: 25px;
    }
  }

  .item {
    position: relative;
    transition: 250ms;
    margin: 15px 5px;

    :hover {
      transform: scale(1.01);
    }

    img {
      border-radius: 8px;
      max-width: 100%;

      @media (min-width: 1100px) {
        max-width: 320px;
      }
    }

    button {
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }

  .desc {
    margin-bottom: 20px;
    //font-size: 24px;
    font-weight: 300;
    line-height: 36px;
    color: #61cdd0;
    text-shadow: -2px -1px #192223, 1px 2px #192223, 2px 1px #192223, -1px -2px #192223;
    font-size: 40px;
  }
  
  .hidden {
    display: none;
  }

  .pop-up {
    position: sticky;
    bottom: 10px;
    right: 10px;
    width: fit-content;
    margin-left: auto;
  }

  .no-nfts {
    margin-top: 50px;
    text-align: center;

    .button {
      margin-top: 25px;
    }
  }

  @media (min-width: 767px) {
    .description-container {
      margin-left: 0;
      margin-bottom: 60px;
      text-align: center;
    }
  }
`;

export default function Home() {
  const { user } = useContext(NearContext);
  const { nftContract } = useContext(NftContractContext);
  const { getSalesPopulated, marketContract } = useContext(MarketContractContext);

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQueryGemsWithBlackList(
    QUERY_KEYS.SALES_POPULATED,
    ({ pageParam = 0 }) => getSalesPopulated(String(pageParam), String(APP.MAX_ITEMS_PER_PAGE_HOME)),
    {
      getNextPageParam(lastPage, pages) {
        if (lastPage.length === APP.MAX_ITEMS_PER_PAGE_HOME) {
          return pages.length * APP.MAX_ITEMS_PER_PAGE_HOME;
        }

        return undefined;
      },
      onError() {
        toast.error('Sorry 😢 There was an error getting gems you own.');
      },
      enabled: !!nftContract && !!marketContract,
    }
  );

    let items = data && data?.length ?  (data.map((sale) => {
        return <ArtItemPriced key={sale.token_id} nft={sale} isLink isFromIpfs />
    })) : null;

  return (
    <Container>
      <div className="description-container">
          <img src={defaultLogo} alt="NearSpace" />
        <DisplayText isBig>NEARSPACE NFT</DisplayText>
        <div className="desc">First Composable NFT on NEAR </div>
          {/*<div className="diamond">
          <DiamondIcon />
        </div>*/}
      </div>
      <div className="items-container">
        <div className="items">
          {items}
          {!data?.length && !isFetching && (
            <div className="no-nfts">
                <p>There is nothing here yet.</p>
                <p>Win NFT during out next promotions and put them on sale here. </p>
                {/*
              <Button isPrimary isSmall>
                <Link to="/mint">Mint a Gem</Link>
              </Button>
              */}
            </div>
          )}
        </div>
        {hasNextPage && !isFetching && (
          <Button isPrimary onClick={() => fetchNextPage()} isDisabled={isFetching} className="load-more">
            Load more
          </Button>
        )}
        {isFetching && <Loading />}
      </div>
      <div className="pop-up hidden">{user ? <MintPlus /> : <Contribute />}</div>
    </Container>
  );
}
