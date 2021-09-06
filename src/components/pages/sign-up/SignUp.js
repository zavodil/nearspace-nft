import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { NearContext } from '~/contexts';

import { HeadingText } from '~/components/common/typography';
import { Button } from '~/components/common/buttons';
import { SeparatorHorizontal } from '~/components/common/separators';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 100px 28px 100px;

  .trouble {
    margin-top: 40px;
  }

  p {
    font-size: 18px;
    line-height: 20px;
  }

  @media (min-width: 767px) {
    padding-top: 0;
    align-items: center;
    justify-content: center;
  }
`;

export default function SignUp() {
  const { signIn, nearContent } = useContext(NearContext);

  const signInAction = () => {
    signIn();
  };

  return (
    <Container>
      <HeadingText>Let’s go</HeadingText>
      <p>Already have a NEAR account?</p>
      <Button isPrimary onClick={() => signInAction()}>
        Connect NEAR Wallet
      </Button>
      <SeparatorHorizontal>OR</SeparatorHorizontal>
      <p>Need a NEAR wallet?</p>
      <Button isPrimary>
        {nearContent?.config?.walletUrl ? (
          <a href={`${nearContent.config.walletUrl}/create`}>Create a NEAR Wallet</a>
        ) : (
          <Link to={'#'}>Create a NEAR Wallet</Link>
        )}
      </Button>
      <p className="trouble">
        Having trouble making a wallet? Email us at <a href="mailto:info@nearspace.info">info@nearspace.info</a>.
      </p>
    </Container>
  );
}
