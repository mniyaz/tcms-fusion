import React, { memo, useMemo } from 'react';
import {
  DocSidebarItemsExpandedStateProvider,
  useVisibleSidebarItems,
} from '@docusaurus/plugin-content-docs/client';
import DocSidebarItem from '@theme/DocSidebarItem';
import { useAuth } from '../../context/AuthContext';
import { filterSidebarItemsForAuth } from '../../utils/authOnlyDocs';

function DocSidebarItems({ items, ...props }) {
  const { isAuthenticated } = useAuth();
  const filteredItems = useMemo(
    () => filterSidebarItemsForAuth(items, isAuthenticated),
    [items, isAuthenticated]
  );
  const visibleItems = useVisibleSidebarItems(filteredItems, props.activePath);
  return (
    <DocSidebarItemsExpandedStateProvider>
      {visibleItems.map((item, index) => (
        <DocSidebarItem key={index} item={item} index={index} {...props} />
      ))}
    </DocSidebarItemsExpandedStateProvider>
  );
}

export default memo(DocSidebarItems);
