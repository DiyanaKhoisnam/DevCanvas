"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplates = void 0;
const db_1 = require("../config/db");
const getTemplates = async (req, res) => {
    try {
        let templates = await db_1.prisma.template.findMany({
            orderBy: { title: 'asc' },
        });
        // Seed default official templates if database is empty
        if (templates.length === 0) {
            await seedOfficialTemplates();
            templates = await db_1.prisma.template.findMany({
                orderBy: { title: 'asc' },
            });
        }
        res.json({ templates });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
};
exports.getTemplates = getTemplates;
async function seedOfficialTemplates() {
    const microserviceNodes = [
        {
            id: 'node-client',
            type: 'architectureNode',
            position: { x: 100, y: 200 },
            data: { label: 'Web Application Client', tier: 'FRONTEND', technology: 'React / Next.js', host: 'cdn.example.com', port: 443, costEstimate: 15 },
        },
        {
            id: 'node-gateway',
            type: 'architectureNode',
            position: { x: 380, y: 200 },
            data: { label: 'API Gateway', tier: 'GATEWAY', technology: 'Kong / NGINX', host: 'api.example.com', port: 443, costEstimate: 45 },
        },
        {
            id: 'node-auth-service',
            type: 'architectureNode',
            position: { x: 680, y: 100 },
            data: { label: 'Auth Service', tier: 'BACKEND', technology: 'Node.js Express', host: 'auth.internal', port: 8080, costEstimate: 30 },
        },
        {
            id: 'node-order-service',
            type: 'architectureNode',
            position: { x: 680, y: 300 },
            data: { label: 'Order Service', tier: 'BACKEND', technology: 'Go Microservice', host: 'orders.internal', port: 8081, costEstimate: 40 },
        },
        {
            id: 'node-postgres-db',
            type: 'architectureNode',
            position: { x: 980, y: 200 },
            data: { label: 'Primary PostgreSQL DB', tier: 'DATABASE', technology: 'PostgreSQL 16', host: 'db.internal', port: 5432, costEstimate: 85 },
        },
        {
            id: 'node-redis-cache',
            type: 'architectureNode',
            position: { x: 980, y: 380 },
            data: { label: 'Redis Session Cache', tier: 'CACHE', technology: 'Redis Cluster', host: 'redis.internal', port: 6379, costEstimate: 25 },
        },
    ];
    const microserviceEdges = [
        { id: 'e1', source: 'node-client', target: 'node-gateway', label: 'HTTPS / JSON', animated: true },
        { id: 'e2', source: 'node-gateway', target: 'node-auth-service', label: 'gRPC', animated: true },
        { id: 'e3', source: 'node-gateway', target: 'node-order-service', label: 'gRPC', animated: true },
        { id: 'e4', source: 'node-auth-service', target: 'node-postgres-db', label: 'TCP 5432' },
        { id: 'e5', source: 'node-order-service', target: 'node-postgres-db', label: 'TCP 5432' },
        { id: 'e6', source: 'node-order-service', target: 'node-redis-cache', label: 'RESP Protocol' },
    ];
    await db_1.prisma.template.createMany({
        data: [
            {
                title: 'Microservices Architecture',
                description: 'Scalable cloud-native architecture with API Gateway, Auth Microservice, Business logic services, and PostgreSQL / Redis database cluster.',
                category: 'BACKEND',
                thumbnail: '',
                nodes: microserviceNodes,
                edges: microserviceEdges,
                isOfficial: true,
            },
            {
                title: 'Serverless Event-Driven System',
                description: 'AWS Lambda functions connected to API Gateway, DynamoDB, and SNS/SQS event streaming pipelines.',
                category: 'GATEWAY',
                thumbnail: '',
                nodes: [
                    {
                        id: 'n-s1',
                        type: 'architectureNode',
                        position: { x: 100, y: 150 },
                        data: { label: 'Single Page App', tier: 'FRONTEND', technology: 'React Vite', costEstimate: 10 },
                    },
                    {
                        id: 'n-s2',
                        type: 'architectureNode',
                        position: { x: 380, y: 150 },
                        data: { label: 'AWS API Gateway', tier: 'GATEWAY', technology: 'REST API', costEstimate: 20 },
                    },
                    {
                        id: 'n-s3',
                        type: 'architectureNode',
                        position: { x: 650, y: 150 },
                        data: { label: 'Serverless Handler', tier: 'BACKEND', technology: 'Node.js Lambda', costEstimate: 15 },
                    },
                    {
                        id: 'n-s4',
                        type: 'architectureNode',
                        position: { x: 920, y: 150 },
                        data: { label: 'DynamoDB NoSQL', tier: 'DATABASE', technology: 'Amazon DynamoDB', costEstimate: 35 },
                    },
                ],
                edges: [
                    { id: 'es1', source: 'n-s1', target: 'n-s2', label: 'HTTPS', animated: true },
                    { id: 'es2', source: 'n-s2', target: 'n-s3', label: 'Invoke', animated: true },
                    { id: 'es3', source: 'n-s3', target: 'n-s4', label: 'AWS SDK Read/Write' },
                ],
                isOfficial: true,
            },
        ],
    });
}
