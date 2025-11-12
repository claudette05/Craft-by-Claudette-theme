
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product, Category, HeroSlide, HomepageSections } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyALMO0s9a_SwsGpjKilVDQfqn5dPQAnIyE",
  authDomain: "craft-by-claudette-04120-158b5.firebaseapp.com",
  projectId: "craft-by-claudette-04120-158b5",
  storageBucket: "craft-by-claudette-04120-158b5.firebasestorage.app",
  messagingSenderId: "238977292587",
  appId: "1:238977292587:web:6b415ab9dc372309bd0d6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Product Functions
export const getProducts = async (): Promise<Product[]> => {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Product[];
    return productList;
};

export const getProduct = async (id: string): Promise<Product | null> => {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
        return { ...productSnap.data(), id: productSnap.id } as Product;
    } else {
        return null;
    }
};

export const saveProduct = async (productData: Product, imageFile?: File): Promise<Product> => {
    let imageUrl = productData.imageUrl;
    if (imageFile) {
        const storageRef = ref(storage, `products/${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
    }

    const productToSave = { ...productData, imageUrl };

    if (productData.id) {
        const productRef = doc(db, 'products', productData.id as string);
        await updateDoc(productRef, productToSave);
        return { ...productToSave, id: productData.id };
    } else {
        const docRef = await addDoc(collection(db, 'products'), productToSave);
        return { ...productToSave, id: docRef.id };
    }
};

export const deleteProduct = async (productId: string) => {
    await deleteDoc(doc(db, 'products', productId));
};

// Category Functions
export const getCategories = async (): Promise<Category[]> => {
    const categoriesCol = collection(db, 'categories');
    const categorySnapshot = await getDocs(categoriesCol);
    const categoryList = categorySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Category[];
    return categoryList;
};

export const saveCategory = async (categoryData: Category, imageFile?: File): Promise<Category> => {
    let imageUrl = categoryData.imageUrl;
    if (imageFile) {
        const storageRef = ref(storage, `categories/${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
    }
    
    const categoryToSave = { ...categoryData, imageUrl };

    if (categoryData.id) {
        const categoryRef = doc(db, 'categories', categoryData.id as string);
        await updateDoc(categoryRef, categoryToSave);
        return { ...categoryToSave, id: categoryData.id };
    } else {
        const docRef = await addDoc(collection(db, 'categories'), categoryToSave);
        return { ...categoryToSave, id: docRef.id };
    }
};

export const deleteCategory = async (categoryId: string) => {
    await deleteDoc(doc(db, 'categories', categoryId));
};


// Hero Slide Functions
export const getHeroSlides = async (): Promise<HeroSlide[]> => {
    const heroSlidesCol = collection(db, 'heroSlides');
    const heroSlideSnapshot = await getDocs(heroSlidesCol);
    const heroSlideList = heroSlideSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as HeroSlide[];
    return heroSlideList;
};

export const saveHeroSlide = async (slideData: HeroSlide, imageFile?: File): Promise<HeroSlide> => {
    let imageUrl = slideData.imageUrl;
    if (imageFile) {
        const storageRef = ref(storage, `heroSlides/${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
    }

    const slideToSave = { ...slideData, imageUrl };

    if (slideData.id) {
        const slideRef = doc(db, 'heroSlides', slideData.id as string);
        await updateDoc(slideRef, slideToSave);
        return { ...slideToSave, id: slideData.id };
    } else {
        const docRef = await addDoc(collection(db, 'heroSlides'), slideToSave);
        return { ...slideToSave, id: docRef.id };
    }
};

export const deleteHeroSlide = async (slideId: string) => {
    await deleteDoc(doc(db, 'heroSlides', slideId));
};

// Homepage Sections Functions
export const getHomepageSections = async (): Promise<HomepageSections | null> => {
    const homepageRef = doc(db, 'homepage', 'sections');
    const homepageSnap = await getDoc(homepageRef);
    if (homepageSnap.exists()) {
        return homepageSnap.data() as HomepageSections;
    } else {
        // Return a default structure if it doesn't exist
        return { deals: [], bestsellers: [] };
    }
};

export const saveHomepageSections = async (sections: HomepageSections) => {
    const homepageRef = doc(db, 'homepage', 'sections');
    await updateDoc(homepageRef, sections, { merge: true });
};


// Auth Functions
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };
