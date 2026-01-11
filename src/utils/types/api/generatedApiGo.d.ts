/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface APIError {
  field?: string
  message?: string
}

export interface APIErrors {
  code?: number
  errors?: APIError[]
}

export interface AttributeGroupResponse {
  created_at?: string
  description?: string
  id?: string
  name?: string
  slug?: string
  updated_at?: string
}

export interface AttributeGroupsResponse {
  groups?: GithubComStickproGoStoreInternalDtoAttributeGroupWithValuesDTO[]
}

export interface AttributeResponse {
  attribute_group_id?: UuidNullUUID
  created_at?: string
  id?: string
  is_filterable?: boolean
  is_required?: boolean
  is_visible?: boolean
  name?: string
  slug?: string
  sort_order?: number
  type?: string
  unit?: string
  updated_at?: string
}

export interface AttributeValueResponse {
  attribute_id?: string
  created_at?: string
  display_order?: number
  id?: string
  is_active?: boolean
  updated_at?: string
  value?: string
  value_normalized?: string
  value_numeric?: number
}

export interface AuthRequest {
  email: string
  /**
   * @minLength 8
   * @maxLength 32
   */
  password: string
}

export interface AuthResponse {
  token?: string
}

export interface BreadcrumbDTO {
  depth?: number
  id?: string
  meta_h1?: string
  meta_title?: string
  name?: string
  slug?: string
}

export interface CategoryResponse {
  created_at?: string
  description?: string
  id?: string
  image_path?: string
  is_enabled?: boolean
  meta_description?: string
  meta_h1?: string
  meta_keywords?: string
  meta_title?: string
  name?: string
  parent_id?: string
  slug?: string
  updated_at?: string
}

export interface CityResponse {
  address?: string
  area?: string
  area_type?: string
  capital_marker?: number
  city?: string
  city_type?: string
  country?: string
  federal_district?: string
  fias_id?: string
  fias_level?: number
  foundation_year?: number
  geo_lat?: number
  geo_lon?: number
  id?: string
  kladr_id?: string
  okato?: string
  oktmo?: string
  population?: number
  postal_code?: string
  region?: string
  region_type?: string
  settlement?: string
  settlement_type?: string
  tax_office?: string
  timezone?: string
}

export interface CollectionResponse {
  created_at?: string
  description?: string
  id?: string
  name?: string
  slug?: string
  updated_at?: string
}

export interface CollectionWithProductResponse {
  created_at?: string
  description?: string
  id?: string
  name?: string
  products?: ShortProduct[]
  slug?: string
  updated_at?: string
}

export interface CreateAttributeGroupRequest {
  /**
   * @minLength 1
   * @maxLength 100
   */
  description?: string
  name: string
  slug: string
}

export interface CreateAttributeRequest {
  attribute_group_id?: string
  is_filterable?: boolean
  is_required?: boolean
  is_visible?: boolean
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  slug: string
  /** @min 0 */
  sort_order?: number
  type: 'select' | 'number' | 'boolean' | 'text'
  /**
   * @minLength 1
   * @maxLength 50
   */
  unit?: string
}

export interface CreateAttributeValueRequest {
  attribute_id: string
  /** @min 0 */
  display_order?: number
  /**
   * @minLength 1
   * @maxLength 255
   */
  value: string
  /** @maxLength 255 */
  value_normalized?: string
  value_numeric?: number
}

export interface CreateCategoryRequest {
  /** @minLength 1 */
  description?: string
  /** @minLength 1 */
  image_path?: string
  is_enabled?: boolean
  /** @minLength 1 */
  meta_description?: string
  /** @minLength 1 */
  meta_h1?: string
  /** @minLength 1 */
  meta_keyword?: string
  /** @minLength 1 */
  meta_title?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string
  parent_id?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  slug: string
}

export interface CreateCollectionRequest {
  /** @maxLength 500 */
  description?: string
  name: string
  product_ids?: string[]
  slug: string
}

export interface CreateManufacturerRequest {
  /** @minLength 1 */
  description?: string
  /** @minLength 1 */
  image_path?: string
  is_enabled?: boolean
  /** @minLength 1 */
  meta_description?: string
  /** @minLength 1 */
  meta_h1?: string
  /** @minLength 1 */
  meta_keyword?: string
  /** @minLength 1 */
  meta_title?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  slug: string
}

