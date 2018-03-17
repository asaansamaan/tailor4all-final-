export interface User {
    uid?: string;
    email?: string;
    photoURL?: string;
    displayName?: string;
    favoriteColor?: string;
    firstName?: string;
    lastName?: string;
    dob?: Date;
    gender?: string;
    userName?: string;
    address?: string;
    companyName?: string;
    phoneNumber?: string;
    measurements?: {
        shoulders?: number;
        chest?: number;
        collarSize?: number;
        sleevesSize?: number;
        shirtSize?: string;

    };
    memberSince?: Date;
    roles?: {
        provider?: boolean;
        customer?: boolean;
    }
}