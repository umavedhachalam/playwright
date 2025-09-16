import { Page, Locator } from '@playwright/test';

export interface DiscoveredElement {
  selector: string;
  confidence: number;
  attributes: Record<string, string>;
  textContent?: string;
  tagName: string;
  isVisible: boolean;
  isEnabled: boolean;
}

export interface ElementDiscoveryConfig {
  maxElements?: number;
  includeHidden?: boolean;
  confidenceThreshold?: number;
  attributePriority?: string[];
}

export class ElementDiscovery {
  private page: Page;
  private config: ElementDiscoveryConfig;

  constructor(page: Page, config: ElementDiscoveryConfig = {}) {
    this.page = page;
    this.config = {
      maxElements: 50,
      includeHidden: false,
      confidenceThreshold: 0.5,
      attributePriority: ['data-testid', 'id', 'name', 'class', 'placeholder', 'aria-label'],
      ...config
    };
  }

  async discoverElementsByText(searchText: string): Promise<DiscoveredElement[]> {
    console.log(`[ElementDiscovery] Discovering elements containing text: "${searchText}"`);
    
    const elements: DiscoveredElement[] = [];
    
    try {
      // Find all elements containing the search text
      const locators = await this.page.locator(`:has-text("${searchText}")`).all();
      
      for (const locator of locators.slice(0, this.config.maxElements)) {
        try {
          const element = await this.analyzeElement(locator, searchText);
          if (element.confidence >= this.config.confidenceThreshold!) {
            elements.push(element);
          }
        } catch (error) {
          console.log(`[ElementDiscovery] Error analyzing element: ${error}`);
        }
      }
      
      // Sort by confidence
      elements.sort((a, b) => b.confidence - a.confidence);
      
      console.log(`[ElementDiscovery] Found ${elements.length} elements with confidence >= ${this.config.confidenceThreshold}`);
      
    } catch (error) {
      console.error(`[ElementDiscovery] Error discovering elements: ${error}`);
    }
    
    return elements;
  }

  async discoverElementsByRole(role: string): Promise<DiscoveredElement[]> {
    console.log(`[ElementDiscovery] Discovering elements with role: "${role}"`);
    
    const elements: DiscoveredElement[] = [];
    
    try {
      const locators = await this.page.locator(`[role="${role}"]`).all();
      
      for (const locator of locators.slice(0, this.config.maxElements)) {
        try {
          const element = await this.analyzeElement(locator, role);
          elements.push(element);
        } catch (error) {
          console.log(`[ElementDiscovery] Error analyzing element: ${error}`);
        }
      }
      
      elements.sort((a, b) => b.confidence - a.confidence);
      
    } catch (error) {
      console.error(`[ElementDiscovery] Error discovering elements by role: ${error}`);
    }
    
    return elements;
  }

  async discoverFormElements(): Promise<{
    inputs: DiscoveredElement[];
    buttons: DiscoveredElement[];
    selects: DiscoveredElement[];
    textareas: DiscoveredElement[];
  }> {
    console.log('[ElementDiscovery] Discovering form elements');
    
    const result = {
      inputs: [] as DiscoveredElement[],
      buttons: [] as DiscoveredElement[],
      selects: [] as DiscoveredElement[],
      textareas: [] as DiscoveredElement[]
    };
    
    try {
      // Discover input elements
      const inputLocators = await this.page.locator('input').all();
      for (const locator of inputLocators) {
        const element = await this.analyzeElement(locator, 'input');
        result.inputs.push(element);
      }
      
      // Discover button elements
      const buttonLocators = await this.page.locator('button').all();
      for (const locator of buttonLocators) {
        const element = await this.analyzeElement(locator, 'button');
        result.buttons.push(element);
      }
      
      // Discover select elements
      const selectLocators = await this.page.locator('select').all();
      for (const locator of selectLocators) {
        const element = await this.analyzeElement(locator, 'select');
        result.selects.push(element);
      }
      
      // Discover textarea elements
      const textareaLocators = await this.page.locator('textarea').all();
      for (const locator of textareaLocators) {
        const element = await this.analyzeElement(locator, 'textarea');
        result.textareas.push(element);
      }
      
      // Sort each category by confidence
      result.inputs.sort((a, b) => b.confidence - a.confidence);
      result.buttons.sort((a, b) => b.confidence - a.confidence);
      result.selects.sort((a, b) => b.confidence - a.confidence);
      result.textareas.sort((a, b) => b.confidence - a.confidence);
      
      console.log(`[ElementDiscovery] Found ${result.inputs.length} inputs, ${result.buttons.length} buttons, ${result.selects.length} selects, ${result.textareas.length} textareas`);
      
    } catch (error) {
      console.error(`[ElementDiscovery] Error discovering form elements: ${error}`);
    }
    
    return result;
  }