export interface CreateProductRequest {
  category_id?: string
  description?: string
  ean?: string
  height?: number
  image?: string
  is_enable: boolean
  isbn?: string
  jan?: string
  length?: number
  location?: string
  manufacturer_id?: string
  media_ids?: string[]
  meta_description?: string
  meta_h1?: string
  meta_keyword?: string
  meta_title?: string
  minimum: number
  model: string
  mpn?: string
  name: string
  price: number
  quantity?: number
  sku?: string
  slug: string
  sort_order: number
  stock_status?: string
  subtract?: boolean
  upc?: string
  weight?: number
  width?: number
}

export interface FullPagingData {
  last_page?: number
  page?: number
  page_size?: number
  total?: number
}

export interface GeoResponse {
  city?: string
}

export interface JSONResponseAttributeGroupResponse {
  code?: number
  data?: AttributeGroupResponse
  message?: string
}

export interface JSONResponseAttributeGroupsResponse {
  code?: number
  data?: AttributeGroupsResponse
  message?: string
}

export interface JSONResponseAttributeResponse {
  code?: number
  data?: AttributeResponse
  message?: string
}

export interface JSONResponseAttributeValueResponse {
  code?: number
  data?: AttributeValueResponse
  message?: string
}

export interface JSONResponseAuthResponse {
  code?: number
  data?: AuthResponse
  message?: string
}

export interface JSONResponseCategoryResponse {
  code?: number
  data?: CategoryResponse
  message?: string
}

export interface JSONResponseCityResponse {
  code?: number
  data?: CityResponse
  message?: string
}

export interface JSONResponseCollectionResponse {
  code?: number
  data?: CollectionResponse
  message?: string
}

export interface JSONResponseCollectionWithProductResponse {
  code?: number
  data?: CollectionWithProductResponse
  message?: string
}

export interface JSONResponseGeoResponse {
  code?: number
  data?: GeoResponse
  message?: string
}

export interface JSONResponseManufacturerResponse {
  code?: number
  data?: ManufacturerResponse
  message?: string
}

export interface JSONResponseMediumResponse {
  code?: number
  data?: MediumResponse
  message?: string
}

export interface JSONResponseProductResponse {
  code?: number
  data?: ProductResponse
  message?: string
}

export interface JSONResponseProductReviewResponse {
  code?: number
  data?: ProductReviewResponse
  message?: string
}

export interface JSONResponseProductWithMediumResponse {
  code?: number
  data?: ProductWithMediumResponse
  message?: string
}

export interface JSONResponseRegisterUserResponse {
  code?: number
  data?: RegisterUserResponse
  message?: string
}

export interface JSONResponseResponseWithFullPaginationGithubComStickproGoStoreInternalModelsAttribute {
  code?: number
  data?: ResponseWithFullPaginationGithubComStickproGoStoreInternalModelsAttribute
  message?: string
}

export interface JSONResponseResponseWithFullPaginationGithubComStickproGoStoreInternalModelsAttributeGroup {
  code?: number
  data?: ResponseWithFullPaginationGithubComStickproGoStoreInternalModelsAttributeGroup
  message?: string
}

export interface JSONResponseResponseWithFullPaginationGithubComStickproGoStoreInternalModelsCategory {
  code?: number
  data?: ResponseWithFullPaginationGithubComStickproGoStoreInternalModelsCategory
  message?: string
}

export interface JSONResponseResponseWithFullPaginationGithubComStickproGoStoreInternalModelsCollection {
  code?: number
  data?: ResponseWithFullPaginationGithubComStickproGoStoreInternalModelsCollection
  message?: string
}

export interface JSONResponseResponseWithFullPaginationGithubComStickproGoStoreInternalStorageRepositoryRepositoryProductsFindRow {
  code?: number
  data?: ResponseWithFullPaginationGithubComStickproGoStoreInternalStorageRepositoryRepositoryProductsFindRow
  message?: string
}

export interface JSONResponseUserInfoResponse {
  code?: number
  data?: UserInfoResponse
  message?: string
}

export interface JSONResponseArrayAttributeGroupResponse {
  code?: number
  data?: AttributeGroupResponse[]
  message?: string
}

export interface JSONResponseArrayAttributeResponse {
  code?: number
  data?: AttributeResponse[]
  message?: string
}

