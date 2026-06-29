import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';

export function useDataLoader() {
  const { products, setProducts, setActivities, setIsLoadingData } = useStore();

  useEffect(() => {
    async function loadData() {
      // If we already have a large number of products, it means static data is probably loaded.
      // But we always fetch it to be up to date. We just need to make sure we don't wipe custom ones.
      setIsLoadingData(true);
      try {
        const [staticProducts, activities] = await Promise.all([
          api.getStaticProducts(),
          api.getActivities(),
        ]);

        // Keep custom recipes and meals that the user created
        const customProducts = products.filter(
          p => p.id.startsWith('custom_') || p.id.startsWith('recipe_')
        );

        // Combine static products with custom ones
        // We put custom ones first so they appear at the top if needed
        const combinedProducts = [...customProducts, ...staticProducts];

        // Deduplicate by ID just in case
        const uniqueProducts = Array.from(
          new Map(combinedProducts.map((item) => [item.id, item])).values()
        );

        setProducts(uniqueProducts);
        setActivities(activities);
      } catch (error) {
        console.error('Error loading nutritional data:', error);
      } finally {
        setIsLoadingData(false);
      }
    }

    // Only load if we haven't loaded static data yet (assuming static data is large)
    // Custom products might be 1-20 items. Static is thousands.
    if (products.length < 100) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setProducts, setActivities, setIsLoadingData]); // Removed `products` from deps to avoid infinite loops if it changes often
}
