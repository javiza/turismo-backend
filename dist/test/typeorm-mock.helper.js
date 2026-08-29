"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockRepository = createMockRepository;
function createMockRepository() {
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
            transaction: jest.fn((cb) => cb(undefined)),
        },
    };
}
//# sourceMappingURL=typeorm-mock.helper.js.map