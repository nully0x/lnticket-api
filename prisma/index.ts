const { PrismaClient } = require('@prisma/client');
import  createGlobalModule  from '../src/utils/gobalModule';


const createPrismaClient = () => {
    console.log("New Prisma Client");
    return new PrismaClient({
        log: ["info"],
    });
}

const prisma = createGlobalModule('prisma', createPrismaClient)

module.exports = {
    prisma
}