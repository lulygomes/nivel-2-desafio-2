import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionExist = await transactionsRepository.findOne({ id });

    if (!transactionExist) {
      throw new AppError('No Transaction found with this ID', 404);
    }

    await transactionsRepository.delete({ id });
  }
}

export default DeleteTransactionService;
