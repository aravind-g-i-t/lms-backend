import { AddCategoryUseCase } from "@application/useCases/category/AddCategory";
import { GetCategoriesUseCase } from "@application/useCases/category/GetCategories";
import { GetCategoryOptionsUseCase } from "@application/useCases/category/GetCategoryOptions";
import { UpdateCategoryUseCase } from "@application/useCases/category/UpdateCategory";
import { UpdateCategoryStatusUseCase } from "@application/useCases/category/UpdateStatus";
import { CategoryRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/CategoryRepository";
import { CategoryController } from "@presentation/controllers/CategoryController";

const categoryRepository=new CategoryRepositoryImpl()

const addCategoryUseCase= new AddCategoryUseCase(categoryRepository);

const getCategoriesUseCase= new GetCategoriesUseCase(categoryRepository);

const updateCategoryUseCase= new UpdateCategoryUseCase(categoryRepository);

const getCategoryOptionsUseCase=new GetCategoryOptionsUseCase(categoryRepository)

const updateCategoryStatusUseCase = new UpdateCategoryStatusUseCase(categoryRepository);

export const categoryController=new CategoryController(addCategoryUseCase,getCategoriesUseCase,updateCategoryUseCase,updateCategoryStatusUseCase,getCategoryOptionsUseCase);