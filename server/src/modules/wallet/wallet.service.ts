import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from '../../entities/wallet.entity';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from '../../entities/transaction.entity';
import { DepositDto, WithdrawDto } from './dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
  ) {}

  async getWalletByUserId(userId: string) {
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
      relations: ['transactions'],
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async deposit(userId: string, dto: DepositDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { user: { id: userId } },
        lock: { mode: 'pessimistic_write' },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      wallet.availableBalance = Number(wallet.availableBalance) + Number(dto.amount);
      await queryRunner.manager.save(wallet);

      const transaction = queryRunner.manager.create(Transaction, {
        wallet,
        type: TransactionType.DEPOSIT,
        amount: dto.amount,
        status: TransactionStatus.COMPLETED,
        description: `Wallet deposit via ${dto.paymentMethod || 'Paystack'}`,
      });

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      return wallet;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async verifyPaystack(userId: string, reference: string, fallbackAmount?: number) {
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    let verifiedAmount = 0;

    if (paystackSecret) {
      try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
          },
        });
        const data = await response.json();
        if (!data.status || data.data.status !== 'success') {
          throw new BadRequestException('Paystack payment verification failed');
        }
        // Paystack amounts are in kobo, convert to Naira
        verifiedAmount = Number(data.data.amount) / 100;
      } catch (err: any) {
        throw new BadRequestException(err.message || 'Unable to verify transaction with Paystack');
      }
    } else {
      // Use exact amount requested by the user, fallback to 2500 only if undefined
      verifiedAmount = fallbackAmount ? Number(fallbackAmount) : 2500;
    }

    // Check if reference was already credited
    const existingTx = await this.transactionRepository.findOne({
      where: { description: `Paystack ref: ${reference}` },
    });
    if (existingTx) {
      throw new BadRequestException('Transaction reference already processed');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { user: { id: userId } },
        lock: { mode: 'pessimistic_write' },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      wallet.availableBalance = Number(wallet.availableBalance) + Number(verifiedAmount);
      await queryRunner.manager.save(wallet);

      const transaction = queryRunner.manager.create(Transaction, {
        wallet,
        type: TransactionType.DEPOSIT,
        amount: verifiedAmount,
        status: TransactionStatus.COMPLETED,
        description: `Paystack ref: ${reference}`,
      });

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      return wallet;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async withdraw(userId: string, dto: WithdrawDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { user: { id: userId } },
        lock: { mode: 'pessimistic_write' },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      if (Number(wallet.availableBalance) < Number(dto.amount)) {
        throw new BadRequestException('Insufficient available funds');
      }

      wallet.availableBalance = Number(wallet.availableBalance) - Number(dto.amount);
      await queryRunner.manager.save(wallet);

      const transaction = queryRunner.manager.create(Transaction, {
        wallet,
        type: TransactionType.WITHDRAWAL,
        amount: dto.amount,
        status: TransactionStatus.COMPLETED,
        description: `Withdrawal to ${dto.destination || 'Bank Account'}`,
      });

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      return wallet;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getTransactions(userId: string) {
    return this.transactionRepository.find({
      where: { wallet: { user: { id: userId } } },
      order: { createdAt: 'DESC' },
      take: 20,
    });
  }
}
