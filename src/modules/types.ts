

export interface User  {
    email: string;
    password: string;
    firstName: string;
    lastName: string 
}
export interface Traduction  {
    traslations: [
        text: string,
        detected_source_language: string,
    ];
}
