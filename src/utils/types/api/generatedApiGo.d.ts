/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** @format int32 */
export enum PgtypeInfinityModifier {
  Infinity = 1,
  Finite = 0,
  NegativeInfinity = -1,
}

export enum StockStatus {
  InStock = "IN_STOCK",
  PreOrder = "PRE_ORDER",
  OutOfStock = "OUT_OF_STOCK",
}

export interface APIError {
  field?: string;
  message?: string;
}

export interface APIErrors {
  code?: number;
  errors?: APIError[];
}

export interface AddCartItemRequest {
  product_id: string;
  /** @min 1 */
  quantity: number;
  variant_id: string;
}

export interface AdminOrderResponse {
  cancelled_at?: string;
  comment?: string;
  created_at?: string;
  currency?: string;
  discount_total?: number;
  email?: string;
  grand_total?: number;
  id?: string;
  items?: OrderItemResponse[];
  number?: number;
  paid_at?: string;
  payment_method?: string;
  payment_status?: string;
  phone?: string;
  shipping?: OrderShippingResponse;
  shipping_total?: number;
  status?: string;
  subtotal?: number;
  tax_total?: number;
  user_id?: string;
}

export interface Attribute {
  attribute_group_id?: UuidNullUUID;
  created_at?: PgtypeTimestamp;
  id?: string;
  is_filterable?: PgtypeBool;
  is_required?: PgtypeBool;
  is_visible?: PgtypeBool;
  name?: string;
  slug?: string;
  sort_order?: PgtypeInt4;
  type?: string;
  unit?: PgtypeText;
  updated_at?: PgtypeTimestamp;
}

export interface AttributeGroup {
  created_at?: PgtypeTimestamp;
  description?: PgtypeText;
  id?: string;
  name?: string;
  slug?: string;
  updated_at?: PgtypeTimestamp;
}

export interface AttributeGroupResponse {
  attributes?: AttributeResponse[];
  group_description?: string;
  group_id?: string;
  group_name?: string;
  group_slug?: string;
}

export interface AttributeGroupWithValuesDTO {
  attributes?: AttributeWithValuesDTO[];
  group_description?: string;
  group_id?: string;
  group_name?: string;
  group_slug?: string;
}

export interface AttributeGroupsResponse {
  groups?: AttributeGroupResponse[];
}

export interface AttributeResponse {
  id?: string;
  is_filterable?: boolean;
  name?: string;
  slug?: string;
  type?: string;
  unit?: string;
  values?: AttributeValueResponse[];
}

export interface AttributeValueResponse {
  display_order?: number;
  id?: string;
  value?: string;
  value_normalized?: string;
  value_numeric?: DecimalNullDecimal;
}

export interface AttributeWithValuesDTO {
  id?: string;
  is_filterable?: boolean;
  name?: string;
  slug?: string;
  type?: string;
  unit?: string;
  values?: GithubComStickproGoStoreInternalDtoAttributeValueDTO[];
}

export interface AuthRequest {
  email: string;
  /**
   * @minLength 8
   * @maxLength 32
   */
  password: string;
}

export interface AuthResponse {
  token?: string;
}

export interface BreadcrumbResponse {
  depth?: number;
  id?: string;
  meta_h1?: string;
  meta_title?: string;
  name?: string;
  slug?: string;
}

export interface CDEKDeliveryPointResponse {
  address?: string;
  address_full?: string;
  allowed_cod?: boolean;
  city?: string;
  city_code?: number;
  code?: string;
  country_code?: string;
  email?: string;
  have_cash?: boolean;
  have_cashless?: boolean;
  is_dressing_room?: boolean;
  is_handout?: boolean;
  is_reception?: boolean;
  latitude?: number;
  longitude?: number;
  name?: string;
  note?: string;
  phones?: string[];
  postal_code?: string;
  region?: string;
  region_code?: number;
  take_only?: boolean;
  type?: string;
  weight_max?: number;
  weight_min?: number;
  work_time?: string;
}

