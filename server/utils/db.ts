import 'dotenv/config'
import mysql from 'mysql2/promise';
import { asc, inArray } from 'drizzle-orm'
import { db } from '~/server/db'
import {
    categories,
    orderItems,
    orderStatusLogs,
    paymentMethods,
    productImages,
    products,
    subcategories,
    users,
} from '~/server/db/schema'
import { normalizeStoredImageUrl } from '~/server/utils/s3'

// Accedemos a la configuración que definimos en nuxt.config.ts
const config = useRuntimeConfig();

export const pool = mysql.createPool({
    host: config.dbHost,
        port: Number(config.dbPort ?? 3306),
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    waitForConnections: true,
    connectionLimit: 10
});

type ProductWithId = { id: number }

export async function enhanceProducts<T extends ProductWithId>(items: T[]) {
    if (!items.length) return [] as Array<T & { images: unknown[]; category: unknown | null; subcategory: unknown | null }>

    const ids = items.map((item) => item.id)
    const categoryIds = [...new Set(items.map((item: any) => item.categoryId).filter((value): value is number => typeof value === 'number'))]
    const subcategoryIds = [...new Set(items.map((item: any) => item.subcategoryId).filter((value): value is number => typeof value === 'number'))]
    const userIds = [...new Set(items.map((item: any) => item.sellerId).filter((value): value is number => typeof value === 'number'))]

    const [images, categoryRows, subcategoryRows, userRows] = await Promise.all([
        db.select().from(productImages)
            .where(inArray(productImages.productId, ids))
            .orderBy(asc(productImages.sortOrder), asc(productImages.id)),
        categoryIds.length
            ? db.select().from(categories).where(inArray(categories.id, categoryIds))
            : Promise.resolve([] as any[]),
        subcategoryIds.length
            ? db.select().from(subcategories).where(inArray(subcategories.id, subcategoryIds))
            : Promise.resolve([] as any[]),
        userIds.length
            ? db.select().from(users).where(inArray(users.id, userIds))
            : Promise.resolve([] as any[]),
    ])

    const imagesByProductId = new Map<number, typeof images>()
    for (const image of images) {
        const currentImages = imagesByProductId.get(image.productId) ?? []
        currentImages.push(image)
        imagesByProductId.set(image.productId, currentImages)
    }

    const categoriesById = new Map(categoryRows.map((item) => [item.id, item]))
    const subcategoriesById = new Map(subcategoryRows.map((item) => [item.id, item]))
    const usersById = new Map(userRows.map((item) => [item.id, item]))

    return items.map((item) => {
        return {
            ...item,
            images: (imagesByProductId.get(item.id) ?? []).map((image) => ({
                ...image,
                url: normalizeStoredImageUrl(image.url),
            })),
            category: (item as any).categoryId ? categoriesById.get((item as any).categoryId) ?? null : null,
            subcategory: (item as any).subcategoryId ? subcategoriesById.get((item as any).subcategoryId) ?? null : null,
            seller: (item as any).sellerId ? usersById.get((item as any).sellerId) ?? null : null,
        }
    })
}

type CategoryWithId = { id: number }

export async function enhanceCategories<T extends CategoryWithId>(items: T[]) {
    if (!items.length) return [] as Array<T & { subcategories: unknown[] }>

    const categoryIds = items.map((item) => item.id)
    const rows = await db.select().from(subcategories)
        .where(inArray(subcategories.categoryId, categoryIds))
        .orderBy(asc(subcategories.sortOrder), asc(subcategories.id))

    const subcategoriesByCategoryId = new Map<number, typeof rows>()
    for (const row of rows) {
        const current = subcategoriesByCategoryId.get(row.categoryId) ?? []
        current.push(row)
        subcategoriesByCategoryId.set(row.categoryId, current)
    }

    return items.map((item) => ({
        ...item,
        subcategories: subcategoriesByCategoryId.get(item.id) ?? [],
    }))
}

type SubcategoryWithId = { id: number; categoryId?: number | null }

export async function enhanceSubcategories<T extends SubcategoryWithId>(items: T[]) {
    if (!items.length) return [] as Array<T & { category: unknown | null }>

    const categoryIds = [...new Set(items.map((item) => item.categoryId).filter((value): value is number => typeof value === 'number'))]
    const categoryRows = categoryIds.length
        ? await db.select().from(categories).where(inArray(categories.id, categoryIds))
        : []

    const categoriesById = new Map(categoryRows.map((item) => [item.id, item]))

    return items.map((item) => ({
        ...item,
        category: item.categoryId ? categoriesById.get(item.categoryId) ?? null : null,
    }))
}

type OrderWithId = { id: number; paymentMethodId?: number | null }

export async function enhanceOrders<T extends OrderWithId>(items: T[]) {
    if (!items.length) return [] as Array<T & {
        paymentMethod: unknown | null
        items: unknown[]
        statusLogs: unknown[]
    }>

    const orderIds = items.map((item) => item.id)
    const paymentMethodIds = [...new Set(items.map((item) => item.paymentMethodId).filter((value): value is number => typeof value === 'number'))]

    const [itemsRows, statusLogRows, paymentMethodRows] = await Promise.all([
        db.select().from(orderItems)
            .where(inArray(orderItems.orderId, orderIds))
            .orderBy(asc(orderItems.id)),
        db.select().from(orderStatusLogs)
            .where(inArray(orderStatusLogs.orderId, orderIds))
            .orderBy(asc(orderStatusLogs.id)),
        paymentMethodIds.length
            ? db.select().from(paymentMethods).where(inArray(paymentMethods.id, paymentMethodIds))
            : Promise.resolve([] as any[]),
    ])

    const itemsByOrderId = new Map<number, typeof itemsRows>()
    for (const row of itemsRows) {
        const current = itemsByOrderId.get(row.orderId) ?? []
        current.push(row)
        itemsByOrderId.set(row.orderId, current)
    }

    const statusLogsByOrderId = new Map<number, typeof statusLogRows>()
    for (const row of statusLogRows) {
        const current = statusLogsByOrderId.get(row.orderId) ?? []
        current.push(row)
        statusLogsByOrderId.set(row.orderId, current)
    }

    const paymentMethodsById = new Map(paymentMethodRows.map((item) => [item.id, item]))

    return items.map((item) => ({
        ...item,
        paymentMethod: item.paymentMethodId ? paymentMethodsById.get(item.paymentMethodId) ?? null : null,
        items: itemsByOrderId.get(item.id) ?? [],
        statusLogs: statusLogsByOrderId.get(item.id) ?? [],
    }))
}