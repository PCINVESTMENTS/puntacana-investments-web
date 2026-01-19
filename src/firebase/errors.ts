export class FirestorePermissionError extends Error {
    constructor(public details: any) {
        super("Firestore Permission Error");
    }
}