export interface CartItemResponse {
  available?: boolean;
  image?: ImageDTO;
  max_quantity?: number;
  name?: string;
  price?: number;
  product_id?: string;
  quantity?: number;
  slug?: string;
  variant_id?: string;
}

export interface CartResponse {
  items?: CartItemResponse[];
  total_price?: number;
}

export interface CategoryAttributeFilterResponse {
  group_name?: string;
  group_slug?: string;
  max?: number;
  min?: number;
  name?: string;
  options?: CategoryFilterOptionResponse[];
  slug?: string;
  type?: string;
  unit?: string;
}

export interface CategoryFilterOptionResponse {
  count?: number;
  label?: string;
  value?: string;
}

export interface CategoryFiltersResponse {
  attributes?: CategoryAttributeFilterResponse[];
  manufacturers?: CategoryFilterOptionResponse[];
  price?: CategoryPriceRangeResponse;
  stock_statuses?: CategoryFilterOptionResponse[];
}

export interface CategoryPriceRangeResponse {
  max?: number;
  min?: number;
}

export interface CategoryResponse {
  created_at?: string;
  description?: string;
  id?: string;
  image_path?: string;
  is_enabled?: boolean;
  meta_description?: string;
  meta_h1?: string;
  meta_keywords?: string;
  meta_title?: string;
  name?: string;
  parent_id?: string;
  slug?: string;
  updated_at?: string;
}

export interface CategoryTreeResponse {
  children?: CategoryTreeResponse[];
  id?: string;
  name?: string;
  slug?: string;
}

export interface CityResponse {
  address?: string;
  area?: string;
  area_type?: string;
  capital_marker?: number;
  city?: string;
  city_type?: string;
  country?: string;
  federal_district?: string;
  fias_id?: string;
  fias_level?: number;
  foundation_year?: number;
  geo_lat?: number;
  geo_lon?: number;
  id?: string;
  kladr_id?: string;
  okato?: string;
  oktmo?: string;
  population?: number;
  postal_code?: string;
  region?: string;
  region_type?: string;
  settlement?: string;
  settlement_type?: string;
  tax_office?: string;
  timezone?: string;
}

export interface Collection {
  created_at?: PgtypeTimestamptz;
  description?: PgtypeText;
  id?: string;
  name?: string;
  slug?: string;
  updated_at?: PgtypeTimestamptz;
}

export interface CollectionResponse {
  created_at?: string;
  description?: string;
  id?: string;
  name?: string;
  slug?: string;
  updated_at?: string;
}

export interface CollectionWithProductResponse {
  created_at?: string;
  description?: string;
  id?: string;
  name?: string;
  products?: VariantCardResponse[];
  slug?: string;
  updated_at?: string;
}

export interface CreateAttributeGroupRequest {
  /**
   * @minLength 1
   * @maxLength 100
   */
  description?: string;
  name: string;
  slug: string;
}

export interface CreateAttributeRequest {
  attribute_group_id?: string;
  is_filterable?: boolean;
  is_required?: boolean;
  is_visible?: boolean;
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  slug: string;
  /** @min 0 */
  sort_order?: number;
  type: "select" | "number" | "boolean" | "text";
  /**
   * @minLength 1
   * @maxLength 50
   */
  unit?: string;
}

export interface CreateAttributeValueRequest {
  attribute_id: string;
  /** @min 0 */
  display_order?: number;
  /**
   * @minLength 1
   * @maxLength 255
   */
  value: string;
  /** @maxLength 255 */
  value_normalized?: string;
  value_numeric?: number;
}

export interface CreateCategoryRequest {
  /** @minLength 1 */
  description?: string;
  /** @minLength 1 */
  image_path?: string;
  is_enabled?: boolean;
  /** @minLength 1 */
  meta_description?: string;
  /** @minLength 1 */
  meta_h1?: string;
  /** @minLength 1 */
  meta_keyword?: string;
  /** @minLength 1 */
  meta_title?: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  parent_id?: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  slug: string;
}

