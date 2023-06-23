export type User = {
    id: number;
    address: string;
    company: Company;
    email: string;
    phone: string;
    name: string;
    username: string;
    website: string;
};

type Company = {
    name: string;
    catchPhrase: string;
    bs: string;
};
