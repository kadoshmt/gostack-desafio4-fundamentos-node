import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    // verify if type is a income our outcome string
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Type must be a income or outcome type');
    }

    // verify if user have cash enough to realyze an outcome
    const balance = this.transactionsRepository.getBalance();
    if (type === 'outcome' && value > balance.total) {
      throw new Error("You don't have money enough for this transaction");
    }

    const transaction = new Transaction({ title, value, type });

    return transaction;
  }
}

export default CreateTransactionService;
