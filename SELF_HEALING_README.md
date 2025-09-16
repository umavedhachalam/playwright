# Self-Healing Playwright Tests

This implementation provides a comprehensive self-healing framework for Playwright tests that automatically adapts to UI changes and handles various failure scenarios gracefully.

## 🚀 Features

### 1. **Self-Healing Element Detection**
- **Multiple Selector Strategies**: Each element has multiple fallback selectors with priority ordering
- **Dynamic Element Discovery**: Automatically discovers elements using text, role, and attribute patterns
- **Confidence Scoring**: Ranks selectors by reliability and success probability
- **Adaptive Retry Logic**: Automatically retries with different strategies on failure

### 2. **Smart Wait Strategies**
- **Network-Aware Waiting**: Waits for network idle before proceeding
- **Element State Validation**: Ensures elements are visible, enabled, and actionable
- **Adaptive Timeouts**: Adjusts timeouts based on page load characteristics
- **Exponential Backoff**: Intelligent retry delays that increase over time

### 3. **Automatic Error Recovery**
- **Screenshot Capture**: Takes screenshots at failure points for debugging
- **Detailed Logging**: Comprehensive logging of all attempts and failures
- **Graceful Degradation**: Falls back to alternative approaches when primary methods fail
- **Context Preservation**: Maintains test context across retry attempts

### 4. **Element Learning & Discovery**
- **Page Structure Analysis**: Learns common patterns and element relationships
- **Attribute Priority System**: Ranks element attributes by reliability
- **Text-Based Discovery**: Finds elements by content and context
- **Role-Based Detection**: Identifies elements by ARIA roles and semantic meaning

## 📁 File Structure

```
playwright/
├── utils/
│   ├── self-healing.ts          # Core self-healing framework
│   └── element-discovery.ts     # Element discovery and learning
├── pages/
│   └── self-healing-login.ts    # Self-healing page object model
├── config/
│   └── self-healing.config.ts   # Configuration options
└── tests/
    ├── self-healing-login.spec.ts    # Self-healing login tests
    ├── self-healing-demo.spec.ts     # Demonstration tests
    └── login.spec.ts                 # Updated original tests
```

## 🛠️ Usage

### Basic Implementation

```typescript
import { SelfHealingLoginPage } from '../pages/self-healing-login';
import { getSelfHealingConfig } from '../config/self-healing.config';

test('self-healing login test', async ({ page }) => {
  const loginPage = new SelfHealingLoginPage(page, getSelfHealingConfig());
  
  await loginPage.navigateToLoginPage();
  const result = await loginPage.login('username', 'password');
  
  expect(result.success).toBeTruthy();
});
```

### Custom Configuration

```typescript
const customConfig = {
  maxRetries: 5,
  retryDelay: 1000,
  timeout: 15000,
  enableScreenshots: true,
  enableLogging: true
};

const loginPage = new SelfHealingLoginPage(page, customConfig);
```

### Element Discovery

```typescript
import { ElementDiscovery } from '../utils/element-discovery';

const discovery = new ElementDiscovery(page);
const elements = await discovery.discoverElementsByText('login');
const formElements = await discovery.discoverFormElements();
```

## 🔧 Configuration Options

