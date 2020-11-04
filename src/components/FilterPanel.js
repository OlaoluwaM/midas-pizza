import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';
import PropTypes from 'prop-types';

import { m as motion } from 'framer-motion';
import { filterButtonVariants } from './utils/framer-variants';
import { ReactComponent as Pizza } from '../assets/pizza-slice.svg';
import { ReactComponent as Drink } from '../assets/soda.svg';
import { ReactComponent as Snack } from '../assets/fried-potatoes.svg';
import { ReactComponent as Dessert } from '../assets/ice-cream.svg';

const FilterContainer = styled.div`
  width: 100%;
  height: 7vh;
  margin: 3em 0;
  padding: 0;
`;

const FilterButtonContainer = styled(motion.button).attrs({
  'data-testid': 'filter-button',
  variants: filterButtonVariants,
  initial: 'hidden',
  exit: 'hidden',
  whileHover: 'onHover',
})`
  background: ${({ theme }) => theme.backgroundLighter};
  border-radius: 3px;
  height: 100%;
  width: 15%;
  padding: 0 0 0 1.2em;
  cursor: pointer;
  font-weight: var(--medium);
  margin-right: 15px;
  display: inline-flex;
  align-items: center;

  span {
    font-size: 1.1em;
  }

  svg {
    fill-opacity: inherit;
    width: 18%;
    height: auto;
    margin-right: 10px;
  }

  &:disabled {
    filter: grayscale(1);
    background: ${({ theme }) => hexToRgb(theme.gray, 0.2)};
    pointer-events: none;
  }
`;

export default function FilterPanel({ filterForType, activeFilter, isLoading }) {
  const foodTypes = [
    ['Pizza', Pizza, filterForType.bind(null, 'Pizza')],
    ['Drink', Drink, filterForType.bind(null, 'Drink')],
    ['Dessert', Dessert, filterForType.bind(null, 'Dessert')],
    ['Snack', Snack, filterForType.bind(null, 'Snack')],
  ];

  const inlineStyles = { borderWidth: 1.5, borderStyle: 'solid' };

  return (
    <FilterContainer>
      {foodTypes.map(([type, IconComponent, filterHandler]) => {
        const isActiveFilter = activeFilter === type ? 'active-filter' : '';

        return (
          <FilterButtonContainer
            disabled={isLoading}
            animate={isLoading ? 'visible' : isActiveFilter ? 'active' : 'visible'}
            key={type}
            style={inlineStyles}
            className={isActiveFilter}
            onClick={filterHandler}>
            <IconComponent />
            <span data-testid="food-name">{type}s</span>
          </FilterButtonContainer>
        );
      })}
    </FilterContainer>
  );
}

FilterPanel.propTypes = {
  filterForType: PropTypes.func.isRequired,
  activeFilter: PropTypes.string.isRequired,
};

FilterPanel.whyDidYouRender = true;
