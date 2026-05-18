
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  runTransaction
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { Product, Category, HeroSlide, AdminOrder, HomepageSection } from '../types';
import MOCK_PRODUCTS from '../mockProducts';

// Track if we've encountered a permission error to stop spamming requests
let cloudDisabled = !isFirebaseConfigured;

const LOCAL_KEYS = {
  PRODUCTS: 'craft_data_products',
  CATEGORIES: 'craft_data_categories',
  HERO: 'craft_data_hero',
  ORDERS: 'craft_data_orders',
  SETTINGS: 'craft_data_settings',
  CUSTOM_SECTIONS: 'craft_data_custom_sections'
};

/**
 * Utility to deeply remove undefined values from an object.
 * Firestore does not accept 'undefined' but accepts 'null' or missing keys.
 */
const removeUndefined = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(removeUndefined);
  
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, removeUndefined(v)])
  );
};

const getLocal = <T>(key: string): T | null => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const saveLocal = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// A helper to safely parse the string ID from Firestore into a number
const safeParseId = (id: string): number => {
    const num = parseInt(id, 10);
    return isNaN(num) ? Date.now() + Math.random() : num; // Fallback for non-numeric IDs
}

export const databaseService = {
  getCloudStatus(): 'connected' | 'unconfigured' | 'denied' {
    if (!isFirebaseConfigured) return 'unconfigured';
    if (cloudDisabled) return 'denied';
    return 'connected';
  },

  // --- Settings ---
  async getSettings(): Promise<any | null> {
    if (!cloudDisabled) {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          saveLocal(LOCAL_KEYS.SETTINGS, data);
          return data;
        }
      } catch (error: any) {
        console.warn("Cloud settings fetch failed:", error.message);
      }
    }
    return getLocal(LOCAL_KEYS.SETTINGS);
  },

  async saveSettings(settings: any): Promise<void> {
    saveLocal(LOCAL_KEYS.SETTINGS, settings);
    if (!cloudDisabled) {
      try {
        const docRef = doc(db, 'settings', 'global');
        const cleanedData = removeUndefined({
          ...settings,
          updatedAt: new Date().toISOString()
        });
        await setDoc(docRef, cleanedData, { merge: true });
      } catch (error: any) {
        console.error("Firestore Settings Save Error:", error);
        throw error;
      }
    }
  },

  // --- Products ---
  async getProducts(onUpdate: (products: Product[]) => void): Promise<() => void> {
    if (typeof onUpdate !== 'function') {
      console.error("getProducts was called without a valid onUpdate function.");
      return () => {}; // Return an empty unsubscribe function
    }
    if (cloudDisabled) {
      const localProducts = getLocal<Product[]>(LOCAL_KEYS.PRODUCTS) || [];
      onUpdate(localProducts);
      return () => {}; // Return an empty unsubscribe function
    }

    console.info("Setting up real-time product listener from Firestore...");
    const q = query(collection(db, 'products'), orderBy('id', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const products = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return { ...data, id: safeParseId(docSnap.id) } as Product;
      });
      
      saveLocal(LOCAL_KEYS.PRODUCTS, products);
      console.info(`Successfully synced ${products.length} products from Cloud in real-time.`);
      onUpdate(products);
    }, (error: any) => {
      if (error.code === 'permission-denied' || error.message?.includes('permission')) {
          console.error("Firestore Permission Denied: Ensure your Security Rules allow Read/Write.");
          cloudDisabled = true;
      }
      console.warn("Real-time product updates failed, using local cache:", error.message);
      const localProducts = getLocal<Product[]>(LOCAL_KEYS.PRODUCTS) || [];
      const combinedProducts = [...MOCK_PRODUCTS, ...localProducts];
      const uniqueProducts = Array.from(new Map(combinedProducts.map(p => [p.id, p])).values());
      saveLocal(LOCAL_KEYS.PRODUCTS, uniqueProducts);
      onUpdate(uniqueProducts);
    });

    return unsubscribe; // Return the unsubscribe function to the caller
  },

  async saveProduct(product: Product): Promise<void> {
    console.info(`Preparing to save product: ${product.name} (ID: ${product.id})`);
    
    const products = getLocal<Product[]>(LOCAL_KEYS.PRODUCTS) || [];
    const updated = products.some(p => p.id === product.id) 
      ? products.map(p => p.id === product.id ? product : p)
      : [product, ...products];
    saveLocal(LOCAL_KEYS.PRODUCTS, updated);

    if (!cloudDisabled) {
      try {
        const productRef = doc(db, 'products', String(product.id));
        console.info("Syncing to Firestore...");
        
        const cleanedProduct = removeUndefined({
            ...product,
            updatedAt: new Date().toISOString(),
            variants: product.variants?.map(v => ({
                id: v.id,
                color: v.color || '',
                colorHex: v.colorHex || '#000000',
                imageUrl: v.imageUrl || '',
                size: v.size || '',
                stock: v.stock || 0
            })) || []
        });

        await setDoc(productRef, cleanedProduct, { merge: true });
        console.info("Cloud sync complete!");
      } catch (error: any) {
        console.error("Firestore Save Error:", error);
        if (error.code === 'permission-denied') cloudDisabled = true;
        throw error;
      }
    }
  },

  async deleteProduct(productId: number): Promise<void> {
    const products = (getLocal<Product[]>(LOCAL_KEYS.PRODUCTS) || []).filter(p => p.id !== productId);
    saveLocal(LOCAL_KEYS.PRODUCTS, products);

    if (!cloudDisabled) {
      try {
        await deleteDoc(doc(db, 'products', String(productId)));
      } catch (error: any) {
        if (error.code === 'permission-denied') cloudDisabled = true;
        throw error;
      }
    }
  },

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    if (!cloudDisabled) {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categories = querySnapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return { ...data, id: safeParseId(docSnap.id) } as Category;
        });
        if (categories.length > 0) saveLocal(LOCAL_KEYS.CATEGORIES, categories);
        return categories;
      } catch (error: any) {
        if (error.code === 'permission-denied') cloudDisabled = true;
      }
    }
    return getLocal<Category[]>(LOCAL_KEYS.CATEGORIES) || [];
  },

  async saveCategory(category: Category): Promise<void> {
    const categories = getLocal<Category[]>(LOCAL_KEYS.CATEGORIES) || [];
    const updated = categories.some(c => c.id === category.id)
      ? categories.map(c => c.id === category.id ? category : c)
      : [...categories, category];
    saveLocal(LOCAL_KEYS.CATEGORIES, updated);

    if (!cloudDisabled) {
      try {
        const catRef = doc(db, 'categories', String(category.id));
        await setDoc(catRef, removeUndefined(category), { merge: true });
      } catch (error: any) {
        if (error.code === 'permission-denied') cloudDisabled = true;
        throw error;
      }
    }
  },

  async deleteCategory(categoryId: number): Promise<void> {
    const categories = (getLocal<Category[]>(LOCAL_KEYS.CATEGORIES) || []).filter(c => c.id !== categoryId);
    saveLocal(LOCAL_KEYS.CATEGORIES, categories);

    if (!cloudDisabled) {
      try {
        await deleteDoc(doc(db, 'categories', String(categoryId)));
      } catch (error: any) {
        if (error.code === 'permission-denied') cloudDisabled = true;
      }
    }
  },

  // --- Hero Slides ---
  async getHeroSlides(): Promise<HeroSlide[]> {
    if (!cloudDisabled) {
      try {
        const querySnapshot = await getDocs(collection(db, 'heroSlides'));
        const slides = querySnapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return { ...data, id: safeParseId(docSnap.id) } as HeroSlide;
        });
        if (slides.length > 0) saveLocal(LOCAL_KEYS.HERO, slides);
        return slides;
      } catch (error: any) {
        if (error.code === 'permission-denied') cloudDisabled = true;
      }
    }
    return getLocal<HeroSlide[]>(LOCAL_KEYS.HERO) || [];
  },

  async saveHeroSlide(slide: HeroSlide): Promise<void> {
    const slides = getLocal<HeroSlide[]>(LOCAL_KEYS.HERO) || [];
    const updated = slides.some(s => s.id === slide.id)
      ? slides.map(s => s.id === slide.id ? slide : s)
      : [...slides, slide];
    saveLocal(LOCAL_KEYS.HERO, updated);

    if (!cloudDisabled) {
      try {
        const slideRef = doc(db, 'heroSlides', String(slide.id));
        await setDoc(slideRef, removeUndefined(slide), { merge: true });
      } catch (error: any) {
        if (error.code === 'permission-denied') cloudDisabled = true;
      }
    }
  },

  async deleteHeroSlide(slideId: number): Promise<void> {
    const slides = (getLocal<HeroSlide[]>(LOCAL_KEYS.HERO) || []).filter(s => s.id !== slideId);
    saveLocal(LOCAL_KEYS.HERO, slides);

    if (!cloudDisabled) {
      try {
        await deleteDoc(doc(db, 'heroSlides', String(slideId)));
      } catch (error: any) {
        if (error.code === 'permission-denied') cloudDisabled = true;
      }
    }
  },

  // --- Orders ---
  async getOrders(): Promise<AdminOrder[]> {
    if (!cloudDisabled) {
      try {
        const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as AdminOrder));
        if (orders.length > 0) saveLocal(LOCAL_KEYS.ORDERS, orders);
        return orders;
      } catch (error: any) {
        if (error.code === 'permission-denied') cloudDisabled = true;
      }
    }
    return getLocal<AdminOrder[]>(LOCAL_KEYS.ORDERS) || [];
  },

  async saveOrder(order: AdminOrder): Promise<void> {
    if (cloudDisabled) {
      const orders = getLocal<AdminOrder[]>(LOCAL_KEYS.ORDERS) || [];
      const updated = [order, ...orders.filter(o => o.id !== order.id)];
      saveLocal(LOCAL_KEYS.ORDERS, updated);
      // Note: Stock updates won't happen in local-only mode
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, 'orders', order.id);
        
        // 1. Update stock for each product in the order
        for (const item of order.items) {
          const productRef = doc(db, 'products', String(item.productId));
          const productDoc = await transaction.get(productRef);

          if (!productDoc.exists()) {
            throw new Error(`Product with ID ${item.productId} not found!`);
          }

          const productData = productDoc.data() as Product;
          const newStock = (productData.stock || 0) - item.quantity;

          if (newStock < 0) {
            throw new Error(`Not enough stock for ${productData.name}. Requested ${item.quantity}, but only ${productData.stock} available.`);
          }

          transaction.update(productRef, { stock: newStock });
        }

        // 2. Save the new order
        const cleanedOrder = removeUndefined({ ...order, createdAt: new Date().toISOString() });
        transaction.set(orderRef, cleanedOrder, { merge: true });
      });

      // 3. Update local cache after successful transaction
      const orders = getLocal<AdminOrder[]>(LOCAL_KEYS.ORDERS) || [];
      const updatedOrders = [order, ...orders.filter(o => o.id !== order.id)];
      saveLocal(LOCAL_KEYS.ORDERS, updatedOrders);

    } catch (error: any) {
      console.error("Firestore order transaction failed:", error.message);
      if (error.code === 'permission-denied') cloudDisabled = true;
      throw error; // Re-throw the error to be caught by the calling function
    }
  },

  async deleteOrder(orderId: string): Promise<void> {
    const orders = (getLocal<AdminOrder[]>(LOCAL_KEYS.ORDERS) || []).filter(o => o.id !== orderId);
    saveLocal(LOCAL_KEYS.ORDERS, orders);

    if (!cloudDisabled) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
      } catch (error: any) {
        if (error.code === 'permission-denied') cloudDisabled = true;
        throw error;
      }
    }
  },
  
    // --- Custom Homepage Sections ---
  async getCustomHomepageSections(): Promise<HomepageSection[]> {
    if (!cloudDisabled) {
      try {
        const docRef = doc(db, 'siteContent', 'homepageSections');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const sections = data.sections || [];
          saveLocal(LOCAL_KEYS.CUSTOM_SECTIONS, sections);
          return sections;
        }
      } catch (error: any) {
        console.warn("Cloud homepage sections fetch failed:", error.message);
      }
    }
    return getLocal<HomepageSection[]>(LOCAL_KEYS.CUSTOM_SECTIONS) || [];
  },

  async saveCustomHomepageSections(sections: HomepageSection[]): Promise<void> {
    saveLocal(LOCAL_KEYS.CUSTOM_SECTIONS, sections);
    if (!cloudDisabled) {
      try {
        const docRef = doc(db, 'siteContent', 'homepageSections');
        await setDoc(docRef, { sections: removeUndefined(sections) }, { merge: true });
      } catch (error: any) {
        console.error("Firestore Homepage Sections Save Error:", error);
        throw error;
      }
    }
  }
};
