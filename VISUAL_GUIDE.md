# Visual Guide & Design Reference

## Color Palette

### Primary Colors
```
Purple Main:        #A855F7 (rgb(168, 85, 247))
Purple Dark:        #9333EA (rgb(147, 51, 234))
Purple Darker:      #7E22CE (rgb(126, 34, 206))
```

### Neutral Colors
```
White:              #FFFFFF (rgb(255, 255, 255))
Gray 50:            #F9FAFB
Gray 100:           #F3F4F6
Gray 200:           #E5E7EB
Gray 300:           #D1D5DB
Gray 400:           #9CA3AF
Gray 600:           #4B5563
Gray 900:           #111827
```

### Status Colors
```
Success (Green):    #10B981 (rgb(16, 185, 129))
Error (Red):        #EF4444 (rgb(239, 68, 68))
Warning (Yellow):   #F59E0B (rgb(245, 158, 11))
Info (Blue):        #3B82F6 (rgb(59, 130, 246))
```

### Backgrounds
```
Light Gradient:     from-gray-50 to-gray-100
Purple Gradient:    from-purple-50 to-purple-100
```

## Typography

### Font Family
```
Primary:   -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
Secondary: ui-monospace, SFMono-Regular, Consolas, monospace
```

### Font Sizes & Weights

#### Headings
- H1: 30px (1.875rem), Bold (700)
- H2: 24px (1.5rem), Bold (700)
- H3: 20px (1.25rem), Semibold (600)
- H4: 18px (1.125rem), Semibold (600)

#### Body Text
- Body Regular: 16px (1rem), Regular (400)
- Body Medium: 16px (1rem), Medium (500)
- Small: 14px (0.875rem), Regular (400)
- XSmall: 12px (0.75rem), Regular (400)

## Component Examples

### Login Page Layout
```
┌─────────────────────────────────────┐
│                                     │
│      Gradient Background            │
│      (from-gray-50 to-gray-100)    │
│                                     │
│      ┌──────────────────────────┐  │
│      │  Login Form (White)      │  │
│      │ ┌──────────────────────┐ │  │
│      │ │ Title                │ │  │
│      │ │ Subtitle             │ │  │
│      │ │                      │ │  │
│      │ │ ┌──────────────────┐ │ │  │
│      │ │ │ Email Icon  [__] │ │ │  │
│      │ │ └──────────────────┘ │ │  │
│      │ │                      │ │  │
│      │ │ ┌──────────────────┐ │ │  │
│      │ │ │ Lock Icon   [__] │ │ │  │
│      │ │ └──────────────────┘ │ │  │
│      │ │                      │ │  │
│      │ │ [Login Button]       │ │  │
│      │ │                      │ │  │
│      │ │ Demo Credentials    │ │  │
│      │ └──────────────────────┘ │  │
│      └──────────────────────────────┘
│                                     │
└─────────────────────────────────────┘
```

### OTP Verification
```
┌──────────────────────────────┐
│ ← Back                       │
│ Enter OTP                    │
│ Sent to: user@email.com      │
│                              │
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ │
│ │8 │ │8 │ │8 │ │  │ │  │ │  │ │
│ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ │
│                              │
│ Didn't receive? [Resend 60s] │
│                              │
│ [Verify Button]              │
└──────────────────────────────┘
```

### Settings Page
```
┌──────────────────────────────────────┐
│ Settings                             │
│ Manage account settings              │
│                                      │
│ [Personal] [Password]                │
│ ─────────────────────────────────────│
│                                      │
│ ┌────────────────────────────────────┐
│ │ Profile Section                    │
│ │ ┌────┐  Name                       │
│ │ │████│  @admin              [Edit] │
│ │ └────┘                            │
│ └────────────────────────────────────┘
│                                      │
│ ┌─ Edit Mode ─────────────────────┐  │
│ │ First Name    [____________]     │  │
│ │ Last Name     [____________]     │  │
│ │ Email         [____________]     │  │
│ │ Phone         [____________]     │  │
│ │ Bio           [______________]   │  │
│ │                                  │  │
│ │ [Save] [Cancel]                 │  │
│ └──────────────────────────────────┘  │
└──────────────────────────────────────┘
```

## Button Styles

### Primary Button
```
Background:  Purple (#A855F7)
Hover:       Darker Purple (#9333EA)
Text:        White
Padding:     12px 24px
Border:      Rounded 8px
Font:        Medium (500), 16px
```

### Secondary Button (Outline)
```
Background:  Transparent
Border:      2px Gray (#E5E7EB)
Text:        Gray (#4B5563)
Hover:       Gray Background
Padding:     12px 24px
Border:      Rounded 8px
Font:        Medium (500), 16px
```

### Danger Button
```
Background:  Red (#EF4444)
Hover:       Darker Red
Text:        White
Padding:     12px 24px
Border:      Rounded 8px
Font:        Medium (500), 16px
```

## Input Fields

### Standard Input
```
┌─────────────────────────────┐
│ Label Text                  │
│ ┌───────────────────────────┐
│ │ 📧 placeholder       [🔍] │
│ └───────────────────────────┘
│ Helper text (if error)      │
```

