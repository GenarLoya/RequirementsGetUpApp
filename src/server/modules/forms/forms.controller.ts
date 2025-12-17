import { Request, Response } from 'express';
import { FormsService } from './forms.service';
import { BadRequestException, ForbiddenException } from '../../common/exceptions';
import { createFormSchema, updateFormSchema } from './dto';

export class FormsController {
  constructor(private formsService: FormsService) {}

  findAll = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const forms = await this.formsService.getUserForms(userId);
    res.json(forms);
  };

  create = async (req: Request, res: Response) => {
    const result = createFormSchema.safeParse(req.body);
    
    if (!result.success) {
      throw new BadRequestException(result.error.issues[0].message);
    }
    
    const userId = (req as any).user.id;
    const form = await this.formsService.createForm(userId, result.data);
    
    res.status(201).json(form);
  };

  findOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const form = await this.formsService.getFormById(id);
    
    if (form.userId !== userId) {
      throw new ForbiddenException('You do not have access to this form');
    }
    
    res.json(form);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const result = updateFormSchema.safeParse(req.body);
    
    if (!result.success) {
      throw new BadRequestException(result.error.issues[0].message);
    }
    
    const form = await this.formsService.getFormById(id);
    
    if (form.userId !== userId) {
      throw new ForbiddenException('You do not have access to this form');
    }
    
    const updated = await this.formsService.updateForm(id, result.data);
    
    res.json(updated);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const form = await this.formsService.getFormById(id);
    
    if (form.userId !== userId) {
      throw new ForbiddenException('You do not have access to this form');
    }
    
    await this.formsService.deleteForm(id);
    
    res.status(204).send();
  };
}
