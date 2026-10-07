import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../entities/user.entity';
import { Wallet } from '../../entities/wallet.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });

    if (existing) {
      if (existing.username === dto.username) {
        throw new ConflictException('Username is already taken');
      }
      throw new ConflictException('Email is already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Create wallet with $5 first-match bonus as featured on Figma UI
    const wallet = this.walletRepository.create({
      availableBalance: 5.0,
      escrowLockedBalance: 0.0,
      lifetimeWinnings: 0.0,
      monthlyLimit: 300.0,
      monthlyUsed: 0.0,
    });

    const user = this.userRepository.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
      platform: dto.platform,
      konamiId: dto.konamiId,
      wallet,
      role: UserRole.PLAYER,
    });

    const savedUser = await this.userRepository.save(user);

    const token = this.jwtService.sign({
      sub: savedUser.id,
      username: savedUser.username,
      role: savedUser.role,
    });

    return {
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        platform: savedUser.platform,
        role: savedUser.role,
        division: savedUser.division,
      },
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .leftJoinAndSelect('user.wallet', 'wallet')
      .where('user.username = :login OR user.email = :login', {
        login: dto.login,
      })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        platform: user.platform,
        role: user.role,
        division: user.division,
        wallet: user.wallet,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['wallet'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