### Self-Healing Config

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxRetries` | number | 3 | Maximum retry attempts |
| `retryDelay` | number | 1000 | Delay between retries (ms) |
| `timeout` | number | 10000 | Element timeout (ms) |
| `enableScreenshots` | boolean | true | Capture screenshots on failure |
| `enableLogging` | boolean | true | Enable detailed logging |

### Predefined Configurations

- **Default**: Balanced performance and reliability
- **Aggressive**: Maximum retries and detailed logging
- **Conservative**: Minimal retries for production
- **Performance**: Optimized for speed

## 🎯 Element Strategies

### Username Input Strategies
1. `[formcontrolname='empID']` (Priority 1)
2. `input[placeholder*='user']` (Priority 2)
3. `input[type='text']` (Priority 3)
4. `input[name*='user']` (Priority 4)
5. `input[id*='user']` (Priority 5)
6. `input:has(+ label:has-text('user'))` (Priority 6)

### Password Input Strategies
1. `[formcontrolname='password']` (Priority 1)
2. `input[type='password']` (Priority 2)
3. `input[placeholder*='password']` (Priority 3)
4. `input[name*='password']` (Priority 4)
5. `input[id*='password']` (Priority 5)

### Login Button Strategies
1. `button[type='submit']` (Priority 1)
2. `button:has-text('Login')` (Priority 2)
3. `.login-btn, .btn-login` (Priority 3)
4. `form button` (Priority 4)
5. `button` (Priority 5)

## 🔍 Element Discovery Features

### Text-Based Discovery
```typescript
const elements = await discovery.discoverElementsByText('login');
// Returns elements containing "login" with confidence scores
```

### Role-Based Discovery
```typescript
const buttons = await discovery.discoverElementsByRole('button');
// Returns all button elements with analysis
```

### Form Element Discovery
```typescript
const formElements = await discovery.discoverFormElements();
// Returns categorized form elements (inputs, buttons, selects, textareas)
```

## 📊 Confidence Scoring

Elements are scored based on:
- **Data attributes** (+0.4): `data-testid`, `data-cy`
- **ID attributes** (+0.3): `id="element-id"`
- **Name attributes** (+0.2): `name="field-name"`
- **Class attributes** (+0.1): `class="element-class"`
- **Text content match** (+0.3): Matching search context
- **Semantic attributes** (+0.2): `role`, `aria-label`
- **Form elements** (+0.1): `input`, `button`, `select`

## 🚨 Error Handling

### Automatic Recovery
- **Selector Failures**: Falls back to alternative selectors
- **Element Not Found**: Retries with different strategies
- **Timeout Issues**: Adjusts timeouts and retry delays
- **Network Problems**: Waits for network stability

### Debugging Support
- **Screenshot Capture**: Automatic screenshots at failure points
- **Detailed Logging**: Step-by-step execution logs
- **Context Preservation**: Maintains test state across retries
- **Error Classification**: Categorizes failure types

## 🧪 Testing the Implementation

### Run Self-Healing Tests
```bash
# Run all self-healing tests
npx playwright test self-healing

# Run specific test file
npx playwright test self-healing-login.spec.ts

# Run with specific configuration
NODE_ENV=development npx playwright test
```

### Demo Tests
The `self-healing-demo.spec.ts` file contains comprehensive examples demonstrating:
- Element discovery capabilities
- Different configuration options
- Retry mechanisms
- Error handling
- Page structure adaptation

## 🔄 Migration from Existing Tests

### Before (Traditional Approach)
```typescript
const usernameField = page.locator('input[type="text"]');
await usernameField.fill(username);
```

### After (Self-Healing Approach)
```typescript
const loginPage = new SelfHealingLoginPage(page);
await loginPage.usernameInput.fill(username);
```

## 📈 Benefits

1. **Reduced Maintenance**: Tests adapt to UI changes automatically
2. **Higher Reliability**: Multiple fallback strategies prevent flaky tests
3. **Better Debugging**: Comprehensive logging and screenshots
4. **Faster Development**: Less time spent fixing broken selectors
5. **Improved Coverage**: Discovers elements that might be missed
6. **Production Ready**: Handles real-world scenarios gracefully

## 🎛️ Advanced Features

### Custom Element Strategies
```typescript
const customStrategies = [
  { name: 'custom', selector: '[data-custom="value"]', priority: 1 },
  { name: 'fallback', selector: 'div.custom-element', priority: 2 }
];

const element = selfHealingPage.createElement(customStrategies, 'customElement');
```

### Dynamic Strategy Generation
```typescript
const strategies = createDynamicStrategies(
  ElementStrategies.genericButton,
  { text: 'Submit', class: 'btn-primary' }
);
```

### Learning from Page Structure
```typescript
const learning = await discovery.learnFromPage();
console.log('Common patterns:', learning.commonPatterns);
console.log('Form elements:', learning.formElements);
```

## 🔧 Troubleshooting

### Common Issues

1. **High Retry Count**: Increase `maxRetries` or check selector strategies
2. **Slow Tests**: Reduce `retryDelay` or disable screenshots
3. **Element Not Found**: Verify page structure and add more strategies
4. **Timeout Issues**: Increase `timeout` or check network conditions

### Debug Mode
Enable detailed logging by setting `enableLogging: true` in configuration.

### Screenshot Analysis
Screenshots are automatically saved to `test-results/` directory with descriptive names.

## 🚀 Future Enhancements

- **Machine Learning Integration**: Learn from successful patterns
- **Visual Regression Detection**: Compare element appearances
- **Performance Metrics**: Track healing success rates
- **Cross-Browser Adaptation**: Browser-specific strategies
- **API Integration**: Learn from backend changes

---

This self-healing framework transforms your Playwright tests from brittle, maintenance-heavy scripts into robust, adaptive automation that can handle real-world application changes gracefully.
