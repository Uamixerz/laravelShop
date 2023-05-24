export interface ICategoryItem {
    id: number,
    name: string,
    image: string,
    description: string
}
export interface ICategoryResponse {
    data: Array<ICategoryItem>,
    current_page: number,
    total: number,
    last_page: number
}
export interface ICategorySearch{
    page?: number|string|null
}