export interface CreateCollectionRequest {
  /** @maxLength 500 */
  description?: string;
  name: string;
  slug: string;
  variant_ids?: string[];
}

export interface CreateManufacturerRequest {
  /** @minLength 1 */
  description?: string;
  /** @minLength 1 */
  image_path?: string;
  is_enabled?: boolean;
  /** @minLength 1 */
  meta_description?: string;
  /** @minLength 1 */
  meta_h1?: string;
  /** @minLength 1 */
  meta_keyword?: string;
  /** @minLength 1 */
  meta_title?: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  slug: string;
}

export interface CreateOrderRequest {
  /** @maxLength 2000 */
  comment?: string;
  email?: string;
  /**
   * ExpectedTotal, when set, must equal the server-computed grand total or the
   * order is rejected (price/availability changed since the cart was shown).
   * Decimal string, e.g. "1990.00".
   */
  expected_total?: string;
  /** @maxLength 32 */
  payment_method: string;
  /** @maxLength 32 */
  phone?: string;
  /** @maxLength 512 */
  ship_address: string;
  ship_city_id?: string;
  /** @maxLength 255 */
  ship_city_name: string;
  /** @maxLength 16 */
  ship_postcode?: string;
  /** @maxLength 255 */
  ship_recipient: string;
  /** @maxLength 64 */
  shipping_method?: string;
}

export interface CreateProductRequest {
  ean?: string;
  height?: number;
  image?: string;
  is_enable?: boolean;
  isbn?: string;
  jan?: string;
  length?: number;
  location?: string;
  manufacturer_id?: string;
  media_ids?: string[];
  minimum: number;
  mpn?: string;
  price_business?: number;
  price_retail?: number;
  price_wholesale?: number;
  quantity?: number;
  sku?: string;
  sort_order?: number;
  stock_status?: string;
  subtract?: boolean;
  upc?: string;
  weight?: number;
  width?: number;
}

export interface CreateProductVariantRequest {
  category_id?: string;
  description?: string;
  is_enable?: boolean;
  meta_description?: string;
  meta_h1?: string;
  meta_keyword?: string;
  meta_title?: string;
  model: string;
  name: string;
  slug: string;
  sort_order?: number;
}

export interface FullPagingData {
  last_page?: number;
  page?: number;
  page_size?: number;
  total?: number;
}

export interface GetRelatedProductsBatchRequest {
  variant_ids?: string[];
}

export interface ImageDTO {
  alt?: string;
  height?: number;
  id?: string;
  presets?: Record<string, Record<string, string>>;
  width?: number;
}

export interface JSONResponseAdminOrderResponse {
  code?: number;
  data?: AdminOrderResponse;
  message?: string;
}

export interface JSONResponseAttributeGroupResponse {
  code?: number;
  data?: AttributeGroupResponse;
  message?: string;
}

export interface JSONResponseAttributeGroupsResponse {
  code?: number;
  data?: AttributeGroupsResponse;
  message?: string;
}

export interface JSONResponseAttributeResponse {
  code?: number;
  data?: AttributeResponse;
  message?: string;
}

export interface JSONResponseAttributeValueResponse {
  code?: number;
  data?: AttributeValueResponse;
  message?: string;
}

export interface JSONResponseAuthResponse {
  code?: number;
  data?: AuthResponse;
  message?: string;
}

export interface JSONResponseCartResponse {
  code?: number;
  data?: CartResponse;
  message?: string;
}

export interface JSONResponseCategoryFiltersResponse {
  code?: number;
  data?: CategoryFiltersResponse;
  message?: string;
}

export interface JSONResponseCategoryResponse {
  code?: number;
  data?: CategoryResponse;
  message?: string;
}

