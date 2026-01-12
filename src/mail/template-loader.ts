import * as fs from 'fs-extra';
import * as path from 'path';
import * as handlebars from 'handlebars';

// Функция загрузки и компиляции шаблонов
export async function loadTemplate(
  templateName: string,
  data: any,
): Promise<string> {
  try {
    // Проверяем существует ли dist/src (скомпилированная версия)
    // Если __dirname содержит /dist/src, значит запущен из dist
    const isCompiledDist = __dirname.includes('/dist/src');
    
    const basePath = isCompiledDist
      ? path.join(__dirname, '../../mail/templates')
      : path.join(__dirname, 'templates');
    
    const filePath = path.join(basePath, `${templateName}.hbs`);
    const templateFile = await fs.readFile(filePath, 'utf8');
    const template = handlebars.compile(templateFile);
    return template(data);
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    console.error(`Current __dirname: ${__dirname}`);
    throw new Error(`Could not load template ${templateName}`);
  }
}

// Функция проверки шаблонов
export async function validateEmailTemplate(
  templateName: string,
): Promise<void> {
  try {
    // Проверяем существует ли dist/src (скомпилированная версия)
    // Если __dirname содержит /dist/src, значит запущен из dist
    const isCompiledDist = __dirname.includes('/dist/src');
    
    const basePath = isCompiledDist
      ? path.join(__dirname, '../../mail/templates')
      : path.join(__dirname, 'templates');
    
    const filePath = path.join(basePath, `${templateName}.hbs`);
    await fs.access(filePath);
  } catch (error) {
    console.error(`Error validating template ${templateName}:`, error);
    throw new Error(
      `Template ${templateName} does not exist, or is not accessible from it's root directory`,
    );
  }
}
