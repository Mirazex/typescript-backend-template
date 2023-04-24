import Singleton from '@/core/utils/singleton';
import { PrismaClient } from '@prisma/client';

export class Database extends Singleton {
    public db: PrismaClient;

    constructor() {
        super();
        this.db = new PrismaClient();
    }
}

export const db = Database.getInstance().db;
