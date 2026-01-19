export const useFirestore = () => ({});
export const doc = (db: any, collection: string, id: string) => ({ path: `${collection}/${id}` });
export const setDoc = async (ref: any, data: any) => {
    console.log("Mock Firestore Submission:", data);
    return Promise.resolve(true);
};
