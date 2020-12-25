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
  height: 8vh;
  margin: 3em 0;
  padding: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  @media (min-width: 870px) {
    justify-content: flex-start;
  }

  @media (max-width: 870px) {
    height: 7.7vmax;
  }

  @media (orientation: landscape) and (max-width: 870px) {
    height: 9vmax;
  }
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
  width: calc(100% / 6);
  cursor: pointer;
  font-weight: var(--medium);
  display: inline-flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  border: none;
  padding: 0.5% 0.4em;

  span {
    font-size: clamp(0.5rem, 2vmin, 1.1em);
  }

  svg {
    fill-opacity: inherit;
    width: clamp(12px, 17%, 30px);
    height: auto;

    @media (min-width: 870px) {
      margin-right: 15px;
    }
  }

  &:disabled {
    filter: grayscale(1);
    background: ${({ theme }) => hexToRgb(theme.gray, 0.2)};
    pointer-events: none;
  }

  @media (min-width: 870px) {
    flex-direction: row;
    justify-content: center;
    margin-right: 2rem;
    padding: 2.2% 0.4em;

    &:last-of-type {
      margin-right: 0;
    }
  }
`;

export default function FilterPanel({ filterForType, activeFilter, isLoading }) {
  const foodTypes = [
    ['Pizza', Pizza, filterForType.bind(null, 'Pizza')],
    ['Drink', Drink, filterForType.bind(null, 'Drink')],
    ['Dessert', Dessert, filterForType.bind(null, 'Dessert')],
    ['Snack', Snack, filterForType.bind(null, 'Snack')],
  ];

  return (
    <FilterContainer>
      {foodTypes.map(([type, IconComponent, filterHandler]) => {
        const isActiveFilter = activeFilter === type ? 'active-filter' : '';

        return (
          <FilterButtonContainer
            animate={isLoading ? 'visible' : isActiveFilter ? 'active' : 'visible'}
            key={type}
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
