/**
 * Doc path segments that require authentication.
 * Sidebar will hide these when the user is not signed in.
 * Add more slugs here to gate additional docs.
 */
export const AUTH_ONLY_DOC_SLUGS = [
  'preferences-storage-and-save-api',
  'netlify-env-cli',
  'hygraph-docs-users',
];

export function isAuthOnlyDocItem(item) {
  if (item.type === 'link' && item.href) {
    return AUTH_ONLY_DOC_SLUGS.some((slug) => item.href.includes(slug));
  }
  if (item.type === 'category' && item.items) {
    return item.items.some((child) => isAuthOnlyDocItem(child));
  }
  return false;
}

export function filterSidebarItemsForAuth(items, isAuthenticated) {
  if (isAuthenticated) return items;
  return items
    .map((item) => {
      if (item.type === 'category' && item.items) {
        const filtered = filterSidebarItemsForAuth(item.items, isAuthenticated);
        if (filtered.length === 0) return null;
        return { ...item, items: filtered };
      }
      return item;
    })
    .filter((item) => {
      if (item == null) return false;
      if (isAuthOnlyDocItem(item)) return false;
      return true;
    });
}
