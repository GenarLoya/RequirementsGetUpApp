import { prisma } from '../../config/database.config';
import { CreateQuestionDto, UpdateQuestionDto } from './dto';

export class QuestionsRepository {
  // Get all questions for a form (ordered)
  async findByFormId(formId: string) {
    return prisma.question.findMany({
      where: { formId },
      orderBy: { order: 'asc' },
    });
  }

  // Get a specific question
  async findById(id: string) {
    return prisma.question.findUnique({
      where: { id },
    });
  }

  // Get the maximum order number for a form
  async getMaxOrder(formId: string): Promise<number> {
    const result = await prisma.question.aggregate({
      where: { formId },
      _max: { order: true },
    });
    return result._max.order ?? -1;
  }

  // Create a question
  async create(formId: string, data: CreateQuestionDto & { order: number }) {
    return prisma.question.create({
      data: {
        ...data,
        formId,
        options: data.options ? (data.options as any) : null,
      },
    });
  }

  // Update a question
  async update(id: string, data: UpdateQuestionDto) {
    return prisma.question.update({
      where: { id },
      data: {
        ...data,
        options: data.options !== undefined ? (data.options as any) : undefined,
      },
    });
  }

  // Delete a question
  async delete(id: string) {
    return prisma.question.delete({
      where: { id },
    });
  }

  // Bulk update question orders (for reordering)
  async updateMany(updates: Array<{ id: string; order: number }>) {
    const promises = updates.map(({ id, order }) =>
      prisma.question.update({
        where: { id },
        data: { order },
      })
    );
    return prisma.$transaction(promises);
  }
}
