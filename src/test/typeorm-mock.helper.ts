/**
 * Repositorio de TypeORM "falso" para tests unitarios: cada método es un
 * jest.fn(), así que cada test controla lo que devuelve. Se usa en vez de
 * levantar una base de datos real (eso es trabajo de tests e2e, no
 * unitarios).
 */
export type MockRepository<T = any> = Record<keyof any, jest.Mock> & {
  create: jest.Mock;
  save: jest.Mock;
  find: jest.Mock;
  findOne: jest.Mock;
  update: jest.Mock;
  remove: jest.Mock;
  delete: jest.Mock;
  createQueryBuilder: jest.Mock;
};

export function createMockRepository<T = any>(): MockRepository<T> {
  const queryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    setLock: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    execute: jest.fn(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getRawOne: jest.fn(),
  };

  return {
    create: jest.fn((dto) => dto),
    save: jest.fn((entity) => Promise.resolve(entity)),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn((entity) => Promise.resolve(entity)),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => queryBuilder),
    manager: {
      transaction: jest.fn((cb: (manager: unknown) => unknown) => cb(undefined)),
    },
  } as unknown as MockRepository<T>;
}
