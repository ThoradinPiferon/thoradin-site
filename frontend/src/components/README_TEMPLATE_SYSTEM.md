# Grid Page Template System

## 🎯 **Overview**

The Grid Page Template System makes it easy to create new grid-based pages with consistent styling and behavior. Instead of copying and modifying entire components, you can now create pages by configuring a template.

## 🚀 **Quick Start**

### **Creating a New Page (30 seconds):**

```javascript
import React from 'react';
import GridPageTemplate from './GridPageTemplate';
import { createBackButton, createTitle, createWindow } from '../utils/gridElements';

const MyNewPage = () => {
  const backButton = createBackButton(() => window.location.href = '/');
  const title = createTitle("MY NEW PAGE");
  const content = createWindow(<div>Your content here</div>, 2, 2, 7, 4);

  return (
    <GridPageTemplate
      uiElements={[backButton, title, content]}
      pageName="My New Page"
    />
  );
};
```

## 📋 **Available Components**

### **Grid Elements (`gridElements.js`)**

#### **Basic Elements:**
- `createBackButton(onClick, style)` - Home button
- `createTitle(text, col, row, spanCols)` - Page title
- `createStatusIndicator(status, col, row)` - Connection status
- `createWindow(content, col, row, spanCols, spanRows, title)` - Content window
- `createInputBox(ref, value, onChange, onSubmit, placeholder, disabled, col, row, spanCols)` - Input field

#### **Interactive Elements:**
- `createGridAction(gridIndex, handler, description)` - Grid click handler
- `createLoadingSpinner(text)` - Loading indicator

#### **Grid Configurations:**
- `gridConfigs.standard` - 11x7 grid
- `gridConfigs.wide` - 15x7 grid
- `gridConfigs.tall` - 11x10 grid
- `gridConfigs.large` - 15x10 grid

## 🎨 **Template Configuration**

### **GridPageTemplate Props:**

```javascript
<GridPageTemplate
  gridCols={11}                    // Number of columns
  gridRows={7}                     // Number of rows
  uiElements={[...]}               // Array of UI components
  interactiveElements={[...]}      // Array of interactive elements
  gridActions={[...]}              // Array of grid click handlers
  backgroundComponent={<Component/>} // Background component
  pageName="Page Name"             // Page name for logging
/>
```

## 📝 **Examples**

### **1. Simple Info Page:**
```javascript
const InfoPage = () => {
  const backButton = createBackButton(() => window.location.href = '/');
  const title = createTitle("INFORMATION");
  const content = createWindow(
    <div>
      <h3>Welcome!</h3>
      <p>This is a simple information page.</p>
    </div>, 
    2, 2, 7, 4, "Info"
  );

  return (
    <GridPageTemplate
      uiElements={[backButton, title, content]}
      pageName="Information Page"
    />
  );
};
```

### **2. Interactive Page:**
```javascript
const InteractivePage = () => {
  const handleGridClick = (col, row) => {
    alert(`Clicked G${col}.${row}!`);
  };

  const gridActions = new Array(11 * 7).fill(null);
  gridActions[49] = createGridAction(49, handleGridClick, "Example action"); // G5.5

  return (
    <GridPageTemplate
      gridActions={gridActions}
      pageName="Interactive Page"
    />
  );
};
```

### **3. Chat Interface (like Vault):**
```javascript
const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const backButton = createBackButton(() => window.location.href = '/');
  const title = createTitle("CHAT INTERFACE");
  const statusIndicator = createStatusIndicator('connected');
  
  const chatContent = createWindow(
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>, 
    5, 1, 3, 4
  );

  const inputBox = createInputBox(
    inputRef,
    inputValue,
    setInputValue,
    handleSubmit,
    "Type your message..."
  );

  return (
    <GridPageTemplate
      uiElements={[backButton, title, statusIndicator, chatContent, inputBox]}
      pageName="Chat Interface"
    />
  );
};
```

## 🔧 **Customization**

### **Custom Styles:**
```javascript
import { buttonStyles } from '../utils/gridElements';

const customButton = createBackButton(
  handleClick, 
  { ...buttonStyles.primary, backgroundColor: 'rgba(255, 0, 255, 0.8)' }
);
```

### **Custom Grid Actions:**
```javascript
const gridActions = new Array(11 * 7).fill(null);

// Make G3.3 interactive
gridActions[24] = createGridAction(24, (col, row) => {
  console.log(`Special action at G${col}.${row}`);
}, "Special action");

// Make G7.5 interactive
gridActions[60] = createGridAction(60, (col, row) => {
  window.location.href = '/another-page';
}, "Navigate to another page");
```

## 🎯 **Benefits**

1. **Consistency** - All pages use the same grid system
2. **Reusability** - Common elements are shared
3. **Maintainability** - Changes to styling affect all pages
4. **Speed** - Create new pages in minutes, not hours
5. **Flexibility** - Easy to customize individual pages

## 📚 **Migration Guide**

### **From Old System to Template:**

**Before:**
```javascript
// 200+ lines of custom component
const OldPage = () => {
  // Lots of repetitive code...
  return <GridPlay {...props} />;
};
```

**After:**
```javascript
// 20 lines using template
const NewPage = () => {
  const elements = [
    createBackButton(handleBack),
    createTitle("PAGE TITLE"),
    createWindow(content, 2, 2, 7, 4)
  ];
  
  return <GridPageTemplate uiElements={elements} />;
};
```

## 🚀 **Next Steps**

1. **Create new pages** using the template system
2. **Migrate existing pages** to use the template
3. **Add new grid elements** to `gridElements.js` as needed
4. **Customize styles** by modifying the utility functions

---

**The template system makes page creation fast, consistent, and maintainable!** 🎉 