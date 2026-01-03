const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function parseArgs() {
  const argv = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const without = arg.replace(/^--/, '');
    if (without.includes('=')) {
      const [k, v] = without.split('=');
      out[k] = v;
    } else {
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        out[without] = next;
        i++;
      } else {
        out[without] = true;
      }
    }
  }
  return out;
} 

async function main() {
  const args = parseArgs();
  // Default admin email and password for automated seed
  const email = args.email || process.env.ADMIN_EMAIL || 'admin@demo.com';
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

let exitCode = 0;
main()
  .catch((e) => {
    console.error(e);
    exitCode = 1;
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch (err) {
      console.error('Error disconnecting prisma', err);
    }
    // Ensure process exits to avoid hanging containers
    process.exit(exitCode);
  });
