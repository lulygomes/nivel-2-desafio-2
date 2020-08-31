import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
// import { getCustomRepository } from 'typeorm';

// import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';
// import Transaction from '../models/Transaction';
// import Category from '../models/Category';

interface fileDTO {
  filename: string;
}

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute({ filename }: fileDTO): Promise<void> {
    const createTransaction = new CreateTransactionService();
    const csvFilePath = path.resolve(__dirname, '..', '..', 'tmp', filename);
    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    parseCSV.on('data', async line => {
      const transaction: Request = {
        title: line[0],
        type: line[1],
        value: line[2],
        category: line[3],
      };

      await createTransaction.execute(transaction);
    });
  }
}

export default ImportTransactionsService;
