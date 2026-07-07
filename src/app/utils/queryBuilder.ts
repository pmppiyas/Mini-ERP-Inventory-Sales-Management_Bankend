import { Query } from 'mongoose';

export const excludeFilterFields = [
  'searchTerm',
  'sort',
  'fields',
  'page',
  'limit',
];

export class QueryBuilder<T> {
  public modelQuery: Query<any, any>;
  public readonly query: Record<string, unknown>;

  private appliedFilters: Record<string, unknown> = {};

  constructor(
    modelQuery: Query<any, any>,
    query: Record<string, unknown> = {}
  ) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filters = { ...this.query };

    excludeFilterFields.forEach((field) => {
      delete filters[field];
    });

    const filter: Record<string, unknown> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'string' && value !== '' && !isNaN(Number(value))) {
        filter[key] = Number(value);
      } else {
        filter[key] = value;
      }
    });

    this.appliedFilters = {
      ...this.appliedFilters,
      ...filter,
    };

    this.modelQuery = this.modelQuery.find(filter);

    return this;
  }

  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm as string;

    if (searchTerm) {
      const searchFilter = {
        $or: searchableFields.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      };

      this.appliedFilters = {
        ...this.appliedFilters,
        ...searchFilter,
      };

      this.modelQuery = this.modelQuery.find(searchFilter);
    }

    return this;
  }

  sort(): this {
    const sort =
      (this.query.sort as string)?.split(',').join(' ') || '-createdAt';

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  fields(): this {
    const fields = (this.query.fields as string)?.split(',').join(' ');

    if (fields) {
      this.modelQuery = this.modelQuery.select(fields);
    } else {
      this.modelQuery = this.modelQuery.select('-__v');
    }

    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  populate(populateFields: { path: string; select?: string }[]): this {
    populateFields.forEach((field) => {
      this.modelQuery = this.modelQuery.populate({
        path: field.path,
        select: field.select,
      });
    });

    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const total = await this.modelQuery.model.countDocuments(
      this.appliedFilters
    );

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    return {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    };
  }
}
