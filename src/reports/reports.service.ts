import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async getDeletedPercentage(): Promise<string> {
    this.logger.log('Calculating deleted percentage...');
    const total = await this.productModel.countDocuments();
    const deleted = await this.productModel.countDocuments({
      deletedAt: { $ne: null },
    });

    const percentage = total > 0 ? (deleted / total) * 100 : 0;

    return `${percentage.toFixed(3)}%`;
  }

  async getNonDeletedPercentage(params: {
    hasPrice?: boolean;
    startDate?: Date;
    endDate?: Date;
  }): Promise<string> {
    this.logger.log('Calculating non-deleted percentage...');
    const query: any = { deletedAt: null };

    if (params.hasPrice !== undefined) {
      query.price = params.hasPrice ? { $exists: true } : { $exists: false };
    }

    if (params.startDate || params.endDate) {
      query.createdAt = {};
      if (params.startDate) query.createdAt.$gte = params.startDate;
      if (params.endDate) query.createdAt.$lte = params.endDate;
    }

    const total = await this.productModel.countDocuments();
    const nonDeleted = await this.productModel.countDocuments(query);

    const percentage = total > 0 ? (nonDeleted / total) * 100 : 0;

    return `${percentage.toFixed(3)}%`;
  }

  async getCustomReport() {
    this.logger.log('Generating custom report...');
    const report = await this.productModel.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    return report;
  }
}
