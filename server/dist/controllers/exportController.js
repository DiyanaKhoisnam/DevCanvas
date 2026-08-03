"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportTerraform = exports.exportMarkdownDocs = void 0;
const exportMarkdownDocs = async (req, res) => {
    try {
        const { title, description, nodes, edges } = req.body;
        if (!Array.isArray(nodes) || !Array.isArray(edges)) {
            res.status(400).json({ error: 'Invalid nodes or edges' });
            return;
        }
        const docTitle = title || 'Software Architecture Specification';
        let markdown = `# ${docTitle}\n\n`;
        if (description)
            markdown += `> ${description}\n\n`;
        markdown += `## System Overview\n`;
        markdown += `Total Components: **${nodes.length}**  \n`;
        markdown += `Total Connections: **${edges.length}**  \n\n`;
        markdown += `## Component Catalog\n\n`;
        markdown += `| Component Name | Tier | Technology | Host / Port | Monthly Cost | Description |\n`;
        markdown += `| --- | --- | --- | --- | --- | --- |\n`;
        nodes.forEach((n) => {
            const label = n.data.label || n.id;
            const tier = n.data.tier || 'BACKEND';
            const tech = n.data.technology || 'N/A';
            const host = `${n.data.host || 'localhost'}:${n.data.port || 80}`;
            const cost = n.data.costEstimate ? `$${n.data.costEstimate}` : 'N/A';
            const desc = n.data.description || 'N/A';
            markdown += `| **${label}** | \`${tier}\` | ${tech} | \`${host}\` | ${cost} | ${desc} |\n`;
        });
        markdown += `\n## Data Flow & Connections\n\n`;
        markdown += `| Source Component | Target Component | Protocol / Label | Status |\n`;
        markdown += `| --- | --- | --- | --- |\n`;
        const nodeMap = new Map();
        nodes.forEach((n) => nodeMap.set(n.id, n.data.label || n.id));
        edges.forEach((e) => {
            const srcName = nodeMap.get(e.source) || e.source;
            const tgtName = nodeMap.get(e.target) || e.target;
            const label = e.label || e.data?.protocol || 'HTTP';
            const status = e.animated ? 'Active Stream' : 'Standard Link';
            markdown += `| **${srcName}** | **${tgtName}** | \`${label}\` | ${status} |\n`;
        });
        markdown += `\n---\n*Generated automatically by DevCanvas Architecture Designer.*`;
        res.json({ markdown });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate markdown documentation' });
    }
};
exports.exportMarkdownDocs = exportMarkdownDocs;
const exportTerraform = async (req, res) => {
    try {
        const { title, nodes } = req.body;
        const docTitle = (title || 'DevCanvas_Infra').replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
        let terraform = `# Auto-generated Terraform (HCL) Configuration by DevCanvas\n`;
        terraform += `# Architecture: ${title || 'Software Architecture'}\n\n`;
        terraform += `terraform {\n  required_version = ">= 1.5.0"\n}\n\n`;
        nodes.forEach((n, idx) => {
            const cleanName = (n.data.label || `node_${idx}`).replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
            const tier = n.data.tier || 'BACKEND';
            if (tier === 'DATABASE') {
                terraform += `resource "aws_db_instance" "${cleanName}" {\n`;
                terraform += `  identifier           = "${cleanName}"\n`;
                terraform += `  allocated_storage    = 20\n`;
                terraform += `  engine               = "postgres"\n`;
                terraform += `  engine_version       = "16.1"\n`;
                terraform += `  instance_class       = "db.t3.micro"\n`;
                terraform += `  skip_final_snapshot  = true\n`;
                terraform += `}\n\n`;
            }
            else if (tier === 'CACHE') {
                terraform += `resource "aws_elasticache_cluster" "${cleanName}" {\n`;
                terraform += `  cluster_id           = "${cleanName}"\n`;
                terraform += `  engine               = "redis"\n`;
                terraform += `  node_type            = "cache.t3.micro"\n`;
                terraform += `  num_cache_nodes      = 1\n`;
                terraform += `}\n\n`;
            }
            else {
                terraform += `resource "aws_instance" "${cleanName}" {\n`;
                terraform += `  ami           = "ami-0c55b159cbfafe1f0"\n`;
                terraform += `  instance_type = "t3.micro"\n`;
                terraform += `  tags = {\n`;
                terraform += `    Name = "${n.data.label}"\n`;
                terraform += `    Tier = "${tier}"\n`;
                terraform += `  }\n`;
                terraform += `}\n\n`;
            }
        });
        res.json({ terraform, filename: `${docTitle}.tf` });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate Terraform HCL code' });
    }
};
exports.exportTerraform = exportTerraform;
