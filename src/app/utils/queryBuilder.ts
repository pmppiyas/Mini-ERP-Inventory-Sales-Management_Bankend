import { FilterQuery, Query } from 'mongoose';

export const excludeFilterFields = [
  'searchTerm',
  'sort',
  'fields',
  'page',
  'limit',
];

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, unknown>;

  // Store applied filters for accurate countDocuments in getMeta()
  private appliedFilters: FilterQuery<T> = {};

  constructor(
    modelQuery: Query<T[], T>,
    query: Record<string, unknown> = {}
  ) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // ── Filter ──────────────────────────────────────────────────────────────────
  // Strips pagination / search / sort meta-keys and applies the rest as filters.
  // Supports numeric coercion so ?stockQuantity=5 works as a number filter.
  filter(): this {
    const rawFilter = Object.fromEntries(
      Object.entries(this.query).filter(
        ([key]) => !excludeFilterFields.includes(key)
      )
    );

    // Coerce numeric strings to numbers for proper MongoDB comparison
    const filter: FilterQuery<T> = {};
    for (const [key, value] of Object.entries(rawFilter)) {
      if (typeof value === 'string' && value !== '' && !isNaN(Number(value))) {
        (filter as Record<string, unknown>)[key] = Number(value);
      } else {
        (filter as Record<string, unknown>)[key] = value;
      }
    }

    this.appliedFilters = { ...this.appliedFilters, ...filter };
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  // ── Search ──────────────────────────────────────────────────────────────────
  // Case-insensitive regex search across all provided searchable fields.
  search(searchableFields: string[]): this {
    const searchTerm = this.query?.searchTerm as string | undefined;

    if (searchTerm && searchTerm.trim() && searchableFields.length > 0) {
      const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const conditions = searchableFields.map((field) => ({
        [field]: { $regex: escapedTerm, $options: 'i' },
      }));

      const searchFilter = { $or: conditions } as FilterQuery<T>;
      this.appliedFilters = { ...this.appliedFilters, ...searchFilter };
      this.modelQuery = this.modelQuery.find(searchFilter);
    }

    return this;
  }

  // ── Sort ─────────────────────────────────────────────────────────────────────
  // Accepts comma-separated fields: ?sort=name,-createdAt
  // Defaults to newest-first (-createdAt).
  sort(): this {
    const sortParam = (this.query?.sort as string) || '-createdAt';
    // Convert comma-separated to space-separated for Mongoose
    const sortBy = sortParam.split(',').join(' ');
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  // ── Field selection ──────────────────────────────────────────────────────────
  // Accepts comma-separated fields: ?fields=name,sku,category
  // Always excludes __v.
  fields(): this {
    const fieldsParam = (this.query?.fields as string) || '';

    if (fieldsParam) {
      // Inclusion projection — just select the requested fields, no -__v mixing
      const selectedFields = fieldsParam.split(',').join(' ');
      this.modelQuery = this.modelQuery.select(selectedFields);
    } else {
      // No fields specified — exclude only __v (pure exclusion projection)
      this.modelQuery = this.modelQuery.select('-__v');
    }

    return this;
  }

  // ── Pagination ───────────────────────────────────────────────────────────────
  // ?page=1&limit=10  (limit omitted → returns all documents)
  paginate(): this {
    const page = Math.max(Number(this.query?.page) || 1, 1);
    const limitParam = this.query?.limit;
    const limit =
      limitParam !== undefined ? Math.max(Number(limitParam), 1) : null;

    if (limit) {
      const skip = (page - 1) * limit;
      this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    }

    return this;
  }

  // ── Populate & execute ───────────────────────────────────────────────────────
  // Pass populate fields e.g. [{ path: 'createdBy', select: 'name email' }]
  build(
    populateFields: { path: string; select?: string }[] = []
  ): Query<T[], T> {
    let query = this.modelQuery;
    for (const field of populateFields) {
      query = query.populate(field.path, field.select ?? '-__v');
    }
    return query;
  }

  // ── Meta (pagination info) ───────────────────────────────────────────────────
  // Uses the same filters applied via .filter() and .search() so total
  // reflects the filtered result set, not the entire collection.
  async getMeta(): Promise<{
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  }> {
    const total = await this.modelQuery.model.countDocuments(
      this.appliedFilters
    );

    const page = Math.max(Number(this.query?.page) || 1, 1);
    const limitParam = this.query?.limit;
    const limit =
      limitParam !== undefined ? Math.max(Number(limitParam), 1) : 10;

    const totalPage = Math.ceil(total / limit);

    return { page, limit, total, totalPage };
  }
}
