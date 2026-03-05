#!/bin/bash
# Run this anytime DB gets wiped: bash reset-users.sh
cd "$(dirname "$0")"
node -e "
const { PrismaClient } = require('./node_modules/@prisma/client');
const bcrypt = require('./node_modules/bcrypt');
const prisma = new PrismaClient();
async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  const users = [
    { username: 'admin', email: 'admin@gridvision.local', role: 'admin', name: 'Admin' },
    { username: 'operator', email: 'operator@gridvision.local', role: 'operator', name: 'Operator' },
    { username: 'viewer', email: 'viewer@gridvision.local', role: 'viewer', name: 'Viewer' },
  ];
  for (const u of users) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: { passwordHash: hash },
      create: { username: u.username, email: u.email, passwordHash: hash, role: u.role, isActive: true, name: u.name }
    });
    console.log('OK:', u.username);
  }
  await prisma.\$disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
"
echo "Done — login with admin/admin123"
