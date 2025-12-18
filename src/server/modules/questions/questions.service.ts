import { QuestionsRepository } from './questions.repository';
import { FormsRepository } from '../forms/forms.repository';
import { CreateQuestionDto, UpdateQuestionDto, ReorderQuestionsDto } from './dto';
import { NotFoundException, BadRequestException, ForbiddenException } from '../../common/exceptions';

export class QuestionsService {
  constructor(
    private questionsRepository: QuestionsRepository,
    private formsRepository: FormsRepository
  ) {}

  // Verify form exists and user owns it
  private async verifyFormOwnership(formId: string, userId: string) {
    const form = await this.formsRepository.findById(formId);
    
    if (!form) {
      throw new NotFoundException(`Form with ID ${formId} not found`);
    }
    
    if (form.userId !== userId) {
      throw new ForbiddenException('You do not have access to this form');
    }
    
    return form;
  }

  // Get all questions for a form
  async getFormQuestions(formId: string, userId: string) {
    await this.verifyFormOwnership(formId, userId);
    return this.questionsRepository.findByFormId(formId);
  }

  // Get a specific question
  async getQuestionById(formId: string, questionId: string, userId: string) {
    await this.verifyFormOwnership(formId, userId);
    
    const question = await this.questionsRepository.findById(questionId);
    
    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }
    
    if (question.formId !== formId) {
      throw new BadRequestException('Question does not belong to this form');
    }
    
    return question;
  }

  // Create a new question
  async createQuestion(formId: string, userId: string, data: CreateQuestionDto) {
    await this.verifyFormOwnership(formId, userId);
    
    // Get the next order number
    const maxOrder = await this.questionsRepository.getMaxOrder(formId);
    const order = maxOrder + 1;
    
    return this.questionsRepository.create(formId, { ...data, order });
  }

  // Update a question
  async updateQuestion(formId: string, questionId: string, userId: string, data: UpdateQuestionDto) {
    await this.getQuestionById(formId, questionId, userId);
    
    return this.questionsRepository.update(questionId, data);
  }

  // Delete a question
  async deleteQuestion(formId: string, questionId: string, userId: string) {
    await this.getQuestionById(formId, questionId, userId);
    
    await this.questionsRepository.delete(questionId);
  }

  // Reorder questions
  async reorderQuestions(formId: string, userId: string, data: ReorderQuestionsDto) {
    await this.verifyFormOwnership(formId, userId);
    
    // Verify all questions belong to this form
    const formQuestions = await this.questionsRepository.findByFormId(formId);
    const formQuestionIds = new Set(formQuestions.map(q => q.id));
    
    for (const { id } of data.questions) {
      if (!formQuestionIds.has(id)) {
        throw new BadRequestException(`Question with ID ${id} does not belong to this form`);
      }
    }
    
    // Update orders in a transaction
    await this.questionsRepository.updateMany(data.questions);
    
    // Return updated questions
    return this.questionsRepository.findByFormId(formId);
  }
}