  private async analyzeElement(locator: Locator, searchContext: string): Promise<DiscoveredElement> {
    const element = await locator.elementHandle();
    if (!element) {
      throw new Error('Element not found');
    }
    
    // Get basic element information
    const tagName = await element.evaluate(el => el.tagName.toLowerCase());
    const textContent = await element.evaluate(el => el.textContent?.trim() || '');
    const isVisible = await element.isVisible();
    const isEnabled = await element.isEnabled();
    
    // Get all attributes
    const attributes = await element.evaluate(el => {
      const attrs: Record<string, string> = {};
      for (const attr of el.attributes) {
        attrs[attr.name] = attr.value;
      }
      return attrs;
    });
    
    // Generate selector
    const selector = await this.generateSelector(element, attributes);
    
    // Calculate confidence based on various factors
    const confidence = this.calculateConfidence(attributes, textContent, searchContext, tagName);
    
    return {
      selector,
      confidence,
      attributes,
      textContent: textContent || undefined,
      tagName,
      isVisible,
      isEnabled
    };
  }

  private async generateSelector(element: any, attributes: Record<string, string>): Promise<string> {
    // Try to generate the most specific selector possible
    const selectors: string[] = [];
    
    // Priority order for selector generation
    const priority = this.config.attributePriority!;
    
    for (const attr of priority) {
      if (attributes[attr]) {
        const value = attributes[attr];
        if (attr === 'class') {
          // For class, use the first class name
          const firstClass = value.split(' ')[0];
          if (firstClass) {
            selectors.push(`${element.tagName}.${firstClass}`);
          }
        } else {
          selectors.push(`${element.tagName}[${attr}="${value}"]`);
        }
        break; // Use the first available high-priority attribute
      }
    }
    
    // Fallback to tag name with text content
    if (selectors.length === 0 && attributes.textContent) {
      selectors.push(`${element.tagName}:has-text("${attributes.textContent}")`);
    }
    
    // Final fallback to tag name
    if (selectors.length === 0) {
      selectors.push(element.tagName);
    }
    
    return selectors[0];
  }

  private calculateConfidence(
    attributes: Record<string, string>,
    textContent: string,
    searchContext: string,
    tagName: string
  ): number {
    let confidence = 0.1; // Base confidence
    
    // Boost confidence for specific attributes
    if (attributes['data-testid']) confidence += 0.4;
    if (attributes['id']) confidence += 0.3;
    if (attributes['name']) confidence += 0.2;
    if (attributes['class']) confidence += 0.1;
    
    // Boost confidence for text content match
    if (textContent && textContent.toLowerCase().includes(searchContext.toLowerCase())) {
      confidence += 0.3;
    }
    
    // Boost confidence for semantic attributes
    if (attributes['role']) confidence += 0.2;
    if (attributes['aria-label']) confidence += 0.2;
    if (attributes['placeholder']) confidence += 0.1;
    
    // Boost confidence for form-related elements
    if (['input', 'button', 'select', 'textarea'].includes(tagName)) {
      confidence += 0.1;
    }
    
    // Cap confidence at 1.0
    return Math.min(confidence, 1.0);
  }

  async learnFromPage(): Promise<{
    allElements: DiscoveredElement[];
    formElements: any;
    commonPatterns: string[];
  }> {
    console.log('[ElementDiscovery] Learning from current page');
    
    const allElements: DiscoveredElement[] = [];
    const formElements = await this.discoverFormElements();
    const commonPatterns: string[] = [];
    
    // Collect all form elements
    allElements.push(...formElements.inputs);
    allElements.push(...formElements.buttons);
    allElements.push(...formElements.selects);
    allElements.push(...formElements.textareas);
    
    // Discover common patterns
    const patterns = await this.discoverCommonPatterns();
    commonPatterns.push(...patterns);
    
    console.log(`[ElementDiscovery] Learning complete: ${allElements.length} elements, ${commonPatterns.length} patterns`);
    
    return {
      allElements,
      formElements,
      commonPatterns
    };
  }

  private async discoverCommonPatterns(): Promise<string[]> {
    const patterns: string[] = [];
    
    try {
      // Look for common CSS class patterns
      const classPatterns = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const classes = new Set<string>();
        
        elements.forEach(el => {
          if (el.className && typeof el.className === 'string') {
            el.className.split(' ').forEach(cls => {
              if (cls.length > 0) {
                classes.add(cls);
              }
            });
          }
        });
        
        return Array.from(classes);
      });
      
      // Look for common data attributes
      const dataAttributes = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const attrs = new Set<string>();
        
        elements.forEach(el => {
          Array.from(el.attributes).forEach(attr => {
            if (attr.name.startsWith('data-')) {
              attrs.add(attr.name);
            }
          });
        });
        
        return Array.from(attrs);
      });
      
      patterns.push(...classPatterns.slice(0, 10)); // Top 10 class patterns
      patterns.push(...dataAttributes.slice(0, 10)); // Top 10 data attributes
      
    } catch (error) {
      console.error(`[ElementDiscovery] Error discovering patterns: ${error}`);
    }
    
    return patterns;
  }
}
