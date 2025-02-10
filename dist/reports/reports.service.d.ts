import { Model } from 'mongoose';
import { Product } from '../products/schemas/product.schema';
export declare class ReportsService {
    private productModel;
    private readonly logger;
    constructor(productModel: Model<Product>);
    getDeletedPercentage(): Promise<string>;
    getNonDeletedPercentage(params: {
        hasPrice?: boolean;
        startDate?: Date;
        endDate?: Date;
    }): Promise<string>;
    getCustomReport(): Promise<any[]>;
}
