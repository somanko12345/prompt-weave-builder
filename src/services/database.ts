import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  plan: 'free' | 'premium';
  projectCount: number;
  promptsUsed: number;
  createdAt: Date;
  region?: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  prompt: string;
  html: string;
  css: string;
  js: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

// User operations
export const createUser = async (userData: Omit<UserProfile, 'id'> & { id: string }): Promise<UserProfile> => {
  const userRef = doc(db, 'users', userData.id);
  const userDoc = {
    ...userData,
    createdAt: Timestamp.fromDate(userData.createdAt),
  };
  
  await setDoc(userRef, userDoc);
  return userData;
};

export const getUser = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      ...data,
      id: userSnap.id,
      createdAt: data.createdAt.toDate(),
    } as UserProfile;
  }
  
  return null;
};

export const updateUser = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, updates);
};

export const incrementUserUsage = async (userId: string, field: 'projectCount' | 'promptsUsed'): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const currentValue = userSnap.data()[field] || 0;
    await updateDoc(userRef, {
      [field]: currentValue + 1
    });
  }
};

// Project operations
export const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
  const projectsRef = collection(db, 'projects');
  const projectRef = doc(projectsRef);
  
  const project: Project = {
    ...projectData,
    id: projectRef.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const projectDoc = {
    ...project,
    createdAt: Timestamp.fromDate(project.createdAt),
    updatedAt: Timestamp.fromDate(project.updatedAt),
  };
  
  await setDoc(projectRef, projectDoc);
  return project;
};

export const getProject = async (projectId: string): Promise<Project | null> => {
  const projectRef = doc(db, 'projects', projectId);
  const projectSnap = await getDoc(projectRef);
  
  if (projectSnap.exists()) {
    const data = projectSnap.data();
    return {
      ...data,
      id: projectSnap.id,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Project;
  }
  
  return null;
};

export const getUserProjects = async (userId: string): Promise<Project[]> => {
  const projectsRef = collection(db, 'projects');
  const q = query(
    projectsRef, 
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Project;
  });
};

export const updateProject = async (projectId: string, updates: Partial<Project>): Promise<void> => {
  const projectRef = doc(db, 'projects', projectId);
  const updateData: any = {
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
  };
  
  if (updates.createdAt) {
    updateData.createdAt = Timestamp.fromDate(updates.createdAt);
  }
  
  await updateDoc(projectRef, updateData);
};

export const deleteProject = async (projectId: string): Promise<void> => {
  const projectRef = doc(db, 'projects', projectId);
  await deleteDoc(projectRef);
};

export const getPublicProjects = async (limitCount = 12): Promise<Project[]> => {
  const projectsRef = collection(db, 'projects');
  const q = query(
    projectsRef,
    where('isPublic', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Project;
  });
};