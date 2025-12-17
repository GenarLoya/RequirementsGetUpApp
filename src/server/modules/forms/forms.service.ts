import { FormsRepository } from './forms.repository';
import { CreateFormDto, UpdateFormDto } from './dto';
import { NotFoundException } from '../../common/exceptions';

export class FormsService {
  constructor(private formsRepository: FormsRepository) {}

  async getUserForms(userId: string) {
    return this.formsRepository.findByUserId(userId);
  }

  async createForm(userId: string, data: CreateFormDto) {
    return this.formsRepository.create({ ...data, user: { connect: { id: userId } } });
  }

  async getFormById(id: string) {
    const form = await this.formsRepository.findById(id);
    
    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    
    return form;
  }

  async updateForm(id: string, data: UpdateFormDto) {
    await this.getFormById(id);
    return this.formsRepository.update(id, data);
  }

  async deleteForm(id: string) {
    await this.getFormById(id);
    return this.formsRepository.delete(id);
  }
}
