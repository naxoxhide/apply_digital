import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/users.schema';
import * as bcryptjs from 'bcryptjs';
import e from 'express';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Creating a new user...');
    const salt = await bcryptjs.genSalt(10);
    createUserDto.password = await bcryptjs.hash(createUserDto.password, salt);
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    this.logger.log('Finding user by email...', email);
    return await this.userModel.findOne({ email }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    this.logger.log('Finding user by email with password...', email);
    return await this.userModel.findOne({ email }).select('+password').exec();
  }
}
