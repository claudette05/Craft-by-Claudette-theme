
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

/**
 * On user creation, create a user document in Firestore and assign a role.
 * The first user to sign up will be an admin, all others will be users.
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;

  // Check if there are any other users.
  const userList = await admin.auth().listUsers();

  let role = "user";
  // If this is the first user, make them an admin.
  if (userList.users.length === 1) {
    role = "admin";
  }

  // Set custom claims for the user.
  await admin.auth().setCustomUserClaims(uid, { role });

  // Create a user document in Firestore.
  const userRef = db.collection("users").doc(uid);
  return userRef.set({
    uid,
    email,
    displayName,
    photoURL,
    role,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

/**
 * Creates a new product in the products collection.
 * 
 * @param {object} data - The product data.
 * @param {object} context - The context of the function call.
 */
export const createProduct = functions.https.onCall(async (data, context) => {
    // Check if the user is an admin.
    if (context.auth?.token.role !== "admin") {
        throw new functions.https.HttpsError(
        "permission-denied",
        "You must be an admin to create a product."
        );
    }

    // TODO: Add data validation here.

    const { name, price, description, category, stock, imageUrl } = data;

    // Create the product document.
    const productRef = await db.collection("products").add({
        name,
        price,
        description,
        category,
        stock,
        imageUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { id: productRef.id };
});

/**
 * Retrieves a list of all products.
 */
export const getProducts = functions.https.onCall(async () => {
    const snapshot = await db.collection("products").get();
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return products;
});

/**
 * Updates an existing product.
 * 
 * @param {object} data - The product data.
 * @param {object} context - The context of the function call.
 */
export const updateProduct = functions.https.onCall(async (data, context) => {
    // Check if the user is an admin.
    if (context.auth?.token.role !== "admin") {
        throw new functions.https.HttpsError(
        "permission-denied",
        "You must be an admin to update a product."
        );
    }

    // TODO: Add data validation here.

    const { id, ...productData } = data;

    // Update the product document.
    await db.collection("products").doc(id).update({
        ...productData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
});

/**
 * Deletes a product.
 * 
 * @param {object} data - The product data.
 * @param {object} context - The context of the function call.
 */
export const deleteProduct = functions.https.onCall(async (data, context) => {
    // Check if the user is an admin.
    if (context.auth?.token.role !== "admin") {
        throw new functions.https.HttpsError(
        "permission-denied",
        "You must be an admin to delete a product."
        );
    }

    const { id } = data;

    // Delete the product document.
    await db.collection("products").doc(id).delete();

    return { success: true };
});