### Input States

**Default:**
```
Border: Gray #E5E7EB
Background: White
Text: Gray #111827
```

**Focus:**
```
Border: Purple #A855F7
Ring: Purple #A855F7
Background: White
```

**Disabled:**
```
Border: Gray #D1D5DB
Background: Gray #F3F4F6
Text: Gray #9CA3AF
```

**Error:**
```
Border: Red #FCA5A5
Background: White
Icon: Red #DC2626
Message: Red #991B1B
```

## Modal/Dialog

### Delete Confirmation
```
┌────────────────────────────────┐
│ Delete User                    │
│ ┌──────────────────────────────┤
│ │ ⚠️  Are you sure?            │
│ │ This action cannot be undone │
│ │                              │
│ │ [Cancel]  [Delete]           │
│ └──────────────────────────────┘
```

### Error Alert
```
┌──────────────────────────────┐
│ ❌ Error Message             │
│ Your password must be at     │
│ least 6 characters long.     │
└──────────────────────────────┘
```

### Success Alert
```
┌──────────────────────────────┐
│ ✅ Success!                  │
│ Your changes have been saved │
└──────────────────────────────┘
```

## Icons Used

### Navigation & Common
- 📧 Mail (email fields)
- 🔒 Lock (password fields)
- 👁️ Eye (show password)
- 👁️‍🗨️ Eye-Off (hide password)
- ← ArrowLeft (back button)
- ⚙️ Settings
- 🚪 Logout

### Status & Feedback
- ✅ Check (success)
- ❌ AlertCircle (error)
- ⏳ Loader2 (loading)
- ⚠️ AlertTriangle (warning)
- ℹ️ Info (information)

### Actions
- ✏️ Edit
- 🗑️ Delete (trash)
- 👁️ View
- 📋 FileText
- ⭐ Star (rating)

## Spacing System

### Padding
```
xs: 0.5rem (8px)
sm: 1rem (16px)
md: 1.5rem (24px)
lg: 2rem (32px)
xl: 2.5rem (40px)
```

### Margins
Same as padding system above

### Gap (Flexbox)
```
xs: 0.5rem (8px)
sm: 1rem (16px)
md: 1.5rem (24px)
lg: 2rem (32px)
```

## Border Radius

```
sm: 0.375rem (6px)  - Small elements
md: 0.5rem (8px)    - Input fields
lg: 0.75rem (12px)  - Cards, modals
xl: 1rem (16px)     - Large panels
```

## Shadows

```
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 4px 6px rgba(0,0,0,0.1)
lg: 0 10px 15px rgba(0,0,0,0.1)
xl: 0 20px 25px rgba(0,0,0,0.1)
```

## Forms

### Form Groups
- Label (12px, medium)
- Input field
- Helper/error text (12px)
- Spacing between groups: 1.5rem

### Validation States
```
✓ Valid:    Green border, no message
✗ Invalid:  Red border, error message
⊙ Loading:  Disabled, spinner shown
```

## Tables

### Header
```
Background: Gray #F9FAFB
Text: Gray #6B7280, Bold
Padding: 12px 16px
Border-bottom: 1px #E5E7EB
```

### Rows
```
Background: White
Hover: Gray #F9FAFB
Border-bottom: 1px #E5E7EB
Padding: 16px
```

### Status Badge
```
Pending:  Yellow bg, Yellow text
Approved: Green bg, Green text
Rejected: Red bg, Red text
Edited:   Blue bg, Blue text
```

## Responsive Breakpoints

```
Mobile:    < 640px (default)
Tablet:    640px - 1024px
Desktop:   > 1024px
```

## Animation Timing

```
Fast:      150ms ease-in-out
Normal:    300ms ease-in-out
Slow:      500ms ease-in-out
```

## Accessibility

### Color Contrast
- ✓ WCAG AA: 4.5:1 for text
- ✓ WCAG AAA: 7:1 for text (headings)
- ✓ Non-text: 3:1 minimum

### Focus States
```
Focus Outline: 2px Purple #A855F7
Focus Offset: 2px
```

### Touch Targets
- Minimum: 44x44px
- Recommended: 48x48px

## CSS Variables (If Using)

```css
--color-primary: #A855F7
--color-primary-dark: #9333EA
--color-success: #10B981
--color-error: #EF4444
--color-warning: #F59E0B

--spacing-xs: 0.5rem
--spacing-sm: 1rem
--spacing-md: 1.5rem

--radius-sm: 0.375rem
--radius-md: 0.5rem
--radius-lg: 0.75rem
```

## Component State Examples

### Loading Button
```
[⏳ Loading...]  (disabled, grayed out)
```

### Disabled Input
```
┌──────────────────────────┐
│ [placeholder]            │ (grayed out)
└──────────────────────────┘
```

### Active Tab
```
Personal Information  [underline, purple]
```

## Dark Mode Support

If implementing dark mode:
```
Text:       Gray #111827 → White
Background: White → Gray #1F2937
Borders:    Gray #E5E7EB → Gray #374151
```

## Print Styles

- Hide navigation/sidebars
- Single column layout
- Black text on white
- Hide interactive elements
