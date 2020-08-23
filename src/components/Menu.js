import React from 'react';
import styled from 'styled-components';
import Loading from './Loading';
import hexToRgb from './utils/hexToRgb';
import pizzaImage from '../assets/ivan-torres-MQUqbmszGGM-unsplash.jpg';

import { menuVariants } from './local-utils/framer-variants';
import { UserSessionContext } from './context/context';
import { MenuBlob, MenuBlob2 } from '../assets/Blobs';
import { ReactComponent as Pizza } from '../assets/pizza-slice.svg';
import { ReactComponent as Snack } from '../assets/fried-potatoes.svg';
import { ReactComponent as Drink } from '../assets/soda.svg';
import { ReactComponent as Dessert } from '../assets/ice-cream.svg';
import { m as motion, AnimatePresence } from 'framer-motion';
import { generateFetchOptions, generateUrl, fetchWrapper } from './local-utils/helpers';

const {
  menuSectionVariants,
  menuItemVariants,
  headerVariants,
  filterButtonVariants,
} = menuVariants;

// TODO Add Counter functionality

const MenuSection = styled(motion.section).attrs({
  className: 'section-container',
  variants: menuSectionVariants,
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
})`
  padding: 0;
  margin: 0;
  padding-left: 4em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .loader {
    position: relative;
  }

  h1 {
    font-size: 3em;
    font-family: var(--primaryFont);
    font-weight: var(--xXBold);
    display: block;
    margin: 4em 0 0 0;
    align-self: flex-start;
    position: relative;
    padding: 10px;

    &:after {
      content: 'Our';
      position: absolute;
      top: 0;
      z-index: 1;
      color: ${({ theme }) => theme.accentColor};
      bottom: 0;
      left: 0;
      padding: inherit;
      width: 103%;
      background: ${({ theme }) => hexToRgb(theme.baseColor, 0.5)};
      border-radius: 10px;
    }
  }

  .blob {
    width: 50%;
    left: 50%;
    top: 50%;

    &:first-of-type {
      transform: translate(15%, -70%) rotate(-140deg);
    }

    &:nth-of-type(2) {
      width: 50%;
      transform: translate(-120%, -20%);
    }
  }
`;

const MenuContainer = styled.menu`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1em 2em;
  flex-grow: 1;
  width: 100%;
  padding-right: 4em;
  padding-left: 0px;
  position: relative;
`;

const MenuItemContainer = styled(motion.div).attrs({
  variants: menuItemVariants,
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  'data-testid': 'menu-item',
})`
  width: 100%;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  border-radius: 25px;

  img {
    position: absolute;
    top: 0;
    max-width: 100%;
    object-fit: contain;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
    border-radius: inherit;
  }

  .item-info {
    justify-self: flex-end;
    position: relative;
    width: 92%;
    margin-top: 11em;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-radius: inherit;
    background: ${({ theme }) => theme.backgroundLighter};
    padding: 1.3em 1.8em;
    box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.2);

    p,
    h6 {
      margin: 0;
    }

    p {
      font-size: 1.2em;
      font-weight: var(--xXBold);
      font-family: var(--primaryFont);
    }

    h6 {
      margin: 1em 0 -0.8em 0;
      font-weight: var(--medium);
      color: ${({ theme }) => theme.gray};
      font-size: 1.2em;
    }

    .add-to-cart-button {
      box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.2);
      color: ${({ theme }) => theme.background};
      width: max-width;
      border: none;
      background: ${({ theme }) => theme.accentColor};
      border-radius: 20px;
      padding: 1em;
      align-self: flex-end;
      font-size: 1em;
      font-weight: var(--bold);
      font-family: var(--primaryFont);
    }
  }
`;

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
})`
  background: ${({ theme }) => theme.backgroundLighter};
  border-radius: 3px;
  height: 100%;
  outline: rgba(0, 0, 0, 0.2);
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
`;

function FilterPanel({ filterForType, activeFilter }) {
  const foodTypes = [
    ['Pizza', Pizza],
    ['Drink', Drink],
    ['Dessert', Dessert],
    ['Snack', Snack],
  ];

  return (
    <FilterContainer>
      {foodTypes.map(([type, IconComponent]) => {
        const isActiveFilter = activeFilter === type ? 'active-filter' : '';
        const animateVariant = isActiveFilter ? 'active' : 'visible';

        return (
          <FilterButtonContainer
            animate={animateVariant}
            key={type}
            style={{ borderWidth: 1.5, borderStyle: 'solid' }}
            transition={{ delay: 0.4 }}
            className={isActiveFilter}
            onClick={() => filterForType(type)}>
            <IconComponent />
            <span data-testid="food-name">{type}s</span>
          </FilterButtonContainer>
        );
      })}
    </FilterContainer>
  );
}

function AddToCartButton() {
  return (
    <motion.button className="add-to-cart-button">
      <motion.span>Add to cart</motion.span>
    </motion.button>
  );
}

function MenuItem({ menuItemName, price, custom }) {
  const parenthesisRegex = new RegExp(/\((.*?)\)/, 'g');
  const foodType = menuItemName.match(parenthesisRegex)[0].replace(/\W/g, '');

  return (
    <MenuItemContainer custom={custom} data-food-type={foodType}>
      <img src={pizzaImage} alt={`Image for ${menuItemName}`} />
      <motion.div className="item-info">
        <motion.p>{menuItemName}</motion.p>
        <motion.h6>{price}</motion.h6>
        <AddToCartButton />
      </motion.div>
    </MenuItemContainer>
  );
}

export default function Menu() {
  const menuStore = React.useRef(null);
  const menuFilter = React.useRef('');

  const { userData } = React.useContext(UserSessionContext);
  const [menuItems, setMenuItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const filterHandler = (type, data) => {
    const { current = data } = menuStore;

    if (menuFilter.current === type || !current) {
      console.log(`Menu is already filtered for ${type}`);
      return;
    }

    const regex = new RegExp(`${type}s?\\b`);

    menuFilter.current = type;

    setMenuItems(current.filter(item => regex.test(item[0])));
  };

  React.useEffect(() => {
    const currentAccessToken = JSON.parse(localStorage.getItem('currentAccessToken'));

    (async () => {
      const menuData = await fetchWrapper(
        generateUrl(`order/menu?email=${userData.email}`),
        generateFetchOptions('GET', null, currentAccessToken.Id)
      );

      const menuObjAsArray = Object.entries(menuData);
      menuStore.current = menuObjAsArray;

      filterHandler('Pizza', menuObjAsArray);
      setIsLoading(false);
    })();
  }, []);

  console.assert(filterHandler === filterHandler);
  console.log(isLoading);
  console.log(`Current filter is ${menuFilter.current}`);

  return (
    <MenuSection>
      <motion.h1 variants={headerVariants}>Our Menu</motion.h1>
      <MenuBlob />
      <MenuBlob2 />

      <FilterPanel filterForType={filterHandler} activeFilter={menuFilter.current} />

      <AnimatePresence exitBeforeEnter>
        {isLoading && <Loading />}
        {!isLoading && (
          <MenuContainer>
            {menuItems.map(([itemName, price], ind) => (
              <MenuItem key={itemName} menuItemName={itemName} price={price} custom={ind} />
            ))}
          </MenuContainer>
        )}
      </AnimatePresence>
    </MenuSection>
  );
}

Menu.whyDidYouRender = true;
FilterPanel.whyDidYouRender = true;