export interface JSONResponseArrayBreadcrumbDTO {
  code?: number
  data?: BreadcrumbDTO[]
  message?: string
}

export interface JSONResponseArrayShortProduct {
  code?: number
  data?: ShortProduct[]
  message?: string
}

export interface JSONResponseArrayGithubComStickproGoStoreInternalDtoAttributeGroupWithValuesDTO {
  code?: number
  data?: GithubComStickproGoStoreInternalDtoAttributeGroupWithValuesDTO[]
  message?: string
}

export interface JSONResponseArrayGithubComStickproGoStoreInternalDtoAttributeValueDTO {
  code?: number
  data?: GithubComStickproGoStoreInternalDtoAttributeValueDTO[]
  message?: string
}

export interface JSONResponseArrayGithubComStickproGoStoreInternalModelsCity {
  code?: number
  data?: GithubComStickproGoStoreInternalModelsCity[]
  message?: string
}

export interface JSONResponseArrayGithubComStickproGoStoreInternalModelsProduct {
  code?: number
  data?: GithubComStickproGoStoreInternalModelsProduct[]
  message?: string
}

export interface JSONResponseString {
  code?: number
  data?: string
  message?: string
}

export interface ManufacturerResponse {
  created_at?: string
  description?: string
  id?: string
  image_path?: string
  is_enabled?: boolean
  meta_description?: string
  meta_h1?: string
  meta_keywords?: string
  meta_title?: string
  name?: string
  slug?: string
  updated_at?: string
}

export interface MediumResponse {
  created_at?: string
  disk_type?: string
  file_name?: string
  id?: string
  mime_type?: string
  name?: string
  path?: string
  size?: number
}

export interface ProductResponse {
  category_id?: UuidNullUUID
  description?: string
  ean?: string
  height?: number
  id?: string
  image?: string
  is_enable?: boolean
  isbn?: string
  jan?: string
  length?: number
  location?: string
  manufacturer_id?: UuidNullUUID
  meta_description?: string
  meta_h1?: string
  meta_keyword?: string
  meta_title?: string
  minimum?: number
  model?: string
  mpn?: string
  name?: string
  price?: number
  quantity?: number
  sku?: string
  slug?: string
  sort_order?: number
  stock_status?: string
  subtract?: boolean
  upc?: string
  weight?: number
  width?: number
}

export interface ProductReviewResponse {
  body?: string
  created_at?: string
  id?: string
  rating?: number
  status?: string
  title?: string
  updated_at?: string
  user_id?: string
}

export interface ProductWithMediumResponse {
  medium?: MediumResponse[]
  product?: ProductResponse
}

export interface RegisterRequest {
  email: string
  /**
   * @minLength 2
   * @maxLength 2
   */
  language: string
  location: string
  /**
   * @minLength 8
   * @maxLength 32
   */
  password: string
}

export interface RegisterUserResponse {
  token?: string
}

export interface ResponseWithFullPaginationGithubComStickproGoStoreInternalModelsAttribute {
  items?: GithubComStickproGoStoreInternalModelsAttribute[]
  pagination?: FullPagingData
}

export interface ResponseWithFullPaginationGithubComStickproGoStoreInternalModelsAttributeGroup {
  items?: GithubComStickproGoStoreInternalModelsAttributeGroup[]
  pagination?: FullPagingData
}

export interface ResponseWithFullPaginationGithubComStickproGoStoreInternalModelsCategory {
  items?: GithubComStickproGoStoreInternalModelsCategory[]
  pagination?: FullPagingData
}

export interface ResponseWithFullPaginationGithubComStickproGoStoreInternalModelsCollection {
  items?: GithubComStickproGoStoreInternalModelsCollection[]
  pagination?: FullPagingData
}

export interface ResponseWithFullPaginationGithubComStickproGoStoreInternalStorageRepositoryRepositoryProductsFindRow {
  items?: GithubComStickproGoStoreInternalStorageRepositoryRepositoryProductsFindRow[]
  pagination?: FullPagingData
}

export interface ShortProduct {
  id?: string
  image?: PgtypeText
  is_enable?: boolean
  model?: string
  name?: string
  price?: number
  slug?: string
}