export interface JSONResponseCityResponse {
  code?: number;
  data?: CityResponse;
  message?: string;
}

export interface JSONResponseCollectionResponse {
  code?: number;
  data?: CollectionResponse;
  message?: string;
}

export interface JSONResponseCollectionWithProductResponse {
  code?: number;
  data?: CollectionWithProductResponse;
  message?: string;
}

export interface JSONResponseManufacturerResponse {
  code?: number;
  data?: ManufacturerResponse;
  message?: string;
}

export interface JSONResponseMediumResponse {
  code?: number;
  data?: MediumResponse;
  message?: string;
}

export interface JSONResponseOrderResponse {
  code?: number;
  data?: OrderResponse;
  message?: string;
}

export interface JSONResponseProductResponse {
  code?: number;
  data?: ProductResponse;
  message?: string;
}

export interface JSONResponseProductReviewResponse {
  code?: number;
  data?: ProductReviewResponse;
  message?: string;
}

export interface JSONResponseProductVariantResponse {
  code?: number;
  data?: ProductVariantResponse;
  message?: string;
}

export interface JSONResponseProductWithMediumResponse {
  code?: number;
  data?: ProductWithMediumResponse;
  message?: string;
}

export interface JSONResponseResponseWithFullPaginationAdminOrderResponse {
  code?: number;
  data?: ResponseWithFullPaginationAdminOrderResponse;
  message?: string;
}

export interface JSONResponseResponseWithFullPaginationAttribute {
  code?: number;
  data?: ResponseWithFullPaginationAttribute;
  message?: string;
}

export interface JSONResponseResponseWithFullPaginationAttributeGroup {
  code?: number;
  data?: ResponseWithFullPaginationAttributeGroup;
  message?: string;
}

export interface JSONResponseResponseWithFullPaginationCategoryResponse {
  code?: number;
  data?: ResponseWithFullPaginationCategoryResponse;
  message?: string;
}

export interface JSONResponseResponseWithFullPaginationCollection {
  code?: number;
  data?: ResponseWithFullPaginationCollection;
  message?: string;
}

export interface JSONResponseResponseWithFullPaginationOrderResponse {
  code?: number;
  data?: ResponseWithFullPaginationOrderResponse;
  message?: string;
}

export interface JSONResponseResponseWithFullPaginationProductResponse {
  code?: number;
  data?: ResponseWithFullPaginationProductResponse;
  message?: string;
}

export interface JSONResponseResponseWithFullPaginationProductReviewResponse {
  code?: number;
  data?: ResponseWithFullPaginationProductReviewResponse;
  message?: string;
}

export interface JSONResponseResponseWithFullPaginationProductVariantListItem {
  code?: number;
  data?: ResponseWithFullPaginationProductVariantListItem;
  message?: string;
}

export interface JSONResponseResponseWithFullPaginationGithubComStickproGoStoreInternalDtoEnrichedVariantDTO {
  code?: number;
  data?: ResponseWithFullPaginationGithubComStickproGoStoreInternalDtoEnrichedVariantDTO;
  message?: string;
}

export interface JSONResponseResponseWithFullPaginationGithubComStickproGoStoreInternalStorageRepositoryRepositoryProductsFindRow {
  code?: number;
  data?: ResponseWithFullPaginationGithubComStickproGoStoreInternalStorageRepositoryRepositoryProductsFindRow;
  message?: string;
}

export interface JSONResponseSendCodeResponse {
  code?: number;
  data?: SendCodeResponse;
  message?: string;
}

export interface JSONResponseUserInfoResponse {
  code?: number;
  data?: UserInfoResponse;
  message?: string;
}

export interface JSONResponseVariantListResponse {
  code?: number;
  data?: VariantListResponse;
  message?: string;
}

export interface JSONResponseViewedResponse {
  code?: number;
  data?: ViewedResponse;
  message?: string;
}

