export interface User {
    uid: string;
    email: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
    address?: string;
    companyName?: string;
    phoneNumber?: string;
    roles: {
        provider?: boolean;
        customer?: boolean;
    }
}