export enum StockStatus {
  InStock = 'IN_STOCK',
  PreOrder = 'PRE_ORDER',
  OutOfStock = 'OUT_OF_STOCK',
}

export interface SyncRelatedProductRequest {
  product_ids?: string[]
}

export interface UpdateAttributeGroupRequest {
  /**
   * @minLength 1
   * @maxLength 100
   */
  description?: string
  name: string
  slug: string
}

export interface UpdateAttributeValueRequest {
  /** @min 0 */
  display_order?: number
  is_active?: boolean
  /**
   * @minLength 1
   * @maxLength 255
   */
  value: string
  /** @maxLength 255 */
  value_normalized?: string
  value_numeric?: number
}

export interface UpdateCategoryRequest {
  /** @minLength 1 */
  description?: string
  /** @minLength 1 */
  image_path?: string
  is_enabled?: boolean
  /** @minLength 1 */
  meta_description?: string
  /** @minLength 1 */
  meta_h1?: string
  /** @minLength 1 */
  meta_keyword?: string
  /** @minLength 1 */
  meta_title?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  name?: string
  parent_id?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  slug?: string
}

export interface UpdateCollectionRequest {
  /** @maxLength 500 */
  description?: string
  name: string
  product_ids?: string[]
  slug: string
}

export interface UpdateManufacturerRequest {
  /** @minLength 1 */
  description?: string
  /** @minLength 1 */
  image_path?: string
  is_enabled?: boolean
  /** @minLength 1 */
  meta_description?: string
  /** @minLength 1 */
  meta_h1?: string
  /** @minLength 1 */
  meta_keyword?: string
  /** @minLength 1 */
  meta_title?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  name?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  slug?: string
}

export interface UpdateProductRequest {
  category_id?: string
  description?: string
  ean?: string
  height?: number
  image?: string
  is_enable?: boolean
  isbn?: string
  jan?: string
  length?: number
  location?: string
  manufacturer_id?: string
  media_ids?: string[]
  meta_description?: string
  meta_h1?: string
  meta_keyword?: string
  meta_title?: string
  minimum?: number
  model?: string
  mpn?: string
  name?: string
  price?: number
  quantity?: number
  sku?: string
  slug?: string
  sort_order?: number
  stock_status?: string
  subtract?: boolean
  upc?: string
  weight?: number
  width?: number
}

export interface UserInfoResponse {
  /** @format date-time */
  created_at?: string
  /** @format email */
  email: string
  /** @format date-time */
  email_verified_at?: string
  /** @format uuid */
  id?: string
  is_admin?: boolean
  language?: string
  location: string
  /** @format date-time */
  updated_at?: string
}

export interface GithubComStickproGoStoreInternalDeliveryHttpRequestProductRequestSyncProductAttributeRequest {
  attribute_ids: string[]
}

export interface GithubComStickproGoStoreInternalDeliveryHttpRequestProductReviewRequestCreateProductReviewRequest {
  body?: string
  product_id?: string
  rating?: number
  title?: string
}

export interface GithubComStickproGoStoreInternalDtoAttributeGroupWithValuesDTO {
  attributes?: GithubComStickproGoStoreInternalDtoAttributeWithValuesDTO[]
  group_description?: string
  group_id?: string
  group_name?: string
  group_slug?: string
}

export interface GithubComStickproGoStoreInternalDtoAttributeValueDTO {
  display_order?: number
  id?: string
  usage_count?: number
  value?: string
  value_numeric?: number
}

export interface GithubComStickproGoStoreInternalDtoAttributeWithValuesDTO {
  id?: string
  is_filterable?: boolean
  name?: string
  slug?: string
  type?: string
  unit?: string
  values?: GithubComStickproGoStoreInternalDtoAttributeValueDTO[]
}

export interface GithubComStickproGoStoreInternalModelsAttribute {
  attribute_group_id?: UuidNullUUID
  created_at?: PgtypeTimestamp
  id?: string
  is_filterable?: PgtypeBool
  is_required?: PgtypeBool
  is_visible?: PgtypeBool
  name?: string
  slug?: string
  sort_order?: PgtypeInt4
  type?: string
  unit?: PgtypeText
  updated_at?: PgtypeTimestamp
}

export interface GithubComStickproGoStoreInternalModelsAttributeGroup {
  created_at?: PgtypeTimestamp
  description?: PgtypeText
  id?: string
  name?: string
  slug?: string
  updated_at?: PgtypeTimestamp
}