export interface JSONResponseAny {
  code?: number;
  data?: any;
  message?: string;
}

export interface JSONResponseArrayAttributeGroupResponse {
  code?: number;
  data?: AttributeGroupResponse[];
  message?: string;
}

export interface JSONResponseArrayAttributeGroupWithValuesDTO {
  code?: number;
  data?: AttributeGroupWithValuesDTO[];
  message?: string;
}

export interface JSONResponseArrayAttributeResponse {
  code?: number;
  data?: AttributeResponse[];
  message?: string;
}

export interface JSONResponseArrayBreadcrumbResponse {
  code?: number;
  data?: BreadcrumbResponse[];
  message?: string;
}

export interface JSONResponseArrayCDEKDeliveryPointResponse {
  code?: number;
  data?: CDEKDeliveryPointResponse[];
  message?: string;
}

export interface JSONResponseArrayCategoryTreeResponse {
  code?: number;
  data?: CategoryTreeResponse[];
  message?: string;
}

export interface JSONResponseArrayCityResponse {
  code?: number;
  data?: CityResponse[];
  message?: string;
}

export interface JSONResponseArrayProductVariantResponse {
  code?: number;
  data?: ProductVariantResponse[];
  message?: string;
}

export interface JSONResponseArrayVariantCardResponse {
  code?: number;
  data?: VariantCardResponse[];
  message?: string;
}

export interface JSONResponseArrayVariantCategoryResponse {
  code?: number;
  data?: VariantCategoryResponse[];
  message?: string;
}

export interface JSONResponseArrayGithubComStickproGoStoreInternalDtoAttributeValueDTO {
  code?: number;
  data?: GithubComStickproGoStoreInternalDtoAttributeValueDTO[];
  message?: string;
}

export interface JSONResponseMapStringArrayVariantCardResponse {
  code?: number;
  data?: MapStringArrayVariantCardResponse;
  message?: string;
}

export interface JSONResponseString {
  code?: number;
  data?: string;
  message?: string;
}

export interface ManufacturerResponse {
  created_at?: string;
  description?: string;
  id?: string;
  image_path?: string;
  is_enabled?: boolean;
  meta_description?: string;
  meta_h1?: string;
  meta_keywords?: string;
  meta_title?: string;
  name?: string;
  slug?: string;
  updated_at?: string;
}

export interface MediumResponse {
  created_at?: string;
  disk_type?: string;
  file_name?: string;
  height?: number;
  id?: string;
  mime_type?: string;
  name?: string;
  path?: string;
  size?: number;
  width?: number;
}

export interface OrderItemResponse {
  image_path?: string;
  line_total?: number;
  name?: string;
  product_id?: string;
  quantity?: number;
  sku?: string;
  slug?: string;
  unit_price?: number;
  variant_id?: string;
}

export interface OrderResponse {
  cancelled_at?: string;
  comment?: string;
  created_at?: string;
  currency?: string;
  discount_total?: number;
  email?: string;
  grand_total?: number;
  id?: string;
  items?: OrderItemResponse[];
  number?: number;
  paid_at?: string;
  payment_method?: string;
  payment_status?: string;
  phone?: string;
  shipping?: OrderShippingResponse;
  shipping_total?: number;
  status?: string;
  subtotal?: number;
  tax_total?: number;
}

export interface OrderShippingResponse {
  address?: string;
  city_id?: string;
  city_name?: string;
  method?: string;
  postcode?: string;
  recipient?: string;
}

export interface ProductResponse {
  ean?: string;
  height?: number;
  id?: string;
  image?: string;
  is_enable?: boolean;
  isbn?: string;
  jan?: string;
  length?: number;
  location?: string;
  manufacturer_id?: UuidNullUUID;
  minimum?: number;
  mpn?: string;
  price_business?: number;
  price_retail?: number;
  price_wholesale?: number;
  quantity?: number;
  sku?: string;
  sort_order?: number;
  stock_status?: string;
  subtract?: boolean;
  upc?: string;
  variant?: ProductVariantResponse;
  weight?: number;
  width?: number;
}

