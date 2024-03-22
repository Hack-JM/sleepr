import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDcoument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDcoument>) {}

  async create(document: Omit<TDcoument, '_id'>): Promise<TDcoument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await createdDocument.save()).toJSON() as unknown as TDcoument;
  }

  async findOne(filterQuery: FilterQuery<TDcoument>): Promise<TDcoument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDcoument>(true);

    if (!document) {
      this.logger.warn(
        `Document was not found with FilterQuery: ${JSON.stringify(filterQuery)}`,
      );

      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDcoument>,
    update: UpdateQuery<TDcoument>,
  ): Promise<TDcoument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDcoument>(true);

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async find(filterQuery: FilterQuery<TDcoument>): Promise<TDcoument[]> {
    return this.model.find(filterQuery).lean<TDcoument[]>(true);
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDcoument>,
  ): Promise<TDcoument> {
    return this.model.findOneAndDelete(filterQuery).lean<TDcoument>(true);
  }
}
