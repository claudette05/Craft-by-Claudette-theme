
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc,
  query,
  orderBy,
  disableNetwork
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db, isFirebaseConfigured } from '../firebase';
import { Product, Category, HeroSlide, AdminOrder } from '../types';

let cloudDisabled = !isFirebaseConfigured;

const LOCAL_KEYS = {
  PRODUCTS: 'craft_data_products',
  CATEGORIES: 'craft_data_categories',
  HERO: 'craft_data_hero',
  ORDERS: 'craft_data_orders',
  SETTINGS: 'craft_data_settings'
};

const handleFirestoreError = async (error: any, context: string) => {
    if (error.code === 'permission-denied' || error.message?.includes('permission')) {
        if (!cloudDisabled) {
            console.warn(`Firestore [${context}] Permission Denied. Site is now operating in Local Storage mode.`);
            cloudDisabled = true;
            try {
                // Officially tell the SDK to stop trying to reach the backend
                await disableNetwork(db);
            } catch (e) {
                // Ignore errors disabling network
            }
        }
    } else {
        console.warn(`Firestore [${context}] Error:`, error.message);
    }
};

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

export const databaseService = {
  getCloudStatus(): 'connected' | 'unconfigured' | 'denied' {
    if (!isFirebaseConfigured) return 'unconfigured';
    if (cloudDisabled) return 'denied';
    return 'connected';
  },

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
        await handleFirestoreError(error, 'getSettings');
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
        await handleFirestoreError(error, 'saveSettings');
        throw error;
      }
    }
  },

  async getProducts(): Promise<Product[]> {
    if (!cloudDisabled) {
      try {
        const q = query(collection(db, 'products'), orderBy('id', 'desc'));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => {
            const data = doc.data() as Product;
            return {
                ...data,
                images: Array.isArray(data.images) ? data.images : []
            };
        });
        
        if (products.length > 0) {
            saveLocal(LOCAL_KEYS.PRODUCTS, products);
        }
        return products;
      } catch (error: any) {
        await handleFirestoreError(error, 'getProducts');
      }
    }
    const localProducts = getLocal<Product[]>(LOCAL_KEYS.PRODUCTS) || [];
    return localProducts.map(p => ({ ...p, images: Array.isArray(p.images) ? p.images : [] }));
  },

  async saveProduct(product: Product): Promise<void> {
    const products = getLocal<Product[]>(LOCAL_KEYS.PRODUCTS) || [];
    const updated = products.some(p => p.id === product.id) 
      ? products.map(p => p.id === product.id ? product : p)
      : [product, ...products];
    saveLocal(LOCAL_KEYS.PRODUCTS, updated);

    if (!cloudDisabled) {
      try {
        const productRef = doc(db, 'products', String(product.id));
        const cleanedProduct = removeUndefined({
            ...product,
            updatedAt: new Date().toISOString(),
            images: Array.isArray(product.images) ? product.images : [],
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
      } catch (error: any) {
        await handleFirestoreError(error, 'saveProduct');
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
        await handleFirestoreError(error, 'deleteProduct');
        throw error;
      }
    }
  },

  async getCategories(): Promise<Category[]> {
    if (!cloudDisabled) {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categories = querySnapshot.docs.map(doc => ({ ...doc.data() } as Category));
        if (categories.length > 0) saveLocal(LOCAL_KEYS.CATEGORIES, categories);
        return categories;
      } catch (error: any) {
        await handleFirestoreError(error, 'getCategories');
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
        await handleFirestoreError(error, 'saveCategory');
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
        await handleFirestoreError(error, 'deleteCategory');
      }
    }
  },

  async getHeroSlides(): Promise<HeroSlide[]> {
    if (!cloudDisabled) {
      try {
        const querySnapshot = await getDocs(collection(db, 'heroSlides'));
        const slides = querySnapshot.docs.map(doc => ({ ...doc.data() } as HeroSlide));
        if (slides.length > 0) saveLocal(LOCAL_KEYS.HERO, slides);
        return slides;
      } catch (error: any) {
        await handleFirestoreError(error, 'getHeroSlides');
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
        await handleFirestoreError(error, 'saveHeroSlide');
        throw error;
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
        await handleFirestoreError(error, 'deleteHeroSlide');
      }
    }
  },

  async getOrders(): Promise<AdminOrder[]> {
    if (!cloudDisabled) {
      try {
        const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => ({ ...doc.data() } as AdminOrder));
        if (orders.length > 0) saveLocal(LOCAL_KEYS.ORDERS, orders);
        return orders;
      } catch (error: any) {
        await handleFirestoreError(error, 'getOrders');
      }
    }
    return getLocal<AdminOrder[]>(LOCAL_KEYS.ORDERS) || [];
  },

  async saveOrder(order: AdminOrder): Promise<void> {
    const orders = getLocal<AdminOrder[]>(LOCAL_KEYS.ORDERS) || [];
    const updated = [order, ...orders.filter(o => o.id !== order.id)];
    saveLocal(LOCAL_KEYS.ORDERS, updated);

    if (!cloudDisabled) {
      try {
        const orderRef = doc(db, 'orders', order.id);
        const cleanedOrder = removeUndefined({
            ...order,
            createdAt: new Date().toISOString()
        });
        await setDoc(orderRef, cleanedOrder, { merge: true });
      } catch (error: any) {
        await handleFirestoreError(error, 'saveOrder');
      }
    }
  }
};
