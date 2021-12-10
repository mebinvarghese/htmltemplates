export interface Contact
{
    id: string;
    avatar?: string | null;
    name: string;
    emails?: {
        email: string,
        label: string
    }[];
    phoneNumbers?: {
        country: string;
        number: string;
        label: string
    }[];
    job?: {
        title: string;
        company: string
    } | null;
    birthday?: string | null;
    address?: string | null;
    notes?: string | null;
    tags: string[];
}

export interface Country
{
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}

export interface Tag
{
    id?: string;
    title?: string;
}