export interface ProductReviewResponse {
  body?: string;
  created_at?: string;
  id?: string;
  rating?: number;
  status?: string;
  title?: string;
  updated_at?: string;
  user_id?: string;
}

export interface ProductVariantListItem {
  category_id?: UuidNullUUID;
  created_at?: PgtypeTimestamp;
  description?: PgtypeText;
  id?: string;
  is_enable?: boolean;
  meta_description?: PgtypeText;
  meta_h1?: PgtypeText;
  meta_keyword?: PgtypeText;
  meta_title?: PgtypeText;
  model?: string;
  name?: string;
  product_id?: string;
  slug?: string;
  sort_order?: number;
  updated_at?: PgtypeTimestamp;
  viewed?: number;
}

export interface ProductVariantResponse {
  category_id?: UuidNullUUID;
  description?: string;
  id?: string;
  is_enable?: boolean;
  meta_description?: string;
  meta_h1?: string;
  meta_keyword?: string;
  meta_title?: string;
  model?: string;
  name?: string;
  slug?: string;
  sort_order?: number;
}

export interface ProductWithMediumResponse {
  images?: GithubComStickproGoStoreInternalDtoImageDTO[];
  product?: ProductResponse;
}

export interface ResponseWithFullPaginationAdminOrderResponse {
  items?: AdminOrderResponse[];
  pagination?: FullPagingData;
}

export interface ResponseWithFullPaginationAttribute {
  items?: Attribute[];
  pagination?: FullPagingData;
}

export interface ResponseWithFullPaginationAttributeGroup {
  items?: AttributeGroup[];
  pagination?: FullPagingData;
}

export interface ResponseWithFullPaginationCategoryResponse {
  items?: CategoryResponse[];
  pagination?: FullPagingData;
}

export interface ResponseWithFullPaginationCollection {
  items?: Collection[];
  pagination?: FullPagingData;
}

export interface ResponseWithFullPaginationOrderResponse {
  items?: OrderResponse[];
  pagination?: FullPagingData;
}

export interface ResponseWithFullPaginationProductResponse {
  items?: ProductResponse[];
  pagination?: FullPagingData;
}

export interface ResponseWithFullPaginationProductReviewResponse {
  items?: ProductReviewResponse[];
  pagination?: FullPagingData;
}

export interface ResponseWithFullPaginationProductVariantListItem {
  items?: ProductVariantListItem[];
  pagination?: FullPagingData;
}

export interface ResponseWithFullPaginationGithubComStickproGoStoreInternalDtoEnrichedVariantDTO {
  items?: GithubComStickproGoStoreInternalDtoEnrichedVariantDTO[];
  pagination?: FullPagingData;
}

export interface ResponseWithFullPaginationGithubComStickproGoStoreInternalStorageRepositoryRepositoryProductsFindRow {
  items?: GithubComStickproGoStoreInternalStorageRepositoryRepositoryProductsFindRow[];
  pagination?: FullPagingData;
}

export interface SendCodeRequest {
  email: string;
}

export interface SendCodeResponse {
  sent?: boolean;
}

export interface SyncRelatedProductRequest {
  variant_ids?: string[];
}

export interface SyncVariantCategoriesRequest {
  category_ids?: string[];
}

export interface TrackViewedRequest {
  variant_id: string;
}

export interface UpdateAttributeGroupRequest {
  /**
   * @minLength 1
   * @maxLength 100
   */
  description?: string;
  name: string;
  slug: string;
}

export interface UpdateAttributeValueRequest {
  /** @min 0 */
  display_order?: number;
  is_active?: boolean;
  /**
   * @minLength 1
   * @maxLength 255
   */
  value: string;
  /** @maxLength 255 */
  value_normalized?: string;
  value_numeric?: number;
}

