import React from 'react';
import styled from 'styled-components';
import Loading from './Loading';
import MenuItem from './MenuItem';
import hexToRgb from './utils/hexToRgb';
import FilterPanel from './FilterPanel';

import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import { GooeySVGBackground } from './Reusables';
import { UserSessionContext } from './context/context';
import { MenuBlob, MenuBlob2 } from '../assets/Blobs';
import { cartState as cartStateAtom } from './atoms';
import { m as motion, AnimatePresence } from 'framer-motion';
import { menuSectionVariants, headerVariants } from './local-utils/framer-variants';
import { generateFetchOptions, generateUrl, fetchWrapper } from './local-utils/helpers';

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
    display: inline;
    margin: 4em 0 0 0;
    align-self: flex-start;
    position: relative;

    background: ${() => hexToRgb('#FFDBC2', 0.9)};
    line-height: 1.35;

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
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1em 2em;
  flex-grow: 1;
  width: 100%;
  padding-right: 4em;
  padding-left: 0px;
  position: relative;
`;

export default function Menu() {
  const menuStore = React.useRef(null);
  const menuFilter = React.useRef('');

  const { userData } = React.useContext(UserSessionContext);
  const [menuItems, setMenuItems] = React.useState([]);
  const updateCart = useSetRecoilState(cartStateAtom);

  const isLoading = menuItems.length === 0;

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

      const persistedOrder = localStorage.getItem('orderList');

      if (persistedOrder) {
        updateCart(JSON.parse(persistedOrder));
        toast('We saved your order, no need to thank us 😊', { type: 'info' });
      }

      filterHandler('Pizza', menuObjAsArray);
    })();
  }, []);

  console.assert(filterHandler === filterHandler);
  console.log(isLoading);
  console.log(`Current filter is ${menuFilter.current}`);

  return (
    <MenuSection>
      <GooeySVGBackground id="goo" />
      <motion.h1 className="goo" variants={headerVariants}>
        Our Menu
      </motion.h1>

      <MenuBlob />
      <MenuBlob2 />

      <FilterPanel filterForType={filterHandler} activeFilter={menuFilter.current} />

      <AnimatePresence exitBeforeEnter>
        {isLoading && <Loading key="loader-component" />}
        {!isLoading && (
          <MenuContainer key="menu">
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
