import { PrismaClient, Personaje } from "@prisma/client";
const prisma = new PrismaClient();

export const createPersonajeSrv = async ({
  id,
  foto,
  nombre
}: Personaje) => {
  if (!nombre) {
    return { error: "Es requerido" }
  }
  const response = await prisma.personaje.create({
    data: {
      nombre,
      foto
    }
  });

  return response;
};

export const getListaPersonajeSrv = async () => {
  const response = await prisma.personaje.findMany();
  return response;
};


export const getPersonajeSrv = async (id: number) => {
  const response = await prisma.personaje.findFirst({
    where: {
      id
    }
  });
  if (!response) {
    return 405
  }
  return response;
};

export const deletePersonajeSrv = async (id: number) => {
  //Hard delete
  const response = await prisma.personaje.delete({
    where: {
      id
    }
  });
  //soft delete
  // const response = await prisma.personaje.update({
  //   where: {
  //     id
  //   },
  //   data: {
  //     flag: false
  //   }
  // });
  return response;
};

export const updatePersonajeSrv = async ({
  id,
  nombre,
  foto
}: Personaje) => {
  if (!nombre) {
    return { error: "Es requerido" }
  }
  const response = await prisma.personaje.update({
    where: {
      id
    },
    data: {
      nombre, foto
    }
  });

  return response;
};

