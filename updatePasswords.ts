import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function actualizarContraseñas() {
  const usuarios = await prisma.user.findMany(); // Obtener todos los usuarios

  for (const usuario of usuarios) {
    // Verificar si la contraseña ya está encriptada (bcrypt genera cadenas que empiezan con "$2b$")
    if (!usuario.password.startsWith('$2b$')) {
      const hashedPassword = await bcrypt.hash(usuario.password, 10);

      await prisma.user.update({
        where: { id: usuario.id },
        data: { password: hashedPassword },
      });

      console.log(`✅ Contraseña de ${usuario.email} actualizada`);
    } else {
      console.log(`⚠️ ${usuario.email} ya tiene contraseña encriptada`);
    }
  }
}

actualizarContraseñas()
  .then(() => {
    console.log('🔄 Todas las contraseñas han sido actualizadas.');
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error('❌ Error al actualizar contraseñas:', error);
    prisma.$disconnect();
  });
