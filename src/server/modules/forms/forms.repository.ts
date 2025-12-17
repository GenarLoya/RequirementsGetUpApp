import { prisma } from '../../config/database.config';

export class FormsRepository {
  async findByUserId(userId: string) {
    return prisma.form.findMany({
      where: { userId },
      include: { questions: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    return prisma.form.create({ data });
  }

  async findById(id: string) {
    return prisma.form.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
  }

  async update(id: string, data: any) {
    return prisma.form.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.form.delete({
      where: { id },
    });
  }
}
