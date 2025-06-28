
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jerry.aora",
  projectId: "67ed0754003dd3dd8a73",
  databaseId: "67ed07bc0020e14ab578",
  userCollectionId: "67ed0843002366a7a227",
  videoCollectionId: "67ed07ed001fe4174e99",
  storageId: "67ed09bb003c1e8150e8"
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
        favorites: []
      }
    );

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(error);
  }
}



export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error("Invalid credentials. Please check the email and password.");
  }
}



export const getAccount = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
};


export const signOutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};



export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("user", userId)] 
    );

    return posts.documents;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw new Error(error);
  }
}



// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// File Preview
export async function getFilePreview (fileId, type) {
  let fileUrl; 

  try {
    if (type === 'video') {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)
    } else if (type === 'image') {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)
    } else {
      throw new Error ('Inavlid file type')
    }

    if (!fileUrl) throw Error("File url does not exist")

    return fileUrl; 

  } catch (error) {
    throw new Error("Error getting file preview:", error.message)
  }
}

//upload file
export async function uploadFile (file, type) {
  if(!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest }

  try {
    const uplaodedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    )

    const fileUrl =  await getFilePreview(uplaodedFile.$id, type)

    return fileUrl;

  } catch (error) {
    throw new Error("Error uploading file:", error.message)
  }
}


//create Video
export async function createVideo(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video')
    ])

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        user: form.userId
      }
    )

    return newPost;
  } catch (error) {
    throw new Error("Error creating video:", error.message)
  }
}


export async function addFavorites(userId, videoId) {
  try {
    // Ensure required parameters are provided.
    if (!userId || !videoId) {
      throw new Error("Both userId and videoId are required.");
    }

    // Fetch the user document.
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) {
      throw new Error("User not found.");
    }

    // Ensure favorites is an array; if not, default to an empty array.
    const favoritesArray = Array.isArray(user.favorites) ? user.favorites : [];

    // Check if the videoId is already in favorites.
    if (favoritesArray.includes(videoId)) {
      return;
    }

    // Create the updated favorites array.
    const updatedFavorites = [...favoritesArray, videoId];

    // Update the user's favorites field in the database.
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      { favorites: updatedFavorites }
    );
  } catch (error) {
    throw new Error("Error adding to favorite: " + error.message);
  }
}


//get favorite video 
export async function getFavorites(userId) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    const favorites = user.favorites || [];
    return favorites;
  } catch (error) {
    throw new Error("Error fetching favorites:", error.message);
  }
}


// get video by ID
export async function getVideoById(videoId) {
  try {
    const video = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      videoId
    );
    return video;
  } catch (error) {
    console.error("Error fetching video by ID:", error.message);
    return null; // Return null if video not found
  }
}