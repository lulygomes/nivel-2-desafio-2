import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoryRepository extends Repository<Category> {
  public async verifyAndCreateCategory(category: string): Promise<string> {
    const existCategory = await this.findOne({
      where: { title: category },
    });

    if (existCategory) {
      return existCategory.id;
    }

    const newCategory = this.create({ title: category });
    await this.save(newCategory);

    return newCategory.id;
  }
}

export default CategoryRepository;
