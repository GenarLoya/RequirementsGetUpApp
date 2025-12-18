import { Request, Response } from 'express';
import { QuestionsService } from './questions.service';
import { BadRequestException } from '../../common/exceptions';
import { createQuestionSchema, updateQuestionSchema, reorderQuestionsSchema } from './dto';

export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  // Get all questions for a form
  findAll = async (req: Request, res: Response) => {
    const { formId } = req.params;
    const userId = (req as any).user.id;
    
    const questions = await this.questionsService.getFormQuestions(formId, userId);
    res.json(questions);
  };

  // Get a specific question
  findOne = async (req: Request, res: Response) => {
    const { formId, id } = req.params;
    const userId = (req as any).user.id;
    
    const question = await this.questionsService.getQuestionById(formId, id, userId);
    res.json(question);
  };

  // Create a question
  create = async (req: Request, res: Response) => {
    const { formId } = req.params;
    const userId = (req as any).user.id;
    
    const result = createQuestionSchema.safeParse(req.body);
    if (!result.success) {
      throw new BadRequestException(result.error.issues[0].message);
    }
    
    const question = await this.questionsService.createQuestion(formId, userId, result.data);
    res.status(201).json(question);
  };

  // Update a question
  update = async (req: Request, res: Response) => {
    const { formId, id } = req.params;
    const userId = (req as any).user.id;
    
    const result = updateQuestionSchema.safeParse(req.body);
    if (!result.success) {
      throw new BadRequestException(result.error.issues[0].message);
    }
    
    const question = await this.questionsService.updateQuestion(formId, id, userId, result.data);
    res.json(question);
  };

  // Delete a question
  delete = async (req: Request, res: Response) => {
    const { formId, id } = req.params;
    const userId = (req as any).user.id;
    
    await this.questionsService.deleteQuestion(formId, id, userId);
    res.status(204).send();
  };

  // Reorder questions
  reorder = async (req: Request, res: Response) => {
    const { formId } = req.params;
    const userId = (req as any).user.id;
    
    const result = reorderQuestionsSchema.safeParse(req.body);
    if (!result.success) {
      throw new BadRequestException(result.error.issues[0].message);
    }
    
    const questions = await this.questionsService.reorderQuestions(formId, userId, result.data);
    res.json(questions);
  };
}
