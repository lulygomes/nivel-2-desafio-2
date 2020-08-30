// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

import CategoryRepository from '../repositories/CategoryRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction | Category> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getCustomRepository(CategoryRepository);

    const categoryId = await categoryRepository.verifyAndCreateCategory(
      category,
    );

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: categoryId,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
