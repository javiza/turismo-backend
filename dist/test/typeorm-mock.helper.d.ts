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
export declare function createMockRepository<T = any>(): MockRepository<T>;