export interface GithubComStickproGoStoreInternalModelsCategory {
  created_at?: PgtypeTimestamp
  description?: PgtypeText
  id?: string
  image_path?: PgtypeText
  is_enable?: boolean
  meta_description?: PgtypeText
  meta_h1?: PgtypeText
  meta_keyword?: PgtypeText
  meta_title?: PgtypeText
  name?: string
  parent_id?: UuidNullUUID
  slug?: string
  updated_at?: PgtypeTimestamp
}

export interface GithubComStickproGoStoreInternalModelsCity {
  address?: string
  area?: PgtypeText
  area_type?: PgtypeText
  capital_marker?: number
  city?: string
  city_type?: string
  country?: string
  federal_district?: string
  fias_id?: string
  fias_level?: number
  foundation_year?: number
  geo_lat?: number
  geo_lon?: number
  id?: string
  kladr_id?: string
  okato?: string
  oktmo?: string
  population?: number
  postal_code?: string
  region?: string
  region_type?: string
  settlement?: PgtypeText
  settlement_type?: PgtypeText
  tax_office?: string
  timezone?: string
}

export interface GithubComStickproGoStoreInternalModelsCollection {
  created_at?: PgtypeTimestamptz
  description?: PgtypeText
  id?: string
  name?: string
  slug?: string
  updated_at?: PgtypeTimestamptz
}

export interface GithubComStickproGoStoreInternalModelsProduct {
  category_id?: UuidNullUUID
  created_at?: PgtypeTimestamp
  description?: PgtypeText
  ean?: PgtypeText
  height?: number
  id?: string
  image?: PgtypeText
  is_enable?: boolean
  isbn?: PgtypeText
  jan?: PgtypeText
  length?: number
  location?: PgtypeText
  manufacturer_id?: UuidNullUUID
  meta_description?: PgtypeText
  meta_h1?: PgtypeText
  meta_keyword?: PgtypeText
  meta_title?: PgtypeText
  minimum?: number
  model?: string
  mpn?: PgtypeText
  name?: string
  price?: number
  quantity?: number
  sku?: PgtypeText
  slug?: string
  sort_order?: number
  stock_status?: StockStatus
  subtract?: boolean
  upc?: PgtypeText
  updated_at?: PgtypeTimestamp
  viewed?: number
  weight?: number
  width?: number
}

export interface GithubComStickproGoStoreInternalStorageRepositoryRepositoryProductsFindRow {
  category_id?: UuidNullUUID
  created_at?: PgtypeTimestamp
  description?: PgtypeText
  ean?: PgtypeText
  height?: number
  id?: string
  image?: PgtypeText
  is_enable?: boolean
  isbn?: PgtypeText
  jan?: PgtypeText
  length?: number
  location?: PgtypeText
  manufacturer_id?: UuidNullUUID
  meta_description?: PgtypeText
  meta_h1?: PgtypeText
  meta_keyword?: PgtypeText
  meta_title?: PgtypeText
  minimum?: number
  model?: string
  mpn?: PgtypeText
  name?: string
  price?: number
  quantity?: number
  sku?: PgtypeText
  slug?: string
  sort_order?: number
  stock_status?: StockStatus
  subtract?: boolean
  upc?: PgtypeText
  updated_at?: PgtypeTimestamp
  viewed?: number
  weight?: number
  width?: number
}

export interface PgtypeBool {
  bool?: boolean
  valid?: boolean
}

export enum PgtypeInfinityModifier {
  Infinity = 1,
  Finite = 0,
  NegativeInfinity = -1,
}

export interface PgtypeInt4 {
  int32?: number
  valid?: boolean
}

export interface PgtypeText {
  string?: string
  valid?: boolean
}

export interface PgtypeTimestamp {
  infinityModifier?: PgtypeInfinityModifier
  /** Time zone will be ignored when encoding to PostgreSQL. */
  time?: string
  valid?: boolean
}

export interface PgtypeTimestamptz {
  infinityModifier?: PgtypeInfinityModifier
  time?: string
  valid?: boolean
}

export interface UuidNullUUID {
  uuid?: string
  /** Valid is true if UUID is not NULL */
  valid?: boolean
}
