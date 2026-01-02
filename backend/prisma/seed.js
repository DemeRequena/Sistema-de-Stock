const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function parseArgs() {
  const argv = process.argv.slice(2);
  const out = {};
  argv.forEach((arg) => {
    if (arg.startsWith('--')) {
      const without = arg.replace(/^--/, '');
      const [k, v] = without.split('=');
      out[k] = v === undefined ? true : v;
    }
  });
  return out;
}

async function main() {
  const args = parseArgs();
  const email = args.email || process.env.ADMIN_EMAIL || 'admin@local';
  const password = args.password || process.env.ADMIN_PASS || '123456';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: 'ADMIN',
    },
  });
  console.log(`Created admin user ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
