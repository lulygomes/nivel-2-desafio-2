// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

import CategoryRepository from '../repositories/CategoryRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

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
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);

    const categoryId = await categoryRepository.verifyAndCreateCategory(
      category,
    );

    const contBalance = await transactionRepository.getBalance();

    if (type === 'outcome' && contBalance.total < value) {
      throw new AppError('not Valid balance to outcome', 400);
    }

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
