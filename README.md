```markdown
# Saladaze - Healthy Food Ordering System 🥗

![Saladaze](https://img.shields.io/badge/Saladaze-Healthy%20Food%20Ordering-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

A modern, responsive web application for ordering healthy food items like salads, bowls, and nutritious meals. Built with a skincare-inspired design aesthetic for a clean, refreshing user experience.

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 📋 Project Overview

Saladaze is a responsive web application featuring:

### ✨ Key Features
- **Modern Menu Browsing** - Browse food items with high-quality images and detailed descriptions
- **Smart Categories** - Organized by Salads, Bowls, Drinks, and more
- **Interactive Shopping Cart** - Add/remove items with smooth animations
- **Order Tracking** - Real-time order status updates
- **User Profiles** - Personalized account management
- **Skincare-Inspired UI** - Clean, minimal, and refreshing interface

### 🎨 Design System
- **Primary Colors**: Green theme (#2d5a27, #4caf50, #1b5e20)
- **Typography**: Segoe UI font family
- **Layout**: CSS Grid & Flexbox responsive design
- **Animations**: CSS transitions and hover effects

### 🛠️ Technology Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Styling**: CSS Modules with custom properties
- **Icons**: Font Awesome
- **State Management**: React Context API

## 📁 Project Structure

```
saladaze/
├── css/
│   ├── admin.css              
│   ├── auth.css
│   ├── customer.css          
│   ├── login.css           
│   ├── staff.css
│   └── style.css     
├── data/
│   ├── menu.json                   
│   ├── orders.json                 
│   └── users.json                 
├── images/                   
├── js/
│   ├── admin.js               
│   ├── auth.js
│   ├── customer.js
│   ├── forgotpass.js
│   ├── login.js
│   ├── main.js
│   ├── register.js
│   ├── shared.js
│   └── staff.js
├── admin.html
├── customer.html
├── debug.html
├── forgotpass.html
├── index.html
├── login.html
├── register.html
├── shared.html
└── staff.html
```

## 🎯 Pages & Features

### Customer Interface (`/customer`)
- **Menu Categories**: Salad Bowls, Healthy Drinks, Snacks, Combos
- **Product Cards**: Image, description, rating, price, and add-to-cart
- **Shopping Cart**: Quantity controls, price calculation, checkout
- **User Profile**: Account management and order history
- **Responsive Design**: Mobile-first approach

### Key Components
- `MenuGrid` - Display menu items in responsive grid
- `ProductCard` - Individual product display with add-to-cart
- `ShoppingCart` - Cart management with quantity controls
- `CategoryTabs` - Navigation between food categories
- `UserProfile` - Customer account management

## 🎨 Styling & Theming

The application uses a custom CSS design system with:

```css
:root {
  --primary: #2d5a27;
  --primary-light: #4caf50;
  --primary-dark: #1b5e20;
  --secondary: #ff9800;
  --text: #333333;
  --background: #f8f9fa;
  --white: #ffffff;
}
```

## 📱 Responsive Design

- **Desktop**: Full-featured grid layout
- **Tablet**: Adaptive grid columns
- **Mobile**: Single column with optimized touch targets

## 🔧 Development

### Adding New Menu Items
Update the menu data structure and ensure proper category mapping.

### Customizing Styles
Modify CSS custom properties in `globals.css` for theme changes.

### Adding Features
Follow React best practices and maintain the component structure.

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is licensed under the MIT License.
