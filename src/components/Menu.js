import React from 'react';
import styled from 'styled-components';
import Loading from './Loading';
import MenuItem from './MenuItem';
import hexToRgb from './utils/hexToRgb';
import FilterPanel from './FilterPanel';

import { GooeySVGBackground } from './Reusables';
import { UserSessionContext } from './context/context';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Blob3 as MenuBlob, Blob4 as MenuBlob2 } from '../assets/Blobs';
import { defaultPageTransitionVariants2, headerVariants } from './utils/framer-variants';
import { generateFetchOptions, generateUrl, fetchWrapper, saveOrder } from './utils/helpers';

const MenuSection = styled(motion.section).attrs({
  className: 'section-container',
  variants: defaultPageTransitionVariants2,
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
})`
  padding: 0;
  margin: 0;
  padding-left: 3em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  transition: filter 0.3s ease;

  .loader {
    position: relative;
  }

  h1 {
    font-size: 3em;
    font-family: var(--primaryFont);
    font-weight: var(--xXBold);
    display: inline;
    margin: 4em 0 0 0;
    align-self: flex-start;
    position: relative;

    background: ${() => hexToRgb('#FFDBC2', 0.9)};
    line-height: 1.35;

    /* &:after {
      content: 'Our';
      position: absolute;
      top: 1;
      z-index: 1;
      color: ${({ theme }) => theme.backgroundLighter};
      bottom: 1;
      left: 1;
      padding: inherit;
    } */
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
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1em 2em;
  flex-grow: 1;
  width: 100%;
  padding-right: 2em;
  padding-left: 0px;
  position: relative;
`;

export default function Menu() {
  const menuStore = React.useRef(null);
  const menuFilter = React.useRef('');

  const { userData } = React.useContext(UserSessionContext);
  const [menuItems, setMenuItems] = React.useState([]);

  const isLoading = menuItems.length === 0;

  const filterHandler = (type, data) => {
    const { current = data } = menuStore;

    if (menuFilter.current === type || !current) {
      console.log(`Menu is already filtered for ${type}`);
      return;
    }

    menuFilter.current = type;

    setMenuItems(current.filter(({ 1: itemData }) => itemData.type === type));
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
    })();

    return () => {
      (async () => {
        const { currentCart, prevCart } = {
          currentCart: localStorage.getItem('storedCart'),
          prevCart: localStorage.getItem('prevStoredCart'),
        };

        if (!currentCart || prevCart === currentCart) return;

        await saveOrder(userData.email, JSON.parse(currentCart), currentAccessToken.Id);
        console.log('Order saved!');
      })();
    };
  }, []);

  console.log(`Current filter is ${menuFilter.current}`);

  return (
    <MenuSection>
      <GooeySVGBackground id="goo" />
      <motion.h1 className="goo" variants={headerVariants}>
        Menu
      </motion.h1>

      <MenuBlob className="blob" />
      <MenuBlob2 className="blob" />

      <FilterPanel
        filterForType={filterHandler}
        activeFilter={menuFilter.current}
        isLoading={isLoading}
      />

      <AnimatePresence exitBeforeEnter>
        {isLoading ? (
          <Loading key="loader-component" />
        ) : (
          <MenuContainer key="menu">
            {menuItems.map(({ 0: itemName, 1: { initialPrice: price, type } }, ind) => (
              <MenuItem
                key={itemName}
                itemName={itemName}
                price={price}
                foodType={type}
                custom={ind}
              />
            ))}
          </MenuContainer>
        )}
      </AnimatePresence>
    </MenuSection>
  );
}

Menu.whyDidYouRender = true;
