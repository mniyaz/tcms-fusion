/**
 * DocSidebar Desktop Content with menu search.
 * Filters sidebar items by label as the user types.
 */
import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import {
  useAnnouncementBar,
  useScrollPosition,
} from '@docusaurus/theme-common/internal';
import { translate } from '@docusaurus/Translate';
import DocSidebarItems from '@theme/DocSidebarItems';

import styles from './styles.module.css';

function useShowAnnouncementBar() {
  const { isActive } = useAnnouncementBar();
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(isActive);

  useScrollPosition(
    ({ scrollY }) => {
      if (isActive) {
        setShowAnnouncementBar(scrollY === 0);
      }
    },
    [isActive]
  );
  return isActive && showAnnouncementBar;
}

function getItemLabel(item) {
  if (!item) return '';
  return (item.label || '').toLowerCase();
}

function filterSidebarItemsBySearch(items, query) {
  if (!query || !query.trim()) return items;
  const q = query.trim().toLowerCase();
  return items
    .map((item) => {
      if (item.type === 'category') {
        const filteredChildren = filterSidebarItemsBySearch(item.items || [], query);
        const labelMatches = getItemLabel(item).includes(q);
        if (filteredChildren.length > 0 || labelMatches) {
          return {
            ...item,
            items: filteredChildren.length > 0 ? filteredChildren : (item.items || []),
          };
        }
        return null;
      }
      if (item.type === 'link') {
        return getItemLabel(item).includes(q) ? item : null;
      }
      return item;
    })
    .filter(Boolean);
}

export default function DocSidebarDesktopContent({ path, sidebar, className }) {
  const showAnnouncementBar = useShowAnnouncementBar();
  const [sidebarSearch, setSidebarSearch] = useState('');

  const filteredSidebar = useMemo(
    () => filterSidebarItemsBySearch(sidebar, sidebarSearch),
    [sidebar, sidebarSearch]
  );

  return (
    <nav
      aria-label={translate({
        id: 'theme.docs.sidebar.navAriaLabel',
        message: 'Docs sidebar',
        description: 'The ARIA label for the sidebar navigation',
      })}
      className={clsx(
        'menu thin-scrollbar',
        styles.menu,
        showAnnouncementBar && styles.menuWithAnnouncementBar,
        className
      )}>
      <div className={styles.sidebarSearchWrap}>
        <input
          type="search"
          className={styles.sidebarSearch}
          placeholder={translate({
            id: 'theme.docs.sidebar.searchPlaceholder',
            message: 'Filter menu...',
            description: 'Placeholder for sidebar menu search',
          })}
          aria-label={translate({
            id: 'theme.docs.sidebar.searchAriaLabel',
            message: 'Filter sidebar menu',
            description: 'ARIA label for sidebar search input',
          })}
          value={sidebarSearch}
          onChange={(e) => setSidebarSearch(e.target.value)}
        />
      </div>
      <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
        <DocSidebarItems items={filteredSidebar} activePath={path} level={1} />
      </ul>
    </nav>
  );
}