export interface UpdateCartItemRequest {
  quantity?: number;
}

export interface UpdateCategoryRequest {
  /** @minLength 1 */
  description?: string;
  /** @minLength 1 */
  image_path?: string;
  is_enabled?: boolean;
  /** @minLength 1 */
  meta_description?: string;
  /** @minLength 1 */
  meta_h1?: string;
  /** @minLength 1 */
  meta_keyword?: string;
  /** @minLength 1 */
  meta_title?: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  name?: string;
  parent_id?: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  slug?: string;
}

export interface UpdateCollectionRequest {
  /** @maxLength 500 */
  description?: string;
  name: string;
  slug: string;
  variant_ids?: string[];
}

export interface UpdateManufacturerRequest {
  /** @minLength 1 */
  description?: string;
  /** @minLength 1 */
  image_path?: string;
  is_enabled?: boolean;
  /** @minLength 1 */
  meta_description?: string;
  /** @minLength 1 */
  meta_h1?: string;
  /** @minLength 1 */
  meta_keyword?: string;
  /** @minLength 1 */
  meta_title?: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  name?: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  slug?: string;
}

export interface UpdateOrderStatusRequest {
  /** @maxLength 1000 */
  comment?: string;
  /**
   * PaymentMethod is only used when Status is "paid"; ignored otherwise.
   * @maxLength 32
   */
  payment_method?: string;
  status:
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
}

export interface UpdateProductRequest {
  ean?: string;
  height?: number;
  is_enable?: boolean;
  isbn?: string;
  jan?: string;
  length?: number;
  location?: string;
  manufacturer_id?: string;
  media_ids?: string[];
  minimum?: number;
  model?: string;
  mpn?: string;
  price_business?: number;
  price_retail?: number;
  price_wholesale?: number;
  quantity?: number;
  sku?: string;
  sort_order?: number;
  stock_status?: string;
  subtract?: boolean;
  upc?: string;
  weight?: number;
  width?: number;
}

export interface UpdateProductVariantRequest {
  category_id?: string;
  description?: string;
  id: string;
  image?: string;
  is_enable?: boolean;
  meta_description?: string;
  meta_h1?: string;
  meta_keyword?: string;
  meta_title?: string;
  model: string;
  name?: string;
  slug?: string;
  sort_order?: number;
}

export interface UserInfoResponse {
  /** @format date-time */
  created_at?: string;
  /** @format email */
  email: string;
  /** @format date-time */
  email_verified_at?: string;
  /** @format uuid */
  id?: string;
  is_admin?: boolean;
  language?: string;
  location: string;
  /** @format date-time */
  updated_at?: string;
}

export interface VariantCardResponse {
  category_id?: UuidNullUUID;
  description?: string;
  id?: string;
  image?: ImageDTO;
  is_enable?: boolean;
  manufacturer_id?: UuidNullUUID;
  model?: string;
  name?: string;
  price_business?: number;
  price_retail?: number;
  price_wholesale?: number;
  product_id?: string;
  slug?: string;
  stock_status?: string;
}

export interface VariantCategoryResponse {
  category_id?: string;
  category_is_enable?: boolean;
  category_name?: string;
  category_slug?: string;
}

export interface VariantListResponse {
  facet_stats?: Record<
    string,
    GithubComStickproGoStoreInternalDtoCategoryFacetStat
  >;
  facets?: Record<string, Record<string, number>>;
  items?: VariantCardResponse[];
  pagination?: FullPagingData;
}

export interface VerifyCodeRequest {
  code: string;
  email: string;
}

export interface ViewedItemResponse {
  image?: ImageDTO;
  name?: string;
  price?: number;
  product_id?: string;
  slug?: string;
  variant_id?: string;
}

export interface ViewedResponse {
  items?: ViewedItemResponse[];
}

