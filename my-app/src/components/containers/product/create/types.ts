export interface IProductCreate {
    name: string,
    price: number,
    category_id: number,
    images: File[],
    description: string
}
export interface ICategorySelect {
    name: string,
    id: number
}