import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DiamondIcon from '../../../assets/DiamondIcon';

const StyledContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;

  .image {
    display: ${({ isImgLoaded }) => (isImgLoaded ? 'inline' : 'none')};
  }

  > svg {
    height: 50px;
    width: 50px;
    filter: drop-shadow(var(--shadow-primary));
    display: ${({ isImgLoaded }) => (isImgLoaded ? 'none' : 'inline')};
  }
`;

const Image = forwardRef(function ImageWithRef({ src, alt }, ref) {
  const [isImgLoaded, setIsImgLoaded] = useState(null);

  const processImgLoaded = () => {
    setIsImgLoaded(true);
  };

  return (
    <StyledContainer isImgLoaded={isImgLoaded}>
      <img ref={ref} src={src} alt={alt} onLoad={processImgLoaded} className="image" />
      <DiamondIcon />
    </StyledContainer>
  );
});

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
};

Image.defaultPtops = {
  alt: 'image',
};

export default Image;