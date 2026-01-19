export const uploadFile = async (file: File, path: string) => {
    console.log(`Mock uploading ${file.name} to ${path}`);
    return `https://mock-storage.com/${path}`;
};
