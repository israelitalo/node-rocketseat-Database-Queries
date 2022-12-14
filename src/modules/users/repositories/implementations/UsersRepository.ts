import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const userData = await this.repository.findOne(user_id, {
      relations: ["games"],
    });
    if (!userData) {
      throw new Error("User not found!");
    }
    return userData;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT * FROM USERS ORDER BY first_name");
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
     return this.repository.query(
      `select * from users where LOWER(first_name)=LOWER('${first_name}') and LOWER(last_name)=LOWER('${last_name}')`
    );
  }
}
