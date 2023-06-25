export type User = {
    id: number;
    address: UserAddress;
    company: UserCompany;
    email: string;
    phone: string;
    name: string;
    username: string;
    website: string;
};

type UserCompany = {
    companyName: string;
    catchPhrase: string;
    bs: string;
};

type UserAddress = {
    city: string;
    street: string;
    zipcode: string;
};
