
    import { useState, useEffect, useRef, useCallback } from 'react';

    export const useInfiniteScroll = (filteredData, itemsPerPage = 8) => {
      const [page, setPage] = useState(1);
      const [displayedItems, setDisplayedItems] = useState([]);
      const [loading, setLoading] = useState(false);
      const [hasMore, setHasMore] = useState(true);
      const observer = useRef();

      // Reset and load initial items when the source data changes (e.g., due to filtering)
      useEffect(() => {
        setPage(1);
        const initialLoad = filteredData.slice(0, itemsPerPage);
        setDisplayedItems(initialLoad);
        setHasMore(initialLoad.length < filteredData.length);
        // Optional: Reset scroll position
        // window.scrollTo(0, 0);
      }, [filteredData, itemsPerPage]);

      // Function to load more items
      const loadMoreItems = useCallback(() => {
        if (loading || !hasMore) return;
        setLoading(true);

        const nextPage = page + 1;
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const nextItems = filteredData.slice(startIndex, endIndex);

        // Simulate network delay if needed, otherwise update state directly
        setTimeout(() => {
          setDisplayedItems(prev => [...prev, ...nextItems]);
          setPage(nextPage);
          setHasMore(endIndex < filteredData.length);
          setLoading(false);
        }, 500); // Adjust delay as needed

      }, [page, loading, hasMore, filteredData, itemsPerPage]);

      // Set up the IntersectionObserver
      const lastItemElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreItems();
          }
        });
        if (node) observer.current.observe(node);
      }, [loading, hasMore, loadMoreItems]);

      return {
        displayedItems,
        loading,
        hasMore,
        lastItemElementRef,
      };
    };
  