export interface DecimalNullDecimal {
  decimal?: number;
  valid?: boolean;
}

export interface GithubComStickproGoStoreInternalDeliveryHttpRequestProductRequestSyncProductAttributeRequest {
  attribute_value_ids: string[];
}

export interface GithubComStickproGoStoreInternalDeliveryHttpRequestProductReviewRequestCreateProductReviewRequest {
  body?: string;
  rating?: number;
  title?: string;
  variant_id?: string;
}

export interface GithubComStickproGoStoreInternalDtoAttributeValueDTO {
  display_order?: number;
  id?: string;
  usage_count?: number;
  value?: string;
  value_normalized?: string;
  value_numeric?: DecimalNullDecimal;
}

export interface GithubComStickproGoStoreInternalDtoCategoryFacetStat {
  max?: number;
  min?: number;
}

export interface GithubComStickproGoStoreInternalDtoEnrichedVariantDTO {
  category_id?: UuidNullUUID;
  /**
   * CategoryIDs holds the variant's category plus all its ancestors (and the same
   * for its additional categories) so the search index can filter a whole subtree.
   */
  category_ids?: string[];
  created_at?: PgtypeTimestamp;
  description?: PgtypeText;
  id?: string;
  /**
   * Image is the product's main image (first by product_media.sort_order), baked into
   * the search document; nil when the product has no gallery.
   */
  image?: GithubComStickproGoStoreInternalDtoImageDTO;
  is_enable?: boolean;
  manufacturer_id?: UuidNullUUID;
  meta_description?: PgtypeText;
  meta_h1?: PgtypeText;
  meta_keyword?: PgtypeText;
  meta_title?: PgtypeText;
  model?: string;
  name?: string;
  price_business?: number;
  price_retail?: number;
  price_wholesale?: number;
  product_id?: string;
  slug?: string;
  sort_order?: number;
  stock_status?: StockStatus;
  updated_at?: PgtypeTimestamp;
  viewed?: number;
}

export interface GithubComStickproGoStoreInternalDtoImageDTO {
  alt?: string;
  height?: number;
  id?: string;
  presets?: Record<string, Record<string, string>>;
  width?: number;
}

export interface GithubComStickproGoStoreInternalStorageRepositoryRepositoryProductsFindRow {
  created_at?: PgtypeTimestamp;
  ean?: PgtypeText;
  external_id?: PgtypeText;
  height?: number;
  id?: string;
  image?: PgtypeText;
  is_enable?: boolean;
  isbn?: PgtypeText;
  jan?: PgtypeText;
  length?: number;
  location?: PgtypeText;
  manufacturer_id?: UuidNullUUID;
  minimum?: number;
  mpn?: PgtypeText;
  price_business?: number;
  price_retail?: number;
  price_wholesale?: number;
  quantity?: number;
  sku?: PgtypeText;
  sort_order?: number;
  stock_status?: StockStatus;
  subtract?: boolean;
  upc?: PgtypeText;
  updated_at?: PgtypeTimestamp;
  weight?: number;
  width?: number;
}

export type MapStringArrayVariantCardResponse = Record<
  string,
  VariantCardResponse[]
>;

export interface PgtypeBool {
  bool?: boolean;
  valid?: boolean;
}

export interface PgtypeInt4 {
  /** @format int32 */
  int32?: number;
  valid?: boolean;
}

export interface PgtypeText {
  string?: string;
  valid?: boolean;
}

export interface PgtypeTimestamp {
  infinityModifier?: PgtypeInfinityModifier;
  /** Time zone will be ignored when encoding to PostgreSQL. */
  time?: string;
  valid?: boolean;
}

export interface PgtypeTimestamptz {
  infinityModifier?: PgtypeInfinityModifier;
  time?: string;
  valid?: boolean;
}

export interface UuidNullUUID {
  uuid?: string;
  /** Valid is true if UUID is not NULL */
  valid?: boolean;
}
