import * as fs from 'fs-extra';
import * as path from 'path';
import * as handlebars from 'handlebars';

// Функция загрузки и компиляции шаблонов
export async function loadTemplate(
  templateName: string,
  data: any,
): Promise<string> {
  try {
    const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    const templateFile = await fs.readFile(filePath, 'utf8');
    const template = handlebars.compile(templateFile);
    return template(data);
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    throw new Error(`Could not load template ${templateName}`);
  }
}

// Функция проверки шаблонов
export async function validateEmailTemplate(
  templateName: string,
): Promise<void> {
  try {
    const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    await fs.access(filePath);
  } catch (error) {
    console.error(`Error validating template ${templateName}:`, error);
    throw new Error(
      `Template ${templateName} does not exist, or is not accessible from it's root directory`,
    );
  }
}
